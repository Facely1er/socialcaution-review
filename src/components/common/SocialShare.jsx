import React, { useState } from 'react';
import { Share2, Facebook, Twitter, Linkedin, Copy, Check, Link as LinkIcon } from 'lucide-react';
import { analytics } from '../../utils/analytics';

const SocialShare = ({ 
  type = 'persona', // 'persona' or 'service'
  data = null, // persona object or service object
  className = ''
}) => {
  const [copied, setCopied] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  if (!data) return null;

  const getShareText = () => {
    if (type === 'persona') {
      return `I'm a ${data.name} - discover your privacy persona at SocialCaution! 🔒`;
    } else if (type === 'service') {
      return `Check out ${data.name}'s privacy risks on SocialCaution - understand your digital footprint! 🔒`;
    }
    return 'Check out SocialCaution - your privacy protection companion! 🔒';
  };

  const getShareUrl = () => {
    const baseUrl = window.location.origin;
    if (type === 'persona') {
      return `${baseUrl}/privacy-settings?persona=${data.id || data.primary}`;
    } else if (type === 'service') {
      return `${baseUrl}/service-catalog?service=${data.id}`;
    }
    return baseUrl;
  };

  const handleShare = (platform) => {
    const url = getShareUrl();
    const text = getShareText();
    let shareUrl = '';

    switch (platform) {
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
        break;
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(text)}`;
        break;
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
        break;
      default:
        return;
    }

    // Track share event
    if (analytics && typeof analytics.trackEvent === 'function') {
      analytics.trackEvent('social_share', {
        platform,
        type,
        item_id: data.id || data.primary,
        item_name: data.name
      });
    }

    window.open(shareUrl, '_blank', 'width=600,height=400');
    setShowMenu(false);
  };

  const handleCopyLink = async () => {
    const url = getShareUrl();
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      
      // Track copy event
      if (analytics && typeof analytics.trackEvent === 'function') {
        analytics.trackEvent('link_copied', {
          type,
          item_id: data.id || data.primary,
          item_name: data.name
        });
      }

      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy link:', err);
    }
    setShowMenu(false);
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: type === 'persona' ? `I'm a ${data.name}` : `${data.name} Privacy Info`,
          text: getShareText(),
          url: getShareUrl()
        });

        // Track native share
        if (analytics && typeof analytics.trackEvent === 'function') {
          analytics.trackEvent('native_share', {
            type,
            item_id: data.id || data.primary,
            item_name: data.name
          });
        }
      } catch (err) {
        // User cancelled or error occurred
        if (err.name !== 'AbortError') {
          console.error('Error sharing:', err);
        }
      }
      setShowMenu(false);
    }
  };

  return (
    <div className={`relative ${className}`}>
      <button
        onClick={() => setShowMenu(!showMenu)}
        className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg transition-colors font-medium"
        aria-label="Share"
      >
        <Share2 className="w-4 h-4" />
        Share
      </button>

      {showMenu && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-10"
            onClick={() => setShowMenu(false)}
          />
          
          {/* Menu */}
          <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 z-20 py-2">
            {/* Native Share (Mobile) */}
            {navigator.share && (
              <button
                onClick={handleNativeShare}
                className="w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-3 text-gray-700 dark:text-gray-300"
              >
                <Share2 className="w-4 h-4" />
                Share via...
              </button>
            )}

            {/* Twitter */}
            <button
              onClick={() => handleShare('twitter')}
              className="w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-3 text-gray-700 dark:text-gray-300"
            >
              <Twitter className="w-4 h-4 text-blue-400" />
              Twitter
            </button>

            {/* Facebook */}
            <button
              onClick={() => handleShare('facebook')}
              className="w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-3 text-gray-700 dark:text-gray-300"
            >
              <Facebook className="w-4 h-4 text-blue-600" />
              Facebook
            </button>

            {/* LinkedIn */}
            <button
              onClick={() => handleShare('linkedin')}
              className="w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-3 text-gray-700 dark:text-gray-300"
            >
              <Linkedin className="w-4 h-4 text-blue-700" />
              LinkedIn
            </button>

            {/* Copy Link */}
            <button
              onClick={handleCopyLink}
              className="w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-3 text-gray-700 dark:text-gray-300 border-t border-gray-200 dark:border-gray-700 mt-1"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-green-500" />
                  <span className="text-green-600 dark:text-green-400">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  Copy Link
                </>
              )}
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default SocialShare;

