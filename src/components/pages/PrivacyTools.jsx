import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Globe, Info } from 'lucide-react';
import SEOHead from '../common/SEOHead';
import BackButton from '../common/BackButton';
import { useTranslation } from '../../contexts/TranslationContext';

const PrivacyTools = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <>
      <SEOHead
        title={t('privacyToolsPage.seoTitle')}
        description={t('privacyToolsPage.seoDescription')}
        keywords="privacy tools, privacy resources, privacy guides"
      />
      <div className="min-h-screen bg-gray-50 dark:bg-slate-900 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <BackButton to="/" label={t('privacyToolsPage.backHome')} variant="button" />
          
          <div className="mt-8 bg-white dark:bg-slate-800 rounded-lg shadow-lg p-8">
            <div className="flex items-center gap-4 mb-6">
              <Globe className="w-8 h-8 text-accent" />
              <div>
                <h1 className="page-title">
                  {t('privacyToolsPage.title')}
                </h1>
                <p className="text-gray-600 dark:text-gray-300 mt-2">
                  {t('privacyToolsPage.subtitle')}
                </p>
              </div>
            </div>

            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6 mb-6">
              <div className="flex items-start gap-3">
                <Info className="w-6 h-6 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
                    {t('privacyToolsPage.toolsAvailableTitle')}
                  </h3>
                  <p className="text-blue-800 dark:text-blue-200 text-sm">
                    {t('privacyToolsPage.toolsAvailableDesc')}
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <button
                onClick={() => navigate('/service-catalog')}
                className="w-full px-6 py-3 bg-gradient-to-r from-accent to-accent-dark text-white font-semibold rounded-lg hover:from-accent-dark hover:to-accent transition-all"
              >
                {t('privacyToolsPage.exploreServices')}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PrivacyTools;

