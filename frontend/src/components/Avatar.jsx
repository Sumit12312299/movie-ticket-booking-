import React from 'react';

const Avatar = ({ src, name = '', size = 36, shape = 'circle', borderColor }) => {
  const initials = name.split(' ').filter(Boolean).slice(0, 2).map((w) => w[0].toUpperCase()).join('');
  const radius   = shape === 'circle' ? '50%' : '0.5rem';
  const colors   = ['#a855f7', '#6366f1', '#ec4899', '#f59e0b', '#10b981'];
  const bg       = colors[(name.charCodeAt(0) || 0) % colors.length];
  const base = {
    width: size, height: size, borderRadius: radius, flexShrink: 0,
    border: borderColor ? '2px solid ' + borderColor : 'none',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: size * 0.38, fontWeight: 700, color: '#fff', background: bg, userSelect: 'none',
  };
  if (src) return <img src={src} alt={name} style={{ ...base, background: 'transparent', objectFit: 'cover' }} />;
  return <div style={base} aria-label={name}>{initials || '?'}</div>;
};

export default Avatar;
