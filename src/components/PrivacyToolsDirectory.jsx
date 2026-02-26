import React from 'react';
import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Globe, Shield, Activity, AlertTriangle, CheckCircle, ExternalLink, Zap, Star, ArrowRight, Home, BookOpen, X, ChevronUp, ChevronDown, Wrench } from 'lucide-react';
import { externalTools, getExternalToolsByCategory, getExternalToolsByService } from '../data/tools.js';
import { allResources, getResourcesByPersona, getResourcesByService } from '../data/resources.js';
import { getIconComponent } from '../utils/iconMapping.js';
import { PersonaProfiles, PersonaColors } from '../data/personaProfiles';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { analytics } from '../utils/analytics.js';
import { useTranslation } from '../contexts/TranslationContext';
import EnhancedBreadcrumbs from './common/EnhancedBreadcrumbs';
import EmptyState from './common/EmptyState';

const PrivacyToolsDirectory = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [tools, setTools] = useState([]);
  const [resources, setResources] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [activeTab, setActiveTab] = useState('tools'); // 'tools' or 'resources'
  const [selectedResource, setSelectedResource] = useState(null);
  const [expandedSections, setExpandedSections] = useState(new Set());
  
  // Get selected services from Service Privacy Catalog
  const [selectedServices] = useLocalStorage('socialcaution_services', []);
  const [concernsFromStorage] = useLocalStorage('socialcaution_persona', null);
  const [assessmentResultsFromStorage] = useLocalStorage('socialcaution_results', null);
  
  const activeConcerns = concernsFromStorage;
  const activeAssessmentResults = assessmentResultsFromStorage;
  
  // Get external tools based on selected services
  const serviceBasedTools = getExternalToolsByService(selectedServices);
  
  // Get resources based on concerns and services
  useEffect(() => {
    try {
      const generateResources = () => {
        // Support both old concerns format and new concerns format
        const concerns = activeConcerns?.customConcerns || 
                        (activeConcerns?.primary ? [activeConcerns.primary] : []);
        
        if (concerns.length > 0 && activeConcerns?.primary) {
          // Legacy support: if primary concern exists, use it for resource filtering
          const profile = PersonaProfiles[activeConcerns.primary];
          if (!profile) {
            return allResources.sort((a, b) => b.relevanceScore - a.relevanceScore);
          }
          const riskLevel = activeAssessmentResults?.exposureScore < 40 ? 'high' : 
                           activeAssessmentResults?.exposureScore < 70 ? 'moderate' : 'low';
          return getResourcesByPersona(activeConcerns.primary, riskLevel);
        } else {
          return allResources.sort((a, b) => b.relevanceScore - a.relevanceScore);
        }
      };
      const resourceList = generateResources();
      setResources(resourceList);
    } catch (error) {
      console.warn('Error generating resources:', error);
      setResources(allResources.sort((a, b) => b.relevanceScore - a.relevanceScore));
    }
  }, [activeConcerns, activeAssessmentResults]);
  
  const serviceBasedResources = useMemo(() => {
    try {
      return getResourcesByService(selectedServices || []);
    } catch (error) {
      return [];
    }
  }, [selectedServices]);

  useEffect(() => {
    // Show all external tools, sorted by relevance
    const toolList = selectedCategory === 'all' 
      ? externalTools.sort((a, b) => b.relevanceScore - a.relevanceScore)
      : getExternalToolsByCategory(selectedCategory);
    setTools(toolList);
  }, [selectedCategory]);

  const getToolTypeIcon = (type) => {
    switch (type) {
      case 'web-tool': return Zap;
      case 'browser-extension': return Activity;
      case 'software-suite': return Shield;
      case 'service': return Star;
      default: return CheckCircle;
    }
  };

  const handleToolUse = (tool) => {
    try {
      if (analytics && typeof analytics.trackToolUsage === 'function') {
        analytics.trackToolUsage(tool.name, null);
      }
      if (analytics && typeof analytics.trackFeatureUsage === 'function') {
        analytics.trackFeatureUsage('external_tool_usage', {
          tool_id: tool.id,
          tool_type: tool.type,
          tool_url: tool.url,
          context: 'privacy-tools-directory'
        });
      }
    } catch (error) {
      console.warn('Analytics tracking failed:', error);
    }
    
    // External tools: open in new tab
    if (tool.url && tool.url.startsWith('http')) {
      try {
        const newWindow = window.open(tool.url, '_blank', 'noopener,noreferrer');
        if (!newWindow) {
          console.warn('Popup blocked or failed to open external tool');
        }
      } catch (error) {
        console.error('Error opening external tool:', error);
      }
    }
  };

  const categories = [
    { value: 'all', labelKey: 'privacyToolsDirectory.categories.all' },
    { value: 'security', labelKey: 'privacyToolsDirectory.categories.security' },
    { value: 'privacy', labelKey: 'privacyToolsDirectory.categories.privacy' },
    { value: 'family', labelKey: 'privacyToolsDirectory.categories.family' },
    { value: 'social-media', labelKey: 'privacyToolsDirectory.categories.social-media' },
    { value: 'shopping', labelKey: 'privacyToolsDirectory.categories.shopping' },
    { value: 'cleanup', labelKey: 'privacyToolsDirectory.categories.cleanup' },
    { value: 'advanced-privacy', labelKey: 'privacyToolsDirectory.categories.advanced-privacy' },
    { value: 'legal', labelKey: 'privacyToolsDirectory.categories.legal' },
    { value: 'reputation', labelKey: 'privacyToolsDirectory.categories.reputation' }
  ];

  const filteredTools = tools;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
      {/* Hero Section */}
      <section className="pt-8 sm:pt-12 pb-8 sm:pb-12 bg-gradient-to-br from-gray-50 via-red-50/30 to-gray-50 dark:from-slate-900 dark:via-red-950/20 dark:to-slate-900">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Wrench className="w-8 h-8 text-red-600 dark:text-red-400" />
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">
                {t('privacyToolsDirectory.title')}
              </h1>
            </div>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-6">
              {t('privacyToolsDirectory.subtitle')}
            </p>
            
            {/* Action Button */}
            <div className="flex justify-center mb-6">
              <button
                type="button"
                onClick={() => navigate('/toolkit-access')}
                className="px-6 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors font-medium flex items-center gap-2"
              >
                {t('privacyToolsDirectory.viewSocialCautionTools')}
                <Home className="w-5 h-5" />
              </button>
            </div>
            
            {/* Tabs */}
            <div className="flex justify-center gap-2 border-b border-gray-200 dark:border-slate-700">
              <button
                type="button"
                onClick={() => setActiveTab('tools')}
                className={`px-6 py-3 font-medium transition-colors border-b-2 ${
                  activeTab === 'tools'
                    ? 'border-purple-500 text-purple-600 dark:text-purple-400'
                    : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
              >
                {t('privacyToolsDirectory.externalTools')}
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('resources')}
                className={`px-6 py-3 font-medium transition-colors border-b-2 ${
                  activeTab === 'resources'
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
              >
                {t('privacyToolsDirectory.privacyGuidesResources')}
              </button>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Tools Tab Content */}
        {activeTab === 'tools' && (
          <>
            {/* Service-Based Tools Section */}
            {selectedServices.length > 0 && serviceBasedTools.length > 0 && (
          <div className="bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 rounded-xl shadow-sm border border-purple-200 dark:border-purple-800 p-6 mb-8">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <Globe className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                  {t('privacyToolsDirectory.recommendedExternalToolsForYourServices')}
                </h2>
                <p className="text-gray-600 dark:text-gray-300 mt-1">
                  {t('privacyToolsDirectory.recommendedExternalToolsForYourServicesDesc', { 
                    count: selectedServices.length,
                    plural: selectedServices.length !== 1 ? 's' : ''
                  })}
                </p>
              </div>
              <button
                type="button"
                onClick={() => navigate('/service-catalog')}
                className="px-4 py-2 text-purple-600 dark:text-purple-400 hover:bg-purple-100 dark:hover:bg-purple-900/30 rounded-lg transition-colors text-sm font-medium flex items-center gap-2"
              >
                {t('toolkit.viewServicePrivacyCatalog')}
                <ExternalLink className="w-4 h-4" />
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {serviceBasedTools.slice(0, 6).map((tool) => {
                const TypeIcon = getToolTypeIcon(tool.type);
                return (
                  <div key={tool.id} className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-purple-200 dark:border-purple-700 p-4 hover:shadow-md transition-all">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2 flex-1">
                        {(() => {
                          const IconComponent = getIconComponent(tool.icon);
                          return <IconComponent className="w-5 h-5 text-purple-600 dark:text-purple-400 flex-shrink-0" />;
                        })()}
                        <h3 className="font-semibold text-gray-900 dark:text-white text-sm">{tool.name}</h3>
                      </div>
                      <span className="ml-2 px-1.5 py-0.5 text-xs font-medium rounded-full flex items-center gap-1 flex-shrink-0 bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400">
                        <Globe className="w-2.5 h-2.5" />
                      </span>
                    </div>
                    <p className="text-xs text-gray-600 dark:text-gray-300 mb-3 line-clamp-2">{tool.description}</p>
                    <button
                      type="button"
                      onClick={() => handleToolUse(tool)}
                      className="w-full px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-xs font-medium flex items-center justify-center gap-1"
                    >
                      {t('privacyToolsDirectory.visitSite')}
                      <ExternalLink className="w-3 h-3" />
                    </button>
                  </div>
                );
              })}
            </div>
            {serviceBasedTools.length > 6 && (
              <button
                type="button"
                onClick={() => {
                  setSelectedCategory('all');
                  const element = document.getElementById('all-tools-section');
                  if (element) {
                    element.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
                className="mt-4 text-sm text-purple-600 dark:text-purple-400 hover:underline flex items-center gap-1"
              >
                {t('privacyToolsDirectory.viewAllRecommendedTools', { count: serviceBasedTools.length })}
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
            </div>
          )}

            {/* Category Filter */}
            <div id="all-tools-section" className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 p-6 mb-8">
          <div className="flex flex-wrap gap-2">
            {categories.map(category => (
              <button
                key={category.value}
                type="button"
                onClick={() => setSelectedCategory(category.value)}
                className={`px-4 py-2 rounded-xl transition-all transform hover:scale-105 ${
                  selectedCategory === category.value
                    ? 'bg-purple-500 text-white shadow-md'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                {t(category.labelKey)}
              </button>
            ))}
          </div>
          <div className="mt-4 text-sm text-gray-600 dark:text-gray-300">
            {t('privacyToolsDirectory.showingToolsCount', { count: filteredTools.length })}
          </div>
          <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
            {t('privacyToolsDirectory.lookingForIntegrated')}{' '}
            <button type="button" onClick={() => navigate('/toolkit-access')} className="text-blue-600 dark:text-blue-400 hover:underline">
              {t('privacyToolsDirectory.visitPrivacyToolkit')}
            </button>
          </div>
        </div>

            {/* Tools Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {filteredTools.map((tool) => {
            const TypeIcon = getToolTypeIcon(tool.type);
            
            return (
              <div key={tool.id} className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-gray-200 dark:border-slate-700 hover:shadow-md transition-all">
                <div className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      {(() => {
                        const IconComponent = getIconComponent(tool.icon);
                        return <IconComponent className="w-5 h-5 text-purple-600 dark:text-purple-400 flex-shrink-0" />;
                      })()}
                      <h3 className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                        {tool.name}
                      </h3>
                    </div>
                    <span className="ml-2 px-1.5 py-0.5 text-xs font-medium rounded-full flex items-center gap-1 bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400 flex-shrink-0">
                      <Globe className="w-3 h-3" />
                    </span>
                  </div>
                  
                  <p className="text-xs text-gray-600 dark:text-gray-300 mb-3 line-clamp-2">
                    {tool.description}
                  </p>

                  <div className="flex items-center justify-end text-xs text-gray-500 dark:text-gray-400 mb-3">
                    <span className={`px-1.5 py-0.5 rounded text-xs ${
                      tool.difficulty === 'beginner' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                      tool.difficulty === 'intermediate' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' : 
                      'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                    }`}>
                      {tool.difficulty}
                    </span>
                  </div>

                  <button 
                    type="button"
                    onClick={() => handleToolUse(tool)}
                    className="w-full px-3 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors text-xs font-medium flex items-center justify-center gap-1"
                  >
                    {t('privacyToolsDirectory.visitSite')}
                    <ExternalLink className="w-3 h-3" />
                  </button>
                </div>
              </div>
            );
            })}
            </div>

            {filteredTools.length === 0 && (
              <EmptyState
                icon={Globe}
                title={t('privacyToolsDirectory.noExternalToolsFound')}
                message={t('privacyToolsDirectory.noExternalToolsMessage')}
                actionLabel={t('privacyToolsDirectory.showAllTools')}
                actionOnClick={() => setSelectedCategory('all')}
              />
            )}

            {/* Disclaimer */}
            <div className="mt-8 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800 p-6">
              <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-2">
                {t('privacyToolsDirectory.aboutExternalTools')}
              </h3>
              <p className="text-sm text-blue-800 dark:text-blue-200">
                {t('privacyToolsDirectory.aboutExternalToolsDesc')}
              </p>
            </div>
          </>
        )}

        {/* Resources Tab Content */}
        {activeTab === 'resources' && (
          <>
            {/* Service-Based Resources Section */}
            {selectedServices.length > 0 && serviceBasedResources.length > 0 && (
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl shadow-sm border border-blue-200 dark:border-blue-800 p-6 mb-8">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                      <BookOpen className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                      Recommended Resources for Your Services
                    </h2>
                    <p className="text-gray-600 dark:text-gray-300 mt-1">
                      Based on {selectedServices.length} service{selectedServices.length !== 1 ? 's' : ''} you're monitoring
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {serviceBasedResources.slice(0, 6).map((resource) => {
                    const IconComponent = getIconComponent(resource.icon);
                    return (
                      <div key={resource.id} className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-blue-200 dark:border-blue-700 p-4 hover:shadow-md transition-all">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-2 flex-1">
                            <IconComponent className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                            <h3 className="font-semibold text-gray-900 dark:text-white text-sm">{resource.title}</h3>
                          </div>
                        </div>
                        <p className="text-xs text-gray-600 dark:text-gray-300 mb-3 line-clamp-2">{resource.description}</p>
                        <button
                          type="button"
                          onClick={() => setSelectedResource(resource)}
                          className="w-full px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-xs font-medium flex items-center justify-center gap-1"
                        >
                          View Resource
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Resources Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {resources.map((resource) => {
                const IconComponent = getIconComponent(resource.icon);
                const primaryConcern = activeConcerns?.primary ? PersonaProfiles[activeConcerns.primary] : null;
                const concernColor = primaryConcern ? PersonaColors[primaryConcern.color] : {
                  bg: 'bg-gray-100 dark:bg-gray-700',
                  border: 'border-gray-200 dark:border-gray-600',
                  accent: 'text-gray-600 dark:text-gray-400'
                };
                
                return (
                  <div key={resource.id} className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-gray-200 dark:border-slate-700 hover:shadow-md transition-all">
                    <div className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-2 flex-1 min-w-0">
                          <IconComponent className={`w-5 h-5 ${concernColor.accent} flex-shrink-0`} />
                          <h3 className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                            {resource.title}
                          </h3>
                        </div>
                      </div>

                      <p className="text-xs text-gray-600 dark:text-gray-300 mb-3 line-clamp-2">
                        {resource.description}
                      </p>

                      <div className="flex items-center justify-end text-xs text-gray-500 dark:text-gray-400 mb-3">
                        <span className={`px-1.5 py-0.5 rounded text-xs ${
                          resource.difficulty === 'beginner' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                          resource.difficulty === 'intermediate' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' : 
                          'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                        }`}>
                          {resource.difficulty}
                        </span>
                      </div>

                      <button 
                        type="button"
                        onClick={() => setSelectedResource(resource)}
                        className="w-full px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-xs font-medium flex items-center justify-center gap-1"
                      >
                        View Resource
                        <ExternalLink className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {resources.length === 0 && (
              <EmptyState
                icon={BookOpen}
                title="No Resources Found"
                message="Resources will be available here."
              />
            )}
          </>
        )}
      </div>

      {/* Resource Detail Modal */}
      {selectedResource && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setSelectedResource(null)}>
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            {/* Header */}
            <div className="p-6 border-b border-gray-200 dark:border-slate-700">
              <div className="flex items-center justify-between">
                <div className="flex items-center flex-1">
                  <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 mr-4">
                    {(() => {
                      const IconComponent = getIconComponent(selectedResource.icon);
                      return <IconComponent className="w-6 h-6 text-blue-600 dark:text-blue-400" />;
                    })()}
                  </div>
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                      {selectedResource.title}
                    </h2>
                    <div className="flex items-center gap-3 mt-2">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        selectedResource.difficulty === 'beginner' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                        selectedResource.difficulty === 'intermediate' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' : 
                        'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                      }`}>
                        {selectedResource.difficulty}
                      </span>
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedResource(null)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors ml-4"
                >
                  <X className="w-5 h-5 text-gray-400" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-6">
              {/* Description */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                  Overview
                </h3>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-3">
                  {selectedResource.description}
                </p>
                {selectedResource.detailedDescription && (
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                    {selectedResource.detailedDescription}
                  </p>
                )}
              </div>

              {/* Why Important */}
              {selectedResource.whyImportant && (
                <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                  <h3 className="text-sm font-semibold text-blue-900 dark:text-blue-100 mb-2">
                    Why This Matters
                  </h3>
                  <p className="text-sm text-blue-800 dark:text-blue-200">
                    {selectedResource.whyImportant}
                  </p>
                </div>
              )}

              {/* What You'll Learn */}
              {selectedResource.whatYouWillLearn && selectedResource.whatYouWillLearn.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                    What You'll Learn
                  </h3>
                  <ul className="space-y-2">
                    {selectedResource.whatYouWillLearn.map((item, index) => (
                      <li key={index} className="flex items-start">
                        <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700 dark:text-gray-300">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Topics */}
              {selectedResource.topics && selectedResource.topics.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
                    Topics Covered
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedResource.topics.map((topic, index) => (
                      <span key={index} className="px-3 py-1 text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full">
                        {topic.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Learning Content Sections */}
              {selectedResource.content && selectedResource.content.sections && selectedResource.content.sections.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Learning Content
                  </h3>
                  <div className="space-y-4">
                    {selectedResource.content.sections.map((section, index) => (
                      <div key={index} className="bg-gray-50 dark:bg-slate-700/50 rounded-lg p-4 border border-gray-200 dark:border-slate-600">
                        <h4 className="text-base font-semibold text-gray-900 dark:text-white mb-2">
                          {section.title}
                        </h4>
                        <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                          {section.content}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Close Button */}
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setSelectedResource(null)}
                  className="px-6 py-3 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors font-medium"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PrivacyToolsDirectory;

