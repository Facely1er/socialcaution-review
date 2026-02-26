/**
 * Privacy Concern Options – options shown on the Privacy Concerns page.
 * Fewer than personas: 4 concern areas. Each maps to a persona id for storage/Dashboard compatibility.
 */
import { PersonaProfiles, PersonaColors } from './personaProfiles';

/** Concern ids (persona keys) to show on the Privacy Concerns page, in order */
export const PRIVACY_CONCERN_IDS = [
  'cautiousParent',   // Family & children
  'onlineShopper',    // Financial & shopping
  'concernedEmployee', // Work & professional
  'generalUser'      // General / balanced
];

/** Get the list of privacy concerns for the page (subset of personas with concern framing) */
export function getPrivacyConcerns() {
  return PRIVACY_CONCERN_IDS
    .filter((id) => PersonaProfiles[id])
    .map((id) => {
      const persona = PersonaProfiles[id];
      return {
        id,
        name: persona.name,
        description: persona.description,
        color: persona.color,
        icon: persona.icon,
        colors: PersonaColors[persona.color]
      };
    });
}

export default getPrivacyConcerns;
