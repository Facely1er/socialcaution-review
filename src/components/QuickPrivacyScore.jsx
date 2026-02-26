import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, TrendingUp, TrendingDown, Info, Download, Share2, ChevronDown, ChevronUp, AlertTriangle, CheckCircle, ArrowRight, BarChart3 } from 'lucide-react';
import { calculateQuickPrivacyScore, compareToAverage, getScoreSummaryText } from '../utils/quickPrivacyScore';
import { generateServicePrivacyReport } from '../utils/pdfReportGenerator';
import { useNotifications } from './common/NotificationSystem';
import { useTranslation } from '../contexts/TranslationContext';

/**
 * Quick Privacy Score Widget
 * Displays aggregate privacy score for selected services
 */
const QuickPrivacyScore = ({ selectedServiceIds = [] }) => {
  const navigate = useNavigate();
  const { showSuccess, showInfo } = useNotifications();
  const { t } = useTranslation();
  const [showDetails, setShowDetails] = useState(false);
  const [isMainContentExpanded, setIsMainContentExpanded] = useState(false);

  // Calculate score
  const scoreData = calculateQuickPrivacyScore(selectedServiceIds);
  
  if (!scoreData) {
    return null; // Don't show if no services selected
  }

  const {
    overallScore,
    level,
    totalServices,
    riskLevelCounts,
    categoryBreakdown,
    topConcerns,
    quickWins,
    potentialImprovement
  } = scoreData;

  // Get comparison to average
  const comparison = compareToAverage(overallScore, totalServices);

  // Handle share
  const handleShare = async () => {
    const shareText = getScoreSummaryText(scoreData);
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'My Privacy Exposure Score',
          text: shareText
        });
        showSuccess('Shared successfully!');
      } catch (err) {
        // User cancelled or error
        if (err.name !== 'AbortError') {
          console.error('Share failed:', err);
        }
      }
    } else {
      // Fallback: copy to clipboard
      try {
        await navigator.clipboard.writeText(shareText);
        showInfo('Score summary copied to clipboard!');
      } catch (err) {
        console.error('Copy failed:', err);
        showInfo('Unable to share. Please try again.');
      }
    }
  };

  // Handle export
  const handleExport = async () => {
    try {
      const fileName = await generateServicePrivacyReport(selectedServiceIds);
      showSuccess(`Full privacy report exported as ${fileName}!`, { duration: 5000 });
    } catch (error) {
      console.error('PDF export failed:', error);
      showInfo('Unable to export report. Please try again.', { duration: 3000 });
    }
  };

  // Score color based on level
  const getScoreColor = () => {
    if (overallScore >= 70) return 'text-red-600 dark:text-red-400';
    if (overallScore >= 50) return 'text-orange-600 dark:text-orange-400';
    if (overallScore >= 30) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-green-600 dark:text-green-400';
  };

  const getScoreBgColor = () => {
    if (overallScore >= 70) return 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-700';
    if (overallScore >= 50) return 'bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-700';
    if (overallScore >= 30) return 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-700';
    return 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-700';
  };

  return (
    <div className={`rounded-xl border-2 ${getScoreBgColor()} p-6 mb-6 transition-all`}>
      {/* Header - Collapsible */}
      <button
        onClick={() => setIsMainContentExpanded(!isMainContentExpanded)}
        className="w-full flex items-start justify-between mb-4 focus:outline-none focus:ring-2 focus:ring-orange-500 rounded-lg p-2 -m-2 transition-colors hover:bg-white/30 dark:hover:bg-gray-700/30"
        aria-expanded={isMainContentExpanded}
        type="button"
      >
        <div className="flex items-center gap-3">
          <div className={`p-3 rounded-full ${level.bgColor}`}>
            <Shield className={`w-6 h-6 ${level.textColor}`} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white text-left">
              {t('serviceCatalog.privacyExposureScore.title')}
            </h3>
            <div className="flex items-center gap-2">
              <p className="text-sm text-gray-600 dark:text-gray-400 text-left">
                {t('serviceCatalog.privacyExposureScore.aggregateScore', {
                  count: totalServices,
                  plural: totalServices !== 1 ? 's' : ''
                })}
              </p>
              {!isMainContentExpanded && (
                <>
                  <span className="text-gray-400 dark:text-gray-500">•</span>
                  <span className={`text-sm font-bold ${getScoreColor()}`}>
                    {overallScore}/100
                  </span>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${level.bgColor}`}>
                    <span className={level.textColor}>{level.level}</span>
                  </span>
                </>
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {isMainContentExpanded && (
            <div className="flex gap-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleShare();
                }}
                className="p-2 rounded-lg hover:bg-white/50 dark:hover:bg-gray-700/50 transition-colors"
                title="Share score"
                type="button"
              >
                <Share2 className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleExport();
                }}
                className="p-2 rounded-lg hover:bg-white/50 dark:hover:bg-gray-700/50 transition-colors"
                title="Export score"
                type="button"
              >
                <Download className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </button>
            </div>
          )}
          <div className="flex items-center gap-2">
            {!isMainContentExpanded && (
              <span className="text-xs text-gray-500 dark:text-gray-400 hidden sm:inline">
                {t('serviceCatalog.privacyExposureScore.clickToExpand')}
              </span>
            )}
            {isMainContentExpanded ? (
              <ChevronUp className="w-6 h-6 text-gray-600 dark:text-gray-400 flex-shrink-0 transition-transform" />
            ) : (
              <ChevronDown className="w-6 h-6 text-gray-600 dark:text-gray-400 flex-shrink-0 transition-transform" />
            )}
          </div>
        </div>
      </button>

      {/* Main Content - Collapsible */}
      <div className={`overflow-hidden transition-all duration-300 ease-in-out ${
        isMainContentExpanded ? 'max-h-[3000px] opacity-100' : 'max-h-0 opacity-0'
      }`}>
        <div className={isMainContentExpanded ? 'block' : 'hidden'}>
      {/* Score Display */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex-1">
          <div className={`text-5xl font-bold ${getScoreColor()} mb-2`}>
            {overallScore}
            <span className="text-2xl text-gray-500 dark:text-gray-400">/100</span>
          </div>
          <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full ${level.bgColor}`}>
            <span className={`text-sm font-semibold ${level.textColor}`}>
              {level.level} Exposure
            </span>
          </div>
        </div>

        {/* Score Gauge */}
        <div className="flex-1 max-w-xs">
          <div className="relative pt-1">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-gray-600 dark:text-gray-400">
                Exposure Level
              </span>
            </div>
            <div className="overflow-hidden h-3 text-xs flex rounded-full bg-gray-200 dark:bg-gray-700">
              <div
                style={{ width: `${overallScore}%` }}
                className={`shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center transition-all ${level.barColor}`}
              />
            </div>
            <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
              <span>0</span>
              <span>Low</span>
              <span>Med</span>
              <span>High</span>
              <span>100</span>
            </div>
          </div>
        </div>
      </div>

      {/* Comparison to Average */}
      <div className="mb-4 p-3 bg-white/50 dark:bg-gray-800/50 rounded-lg">
        <div className="flex items-center gap-2">
          {comparison.status === 'better' ? (
            <TrendingDown className="w-4 h-4 text-green-600 dark:text-green-400" />
          ) : comparison.status === 'worse' ? (
            <TrendingUp className="w-4 h-4 text-red-600 dark:text-red-400" />
          ) : (
            <Info className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          )}
          <p className="text-sm text-gray-700 dark:text-gray-300">
            {comparison.message}
          </p>
        </div>
      </div>

      {/* Risk Distribution */}
      <div className="grid grid-cols-4 gap-2 mb-4">
        {riskLevelCounts.veryHigh > 0 && (
          <div className="text-center p-2 bg-red-100 dark:bg-red-900/30 rounded-lg">
            <div className="text-2xl font-bold text-red-700 dark:text-red-300">
              {riskLevelCounts.veryHigh}
            </div>
            <div className="text-xs text-red-600 dark:text-red-400">Very High</div>
          </div>
        )}
        {riskLevelCounts.high > 0 && (
          <div className="text-center p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
            <div className="text-2xl font-bold text-orange-700 dark:text-orange-300">
              {riskLevelCounts.high}
            </div>
            <div className="text-xs text-orange-600 dark:text-orange-400">High</div>
          </div>
        )}
        {riskLevelCounts.medium > 0 && (
          <div className="text-center p-2 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg">
            <div className="text-2xl font-bold text-yellow-700 dark:text-yellow-300">
              {riskLevelCounts.medium}
            </div>
            <div className="text-xs text-yellow-600 dark:text-yellow-400">Medium</div>
          </div>
        )}
        {riskLevelCounts.low > 0 && (
          <div className="text-center p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
            <div className="text-2xl font-bold text-green-700 dark:text-green-300">
              {riskLevelCounts.low}
            </div>
            <div className="text-xs text-green-600 dark:text-green-400">Low</div>
          </div>
        )}
      </div>

      {/* Top Concerns - Always Visible */}
      {topConcerns.length > 0 && (
        <div className="mb-4">
          <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4" />
            Top Privacy Concerns
          </h4>
          <div className="space-y-2">
            {topConcerns.map((concern, idx) => (
              <div key={concern.id} className="flex items-center justify-between p-2 bg-white/70 dark:bg-gray-800/70 rounded-lg">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    #{idx + 1}
                  </span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {concern.name}
                  </span>
                </div>
                <div className={`px-2 py-1 rounded text-xs font-bold ${concern.level.textColor} ${concern.level.bgColor}`}>
                  {concern.exposureIndex}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quick Wins */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <h4 className="text-sm font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />
            Quick Wins
            {potentialImprovement > 0 && (
              <span className="text-xs text-green-600 dark:text-green-400">
                (up to -{potentialImprovement} points)
              </span>
            )}
          </h4>
        </div>
        <div className="space-y-2">
          {quickWins.slice(0, 3).map((win, idx) => (
            <div key={idx} className="flex items-start gap-2 p-2 bg-white/70 dark:bg-gray-800/70 rounded-lg">
              <span className="text-lg flex-shrink-0">{win.icon}</span>
              <div className="flex-1">
                <div className="text-sm font-medium text-gray-900 dark:text-white">
                  {win.title}
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400">
                  {win.description}
                </div>
              </div>
              {win.potentialReduction > 0 && (
                <span className="text-xs font-bold text-green-600 dark:text-green-400 flex-shrink-0">
                  -{win.potentialReduction}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Expand for Details */}
      <button
        onClick={() => setShowDetails(!showDetails)}
        className="w-full flex items-center justify-center gap-2 p-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-white/50 dark:hover:bg-gray-800/50 rounded-lg transition-colors"
        type="button"
      >
        {showDetails ? (
          <>
            <ChevronUp className="w-4 h-4" />
            Hide Details
          </>
        ) : (
          <>
            <ChevronDown className="w-4 h-4" />
            Show Category Breakdown
          </>
        )}
      </button>

      {/* Detailed Breakdown - Collapsible */}
      {showDetails && (
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
            Exposure by Category
          </h4>
          <div className="space-y-2">
            {Object.entries(categoryBreakdown)
              .sort((a, b) => b[1].avgExposure - a[1].avgExposure)
              .map(([category, data]) => (
                <div key={category} className="flex items-center justify-between p-2 bg-white/70 dark:bg-gray-800/70 rounded-lg">
                  <div className="flex-1">
                    <div className="text-sm font-medium text-gray-900 dark:text-white capitalize">
                      {category.replace('-', ' ')}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {data.count} service{data.count !== 1 ? 's' : ''}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-24 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${
                          data.avgExposure >= 70 ? 'bg-red-500' :
                          data.avgExposure >= 50 ? 'bg-orange-500' :
                          data.avgExposure >= 30 ? 'bg-yellow-500' :
                          'bg-green-500'
                        }`}
                        style={{ width: `${data.avgExposure}%` }}
                      />
                    </div>
                    <span className="text-sm font-bold text-gray-700 dark:text-gray-300 w-8 text-right">
                      {data.avgExposure}
                    </span>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

          {/* View Digital Footprint CTA */}
          <div className="mt-6 pt-4 border-t border-orange-200 dark:border-orange-700">
            <button
              onClick={() => navigate('/exposure-dashboard')}
              className="w-full sm:w-auto px-5 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all font-semibold flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
              type="button"
            >
              <BarChart3 className="w-5 h-5" />
              {t('serviceCatalog.viewDashboard')}
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickPrivacyScore;

