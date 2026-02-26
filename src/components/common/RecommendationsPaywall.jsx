/**
 * Recommendations Paywall
 * 
 * Shows:
 * - 3 generic tips (free)
 * - Locked ordered action list
 * - CTA: "Get Your 30-Day Privacy Action Plan"
 */

import React from 'react';
import { Lightbulb, CheckCircle, Clock, Target } from 'lucide-react';
import Paywall from './Paywall';

const RecommendationsPaywall = ({ genericTips = [], orderedActions = [] }) => {
  // Default generic tips if none provided
  const defaultTips = [
    {
      icon: Shield,
      title: 'Review Privacy Settings Regularly',
      description: 'Check and update privacy settings on your most-used services at least quarterly.'
    },
    {
      icon: Lock,
      title: 'Use Strong, Unique Passwords',
      description: 'A password manager helps you create and store strong passwords for all accounts.'
    },
    {
      icon: Target,
      title: 'Enable Two-Factor Authentication',
      description: 'Add an extra layer of security to your most important accounts.'
    }
  ];

  const tips = genericTips.length > 0 ? genericTips : defaultTips;

  // Free preview: 3 generic tips
  const freePreview = (
    <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-gray-200 dark:border-slate-700 p-6">
      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
        <Lightbulb className="w-5 h-5 text-yellow-500" />
        Privacy Tips
      </h3>
      <div className="space-y-3">
        {tips.slice(0, 3).map((tip, idx) => {
          const Icon = tip.icon || Lightbulb;
          return (
            <div key={idx} className="bg-gray-50 dark:bg-slate-700/50 rounded-lg p-3">
              <div className="flex items-start gap-3">
                <Icon className="w-5 h-5 text-gray-600 dark:text-gray-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white mb-1">
                    {tip.title}
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    {tip.description}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  // Locked content: Ordered action list
  const lockedContent = (
    <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-gray-200 dark:border-slate-700 p-6">
      <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
        <Target className="w-5 h-5 text-blue-600 dark:text-blue-400" />
        Your Personalized 30-Day Action Plan
      </h4>
      
      {orderedActions.length > 0 ? (
        <div className="space-y-3">
          {orderedActions.map((action, idx) => (
            <div key={idx} className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-600 dark:bg-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-sm font-bold text-white">{idx + 1}</span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h5 className="font-semibold text-blue-900 dark:text-blue-100">
                      {action.title}
                    </h5>
                    {action.week && (
                      <span className="text-xs bg-blue-200 dark:bg-blue-800 text-blue-900 dark:text-blue-100 px-2 py-1 rounded">
                        Week {action.week}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-blue-800 dark:text-blue-200 mb-2">
                    {action.description}
                  </p>
                  <div className="flex items-center gap-4 text-xs text-blue-700 dark:text-blue-300">
                    {action.effort && (
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {action.effort}
                      </span>
                    )}
                    {action.impact && (
                      <span className="flex items-center gap-1">
                        <Target className="w-3 h-3" />
                        Impact: {action.impact}
                      </span>
                    )}
                  </div>
                  {action.steps && action.steps.length > 0 && (
                    <div className="mt-2 space-y-1">
                      {action.steps.slice(0, 3).map((step, stepIdx) => (
                        <div key={stepIdx} className="flex items-start gap-2 text-xs text-blue-700 dark:text-blue-300">
                          <CheckCircle className="w-3 h-3 mt-0.5 flex-shrink-0" />
                          <span>{step}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <p className="text-gray-600 dark:text-gray-400">
            Your personalized action plan will include:
          </p>
          <ul className="mt-4 text-sm text-gray-600 dark:text-gray-400 space-y-2">
            <li>• Week-by-week action checklist</li>
            <li>• Effort and impact markers</li>
            <li>• Step-by-step instructions</li>
            <li>• Tool recommendations</li>
          </ul>
        </div>
      )}

      {/* What's Included */}
      <div className="mt-6 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
        <h5 className="font-semibold text-gray-900 dark:text-white mb-2">
          What's Included:
        </h5>
        <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
          <li>✓ 4-week structured action plan</li>
          <li>✓ Priority actions based on your assessment</li>
          <li>✓ Effort and impact ratings</li>
          <li>✓ Tool references and resources</li>
        </ul>
      </div>
    </div>
  );

  return (
    <Paywall
      productId="action_plan_30d"
      freePreview={freePreview}
      lockedContent={lockedContent}
      ctaText="Get Your 30-Day Privacy Action Plan"
      compact={false}
    />
  );
};

// Import Shield and Lock for default tips
import { Shield, Lock } from 'lucide-react';

export default RecommendationsPaywall;
