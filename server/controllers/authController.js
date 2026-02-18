const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const users = require('../models/user');

// Register Controller
const register = async (req, res, next) => {
  try {
    const { email, password, role, guardianPan, panOrAadhaar } = req.body;

    // Validation: Check if user already exists
    const userExists = users.find((u) => u.email === email);
    if (userExists) {
      return res.status(400).json({ msg: 'Email already registered' });
    }

    // PAN Validation: Format ABCDE1234567Z (5 letters + 7 digits + 1 letter)
    const isPANValid = (pan) => {
      if (!pan) return false;
      return /^[A-Z]{5}[0-9]{7}[A-Z]{1}$/.test(pan.toUpperCase());
    };

    // Aadhaar Validation: 12 digits
    const isAadhaarValid = (aadhaar) => {
      if (!aadhaar) return false;
      return /^\d{12}$/.test(aadhaar);
    };

    let verified = false;

    // Role-based verification
    if (role === 'major') {
      // Major needs valid PAN
      verified = isPANValid(panOrAadhaar);
      if (!verified) {
        return res.status(400).json({
          msg: 'Invalid PAN format. Use format: ABCDE1234567Z (5 letters + 7 digits + 1 letter)'
        });
      }
    } else if (role === 'guardian') {
      // Guardian needs valid PAN
      verified = isPANValid(panOrAadhaar);
      if (!verified) {
        return res.status(400).json({
          msg: 'Invalid PAN format. Use format: ABCDE1234567Z'
        });
      }
    } else if (role === 'minor') {
      // Minor needs valid Aadhaar AND guardian PAN
      const aadhaarValid = isAadhaarValid(panOrAadhaar);
      const guardianPanValid = isPANValid(guardianPan);

      if (!aadhaarValid) {
        return res.status(400).json({
          msg: 'Invalid Aadhaar format. Must be 12 digits'
        });
      }

      if (!guardianPanValid) {
        return res.status(400).json({
          msg: 'Invalid Guardian PAN format. Use format: ABCDE1234567Z'
        });
      }

      verified = aadhaarValid && guardianPanValid;
    } else if (role === 'admin') {
      // Admin is verified by default for this mock (or check a secret key in real app)
      verified = true;
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user object
    const newUser = {
      email,
      password: hashedPassword,
      role,
      verified,
      panOrAadhaar: panOrAadhaar.toUpperCase(),
      guardianPan: guardianPan ? guardianPan.toUpperCase() : null,
    };

    // Add user to database
    users.push(newUser);

    // Generate JWT token
    const token = jwt.sign(
      { email, role, verified },
      process.env.JWT_SECRET,
      { expiresIn: '15m' }
    );

    return res.json({
      msg: 'Registration successful',
      token: token,
    });
  } catch (err) {
    next(err);
  }
};

// Login Controller
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = users.find((u) => u.email === email);
    if (!user) {
      return res.status(401).json({ msg: 'User not found' });
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ msg: 'Invalid password' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { email: user.email, role: user.role, verified: user.verified },
      process.env.JWT_SECRET,
      { expiresIn: '15m' }
    );

    return res.json({
      msg: 'Login successful',
      token: token,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { register, login };
