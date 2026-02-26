// Performance optimization utilities for production
export const PerformanceUtils = {
  // Lazy loading utilities
  lazyLoad: {
    // Lazy load components
    component: (importFunc) => {
      return React.lazy(() => 
        importFunc().then(module => ({
          default: module.default || module
        }))
      );
    },

    // Lazy load images with intersection observer
    images: (imageSelector = 'img[data-lazy]') => {
      if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              const img = entry.target;
              img.src = img.dataset.lazy;
              img.classList.remove('lazy');
              observer.unobserve(img);
            }
          });
        });

        document.querySelectorAll(imageSelector).forEach(img => {
          imageObserver.observe(img);
        });

        return imageObserver;
      }
    },

    // Preload critical resources
    preloadCritical: (resources) => {
      resources.forEach(resource => {
        const link = document.createElement('link');
        link.rel = resource.type === 'script' ? 'preload' : 'prefetch';
        link.as = resource.type;
        link.href = resource.url;
        if (resource.crossorigin) link.crossOrigin = resource.crossorigin;
        document.head.appendChild(link);
      });
    }
  },

  // Performance measurement utilities
  measurement: {
    // Mark performance timings
    mark: (name) => {
      if ('performance' in window && 'mark' in performance) {
        performance.mark(name);
      }
    },

    // Measure between marks
    measure: (name, startMark, endMark) => {
      if ('performance' in window && 'measure' in performance) {
        try {
          performance.measure(name, startMark, endMark);
          const measures = performance.getEntriesByName(name);
          if (measures.length > 0) {
            return measures[measures.length - 1].duration;
          }
        } catch (error) {
          if (import.meta.env.DEV) {
            console.warn('Performance measurement failed:', error);
          }
        }
      }
      return null;
    },

    // Get navigation timing
    getNavigationTiming: () => {
      if ('performance' in window && 'timing' in performance) {
        const timing = performance.timing;
        return {
          dns: timing.domainLookupEnd - timing.domainLookupStart,
          tcp: timing.connectEnd - timing.connectStart,
          request: timing.responseStart - timing.requestStart,
          response: timing.responseEnd - timing.responseStart,
          dom: timing.domContentLoadedEventEnd - timing.navigationStart,
          load: timing.loadEventEnd - timing.navigationStart
        };
      }
      return null;
    },

    // Get resource timing
    getResourceTiming: () => {
      if ('performance' in window && 'getEntriesByType' in performance) {
        return performance.getEntriesByType('resource').map(resource => ({
          name: resource.name,
          duration: resource.duration,
          size: resource.transferSize,
          type: resource.initiatorType
        }));
      }
      return [];
    }
  },

  // Memory management utilities
  memory: {
    // Get memory usage (Chrome only)
    getMemoryUsage: () => {
      if ('memory' in performance) {
        return {
          used: performance.memory.usedJSHeapSize,
          total: performance.memory.totalJSHeapSize,
          limit: performance.memory.jsHeapSizeLimit,
          percentage: (performance.memory.usedJSHeapSize / performance.memory.jsHeapSizeLimit) * 100
        };
      }
      return null;
    },

    // Monitor memory usage
    monitor: (callback, interval = 10000) => {
      if ('memory' in performance) {
        const intervalId = setInterval(() => {
          const usage = PerformanceUtils.memory.getMemoryUsage();
          if (usage) {
            callback(usage);
            
            // Warn if memory usage is high
            if (usage.percentage > 80) {
              if (import.meta.env.DEV) {
                console.warn('High memory usage detected:', usage);
              }
            }
          }
        }, interval);

        return () => clearInterval(intervalId);
      }
      return () => {};
    },

    // Force garbage collection (development only)
    forceGC: () => {
      if (import.meta.env.DEV && 'gc' in window) {
        window.gc();
      }
    }
  },

  // Bundle optimization utilities
  optimization: {
    // Dynamic imports for route-based code splitting
    loadRoute: async (routeName) => {
      try {
        PerformanceUtils.measurement.mark(`route-${routeName}-start`);
        
        const module = await import(`../components/${routeName}`);
        
        PerformanceUtils.measurement.mark(`route-${routeName}-end`);
        PerformanceUtils.measurement.measure(
          `route-${routeName}-load`,
          `route-${routeName}-start`,
          `route-${routeName}-end`
        );
        
        return module;
      } catch (error) {
        if (import.meta.env.DEV) {
          console.error(`Failed to load route ${routeName}:`, error);
        }
        throw error;
      }
    },

    // Prefetch next likely route
    prefetchRoute: (routeName) => {
      const link = document.createElement('link');
      link.rel = 'prefetch';
      link.href = `/js/${routeName}.chunk.js`; // Adjust based on your build output
      document.head.appendChild(link);
    },

    // Service worker utilities
    serviceWorker: {
      register: async () => {
        if ('serviceWorker' in navigator && import.meta.env.PROD) {
          try {
            const registration = await navigator.serviceWorker.register('/sw.js');
            // Service Worker registered
            return registration;
          } catch (error) {
            if (import.meta.env.DEV) {
              console.error('SW registration failed:', error);
            }
          }
        }
      },

      update: async () => {
        if ('serviceWorker' in navigator) {
          const registration = await navigator.serviceWorker.ready;
          return registration.update();
        }
      }
    }
  },

  // Critical rendering path optimization
  critical: {
    // Inline critical CSS
    inlineCriticalCSS: (css) => {
      const style = document.createElement('style');
      style.textContent = css;
      style.setAttribute('data-critical', 'true');
      document.head.insertBefore(style, document.head.firstChild);
    },

    // Remove critical CSS after load
    removeCriticalCSS: () => {
      setTimeout(() => {
        const criticalStyles = document.querySelectorAll('style[data-critical]');
        criticalStyles.forEach(style => style.remove());
      }, 1000);
    },

    // Optimize font loading
    optimizeFonts: () => {
      // Preload critical fonts
      const fontLinks = [
        { href: '/fonts/inter-var.woff2', type: 'font/woff2', crossorigin: 'anonymous' }
      ];

      fontLinks.forEach(font => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'font';
        link.type = font.type;
        link.href = font.href;
        link.crossOrigin = font.crossorigin;
        document.head.appendChild(link);
      });
    }
  },

  // Performance monitoring and reporting
  monitoring: {
    // Report Web Vitals
    reportWebVitals: async () => {
      if (import.meta.env.PROD) {
        try {
          const { getCLS, getFID, getFCP, getLCP, getTTFB } = await import('web-vitals');
          
          const sendToAnalytics = (metric) => {
            if (typeof gtag !== 'undefined') {
              gtag('event', metric.name, {
                event_category: 'Web Vitals',
                value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
                event_label: metric.id,
                non_interaction: true,
              });
            }
          };

          getCLS(sendToAnalytics);
          getFID(sendToAnalytics);
          getFCP(sendToAnalytics);
          getLCP(sendToAnalytics);
          getTTFB(sendToAnalytics);
        } catch (error) {
          if (import.meta.env.DEV) {
            console.warn('Web Vitals reporting failed:', error);
          }
        }
      }
    },

    // Performance budget monitoring
    checkBudgets: () => {
      const budgets = {
        firstContentfulPaint: 1800,
        largestContentfulPaint: 2500,
        firstInputDelay: 100,
        cumulativeLayoutShift: 0.1,
        totalBlockingTime: 200
      };

      const timing = PerformanceUtils.measurement.getNavigationTiming();
      const warnings = [];

      if (timing && timing.dom > budgets.firstContentfulPaint) {
        warnings.push(`DOM load time (${timing.dom}ms) exceeds budget (${budgets.firstContentfulPaint}ms)`);
      }

      return warnings;
    }
  }
};

// React performance hooks
export const usePerformance = () => {
  const [performanceData, setPerformanceData] = useState(null);

  useEffect(() => {
    const updatePerformanceData = () => {
      setPerformanceData({
        navigation: PerformanceUtils.measurement.getNavigationTiming(),
        memory: PerformanceUtils.memory.getMemoryUsage(),
        resources: PerformanceUtils.measurement.getResourceTiming()
      });
    };

    updatePerformanceData();

    // Update every 30 seconds
    const interval = setInterval(updatePerformanceData, 30000);
    return () => clearInterval(interval);
  }, []);

  return performanceData;
};

// Performance HOC for components
export const withPerformanceTracking = (Component, componentName) => {
  return React.forwardRef((props, ref) => {
    useEffect(() => {
      PerformanceUtils.measurement.mark(`${componentName}-mount`);
      return () => {
        PerformanceUtils.measurement.mark(`${componentName}-unmount`);
        PerformanceUtils.measurement.measure(
          `${componentName}-lifetime`,
          `${componentName}-mount`,
          `${componentName}-unmount`
        );
      };
    }, []);

    return <Component {...props} ref={ref} />;
  });
};