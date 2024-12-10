const express = require('express');
const router = express.Router();
const { login, logout } = require('../controllers/auth');

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: Unique ID of the user
 *         username:
 *           type: string
 *           description: User's name
 *         password:
 *           type: string
 *           description: User's password
 */

/**
 * @swagger
 * /auth/login:
 *   post:
 *     security: []  # Exclude bearer authentication for this route
 *     summary: User login
 *     description: Logs in a user and generates a JWT token
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 description: Username of the user
 *                 example: 'admin'
 *               password:
 *                 type: string
 *                 description: Password of the user
 *                 example: '123123123'
 *     responses:
 *       200:
 *         description: Successfully logged in, returns a JWT token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   description: The JWT token for authenticated requests
 *                   example: 'your.jwt.token.here'
 *       400:
 *         description: Invalid username or password
 *       500:
 *         description: Internal server error
 */
router.post('/login', login);

/**
 * @swagger
 * /auth/logout:
 *   post:
 *     security: []  # Exclude bearer authentication for this route
 *     summary: User logout
 *     description: Logs out the user and invalidates the session or token
 *     tags:
 *       - Auth
 *     responses:
 *       200:
 *         description: Successfully logged out
 *       500:
 *         description: Internal server error
 */
router.post('/logout', logout);

module.exports = router;
