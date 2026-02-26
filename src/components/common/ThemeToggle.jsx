import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext.jsx';

const ThemeToggle = ({ className = '', iconClassName = 'w-5 h-5' }) => {
  const { theme, updateTheme } = useTheme();

  const toggleTheme = () => {
    updateTheme(theme === 'light' ? 'dark' : 'light');
  };

  const baseLayout = 'flex items-center justify-center';
  const defaultButtonClass = 'p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors';
  const buttonClass = className.trim()
    ? `${baseLayout} ${className}`
    : `${baseLayout} ${defaultButtonClass}`;

  return (
    <button
      onClick={toggleTheme}
      className={buttonClass}
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
    >
      {theme === 'light' ? (
        <Moon className={`${iconClassName} text-gray-600 dark:text-gray-300`} />
      ) : (
        <Sun className={`${iconClassName} text-gray-600 dark:text-gray-300`} />
      )}
    </button>
  );
};

export default ThemeToggle;