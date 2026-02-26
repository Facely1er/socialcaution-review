import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, X, Smartphone } from 'lucide-react';
import { isPWAInstalled, isIOS, isAndroid } from '../../utils/responsive';

const PWAInstallPrompt = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    // Check if already installed
    if (isPWAInstalled()) {
      return;
    }

    // Check if user has dismissed the prompt
    const dismissedPrompt = localStorage.getItem('pwa-install-dismissed');
    if (dismissedPrompt) {
      const dismissedTime = parseInt(dismissedPrompt, 10);
      const daysSinceDismissed = (Date.now() - dismissedTime) / (1000 * 60 * 60 * 24);
      
      // Show again after 7 days
      if (daysSinceDismissed < 7) {
        return;
      }
    }

    // Listen for beforeinstallprompt event
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      
      // Show prompt after a delay (better UX)
      setTimeout(() => {
        setShowPrompt(true);
      }, 3000);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // For iOS, show custom instructions
    if (isIOS()) {
      setTimeout(() => {
        setShowPrompt(true);
      }, 5000);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      
      if (outcome === 'accepted') {
        setShowPrompt(false);
      }
      
      setDeferredPrompt(null);
    }
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    setDismissed(true);
    localStorage.setItem('pwa-install-dismissed', Date.now().toString());
  };

  if (!showPrompt || dismissed || isPWAInstalled()) {
    return null;
  }

  return (
    <AnimatePresence>
      {showPrompt && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="fixed bottom-20 lg:bottom-4 left-4 right-4 lg:left-auto lg:right-4 lg:max-w-sm z-50
                     bg-white dark:bg-slate-800 rounded-xl shadow-2xl
                     border border-gray-200 dark:border-slate-700
                     p-4 sm:p-5
                     safe-area-inset-bottom"
          style={{
            marginBottom: 'calc(env(safe-area-inset-bottom, 0) + 1rem)',
          }}
          role="dialog"
          aria-labelledby="pwa-install-title"
          aria-describedby="pwa-install-description"
        >
          <div className="flex items-start gap-3 sm:gap-4">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-gradient-to-br from-accent to-accent-dark flex items-center justify-center">
                <Smartphone className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
            </div>
            
            <div className="flex-1 min-w-0">
              <h3
                id="pwa-install-title"
                className="text-sm sm:text-base font-bold text-gray-900 dark:text-white mb-1"
              >
                Install SocialCaution
              </h3>
              <p
                id="pwa-install-description"
                className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-3"
              >
                {isIOS() ? (
                  <>
                    Tap <span className="font-semibold">Share</span> then{' '}
                    <span className="font-semibold">Add to Home Screen</span>
                  </>
                ) : isAndroid() && deferredPrompt ? (
                  'Install our app for a better experience'
                ) : (
                  'Add to your home screen for quick access'
                )}
              </p>
              
              <div className="flex gap-2">
                {deferredPrompt && (
                  <button
                    onClick={handleInstall}
                    className="flex-1 px-3 sm:px-4 py-2 bg-gradient-to-r from-accent to-accent-dark text-white text-xs sm:text-sm font-semibold rounded-lg hover:from-accent-dark hover:to-accent transition-all duration-200 active:scale-95 touch-manipulation min-h-[40px] flex items-center justify-center gap-2"
                    aria-label="Install app"
                  >
                    <Download className="w-4 h-4" />
                    Install
                  </button>
                )}
                <button
                  onClick={handleDismiss}
                  className="px-3 sm:px-4 py-2 bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 text-xs sm:text-sm font-medium rounded-lg hover:bg-gray-200 dark:hover:bg-slate-600 transition-all duration-200 active:scale-95 touch-manipulation min-h-[40px]"
                  aria-label="Dismiss install prompt"
                >
                  Maybe later
                </button>
              </div>
            </div>
            
            <button
              onClick={handleDismiss}
              className="flex-shrink-0 p-1 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 transition-all duration-200 active:scale-95 touch-manipulation"
              aria-label="Close install prompt"
            >
              <X className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PWAInstallPrompt;

