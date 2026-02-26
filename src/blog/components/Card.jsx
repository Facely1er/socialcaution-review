import React from 'react';

const Card = ({ 
  children, 
  className = '', 
  animate = false,
  hover = false,
  onClick
}) => {
  const baseClasses = `
    rounded-lg transition-all duration-200
    bg-white dark:bg-slate-800 shadow-sm dark:shadow-md 
    border border-gray-200 dark:border-slate-700
    ${hover ? 'cursor-pointer hover:shadow-xl dark:hover:shadow-2xl hover:-translate-y-1' : ''}
    ${onClick ? 'cursor-pointer' : ''}
    ${className}
  `;
  
  return (
    <div className={baseClasses} onClick={onClick}>
      {children}
    </div>
  );
};

export default Card;

