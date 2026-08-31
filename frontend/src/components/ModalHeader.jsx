import React from 'react';

const ModalHeader = ({ title, onClose }) => {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '1rem',
      borderBottom: '1px solid #374151', marginBottom: '1rem'
    }}>
      <h2 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 600, color: '#f3f4f6' }}>{title}</h2>
      {onClose && (
        <button onClick={onClose} aria-label="Close modal" style={{
          background: 'none', border: 'none', color: '#9ca3af', fontSize: '1.5rem', cursor: 'pointer', lineHeight: 1
        }}>&times;</button>
      )}
    </div>
  );
};

export default ModalHeader;
