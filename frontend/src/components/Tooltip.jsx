import React, { useState } from 'react';

const Tooltip = ({ text, position = 'top', children }) => {
  const [visible, setVisible] = useState(false);
  const placements = {
    top:    { bottom: 'calc(100% + 6px)', left: '50%', transform: 'translateX(-50%)' },
    bottom: { top:    'calc(100% + 6px)', left: '50%', transform: 'translateX(-50%)' },
    left:   { right:  'calc(100% + 6px)', top:  '50%', transform: 'translateY(-50%)' },
    right:  { left:   'calc(100% + 6px)', top:  '50%', transform: 'translateY(-50%)' },
  };
  return (
    <span
      style={{ position: 'relative', display: 'inline-flex' }}
      onMouseEnter={() => setVisible(true)} onMouseLeave={() => setVisible(false)}
      onFocus={() => setVisible(true)}       onBlur={() => setVisible(false)}
    >
      {children}
      {visible && text && (
        <span style={{
          position: 'absolute', ...placements[position],
          background: 'rgba(17,17,27,0.95)', color: '#e2e8f0',
          padding: '0.3rem 0.6rem', borderRadius: '0.375rem',
          fontSize: '0.75rem', whiteSpace: 'nowrap', pointerEvents: 'none',
          zIndex: 9999, boxShadow: '0 4px 12px rgba(0,0,0,0.4)',
        }}>
          {text}
        </span>
      )}
    </span>
  );
};

export default Tooltip;
