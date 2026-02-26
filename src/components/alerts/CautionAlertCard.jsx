import React, { useState } from 'react';
import { ExternalLink, AlertTriangle, Flag, Clock, Tag } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import AlertValidation from './AlertValidation';
import AlertReportModal from './AlertReportModal';
import { getReportCount } from '../../utils/alertReporting';
import { serviceCatalog } from '../../data/serviceCatalog';

const CautionAlertCard = ({ alert, onUpdate }) => {
  const navigate = useNavigate();
  const [showReportModal, setShowReportModal] = useState(false);
  const reportCount = getReportCount(alert.id);

  if (!alert) return null;

  const getSeverityConfig = (severity) => {
    const configs = {
      critical: {
        bg: 'bg-red-100 dark:bg-red-900/20',
        border: 'border-red-500 dark:border-red-400',
        text: 'text-red-700 dark:text-red-300',
        badge: 'bg-red-600 text-white',
        icon: '🚨'
      },
      high: {
        bg: 'bg-orange-100 dark:bg-orange-900/20',
        border: 'border-orange-500 dark:border-orange-400',
        text: 'text-orange-700 dark:text-orange-300',
        badge: 'bg-orange-600 text-white',
        icon: '⚠️'
      },
      medium: {
        bg: 'bg-yellow-100 dark:bg-yellow-900/20',
        border: 'border-yellow-500 dark:border-yellow-400',
        text: 'text-yellow-700 dark:text-yellow-300',
        badge: 'bg-yellow-600 text-white',
        icon: '⚡'
      },
      low: {
        bg: 'bg-blue-100 dark:bg-blue-900/20',
        border: 'border-blue-500 dark:border-blue-400',
        text: 'text-blue-700 dark:text-blue-300',
        badge: 'bg-blue-600 text-white',
        icon: 'ℹ️'
      }
    };
    return configs[severity] || configs.medium;
  };

  const severityConfig = getSeverityConfig(alert.severity);

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffMs = now - date;
      const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
      const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

      if (diffHours < 24) {
        return `${diffHours}h ago`;
      } else if (diffDays < 7) {
        return `${diffDays}d ago`;
      } else {
        return date.toLocaleDateString();
      }
    } catch (error) {
      return 'Date unavailable';
    }
  };

  const handleServiceClick = (serviceId) => {
    navigate(`/service-catalog?service=${serviceId}`);
  };

  return (
    <>
      <div className={`bg-white dark:bg-slate-800 rounded-lg shadow-sm border-l-4 ${severityConfig.border} border-t border-r border-b border-gray-200 dark:border-slate-700 p-6 hover:shadow-md transition-shadow`}>
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-start space-x-3 flex-1">
            {/* Severity Icon */}
            <div className={`flex-shrink-0 w-12 h-12 ${severityConfig.bg} rounded-lg flex items-center justify-center text-2xl`}>
              {severityConfig.icon}
            </div>

            {/* Title and Meta */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2 mb-2 flex-wrap">
                <span className={`px-2 py-1 ${severityConfig.badge} text-xs font-bold rounded`}>
                  {alert.severity.toUpperCase()}
                </span>
                <span className="px-2 py-1 bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 text-xs font-medium rounded capitalize">
                  {alert.category.replace('-', ' ')}
                </span>
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                {alert.title}
              </h3>
              <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                <span className="flex items-center space-x-1">
                  <Clock className="h-4 w-4" />
                  <span>{formatDate(alert.publishedDate)}</span>
                </span>
                {alert.source && (
                  <span>{alert.source.name}</span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Description */}
        <p className="text-gray-700 dark:text-gray-300 mb-4 line-clamp-3">
          {alert.description}
        </p>

        {/* Related Services */}
        {alert.relatedServices && alert.relatedServices.length > 0 && (
          <div className="mb-4">
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">
              Related Services:
            </p>
            <div className="flex flex-wrap gap-2">
              {alert.relatedServices.map(serviceId => {
                const service = serviceCatalog.find(s => s.id === serviceId);
                return service ? (
                  <button
                    key={serviceId}
                    onClick={() => handleServiceClick(serviceId)}
                    className="px-2 py-1 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300 text-xs font-medium rounded hover:bg-indigo-100 dark:hover:bg-indigo-900/30 transition-colors"
                  >
                    {service.name}
                  </button>
                ) : null;
              })}
            </div>
          </div>
        )}

        {/* Tags */}
        {alert.tags && alert.tags.length > 0 && (
          <div className="mb-4 flex flex-wrap gap-2">
            {alert.tags.slice(0, 5).map((tag, index) => (
              <span
                key={index}
                className="flex items-center space-x-1 px-2 py-1 bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-400 text-xs rounded"
              >
                <Tag className="h-3 w-3" />
                <span>#{tag}</span>
              </span>
            ))}
          </div>
        )}

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-slate-700">
          <div className="flex items-center space-x-4">
            <AlertValidation alert={alert} onUpdate={onUpdate} />
            {reportCount > 0 && (
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {reportCount} report{reportCount !== 1 ? 's' : ''}
              </span>
            )}
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={() => setShowReportModal(true)}
              className="flex items-center space-x-1 px-3 py-1.5 text-sm text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
              aria-label="Report alert"
            >
              <Flag className="h-4 w-4" />
              <span>Report</span>
            </button>

            {alert.link && (
              <a
                href={alert.link}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-1 px-3 py-1.5 text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors"
              >
                <span>Read More</span>
                <ExternalLink className="h-4 w-4" />
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Report Modal */}
      <AlertReportModal
        alert={alert}
        isOpen={showReportModal}
        onClose={() => setShowReportModal(false)}
      />
    </>
  );
};

export default CautionAlertCard;

