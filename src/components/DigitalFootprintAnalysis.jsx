import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Activity, Shield, AlertTriangle, TrendingDown, TrendingUp, Globe, Users, ShoppingCart, MessageCircle, Film, Database, BarChart3, Target, ArrowRight, ExternalLink, Gauge, Info } from 'lucide-react';
import { serviceCatalog } from '../data/serviceCatalog';
import { serviceRiskProfiles } from '../data/serviceRiskProfiles';
import { getToolsByService } from '../data/tools.js';
import { analytics } from '../utils/analytics.js';
import { calculatePrivacyExposureIndex, getExposureLevel } from '../utils/privacyExposureIndex';
import { calculateDigitalFootprintFromServices } from '../utils/digitalFootprintCalculator';

const DigitalFootprintAnalysis = ({ assessmentResults, selectedServices, persona }) => {
  const navigate = useNavigate();

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
    return icons[category] || Activity;
  };

  const formatCategoryLabel = (category) => {
    return category.split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  // Analyze footprint data using combined features usage results
  const footprintData = useMemo(() => {
    if (!assessmentResults && (!selectedServices || selectedServices.length === 0)) {
      return null;
    }

    const exposureResults = assessmentResults?.exposureResults || {};
    const rightsResults = assessmentResults?.rightsResults || {};
    const exposureScore = assessmentResults?.exposureScore || 0;
    const rightsScore = assessmentResults?.rightsScore || 0;

    // Use the calculator utility for combined features usage results summary report
    const digitalFootprintReport = calculateDigitalFootprintFromServices(selectedServices || [], assessmentResults);
    
    // Service analysis
    const services = selectedServices || [];
    const serviceCategories = {};
    const serviceRisks = [];

    // Build service risks from the report
    digitalFootprintReport.services.forEach(serviceEval => {
      const service = serviceCatalog.find(s => s.id === serviceEval.serviceId);
      if (service) {
        const category = service.category || 'other';
        serviceCategories[category] = (serviceCategories[category] || 0) + 1;
        
        serviceRisks.push({
          id: serviceEval.serviceId,
          name: serviceEval.serviceName,
          category: category,
          riskLevel: serviceEval.riskCount,
          risks: serviceEval.typicalRisks || [],
          exposureIndex: serviceEval.exposureIndex,
          exposureLevel: getExposureLevel(serviceEval.exposureIndex)
        });
      }
    });
    
    // Get average exposure index from report
    const averageExposureIndex = digitalFootprintReport.averageExposureIndex;
    const averageExposureLevel = getExposureLevel(averageExposureIndex);

    // Social footprint analysis
    const socialFootprint = {
      usage: exposureResults.socialMediaUse || 'unknown',
      sharing: exposureResults.publicSharing || 'unknown',
      riskLevel: 'moderate'
    };

    if (socialFootprint.usage === 'heavy' || socialFootprint.usage === 'daily') {
      socialFootprint.riskLevel = 'high';
    } else if (socialFootprint.usage === 'never') {
      socialFootprint.riskLevel = 'low';
    }

    if (socialFootprint.sharing === 'everything' || socialFootprint.sharing === 'frequently') {
      socialFootprint.riskLevel = 'high';
    }

    // Data exposure analysis
    const dataExposure = {
      passwordManagement: exposureResults.passwordManagement || 'unknown',
      dataSharing: exposureResults.dataSharing || 'unknown',
      deviceSecurity: exposureResults.deviceSecurity || 'unknown',
      publicWiFi: exposureResults.publicWiFi || 'unknown',
      riskScore: 0
    };

    // Calculate data exposure risk
    if (dataExposure.passwordManagement === 'same' || dataExposure.passwordManagement === 'variations') {
      dataExposure.riskScore += 25;
    }
    if (dataExposure.dataSharing === 'noReview' || dataExposure.dataSharing === 'quickReview') {
      dataExposure.riskScore += 15;
    }
    if (dataExposure.deviceSecurity === 'minimal' || dataExposure.deviceSecurity === 'basic') {
      dataExposure.riskScore += 15;
    }
    if (dataExposure.publicWiFi === 'frequent' || dataExposure.publicWiFi === 'occasional') {
      dataExposure.riskScore += 10;
    }

    // Overall footprint score from the calculator (uses combined features usage results)
    const footprintScore = digitalFootprintReport.score;

    // Category breakdown from report
    const categoryBreakdown = digitalFootprintReport.categoryBreakdown.map(cat => ({
      category: cat.category,
      count: cat.count,
      icon: getCategoryIcon(cat.category),
      label: formatCategoryLabel(cat.category)
    }));

    // Generate recommendations
    const recommendations = generateRecommendations(
      exposureResults,
      rightsResults,
      services,
      serviceRisks,
      socialFootprint,
      dataExposure
    );

    return {
      footprintScore,
      totalServices: services.length,
      serviceCategories: categoryBreakdown,
      serviceRisks: serviceRisks.sort((a, b) => {
        // Sort by exposure index first (highest first), then by risk level
        const exposureA = a.exposureIndex || 0;
        const exposureB = b.exposureIndex || 0;
        if (exposureB !== exposureA) {
          return exposureB - exposureA;
        }
        return b.riskLevel - a.riskLevel;
      }),
      socialFootprint,
      dataExposure,
      exposureScore,
      rightsScore,
      recommendations,
      overallRisk: digitalFootprintReport.riskLevel,
      averageExposureIndex,
      averageExposureLevel,
      breakdown: digitalFootprintReport.breakdown // Include breakdown from calculator
    };
  }, [assessmentResults, selectedServices, persona]);

  const generateRecommendations = (exposureResults, rightsResults, services, serviceRisks, socialFootprint, dataExposure) => {
    const recommendations = [];

    // High-risk service recommendations
    const highRiskServices = serviceRisks.filter(s => s.riskLevel >= 3).slice(0, 3);
    if (highRiskServices.length > 0) {
      recommendations.push({
        type: 'service',
        priority: 'high',
        title: 'Review High-Risk Services',
        description: `You're using ${highRiskServices.length} service(s) with significant privacy risks. Review their privacy settings and consider data minimization.`,
        services: highRiskServices.map(s => s.name),
        action: { label: 'View Services Monitoring', url: '/service-catalog' }
      });
    }

    // Social footprint recommendations
    if (socialFootprint.riskLevel === 'high') {
      recommendations.push({
        type: 'social',
        priority: 'high',
        title: 'Reduce Social Media Exposure',
        description: 'Your social media usage and sharing patterns create a large digital footprint. Consider reducing public sharing and reviewing privacy settings.',
        action: { label: 'Social Media Privacy Guide', url: '/toolkit-access' }
      });
    }

    // Data exposure recommendations
    if (dataExposure.riskScore >= 30) {
      recommendations.push({
        type: 'security',
        priority: 'high',
        title: 'Improve Security Practices',
        description: 'Your password management, device security, or data sharing practices increase your exposure risk.',
        action: { label: 'Security Tools', url: '/toolkit-access' }
      });
    }

    // Service count recommendations
    if (services.length > 10) {
      recommendations.push({
        type: 'minimization',
        priority: 'moderate',
        title: 'Consider Service Consolidation',
        description: `You're using ${services.length} services, which increases your digital footprint. Consider consolidating or removing unused accounts.`,
        action: { label: 'Review Services', url: '/service-catalog' }
      });
    }

    // Rights exercise recommendations
    if (rightsResults && assessmentResults?.rightsScore < 50) {
      recommendations.push({
        type: 'rights',
        priority: 'moderate',
        title: 'Exercise Your Privacy Rights',
        description: 'You can reduce your digital footprint by exercising your rights to access, delete, or limit data collection.',
        action: { label: 'Privacy Rights Tools', url: '/toolkit-access' }
      });
    }

    return recommendations;
  };

  if (!footprintData) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 p-8 text-center">
          <Activity className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Digital Footprint Analysis
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            To get your digital footprint analysis, please complete a privacy assessment and add services to your Services Monitoring.
          </p>
          <div className="bg-purple-50 dark:bg-purple-900/20 border-l-4 border-purple-500 p-3 mb-6 rounded-r">
            <p className="text-xs text-purple-900 dark:text-purple-200">
              <strong>What is Digital Footprint Score?</strong> Your personal privacy exposure score calculated from the Service Exposure Indices 
              of services you use. This is different from individual Service Exposure Indices shown for each service in the catalog.
            </p>
          </div>
          <div className="flex gap-4 justify-center">
            <button
              onClick={() => navigate('/assessment/full')}
              className="px-6 py-3 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors font-medium flex items-center gap-2"
            >
              Complete Assessment
              <ArrowRight className="w-5 h-5" />
            </button>
            <button
              onClick={() => navigate('/service-catalog')}
              className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors font-medium"
            >
              Add Services
            </button>
          </div>
        </div>
      </div>
    );
  }

  const { footprintScore, totalServices, serviceCategories, serviceRisks, socialFootprint, dataExposure, recommendations, overallRisk, averageExposureIndex, averageExposureLevel } = footprintData;

  const riskColor = overallRisk === 'high' ? 'red' : overallRisk === 'moderate' ? 'yellow' : 'green';
  const riskBgColor = overallRisk === 'high' ? 'bg-red-100 dark:bg-red-900/30' : overallRisk === 'moderate' ? 'bg-yellow-100 dark:bg-yellow-900/30' : 'bg-green-100 dark:bg-green-900/30';
  const riskTextColor = overallRisk === 'high' ? 'text-red-700 dark:text-red-400' : overallRisk === 'moderate' ? 'text-yellow-700 dark:text-yellow-400' : 'text-green-700 dark:text-green-400';

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Digital Privacy Footprint Analysis
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Comprehensive analysis combining your service Exposure Indices with assessment data
            </p>
            <div className="bg-purple-50 dark:bg-purple-900/20 border-l-4 border-purple-500 p-3 mt-3 rounded-r">
              <p className="text-xs text-purple-900 dark:text-purple-200">
                <strong>Understanding the Terms:</strong> Each service has a <strong>Service Exposure Index</strong> (0-100) shown in the catalog. 
                Your <strong>Digital Footprint Score</strong> is calculated from these service indices. The <strong>Combined Exposure Index</strong> 
                combines your assessment (60%) with your digital footprint (40%).
              </p>
            </div>
            {selectedServices && selectedServices.length > 0 && (
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Based on {selectedServices.length} service{selectedServices.length !== 1 ? 's' : ''} from your Services Monitoring
              </p>
            )}
          </div>
          <button
            onClick={() => navigate('/dashboard')}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
          >
            Back to Dashboard
          </button>
        </div>
      </div>

      {/* Overall Footprint Score */}
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 p-6 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
              Your Digital Footprint Score
              <span className="text-sm font-normal text-gray-500 dark:text-gray-400" title="Aggregate score (0-100, higher = more risk) calculated from your selected services' Privacy Exposure Indices. This is different from individual Service Exposure Indices shown in the catalog.">
                ℹ️
              </span>
            </h2>
            <div className="bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500 p-3 mb-3 rounded-r">
              <p className="text-xs text-blue-900 dark:text-blue-200">
                <strong>Understanding Your Score:</strong> This is your <strong>personal Digital Footprint Score</strong> (0-100, higher = more risk) calculated from your selected services' Privacy Exposure Indices. 
                Individual services have their own <strong>Service Exposure Index</strong> scores shown in Services Monitoring. 
                This score contributes 40% to your Combined Risk Score.
              </p>
            </div>
            <p className="text-gray-600 dark:text-gray-300 mb-2">
              {footprintScore >= 70 
                ? 'Your digital footprint is large. Consider taking action to reduce your online exposure.'
                : footprintScore >= 40
                ? 'Your digital footprint is moderate. There are opportunities to reduce your exposure.'
                : 'Your digital footprint is relatively small. Keep up the good privacy practices!'}
            </p>
            {averageExposureIndex !== null && (
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Average Service Exposure Index: <span className="font-medium">{averageExposureIndex}/100</span> ({averageExposureLevel.level})
              </p>
            )}
          </div>
          <div className="text-center">
            <div className={`text-5xl font-bold ${riskTextColor} mb-2`}>
              {footprintScore}
            </div>
            <div className={`px-4 py-2 rounded-full ${riskBgColor} ${riskTextColor} font-medium text-sm`}>
              {overallRisk.toUpperCase()} FOOTPRINT
            </div>
          </div>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 p-4">
          <div className="flex items-center justify-between mb-2">
            <Globe className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <span className="text-2xl font-bold text-gray-900 dark:text-white">{totalServices}</span>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-300">Services Tracked</p>
        </div>
        {averageExposureIndex !== null && (
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 p-4">
            <div className="flex items-center justify-between mb-2">
              <Gauge className={`w-5 h-5 ${averageExposureLevel.textColor}`} />
              <span className={`text-2xl font-bold ${averageExposureLevel.textColor}`}>
                {averageExposureIndex}
              </span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-300">Avg. Exposure Index</p>
            <p className={`text-xs mt-1 ${averageExposureLevel.textColor} font-medium`}>
              {averageExposureLevel.level}
            </p>
          </div>
        )}
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 p-4">
          <div className="flex items-center justify-between mb-2">
            <Activity className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            <span className="text-2xl font-bold text-gray-900 dark:text-white">{100 - footprintData.exposureScore}</span>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-300">Exposure Risk</p>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 p-4">
          <div className="flex items-center justify-between mb-2">
            <Users className="w-5 h-5 text-pink-600 dark:text-pink-400" />
            <span className="text-2xl font-bold text-gray-900 dark:text-white capitalize">{socialFootprint.usage}</span>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-300">Social Media Use</p>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 p-4">
          <div className="flex items-center justify-between mb-2">
            <Shield className="w-5 h-5 text-green-600 dark:text-green-400" />
            <span className="text-2xl font-bold text-gray-900 dark:text-white">{footprintData.rightsScore}</span>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-300">Rights Exercise Score</p>
        </div>
      </div>

      {/* Relationship Explanation */}
      {selectedServices && selectedServices.length > 0 && (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl shadow-sm border border-blue-200 dark:border-blue-800 p-6 mb-6">
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                How This Analysis Works
              </h3>
              <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
                Your Digital Privacy Footprint Score combines:
              </p>
              <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1 list-disc list-inside mb-3">
                <li>Individual service <strong>Privacy Exposure Indices</strong> from your Services Monitoring</li>
                <li>Your privacy assessment results (exposure and rights scores)</li>
                <li>Service category breakdown and risk analysis</li>
                <li>Social media usage and data sharing patterns</li>
              </ul>
              <button
                onClick={() => navigate('/service-catalog')}
                className="text-sm text-blue-600 dark:text-blue-400 hover:underline font-medium flex items-center gap-1"
              >
                View individual service exposure indices →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Service Categories */}
      {serviceCategories.length > 0 && (
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 p-6 mb-6">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <BarChart3 className="w-6 h-6" />
            Services by Category
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {serviceCategories.map((cat) => {
              const Icon = getCategoryIcon(cat.category);
              return (
                <div key={cat.category} className="text-center p-4 bg-gray-50 dark:bg-slate-700 rounded-lg">
                  <Icon className="w-8 h-8 mx-auto mb-2 text-gray-600 dark:text-gray-400" />
                  <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">{cat.count}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">{cat.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* High-Risk Services */}
      {serviceRisks.length > 0 && (
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 p-6 mb-6">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <AlertTriangle className="w-6 h-6 text-red-600 dark:text-red-400" />
            High-Risk Services
          </h3>
          <div className="space-y-3">
            {serviceRisks.slice(0, 5).map((service) => (
              <div key={service.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-slate-700 rounded-lg">
                <div className="flex-1">
                  <div className="font-semibold text-gray-900 dark:text-white">{service.name}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">
                    {service.risks.length} known privacy risks
                    {service.exposureIndex !== null && (
                      <span className={`ml-2 font-medium ${service.exposureLevel.textColor}`}>
                        • Exposure: {service.exposureIndex}/100
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {service.exposureIndex !== null && (
                    <div className="flex items-center gap-1">
                      <Gauge className={`w-4 h-4 ${service.exposureLevel.textColor}`} />
                      <span className={`text-xs font-medium ${service.exposureLevel.textColor}`}>
                        {service.exposureIndex}
                      </span>
                    </div>
                  )}
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    service.riskLevel >= 3 ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
                    service.riskLevel >= 2 ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' :
                    'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                  }`}>
                    {service.riskLevel >= 3 ? 'High Risk' : service.riskLevel >= 2 ? 'Moderate' : 'Low Risk'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recommendations */}
      {recommendations.length > 0 && (
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 p-6 mb-6">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <Target className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            Personalized Recommendations
          </h3>
          <div className="space-y-4">
            {recommendations.map((rec, index) => (
              <div key={index} className={`p-4 rounded-lg border-l-4 ${
                rec.priority === 'high' 
                  ? 'bg-red-50 dark:bg-red-900/20 border-red-500' 
                  : 'bg-blue-50 dark:bg-blue-900/20 border-blue-500'
              }`}>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-1">{rec.title}</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">{rec.description}</p>
                    {rec.services && (
                      <div className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                        Services: {rec.services.join(', ')}
                      </div>
                    )}
                    {rec.action && (
                      <button
                        onClick={() => navigate(rec.action.url)}
                        className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
                      >
                        {rec.action.label}
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-4">
        <button
          onClick={() => navigate('/toolkit-access')}
          className="flex-1 px-6 py-3 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors font-medium flex items-center justify-center gap-2"
        >
          View Privacy Tools
          <ExternalLink className="w-5 h-5" />
        </button>
        <button
          onClick={() => navigate('/service-catalog')}
          className="flex-1 px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors font-medium"
        >
          Manage Services
        </button>
      </div>
    </div>
  );
};

export default DigitalFootprintAnalysis;

