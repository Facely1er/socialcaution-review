import React from 'react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Shield, Target, Scale, AlertTriangle, BookOpen, ClipboardList, Eye, Library, CheckCircle, Activity, Info, Search } from 'lucide-react';
import { analytics } from '../utils/analytics.js';
import {
  APP_STORE_IOS,
  APP_STORE_ANDROID,
  APP_STORE_BADGE_IMAGE,
  GOOGLE_PLAY_BADGE_IMAGE,
  BADGE_WIDTH,
  BADGE_HEIGHT,
} from '../config/appStores';

import SEOHead from './common/SEOHead';
import StructuredData from './seo/StructuredData';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { useTranslation } from '../contexts/TranslationContext';
import Hero from './home/Hero';
import AlertsCarousel from './home/AlertsCarousel';
import WhatYouCanDoSection from './home/WhatYouCanDoSection';
import TrustIndicators from './home/TrustIndicators';
import { motion } from 'framer-motion';
import { useCautionStore } from '../state/cautionStore';
import { toHomepageAlerts } from '../features/alerts/alertsAdapter';

// Progress checking utility
const checkUserProgress = () => {
  try {
    const persona = localStorage.getItem('socialcaution_persona');
    const results = localStorage.getItem('socialcaution_results');
    
    // Safely parse persona - handle both JSON objects and plain strings
    let personaData = null;
    if (persona) {
      try {
        personaData = JSON.parse(persona);
        // If parsing results in a string (old format), convert to object format
        if (typeof personaData === 'string') {
          personaData = { primary: personaData };
        }
      } catch (e) {
        // If it's not valid JSON, treat it as a plain string persona ID
        personaData = { primary: persona };
      }
    }
    
    // Safely parse assessment results
    let assessmentData = null;
    if (results) {
      try {
        assessmentData = JSON.parse(results);
      } catch (e) {
        // If it's not valid JSON, ignore it
        assessmentData = null;
      }
    }
    
    return {
      hasPersona: !!persona,
      hasAssessment: !!results,
      personaData,
      assessmentData,
      completedAssessments: {
        exposure: !!(assessmentData?.exposureResults),
        rights: !!(assessmentData?.rightsResults),
        full: !!(assessmentData?.exposureResults && assessmentData?.rightsResults)
      }
    };
  } catch (error) {
    if (import.meta.env.DEV) {
      console.warn('Error checking user progress:', error);
    }
    return {
      hasPersona: false,
      hasAssessment: false,
      personaData: null,
      assessmentData: null,
      completedAssessments: {
        exposure: false,
        rights: false,
        full: false
      }
    };
  }
};

const HomePage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [userProgress, setUserProgress] = useState(checkUserProgress());
  const [persona] = useLocalStorage('socialcaution_persona', null);
  
  // Get Radar alerts from store
  const storeAlerts = useCautionStore((state) => state.alerts) || [];
  
  // Debug logging in dev mode
  useEffect(() => {
    if (import.meta.env.DEV) {
      console.log('[HomePage] Store alerts count:', storeAlerts.length);
      if (storeAlerts.length > 0) {
        console.log('[HomePage] Sample alert:', {
          id: storeAlerts[0].id,
          title: storeAlerts[0].title,
          source: storeAlerts[0].source,
          category: storeAlerts[0].category,
          createdAt: storeAlerts[0].createdAt
        });
      }
    }
  }, [storeAlerts.length]);
  
  // Convert Radar alerts to carousel items (with 24-hour filter and 7-day fallback)
  const { alerts: carouselItems, lastUpdate } = toHomepageAlerts(storeAlerts);
  
  // Debug carousel items
  useEffect(() => {
    if (import.meta.env.DEV) {
      console.log('[HomePage] Carousel items:', carouselItems.length);
      if (carouselItems.length > 0) {
        console.log('[HomePage] Sample carousel item:', carouselItems[0]);
      }
    }
  }, [carouselItems.length]);
  
  // Trigger RSS service if no alerts (similar to PrivacyRadar)
  useEffect(() => {
    if (storeAlerts.length === 0) {
      // Import dynamically to avoid circular dependencies
      import('../services/rssAlertService').then(({ rssAlertService }) => {
        // Also import resilient fetcher to reset it if needed (for dev mode)
        import('../utils/resilientRSSFetcher').then(({ resilientRSSFetcher }) => {
          // Reset resilient fetcher to allow retry
          if (import.meta.env.DEV) {
            resilientRSSFetcher.reset();
          }
          
          rssAlertService.processNow().then(() => {
            // Wait a bit for async processing to complete
            setTimeout(() => {
              const updatedStore = useCautionStore.getState();
              if (updatedStore.alerts.length === 0 && import.meta.env.DEV) {
                console.log('[HomePage] Store still empty after fetch. Check console for RSS service logs.');
              } else if (import.meta.env.DEV) {
                console.log(`[HomePage] ✅ Loaded ${updatedStore.alerts.length} alerts into store`);
              }
            }, 2000); // Give it 2 seconds for async processing
          }).catch(error => {
            if (import.meta.env.DEV) {
              console.warn('[HomePage] Error fetching alerts:', error);
            }
          });
        });
      });
    }
  }, [storeAlerts.length]);

  // Verify store functionality in dev mode
  useEffect(() => {
    if (import.meta.env.DEV) {
      import('../utils/storeVerification').then(({ logStoreStatus, verifyStoreFunctionality }) => {
        // Log status on mount
        logStoreStatus();
        
        // Verify functionality
        const verification = verifyStoreFunctionality();
        if (!verification.isFunctional && import.meta.env.DEV) {
          console.warn('[HomePage] Store verification failed:', verification.issues);
        }
      });
    }
  }, []);
  
  // Update progress when component mounts or localStorage changes
  useEffect(() => {
    setUserProgress(checkUserProgress());
  }, [persona]);

  const handleAssessmentStart = (assessmentType) => {
    try {
      if (analytics && typeof analytics.trackEvent === 'function') {
        analytics.trackEvent('assessment_start', {
          type: assessmentType,
          placement: 'homepage'
        });
      }
    } catch (error) {
      // Silently fail analytics - don't block navigation
      if (import.meta.env.DEV) {
        console.warn('Analytics tracking failed:', error);
      }
    }
    navigate(`/assessment/${assessmentType}`);
  };

  const assessmentOptions = [
    {
      type: 'exposure',
      icon: Shield,
      title: t('homePage.assessments.exposure.title'),
      description: t('homePage.assessments.exposure.description'),
      duration: t('homePage.assessments.exposure.duration'),
      color: 'from-red-500 to-red-600',
      focus: t('homePage.assessments.exposure.focus')
    },
    {
      type: 'rights',
      icon: Scale,
      title: t('homePage.assessments.rights.title'),
      description: t('homePage.assessments.rights.description'),
      duration: t('homePage.assessments.rights.duration'),
      color: 'from-blue-500 to-blue-600',
      focus: t('homePage.assessments.rights.focus')
    },
    {
      type: 'full',
      icon: Target,
      title: t('homePage.assessments.full.title'),
      description: t('homePage.assessments.full.description'),
      duration: t('homePage.assessments.full.duration'),
      color: 'from-purple-500 to-purple-600',
      focus: t('homePage.assessments.full.focus')
    }
  ];


  // DO NOT REVERT: Hero gradient on root so no strip above hero; do not change back to bg-gray-50.
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <SEOHead
        title="SocialCaution – Privacy Exposure Insights for Digital Services"
        description="Browse 200+ services and see exactly how they collect, share, and protect your data. Get privacy ratings, security track records, and policy updates. No signup required."
        keywords="privacy risks, service privacy, data collection, security ratings, privacy monitoring, service catalog, free privacy tool"
        canonicalUrl={typeof window !== 'undefined' ? window.location.origin : ''}
      />
      <StructuredData />

      {/* Hero Section - Digital Footprint Analyzer Focused */}
      <Hero />

      {/* What You Can Do - first section below Hero */}
      <WhatYouCanDoSection />

      {/* Privacy & Security Alerts Carousel (Privacy Radar) - after What You Can Do */}
      <AlertsCarousel
        items={carouselItems}
        lastUpdate={lastUpdate}
        introLine={t('homePage.alerts.intro')}
      />

      {/* Why Data Visibility Matters (education) */}
      <section className="py-8 sm:py-10 md:py-12 bg-gray-50 dark:bg-slate-900">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white dark:bg-slate-800 rounded-xl p-5 sm:p-6 shadow-sm border border-gray-200 dark:border-slate-700">
            <div className="text-center mb-6 sm:mb-8">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
                Why Data Visibility Matters
              </h2>
              <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                Modern automation and AI tools increase the visibility of your personal data across services. Understanding this exposure helps you make informed decisions about your privacy.
              </p>
            </div>

            {/* Three Column Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 mb-3">
                  <Eye className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-2">
                  Increased Visibility
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                  Automated systems and AI tools process and share data more extensively than manual processes, creating broader exposure across platforms.
                </p>
              </div>

              <div className="text-center">
                <div className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-900/30 mb-3">
                  <Search className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-2">
                  Understand Your Exposure
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                  See how your data flows through the services you use and identify where your information becomes more visible through automated processing.
                </p>
              </div>

              <div className="text-center">
                <div className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-green-100 dark:bg-green-900/30 mb-3">
                  <Info className="w-5 h-5 text-green-600 dark:text-green-400" />
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-2">
                  Informed Steps
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                  Use visibility insights to understand your digital footprint and take informed steps toward managing your privacy preferences.
                </p>
              </div>
            </div>

            {/* Micro-Disclaimer */}
            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-slate-700">
              <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                SocialCaution™ does not monitor criminal activity or detect threats. We help you understand your data visibility and exposure across online services.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Indicators */}
      <TrustIndicators />

      {/* Quick Access Features section removed - content moved to /toolkit-access page */}

      {/* CTA Section */}
      <motion.section
        className="py-8 sm:py-10 md:py-12 bg-gradient-to-r from-accent via-accent-dark to-accent text-white relative overflow-hidden"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        {/* Decorative Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 left-0 w-64 h-64 bg-white/15 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 right-0 w-64 h-64 bg-white/15 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>
          <div className="absolute top-1/2 left-1/2 w-48 h-48 bg-white/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center relative z-10">
          <motion.h2
            className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 sm:mb-4 px-2"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            {t('howItWorks.cta.title') || "Get the Full Privacy Experience"}
          </motion.h2>
          <motion.p
            className="text-base sm:text-lg md:text-xl mb-6 sm:mb-8 opacity-90 px-2"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            {t('howItWorks.cta.subtitle') || "Download our mobile app for push notifications, offline access, and all premium privacy protection features."}
          </motion.p>
          
          {/* Same layout as Hero: primary CTA first, then official store badges (no extra container) */}
          <motion.div
            className="flex flex-col items-center justify-center gap-6 sm:gap-5 mb-0 px-2 sm:px-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
          >
            <motion.button
              type="button"
              onClick={() => {
                try {
                  if (analytics && typeof analytics.trackEvent === 'function') {
                    analytics.trackEvent('cta_click', { action: 'browse_catalog', placement: 'homepage_bottom_cta' });
                  }
                } catch (error) {
                  if (import.meta.env.DEV) {
                    console.warn('Analytics tracking failed:', error);
                  }
                }
                navigate('/service-catalog');
              }}
              className="w-full sm:w-auto px-8 md:px-10 py-4 bg-white hover:bg-white/90 text-accent font-semibold text-base md:text-lg rounded-xl border-2 border-white shadow-lg hover:shadow-xl transition-all duration-300 min-h-[48px] touch-manipulation"
              aria-label="Select Services"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {t('howItWorks.cta.selectServices') || "Select Services →"}
            </motion.button>
            <div className="flex flex-nowrap items-center justify-center gap-3 sm:gap-4 mt-3 sm:mt-4">
              <motion.a
                href={APP_STORE_IOS}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => {
                  try {
                    if (analytics && typeof analytics.trackEvent === 'function') {
                      analytics.trackEvent('cta_click', { action: 'download_app_store', placement: 'homepage_bottom_cta' });
                    }
                  } catch (e) { /* noop */ }
                }}
                className="inline-flex items-center justify-center flex-shrink-0 hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-transparent"
                style={{ width: BADGE_WIDTH, height: BADGE_HEIGHT }}
                aria-label="Download SocialCaution on the App Store"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <img
                  src={APP_STORE_BADGE_IMAGE}
                  alt="Download on the App Store"
                  role="presentation"
                  className="block max-w-full max-h-full object-contain object-center"
                  style={{ width: BADGE_WIDTH, height: BADGE_HEIGHT, objectFit: 'contain' }}
                  width={BADGE_WIDTH}
                  height={BADGE_HEIGHT}
                  loading="lazy"
                />
              </motion.a>
              <motion.a
                href={APP_STORE_ANDROID}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => {
                  try {
                    if (analytics && typeof analytics.trackEvent === 'function') {
                      analytics.trackEvent('cta_click', { action: 'download_google_play', placement: 'homepage_bottom_cta' });
                    }
                  } catch (e) { /* noop */ }
                }}
                className="inline-flex items-center justify-center flex-shrink-0 hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-transparent"
                style={{ width: BADGE_WIDTH, height: BADGE_HEIGHT }}
                aria-label="Get SocialCaution on Google Play"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <img
                  src={GOOGLE_PLAY_BADGE_IMAGE}
                  alt="Get it on Google Play"
                  role="presentation"
                  className="block max-w-full max-h-full object-contain object-center"
                  style={{ width: BADGE_WIDTH, height: BADGE_HEIGHT, objectFit: 'contain' }}
                  width={BADGE_WIDTH}
                  height={BADGE_HEIGHT}
                  loading="lazy"
                />
              </motion.a>
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* Feature Modal - handled in FeaturesSection */}
    </div>
  );
};

export default HomePage;