import React, { useState, useEffect } from 'react';

const CountdownTimer = ({ targetTime, onExpire, warningThresholdSecs = 60 }) => {
  const calc = () => Math.max(0, Math.floor((new Date(targetTime) - Date.now()) / 1000));
  const [secsLeft, setSecsLeft] = useState(calc);

  useEffect(() => {
    if (secsLeft <= 0) { onExpire?.(); return; }
    const id = setInterval(() => {
      const remaining = calc();
      setSecsLeft(remaining);
      if (remaining <= 0) { clearInterval(id); onExpire?.(); }
    }, 1000);
    return () => clearInterval(id);
  }, [targetTime]);

  const mm = String(Math.floor(secsLeft / 60)).padStart(2, '0');
  const ss = String(secsLeft % 60).padStart(2, '0');
  const isWarning = secsLeft <= warningThresholdSecs;

  return (
    <span style={{ fontVariantNumeric: 'tabular-nums', fontWeight: 700, color: isWarning ? '#ef4444' : '#a855f7', letterSpacing: '0.05em' }}>
      {mm}:{ss}
    </span>
  );
};

export default CountdownTimer;
