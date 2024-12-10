const dayjs = require('dayjs');

const validDays = {
	monday: ['senin', 'monday'],
	tuesday: ['selasa', 'tuesday'],
	wednesday: ['rabu', 'wednesday'],
	thursday: ['kamis', 'thursday'],
	friday: ['jumat', 'friday'],
	saturday: ['sabtu', 'saturday'],
	sunday: ['minggu', 'sunday']
};

const isValidDay = (day) => {
	// Normalize and check the day input
	const normalizedDay = day.trim().toLowerCase();

	// First, check if the day is valid in the validDays mapping (English or Indonesian)
	const validDay = Object.keys(validDays).find((key) => validDays[key].includes(normalizedDay));
	if (validDay) {
		return true;
	}

	// If the day is not found in validDays mapping, check if it is a valid English day
	const validEnglishDays = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
	if (validEnglishDays.includes(normalizedDay)) {
		return true;
	}

	// If no match, return false
	return false;
};

// Helper function to validate time format (HH:mm)
const isValidTime = (time) => {
	const timeRegex = /^([01]?[0-9]|2[0-3]):([0-5][0-9])$/;
	return timeRegex.test(time);
};

// Helper function to validate quota
const isValidQuota = (quota) => {
	return Number.isInteger(quota) && quota > 0;
};

// Helper function to validate status
const isValidStatus = (status) => {
	return typeof status === 'boolean';
};

// Helper function to validate dateRange
const isValidDateRange = (dateRange) => {
	const dateParts = dateRange.split(' to ');
	if (dateParts.length !== 2) return false;
	const [startDate, endDate] = dateParts;
	return dayjs(startDate, 'YYYY-MM-DD', true).isValid() && dayjs(endDate, 'YYYY-MM-DD', true).isValid();
};

// Helper function to check if time_finish is after time_start
const isTimeValid = (dateRange, time_start, time_finish) => {
	// Validate the dateRange format
	if (!isValidDateRange(dateRange)) {
		return { valid: false, message: 'Invalid date range format. Please use YYYY-MM-DD to YYYY-MM-DD.' };
	}

	// Extract the base date from dateRange
	const [baseDate] = dateRange.split(' to ');

	// Parse time with the base date
	const start = dayjs(`${baseDate} ${time_start}`, 'YYYY-MM-DD HH:mm');
	const end = dayjs(`${baseDate} ${time_finish}`, 'YYYY-MM-DD HH:mm');

	// Check if time_finish is after time_start
	const valid = end.isAfter(start);
	return {
		valid,
		message: valid ? '' : 'time_finish must be after time_start.'
	};
};

const validateScheduleInput = (day, time_start, time_finish, quota, status, dateRange) => {
	const validations = [];

	// Validate day
	const isDayValid = isValidDay(day);
	validations.push({
		field: 'day',
		valid: isDayValid,
		message: isDayValid ? '' : 'Invalid day.'
	});

	// Validate dateRange
	const isDateRangeValid = isValidDateRange(dateRange);
	validations.push({
		field: 'dateRange',
		valid: isDateRangeValid,
		message: isDateRangeValid ? '' : 'Invalid date range format. Please use "YYYY-MM-DD to YYYY-MM-DD".'
	});

	// Validate time format
	const isTimeStartValid = isValidTime(time_start);
	const isTimeFinishValid = isValidTime(time_finish);
	validations.push({
		field: 'time_start',
		valid: isTimeStartValid,
		message: isTimeStartValid ? '' : 'Invalid time format. Please use HH:mm.'
	});
	validations.push({
		field: 'time_finish',
		valid: isTimeFinishValid,
		message: isTimeFinishValid ? '' : 'Invalid time format. Please use HH:mm.'
	});

	// Validate time order if time formats are valid
	if (isTimeStartValid && isTimeFinishValid) {
		const timeValidationResult = isTimeValid(dateRange, time_start, time_finish);
		validations.push({
			field: 'time_order',
			valid: timeValidationResult.valid,
			message: timeValidationResult.message || ''
		});
	}

	// Validate quota
	const isQuotaValid = isValidQuota(quota);
	validations.push({
		field: 'quota',
		valid: isQuotaValid,
		message: isQuotaValid ? '' : 'Invalid quota. It must be a positive integer.'
	});

	// Validate status
	const isStatusValid = isValidStatus(status);
	validations.push({
		field: 'status',
		valid: isStatusValid,
		message: isStatusValid ? '' : 'Invalid status. It must be true or false.'
	});

	// Check for any validation errors
	const invalidValidation = validations.find((validation) => !validation.valid);
	if (invalidValidation) {
		return { valid: false, message: `${invalidValidation.field}: ${invalidValidation.message}` };
	}

	return { valid: true };
};

const isTimeOverlapping = (existingStart, existingEnd, newStart, newEnd) => {
	const parseTime = (time) => {
		const [hours, minutes] = time.split(':').map(Number);
		return hours * 60 + minutes;
	};

	const existStart = parseTime(existingStart);
	const existEnd = parseTime(existingEnd);
	const newStartTime = parseTime(newStart);
	const newEndTime = parseTime(newEnd);

	return (
		(newStartTime >= existStart && newStartTime < existEnd) || // New start time is within existing time
		(newEndTime > existStart && newEndTime <= existEnd) || // New end time is within existing time
		(newStartTime <= existStart && newEndTime >= existEnd) // New schedule completely covers existing schedule
	);
};

module.exports = {
	validateScheduleInput,
	isTimeOverlapping
};
