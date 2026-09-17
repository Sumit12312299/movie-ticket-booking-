/**
 * Input Validation Utility Helpers
 */

/**
 * Validates an email address format.
 * @param {string} email
 * @returns {boolean}
 */
export const isValidEmail = (email) => {
  if (!email) return false;
  const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return re.test(String(email).toLowerCase());
};

/**
 * Validates password strength (minimum 6 characters).
 * @param {string} password
 * @returns {boolean}
 */
export const isValidPassword = (password) => {
  return typeof password === 'string' && password.length >= 6;
};

/**
 * Validates a 10-digit phone number.
 * @param {string} phone
 * @returns {boolean}
 */
export const isValidPhone = (phone) => {
  if (!phone) return false;
  const re = /^[6-9]\d{9}$/;
  return re.test(String(phone).replace(/\s+/g, ''));
};

/**
 * Validates a promo code alphanumeric format.
 * @param {string} code
 * @returns {boolean}
 */
export const isValidPromoCode = (code) => {
  if (!code) return false;
  const cleanCode = code.trim().toUpperCase();
  return /^[A-Z0-9]{3,12}$/.test(cleanCode);
};
