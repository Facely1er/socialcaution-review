import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext({
  theme: 'light',
  updateTheme: () => {}
});

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
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

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    // Check if we're in browser environment
    if (typeof window === 'undefined') return 'light';
    
    // Check localStorage first, then system preference
    const savedTheme = safeLocalStorage.getItem('theme');
    if (savedTheme === 'light' || savedTheme === 'dark') {
      return savedTheme;
    }
    
    // Check system preference safely
    try {
      if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        return 'dark';
      }
    } catch (error) {
      if (import.meta.env.DEV) {
        console.warn('matchMedia check failed:', error);
      }
    }
    
    return 'light';
  });

  const updateTheme = (newTheme) => {
    setTheme(newTheme);
    safeLocalStorage.setItem('theme', newTheme);
    if (typeof document !== 'undefined' && document.documentElement) {
      document.documentElement.classList.toggle('dark', newTheme === 'dark');
    }
  };

  useEffect(() => {
    // Apply theme on initial load (sync with HTML script)
    if (typeof document !== 'undefined' && document.documentElement) {
      // Remove all theme classes first
      document.documentElement.classList.remove('dark', 'light');
      // Add current theme class
      if (theme === 'dark') {
        document.documentElement.classList.add('dark');
      }
    }
  }, [theme]);
  
  // Apply theme immediately on mount to prevent flash
  useEffect(() => {
    if (typeof document !== 'undefined' && document.documentElement) {
      // Ensure theme is applied immediately
      if (theme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  }, []); // Run once on mount

  return (
    <ThemeContext.Provider value={{ theme, updateTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeContext;