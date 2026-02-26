// Business metrics and KPI tracking for production
export class BusinessMetrics {
  constructor() {
    this.metrics = {
      // Conversion funnel metrics
      funnel: {
        landingPageViews: 0,
        assessmentStarts: 0,
        assessmentCompletions: 0,
        dashboardViews: 0,
        toolUsage: 0,
        resourceAccess: 0
      },
      
      // User engagement metrics
      engagement: {
        averageSessionDuration: 0,
        bounceRate: 0,
        pagesPerSession: 0,
        returningUsers: 0
      },
      
      // Privacy persona distribution
      personas: {
        'cautious-parent': 0,
        'digital-novice': 0,
        'privacy-advocate': 0,
        'online-shopper': 0,
        'social-influencer': 0,
        'private-individual': 0
      },
      
      // Feature adoption
      features: {
        darkModeUsage: 0,
        assessmentRetakes: 0,
        resourceDownloads: 0,
        toolImplementations: 0
      }
    };
    
    this.sessionStart = Date.now();
    this.pageViews = 0;
  }

  // Conversion funnel tracking
  trackFunnelStep(step, metadata = {}) {
    this.metrics.funnel[step]++;
    
    if (typeof gtag !== 'undefined') {
      gtag('event', 'funnel_step', {
        event_category: 'conversion',
        funnel_step: step,
        step_number: this.getFunnelStepNumber(step),
        ...metadata
      });
    }
  }

  getFunnelStepNumber(step) {
    const steps = {
      landingPageViews: 1,
      assessmentStarts: 2,
      assessmentCompletions: 3,
      dashboardViews: 4,
      toolUsage: 5,
      resourceAccess: 6
    };
    return steps[step] || 0;
  }

  // Privacy-specific metrics
  trackPrivacyMetric(metricName, value, context = {}) {
    if (typeof gtag !== 'undefined') {
      gtag('event', 'privacy_metric', {
        event_category: 'privacy',
        metric_name: metricName,
        metric_value: value,
        ...context
      });
    }
  }

  trackPersonaDetection(primaryPersona, confidence, assessmentType) {
    this.metrics.personas[primaryPersona]++;
    
    this.trackPrivacyMetric('persona_detected', primaryPersona, {
      confidence_score: Math.round(confidence * 100),
      assessment_type: assessmentType,
      detection_timestamp: Date.now()
    });
  }

  trackAssessmentCompletion(assessmentType, scores, duration) {
    this.trackFunnelStep('assessmentCompletions', {
      assessment_type: assessmentType,
      privacy_score: scores.exposureScore,
      rights_score: scores.rightsScore,
      completion_time: duration
    });
  }

  trackFeatureUsage(featureName, context = {}) {
    this.metrics.features[featureName]++;
    
    if (typeof gtag !== 'undefined') {
      gtag('event', 'feature_usage', {
        event_category: 'engagement',
        feature_name: featureName,
        usage_context: context.context || 'unknown',
        ...context
      });
    }
  }

  // Session tracking
  trackSessionMetrics() {
    const sessionDuration = Date.now() - this.sessionStart;
    const engagement = {
      session_duration: sessionDuration,
      pages_viewed: this.pageViews,
      engagement_score: this.calculateEngagementScore(sessionDuration, this.pageViews)
    };

    if (typeof gtag !== 'undefined') {
      gtag('event', 'session_metrics', {
        event_category: 'engagement',
        ...engagement
      });
    }

    return engagement;
  }

  calculateEngagementScore(duration, pageViews) {
    // Simple engagement scoring
    const durationScore = Math.min(duration / (5 * 60 * 1000), 1); // Max 5 minutes
    const pageScore = Math.min(pageViews / 5, 1); // Max 5 pages
    return Math.round((durationScore + pageScore) * 50);
  }

  // Privacy compliance metrics
  trackComplianceEvent(eventType, details = {}) {
    if (typeof gtag !== 'undefined') {
      gtag('event', 'compliance_event', {
        event_category: 'compliance',
        compliance_type: eventType,
        ...details
      });
    }
  }

  // Performance metrics
  trackPerformanceMetric(metricName, value, threshold = null) {
    const exceedsThreshold = threshold && value > threshold;
    
    if (typeof gtag !== 'undefined') {
      gtag('event', 'performance_metric', {
        event_category: 'performance',
        metric_name: metricName,
        metric_value: Math.round(value),
        exceeds_threshold: exceedsThreshold,
        threshold_value: threshold
      });
    }
  }

  // Business goal tracking
  trackBusinessGoal(goalName, value = 1, context = {}) {
    if (typeof gtag !== 'undefined') {
      gtag('event', 'business_goal', {
        event_category: 'business',
        goal_name: goalName,
        goal_value: value,
        ...context
      });
    }
  }

  // Export metrics for analysis
  exportMetrics() {
    return {
      ...this.metrics,
      sessionData: {
        duration: Date.now() - this.sessionStart,
        pageViews: this.pageViews,
        timestamp: new Date().toISOString()
      }
    };
  }

  // Health check for metrics collection
  isHealthy() {
    return {
      metricsCollecting: typeof gtag !== 'undefined',
      sessionActive: Date.now() - this.sessionStart < 30 * 60 * 1000, // 30 minutes
      validSession: this.pageViews > 0
    };
  }
}

// Export singleton instance
export const businessMetrics = new BusinessMetrics();
export default businessMetrics;