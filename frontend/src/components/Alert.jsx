import React from 'react';

const alertStyles = {
  info: 'bg-blue-950/40 border-blue-800/60 text-blue-300',
  success: 'bg-emerald-950/40 border-emerald-800/60 text-emerald-300',
  warning: 'bg-amber-950/40 border-amber-800/60 text-amber-300',
  error: 'bg-rose-950/40 border-rose-800/60 text-rose-300',
};

const alertIcons = {
  info: 'ℹ️',
  success: '✅',
  warning: '⚠️',
  error: '🚫',
};

export default function Alert({ type = 'info', title, message, onClose }) {
  return (
    <div className={`flex items-start gap-3 p-4 rounded-xl border ${alertStyles[type] || alertStyles.info} mb-4`}>
      <span className="text-lg select-none">{alertIcons[type]}</span>
      <div className="flex-1">
        {title && <h4 className="font-semibold text-sm mb-0.5">{title}</h4>}
        <p className="text-xs leading-relaxed opacity-90">{message}</p>
      </div>
      {onClose && (
        <button
          onClick={onClose}
          className="text-xs opacity-70 hover:opacity-100 p-1 transition"
          aria-label="Dismiss alert"
        >
          ✕
        </button>
      )}
    </div>
  );
}
