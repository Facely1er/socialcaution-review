import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LayoutDashboard, Smartphone, ArrowRight, Lock, Shield, Gauge, Target, Activity, Zap, AlertCircle, Info, Settings, RotateCcw } from 'lucide-react';
import SEOHead from '../common/SEOHead';
import PageHeader from '../common/PageHeader';
import { useTranslation } from '../../contexts/TranslationContext';
import { checkWorkflowCompletion } from '../../utils/workflowCheck';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { subscriptionService } from '../../services/subscriptionService';
import { getServiceLimit, hasReachedServiceLimit } from '../../utils/serviceLimitChecker';
import { Link } from 'react-router-dom';
import { Sparkles } from 'lucide-react';
import {
  APP_STORE_IOS,
  APP_STORE_ANDROID,
  APP_STORE_BADGE_IMAGE,
  GOOGLE_PLAY_BADGE_IMAGE,
  BADGE_WIDTH,
  BADGE_HEIGHT,
} from '../../config/appStores';
import { getConcernsFromStorage } from '../../utils/concernHelpers';
import { getConcernLabel } from '../../data/privacyConcerns';
import { getEnhancedService } from '../../data/serviceCatalogEnhanced';

// Free plan: use sync subscription read so tier/limits are correct immediately (getSubscriptionStatus is async and would set a Promise)
const getInitialSubscriptionStatus = () => {
  try {
    if (subscriptionService?.getSubscriptionStatusFromLocalStorage) {
      const status = subscriptionService.getSubscriptionStatusFromLocalStorage();
      if (status && (status.tier === 'free' || status.tier === 'premium' || status.tier === 'family')) {
        return status;
      }
    }
  } catch (e) {
    // ignore
  }
  return { tier: 'free', status: 'active' };
};

const Dashboard = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [appStoreBadgeError, setAppStoreBadgeError] = useState(false);
  const [googlePlayBadgeError, setGooglePlayBadgeError] = useState(false);
  const [workflowStatus, setWorkflowStatus] = useState(() => checkWorkflowCompletion());
  const [subscriptionStatus, setSubscriptionStatus] = useState(() => getInitialSubscriptionStatus());
  const [selectedServices, setSelectedServices] = useLocalStorage('socialcaution_services', []);
  const [assessmentResults] = useLocalStorage('socialcaution_results', null);

  useEffect(() => {
    // Optionally sync subscription from Supabase for premium users; free stays from initial sync read
    if (subscriptionService?.getSubscriptionStatus) {
      subscriptionService.getSubscriptionStatus().then((status) => {
        if (status && (status.tier === 'free' || status.tier === 'premium' || status.tier === 'family')) {
          setSubscriptionStatus(status);
        }
      }).catch(() => {});
    }

    const updateWorkflowStatus = () => {
      setWorkflowStatus(checkWorkflowCompletion());
    };
    updateWorkflowStatus();
    const interval = setInterval(updateWorkflowStatus, 2000);
    return () => clearInterval(interval);
  }, []);

  const hasStandardAccess = subscriptionStatus.tier === 'premium' || subscriptionStatus.tier === 'family';
  const isWorkflowComplete = workflowStatus.isComplete;
  const concerns = getConcernsFromStorage();
  const concernCount = Array.isArray(concerns) ? concerns.length : 0;

  // Calculate basic dashboard metrics (use defaults if not available)
  const riskScore = assessmentResults?.exposureScore || 0;
  const rightsScore = assessmentResults?.rightsScore || 0;
  const serviceCount = selectedServices?.length || 0;
  const riskLevel = riskScore >= 70 ? 'high' : riskScore >= 50 ? 'moderate' : riskScore >= 30 ? 'low' : 'minimal';
  
  // Determine what data is available
  const hasAssessment = !!assessmentResults;
  const hasServices = serviceCount > 0;
  const hasConcerns = concernCount > 0;

  // Dashboard is "unlocked" when user has any progress: services selected OR concerns set OR assessment completed
  const hasUnlockedDashboard = hasServices || hasConcerns || hasAssessment;

  // Use subscription tier for limits so free plan shows 5-service limit correctly
  const userTier = subscriptionStatus?.tier === 'premium' || subscriptionStatus?.tier === 'family' ? subscriptionStatus.tier : 'free';
  const serviceLimit = getServiceLimit(userTier);
  const hasReachedLimit = hasReachedServiceLimit(userTier, serviceCount);
  const isFreeTier = userTier === 'free';

  return (
    <>
      <SEOHead
        title="Privacy Dashboard - SocialCaution"
        description="Preview your personalized privacy dashboard. Download the mobile app for full features and recurrent access."
        keywords="privacy dashboard, mobile app, privacy management"
      />
      <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
        <PageHeader
          title={t('dashboard.pageTitle')}
          subtitle={t('dashboard.whatYouCanDo')}
          icon={LayoutDashboard}
          iconGradient="red"
        >
          <div className="flex items-center gap-4">
            <div className="text-center">
              <div className={`text-2xl font-bold ${
                riskLevel === 'high' ? 'text-red-500' :
                riskLevel === 'moderate' ? 'text-orange-500' :
                riskLevel === 'low' ? 'text-yellow-500' : 'text-green-500'
              }`}>
                {riskScore}
              </div>
              <div className="text-xs text-gray-500">Privacy Exposure Score</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-500">{rightsScore}</div>
              <div className="text-xs text-gray-500">Data Rights Score</div>
            </div>
          </div>
        </PageHeader>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
          {/* Privacy focus / Concerns card - quick link to Settings */}
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 p-6 mb-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-indigo-50 dark:bg-indigo-900/20 flex items-center justify-center flex-shrink-0">
                  <Settings className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                    {t('dashboard.sections.privacyFocus')}
                  </h2>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                    {concernCount > 0
                      ? t('dashboard.sections.privacyFocusCount', { count: concernCount })
                      : t('privacySettingsPage.concernsUsage')}
                  </p>
                  {concernCount > 0 && concerns.slice(0, 3).map((id) => (
                    <span
                      key={id}
                      className="inline-block mt-2 mr-2 px-2 py-0.5 text-xs font-medium bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 rounded"
                    >
                      {getConcernLabel(id)}
                    </span>
                  ))}
                  {concernCount > 3 && (
                    <span className="inline-block mt-2 text-xs text-gray-500 dark:text-gray-400">
                      +{concernCount - 3} more
                    </span>
                  )}
                </div>
              </div>
              <Link
                to="/privacy-focus"
                className="px-4 py-2 rounded-lg border border-indigo-500 dark:border-indigo-400 text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-900/20 hover:bg-indigo-100 dark:hover:bg-indigo-900/30 font-medium text-sm whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ring-offset-white dark:ring-offset-slate-800 transition-colors"
              >
                {t('dashboard.sections.editInAccount')}
              </Link>
            </div>
          </div>

          {/* Your tracked services (free plan: up to 5) */}
          {Array.isArray(selectedServices) && selectedServices.length > 0 && (
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 p-6 mb-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                    Your tracked services
                  </h2>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                    {isFreeTier
                      ? `${selectedServices.length} of ${serviceLimit} services — reports included free`
                      : `${selectedServices.length} services tracked`}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Link
                    to="/my-services"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white font-medium text-sm whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 ring-offset-white dark:ring-offset-slate-800 transition-colors"
                  >
                    View service reports
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                  <Link
                    to="/service-catalog"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-red-500 dark:border-red-400 text-red-700 dark:text-red-300 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30 font-medium text-sm whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 ring-offset-white dark:ring-offset-slate-800 transition-colors"
                  >
                    Manage in catalog
                  </Link>
                  <button
                    type="button"
                    onClick={() => {
                      if (window.confirm('Clear all tracked services? You can add them again from the catalog.')) {
                        setSelectedServices([]);
                      }
                    }}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 dark:border-slate-600 text-gray-700 dark:text-gray-300 bg-white dark:bg-slate-800 hover:bg-gray-50 dark:hover:bg-slate-700 font-medium text-sm whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 ring-offset-white dark:ring-offset-slate-800 transition-colors"
                    aria-label="Reset tracked services"
                  >
                    <RotateCcw className="w-4 h-4" />
                    Reset
                  </button>
                </div>
              </div>
              <ul className="mt-4 space-y-2">
                {selectedServices.slice(0, isFreeTier ? serviceLimit : selectedServices.length).map((id) => {
                  const service = typeof id === 'string' ? getEnhancedService(id) : getEnhancedService(id?.id || id);
                  const name = service?.name || (typeof id === 'string' ? id : id?.name || 'Unknown');
                  return (
                    <li key={typeof id === 'string' ? id : id?.id || id} className="flex items-center gap-3 py-2 px-3 rounded-lg bg-gray-50 dark:bg-slate-700/50">
                      <Shield className="w-4 h-4 text-red-500 flex-shrink-0" />
                      <span className="text-sm font-medium text-gray-900 dark:text-white truncate">{name}</span>
                      <Link
                        to="/service-catalog"
                        className="ml-auto text-xs text-red-600 dark:text-red-400 hover:underline flex-shrink-0"
                      >
                        View
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}

          {/* Free plan: service limit + access to reports for selected services */}
          {isFreeTier && selectedServices.length > 0 && (
            <div className="mb-4 p-4 bg-gradient-to-r from-orange-50 to-yellow-50 dark:from-orange-900/20 dark:to-yellow-900/20 border-l-4 border-orange-500 dark:border-orange-400 rounded-lg shadow-sm">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3 flex-1">
                  <div className="flex-shrink-0">
                    <Sparkles className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-sm font-semibold text-orange-900 dark:text-orange-100 mb-1">
                      {hasReachedLimit
                        ? 'Service Limit Reached'
                        : `Tracking ${selectedServices.length} of ${serviceLimit} Services`}
                    </h3>
                    <p className="text-xs text-orange-800 dark:text-orange-200 mb-3">
                      {hasReachedLimit
                        ? `You're tracking ${selectedServices.length} services. Remove one to track a different service, or upgrade to Premium for unlimited service tracking.`
                        : `Free plan: track up to ${serviceLimit} services. Reports for your selected services are included. Upgrade to Premium for unlimited tracking and privacy policy alerts.`}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <Link
                        to="/my-services"
                        className="inline-flex items-center gap-2 px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white text-sm font-medium rounded-lg transition-colors shadow-sm"
                      >
                        View reports for your {selectedServices.length} service{selectedServices.length !== 1 ? 's' : ''}
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                      <Link
                        to="/pricing"
                        className="inline-flex items-center gap-2 px-4 py-2 border border-orange-500 dark:border-orange-400 text-orange-700 dark:text-orange-200 bg-transparent hover:bg-orange-100 dark:hover:bg-orange-900/30 text-sm font-medium rounded-lg transition-colors"
                      >
                        <Sparkles className="w-4 h-4" />
                        Premium plans
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Workflow CTA: show only when user has no progress (no services, no concerns, no assessment) */}
          {!hasUnlockedDashboard && (
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-6 mb-6">
              <div className="flex items-start gap-3">
                <Info className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
                    Complete Your Workflow to Unlock Full Dashboard
                  </h3>
                  <p className="text-sm text-blue-800 dark:text-blue-200 mb-3">
                    Complete these steps to access your personalized dashboard: (1) Select services, (2) Set privacy concerns, and (3) Take assessment.
                  </p>
                  <button
                    onClick={() => navigate('/service-catalog')}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all text-sm font-medium"
                  >
                    Start Workflow
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Soft prompt when dashboard unlocked but workflow not fully complete */}
          {hasUnlockedDashboard && !isWorkflowComplete && (
            <div className="bg-blue-50/70 dark:bg-blue-900/10 border border-blue-200/70 dark:border-blue-800/70 rounded-xl px-4 py-3 mb-6">
              <p className="text-sm text-blue-800 dark:text-blue-200">
                Complete all three steps (services, privacy concerns, assessment) for personalized priority actions and full recommendations.
              </p>
              <div className="flex flex-wrap gap-2 mt-2">
                {!workflowStatus.step2_services && (
                  <button onClick={() => navigate('/service-catalog')} className="text-xs font-medium text-blue-700 dark:text-blue-300 hover:underline">
                    Select services →
                  </button>
                )}
                {!workflowStatus.step3_concerns && (
                  <button onClick={() => navigate('/privacy-focus')} className="text-xs font-medium text-blue-700 dark:text-blue-300 hover:underline">
                    Set privacy concerns →
                  </button>
                )}
                {!workflowStatus.step4_assessment && (
                  <button onClick={() => navigate('/assessment/full')} className="text-xs font-medium text-blue-700 dark:text-blue-300 hover:underline">
                    Take assessment →
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Risk Profile Section */}
          <div className="bg-gradient-to-r from-red-50 via-orange-50 to-yellow-50 dark:from-red-900/20 dark:via-orange-900/20 dark:to-yellow-900/20 rounded-xl shadow-sm border border-red-200 dark:border-red-800 p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center">
                <Gauge className="w-5 h-5 mr-2 text-red-500" />
                Your Privacy Risk Profile
              </h2>
              {hasAssessment ? (
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  riskLevel === 'high' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300' :
                  riskLevel === 'moderate' ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300' :
                  riskLevel === 'low' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300' :
                  'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300'
                }`}>
                  {riskLevel.charAt(0).toUpperCase() + riskLevel.slice(1)} Risk
                </span>
              ) : (
                <span className="px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400">
                  Complete Assessment
                </span>
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white dark:bg-slate-800 rounded-lg p-4">
                <div className="text-2xl font-bold text-red-500 mb-1">
                  {hasAssessment ? riskScore : '—'}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-300">Privacy Exposure Score</div>
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {hasAssessment ? 'From assessment (0-100)' : 'Complete assessment to see score'}
                </div>
              </div>
              <div className="bg-white dark:bg-slate-800 rounded-lg p-4">
                <div className="text-2xl font-bold text-blue-500 mb-1">
                  {hasAssessment ? rightsScore : '—'}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-300">Data Rights Score</div>
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {hasAssessment ? 'Privacy knowledge (0-100)' : 'Complete assessment to see score'}
                </div>
              </div>
              <div className="bg-white dark:bg-slate-800 rounded-lg p-4">
                <div className="text-2xl font-bold text-purple-500 mb-1">{serviceCount}</div>
                <div className="text-sm text-gray-600 dark:text-gray-300">Services Tracked</div>
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {hasStandardAccess ? 'Unlimited' : hasServices ? `Free: ${serviceCount}/5` : 'Add services to track'}
                </div>
              </div>
            </div>
          </div>

          {/* Digital Footprint - Restricted for Free */}
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-gradient-to-br from-red-500 to-purple-600 rounded-lg">
                  <Activity className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Personal Digital Privacy report</h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Comprehensive analysis of your digital presence
                  </p>
                </div>
              </div>
            </div>

            {!hasStandardAccess ? (
              <div className="bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 rounded-lg p-6 border border-red-200 dark:border-red-800">
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-red-600 rounded-lg flex-shrink-0">
                    <Lock className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      Premium feature
                    </h4>
                    <p className="text-sm text-gray-700 dark:text-gray-300 mb-4">
                      Get comprehensive insights into your digital footprint with detailed breakdowns, risk analysis, and personalized recommendations. Available on Premium or Family plans.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3">
                      <button
                        onClick={() => navigate('/pricing?plan=premium')}
                        className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
                      >
                        <Shield className="w-4 h-4" />
                        View Premium plans
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Full digital footprint analysis is available in the mobile app.
              </div>
            )}
          </div>

          {/* Priority Actions Preview */}
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 p-6 mb-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center">
                <Target className="w-5 h-5 mr-2 text-red-500" />
                Priority Actions
              </h2>
              {!isWorkflowComplete && (
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  Complete workflow to see personalized actions
                </span>
              )}
            </div>
            {isWorkflowComplete && hasAssessment ? (
              <div className="space-y-3">
                <div className="p-4 bg-gray-50 dark:bg-slate-700 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-red-100 text-red-600 rounded-full flex items-center justify-center flex-shrink-0">
                      <Shield className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900 dark:text-white">Review Settings</h3>
                      <p className="text-xs text-gray-500">Update preferences and privacy concerns</p>
                    </div>
                    <button
                      onClick={() => navigate('/settings')}
                      className="px-4 py-2 bg-red-500 text-white text-sm font-medium rounded-lg hover:bg-red-600 transition-all"
                    >
                      Edit
                    </button>
                  </div>
                </div>
                <div className="p-4 bg-gray-50 dark:bg-slate-700 rounded-lg opacity-75 border-2 border-dashed border-gray-300 dark:border-gray-600">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-yellow-100 text-yellow-600 rounded-full flex items-center justify-center flex-shrink-0">
                      <Zap className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900 dark:text-white">More Actions Available</h3>
                      <p className="text-xs text-gray-500">Full action plan in mobile app</p>
                    </div>
                    <span className="px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-600 dark:text-gray-400 text-sm font-medium rounded-lg flex items-center gap-1">
                      <Lock className="w-3 h-3" />
                      In App
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <Target className="w-12 h-12 text-gray-400 dark:text-gray-500 mx-auto mb-3" />
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                  {!isWorkflowComplete 
                    ? 'Complete your workflow to see personalized priority actions'
                    : 'Complete an assessment to see your personalized action plan'}
                </p>
                {!isWorkflowComplete ? (
                  <button
                    onClick={() => navigate('/service-catalog')}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all text-sm font-medium"
                  >
                    Start Workflow
                  </button>
                ) : (
                  <button
                    onClick={() => navigate('/assessment/full')}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all text-sm font-medium"
                  >
                    Take Assessment
                  </button>
                )}
              </div>
            )}
            <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <p className="text-xs text-blue-800 dark:text-blue-200">
                <Info className="w-3 h-3 inline mr-1" />
                Full action plan with personalized recommendations and progress tracking available in the mobile app.
              </p>
            </div>
          </div>

          {/* Web Preview notice - placed just above app download CTA */}
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl p-4 mb-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <h3 className="font-semibold text-yellow-900 dark:text-yellow-100 mb-1">
                  Web Preview - Limited Features
                </h3>
                <p className="text-sm text-yellow-800 dark:text-yellow-200 mb-2">
                  This is a preview of your dashboard. Some features are restricted on the web version. Download the mobile app for:
                </p>
                <ul className="text-sm text-yellow-800 dark:text-yellow-200 list-disc list-inside space-y-1">
                  <li>Full dashboard with all features</li>
                  <li>Push notifications for privacy alerts</li>
                  <li>Offline access to your data</li>
                  <li>Premium features (if subscribed)</li>
                  <li>Optimized mobile experience</li>
                </ul>
              </div>
            </div>
          </div>

          {/* App Download CTA - Full dashboard experience in the mobile app */}
          <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl shadow-xl p-4 sm:p-5 mb-6">
            <div className="flex flex-row flex-wrap items-center justify-between gap-3 sm:gap-4">
              <div className="flex items-center gap-2 min-w-0 flex-1">
                <Smartphone className="w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0" />
                <div className="min-w-0">
                  <p className="font-semibold text-sm sm:text-base leading-tight">Get the full dashboard experience in the mobile app</p>
                  <p className="text-xs text-purple-100 mt-0.5">Push notifications, offline access, and all premium features</p>
                </div>
              </div>
              <div className="flex gap-2 sm:gap-3 flex-shrink-0 items-center">
                <a
                  href={APP_STORE_IOS}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center flex-shrink-0 hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-transparent rounded overflow-hidden"
                  style={{ width: BADGE_WIDTH, height: BADGE_HEIGHT }}
                  aria-label="Download on the App Store"
                >
                  {!appStoreBadgeError ? (
                    <img
                      src={APP_STORE_BADGE_IMAGE}
                      alt="Download on the App Store"
                      role="presentation"
                      className="block w-full h-full object-contain object-center"
                      width={BADGE_WIDTH}
                      height={BADGE_HEIGHT}
                      loading="lazy"
                      onError={() => setAppStoreBadgeError(true)}
                    />
                  ) : (
                    <span className="text-[10px] font-semibold leading-tight px-2 text-center bg-black text-white rounded py-1.5 h-full flex items-center justify-center">
                      Download on the App Store
                    </span>
                  )}
                </a>
                <a
                  href={APP_STORE_ANDROID}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center flex-shrink-0 hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-transparent rounded overflow-hidden"
                  style={{ width: BADGE_WIDTH, height: BADGE_HEIGHT }}
                  aria-label="Get it on Google Play"
                >
                  {!googlePlayBadgeError ? (
                    <img
                      src={GOOGLE_PLAY_BADGE_IMAGE}
                      alt="Get it on Google Play"
                      role="presentation"
                      className="block w-full h-full object-contain object-center"
                      width={BADGE_WIDTH}
                      height={BADGE_HEIGHT}
                      loading="lazy"
                      onError={() => setGooglePlayBadgeError(true)}
                    />
                  ) : (
                    <span className="text-[10px] font-semibold leading-tight px-2 text-center uppercase bg-black text-white rounded py-1.5 h-full flex items-center justify-center">
                      Get it on Google Play
                    </span>
                  )}
                </a>
              </div>
            </div>
          </div>

        </div>
      </div>
    </>
  );
};

export default Dashboard;
