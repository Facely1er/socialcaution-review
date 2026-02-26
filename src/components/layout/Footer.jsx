import { Shield, Users, Code } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Target, BookOpen, Wrench, Scale, FileText, Mail, Phone, Globe, ShieldCheck, UserCheck, Database, Eye, AlertTriangle, Cookie, Ban, Calculator, LayoutDashboard, Gauge, User, DollarSign, Settings, LifeBuoy, CheckCircle2, Smartphone } from 'lucide-react';
import { useTranslation } from '../../contexts/TranslationContext';
import { useCookieConsent } from '../../contexts/CookieConsentContext';
import { APP_STORE_IOS } from '../../config/appStores';

// Footer component with all navigation links
// All links are verified to match routes in App.tsx

const Footer = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { openPreferences } = useCookieConsent();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-100 dark:bg-slate-800 text-gray-900 dark:text-white pt-3 pb-2 sm:pt-4 sm:pb-2 border-t border-gray-200 dark:border-slate-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-4 sm:gap-6 lg:gap-8 mb-2 sm:mb-3">
          {/* Brand and About - Takes 4 columns on large screens */}
          <div className="space-y-2 lg:col-span-4 lg:pr-6">
            <div 
              className="flex items-center space-x-0.5 sm:space-x-1 mb-2 group cursor-pointer"
              onClick={() => navigate('/')}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); navigate('/'); } }}
              aria-label="Navigate to homepage"
            >
              <img 
                src="/socialcaution.png" 
                alt="SocialCaution Logo" 
                className="w-8 h-8 min-[375px]:w-9 min-[375px]:h-9 sm:w-10 sm:h-10 md:w-11 md:h-11 rounded-lg flex-shrink-0 border-2 border-gray-200 dark:border-slate-700 shadow-md dark:shadow-lg brightness-110 contrast-110 saturate-110 group-hover:brightness-120 group-hover:contrast-115 group-hover:saturate-125 transition-all duration-300"
              />
              <div className="min-w-0">
                <h3 className="text-xs sm:text-sm font-bold tracking-widest drop-shadow-sm truncate" style={{ lineHeight: '1.1' }}>
                  <span className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 dark:from-white dark:via-gray-100 dark:to-white bg-clip-text text-transparent group-hover:from-red-600 group-hover:via-red-500 group-hover:to-red-600 transition-all duration-500">Social</span>
                  <span className="text-yellow-500 dark:text-yellow-400 group-hover:text-yellow-600 dark:group-hover:text-yellow-300 transition-colors duration-500">Caution</span>
                  <span className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 dark:from-white dark:via-gray-100 dark:to-white bg-clip-text text-transparent group-hover:from-red-600 group-hover:via-red-500 group-hover:to-red-600 transition-all duration-500">™</span>
                </h3>
                <div className="text-xs sm:text-sm font-semibold tracking-tighter text-red-600 dark:text-red-400 truncate" style={{ lineHeight: '1.2', marginTop: '0.05em' }}>
                  {t('common.brand.line1')}
                </div>
                <div className="text-[10px] sm:text-xs font-normal text-gray-600 dark:text-gray-400 truncate" style={{ lineHeight: '1.2', marginTop: '0.1em' }}>
                  {t('common.brand.tagline')}
                </div>
              </div>
            </div>
            <p className="text-gray-600 dark:text-gray-300 text-xs sm:text-sm leading-snug max-w-md">
              {t('footer.description')}
            </p>
          </div>

          {/* Services & Tools */}
          <div className="lg:col-span-2 lg:pl-2">
            <h4 className="text-base font-semibold text-gray-900 dark:text-white mb-1">{t('footer.sections.privacyServices') || 'Services & Tools'}</h4>
            <ul className="space-y-0">
              <li>
                <Link 
                  to="/service-catalog" 
                  className="flex items-center text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-white transition-colors group py-0.5 min-h-[20px] touch-manipulation cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                >
                  <Shield className="w-3.5 h-3.5 mr-1.5 text-indigo-500 dark:text-indigo-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-300 flex-shrink-0" />
                  <span className="text-xs whitespace-nowrap">{t('footer.links.serviceCatalog')}</span>
                </Link>
              </li>
              <li>
                <Link 
                  to="/assessment" 
                  className="flex items-center text-gray-700 dark:text-gray-300 hover:text-green-600 dark:hover:text-white transition-colors group py-0.5 min-h-[20px] touch-manipulation cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                >
                  <Target className="w-3.5 h-3.5 mr-1.5 text-green-500 dark:text-green-400 group-hover:text-green-600 dark:group-hover:text-green-300 flex-shrink-0" />
                  <span className="text-xs whitespace-nowrap">{t('footer.links.privacyAssessments')}</span>
                </Link>
              </li>
              <li>
                <Link 
                  to="/dashboard" 
                  className="flex items-center text-gray-700 dark:text-gray-300 hover:text-orange-600 dark:hover:text-white transition-colors group py-0.5 min-h-[20px] touch-manipulation cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                >
                  <LayoutDashboard className="w-3.5 h-3.5 mr-1.5 text-orange-500 dark:text-orange-400 group-hover:text-orange-600 dark:group-hover:text-orange-300 flex-shrink-0" />
                  <span className="text-xs whitespace-nowrap">{t('footer.links.privacyDashboard')}</span>
                </Link>
              </li>
              <li>
                <Link 
                  to="/toolkit-access" 
                  className="flex items-center text-gray-700 dark:text-gray-300 hover:text-cyan-600 dark:hover:text-white transition-colors group py-0.5 min-h-[20px] touch-manipulation cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                >
                  <Wrench className="w-3.5 h-3.5 mr-1.5 text-cyan-500 dark:text-cyan-400 group-hover:text-cyan-600 dark:group-hover:text-cyan-300 flex-shrink-0" />
                  <span className="text-xs whitespace-nowrap">{t('footer.links.privacyToolkit')}</span>
                </Link>
              </li>
              <li>
                <Link 
                  to="/pricing" 
                  className="flex items-center text-gray-700 dark:text-gray-300 hover:text-green-600 dark:hover:text-white transition-colors group py-0.5 min-h-[20px] touch-manipulation cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                >
                  <DollarSign className="w-3.5 h-3.5 mr-1.5 text-green-500 dark:text-green-400 group-hover:text-green-600 dark:group-hover:text-green-300 flex-shrink-0" />
                  <span className="text-xs whitespace-nowrap">{t('footer.links.pricing')}</span>
                </Link>
              </li>
              <li>
                <Link 
                  to="/settings" 
                  className="flex items-center text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-white transition-colors group py-0.5 min-h-[20px] touch-manipulation cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                >
                  <Settings className="w-3.5 h-3.5 mr-1.5 text-indigo-500 dark:text-indigo-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-300 flex-shrink-0" />
                  <span className="text-xs whitespace-nowrap">{t('footer.links.settings')}</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div className="lg:col-span-2 lg:pl-2">
            <h4 className="text-base font-semibold text-gray-900 dark:text-white mb-1">{t('footer.sections.legal')}</h4>
            <ul className="space-y-0">
              <li>
                <Link 
                  to="/privacy-policy" 
                  className="flex items-center text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-white transition-colors group py-0.5 min-h-[20px] touch-manipulation cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                >
                  <ShieldCheck className="w-3.5 h-3.5 mr-1.5 text-purple-500 dark:text-purple-400 group-hover:text-purple-600 dark:group-hover:text-purple-300 flex-shrink-0" />
                  <span className="text-xs whitespace-nowrap">{t('footer.links.privacyPolicy')}</span>
                </Link>
              </li>
              <li>
                <Link 
                  to="/terms" 
                  className="flex items-center text-gray-700 dark:text-gray-300 hover:text-orange-600 dark:hover:text-white transition-colors group py-0.5 min-h-[20px] touch-manipulation cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                >
                  <FileText className="w-3.5 h-3.5 mr-1.5 text-orange-500 dark:text-orange-400 group-hover:text-orange-600 dark:group-hover:text-orange-300 flex-shrink-0" />
                  <span className="text-xs whitespace-nowrap">{t('footer.links.termsOfService')}</span>
                </Link>
              </li>
              <li>
                <Link 
                  to="/cookie-policy" 
                  className="flex items-center text-gray-700 dark:text-gray-300 hover:text-yellow-600 dark:hover:text-white transition-colors group py-0.5 min-h-[20px] touch-manipulation cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                >
                  <Cookie className="w-3.5 h-3.5 mr-1.5 text-yellow-500 dark:text-yellow-400 group-hover:text-yellow-600 dark:group-hover:text-yellow-300 flex-shrink-0" />
                  <span className="text-xs whitespace-nowrap">{t('footer.links.cookiePolicy')}</span>
                </Link>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => openPreferences()}
                  className="flex items-center w-full text-left text-gray-700 dark:text-gray-300 hover:text-yellow-600 dark:hover:text-white transition-colors group py-0.5 min-h-[20px] touch-manipulation cursor-pointer"
                >
                  <Settings className="w-3.5 h-3.5 mr-1.5 text-yellow-500 dark:text-yellow-400 group-hover:text-yellow-600 dark:group-hover:text-yellow-300 flex-shrink-0" />
                  <span className="text-xs whitespace-nowrap">{t('cookieBanner.cookiePreferences')}</span>
                </button>
              </li>
              <li>
                <Link 
                  to="/acceptable-use-policy" 
                  className="flex items-center text-gray-700 dark:text-gray-300 hover:text-red-600 dark:hover:text-white transition-colors group py-0.5 min-h-[20px] touch-manipulation cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                >
                  <Ban className="w-3.5 h-3.5 mr-1.5 text-red-500 dark:text-red-400 group-hover:text-red-600 dark:group-hover:text-red-300 flex-shrink-0" />
                  <span className="text-xs whitespace-nowrap">{t('footer.links.acceptableUsePolicy')}</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div className="lg:col-span-4 lg:pl-4">
            <h4 className="text-base font-semibold text-gray-900 dark:text-white mb-1">{t('footer.sections.resources')}</h4>
            <ul className="space-y-0">
              <li>
                <a
                  href={APP_STORE_IOS}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-white transition-colors group py-0.5 min-h-[20px] touch-manipulation cursor-pointer"
                >
                  <Smartphone className="w-3.5 h-3.5 mr-1.5 text-indigo-500 dark:text-indigo-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-300 flex-shrink-0" />
                  <span className="text-xs whitespace-nowrap">{t('footer.links.downloadApp') || 'Download App'}</span>
                </a>
              </li>
              <li>
                <Link 
                  to="/privacy-exposure-disclaimer" 
                  className="flex items-center text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-white transition-colors group py-0.5 min-h-[20px] touch-manipulation cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                >
                  <Calculator className="w-3.5 h-3.5 mr-1.5 text-indigo-500 dark:text-indigo-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-300 flex-shrink-0" />
                  <span className="text-xs whitespace-nowrap">{t('footer.links.exposureIndexMethodology')}</span>
                </Link>
              </li>
              <li>
                <Link 
                  to="/privacy-tools" 
                  className="flex items-center text-gray-700 dark:text-gray-300 hover:text-green-600 dark:hover:text-white transition-colors group py-0.5 min-h-[20px] touch-manipulation cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                >
                  <Globe className="w-3.5 h-3.5 mr-1.5 text-green-500 dark:text-green-400 group-hover:text-green-600 dark:group-hover:text-green-300 flex-shrink-0" />
                  <span className="text-xs whitespace-nowrap">{t('footer.links.externalTools')}</span>
                </Link>
              </li>
              <li>
                <Link 
                  to="/support" 
                  className="flex items-center text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-white transition-colors group py-0.5 min-h-[20px] touch-manipulation cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                >
                  <LifeBuoy className="w-3.5 h-3.5 mr-1.5 text-indigo-500 dark:text-indigo-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-300 flex-shrink-0" />
                  <span className="text-xs whitespace-nowrap">{t('footer.links.support') || 'Support'}</span>
                </Link>
              </li>
              <li>
                <Link 
                  to="/contact" 
                  className="flex items-center text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-white transition-colors group py-0.5 min-h-[20px] touch-manipulation cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                >
                  <Mail className="w-3.5 h-3.5 mr-1.5 text-blue-500 dark:text-blue-400 group-hover:text-blue-600 dark:group-hover:text-blue-300 flex-shrink-0" />
                  <span className="text-xs whitespace-nowrap">{t('footer.links.contactUs')}</span>
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-300 dark:border-slate-700 pt-2 mt-2">
          <div className="flex flex-col md:flex-row justify-between items-center gap-3">
            {/* Left side - Tags */}
            <div className="flex flex-wrap items-center gap-3 justify-center md:justify-start">
              {/* Local browser-based analysis tag */}
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-green-100 dark:bg-green-900/30 rounded-lg border border-green-200 dark:border-green-800">
                <div className="relative flex items-center justify-center w-5 h-5 bg-blue-500 rounded-full">
                  <Settings className="w-3 h-3 text-white" />
                  <CheckCircle2 className="w-2.5 h-2.5 text-white absolute -bottom-0.5 -right-0.5 bg-blue-500 rounded-full" />
                </div>
                <span className="text-xs font-medium text-gray-700 dark:text-gray-300">Local browser-based analysis</span>
              </div>
              
              {/* Version tag */}
              <div className="inline-flex items-center gap-2 px-3 py-1.5 text-gray-600 dark:text-gray-400">
                <CheckCircle2 className="w-4 h-4 text-blue-500 dark:text-blue-400" />
                <span className="text-xs font-medium">Version 1.0</span>
              </div>
            </div>

            {/* Right side - Copyright */}
            <div className="text-xs text-gray-600 dark:text-gray-400 text-center md:text-right">
              {(() => {
                const copyrightText = t('footer.copyright', { year: currentYear });
                // Split by "ERMITS LLC" to make it a link
                const ermitsIndex = copyrightText.indexOf('ERMITS LLC');
                if (ermitsIndex !== -1) {
                  const before = copyrightText.substring(0, ermitsIndex);
                  const after = copyrightText.substring(ermitsIndex + 'ERMITS LLC'.length);
                  return (
                    <>
                      {before}
                      <a 
                        href="https://www.ermits.com" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors underline cursor-pointer font-medium"
                      >
                        ERMITS LLC
                      </a>
                      {after}
                    </>
                  );
                }
                return copyrightText;
              })()}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;