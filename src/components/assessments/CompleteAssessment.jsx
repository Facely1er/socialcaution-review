import { useState, useEffect, useMemo } from 'react';
import { Target, Shield, Scale, ChevronLeft, ChevronRight, Info, BookOpen, Globe, AlertTriangle, Zap, TrendingUp, CheckCircle2 } from 'lucide-react';
import { analytics } from '../../utils/analytics.js';
import { useTranslation } from '../../contexts/TranslationContext';

const CompleteAssessment = ({ onComplete, breadcrumbs, backButton, themeToggle }) => {
  const { t } = useTranslation();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [animationState, setAnimationState] = useState('entering');
  const [currentSection, setCurrentSection] = useState('scenarios');
  const [actionReadinessScore, setActionReadinessScore] = useState(0);

  // Build questions from translations - memoized for performance
  const allQuestions = useMemo(() => {
    const buildQuestions = () => {
    const getQuestionData = (questionId) => {
      const questionKey = `completeAssessment.questions.${questionId}`;
      const questionText = t(`${questionKey}.question`);
      const explanationText = t(`${questionKey}.explanation`);
      
      // Get options
      const optionKeys = {
        phishingScenario: ['clickAndProvide', 'clickButVerify', 'verifyFirst', 'ignoreAndReport'],
        appPermissionScenario: ['acceptAll', 'readPolicy', 'selectivePermissions', 'declineAndFindAlternative'],
        dataBreachScenario: ['ignore', 'changePassword', 'comprehensiveResponse', 'fullRightsExercise'],
        socialMediaPrivacyScenario: ['acceptChange', 'adjustSettings', 'comprehensiveAudit', 'exerciseRights'],
        aiPrivacyAwareness: ['notConcerned', 'somewhatConcerned', 'veryConcerned', 'activelyManaging'],
        biometricDataAwareness: ['notAware', 'acceptAll', 'selectiveUse', 'minimizeBiometrics'],
        crossBorderDataTransfers: ['notAware', 'somewhatAware', 'awareAndSelective', 'activelyManaging'],
        privacyByDesignAwareness: ['notConsidered', 'sometimesConsidered', 'oftenConsidered', 'primaryFactor'],
        privacyGoals: ['reduceRisk', 'learnRights', 'minimizeFootprint', 'comprehensive'],
        timeCommitment: ['minimal', 'moderate', 'substantial', 'extensive'],
        biggestConcern: ['identityTheft', 'dataCollection', 'surveillance', 'reputation', 'futureRisks']
      };
      
      const options = (optionKeys[questionId] || []).map(optKey => {
        const optData = t(`${questionKey}.options.${optKey}`, { returnObjects: true });
        if (typeof optData === 'object' && optData !== null) {
          return {
            value: optKey,
            label: optData.label || '',
            actionItems: Array.isArray(optData.actionItems) ? optData.actionItems : [],
            risk: optData.risk,
            actionPriority: optData.actionPriority,
            goalCategory: optData.goalCategory,
            timeCategory: optData.timeCategory,
            concernCategory: optData.concernCategory
          };
        }
        return null;
      }).filter(Boolean);
      
      return { questionText, explanationText, options };
    };
    
    return [
      // PART 1: SCENARIO-BASED DECISION MAKING (4 questions)
      {
        id: 'phishingScenario',
        section: 'scenarios',
        sectionTitle: t('completeAssessment.sectionTitles.scenarios'),
        question: getQuestionData('phishingScenario').questionText,
        explanation: getQuestionData('phishingScenario').explanationText,
        category: 'security-awareness',
        options: (getQuestionData('phishingScenario').options && Array.isArray(getQuestionData('phishingScenario').options) ? getQuestionData('phishingScenario').options.map(opt => ({
          ...opt,
          risk: 'critical',
          actionPriority: opt.value === 'clickAndProvide' ? 'urgent' : opt.value === 'clickButVerify' ? 'high' : 'low'
        })) : [])
      },
      {
        id: 'appPermissionScenario',
        section: 'scenarios',
        sectionTitle: t('completeAssessment.sectionTitles.scenarios'),
        question: getQuestionData('appPermissionScenario').questionText,
        explanation: getQuestionData('appPermissionScenario').explanationText,
        category: 'data-minimization',
        options: (getQuestionData('appPermissionScenario').options && Array.isArray(getQuestionData('appPermissionScenario').options) ? getQuestionData('appPermissionScenario').options.map(opt => ({
          ...opt,
          risk: opt.value === 'acceptAll' ? 'critical' : opt.value === 'readPolicy' ? 'medium' : 'low',
          actionPriority: opt.value === 'acceptAll' ? 'urgent' : opt.value === 'readPolicy' ? 'medium' : 'low'
        })) : [])
      },
      {
        id: 'dataBreachScenario',
        section: 'scenarios',
        sectionTitle: t('completeAssessment.sectionTitles.scenarios'),
        question: getQuestionData('dataBreachScenario').questionText,
        explanation: getQuestionData('dataBreachScenario').explanationText,
        category: 'breach-response',
        options: (getQuestionData('dataBreachScenario').options && Array.isArray(getQuestionData('dataBreachScenario').options) ? getQuestionData('dataBreachScenario').options.map(opt => ({
          ...opt,
          risk: opt.value === 'ignore' ? 'critical' : opt.value === 'changePassword' ? 'high' : 'low',
          actionPriority: opt.value === 'ignore' ? 'urgent' : opt.value === 'changePassword' ? 'high' : 'low'
        })) : [])
      },
      {
        id: 'socialMediaPrivacyScenario',
        section: 'scenarios',
        sectionTitle: t('completeAssessment.sectionTitles.scenarios'),
        question: getQuestionData('socialMediaPrivacyScenario').questionText,
        explanation: getQuestionData('socialMediaPrivacyScenario').explanationText,
        category: 'privacy-controls',
        options: (getQuestionData('socialMediaPrivacyScenario').options && Array.isArray(getQuestionData('socialMediaPrivacyScenario').options) ? getQuestionData('socialMediaPrivacyScenario').options.map(opt => ({
          ...opt,
          risk: opt.value === 'acceptChange' ? 'critical' : opt.value === 'adjustSettings' ? 'medium' : 'low',
          actionPriority: opt.value === 'acceptChange' ? 'urgent' : opt.value === 'adjustSettings' ? 'medium' : 'low'
        })) : [])
      },
      // PART 2: ADVANCED PRIVACY TOPICS (4 questions)
      {
        id: 'aiPrivacyAwareness',
        section: 'advanced',
        sectionTitle: t('completeAssessment.sectionTitles.advanced'),
        question: getQuestionData('aiPrivacyAwareness').questionText,
        explanation: getQuestionData('aiPrivacyAwareness').explanationText,
        category: 'emerging-threats',
        options: (getQuestionData('aiPrivacyAwareness').options && Array.isArray(getQuestionData('aiPrivacyAwareness').options) ? getQuestionData('aiPrivacyAwareness').options.map(opt => ({
          ...opt,
          risk: opt.value === 'notConcerned' ? 'high' : opt.value === 'somewhatConcerned' ? 'medium' : 'low',
          actionPriority: opt.value === 'notConcerned' ? 'high' : opt.value === 'somewhatConcerned' ? 'medium' : 'low'
        })) : [])
      },
      {
        id: 'biometricDataAwareness',
        section: 'advanced',
        sectionTitle: t('completeAssessment.sectionTitles.advanced'),
        question: getQuestionData('biometricDataAwareness').questionText,
        explanation: getQuestionData('biometricDataAwareness').explanationText,
        category: 'sensitive-data',
        options: (getQuestionData('biometricDataAwareness').options && Array.isArray(getQuestionData('biometricDataAwareness').options) ? getQuestionData('biometricDataAwareness').options.map(opt => ({
          ...opt,
          risk: opt.value === 'notAware' ? 'high' : opt.value === 'acceptAll' ? 'medium' : 'low',
          actionPriority: opt.value === 'notAware' ? 'high' : opt.value === 'acceptAll' ? 'medium' : 'low'
        })) : [])
      },
      {
        id: 'crossBorderDataTransfers',
        section: 'advanced',
        sectionTitle: t('completeAssessment.sectionTitles.advanced'),
        question: getQuestionData('crossBorderDataTransfers').questionText,
        explanation: getQuestionData('crossBorderDataTransfers').explanationText,
        category: 'data-location',
        options: (getQuestionData('crossBorderDataTransfers').options && Array.isArray(getQuestionData('crossBorderDataTransfers').options) ? getQuestionData('crossBorderDataTransfers').options.map(opt => ({
          ...opt,
          risk: opt.value === 'notAware' || opt.value === 'somewhatAware' ? 'medium' : 'low',
          actionPriority: opt.value === 'notAware' || opt.value === 'somewhatAware' ? 'medium' : 'low'
        })) : [])
      },
      {
        id: 'privacyByDesignAwareness',
        section: 'advanced',
        sectionTitle: t('completeAssessment.sectionTitles.advanced'),
        question: getQuestionData('privacyByDesignAwareness').questionText,
        explanation: getQuestionData('privacyByDesignAwareness').explanationText,
        category: 'privacy-architecture',
        options: (getQuestionData('privacyByDesignAwareness').options && Array.isArray(getQuestionData('privacyByDesignAwareness').options) ? getQuestionData('privacyByDesignAwareness').options.map(opt => ({
          ...opt,
          risk: opt.value === 'notConsidered' ? 'high' : opt.value === 'sometimesConsidered' ? 'medium' : 'low',
          actionPriority: opt.value === 'notConsidered' ? 'high' : opt.value === 'sometimesConsidered' ? 'medium' : 'low'
        })) : [])
      },
      // PART 3: ACTION-ORIENTED PRIORITIES (3 questions)
      {
        id: 'privacyGoals',
        section: 'action',
        sectionTitle: t('completeAssessment.sectionTitles.action'),
        question: getQuestionData('privacyGoals').questionText,
        explanation: getQuestionData('privacyGoals').explanationText,
        category: 'goal-setting',
        options: (getQuestionData('privacyGoals').options && Array.isArray(getQuestionData('privacyGoals').options) ? getQuestionData('privacyGoals').options.map(opt => ({
          ...opt,
          risk: null,
          actionPriority: opt.value === 'reduceRisk' ? 'urgent' : opt.value === 'learnRights' || opt.value === 'minimizeFootprint' ? 'high' : 'medium',
          goalCategory: opt.value
        })) : [])
      },
      {
        id: 'timeCommitment',
        section: 'action',
        sectionTitle: t('completeAssessment.sectionTitles.action'),
        question: getQuestionData('timeCommitment').questionText,
        explanation: getQuestionData('timeCommitment').explanationText,
        category: 'planning',
        options: (getQuestionData('timeCommitment').options && Array.isArray(getQuestionData('timeCommitment').options) ? getQuestionData('timeCommitment').options.map(opt => ({
          ...opt,
          risk: null,
          actionPriority: opt.value === 'minimal' ? 'high' : opt.value === 'moderate' ? 'medium' : 'low',
          timeCategory: opt.value
        })) : [])
      },
      {
        id: 'biggestConcern',
        section: 'action',
        sectionTitle: t('completeAssessment.sectionTitles.action'),
        question: getQuestionData('biggestConcern').questionText,
        explanation: getQuestionData('biggestConcern').explanationText,
        category: 'prioritization',
        options: (getQuestionData('biggestConcern').options && Array.isArray(getQuestionData('biggestConcern').options) ? getQuestionData('biggestConcern').options.map(opt => ({
          ...opt,
          risk: null,
          actionPriority: opt.value === 'identityTheft' ? 'urgent' : opt.value === 'dataCollection' || opt.value === 'surveillance' ? 'high' : 'medium',
          concernCategory: opt.value
        })) : [])
      }
    ];
    };
    return buildQuestions();
  }, [t]);

  // Calculate action readiness score
  useEffect(() => {
    if (!allQuestions || !Array.isArray(allQuestions)) {
      setActionReadinessScore(0);
      return;
    }
    
    let score = 0;
    let maxScore = 0;
    
    allQuestions.forEach(question => {
      const answer = answers[question.id];
      if (answer) {
        const option = question.options && Array.isArray(question.options) ? question.options.find(opt => opt.value === answer) : null;
        if (option) {
          // Score based on action priority (lower priority = better readiness)
          const priorityScores = {
            'urgent': 1, // Needs immediate action
            'high': 2,
            'medium': 3,
            'low': 4 // Already taking action
          };
          score += priorityScores[option.actionPriority] || 2;
          maxScore += 4;
        }
      }
    });
    
    // Convert to 0-100 scale (higher = more action-ready)
    const readinessScore = maxScore > 0 ? Math.round((score / maxScore) * 100) : 0;
    setActionReadinessScore(readinessScore);
  }, [answers, allQuestions]);

  // Update current section
  useEffect(() => {
    if (allQuestions && allQuestions.length > 0) {
      const safeIndex = Math.max(0, Math.min(currentQuestion, allQuestions.length - 1));
      const question = allQuestions[safeIndex];
      if (question && question.section !== currentSection) {
        setCurrentSection(question.section);
      }
    }
  }, [currentQuestion, allQuestions, currentSection]);

  const handleAnswer = (value) => {
    if (!allQuestions || allQuestions.length === 0) return;
    
    const safeIndex = Math.max(0, Math.min(currentQuestion, allQuestions.length - 1));
    const questionId = allQuestions[safeIndex]?.id;
    if (!questionId) return;
    
    // Track first answer for funnel analysis
    if (Object.keys(answers).length === 0) {
      analytics.trackFunnelStep('firstQuestionAnswer', {
        assessment_type: 'complete',
        first_answer: value,
        question_id: questionId
      });
    }
    
    setAnswers(prev => ({
      ...prev,
      [questionId]: value
    }));
  };

  const nextQuestion = () => {
    if (!allQuestions || allQuestions.length === 0) return;
    
    setAnimationState('leaving');
    setTimeout(() => {
      const safeIndex = Math.max(0, Math.min(currentQuestion, allQuestions.length - 1));
      if (safeIndex < allQuestions.length - 1) {
        setCurrentQuestion(prev => Math.min(prev + 1, allQuestions.length - 1));
        setAnimationState('entering');
      } else {
        // Generate personalized action plan
        const actionPlan = generateActionPlan(answers);
        onComplete(answers, actionPlan);
      }
    }, 300);
  };

  const prevQuestion = () => {
    setAnimationState('leaving');
    setTimeout(() => {
      if (currentQuestion > 0) {
        setCurrentQuestion(prev => prev - 1);
        setAnimationState('entering');
      }
    }, 300);
  };

  // Generate personalized action plan from answers
  const generateActionPlan = (answers) => {
    const plan = {
      urgent: [],
      high: [],
      medium: [],
      low: [],
      quickWins: [],
      longTerm: [],
      personalized: {
        primaryGoal: null,
        timeCommitment: null,
        biggestConcern: null,
        recommendedTools: [],
        learningPath: []
      }
    };

    // Collect all action items by priority
    if (!allQuestions || !Array.isArray(allQuestions)) return plan;
    allQuestions.forEach(question => {
      const answer = answers[question.id];
      if (answer) {
        const option = question.options && Array.isArray(question.options) ? question.options.find(opt => opt.value === answer) : null;
        if (option && option.actionItems && Array.isArray(option.actionItems) && option.actionPriority) {
          // Ensure the priority array exists in plan
          if (!plan[option.actionPriority]) {
            plan[option.actionPriority] = [];
          }
          option.actionItems.forEach(item => {
            if (plan[option.actionPriority] && Array.isArray(plan[option.actionPriority]) && !plan[option.actionPriority].includes(item)) {
              plan[option.actionPriority].push(item);
            }
          });
        }

        // Capture personalized preferences
        if (question.id === 'privacyGoals') {
          plan.personalized.primaryGoal = option?.goalCategory || answer;
        }
        if (question.id === 'timeCommitment') {
          plan.personalized.timeCommitment = option?.timeCategory || answer;
        }
        if (question.id === 'biggestConcern') {
          plan.personalized.biggestConcern = option?.concernCategory || answer;
        }
      }
    });

    // Identify quick wins (urgent + high priority items that are actionable)
    plan.quickWins = [
      ...plan.urgent.slice(0, 3),
      ...plan.high.slice(0, 2)
    ].filter((item, index, self) => 
      index === self.findIndex(t => t === item)
    );

    // Long-term items (medium + low priority)
    plan.longTerm = [
      ...plan.medium,
      ...plan.low
    ].filter((item, index, self) => 
      index === self.findIndex(t => t === item)
    );

    return plan;
  };

  useEffect(() => {
    if (animationState === 'entering') {
      const timer = setTimeout(() => setAnimationState('visible'), 100);
      return () => clearTimeout(timer);
    }
  }, [animationState]);

  // Safety checks
  if (!allQuestions || allQuestions.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-slate-900 py-8 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 dark:text-gray-300">No questions available.</p>
        </div>
      </div>
    );
  }

  // Ensure currentQuestion is within bounds
  const safeCurrentQuestion = Math.max(0, Math.min(currentQuestion, allQuestions.length - 1));
  useEffect(() => {
    if (safeCurrentQuestion !== currentQuestion) {
      setCurrentQuestion(safeCurrentQuestion);
    }
  }, [safeCurrentQuestion, currentQuestion]);

  const progress = ((safeCurrentQuestion + 1) / allQuestions.length) * 100;
  const currentAnswer = answers[allQuestions[safeCurrentQuestion]?.id];
  const currentQ = allQuestions[safeCurrentQuestion];
  
  if (!currentQ) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-slate-900 py-8 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 dark:text-gray-300">Question data not available.</p>
        </div>
      </div>
    );
  }

  const selectedOption = currentQ?.options && Array.isArray(currentQ.options) ? currentQ.options.find(opt => opt.value === currentAnswer) : null;

  // Section progress
  const scenarioQuestions = allQuestions && Array.isArray(allQuestions) ? allQuestions.filter(q => q.section === 'scenarios') : [];
  const advancedQuestions = allQuestions && Array.isArray(allQuestions) ? allQuestions.filter(q => q.section === 'advanced') : [];
  const actionQuestions = allQuestions && Array.isArray(allQuestions) ? allQuestions.filter(q => q.section === 'action') : [];
  
  const scenarioProgress = Math.min(safeCurrentQuestion + 1, scenarioQuestions.length);
  const advancedProgress = Math.max(0, Math.min(safeCurrentQuestion + 1 - scenarioQuestions.length, advancedQuestions.length));
  const actionProgress = Math.max(0, safeCurrentQuestion + 1 - scenarioQuestions.length - advancedQuestions.length);

  const sectionColors = {
    scenarios: { bg: 'from-accent to-accent-dark', text: 'text-accent', border: 'border-accent/20' },
    advanced: { bg: 'from-primary to-primary-dark', text: 'text-primary', border: 'border-primary/20' },
    action: { bg: 'from-success to-success/80', text: 'text-success', border: 'border-success/20' }
  };

  const currentColors = sectionColors[currentSection];

  return (
    <div className="min-h-screen bg-background-secondary py-6 sm:py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        {/* Navigation Header */}
        <div className="flex items-center justify-between mb-4 sm:mb-6 gap-2">
          <div className="flex-1 min-w-0">
            {breadcrumbs}
          </div>
          <div className="flex items-center space-x-2 sm:space-x-4 flex-shrink-0">
            {themeToggle}
            {backButton}
          </div>
        </div>

        {/* Header */}
        <div className="text-center mb-6 sm:mb-8">
          <div className={`inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r ${currentColors.bg} text-white rounded-full mb-3 sm:mb-4`}>
            <Target className="w-6 h-6 sm:w-8 sm:h-8" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-text mb-2 px-2">
            {t('completeAssessment.title')}
          </h1>
          <p className="text-sm sm:text-base md:text-lg text-text-secondary px-2">
            {t('completeAssessment.subtitle')}
          </p>
        </div>

        {/* Section Indicator */}
        <div className="mb-6 sm:mb-8">
          <div className="flex items-center justify-between text-xs sm:text-sm text-text-secondary mb-4 flex-wrap gap-2">
            <div className="flex items-center space-x-2 sm:space-x-4 flex-wrap">
              <div className={`flex items-center px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm ${
                currentSection === 'scenarios' ? 'bg-accent/10 text-accent' : 'bg-muted/20 text-muted-foreground'
              }`}>
                <Zap className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                {t('completeAssessment.sections.scenarios')} ({scenarioProgress}/{scenarioQuestions.length})
              </div>
              <div className={`flex items-center px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm ${
                currentSection === 'advanced' ? 'bg-primary/10 text-primary' : 'bg-muted/20 text-muted-foreground'
              }`}>
                <Shield className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                {t('completeAssessment.sections.advanced')} ({advancedProgress}/{advancedQuestions.length})
              </div>
              <div className={`flex items-center px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm ${
                currentSection === 'action' ? 'bg-success/10 text-success' : 'bg-muted/20 text-muted-foreground'
              }`}>
                <Target className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                {t('completeAssessment.sections.actionPlan')} ({actionProgress}/{actionQuestions.length})
              </div>
            </div>
            <span className="font-medium">{t('completeAssessment.ui.completePercent', { percent: Math.round(progress) })}</span>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-muted/20 rounded-full h-2.5 sm:h-3 overflow-hidden mb-2">
            <div className="flex h-full">
              <div 
                className="bg-accent transition-all duration-500"
                style={{ width: `${(scenarioProgress / allQuestions.length) * 100}%` }}
              />
              <div 
                className="bg-primary transition-all duration-500"
                style={{ width: `${(advancedProgress / allQuestions.length) * 100}%` }}
              />
              <div 
                className="bg-success transition-all duration-500"
                style={{ width: `${(actionProgress / allQuestions.length) * 100}%` }}
              />
            </div>
          </div>

          {/* Action Readiness Score */}
          <div className="mt-3 text-center">
            <div className="inline-flex items-center px-3 py-1 bg-success/10 rounded-full">
              <TrendingUp className="w-4 h-4 text-success mr-2 flex-shrink-0" />
              <span className="text-xs sm:text-sm font-medium text-success">
                {t('completeAssessment.ui.actionReadiness', { score: actionReadinessScore })}
              </span>
            </div>
          </div>
        </div>

        {/* Question Card */}
        <div className={`card rounded-xl shadow-lg p-4 sm:p-6 md:p-8 mb-6 sm:mb-8 transition-all duration-300 ${
          animationState === 'leaving' ? 'opacity-50 transform scale-95' : 
          animationState === 'entering' ? 'opacity-0 transform translate-y-4' :
          'opacity-100 transform scale-100'
        }`}>
          {/* Section Header */}
          <div className={`mb-4 sm:mb-6 p-3 sm:p-4 rounded-lg border ${
            currentSection === 'scenarios' 
              ? 'bg-accent/10 border-accent/20' 
              : currentSection === 'advanced'
              ? 'bg-primary/10 border-primary/20'
              : 'bg-success/10 border-success/20'
          }`}>
            <div className="flex items-center mb-1">
              {currentSection === 'scenarios' ? (
                <Zap className={`w-4 h-4 sm:w-5 sm:h-5 ${currentColors.text} mr-2`} />
              ) : currentSection === 'advanced' ? (
                <Shield className={`w-4 h-4 sm:w-5 sm:h-5 ${currentColors.text} mr-2`} />
              ) : (
                <Target className={`w-4 h-4 sm:w-5 sm:h-5 ${currentColors.text} mr-2`} />
              )}
              <h2 className="text-base sm:text-lg font-bold text-text">
                {currentQ.sectionTitle}
              </h2>
            </div>
          </div>

          <h3 className="text-lg sm:text-xl font-bold text-text mb-4 sm:mb-6">
            {currentQ.question}
          </h3>
          
          {/* Context explanation */}
          <div className={`mb-4 sm:mb-6 p-3 sm:p-4 rounded-lg border ${currentColors.border} ${
            currentSection === 'scenarios'
              ? 'bg-blue-50 dark:bg-blue-900/20'
              : currentSection === 'advanced'
              ? 'bg-purple-50 dark:bg-purple-900/20'
              : 'bg-yellow-50 dark:bg-yellow-900/20'
          }`}>
            <div className="flex items-start">
              <Info className={`w-4 h-4 sm:w-5 sm:h-5 mr-2 sm:mr-3 mt-0.5 flex-shrink-0 ${
                currentSection === 'scenarios' ? 'text-blue-600 dark:text-blue-400' : 
                currentSection === 'advanced' ? 'text-purple-600 dark:text-purple-400' :
                'text-yellow-600 dark:text-yellow-400'
              }`} />
              <p className={`text-xs sm:text-sm ${
                currentSection === 'scenarios' ? 'text-blue-800 dark:text-blue-200' : 
                currentSection === 'advanced' ? 'text-purple-800 dark:text-purple-200' :
                'text-yellow-800 dark:text-yellow-200'
              }`}>
                {currentQ.explanation}
              </p>
            </div>
          </div>

          {/* Options */}
          <div className="space-y-2 sm:space-y-3">
            {currentQ.options && Array.isArray(currentQ.options) ? currentQ.options.map((option, index) => (
              <button
                key={option.value}
                onClick={() => handleAnswer(option.value)}
                className={`w-full p-3 sm:p-4 rounded-xl border text-left transition-all transform hover:scale-[1.02] min-h-[44px] touch-manipulation ${
                  currentAnswer === option.value
                    ? `${currentSection === 'scenarios' ? 'border-accent bg-accent/10 text-text ring-2 ring-accent/20' : 
                       currentSection === 'advanced' ? 'border-primary bg-primary/10 text-text ring-2 ring-primary/20' :
                       'border-success bg-success/10 text-text ring-2 ring-success/20'}`
                    : 'border-border bg-card-hover hover:border-border/80 text-text'
                }`}
                style={{
                  animationDelay: `${index * 100}ms`
                }}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="font-medium text-sm sm:text-base">{option.label}</span>
                  {option.risk && (
                    <span className={`text-[10px] sm:text-xs px-2 py-1 rounded-full flex-shrink-0 ${
                      option.risk === 'critical' ? 'bg-danger/10 text-danger' :
                      option.risk === 'high' ? 'bg-warning/10 text-warning' :
                      option.risk === 'medium' ? 'bg-warning/10 text-warning' : 
                      'bg-success/10 text-success'
                    }`}>
                      {t(`completeAssessment.risk.${option.risk}`)}
                    </span>
                  )}
                  {option.actionPriority && !option.risk && (
                    <span className={`text-[10px] sm:text-xs px-2 py-1 rounded-full flex-shrink-0 ${
                      option.actionPriority === 'urgent' ? 'bg-danger/10 text-danger' :
                      option.actionPriority === 'high' ? 'bg-warning/10 text-warning' :
                      option.actionPriority === 'medium' ? 'bg-warning/10 text-warning' : 
                      'bg-success/10 text-success'
                    }`}>
                      {t(`completeAssessment.priority.${option.actionPriority}`)}
                    </span>
                  )}
                </div>
              </button>
            )) : (
              <p className="text-gray-500 dark:text-gray-400 text-center py-4">No answer options available.</p>
            )}
          </div>

          {/* Selected option preview - show action items */}
          {selectedOption && selectedOption.actionItems && selectedOption.actionItems.length > 0 && (
            <div className={`mt-4 p-3 sm:p-4 rounded-lg border animate-fade-in ${
              currentSection === 'scenarios'
                ? 'bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800'
                : currentSection === 'advanced'
                ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800'
                : 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
            }`}>
              <div className="flex items-start mb-2">
                <CheckCircle2 className={`w-4 h-4 sm:w-5 sm:h-5 mr-2 mt-0.5 flex-shrink-0 ${
                  currentSection === 'scenarios' ? 'text-purple-600 dark:text-purple-400' :
                  currentSection === 'advanced' ? 'text-blue-600 dark:text-blue-400' :
                  'text-green-600 dark:text-green-400'
                }`} />
                <span className={`text-xs sm:text-sm font-semibold ${
                  currentSection === 'scenarios' ? 'text-purple-900 dark:text-purple-100' :
                  currentSection === 'advanced' ? 'text-blue-900 dark:text-blue-100' :
                  'text-green-900 dark:text-green-100'
                }`}>
                  {t('completeAssessment.ui.thisWillBeIncluded')}
                </span>
              </div>
              <ul className="list-disc list-inside space-y-1">
                {selectedOption.actionItems.slice(0, 3).map((item, idx) => (
                  <li key={idx} className={`text-xs sm:text-sm ${
                    currentSection === 'scenarios' ? 'text-purple-800 dark:text-purple-200' :
                    currentSection === 'advanced' ? 'text-blue-800 dark:text-blue-200' :
                    'text-green-800 dark:text-green-200'
                  }`}>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="flex justify-between gap-3 sm:gap-4">
          <button
            onClick={prevQuestion}
            disabled={currentQuestion === 0}
            className="group px-4 sm:px-6 py-3 bg-card-hover text-text-secondary rounded-lg hover:bg-card-hover/80 disabled:opacity-50 disabled:cursor-not-allowed flex items-center transition-all transform hover:scale-105 disabled:hover:scale-100 min-h-[44px] touch-manipulation text-sm sm:text-base"
          >
            <ChevronLeft className="w-4 h-4 mr-1 sm:mr-2 group-hover:-translate-x-1 transition-transform flex-shrink-0" />
            <span className="hidden sm:inline">{t('completeAssessment.ui.previous')}</span>
            <span className="sm:hidden">{t('completeAssessment.ui.prev')}</span>
          </button>

          <button
            onClick={nextQuestion}
            disabled={!currentAnswer}
            className={`group px-4 sm:px-6 py-3 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center transition-all transform hover:scale-105 disabled:hover:scale-100 shadow-lg min-h-[44px] touch-manipulation text-sm sm:text-base bg-gradient-to-r ${
              currentSection === 'scenarios' ? 'from-accent to-accent-dark hover:from-accent-dark hover:to-accent' :
              currentSection === 'advanced' ? 'from-primary to-primary-dark hover:from-primary-dark hover:to-primary' :
              'from-success to-success/80 hover:from-success/80 hover:to-success'
            }`}
          >
            <span className="hidden sm:inline">
              {safeCurrentQuestion === allQuestions.length - 1 ? t('completeAssessment.ui.generateActionPlan') : t('completeAssessment.ui.nextQuestion')}
            </span>
            <span className="sm:hidden">
              {safeCurrentQuestion === allQuestions.length - 1 ? t('completeAssessment.ui.complete') : t('completeAssessment.ui.next')}
            </span>
            <ChevronRight className="w-4 h-4 ml-1 sm:ml-2 group-hover:translate-x-1 transition-transform flex-shrink-0" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CompleteAssessment;

