'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.createTable('schedules', {
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: Sequelize.INTEGER
			},
			doctor_id: {
				type: Sequelize.INTEGER
			},
			day: {
				type: Sequelize.STRING
			},
			time_start: {
				type: Sequelize.STRING
			},
			time_finish: {
				type: Sequelize.STRING
			},
			quota: {
				type: Sequelize.INTEGER
			},
			status: {
				type: Sequelize.BOOLEAN
			},
			date: {
				type: Sequelize.DATE
			},
			createdAt: {
				allowNull: false,
				type: Sequelize.DATE
			},
			updatedAt: {
				allowNull: false,
				type: Sequelize.DATE
			}
		});
	},
	async down(queryInterface, Sequelize) {
		await queryInterface.dropTable('schedules');
	}
};
