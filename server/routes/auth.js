const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/authController');
const verifyToken = require('../middleware/authMiddleware');


router.post('/register', register);
router.post('/login', login);

router.get('/me', verifyToken, async (req, res, next) => {
  try {
    const { email, role } = req.user;
    res.json({ email, role });
  } catch (err) {
    next(err);
  }
});

router.get('/dashboard', verifyToken, (req, res, next) => {
  try {
    res.json({ msg: `Welcome ${req.user.email}! This is your dashboard.` });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
