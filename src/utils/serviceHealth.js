/**
 * Service Health Check Utility
 * Monitors availability of external services and provides fallbacks
 */

export const ServiceHealth = {
  services: {
    sendgrid: { available: null, lastCheck: null },
    analytics: { available: null, lastCheck: null },
    sentry: { available: null, lastCheck: null },
    supabase: { available: null, lastCheck: null }
  },

  // Check SendGrid availability
  async checkSendGrid() {
    try {
      const response = await fetch('/.netlify/functions/send-report-email', {
        method: 'OPTIONS',
        signal: AbortSignal.timeout(3000)
      });
      this.services.sendgrid = {
        available: response.ok || response.status === 405, // 405 means endpoint exists
        lastCheck: Date.now()
      };
      return this.services.sendgrid.available;
    } catch (error) {
      this.services.sendgrid = {
        available: false,
        lastCheck: Date.now()
      };
      return false;
    }
  },

  // Check Analytics availability
  checkAnalytics() {
    const available = typeof gtag !== 'undefined' && 
                     typeof window !== 'undefined' && 
                     window.dataLayer;
    this.services.analytics = {
      available,
      lastCheck: Date.now()
    };
    return available;
  },

  // Check Sentry availability
  checkSentry() {
    const available = typeof window !== 'undefined' && 
                     window.Sentry && 
                     typeof window.Sentry.captureException === 'function';
    this.services.sentry = {
      available,
      lastCheck: Date.now()
    };
    return available;
  },

  // Check Supabase availability (if implemented)
  async checkSupabase() {
    // Only check if Supabase is configured
    if (!import.meta.env.VITE_SUPABASE_URL) {
      this.services.supabase = {
        available: false,
        lastCheck: Date.now()
      };
      return false;
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/rest/v1/`, {
        method: 'HEAD',
        signal: AbortSignal.timeout(3000)
      });
      this.services.supabase = {
        available: response.ok,
        lastCheck: Date.now()
      };
      return this.services.supabase.available;
    } catch (error) {
      this.services.supabase = {
        available: false,
        lastCheck: Date.now()
      };
      return false;
    }
  },

  // Check all services
  async checkAll() {
    const checks = await Promise.allSettled([
      this.checkSendGrid(),
      Promise.resolve(this.checkAnalytics()),
      Promise.resolve(this.checkSentry()),
      this.checkSupabase()
    ]);

    return {
      sendgrid: this.services.sendgrid.available,
      analytics: this.services.analytics.available,
      sentry: this.services.sentry.available,
      supabase: this.services.supabase.available,
      allHealthy: checks.every(check => check.status === 'fulfilled')
    };
  },

  // Get service status
  getStatus(serviceName) {
    const service = this.services[serviceName];
    if (!service) return null;
    
    // Consider stale if last check was more than 5 minutes ago
    const isStale = service.lastCheck && (Date.now() - service.lastCheck > 5 * 60 * 1000);
    
    return {
      available: service.available,
      lastCheck: service.lastCheck,
      isStale
    };
  }
};

// Initialize health checks on load
if (typeof window !== 'undefined') {
  // Run initial checks after page load
  window.addEventListener('load', () => {
    setTimeout(() => {
      ServiceHealth.checkAll();
    }, 2000);
  });

  // Re-check services periodically (every 5 minutes)
  setInterval(() => {
    ServiceHealth.checkAll();
  }, 5 * 60 * 1000);
}

export default ServiceHealth;

