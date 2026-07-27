// Load environment variables and force override any existing system/cached variables
require('dotenv').config({ override: true });
const mongoose = require('mongoose');

const runTest = async () => {
    try {
        console.log("--------------------------------------------------");
        console.log("Checking loaded MONGO_URI...");
        
        const rawUri = process.env.MONGO_URI || "";
        
        // Mask the password in logs for safety
        const sanitizedUri = rawUri.replace(/:([^@]+)@/, ':****@');
        console.log(`Loaded URI: ${sanitizedUri}`);
        console.log("--------------------------------------------------");

        console.log("⏳ Attempting to connect to MongoDB Atlas...");

        // Connect using process.env.MONGO_URI with a 5-second timeout
        const conn = await mongoose.connect(process.env.MONGO_URI, {
            serverSelectionTimeoutMS: 5000
        });

        console.log(`✅ SUCCESS! Connected to cluster: ${conn.connection.host}`);
        await mongoose.disconnect();
        process.exit(0);

    } catch (error) {
        console.error("❌ CONNECTION FAILED:");
        console.error(error.message);
        process.exit(1);
    }
};

runTest();