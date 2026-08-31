import React from 'react';

const AlertBanner = ({ message, type = 'info', onClose }) => {
  const colors = {
    info: { bg: 'rgba(59, 130, 246, 0.15)', border: '#3b82f6', text: '#60a5fa' },
    success: { bg: 'rgba(16, 185, 129, 0.15)', border: '#10b981', text: '#34d399' },
    error: { bg: 'rgba(239, 68, 68, 0.15)', border: '#ef4444', text: '#f87171' },
  };
  const theme = colors[type] || colors.info;

  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem 1rem',
      borderRadius: '0.5rem', background: theme.bg, borderLeft: 4px solid , color: theme.text, marginBottom: '1rem'
    }}>
      <span>{message}</span>
      {onClose && (
        <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', fontWeight: 700 }}>&times;</button>
      )}
    </div>
  );
};

export default AlertBanner;
