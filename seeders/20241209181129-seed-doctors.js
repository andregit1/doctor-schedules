'use strict';

/** @type {import('sequelize-cli').Seeder} */
module.exports = {
	async up(queryInterface, Sequelize) {
		const randomDoctors = ['Dr. Alice Harper', 'Dr. Benjamin Clark', 'Dr. Clara Holmes', 'Dr. Daniel Lee', 'Dr. Evelyn Woods', 'Dr. Frank Wright', 'Dr. Grace Carter', 'Dr. Henry Adams', 'Dr. Isabelle Brown', 'Dr. Jack Robinson'].map((name) => ({
			name,
			createdAt: new Date(),
			updatedAt: new Date()
		}));

		await queryInterface.bulkInsert('doctors', randomDoctors, {});
	},

	async down(queryInterface, Sequelize) {
		await queryInterface.bulkDelete('doctors', null, {});
	}
};
