import { useState, useEffect, useMemo } from 'react';
import { Shield, ChevronRight, ChevronLeft, Info, AlertTriangle, Lock, Key, Smartphone, Wifi, Globe } from 'lucide-react';
import { analytics } from '../../utils/analytics.js';

const SecurityAssessment = ({ onComplete, breadcrumbs, backButton, themeToggle }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showInfo, setShowInfo] = useState(false);
  const [animationState, setAnimationState] = useState('entering');
  const [selectedAnswerIndex, setSelectedAnswerIndex] = useState(-1);
  const [awarenessScore, setAwarenessScore] = useState(0);

  // Security awareness questions - focused on knowledge and awareness, not practices
  const questions = useMemo(() => [
    {
      id: 'phishingAwareness',
      title: 'Phishing & Social Engineering Awareness',
      question: 'Do you know how to identify phishing attempts? For example, can you recognize suspicious emails, fake websites, or social engineering tactics that try to trick you into revealing sensitive information?',
      description: 'Phishing is one of the most common attack vectors. Understanding how to identify phishing attempts helps protect you from scams that try to steal your credentials, financial information, or personal data.',
      options: [
        { value: 'expert', label: '✅ Yes, I can identify multiple phishing tactics including email spoofing, fake websites, and social engineering', points: 3 },
        { value: 'good', label: '🎓 I can identify basic phishing attempts like suspicious emails, but may miss advanced tactics', points: 2 },
        { value: 'basic', label: '🤔 I know what phishing is, but I\'m not confident I could always spot it', points: 1 },
        { value: 'unaware', label: '❓ No, I\'m not sure how to identify phishing attempts', points: 0 }
      ]
    },
    {
      id: 'malwareAwareness',
      title: 'Malware & Threat Recognition',
      question: 'Are you aware of different types of malware threats (viruses, ransomware, spyware, trojans) and how they can infect your devices? Do you know the warning signs of a malware infection?',
      description: 'Malware comes in many forms and can cause serious damage. Understanding different malware types and their warning signs helps you take preventive action and respond quickly if infected.',
      options: [
        { value: 'expert', label: '✅ Yes, I understand multiple malware types and can recognize warning signs of infection', points: 3 },
        { value: 'good', label: '🎓 I know about common malware types like viruses and ransomware, and some warning signs', points: 2 },
        { value: 'basic', label: '🤔 I\'ve heard of malware but don\'t know the different types or warning signs', points: 1 },
        { value: 'unaware', label: '❓ No, I\'m not familiar with malware threats or warning signs', points: 0 }
      ]
    },
    {
      id: 'ransomwareAwareness',
      title: 'Ransomware Awareness & Prevention',
      question: 'Do you understand what ransomware is, how it works, how to prevent it, and what to do if your device is infected? For example, do you know why you should never pay the ransom, how ransomware spreads, and why backups are your best defense?',
      description: 'Ransomware encrypts your files and demands payment to restore access. It\'s one of the most destructive cyber threats, affecting millions of users and businesses. Understanding ransomware helps you prevent attacks and respond correctly if infected. Never pay the ransom - it funds criminal activity and doesn\'t guarantee file recovery.',
      options: [
        { value: 'expert', label: '✅ Yes, I understand ransomware, how it spreads, prevention methods, and why you should never pay the ransom', points: 3 },
        { value: 'good', label: '🎓 I know what ransomware is and that backups help, but I\'m not sure about all prevention methods', points: 2 },
        { value: 'basic', label: '🤔 I\'ve heard of ransomware but don\'t understand how it works or how to prevent it', points: 1 },
        { value: 'unaware', label: '❓ No, I\'m not familiar with ransomware threats', points: 0 }
      ]
    },
    {
      id: 'passwordSecurityKnowledge',
      title: 'Password Security Best Practices',
      question: 'Do you understand what makes a strong password? For example, do you know why length matters more than complexity, why password reuse is dangerous, and why password managers are recommended?',
      description: 'Password security is fundamental to protecting your accounts. Understanding password best practices helps you create and manage secure credentials that protect against unauthorized access.',
      options: [
        { value: 'expert', label: '✅ Yes, I understand password length, complexity, uniqueness, and why password managers are recommended', points: 3 },
        { value: 'good', label: '🎓 I know passwords should be strong and unique, but I\'m not sure about all best practices', points: 2 },
        { value: 'basic', label: '🤔 I know passwords should be strong, but I don\'t understand why or how to manage them securely', points: 1 },
        { value: 'unaware', label: '❓ No, I\'m not familiar with password security best practices', points: 0 }
      ]
    },
    {
      id: 'twoFactorAuthKnowledge',
      title: 'Multi-Factor Authentication Understanding',
      question: 'Do you understand what two-factor authentication (2FA) or multi-factor authentication (MFA) is, why it\'s important, and the different types available (SMS, authenticator apps, security keys)?',
      description: 'Multi-factor authentication adds an extra layer of security beyond passwords. Understanding how 2FA/MFA works and the different methods available helps you choose the most secure options.',
      options: [
        { value: 'expert', label: '✅ Yes, I understand 2FA/MFA, why it\'s important, and know the differences between SMS, apps, and security keys', points: 3 },
        { value: 'good', label: '🎓 I know what 2FA is and why it\'s important, but I\'m not familiar with all the different types', points: 2 },
        { value: 'basic', label: '🤔 I\'ve heard of 2FA but I don\'t really understand how it works or why it\'s important', points: 1 },
        { value: 'unaware', label: '❓ No, I\'m not familiar with two-factor or multi-factor authentication', points: 0 }
      ]
    },
    {
      id: 'networkSecurityAwareness',
      title: 'Network Security Awareness',
      question: 'Do you understand the security risks of public Wi-Fi networks, how VPNs can help protect you, and why home network security (router settings, encryption) matters?',
      description: 'Network security is crucial for protecting your data in transit. Understanding public Wi-Fi risks, VPN benefits, and home network security helps you protect your data when connected to networks.',
      options: [
        { value: 'expert', label: '✅ Yes, I understand public Wi-Fi risks, VPN benefits, and home network security best practices', points: 3 },
        { value: 'good', label: '🎓 I know public Wi-Fi can be risky and VPNs help, but I\'m not sure about home network security', points: 2 },
        { value: 'basic', label: '🤔 I\'ve heard public Wi-Fi can be unsafe, but I don\'t understand the details or solutions', points: 1 },
        { value: 'unaware', label: '❓ No, I\'m not aware of network security risks or protection methods', points: 0 }
      ]
    },
    {
      id: 'softwareUpdateAwareness',
      title: 'Software Update & Patch Awareness',
      question: 'Do you understand why software updates and security patches are important, what vulnerabilities they fix, and why keeping software updated is a critical security practice?',
      description: 'Software updates often include critical security patches that fix vulnerabilities. Understanding why updates matter helps you maintain secure systems and protect against known threats.',
      options: [
        { value: 'expert', label: '✅ Yes, I understand updates fix security vulnerabilities and why keeping software updated is critical', points: 3 },
        { value: 'good', label: '🎓 I know updates are important for security, but I\'m not sure about the details of vulnerabilities and patches', points: 2 },
        { value: 'basic', label: '🤔 I know I should update software, but I don\'t really understand why it\'s important for security', points: 1 },
        { value: 'unaware', label: '❓ No, I\'m not aware of why software updates are important for security', points: 0 }
      ]
    },
    {
      id: 'dataBackupAwareness',
      title: 'Data Backup & Recovery Awareness',
      question: 'Do you understand the importance of regular data backups, different backup methods (cloud, external drives), and how backups protect you from data loss due to ransomware or hardware failure?',
      description: 'Regular backups are your safety net against data loss. Understanding backup strategies and their importance helps you recover from ransomware attacks, hardware failures, or accidental deletion.',
      options: [
        { value: 'expert', label: '✅ Yes, I understand backup importance, different methods, and how they protect against ransomware and data loss', points: 3 },
        { value: 'good', label: '🎓 I know backups are important, but I\'m not familiar with different methods or their specific benefits', points: 2 },
        { value: 'basic', label: '🤔 I\'ve heard backups are good, but I don\'t understand why they\'re important or how they work', points: 1 },
        { value: 'unaware', label: '❓ No, I\'m not aware of data backup importance or methods', points: 0 }
      ]
    },
    {
      id: 'incidentResponseAwareness',
      title: 'Security Incident Response Awareness',
      question: 'If you suspected your account was compromised, clicked a suspicious link, or discovered ransomware on your device, do you know what steps to take? For example, changing passwords, disconnecting from networks, restoring from backups, or reporting incidents?',
      description: 'Knowing how to respond to security incidents, especially ransomware attacks, minimizes damage. Understanding response steps helps you act quickly and effectively if you suspect a security breach, compromise, or ransomware infection. For ransomware, immediate action is critical: disconnect from networks, don\'t pay the ransom, and restore from backups.',
      options: [
        { value: 'expert', label: '✅ Yes, I know the steps: change passwords, check activity, enable 2FA, report incidents, and monitor accounts', points: 3 },
        { value: 'good', label: '🎓 I know some steps like changing passwords, but I\'m not sure about the complete response process', points: 2 },
        { value: 'basic', label: '🤔 I might change my password, but I don\'t know the full response process', points: 1 },
        { value: 'unaware', label: '❓ No, I don\'t know what to do if I suspect a security incident', points: 0 }
      ]
    }
  ], []);

  useEffect(() => {
    setAnimationState('entering');
    const timer = setTimeout(() => setAnimationState('idle'), 300);
    return () => clearTimeout(timer);
  }, [currentQuestion]);

  // Ensure currentQuestion is within bounds
  useEffect(() => {
    if (questions && questions.length > 0) {
      const safeIndex = Math.max(0, Math.min(currentQuestion, questions.length - 1));
      if (safeIndex !== currentQuestion) {
        setCurrentQuestion(safeIndex);
      }
    }
  }, [currentQuestion, questions]);

  const handleAnswer = (option) => {
    const question = questions[currentQuestion];
    if (!question) return; // Safety check
    
    setAnswers({
      ...answers,
      [question.id]: option.value
    });
    setAwarenessScore(prev => prev + option.points);
    setSelectedAnswerIndex(-1);
    
    // Auto-advance after short delay
    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(prev => prev + 1);
      } else {
        handleComplete();
      }
    }, 500);
  };

  const handleComplete = () => {
    const maxScore = questions.length * 3; // 3 points per question max
    const percentage = Math.round((awarenessScore / maxScore) * 100);
    
    const results = {
      answers,
      awarenessScore,
      maxScore,
      percentage,
      level: percentage >= 80 ? 'expert' : percentage >= 60 ? 'good' : percentage >= 40 ? 'basic' : 'beginner',
      completedAt: new Date().toISOString()
    };

    // Track completion
    try {
      analytics.trackAssessmentComplete('security', null, {
        securityAwarenessScore: percentage,
        awarenessLevel: results.level
      });
    } catch (error) {
      if (import.meta.env.DEV) {
        console.warn('Analytics tracking failed:', error);
      }
    }

    if (onComplete) {
      onComplete(results);
    }
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      handleComplete();
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      // Remove previous answer's points
      const prevQuestion = questions[currentQuestion - 1];
      if (prevQuestion) {
        const prevAnswer = answers[prevQuestion.id];
        if (prevAnswer && prevQuestion.options) {
          const prevOption = prevQuestion.options.find(opt => opt.value === prevAnswer);
          if (prevOption) {
            setAwarenessScore(prev => prev - prevOption.points);
          }
        }
      }
      setCurrentQuestion(prev => prev - 1);
    }
  };

  // Safety checks for current question data
  if (!questions || questions.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-slate-900 py-8 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 dark:text-gray-300">No questions available.</p>
        </div>
      </div>
    );
  }

  // Ensure currentQuestion is within bounds (already handled in useEffect above)
  const safeCurrentQuestion = Math.max(0, Math.min(currentQuestion, questions.length - 1));
  const currentQuestionData = questions[safeCurrentQuestion];
  
  if (!currentQuestionData) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-slate-900 py-8 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 dark:text-gray-300">Question data not available.</p>
        </div>
      </div>
    );
  }

  const progress = ((safeCurrentQuestion + 1) / questions.length) * 100;
  const hasAnswered = answers[currentQuestionData.id] !== undefined;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex-1">{breadcrumbs}</div>
          <div className="flex items-center space-x-4">
            {themeToggle}
            {backButton}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Question {safeCurrentQuestion + 1} of {questions.length}
            </span>
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {Math.round(progress)}%
            </span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-slate-700 rounded-full h-2">
            <div
              className="bg-green-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Question Card */}
        <div
          className={`bg-white dark:bg-slate-800 rounded-xl shadow-lg p-8 mb-6 transition-all duration-300 ${
            animationState === 'entering' ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'
          }`}
        >
          <div className="flex items-start mb-6">
            <div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-lg mr-4">
              <Shield className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
            <div className="flex-1">
              <h2 className="text-lg font-semibold text-green-600 dark:text-green-400 mb-2">
                {currentQuestionData.title}
              </h2>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                {currentQuestionData.question}
              </h3>
              <button
                onClick={() => setShowInfo(!showInfo)}
                className="flex items-center text-sm text-gray-600 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400 transition-colors"
              >
                <Info className="h-4 w-4 mr-1" />
                {showInfo ? 'Hide' : 'Show'} explanation
              </button>
              {showInfo && (
                <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                  <p className="text-sm text-blue-800 dark:text-blue-200">
                    {currentQuestionData.description}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Answer Options */}
          <div className="space-y-3">
            {currentQuestionData.options && Array.isArray(currentQuestionData.options) ? currentQuestionData.options.map((option, index) => {
              const isSelected = answers[currentQuestionData.id] === option.value;
              return (
                <button
                  key={option.value}
                  onClick={() => {
                    setSelectedAnswerIndex(index);
                    handleAnswer(option);
                  }}
                  disabled={hasAnswered}
                  className={`w-full text-left p-4 rounded-lg border-2 transition-all duration-200 ${
                    isSelected
                      ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                      : hasAnswered
                      ? 'border-gray-200 dark:border-slate-700 opacity-50 cursor-not-allowed'
                      : 'border-gray-200 dark:border-slate-700 hover:border-green-300 dark:hover:border-green-700 hover:bg-gray-50 dark:hover:bg-slate-700'
                  }`}
                >
                  <span className="text-gray-900 dark:text-white font-medium">
                    {option.label}
                  </span>
                </button>
              );
            }) : (
              <p className="text-gray-500 dark:text-gray-400 text-center py-4">No answer options available.</p>
            )}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <button
            onClick={handlePrevious}
            disabled={currentQuestion === 0}
            className="flex items-center px-6 py-3 bg-gray-200 dark:bg-slate-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft className="h-5 w-5 mr-2" />
            Previous
          </button>

          {hasAnswered && currentQuestion < questions.length - 1 && (
            <button
              onClick={handleNext}
              className="flex items-center px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
            >
              Next
              <ChevronRight className="h-5 w-5 ml-2" />
            </button>
          )}

          {currentQuestion === questions.length - 1 && hasAnswered && (
            <button
              onClick={handleComplete}
              className="flex items-center px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
            >
              Complete Assessment
              <ChevronRight className="h-5 w-5 ml-2" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default SecurityAssessment;

