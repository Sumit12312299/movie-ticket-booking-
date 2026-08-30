import React from 'react';

const EmptyState = ({ icon = 'No Data', title = 'Nothing here yet', description = '', action, actionLabel = 'Try again' }) => (
  <div style={{
    display: 'flex', flexDirection: 'column', alignItems: 'center',
    justifyContent: 'center', padding: '3rem 1.5rem', textAlign: 'center',
    color: 'var(--text-muted, #9ca3af)',
  }}>
    <h3 style={{ margin: '0 0 0.5rem', fontSize: '1.25rem', fontWeight: 600, color: 'var(--text-primary, #f9fafb)' }}>
      {title}
    </h3>
    {description && <p style={{ margin: '0 0 1.5rem', maxWidth: 360 }}>{description}</p>}
    {action && (
      <button onClick={action} style={{
        padding: '0.6rem 1.4rem', borderRadius: '0.5rem', border: 'none',
        background: 'var(--primary, #a855f7)', color: '#fff', cursor: 'pointer', fontWeight: 600,
      }}>
        {actionLabel}
      </button>
    )}
  </div>
);

export default EmptyState;
