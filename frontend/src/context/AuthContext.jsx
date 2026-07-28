// src/context/AuthContext.jsx
import { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Check if user is already logged in on page load
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    
    // DEFENSIVE CHECK: Ensure storedUser is not the literal string 'undefined'
    if (storedUser && storedUser !== 'undefined' && token) {
      try {
        setUser(JSON.parse(storedUser));
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      } catch (error) {
        console.error("Failed to parse user from local storage. Clearing corrupted data.");
        // If data is corrupted, wipe it so the app doesn't crash
        localStorage.removeItem('user');
        localStorage.removeItem('token');
      }
    } else {
      // Clean up the bad 'undefined' string if it snuck in
      if (storedUser === 'undefined') {
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const response = await axios.post('http://localhost:5000/api/auth/login', { email, password });
    const { user, token } = response.data;
    
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('token', token);
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    
    setUser(user);
    navigate('/');
  };

  const register = async (username, email, password) => {
    const response = await axios.post('http://localhost:5000/api/auth/register', { username, email, password });
    // Note: Our new register flow initiates an email and doesn't return a full user/token to log in yet.
    // If you plan to automatically log them in later, it would be handled in the VerifyEmail component!
    return response.data;
  };

  const logout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
    setUser(null);
    navigate('/login');
  };

  if (loading) return <div>Initializing Systems...</div>;

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};