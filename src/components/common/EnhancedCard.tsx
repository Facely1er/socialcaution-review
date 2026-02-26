import React from 'react';
import { motion } from 'framer-motion';

interface EnhancedCardProps {
  children: React.ReactNode;
  className?: string;
  animate?: boolean;
  hover?: boolean;
  onClick?: () => void;
  delay?: number;
  variant?: 'default' | 'bordered' | 'ghost' | 'elevated';
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

const EnhancedCard: React.FC<EnhancedCardProps> = ({ 
  children, 
  className = '', 
  animate = false,
  hover = false,
  onClick,
  delay = 0,
  variant = 'default',
  padding = 'md'
}) => {
  const paddingClasses = {
    none: '',
    sm: 'p-3',
    md: 'p-4',
    lg: 'p-6'
  };

  const variantClasses = {
    default: 'bg-card dark:bg-card shadow-sm dark:shadow-md border border-border dark:border-border',
    bordered: 'bg-transparent border-2 border-border dark:border-border',
    ghost: 'bg-transparent hover:bg-card-hover dark:hover:bg-card-hover',
    elevated: 'bg-card dark:bg-card shadow-lg dark:shadow-xl border border-transparent'
  };

  const baseClasses = `
    rounded-lg transition-all duration-200
    ${variantClasses[variant]}
    ${paddingClasses[padding]}
    ${hover ? 'cursor-pointer hover:shadow-xl dark:hover:shadow-2xl hover:-translate-y-1' : ''}
    ${onClick ? 'cursor-pointer' : ''}
    ${className}
  `;
  
  if (animate) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay }}
        whileHover={hover ? { y: -5, scale: 1.02 } : {}}
        className={baseClasses}
        onClick={onClick}
      >
        {children}
      </motion.div>
    );
  }
  
  return (
    <div className={baseClasses} onClick={onClick}>
      {children}
    </div>
  );
};

export default EnhancedCard;

