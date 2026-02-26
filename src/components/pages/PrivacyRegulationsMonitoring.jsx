import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Shield, AlertTriangle, Bell, Search, RefreshCw, 
  TrendingUp, Clock, ExternalLink, 
  FileText, Info, ArrowRight
} from 'lucide-react';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { useTheme } from '../../contexts/ThemeContext';
import { useTranslation } from '../../contexts/TranslationContext';
import { rssFeedProcessor } from '../../utils/rssFeedProcessor'; // Use centralized RSS aggregator
import { useCautionStore } from '../../state/cautionStore';
import { rssAlertService } from '../../services/rssAlertService';
import { cautionAlertsToRSSAlerts, filterRSSAlertsByCategories } from '../../utils/rssAlertMapper';
import ServicePrivacyData from '../../utils/servicePrivacyData';
import SEOHead from '../common/SEOHead';
import { calculateEnhancedRelevancy } from '../../utils/feedRelevancyScorer';

// STRATEGIC FEED CATEGORIES - Long-term trends only
const STRATEGIC_CATEGORIES = [
  'regulation',        // New laws and regulations
  'enforcement',       // Fines and penalties  
  'privacy-laws',      // Policy changes
  'compliance',        // Standards updates
  'news'              // Industry trends (filtered)
];

// Regulation keywords for detection
const REGULATION_KEYWORDS = {
  'GDPR': ['gdpr', 'general data protection regulation', 'eu privacy', 'european union privacy'],
  'CCPA': ['ccpa', 'california consumer privacy act', 'california privacy'],
  'HIPAA': ['hipaa', 'health insurance portability', 'healthcare privacy', 'phi', 'protected health information'],
  'COPPA': ['coppa', 'children\'s online privacy protection', 'children privacy', 'kids privacy'],
  'PIPEDA': ['pipeda', 'personal information protection', 'canadian privacy'],
  'LGPD': ['lgpd', 'lei geral de proteção de dados', 'brazil privacy', 'brazilian privacy'],
  'FERPA': ['ferpa', 'family educational rights', 'student privacy', 'education privacy'],
  'GLBA': ['glba', 'gramm-leach-bliley', 'financial privacy', 'banking privacy'],
  'VCDPA': ['vcdpa', 'virginia consumer data protection', 'virginia privacy'],
  'CPRA': ['cpra', 'california privacy rights act', 'california privacy rights']
};

/**
 * Trends Tracker
 * STRATEGIC FOCUS: Long-term trends, regulations, compliance (30-90 day window)
 * Shows regulatory changes, enforcement actions, policy updates, industry trends
 * 
 * CATEGORY FILTER: Only shows strategic categories:
 *   - regulation: New laws and regulations
 *   - enforcement: Fines and penalties
 *   - privacy-laws: Policy changes
 *   - compliance: Standards updates
 *   - news: Industry trends
 * 
 * Note: This component is also known as "Privacy Regulations Monitoring" internally,
 * but is displayed to users as "Trends Tracker" for consistency.
 * 
 * For immediate security threats, see Privacy Radar (PrivacyRadar.jsx)
 */
const PrivacyRegulationsMonitoring = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const { t } = useTranslation();
  
  // State management
  const [allFeeds, setAllFeeds] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [showCriticalOnly, setShowCriticalOnly] = useState(false);
  
  // LocalStorage for tracking
  const [lastVisit, setLastVisit] = useLocalStorage('privacy_regs_last_visit', null);
  const [readItems, setReadItems] = useLocalStorage('privacy_regs_read_items', []);
  const [lastUpdate, setLastUpdate] = useLocalStorage('privacy_regs_last_update', null);
  const [selectedServices] = useLocalStorage('socialcaution_services', []);
  
  // Get alerts from store
  const storeAlerts = useCautionStore((state) => state.alerts);
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  // Calculate service-specific privacy trends
  const serviceTrends = useMemo(() => {
    if (!selectedServices || selectedServices.length === 0) {
      return null;
    }
    return ServicePrivacyData.getPrivacyTrends(selectedServices, 30);
  }, [selectedServices]);
  
  // Get overall privacy score for selected services
  const overallPrivacyScore = useMemo(() => {
    if (!selectedServices || selectedServices.length === 0) {
      return null;
    }
    return ServicePrivacyData.calculateOverallPrivacyScore(selectedServices);
  }, [selectedServices]);

  // Function to detect regulations mentioned in an item
  const detectRegulations = React.useCallback((item) => {
    const text = `${item.title || ''} ${item.description || ''}`.toLowerCase();
    const detectedRegulations = [];
    
    Object.keys(REGULATION_KEYWORDS).forEach(regulation => {
      if (REGULATION_KEYWORDS[regulation].some(keyword => text.includes(keyword))) {
        detectedRegulations.push(regulation);
      }
    });
    
    return detectedRegulations;
  }, []);
  
  // Update last visit on mount
  useEffect(() => {
    setLastVisit(new Date().toISOString());
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Run only on mount - setLastVisit is stable
  
  // Process alerts from store and convert to RSS format
  const processStoreAlerts = React.useCallback(() => {
    if (import.meta.env.DEV) {
      console.log('[Trends Tracker] Processing alerts from store...', { alertCount: storeAlerts?.length || 0 });
    }
    
    if (!storeAlerts || storeAlerts.length === 0) {
      if (import.meta.env.DEV) {
        console.log('[Trends Tracker] No alerts in store to process');
      }
      setAllFeeds([]);
      return;
    }
    
    // Convert CautionAlerts to RSS alerts
    const rssAlerts = cautionAlertsToRSSAlerts(storeAlerts);
    
    if (import.meta.env.DEV) {
      console.log('[Trends Tracker] Converted to RSS alerts:', rssAlerts.length);
    }
    
    // Filter for STRATEGIC categories only
    const strategicAlerts = filterRSSAlertsByCategories(rssAlerts, STRATEGIC_CATEGORIES);
    
    if (import.meta.env.DEV) {
      console.log('[Trends Tracker] Filtered strategic alerts:', strategicAlerts.length, 'from categories:', STRATEGIC_CATEGORIES);
    }
    
    // Group by feed for display and deduplicate items
    const feedsMap = new Map();
    const seenGuids = new Set(); // Track seen items by ID to prevent duplicates
    const seenContent = new Set(); // Track seen items by title+link to catch content duplicates
    
    strategicAlerts.forEach(alert => {
      // Skip if we've already seen this item by ID
      const guid = alert.id || alert.guid;
      if (seenGuids.has(guid)) {
        return;
      }
      
      // Also check for content duplicates (same title + link)
      const contentKey = `${(alert.title || '').toLowerCase().trim()}|${alert.link || ''}`;
      if (seenContent.has(contentKey)) {
        return;
      }
      
      seenGuids.add(guid);
      seenContent.add(contentKey);
      
      const feedId = alert.rssFeedId || alert.source?.name || 'unknown';
      const feedName = alert.source?.name || t('privacyRegulations.unknownFeed');
      
      if (!feedsMap.has(feedId)) {
        feedsMap.set(feedId, {
          id: feedId,
          name: feedName,
          category: alert.category,
          region: alert.region || 'global',
          items: [],
          error: null
        });
      }
      feedsMap.get(feedId).items.push({
        id: alert.id,
        title: alert.title,
        description: alert.description,
        link: alert.link || '',
        pubDate: alert.publishedDate || alert.pubDate,
        feedName: feedName,
        feedCategory: alert.category,
        feedRegion: alert.region || 'global',
        feedId: alert.rssFeedId || feedId,
        guid: alert.id || alert.guid
      });
    });
    
    setAllFeeds(Array.from(feedsMap.values()));
    setLastUpdate(new Date().toISOString());

    if (import.meta.env.DEV) {
      console.log(`[Trends Tracker] Processed ${strategicAlerts.length} strategic alerts from ${feedsMap.size} feeds`);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storeAlerts, t]); // setLastUpdate is stable and doesn't need to be in dependencies
  
  // Manual refresh - triggers service to fetch new feeds
  const refreshAllFeeds = React.useCallback(async () => {
    if (isRefreshing) {
      if (import.meta.env.DEV) {
        console.warn('[Trends Tracker] Already refreshing, skipping duplicate request');
      }
      return;
    }

    setIsRefreshing(true);
    setLoadingProgress({ status: 'starting', totalFeeds: 0, completed: 0 });
    
    try {
      if (import.meta.env.DEV) {
        console.log('[Trends Tracker] Triggering RSS alert service refresh...');
      }
      
      // Trigger the service to fetch new feeds
      await rssAlertService.processNow();
      
      // Process will happen automatically when store updates
      setLoadingProgress({ status: 'complete', totalAlerts: storeAlerts.length });
      
      // Clear progress after a short delay
      setTimeout(() => {
        setLoadingProgress(null);
      }, 2000);
    } catch (error) {
      console.error('[Trends Tracker] Error refreshing feeds:', error);
      setLoadingProgress({ status: 'error', error: error.message || t('privacyRegulations.failedToLoadFeeds') });
      setTimeout(() => {
        setLoadingProgress(null);
      }, 5000);
    } finally {
      setIsRefreshing(false);
    }
  }, [isRefreshing, storeAlerts.length, t]);

  // Process alerts from store when they change
  useEffect(() => {
    processStoreAlerts();
  }, [processStoreAlerts]);
  
  // Initial load - process existing store data
  useEffect(() => {
    if (storeAlerts.length > 0) {
      processStoreAlerts();
    } else {
      // If no alerts in store, trigger initial fetch
      if (import.meta.env.DEV) {
        console.log('[Trends Tracker] No alerts in store, triggering initial fetch...');
      }
      // Trigger fetch and wait a bit for it to complete
      rssAlertService.processNow().then(() => {
        // Give it a moment to process, then check again
        setTimeout(() => {
          const updatedAlerts = useCautionStore.getState().alerts;
          if (updatedAlerts.length > 0) {
            processStoreAlerts();
          }
        }, 2000);
      }).catch(error => {
        console.error('[Trends Tracker] Error on initial fetch:', error);
      });
    }
  }, []); // Only run on mount
  
  // Note: Auto-refresh is handled by rssAlertService (runs every hour)
  // This component will automatically update when store changes

  // Get all items for statistics and risk distribution (deduplicated)
  const allItems = useMemo(() => {
    const itemsMap = new Map(); // Deduplicate by guid or id
    allFeeds.forEach(feed => {
      (feed.items || []).forEach(item => {
        const key = item.guid || item.id;
        if (key && !itemsMap.has(key)) {
          itemsMap.set(key, {
            ...item,
            feedName: item.feedName || feed.name || 'Unknown Feed',
            feedId: item.feedId || feed.id
          });
        }
      });
    });
    return Array.from(itemsMap.values());
  }, [allFeeds]);

  // Calculate statistics
  const stats = useMemo(() => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const lastVisitDate = lastVisit ? new Date(lastVisit) : null;

    return {
      total: allItems.length,
      totalItems: allItems.length,
      newToday: allItems.filter(item => {
        if (!item.pubDate) return false;
        const itemDate = new Date(item.pubDate);
        return !isNaN(itemDate.getTime()) && itemDate >= today;
      }).length,
      newSinceLastVisit: lastVisitDate ? allItems.filter(item => {
        if (!item.pubDate) return false;
        const itemDate = new Date(item.pubDate);
        return !isNaN(itemDate.getTime()) && itemDate > lastVisitDate;
      }).length : 0,
      criticalAlerts: allItems.filter(item => {
        const impact = calculateStrategicImpact(item);
        return impact === 'critical';
      }).length,
      high: allItems.filter(item => {
        const impact = calculateStrategicImpact(item);
        return impact === 'high';
      }).length,
      medium: allItems.filter(item => {
        const impact = calculateStrategicImpact(item);
        return impact === 'medium';
      }).length,
      low: allItems.filter(item => {
        const impact = calculateStrategicImpact(item);
        return impact === 'low';
      }).length,
      totalSources: allFeeds.length
    };
  }, [allItems, allFeeds.length, lastVisit]);

  // Filter items based on search, category, and critical filter
  const filteredItems = useMemo(() => {
    let items = [...allItems];
    
    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      items = items.filter(item => 
        item.title?.toLowerCase().includes(query) ||
        item.description?.toLowerCase().includes(query) ||
        item.feedName?.toLowerCase().includes(query)
      );
    }
    
    // Filter by category (handle 'standards' -> 'compliance' mapping)
    if (categoryFilter !== 'all') {
      items = items.filter(item => {
        const itemCategory = item.feedCategory || 'other';
        // Map 'standards' to 'compliance' for filtering
        const mappedCategory = itemCategory === 'standards' ? 'compliance' : itemCategory;
        return mappedCategory === categoryFilter || itemCategory === categoryFilter;
      });
    }
    
    // Filter by critical only
    if (showCriticalOnly) {
      items = items.filter(item => {
        const impact = calculateStrategicImpact(item);
        return impact === 'critical' || impact === 'high';
      });
    }
    
    // Sort by date (newest first)
    return items.sort((a, b) => {
      const dateA = new Date(a.pubDate || 0);
      const dateB = new Date(b.pubDate || 0);
      return dateB - dateA;
    });
  }, [allItems, searchQuery, categoryFilter, showCriticalOnly]);


  // Mark item as read
  const markAsRead = (itemId) => {
    if (!readItems.includes(itemId)) {
      setReadItems([...readItems, itemId]);
    }
  };

  // Get time ago string
  const getTimeAgo = (dateString) => {
    if (!dateString) return t('privacyRegulations.unknownDate');
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return t('privacyRegulations.invalidDate');
      
      const now = new Date();
      const diffMs = now - date;
      const diffMins = Math.floor(diffMs / 60000);
      const diffHours = Math.floor(diffMs / 3600000);
      const diffDays = Math.floor(diffMs / 86400000);
      
      if (diffMins < 1) return 'Just now';
      if (diffMins < 60) return `${diffMins} minute${diffMins !== 1 ? 's' : ''} ago`;
      if (diffHours < 24) return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
      if (diffDays < 7) return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
      return date.toLocaleDateString();
    } catch (error) {
      return t('privacyRegulations.invalidDate');
    }
  };

  // Get category color class
  function getCategoryColor(category) {
    if (!category) return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300';
    const colors = {
      'regulation': 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300',
      'enforcement': 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300',
      'privacy-laws': 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
      'compliance': 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
      'breach': 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
      'news': 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300',
      'standards': 'bg-teal-100 text-teal-800 dark:bg-teal-900/30 dark:text-teal-300'
    };
    return colors[category] || 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300';
  }

  // Calculate strategic impact using enhanced multi-dimensional scoring
  function calculateStrategicImpact(item) {
    const relevancy = calculateEnhancedRelevancy(item, {
      // Optional: Add user context if available
      // industry: 'technology',
      // regions: ['US', 'EU'],
      // keywords: ['gdpr', 'ccpa']
    });
    
    // Map to legacy priority levels for backward compatibility
    return relevancy.priority;
  }
  

  return (
    <>
      <SEOHead
        title="Trends Tracker - Privacy Regulations & Compliance | SocialCaution"
        description="Track privacy regulations, enforcement actions, and compliance updates affecting the services you use. Strategic intelligence for long-term privacy planning (90-day horizon)."
        keywords="privacy regulations, GDPR, CCPA, data protection, compliance monitoring, privacy trends, regulatory updates, enforcement actions"
      />
      <section className="pt-8 sm:pt-12 pb-4 sm:pb-6 bg-gradient-to-br from-gray-50 via-red-50/30 to-gray-50 dark:from-slate-900 dark:via-red-950/20 dark:to-slate-900">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h1 className="page-title mb-4 sm:mb-6 flex items-center justify-center gap-3 sm:gap-4">
              <div className="p-1.5 sm:p-2 md:p-2.5 bg-gradient-to-br from-red-500 to-red-600 rounded-lg shadow-md flex-shrink-0 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 sm:w-5 sm:h-5 md:w-6 md:h-6 text-white" />
              </div>
              <span className="leading-tight">{t('privacyRegulations.title')}</span>
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              {t('privacyRegulations.subtitle')}
            </p>
          </div>
        </div>
      </section>
      
      <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Description Banner */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3 mb-6">
            <p className="text-sm text-blue-800 dark:text-blue-200 text-center">
              <Info className="w-4 h-4 inline mr-1" />
              {t('privacyRegulations.description')}
            </p>
          </div>

          {/* Service Catalog Prompt */}
          {selectedServices.length === 0 ? (
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl shadow-sm border-2 border-blue-200 dark:border-blue-800 p-6 mb-6">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                    <Shield className="w-6 h-6 text-white" />
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                    Monitor Regulations Affecting Your Services
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300 mb-4">
                    Track privacy regulations and see which ones impact the services you use. 
                    Add services to your Services Monitoring to get personalized regulatory alerts for those services.
                  </p>
                  <button
                    onClick={() => navigate('/service-catalog')}
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center gap-2"
                  >
                    <Shield className="w-5 h-5" />
                    Go to Services Monitoring
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <>
              {/* Service Privacy Summary - Enhanced Design */}
              {overallPrivacyScore && (
                <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 p-5 mb-6">
                  {/* Header */}
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                      {t('privacyRegulations.servicePrivacyOverview.title')}
                    </h3>
                    <button
                      onClick={() => navigate('/service-catalog')}
                      className="text-sm px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-1.5"
                    >
                      <Shield className="w-3.5 h-3.5" />
                      {t('privacyRegulations.servicePrivacyOverview.manageServices', { count: selectedServices.length, plural: selectedServices.length > 1 ? 's' : '' })}
                    </button>
                  </div>
                  
                  {/* Metrics - Compact horizontal layout */}
                  <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mb-4">
                    {/* Privacy Exposure Score Card */}
                    <div className="flex items-center gap-1.5 bg-white dark:bg-slate-800 rounded-lg px-2.5 py-1.5 shadow-sm border border-gray-200 dark:border-slate-700">
                      <div className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-gradient-to-br from-red-500 to-pink-500 flex-shrink-0">
                        <div className="text-xs font-bold text-white">{overallPrivacyScore.score}</div>
                      </div>
                      <div>
                        <div className="text-[9px] font-semibold text-gray-900 dark:text-white leading-tight">{t('privacyRegulations.servicePrivacyOverview.privacyExposureScore')}</div>
                        {serviceTrends && serviceTrends.length > 7 && (
                          <div className="flex items-center gap-0.5 text-[8px] mt-0.5">
                            {serviceTrends[serviceTrends.length - 1].score > serviceTrends[serviceTrends.length - 8].score ? (
                              <>
                                <TrendingUp className="h-2 w-2 text-green-600" />
                                <span className="text-green-600">
                                  +{Math.round(serviceTrends[serviceTrends.length - 1].score - serviceTrends[serviceTrends.length - 8].score)} {t('privacyRadar.thisWeek')}
                                </span>
                              </>
                            ) : (
                              <>
                                <TrendingUp className="h-2 w-2 text-red-600 rotate-180" />
                                <span className="text-red-600">
                                  {Math.round(serviceTrends[serviceTrends.length - 1].score - serviceTrends[serviceTrends.length - 8].score)} {t('privacyRadar.thisWeek')}
                                </span>
                              </>
                            )}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* High Risk Card */}
                    <div className="flex items-center gap-1.5 bg-red-50 dark:bg-red-900/20 rounded-lg px-2.5 py-1.5 shadow-sm border border-red-200 dark:border-red-800">
                      <div className="text-base font-bold text-red-700 dark:text-red-400">{overallPrivacyScore.highRiskCount}</div>
                      <div className="text-[9px] font-medium text-red-600 dark:text-red-400">{t('privacyRegulations.servicePrivacyOverview.highRisk')}</div>
                    </div>

                    {/* Medium Risk Card */}
                    <div className="flex items-center gap-1.5 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg px-2.5 py-1.5 shadow-sm border border-yellow-200 dark:border-yellow-800">
                      <div className="text-base font-bold text-yellow-700 dark:text-yellow-400">{overallPrivacyScore.mediumRiskCount}</div>
                      <div className="text-[9px] font-medium text-yellow-600 dark:text-yellow-400">{t('privacyRegulations.servicePrivacyOverview.mediumRisk')}</div>
                    </div>

                    {/* Low Risk Card */}
                    <div className="flex items-center gap-1.5 bg-green-50 dark:bg-green-900/20 rounded-lg px-2.5 py-1.5 shadow-sm border border-green-200 dark:border-green-800">
                      <div className="text-base font-bold text-green-700 dark:text-green-400">{overallPrivacyScore.lowRiskCount}</div>
                      <div className="text-[9px] font-medium text-green-600 dark:text-green-400">{t('privacyRegulations.servicePrivacyOverview.lowRisk')}</div>
                    </div>

                    {/* Known Breaches Card - Enhanced */}
                    {overallPrivacyScore.totalBreaches > 0 && (
                      <div className="flex items-center gap-2 bg-red-100 dark:bg-red-900/30 rounded-lg px-3 py-1.5 shadow-md border-2 border-red-500 dark:border-red-600">
                        <AlertTriangle className="w-4 h-4 text-red-700 dark:text-red-300 flex-shrink-0" />
                        <span className="text-[10px] font-semibold text-red-900 dark:text-red-100 whitespace-nowrap">
                          {t('privacyRegulations.servicePrivacyOverview.knownBreaches', { count: overallPrivacyScore.totalBreaches, plural: overallPrivacyScore.totalBreaches > 1 ? 'es' : '' })}
                        </span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate('/service-catalog');
                          }}
                          className="ml-1 text-[9px] font-semibold text-red-700 dark:text-red-200 hover:text-red-900 dark:hover:text-red-100 underline"
                        >
                          {t('privacyRadar.reviewServices')}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </>
          )}
          
          {/* Simplified Statistics Summary - 4 Essential Metrics - Compact and Centered */}
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mb-4 max-w-3xl mx-auto">
            <div className="flex items-center gap-1.5 bg-white dark:bg-slate-800 rounded-lg px-2.5 py-1.5 shadow-sm border border-gray-200 dark:border-slate-700">
              <div className="text-base font-bold text-gray-900 dark:text-white">{stats.totalItems}</div>
              <div className="text-[9px] font-medium text-gray-600 dark:text-gray-400">Total Updates</div>
            </div>
            <div className="flex items-center gap-1.5 bg-white dark:bg-slate-800 rounded-lg px-2.5 py-1.5 shadow-sm border border-red-200 dark:border-red-800">
              <div className="text-base font-bold text-red-600 dark:text-red-400">{stats.criticalAlerts}</div>
              <div className="text-[9px] font-medium text-gray-600 dark:text-gray-400">Critical</div>
              {stats.criticalAlerts > 0 && (
                <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" />
              )}
            </div>
            <div className="flex items-center gap-1.5 bg-white dark:bg-slate-800 rounded-lg px-2.5 py-1.5 shadow-sm border border-gray-200 dark:border-slate-700">
              <div className="text-base font-bold text-gray-900 dark:text-white">{stats.newSinceLastVisit}</div>
              <div className="text-[9px] font-medium text-gray-600 dark:text-gray-400">New Since Last Visit</div>
            </div>
            <div className="flex items-center gap-1.5 bg-white dark:bg-slate-800 rounded-lg px-2.5 py-1.5 shadow-sm border border-gray-200 dark:border-slate-700">
              <div className="text-base font-bold text-gray-900 dark:text-white">{stats.totalSources}</div>
              <div className="text-[9px] font-medium text-gray-600 dark:text-gray-400">Sources</div>
            </div>
          </div>

          {/* Critical Alerts Banner */}
          {stats.criticalAlerts > 0 && (
            <div className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 rounded-lg p-4 mb-6">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-red-900 dark:text-red-100">
                    {stats.criticalAlerts} Critical Alert{stats.criticalAlerts !== 1 ? 's' : ''} Require Attention
                  </h3>
                  <p className="text-sm text-red-800 dark:text-red-200 mt-1">
                    Review these high-priority regulatory updates that may require immediate action.
                  </p>
                </div>
              </div>
            </div>
          )}
          
          {/* Simplified Search and Filters */}
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm p-4 mb-6">
            <div className="flex flex-col sm:flex-row gap-3">
              {/* Search */}
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search regulations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-lg text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              {/* Category Filter */}
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="px-4 py-2 bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-lg text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">{t('privacyRegulations.allCategories')}</option>
                <option value="regulation">{t('privacyRegulations.categories.regulation')}</option>
                <option value="enforcement">{t('privacyRegulations.categories.enforcement')}</option>
                <option value="compliance">{t('privacyRegulations.categories.compliance')}</option>
                <option value="privacy-laws">{t('privacyRegulations.categories.privacyLaws')}</option>
                <option value="news">{t('privacyRegulations.categories.news')}</option>
              </select>
              
              {/* Critical Only Toggle */}
              <button
                onClick={() => setShowCriticalOnly(!showCriticalOnly)}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  showCriticalOnly
                    ? 'bg-red-600 text-white'
                    : 'bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-600'
                }`}
              >
                {showCriticalOnly ? t('privacyRegulations.showAll') : t('privacyRegulations.showCriticalOnly')}
              </button>
              
              {/* Refresh Button */}
              <button
                onClick={refreshAllFeeds}
                disabled={isRefreshing}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
              >
                <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                {t('privacyRegulations.refresh')}
              </button>
            </div>
            
            {lastUpdate && (
              <div className="mt-3 text-xs text-gray-500 dark:text-gray-400">
                {t('privacyRegulations.lastUpdated')} {new Date(lastUpdate).toLocaleString()}
              </div>
            )}
          </div>
          
          {/* Feed Items */}
          {isLoading && allFeeds.length === 0 ? (
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-8 text-center min-h-[200px]">
              <div className="max-w-md mx-auto">
                <RefreshCw className="w-8 h-8 text-blue-600 dark:text-blue-400 mx-auto mb-4 animate-spin" />
                <p className="text-gray-600 dark:text-gray-300 mb-4">{t('privacyRegulations.loading')}</p>
                {loadingProgress && (
                  <div className="mt-4 space-y-2">
                    {loadingProgress.status === 'starting' && (
                      <p className="text-sm text-gray-500 dark:text-gray-400">Initializing feed processor...</p>
                    )}
                    {loadingProgress.status === 'progress' && (
                      <>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Processing feeds: {loadingProgress.completed} / {loadingProgress.totalFeeds || '?'}
                        </p>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <div 
                            className="bg-red-600 h-2 rounded-full transition-all duration-300"
                            style={{ 
                              width: loadingProgress.totalFeeds > 0 
                                ? `${(loadingProgress.completed / loadingProgress.totalFeeds) * 100}%` 
                                : '0%' 
                            }}
                          />
                        </div>
                        {loadingProgress.currentBatch && loadingProgress.currentBatch.length > 0 && (
                          <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                            Current: {loadingProgress.currentBatch.join(', ')}
                          </p>
                        )}
                      </>
                    )}
                    {loadingProgress.status === 'complete' && (
                      <p className="text-sm text-green-600 dark:text-green-400">
                        ✓ Loaded {loadingProgress.totalAlerts} alerts from {loadingProgress.successful} feeds
                      </p>
                    )}
                    {loadingProgress.status === 'error' && (
                      <div className="space-y-3 bg-yellow-50 dark:bg-yellow-900/10 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
                        <div className="flex items-start gap-2">
                          <AlertTriangle className="w-5 h-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" />
                          <div className="flex-1 text-left">
                            <p className="text-sm font-medium text-yellow-900 dark:text-yellow-100 mb-1">
                              RSS Feeds Unavailable
                            </p>
                            <p className="text-sm text-yellow-800 dark:text-yellow-200 mb-2">
                              {loadingProgress.error || t('privacyRegulations.failedToLoadFeeds')}
                            </p>
                            {loadingProgress.error && loadingProgress.error.includes('netlify dev') && (
                              <div className="bg-white dark:bg-slate-800 rounded p-3 mt-2 text-xs text-gray-700 dark:text-gray-300 font-mono">
                                <p className="mb-1 font-semibold text-gray-900 dark:text-white">To enable RSS feeds:</p>
                                <p className="text-green-600 dark:text-green-400">$ netlify dev</p>
                                <p className="text-gray-500 dark:text-gray-400 mt-2">
                                  Or use the production site where RSS feeds are fully functional.
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                        <button
                          onClick={() => {
                            setLoadingProgress(null);
                            setIsLoading(false);
                          }}
                          className="w-full px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors text-sm font-medium"
                        >
                          Dismiss
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <>
              {/* Show loading indicator as overlay if still loading but have some feeds */}
              {isLoading && allFeeds.length > 0 && (
                <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg flex items-center gap-2">
                  <RefreshCw className="w-4 h-4 animate-spin text-blue-600 dark:text-blue-400" />
                  <span className="text-sm text-blue-700 dark:text-blue-300">{t('privacyRegulations.refreshingRegulations')}</span>
                </div>
              )}
              
                {filteredItems.length === 0 ? (
                  <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-gray-200 dark:border-slate-700 p-6 text-center">
                    <Info className="w-12 h-12 text-gray-400 dark:text-gray-500 mx-auto mb-3" />
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      {searchQuery ? t('privacyRegulations.noItemsMatchSearch') : t('privacyRegulations.noItemsAvailable')}
                    </h3>
                    {!searchQuery && allItems.length === 0 && (
                      <div className="mt-4 space-y-2">
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          No privacy regulations or compliance updates are currently available.
                        </p>
                        <button
                          onClick={refreshAllFeeds}
                          disabled={isRefreshing}
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center gap-2 mx-auto"
                        >
                          <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                          {isRefreshing ? t('privacyRegulations.refreshing') : t('privacyRegulations.refresh')}
                        </button>
                      </div>
                    )}
                    {searchQuery && (
                      <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">
                        Try adjusting your search terms or filters.
                      </p>
                    )}
                  </div>
                ) : (
            <div className="space-y-3">
              {filteredItems.map((item) => {
                const isRead = readItems.includes(item.id);
                const strategicImpact = calculateStrategicImpact(item);
                const isCritical = strategicImpact === 'critical';
                const detectedRegulations = detectRegulations(item);
                
                return (
                  <div
                    key={item.id}
                    onClick={() => {
                      markAsRead(item.id);
                      if (item.link && item.link.trim() !== '') {
                        window.open(item.link, '_blank', 'noopener,noreferrer');
                      }
                    }}
                    className={`
                      bg-white dark:bg-slate-800 rounded-lg shadow-sm border-l-4 cursor-pointer p-4
                      transition-all hover:shadow-md
                      ${isCritical ? 'border-red-500' : 'border-gray-300 dark:border-slate-600'}
                      ${isRead ? 'opacity-60' : ''}
                    `}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        {/* Category & Priority - Single Line */}
                        <div className="flex items-center gap-2 mb-2">
                          <span className={`px-2 py-0.5 rounded text-xs font-medium ${getCategoryColor(item.feedCategory)}`}>
                            {item.feedCategory === 'regulation' ? t('privacyRegulations.categories.regulation') :
                             item.feedCategory === 'enforcement' ? t('privacyRegulations.categories.enforcement') :
                             item.feedCategory === 'compliance' ? t('privacyRegulations.categories.compliance') :
                             item.feedCategory === 'privacy-laws' ? t('privacyRegulations.categories.privacyLaws') :
                             item.feedCategory === 'news' ? t('privacyRegulations.categories.news') :
                             item.feedCategory ? t(`privacyRegulations.categories.${item.feedCategory}`) || item.feedCategory.charAt(0).toUpperCase() + item.feedCategory.slice(1) : t('privacyRegulations.categories.news')}
                          </span>
                          {isCritical && (
                            <span className="px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300">
                              {t('privacyRegulations.critical')}
                            </span>
                          )}
                        </div>
                        
                        {/* Title */}
                        <h3 className={`text-base font-semibold mb-1 ${isRead ? 'text-gray-500' : 'text-gray-900 dark:text-white'}`}>
                          {item.title}
                        </h3>
                        
                        {/* Regulations - Only if present */}
                        {detectedRegulations.length > 0 && (
                          <div className="flex flex-wrap gap-1 mb-2">
                            {detectedRegulations.map(reg => (
                              <span key={reg} className="px-2 py-0.5 rounded text-xs bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300">
                                {reg}
                              </span>
                            ))}
                          </div>
                        )}
                        
                        {/* Description - Truncated */}
                        {item.description && (
                          <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-2">
                            {item.description.replace(/<[^>]*>/g, '').substring(0, 120)}...
                          </p>
                        )}
                        
                        {/* Metadata - Single Line */}
                        <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {getTimeAgo(item.pubDate)}
                          </span>
                          {item.feedName && item.feedName !== 'Unknown Feed' && (
                            <span className="truncate max-w-[120px]">{item.feedName}</span>
                          )}
                        </div>
                      </div>
                      
                      <ExternalLink className="w-4 h-4 text-gray-400 flex-shrink-0 mt-1" />
                    </div>
                  </div>
                );
              })}
            </div>
                )}
              </>
          )}
          
          {/* Results Count */}
          {filteredItems.length > 0 && (
            <div className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
              Showing {filteredItems.length} of {stats.totalItems} item{stats.totalItems !== 1 ? 's' : ''}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default PrivacyRegulationsMonitoring;

