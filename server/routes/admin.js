const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/authMiddleware');
const adminCheck = require('../middleware/adminCheck');
const bookings = require('../models/booking');
const { logs } = require('../models/auditLogs');

// GET /api/admin/bookings - Get all bookings
router.get('/bookings', verifyToken, adminCheck, (req, res) => {
    res.json(bookings);
});

// GET /api/admin/logs - Get all audit logs
router.get('/logs', verifyToken, adminCheck, (req, res) => {
    res.json(logs);
});

module.exports = router;
