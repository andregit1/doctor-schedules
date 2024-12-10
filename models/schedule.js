'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
	class Schedule extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
			// define association here
			// A Schedule belongs to a Doctor
			Schedule.belongsTo(models.Doctor, {
				foreignKey: 'doctor_id',
				as: 'doctor'
			});
		}
	}
	Schedule.init(
		{
			doctor_id: {
				type: DataTypes.INTEGER,
				allowNull: false // Add validations
			},
			day: {
				type: DataTypes.STRING,
				allowNull: false
			},
			time_start: {
				type: DataTypes.STRING,
				allowNull: false
			},
			time_finish: {
				type: DataTypes.STRING,
				allowNull: false
			},
			quota: {
				type: DataTypes.INTEGER,
				allowNull: false,
				defaultValue: 0
			},
			status: {
				type: DataTypes.BOOLEAN,
				defaultValue: true
			},
			date: {
				type: DataTypes.DATE,
				allowNull: false
			}
		},
		{
			sequelize,
			modelName: 'Schedule',
			tableName: 'schedules'
		}
	);
	return Schedule;
};
