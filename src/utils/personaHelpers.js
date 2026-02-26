import { PersonaProfiles } from '../data/personaProfiles';
import { migrateConcerns } from '../data/privacyConcerns';

/**
 * Get the effective concerns for a persona
 * Returns customConcerns if available, otherwise returns the persona's default primaryConcerns
 * Migrates old concerns to new structure automatically
 * 
 * @param {Object} persona - Persona object with primary and optional customConcerns
 * @returns {string[]} Array of concern strings (migrated to new structure)
 */
export const getPersonaConcerns = (persona) => {
  if (!persona || !persona.primary) {
    return [];
  }

  // If custom concerns are provided, use those (migrated)
  if (persona.customConcerns && persona.customConcerns.length > 0) {
    return migrateConcerns(persona.customConcerns);
  }

  // Otherwise, use the persona's default concerns (migrated)
  const profile = PersonaProfiles[persona.primary];
  if (profile && profile.primaryConcerns) {
    return migrateConcerns(profile.primaryConcerns);
  }

  return [];
};

/**
 * Get the persona profile object
 * 
 * @param {Object} persona - Persona object with primary
 * @returns {Object|null} Persona profile or null
 */
export const getPersonaProfile = (persona) => {
  if (!persona || !persona.primary) {
    return null;
  }
  return PersonaProfiles[persona.primary] || null;
};

