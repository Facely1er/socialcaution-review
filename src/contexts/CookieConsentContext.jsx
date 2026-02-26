import { createContext, useContext, useState, useCallback } from 'react';

const CookieConsentContext = createContext(null);

export function CookieConsentProvider({ children }) {
  const [openPreferencesState, setOpenPreferencesState] = useState(false);

  const openPreferences = useCallback(() => {
    setOpenPreferencesState(true);
  }, []);

  const closePreferences = useCallback(() => {
    setOpenPreferencesState(false);
  }, []);

  return (
    <CookieConsentContext.Provider value={{ openPreferences, closePreferences, openPreferencesState }}>
      {children}
    </CookieConsentContext.Provider>
  );
}

export function useCookieConsent() {
  const ctx = useContext(CookieConsentContext);
  return ctx || { openPreferences: () => {}, closePreferences: () => {}, openPreferencesState: false };
}
