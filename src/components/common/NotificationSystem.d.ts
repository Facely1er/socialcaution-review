import React from 'react';

interface Notification {
  id: number;
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  title?: string;
  duration?: number;
  autoRemove?: boolean;
  action?: {
    label: string;
    onClick: () => void;
  };
}

interface NotificationContextValue {
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, 'id'>) => void;
  removeNotification: (id: number) => void;
  showSuccess: (message: string, options?: Partial<Notification>) => void;
  showError: (message: string, options?: Partial<Notification>) => void;
  showWarning: (message: string, options?: Partial<Notification>) => void;
  showInfo: (message: string, options?: Partial<Notification>) => void;
}

export const useNotifications: () => NotificationContextValue;

interface NotificationProviderProps {
  children: React.ReactNode;
}

export const NotificationProvider: React.FC<NotificationProviderProps>;

export default NotificationProvider;

