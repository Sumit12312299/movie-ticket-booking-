import React from 'react';

const LoadingDots = ({ color = '#a855f7', size = 8 }) => {
  const dotStyle = (delay) => ({
    width: size,
    height: size,
    borderRadius: '50%',
    backgroundColor: color,
    display: 'inline-block',
    margin: '0 3px',
    animation: 'loadingDotBounce 1.2s ease-in-out infinite',
    animationDelay: delay,
  });

  return (
    <span aria-label="Loading" role="status" style={{ display: 'inline-flex', alignItems: 'center' }}>
      <span style={dotStyle('0s')} />
      <span style={dotStyle('0.2s')} />
      <span style={dotStyle('0.4s')} />
    </span>
  );
};

export default LoadingDots;
