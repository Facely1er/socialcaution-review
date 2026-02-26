/**
 * Local Account Manager
 * Manages user account data locally with encryption support and sync capabilities
 * Works with both localStorage (for quick access) and IndexedDB (for persistence)
 */

import offlineStorage from './offlineStorage.js';
import { ErrorLogger } from './validation.js';

class LocalAccountManager {
  constructor() {
    this.storageKeys = {
      profile: 'socialcaution_profile',
      persona: 'socialcaution_persona',
      results: 'socialcaution_results',
      services: 'socialcaution_services',
      preferences: 'socialcaution_preferences'
    };
  }

  /**
   * Get user profile (checks both localStorage and IndexedDB)
   */
  async getProfile() {
    try {
      // Try localStorage first (faster)
      const localProfile = localStorage.getItem(this.storageKeys.profile);
      if (localProfile) {
        try {
          return JSON.parse(localProfile);
        } catch (e) {
          // Invalid JSON, try IndexedDB
        }
      }

      // Fallback to IndexedDB
      const dbProfile = await offlineStorage.getUserProfile();
      if (dbProfile) {
        // Sync back to localStorage for faster access
        localStorage.setItem(this.storageKeys.profile, JSON.stringify(dbProfile));
        return dbProfile;
      }

      return null;
    } catch (error) {
      ErrorLogger.log(error, { context: 'getProfile' });
      return null;
    }
  }

  /**
   * Save user profile (saves to both localStorage and IndexedDB)
   */
  async saveProfile(profileData) {
    try {
      // Save to localStorage for quick access
      localStorage.setItem(this.storageKeys.profile, JSON.stringify(profileData));

      // Save to IndexedDB for persistence
      await offlineStorage.saveUserProfile(profileData);

      return profileData;
    } catch (error) {
      ErrorLogger.log(error, { context: 'saveProfile' });
      // If IndexedDB fails, at least localStorage worked
      return profileData;
    }
  }

  /**
   * Get assessment results
   */
  async getAssessmentResults() {
    try {
      // Try localStorage first
      const localResults = localStorage.getItem(this.storageKeys.results);
      if (localResults) {
        try {
          return JSON.parse(localResults);
        } catch (e) {
          // Invalid JSON
        }
      }

      // Fallback to IndexedDB
      const latestAssessment = await offlineStorage.getLatestAssessment();
      if (latestAssessment) {
        localStorage.setItem(this.storageKeys.results, JSON.stringify(latestAssessment));
        return latestAssessment;
      }

      return null;
    } catch (error) {
      ErrorLogger.log(error, { context: 'getAssessmentResults' });
      return null;
    }
  }

  /**
   * Save assessment results
   */
  async saveAssessmentResults(results) {
    try {
      // Save to localStorage
      localStorage.setItem(this.storageKeys.results, JSON.stringify(results));

      // Save to IndexedDB
      await offlineStorage.saveAssessment({
        exposureResults: results.exposureResults,
        rightsResults: results.rightsResults,
        exposureScore: results.exposureScore,
        rightsScore: results.rightsScore,
        completedAt: results.completedAt || new Date().toISOString()
      });

      return results;
    } catch (error) {
      ErrorLogger.log(error, { context: 'saveAssessmentResults' });
      return results;
    }
  }

  /**
   * Get persona
   */
  async getPersona() {
    try {
      const localPersona = localStorage.getItem(this.storageKeys.persona);
      if (localPersona) {
        try {
          return JSON.parse(localPersona);
        } catch (e) {
          return { primary: localPersona };
        }
      }

      // Check profile in IndexedDB
      const profile = await offlineStorage.getUserProfile();
      if (profile?.persona) {
        localStorage.setItem(this.storageKeys.persona, JSON.stringify(profile.persona));
        return profile.persona;
      }

      return null;
    } catch (error) {
      ErrorLogger.log(error, { context: 'getPersona' });
      return null;
    }
  }

  /**
   * Save persona
   */
  async savePersona(persona) {
    try {
      localStorage.setItem(this.storageKeys.persona, JSON.stringify(persona));

      // Update profile in IndexedDB
      const profile = await offlineStorage.getUserProfile() || {};
      profile.persona = persona;
      await offlineStorage.saveUserProfile(profile);

      return persona;
    } catch (error) {
      ErrorLogger.log(error, { context: 'savePersona' });
      return persona;
    }
  }

  /**
   * Export account data for backup/transfer
   */
  async exportAccount() {
    try {
      const [profile, assessments, preferences] = await Promise.all([
        this.getProfile(),
        offlineStorage.getAssessments(),
        offlineStorage.getAllPreferences()
      ]);

      const exportData = {
        profile,
        assessments,
        preferences,
        persona: await this.getPersona(),
        results: await this.getAssessmentResults(),
        exportedAt: new Date().toISOString(),
        version: '1.0.0'
      };

      // Create downloadable JSON file
      const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `socialcaution-backup-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      return exportData;
    } catch (error) {
      ErrorLogger.log(error, { context: 'exportAccount' });
      throw error;
    }
  }

  /**
   * Import account data from backup
   */
  async importAccount(file) {
    try {
      const text = await file.text();
      const importData = JSON.parse(text);

      // Validate import data
      if (!importData.version) {
        throw new Error('Invalid backup file format');
      }

      // Import profile
      if (importData.profile) {
        await this.saveProfile(importData.profile);
      }

      // Import persona
      if (importData.persona) {
        await this.savePersona(importData.persona);
      }

      // Import assessment results
      if (importData.results) {
        await this.saveAssessmentResults(importData.results);
      }

      // Import preferences
      if (importData.preferences) {
        for (const [key, value] of Object.entries(importData.preferences)) {
          await offlineStorage.savePreference(key, value);
        }
      }

      return true;
    } catch (error) {
      ErrorLogger.log(error, { context: 'importAccount' });
      throw error;
    }
  }

  /**
   * Clear all account data
   */
  async clearAccount() {
    try {
      // Clear localStorage (canonical keys)
      Object.values(this.storageKeys).forEach(key => {
        localStorage.removeItem(key);
      });
      // Clear legacy assessment key so assessment data is fully reset
      localStorage.removeItem('socialcaution_assessment_results');

      // Clear IndexedDB
      await offlineStorage.clearAll();

      return true;
    } catch (error) {
      ErrorLogger.log(error, { context: 'clearAccount' });
      throw error;
    }
  }

  /**
   * Get account statistics
   */
  async getAccountStats() {
    try {
      const [profile, assessments, preferences] = await Promise.all([
        this.getProfile(),
        offlineStorage.getAssessments(),
        offlineStorage.getAllPreferences()
      ]);

      return {
        hasProfile: !!profile,
        hasPersona: !!(await this.getPersona()),
        hasResults: !!(await this.getAssessmentResults()),
        assessmentCount: assessments.length,
        preferencesCount: Object.keys(preferences).length,
        lastUpdated: profile?.updatedAt || null
      };
    } catch (error) {
      ErrorLogger.log(error, { context: 'getAccountStats' });
      return {
        hasProfile: false,
        hasPersona: false,
        hasResults: false,
        assessmentCount: 0,
        preferencesCount: 0,
        lastUpdated: null
      };
    }
  }
}

// Create singleton instance
const localAccountManager = new LocalAccountManager();

export default localAccountManager;

