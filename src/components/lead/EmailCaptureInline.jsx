import React, { useState } from 'react';
import { Mail, CheckCircle, Gift, ArrowRight } from 'lucide-react';
import { useTranslation } from '../../contexts/TranslationContext';
import { saveLead } from '../../utils/leadService';
import { analytics } from '../../utils/analytics';

const EmailCaptureInline = ({ 
  context = 'general',
  persona = null,
  offer = null,
  compact = false
}) => {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const getOffer = () => {
    if (offer) return offer;
    return 'Get weekly privacy tips and service updates';
  };

  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email.trim()) {
      setError('Email is required');
      return;
    }

    if (!validateEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }

    setIsSubmitting(true);

    try {
      const leadData = {
        email: email.trim(),
        context,
        persona: persona?.id || null,
        source: 'simple_version_inline'
      };

      saveLead(leadData);

      // Track analytics
      if (analytics && typeof analytics.trackEvent === 'function') {
        analytics.trackEvent('lead_captured_inline', {
          context,
          persona: persona?.id || null
        });
      }

      setSubmitted(true);
      setEmail('');

      // Reset after 3 seconds
      setTimeout(() => {
        setSubmitted(false);
      }, 3000);

    } catch (error) {
      setError('Something went wrong. Please try again.');
      console.error('Lead capture error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (compact) {
    return (
      <div className="bg-gradient-to-r from-accent/10 to-purple-500/10 dark:from-accent/20 dark:to-purple-500/20 rounded-lg p-4 border border-accent/20">
        {submitted ? (
          <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
            <CheckCircle className="w-5 h-5" />
            <span className="text-sm font-medium">Thank you! Check your email.</span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex gap-2">
            <input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError('');
              }}
              placeholder="your@email.com"
              className="flex-1 px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent dark:bg-slate-700 dark:text-white text-sm"
              required
            />
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 bg-gradient-to-r from-accent to-accent-dark text-white font-medium rounded-lg hover:from-accent-dark hover:to-accent transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm flex items-center gap-2"
            >
              {isSubmitting ? '...' : 'Subscribe'}
            </button>
          </form>
        )}
        {error && (
          <p className="text-xs text-red-600 dark:text-red-400 mt-2">{error}</p>
        )}
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-slate-800 dark:via-slate-900 dark:to-slate-800 rounded-2xl p-6 md:p-8 border border-accent/20">
      <div className="max-w-2xl mx-auto text-center">
        <div className="flex items-center justify-center mb-4">
          <div className="w-12 h-12 bg-gradient-to-br from-accent to-accent-dark rounded-full flex items-center justify-center">
            <Mail className="w-6 h-6 text-white" />
          </div>
        </div>

        <h3 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Stay Privacy-Smart
        </h3>
        <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
          {getOffer()}
        </p>

        {submitted ? (
          <div className="flex items-center justify-center gap-2 text-green-600 dark:text-green-400">
            <CheckCircle className="w-6 h-6" />
            <span className="text-lg font-medium">Thank you! Check your email for privacy tips.</span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError('');
              }}
              placeholder="your@email.com"
              className="flex-1 px-4 py-3 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent dark:bg-slate-700 dark:text-white"
              required
            />
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-3 bg-gradient-to-r from-accent to-accent-dark text-white font-bold rounded-lg hover:from-accent-dark hover:to-accent transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Submitting...</span>
                </>
              ) : (
                <>
                  <Gift className="w-5 h-5" />
                  <span>Get Tips</span>
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>
        )}

        {error && (
          <p className="text-sm text-red-600 dark:text-red-400 mt-3">{error}</p>
        )}

        <p className="text-xs text-gray-500 dark:text-gray-400 mt-4">
          We respect your privacy. Unsubscribe anytime.
        </p>
      </div>
    </div>
  );
};

export default EmailCaptureInline;

