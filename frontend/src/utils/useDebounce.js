import { useState, useEffect } from 'react';

/**
 * useDebounce — delays updating the returned value until the specified delay
 * has elapsed since the last change. Useful for search inputs and API calls.
 *
 * @param {*} value - The value to debounce.
 * @param {number} [delay=400] - Debounce delay in milliseconds.
 * @returns {*} The debounced value.
 *
 * @example
 * const debouncedQuery = useDebounce(searchQuery, 400);
 * useEffect(() => { fetchResults(debouncedQuery); }, [debouncedQuery]);
 */
const useDebounce = (value, delay = 400) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Clear previous timer on every value/delay change
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
};

export default useDebounce;
