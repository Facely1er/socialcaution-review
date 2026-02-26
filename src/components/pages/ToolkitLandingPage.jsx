import React from 'react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Wrench } from 'lucide-react';
import { useTranslation } from '../../contexts/TranslationContext';

const ToolkitLandingPage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  // Redirect to the actual toolkit page
  useEffect(() => {
    navigate('/toolkit', { replace: true });
  }, [navigate]);

  // Show loading state briefly while redirecting
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 flex items-center justify-center">
      <div className="text-center max-w-md">
        <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
          <Wrench className="w-8 h-8 text-purple-600 animate-spin" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
          {t('common.toolkit.loadingTitle')}
        </h2>
        <p className="text-gray-600 dark:text-gray-300 mb-4">
          {t('common.toolkit.redirectMessage')}
        </p>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
          <div className="bg-purple-500 h-2 rounded-full animate-pulse" style={{ width: '100%' }}></div>
        </div>
      </div>
    </div>
  );
};

export default ToolkitLandingPage;