import React from 'react';

const Switch = ({ checked = false, onChange, label, disabled = false }) => {
  return (
    <label style={{ display: 'inline-flex', alignItems: 'center', gap: '0.6rem', cursor: disabled ? 'not-allowed' : 'pointer', opacity: disabled ? 0.6 : 1 }}>
      <div
        onClick={() => !disabled && onChange?.(!checked)}
        style={{
          width: 42,
          height: 24,
          borderRadius: 12,
          background: checked ? '#a855f7' : 'rgba(255,255,255,0.15)',
          padding: 2,
          transition: 'background 0.25s ease',
          position: 'relative',
        }}
      >
        <div
          style={{
            width: 20,
            height: 20,
            borderRadius: '50%',
            background: '#fff',
            transform: checked ? 'translateX(18px)' : 'translateX(0)',
            transition: 'transform 0.25s ease',
          }}
        />
      </div>
      {label && <span style={{ fontSize: '0.875rem', color: 'var(--text-primary, #f9fafb)' }}>{label}</span>}
    </label>
  );
};

export default Switch;
