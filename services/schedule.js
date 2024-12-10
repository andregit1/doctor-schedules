const { Schedule, Doctor } = require('../models');
const dayjs = require('dayjs');
const { Op } = require('sequelize');
const db = require('../models');
const { validateScheduleInput, isTimeOverlapping } = require('../helpers/schedule');

const bulkCreateSchedules = async (doctor_id, day, time_start, time_finish, quota, status, dateRange) => {
	const isInputValid = validateScheduleInput(day, time_start, time_finish, quota, status, dateRange);
	if (!isInputValid.valid) {
		return { message: isInputValid.message }; // If invalid, return the error message
	}

	// Validate doctor existence
	const doctorExists = await Doctor.findByPk(doctor_id);
	if (!doctorExists) {
		// throw new Error('Doctor not found.');
		return { message: 'Doctor not found.' };
	}

	const [startDate, endDate] = dateRange.split(' to ').map((date) => dayjs(date.trim()));
	if (!startDate.isValid() || !endDate.isValid()) {
		// throw new Error('Doctor not found.');
		return { message: 'Invalid date range format.' };
	}

	// Query all existing schedules for the doctor within the date range
	const rawExistingSchedules = await Schedule.findAll({
		where: {
			doctor_id,
			date: {
				[Op.between]: [startDate.format('YYYY-MM-DD'), endDate.format('YYYY-MM-DD')]
			}
			// day: day,
			// time_start: time_start,
			// time_finish: time_finish
		},
		attributes: ['id', 'doctor_id', 'day', 'time_start', 'time_finish', 'quota', 'status', 'date'],
		raw: true // Option for returns plain objects instead of Sequelize instances
	});

	// Normalize the date format (if necessary, convert date to YYYY-MM-DD)
	const existingSchedules = rawExistingSchedules.map((schedule) => {
		const normalizedDate = new Date(schedule.date).toISOString().split('T')[0]; // Converts to 'YYYY-MM-DD'

		return {
			...schedule,
			date: normalizedDate
		};
	});

	// Process the payload: Store all possible schedules in a temp array
	const tempSchedules = [];
	let currentDate = startDate;

	while (currentDate.isSame(endDate) || currentDate.isBefore(endDate)) {
		if (currentDate.format('dddd').toLowerCase() === day.toLowerCase()) {
			tempSchedules.push({
				doctor_id,
				day,
				time_start,
				time_finish,
				quota,
				status,
				date: currentDate.format('YYYY-MM-DD')
			});
		}
		currentDate = currentDate.add(1, 'day');
	}

	// Create a temp array to store valid schedules after checking overlap
	const validSchedules = [];

	// Validate each schedule in tempSchedules
	for (const schedule of tempSchedules) {
		const { date, time_start, time_finish } = schedule;

		// Check if the schedule overlaps with any existing schedule for that date
		const isValidSchedules = !existingSchedules.some((existingSchedule) => {
			return existingSchedule.date === date && isTimeOverlapping(existingSchedule.time_start, existingSchedule.time_finish, time_start, time_finish);
		});

		if (isValidSchedules) {
			validSchedules.push(schedule);
		} else {
			console.log(`Skipping schedule on ${date} from ${time_start} to ${time_finish} due to conflict.`);
		}
	}

	// If there are no valid schedules, return a message
	if (validSchedules.length === 0) {
		return {
			message: 'No valid schedules to create within the given date range.'
		};
	}

	// Use a transaction to create valid schedules
	const transaction = await db.sequelize.transaction();

	try {
		// Bulk create valid schedules within the transaction
		const createValidSchedules = await Schedule.bulkCreate(validSchedules, {
			transaction
		});

		await transaction.commit();

		const results = createValidSchedules.map((schedule) => ({
			doctor_id: schedule.doctor_id,
			day: schedule.day,
			time_start: schedule.time_start,
			time_finish: schedule.time_finish,
			quota: schedule.quota,
			status: schedule.status,
			doctor_name: doctorExists.name,
			date: schedule.date
		}));

		return { message: 'Schedules created successfully', body: results };
	} catch (error) {
		await transaction.rollback();
		// throw error;
		return {
			message: 'Error creating schedules',
			error: error.message
		};
	}
};

const getSchedulesService = async (doctor_id) => {
	let whereClause = {};
	if (doctor_id) {
		whereClause.doctor_id = doctor_id; // Filter by doctor_id if provided
	}

	const schedules = await Schedule.findAll({
		where: whereClause,
		include: { model: Doctor, as: 'doctor', attributes: ['name'] },
		order: [['date', 'ASC']]
	});

	const results = schedules.map((schedule) => ({
		id: schedule.id,
		doctor_id: schedule.doctor_id,
		day: schedule.day,
		time_start: schedule.time_start,
		time_finish: schedule.time_finish,
		quota: schedule.quota,
		status: schedule.status,
		doctor_name: schedule.doctor.name,
		date: schedule.date.toISOString().split('T')[0] // Format the date
	}));

	return { message: 'Success', count: results.length, body: results };
};

module.exports = {
	bulkCreateSchedules,
	getSchedulesService
};
