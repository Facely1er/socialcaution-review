import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Radar, AlertTriangle, ArrowRight, RefreshCw, Clock } from 'lucide-react';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { serviceCatalog } from '../../data/serviceCatalog';
import { useCautionStore } from '../../state/cautionStore';
import { rssAlertService } from '../../services/rssAlertService';
import { cautionAlertsToRSSAlerts, filterRSSAlertsByCategories } from '../../utils/rssAlertMapper';

/**
 * Compact Privacy Radar Widget for Dashboard
 * Shows summary of recent threats and links to full Privacy Radar
 * TACTICAL FOCUS: Shows only immediate threats from tactical RSS feeds
 */
const PrivacyRadarWidget = () => {
  const navigate = useNavigate();
  
  // TACTICAL FEED CATEGORIES - Immediate threats only (must match Privacy Radar categories)
  const TACTICAL_CATEGORIES = [
    'general-security',
    'data-breach',
    'phishing',
    'scams',
    'device-security'
  ];
  
  const [threats, setThreats] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdate, setLastUpdate] = useLocalStorage('privacy_radar_last_update', null);
  const [selectedServices] = useLocalStorage('socialcaution_services', []);
  
  // Get alerts from store
  const storeAlerts = useCautionStore((state) => state.alerts);
  
  // Calculate severity
  const calculateSeverity = (item) => {
    const text = `${item.title || ''} ${item.description || ''}`.toLowerCase();
    const criticalKeywords = ['breach', 'breached', 'hacked', 'exposed', 'leaked', 'zero-day', 'ransomware'];
    const highKeywords = ['vulnerability', 'vulnerable', 'patch', 'warning', 'phishing', 'scam', 'malware', 'attack'];
    const mediumKeywords = ['security', 'risk', 'threat', 'suspicious', 'detected'];
    
    if (criticalKeywords.some(k => text.includes(k))) return 'critical';
    if (highKeywords.some(k => text.includes(k))) return 'high';
    if (mediumKeywords.some(k => text.includes(k))) return 'medium';
    return 'low';
  };
  
  // Check if relevant to user's services
  const isRelevantToUser = (item) => {
    if (selectedServices.length === 0) return true;
    const text = `${item.title || ''} ${item.description || ''}`.toLowerCase();
    return selectedServices.some(serviceId => {
      const service = serviceCatalog.find(s => s.id === serviceId);
      if (!service) return false;
      const keywords = [service.name.toLowerCase(), ...(service.keywords || [])];
      return keywords.some(keyword => text.includes(keyword));
    });
  };
  
  // Process alerts from store
  const processStoreAlerts = useCallback(() => {
    if (import.meta.env.DEV) {
      console.log('[Privacy Radar Widget] Processing alerts from store...', { alertCount: storeAlerts?.length || 0 });
    }
    
    if (!Array.isArray(storeAlerts)) {
      if (import.meta.env.DEV) {
        console.warn('[Privacy Radar Widget] storeAlerts is not an array:', typeof storeAlerts);
      }
      setThreats([]);
      return;
    }
    
    // Convert CautionAlerts to RSS alerts
    const rssAlerts = cautionAlertsToRSSAlerts(storeAlerts);
    
    // Filter for TACTICAL categories only
    const tacticalAlerts = filterRSSAlertsByCategories(rssAlerts, TACTICAL_CATEGORIES);
    
    // Filter to last 48 hours
    const tacticalThreshold = Date.now() - (48 * 60 * 60 * 1000);
    const recentThreats = tacticalAlerts
      .filter(alert => {
        if (!alert.publishedDate) return false;
        const alertDate = new Date(alert.publishedDate);
        return !isNaN(alertDate.getTime()) && alertDate.getTime() > tacticalThreshold;
      })
      .map(alert => ({
        id: alert.id,
        title: alert.title || 'Untitled Alert',
        description: alert.description || '',
        link: alert.link || '',
        pubDate: alert.publishedDate,
        severity: calculateSeverity(alert),
        isRelevant: isRelevantToUser(alert),
        category: alert.category
      }))
      .sort((a, b) => {
        // Sort by severity, then relevance, then date
        const severityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
        if (severityOrder[a.severity] !== severityOrder[b.severity]) {
          return severityOrder[a.severity] - severityOrder[b.severity];
        }
        if (a.isRelevant !== b.isRelevant) return b.isRelevant - a.isRelevant;
        return new Date(b.pubDate) - new Date(a.pubDate);
      })
      .slice(0, 5); // Top 5 threats
    
    setThreats(recentThreats);
    setLastUpdate(new Date().toISOString());
    
    if (import.meta.env.DEV) {
      console.log(`[Privacy Radar Widget] Processed ${tacticalAlerts.length} tactical alerts, showing ${recentThreats.length} recent threats`);
    }
  }, [storeAlerts, setLastUpdate]);
  
  // Process alerts when store updates
  useEffect(() => {
    processStoreAlerts();
  }, [processStoreAlerts]);
  
  // Initial load
  useEffect(() => {
    if (storeAlerts.length === 0) {
      setIsLoading(true);
      if (import.meta.env.DEV) {
        console.log('[Privacy Radar Widget] No alerts in store, triggering initial fetch...');
      }
      rssAlertService.processNow().catch(error => {
        if (import.meta.env.DEV) {
          console.error('[Privacy Radar Widget] Error on initial fetch:', error);
        }
      }).finally(() => {
        setIsLoading(false);
      });
    }
  }, []); // Only run on mount
  
  // Calculate summary stats
  const stats = useMemo(() => {
    return {
      total: threats.length,
      critical: threats.filter(t => t.severity === 'critical').length,
      high: threats.filter(t => t.severity === 'high').length,
      relevant: threats.filter(t => t.isRelevant).length
    };
  }, [threats]);
  
  const getSeverityColor = (severity) => {
    const colors = {
      critical: 'bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-300 border-red-500',
      high: 'bg-orange-100 dark:bg-orange-900/20 text-orange-700 dark:text-orange-300 border-orange-500',
      medium: 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-300 border-yellow-500',
      low: 'bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border-blue-500'
    };
    return colors[severity] || colors.low;
  };
  
  if (isLoading) {
    return (
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 p-6">
        <div className="flex items-center justify-center py-8">
          <RefreshCw className="w-6 h-6 animate-spin text-gray-400" />
        </div>
      </div>
    );
  }
  
  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-red-500 to-red-600 rounded-lg">
            <Radar className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Privacy Radar</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">Real-time threat monitoring</p>
          </div>
        </div>
        <button
          onClick={() => navigate('/privacy-radar')}
          className="text-sm text-red-600 dark:text-red-400 hover:underline flex items-center gap-1"
        >
          View All
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
      
      {/* Summary Stats */}
      {stats.total > 0 ? (
        <>
          <div className="grid grid-cols-3 gap-3 mb-4">
            <div className="text-center p-3 bg-red-50 dark:bg-red-900/10 rounded-lg border border-red-200 dark:border-red-800">
              <div className="text-2xl font-bold text-red-600 dark:text-red-400">{stats.critical}</div>
              <div className="text-xs text-red-700 dark:text-red-300">Critical</div>
            </div>
            <div className="text-center p-3 bg-orange-50 dark:bg-orange-900/10 rounded-lg border border-orange-200 dark:border-orange-800">
              <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">{stats.high}</div>
              <div className="text-xs text-orange-700 dark:text-orange-300">High</div>
            </div>
            <div className="text-center p-3 bg-purple-50 dark:bg-purple-900/10 rounded-lg border border-purple-200 dark:border-purple-800">
              <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">{stats.relevant}</div>
              <div className="text-xs text-purple-700 dark:text-purple-300">Relevant</div>
            </div>
          </div>
          
          {/* Top Threats List */}
          <div className="space-y-2 mb-4">
            {threats.slice(0, 3).map((threat) => (
              <div
                key={threat.id}
                className={`p-3 rounded-lg border-l-4 ${getSeverityColor(threat.severity)}`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-sm text-gray-900 dark:text-white line-clamp-1 mb-1">
                      {threat.title}
                    </h4>
                    <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                      <span className="capitalize">{threat.severity}</span>
                      {threat.isRelevant && (
                        <>
                          <span>•</span>
                          <span className="text-purple-600 dark:text-purple-400">Relevant</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {lastUpdate && (
            <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1 mb-3">
              <Clock className="w-3 h-3" />
              Updated {new Date(lastUpdate).toLocaleTimeString()}
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-8">
          <Radar className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
          <p className="text-sm text-gray-500 dark:text-gray-400">No recent threats detected</p>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Last 48 hours</p>
        </div>
      )}
      
      {/* Action Button */}
      <button
        onClick={() => navigate('/privacy-radar')}
        className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium flex items-center justify-center gap-2 text-sm"
      >
        <Radar className="w-4 h-4" />
        View Full Privacy Radar
      </button>
    </div>
  );
};

export default PrivacyRadarWidget;
