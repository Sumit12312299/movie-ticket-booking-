import React, { useState } from 'react';

const Accordion = ({ title, children, defaultOpen = false }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div style={{ border: '1px solid #374151', borderRadius: '0.5rem', marginBottom: '0.5rem', overflow: 'hidden' }}>
      <button onClick={() => setIsOpen(!isOpen)} style={{
        width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '0.875rem 1rem', background: '#1f2937', color: '#f9fafb', border: 'none', cursor: 'pointer', fontWeight: 600
      }}>
        <span>{title}</span>
        <span>{isOpen ? '▲' : '▼'}</span>
      </button>
      {isOpen && (
        <div style={{ padding: '1rem', background: '#111827', color: '#d1d5db', fontSize: '0.9rem' }}>
          {children}
        </div>
      )}
    </div>
  );
};

export default Accordion;
