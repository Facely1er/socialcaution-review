/**
 * Onboarding Page
 * 
 * Onboarding Implementation
 * Based on: COMMON_ONBOARDING_FLOW.md v1.0.0
 * 
 * Product: SocialCaution
 * Last Updated: 2025-11-XX
 * 
 * Privacy by Design: All data stays local, no server calls
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { OnboardingService } from '../services/onboardingService';
import { WelcomeScreen } from '../components/onboarding/WelcomeScreen';
import { OnboardingChecklist } from '../components/onboarding/OnboardingChecklist';
import { useOnboarding } from '../hooks/useOnboarding';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';

export function OnboardingPage() {
  const navigate = useNavigate();
  const { isLoading, isCompleted, refreshProgress } = useOnboarding();
  const [showWelcome, setShowWelcome] = useState(true);
  const [onboardingInitialized, setOnboardingInitialized] = useState(false);

  // Initialize onboarding when component mounts
  useEffect(() => {
    const initializeOnboarding = async () => {
      if (!onboardingInitialized) {
        try {
          await OnboardingService.completeOnboarding();
          setOnboardingInitialized(true);
        } catch (error) {
          console.error('Error initializing onboarding:', error);
          setOnboardingInitialized(true);
        }
      }
    };

    initializeOnboarding();
  }, [onboardingInitialized]);

  // Check if onboarding is already completed
  useEffect(() => {
    if (!isLoading && isCompleted) {
      navigate('/dashboard', { replace: true });
    }
  }, [isLoading, isCompleted, navigate]);

  const handleWelcomeComplete = () => {
    setShowWelcome(false);
  };

  const handleWelcomeSkip = () => {
    setShowWelcome(false);
  };

  const handleChecklistComplete = async () => {
    try {
      await OnboardingService.markOnboardingCompleted();
      await refreshProgress();
      navigate('/dashboard', { replace: true });
    } catch (error) {
      console.error('Error completing onboarding:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-slate-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Loading onboarding...</p>
        </div>
      </div>
    );
  }

  if (isCompleted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-slate-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Redirecting to dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 flex flex-col">
      {showWelcome ? (
        <WelcomeScreen
          onComplete={handleWelcomeComplete}
          onSkip={handleWelcomeSkip}
          userName={null}
        />
      ) : (
        <>
          <Header />
          <main className="flex-1 container mx-auto px-4 py-8 max-w-4xl">
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Welcome to SocialCaution
              </h1>
              <p className="text-gray-600 dark:text-gray-300">
                Complete these steps to get started with privacy protection
              </p>
            </div>
            
            <OnboardingChecklist />
            
            <div className="mt-6 flex justify-end">
              <button
                onClick={handleChecklistComplete}
                className="text-sm text-gray-600 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400 underline"
              >
                Skip onboarding and go to dashboard
              </button>
            </div>
          </main>
          <Footer />
        </>
      )}
    </div>
  );
}

export default OnboardingPage;

