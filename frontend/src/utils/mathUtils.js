export const formatCurrency = (amount, currency = 'INR', locale = 'en-IN') => {
  return new Intl.NumberFormat(locale, { style: 'currency', currency, maximumFractionDigits: 2 }).format(amount);
};

export const calculateDiscount = (price, percentage) => {
  if (!price || !percentage) return price;
  return Math.max(0, price - (price * (percentage / 100)));
};
