const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth');
const { createSchedules, getSchedules } = require('../controllers/schedules');

/**
 * @swagger
 * components:
 *   schemas:
 *     Schedule:
 *       type: object
 *       required:
 *         - doctor_id
 *         - day
 *         - time_start
 *         - time_finish
 *         - quota
 *         - status
 *         - date
 *       properties:
 *         id:
 *           type: integer
 *           description: Unique ID of the doctor
 *         doctor_id:
 *           type: integer
 *           description: ID of the doctor
 *         day:
 *           type: string
 *           description: Day of the week (e.g., Monday, Tuesday)
 *         time_start:
 *           type: string
 *           description: Start time of the schedule (e.g., "08:00")
 *         time_finish:
 *           type: string
 *           description: Finish time of the schedule (e.g., "12:00")
 *         quota:
 *           type: integer
 *           description: Number of available slots
 *         status:
 *           type: boolean
 *           description: Availability status (true = available, false = unavailable)
 *         date:
 *           type: string
 *           format: date
 *           description: Date of the schedule
 */

/**
 * @swagger
 * /schedules/create:
 *   post:
 *     summary: Create multiple schedules for a doctor
 *     description: Create schedules for a doctor over a date range, repeating on a specific day of the week.
 *     tags:
 *       - Schedules
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - doctor_id
 *               - day
 *               - time_start
 *               - time_finish
 *               - quota
 *               - status
 *               - dateRange
 *             properties:
 *               doctor_id:
 *                 type: integer
 *                 example: 1
 *                 description: ID of the doctor
 *               day:
 *                 type: string
 *                 example: "Monday"
 *                 description: Day of the week (e.g., Monday, Tuesday)
 *               time_start:
 *                 type: string
 *                 example: "09:00"
 *                 description: Start time of the schedule (e.g., "08:00")
 *               time_finish:
 *                 type: string
 *                 example: "17:00"
 *                 description: Finish time of the schedule (e.g., "12:00")
 *               quota:
 *                 type: integer
 *                 example: 10
 *                 description: Number of available slots
 *               status:
 *                 type: boolean
 *                 example: true
 *                 description: Availability status (true = available, false = unavailable)
 *               dateRange:
 *                 type: string
 *                 example: "2024-12-01 to 2024-12-10"
 *                 description: Date range (e.g., "YYYY-MM-DD to YYYY-MM-DD")
 *     responses:
 *       200:
 *         description: Schedules created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       500:
 *         description: Error creating schedules
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
router.post('/create', authenticate, createSchedules);

/**
 * @swagger
 * /schedules:
 *   get:
 *     summary: Retrieve all schedules or schedules for a specific doctor
 *     description: Get a list of all schedules or schedules for a specific doctor based on the doctor_id query parameter.
 *     tags:
 *       - Schedules
 *     parameters:
 *       - name: doctor_id
 *         in: query
 *         required: false
 *         description: ID of the doctor to filter schedules by
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Success, retrieved schedules
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
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       doctor_id:
 *                         type: integer
 *                       day:
 *                         type: string
 *                       time_start:
 *                         type: string
 *                       time_finish:
 *                         type: string
 *                       quota:
 *                         type: integer
 *                       status:
 *                         type: string
 *                       doctor_name:
 *                         type: string
 *                       date:
 *                         type: string
 *       404:
 *         description: No schedules found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       500:
 *         description: Error retrieving schedules
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
router.get('/', authenticate, getSchedules);

module.exports = router;
