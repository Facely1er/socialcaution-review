import React from 'react';
import { ExternalLink, Shield, TrendingUp } from 'lucide-react';
import { getAffiliateUrl } from '../../config/affiliates';
import { analytics } from '../../utils/analytics';

const AffiliatePartnerCard = ({ partner, onPartnerClick }) => {
  const handleClick = () => {
    // Track affiliate click
    if (analytics && analytics.trackEvent) {
      analytics.trackEvent('affiliate_click', {
        partner_id: partner.id,
        partner_name: partner.name,
        category: partner.category,
      });
    }
    
    if (onPartnerClick) {
      onPartnerClick(partner);
    }
    
    // Open affiliate link
    const affiliateUrl = getAffiliateUrl(partner.id);
    if (affiliateUrl) {
      window.open(affiliateUrl, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center">
          <Shield className="w-8 h-8 text-blue-600 dark:text-blue-400 mr-3" />
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {partner.name}
            </h3>
            {partner.featured && (
              <span className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded mt-1 inline-block">
                Recommended
              </span>
            )}
          </div>
        </div>
        <TrendingUp className="w-5 h-5 text-green-500" />
      </div>
      
      <p className="text-gray-600 dark:text-gray-400 mb-4 text-sm">
        {partner.description}
      </p>
      
      <div className="flex items-center justify-between">
        <span className="text-xs text-gray-500 dark:text-gray-400">
          {partner.commission}% commission
        </span>
        <button
          onClick={handleClick}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
        >
          Learn More
          <ExternalLink className="w-4 h-4 ml-2" />
        </button>
      </div>
    </div>
  );
};

export default AffiliatePartnerCard;

