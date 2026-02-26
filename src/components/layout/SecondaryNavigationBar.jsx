import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, Home, ChevronRight, Users, Shield, Target, LayoutDashboard, BookOpen, Wrench, Info, AlertTriangle, DollarSign, Radar, FileText, Calendar, MessageSquare, HelpCircle, Mail, Settings, BarChart3, Globe, GraduationCap, Briefcase, CreditCard, Rss, Image, UserCircle } from 'lucide-react';
import { getWorkflowProgress, checkWorkflowCompletion } from '../../utils/workflowCheck';
import { useTranslation } from '../../contexts/TranslationContext';
import { useTheme } from '../../contexts/ThemeContext';

const SecondaryNavigationBar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { t, translations, isLoading: translationsLoading } = useTranslation();
  const { theme } = useTheme();
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(null);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [headerHeight, setHeaderHeight] = useState(64);

  // Define workflow steps based on the onboarding flow
  // Service Catalog is now Step 1 for better engagement and immediate value
  // Memoize to prevent unnecessary recreations and ensure consistency
  // First 4 steps are required, last 2 (dashboard, resources) are optional
  const workflowSteps = useMemo(() => [
    {
      id: 'services',
      title: t('common.workflow.serviceCatalog'),
      path: '/service-catalog',
      icon: Shield,
      description: t('common.workflow.serviceCatalogDesc'),
      isRequired: true
    },
    {
      id: 'concerns',
      title: t('common.workflow.account'),
      path: '/settings',
      icon: Settings,
      description: t('common.workflow.accountDesc'),
      isRequired: true
    },
    {
      id: 'assessment',
      title: t('common.workflow.takeAssessment'),
      path: '/assessment',
      icon: Target,
      description: t('common.workflow.takeAssessmentDesc'),
      isRequired: true
    },
    {
      id: 'dashboard',
      title: t('common.workflow.viewDashboard'),
      path: '/dashboard',
      icon: LayoutDashboard,
      description: t('common.workflow.viewDashboardDesc'),
      isRequired: false
    },
    {
      id: 'resources',
      title: t('common.workflow.exploreResources'),
      path: '/adaptive-resources',
      icon: BookOpen,
      description: t('common.workflow.exploreResourcesDesc'),
      isRequired: false
    }
  ], [t]);

  // Calculate number of required steps (first 4)
  const requiredStepsCount = useMemo(() => {
    return workflowSteps.filter(step => step.isRequired).length;
  }, [workflowSteps]);

  // Measure Header height dynamically
  useEffect(() => {
    const measureHeader = () => {
      const header = document.querySelector('header');
      if (header) {
        const height = header.getBoundingClientRect().height;
        setHeaderHeight(height);
      }
    };
    
    measureHeader();
    window.addEventListener('resize', measureHeader);
    // Re-measure after a short delay to ensure Header is rendered
    const timeout = setTimeout(measureHeader, 100);
    
    return () => {
      window.removeEventListener('resize', measureHeader);
      clearTimeout(timeout);
    };
  }, []);

  // Calculate current step and progress
  useEffect(() => {
    const currentPath = location.pathname;
    
    // Find current step based on path - check exact matches first, then prefix matches
    let stepIndex = -1;
    
    // First, try exact path matches
    for (let i = 0; i < workflowSteps.length; i++) {
      const step = workflowSteps[i];
      if (currentPath === step.path) {
        stepIndex = i;
        break;
      }
    }
    
    // If no exact match, try prefix matches (for sub-routes)
    if (stepIndex === -1) {
      for (let i = 0; i < workflowSteps.length; i++) {
        const step = workflowSteps[i];
        // Check if current path starts with step path (handles sub-routes)
        if (currentPath.startsWith(step.path + '/') || 
            (step.path !== '/' && currentPath.startsWith(step.path))) {
          stepIndex = i;
          break;
        }
      }
    }

    // If still no match, try to infer from workflow completion
    if (stepIndex === -1) {
      const workflowStatus = checkWorkflowCompletion();
      
      // Determine step based on what's completed
      // Service Catalog is now Step 1 for better engagement
      // Note: step2_services refers to services (step 0 in array)
      if (!workflowStatus.step2_services) {
        stepIndex = 0; // Service catalog (first step, index 0)
      } else if (!workflowStatus.step3_concerns) {
        stepIndex = 1; // Privacy concerns (second step, index 1)
      } else if (!workflowStatus.step4_assessment) {
        stepIndex = 2; // Assessment (third step, index 2)
      } else {
        // Default to dashboard if all required steps are complete
        stepIndex = 3; // Dashboard (fourth step, index 3)
      }
    }

    // Always set current step and index, even if stepIndex is -1 (fallback to first step)
    const finalStepIndex = stepIndex >= 0 && stepIndex < workflowSteps.length 
      ? stepIndex 
      : 0;
    
    const finalStep = workflowSteps[finalStepIndex];
    
    // Always set current step and progress, ensuring they're always available
    if (finalStep) {
      setCurrentStep(finalStep);
      setCurrentStepIndex(finalStepIndex);
    } else if (workflowSteps.length > 0) {
      // Fallback to first step if finalStep is somehow null
      setCurrentStep(workflowSteps[0]);
      setCurrentStepIndex(0);
    }
    
    // Always calculate progress based on workflow completion (required steps only)
    try {
      const workflowProgress = getWorkflowProgress();
      // Progress is based on 4 required steps, so it's already correct
      setProgress(Math.max(0, Math.min(100, workflowProgress.percentage)));
    } catch (error) {
      if (import.meta.env.DEV) {
        console.warn('[SecondaryNavigationBar] Error calculating workflow progress:', error);
      }
      setProgress(0);
    }
  }, [location.pathname, workflowSteps]);

  // Memoize route hierarchy to ensure translations are used correctly
  const routeHierarchy = useMemo(() => ({
    // Main pages (2 levels: Home > Page)
    // Privacy Radar and Trends Tracker are subpages of Privacy Toolkit (3 levels: Home > Privacy Toolkit > Page)
    '/privacy-regulations': { name: t('common.breadcrumbs.privacyTrends') || 'Privacy Trends', parent: { name: t('common.navigation.privacyToolkit'), href: '/toolkit-access', icon: Wrench }, icon: AlertTriangle },
    '/trends-tracker': { name: t('common.breadcrumbs.privacyTrends') || 'Privacy Trends', parent: { name: t('common.navigation.privacyToolkit'), href: '/toolkit-access', icon: Wrench }, icon: AlertTriangle },
    '/privacy-radar': { name: t('common.navigation.privacyRadar'), parent: { name: t('common.navigation.privacyToolkit'), href: '/toolkit-access', icon: Wrench }, icon: Radar },
    '/alerts': { name: t('common.navigation.alerts'), parent: null, icon: Rss },
    '/service-catalog': { name: t('common.navigation.serviceCatalog'), parent: null, icon: Shield },
    '/how-it-works': { name: t('common.navigation.howItWorks'), parent: null, icon: Info },
    '/pricing': { name: t('common.navigation.pricing'), parent: null, icon: DollarSign },
    '/settings': { name: t('common.breadcrumbs.privacySettings') || 'Settings', parent: null, icon: Settings },
    '/dashboard': { name: t('common.navigation.dashboard'), parent: null, icon: LayoutDashboard },
    '/my-dashboard': { name: t('common.navigation.dashboard'), parent: null, icon: LayoutDashboard },
    '/contact': { name: t('common.navigation.contact') || 'Contact', parent: null, icon: Mail },
    '/support': { name: t('common.navigation.support') || 'Support', parent: null, icon: HelpCircle },
    '/faq': { name: t('common.navigation.faq') || 'FAQ', parent: null, icon: HelpCircle },
    '/tutorial': { name: t('common.navigation.tutorial') || 'Tutorial', parent: null, icon: BookOpen },
    
    // Toolkit pages (2 levels: Home > Privacy Toolkit)
    '/toolkit-access': { name: t('common.navigation.privacyToolkit'), parent: null, icon: Wrench },
    '/toolkit': { name: t('common.navigation.privacyToolkit'), parent: null, icon: Wrench },
    '/adaptive-resources': { name: t('common.navigation.privacyToolkit'), parent: null, icon: Wrench },
    
    // Dashboard subpages (3 levels: Home > Dashboard > Subpage)
    '/exposure-dashboard': { name: t('common.breadcrumbs.exposureDashboard') || 'Exposure Dashboard', parent: { name: t('common.navigation.dashboard'), href: '/dashboard', icon: LayoutDashboard }, icon: BarChart3 },
    '/my-services': { name: t('common.breadcrumbs.myServices') || 'My Services', parent: { name: t('common.navigation.dashboard'), href: '/dashboard', icon: LayoutDashboard }, icon: Shield },
    '/digital-footprint-analysis': { name: t('common.breadcrumbs.digitalFootprintAnalysis') || 'Digital Footprint Analysis', parent: { name: t('common.navigation.dashboard'), href: '/dashboard', icon: LayoutDashboard }, icon: Globe },
    
    // Toolkit subpages (3 levels: Home > Privacy Toolkit > Subpage)
    '/privacy-tools': { name: t('common.breadcrumbs.externalTools') || 'External Tools', parent: { name: t('common.navigation.privacyToolkit'), href: '/toolkit-access', icon: Wrench }, icon: Wrench },
    '/tools/message-checker': { name: t('common.breadcrumbs.messageChecker') || 'AI Message Checker', parent: { name: t('common.navigation.privacyToolkit'), href: '/toolkit-access', icon: Wrench }, icon: MessageSquare },
    '/tools/personal-data-inventory': { name: t('common.breadcrumbs.personalDataInventory') || 'Personal Data Inventory', parent: { name: t('common.navigation.privacyToolkit'), href: '/toolkit-access', icon: Wrench }, icon: FileText },
    '/tools/data-broker-removal': { name: t('common.breadcrumbs.dataBrokerRemoval') || 'Data Broker Removal', parent: { name: t('common.navigation.privacyToolkit'), href: '/toolkit-access', icon: Wrench }, icon: Shield },
    '/tools/exposure-report': { name: t('common.breadcrumbs.exposureReport') || 'Exposure Report', parent: { name: t('common.navigation.privacyToolkit'), href: '/toolkit-access', icon: Wrench }, icon: FileText },
    '/tools/ai/image-analyzer': { name: t('common.breadcrumbs.imageMetadataAnalyzer') || 'Image Metadata Analyzer', parent: { name: t('common.navigation.privacyToolkit'), href: '/toolkit-access', icon: Wrench }, icon: Image },
    '/tools/ai/email-analyzer': { name: t('common.breadcrumbs.emailHeaderAnalyzer') || 'Email Header Analyzer', parent: { name: t('common.navigation.privacyToolkit'), href: '/toolkit-access', icon: Wrench }, icon: Mail },
    '/tools/ai/profile-verifier': { name: t('common.breadcrumbs.socialProfileVerifier') || 'Social Profile Verifier', parent: { name: t('common.navigation.privacyToolkit'), href: '/toolkit-access', icon: Wrench }, icon: UserCircle },
    '/message-checker': { name: t('common.breadcrumbs.messageChecker') || 'AI Message Checker', parent: { name: t('common.navigation.privacyToolkit'), href: '/toolkit-access', icon: Wrench }, icon: MessageSquare },
    '/privacy-assistant': { name: t('common.breadcrumbs.privacyAssistant') || 'Privacy Assistant', parent: { name: t('common.navigation.privacyToolkit'), href: '/toolkit-access', icon: Wrench }, icon: MessageSquare },
    '/action-planner': { name: t('common.breadcrumbs.actionPlanner') || 'Action Planner', parent: { name: t('common.navigation.privacyToolkit'), href: '/toolkit-access', icon: Wrench }, icon: Target },
    '/exposure-report': { name: t('common.breadcrumbs.exposureReport') || 'Exposure Report', parent: { name: t('common.navigation.privacyToolkit'), href: '/toolkit-access', icon: Wrench }, icon: FileText },
    
    // Assessment pages (2-3 levels: Home > Assessment > Type)
    '/assessment': { name: t('common.breadcrumbs.assessment'), parent: null, icon: Target },
    '/assessments': { name: t('common.breadcrumbs.assessment'), parent: null, icon: Target },
    '/assessment/exposure': { name: t('common.breadcrumbs.digitalPrivacyRisk'), parent: { name: t('common.breadcrumbs.assessment'), href: '/assessment', icon: Target }, icon: Target },
    '/assessment/rights': { name: t('common.breadcrumbs.privacyRights'), parent: { name: t('common.breadcrumbs.assessment'), href: '/assessment', icon: Target }, icon: Target },
    '/assessment/full': { name: t('common.breadcrumbs.completePrivacy'), parent: { name: t('common.breadcrumbs.assessment'), href: '/assessment', icon: Target }, icon: Target },
    
    // Calendar pages (2 levels: Home > Page)
    '/privacy-calendar': { name: 'Privacy Calendar', parent: null, icon: Calendar },
    '/privacy-calendar-standalone': { name: 'Privacy Calendar', parent: null, icon: Calendar },
    
    // Premium/Service pages (2-3 levels: Home > Category > Page)
    '/premium/templates': { name: 'Report Templates', parent: { name: 'Premium', href: '/pricing', icon: DollarSign }, icon: FileText },
    '/services/audit': { name: 'Professional Audit', parent: { name: 'Services', href: '/pricing', icon: Briefcase }, icon: Briefcase },
    '/enterprise/pricing': { name: 'Enterprise Pricing', parent: { name: 'Enterprise', href: '/pricing', icon: DollarSign }, icon: CreditCard },
    '/courses': { name: 'Privacy Courses', parent: null, icon: GraduationCap },
    
    // Legal pages (2 levels: Home > Page)
    '/privacy-policy': { name: 'Privacy Policy', parent: null, icon: FileText },
    '/terms': { name: 'Terms of Service', parent: null, icon: FileText },
    '/cookie-policy': { name: 'Cookie Policy', parent: null, icon: FileText },
    '/acceptable-use-policy': { name: 'Acceptable Use Policy', parent: null, icon: FileText },
    '/privacy-exposure-disclaimer': { name: t('common.breadcrumbs.exposureIndexMethodology') || 'Index Methodology & Disclaimers', parent: null, icon: FileText },
    
    // Checkout pages (2-3 levels: Home > Checkout > Page)
    '/checkout/success': { name: 'Checkout Success', parent: null, icon: CreditCard },
  }), [t, translations, translationsLoading]);

  // Generate breadcrumbs: show "Privacy Toolkit" only when on toolkit root or a page under toolkit
  const getBreadcrumbs = () => {
    const pathnames = location.pathname.split('/').filter(x => x);
    const breadcrumbs = [];
    const currentPath = pathnames.length > 0 ? '/' + pathnames.join('/') : '/';
    const isToolkitRoot = currentPath === '/toolkit-access' || currentPath === '/toolkit' || pathnames.length === 0;
    const routeInfo = routeHierarchy[currentPath];
    const isUnderToolkit = routeInfo?.parent?.href === '/toolkit-access';

    if (isToolkitRoot) {
      breadcrumbs.push({
        name: t('common.navigation.privacyToolkit'),
        href: '/toolkit-access',
        current: true,
        icon: Wrench
      });
      return breadcrumbs;
    }

    if (isUnderToolkit) {
      breadcrumbs.push({
        name: t('common.navigation.privacyToolkit'),
        href: '/toolkit-access',
        current: false,
        icon: Wrench
      });
    }

    const matchingStep = workflowSteps.find(step =>
      currentPath === step.path || currentPath.startsWith(step.path + '/')
    );

    if (matchingStep) {
      breadcrumbs.push({
        name: matchingStep.title,
        href: matchingStep.path,
        current: true,
        icon: matchingStep.icon
      });
    } else if (routeInfo) {
      if (routeInfo.parent && routeInfo.parent.href !== '/toolkit-access') {
        breadcrumbs.push({
          name: routeInfo.parent.name,
          href: routeInfo.parent.href,
          current: false,
          icon: routeInfo.parent.icon || null
        });
      }
      breadcrumbs.push({
        name: routeInfo.name,
        href: currentPath,
        current: true,
        icon: routeInfo.icon || null
      });
    } else {
      const lastSegment = pathnames[pathnames.length - 1];
      const label = lastSegment
        .split('-')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ');
      breadcrumbs.push({
        name: label,
        href: currentPath,
        current: true
      });
    }

    return breadcrumbs;
  };

  const breadcrumbs = getBreadcrumbs();
  const CurrentStepIcon = currentStep?.icon || Users;

  // Calculate the step number for display (only count required steps for the first 4)
  // If on an optional step (dashboard/resources), show as completed workflow
  const getStepDisplayNumber = useCallback(() => {
    if (!currentStep) return { current: 1, total: requiredStepsCount };
    
    // If current step is required, show its position among required steps
    if (currentStep.isRequired) {
      // Count how many required steps come before this one (including this one)
      const requiredStepNumber = workflowSteps
        .slice(0, currentStepIndex + 1)
        .filter(step => step.isRequired).length;
      return { current: requiredStepNumber, total: requiredStepsCount };
    } else {
      // If on optional step (dashboard/resources), show as completed
      return { current: requiredStepsCount, total: requiredStepsCount };
    }
  }, [currentStep, currentStepIndex, workflowSteps, requiredStepsCount]);

  // Handle current step button click
  const handleCurrentStepClick = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      if (currentStep?.path) {
        // Only navigate if we're not already on this path
        if (location.pathname !== currentStep.path) {
          navigate(currentStep.path);
        } else {
          // If already on the path, scroll to top
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      }
    } catch (error) {
      if (import.meta.env.DEV) {
        console.warn('[SecondaryNavigationBar] Error navigating to current step:', error);
      }
      // Fallback: try direct navigation
      if (currentStep?.path) {
        window.location.href = currentStep.path;
      }
    }
  }, [currentStep, navigate, location.pathname]);

  // Don't show on home page
  if (location.pathname === '/') {
    return null;
  }

  return (
    <div className="block">
    <nav className="fixed left-0 right-0 z-40" style={{ 
      top: `${headerHeight}px`, 
      // Same blue/slate as header with slight step down for soft differentiation (no hard contrast)
      backgroundColor: theme === 'dark' ? 'rgba(30, 41, 59, 0.9)' : 'rgba(248, 250, 252, 0.95)',
      backdropFilter: 'blur(48px)',
      WebkitBackdropFilter: 'blur(48px)',
      borderTop: theme === 'dark' ? '1px solid rgba(51, 65, 85, 0.4)' : '1px solid rgba(226, 232, 240, 0.6)',
      borderBottom: 'none',
      marginTop: '0',
      marginBottom: '0',
      boxShadow: 'none'
    }}>
      <div className="max-w-7xl mx-auto px-2 sm:px-4 py-0">
        <div className="flex items-center justify-between gap-2 sm:gap-4 min-w-0 h-7">
          {/* Left: Breadcrumbs */}
          <div className="flex items-center gap-1 sm:gap-2 flex-1 min-w-0 overflow-hidden">
            {/* Breadcrumbs */}
            <div className="flex items-center space-x-0.5 sm:space-x-1 text-xs sm:text-sm min-w-0 overflow-hidden" aria-label="Breadcrumb navigation">
              {breadcrumbs.map((breadcrumb, index) => (
                <div key={index} className="flex items-center">
                  {index > 0 && (
                    <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400 mx-0.5 sm:mx-1 flex-shrink-0" aria-hidden="true" />
                  )}
                  <button
                    onClick={() => navigate(breadcrumb.href)}
                    className={`flex items-center gap-1 transition-colors truncate py-0 min-h-0 ${
                      breadcrumb.current
                        ? 'text-gray-900 dark:text-white font-semibold cursor-pointer hover:text-red-600 dark:hover:text-red-400'
                        : 'text-gray-500 dark:text-gray-400 font-medium hover:text-red-600 dark:hover:text-red-400'
                    }`}
                    aria-current={breadcrumb.current ? 'page' : undefined}
                    title={breadcrumb.current ? `Current page: ${breadcrumb.name}. Click to refresh.` : `Navigate to ${breadcrumb.name}`}
                  >
                    {breadcrumb.icon && (
                      <breadcrumb.icon className="w-4 h-4 flex-shrink-0" />
                    )}
                    <span className="truncate">{breadcrumb.name}</span>
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Progress and Current Step Indicators - compact size to match header buttons */}
          <div className="flex items-center gap-1 flex-shrink-0">
            {/* Progress Indicator - Clickable */}
            <button
              onClick={() => {
                try {
                  const workflowStatus = checkWorkflowCompletion();
                  if (!workflowStatus.step2_services) {
                    navigate('/service-catalog');
                  } else if (!workflowStatus.step3_concerns) {
                    navigate('/settings');
                  } else if (!workflowStatus.step4_assessment) {
                    navigate('/assessment');
                  } else {
                    navigate('/dashboard');
                  }
                } catch (error) {
                  if (import.meta.env.DEV) {
                    console.warn('[SecondaryNavigationBar] Error navigating to next step:', error);
                  }
                  navigate('/service-catalog');
                }
              }}
              className="flex items-center justify-center gap-1 p-1 min-w-[28px] min-h-[28px] h-7 max-h-7 bg-orange-50 dark:bg-orange-900/20 rounded-md border border-orange-200 dark:border-orange-800 hover:bg-orange-100 dark:hover:bg-orange-900/30 transition-colors cursor-pointer group touch-manipulation"
              title={t('common.workflow.whyCompleteShort') ? `${t('common.workflow.whyCompleteShort')} Click to continue.` : 'Click to navigate to next incomplete step'}
              aria-label={`Workflow progress: ${progress}%. ${t('common.workflow.whyCompleteShort') || ''} Click to continue workflow.`}
            >
              <div className="flex items-center gap-1 min-w-0">
                <div className="w-5 sm:w-6 h-0.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden flex-shrink-0">
                  <div
                    className="h-full bg-gradient-to-r from-orange-400 to-orange-600 rounded-full transition-all duration-500 group-hover:from-orange-500 group-hover:to-orange-700"
                    style={{ width: `${Math.max(0, Math.min(100, progress))}%` }}
                  />
                </div>
                <span className="text-[9px] font-bold text-orange-600 dark:text-orange-400 tabular-nums flex-shrink-0">
                  {progress}%
                </span>
              </div>
            </button>

            {/* Current Step Indicator - Clickable */}
            {currentStep && currentStep.path ? (() => {
              const stepDisplay = getStepDisplayNumber();
              return (
                <button
                  type="button"
                  onClick={handleCurrentStepClick}
                  onMouseDown={(e) => {
                    if (e.button === 0) e.preventDefault();
                  }}
                  className="flex items-center justify-center p-1 min-w-[28px] min-h-[28px] h-7 max-h-7 bg-blue-50 dark:bg-blue-900/20 rounded-md border border-blue-200 dark:border-blue-800 hover:bg-blue-100 dark:hover:bg-blue-900/30 active:bg-blue-200 dark:active:bg-blue-900/40 transition-all cursor-pointer group touch-manipulation focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  title={`Current step: ${currentStep.title}. Step ${stepDisplay.current} of ${stepDisplay.total}${currentStep.isRequired === false ? ' (optional)' : ''}. Click to navigate.`}
                  aria-label={`Current step: ${currentStep.title}. Step ${stepDisplay.current} of ${stepDisplay.total}${currentStep.isRequired === false ? ' (optional)' : ''}. Click to navigate.`}
                >
                  <div className="w-3 h-3 bg-blue-600 dark:bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 group-hover:bg-blue-700 dark:group-hover:bg-blue-600 transition-colors">
                    <CurrentStepIcon className="w-1.5 h-1.5 text-white" />
                  </div>
                </button>
              );
            })() : null}
          </div>
        </div>
      </div>
    </nav>
    </div>
  );
};

export default SecondaryNavigationBar;

