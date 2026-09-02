import React, { useState } from 'react';

const RatingPicker = ({ max = 5, value = 0, onChange }) => {
  const [hovered, setHovered] = useState(0);

  return (
    <div style={{ display: 'inline-flex', gap: '0.25rem' }}>
      {Array.from({ length: max }, (_, i) => {
        const starValue = i + 1;
        const isFilled = starValue <= (hovered || value);
        return (
          <span
            key={i}
            onMouseEnter={() => setHovered(starValue)}
            onMouseLeave={() => setHovered(0)}
            onClick={() => onChange?.(starValue)}
            style={{
              cursor: 'pointer',
              fontSize: '1.5rem',
              color: isFilled ? '#f59e0b' : '#374151',
              transition: 'color 0.15s ease, transform 0.15s ease',
              transform: hovered === starValue ? 'scale(1.2)' : 'scale(1)',
            }}
          >
            ★
          </span>
        );
      })}
    </div>
  );
};

export default RatingPicker;
