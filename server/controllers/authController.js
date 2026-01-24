const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const users = require('../models/user');

const register = async (req, res) => {
  const { email, password, role, panOrAadhaar, guardianPan } = req.body;
  const isPANValid = (pan) => /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(pan);
  const isAadhaarValid = (aadhaar) => /^\d{12}$/.test(aadhaar);

  let verified = false;

  if (role === 'major' || role === 'guardian') {
    verified = isPANValid(panOrAadhaar);
  } else if (role === 'minor') {
    verified = isAadhaarValid(panOrAadhaar) && isPANValid(guardianPan);
  }

  const exists = users.find(u => u.email === email);
  if (exists) return res.status(400).json({ msg: 'User already exists' });

  const hashed = await bcrypt.hash(password, 10);
  users.push({ email, password: hashed });
  res.json({ msg: 'Registered successfully' });
};

const login = async (req, res) => {
  const { email, password } = req.body;
  const user = users.find(u => u.email === email);
  if (!user) return res.status(400).json({ msg: 'Invalid credentials' });

  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.status(401).json({ msg: 'Wrong password' });

  const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '1h' });
  res.json({ token });
};

module.exports = { register, login };
