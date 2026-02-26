import React, { useState } from 'react';
import { Send, CheckCircle, Shield } from 'lucide-react';
import SEOHead from '../common/SEOHead';
import { SecurityUtils } from '../../utils/security';
import { MonitoringService } from '../../utils/monitoring.jsx';
import { useTranslation } from '../../contexts/TranslationContext';

/**
 * ContactUs component - handles contact form submissions
 * @typedef {Object} ContactFormState
 * @property {string} name - User's name
 * @property {string} email - User's email
 * @property {string} subject - Message subject
 * @property {string} message - Message content
 * @property {string} priority - Message priority
 */
const ContactUs = () => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: 'general',
    message: '',
    priority: 'normal'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState({});

  const subjects = [
    { value: 'general', label: t('contactUs.subjects.general') },
    { value: 'bug', label: t('contactUs.subjects.bug') },
    { value: 'feature', label: t('contactUs.subjects.feature') },
    { value: 'privacy', label: t('contactUs.subjects.privacy') },
    { value: 'business', label: t('contactUs.subjects.business') },
    { value: 'partnership', label: t('contactUs.subjects.partnership') },
    { value: 'media', label: t('contactUs.subjects.media') },
    { value: 'security', label: t('contactUs.subjects.security') }
  ];

  const validateForm = () => {
    const newErrors = {};

    // Sanitize inputs
    const sanitizedData = {
      name: SecurityUtils.sanitizeInput(formData.name, { maxLength: 100 }),
      email: SecurityUtils.sanitizeInput(formData.email, { maxLength: 200 }),
      message: SecurityUtils.sanitizeInput(formData.message, { maxLength: 5000, allowNewlines: true })
    };

    // Validation rules
    if (!sanitizedData.name.trim()) {
      newErrors.name = t('contactUs.validation.nameRequired');
    }

    if (!sanitizedData.email.trim()) {
      newErrors.email = t('contactUs.validation.emailRequired');
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(sanitizedData.email)) {
      newErrors.email = t('contactUs.validation.emailInvalid');
    }

    if (!sanitizedData.message.trim()) {
      newErrors.message = t('contactUs.validation.messageRequired');
    } else if (sanitizedData.message.length < 10) {
      newErrors.message = t('contactUs.validation.messageMinLength');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      // API endpoint configuration
      const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || '/api';
      const contactEndpoint = `${apiBaseUrl}/contact`;
      
      // Prepare sanitized data for submission
      const sanitizedData = {
        name: SecurityUtils.sanitizeInput(formData.name, { maxLength: 100 }),
        email: SecurityUtils.sanitizeInput(formData.email, { maxLength: 200 }),
        subject: formData.subject,
        message: SecurityUtils.sanitizeInput(formData.message, { maxLength: 5000, allowNewlines: true }),
        priority: formData.priority,
        timestamp: new Date().toISOString(),
        userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'unknown'
      };

      // Make API call to backend service
      const response = await fetch(contactEndpoint, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(sanitizedData)
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Failed to send message' }));
        throw new Error(errorData.message || `Server error: ${response.status}`);
      }

      const result = await response.json();
      
      // In development, log success (helps with debugging)
      if (import.meta.env.DEV) {
        console.log('Contact form submitted successfully:', result);
      }

      // Log business metric
      MonitoringService.logBusinessMetric('contact_form_submission', 1, {
        subject: formData.subject,
        priority: formData.priority,
        message_length: formData.message.length
      });

      setSubmitted(true);
      setFormData({
        name: '',
        email: '',
        subject: 'general',
        message: '',
        priority: 'normal'
      });
    } catch (error) {
      // Provide user-friendly error message
      let errorMessage = t('contactUs.errors.failedToSend');
      
      // Handle network errors
      if (error.message.includes('fetch')) {
        errorMessage = t('contactUs.errors.networkError');
      } else if (error.message.includes('Server error')) {
        errorMessage = t('contactUs.errors.serverError');
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      setErrors({ general: errorMessage });
      
      // Log error for monitoring
      if (MonitoringService && typeof MonitoringService.logBusinessMetric === 'function') {
        MonitoringService.logBusinessMetric('contact_form_error', 1, {
          error_message: error.message || 'Unknown error',
          error_type: error.name || 'Error',
          subject: formData.subject,
          priority: formData.priority
        });
      }
      
      // Log to error reporting service in production
      if (import.meta.env.PROD) {
        try {
          if (window.Sentry && typeof window.Sentry.captureException === 'function') {
            window.Sentry.captureException(error, {
              tags: { component: 'ContactUs', form_subject: formData.subject },
              contexts: { form: { subject: formData.subject, priority: formData.priority } }
            });
          }
        } catch (reportingError) {
          // Silently fail error reporting to avoid cascade
          if (import.meta.env.DEV) {
            console.warn('Error reporting failed:', reportingError);
          }
        }
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-slate-900 flex items-center justify-center p-4">
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-gray-200 dark:border-slate-700 p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-green-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
            {t('contactUs.success.title')}
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            {t('contactUs.success.message')}
          </p>
          <button
            type="button"
            onClick={() => {
              setSubmitted(false);
              window.location.reload();
            }}
            className="px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
          >
            {t('contactUs.form.sendAnother')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div id="contact-page" className="min-h-screen bg-gray-50 dark:bg-slate-900 pb-12 sm:pb-16">
      <SEOHead
        title={`${t('contactUs.title')} - SocialCaution`}
        description={t('contactUs.description')}
        canonicalUrl={`${window.location.origin}/contact`}
      />

      <div className="max-w-6xl mx-auto px-4 pt-1">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            {t('contactUs.title')}
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            {t('contactUs.subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Information */}
          <div className="space-y-6">
            {/* Privacy Notice */}
            <div className="bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-200 dark:border-green-800 p-6">
              <div className="flex items-center mb-3">
                <Shield className="w-5 h-5 text-green-500 mr-2" />
                <h4 className="font-medium text-green-900 dark:text-green-100">
                  {t('contactUs.privacyNotice.title')}
                </h4>
              </div>
              <p className="text-sm text-green-800 dark:text-green-200">
                {t('contactUs.privacyNotice.description')}
              </p>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 p-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                {t('contactUs.form.title')}
              </h2>

              {errors.general && (
                <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                  <p className="text-red-800 dark:text-red-200 text-sm">{errors.general}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name and Email */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      {t('contactUs.form.name')}
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className={`w-full px-4 py-3 border rounded-xl bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all ${
                        errors.name ? 'border-red-300 dark:border-red-600' : 'border-gray-300 dark:border-gray-600'
                      }`}
                      placeholder={t('contactUs.form.namePlaceholder')}
                    />
                    {errors.name && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.name}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      {t('contactUs.form.email')}
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className={`w-full px-4 py-3 border rounded-xl bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all ${
                        errors.email ? 'border-red-300 dark:border-red-600' : 'border-gray-300 dark:border-gray-600'
                      }`}
                      placeholder={t('contactUs.form.emailPlaceholder')}
                    />
                    {errors.email && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.email}</p>
                    )}
                  </div>
                </div>

                {/* Subject and Priority */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      {t('contactUs.form.subject')}
                    </label>
                    <select
                      value={formData.subject}
                      onChange={(e) => handleInputChange('subject', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                    >
                      {subjects.map(subject => (
                        <option key={subject.value} value={subject.value}>
                          {subject.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      {t('contactUs.form.priority')}
                    </label>
                    <select
                      value={formData.priority}
                      onChange={(e) => handleInputChange('priority', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                    >
                      <option value="low">{t('contactUs.priorities.low')}</option>
                      <option value="normal">{t('contactUs.priorities.normal')}</option>
                      <option value="high">{t('contactUs.priorities.high')}</option>
                      <option value="urgent">{t('contactUs.priorities.urgent')}</option>
                    </select>
                  </div>
                </div>

                {/* Message */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {t('contactUs.form.message')}
                  </label>
                  <textarea
                    value={formData.message}
                    onChange={(e) => handleInputChange('message', e.target.value)}
                    rows={6}
                    className={`w-full px-4 py-3 border rounded-xl bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all resize-vertical ${
                      errors.message ? 'border-red-300 dark:border-red-600' : 'border-gray-300 dark:border-gray-600'
                    }`}
                    placeholder={t('contactUs.form.messagePlaceholder')}
                  />
                  <div className="flex justify-between mt-1">
                    {errors.message ? (
                      <p className="text-sm text-red-600 dark:text-red-400">{errors.message}</p>
                    ) : (
                      <span></span>
                    )}
                    <p className="text-sm text-gray-500">
                      {formData.message.length}/5000
                    </p>
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full px-6 py-4 bg-red-500 text-white font-bold rounded-lg hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      {t('contactUs.form.sending')}
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5 mr-2" />
                      {t('contactUs.form.sendMessage')}
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;