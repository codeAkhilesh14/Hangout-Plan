import React from 'react';
import { motion } from 'framer-motion';

const GlowCard = ({ children, className = '', glowColor = 'pink', onClick, delay = 0 }) => {
  const glowStyles = {
    pink: 'hover:shadow-[0_0_25px_rgba(255,95,162,0.25)] border-pink-500/10 hover:border-pink-500/40',
    blue: 'hover:shadow-[0_0_25px_rgba(59,130,246,0.25)] border-blue-500/10 hover:border-blue-500/40',
    red: 'hover:shadow-[0_0_25px_rgba(255,45,85,0.25)] border-red-500/10 hover:border-red-500/40',
    gradient: 'hover:shadow-[0_0_30px_rgba(255,95,162,0.2)] border-white/5'
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5, delay }}
      onClick={onClick}
      className={`glassmorphism relative rounded-2xl p-6 md:p-8 transition-all duration-300 ${glowStyles[glowColor] || glowStyles.pink} ${onClick ? 'cursor-pointer hover:-translate-y-1 active:scale-[0.98]' : ''} ${className}`}
    >
      {glowColor === 'gradient' && (
        <div className="absolute inset-0 rounded-2xl -z-10 opacity-0 hover:opacity-100 transition-opacity duration-300 border-neon-gradient" />
      )}
      {children}
    </motion.div>
  );
};

export default GlowCard;
