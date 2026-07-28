// src/components/VerifyEmail.jsx
import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';

const VerifyEmail = () => {
  // Grab the token from the URL (e.g., /verify/12345abcd)
  const { token } = useParams();
  
  // Track the current state of verification
  const [status, setStatus] = useState('verifying'); // 'verifying', 'success', or 'error'
  const [message, setMessage] = useState('Establishing secure connection to NEO network...');

  useEffect(() => {
    const verifyAccount = async () => {
      try {
        // Send the token to our Express backend
        const response = await axios.get(`http://localhost:5000/api/auth/verify/${token}`);
        
        // The backend sends back the permanent user data and auth token
        const { user, token: authToken } = response.data;
        
        // Automatically log the user in by saving to localStorage
        localStorage.setItem('user', JSON.stringify(user));
        localStorage.setItem('token', authToken);
        axios.defaults.headers.common['Authorization'] = `Bearer ${authToken}`;
        
        setStatus('success');
        setMessage('Transmission received. Account verified successfully!');
        
        // Force a page reload to the dashboard after 2 seconds so AuthContext updates
        setTimeout(() => {
          window.location.href = '/'; 
        }, 2000);

      } catch (err) {
        setStatus('error');
        setMessage(err.response?.data?.error || 'Verification sequence failed. The link may have expired.');
      }
    };

    // Only run the verification if we have a token
    if (token) {
      verifyAccount();
    }
  }, [token]);

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="glass-card" 
        style={{ padding: '40px', textAlign: 'center', maxWidth: '500px', width: '100%' }}
      >
        <h2 style={{ color: 'var(--neon-blue)', marginBottom: '20px' }}>
          Network Authorization
        </h2>
        
        <p style={{ fontSize: '1.1rem', marginBottom: '30px', color: status === 'error' ? '#ff4444' : 'var(--text-main)' }}>
          {message}
        </p>

        {status === 'verifying' && (
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
            style={{ fontSize: '3rem', margin: '0 auto', width: '50px' }}
          >
            ☄️
          </motion.div>
        )}

        {status === 'error' && (
          <Link to="/signup" className="neon-btn" style={{ textDecoration: 'none' }}>
            Return to Signup
          </Link>
        )}
      </motion.div>
    </div>
  );
};

export default VerifyEmail;