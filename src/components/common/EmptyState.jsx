import React from 'react';
import { BookOpen, Wrench, AlertCircle, Inbox, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const EmptyState = ({ 
  icon: Icon = Inbox,
  title = 'No items found',
  message = 'Try adjusting your filters or search terms.',
  actionLabel,
  actionUrl,
  actionOnClick,
  className = ''
}) => {
  const navigate = useNavigate();

  const handleAction = () => {
    if (actionOnClick) {
      actionOnClick();
    } else if (actionUrl) {
      navigate(actionUrl);
    }
  };

  return (
    <div className={`text-center py-8 sm:py-12 px-4 ${className}`}>
      <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 text-gray-400 dark:text-gray-500">
        <Icon className="w-full h-full" />
      </div>
      <h3 className="text-base sm:text-lg font-medium text-gray-900 dark:text-white mb-2">
        {title}
      </h3>
      <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 mb-4 sm:mb-6 max-w-md mx-auto">
        {message}
      </p>
      {actionLabel && (actionUrl || actionOnClick) && (
        <button
          type="button"
          onClick={handleAction}
          className="px-6 py-3 bg-red-500 text-white font-medium rounded-xl hover:bg-red-600 transition-all transform hover:scale-105 shadow-md hover:shadow-lg min-h-[44px] touch-manipulation text-sm sm:text-base"
          aria-label={actionLabel}
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
};

export default EmptyState;

