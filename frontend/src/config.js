// frontend/src/config.js

// During local testing ('npm run dev'), use http://localhost:5000
// In Vercel production, use an empty string "" to send requests to the same origin
export const API_BASE_URL = import.meta.env.DEV ? "http://localhost:5000" : "";

console.log("NEO Tracker connected to API base:", API_BASE_URL || "(Same Domain /api)");