// Security utilities for production deployment
export const SecurityUtils = {
  // Content Security Policy configuration
  getCSPDirectives: () => ({
    'default-src': ["'self'"],
    'script-src': [
      "'self'",
      "'unsafe-inline'", // Required for analytics
      'https://www.google-analytics.com',
      'https://www.googletagmanager.com',
      'https://analytics.google.com'
    ],
    'style-src': [
      "'self'",
      "'unsafe-inline'", // Required for Tailwind
      'https://fonts.googleapis.com'
    ],
    'img-src': [
      "'self'",
      'data:',
      'https:',
      'https://www.google-analytics.com'
    ],
    'font-src': [
      "'self'",
      'https://fonts.gstatic.com'
    ],
    'connect-src': [
      "'self'",
      'https://www.google-analytics.com',
      'https://analytics.google.com'
    ],
    'frame-ancestors': ["'none'"],
    'base-uri': ["'self'"],
    'form-action': ["'self'"],
    'upgrade-insecure-requests': []
  }),

  // Generate CSP header string
  generateCSPHeader: function() {
    const directives = this.getCSPDirectives();
    return Object.entries(directives)
      .map(([directive, sources]) => 
        `${directive} ${sources.join(' ')}`
      )
      .join('; ');
  },

  // Input sanitization for production
  sanitizeInput: (input, options = {}) => {
    if (typeof input !== 'string') return input;
    
    const {
      maxLength = 1000,
      allowHTML = false,
      allowNewlines = true
    } = options;

    let sanitized = input.trim();
    
    // Limit length
    sanitized = sanitized.slice(0, maxLength);
    
    // Remove potential XSS vectors if HTML not allowed
    if (!allowHTML) {
      sanitized = sanitized
        .replace(/[<>]/g, '')
        .replace(/javascript:/gi, '')
        .replace(/on\w+=/gi, '');
    }
    
    // Handle newlines
    if (!allowNewlines) {
      sanitized = sanitized.replace(/[\r\n]/g, ' ');
    }
    
    return sanitized;
  },

  // Rate limiting helpers (for future API integration)
  rateLimitConfig: {
    assessment: { requests: 10, window: '15m' },
    general: { requests: 100, window: '15m' },
    analytics: { requests: 50, window: '1m' }
  }
};

// Environment validation for production
// NOTE: This validator is currently not used but kept for potential future use
// If used, ensure environment variables are accessed via import.meta.env (Vite) not process.env
export const EnvironmentValidator = {
  requiredVars: [
    'VITE_REACT_APP_GA_ID',
    'VITE_REACT_APP_SENTRY_DSN',
    'VITE_REACT_APP_API_BASE_URL'
  ],

  optionalVars: [
    'VITE_REACT_APP_ENABLE_ANALYTICS',
    'VITE_REACT_APP_ENABLE_ERROR_REPORTING',
    'VITE_REACT_APP_ENVIRONMENT'
  ],

  validateEnvironment: () => {
    const missing = [];
    const warnings = [];

    // Check required variables (using import.meta.env for Vite)
    EnvironmentValidator.requiredVars.forEach(varName => {
      if (!import.meta.env[varName]) {
        missing.push(varName);
      }
    });

    // Check optional but recommended variables
    EnvironmentValidator.optionalVars.forEach(varName => {
      if (!import.meta.env[varName]) {
        warnings.push(varName);
      }
    });

    if (missing.length > 0) {
      // Always log missing required variables as this is critical
      if (import.meta.env.DEV || import.meta.env.VITE_ENABLE_ERROR_LOGGING === 'true') {
        console.error('Missing required environment variables:', missing);
      }
      throw new Error(`Required environment variables missing: ${missing.join(', ')}`);
    }

    if (warnings.length > 0 && import.meta.env.DEV) {
      // Only warn about optional variables in development
      console.warn('Optional environment variables not set:', warnings);
    }

    return true;
  }
};

// Feature flags for production rollout
export const FeatureFlags = {
  flags: {
    advancedAnalytics: import.meta.env.VITE_REACT_APP_ENABLE_ADVANCED_ANALYTICS === 'true',
    errorReporting: import.meta.env.VITE_REACT_APP_ERROR_REPORTING_ENABLED !== 'false',
    performanceMonitoring: import.meta.env.VITE_REACT_APP_ENABLE_PERFORMANCE_MONITORING === 'true',
    userFeedback: import.meta.env.VITE_REACT_APP_ENABLE_USER_FEEDBACK !== 'false',
    betaFeatures: import.meta.env.VITE_REACT_APP_ENABLE_BETA_FEATURES === 'true'
  },

  isEnabled: (flagName) => {
    return FeatureFlags.flags[flagName] === true;
  },

  getEnabledFlags: () => {
    return Object.entries(FeatureFlags.flags)
      .filter(([_, enabled]) => enabled)
      .map(([flag, _]) => flag);
  }
};