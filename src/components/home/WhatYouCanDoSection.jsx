import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ShoppingCart,
  Users,
  Target,
  LayoutDashboard,
  Wrench,
  Activity,
  ArrowRight
} from 'lucide-react';

/**
 * What You Can Do - Action-oriented cards to clarify next steps.
 * Used on Homepage (4 core actions) and How It Works (all actions).
 */
const WhatYouCanDoSection = ({ maxItems, className = '' }) => {
  const navigate = useNavigate();

  const features = [
    {
      icon: ShoppingCart,
      title: 'Browse & Monitor Services',
      description: 'Browse 200+ services with detailed privacy risk assessments, exposure scores, and data collection practices.',
      linkText: 'Browse Services',
      linkColor: 'text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300',
      action: () => navigate('/service-catalog'),
      iconColor: 'bg-red-500'
    },
    {
      icon: Users,
      title: 'Set Your Privacy Concerns',
      description: 'Set your privacy priorities across 4 focus areas for personalized recommendations.',
      linkText: 'Set Privacy Concerns',
      linkColor: 'text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300',
      action: () => navigate('/settings'),
      iconColor: 'bg-purple-500'
    },
    {
      icon: Target,
      title: 'Take a Privacy Assessment',
      description: 'Take comprehensive privacy assessments to understand your digital footprint and get personalized recommendations.',
      linkText: 'Take Assessment',
      linkColor: 'text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300',
      action: () => navigate('/assessment/full'),
      iconColor: 'bg-green-500'
    },
    {
      icon: LayoutDashboard,
      title: 'View Your Privacy Dashboard',
      description: 'Access your privacy dashboard with insights, recommendations, progress tracking, and digital footprint analysis.',
      linkText: 'View Dashboard',
      linkColor: 'text-orange-600 dark:text-orange-400 hover:text-orange-700 dark:hover:text-orange-300',
      action: () => navigate('/dashboard'),
      iconColor: 'bg-orange-500'
    },
    {
      icon: Activity,
      title: 'See Your Digital Footprint',
      description: 'Calculate your overall digital footprint exposure and get insights from all your selected services.',
      linkText: 'Learn More',
      linkColor: 'text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300',
      action: () => navigate('/pricing'),
      iconColor: 'bg-purple-500'
    },
    {
      icon: Wrench,
      title: 'Open the Privacy Toolkit',
      description: 'Access privacy tools, guides, and resources—including Privacy Radar and Trends—tailored to your concerns and risk level.',
      linkText: 'Open Toolkit',
      linkColor: 'text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300',
      action: () => navigate('/toolkit-access'),
      iconColor: 'bg-indigo-500'
    }
  ];

  const items = typeof maxItems === 'number' ? features.slice(0, maxItems) : features;

  return (
    <section className={`py-8 sm:py-10 md:py-12 bg-gradient-to-br from-gray-50 to-white dark:from-slate-900 dark:to-slate-800 ${className}`.trim()}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-6 sm:mb-8">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            What You Can Do
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Simple tools to help you understand and manage your privacy
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {items.map((feature, index) => {
            const FeatureIcon = feature.icon;
            return (
              <div
                key={index}
                className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-slate-700 hover:shadow-xl transition-all duration-300 flex flex-col"
              >
                <div className={`w-16 h-16 ${feature.iconColor} rounded-full flex items-center justify-center mx-auto mb-4`}>
                  <FeatureIcon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white text-center mb-3">
                  {feature.title}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 flex-grow text-center">
                  {feature.description}
                </p>
                <button
                  type="button"
                  onClick={feature.action}
                  className={`text-sm font-semibold ${feature.linkColor} flex items-center justify-center gap-1 transition-colors mt-auto`}
                >
                  {feature.linkText}
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default WhatYouCanDoSection;
