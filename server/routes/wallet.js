const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/authMiddleware');
const wallet = require('../models/wallet');

router.post('/recharge', verifyToken, (req, res, next) => {
    try {
        const userEmail = req.user.email;
        wallet[userEmail] = (wallet[userEmail] || 0) + 100;

        // Audit Log
        const { logAction } = require('../models/auditLogs');
        logAction(userEmail, 'WALLET_RECHARGE', { amount: 100, ip: req.ip });

        res.json({ msg: '💰 ₹100 added to wallet', balance: wallet[userEmail] });
    } catch (err) {
        next(err);
    }
});

router.get('/balance', verifyToken, (req, res, next) => {
    try {
        const userEmail = req.user.email;
        res.json({ balance: wallet[userEmail] || 0 });
    } catch (err) {
        next(err);
    }
});

module.exports = router;
