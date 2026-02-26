/**
 * Version Detection Utility
 * Determines if running Basic or Standard version
 */

export const VERSION_TYPES = {
  BASIC: 'basic',
  STANDARD: 'standard'
};

/**
 * Detect which version is running
 * @returns {string} 'basic' or 'standard'
 */
export const detectVersion = () => {
  // Check hostname
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;
    
    // Check for basic/free subdomain or path
    if (hostname.includes('basic') || 
        hostname.includes('free') ||
        window.location.pathname.startsWith('/basic') ||
        window.location.pathname.startsWith('/free')) {
      return VERSION_TYPES.BASIC;
    }
  }
  
  // Check build environment variable
  if (import.meta.env.VITE_APP_VERSION === 'basic') {
    return VERSION_TYPES.BASIC;
  }
  
  // Check data-version attribute in the DOM
  if (typeof document !== 'undefined') {
    const rootElement = document.getElementById('root');
    if (rootElement?.dataset?.version === 'basic') {
      return VERSION_TYPES.BASIC;
    }
  }
  
  // Default to standard
  return VERSION_TYPES.STANDARD;
};

/**
 * Check if running basic version
 * @returns {boolean}
 */
export const isBasicVersion = () => {
  return detectVersion() === VERSION_TYPES.BASIC;
};

/**
 * Check if running standard version
 * @returns {boolean}
 */
export const isStandardVersion = () => {
  return detectVersion() === VERSION_TYPES.STANDARD;
};

/**
 * Get version-specific URLs
 */
export const getVersionUrls = () => {
  return {
    basic: import.meta.env.VITE_BASIC_VERSION_URL || 'https://socialcaution.com',
    standard: import.meta.env.VITE_STANDARD_VERSION_URL || 'https://app.socialcaution.com'
  };
};

/**
 * Get current version info
 */
export const getVersionInfo = () => {
  const version = detectVersion();
  return {
    version,
    isBasic: version === VERSION_TYPES.BASIC,
    isStandard: version === VERSION_TYPES.STANDARD,
    urls: getVersionUrls()
  };
};

