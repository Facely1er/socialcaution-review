// Zustand store for managing CautionAlerts
// Handles AI threat alerts, privacy risks, and security notifications

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CautionAlert, AlertCategory, AlertSeverity } from '../types/caution';

interface CautionState {
  alerts: CautionAlert[];
  
  // Core actions
  addAlerts: (alerts: CautionAlert[]) => void;
  addAlert: (alert: CautionAlert) => void;
  removeAlert: (id: string) => void;
  clearAlerts: () => void;
  
  // Filter actions
  getAlertsByCategory: (category: AlertCategory) => CautionAlert[];
  getAlertsBySeverity: (severity: AlertSeverity) => CautionAlert[];
  getAIThreats: () => CautionAlert[];
  getCriticalAlerts: () => CautionAlert[];
  
  // Statistics
  getAlertStats: () => {
    total: number;
    byCategory: Record<AlertCategory, number>;
    bySeverity: Record<AlertSeverity, number>;
    aiThreats: number;
    avgRiskScore: number;
  };
}

export const useCautionStore = create<CautionState>()(
  persist(
    (set, get) => ({
      alerts: [],
      
      // Add multiple alerts at once (batch operation) - deduplicates by ID
      addAlerts: (newAlerts) =>
        set((state) => {
          // Create a Set of existing alert IDs for fast lookup
          const existingIds = new Set(state.alerts.map(a => a.id));
          
          // Filter out duplicates from new alerts
          const uniqueNewAlerts = newAlerts.filter(alert => {
            // Skip if ID already exists
            if (existingIds.has(alert.id)) {
              return false;
            }
            // Add to Set to prevent duplicates within newAlerts array
            existingIds.add(alert.id);
            return true;
          });
          
          // Return new state with unique alerts prepended
          return {
            alerts: [...uniqueNewAlerts, ...state.alerts],
          };
        }),
      
      // Add a single alert
      addAlert: (alert) =>
        set((state) => ({
          alerts: [alert, ...state.alerts],
        })),
      
      // Remove an alert by ID
      removeAlert: (id) =>
        set((state) => ({
          alerts: state.alerts.filter((alert) => alert.id !== id),
        })),
      
      // Clear all alerts
      clearAlerts: () => set({ alerts: [] }),
      
      // Get alerts by category
      getAlertsByCategory: (category) => {
        return get().alerts.filter((alert) => alert.category === category);
      },
      
      // Get alerts by severity
      getAlertsBySeverity: (severity) => {
        return get().alerts.filter((alert) => alert.severity === severity);
      },
      
      // Get all AI threat alerts
      getAIThreats: () => {
        return get().alerts.filter(
          (alert) => alert.category === 'ai_threat' || alert.source === 'ai_detector'
        );
      },
      
      // Get critical severity alerts
      getCriticalAlerts: () => {
        return get().alerts.filter((alert) => alert.severity === 'critical');
      },
      
      // Get comprehensive statistics
      getAlertStats: () => {
        const alerts = get().alerts;
        
        const byCategory: Record<AlertCategory, number> = {
          privacy_risk: 0,
          account_security: 0,
          ai_threat: 0,
          data_broker: 0,
          breach_notice: 0,
          phishing_risk: 0,
          manipulation_tactics: 0,
        };
        
        const bySeverity: Record<AlertSeverity, number> = {
          info: 0,
          warning: 0,
          high: 0,
          critical: 0,
        };
        
        let totalRiskScore = 0;
        let riskScoreCount = 0;
        
        alerts.forEach((alert) => {
          byCategory[alert.category] = (byCategory[alert.category] || 0) + 1;
          bySeverity[alert.severity] = (bySeverity[alert.severity] || 0) + 1;
          
          if (alert.riskScore !== undefined) {
            totalRiskScore += alert.riskScore;
            riskScoreCount++;
          }
        });
        
        return {
          total: alerts.length,
          byCategory,
          bySeverity,
          aiThreats: byCategory.ai_threat + byCategory.phishing_risk + byCategory.manipulation_tactics,
          avgRiskScore: riskScoreCount > 0 ? Math.round(totalRiskScore / riskScoreCount) : 0,
        };
      },
    }),
    {
      name: 'socialcaution-alerts',
      // Persist alerts for 7 days, but keep at least 20 most recent alerts
      partialize: (state) => {
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        
        // Filter to last 7 days
        const recentAlerts = state.alerts.filter((alert) => {
          const alertDate = new Date(alert.createdAt);
          return alertDate >= sevenDaysAgo;
        });
        
        // If we have less than 20 alerts after filtering, keep the 20 most recent
        if (recentAlerts.length < 20 && state.alerts.length > 0) {
          return {
            alerts: state.alerts
              .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
              .slice(0, 20)
          };
        }
        
        return { alerts: recentAlerts };
      },
    }
  )
);

