import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, Building2, Users, Shield, BarChart3, HeadphonesIcon, Sparkles } from 'lucide-react';
import { ENTERPRISE_PRODUCTS, ANNUAL_DISCOUNT, getCheckoutConfig } from '../../config/stripe';
import { stripeClient } from '../../lib/stripe';

const EnterprisePricingPage = () => {
  const navigate = useNavigate();
  const [billingPeriod, setBillingPeriod] = useState('monthly');
  const [loading, setLoading] = useState(null);

  const calculateAnnualPrice = (monthlyPrice) => {
    return Math.round(monthlyPrice * 12 * (1 - ANNUAL_DISCOUNT));
  };

  const handleCheckout = async (planKey) => {
    if (planKey === 'enterprise') {
      // Custom pricing - redirect to contact
      navigate('/contact?subject=enterprise-pricing');
      return;
    }

    try {
      setLoading(planKey);
      const isAnnual = billingPeriod === 'annual';
      const config = getCheckoutConfig(planKey, isAnnual);
      const { url } = await stripeClient.createCheckoutSession({
        priceId: ENTERPRISE_PRODUCTS[planKey].priceId,
        successUrl: `${window.location.origin}/dashboard?success=true&session_id={CHECKOUT_SESSION_ID}`,
        cancelUrl: `${window.location.origin}/enterprise/pricing`,
        metadata: config.metadata,
      });
      window.location.href = url;
    } catch (error) {
      console.error('Checkout error:', error);
      alert('Failed to start checkout. Please try again.');
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-950 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <Building2 className="w-16 h-16 text-blue-600 dark:text-blue-400 mx-auto mb-4" />
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Enterprise Privacy Compliance Solutions
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Protect your organization with comprehensive privacy compliance tools and team management
          </p>
        </div>

        {/* Billing Toggle */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex items-center bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
            <button
              onClick={() => setBillingPeriod('monthly')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                billingPeriod === 'monthly'
                  ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                  : 'text-gray-600 dark:text-gray-400'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingPeriod('annual')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                billingPeriod === 'annual'
                  ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                  : 'text-gray-600 dark:text-gray-400'
              }`}
            >
              Annual
              <span className="ml-1 text-xs text-green-600 dark:text-green-400">
                Save {Math.round(ANNUAL_DISCOUNT * 100)}%
              </span>
            </button>
          </div>
        </div>

        {/* Enterprise Plans */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {/* Starter Plan */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border-2 border-gray-200 dark:border-gray-700 p-8">
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full mb-4">
                <Users className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                {ENTERPRISE_PRODUCTS.starter.name}
              </h3>
              <div className="text-4xl font-bold text-gray-900 dark:text-white mb-1">
                ${billingPeriod === 'annual' ? (calculateAnnualPrice(ENTERPRISE_PRODUCTS.starter.price) / 12).toFixed(2) : ENTERPRISE_PRODUCTS.starter.price}
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {billingPeriod === 'annual' ? 'per month (billed annually)' : 'per month'}
              </p>
              {billingPeriod === 'annual' && (
                <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                  ${calculateAnnualPrice(ENTERPRISE_PRODUCTS.starter.price)}/year
                </p>
              )}
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                {ENTERPRISE_PRODUCTS.starter.description}
              </p>
            </div>
            <ul className="space-y-3 mb-8">
              {ENTERPRISE_PRODUCTS.starter.features.map((feature, index) => (
                <li key={index} className="flex items-start">
                  <Check className="w-5 h-5 text-blue-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">{feature}</span>
                </li>
              ))}
            </ul>
            <button
              onClick={() => handleCheckout('starter')}
              disabled={loading === 'starter'}
              className="w-full py-3 px-4 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading === 'starter' ? 'Loading...' : 'Get Started'}
            </button>
          </div>

          {/* Professional Plan */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl border-2 border-blue-500 dark:border-blue-600 p-8 relative">
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <span className="bg-blue-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                Most Popular
              </span>
            </div>
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full mb-4">
                <Shield className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                {ENTERPRISE_PRODUCTS.professional.name}
              </h3>
              <div className="text-4xl font-bold text-gray-900 dark:text-white mb-1">
                ${billingPeriod === 'annual' ? (calculateAnnualPrice(ENTERPRISE_PRODUCTS.professional.price) / 12).toFixed(2) : ENTERPRISE_PRODUCTS.professional.price}
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {billingPeriod === 'annual' ? 'per month (billed annually)' : 'per month'}
              </p>
              {billingPeriod === 'annual' && (
                <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                  ${calculateAnnualPrice(ENTERPRISE_PRODUCTS.professional.price)}/year
                </p>
              )}
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                {ENTERPRISE_PRODUCTS.professional.description}
              </p>
            </div>
            <ul className="space-y-3 mb-8">
              {ENTERPRISE_PRODUCTS.professional.features.map((feature, index) => (
                <li key={index} className="flex items-start">
                  <Check className="w-5 h-5 text-blue-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">{feature}</span>
                </li>
              ))}
            </ul>
            <button
              onClick={() => handleCheckout('professional')}
              disabled={loading === 'professional'}
              className="w-full py-3 px-4 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading === 'professional' ? 'Loading...' : 'Get Started'}
            </button>
          </div>

          {/* Enterprise Custom */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border-2 border-gray-200 dark:border-gray-700 p-8">
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-full mb-4">
                <Sparkles className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                {ENTERPRISE_PRODUCTS.enterprise.name}
              </h3>
              <div className="text-4xl font-bold text-gray-900 dark:text-white mb-1">
                Custom
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Starting at $999/month</p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                {ENTERPRISE_PRODUCTS.enterprise.description}
              </p>
            </div>
            <ul className="space-y-3 mb-8">
              {ENTERPRISE_PRODUCTS.enterprise.features.map((feature, index) => (
                <li key={index} className="flex items-start">
                  <Check className="w-5 h-5 text-purple-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">{feature}</span>
                </li>
              ))}
            </ul>
            <button
              onClick={() => handleCheckout('enterprise')}
              className="w-full py-3 px-4 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors"
            >
              Contact Sales
            </button>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-8">
            Frequently Asked Questions
          </h2>
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                What's included in team member limits?
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Team member limits refer to the number of users who can access the enterprise dashboard and run assessments. Each team member gets their own privacy assessment and can contribute to team compliance reports.
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Can I upgrade or downgrade my plan?
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Yes! You can upgrade or downgrade your plan at any time. Changes will be prorated and reflected in your next billing cycle.
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Do you offer custom integrations?
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Yes, custom integrations are available for Enterprise plans. Contact our sales team to discuss your specific integration needs.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnterprisePricingPage;

