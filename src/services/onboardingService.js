/**
 * Onboarding Service
 * 
 * Onboarding Implementation
 * Based on: COMMON_ONBOARDING_FLOW.md v1.0.0
 * Template: ONBOARDING_IMPLEMENTATION_TEMPLATE.md
 * Pattern: Checklist
 * 
 * Product: SocialCaution
 * Repository: socialcaution2025
 * Last Updated: 2025-11-XX
 * 
 * Architecture: Privacy by Design
 * - Default: All data stored locally (localStorage)
 * - Enterprise: Optional backend (Supabase) for advanced features/API access
 * - Backend only used when enterprise features enabled
 * 
 * Product-Specific Customizations:
 * - Privacy by Design: All data stored locally only by default
 * - No server-side tracking or external data storage (standard tier)
 * - Checklist items focused on privacy assessment and tools
 * - Progress detection based on local storage keys
 * - Optional backend sync for enterprise customers
 * 
 * Reference Implementation:
 * - See ONBOARDING_ARCHITECTURE.md for architecture details
 */

/**
 * Get onboarding data from local storage
 * Privacy by Design: All data stays local
 */
function getOnboardingData() {
  try {
    const data = localStorage.getItem('socialcaution_onboarding');
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.warn('Error reading onboarding data:', error);
    return null;
  }
}

/**
 * Save onboarding data to local storage
 * Privacy by Design: All data stays local
 */
function saveOnboardingData(data) {
  try {
    localStorage.setItem('socialcaution_onboarding', JSON.stringify({
      ...data,
      updated_at: new Date().toISOString(),
    }));
  } catch (error) {
    console.warn('Error saving onboarding data:', error);
  }
}

export const OnboardingService = {
  /**
   * Initialize onboarding for new user
   * Privacy by Design: No server calls, all local
   */
  async completeOnboarding() {
    try {
      const existing = getOnboardingData();
      
      if (existing?.onboarding_started) {
        return; // Already started
      }

      saveOnboardingData({
        onboarding_started: true,
        onboarding_started_at: new Date().toISOString(),
        is_first_login: true,
        onboarding_completed: false,
      });

      console.log('Onboarding initialized (local storage only)');
    } catch (error) {
      console.error('Error initializing onboarding:', error);
    }
  },

  /**
   * Mark onboarding as started
   * Privacy by Design: Local storage only
   */
  async markOnboardingStarted() {
    try {
      const existing = getOnboardingData() || {};
      saveOnboardingData({
        ...existing,
        onboarding_started: true,
        onboarding_started_at: new Date().toISOString(),
        is_first_login: true,
      });
    } catch (error) {
      console.error('Error marking onboarding as started:', error);
    }
  },

  /**
   * Mark onboarding as completed
   * Privacy by Design: Local storage only
   */
  async markOnboardingCompleted() {
    try {
      const existing = getOnboardingData() || {};
      saveOnboardingData({
        ...existing,
        onboarding_completed: true,
        onboarding_completed_at: new Date().toISOString(),
        is_first_login: false,
      });

      console.log('Onboarding marked as completed (local storage only)');
    } catch (error) {
      console.error('Error marking onboarding as completed:', error);
    }
  },

  /**
   * Check if user has completed onboarding
   * Privacy by Design: Local storage only
   */
  async isOnboardingCompleted() {
    try {
      const data = getOnboardingData();
      return data?.onboarding_completed === true;
    } catch (error) {
      console.error('Error checking onboarding status:', error);
      return false;
    }
  },

  /**
   * Get onboarding progress
   * Privacy by Design: Checks local storage only, no server calls
   */
  async getOnboardingProgress() {
    try {
      // Check if user has completed privacy assessment
      const assessmentResults = localStorage.getItem('socialcaution_results');
      const hasAssessment = !!assessmentResults;

      // Check if user has accessed dashboard
      const userProfile = localStorage.getItem('socialcaution_profile');
      const hasDashboard = !!userProfile;

      // Check if user has accessed privacy tools
      const toolsAccess = localStorage.getItem('socialcaution_tools_accessed');
      const hasTools = toolsAccess === 'true';

      // Check if user has set privacy settings
      const privacySettings = localStorage.getItem('socialcaution_privacy_settings');
      const hasSettings = !!privacySettings;

      const checklistItems = {
        completePrivacyAssessment: hasAssessment,
        exploreDashboard: hasDashboard,
        reviewPrivacyTools: hasTools,
        setupPrivacySettings: hasSettings,
      };

      const completedCount = Object.values(checklistItems).filter(Boolean).length;
      const progress = (completedCount / Object.keys(checklistItems).length) * 100;
      const completed = Object.values(checklistItems).every(item => item === true);

      return {
        completed,
        progress: Math.round(progress),
        checklistItems,
      };
    } catch (error) {
      console.error('Error getting onboarding progress:', error);
      return {
        completed: false,
        progress: 0,
        checklistItems: {
          completePrivacyAssessment: false,
          exploreDashboard: false,
          reviewPrivacyTools: false,
          setupPrivacySettings: false,
        },
      };
    }
  },

  /**
   * Mark privacy tools as accessed
   * Privacy by Design: Local storage only
   */
  markToolsAccessed() {
    try {
      localStorage.setItem('socialcaution_tools_accessed', 'true');
    } catch (error) {
      console.warn('Error marking tools as accessed:', error);
    }
  },

  /**
   * Update onboarding profile data
   * Privacy by Design: Local storage only
   */
  async updateOnboardingProfile(profileData) {
    try {
      const existing = getOnboardingData() || {};
      saveOnboardingData({
        ...existing,
        ...profileData,
      });
    } catch (error) {
      console.error('Error updating onboarding profile:', error);
    }
  },
};

