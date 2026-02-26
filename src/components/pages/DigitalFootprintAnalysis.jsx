import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Target, Scale, Shield, ArrowRight, Clock, Info, CheckCircle, Sparkles, LayoutDashboard, ShoppingBag, Footprints } from 'lucide-react';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { useTranslation } from '../../contexts/TranslationContext';
import SEOHead from '../common/SEOHead';
import EnhancedBreadcrumbs from '../common/EnhancedBreadcrumbs';

/**
 * Digital Footprint Analysis Landing Page
 * Shows the recommended workflow for analyzing your digital footprint
 */
const DigitalFootprintAnalysis = () => {
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
        title="Analyse Your Digital Footprint - SocialCaution"
        description="Follow our recommended workflow to analyze your digital footprint and understand your privacy exposure across online services."
        keywords="digital footprint, privacy analysis, digital privacy, online privacy, privacy assessment"
      />
      <div className="min-h-screen bg-gray-50 dark:bg-slate-900 pt-12 sm:pt-16 pb-12 sm:pb-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <EnhancedBreadcrumbs />
          
          {/* Header */}
          <div className="mb-8 sm:mb-12">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-gradient-to-br from-red-500 to-red-600 rounded-xl shadow-lg">
                <Footprints className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h1 className="page-title">
                  Analyse Your Digital Footprint
                </h1>
                <p className="text-gray-600 dark:text-gray-300 mt-1">
                  Follow our recommended workflow to understand your privacy exposure and take control of your digital footprint
                </p>
              </div>
            </div>
            
            {/* Progress Bar */}
            <div className="bg-white dark:bg-slate-800 rounded-xl p-4 shadow-lg border border-gray-200 dark:border-slate-700">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Your Progress
                </span>
                <span className="text-sm font-bold text-red-600 dark:text-red-400">
                  {completedSteps}/{totalSteps} Complete
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

          {/* Visual Workflow Steps */}
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 mb-6 border border-gray-200 dark:border-slate-700">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              Your Digital Footprint Analysis
            </h2>
            <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
              <p className="text-sm text-blue-800 dark:text-blue-200">
                <strong>Recommended workflow:</strong> Start by browsing the{' '}
                <button 
                  onClick={() => navigate('/service-catalog')} 
                  className="underline font-semibold hover:text-blue-900 dark:hover:text-blue-100"
                >
                  Services Monitoring
                </button>
                {' '}to see privacy risks, then set your privacy concerns before taking assessments.
              </p>
            </div>
            <div className="space-y-4">
              {/* Step 1: Services Monitoring */}
              <div className="relative pl-8 pb-4 border-l-2 border-dashed border-gray-300 dark:border-slate-600">
                <div className="absolute -left-4 top-0">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center border-2 bg-blue-500 border-blue-500 dark:bg-blue-600 dark:border-blue-600">
                    <span className="text-sm font-bold text-white">1</span>
                  </div>
                </div>
                <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <ShoppingBag className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white">
                          Browse Services Monitoring
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Explore 200+ online services and see their privacy exposure ratings
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => navigate('/service-catalog')}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium flex items-center gap-2"
                    >
                      Explore Services
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Step 2: Privacy Concerns */}
              <div className="relative pl-8 pb-4 border-l-2 border-dashed border-gray-300 dark:border-slate-600">
                <div className="absolute -left-4 top-0">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center border-2 bg-white dark:bg-slate-800 border-gray-300 dark:border-slate-600">
                    <span className="text-sm font-bold text-gray-400 dark:text-gray-500">2</span>
                  </div>
                </div>
                <div className="p-4 rounded-lg bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Shield className="w-5 h-5 text-gray-400 dark:text-gray-500" />
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white">
                          Set Your Privacy Concerns
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Tell us what privacy issues matter most to you
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => navigate('/privacy-settings')}
                      className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm font-medium flex items-center gap-2"
                    >
                      Set Concerns
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Step 3: Take Assessments */}
              <div className={`relative pl-8 pb-4 ${hasExposureAssessment || hasRightsAssessment ? '' : 'border-l-2 border-dashed border-gray-300 dark:border-slate-600'}`}>
                <div className="absolute -left-4 top-0">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                    hasExposureAssessment || hasRightsAssessment
                      ? 'bg-blue-500 border-blue-500 dark:bg-blue-600 dark:border-blue-600' 
                      : 'bg-white dark:bg-slate-800 border-gray-300 dark:border-slate-600'
                  }`}>
                    {(hasExposureAssessment || hasRightsAssessment) ? (
                      <CheckCircle className="w-5 h-5 text-white" />
                    ) : (
                      <span className="text-sm font-bold text-gray-400 dark:text-gray-500">3</span>
                    )}
                  </div>
                </div>
                <div className={`p-4 rounded-lg ${
                  hasExposureAssessment || hasRightsAssessment
                    ? 'bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800' 
                    : 'bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600'
                }`}>
                  <div className="flex items-center gap-3">
                    <Target className={`w-5 h-5 ${
                      hasExposureAssessment || hasRightsAssessment
                        ? 'text-blue-600 dark:text-blue-400' 
                        : 'text-gray-400 dark:text-gray-500'
                    }`} />
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 dark:text-white">
                        Take Privacy Assessments
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {hasExposureAssessment && hasRightsAssessment 
                          ? 'Both assessments completed!'
                          : hasExposureAssessment || hasRightsAssessment
                          ? 'Complete the remaining assessment'
                          : 'Evaluate your privacy risks and rights'}
                      </p>
                    </div>
                    <button
                      onClick={() => navigate('/assessment')}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium flex items-center gap-2"
                    >
                      Start Assessment
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Step 4: View Dashboard */}
              <div className="relative pl-8">
                <div className="absolute -left-4 top-0">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                    hasExposureAssessment && hasRightsAssessment
                      ? 'bg-purple-500 border-purple-500 dark:bg-purple-600 dark:border-purple-600' 
                      : 'bg-white dark:bg-slate-800 border-gray-300 dark:border-slate-600'
                  }`}>
                    {hasExposureAssessment && hasRightsAssessment ? (
                      <CheckCircle className="w-5 h-5 text-white" />
                    ) : (
                      <span className="text-sm font-bold text-gray-400 dark:text-gray-500">4</span>
                    )}
                  </div>
                </div>
                <div className={`p-4 rounded-lg ${
                  hasExposureAssessment && hasRightsAssessment
                    ? 'bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800' 
                    : 'bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600'
                }`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <LayoutDashboard className={`w-5 h-5 ${
                        hasExposureAssessment && hasRightsAssessment
                          ? 'text-purple-600 dark:text-purple-400' 
                          : 'text-gray-400 dark:text-gray-500'
                      }`} />
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white">
                          View Your Dashboard
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {hasExposureAssessment && hasRightsAssessment
                            ? 'See your personalized privacy insights and recommendations'
                            : 'Get personalized insights after completing assessments'}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => navigate('/dashboard')}
                      className={`px-4 py-2 rounded-lg transition-colors text-sm font-medium flex items-center gap-2 ${
                        hasExposureAssessment && hasRightsAssessment
                          ? 'bg-purple-600 text-white hover:bg-purple-700'
                          : 'bg-gray-600 text-white hover:bg-gray-700'
                      }`}
                    >
                      View Dashboard
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DigitalFootprintAnalysis;
