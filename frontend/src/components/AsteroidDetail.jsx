// src/components/AsteroidDetail.jsx
import { useState, useEffect, useContext } from 'react';
import { useLocation, useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext'; // 1. Import the context

const AsteroidDetail = () => {
  const { id } = useParams();
  const location = useLocation();
  const asteroid = location.state?.asteroid;

  // 2. Extract the logged-in user from AuthContext
  const { user } = useContext(AuthContext);

  const [comments, setComments] = useState([]);
  // We removed the manual username state!
  const [text, setText] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState('');

  const fetchComments = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/neo/comments/${id}`);
      setComments(response.data.data || []);
    } catch (err) {
      console.error("Error fetching comments from database:", err);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [id]);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim()) {
      setFeedback("Please enter a comment before posting.");
      return;
    }

    try {
      setSubmitting(true);
      setFeedback('');

      await axios.post('http://localhost:5000/api/neo/comments', {
        asteroidId: id,
        username: user.username, // 3. Automatically use the authenticated user's name
        text
      });

      setText('');
      setFeedback('✅ Comment posted successfully!');
      setSubmitting(false);
      fetchComments();
    } catch (err) {
      console.error("Error saving comment:", err);
      setFeedback('❌ Failed to save comment. Check if backend is running.');
      setSubmitting(false);
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'left' }}>
      <Link to="/" style={{ color: '#646cff', textDecoration: 'none' }}>← Back to Dashboard</Link>
      
      <h2>Asteroid: {asteroid?.name || id}</h2>
      
      {asteroid ? (
        <div style={{ backgroundColor: '#222', padding: '15px', borderRadius: '8px', marginBottom: '20px' }}>
          <p><strong>NASA ID:</strong> {asteroid.id}</p>
          <p><strong>Potentially Hazardous:</strong> {asteroid.is_potentially_hazardous_asteroid ? "⚠️ YES" : "✅ NO"}</p>
          <p>
            <strong>Estimated Diameter:</strong>{' '}
            {asteroid.estimated_diameter?.meters
              ? `${Math.round(asteroid.estimated_diameter.meters.estimated_diameter_min)}m - ${Math.round(asteroid.estimated_diameter.meters.estimated_diameter_max)}m`
              : 'N/A'}
          </p>
          <p><strong>Absolute Magnitude:</strong> {asteroid.absolute_magnitude_h ?? 'N/A'}</p>
        </div>
      ) : (
        <div style={{ backgroundColor: '#222', padding: '15px', borderRadius: '8px', marginBottom: '20px', color: '#aaa' }}>
          <p>⚠️ <em>Detailed trajectory parameters unavailable (page refreshed). You can still view and post community discussions below for ID: {id}</em></p>
        </div>
      )}

      <hr style={{ margin: '20px 0', borderColor: '#444' }} />

      <h3>Community Discussions ({comments.length})</h3>

      {/* 4. Conditional Rendering for the Comment Form */}
      {user ? (
        <form onSubmit={handleCommentSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
          <div style={{ fontSize: '0.9em', color: '#aaa' }}>
            Posting as: <strong style={{ color: '#fff' }}>{user.username}</strong>
          </div>
          <div>
            <textarea 
              placeholder="Share your thoughts about this Near-Earth Object..." 
              value={text} 
              onChange={(e) => setText(e.target.value)}
              rows="3"
              style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #555', backgroundColor: '#1a1a1a', color: '#fff' }}
            />
          </div>
          <button 
            type="submit" 
            disabled={submitting}
            style={{ padding: '8px 16px', backgroundColor: '#646cff', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', alignSelf: 'flex-start' }}
          >
            {submitting ? 'Posting...' : 'Post Comment'}
          </button>
          {feedback && <p style={{ marginTop: '5px', fontSize: '0.9em' }}>{feedback}</p>}
        </form>
      ) : (
        <div style={{ backgroundColor: '#2a2a2a', padding: '15px', borderRadius: '8px', marginBottom: '20px', borderLeft: '4px solid #646cff' }}>
          <p style={{ margin: 0 }}>
            Want to join the discussion? <Link to="/login" style={{ color: '#646cff', fontWeight: 'bold' }}>Log in</Link> or <Link to="/signup" style={{ color: '#646cff', fontWeight: 'bold' }}>Sign up</Link> to post a comment.
          </p>
        </div>
      )}

      {/* Comment List */}
      <div>
        {comments.length === 0 ? (
          <p style={{ color: '#aaa' }}>No comments posted yet for this asteroid. Be the first!</p>
        ) : (
          comments.map((comment) => (
            <div key={comment._id} style={{ borderBottom: '1px solid #333', padding: '15px 0' }}>
              <strong style={{ color: '#646cff' }}>{comment.username}</strong>
              <span style={{ fontSize: '0.8em', color: '#888', marginLeft: '10px' }}>
                {comment.createdAt ? new Date(comment.createdAt).toLocaleDateString() : ''}
              </span>
              <p style={{ margin: '8px 0 0 0', lineHeight: '1.4' }}>{comment.text}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AsteroidDetail;