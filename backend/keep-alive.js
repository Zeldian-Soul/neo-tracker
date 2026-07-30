// keep-alive.js
// We use Node's native fetch API to send the HTTP GET request
const APP_URL = 'https://neo-tracker-backend.onrender.com'; // Replace with your actual Render URL

async function ping() {
    try {
        const response = await fetch(APP_URL);
        console.log(`${new Date().toISOString()}: Pinged ${APP_URL} - Status ${response.status}`);
    } catch (err) {
        console.error(`${new Date().toISOString()}: Error pinging ${APP_URL}`, err.message);
    }
}

// Execute the ping
ping();
