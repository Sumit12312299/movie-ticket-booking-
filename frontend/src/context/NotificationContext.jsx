import React, { createContext, useContext, useState } from 'react';
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react';

const NotificationContext = createContext();

/**
 * NotificationProvider component displays transient overlay toast notices.
 * Schedules active dismiss timeouts and maps message types (success, error, warning, info)
 * to color-coded feedback toasts.
 */
export const NotificationProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  /**
   * Adds a notification toast to the display queue.
   * Automatically schedules dismissal after 4 seconds.
   * @param {string} message - Toast message to display
   * @param {string} [type='info'] - Severity type ('success', 'error', 'warning', 'info')
   */
  const addToast = (message, type = 'info') => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  };

  /**
   * Dismisses and removes a toast notification from the queue.
   * @param {number} id - Unique numeric identifier of the toast to remove
   */
  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  /**
   * Clears all active toast notifications from display.
   */
  const clearAllToasts = () => {
    setToasts([]);
  };

  return (
    <NotificationContext.Provider value={{ addToast, clearAllToasts }}>
      {children}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-3 max-w-sm w-full">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`flex items-center justify-between p-4 rounded-xl shadow-2xl backdrop-blur-md border text-white transform transition-all duration-300 animate-slide-up ${
              toast.type === 'success'
                ? 'bg-emerald-900/90 border-emerald-500/50'
                : toast.type === 'error'
                ? 'bg-rose-900/90 border-rose-500/50'
                : toast.type === 'warning'
                ? 'bg-amber-900/90 border-amber-500/50'
                : 'bg-slate-900/90 border-slate-700'
            }`}
          >
            <div className="flex items-center gap-3">
              {toast.type === 'success' && <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />}
              {toast.type === 'error' && <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />}
              {toast.type === 'warning' && <AlertCircle className="w-5 h-5 text-amber-400 shrink-0" />}
              {toast.type === 'info' && <Info className="w-5 h-5 text-sky-400 shrink-0" />}
              <span className="text-sm font-medium">{toast.message}</span>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-slate-400 hover:text-white p-1 rounded-lg transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </NotificationContext.Provider>
  );
};

export const useNotification = () => useContext(NotificationContext);
