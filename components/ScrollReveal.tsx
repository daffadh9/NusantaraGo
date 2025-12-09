import React from 'react';
import { motion } from 'framer-motion';

interface ScrollRevealProps {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}

/**
 * Staggered reveal animation component
 * Elements fade in and slide up when they enter viewport
 */
export const ScrollReveal: React.FC<ScrollRevealProps> = ({ 
  children, 
  delay = 0,
  className = '' 
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ 
        duration: 0.6, 
        delay: delay, 
        ease: [0.25, 0.1, 0.25, 1] // easeOutQuart
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export default ScrollReveal;
