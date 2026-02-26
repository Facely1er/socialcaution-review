import React, { useState, useEffect } from 'react';
import { 
  Database, 
  CheckCircle, 
  AlertTriangle, 
  XCircle, 
  ExternalLink, 
  CheckSquare,
  Square,
  X
} from 'lucide-react';
import { dataBrokers, getDataBrokerById } from '../../data/dataBrokers';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { getRecommendedBrokers } from '../../utils/dataBrokerAutoFill';
import { getBrokerRecommendationsSummary } from '../../data/serviceToBrokerMapping';
import { serviceCatalog } from '../../data/serviceCatalog';
import SEOHead from '../common/SEOHead';
import EnhancedBreadcrumbs from '../common/EnhancedBreadcrumbs';
import { useTranslation } from '../../contexts/TranslationContext';
import { useNavigate } from 'react-router-dom';
import { Info, Target } from 'lucide-react';

const DataBrokerRemovalTool = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [brokers, setBrokers] = useState([]);
  const [selectedBroker, setSelectedBroker] = useState(null);
  const [showInstructions, setShowInstructions] = useState(false);
  const [activeTab, setActiveTab] = useState('brokers');
  const [recommendedBrokers, setRecommendedBrokers] = useState({ highPriority: [], mediumPriority: [] });
  const [brokerSummary, setBrokerSummary] = useState(null);
  
  // Get selected services from Service Catalog
  const [selectedServices, setSelectedServices] = useLocalStorage('socialcaution_services', []);
  
  const [userId] = useState(() => {
    let id = localStorage.getItem('socialcaution_user_id');
    if (!id) {
      id = `user_${Date.now()}`;
      localStorage.setItem('socialcaution_user_id', id);
    }
    return id;
  });

  useEffect(() => {
    loadDataBrokers();
    loadRecommendedBrokers();
  }, []);

  // Update recommendations when selected services change
  useEffect(() => {
    loadRecommendedBrokers();
  }, [selectedServices]);

  const loadDataBrokers = () => {
    // Load personal checklist from localStorage (just a simple checkbox state)
    const saved = localStorage.getItem(`dataBrokerChecklist_${userId}`);
    const savedChecklist = saved ? JSON.parse(saved) : {};
    
    const brokersWithChecklist = dataBrokers.map(broker => ({
      ...broker,
      checked: savedChecklist[broker.id] || false
    }));
    
    setBrokers(brokersWithChecklist);
  };

  const toggleBrokerCheck = (brokerId) => {
    const saved = localStorage.getItem(`dataBrokerChecklist_${userId}`);
    const savedChecklist = saved ? JSON.parse(saved) : {};
    savedChecklist[brokerId] = !savedChecklist[brokerId];
    localStorage.setItem(`dataBrokerChecklist_${userId}`, JSON.stringify(savedChecklist));
    
    setBrokers(prev => prev.map(broker => 
      broker.id === brokerId ? { ...broker, checked: savedChecklist[brokerId] } : broker
    ));
  };



  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'easy': return 'text-green-600 dark:text-green-400';
      case 'medium': return 'text-yellow-600 dark:text-yellow-400';
      case 'hard': return 'text-red-600 dark:text-red-400';
      default: return 'text-gray-600 dark:text-gray-400';
    }
  };

  const getDifficultyIcon = (difficulty) => {
    switch (difficulty) {
      case 'easy': return <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />;
      case 'medium': return <AlertTriangle className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />;
      case 'hard': return <XCircle className="h-4 w-4 text-red-600 dark:text-red-400" />;
      default: return null;
    }
  };


  const getChecklistStats = () => {
    const total = brokers.length;
    const checked = brokers.filter(b => b.checked === true).length;
    const unchecked = brokers.filter(b => !b.checked).length;

    return { total, checked, unchecked };
  };


  // Load recommended brokers based on selected services
  const loadRecommendedBrokers = () => {
    if (selectedServices.length === 0) {
      setRecommendedBrokers({ highPriority: [], mediumPriority: [] });
      setBrokerSummary(null);
      return;
    }

    const recommendations = getRecommendedBrokers(selectedServices, dataBrokers);
    const summary = getBrokerRecommendationsSummary(selectedServices);
    
    setRecommendedBrokers(recommendations);
    setBrokerSummary(summary);
    
    // Clear selected services after generating broker recommendations
    if (recommendations.highPriority.length > 0 || recommendations.mediumPriority.length > 0) {
      setSelectedServices([]);
    }
  };

  // Handle quick action - start removal for a recommended broker
  const handleQuickAction = (brokerId) => {
    const broker = getDataBrokerById(brokerId);
    if (broker) {
      setSelectedBroker(broker);
      setShowInstructions(true);
      setActiveTab('brokers');
    }
  };

  const stats = getChecklistStats();

  return (
    <>
      <SEOHead
        title={`${t('dataBrokerRemoval.title')} - SocialCaution Privacy Platform`}
        description={t('dataBrokerRemoval.description')}
        keywords="data broker removal, opt-out, data privacy, personal information removal"
        canonicalUrl={`${window.location.origin}/tools/data-broker-removal`}
      />
      
      <section className="pt-8 sm:pt-12 pb-8 sm:pb-12 bg-gradient-to-br from-gray-50 via-red-50/30 to-gray-50 dark:from-slate-900 dark:via-red-950/20 dark:to-slate-900">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <EnhancedBreadcrumbs
            className="mb-6"
            customBreadcrumbs={[
              { name: t('common.navigation.privacyToolkit'), href: '/toolkit-access', current: false },
              { name: t('dataBrokerRemoval.breadcrumbs.dataBrokerRemoval'), href: '#', current: true }
            ]}
          />
          
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Database className="w-8 h-8 text-red-600 dark:text-red-400" />
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">
                {t('dataBrokerRemoval.title')}
              </h1>
            </div>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              {t('dataBrokerRemoval.subtitle')}
            </p>
          </div>
        </div>
      </section>

      <div className="min-h-screen bg-gray-50 dark:bg-slate-900 pb-20 sm:pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">

        {/* Important Disclaimers */}
        <div className="mb-6 space-y-4">
          {/* What This Guide Does */}
          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
            <div className="flex items-start">
              <Info className="h-5 w-5 text-blue-600 dark:text-blue-400 mr-3 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-medium text-blue-800 dark:text-blue-200 mb-2">
                  What This Guide Provides
                </h3>
                <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1 list-disc list-inside">
                  <li>Step-by-step instructions for removing your data from data broker websites</li>
                  <li>Direct links to each broker's opt-out page</li>
                  <li>A simple checklist to track which brokers you've contacted (stored locally in your browser)</li>
                  <li>Basic recommendations based on service types (not actual data analysis)</li>
                </ul>
              </div>
            </div>
          </div>

          {/* What This Guide Does NOT Do */}
          <div className="p-4 bg-red-50 dark:bg-red-900/20 border-2 border-red-300 dark:border-red-700 rounded-lg">
            <div className="flex items-start">
              <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400 mr-3 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-medium text-red-800 dark:text-red-200 mb-2">
                  Important Limitations
                </h3>
                <ul className="text-sm text-red-700 dark:text-red-300 space-y-1 list-disc list-inside">
                  <li><strong>Does NOT search for your data</strong> - We cannot search data broker databases</li>
                  <li><strong>Does NOT submit removal requests</strong> - You must do this manually on each broker's website</li>
                  <li><strong>Does NOT verify removals</strong> - You must check yourself if your data was removed</li>
                  <li><strong>Does NOT analyze your actual data</strong> - Recommendations are based on general service-to-broker mappings, not your specific data</li>
                  <li><strong>Does NOT monitor your data</strong> - This is a one-time guide, not ongoing monitoring</li>
                  <li><strong>Checklist is local only</strong> - Your progress is stored in your browser, not on our servers</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Recommended Brokers Based on Selected Services */}
        {(recommendedBrokers.highPriority.length > 0 || recommendedBrokers.mediumPriority.length > 0) && brokerSummary && brokerSummary.totalCount > 0 && (
          <div className="mb-6 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border-2 border-purple-300 dark:border-purple-700 rounded-lg p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <Target className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Recommended Brokers for Your Services
                  </h3>
                </div>
                <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">
                  Based on your {selectedServices.length} selected service{selectedServices.length !== 1 ? 's' : ''}, 
                  here are {brokerSummary.totalCount} data broker{brokerSummary.totalCount !== 1 ? 's' : ''} that commonly collect data from those service types. 
                  <strong className="text-red-600 dark:text-red-400"> Note: This is a general guide, not an analysis of your actual data.</strong>
                </p>
                <div className="flex flex-wrap gap-2 mb-3">
                  {selectedServices.slice(0, 5).map(serviceId => {
                    const service = serviceCatalog.find(s => s.id === serviceId);
                    return (
                      <span key={serviceId} className="px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 text-xs rounded">
                        {service?.name || serviceId}
                      </span>
                    );
                  })}
                  {selectedServices.length > 5 && (
                    <span className="px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 text-xs rounded">
                      +{selectedServices.length - 5} more
                    </span>
                  )}
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
                  <div>
                    <span className="font-semibold text-red-600 dark:text-red-400">{brokerSummary.highPriorityCount}</span>
                    <span className="text-gray-700 dark:text-gray-300 ml-1">High Priority</span>
                  </div>
                  <div>
                    <span className="font-semibold text-yellow-600 dark:text-yellow-400">{brokerSummary.mediumPriorityCount}</span>
                    <span className="text-gray-700 dark:text-gray-300 ml-1">Medium Priority</span>
                  </div>
                </div>
              </div>
            </div>

            {/* High Priority Brokers */}
            {recommendedBrokers.highPriority.length > 0 && (
              <div className="mb-4">
                <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-red-600 dark:text-red-400" />
                  Commonly Collects Data ({recommendedBrokers.highPriority.length})
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {recommendedBrokers.highPriority.slice(0, 6).map(broker => (
                    <div key={broker.id} className="bg-white dark:bg-slate-800 rounded-lg border-2 border-red-300 dark:border-red-700 p-3">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <h5 className="font-semibold text-sm text-gray-900 dark:text-white">{broker.name}</h5>
                          <p className="text-xs text-gray-600 dark:text-gray-300 mt-1">{broker.website}</p>
                        </div>
                        <span className="px-2 py-0.5 bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 text-xs rounded" title="Commonly collects data from your service types (general mapping, not your specific data)">
                          Commonly Collects
                        </span>
                      </div>
                      <button
                        onClick={() => handleQuickAction(broker.id)}
                        className="w-full mt-2 px-3 py-1.5 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-xs font-medium flex items-center justify-center gap-1"
                      >
                        <ExternalLink className="w-3 h-3" />
                        View Instructions
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Medium Priority Brokers */}
            {recommendedBrokers.mediumPriority.length > 0 && recommendedBrokers.highPriority.length <= 6 && (
              <div>
                <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                  <Info className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
                  Sometimes Collects Data ({recommendedBrokers.mediumPriority.length})
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {recommendedBrokers.mediumPriority.slice(0, 3).map(broker => (
                    <div key={broker.id} className="bg-white dark:bg-slate-800 rounded-lg border border-yellow-300 dark:border-yellow-700 p-3">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <h5 className="font-semibold text-sm text-gray-900 dark:text-white">{broker.name}</h5>
                          <p className="text-xs text-gray-600 dark:text-gray-300 mt-1">{broker.website}</p>
                        </div>
                        <span className="px-2 py-0.5 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300 text-xs rounded" title="Sometimes collects data from your service types (general mapping, not your specific data)">
                          Sometimes Collects
                        </span>
                      </div>
                      <button
                        onClick={() => handleQuickAction(broker.id)}
                        className="w-full mt-2 px-3 py-1.5 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors text-xs font-medium flex items-center justify-center gap-1"
                      >
                        <ExternalLink className="w-3 h-3" />
                        View Instructions
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-4 pt-4 border-t border-purple-300 dark:border-purple-700">
              <div className="flex items-start gap-2">
                <Info className="w-4 h-4 text-purple-600 dark:text-purple-400 mt-0.5 flex-shrink-0" />
                <div className="text-xs text-purple-700 dark:text-purple-300">
                  <p className="mb-2">
                    <strong>How recommendations work:</strong> Based on the services you've selected, we show brokers that commonly collect data from those service types. 
                    This is a <strong>general mapping</strong>, not an analysis of your actual data. We cannot know if these brokers actually have your information.
                  </p>
                  <p>
                    <strong>Note:</strong> "High priority" and "Medium priority" are just organizational labels based on how commonly these brokers collect data from your service types. 
                    You should check all brokers, not just the "high priority" ones.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}


        {/* Tab Navigation */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-2 mb-6">
            <button
              onClick={() => setActiveTab('brokers')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTab === 'brokers'
                  ? 'bg-red-500 text-white'
                  : 'bg-white dark:bg-slate-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-slate-600 hover:bg-gray-50 dark:hover:bg-slate-700'
              }`}
            >
              <Database className="h-4 w-4" />
              Data Brokers ({brokers.length})
            </button>
            <button
              onClick={() => setActiveTab('checklist')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTab === 'checklist'
                  ? 'bg-red-500 text-white'
                  : 'bg-white dark:bg-slate-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-slate-600 hover:bg-gray-50 dark:hover:bg-slate-700'
              }`}
            >
              <CheckSquare className="h-4 w-4" />
              My Checklist ({stats.checked}/{stats.total})
            </button>
          </div>
        </div>


        {/* Brokers Tab */}
        {activeTab === 'brokers' && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Data Brokers Directory
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Browse data brokers and get step-by-step instructions for removing your data. Click "View Instructions" to see how to remove your data from each broker.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
              {brokers.map((broker) => (
                <div
                  key={broker.id}
                  onClick={() => {
                    setSelectedBroker(broker);
                    setShowInstructions(true);
                  }}
                  className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-gray-200 dark:border-slate-700 p-4 flex flex-col cursor-pointer hover:shadow-md hover:border-red-300 dark:hover:border-red-700 transition-all"
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      setSelectedBroker(broker);
                      setShowInstructions(true);
                    }
                  }}
                >
                  {/* Header: Name, Checkbox, Website */}
                  <div className="flex items-start justify-between mb-2" onClick={(e) => e.stopPropagation()}>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-base font-semibold text-gray-900 dark:text-white truncate">{broker.name}</h3>
                        <button
                          onClick={() => toggleBrokerCheck(broker.id)}
                          className="flex-shrink-0"
                          aria-label="Toggle checklist"
                          title={broker.checked ? 'Uncheck - I haven\'t done this yet' : 'Check - I\'ve done this'}
                        >
                          {broker.checked ? (
                            <CheckSquare className="h-4 w-4 text-green-600 dark:text-green-400" />
                          ) : (
                            <Square className="h-4 w-4 text-gray-400 dark:text-gray-500" />
                          )}
                        </button>
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{broker.website}</p>
                    </div>
                  </div>

                  {/* Description - Compact */}
                  <p className="text-xs text-gray-600 dark:text-gray-300 mb-2 line-clamp-2">
                    {broker.description}
                  </p>

                  {/* Metadata Row: Difficulty, Time */}
                  <div className="flex items-center justify-between mb-2 text-xs">
                    <div className="flex items-center gap-2">
                      {getDifficultyIcon(broker.difficulty)}
                      <span className={`font-medium ${getDifficultyColor(broker.difficulty)}`}>
                        {broker.difficulty.toUpperCase()}
                      </span>
                      <span className="text-gray-400 dark:text-gray-500">•</span>
                      <span className="text-gray-600 dark:text-gray-400">
                        {broker.estimatedTime}
                      </span>
                    </div>
                  </div>

                  {/* Data Types - Compact */}
                  <div className="mb-2">
                    <div className="flex flex-wrap gap-1">
                      {broker.dataTypes.slice(0, 2).map((type, idx) => (
                        <span key={idx} className="px-1.5 py-0.5 bg-gray-100 dark:bg-slate-700 text-xs rounded">
                          {type}
                        </span>
                      ))}
                      {broker.dataTypes.length > 2 && (
                        <span className="px-1.5 py-0.5 bg-gray-100 dark:bg-slate-700 text-xs rounded">
                          +{broker.dataTypes.length - 2}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2 mt-auto" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => {
                        setSelectedBroker(broker);
                        setShowInstructions(true);
                      }}
                      className="flex-1 px-3 py-1.5 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-xs font-medium flex items-center justify-center gap-1.5"
                    >
                      <ExternalLink className="h-3.5 w-3.5" />
                      View Instructions
                    </button>
                    <button
                      onClick={() => window.open(broker.optOutUrl, '_blank', 'noopener,noreferrer')}
                      className="px-3 py-1.5 border border-gray-300 dark:border-slate-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors flex-shrink-0"
                      aria-label={t('dataBrokerRemoval.brokers.openOptOut')}
                      title="Go directly to opt-out page"
                    >
                      <ExternalLink className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Checklist Tab */}
        {activeTab === 'checklist' && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              My Personal Checklist
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Use this simple checklist to mark which brokers you've manually contacted. This is just for your personal reference - stored only in your browser.
            </p>
            <div className="mb-6 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
              <p className="text-sm text-yellow-800 dark:text-yellow-200">
                <strong>Important:</strong> This is a simple checkbox list stored in your browser. We cannot verify anything. 
                You must visit each broker's website yourself to actually remove your data.
              </p>
            </div>

            {/* Checklist Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-gray-200 dark:border-slate-700 p-4 text-center">
                <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {stats.checked}
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300">Checked (You marked as done)</p>
              </div>
              <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-gray-200 dark:border-slate-700 p-4 text-center">
                <div className="text-2xl font-bold text-gray-600 dark:text-gray-400">
                  {stats.unchecked}
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300">Not Checked</p>
              </div>
            </div>

            {/* Checklist List */}
            <div className="space-y-4 mb-8 broker-progress-list">
              {brokers.map((broker) => (
                <div 
                  key={broker.id} 
                  onClick={() => {
                    setSelectedBroker(broker);
                    setShowInstructions(true);
                  }}
                  className="broker-card w-full bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-gray-200 dark:border-slate-700 p-4 cursor-pointer hover:shadow-md hover:border-red-300 dark:hover:border-red-700 transition-all h-[100px] flex flex-col"
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      setSelectedBroker(broker);
                      setShowInstructions(true);
                    }
                  }}
                >
                  <div className="flex items-center justify-between gap-3 h-full">
                    <div className="flex items-center space-x-3 flex-1 min-w-0" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => toggleBrokerCheck(broker.id)}
                        className="broker-icon-wrapper flex-shrink-0 w-6 h-6 flex items-center justify-center"
                        aria-label="Toggle checklist"
                        title={broker.checked ? 'Uncheck' : 'Check'}
                      >
                        {broker.checked ? (
                          <CheckSquare className="h-5 w-5 text-green-600 dark:text-green-400" />
                        ) : (
                          <Square className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                        )}
                      </button>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap justify-start">
                          <h3 className="font-semibold text-gray-900 dark:text-white text-sm">{broker.name}</h3>
                          <span className="text-xs text-gray-400 dark:text-gray-500">•</span>
                          <span className="text-xs text-gray-600 dark:text-gray-300">{broker.estimatedTime}</span>
                          <span className="text-xs text-gray-400 dark:text-gray-500">•</span>
                          <span className="text-xs text-gray-600 dark:text-gray-300">{broker.legalBasis}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 flex-shrink-0" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => {
                          setSelectedBroker(broker);
                          setShowInstructions(true);
                        }}
                        className="px-3 py-1.5 text-xs bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-medium whitespace-nowrap"
                      >
                        View Instructions
                      </button>
                      <button
                        onClick={() => window.open(broker.optOutUrl, '_blank', 'noopener,noreferrer')}
                        className="p-1.5 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors flex-shrink-0"
                        aria-label={t('dataBrokerRemoval.brokers.openOptOut')}
                      >
                        <ExternalLink className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Instructions Modal */}
        {showInstructions && selectedBroker && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Removal Instructions - {selectedBroker.name}
                  </h3>
                  <button
                    onClick={() => setShowInstructions(false)}
                    className="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                    aria-label="Close"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <div className="mb-6">
                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    {selectedBroker.description}
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white mb-1">
                        Removal method:
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        {selectedBroker.optOutMethod}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white mb-1">
                        Difficulty:
                      </p>
                      <div className="flex items-center">
                        {getDifficultyIcon(selectedBroker.difficulty)}
                        <span className={`ml-1 text-sm font-medium ${getDifficultyColor(selectedBroker.difficulty)}`}>
                          {selectedBroker.difficulty.toUpperCase()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mb-6">
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                    Steps to follow:
                  </h4>
                  <div className="space-y-3">
                    {selectedBroker.instructions.map((instruction, index) => (
                      <div key={index} className="flex items-start">
                        <div className="w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3 mt-0.5">
                          {index + 1}
                        </div>
                        <p className="text-gray-600 dark:text-gray-300">{instruction}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 mb-4">
                  <div className="flex items-start">
                    <AlertTriangle className="h-5 w-5 text-yellow-600 dark:text-yellow-400 mr-3 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm text-yellow-800 dark:text-yellow-200">
                        <strong>Important:</strong> This guide provides instructions only. You must manually visit the broker's website and complete the removal process yourself. We cannot submit removal requests for you.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="space-y-3">
                  <button
                    onClick={() => window.open(selectedBroker.optOutUrl, '_blank', 'noopener,noreferrer')}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-medium"
                  >
                    <ExternalLink className="h-5 w-5" />
                    Go to Broker's Opt-Out Page
                  </button>
                  <button
                    onClick={() => {
                      toggleBrokerCheck(selectedBroker.id);
                      setShowInstructions(false);
                      setActiveTab('checklist');
                    }}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 border-2 border-green-500 text-green-700 dark:text-green-400 rounded-lg hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors font-medium"
                  >
                    <CheckSquare className="h-4 w-4" />
                    Mark in My Checklist (After You've Done It)
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Important Disclaimer - Bottom */}
        <div className="mt-8 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
          <p className="text-sm text-yellow-800 dark:text-yellow-200">
            <strong>Remember:</strong> This directory provides instructions only. We cannot search for your data or submit removal requests for you. 
            You must visit each broker's website and complete the removal process yourself.
          </p>
        </div>
        </div>
      </div>
    </>
  );
};

export default DataBrokerRemovalTool;
