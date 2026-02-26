// Input validation and sanitization utilities
export const ValidationUtils = {
  // Sanitize user input to prevent XSS attacks
  sanitizeInput: (input) => {
    if (typeof input !== 'string') return input;
    return input
      .replace(/[<>]/g, '') // Remove potential HTML tags
      .trim()
      .slice(0, 1000); // Limit input length
  },

  // Validate email format
  validateEmail: (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  // Validate assessment responses
  validateAssessmentResponse: (questionId, response) => {
    const validResponses = {
      'privacyAwareness': ['unaware', 'heard', 'basic', 'good', 'expert'],
      'passwordManagement': ['same', 'variations', 'different', 'manager', 'advanced'],
      'socialMediaUse': ['never', 'light', 'moderate', 'daily', 'heavy'],
      'publicSharing': ['never', 'rarely', 'sometimes', 'frequently', 'everything'],
      'wifiUsage': ['never', 'rarely', 'sometimes', 'often', 'always'],
      'deviceSecurity': ['basic', 'moderate', 'good', 'comprehensive'],
      'onlineShoppingFrequency': ['never', 'rarely', 'monthly', 'weekly', 'daily'],
      'dataSharingComfort': ['very-uncomfortable', 'uncomfortable', 'neutral', 'somewhat', 'comfortable']
    };

    return validResponses[questionId] && validResponses[questionId].includes(response);
  },

  // Validate and sanitize persona selection
  validatePersona: (personaId) => {
    const validPersonas = [
      'cautious-parent',
      'digital-novice', 
      'privacy-advocate',
      'online-shopper',
      'social-influencer',
      'private-individual',
      'concerned-employee',
      'data-controller',
      'student'
    ];
    return validPersonas.includes(personaId);
  }
};

// Error logging utility
export const ErrorLogger = {
  log: (error, context = {}) => {
    const errorData = {
      message: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString(),
      url: typeof window !== 'undefined' ? window.location.href : 'unknown',
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'unknown',
      context
    };

    // In production, send to logging service
    if (import.meta.env.PROD) {
      // Example: send to logging service
      // LoggingService.send(errorData);
      // Only log in production if explicitly enabled for debugging
      if (import.meta.env.VITE_ENABLE_ERROR_LOGGING === 'true') {
        console.error('Production Error:', errorData);
      }
    } else {
      // Development mode - always log for debugging
      console.error('Development Error:', errorData);
    }
  }
};