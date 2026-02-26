// Alert Validation System - Manages community validation (upvotes/downvotes) and verification
import { cautionAlertManager } from './cautionAlertManager';

const VALIDATION_STORAGE_KEY = 'socialcaution_alert_validations';

/**
 * Get user's validation history from localStorage
 */
const getUserValidations = () => {
  try {
    if (typeof window === 'undefined') return {};
    const stored = localStorage.getItem(VALIDATION_STORAGE_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch (error) {
    console.warn('Error reading user validations:', error);
    return {};
  }
};

/**
 * Save user's validation history to localStorage
 */
const saveUserValidations = (validations) => {
  try {
    if (typeof window === 'undefined') return;
    localStorage.setItem(VALIDATION_STORAGE_KEY, JSON.stringify(validations));
  } catch (error) {
    console.warn('Error saving user validations:', error);
  }
};

/**
 * Upvote an alert
 */
export const upvoteAlert = (alertId) => {
  try {
    const validation = cautionAlertManager.validateAlert(alertId, 'upvote');
    
    // Track user's vote
    const userValidations = getUserValidations();
    if (!userValidations[alertId]) {
      userValidations[alertId] = {};
    }
    userValidations[alertId].type = 'upvote';
    userValidations[alertId].timestamp = new Date().toISOString();
    saveUserValidations(userValidations);

    return {
      success: true,
      validation
    };
  } catch (error) {
    console.error('Error upvoting alert:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

/**
 * Downvote an alert
 */
export const downvoteAlert = (alertId) => {
  try {
    const validation = cautionAlertManager.validateAlert(alertId, 'downvote');
    
    // Track user's vote
    const userValidations = getUserValidations();
    if (!userValidations[alertId]) {
      userValidations[alertId] = {};
    }
    userValidations[alertId].type = 'downvote';
    userValidations[alertId].timestamp = new Date().toISOString();
    saveUserValidations(userValidations);

    return {
      success: true,
      validation
    };
  } catch (error) {
    console.error('Error downvoting alert:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

/**
 * Remove user's vote (toggle off)
 */
export const removeVote = (alertId) => {
  try {
    const alert = cautionAlertManager.getAlertById(alertId);
    if (!alert) {
      throw new Error('Alert not found');
    }

    const userValidations = getUserValidations();
    const userVote = userValidations[alertId];

    if (userVote && userVote.type) {
      // Decrement the count
      if (alert.validation) {
        if (userVote.type === 'upvote' && alert.validation.upvotes > 0) {
          alert.validation.upvotes--;
        } else if (userVote.type === 'downvote' && alert.validation.downvotes > 0) {
          alert.validation.downvotes--;
        }
      }

      // Remove user's vote
      delete userValidations[alertId];
      saveUserValidations(userValidations);

      // Save alert
      cautionAlertManager.saveAlerts();
    }

    return {
      success: true,
      validation: alert.validation || { upvotes: 0, downvotes: 0, verified: false }
    };
  } catch (error) {
    console.error('Error removing vote:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

/**
 * Get validation statistics for an alert
 */
export const getValidationStats = (alertId) => {
  try {
    const alert = cautionAlertManager.getAlertById(alertId);
    if (!alert) {
      return {
        upvotes: 0,
        downvotes: 0,
        verified: false,
        score: 0,
        userVote: null
      };
    }

    const validation = alert.validation || { upvotes: 0, downvotes: 0, verified: false };
    const userValidations = getUserValidations();
    const userVote = userValidations[alertId]?.type || null;

    return {
      upvotes: validation.upvotes || 0,
      downvotes: validation.downvotes || 0,
      verified: validation.verified || false,
      score: (validation.upvotes || 0) - (validation.downvotes || 0),
      userVote
    };
  } catch (error) {
    console.warn('Error getting validation stats:', error);
    return {
      upvotes: 0,
      downvotes: 0,
      verified: false,
      score: 0,
      userVote: null
    };
  }
};

/**
 * Check if alert is verified
 */
export const isVerified = (alertId) => {
  try {
    const alert = cautionAlertManager.getAlertById(alertId);
    return alert && alert.validation && alert.validation.verified === true;
  } catch (error) {
    return false;
  }
};

/**
 * Verify an alert (admin/community verification)
 * Note: In production, this would require admin privileges
 */
export const verifyAlert = (alertId, verified = true) => {
  try {
    const validation = cautionAlertManager.verifyAlert(alertId, verified);
    return {
      success: true,
      validation
    };
  } catch (error) {
    console.error('Error verifying alert:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

/**
 * Get user's vote for an alert
 */
export const getUserVote = (alertId) => {
  try {
    const userValidations = getUserValidations();
    return userValidations[alertId]?.type || null;
  } catch (error) {
    return null;
  }
};

/**
 * Toggle vote (upvote if not voted, remove if already upvoted, switch to upvote if downvoted)
 */
export const toggleUpvote = (alertId) => {
  const userVote = getUserVote(alertId);
  
  if (userVote === 'upvote') {
    return removeVote(alertId);
  } else {
    // If user had downvoted, remove that first
    if (userVote === 'downvote') {
      removeVote(alertId);
    }
    return upvoteAlert(alertId);
  }
};

/**
 * Toggle downvote (downvote if not voted, remove if already downvoted, switch to downvote if upvoted)
 */
export const toggleDownvote = (alertId) => {
  const userVote = getUserVote(alertId);
  
  if (userVote === 'downvote') {
    return removeVote(alertId);
  } else {
    // If user had upvoted, remove that first
    if (userVote === 'upvote') {
      removeVote(alertId);
    }
    return downvoteAlert(alertId);
  }
};

