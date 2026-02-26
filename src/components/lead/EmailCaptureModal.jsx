import React, { useState, useEffect } from 'react';
import { X, Mail, CheckCircle, Sparkles, Shield, Bell, Gift } from 'lucide-react';
import { useTranslation } from '../../contexts/TranslationContext';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { analytics } from '../../utils/analytics';

const EmailCaptureModal = ({ 
  isOpen, 
  onClose, 
  context = 'general', // 'persona', 'service', 'homepage', 'general'
  persona = null,
  offer = null, // Custom offer text
  selectedServices = [] // For service context
}) => {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [hasSeenModal, setHasSeenModal] = useLocalStorage('socialcaution_email_modal_seen', false);

  // Get offer based on context
  const getOffer = () => {
    if (offer) return offer;
    
    switch (context) {
      case 'persona':
        return persona 
          ? `Get personalized privacy tips for ${persona.name}`
          : 'Get personalized privacy tips for your persona';
      case 'service':
        return 'Get notified when services you follow have privacy updates';
      case 'homepage':
        return 'Get weekly privacy tips and service updates';
      default:
        return 'Get personalized privacy insights and tips';
    }
  };

  const getBenefits = () => {
    switch (context) {
      case 'persona':
        return [
          'Personalized privacy tips for your persona',
          'Weekly privacy insights',
          'Service recommendations',
          'Privacy best practices'
        ];
      case 'service':
        return [
          'Privacy updates for your services',
          'Risk alerts and notifications',
          'Service comparison insights',
          'Privacy tips and guides'
        ];
      default:
        return [
          'Weekly privacy tips',
          'Service privacy updates',
          'Privacy best practices',
          'Exclusive privacy resources'
        ];
    }
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
      // Store lead locally first
      const leadData = {
        email: email.trim(),
        name: name.trim() || null,
        context,
        persona: persona?.id || null,
        selectedServices: context === 'service' ? selectedServices : null,
        timestamp: new Date().toISOString(),
        source: 'simple_version'
      };

      // Save to localStorage for backup
      const existingLeads = JSON.parse(localStorage.getItem('socialcaution_leads') || '[]');
      existingLeads.push(leadData);
      localStorage.setItem('socialcaution_leads', JSON.stringify(existingLeads));

      // Send to backend/email service
      const apiEndpoint = import.meta.env.VITE_LEAD_API_URL || '/api/leads';
      
      try {
        const response = await fetch(apiEndpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(leadData)
        });

        if (!response.ok) {
          throw new Error('Failed to submit');
        }
      } catch (apiError) {
        // If API fails, lead is still saved in localStorage
        // Can be synced later
        console.warn('API submission failed, lead saved locally:', apiError);
      }

      // Track analytics
      if (analytics && typeof analytics.trackEvent === 'function') {
        analytics.trackEvent('lead_captured', {
          context,
          persona: persona?.id || null,
          has_name: !!name.trim()
        });
      }

      // Mark modal as seen
      setHasSeenModal(true);
      setSubmitted(true);

      // Auto-close after 2 seconds
      setTimeout(() => {
        onClose();
        setSubmitted(false);
        setEmail('');
        setName('');
      }, 2000);

    } catch (error) {
      setError('Something went wrong. Please try again.');
      console.error('Lead capture error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-md w-full p-6 md:p-8 relative animate-in fade-in zoom-in duration-300">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          aria-label="Close"
        >
          <X className="w-6 h-6" />
        </button>

        {submitted ? (
          // Success state
          <div className="text-center py-4">
            <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Thank You!
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Check your email for privacy tips and updates.
            </p>
          </div>
        ) : (
          // Form state
          <>
            {/* Icon */}
            <div className="flex items-center justify-center mb-4">
              <div className="relative">
                <div className="w-16 h-16 bg-gradient-to-br from-accent to-accent-dark rounded-full flex items-center justify-center">
                  <Mail className="w-8 h-8 text-white" />
                </div>
                <Sparkles className="w-6 h-6 text-purple-500 absolute -top-1 -right-1" />
              </div>
            </div>

            {/* Heading */}
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white text-center mb-2">
              Stay Privacy-Smart
            </h2>
            <p className="text-center text-gray-600 dark:text-gray-300 mb-6">
              {getOffer()}
            </p>

            {/* Benefits */}
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl p-4 mb-6">
              <ul className="space-y-2">
                {getBenefits().map((benefit, index) => (
                  <li key={index} className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                    <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400 flex-shrink-0" />
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setError('');
                  }}
                  placeholder="your@email.com"
                  className="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent dark:bg-slate-700 dark:text-white"
                  required
                  autoFocus
                />
              </div>

              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Name <span className="text-gray-400 text-xs">(optional)</span>
                </label>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name"
                  className="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent dark:bg-slate-700 dark:text-white"
                />
              </div>

              {error && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
                  <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 bg-gradient-to-r from-accent to-accent-dark text-white font-bold rounded-lg hover:from-accent-dark hover:to-accent transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Submitting...</span>
                  </>
                ) : (
                  <>
                    <Gift className="w-5 h-5" />
                    <span>Get Privacy Tips</span>
                  </>
                )}
              </button>

              <p className="text-xs text-center text-gray-500 dark:text-gray-400">
                We respect your privacy. Unsubscribe anytime.
              </p>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default EmailCaptureModal;

