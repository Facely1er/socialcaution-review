import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RefreshCw, X, CheckCircle } from 'lucide-react';

const PWAUpdateNotification = () => {
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateComplete, setUpdateComplete] = useState(false);

  useEffect(() => {
    // Listen for service worker updates
    if ('serviceWorker' in navigator) {
      let refreshing = false;

      // Listen for service worker controller change
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        if (refreshing) return;
        refreshing = true;
        window.location.reload();
      });

      // Check for updates
      const checkForUpdates = async () => {
        try {
          const registration = await navigator.serviceWorker.getRegistration();
          if (registration) {
            await registration.update();

            // Listen for waiting service worker
            registration.addEventListener('updatefound', () => {
              const newWorker = registration.installing;
              if (newWorker) {
                newWorker.addEventListener('statechange', () => {
                  if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                    // New service worker is waiting
                    setUpdateAvailable(true);
                  }
                });
              }
            });

            // Check if there's already a waiting worker
            if (registration.waiting) {
              setUpdateAvailable(true);
            }
          }
        } catch (error) {
          console.warn('Service worker update check failed:', error);
        }
      };

      // Check for updates on load
      checkForUpdates();

      // Listen for messages from service worker
      navigator.serviceWorker.addEventListener('message', (event) => {
        if (event.data && event.data.type === 'SW_UPDATED') {
          setUpdateAvailable(true);
        }
      });

      // Check for updates periodically (every hour)
      const updateInterval = setInterval(checkForUpdates, 60 * 60 * 1000);

      return () => {
        clearInterval(updateInterval);
      };
    }
  }, []);

  const handleUpdate = async () => {
    setIsUpdating(true);
    
    try {
      const registration = await navigator.serviceWorker.getRegistration();
      if (registration && registration.waiting) {
        // Send skip waiting message to service worker
        registration.waiting.postMessage({ type: 'SKIP_WAITING' });
        
        // Wait a moment for the update to apply
        setTimeout(() => {
          setUpdateComplete(true);
          setTimeout(() => {
            window.location.reload();
          }, 1500);
        }, 500);
      }
    } catch (error) {
      console.error('Update failed:', error);
      setIsUpdating(false);
    }
  };

  const handleDismiss = () => {
    setUpdateAvailable(false);
    // Remember dismissal for this session
    sessionStorage.setItem('pwa-update-dismissed', 'true');
  };

  // Don't show if dismissed in this session
  if (sessionStorage.getItem('pwa-update-dismissed') === 'true' && !updateComplete) {
    return null;
  }

  if (!updateAvailable && !updateComplete) {
    return null;
  }

  return (
    <AnimatePresence>
      {(updateAvailable || updateComplete) && (
        <motion.div
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -100, opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="fixed top-16 sm:top-20 left-4 right-4 sm:left-auto sm:right-4 sm:max-w-md z-50
                     bg-white dark:bg-slate-800 rounded-xl shadow-2xl
                     border border-gray-200 dark:border-slate-700
                     p-4 sm:p-5
                     safe-area-inset-top"
          style={{
            marginTop: 'calc(env(safe-area-inset-top, 0) + 0.5rem)',
          }}
          role="alert"
          aria-live="polite"
        >
          <div className="flex items-start gap-3 sm:gap-4">
            <div className="flex-shrink-0">
              {updateComplete ? (
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-green-500 flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
              ) : (
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-gradient-to-br from-accent to-accent-dark flex items-center justify-center">
                  <RefreshCw className={`w-5 h-5 sm:w-6 sm:h-6 text-white ${isUpdating ? 'animate-spin' : ''}`} />
                </div>
              )}
            </div>
            
            <div className="flex-1 min-w-0">
              <h3 className="text-sm sm:text-base font-bold text-gray-900 dark:text-white mb-1">
                {updateComplete ? 'Update Complete!' : 'Update Available'}
              </h3>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-3">
                {updateComplete
                  ? 'The app has been updated. Reloading...'
                  : 'A new version of SocialCaution is available. Update now for the latest features and improvements.'}
              </p>
              
              {!updateComplete && (
                <div className="flex gap-2">
                  <button
                    onClick={handleUpdate}
                    disabled={isUpdating}
                    className="flex-1 px-3 sm:px-4 py-2 bg-gradient-to-r from-accent to-accent-dark text-white text-xs sm:text-sm font-semibold rounded-lg hover:from-accent-dark hover:to-accent transition-all duration-200 active:scale-95 touch-manipulation min-h-[40px] flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    aria-label="Update app"
                  >
                    <RefreshCw className={`w-4 h-4 ${isUpdating ? 'animate-spin' : ''}`} />
                    {isUpdating ? 'Updating...' : 'Update Now'}
                  </button>
                  <button
                    onClick={handleDismiss}
                    disabled={isUpdating}
                    className="px-3 sm:px-4 py-2 bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 text-xs sm:text-sm font-medium rounded-lg hover:bg-gray-200 dark:hover:bg-slate-600 transition-all duration-200 active:scale-95 touch-manipulation min-h-[40px] disabled:opacity-50"
                    aria-label="Dismiss update notification"
                  >
                    Later
                  </button>
                </div>
              )}
            </div>
            
            {!updateComplete && (
              <button
                onClick={handleDismiss}
                disabled={isUpdating}
                className="flex-shrink-0 p-1 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 transition-all duration-200 active:scale-95 touch-manipulation disabled:opacity-50"
                aria-label="Close update notification"
              >
                <X className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PWAUpdateNotification;

