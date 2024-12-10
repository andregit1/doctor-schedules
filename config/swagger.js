require('dotenv').config(); // Load environment variables
const swaggerJSDoc = require('swagger-jsdoc');
const DEFAULT_SERVER_URL = 'http://localhost:3000';

const swaggerSpec = swaggerJSDoc({
	definition: {
		openapi: '3.0.0',
		info: {
			title: 'API Documentation Doctor Schedules',
			version: '1.0.0',
			description: 'Tech Test API Documentation'
		},
		servers: [
			{
				url: process.env.SERVER_URL || DEFAULT_SERVER_URL
			}
		],
		components: {
			securitySchemes: {
				BearerAuth: {
					type: 'http',
					scheme: 'bearer',
					bearerFormat: 'JWT'
				}
			}
		},
		security: [
			{
				BearerAuth: [] // Applies this security scheme globally (to all routes by default)
			}
		]
	},
	apis: ['./routes/*.js', './models/*.js'] // Adjust paths to your route and model files
});

module.exports = swaggerSpec;
