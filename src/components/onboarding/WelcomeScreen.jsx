/**
 * Welcome Screen Component
 * 
 * Onboarding Implementation
 * Based on: COMMON_ONBOARDING_FLOW.md v1.0.0
 * Pattern: Welcome Screen (Phase 3)
 * 
 * Product: SocialCaution
 * Last Updated: 2025-11-XX
 * 
 * Privacy by Design: No external tracking, all data stays local
 */

import React, { useState } from 'react';
import { Shield, FileCheck, BarChart3, ArrowRight, Lock, Eye, Sparkles } from 'lucide-react';

export const WelcomeScreen = ({ onComplete, onSkip, userName }) => {
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    {
      title: 'Welcome to SocialCaution™',
      subtitle: 'Your privacy protection companion',
      content: (
        <div className="text-center space-y-6">
          <div className="w-24 h-24 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-full flex items-center justify-center mx-auto">
            <Shield className="h-12 w-12 text-blue-500 dark:text-blue-400" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              {`Welcome${userName ? `, ${userName}` : ''}!`}
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6 max-w-md mx-auto">
              SocialCaution helps you understand and protect your privacy online. 
              All your data stays on your device - we never track or store your information.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
                <Lock className="h-8 w-8 text-blue-500 dark:text-blue-400 mx-auto mb-2" />
                <div className="font-medium text-gray-900 dark:text-white">Privacy by Design</div>
                <div className="text-gray-600 dark:text-gray-300">All data stays local</div>
              </div>
              <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
                <FileCheck className="h-8 w-8 text-blue-500 dark:text-blue-400 mx-auto mb-2" />
                <div className="font-medium text-gray-900 dark:text-white">Privacy Assessment</div>
                <div className="text-gray-600 dark:text-gray-300">Understand your exposure</div>
              </div>
              <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
                <Eye className="h-8 w-8 text-blue-500 dark:text-blue-400 mx-auto mb-2" />
                <div className="font-medium text-gray-900 dark:text-white">Privacy Tools</div>
                <div className="text-gray-600 dark:text-gray-300">Take control of your data</div>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      title: 'Privacy First',
      subtitle: 'Your data never leaves your device',
      content: (
        <div className="space-y-4">
          <div className="text-center mb-6">
            <p className="text-gray-600 dark:text-gray-300">
              We'll guide you through essential privacy protection steps. 
              Everything stays on your device - we never track or store your information.
            </p>
          </div>
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-4">
            <div className="flex items-start gap-3">
              <Lock className="h-5 w-5 text-blue-500 dark:text-blue-400 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-semibold text-blue-900 dark:text-blue-300 mb-1">
                  Privacy by Design
                </h4>
                <p className="text-sm text-blue-800 dark:text-blue-200">
                  All your assessment results, profile data, and preferences are stored locally 
                  on your device. We never send your data to any server.
                </p>
              </div>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex items-start gap-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <FileCheck className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
              <div>
                <div className="font-medium text-gray-900 dark:text-white">Complete Privacy Assessment</div>
                <div className="text-sm text-gray-600 dark:text-gray-300">
                  Understand your privacy exposure and rights
                </div>
              </div>
            </div>
            <div className="flex items-start gap-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <BarChart3 className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
              <div>
                <div className="font-medium text-gray-900 dark:text-white">Explore Your Dashboard</div>
                <div className="text-sm text-gray-600 dark:text-gray-300">
                  View personalized privacy insights
                </div>
              </div>
            </div>
            <div className="flex items-start gap-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <Shield className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
              <div>
                <div className="font-medium text-gray-900 dark:text-white">Review Privacy Tools</div>
                <div className="text-sm text-gray-600 dark:text-gray-300">
                  Access tools to protect your privacy
                </div>
              </div>
            </div>
            <div className="flex items-start gap-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <Eye className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
              <div>
                <div className="font-medium text-gray-900 dark:text-white">Set Up Privacy Settings</div>
                <div className="text-sm text-gray-600 dark:text-gray-300">
                  Configure your privacy preferences
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    }
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
    }
  };

  const handleSkip = () => {
    if (onSkip) {
      onSkip();
    } else {
      onComplete();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="w-full max-w-2xl bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 md:p-8">
        <div className="text-center mb-6">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Sparkles className="h-6 w-6 text-blue-500 dark:text-blue-400" />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              {steps[currentStep].title}
            </h2>
          </div>
          <p className="text-gray-600 dark:text-gray-300">{steps[currentStep].subtitle}</p>
        </div>
        
        <div className="mb-8">
          {steps[currentStep].content}
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex gap-2">
            {steps.map((_, index) => (
              <div
                key={index}
                className={`h-2 w-2 rounded-full ${
                  index === currentStep
                    ? 'bg-blue-500 dark:bg-blue-400'
                    : 'bg-gray-300 dark:bg-gray-600'
                }`}
              />
            ))}
          </div>
          
          <div className="flex gap-3">
            {onSkip && (
              <button
                onClick={handleSkip}
                className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Skip
              </button>
            )}
            <button
              onClick={handleNext}
              className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white rounded-lg font-semibold transition-all flex items-center gap-2"
            >
              {currentStep === steps.length - 1 ? 'Get Started' : 'Next'}
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

