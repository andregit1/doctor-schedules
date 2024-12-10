require('dotenv').config();
const process = require('process');

const development = {
	database: process.env.POSTGRES_DB,
	username: process.env.POSTGRES_USER,
	password: process.env.POSTGRES_PASSWORD,
	host: process.env.DB_HOST || 'localhost',
	dialect: 'postgres',
	dialectModule: require('pg'),
	dialectOptions: {
		// Additional options for Postgres can be added here
	}
};

module.exports = {
	development
};
