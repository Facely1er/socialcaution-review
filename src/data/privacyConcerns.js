/**
 * Privacy Concerns – categories and helpers for concern-based personalization.
 * Used by concernHelpers, concernMappings, personaHelpers.
 */

/** Concern categories with their concern ids (aligned with concernMappings) */
export const privacyConcernCategories = [
  {
    id: 'family',
    label: 'Family & Children',
    concerns: [
      { id: 'child-safety', label: 'Child Safety' },
      { id: 'family-privacy', label: 'Family Privacy' },
      { id: 'parental-controls', label: 'Parental Controls' }
    ]
  },
  {
    id: 'financial',
    label: 'Financial & Identity',
    concerns: [
      { id: 'financial-security', label: 'Financial Security' },
      { id: 'identity-theft', label: 'Identity Theft' },
      { id: 'data-brokers', label: 'Data Brokers' },
      { id: 'shopping-privacy', label: 'Shopping Privacy' },
      { id: 'data-rights', label: 'Data Rights' },
      { id: 'online-tracking', label: 'Online Tracking' }
    ]
  },
  {
    id: 'work',
    label: 'Work & Professional',
    concerns: [
      { id: 'workplace-privacy', label: 'Workplace Privacy' },
      { id: 'professional-data', label: 'Professional Data' },
      { id: 'employee-rights', label: 'Employee Rights' },
      { id: 'workplace-monitoring', label: 'Workplace Monitoring' }
    ]
  },
  {
    id: 'social',
    label: 'Social & Reputation',
    concerns: [
      { id: 'social-media-privacy', label: 'Social Media Privacy' },
      { id: 'reputation-management', label: 'Reputation Management' },
      { id: 'public-privacy', label: 'Public Privacy' },
      { id: 'content-protection', label: 'Content Protection' },
      { id: 'anonymity', label: 'Anonymity' },
      { id: 'data-minimization', label: 'Data Minimization' }
    ]
  }
];

const concernIdToLabel = new Map();
privacyConcernCategories.forEach((cat) => {
  cat.concerns.forEach((c) => concernIdToLabel.set(c.id, c.label));
});

const concernIdToCategory = new Map();
privacyConcernCategories.forEach((cat) => {
  cat.concerns.forEach((c) => concernIdToCategory.set(c.id, cat));
});

/**
 * Get human-readable label for a concern id
 * @param {string} concernId - Concern id (e.g. 'child-safety')
 * @returns {string} Label (e.g. 'Child Safety')
 */
export function getConcernLabel(concernId) {
  return concernIdToLabel.get(concernId) || concernId?.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()) || String(concernId);
}

/**
 * Get the category object that contains this concern
 * @param {string} concernId - Concern id
 * @returns {Object|undefined} Category object or undefined
 */
export function getCategoryByConcernId(concernId) {
  return concernIdToCategory.get(concernId);
}

/**
 * Migrate concerns to current structure (array of concern ids).
 * Accepts array of ids or old-format objects; returns array of ids.
 * @param {Array<string|Object>} concerns - Array of concern ids or old-format objects
 * @returns {string[]} Array of concern ids
 */
export function migrateConcerns(concerns) {
  if (!Array.isArray(concerns)) return [];
  return concerns.map((c) => (typeof c === 'string' ? c : c?.id || c)).filter(Boolean);
}

