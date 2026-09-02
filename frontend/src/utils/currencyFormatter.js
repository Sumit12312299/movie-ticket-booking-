export const formatINR = (amount, decimals = 2) => {
  const num = Number(amount);
  if (isNaN(num)) return '₹0.00';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(num);
};

export const parseINR = (str) => {
  if (typeof str !== 'string') return 0;
  const cleaned = str.replace(/[^0-9.-]+/g, '');
  return parseFloat(cleaned) || 0;
};
