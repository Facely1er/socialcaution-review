import { useEffect, lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';

/** DO NOT REVERT: Home layout uses this gradient so there is no visible strip between header and hero. */
const HERO_GRADIENT = 'bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900';

/** DO NOT REVERT: Root uses hero gradient on home so no gray strip above hero. */
const AppLayout = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const path = (location.pathname || '').replace(/\/$/, '') || '/';
  const isHome = path === '/' || path === '';
  const rootBg = isHome ? `min-h-screen ${HERO_GRADIENT}` : 'min-h-screen bg-gray-50 dark:bg-slate-900';
  return <div className={rootBg}>{children}</div>;
};

/** DO NOT REVERT: Home uses pt-14/pt-16 (clear header) + HERO_GRADIENT so no strip. Other pages: normal padding. */
const MainWithPadding = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const path = (location.pathname || '').replace(/\/$/, '') || '/';
  const isHome = path === '/' || path === '';
  const reducedTopPadding = ['/exposure-index-methodology', '/privacy-exposure-disclaimer'].includes(location.pathname);
  const mainPadding = isHome ? 'pt-14 md:pt-16 pb-0' : reducedTopPadding ? 'pt-8 md:pt-12 pb-0' : 'pt-20 md:pt-24 pb-0';
  const mainBg = isHome ? HERO_GRADIENT : '';
  return (
    <main id="main-content" className={`${mainPadding} ${mainBg}`.trim()}>
      {children}
    </main>
  );
};
import { ThemeProvider } from './contexts/ThemeContext.jsx';
import { TranslationProvider } from './contexts/TranslationContext.jsx';
import { analytics } from './utils/analytics.js';
import { rssAlertService } from './services/rssAlertService';
import { calculateExposureScore, calculateRightsScore, type ExposureResults, type RightsResults } from './utils/assessmentScoring';
import Header from './components/layout/Header';
import SecondaryNavigationBar from './components/layout/SecondaryNavigationBar';
import ProductionOptimizer from './components/common/ProductionOptimizer';
import { NotificationProvider } from './components/common/NotificationSystem';
import HomePage from './components/HomePage';
import ProductionErrorBoundary from './components/common/ProductionErrorBoundary';
import ServiceCatalog from './components/ServiceCatalog.jsx';
import Footer from './components/layout/Footer';
import { useLocalStorage } from './hooks/useLocalStorage';
import MetaTagManager from './components/common/MetaTagManager';
import SkipLink from './components/common/SkipLink';
import LoadingSpinner from './components/common/LoadingSpinner';
import NotFoundPage from './components/pages/NotFoundPage';
import OfflineIndicator from './components/common/OfflineIndicator';
import PWAInstallPrompt from './components/common/PWAInstallPrompt';
import PWAUpdateNotification from './components/common/PWAUpdateNotification';
import FeedbackButton from './components/common/FeedbackButton';
import { initializeUserProfile, isNewUser } from './utils/userInitialization';
import { useCautionStore } from './state/cautionStore';
import { CookieConsentProvider } from './contexts/CookieConsentContext';
import CookieConsentBanner from './components/legal/CookieConsentBanner';

// Extend Window interface to include Sentry
interface WindowWithSentry extends Window {
  Sentry?: {
    captureException: (error: unknown, options?: { tags?: Record<string, string> }) => void;
  };
}

// Helper function for production-safe error logging
const logError = (component: string, error: unknown) => {
  if (import.meta.env.DEV) {
    console.error(`Failed to load ${component}:`, error);
  }
  // In production, errors are handled by error boundaries and monitoring
  if (import.meta.env.PROD && typeof window !== 'undefined') {
    const windowWithSentry = window as WindowWithSentry;
    if (windowWithSentry.Sentry) {
      windowWithSentry.Sentry.captureException(error, { tags: { component } });
    }
  }
};

// Lazy load heavy components for better code splitting
const AssessmentRouter = lazy(() => import('./components/AssessmentRouter').catch((error) => {
  logError('AssessmentRouter', error);
  return { default: NotFoundPage };
}));
const PersonalizedDashboard = lazy(() => import('./components/PersonalizedDashboard').catch((error) => {
  logError('PersonalizedDashboard', error);
  return { default: NotFoundPage };
}));
const Dashboard = lazy(() => import('./components/pages/Dashboard').catch((error) => {
  logError('Dashboard', error);
  return { default: NotFoundPage };
}));
const AdaptiveResources = lazy(() => import('./components/AdaptiveResources').catch((error) => {
  logError('AdaptiveResources', error);
  return { default: NotFoundPage };
}));
const PersonalizedToolkit = lazy(() => import('./components/PersonalizedToolkit.jsx').catch((error) => {
  logError('PersonalizedToolkit', error);
  return { default: NotFoundPage };
}));
const PrivacyCalendarPage = lazy(() => import('./tools/privacy-calendar/PrivacyCalendarPage').catch((error) => {
  logError('PrivacyCalendarPage', error);
  return { default: NotFoundPage };
}));
const StandaloneCalendarApp = lazy(() => import('./tools/privacy-calendar-standalone/StandaloneCalendarApp').catch((error) => {
  logError('StandaloneCalendarApp', error);
  return { default: NotFoundPage };
}));
const CautionAlertFeed = lazy(() => 
  import('./components/alerts/CautionAlertFeed').catch((error) => {
    logError('CautionAlertFeed', error);
    return { default: NotFoundPage };
  })
);
const AICheckMessagePanel = lazy(() => 
  import('./components/ai/AICheckMessagePanel').catch((error) => {
    logError('AICheckMessagePanel', error);
    return { default: NotFoundPage };
  })
);
const ImageMetadataAnalyzer = lazy(() => 
  import('./components/ai/ImageMetadataAnalyzer').catch((error) => {
    logError('ImageMetadataAnalyzer', error);
    return { default: NotFoundPage };
  })
);
const EmailHeaderAnalyzer = lazy(() => 
  import('./components/ai/EmailHeaderAnalyzer').catch((error) => {
    logError('EmailHeaderAnalyzer', error);
    return { default: NotFoundPage };
  })
);
const SocialProfileVerifier = lazy(() => 
  import('./components/ai/SocialProfileVerifier').catch((error) => {
    logError('SocialProfileVerifier', error);
    return { default: NotFoundPage };
  })
);
const HowItWorksPage = lazy(() => import('./components/pages/HowItWorksPage').catch((error) => {
  logError('HowItWorksPage', error);
  return { default: NotFoundPage };
}));
const PrivacySettings = lazy(() => 
  import('./components/pages/PrivacySettings.jsx')
    .then(module => {
      // Ensure default export exists
      if (!module.default) {
        throw new Error('PrivacySettings component does not have a default export');
      }
      return module;
    })
    .catch((error) => {
      logError('PrivacySettings', error);
      return { default: NotFoundPage };
    })
);
const PrivacyFocusPage = lazy(() => import('./components/pages/PrivacyFocusPage.jsx'));
const PrivacyRegulationsMonitoring = lazy(() => 
  import('./components/pages/PrivacyRegulationsMonitoring.jsx')
    .then(module => {
      // Ensure default export exists
      if (!module.default) {
        throw new Error('PrivacyRegulationsMonitoring component does not have a default export');
      }
      return module;
    })
    .catch((error) => {
      logError('PrivacyRegulationsMonitoring', error);
      return { default: NotFoundPage };
    })
);
const PrivacyRadar = lazy(() =>
  import('./components/PrivacyRadar.jsx')
    .then(module => {
      if (!module.default) {
        throw new Error('PrivacyRadar component does not have a default export');
      }
      return module;
    })
    .catch((error) => {
      logError('PrivacyRadar', error);
      return { default: NotFoundPage };
    })
);
const Assessments = lazy(() => import('./components/pages/Assessments').catch((error) => {
  logError('Assessments', error);
  return { default: NotFoundPage };
}));
const PrivacyPolicy = lazy(() => import('./components/legal/PrivacyPolicy').catch((error) => {
  logError('PrivacyPolicy', error);
  if (import.meta.env.DEV) {
    console.error('Failed to load PrivacyPolicy component:', error);
  }
  return { default: NotFoundPage };
}));
const TermsOfService = lazy(() => import('./components/legal/TermsOfService').catch((error) => {
  logError('TermsOfService', error);
  if (import.meta.env.DEV) {
    console.error('Failed to load TermsOfService component:', error);
  }
  return { default: NotFoundPage };
}));
const CookiePolicy = lazy(() => import('./components/legal/CookiePolicy').catch((error) => {
  logError('CookiePolicy', error);
  if (import.meta.env.DEV) {
    console.error('Failed to load CookiePolicy component:', error);
  }
  return { default: NotFoundPage };
}));
const AcceptableUsePolicy = lazy(() => import('./components/legal/AcceptableUsePolicy').catch((error) => {
  logError('AcceptableUsePolicy', error);
  if (import.meta.env.DEV) {
    console.error('Failed to load AcceptableUsePolicy component:', error);
  }
  return { default: NotFoundPage };
}));
const PrivacyExposureDisclaimer = lazy(() => import('./components/legal/PrivacyExposureDisclaimer').catch((error) => {
  logError('PrivacyExposureDisclaimer', error);
  return { default: NotFoundPage };
}));
const ContactUs = lazy(() => import('./components/business/ContactUs').catch((error) => {
  logError('ContactUs', error);
  return { default: NotFoundPage };
}));
const SupportPage = lazy(() => import('./components/pages/SupportPage').catch((error) => {
  logError('SupportPage', error);
  return { default: NotFoundPage };
}));
const PricingPage = lazy(() => import('./components/pages/PricingPage').catch((error) => {
  logError('PricingPage', error);
  return { default: NotFoundPage };
}));
const FAQPage = lazy(() => import('./components/pages/FAQPage').catch((error) => {
  logError('FAQPage', error);
  return { default: NotFoundPage };
}));
const TutorialPage = lazy(() => import('./components/pages/TutorialPage').catch((error) => {
  logError('TutorialPage', error);
  return { default: NotFoundPage };
}));
const PersonalDataInventory = lazy(() => import('./components/tools/PersonalDataInventory').catch((error) => {
  logError('PersonalDataInventory', error);
  return { default: NotFoundPage };
}));
const DataBrokerRemovalTool = lazy(() => import('./components/tools/DataBrokerRemovalTool').catch((error) => {
  logError('DataBrokerRemovalTool', error);
  return { default: NotFoundPage };
}));
const ExposureReport = lazy(() => import('./components/pages/ExposureReport').catch((error) => {
  logError('ExposureReport', error);
  return { default: NotFoundPage };
}));
const PrivacyAssistantBot = lazy(() => import('./components/privacy/PrivacyAssistantBot').catch((error) => {
  logError('PrivacyAssistantBot', error);
  return { default: NotFoundPage };
}));
const InteractiveActionPlanner = lazy(() => import('./components/privacy/InteractiveActionPlanner').catch((error) => {
  logError('InteractiveActionPlanner', error);
  return { default: NotFoundPage };
}));
const MyServices = lazy(() => import('./components/pages/MyServices').catch((error) => {
  logError('MyServices', error);
  return { default: NotFoundPage };
}));
const ExposureIndexDashboard = lazy(() => import('./components/ExposureIndexDashboard').catch((error) => {
  logError('ExposureIndexDashboard', error);
  return { default: NotFoundPage };
}));
const DigitalFootprintAnalysis = lazy(() => import('./components/pages/DigitalFootprintAnalysis').catch((error) => {
  logError('DigitalFootprintAnalysis', error);
  return { default: NotFoundPage };
}));

// Phase 1 & 2: Monetization pages
const ReportTemplatesPage = lazy(() => import('./components/premium/ReportTemplatesPage').catch((error) => {
  logError('ReportTemplatesPage', error);
  return { default: NotFoundPage };
}));
const ProfessionalAuditPage = lazy(() => import('./components/services/ProfessionalAuditPage').catch((error) => {
  logError('ProfessionalAuditPage', error);
  return { default: NotFoundPage };
}));
const EnterprisePricingPage = lazy(() => import('./components/enterprise/EnterprisePricingPage').catch((error) => {
  logError('EnterprisePricingPage', error);
  return { default: NotFoundPage };
}));
const CoursesPage = lazy(() => import('./components/courses/CoursesPage').catch((error) => {
  logError('CoursesPage', error);
  return { default: NotFoundPage };
}));
const CheckoutSuccessHandler = lazy(() => import('./components/subscription/CheckoutSuccessHandler').catch((error) => {
  logError('CheckoutSuccessHandler', error);
  return { default: NotFoundPage };
}));

// Type definitions for stored data
interface AssessmentResults {
  exposureResults: Record<string, unknown>;
  rightsResults: Record<string, unknown>;
  exposureScore: number;
  rightsScore: number;
  completedAt: string;
}

interface UserProfile {
  persona: Record<string, unknown>;
  results: AssessmentResults;
  createdAt: string;
}

type Persona = Record<string, unknown> | null;

// Scroll to top on route change
function ScrollToTop() {
  const location = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [location.pathname]);
  return null;
}

function App() {
  const [userProfile, setUserProfile] = useLocalStorage<UserProfile | null>('socialcaution_profile', null);
  const [assessmentResults, setAssessmentResults] = useLocalStorage<AssessmentResults | null>('socialcaution_results', null);
  const [persona, setPersona] = useLocalStorage<Persona>('socialcaution_persona', null);

  useEffect(() => {
    // Initialize analytics on app load
    analytics.init();
    
    // Initialize RSS alert service for real-time security feeds
    if (import.meta.env.DEV) {
      console.log('[App] Initializing RSS alert service...');
    }
    
    // Check if store is empty - if so, check more frequently initially
    const store = useCautionStore.getState();
    const initialInterval = store.alerts.length === 0 ? 300000 : 3600000; // 5 min if empty, 1 hour if has data
    
    rssAlertService.initialize(initialInterval);
    
    // If store is empty, also trigger an immediate check after a short delay
    if (store.alerts.length === 0) {
      setTimeout(() => {
        rssAlertService.processNow();
      }, 2000); // Wait 2 seconds after app load
    }
    
    // Initialize user profile with default services for new users
    if (isNewUser()) {
      if (import.meta.env.DEV) {
        console.log('[App] New user detected - initializing profile with default services...');
      }
      const initResult = initializeUserProfile();
      if (initResult.success && import.meta.env.DEV) {
        console.log('[App] User profile initialized with services:', initResult.services);
      }
    }
    
    // Cleanup on unmount
    return () => {
      rssAlertService.stop();
    };
  }, []);
  const handleAssessmentComplete = (exposureResults: Record<string, unknown>, rightsResults: Record<string, unknown>, detectedPersona: Record<string, unknown>) => {
    const results: AssessmentResults = {
      exposureResults,
      rightsResults,
      exposureScore: calculateExposureScore(exposureResults as ExposureResults),
      rightsScore: calculateRightsScore(rightsResults as RightsResults),
      completedAt: new Date().toISOString()
    };
    
    setAssessmentResults(results);
    setPersona(detectedPersona);
    setUserProfile({
      persona: detectedPersona,
      results,
      createdAt: new Date().toISOString()
    });

    // Track assessment completion
    const assessmentType = exposureResults && rightsResults ? 'full' : 
                          exposureResults ? 'exposure' : 'rights';
    
    // Safely extract primary persona, defaulting to 'unknown' if not available
    const primaryPersona = typeof detectedPersona?.primary === 'string' 
      ? detectedPersona.primary 
      : 'unknown';
    
    analytics.trackAssessmentComplete(
      assessmentType,
      primaryPersona,
      results
    );
  };

  // Type assertions for JSX components (they don't have full TypeScript definitions)
  const TypedPersonalizedDashboard = PersonalizedDashboard as React.ComponentType<{
    userProfile?: UserProfile | null;
    assessmentResults?: AssessmentResults | null;
    persona?: Persona;
  }>;
  const TypedPrivacyAssistantBot = PrivacyAssistantBot as React.ComponentType<{
    userProfile?: UserProfile | null;
  }>;
  const TypedInteractiveActionPlanner = InteractiveActionPlanner as React.ComponentType<{
    userPersona?: Persona;
    assessmentResults?: AssessmentResults | null;
  }>;

  return (
    <ThemeProvider>
      <TranslationProvider>
        <CookieConsentProvider>
        <ProductionOptimizer>
          <NotificationProvider>
            <ProductionErrorBoundary>
              <Router>
                <ScrollToTop />
                <AppLayout>
          <MetaTagManager />
          <SkipLink href="#main-content">Skip to main content</SkipLink>
          <OfflineIndicator />
          <PWAUpdateNotification />
          <PWAInstallPrompt />
          <Header />
          <SecondaryNavigationBar />
          <MainWithPadding>
          <Suspense fallback={<LoadingSpinner />}>
            <Routes>
              {/* Public routes - available in all modes */}
              <Route path="/" element={<HomePage />} />
              <Route path="/how-it-works" element={<HowItWorksPage />} />
              <Route path="/download" element={<Navigate to="/" replace />} />
              <Route path="/persona-selection" element={<Navigate to="/settings" replace />} />
              {/* Redirects for legacy or index paths that have no dedicated page */}
              <Route path="/results" element={<Navigate to="/assessment" replace />} />
              <Route path="/premium" element={<Navigate to="/premium/templates" replace />} />
              <Route path="/services" element={<Navigate to="/service-catalog" replace />} />
              <Route path="/enterprise" element={<Navigate to="/enterprise/pricing" replace />} />
              <Route path="/checkout" element={<Navigate to="/pricing" replace />} />
              <Route path="/data-broker-removal" element={<Navigate to="/tools/data-broker-removal" replace />} />
              <Route path="/privacy-policy" element={<PrivacyPolicy />} />
              <Route path="/terms" element={<TermsOfService />} />
              <Route path="/cookie-policy" element={<CookiePolicy />} />
              <Route path="/acceptable-use-policy" element={<AcceptableUsePolicy />} />
              <Route path="/privacy-exposure-disclaimer" element={<PrivacyExposureDisclaimer />} />
              <Route path="/exposure-index-methodology" element={<Navigate to="/privacy-exposure-disclaimer" replace />} />
              <Route path="/contact" element={<ContactUs />} />
              <Route path="/support" element={<SupportPage />} />
              <Route path="/pricing" element={<PricingPage />} />
              <Route path="/faq" element={<FAQPage />} />
              <Route path="/tutorial" element={<TutorialPage />} />
              <Route path="/checkout/success" element={<CheckoutSuccessHandler />} />
              {/* Blog removed for now - redirect to home */}
              <Route path="/blog" element={<Navigate to="/" replace />} />
              <Route path="/blog/*" element={<Navigate to="/" replace />} />
              {/* Phase 1 & 2: Monetization Routes */}
              <Route path="/premium/templates" element={<ReportTemplatesPage />} />
              <Route path="/services/audit" element={<ProfessionalAuditPage />} />
              <Route path="/enterprise/pricing" element={<EnterprisePricingPage />} />
              <Route path="/courses" element={<CoursesPage />} />
              
              {/* Full app routes - Standard version includes all features */}
              <Route path="/account" element={<Navigate to="/settings" replace />} />
              <Route path="/privacy-settings" element={<Navigate to="/settings" replace />} />
              <Route path="/privacy-focus" element={<PrivacyFocusPage />} />
              <Route path="/settings" element={<PrivacySettings />} />
              {/* Toolkit - consolidated to single canonical route */}
              <Route path="/toolkit" element={<PersonalizedToolkit />} />
              <Route path="/toolkit-access" element={<Navigate to="/toolkit" replace />} />
              <Route path="/privacy-tools" element={<Navigate to="/toolkit" replace />} />
              {/* Tools routes - accessible directly */}
              <Route path="/tools/personal-data-inventory" element={<PersonalDataInventory />} />
              <Route path="/tools/data-broker-removal" element={<DataBrokerRemovalTool />} />
              {/* Exposure Report - consolidated to single canonical route */}
              <Route path="/tools/exposure-report" element={<ExposureReport />} />
              <Route path="/exposure-report" element={<Navigate to="/tools/exposure-report" replace />} />
              <Route path="/privacy-calendar" element={<PrivacyCalendarPage />} />
              <Route path="/privacy-calendar-standalone" element={<StandaloneCalendarApp />} />
              {/* Assessment routes - consolidated to avoid confusion */}
              <Route 
                path="/assessment" 
                element={<Assessments />} 
              />
              {/* Redirect /assessments to canonical /assessment */}
              <Route 
                path="/assessments" 
                element={<Navigate to="/assessment" replace />} 
              />
              <Route 
                path="/assessment/:type" 
                element={<AssessmentRouter onComplete={handleAssessmentComplete} />} 
              />
              {/* Privacy Regulations / Trends Tracker - consolidated to single canonical route */}
              <Route path="/trends-tracker" element={<PrivacyRegulationsMonitoring />} />
              <Route path="/privacy-regulations" element={<Navigate to="/trends-tracker" replace />} />
              <Route 
                path="/privacy-radar" 
                element={
                  <ProductionErrorBoundary>
                    <PrivacyRadar />
                  </ProductionErrorBoundary>
                } 
              />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route 
                path="/my-dashboard" 
                element={
                  <TypedPersonalizedDashboard 
                    userProfile={userProfile} 
                    assessmentResults={assessmentResults}
                    persona={persona}
                  />
                } 
              />
              <Route path="/adaptive-resources" element={<AdaptiveResources />} />
              <Route path="/service-catalog" element={<ServiceCatalog />} />
              <Route path="/my-services" element={<MyServices />} />
              <Route path="/exposure-dashboard" element={<ExposureIndexDashboard />} />
              <Route path="/digital-footprint-analysis" element={<DigitalFootprintAnalysis />} />
              <Route path="/alerts" element={<CautionAlertFeed />} />
              <Route path="/message-checker" element={<AICheckMessagePanel />} />
              <Route path="/tools/message-checker" element={<AICheckMessagePanel />} />
              <Route path="/tools/ai/image-analyzer" element={<ImageMetadataAnalyzer />} />
              <Route path="/tools/ai/email-analyzer" element={<EmailHeaderAnalyzer />} />
              <Route path="/tools/ai/profile-verifier" element={<SocialProfileVerifier />} />
              <Route 
                path="/privacy-assistant" 
                element={
                  <TypedPrivacyAssistantBot userProfile={userProfile} />
                } 
              />
              <Route 
                path="/action-planner" 
                element={
                  <TypedInteractiveActionPlanner
                    userPersona={persona} 
                    assessmentResults={assessmentResults}
                  />
                } 
              />
              
              {/* 404 and catch-all - must be last */}
              <Route path="/404" element={<NotFoundPage />} />
              <Route 
                path="*" 
                element={
                  <ProductionErrorBoundary>
                    <NotFoundPage />
                  </ProductionErrorBoundary>
                } 
              />
            </Routes>
          </Suspense>
          </MainWithPadding>
          <Footer />
          <FeedbackButton />
          <CookieConsentBanner />
                </AppLayout>
            </Router>
          </ProductionErrorBoundary>
        </NotificationProvider>
      </ProductionOptimizer>
        </CookieConsentProvider>
      </TranslationProvider>
    </ThemeProvider>
  );
}

export default App;