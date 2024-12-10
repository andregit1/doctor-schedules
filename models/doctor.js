'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
	class Doctor extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
			// define association here
			// A Doctor has many Schedules
			Doctor.hasMany(models.Schedule, {
				foreignKey: 'doctor_id',
				as: 'schedules'
			});
		}
	}
	Doctor.init(
		{
			name: {
				type: DataTypes.STRING,
				allowNull: false // Add validations
			}
		},
		{
			sequelize,
			modelName: 'Doctor',
			tableName: 'doctors'
		}
	);
	return Doctor;
};
