// src/App.jsx
import { Routes, Route, Link } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from './context/AuthContext';
import Dashboard from './components/Dashboard';
import AsteroidDetail from './components/AsteroidDetail';
import Login from './components/Login';
import Signup from './components/Signup';
import './App.css';

function App() {
  const { user, logout } = useContext(AuthContext);

  return (
    <div className="app-container">
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', paddingBottom: '10px', borderBottom: '1px solid #333' }}>
        <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
          <h1 style={{ margin: 0 }}>☄️ NEO Tracker</h1>
        </Link>
        
        <nav>
          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
              <span>Welcome, <strong>{user.username}</strong></span>
              <button onClick={logout} style={{ padding: '6px 12px', backgroundColor: '#333', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                Logout
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', gap: '10px' }}>
              <Link to="/login" style={{ padding: '6px 12px', color: '#fff', textDecoration: 'none' }}>Log In</Link>
              <Link to="/signup" style={{ padding: '6px 12px', backgroundColor: '#646cff', color: '#fff', borderRadius: '4px', textDecoration: 'none' }}>Sign Up</Link>
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
        </Routes>
      </main>
    </div>
  );
}

export default App;