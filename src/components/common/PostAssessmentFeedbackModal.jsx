import React, { useState, useEffect, useMemo, useContext } from 'react';
import { X, Star, MessageSquare, CheckCircle, Heart } from 'lucide-react';
import { analytics } from '../../utils/analytics';
import { MonitoringService } from '../../utils/monitoring';
import { TranslationContext } from '../../contexts/TranslationContext';

/**
 * Post-Assessment Feedback Modal
 * Shows after user completes an assessment to gather feedback
 * 
 * @param {Object} props
 * @param {string} props.assessmentType - Type of assessment completed ('full', 'exposure', 'rights', 'security')
 * @param {boolean} props.isOpen - Whether modal is open
 * @param {Function} props.onClose - Callback when modal is closed
 * @param {Object} props.assessmentResults - Assessment results data
 */
const PostAssessmentFeedbackModal = ({ 
  assessmentType, 
  isOpen, 
  onClose, 
  assessmentResults = {} 
}) => {
  // Safely get translation context, with fallback
  const translationContext = useContext(TranslationContext);
  const getTranslation = (key, params = {}) => {
    if (translationContext && translationContext.t) {
      return translationContext.t(key, params);
    }
    // Fallback translations if context is not available
    const fallbacks = {
      'feedback.title': 'Share Your Feedback',
      'feedback.description': 'Help us improve by sharing your experience',
      'feedback.closeModal': 'Close',
      'feedback.overallRating': 'Overall Rating',
      'feedback.rateStarSingular': 'Rate {count} star',
      'feedback.rateStarPlural': 'Rate {count} stars',
      'feedback.ratingLabels.1': 'Poor',
      'feedback.ratingLabels.2': 'Fair',
      'feedback.ratingLabels.3': 'Good',
      'feedback.ratingLabels.4': 'Very Good',
      'feedback.ratingLabels.5': 'Excellent',
      'feedback.mostUsefulLabel': 'Most Useful Features',
      'feedback.usefulFeatures.privacyConcerns': 'Privacy Concerns',
      'feedback.usefulFeatures.riskScoring': 'Risk Scoring',
      'feedback.usefulFeatures.actionPlans': 'Action Plans',
      'feedback.usefulFeatures.serviceCatalog': 'Services Monitoring',
      'feedback.usefulFeatures.resources': 'Resources',
      'feedback.usefulFeatures.dashboard': 'Dashboard',
      'feedback.wouldRecommendLabel': 'Would you recommend SocialCaution™ to a friend?',
      'feedback.yes': 'Yes',
      'feedback.no': 'No',
      'feedback.categoryLabel': 'Category',
      'feedback.selectCategory': 'Select a category',
      'feedback.categories.bug': 'Bug Report',
      'feedback.categories.feature': 'Feature Request',
      'feedback.categories.ux': 'User Experience',
      'feedback.categories.content': 'Content',
      'feedback.categories.performance': 'Performance',
      'feedback.categories.general': 'General',
      'feedback.additionalFeedbackLabel': 'Additional Feedback',
      'feedback.additionalFeedbackPlaceholder': 'Tell us more about your experience...',
      'feedback.skip': 'Skip',
      'feedback.submitting': 'Submitting...',
      'feedback.submit': 'Submit',
      'feedback.privacyNote': 'Your feedback is anonymous and helps us improve',
      'feedback.thankYou': 'Thank You!',
      'feedback.thankYouMessage': 'Your feedback has been submitted successfully.'
    };
    const fallback = fallbacks[key] || key.split('.').pop();
    // Simple parameter replacement
    return fallback.replace(/\{\{(\w+)\}\}/g, (match, param) => {
      return params[param] !== undefined ? params[param] : match;
    });
  };
  const t = getTranslation;
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [category, setCategory] = useState('');
  const [mostUseful, setMostUseful] = useState([]);
  const [wouldRecommend, setWouldRecommend] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const feedbackCategories = useMemo(() => [
    { value: 'bug', label: t('feedback.categories.bug') },
    { value: 'feature', label: t('feedback.categories.feature') },
    { value: 'ux', label: t('feedback.categories.ux') },
    { value: 'content', label: t('feedback.categories.content') },
    { value: 'performance', label: t('feedback.categories.performance') },
    { value: 'general', label: t('feedback.categories.general') }
  ], [t]);

  const usefulFeatures = useMemo(() => [
    { value: 'privacy-concerns', label: t('feedback.usefulFeatures.privacyConcerns') },
    { value: 'risk-scoring', label: t('feedback.usefulFeatures.riskScoring') },
    { value: 'action-plans', label: t('feedback.usefulFeatures.actionPlans') },
    { value: 'service-catalog', label: t('feedback.usefulFeatures.serviceCatalog') },
    { value: 'resources', label: t('feedback.usefulFeatures.resources') },
    { value: 'dashboard', label: t('feedback.usefulFeatures.dashboard') }
  ], [t]);

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen && !submitted) {
      setRating(0);
      setFeedback('');
      setCategory('');
      setMostUseful([]);
      setWouldRecommend(null);
      setHoveredRating(0);
    }
  }, [isOpen, submitted]);

  // Check if user has already provided feedback for this assessment
  // Only close if feedback was actually submitted (not just skipped)
  useEffect(() => {
    if (isOpen) {
      const feedbackKey = `feedback_provided_${assessmentType}_${new Date().toDateString()}`;
      const hasProvidedFeedback = localStorage.getItem(feedbackKey);
      
      // Only close if feedback was actually provided (submitted)
      // Don't close if user only skipped - they might want to provide feedback now
      if (hasProvidedFeedback === 'true') {
        // Feedback was already provided today, don't show again
        onClose();
      }
    }
  }, [isOpen, assessmentType, onClose]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (rating === 0) {
      return; // Rating is required
    }

    setIsSubmitting(true);

    try {
      // Track feedback submission
      const feedbackData = {
        assessment_type: assessmentType,
        rating,
        category: category || 'general',
        most_useful: mostUseful,
        would_recommend: wouldRecommend,
        feedback_text: feedback,
        feedback_length: feedback.length,
        timestamp: new Date().toISOString(),
        assessment_results: {
          exposure_score: assessmentResults.exposureScore || 0,
          rights_score: assessmentResults.rightsScore || 0
        }
      };

      // Track in analytics
      if (analytics && typeof analytics.trackEvent === 'function') {
        analytics.trackEvent('feedback_submitted', {
          event_category: 'feedback',
          ...feedbackData
        });
      }

      // Track business metric
      if (MonitoringService && typeof MonitoringService.logBusinessMetric === 'function') {
        MonitoringService.logBusinessMetric('feedback_submission', 1, {
          assessment_type: assessmentType,
          rating,
          category: category || 'general',
          has_text_feedback: feedback.length > 0
        });
      }

      // Try to send to backend if endpoint exists
      try {
        const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || '/api';
        const feedbackEndpoint = `${apiBaseUrl}/feedback`;
        
        await fetch(feedbackEndpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify({
            ...feedbackData,
            source: 'post_assessment_modal',
            user_agent: typeof navigator !== 'undefined' ? navigator.userAgent : 'unknown'
          })
        }).catch(() => {
          // Silently fail if endpoint doesn't exist - feedback is still tracked in analytics
        });
      } catch (error) {
        // Backend submission is optional - analytics tracking is sufficient
        if (import.meta.env.DEV) {
          console.warn('Feedback backend submission failed:', error);
        }
      }

      // Mark feedback as provided for today
      const feedbackKey = `feedback_provided_${assessmentType}_${new Date().toDateString()}`;
      localStorage.setItem(feedbackKey, 'true');

      setSubmitted(true);
      
      // Auto-close after 2 seconds
      setTimeout(() => {
        onClose();
        setSubmitted(false);
      }, 2000);

    } catch (error) {
      console.error('Feedback submission error:', error);
      setIsSubmitting(false);
    }
  };

  const handleSkip = () => {
    // Track skip event
    if (analytics && typeof analytics.trackEvent === 'function') {
      analytics.trackEvent('feedback_skipped', {
        event_category: 'feedback',
        assessment_type: assessmentType
      });
    }

    // Mark as skipped for today (less aggressive than provided)
    const skipKey = `feedback_skipped_${assessmentType}_${new Date().toDateString()}`;
    localStorage.setItem(skipKey, 'true');

    onClose();
  };

  if (!isOpen) return null;

  if (submitted) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-gray-200 dark:border-slate-700 p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-green-500" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
            {t('feedback.thankYou')}
          </h3>
          <p className="text-gray-600 dark:text-gray-300">
            {t('feedback.thankYouMessage')}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-gray-200 dark:border-slate-700 p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <Heart className="w-5 h-5 text-red-500 mr-2" />
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
              {t('feedback.title')}
            </h3>
          </div>
          <button
            onClick={handleSkip}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            aria-label={t('feedback.closeModal')}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-sm text-gray-600 dark:text-gray-300 mb-6">
          {t('feedback.description')}
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Rating */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              {t('feedback.overallRating')} <span className="text-red-500">*</span>
            </label>
            <div className="flex items-center justify-center space-x-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                  className="focus:outline-none transition-transform hover:scale-110"
                  aria-label={star === 1 ? t('feedback.rateStarSingular', { count: star }) : t('feedback.rateStarPlural', { count: star })}
                >
                  <Star
                    className={`w-8 h-8 transition-colors ${
                      star <= (hoveredRating || rating)
                        ? 'text-yellow-400 fill-current'
                        : 'text-gray-300 dark:text-gray-600'
                    }`}
                  />
                </button>
              ))}
            </div>
            {rating > 0 && (
              <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-2">
                {t(`feedback.ratingLabels.${rating}`)}
              </p>
            )}
          </div>

          {/* Most Useful Features */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t('feedback.mostUsefulLabel')}
            </label>
            <div className="grid grid-cols-2 gap-2">
              {usefulFeatures.map((feature) => (
                <label
                  key={feature.value}
                  className="flex items-center p-2 border border-gray-200 dark:border-gray-600 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={mostUseful.includes(feature.value)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setMostUseful([...mostUseful, feature.value]);
                      } else {
                        setMostUseful(mostUseful.filter(f => f !== feature.value));
                      }
                    }}
                    className="mr-2"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    {feature.label}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Would Recommend */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t('feedback.wouldRecommendLabel')}
            </label>
            <div className="flex space-x-4">
              <button
                type="button"
                onClick={() => setWouldRecommend(true)}
                className={`flex-1 px-4 py-2 rounded-lg border transition-colors ${
                  wouldRecommend === true
                    ? 'bg-green-500 text-white border-green-500'
                    : 'bg-white dark:bg-slate-700 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-slate-600'
                }`}
              >
                {t('feedback.yes')}
              </button>
              <button
                type="button"
                onClick={() => setWouldRecommend(false)}
                className={`flex-1 px-4 py-2 rounded-lg border transition-colors ${
                  wouldRecommend === false
                    ? 'bg-red-500 text-white border-red-500'
                    : 'bg-white dark:bg-slate-700 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-slate-600'
                }`}
              >
                {t('feedback.no')}
              </button>
            </div>
          </div>

          {/* Feedback Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t('feedback.categoryLabel')}
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500 focus:border-transparent"
            >
              <option value="">{t('feedback.selectCategory')}</option>
              {feedbackCategories.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
          </div>

          {/* Text Feedback */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t('feedback.additionalFeedbackLabel')}
            </label>
            <textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              rows={4}
              maxLength={500}
              placeholder={t('feedback.additionalFeedbackPlaceholder')}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 text-right">
              {feedback.length}/500
            </p>
          </div>

          {/* Actions */}
          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={handleSkip}
              className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
            >
              {t('feedback.skip')}
            </button>
            <button
              type="submit"
              disabled={rating === 0 || isSubmitting}
              className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${
                rating === 0 || isSubmitting
                  ? 'bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                  : 'bg-red-500 text-white hover:bg-red-600'
              }`}
            >
              {isSubmitting ? t('feedback.submitting') : t('feedback.submit')}
            </button>
          </div>
        </form>

        {/* Privacy Note */}
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-4 text-center">
          {t('feedback.privacyNote')}
        </p>
      </div>
    </div>
  );
};

export default PostAssessmentFeedbackModal;

