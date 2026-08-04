// api/index.js

try {
  // Attempt to load your Express app normally
  const app = require('../backend/server.js');
  module.exports = app;
} catch (error) {
  // If the backend crashes during initialization, catch it!
  console.error("Vercel Cold Start Error:", error);
  
  // Create a temporary fallback server to send the exact error to your browser
  const express = require('express');
  const fallbackApp = express();
  
  fallbackApp.all('*', (req, res) => {
    res.status(500).json({
      status: 'CRASH_DURING_STARTUP',
      message: 'The backend failed to start. Check Vercel logs or read the error details below.',
      errorDetails: error.message,
      stack: error.stack
    });
  });
  
  module.exports = fallbackApp;
}
