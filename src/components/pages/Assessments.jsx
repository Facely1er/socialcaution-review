import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Target, Scale, Shield, ArrowRight, Clock, Info, CheckCircle } from 'lucide-react';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { useTranslation } from '../../contexts/TranslationContext';
import SEOHead from '../common/SEOHead';
import EnhancedBreadcrumbs from '../common/EnhancedBreadcrumbs';

/**
 * Assessments Landing Page
 * Shows both assessment options clearly
 */
const Assessments = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [assessmentResults] = useLocalStorage('socialcaution_results', null);
  const hasExposureAssessment = assessmentResults?.exposureScore !== undefined;
  const hasRightsAssessment = assessmentResults?.rightsScore !== undefined;
  
  // Calculate progress
  const completedSteps = [
    hasExposureAssessment || hasRightsAssessment,
    hasExposureAssessment && hasRightsAssessment
  ].filter(Boolean).length;
  
  const totalSteps = 2;
  const progressPercentage = (completedSteps / totalSteps) * 100;

  return (
    <>
      <SEOHead
        title={t('assessmentsPage.title')}
        description={t('assessmentsPage.description')}
        keywords="privacy assessment, privacy risk, privacy rights, digital privacy"
      />
      <div className="min-h-screen bg-gray-50 dark:bg-slate-900 pt-12 sm:pt-16 pb-12 sm:pb-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          {/* Header with Progress */}
          <div className="mb-8 sm:mb-12">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-gradient-to-br from-red-500 to-red-600 rounded-xl shadow-lg">
                <Target className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h1 className="page-title">
                  {t('assessmentsPage.headerTitle')}
                </h1>
                <p className="text-gray-600 dark:text-gray-300 mt-1">
                  {t('assessmentsPage.headerSubtitle')}
                </p>
              </div>
            </div>
            
            {/* Progress Bar */}
            <div className="bg-white dark:bg-slate-800 rounded-xl p-4 shadow-lg border border-gray-200 dark:border-slate-700">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                  {t('assessmentsPage.yourProgress')}
                </span>
                <span className="text-sm font-bold text-red-600 dark:text-red-400">
                  {completedSteps}/{totalSteps} {t('assessmentsPage.complete')}
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-slate-700 rounded-full h-3 overflow-hidden">
                <div 
                  className="h-3 bg-gradient-to-r from-red-500 via-red-600 to-red-700 rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
            </div>
          </div>

          {/* What you get - outcome before commitment */}
          {t('assessmentsPage.whatYouGet') && (
            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-4 mb-4">
              <p className="text-sm font-medium text-green-900 dark:text-green-100">
                {t('assessmentsPage.whatYouGet')}
              </p>
            </div>
          )}

          {/* Info Banner */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-5 mb-6 shadow-sm">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <Info className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-1">
                  {t('assessmentsPage.whyTakeAssessments')}
                </h3>
                <p className="text-blue-800 dark:text-blue-200 text-sm leading-relaxed">
                  {t('assessmentsPage.whyTakeAssessmentsText', {
                    personaNote: ''
                  })}
                </p>
              </div>
            </div>
          </div>

          {/* Assessment Cards */}
          <div className="space-y-4 mb-6">
            {/* Privacy Risk Exposure Assessment */}
            <div data-tutorial="exposure-assessment" className={`bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 border-2 transition-all hover:shadow-xl ${
              hasExposureAssessment 
                ? 'border-green-500 dark:border-green-600 bg-gradient-to-br from-green-50/50 to-white dark:from-green-900/10 dark:to-slate-800' 
                : 'border-red-200 dark:border-red-900/50 hover:border-red-300 dark:hover:border-red-800'
            }`}>
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`p-3 rounded-lg ${
                    hasExposureAssessment 
                      ? 'bg-green-100 dark:bg-green-900/30' 
                      : 'bg-red-100 dark:bg-red-900/30'
                  }`}>
                    <Target className={`w-6 h-6 ${
                      hasExposureAssessment 
                        ? 'text-green-600 dark:text-green-400' 
                        : 'text-red-600 dark:text-red-400'
                    }`} />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                      {t('assessmentsPage.privacyRiskExposureAssessment.title')}
                    </h2>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      {t('assessmentsPage.privacyRiskExposureAssessment.subtitle')}
                    </p>
                  </div>
                </div>
                {hasExposureAssessment && (
                  <div className="flex items-center gap-1 px-2 py-1 bg-green-100 dark:bg-green-900/30 rounded-full">
                    <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />
                    <span className="text-xs font-semibold text-green-800 dark:text-green-200">
                      {t('assessmentsPage.privacyRiskExposureAssessment.completed')}
                    </span>
                  </div>
                )}
              </div>

              <div className="mb-4">
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-2">
                  <Clock className="w-4 h-4" />
                  <span>{t('assessmentsPage.privacyRiskExposureAssessment.duration')}</span>
                </div>
                <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                  {t('assessmentsPage.privacyRiskExposureAssessment.description')}
                </p>
              </div>

              <div className="space-y-2 mb-4">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                  {t('assessmentsPage.privacyRiskExposureAssessment.whatYoullLearn')}
                </h3>
                <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                    <span>{t('assessmentsPage.privacyRiskExposureAssessment.learn1')}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                    <span>{t('assessmentsPage.privacyRiskExposureAssessment.learn2')}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                    <span>{t('assessmentsPage.privacyRiskExposureAssessment.learn3')}</span>
                  </li>
                </ul>
              </div>

              <button
                onClick={() => navigate('/assessment/exposure')}
                className={`w-full px-6 py-3 font-semibold rounded-lg transition-all flex items-center justify-center gap-2 ${
                  hasExposureAssessment
                    ? 'bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-600'
                    : 'bg-gradient-to-r from-red-600 to-red-700 text-white hover:from-red-700 hover:to-red-800'
                }`}
              >
                {hasExposureAssessment ? (
                  <>
                    <CheckCircle className="w-5 h-5" />
                    {t('assessmentsPage.privacyRiskExposureAssessment.retakeAssessment')}
                  </>
                ) : (
                  <>
                    <Target className="w-5 h-5" />
                    {t('assessmentsPage.privacyRiskExposureAssessment.startAssessment')}
                  </>
                )}
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>

            {/* Privacy Rights Knowledge Checkup */}
            <div data-tutorial="rights-assessment" className={`bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 border-2 transition-all hover:shadow-xl ${
              hasRightsAssessment 
                ? 'border-green-500 dark:border-green-600 bg-gradient-to-br from-green-50/50 to-white dark:from-green-900/10 dark:to-slate-800' 
                : 'border-blue-200 dark:border-blue-900/50 hover:border-blue-300 dark:hover:border-blue-800'
            }`}>
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`p-3 rounded-lg ${
                    hasRightsAssessment 
                      ? 'bg-green-100 dark:bg-green-900/30' 
                      : 'bg-blue-100 dark:bg-blue-900/30'
                  }`}>
                    <Scale className={`w-6 h-6 ${
                      hasRightsAssessment 
                        ? 'text-green-600 dark:text-green-400' 
                        : 'text-blue-600 dark:text-blue-400'
                    }`} />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                      {t('assessmentsPage.privacyRightsKnowledgeCheckup.title')}
                    </h2>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      {t('assessmentsPage.privacyRightsKnowledgeCheckup.subtitle')}
                    </p>
                  </div>
                </div>
                {hasRightsAssessment && (
                  <div className="flex items-center gap-1 px-2 py-1 bg-green-100 dark:bg-green-900/30 rounded-full">
                    <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />
                    <span className="text-xs font-semibold text-green-800 dark:text-green-200">
                      {t('assessmentsPage.privacyRightsKnowledgeCheckup.completed')}
                    </span>
                  </div>
                )}
              </div>

              <div className="mb-4">
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-2">
                  <Clock className="w-4 h-4" />
                  <span>{t('assessmentsPage.privacyRightsKnowledgeCheckup.duration')}</span>
                </div>
                <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                  {t('assessmentsPage.privacyRightsKnowledgeCheckup.description')}
                </p>
              </div>

              <div className="space-y-2 mb-4">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                  {t('assessmentsPage.privacyRightsKnowledgeCheckup.whatYoullLearn')}
                </h3>
                <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                    <span>{t('assessmentsPage.privacyRightsKnowledgeCheckup.learn1')}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                    <span>{t('assessmentsPage.privacyRightsKnowledgeCheckup.learn2')}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                    <span>{t('assessmentsPage.privacyRightsKnowledgeCheckup.learn3')}</span>
                  </li>
                </ul>
              </div>

              <button
                onClick={() => navigate('/assessment/rights')}
                className={`w-full px-6 py-3 font-semibold rounded-lg transition-all flex items-center justify-center gap-2 ${
                  hasRightsAssessment
                    ? 'bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-600'
                    : 'bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800'
                }`}
              >
                {hasRightsAssessment ? (
                  <>
                    <CheckCircle className="w-5 h-5" />
                    {t('assessmentsPage.privacyRightsKnowledgeCheckup.retakeCheckup')}
                  </>
                ) : (
                  <>
                    <Scale className="w-5 h-5" />
                    {t('assessmentsPage.privacyRightsKnowledgeCheckup.startCheckup')}
                  </>
                )}
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Additional Info */}
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-6 border border-gray-200 dark:border-slate-700">
            <div className="flex items-start gap-3">
              <Shield className="w-5 h-5 text-gray-600 dark:text-gray-400 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                  {t('assessmentsPage.yourPrivacyMatters.title')}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                  {t('assessmentsPage.yourPrivacyMatters.description')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Assessments;

