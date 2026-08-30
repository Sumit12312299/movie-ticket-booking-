import React from 'react';

const Divider = ({ orientation = 'horizontal', label, color = 'rgba(255,255,255,0.1)', margin = '1rem 0' }) => {
  if (orientation === 'vertical') {
    return <div style={{ width: 1, alignSelf: 'stretch', background: color, flexShrink: 0 }} />;
  }
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', margin }}>
      <hr style={{ flex: 1, border: 'none', borderTop: '1px solid ' + color, margin: 0 }} />
      {label && <span style={{ fontSize: '0.75rem', color: 'var(--text-muted, #9ca3af)', whiteSpace: 'nowrap' }}>{label}</span>}
      <hr style={{ flex: 1, border: 'none', borderTop: '1px solid ' + color, margin: 0 }} />
    </div>
  );
};

export default Divider;
