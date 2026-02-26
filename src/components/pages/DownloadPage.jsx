import React from 'react';
import { Download, Smartphone, ExternalLink } from 'lucide-react';
import SEOHead from '../common/SEOHead';
import EnhancedBreadcrumbs from '../common/EnhancedBreadcrumbs';
import { APP_STORE_IOS, APP_STORE_ANDROID } from '../../config/appStores';
import { Link } from 'react-router-dom';

/**
 * Download Page - App Store links for SocialCaution mobile app
 * Used when users scan QR codes or visit /download directly
 */
const DownloadPage = () => {
  return (
    <>
      <SEOHead
        title="Download SocialCaution - App Store & Google Play"
        description="Download the SocialCaution privacy app for iOS and Android. Monitor your digital footprint, get privacy alerts, and protect your data on the go."
        keywords="download SocialCaution, privacy app, App Store, Google Play, iOS, Android"
      />
      <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
        <section className="pt-8 sm:pt-12 pb-12 bg-gradient-to-br from-gray-50 via-purple-50/30 to-gray-50 dark:from-slate-900 dark:via-purple-950/20 dark:to-slate-900">
          <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
            <EnhancedBreadcrumbs
              className="mb-6"
              customBreadcrumbs={[
                { name: 'Download', href: '/download', current: true }
              ]}
            />
            <div className="text-center mb-8">
              <div className="flex items-center justify-center gap-3 mb-4">
                <Smartphone className="w-10 h-10 text-purple-600 dark:text-purple-400" />
                <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">
                  Download SocialCaution
                </h1>
              </div>
              <p className="text-lg text-gray-600 dark:text-gray-300">
                Get the full privacy experience on your phone. Push notifications, offline access, and all premium features.
              </p>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-gray-200 dark:border-slate-700 p-8">
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-stretch">
                <a
                  href={APP_STORE_IOS}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-3 px-6 py-4 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 rounded-xl hover:opacity-90 transition-all font-semibold"
                  aria-label="Download SocialCaution on the App Store"
                >
                  <Download className="w-6 h-6" />
                  <span>App Store</span>
                  <ExternalLink className="w-4 h-4" />
                </a>
                <a
                  href={APP_STORE_ANDROID}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-3 px-6 py-4 bg-green-600 hover:bg-green-700 text-white rounded-xl transition-all font-semibold"
                  aria-label="Get SocialCaution on Google Play"
                >
                  <Download className="w-6 h-6" />
                  <span>Google Play</span>
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </div>

            <p className="text-center mt-6 text-sm text-gray-500 dark:text-gray-400">
              <Link to="/" className="text-purple-600 dark:text-purple-400 hover:underline">
                Continue to website
              </Link>
            </p>
          </div>
        </section>
      </div>
    </>
  );
};

export default DownloadPage;
