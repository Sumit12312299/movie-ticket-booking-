import React from 'react';

export default function RatingStars({ rating = 0, max = 5, onChange, readonly = true, size = 'md' }) {
  const sizeClasses = {
    sm: 'text-sm gap-0.5',
    md: 'text-base gap-1',
    lg: 'text-xl gap-1.5',
  };

  const stars = Array.from({ length: max }, (_, index) => {
    const starValue = index + 1;
    const isFilled = rating >= starValue;
    const isHalf = !isFilled && rating >= starValue - 0.5;

    return (
      <button
        key={index}
        type="button"
        disabled={readonly}
        onClick={() => !readonly && onChange?.(starValue)}
        className={`${readonly ? 'cursor-default' : 'cursor-pointer hover:scale-110 transition'} focus:outline-none`}
        aria-label={`Rate ${starValue} stars`}
      >
        <span className={isFilled ? 'text-amber-400' : isHalf ? 'text-amber-300' : 'text-slate-600'}>
          ★
        </span>
      </button>
    );
  });

  return <div className={`inline-flex items-center ${sizeClasses[size] || sizeClasses.md}`}>{stars}</div>;
}
