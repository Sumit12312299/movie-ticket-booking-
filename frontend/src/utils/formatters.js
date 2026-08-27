// Utility formatting functions
/**
 * Formats a numeric value into an Indian Rupee (INR) currency format.
 * @param {number} amount - The numeric amount to format.
 * @returns {string} - The formatted currency string.
 */
export const formatCurrency = (amount) => {
  if (typeof amount !== 'number') {
    return '₹0.00';
  }
  // Standard Intl formatting for INR currency with 2 decimal precision
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

/**
 * Formats a date string or Date object into a human-readable date.
 * @param {string|Date} date - The date to format.
 * @returns {string} - Formatted date string (e.g. "27 Aug 2026").
 */
export const formatDate = (date) => {
  if (!date) return '';
  return new Intl.DateTimeFormat('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(new Date(date));
};

/**
 * Formats a date string or Date object into a 12-hour time string.
 * @param {string|Date} date - The date/time to format.
 * @returns {string} - Formatted time string (e.g. "07:30 PM").
 */
export const formatTime = (date) => {
  if (!date) return '';
  return new Intl.DateTimeFormat('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  }).format(new Date(date));
};
