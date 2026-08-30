import React from 'react';

const Skeleton = ({ width = '100%', height = 16, borderRadius = '0.375rem', style = {} }) => (
  <div
    aria-hidden="true"
    style={{
      width, height, borderRadius, flexShrink: 0,
      background: 'rgba(255,255,255,0.08)',
      ...style,
    }}
  />
);

export default Skeleton;
