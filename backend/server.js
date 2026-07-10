// Load environment variables from .env file
require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json()); // Allows us to parse JSON incoming request bodies

// Health Check Route
app.get('/api/health', (req, res) => {
    res.json({ status: "up", message: "Backend server is running smoothly!" });
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server is blazing on http://localhost:${PORT}`);
});