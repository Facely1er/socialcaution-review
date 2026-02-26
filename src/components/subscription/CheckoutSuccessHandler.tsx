/**
 * Checkout Success Handler Component
 * Handles successful Stripe checkout redirects and updates subscription status
 */

import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CheckCircle, Loader2, AlertCircle, Download, Smartphone, ExternalLink } from 'lucide-react';
import subscriptionService from '../../services/subscriptionService';
import { useTranslation } from '../../contexts/TranslationContext';
import { APP_STORE_IOS, APP_STORE_ANDROID } from '../../config/appStores';

const CheckoutSuccessHandler = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  useTranslation(); // Keep provider mounted; use t in UI if needed
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('Processing your payment...');

  useEffect(() => {
    const handleSuccess = async () => {
      try {
        const sessionId = searchParams.get('session_id');
        const product = searchParams.get('product');
        const success = searchParams.get('success');

        if (!success || success !== 'true') {
          setStatus('error');
          setMessage('Payment was not successful. Please try again.');
          return;
        }

        if (product) {
          // One-time product purchase
          await subscriptionService.handleProductPurchaseSuccess(product);
          setMessage('Product purchased successfully!');
        } else if (sessionId) {
          // Subscription purchase
          await subscriptionService.handleCheckoutSuccess(sessionId);
          setMessage('Subscription activated successfully!');
        } else {
          setStatus('error');
          setMessage('Invalid checkout session. Please contact support.');
          return;
        }

        setStatus('success');

        // Redirect to dashboard after 3 seconds
        setTimeout(() => {
          navigate('/dashboard');
        }, 3000);
      } catch (error) {
        if (import.meta.env.DEV) {
          console.error('Error processing checkout success:', error);
        }
        setStatus('error');
        setMessage('There was an error processing your payment. Please contact support if the issue persists.');
      }
    };

    handleSuccess();
  }, [searchParams, navigate]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center p-8">
          <Loader2 className="w-16 h-16 text-blue-600 animate-spin mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Processing...
          </h2>
          <p className="text-gray-600 dark:text-gray-400">{message}</p>
        </div>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center p-8 max-w-md">
          <AlertCircle className="w-16 h-16 text-red-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Payment Error
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">{message}</p>
          <div className="flex gap-4 justify-center">
            <button
              onClick={() => navigate('/pricing')}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Back to Pricing
            </button>
            <button
              onClick={() => navigate('/dashboard')}
              className="px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg font-medium hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            >
              Go to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
      <div className="max-w-2xl w-full">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-8">
          {/* Success Header */}
          <div className="text-center mb-8">
            <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Payment Successful!
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400">{message}</p>
          </div>

          {/* App Download Section */}
          <div className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl p-6 mb-6 border border-blue-200 dark:border-blue-800">
            <div className="flex items-start gap-4 mb-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center">
                  <Smartphone className="w-6 h-6 text-white" />
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  Download the App for Full Access
                </h3>
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  Your subscription is active! Download our mobile app to access all premium features, including push notifications, offline access, and advanced privacy tools.
                </p>
              </div>
            </div>

            {/* App Store Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <a
                href={APP_STORE_IOS}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-3 px-6 py-3 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 rounded-lg hover:opacity-90 transition-all font-semibold"
                aria-label="Download on the App Store"
              >
                <Download className="w-5 h-5" />
                <span>App Store</span>
                <ExternalLink className="w-4 h-4" />
              </a>
              <a
                href={APP_STORE_ANDROID}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-3 px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-all font-semibold"
                aria-label="Get it on Google Play"
              >
                <Download className="w-5 h-5" />
                <span>Google Play</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Platform-specific note */}
          <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4 mb-6">
            <p className="text-sm text-amber-900 dark:text-amber-200">
              <strong>Note:</strong> Your subscription is tied to this device/platform. For the best experience, download the app on the device you'll use most frequently.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => navigate('/dashboard')}
              className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Continue to Dashboard
            </button>
            <button
              onClick={() => navigate('/download')}
              className="flex-1 px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg font-medium hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            >
              View Download Page
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutSuccessHandler;

