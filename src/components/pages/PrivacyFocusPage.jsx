import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Target, CheckCircle, Save, AlertCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { getIconComponent } from '../../utils/iconMapping.js';
import SEOHead from '../common/SEOHead';
import PageHeader from '../common/PageHeader';
import { privacyConcernCategories, getConcernLabel } from '../../data/privacyConcerns';
import { getConcernsFromStorage, saveConcernsToStorage } from '../../utils/concernHelpers';
import { useTranslation } from '../../contexts/TranslationContext';

const PrivacyFocusPage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [selectedConcerns, setSelectedConcerns] = useState([]);
  const [expandedCategories, setExpandedCategories] = useState({});
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [validationError, setValidationError] = useState('');

  useEffect(() => {
    const concerns = getConcernsFromStorage();
    if (concerns.length > 0) {
      setSelectedConcerns(concerns);
    }
  }, []);

  const handleCategoryToggle = (categoryId) => {
    const category = privacyConcernCategories.find((c) => c.id === categoryId);
    if (!category) return;
    const categoryConcernIds = category.concerns.map((c) => c.id);
    const allCategoryConcernsSelected = categoryConcernIds.every((id) => selectedConcerns.includes(id));
    setSelectedConcerns((prev) => {
      if (allCategoryConcernsSelected) {
        return prev.filter((c) => !categoryConcernIds.includes(c));
      }
      const newConcerns = [...prev];
      categoryConcernIds.forEach((id) => {
        if (!newConcerns.includes(id)) newConcerns.push(id);
      });
      return newConcerns;
    });
    setValidationError('');
  };

  const handleConcernToggle = (concernId) => {
    setSelectedConcerns((prev) => {
      if (prev.includes(concernId)) {
        const newConcerns = prev.filter((c) => c !== concernId);
        if (newConcerns.length === 0) return prev;
        return newConcerns;
      }
      return [...prev, concernId];
    });
    setValidationError('');
  };

  const toggleCategoryExpansion = (categoryId) => {
    setExpandedCategories((prev) => ({ ...prev, [categoryId]: !prev[categoryId] }));
  };

  const handleSave = () => {
    if (selectedConcerns.length === 0) {
      setValidationError(t('privacySettingsPage.validationError'));
      return;
    }
    setValidationError('');
    setSaving(true);
    saveConcernsToStorage(selectedConcerns);
    setTimeout(() => {
      setSaving(false);
      setSaved(true);
      setTimeout(() => {
        setSaved(false);
        navigate('/dashboard');
      }, 1500);
    }, 500);
  };

  const categoryIconMap = { family: 'Users', financial: 'Shield', work: 'Briefcase', social: 'Camera' };
  const categoryColorMap = { family: 'blue', financial: 'green', work: 'indigo', social: 'purple' };

  const colorClasses = {
    blue: {
      bg: 'bg-blue-50 dark:bg-blue-900/20',
      border: 'border-blue-200 dark:border-blue-800',
      accent: 'text-blue-600 dark:text-blue-400',
      button: (all, some) =>
        all ? 'bg-blue-500 text-white' : some ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300' : 'bg-white dark:bg-slate-700 text-gray-700 dark:text-gray-300',
    },
    green: {
      bg: 'bg-green-50 dark:bg-green-900/20',
      border: 'border-green-200 dark:border-green-800',
      accent: 'text-green-600 dark:text-green-400',
      button: (all, some) =>
        all ? 'bg-green-500 text-white' : some ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300' : 'bg-white dark:bg-slate-700 text-gray-700 dark:text-gray-300',
    },
    indigo: {
      bg: 'bg-indigo-50 dark:bg-indigo-900/20',
      border: 'border-indigo-200 dark:border-indigo-800',
      accent: 'text-indigo-600 dark:text-indigo-400',
      button: (all, some) =>
        all ? 'bg-indigo-500 text-white' : some ? 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300' : 'bg-white dark:bg-slate-700 text-gray-700 dark:text-gray-300',
    },
    purple: {
      bg: 'bg-purple-50 dark:bg-purple-900/20',
      border: 'border-purple-200 dark:border-purple-800',
      accent: 'text-purple-600 dark:text-purple-400',
      button: (all, some) =>
        all ? 'bg-purple-500 text-white' : some ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300' : 'bg-white dark:bg-slate-700 text-gray-700 dark:text-gray-300',
    },
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900" data-testid="privacy-focus">
      <SEOHead
        title={`${t('privacySettingsPage.privacyConcerns')} | SocialCaution`}
        description={t('privacySettingsPage.concernsInstruction')}
        keywords="privacy focus, privacy concerns, personalization"
      />
      <PageHeader
        title={t('privacySettingsPage.privacyConcerns')}
        subtitle={t('privacySettingsPage.concernsInstruction')}
        icon={Target}
        iconGradient="indigo"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 p-6 sm:p-8">
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-6">
            {t('privacySettingsPage.concernsUsage')}
          </p>

          {validationError && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-start">
              <AlertCircle className="w-5 h-5 text-red-500 mr-3 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-700 dark:text-red-300">{validationError}</p>
            </div>
          )}

          <div className="space-y-4">
            {privacyConcernCategories.map((category) => {
              const iconName = categoryIconMap[category.id] || 'Users';
              const IconComponent = getIconComponent(iconName);
              const categoryColor = categoryColorMap[category.id] || 'blue';
              const categoryConcernIds = category.concerns.map((c) => c.id);
              const selectedInCategory = categoryConcernIds.filter((id) => selectedConcerns.includes(id));
              const allSelected = selectedInCategory.length === categoryConcernIds.length;
              const someSelected =
                selectedInCategory.length > 0 && selectedInCategory.length < categoryConcernIds.length;
              const isExpanded = expandedCategories[category.id];
              const colors = colorClasses[categoryColor] || colorClasses.blue;
              const buttonClass = typeof colors.button === 'function' ? colors.button(allSelected, someSelected) : colors.button;

              return (
                <div
                  key={category.id}
                  className={`border rounded-xl ${colors.border} ${someSelected || allSelected ? colors.bg : 'bg-gray-50 dark:bg-slate-700/50'}`}
                >
                  <div className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center flex-1">
                        <div
                          className={`w-10 h-10 ${colors.bg} rounded-lg flex items-center justify-center mr-3`}
                        >
                          <IconComponent className={`w-5 h-5 ${colors.accent}`} />
                        </div>
                        <h3 className="font-semibold text-gray-900 dark:text-white">{category.label}</h3>
                      </div>
                      <div className="flex items-center gap-2">
                        {selectedInCategory.length > 0 && (
                          <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
                            {selectedInCategory.length}/{categoryConcernIds.length} selected
                          </span>
                        )}
                        <button
                          type="button"
                          onClick={() => handleCategoryToggle(category.id)}
                          className={`px-4 py-2 rounded-lg text-sm font-medium border transition-all ${buttonClass} border-gray-300 dark:border-gray-600`}
                        >
                          {allSelected ? 'Deselect All' : 'Select All'}
                        </button>
                        <button
                          type="button"
                          onClick={() => toggleCategoryExpansion(category.id)}
                          className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                        >
                          {isExpanded ? (
                            <ChevronUp className="w-5 h-5" />
                          ) : (
                            <ChevronDown className="w-5 h-5" />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                  {isExpanded && (
                    <div className="px-4 pb-4 border-t border-gray-200 dark:border-gray-600 pt-4">
                      <div className="flex flex-wrap gap-2">
                        {category.concerns.map((concern) => {
                          const isSelected = selectedConcerns.includes(concern.id);
                          return (
                            <button
                              key={concern.id}
                              type="button"
                              onClick={() => handleConcernToggle(concern.id)}
                              className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-all ${
                                isSelected
                                  ? `${buttonClass} shadow-md`
                                  : 'bg-white dark:bg-slate-700 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:border-indigo-500 dark:hover:border-indigo-500'
                              }`}
                            >
                              {t(`privacyConcernCategories.${category.id}.concerns.${concern.id}`) ||
                                concern.label}
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

          {selectedConcerns.length > 0 && (
            <div className="mt-6 p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg border border-indigo-200 dark:border-indigo-800">
              <p className="text-sm font-medium text-indigo-900 dark:text-indigo-100 mb-2">
                {t('privacySettingsPage.selectedConcerns', { count: selectedConcerns.length })}
              </p>
              <div className="flex flex-wrap gap-2">
                {selectedConcerns.map((concernId) => {
                  const category = privacyConcernCategories.find((cat) =>
                    cat.concerns.some((c) => c.id === concernId)
                  );
                  return (
                    <span
                      key={concernId}
                      className="px-3 py-1 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 rounded-full text-xs font-medium"
                    >
                      {category
                        ? t(`privacyConcernCategories.${category.id}.concerns.${concernId}`) || getConcernLabel(concernId)
                        : getConcernLabel(concernId)}
                    </span>
                  );
                })}
              </div>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-4 justify-end mt-8">
            <button
              type="button"
              onClick={() => navigate('/dashboard')}
              className="px-6 py-3 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={selectedConcerns.length === 0 || saving || saved}
              className={`px-8 py-3 rounded-xl font-semibold text-lg transition-all flex items-center justify-center gap-2 ${
                selectedConcerns.length === 0 || saving || saved
                  ? 'bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'
                  : 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700 shadow-lg hover:shadow-xl'
              }`}
            >
              {saving ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
                  {t('privacySettingsPage.saving')}
                </>
              ) : saved ? (
                <>
                  <CheckCircle className="h-5 w-5" />
                  {t('privacySettingsPage.saved')}
                </>
              ) : (
                <>
                  <Save className="h-5 w-5" />
                  {t('privacySettingsPage.saveChanges')}
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyFocusPage;
