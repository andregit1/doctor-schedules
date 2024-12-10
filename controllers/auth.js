const bcrypt = require('bcryptjs');
const { User } = require('../models');
const { generateToken } = require('../utils/jwt');

// Login Handler
const login = async (req, res) => {
	const { username, password } = req.body;

	try {
		// Find user by username
		const user = await User.findOne({ where: { username } });

		if (!user) {
			return res.status(400).json({ message: 'User not found' });
		}

		// Check if the password is correct
		const isMatch = await bcrypt.compare(password, user.password);
		if (!isMatch) {
			return res.status(400).json({ message: 'Invalid password' });
		}

		// Generate JWT token
		const token = generateToken(user);

		// Send back the token
		res.json({ message: 'Login successful', token });
	} catch (err) {
		res.status(500).json({ message: 'Internal server error', error: err.message });
	}
};

// Logout Handler (optional, since logout usually involves just deleting the token on the client side)
const logout = (req, res) => {
	res.json({ message: 'Logout successful' });
};

module.exports = { login, logout };
// , logout automaticatlly dont depends on client side
