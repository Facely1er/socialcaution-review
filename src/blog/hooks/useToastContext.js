import { useNotifications } from '../../components/common/NotificationSystem';

export const useToastContext = () => {
  const { addNotification } = useNotifications();
  
  return {
    success: (message) => {
      addNotification({
        type: 'success',
        message,
        duration: 5000
      });
    },
    error: (message) => {
      addNotification({
        type: 'error',
        message,
        duration: 5000
      });
    }
  };
};

// Export as default for compatibility
export default useToastContext;

