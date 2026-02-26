import React, { useContext } from 'react';
import { AlertTriangle, RefreshCw, Home, Mail } from 'lucide-react';
import { MonitoringService } from '../../utils/monitoring.jsx';
import * as Sentry from '@sentry/react';
import { TranslationContext } from '../../contexts/TranslationContext';

// Functional component for error UI that can use translations
const ErrorUI = ({ error, errorInfo, errorId, userFeedback, feedbackSent, retryCount, onRetry, onReload, onGoHome, onFeedbackChange, onFeedbackSubmit }) => {
  const translationContext = useContext(TranslationContext);
  const getTranslation = (key, params = {}) => {
    if (translationContext && translationContext.t) {
      return translationContext.t(key, params);
    }
    // Fallback translations
    const fallbacks = {
      'errorBoundary.title': 'Something went wrong',
      'errorBoundary.description.production': "We've encountered an unexpected error. Our team has been automatically notified.",
      'errorBoundary.description.development': 'A technical error occurred while loading this page.',
      'errorBoundary.errorId': 'Error ID:',
      'errorBoundary.feedbackLabel': 'Help us improve (optional):',
      'errorBoundary.feedbackPlaceholder': 'What were you trying to do when this error occurred?',
      'errorBoundary.sendFeedback': 'Send Feedback',
      'errorBoundary.feedbackThankYou': 'Thank you for your feedback! It helps us improve the app.',
      'errorBoundary.tryAgain': 'Try Again',
      'errorBoundary.reload': 'Reload',
      'errorBoundary.home': 'Home',
      'errorBoundary.needHelp': 'Need help? Contact',
      'errorBoundary.support': 'support',
      'errorBoundary.developerDetails': 'Developer Error Details',
      'errorBoundary.error': 'Error:',
      'errorBoundary.componentStack': 'Component Stack:'
    };
    const fallback = fallbacks[key] || key.split('.').pop();
    return fallback.replace(/\{\{(\w+)\}\}/g, (match, param) => {
      return params[param] !== undefined ? params[param] : match;
    });
  };
  const t = getTranslation;
  const isProductionError = import.meta.env.PROD;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 flex items-center justify-center p-4">
      <div className="max-w-lg w-full">
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-gray-200 dark:border-slate-700 p-8">
          {/* Error Icon */}
          <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertTriangle className="w-8 h-8 text-red-500" />
          </div>
          
          {/* Error Title */}
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white text-center mb-3">
            {t('errorBoundary.title')}
          </h1>
          
          {/* Error Description */}
          <p className="text-gray-600 dark:text-gray-300 text-center mb-6">
            {isProductionError 
              ? t('errorBoundary.description.production')
              : t('errorBoundary.description.development')
            }
          </p>

          {/* Error ID for Support */}
          {errorId && (
            <div className="bg-gray-100 dark:bg-slate-700 rounded-lg p-3 mb-6">
              <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                {t('errorBoundary.errorId')} <code className="font-mono">{errorId}</code>
              </p>
            </div>
          )}

          {/* User Feedback Section */}
          {isProductionError && !feedbackSent && (
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t('errorBoundary.feedbackLabel')}
              </label>
              <textarea
                value={userFeedback}
                onChange={(e) => onFeedbackChange(e.target.value)}
                placeholder={t('errorBoundary.feedbackPlaceholder')}
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white resize-none"
                rows={3}
                maxLength={500}
              />
              <button
                onClick={onFeedbackSubmit}
                disabled={!userFeedback.trim()}
                className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed text-sm transition-colors"
              >
                {t('errorBoundary.sendFeedback')}
              </button>
            </div>
          )}

          {feedbackSent && (
            <div className="mb-6 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
              <p className="text-green-800 dark:text-green-200 text-sm text-center">
                {t('errorBoundary.feedbackThankYou')}
              </p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="space-y-3">
            {retryCount < 3 && (
              <button
                onClick={onRetry}
                className="w-full px-4 py-3 bg-red-500 text-white font-medium rounded-lg hover:bg-red-600 transition-colors flex items-center justify-center"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                {t('errorBoundary.tryAgain')}
              </button>
            )}
            
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={onReload}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors flex items-center justify-center"
              >
                <RefreshCw className="w-4 h-4 mr-1" />
                {t('errorBoundary.reload')}
              </button>
              
              <button
                onClick={onGoHome}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors flex items-center justify-center"
              >
                <Home className="w-4 h-4 mr-1" />
                {t('errorBoundary.home')}
              </button>
            </div>
          </div>

          {/* Support Contact */}
          <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700 text-center">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {t('errorBoundary.needHelp')}{' '}
              <a 
                href={`mailto:${import.meta.env.VITE_REACT_APP_SUPPORT_EMAIL || 'support@ermits.com'}?subject=Error%20Report%20${errorId}`}
                className="text-red-500 hover:text-red-600 underline inline-flex items-center"
              >
                <Mail className="w-3 h-3 mr-1" />
                {t('errorBoundary.support')}
              </a>
            </p>
          </div>

          {/* Development Error Details */}
          {!isProductionError && error && (
            <details className="mt-6 text-left">
              <summary className="text-sm text-gray-500 cursor-pointer hover:text-gray-700 dark:hover:text-gray-300 font-medium">
                {t('errorBoundary.developerDetails')}
              </summary>
              <div className="mt-3 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                <pre className="text-xs text-red-800 dark:text-red-200 overflow-auto whitespace-pre-wrap">
                  <strong>{t('errorBoundary.error')}</strong> {error.toString()}
                  {errorInfo?.componentStack && (
                    <>
                      <br /><br />
                      <strong>{t('errorBoundary.componentStack')}</strong>
                      {errorInfo.componentStack}
                    </>
                  )}
                </pre>
              </div>
            </details>
          )}
        </div>
      </div>
    </div>
  );
};

class ProductionErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: null,
      userFeedback: '',
      feedbackSent: false,
      retryCount: 0
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    const errorId = Date.now().toString(36);
    
    this.setState({
      error,
      errorInfo,
      errorId
    });

    // Log to monitoring service
    MonitoringService.logBusinessMetric('error_boundary_triggered', 1, {
      error_message: error.message,
      component_stack: errorInfo.componentStack,
      error_id: errorId,
      retry_count: this.state.retryCount
    });

    // Send to Sentry if available
    if (typeof Sentry !== 'undefined') {
      Sentry.withScope((scope) => {
        scope.setTag('errorBoundary', true);
        scope.setTag('errorId', errorId);
        scope.setLevel('error');
        scope.setContext('errorInfo', errorInfo);
        Sentry.captureException(error);
      });
    }
  }

  handleRetry = () => {
    this.setState(prevState => ({
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: null,
      retryCount: prevState.retryCount + 1
    }));
    
    // Log retry attempt
    MonitoringService.logBusinessMetric('error_recovery_attempt', 1, {
      retry_count: this.state.retryCount + 1
    });
  };

  handleReload = () => {
    MonitoringService.logBusinessMetric('error_page_reload', 1);
    window.location.reload();
  };

  handleGoHome = () => {
    MonitoringService.logBusinessMetric('error_navigate_home', 1);
    window.location.href = '/';
  };

  handleFeedbackSubmit = async () => {
    if (!this.state.userFeedback.trim()) return;

    try {
      // In a real app, send feedback to your backend
      MonitoringService.logBusinessMetric('error_user_feedback', 1, {
        error_id: this.state.errorId,
        feedback_length: this.state.userFeedback.length
      });

      this.setState({ feedbackSent: true });
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error('Failed to send feedback:', error);
      }
    }
  };

  render() {
    if (this.state.hasError) {
      return (
        <ErrorUI
          error={this.state.error}
          errorInfo={this.state.errorInfo}
          errorId={this.state.errorId}
          userFeedback={this.state.userFeedback}
          feedbackSent={this.state.feedbackSent}
          retryCount={this.state.retryCount}
          onRetry={this.handleRetry}
          onReload={this.handleReload}
          onGoHome={this.handleGoHome}
          onFeedbackChange={(value) => this.setState({ userFeedback: value })}
          onFeedbackSubmit={this.handleFeedbackSubmit}
        />
      );
    }

    return this.props.children;
  }
}

export default ProductionErrorBoundary;