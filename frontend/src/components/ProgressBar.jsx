import React from 'react';

const ProgressBar = ({ progress = 0, color = '#e50914', height = '8px' }) => {
  const clampedProgress = Math.min(100, Math.max(0, progress));

  return (
    <div style={{ width: '100%', backgroundColor: 'rgba(255, 255, 255, 0.1)', borderRadius: '4px', overflow: 'hidden', height }}>
      <div
        style={{
          width: `${clampedProgress}%`,
          backgroundColor: color,
          height: '100%',
          transition: 'width 0.3s ease-in-out'
        }}
      />
    </div>
  );
};

export default ProgressBar;
