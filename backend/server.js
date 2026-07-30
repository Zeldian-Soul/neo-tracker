// backend/server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./src/config/db');

const app = express();

// Connect to MongoDB Atlas
connectDB();

// Middleware
app.use(cors({
  origin: '*', // Allows requests from same-domain Vercel frontend or localhost
  credentials: true
}));
app.use(express.json());

// --- DEDICATED PING ENDPOINT ---
// This lightweight route confirms the API is active without hitting the database
app.get('/api/ping', (req, res) => {
  res.status(200).json({ status: 'active', message: 'NEO Tracker backend is awake!' });
});

// Routes
const neoRoutes = require('./src/routes/neoRoutes');
const authRoutes = require('./src/routes/authRoutes');

app.use('/api/neo', neoRoutes);
app.use('/api/auth', authRoutes);

// Health Check
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: "success", message: "NEO Tracker backend running!" });
});

// --- SERVERLESS COMPATIBILITY ---
// 1. Only start app.listen if we are NOT running in Vercel's production environment
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server is blazing on port ${PORT}`);
  });
}

// 2. Export the Express app so Vercel can convert it into a Serverless Function
module.exports = app;