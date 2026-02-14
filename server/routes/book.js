const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/authMiddleware');
const bookings = require('../models/booking');

// GET all bookings for the logged-in user
router.get('/', verifyToken, (req, res) => {
    const userBookings = bookings.filter(b => b.userEmail === req.user.email);
    res.json({ bookings: userBookings });
});

// POST a new booking
router.post('/', verifyToken, (req, res) => {
    const { bookingType, journeyDate, passengerName, panOrAadhaar } = req.body;

    if (!bookingType || !journeyDate || !passengerName || !panOrAadhaar) {
        return res.status(400).json({ msg: 'All fields are required' });
    }

    // Check active booking limit
    const userActiveBookings = bookings.filter(
        b => b.userEmail === req.user.email && b.status === 'confirmed'
    );

    if (userActiveBookings.length >= 2) {
        return res.status(403).json({ msg: 'Booking limit reached (2 per user)' });
    }

    const newBooking = {
        userEmail: req.user.email,
        bookingType,
        journeyDate,
        passengerName,
        panOrAadhaar,
        status: 'confirmed',
        createdAt: new Date(),
    };

    bookings.push(newBooking); // Simulating DB save
    res.status(201).json({ msg: 'Booking confirmed', booking: newBooking });
});

module.exports = router;
