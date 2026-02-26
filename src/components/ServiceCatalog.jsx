import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, AlertTriangle, CheckCircle, Bell, BellOff, Search, Filter, ArrowRight, Info, ExternalLink, Download, TrendingUp, TrendingDown, BarChart3, FileText, Building, Scale, X, Gauge, AlertCircle, Target, ChevronDown, ChevronUp, Database, Share2 } from 'lucide-react';
import { serviceCatalog } from '../data/serviceCatalog';
import { getAllEnhancedServices, getEnhancedService } from '../data/serviceCatalogEnhanced';
import { serviceRiskProfiles } from '../data/serviceRiskProfiles';
import { serviceRelationships } from '../data/serviceRelationships';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { useNotifications } from './common/NotificationSystem';
import SEOHead from './common/SEOHead';
import ContextualLinks from './common/ContextualLinks';
import RelatedContent from './common/RelatedContent';
import { analytics } from '../utils/analytics';
import { serviceNotificationManager } from '../utils/serviceNotifications';
import { getIconComponent } from '../utils/iconMapping';
import { calculatePrivacyExposureIndex, getExposureLevel, getSimplifiedExposureBreakdown } from '../utils/privacyExposureIndex';
import { getServiceLogoUrl } from '../utils/serviceLogos';
import { getCategoryIcon } from '../utils/categoryHelpers';

/** Make recommended action text more actionable with a short how-to. */
function expandRecommendedAction(action) {
  const a = (action || '').toLowerCase();
  if (a.includes('review') && (a.includes('account') || a.includes('privacy'))) {
    return { title: action, detail: `In the app or website: open Profile or Settings → Privacy (or Account) and review what data is shared and with whom. Limit or turn off sharing you don’t need.` };
  }
  if (a.includes('disable location')) return { title: action, detail: `Turn off location access for this app when you’re not using a location-based feature to reduce tracking and data collection.` };
  if (a.includes('privacy zones')) return { title: action, detail: `Set home and work zones so your exact addresses aren’t exposed on shared activities or maps.` };
  if (a.includes('data sharing') || a.includes('sharing settings')) return { title: action, detail: `Check which data is shared with the service and any partners (e.g. ads, analytics); disable or limit sharing you don’t need.` };
  if (a.includes('review') && (a.includes('settings') || a.includes('integration'))) return { title: action, detail: `In Settings or Preferences, find the relevant section and turn off or limit options you don’t need.` };
  return { title: action, detail: `Check the service’s settings or help center for how to do this.` };
}

/** Add a short explanation so privacy risks are clearer. */
function expandRiskExplanation(risk) {
  const r = (risk || '').toLowerCase();
  if (r.includes('workout') || r.includes('fitness')) return { label: risk, explanation: 'Can reveal health and activity patterns; may be used for ads or shared with partners.' };
  if (r.includes('location') || r.includes('gps') || r.includes('routes')) return { label: risk, explanation: 'Precise location or routes can reveal where you live, work, or go; often used for ads or analytics.' };
  if (r.includes('linked to') || r.includes('account')) return { label: risk, explanation: 'Data is tied to your account and may be combined with other products or shared within the same company.' };
  if (r.includes('data shared') || r.includes('shared with')) return { label: risk, explanation: 'Your data may be sent to partners, advertisers, or affiliates; check the privacy policy for who gets it.' };
  if (r.includes('recommendation') || r.includes('product')) return { label: risk, explanation: 'Your activity may be used to personalize offers or content; data can influence what you see.' };
  return { label: risk, explanation: null };
}

// Service Icon Component - shows service logo only
const ServiceIcon = ({ serviceId, serviceName, category, theme }) => {
  const logoUrl = getServiceLogoUrl(serviceId, theme === 'dark');
  const CategoryIcon = getCategoryIcon(category);
  const [logoError, setLogoError] = useState(false);
  
  return (
    <div className="w-12 h-12 flex-shrink-0 flex items-center justify-center bg-white dark:bg-gray-800 rounded-xl p-2 border-2 border-gray-200 dark:border-gray-700 shadow-sm group-hover:shadow-md transition-shadow">
      {logoUrl && !logoError ? (
        <img
          src={logoUrl}
          alt={`${serviceName} logo`}
          className="w-full h-full object-contain"
          onError={() => setLogoError(true)}
        />
      ) : (
        <CategoryIcon className="w-6 h-6 text-gray-600 dark:text-gray-400" />
      )}
    </div>
  );
};
import { useTheme } from '../contexts/ThemeContext';
import { useTranslation } from '../contexts/TranslationContext';
import QuickRatingWidget from './common/QuickRatingWidget';
import EmailCaptureModal from './lead/EmailCaptureModal';
import { useLocalStorage as useEmailModalSeen } from '../hooks/useLocalStorage';
import QuickPrivacyScore from './QuickPrivacyScore';
import EnhancedCategoryFilter from './common/EnhancedCategoryFilter';
import UpgradePrompt from './common/UpgradePrompt';
import { generateServicePrivacyReport } from '../utils/pdfReportGenerator';
import subscriptionService from '../services/subscriptionService';
import { rssFeedProcessor } from '../utils/rssFeedProcessor';
import { isUserInitialized, getDefaultServices } from '../utils/userInitialization';
import ServicePrivacyData from '../utils/servicePrivacyData';
import { canAddService, getUserTier, isServiceTracked, getServiceLimit, hasReachedServiceLimit } from '../utils/serviceLimitChecker';
import ContextualHelp from './common/ContextualHelp';
import PageHeader from './common/PageHeader';

const ServiceCatalog = () => {
  const navigate = useNavigate();
  const { showInfo, showWarning } = useNotifications();
  const { theme } = useTheme();
  const { t } = useTranslation();
  
  // Check if user has premium subscription
  const isPremium = subscriptionService?.hasActiveSubscription?.() || false;
  
  // RSS aggregator state for real-time service alerts
  const [rssAlerts, setRssAlerts] = useState([]);
  const [isLoadingRss, setIsLoadingRss] = useState(false);
  
  
  // Check if user has completed assessment
  const [assessmentResults] = useLocalStorage('socialcaution_results', null);
  const hasCompletedAssessment = !!assessmentResults;
  
  // Service selections - independent of assessment
  const [selectedServices, setSelectedServices] = useLocalStorage('socialcaution_services', []);
  
  // Notification preferences per service
  const [notificationPrefs, setNotificationPrefs] = useLocalStorage(
    'socialcaution_service_notifications', 
    {}
  );
  
  // Filter and search state
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [selectedCategoryFilters, setSelectedCategoryFilters] = useState([]); // Multi-select categories
  const [sortBy, setSortBy] = useState('name'); // 'name', 'risk', 'exposure', 'category'
  const [bulkSelectMode, setBulkSelectMode] = useState(false);
  const [showFullCatalog, setShowFullCatalog] = useState(false);
  
  // Collapsible sections state
  const [isHowToUseExpanded, setIsHowToUseExpanded] = useState(true); // Expanded by default to show workflow guide
  const [isAboutExpanded, setIsAboutExpanded] = useState(false); // Collapsed by default
  const [isFiltersExpanded, setIsFiltersExpanded] = useState(true);
  
  // Detailed service card modal state
  const [selectedServiceForDetails, setSelectedServiceForDetails] = useState(null);
  
  // Email capture for service updates
  const [showEmailCapture, setShowEmailCapture] = useState(false);
  const [hasSeenServiceEmailModal, setHasSeenServiceEmailModal] = useEmailModalSeen('socialcaution_service_email_modal_seen', false);
  
  // Ref to track email modal timeout for cleanup
  const emailModalTimeoutRef = useRef(null);
  
  // Track when user last checked for updates
  const [lastChecked, setLastChecked] = useLocalStorage(
    'socialcaution_last_service_check',
    new Date().toISOString()
  );

  // Track if user has dismissed the welcome banner
  const [hasDismissedWelcomeBanner, setHasDismissedWelcomeBanner] = useLocalStorage(
    'socialcaution_welcome_banner_dismissed',
    false
  );

  // Fetch RSS alerts using the RSS aggregator
  useEffect(() => {
    const fetchRSSAlerts = async () => {
      setIsLoadingRss(true);
      try {
        if (import.meta.env.DEV) {
          console.log('[ServiceCatalog] Fetching RSS alerts from aggregator...');
        }
        
        // Use centralized RSS feed processor with optimized settings
        const result = await rssFeedProcessor.processAllFeeds({
          maxConcurrent: 3,
          feedDelay: 500
        });
        
        // Map alerts to services
        const serviceAlerts = result.allAlerts.filter(alert => 
          alert.relatedServices && alert.relatedServices.length > 0
        );
        
        setRssAlerts(serviceAlerts);
        setLastChecked(new Date().toISOString());
        
        if (import.meta.env.DEV) {
          console.log(`[ServiceCatalog] Loaded ${serviceAlerts.length} RSS alerts for services`);
          if (result.errors && result.errors.length > 0) {
            console.warn(`[ServiceCatalog] ${result.errors.length} feeds failed:`, result.errors);
          }
        }
      } catch (error) {
        if (import.meta.env.DEV) {
          console.error('[ServiceCatalog] Error fetching RSS alerts:', error);
        }
        // Don't show error to user - RSS is optional enhancement
      } finally {
        setIsLoadingRss(false);
      }
    };

    fetchRSSAlerts();
  }, []);

  // Get enhanced services (falls back to basic catalog if enhanced not available)
  const allServices = useMemo(() => {
    try {
      const services = getAllEnhancedServices();
      // Ensure we have a valid array
      if (!Array.isArray(services) || services.length === 0) {
        if (import.meta.env.DEV) {
          console.warn('[ServiceCatalog] Enhanced services returned empty or invalid, falling back to basic catalog');
        }
        return Array.isArray(serviceCatalog) ? serviceCatalog : [];
      }
      return services;
    } catch (error) {
      if (import.meta.env.DEV) {
        console.warn('[ServiceCatalog] Enhanced catalog not available, using basic catalog:', error);
      }
      return Array.isArray(serviceCatalog) ? serviceCatalog : [];
    }
  }, []);

  // Get all unique categories
  const categories = ['all', ...new Set(allServices.map(s => s.category))];
  
  // Calculate service counts per category
  const serviceCounts = allServices.reduce((acc, service) => {
    acc[service.category] = (acc[service.category] || 0) + 1;
    return acc;
  }, {});

  // Calculate risk level for a service
  const getRiskLevel = (serviceId) => {
    const riskProfile = serviceRiskProfiles[serviceId];
    if (!riskProfile) return 'unknown';
    
    const riskCount = (riskProfile.typicalRisks?.length || 0) + (riskProfile.knownIssues?.length || 0);
    if (riskCount >= 6) return 'high';
    if (riskCount >= 3) return 'medium';
    return 'low';
  };

  // Get privacy exposure index for a service
  const getPrivacyExposureIndex = (serviceId) => {
    return calculatePrivacyExposureIndex(serviceId);
  };

  // Separate services into rated and non-rated groups
  const { ratedServices, nonRatedServices } = useMemo(() => {
    const baseFiltered = allServices
      .filter(service => {
        const matchesSearch = service.name.toLowerCase().includes(searchQuery.toLowerCase());
        
        // Category filtering: prioritize multi-select, fallback to legacy single select
        let matchesCategory = false;
        if (selectedCategoryFilters.length > 0) {
          // Multi-select: service must be in one of the selected categories
          matchesCategory = selectedCategoryFilters.includes(service.category);
        } else {
          // Legacy single select: use categoryFilter
          matchesCategory = categoryFilter === 'all' || service.category === categoryFilter;
        }
        
        return matchesSearch && matchesCategory;
      });

    // Separate into rated and non-rated
    const rated = [];
    const nonRated = [];
    
    baseFiltered.forEach(service => {
      const exposureIndex = getPrivacyExposureIndex(service.id);
      
      // Debug logging in development
      if (import.meta.env.DEV && exposureIndex === null) {
        // Check if service exists in catalog and risk profiles
        const serviceExists = allServices.some(s => s.id === service.id);
        // This helps identify if services are missing risk profiles
      }
      
      if (exposureIndex !== null && exposureIndex !== undefined) {
        // Service has an exposure index - include in rated services
        rated.push(service);
      } else {
        // Service doesn't have exposure index - include in non-rated services
        nonRated.push(service);
      }
    });

    // Sort function
    const sortServices = (services) => {
      return [...services].sort((a, b) => {
        if (sortBy === 'name') {
          return (a.name || '').localeCompare(b.name || '');
        } else if (sortBy === 'risk') {
          const riskOrder = { high: 3, medium: 2, low: 1, unknown: 0 };
          const riskA = getRiskLevel(a.id) || 'unknown';
          const riskB = getRiskLevel(b.id) || 'unknown';
          return (riskOrder[riskB] || 0) - (riskOrder[riskA] || 0);
        } else if (sortBy === 'exposure') {
          const indexA = getPrivacyExposureIndex(a.id);
          const indexB = getPrivacyExposureIndex(b.id);
          if (indexA == null && indexB == null) return 0;
          if (indexA == null) return 1;
          if (indexB == null) return -1;
          return indexB - indexA;
        } else if (sortBy === 'category') {
          return (a.category || '').localeCompare(b.category || '');
        }
        return 0;
      });
    };

    return {
      ratedServices: sortServices(rated),
      nonRatedServices: sortServices(nonRated)
    };
  }, [allServices, searchQuery, selectedCategoryFilters, categoryFilter, sortBy]);

  // Combined filtered services for backward compatibility (rated first, then non-rated)
  const filteredServices = useMemo(() => {
    return [...ratedServices, ...nonRatedServices];
  }, [ratedServices, nonRatedServices]);

  // Initial display cap for performance; "See full catalog" reveals the rest
  const INITIAL_DISPLAY_LIMIT = 24;
  const { displayedRated, displayedNonRated, hasMoreToShow } = useMemo(() => {
    if (showFullCatalog || filteredServices.length <= INITIAL_DISPLAY_LIMIT) {
      return {
        displayedRated: ratedServices,
        displayedNonRated: nonRatedServices,
        hasMoreToShow: false
      };
    }
    const capped = filteredServices.slice(0, INITIAL_DISPLAY_LIMIT);
    const rated = capped.filter(s => getPrivacyExposureIndex(s.id) != null);
    const nonRated = capped.filter(s => getPrivacyExposureIndex(s.id) == null);
    return {
      displayedRated: rated,
      displayedNonRated: nonRated,
      hasMoreToShow: filteredServices.length > INITIAL_DISPLAY_LIMIT
    };
  }, [showFullCatalog, filteredServices, ratedServices, nonRatedServices]);

  // Toggle service selection
  const toggleServiceSelection = (serviceId) => {
    // Validate serviceId
    if (!serviceId || typeof serviceId !== 'string') {
      if (import.meta.env.DEV) {
        console.warn('[ServiceCatalog] Invalid serviceId provided to toggleServiceSelection:', serviceId);
      }
      return;
    }


    try {
      // Check if service is already tracked (for deselection, this is fine)
      const isCurrentlyTracked = isServiceTracked(serviceId);
      
      // If adding a new service, check limits
      if (!isCurrentlyTracked) {
        const userTier = getUserTier();
        const currentCount = selectedServices.length;
        const limitCheck = canAddService(userTier, currentCount);
        
        if (!limitCheck.allowed) {
          // Show helpful message explaining they can swap services
          showWarning(
            t('serviceCatalog.limits.serviceLimitReached', { limit: limitCheck.limit }),
            { duration: 8000 }
          );
          return;
        }
      }
      
      let shouldShowEmailModal = false;
      
      setSelectedServices(prev => {
        // Ensure prev is always an array - handle corrupted localStorage data
        const currentSelection = Array.isArray(prev) ? prev : [];
        
        const wasSelected = currentSelection.includes(serviceId);
        const newSelection = wasSelected
          ? currentSelection.filter(id => id !== serviceId)
          : [...currentSelection, serviceId];
        
        // Track analytics
        try {
          if (analytics && typeof analytics.trackFeatureUsage === 'function') {
            analytics.trackFeatureUsage('service_selection', {
              service_id: serviceId,
              action: wasSelected ? 'deselected' : 'selected',
              total_selected: newSelection.length
            });
          }
        } catch (error) {
          // Silently fail analytics - don't block functionality
          if (import.meta.env.DEV) {
            console.warn('Analytics tracking failed:', error);
          }
        }
        
        // Check if we should show email modal (but don't set it here to avoid race conditions)
        shouldShowEmailModal = !wasSelected && newSelection.length > 0 && !hasSeenServiceEmailModal;
        
        return newSelection;
      });
      
      // Handle email modal outside setState callback to avoid race conditions
      if (shouldShowEmailModal) {
        // Clear any existing timeout to prevent memory leaks
        if (emailModalTimeoutRef.current) {
          clearTimeout(emailModalTimeoutRef.current);
        }
        emailModalTimeoutRef.current = setTimeout(() => {
          setShowEmailCapture(true);
          emailModalTimeoutRef.current = null;
        }, 500);
      }
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error('[ServiceCatalog] Error toggling service selection:', error);
      }
      showWarning('Failed to update service selection. Please try again.', { duration: 5000 });
    }
  };

  // Toggle notification preference for a service
  const toggleNotificationPreference = (serviceId) => {
    setNotificationPrefs(prev => ({
      ...prev,
      [serviceId]: !prev[serviceId]
    }));
    
    const serviceName = serviceCatalog.find(s => s.id === serviceId)?.name || 'Service';
    showInfo(
      `Notifications ${notificationPrefs[serviceId] ? 'disabled' : 'enabled'} for ${serviceName}`,
      { duration: 3000 }
    );
  };

  // Get service details
  const getServiceDetails = (serviceId) => {
    // Try to get enhanced service data first
    let service = null;
    try {
      service = getEnhancedService(serviceId);
    } catch (error) {
      // Fallback to basic catalog
      service = serviceCatalog.find(s => s.id === serviceId);
    }
    
    // If still no service found, try basic catalog
    if (!service) {
      service = serviceCatalog.find(s => s.id === serviceId);
    }
    
    if (!service) return null;
    
    const riskProfile = serviceRiskProfiles[serviceId];

    return {
      ...service,
      ...riskProfile,
      notificationsEnabled: notificationPrefs[serviceId] !== false // default to enabled
    };
  };

  // Check for service updates (can be called periodically or on demand)
  const checkForUpdates = () => {
    setLastChecked(new Date().toISOString());
    
    // Get notifications for selected services
    const notifications = serviceNotificationManager.getNotificationsForServices(
      selectedServices,
      notificationPrefs
    );

    if (notifications.length > 0) {
      showWarning(
        `${notifications.length} of your selected services have privacy updates. Check them out!`,
        {
          duration: 8000,
          action: {
            label: 'View Updates',
            onClick: () => {
              // Scroll to selected services section
              const element = document.getElementById('selected-services');
              if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
              }
            }
          }
        }
      );
    } else {
      showInfo('All your services are up to date!', { duration: 3000 });
    }
  };

  // Get selected service details - memoized for performance
  const selectedServiceDetails = useMemo(() => {
    const services = Array.isArray(selectedServices) ? selectedServices : [];
    return services
      .map(serviceId => getServiceDetails(serviceId))
      .filter(Boolean);
  }, [selectedServices, notificationPrefs]);

  // Get notifications for selected services
  const [serviceNotifications, setServiceNotifications] = useState([]);

  // Load notifications when selected services change - with guard to prevent infinite loops
  useEffect(() => {
    if (!Array.isArray(selectedServices) || selectedServices.length === 0) {
      setServiceNotifications([]);
      return;
    }
    
    const notifications = serviceNotificationManager.getNotificationsForServices(
      selectedServices,
      notificationPrefs
    );
    
    // Only update if notifications actually changed to prevent unnecessary re-renders
    setServiceNotifications(prev => {
      if (prev.length === notifications.length && 
          prev.every((n, i) => n.id === notifications[i]?.id)) {
        return prev; // No change, return previous to prevent re-render
      }
      return notifications;
    });
  }, [selectedServices, notificationPrefs]);

  // Mark action as completed
  const handleActionComplete = (serviceId, actionId) => {
    serviceNotificationManager.markActionCompleted(serviceId, actionId);
    // Refresh notifications
    const notifications = serviceNotificationManager.getNotificationsForServices(
      selectedServices,
      notificationPrefs
    );
    setServiceNotifications(notifications);
    showInfo(t('serviceCatalog.actionMarkedCompleted'), { duration: 2000 });
  };

  // Get notification icon component
  const getNotificationIconComponent = (iconName) => {
    try {
      return getIconComponent(iconName);
    } catch {
      return Bell; // Default icon
    }
  };

  // Group notifications by service - memoized for performance
  const notificationsByService = useMemo(() => {
    return serviceNotifications.reduce((acc, notif) => {
      if (!acc[notif.serviceId]) {
        acc[notif.serviceId] = [];
      }
      acc[notif.serviceId].push(notif);
      return acc;
    }, {});
  }, [serviceNotifications]);

  // Bulk selection handlers
  const handleSelectAll = () => {
    setSelectedServices(filteredServices.map(s => s.id));
  };

  const handleDeselectAll = () => {
    if (window.confirm('Are you sure you want to clear all selected services? This will remove all tracked services from your dashboard.')) {
      setSelectedServices([]);
      showInfo('All services cleared', { duration: 3000 });
    }
  };

  // Reset/clear all services (same as deselect all, but more prominent)
  const handleResetServices = () => {
    handleDeselectAll();
  };


  // Export selected services as PDF
  const handleExport = async () => {
    try {
      const fileName = await generateServicePrivacyReport(selectedServices, {});
      
      showInfo(`Privacy report exported as ${fileName}`, { duration: 5000 });
      
      // Track analytics
      try {
        if (analytics && typeof analytics.trackFeatureUsage === 'function') {
          analytics.trackFeatureUsage('pdf_export', {
            service_count: selectedServices.length
          });
        }
      } catch (error) {
        if (import.meta.env.DEV) {
          console.warn('Analytics tracking failed:', error);
        }
      }
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error('PDF export failed:', error);
      }
      showWarning('Failed to generate PDF report. Please try again.', { duration: 5000 });
    }
  };

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (emailModalTimeoutRef.current) {
        clearTimeout(emailModalTimeoutRef.current);
        emailModalTimeoutRef.current = null;
      }
    };
  }, []);

  // Track page view
  useEffect(() => {
    try {
      if (analytics && typeof analytics.trackPageView === 'function') {
        analytics.trackPageView('/service-catalog', {
          selected_services_count: Array.isArray(selectedServices) ? selectedServices.length : 0
        });
      }
    } catch (error) {
      // Silently fail analytics - don't block functionality
      if (import.meta.env.DEV) {
        console.warn('Analytics tracking failed:', error);
      }
    }
  }, [selectedServices.length]);

  // Handle email capture close
  const handleEmailCaptureClose = () => {
    setShowEmailCapture(false);
    setHasSeenServiceEmailModal(true);
  };

  // Get selected service names for email capture
  const selectedServiceNames = selectedServices
    .map(id => serviceCatalog.find(s => s.id === id)?.name)
    .filter(Boolean)
    .slice(0, 3); // Limit to first 3 for display

  // Create offer text for email capture
  const getServiceEmailOffer = () => {
    if (selectedServices.length === 1) {
      const serviceName = selectedServiceNames[0] || 'your service';
      return `Get notified when ${serviceName} has privacy updates`;
    } else if (selectedServices.length <= 3) {
      return `Get notified when ${selectedServiceNames.join(', ')} have privacy updates`;
    } else {
      return `Get notified when your ${selectedServices.length} selected services have privacy updates`;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
      {/* Email Capture Modal for Service Updates */}
      {showEmailCapture && selectedServices.length > 0 && (
        <EmailCaptureModal
          isOpen={showEmailCapture}
          onClose={handleEmailCaptureClose}
          context="service"
          offer={getServiceEmailOffer()}
          selectedServices={selectedServices}
        />
      )}
      <SEOHead
        title="Services Monitoring - SocialCaution"
        description="Browse and select online services to receive personalized privacy risk insights, recommended actions, and privacy update notifications. Independent privacy monitoring for your digital services."
        keywords="services monitoring, online service privacy, privacy risk assessment, privacy monitoring, privacy notifications"
        canonicalUrl={typeof window !== 'undefined' ? `${window.location.origin}/service-catalog` : ''}
      />

      <PageHeader
        title={t('serviceCatalog.servicePrivacyMonitoring')}
        subtitle={t('serviceCatalog.subtitle')}
        icon={Shield}
        iconGradient="red"
      >
        <ContextualHelp tutorialId="service-catalog-tutorial" variant="icon" />
        {selectedServices.length > 0 && (
          <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg">
            <CheckCircle className="w-5 h-5 text-blue-600" />
            <span className="text-sm font-medium text-blue-900 dark:text-blue-100">
              {t('serviceCatalog.servicesSelected', {
                count: selectedServices.length,
                plural: selectedServices.length !== 1 ? 's' : ''
              })}
            </span>
          </div>
        )}
      </PageHeader>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Search */}
        <div className="flex flex-col gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder={t('serviceCatalog.searchPlaceholder')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 text-base border-2 border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
            />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Banner for Preselected Services - Conversion Optimized */}
        {isUserInitialized() && selectedServices.length > 0 && 
         JSON.stringify(selectedServices.sort()) === JSON.stringify(getDefaultServices().sort()) &&
         !hasDismissedWelcomeBanner && (
          <div className="bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 dark:from-blue-900/20 dark:via-indigo-900/20 dark:to-purple-900/20 border-l-4 border-blue-500 dark:border-blue-400 rounded-lg p-6 mb-6 shadow-sm">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                  <Target className="w-6 h-6 text-white" />
                </div>
              </div>
              <div className="flex-1">
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
                      🎯 Quick Start: We've preselected 3 popular services
                    </h3>
                    <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
                      To help you see how <strong>Privacy Radar</strong> and <strong>Trends Tracker</strong> work, 
                      we've selected: <strong className="text-blue-600 dark:text-blue-400">
                        {selectedServices.map(id => {
                          const service = serviceCatalog.find(s => s.id === id);
                          return service?.name;
                        }).filter(Boolean).join(', ')}
                      </strong>
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-4">
                      These services help demonstrate personalized threat alerts and regulatory monitoring. 
                      Customize your selection to match the services you actually use for better insights.
                    </p>
                  </div>
                  <button
                    onClick={() => setHasDismissedWelcomeBanner(true)}
                    className="flex-shrink-0 p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                    aria-label="Dismiss welcome banner"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={() => {
                      // Scroll to service list and highlight customization
                      setHasDismissedWelcomeBanner(true);
                      document.getElementById('service-list')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                      // Track analytics
                      try {
                        if (analytics && typeof analytics.trackFeatureUsage === 'function') {
                          analytics.trackFeatureUsage('welcome_banner_customize', {
                            action: 'clicked_customize',
                            services_count: selectedServices.length
                          });
                        }
                      } catch (error) {
                        if (import.meta.env.DEV) {
                          console.warn('Analytics tracking failed:', error);
                        }
                      }
                    }}
                    className="px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium flex items-center gap-2 shadow-sm"
                  >
                    <Shield className="w-4 h-4" />
                    Customize My Services
                  </button>
                  <button
                    onClick={() => {
                      setHasDismissedWelcomeBanner(true);
                      // Navigate to Privacy Radar to show value
                      navigate('/privacy-radar');
                      // Track analytics
                      try {
                        if (analytics && typeof analytics.trackFeatureUsage === 'function') {
                          analytics.trackFeatureUsage('welcome_banner_view_radar', {
                            action: 'clicked_view_radar',
                            services_count: selectedServices.length
                          });
                        }
                      } catch (error) {
                        if (import.meta.env.DEV) {
                          console.warn('Analytics tracking failed:', error);
                        }
                      }
                    }}
                    className="px-5 py-2.5 bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 border-2 border-blue-600 dark:border-blue-400 rounded-lg hover:bg-blue-50 dark:hover:bg-slate-600 transition-colors text-sm font-medium flex items-center gap-2"
                  >
                    <ArrowRight className="w-4 h-4" />
                    See How It Works
                  </button>
                  <button
                    onClick={() => {
                      setHasDismissedWelcomeBanner(true);
                      // Track analytics
                      try {
                        if (analytics && typeof analytics.trackFeatureUsage === 'function') {
                          analytics.trackFeatureUsage('welcome_banner_keep', {
                            action: 'clicked_keep',
                            services_count: selectedServices.length
                          });
                        }
                      } catch (error) {
                        if (import.meta.env.DEV) {
                          console.warn('Analytics tracking failed:', error);
                        }
                      }
                    }}
                    className="px-5 py-2.5 bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-slate-600 transition-colors text-sm"
                  >
                    Keep These (I use them)
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Workflow Guide Section - How to Use the Catalog (Collapsible) */}
        <div className="bg-gradient-to-br from-blue-50 via-purple-50 to-indigo-50 dark:from-slate-800 dark:via-blue-900/20 dark:to-purple-900/20 rounded-2xl p-4 md:p-6 mb-6 border border-blue-200 dark:border-blue-800">
          <button
            onClick={() => setIsHowToUseExpanded(!isHowToUseExpanded)}
            className="w-full flex items-center justify-between text-left focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg p-2 -m-2 transition-colors hover:bg-white/50 dark:hover:bg-slate-700/30"
            aria-expanded={isHowToUseExpanded}
          >
            <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">
              {t('serviceCatalog.howToUse.title')}
            </h2>
            <div className="flex items-center gap-2">
              {isHowToUseExpanded ? (
                <>
                  <span className="text-sm text-gray-500 dark:text-gray-400 hidden sm:inline">{t('serviceCatalog.howToUse.clickToCollapse')}</span>
                  <ChevronUp className="w-5 h-5 text-gray-600 dark:text-gray-400 flex-shrink-0 transition-transform" />
                </>
              ) : (
                <>
                  <span className="text-sm text-gray-500 dark:text-gray-400 hidden sm:inline">{t('serviceCatalog.howToUse.clickToExpand')}</span>
                  <ChevronDown className="w-5 h-5 text-gray-600 dark:text-gray-400 flex-shrink-0 transition-transform" />
                </>
              )}
            </div>
          </button>
          
          <div className={`overflow-hidden transition-all duration-300 ease-in-out ${
            isHowToUseExpanded ? 'max-h-[2000px] opacity-100 mb-0' : 'max-h-0 opacity-0 mb-0'
          }`}>
            <div className="pt-3">
              <div className="grid md:grid-cols-4 gap-3 md:gap-4">
                <div className="bg-white dark:bg-slate-800 rounded-lg p-3 border border-blue-100 dark:border-blue-900/50 text-center">
                  <div className="w-9 h-9 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-2">
                    <Search className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="text-lg font-bold text-blue-600 dark:text-blue-400 mb-0.5">1</div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-1 text-xs">Search & Browse</h4>
                  <p className="text-[11px] text-gray-600 dark:text-gray-300 leading-tight">
                    Use search or filters to find services you use
                  </p>
                </div>

                <div className="bg-white dark:bg-slate-800 rounded-lg p-3 border border-purple-100 dark:border-purple-900/50 text-center">
                  <div className="w-9 h-9 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-2">
                    <Shield className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div className="text-lg font-bold text-purple-600 dark:text-purple-400 mb-0.5">2</div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-1 text-xs">Review Privacy Risks</h4>
                  <p className="text-[11px] text-gray-600 dark:text-gray-300 leading-tight">
                    Check exposure index and risk levels in real-time
                  </p>
                </div>

                <div className="bg-white dark:bg-slate-800 rounded-lg p-3 border border-green-100 dark:border-green-900/50 text-center">
                  <div className="w-9 h-9 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-2">
                    <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />
                  </div>
                  <div className="text-lg font-bold text-green-600 dark:text-green-400 mb-0.5">3</div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-1 text-xs">Select & Track</h4>
                  <p className="text-[11px] text-gray-600 dark:text-gray-300 leading-tight">
                    Click services you use and watch your dashboard update
                  </p>
                </div>

                <div className="bg-white dark:bg-slate-800 rounded-lg p-3 border border-orange-100 dark:border-orange-900/50 text-center">
                  <div className="w-9 h-9 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center mx-auto mb-2">
                    <Bell className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                  </div>
                  <div className="text-lg font-bold text-orange-600 dark:text-orange-400 mb-0.5">4</div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-1 text-xs">Stay Informed</h4>
                  <p className="text-[11px] text-gray-600 dark:text-gray-300 leading-tight">
                    Real-time privacy updates and personalized action tips
                  </p>
                </div>
              </div>
              <p className="text-center text-xs text-gray-600 dark:text-gray-400 mt-4 max-w-2xl mx-auto">
                Follow these simple steps to discover and monitor privacy risks.
              </p>
            </div>
          </div>
        </div>

        {/* Search, Filter, and Controls (Collapsible) */}
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 p-4 mb-6">
          <button
            onClick={() => setIsFiltersExpanded(!isFiltersExpanded)}
            className="w-full flex items-center justify-between text-left mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg p-2 -m-2"
            aria-expanded={isFiltersExpanded}
          >
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {t('serviceCatalog.filtersAndSearch')}
              </h3>
            </div>
            {isFiltersExpanded ? (
              <ChevronUp className="w-5 h-5 text-gray-600 dark:text-gray-400 flex-shrink-0" />
            ) : (
              <ChevronDown className="w-5 h-5 text-gray-600 dark:text-gray-400 flex-shrink-0" />
            )}
          </button>
          
          {isFiltersExpanded && (
            <div className="flex flex-col gap-3">

            {/* Enhanced Category Filter */}
            <EnhancedCategoryFilter
              categories={categories}
              selectedCategories={selectedCategoryFilters}
              onCategoryChange={setSelectedCategoryFilters}
              serviceCounts={serviceCounts}
              getPrivacyExposureIndex={getPrivacyExposureIndex}
              allServices={allServices}
            />
            
            
              {/* Service Limit Indicator */}
              {selectedServices.length > 0 && (() => {
                const userTier = getUserTier();
                const serviceLimit = getServiceLimit(userTier);
                const currentCount = selectedServices.length;
                const isFreeTier = userTier === 'free';
                const hasReachedLimit = hasReachedServiceLimit(userTier, currentCount);
                
                return (
                  <div className="mb-3 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg">
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2 flex-1">
                        <CheckCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium text-blue-900 dark:text-blue-100">
                            {currentCount} / {serviceLimit === -1 ? '∞' : serviceLimit} services tracked
                          </div>
                          {isFreeTier && hasReachedLimit && (
                            <div className="text-xs text-orange-700 dark:text-orange-300 mt-1">
                              Limit reached. Remove a service or upgrade for unlimited tracking.
                            </div>
                          )}
                        </div>
                      </div>
                      {currentCount > 0 && (
                        <button
                          type="button"
                          onClick={handleResetServices}
                          className="px-3 py-1.5 text-xs font-medium bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-lg hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors whitespace-nowrap flex items-center gap-1"
                          title="Clear all selected services"
                        >
                          <X className="w-3 h-3" />
                          Reset
                        </button>
                      )}
                    </div>
                  </div>
                );
              })()}

              {/* Bulk Actions and Export */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-gray-200 dark:border-slate-700">
              <div className="flex items-center gap-2">
                {selectedServices.length > 0 && (
                  <>
                    <button
                      type="button"
                      onClick={() => setBulkSelectMode(!bulkSelectMode)}
                      className="px-3 py-1.5 text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                    >
                      {bulkSelectMode ? 'Exit Bulk Select' : 'Bulk Select'}
                    </button>
                    {bulkSelectMode && (
                      <>
                        <button
                          type="button"
                          onClick={handleSelectAll}
                          className="px-3 py-1.5 text-sm bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors"
                        >
                          Select All Visible
                        </button>
                        <button
                          type="button"
                          onClick={handleDeselectAll}
                          className="px-3 py-1.5 text-sm bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-lg hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors"
                        >
                          Deselect All
                        </button>
                      </>
                    )}
                    <button
                      type="button"
                      onClick={handleExport}
                      className="px-3 py-1.5 text-sm bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-lg hover:bg-green-200 dark:hover:bg-green-900/50 transition-colors flex items-center gap-1"
                    >
                      <Download className="w-4 h-4" />
                      Export Selected
                    </button>
                  </>
                )}
              </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {t('serviceCatalog.servicesSelectedOfTotal', {
                    selected: selectedServices.length,
                    total: filteredServices.length
                  })}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Quick Privacy Score - Show when services are selected (includes CTA to Digital Footprint) */}
        {selectedServices.length > 0 && (
          <QuickPrivacyScore 
            key={`privacy-score-${selectedServices.length}-${selectedServices.join(',')}`}
            selectedServiceIds={selectedServices} 
          />
        )}

        {/* Service Limit Info Banner */}
        {(() => {
          const userTier = getUserTier();
          const serviceCheck = canAddService(userTier, selectedServices.length);
          const isAtLimit = serviceCheck.limit !== -1 && !serviceCheck.allowed;
          
          if (isAtLimit) {
            return (
              <div className="bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-200 dark:border-blue-800 rounded-xl p-4 mb-6">
                <div className="flex items-start gap-3">
                  <Info className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-1">
                      Service Limit Reached ({serviceCheck.current}/{serviceCheck.limit})
                    </p>
                    <p className="text-sm text-blue-800 dark:text-blue-200">
                      {t('serviceCatalog.limits.canSwapServices', { limit: serviceCheck.limit })}
                    </p>
                    <p className="text-xs text-blue-700 dark:text-blue-300 mt-2">
                      {t('serviceCatalog.limits.upgradeForUnlimited')}
                    </p>
                  </div>
                  <button
                    onClick={() => navigate('/pricing')}
                    className="px-3 py-1.5 text-xs font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors whitespace-nowrap"
                  >
                    Upgrade
                  </button>
                </div>
              </div>
            );
          }
          return null;
        })()}

        {/* Service Grid */}
        <div 
          id="service-list"
          key={`service-grid-${filteredServices.length}-${searchQuery}-${sortBy}-${selectedCategoryFilters.join(',')}`}
          className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 p-6 mb-6"
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
            <div className="flex-1">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                {ratedServices.length > 0 && (
                  <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0" />
                )}
                <span>
                  Services ({filteredServices.length})
                  {ratedServices.length > 0 && (
                    <span className="text-base font-normal text-gray-600 dark:text-gray-400 ml-2">
                      - all rated with privacy exposure index analysis
                    </span>
                  )}
                  {ratedServices.length > 0 && nonRatedServices.length > 0 && (
                    <span className="text-sm font-normal text-gray-500 dark:text-gray-400 ml-2">
                      ({nonRatedServices.length} not yet rated)
                    </span>
                  )}
                </span>
              </h2>
            </div>
            <div className="flex items-center gap-3 flex-wrap">
              {/* Sort Dropdown - Moved here, separate from search */}
              <div className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-gray-400 flex-shrink-0" />
                <label htmlFor="sort-select" className="sr-only">{t('serviceCatalog.sortServicesBy')}</label>
                <select
                  id="sort-select"
                  value={sortBy}
                  onChange={(e) => {
                    const newSortBy = e.target.value;
                    setSortBy(newSortBy);
                    if (import.meta.env.DEV) {
                      console.log('[ServiceCatalog] Sort changed to:', newSortBy);
                    }
                  }}
                  className="px-4 py-2 text-sm border-2 border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 cursor-pointer min-w-[180px]"
                  aria-label={t('serviceCatalog.sortServicesBy')}
                >
                  <option value="exposure">{t('serviceCatalog.sortByExposureIndex')}</option>
                  <option value="name">{t('serviceCatalog.sortByName')}</option>
                  <option value="risk">{t('serviceCatalog.sortByRiskLevel')}</option>
                  <option value="category">{t('serviceCatalog.sortByCategory')}</option>
                </select>
              </div>
              {selectedServices.length > 0 && (
                <button
                  type="button"
                  onClick={() => {
                    const element = document.getElementById('selected-services');
                    if (element) {
                      element.scrollIntoView({ behavior: 'smooth' });
                    }
                  }}
                  className="text-sm text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
                >
                  View Selected ({selectedServices.length})
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Rated Services Section */}
          {displayedRated.length > 0 && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 mb-6">
                {displayedRated.map(service => {
                  // Validate service has required properties
                  if (!service || !service.id) {
                    if (import.meta.env.DEV) {
                      console.warn('[ServiceCatalog] Invalid service object:', service);
                    }
                    return null;
                  }

                  const isSelected = Array.isArray(selectedServices) && selectedServices.includes(service.id);
                  const details = getServiceDetails(service.id);
                  const notificationsEnabled = notificationPrefs[service.id] !== false;
                  const exposureIndex = getPrivacyExposureIndex(service.id);
                  const exposureLevel = getExposureLevel(exposureIndex);
                  const riskLevel = getRiskLevel(service.id);
                  const relationship = serviceRelationships[service.id];
                  // Fallback to parent_company from enhanced service data if relationship not found
                  const enhancedService = getEnhancedService(service.id);
                  const parentCompany = relationship?.parentName || enhancedService?.parent_company || 'Unspecified';

                  return (
                <div
                  key={service.id}
                  className={`group relative p-4 rounded-xl border-2 transition-all cursor-pointer hover:shadow-lg hover:scale-[1.02] ${
                    isSelected
                      ? 'border-blue-500 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/20 shadow-md'
                      : details.isHighlighted
                        ? 'border-orange-400 dark:border-orange-600 bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/10'
                        : 'border-gray-200 dark:border-gray-600 bg-white dark:bg-slate-700 hover:border-gray-400 dark:hover:border-gray-500'
                  }`}
                  onClick={(e) => {
                    // Ensure click is not on a button or interactive element
                    if (e.target.tagName === 'BUTTON' || e.target.closest('button')) {
                      return;
                    }
                    setSelectedServiceForDetails(service.id);
                  }}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      setSelectedServiceForDetails(service.id);
                    }
                  }}
                  aria-label={`View details for ${service.name}`}
                >
                  {/* Category icon on the top right */}
                  <div className="absolute top-2 right-2 z-10 w-8 h-8 flex-shrink-0 flex items-center justify-center bg-gray-100 dark:bg-gray-700 rounded-lg border border-gray-300 dark:border-gray-600">
                    {(() => {
                      const CategoryIcon = getCategoryIcon(service.category);
                      return <CategoryIcon className="w-4 h-4 text-gray-600 dark:text-gray-400" />;
                    })()}
                  </div>
                  
                  {/* Selection Indicator Badge - bottom right */}
                  {isSelected && (
                    <div className="absolute bottom-2 right-2 z-10">
                      <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center shadow-lg">
                        <CheckCircle className="w-4 h-4 text-white" />
                      </div>
                    </div>
                  )}
                  
                  {/* Header Row - Service Logo, Name */}
                  <div className="flex items-start gap-3 mb-3">
                    <ServiceIcon 
                      serviceId={service.id}
                      serviceName={service.name}
                      category={service.category}
                      theme={theme}
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-gray-900 dark:text-white text-base mb-1 truncate text-left">
                        {service.name}
                      </h3>
                      <p className="text-xs text-gray-500 dark:text-gray-400 capitalize text-left">
                        {service.category.replace('-', ' ')}{service.subcategory ? ` • ${service.subcategory.replace('-', ' ')}` : ''}
                      </p>
                    </div>
                  </div>

                  {/* Service Exposure Index - Enhanced Visual Display */}
                  {(() => {
                    // Always show the exposure index section for consistent card layout
                    // Show placeholder when exposureIndex is null
                    const hasExposureIndex = exposureIndex !== null;
                    
                    // Enhanced color mapping with gradients
                    const exposureColors = {
                      'very-high': {
                        gradient: 'from-red-500 to-red-600',
                        bg: 'bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/40 dark:to-red-800/30',
                        text: 'text-red-700 dark:text-red-300',
                        border: 'border-red-400 dark:border-red-600',
                        bar: 'bg-gradient-to-r from-red-500 to-red-600',
                        iconBg: 'bg-red-500',
                        meaning: t('serviceCatalog.riskMeanings.veryHigh')
                      },
                      'high': {
                        gradient: 'from-orange-500 to-orange-600',
                        bg: 'bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/40 dark:to-orange-800/30',
                        text: 'text-orange-700 dark:text-orange-300',
                        border: 'border-orange-400 dark:border-orange-600',
                        bar: 'bg-gradient-to-r from-orange-500 to-orange-600',
                        iconBg: 'bg-orange-500',
                        meaning: t('serviceCatalog.riskMeanings.high')
                      },
                      'medium': {
                        gradient: 'from-yellow-500 to-yellow-600',
                        bg: 'bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-900/40 dark:to-yellow-800/30',
                        text: 'text-yellow-700 dark:text-yellow-300',
                        border: 'border-yellow-400 dark:border-yellow-600',
                        bar: 'bg-gradient-to-r from-yellow-500 to-yellow-600',
                        iconBg: 'bg-yellow-500',
                        meaning: t('serviceCatalog.riskMeanings.medium')
                      },
                      'low': {
                        gradient: 'from-green-500 to-green-600',
                        bg: 'bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/40 dark:to-green-800/30',
                        text: 'text-green-700 dark:text-green-300',
                        border: 'border-green-400 dark:border-green-600',
                        bar: 'bg-gradient-to-r from-green-500 to-green-600',
                        iconBg: 'bg-green-500',
                        meaning: t('serviceCatalog.riskMeanings.low')
                      }
                    };
                    
                    // Use default colors when exposure index is not available
                    const defaultColors = {
                      bg: 'bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800/40 dark:to-gray-700/30',
                      text: 'text-gray-700 dark:text-gray-300',
                      border: 'border-gray-300 dark:border-gray-600',
                      bar: 'bg-gradient-to-r from-gray-400 to-gray-500',
                      iconBg: 'bg-gray-500',
                      meaning: t('serviceCatalog.riskMeanings.notAvailable') || 'Analysis pending'
                    };
                    
                    const levelKey = hasExposureIndex ? exposureLevel.level.toLowerCase().replace(' ', '-') : null;
                    const colors = hasExposureIndex && levelKey && exposureColors[levelKey] 
                      ? exposureColors[levelKey] 
                      : defaultColors;
                    const displayIndex = hasExposureIndex ? exposureIndex : null;
                    const displayLevel = hasExposureIndex ? exposureLevel.level : 'N/A';
                    
                    return (
                      <div className={`mb-3 p-4 rounded-xl border-2 ${colors.bg} ${colors.border} shadow-sm`}>
                        {/* Service Exposure Index Header */}
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <div className={`w-10 h-10 ${colors.iconBg} rounded-lg flex items-center justify-center shadow-md`}>
                              <Gauge className="w-6 h-6 text-white" />
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <span className={`text-xs font-bold uppercase tracking-wide ${colors.text}`}>
                                  {t('serviceCatalog.serviceExposureIndex')}
                                </span>
                              </div>
                              <p className="text-[10px] text-gray-600 dark:text-gray-400 mt-0.5">
                                {colors.meaning}
                              </p>
                            </div>
                          </div>
                        </div>
                        
                        {/* Large Exposure Score Display */}
                        <div className="flex items-end justify-between mb-3">
                          <div className="flex items-baseline gap-1">
                            {hasExposureIndex ? (
                              <>
                                <span className={`text-4xl font-extrabold ${colors.text} leading-none`}>
                                  {displayIndex}
                                </span>
                                <span className={`text-lg font-semibold ${colors.text} opacity-70`}>
                                  /100
                                </span>
                              </>
                            ) : (
                              <span className={`text-2xl font-bold ${colors.text} opacity-60`}>
                                {t('serviceCatalog.notAvailable') || 'N/A'}
                              </span>
                            )}
                          </div>
                          <div className={`px-3 py-1.5 rounded-lg ${colors.bg} border ${colors.border}`}>
                            <span className={`text-sm font-bold uppercase ${colors.text}`}>
                              {displayLevel}
                            </span>
                          </div>
                        </div>
                        
                        {/* Enhanced Progress Bar */}
                        <div className="relative">
                          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 mb-2 shadow-inner">
                            {hasExposureIndex ? (
                              <div
                                className={`h-3 rounded-full transition-all duration-500 ${colors.bar} shadow-sm relative overflow-hidden`}
                                style={{ width: `${displayIndex}%` }}
                              >
                                {/* Animated shine effect */}
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
                              </div>
                            ) : (
                              <div className="h-3 rounded-full bg-gray-300 dark:bg-gray-600 w-full opacity-50" />
                            )}
                          </div>
                          <div className="flex items-center justify-between text-[10px] text-gray-600 dark:text-gray-400">
                            <span>{t('serviceCatalog.exposureScaleMin')}</span>
                            {hasExposureIndex ? (
                              <span className="font-medium">{t('serviceCatalog.exposedPercentage', { percent: displayIndex })}</span>
                            ) : (
                              <span className="font-medium opacity-60">{t('serviceCatalog.calculating') || 'Calculating...'}</span>
                            )}
                            <span>{t('serviceCatalog.exposureScaleMax')}</span>
                          </div>
                        </div>
                        
                        {/* Quick Context */}
                        {hasExposureIndex && (
                          <div className="mt-2 pt-2 border-t border-gray-300 dark:border-gray-600">
                            <p className="text-[10px] text-gray-600 dark:text-gray-400 leading-tight">
                              {exposureIndex >= 70 && t('serviceCatalog.privacyConcerns.high')}
                              {exposureIndex >= 50 && exposureIndex < 70 && t('serviceCatalog.privacyConcerns.moderate')}
                              {exposureIndex >= 30 && exposureIndex < 50 && t('serviceCatalog.privacyConcerns.someControls')}
                              {exposureIndex < 30 && t('serviceCatalog.privacyConcerns.betterPractices')}
                            </p>
                          </div>
                        )}
                      </div>
                    );
                  })()}

                  {/* Parent Company Badge */}
                  {(relationship?.parent || parentCompany) && (
                    <div className="mb-3 flex items-center gap-2 px-2 py-1.5 rounded-lg bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800">
                      <Building className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                      <span className="text-xs font-medium text-purple-700 dark:text-purple-300">
                        Owned by {parentCompany}
                      </span>
                    </div>
                  )}
                  
                  {/* Action Buttons Row */}
                  <div className="flex items-center gap-2 mt-2 pt-2 border-t border-gray-200 dark:border-gray-600">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedServiceForDetails(service.id);
                      }}
                      className="flex-1 px-2 py-1.5 text-xs font-medium bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors flex items-center justify-center gap-1"
                    >
                      <Info className="w-3 h-3" />
                      Details
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleServiceSelection(service.id);
                      }}
                      className={`flex-1 px-2 py-1.5 text-xs font-medium rounded transition-colors flex items-center justify-center gap-1 ${
                        isSelected
                          ? 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 hover:bg-red-100 dark:hover:bg-red-900/30'
                          : 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 hover:bg-green-100 dark:hover:bg-green-900/30'
                      }`}
                    >
                      {isSelected ? (
                        <>
                          <X className="w-3 h-3" />
                          Remove
                        </>
                      ) : (
                        <>
                          <CheckCircle className="w-3 h-3" />
                          Select
                        </>
                      )}
                    </button>
                    {isSelected && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleNotificationPreference(service.id);
                        }}
                        className="px-2 py-1.5 text-xs rounded bg-white dark:bg-slate-600 hover:bg-gray-100 dark:hover:bg-slate-500 transition-colors border border-gray-200 dark:border-gray-500"
                        title={notificationsEnabled ? 'Disable notifications' : 'Enable notifications'}
                      >
                        {notificationsEnabled ? (
                          <Bell className="w-3 h-3 text-blue-600" />
                        ) : (
                          <BellOff className="w-3 h-3 text-gray-400" />
                        )}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
              </div>
            </>
          )}

          {/* Non-Rated Services Section */}
          {displayedNonRated.length > 0 && (
            <>
              <div className="mb-4 pt-6 border-t border-gray-200 dark:border-slate-600">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                  Services Not Yet Rated ({displayedNonRated.length}{!showFullCatalog && nonRatedServices.length > displayedNonRated.length ? ` of ${nonRatedServices.length}` : ''})
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  {t('serviceCatalog.nonRatedServicesDescription') || 'These services are in our catalog but do not yet have privacy exposure index analysis. Ratings are added as we analyze each service.'}
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                {displayedNonRated.map(service => {
                  // Validate service has required properties
                  if (!service || !service.id) {
                    if (import.meta.env.DEV) {
                      console.warn('[ServiceCatalog] Invalid service object:', service);
                    }
                    return null;
                  }

                  const isSelected = Array.isArray(selectedServices) && selectedServices.includes(service.id);
                  const details = getServiceDetails(service.id);
                  const notificationsEnabled = notificationPrefs[service.id] !== false;
                  const exposureIndex = getPrivacyExposureIndex(service.id);
                  const exposureLevel = getExposureLevel(exposureIndex);
                  const riskLevel = getRiskLevel(service.id);
                  const relationship = serviceRelationships[service.id];
                  // Fallback to parent_company from enhanced service data if relationship not found
                  const enhancedService = getEnhancedService(service.id);
                  const parentCompany = relationship?.parentName || enhancedService?.parent_company || 'Unspecified';

                  return (
                    <div
                      key={service.id}
                      className={`group relative p-4 rounded-xl border-2 transition-all cursor-pointer hover:shadow-lg hover:scale-[1.02] ${
                        isSelected
                          ? 'border-blue-500 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/20 shadow-md'
                          : details.isHighlighted
                            ? 'border-orange-400 dark:border-orange-600 bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/10'
                            : 'border-gray-200 dark:border-gray-600 bg-white dark:bg-slate-700 hover:border-gray-400 dark:hover:border-gray-500'
                      }`}
                      onClick={(e) => {
                        if (e.target.tagName === 'BUTTON' || e.target.closest('button')) {
                          return;
                        }
                        setSelectedServiceForDetails(service.id);
                      }}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          setSelectedServiceForDetails(service.id);
                        }
                      }}
                      aria-label={`View details for ${service.name}`}
                    >
                      {/* Category icon top-right (same as rated cards) */}
                      <div className="absolute top-2 right-2 z-10 w-8 h-8 flex-shrink-0 flex items-center justify-center bg-gray-100 dark:bg-gray-700 rounded-lg border border-gray-300 dark:border-gray-600">
                        {(() => {
                          const CategoryIcon = getCategoryIcon(service.category);
                          return <CategoryIcon className="w-4 h-4 text-gray-600 dark:text-gray-400" />;
                        })()}
                      </div>

                      {/* Selection Indicator Badge - bottom right (same as rated) */}
                      {isSelected && (
                        <div className="absolute bottom-2 right-2 z-10">
                          <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center shadow-lg">
                            <CheckCircle className="w-4 h-4 text-white" />
                          </div>
                        </div>
                      )}

                      {/* Header Row - Service Logo, Name (same structure as rated) */}
                      <div className="flex items-start gap-3 mb-3">
                        <ServiceIcon 
                          serviceId={service.id}
                          serviceName={service.name}
                          category={service.category}
                          theme={theme}
                        />
                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold text-gray-900 dark:text-white text-base mb-1 truncate">
                            {service.name}
                          </h3>
                          <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                            {service.category.replace('-', ' ')}{service.subcategory ? ` • ${service.subcategory.replace('-', ' ')}` : ''}
                          </p>
                        </div>
                      </div>

                      {/* Placeholder for Exposure Index - "Not Yet Rated" (same content area style as rated) */}
                      <div className="mb-3 p-4 rounded-xl border-2 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800/40 dark:to-gray-700/30 border-gray-300 dark:border-gray-600 shadow-sm">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <div className="w-10 h-10 bg-gray-500 rounded-lg flex items-center justify-center shadow-md">
                              <Gauge className="w-6 h-6 text-white" />
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="text-xs font-bold uppercase tracking-wide text-gray-700 dark:text-gray-300">
                                  {t('serviceCatalog.serviceExposureIndex')}
                                </span>
                              </div>
                              <p className="text-[10px] text-gray-600 dark:text-gray-400 mt-0.5">
                                {t('serviceCatalog.riskMeanings.notAvailable') || 'Analysis pending'}
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="text-center py-4">
                          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                            {t('serviceCatalog.notYetRated') || 'Privacy analysis pending'}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                            {t('serviceCatalog.ratingComingSoon') || 'This service will be rated soon'}
                          </p>
                        </div>
                      </div>

                      {/* Parent Company Badge (same as rated when present) */}
                      {(relationship?.parent || parentCompany) && (
                        <div className="mb-3 flex items-center gap-2 px-2 py-1.5 rounded-lg bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800">
                          <Building className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                          <span className="text-xs font-medium text-purple-700 dark:text-purple-300">
                            Owned by {parentCompany}
                          </span>
                        </div>
                      )}

                      {/* Action Buttons Row (same as rated: Details, Select/Remove, Notifications when selected) */}
                      <div className="flex items-center gap-2 mt-2 pt-2 border-t border-gray-200 dark:border-gray-600">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedServiceForDetails(service.id);
                          }}
                          className="flex-1 px-2 py-1.5 text-xs font-medium bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors flex items-center justify-center gap-1"
                        >
                          <Info className="w-3 h-3" />
                          Details
                        </button>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleServiceSelection(service.id);
                          }}
                          className={`flex-1 px-2 py-1.5 text-xs font-medium rounded transition-colors flex items-center justify-center gap-1 ${
                            isSelected
                              ? 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 hover:bg-red-100 dark:hover:bg-red-900/30'
                              : 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 hover:bg-green-100 dark:hover:bg-green-900/30'
                          }`}
                        >
                          {isSelected ? (
                            <>
                              <X className="w-3 h-3" />
                              Remove
                            </>
                          ) : (
                            <>
                              <CheckCircle className="w-3 h-3" />
                              Select
                            </>
                          )}
                        </button>
                        {isSelected && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleNotificationPreference(service.id);
                            }}
                            className="px-2 py-1.5 text-xs rounded bg-white dark:bg-slate-600 hover:bg-gray-100 dark:hover:bg-slate-500 transition-colors border border-gray-200 dark:border-gray-500"
                            title={notificationsEnabled ? 'Disable notifications' : 'Enable notifications'}
                          >
                            {notificationsEnabled ? (
                              <Bell className="w-3 h-3 text-blue-600" />
                            ) : (
                              <BellOff className="w-3 h-3 text-gray-400" />
                            )}
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}

          {/* See full catalog CTA when initially capped */}
          {hasMoreToShow && (
            <div className="mt-6 pt-6 border-t border-gray-200 dark:border-slate-600 text-center">
              <button
                type="button"
                onClick={() => setShowFullCatalog(true)}
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all font-semibold inline-flex items-center gap-2 shadow-md hover:shadow-lg"
              >
                {t('serviceCatalog.seeFullCatalog', { count: filteredServices.length - INITIAL_DISPLAY_LIMIT })}
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          )}

          {/* Empty State */}
          {ratedServices.length === 0 && nonRatedServices.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-600 dark:text-gray-400">
                {t('serviceCatalog.noServicesFound') || 'No services match your filters.'}
              </p>
            </div>
          )}
        </div>

        {/* Selected Services Risk Details */}
        {selectedServiceDetails.length > 0 && (
          <div 
            id="selected-services" 
            key={`selected-services-${selectedServiceDetails.length}-${selectedServiceDetails.map(s => s.id).join(',')}`}
            className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex-1">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  {t('serviceCatalog.yourServicesPrivacyAnalysis')} ({selectedServiceDetails.length})
                </h2>
                <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300 mt-2">
                  {t('serviceCatalog.yourServicesPrivacyAnalysisDescription')}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => navigate('/exposure-report')}
                  className="px-4 py-2 bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-medium rounded-lg hover:from-purple-600 hover:to-indigo-700 transition-all transform hover:scale-105 flex items-center gap-2 text-sm"
                >
                  <BarChart3 className="w-4 h-4" />
                  {t('serviceCatalog.viewDigitalFootprintAnalysis')}
                </button>
                {!hasSeenServiceEmailModal && (
                  <button
                    type="button"
                    onClick={() => setShowEmailCapture(true)}
                    className="px-4 py-2 bg-gradient-to-r from-accent to-accent-dark text-white font-medium rounded-lg hover:from-accent-dark hover:to-accent transition-all transform hover:scale-105 flex items-center gap-2 text-sm"
                  >
                    <Bell className="w-4 h-4" />
                    Subscribe to Updates
                  </button>
                )}
              </div>
            </div>
            <div className="space-y-6">
              {selectedServiceDetails.map(service => (
                <div
                  key={service.id}
                  className={`p-6 rounded-lg border ${
                    service.isHighlighted
                      ? 'border-orange-300 dark:border-orange-600 bg-orange-50 dark:bg-orange-900/10'
                      : 'border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-slate-700'
                  }`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start gap-3 flex-1">
                      {(() => {
                        const logoUrl = getServiceLogoUrl(service.id, theme === 'dark');
                        return logoUrl ? (
                          <div className="w-12 h-12 flex-shrink-0 flex items-center justify-center bg-white dark:bg-gray-800 rounded-lg p-2 border border-gray-200 dark:border-gray-700 shadow-sm">
                            <img
                              src={logoUrl}
                              alt={`${service.name} logo`}
                              className="w-full h-full object-contain"
                              onError={(e) => {
                                // Hide image if it fails to load
                                e.target.parentElement.style.display = 'none';
                              }}
                            />
                          </div>
                        ) : null;
                      })()}
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                          {service.name}
                        </h3>
                        {service.isHighlighted && (
                          <span className="mt-1 inline-block px-2 py-1 bg-orange-100 dark:bg-orange-800 text-orange-800 dark:text-orange-200 text-xs font-medium rounded">
                            {t('serviceCatalog.priorityForProfile')}
                          </span>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={() => toggleNotificationPreference(service.id)}
                      className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-slate-600 transition-colors"
                      title={notificationPrefs[service.id] === false ? t('serviceCatalog.enableNotifications') : t('serviceCatalog.disableNotifications')}
                    >
                      {notificationPrefs[service.id] !== false ? (
                        <Bell className="w-5 h-5 text-blue-600" />
                      ) : (
                        <BellOff className="w-5 h-5 text-gray-400" />
                      )}
                    </button>
                  </div>

                  {/* Service Exposure Index - Detailed View */}
                  {(() => {
                    const exposureIndex = getPrivacyExposureIndex(service.id);
                    const exposureLevel = getExposureLevel(exposureIndex);
                    return (
                      <div className="mb-4 p-4 bg-gray-50 dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-slate-600">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <Gauge className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                            <h4 className="font-semibold text-gray-900 dark:text-white text-sm">
                              {t('serviceCatalog.serviceExposureIndex')}
                            </h4>
                            <span className="text-xs text-gray-500 dark:text-gray-400" title="Privacy Exposure Index for this specific service only (0-100, higher = more risk). This is different from your overall Privacy Exposure Score which aggregates all your selected services.">
                              {t('serviceCatalog.thisServiceOnly')}
                            </span>
                            <a
                              href="/privacy-exposure-disclaimer"
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
                              title={t('serviceCatalog.learnScoreCalculation')}
                            >
                              (?)
                            </a>
                            {isPremium ? (
                              <span className="px-2 py-0.5 text-xs font-semibold rounded bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                                Advanced
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 text-xs font-semibold rounded bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300">
                                Basic
                              </span>
                            )}
                          </div>
                          <span className={`text-2xl font-bold ${exposureLevel.textColor}`}>
                            {exposureIndex !== null ? exposureIndex : 'N/A'}
                            {exposureIndex !== null && <span className="text-sm ml-1">/100</span>}
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2.5 mb-2">
                          <div
                            className={`h-2.5 rounded-full transition-all ${exposureLevel.barColor}`}
                            style={{ width: `${exposureIndex || 0}%` }}
                          />
                        </div>
                        <div className="flex items-center justify-between mb-2">
                          <span className={`text-sm font-medium ${exposureLevel.textColor}`}>
                            {exposureLevel.level} Exposure
                          </span>
                          <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
                            {isPremium ? '8-factor analysis' : '4-factor analysis'}
                          </span>
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {isPremium ? (
                            'Comprehensive 8-factor analysis including regulatory complexity, data sensitivity, user control mechanisms, and parent company relationships'
                          ) : (
                            <span>
                              Basic 4-factor analysis -{' '}
                              <button
                                type="button"
                                onClick={() => navigate('/pricing')}
                                className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
                              >
                                Upgrade to Advanced
                              </button>
                              {' '}for 8-factor comprehensive analysis
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })()}

                  <div className="mb-4">
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2 text-sm">
                      Typical Privacy Risks:
                    </h4>
                    <ul className="space-y-1">
                      {service.typicalRisks?.slice(0, 3).map((risk, idx) => (
                        <li key={idx} className="text-sm text-gray-700 dark:text-gray-300 flex items-start">
                          <AlertTriangle className="w-4 h-4 mr-2 mt-0.5 text-orange-500 flex-shrink-0" />
                          {risk}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mb-4">
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2 text-sm">
                      Recommended Actions:
                    </h4>
                    <ul className="space-y-2">
                      {service.recommendedActions?.slice(0, 3).map((action, idx) => {
                        const actionId = `${service.id}-action-${idx}`;
                        const incompleteActions = serviceNotificationManager.getIncompleteActions(service.id);
                        const isCompleted = !incompleteActions.find(a => a.id === actionId);
                        
                        return (
                          <li key={idx} className="text-sm text-gray-700 dark:text-gray-300 flex items-start justify-between group">
                            <div className="flex items-start flex-1">
                              {isCompleted ? (
                                <CheckCircle className="w-4 h-4 mr-2 mt-0.5 text-green-500 flex-shrink-0" />
                              ) : (
                                <div className="w-4 h-4 mr-2 mt-0.5 rounded-full border-2 border-gray-300 dark:border-gray-600 flex-shrink-0" />
                              )}
                              <span className={isCompleted ? 'line-through text-gray-500 dark:text-gray-500' : ''}>
                                {action}
                              </span>
                            </div>
                            {!isCompleted && (
                              <button
                                onClick={() => handleActionComplete(service.id, actionId)}
                                className="ml-2 px-2 py-1 text-xs text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                                title="Mark as completed"
                              >
                                Complete
                              </button>
                            )}
                          </li>
                        );
                      })}
                    </ul>
                  </div>

                  {/* Service Notifications */}
                  {notificationsByService[service.id] && notificationsByService[service.id].length > 0 && (
                    <div className="mb-4 mt-4 pt-4 border-t border-gray-200 dark:border-gray-600">
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-3 text-sm flex items-center gap-2">
                        <Bell className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                        Privacy Updates ({notificationsByService[service.id].length})
                      </h4>
                      <div className="space-y-2">
                        {notificationsByService[service.id].slice(0, 3).map((notif, idx) => {
                          const IconComponent = getNotificationIconComponent(notif.icon || 'bell');
                          const priorityColors = {
                            high: 'border-red-300 dark:border-red-700 bg-red-50 dark:bg-red-900/20',
                            medium: 'border-orange-300 dark:border-orange-700 bg-orange-50 dark:bg-orange-900/20',
                            low: 'border-blue-300 dark:border-blue-700 bg-blue-50 dark:bg-blue-900/20'
                          };
                          
                          return (
                            <div
                              key={idx}
                              className={`p-3 rounded-lg border ${priorityColors[notif.priority] || priorityColors.medium}`}
                            >
                              <div className="flex items-start gap-2">
                                <IconComponent className={`w-4 h-4 mt-0.5 flex-shrink-0 ${
                                  notif.priority === 'high' ? 'text-red-600 dark:text-red-400' :
                                  notif.priority === 'medium' ? 'text-orange-600 dark:text-orange-400' :
                                  'text-blue-600 dark:text-blue-400'
                                }`} />
                                <div className="flex-1 min-w-0">
                                  <div className="font-medium text-xs text-gray-900 dark:text-white mb-1">
                                    {notif.title}
                                  </div>
                                  <div className="text-xs text-gray-700 dark:text-gray-300">
                                    {notif.message}
                                  </div>
                                  {notif.relatedServices && notif.relatedServices.length > 0 && (
                                    <div className="mt-1 text-xs text-gray-600 dark:text-gray-400">
                                      Related: {notif.relatedServices.map(id => {
                                        const s = serviceCatalog.find(s => s.id === id);
                                        return s?.name || id;
                                      }).join(', ')}
                                    </div>
                                  )}
                                  {notif.action && (
                                    <a
                                      href={notif.action.url}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="mt-2 inline-flex items-center gap-1 text-xs text-blue-600 dark:text-blue-400 hover:underline"
                                    >
                                      {notif.action.label}
                                      <ExternalLink className="w-3 h-3" />
                                    </a>
                                  )}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                        {notificationsByService[service.id].length > 3 && (
                          <button
                            onClick={() => {
                              // Scroll to notifications section or expand
                              const element = document.getElementById(`notifications-${service.id}`);
                              if (element) {
                                element.scrollIntoView({ behavior: 'smooth' });
                              }
                            }}
                            className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
                          >
                            View all {notificationsByService[service.id].length} notifications
                          </button>
                        )}
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <Shield className="w-4 h-4" />
                      <span>Regulations: {service.regulations?.join(', ')}</span>
                    </div>
                    {serviceNotificationManager.getPolicyUrl(service.id) !== '#' && (
                      <a
                        href={serviceNotificationManager.getPolicyUrl(service.id)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
                      >
                        Privacy Policy
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {selectedServiceDetails.length === 0 && (
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 p-12 text-center">
            <img 
              src="/socialcaution.png" 
              alt="SocialCaution Logo" 
              className="w-16 h-16 mx-auto mb-4 object-contain"
            />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Ready to Start Monitoring?
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6 max-w-md mx-auto">
              Select the services you use above to unlock real-time privacy insights, risk assessments, and personalized recommendations that update instantly as you build your privacy profile.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              {selectedServices.length > 0 ? (
                // If services are selected, guide to next step
                <>
                  <button
                    onClick={() => navigate('/assessment')}
                    className="px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-medium flex items-center justify-center gap-2"
                  >
                    Start Assessment
                    <ArrowRight className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => navigate('/dashboard')}
                    className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors font-medium flex items-center justify-center gap-2"
                  >
                    View Dashboard
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </>
              ) : (
                // If no services selected, scroll to service grid
                <button
                  onClick={() => {
                    const element = document.getElementById('service-list');
                    if (element) {
                      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }
                  }}
                  className="px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-medium flex items-center justify-center gap-2"
                >
                  Select Services Above
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        )}

        {/* Upgrade Prompt for Basic Version users */}
        {selectedServices.length >= 3 && (
          <div className="mt-8">
            <UpgradePrompt 
              source="service_catalog"
              compact={true}
              servicesCount={selectedServices.length}
            />
          </div>
        )}

        {/* Detailed Service Card Modal */}
        {selectedServiceForDetails && (() => {
          const service = getServiceDetails(selectedServiceForDetails);
          const exposureIndex = getPrivacyExposureIndex(service.id);
          const exposureLevel = getExposureLevel(exposureIndex);
          const riskLevel = getRiskLevel(service.id);
          const relationship = serviceRelationships[service.id];
          // Fallback to parent_company from enhanced service data if relationship not found
          const enhancedService = getEnhancedService(service.id);
          const parentCompany = relationship?.parentName || enhancedService?.parent_company;
          const isSelected = Array.isArray(selectedServices) && selectedServices.includes(service.id);
          
          return (
            <div 
              className="fixed inset-0 bg-black/50 dark:bg-black/70 z-50 flex items-center justify-center p-4"
              onClick={() => setSelectedServiceForDetails(null)}
            >
              <div 
                className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Modal Header */}
                <div className="sticky top-0 bg-white dark:bg-slate-800 border-b border-gray-200 dark:border-slate-700 p-6 flex items-start justify-between z-10">
                  <div className="flex items-start gap-4 flex-1">
                    <ServiceIcon 
                      serviceId={service.id}
                      serviceName={service.name}
                      category={service.category}
                      theme={theme}
                    />
                    <div className="flex-1">
                      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                        {service.name}
                      </h2>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                        {service.category?.replace('-', ' ')} • {service.description || 'Online service'}
                      </p>
                      <div className="flex flex-wrap items-center gap-2">
                        {(() => {
                          const riskColors = {
                            high: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300',
                            medium: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300',
                            low: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',
                            unknown: 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
                          };
                          return (
                            <span className={`px-2 py-1 text-xs rounded font-medium ${riskColors[riskLevel]}`}>
                              {riskLevel.toUpperCase()} RISK
                            </span>
                          );
                        })()}
                        {(relationship?.parent || parentCompany) && (
                          <span className="px-2 py-1 text-xs rounded bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 font-medium flex items-center gap-1">
                            <Building className="w-3 h-3" />
                            {parentCompany}
                          </span>
                        )}
                        {service.isHighlighted && (
                          <span className="px-2 py-1 text-xs rounded bg-orange-100 dark:bg-orange-800 text-orange-800 dark:text-orange-200 font-medium">
                            {t('serviceCatalog.priorityForProfile')}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => toggleServiceSelection(service.id)}
                      className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${
                        isSelected
                          ? 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 hover:bg-red-100 dark:hover:bg-red-900/30'
                          : (() => {
                              const userTier = getUserTier();
                              const canAdd = canAddService(userTier, selectedServices.length);
                              return canAdd.allowed
                                ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 hover:bg-green-100 dark:hover:bg-green-900/30'
                                : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed opacity-60';
                            })()
                      }`}
                      disabled={!isSelected && (() => {
                        const userTier = getUserTier();
                        const canAdd = canAddService(userTier, selectedServices.length);
                        return !canAdd.allowed;
                      })()}
                      title={!isSelected && (() => {
                        const userTier = getUserTier();
                        const canAdd = canAddService(userTier, selectedServices.length);
                        return !canAdd.allowed 
                          ? t('serviceCatalog.limits.serviceLimitReachedShort', { limit: canAdd.limit })
                          : '';
                      })()}
                    >
                      {isSelected ? (
                        <>
                          <X className="w-4 h-4" />
                          Remove
                        </>
                      ) : (
                        <>
                          <CheckCircle className="w-4 h-4" />
                          Add to My Services
                        </>
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedServiceForDetails(null)}
                      className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"
                      aria-label="Close"
                    >
                      <X className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                    </button>
                  </div>
                </div>
                
                {/* Modal Content */}
                <div className="p-6 space-y-6">
                  {/* Service Exposure Index */}
                  {exposureIndex !== null && (
                    <div className="p-4 bg-gray-50 dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-slate-600">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <Gauge className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                          <h3 className="font-semibold text-gray-900 dark:text-white">
                            {t('serviceCatalog.serviceExposureIndex')}
                          </h3>
                          <span className="text-xs text-gray-500 dark:text-gray-400" title="This is the exposure index for this specific service, not your personal digital footprint">
                            (Service-specific)
                          </span>
                          {isPremium ? (
                            <span className="px-2 py-0.5 text-xs font-semibold rounded bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                              Advanced
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 text-xs font-semibold rounded bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300">
                              Basic
                            </span>
                          )}
                        </div>
                        <span className={`text-3xl font-bold ${exposureLevel.textColor}`}>
                          {exposureIndex}
                          <span className="text-lg ml-1">/100</span>
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-3 mb-2">
                        <div
                          className={`h-3 rounded-full transition-all ${exposureLevel.barColor}`}
                          style={{ width: `${exposureIndex}%` }}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className={`text-sm font-medium ${exposureLevel.textColor}`}>
                          {exposureLevel.level} Exposure
                        </span>
                        <span className="text-xs text-gray-600 dark:text-gray-400">
                          {isPremium ? '8-factor analysis' : '4-factor analysis'}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Analysis Factors - 4-factor breakdown and summary (moved from card into Details) */}
                  {(exposureIndex !== null || service.regulations?.length || service.typicalRisks?.length || service.recommendedActions?.length) && (
                    <div className="p-4 bg-gray-50 dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-slate-600">
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                        <Info className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                        {t('serviceCatalog.analysisFactors')}
                      </h3>
                      {/* 4-Factor breakdown when available */}
                      {(() => {
                        try {
                          const breakdown = getSimplifiedExposureBreakdown(service.id);
                          if (!breakdown?.factors) return null;
                          const factors = [
                            { key: 'dataBreachHistory', icon: Database, label: t('serviceCatalog.breachHistory'), color: 'red', factor: breakdown.factors.dataBreachHistory },
                            { key: 'knownPrivacyIssues', icon: AlertCircle, label: t('serviceCatalog.privacyIssues'), color: 'orange', factor: breakdown.factors.knownPrivacyIssues },
                            { key: 'basicPrivacyRisks', icon: Shield, label: 'Privacy Risks', color: 'yellow', factor: breakdown.factors.basicPrivacyRisks },
                            { key: 'thirdPartySharing', icon: Share2, label: 'Data Sharing', color: 'blue', factor: breakdown.factors.thirdPartySharing }
                          ].filter(({ factor }) => factor && typeof factor.score === 'number' && typeof factor.maxScore === 'number');
                          if (factors.length === 0) return null;
                          const colorClasses = { red: { bg: 'bg-red-100 dark:bg-red-900/20', bar: 'bg-red-500', text: 'text-red-700 dark:text-red-300', icon: 'text-red-600 dark:text-red-400' }, orange: { bg: 'bg-orange-100 dark:bg-orange-900/20', bar: 'bg-orange-500', text: 'text-orange-700 dark:text-orange-300', icon: 'text-orange-600 dark:text-orange-400' }, yellow: { bg: 'bg-yellow-100 dark:bg-yellow-900/20', bar: 'bg-yellow-500', text: 'text-yellow-700 dark:text-yellow-300', icon: 'text-yellow-600 dark:text-yellow-400' }, blue: { bg: 'bg-blue-100 dark:bg-blue-900/20', bar: 'bg-blue-500', text: 'text-blue-700 dark:text-blue-300', icon: 'text-blue-600 dark:text-blue-400' } };
                          return (
                            <div className="grid grid-cols-2 gap-2 mb-4">
                              {factors.map(({ key, icon: Icon, label, color, factor }) => {
                                const percentage = (factor.score / factor.maxScore) * 100;
                                const colors = colorClasses[color];
                                return (
                                  <div key={key} className={`p-2 rounded-lg ${colors.bg} border border-gray-200 dark:border-slate-600`}>
                                    <div className="flex items-center gap-1.5 mb-1">
                                      <Icon className={`w-3 h-3 ${colors.icon}`} />
                                      <span className="text-xs font-medium text-gray-700 dark:text-gray-300 truncate">{label}</span>
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                      <div className="flex-1 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                                        <div className={`h-full ${colors.bar} transition-all`} style={{ width: `${percentage}%` }} />
                                      </div>
                                      <span className={`text-xs font-bold ${colors.text} min-w-[24px] text-right`}>{factor.score}</span>
                                    </div>
                                    <span className="text-[10px] text-gray-500 dark:text-gray-400 mt-0.5">{factor.weight}</span>
                                  </div>
                                );
                              })}
                            </div>
                          );
                        } catch (e) { return null; }
                      })()}
                      {/* Summary grid: Risk Level, Privacy Laws, Risk Factors, Protection Tips */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                        <div className={`p-2 rounded-lg border ${riskLevel === 'high' ? 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800' : riskLevel === 'medium' ? 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800' : riskLevel === 'low' ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800' : 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700'}`}>
                          <div className="flex items-center justify-center gap-1 mb-1">
                            <Shield className={`w-3.5 h-3.5 ${riskLevel === 'high' ? 'text-red-600' : riskLevel === 'medium' ? 'text-yellow-600' : riskLevel === 'low' ? 'text-green-600' : 'text-gray-500'}`} />
                          </div>
                          <span className="text-[10px] font-semibold text-gray-600 dark:text-gray-400 uppercase block text-center">Risk Level</span>
                          <span className={`text-sm font-bold block text-center ${riskLevel === 'high' ? 'text-red-700 dark:text-red-300' : riskLevel === 'medium' ? 'text-yellow-700 dark:text-yellow-300' : riskLevel === 'low' ? 'text-green-700 dark:text-green-300' : 'text-gray-700 dark:text-gray-300'}`}>{riskLevel.toUpperCase()}</span>
                        </div>
                        <div className="p-2 rounded-lg border bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
                          <div className="flex items-center justify-center gap-1 mb-1"><Scale className="w-3.5 h-3.5 text-blue-600" /></div>
                          <span className="text-[10px] font-semibold text-gray-600 dark:text-gray-400 uppercase block text-center">Privacy Laws</span>
                          <span className="text-sm font-bold text-blue-700 dark:text-blue-300 block text-center">{service.regulations?.length || 0}</span>
                        </div>
                        <div className="p-2 rounded-lg border bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800">
                          <div className="flex items-center justify-center gap-1 mb-1"><AlertTriangle className="w-3.5 h-3.5 text-orange-600" /></div>
                          <span className="text-[10px] font-semibold text-gray-600 dark:text-gray-400 uppercase block text-center">Risk Factors</span>
                          <span className="text-sm font-bold text-orange-700 dark:text-orange-300 block text-center">{service.typicalRisks?.length || 0}</span>
                        </div>
                        <div className="p-2 rounded-lg border bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800">
                          <div className="flex items-center justify-center gap-1 mb-1"><CheckCircle className="w-3.5 h-3.5 text-green-600" /></div>
                          <span className="text-[10px] font-semibold text-gray-600 dark:text-gray-400 uppercase block text-center">Protection Tips</span>
                          <span className="text-sm font-bold text-green-700 dark:text-green-300 block text-center">{service.recommendedActions?.length || 0}</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Links & Resources - placed early in details for quick access */}
                  {(service.website || service.privacy_policy_url || service.ios_app_url || service.android_app_url) && (
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                        <ExternalLink className="w-5 h-5" />
                        Links & Resources
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {service.website && (
                          <a
                            href={service.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-lg text-sm font-medium hover:bg-blue-200 dark:hover:bg-blue-900/40 transition-colors inline-flex items-center gap-2"
                          >
                            Website <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                        {service.privacy_policy_url && (
                          <a
                            href={service.privacy_policy_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors inline-flex items-center gap-2"
                          >
                            Privacy Policy <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                        {service.ios_app_url && (
                          <a
                            href={service.ios_app_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors inline-flex items-center gap-2"
                          >
                            iOS App <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                        {service.android_app_url && (
                          <a
                            href={service.android_app_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors inline-flex items-center gap-2"
                          >
                            Android App <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Applicable Regulations - placed early in details */}
                  {service.regulations && service.regulations.length > 0 && (
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                        <Scale className="w-5 h-5" />
                        Applicable Regulations ({service.regulations.length})
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {service.regulations.map((reg, idx) => (
                          <span key={idx} className="px-3 py-1.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-lg text-sm font-medium">
                            {reg}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Enhanced Privacy Fundamentals */}
                  {(service.encryption_level || service.zero_knowledge !== undefined || service.open_source !== undefined) && (
                    <div className="p-4 bg-gray-50 dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-slate-600">
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                        <Shield className="w-5 h-5" />
                        Privacy Fundamentals
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {service.encryption_level && (
                          <div className="flex items-center justify-between p-2 bg-white dark:bg-slate-700 rounded">
                            <span className="text-sm text-gray-600 dark:text-gray-400">Encryption:</span>
                            <span className="text-sm font-medium text-gray-900 dark:text-white capitalize">
                              {service.encryption_level.replace('_', ' ')}
                            </span>
                          </div>
                        )}
                        {service.zero_knowledge !== undefined && (
                          <div className="flex items-center justify-between p-2 bg-white dark:bg-slate-700 rounded">
                            <span className="text-sm text-gray-600 dark:text-gray-400">Zero-Knowledge:</span>
                            <span className={`text-sm font-medium ${service.zero_knowledge ? 'text-green-600 dark:text-green-400' : 'text-gray-500'}`}>
                              {service.zero_knowledge ? 'Yes' : 'No'}
                            </span>
                          </div>
                        )}
                        {service.open_source !== undefined && (
                          <div className="flex items-center justify-between p-2 bg-white dark:bg-slate-700 rounded">
                            <span className="text-sm text-gray-600 dark:text-gray-400">Open Source:</span>
                            <span className={`text-sm font-medium ${service.open_source ? 'text-green-600 dark:text-green-400' : 'text-gray-500'}`}>
                              {service.open_source ? 'Yes' : 'No'}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Breach History */}
                  {service.breaches && service.breaches.length > 0 && (
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                        <AlertTriangle className="w-5 h-5 text-red-500" />
                        {t('serviceCatalog.dataBreachHistory')} ({service.breaches.length})
                      </h3>
                      <div className="space-y-3">
                        {service.breaches.map((breach, idx) => (
                          <div key={idx} className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                            <div className="flex items-start justify-between mb-2">
                              <div>
                                <div className="flex items-center gap-2 mb-1">
                                  <span className={`px-2 py-1 text-xs font-medium rounded ${
                                    breach.severity === 'critical' ? 'bg-red-600 text-white' :
                                    breach.severity === 'high' ? 'bg-red-500 text-white' :
                                    breach.severity === 'medium' ? 'bg-orange-500 text-white' :
                                    'bg-yellow-500 text-white'
                                  }`}>
                                    {breach.severity.toUpperCase()}
                                  </span>
                                  <span className="text-sm text-gray-600 dark:text-gray-400">
                                    {new Date(breach.date).toLocaleDateString()}
                                  </span>
                                </div>
                                <p className="text-sm text-gray-900 dark:text-white font-medium mb-1">
                                  {breach.description}
                                </p>
                                {breach.affected_users && (
                                  <p className="text-xs text-gray-600 dark:text-gray-400">
                                    Affected: {breach.affected_users.toLocaleString()} users
                                  </p>
                                )}
                              </div>
                            </div>
                            {breach.source_url && (
                              <a
                                href={breach.source_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xs text-red-600 dark:text-red-400 hover:underline inline-flex items-center gap-1 mt-2"
                              >
                                Source <ExternalLink className="w-3 h-3" />
                              </a>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Regulatory Actions */}
                  {service.regulatory_actions && service.regulatory_actions.length > 0 && (
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                        <Scale className="w-5 h-5 text-purple-500" />
                        Regulatory Actions ({service.regulatory_actions.length})
                      </h3>
                      <div className="space-y-3">
                        {service.regulatory_actions.map((action, idx) => (
                          <div key={idx} className="p-3 bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg">
                            <div className="flex items-start justify-between mb-2">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <span className={`px-2 py-1 text-xs font-medium rounded ${
                                    action.action_type === 'fine' ? 'bg-red-500 text-white' :
                                    action.action_type === 'ban' ? 'bg-red-600 text-white' :
                                    'bg-yellow-500 text-white'
                                  }`}>
                                    {action.action_type.toUpperCase()}
                                  </span>
                                  <span className="text-sm text-gray-600 dark:text-gray-400">
                                    {new Date(action.date).toLocaleDateString()}
                                  </span>
                                </div>
                                <p className="text-sm text-gray-900 dark:text-white font-medium mb-1">
                                  {action.authority}
                                </p>
                                <p className="text-sm text-gray-700 dark:text-gray-300 mb-1">
                                  {action.reason}
                                </p>
                                {action.amount && (
                                  <p className="text-sm font-semibold text-gray-900 dark:text-white">
                                    Fine: ${action.amount.toLocaleString()}
                                  </p>
                                )}
                              </div>
                            </div>
                            {action.source_url && (
                              <a
                                href={action.source_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xs text-purple-600 dark:text-purple-400 hover:underline inline-flex items-center gap-1 mt-2"
                              >
                                Source <ExternalLink className="w-3 h-3" />
                              </a>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Typical Privacy Risks */}
                  {service.typicalRisks && service.typicalRisks.length > 0 && (
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                        <AlertTriangle className="w-5 h-5 text-orange-500" />
                        Typical Privacy Risks ({service.typicalRisks.length})
                      </h3>
                      <ul className="space-y-3">
                        {service.typicalRisks.map((risk, idx) => {
                          const { label, explanation } = expandRiskExplanation(risk);
                          return (
                            <li key={idx} className="text-sm text-gray-700 dark:text-gray-300 flex items-start">
                              <AlertTriangle className="w-4 h-4 mr-2 mt-0.5 text-orange-500 flex-shrink-0" />
                              <span>
                                <span className="font-medium text-gray-800 dark:text-gray-200">{label}</span>
                                {explanation && <span className="block text-xs text-gray-600 dark:text-gray-400 mt-1">{explanation}</span>}
                              </span>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  )}
                  
                  {/* Recommended Actions */}
                  {service.recommendedActions && service.recommendedActions.length > 0 && (
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                        <CheckCircle className="w-5 h-5 text-green-500" />
                        Recommended Actions ({service.recommendedActions.length})
                      </h3>
                      <ul className="space-y-3">
                        {service.recommendedActions.map((action, idx) => {
                          const actionId = `${service.id}-action-${idx}`;
                          const incompleteActions = serviceNotificationManager.getIncompleteActions(service.id);
                          const isCompleted = !incompleteActions.find(a => a.id === actionId);
                          const { title, detail } = expandRecommendedAction(action);
                          return (
                            <li key={idx} className="text-sm text-gray-700 dark:text-gray-300 flex items-start justify-between group">
                              <div className="flex items-start flex-1 min-w-0">
                                {isCompleted ? (
                                  <CheckCircle className="w-4 h-4 mr-2 mt-0.5 text-green-500 flex-shrink-0" />
                                ) : (
                                  <div className="w-4 h-4 mr-2 mt-0.5 rounded-full border-2 border-gray-300 dark:border-gray-600 flex-shrink-0" />
                                )}
                                <span className={isCompleted ? 'line-through text-gray-500 dark:text-gray-500' : ''}>
                                  <span className="font-medium text-gray-800 dark:text-gray-200">{title}</span>
                                  {detail && <span className="block text-xs text-gray-600 dark:text-gray-400 mt-1 font-normal">{detail}</span>}
                                </span>
                              </div>
                              {!isCompleted && (
                                <button
                                  onClick={() => handleActionComplete(service.id, actionId)}
                                  className="ml-2 px-2 py-1 text-xs text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20 rounded opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0"
                                  title="Mark as completed"
                                >
                                  Complete
                                </button>
                              )}
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  )}
                  
                  
                  {/* RSS Alerts for this service */}
                  {rssAlerts.filter(alert => alert.relatedServices?.includes(service.id)).length > 0 && (
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                        <Bell className="w-5 h-5 text-red-500" />
                        Recent Privacy Alerts
                      </h3>
                      <div className="space-y-2">
                        {rssAlerts
                          .filter(alert => alert.relatedServices?.includes(service.id))
                          .slice(0, 3)
                          .map((alert, idx) => (
                            <div key={idx} className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                              <h4 className="font-medium text-red-900 dark:text-red-200 text-sm mb-1">
                                {alert.title}
                              </h4>
                              <p className="text-xs text-red-700 dark:text-red-300 line-clamp-2">
                                {alert.description}
                              </p>
                              {alert.link && (
                                <a
                                  href={alert.link}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-xs text-red-600 dark:text-red-400 hover:underline mt-1 inline-flex items-center gap-1"
                                >
                                  Read more <ExternalLink className="w-3 h-3" />
                                </a>
                              )}
                            </div>
                          ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })()}

        {/* Contextual Links and Related Content */}
        <div className="mt-8 space-y-6" key={`content-${selectedServices.length}`}>
          <ContextualLinks
            currentPage="service-catalog"
            assessmentResults={null}
            showAsCards={true}
            maxLinks={3}
          />
          
          <RelatedContent
            currentPage="service-catalog"
            assessmentResults={null}
            title={t('serviceCatalog.continuePrivacyJourney')}
          />
        </div>

        {/* Info Section - Collapsible */}
        <div className="mt-8 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-xl p-6">
          <button
            onClick={() => setIsAboutExpanded(!isAboutExpanded)}
            className="w-full flex items-center justify-between text-left focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg p-2 -m-2"
            aria-expanded={isAboutExpanded}
          >
            <div className="flex items-center gap-3">
              <Info className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0" />
              <h3 className="font-semibold text-blue-900 dark:text-blue-100">
                {t('serviceCatalog.aboutMonitoring.title')}
              </h3>
            </div>
            {isAboutExpanded ? (
              <ChevronUp className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 transition-transform" />
            ) : (
              <ChevronDown className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 transition-transform" />
            )}
          </button>
          
          <div className={`overflow-hidden transition-all duration-300 ease-in-out ${
            isAboutExpanded ? 'max-h-[2000px] opacity-100 mt-4' : 'max-h-0 opacity-0 mt-0'
          }`}>
            <div>
              <p className="text-sm text-blue-800 dark:text-blue-200 mb-3">
                {t('serviceCatalog.aboutMonitoring.description')}
              </p>
              <ul className="text-sm text-blue-800 dark:text-blue-200 mb-3 list-disc list-inside space-y-1">
                <li><strong>GDPR (EU General Data Protection Regulation):</strong> Articles 6 (lawfulness), 7 (consent), 13 (transparency), 15 (access rights), 17 (right to erasure), and 25 (data protection by design)</li>
                <li><strong>CCPA (California Consumer Privacy Act):</strong> Sections 1798.100 (right to know), 1798.105 (right to delete), and 1798.120 (right to opt-out)</li>
                <li><strong>CPRA (California Privacy Rights Act):</strong> Enhanced CCPA provisions including sensitive personal information protections and data minimization requirements</li>
                <li><strong>COPPA (Children's Online Privacy Protection Act):</strong> Section 312.3 (parental consent) and 312.4 (privacy policy requirements)</li>
                <li><strong>PIPEDA (Personal Information Protection and Electronic Documents Act):</strong> Principles 4 (limiting collection), 5 (limiting use), and 7 (safeguards)</li>
                <li><strong>LGPD (Lei Geral de Proteção de Dados):</strong> Brazilian data protection law including Article 18 rights (access, correction, deletion, portability, and information about sharing)</li>
                <li><strong>HIPAA (Health Insurance Portability and Accountability Act):</strong> Healthcare privacy and security standards for protected health information (PHI)</li>
                <li><strong>FERPA (Family Educational Rights and Privacy Act):</strong> Student privacy protections for educational records</li>
                <li><strong>GLBA (Gramm-Leach-Bliley Act):</strong> Financial privacy protections for consumer financial information</li>
                <li><strong>VCDPA (Virginia Consumer Data Protection Act):</strong> Consumer data privacy rights including access, deletion, and opt-out provisions</li>
              </ul>
              <p className="text-sm text-blue-800 dark:text-blue-200 mb-3">
                As you select and deselect services, your personalized risk assessments, recommended actions, and privacy scores 
                update in real-time. Filter, search, and sort to focus on what matters most to you—everything responds instantly.
              </p>
              <p className="text-sm text-blue-800 dark:text-blue-200 mb-4">
                <strong>Privacy First:</strong> All service selections, preferences, and filters are stored locally in your browser. 
                We never track which services you use, monitor your interactions, or share this information with third parties. 
                Your privacy monitoring is completely private.
              </p>
              
              {/* Data Sources Disclaimer */}
              <div className="mt-4 pt-4 border-t border-blue-200 dark:border-blue-700">
                <h4 className="text-sm font-semibold text-blue-900 dark:text-blue-100 mb-2">
                  Data Sources & Disclaimer
                </h4>
                <p className="text-xs text-blue-700 dark:text-blue-300 mb-2">
                  Privacy assessments are based on publicly available information from the following sources:
                </p>
                <ul className="text-xs text-blue-700 dark:text-blue-300 mb-2 list-disc list-inside space-y-1">
                  <li>Official privacy policies and terms of service published by service providers</li>
                  <li>Regulatory filings and compliance documentation (GDPR, CCPA, etc.)</li>
                  <li>Publicly disclosed data breach reports and security incident notifications</li>
                  <li>Established privacy frameworks and industry best practices</li>
                  <li>Third-party privacy research and analysis from reputable organizations</li>
                </ul>
                <p className="text-xs text-blue-700 dark:text-blue-300 italic">
                  <strong>Note:</strong> Information is updated regularly but may not reflect the most recent changes to service policies. 
                  Users should verify current privacy practices directly with service providers. This tool provides general guidance and 
                  should not be considered legal advice.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Rating Widget */}
      <QuickRatingWidget
        featureName="Services Monitoring"
        context="service-catalog"
        minInteractionTime={30}
      />
    </div>
  );
};

export default ServiceCatalog;

