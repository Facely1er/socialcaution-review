/**
 * Limit Display Component
 * Shows current usage vs limits for free tier users
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertTriangle, CheckCircle, BarChart3, FileText, Database, Sparkles } from 'lucide-react';
import { getAssessmentLimit, canCreateAssessment } from '../../utils/featureGating';
import { getExportLimit, getExportCount } from '../../utils/exportLimits';
import { canAddService, getTrackedServicesCount, getUserTier } from '../../utils/serviceLimitChecker';
import offlineStorage from '../../utils/offlineStorage';
import { PRODUCTS } from '../../config/stripe';
import { useTranslation } from '../../contexts/TranslationContext';

const LimitDisplay = ({ compact = false, showUpgradeButton = true }) => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [userTier, setUserTier] = useState('free');
  const [limits, setLimits] = useState({
    assessments: { current: 0, limit: 3, remaining: 3 },
    exports: { pdf: { current: 0, limit: 1 }, excel: { current: 0, limit: 0 }, json: { current: 0, limit: 0 } },
    services: { current: 0, limit: 5, remaining: 5 }
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadLimits = async () => {
      try {
        const tier = getUserTier();
        setUserTier(tier);

        // Get assessment count for current month
        const assessmentLimit = getAssessmentLimit(tier);
        let assessmentCount = 0;
        if (assessmentLimit !== -1) {
          try {
            const assessments = await offlineStorage.getAssessments();
            const currentMonth = new Date().getMonth();
            const currentYear = new Date().getFullYear();
            const thisMonthAssessments = assessments.filter(assessment => {
              const assessmentDate = new Date(assessment.completedAt || assessment.createdAt);
              return assessmentDate.getMonth() === currentMonth && 
                     assessmentDate.getFullYear() === currentYear;
            });
            assessmentCount = thisMonthAssessments.length;
          } catch (error) {
            // Fallback: check if there are any results in localStorage
            const storedResults = localStorage.getItem('socialcaution_results');
            if (storedResults) {
              assessmentCount = 1;
            }
          }
        }

        // Get export counts
        const pdfCount = getExportCount(tier, 'pdf');
        const excelCount = getExportCount(tier, 'excel');
        const jsonCount = getExportCount(tier, 'json');

        // Get service count
        const serviceCheck = canAddService(tier);
        const serviceCount = serviceCheck.current;

        setLimits({
          assessments: {
            current: assessmentCount,
            limit: assessmentLimit === -1 ? -1 : assessmentLimit,
            remaining: assessmentLimit === -1 ? null : Math.max(0, assessmentLimit - assessmentCount)
          },
          exports: {
            pdf: {
              current: pdfCount,
              limit: getExportLimit(tier, 'pdf')
            },
            excel: {
              current: excelCount,
              limit: getExportLimit(tier, 'excel')
            },
            json: {
              current: jsonCount,
              limit: getExportLimit(tier, 'json')
            }
          },
          services: {
            current: serviceCount,
            limit: serviceCheck.limit,
            remaining: serviceCheck.remaining
          }
        });
      } catch (error) {
        console.error('Error loading limits:', error);
      } finally {
        setLoading(false);
      }
    };

    loadLimits();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-4">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Don't show limits for premium/family users
  if (userTier !== 'free') {
    return null;
  }

  const hasReachedAnyLimit = 
    (limits.assessments.limit !== -1 && limits.assessments.remaining === 0) ||
    (limits.services.limit !== -1 && limits.services.remaining === 0) ||
    (limits.exports.pdf.limit !== -1 && limits.exports.pdf.current >= limits.exports.pdf.limit);

  const isApproachingLimit = (current, limit, remaining) => {
    if (limit === -1) return false;
    const percentage = (current / limit) * 100;
    return percentage >= 80 && remaining > 0;
  };

  const getLimitColor = (current, limit, remaining) => {
    if (limit === -1) return 'text-green-600 dark:text-green-400';
    if (remaining === 0) return 'text-red-600 dark:text-red-400';
    if (isApproachingLimit(current, limit, remaining)) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-gray-600 dark:text-gray-400';
  };

  const getLimitIcon = (current, limit, remaining) => {
    if (limit === -1) return <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />;
    if (remaining === 0) return <AlertTriangle className="w-4 h-4 text-red-600 dark:text-red-400" />;
    if (isApproachingLimit(current, limit, remaining)) return <AlertTriangle className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />;
    return <CheckCircle className="w-4 h-4 text-gray-400" />;
  };

  if (compact) {
    return (
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3 text-sm">
        <div className="flex items-center justify-between mb-2">
          <span className="font-medium text-blue-900 dark:text-blue-100">Usage Limits</span>
          {showUpgradeButton && (
            <button
              onClick={() => navigate('/pricing')}
              className="text-blue-600 dark:text-blue-400 hover:underline text-xs font-medium"
            >
              Upgrade
            </button>
          )}
        </div>
        <div className="space-y-1 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-blue-800 dark:text-blue-200">Assessments:</span>
            <span className={getLimitColor(limits.assessments.current, limits.assessments.limit, limits.assessments.remaining)}>
              {limits.assessments.current}/{limits.assessments.limit === -1 ? '∞' : limits.assessments.limit}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-blue-800 dark:text-blue-200">Services:</span>
            <span className={getLimitColor(limits.services.current, limits.services.limit, limits.services.remaining)}>
              {limits.services.current}/{limits.services.limit === -1 ? '∞' : limits.services.limit}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-blue-800 dark:text-blue-200">PDF Exports:</span>
            <span className={getLimitColor(limits.exports.pdf.current, limits.exports.pdf.limit, limits.exports.pdf.limit - limits.exports.pdf.current)}>
              {limits.exports.pdf.current}/{limits.exports.pdf.limit === -1 ? '∞' : limits.exports.pdf.limit}
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
          <BarChart3 className="w-5 h-5 mr-2" />
          Usage Limits
        </h3>
        {showUpgradeButton && (
          <button
            onClick={() => navigate('/pricing')}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
          >
            <Sparkles className="w-4 h-4 mr-1" />
            Upgrade to Premium
          </button>
        )}
      </div>

      <div className="space-y-4">
        {/* Assessments */}
        <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
          <div className="flex items-center">
            {getLimitIcon(limits.assessments.current, limits.assessments.limit, limits.assessments.remaining)}
            <span className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300">Privacy Assessments</span>
          </div>
          <div className="text-right">
            <div className={`text-sm font-semibold ${getLimitColor(limits.assessments.current, limits.assessments.limit, limits.assessments.remaining)}`}>
              {limits.assessments.current} / {limits.assessments.limit === -1 ? 'Unlimited' : limits.assessments.limit}
            </div>
            {limits.assessments.limit !== -1 && limits.assessments.remaining !== null && (
              <div className="text-xs text-gray-500 dark:text-gray-400">
                {limits.assessments.remaining} remaining this month
              </div>
            )}
          </div>
        </div>

        {/* Services */}
        <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
          <div className="flex items-center">
            {getLimitIcon(limits.services.current, limits.services.limit, limits.services.remaining)}
            <span className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300">Services Tracked</span>
          </div>
          <div className="text-right">
            <div className={`text-sm font-semibold ${getLimitColor(limits.services.current, limits.services.limit, limits.services.remaining)}`}>
              {limits.services.current} / {limits.services.limit === -1 ? 'Unlimited' : limits.services.limit}
            </div>
            {limits.services.limit !== -1 && limits.services.remaining !== null && (
              <div className="text-xs text-gray-500 dark:text-gray-400">
                {limits.services.remaining} remaining
              </div>
            )}
          </div>
        </div>

        {/* PDF Exports */}
        <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
          <div className="flex items-center">
            {getLimitIcon(limits.exports.pdf.current, limits.exports.pdf.limit, limits.exports.pdf.limit - limits.exports.pdf.current)}
            <span className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300">PDF Exports</span>
          </div>
          <div className="text-right">
            <div className={`text-sm font-semibold ${getLimitColor(limits.exports.pdf.current, limits.exports.pdf.limit, limits.exports.pdf.limit - limits.exports.pdf.current)}`}>
              {limits.exports.pdf.current} / {limits.exports.pdf.limit === -1 ? 'Unlimited' : limits.exports.pdf.limit}
            </div>
            {limits.exports.pdf.limit !== -1 && (
              <div className="text-xs text-gray-500 dark:text-gray-400">
                {limits.exports.pdf.limit - limits.exports.pdf.current} remaining this month
              </div>
            )}
          </div>
        </div>

        {/* Excel/JSON Exports */}
        {limits.exports.excel.limit === 0 && (
          <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900/50 rounded-lg opacity-60">
            <div className="flex items-center">
              <AlertTriangle className="w-4 h-4 text-gray-400" />
              <span className="ml-2 text-sm font-medium text-gray-500 dark:text-gray-400">Excel/JSON Exports</span>
            </div>
            <div className="text-right">
              <div className="text-sm font-semibold text-gray-400">Not Available</div>
              <div className="text-xs text-gray-400">Upgrade for access</div>
            </div>
          </div>
        )}
      </div>

      {hasReachedAnyLimit && (
        <div className="mt-4 space-y-3">
          {limits.services.limit !== -1 && limits.services.remaining === 0 && (
            <div className="p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
              <p className="text-sm text-blue-800 dark:text-blue-200">
                <strong>Service limit reached!</strong> You can swap services by removing one and adding another. Your limit is {limits.services.limit} services at a time.
              </p>
            </div>
          )}
          <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
            <p className="text-sm text-yellow-800 dark:text-yellow-200">
              <strong>Limit reached!</strong> Upgrade to Premium for unlimited access to all features.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default LimitDisplay;

