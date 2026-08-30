import React from 'react';

const Tag = ({ label, color = '#a855f7', onRemove, onClick }) => (
  <span
    onClick={onClick}
    style={{
      display: 'inline-flex', alignItems: 'center', gap: '0.3rem',
      padding: '0.2rem 0.65rem', borderRadius: '9999px',
      fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.03em',
      background: color + '22', color: color, border: '1px solid ' + color + '44',
      cursor: onClick ? 'pointer' : 'default', userSelect: 'none', transition: 'opacity 0.2s',
    }}
  >
    {label}
    {onRemove && (
      <button
        onClick={(e) => { e.stopPropagation(); onRemove(); }}
        aria-label={'Remove ' + label}
        style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, color: 'inherit', lineHeight: 1, fontSize: '0.9rem' }}
      >x</button>
    )}
  </span>
);

export default Tag;
