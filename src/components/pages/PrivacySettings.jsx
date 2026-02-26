import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Settings,
  CheckCircle,
  User,
  Moon,
  Sun,
  Globe,
  Crown,
  Shield,
  Trash2,
  Download,
  RotateCcw,
  HelpCircle,
  MessageCircle,
  BookOpen,
  Mail,
  ChevronRight,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import SEOHead from '../common/SEOHead';
import PageHeader from '../common/PageHeader';
import { useTranslation } from '../../contexts/TranslationContext';
import { useTheme } from '../../contexts/ThemeContext';
import { subscriptionService } from '../../services/subscriptionService';

const PrivacySettings = () => {
  const navigate = useNavigate();
  const { t, currentLanguage, changeLanguage } = useTranslation();
  const { theme, updateTheme } = useTheme();
  const [subscriptionStatus, setSubscriptionStatus] = useState(null);
  const [isCheckingSubscription, setIsCheckingSubscription] = useState(true);
  const [validationError, setValidationError] = useState(null);

  useEffect(() => {
    const checkSubscription = async () => {
      setIsCheckingSubscription(true);
      try {
        const status = subscriptionService?.getSubscriptionStatus
          ? await subscriptionService.getSubscriptionStatus()
          : { tier: 'free', status: 'active' };
        const isActive = status.tier !== 'free' && status.status === 'active';
        setSubscriptionStatus({
          isActive,
          subscription: isActive && (status.subscriptionId || status.currentPeriodEnd)
            ? {
                planName: status.tier === 'family' ? 'Family' : 'Standard',
                billingCycle: status.tier === 'family' ? 'Family' : 'Monthly',
                expirationDate: status.currentPeriodEnd,
                platform: 'web',
              }
            : null,
        });
      } catch {
        setSubscriptionStatus({ isActive: false, subscription: null });
      } finally {
        setIsCheckingSubscription(false);
      }
    };
    checkSubscription();
  }, []);

  const handleClearAllData = () => {
    if (window.confirm(t('account.clearData.confirm'))) {
      Object.keys(localStorage)
        .filter((key) => key.startsWith('socialcaution_'))
        .forEach((key) => localStorage.removeItem(key));
      window.location.reload();
    }
  };

  const handleResetSetup = () => {
    if (window.confirm(t('account.resetSetup.confirm'))) {
      ['socialcaution_services', 'socialcaution_persona', 'socialcaution_results', 'socialcaution_inventory'].forEach(
        (key) => localStorage.removeItem(key)
      );
      window.location.reload();
    }
  };

  const handleExportData = () => {
    const data = {};
    for (let key in localStorage) {
      if (key.startsWith('socialcaution_')) data[key] = localStorage.getItem(key);
    }
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `socialcaution-data-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleCancelSubscription = () => {
    if (!subscriptionStatus?.isActive) return;
    const platform = subscriptionStatus.subscription?.platform;
    if (platform === 'ios' || platform === 'android') {
      window.alert(t('account.subscription.cancelStore'));
    } else {
      navigate('/pricing');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900" data-testid="settings">
      <SEOHead
        title={`${t('privacySettingsPage.title')} | SocialCaution`}
        description={t('privacySettingsPage.description')}
        keywords="privacy settings, persona settings, privacy preferences"
      />
      
      <PageHeader
        title={t('privacySettingsPage.title')}
        subtitle={t('privacySettingsPage.subtitle')}
        icon={Settings}
        iconGradient="indigo"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Profile – aligned with workflow Settings content */}
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 p-6 sm:p-8 mt-8">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <User className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            {t('account.profile')}
          </h2>
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center">
              <User className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="font-semibold text-gray-900 dark:text-white">{t('account.name')}</p>
              <p className="text-sm text-gray-600 dark:text-gray-300">{t('account.email')}</p>
            </div>
          </div>
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3 border border-blue-200 dark:border-blue-800">
            <p className="text-xs text-blue-800 dark:text-blue-200">
              <strong>{t('account.privacyFirst.title')}</strong> {t('account.privacyFirst.description')}
            </p>
          </div>
        </div>

        {/* Preferences */}
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 p-6 sm:p-8 mt-8">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <Settings className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            {t('account.preferences.title')}
          </h2>
          <div className="space-y-6">
            <div>
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {theme === 'dark' ? <Moon className="w-4 h-4 inline mr-1" /> : <Sun className="w-4 h-4 inline mr-1" />}
                {t('settings.theme.title')}
              </p>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => updateTheme('light')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    theme === 'light'
                      ? 'bg-indigo-600 text-white'
                      : 'bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-600'
                  }`}
                >
                  {t('settings.theme.light')}
                </button>
                <button
                  type="button"
                  onClick={() => updateTheme('dark')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    theme === 'dark'
                      ? 'bg-indigo-600 text-white'
                      : 'bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-600'
                  }`}
                >
                  {t('settings.theme.dark')}
                </button>
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-1">
                <Globe className="w-4 h-4" />
                {t('settings.language')}
              </p>
              <select
                value={currentLanguage}
                onChange={(e) => changeLanguage(e.target.value)}
                className="w-full max-w-xs px-3 py-2 bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-lg text-gray-900 dark:text-white font-medium"
                aria-label={t('settings.language')}
              >
                <option value="en">English</option>
                <option value="es">Español</option>
                <option value="fr">Français</option>
              </select>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t('dashboard.sections.privacyFocus')}
              </p>
              <Link
                to="/privacy-focus"
                className="inline-flex items-center gap-2 text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 font-medium"
              >
                {t('privacySettingsPage.editPrivacyFocus')}
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>

        {/* Subscription */}
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 p-6 sm:p-8 mt-8">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <Crown className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            {t('account.subscription.title')}
          </h2>
          {isCheckingSubscription ? (
            <p className="text-sm text-gray-600 dark:text-gray-400">{t('account.subscription.checking')}</p>
          ) : subscriptionStatus?.isActive ? (
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {subscriptionStatus.subscription?.planName || t('account.subscription.standard')}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {subscriptionStatus.subscription?.billingCycle || t('account.subscription.monthly')}
                  </p>
                  {subscriptionStatus.subscription?.expirationDate && (
                    <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                      {t('account.subscription.renews')}:{' '}
                      {new Date(subscriptionStatus.subscription.expirationDate).toLocaleDateString()}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex flex-wrap gap-2 pt-2 border-t border-gray-200 dark:border-slate-700">
                <button
                  type="button"
                  onClick={() => navigate('/pricing')}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg text-sm transition-colors"
                >
                  {t('account.subscription.manage')}
                </button>
                <button
                  type="button"
                  onClick={handleCancelSubscription}
                  className="px-4 py-2 bg-gray-100 dark:bg-slate-700 hover:bg-gray-200 dark:hover:bg-slate-600 text-gray-900 dark:text-white font-medium rounded-lg text-sm transition-colors"
                >
                  {t('account.subscription.cancel')}
                </button>
              </div>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => navigate('/pricing')}
              className="flex items-center gap-3 w-full sm:w-auto px-4 py-3 bg-white dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-xl hover:shadow-md transition-all font-medium text-gray-900 dark:text-white"
            >
              <Crown className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              <span className="flex-1 text-left">{t('account.subscription.upgrade')}</span>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </button>
          )}
        </div>

        {/* Data & Privacy */}
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 p-6 sm:p-8 mt-8">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <Shield className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            {t('account.dataPrivacy')}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <button
              type="button"
              onClick={handleExportData}
              className="flex items-center gap-3 p-3 rounded-xl border border-gray-200 dark:border-slate-600 hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors text-left"
            >
              <Download className="w-5 h-5 text-gray-600 dark:text-gray-400 flex-shrink-0" />
              <span className="font-medium text-gray-900 dark:text-white">{t('account.exportData')}</span>
              <ChevronRight className="w-5 h-5 text-gray-400 ml-auto" />
            </button>
            <button
              type="button"
              onClick={handleResetSetup}
              className="flex items-center gap-3 p-3 rounded-xl border border-gray-200 dark:border-slate-600 hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors text-left"
            >
              <RotateCcw className="w-5 h-5 text-gray-600 dark:text-gray-400 flex-shrink-0" />
              <span className="font-medium text-gray-900 dark:text-white">{t('account.resetSetup.title')}</span>
              <ChevronRight className="w-5 h-5 text-gray-400 ml-auto" />
            </button>
            <button
              type="button"
              onClick={handleClearAllData}
              className="flex items-center gap-3 p-3 rounded-xl border border-gray-200 dark:border-slate-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors text-left"
            >
              <Trash2 className="w-5 h-5 text-red-500 flex-shrink-0" />
              <span className="font-medium text-red-600 dark:text-red-400">{t('account.clearData.title')}</span>
              <ChevronRight className="w-5 h-5 text-gray-400 ml-auto" />
            </button>
          </div>
        </div>

        {/* Help */}
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 p-6 sm:p-8 mt-8">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            {t('footer.links.help') || 'Help'}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <button
              type="button"
              onClick={() => navigate('/tutorial')}
              className="flex items-center gap-3 p-3 rounded-xl border border-gray-200 dark:border-slate-600 hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors text-left"
            >
              <BookOpen className="w-5 h-5 text-gray-600 dark:text-gray-400 flex-shrink-0" />
              <span className="font-medium text-gray-900 dark:text-white">{t('footer.links.tutorial') || 'Tutorial'}</span>
              <ChevronRight className="w-5 h-5 text-gray-400 ml-auto" />
            </button>
            <button
              type="button"
              onClick={() => navigate('/faq')}
              className="flex items-center gap-3 p-3 rounded-xl border border-gray-200 dark:border-slate-600 hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors text-left"
            >
              <HelpCircle className="w-5 h-5 text-gray-600 dark:text-gray-400 flex-shrink-0" />
              <span className="font-medium text-gray-900 dark:text-white">{t('footer.links.faq') || 'FAQ'}</span>
              <ChevronRight className="w-5 h-5 text-gray-400 ml-auto" />
            </button>
            <button
              type="button"
              onClick={() => navigate('/support')}
              className="flex items-center gap-3 p-3 rounded-xl border border-gray-200 dark:border-slate-600 hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors text-left"
            >
              <MessageCircle className="w-5 h-5 text-gray-600 dark:text-gray-400 flex-shrink-0" />
              <span className="font-medium text-gray-900 dark:text-white">{t('account.help.feedback')}</span>
              <ChevronRight className="w-5 h-5 text-gray-400 ml-auto" />
            </button>
            <a
              href="mailto:contact@ermits.com?subject=SocialCaution Support Request"
              className="flex items-center gap-3 p-3 rounded-xl border border-gray-200 dark:border-slate-600 hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors text-left"
            >
              <Mail className="w-5 h-5 text-gray-600 dark:text-gray-400 flex-shrink-0" />
              <span className="font-medium text-gray-900 dark:text-white">{t('account.help.contact')}</span>
              <ChevronRight className="w-5 h-5 text-gray-400 ml-auto" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacySettings;

