/**
 * Currency, Date, and Seat Formatting Helpers
 */

/**
 * Format a number into Indian Rupee currency format (₹).
 * @param {number} amount
 * @returns {string}
 */
export const formatCurrency = (amount) => {
  if (typeof amount !== 'number' || isNaN(amount)) return '₹0';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
};

/**
 * Format ISO date string into readable show date (e.g., 'Wed, 17 Sep 2026').
 * @param {string|Date} dateString
 * @returns {string}
 */
export const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
};

/**
 * Format ISO date string into show timing (e.g., '07:30 PM').
 * @param {string|Date} dateString
 * @returns {string}
 */
export const formatTime = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
};

/**
 * Convert duration in minutes into '2h 45m' string.
 * @param {number} minutes
 * @returns {string}
 */
export const formatDuration = (minutes) => {
  if (!minutes) return '0m';
  const hrs = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return hrs > 0 ? `${hrs}h ${mins}m` : `${mins}m`;
};

/**
 * Join an array of seat codes into a comma-separated string (e.g. 'A1, A2, A3').
 * @param {Array<string>} seats
 * @returns {string}
 */
export const formatSeats = (seats) => {
  if (!Array.isArray(seats) || seats.length === 0) return 'None';
  return seats.join(', ');
};
