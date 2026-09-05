import React, { useState } from 'react';

const Tooltip = ({ text, children, position = 'top' }) => {
  const [visible, setVisible] = useState(false);

  return (
    <div
      className="tooltip-container"
      style={{ position: 'relative', display: 'inline-block' }}
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
    >
      {children}
      {visible && (
        <div className={`tooltip-bubble tooltip-${position}`}>
          {text}
        </div>
      )}
    </div>
  );
};

export default Tooltip;
