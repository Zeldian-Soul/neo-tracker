// src/components/AsteroidDetail.jsx
import { useState, useEffect, useContext } from 'react';
import { useLocation, useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { motion } from 'framer-motion';
import TrajectoryRadar from './TrajectoryRadar';

// ==========================================
// 1. HELPER: RELATIVE TIME ("TIME AGO")
// ==========================================
const timeAgo = (dateString) => {
  if (!dateString) return '';
  const now = new Date();
  const past = new Date(dateString);
  const diffInSeconds = Math.floor((now - past) / 1000);

  if (diffInSeconds < 30) return 'just now';
  if (diffInSeconds < 60) return `${diffInSeconds} seconds ago`;

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) return `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`;

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 30) return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;

  const diffInMonths = Math.floor(diffInDays / 30);
  if (diffInMonths < 12) return `${diffInMonths} month${diffInMonths > 1 ? 's' : ''} ago`;

  const diffInYears = Math.floor(diffInDays / 365);
  return `${diffInYears} year${diffInYears > 1 ? 's' : ''} ago`;
};

// ==========================================
// 2. RECURSIVE COMMENT NODE COMPONENT
// ==========================================
const CommentNode = ({ 
  comment, 
  depth = 0, 
  comments, 
  user, 
  replyingTo, 
  setReplyingTo, 
  replyText, 
  setReplyText, 
  submitComment 
}) => {
  // Filter direct replies to THIS comment
  const replies = comments.filter(c => c.parentId && String(c.parentId) === String(comment._id));

  // YouTube-style accordion toggle state (Hidden by default)
  const [showReplies, setShowReplies] = useState(false);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      style={{ 
        marginLeft: depth > 0 ? '24px' : '0px', 
        marginTop: '12px',
        borderLeft: depth > 0 ? '2px solid var(--neon-purple)' : 'none',
        paddingLeft: depth > 0 ? '12px' : '0px'
      }}
    >
      <div className="glass-card" style={{ padding: '14px', border: '1px solid #333' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <strong style={{ color: 'var(--neon-purple)' }}>{comment.username}</strong>
          
          {/* Using our custom Time Ago formatter */}
          <span style={{ fontSize: '0.8em', color: 'var(--text-muted)' }}>
            {timeAgo(comment.createdAt)}
          </span>
        </div>

        <p style={{ margin: '8px 0', lineHeight: '1.4' }}>{comment.text}</p>

        {user && (
          <button 
            onClick={() => setReplyingTo(replyingTo === comment._id ? null : comment._id)}
            style={{ 
              background: 'none', 
              border: 'none', 
              color: 'var(--neon-blue)', 
              cursor: 'pointer', 
              fontSize: '0.85em', 
              padding: 0,
              marginTop: '4px'
            }}
          >
            {replyingTo === comment._id ? 'Cancel Reply' : 'Reply 💬'}
          </button>
        )}

        {/* Inline Reply Form */}
        {replyingTo === comment._id && (
          <motion.form 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            onSubmit={(e) => {
              submitComment(e, comment._id);
              setShowReplies(true); // Automatically open the replies list after posting a reply!
            }} 
            style={{ marginTop: '10px', display: 'flex', gap: '10px' }}
          >
            <input 
              type="text" 
              value={replyText} 
              onChange={(e) => setReplyText(e.target.value)} 
              placeholder={`Reply to ${comment.username}...`}
              style={{ flex: 1, padding: '8px 12px', borderRadius: '4px' }}
              autoFocus
            />
            <button type="submit" className="neon-btn" style={{ padding: '6px 14px' }}>
              Post
            </button>
          </motion.form>
        )}

        {/* YOUTUBE-STYLE REPLY ACCORDION BUTTON */}
        {replies.length > 0 && (
          <div style={{ marginTop: '10px', paddingTop: '8px', borderTop: '1px solid #222' }}>
            <button
              onClick={() => setShowReplies(!showReplies)}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--neon-blue)',
                cursor: 'pointer',
                fontSize: '0.85em',
                fontWeight: 'bold',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: 0
              }}
            >
              {showReplies ? '▲ Hide replies' : `▼ Show ${replies.length} repl${replies.length > 1 ? 'ies' : 'y'}`}
            </button>
          </div>
        )}
      </div>

      {/* Render Sub-Replies ONLY if showReplies is true */}
      {showReplies && replies.length > 0 && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
        >
          {replies.map(reply => (
            <CommentNode 
              key={reply._id} 
              comment={reply} 
              depth={depth + 1} 
              comments={comments}
              user={user}
              replyingTo={replyingTo}
              setReplyingTo={setReplyingTo}
              replyText={replyText}
              setReplyText={setReplyText}
              submitComment={submitComment}
            />
          ))}
        </motion.div>
      )}
    </motion.div>
  );
};

// ==========================================
// 3. MAIN ASTEROID DETAIL PAGE COMPONENT
// ==========================================
const AsteroidDetail = () => {
  const { id } = useParams();
  const location = useLocation();
  const asteroid = location.state?.asteroid;
  const { user } = useContext(AuthContext);

  const [comments, setComments] = useState([]);
  const [text, setText] = useState('');
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyText, setReplyText] = useState('');

  // NOTE: Replace http://localhost:5000 with your Render Cloud URL if deployed!
  const API_URL = "http://localhost:5000";

  const fetchComments = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/neo/comments/${id}`);
      setComments(response.data.data || []);
    } catch (err) {
      console.error("Error fetching comments:", err);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [id]);

  const submitComment = async (e, parentId = null) => {
    e.preventDefault();
    const commentText = parentId ? replyText : text;
    if (!commentText.trim()) return;

    try {
      await axios.post(`${API_URL}/api/neo/comments`, {
        asteroidId: id,
        username: user.username,
        text: commentText,
        parentId: parentId
      });
      setText('');
      setReplyText('');
      setReplyingTo(null);
      fetchComments();
    } catch (err) {
      console.error("Error saving comment:", err);
    }
  };

  // Only select top-level comments (where parentId is null or undefined)
  const rootComments = comments.filter(c => !c.parentId);

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'left', paddingBottom: '50px' }}>
      <Link to="/" style={{ color: 'var(--neon-blue)', textDecoration: 'none' }}>← Back to Dashboard</Link>
      
      <h2 style={{ marginTop: '20px' }}>Asteroid: {asteroid?.name || id}</h2>
      <hr style={{ margin: '20px 0', borderColor: '#444' }} />

      {asteroid && <TrajectoryRadar asteroid={asteroid} />}

      <h3>Community Discussions ({comments.length})</h3>

      {user ? (
        <form onSubmit={(e) => submitComment(e, null)} style={{ marginBottom: '30px' }}>
          <textarea 
            placeholder="Log your observation..." 
            value={text} 
            onChange={(e) => setText(e.target.value)}
            rows="3"
            style={{ width: '100%', padding: '12px', borderRadius: '8px', marginBottom: '10px' }}
          />
          <button type="submit" className="neon-btn">Transmit Log</button>
        </form>
      ) : (
        <div className="glass-card" style={{ padding: '15px', marginBottom: '30px', borderLeft: '4px solid var(--neon-purple)' }}>
          <p style={{ margin: 0 }}>
            Want to join the network? <Link to="/login" style={{ color: 'var(--neon-purple)', fontWeight: 'bold' }}>Log in</Link> or <Link to="/signup" style={{ color: 'var(--neon-purple)', fontWeight: 'bold' }}>Sign up</Link>.
          </p>
        </div>
      )}

      <div>
        {rootComments.length === 0 ? (
          <p style={{ color: 'var(--text-muted)' }}>No logs transmitted yet. Be the first!</p>
        ) : (
          rootComments.map((comment) => (
            <CommentNode 
              key={comment._id} 
              comment={comment} 
              depth={0} 
              comments={comments}
              user={user}
              replyingTo={replyingTo}
              setReplyingTo={setReplyingTo}
              replyText={replyText}
              setReplyText={setReplyText}
              submitComment={submitComment}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default AsteroidDetail;