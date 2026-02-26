import React, { useState, useEffect } from 'react';
import { Star, X, CheckCircle } from 'lucide-react';
import { analytics } from '../../utils/analytics';
import { MonitoringService } from '../../utils/monitoring';
import { useTranslation } from '../../contexts/TranslationContext';

/**
 * Quick Rating Widget
 * Simple 1-5 star rating widget for feature feedback
 * 
 * @param {Object} props
 * @param {string} props.featureName - Name of the feature being rated
 * @param {string} props.context - Context where widget is shown (e.g., 'dashboard', 'service-catalog')
 * @param {number} props.minInteractionTime - Minimum time user must interact before showing (seconds)
 * @param {Function} props.onRatingSubmitted - Callback when rating is submitted
 */
const QuickRatingWidget = ({ 
  featureName, 
  context = 'general',
  minInteractionTime = 30,
  onRatingSubmitted 
}) => {
  const { t } = useTranslation();
  const [isVisible, setIsVisible] = useState(false);
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  // Check if user has already rated this feature
  useEffect(() => {
    const ratingKey = `rating_${featureName}_${context}`;
    const hasRated = localStorage.getItem(ratingKey);
    if (hasRated) {
      return; // Don't show if already rated
    }

    // Check if dismissed for today
    const dismissKey = `rating_dismissed_${featureName}_${new Date().toDateString()}`;
    const wasDismissed = localStorage.getItem(dismissKey);
    if (wasDismissed === 'true') {
      setDismissed(true);
      return;
    }

    // Show widget after minimum interaction time
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, minInteractionTime * 1000);

    return () => clearTimeout(timer);
  }, [featureName, context, minInteractionTime]);

  const handleRating = (selectedRating) => {
    setRating(selectedRating);

    // Track rating
    const ratingData = {
      feature_name: featureName,
      context,
      rating: selectedRating,
      timestamp: new Date().toISOString()
    };

    // Track in analytics
    if (analytics && typeof analytics.trackEvent === 'function') {
      analytics.trackEvent('feature_rated', {
        event_category: 'feedback',
        ...ratingData
      });
    }

    // Track business metric
    if (MonitoringService && typeof MonitoringService.logBusinessMetric === 'function') {
      MonitoringService.logBusinessMetric('feature_rating', selectedRating, {
        feature_name: featureName,
        context
      });
    }

    // Mark as rated
    const ratingKey = `rating_${featureName}_${context}`;
    localStorage.setItem(ratingKey, selectedRating.toString());

    setSubmitted(true);

    // Callback if provided
    if (onRatingSubmitted) {
      onRatingSubmitted(selectedRating, ratingData);
    }

    // Auto-hide after 2 seconds
    setTimeout(() => {
      setIsVisible(false);
    }, 2000);
  };

  const handleDismiss = () => {
    // Mark as dismissed for today
    const dismissKey = `rating_dismissed_${featureName}_${new Date().toDateString()}`;
    localStorage.setItem(dismissKey, 'true');

    // Track dismiss
    if (analytics && typeof analytics.trackEvent === 'function') {
      analytics.trackEvent('rating_widget_dismissed', {
        event_category: 'feedback',
        feature_name: featureName,
        context
      });
    }

    setDismissed(true);
    setIsVisible(false);
  };

  if (!isVisible || dismissed || submitted) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-40 bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-gray-200 dark:border-slate-700 p-4 max-w-xs animate-slide-up">
      {submitted ? (
        <div className="flex items-center text-green-600 dark:text-green-400">
          <CheckCircle className="w-5 h-5 mr-2" />
          <span className="text-sm font-medium">{t('common.rating.thankYou')}</span>
        </div>
      ) : (
        <>
          <div className="flex items-start justify-between mb-3">
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-white mb-1">
                {t('common.rating.howHelpful')}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {t('common.rating.rateFeature', { featureName })}
              </p>
            </div>
            <button
              onClick={handleDismiss}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              aria-label={t('common.rating.dismiss')}
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center justify-center space-x-1 mb-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => handleRating(star)}
                onMouseEnter={() => setHoveredRating(star)}
                onMouseLeave={() => setHoveredRating(0)}
                className="focus:outline-none transition-transform hover:scale-110"
                aria-label={`Rate ${star} star${star !== 1 ? 's' : ''}`}
              >
                <Star
                  className={`w-6 h-6 transition-colors ${
                    star <= (hoveredRating || rating)
                      ? 'text-yellow-400 fill-current'
                      : 'text-gray-300 dark:text-gray-600'
                  }`}
                />
              </button>
            ))}
          </div>

          {rating > 0 && (
            <p className="text-xs text-center text-gray-500 dark:text-gray-400">
              {rating === 5 && 'Excellent!'}
              {rating === 4 && 'Great!'}
              {rating === 3 && 'Good'}
              {rating === 2 && 'Fair'}
              {rating === 1 && 'Needs Improvement'}
            </p>
          )}
        </>
      )}
    </div>
  );
};

export default QuickRatingWidget;

