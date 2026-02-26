import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bookmark, BookmarkCheck, Trash2, ExternalLink, Download, AlertCircle, Shield, TrendingUp } from 'lucide-react';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { serviceCatalog } from '../../data/serviceCatalog';
import { getAllEnhancedServices, getEnhancedService } from '../../data/serviceCatalogEnhanced';
import { serviceRiskProfiles } from '../../data/serviceRiskProfiles';
import SEOHead from '../common/SEOHead';
import { useTranslation } from '../../contexts/TranslationContext';
import SocialShare from '../common/SocialShare';

const MyServices = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  // Use same localStorage key as ServiceCatalog for consistency
  const [savedServices, setSavedServices] = useLocalStorage('socialcaution_services', []);
  const [persona] = useLocalStorage('socialcaution_persona', null);
  const [servicesData, setServicesData] = useState([]);

  useEffect(() => {
    // Load full service data for saved services (use enhanced catalog)
    const loadedServices = savedServices.map(serviceId => {
      // Try enhanced service first, fallback to basic
      let service = null;
      try {
        service = getEnhancedService(serviceId);
      } catch (error) {
        service = serviceCatalog.find(s => s.id === serviceId);
      }
      if (!service) {
        service = serviceCatalog.find(s => s.id === serviceId);
      }
      const riskProfile = serviceRiskProfiles[serviceId];
      return {
        ...service,
        riskProfile,
        exposureIndex: riskProfile?.exposureIndex || service?.privacy_score || 50 // Use privacy_score from enhanced if available
      };
    }).filter(Boolean);

    setServicesData(loadedServices);
  }, [savedServices]);

  const handleRemoveService = (serviceId) => {
    setSavedServices(prev => prev.filter(id => id !== serviceId));
  };

  const handleViewService = (serviceId) => {
    navigate(`/service-catalog?service=${serviceId}`);
  };

  const calculatePrivacyScore = () => {
    if (servicesData.length === 0) return null;
    
    // Simple calculation: average of exposure indices (inverted for score)
    const avgExposure = servicesData.reduce((sum, s) => sum + (s.exposureIndex || 50), 0) / servicesData.length;
    return Math.round(100 - avgExposure); // Invert: lower exposure = higher score
  };

  const getRiskLevel = (exposureIndex) => {
    if (exposureIndex >= 70) return { level: 'High', color: 'red', bg: 'bg-red-100 dark:bg-red-900/20', text: 'text-red-700 dark:text-red-300' };
    if (exposureIndex >= 40) return { level: 'Moderate', color: 'yellow', bg: 'bg-yellow-100 dark:bg-yellow-900/20', text: 'text-yellow-700 dark:text-yellow-300' };
    return { level: 'Low', color: 'green', bg: 'bg-green-100 dark:bg-green-900/20', text: 'text-green-700 dark:text-green-300' };
  };

  const privacyScore = calculatePrivacyScore();
  const highRiskServices = servicesData.filter(s => (s.exposureIndex || 50) >= 70);
  const moderateRiskServices = servicesData.filter(s => {
    const exp = s.exposureIndex || 50;
    return exp >= 40 && exp < 70;
  });

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 py-12">
      <SEOHead
        title="My Services - SocialCaution"
        description="View and manage your saved services privacy information"
        keywords="my services, saved services, privacy tracking"
      />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="page-title mb-2">
            My Services
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Track and manage privacy information for services you use
          </p>
        </div>

        {savedServices.length === 0 ? (
          /* Empty State */
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-12 text-center">
            <Bookmark className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              No Services Saved Yet
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Start exploring the service catalog and save services you use to track their privacy risks.
            </p>
            <button
              onClick={() => navigate('/service-catalog')}
              className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg transition-colors inline-flex items-center gap-2"
            >
              Explore Services Monitoring
              <ExternalLink className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <>
            {/* Summary Cards */}
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              {/* Privacy Score */}
              {privacyScore !== null && (
                <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl shadow-lg p-6 text-white">
                  <div className="flex items-center justify-between mb-4">
                    <Shield className="w-8 h-8" />
                    <span className="text-3xl font-bold">{privacyScore}</span>
                  </div>
                  <h3 className="font-semibold mb-1">Privacy Exposure Score</h3>
                  <p className="text-sm text-indigo-100">
                    Based on {savedServices.length} service{savedServices.length !== 1 ? 's' : ''} (0-100, higher = more risk)
                  </p>
                </div>
              )}

              {/* High Risk Services */}
              <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 border-l-4 border-red-500">
                <div className="flex items-center gap-3 mb-2">
                  <AlertCircle className="w-6 h-6 text-red-500" />
                  <span className="text-3xl font-bold text-gray-900 dark:text-white">
                    {highRiskServices.length}
                  </span>
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-1">High Risk</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Services needing immediate attention
                </p>
              </div>

              {/* Total Services */}
              <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 border-l-4 border-indigo-500">
                <div className="flex items-center gap-3 mb-2">
                  <BookmarkCheck className="w-6 h-6 text-indigo-500" />
                  <span className="text-3xl font-bold text-gray-900 dark:text-white">
                    {savedServices.length}
                  </span>
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Total Services</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Services in your list
                </p>
              </div>
            </div>

            {/* Services List */}
            <div className="space-y-4">
              {/* High Risk Services First */}
              {highRiskServices.length > 0 && (
                <div className="mb-6">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 text-red-500" />
                    High Risk Services
                  </h2>
                  <div className="space-y-3">
                    {highRiskServices.map((service) => {
                      const risk = getRiskLevel(service.exposureIndex || 50);
                      return (
                        <ServiceCard
                          key={service.id}
                          service={service}
                          risk={risk}
                          onRemove={handleRemoveService}
                          onView={handleViewService}
                        />
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Moderate Risk Services */}
              {moderateRiskServices.length > 0 && (
                <div className="mb-6">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-yellow-500" />
                    Moderate Risk Services
                  </h2>
                  <div className="space-y-3">
                    {moderateRiskServices.map((service) => {
                      const risk = getRiskLevel(service.exposureIndex || 50);
                      return (
                        <ServiceCard
                          key={service.id}
                          service={service}
                          risk={risk}
                          onRemove={handleRemoveService}
                          onView={handleViewService}
                        />
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Low Risk Services */}
              {servicesData.filter(s => {
                const exp = s.exposureIndex || 50;
                return exp < 40;
              }).length > 0 && (
                <div className="mb-6">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                    Low Risk Services
                  </h2>
                  <div className="space-y-3">
                    {servicesData
                      .filter(s => (s.exposureIndex || 50) < 40)
                      .map((service) => {
                        const risk = getRiskLevel(service.exposureIndex || 50);
                        return (
                          <ServiceCard
                            key={service.id}
                            service={service}
                            risk={risk}
                            onRemove={handleRemoveService}
                            onView={handleViewService}
                          />
                        );
                      })}
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

// Service Card Component
const ServiceCard = ({ service, risk, onRemove, onView }) => {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 p-4 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {service.name}
            </h3>
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${risk.bg} ${risk.text}`}>
              {risk.level} Risk
            </span>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2 capitalize">
            {service.category?.replace('-', ' ')}
          </p>
          {service.riskProfile?.typicalRisks && (
            <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
              {service.riskProfile.typicalRisks[0]}
            </p>
          )}
        </div>
        <div className="flex items-center gap-2 ml-4">
          <SocialShare
            type="service"
            data={service}
            className="hidden sm:block"
          />
          <button
            onClick={() => onView(service.id)}
            className="p-2 text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
            aria-label="View service details"
          >
            <ExternalLink className="w-5 h-5" />
          </button>
          <button
            onClick={() => onRemove(service.id)}
            className="p-2 text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
            aria-label="Remove service"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default MyServices;

