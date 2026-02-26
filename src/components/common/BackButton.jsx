import { useNavigate } from 'react-router-dom';
import { ChevronLeft, X } from 'lucide-react';

const BackButton = ({ to, onClick, label, className = '', variant = 'default', showIcon = true, icon: Icon = ChevronLeft }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else if (to) {
      navigate(to);
    } else {
      navigate(-1);
    }
  };

  const baseClasses = "flex items-center transition-all";
  const variants = {
    default: "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white",
    button: "px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-300 dark:hover:bg-gray-600 transform hover:scale-105",
    primary: "px-4 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600 transform hover:scale-105 shadow-md hover:shadow-lg"
  };

  // If label is empty and no custom icon, use X icon for close button
  const DisplayIcon = label === '' && Icon === ChevronLeft ? X : Icon;
  const iconSize = label === '' ? 'w-6 h-6' : 'w-4 h-4';
  const iconMargin = label === '' ? '' : 'mr-1';

  return (
    <button
      onClick={handleClick}
      className={`${baseClasses} ${variants[variant]} ${className}`}
      aria-label={label || 'Go back'}
    >
      {showIcon && <DisplayIcon className={`${iconSize} ${iconMargin}`} />}
      {label}
    </button>
  );
};

export default BackButton;