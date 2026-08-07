import React from 'react';

export default function LoadingSpinner({ fullScreen = false, size = 'md' }) {
  const dim = size === 'lg' ? 56 : size === 'sm' ? 28 : 40;
  const border = size === 'lg' ? 4 : 3;

  const spinner = (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '14px' }}>
      <div style={{
        width: `${dim}px`, height: `${dim}px`,
        border: `${border}px solid rgba(0,168,225,0.15)`,
        borderTop: `${border}px solid #00a8e1`,
        borderRadius: '50%',
        animation: 'pv-spin 0.75s linear infinite',
      }} />
      <style>{`@keyframes pv-spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );

  if (fullScreen) {
    return (
      <div style={{
        position: 'fixed', inset: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: 'rgba(15,23,30,0.85)', zIndex: 9999, backdropFilter: 'blur(4px)',
      }}>
        {spinner}
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: '48px 0' }}>
      {spinner}
    </div>
  );
}
