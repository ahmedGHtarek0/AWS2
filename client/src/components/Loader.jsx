import React from 'react';

const Loader = ({ size = 48, text = "Processing..." }) => {
  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center', 
      gap: '1.5rem',
      padding: '2rem'
    }}>
      <div className="loader" style={{ width: size, height: size }}></div>
      {text && <p style={{ color: 'var(--text-muted)', fontWeight: 500, letterSpacing: '1px' }}>{text}</p>}
    </div>
  );
};

export default Loader;
