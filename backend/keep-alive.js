// keep-alive.js

// We updated the URL to point directly to our lightweight ping endpoint
const APP_URL = 'https://neo-tracker-backend.onrender.com/api/ping'; 

async function ping() {
    try {
        const response = await fetch(APP_URL);
        console.log(`${new Date().toISOString()}: Pinged ${APP_URL} - Status ${response.status}`);
    } catch (err) {
        console.error(`${new Date().toISOString()}: Error pinging ${APP_URL}`, err.message);
    }
}

ping();
