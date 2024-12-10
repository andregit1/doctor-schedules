const express = require('express');
const bodyParser = require('body-parser');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/swagger'); // Import Swagger configuration

// Import routes
const authRoutes = require('./routes/auth');
const scheduleRoutes = require('./routes/schedules');
const doctorRoutes = require('./routes/doctors');

// Initialize Express app
const app = express();

// Middleware
app.use(bodyParser.json());

// Swagger route
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Define API routes
app.use('/auth', authRoutes);
app.use('/doctors', doctorRoutes);
app.use('/schedules', scheduleRoutes);

module.exports = app;
