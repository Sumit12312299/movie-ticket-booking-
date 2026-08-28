import React from 'react';

/**
 * Reusable LoadingSpinner component.
 * @param {Object} props
 * @param {'sm'|'md'|'lg'} [props.size='md'] - Size variant of spinner.
 * @param {string} [props.label] - Optional loading message text.
 * @param {string} [props.className] - Additional wrapper CSS classes.
 */
const LoadingSpinner = ({ size = 'md', label = '', className = '' }) => {
  const sizeClasses = {
    sm: 'w-5 h-5 border-2',
    md: 'w-8 h-8 border-3',
    lg: 'w-12 h-12 border-4',
  };

  return (
    <div className={`flex flex-col items-center justify-center p-4 ${className}`}>
      <div
        className={`${sizeClasses[size] || sizeClasses.md} border-[#FF5F45] border-t-transparent rounded-full animate-spin`}
        role="status"
        aria-label="Loading..."
      />
      {label && (
        <p className="mt-3 text-sm font-medium text-slate-400 animate-pulse">
          {label}
        </p>
      )}
    </div>
  );
};

export default LoadingSpinner;
