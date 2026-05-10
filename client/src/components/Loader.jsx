import React from 'react';
import { motion } from 'framer-motion';

const Loader = ({ size = 80, text = "Processing..." }) => {
  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center', 
      gap: '2rem',
      padding: '2rem'
    }}>
      <div className="loader-container" style={{ width: size, height: size }}>
        <div className="loader-ring"></div>
        <div className="loader-ring"></div>
        <div className="loader-ring"></div>
        <div className="loader-core"></div>
      </div>
      {text && (
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 2, repeat: Infinity }}
          style={{ 
            color: 'var(--text-main)', 
            fontWeight: 600, 
            letterSpacing: '2px',
            textTransform: 'uppercase',
            fontSize: '0.8rem',
            textAlign: 'center'
          }}
        >
          {text}
        </motion.p>
      )}
    </div>
  );
};

export default Loader;
