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
