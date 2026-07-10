const { getAsteroidsFeed } = require('../services/nasaService');

const getFeed = async (req, res) => {
    try {
        // Extract the dates from the query string (e.g., ?start_date=...&end_date=...)
        const { start_date, end_date } = req.query;

        // Ensure the user provided the required dates
        if (!start_date || !end_date) {
            return res.status(400).json({ 
                error: 'Please provide both start_date and end_date in the query parameters (YYYY-MM-DD).' 
            });
        }

        // Call the service to get the raw NASA data
        const data = await getAsteroidsFeed(start_date, end_date);

        // Send a clean, structured response back to the client
        res.status(200).json({
            status: 'success',
            element_count: data.element_count,
            asteroids: data.near_earth_objects
        });

    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch asteroid data from NASA.' });
    }
};

module.exports = {
    getFeed
};