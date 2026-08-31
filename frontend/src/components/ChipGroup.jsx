import React from 'react';

const ChipGroup = ({ options = [], selected = [], onToggle }) => {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
      {options.map((opt) => {
        const isSelected = selected.includes(opt.value || opt);
        return (
          <button
            key={opt.value || opt}
            onClick={() => onToggle?.(opt.value || opt)}
            style={{
              padding: '0.35rem 0.8rem', borderRadius: '9999px', fontSize: '0.8rem', fontWeight: 500,
              background: isSelected ? '#a855f7' : '#374151', color: '#ffffff', border: 'none', cursor: 'pointer', transition: 'all 0.2s'
            }}
          >
            {opt.label || opt}
          </button>
        );
      })}
    </div>
  );
};

export default ChipGroup;
