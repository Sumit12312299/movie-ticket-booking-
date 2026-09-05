import React from 'react';

const Divider = ({ label, margin = '16px 0' }) => {
  return (
    <div style={{ display: 'flex', alignItems: 'center', margin }}>
      <div style={{ flex: 1, height: '1px', backgroundColor: 'rgba(255, 255, 255, 0.12)' }} />
      {label && <span style={{ padding: '0 12px', fontSize: '0.85rem', color: '#8b9bb4' }}>{label}</span>}
      <div style={{ flex: 1, height: '1px', backgroundColor: 'rgba(255, 255, 255, 0.12)' }} />
    </div>
  );
};

export default Divider;
