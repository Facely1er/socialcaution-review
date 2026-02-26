// Caution Alert Manager - Manages alerts with persona/service filtering
import { getStoredAlerts, saveAlerts, initializeAlerts } from '../data/cautionAlerts';
import { rssFeedProcessor } from './rssFeedProcessor';

class CautionAlertManager {
  constructor() {
    this.alerts = [];
    this.loadAlerts();
  }

  /**
   * Load alerts from localStorage
   */
  loadAlerts() {
    this.alerts = getStoredAlerts();
    if (this.alerts.length === 0) {
      this.alerts = initializeAlerts();
    }
  }

  /**
   * Save alerts to localStorage
   */
  saveAlerts() {
    saveAlerts(this.alerts);
  }

  /**
   * Get alerts filtered by persona
   */
  getAlertsForPersona(persona, filters = {}) {
    if (!persona) {
      // If no persona, return all active alerts
      return this.getAlerts(filters);
    }

    const personaId = typeof persona === 'string' ? persona : persona.id || persona.primary;

    let filtered = this.alerts.filter(alert => {
      // Check if alert is active
      if (!alert.isActive) return false;

      // Check if alert applies to this persona
      if (alert.personas && alert.personas.length > 0) {
        if (!alert.personas.includes(personaId)) return false;
      }

      return true;
    });

    // Apply additional filters
    filtered = this.applyFilters(filtered, filters);

    return filtered.sort((a, b) => {
      // Sort by severity first (critical > high > medium > low)
      const severityOrder = { critical: 4, high: 3, medium: 2, low: 1 };
      const severityDiff = severityOrder[b.severity] - severityOrder[a.severity];
      if (severityDiff !== 0) return severityDiff;

      // Then by date (newest first)
      return new Date(b.publishedDate) - new Date(a.publishedDate);
    });
  }

  /**
   * Get alerts related to user's selected services
   */
  getAlertsForServices(serviceIds, persona = null) {
    if (!serviceIds || serviceIds.length === 0) {
      return [];
    }

    let filtered = this.alerts.filter(alert => {
      if (!alert.isActive) return false;

      // Check if alert relates to any of the selected services
      if (!alert.relatedServices || alert.relatedServices.length === 0) {
        return false;
      }

      const hasMatchingService = alert.relatedServices.some(serviceId => 
        serviceIds.includes(serviceId)
      );

      if (!hasMatchingService) return false;

      // If persona is provided, also filter by persona
      if (persona) {
        const personaId = typeof persona === 'string' ? persona : persona.id || persona.primary;
        if (alert.personas && alert.personas.length > 0) {
          if (!alert.personas.includes(personaId)) return false;
        }
      }

      return true;
    });

    return filtered.sort((a, b) => {
      const severityOrder = { critical: 4, high: 3, medium: 2, low: 1 };
      const severityDiff = severityOrder[b.severity] - severityOrder[a.severity];
      if (severityDiff !== 0) return severityDiff;
      return new Date(b.publishedDate) - new Date(a.publishedDate);
    });
  }

  /**
   * Get alerts by category
   */
  getAlertsByCategory(category, persona = null) {
    const filters = { category };
    if (persona) {
      return this.getAlertsForPersona(persona, filters);
    }
    return this.getAlerts(filters);
  }

  /**
   * Get alerts by severity
   */
  getAlertsBySeverity(severity, persona = null) {
    const filters = { severity };
    if (persona) {
      return this.getAlertsForPersona(persona, filters);
    }
    return this.getAlerts(filters);
  }

  /**
   * Get all alerts with optional filters
   */
  getAlerts(filters = {}) {
    let filtered = this.alerts.filter(alert => alert.isActive);

    filtered = this.applyFilters(filtered, filters);

    return filtered.sort((a, b) => {
      const severityOrder = { critical: 4, high: 3, medium: 2, low: 1 };
      const severityDiff = severityOrder[b.severity] - severityOrder[a.severity];
      if (severityDiff !== 0) return severityDiff;
      return new Date(b.publishedDate) - new Date(a.publishedDate);
    });
  }

  /**
   * Apply filters to alerts
   */
  applyFilters(alerts, filters) {
    let filtered = [...alerts];

    // Category filter
    if (filters.category) {
      filtered = filtered.filter(alert => alert.category === filters.category);
    }

    // Severity filter
    if (filters.severity) {
      filtered = filtered.filter(alert => alert.severity === filters.severity);
    }

    // Service filter
    if (filters.serviceId) {
      filtered = filtered.filter(alert => 
        alert.relatedServices && alert.relatedServices.includes(filters.serviceId)
      );
    }

    // Date range filter
    if (filters.startDate) {
      const startDate = new Date(filters.startDate);
      filtered = filtered.filter(alert => new Date(alert.publishedDate) >= startDate);
    }

    if (filters.endDate) {
      const endDate = new Date(filters.endDate);
      filtered = filtered.filter(alert => new Date(alert.publishedDate) <= endDate);
    }

    // Search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(alert =>
        alert.title.toLowerCase().includes(searchLower) ||
        alert.description.toLowerCase().includes(searchLower) ||
        (alert.tags && alert.tags.some(tag => tag.toLowerCase().includes(searchLower)))
      );
    }

    // Verification filter
    if (filters.verifiedOnly) {
      filtered = filtered.filter(alert => 
        alert.validation && alert.validation.verified === true
      );
    }

    // Limit results
    if (filters.limit) {
      filtered = filtered.slice(0, filters.limit);
    }

    return filtered;
  }

  /**
   * Get alert statistics for a persona
   */
  getAlertStats(persona = null) {
    const alerts = persona ? this.getAlertsForPersona(persona) : this.getAlerts();

    const stats = {
      total: alerts.length,
      bySeverity: {
        critical: 0,
        high: 0,
        medium: 0,
        low: 0
      },
      byCategory: {},
      recentCount: 0,
      verifiedCount: 0
    };

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    alerts.forEach(alert => {
      // Count by severity
      if (stats.bySeverity[alert.severity] !== undefined) {
        stats.bySeverity[alert.severity]++;
      }

      // Count by category
      stats.byCategory[alert.category] = (stats.byCategory[alert.category] || 0) + 1;

      // Count recent alerts
      if (new Date(alert.publishedDate) >= sevenDaysAgo) {
        stats.recentCount++;
      }

      // Count verified alerts
      if (alert.validation && alert.validation.verified) {
        stats.verifiedCount++;
      }
    });

    return stats;
  }

  /**
   * Get a single alert by ID
   */
  getAlertById(alertId) {
    const alert = this.alerts.find(a => a.id === alertId);
    if (alert) {
      // Increment view count
      alert.viewCount = (alert.viewCount || 0) + 1;
      this.saveAlerts();
    }
    return alert;
  }

  /**
   * Report an alert
   */
  reportAlert(alertId, reportData) {
    const alert = this.getAlertById(alertId);
    if (!alert) {
      throw new Error('Alert not found');
    }

    const report = {
      id: `report-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type: reportData.type || 'other',
      reason: reportData.reason || '',
      details: reportData.details || '',
      timestamp: new Date().toISOString()
    };

    if (!alert.reports) {
      alert.reports = [];
    }

    alert.reports.push(report);
    alert.updatedAt = new Date().toISOString();
    this.saveAlerts();

    return report;
  }

  /**
   * Validate an alert (upvote/downvote)
   */
  validateAlert(alertId, validationType) {
    const alert = this.getAlertById(alertId);
    if (!alert) {
      throw new Error('Alert not found');
    }

    if (!alert.validation) {
      alert.validation = { upvotes: 0, downvotes: 0, verified: false };
    }

    // In a real implementation, we'd track which users have voted
    // For now, we'll just increment the count
    if (validationType === 'upvote') {
      alert.validation.upvotes = (alert.validation.upvotes || 0) + 1;
    } else if (validationType === 'downvote') {
      alert.validation.downvotes = (alert.validation.downvotes || 0) + 1;
    }

    alert.updatedAt = new Date().toISOString();
    this.saveAlerts();

    return alert.validation;
  }

  /**
   * Verify an alert (admin/community verification)
   */
  verifyAlert(alertId, verified = true) {
    const alert = this.getAlertById(alertId);
    if (!alert) {
      throw new Error('Alert not found');
    }

    if (!alert.validation) {
      alert.validation = { upvotes: 0, downvotes: 0, verified: false };
    }

    alert.validation.verified = verified;
    alert.updatedAt = new Date().toISOString();
    this.saveAlerts();

    return alert.validation;
  }

  /**
   * Add new alerts (from RSS feed processing)
   */
  addAlerts(newAlerts) {
    const existingAlerts = this.alerts;
    const merged = rssFeedProcessor.mergeAlerts(existingAlerts, newAlerts);
    this.alerts = merged;
    this.saveAlerts();
    return merged.length - existingAlerts.length; // Return count of new alerts
  }

  /**
   * Refresh alerts from RSS feeds
   */
  async refreshAlerts() {
    try {
      const result = await rssFeedProcessor.processAllFeeds();
      if (result.allAlerts && result.allAlerts.length > 0) {
        const newCount = this.addAlerts(result.allAlerts);
        return {
          success: true,
          newAlerts: newCount,
          totalAlerts: this.alerts.length,
          feedsProcessed: result.successfulFeeds,
          totalFeeds: result.totalFeeds
        };
      }
      return {
        success: true,
        newAlerts: 0,
        totalAlerts: this.alerts.length,
        feedsProcessed: result.successfulFeeds,
        totalFeeds: result.totalFeeds
      };
    } catch (error) {
      console.error('Error refreshing alerts:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Clean up old alerts
   */
  cleanupOldAlerts(daysToKeep = 90) {
    const beforeCount = this.alerts.length;
    this.alerts = rssFeedProcessor.cleanupOldAlerts(this.alerts, daysToKeep);
    this.saveAlerts();
    return beforeCount - this.alerts.length;
  }
}

export const cautionAlertManager = new CautionAlertManager();

