const isDev = process.env.NODE_ENV !== 'production';

export const logger = {
  log: (...args) => { if (isDev) console.log('[LOG]', ...args); },
  warn: (...args) => { if (isDev) console.warn('[WARN]', ...args); },
  error: (...args) => { console.error('[ERROR]', ...args); },
};

export default logger;
