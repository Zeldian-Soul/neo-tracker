require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors()); 
app.use(express.json());

// Import the new NeoWs routes
const neoRoutes = require('./src/routes/neoRoutes');

// Mount the routes to the /api/neo path
app.use('/api/neo', neoRoutes);

app.get('/api/health', (req, res) => {
    res.status(200).json({ 
        status: "success", 
        message: "NEO Tracker backend is running smoothly!" 
    });
});

app.listen(PORT, () => {
    console.log(`Server is blazing on http://localhost:${PORT}`);
});