// Production utilities and configuration
export class ProductionManager {
  constructor() {
    this.environment = import.meta.env.MODE;
    this.isProduction = import.meta.env.PROD;
    this.config = this.getProductionConfig();
  }

  getProductionConfig() {
    return {
      // Performance configuration
      performance: {
        enableServiceWorker: true,
        enableOfflineSupport: true,
        enableResourceCaching: true,
        bundleSizeLimit: 500 * 1024, // 500KB
        chunkSizeLimit: 250 * 1024,  // 250KB
      },

      // Security configuration
      security: {
        enableCSP: true,
        enableSecureHeaders: true,
        enableInputSanitization: true,
        enableXSSProtection: true,
      },

      // Analytics configuration
      analytics: {
        enableWebVitals: true,
        enableErrorTracking: true,
        enableBusinessMetrics: true,
        anonymizeIP: true,
      },

      // Feature flags
      features: {
        enableBetaFeatures: false,
        enableAdvancedAnalytics: false,
        enableUserFeedback: true,
        enablePerformanceMode: true,
      }
    };
  }

  // Initialize production features
  async initializeProduction() {
    try {
      // Register service worker
      if (this.config.performance.enableServiceWorker) {
        await this.registerServiceWorker();
      }

      // Initialize monitoring
      await this.initializeMonitoring();

      // Setup error handling
      this.setupGlobalErrorHandling();

      // Initialize security measures
      this.initializeSecurity();

      // Setup performance optimization
      this.optimizePerformance();

      // Production initialization complete
    } catch (error) {
      if (import.meta.env.DEV || import.meta.env.VITE_ENABLE_ERROR_LOGGING === 'true') {
        console.error('Production initialization failed:', error);
      }
      // Log to error monitoring service
      if (import.meta.env.PROD && window.Sentry && typeof window.Sentry.captureException === 'function') {
        window.Sentry.captureException(error);
      }
    }
  }

  async registerServiceWorker() {
    if (typeof navigator === 'undefined' || !('serviceWorker' in navigator)) {
      return null;
    }
    
    if (this.isProduction) {
      try {
        const registration = await navigator.serviceWorker.register('/sw.js', {
          scope: '/'
          // Removed type: 'module' - service worker is vanilla JS now
        });

        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              // Show update notification
              this.showUpdateNotification();
            }
          });
        });

        // Service Worker registered successfully
        return registration;
      } catch (error) {
        if (import.meta.env.DEV || import.meta.env.VITE_ENABLE_ERROR_LOGGING === 'true') {
          console.error('Service Worker registration failed:', error);
        }
        // Log to error monitoring service in production
        if (import.meta.env.PROD && window.Sentry && typeof window.Sentry.captureException === 'function') {
          window.Sentry.captureException(error);
        }
      }
    }
  }

  async initializeMonitoring() {
    // Initialize Sentry for error monitoring
    if (this.isProduction && import.meta.env.VITE_REACT_APP_SENTRY_DSN) {
      const Sentry = await import('@sentry/react');
      
      Sentry.init({
        dsn: import.meta.env.VITE_REACT_APP_SENTRY_DSN,
        environment: this.environment,
        tracesSampleRate: 0.1,
        beforeSend(event) {
          // Filter out non-critical errors
          if (event.exception) {
            const error = event.exception.values[0];
            if (error && error.type === 'ChunkLoadError') {
              return null;
            }
          }
          return event;
        },
        beforeBreadcrumb(breadcrumb) {
          // Don't log sensitive data in breadcrumbs
          if (breadcrumb.category === 'console' && breadcrumb.level === 'log') {
            return null;
          }
          return breadcrumb;
        }
      });
    }

    // Initialize performance monitoring
    if (this.config.analytics.enableWebVitals) {
      await this.initializeWebVitals();
    }
  }

  async initializeWebVitals() {
    const { getCLS, getFID, getFCP, getLCP, getTTFB } = await import('web-vitals');
    
    const sendToAnalytics = (metric) => {
      if (typeof gtag !== 'undefined') {
        gtag('event', metric.name, {
          event_category: 'Web Vitals',
          value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
          event_label: metric.id,
          non_interaction: true
        });
      }
    };

    getCLS(sendToAnalytics);
    getFID(sendToAnalytics);
    getFCP(sendToAnalytics);
    getLCP(sendToAnalytics);
    getTTFB(sendToAnalytics);
  }

  setupGlobalErrorHandling() {
    // Check if we're in browser environment
    if (typeof window === 'undefined') return;
    
    // Handle uncaught errors
    window.addEventListener('error', (event) => {
      this.handleError({
        type: 'javascript_error',
        message: event.message,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        stack: event.error?.stack,
        timestamp: Date.now()
      });
    });

    // Handle unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      this.handleError({
        type: 'unhandled_promise_rejection',
        message: event.reason?.message || 'Promise rejection',
        stack: event.reason?.stack,
        timestamp: Date.now()
      });
    });
  }

  handleError(errorData) {
    // Log to console in development
    if (import.meta.env.DEV || import.meta.env.VITE_ENABLE_ERROR_LOGGING === 'true') {
      console.error('Application Error:', errorData);
    }

    // Send to monitoring service in production
    if (this.isProduction && typeof gtag !== 'undefined') {
      gtag('event', 'error_occurred', {
        event_category: 'error',
        error_type: errorData.type,
        error_message: errorData.message?.substring(0, 100),
        non_interaction: true
      });
    }
  }

  initializeSecurity() {
    // Input sanitization for forms
    this.setupInputSanitization();
    
    // Content Security Policy monitoring
    this.monitorCSPViolations();
  }

  setupInputSanitization() {
    // NOTE: Global input sanitization can interfere with React's controlled components
    // Consider removing this if using React's built-in input handling
    // Uncomment only if you need to sanitize non-React form inputs
    
    /* 
    document.addEventListener('input', (event) => {
      if (event.target.tagName === 'INPUT' || event.target.tagName === 'TEXTAREA') {
        const sanitized = this.sanitizeInput(event.target.value);
        if (sanitized !== event.target.value) {
          event.target.value = sanitized;
        }
      }
    });
    */
  }

  sanitizeInput(input) {
    if (typeof input !== 'string') return input;
    
    return input
      .replace(/[<>]/g, '') // Remove potential HTML tags
      .replace(/javascript:/gi, '') // Remove javascript: URLs
      .replace(/on\w+=/gi, '') // Remove event handlers
      .trim()
      .slice(0, 1000); // Limit length
  }

  monitorCSPViolations() {
    // Check if we're in browser environment
    if (typeof document === 'undefined') return;
    
    document.addEventListener('securitypolicyviolation', (event) => {
      this.handleError({
        type: 'csp_violation',
        message: `CSP violation: ${event.violatedDirective}`,
        blockedURI: event.blockedURI,
        documentURI: event.documentURI,
        timestamp: Date.now()
      });
    });
  }

  optimizePerformance() {
    // Preload critical resources
    this.preloadCriticalResources();
    
    // Optimize images
    this.setupImageOptimization();
    
    // Setup resource hints
    this.setupResourceHints();
  }

  preloadCriticalResources() {
    // Check if we're in browser environment
    if (typeof document === 'undefined' || !document.head) return;
    
    const criticalResources = [
      { href: '/socialcaution.png', as: 'image' },
      // Add other critical resources
    ];

    criticalResources.forEach(resource => {
      try {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.href = resource.href;
        link.as = resource.as;
        document.head.appendChild(link);
      } catch (error) {
        if (import.meta.env.DEV) {
          console.warn('Failed to preload resource:', resource.href, error);
        }
      }
    });
  }

  setupImageOptimization() {
    // Check if we're in browser environment
    if (typeof window === 'undefined' || typeof document === 'undefined') return;
    
    // Lazy loading with intersection observer
    if ('IntersectionObserver' in window) {
      try {
        const imageObserver = new IntersectionObserver((entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              const img = entry.target;
              if (img.dataset.src) {
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                imageObserver.unobserve(img);
              }
            }
          });
        });

        // Observe all lazy images
        document.querySelectorAll('img[data-src]').forEach(img => {
          imageObserver.observe(img);
        });
      } catch (error) {
        if (import.meta.env.DEV) {
          console.warn('Image optimization setup failed:', error);
        }
      }
    }
  }

  setupResourceHints() {
    // Check if we're in browser environment
    if (typeof document === 'undefined' || !document.head) return;
    
    // DNS prefetch for external domains
    const externalDomains = [
      'https://www.google-analytics.com',
      'https://fonts.googleapis.com',
      'https://fonts.gstatic.com'
    ];

    externalDomains.forEach(domain => {
      try {
        const link = document.createElement('link');
        link.rel = 'dns-prefetch';
        link.href = domain;
        document.head.appendChild(link);
      } catch (error) {
        if (import.meta.env.DEV) {
          console.warn('Failed to setup resource hint:', domain, error);
        }
      }
    });
  }

  showUpdateNotification() {
    // Check if we're in browser environment
    if (typeof document === 'undefined' || !document.body) return;
    
    // Show user-friendly update notification
    const notification = document.createElement('div');
    notification.className = 'fixed top-4 right-4 bg-blue-500 text-white p-4 rounded-lg shadow-lg z-50';
    notification.innerHTML = `
      <div class="flex items-center">
        <div class="mr-3">
          <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
          </svg>
        </div>
        <div>
          <p class="font-medium">New version available</p>
          <button onclick="window.location.reload()" class="text-sm underline">Refresh to update</button>
        </div>
      </div>
    `;
    document.body.appendChild(notification);

    // Auto-remove after 10 seconds
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 10000);
  }

  // Health check for production monitoring
  async performHealthCheck() {
    const checks = {
      serviceWorker: 'serviceWorker' in navigator,
      localStorage: this.testLocalStorage(),
      performance: 'performance' in window,
      intersection: 'IntersectionObserver' in window,
      fetch: 'fetch' in window
    };

    const healthyChecks = Object.values(checks).filter(Boolean).length;
    const totalChecks = Object.keys(checks).length;

    return {
      healthy: healthyChecks === totalChecks,
      score: healthyChecks / totalChecks,
      checks,
      timestamp: new Date().toISOString()
    };
  }

  testLocalStorage() {
    try {
      if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
        return false;
      }
      const test = 'test';
      localStorage.setItem(test, test);
      localStorage.removeItem(test);
      return true;
    } catch (error) {
      return false;
    }
  }
}

// Export singleton
export const productionManager = new ProductionManager();
export default productionManager;