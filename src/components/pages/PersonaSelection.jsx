import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, Users, Target, Clock, Lightbulb, ArrowRight, Shield, AlertCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { privacyConcernCategories, migrateConcerns, getConcernLabel } from '../../data/privacyConcerns';
import { getIconComponent } from '../../utils/iconMapping.js';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import SEOHead from '../common/SEOHead';
import { useTranslation } from '../../contexts/TranslationContext';
import EmailCaptureModal from '../lead/EmailCaptureModal';

const PersonaSelection = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [personaFromStorage, setPersonaFromStorage] = useLocalStorage('socialcaution_persona', null);
  const [selectedConcerns, setSelectedConcerns] = useState([]);
  const [expandedCategories, setExpandedCategories] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [showEmailCapture, setShowEmailCapture] = useState(false);
  const [validationError, setValidationError] = useState('');

  useEffect(() => {
    // Load current concerns if they exist
    if (personaFromStorage?.customConcerns && personaFromStorage.customConcerns.length > 0) {
      const migratedConcerns = migrateConcerns(personaFromStorage.customConcerns);
      setSelectedConcerns(migratedConcerns);
    } else if (personaFromStorage?.primary) {
      // If old persona exists, migrate to concerns (select first concern from first category as default)
      if (privacyConcernCategories.length > 0 && privacyConcernCategories[0].concerns.length > 0) {
        setSelectedConcerns([privacyConcernCategories[0].concerns[0].id]);
      }
    }
  }, [personaFromStorage]);

  const handleCategoryToggle = (categoryId) => {
    const category = privacyConcernCategories.find(c => c.id === categoryId);
    if (!category) return;

    const categoryConcernIds = category.concerns.map(c => c.id);
    const allCategoryConcernsSelected = categoryConcernIds.every(id => selectedConcerns.includes(id));

    setSelectedConcerns(prev => {
      if (allCategoryConcernsSelected) {
        // Deselect all concerns in this category
        const newConcerns = prev.filter(c => !categoryConcernIds.includes(c));
        // Ensure at least one concern is selected
        if (newConcerns.length === 0 && privacyConcernCategories.length > 0) {
          // Keep at least one concern from another category if available
          const otherCategory = privacyConcernCategories.find(cat => cat.id !== categoryId);
          if (otherCategory && otherCategory.concerns.length > 0) {
            return [otherCategory.concerns[0].id];
          }
          return prev; // Don't allow removing the last concern
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
          return prev; // Don't allow removing the last concern
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

  const handleContinue = () => {
    if (selectedConcerns.length === 0) {
      setValidationError('Please select at least one privacy concern');
      return;
    }

    setSubmitting(true);
    setValidationError('');
    
    // Save concerns to localStorage (using persona structure for compatibility)
    const personaData = {
      primary: 'custom', // Use 'custom' to indicate concerns-based selection
      confidence: 1.0,
      customConcerns: selectedConcerns,
      selectedAt: new Date().toISOString()
    };
    
    setPersonaFromStorage(personaData);
    
    // Show email capture modal for lead generation
    setShowEmailCapture(true);
    setSubmitting(false);
  };

  const handleEmailCaptureClose = () => {
    setShowEmailCapture(false);
    // Navigate after email capture is closed
    navigate('/service-catalog');
  };

  const handleSkip = () => {
    navigate('/service-catalog');
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
      {/* Email Capture Modal */}
      {showEmailCapture && selectedConcerns.length > 0 && (
        <EmailCaptureModal
          isOpen={showEmailCapture}
          onClose={handleEmailCaptureClose}
          context="concerns"
          offer={`Get personalized privacy tips based on your selected concerns`}
        />
      )}
      <SEOHead
        title="Privacy Concerns | SocialCaution"
        description="Set your privacy concerns to receive personalized recommendations and guidance tailored to your priorities."
        keywords="privacy concerns, privacy priorities, personalized privacy, tailored recommendations"
      />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 sm:pt-16 pb-12 sm:pb-16">
        {/* Hero Section */}
        <div className="text-center mb-8 sm:mb-12">
          <div className="inline-flex items-center justify-center gap-2 mb-3 sm:mb-4">
            <div className="p-2 bg-gradient-to-br from-red-500 to-red-600 rounded-lg shadow-md">
              <Target className="w-6 h-6 text-white" />
            </div>
            <h1 className="page-title">
              Privacy Concerns
            </h1>
          </div>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 max-w-xl mx-auto mb-3">
            Everyone's privacy needs are different. Set your privacy concerns to enable personalized guidance, or explore our tools freely. Personalization is optional but recommended for a tailored experience.
          </p>
          {selectedConcerns.length > 0 && (
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 rounded-full">
              <CheckCircle className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400" />
              <span className="text-xs font-medium text-indigo-700 dark:text-indigo-300">
                {selectedConcerns.length} concern{selectedConcerns.length !== 1 ? 's' : ''} selected
              </span>
            </div>
          )}
        </div>

        {/* Why This Matters Section */}
        <div className="bg-gradient-to-r from-blue-50 to-green-50 dark:from-blue-900/20 dark:to-green-900/20 rounded-2xl p-8 mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6 text-center">
            What You'll Get with Privacy Concerns
          </h2>
          <p className="text-center text-gray-600 dark:text-gray-300 mb-6">
            Personalization enhances your experience, but it's completely optional. You can use all core features without setting your concerns.
          </p>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-3">
                <Target className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 sm:mb-3">{t('personaSelection.whyMatters.personalized.title')}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">{t('personaSelection.whyMatters.personalized.description')}</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-3">
                <Clock className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 sm:mb-3">{t('personaSelection.whyMatters.saveTime.title')}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">{t('personaSelection.whyMatters.saveTime.description')}</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-3">
                <Lightbulb className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 sm:mb-3">{t('personaSelection.whyMatters.relevantLearning.title')}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">{t('personaSelection.whyMatters.relevantLearning.description')}</p>
            </div>
          </div>
        </div>

        {/* Validation Error */}
        {validationError && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-start">
            <AlertCircle className="w-5 h-5 text-red-500 mr-3 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-700 dark:text-red-300">{validationError}</p>
          </div>
        )}

        {/* Privacy Concerns Categories */}
        <div className="space-y-4 mb-8">
          {privacyConcernCategories.map((category) => {
            // Map category IDs to icons and colors
            const categoryIconMap = {
              'family': 'Users',
              'financial': 'Shield',
              'work': 'Briefcase',
              'social': 'Camera'
            };
            const categoryColorMap = {
              'family': 'blue',
              'financial': 'green',
              'work': 'orange',
              'social': 'purple'
            };
            const iconName = categoryIconMap[category.id] || 'Users';
            const IconComponent = getIconComponent(iconName);
            const categoryColor = categoryColorMap[category.id] || 'blue';
            const categoryConcernIds = category.concerns.map(c => c.id);
            const selectedInCategory = categoryConcernIds.filter(id => selectedConcerns.includes(id));
            const allSelected = selectedInCategory.length === categoryConcernIds.length;
            const someSelected = selectedInCategory.length > 0 && selectedInCategory.length < categoryConcernIds.length;
            const isExpanded = expandedCategories[category.id];

            const colorClasses = {
              blue: {
                bg: 'bg-blue-50 dark:bg-blue-900/20',
                border: 'border-blue-200 dark:border-blue-800',
                text: 'text-blue-900 dark:text-blue-100',
                accent: 'text-blue-600 dark:text-blue-400',
                button: allSelected ? 'bg-blue-500 text-white' : someSelected ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300' : 'bg-white dark:bg-slate-700 text-gray-700 dark:text-gray-300'
              },
              green: {
                bg: 'bg-green-50 dark:bg-green-900/20',
                border: 'border-green-200 dark:border-green-800',
                text: 'text-green-900 dark:text-green-100',
                accent: 'text-green-600 dark:text-green-400',
                button: allSelected ? 'bg-green-500 text-white' : someSelected ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300' : 'bg-white dark:bg-slate-700 text-gray-700 dark:text-gray-300'
              },
              orange: {
                bg: 'bg-orange-50 dark:bg-orange-900/20',
                border: 'border-orange-200 dark:border-orange-800',
                text: 'text-orange-900 dark:text-orange-100',
                accent: 'text-orange-600 dark:text-orange-400',
                button: allSelected ? 'bg-orange-500 text-white' : someSelected ? 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300' : 'bg-white dark:bg-slate-700 text-gray-700 dark:text-gray-300'
              },
              purple: {
                bg: 'bg-purple-50 dark:bg-purple-900/20',
                border: 'border-purple-200 dark:border-purple-800',
                text: 'text-purple-900 dark:text-purple-100',
                accent: 'text-purple-600 dark:text-purple-400',
                button: allSelected ? 'bg-purple-500 text-white' : someSelected ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300' : 'bg-white dark:bg-slate-700 text-gray-700 dark:text-gray-300'
              }
            };

            const colors = colorClasses[categoryColor] || colorClasses.blue;

            return (
              <div key={category.id} className={`border rounded-xl ${colors.border} ${someSelected || allSelected ? colors.bg : 'bg-white dark:bg-slate-800'}`}>
                {/* Category Header */}
                <div className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center flex-1">
                      <div className={`w-10 h-10 ${colors.bg} rounded-lg flex items-center justify-center mr-3`}>
                        <IconComponent className={`w-5 h-5 ${colors.accent}`} />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 dark:text-white text-lg">
                          {category.label}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                          {(() => {
                            // Map category IDs to translation keys
                            const categoryKeyMap = {
                              'family': 'family-children',
                              'financial': 'financial-identity',
                              'work': 'work-professional',
                              'social': 'social-reputation'
                            };
                            const translationKey = categoryKeyMap[category.id] || category.id;
                            return t(`privacyConcernCategories.${translationKey}.description`, { defaultValue: category.label });
                          })()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {selectedInCategory.length > 0 && (
                        <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
                          {selectedInCategory.length}/{categoryConcernIds.length} selected
                        </span>
                      )}
                      <button
                        onClick={() => handleCategoryToggle(category.id)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium border transition-all ${colors.button} border-gray-300 dark:border-gray-600`}
                      >
                        {allSelected ? 'Deselect All' : 'Select All'}
                      </button>
                      <button
                        onClick={() => toggleCategoryExpansion(category.id)}
                        className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                      >
                        {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Category Concerns (Expandable) */}
                {isExpanded && (
                  <div className="px-4 pb-4 border-t border-gray-200 dark:border-gray-600 pt-4">
                    <div className="flex flex-wrap gap-2">
                      {category.concerns.map((concern) => {
                        const isSelected = selectedConcerns.includes(concern.id);
                        return (
                          <button
                            key={concern.id}
                            onClick={() => handleConcernToggle(concern.id)}
                            className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-all ${
                              isSelected
                                ? `${colors.button} border-${categoryColor}-500 shadow-md`
                                : 'bg-white dark:bg-slate-700 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:border-indigo-500 dark:hover:border-indigo-500'
                            }`}
                          >
                            {(() => {
                              // Map category IDs to translation keys
                              const categoryKeyMap = {
                                'family': 'family-children',
                                'financial': 'financial-identity',
                                'work': 'work-professional',
                                'social': 'social-reputation'
                              };
                              const translationKey = categoryKeyMap[category.id] || category.id;
                              return t(`privacyConcernCategories.${translationKey}.concerns.${concern.id}`, { defaultValue: concern.label });
                            })()}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Selected Concerns Preview */}
        {selectedConcerns.length > 0 && (
          <div className="bg-gradient-to-br from-white to-indigo-50/30 dark:from-slate-800 dark:to-indigo-900/20 rounded-xl shadow-lg p-8 mb-8 border border-indigo-100 dark:border-indigo-900/50">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Your Selected Privacy Concerns
              </h2>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-3">Selected Concerns ({selectedConcerns.length})</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedConcerns.map(concernId => {
                    const category = privacyConcernCategories.find(cat => 
                      cat.concerns.some(c => c.id === concernId)
                    );
                    return (
                      <span
                        key={concernId}
                        className="px-3 py-1 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 rounded-full text-xs font-medium"
                      >
                        {(() => {
                          if (!category) return getConcernLabel(concernId);
                          // Map category IDs to translation keys
                          const categoryKeyMap = {
                            'family': 'family-children',
                            'financial': 'financial-identity',
                            'work': 'work-professional',
                            'social': 'social-reputation'
                          };
                          const translationKey = categoryKeyMap[category.id] || category.id;
                          return t(`privacyConcernCategories.${translationKey}.concerns.${concernId}`, { defaultValue: getConcernLabel(concernId) });
                        })()}
                      </span>
                    );
                  })}
                </div>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-3">{t('personaSelection.preview.whatYoullGet')}</h4>
                <ul className="space-y-2">
                  <li className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                    <ArrowRight className="w-4 h-4 text-indigo-500 mr-2 flex-shrink-0" />
                    {t('personaSelection.preview.personalizedDashboard')}
                  </li>
                  <li className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                    <ArrowRight className="w-4 h-4 text-indigo-500 mr-2 flex-shrink-0" />
                    {t('personaSelection.preview.relevantResources')}
                  </li>
                  <li className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                    <ArrowRight className="w-4 h-4 text-indigo-500 mr-2 flex-shrink-0" />
                    {t('personaSelection.preview.targetedTools')}
                  </li>
                  <li className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                    <ArrowRight className="w-4 h-4 text-indigo-500 mr-2 flex-shrink-0" />
                    {t('personaSelection.preview.customizedPlans')}
                  </li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={handleContinue}
            disabled={selectedConcerns.length === 0 || submitting}
            className={`px-8 py-4 rounded-xl font-semibold text-lg transition-all flex items-center justify-center gap-2 ${
              selectedConcerns.length === 0 || submitting
                ? 'bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'
                : 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700 shadow-lg hover:shadow-xl transform hover:scale-105'
            }`}
          >
            {submitting ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                {t('personaSelection.actions.settingUp')}
              </>
            ) : (
              <>
                {selectedConcerns.length > 0 ? 'Continue to Dashboard' : 'Select at least one concern'}
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
          
          <button
            onClick={handleSkip}
            disabled={submitting}
            className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors font-medium text-sm flex items-center justify-center gap-2"
          >
            Skip & Browse
          </button>
        </div>

        {/* Help Text */}
        <div className="text-center mt-8">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {t('personaSelection.helpText')}
          </p>
        </div>
      </div>
    </div>
  );
};

export default PersonaSelection;

