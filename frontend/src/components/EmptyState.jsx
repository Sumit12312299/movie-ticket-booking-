import React from 'react';

export default function EmptyState({
  title = 'No records found',
  description = 'There are no items to display at this time.',
  icon = '🎬',
  actionLabel,
  onAction,
}) {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center bg-slate-900/40 border border-slate-800/80 rounded-2xl my-6">
      <div className="text-5xl mb-4 select-none">{icon}</div>
      <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
      <p className="text-sm text-slate-400 max-w-sm mb-6">{description}</p>
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-medium text-sm transition shadow-lg shadow-red-600/20"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}
