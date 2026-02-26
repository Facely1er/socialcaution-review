// Production monitoring and error tracking utilities
import * as Sentry from '@sentry/react';
import { BrowserTracing } from '@sentry/tracing';

export const MonitoringService = {
  sentryAvailable: false,
  fallbackErrorLog: [],

  // Initialize monitoring services
  init: () => {
    if (import.meta.env.PROD) {
      // Initialize Sentry for error tracking with fallback
      if (import.meta.env.VITE_REACT_APP_SENTRY_DSN) {
        try {
          Sentry.init({
            dsn: import.meta.env.VITE_REACT_APP_SENTRY_DSN,
            environment: import.meta.env.VITE_REACT_APP_ENVIRONMENT || 'production',
            tracesSampleRate: parseFloat(import.meta.env.VITE_REACT_APP_PERFORMANCE_SAMPLE_RATE) || 0.1,
            beforeSend(event) {
              // Filter out non-critical errors
              if (event.exception) {
                const error = event.exception.values[0];
                if (error && error.type === 'ChunkLoadError') {
                  return null; // Ignore chunk load errors
                }
              }
              return event;
            },
            integrations: [
              new BrowserTracing({
                // Performance monitoring for key user actions
                tracingOrigins: [typeof window !== 'undefined' ? window.location.hostname : 'localhost'],
              }),
            ],
          });
          MonitoringService.sentryAvailable = true;
        } catch (error) {
          console.warn('Failed to initialize Sentry:', error);
          MonitoringService.sentryAvailable = false;
          // Store errors locally as fallback
          MonitoringService.fallbackErrorLog = [];
        }
      } else {
        MonitoringService.sentryAvailable = false;
      }

      // Initialize performance monitoring
      MonitoringService.initPerformanceMonitoring();
    }
  },

  // Performance monitoring
  initPerformanceMonitoring: () => {
    // Web Vitals monitoring
    import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
      try {
        getCLS(MonitoringService.sendToAnalytics);
        getFID(MonitoringService.sendToAnalytics);
        getFCP(MonitoringService.sendToAnalytics);
        getLCP(MonitoringService.sendToAnalytics);
        getTTFB(MonitoringService.sendToAnalytics);
      } catch (error) {
        // Silently fail - web vitals monitoring is not critical
        if (import.meta.env.DEV) {
          console.warn('Web Vitals monitoring failed:', error);
        }
      }
    }).catch((error) => {
      // Silently fail if web-vitals module fails to load
      if (import.meta.env.DEV) {
        console.warn('Failed to load web-vitals:', error);
      }
    });

    // Memory usage monitoring (Chrome/Chromium only)
    // Check for memory API availability and proper structure
    if (performance.memory && typeof performance.memory.usedJSHeapSize === 'number') {
      let memoryMonitorInterval = null;
      try {
        memoryMonitorInterval = setInterval(() => {
          try {
            const memory = performance.memory;
            if (memory && typeof memory.usedJSHeapSize === 'number') {
              MonitoringService.sendToAnalytics({
                name: 'memory_usage',
                value: memory.usedJSHeapSize,
                delta: memory.usedJSHeapSize - memory.totalJSHeapSize,
                id: 'memory'
              });
            }
          } catch (error) {
            // Clear interval if memory API becomes unavailable
            if (memoryMonitorInterval) {
              clearInterval(memoryMonitorInterval);
              memoryMonitorInterval = null;
            }
            if (import.meta.env.DEV) {
              console.warn('Memory monitoring error:', error);
            }
          }
        }, 30000); // Every 30 seconds
      } catch (error) {
        if (import.meta.env.DEV) {
          console.warn('Failed to initialize memory monitoring:', error);
        }
      }
    }
  },

  // Send metrics to analytics
  sendToAnalytics: (metric) => {
    if (typeof gtag !== 'undefined') {
      try {
        gtag('event', metric.name, {
          event_category: 'Web Vitals',
          event_label: metric.id,
          value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
          non_interaction: true,
        });
      } catch (error) {
        // Silently fail - analytics errors should not break the app
        if (import.meta.env.DEV) {
          console.warn('Analytics error:', error);
        }
      }
    }
  },

  // Log business metrics
  logBusinessMetric: (metricName, value, dimensions = {}) => {
    // Try Google Analytics first
    if (typeof gtag !== 'undefined') {
      try {
        gtag('event', 'business_metric', {
          event_category: 'Business',
          metric_name: metricName,
          metric_value: value,
          ...dimensions
        });
      } catch (error) {
        // Silently fail - analytics errors should not break the app
        if (import.meta.env.DEV) {
          console.warn('Analytics error:', error);
        }
      }
    }

    // Try Sentry with fallback
    if (import.meta.env.PROD) {
      try {
        if (MonitoringService.sentryAvailable && typeof Sentry !== 'undefined') {
          Sentry.addBreadcrumb({
            category: 'business_metric',
            message: metricName,
            data: { value, ...dimensions }
          });
        } else {
          // FALLBACK: Store in localStorage
          MonitoringService.storeMetricLocally(metricName, value, dimensions);
        }
      } catch (error) {
        // FALLBACK: Store in localStorage
        MonitoringService.storeMetricLocally(metricName, value, dimensions);
        if (import.meta.env.DEV) {
          console.warn('Sentry error:', error);
        }
      }
    }
  },

  // New fallback method for local storage
  storeMetricLocally: (metricName, value, dimensions) => {
    try {
      const key = 'monitoring_fallback_metrics';
      const existing = localStorage.getItem(key);
      const metrics = existing ? JSON.parse(existing) : [];
      
      metrics.push({
        metricName,
        value,
        dimensions,
        timestamp: Date.now()
      });
      
      // Keep only last 100 metrics to avoid storage bloat
      if (metrics.length > 100) {
        metrics.shift();
      }
      
      localStorage.setItem(key, JSON.stringify(metrics));
    } catch (error) {
      // Silently fail - this is just a fallback
      if (import.meta.env.DEV) {
        console.warn('Failed to store metric locally:', error);
      }
    }
  },

  // User journey tracking
  trackUserJourney: (step, metadata = {}) => {
    MonitoringService.logBusinessMetric('user_journey_step', step, {
      journey_step: step,
      timestamp: Date.now(),
      ...metadata
    });
  },

  // Conversion tracking
  trackConversion: (conversionType, value = 1) => {
    MonitoringService.logBusinessMetric('conversion', value, {
      conversion_type: conversionType,
      timestamp: Date.now()
    });
  },

  // Error boundary wrapper
  withErrorBoundary: (Component, errorFallback) => {
    // If Sentry is not available, return component as-is (React will handle errors)
    if (!MonitoringService.sentryAvailable || typeof Sentry === 'undefined') {
      return Component;
    }
    
    return Sentry.withErrorBoundary(Component, {
      fallback: errorFallback || (({ error }) => (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-slate-900">
          <div className="text-center p-8">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Something went wrong
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              We've been notified and are working on a fix.
            </p>
            <button
              onClick={() => {
                if (typeof window !== 'undefined') {
                  window.location.reload();
                }
              }}
              className="px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
            >
              Reload Page
            </button>
          </div>
        </div>
      )),
      beforeCapture: (scope) => {
        scope.setTag('component', 'error_boundary');
      },
    });
  }
};

// Health check utilities
export const HealthCheck = {
  // Perform application health checks
  runHealthChecks: async () => {
    const checks = {
      localStorage: HealthCheck.checkLocalStorage(),
      performance: HealthCheck.checkPerformance(),
      connectivity: await HealthCheck.checkConnectivity(),
      features: HealthCheck.checkFeatures()
    };

    const healthScore = Object.values(checks).filter(check => check.healthy).length / Object.keys(checks).length;

    return {
      healthy: healthScore >= 0.75,
      score: healthScore,
      checks,
      timestamp: new Date().toISOString()
    };
  },

  checkLocalStorage: () => {
    try {
      const test = 'health_check_test';
      localStorage.setItem(test, 'test');
      localStorage.removeItem(test);
      return { healthy: true, message: 'localStorage is functional' };
    } catch (error) {
      return { healthy: false, message: 'localStorage is not available', error: error.message };
    }
  },

  checkPerformance: () => {
    // Check if performance.memory API is available (Chrome/Chromium only)
    if (performance.memory && typeof performance.memory.usedJSHeapSize === 'number') {
      try {
        const memory = performance.memory;
        const healthyMemoryThreshold = 50 * 1024 * 1024; // 50MB
        const isHealthy = memory.usedJSHeapSize < healthyMemoryThreshold;
        return {
          healthy: isHealthy,
          message: isHealthy ? 'Memory usage is normal' : 'High memory usage detected',
          memoryUsed: memory.usedJSHeapSize,
          memoryLimit: memory.jsHeapSizeLimit
        };
      } catch (error) {
        return { healthy: true, message: 'Memory API error', error: error.message };
      }
    }

    return { healthy: true, message: 'Performance memory API not available (Chrome/Chromium only)' };
  },

  checkConnectivity: async () => {
    try {
      const response = await fetch('/health-check', { method: 'HEAD', cache: 'no-cache' });
      return { 
        healthy: response.ok, 
        message: response.ok ? 'Connectivity is good' : 'Connectivity issues detected',
        status: response.status 
      };
    } catch (error) {
      return { healthy: false, message: 'Network connectivity failed', error: error.message };
    }
  },

  checkFeatures: () => {
    const requiredFeatures = {
      localStorage: typeof Storage !== 'undefined',
      sessionStorage: typeof sessionStorage !== 'undefined',
      fetch: typeof fetch !== 'undefined',
      intersectionObserver: typeof IntersectionObserver !== 'undefined'
    };

    const healthyFeatures = Object.values(requiredFeatures).filter(Boolean).length;
    const totalFeatures = Object.keys(requiredFeatures).length;

    return {
      healthy: healthyFeatures === totalFeatures,
      message: `${healthyFeatures}/${totalFeatures} required features available`,
      features: requiredFeatures
    };
  }
};