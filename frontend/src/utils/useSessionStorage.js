import { useState } from 'react';

/**
 * useSessionStorage — syncs a React state value with sessionStorage automatically.
 * Falls back to initialValue if the key does not exist or parsing fails.
 * Unlike useLocalStorage, data is cleared when the browser tab is closed.
 *
 * @param {string} key - The sessionStorage key to read/write.
 * @param {*} initialValue - Default value when key is absent.
 * @returns {[*, Function]} A stateful value and a setter function.
 *
 * @example
 * const [step, setStep] = useSessionStorage('booking_step', 1);
 */
const useSessionStorage = (key, initialValue) => {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.sessionStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch {
      return initialValue;
    }
  });

  const setValue = (value) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.sessionStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (err) {
      console.error(useSessionStorage: failed to set key "", err);
    }
  };

  const removeValue = () => {
    try {
      setStoredValue(initialValue);
      window.sessionStorage.removeItem(key);
    } catch (err) {
      console.error(useSessionStorage: failed to remove key "", err);
    }
  };

  return [storedValue, setValue, removeValue];
};

export default useSessionStorage;
