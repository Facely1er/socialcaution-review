import React, { useState } from 'react';
import { X, AlertTriangle, Send } from 'lucide-react';
import { submitReport, reportTypes, hasUserReported, markAsReported } from '../../utils/alertReporting';
import { useNotifications } from '../common/NotificationSystem';

const AlertReportModal = ({ alert, isOpen, onClose }) => {
  const { showSuccess, showError } = useNotifications();
  const [selectedType, setSelectedType] = useState('');
  const [details, setDetails] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen || !alert) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedType) {
      showError('Please select a report type');
      return;
    }

    setIsSubmitting(true);

    try {
      const result = submitReport(alert.id, {
        type: selectedType,
        details: details,
        reason: reportTypes.find(t => t.id === selectedType)?.label || selectedType
      });

      if (result.success) {
        markAsReported(alert.id);
        showSuccess('Thank you for your report. We will review it shortly.');
        onClose();
        // Reset form
        setSelectedType('');
        setDetails('');
      } else {
        showError(result.error || 'Failed to submit report. Please try again.');
      }
    } catch (error) {
      console.error('Error submitting report:', error);
      showError('An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setSelectedType('');
    setDetails('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-slate-700">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-red-100 dark:bg-red-900/20 rounded-lg">
              <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Report Alert
            </h2>
          </div>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
            aria-label="Close modal"
          >
            <X className="h-5 w-5 text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Alert Info */}
          <div className="p-4 bg-gray-50 dark:bg-slate-900 rounded-lg">
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Reporting:
            </p>
            <p className="text-sm text-gray-900 dark:text-white font-semibold line-clamp-2">
              {alert.title}
            </p>
          </div>

          {/* Report Type Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Why are you reporting this alert?
            </label>
            <div className="space-y-2">
              {reportTypes.map((type) => (
                <label
                  key={type.id}
                  className={`flex items-start p-3 border-2 rounded-lg cursor-pointer transition-colors ${
                    selectedType === type.id
                      ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20 dark:border-indigo-400'
                      : 'border-gray-200 dark:border-slate-700 hover:border-gray-300 dark:hover:border-slate-600'
                  }`}
                >
                  <input
                    type="radio"
                    name="reportType"
                    value={type.id}
                    checked={selectedType === type.id}
                    onChange={(e) => setSelectedType(e.target.value)}
                    className="mt-1 mr-3"
                  />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {type.label}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {type.description}
                    </p>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Additional Details */}
          <div>
            <label
              htmlFor="details"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              Additional Details (Optional)
            </label>
            <textarea
              id="details"
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-slate-700 dark:text-white resize-none"
              placeholder="Provide any additional information that might help us understand your concern..."
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-slate-700">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!selectedType || isSubmitting}
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors flex items-center space-x-2"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                  <span>Submitting...</span>
                </>
              ) : (
                <>
                  <Send className="h-4 w-4" />
                  <span>Submit Report</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AlertReportModal;

