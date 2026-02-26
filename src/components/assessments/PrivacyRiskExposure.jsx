import { useState, useEffect } from 'react';
import { Shield, ChevronRight, ChevronLeft, AlertTriangle, Info, BookOpen, Globe, Lock as LockIcon } from 'lucide-react';
import { analytics } from '../../utils/analytics.js';
import { ExposureQuestionMapping, PrivacyRegulations } from '../../data/regulationsMapping';

const PrivacyRiskExposure = ({ onComplete, breadcrumbs, backButton, themeToggle }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showRegulationInfo, setShowRegulationInfo] = useState(false);
  const [animationState, setAnimationState] = useState('entering');
  const [selectedAnswerIndex, setSelectedAnswerIndex] = useState(-1);
  const [followUpState, setFollowUpState] = useState(null); // Track Yes/No follow-up state

  const questions = [
    {
      id: 'publicWiFi',
      questionType: 'yesno',
      question: 'When you\'re outside the home and workplace (at a coffee shop or airport), do you connect to their free Wi-Fi?',
      explanation: 'Public Wi-Fi networks are often unsecured, allowing hackers to easily intercept your data, including login credentials, credit card information, and personal messages.',
      yesNoOptions: [
        { value: true, label: 'Yes, I connect to free Wi-Fi' },
        { value: false, label: 'No, I avoid public Wi-Fi' }
      ],
      followUp: {
        yes: {
          question: 'How often do you use public Wi-Fi?',
          options: [
            { value: 'frequent', label: '☕ All the time - several times per week', risk: 'critical' },
            { value: 'occasional', label: '📅 Sometimes - a few times per month when convenient', risk: 'medium' },
            { value: 'rare', label: '⚠️ Rarely - only in emergencies', risk: 'low' }
          ]
        },
        no: {
          question: 'You avoid public Wi-Fi - that\'s great for security!',
          options: [
            { value: 'never', label: '🚫 I only use my mobile data or private networks', risk: 'low' }
          ]
        }
      }
    },
    {
      id: 'passwordManagement',
      questionType: 'multipleChoice',
      question: 'When creating passwords, do you reuse the same one or create new ones each time?',
      explanation: 'Using the same password across multiple accounts creates a massive security risk. One data breach can compromise all your accounts simultaneously.',
      options: [
        { value: 'same', label: '📋 Same password for most accounts', risk: 'critical' },
        { value: 'variations', label: '🔄 Small variations of the same password (like adding numbers)', risk: 'high' },
        { value: 'unique', label: '🛡️ Unique passwords, but only for important accounts', risk: 'medium' },
        { value: 'strongUnique', label: '🔐 Unique, strong password for every single account', risk: 'low' }
      ]
    },
    {
      id: 'privacyLawAwareness',
      questionType: 'multipleChoice',
      question: 'When a company collects your data (like your email, name, or shopping history), do you know what you can do about it? For example, can you ask them to delete it, see what they have, or stop them from selling it?',
      explanation: 'Understanding your rights under privacy laws like GDPR, CCPA, and newer 2025 legislation empowers you to take control of your personal data and protect yourself from exploitation.',
      options: [
        { value: 'unaware', label: '❓ No, I don\'t know what rights I have', risk: 'high' },
        { value: 'heard', label: '📢 I\'ve heard about privacy rights, but don\'t know the details', risk: 'medium' },
        { value: 'partial', label: '🎓 I know some of my rights, but not all of them', risk: 'medium' },
        { value: 'full', label: '✅ Yes, I have a good understanding of my privacy rights', risk: 'low' }
      ]
    },
    {
      id: 'dataSharing',
      questionType: 'yesno',
      question: 'When apps ask for permissions (like access to your contacts or location), do you review the app\'s privacy policy to understand what they\'ll do with your data?',
      explanation: 'Apps often request excessive permissions to collect your personal data. Accepting all permissions without review can expose your contacts, location, browsing habits, and other sensitive information.',
      yesNoOptions: [
        { value: true, label: 'Yes, I review them' },
        { value: false, label: 'No, I usually just accept' }
      ],
      followUp: {
        yes: {
          question: 'How carefully do you review app permissions?',
          options: [
            { value: 'carefulReview', label: '🔍 Very carefully - I often limit unnecessary permissions', risk: 'low' },
            { value: 'strictPrivacy', label: '🛡️ Extremely carefully - I\'m very selective and regularly audit apps', risk: 'low' }
          ]
        },
        no: {
          question: 'How often do you accept permissions without reviewing?',
          options: [
            { value: 'noReview', label: '✅ Almost always - I accept all permissions', risk: 'critical' },
            { value: 'quickReview', label: '👀 Sometimes - I briefly check but usually accept', risk: 'medium' }
          ]
        }
      }
    },
    {
      id: 'deviceSecurity',
      questionType: 'multipleChoice',
      question: 'Do you use screen locks, passwords, or fingerprint/Face ID on your devices?',
      explanation: 'Device security is your last line of defense. If someone gains physical access to your device, proper security measures can still protect your sensitive data and accounts.',
      options: [
        { value: 'minimal', label: '🔓 Minimal - Simple passwords or no locks on some devices', risk: 'critical' },
        { value: 'basic', label: '🔒 Basic - Screen locks on all devices, but no extra security', risk: 'medium' },
        { value: 'good', label: '🛡️ Good - Strong locks and two-factor authentication on important accounts', risk: 'low' },
        { value: 'comprehensive', label: '👆 Comprehensive - Biometrics, 2FA everywhere, encryption, and regular security checks', risk: 'low' }
      ]
    },
    {
      id: 'socialMediaUse',
      questionType: 'yesno',
      question: 'Do you use social media platforms like Facebook, Instagram, or Twitter?',
      explanation: 'Social media platforms collect extensive personal data and create a permanent digital footprint. Frequent use increases your exposure to data collection, targeted advertising, and potential privacy violations.',
      yesNoOptions: [
        { value: true, label: 'Yes, I use social media' },
        { value: false, label: 'No, I don\'t use social media' }
      ],
      followUp: {
        yes: {
          question: 'How often do you use social media?',
          options: [
            { value: 'heavy', label: '📱 Multiple times daily - actively posting and engaging', risk: 'high' },
            { value: 'daily', label: '📅 At least once per day', risk: 'medium' },
            { value: 'moderate', label: '📊 Several times per week - occasional posting', risk: 'medium' },
            { value: 'light', label: '👀 Occasionally - rarely post', risk: 'low' }
          ]
        },
        no: {
          question: 'You don\'t use social media - that\'s excellent for privacy!',
          options: [
            { value: 'never', label: '🚫 I don\'t have social media accounts', risk: 'low' }
          ]
        }
      }
    },
    {
      id: 'publicSharing',
      questionType: 'yesno',
      question: 'Do you share personal information publicly online (where anyone can see it)?',
      explanation: 'Publicly sharing personal information creates a permanent digital footprint that can affect your privacy, reputation, and future opportunities. Once shared, this information is difficult to remove completely.',
      yesNoOptions: [
        { value: true, label: 'Yes, I share publicly' },
        { value: false, label: 'No, I keep things private' }
      ],
      followUp: {
        yes: {
          question: 'How much personal information do you share publicly?',
          options: [
            { value: 'everything', label: '🌐 Almost everything - personal details, location, family info', risk: 'critical' },
            { value: 'frequently', label: '📸 Frequently - regular posts with personal details and photos', risk: 'high' },
            { value: 'sometimes', label: '🤔 Sometimes - occasional personal posts, mostly general content', risk: 'medium' }
          ]
        }
      }
    }
  ];

  const handleAnswer = (value, isYesNoAnswer = false) => {
    const currentQ = questions[currentQuestion];
    
    // Track first answer for funnel analysis
    if (Object.keys(answers).length === 0 && !followUpState) {
      analytics.trackFunnelStep('firstQuestionAnswer', {
        assessment_type: 'exposure',
        first_answer: value,
        question_id: currentQ.id
      });
    }
    
    // Handle Yes/No questions - allow changing Yes/No answer even if followUpState is already set
    if (currentQ.questionType === 'yesno' && isYesNoAnswer && (followUpState === null || followUpState !== value)) {
      // If changing from one Yes/No option to another, clear the previous answer
      if (followUpState !== null && followUpState !== value) {
        // User is changing their Yes/No answer, clear the previous answer
        setAnswers(prev => {
          const newAnswers = { ...prev };
          delete newAnswers[currentQ.id];
          return newAnswers;
        });
      }
      
      setFollowUpState(value); // Store Yes/No answer
      setSelectedAnswerIndex(-1);
      
      // Check if follow-up exists for this branch
      const followUpBranch = value === true ? 'yes' : 'no';
      const followUpOptions = currentQ.followUp?.[followUpBranch]?.options;
      
      // If no follow-up exists, save the Yes/No answer directly
      if (!followUpOptions || followUpOptions.length === 0) {
        setAnswers(prev => ({
          ...prev,
          [currentQ.id]: value
        }));
        return;
      }
      
      // Auto-select if follow-up has only one option
      if (followUpOptions && Array.isArray(followUpOptions) && followUpOptions.length === 1) {
        // Auto-select the single option after a brief delay for smooth transition
        setTimeout(() => {
          if (followUpOptions[0] && followUpOptions[0].value) {
            handleAnswer(followUpOptions[0].value);
          }
        }, 300);
      }
      return; // Don't save answer yet, wait for follow-up
    }
    
    // Handle follow-up answer
    if (followUpState !== null && currentQ.questionType === 'yesno') {
      // Save the final answer value from follow-up
      // Explicitly check followUpState to ensure correct branch
      const followUpBranch = followUpState === true ? 'yes' : 'no';
      const followUpOptions = currentQ.followUp[followUpBranch]?.options;
      if (!followUpOptions) {
        // Only log in development - this should not happen in production
        if (import.meta.env.DEV) {
          console.error('Follow-up options not found for branch:', followUpBranch);
        }
        return;
      }
      setAnswers(prev => ({
        ...prev,
        [currentQ.id]: value
      }));
      setSelectedAnswerIndex(followUpOptions.findIndex(opt => opt.value === value));
      // Don't clear followUpState here - let it persist so Next button works
      return;
    }
    
    // Handle regular multiple choice
    if (currentQ.options && Array.isArray(currentQ.options)) {
      setSelectedAnswerIndex(currentQ.options.findIndex(opt => opt.value === value));
    } else {
      setSelectedAnswerIndex(-1);
    }
    setAnswers(prev => ({
      ...prev,
      [currentQ.id]: value
    }));
  };

  const nextQuestion = () => {
    setAnimationState('leaving');
    setTimeout(() => {
      // If we're in a follow-up and have an answer, clear follow-up and advance
      if (followUpState !== null && currentAnswer) {
        setFollowUpState(null);
        setSelectedAnswerIndex(-1);
        // Continue to next question
        if (currentQuestion < questions.length - 1) {
          setCurrentQuestion(prev => prev + 1);
          setAnimationState('entering');
        } else {
          onComplete(answers);
        }
        return;
      }
      
      // If Yes/No question was answered but no follow-up was shown (shouldn't happen with current questions, but handle it)
      if (currentQ.questionType === 'yesno' && followUpState !== null && !currentAnswer) {
        // This means Yes/No was selected but follow-up wasn't answered
        // Check if follow-up is required
        const followUpBranch = followUpState === true ? 'yes' : 'no';
        const followUpOptions = currentQ.followUp?.[followUpBranch]?.options;
        if (!followUpOptions || followUpOptions.length === 0) {
          // No follow-up required, save the Yes/No answer and advance
          setAnswers(prev => ({
            ...prev,
            [currentQ.id]: followUpState
          }));
        } else {
          // Follow-up required but not answered, don't advance
          return;
        }
      }
      
      // Regular question navigation
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(prev => prev + 1);
        setAnimationState('entering');
        setSelectedAnswerIndex(-1);
        setFollowUpState(null); // Reset follow-up state
      } else {
        onComplete(answers);
      }
    }, 300);
  };

  const prevQuestion = () => {
    // If we're in a follow-up, go back to Yes/No question (same question index)
    if (followUpState !== null) {
      setAnimationState('leaving');
      setTimeout(() => {
        setFollowUpState(null);
        setSelectedAnswerIndex(-1);
        setAnimationState('entering');
      }, 300);
      return;
    }
    
    // Go to previous question
    if (currentQuestion > 0) {
      setAnimationState('leaving');
      setTimeout(() => {
        const prevQuestionIndex = currentQuestion - 1;
        const prevQ = questions[prevQuestionIndex];
        const prevAnswer = answers[prevQ.id];
        
        // Update question index first
        setCurrentQuestion(prevQuestionIndex);
        setAnimationState('entering');
        
        // Handle Yes/No question restoration
        if (prevQ.questionType === 'yesno' && prevAnswer !== undefined) {
          // Determine if answer was from yes or no branch
          const yesOptions = prevQ.followUp?.yes?.options?.map(o => o.value) || [];
          const noOptions = prevQ.followUp?.no?.options?.map(o => o.value) || [];
          
          // Check if answer is a boolean (direct Yes/No answer without follow-up)
          if (prevAnswer === true || prevAnswer === false) {
            // Direct Yes/No answer, show the Yes/No buttons with selection
            setFollowUpState(prevAnswer);
            setSelectedAnswerIndex(-1);
          } else if (yesOptions.includes(prevAnswer)) {
            // Answer came from "yes" branch - show follow-up
            setFollowUpState(true);
            setSelectedAnswerIndex(yesOptions.findIndex(v => v === prevAnswer));
          } else if (noOptions.includes(prevAnswer)) {
            // Answer came from "no" branch - show follow-up
            setFollowUpState(false);
            setSelectedAnswerIndex(noOptions.findIndex(v => v === prevAnswer));
          } else {
            // Answer doesn't match any branch, reset
            setFollowUpState(null);
            setSelectedAnswerIndex(-1);
          }
        } else if (prevAnswer !== undefined && prevQ.options) {
          // Regular multiple choice question
          setFollowUpState(null);
          setSelectedAnswerIndex(prevQ.options.findIndex(opt => opt.value === prevAnswer));
        } else {
          // No previous answer, reset everything
          setFollowUpState(null);
          setSelectedAnswerIndex(-1);
        }
      }, 300);
    }
  };

  useEffect(() => {
    if (animationState === 'entering') {
      const timer = setTimeout(() => setAnimationState('visible'), 100);
      return () => clearTimeout(timer);
    }
  }, [animationState]);

  // Smooth transition when showing follow-up
  useEffect(() => {
    if (followUpState !== null && questions[currentQuestion]?.questionType === 'yesno') {
      setAnimationState('entering');
      setTimeout(() => setAnimationState('visible'), 100);
    }
  }, [followUpState, currentQuestion]);

  // Safety checks
  if (!questions || questions.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-slate-900 py-8 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 dark:text-gray-300">No questions available.</p>
        </div>
      </div>
    );
  }

  // Ensure currentQuestion is within bounds
  const safeCurrentQuestion = Math.max(0, Math.min(currentQuestion, questions.length - 1));

  // Get current question and determine if we're showing follow-up
  const currentQ = questions[safeCurrentQuestion];
  
  if (!currentQ) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-slate-900 py-8 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 dark:text-gray-300">Question data not available.</p>
        </div>
      </div>
    );
  }

  const isShowingFollowUp = currentQ.questionType === 'yesno' && followUpState !== null;
  // Explicitly determine which follow-up branch to show
  const followUpBranch = isShowingFollowUp ? (followUpState === true ? 'yes' : 'no') : null;
  const displayQuestion = isShowingFollowUp 
    ? (currentQ.followUp && currentQ.followUp[followUpBranch] ? currentQ.followUp[followUpBranch] : currentQ)
    : currentQ;
  const displayOptions = isShowingFollowUp
    ? (currentQ.followUp && currentQ.followUp[followUpBranch]?.options ? currentQ.followUp[followUpBranch].options : null)
    : (currentQ.questionType === 'yesno' ? (currentQ.yesNoOptions || []) : (currentQ.options || []));
  
  const progress = ((safeCurrentQuestion + 1) / questions.length) * 100;
  const currentAnswer = answers[currentQ.id];
  const selectedOption = displayOptions?.find(opt => {
    if (currentQ.questionType === 'yesno' && !isShowingFollowUp) {
      return opt.value === followUpState;
    }
    return opt.value === currentAnswer;
  });
  const questionMapping = ExposureQuestionMapping[currentQ.id];

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100 dark:from-slate-900 dark:to-slate-800 py-4 sm:py-6 md:py-8 safe-area-inset-top safe-area-inset-bottom">
      <div className="max-w-4xl mx-auto px-3 sm:px-4 md:px-6">
        {/* Navigation Header */}
        <div className="flex items-center justify-between mb-3 sm:mb-4 md:mb-6 gap-2">
          <div className="flex-1 min-w-0">
            {breadcrumbs}
          </div>
          <div className="flex items-center space-x-1.5 sm:space-x-2 md:space-x-4 flex-shrink-0">
            {themeToggle}
            {backButton}
          </div>
        </div>

        {/* Header */}
        <div className="text-center mb-4 sm:mb-6 md:mb-8">
          <div className="inline-flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 bg-red-500 text-white rounded-full mb-2 sm:mb-3 md:mb-4">
            <LockIcon className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8" />
          </div>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-1 sm:mb-2 px-2">
            Privacy Risk Exposure Assessment
          </h1>
          <p className="text-xs sm:text-sm md:text-base lg:text-lg text-gray-600 dark:text-gray-300 px-2">
            Discover your digital privacy vulnerabilities and risk exposure
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-4 sm:mb-6 md:mb-8">
          <div className="flex justify-between text-[10px] sm:text-xs md:text-sm text-gray-600 dark:text-gray-300 mb-1.5 sm:mb-2">
            <span>Question {safeCurrentQuestion + 1} of {questions.length}</span>
            <span className="font-medium">{Math.round(progress)}% Complete</span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 sm:h-2.5 md:h-3 overflow-hidden">
            <div 
              className="bg-gradient-to-r from-red-500 to-red-600 h-2 sm:h-2.5 md:h-3 rounded-full transition-all duration-500 shadow-sm"
              style={{ width: `${progress}%` }}
            >
              <div className="h-full bg-white/20 animate-pulse rounded-full"></div>
            </div>
          </div>
          
          {/* Progress Indicators */}
          <div className="flex justify-between mt-1.5 sm:mt-2 gap-0.5 sm:gap-1">
            {questions.map((_, index) => (
              <div
                key={index}
                className={`w-1.5 h-1.5 sm:w-2 sm:h-2 md:w-3 md:h-3 rounded-full transition-all duration-300 flex-shrink-0 ${
                  index < currentQuestion ? 'bg-green-500' :
                  index === currentQuestion ? 'bg-red-500 animate-pulse' :
                  'bg-gray-300 dark:bg-gray-600'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Question Card */}
        <div className={`bg-white dark:bg-slate-800 rounded-lg sm:rounded-xl shadow-lg border border-gray-200 dark:border-slate-700 p-3 sm:p-4 md:p-6 lg:p-8 mb-4 sm:mb-6 md:mb-8 transition-all duration-300 ${
          animationState === 'leaving' ? 'opacity-50 transform scale-95' : 
          animationState === 'entering' ? 'opacity-0 transform translate-y-4' :
          'opacity-100 transform scale-100'
        }`}>
          <h2 className="text-base sm:text-lg md:text-xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4 md:mb-6 animate-fade-in leading-tight">
            {displayQuestion.question}
          </h2>
          
          {/* Context explanation - show main question explanation */}
          {!isShowingFollowUp && (
            <div className="mb-3 sm:mb-4 md:mb-6 p-2.5 sm:p-3 md:p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <div className="flex items-start">
                <Info className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 text-blue-600 dark:text-blue-400 mr-2 sm:mr-3 mt-0.5 flex-shrink-0" />
                <p className="text-blue-800 dark:text-blue-200 text-[11px] sm:text-xs md:text-sm leading-relaxed">
                  {currentQ.explanation}
                </p>
              </div>
            </div>
          )}
          
          {/* Show breadcrumb for follow-up questions */}
          {isShowingFollowUp && (
            <div className="mb-4 flex items-center text-sm text-gray-600 dark:text-gray-400">
              <span className="bg-blue-100 dark:bg-blue-900/30 px-3 py-1 rounded-full">
                {currentQ.question}
              </span>
              <ChevronRight className="w-4 h-4 mx-2" />
              <span className="font-medium text-gray-900 dark:text-white">
                {displayQuestion.question}
              </span>
            </div>
          )}

          {/* Regulation Information Toggle */}
          {questionMapping && (
            <div className="mb-4 sm:mb-6">
              <button
                onClick={() => setShowRegulationInfo(!showRegulationInfo)}
                className="w-full sm:w-auto flex items-center justify-between sm:justify-start text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors p-2 sm:p-0 rounded-lg sm:rounded-none hover:bg-blue-50 dark:hover:bg-blue-900/20 sm:hover:bg-transparent touch-manipulation min-h-[44px] sm:min-h-0"
                aria-expanded={showRegulationInfo}
                aria-label="Toggle privacy rights information"
              >
                <div className="flex items-center">
                  <Globe className="w-4 h-4 sm:w-5 sm:h-5 mr-2 flex-shrink-0" />
                  <span className="text-xs sm:text-sm font-medium text-left">
                    Learn About Your Privacy Rights ({questionMapping?.regulations?.length || 0} laws)
                  </span>
                </div>
                <ChevronRight className={`w-4 h-4 ml-2 sm:ml-1 transition-transform flex-shrink-0 ${showRegulationInfo ? 'rotate-90' : ''}`} />
              </button>
              
              {showRegulationInfo && (
                <div className="mt-3 sm:mt-4 p-3 sm:p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                  <h3 className="text-sm sm:text-base font-medium text-blue-900 dark:text-blue-100 mb-2 sm:mb-3 flex items-center">
                    <BookOpen className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-2 flex-shrink-0" />
                    {questionMapping.title}
                  </h3>
                  <div className="space-y-2 sm:space-y-3 mb-2 sm:mb-3">
                    {questionMapping?.requirements && Array.isArray(questionMapping.requirements) ? questionMapping.requirements.map((req, index) => {
                      if (!req || !req.regulation) return null;
                      const regulation = PrivacyRegulations[req.regulation];
                      if (!regulation) return null;
                      return (
                        <div key={index} className="p-2.5 sm:p-3 bg-white dark:bg-slate-700 rounded-lg border border-blue-200 dark:border-blue-700">
                          <div className="text-[10px] sm:text-xs text-blue-600 dark:text-blue-400 mb-1 font-medium">
                            {regulation.name || 'Unknown Regulation'} ({regulation.region || ''})
                          </div>
                          <div className="text-xs sm:text-sm text-blue-800 dark:text-blue-200 leading-relaxed">
                            {req.description ? req.description.split('**').map((part, i) => 
                              i % 2 === 1 ? <strong key={i}>{part}</strong> : part
                            ) : ''}
                          </div>
                        </div>
                      );
                    }) : null}
                  </div>
                  <div className="text-[10px] sm:text-xs text-blue-600 dark:text-blue-400 border-t border-blue-200 dark:border-blue-700 pt-2 leading-relaxed">
                    <strong>Why This Matters:</strong> {questionMapping.businessImpact}
                  </div>
                  <div className="text-[10px] sm:text-xs text-blue-600 dark:text-blue-400 mt-1">
                    <strong>Your Risk Level:</strong> {questionMapping.riskLevel}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Yes/No Buttons for Yes/No questions */}
          {currentQ.questionType === 'yesno' && !isShowingFollowUp && displayOptions && Array.isArray(displayOptions) && (
            <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-4 sm:mb-6">
              {displayOptions.map((option, index) => {
                const isSelected = followUpState === option.value;
                return (
                  <button
                    key={option.value}
                    onClick={() => handleAnswer(option.value, true)}
                    className={`p-4 sm:p-5 md:p-6 rounded-xl border-2 text-center transition-all transform hover:scale-[1.02] min-h-[80px] sm:min-h-[100px] touch-manipulation ${
                      isSelected
                        ? 'border-red-500 bg-red-50 dark:bg-red-900/20 text-red-900 dark:text-red-100 ring-2 ring-red-500/20'
                        : 'border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-slate-700 hover:border-gray-300 dark:hover:border-gray-500 text-gray-900 dark:text-white'
                    }`}
                  >
                    <div className="text-xl sm:text-2xl font-bold mb-1 sm:mb-2">
                      {option.value ? '✓' : '✗'}
                    </div>
                    <div className="font-semibold text-sm sm:text-base md:text-lg">{option.label}</div>
                  </button>
                );
              })}
            </div>
          )}

          {/* Multiple Choice Options */}
          {((currentQ.questionType === 'multipleChoice') || isShowingFollowUp) && displayOptions && Array.isArray(displayOptions) && (
            <div className="space-y-2 sm:space-y-3">
              {displayOptions.map((option, index) => {
                const isSelected = currentAnswer === option.value || 
                  (currentQ.questionType === 'yesno' && !isShowingFollowUp && followUpState === option.value);
                return (
                  <button
                    key={option.value}
                    onClick={() => handleAnswer(option.value)}
                    className={`w-full p-3 sm:p-4 rounded-xl border text-left transition-all transform hover:scale-[1.02] min-h-[44px] touch-manipulation ${
                      isSelected
                        ? 'border-red-500 bg-red-50 dark:bg-red-900/20 text-red-900 dark:text-red-100 ring-2 ring-red-500/20'
                        : 'border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-slate-700 hover:border-gray-300 dark:hover:border-gray-500 text-gray-900 dark:text-white'
                    } ${selectedAnswerIndex === index ? 'animate-pulse' : ''}`}
                    style={{
                      animationDelay: `${index * 100}ms`
                    }}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-medium text-sm sm:text-base">{option.label}</span>
                      {option.risk && (
                        <span className={`text-[10px] sm:text-xs px-2 py-1 rounded-full flex-shrink-0 ${
                          option.risk === 'critical' ? 'bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300' :
                          option.risk === 'high' ? 'bg-orange-100 dark:bg-orange-900 text-orange-700 dark:text-orange-300' :
                          option.risk === 'medium' ? 'bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300' : 
                          'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300'
                        }`}>
                          {option.risk} risk
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          )}

          {/* Risk indicator for selected answer */}
          {selectedOption && selectedOption.risk && (
            <div className={`mt-4 p-3 rounded-lg flex items-center animate-fade-in ${
              selectedOption.risk === 'critical' ? 'bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-200' :
              selectedOption.risk === 'high' ? 'bg-orange-100 dark:bg-orange-900/20 text-orange-800 dark:text-orange-200' :
              selectedOption.risk === 'medium' ? 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-200' : 
              'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-200'
            }`}>
              <AlertTriangle className="w-4 h-4 mr-2 animate-pulse" />
              <span className="text-sm">
                This choice indicates {selectedOption.risk} privacy risk exposure.
              </span>
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="flex justify-between gap-3 sm:gap-4">
          <button
            type="button"
            onClick={prevQuestion}
            disabled={safeCurrentQuestion === 0 && followUpState === null}
            className="group px-4 sm:px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center transition-all transform hover:scale-105 disabled:hover:scale-100 min-h-[44px] touch-manipulation text-sm sm:text-base"
          >
            <ChevronLeft className="w-4 h-4 mr-1 sm:mr-2 group-hover:-translate-x-1 transition-transform flex-shrink-0" />
            <span className="hidden sm:inline">Previous</span>
            <span className="sm:hidden">Prev</span>
          </button>

          <button
            type="button"
            onClick={nextQuestion}
            disabled={
              // Yes/No question: disabled if no Yes/No answer selected
              (currentQ.questionType === 'yesno' && !isShowingFollowUp && followUpState === null) ||
              // Follow-up question: disabled if no follow-up answer selected
              (isShowingFollowUp && !currentAnswer) ||
              // Multiple choice: disabled if no answer selected
              (currentQ.questionType === 'multipleChoice' && !currentAnswer)
            }
            className="group px-4 sm:px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center transition-all transform hover:scale-105 disabled:hover:scale-100 shadow-lg min-h-[44px] touch-manipulation text-sm sm:text-base"
          >
            <span className="hidden sm:inline">
              {safeCurrentQuestion === questions.length - 1 && (currentAnswer || (currentQ.questionType === 'yesno' && followUpState !== null && !isShowingFollowUp)) ? 'Complete Assessment' : 'Next Question'}
            </span>
            <span className="sm:hidden">
              {safeCurrentQuestion === questions.length - 1 && (currentAnswer || (currentQ.questionType === 'yesno' && followUpState !== null && !isShowingFollowUp)) ? 'Complete' : 'Next'}
            </span>
            <ChevronRight className="w-4 h-4 ml-1 sm:ml-2 group-hover:translate-x-1 transition-transform flex-shrink-0" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default PrivacyRiskExposure;