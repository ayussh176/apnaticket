const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/authController');
const verifyToken = require('../middleware/authMiddleware');


router.post('/register', register);
router.post('/login', login);

router.get('/me', verifyToken, (req, res) => {
  const { email, role } = req.user;
  res.json({ email, role });
});

router.get('/dashboard', verifyToken, (req, res) => {
  res.json({ msg: `Welcome ${req.user.email}! This is your dashboard.` });
});

module.exports = router;
