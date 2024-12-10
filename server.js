require('dotenv').config(); // Load environment variables
const app = require('./app');

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
	console.log(`Server is running on ${process.env.SERVER_URL || `http://localhost:${PORT}`}`);
});
