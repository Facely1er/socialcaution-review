import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Shield, Gauge, AlertTriangle, TrendingUp, TrendingDown, BarChart3, 
  ArrowRight, Download, Share2, CheckCircle, Info, Target, 
  Users, ShoppingCart, MessageCircle, Film, Globe, Database, 
  Building, Scale, ArrowLeft, ExternalLink, FileText, Clock
} from 'lucide-react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { serviceCatalog } from '../data/serviceCatalog';
import { serviceRiskProfiles } from '../data/serviceRiskProfiles';
import { serviceRelationships } from '../data/serviceRelationships';
import { calculatePrivacyExposureIndex, getExposureLevel } from '../utils/privacyExposureIndex';
import { calculateQuickPrivacyScore, compareToAverage } from '../utils/quickPrivacyScore';
import { getServiceLogoUrl } from '../utils/serviceLogos';
import { useTheme } from '../contexts/ThemeContext';
import { useNotifications } from './common/NotificationSystem';
import EnhancedBreadcrumbs from './common/EnhancedBreadcrumbs';
import BackButton from './common/BackButton';
import ThemeToggle from './common/ThemeToggle';
import SEOHead from './common/SEOHead';
import { PersonaProfiles } from '../data/personaProfiles';
import { generateServicePrivacyReport } from '../utils/pdfReportGenerator';
import subscriptionService from '../services/subscriptionService';
import { analytics } from '../utils/analytics';
import PersonalizationPrompt from './common/PersonalizationPrompt';
import { useTranslation } from '../contexts/TranslationContext';

const ExposureIndexDashboard = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const { showSuccess, showInfo } = useNotifications();
  const { t } = useTranslation();
  const isPremium = subscriptionService.hasActiveSubscription();
  
  const [selectedServices] = useLocalStorage('socialcaution_services', []);
  const [persona] = useLocalStorage('socialcaution_persona', null);
  const [assessmentResults] = useLocalStorage('assessment-results', null);
  
  // Extract assessment scores
  const exposureScore = assessmentResults?.data?.exposure?.score || assessmentResults?.data?.exposureScore || null;
  const rightsScore = assessmentResults?.data?.rights?.score || assessmentResults?.data?.rightsScore || null;

  // Calculate aggregate exposure data
  const exposureData = useMemo(() => {
    if (!selectedServices || selectedServices.length === 0) {
      return null;
    }

    // Use QuickPrivacyScore for aggregate calculation
    const scoreData = calculateQuickPrivacyScore(selectedServices);
    if (!scoreData) return null;

    // Get detailed service data
    const serviceDetails = selectedServices.map(serviceId => {
      const service = serviceCatalog.find(s => s.id === serviceId);
      const riskProfile = serviceRiskProfiles[serviceId];
      const relationship = serviceRelationships[serviceId];
      const exposureIndex = calculatePrivacyExposureIndex(serviceId);
      const exposureLevel = getExposureLevel(exposureIndex);

      return {
        id: serviceId,
        name: service?.name || 'Unknown',
        category: service?.category || 'other',
        exposureIndex: exposureIndex || 0,
        exposureLevel,
        riskProfile,
        relationship,
        logoUrl: getServiceLogoUrl(serviceId, theme === 'dark')
      };
    }).filter(s => s.exposureIndex !== null);

    // Group by category
    const categoryBreakdown = {};
    serviceDetails.forEach(service => {
      const category = service.category;
      if (!categoryBreakdown[category]) {
        categoryBreakdown[category] = {
          services: [],
          totalExposure: 0,
          count: 0,
          avgExposure: 0
        };
      }
      categoryBreakdown[category].services.push(service);
      categoryBreakdown[category].totalExposure += service.exposureIndex;
      categoryBreakdown[category].count++;
    });

    // Calculate averages
    Object.keys(categoryBreakdown).forEach(category => {
      const cat = categoryBreakdown[category];
      cat.avgExposure = Math.round(cat.totalExposure / cat.count);
    });

    // Get top 3 highest risk services
    const topRisks = [...serviceDetails]
      .sort((a, b) => b.exposureIndex - a.exposureIndex)
      .slice(0, 3);

    // Get recommendations
    const recommendations = generateRecommendations(serviceDetails, scoreData);

    return {
      ...scoreData,
      serviceDetails,
      categoryBreakdown,
      topRisks,
      recommendations
    };
  }, [selectedServices, theme]);

  // Generate recommendations based on exposure
  function generateRecommendations(serviceDetails, scoreData) {
    const recommendations = [];

    // High exposure services
    const highRiskServices = serviceDetails.filter(s => s.exposureIndex >= 70);
    if (highRiskServices.length > 0) {
      recommendations.push({
        type: 'high-risk',
        priority: 'high',
        title: `Review ${highRiskServices.length} Very High-Risk Service${highRiskServices.length > 1 ? 's' : ''}`,
        description: `These services have exposure indices of 70 or higher. Consider reviewing privacy settings or reducing usage.`,
        services: highRiskServices.map(s => s.name),
        action: 'Review privacy settings',
        icon: AlertTriangle
      });
    }

    // Category diversity
    const categories = new Set(serviceDetails.map(s => s.category));
    if (categories.size >= 5) {
      recommendations.push({
        type: 'category-diversity',
        priority: 'medium',
        title: 'High Category Diversity',
        description: `You're using services across ${categories.size} different categories, which increases your exposure surface.`,
        action: 'Consider consolidating similar services',
        icon: BarChart3
      });
    }

    // Parent company connections
    const parentCompanies = new Set();
    serviceDetails.forEach(s => {
      if (s.relationship?.parent) {
        parentCompanies.add(s.relationship.parent);
      }
    });
    if (parentCompanies.size > 0 && serviceDetails.length >= 3) {
      recommendations.push({
        type: 'parent-company',
        priority: 'medium',
        title: 'Multiple Services from Same Parent',
        description: `You're using ${parentCompanies.size} service${parentCompanies.size > 1 ? 's' : ''} from the same parent company, which may share data across services.`,
        action: 'Review data sharing policies',
        icon: Building
      });
    }

    // Quick wins from scoreData
    if (scoreData.quickWins && scoreData.quickWins.length > 0) {
      scoreData.quickWins.slice(0, 2).forEach(win => {
        recommendations.push({
          type: 'quick-win',
          priority: win.impact || 'medium',
          title: win.title,
          description: win.description,
          potentialReduction: win.potentialReduction,
          icon: CheckCircle
        });
      });
    }

    return recommendations;
  }

  // Get category icon
  const getCategoryIcon = (category) => {
    const icons = {
      'social-media': Users,
      'shopping': ShoppingCart,
      'messaging': MessageCircle,
      'streaming': Film,
      'search-email': Globe,
      'cloud-storage': Database,
      'financial': Shield
    };
    return icons[category] || BarChart3;
  };

  const formatCategoryLabel = (category) => {
    return category.split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  // Handle export
  const handleExport = async () => {
    try {
      const fileName = await generateServicePrivacyReport(selectedServices);
      showSuccess(`Full privacy report exported as ${fileName}!`, { duration: 5000 });
    } catch (error) {
      console.error('PDF export failed:', error);
      showInfo('Unable to export report. Please try again.', { duration: 3000 });
    }
  };

  // Handle share
  const handleShare = async () => {
    if (!exposureData) return;

    const shareText = `My Privacy Exposure Score: ${exposureData.overallScore}/100 based on ${exposureData.totalServices} services. ` +
      `Top concerns: ${exposureData.topRisks.map(r => r.name).join(', ')}. ` +
      `Check your privacy exposure at SocialCaution!`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'My Privacy Exposure Score',
          text: shareText
        });
        showSuccess('Shared successfully!');
      } catch (err) {
        if (err.name !== 'AbortError') {
          console.error('Share failed:', err);
        }
      }
    } else {
      try {
        await navigator.clipboard.writeText(shareText);
        showInfo('Score summary copied to clipboard!');
      } catch (err) {
        console.error('Copy failed:', err);
        showInfo('Unable to share. Please try again.');
      }
    }
  };

  // Track page view
  React.useEffect(() => {
    try {
      if (analytics && typeof analytics.trackPageView === 'function') {
        analytics.trackPageView('/exposure-dashboard', {
          services_count: selectedServices.length,
          has_persona: !!persona
        });
      }
    } catch (error) {
      if (import.meta.env.DEV) {
        console.warn('Analytics tracking failed:', error);
      }
    }
  }, [selectedServices.length, persona]);

  // Empty state
  if (!selectedServices || selectedServices.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-slate-900 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <BackButton to="/service-catalog" label="Back to Services Monitoring" variant="button" />
          <div className="mt-8 bg-white dark:bg-slate-800 rounded-lg shadow-lg p-8 text-center">
            <Gauge className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              No Services Selected
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Select services from Services Monitoring to view your privacy exposure analysis.
            </p>
            <button
              onClick={() => navigate('/service-catalog')}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all transform hover:scale-105 flex items-center gap-2 mx-auto"
            >
              <ArrowRight className="w-5 h-5" />
              Go to Services Monitoring
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!exposureData) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-slate-900 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-gray-600 dark:text-gray-300">Loading exposure data...</p>
          </div>
        </div>
      </div>
    );
  }

  const { overallScore, level, totalServices, riskLevelCounts, categoryBreakdown, topRisks, recommendations, serviceDetails } = exposureData;
  const comparison = compareToAverage(overallScore, totalServices);

  // Score color based on level
  const getScoreColor = () => {
    if (overallScore >= 70) return 'text-red-600 dark:text-red-400';
    if (overallScore >= 50) return 'text-orange-600 dark:text-orange-400';
    if (overallScore >= 30) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-green-600 dark:text-green-400';
  };

  const getScoreBgColor = () => {
    if (overallScore >= 70) return 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-700';
    if (overallScore >= 50) return 'bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-700';
    if (overallScore >= 30) return 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-700';
    return 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-700';
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 py-12">
      <SEOHead
        title="Privacy Exposure Dashboard - SocialCaution"
        description={`Your privacy exposure analysis: ${overallScore}/100 based on ${totalServices} selected services. View detailed breakdown and recommendations.`}
        keywords="privacy exposure, exposure index, privacy dashboard, digital footprint, privacy analysis"
      />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6">
          <BackButton to="/service-catalog" label="Back to Services Monitoring" variant="button" />
          <div className="flex items-center justify-between mt-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Service Exposure Dashboard
              </h1>
              <p className="text-gray-600 dark:text-gray-300 mb-2">
                Analysis of Service Exposure Indices across {totalServices} selected service{totalServices !== 1 ? 's' : ''}
              </p>
              <div className="bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500 p-2 rounded-r text-xs text-blue-900 dark:text-blue-200">
                <strong>Note:</strong> This dashboard shows <strong>Service Exposure Indices</strong> for individual services. 
                Your <strong>Digital Footprint Score</strong> (personal score) is shown in the Personalized Dashboard.
              </div>
            </div>
            <div className="flex items-center gap-2">
              <ThemeToggle />
              <button
                onClick={handleShare}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"
                title="Share score"
                type="button"
              >
                <Share2 className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </button>
              <button
                onClick={handleExport}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"
                title="Export report"
                type="button"
              >
                <Download className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </button>
            </div>
          </div>
        </div>

        {/* Total Exposure Score - Hero Section */}
        <div className={`rounded-xl border-2 ${getScoreBgColor()} p-8 mb-6`}>
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex-1 text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-3 mb-4">
                <div className={`p-4 rounded-full ${level.bgColor}`}>
                  <Shield className={`w-8 h-8 ${level.textColor}`} />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Total Privacy Exposure Score
                  </h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Your aggregate privacy risk from all selected services (0-100, higher = more risk)
                  </p>
                </div>
              </div>
              
              <div className="flex items-baseline justify-center md:justify-start gap-2 mb-4">
                <span className={`text-6xl font-bold ${getScoreColor()}`}>
                  {overallScore}
                </span>
                <span className="text-2xl text-gray-500 dark:text-gray-400">/100</span>
              </div>
              
              <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${level.bgColor} mb-4`}>
                <span className={`text-base font-semibold ${level.textColor}`}>
                  {level.level} Exposure
                </span>
              </div>

              {/* Comparison to Average */}
              <div className="flex items-center gap-2 text-sm">
                {comparison.status === 'better' ? (
                  <TrendingDown className="w-4 h-4 text-green-600 dark:text-green-400" />
                ) : comparison.status === 'worse' ? (
                  <TrendingUp className="w-4 h-4 text-red-600 dark:text-red-400" />
                ) : (
                  <Info className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                )}
                <span className="text-gray-700 dark:text-gray-300">
                  {comparison.message}
                </span>
              </div>
            </div>

            {/* Visual Gauge */}
            <div className="flex-1 max-w-md">
              <div className="relative">
                <div className="text-center mb-4">
                  <span className="text-sm font-semibold text-gray-600 dark:text-gray-400">
                    Exposure Level Distribution
                  </span>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Very High (70+)</span>
                    <span className="text-sm font-bold text-red-600 dark:text-red-400">{riskLevelCounts.veryHigh}</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                    <div
                      className="bg-red-500 h-3 rounded-full transition-all"
                      style={{ width: `${(riskLevelCounts.veryHigh / totalServices) * 100}%` }}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">High (50-69)</span>
                    <span className="text-sm font-bold text-orange-600 dark:text-orange-400">{riskLevelCounts.high}</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                    <div
                      className="bg-orange-500 h-3 rounded-full transition-all"
                      style={{ width: `${(riskLevelCounts.high / totalServices) * 100}%` }}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Medium (30-49)</span>
                    <span className="text-sm font-bold text-yellow-600 dark:text-yellow-400">{riskLevelCounts.medium}</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                    <div
                      className="bg-yellow-500 h-3 rounded-full transition-all"
                      style={{ width: `${(riskLevelCounts.medium / totalServices) * 100}%` }}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Low (0-29)</span>
                    <span className="text-sm font-bold text-green-600 dark:text-green-400">{riskLevelCounts.low}</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                    <div
                      className="bg-green-500 h-3 rounded-full transition-all"
                      style={{ width: `${(riskLevelCounts.low / totalServices) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Privacy Health Metrics */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Gauge className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              {t('privacyRadar.privacyHealthMetrics')}
            </h2>
            <span className="text-xs text-gray-500 dark:text-gray-400">{t('privacyRadar.basedOnYourProfile')}</span>
          </div>
          
          {/* Explanation Banner */}
          <div className="mb-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-l-4 border-blue-500 dark:border-blue-400 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <Info className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-sm text-blue-900 dark:text-blue-200 font-medium mb-1">
                  How Privacy Health Metrics Work
                </p>
                <p className="text-xs text-blue-800 dark:text-blue-300 mb-2">
                  These metrics are calculated from your <strong>Privacy Assessments</strong> and <strong>Services Monitoring selections</strong>. 
                  They provide insights into your overall privacy health based on your selected services' exposure indices.
                </p>
                <div className="flex flex-wrap gap-2 mt-2">
                  <button
                    onClick={() => navigate('/service-catalog')}
                    className="text-xs px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-1.5"
                  >
                    <Shield className="w-3.5 h-3.5" />
                    Select Your Services
                  </button>
                  {(!exposureScore || !rightsScore) && (
                    <button
                      onClick={() => navigate('/assessment')}
                      className="text-xs px-3 py-1.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-1.5"
                    >
                      <Target className="w-3.5 h-3.5" />
                      Take Privacy Assessments
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Data Minimization */}
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-gray-200 dark:border-slate-700 p-6">
              <div className="flex items-center gap-2 mb-2">
                <Database className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{t('privacyRadar.dataMinimization')}</h3>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                {t('privacyRadar.dataMinimizationDesc')}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-4 italic">
                {exposureScore !== null 
                  ? 'Based on your Privacy Exposure Assessment'
                  : selectedServices.length > 0
                  ? `Based on ${selectedServices.length} service${selectedServices.length > 1 ? 's' : ''} selected in Services Monitoring`
                  : 'Estimated - Select services in Services Monitoring for accurate score'}
              </p>
              
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-2xl font-bold text-gray-900 dark:text-white">
                    {(() => {
                      if (exposureScore !== null) {
                        return Math.max(40, 100 - exposureScore);
                      }
                      if (selectedServices.length === 0) {
                        return 75;
                      }
                      return Math.max(40, 90 - (selectedServices.length * 5));
                    })()}%
                  </span>
                  {(() => {
                    const score = exposureScore !== null 
                      ? Math.max(40, 100 - exposureScore)
                      : selectedServices.length > 0 
                        ? Math.max(40, 90 - (selectedServices.length * 5))
                        : 75;
                    return (
                      <span className={`px-2 py-1 text-xs font-semibold rounded ${
                        score >= 80 
                          ? 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-300'
                          : score >= 60
                          ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-300'
                          : 'bg-orange-100 text-orange-700 dark:bg-orange-900/20 dark:text-orange-300'
                      }`}>
                        {score >= 80 ? t('privacyRadar.excellent') : score >= 60 ? t('privacyRadar.good') : t('privacyRadar.fair')}
                      </span>
                    );
                  })()}
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                  <div 
                    className={`h-3 rounded-full transition-all ${
                      (() => {
                        const score = exposureScore !== null 
                          ? Math.max(40, 100 - exposureScore)
                          : selectedServices.length > 0 
                            ? Math.max(40, 90 - (selectedServices.length * 5))
                            : 75;
                        if (score >= 80) return 'bg-green-500';
                        if (score >= 60) return 'bg-yellow-500';
                        return 'bg-orange-500';
                      })()
                    }`}
                    style={{width: `${(() => {
                      if (exposureScore !== null) {
                        return Math.max(40, 100 - exposureScore);
                      }
                      if (selectedServices.length === 0) return 75;
                      return Math.max(40, 90 - (selectedServices.length * 5));
                    })()}%`}}
                  />
                </div>
                {exposureScore === null && (
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {selectedServices.length > 0 
                      ? t('privacyRadar.basedOnYourServices') + ' ' 
                      : t('privacyRadar.estimated') + ' '}
                    <button
                      onClick={() => navigate('/assessment/exposure')}
                      className="text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      {t('privacyRadar.takeAssessmentForScore')}
                    </button>
                  </p>
                )}
                {exposureScore !== null && (
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {t('privacyRadar.basedOnPrivacyExposure')}
                  </p>
                )}
              </div>
            </div>

            {/* Consent Coverage */}
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-gray-200 dark:border-slate-700 p-6">
              <div className="flex items-center gap-2 mb-2">
                <FileText className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{t('privacyRadar.consentCoverage')}</h3>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                {t('privacyRadar.consentCoverageDesc')}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-4 italic">
                {rightsScore !== null 
                  ? 'Based on your Privacy Rights Knowledge Assessment'
                  : persona
                  ? 'Based on your privacy persona profile'
                  : 'Estimated - Take Privacy Rights Assessment for accurate score'}
              </p>
              
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-2xl font-bold text-gray-900 dark:text-white">
                    {(() => {
                      if (rightsScore !== null) {
                        return Math.min(95, Math.max(60, rightsScore));
                      }
                      return persona ? 88 : 75;
                    })()}%
                  </span>
                  {(() => {
                    const score = rightsScore !== null 
                      ? Math.min(95, Math.max(60, rightsScore))
                      : persona ? 88 : 75;
                    return (
                      <span className={`px-2 py-1 text-xs font-semibold rounded ${
                        score >= 85 
                          ? 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-300'
                          : score >= 75
                          ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-300'
                          : 'bg-orange-100 text-orange-700 dark:bg-orange-900/20 dark:text-orange-300'
                      }`}>
                        {score >= 85 ? 'Excellent' : score >= 75 ? 'Good' : 'Fair'}
                      </span>
                    );
                  })()}
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                  <div 
                    className={`h-3 rounded-full transition-all ${
                      (() => {
                        const score = rightsScore !== null 
                          ? Math.min(95, Math.max(60, rightsScore))
                          : persona ? 88 : 75;
                        if (score >= 85) return 'bg-green-500';
                        if (score >= 75) return 'bg-yellow-500';
                        return 'bg-orange-500';
                      })()
                    }`}
                    style={{width: `${(() => {
                      if (rightsScore !== null) {
                        return Math.min(95, Math.max(60, rightsScore));
                      }
                      return persona ? 88 : 75;
                    })()}%`}}
                  />
                </div>
                {rightsScore === null && (
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {persona 
                      ? t('privacyRadar.basedOnPersonaProfile') + '. ' 
                      : 'Estimated. '}
                    <button
                      onClick={() => navigate('/assessment/privacy-rights')}
                      className="text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      Take assessment for personalized score
                    </button>
                  </p>
                )}
                {rightsScore !== null && (
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {t('privacyRadar.basedOnPrivacyRights')}
                  </p>
                )}
              </div>
            </div>

            {/* Encryption Rate */}
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-gray-200 dark:border-slate-700 p-6">
              <div className="flex items-center gap-2 mb-2">
                <Shield className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{t('privacyRadar.encryptionRate')}</h3>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                {t('privacyRadar.encryptionRateDesc')}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-4 italic">
                {selectedServices.length > 0
                  ? `Based on ${selectedServices.length} service${selectedServices.length > 1 ? 's' : ''} selected in Service Catalog`
                  : 'Estimated industry average - Select your services for personalized score'}
              </p>
              
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-2xl font-bold text-gray-900 dark:text-white">
                    {selectedServices.length > 0 ? '91%' : '85%'}
                  </span>
                  <span className="px-2 py-1 text-xs font-semibold rounded bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-300">
                    {selectedServices.length > 0 ? t('privacyRadar.excellent') : t('privacyRadar.good')}
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                  <div 
                    className="h-3 rounded-full transition-all bg-green-500"
                    style={{width: selectedServices.length > 0 ? '91%' : '85%'}}
                  />
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {selectedServices.length > 0 
                    ? t('privacyRadar.basedOnSelectedServices') 
                    : t('privacyRadar.estimatedIndustryAverage')}
                </p>
              </div>
            </div>

            {/* Access Control Strength */}
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-gray-200 dark:border-slate-700 p-6">
              <div className="flex items-center gap-2 mb-2">
                <Users className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{t('privacyRadar.accessControl')}</h3>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                {t('privacyRadar.accessControlDesc')}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-4 italic">
                {persona
                  ? 'Based on your privacy persona profile'
                  : 'Estimated - Take Privacy Exposure Assessment for a personalized score'}
              </p>
              
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-2xl font-bold text-gray-900 dark:text-white">
                    {persona ? 79 : 72}%
                  </span>
                  {(() => {
                    const score = persona ? 79 : 72;
                    return (
                      <span className={`px-2 py-1 text-xs font-semibold rounded ${
                        score >= 85 
                          ? 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-300'
                          : score >= 75
                          ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-300'
                          : 'bg-orange-100 text-orange-700 dark:bg-orange-900/20 dark:text-orange-300'
                      }`}>
                        {score >= 85 ? 'Excellent' : score >= 75 ? 'Good' : 'Fair'}
                      </span>
                    );
                  })()}
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                  <div 
                    className={`h-3 rounded-full transition-all ${
                      (() => {
                        const score = persona ? 79 : 72;
                        if (score >= 85) return 'bg-green-500';
                        if (score >= 75) return 'bg-yellow-500';
                        return 'bg-orange-500';
                      })()
                    }`}
                    style={{width: `${persona ? 79 : 72}%`}}
                  />
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {persona ? t('privacyRadar.basedOnPersonaProfile') : t('privacyRadar.estimated')}
                </p>
              </div>
            </div>

            {/* Retention Compliance */}
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-gray-200 dark:border-slate-700 p-6">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Retention Compliance</h3>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                Data retention policies properly enforced
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-4 italic">
                {selectedServices.length > 0
                  ? `Based on ${selectedServices.length} service${selectedServices.length > 1 ? 's' : ''} selected in Service Catalog`
                  : 'Estimated industry average - Select your services for personalized score'}
              </p>
              
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-2xl font-bold text-gray-900 dark:text-white">
                    {selectedServices.length > 0 ? '82%' : '78%'}
                  </span>
                  <span className="px-2 py-1 text-xs font-semibold rounded bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-300">
                    Good
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                  <div 
                    className="h-3 rounded-full transition-all bg-green-500"
                    style={{width: selectedServices.length > 0 ? '82%' : '78%'}}
                  />
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {selectedServices.length > 0 
                    ? t('privacyRadar.basedOnSelectedServices') 
                    : t('privacyRadar.estimatedIndustryAverage')}
                </p>
              </div>
            </div>

            {/* Incident Response Readiness */}
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-gray-200 dark:border-slate-700 p-6">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Incident Response</h3>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                Breach notification and response preparedness
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-4 italic">
                {persona
                  ? 'Based on your privacy persona profile'
                  : 'Estimated average - Complete persona selection for personalized score'}
              </p>
              
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-2xl font-bold text-gray-900 dark:text-white">
                    {persona ? '76%' : '70%'}
                  </span>
                  <span className="px-2 py-1 text-xs font-semibold rounded bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-300">
                    Good
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                  <div 
                    className="h-3 rounded-full transition-all bg-yellow-500"
                    style={{width: persona ? '76%' : '70%'}}
                  />
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {persona 
                    ? t('privacyRadar.basedOnPersonaProfile') 
                    : t('privacyRadar.estimatedAverage')}
                </p>
              </div>
            </div>
          </div>
          
          {/* Metrics Info */}
          <div className="mt-6 bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <Info className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-blue-800 dark:text-blue-300">
                Privacy metrics are calculated based on continuous monitoring of threats to your selected services, 
                and assessment responses. These educational estimates help you understand security risks affecting 
                the services you use and identify areas for improvement.
              </p>
            </div>
          </div>
        </div>

        {/* Top Risks Section */}
        {topRisks.length > 0 && (
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 p-6 mb-6">
            <div className="flex items-center gap-3 mb-4">
              <AlertTriangle className="w-6 h-6 text-red-600 dark:text-red-400" />
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Highest Risk Services
              </h2>
            </div>
            <div className="grid md:grid-cols-3 gap-4">
              {topRisks.map((service, idx) => {
                const Icon = getCategoryIcon(service.category);
                return (
                  <div
                    key={service.id}
                    className="p-4 rounded-lg border-2 border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      {service.logoUrl ? (
                        <img
                          src={service.logoUrl}
                          alt={`${service.name} logo`}
                          className="w-10 h-10 rounded-lg"
                          onError={(e) => { e.target.style.display = 'none'; }}
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-lg bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                          <Icon className="w-5 h-5 text-gray-500" />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 dark:text-white truncate">
                          #{idx + 1} {service.name}
                        </h3>
                        <p className="text-xs text-gray-600 dark:text-gray-400">
                          {formatCategoryLabel(service.category)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Service Exposure Index</span>
                      <span className="text-2xl font-bold text-red-600 dark:text-red-400">
                        {service.exposureIndex}
                      </span>
                    </div>
                    <div className="mt-2">
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div
                          className="bg-red-500 h-2 rounded-full"
                          style={{ width: `${service.exposureIndex}%` }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Service Breakdown */}
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <BarChart3 className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Service Breakdown
              </h2>
            </div>
            <button
              onClick={() => navigate('/service-catalog')}
              className="text-sm text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
            >
              Edit Services
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
          <div className="space-y-3">
            {serviceDetails
              .sort((a, b) => b.exposureIndex - a.exposureIndex)
              .map(service => {
                const Icon = getCategoryIcon(service.category);
                return (
                  <div
                    key={service.id}
                    className="p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      {service.logoUrl ? (
                        <img
                          src={service.logoUrl}
                          alt={`${service.name} logo`}
                          className="w-12 h-12 rounded-lg flex-shrink-0"
                          onError={(e) => { e.target.style.display = 'none'; }}
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-lg bg-gray-200 dark:bg-gray-700 flex items-center justify-center flex-shrink-0">
                          <Icon className="w-6 h-6 text-gray-500" />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <h3 className="font-semibold text-gray-900 dark:text-white truncate">
                            {service.name}
                          </h3>
                          <span className={`text-lg font-bold ${service.exposureLevel.textColor} ml-2`}>
                            {service.exposureIndex}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {formatCategoryLabel(service.category)}
                          </span>
                          {service.relationship?.parent && (
                            <>
                              <span className="text-gray-300 dark:text-gray-600">•</span>
                              <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                                <Building className="w-3 h-3" />
                                {service.relationship.parentName}
                              </span>
                            </>
                          )}
                        </div>
                        <div className="mt-2 w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                          <div
                            className={`h-1.5 rounded-full transition-all ${service.exposureLevel.barColor}`}
                            style={{ width: `${service.exposureIndex}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>

        {/* Category Breakdown */}
        {Object.keys(categoryBreakdown).length > 0 && (
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 p-6 mb-6">
            <div className="flex items-center gap-3 mb-4">
              <BarChart3 className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Exposure by Category
              </h2>
            </div>
            <div className="space-y-4">
              {Object.entries(categoryBreakdown)
                .sort((a, b) => b[1].avgExposure - a[1].avgExposure)
                .map(([category, data]) => {
                  const Icon = getCategoryIcon(category);
                  const categoryLevel = getExposureLevel(data.avgExposure);
                  return (
                    <div
                      key={category}
                      className="p-4 rounded-lg border border-gray-200 dark:border-gray-700"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700">
                            <Icon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900 dark:text-white">
                              {formatCategoryLabel(category)}
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {data.count} service{data.count !== 1 ? 's' : ''}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className={`text-2xl font-bold ${categoryLevel.textColor}`}>
                            {data.avgExposure}
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            Average
                          </div>
                        </div>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${categoryLevel.barColor}`}
                          style={{ width: `${data.avgExposure}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        )}

        {/* Recommendations */}
        {recommendations.length > 0 && (
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 p-6 mb-6">
            <div className="flex items-center gap-3 mb-4">
              <Target className="w-6 h-6 text-green-600 dark:text-green-400" />
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Recommendations
              </h2>
            </div>
            <div className="space-y-4">
              {recommendations.map((rec, idx) => {
                const Icon = rec.icon || Info;
                const priorityColors = {
                  high: 'border-red-300 dark:border-red-700 bg-red-50 dark:bg-red-900/20',
                  medium: 'border-yellow-300 dark:border-yellow-700 bg-yellow-50 dark:bg-yellow-900/20',
                  low: 'border-blue-300 dark:border-blue-700 bg-blue-50 dark:bg-blue-900/20'
                };
                return (
                  <div
                    key={idx}
                    className={`p-4 rounded-lg border-2 ${priorityColors[rec.priority] || priorityColors.medium}`}
                  >
                    <div className="flex items-start gap-3">
                      <Icon className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
                        rec.priority === 'high' ? 'text-red-600 dark:text-red-400' :
                        rec.priority === 'medium' ? 'text-yellow-600 dark:text-yellow-400' :
                        'text-blue-600 dark:text-blue-400'
                      }`} />
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                          {rec.title}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                          {rec.description}
                        </p>
                        {rec.services && rec.services.length > 0 && (
                          <div className="mb-2">
                            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Services:</p>
                            <div className="flex flex-wrap gap-1">
                              {rec.services.map((serviceName, i) => (
                                <span
                                  key={i}
                                  className="px-2 py-0.5 text-xs rounded bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                                >
                                  {serviceName}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                        {rec.action && (
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            💡 {rec.action}
                          </p>
                        )}
                        {rec.potentialReduction > 0 && (
                          <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                            Potential reduction: -{rec.potentialReduction} points
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Optional Persona Integration */}
        {persona && persona.primary && (
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl p-6 mb-6 border-2 border-blue-200 dark:border-blue-800">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900/30">
                <Users className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                  Personalized Insights for {PersonaProfiles[persona.primary]?.name || 'Your Persona'}
                </h3>
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  Based on your privacy persona, here are specific recommendations tailored to your digital habits.
                </p>
                <button
                  onClick={() => navigate('/dashboard')}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center gap-2"
                >
                  View Full Dashboard
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Smart Personalization Prompts */}
        {!persona && (
          <PersonalizationPrompt
            trigger="exposure-viewed"
            servicesCount={selectedServices.length}
          />
        )}
        
        {persona && !assessmentResults && (
          <PersonalizationPrompt
            trigger="persona-selected"
            servicesCount={selectedServices.length}
          />
        )}

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-4 justify-center">
          <button
            onClick={() => navigate('/service-catalog')}
            className="px-6 py-3 bg-white dark:bg-slate-800 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors font-medium flex items-center gap-2"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Services Monitoring
          </button>
          {persona && (
            <button
              onClick={() => navigate('/dashboard')}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all font-medium flex items-center gap-2"
            >
              View Full Dashboard
              <ArrowRight className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExposureIndexDashboard;

