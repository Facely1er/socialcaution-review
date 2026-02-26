import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Eye, Lightbulb, Shield, Lock, CheckCircle, AlertTriangle, ArrowRight, Info, Target, Globe, Database } from 'lucide-react';
import SEOHead from '../common/SEOHead';
import { useTranslation } from '../../contexts/TranslationContext';

const HowItWorksPage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const steps = [
    {
      number: 1,
      icon: Search,
      title: 'Select',
      subtitle: 'Explore Services',
      description: 'Browse our catalog of 200+ services and select the ones you use—Facebook, Gmail, TikTok, and more.',
      time: '1 minute',
      remark: 'No signup required',
      color: 'blue'
    },
    {
      number: 2,
      icon: Eye,
      title: 'Check',
      subtitle: 'See Privacy Risks',
      description: 'View detailed service reports with 6-factor privacy analysis, data collection practices, security track records, and privacy ratings. Calculate your digital footprint from selected services.',
      time: '2 minutes',
      remark: 'Instant insights',
      color: 'purple'
    },
    {
      number: 3,
      icon: Lightbulb,
      title: 'Understand',
      subtitle: 'Get Recommendations',
      description: 'See Privacy Concerns-based recommendations and learn how to protect yourself on each platform.',
      time: '5 minutes',
      remark: 'Actionable advice',
      color: 'orange'
    },
    {
      number: 4,
      icon: Shield,
      title: 'Protect',
      subtitle: 'Take Action',
      description: 'Want more? Take our assessment for a complete privacy strategy tailored to your needs.',
      time: 'Optional',
      remark: 'Optional upgrade',
      color: 'green'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
      <SEOHead
        title="How It Works - SocialCaution Privacy Platform"
        description="Learn how SocialCaution's concerns-based privacy platform works. Discover personalized privacy insights through Privacy-Preserving Personalization driven by your privacy concerns."
        keywords="how privacy assessment works, privacy concerns personalization, personalized privacy recommendations, privacy by design"
        canonicalUrl={`${window.location.origin}/how-it-works`}
      />

      {/* Header Section – on page background */}
      <section className="pt-8 sm:pt-10 pb-8 sm:pb-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="page-title mb-4 sm:mb-6 flex items-center justify-center gap-3 sm:gap-4">
              <div className="p-1.5 sm:p-2 md:p-2.5 bg-gradient-to-br from-red-500 to-red-600 rounded-lg shadow-md flex-shrink-0 flex items-center justify-center">
                <Info className="w-5 h-5 sm:w-5 sm:h-5 md:w-6 md:h-6 text-white" />
              </div>
              <span className="leading-tight">{t('howItWorks.title')}</span>
            </h1>
            <p className="text-xl sm:text-2xl text-red-600 dark:text-red-400 font-semibold mb-2">
              Simple. Fast. Effective.
            </p>
            <p className="text-lg text-gray-700 dark:text-gray-200 font-medium mb-2">
              {t('howItWorks.startNoAccount')}
            </p>
            <p className="text-base text-gray-600 dark:text-gray-400">
              Get privacy insights in minutes, no commitment required
            </p>
          </div>
        </div>
      </section>

      {/* 4-Step Cards Section */}
      <section className="py-12 bg-white dark:bg-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((step, index) => {
              const StepIcon = step.icon;
              const colorClasses = {
                blue: {
                  iconBg: 'bg-blue-500',
                  badge: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300',
                  timeBadge: 'bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400 border border-red-200 dark:border-red-800'
                },
                purple: {
                  iconBg: 'bg-purple-500',
                  badge: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300',
                  timeBadge: 'bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400 border border-red-200 dark:border-red-800'
                },
                orange: {
                  iconBg: 'bg-orange-500',
                  badge: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300',
                  timeBadge: 'bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400 border border-red-200 dark:border-red-800'
                },
                green: {
                  iconBg: 'bg-green-500',
                  badge: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300',
                  timeBadge: 'bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400 border border-red-200 dark:border-red-800'
                }
              };
              const colors = colorClasses[step.color];

              return (
                <div
                  key={index}
                  className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-slate-700 hover:shadow-xl transition-all duration-300 flex flex-col relative"
                >
                  {/* Number Badge - Top Right */}
                  <div className="absolute -top-3 -right-3">
                    <div className={`w-10 h-10 ${colors.badge} rounded-full flex items-center justify-center font-bold text-lg shadow-lg`}>
                      {step.number}
                    </div>
                  </div>

                  {/* Icon */}
                  <div className={`w-16 h-16 ${colors.iconBg} rounded-full flex items-center justify-center mx-auto mb-4`}>
                    <StepIcon className="w-8 h-8 text-white" />
                  </div>

                  {/* Title */}
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white text-center mb-1">
                    {step.title}
                  </h3>

                  {/* Subtitle */}
                  <p className="text-sm text-gray-500 dark:text-gray-400 text-center mb-3">
                    {step.subtitle}
                  </p>

                  {/* Description */}
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 flex-grow text-center">
                    {step.description}
                  </p>

                  {/* Time Badge */}
                  <div className="flex justify-center mb-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${colors.timeBadge}`}>
                      {step.time}
                    </span>
                  </div>

                  {/* Remark */}
                  <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                    {step.remark}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Technical Privacy Security */}
      <section className="py-12 sm:py-16 bg-white dark:bg-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6 px-2">
              {t('features.technical.title')}
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto px-2">
              {t('features.technical.subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Eye, title: t('features.technical.anonymousAnalytics.title'), description: t('features.technical.anonymousAnalytics.description') },
              { icon: Globe, title: t('features.technical.internationalCompliance.title'), description: t('features.technical.internationalCompliance.description') },
              { icon: Shield, title: t('features.technical.securityHeaders.title'), description: t('features.technical.securityHeaders.description') },
              { icon: Database, title: t('features.technical.localFirstStorage.title'), description: t('features.technical.localFirstStorage.description') }
            ].map((feature, index) => {
              const FeatureIcon = feature.icon;
              return (
                <div
                  key={index}
                  className="bg-gray-50 dark:bg-slate-700 rounded-xl p-6 text-center hover:shadow-lg transition-all"
                >
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <FeatureIcon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h3 className="font-bold text-gray-900 dark:text-white mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 bg-white dark:bg-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <button
              type="button"
              onClick={() => navigate('/service-catalog')}
              className="px-8 py-4 bg-gradient-to-r from-red-500 to-red-600 text-white font-bold rounded-xl hover:from-red-600 hover:to-red-700 transition-all transform hover:scale-105 shadow-xl text-lg mb-3 flex items-center gap-2 mx-auto"
            >
              Start Browsing Services
              <ArrowRight className="w-5 h-5" />
            </button>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Takes less than 2 minutes • No signup • Free plan available
            </p>
          </div>
        </div>
      </section>

      {/* Important Notice Section */}
      <section className="py-12 bg-yellow-50 dark:bg-yellow-900/20 border-y border-yellow-200 dark:border-yellow-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="bg-white dark:bg-slate-800 rounded-lg p-6 border border-yellow-300 dark:border-yellow-700">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-6 h-6 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-yellow-900 dark:text-yellow-100 mb-2">
                  Important Notice
                </h3>
                <p className="text-sm text-yellow-800 dark:text-yellow-200">
                  The Privacy Exposure Index is an informational tool designed to help users understand potential privacy risks. It is NOT a judgment, assessment, or evaluation of any service company's practices, compliance, or security measures.{' '}
                  <a 
                    href="/privacy-exposure-disclaimer" 
                    className="underline hover:text-yellow-900 dark:hover:text-yellow-100 font-semibold"
                  >
                    Learn about our Privacy Exposure Index Methodology &amp; Disclaimers
                  </a>
                  .
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HowItWorksPage;
