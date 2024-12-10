const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth');
const { getDoctors, getDoctorDetails } = require('../controllers/doctors');

/**
 * @swagger
 * components:
 *   schemas:
 *     Doctor:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: Unique ID of the doctor
 *         name:
 *           type: string
 *           description: Doctor's name
 */

/**
 * @swagger
 * /doctors:
 *   get:
 *     summary: Retrieve all doctors
 *     description: Get a list of all doctors.
 *     tags:
 *       - Doctors
 *     responses:
 *       200:
 *         description: Success, retrieved doctors
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 body:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Doctor'
 *       500:
 *         description: Error retrieving doctors
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 error:
 *                   type: string
 */
router.get('/', authenticate, getDoctors);

/**
 * @swagger
 * /doctors/{id}:
 *   get:
 *     summary: Retrieve a specific doctor by ID with their schedules
 *     description: Get a specific doctor's details along with their schedules.
 *     tags:
 *       - Doctors
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the doctor to retrieve
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Success, retrieved doctor and their schedules
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 body:
 *                   type: object
 *                   properties:
 *                     doctor:
 *                       $ref: '#/components/schemas/Doctor'
 *                     schedules:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: integer
 *                           day:
 *                             type: string
 *                           time_start:
 *                             type: string
 *                           time_finish:
 *                             type: string
 *                           quota:
 *                             type: integer
 *                           status:
 *                             type: string
 *                           date:
 *                             type: string
 *       404:
 *         description: Doctor not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       500:
 *         description: Error retrieving doctor details or schedules
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 error:
 *                   type: string
 */
router.get('/:id', authenticate, getDoctorDetails);

module.exports = router;
