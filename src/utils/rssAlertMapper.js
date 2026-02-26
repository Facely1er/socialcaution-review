// Utility to convert CautionAlert back to RSS alert format
// Used by PrivacyRadar and Trends Tracker to consume alerts from the store

import { rssFeeds } from '../data/rssFeeds';

/**
 * Map CautionAlert category back to RSS category
 * Note: This is a best-effort mapping. The original RSS category is preserved
 * in the alert ID, which allows us to retrieve it from rssFeeds.
 * 
 * Priority:
 * 1. Extract from feed ID in alert ID (most accurate)
 * 2. Map from CautionAlert category (fallback)
 */
const mapCategoryToRSS = (cautionCategory, alertId) => {
  // Try to extract original category from alert ID
  // Alert IDs are in format: alert-{feedId}-{guid}-{random}
  if (alertId && alertId.startsWith('alert-')) {
    const feedId = alertId.split('-')[1];
    const feed = rssFeeds.find(f => f.id === feedId);
    if (feed && feed.category) {
      // Use original feed category (preserves tactical vs strategic separation)
      return feed.category;
    }
  }
  
  // Fallback: Map from CautionAlert category
  const categoryMap = {
    'breach_notice': 'data-breach',
    'ai_threat': 'phishing', // Could be phishing or scams
    'account_security': 'general-security',
    'privacy_risk': 'privacy-laws', // Could be privacy-laws, regulation, compliance, news
    'phishing_risk': 'phishing',
    'manipulation_tactics': 'scams',
    'data_broker': 'privacy-laws'
  };
  
  return categoryMap[cautionCategory] || 'general-security';
};

/**
 * Map AlertSeverity back to RSS severity
 */
const mapSeverityToRSS = (severity) => {
  const severityMap = {
    'critical': 'critical',
    'high': 'high',
    'warning': 'medium',
    'info': 'low'
  };
  
  return severityMap[severity] || 'low';
};

/**
 * Extract RSS feed ID from alert ID
 * Alert IDs are in format: alert-{feedId}-{guid}-{random}
 */
const extractFeedId = (alertId) => {
  if (!alertId || !alertId.startsWith('alert-')) {
    return 'unknown';
  }
  
  const parts = alertId.split('-');
  if (parts.length >= 2) {
    return parts[1]; // feedId is the second part
  }
  
  return 'unknown';
};

/**
 * Get feed name from feed ID
 */
const getFeedName = (feedId) => {
  const feed = rssFeeds.find(f => f.id === feedId);
  return feed ? feed.name : 'Unknown Feed';
};

/**
 * Convert CautionAlert to RSS alert format
 * Now handles all sources, not just 'service_monitor'
 */
export const cautionAlertToRSSAlert = (cautionAlert) => {
  if (!cautionAlert) {
    return null;
  }
  
  const feedId = extractFeedId(cautionAlert.id);
  const feedName = getFeedName(feedId);
  const feed = rssFeeds.find(f => f.id === feedId);
  
  // Use feed's original category if available, otherwise map from CautionAlert category
  let category;
  if (feed) {
    category = feed.category;
  } else {
    // Map category for all sources
    category = mapCategoryToRSS(cautionAlert.category, cautionAlert.id);
  }
  
  const severity = mapSeverityToRSS(cautionAlert.severity);
  
  // Determine source name - Always prioritize original RSS feed name
  // Only use generic source names when feed information is truly unavailable
  let sourceName;
  
  // First priority: Use original RSS feed name if we have a valid feed
  if (feed && feed.name && feed.name !== 'Unknown Feed') {
    sourceName = feed.name;
  } 
  // Second priority: Use feedName if it's valid (even if feed object not found)
  else if (feedName && feedName !== 'Unknown Feed') {
    sourceName = feedName;
  }
  // Third priority: For service_monitor, try to get feed name or show service-specific info
  else if (cautionAlert.source === 'service_monitor') {
    if (feedId && feedId !== 'unknown') {
      // Try one more time to find the feed
      const foundFeed = rssFeeds.find(f => f.id === feedId);
      if (foundFeed && foundFeed.name) {
        sourceName = foundFeed.name;
      } else if (cautionAlert.serviceId) {
        sourceName = `Service Monitor: ${cautionAlert.serviceId}`;
      } else {
        sourceName = 'Service Monitor';
      }
    } else if (cautionAlert.serviceId) {
      sourceName = `Service Monitor: ${cautionAlert.serviceId}`;
    } else {
      sourceName = 'Service Monitor';
    }
  }
  // Fallback: Use source-specific names for other sources
  else {
    if (cautionAlert.source === 'ai_detector') {
      sourceName = 'AI Detector';
    } else if (cautionAlert.source === 'user_paste') {
      sourceName = 'User Report';
    } else if (cautionAlert.source === 'system') {
      sourceName = 'System';
    } else {
      sourceName = 'Unknown Source';
    }
  }
  
  return {
    id: cautionAlert.id,
    title: cautionAlert.title,
    description: cautionAlert.message,
    content: cautionAlert.message,
    link: cautionAlert.link || '', // Preserve link from CautionAlert
    pubDate: cautionAlert.createdAt,
    publishedDate: cautionAlert.createdAt,
    guid: cautionAlert.id,
    category: category,
    severity: severity,
    priority: severity, // Map severity to priority for compatibility
    rssFeedId: feedId || 'unknown',
    source: {
      name: sourceName,
      url: feed?.url || ''
    },
    relatedServices: cautionAlert.serviceId ? [cautionAlert.serviceId] : [],
    personas: cautionAlert.personaTag ? [cautionAlert.personaTag] : [],
    tags: cautionAlert.evidence || [],
    aiDetection: cautionAlert.riskScore ? {
      riskScore: cautionAlert.riskScore,
      isPotentialThreat: cautionAlert.riskScore >= 60,
      reasons: cautionAlert.evidence || [],
      analyzedAt: cautionAlert.createdAt
    } : null
  };
};

/**
 * Convert array of CautionAlerts to RSS alerts
 */
export const cautionAlertsToRSSAlerts = (cautionAlerts) => {
  return cautionAlerts
    .map(cautionAlertToRSSAlert)
    .filter(alert => alert !== null);
};

/**
 * Filter RSS alerts by category list
 */
export const filterRSSAlertsByCategories = (rssAlerts, categories) => {
  if (!categories || categories.length === 0) {
    return rssAlerts;
  }
  
  return rssAlerts.filter(alert => 
    alert && categories.includes(alert.category)
  );
};

