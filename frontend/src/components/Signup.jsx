// src/components/Signup.jsx
import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const Signup = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { register } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setError('');
      await register(username, email, password);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to sign up.');
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '40px auto', textAlign: 'left', backgroundColor: '#222', padding: '20px', borderRadius: '8px' }}>
      <h2>Create an Account</h2>
      {error && <p style={{ color: '#ff4444' }}>{error}</p>}
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <input 
          type="text" 
          placeholder="Username" 
          value={username} 
          onChange={(e) => setUsername(e.target.value)} 
          required 
          style={{ padding: '10px', borderRadius: '4px', border: '1px solid #444', backgroundColor: '#111', color: '#fff' }}
        />
        <input 
          type="email" 
          placeholder="Email" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
          required 
          style={{ padding: '10px', borderRadius: '4px', border: '1px solid #444', backgroundColor: '#111', color: '#fff' }}
        />
        <input 
          type="password" 
          placeholder="Password (min 6 chars)" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
          required 
          style={{ padding: '10px', borderRadius: '4px', border: '1px solid #444', backgroundColor: '#111', color: '#fff' }}
        />
        <button type="submit" style={{ padding: '10px', backgroundColor: '#646cff', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
          Sign Up
        </button>
      </form>
      <p style={{ marginTop: '15px' }}>
        Already have an account? <Link to="/login" style={{ color: '#646cff' }}>Log in</Link>
      </p>
    </div>
  );
};

export default Signup;