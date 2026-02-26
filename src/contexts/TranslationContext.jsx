import React, { createContext, useContext, useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { createPortal } from 'react-dom';
// Import English translations synchronously to avoid race conditions
// Handle both default export and named export for Vite compatibility
import enTranslationsRaw from '../data/translations/en.json';
// Ensure we have the actual data object
const enTranslations = (enTranslationsRaw && typeof enTranslationsRaw === 'object') 
  ? (enTranslationsRaw.default || enTranslationsRaw)
  : {};

// IMPORTANT: Use Vite's import.meta.glob so translation JSON files are bundled in production.
// A dynamic import template string with /* @vite-ignore */ often works in dev but fails after build
// because the JSON files are not included in the output.
const translationImporters = import.meta.glob('../data/translations/*.json');

// Translation context with default value to prevent initialization errors
const defaultContextValue = {
  currentLanguage: 'en',
  translations: {},
  isLoading: false,
  changeLanguage: async () => {},
  t: (key) => key.split('.').pop().replace(/([A-Z])/g, ' $1').trim() || key,
  getSupportedLanguages: () => []
};

export const TranslationContext = createContext(defaultContextValue);

// Language detection and management
export const useTranslation = () => {
  const context = useContext(TranslationContext);
  if (!context) {
    throw new Error('useTranslation must be used within a TranslationProvider');
  }
  return context;
};

// Translation provider component
export const TranslationProvider = ({ children }) => {
  const [currentLanguage, setCurrentLanguage] = useState('en');
  // Initialize with English translations immediately to prevent missing key errors
  // Ensure enTranslations is valid, otherwise use empty object
  const initialTranslations = (enTranslations && typeof enTranslations === 'object' && Object.keys(enTranslations).length > 0) 
    ? enTranslations 
    : {};
  const [translations, setTranslations] = useState(initialTranslations);
  const [englishTranslations, setEnglishTranslations] = useState(initialTranslations); // Store English as fallback
  const [isLoading, setIsLoading] = useState(false);
  const isChangingLanguageRef = useRef(false);
  
  // Debug: Log if translations failed to load
  useEffect(() => {
    if (import.meta.env.DEV) {
      if (!enTranslations || Object.keys(enTranslations).length === 0) {
        console.error('[Translation] CRITICAL: English translations failed to import!');
      } else {
        console.log('[Translation] English translations loaded:', Object.keys(enTranslations).length, 'top-level keys');
      }
      if (!translations || Object.keys(translations).length === 0) {
        console.warn('[Translation] WARNING: Translations state is empty on mount');
      }
    }
  }, []);

  useEffect(() => {
    // Always load English translations first as fallback
    loadEnglishTranslations();
    // Detect and set language after a brief delay to ensure translations are ready
    const timer = setTimeout(() => {
      detectLanguage();
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (currentLanguage && !isChangingLanguageRef.current) {
      // Only auto-load if not in the middle of a manual language change
      loadTranslations();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentLanguage]);

  const loadEnglishTranslations = () => {
    // English translations are already loaded synchronously via import
    // Ensure they're always set, even if state check fails
    if (!enTranslations || Object.keys(enTranslations).length === 0) {
      if (import.meta.env.DEV) {
        console.error('[Translation] English translations failed to load!');
      }
      return;
    }
    // Always ensure English translations are set as fallback
    setEnglishTranslations(enTranslations);
    // Only set current translations if they're empty or invalid
    if (!translations || Object.keys(translations).length === 0) {
      setTranslations(enTranslations);
    }
  };

  // Safe localStorage access utility
  const safeLocalStorage = {
    getItem: (key) => {
      try {
        if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
          return null;
        }
        return localStorage.getItem(key);
      } catch (error) {
        if (import.meta.env.DEV) {
          console.warn('localStorage.getItem failed:', error);
        }
        return null;
      }
    },
    setItem: (key, value) => {
      try {
        if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
          return;
        }
        localStorage.setItem(key, value);
      } catch (error) {
        if (import.meta.env.DEV) {
          console.warn('localStorage.setItem failed:', error);
        }
      }
    }
  };

  const detectLanguage = () => {
    // First check if user has a saved language preference
    const savedLanguage = safeLocalStorage.getItem('socialcaution_language');
    if (savedLanguage) {
      const supportedLanguages = ['en', 'fr', 'es'];
      if (supportedLanguages.includes(savedLanguage)) {
        setCurrentLanguage(savedLanguage);
        return;
      }
    }
    
    // Detect language from browser settings safely
    try {
      if (typeof navigator !== 'undefined' && navigator.language) {
        const browserLang = navigator.language || (navigator.languages && navigator.languages[0]) || 'en';
        const langCode = browserLang.split('-')[0];
        
        // Check if language is supported
        const supportedLanguages = ['en', 'fr', 'es'];
        const detectedLang = supportedLanguages.includes(langCode) ? langCode : 'en';
        
        setCurrentLanguage(detectedLang);
        return;
      }
    } catch (error) {
      if (import.meta.env.DEV) {
        console.warn('Language detection failed:', error);
      }
    }
    
    // Fallback to English
    setCurrentLanguage('en');
  };

  const loadTranslations = async (langCodeOverride = null) => {
    // Use override if provided, otherwise use currentLanguage from state
    const targetLanguage = langCodeOverride || currentLanguage;
    
    if (!targetLanguage) {
      setIsLoading(false);
      return;
    }
    
    // If English, use already loaded English translations
    if (targetLanguage === 'en') {
      // Use the imported enTranslations directly if englishTranslations state is not ready
      const translationsToUse = (englishTranslations && Object.keys(englishTranslations).length > 0) 
        ? englishTranslations 
        : enTranslations;
      
      if (translationsToUse && Object.keys(translationsToUse).length > 0) {
        // Create a new object reference to ensure React detects the change
        setTranslations({ ...translationsToUse });
        // Ensure englishTranslations state is also set
        if (!englishTranslations || Object.keys(englishTranslations).length === 0) {
          setEnglishTranslations(translationsToUse);
        }
        setIsLoading(false);
        if (import.meta.env.DEV) {
          console.log('[Translation] Using pre-loaded English translations');
        }
        return;
      }
    }
    
    setIsLoading(true);
    try {
      if (import.meta.env.DEV) {
        console.log(`[Translation] Loading translations for language: ${targetLanguage}`);
      }

      const translationPath = `../data/translations/${targetLanguage}.json`;
      const importer = translationImporters[translationPath];
      if (!importer) {
        throw new Error(`No translation file found for ${targetLanguage} (${translationPath})`);
      }

      const translationModule = await importer();
      
      // Handle both default export and named export
      const loadedTranslations = translationModule.default || translationModule;
      
      if (!loadedTranslations || typeof loadedTranslations !== 'object') {
        throw new Error(`Invalid translation data for ${targetLanguage}`);
      }
      
      // Create a new object reference to ensure React detects the change
      setTranslations({ ...loadedTranslations });
      
      if (import.meta.env.DEV) {
        console.log(`[Translation] Successfully loaded ${Object.keys(loadedTranslations).length} top-level keys for ${targetLanguage}`);
      }
      
      // If loading English, also update englishTranslations
      if (targetLanguage === 'en') {
        setEnglishTranslations({ ...loadedTranslations });
      }
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error(`[Translation] Failed to load translations for ${targetLanguage}:`, error);
      }
      // Fall back to English translations - try multiple sources
      const fallbackTranslations = (englishTranslations && Object.keys(englishTranslations).length > 0)
        ? englishTranslations
        : (enTranslations && Object.keys(enTranslations).length > 0)
        ? enTranslations
        : null;
      
      if (fallbackTranslations) {
        setTranslations(fallbackTranslations);
        if (!englishTranslations || Object.keys(englishTranslations).length === 0) {
          setEnglishTranslations(fallbackTranslations);
        }
      } else {
        if (import.meta.env.DEV) {
          console.error('[Translation] No English fallback translations available; using minimal fallback.');
        }
        // Set a minimal fallback to prevent runtime errors
        const minimalFallback = {
          common: { 
            brand: { 
              name: "SocialCaution™", 
              tagline: "by ERMITS",
              line1: "Your Data Matters",
              line2: "unmuted"
            },
            navigation: { home: "Home", howItWorks: "How It Works", features: "Features", toolkit: "Toolkit", alerts: "Alerts", dashboard: "Dashboard", startNow: "Start Now", start: "Start", account: "Account" },
            privacy: { zeroData: "Zero data collection", localProcessing: "Local processing only", gdprCompliant: "GDPR compliant" },
            actions: { start: "Start", continue: "Continue", back: "Back", next: "Next", skip: "Skip", close: "Close", refresh: "Refresh Page", goBack: "Go Back", goHome: "Go Home", backToHome: "Back to Home" }
          },
          header: {
            ariaLabels: {
              account: "Account",
              toggleMenu: "Toggle mobile menu"
            }
          }
        };
        setTranslations(minimalFallback);
        setEnglishTranslations(minimalFallback);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const changeLanguage = useCallback(async (langCode) => {
    if (langCode === currentLanguage) {
      if (import.meta.env.DEV) {
        console.log('[Translation] Language already set to:', langCode);
      }
      return;
    }
    
    // Validate language code
    const supportedLanguages = ['en', 'fr', 'es'];
    if (!supportedLanguages.includes(langCode)) {
      console.warn(`[Translation] Unsupported language code: ${langCode}`);
      return;
    }
    
    try {
      // Save language preference first
      safeLocalStorage.setItem('socialcaution_language', langCode);
      
      // Mark that we're changing language to prevent useEffect from interfering
      isChangingLanguageRef.current = true;
      
      // Set loading state
      setIsLoading(true);
      
      if (import.meta.env.DEV) {
        console.log('[Translation] Changing language to:', langCode);
      }
      
      // Load translations FIRST before updating currentLanguage
      // This ensures translations are ready when components re-render
      await loadTranslations(langCode);
      
      // Only update currentLanguage after translations are loaded
      setCurrentLanguage(langCode);
      
      if (import.meta.env.DEV) {
        console.log('[Translation] Language changed successfully to:', langCode);
      }
      
      // Reset the flag after React has processed the state update
      // Use setTimeout to ensure useEffect doesn't trigger a reload
      setTimeout(() => {
        isChangingLanguageRef.current = false;
        setIsLoading(false);
      }, 100);
    } catch (error) {
      console.error('[Translation] Error changing language:', error);
      setIsLoading(false);
      isChangingLanguageRef.current = false;
      // Fallback to English on error
      try {
        await loadTranslations('en');
        setCurrentLanguage('en');
      } catch (fallbackError) {
        console.error('[Translation] Failed to load English fallback:', fallbackError);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentLanguage]);

  const t = useCallback((key, params = {}) => {
    // Helper function to get value from translation object
    const getValueFromTranslations = (translationObj, keyPath) => {
      if (!translationObj || Object.keys(translationObj).length === 0) {
        return null;
      }
      
      const keys = keyPath.split('.');
      let value = translationObj;
      
      for (const k of keys) {
        if (value && typeof value === 'object') {
          value = value[k];
        } else {
          return null;
        }
      }
      
      return value;
    };
    
    // Ensure we have valid translations object - try multiple sources
    // ALWAYS use the latest translations state directly
    let currentTranslations = null;
    
    // Priority 1: Current translations state (always use this first)
    if (translations && typeof translations === 'object' && Object.keys(translations).length > 0) {
      currentTranslations = translations;
    }
    // Priority 2: English translations state
    else if (englishTranslations && typeof englishTranslations === 'object' && Object.keys(englishTranslations).length > 0) {
      currentTranslations = englishTranslations;
    }
    // Priority 3: Imported enTranslations (should always be available)
    else if (enTranslations && typeof enTranslations === 'object' && Object.keys(enTranslations).length > 0) {
      currentTranslations = enTranslations;
      // Also update state if it's empty - but do this asynchronously to avoid blocking
      if (import.meta.env.DEV) {
        console.warn('[Translation] Using imported enTranslations directly, state was empty');
      }
      // Force state update in next tick
      setTimeout(() => {
        if (!translations || Object.keys(translations).length === 0) {
          setTranslations({ ...enTranslations });
        }
      }, 0);
    }
    
    // Try to get translation from current language
    let value = currentTranslations ? getValueFromTranslations(currentTranslations, key) : null;
    
    // If not found and current language is not English, try English fallback
    if ((value === undefined || value === null) && currentLanguage !== 'en') {
      const fallbackTranslations = (englishTranslations && Object.keys(englishTranslations).length > 0)
        ? englishTranslations
        : (enTranslations && Object.keys(enTranslations).length > 0)
        ? enTranslations
        : null;
        
      if (fallbackTranslations) {
        value = getValueFromTranslations(fallbackTranslations, key);
        // Log warning in development mode when falling back to English
        if (import.meta.env.DEV && value !== null && value !== undefined) {
          console.warn(`Translation missing for key "${key}" in ${currentLanguage}, using English fallback`);
        }
      }
    }
    
    // If still not found, return key or log warning
    if (value === undefined || value === null) {
      // Log warning in development mode with more details
      if (import.meta.env.DEV) {
        console.warn(`[Translation] Missing key: ${key}`, {
          hasTranslations: !!translations && Object.keys(translations).length > 0,
          hasEnglishTranslations: !!englishTranslations && Object.keys(englishTranslations).length > 0,
          hasEnTranslations: !!enTranslations && Object.keys(enTranslations).length > 0,
          currentLanguage
        });
      }
      // Return a readable version of the key as last resort
      return key.split('.').pop().replace(/([A-Z])/g, ' $1').trim() || key;
    }
    
    // Handle arrays and objects - return as-is
    if (typeof value !== 'string') {
      return value;
    }
    
    // Replace parameters in translation string
    return value.replace(/\{\{(\w+)\}\}/g, (match, param) => {
      return params[param] !== undefined ? params[param] : match;
    });
  }, [translations, englishTranslations, currentLanguage]);

  const getSupportedLanguages = useCallback(() => {
    return [
      { code: 'en', name: 'English', nativeName: 'English' },
      { code: 'fr', name: 'French', nativeName: 'Français' },
      { code: 'es', name: 'Spanish', nativeName: 'Español' }
    ];
  }, []);

  // Use useMemo to ensure context value updates when translations change
  // This is critical for triggering re-renders in consuming components
  // Ensure value is always a valid object to prevent context errors
  const value = useMemo(() => {
    const contextValue = {
      currentLanguage: currentLanguage || 'en',
      translations: translations || {},
      isLoading: isLoading || false,
      changeLanguage: changeLanguage || (async () => {}),
      t: t || ((key) => key.split('.').pop().replace(/([A-Z])/g, ' $1').trim() || key),
      getSupportedLanguages: getSupportedLanguages || (() => [])
    };
    return contextValue;
  }, [currentLanguage, translations, isLoading, changeLanguage, t, getSupportedLanguages]);

  return (
    <TranslationContext.Provider value={value}>
      {children}
    </TranslationContext.Provider>
  );
};

// Language selector component
// PERSISTENT FIX: This component uses a robust pattern that prevents recurring issues
export const LanguageSelector = ({ className = '', buttonClassName = '', iconClassName = 'w-5 h-5' }) => {
  const { currentLanguage, changeLanguage, getSupportedLanguages, isLoading } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });
  const [isProcessing, setIsProcessing] = useState(false); // State-based processing flag
  const buttonRef = useRef(null);
  const dropdownRef = useRef(null);
  const isProcessingRef = useRef(false); // Ref for quick checks in event handlers

  const languages = getSupportedLanguages();
  const currentLang = languages.find(lang => lang.code === currentLanguage);

  // Handle language change with comprehensive error handling
  const handleLanguageChange = useCallback(async (langCode) => {
    // Prevent multiple simultaneous language changes
    if (isProcessingRef.current || isProcessing) {
      if (import.meta.env.DEV) {
        console.warn('[LanguageSelector] Language change already in progress');
      }
      return;
    }

    // Prevent changing to the same language
    if (langCode === currentLanguage) {
      setIsOpen(false);
      return;
    }

    // Set both ref and state for processing flag
    isProcessingRef.current = true;
    setIsProcessing(true);
    
    try {
      // Close dropdown immediately for better UX
      setIsOpen(false);
      
      // Change language - no delay needed since processing flag is set on mousedown
      await changeLanguage(langCode);
      
      if (import.meta.env.DEV) {
        console.log('[LanguageSelector] Language successfully changed to:', langCode);
      }
    } catch (error) {
      console.error('[LanguageSelector] Error changing language:', error);
      // Reset flags on error so user can try again
      isProcessingRef.current = false;
      setIsProcessing(false);
    } finally {
      // Reset flags after a delay to ensure all state updates complete
      setTimeout(() => {
        isProcessingRef.current = false;
        setIsProcessing(false);
      }, 150);
    }
  }, [currentLanguage, changeLanguage, isProcessing]);

  // Handle button click to toggle dropdown
  const handleButtonClick = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Don't toggle if processing a language change
    if (isProcessingRef.current) {
      return;
    }
    
    setIsOpen(prev => !prev);
  }, []);

  // Update dropdown position when opened or window resizes
  useEffect(() => {
    if (!isOpen) return;

    const updatePosition = () => {
      if (buttonRef.current) {
        const rect = buttonRef.current.getBoundingClientRect();
        setDropdownPosition({
          top: rect.bottom + 4,
          left: rect.left
        });
      }
    };

    // Update position immediately and on window events
    updatePosition();
    window.addEventListener('resize', updatePosition);
    window.addEventListener('scroll', updatePosition, true);

    return () => {
      window.removeEventListener('resize', updatePosition);
      window.removeEventListener('scroll', updatePosition, true);
    };
  }, [isOpen]);

  // ULTRA-SIMPLE FIX: Use click event in bubble phase with proper delay
  // Button onClick fires FIRST, then this handler runs
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event) => {
      // If we're processing, don't close
      if (isProcessingRef.current || isProcessing) {
        return;
      }

      // Check if click is inside the dropdown or button
      const target = event.target;
      const clickedButton = buttonRef.current?.contains(target);
      const clickedDropdown = dropdownRef.current?.contains(target);
      const isLanguageOption = target.closest('[data-language-option]');
      
      // If clicked inside, don't close
      if (clickedButton || clickedDropdown || isLanguageOption) {
        return;
      }

      // Close dropdown if clicked outside
      // Use setTimeout to ensure button clicks process first
      setTimeout(() => {
        setIsOpen(false);
      }, 10);
    };

    const handleEscape = (event) => {
      if (event.key === 'Escape' && !isProcessingRef.current && !isProcessing) {
        setIsOpen(false);
      }
    };

    // CRITICAL: Use click event (NOT mousedown) in bubble phase (NOT capture)
    // This ensures button onClick handlers fire FIRST, then this handler runs
    // The delay ensures dropdown is fully rendered and handlers are attached
    const timeoutId = setTimeout(() => {
      document.addEventListener('click', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
      document.addEventListener('keydown', handleEscape);
    }, 200); // Longer delay to ensure everything is ready
    
    return () => {
      clearTimeout(timeoutId);
      document.removeEventListener('click', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, isProcessing]);

  return (
    <div className={`relative flex-shrink-0 ${className}`}>
      <button
        ref={buttonRef}
        onClick={handleButtonClick}
        disabled={isLoading}
        type="button"
        className={`flex items-center justify-center flex-shrink-0 ${buttonClassName ? buttonClassName : 'p-2'} text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors`}
        aria-label={`Select language (Current: ${currentLang?.nativeName || 'English'})`}
        aria-expanded={isOpen}
        aria-haspopup="true"
        title={currentLang?.nativeName || 'English'}
      >
        <svg 
          className={iconClassName}
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" 
          />
        </svg>
      </button>

      {isOpen && typeof document !== 'undefined' ? createPortal(
        <div 
          ref={dropdownRef}
          className="fixed w-48 bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-600 rounded-lg shadow-xl z-[9999]"
          role="menu"
          aria-orientation="vertical"
          data-language-dropdown="true"
          onMouseDown={(e) => {
            // Stop propagation on mousedown to prevent click-outside handler
            e.stopPropagation();
          }}
          onClick={(e) => {
            // Stop propagation to prevent click-outside handler from closing dropdown
            e.stopPropagation();
          }}
          style={{
            top: `${dropdownPosition.top}px`,
            left: `${dropdownPosition.left}px`
          }}
        >
          <div className="py-1">
            {languages.map((lang) => (
              <button
                key={lang.code}
                data-language-option={lang.code}
                onClick={(e) => {
                  // CRITICAL: Stop propagation FIRST to prevent click-outside handler
                  e.preventDefault();
                  e.stopPropagation();
                  
                  // Don't process if already processing or same language
                  if (isProcessingRef.current || isProcessing || lang.code === currentLanguage) {
                    console.log('[LanguageSelector] Skipping - already processing or same language');
                    return;
                  }
                  
                  // Log for debugging (always log, even in production for troubleshooting)
                  console.log('[LanguageSelector] Language option clicked:', lang.code);
                  
                  // Call handler immediately
                  handleLanguageChange(lang.code);
                }}
                type="button"
                disabled={isLoading || isProcessing}
                className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${
                  currentLanguage === lang.code ? 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 font-semibold' : 'text-gray-700 dark:text-gray-300'
                }`}
                role="menuitem"
                aria-selected={currentLanguage === lang.code}
              >
                <span className="font-medium">{lang.nativeName}</span>
                {currentLanguage === lang.code && (
                  <span className="ml-2 text-red-600 dark:text-red-400">✓</span>
                )}
              </button>
            ))}
          </div>
        </div>,
        document.body
      ) : null}
    </div>
  );
};

// Translatable text component
export const TranslatableText = ({ translationKey, params = {}, fallback = '', className = '' }) => {
  const { t } = useTranslation();
  
  return (
    <span className={className}>
      {t(translationKey, params) || fallback}
    </span>
  );
};

// RTL support hook
export const useRTL = () => {
  const { currentLanguage } = useTranslation();
  const rtlLanguages = ['ar', 'he', 'fa', 'ur'];
  return rtlLanguages.includes(currentLanguage);
};

// Date formatting hook
export const useDateFormat = () => {
  const { currentLanguage } = useTranslation();
  
  const formatDate = (date, options = {}) => {
    const defaultOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      ...options
    };
    
    return new Intl.DateTimeFormat(currentLanguage, defaultOptions).format(date);
  };
  
  const formatTime = (date, options = {}) => {
    const defaultOptions = {
      hour: '2-digit',
      minute: '2-digit',
      ...options
    };
    
    return new Intl.DateTimeFormat(currentLanguage, defaultOptions).format(date);
  };
  
  return { formatDate, formatTime };
};

// Number formatting hook
export const useNumberFormat = () => {
  const { currentLanguage } = useTranslation();
  
  const formatNumber = (number, options = {}) => {
    return new Intl.NumberFormat(currentLanguage, options).format(number);
  };
  
  const formatCurrency = (amount, currency = 'USD', options = {}) => {
    return new Intl.NumberFormat(currentLanguage, {
      style: 'currency',
      currency,
      ...options
    }).format(amount);
  };
  
  const formatPercentage = (value, options = {}) => {
    return new Intl.NumberFormat(currentLanguage, {
      style: 'percent',
      ...options
    }).format(value);
  };
  
  return { formatNumber, formatCurrency, formatPercentage };
};

export default TranslationProvider;

