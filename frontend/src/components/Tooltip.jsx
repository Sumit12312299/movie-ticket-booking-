import React, { useState } from 'react';

export default function Tooltip({ text, children, position = 'top' }) {
  const [visible, setVisible] = useState(false);

  const positionClasses = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2',
  };

  return (
    <div
      className="relative inline-block"
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
    >
      {children}
      {visible && text && (
        <div
          className={`absolute ${positionClasses[position] || positionClasses.top} z-40 px-2.5 py-1 text-xs font-medium text-white bg-slate-800 border border-slate-700 rounded-md shadow-lg whitespace-nowrap pointer-events-none transition-opacity duration-200`}
        >
          {text}
        </div>
      )}
    </div>
  );
}
