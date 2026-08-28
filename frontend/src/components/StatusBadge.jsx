import React from 'react';

/**
 * StatusBadge component to render contextual badges.
 * @param {Object} props
 * @param {'success'|'warning'|'danger'|'info'|'default'} [props.variant='default'] - Color variant.
 * @param {React.ReactNode} props.children - Badge content.
 * @param {string} [props.className] - Extra Tailwind CSS classes.
 */
const StatusBadge = ({ variant = 'default', children, className = '' }) => {
  const variantStyles = {
    success: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    warning: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    danger: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
    info: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    default: 'bg-slate-800 text-slate-300 border-slate-700',
  };

  const styleClass = variantStyles[variant] || variantStyles.default;

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border transition-colors ${styleClass} ${className}`}
    >
      {children}
    </span>
  );
};

export default StatusBadge;
