// backend/cleanUsers.js
require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./src/models/User'); // Importing only the User model

const cleanDatabase = async () => {
    try {
        console.log("⏳ Connecting to MongoDB Atlas...");
        
        // Connect to the database using your existing URI
        await mongoose.connect(process.env.MONGO_URI);
        console.log("✅ Connected securely.");

        console.log("🧹 Wiping the User collection...");
        
        // deleteMany({}) deletes all documents in the collection
        const result = await User.deleteMany({});
        
        console.log(`✅ Success! Deleted ${result.deletedCount} old user account(s).`);

        // Close the connection so the script doesn't hang
        await mongoose.disconnect();
        console.log("🔌 Disconnected safely.");
        
        process.exit(0);
    } catch (error) {
        console.error("❌ Error cleaning the database:", error.message);
        process.exit(1);
    }
};

// Execute the function
cleanDatabase();