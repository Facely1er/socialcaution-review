import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, Circle, Lock, ArrowRight, Shield, Target, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTranslation } from '../../contexts/TranslationContext';

const CompactProgressTracker = ({ userProgress }) => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  // Check service selection status
  const selectedServices = JSON.parse(localStorage.getItem('socialcaution_services') || '[]');
  const hasServices = Array.isArray(selectedServices) && selectedServices.length > 0;
  const hasConcerns = userProgress.personaData?.customConcerns || userProgress.personaData?.primary;

  const steps = [
    {
      id: 'concerns',
      title: t('homePage.journey.setConcerns'),
      completed: hasConcerns,
      required: false,
      action: () => navigate('/privacy-settings')
    },
    {
      id: 'assessment',
      title: t('homePage.journey.completeAssessment'),
      completed: userProgress.hasAssessment,
      required: true,
      action: () => navigate('/assessment/full')
    },
    {
      id: 'services',
      title: t('homePage.journey.selectServices'),
      completed: hasServices,
      required: true,
      action: () => navigate('/service-catalog')
    },
    {
      id: 'dashboard',
      title: 'Explore Dashboard',
      completed: userProgress.hasAssessment && hasServices,
      required: false,
      action: null // Already on dashboard
    }
  ];

  const completedSteps = steps.filter(s => s.completed).length;
  const totalSteps = steps.length;
  const progressPercentage = (completedSteps / totalSteps) * 100;

  // Find next incomplete step
  const nextStep = steps.find(s => !s.completed);

  // If all complete, don't show tracker
  if (completedSteps === totalSteps) {
    return null;
  }

  return (
    <motion.div
      className="bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 dark:from-purple-900/20 dark:via-blue-900/20 dark:to-indigo-900/20 rounded-xl p-6 border-2 border-purple-200 dark:border-purple-800 mb-6 shadow-lg"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0">
          <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center">
            <MapPin className="w-6 h-6 text-white" />
          </div>
        </div>
        
        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">
              {t('homePage.journey.title')}
            </h3>
            <span className="text-sm font-medium text-purple-600 dark:text-purple-400">
              {completedSteps} of {totalSteps} complete
            </span>
          </div>
          
          <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
            Complete your privacy setup to unlock personalized insights and recommendations
          </p>

          {/* Progress Bar */}
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 mb-4 overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-purple-500 via-blue-500 to-indigo-500 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progressPercentage}%` }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            />
          </div>

          {/* Steps Overview */}
          <div className="flex items-center gap-2 mb-4 flex-wrap">
            {steps.map((step, index) => (
              <div
                key={step.id}
                className="flex items-center"
              >
                {step.completed ? (
                  <CheckCircle className="w-5 h-5 text-green-500" />
                ) : step.required ? (
                  <Circle className="w-5 h-5 text-gray-400" />
                ) : (
                  <Circle className="w-5 h-5 text-gray-300 dark:text-gray-600" />
                )}
                {index < steps.length - 1 && (
                  <div className={`w-6 h-0.5 mx-1 ${
                    step.completed ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'
                  }`} />
                )}
              </div>
            ))}
          </div>

          {/* Next Step CTA */}
          {nextStep && nextStep.action && (
            <div className="flex items-center justify-between bg-white dark:bg-slate-800 rounded-lg p-3 border border-purple-200 dark:border-purple-700">
              <div className="flex items-center gap-2">
                <div className="flex-shrink-0 w-8 h-8 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center">
                  {nextStep.id === 'assessment' ? (
                    <Target className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                  ) : (
                    <Shield className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                  )}
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Next Step:</p>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">{nextStep.title}</p>
                </div>
              </div>
              <button
                onClick={nextStep.action}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium text-sm flex items-center gap-2"
              >
                Continue
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default CompactProgressTracker;


