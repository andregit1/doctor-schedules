// middleware/authMiddleware.js
const { verifyToken } = require('../utils/jwt');

const authenticate = (req, res, next) => {
	const token = req.header('Authorization')?.split(' ')[1]; // Get token from 'Authorization' header

	if (!token) {
		return res.status(401).json({ message: 'Access denied, token missing' });
	}

	const decoded = verifyToken(token);
	if (!decoded) {
		return res.status(401).json({ message: 'Invalid token' });
	}

	req.user = decoded; // Attach user data to the request object
	next();
};

module.exports = { authenticate };
