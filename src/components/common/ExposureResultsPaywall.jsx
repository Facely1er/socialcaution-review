/**
 * Exposure Results Paywall
 * 
 * Shows:
 * - Overall score + 1 insight (free)
 * - Blurred detailed risks + actions (locked)
 * - CTA: "Download Full Privacy Audit"
 */

import React from 'react';
import { AlertTriangle, TrendingUp, Shield } from 'lucide-react';
import Paywall from './Paywall';

const ExposureResultsPaywall = ({ exposureScore, topRisk = null, detailedRisks = [], actions = [] }) => {
  // Free preview: Score + 1 insight
  const freePreview = (
    <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-gray-200 dark:border-slate-700 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white">
          Your Privacy Exposure Score
        </h3>
        <div className={`text-4xl font-bold ${
          exposureScore >= 70 ? 'text-red-600 dark:text-red-400' :
          exposureScore >= 50 ? 'text-orange-600 dark:text-orange-400' :
          exposureScore >= 30 ? 'text-yellow-600 dark:text-yellow-400' :
          'text-green-600 dark:text-green-400'
        }`}>
          {exposureScore}/100
        </div>
      </div>
      
      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 mb-4">
        <div
          className={`h-3 rounded-full ${
            exposureScore >= 70 ? 'bg-red-600' :
            exposureScore >= 50 ? 'bg-orange-600' :
            exposureScore >= 30 ? 'bg-yellow-600' :
            'bg-green-600'
          }`}
          style={{ width: `${exposureScore}%` }}
        />
      </div>

      {/* One free insight */}
      {topRisk && (
        <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-4 border border-red-200 dark:border-red-800">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold text-red-900 dark:text-red-100 mb-1">
                Top Risk: {topRisk.name || 'High Exposure Service'}
              </h4>
              <p className="text-sm text-red-800 dark:text-red-200">
                {topRisk.description || 'This service has a high privacy exposure index and may pose significant risks to your privacy.'}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  // Locked content: Detailed risks + actions
  const lockedContent = (
    <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-gray-200 dark:border-slate-700 p-6 space-y-4">
      {/* Detailed Risks */}
      {detailedRisks.length > 0 && (
        <div>
          <h4 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Detailed Risk Breakdown
          </h4>
          <div className="space-y-2">
            {detailedRisks.map((risk, idx) => (
              <div key={idx} className="bg-gray-50 dark:bg-slate-700/50 rounded-lg p-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-medium text-gray-900 dark:text-white">{risk.name}</span>
                  <span className="text-sm text-gray-600 dark:text-gray-400">{risk.exposure}/100</span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300">{risk.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Priority Actions */}
      {actions.length > 0 && (
        <div>
          <h4 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Priority Actions
          </h4>
          <div className="space-y-2">
            {actions.map((action, idx) => (
              <div key={idx} className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3 border border-blue-200 dark:border-blue-800">
                <div className="flex items-start gap-2">
                  <span className="font-bold text-blue-600 dark:text-blue-400">{idx + 1}.</span>
                  <div>
                    <h5 className="font-medium text-blue-900 dark:text-blue-100">{action.title}</h5>
                    <p className="text-sm text-blue-800 dark:text-blue-200 mt-1">{action.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  return (
    <Paywall
      productId="privacy_audit_pdf"
      freePreview={freePreview}
      lockedContent={lockedContent}
      ctaText="Download Full Privacy Audit"
      compact={false}
    />
  );
};

export default ExposureResultsPaywall;
