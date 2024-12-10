const { Doctor, Schedule } = require('../models');

// GET: Retrieve all doctors
const getDoctors = async (req, res) => {
	try {
		const doctors = await Doctor.findAll({
			attributes: ['id', 'name', 'createdAt', 'updatedAt']
		});

		if (doctors.length === 0) {
			return res.status(404).json({ message: 'No doctors found.' });
		}

		res.json({ message: 'Success', count: doctors.length, body: doctors });
	} catch (err) {
		res.status(500).json({ message: 'Error retrieving doctors', error: err.message });
	}
};

// GET: Retrieve a specific doctor by ID with their schedules
const getDoctorDetails = async (req, res) => {
	try {
		const doctor = await Doctor.findByPk(req.params.id, {
			attributes: ['id', 'name', 'createdAt', 'updatedAt'],
			include: [
				{
					model: Schedule,
					as: 'schedules',
					attributes: ['id', 'day', 'time_start', 'time_finish', 'quota', 'status', 'date']
				}
			]
		});

		if (!doctor) {
			return res.status(404).json({ message: 'Doctor not found.' });
		}

		res.json({
			message: 'Success',
			body: {
				count_schedules: doctor.schedules.length,
				doctor
			}
		});
	} catch (err) {
		res.status(500).json({
			message: 'Error retrieving doctor details or schedules',
			error: err.message
		});
	}
};

module.exports = { getDoctors, getDoctorDetails };
