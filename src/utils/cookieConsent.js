/**
 * Cookie consent state for GDPR/ePrivacy compliance.
 * Persists user choice and gates non-essential cookies (e.g. Google Analytics).
 */

const STORAGE_KEY = 'socialcaution_cookie_consent';

/** @type {'all' | 'essential'} - 'all' = analytics allowed, 'essential' = only strictly necessary */
export function getConsent() {
  if (typeof localStorage === 'undefined') return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw === 'all' || raw === 'essential') return raw;
    return null;
  } catch {
    return null;
  }
}

/**
 * @param {'all' | 'essential'} value
 */
export function setConsent(value) {
  if (typeof localStorage === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, value);
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('socialcaution_cookie_consent_change'));
    }
  } catch {
    // ignore
  }
}

export function hasAnswered() {
  return getConsent() !== null;
}

export function allowsAnalytics() {
  return getConsent() === 'all';
}
