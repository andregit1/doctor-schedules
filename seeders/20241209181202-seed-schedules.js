'use strict';

/** @type {import('sequelize-cli').Seeder} */
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.bulkInsert(
			'schedules',
			[
				{
					doctor_id: 1,
					day: 'Monday',
					time_start: '08:00',
					time_finish: '12:00',
					quota: 10,
					status: true,
					date: new Date('2024-12-16'),
					createdAt: new Date(),
					updatedAt: new Date()
				}
			],
			{}
		);
	},

	async down(queryInterface, Sequelize) {
		await queryInterface.bulkDelete('schedules', null, {});
	}
};
