/**
 * User Initialization Utility
 * Sets up default services and user profile for new users
 * Provides a better onboarding experience with preselected common services
 */

// Common services to preselect for demo/onboarding
// Reduced to 3 most common services for better conversion (less assumption, more engagement)
// These are the most widely used services globally, each from a different category
const DEFAULT_SERVICES = [
  'google',      // Google - search-email (most universal)
  'facebook',    // Facebook - social-media (very common)
  'amazon'       // Amazon - shopping (very common, different category)
];

/**
 * Check if user is new (hasn't initialized their profile)
 * @returns {boolean} True if user is new
 */
export const isNewUser = () => {
  try {
    const services = localStorage.getItem('socialcaution_services');
    const initialized = localStorage.getItem('socialcaution_user_initialized');
    
    // User is new if:
    // 1. No services selected AND
    // 2. Not previously initialized
    return (!services || JSON.parse(services).length === 0) && !initialized;
  } catch (error) {
    console.error('[User Initialization] Error checking if new user:', error);
    return false;
  }
};

/**
 * Initialize user profile with default services
 * @param {boolean} force - Force re-initialization even if already initialized
 * @returns {object} Initialization result
 */
export const initializeUserProfile = (force = false) => {
  try {
    // Check if already initialized (unless forcing)
    if (!force && localStorage.getItem('socialcaution_user_initialized')) {
      return {
        success: false,
        message: 'User already initialized',
        initialized: true
      };
    }

    // Get current services (if any)
    const existingServices = JSON.parse(
      localStorage.getItem('socialcaution_services') || '[]'
    );

    // Only add default services if user has none
    let servicesToSet = existingServices;
    if (existingServices.length === 0 || force) {
      servicesToSet = [...DEFAULT_SERVICES];
    }

    // Set services
    localStorage.setItem('socialcaution_services', JSON.stringify(servicesToSet));

    // Also set for Privacy Radar compatibility (some components use this key)
    localStorage.setItem('socialcaution_selected_services', JSON.stringify(servicesToSet));

    // Mark as initialized
    localStorage.setItem('socialcaution_user_initialized', 'true');

    // Set initialization timestamp
    localStorage.setItem('socialcaution_user_initialized_at', new Date().toISOString());

    // Initialize other default values if needed
    if (!localStorage.getItem('socialcaution_profile')) {
      localStorage.setItem('socialcaution_profile', JSON.stringify({
        createdAt: new Date().toISOString(),
        initialized: true
      }));
    }

    return {
      success: true,
      message: 'User profile initialized successfully',
      services: servicesToSet,
      initialized: true
    };
  } catch (error) {
    console.error('[User Initialization] Error initializing user profile:', error);
    return {
      success: false,
      message: error.message,
      initialized: false
    };
  }
};

/**
 * Get default services list
 * @returns {string[]} Array of default service IDs
 */
export const getDefaultServices = () => {
  return [...DEFAULT_SERVICES];
};

/**
 * Reset user initialization (for testing or user request)
 */
export const resetUserInitialization = () => {
  try {
    localStorage.removeItem('socialcaution_user_initialized');
    localStorage.removeItem('socialcaution_user_initialized_at');
    return {
      success: true,
      message: 'User initialization reset'
    };
  } catch (error) {
    console.error('[User Initialization] Error resetting initialization:', error);
    return {
      success: false,
      message: error.message
    };
  }
};

/**
 * Check if user has been initialized
 * @returns {boolean} True if user has been initialized
 */
export const isUserInitialized = () => {
  try {
    return !!localStorage.getItem('socialcaution_user_initialized');
  } catch (error) {
    return false;
  }
};

