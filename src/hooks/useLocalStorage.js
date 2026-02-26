import { useState, useEffect } from 'react';
import { ErrorLogger } from '../utils/validation';

// Enhanced localStorage hook with error handling and encryption option
export const useLocalStorage = (key, initialValue, options = {}) => {
  const { encrypt = false } = options;

  const [storedValue, setStoredValue] = useState(() => {
    try {
      if (typeof window === 'undefined') return initialValue;
      
      const item = window.localStorage.getItem(key);
      if (item) {
        const parsed = JSON.parse(item);
        // In production, implement proper decryption here if encrypt is true
        return parsed;
      }
      return initialValue;
    } catch (error) {
      ErrorLogger.log(error, { context: 'localStorage read', key });
      return initialValue;
    }
  });

  const setValue = (value) => {
    try {
      // Use functional update pattern to ensure we always get the latest state
      setStoredValue(currentValue => {
        const valueToStore = value instanceof Function ? value(currentValue) : value;
        
        // Persist to localStorage
        if (typeof window !== 'undefined') {
          try {
            const serializedValue = JSON.stringify(valueToStore);
            window.localStorage.setItem(key, serializedValue);
          } catch (storageError) {
            // Handle quota exceeded specifically
            if (storageError?.name === 'QuotaExceededError' || storageError?.code === 22) {
              if (import.meta.env.DEV) {
                console.error('[useLocalStorage] Quota exceeded for key:', key, {
                  dataSize: serializedValue?.length,
                  error: storageError
                });
              }
              ErrorLogger.log(storageError, { 
                context: 'localStorage write - quota exceeded', 
                key,
                dataSize: serializedValue?.length 
              });
              // Don't throw - gracefully degrade by updating state but not persisting
              // State update still happens, just not persisted to localStorage
              return valueToStore;
            }
            // Other storage errors
            ErrorLogger.log(storageError, { context: 'localStorage write', key });
          }
        }
        
        return valueToStore;
      });
    } catch (error) {
      ErrorLogger.log(error, { context: 'localStorage write', key });
    }
  };

  const removeValue = () => {
    try {
      if (typeof window !== 'undefined') {
        window.localStorage.removeItem(key);
      }
      setStoredValue(initialValue);
    } catch (error) {
      ErrorLogger.log(error, { context: 'localStorage remove', key });
    }
  };

  // Listen for changes in other tabs/windows
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const handleStorageChange = (e) => {
      if (e.key === key && e.newValue !== null) {
        try {
          const newValue = JSON.parse(e.newValue);
          setStoredValue(newValue);
        } catch (error) {
          ErrorLogger.log(error, { context: 'localStorage sync', key });
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [key]);

  return [storedValue, setValue, removeValue];
};

// Hook for secure assessment data storage
export const useSecureAssessmentStorage = () => {
  return useLocalStorage('socialcaution_profile', null, { encrypt: true });
};