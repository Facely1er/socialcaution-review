import React, { useState, useEffect } from 'react';
import { FileText, Download, Check, Sparkles, Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ONE_TIME_PRODUCTS } from '../../config/stripe';
import { stripeClient } from '../../lib/stripe';
import { getOneTimeCheckoutConfig } from '../../config/stripe';

const ReportTemplatesPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [purchased, setPurchased] = useState(false);

  useEffect(() => {
    // Check if user has purchased templates
    const purchasedStatus = localStorage.getItem('report_templates_purchased') === 'true';
    setPurchased(purchasedStatus);
  }, []);

  const templates = [
    {
      id: 'executive',
      name: 'Executive Summary Template',
      description: 'High-level privacy report for executives and stakeholders',
      icon: '📊',
    },
    {
      id: 'compliance',
      name: 'Compliance Report Template',
      description: 'GDPR/CCPA compliance-ready format with regulatory sections',
      icon: '⚖️',
    },
    {
      id: 'technical',
      name: 'Technical Assessment Template',
      description: 'Detailed technical privacy analysis for IT teams',
      icon: '🔧',
    },
    {
      id: 'audit',
      name: 'Privacy Audit Template',
      description: 'Comprehensive audit report format with findings and recommendations',
      icon: '🔍',
    },
    {
      id: 'industry',
      name: 'Industry-Specific Templates',
      description: 'Healthcare, Finance, Education, and other industry formats',
      icon: '🏢',
    },
  ];

  const handlePurchase = async () => {
    try {
      setLoading(true);
      const config = getOneTimeCheckoutConfig('premiumReportTemplate');
      const { url } = await stripeClient.createCheckoutSession({
        priceId: ONE_TIME_PRODUCTS.premiumReportTemplate.priceId,
        successUrl: `${window.location.origin}/premium/templates?success=true&session_id={CHECKOUT_SESSION_ID}`,
        cancelUrl: `${window.location.origin}/premium/templates`,
        metadata: config.metadata,
      });
      window.location.href = url;
    } catch (error) {
      console.error('Purchase error:', error);
      alert('Failed to start checkout. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Check for success parameter from Stripe redirect
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('success') === 'true') {
      localStorage.setItem('report_templates_purchased', 'true');
      setPurchased(true);
      // Clean URL
      window.history.replaceState({}, '', '/premium/templates');
    }
  }, []);

  if (purchased) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-6 mb-8">
            <div className="flex items-center">
              <Check className="w-6 h-6 text-green-600 dark:text-green-400 mr-3" />
              <div>
                <h3 className="text-lg font-semibold text-green-900 dark:text-green-100">
                  Premium Templates Unlocked
                </h3>
                <p className="text-green-800 dark:text-green-200">
                  You have access to all premium report templates. Download them below.
                </p>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {templates.map(template => (
              <div
                key={template.id}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg transition-shadow"
              >
                <div className="text-4xl mb-4">{template.icon}</div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  {template.name}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4 text-sm">
                  {template.description}
                </p>
                <button
                  onClick={() => {
                    // In production, this would download the actual template
                    // For now, show a message
                    alert(`Downloading ${template.name}...\n\nIn production, this would download the actual PDF template.`);
                  }}
                  className="w-full flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download Template
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <Sparkles className="w-16 h-16 text-blue-600 dark:text-blue-400 mx-auto mb-4" />
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Premium Report Templates
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            Professional, customizable privacy report templates
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 p-8 mb-8">
          <div className="text-center mb-8">
            <div className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
              ${ONE_TIME_PRODUCTS.premiumReportTemplate.price}
            </div>
            <p className="text-gray-600 dark:text-gray-400">One-time payment, lifetime access</p>
          </div>

          <ul className="space-y-3 mb-8">
            {ONE_TIME_PRODUCTS.premiumReportTemplate.features.map((feature, index) => (
              <li key={index} className="flex items-start">
                <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                <span className="text-gray-700 dark:text-gray-300">{feature}</span>
              </li>
            ))}
          </ul>

          <button
            onClick={handlePurchase}
            disabled={loading}
            className="w-full py-3 px-6 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Processing...' : 'Purchase Templates'}
          </button>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {templates.map(template => (
            <div
              key={template.id}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 p-6 opacity-75"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="text-3xl">{template.icon}</div>
                <Lock className="w-5 h-5 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                {template.name}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                {template.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ReportTemplatesPage;

