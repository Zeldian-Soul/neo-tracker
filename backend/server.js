// backend/server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./src/config/db');

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB Atlas
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
const neoRoutes = require('./src/routes/neoRoutes');
const authRoutes = require('./src/routes/authRoutes');

app.use('/api/neo', neoRoutes);
app.use('/api/auth', authRoutes); // Added Auth Routes

// Health Check
app.get('/api/health', (req, res) => {
    res.status(200).json({ status: "success", message: "NEO Tracker backend running!" });
});

app.listen(PORT, () => {
  console.log(`Server is blazing on port ${PORT}`);
});