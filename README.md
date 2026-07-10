# NEO Tracker & Community Hub 🚀

An interactive MERN stack web application that leverages NASA's Near Earth Object Web Service (NeoWs) and Center for Near-Earth Object Studies (CNEOS) APIs to track upcoming asteroids, alongside a thriving community discussion forum built on MongoDB.

## 🛠️ Project Structure

- **`/backend`**: Node.js & Express REST API handling third-party NASA endpoints, data aggregation, and database interaction.
- **`/frontend`**: React.js single-page application built with modern UI elements and data visualizations.

## 🚀 Upcoming Milestones

- [ ] Milestone 1: Initialize monorepo workspace and Express baseline server.
- [ ] Milestone 2: Build the NASA API aggregator service (NeoWs feed parser).
- [ ] Milestone 3: Set up MongoDB Atlas cluster and define comment schemas.
- [ ] Milestone 4: Construct the React dashboard UI with real-time analytics.

## 📦 Local Setup (Backend)

1. Navigate to the backend directory: `cd backend`
2. Install dependencies: `npm install`
3. Create a `.env` file based on the environment variables guide and add your NASA API key.
4. Run development server: `npm run dev`