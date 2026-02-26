/**
 * Paywall Component
 * 
 * Reusable paywall component that:
 * - Shows free preview content
 * - Blurs/locks premium content
 * - Provides CTA to Stripe Payment Link
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, ArrowRight, Sparkles, Loader2 } from 'lucide-react';
import { getStripePaymentLink, PRODUCT_DOWNLOADS, hasProductAccess, getFreeUsesRemaining } from '../../config/products';

const Paywall = ({
  productId,
  freePreview,
  lockedContent,
  ctaText = null,
  compact = false,
  showBlur = true,
  customTitle = null, // Custom paywall title
  customBody = null // Custom paywall body text
}) => {
  const navigate = useNavigate();
  const product = PRODUCT_DOWNLOADS[productId];
  const paymentLink = getStripePaymentLink(productId);
  const [hasAccess, setHasAccess] = useState(false);
  const [isCheckingAccess, setIsCheckingAccess] = useState(true);
  const [freeUsesRemaining, setFreeUsesRemaining] = useState(0);
  
  // Check if this is an AI tool (included in Standard Plan)
  const isAITool = ['ai_image_analyzer', 'ai_email_analyzer', 'ai_profile_verifier'].includes(productId);
  const isSubscriptionProduct = isAITool; // AI tools are subscription products

  useEffect(() => {
    // Check if user has access to this product
    const checkAccess = async () => {
      setIsCheckingAccess(true);
      try {
        const access = await hasProductAccess(productId);
        setHasAccess(access);
        
        // Check free uses for AI tools
        if (isAITool) {
          const freeUses = getFreeUsesRemaining(productId);
          setFreeUsesRemaining(freeUses);
        }
      } catch (error) {
        console.error('Error checking product access:', error);
        setHasAccess(false);
      } finally {
        setIsCheckingAccess(false);
      }
    };
    
    checkAccess();
  }, [productId, isAITool]);

  if (!product) {
    console.error(`Product ${productId} not found in PRODUCT_DOWNLOADS`);
    return null;
  }

  // If user has access, show unlocked content without paywall
  if (!isCheckingAccess && hasAccess) {
    return (
      <div className="relative">
        {/* Free Preview */}
        {freePreview && <div className="mb-4">{freePreview}</div>}
        
        {/* Unlocked Content */}
        {lockedContent && (
          <div className="relative">
            {lockedContent}
          </div>
        )}
      </div>
    );
  }

  // Show loading state while checking access
  if (isCheckingAccess) {
    return (
      <div className="relative">
        {freePreview && <div className="mb-4">{freePreview}</div>}
        <div className="flex items-center justify-center p-8">
          <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
        </div>
      </div>
    );
  }

  const defaultCtaText = ctaText || (isSubscriptionProduct ? 'Upgrade to Standard Plan' : `Download ${product.name}`);
  const hasPaymentLink = paymentLink && paymentLink.trim() !== '';

  const handlePurchase = () => {
    // For subscription products (AI tools), redirect to pricing page
    if (isSubscriptionProduct) {
      navigate('/pricing');
      return;
    }

    // For one-time products, use Stripe Payment Link
    if (hasPaymentLink) {
      window.open(paymentLink, '_blank');
    } else {
      console.warn(`Payment link not configured for ${productId}`);
      alert('Payment link not configured. Please contact support.');
    }
  };

  if (compact) {
    return (
      <div className="relative">
        {/* Free Preview */}
        {freePreview}

        {/* Locked Content with Blur */}
        {lockedContent && (
          <div className="relative mt-4">
            {showBlur && (
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/80 to-white dark:via-slate-900/80 dark:to-slate-900 backdrop-blur-sm z-10 rounded-lg" />
            )}
            <div className={`${showBlur ? 'opacity-30' : ''} pointer-events-none`}>
              {lockedContent}
            </div>
            
            {/* Lock Overlay */}
            <div className="absolute inset-0 flex flex-col items-center justify-center z-20">
            <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-xl border border-gray-200 dark:border-slate-700 max-w-sm mx-4">
              {isAITool && freeUsesRemaining > 0 && (
                <div className="mb-4 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                  <p className="text-sm text-green-800 dark:text-green-200 font-medium text-center">
                    🎁 You have <strong>1 free use</strong> remaining! Try it now.
                  </p>
                </div>
              )}
              <div className="text-center mb-4">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full mb-3">
                  <Lock className="w-8 h-8 text-red-600 dark:text-red-400" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                  Unlock Full Report
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                  Get detailed insights, risk breakdown, and personalized action plan
                </p>
              </div>
              <button
                onClick={handlePurchase}
                disabled={!isSubscriptionProduct && !hasPaymentLink}
                className="w-full px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-semibold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubscriptionProduct ? (
                  <>
                    <Sparkles className="w-5 h-5" />
                    {defaultCtaText}
                    <ArrowRight className="w-5 h-5" />
                  </>
                ) : hasPaymentLink ? (
                  <>
                    <Sparkles className="w-5 h-5" />
                    {defaultCtaText}
                    <ArrowRight className="w-5 h-5" />
                  </>
                ) : (
                  'Payment Link Not Configured'
                )}
              </button>
                {product.price && (
                  <p className="text-xs text-center text-gray-500 dark:text-gray-400 mt-2">
                    ${product.price} one-time purchase
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Free Preview */}
      <div className="mb-4">
        {freePreview}
      </div>

      {/* Locked Content with Blur */}
      {lockedContent && (
        <div className="relative">
          {showBlur && (
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/90 to-white dark:via-slate-900/90 dark:to-slate-900 backdrop-blur-md z-10 rounded-lg" />
          )}
          <div className={`${showBlur ? 'opacity-20' : ''} pointer-events-none`}>
            {lockedContent}
          </div>
          
          {/* Lock Overlay */}
          <div className="absolute inset-0 flex flex-col items-center justify-center z-20 min-h-[300px]">
            <div className="bg-white dark:bg-slate-800 rounded-xl p-8 shadow-2xl border-2 border-red-200 dark:border-red-800 max-w-md mx-4">
              {isAITool && freeUsesRemaining > 0 && (
                <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                  <p className="text-sm text-green-800 dark:text-green-200 font-medium text-center">
                    🎁 You have <strong>1 free use</strong> remaining! Try it now to see how it works.
                  </p>
                </div>
              )}
              <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-red-100 dark:bg-red-900/30 rounded-full mb-4">
                  <Lock className="w-10 h-10 text-red-600 dark:text-red-400" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                  {customTitle || `Unlock Full ${product.name}`}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                  {customBody || product.description}
                </p>
                {product.price && product.price > 0 && (
                  <p className="text-lg font-semibold text-red-600 dark:text-red-400 mt-2">
                    ${product.price}
                  </p>
                )}
              </div>
              <button
                onClick={handlePurchase}
                disabled={!isSubscriptionProduct && !hasPaymentLink}
                className="w-full px-6 py-4 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all transform hover:scale-105 font-bold text-lg flex items-center justify-center gap-3 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubscriptionProduct ? (
                  <>
                    <Sparkles className="w-6 h-6" />
                    {defaultCtaText}
                    <ArrowRight className="w-6 h-6" />
                  </>
                ) : hasPaymentLink ? (
                  <>
                    <Sparkles className="w-6 h-6" />
                    {defaultCtaText}
                    <ArrowRight className="w-6 h-6" />
                  </>
                ) : (
                  'Payment Link Not Configured'
                )}
              </button>
              <p className="text-xs text-center text-gray-500 dark:text-gray-400 mt-4">
                {isSubscriptionProduct 
                  ? 'Included in Standard Plan subscription • Unlimited access'
                  : 'Secure payment via Stripe • One-time purchase • Instant download'
                }
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Paywall;
