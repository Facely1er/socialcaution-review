/**
 * Responsive Design Utilities
 * Provides utilities for responsive design, touch detection, and mobile optimization
 */

/**
 * Check if device is mobile
 * @returns {boolean}
 */
export const isMobile = () => {
  if (typeof window === 'undefined') return false;
  return window.innerWidth < 768 || /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
};

/**
 * Check if device is tablet
 * @returns {boolean}
 */
export const isTablet = () => {
  if (typeof window === 'undefined') return false;
  return window.innerWidth >= 768 && window.innerWidth < 1024;
};

/**
 * Check if device is desktop
 * @returns {boolean}
 */
export const isDesktop = () => {
  if (typeof window === 'undefined') return false;
  return window.innerWidth >= 1024;
};

/**
 * Check if device supports touch
 * @returns {boolean}
 */
export const isTouchDevice = () => {
  if (typeof window === 'undefined') return false;
  return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
};

/**
 * Get current breakpoint
 * @returns {string} 'mobile' | 'tablet' | 'desktop'
 */
export const getBreakpoint = () => {
  if (typeof window === 'undefined') return 'desktop';
  const width = window.innerWidth;
  if (width < 768) return 'mobile';
  if (width < 1024) return 'tablet';
  return 'desktop';
};

/**
 * Get safe area insets for mobile devices
 * @returns {object} { top, bottom, left, right }
 */
export const getSafeAreaInsets = () => {
  if (typeof window === 'undefined' || typeof CSS === 'undefined') {
    return { top: 0, bottom: 0, left: 0, right: 0 };
  }
  
  const style = getComputedStyle(document.documentElement);
  return {
    top: parseInt(style.getPropertyValue('env(safe-area-inset-top)') || '0', 10),
    bottom: parseInt(style.getPropertyValue('env(safe-area-inset-bottom)') || '0', 10),
    left: parseInt(style.getPropertyValue('env(safe-area-inset-left)') || '0', 10),
    right: parseInt(style.getPropertyValue('env(safe-area-inset-right)') || '0', 10),
  };
};

/**
 * Check if device is in landscape orientation
 * @returns {boolean}
 */
export const isLandscape = () => {
  if (typeof window === 'undefined') return false;
  return window.innerWidth > window.innerHeight;
};

/**
 * Check if device is in portrait orientation
 * @returns {boolean}
 */
export const isPortrait = () => {
  if (typeof window === 'undefined') return true;
  return window.innerHeight > window.innerWidth;
};

/**
 * Get viewport dimensions
 * @returns {object} { width, height }
 */
export const getViewportSize = () => {
  if (typeof window === 'undefined') return { width: 0, height: 0 };
  return {
    width: window.innerWidth,
    height: window.innerHeight
  };
};

/**
 * Check if PWA is installed
 * @returns {boolean}
 */
export const isPWAInstalled = () => {
  if (typeof window === 'undefined') return false;
  
  // Check if running in standalone mode (PWA)
  if (window.matchMedia('(display-mode: standalone)').matches) {
    return true;
  }
  
  // Check if running in fullscreen mode
  if (window.matchMedia('(display-mode: fullscreen)').matches) {
    return true;
  }
  
  // iOS Safari check
  if (window.navigator.standalone === true) {
    return true;
  }
  
  return false;
};

/**
 * Check if device is iOS
 * @returns {boolean}
 */
export const isIOS = () => {
  if (typeof window === 'undefined') return false;
  return /iPad|iPhone|iPod/.test(navigator.userAgent) || 
         (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
};

/**
 * Check if device is Android
 * @returns {boolean}
 */
export const isAndroid = () => {
  if (typeof window === 'undefined') return false;
  return /Android/.test(navigator.userAgent);
};

/**
 * Get device pixel ratio
 * @returns {number}
 */
export const getDevicePixelRatio = () => {
  if (typeof window === 'undefined') return 1;
  return window.devicePixelRatio || 1;
};

/**
 * Check if reduced motion is preferred
 * @returns {boolean}
 */
export const prefersReducedMotion = () => {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

/**
 * Check if dark mode is preferred
 * @returns {boolean}
 */
export const prefersDarkMode = () => {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-color-scheme: dark)').matches;
};

/**
 * Hook for responsive breakpoint changes
 * @param {function} callback - Callback function called on breakpoint change
 * @returns {function} Cleanup function
 */
export const onBreakpointChange = (callback) => {
  if (typeof window === 'undefined') return () => {};
  
  let lastBreakpoint = getBreakpoint();
  
  const handleResize = () => {
    const currentBreakpoint = getBreakpoint();
    if (currentBreakpoint !== lastBreakpoint) {
      lastBreakpoint = currentBreakpoint;
      callback(currentBreakpoint, lastBreakpoint);
    }
  };
  
  window.addEventListener('resize', handleResize);
  
  return () => {
    window.removeEventListener('resize', handleResize);
  };
};

/**
 * Get optimal image size for current device
 * @param {object} sizes - Object with breakpoint keys and size values
 * @returns {string}
 */
export const getOptimalImageSize = (sizes = {}) => {
  const breakpoint = getBreakpoint();
  const pixelRatio = getDevicePixelRatio();
  
  const baseSize = sizes[breakpoint] || sizes.mobile || '100vw';
  
  // Adjust for pixel ratio on mobile devices
  if (breakpoint === 'mobile' && pixelRatio > 1) {
    // Return size that accounts for pixel ratio
    return baseSize;
  }
  
  return baseSize;
};

/**
 * Check if connection is slow
 * @returns {boolean}
 */
export const isSlowConnection = () => {
  if (typeof navigator === 'undefined' || !navigator.connection) return false;
  
  const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
  if (!connection) return false;
  
  // Check effective type
  const effectiveType = connection.effectiveType;
  if (effectiveType === 'slow-2g' || effectiveType === '2g') {
    return true;
  }
  
  // Check downlink speed
  if (connection.downlink && connection.downlink < 1.5) {
    return true;
  }
  
  return false;
};

/**
 * Debounce function for resize events
 * @param {function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @returns {function}
 */
export const debounce = (func, wait = 250) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

/**
 * Throttle function for scroll/resize events
 * @param {function} func - Function to throttle
 * @param {number} limit - Time limit in milliseconds
 * @returns {function}
 */
export const throttle = (func, limit = 250) => {
  let inThrottle;
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

