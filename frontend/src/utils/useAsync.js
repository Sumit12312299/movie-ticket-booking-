import { useState, useCallback } from 'react';

const useAsync = (asyncFunction) => {
  const [status, setStatus] = useState('idle');
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  const execute = useCallback(
    async (...args) => {
      setStatus('pending');
      setData(null);
      setError(null);
      try {
        const response = await asyncFunction(...args);
        setData(response);
        setStatus('success');
        return response;
      } catch (err) {
        setError(err.message || 'An error occurred');
        setStatus('error');
        throw err;
      }
    },
    [asyncFunction]
  );

  return { execute, status, data, error, isPending: status === 'pending' };
};

export default useAsync;
