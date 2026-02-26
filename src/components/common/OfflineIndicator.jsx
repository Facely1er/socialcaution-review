import React, { useState, useEffect } from 'react';
import { Wifi, WifiOff, Cloud, CloudOff, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const OfflineIndicator = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [showIndicator, setShowIndicator] = useState(false);
  const [wasOffline, setWasOffline] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setWasOffline(true);
      setShowIndicator(true);
      // Hide after 3 seconds
      setTimeout(() => setShowIndicator(false), 3000);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setShowIndicator(true);
      setWasOffline(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Check service worker registration
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.ready.then((registration) => {
        if (registration) {
          console.log('Service Worker is ready');
        }
      });
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (!showIndicator && isOnline) {
    return null;
  }

  return (
    <AnimatePresence>
      {showIndicator && (
        <motion.div
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -100, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed top-16 left-0 right-0 z-50 px-4 pt-2 safe-area-inset-top"
        >
          <div
            className={`max-w-md mx-auto rounded-lg shadow-lg p-3 flex items-center gap-3 ${
              isOnline
                ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800'
                : 'bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800'
            }`}
          >
            {isOnline ? (
              <>
                <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-green-800 dark:text-green-200">
                    {wasOffline ? 'Connection restored' : 'You are online'}
                  </p>
                  <p className="text-xs text-green-600 dark:text-green-400">
                    All features are available
                  </p>
                </div>
                <Wifi className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0" />
              </>
            ) : (
              <>
                <WifiOff className="w-5 h-5 text-orange-600 dark:text-orange-400 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-orange-800 dark:text-orange-200">
                    You are offline
                  </p>
                  <p className="text-xs text-orange-600 dark:text-orange-400">
                    Some features may be limited. Your data is saved locally.
                  </p>
                </div>
                <CloudOff className="w-5 h-5 text-orange-600 dark:text-orange-400 flex-shrink-0" />
              </>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default OfflineIndicator;

