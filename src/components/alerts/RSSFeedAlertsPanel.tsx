// RSS Feed Alert Display Component
// Shows real-time security alerts from open-source RSS feeds with AI phishing detection

import React, { useState, useEffect } from 'react';
import { Rss, RefreshCw, AlertTriangle, Shield, Clock } from 'lucide-react';
import { rssAlertService } from '../../services/rssAlertService';
import { useCautionStore } from '../../state/cautionStore';

export const RSSFeedAlertsPanel: React.FC = () => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [serviceStatus, setServiceStatus] = useState(rssAlertService.getStatus());
  const alerts = useCautionStore((state) => state.alerts);
  
  // Filter for RSS-sourced alerts (from service_monitor source)
  const rssAlerts = alerts.filter(alert => alert.source === 'service_monitor').slice(0, 10);
  
  // Update service status periodically
  useEffect(() => {
    const interval = setInterval(() => {
      setServiceStatus(rssAlertService.getStatus());
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await rssAlertService.processNow();
    } catch (error) {
      console.error('Error refreshing feeds:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  const activeFeeds = getActiveFeeds();

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Rss className="h-5 w-5 text-orange-600 mr-2" />
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              Live Security Alerts
            </h3>
            <p className="text-xs text-gray-500">
              Real-time from {activeFeeds.length} open-source security feeds
            </p>
          </div>
        </div>
        <button
          onClick={handleRefresh}
          disabled={isRefreshing || serviceStatus.isProcessing}
          className={`inline-flex items-center px-3 py-2 rounded-lg text-sm font-medium ${
            isRefreshing || serviceStatus.isProcessing
              ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
              : 'bg-orange-600 text-white hover:bg-orange-700'
          }`}
        >
          <RefreshCw
            className={`h-4 w-4 mr-2 ${
              (isRefreshing || serviceStatus.isProcessing) ? 'animate-spin' : ''
            }`}
          />
          {isRefreshing || serviceStatus.isProcessing ? 'Updating...' : 'Refresh'}
        </button>
      </div>

      {/* Status Info */}
      <div className="flex items-center text-xs text-gray-600 space-x-4">
        <div className="flex items-center">
          <Clock className="h-3 w-3 mr-1" />
          Last updated:{' '}
          {serviceStatus.lastProcessed
            ? new Date(serviceStatus.lastProcessed).toLocaleTimeString()
            : 'Never'}
        </div>
        <div className="flex items-center">
          <Shield className="h-3 w-3 mr-1" />
          {rssAlerts.length} alerts
        </div>
      </div>

      {/* Alert List */}
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {rssAlerts.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Rss className="h-12 w-12 mx-auto mb-3 text-gray-300" />
            <p className="text-sm">No alerts yet. Click refresh to load feeds.</p>
          </div>
        ) : (
          rssAlerts.map((alert) => (
            <div
              key={alert.id}
              className={`border rounded-lg p-4 hover:shadow-md transition-shadow ${
                alert.severity === 'critical'
                  ? 'border-red-200 bg-red-50'
                  : alert.severity === 'high'
                  ? 'border-orange-200 bg-orange-50'
                  : alert.severity === 'warning'
                  ? 'border-yellow-200 bg-yellow-50'
                  : 'border-gray-200 bg-gray-50'
              }`}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center space-x-2">
                  {/* Severity Badge */}
                  <span
                    className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                      alert.severity === 'critical'
                        ? 'bg-red-100 text-red-700'
                        : alert.severity === 'high'
                        ? 'bg-orange-100 text-orange-700'
                        : alert.severity === 'warning'
                        ? 'bg-yellow-100 text-yellow-700'
                        : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    {alert.severity.toUpperCase()}
                  </span>

                  {/* AI Threat Badge */}
                  {alert.category === 'ai_threat' && (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 text-xs font-medium">
                      <AlertTriangle className="h-3 w-3 mr-1" />
                      AI Verified
                    </span>
                  )}

                  {/* Risk Score */}
                  {alert.riskScore !== undefined && alert.riskScore >= 50 && (
                    <span className="text-xs text-gray-600">
                      Risk: {alert.riskScore}%
                    </span>
                  )}
                </div>

                <span className="text-xs text-gray-500">
                  {new Date(alert.createdAt).toLocaleDateString()}
                </span>
              </div>

              {/* Alert Title */}
              <h4 className="font-semibold text-sm text-gray-900 mb-1">
                {alert.title}
              </h4>

              {/* Alert Message */}
              <p className="text-xs text-gray-700 mb-2 line-clamp-2">
                {alert.message}
              </p>

              {/* AI Evidence */}
              {alert.evidence && alert.evidence.length > 0 && (
                <details className="mt-2">
                  <summary className="text-xs text-purple-600 cursor-pointer hover:text-purple-700">
                    View AI detection details
                  </summary>
                  <ul className="list-disc list-inside text-xs text-gray-600 mt-1 ml-2">
                    {alert.evidence.map((e, i) => (
                      <li key={i}>{e}</li>
                    ))}
                  </ul>
                </details>
              )}

              {/* Service Badge */}
              {alert.serviceName && (
                <div className="mt-2">
                  <span className="inline-block px-2 py-1 rounded bg-blue-50 text-blue-700 text-xs">
                    {alert.serviceName}
                  </span>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Footer - Sources */}
      <div className="border-t pt-3 mt-3">
        <p className="text-xs text-gray-500 mb-2">Active sources:</p>
        <div className="flex flex-wrap gap-2">
          {activeFeeds.slice(0, 6).map((feed) => (
            <span
              key={feed.id}
              className="inline-flex items-center px-2 py-1 rounded-full bg-gray-100 text-gray-700 text-xs"
            >
              <Rss className="h-3 w-3 mr-1" />
              {feed.name}
            </span>
          ))}
          {activeFeeds.length > 6 && (
            <span className="inline-flex items-center px-2 py-1 rounded-full bg-gray-100 text-gray-700 text-xs">
              +{activeFeeds.length - 6} more
            </span>
          )}
        </div>
      </div>

      {/* Disclaimer */}
      <p className="text-xs text-gray-500 italic border-t pt-2">
        Alerts aggregated from trusted open-source security feeds including CISA, Have I Been
        Pwned, FTC, EFF, and others. AI-enhanced phishing detection applied automatically.
      </p>
    </div>
  );
};

