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

/**
 * Truncates a string to a given maximum length and appends an ellipsis.
 * @param {string} text - The text to truncate.
 * @param {number} [maxLength=100] - Maximum character count before truncation.
 * @returns {string} - Truncated string with '...' appended if needed.
 */
export const truncateText = (text, maxLength = 100) => {
  if (!text || typeof text !== 'string') return '';
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength).trimEnd()}...`;
};

/**
 * Validates an email address format using standard regex.
 * @param {string} email - Email address string to test.
 * @returns {boolean} True if valid email format.
 */
export const isValidEmail = (email) => {
  if (!email || typeof email !== 'string') return false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
};

/**
 * Converts a string into a URL-friendly slug.
 * @param {string} text - The raw text string.
 * @returns {string} - URL safe slug.
 */
export const slugify = (text) => {
  if (!text || typeof text !== 'string') return '';
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
};


