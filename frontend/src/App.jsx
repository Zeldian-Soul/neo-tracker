// src/App.jsx
import { Routes, Route, Link } from 'react-router-dom';
import { useContext, useState } from 'react';
import { AuthContext } from './context/AuthContext';
import Dashboard from './components/Dashboard';
import AsteroidDetail from './components/AsteroidDetail';
import Login from './components/Login';
import Signup from './components/Signup';
import VerifyEmail from './components/VerifyEmail'; // Ensures the new component is imported
import './App.css';

function App() {
  const { user, logout } = useContext(AuthContext);
  const [barrelRoll, setBarrelRoll] = useState(false);

  const triggerEasterEgg = () => {
    setBarrelRoll(true);
    setTimeout(() => setBarrelRoll(false), 1000);
  };

  return (
    <div className={`app-container ${barrelRoll ? 'do-a-barrel-roll' : ''}`}>
      <div className="meteor-shower">
        <div className="meteor"></div>
        <div className="meteor"></div>
        <div className="meteor"></div>
        <div className="meteor"></div>
      </div>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', paddingBottom: '10px', borderBottom: '1px solid var(--glass-border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span 
            onClick={triggerEasterEgg} 
            style={{ fontSize: '2rem', cursor: 'pointer', userSelect: 'none' }}
            title="Click me!"
          >
            ☄️
          </span>
          <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
            <h1 style={{ margin: 0, textShadow: '0 0 10px var(--neon-blue)' }}>NEO Tracker</h1>
          </Link>
        </div>
        
        <nav>
          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
              <span style={{ color: 'var(--text-muted)' }}>Explorer <strong style={{ color: '#fff' }}>{user.username}</strong></span>
              <button onClick={logout} className="neon-btn" style={{ borderColor: '#ff4444', color: '#ff4444' }}>
                Logout
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', gap: '10px' }}>
              <Link to="/login" style={{ padding: '8px 12px', color: '#fff', textDecoration: 'none' }}>Log In</Link>
              <Link to="/signup" className="neon-btn" style={{ textDecoration: 'none' }}>Sign Up</Link>
            </div>
          )}
        </nav>
      </header>
      
      <main>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/asteroid/:id" element={<AsteroidDetail />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/verify/:token" element={<VerifyEmail />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;