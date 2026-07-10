const axios = require('axios');

// Function to fetch data from the NeoWs Feed
const getAsteroidsFeed = async (startDate, endDate) => {
    try {
        const response = await axios.get('https://api.nasa.gov/neo/rest/v1/feed', {
            params: {
                start_date: startDate,
                end_date: endDate,
                api_key: process.env.NASA_API_KEY
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching data from NASA:', error.message);
        throw error; // Pass the error up to the controller
    }
};

module.exports = {
    getAsteroidsFeed
};