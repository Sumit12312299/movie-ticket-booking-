import React, { useEffect } from 'react';

const NotificationToast = ({ message, type = 'info', onClose, duration = 3000 }) => {
  useEffect(() => {
    if (!duration) return;
    const timer = setTimeout(() => onClose?.(), duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const bgColors = {
    info: 'rgba(59, 130, 246, 0.9)',
    success: 'rgba(16, 185, 129, 0.9)',
    warning: 'rgba(245, 158, 11, 0.9)',
    error: 'rgba(239, 68, 68, 0.9)',
  };

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '1.5rem',
        right: '1.5rem',
        padding: '0.75rem 1.25rem',
        borderRadius: '0.5rem',
        background: bgColors[type] || bgColors.info,
        color: '#fff',
        fontWeight: 500,
        boxShadow: '0 10px 25px rgba(0,0,0,0.3)',
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        zIndex: 10000,
        animation: 'slideInRight 0.3s ease',
      }}
    >
      <span>{message}</span>
      {onClose && (
        <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', fontSize: '1rem' }}>
          ×
        </button>
      )}
    </div>
  );
};

export default NotificationToast;
