// frontend/src/config.js

// 1. Enter your live cloud backend URL below (e.g., your Render API URL):
const RENDER_API_URL = "https://neo-tracker-backend.onrender.com"; // <-- Ensure this is your live API URL

// 2. Automatically detect development vs. production mode:
export const API_BASE_URL = import.meta.env.DEV 
  ? "http://localhost:5000" 
  : RENDER_API_URL;

console.log("NEO Tracker connected to API:", API_BASE_URL);