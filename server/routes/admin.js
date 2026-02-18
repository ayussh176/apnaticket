const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/authMiddleware');
const isAdmin = require('../middleware/isAdmin');
const bookings = require('../models/booking');
const { logs } = require('../models/auditLogs');

// GET /api/admin/bookings - Get all bookings
// GET /api/admin/bookings - Get all bookings
router.get('/bookings', verifyToken, isAdmin, (req, res, next) => {
    try {
        res.json(bookings);
    } catch (err) {
        next(err);
    }
});

// GET /api/admin/logs - Get all audit logs
// GET /api/admin/logs - Get all audit logs
router.get('/logs', verifyToken, isAdmin, (req, res, next) => {
    try {
        res.json(logs);
    } catch (err) {
        next(err);
    }
});

module.exports = router;
