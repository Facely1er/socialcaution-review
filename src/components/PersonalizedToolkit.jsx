import { useNavigate } from 'react-router-dom';
import { 
  ArrowRight, Database, Shield, Wrench,
  Fingerprint, CheckCircle, Radar, TrendingUp, Info, BarChart3,
} from 'lucide-react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { triggerButtonHaptic } from '../utils/haptics';
import SEOHead from './common/SEOHead';
import { useTranslation } from '../contexts/TranslationContext';

/**
 * PersonalizedToolkit - Privacy Tools Hub
 * Central place for privacy protection tools
 * Shows: Intelligence tools, Action tools (Reports & Downloads deferred for v1)
 * Part of the user journey: Home → Services → Dashboard → Tools → More
 */
const PersonalizedToolkit = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [inventory] = useLocalStorage('socialcaution_inventory', []);
  const [selectedServices] = useLocalStorage('socialcaution_services', []);
  const [assessmentResults] = useLocalStorage('socialcaution_results', null);
  
  const inventoryCount = Array.isArray(inventory) ? inventory.length : 0;
  const servicesCount = Array.isArray(selectedServices) ? selectedServices.length : 0;
  const hasAssessment = assessmentResults !== null;

  const handleNavigate = (path) => {
    triggerButtonHaptic();
    navigate(path);
  };

  return (
    <>
      <SEOHead
        title={t('common.navigation.privacyToolkit') + ' - SocialCaution'}
        description={t('common.toolkit.subtitle')}
        keywords="privacy tools, data inventory, data broker removal, privacy radar, privacy trends"
      />
      
      <style>{`
        /* Ensure all buttons and their content align consistently */
        .toolkit-button {
          box-sizing: border-box !important;
          margin-left: 0 !important;
          margin-right: 0 !important;
          padding: 1.25rem !important;
        }
        .toolkit-button > *:first-child {
          margin: 0 !important;
          padding: 0 !important;
        }
        /* Ensure all icon containers are exactly the same size */
        .toolkit-button [class*="w-14"][class*="h-14"] {
          width: 3.5rem !important;
          height: 3.5rem !important;
          min-width: 3.5rem !important;
          min-height: 3.5rem !important;
          margin: 0 !important;
          padding: 0.75rem !important;
          box-sizing: border-box !important;
        }
        /* Ensure all flex containers inside buttons align the same */
        .toolkit-button > div[class*="flex"][class*="items-start"] {
          margin: 0 !important;
          padding: 0 !important;
          width: 100% !important;
        }
      `}</style>

      <section className="pt-8 sm:pt-12 pb-4 sm:pb-6 bg-gradient-to-br from-gray-50 via-red-50/30 to-gray-50 dark:from-slate-900 dark:via-red-950/20 dark:to-slate-900">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb omitted on toolkit root to avoid duplicating "Privacy Toolkit" already shown in SecondaryNavigationBar */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Wrench className="w-8 h-8 text-red-600 dark:text-red-400" />
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">
                {t('common.navigation.privacyToolkit') || 'Privacy Toolkit'}
              </h1>
            </div>
            <p className="text-base text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              {t('common.toolkit.heroDescription')}
            </p>
          </div>
        </div>
      </section>
      
      <div className="bg-gray-50 dark:bg-slate-900 pb-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Intelligence Section */}
          <div className="mb-6">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-2 text-left">{t('common.toolkit.sectionIntelligence')}</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 text-left">
              {t('common.toolkit.sectionIntelligenceDesc')}
            </p>
            <div className="space-y-5">
              {/* Privacy Radar */}
              <button
                onClick={() => handleNavigate('/privacy-radar')}
                className="toolkit-button w-full text-left bg-white dark:bg-slate-800 rounded-xl p-5 shadow-sm border-2 border-blue-200 dark:border-blue-900/50 hover:border-blue-400 dark:hover:border-blue-700 transition-all active:scale-[0.98] m-0"
              >
                <div className="flex items-start gap-4 m-0 p-0">
                  <div className="w-14 h-14 p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex-shrink-0 flex items-center justify-center m-0">
                    <Radar className="w-7 h-7 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="flex-1 min-w-0 m-0">
                    <div className="flex items-center justify-between gap-2">
                      <h2 className="text-lg font-bold text-gray-900 dark:text-white text-left">
                        {t('common.toolkit.privacyRadarTitle')}
                      </h2>
                      <ArrowRight className="w-5 h-5 text-gray-400 dark:text-gray-500 flex-shrink-0" />
                    </div>
                    <p className="body-text text-gray-600 dark:text-gray-400 mt-1 text-left">
                      {t('privacyRadar.privacyRadarDescription')}
                    </p>
                    <div className="flex items-center gap-4 mt-3">
                      {servicesCount > 0 || hasAssessment || inventoryCount > 0 ? (
                        <div className="flex items-center gap-1.5 small-text text-blue-600 dark:text-blue-400 font-medium">
                          <CheckCircle className="w-4 h-4" />
                          <span>{t('common.toolkit.readyToUse')}</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1.5 small-text text-gray-500 dark:text-gray-400 font-medium">
                          <Info className="w-4 h-4" />
                          <span>{t('common.toolkit.selectServicesToActivate')}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </button>

              {/* Privacy Trends */}
              <button
                onClick={() => handleNavigate('/privacy-regulations')}
                className="toolkit-button w-full text-left bg-white dark:bg-slate-800 rounded-xl p-5 shadow-sm border-2 border-purple-200 dark:border-purple-900/50 hover:border-purple-400 dark:hover:border-purple-700 transition-all active:scale-[0.98] m-0"
              >
                <div className="flex items-start gap-4 m-0 p-0">
                  <div className="w-14 h-14 p-3 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex-shrink-0 flex items-center justify-center m-0">
                    <TrendingUp className="w-7 h-7 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div className="flex-1 min-w-0 m-0">
                    <div className="flex items-center justify-between gap-2">
                      <h2 className="text-lg font-bold text-gray-900 dark:text-white text-left">
                        {t('common.toolkit.privacyTrendsTitle')}
                      </h2>
                      <ArrowRight className="w-5 h-5 text-gray-400 dark:text-gray-500 flex-shrink-0" />
                    </div>
                    <p className="body-text text-gray-600 dark:text-gray-400 mt-1 text-left">
                      {t('common.toolkit.privacyTrendsDesc')}
                    </p>
                  </div>
                </div>
              </button>

              {/* Digital Footprint Analyzer */}
              <button
                onClick={() => handleNavigate('/digital-footprint-analysis')}
                className="toolkit-button w-full text-left bg-white dark:bg-slate-800 rounded-xl p-5 shadow-sm border-2 border-indigo-200 dark:border-indigo-900/50 hover:border-indigo-400 dark:hover:border-indigo-700 transition-all active:scale-[0.98] m-0"
              >
                <div className="flex items-start gap-4 m-0 p-0">
                  <div className="w-14 h-14 p-3 bg-indigo-100 dark:bg-indigo-900/30 rounded-xl flex-shrink-0 flex items-center justify-center m-0">
                    <BarChart3 className="w-7 h-7 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <div className="flex-1 min-w-0 m-0">
                    <div className="flex items-center justify-between gap-2">
                      <h2 className="text-lg font-bold text-gray-900 dark:text-white text-left">
                        {t('common.toolkit.personalDataExposureCheckTitle')}
                      </h2>
                      <ArrowRight className="w-5 h-5 text-gray-400 dark:text-gray-500 flex-shrink-0" />
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 text-left">
                      {t('common.toolkit.personalDataExposureCheckDesc')}
                    </p>
                    <div className="flex items-center gap-4 mt-3">
                      {servicesCount > 0 ? (
                        <div className="flex items-center gap-1.5 text-xs text-indigo-600 dark:text-indigo-400 font-medium">
                          <CheckCircle className="w-3.5 h-3.5" />
                          <span>{t('common.toolkit.servicesReady', { count: servicesCount, plural: servicesCount !== 1 ? 's' : '' })}</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400 font-medium">
                          <Info className="w-3.5 h-3.5" />
                          <span>{t('common.toolkit.selectServicesToAnalyze')}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </button>
            </div>
          </div>

          {/* Actions Section */}
          <div className="mb-6">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-2 text-left">{t('common.toolkit.sectionActions')}</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 text-left">
              {t('common.toolkit.sectionActionsDesc')}
            </p>
            <div className="space-y-5">

              {/* Personal Data Inventory */}
              <button
                onClick={() => handleNavigate('/tools/personal-data-inventory')}
                className="toolkit-button w-full text-left bg-white dark:bg-slate-800 rounded-xl p-5 shadow-sm border-2 border-purple-200 dark:border-purple-900/50 hover:border-purple-400 dark:hover:border-purple-700 transition-all active:scale-[0.98] m-0"
              >
              <div className="flex items-start gap-4 m-0 p-0">
                <div className="w-14 h-14 p-3 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex-shrink-0 flex items-center justify-center m-0">
                  <Database className="w-7 h-7 text-purple-600 dark:text-purple-400" />
                </div>
                <div className="flex-1 min-w-0 m-0">
                  <div className="flex items-center justify-between gap-2">
                    <h2 className="text-lg font-bold text-gray-900 dark:text-white text-left">
                      {t('common.toolkit.personalDataInventoryTitle')}
                    </h2>
                    <ArrowRight className="w-5 h-5 text-gray-400 dark:text-gray-500 flex-shrink-0" />
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 text-left">
                    {t('common.toolkit.personalDataInventoryDesc')}
                  </p>
                  <div className="flex items-center gap-4 mt-3">
                    {inventoryCount > 0 ? (
                      <div className="flex items-center gap-1.5 text-xs text-green-600 dark:text-green-400 font-medium">
                        <CheckCircle className="w-3.5 h-3.5" />
                        <span>{t('common.toolkit.itemsInInventory', { count: inventoryCount })}</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1.5 text-xs text-purple-600 dark:text-purple-400 font-medium">
                        <Database className="w-3.5 h-3.5" />
                        <span>{t('common.toolkit.addFirstItem')}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </button>

              {/* Data Broker Removal */}
              <button
                onClick={() => handleNavigate('/tools/data-broker-removal')}
                className="toolkit-button w-full text-left bg-white dark:bg-slate-800 rounded-xl p-5 shadow-sm border-2 border-orange-200 dark:border-orange-900/50 hover:border-orange-400 dark:hover:border-orange-700 transition-all active:scale-[0.98] m-0"
              >
              <div className="flex items-start gap-4 m-0 p-0">
                <div className="w-14 h-14 p-3 bg-orange-100 dark:bg-orange-900/30 rounded-xl flex-shrink-0 flex items-center justify-center m-0">
                  <Fingerprint className="w-7 h-7 text-orange-600 dark:text-orange-400" />
                </div>
                <div className="flex-1 min-w-0 m-0">
                  <div className="flex items-center justify-between gap-2">
                    <h2 className="text-lg font-bold text-gray-900 dark:text-white text-left">
                      {t('common.toolkit.dataBrokerRemovalTitle')}
                    </h2>
                    <ArrowRight className="w-5 h-5 text-gray-400 dark:text-gray-500 flex-shrink-0" />
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 text-left">
                    {t('common.toolkit.dataBrokerRemovalDesc')}
                  </p>
                  <div className="flex items-center gap-4 mt-3">
                    <div className="flex items-center gap-1.5 text-xs text-orange-600 dark:text-orange-400 font-medium">
                      <Shield className="w-3.5 h-3.5" />
                      <span>{t('common.toolkit.directLinksOnDevice')}</span>
                    </div>
                  </div>
                </div>
              </div>
              </button>

              {/* Privacy Settings Optimization & Breach Response Kit: Deferred for v1.
                  These were download-only; intended as interactive pages. Overlaps with
                  Privacy Radar/Trends (settings) and is situational (breach). Add as
                  /tools/privacy-settings-guide and /tools/breach-response when built. */}
            </div>
          </div>

          {/* Reports & Downloads: Deferred for v1.
              PDFs don't exist (public/products has only .gitkeep). "View All" /purchases route missing.
              Add when: (1) static PDFs placed in public/products/, or (2) on-demand generation built. */}

          {/* Info Section */}
          <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-700">
            <div className="flex items-start gap-4">
              <Shield className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="text-sm font-semibold text-blue-900 dark:text-blue-100 mb-1">
                  {t('common.toolkit.privacyFirstTitle')}
                </h3>
                <p className="text-xs text-blue-800 dark:text-blue-200">
                  {t('common.toolkit.privacyFirstDesc')}
                </p>
              </div>
            </div>
          </div>

          {/* Tools expanding note - at bottom */}
          <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-700">
            <div className="flex items-start gap-4">
              <Info className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="text-sm font-semibold text-blue-900 dark:text-blue-100 mb-1">
                  {t('common.toolkit.toolsExpanding')}
                </h3>
                <p className="text-xs text-blue-800 dark:text-blue-200">
                  {t('common.toolkit.toolsExpandingDesc')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

// Set display name for React DevTools
PersonalizedToolkit.displayName = 'PersonalizedToolkit';

export default PersonalizedToolkit;
