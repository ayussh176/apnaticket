const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Get Bearer token

  if (!token) return res.status(401).json({ msg: 'No token provided' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // save decoded user info in request
    next();
  } catch (err) {
    return res.status(403).json({ msg: 'Invalid or expired token' });
  }
};

module.exports = verifyToken;
