import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { TrendingUp, Shield, AlertTriangle, ExternalLink, ArrowRight, Globe, FileText, RefreshCw } from 'lucide-react';
import { serviceCatalog } from '../../data/serviceCatalog';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { useCautionStore } from '../../state/cautionStore';
import { rssAlertService } from '../../services/rssAlertService';
import { cautionAlertsToRSSAlerts, filterRSSAlertsByCategories } from '../../utils/rssAlertMapper';

// STRATEGIC FEED CATEGORIES - Long-term trends only
const STRATEGIC_CATEGORIES = [
  'regulation',        // New laws and regulations
  'enforcement',       // Fines and penalties  
  'privacy-laws',      // Policy changes
  'compliance',        // Standards updates
  'news'              // Industry trends (filtered)
];

/**
 * Trends Tracker Module for Dashboard
 * Shows privacy regulations and updates relevant to user's selected services
 * Uses store-based approach for consistency with main Trends Tracker page
 */
const TrendsTrackerModule = ({ selectedServices = [], maxItems = 3 }) => {
  const navigate = useNavigate();
  const [allFeeds, setAllFeeds] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [readItems, setReadItems] = useLocalStorage('privacy_regs_read_items', []);
  
  // Get alerts from store
  const storeAlerts = useCautionStore((state) => state.alerts);

  // Process alerts from store and convert to RSS format
  const processStoreAlerts = useCallback(() => {
    if (import.meta.env.DEV) {
      console.log('[Trends Tracker Module] Processing alerts from store...');
    }
    
    // Convert CautionAlerts to RSS alerts
    const rssAlerts = cautionAlertsToRSSAlerts(storeAlerts);
    
    // Filter for STRATEGIC categories only
    const strategicAlerts = filterRSSAlertsByCategories(rssAlerts, STRATEGIC_CATEGORIES);
    
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
      if (!feedsMap.has(feedId)) {
        feedsMap.set(feedId, {
          id: feedId,
          name: alert.source?.name || 'Unknown Feed',
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
        feedName: alert.source?.name || 'Unknown Feed',
        feedCategory: alert.category,
        feedRegion: alert.region || 'global',
        feedId: alert.rssFeedId || feedId,
        guid: alert.id || alert.guid
      });
    });
    
    setAllFeeds(Array.from(feedsMap.values()));
    
    if (import.meta.env.DEV) {
      console.log(`[Trends Tracker Module] Processed ${strategicAlerts.length} strategic alerts from ${feedsMap.size} feeds`);
    }
  }, [storeAlerts]);

  // Manual refresh - triggers service to fetch new feeds
  const refreshFeeds = useCallback(async () => {
    if (isRefreshing) {
      if (import.meta.env.DEV) {
        console.warn('[Trends Tracker Module] Already refreshing, skipping duplicate request');
      }
      return;
    }

    setIsRefreshing(true);
    setIsLoading(true);
    
    try {
      if (import.meta.env.DEV) {
        console.log('[Trends Tracker Module] Triggering RSS alert service refresh...');
      }
      
      // Trigger the service to fetch new feeds
      await rssAlertService.processNow();
      
      // Process will happen automatically when store updates
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error('[Trends Tracker Module] Error refreshing feeds:', error);
      }
    } finally {
      setIsRefreshing(false);
      setIsLoading(false);
    }
  }, [isRefreshing]);

  // Process alerts from store when they change
  useEffect(() => {
    processStoreAlerts();
  }, [processStoreAlerts]);
  
  // Initial load - process existing store data
  useEffect(() => {
    if (storeAlerts.length > 0) {
      processStoreAlerts();
      setIsLoading(false);
    } else {
      // If no alerts in store, trigger initial fetch
      setIsLoading(true);
      if (import.meta.env.DEV) {
        console.log('[Trends Tracker Module] No alerts in store, triggering initial fetch...');
      }
      rssAlertService.processNow().catch(error => {
        if (import.meta.env.DEV) {
          console.error('[Trends Tracker Module] Error on initial fetch:', error);
        }
        setIsLoading(false);
      });
    }
  }, []); // Only run on mount

  // Calculate strategic impact (long-term focus for regulatory content)
  const calculateStrategicImpact = (item) => {
    const text = `${item.title || ''} ${item.description || ''}`.toLowerCase();
    
    // Critical: Major regulatory changes, large fines, new laws
    if (
      text.includes('regulation') && (text.includes('new') || text.includes('announce') || text.includes('propose')) ||
      text.includes('fine') && (text.includes('million') || text.includes('billion')) ||
      text.includes('law') && (text.includes('pass') || text.includes('enact') || text.includes('approve')) ||
      text.includes('gdpr') && (text.includes('update') || text.includes('change') || text.includes('amendment'))
    ) {
      return 'critical';
    }
    
    // High: Enforcement actions, policy updates, compliance changes
    if (
      text.includes('enforcement') ||
      text.includes('penalty') ||
      text.includes('compliance') && (text.includes('requirement') || text.includes('standard')) ||
      text.includes('policy') && (text.includes('update') || text.includes('change'))
    ) {
      return 'high';
    }
    
    // Medium: Industry trends, best practices, guidance
    if (
      text.includes('trend') ||
      text.includes('best practice') ||
      text.includes('guidance') ||
      text.includes('recommendation')
    ) {
      return 'medium';
    }
    
    // Low: General news, updates, announcements
    return 'low';
  };

  // Filter items relevant to selected services
  const relevantItems = useMemo(() => {
    if (selectedServices.length === 0) {
      // If no services selected, show general critical/high strategic impact items
      const itemsMap = new Map(); // Deduplicate by guid
      allFeeds
        .flatMap(feed => (feed.items || []).map(item => ({
          ...item,
          feedName: feed.name,
          feedCategory: feed.category,
          strategicImpact: calculateStrategicImpact(item)
        })))
        .filter(item => item.strategicImpact === 'high' || item.strategicImpact === 'critical')
        .forEach(item => {
          const key = item.guid || item.id;
          if (!itemsMap.has(key)) {
            itemsMap.set(key, item);
          }
        });
      
      return Array.from(itemsMap.values())
        .sort((a, b) => {
          // Critical/high impact first
          if (a.strategicImpact === 'critical' && b.strategicImpact !== 'critical') return -1;
          if (a.strategicImpact !== 'critical' && b.strategicImpact === 'critical') return 1;
          if (a.strategicImpact === 'high' && b.strategicImpact !== 'high') return -1;
          if (a.strategicImpact !== 'high' && b.strategicImpact === 'high') return 1;
          // Then by date
          return new Date(b.pubDate || 0) - new Date(a.pubDate || 0);
        })
        .slice(0, maxItems);
    }

    // Get service names and categories
    const serviceNames = selectedServices.map(id => {
      const service = serviceCatalog.find(s => s.id === id);
      return service?.name?.toLowerCase() || '';
    });

    const serviceCategories = selectedServices.map(id => {
      const service = serviceCatalog.find(s => s.id === id);
      return service?.category || '';
    });

    // Filter items that mention selected services or have high strategic impact
    const itemsMap = new Map(); // Deduplicate by guid
    allFeeds.flatMap(feed => 
      (feed.items || []).map(item => ({
        ...item,
        feedName: feed.name,
        feedCategory: feed.category,
        strategicImpact: calculateStrategicImpact(item),
        relevanceScore: calculateRelevance(item, serviceNames, serviceCategories)
      }))
    ).forEach(item => {
      const key = item.guid || item.id;
      // Keep the item with higher relevance score if duplicate
      if (!itemsMap.has(key) || (itemsMap.get(key).relevanceScore || 0) < (item.relevanceScore || 0)) {
        itemsMap.set(key, item);
      }
    });

    // Sort by strategic impact and relevance
    const items = Array.from(itemsMap.values()).sort((a, b) => {
      // Critical/high strategic impact first
      if (a.strategicImpact === 'critical' && b.strategicImpact !== 'critical') return -1;
      if (a.strategicImpact !== 'critical' && b.strategicImpact === 'critical') return 1;
      if (a.strategicImpact === 'high' && b.strategicImpact !== 'high') return -1;
      if (a.strategicImpact !== 'high' && b.strategicImpact === 'high') return 1;
      
      // Then by relevance score
      if (b.relevanceScore !== a.relevanceScore) return b.relevanceScore - a.relevanceScore;
      
      // Finally by date
      return new Date(b.pubDate || 0) - new Date(a.pubDate || 0);
    });

    return items.slice(0, maxItems);
  }, [allFeeds, selectedServices, maxItems]);

  // Calculate relevance score for an item
  const calculateRelevance = (item, serviceNames, serviceCategories) => {
    let score = 0;
    const title = (item.title || '').toLowerCase();
    const description = (item.description || '').toLowerCase();
    const content = `${title} ${description}`;

    // Check for service name mentions
    serviceNames.forEach(name => {
      if (name && content.includes(name)) {
        score += 10;
      }
    });

    // Check for category mentions
    serviceCategories.forEach(category => {
      if (category && content.includes(category.toLowerCase())) {
        score += 5;
      }
    });

    // Boost for strategic impact (not tactical priority)
    const impact = calculateStrategicImpact(item);
    if (impact === 'critical') score += 20;
    if (impact === 'high') score += 10;

    return score;
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case 'regulation': return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300';
      case 'breach': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
      case 'enforcement': return 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300';
      case 'news': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300';
    }
  };

  const getStrategicImpactIcon = (impact) => {
    if (impact === 'critical') return <AlertTriangle className="w-4 h-4 text-red-600 dark:text-red-400" />;
    if (impact === 'high') return <Shield className="w-4 h-4 text-orange-600 dark:text-orange-400" />;
    return <FileText className="w-4 h-4 text-gray-600 dark:text-gray-400" />;
  };

  // Mark item as read
  const markAsRead = useCallback((itemId) => {
    if (!readItems.includes(itemId)) {
      setReadItems([...readItems, itemId]);
    }
  }, [readItems, setReadItems]);

  // Handle item click - mark as read and open link
  const handleItemClick = useCallback((item) => {
    const itemId = item.guid || item.id;
    markAsRead(itemId);
    if (item.link) {
      window.open(item.link, '_blank', 'noopener,noreferrer');
    }
  }, [markAsRead]);

  if (isLoading && allFeeds.length === 0) {
    return (
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 p-6">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">Privacy Trends</h3>
        </div>
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
            <RefreshCw className="w-4 h-4 animate-spin" />
            <span>Loading privacy updates...</span>
          </div>
        </div>
      </div>
    );
  }

  if (relevantItems.length === 0) {
    return (
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Privacy Trends</h3>
          </div>
        </div>
        {selectedServices.length === 0 ? (
          <div className="text-sm text-gray-600 dark:text-gray-300 mb-3">
            Select services in your Services Monitoring to see relevant privacy regulations and updates.
          </div>
        ) : (
          <div className="text-sm text-gray-600 dark:text-gray-300 mb-3">
            No recent privacy updates for your selected services.
          </div>
        )}
        <button
          onClick={() => navigate('/privacy-regulations')}
          className="text-sm text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
        >
          View Full Trends Tracker
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">Privacy Trends</h3>
        </div>
        {selectedServices.length > 0 && (
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {selectedServices.length} service{selectedServices.length !== 1 ? 's' : ''} tracked
          </span>
        )}
      </div>

      <div className="space-y-3 mb-4">
        {relevantItems.map((item, index) => {
          const isRead = readItems.includes(item.guid || item.id);
          const categoryColor = getCategoryColor(item.feedCategory);
          
          return (
            <div
              key={item.guid || item.id || index}
              onClick={() => handleItemClick(item)}
              className={`p-3 rounded-lg border transition-all ${
                item.link ? 'cursor-pointer hover:shadow-md' : 'cursor-default'
              } ${
                isRead 
                  ? 'bg-gray-50 dark:bg-slate-700 border-gray-200 dark:border-slate-600 opacity-70' 
                  : item.strategicImpact === 'critical'
                  ? 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 hover:bg-red-100 dark:hover:bg-red-900/30'
                  : item.strategicImpact === 'high'
                  ? 'bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800 hover:bg-orange-100 dark:hover:bg-orange-900/30'
                  : 'bg-gray-50 dark:bg-slate-700 border-gray-200 dark:border-slate-600 hover:bg-gray-100 dark:hover:bg-slate-600'
              }`}
            >
              <div className="flex items-start gap-2">
                {getStrategicImpactIcon(item.strategicImpact)}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${categoryColor}`}>
                      {item.feedCategory}
                    </span>
                    {item.strategicImpact && item.strategicImpact !== 'low' && (
                      <span className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                        {item.strategicImpact}
                      </span>
                    )}
                    {item.feedName && item.feedName !== 'Unknown Feed' && (
                      <span className="text-xs text-gray-500 dark:text-gray-400 truncate max-w-[150px]" title={item.feedName}>
                        {item.feedName}
                      </span>
                    )}
                    {item.link && (
                      <ExternalLink className="w-3 h-3 text-gray-400 flex-shrink-0" />
                    )}
                  </div>
                  <h4 className={`font-semibold text-sm mb-1 line-clamp-2 ${
                    isRead 
                      ? 'text-gray-600 dark:text-gray-400' 
                      : 'text-gray-900 dark:text-white'
                  }`}>
                    {item.title}
                  </h4>
                  {item.pubDate && (
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {new Date(item.pubDate).toLocaleString(undefined, {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <button
        onClick={() => navigate('/privacy-regulations')}
        className="w-full px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center justify-center gap-2"
      >
        <Globe className="w-4 h-4" />
        View Full Trends Tracker
        <ArrowRight className="w-4 h-4" />
      </button>
    </div>
  );
};

export default TrendsTrackerModule;

