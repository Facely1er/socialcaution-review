/**
 * Concern-Based Helpers
 *
 * Replaces persona-based workflow with concern-based personalization.
 * Provides utilities for working with privacy concerns.
 */

import { migrateConcerns } from '../data/privacyConcerns';

/**
 * Get concerns from localStorage
 * Handles both old persona-based storage and new concern-based storage
 */
export function getConcernsFromStorage() {
  try {
    // First, try direct concerns storage
    const concernsData = localStorage.getItem('socialcaution_concerns');
    if (concernsData) {
      const parsed = JSON.parse(concernsData);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return migrateConcerns(parsed);
      }
    }

    // Fallback: Extract from persona storage (backward compatibility)
    const personaData = localStorage.getItem('socialcaution_persona');
    if (personaData) {
      try {
        const persona = JSON.parse(personaData);
        if (persona.customConcerns && Array.isArray(persona.customConcerns)) {
          return migrateConcerns(persona.customConcerns);
        }
      } catch (e) {
        // Invalid JSON, ignore
      }
    }

    return [];
  } catch (error) {
    console.warn('Error getting concerns from storage:', error);
    return [];
  }
}

/**
 * Save concerns to localStorage
 */
export function saveConcernsToStorage(concerns) {
  try {
    if (!Array.isArray(concerns) || concerns.length === 0) {
      return false;
    }

    const migrated = migrateConcerns(concerns);

    // Save to concerns storage (primary)
    localStorage.setItem('socialcaution_concerns', JSON.stringify(migrated));

    // Also update persona storage for backward compatibility
    const personaData = localStorage.getItem('socialcaution_persona');
    if (personaData) {
      try {
        const persona = JSON.parse(personaData);
        persona.customConcerns = migrated;
        persona.updatedAt = new Date().toISOString();
        localStorage.setItem('socialcaution_persona', JSON.stringify(persona));
      } catch (e) {
        // If persona doesn't exist, create minimal object for compat
        localStorage.setItem(
          'socialcaution_persona',
          JSON.stringify({
            customConcerns: migrated,
            updatedAt: new Date().toISOString()
          })
        );
      }
    } else {
      localStorage.setItem(
        'socialcaution_persona',
        JSON.stringify({
          customConcerns: migrated,
          updatedAt: new Date().toISOString()
        })
      );
    }

    return true;
  } catch (error) {
    console.error('Error saving concerns to storage:', error);
    return false;
  }
}
