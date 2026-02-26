/**
 * Adapter to convert Radar alerts to homepage carousel format
 * Maps existing Radar data structure to HomeAlert format
 */

import { HomeAlert, HomeAlertSeverity } from './types';
import { cautionAlertsToRSSAlerts } from '../../utils/rssAlertMapper';

/**
 * Map RSS alert severity to HomeAlert severity
 */
const mapSeverity = (severity: string): HomeAlertSeverity => {
  if (severity === 'critical' || severity === 'high') return 'high';
  if (severity === 'medium' || severity === 'warning') return 'med';
  return 'low';
};

/**
 * Get scope tag from alert category and source
 */
const getScopeTag = (category: string, _sourceName?: string): string | undefined => {
  // Map categories to scope tags
  const categoryMap: Record<string, string> = {
    'data-breach': 'Public Services',
    'phishing': 'Education',
    'scams': 'Families',
    'device-security': 'Employees',
    'general-security': 'Public Services',
    'privacy-laws': 'Public Services'
  };

  return categoryMap[category] || undefined;
};

/**
 * Get status tag based on alert recency and severity
 */
const getStatusTag = (pubDate: string, severity: string): string | undefined => {
  const date = new Date(pubDate);
  const now = new Date();
  const hoursAgo = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

  if (hoursAgo < 24 && (severity === 'critical' || severity === 'high')) {
    return 'Observed';
  }
  if (hoursAgo < 48) {
    return 'Recent';
  }
  if (severity === 'critical' || severity === 'high') {
    return 'Under review';
  }
  return undefined;
};

/**
 * Convert CautionAlert directly to HomeAlert (fallback when RSS conversion fails)
 */
const cautionAlertToHomeAlert = (alert: Record<string, unknown>): HomeAlert | null => {
  if (!alert || !alert.id) return null;

  // Map CautionAlert category to RSS category for scope tag
  const categoryMap: Record<string, string> = {
    'breach_notice': 'data-breach',
    'phishing_risk': 'phishing',
    'manipulation_tactics': 'scams',
    'account_security': 'device-security',
    'privacy_risk': 'general-security',
    'ai_threat': 'phishing',
    'data_broker': 'privacy-laws'
  };

  const rssCategory = categoryMap[alert.category] || 'general-security';
  const dateStr = alert.createdAt || new Date().toISOString();

  return {
    id: alert.id,
    title: alert.title || 'AI / Privacy Risk Signal',
    description: alert.message 
      ? alert.message.replace(/<[^>]*>/g, '').substring(0, 150) + (alert.message.length > 150 ? '...' : '')
      : 'Risk pattern observed across common online services.',
    scopeTag: getScopeTag(rssCategory, alert.serviceName),
    statusTag: getStatusTag(dateStr, alert.severity || 'warning'),
    severity: mapSeverity(alert.severity || 'warning'),
    href: alert.link || undefined,
    date: dateStr
  };
};

/**
 * Helper function to process alerts with a given time threshold
 */
const processAlertsWithThreshold = (
  radarSignals: unknown[],
  threshold: number
): { alerts: HomeAlert[]; lastUpdate: string | null } => {
  let lastUpdate: string | null = null;
  const allAlerts: HomeAlert[] = [];

  // Try converting CautionAlerts to RSS format first
  const rssAlerts = cautionAlertsToRSSAlerts(radarSignals);

  // Also convert alerts that weren't converted (non-service_monitor sources)
  const nonRssAlerts = radarSignals
    .filter(alert => alert && alert.source !== 'service_monitor')
    .map(cautionAlertToHomeAlert)
    .filter((alert): alert is HomeAlert => alert !== null);

  // Add RSS alerts (convert to HomeAlert format)
  rssAlerts.forEach(alert => {
    if (!alert) return;
    
    const dateStr = alert.pubDate || alert.publishedDate || new Date().toISOString();
    const alertDate = new Date(dateStr);
    
    // Filter: Only include alerts within threshold
    // If date is invalid, use current date (for alerts without dates, assume they're recent)
    const validDate = isNaN(alertDate.getTime()) ? new Date() : alertDate;
    if (validDate.getTime() < threshold) {
      return;
    }

    // Track latest update time (use valid date)
    if (!lastUpdate || validDate.getTime() > new Date(lastUpdate).getTime()) {
      lastUpdate = dateStr || new Date().toISOString();
    }
    
    const title = alert.title || 'AI / Privacy Risk Signal';
    const description = alert.description 
      ? alert.description.replace(/<[^>]*>/g, '').substring(0, 150) + (alert.description.length > 150 ? '...' : '')
      : 'Risk pattern observed across common online services.';

    allAlerts.push({
      id: alert.id,
      title,
      description,
      scopeTag: getScopeTag(alert.category, alert.source?.name),
      statusTag: getStatusTag(dateStr, alert.severity || 'low'),
      severity: mapSeverity(alert.severity || 'low'),
      href: alert.link || undefined,
      date: dateStr
    });
  });

  // Add non-RSS alerts (with threshold filter)
  nonRssAlerts.forEach(alert => {
    if (!alert.date) return;
    const alertDate = new Date(alert.date);
    if (isNaN(alertDate.getTime()) || alertDate.getTime() < threshold) {
      return;
    }
    if (!lastUpdate || alertDate.getTime() > new Date(lastUpdate).getTime()) {
      lastUpdate = alert.date;
    }
    allAlerts.push(alert);
  });

  // If still no alerts, try converting all alerts directly (fallback)
  if (allAlerts.length === 0) {
    const directAlerts = radarSignals
      .map(cautionAlertToHomeAlert)
      .filter((alert): alert is HomeAlert => alert !== null)
      .filter(alert => {
        if (!alert.date) return false;
        const alertDate = new Date(alert.date);
        return !isNaN(alertDate.getTime()) && alertDate.getTime() >= threshold;
      });
    
    directAlerts.forEach(alert => {
      if (alert.date && (!lastUpdate || new Date(alert.date).getTime() > new Date(lastUpdate).getTime())) {
        lastUpdate = alert.date;
      }
    });
    
    allAlerts.push(...directAlerts);
  }

  return { alerts: allAlerts, lastUpdate };
};

/**
 * Convert Radar alerts to homepage carousel items
 * Enforces max 5 items, 48-hour filter with 7-day fallback, and sorting logic
 * Works with both RSS-converted alerts and direct CautionAlerts
 */
export const toHomepageAlerts = (radarSignals: unknown[]): { alerts: HomeAlert[]; lastUpdate: string | null; fromCache?: boolean } => {
  // Time thresholds
  const tacticalThreshold = Date.now() - (48 * 60 * 60 * 1000); // 48 hours
  const sevenDayThreshold = Date.now() - (7 * 24 * 60 * 60 * 1000); // 7 days

  if (!Array.isArray(radarSignals) || radarSignals.length === 0) {
    if (import.meta.env.DEV) {
      console.log('[AlertsCarousel] No radar signals provided');
    }
    return { alerts: [], lastUpdate: null };
  }

  if (import.meta.env.DEV) {
    console.log('[AlertsCarousel] Processing alerts:', radarSignals.length, 'signals');
  }

  // First try: Get alerts from last 48 hours
  const recentResult = processAlertsWithThreshold(radarSignals, tacticalThreshold);

  if (import.meta.env.DEV) {
    console.log('[AlertsCarousel] Alerts in 48h window:', recentResult.alerts.length);
  }

  // If no recent alerts, fall back to 7-day window
  if (recentResult.alerts.length === 0) {
    if (import.meta.env.DEV) {
      console.log('[AlertsCarousel] No alerts in 48h window, falling back to 7-day window');
    }
    const fallbackResult = processAlertsWithThreshold(radarSignals, sevenDayThreshold);
    
    if (import.meta.env.DEV) {
      console.log('[AlertsCarousel] Alerts in 7-day window:', fallbackResult.alerts.length);
    }

    // Sort by priority/severity, then by date (newest first)
    const sorted = fallbackResult.alerts.sort((a, b) => {
      const severityOrder = { high: 3, med: 2, low: 1 };
      const aSeverity = severityOrder[a.severity || 'low' as keyof typeof severityOrder] || 0;
      const bSeverity = severityOrder[b.severity || 'low' as keyof typeof severityOrder] || 0;
      
      if (aSeverity !== bSeverity) {
        return bSeverity - aSeverity;
      }

      if (a.date && b.date) {
        const aDate = new Date(a.date).getTime();
        const bDate = new Date(b.date).getTime();
        return bDate - aDate;
      }
      if (a.date) return -1;
      if (b.date) return 1;
      return 0;
    });

    const result = sorted.slice(0, 5);
    
    if (import.meta.env.DEV) {
      console.log('[AlertsCarousel] Final result (7-day fallback):', result.length, 'items');
    }

    return { alerts: result, lastUpdate: fallbackResult.lastUpdate };
  }

  // Sort recent alerts by priority/severity, then by date (newest first)
  const sorted = recentResult.alerts.sort((a, b) => {
    const severityOrder = { high: 3, med: 2, low: 1 };
    const aSeverity = severityOrder[a.severity || 'low' as keyof typeof severityOrder] || 0;
    const bSeverity = severityOrder[b.severity || 'low' as keyof typeof severityOrder] || 0;
    
    if (aSeverity !== bSeverity) {
      return bSeverity - aSeverity;
    }

    if (a.date && b.date) {
      const aDate = new Date(a.date).getTime();
      const bDate = new Date(b.date).getTime();
      return bDate - aDate;
    }
    if (a.date) return -1;
    if (b.date) return 1;
    return 0;
  });

  // Take max 5 items
  const result = sorted.slice(0, 5);
  
  if (import.meta.env.DEV) {
    console.log('[AlertsCarousel] Final result (48h):', result.length, 'items');
  }

  return { alerts: result, lastUpdate: recentResult.lastUpdate };
};
