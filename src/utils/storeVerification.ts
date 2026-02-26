/**
 * Store Verification Utility
 * Helps verify that the caution store is functional and being updated
 */

import { useCautionStore } from '../state/cautionStore';
import { rssAlertService } from '../services/rssAlertService';

/**
 * Get store status and statistics
 */
export const getStoreStatus = () => {
  const store = useCautionStore.getState();
  const alerts = store.alerts;
  
  return {
    totalAlerts: alerts.length,
    alertsBySource: alerts.reduce((acc, alert) => {
      acc[alert.source] = (acc[alert.source] || 0) + 1;
      return acc;
    }, {} as Record<string, number>),
    alertsByCategory: alerts.reduce((acc, alert) => {
      acc[alert.category] = (acc[alert.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>),
    alertsBySeverity: alerts.reduce((acc, alert) => {
      acc[alert.severity] = (acc[alert.severity] || 0) + 1;
      return acc;
    }, {} as Record<string, number>),
    oldestAlert: alerts.length > 0 
      ? alerts.reduce((oldest, alert) => {
          const alertDate = new Date(alert.createdAt);
          const oldestDate = new Date(oldest.createdAt);
          return alertDate < oldestDate ? alert : oldest;
        })
      : null,
    newestAlert: alerts.length > 0
      ? alerts.reduce((newest, alert) => {
          const alertDate = new Date(alert.createdAt);
          const newestDate = new Date(newest.createdAt);
          return alertDate > newestDate ? alert : newest;
        })
      : null,
    stats: store.getAlertStats(),
    serviceStatus: rssAlertService.getStatus()
  };
};

/**
 * Verify store is functional
 * Returns true if store is working, false otherwise
 */
export const verifyStoreFunctionality = (): { 
  isFunctional: boolean; 
  issues: string[];
  status: ReturnType<typeof getStoreStatus>;
} => {
  const issues: string[] = [];
  let isFunctional = true;

  try {
    // Check if store is accessible
    const store = useCautionStore.getState();
    if (!store) {
      issues.push('Store is not accessible');
      isFunctional = false;
      return { isFunctional, issues, status: getStoreStatus() };
    }

    // Check if store methods exist
    if (typeof store.addAlerts !== 'function') {
      issues.push('addAlerts method missing');
      isFunctional = false;
    }
    if (typeof store.addAlert !== 'function') {
      issues.push('addAlert method missing');
      isFunctional = false;
    }
    if (typeof store.getAlertStats !== 'function') {
      issues.push('getAlertStats method missing');
      isFunctional = false;
    }

    // Check if alerts array exists
    if (!Array.isArray(store.alerts)) {
      issues.push('Alerts is not an array');
      isFunctional = false;
    }

    // Check service status
    const serviceStatus = rssAlertService.getStatus();
    if (!serviceStatus.isActive) {
      issues.push('RSS Alert Service is not active (may need initialization)');
    }

    // Check for alerts with invalid dates
    const invalidDates = store.alerts.filter(alert => {
      try {
        const date = new Date(alert.createdAt);
        return isNaN(date.getTime());
      } catch {
        return true;
      }
    });
    if (invalidDates.length > 0) {
      issues.push(`${invalidDates.length} alerts have invalid dates`);
    }

    // Check for alerts without required fields
    const invalidAlerts = store.alerts.filter(alert => 
      !alert.id || !alert.title || !alert.createdAt
    );
    if (invalidAlerts.length > 0) {
      issues.push(`${invalidAlerts.length} alerts are missing required fields`);
    }

  } catch (error) {
    issues.push(`Error verifying store: ${error instanceof Error ? error.message : String(error)}`);
    isFunctional = false;
  }

  return {
    isFunctional,
    issues,
    status: getStoreStatus()
  };
};

/**
 * Log store status to console (for debugging)
 */
export const logStoreStatus = () => {
  if (import.meta.env.DEV) {
    const verification = verifyStoreFunctionality();
    const status = verification.status;
    
    console.group('🔍 Store Verification');
    console.log('Functional:', verification.isFunctional);
    if (verification.issues.length > 0) {
      console.warn('Issues:', verification.issues);
    }
    console.log('Total Alerts:', status.totalAlerts);
    console.log('By Source:', status.alertsBySource);
    console.log('By Category:', status.alertsByCategory);
    console.log('By Severity:', status.alertsBySeverity);
    if (status.oldestAlert) {
      console.log('Oldest Alert:', {
        id: status.oldestAlert.id,
        title: status.oldestAlert.title.substring(0, 50),
        date: status.oldestAlert.createdAt
      });
    }
    if (status.newestAlert) {
      console.log('Newest Alert:', {
        id: status.newestAlert.id,
        title: status.newestAlert.title.substring(0, 50),
        date: status.newestAlert.createdAt
      });
    }
    console.log('Service Status:', status.serviceStatus);
    console.log('Stats:', status.stats);
    console.groupEnd();
  }
};
