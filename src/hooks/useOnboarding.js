/**
 * useOnboarding Hook
 * 
 * Onboarding Implementation
 * Based on: COMMON_ONBOARDING_FLOW.md v1.0.0
 * 
 * Product: SocialCaution
 * Last Updated: 2025-11-XX
 * 
 * Privacy by Design: All data stays local, no server calls
 */

import { useState, useEffect, useCallback } from 'react';
import { OnboardingService } from '../services/onboardingService';

export function useOnboarding() {
  const [isLoading, setIsLoading] = useState(true);
  const [isCompleted, setIsCompleted] = useState(false);
  const [progress, setProgress] = useState({
    completed: false,
    progress: 0,
    checklistItems: {
      completePrivacyAssessment: false,
      exploreDashboard: false,
      reviewPrivacyTools: false,
      setupPrivacySettings: false,
    },
  });

  const refreshProgress = useCallback(async () => {
    try {
      setIsLoading(true);
      const [completed, progressData] = await Promise.all([
        OnboardingService.isOnboardingCompleted(),
        OnboardingService.getOnboardingProgress(),
      ]);

      setIsCompleted(completed);
      setProgress(progressData);
    } catch (error) {
      console.error('Error refreshing onboarding progress:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshProgress();
  }, [refreshProgress]);

  const markComplete = useCallback(async () => {
    try {
      await OnboardingService.markOnboardingCompleted();
      await refreshProgress();
    } catch (error) {
      console.error('Error marking onboarding complete:', error);
      throw error;
    }
  }, [refreshProgress]);

  return {
    isLoading,
    isCompleted,
    progress,
    refreshProgress,
    markComplete,
  };
}

