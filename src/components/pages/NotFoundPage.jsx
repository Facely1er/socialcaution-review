import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertCircle, Home, ArrowLeft } from 'lucide-react';
import SEOHead from '../common/SEOHead';
import { useTranslation } from '../../contexts/TranslationContext';

const NotFoundPage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <>
      <SEOHead
        title="Page Not Found - SocialCaution"
        description="The page you're looking for doesn't exist."
        keywords="404, page not found"
      />
      <div className="min-h-[calc(100vh-4rem)] bg-gray-50 dark:bg-slate-900 flex items-center justify-center px-4 py-8">
        <div className="max-w-md w-full text-center">
          <div className="mb-8">
            <h1 className="page-title mb-4 sm:mb-6 flex items-center justify-center gap-3 sm:gap-4">
              <div className="p-1.5 sm:p-2 md:p-2.5 bg-gradient-to-br from-red-500 to-red-600 rounded-lg shadow-md flex-shrink-0 flex items-center justify-center">
                <AlertCircle className="w-5 h-5 sm:w-5 sm:h-5 md:w-6 md:h-6 text-white" />
              </div>
              <span className="leading-tight">{t('notFound.title')}</span>
            </h1>
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
              {t('notFound.heading')}
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-8">
              {t('notFound.message')}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center justify-center space-x-2 px-6 py-3 bg-gray-200 dark:bg-slate-700 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-slate-600 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>{t('notFound.goBack')}</span>
            </button>
            <button
              onClick={() => navigate('/')}
              className="flex items-center justify-center space-x-2 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              <Home className="w-5 h-5" />
              <span>{t('notFound.goHome')}</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default NotFoundPage;

