import React from 'react';

const Stepper = ({ steps = [], currentStep = 0, onStepClick }) => {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', margin: '1rem 0' }}>
      {steps.map((step, idx) => {
        const isCompleted = idx < currentStep;
        const isActive = idx === currentStep;
        return (
          <React.Fragment key={idx}>
            <div
              onClick={() => isCompleted && onStepClick?.(idx)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                cursor: isCompleted ? 'pointer' : 'default',
                opacity: idx > currentStep ? 0.5 : 1,
              }}
            >
              <div
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  background: isActive ? '#a855f7' : isCompleted ? '#10b981' : 'rgba(255,255,255,0.1)',
                  color: '#fff',
                }}
              >
                {isCompleted ? '✓' : idx + 1}
              </div>
              <span style={{ fontSize: '0.85rem', fontWeight: isActive ? 600 : 400, color: isActive ? '#f9fafb' : '#9ca3af' }}>
                {step}
              </span>
            </div>
            {idx < steps.length - 1 && (
              <div style={{ flex: 1, height: 2, margin: '0 0.75rem', background: idx < currentStep ? '#10b981' : 'rgba(255,255,255,0.1)' }} />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};

export default Stepper;
