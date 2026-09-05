import React from 'react';

const SkeletonLoader = ({ width = '100%', height = '20px', borderRadius = '4px', className = '' }) => {
  return (
    <div
      className={`skeleton-loader ${className}`}
      style={{
        width,
        height,
        borderRadius,
        backgroundColor: '#2a2d3d',
        opacity: 0.6,
        animation: 'pulse 1.5s infinite ease-in-out',
      }}
    />
  );
};

export default SkeletonLoader;
