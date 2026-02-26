// Alert Reporting System - Manages user reports for alerts
import { cautionAlertManager } from './cautionAlertManager';

const REPORT_STORAGE_KEY = 'socialcaution_alert_reports';

/**
 * Get all reports from localStorage
 */
const getStoredReports = () => {
  try {
    if (typeof window === 'undefined') return {};
    const stored = localStorage.getItem(REPORT_STORAGE_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch (error) {
    console.warn('Error reading stored reports:', error);
    return {};
  }
};

/**
 * Save reports to localStorage
 */
const saveReports = (reports) => {
  try {
    if (typeof window === 'undefined') return;
    localStorage.setItem(REPORT_STORAGE_KEY, JSON.stringify(reports));
  } catch (error) {
    console.warn('Error saving reports:', error);
  }
};

/**
 * Submit a report for an alert
 */
export const submitReport = (alertId, reportData) => {
  try {
    // Submit to alert manager (which saves to alert object)
    const report = cautionAlertManager.reportAlert(alertId, reportData);

    // Also store in separate reports storage for tracking
    const reports = getStoredReports();
    if (!reports[alertId]) {
      reports[alertId] = [];
    }
    reports[alertId].push(report);
    saveReports(reports);

    return {
      success: true,
      report
    };
  } catch (error) {
    console.error('Error submitting report:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

/**
 * Get all reports for a specific alert
 */
export const getReportsForAlert = (alertId) => {
  try {
    const alert = cautionAlertManager.getAlertById(alertId);
    if (alert && alert.reports) {
      return alert.reports;
    }

    // Fallback to stored reports
    const reports = getStoredReports();
    return reports[alertId] || [];
  } catch (error) {
    console.warn('Error getting reports:', error);
    return [];
  }
};

/**
 * Get report count for an alert
 */
export const getReportCount = (alertId) => {
  const reports = getReportsForAlert(alertId);
  return reports.length;
};

/**
 * Get report counts by type for an alert
 */
export const getReportCountsByType = (alertId) => {
  const reports = getReportsForAlert(alertId);
  const counts = {
    'incorrect': 0,
    'outdated': 0,
    'spam': 0,
    'not-relevant': 0,
    'other': 0
  };

  reports.forEach(report => {
    if (counts[report.type] !== undefined) {
      counts[report.type]++;
    } else {
      counts['other']++;
    }
  });

  return counts;
};

/**
 * Check if user has already reported this alert
 * (In a real implementation, this would check user ID)
 */
export const hasUserReported = (alertId) => {
  // For now, we'll use a simple check based on browser session
  // In production, this would check against user ID
  try {
    if (typeof window === 'undefined') return false;
    const reportedAlerts = JSON.parse(
      sessionStorage.getItem('socialcaution_user_reported_alerts') || '[]'
    );
    return reportedAlerts.includes(alertId);
  } catch (error) {
    return false;
  }
};

/**
 * Mark alert as reported by user
 */
export const markAsReported = (alertId) => {
  try {
    if (typeof window === 'undefined') return;
    const reportedAlerts = JSON.parse(
      sessionStorage.getItem('socialcaution_user_reported_alerts') || '[]'
    );
    if (!reportedAlerts.includes(alertId)) {
      reportedAlerts.push(alertId);
      sessionStorage.setItem('socialcaution_user_reported_alerts', JSON.stringify(reportedAlerts));
    }
  } catch (error) {
    console.warn('Error marking as reported:', error);
  }
};

/**
 * Report types
 */
export const reportTypes = [
  { id: 'incorrect', label: 'Incorrect Information', description: 'The alert contains false or misleading information' },
  { id: 'outdated', label: 'Outdated', description: 'This alert is no longer relevant or current' },
  { id: 'spam', label: 'Spam', description: 'This appears to be spam or promotional content' },
  { id: 'not-relevant', label: 'Not Relevant', description: 'This alert is not relevant to me' },
  { id: 'other', label: 'Other', description: 'Other reason (please specify)' }
];

