import React from 'react';

const SearchInput = ({ value, onChange, placeholder = 'Search movies, theaters...' }) => {
  return (
    <div style={{ position: 'relative', width: '100%' }}>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        placeholder={placeholder}
        style={{
          width: '100%', padding: '0.6rem 1rem 0.6rem 2.2rem', borderRadius: '0.5rem',
          background: '#1f2937', border: '1px solid #374151', color: '#f3f4f6', fontSize: '0.9rem'
        }}
      />
      <span style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }}>🔍</span>
    </div>
  );
};

export default SearchInput;
