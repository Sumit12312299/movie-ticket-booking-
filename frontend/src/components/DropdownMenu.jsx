import React, { useState } from 'react';

const DropdownMenu = ({ triggerLabel, items = [] }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      <button onClick={() => setIsOpen(!isOpen)} style={{
        padding: '0.5rem 1rem', borderRadius: '0.375rem', background: '#374151', color: '#fff', border: 'none', cursor: 'pointer'
      }}>
        {triggerLabel} ▾
      </button>
      {isOpen && (
        <div style={{
          position: 'absolute', top: '100%', left: 0, marginTop: '0.25rem', background: '#1f2937',
          border: '1px solid #374151', borderRadius: '0.375rem', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.3)', zIndex: 1000, minWidth: '150px'
        }}>
          {items.map((item, i) => (
            <div key={i} onClick={() => { item.onClick?.(); setIsOpen(false); }} style={{
              padding: '0.5rem 1rem', color: '#e5e7eb', cursor: 'pointer', fontSize: '0.875rem'
            }}>
              {item.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DropdownMenu;
