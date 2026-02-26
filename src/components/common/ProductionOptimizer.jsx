import { useEffect } from 'react';
import { productionManager } from '../../utils/production.js';
import { businessMetrics } from '../../utils/businessMetrics.js';

const ProductionOptimizer = ({ children }) => {

  useEffect(() => {
    const initializeProduction = async () => {
      try {
        // Initialize production services in background (non-blocking)
        productionManager.initializeProduction().catch((error) => {
          if (import.meta.env.DEV) {
            console.error('Production initialization failed:', error);
          }
        });
        
        // Track session start
        try {
          businessMetrics.trackFunnelStep('landingPageViews');
        } catch (error) {
          // Silently fail metrics tracking
        }
      } catch (error) {
        // Log error silently in production
        if (import.meta.env.DEV) {
          console.error('Production initialization failed:', error);
        }
      }
    };

    // Initialize in background without blocking render
    initializeProduction();

    // Cleanup on unmount
    return () => {
      try {
        // Track session end metrics
        businessMetrics.trackSessionMetrics();
      } catch (error) {
        // Silently fail
      }
    };
  }, []);

  useEffect(() => {
    // Track page views
    const handlePageView = () => {
      try {
        businessMetrics.pageViews++;
      } catch (error) {
        // Silently fail
      }
    };

    // Listen for route changes (for SPA) - only if window is available
    if (typeof window !== 'undefined') {
      window.addEventListener('popstate', handlePageView);
      
      return () => {
        window.removeEventListener('popstate', handlePageView);
      };
    }
  }, []);

  return (
    <>
      {children}
      {/* Health status indicator removed to avoid navigation interference */}
    </>
  );
};

export default ProductionOptimizer;