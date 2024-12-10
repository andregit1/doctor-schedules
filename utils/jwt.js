require('dotenv').config();
const jwt = require('jsonwebtoken');

// Secret key for signing JWT tokens
const JWT_SECRET = process.env.JWT_SECRET || 'your_secret_key';
const JWT_EXPIRED = process.env.JWT_EXPIRED ||'1h'

// Generate JWT Token
const generateToken = (user) => {
  return jwt.sign(
    { id: user.id, username: user.username },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRED }
  );
};

// Verify JWT Token
const verifyToken = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return null;
  }
};

module.exports = { generateToken, verifyToken };
