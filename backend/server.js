// backend/server.js
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}
const express = require('express');
const cors = require('cors');
const connectDB = require('./src/config/db');

const app = express();

// Connect to MongoDB Atlas
connectDB();

// Middleware
app.use(cors({
  origin: '*', // Same-domain routing on Vercel makes CORS seamless
  credentials: true
}));
app.use(express.json());

// Dedicated ping endpoint for health checks
app.get('/api/ping', (req, res) => {
  res.status(200).json({ status: 'active', message: 'NEO Tracker backend is awake!' });
});

// Import and register application routes
const neoRoutes = require('./src/routes/neoRoutes');
const authRoutes = require('./src/routes/authRoutes');

app.use('/api/neo', neoRoutes);
app.use('/api/auth', authRoutes);

// Health Check
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: "success", message: "NEO Tracker backend running!" });
});

// Only start app.listen during local development
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server running locally on port ${PORT}`);
  });
}

// Export Express app for Vercel Serverless
module.exports = app;