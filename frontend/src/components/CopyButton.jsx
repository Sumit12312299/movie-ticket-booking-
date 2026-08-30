import React from 'react';
import useClipboard from '../utils/useClipboard';

const CopyButton = ({ value, label = 'Copy' }) => {
  const { copy, copied } = useClipboard(2000);
  return (
    <button
      onClick={() => copy(value)}
      title={label}
      aria-label={label}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: '0.3rem',
        background: copied ? 'rgba(16,185,129,0.15)' : 'rgba(255,255,255,0.07)',
        border: '1px solid ' + (copied ? '#10b981' : 'rgba(255,255,255,0.12)'),
        borderRadius: '0.5rem', padding: '0.35rem 0.7rem', cursor: 'pointer',
        color: copied ? '#10b981' : '#e2e8f0', fontSize: '0.8rem', fontWeight: 600,
        transition: 'all 0.25s ease',
      }}
    >
      {copied ? 'Copied!' : label}
    </button>
  );
};

export default CopyButton;
