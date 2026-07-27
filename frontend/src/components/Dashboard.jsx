// src/components/Dashboard.jsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Dashboard = () => {
  const [asteroids, setAsteroids] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAsteroids = async () => {
      try {
        const today = new Date().toISOString().split('T')[0];
        const response = await axios.get(`http://localhost:5000/api/neo/feed?start_date=${today}&end_date=${today}`);
        
        const data = response.data.asteroids;
        const asteroidList = data[today] || [];
        
        setAsteroids(asteroidList);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load asteroid data from backend. Is your Express server running?");
        setLoading(false);
      }
    };

    fetchAsteroids();
  }, []);

  if (loading) return <h2>Scanning the skies... Loading data...</h2>;
  if (error) return <h2 style={{ color: 'red' }}>{error}</h2>;

  return (
    <div>
      <h2>Today's Near-Earth Objects ({asteroids.length})</h2>
      <p>Click on any asteroid to view discussions and post comments!</p>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', alignItems: 'center' }}>
        {asteroids.map((asteroid) => (
          <div 
            key={asteroid.id} 
            style={{
              border: '1px solid #444',
              borderRadius: '8px',
              padding: '15px',
              width: '80%',
              maxWidth: '500px',
              textAlign: 'left',
              backgroundColor: '#1a1a1a'
            }}
          >
            <h3>{asteroid.name}</h3>
            <p><strong>Max Diameter:</strong> {Math.round(asteroid.estimated_diameter.meters.estimated_diameter_max)} meters</p>
            <p><strong>Hazardous Status:</strong> {asteroid.is_potentially_hazardous_asteroid ? "⚠️ Hazardous" : "✅ Safe"}</p>
            
            {/* Link to detail page, passing asteroid data via route state */}
            <Link 
              to={`/asteroid/${asteroid.id}`} 
              state={{ asteroid }}
              style={{
                display: 'inline-block',
                marginTop: '10px',
                padding: '8px 12px',
                backgroundColor: '#646cff',
                color: '#fff',
                borderRadius: '4px',
                textDecoration: 'none'
              }}
            >
              View Details & Discussions →
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;