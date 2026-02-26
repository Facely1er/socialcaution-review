import React from 'react';
import { ThumbsUp, ThumbsDown, CheckCircle } from 'lucide-react';
import { 
  getValidationStats, 
  toggleUpvote, 
  toggleDownvote,
  isVerified 
} from '../../utils/alertValidation';
import { useNotifications } from '../common/NotificationSystem';
import { useTranslation } from '../../contexts/TranslationContext';

const AlertValidation = ({ alert, onUpdate }) => {
  const { showSuccess } = useNotifications();
  const { t } = useTranslation();
  const stats = getValidationStats(alert?.id);

  if (!alert) return null;

  const handleUpvote = () => {
    const result = toggleUpvote(alert.id);
    if (result.success) {
      showSuccess('Thank you for your feedback!');
      if (onUpdate) {
        onUpdate();
      }
    }
  };

  const handleDownvote = () => {
    const result = toggleDownvote(alert.id);
    if (result.success) {
      showSuccess('Thank you for your feedback!');
      if (onUpdate) {
        onUpdate();
      }
    }
  };

  const verified = isVerified(alert.id);
  const score = stats.score;
  const userVote = stats.userVote;

  return (
    <div className="flex items-center space-x-4">
      {/* Verification Badge */}
      {verified && (
        <div className="flex items-center space-x-1 px-2 py-1 bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300 rounded-lg text-xs font-medium">
          <CheckCircle className="h-3 w-3" />
          <span>{t('alerts.validation.verified', 'Verified')}</span>
        </div>
      )}

      {/* Upvote Button */}
      <button
        onClick={handleUpvote}
        className={`flex items-center space-x-1 px-3 py-1.5 rounded-lg transition-colors ${
          userVote === 'upvote'
            ? 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300'
            : 'bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-600'
        }`}
        aria-label={t('alerts.validation.upvote')}
      >
        <ThumbsUp className={`h-4 w-4 ${userVote === 'upvote' ? 'fill-current' : ''}`} />
        <span className="text-sm font-medium">{stats.upvotes || 0}</span>
      </button>

      {/* Score Display */}
      {score !== 0 && (
        <span className={`text-sm font-medium ${
          score > 0 
            ? 'text-green-600 dark:text-green-400' 
            : 'text-red-600 dark:text-red-400'
        }`}>
          {score > 0 ? '+' : ''}{score}
        </span>
      )}

      {/* Downvote Button */}
      <button
        onClick={handleDownvote}
        className={`flex items-center space-x-1 px-3 py-1.5 rounded-lg transition-colors ${
          userVote === 'downvote'
            ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300'
            : 'bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-600'
        }`}
        aria-label={t('alerts.validation.downvote')}
      >
        <ThumbsDown className={`h-4 w-4 ${userVote === 'downvote' ? 'fill-current' : ''}`} />
        <span className="text-sm font-medium">{stats.downvotes || 0}</span>
      </button>
    </div>
  );
};

export default AlertValidation;

