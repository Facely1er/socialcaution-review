/**
 * Subscription Management Component
 * Allows users to manage their subscription, view status, and access customer portal
 */

import { useState, useEffect } from 'react';
import { CreditCard, Calendar, Users, Sparkles, AlertCircle, ExternalLink } from 'lucide-react';
import subscriptionService, { SubscriptionStatus } from '../../services/subscriptionService';
import { PRODUCTS } from '../../config/stripe';
import EncryptionSetup from './EncryptionSetup';

interface SubscriptionManagementProps {
  className?: string;
}

const SubscriptionManagement = ({ className = '' }: SubscriptionManagementProps) => {
  const [subscription, setSubscription] = useState<SubscriptionStatus>(
    subscriptionService.getSubscriptionStatus()
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Refresh subscription status asynchronously to avoid synchronous setState in effect
    const id = setTimeout(() => {
      setSubscription(subscriptionService.getSubscriptionStatus());
    }, 0);
    return () => clearTimeout(id);
  }, []);

  const handleManageSubscription = async () => {
    setLoading(true);
    setError(null);

    try {
      await subscriptionService.openCustomerPortal(window.location.href);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to open customer portal');
      setLoading(false);
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    } catch {
      return dateString;
    }
  };

  const getTierInfo = () => {
    if (subscription.tier === 'free') {
      return {
        name: 'Free',
        icon: Users,
        color: 'text-gray-600 dark:text-gray-400',
        bgColor: 'bg-gray-100 dark:bg-gray-800',
      };
    }
    if (subscription.tier === 'premium') {
      return {
        name: 'Premium',
        icon: Sparkles,
        color: 'text-blue-600 dark:text-blue-400',
        bgColor: 'bg-blue-100 dark:bg-blue-900',
      };
    }
    return {
      name: 'Family Plan',
      icon: Users,
      color: 'text-pink-600 dark:text-pink-400',
      bgColor: 'bg-pink-100 dark:bg-pink-900',
    };
  };

  const tierInfo = getTierInfo();
  const Icon = tierInfo.icon;
  const isActive = subscription.status === 'active';
  const product = subscription.tier !== 'free' ? PRODUCTS[subscription.tier] : null;

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 ${className}`}>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className={`p-3 rounded-lg ${tierInfo.bgColor}`}>
            <Icon className={`w-6 h-6 ${tierInfo.color}`} />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
              {tierInfo.name} Plan
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Status: <span className={isActive ? 'text-green-600' : 'text-yellow-600'}>
                {subscription.status.charAt(0).toUpperCase() + subscription.status.slice(1)}
              </span>
            </p>
          </div>
        </div>
      </div>

      {subscription.tier !== 'free' && (
        <>
          <div className="space-y-4 mb-6">
            {subscription.currentPeriodEnd && (
              <div className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
                <Calendar className="w-5 h-5" />
                <span className="text-sm">
                  {subscription.cancelAtPeriodEnd
                    ? `Cancels on ${formatDate(subscription.currentPeriodEnd)}`
                    : `Renews on ${formatDate(subscription.currentPeriodEnd)}`}
                </span>
              </div>
            )}

            {product && (
              <div className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
                <CreditCard className="w-5 h-5" />
                <span className="text-sm">
                  ${product.price}/{product.interval === 'month' ? 'month' : 'year'}
                </span>
              </div>
            )}
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-red-600" />
              <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            </div>
          )}

          <button
            onClick={handleManageSubscription}
            disabled={loading}
            className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Opening...
              </>
            ) : (
              <>
                Manage Subscription
                <ExternalLink className="w-4 h-4" />
              </>
            )}
          </button>

          <p className="mt-3 text-xs text-gray-500 dark:text-gray-400 text-center">
            Manage billing, update payment method, or cancel your subscription
          </p>

          <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
            <EncryptionSetup />
          </div>
        </>
      )}

      {subscription.tier === 'free' && (
        <div className="text-center py-4">
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Upgrade to Premium or Family Plan to unlock advanced features
          </p>
          <a
            href="/pricing"
            className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            View Pricing Plans
          </a>
        </div>
      )}
    </div>
  );
};

export default SubscriptionManagement;

