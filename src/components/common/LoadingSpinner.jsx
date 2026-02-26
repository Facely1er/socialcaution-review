import { Loader2 } from 'lucide-react';

const LoadingSpinner = ({ 
  size = 'md', 
  text = 'Loading...', 
  fullScreen = false,
  className = '' 
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  };

  const textSizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl'
  };

  if (fullScreen) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className={`${sizeClasses[size]} animate-spin text-red-500 mx-auto mb-4`} />
          <p className={`${textSizeClasses[size]} text-gray-600 dark:text-gray-300`}>
            {text}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex flex-col items-center justify-center p-4 ${className}`}>
      <Loader2 className={`${sizeClasses[size]} animate-spin text-red-500 mb-2`} />
      <p className={`${textSizeClasses[size]} text-gray-600 dark:text-gray-300`}>
        {text}
      </p>
    </div>
  );
};

export default LoadingSpinner;