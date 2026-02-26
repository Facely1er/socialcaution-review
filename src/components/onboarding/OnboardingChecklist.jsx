/**
 * Onboarding Checklist Component
 * 
 * Onboarding Implementation
 * Based on: COMMON_ONBOARDING_FLOW.md v1.0.0
 * Pattern: Checklist
 * 
 * Product: SocialCaution
 * Last Updated: 2025-11-XX
 * 
 * Privacy by Design: All data stays local, no server calls
 */

import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { OnboardingService } from '../../services/onboardingService';
import { Check, Circle, ArrowRight, FileCheck, BarChart3, Shield, Eye } from 'lucide-react';

const checklistItems = [
  {
    id: 'complete-privacy-assessment',
    title: 'Complete Privacy Assessment',
    description: 'Understand your privacy exposure and rights',
    route: '/assessment',
    icon: FileCheck,
  },
  {
    id: 'explore-dashboard',
    title: 'Explore Your Dashboard',
    description: 'View personalized privacy insights',
    route: '/dashboard',
    icon: BarChart3,
  },
  {
    id: 'review-privacy-tools',
    title: 'Review Privacy Tools',
    description: 'Access tools to protect your privacy',
    route: '/privacy-tools',
    icon: Shield,
  },
  {
    id: 'setup-privacy-settings',
    title: 'Set Up Privacy Settings',
    description: 'Configure your privacy preferences',
    route: '/privacy-settings',
    icon: Eye,
  },
];

export const OnboardingChecklist = () => {
  const navigate = useNavigate();
  const [checklist, setChecklist] = useState(checklistItems.map(item => ({ ...item, completed: false })));
  const [progress, setProgress] = useState(0);

  const checkCompletionStatus = useCallback(async () => {
    try {
      const progressData = await OnboardingService.getOnboardingProgress();
      
      setChecklist((prev) =>
        prev.map((item) => {
          switch (item.id) {
            case 'complete-privacy-assessment':
              return { ...item, completed: progressData.checklistItems.completePrivacyAssessment };
            case 'explore-dashboard':
              return { ...item, completed: progressData.checklistItems.exploreDashboard };
            case 'review-privacy-tools':
              return { ...item, completed: progressData.checklistItems.reviewPrivacyTools };
            case 'setup-privacy-settings':
              return { ...item, completed: progressData.checklistItems.setupPrivacySettings };
            default:
              return item;
          }
        })
      );

      setProgress(progressData.progress);
    } catch (error) {
      console.error('Error checking completion status:', error);
    }
  }, []);

  useEffect(() => {
    checkCompletionStatus();
    
    // Check periodically for updates
    const interval = setInterval(checkCompletionStatus, 5000);
    return () => clearInterval(interval);
  }, [checkCompletionStatus]);

  const completedCount = checklist.filter((item) => item.completed).length;

  // Auto-mark onboarding as completed when all items are done
  useEffect(() => {
    const markComplete = async () => {
      if (completedCount === checklist.length) {
        try {
          await OnboardingService.markOnboardingCompleted();
        } catch (error) {
          console.error('Error marking onboarding complete:', error);
        }
      }
    };

    markComplete();
  }, [completedCount, checklist.length]);

  const handleItemClick = (item) => {
    // Mark tools as accessed when navigating to privacy tools
    if (item.id === 'review-privacy-tools') {
      OnboardingService.markToolsAccessed();
    }
    navigate(item.route);
  };

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Getting Started Checklist
          </h2>
          <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-sm font-medium">
            {completedCount} / {checklist.length}
          </span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
          <div
            className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="space-y-3">
        {checklist.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.id}
              onClick={() => handleItemClick(item)}
              className={`cursor-pointer transition-all hover:shadow-md p-4 rounded-lg border-2 ${
                item.completed
                  ? 'border-green-500 dark:border-green-400 bg-green-50 dark:bg-green-900/10'
                  : 'border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-700'
              }`}
            >
              <div className="flex items-start gap-4">
                <div className={`p-2 rounded-lg ${
                  item.completed
                    ? 'bg-green-100 dark:bg-green-900/30'
                    : 'bg-gray-100 dark:bg-gray-800'
                }`}>
                  {item.completed ? (
                    <Check className="h-5 w-5 text-green-600 dark:text-green-400" />
                  ) : (
                    <Icon className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className={`font-semibold ${
                      item.completed
                        ? 'text-green-700 dark:text-green-300'
                        : 'text-gray-900 dark:text-white'
                    }`}>
                      {item.title}
                    </h3>
                    {item.completed && (
                      <span className="px-2 py-0.5 border border-green-500 text-green-600 dark:text-green-400 rounded text-xs font-medium">
                        Complete
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                    {item.description}
                  </p>
                  <div className="flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400">
                    <span>Get started</span>
                    <ArrowRight className="h-4 w-4" />
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {completedCount === checklist.length && (
        <div className="border-green-500 dark:border-green-400 bg-green-50 dark:bg-green-900/10 border-2 rounded-lg p-6 text-center">
          <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <Shield className="h-8 w-8 text-green-600 dark:text-green-400" />
          </div>
          <h3 className="text-lg font-semibold text-green-700 dark:text-green-300 mb-2">
            🎉 Great job!
          </h3>
          <p className="text-green-600 dark:text-green-400 mb-4">
            You've completed all onboarding steps. You're ready to protect your privacy!
          </p>
          <button
            onClick={() => navigate('/dashboard')}
            className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white rounded-lg font-semibold transition-all flex items-center gap-2 mx-auto"
          >
            Go to Dashboard
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  );
};

