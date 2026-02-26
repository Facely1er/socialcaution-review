import { useState, useEffect, useMemo } from 'react';
import { Scale, ChevronRight, ChevronLeft, Info, BookOpen, Globe, Gavel } from 'lucide-react';
import { analytics } from '../../utils/analytics.js';
import { RightsQuestionMapping, PrivacyRegulations } from '../../data/regulationsMapping';

const PrivacyRightsCheckup = ({ onComplete, breadcrumbs, backButton, themeToggle }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showRegulationInfo, setShowRegulationInfo] = useState(false);
  const [animationState, setAnimationState] = useState('entering');
  const [selectedAnswerIndex, setSelectedAnswerIndex] = useState(-1);
  const [knowledgeScore, setKnowledgeScore] = useState(0);

  // Define questions array (memoized to prevent recreation on each render)
  const questions = useMemo(() => [
    {
      id: 'noticeAwareness',
      title: 'Notice & Awareness Principle',
      question: 'Are you aware that the "Notice & Awareness" principle means companies should clearly inform you about what personal information they collect, why they need it, how they\'ll use it, and who they might share it with?',
      description: 'The Notice & Awareness principle requires that companies provide clear, understandable information about their data collection and use practices. This transparency is fundamental to privacy protection.',
      options: [
        { value: 'fullyAware', label: '✅ "Yes, I understand - companies must inform me about what information they collect, why they need it, how they\'ll use it, and who they might share it with"', points: 2 },
        { value: 'somewhatAware', label: '🤔 " I know companies are supposed to do  some of those things but not all of those things"', points: 1 },
        { value: 'unaware', label: '❓ "No, I\'m not aware of this principle"', points: 0 }
      ]
    },
    {
      id: 'choiceConsent',
      title: 'Choice & Consent Principle',
      question: 'Are you aware that the "Choice & Consent" principle means you can say "yes" or "no" to how companies use your personal information without losing access to important services, and you can change your mind later?',
      description: 'The Choice & Consent principle requires that you have real, meaningful choices about how your data is used. This principle ensures that consent is truly meaningful, informed, voluntary, and not coerced',
      options: [
        { value: 'fullyAware', label: '✅ " Yes, I am very familiar with the Choice & Consent Principle"', points: 2 },
        { value: 'somewhatAware', label: '🤔 " I know I can choose how to share my data, but I think it limits access to important services"', points: 1 },
        { value: 'unaware', label: '❓ "No, I\'m not aware of this principle"', points: 0 }
      ]
    },
    {
      id: 'accessParticipation',
      title: 'Access & Participation Principle',
      question: 'Are you aware that the "Access & Participation" principle means you have the right to request a copy of your data, correct any inaccuracies, and challenge the accuracy of information?',
      description: 'The Access & Participation principle gives you the right to see and control information that companies have collected about you. This empowers you to verify and maintain the accuracy of your personal data.',
      options: [
        { value: 'fullyAware', label: '✅ "Yes, I am very familiar with the Access & Participation Principle"', points: 2 },
        { value: 'somewhatAware', label: '🤔 "Yes, I\'m aware that I can request a copy of my data but I don\'t think I can demand changes be made to the data"', points: 1 },
        { value: 'unaware', label: '❓ "No, I\'m not aware of this principle"', points: 0 }
      ]
    },
    {
      id: 'integritySecurity',
      title: 'Integrity & Security Principle',
      question: 'Are you aware that the "Integrity & Security" principle means companies should protect your personal information from unauthorized access, keep it accurate and up-to-date, update it when your information changes, and notify you if there\'s a security problem?',
      description: 'The Integrity & Security principle requires that companies keep your information safe from hackers and data breaches while maintaining data quality. This principle ensures both data security and data accuracy.',
      options: [
        { value: 'fullyAware', label: '✅ "Yes, I am aware that the Integrity & Security Principle requires all of the above"', points: 2 },
        { value: 'somewhatAware', label: '🤔 " I\'m aware that companies have to protect my personal information but as long as they notify the government they don\'t need to notify me"', points: 1 },
        { value: 'unaware', label: '❓ "No, I\'m not aware of this principle"', points: 0 }
      ]
    },
    {
      id: 'enforcementRedress',
      title: 'Enforcement & Redress Principle',
      question: 'Are you aware that the "Enforcement & Redress" principle means you should have ways to get help when companies misuse your personal information, including contacting the company directly, filing complaints with government regulators, and in some cases taking legal action?',
      description: 'The Enforcement & Redress principle ensures that if something goes wrong with your privacy, you have ways to get help. You shouldn\'t be left without options when your privacy rights are violated.',
      options: [
        { value: 'fullyAware', label: '✅ "Yes, I understand - I can contact the company, file complaints with regulators, and take legal action if needed"', points: 2 },
        { value: 'somewhatAware', label: '🤔 " I\'ve heard I could get help if my privacy was violated but I thought i would need a lawyer"', points: 1 },
        { value: 'unaware', label: '❓ "No, I\'m not aware of this principle"', points: 0 }
      ]
    },
    {
      id: 'purposeLimitation',
      title: 'Purpose Limitation Principle',
      question: 'Are you aware that the "Purpose Limitation" principle means companies should only use your personal information for the specific purposes they originally told you about, they cannot use it for other purposes without telling you first, and if they collected it for one reason they should not surprise you later by using it for something else?',
      description: 'The Purpose Limitation principle requires that when a company collects your information for one reason, they should only use it for that reason. This prevents companies from using your data in unexpected ways without your knowledge.',
      options: [
        { value: 'fullyAware', label: '✅ "Yes, I am fully aware of the Purpose Limitation Principle"', points: 2 },
        { value: 'somewhatAware', label: '🤔 " I know that companies have to tell me why they want my information but they\'re free to find new usage for it later"', points: 1 },
        { value: 'unaware', label: '❓ "No, I\'m not aware of this principle"', points: 0 }
      ]
    },
    {
      id: 'dataMinimization',
      title: 'Data Minimization Principle',
      question: 'Are you aware that the "Data Minimization" principle means they should not ask for extra information "just in case" they might need it later, and the less information they collect the less can be stolen or misused?',
      description: 'The Data Minimization principle requires that companies only ask for information they actually need. For example, if you\'re signing up for a weather app, they probably don\'t need your home address or phone number.',
      options: [
        { value: 'fullyAware', label: '✅ "Yes, I am very familiar with Data Minimization Principle"', points: 2 },
        { value: 'somewhatAware', label: '🤔 " I think companies can collect extra information only for limited amount of time"', points: 1 },
        { value: 'unaware', label: '❓ "No, I\'m not aware of this principle"', points: 0 }
      ]
    },
    {
      id: 'retentionLimitation',
      title: 'Retention Limitation Principle',
      question: ' Are you aware that the "Retention Limitation" principle means they should delete it once you stop using their service, and they should not keep it forever?',
      description: 'The Retention Limitation principle requires that companies only keep your information as long as they actually need it. For example, if you close your account with a shopping website, they shouldn\'t keep your credit card information or purchase history indefinitely.',
      options: [
        { value: 'fullyAware', label: '✅ "Yes, I understand - companies should only keep data as long as needed, delete it when I stop using the service, and not keep it forever"', points: 2 },
        { value: 'somewhatAware', label: '🤔 " I know companies can keep my personal information for a limited time, but I don\'t know the exceptions"', points: 1 },
        { value: 'unaware', label: '❓ "No, I\'m not aware of this principle"', points: 0 }
      ]
    }
  ], []);

  // Calculate running knowledge score (matches final scoring logic)
  useEffect(() => {
    const currentScore = questions.reduce((total, question) => {
      const answerValue = answers[question.id];
      if (!answerValue) return total; // Skip unanswered questions
      
      const option = question.options && Array.isArray(question.options) ? question.options.find(opt => opt.value === answerValue) : null;
      return total + (option?.points || 0);
    }, 0);
    setKnowledgeScore(currentScore);
  }, [answers, questions]);

  const handleAnswer = (value) => {
    // Track first answer for funnel analysis
    const currentQ = questions[currentQuestion];
    if (!currentQ) return; // Safety check
    
    if (Object.keys(answers).length === 0) {
      analytics.trackFunnelStep('firstQuestionAnswer', {
        assessment_type: 'rights',
        first_answer: value,
        question_id: currentQ.id
      });
    }
    
    if (currentQ.options && Array.isArray(currentQ.options)) {
      setSelectedAnswerIndex(currentQ.options.findIndex(opt => opt.value === value));
    }
    setAnswers(prev => ({
      ...prev,
      [currentQ.id]: value
    }));
  };

  const nextQuestion = () => {
    setAnimationState('leaving');
    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(prev => prev + 1);
        setAnimationState('entering');
        setSelectedAnswerIndex(-1);
      } else {
        onComplete(answers);
      }
    }, 300);
  };

  const prevQuestion = () => {
    setAnimationState('leaving');
    setTimeout(() => {
      if (currentQuestion > 0) {
        const prevQuestionIndex = currentQuestion - 1;
        const prevQ = questions[prevQuestionIndex];
        const prevAnswer = answers[prevQ.id];
        
        setCurrentQuestion(prevQuestionIndex);
        setAnimationState('entering');
        
        if (prevAnswer !== undefined && prevQ.options && Array.isArray(prevQ.options)) {
          setSelectedAnswerIndex(prevQ.options.findIndex(opt => opt.value === prevAnswer));
        } else {
          setSelectedAnswerIndex(-1);
        }
      }
    }, 300);
  };

  useEffect(() => {
    if (animationState === 'entering') {
      const timer = setTimeout(() => setAnimationState('visible'), 100);
      return () => clearTimeout(timer);
    }
  }, [animationState]);

  // Safety checks
  if (!questions || questions.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 dark:from-slate-900 dark:to-slate-800 py-6 sm:py-8 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 dark:text-gray-300">No questions available.</p>
        </div>
      </div>
    );
  }

  // Ensure currentQuestion is within bounds
  const safeCurrentQuestion = Math.max(0, Math.min(currentQuestion, questions.length - 1));
  const currentQ = questions[safeCurrentQuestion];
  
  if (!currentQ) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 dark:from-slate-900 dark:to-slate-800 py-6 sm:py-8 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 dark:text-gray-300">Question data not available.</p>
        </div>
      </div>
    );
  }

  // Fix currentQuestion if out of bounds
  useEffect(() => {
    if (safeCurrentQuestion !== currentQuestion) {
      setCurrentQuestion(safeCurrentQuestion);
    }
  }, [safeCurrentQuestion, currentQuestion]);

  const progress = ((safeCurrentQuestion + 1) / questions.length) * 100;
  const currentAnswer = answers[currentQ.id];
  const questionMapping = RightsQuestionMapping[currentQ.id];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 dark:from-slate-900 dark:to-slate-800 py-6 sm:py-8">
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
          <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-blue-500 text-white rounded-full mb-3 sm:mb-4">
            <Scale className="w-6 h-6 sm:w-8 sm:h-8" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2 px-2">
            Privacy Rights Knowledge Checkup
          </h1>
          <p className="text-sm sm:text-base md:text-lg text-gray-600 dark:text-gray-300 px-2">
            Test your understanding of the 8 fundamental privacy principles
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-6 sm:mb-8">
          <div className="flex justify-between text-xs sm:text-sm text-gray-600 dark:text-gray-300 mb-2">
            <span>Right {safeCurrentQuestion + 1} of {questions.length}</span>
            <span className="font-medium">{Math.round(progress)}% Complete</span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 sm:h-3 overflow-hidden">
            <div 
              className="bg-gradient-to-r from-blue-500 to-purple-500 h-2.5 sm:h-3 rounded-full transition-all duration-500 shadow-sm"
              style={{ width: `${progress}%` }}
            >
              <div className="h-full bg-white/20 animate-pulse rounded-full"></div>
            </div>
          </div>
          
          {/* Progress Indicators */}
          <div className="flex justify-between mt-2 gap-1">
            {questions.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-all duration-300 flex-shrink-0 ${
                  index < safeCurrentQuestion ? 'bg-green-500' :
                  index === safeCurrentQuestion ? 'bg-blue-500 animate-pulse' :
                  'bg-gray-300 dark:bg-gray-600'
                }`}
              />
            ))}
          </div>
          
          {/* Knowledge Score Display */}
          <div className="mt-2 text-center">
            <div className="inline-flex items-center px-3 py-1 bg-blue-100 dark:bg-blue-900/30 rounded-full">
              <Scale className="w-4 h-4 text-blue-600 dark:text-blue-400 mr-2 flex-shrink-0" />
              <span className="text-xs sm:text-sm font-medium text-blue-800 dark:text-blue-200">
                Knowledge Score: {knowledgeScore} points
              </span>
            </div>
          </div>
        </div>

        {/* Question Card */}
        <div className={`bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-gray-200 dark:border-slate-700 p-4 sm:p-6 md:p-8 mb-6 sm:mb-8 transition-all duration-300 ${
          animationState === 'leaving' ? 'opacity-50 transform scale-95' : 
          animationState === 'entering' ? 'opacity-0 transform translate-y-4' :
          'opacity-100 transform scale-100'
        }`}>
          <div className="mb-4 sm:mb-6">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-2 animate-fade-in">
              {currentQ.title}
            </h2>
            <div className="flex items-start p-3 sm:p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <Info className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 dark:text-blue-400 mr-2 sm:mr-3 mt-0.5 flex-shrink-0" />
              <p className="text-blue-800 dark:text-blue-200 text-xs sm:text-sm">
                {currentQ.description}
              </p>
            </div>
          </div>

          <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-4 sm:mb-6 animate-slide-up">
            {currentQ.question}
          </h3>

          {/* Legal Requirements Information */}
          {questionMapping && (
            <div className="mb-4 sm:mb-6">
              <button
                onClick={() => setShowRegulationInfo(!showRegulationInfo)}
                className="flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors min-h-[44px] touch-manipulation w-full sm:w-auto"
                aria-expanded={showRegulationInfo}
                aria-label={`${showRegulationInfo ? 'Hide' : 'Show'} legal requirements and rights information`}
              >
                <Gavel className="w-4 h-4 mr-2 flex-shrink-0" />
                <span className="text-xs sm:text-sm font-medium">
                  Legal Requirements & Rights ({questionMapping?.regulations?.length || 0} laws)
                </span>
                <ChevronRight className={`w-4 h-4 ml-1 transition-transform flex-shrink-0 ${showRegulationInfo ? 'rotate-90' : ''}`} />
              </button>
              
              {showRegulationInfo && (
                <div className="mt-4 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
                  <h4 className="font-medium text-purple-900 dark:text-purple-100 mb-3 flex items-center">
                    <BookOpen className="w-4 h-4 mr-2" />
                    {questionMapping.title} - Legal Framework
                  </h4>
                  <div className="space-y-3 mb-3">
                    {questionMapping?.requirements && Array.isArray(questionMapping.requirements) ? questionMapping.requirements.map((req, index) => {
                      if (!req || !req.regulation) return null;
                      const regulation = PrivacyRegulations[req.regulation];
                      if (!regulation) return null;
                      return (
                        <div key={index} className="p-3 bg-white dark:bg-slate-700 rounded border border-purple-200 dark:border-purple-700">
                          <div className="font-medium text-purple-800 dark:text-purple-200 text-sm mb-1">
                            {regulation.name || 'Unknown Regulation'}
                          </div>
                          <div className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                            {regulation.region || ''} • {req.reference || ''}
                          </div>
                          <div className="text-sm text-purple-700 dark:text-purple-300">
                            {req.description ? req.description.split('**').map((part, i) => 
                              i % 2 === 1 ? <strong key={i}>{part}</strong> : part
                            ) : ''}
                          </div>
                        </div>
                      );
                    }) : null}
                  </div>
                  <div className="text-xs text-purple-600 dark:text-purple-400 border-t border-purple-200 dark:border-purple-700 pt-3 space-y-1">
                    <div>
                      <strong>Business Impact:</strong> {questionMapping.businessImpact}
                    </div>
                    <div>
                      <strong>Compliance Level:</strong> {questionMapping.complianceLevel}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="space-y-2 sm:space-y-3">
            {currentQ.options && Array.isArray(currentQ.options) ? currentQ.options.map((option, index) => (
              <button
                key={option.value}
                onClick={() => handleAnswer(option.value)}
                className={`w-full p-3 sm:p-4 rounded-xl border text-left transition-all transform hover:scale-[1.02] animate-fade-in min-h-[44px] touch-manipulation ${
                  currentAnswer === option.value
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-900 dark:text-blue-100 ring-2 ring-blue-500/20'
                    : 'border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-slate-700 hover:border-gray-300 dark:hover:border-gray-500 text-gray-900 dark:text-white'
                } ${selectedAnswerIndex === index ? 'animate-pulse' : ''}`}
                style={{
                  animationDelay: `${index * 100}ms`
                }}
                aria-pressed={currentAnswer === option.value}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="font-medium text-sm sm:text-base">{option.label}</span>
                  <span className={`text-[10px] sm:text-xs px-2 py-1 rounded-full flex items-center flex-shrink-0 ${
                    option.points >= 2 ? 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300' :
                    option.points >= 1 ? 'bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300' : 
                    'bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300'
                  }`}>
                    {option.points >= 2 ? '⭐' : option.points >= 1 ? '👍' : '📚'} {option.points} pts
                  </span>
                </div>
              </button>
            )) : (
              <p className="text-gray-500 dark:text-gray-400 text-center py-4">No answer options available.</p>
            )}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-between gap-3 sm:gap-4">
          <button
            onClick={prevQuestion}
            disabled={safeCurrentQuestion === 0}
            className="group px-4 sm:px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center transition-all transform hover:scale-105 disabled:hover:scale-100 min-h-[44px] touch-manipulation text-sm sm:text-base"
            aria-label="Go to previous question"
          >
            <ChevronLeft className="w-4 h-4 mr-1 sm:mr-2 group-hover:-translate-x-1 transition-transform flex-shrink-0" />
            <span className="hidden sm:inline">Previous</span>
            <span className="sm:hidden">Prev</span>
          </button>

          <button
            onClick={nextQuestion}
            disabled={!currentAnswer}
            className="group px-4 sm:px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center transition-all transform hover:scale-105 disabled:hover:scale-100 shadow-lg min-h-[44px] touch-manipulation text-sm sm:text-base"
            aria-label={safeCurrentQuestion === questions.length - 1 ? 'Complete assessment' : 'Go to next question'}
          >
            <span className="hidden sm:inline">
              {safeCurrentQuestion === questions.length - 1 ? 'Complete Assessment' : 'Next Question'}
            </span>
            <span className="sm:hidden">
              {safeCurrentQuestion === questions.length - 1 ? 'Complete' : 'Next'}
            </span>
            <ChevronRight className="w-4 h-4 ml-1 sm:ml-2 group-hover:translate-x-1 transition-transform flex-shrink-0" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default PrivacyRightsCheckup;