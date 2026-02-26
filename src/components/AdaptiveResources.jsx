import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Video, FileText, ExternalLink, Filter, Search, Clock, TrendingUp, Globe, ArrowRight, Wrench, Target, X, CheckCircle } from 'lucide-react';
import { allResources, getResourcesByPersona, getResourcesByService } from '../data/resources.js';
import { analytics } from '../utils/analytics.js';
import { getIconComponent } from '../utils/iconMapping.js';
import EnhancedBreadcrumbs from './common/EnhancedBreadcrumbs';
import BackButton from './common/BackButton';
import ThemeToggle from './common/ThemeToggle';
import ContextualLinks from './common/ContextualLinks';
import RelatedContent from './common/RelatedContent';
import EmptyState from './common/EmptyState';
import { PersonaProfiles, PersonaColors } from '../data/personaProfiles';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { calculatePrivacyExposureIndex } from '../utils/privacyExposureIndex';
import { useTranslation } from '../contexts/TranslationContext';

const AdaptiveResources = ({ persona, assessmentResults, personalizedContent }) => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  
  // Redirect to Privacy Tools Directory since resources are now consolidated there
  useEffect(() => {
    navigate('/privacy-tools', { replace: true });
  }, [navigate]);
  
  // Show loading state during redirect
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto mb-4"></div>
        <p className="text-gray-600 dark:text-gray-400">{t('adaptiveResources.redirecting')}</p>
      </div>
    </div>
  );
  
  // Legacy code below (kept for reference but won't execute due to redirect)
  const [concernsFromStorage] = useLocalStorage('socialcaution_persona', null);
  const [assessmentResultsFromStorage] = useLocalStorage('socialcaution_results', null);
  
  // Use props if provided, otherwise fallback to localStorage
  const activeConcerns = persona || concernsFromStorage;
  const activeAssessmentResults = assessmentResults || assessmentResultsFromStorage;
  
  // Get selected services from Service Privacy Catalog (for service-based recommendations)
  const [selectedServices] = useLocalStorage('socialcaution_services', []);
  
  // Get resources based on selected services (with error handling and exposure-based prioritization)
  const serviceBasedResources = useMemo(() => {
    try {
      const resources = getResourcesByService(selectedServices || []);
      
      // Prioritize resources by exposure index of related services
      if (selectedServices && selectedServices.length > 0) {
        return resources.sort((a, b) => {
          // Calculate max exposure index for services related to each resource
          const getMaxExposureForResource = (resource) => {
            // Find services that match this resource's topics/category
            const relatedServices = selectedServices.filter(serviceId => {
              const resourceTopics = resource.topics || [];
              const resourceCategory = resource.category;
              
              // Simple matching: check if service category matches resource category
              // or if resource topics include service-related keywords
              // This is a simplified approach - could be enhanced with better mapping
              return true; // For now, consider all selected services
            });
            
            if (relatedServices.length === 0) return 0;
            
            // Get max exposure index from related services
            const exposureIndices = relatedServices
              .map(serviceId => calculatePrivacyExposureIndex(serviceId))
              .filter(index => index !== null);
            
            return exposureIndices.length > 0 ? Math.max(...exposureIndices) : 0;
          };
          
          const exposureA = getMaxExposureForResource(a);
          const exposureB = getMaxExposureForResource(b);
          
          // Sort by exposure (highest first), then by relevance score
          if (exposureB !== exposureA) {
            return exposureB - exposureA;
          }
          return (b.relevanceScore || 0) - (a.relevanceScore || 0);
        });
      }
      
      return resources;
    } catch (error) {
      if (import.meta.env.DEV) {
        console.warn('Error getting service-based resources:', error);
      }
      return [];
    }
  }, [selectedServices]);
  
  const [resources, setResources] = useState([]);
  const [filteredResources, setFilteredResources] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [selectedResource, setSelectedResource] = useState(null);

  useEffect(() => {
    try {
      const generateResources = () => {
        if (activeConcerns?.primary) {
          // Personalized resources based on concerns
          const profile = PersonaProfiles[activeConcerns.primary];
          if (!profile) {
            // Fallback if concern profile not found
            return allResources.sort((a, b) => b.relevanceScore - a.relevanceScore);
          }
          const riskLevel = activeAssessmentResults?.exposureScore < 40 ? 'high' : 
                           activeAssessmentResults?.exposureScore < 70 ? 'moderate' : 'low';
          return getResourcesByPersona(activeConcerns.primary, riskLevel);
        } else {
          // Show all resources when no concerns (matches PersonalizedToolkit behavior)
          return allResources.sort((a, b) => b.relevanceScore - a.relevanceScore);
        }
      };

      const resourceList = generateResources();
      setResources(resourceList);
      setFilteredResources(resourceList);
    } catch (error) {
      // Fallback to all resources if generation fails
      if (import.meta.env.DEV) {
        console.error('Error generating resources:', error);
      }
      const fallbackResources = allResources.sort((a, b) => b.relevanceScore - a.relevanceScore);
      setResources(fallbackResources);
      setFilteredResources(fallbackResources);
    }
  }, [activeConcerns, activeAssessmentResults, selectedServices]);

  useEffect(() => {
    let filtered = resources;

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(resource => resource.category === selectedCategory);
    }

    // Filter by difficulty
    if (selectedDifficulty !== 'all') {
      filtered = filtered.filter(resource => resource.difficulty === selectedDifficulty);
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(resource =>
        resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        resource.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        resource.topics.some(topic => topic.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    setFilteredResources(filtered);
  }, [resources, selectedCategory, selectedDifficulty, searchTerm]);
  const handleResourceAccess = (resourceId, resourceType) => {
    try {
      if (analytics && typeof analytics.trackResourceAccess === 'function') {
        analytics.trackResourceAccess(resourceType, activeConcerns?.primary);
      }
      if (analytics && typeof analytics.trackFeatureUsage === 'function') {
        analytics.trackFeatureUsage('resource_access', {
          resource_id: resourceId,
          persona: activeConcerns?.primary,
          context: 'adaptive_resources',
          has_services: selectedServices.length > 0,
          services_count: selectedServices.length
        });
      }
    } catch (error) {
      // Silently fail analytics - don't block functionality
      if (import.meta.env.DEV) {
        console.warn('Analytics tracking failed:', error);
      }
    }
  };

  const handleResourceClick = (resource) => {
    try {
      handleResourceAccess(resource.id, resource.type);
      
      // Show resource details in modal instead of navigating to non-existent routes
      if (resource.url && resource.url.startsWith('http')) {
        // External links open in new tab
        window.open(resource.url, '_blank', 'noopener,noreferrer');
      } else {
        // Internal resources: show modal with detailed information
        setSelectedResource(resource);
      }
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error('Error handling resource click:', error);
      }
      // Fallback: show resource in modal
      setSelectedResource(resource);
    }
  };

  // Allow access without concerns - show all resources with personalization CTA
  // This matches the behavior of PersonalizedToolkit and PersonalizedDashboard

  const primaryConcern = activeConcerns?.primary ? PersonaProfiles[activeConcerns.primary] : null;
  const concernColor = primaryConcern ? PersonaColors[primaryConcern.color] : {
    bg: 'bg-gray-100 dark:bg-gray-700',
    border: 'border-gray-200 dark:border-gray-600',
    accent: 'text-gray-600 dark:text-gray-400'
  };

  const categories = [
    { value: 'all', label: 'All Resources' },
    { value: 'security', label: 'Security' },
    { value: 'privacy', label: 'Privacy' },
    { value: 'family', label: 'Family' },
    { value: 'social-media', label: 'Social Media' },
    { value: 'shopping', label: 'Shopping' },
    { value: 'legal', label: 'Legal' },
    { value: 'reputation', label: 'Reputation' }
  ];

  const difficulties = [
    { value: 'all', label: 'All Levels' },
    { value: 'beginner', label: 'Beginner' },
    { value: 'intermediate', label: 'Intermediate' },
    { value: 'advanced', label: 'Advanced' }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
      {/* Header – on page background */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-10 pb-8 sm:pb-10">
          {/* Navigation Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4">
              <ThemeToggle />
              <BackButton to={activeConcerns ? "/dashboard" : "/"} label={activeConcerns ? "Back to Dashboard" : "Back to Home"} variant="button" />
            </div>
          </div>

          <div className="flex items-center justify-center lg:justify-between">
            <div className="flex items-center justify-center lg:justify-start">
              {primaryConcern && (() => {
                const IconComponent = getIconComponent(primaryConcern.icon);
                return <IconComponent className={`w-8 h-8 mr-4 ${concernColor.accent}`} />;
              })()}
              <div className="text-center lg:text-left">
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
                  {primaryConcern 
                    ? `Resources for ${primaryConcern.name}`
                    : 'Privacy Resources'}
                </h1>
                <p className="text-lg text-gray-600 dark:text-gray-300 mt-1">
                  {primaryConcern
                    ? 'AI-powered Privacy-Preserving Personalization: Curated privacy resources tailored to your unique privacy concerns'
                    : 'Access curated educational content, guides, and resources. Complete an assessment to get personalized recommendations.'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {!activeConcerns && (
                <button
                  type="button"
                  onClick={() => navigate('/assessment/full')}
                  className="px-6 py-3 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors font-medium flex items-center gap-2"
                >
                  Get Personalized Recommendations
                  <Target className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
                  Based on {selectedServices.length} service{selectedServices.length !== 1 ? 's' : ''} you're monitoring in Services Monitoring
                </p>
              </div>
              <button
                type="button"
                onClick={() => navigate('/service-catalog')}
                className="px-4 py-2 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-lg transition-colors text-sm font-medium flex items-center gap-2"
              >
                View Services Monitoring
                <ExternalLink className="w-4 h-4" />
              </button>
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
                      onClick={() => handleResourceClick(resource)}
                      className="w-full px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-xs font-medium flex items-center justify-center gap-1"
                    >
                      View Resource
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                );
              })}
            </div>
            {serviceBasedResources.length > 6 && (
              <button
                type="button"
                onClick={() => {
                  setSelectedCategory('all');
                  const element = document.getElementById('all-resources-section');
                  if (element) {
                    element.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
                className="mt-4 text-sm text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
              >
                View all {serviceBasedResources.length} recommended resources
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        )}

        {/* Filters */}
        <div id="all-resources-section" className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 p-6 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search resources..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
              />
            </div>

            {/* Category Filter */}
            <div className="flex items-center space-x-4">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500 transition-all"
              >
                {categories.map(category => (
                  <option key={category.value} value={category.value}>
                    {category.label}
                  </option>
                ))}
              </select>

              <select
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500 transition-all"
              >
                {difficulties.map(difficulty => (
                  <option key={difficulty.value} value={difficulty.value}>
                    {difficulty.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-4 text-sm text-gray-600 dark:text-gray-300">
            {activeConcerns 
              ? `Showing ${filteredResources.length} resources personalized for your unique privacy concerns`
              : `Showing ${filteredResources.length} privacy resources. Complete an assessment to see personalized recommendations.`}
          </div>
          {selectedServices.length > 0 && (
            <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
              💡 Tip: Resources are also recommended based on {selectedServices.length} service{selectedServices.length !== 1 ? 's' : ''} you're monitoring. <button type="button" onClick={() => navigate('/service-catalog')} className="text-blue-600 dark:text-blue-400 hover:underline">Manage services →</button>
            </div>
          )}
        </div>

        {/* External Tools Directory Link */}
        <div className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-xl border-2 border-purple-200 dark:border-purple-800 p-6 mb-8 hover:shadow-lg transition-all duration-300">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                <Globe className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                  Browse External Privacy Tools
                </h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  Discover curated third-party privacy and security tools from trusted providers. These external tools complement our guides and tutorials with actionable privacy solutions.
                </p>
              </div>
            </div>
            <button
              onClick={() => {
                try {
                  if (analytics && typeof analytics.trackFeatureUsage === 'function') {
                    analytics.trackFeatureUsage('external_tools_directory_link', {
                      source: 'adaptive_resources',
                      persona: persona?.primary
                    });
                  }
                } catch (error) {
                  console.warn('Analytics tracking failed:', error);
                }
                navigate('/privacy-tools');
              }}
              className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-xl transition-all transform hover:scale-105 shadow-md hover:shadow-lg flex items-center justify-center gap-2 whitespace-nowrap"
            >
              <Wrench className="w-5 h-5" />
              View External Tools
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Resources Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredResources.map((resource) => (
            <div key={resource.id} className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 hover:shadow-lg transition-all duration-300">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-2 rounded-lg ${concernColor.bg} ${concernColor.border} border`}>
                    {(() => {
                      const IconComponent = getIconComponent(resource.icon);
                      return <IconComponent className={`w-5 h-5 ${concernColor.accent}`} />;
                    })()}
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      resource.difficulty === 'beginner' ? 'bg-green-100 text-green-700' :
                      resource.difficulty === 'intermediate' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'
                    }`}>
                      {resource.difficulty}
                    </span>
                    <span className="flex items-center text-xs text-gray-500">
                      <Clock className="w-3 h-3 mr-1" />
                      {resource.readTime}
                    </span>
                  </div>
                </div>

                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                  {resource.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
                  {resource.description}
                </p>

                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="flex text-yellow-400">
                      {[...Array(5)].map((_, i) => (
                        <span key={i} className={i < Math.floor(resource.rating) ? 'text-yellow-400' : 'text-gray-300'}>
                          ★
                        </span>
                      ))}
                    </div>
                    <span className="text-sm text-gray-500 ml-1">
                      {resource.rating}
                    </span>
                  </div>
                  <button 
                    type="button"
                    onClick={() => handleResourceClick(resource)}
                    className="flex items-center text-red-500 hover:text-red-600 font-medium text-sm"
                  >
                    <span>Open</span>
                    <ExternalLink className="w-4 h-4 ml-1" />
                  </button>
                </div>

                <div className="flex flex-wrap gap-1 mt-4">
                  {resource.topics.slice(0, 3).map((topic, index) => (
                    <span key={index} className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded">
                      {topic}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredResources.length === 0 && (
          <EmptyState
            icon={BookOpen}
            title="No resources found"
            message="Try adjusting your filters or search terms to find relevant resources."
            actionLabel="Clear Filters"
            actionOnClick={() => {
              setSelectedCategory('all');
              setSelectedDifficulty('all');
              setSearchTerm('');
            }}
          />
        )}

        {/* Related Content and Next Steps */}
        <div className="mt-8 space-y-6">
          <ContextualLinks
            currentPage="resources"
            userPersona={persona}
            assessmentResults={assessmentResults}
            showAsCards={true}
            maxLinks={3}
          />
          
          <RelatedContent
            userPersona={persona}
            currentPage="resources"
            assessmentResults={assessmentResults}
            title="Next Steps in Your Privacy Journey"
          />
        </div>
      </div>

      {/* Resource Detail Modal */}
      {selectedResource && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setSelectedResource(null)}>
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            {/* Header */}
            <div className="p-6 border-b border-gray-200 dark:border-slate-700">
              <div className="flex items-center justify-between">
                <div className="flex items-center flex-1">
                  <div className={`p-3 rounded-lg ${concernColor.bg} ${concernColor.border} border mr-4`}>
                    {(() => {
                      const IconComponent = getIconComponent(selectedResource.icon);
                      return <IconComponent className={`w-6 h-6 ${concernColor.accent}`} />;
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
                      <span className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                        <Clock className="w-4 h-4 mr-1" />
                        {selectedResource.readTime}
                      </span>
                      <div className="flex items-center">
                        <div className="flex text-yellow-400 mr-1">
                          {[...Array(5)].map((_, i) => (
                            <span key={i} className={i < Math.floor(selectedResource.rating) ? 'text-yellow-400' : 'text-gray-300'}>
                              ★
                            </span>
                          ))}
                        </div>
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          {selectedResource.rating}
                        </span>
                      </div>
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

export default AdaptiveResources;