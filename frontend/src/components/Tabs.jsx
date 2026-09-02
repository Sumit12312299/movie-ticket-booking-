import React, { useState } from 'react';

const Tabs = ({ tabs = [], activeTab, onChange, children }) => {
  const [current, setCurrent] = useState(activeTab || tabs[0]?.id);

  const handleSelect = (id) => {
    setCurrent(id);
    onChange?.(id);
  };

  return (
    <div>
      <div style={{ display: 'flex', borderBottom: '1px solid rgba(255,255,255,0.1)', gap: '1rem', marginBottom: '1rem' }}>
        {tabs.map((tab) => {
          const isActive = (activeTab !== undefined ? activeTab : current) === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => handleSelect(tab.id)}
              style={{
                padding: '0.6rem 1rem',
                border: 'none',
                background: 'none',
                borderBottom: isActive ? '2px solid #a855f7' : '2px solid transparent',
                color: isActive ? '#a855f7' : '#9ca3af',
                fontWeight: isActive ? 600 : 400,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
            >
              {tab.label}
            </button>
          );
        })}
      </div>
      <div>{children}</div>
    </div>
  );
};

export default Tabs;
