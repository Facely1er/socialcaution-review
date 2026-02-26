// Production Analytics Configuration
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';
import { allowsAnalytics } from './cookieConsent.js';

export class ProductionAnalytics {
  constructor() {
    this.initialized = false;
    this.queue = [];
    this.offlineQueue = [];
    this.gaAvailable = null; // null = not checked, true/false = checked
    // Defer initialization to avoid blocking
    if (typeof window !== 'undefined') {
      // Use requestIdleCallback if available, otherwise setTimeout
      if (window.requestIdleCallback) {
        window.requestIdleCallback(() => this.init(), { timeout: 2000 });
      } else {
        setTimeout(() => this.init(), 0);
      }
    }
  }

  init() {
    if (this.initialized) return;

    // Initialize Google Analytics only in production and only if user consented
    if (import.meta.env.PROD && import.meta.env.VITE_REACT_APP_GA_ID && allowsAnalytics()) {
      this.initializeGA();
    } else if (import.meta.env.PROD && import.meta.env.VITE_REACT_APP_GA_ID && !allowsAnalytics()) {
      this.gaAvailable = false;
    }

    // Initialize error monitoring
    this.initializeErrorMonitoring();
    
    // Initialize performance monitoring
    this.initializePerformanceMonitoring();
    
    // Initialize business metrics tracking
    this.initializeBusinessMetrics();

    this.initialized = true;
    this.processQueue();
  }

  /**
   * Call after user accepts analytics cookies. Loads GA and processes any queued events.
   */
  enableGA() {
    if (typeof window === 'undefined' || typeof document === 'undefined') return;
    if (!import.meta.env.VITE_REACT_APP_GA_ID) return;
    this.initializeGA();
    this.processQueue();
  }

  initializeGA() {
    // Check if we're in browser environment
    if (typeof window === 'undefined' || typeof document === 'undefined') return;
    
    // Check if Google Analytics is blocked or unavailable
    if (!import.meta.env.VITE_REACT_APP_GA_ID) {
      if (import.meta.env.DEV) {
        console.warn('Google Analytics ID not configured - analytics disabled');
      }
      this.gaAvailable = false;
      return;
    }

    try {
      // Load Google Analytics script with timeout
      const script = document.createElement('script');
      script.async = true;
      script.src = `https://www.googletagmanager.com/gtag/js?id=${import.meta.env.VITE_REACT_APP_GA_ID}`;
      
      // Set timeout for script loading
      const timeout = setTimeout(() => {
        if (import.meta.env.DEV) {
          console.warn('Google Analytics script load timeout - using fallback');
        }
        this.gaAvailable = false;
      }, 5000);

      script.onload = () => {
        clearTimeout(timeout);
        this.gaAvailable = true;
      };

      script.onerror = () => {
        clearTimeout(timeout);
        if (import.meta.env.DEV) {
          console.warn('Google Analytics script failed to load - using fallback');
        }
        this.gaAvailable = false;
      };

      document.head.appendChild(script);

      // Initialize gtag
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      window.gtag = gtag;
      
      gtag('js', new Date());
      gtag('config', import.meta.env.VITE_REACT_APP_GA_ID, {
        anonymize_ip: true,
        allow_google_signals: false,
        allow_ad_personalization_signals: false,
        send_page_view: false
      });
    } catch (error) {
      if (import.meta.env.DEV) {
        console.warn('Failed to initialize Google Analytics:', error);
      }
      this.gaAvailable = false;
    }
  }

  initializeErrorMonitoring() {
    // Check if we're in browser environment
    if (typeof window === 'undefined') return;
    
    // Global error handler
    window.addEventListener('error', (event) => {
      this.logError({
        type: 'javascript_error',
        message: event.message,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        stack: event.error?.stack
      });
    });

    // Promise rejection handler
    window.addEventListener('unhandledrejection', (event) => {
      this.logError({
        type: 'unhandled_promise_rejection',
        message: event.reason?.message || 'Promise rejection',
        stack: event.reason?.stack
      });
    });
  }

  initializePerformanceMonitoring() {
    // Check if we're in browser environment
    if (typeof window === 'undefined' || typeof performance === 'undefined') return;
    
    // Web Vitals monitoring
    getCLS(this.sendWebVital.bind(this));
    getFID(this.sendWebVital.bind(this));
    getFCP(this.sendWebVital.bind(this));
    getLCP(this.sendWebVital.bind(this));
    getTTFB(this.sendWebVital.bind(this));

    // Navigation timing
    if (performance.timing) {
      window.addEventListener('load', () => {
        setTimeout(() => {
          const perfData = performance.timing;
          const navigationStart = perfData.navigationStart;
          
          this.trackEvent('performance_timing', {
            dns_time: perfData.domainLookupEnd - perfData.domainLookupStart,
            connect_time: perfData.connectEnd - perfData.connectStart,
            response_time: perfData.responseEnd - perfData.responseStart,
            dom_load_time: perfData.domContentLoadedEventEnd - navigationStart,
            window_load_time: perfData.loadEventEnd - navigationStart
          });
        }, 0);
      });
    }
  }

  initializeBusinessMetrics() {
    // Track assessment funnel
    this.setupAssessmentTracking();
    
    // Track persona distribution
    this.setupPersonaTracking();
    
    // Track feature usage
    this.setupFeatureTracking();
  }

  // Core tracking methods
  trackPageView(path, title) {
    // Always queue for offline processing
    if (typeof navigator !== 'undefined' && !navigator.onLine) {
      this.queueOfflineEvent('page_view', { path, title });
      return;
    }

    // Check if GA is available
    if (this.gaAvailable === false || (typeof gtag === 'undefined' && this.gaAvailable !== true)) {
      this.queueOfflineEvent('page_view', { path, title });
      return;
    }

    if (typeof gtag !== 'undefined') {
      try {
        gtag('config', import.meta.env.VITE_REACT_APP_GA_ID, {
          page_path: path,
          page_title: title,
          anonymize_ip: true
        });
      } catch (error) {
        // Silently fail and queue for later
        this.queueOfflineEvent('page_view', { path, title });
        if (import.meta.env.DEV) {
          console.warn('Analytics page view error:', error);
        }
      }
    } else {
      // Queue if gtag not ready yet
      this.queueOfflineEvent('page_view', { path, title });
    }
  }

  trackEvent(eventName, parameters = {}) {
    // Always queue for offline processing
    if (typeof navigator !== 'undefined' && !navigator.onLine) {
      this.queueOfflineEvent(eventName, parameters);
      return;
    }

    // Check if GA is available
    if (this.gaAvailable === false || (typeof gtag === 'undefined' && this.gaAvailable !== true)) {
      this.queueOfflineEvent(eventName, parameters);
      return;
    }

    const sanitizedParams = this.sanitizeParameters(parameters);
    
    if (typeof gtag !== 'undefined') {
      try {
        gtag('event', eventName, sanitizedParams);
      } catch (error) {
        // Silently fail and queue for later
        this.queueOfflineEvent(eventName, parameters);
        if (import.meta.env.DEV) {
          console.warn('Analytics event error:', error);
        }
      }
    } else {
      // Queue if gtag not ready yet
      this.queueOfflineEvent(eventName, parameters);
    }
  }

  // Business-specific tracking
  trackAssessmentStart(assessmentType) {
    this.trackEvent('assessment_start', {
      event_category: 'engagement',
      assessment_type: assessmentType,
      timestamp: Date.now()
    });
  }

  trackAssessmentComplete(assessmentType, persona, scores) {
    this.trackEvent('assessment_complete', {
      event_category: 'conversion',
      assessment_type: assessmentType,
      detected_persona: persona,
      privacy_score_range: this.getScoreRange(scores.exposureScore),
      rights_score_range: this.getScoreRange(scores.rightsScore)
    });
  }

  trackPersonaDashboard(persona) {
    this.trackEvent('dashboard_view', {
      event_category: 'engagement',
      user_persona: persona
    });
  }

  trackResourceAccess(resourceType, persona) {
    this.trackEvent('resource_access', {
      event_category: 'content',
      resource_type: resourceType,
      user_persona: persona
    });
  }

  trackToolUsage(toolName, persona) {
    this.trackEvent('tool_usage', {
      event_category: 'feature',
      tool_name: toolName,
      user_persona: persona
    });
  }

  trackFeatureUsage(featureName, parameters = {}) {
    this.trackEvent('feature_usage', {
      event_category: 'feature',
      feature_name: featureName,
      ...parameters
    });
  }

  trackFunnelStep(stepName, parameters = {}) {
    this.trackEvent('funnel_step', {
      event_category: 'funnel',
      step_name: stepName,
      ...parameters
    });
  }

  trackUpgradeIntent(source, metadata = {}) {
    this.trackEvent('upgrade_intent', {
      event_category: 'conversion',
      source,
      from_version: 'basic',
      to_version: 'standard',
      ...metadata
    });
  }

  trackVersionSwitch(fromVersion, toVersion, reason) {
    this.trackEvent('version_switch', {
      event_category: 'navigation',
      from_version: fromVersion,
      to_version: toVersion,
      reason
    });
  }

  // Web Vitals tracking
  sendWebVital(metric) {
    this.trackEvent(metric.name, {
      event_category: 'Web Vitals',
      value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
      event_label: metric.id,
      non_interaction: true
    });
  }

  // Error logging
  logError(errorData) {
    this.trackEvent('error_occurred', {
      event_category: 'error',
      error_type: errorData.type,
      error_message: errorData.message?.substring(0, 100), // Limit message length
      filename: errorData.filename,
      non_interaction: true
    });
  }

  // Utility methods
  sanitizeParameters(params) {
    const sanitized = { ...params };
    
    // Remove any PII
    delete sanitized.email;
    delete sanitized.user_id;
    delete sanitized.ip_address;
    delete sanitized.personal_info;
    
    // Ensure values are appropriate types
    Object.keys(sanitized).forEach(key => {
      if (typeof sanitized[key] === 'string' && sanitized[key].length > 100) {
        sanitized[key] = sanitized[key].substring(0, 100);
      }
    });
    
    return sanitized;
  }

  getScoreRange(score) {
    if (score >= 80) return 'high';
    if (score >= 60) return 'medium';
    if (score >= 40) return 'low';
    return 'very_low';
  }

  queueOfflineEvent(eventName, parameters) {
    this.offlineQueue.push({
      eventName,
      parameters,
      timestamp: Date.now()
    });
    
    // Store in localStorage for persistence (with error handling)
    try {
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem('analytics_offline_queue', JSON.stringify(this.offlineQueue));
      }
    } catch (error) {
      if (import.meta.env.DEV) {
        console.warn('Failed to store analytics queue:', error);
      }
    }
  }

  processQueue() {
    // Process any queued events
    this.queue.forEach(({ method, args }) => {
      this[method](...args);
    });
    this.queue = [];

    // Process offline events when connection is restored
    if (typeof navigator !== 'undefined' && navigator.onLine) {
      this.processOfflineQueue();
    }
  }

  async processOfflineQueue() {
    try {
      if (typeof localStorage === 'undefined') {
        return;
      }
      
      const stored = localStorage.getItem('analytics_offline_queue');
      if (stored) {
        try {
          const events = JSON.parse(stored);
          for (const event of events) {
            this.trackEvent(event.eventName, event.parameters);
          }
          localStorage.removeItem('analytics_offline_queue');
          this.offlineQueue = [];
        } catch (error) {
          if (import.meta.env.DEV) {
            console.warn('Failed to process offline analytics queue:', error);
          }
          this.logError({
            type: 'analytics_queue_error',
            message: error?.message || 'Failed to process offline analytics queue'
          });
        }
      }
    } catch (error) {
      // Silently fail if localStorage is not available
      if (import.meta.env.DEV) {
        console.warn('localStorage not available for analytics queue:', error);
      }
    }
  }

  // Setup specific tracking
  setupAssessmentTracking() {
    this.assessmentFunnel = {
      'landing_page_view': 0,
      'assessment_start_click': 0,
      'first_question_answer': 0,
      'assessment_complete': 0,
      'dashboard_access': 0
    };
    
    // Initialize funnel tracking
    this.assessmentFunnel['landing_page_view']++;
  }

  setupPersonaTracking() {
    this.personaDistribution = {
      'cautious-parent': 0,
      'digital-novice': 0,
      'privacy-advocate': 0,
      'online-shopper': 0,
      'social-influencer': 0,
      'private-individual': 0
    };
    
    // Initialize persona tracking
  }

  setupFeatureTracking() {
    this.featureUsage = {
      'theme_toggle': 0,
      'resource_access': 0,
      'tool_usage': 0,
      'privacy_tips_viewed': 0,
      'assessment_retake': 0
    };
    
    // Initialize feature tracking
  }
}

// Export singleton instance
export const analytics = new ProductionAnalytics();
export default analytics;