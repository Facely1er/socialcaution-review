import React from 'react';
import { useState, useEffect, useMemo, useRef } from 'react';
import { useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import { Shield, TrendingUp, Target, CheckCircle, AlertTriangle, Activity, BookOpen, Wrench, Lock, Zap, Download, Copy, Check, Mail, Send, ExternalLink, Home, Globe, ArrowRight, Bell, BellOff, Clock, Gauge, Settings as SettingsIcon, Users, ShoppingCart, Camera, Heart, LayoutDashboard } from 'lucide-react';
import { getIconComponent } from '../utils/iconMapping.js';
import EnhancedBreadcrumbs from './common/EnhancedBreadcrumbs';
import ContextualLinks from './common/ContextualLinks';
import RelatedContent from './common/RelatedContent';
import ProgressTracker from './common/ProgressTracker';
import InteractiveGuide from './common/InteractiveGuide';
import EmptyState from './common/EmptyState';
import LoadingSpinner from './common/LoadingSpinner';
import { PersonaProfiles, PersonaColors } from '../data/personaProfiles';
import { getPersonaConcerns, getPersonaProfile } from '../utils/personaHelpers';
import { PersonaDetectionEngine } from '../utils/personaDetection';
import { analytics } from '../utils/analytics.js';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { serviceCatalog } from '../data/serviceCatalog';
import { getAllEnhancedServices, getEnhancedService } from '../data/serviceCatalogEnhanced';
import { serviceRiskProfiles } from '../data/serviceRiskProfiles';
import { personaServiceHints } from '../data/personaServiceHints';
import { getToolsByService } from '../data/tools.js';
import { serviceNotificationManager } from '../utils/serviceNotifications';
import { useNotifications } from './common/NotificationSystem';
import DigitalFootprintAnalysis from './DigitalFootprintAnalysis';
import { calculatePrivacyExposureIndex, getExposureLevel } from '../utils/privacyExposureIndex';
import { getServiceLogoUrl } from '../utils/serviceLogos';
import { useTheme } from '../contexts/ThemeContext';
import { checkWorkflowCompletion } from '../utils/workflowCheck';
import { calculatePersonaPrivacyRiskProfile } from '../utils/riskProfileCalculator';
import { useTranslation } from '../contexts/TranslationContext';
import WorkflowCompletionGuide from './WorkflowCompletionGuide';
import CompactProgressTracker from './dashboard/CompactProgressTracker';
import QuickRatingWidget from './common/QuickRatingWidget';
import AICheckMessagePanel from './ai/AICheckMessagePanel';
import { RSSFeedAlertsPanel } from './alerts/RSSFeedAlertsPanel.tsx';
import SubscriptionManagement from './subscription/SubscriptionManagement';
import TrendsTrackerModule from './dashboard/TrendsTrackerModule';
import PrivacyRadarWidget from './dashboard/PrivacyRadarWidget';
import LimitDisplay from './common/LimitDisplay';
import { subscriptionService } from '../services/subscriptionService';
import { calculateDigitalFootprintFromServices } from '../utils/digitalFootprintCalculator';

/**
 * PersonalizedDashboard component props type definition
 * @typedef {Object} PersonalizedDashboardProps
 * @property {import('../types').UserProfile|null} userProfile - User profile data
 * @property {import('../types').AssessmentResults|null} assessmentResults - Assessment results
 * @property {import('../types').Persona|null} persona - Detected persona
 * @property {unknown} [personalizedContent] - Additional personalized content
 */
const PersonalizedDashboard = ({ userProfile, assessmentResults, persona, personalizedContent }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const view = searchParams.get('view');
  const { showInfo, showWarning } = useNotifications();
  const { theme } = useTheme();
  const { t } = useTranslation();
  const [dashboardData, setDashboardData] = useState(null);
  const [showGuide, setShowGuide] = useState(false);
  const [copyStatus, setCopyStatus] = useState('idle'); // 'idle' | 'copied'
  const [email, setEmail] = useState('');
  const [emailStatus, setEmailStatus] = useState('idle'); // 'idle' | 'sending' | 'sent' | 'error'
  const [selectedServices, setSelectedServices] = useLocalStorage('socialcaution_services', []);
  const [notificationPrefs, setNotificationPrefs] = useLocalStorage('socialcaution_service_notifications', {});
  const [serviceNotifications, setServiceNotifications] = useState([]);
  const [lastChecked, setLastChecked] = useLocalStorage('socialcaution_last_service_check', new Date().toISOString());
  const [subscriptionStatus, setSubscriptionStatus] = useState({ tier: 'free', status: 'active' });
  
  // Read all account data from localStorage (no remote auth required)
  // This ensures dashboard works even when accessed directly without props
  const [userProfileFromStorage, setUserProfileFromStorage] = useLocalStorage('socialcaution_profile', null);
  const [assessmentResultsFromStorage, setAssessmentResultsFromStorage] = useLocalStorage('socialcaution_results', null);
  const [personaFromStorage, setPersonaFromStorage] = useLocalStorage('socialcaution_persona', null);
  
  // Refresh key to force re-render when navigating to dashboard
  const refreshKeyRef = useRef(0);
  const [refreshKey, setRefreshKey] = useState(0);
  
  // Use props if provided, otherwise fall back to localStorage
  const activeUserProfile = userProfile || userProfileFromStorage;
  const activeAssessmentResults = assessmentResults || assessmentResultsFromStorage;
  const activePersona = persona || personaFromStorage;

  // Check workflow completion - use state to ensure re-renders when localStorage changes
  const [workflowStatus, setWorkflowStatus] = useState(() => checkWorkflowCompletion());

  // Force refresh localStorage values when navigating to dashboard
  // This ensures the dashboard updates even when localStorage changes in the same tab
  useEffect(() => {
    // Manually re-read from localStorage to ensure we have the latest values
    // This is necessary because useLocalStorage only listens to storage events from other tabs
    try {
      const freshProfile = localStorage.getItem('socialcaution_profile');
      const freshResults = localStorage.getItem('socialcaution_results');
      const freshPersona = localStorage.getItem('socialcaution_persona');
      const freshServices = localStorage.getItem('socialcaution_services');
      
      if (freshProfile !== null) {
        try {
          const parsed = JSON.parse(freshProfile);
          setUserProfileFromStorage(parsed);
        } catch (e) {
          // Ignore parse errors
        }
      }
      
      if (freshResults !== null) {
        try {
          const parsed = JSON.parse(freshResults);
          setAssessmentResultsFromStorage(parsed);
        } catch (e) {
          // Ignore parse errors
        }
      }
      
      if (freshPersona !== null) {
        try {
          const parsed = JSON.parse(freshPersona);
          setPersonaFromStorage(parsed);
        } catch (e) {
          // Ignore parse errors
        }
      }
      
      if (freshServices !== null) {
        try {
          const parsed = JSON.parse(freshServices);
          if (Array.isArray(parsed)) {
            setSelectedServices(parsed);
          }
        } catch (e) {
          // Ignore parse errors
        }
      }
      
      // Check subscription status
      const freshSubscription = localStorage.getItem('socialcaution_subscription');
      if (freshSubscription !== null) {
        try {
          const parsed = JSON.parse(freshSubscription);
          setSubscriptionStatus(parsed);
        } catch (e) {
          // Ignore parse errors
        }
      }
    } catch (error) {
      if (import.meta.env.DEV) {
        console.warn('Error refreshing localStorage values:', error);
      }
    }
    
    // Force workflow status refresh
    const newStatus = checkWorkflowCompletion();
    setWorkflowStatus(newStatus);
    
    // Increment refresh key to force re-render
    refreshKeyRef.current += 1;
    setRefreshKey(refreshKeyRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname, location.search]); // Refresh when route or query params change

  // Re-check workflow status when relevant localStorage values change
  useEffect(() => {
    const newStatus = checkWorkflowCompletion();
    setWorkflowStatus(newStatus);
  }, [userProfileFromStorage, assessmentResultsFromStorage, personaFromStorage, selectedServices]);

  // Listen for storage events (from other tabs or manual updates)
  useEffect(() => {
    const handleStorageChange = (e) => {
      // Only react to our localStorage keys
      if (e.key === 'socialcaution_profile' || 
          e.key === 'socialcaution_results' || 
          e.key === 'socialcaution_persona' || 
          e.key === 'socialcaution_services') {
        // Force refresh by incrementing refresh key
        refreshKeyRef.current += 1;
        setRefreshKey(refreshKeyRef.current);
        
        // Manually trigger state updates
        if (e.key === 'socialcaution_profile' && e.newValue) {
          try {
            setUserProfileFromStorage(JSON.parse(e.newValue));
          } catch (err) {
            // Ignore parse errors
          }
        } else if (e.key === 'socialcaution_results' && e.newValue) {
          try {
            setAssessmentResultsFromStorage(JSON.parse(e.newValue));
          } catch (err) {
            // Ignore parse errors
          }
        } else if (e.key === 'socialcaution_persona' && e.newValue) {
          try {
            setPersonaFromStorage(JSON.parse(e.newValue));
          } catch (err) {
            // Ignore parse errors
          }
        } else if (e.key === 'socialcaution_services' && e.newValue) {
          try {
            const parsed = JSON.parse(e.newValue);
            if (Array.isArray(parsed)) {
              setSelectedServices(parsed);
            }
          } catch (err) {
            // Ignore parse errors
          }
        } else if (e.key === 'socialcaution_subscription' && e.newValue) {
          try {
            const parsed = JSON.parse(e.newValue);
            setSubscriptionStatus(parsed);
          } catch (err) {
            // Ignore parse errors
          }
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    
    // Also listen for custom events (for same-tab updates)
    const handleCustomStorage = () => {
      refreshKeyRef.current += 1;
      setRefreshKey(refreshKeyRef.current);
    };
    window.addEventListener('localStorageUpdate', handleCustomStorage);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('localStorageUpdate', handleCustomStorage);
    };
  }, [setUserProfileFromStorage, setAssessmentResultsFromStorage, setPersonaFromStorage, setSelectedServices]);

  // Refresh dashboard when window regains focus (user returns to tab)
  useEffect(() => {
    const handleFocus = () => {
      // Refresh localStorage values when user returns to tab
      try {
        const freshProfile = localStorage.getItem('socialcaution_profile');
        const freshResults = localStorage.getItem('socialcaution_results');
        const freshPersona = localStorage.getItem('socialcaution_persona');
        const freshServices = localStorage.getItem('socialcaution_services');
        
        if (freshProfile !== null) {
          try {
            const parsed = JSON.parse(freshProfile);
            setUserProfileFromStorage(parsed);
          } catch (e) {
            // Ignore parse errors
          }
        }
        
        if (freshResults !== null) {
          try {
            const parsed = JSON.parse(freshResults);
            setAssessmentResultsFromStorage(parsed);
          } catch (e) {
            // Ignore parse errors
          }
        }
        
        if (freshPersona !== null) {
          try {
            const parsed = JSON.parse(freshPersona);
            setPersonaFromStorage(parsed);
          } catch (e) {
            // Ignore parse errors
          }
        }
        
        if (freshServices !== null) {
          try {
            const parsed = JSON.parse(freshServices);
            if (Array.isArray(parsed)) {
              setSelectedServices(parsed);
            }
          } catch (e) {
            // Ignore parse errors
          }
        }
        
        // Check subscription status
        const freshSubscription = localStorage.getItem('socialcaution_subscription');
        if (freshSubscription !== null) {
          try {
            const parsed = JSON.parse(freshSubscription);
            setSubscriptionStatus(parsed);
          } catch (e) {
            // Ignore parse errors
          }
        }
        
        // Force refresh
        refreshKeyRef.current += 1;
        setRefreshKey(refreshKeyRef.current);
      } catch (error) {
        if (import.meta.env.DEV) {
          console.warn('Error refreshing on focus:', error);
        }
      }
    };

    window.addEventListener('focus', handleFocus);
    return () => {
      window.removeEventListener('focus', handleFocus);
    };
  }, [setUserProfileFromStorage, setAssessmentResultsFromStorage, setPersonaFromStorage, setSelectedServices]);

  // Load subscription status - refresh when needed
  useEffect(() => {
    const loadSubscription = async () => {
      try {
        const status = await subscriptionService.getSubscriptionStatus();
        setSubscriptionStatus(status);
      } catch (error) {
        console.warn('Failed to load subscription status:', error);
        // Default to free tier
        setSubscriptionStatus({ tier: 'free', status: 'active' });
      }
    };
    loadSubscription();
    
    // Also check localStorage for subscription changes
    const checkSubscription = () => {
      try {
        const stored = localStorage.getItem('socialcaution_subscription');
        if (stored) {
          const parsed = JSON.parse(stored);
          setSubscriptionStatus(parsed);
        }
      } catch (e) {
        // Ignore parse errors
      }
    };
    
    // Check on mount and when refresh key changes
    checkSubscription();
  }, [refreshKey, location.pathname]);

  // Calculate digital footprint report
  const digitalFootprintReport = useMemo(() => {
    if (!selectedServices || selectedServices.length === 0) {
      return null;
    }
    return calculateDigitalFootprintFromServices(selectedServices, activeAssessmentResults);
  }, [selectedServices, activeAssessmentResults]);

  // Check if user has standard/premium access
  const hasStandardAccess = subscriptionStatus.tier === 'premium' || subscriptionStatus.tier === 'family';

  // If workflow is not complete, show workflow completion guide
  if (!workflowStatus.isComplete) {
    return <WorkflowCompletionGuide workflowStatus={workflowStatus} />;
  }

  useEffect(() => {
    // Track dashboard access with guard checks
    try {
      if (analytics && typeof analytics.trackPersonaDashboard === 'function' && activePersona?.primary) {
        analytics.trackPersonaDashboard(activePersona.primary);
      }
      if (analytics && typeof analytics.trackFunnelStep === 'function') {
        analytics.trackFunnelStep('dashboardViews', {
          persona: activePersona?.primary || 'none',
          exposure_score: activeAssessmentResults?.exposureScore || 0,
          rights_score: activeAssessmentResults?.rightsScore || 0
        });
      }
    } catch (error) {
      console.warn('Analytics tracking failed:', error);
    }

    const generateDashboardData = () => {
      if (activePersona?.primary && activeAssessmentResults) {
        // Personalized dashboard with assessment data and risk profile
        const profile = PersonaProfiles[activePersona.primary];
        const rightsScore = activeAssessmentResults.rightsScore || 0;

        if (!profile) {
          return generateBasicDashboardData();
        }

        try {
          // Calculate risk profile inside this function
          const riskProfile = selectedServices.length > 0
            ? calculatePersonaPrivacyRiskProfile(activeAssessmentResults, selectedServices)
            : null;

          return {
            welcomeMessage: PersonaDetectionEngine.getPersonalizedWelcome(
              activePersona.primary, 
              riskProfile?.combinedRiskScore || activeAssessmentResults.exposureScore || 0
            ),
            riskProfile, // Include the full risk profile
            priorityActions: getPriorityActions(profile, activeAssessmentResults, riskProfile),
            recommendedResources: getPersonalizedResources(profile, riskProfile?.combinedRiskScore || activeAssessmentResults.exposureScore || 0),
            relevantTools: getPersonalizedTools(profile),
            progressMetrics: getPersonalizedMetrics(profile, activeAssessmentResults, riskProfile),
            insights: generatePersonalizedInsights(profile, activeAssessmentResults, riskProfile),
            roadmap: generatePersonalizedRoadmap(profile, activeAssessmentResults, riskProfile)
          };
        } catch (error) {
          if (import.meta.env.DEV) {
            console.error('Error generating personalized dashboard data:', error);
          }
          return generateBasicDashboardData();
        }
      } else {
        // This should not happen if workflow is complete, but fallback just in case
        return generateBasicDashboardData();
      }
    };

    setDashboardData(generateDashboardData());
  }, [activePersona, activeAssessmentResults, selectedServices, userProfileFromStorage, assessmentResultsFromStorage, personaFromStorage, refreshKey, subscriptionStatus]);

  const generateBasicDashboardData = () => {
    return {
      welcomeMessage: t('dashboard.welcomeMessage'),
      priorityActions: [
        { id: 'password-manager', title: t('dashboard.actions.passwordManager'), priority: 'high', icon: Shield, estimate: '10 min', url: '/toolkit-access' },
        { id: 'two-factor', title: t('dashboard.actions.twoFactor'), priority: 'high', icon: Shield, estimate: '15 min', url: '/adaptive-resources' },
        { id: 'privacy-settings', title: t('dashboard.actions.privacySettings'), priority: 'medium', icon: Activity, estimate: '20 min', url: '/privacy-settings' },
        { id: 'data-broker-removal', title: t('dashboard.actions.dataBrokerRemoval'), priority: 'medium', icon: AlertTriangle, estimate: '30 min', url: '/toolkit-access' },
        { id: 'privacy-assessment', title: t('dashboard.actions.privacyAssessment'), priority: 'high', icon: Target, estimate: '13-19 min', url: '/assessment/full' }
      ],
      recommendedResources: [
        { id: 'privacy-basics', title: t('dashboard.resources.privacyBasics'), type: 'guide', url: '/adaptive-resources' },
        { id: 'password-security', title: t('dashboard.resources.passwordSecurity'), type: 'article', url: '/adaptive-resources' },
        { id: 'two-factor-setup', title: t('dashboard.resources.twoFactorSetup'), type: 'tutorial', url: '/adaptive-resources' }
      ],
      relevantTools: [
        { id: 'password-checker', name: t('dashboard.tools.passwordChecker'), category: 'security', url: '/toolkit-access' },
        { id: 'privacy-scanner', name: t('dashboard.tools.privacyScanner'), category: 'privacy', url: '/toolkit-access' },
        { id: 'data-broker-removal', name: t('dashboard.tools.dataBrokerRemovalService'), category: 'cleanup', url: '/toolkit-access' }
      ],
      progressMetrics: [
        { label: t('dashboard.metrics.privacyProtection'), value: 0 },
        { label: t('dashboard.metrics.rightsExercise'), value: 0 },
        { label: t('dashboard.metrics.actionCompletion'), value: 0 },
        { label: t('dashboard.metrics.securitySetup'), value: 0 }
      ],
      insights: [
        {
          type: 'info',
          title: t('dashboard.insights.getStarted.title'),
          description: t('dashboard.insights.getStarted.description'),
          icon: Target,
          action: { label: t('dashboard.insights.getStarted.actionLabel'), url: '/assessment/full' }
        }
      ],
      roadmap: {
        currentPhase: t('dashboard.roadmap.currentPhase'),
        phases: [
          {
            name: t('dashboard.roadmap.phases.foundation.name'),
            description: t('dashboard.roadmap.phases.foundation.description'),
            progress: 0,
            tasks: [
              t('dashboard.roadmap.phases.foundation.tasks.completeAssessment'),
              t('dashboard.roadmap.phases.foundation.tasks.passwordManager'),
              t('dashboard.roadmap.phases.foundation.tasks.enable2FA')
            ],
            timeframe: t('dashboard.roadmap.phases.foundation.timeframe')
          },
          {
            name: t('dashboard.roadmap.phases.protection.name'),
            description: t('dashboard.roadmap.phases.protection.description'),
            progress: 0,
            tasks: [
              t('dashboard.roadmap.phases.protection.tasks.updateSettings'),
              t('dashboard.roadmap.phases.protection.tasks.reviewServicePrivacy')
            ],
            timeframe: t('dashboard.roadmap.phases.protection.timeframe')
          },
          {
            name: t('dashboard.roadmap.phases.optimization.name'),
            description: t('dashboard.roadmap.phases.optimization.description'),
            progress: 0,
            tasks: [
              t('dashboard.roadmap.phases.optimization.tasks.removeDataBrokers'),
              t('dashboard.roadmap.phases.optimization.tasks.implementTools')
            ],
            timeframe: t('dashboard.roadmap.phases.optimization.timeframe')
          }
        ]
      }
    };
  };

  const getPriorityActions = (profile, results, riskProfile = null) => {
    try {
      const baseActions = [
        { id: 'privacy-assistant', title: t('dashboard.actions.privacyAssistant'), priority: 'high', icon: Zap, estimate: '5 min', url: '/privacy-assistant', external: false },
        { id: 'action-planner', title: t('dashboard.actions.actionPlanner'), priority: 'high', icon: Target, estimate: '10 min', url: '/action-planner', external: false },
        { id: 'password-manager', title: t('dashboard.actions.passwordManager'), priority: 'high', icon: Shield, estimate: '10 min' },
        { id: 'two-factor', title: t('dashboard.actions.twoFactor'), priority: 'high', icon: Shield, estimate: '15 min' },
        { id: 'privacy-settings', title: t('dashboard.actions.privacySettings'), priority: 'medium', icon: Activity, estimate: '20 min' },
        { id: 'data-broker-removal', title: t('dashboard.actions.dataBrokerRemoval'), priority: 'medium', icon: AlertTriangle, estimate: '30 min' }
      ];

      const personaActions = {
      'cautious-parent': [
        { id: 'parental-controls', title: t('dashboard.actions.parentalControls'), priority: 'high', icon: Shield, estimate: '25 min' },
        { id: 'family-sharing', title: t('dashboard.actions.familySharing'), priority: 'high', icon: Activity, estimate: '15 min' },
        { id: 'child-accounts', title: t('dashboard.actions.childAccounts'), priority: 'medium', icon: CheckCircle, estimate: '20 min' }
      ],
      'digital-novice': [
        { id: 'privacy-basics', title: t('dashboard.actions.privacyBasics'), priority: 'high', icon: BookOpen, estimate: '30 min' },
        { id: 'simple-tools', title: t('dashboard.actions.simpleTools'), priority: 'medium', icon: Wrench, estimate: '15 min' },
        { id: 'safe-browsing', title: t('dashboard.actions.safeBrowsing'), priority: 'medium', icon: Shield, estimate: '10 min' }
      ],
      'online-shopper': [
        { id: 'shopping-security', title: t('dashboard.actions.shoppingSecurity'), priority: 'high', icon: Shield, estimate: '20 min' },
        { id: 'financial-monitoring', title: t('dashboard.actions.financialMonitoring'), priority: 'high', icon: Activity, estimate: '25 min' },
        { id: 'deal-verification', title: t('dashboard.actions.dealVerification'), priority: 'medium', icon: BookOpen, estimate: '15 min' }
      ],
      'social-influencer': [
        { id: 'reputation-monitoring', title: t('dashboard.actions.reputationMonitoring'), priority: 'high', icon: Activity, estimate: '20 min' },
        { id: 'content-protection', title: t('dashboard.actions.contentProtection'), priority: 'high', icon: Shield, estimate: '30 min' },
        { id: 'audience-privacy', title: t('dashboard.actions.audiencePrivacy'), priority: 'medium', icon: CheckCircle, estimate: '25 min' }
      ],
      'privacy-advocate': [
        { id: 'advanced-anonymity', title: t('dashboard.actions.advancedAnonymity'), priority: 'high', icon: Shield, estimate: '45 min' },
        { id: 'rights-enforcement', title: t('dashboard.actions.rightsEnforcement'), priority: 'high', icon: Activity, estimate: '60 min' },
        { id: 'policy-tracking', title: t('dashboard.actions.policyTracking'), priority: 'medium', icon: BookOpen, estimate: '20 min' }
      ],
      'private-individual': [
        { id: 'data-minimization', title: t('dashboard.actions.dataMinimization'), priority: 'high', icon: AlertTriangle, estimate: '40 min' },
        { id: 'anonymous-browsing', title: t('dashboard.actions.anonymousBrowsing'), priority: 'high', icon: Shield, estimate: '30 min' },
        { id: 'secure-communication', title: t('dashboard.actions.secureCommunication'), priority: 'medium', icon: Activity, estimate: '25 min' }
      ]
    };

      return [...baseActions, ...(personaActions[profile?.id] || [])].slice(0, 6);
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error('Error getting priority actions:', error);
      }
      return [];
    }
  };

  const getPersonalizedResources = (profile, riskScore) => {
    try {
      const resources = [
        { title: t('dashboard.resources.passwordSecurityGuide'), description: t('dashboard.resources.passwordSecurityGuideDesc'), category: 'security' },
        { title: t('dashboard.resources.socialMediaPrivacy'), description: t('dashboard.resources.socialMediaPrivacyDesc'), category: 'social' },
        { title: t('dashboard.resources.familyPrivacyProtection'), description: t('dashboard.resources.familyPrivacyProtectionDesc'), category: 'family' },
        { title: t('dashboard.resources.advancedAnonymityTechniques'), description: t('dashboard.resources.advancedAnonymityTechniquesDesc'), category: 'advanced' }
      ];

      if (!profile?.resourceFilters || !Array.isArray(profile.resourceFilters)) {
        return resources.slice(0, 4);
      }

      return resources.filter(resource => 
        profile.resourceFilters.some(filter => resource.category.includes(filter.split('-')[0]))
      ).slice(0, 4);
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error('Error getting personalized resources:', error);
      }
      return [];
    }
  };

  const getPersonalizedTools = (profile) => {
    const tools = [
      { name: 'Password\nChecker', icon: Shield, category: 'security' },
      { name: 'Data\nCleaner', icon: AlertTriangle, category: 'cleanup' },
      { name: 'Rights\nHelper', icon: CheckCircle, category: 'rights' }
    ];

    return tools.slice(0, 4);
  };

  const getPersonalizedMetrics = (profile, results, riskProfile = null) => {
    return [
      { label: 'Privacy Protection', value: results?.exposureScore || 0 },
      { label: 'Rights Exercise', value: results?.rightsScore || 0 },
      { label: 'Combined Risk Score', value: riskProfile?.combinedRiskScore || 0 },
      { label: 'Digital Footprint Score', value: riskProfile?.digitalFootprintScore || 0 },
      { label: 'Action Completion', value: 25 },
      { label: 'Security Setup', value: 60 }
    ];
  };

  const generatePersonalizedInsights = (profile, results, riskProfile = null) => {
    try {
      const insights = [];
      const exposureScore = results?.exposureScore || 0;
      const rightsScore = results?.rightsScore || 0;
      const combinedRisk = riskProfile?.combinedRiskScore || exposureScore;
      
      // Use combined risk score if available, otherwise use exposure score
      if (combinedRisk < 50) {
        insights.push({
          title: 'High Privacy Risk Detected',
          description: riskProfile 
            ? `Your combined risk score of ${combinedRisk}/100 (from assessment and ${riskProfile.serviceCount} monitored services) indicates significant privacy exposure. Immediate action recommended.`
            : 'Your current digital habits expose you to significant privacy risks. Immediate action recommended.',
          type: 'warning'
        });
      } else if (riskProfile && riskProfile.digitalFootprintScore > 60) {
        insights.push({
          title: 'High Digital Footprint',
          description: `Your selected services contribute ${riskProfile.digitalFootprintScore}/100 to your risk profile. Consider reviewing service privacy settings.`,
          type: 'info'
        });
      }
      
      if (rightsScore < 30) {
        insights.push({
          title: 'Underutilized Privacy Rights',
          description: 'You have powerful privacy rights that you\'re not using. Learn how to exercise them effectively.',
          type: 'info'
        });
      }

      const concerns = getPersonaConcerns(activePersona);
      if (profile?.name && concerns && concerns.length > 0) {
        insights.push({
          title: `Privacy Concerns Optimization`,
          description: `Based on your privacy concerns, focus on ${concerns[0].replace('-', ' ')} for maximum impact.`,
          type: 'success'
        });
      }

      return insights.slice(0, 3);
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error('Error generating insights:', error);
      }
      return [];
    }
  };

  const generatePersonalizedRoadmap = (profile, results, riskProfile = null) => {
    // Calculate progress based on risk profile and assessment completion
    const baseProgress = results?.exposureScore ? Math.min((100 - (results.exposureScore || 0)) / 100 * 100, 100) : 0;
    const riskProgress = riskProfile ? Math.min((100 - riskProfile.combinedRiskScore) / 100 * 100, 100) : baseProgress;
    
    const roadmap = {
      currentPhase: riskProfile?.riskLevel === 'high' ? 'Foundation' : riskProfile?.riskLevel === 'moderate' ? 'Enhancement' : 'Optimization',
      phases: [
        {
          name: 'Foundation',
          description: 'Essential privacy basics',
          progress: riskProgress > 60 ? 100 : Math.max(riskProgress, 20),
          tasks: ['Password manager', '2FA setup', 'Basic privacy settings', 'Service privacy review'],
          timeframe: 'Week 1-2',
          priority: riskProfile?.riskLevel === 'high' ? 'high' : 'medium'
        },
        {
          name: 'Enhancement',
          description: 'Strengthening your privacy',
          progress: riskProgress > 30 && riskProgress <= 60 ? Math.min((riskProgress - 30) / 30 * 100, 100) : riskProgress > 60 ? 100 : 0,
          tasks: ['Advanced tools', 'Data cleanup', 'Rights exercise', 'Monitor service updates'],
          timeframe: 'Week 3-6',
          priority: riskProfile?.riskLevel === 'moderate' ? 'high' : 'medium'
        },
        {
          name: 'Optimization',
          description: 'Advanced privacy techniques',
          progress: riskProgress > 60 ? Math.min((riskProgress - 60) / 40 * 100, 100) : 0,
          tasks: ['Expert tools', 'Ongoing monitoring', 'Service optimization', 'Teaching others'],
          timeframe: 'Month 2-3',
          priority: riskProfile?.riskLevel === 'low' ? 'high' : 'low'
        }
      ],
      riskProfile: riskProfile ? {
        combinedScore: riskProfile.combinedRiskScore,
        assessmentContribution: riskProfile.breakdown.assessmentContribution,
        footprintContribution: riskProfile.breakdown.footprintContribution,
        serviceCount: riskProfile.serviceCount
      } : null
    };

    return roadmap;
  };

  // Generate privacy report object
  const generateReport = () => {
    const primaryPersona = activePersona?.primary ? PersonaProfiles[activePersona.primary] : null;
    const exposureScore = activeAssessmentResults?.exposureScore || 0;
    const rightsScore = activeAssessmentResults?.rightsScore || 0;

    // Generate narrative summary
    const narrative = generateNarrative(primaryPersona, exposureScore, rightsScore);

    return {
      timestamp: new Date().toISOString(),
      reportDate: new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }),
      persona: primaryPersona ? {
        id: activePersona.primary,
        name: primaryPersona.name,
        description: primaryPersona.description,
        confidence: activePersona.confidence
      } : null,
      scores: {
        exposureScore,
        rightsScore,
        overallPrivacyHealth: activeAssessmentResults ? Math.round((exposureScore + rightsScore) / 2) : null
      },
      narrative,
      assessmentType: activeAssessmentResults?.exposureResults && activeAssessmentResults?.rightsResults
        ? 'full'
        : activeAssessmentResults?.exposureResults
          ? 'exposure-only'
          : activeAssessmentResults?.rightsResults
            ? 'rights-only'
            : 'none',
      completedAt: activeAssessmentResults?.completedAt || activeUserProfile?.createdAt
    };
  };

  // Generate narrative summary
  const generateNarrative = (primaryPersona, exposureScore, rightsScore) => {
    if (!primaryPersona || !activeAssessmentResults) {
      return `Privacy Dashboard Summary

Welcome to your privacy dashboard. Complete an assessment to receive personalized recommendations based on your privacy profile and risk level.

Your dashboard provides general privacy recommendations and access to privacy tools and resources.`;
    }

    const riskLevel = exposureScore >= 70 ? 'low' : exposureScore >= 50 ? 'moderate' : 'high';
    const rightsLevel = rightsScore >= 70 ? 'excellent' : rightsScore >= 50 ? 'good' : 'needs improvement';

    return `Privacy Assessment Summary

Your privacy profile shows a ${riskLevel} risk level with a privacy exposure score of ${exposureScore}/100. Your privacy rights awareness and usage is ${rightsLevel} with a score of ${rightsScore}/100.

Your primary privacy concerns include ${getPersonaConcerns(activePersona).join(', ')}.

${exposureScore < 50
  ? 'URGENT: Your current privacy practices expose you to significant risks. Immediate action is recommended to secure your digital life.'
  : exposureScore < 70
    ? 'Your privacy practices are moderate but have room for improvement. Focus on addressing the key recommendations provided.'
    : 'Excellent! Your privacy practices are strong. Continue maintaining these habits and stay updated on emerging privacy threats.'
}

${rightsScore < 50
  ? 'You have powerful privacy rights under laws like GDPR and CCPA that you\'re not fully utilizing. Learning to exercise these rights will significantly increase your control over personal data.'
  : 'You demonstrate good awareness of your privacy rights. Continue exercising these rights to maintain control over your personal information.'
}`;
  };

  // Download report as JSON
  const handleDownloadReport = () => {
    const report = generateReport();
    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `privacy-report-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Copy summary to clipboard
  const handleCopySummary = async () => {
    try {
      const report = generateReport();
      if (!report || !report.narrative) {
        console.error('No report narrative available to copy');
        return;
      }
      await navigator.clipboard.writeText(report.narrative);
      setCopyStatus('copied');
      setTimeout(() => setCopyStatus('idle'), 2000);
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
    }
  };

  // Helper function to download report as file
  const downloadReportAsFile = (report) => {
    try {
      const dataStr = JSON.stringify(report, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `privacy-report-${report.timestamp?.split('T')[0] || new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      return true;
    } catch (error) {
      console.error('Error downloading report:', error);
      // Last resort: copy to clipboard or show in alert
      if (navigator.clipboard) {
        navigator.clipboard.writeText(JSON.stringify(report, null, 2));
        alert(t('errors.export.reportCopied'));
        return true;
      }
      return false;
    }
  };

  // Send report via email
  const handleSendEmail = async () => {
    if (!email || !email.includes('@')) {
      setEmailStatus('error');
      setTimeout(() => setEmailStatus('idle'), 3000);
      return;
    }

    try {
      setEmailStatus('sending');
      const report = generateReport();

      const response = await fetch('/.netlify/functions/send-report-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, report })
      });

      const data = await response.json();

      if (response.ok) {
        // Check if fallback was used
        if (data.fallback) {
          // FALLBACK: Download report as JSON file
          if (downloadReportAsFile(report)) {
            setEmailStatus('sent');
            // Show notification that email service is unavailable
            if (analytics && typeof analytics.trackEvent === 'function') {
              analytics.trackEvent('email_fallback_used', {
                reason: 'service_unavailable'
              });
            }
          } else {
            setEmailStatus('error');
          }
        } else {
          setEmailStatus('sent');
        }
        setTimeout(() => setEmailStatus('idle'), 5000);
      } else {
        // FALLBACK: If request fails, offer download instead
        if (downloadReportAsFile(report)) {
          setEmailStatus('sent');
        } else {
          setEmailStatus('error');
        }
        setTimeout(() => setEmailStatus('idle'), 3000);
      }
    } catch (error) {
      console.error('Error sending email:', error);
      // FALLBACK: Network error - offer download
      const report = generateReport();
      if (downloadReportAsFile(report)) {
        setEmailStatus('sent');
      } else {
        setEmailStatus('error');
      }
      setTimeout(() => setEmailStatus('idle'), 3000);
    }
  };

  // Toggle service selection
  const toggleServiceSelection = (serviceId) => {
    // Validate serviceId
    if (!serviceId || typeof serviceId !== 'string') {
      console.warn('[PersonalizedDashboard] Invalid serviceId provided to toggleServiceSelection:', serviceId);
      return;
    }

    try {
      setSelectedServices(prev => {
        // Ensure prev is always an array - handle corrupted localStorage data
        const currentSelection = Array.isArray(prev) ? prev : [];
        
        if (currentSelection.includes(serviceId)) {
          return currentSelection.filter(id => id !== serviceId);
        } else {
          return [...currentSelection, serviceId];
        }
      });
    } catch (error) {
      console.error('[PersonalizedDashboard] Error toggling service selection:', error);
      showWarning('Failed to update service selection. Please try again.', { duration: 5000 });
    }
  };

  // Get enhanced services (falls back to basic catalog if enhanced not available)
  const allServices = useMemo(() => {
    try {
      return getAllEnhancedServices();
    } catch (error) {
      console.warn('[PersonalizedDashboard] Enhanced catalog not available, using basic catalog:', error);
      return serviceCatalog;
    }
  }, []);

  // Get selected service details with persona-aware risk context
  const selectedServiceDetails = (Array.isArray(selectedServices) ? selectedServices : []).map(serviceId => {
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
    const riskProfile = serviceRiskProfiles[serviceId];
    const personaHints = activePersona?.primary ? personaServiceHints[activePersona.primary] : null;

    // Guard against missing service or risk profile
    if (!service || !riskProfile) {
      return null;
    }

    // Calculate exposure index
    const exposureIndex = calculatePrivacyExposureIndex(serviceId);
    const exposureLevel = getExposureLevel(exposureIndex);

    return {
      ...service,
      ...riskProfile,
      personaExtraNote: personaHints?.extraRiskNotes?.[serviceId],
      isHighlighted: personaHints?.highlightCategories?.includes(service?.category),
      exposureIndex,
      exposureLevel
    };
  }).filter(Boolean);

  // Get highlighted services for current persona
  const getHighlightedServices = () => {
    const personaHints = personaServiceHints[activePersona?.primary];
    if (!personaHints) return [];

    return allServices.filter(service =>
      personaHints.highlightCategories?.includes(service.category)
    );
  };

  // Get service-based tools
  const serviceBasedTools = getToolsByService(selectedServices);

  // Get tool type icon
  const getToolTypeIcon = (type) => {
    switch (type) {
      case 'web-tool': return Zap;
      case 'browser-extension': return Activity;
      case 'software-suite': return Wrench;
      case 'service': return Target;
      default: return CheckCircle;
    }
  };

  // Handle tool usage
  const handleToolUse = (tool) => {
    try {
      if (analytics && typeof analytics.trackToolUsage === 'function') {
        analytics.trackToolUsage(tool.name, activePersona?.primary);
      }
      if (analytics && typeof analytics.trackFeatureUsage === 'function') {
        analytics.trackFeatureUsage('tool_use', {
          tool_id: tool.id,
          tool_name: tool.name,
          persona: activePersona?.primary || 'none',
          context: 'dashboard'
        });
      }
    } catch (error) {
      console.warn('Analytics tracking failed:', error);
    }
    
    // Navigate to tool URL
    if (tool.url) {
      if (tool.url.startsWith('http')) {
        window.open(tool.url, '_blank', 'noopener,noreferrer');
      } else {
        navigate(tool.url);
      }
    }
  };

  // Check for service updates
  const checkForServiceUpdates = () => {
    setLastChecked(new Date().toISOString());
    
    // Get notifications for selected services
    const notifications = serviceNotificationManager.getNotificationsForServices(
      selectedServices,
      notificationPrefs
    );

    setServiceNotifications(notifications);

    if (notifications.length > 0) {
      showInfo(
        `${notifications.length} of your selected services have privacy updates. Check them out!`,
        {
          duration: 8000,
          action: {
            label: 'View Updates',
            onClick: () => {
              // Scroll to notifications section
              const element = document.getElementById('service-notifications');
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

  // Toggle notification preference for a service
  const toggleNotificationPreference = (serviceId) => {
    setNotificationPrefs(prev => ({
      ...prev,
      [serviceId]: !prev[serviceId]
    }));
    
    const service = getEnhancedService(serviceId) || serviceCatalog.find(s => s.id === serviceId);
    const serviceName = service?.name || 'Service';
    showInfo(
      `Notifications ${notificationPrefs[serviceId] ? 'disabled' : 'enabled'} for ${serviceName}`,
      { duration: 3000 }
    );
  };

  // Load service notifications on mount and when selected services change
  useEffect(() => {
    if (selectedServices.length > 0) {
      const notifications = serviceNotificationManager.getNotificationsForServices(
        selectedServices,
        notificationPrefs
      );
      setServiceNotifications(notifications);
    } else {
      setServiceNotifications([]);
    }
  }, [selectedServices, notificationPrefs]);

  const handleTaskComplete = (taskId, completed) => {
    // Track task completion
    // Task completion status updated
  };

  const handleStartAction = (action) => {
    // Track action start with guard checks
    try {
      if (analytics && typeof analytics.trackFeatureUsage === 'function') {
        analytics.trackFeatureUsage('action_start', {
          action_id: action.id,
          action_title: action.title,
          persona: activePersona?.primary || 'none',
          context: 'dashboard'
        });
      }
    } catch (error) {
      // Silently fail analytics - don't block functionality
      console.warn('Analytics tracking failed:', error);
    }
    
    // Navigate to action URL if provided, otherwise show info
    if (action.url) {
      navigate(action.url);
    } else if (import.meta.env.DEV) {
      console.log(`Starting action: ${action.title}`);
    }
  };

  const handleGuideComplete = () => {
    setShowGuide(false);
  };

  const handleGuideSkip = () => {
    setShowGuide(false);
  };

  const guideSteps = [
    {
      title: 'Welcome to Your Dashboard',
      description: 'This is your personalized privacy control center, tailored specifically for your needs.',
      icon: Target,
      tips: 'Everything here is customized based on your assessment results and privacy concerns.'
    },
    {
      title: 'Priority Actions',
      description: 'Start with these high-impact actions to quickly improve your privacy protection.',
      icon: Zap,
      tips: 'Focus on the red "high priority" actions first - they give you the biggest privacy boost.'
    },
    {
      title: 'Track Your Progress',
      description: 'Monitor your improvement with personalized metrics and completion tracking.',
      icon: TrendingUp,
      tips: 'Your dashboard adapts as you complete actions, showing new recommendations and challenges.'
    }
  ];

  // Calculate persona-related values (using activePersona defined at top)
  const primaryPersona = activePersona?.primary ? PersonaProfiles[activePersona.primary] : null;
  const personaColor = primaryPersona ? PersonaColors[primaryPersona.color] : {
    bg: 'bg-gray-100 dark:bg-gray-700',
    border: 'border-gray-200 dark:border-gray-600',
    accent: 'text-gray-600 dark:text-gray-400',
    text: 'text-gray-900 dark:text-white'
  };

  // Guard: Wait for dashboardData to load
  if (!dashboardData) {
    return (
      <LoadingSpinner 
        size="lg" 
        text="Loading your personalized dashboard..." 
        fullScreen={true}
      />
    );
  }

  // Show footprint analysis view if requested
  if (view === 'footprint') {
    return (
      <DigitalFootprintAnalysis
        assessmentResults={activeAssessmentResults}
        selectedServices={selectedServices}
        persona={activePersona}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
      {/* Interactive Guide */}
      <InteractiveGuide
        steps={guideSteps}
        onComplete={handleGuideComplete}
        onSkip={handleGuideSkip}
        isVisible={showGuide}
      />

      {/* Personalized Header – on page background */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-10 pb-8 sm:pb-10">
          {/* Navigation Bar */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              <button
                onClick={() => setShowGuide(true)}
                className="px-3 py-2 text-sm sm:text-base text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors whitespace-nowrap"
              >
                Show Guide
              </button>
                <nav className="flex items-center gap-2 sm:gap-3">
                  <button
                    onClick={() => navigate('/service-catalog')}
                    className="px-3 py-2 text-sm sm:text-base text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors whitespace-nowrap"
                  >
                    Services Monitoring
                  </button>
                <button
                  onClick={() => navigate('/adaptive-resources')}
                  className="px-3 py-2 text-sm sm:text-base text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors whitespace-nowrap"
                >
                  Resources
                </button>
                <button
                  onClick={() => navigate('/toolkit-access')}
                  className="px-3 py-2 text-sm sm:text-base text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors whitespace-nowrap"
                >
                  Privacy Toolkit
                </button>
              </nav>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row items-center lg:items-center justify-between gap-4 lg:gap-0">
            <div className="flex items-center justify-center gap-3 sm:gap-4 w-full lg:w-auto">
              <div className="p-1.5 sm:p-2 md:p-2.5 bg-gradient-to-br from-red-500 to-red-600 rounded-lg shadow-md flex-shrink-0 flex items-center justify-center">
                <LayoutDashboard className="w-5 h-5 sm:w-5 sm:h-5 md:w-6 md:h-6 text-white" />
              </div>
              <div className="text-center lg:text-left">
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-white leading-tight">
                  Welcome to Your Privacy Dashboard
                </h1>
                <p className="text-sm sm:text-base lg:text-lg text-gray-600 dark:text-gray-300 mt-1">
                  {dashboardData.welcomeMessage}
                </p>
              </div>
            </div>
            {activeAssessmentResults && dashboardData.riskProfile && (
              <div className="flex items-center gap-4 sm:gap-6 w-full lg:w-auto justify-around lg:justify-end">
                <div className="text-center">
                  <div className={`text-2xl sm:text-3xl font-bold ${
                    dashboardData.riskProfile.riskLevel === 'high' ? 'text-red-500' :
                    dashboardData.riskProfile.riskLevel === 'moderate' ? 'text-orange-500' :
                    dashboardData.riskProfile.riskLevel === 'low' ? 'text-yellow-500' : 'text-green-500'
                  }`}>
                    {dashboardData.riskProfile.combinedRiskScore}
                  </div>
                  <div className="text-xs sm:text-sm text-gray-500" title="Combined Risk Score: Assessment (60%) + Digital Footprint (40%)">Combined Risk Score</div>
                  <div className="text-[10px] text-gray-400">{dashboardData.riskProfile.riskLabel}</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl sm:text-3xl font-bold text-blue-500">{activeAssessmentResults.rightsScore || 0}</div>
                  <div className="text-xs sm:text-sm text-gray-500">Rights Score</div>
                </div>
                {activePersona && (
                  <button
                    type="button"
                    onClick={() => navigate('/privacy-settings')}
                    className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors font-medium flex items-center gap-2"
                    title="Privacy Settings"
                  >
                    <SettingsIcon className="w-5 h-5" />
                    <span className="hidden sm:inline">Settings</span>
                  </button>
                )}
              </div>
            )}
            {!activeAssessmentResults && (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => navigate('/assessment/full')}
                  className="px-6 py-3 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors font-medium flex items-center gap-2"
                >
                  Get Personalized Dashboard
                  <Target className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Compact Progress Tracker - Show if not fully complete */}
        <CompactProgressTracker 
          userProgress={{
            hasPrivacyConcerns: !!activePersona,
            hasAssessment: !!activeAssessmentResults,
            privacyConcernsData: activePersona
          }}
        />

        {/* Risk Profile Section */}
        {dashboardData?.riskProfile && (
          <div data-tutorial="exposure-summary" className="bg-gradient-to-r from-red-50 via-orange-50 to-yellow-50 dark:from-red-900/20 dark:via-orange-900/20 dark:to-yellow-900/20 rounded-xl shadow-sm border border-red-200 dark:border-red-800 p-6 mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center">
                <Gauge className="w-5 h-5 mr-2 text-red-500" />
                Your Privacy Risk Profile
              </h2>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                dashboardData.riskProfile.riskLevel === 'high' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300' :
                dashboardData.riskProfile.riskLevel === 'moderate' ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300' :
                dashboardData.riskProfile.riskLevel === 'low' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300' :
                'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300'
              }`}>
                {dashboardData.riskProfile.riskLabel}
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className="bg-white dark:bg-slate-800 rounded-lg p-4">
                <div className="text-2xl font-bold text-red-500 mb-1">{dashboardData.riskProfile.combinedRiskScore}</div>
                <div className="text-sm text-gray-600 dark:text-gray-300">Combined Risk Score</div>
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Assessment: {dashboardData.riskProfile.breakdown.assessmentContribution} + 
                  Footprint: {dashboardData.riskProfile.breakdown.footprintContribution}
                </div>
                <div className="text-[10px] text-gray-400 mt-1">(0-100, higher = more risk)</div>
              </div>
              <div className="bg-white dark:bg-slate-800 rounded-lg p-4">
                <div className="text-2xl font-bold text-blue-500 mb-1">{dashboardData.riskProfile.assessmentExposure}</div>
                <div className="text-sm text-gray-600 dark:text-gray-300">Assessment Exposure Score</div>
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">From your privacy practices (60% weight)</div>
                <div className="text-[10px] text-gray-400 mt-1">(0-100, higher = more risk)</div>
              </div>
              <div className="bg-white dark:bg-slate-800 rounded-lg p-4">
                <div className="text-2xl font-bold text-purple-500 mb-1">{dashboardData.riskProfile.digitalFootprintScore}</div>
                <div className="text-sm text-gray-600 dark:text-gray-300 flex items-center gap-1">
                  Digital Footprint Score
                  <span className="text-xs text-gray-500 dark:text-gray-400" title="Aggregate score calculated from your selected services' Privacy Exposure Indices. This is different from individual Service Exposure Indices shown in the catalog.">
                    ℹ️
                  </span>
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  From {dashboardData.riskProfile.serviceCount} monitored service{dashboardData.riskProfile.serviceCount !== 1 ? 's' : ''} (40% weight)
                </div>
                <div className="text-[10px] text-gray-400 mt-1">(0-100, higher = more risk)</div>
              </div>
            </div>
            {dashboardData.riskProfile.serviceExposures && dashboardData.riskProfile.serviceExposures.length > 0 && (
              <div className="mt-4 pt-4 border-t border-red-200 dark:border-red-800">
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Top Service Risks:</p>
                <div className="flex flex-wrap gap-2">
                  {dashboardData.riskProfile.serviceExposures.map((item, idx) => {
                    const service = getEnhancedService(item.serviceId) || serviceCatalog.find(s => s.id === item.serviceId);
                    return service ? (
                      <span key={idx} className="px-2 py-1 bg-white dark:bg-slate-800 rounded text-xs text-gray-700 dark:text-gray-300">
                        {service.name}: {item.exposure}
                      </span>
                    ) : null;
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Digital Footprint Report - Available for Standard plan users */}
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-gradient-to-br from-red-500 to-purple-600 rounded-lg">
                <Activity className="w-4 h-4 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Digital Footprint Report</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Based on your services & assessment · Privacy Exposure Index
                </p>
              </div>
            </div>
            {hasStandardAccess && digitalFootprintReport && (
              <button
                onClick={() => navigate('/dashboard?view=footprint')}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-semibold rounded-lg transition-all flex items-center gap-1.5"
              >
                View full report
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {!hasStandardAccess ? (
            <div className="bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 rounded-lg p-6 border border-red-200 dark:border-red-800">
              <div className="flex items-start gap-4">
                <div className="p-2 bg-red-600 rounded-lg flex-shrink-0">
                  <Lock className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    Upgrade to Standard Plan for Full Digital Footprint Analysis
                  </h4>
                  <p className="text-sm text-gray-700 dark:text-gray-300 mb-4">
                    Get comprehensive insights into your digital footprint with detailed breakdowns, risk analysis, and personalized recommendations.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <button
                      onClick={() => navigate('/pricing?plan=standard')}
                      className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
                    >
                      <Shield className="w-4 h-4" />
                      Upgrade to Standard
                    </button>
                    <button
                      onClick={() => {
                        // Navigate to app if available, otherwise show info
                        const appUrl = 'https://app.socialcaution.com';
                        window.open(appUrl, '_blank');
                      }}
                      className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white text-sm font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
                    >
                      <Globe className="w-4 h-4" />
                      Use Mobile App
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-3">
                    Standard plan includes: Full Digital Footprint Analysis, Privacy Analytics Dashboard, Unlimited Exports, and more.
                  </p>
                </div>
              </div>
            </div>
          ) : digitalFootprintReport ? (
            <>
              {selectedServices.length > 0 ? (
                <>
                  <p className="text-[10px] text-gray-500 dark:text-gray-400 mb-2" title="Footprint score combines your assessment, services count, and habits; avg service exposure is the average of your services' exposure indices only.">
                    Footprint score combines assessment + services + habits. Avg is services only.
                  </p>
                  <div className="grid grid-cols-3 gap-3 mb-2">
                    <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-700/50 text-center" title="Combines assessment (30%), average service exposure (30%), number of services, risk count, and data habits">
                      <div className="text-lg font-bold text-gray-900 dark:text-white">{digitalFootprintReport.score}</div>
                      <div className="text-[10px] text-gray-500 dark:text-gray-400 uppercase tracking-wider">Footprint</div>
                    </div>
                    <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-700/50 text-center" title="Average exposure index across your selected services">
                      <div className="text-lg font-bold text-gray-900 dark:text-white">{digitalFootprintReport.averageExposureIndex ?? '—'}</div>
                      <div className="text-[10px] text-gray-500 dark:text-gray-400 uppercase tracking-wider">Avg services</div>
                    </div>
                    <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-700/50 text-center flex flex-col items-center justify-center" title="Overall risk level from footprint score (70+ high, 50+ medium, else low)">
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                        digitalFootprintReport.riskLevel === 'high' ? 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300' :
                        digitalFootprintReport.riskLevel === 'medium' ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300' :
                        'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300'
                      }`}>
                        {digitalFootprintReport.riskLevel}
                      </span>
                      <div className="text-[10px] text-gray-500 dark:text-gray-400 uppercase tracking-wider mt-1">Risk</div>
                    </div>
                  </div>
                  <p className="text-[10px] text-gray-500 dark:text-gray-400 mb-3" title="Score bands from Privacy Exposure Index methodology">
                    0–29 Low · 30–49 Medium · 50–69 High · 70–100 Very High
                  </p>
                  {digitalFootprintReport.breakdown && (
                    <div className="mb-3 p-3 rounded-lg bg-slate-50 dark:bg-slate-700/30 border border-slate-200 dark:border-slate-600">
                      <div className="text-[10px] font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-2">How your score is made</div>
                      <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-gray-700 dark:text-gray-300">
                        <span title="30% from assessment exposure">Assessment +{digitalFootprintReport.breakdown.assessmentContribution}</span>
                        <span title="30% from average service exposure">Services +{digitalFootprintReport.breakdown.serviceExposureContribution}</span>
                        <span title="15% from number of services">Count +{digitalFootprintReport.breakdown.serviceCountContribution}</span>
                        <span title="20% from service risk count">Risks +{digitalFootprintReport.breakdown.serviceRiskContribution}</span>
                        <span title="5% from data habits">Habits +{digitalFootprintReport.breakdown.dataExposureContribution}</span>
                      </div>
                    </div>
                  )}
                  {digitalFootprintReport.services?.length > 0 && (
                    <div className="text-xs text-gray-600 dark:text-gray-400 border-t border-gray-100 dark:border-slate-600 pt-3 mb-3">
                      <span className="font-medium text-gray-700 dark:text-gray-300">Highest exposure:</span>{' '}
                      {digitalFootprintReport.services.slice(0, 2).map(s => s.serviceName).join(', ')}
                      {digitalFootprintReport.services.length > 2 && ` +${digitalFootprintReport.services.length - 2} more`}
                    </div>
                  )}
                  {digitalFootprintReport.categoryBreakdown?.length > 0 && (
                    <div className="border-t border-gray-100 dark:border-slate-600 pt-3">
                      <div className="text-[10px] font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-2">Exposure by category</div>
                      <div className="flex flex-wrap gap-2">
                        {digitalFootprintReport.categoryBreakdown.map((cat) => (
                          <span
                            key={cat.category}
                            className="px-2 py-1 rounded-md bg-slate-100 dark:bg-slate-700 text-xs text-gray-700 dark:text-gray-300"
                            title={`${cat.count} service(s), avg exposure ${cat.averageExposure?.toFixed(0) ?? '—'}`}
                          >
                            {cat.category.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')} {cat.averageExposure != null ? Math.round(cat.averageExposure) : '—'}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Add services you use in Services Monitoring and complete the assessment to run your digital footprint analysis.
                </p>
              )}
            </>
          ) : (
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Add services you use in the Service Catalog and complete the assessment to run your digital footprint analysis.
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Priority Actions - Personalized */}
          <div className="lg:col-span-2 space-y-6">
            <div data-tutorial="priority-actions" className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 p-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
                <Target className="w-5 h-5 mr-2 text-red-500" />
                Your Priority Actions
              </h2>
              <div className="space-y-4">
                {dashboardData.priorityActions.map((action, index) => {
                  const ActionIcon = action.icon || Shield;
                  return (
                  <div key={action.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 bg-gray-50 dark:bg-slate-700 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-600 transition-colors">
                    <div className="flex items-center flex-1 min-w-0">
                      <div className={`w-10 h-10 flex-shrink-0 rounded-full flex items-center justify-center mr-3 sm:mr-4 ${
                        action.priority === 'high' ? 'bg-red-100 text-red-600' : 'bg-yellow-100 text-yellow-600'
                      }`}>
                        <ActionIcon className="w-5 h-5" />
                      </div>
                      <div className="min-w-0">
                        <h3 className="font-medium text-sm sm:text-base text-gray-900 dark:text-white truncate">{action.title}</h3>
                        <p className="text-xs sm:text-sm text-gray-500">Estimated time: {action.estimate}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleStartAction(action)}
                      className="w-full sm:w-auto px-4 py-2 bg-red-500 text-white text-sm font-medium rounded-xl hover:bg-red-600 transition-all transform hover:scale-105 shadow-md hover:shadow-lg whitespace-nowrap"
                    >
                      Start
                    </button>
                  </div>
                  );
                })}
              </div>
            </div>

            {/* Progress Tracker */}
            <ProgressTracker
              tasks={[
                { id: '1', title: 'Set up password manager', description: 'Secure all your accounts', timeEstimate: '10 min', priority: 'high' },
                { id: '2', title: 'Enable two-factor authentication', description: 'Add extra security layer', timeEstimate: '15 min', priority: 'high' },
                { id: '3', title: 'Review social media privacy', description: 'Protect your social presence', timeEstimate: '20 min', priority: 'medium' },
                { id: '4', title: 'Install ad blocker', description: 'Block tracking and ads', timeEstimate: '5 min', priority: 'medium' },
                { id: '5', title: 'Clean up old accounts', description: 'Delete unused accounts', timeEstimate: '30 min', priority: 'low' },
                { id: '6', title: 'Set up VPN', description: 'Secure your internet connection', timeEstimate: '15 min', priority: 'medium' }
              ]}
              onTaskComplete={handleTaskComplete}
              title="Privacy Improvement Checklist"
            />

            {/* Personalized Action Plan */}
            {dashboardData.roadmap && dashboardData.roadmap.phases && (
              <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 p-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
                  <TrendingUp className="w-5 h-5 mr-2 text-purple-500" />
                  Your Privacy Action Plan
                </h2>
                <div className="space-y-6">
                  {dashboardData.roadmap.phases.map((phase, index) => (
                    <div key={index} className="relative">
                      <div className="flex items-center mb-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold mr-4 ${
                          phase.progress > 50 ? 'bg-green-500' : phase.progress > 0 ? 'bg-blue-500' : 'bg-gray-400'
                        }`}>
                          {index + 1}
                        </div>
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{phase.name}</h3>
                          <p className="text-sm text-gray-600 dark:text-gray-300">{phase.description}</p>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold text-gray-900 dark:text-white">{phase.progress}%</div>
                          <div className="text-xs text-gray-500">{phase.timeframe}</div>
                        </div>
                      </div>
                      <div className="ml-12 mb-4">
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-3">
                          <div 
                            className={`h-2 rounded-full transition-all duration-300 ${
                              phase.progress > 50 ? 'bg-green-500' : 'bg-blue-500'
                            }`}
                            style={{ width: `${phase.progress}%` }}
                          />
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {phase.tasks.map((task, taskIndex) => (
                            <span key={taskIndex} className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs rounded">
                              {task}
                            </span>
                          ))}
                        </div>
                      </div>
                      {index < dashboardData.roadmap.phases.length - 1 && (
                        <div className="absolute left-4 top-12 w-px h-12 bg-gray-300 dark:bg-gray-600"></div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Personalized Insights */}
            <div data-tutorial="insights" className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 p-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
                <TrendingUp className="w-5 h-5 mr-2 text-blue-500" />
                Personalized Insights
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {dashboardData.insights.map((insight, index) => (
                  <div key={index} className={`p-4 rounded-lg border ${
                    insight.type === 'warning' ? 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800' :
                    insight.type === 'info' ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800' :
                    'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
                  }`}>
                    <h3 className={`font-medium mb-2 ${
                      insight.type === 'warning' ? 'text-red-900 dark:text-red-100' :
                      insight.type === 'info' ? 'text-blue-900 dark:text-blue-100' :
                      'text-green-900 dark:text-green-100'
                    }`}>{insight.title}</h3>
                    <p className={`text-sm ${
                      insight.type === 'warning' ? 'text-red-700 dark:text-red-300' :
                      insight.type === 'info' ? 'text-blue-700 dark:text-blue-300' :
                      'text-green-700 dark:text-green-300'
                    }`}>{insight.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar - Personalized Resources & Tools */}
          <div className="space-y-6">
            {/* Subscription Management */}
            <SubscriptionManagement />

            {/* Recommended Resources */}
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 p-6">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                <BookOpen className="w-5 h-5 mr-2 text-green-500" />
                Recommended for You
              </h3>
              <div className="space-y-3">
                {dashboardData.recommendedResources.map((resource, index) => (
                  <div key={index} className="p-3 bg-gray-50 dark:bg-slate-700 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-600 cursor-pointer transition-colors">
                    <h4 className="font-medium text-gray-900 dark:text-white text-sm">{resource.title}</h4>
                    <p className="text-xs text-gray-500">{resource.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Tools */}
            <div data-tutorial="quick-actions" className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 p-6">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                <Wrench className="w-5 h-5 mr-2 text-purple-500" />
                Quick Tools
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {dashboardData.relevantTools.map((tool, index) => {
                  const ToolIcon = tool.icon || Wrench;
                  return (
                  <button 
                    key={index} 
                    type="button"
                    onClick={() => handleToolUse(tool)}
                    className="p-3 bg-gradient-to-br from-red-500 to-red-600 text-white rounded-lg hover:from-red-600 hover:to-red-700 transition-all transform hover:scale-105"
                  >
                    <div className="text-center">
                      <ToolIcon className="w-6 h-6 mx-auto mb-1" />
                      <span className="text-xs font-medium whitespace-pre-line">{tool.name}</span>
                    </div>
                  </button>
                  );
                })}
              </div>
            </div>

            {/* AI Message Risk Checker - Available for all personas */}
            <div className="bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 rounded-xl shadow-sm border-2 border-purple-200 dark:border-purple-800 p-6">
              <div className="flex items-center space-x-3 mb-3">
                <div className="p-2 bg-purple-600 rounded-lg">
                  <Shield className="h-5 w-5 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Message Risk Checker</h3>
              </div>
              <p className="text-gray-700 dark:text-gray-300 text-sm mb-4">
                Paste suspicious emails, SMS, or notifications to analyze for phishing and manipulation patterns.
              </p>
              <div className="flex items-center space-x-2 mb-4 text-xs text-purple-700 dark:text-purple-300 bg-purple-100 dark:bg-purple-900/30 p-2 rounded">
                <Lock className="h-3 w-3 flex-shrink-0" />
                <span>Analysis happens in your browser - completely private</span>
              </div>
              <button 
                type="button"
                onClick={() => navigate('/message-checker')}
                className="w-full px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium flex items-center justify-center gap-2 shadow-sm hover:shadow-md"
              >
                <Shield className="h-4 w-4" />
                Check a Message Now
              </button>
            </div>

            {/* Trends Tracker Module - Service-based privacy regulations */}
            {selectedServices.length > 0 && (
              <TrendsTrackerModule 
                selectedServices={selectedServices}
                maxItems={3}
              />
            )}

            {/* RSS Feed Alerts - Real-time security alerts from open-source feeds */}
            <RSSFeedAlertsPanel />
            
            {/* Privacy Radar Widget */}
            <PrivacyRadarWidget />

            {/* Contextual Navigation */}
            <ContextualLinks
              currentPage="dashboard"
              userPersona={activePersona}
              assessmentResults={activeAssessmentResults}
              className="mb-6"
              showAsCards={false}
              maxLinks={4}
            />

            {/* Usage Limits (Free Tier Only) */}
            <LimitDisplay compact={false} showUpgradeButton={true} />

            {/* Progress Tracking */}
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 p-6">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                <Activity className="w-5 h-5 mr-2 text-orange-500" />
                Your Progress
              </h3>
              <div className="space-y-4">
                {dashboardData.progressMetrics && Array.isArray(dashboardData.progressMetrics) && dashboardData.progressMetrics.map((metric, index) => (
                  <div key={index}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600 dark:text-gray-300">{metric.label}</span>
                      <span className="font-medium text-gray-900 dark:text-white">{metric.value}%</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-red-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${metric.value}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Additional Resources Section */}
        <div className="mt-8">
          {/* Service Notifications Section */}
          {selectedServices.length > 0 && (
            <div id="service-notifications" className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 p-6 mb-8">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    <Bell className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    Service Privacy Updates
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 mt-1 text-sm">
                    Stay informed about privacy policy changes and security updates for your selected services
                  </p>
                </div>
                <button
                  type="button"
                  onClick={checkForServiceUpdates}
                  className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                >
                  <Shield className="w-4 h-4" />
                  Check for Updates
                </button>
              </div>

              {serviceNotifications.length > 0 ? (
                <div className="space-y-3">
                  {serviceNotifications.map((notification, index) => {
                    const IconComponent = getIconComponent(serviceNotificationManager.getNotificationIcon(notification.type));
                    const priorityColor = serviceNotificationManager.getNotificationColor(notification.priority);
                    const colorClasses = {
                      high: 'border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20',
                      medium: 'border-orange-200 dark:border-orange-800 bg-orange-50 dark:bg-orange-900/20',
                      low: 'border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/20'
                    };

                    return (
                      <div
                        key={index}
                        className={`p-4 rounded-lg border ${colorClasses[notification.priority] || colorClasses.low}`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-3 flex-1">
                            <IconComponent className={`w-5 h-5 mt-0.5 flex-shrink-0 ${
                              notification.priority === 'high' ? 'text-red-600 dark:text-red-400' :
                              notification.priority === 'medium' ? 'text-orange-600 dark:text-orange-400' :
                              'text-blue-600 dark:text-blue-400'
                            }`} />
                            <div className="flex-1">
                              <h4 className="font-semibold text-gray-900 dark:text-white text-sm mb-1">
                                {notification.title}
                              </h4>
                              <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
                                {notification.message}
                              </p>
                              {notification.action && (
                                <a
                                  href={notification.action.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-sm text-blue-600 dark:text-blue-400 hover:underline inline-flex items-center gap-1"
                                >
                                  {notification.action.label}
                                  <ExternalLink className="w-3 h-3" />
                                </a>
                              )}
                              {notification.timestamp && (
                                <div className="flex items-center gap-1 mt-2 text-xs text-gray-500 dark:text-gray-400">
                                  <Clock className="w-3 h-3" />
                                  {new Date(notification.timestamp).toLocaleDateString()}
                                </div>
                              )}
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => toggleNotificationPreference(notification.serviceId)}
                            className="ml-2 p-1.5 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors"
                            title={notificationPrefs[notification.serviceId] === false ? 'Enable notifications' : 'Disable notifications'}
                          >
                            {notificationPrefs[notification.serviceId] === false ? (
                              <BellOff className="w-4 h-4 text-gray-400" />
                            ) : (
                              <Bell className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                            )}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-8">
                  <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
                  <p className="text-gray-600 dark:text-gray-300">
                    No privacy updates at this time. All your services are up to date!
                  </p>
                  {lastChecked && (
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                      Last checked: {new Date(lastChecked).toLocaleString()}
                    </p>
                  )}
                </div>
              )}

              <div className="mt-4 pt-4 border-t border-gray-200 dark:border-slate-700">
                <button
                  type="button"
                  onClick={() => navigate('/service-catalog')}
                  className="text-sm text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
                >
                  Manage notification preferences in Services Monitoring
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* Service-Based Tools Section */}
          {selectedServices.length > 0 && serviceBasedTools.length > 0 && (
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl shadow-sm border border-blue-200 dark:border-blue-800 p-6 mb-8">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    <Shield className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    Recommended Tools for Your Services
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 mt-1 text-sm">
                    Based on {selectedServices.length} service{selectedServices.length !== 1 ? 's' : ''} you're monitoring in Services Monitoring
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => navigate('/service-catalog')}
                  className="px-4 py-2 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-lg transition-colors text-sm font-medium flex items-center gap-2"
                >
                  View Services Monitoring
                  <ExternalLink className="w-4 h-4" />
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {serviceBasedTools.slice(0, 6).map((tool) => {
                  const TypeIcon = getToolTypeIcon(tool.type);
                  return (
                    <div key={tool.id} className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-blue-200 dark:border-blue-700 p-4 hover:shadow-md transition-all">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2 flex-1">
                          {(() => {
                            const IconComponent = getIconComponent(tool.icon);
                            return <IconComponent className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0" />;
                          })()}
                          <h4 className="font-semibold text-gray-900 dark:text-white text-sm">{tool.name}</h4>
                        </div>
                        {tool.isInternal !== undefined && (
                          <span className={`ml-2 px-1.5 py-0.5 text-xs font-medium rounded-full flex items-center gap-1 flex-shrink-0 ${
                            tool.isInternal 
                              ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' 
                              : 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400'
                          }`}>
                            {tool.isInternal ? (
                              <Home className="w-2.5 h-2.5" />
                            ) : (
                              <Globe className="w-2.5 h-2.5" />
                            )}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-600 dark:text-gray-300 mb-3 line-clamp-2">{tool.description}</p>
                      <button
                        type="button"
                        onClick={() => handleToolUse(tool)}
                        className="w-full px-3 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors text-xs font-medium flex items-center justify-center gap-1"
                      >
                        {tool.isInternal ? 'Open Tool' : 'Visit Site'}
                        {tool.isInternal ? (
                          <Home className="w-3 h-3" />
                        ) : (
                          <ExternalLink className="w-3 h-3" />
                        )}
                      </button>
                    </div>
                  );
                })}
              </div>
              {serviceBasedTools.length > 6 && (
                <button
                  type="button"
                  onClick={() => navigate('/toolkit-access')}
                  className="mt-4 text-sm text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
                >
                  View all {serviceBasedTools.length} recommended tools
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>
          )}

          {/* My Services Section */}
          <div data-tutorial="monitored-services" className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 p-6 mb-8">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
              My Services
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4 text-sm">
              Select the services you use to receive AI-powered Privacy-Preserving Personalization insights tailored to your privacy concerns.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {allServices.map(service => {
                // Validate service has required properties
                if (!service || !service.id) {
                  console.warn('[PersonalizedDashboard] Invalid service object:', service);
                  return null;
                }

                const isSelected = Array.isArray(selectedServices) && selectedServices.includes(service.id);
                const personaHints = personaServiceHints[activePersona?.primary];
                const isHighlighted = personaHints?.highlightCategories?.includes(service.category);
                const exposureIndex = calculatePrivacyExposureIndex(service.id);
                const exposureLevel = getExposureLevel(exposureIndex);
                const logoUrl = getServiceLogoUrl(service.id, theme === 'dark');

                return (
                  <button
                    key={service.id}
                    type="button"
                    onClick={() => toggleServiceSelection(service.id)}
                    className={`p-3 rounded-lg border text-left transition-all ${
                      isSelected
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                        : isHighlighted
                          ? 'border-orange-300 dark:border-orange-600 bg-orange-50 dark:bg-orange-900/10'
                          : 'border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-slate-700 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        {logoUrl && (
                          <div className="w-5 h-5 flex-shrink-0 flex items-center justify-center bg-white dark:bg-gray-800 rounded p-0.5">
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
                        )}
                        <span className="font-medium text-sm text-gray-900 dark:text-white truncate">
                          {service.name}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 flex-shrink-0 ml-1">
                        {isSelected && <Check className="w-4 h-4 text-blue-600" />}
                        {!isSelected && isHighlighted && <AlertTriangle className="w-4 h-4 text-orange-500" />}
                      </div>
                    </div>
                    {exposureIndex !== null && (
                      <div className="flex items-center gap-2 mt-1">
                        <div className="flex-1 bg-gray-200 dark:bg-gray-600 rounded-full h-1.5">
                          <div
                            className={`h-1.5 rounded-full ${exposureLevel.barColor}`}
                            style={{ width: `${exposureIndex}%` }}
                          />
                        </div>
                        <span className={`text-xs font-medium ${exposureLevel.textColor}`}>
                          {exposureIndex}
                        </span>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
            {getHighlightedServices().length > 0 && (
              <div className="mt-4 p-3 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-700 rounded-lg">
                <p className="text-sm text-orange-800 dark:text-orange-200">
                  <AlertTriangle className="w-4 h-4 inline mr-2" />
                  Services marked with ⚠️ are prioritized for your privacy concerns based on AI-powered analysis of your privacy profile.
                </p>
              </div>
            )}
          </div>

          {/* My Services Risk Snapshot */}
          {selectedServiceDetails.length > 0 && (
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 p-6 mb-8">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                My Services Risk Snapshot
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6 text-sm">
                Privacy Concerns-based risk analysis and AI-powered recommendations for your selected services.
              </p>
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
                      <div className="flex-1">
                        <h4 className="text-xl font-bold text-gray-900 dark:text-white">{service.name}</h4>
                        {service.isHighlighted && (
                          <span className="mt-1 inline-block px-2 py-1 bg-orange-100 dark:bg-orange-800 text-orange-800 dark:text-orange-200 text-xs font-medium rounded">
                            Priority for Your Concerns
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Privacy Exposure Index */}
                    {service.exposureIndex !== null && service.exposureIndex !== undefined && (
                      <div className="mb-4 p-4 bg-gray-50 dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-slate-600">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <Gauge className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                            <h5 className="font-semibold text-gray-900 dark:text-white text-sm">
                              Privacy Exposure Index
                            </h5>
                            <a
                              href="/privacy-exposure-disclaimer"
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
                              title="Learn how we calculate this score"
                            >
                              (How is this calculated?)
                            </a>
                          </div>
                          <span className={`text-2xl font-bold ${service.exposureLevel.textColor}`}>
                            {service.exposureIndex}
                            <span className="text-sm ml-1">/100</span>
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2.5 mb-2">
                          <div
                            className={`h-2.5 rounded-full transition-all ${service.exposureLevel.barColor}`}
                            style={{ width: `${service.exposureIndex}%` }}
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <span className={`text-sm font-medium ${service.exposureLevel.textColor}`}>
                            {service.exposureLevel.level} Exposure
                          </span>
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            Based on risks, regulations, and data practices
                          </span>
                        </div>
                      </div>
                    )}

                    {service.personaExtraNote && (
                      <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded">
                        <p className="text-sm text-blue-900 dark:text-blue-100 font-medium">
                          💡 {service.personaExtraNote}
                        </p>
                      </div>
                    )}

                    <h5 className="font-semibold text-gray-900 dark:text-white mb-2 text-sm">Recommended Actions:</h5>
                    <ul className="space-y-1">
                      {service.recommendedActions?.slice(0, 3).map((action, idx) => (
                        <li key={idx} className="text-sm text-gray-700 dark:text-gray-300 flex items-start">
                          <CheckCircle className="w-4 h-4 mr-2 mt-0.5 text-green-500 flex-shrink-0" />
                          {action}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Privacy Report Export */}
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 p-6 mb-8">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
              Export Your Privacy Report
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4 text-sm">
              Download your complete privacy assessment or copy a summary to share with others.
            </p>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={handleDownloadReport}
                  className="inline-flex items-center px-4 py-2 rounded-xl bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition-all transform hover:scale-105 shadow-md hover:shadow-lg"
              >
                <Download className="w-4 h-4 mr-2" />
                Download Report (JSON)
              </button>
              <button
                onClick={handleCopySummary}
                className="inline-flex items-center px-4 py-2 rounded-xl bg-gray-600 text-white text-sm font-medium hover:bg-gray-700 transition-all transform hover:scale-105 shadow-md hover:shadow-lg"
              >
                {copyStatus === 'copied' ? (
                  <><Check className="w-4 h-4 mr-2" />Copied!</>
                ) : (
                  <><Copy className="w-4 h-4 mr-2" />Copy Summary</>
                )}
              </button>
            </div>

            {/* Email Report Section */}
            <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
              <h4 className="text-md font-semibold text-gray-900 dark:text-white mb-3">
                Email Report to Yourself
              </h4>
              <p className="text-gray-600 dark:text-gray-300 mb-3 text-sm">
                Receive a formatted version of your privacy report via email.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your.email@example.com"
                  className="flex-1 px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  disabled={emailStatus === 'sending'}
                />
                <button
                  onClick={handleSendEmail}
                  disabled={emailStatus === 'sending' || !email}
                  className="inline-flex items-center px-4 py-2 rounded-xl bg-green-600 text-white text-sm font-medium hover:bg-green-700 transition-all transform hover:scale-105 shadow-md hover:shadow-lg disabled:bg-gray-400 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {emailStatus === 'sending' ? 'Sending...' : emailStatus === 'sent' ? <><Check className="w-4 h-4 mr-2" />Sent!</> : <><Send className="w-4 h-4 mr-2" />Send Report</>}
                </button>
              </div>
              {emailStatus === 'error' && (
                <p className="mt-2 text-sm text-red-600 dark:text-red-400">Failed to send email. Please check your email address and try again.</p>
              )}
            </div>
          </div>
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 p-6 mb-8">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
              Ready to Take Action?
            </h3>
            <button
              type="button"
              onClick={() => navigate('/toolkit-access')}
              className="inline-flex items-center px-4 py-2 rounded-xl bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition-all transform hover:scale-105 shadow-md hover:shadow-lg"
            >
              Explore the Privacy Toolkit
            </button>
          </div>
            <RelatedContent
              userPersona={activePersona}
              currentPage="dashboard"
              assessmentResults={activeAssessmentResults}
              title="Continue Improving Your Privacy"
              className="max-w-2xl"
            />
        </div>
      </div>

      {/* Quick Rating Widget */}
      <QuickRatingWidget
        featureName="Personalized Dashboard"
        context="dashboard"
        minInteractionTime={30}
      />
    </div>
  );
};

export default PersonalizedDashboard;