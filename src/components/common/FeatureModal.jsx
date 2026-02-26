import { useState } from 'react';
import { X, ArrowRight, Play, CheckCircle } from 'lucide-react';

const FeatureModal = ({ isOpen, onClose, feature }) => {
  if (!isOpen || !feature) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 dark:border-slate-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className={`w-12 h-12 bg-gradient-to-br ${feature.gradient} rounded-xl flex items-center justify-center mr-4 shadow-lg`}>
                <feature.icon className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {feature.title}
                </h2>
                <p className="text-gray-600 dark:text-gray-300">
                  {feature.subtitle}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-400" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Overview */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
              How it works
            </h3>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              {feature.detailedDescription}
            </p>
          </div>

          {/* Key Benefits */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
              Key Benefits
            </h3>
            <div className="space-y-3">
              {feature.benefits.map((benefit, index) => (
                <div key={index} className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700 dark:text-gray-300">{benefit}</span>
                </div>
              ))}
            </div>
          </div>

          {/* How to Access */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
              How to Access
            </h3>
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
              <p className="text-blue-800 dark:text-blue-200 text-sm">
                {feature.howToAccess}
              </p>
            </div>
          </div>

          {/* Example Use Cases */}
          {feature.examples && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                Example Use Cases
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {feature.examples.map((example, index) => (
                  <div key={index} className="p-3 bg-gray-50 dark:bg-slate-700 rounded-lg">
                    <h4 className="font-medium text-gray-900 dark:text-white text-sm mb-1">
                      {example.title}
                    </h4>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      {example.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="p-6 border-t border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-700/50">
          <div className="flex space-x-4">
            {feature.primaryAction && (
              <button
                type="button"
                onClick={feature.primaryAction.onClick || (() => {})}
                className={`flex-1 px-6 py-3 bg-gradient-to-r ${feature.gradient} text-white font-semibold rounded-lg hover:shadow-lg transition-all transform hover:scale-105 flex items-center justify-center`}
              >
                {feature.primaryAction.icon && <feature.primaryAction.icon className="w-4 h-4 mr-2" />}
                {feature.primaryAction.label}
                <ArrowRight className="w-4 h-4 ml-2" />
              </button>
            )}
            {feature.secondaryAction && (
              <button
                type="button"
                onClick={feature.secondaryAction.onClick || (() => {})}
                className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-semibold rounded-lg hover:bg-gray-100 dark:hover:bg-slate-600 transition-colors"
              >
                {feature.secondaryAction.label}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeatureModal;