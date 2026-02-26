import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Shield, AlertTriangle, Bell, Search, Filter, RefreshCw, 
  TrendingUp, Clock, ExternalLink, CheckCircle, X, 
  Globe, Building2, Scale, FileText, Zap, Info, ChevronDown,
  Radio, Radar, Target, Hammer, Wrench, ArrowRight
} from 'lucide-react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { useTheme } from '../contexts/ThemeContext';
import { serviceCatalog } from '../data/serviceCatalog';
import { getAllEnhancedServices, getEnhancedService } from '../data/serviceCatalogEnhanced';
import { PersonaProfiles } from '../data/personaProfiles';
import { useCautionStore } from '../state/cautionStore';
import { rssAlertService } from '../services/rssAlertService';
import { cautionAlertsToRSSAlerts, filterRSSAlertsByCategories } from '../utils/rssAlertMapper';
import SEOHead from './common/SEOHead';
import { useTranslation } from '../contexts/TranslationContext';
import { isUserInitialized, getDefaultServices } from '../utils/userInitialization';
import ServicePrivacyData from '../utils/servicePrivacyData';

// TACTICAL FEED CATEGORIES - Immediate threats only
const TACTICAL_CATEGORIES = [
  'general-security',  // Immediate security threats
  'data-breach',       // Active breaches
  'phishing',          // Active phishing campaigns
  'scams',             // Active scams
  'device-security'    // Critical vulnerabilities
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
 * Privacy Radar - Mobile-Optimized Real-time Privacy Monitoring
 * TACTICAL FOCUS: Immediate threats requiring urgent action
 * Shows security threats, data breaches, phishing, vulnerabilities from RSS feeds
 * 
 * CATEGORY FILTER: Only shows tactical categories:
 *   - general-security: Immediate security threats
 *   - data-breach: Active data breaches
 *   - phishing: Active phishing campaigns
 *   - scams: Active scam alerts
 *   - device-security: Critical device vulnerabilities
 * 
 * Note: For long-term regulatory trends, see Trends Tracker (PrivacyRegulationsMonitoring.jsx)
 */
const PrivacyRadar = ({ compact = false, maxItems = 10 }) => {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const { t } = useTranslation();

  // Function to detect regulations mentioned in an item
  const detectRegulations = useCallback((item) => {
    const text = `${item.title || ''} ${item.description || ''}`.toLowerCase();
    const detectedRegulations = [];
    
    Object.keys(REGULATION_KEYWORDS).forEach(regulation => {
      if (REGULATION_KEYWORDS[regulation].some(keyword => text.includes(keyword))) {
        detectedRegulations.push(regulation);
      }
    });
    
    return detectedRegulations;
  }, []);
  
  // State management
  const [allFeeds, setAllFeeds] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [severityFilter, setSeverityFilter] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [showCategoryButtons, setShowCategoryButtons] = useState(true);
  const [showRecommendedActionsDetails, setShowRecommendedActionsDetails] = useState(false);
  const [showDebugInfo, setShowDebugInfo] = useState(false);
  const [showAllAlerts, setShowAllAlerts] = useState(false);
  
  // Performance: Limit constant for initial display
  const INITIAL_ALERTS_LIMIT = 10;
  
  // Debounce search query for performance
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);
  
  // Reset showAllAlerts when filters change to improve performance
  useEffect(() => {
    setShowAllAlerts(false);
  }, [debouncedSearchQuery, categoryFilter, severityFilter]);
  
  // LocalStorage for tracking
  const [lastVisit, setLastVisit] = useLocalStorage('privacy_radar_last_visit', null);
  const [readItems, setReadItems] = useLocalStorage('privacy_radar_read_items', []);
  const [lastUpdate, setLastUpdate] = useLocalStorage('privacy_radar_last_update', null);
  const [selectedServices] = useLocalStorage('socialcaution_services', []);
  const [personaData] = useLocalStorage('socialcaution_persona', null);
  
  // Assessment integration
  const [assessmentResults] = useLocalStorage('assessment-results', null);
  const exposureScore = assessmentResults?.data?.exposure?.score || assessmentResults?.data?.exposureScore || null;
  const rightsScore = assessmentResults?.data?.rights?.score || assessmentResults?.data?.rightsScore || null;
  
  // Get alerts from store
  const storeAlerts = useCautionStore((state) => state.alerts);
  
  // Calculate overall privacy score from selected services
  const overallPrivacyScore = useMemo(() => {
    if (!selectedServices || selectedServices.length === 0) {
      return null;
    }
    return ServicePrivacyData.calculateOverallPrivacyScore(selectedServices);
  }, [selectedServices]);
  
  // Get privacy trends
  const privacyTrends = useMemo(() => {
    if (!selectedServices || selectedServices.length === 0) {
      return [];
    }
    return ServicePrivacyData.getPrivacyTrends(selectedServices, 30);
  }, [selectedServices]);
  
  // Update last visit on mount
  useEffect(() => {
    setLastVisit(new Date().toISOString());
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Run only on mount - setLastVisit is stable
  
  // Process alerts from store and convert to RSS format
  const processStoreAlerts = useCallback(() => {
    if (import.meta.env.DEV) {
      console.log('[Privacy Radar] Processing alerts from store...', { alertCount: storeAlerts?.length || 0 });
    }
    
    // Validate storeAlerts
    if (!Array.isArray(storeAlerts)) {
      console.warn('[Privacy Radar] storeAlerts is not an array:', typeof storeAlerts);
      setAllFeeds([]);
      return;
    }
    
    // Convert CautionAlerts to RSS alerts
    const rssAlerts = cautionAlertsToRSSAlerts(storeAlerts);
    
    if (import.meta.env.DEV) {
      console.log('[Privacy Radar] Converted to RSS alerts:', rssAlerts.length);
    }
    
    // Filter for TACTICAL categories only
    const tacticalAlerts = filterRSSAlertsByCategories(rssAlerts, TACTICAL_CATEGORIES);
    
    if (import.meta.env.DEV) {
      console.log('[Privacy Radar] Filtered tactical alerts:', tacticalAlerts.length);
    }
    
    // Group by feed for display and deduplicate items
    const feedsMap = new Map();
    const seenItemIds = new Set(); // Track seen item IDs to prevent duplicates
    const seenItemTitles = new Set(); // Track seen titles to prevent duplicate content
    
    // Helper function to normalize title for comparison
    const normalizeTitle = (title) => {
      if (!title) return '';
      return title.toLowerCase().trim().replace(/\s+/g, ' ').substring(0, 100);
    };
    
    tacticalAlerts.forEach(alert => {
      // Validate alert structure
      if (!alert || !alert.id) {
        if (import.meta.env.DEV) {
          console.warn('[Privacy Radar] Skipping invalid alert:', alert);
        }
        return;
      }
      
      // Skip if we've already processed this item by ID
      if (seenItemIds.has(alert.id)) {
        if (import.meta.env.DEV) {
          console.log('[Privacy Radar] Skipping duplicate ID:', alert.id);
        }
        return;
      }
      
      // Check for duplicate content by normalized title
      const normalizedTitle = normalizeTitle(alert.title);
      if (normalizedTitle && seenItemTitles.has(normalizedTitle)) {
        if (import.meta.env.DEV) {
          console.log('[Privacy Radar] Skipping duplicate title:', normalizedTitle);
        }
        return;
      }
      
      seenItemIds.add(alert.id);
      if (normalizedTitle) {
        seenItemTitles.add(normalizedTitle);
      }
      
      // Validate date exists
      const dateString = alert.publishedDate || alert.pubDate;
      if (!dateString) {
        if (import.meta.env.DEV) {
          console.warn('[Privacy Radar] Skipping alert without date:', alert.id, alert.title);
        }
        return;
      }
      
      // Validate date is parseable
      const testDate = new Date(dateString);
      if (isNaN(testDate.getTime())) {
        if (import.meta.env.DEV) {
          console.warn('[Privacy Radar] Skipping alert with invalid date:', alert.id, dateString);
        }
        return;
      }
      
      const feedId = alert.rssFeedId || alert.source?.name || 'unknown';
      if (!feedsMap.has(feedId)) {
        feedsMap.set(feedId, {
          id: feedId,
          name: alert.source?.name || 'Unknown Feed',
          category: alert.category,
          items: [],
          error: null
        });
      }
      
      // Check if item already exists in this feed's items (additional safety check)
      const feed = feedsMap.get(feedId);
      const itemExists = feed.items.some(item => 
        item.id === alert.id || normalizeTitle(item.title) === normalizedTitle
      );
      if (!itemExists) {
        feed.items.push({
          id: alert.id,
          title: alert.title || 'Untitled Alert',
          description: alert.description || '',
          link: alert.link || '',
          pubDate: dateString,
          publishedDate: dateString,
          feedName: alert.source?.name || 'Unknown Feed',
          feedCategory: alert.category || 'general-security',
          feedId: alert.rssFeedId || feedId
        });
      }
    });
    
    setAllFeeds(Array.from(feedsMap.values()));
    setLastUpdate(new Date().toISOString());

    if (import.meta.env.DEV) {
      console.log(`[Privacy Radar] Processed ${tacticalAlerts.length} tactical alerts from ${feedsMap.size} feeds`);
      console.log('[Privacy Radar] Total items across all feeds:', Array.from(feedsMap.values()).reduce((sum, feed) => sum + feed.items.length, 0));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storeAlerts]); // setLastUpdate is stable and doesn't need to be in dependencies
  
  // Manual refresh - triggers service to fetch new feeds
  const refreshFeeds = useCallback(async () => {
    if (isRefreshing) {
      if (import.meta.env.DEV) {
        console.warn('[Privacy Radar] Already refreshing, skipping duplicate request');
      }
      return;
    }

    setIsRefreshing(true);
    setLoadingProgress({ status: 'starting', totalFeeds: 0, completed: 0 });
    
    try {
      if (import.meta.env.DEV) {
        console.log('[Privacy Radar] Triggering RSS alert service refresh...');
      }
      
      // Trigger the service to fetch new feeds
      await rssAlertService.processNow();
      
      // Process will happen automatically when store updates
      const currentStore = useCautionStore.getState();
      setLoadingProgress({ status: 'complete', totalAlerts: currentStore.alerts.length });
      
      // Clear progress after a short delay
      setTimeout(() => {
        setLoadingProgress(null);
      }, 2000);
    } catch (error) {
      console.error('[Privacy Radar] Error refreshing feeds:', error);
      setLoadingProgress({ status: 'error', error: error.message || 'Failed to refresh feeds' });
      setTimeout(() => {
        setLoadingProgress(null);
      }, 5000);
    } finally {
      setIsRefreshing(false);
    }
  }, [isRefreshing]);
  
  // Process alerts from store when they change - FIXED: Direct dependency on storeAlerts
  useEffect(() => {
    processStoreAlerts();
  }, [storeAlerts, processStoreAlerts]);
  
  // Initial load - trigger fetch if store is empty, otherwise process existing alerts
  useEffect(() => {
    if (storeAlerts.length === 0) {
      // If no alerts in store, trigger initial fetch
      if (import.meta.env.DEV) {
        console.log('[Privacy Radar] No alerts in store, triggering initial fetch...');
      }
      rssAlertService.processNow().catch(error => {
        console.error('[Privacy Radar] Error on initial fetch:', error);
      });
    } else {
      // If we have alerts, process them immediately
      processStoreAlerts();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run on mount
  
  // Note: Auto-refresh is handled by rssAlertService (runs every hour)
  // This component will automatically update when store changes
  
  // Calculate tactical severity from content (immediate action focus)
  const calculateSeverity = (item) => {
    const text = `${item.title} ${item.description}`.toLowerCase();
    
    // CRITICAL - Immediate action required (active threats)
    const criticalKeywords = [
      'breach', 'breached', 'hacked', 'exposed', 'leaked',
      'zero-day', 'ransomware', 'exploit', 'compromised',
      'urgent', 'immediate', 'critical alert'
    ];
    
    // HIGH - Quick action recommended (vulnerabilities)
    const highKeywords = [
      'vulnerability', 'vulnerable', 'patch', 'update now',
      'warning', 'alert', 'security flaw', 'phishing',
      'scam', 'malware', 'attack'
    ];
    
    // MEDIUM - Awareness needed (potential risks)
    const mediumKeywords = [
      'security', 'risk', 'threat', 'suspicious',
      'investigation', 'reported', 'detected'
    ];
    
    if (criticalKeywords.some(k => text.includes(k))) return 'critical';
    if (highKeywords.some(k => text.includes(k))) return 'high';
    if (mediumKeywords.some(k => text.includes(k))) return 'medium';
    return 'low';
  };
  
  // Check if item is relevant to user's services
  const isRelevantToUser = (item) => {
    if (selectedServices.length === 0) return true;
    
    const text = `${item.title} ${item.description}`.toLowerCase();
    
    return selectedServices.some(serviceId => {
      // Try enhanced service first, fallback to basic
      let service = null;
      try {
        service = getEnhancedService(serviceId);
      } catch (error) {
        service = serviceCatalog.find(s => s.id === serviceId);
      }
      if (!service) {
        service = serviceCatalog.find(s => s.id === serviceId);
      }
      if (!service) return false;
      
      const keywords = [
        service.name.toLowerCase(),
        ...(service.keywords || [])
      ];
      
      return keywords.some(keyword => text.includes(keyword));
    });
  };
  
  // Helper function to normalize title for comparison (reused from processStoreAlerts)
  const normalizeTitle = useCallback((title) => {
    if (!title) return '';
    return title.toLowerCase().trim().replace(/\s+/g, ' ').substring(0, 100);
  }, []);
  
  // Base tactical items (all items, no time filter) - for Threat Radar Chart
  // This shows the overall distribution across all categories before user applies filters
  const unfilteredTacticalItems = useMemo(() => {
    // Track seen item IDs and titles to prevent duplicates
    const seenIds = new Set();
    const seenTitles = new Set();
    
    return allFeeds.flatMap(feed => 
      feed.items
        .filter(item => {
          // Deduplicate: skip if we've already seen this item ID
          if (seenIds.has(item.id)) {
            return false;
          }
          
          // Deduplicate: skip if we've already seen this normalized title
          const normalizedTitle = normalizeTitle(item.title);
          if (normalizedTitle && seenTitles.has(normalizedTitle)) {
            return false;
          }
          
          seenIds.add(item.id);
          if (normalizedTitle) {
            seenTitles.add(normalizedTitle);
          }
          
          // Validate date exists and is valid
          const dateString = item.pubDate || item.publishedDate;
          if (!dateString) {
            return false; // Skip items without dates
          }
          
          const itemDate = new Date(dateString);
          if (isNaN(itemDate.getTime())) {
            return false; // Skip items with invalid dates
          }
          
          // Include all items regardless of age (removed 48-hour filter)
          return true;
        })
        .map(item => {
          // Parse date - we know it's valid from filter above
          const dateString = item.pubDate || item.publishedDate;
          const itemDate = new Date(dateString);
          
          return {
            ...item,
            severity: calculateSeverity(item),
            isRelevant: isRelevantToUser(item),
            isNew: lastVisit ? itemDate > new Date(lastVisit) : true,
            isRead: readItems.includes(item.id),
            isTactical: true,
            hoursAgo: Math.floor((Date.now() - itemDate.getTime()) / (60 * 60 * 1000))
          };
        })
    );
  }, [allFeeds, selectedServices, lastVisit, readItems, normalizeTitle]);

  // Filter and sort items - shows all latest data + user filters
  const filteredItems = useMemo(() => {
    // Start with unfiltered tactical items
    let items = [...unfilteredTacticalItems];
    
    // Apply user filters (use debounced search query for performance)
    if (debouncedSearchQuery) {
      const query = debouncedSearchQuery.toLowerCase();
      items = items.filter(item => 
        item.title.toLowerCase().includes(query) ||
        item.description.toLowerCase().includes(query)
      );
    }
    
    if (categoryFilter !== 'all') {
      items = items.filter(item => item.feedCategory === categoryFilter);
    }
    
    if (severityFilter !== 'all') {
      items = items.filter(item => item.severity === severityFilter);
    }
    
    // Sort: relevant first, then by date
    items.sort((a, b) => {
      if (a.isRelevant !== b.isRelevant) return b.isRelevant - a.isRelevant;
      return new Date(b.pubDate) - new Date(a.pubDate);
    });
    
    return compact ? items.slice(0, maxItems) : items;
  }, [unfilteredTacticalItems, debouncedSearchQuery, categoryFilter, severityFilter, compact, maxItems]);
  
  // Performance: Show only top 10 alerts initially, expand to show all if needed
  // Must be defined after filteredItems
  const displayedItems = useMemo(() => {
    if (showAllAlerts || filteredItems.length <= INITIAL_ALERTS_LIMIT) {
      return filteredItems;
    }
    return filteredItems.slice(0, INITIAL_ALERTS_LIMIT);
  }, [filteredItems, showAllAlerts]);
  
  // Validate and sanitize URL
  const isValidUrl = useCallback((url) => {
    if (!url || typeof url !== 'string' || url.trim() === '') {
      return false;
    }
    
    try {
      const urlObj = new URL(url.trim());
      // Only allow http and https protocols
      return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
    } catch {
      // If URL parsing fails, check if it's a relative URL or malformed
      // Allow relative URLs starting with / or #
      if (url.trim().startsWith('/') || url.trim().startsWith('#')) {
        return true;
      }
      return false;
    }
  }, []);
  
  // Get safe URL or return null
  const getSafeUrl = useCallback((url) => {
    if (!url || typeof url !== 'string' || url.trim() === '') {
      return null;
    }
    
    const trimmedUrl = url.trim();
    
    // If it's already a valid URL, return it
    if (isValidUrl(trimmedUrl)) {
      return trimmedUrl;
    }
    
    // If it's a relative URL, return it
    if (trimmedUrl.startsWith('/') || trimmedUrl.startsWith('#')) {
      return trimmedUrl;
    }
    
    // Try to fix common issues (missing protocol)
    if (trimmedUrl.includes('.') && !trimmedUrl.startsWith('http')) {
      try {
        const urlWithProtocol = `https://${trimmedUrl}`;
        if (isValidUrl(urlWithProtocol)) {
          return urlWithProtocol;
        }
      } catch {
        // Ignore
      }
    }
    
    return null;
  }, [isValidUrl]);
  
  // Mark item as read
  const markAsRead = (itemId) => {
    if (!readItems.includes(itemId)) {
      setReadItems([...readItems, itemId]);
    }
  };
  
  // Get category icon
  const getCategoryIcon = (category) => {
    const icons = {
      'general-security': Shield,
      'data-breach': AlertTriangle,
      'privacy-laws': Scale,
      'phishing': Target,
      'scams': AlertTriangle,
      'device-security': Radio,
      'regulation': Building2,
      'enforcement': Hammer,
      'news': FileText
    };
    return icons[category] || Bell;
  };
  
  // Get severity color
  const getSeverityColor = (severity) => {
    const colors = {
      critical: 'bg-red-100 dark:bg-red-900/20 border-red-500 text-red-700 dark:text-red-300',
      high: 'bg-orange-100 dark:bg-orange-900/20 border-orange-500 text-orange-700 dark:text-orange-300',
      medium: 'bg-yellow-100 dark:bg-yellow-900/20 border-yellow-500 text-yellow-700 dark:text-yellow-300',
      low: 'bg-blue-100 dark:bg-blue-900/20 border-blue-500 text-blue-700 dark:text-blue-300'
    };
    return colors[severity] || colors.low;
  };
  
  // Get severity badge
  const getSeverityBadge = (severity) => {
    const badges = {
      critical: <span className="px-2 py-0.5 rounded text-xs font-bold bg-red-600 text-white">🚨 CRITICAL</span>,
      high: <span className="px-2 py-0.5 rounded text-xs font-bold bg-orange-600 text-white">⚠️ HIGH</span>,
      medium: <span className="px-2 py-0.5 rounded text-xs font-medium bg-yellow-600 text-white">⚡ MEDIUM</span>,
      low: <span className="px-2 py-0.5 rounded text-xs font-medium bg-blue-600 text-white">ℹ️ LOW</span>
    };
    return badges[severity] || badges.low;
  };
  
  // Stats - includes severity counts to avoid repeated filtering
  const stats = useMemo(() => {
    const newItems = filteredItems.filter(item => item.isNew && !item.isRead).length;
    const relevantItems = filteredItems.filter(item => item.isRelevant).length;
    const criticalItems = filteredItems.filter(item => item.severity === 'critical').length;
    const highItems = filteredItems.filter(item => item.severity === 'high').length;
    const mediumItems = filteredItems.filter(item => item.severity === 'medium').length;
    const lowItems = filteredItems.filter(item => item.severity === 'low').length;
    
    return { newItems, relevantItems, criticalItems, highItems, mediumItems, lowItems };
  }, [filteredItems]);
  
  // Debug statistics - track alerts at each filtering stage
  const debugStats = useMemo(() => {
    const totalStoreAlerts = Array.isArray(storeAlerts) ? storeAlerts.length : 0;
    
    // Convert to RSS alerts
    const rssAlerts = storeAlerts && Array.isArray(storeAlerts) 
      ? cautionAlertsToRSSAlerts(storeAlerts) 
      : [];
    
    // After category filtering
    const tacticalAlerts = filterRSSAlertsByCategories(rssAlerts, TACTICAL_CATEGORIES);
    
    // After deduplication (simulate the process)
    const seenIds = new Set();
    const seenTitles = new Set();
    const normalizeTitle = (title) => {
      if (!title) return '';
      return title.toLowerCase().trim().replace(/\s+/g, ' ').substring(0, 100);
    };
    
    const deduplicatedAlerts = tacticalAlerts.filter(alert => {
      if (!alert || !alert.id) return false;
      if (seenIds.has(alert.id)) return false;
      const normalizedTitle = normalizeTitle(alert.title);
      if (normalizedTitle && seenTitles.has(normalizedTitle)) return false;
      seenIds.add(alert.id);
      if (normalizedTitle) seenTitles.add(normalizedTitle);
      
      // Check date validity
      const dateString = alert.publishedDate || alert.pubDate;
      if (!dateString) return false;
      const testDate = new Date(dateString);
      return !isNaN(testDate.getTime());
    });
    
    // After user filters
    let afterUserFilters = [...unfilteredTacticalItems];
    if (debouncedSearchQuery) {
      const query = debouncedSearchQuery.toLowerCase();
      afterUserFilters = afterUserFilters.filter(item => 
        item.title.toLowerCase().includes(query) ||
        item.description.toLowerCase().includes(query)
      );
    }
    if (categoryFilter !== 'all') {
      afterUserFilters = afterUserFilters.filter(item => item.feedCategory === categoryFilter);
    }
    if (severityFilter !== 'all') {
      afterUserFilters = afterUserFilters.filter(item => item.severity === severityFilter);
    }
    
    // Category breakdown
    const categoryBreakdown = {};
    deduplicatedAlerts.forEach(alert => {
      const cat = alert.category || 'unknown';
      categoryBreakdown[cat] = (categoryBreakdown[cat] || 0) + 1;
    });
    
    // Feed breakdown
    const feedBreakdown = {};
    allFeeds.forEach(feed => {
      feedBreakdown[feed.name] = feed.items.length;
    });
    
    return {
      totalStoreAlerts,
      totalRSSAlerts: rssAlerts.length,
      afterCategoryFilter: tacticalAlerts.length,
      afterDeduplication: deduplicatedAlerts.length,
      afterUserFilters: afterUserFilters.length,
      finalDisplayed: filteredItems.length,
      categoryBreakdown,
      feedBreakdown,
      totalFeeds: allFeeds.length
    };
  }, [storeAlerts, unfilteredTacticalItems, debouncedSearchQuery, categoryFilter, severityFilter, filteredItems, allFeeds]);
  
  // Categories for filter
  const categories = useMemo(() => {
    const cats = new Set(allFeeds.map(f => f.category).filter(Boolean));
    return ['all', ...Array.from(cats)];
  }, [allFeeds]);
  
  if (compact) {
    return (
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 p-4 sm:p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Radar className="w-5 h-5 text-red-600 dark:text-red-400" />
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Privacy Radar</h3>
          </div>
          {stats.newItems > 0 && (
            <span className="px-2 py-1 bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-xs font-bold rounded-full">
              {stats.newItems} New
            </span>
          )}
        </div>
        
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <RefreshCw className="w-6 h-6 animate-spin text-gray-400" />
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            <Radio className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p className="text-sm">{t('privacyRadar.noThreatsDetected')}</p>
          </div>
        ) : (
          <>
            <div className="space-y-3 mb-4">
              {filteredItems.map((item) => {
                const CategoryIcon = getCategoryIcon(item.feedCategory);
                return (
                  <a
                    key={item.id}
                    href={getSafeUrl(item.link) || '#'}
                    target={getSafeUrl(item.link) ? "_blank" : undefined}
                    rel={getSafeUrl(item.link) ? "noopener noreferrer" : undefined}
                    onClick={(e) => {
                      e.stopPropagation();
                      markAsRead(item.id);
                      const safeUrl = getSafeUrl(item.link);
                      if (!safeUrl || safeUrl === '#') {
                        e.preventDefault();
                      }
                    }}
                    className={`block p-3 rounded-lg border-l-4 transition-all hover:shadow-md ${
                      item.isRead 
                        ? 'bg-gray-50 dark:bg-slate-700/50 border-gray-300 dark:border-slate-600' 
                        : getSeverityColor(item.severity)
                    }`}
                  >
                    <div className="flex items-start gap-2">
                      <CategoryIcon className="w-4 h-4 mt-1 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          {getSeverityBadge(item.severity)}
                          {item.isRelevant && (
                            <span className="px-2 py-0.5 rounded text-xs font-medium bg-purple-100 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300">
                              Relevant
                            </span>
                          )}
                        </div>
                        <h4 className="font-semibold text-sm text-gray-900 dark:text-white mb-1 line-clamp-2">
                          {item.title}
                        </h4>
                        {(() => {
                          const detectedRegulations = detectRegulations(item);
                          return detectedRegulations.length > 0 && (
                            <div className="flex flex-wrap gap-1 mb-1">
                              {detectedRegulations.map(regulation => (
                                <span
                                  key={regulation}
                                  className="px-1.5 py-0.5 rounded text-xs font-medium bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300"
                                  title={`${regulation} related`}
                                >
                                  {regulation}
                                </span>
                              ))}
                            </div>
                          );
                        })()}
                        <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                          <span>{item.feedName}</span>
                          <span>•</span>
                          <Clock className="w-3 h-3" />
                          <span>{new Date(item.pubDate).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                  </a>
                );
              })}
            </div>
            
            <button
              onClick={(e) => {
                e.stopPropagation();
                navigate('/privacy-radar');
              }}
              className="w-full px-4 py-2 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium flex items-center justify-center gap-2"
            >
              <Radar className="w-4 h-4" />
              {t('privacyRadar.viewFullRadar')}
            </button>
          </>
        )}
      </div>
    );
  }
  
  // Full page view
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
      <SEOHead
        title="Privacy Radar - Real-time Security Threat Monitoring | SocialCaution"
        description="Monitor real-time security threats, active data breaches, phishing campaigns, and vulnerabilities affecting the services you use. Immediate alerts for services in your Service Catalog."
        keywords="privacy radar, security threats, data breach monitoring, phishing alerts, real-time threats, service monitoring, service security"
      />
      
      <section className="pt-8 sm:pt-12 pb-8 sm:pb-12 bg-gradient-to-br from-gray-50 via-red-50/30 to-gray-50 dark:from-slate-900 dark:via-red-950/20 dark:to-slate-900">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-4 flex-wrap">
              <Radar className="w-8 h-8 text-red-600 dark:text-red-400" />
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">
                {t('privacyRadar.title')}
              </h1>
              {/* Live indicator - Moved next to heading */}
              <span className="px-3 py-1 bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300 text-xs font-bold rounded-full animate-pulse inline-flex items-center gap-2">
                <div className="w-2 h-2 bg-red-600 rounded-full animate-pulse"></div>
                LIVE
              </span>
            </div>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              {t('privacyRadar.privacyRadarDescription')}
            </p>
          </div>
          
          {/* Simplified Exposure Cards - Compact horizontal layout - Moved above search */}
          {overallPrivacyScore && selectedServices.length > 0 && (
            <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mb-3">
              {/* Privacy Exposure Score Card */}
              <div className="flex items-center gap-1.5 bg-white dark:bg-slate-800 rounded-lg px-2.5 py-1.5 shadow-sm border border-gray-200 dark:border-slate-700">
                <div className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-gradient-to-br from-red-500 to-pink-500 flex-shrink-0">
                  <div className="text-xs font-bold text-white">{overallPrivacyScore.score}</div>
                </div>
                <div>
                  <div className="text-[9px] font-semibold text-gray-900 dark:text-white leading-tight">{t('privacyRadar.privacyExposureScore')}</div>
                  {privacyTrends.length > 7 && (
                    <div className="flex items-center gap-0.5 text-[8px] mt-0.5">
                      {privacyTrends[privacyTrends.length - 1].score > privacyTrends[privacyTrends.length - 8].score ? (
                        <>
                          <TrendingUp className="h-2 w-2 text-green-600" />
                          <span className="text-green-600">
                            +{Math.round(privacyTrends[privacyTrends.length - 1].score - privacyTrends[privacyTrends.length - 8].score)} {t('privacyRadar.thisWeek')}
                          </span>
                        </>
                      ) : (
                        <>
                          <TrendingUp className="h-2 w-2 text-red-600 rotate-180" />
                          <span className="text-red-600">
                            {Math.round(privacyTrends[privacyTrends.length - 1].score - privacyTrends[privacyTrends.length - 8].score)} {t('privacyRadar.thisWeek')}
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
                <div className="text-[9px] font-medium text-red-600 dark:text-red-400">{t('privacyRadar.highRisk')}</div>
              </div>

              {/* Medium Risk Card */}
              <div className="flex items-center gap-1.5 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg px-2.5 py-1.5 shadow-sm border border-yellow-200 dark:border-yellow-800">
                <div className="text-base font-bold text-yellow-700 dark:text-yellow-400">{overallPrivacyScore.mediumRiskCount}</div>
                <div className="text-[9px] font-medium text-yellow-600 dark:text-yellow-400">{t('privacyRadar.mediumRisk')}</div>
              </div>

              {/* Low Risk Card */}
              <div className="flex items-center gap-1.5 bg-green-50 dark:bg-green-900/20 rounded-lg px-2.5 py-1.5 shadow-sm border border-green-200 dark:border-green-800">
                <div className="text-base font-bold text-green-700 dark:text-green-400">{overallPrivacyScore.lowRiskCount}</div>
                <div className="text-[9px] font-medium text-green-600 dark:text-green-400">{t('privacyRadar.lowRisk')}</div>
              </div>

              {/* Known Breaches Card */}
              {overallPrivacyScore.totalBreaches > 0 && (
                <div className="flex items-center gap-2 bg-red-100 dark:bg-red-900/30 rounded-lg px-3 py-1.5 shadow-md border-2 border-red-500 dark:border-red-600">
                  <AlertTriangle className="w-4 h-4 text-red-700 dark:text-red-300 flex-shrink-0" />
                  <span className="text-[10px] font-semibold text-red-900 dark:text-red-100 whitespace-nowrap">
                    {t('privacyRadar.knownBreachesInServices', { count: overallPrivacyScore.totalBreaches, plural: overallPrivacyScore.totalBreaches > 1 ? 'es' : '' })}
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
          )}
          
          {/* Search Box - Moved below metrics for better visual balance */}
          <div className="max-w-2xl mx-auto mb-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t('privacyRadar.searchPlaceholder')}
                aria-label="Search privacy alerts"
                className="w-full pl-12 pr-4 py-3 bg-white dark:bg-slate-800 border-2 border-gray-300 dark:border-slate-600 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 shadow-sm"
              />
            </div>
          </div>
        </div>
      </section>
      
      <section className="py-8 bg-white dark:bg-slate-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Controls and Filters - Reorganized for clarity */}
        <div key="privacy-radar-filters" className="sticky top-4 z-10 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 p-4 mb-4">
          {/* Top Row: Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 mb-4 justify-end">
            {/* Refresh Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                refreshFeeds();
              }}
              disabled={isRefreshing}
              aria-label="Refresh alerts"
              aria-busy={isRefreshing}
              className="px-3 py-1.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center gap-1.5 disabled:opacity-50 text-sm"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
              <span>{isRefreshing ? t('privacyRadar.refreshing') : t('privacyRadar.refresh')}</span>
            </button>
          </div>
          
          {/* Filters Section - Category and Severity */}
          <div className="mb-4">
            <div className="flex items-center gap-2 mb-3">
              <Filter className="w-3.5 h-3.5 text-gray-500 dark:text-gray-400" />
              <h3 className="text-xs font-semibold text-gray-700 dark:text-gray-300">{t('privacyRadar.filters')}</h3>
            </div>
            
            {/* Category Filter Buttons */}
            <div className="mb-3">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs text-gray-600 dark:text-gray-400">{t('privacyRadar.filterByCategory')}:</span>
              </div>
              <div className="flex gap-1.5 flex-wrap">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setCategoryFilter('all');
                }}
                aria-label="Show all categories"
                aria-pressed={categoryFilter === 'all'}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
                  categoryFilter === 'all'
                    ? 'bg-red-600 text-white shadow-md'
                    : 'bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-600'
                }`}
              >
                <Shield className="w-3.5 h-3.5" />
                {t('privacyRadar.allCategories')}
              </button>
              
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setCategoryFilter('data-breach');
                }}
                aria-label="Filter by data breaches"
                aria-pressed={categoryFilter === 'data-breach'}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
                  categoryFilter === 'data-breach'
                    ? 'bg-red-600 text-white shadow-md'
                    : 'bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-600'
                }`}
              >
                <AlertTriangle className="w-3.5 h-3.5" />
                {t('privacyRadar.categories.dataBreaches')}
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setCategoryFilter('phishing');
                }}
                aria-label="Filter by phishing"
                aria-pressed={categoryFilter === 'phishing'}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
                  categoryFilter === 'phishing'
                    ? 'bg-red-600 text-white shadow-md'
                    : 'bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-600'
                }`}
              >
                <Target className="w-3.5 h-3.5" />
                {t('privacyRadar.categories.phishing')}
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setCategoryFilter('scams');
                }}
                aria-label="Filter by scams"
                aria-pressed={categoryFilter === 'scams'}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
                  categoryFilter === 'scams'
                    ? 'bg-red-600 text-white shadow-md'
                    : 'bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-600'
                }`}
              >
                <AlertTriangle className="w-3.5 h-3.5" />
                {t('privacyRadar.categories.scams')}
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setCategoryFilter('device-security');
                }}
                aria-label="Filter by device security"
                aria-pressed={categoryFilter === 'device-security'}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
                  categoryFilter === 'device-security'
                    ? 'bg-red-600 text-white shadow-md'
                    : 'bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-600'
                }`}
              >
                <Radio className="w-3.5 h-3.5" />
                {t('privacyRadar.categories.deviceSecurity')}
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setCategoryFilter('general-security');
                }}
                aria-label="Filter by general security"
                aria-pressed={categoryFilter === 'general-security'}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
                  categoryFilter === 'general-security'
                    ? 'bg-red-600 text-white shadow-md'
                    : 'bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-600'
                }`}
              >
                <Shield className="w-3.5 h-3.5" />
                {t('privacyRadar.categories.generalSecurity')}
              </button>
            </div>
            
            </div>
            
            {/* Active filter indicator */}
            {categoryFilter !== 'all' && (
              <div className="mt-2 flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
                <span>
                  {t('privacyRadar.showing')} <strong className="text-red-600 dark:text-red-400">
                    {categoryFilter.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </strong>
                </span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setCategoryFilter('all');
                  }}
                  aria-label="Clear category filter"
                  className="ml-1 text-red-600 dark:text-red-400 hover:underline text-xs"
                >
                  {t('privacyRadar.clearFilter')}
                </button>
              </div>
            )}
            </div>
            
            {/* Severity Filter - Always Visible */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs text-gray-600 dark:text-gray-400">{t('privacyRadar.severity')}:</span>
              </div>
              <select
                value={severityFilter}
                onChange={(e) => setSeverityFilter(e.target.value)}
                className="w-full sm:w-auto px-3 py-2 bg-gray-50 dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded-lg text-sm"
              >
                <option value="all">{t('privacyRadar.allSeverities')}</option>
                <option value="critical">{t('privacyRadar.critical')}</option>
                <option value="high">{t('privacyRadar.high')}</option>
                <option value="medium">{t('privacyRadar.medium')}</option>
                <option value="low">{t('privacyRadar.low')}</option>
              </select>
            </div>
          </div>
          
          {/* Metadata Section - Less Prominent */}
          <div className="mt-4 pt-3 border-t border-gray-200 dark:border-slate-700">
            <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
              {lastUpdate && (
                <div className="flex items-center gap-2">
                  <Clock className="w-3 h-3" />
                  <span>Last updated: {new Date(lastUpdate).toLocaleString()}</span>
                </div>
              )}
              
              {/* Debug Information - Collapsible, Right Aligned */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowDebugInfo(!showDebugInfo);
                }}
                aria-label={showDebugInfo ? 'Hide debug info' : 'Show debug info'}
                aria-expanded={showDebugInfo}
                className="flex items-center gap-1 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <Info className="w-3 h-3" />
                <span>Debug</span>
                <ChevronDown className={`w-3 h-3 transition-transform ${showDebugInfo ? 'rotate-180' : ''}`} />
              </button>
            </div>
            
            {showDebugInfo && (
              <div className="mt-3 p-3 bg-gray-50 dark:bg-slate-900 rounded-lg border border-gray-200 dark:border-slate-700 text-xs space-y-2">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <span className="font-semibold text-gray-700 dark:text-gray-300">Store Alerts:</span>
                    <span className="ml-2 text-gray-600 dark:text-gray-400">{debugStats.totalStoreAlerts}</span>
                  </div>
                  <div>
                    <span className="font-semibold text-gray-700 dark:text-gray-300">RSS Alerts:</span>
                    <span className="ml-2 text-gray-600 dark:text-gray-400">{debugStats.totalRSSAlerts}</span>
                  </div>
                  <div>
                    <span className="font-semibold text-gray-700 dark:text-gray-300">After Category Filter:</span>
                    <span className="ml-2 text-gray-600 dark:text-gray-400">{debugStats.afterCategoryFilter}</span>
                  </div>
                  <div>
                    <span className="font-semibold text-gray-700 dark:text-gray-300">After Deduplication:</span>
                    <span className="ml-2 text-gray-600 dark:text-gray-400">{debugStats.afterDeduplication}</span>
                  </div>
                  <div>
                    <span className="font-semibold text-gray-700 dark:text-gray-300">After User Filters:</span>
                    <span className="ml-2 text-gray-600 dark:text-gray-400">{debugStats.afterUserFilters}</span>
                  </div>
                  <div>
                    <span className="font-semibold text-gray-700 dark:text-gray-300">Final Displayed:</span>
                    <span className="ml-2 text-red-600 dark:text-red-400 font-bold">{debugStats.finalDisplayed}</span>
                  </div>
                </div>
                
                {Object.keys(debugStats.categoryBreakdown).length > 0 && (
                  <div className="mt-3 pt-3 border-t border-gray-200 dark:border-slate-700">
                    <div className="font-semibold text-gray-700 dark:text-gray-300 mb-2">By Category:</div>
                    <div className="space-y-1">
                      {Object.entries(debugStats.categoryBreakdown).map(([cat, count]) => (
                        <div key={cat} className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400">{cat}:</span>
                          <span className="font-medium">{count}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {Object.keys(debugStats.feedBreakdown).length > 0 && (
                  <div className="mt-3 pt-3 border-t border-gray-200 dark:border-slate-700">
                    <div className="font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      By Feed ({debugStats.totalFeeds} feeds):
                    </div>
                    <div className="space-y-1 max-h-32 overflow-y-auto">
                      {Object.entries(debugStats.feedBreakdown).map(([feed, count]) => (
                        <div key={feed} className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400 truncate">{feed}:</span>
                          <span className="font-medium ml-2">{count}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {debugStats.totalStoreAlerts === 0 && (
                  <div className="mt-3 p-2 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded text-yellow-800 dark:text-yellow-300">
                    ⚠️ No alerts in store. Click "Refresh" to fetch feeds.
                  </div>
                )}
                
                {debugStats.afterCategoryFilter === 0 && debugStats.totalRSSAlerts > 0 && (
                  <div className="mt-3 p-2 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded text-orange-800 dark:text-orange-300">
                    ⚠️ No alerts match tactical categories. RSS feeds may contain only strategic categories.
                  </div>
                )}
              </div>
            )}
          </div>
        
        {/* Alerts List */}
        {isLoading && allFeeds.length === 0 ? (
          <div className="flex items-center justify-center py-16 min-h-[200px]">
            <div className="text-center max-w-md">
              <RefreshCw className="w-12 h-12 animate-spin text-red-600 dark:text-red-400 mx-auto mb-4" />
              <p className="text-gray-600 dark:text-gray-300 mb-2">{t('privacyRadar.loadingAlerts')}</p>
              {loadingProgress && (
                <div className="mt-4 space-y-2">
                  {loadingProgress.status === 'starting' && (
                    <p className="text-sm text-gray-500 dark:text-gray-400">{t('privacyRadar.initializingFeedProcessor')}</p>
                  )}
                  {loadingProgress.status === 'progress' && (
                    <>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {t('privacyRadar.processingFeeds', { completed: loadingProgress.completed, total: loadingProgress.totalFeeds || '?' })}
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
                    <div className="space-y-2">
                      <p className="text-sm text-red-600 dark:text-red-400">
                        Error: {loadingProgress.error || 'Failed to load feeds'}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Showing cached or empty results. You can still use other features.
                      </p>
                      <button
                        onClick={() => {
                          setLoadingProgress(null);
                          setIsLoading(false);
                          refreshFeeds();
                        }}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
                      >
                        {t('privacyRadar.retry')}
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
                <span className="text-sm text-blue-700 dark:text-blue-300">{t('privacyRadar.refreshingAlerts')}</span>
              </div>
            )}
            
            {filteredItems.length === 0 ? (
              <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 p-12 text-center">
                <Radio className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{t('privacyRadar.noAlertsFound')}</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  {searchQuery || categoryFilter !== 'all' || severityFilter !== 'all'
                    ? t('privacyRadar.tryAdjustingFilters')
                    : t('privacyRadar.allClear')}
                </p>
                {selectedServices.length === 0 && !searchQuery && categoryFilter === 'all' && severityFilter === 'all' && (
                  <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                    <p className="text-sm text-blue-800 dark:text-blue-300 mb-2">
                      {t('privacyRadar.tipSelectServices')}
                    </p>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate('/service-catalog');
                      }}
                      aria-label="Go to Service Catalog"
                      className="text-sm px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center gap-2"
                    >
                      <Shield className="w-4 h-4" />
                      {t('privacyRadar.goToServiceCatalog')}
                    </button>
                  </div>
                )}
                {(searchQuery || categoryFilter !== 'all' || severityFilter !== 'all') && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSearchQuery('');
                      setCategoryFilter('all');
                      setSeverityFilter('all');
                    }}
                    aria-label="Clear all filters"
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  >
                    {t('privacyRadar.clearFilters')}
                  </button>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                {displayedItems.map((item) => {
              const CategoryIcon = getCategoryIcon(item.feedCategory);
              return (
                <div
                  key={item.id}
                  className={`bg-white dark:bg-slate-800 rounded-xl shadow-sm border-l-4 p-4 sm:p-6 transition-all ${
                    item.isRead 
                      ? 'border-gray-300 dark:border-slate-600' 
                      : 'border-red-500 hover:shadow-md'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className={`p-3 rounded-lg flex-shrink-0 ${
                      item.severity === 'critical' ? 'bg-red-100 dark:bg-red-900/20' :
                      item.severity === 'high' ? 'bg-orange-100 dark:bg-orange-900/20' :
                      item.severity === 'medium' ? 'bg-yellow-100 dark:bg-yellow-900/20' :
                      'bg-blue-100 dark:bg-blue-900/20'
                    }`}>
                      <CategoryIcon className={`w-6 h-6 ${
                        item.severity === 'critical' ? 'text-red-600 dark:text-red-400' :
                        item.severity === 'high' ? 'text-orange-600 dark:text-orange-400' :
                        item.severity === 'medium' ? 'text-yellow-600 dark:text-yellow-400' :
                        'text-blue-600 dark:text-blue-400'
                      }`} />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        {getSeverityBadge(item.severity)}
                        {item.isRelevant && (
                          <span className="px-2 py-0.5 rounded text-xs font-medium bg-purple-100 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300">
                            ⭐ {t('privacyRadar.relevant')}
                          </span>
                        )}
                        {item.isNew && !item.isRead && (
                          <span className="px-2 py-0.5 rounded text-xs font-medium bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300">
                            🆕 {t('privacyRadar.new')}
                          </span>
                        )}
                      </div>
                      
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                        {item.title}
                      </h3>
                      
                      {item.description && (
                        <p className="text-sm text-gray-600 dark:text-gray-300 mb-3 line-clamp-2">
                          {item.description.replace(/<[^>]*>/g, '')}
                        </p>
                      )}
                      
                      {/* Regulation Badges */}
                      {(() => {
                        const detectedRegulations = detectRegulations(item);
                        return detectedRegulations.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 mb-3">
                            {detectedRegulations.map(regulation => (
                              <span
                                key={regulation}
                                className="px-2 py-0.5 rounded text-xs font-medium bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300"
                                title={`${regulation} related`}
                              >
                                {regulation}
                              </span>
                            ))}
                          </div>
                        );
                      })()}
                      
                      <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                        <span className="font-medium">{item.feedName}</span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {item.hoursAgo < 1 ? 'Just now' : 
                           item.hoursAgo === 1 ? '1 hour ago' :
                           item.hoursAgo < 24 ? `${item.hoursAgo} hours ago` :
                           `${Math.floor(item.hoursAgo / 24)} day${Math.floor(item.hoursAgo / 24) > 1 ? 's' : ''} ago`}
                        </span>
                        {item.hoursAgo < 6 && (
                          <span className="px-2 py-0.5 bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-300 rounded text-xs font-medium">
                            ⚡ {t('privacyRadar.recent')}
                          </span>
                        )}
                      </div>
                      
                      <div className="mt-3 flex gap-2">
                        {getSafeUrl(item.link) ? (
                          <a
                            href={getSafeUrl(item.link)}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => {
                              e.stopPropagation();
                              markAsRead(item.id);
                            }}
                            aria-label={`Read more about ${item.title}`}
                            className="inline-flex items-center gap-1 px-3 py-1.5 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 transition-colors"
                          >
                            {t('privacyRadar.readMore')}
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        ) : (
                          <span 
                            className="inline-flex items-center gap-1 px-3 py-1.5 bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 text-sm rounded-lg cursor-not-allowed"
                            title="Link unavailable or invalid"
                          >
                            {t('privacyRadar.readMore')}
                            <X className="w-3 h-3" />
                          </span>
                        )}
                        {!item.isRead && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              markAsRead(item.id);
                            }}
                            aria-label={`Mark "${item.title}" as read`}
                            className="inline-flex items-center gap-1 px-3 py-1.5 bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 text-sm rounded-lg hover:bg-gray-200 dark:hover:bg-slate-600 transition-colors"
                          >
                            <CheckCircle className="w-3 h-3" />
                            {t('privacyRadar.markAsRead')}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
                })}
                
                {/* Show More/Less Button - Only show if there are more than INITIAL_ALERTS_LIMIT items */}
                {filteredItems.length > INITIAL_ALERTS_LIMIT && (
                  <div className="flex justify-center pt-4">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowAllAlerts(!showAllAlerts);
                      }}
                      aria-label={showAllAlerts ? 'Show fewer alerts' : 'Show all alerts'}
                      className="px-6 py-3 bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-slate-600 transition-colors font-medium flex items-center gap-2"
                    >
                      {showAllAlerts ? (
                        <>
                          <ChevronDown className="w-4 h-4 rotate-180" />
                          Show Less ({INITIAL_ALERTS_LIMIT} shown)
                        </>
                      ) : (
                        <>
                          <ChevronDown className="w-4 h-4" />
                          Show All ({filteredItems.length} total)
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>
            )}
          </>
        )}
        
        {/* Recommended Actions Section - Collapsible */}
        {filteredItems.length > 0 && (
          <div className="mt-8 bg-yellow-50 dark:bg-yellow-900/20 border-2 border-yellow-200 dark:border-yellow-800 rounded-lg p-6" style={{ backgroundColor: 'rgb(254 252 232)', borderColor: 'rgb(254 240 138)' }}>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-yellow-900 dark:text-yellow-200 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5" />
                {t('privacyRadar.recommendedActions')}
              </h3>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowRecommendedActionsDetails(!showRecommendedActionsDetails);
                }}
                aria-label={showRecommendedActionsDetails ? 'Show less' : 'Show more'}
                aria-expanded={showRecommendedActionsDetails}
                className="flex items-center gap-1 text-sm text-yellow-700 dark:text-yellow-300 hover:text-yellow-900 dark:hover:text-yellow-100 font-medium transition-colors"
              >
                <span>{showRecommendedActionsDetails ? 'Show Less' : 'Show More'}</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${showRecommendedActionsDetails ? 'rotate-180' : ''}`} />
              </button>
            </div>
            
            {/* High-Level Summary - Always Visible */}
            <div className="space-y-2 text-sm text-yellow-800 dark:text-yellow-300 mb-3">
              {/* Priority Actions Based on Alert Severity - Summary */}
              {stats.criticalItems > 0 && (
                <p className="font-semibold">• <strong>Urgent:</strong> Address {stats.criticalItems} critical privacy risk{stats.criticalItems > 1 ? 's' : ''} immediately</p>
              )}
              {stats.highItems > 0 && (
                <p>• Review {stats.highItems} high-priority threat{stats.highItems > 1 ? 's' : ''} and take preventive action</p>
              )}
              {stats.criticalItems === 0 && stats.highItems === 0 && (
                <p>• Review the alerts below and take appropriate action based on severity</p>
              )}
            </div>
            
            {/* Detailed Actions - Collapsible */}
            {showRecommendedActionsDetails && (
              <div className="space-y-2 text-sm text-yellow-800 dark:text-yellow-300 mb-4 pt-3 border-t border-yellow-300 dark:border-yellow-700">
                {/* Service-Specific Actions */}
                {filteredItems.filter(item => item.isRelevant).length > 0 && (
                  <p>• Check {filteredItems.filter(item => item.isRelevant).length} alert{filteredItems.filter(item => item.isRelevant).length > 1 ? 's' : ''} relevant to your selected services</p>
                )}
                {selectedServices.length > 0 && (
                  <p>• Review and update privacy settings for affected services in your Service Catalog</p>
                )}
                {selectedServices.length === 0 && (
                  <p>• <strong>Add services to your Service Catalog</strong> to receive personalized alerts for services you actually use</p>
                )}
                
                {/* Tool Recommendations */}
                {filteredItems.some(item => item.feedCategory === 'data-breach' || item.feedCategory === 'phishing' || item.feedCategory === 'scams') && (
                  <p>• Use the <strong>Data Broker Removal Tool</strong> to remove your information from data broker sites</p>
                )}
                <p>• Use the <strong>Personal Data Inventory</strong> to track what personal information you've shared with services</p>
                
                {/* Assessment Recommendations */}
                {(exposureScore === null || rightsScore === null) && (
                  <p>• <strong>Optional:</strong> Take privacy assessments to get personalized risk scores and recommendations</p>
                )}
                {exposureScore !== null && exposureScore > 70 && (
                  <p>• Your exposure score is high ({exposureScore}) - consider reviewing privacy settings and reducing data sharing</p>
                )}
                
                {/* General Security Best Practices */}
                <p>• Enable two-factor authentication on all critical accounts</p>
                <p>• Keep all devices and software updated with latest security patches</p>
                <p>• Be cautious of phishing attempts - verify sender identities before clicking links</p>
              </div>
            )}
            
            {/* Toolkit Recommendations - Only show when expanded */}
            {showRecommendedActionsDetails && (() => {
              const threatCategories = new Set(filteredItems.map(item => item.feedCategory));
              const recommendedTools = [];
              const seenTools = new Set(); // Prevent duplicates
              
              // Data Broker Removal - for data breaches, phishing, scams
              if (threatCategories.has('data-breach') || threatCategories.has('phishing') || threatCategories.has('scams')) {
                if (!seenTools.has('data-broker-removal')) {
                  recommendedTools.push({ name: 'Data Broker Removal Tool', path: '/tools/data-broker-removal' });
                  seenTools.add('data-broker-removal');
                }
              }
              
              // Personal Data Inventory - useful for any threat
              if (!seenTools.has('personal-data-inventory')) {
                recommendedTools.push({ name: 'Personal Data Inventory', path: '/tools/personal-data-inventory' });
                seenTools.add('personal-data-inventory');
              }
              
              // Exposure Report - for data breaches and general security
              if (threatCategories.has('data-breach') || threatCategories.has('general-security')) {
                if (!seenTools.has('exposure-report')) {
                  recommendedTools.push({ name: 'Exposure Report', path: '/tools/exposure-report' });
                  seenTools.add('exposure-report');
                }
              }
              
              // AI Message Checker - for phishing and scams
              if (threatCategories.has('phishing') || threatCategories.has('scams')) {
                if (!seenTools.has('message-checker')) {
                  recommendedTools.push({ name: 'AI Message Checker', path: '/tools/message-checker' });
                  seenTools.add('message-checker');
                }
              }
              
              // Email Analyzer - for phishing
              if (threatCategories.has('phishing')) {
                if (!seenTools.has('email-analyzer')) {
                  recommendedTools.push({ name: 'Email Header Analyzer', path: '/tools/ai/email-analyzer' });
                  seenTools.add('email-analyzer');
                }
              }
              
              // Image Analyzer - for general security and phishing
              if (threatCategories.has('phishing') || threatCategories.has('general-security')) {
                if (!seenTools.has('image-analyzer')) {
                  recommendedTools.push({ name: 'Image Metadata Analyzer', path: '/tools/ai/image-analyzer' });
                  seenTools.add('image-analyzer');
                }
              }
              
              // Social Profile Verifier - for phishing and scams
              if (threatCategories.has('phishing') || threatCategories.has('scams')) {
                if (!seenTools.has('profile-verifier')) {
                  recommendedTools.push({ name: 'Social Profile Verifier', path: '/tools/ai/profile-verifier' });
                  seenTools.add('profile-verifier');
                }
              }
              
              if (recommendedTools.length > 0) {
                return (
                  <div className="mt-4 pt-4 border-t border-yellow-300 dark:border-yellow-700">
                    <h4 className="font-semibold text-yellow-900 dark:text-yellow-200 mb-2 flex items-center gap-2">
                      <Wrench className="w-4 h-4" />
                      Recommended Privacy Tools
                    </h4>
                    <div className="flex flex-wrap gap-2 mb-3">
                      {recommendedTools.map((tool, idx) => (
                        <button
                          key={idx}
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(tool.path);
                          }}
                          aria-label={`Open ${tool.name}`}
                          className="px-3 py-1.5 bg-yellow-600 text-white text-xs rounded-lg hover:bg-yellow-700 transition-colors"
                        >
                          {tool.name}
                        </button>
                      ))}
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate('/toolkit-access');
                      }}
                      aria-label="View all privacy tools"
                      className="text-sm text-yellow-700 dark:text-yellow-300 hover:underline font-medium flex items-center gap-1"
                    >
                      View All Privacy Tools <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                );
              }
              return null;
            })()}
            
            {/* Optional Assessment Links (Helpful Suggestions) - Only show when expanded */}
            {showRecommendedActionsDetails && (
              <div className="mt-4 pt-4 border-t border-blue-300 dark:border-blue-700">
                <h4 className="font-semibold text-blue-900 dark:text-blue-200 mb-2 flex items-center gap-2">
                  <Target className="w-4 h-4" />
                  Enhance Your Privacy Profile (Optional)
                </h4>
                <p className="text-xs text-blue-700 dark:text-blue-300 mb-3">
                  Take assessments to get more personalized metrics and recommendations
                </p>
                <div className="flex flex-wrap gap-2">
                  {!exposureScore && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate('/assessment/exposure');
                      }}
                      aria-label="Take Exposure Assessment"
                      className="px-3 py-1.5 bg-blue-600 text-white text-xs rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Take Exposure Assessment
                    </button>
                  )}
                  {!rightsScore && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate('/assessment/privacy-rights');
                      }}
                      aria-label="Take Privacy Rights Assessment"
                      className="px-3 py-1.5 bg-blue-600 text-white text-xs rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Take Rights Assessment
                    </button>
                  )}
                  {exposureScore && rightsScore && (
                    <p className="text-xs text-blue-700 dark:text-blue-300">
                      ✓ All assessments completed - metrics are personalized to your profile
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
        
        {/* Compact Engagement Prompt - Moved to bottom */}
        {isUserInitialized() && selectedServices.length > 0 && 
         JSON.stringify([...selectedServices].sort()) === JSON.stringify([...getDefaultServices()].sort()) && (
          <details className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border border-purple-200 dark:border-purple-800 rounded-lg p-3 mb-4 mt-8">
            <summary className="flex items-center gap-2 cursor-pointer list-none">
              <Info className="w-4 h-4 text-purple-600 dark:text-purple-400 flex-shrink-0" />
              <span className="text-xs font-medium text-gray-900 dark:text-white">
                {t('privacyRadar.wantPersonalizedAlerts')}
              </span>
            </summary>
            <div className="mt-2 pl-6">
              <p className="text-xs text-gray-700 dark:text-gray-300 mb-2">
                {t('privacyRadar.seeingAlertsFor', { count: selectedServices.length })}
              </p>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  navigate('/service-catalog');
                }}
                aria-label="Customize services in Service Catalog"
                className="px-3 py-1.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-xs font-medium flex items-center gap-1.5"
              >
                <Shield className="w-3 h-3" />
                {t('privacyRadar.customizeMyServices')}
              </button>
            </div>
          </details>
        )}
        </div>
      </section>
    </div>
  );
};

export default PrivacyRadar;

