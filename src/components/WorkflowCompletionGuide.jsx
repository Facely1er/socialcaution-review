import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, Circle, ArrowRight, Users, Target, Shield, AlertCircle, MapPin, TrendingUp, Lock, LayoutDashboard, ArrowDown, Navigation2, ShoppingCart } from 'lucide-react';
import { useTranslation } from '../contexts/TranslationContext';

const WorkflowCompletionGuide = ({ workflowStatus }) => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  
  const steps = [
    {
      id: 'services',
      title: t('common.workflow.completionGuide.steps.browseServiceCatalog.title'),
      description: t('common.workflow.completionGuide.steps.browseServiceCatalog.description'),
      completed: workflowStatus.step2_services,
      action: () => navigate('/service-catalog'),
      icon: ShoppingCart,
      color: 'blue',
      status: 'required',
      recommendedTools: ['Services Monitoring']
    },
    {
      id: 'concerns',
      title: t('common.workflow.completionGuide.steps.setPrivacyConcerns.title'),
      description: t('common.workflow.completionGuide.steps.setPrivacyConcerns.description'),
      completed: workflowStatus.step3_concerns,
      action: () => navigate('/privacy-settings'),
      icon: Shield,
      color: 'green',
      optional: true,
      status: 'optional'
    },
    {
      id: 'assessment',
      title: t('common.workflow.completionGuide.steps.completeAssessment.title'),
      description: t('common.workflow.completionGuide.steps.completeAssessment.description'),
      completed: workflowStatus.step4_assessment,
      action: () => navigate('/assessment/full'),
      icon: Target,
      color: 'red',
      status: 'required',
      recommendedTools: ['Complete Privacy Assessment']
    },
    {
      id: 'dashboard',
      title: t('common.workflow.completionGuide.steps.accessDashboard.title'),
      description: t('common.workflow.completionGuide.steps.accessDashboard.description'),
      completed: workflowStatus.isComplete,
      action: () => navigate('/dashboard'),
      icon: LayoutDashboard,
      color: 'gray',
      status: 'locked',
      recommendedTools: ['Risk Profile', 'Action Plan'],
      locked: !workflowStatus.isComplete
    }
  ];

  const completedCount = steps.filter(s => s.completed && !s.optional).length;
  const totalRequired = steps.filter(s => !s.optional).length;
  const progressPercentage = Math.round((completedCount / totalRequired) * 100);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-3">
            <Navigation2 className="w-12 h-12 text-purple-600 dark:text-purple-400" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-3">
            {t('common.workflow.completionGuide.title')}
          </h1>
          
          {/* Progress Bar - Compact */}
          <div className="max-w-md mx-auto">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                {t('common.workflow.completionGuide.progressLabel', { 
                  completed: completedCount, 
                  total: totalRequired 
                })}
              </span>
              <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                {progressPercentage}%
              </span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-slate-700 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-purple-500 via-indigo-500 to-purple-600 h-2 rounded-full transition-all duration-500"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>
        </div>

        {/* Map-Style Journey Layout */}
        <div className="relative bg-gradient-to-br from-gray-50 to-gray-100 dark:from-slate-800 dark:to-slate-900 rounded-2xl p-6 sm:p-8 border-2 border-gray-200 dark:border-slate-700 shadow-xl">
          {/* Map Background Pattern */}
          <div className="absolute inset-0 opacity-5 dark:opacity-10">
            <div className="absolute inset-0" style={{
              backgroundImage: `radial-gradient(circle, #6366f1 1px, transparent 1px)`,
              backgroundSize: '40px 40px'
            }}></div>
          </div>

          {/* Journey Path - Map Style with Connecting Paths */}
          <div className="relative">

            {/* Step Cards - Grid Layout */}
            <div className="relative grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" style={{ zIndex: 1 }}>
              {steps && Array.isArray(steps) && steps.length > 0 ? steps.map((step, index) => {
                const StepIcon = step.icon;
                const isCompleted = step.completed;
                const isOptional = step.optional;
                const isLocked = step.locked;
                const status = step.status || (isCompleted ? 'completed' : isLocked ? 'locked' : 'required');
                
                // Determine colors
                let borderColor = 'border-gray-300 dark:border-slate-600';
                let bgColor = 'bg-white dark:bg-slate-800';
                let stepNumberBg = 'bg-gray-300 dark:bg-slate-600';
                let stepNumberText = 'text-white';
                let iconColor = 'text-gray-600 dark:text-gray-400';
                
                if (status === 'completed') {
                  borderColor = 'border-green-500';
                  bgColor = 'bg-green-50 dark:bg-green-900/20';
                  stepNumberBg = 'bg-green-500';
                  iconColor = 'text-green-600 dark:text-green-400';
                } else if (status === 'required') {
                  borderColor = 'border-red-500';
                  bgColor = 'bg-red-50 dark:bg-red-900/20';
                  stepNumberBg = 'bg-red-500';
                  iconColor = 'text-red-600 dark:text-red-400';
                } else if (status === 'locked') {
                  borderColor = 'border-gray-400 dark:border-gray-600';
                  bgColor = 'bg-gray-100 dark:bg-slate-800/50';
                  stepNumberBg = 'bg-gray-400 dark:bg-gray-600';
                  iconColor = 'text-gray-400 dark:text-gray-500';
                }
                
                return (
                  <div key={step.id} className="relative">
                    {/* Map Pin Marker */}
                    <div className="absolute -top-2 -right-2 z-10">
                      <MapPin className={`w-6 h-6 ${
                        status === 'completed' ? 'text-green-500' :
                        status === 'required' ? 'text-red-500' :
                        'text-gray-400'
                      }`} fill="currentColor" />
                    </div>

                    {/* Step Card - Compact */}
                    <div className={`${bgColor} rounded-xl p-4 border-2 ${borderColor} transition-all hover:shadow-xl hover:scale-105 ${
                      isLocked ? 'opacity-75' : ''
                    }`}>
                      {/* Step Header */}
                      <div className="flex items-start gap-3 mb-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${stepNumberBg} ${stepNumberText} flex-shrink-0 shadow-md`}>
                          {status === 'completed' ? (
                            <CheckCircle className="w-5 h-5" />
                          ) : status === 'locked' ? (
                            <Lock className="w-5 h-5" />
                          ) : (
                            <span className="text-sm font-bold">{index + 1}</span>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1 flex-wrap">
                            <StepIcon className={`w-4 h-4 flex-shrink-0 ${iconColor}`} />
                            <h3 className="text-sm font-bold text-gray-900 dark:text-white leading-tight">
                              {step.title}
                            </h3>
                          </div>
                          <span className={`inline-block px-2 py-0.5 text-[10px] font-semibold rounded-full ${
                            status === 'completed'
                              ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                              : status === 'required'
                              ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300'
                              : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
                          }`}>
                            {status === 'completed' ? '✓' : status === 'required' ? '!' : '🔒'}
                          </span>
                          {isOptional && (
                            <span className="ml-1 text-[10px] text-gray-500 dark:text-gray-400">(Optional)</span>
                          )}
                        </div>
                      </div>
                      
                      {/* Description */}
                      <p className="text-xs text-gray-600 dark:text-gray-300 mb-3 line-clamp-2">
                        {step.description}
                      </p>

                      {/* Recommended Tools - Compact */}
                      {step.recommendedTools && step.recommendedTools.length > 0 && (
                        <div className="mb-3">
                          <div className="flex flex-wrap gap-1">
                            {step.recommendedTools.slice(0, 2).map((tool, toolIndex) => (
                              <span
                                key={toolIndex}
                                className={`px-2 py-0.5 text-[10px] font-medium rounded ${
                                  isLocked
                                    ? 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
                                    : status === 'required'
                                    ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300'
                                    : 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                                }`}
                              >
                                {tool.length > 20 ? tool.substring(0, 20) + '...' : tool}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Action Button - Compact */}
                      {status === 'completed' ? (
                        <button
                          onClick={step.action}
                          className="w-full px-3 py-1.5 bg-green-500 text-white rounded-lg text-xs font-medium transition-all hover:bg-green-600 flex items-center justify-center gap-1"
                        >
                          {t('common.workflow.completionGuide.actions.view')} <ArrowRight className="w-3 h-3" />
                        </button>
                      ) : isLocked ? (
                        <div className="w-full px-3 py-1.5 bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 rounded-lg text-xs font-medium text-center">
                          {t('common.workflow.completionGuide.actions.locked')}
                        </div>
                      ) : (
                        <button
                          onClick={step.action}
                          className={`w-full px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center justify-center gap-1 ${
                            status === 'required'
                              ? 'bg-red-500 text-white hover:bg-red-600'
                              : 'bg-gray-200 dark:bg-slate-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-slate-600'
                          }`}
                        >
                          {t('common.workflow.completionGuide.actions.start')} <ArrowRight className="w-3 h-3" />
                        </button>
                      )}
                    </div>

                    {/* Mobile Connecting Arrow */}
                    {index < steps.length - 1 && (
                      <div className="lg:hidden flex justify-center my-2">
                        <ArrowDown className={`w-5 h-5 ${
                          isCompleted ? 'text-green-500' : 'text-gray-400'
                        }`} />
                      </div>
                    )}
                  </div>
                );
              }) : null}
            </div>
          </div>
        </div>

        {/* Info Box */}
        <div className="mt-8 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-xl p-6">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
                {t('common.workflow.completionGuide.whyCompleteTitle')}
              </h4>
              <p className="text-sm text-blue-800 dark:text-blue-200 mb-2">
                {t('common.workflow.completionGuide.whyCompleteDescription')}
              </p>
              <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1 list-disc list-inside">
                <li>{t('common.workflow.completionGuide.unlock1')}</li>
                <li>{t('common.workflow.completionGuide.unlock2')}</li>
                <li>{t('common.workflow.completionGuide.unlock3')}</li>
                <li>{t('common.workflow.completionGuide.unlock4')}</li>
              </ul>
              <p className="text-sm text-blue-800 dark:text-blue-200 mt-3">
                <strong>{t('common.workflow.completionGuide.note')}</strong> {t('common.workflow.completionGuide.noteText')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkflowCompletionGuide;

