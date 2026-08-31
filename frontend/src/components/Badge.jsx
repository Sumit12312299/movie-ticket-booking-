import React from 'react';

const Badge = ({ children, variant = 'primary', size = 'medium' }) => {
  const variants = {
    primary: { bg: 'rgba(168, 85, 247, 0.15)', color: '#a855f7', border: '1px solid rgba(168, 85, 247, 0.3)' },
    success: { bg: 'rgba(16, 185, 129, 0.15)', color: '#10b981', border: '1px solid rgba(16, 185, 129, 0.3)' },
    warning: { bg: 'rgba(245, 158, 11, 0.15)', color: '#f59e0b', border: '1px solid rgba(245, 158, 11, 0.3)' },
    danger:  { bg: 'rgba(239, 68, 68, 0.15)', color: '#ef4444', border: '1px solid rgba(239, 68, 68, 0.3)' },
  };
  const style = variants[variant] || variants.primary;

  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', padding: size === 'small' ? '0.15rem 0.4rem' : '0.25rem 0.6rem',
      borderRadius: '9999px', fontSize: size === 'small' ? '0.7rem' : '0.8rem', fontWeight: 600,
      background: style.bg, color: style.color, border: style.border,
    }}>
      {children}
    </span>
  );
};

export default Badge;
