import React from 'react';

/**
 * Skeleton loader component for showing loading states
 * @param {Object} props
 * @param {string} [props.variant='text'] - Variant: 'text', 'circular', 'rectangular', 'card', 'list'
 * @param {string|number} [props.width] - Width of the skeleton
 * @param {string|number} [props.height] - Height of the skeleton
 * @param {string} [props.className=''] - Additional CSS classes
 * @param {number} [props.lines=1] - Number of lines for 'list' variant
 * @param {boolean} [props.animated=true] - Whether to show pulse animation
 */
const SkeletonLoader = ({
  variant = 'text',
  width,
  height,
  className = '',
  lines = 1,
  animated = true
}) => {
  const baseClasses = `bg-gray-200 dark:bg-gray-700 ${animated ? 'animate-pulse' : ''}`;
  
  const variantClasses = {
    text: 'rounded',
    circular: 'rounded-full',
    rectangular: 'rounded-lg',
    card: 'rounded-lg',
    list: 'rounded'
  };

  if (variant === 'card') {
    return (
      <div className={`${baseClasses} ${variantClasses.card} ${className}`} style={{ width, height }}>
        <div className="p-6 space-y-4">
          <div className={`${baseClasses} h-6 w-3/4 rounded`} />
          <div className={`${baseClasses} h-4 w-full rounded`} />
          <div className={`${baseClasses} h-4 w-5/6 rounded`} />
        </div>
      </div>
    );
  }

  if (variant === 'list') {
    return (
      <div className={`space-y-3 ${className}`}>
        {Array.from({ length: lines }).map((_, index) => (
          <div key={index} className={`${baseClasses} ${variantClasses.list} h-4`} style={{ width: width || '100%' }} />
        ))}
      </div>
    );
  }

  const style = {};
  if (width) style.width = typeof width === 'number' ? `${width}px` : width;
  if (height) style.height = typeof height === 'number' ? `${height}px` : height;

  return (
    <div 
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      style={style}
      aria-label="Loading..."
      role="status"
      aria-live="polite"
    />
  );
};

export default SkeletonLoader;

