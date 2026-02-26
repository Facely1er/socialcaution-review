import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertTriangle, Lock, Sparkles } from 'lucide-react';
import { canCreateAssessment, getAssessmentLimit } from '../../utils/featureGating';
import offlineStorage from '../../utils/offlineStorage';
import { useTranslation } from '../../contexts/TranslationContext';
import UpgradePrompt from './UpgradePrompt';

const AssessmentLimitChecker = ({ children, onLimitReached }) => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [userTier, setUserTier] = useState('free');
  const [assessmentCount, setAssessmentCount] = useState(0);
  const [showUpgrade, setShowUpgrade] = useState(false);
  const [limit, setLimit] = useState(-1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get user tier from localStorage or default to 'free'
    const tier = localStorage.getItem('socialcaution_tier') || 'free';
    setUserTier(tier);
    
    // Get assessment limit
    const assessmentLimit = getAssessmentLimit(tier);
    setLimit(assessmentLimit);
    
    // Count existing assessments
    const countAssessments = async () => {
      try {
        const assessments = await offlineStorage.getAssessments();
        // Filter assessments from current month
        const currentMonth = new Date().getMonth();
        const currentYear = new Date().getFullYear();
        const thisMonthAssessments = assessments.filter(assessment => {
          const assessmentDate = new Date(assessment.completedAt);
          return assessmentDate.getMonth() === currentMonth && 
                 assessmentDate.getFullYear() === currentYear;
        });
        setAssessmentCount(thisMonthAssessments.length);
      } catch (error) {
        console.error('Error counting assessments:', error);
        // Fallback to localStorage count
        const storedResults = localStorage.getItem('socialcaution_results');
        if (storedResults) {
          setAssessmentCount(1);
        }
      } finally {
        setLoading(false);
      }
    };
    
    countAssessments();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">{t('common.loading.text')}</p>
        </div>
      </div>
    );
  }

  if (limit !== -1 && assessmentCount >= limit) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-6 mb-6">
          <div className="flex items-start">
            <AlertTriangle className="w-6 h-6 text-yellow-600 dark:text-yellow-400 mr-3 flex-shrink-0 mt-1" />
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-yellow-900 dark:text-yellow-100 mb-2">
                {t('common.assessmentLimit.title')}
              </h3>
              <p className="text-yellow-800 dark:text-yellow-200 mb-4">
                {t('common.assessmentLimit.description', {
                  limit: limit,
                  plural: limit !== 1 ? 's' : ''
                })}
              </p>
              <div className="flex gap-3 flex-wrap">
                <button
                  onClick={() => navigate('/pricing')}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  {t('common.assessmentLimit.upgradeToPremium')}
                </button>
                <button
                  onClick={() => navigate('/dashboard')}
                  className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                >
                  {t('common.assessmentLimit.viewDashboard')}
                </button>
              </div>
            </div>
          </div>
        </div>
        {showUpgrade && (
          <UpgradePrompt 
            feature="unlimited_assessments"
            currentTier={userTier}
            onClose={() => setShowUpgrade(false)}
          />
        )}
      </div>
    );
  }

  // Show warning if approaching limit
  if (limit !== -1 && assessmentCount >= limit - 1) {
    return (
      <div>
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-4">
          <div className="flex items-start">
            <Sparkles className="w-5 h-5 text-blue-600 dark:text-blue-400 mr-2 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm text-blue-800 dark:text-blue-200">
                {t('common.assessmentLimit.remainingWarning', {
                  remaining: limit - assessmentCount,
                  plural: (limit - assessmentCount) === 1 ? '' : 's',
                  upgradeLink: t('common.assessmentLimit.upgradeLink')
                }).split(t('common.assessmentLimit.upgradeLink')).map((part, idx) => {
                  if (idx === 0) {
                    return <React.Fragment key={idx}>{part}</React.Fragment>;
                  }
                  return (
                    <React.Fragment key={idx}>
                      <button
                        onClick={() => navigate('/pricing')}
                        className="ml-1 underline font-medium"
                      >
                        {t('common.assessmentLimit.upgradeLink')}
                      </button>
                      {part}
                    </React.Fragment>
                  );
                })}
              </p>
            </div>
          </div>
        </div>
        {children}
      </div>
    );
  }

  return children;
};

export default AssessmentLimitChecker;

