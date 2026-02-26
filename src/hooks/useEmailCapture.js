import { useState, useEffect } from 'react';
import { useLocalStorage } from './useLocalStorage';

/**
 * Hook to manage email capture triggers
 * Automatically shows email capture at strategic moments
 */
export const useEmailCapture = (options = {}) => {
  const {
    triggerOn = 'persona_selection', // 'persona_selection', 'service_selection', 'time_on_page', 'scroll'
    delay = 0, // Delay in seconds before showing
    minTimeOnPage = 30, // Minimum seconds on page before showing (for time_on_page trigger)
    scrollPercentage = 50, // Scroll percentage for scroll trigger
    persona = null,
    context = 'general'
  } = options;

  const [showEmailCapture, setShowEmailCapture] = useState(false);
  const [hasSeenModal, setHasSeenModal] = useLocalStorage('socialcaution_email_modal_seen', false);
  const [hasSeenModalForContext, setHasSeenModalForContext] = useLocalStorage(
    `socialcaution_email_modal_seen_${context}`,
    false
  );

  useEffect(() => {
    // Don't show if already seen for this context
    if (hasSeenModalForContext) {
      return;
    }

    let timeoutId;
    let scrollHandler;

    const triggerCapture = () => {
      if (!hasSeenModalForContext) {
        setShowEmailCapture(true);
      }
    };

    switch (triggerOn) {
      case 'persona_selection':
        // Triggered manually when persona is selected
        break;

      case 'service_selection':
        // Triggered manually when services are selected
        break;

      case 'time_on_page':
        timeoutId = setTimeout(() => {
          const timeOnPage = Date.now() - (window.pageLoadTime || Date.now());
          if (timeOnPage >= minTimeOnPage * 1000) {
            triggerCapture();
          }
        }, (delay + minTimeOnPage) * 1000);
        break;

      case 'scroll':
        scrollHandler = () => {
          const scrollPercent = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
          if (scrollPercent >= scrollPercentage) {
            triggerCapture();
            window.removeEventListener('scroll', scrollHandler);
          }
        };
        window.addEventListener('scroll', scrollHandler);
        break;

      case 'immediate':
        timeoutId = setTimeout(triggerCapture, delay * 1000);
        break;

      default:
        break;
    }

    // Track page load time
    if (!window.pageLoadTime) {
      window.pageLoadTime = Date.now();
    }

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
      if (scrollHandler) window.removeEventListener('scroll', scrollHandler);
    };
  }, [triggerOn, delay, minTimeOnPage, scrollPercentage, hasSeenModalForContext]);

  const triggerEmailCapture = () => {
    if (!hasSeenModalForContext) {
      setShowEmailCapture(true);
    }
  };

  const closeEmailCapture = () => {
    setShowEmailCapture(false);
    setHasSeenModalForContext(true);
  };

  return {
    showEmailCapture,
    triggerEmailCapture,
    closeEmailCapture,
    hasSeenModal: hasSeenModalForContext
  };
};

export default useEmailCapture;

