import React from 'react';

const ProgressBar = ({ value = 0, max = 100, label, color = '#a855f7', indeterminate = false }) => {
  const pct = indeterminate ? 100 : Math.min(100, Math.max(0, (value / max) * 100));
  return (
    <div role="progressbar" aria-valuenow={value} aria-valuemin={0} aria-valuemax={max} aria-label={label}>
      {label && (
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem', fontSize: '0.8rem', color: 'var(--text-muted, #9ca3af)' }}>
          <span>{label}</span>
          {!indeterminate && <span>{Math.round(pct)}%</span>}
        </div>
      )}
      <div style={{ height: 8, borderRadius: 99, background: 'rgba(255,255,255,0.1)', overflow: 'hidden' }}>
        <div style={{
          height: '100%', width: pct + '%', background: color, borderRadius: 99,
          transition: indeterminate ? 'none' : 'width 0.4s ease',
        }} />
      </div>
    </div>
  );
};

export default ProgressBar;
