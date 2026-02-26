import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';
import { useTranslation } from '../../contexts/TranslationContext';
import {
  APP_STORE_IOS,
  APP_STORE_ANDROID,
  APP_STORE_BADGE_IMAGE,
  GOOGLE_PLAY_BADGE_IMAGE,
  BADGE_WIDTH,
  BADGE_HEIGHT,
} from '../../config/appStores';

const Hero = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [appStoreBadgeError, setAppStoreBadgeError] = useState(false);
  const [googlePlayBadgeError, setGooglePlayBadgeError] = useState(false);

  // DO NOT REVERT: No margin-top (mt-14/mt-16) on this section; main's pt-14/pt-16 clears the header. Margin here would create a visible strip.
  return (
    <section className="relative pt-10 md:pt-12 pb-5 sm:pb-8 md:pb-12 bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 overflow-hidden safe-area-inset-top">
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="hidden sm:block absolute top-0 left-0 w-72 h-72 bg-purple-200/30 dark:bg-purple-500/15 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
        <div className="hidden md:block absolute bottom-0 right-0 w-96 h-96 bg-accent/20 dark:bg-accent/10 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>
        <div className="hidden sm:block absolute top-1/2 left-1/2 w-64 h-64 bg-blue-200/30 dark:bg-blue-500/15 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <div className="max-w-4xl mx-auto">
          {/* Main Headline - Clear Value Proposition */}
          <motion.h1
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6 leading-tight px-2 sm:px-4"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            {t('homePage.hero.titlePart1')}{' '}
            <span className="text-red-600 dark:text-red-400">
              {t('homePage.hero.titlePart2')}
            </span>
          </motion.h1>

          {/* Subheadline - Specific Value */}
          <motion.p
            className="text-lg sm:text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-4 sm:mb-5 leading-relaxed px-2 sm:px-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {t('homePage.hero.subtitle')}
          </motion.p>

          {/* Context Line */}
          <motion.p
            className="text-base sm:text-lg text-gray-500 dark:text-gray-400 mb-6 sm:mb-8 leading-relaxed px-2 sm:px-4 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            {t('homePage.hero.contextLine')}
          </motion.p>

          {/* Trust Signals - Remove Friction (moved before CTAs) */}
          <motion.div
            className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 md:gap-6 text-sm sm:text-base text-gray-600 dark:text-gray-400 px-2 sm:px-4 mb-6 sm:mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 flex-shrink-0" />
              <span className="font-medium">{t('homePage.hero.noSignupRequired')}</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 flex-shrink-0" />
              <span className="font-medium">{t('homePage.hero.freeServices')}</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 flex-shrink-0" />
              <span className="font-medium">{t('homePage.hero.fullyPrivate')}</span>
            </div>
          </motion.div>
          
          {/* Primary CTA: How it Works, then store badges below */}
          <motion.div
            className="flex flex-col items-center justify-center gap-4 sm:gap-3 mb-6 sm:mb-8 px-2 sm:px-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            <motion.button
              type="button"
              onClick={() => navigate('/how-it-works')}
              className="w-full sm:w-auto px-8 md:px-10 py-4 bg-red-600 hover:bg-red-700 dark:bg-red-600 dark:hover:bg-red-700 text-white text-base md:text-lg font-semibold rounded-xl border-2 border-red-600 hover:border-red-700 dark:border-red-600 dark:hover:border-red-700 shadow-lg hover:shadow-xl transition-all duration-300 min-h-[48px] touch-manipulation"
              aria-label="How it Works"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <span className="flex items-center justify-center">
                {t('homePage.hero.explorePrivacyRisks')}
              </span>
            </motion.button>
            <div className="flex flex-nowrap items-center justify-center gap-3 sm:gap-4 mt-3 sm:mt-4">
              {/* Official badges only – no extra border or container */}
              <motion.a
                href={APP_STORE_IOS}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center flex-shrink-0 hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-transparent"
                style={{ width: BADGE_WIDTH, height: BADGE_HEIGHT }}
                aria-label="Download on the App Store"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {!appStoreBadgeError ? (
                  <img
                    src={APP_STORE_BADGE_IMAGE}
                    alt="Download on the App Store"
                    role="presentation"
                    className="block max-w-full max-h-full object-contain object-center"
                    style={{ width: BADGE_WIDTH, height: BADGE_HEIGHT, objectFit: 'contain' }}
                    width={BADGE_WIDTH}
                    height={BADGE_HEIGHT}
                    loading="lazy"
                    onError={() => setAppStoreBadgeError(true)}
                  />
                ) : (
                  <span className="text-[10px] font-semibold leading-tight px-2 text-center bg-black text-white rounded py-1.5">
                    Download on the<br />App Store
                  </span>
                )}
              </motion.a>
              <motion.a
                href={APP_STORE_ANDROID}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center flex-shrink-0 hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-transparent"
                style={{ width: BADGE_WIDTH, height: BADGE_HEIGHT }}
                aria-label="Get it on Google Play"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {!googlePlayBadgeError ? (
                  <img
                    src={GOOGLE_PLAY_BADGE_IMAGE}
                    alt="Get it on Google Play"
                    role="presentation"
                    className="block max-w-full max-h-full object-contain object-center"
                    style={{ width: BADGE_WIDTH, height: BADGE_HEIGHT, objectFit: 'contain' }}
                    width={BADGE_WIDTH}
                    height={BADGE_HEIGHT}
                    loading="lazy"
                    onError={() => setGooglePlayBadgeError(true)}
                  />
                ) : (
                  <span className="text-[10px] font-semibold leading-tight px-2 text-center uppercase bg-black text-white rounded py-1.5">
                    Get it on<br />Google Play
                  </span>
                )}
              </motion.a>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;

