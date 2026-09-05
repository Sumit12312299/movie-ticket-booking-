import React from 'react';

const EmptyState = ({ title = 'No Data Found', description = 'There are no items to display right now.', icon = '🎬' }) => {
  return (
    <div style={{ textAlign: 'center', padding: '40px 20px', color: '#8b9bb4' }}>
      <div style={{ fontSize: '3rem', marginBottom: '12px' }}>{icon}</div>
      <h3 style={{ color: '#ffffff', marginBottom: '8px' }}>{title}</h3>
      <p style={{ margin: 0, fontSize: '0.95rem' }}>{description}</p>
    </div>
  );
};

export default EmptyState;
