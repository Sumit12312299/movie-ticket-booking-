import React from 'react';

const RatingStars = ({ value = 0, max = 5, size = 20, onChange, readOnly = true }) => {
  const stars = Array.from({ length: max }, (_, i) =>
    value >= i + 1 ? 1 : value >= i + 0.5 ? 0.5 : 0
  );
  return (
    <span style={{ display: 'inline-flex', gap: 2 }} aria-label={value + ' out of ' + max + ' stars'} role="img">
      {stars.map((fill, i) => (
        <svg key={i} width={size} height={size} viewBox="0 0 24 24" style={{ cursor: readOnly ? 'default' : 'pointer', flexShrink: 0 }}
          onClick={() => !readOnly && onChange?.(i + 1)}>
          <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"
            fill={fill > 0 ? '#f59e0b' : '#374151'} />
        </svg>
      ))}
    </span>
  );
};

export default RatingStars;
