const { bulkCreateSchedules, getSchedulesService } = require('../services/schedule');

// POST
const createSchedules = async (req, res) => {
	const { doctor_id, day, time_start, time_finish, quota, status, dateRange } = req.body;

	try {
		// Validate required fields
		if (!doctor_id || !day || !time_start || !time_finish || !dateRange) {
			return res.status(400).json({ message: 'All fields are required.' });
		}

		// Call the service
		const results = await bulkCreateSchedules(doctor_id, day, time_start, time_finish, quota, status, dateRange);

		if (result.error) {
			return res.status(400).json({ message: result.error });
		}

		// Return success response
		res.json(results);
	} catch (err) {
		// Handle errors and return a failure response
		res.status(500).json({ message: 'Error creating schedules', error: err.message });
	}
};

// GET: Retrieve all schedules or schedules for a specific doctor
// GET /schedules?doctor_id=1
const getSchedules = async (req, res) => {
	try {
		const doctor_id = req.query.doctor_id; // Retrieve the doctor_id query parameter

		// Call the service method to get schedules
		const results = await getSchedulesService(doctor_id);

		if (results.length === 0) {
			return res.status(404).json({ message: 'No schedules found for doctor.' });
		}

		// Return success response with schedules data
		res.json(results);
	} catch (err) {
		res.status(500).json({ message: 'Error retrieving schedules', error: err.message });
	}
};

module.exports = { createSchedules, getSchedules };
