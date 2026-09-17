import React from 'react';

/**
 * Reusable Badge component with variant styling.
 */
export const Badge = ({
  children,
  variant = 'default',
  size = 'md',
  className = '',
}) => {
  const variantStyles = {
    default: 'bg-white/10 text-gray-300 border-white/10',
    primary: 'bg-red-500/10 text-red-400 border-red-500/20',
    success: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    warning: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    accent: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
    gold: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
  };

  const sizeStyles = {
    sm: 'text-[10px] px-2 py-0.5',
    md: 'text-xs px-2.5 py-1',
    lg: 'text-sm px-3 py-1.5',
  };

  return (
    <span
      className={`inline-flex items-center gap-1 font-medium rounded-full border backdrop-blur-sm transition-all duration-200 ${variantStyles[variant] || variantStyles.default} ${sizeStyles[size] || sizeStyles.md} ${className}`}
    >
      {children}
    </span>
  );
};

export default Badge;
