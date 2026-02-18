const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/authMiddleware');
const validateBooking = require('../middleware/validateBooking'); // Rate limiter
const bookings = require('../models/booking'); // Fixed import
const wallet = require('../models/wallet');
const crypto = require('crypto');

const { bookingLimiter } = require('../middleware/security');

// POST /api/book - Create a new booking
router.post('/', verifyToken, bookingLimiter, validateBooking, (req, res, next) => {
    try {
        const { bookingType, journeyDate, passengerName, panOrAadhaar, role, guardianPan } = req.body;

        // 1. Validate ID based on role
        if (role !== 'minor') {
            // Major or undefined role -> Expect Valid PAN
            if (!/^[A-Z]{5}[0-9]{4}[A-Z]$/.test(panOrAadhaar)) {
                return res.status(400).json({ msg: '❌ Invalid PAN format' });
            }
        } else {
            // Minor -> Expect Aadhaar + Guardian PAN
            if (!/^\d{12}$/.test(panOrAadhaar)) {
                return res.status(400).json({ msg: '❌ Invalid Aadhaar number' });
            }
            if (!guardianPan || !/^[A-Z]{5}[0-9]{4}[A-Z]$/.test(guardianPan)) {
                return res.status(400).json({ msg: '❌ Guardian PAN is required and must be valid' });
            }
        }

        // 2. Booking Limit Check
        const userActiveBookings = bookings.filter(
            b => b.userEmail === req.user.email && b.status === 'confirmed'
        );

        if (userActiveBookings.length >= 2) {
            return res.status(403).json({ msg: 'Booking limit reached (2 per user)' });
        }

        // Check Limit: Max 2 per PAN per day
        const today = new Date().setHours(0, 0, 0, 0);
        const bookingsToday = bookings.filter(b => new Date(b.createdAt).setHours(0, 0, 0, 0) === today);

        const panBookingsToday = bookingsToday.filter(b => b.panOrAadhaar === panOrAadhaar && b.status === 'confirmed');
        if (panBookingsToday.length >= 2) {
            return res.status(403).json({ msg: 'Booking limit reached (Max 2 bookings per day for this ID)' });
        }

        // Check Limit: Max 2 per IP per day
        const ipBookingsToday = bookingsToday.filter(b => b.ip === req.ip && b.status === 'confirmed');
        if (ipBookingsToday.length >= 2) {
            return res.status(403).json({ msg: 'Booking limit reached (Max 2 bookings per day from this IP)' });
        }

        // 3. Wallet Check & Deduction
        if (!wallet[req.user.email]) {
            wallet[req.user.email] = 0;
        }

        if (wallet[req.user.email] < 50) {
            return res.status(402).json({ msg: '❌ Insufficient balance in E-Rupee wallet' });
        }

        wallet[req.user.email] -= 50; // Deduct amount

        // 4. Create Booking
        const newBooking = {
            id: crypto.randomUUID(),
            userEmail: req.user.email,
            bookingType,
            journeyDate,
            passengerName,
            panOrAadhaar,
            guardianPan: role === 'minor' ? guardianPan : null,
            status: 'confirmed',
            idVerified: true,
            createdAt: new Date(),
            ip: req.ip // Store IP for admin audit
        };

        bookings.push(newBooking);

        // Audit Log
        const { logAction } = require('../models/auditLogs');
        logAction(req.user.email, 'BOOKING_CREATED', { bookingId: newBooking.id, amount: 50, ip: req.ip });

        res.json({ msg: '✅ Booking confirmed! ₹50 deducted.', booking: newBooking });
    } catch (err) {
        next(err);
    }
});

// GET /api/book - Get user bookings
router.get('/', verifyToken, (req, res, next) => {
    try {
        const userBookings = bookings.filter(b => b.userEmail === req.user.email);
        res.json({ bookings: userBookings });
    } catch (err) {
        next(err);
    }
});

// DELETE /api/book/:id - Cancel a booking
router.delete('/:id', verifyToken, (req, res, next) => {
    try {
        const { id } = req.params;

        let bookingIndex;
        if (req.user.role === 'admin') {
            bookingIndex = bookings.findIndex(b => b.id === id);
        } else {
            bookingIndex = bookings.findIndex(b => b.id === id && b.userEmail === req.user.email);
        }

        if (bookingIndex === -1) {
            return res.status(404).json({ msg: 'Booking not found' });
        }

        // Check if already cancelled
        if (bookings[bookingIndex].status === 'cancelled') {
            return res.status(400).json({ msg: 'Booking is already cancelled' });
        }

        // Update status
        bookings[bookingIndex].status = 'cancelled';

        // Refund 50%? Or full? Let's implement full refund for now as it's simpler to test.
        // Requirement says "refund wallet? (Optional enhancement)". I'll adding 50 back.
        if (wallet[req.user.email] !== undefined) {
            wallet[req.user.email] += 50;
        }

        // Audit Log
        const { logAction } = require('../models/auditLogs');
        logAction(req.user.email, 'BOOKING_CANCELLED', { bookingId: id, refund: 50, ip: req.ip });

        res.json({ msg: '❌ Booking cancelled. ₹50 refunded.', booking: bookings[bookingIndex] });
    } catch (err) {
        next(err);
    }
});

module.exports = router;
