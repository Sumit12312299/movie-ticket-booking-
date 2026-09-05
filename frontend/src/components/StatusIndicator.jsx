import React from 'react';

const StatusIndicator = ({ status = 'online', label }) => {
  const colors = {
    online: '#4caf50',
    busy: '#f44336',
    filling: '#ff9800',
  };

  const color = colors[status] || colors.online;

  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
      <span
        style={{
          width: '8px',
          height: '8px',
          borderRadius: '50%',
          backgroundColor: color,
          display: 'inline-block',
          boxShadow: `0 0 6px ${color}`
        }}
      />
      {label && <span style={{ fontSize: '0.85rem', color: '#cbd5e1' }}>{label}</span>}
    </div>
  );
};

export default StatusIndicator;
