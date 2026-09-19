import { useState, useEffect } from 'react';
import { storage } from '../utils/storage';

/**
 * Reactive state hook synchronized with window.localStorage.
 */
export function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    return storage.get(key, initialValue);
  });

  useEffect(() => {
    storage.set(key, storedValue);
  }, [key, storedValue]);

  return [storedValue, setStoredValue];
}

export default useLocalStorage;
