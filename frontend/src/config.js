// frontend/src/config.js
const CLOUD_BACKEND_URL = "https://neo-tracker-backend.onrender.com";

// 2. Automatically use localhost during local development, and the Cloud URL when live on GitHub Pages
export const API_BASE_URL = import.meta.env.MODE === 'development' 
  ? "http://localhost:5000" 
  : CLOUD_BACKEND_URL;