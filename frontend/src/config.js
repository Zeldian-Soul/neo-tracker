// frontend/src/config.js

// In production on Vercel, the API lives on the same domain, so we just use an empty string ""
// In local development, we point to localhost:5000
export const API_BASE_URL = import.meta.env.DEV ? "http://localhost:5000" : "";

console.log("API configured for:", API_BASE_URL || "Same-Domain Serverless (/api)");