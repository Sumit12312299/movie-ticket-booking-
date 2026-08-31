import React from 'react';

const Card = ({ children, title, subtitle, style = {} }) => {
  return (
    <div style={{
      background: '#1f2937', border: '1px solid #374151', borderRadius: '0.75rem', padding: '1.25rem',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', ...style
    }}>
      {(title || subtitle) && (
        <div style={{ marginBottom: '1rem' }}>
          {title && <h3 style={{ margin: 0, fontSize: '1.125rem', fontWeight: 600, color: '#f9fafb' }}>{title}</h3>}
          {subtitle && <p style={{ margin: '0.25rem 0 0', fontSize: '0.875rem', color: '#9ca3af' }}>{subtitle}</p>}
        </div>
      )}
      {children}
    </div>
  );
};

export default Card;
