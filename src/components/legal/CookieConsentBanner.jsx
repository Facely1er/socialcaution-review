import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Cookie, Settings } from 'lucide-react';
import { useTranslation } from '../../contexts/TranslationContext';
import { useCookieConsent } from '../../contexts/CookieConsentContext';
import { getConsent, setConsent, hasAnswered } from '../../utils/cookieConsent';
import { analytics } from '../../utils/analytics';

export default function CookieConsentBanner() {
  const { t } = useTranslation();
  const { openPreferencesState, closePreferences } = useCookieConsent();
  const [visible, setVisible] = useState(false);
  const [showManage, setShowManage] = useState(false);
  const [manageAnalytics, setManageAnalytics] = useState(getConsent() === 'all');

  const shouldShow = !hasAnswered() || openPreferencesState;

  useEffect(() => {
    setVisible(shouldShow);
    if (openPreferencesState) {
      setShowManage(true);
      setManageAnalytics(getConsent() === 'all');
    }
  }, [shouldShow, openPreferencesState]);

  const hide = () => {
    setVisible(false);
    closePreferences();
  };

  const handleAcceptAll = () => {
    setConsent('all');
    analytics.enableGA();
    hide();
  };

  const handleRejectNonEssential = () => {
    setConsent('essential');
    hide();
  };

  const handleSavePreferences = () => {
    const value = manageAnalytics ? 'all' : 'essential';
    setConsent(value);
    if (manageAnalytics) {
      analytics.enableGA();
    }
    setShowManage(false);
    hide();
  };

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-labelledby="cookie-banner-title"
      aria-describedby="cookie-banner-desc"
      className="fixed bottom-0 left-0 right-0 z-[9999] max-h-[85vh] overflow-y-auto p-4 sm:p-6 pb-[max(1rem,env(safe-area-inset-bottom,0px))] shadow-[0_-4px_20px_rgba(0,0,0,0.15)] bg-white dark:bg-slate-800 border-t border-gray-200 dark:border-slate-700"
    >
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col gap-4">
          <div className="flex items-start gap-3">
            <Cookie className="w-8 h-8 text-amber-500 dark:text-amber-400 flex-shrink-0 mt-0.5" aria-hidden />
            <div className="min-w-0 flex-1">
              <h2 id="cookie-banner-title" className="text-lg font-semibold text-gray-900 dark:text-white">
                {t('cookieBanner.title')}
              </h2>
              <p id="cookie-banner-desc" className="mt-1 text-sm text-gray-600 dark:text-gray-300">
                {t('cookieBanner.description')}
              </p>
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                {t('cookieBanner.essentialNote')}
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                <Link
                  to="/cookie-policy"
                  className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline"
                >
                  {t('cookieBanner.cookiePolicyLink')}
                </Link>
                <span className="text-gray-400 dark:text-gray-500">·</span>
                <Link
                  to="/privacy-policy"
                  className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline"
                >
                  {t('cookieBanner.privacyPolicyLink')}
                </Link>
              </div>
            </div>
          </div>

          {showManage ? (
            <div className="rounded-lg bg-gray-50 dark:bg-slate-700/50 p-4 space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-medium text-gray-900 dark:text-white">
                  {t('cookieBanner.analyticsLabel')}
                </span>
                <button
                  type="button"
                  role="switch"
                  aria-checked={manageAnalytics}
                  onClick={() => setManageAnalytics((v) => !v)}
                  className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ring-offset-white dark:ring-offset-slate-800 ${
                    manageAnalytics ? 'bg-indigo-600' : 'bg-gray-200 dark:bg-gray-600'
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition ${
                      manageAnalytics ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={handleSavePreferences}
                  className="px-4 py-2 rounded-lg bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ring-offset-white dark:ring-offset-slate-800"
                >
                  {t('cookieBanner.save')}
                </button>
                {hasAnswered() && (
                  <button
                    type="button"
                    onClick={() => { setShowManage(false); closePreferences(); setVisible(false); }}
                    className="px-4 py-2 rounded-lg bg-gray-200 dark:bg-slate-600 text-gray-700 dark:text-gray-200 text-sm font-medium hover:bg-gray-300 dark:hover:bg-slate-500 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 ring-offset-white dark:ring-offset-slate-800"
                  >
                    {t('common.actions.close')}
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={handleAcceptAll}
                className="px-4 py-2 rounded-lg bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ring-offset-white dark:ring-offset-slate-800"
              >
                {t('cookieBanner.acceptAll')}
              </button>
              <button
                type="button"
                onClick={handleRejectNonEssential}
                className="px-4 py-2 rounded-lg bg-gray-200 dark:bg-slate-600 text-gray-700 dark:text-gray-200 text-sm font-medium hover:bg-gray-300 dark:hover:bg-slate-500 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 ring-offset-white dark:ring-offset-slate-800"
              >
                {t('cookieBanner.rejectNonEssential')}
              </button>
              <button
                type="button"
                onClick={() => setShowManage(true)}
                className="inline-flex items-center gap-1 px-4 py-2 rounded-lg border border-gray-300 dark:border-slate-600 text-gray-700 dark:text-gray-200 text-sm font-medium hover:bg-gray-50 dark:hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ring-offset-white dark:ring-offset-slate-800"
              >
                <Settings className="w-4 h-4" />
                {t('cookieBanner.managePreferences')}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
