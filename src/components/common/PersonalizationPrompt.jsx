import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Target, Users, ArrowRight, Sparkles } from 'lucide-react';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { analytics } from '../../utils/analytics';
import { useTranslation } from '../../contexts/TranslationContext';

/**
 * PersonalizationPrompt Component
 * Shows contextual prompts for persona/assessment based on user behavior
 * 
 * Triggers:
 * - After selecting 3+ services: "Want personalized insights? Select your persona"
 * - After viewing exposure dashboard: "Want deeper analysis? Take our assessment"
 * - After selecting persona: "Want detailed insights? Complete the assessment"
 */
const PersonalizationPrompt = ({ 
  trigger = 'services-selected', // 'services-selected', 'exposure-viewed', 'persona-selected'
  servicesCount = 0,
  onDismiss
}) => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [persona] = useLocalStorage('socialcaution_persona', null);
  const [assessmentResults] = useLocalStorage('socialcaution_results', null);
  const [dismissed, setDismissed] = useState(false);
  const [dismissedPrompts, setDismissedPrompts] = useLocalStorage('socialcaution_dismissed_prompts', {});

  // Check if this specific prompt was dismissed
  useEffect(() => {
    const promptKey = `prompt_${trigger}`;
    if (dismissedPrompts[promptKey]) {
      const dismissedTime = dismissedPrompts[promptKey];
      const daysSinceDismissed = (Date.now() - dismissedTime) / (1000 * 60 * 60 * 24);
      
      // Show again after 7 days
      if (daysSinceDismissed < 7) {
        setDismissed(true);
      } else {
        // Clear old dismissal
        setDismissedPrompts(prev => {
          const updated = { ...prev };
          delete updated[promptKey];
          return updated;
        });
      }
    }
  }, [trigger, dismissedPrompts, setDismissedPrompts]);

  const handleDismiss = () => {
    const promptKey = `prompt_${trigger}`;
    setDismissedPrompts(prev => ({
      ...prev,
      [promptKey]: Date.now()
    }));
    setDismissed(true);
    
    if (onDismiss) {
      onDismiss();
    }

    // Track dismissal
    try {
      if (analytics && typeof analytics.trackEvent === 'function') {
        analytics.trackEvent('personalization_prompt_dismissed', {
          trigger,
          services_count: servicesCount,
          has_persona: !!persona,
          has_assessment: !!assessmentResults
        });
      }
    } catch (error) {
      if (import.meta.env.DEV) {
        console.warn('Analytics tracking failed:', error);
      }
    }
  };

  const handleAction = (actionType) => {
    // Track action
    try {
      if (analytics && typeof analytics.trackEvent === 'function') {
        analytics.trackEvent('personalization_prompt_action', {
          trigger,
          action: actionType,
          services_count: servicesCount
        });
      }
    } catch (error) {
      if (import.meta.env.DEV) {
        console.warn('Analytics tracking failed:', error);
      }
    }

    // Navigate based on action
    if (actionType === 'assessment') {
      navigate('/assessment/full');
    }
  };

  // Don't show if dismissed
  if (dismissed) return null;

  // Determine which prompt to show based on trigger and user state
  let promptConfig = null;

  if (trigger === 'exposure-viewed' && !assessmentResults) {
    promptConfig = {
      title: t('serviceCatalog.personalizationPrompt.wantDeeperAnalysis'),
      description: t('serviceCatalog.personalizationPrompt.takeAssessmentDescription'),
      primaryAction: {
        label: t('serviceCatalog.personalizationPrompt.takeAssessment'),
        action: 'assessment',
        icon: Target
      },
      secondaryAction: {
        label: 'View Services Monitoring',
        action: () => navigate('/service-catalog')
      }
    };
  } else if (trigger === 'persona-selected' && persona && !assessmentResults) {
    promptConfig = {
      title: 'Want Detailed Insights?',
      description: 'Complete a privacy assessment to get a comprehensive analysis combining your persona profile with your service exposure.',
      primaryAction: {
        label: 'Take Assessment',
        action: 'assessment',
        icon: Target
      },
      secondaryAction: {
        label: 'View Dashboard',
        action: () => navigate('/dashboard')
      }
    };
  }

  // Don't show if no valid prompt config
  if (!promptConfig) return null;

  const PrimaryIcon = promptConfig.primaryAction.icon;

  return (
    <div className="bg-gradient-to-r from-purple-50 via-blue-50 to-indigo-50 dark:from-purple-900/20 dark:via-blue-900/20 dark:to-indigo-900/20 rounded-xl p-6 mb-6 border-2 border-purple-200 dark:border-purple-800 relative">
      <button
        onClick={handleDismiss}
        className="absolute top-4 right-4 p-1.5 rounded-lg hover:bg-white/50 dark:hover:bg-gray-800/50 transition-colors"
        aria-label="Dismiss prompt"
        type="button"
      >
        <X className="w-4 h-4 text-gray-500 dark:text-gray-400" />
      </button>

      <div className="flex items-start gap-4 pr-8">
        <div className="p-3 rounded-full bg-purple-100 dark:bg-purple-900/30 flex-shrink-0">
          <Sparkles className="w-6 h-6 text-purple-600 dark:text-purple-400" />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
            {promptConfig.title}
          </h3>
          <p className="text-sm text-gray-700 dark:text-gray-300 mb-4">
            {promptConfig.description}
          </p>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => handleAction(promptConfig.primaryAction.action)}
              className="px-5 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all font-medium flex items-center gap-2 shadow-lg hover:shadow-xl transform hover:scale-105"
              type="button"
            >
              <PrimaryIcon className="w-4 h-4" />
              {promptConfig.primaryAction.label}
              <ArrowRight className="w-4 h-4" />
            </button>
            {promptConfig.secondaryAction && (
              <button
                onClick={typeof promptConfig.secondaryAction.action === 'function' 
                  ? promptConfig.secondaryAction.action 
                  : () => navigate(promptConfig.secondaryAction.action)}
                className="px-5 py-2.5 bg-white dark:bg-slate-700 border-2 border-purple-600 text-purple-600 dark:text-purple-400 rounded-lg hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-colors font-medium"
                type="button"
              >
                {promptConfig.secondaryAction.label}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PersonalizationPrompt;

