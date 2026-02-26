/**
 * Tutorial Service
 * 
 * Manages tutorial state, progress, and step definitions
 * Privacy by Design: All data stored locally
 */

/**
 * Get tutorial data from local storage
 */
function getTutorialData() {
  try {
    const data = localStorage.getItem('socialcaution_tutorial');
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.warn('Error reading tutorial data:', error);
    return null;
  }
}

/**
 * Save tutorial data to local storage
 */
function saveTutorialData(data) {
  try {
    localStorage.setItem('socialcaution_tutorial', JSON.stringify({
      ...data,
      updated_at: new Date().toISOString(),
    }));
  } catch (error) {
    console.warn('Error saving tutorial data:', error);
  }
}

export const TutorialService = {
  /**
   * Check if a tutorial has been completed
   */
  isTutorialCompleted(tutorialId) {
    try {
      const data = getTutorialData();
      return data?.completedTutorials?.includes(tutorialId) || false;
    } catch (error) {
      console.error('Error checking tutorial completion:', error);
      return false;
    }
  },

  /**
   * Mark a tutorial as completed
   */
  markTutorialCompleted(tutorialId) {
    try {
      const data = getTutorialData() || {};
      const completedTutorials = data.completedTutorials || [];
      
      if (!completedTutorials.includes(tutorialId)) {
        completedTutorials.push(tutorialId);
      }

      saveTutorialData({
        ...data,
        completedTutorials,
        lastCompletedAt: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Error marking tutorial as completed:', error);
    }
  },

  /**
   * Get tutorial progress for a specific tutorial
   */
  getTutorialProgress(tutorialId) {
    try {
      const data = getTutorialData();
      return data?.tutorialProgress?.[tutorialId] || {
        currentStep: 0,
        completed: false,
      };
    } catch (error) {
      console.error('Error getting tutorial progress:', error);
      return { currentStep: 0, completed: false };
    }
  },

  /**
   * Save tutorial progress
   */
  saveTutorialProgress(tutorialId, stepIndex) {
    try {
      const data = getTutorialData() || {};
      const tutorialProgress = data.tutorialProgress || {};
      
      tutorialProgress[tutorialId] = {
        currentStep: stepIndex,
        completed: false,
        lastUpdated: new Date().toISOString(),
      };

      saveTutorialData({
        ...data,
        tutorialProgress,
      });
    } catch (error) {
      console.error('Error saving tutorial progress:', error);
    }
  },

  /**
   * Reset tutorial progress
   */
  resetTutorial(tutorialId) {
    try {
      const data = getTutorialData() || {};
      const tutorialProgress = data.tutorialProgress || {};
      delete tutorialProgress[tutorialId];

      const completedTutorials = (data.completedTutorials || []).filter(id => id !== tutorialId);

      saveTutorialData({
        ...data,
        tutorialProgress,
        completedTutorials,
      });
    } catch (error) {
      console.error('Error resetting tutorial:', error);
    }
  },

  /**
   * Get all completed tutorials
   */
  getCompletedTutorials() {
    try {
      const data = getTutorialData();
      return data?.completedTutorials || [];
    } catch (error) {
      console.error('Error getting completed tutorials:', error);
      return [];
    }
  },

  /**
   * Check if user has seen the tutorial prompt
   */
  hasSeenTutorialPrompt() {
    try {
      const data = getTutorialData();
      return data?.hasSeenPrompt || false;
    } catch (error) {
      return false;
    }
  },

  /**
   * Mark tutorial prompt as seen
   */
  markTutorialPromptSeen() {
    try {
      const data = getTutorialData() || {};
      saveTutorialData({
        ...data,
        hasSeenPrompt: true,
        promptSeenAt: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Error marking tutorial prompt as seen:', error);
    }
  },
};

