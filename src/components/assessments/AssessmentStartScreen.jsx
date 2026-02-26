import React from 'react';
import { Shield, Scale, Zap, BookOpen, CheckCircle, AlertTriangle, Globe, Users, Lock as LockIcon, ArrowRight, Target } from 'lucide-react';
import { AssessmentCoverage, PrivacyRegulations } from '../../data/regulationsMapping';
import { useTranslation } from '../../contexts/TranslationContext';

const AssessmentStartScreen = ({ 
  assessmentType, 
  onStart, 
  breadcrumbs, 
  backButton, 
  themeToggle 
}) => {
  const { t } = useTranslation();
  
  const getAssessmentConfig = () => {
    switch (assessmentType) {
      case 'exposure':
        return {
          icon: Shield,
          color: 'red',
          title: t('assessment.exposure.title'),
          subtitle: t('assessment.exposure.subtitle'),
          description: t('assessment.exposure.description'),
          duration: t('assessment.exposure.duration'),
          questions: '7 questions',
          coverage: {
            title: t('assessment.exposure.title'),
            description: t('assessment.exposure.description'),
            regulationsAssessed: ['gdpr', 'ccpa', 'pipeda', 'lgpd'],
            coverageAreas: t('assessment.coverage.exposure.coverageAreas', { returnObjects: true }),
            businessValue: t('assessment.coverage.exposure.businessValue'),
            outcomes: t('assessment.coverage.exposure.outcomes', { returnObjects: true })
          }
        };
      case 'rights':
        return {
          icon: Scale,
          color: 'blue',
          title: t('assessment.rights.title'),
          subtitle: t('assessment.rights.subtitle'),
          description: t('assessment.rights.description'),
          duration: t('assessment.rights.duration'),
          questions: '8 questions',
          coverage: {
            title: t('assessment.rights.title'),
            description: t('assessment.rights.description'),
            regulationsAssessed: ['gdpr', 'ccpa', 'pipeda', 'lgpd'],
            coverageAreas: t('assessment.coverage.rights.coverageAreas', { returnObjects: true }),
            businessValue: t('assessment.coverage.rights.businessValue'),
            outcomes: t('assessment.coverage.rights.outcomes', { returnObjects: true })
          }
        };
      case 'full':
        return {
          icon: Target,
          color: 'purple',
          title: t('assessment.full.title'),
          subtitle: t('assessment.full.subtitle'),
          description: t('assessment.full.description'),
          duration: t('assessment.full.duration'),
          questions: '11 questions',
          coverage: {
            title: t('assessment.full.title'),
            description: t('assessment.full.description'),
            regulationsAssessed: ['gdpr', 'ccpa', 'pipeda', 'lgpd'],
            coverageAreas: t('assessment.coverage.full.coverageAreas', { returnObjects: true }),
            businessValue: t('assessment.coverage.full.businessValue'),
            outcomes: t('assessment.coverage.full.outcomes', { returnObjects: true })
          }
        };
      default:
        return null;
    }
  };

  const config = getAssessmentConfig();
  if (!config) return null;

  const colorClasses = {
    red: {
      bg: 'bg-red-50 dark:bg-red-900/20',
      border: 'border-red-200 dark:border-red-800',
      text: 'text-red-900 dark:text-red-100',
      accent: 'text-red-600 dark:text-red-400',
      button: 'bg-red-500 hover:bg-red-600',
      icon: 'text-red-500'
    },
    blue: {
      bg: 'bg-blue-50 dark:bg-blue-900/20',
      border: 'border-blue-200 dark:border-blue-800',
      text: 'text-blue-900 dark:text-blue-100',
      accent: 'text-blue-600 dark:text-blue-400',
      button: 'bg-blue-500 hover:bg-blue-600',
      icon: 'text-blue-500'
    },
    purple: {
      bg: 'bg-purple-50 dark:bg-purple-900/20',
      border: 'border-purple-200 dark:border-purple-800',
      text: 'text-purple-900 dark:text-purple-100',
      accent: 'text-purple-600 dark:text-purple-400',
      button: 'bg-purple-500 hover:bg-purple-600',
      icon: 'text-purple-500'
    }
  };

  const colors = colorClasses[config.color];

  const handleStartClick = () => {
    if (onStart) {
      onStart();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Navigation Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex-1">
            {breadcrumbs}
          </div>
          <div className="flex items-center space-x-4">
            {themeToggle}
            {backButton}
          </div>
        </div>

        {/* Enhancement Context Banner */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl p-6 mb-8 border-2 border-blue-200 dark:border-blue-800">
          <div className="flex items-start gap-4">
            <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex-shrink-0">
              <Target className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                Want Deeper Privacy Analysis?
              </h3>
              <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">
                This assessment provides detailed insights about your digital privacy posture. It's completely optional—you can use Services Monitoring to see your privacy exposure without taking an assessment.
              </p>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => window.history.back()}
                  className="px-4 py-2 bg-white dark:bg-slate-700 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-600 transition-colors text-sm font-medium"
                >
                  Back to Services Monitoring
                </button>
                <button
                  onClick={() => window.location.href = '/exposure-dashboard'}
                  className="px-4 py-2 bg-white dark:bg-slate-700 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-600 transition-colors text-sm font-medium"
                >
                  View Exposure Dashboard
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Header */}
        <div className="text-center mb-12">
          <div className={`inline-flex items-center justify-center w-20 h-20 rounded-2xl mb-6 ${colors.bg} ${colors.border} border-2`}>
            <config.icon className={`w-10 h-10 ${colors.icon}`} />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-3">
            {config.title}
          </h1>
          <p className={`text-xl font-medium mb-2 ${colors.accent}`}>
            {config.subtitle}
          </p>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            {config.description}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Assessment Overview */}
          <div className="lg:col-span-2 space-y-6">
            {/* What You'll Learn */}
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 p-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                <BookOpen className="w-5 h-5 mr-2 text-green-500" />
                {t('assessment.startScreen.whatYoullDiscover')}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {config.coverage.outcomes?.map((outcome, index) => (
                  <div key={index} className="flex items-start">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-gray-700 dark:text-gray-300">{outcome}</span>
                  </div>
                ))}
              </div>
              <div className="mt-4 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                <p className="text-sm text-green-800 dark:text-green-200">
                  <strong>{t('assessment.startScreen.businessValue')}</strong> {config.coverage.businessValue}
                </p>
              </div>
            </div>

            {/* Regulation Coverage */}
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 p-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                <Globe className="w-5 h-5 mr-2 text-blue-500" />
                {t('assessment.startScreen.privacyLawsCovered')}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                {config.coverage.regulationsAssessed?.map((regKey) => {
                  const regulation = PrivacyRegulations[regKey];
                  return (
                    <div key={regKey} className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                      <h3 className="font-medium text-blue-900 dark:text-blue-100 text-sm">
                        {regulation.name}
                      </h3>
                      <p className="text-xs text-blue-700 dark:text-blue-300">
                        {regulation.region}
                      </p>
                    </div>
                  );
                })}
              </div>
              <div className="space-y-2">
                <h3 className="font-medium text-gray-900 dark:text-white text-sm">{t('assessment.startScreen.specificCoverageAreas')}</h3>
                {config.coverage.coverageAreas?.map((area, index) => (
                  <div key={index} className="flex items-start">
                    <AlertTriangle className="w-3 h-3 text-orange-500 mr-2 mt-1 flex-shrink-0" />
                    <span className="text-xs text-gray-600 dark:text-gray-400">{area}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Assessment Details & Start */}
          <div className="space-y-6">
            {/* Assessment Info */}
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 p-6">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">{t('assessment.startScreen.assessmentDetails')}</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-300">{t('assessment.startScreen.duration')}</span>
                  <span className="font-medium text-gray-900 dark:text-white">{config.duration}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-300">{t('assessment.startScreen.questions')}</span>
                  <span className="font-medium text-gray-900 dark:text-white">{config.questions}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-300">{t('assessment.startScreen.difficulty')}</span>
                  <span className="font-medium text-gray-900 dark:text-white">{t('assessment.startScreen.beginnerFriendly')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-300">{t('assessment.startScreen.languages')}</span>
                  <span className="font-medium text-gray-900 dark:text-white">{t('assessment.startScreen.english')}</span>
                </div>
              </div>
            </div>

            {/* Privacy Notice */}
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 p-6">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3 flex items-center">
                <LockIcon className="w-4 h-4 mr-2 text-green-500" />
                {t('assessment.startScreen.yourPrivacy')}
              </h3>
              <div className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                <p className="flex items-start">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  {t('assessment.startScreen.noDataCollected')}
                </p>
                <p className="flex items-start">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  {t('assessment.startScreen.resultsStoredLocally')}
                </p>
                <p className="flex items-start">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  {t('assessment.startScreen.anonymousAnalytics')}
                </p>
                <p className="flex items-start">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  {t('assessment.startScreen.gdprCompliant')}
                </p>
              </div>
            </div>

            {/* Start Button */}
            <button
              onClick={handleStartClick}
              className={`btn-interactive group w-full px-6 py-4 bg-gradient-to-r ${config.color === 'red' ? 'from-red-500 via-red-600 to-red-500 hover:shadow-red-500/50 border-red-400/30' : config.color === 'blue' ? 'from-blue-500 via-blue-600 to-blue-500 hover:shadow-blue-500/50 border-blue-400/30' : 'from-purple-500 via-purple-600 to-purple-500 hover:shadow-purple-500/50 border-purple-400/30'} bg-size-200 text-white text-lg font-bold rounded-xl hover:bg-right-bottom transition-all duration-700 transform hover:scale-105 shadow-xl overflow-hidden border will-change-transform`}
            >
              <span className="relative flex items-center justify-center z-10">
                {t('assessment.startScreen.startAssessment')}
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-2 transition-transform duration-300" />
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 translate-x-full group-hover:translate-x-0 transition-transform duration-1000"></div>
            </button>

            {/* Help Text */}
            <div className="text-center">
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {t('assessment.startScreen.helpText')}
              </p>
            </div>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            {t('assessment.startScreen.readyToDiscover')}
          </p>
          <button
            onClick={handleStartClick}
            className={`btn-interactive group px-8 py-3 bg-gradient-to-r ${config.color === 'red' ? 'from-red-500 via-red-600 to-red-500 hover:shadow-red-500/50 border-red-400/30' : config.color === 'blue' ? 'from-blue-500 via-blue-600 to-blue-500 hover:shadow-blue-500/50 border-blue-400/30' : 'from-purple-500 via-purple-600 to-purple-500 hover:shadow-purple-500/50 border-purple-400/30'} bg-size-200 text-white font-bold rounded-xl hover:bg-right-bottom transition-all duration-700 transform hover:scale-105 shadow-xl overflow-hidden border will-change-transform flex items-center mx-auto`}
          >
            <span className="relative flex items-center z-10">
              {t('assessment.startScreen.beginAssessment')}
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-2 transition-transform duration-300" />
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 translate-x-full group-hover:translate-x-0 transition-transform duration-1000"></div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AssessmentStartScreen;