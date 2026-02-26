import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { TrendingDown, TrendingUp, Shield, Scale, User, ChevronRight, Lock as LockIcon, Target, Zap, Clock, AlertCircle, CheckCircle2, Star, Trophy, ArrowRight, BookOpen, ChevronDown, ChevronUp } from 'lucide-react';
import ContextualLinks from '../common/ContextualLinks';
import RelatedContent from '../common/RelatedContent';
import LoadingSpinner from '../common/LoadingSpinner';
import PostAssessmentFeedbackModal from '../common/PostAssessmentFeedbackModal';
import { ActionPlanGenerator } from '../../data/actionPlans.js';
import { analytics } from '../../utils/analytics.js';
import { PersonaProfiles, PersonaColors } from '../../data/personaProfiles';
import { getIconComponent } from '../../utils/iconMapping.js';
import { PersonaDetectionEngine } from '../../utils/personaDetection';
import { calculateExposureScore, calculateRightsScore, getRiskLevel, getRightsLevel } from '../../utils/assessmentScoring';
import EnhancedExposureRecommendations from './EnhancedExposureRecommendations';
import EnhancedRightsRecommendations from './EnhancedRightsRecommendations';
import { privacyConcernCategories, migrateConcerns, getConcernLabel } from '../../data/privacyConcerns';
import { useTranslation } from '../../contexts/TranslationContext';

const AssessmentResults = ({ exposureResults, rightsResults, completeAssessmentResults, actionPlan: providedActionPlan, assessmentType, onComplete, breadcrumbs, themeToggle }) => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [detectedPersona, setDetectedPersona] = useState(null);
  const [exposureScore, setExposureScore] = useState(0);
  const [rightsScore, setRightsScore] = useState(0);
  const [actionPlan, setActionPlan] = useState(null);
  const [quickWins, setQuickWins] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [userBehavior, setUserBehavior] = useState({});
  const [selectedConcerns, setSelectedConcerns] = useState([]);
  const [expandedCategories, setExpandedCategories] = useState({});
  const [validationError, setValidationError] = useState('');
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);

  // Generate personalized action plan based on assessment results
  const generateActionPlan = (exposureResults, rightsResults, persona) => {
    return {
      critical: ActionPlanGenerator.generateCriticalActions(exposureResults, rightsResults, persona),
      important: ActionPlanGenerator.generateImportantActions(exposureResults, rightsResults, persona),
      longTerm: ActionPlanGenerator.generateLongTermActions(exposureResults, rightsResults, persona),
      quickWins: ActionPlanGenerator.generateQuickWins(exposureResults, rightsResults, persona)
    };
  };
  
  const generateRecommendations = (exposureResults, rightsResults, persona, scores) => {
    const recommendations = [];
    
    // Risk-based recommendations
      if (scores.exposureScore < 40) {
        recommendations.push({
          type: 'urgent',
          title: 'Your Privacy Needs Immediate Attention',
          description: `Your Privacy Exposure Score of ${scores.exposureScore}/100 indicates serious vulnerabilities. You're at high risk for identity theft, financial fraud, and privacy violations.`,
          icon: 'AlertCircle',
          color: 'red',
          actions: ['Set up password manager today', 'Enable 2FA on all accounts', 'Review social media privacy settings']
        });
      } else if (scores.exposureScore < 70) {
        recommendations.push({
          type: 'important',
          title: 'Good Start, But Room for Improvement',
          description: `Your Privacy Exposure Score of ${scores.exposureScore}/100 shows you're privacy-conscious but have some gaps to address.`,
          icon: 'Target',
          color: 'yellow',
          actions: ['Strengthen device security', 'Secure your internet connection', 'Audit your online accounts']
        });
      } else {
        recommendations.push({
          type: 'maintain',
          title: 'Excellent Privacy Practices!',
          description: `Your Privacy Exposure Score of ${scores.exposureScore}/100 shows strong privacy habits. Focus on maintaining and fine-tuning.`,
          icon: 'Trophy',
          color: 'green',
          actions: ['Stay updated on privacy news', 'Regular privacy audits', 'Help others improve their privacy']
        });
      }
      
      // Rights-based recommendations
      if (scores.rightsScore < 30) {
        recommendations.push({
          type: 'educational',
          title: 'Unlock the Power of Your Privacy Rights',
          description: `Your rights score of ${scores.rightsScore}/100 means you're missing out on powerful legal protections. Learning to use these rights puts you in control.`,
          icon: 'BookOpen',
          color: 'blue',
          actions: ['Learn about GDPR and CCPA', 'Request your data from major companies', 'Start deleting old accounts']
        });
      }
      
      // Persona-specific recommendations
      const profile = PersonaProfiles[persona.primary];
      if (profile) {
        recommendations.push({
          type: 'personalized',
          title: `Tailored for ${profile.name}`,
          description: profile.description,
          icon: 'User',
          color: 'purple',
          actions: (profile.primaryConcerns && Array.isArray(profile.primaryConcerns) ? profile.primaryConcerns.map(concern => 
            `Focus on ${concern.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}`
          ).slice(0, 3) : [])
        });
      }
    
    return recommendations;
  };

  // Show feedback modal after results are displayed (3 seconds delay)
  useEffect(() => {
    // Show modal after assessment results are displayed
    // Don't require persona to be detected - show for all assessments
    if (assessmentType && !showFeedbackModal && (exposureResults || rightsResults || completeAssessmentResults)) {
      const timer = setTimeout(() => {
        // Check if user has already provided feedback today
        const feedbackKey = `feedback_provided_${assessmentType}_${new Date().toDateString()}`;
        const hasProvidedFeedback = localStorage.getItem(feedbackKey);
        
        // Show modal if feedback hasn't been provided today
        // (Skipping is OK - user can still provide feedback later)
        if (!hasProvidedFeedback) {
          setShowFeedbackModal(true);
        }
      }, 3000); // Show after 3 seconds

      return () => clearTimeout(timer);
    }
  }, [assessmentType, showFeedbackModal, exposureResults, rightsResults, completeAssessmentResults]);

  useEffect(() => {
    // Handle Complete Assessment differently
    if (assessmentType === 'full' && completeAssessmentResults && providedActionPlan) {
      // Use provided action plan from Complete Assessment
      // Normalize the action plan to ensure it has the expected structure
      const normalizedActionPlan = {
        critical: Array.isArray(providedActionPlan.critical) ? providedActionPlan.critical : [],
        important: Array.isArray(providedActionPlan.important) ? providedActionPlan.important : [],
        longTerm: Array.isArray(providedActionPlan.longTerm) ? providedActionPlan.longTerm : [],
        quickWins: Array.isArray(providedActionPlan.quickWins) ? providedActionPlan.quickWins : [],
        ...providedActionPlan // Preserve any other properties
      };
      setActionPlan(normalizedActionPlan);
      setQuickWins(normalizedActionPlan.quickWins);
      
      // Try to detect persona from complete assessment results
      // For now, use a default persona or try to infer from answers
      const persona = PersonaDetectionEngine.analyzeAssessmentResults(
        {},
        {},
        completeAssessmentResults
      ) || { primary: 'privacy-conscious', confidence: 0.7 };
      
      setDetectedPersona(persona);
      
      // Generate recommendations based on action plan priorities
      const recs = [];
      if (providedActionPlan.urgent && Array.isArray(providedActionPlan.urgent) && providedActionPlan.urgent.length > 0) {
        recs.push({
          type: 'urgent',
          title: 'Urgent Actions Required',
          description: 'These actions need immediate attention to protect your privacy.',
          icon: 'AlertCircle',
          color: 'red',
          actions: providedActionPlan.urgent.slice(0, 3)
        });
      }
      if (providedActionPlan.personalized?.primaryGoal) {
        recs.push({
          type: 'personalized',
          title: 'Your Privacy Goal',
          description: `Focusing on: ${providedActionPlan.personalized.primaryGoal}`,
          icon: 'Target',
          color: 'purple',
          actions: providedActionPlan.quickWins?.slice(0, 3) || []
        });
      }
      setRecommendations(recs);
      
      // Set scores based on action readiness (if available)
      // For complete assessment, we don't have traditional scores
      setExposureScore(0);
      setRightsScore(0);
    } else {
      // Handle traditional exposure/rights assessments
      // Calculate scores - scoring functions already handle null
      const expScore = calculateExposureScore(exposureResults);
      const rightsScr = calculateRightsScore(rightsResults);

      setExposureScore(expScore);
      setRightsScore(rightsScr);

      // Detect persona
      const persona = PersonaDetectionEngine.analyzeAssessmentResults(
        exposureResults || {},
        rightsResults || {},
        userBehavior
      );
      
      setDetectedPersona(persona);
      
      // Generate action plan and recommendations
      const plan = generateActionPlan(exposureResults || {}, rightsResults || {}, persona);
      const recs = generateRecommendations(exposureResults || {}, rightsResults || {}, persona, { exposureScore: expScore, rightsScore: rightsScr });
      
      // Ensure action plan has all required properties
      const safeActionPlan = {
        critical: Array.isArray(plan.critical) ? plan.critical : [],
        important: Array.isArray(plan.important) ? plan.important : [],
        longTerm: Array.isArray(plan.longTerm) ? plan.longTerm : [],
        quickWins: Array.isArray(plan.quickWins) ? plan.quickWins : []
      };
      
      setActionPlan(safeActionPlan);
      setQuickWins(safeActionPlan.quickWins);
      setRecommendations(recs);
    }
  }, [exposureResults, rightsResults, completeAssessmentResults, providedActionPlan, assessmentType, userBehavior]);

  // Initialize selected concerns when persona is detected
  useEffect(() => {
    if (detectedPersona?.primary) {
      const personaProfile = PersonaProfiles[detectedPersona.primary];
      if (personaProfile && selectedConcerns.length === 0) {
        // Migrate persona's default concerns
        const migratedConcerns = migrateConcerns(personaProfile.primaryConcerns);
        setSelectedConcerns(migratedConcerns.length > 0 ? migratedConcerns : (privacyConcernCategories && privacyConcernCategories.length > 0 && privacyConcernCategories[0].concerns && Array.isArray(privacyConcernCategories[0].concerns) && privacyConcernCategories[0].concerns.length > 0 ? [privacyConcernCategories[0].concerns[0].id] : []));
      }
    }
  }, [detectedPersona?.primary]);

  const handleCompleteSetup = () => {
    if (!detectedPersona) {
      setValidationError('Please select a privacy persona');
      return;
    }

    if (selectedConcerns.length === 0) {
      setValidationError('Please select at least one privacy concern');
      return;
    }

    setValidationError('');
    // Include custom concerns in persona data
    const personaWithConcerns = {
      ...detectedPersona,
      customConcerns: selectedConcerns
    };
    
    // Save concerns separately for workflow check (redundancy for reliability)
    try {
      localStorage.setItem('socialcaution_concerns', JSON.stringify(selectedConcerns));
    } catch (e) {
      console.warn('Failed to save concerns separately:', e);
    }
    
    onComplete(personaWithConcerns, userBehavior);
  };

  const handlePersonaSelect = (personaId) => {
    const newPersona = {
      ...detectedPersona,
      primary: personaId,
      confidence: 1.0
    };
    setDetectedPersona(newPersona);
    
    // Initialize selected concerns with persona's default concerns
    const personaProfile = PersonaProfiles[personaId];
    if (personaProfile) {
      // Migrate persona's default concerns
      const migratedConcerns = migrateConcerns(personaProfile.primaryConcerns);
      setSelectedConcerns(migratedConcerns.length > 0 ? migratedConcerns : (privacyConcernCategories && privacyConcernCategories.length > 0 && privacyConcernCategories[0].concerns && Array.isArray(privacyConcernCategories[0].concerns) && privacyConcernCategories[0].concerns.length > 0 ? [privacyConcernCategories[0].concerns[0].id] : []));
    }
    setValidationError('');
  };

  const handleCategoryToggle = (categoryId) => {
    const category = privacyConcernCategories.find(c => c.id === categoryId);
    if (!category) return;

    const categoryConcernIds = (category.concerns && Array.isArray(category.concerns) ? category.concerns.map(c => c.id) : []);
    const allCategoryConcernsSelected = categoryConcernIds.every(id => selectedConcerns.includes(id));

    setSelectedConcerns(prev => {
      if (allCategoryConcernsSelected) {
        // Deselect all concerns in this category, but ensure at least one concern remains
        const newConcerns = prev.filter(c => !categoryConcernIds.includes(c));
        if (newConcerns.length === 0) {
          setValidationError('Please select at least one privacy concern');
          return prev;
        }
        return newConcerns;
      } else {
        // Select all concerns in this category
        const newConcerns = [...prev];
        categoryConcernIds.forEach(id => {
          if (!newConcerns.includes(id)) {
            newConcerns.push(id);
          }
        });
        return newConcerns;
      }
    });
    setValidationError('');
  };

  const handleConcernToggle = (concernId) => {
    setSelectedConcerns(prev => {
      if (prev.includes(concernId)) {
        const newConcerns = prev.filter(c => c !== concernId);
        // Ensure at least one concern is selected
        if (newConcerns.length === 0) {
          setValidationError('Please select at least one privacy concern');
          return prev;
        }
        return newConcerns;
      } else {
        return [...prev, concernId];
      }
    });
    setValidationError('');
  };

  const toggleCategoryExpansion = (categoryId) => {
    setExpandedCategories(prev => ({
      ...prev,
      [categoryId]: !prev[categoryId]
    }));
  };

  const exposureRisk = getRiskLevel(exposureScore);
  const rightsLevel = getRightsLevel(rightsScore);

  if (!detectedPersona) {
    return (
      <LoadingSpinner 
        size="lg" 
        text="Analyzing your results..." 
        fullScreen={true}
      />
    );
  }

  const primaryPersona = PersonaProfiles[detectedPersona.primary];
  const personaColor = PersonaColors[primaryPersona.color];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Navigation Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex-1">
            {breadcrumbs}
          </div>
          <div className="flex items-center space-x-4">
            {themeToggle}
          </div>
        </div>

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Your Privacy Assessment Results
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            {assessmentType === 'full' && completeAssessmentResults 
              ? 'Your personalized privacy action plan is ready'
              : 'Here\'s what we discovered about your privacy profile'}
          </p>
        </div>

        {/* Complete Assessment Action Plan Summary */}
        {assessmentType === 'full' && completeAssessmentResults && providedActionPlan && (
          <div className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-xl shadow-sm border border-purple-200 dark:border-purple-800 p-6 mb-8">
            <div className="flex items-center mb-4">
              <Target className="w-6 h-6 text-purple-500 mr-3" />
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Your Personalized Action Plan</h2>
            </div>
            {providedActionPlan.personalized && (
              <div className="mb-4 space-y-2">
                {providedActionPlan.personalized.primaryGoal && (
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    <strong>Primary Goal:</strong> {providedActionPlan.personalized.primaryGoal}
                  </p>
                )}
                {providedActionPlan.personalized.timeCommitment && (
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    <strong>Time Commitment:</strong> {providedActionPlan.personalized.timeCommitment}
                  </p>
                )}
                {providedActionPlan.personalized.biggestConcern && (
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    <strong>Biggest Concern:</strong> {providedActionPlan.personalized.biggestConcern}
                  </p>
                )}
              </div>
            )}
            {providedActionPlan.quickWins && Array.isArray(providedActionPlan.quickWins) && providedActionPlan.quickWins.length > 0 && (
              <div className="mt-4">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">Quick Wins ({providedActionPlan.quickWins.length})</h3>
                <ul className="list-disc list-inside space-y-1 text-sm text-gray-700 dark:text-gray-300">
                  {providedActionPlan.quickWins.slice(0, 5).map((item, idx) => (
                    <li key={idx}>{typeof item === 'string' ? item : item.title || item}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Exposure Score */}
          {exposureResults && (
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 p-6">
              <div className="flex items-center mb-4">
                <LockIcon className="w-6 h-6 text-red-500 mr-3" />
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Privacy Risk Exposure</h2>
              </div>
              
              <div className="text-center mb-6">
                <div className={`text-4xl font-bold mb-2 ${
                  exposureRisk.color === 'green' ? 'text-green-500' :
                  exposureRisk.color === 'yellow' ? 'text-yellow-500' :
                  exposureRisk.color === 'orange' ? 'text-orange-500' : 'text-red-500'
                }`}>
                  {exposureScore}
                </div>
                <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                  exposureRisk.color === 'green' ? 'bg-green-100 text-green-800' :
                  exposureRisk.color === 'yellow' ? 'bg-yellow-100 text-yellow-800' :
                  exposureRisk.color === 'orange' ? 'bg-orange-100 text-orange-800' : 'bg-red-100 text-red-800'
                }`}>
                  {exposureRisk.color === 'red' ? <TrendingDown className="w-4 h-4 mr-1" /> : <TrendingUp className="w-4 h-4 mr-1" />}
                  {exposureRisk.label}
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-300">Privacy Exposure Score</span>
                  <span className="font-medium text-gray-900 dark:text-white">{exposureScore}/100</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full transition-all duration-500 ${
                      exposureRisk.color === 'green' ? 'bg-green-500' :
                      exposureRisk.color === 'yellow' ? 'bg-yellow-500' :
                      exposureRisk.color === 'orange' ? 'bg-orange-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${exposureScore}%` }}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Rights Score */}
          {rightsResults && (
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 p-6">
              <div className="flex items-center mb-4">
                <Scale className="w-6 h-6 text-blue-500 mr-3" />
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Privacy Rights Usage</h2>
              </div>
              
              <div className="text-center mb-6">
                <div className={`text-4xl font-bold mb-2 ${
                  rightsLevel.color === 'green' ? 'text-green-500' :
                  rightsLevel.color === 'blue' ? 'text-blue-500' :
                  rightsLevel.color === 'yellow' ? 'text-yellow-500' : 'text-red-500'
                }`}>
                  {rightsScore}
                </div>
                <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                  rightsLevel.color === 'green' ? 'bg-green-100 text-green-800' :
                  rightsLevel.color === 'blue' ? 'bg-blue-100 text-blue-800' :
                  rightsLevel.color === 'yellow' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
                }`}>
                  <TrendingUp className="w-4 h-4 mr-1" />
                  {rightsLevel.label}
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-300">Rights Exercise Score</span>
                  <span className="font-medium text-gray-900 dark:text-white">{rightsScore}/100</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full transition-all duration-500 ${
                      rightsLevel.color === 'green' ? 'bg-green-500' :
                      rightsLevel.color === 'blue' ? 'bg-blue-500' :
                      rightsLevel.color === 'yellow' ? 'bg-yellow-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${rightsScore}%` }}
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Detected Persona */}
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 p-8 mb-6">
          <div className="flex items-center mb-6">
            <User className="w-6 h-6 text-purple-500 mr-3" />
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Your Privacy Persona</h2>
          </div>

          <div className={`p-6 rounded-xl ${personaColor.bg} ${personaColor.border} border`}>
            <div className="flex items-center mb-4">
              {(() => {
                const IconComponent = getIconComponent(primaryPersona.icon);
                return <IconComponent className={`w-8 h-8 mr-4 ${personaColor.accent}`} />;
              })()}
              <div>
                <h3 className={`text-2xl font-bold ${personaColor.text}`}>
                  {primaryPersona.name}
                </h3>
                <p className={`${personaColor.accent} font-medium`}>
                  {primaryPersona.description}
                </p>
              </div>
              <div className="ml-auto text-right">
                <div className={`text-sm ${personaColor.accent} font-medium`}>Confidence</div>
                <div className={`text-lg font-bold ${personaColor.text}`}>
                  {Math.round(detectedPersona.confidence * 100)}%
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <h4 className={`text-sm font-medium ${personaColor.text} mb-2`}>Selected Concerns:</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedConcerns.length > 0 ? selectedConcerns.map((concernId, index) => (
                    <span key={index} className={`px-3 py-1 rounded-full text-xs font-medium ${personaColor.text} bg-white dark:bg-slate-800 border ${personaColor.border}`}>
                      {getConcernLabel(concernId)}
                    </span>
                  )) : (
                    <span className="text-xs text-gray-500 dark:text-gray-400 italic">No concerns selected</span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Persona Selection - Always Available */}
          <div className="mt-6">
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              {detectedPersona.confidence < 0.8 
                ? "Not quite right? Choose your persona:" 
                : "Want to change your persona? Select a different one:"}
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {Object.entries(PersonaProfiles).map(([key, persona]) => {
                const IconComponent = getIconComponent(persona.icon);
                return (
                  <button
                    key={key}
                    onClick={() => handlePersonaSelect(key)}
                    className={`p-3 rounded-lg border text-left transition-all ${
                      detectedPersona.primary === key
                        ? `border-red-500 bg-red-50 dark:bg-red-900/20`
                        : 'border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-slate-700 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center">
                      <IconComponent className="w-5 h-5 mr-2 text-gray-600 dark:text-gray-300" />
                      <span className="font-medium text-sm text-gray-900 dark:text-white">
                        {t(`personas.${key}.name`)}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Privacy Concerns Selection */}
          <div className="mt-6 pt-6 border-t border-gray-200 dark:border-slate-700">
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Select Your Primary Privacy Concerns: <span className="text-red-500">*</span>
            </h4>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
              Select at least one privacy concern category. You can select entire categories or specific concerns within them.
            </p>

            {validationError && (
              <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-start">
                <AlertCircle className="w-4 h-4 text-red-500 mr-2 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-red-700 dark:text-red-300">{validationError}</p>
              </div>
            )}

            <div className="space-y-3">
              {privacyConcernCategories.map((category) => {
                const IconComponent = getIconComponent(category.icon);
                const categoryConcernIds = (category.concerns && Array.isArray(category.concerns) ? category.concerns.map(c => c.id) : []);
                const selectedInCategory = categoryConcernIds.filter(id => selectedConcerns.includes(id));
                const allSelected = selectedInCategory.length === categoryConcernIds.length;
                const someSelected = selectedInCategory.length > 0 && selectedInCategory.length < categoryConcernIds.length;
                const isExpanded = expandedCategories[category.id];

                const colorClasses = {
                  blue: {
                    bg: 'bg-blue-50 dark:bg-blue-900/20',
                    border: 'border-blue-200 dark:border-blue-800',
                    accent: 'text-blue-600 dark:text-blue-400',
                    button: allSelected ? 'bg-blue-500 text-white' : someSelected ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300' : 'bg-white dark:bg-slate-700 text-gray-700 dark:text-gray-300'
                  },
                  green: {
                    bg: 'bg-green-50 dark:bg-green-900/20',
                    border: 'border-green-200 dark:border-green-800',
                    accent: 'text-green-600 dark:text-green-400',
                    button: allSelected ? 'bg-green-500 text-white' : someSelected ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300' : 'bg-white dark:bg-slate-700 text-gray-700 dark:text-gray-300'
                  },
                  purple: {
                    bg: 'bg-purple-50 dark:bg-purple-900/20',
                    border: 'border-purple-200 dark:border-purple-800',
                    accent: 'text-purple-600 dark:text-purple-400',
                    button: allSelected ? 'bg-purple-500 text-white' : someSelected ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300' : 'bg-white dark:bg-slate-700 text-gray-700 dark:text-gray-300'
                  }
                };

                const colors = colorClasses[category.color] || colorClasses.blue;

                return (
                  <div key={category.id} className={`border rounded-lg ${colors.border} ${someSelected || allSelected ? colors.bg : 'bg-gray-50 dark:bg-slate-700/50'}`}>
                    <div className="p-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center flex-1">
                          <div className={`w-8 h-8 ${colors.bg} rounded-lg flex items-center justify-center mr-2`}>
                            <IconComponent className={`w-4 h-4 ${colors.accent}`} />
                          </div>
                          <div className="flex-1">
                            <h5 className="text-sm font-semibold text-gray-900 dark:text-white">{category.name}</h5>
                            <p className="text-xs text-gray-600 dark:text-gray-400">{category.description}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {selectedInCategory.length > 0 && (
                            <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
                              {selectedInCategory.length}/{categoryConcernIds.length}
                            </span>
                          )}
                          <button
                            onClick={() => handleCategoryToggle(category.id)}
                            className={`px-3 py-1 rounded text-xs font-medium border transition-all ${colors.button} border-gray-300 dark:border-gray-600`}
                          >
                            {allSelected ? 'Deselect All' : 'Select All'}
                          </button>
                          <button
                            onClick={() => toggleCategoryExpansion(category.id)}
                            className="p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                          >
                            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>
                    </div>

                    {isExpanded && (
                      <div className="px-3 pb-3 border-t border-gray-200 dark:border-gray-600 pt-3">
                        <div className="flex flex-wrap gap-2">
                          {category.concerns && Array.isArray(category.concerns) ? category.concerns.map((concern) => {
                            const isSelected = selectedConcerns.includes(concern.id);
                            return (
                              <button
                                key={concern.id}
                                onClick={() => handleConcernToggle(concern.id)}
                                className={`px-2.5 py-1 rounded-full text-xs font-medium border transition-all ${
                                  isSelected
                                    ? `${colors.button} border-${category.color}-500 shadow-md`
                                    : 'bg-white dark:bg-slate-700 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:border-red-500 dark:hover:border-red-500'
                                }`}
                              >
                                {concern.label}
                              </button>
                            );
                          }) : null}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Enhanced Exposure Recommendations - Show for exposure assessments */}
        {assessmentType === 'exposure' && exposureResults && (
          <div className="mb-6">
            <EnhancedExposureRecommendations 
              exposureResults={exposureResults}
              exposureScore={exposureScore}
            />
          </div>
        )}

        {/* Enhanced Rights Recommendations - Show for rights assessments */}
        {(assessmentType === 'rights' || assessmentType === 'privacy-rights') && rightsResults && (
          <div className="mb-6">
            <EnhancedRightsRecommendations 
              rightsResults={rightsResults}
              rightsScore={rightsScore}
            />
          </div>
        )}

        {/* Personalized Recommendations - Show for other assessment types or as fallback */}
        {assessmentType !== 'exposure' && assessmentType !== 'rights' && assessmentType !== 'privacy-rights' && recommendations.length > 0 && (
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 p-8 mb-6">
            <div className="flex items-center mb-6">
              <Star className="w-6 h-6 text-orange-500 mr-3" />
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Your Personalized Insights</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {recommendations.map((rec, index) => (
                <div key={index} className={`p-6 rounded-xl border ${
                  rec.color === 'red' ? 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800' :
                  rec.color === 'yellow' ? 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800' :
                  rec.color === 'green' ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800' :
                  rec.color === 'blue' ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800' :
                  'bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800'
                }`}>
                  <div className="flex items-start mb-4">
                    <div className={`p-2 rounded-lg mr-3 ${
                      rec.color === 'red' ? 'bg-red-100 dark:bg-red-800' :
                      rec.color === 'yellow' ? 'bg-yellow-100 dark:bg-yellow-800' :
                      rec.color === 'green' ? 'bg-green-100 dark:bg-green-800' :
                      rec.color === 'blue' ? 'bg-blue-100 dark:bg-blue-800' :
                      'bg-purple-100 dark:bg-purple-800'
                    }`}>
                      {(() => {
                        let IconComponent;
                        if (typeof rec.icon === 'string') {
                          IconComponent = getIconComponent(rec.icon);
                        } else if (rec.icon && typeof rec.icon === 'function') {
                          // Handle component reference
                          IconComponent = rec.icon;
                        } else {
                          // Fallback to Shield
                          IconComponent = getIconComponent('Shield');
                        }
                        // Ensure IconComponent is valid before rendering
                        if (!IconComponent) {
                          IconComponent = getIconComponent('Shield');
                        }
                        return <IconComponent className={`w-5 h-5 ${
                          rec.color === 'red' ? 'text-red-600 dark:text-red-300' :
                          rec.color === 'yellow' ? 'text-yellow-600 dark:text-yellow-300' :
                          rec.color === 'green' ? 'text-green-600 dark:text-green-300' :
                          rec.color === 'blue' ? 'text-blue-600 dark:text-blue-300' :
                          'text-purple-600 dark:text-purple-300'
                        }`} />;
                      })()}
                    </div>
                    <div className="flex-1">
                      <h3 className={`font-bold mb-2 ${
                        rec.color === 'red' ? 'text-red-900 dark:text-red-100' :
                        rec.color === 'yellow' ? 'text-yellow-900 dark:text-yellow-100' :
                        rec.color === 'green' ? 'text-green-900 dark:text-green-100' :
                        rec.color === 'blue' ? 'text-blue-900 dark:text-blue-100' :
                        'text-purple-900 dark:text-purple-100'
                      }`}>
                        {rec.title}
                      </h3>
                      <p className={`text-sm mb-4 ${
                        rec.color === 'red' ? 'text-red-800 dark:text-red-200' :
                        rec.color === 'yellow' ? 'text-yellow-800 dark:text-yellow-200' :
                        rec.color === 'green' ? 'text-green-800 dark:text-green-200' :
                        rec.color === 'blue' ? 'text-blue-800 dark:text-blue-200' :
                        'text-purple-800 dark:text-purple-200'
                      }`}>
                        {rec.description}
                      </p>
                      <ul className="space-y-1">
                        {rec.actions && Array.isArray(rec.actions) ? rec.actions.map((action, actionIndex) => (
                          <li key={actionIndex} className={`text-xs flex items-center ${
                            rec.color === 'red' ? 'text-red-700 dark:text-red-300' :
                            rec.color === 'yellow' ? 'text-yellow-700 dark:text-yellow-300' :
                            rec.color === 'green' ? 'text-green-700 dark:text-green-300' :
                            rec.color === 'blue' ? 'text-blue-700 dark:text-blue-300' :
                            'text-purple-700 dark:text-purple-300'
                          }`}>
                            <ArrowRight className="w-3 h-3 mr-1" />
                            {action}
                          </li>
                        )) : null}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Quick Wins */}
        {quickWins.length > 0 && (
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 p-8 mb-6">
            <div className="flex items-center mb-6">
              <Zap className="w-6 h-6 text-green-500 mr-3" />
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Quick Wins</h2>
              <span className="ml-3 px-3 py-1 text-xs bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300 rounded-full">
                Start Here!
              </span>
            </div>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Easy actions you can complete today to immediately improve your privacy:
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {quickWins.map((win, index) => {
                // Handle both string and object formats
                if (typeof win === 'string') {
                  return (
                    <div key={index} className="flex items-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                      <div className="flex-1">
                        <h3 className="font-medium text-green-900 dark:text-green-100 mb-1">
                          {win}
                        </h3>
                      </div>
                      <button className="ml-4 p-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors">
                        <CheckCircle2 className="w-4 h-4" />
                      </button>
                    </div>
                  );
                }
                
                return (
                  <div key={index} className="flex items-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                    <div className="flex-1">
                      {win.title && (
                        <h3 className="font-medium text-green-900 dark:text-green-100 mb-1">
                          {win.title}
                        </h3>
                      )}
                      {win.description && (
                        <p className="text-sm text-green-800 dark:text-green-200 mb-2">
                          {win.description}
                        </p>
                      )}
                      {(win.timeEstimate || win.impact) && (
                        <div className="flex items-center text-xs text-green-600 dark:text-green-400">
                          {win.timeEstimate && (
                            <>
                              <Clock className="w-3 h-3 mr-1" />
                              {win.timeEstimate}
                            </>
                          )}
                          {win.timeEstimate && win.impact && <span className="mx-2">•</span>}
                          {win.impact && (
                            <span className={`px-2 py-1 rounded ${
                              win.impact === 'High' ? 'bg-red-100 text-red-700' :
                              win.impact === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                              'bg-blue-100 text-blue-700'
                            }`}>
                              {win.impact} Impact
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                    <button className="ml-4 p-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors">
                      <CheckCircle2 className="w-4 h-4" />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Detailed Action Plan */}
        {actionPlan && (
          <div className="space-y-6">
            {/* Critical Actions */}
            {actionPlan.critical && Array.isArray(actionPlan.critical) && actionPlan.critical.length > 0 && (
              <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 p-8">
                <div className="flex items-center mb-6">
                  <AlertCircle className="w-6 h-6 text-red-500 mr-3" />
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">Critical Actions</h2>
                  <span className="ml-3 px-3 py-1 text-xs bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300 rounded-full">
                    High Priority
                  </span>
                </div>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  These actions address your highest privacy risks and should be completed within the next week:
                </p>
                
                <div className="space-y-6">
                  {actionPlan.critical && Array.isArray(actionPlan.critical) && actionPlan.critical.map((action, index) => {
                    // Handle both object and string actions
                    if (typeof action === 'string') {
                      return (
                        <div key={index} className="border border-red-200 dark:border-red-800 rounded-lg p-6 bg-red-50 dark:bg-red-900/20">
                          <div className="flex items-start">
                            <div className="p-2 bg-red-100 dark:bg-red-800 rounded-lg mr-4">
                              <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-300" />
                            </div>
                            <div className="flex-1">
                              <h3 className="text-lg font-bold text-red-900 dark:text-red-100 mb-2">
                                {action}
                              </h3>
                            </div>
                          </div>
                        </div>
                      );
                    }
                    
                    const IconComponent = action.icon ? getIconComponent(action.icon) : AlertCircle;
                    return (
                      <div key={index} className="border border-red-200 dark:border-red-800 rounded-lg p-6 bg-red-50 dark:bg-red-900/20">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-start flex-1">
                            <div className="p-2 bg-red-100 dark:bg-red-800 rounded-lg mr-4 flex-shrink-0">
                              <IconComponent className="w-5 h-5 text-red-600 dark:text-red-300" />
                            </div>
                            <div className="flex-1 min-w-0">
                              {action.title && (
                                <h3 className="text-lg font-bold text-red-900 dark:text-red-100 mb-2">
                                  {action.title}
                                </h3>
                              )}
                              {action.description && (
                                <p className="text-red-800 dark:text-red-200 mb-3">
                                  {action.description}
                                </p>
                              )}
                              <div className="flex items-center space-x-4 text-sm text-red-700 dark:text-red-300 mb-4 flex-wrap gap-2">
                                {action.impact && (
                                  <span className="flex items-center">
                                    <Target className="w-4 h-4 mr-1" />
                                    {action.impact}
                                  </span>
                                )}
                                {action.timeEstimate && (
                                  <span className="flex items-center">
                                    <Clock className="w-4 h-4 mr-1" />
                                    {action.timeEstimate}
                                  </span>
                                )}
                                {action.difficulty && (
                                  <span className="px-2 py-1 bg-green-100 text-green-700 dark:bg-green-800 dark:text-green-300 rounded">
                                    {action.difficulty}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      
                        {action.steps && Array.isArray(action.steps) && action.steps.length > 0 && (
                          <div className="bg-white dark:bg-slate-700 rounded-lg p-4">
                            <h4 className="font-medium text-gray-900 dark:text-white mb-3">Step-by-step plan:</h4>
                            <ol className="space-y-2">
                              {action.steps.map((step, stepIndex) => (
                                <li key={stepIndex} className="flex items-start text-sm text-gray-700 dark:text-gray-300">
                                  <span className="flex-shrink-0 w-5 h-5 bg-red-100 dark:bg-red-800 text-red-600 dark:text-red-300 rounded-full flex items-center justify-center mr-3 mt-0.5 text-xs font-bold">
                                    {stepIndex + 1}
                                  </span>
                                  {step}
                                </li>
                              ))}
                            </ol>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Important Actions */}
            {actionPlan.important && Array.isArray(actionPlan.important) && actionPlan.important.length > 0 && (
              <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 p-8">
                <div className="flex items-center mb-6">
                  <Target className="w-6 h-6 text-orange-500 mr-3" />
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">Important Actions</h2>
                  <span className="ml-3 px-3 py-1 text-xs bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300 rounded-full">
                    This Month
                  </span>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {actionPlan.important.map((action, index) => {
                    // Handle both object and string actions
                    if (typeof action === 'string') {
                      return (
                        <div key={index} className="border border-orange-200 dark:border-orange-800 rounded-lg p-6 bg-orange-50 dark:bg-orange-900/20">
                          <div className="flex items-center mb-4">
                            <div className="p-2 bg-orange-100 dark:bg-orange-800 rounded-lg mr-3">
                              <Target className="w-5 h-5 text-orange-600 dark:text-orange-300" />
                            </div>
                            <div className="flex-1">
                              <p className="font-bold text-orange-900 dark:text-orange-100">{action}</p>
                            </div>
                          </div>
                        </div>
                      );
                    }
                    
                    const IconComponent = action.icon ? getIconComponent(action.icon) : Target;
                    return (
                      <div key={index} className="border border-orange-200 dark:border-orange-800 rounded-lg p-6 bg-orange-50 dark:bg-orange-900/20">
                        <div className="flex items-center mb-4">
                          <div className="p-2 bg-orange-100 dark:bg-orange-800 rounded-lg mr-3 flex-shrink-0">
                            <IconComponent className="w-5 h-5 text-orange-600 dark:text-orange-300" />
                          </div>
                          <div className="flex-1 min-w-0">
                            {action.title && (
                              <h3 className="font-bold text-orange-900 dark:text-orange-100">
                                {action.title}
                              </h3>
                            )}
                            {action.timeEstimate && (
                              <div className="flex items-center text-xs text-orange-700 dark:text-orange-300 mt-1">
                                <Clock className="w-3 h-3 mr-1" />
                                {action.timeEstimate}
                              </div>
                            )}
                          </div>
                        </div>
                        {action.description && (
                          <p className="text-sm text-orange-800 dark:text-orange-200 mb-3">
                            {action.description}
                          </p>
                        )}
                        {action.impact && (
                          <div className="text-xs text-orange-600 dark:text-orange-400 font-medium">
                            Impact: {action.impact}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Long-term Actions - Redesigned for Better Visual Engagement */}
            {actionPlan.longTerm && Array.isArray(actionPlan.longTerm) && (
              <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 p-8">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center">
                    <BookOpen className="w-6 h-6 text-blue-500 mr-3" />
                    <div>
                      <h2 className="text-xl font-bold text-gray-900 dark:text-white">Long-term Goals</h2>
                      <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                        Strategic privacy improvements for the next 3 months
                      </p>
                    </div>
                  </div>
                  {actionPlan.longTerm.length > 0 && (
                    <span className="px-3 py-1 text-xs bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300 rounded-full font-medium">
                      {actionPlan.longTerm.length} Goal{actionPlan.longTerm.length !== 1 ? 's' : ''}
                    </span>
                  )}
                </div>
                
                {/* Grid Layout for Better Space Optimization */}
                {actionPlan.longTerm.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {actionPlan.longTerm.map((action, index) => {
                      // Handle both object and string actions
                      if (typeof action === 'string') {
                        return (
                          <div key={index} className="group relative border border-blue-200 dark:border-blue-800 rounded-xl p-5 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 hover:shadow-lg transition-all duration-300">
                            <div className="flex items-start gap-4">
                              <div className="flex-shrink-0 w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                                <BookOpen className="w-6 h-6 text-white" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-2">
                                  <span className="text-xs font-bold text-blue-600 dark:text-blue-400 bg-white dark:bg-slate-800 px-2 py-0.5 rounded">
                                    Goal {index + 1}
                                  </span>
                                </div>
                                <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2 leading-tight">
                                  {action}
                                </h3>
                              </div>
                            </div>
                          </div>
                        );
                      }
                      
                      // Handle object actions with enhanced design
                      const IconComponent = action.icon ? getIconComponent(action.icon) : BookOpen;
                      return (
                        <div key={index} className="group relative border border-blue-200 dark:border-blue-800 rounded-xl p-5 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 hover:shadow-xl hover:border-blue-300 dark:hover:border-blue-700 transition-all duration-300">
                          {/* Goal Number Badge */}
                          <div className="absolute -top-3 -right-3 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold shadow-lg z-10">
                            {index + 1}
                          </div>
                          
                          <div className="flex items-start gap-4 mb-4">
                            <div className="flex-shrink-0 w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                              <IconComponent className="w-6 h-6 text-white" />
                            </div>
                            <div className="flex-1 min-w-0">
                              {action.title && (
                                <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2 leading-tight text-base">
                                  {action.title}
                                </h3>
                              )}
                              {action.description && (
                                <p className="text-sm text-blue-800 dark:text-blue-200 leading-relaxed">
                                  {action.description}
                                </p>
                              )}
                            </div>
                          </div>
                          
                          {/* Metadata Row - Compact and Organized */}
                          <div className="flex flex-wrap items-center gap-3 mb-3 pt-3 border-t border-blue-200 dark:border-blue-700">
                            {action.timeEstimate && (
                              <div className="flex items-center gap-1.5 text-xs text-blue-700 dark:text-blue-300">
                                <Clock className="w-3.5 h-3.5" />
                                <span className="font-medium">{action.timeEstimate}</span>
                              </div>
                            )}
                            {action.difficulty && (
                              <div className={`px-2 py-1 rounded text-xs font-medium ${
                                action.difficulty === 'Easy' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300' :
                                action.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300' :
                                'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300'
                              }`}>
                                {action.difficulty}
                              </div>
                            )}
                            {action.category && (
                              <div className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded text-xs font-medium">
                                {action.category.replace('-', ' ')}
                              </div>
                            )}
                          </div>
                          
                          {/* Expandable Steps with Better Styling */}
                          {action.steps && Array.isArray(action.steps) && action.steps.length > 0 && (
                            <details className="mt-3">
                              <summary className="cursor-pointer text-sm font-medium text-blue-700 dark:text-blue-300 hover:text-blue-900 dark:hover:text-blue-100 flex items-center gap-2 select-none">
                                <ChevronDown className="w-4 h-4 transition-transform details-open:rotate-180" />
                                <span>View {action.steps.length} step{action.steps.length !== 1 ? 's' : ''}</span>
                              </summary>
                              <ol className="mt-3 ml-6 space-y-2 text-sm text-blue-800 dark:text-blue-200">
                                {action.steps.map((step, stepIndex) => (
                                  <li key={stepIndex} className="flex items-start gap-2">
                                    <span className="flex-shrink-0 w-5 h-5 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold mt-0.5">
                                      {stepIndex + 1}
                                    </span>
                                    <span className="flex-1 leading-relaxed">{step}</span>
                                  </li>
                                ))}
                              </ol>
                            </details>
                          )}
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  /* Empty State - Enhanced */
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                      <BookOpen className="w-8 h-8 text-blue-500 dark:text-blue-400 opacity-50" />
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 font-medium mb-2">
                      No long-term goals generated
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-500">
                      Complete more assessments to get personalized long-term recommendations.
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Service Catalog Prompt */}
        <div className="mb-8">
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl shadow-sm border-2 border-blue-200 dark:border-blue-800 p-6">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                  <Shield className="w-6 h-6 text-white" />
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                  Track Your Services for Complete Privacy Analysis
                </h3>
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  Add services you use to your Services Monitoring to get a personalized Digital Privacy Footprint Analysis that combines your assessment results with service-specific exposure indices.
                </p>
                <button
                  onClick={() => navigate('/service-catalog')}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center gap-2"
                >
                  <Shield className="w-5 h-5" />
                  Go to Services Monitoring
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Contextual Next Steps */}
        <div className="mb-8">
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 p-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              Your Next Steps
            </h2>
            <ContextualLinks 
              currentPage="assessment-results"
              userPersona={detectedPersona}
              assessmentResults={{ exposureScore, rightsScore }}
              showAsCards={true}
              maxLinks={3}
            />
          </div>
        </div>

        {/* Related Content for Persona */}
        {detectedPersona && (
          <div className="mb-8">
            <RelatedContent
              userPersona={detectedPersona}
              currentPage="assessment-results"
              assessmentResults={{ exposureScore, rightsScore }}
              title="Recommended Based on Your Results"
            />
          </div>
        )}

        {/* Next Steps */}
        <div className="text-center mt-8">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
            {t('assessmentsPage.nextStepsTitle')}
          </h3>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button
              type="button"
              onClick={() => navigate('/')}
              className="px-6 py-3 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-bold rounded-xl hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors flex items-center"
            >
              Back to Home
            </button>
            <button
              type="button"
              onClick={() => navigate(`/assessment/${assessmentType}`)}
              className="px-6 py-3 border-2 border-red-500 text-red-500 font-bold rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors flex items-center"
            >
              Retake Assessment
            </button>
            <button
              type="button"
              onClick={handleCompleteSetup}
              disabled={selectedConcerns.length === 0}
              title={t('assessmentsPage.nextStepDashboard')}
              className={`px-8 py-4 text-lg font-bold rounded-xl transition-colors flex items-center ${
                selectedConcerns.length === 0
                  ? 'bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                  : 'bg-red-500 text-white hover:bg-red-600'
              }`}
            >
              Continue to Your Dashboard
              <ChevronRight className="w-5 h-5 ml-2" />
            </button>
          </div>
          <p className="text-gray-600 dark:text-gray-300 mt-4 text-sm max-w-md mx-auto">
            {t('assessmentsPage.nextStepDashboard')} {t('assessmentsPage.viewYourDashboardDesc')}
          </p>
        </div>

        {/* Post-Assessment Feedback Modal */}
        <PostAssessmentFeedbackModal
          assessmentType={assessmentType}
          isOpen={showFeedbackModal}
          onClose={() => setShowFeedbackModal(false)}
          assessmentResults={{
            exposureScore,
            rightsScore,
            persona: detectedPersona?.primary
          }}
        />
      </div>
    </div>
  );
};

export default AssessmentResults;