import { useEffect } from 'react';

const useLockBodyScroll = (lock = true) => {
  useEffect(() => {
    if (!lock) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = original;
    };
  }, [lock]);
};

export default useLockBodyScroll;
