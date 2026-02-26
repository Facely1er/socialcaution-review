import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { AlertCircle, RefreshCw, TrendingUp, Shield, BarChart3, Loader2 } from 'lucide-react';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { cautionAlertManager } from '../../utils/cautionAlertManager';
import { useNotifications } from '../common/NotificationSystem';
import AlertFilters from './AlertFilters';
import CautionAlertCard from './CautionAlertCard';
import SEOHead from '../common/SEOHead';
import { useTranslation } from '../../contexts/TranslationContext';
import { PersonaProfiles } from '../../data/personaProfiles';

const CautionAlertFeed = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const { showSuccess, showError, showInfo } = useNotifications();
  const [persona] = useLocalStorage('socialcaution_persona', null);
  const [selectedServices] = useLocalStorage('socialcaution_services', []);

  const [alerts, setAlerts] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filters, setFilters] = useState({
    category: null,
    severity: null,
    serviceId: searchParams.get('service') || null,
    search: null,
    verifiedOnly: null,
    startDate: null,
    endDate: null
  });

  // Load alerts on mount and when filters/persona changes
  useEffect(() => {
    loadAlerts();
  }, [persona, filters]);

  const loadAlerts = () => {
    setLoading(true);
    try {
      const personaId = persona?.primary || persona?.id || persona;
      const filteredAlerts = cautionAlertManager.getAlertsForPersona(personaId, filters);
      setAlerts(filteredAlerts);

      // Load stats
      const alertStats = cautionAlertManager.getAlertStats(personaId);
      setStats(alertStats);
    } catch (error) {
      console.error('Error loading alerts:', error);
      showError('Failed to load alerts. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleResetFilters = () => {
    setFilters({
      category: null,
      severity: null,
      serviceId: null,
      search: null,
      verifiedOnly: null,
      startDate: null,
      endDate: null
    });
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      showInfo('Refreshing alerts from RSS feeds...', { duration: 3000 });
      const result = await cautionAlertManager.refreshAlerts();
      
      if (result.success) {
        loadAlerts();
        showSuccess(
          `Refreshed! ${result.newAlerts} new alert${result.newAlerts !== 1 ? 's' : ''} found.`,
          { duration: 5000 }
        );
      } else {
        showError(result.error || 'Failed to refresh alerts');
      }
    } catch (error) {
      console.error('Error refreshing alerts:', error);
      showError('Failed to refresh alerts. Please try again.');
    } finally {
      setRefreshing(false);
    }
  };

  const handleAlertUpdate = () => {
    // Reload alerts when validation/reporting changes
    loadAlerts();
  };

  const getSeverityConfig = (severity) => {
    const configs = {
      critical: { color: 'text-red-600 dark:text-red-400', bg: 'bg-red-100 dark:bg-red-900/20' },
      high: { color: 'text-orange-600 dark:text-orange-400', bg: 'bg-orange-100 dark:bg-orange-900/20' },
      medium: { color: 'text-yellow-600 dark:text-yellow-400', bg: 'bg-yellow-100 dark:bg-yellow-900/20' },
      low: { color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-100 dark:bg-blue-900/20' }
    };
    return configs[severity] || configs.medium;
  };

  return (
    <>
      <SEOHead
        title="Privacy Alerts - SocialCaution"
        description="Stay informed about the latest privacy threats, data breaches, and security alerts tailored to your privacy persona."
        keywords="privacy alerts, security alerts, data breach notifications, privacy warnings, security updates"
      />
      <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
        <div className="pt-16 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  Privacy Alerts
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                  Stay informed about the latest privacy threats and security alerts
                  {persona && (() => {
                    const personaId = persona?.primary || persona?.id || persona;
                    const personaProfile = typeof personaId === 'string' ? PersonaProfiles[personaId] : null;
                    return personaProfile ? ` for ${t(`personas.${personaId}.name`)}` : ' for your persona';
                  })()}
                </p>
              </div>
              <button
                onClick={handleRefresh}
                disabled={refreshing}
                className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {refreshing ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Refreshing...</span>
                  </>
                ) : (
                  <>
                    <RefreshCw className="h-4 w-4" />
                    <span>Refresh</span>
                  </>
                )}
              </button>
            </div>

            {/* Stats Cards */}
            {stats && (
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-gray-200 dark:border-slate-700 p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <Shield className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Alerts</p>
                  </div>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.total}</p>
                </div>

                <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-gray-200 dark:border-slate-700 p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <TrendingUp className="h-5 w-5 text-green-600 dark:text-green-400" />
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Last 7 Days</p>
                  </div>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.recentCount}</p>
                </div>

                <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-gray-200 dark:border-slate-700 p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Critical</p>
                  </div>
                  <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                    {stats.bySeverity.critical || 0}
                  </p>
                </div>

                <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-gray-200 dark:border-slate-700 p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <BarChart3 className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">High Priority</p>
                  </div>
                  <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                    {stats.bySeverity.high || 0}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Filters */}
          <div className="mb-6">
            <AlertFilters
              filters={filters}
              onFilterChange={handleFilterChange}
              onReset={handleResetFilters}
              selectedServices={selectedServices}
            />
          </div>

          {/* Alerts List */}
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-indigo-600 dark:text-indigo-400" />
            </div>
          ) : alerts.length === 0 ? (
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-gray-200 dark:border-slate-700 p-12 text-center">
              <AlertCircle className="h-12 w-12 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                No alerts found
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                {Object.values(filters).some(f => f !== null)
                  ? 'Try adjusting your filters to see more results.'
                  : 'Check back later for new privacy alerts and security threats.'}
              </p>
              {Object.values(filters).some(f => f !== null) && (
                <button
                  onClick={handleResetFilters}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors"
                >
                  Clear Filters
                </button>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {alerts.map(alert => (
                <CautionAlertCard
                  key={alert.id}
                  alert={alert}
                  onUpdate={handleAlertUpdate}
                />
              ))}
            </div>
          )}
        </div>
        </div>
      </div>
    </>
  );
};

export default CautionAlertFeed;

