import { useState } from 'react';

/**
 * useLocalStorage — syncs a React state value with localStorage automatically.
 * Falls back to `initialValue` if the key does not exist or parsing fails.
 *
 * @param {string} key - The localStorage key to read/write.
 * @param {*} initialValue - Default value when key is absent.
 * @returns {[*, Function]} A stateful value and a setter function.
 *
 * @example
 * const [theme, setTheme] = useLocalStorage('app_theme', 'dark');
 */
const useLocalStorage = (key, initialValue) => {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch {
      return initialValue;
    }
  });

  const setValue = (value) => {
    try {
      // Allow value to be a function so we have the same API as useState
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (err) {
      console.error(`useLocalStorage: failed to set key "${key}"`, err);
    }
  };

  return [storedValue, setValue];
};

export default useLocalStorage;
