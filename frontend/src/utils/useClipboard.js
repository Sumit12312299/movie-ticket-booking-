import { useState, useCallback } from 'react';

const useClipboard = (resetMs = 2000) => {
  const [copied, setCopied] = useState(false);
  const [error,  setError]  = useState(null);

  const copy = useCallback(async (text) => {
    try {
      await navigator.clipboard.writeText(String(text));
      setCopied(true);
      setError(null);
      setTimeout(() => setCopied(false), resetMs);
    } catch (err) {
      setError(err.message);
      setCopied(false);
    }
  }, [resetMs]);

  return { copy, copied, error };
};

export default useClipboard;
