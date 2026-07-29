// src/components/Dashboard.jsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { API_BASE_URL } from '../config';

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Dashboard = () => {
  const [asteroids, setAsteroids] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAsteroids = async () => {
      try {
        const today = new Date().toISOString().split('T')[0];
        const response = await axios.get(`${API_BASE_URL}/api/neo/feed?start_date=${today}&end_date=${today}`);
        
        const data = response.data.asteroids;
        const asteroidList = data[today] || [];
        
        setAsteroids(asteroidList);
        setError(null);
        setLoading(false);
      } catch (err) {
        console.error("API Fetch Error Details:", {
          message: err.message,
          urlTried: `${API_BASE_URL}/api/neo/feed`,
          status: err.response?.status
        });
        setError("Failed to load asteroid data from backend.");
        setLoading(false);
      }
    };

    // 1. Fetch data immediately when the component first loads
    fetchAsteroids();

    // 2. Set up an interval to fetch data automatically every 10 minutes (600,000 milliseconds)
    const intervalId = setInterval(() => {
      console.log("Checking NASA servers for new Near-Earth Objects...");
      fetchAsteroids();
    }, 600000); 

    // 3. Cleanup function: Tell React to clear the timer if the user leaves the Dashboard
    return () => clearInterval(intervalId);
  }, []);

  if (loading) return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 2, ease: "linear" }} style={{ fontSize: '3rem' }}>🛰️</motion.div>
      <h2 style={{ color: 'var(--neon-blue)' }}>Scanning the skies...</h2>
    </div>
  );
  
  if (error) return <h2 style={{ color: '#ff4444' }}>{error}</h2>;

  const hazardousCount = asteroids.filter(a => a.is_potentially_hazardous_asteroid).length;
  const largestAsteroid = Math.max(...asteroids.map(a => a.estimated_diameter.meters.estimated_diameter_max));

  // --- Chart.js Data and Configuration ---
  const chartData = {
    labels: asteroids.map(a => a.name),
    datasets: [
      {
        label: 'Max Estimated Diameter (Meters)',
        data: asteroids.map(a => a.estimated_diameter.meters.estimated_diameter_max),
        backgroundColor: asteroids.map(a => 
          a.is_potentially_hazardous_asteroid ? 'rgba(255, 68, 68, 0.7)' : 'rgba(0, 243, 255, 0.7)'
        ),
        borderColor: asteroids.map(a => 
          a.is_potentially_hazardous_asteroid ? '#ff4444' : '#00f3ff'
        ),
        borderWidth: 1,
        borderRadius: 4,
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { display: false },
      title: {
        display: true,
        text: 'Asteroid Size Comparison (Red = Hazardous)',
        color: '#e0e0e0',
        font: { size: 16 }
      }
    },
    scales: {
      y: {
        grid: { color: 'rgba(255, 255, 255, 0.1)' },
        ticks: { color: '#8892b0' }
      },
      x: {
        grid: { display: false },
        ticks: { color: '#8892b0', maxRotation: 45, minRotation: 45 }
      }
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div style={{ paddingBottom: '50px' }}>
      <h2>Sector Overview</h2>
      
      <div className="stats-container">
        <div className="glass-card stat-box">
          <h3>Total Objects Today</h3>
          <p>{asteroids.length}</p>
        </div>
        <div className="glass-card stat-box danger">
          <h3>Hazardous Objects</h3>
          <p style={{ color: hazardousCount > 0 ? '#ff4444' : '#fff' }}>{hazardousCount}</p>
        </div>
        <div className="glass-card stat-box">
          <h3>Largest Detected</h3>
          <p>{Math.round(largestAsteroid)}<span style={{ fontSize: '1rem', color: 'var(--text-muted)' }}>m</span></p>
        </div>
      </div>

      {/* --- The New Chart Section --- */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-card" 
        style={{ padding: '20px', marginBottom: '30px', height: '400px', display: 'flex', justifyContent: 'center' }}
      >
        <Bar data={chartData} options={chartOptions} />
      </motion.div>

      <h2>Near-Earth Object Feed</h2>
      
      <motion.div 
        className="asteroid-grid"
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        {asteroids.map((asteroid) => (
          <motion.div 
            key={asteroid.id} 
            variants={itemVariants}
            className="glass-card"
            style={{ padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}
          >
            <div>
              <h3 style={{ margin: '0 0 15px 0', color: 'var(--neon-blue)' }}>{asteroid.name}</h3>
              <p style={{ margin: '5px 0' }}>
                <span style={{ color: 'var(--text-muted)' }}>Est. Max Diameter:</span><br/>
                <strong>{Math.round(asteroid.estimated_diameter.meters.estimated_diameter_max)} meters</strong>
              </p>
              <p style={{ margin: '5px 0 20px 0' }}>
                <span style={{ color: 'var(--text-muted)' }}>Hazard Status:</span><br/>
                {asteroid.is_potentially_hazardous_asteroid ? 
                  <strong style={{ color: '#ff4444' }}>⚠️ Potentially Hazardous</strong> : 
                  <strong style={{ color: '#4caf50' }}>✅ Safe Trajectory</strong>
                }
              </p>
            </div>
            
            <Link 
              to={`/asteroid/${asteroid.id}`} 
              state={{ asteroid }}
              className="neon-btn"
              style={{ textAlign: 'center', display: 'block', textDecoration: 'none' }}
            >
              Analyze Data
            </Link>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default Dashboard;