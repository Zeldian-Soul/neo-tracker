// src/components/TrajectoryRadar.jsx
import { useEffect, useRef } from 'react';

const TrajectoryRadar = ({ asteroid }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !asteroid) return;
    const ctx = canvas.getContext('2d');

    let animationFrameId;
    let progress = 0; // Tracks position along the path (0 to 1)

    // Extract NASA data safely with fallbacks
    const isHazardous = asteroid.is_potentially_hazardous_asteroid;
    const color = isHazardous ? '#ff4444' : '#00f3ff';
    const missDistanceKm = parseFloat(
      asteroid.close_approach_data?.[0]?.miss_distance?.kilometers || '5000000'
    );
    const speedKph = parseFloat(
      asteroid.close_approach_data?.[0]?.relative_velocity?.kilometers_per_hour || '25000'
    );

    // Map miss distance to a visual pixel margin (closer objects pass closer to Earth)
    const minDistancePx = 35;
    const maxDistancePx = 110;
    const normalizedDistance = Math.min(Math.max(missDistanceKm / 15000000, 0), 1);
    const passByOffset = minDistancePx + normalizedDistance * (maxDistancePx - minDistancePx);

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;

      // 1. DRAW RADAR BACKGROUND RINGS
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
      ctx.lineWidth = 1;
      [40, 80, 120].forEach((radius) => {
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
        ctx.stroke();
      });

      // 2. DRAW EARTH (CENTER)
      ctx.beginPath();
      ctx.arc(centerX, centerY, 14, 0, Math.PI * 2);
      ctx.fillStyle = '#1e88e5';
      ctx.fill();
      ctx.lineWidth = 2;
      ctx.strokeStyle = '#64b5f6';
      ctx.stroke();

      // Earth Atmosphere Glow
      ctx.beginPath();
      ctx.arc(centerX, centerY, 18, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(100, 181, 246, 0.3)';
      ctx.stroke();

      // 3. DRAW TRAJECTORY PATH (CURVED FLYBY LINE)
      ctx.beginPath();
      ctx.moveTo(20, centerY + passByOffset);
      ctx.quadraticCurveTo(centerX, centerY - passByOffset + 10, canvas.width - 20, centerY + passByOffset);
      ctx.strokeStyle = isHazardous ? 'rgba(255, 68, 68, 0.3)' : 'rgba(0, 243, 255, 0.3)';
      ctx.setLineDash([4, 4]);
      ctx.stroke();
      ctx.setLineDash([]); // Reset dash

      // 4. CALCULATE ASTEROID POSITION ALONG CURVE
      // Quadratic Bezier Curve formula: (1-t)^2*P0 + 2(1-t)t*P1 + t^2*P2
      const t = progress;
      const x = Math.pow(1 - t, 2) * 20 + 2 * (1 - t) * t * centerX + Math.pow(t, 2) * (canvas.width - 20);
      const y = Math.pow(1 - t, 2) * (centerY + passByOffset) + 
                2 * (1 - t) * t * (centerY - passByOffset + 10) + 
                Math.pow(t, 2) * (centerY + passByOffset);

      // 5. DRAW ASTEROID GLOW & BODY
      ctx.beginPath();
      ctx.arc(x, y, 8, 0, Math.PI * 2);
      ctx.fillStyle = color;
      ctx.shadowColor = color;
      ctx.shadowBlur = 15;
      ctx.fill();
      ctx.shadowBlur = 0; // Reset blur

      // Advance animation speed based on relative velocity
      const speedFactor = Math.min(Math.max(speedKph / 1000000, 0.003), 0.008);
      progress += speedFactor;
      if (progress > 1) progress = 0; // Loop animation

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [asteroid]);

  return (
    <div className="glass-card" style={{ padding: '20px', textAlign: 'center', marginBottom: '25px' }}>
      <h3 style={{ margin: '0 0 10px 0', color: 'var(--neon-blue)', fontSize: '1.1rem' }}>
        Close Approach Radar Simulation
      </h3>
      <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '15px' }}>
        Visualizing flyby trajectory relative to Earth (Center Blue Sphere)
      </p>

      <canvas
        ref={canvasRef}
        width={320}
        height={260}
        style={{
          background: 'rgba(0, 0, 0, 0.4)',
          border: '1px solid var(--glass-border)',
          borderRadius: '8px',
          maxWidth: '100%',
          display: 'block',
          margin: '0 auto'
        }}
      />

      {/* Official NASA 3D Simulation Button */}
      {asteroid?.nasa_jpl_url && (
        <a
          href={asteroid.nasa_jpl_url}
          target="_blank"
          rel="noopener noreferrer"
          className="neon-btn"
          style={{ display: 'inline-block', marginTop: '15px', textDecoration: 'none', fontSize: '0.8rem' }}
        >
          Launch NASA 3D JPL Orbit Simulator ↗
        </a>
      )}
    </div>
  );
};

export default TrajectoryRadar;