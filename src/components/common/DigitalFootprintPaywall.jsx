/**
 * Digital Footprint Analyzer Paywall
 * 
 * Shows:
 * - Categories + service counts (free)
 * - Locked broker exposure + removal steps
 * - CTA: "Remove Yourself from Data Brokers"
 */

import React from 'react';
import { Database, Users, ShoppingCart, MessageCircle, Film, Globe, Shield, Lock } from 'lucide-react';
import Paywall from './Paywall';

const DigitalFootprintPaywall = ({ categoryBreakdown = [], brokerExposure = null, removalSteps = [] }) => {
  const categoryIcons = {
    'social-media': Users,
    'shopping': ShoppingCart,
    'messaging': MessageCircle,
    'streaming': Film,
    'search-email': Globe,
    'cloud-storage': Database,
    'financial': Shield
  };

  // Free preview: Categories + service counts
  const freePreview = (
    <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-gray-200 dark:border-slate-700 p-6">
      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
        Your Digital Footprint by Category
      </h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {categoryBreakdown.map(({ category, count, label }) => {
          const Icon = categoryIcons[category] || Database;
          return (
            <div key={category} className="bg-gray-50 dark:bg-slate-700/50 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-2">
                <Icon className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                  {label || category}
                </span>
              </div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {count}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                service{count !== 1 ? 's' : ''}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  // Locked content: Broker exposure + removal steps
  const lockedContent = (
    <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-gray-200 dark:border-slate-700 p-6 space-y-4">
      {/* Broker Exposure */}
      {brokerExposure && (
        <div>
          <h4 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
            <Lock className="w-5 h-5 text-red-600 dark:text-red-400" />
            Data Broker Exposure
          </h4>
          <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-4 border border-red-200 dark:border-red-800">
            <p className="text-sm text-red-900 dark:text-red-100 mb-2">
              {brokerExposure.message || 'Your personal information may be available on data broker sites.'}
            </p>
            {brokerExposure.count && (
              <p className="text-lg font-bold text-red-600 dark:text-red-400">
                {brokerExposure.count} broker{brokerExposure.count !== 1 ? 's' : ''} may have your data
              </p>
            )}
          </div>
        </div>
      )}

      {/* Removal Steps */}
      {removalSteps.length > 0 && (
        <div>
          <h4 className="font-semibold text-gray-900 dark:text-white mb-3">
            Step-by-Step Removal Guide
          </h4>
          <div className="space-y-3">
            {removalSteps.map((step, idx) => (
              <div key={idx} className="flex items-start gap-3 bg-gray-50 dark:bg-slate-700/50 rounded-lg p-3">
                <div className="flex-shrink-0 w-8 h-8 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
                  <span className="text-sm font-bold text-red-600 dark:text-red-400">{idx + 1}</span>
                </div>
                <div>
                  <h5 className="font-medium text-gray-900 dark:text-white">{step.title}</h5>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* What's Included */}
      <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
        <h5 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
          What's Included in the Toolkit:
        </h5>
        <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
          <li>• Complete removal guide</li>
          <li>• Email templates for removal requests</li>
          <li>• Tracking checklist for major brokers</li>
          <li>• Best practices and tips</li>
        </ul>
      </div>
    </div>
  );

  return (
    <Paywall
      productId="broker_removal_kit"
      freePreview={freePreview}
      lockedContent={lockedContent}
      ctaText="Remove Yourself from Data Brokers"
      compact={false}
    />
  );
};

export default DigitalFootprintPaywall;
