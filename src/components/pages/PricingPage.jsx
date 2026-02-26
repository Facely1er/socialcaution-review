import React, { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Check, 
  Shield, 
  Sparkles, 
  ShoppingCart, 
  Users, 
  FileText, 
  BarChart3, 
  Database, 
  Download, 
  Cloud, 
  TrendingUp, 
  History, 
  Wrench, 
  Headphones, 
  Zap, 
  Eye, 
  CheckCircle2,
  Smartphone,
  Laptop,
  Target,
  Lock,
  BarChart,
  Briefcase,
  Rocket,
  UserCheck,
  ArrowRight,
  HelpCircle,
  DollarSign
} from 'lucide-react';
import { PRODUCTS, ANNUAL_DISCOUNT, getCheckoutConfig } from '../../config/stripe';
import { useTranslation } from '../../contexts/TranslationContext';

const PricingPage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [billingPeriod, setBillingPeriod] = useState('monthly');
  const [loading, setLoading] = useState(null);

  const handleCheckout = useCallback(async (planKey) => {
    try {
      setLoading(planKey);
      
      // Dynamically import stripe client only when needed
      const { stripeClient } = await import('../../lib/stripe');
      
      const isAnnual = billingPeriod === 'annual';
      const config = getCheckoutConfig(planKey, isAnnual);
      const product = PRODUCTS[planKey];
      
      // Use annual price ID if annual billing is selected, otherwise use monthly
      const priceId = isAnnual && 'priceIdAnnual' in product && product.priceIdAnnual 
        ? product.priceIdAnnual 
        : product.priceId;
      
      const { url } = await stripeClient.createCheckoutSession({
        priceId: priceId,
        successUrl: config.successUrl,
        cancelUrl: config.cancelUrl,
        metadata: config.metadata,
      });
      window.location.href = url;
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error('Checkout error:', error);
      }
      alert(t('pricing.errors.checkoutFailed'));
    } finally {
      setLoading(null);
    }
  }, [billingPeriod]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-950 pt-12 sm:pt-16 pb-12 sm:pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12">
          <h1 className="page-title mb-4 sm:mb-6 flex items-center justify-center gap-3 sm:gap-4">
            <div className="p-1.5 sm:p-2 md:p-2.5 bg-gradient-to-br from-red-500 to-red-600 rounded-lg shadow-md flex-shrink-0 flex items-center justify-center">
              <DollarSign className="w-5 h-5 sm:w-5 sm:h-5 md:w-6 md:h-6 text-white" />
            </div>
            <span className="leading-tight">{t('pricing.title')}</span>
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            {t('pricing.subtitle')}
          </p>
        </div>

        {/* Subscription Plans */}
        <div className="grid md:grid-cols-2 gap-8 mb-16 max-w-5xl mx-auto">
          {/* Basic (Free) Plan */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border-2 border-gray-200 dark:border-gray-700 p-8 hover:shadow-xl transition-shadow">
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-100 to-blue-50 dark:from-blue-900/30 dark:to-blue-800/20 rounded-2xl mb-4 border-2 border-blue-200 dark:border-blue-700 shadow-md">
                <Shield className="w-10 h-10 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                {t('pricing.plans.basic.name')}
              </h3>
              <div className="text-5xl font-bold text-gray-900 dark:text-white mb-1">
                {t('pricing.plans.basic.price')}
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                {t('pricing.plans.basic.description')}
              </p>
            </div>
            <ul className="space-y-3.5 mb-8">
              <li className="flex items-start group">
                <div className="flex-shrink-0 mt-0.5 mr-3">
                  <div className="w-6 h-6 rounded-md bg-green-100 dark:bg-green-900/30 flex items-center justify-center group-hover:bg-green-200 dark:group-hover:bg-green-900/50 transition-colors">
                    <ShoppingCart className="w-4 h-4 text-green-600 dark:text-green-400" />
                  </div>
                </div>
                <span className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed font-medium">{t('pricing.plans.basic.features.serviceCatalog')}</span>
              </li>
              <li className="flex items-start group">
                <div className="flex-shrink-0 mt-0.5 mr-3">
                  <div className="w-6 h-6 rounded-md bg-green-100 dark:bg-green-900/30 flex items-center justify-center group-hover:bg-green-200 dark:group-hover:bg-green-900/50 transition-colors">
                    <Users className="w-4 h-4 text-green-600 dark:text-green-400" />
                  </div>
                </div>
                <span className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed font-medium">{t('pricing.plans.basic.features.privacyConcerns')}</span>
              </li>
              <li className="flex items-start group">
                <div className="flex-shrink-0 mt-0.5 mr-3">
                  <div className="w-6 h-6 rounded-md bg-green-100 dark:bg-green-900/30 flex items-center justify-center group-hover:bg-green-200 dark:group-hover:bg-green-900/50 transition-colors">
                    <Target className="w-4 h-4 text-green-600 dark:text-green-400" />
                  </div>
                </div>
                <span className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed font-medium">{t('pricing.plans.basic.features.assessments')}</span>
              </li>
              <li className="flex items-start group">
                <div className="flex-shrink-0 mt-0.5 mr-3">
                  <div className="w-6 h-6 rounded-md bg-green-100 dark:bg-green-900/30 flex items-center justify-center group-hover:bg-green-200 dark:group-hover:bg-green-900/50 transition-colors">
                    <BarChart3 className="w-4 h-4 text-green-600 dark:text-green-400" />
                  </div>
                </div>
                <span className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed font-medium">{t('pricing.plans.basic.features.privacyIndex')}</span>
              </li>
              <li className="flex items-start group">
                <div className="flex-shrink-0 mt-0.5 mr-3">
                  <div className="w-6 h-6 rounded-md bg-green-100 dark:bg-green-900/30 flex items-center justify-center group-hover:bg-green-200 dark:group-hover:bg-green-900/50 transition-colors">
                    <BarChart className="w-4 h-4 text-green-600 dark:text-green-400" />
                  </div>
                </div>
                <span className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed font-medium">{t('pricing.plans.basic.features.dashboard')}</span>
              </li>
              <li className="flex items-start group">
                <div className="flex-shrink-0 mt-0.5 mr-3">
                  <div className="w-6 h-6 rounded-md bg-green-100 dark:bg-green-900/30 flex items-center justify-center group-hover:bg-green-200 dark:group-hover:bg-green-900/50 transition-colors">
                    <Sparkles className="w-4 h-4 text-green-600 dark:text-green-400" />
                  </div>
                </div>
                <span className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed font-medium">{t('pricing.plans.basic.features.adaptiveResources')}</span>
              </li>
              <li className="flex items-start group">
                <div className="flex-shrink-0 mt-0.5 mr-3">
                  <div className="w-6 h-6 rounded-md bg-green-100 dark:bg-green-900/30 flex items-center justify-center group-hover:bg-green-200 dark:group-hover:bg-green-900/50 transition-colors">
                    <Wrench className="w-4 h-4 text-green-600 dark:text-green-400" />
                  </div>
                </div>
                <span className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed font-medium">{t('pricing.plans.basic.features.privacyTools')}</span>
              </li>
              <li className="flex items-start group">
                <div className="flex-shrink-0 mt-0.5 mr-3">
                  <div className="w-6 h-6 rounded-md bg-green-100 dark:bg-green-900/30 flex items-center justify-center group-hover:bg-green-200 dark:group-hover:bg-green-900/50 transition-colors">
                    <Download className="w-4 h-4 text-green-600 dark:text-green-400" />
                  </div>
                </div>
                <span className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed font-medium">{t('pricing.plans.basic.features.exportReports')}</span>
              </li>
              <li className="flex items-start group">
                <div className="flex-shrink-0 mt-0.5 mr-3">
                  <div className="w-6 h-6 rounded-md bg-green-100 dark:bg-green-900/30 flex items-center justify-center group-hover:bg-green-200 dark:group-hover:bg-green-900/50 transition-colors">
                    <Database className="w-4 h-4 text-green-600 dark:text-green-400" />
                  </div>
                </div>
                <span className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed font-medium">{t('pricing.plans.basic.features.localStorage')}</span>
              </li>
              <li className="flex items-start group">
                <div className="flex-shrink-0 mt-0.5 mr-3">
                  <div className="w-6 h-6 rounded-md bg-green-100 dark:bg-green-900/30 flex items-center justify-center group-hover:bg-green-200 dark:group-hover:bg-green-900/50 transition-colors">
                    <UserCheck className="w-4 h-4 text-green-600 dark:text-green-400" />
                  </div>
                </div>
                <span className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed font-medium">{t('pricing.plans.basic.features.noAccount')}</span>
              </li>
            </ul>
            <button
              onClick={() => navigate('/assessment')}
              className="w-full py-3 px-4 bg-blue-600 dark:bg-blue-700 text-white rounded-lg font-medium hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors"
            >
              {t('pricing.plans.basic.cta')}
            </button>
          </div>

          {/* Standard (Subscription) Plan */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl border-2 border-red-500 dark:border-red-600 p-8 relative hover:shadow-2xl transition-shadow">
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-red-100 to-red-50 dark:from-red-900/30 dark:to-red-800/20 rounded-2xl mb-4 border-2 border-red-500 dark:border-red-600 shadow-lg">
                <Sparkles className="w-10 h-10 text-red-600 dark:text-red-400" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                {t('pricing.plans.standard.name')}
              </h3>
              
              {/* Billing Toggle */}
              <div className="flex justify-center mb-4">
                <div className="inline-flex items-center bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
                  <button
                    onClick={() => setBillingPeriod('monthly')}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                      billingPeriod === 'monthly'
                        ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                        : 'text-gray-600 dark:text-gray-400'
                    }`}
                  >
                    {t('pricing.billing.monthly')}
                  </button>
                  <button
                    onClick={() => setBillingPeriod('annual')}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                      billingPeriod === 'annual'
                        ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                        : 'text-gray-600 dark:text-gray-400'
                    }`}
                  >
                    {t('pricing.billing.annual')}
                    <span className="ml-1 text-xs text-green-600 dark:text-green-400">
                      {t('pricing.billing.save', { percent: Math.round(ANNUAL_DISCOUNT * 100) })}
                    </span>
                  </button>
                </div>
              </div>
              
              <div className="text-5xl font-bold text-gray-900 dark:text-white mb-1">
                {billingPeriod === 'annual' ? '$29.99' : '$2.99'}
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {billingPeriod === 'annual' ? t('pricing.billing.perYear') : t('pricing.billing.perMonth')}
                {billingPeriod === 'annual' && (
                  <span className="block text-xs text-gray-400 dark:text-gray-500 mt-1">
                    {t('pricing.billing.monthlyEquivalent')}
                  </span>
                )}
              </p>
              <p className="text-xs text-red-600 dark:text-red-400 mt-1">
                {t('pricing.billing.lessThanDaily')}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                {t('pricing.plans.standard.description')}
              </p>
            </div>
            <ul className="space-y-3.5 mb-8">
              <li className="flex items-start group">
                <div className="flex-shrink-0 mt-0.5 mr-3">
                  <div className="w-6 h-6 rounded-md bg-red-100 dark:bg-red-900/30 flex items-center justify-center group-hover:bg-red-200 dark:group-hover:bg-red-900/50 transition-colors">
                    <CheckCircle2 className="w-4 h-4 text-red-600 dark:text-red-400" />
                  </div>
                </div>
                <span className="text-sm text-gray-700 dark:text-gray-300 font-semibold leading-relaxed">{t('pricing.plans.standard.everythingInBasic')}</span>
              </li>
              <li className="flex items-start group">
                <div className="flex-shrink-0 mt-0.5 mr-3">
                  <div className="w-6 h-6 rounded-md bg-red-100 dark:bg-red-900/30 flex items-center justify-center group-hover:bg-red-200 dark:group-hover:bg-red-900/50 transition-colors">
                    <Cloud className="w-4 h-4 text-red-600 dark:text-red-400" />
                  </div>
                </div>
                <span className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed font-medium">{t('pricing.plans.standard.features.cloudSync')}</span>
              </li>
              <li className="flex items-start group">
                <div className="flex-shrink-0 mt-0.5 mr-3">
                  <div className="w-6 h-6 rounded-md bg-red-100 dark:bg-red-900/30 flex items-center justify-center group-hover:bg-red-200 dark:group-hover:bg-red-900/50 transition-colors">
                    <FileText className="w-4 h-4 text-red-600 dark:text-red-400" />
                  </div>
                </div>
                <span className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed font-medium">{t('pricing.plans.standard.features.fullAnalysis')}</span>
              </li>
              <li className="flex items-start group">
                <div className="flex-shrink-0 mt-0.5 mr-3">
                  <div className="w-6 h-6 rounded-md bg-red-100 dark:bg-red-900/30 flex items-center justify-center group-hover:bg-red-200 dark:group-hover:bg-red-900/50 transition-colors">
                    <TrendingUp className="w-4 h-4 text-red-600 dark:text-red-400" />
                  </div>
                </div>
                <span className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed font-medium">{t('pricing.plans.standard.features.advancedAnalytics')}</span>
              </li>
              <li className="flex items-start group">
                <div className="flex-shrink-0 mt-0.5 mr-3">
                  <div className="w-6 h-6 rounded-md bg-red-100 dark:bg-red-900/30 flex items-center justify-center group-hover:bg-red-200 dark:group-hover:bg-red-900/50 transition-colors">
                    <Download className="w-4 h-4 text-red-600 dark:text-red-400" />
                  </div>
                </div>
                <span className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed font-medium">{t('pricing.plans.standard.features.unlimitedExports')}</span>
              </li>
              <li className="flex items-start group">
                <div className="flex-shrink-0 mt-0.5 mr-3">
                  <div className="w-6 h-6 rounded-md bg-red-100 dark:bg-red-900/30 flex items-center justify-center group-hover:bg-red-200 dark:group-hover:bg-red-900/50 transition-colors">
                    <History className="w-4 h-4 text-red-600 dark:text-red-400" />
                  </div>
                </div>
                <span className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed font-medium">{t('pricing.plans.standard.features.assessmentHistory')}</span>
              </li>
              <li className="flex items-start group">
                <div className="flex-shrink-0 mt-0.5 mr-3">
                  <div className="w-6 h-6 rounded-md bg-red-100 dark:bg-red-900/30 flex items-center justify-center group-hover:bg-red-200 dark:group-hover:bg-red-900/50 transition-colors">
                    <Wrench className="w-4 h-4 text-red-600 dark:text-red-400" />
                  </div>
                </div>
                <span className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed font-medium">{t('pricing.plans.standard.features.expandedToolkit')}</span>
              </li>
              <li className="flex items-start group">
                <div className="flex-shrink-0 mt-0.5 mr-3">
                  <div className="w-6 h-6 rounded-md bg-red-100 dark:bg-red-900/30 flex items-center justify-center group-hover:bg-red-200 dark:group-hover:bg-red-900/50 transition-colors">
                    <Headphones className="w-4 h-4 text-red-600 dark:text-red-400" />
                  </div>
                </div>
                <span className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed font-medium">{t('pricing.plans.standard.features.prioritySupport')}</span>
              </li>
              <li className="flex items-start group">
                <div className="flex-shrink-0 mt-0.5 mr-3">
                  <div className="w-6 h-6 rounded-md bg-red-100 dark:bg-red-900/30 flex items-center justify-center group-hover:bg-red-200 dark:group-hover:bg-red-900/50 transition-colors">
                    <Briefcase className="w-4 h-4 text-red-600 dark:text-red-400" />
                  </div>
                </div>
                <span className="text-sm text-gray-700 dark:text-gray-300 font-semibold leading-relaxed">{t('pricing.plans.standard.features.professionalManagement')}</span>
              </li>
              <li className="flex items-start group">
                <div className="flex-shrink-0 mt-0.5 mr-3">
                  <div className="w-6 h-6 rounded-md bg-red-100 dark:bg-red-900/30 flex items-center justify-center group-hover:bg-red-200 dark:group-hover:bg-red-900/50 transition-colors">
                    <Rocket className="w-4 h-4 text-red-600 dark:text-red-400" />
                  </div>
                </div>
                <span className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed font-medium">{t('pricing.plans.standard.features.earlyAccess')}</span>
              </li>
              <li className="flex items-start group">
                <div className="flex-shrink-0 mt-0.5 mr-3">
                  <div className="w-6 h-6 rounded-md bg-red-100 dark:bg-red-900/30 flex items-center justify-center group-hover:bg-red-200 dark:group-hover:bg-red-900/50 transition-colors">
                    <Eye className="w-4 h-4 text-red-600 dark:text-red-400" />
                  </div>
                </div>
                <span className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed font-medium">{t('pricing.plans.standard.features.removeBranding')}</span>
              </li>
            </ul>
            <button
              onClick={() => handleCheckout('premium')}
              disabled={loading === 'premium'}
              className="w-full py-3 px-4 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading === 'premium' ? t('pricing.plans.standard.loading') : t('pricing.plans.standard.cta')}
            </button>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-3 text-center">
              Subscription is device/platform-specific. <a href="#platform-note" className="underline hover:text-gray-700 dark:hover:text-gray-300">Learn more</a>
            </p>
          </div>

        </div>

        {/* Platform-Specific Subscription Disclosure */}
        <div id="platform-note" className="max-w-3xl mx-auto mb-16">
          <div className="bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-200 dark:border-blue-800 rounded-xl p-6">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-blue-600 dark:bg-blue-700 rounded-lg flex items-center justify-center">
                  <Smartphone className="w-5 h-5 text-white" />
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                  Important: Platform-Specific Subscription
                </h3>
                <p className="text-sm text-gray-700 dark:text-gray-300 mb-3 leading-relaxed">
                  Due to our privacy-first design (no account required), your subscription is tied to the device and platform where you purchase it. This means:
                </p>
                <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                  <li className="flex items-start gap-2">
                    <Laptop className="w-4 h-4 mt-0.5 flex-shrink-0 text-blue-600 dark:text-blue-400" />
                    <span>Subscribing on this website gives you premium features on <strong>this browser/device only</strong></span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Smartphone className="w-4 h-4 mt-0.5 flex-shrink-0 text-blue-600 dark:text-blue-400" />
                    <span>For full mobile app features, download the app and subscribe through iOS App Store or Google Play</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Lock className="w-4 h-4 mt-0.5 flex-shrink-0 text-blue-600 dark:text-blue-400" />
                    <span>Your data stays local and private—but subscriptions do not sync across devices</span>
                  </li>
                </ul>
                <div className="mt-4 pt-4 border-t border-blue-200 dark:border-blue-700">
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    💡 <strong>Recommendation:</strong> Subscribe on the device you use most frequently for privacy management.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Use Case Scenarios */}
        <div className="mb-16">
          <h2 className="text-2xl sm:text-3xl font-bold text-center text-gray-900 dark:text-white mb-8">
            {t('pricing.useCases.title')}
          </h2>
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border-2 border-gray-200 dark:border-gray-700 shadow-md hover:shadow-lg transition-shadow">
              <div className="mb-4">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  {t('pricing.useCases.individual.title')}
                </h3>
              </div>
              <p className="text-gray-600 dark:text-gray-400 mb-5 leading-relaxed">
                {t('pricing.useCases.individual.description')}
              </p>
              <p className="font-semibold text-gray-900 dark:text-white mb-3">
                {t('pricing.useCases.individual.bestFor')}
              </p>
              <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-2.5 mb-5">
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                  <span className="leading-relaxed">{t('pricing.useCases.individual.items.quarterlyCheckups')}</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                  <span className="leading-relaxed">{t('pricing.useCases.individual.items.trackingServices')}</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                  <span className="leading-relaxed">{t('pricing.useCases.individual.items.basicImprovements')}</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                  <span className="leading-relaxed">{t('pricing.useCases.individual.items.singleDevice')}</span>
                </li>
              </ul>
              <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                <p className="text-lg font-bold text-blue-600 dark:text-blue-400">
                  {t('pricing.useCases.individual.recommendation')}
                </p>
              </div>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border-2 border-red-500 dark:border-red-600 shadow-md hover:shadow-lg transition-shadow relative">
              <div className="absolute -top-3 right-4 bg-red-600 text-white text-xs font-semibold px-3 py-1 rounded-full">
                {t('pricing.plans.standard.name')}
              </div>
              <div className="mb-4">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  {t('pricing.useCases.enthusiast.title')}
                </h3>
              </div>
              <p className="text-gray-600 dark:text-gray-400 mb-5 leading-relaxed">
                {t('pricing.useCases.enthusiast.description')}
              </p>
              <p className="font-semibold text-gray-900 dark:text-white mb-3">
                {t('pricing.useCases.enthusiast.bestFor')}
              </p>
              <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-2.5 mb-5">
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                  <span className="leading-relaxed">{t('pricing.useCases.enthusiast.items.monthlyAssessments')}</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                  <span className="leading-relaxed">{t('pricing.useCases.enthusiast.items.trackingManyServices')}</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                  <span className="leading-relaxed">{t('pricing.useCases.enthusiast.items.multiDevice')}</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                  <span className="leading-relaxed">{t('pricing.useCases.enthusiast.items.progressTracking')}</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                  <span className="leading-relaxed">{t('pricing.useCases.enthusiast.items.advancedAnalytics')}</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                  <span className="leading-relaxed">{t('pricing.useCases.enthusiast.items.earlyAccess')}</span>
                </li>
              </ul>
              <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                <p className="text-lg font-bold text-red-600 dark:text-red-400">
                  {t('pricing.useCases.enthusiast.recommendation')}
                </p>
              </div>
            </div>
          </div>
        </div>


        {/* FAQ Section - Simplified with link to full FAQ */}
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-center text-gray-900 dark:text-white mb-6">
            {t('pricing.faq.title')}
          </h2>
          <p className="text-center text-gray-600 dark:text-gray-400 mb-8">
            Have questions about our pricing plans? Visit our <a href="/faq" className="text-red-600 dark:text-red-400 hover:underline font-medium">FAQ page</a> for detailed answers to common questions.
          </p>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md border border-gray-200 dark:border-gray-700 text-center">
            <HelpCircle className="w-12 h-12 text-red-600 dark:text-red-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Still have questions?
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Check out our comprehensive FAQ page for answers to pricing, features, privacy, and more.
            </p>
            <button
              onClick={() => navigate('/faq')}
              className="inline-flex items-center px-6 py-3 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors"
            >
              View Full FAQ
              <ArrowRight className="w-5 h-5 ml-2" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PricingPage;

