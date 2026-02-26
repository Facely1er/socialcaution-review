import { useState, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowRight, Target, Wrench, Users, LayoutDashboard, Menu, X, Home, AlertTriangle, Info, Sparkles, Shield, DollarSign, TrendingUp, Gauge, FileText, HelpCircle, BookOpen, Radar } from 'lucide-react';
import ThemeToggle from '../common/ThemeToggle';
import { useTranslation } from '../../contexts/TranslationContext';
import { LanguageSelector } from '../../contexts/TranslationContext';

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // Check if current path matches navigation item
  const isActive = (path) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  const handleAssessmentStart = (assessmentType) => {
    if (assessmentType === 'overview') {
      navigate('/assessment');
    } else {
      navigate(`/assessment/${assessmentType}`);
    }
  };

  const handleSignIn = () => {
    // Direct to service catalog (main lead magnet)
    navigate('/service-catalog');
  };

  // DO NOT REVERT: On home, header uses hero gradient so no visible strip between header and hero.
  const isHome = location.pathname === '/' || location.pathname === '';
  const headerBg = isHome
    ? 'bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900'
    : 'backdrop-blur-3xl bg-white/95 dark:bg-slate-900/95';

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 ${headerBg} shadow-none header-landscape header-no-strip overflow-x-hidden min-h-[44px] ${mobileMenuOpen ? 'md:flex md:items-center' : 'flex items-center'}`} style={{ borderBottom: 'none', zIndex: 50 }}>
      <div className={`max-w-7xl mx-auto px-2 sm:px-3 md:px-4 py-0 w-full header-container-landscape ${mobileMenuOpen ? 'flex flex-col' : 'flex items-center'} min-h-[44px]`}>
        {/* Top bar: logo (left) + actions (right) — single row, fixed height */}
        <div className="flex items-center justify-between gap-2 min-w-0 w-full min-h-[44px] flex-shrink-0 overflow-hidden">
          {/* Left: Logo and Branding — Do not modify: line1 "Your Data Matters" and tagline are by design. */}
          <div 
            className="flex items-center space-x-0.5 sm:space-x-1 group cursor-pointer flex-shrink-0 min-w-0 header-branding-landscape" 
            onClick={() => navigate('/')}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); navigate('/'); } }}
            aria-label="Navigate to homepage"
          >
            <img 
              src="/socialcaution.png" 
              alt="SocialCaution Logo" 
              className="w-6 h-6 min-[375px]:w-7 min-[375px]:h-7 sm:w-8 sm:h-8 md:w-9 md:h-9 flex-shrink-0 brightness-110 contrast-110 saturate-110 group-hover:brightness-120 group-hover:contrast-115 group-hover:saturate-125 transition-all duration-300 header-logo-landscape"
            />
            <div className="min-w-0 flex flex-col justify-center header-text-container-landscape">
              <h1 className="text-[10px] sm:text-xs font-bold tracking-widest drop-shadow-sm truncate header-title-landscape" style={{ lineHeight: '1.05', margin: 0 }}>
                <span className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 dark:from-white dark:via-gray-100 dark:to-white bg-clip-text text-transparent group-hover:from-red-600 group-hover:via-red-500 group-hover:to-red-600 transition-all duration-500">Social</span>
                <span className="text-yellow-500 dark:text-yellow-400 group-hover:text-yellow-600 dark:group-hover:text-yellow-300 transition-colors duration-500">Caution</span>
                <span className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 dark:from-white dark:via-gray-100 dark:to-white bg-clip-text text-transparent group-hover:from-red-600 group-hover:via-red-500 group-hover:to-red-600 transition-all duration-500">™</span>
              </h1>
              <div className="text-[10px] sm:text-xs font-semibold tracking-tighter text-red-600 dark:text-red-400 truncate header-line1-landscape header-subtitle-landscape" style={{ lineHeight: '1.05', marginTop: '0' }} title={t('common.brand.line1')}>
                {t('common.brand.line1')}
              </div>
              <div className="text-[9px] sm:text-[10px] font-normal text-gray-600 dark:text-gray-400 truncate header-tagline-landscape" style={{ lineHeight: '1.05', marginTop: '0' }}>
                {t('common.brand.tagline')}
              </div>
            </div>
          </div>
          
          {/* Center: Navigation Menu */}
          <nav className="hidden md:flex items-center justify-center space-x-2 flex-1 min-w-0 overflow-hidden">
            <button 
              type="button"
              onClick={() => navigate('/')}
              className={`nav-link transition-all duration-500 text-xs font-medium relative group overflow-hidden px-1.5 py-0.5 rounded cursor-pointer pointer-events-auto ${
                isActive('/') 
                  ? 'text-red-600 dark:text-red-400' 
                  : 'text-gray-600 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400'
              }`}
              aria-label="Home"
            >
              <span className="relative z-20 flex items-center gap-1 whitespace-nowrap pointer-events-auto">
                <Home className="w-3.5 h-3.5 flex-shrink-0" />
                <span className="truncate">{t('common.navigation.home')}</span>
              </span>
              <div className={`absolute inset-0 bg-gradient-to-r from-red-500/10 to-pink-500/10 transition-opacity duration-300 pointer-events-none z-0 ${
                isActive('/') ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
              }`}></div>
            </button>
            <button 
              type="button"
              onClick={() => navigate('/how-it-works')} 
              className={`nav-link transition-all duration-500 text-xs font-medium relative group overflow-hidden px-1.5 py-0.5 rounded cursor-pointer pointer-events-auto ${
                isActive('/how-it-works') 
                  ? 'text-red-600 dark:text-red-400' 
                  : 'text-gray-600 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400'
              }`}
              aria-label="How It Works"
            >
              <span className="relative z-20 flex items-center gap-1 whitespace-nowrap pointer-events-auto">
                <Info className="w-3.5 h-3.5 flex-shrink-0" />
                <span className="truncate">{t('common.navigation.howItWorks')}</span>
              </span>
              <div className={`absolute inset-0 bg-gradient-to-r from-red-500/10 to-pink-500/10 transition-opacity duration-300 pointer-events-none z-0 ${
                isActive('/how-it-works') ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
              }`}></div>
            </button>
            <button 
              type="button"
              onClick={() => navigate('/service-catalog')} 
              className={`nav-link transition-all duration-500 text-xs font-medium relative group overflow-hidden px-1.5 py-0.5 rounded cursor-pointer pointer-events-auto ${
                isActive('/service-catalog') 
                  ? 'text-red-600 dark:text-red-400' 
                  : 'text-gray-600 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400'
              }`}
              aria-label="Browse 200+ services and their privacy risks"
            >
              <span className="relative z-20 flex items-center gap-1 whitespace-nowrap pointer-events-auto">
                <Shield className="w-3.5 h-3.5 flex-shrink-0" />
                <span className="truncate">{t('common.navigation.serviceCatalog')}</span>
              </span>
              <div className={`absolute inset-0 bg-gradient-to-r from-red-500/10 to-pink-500/10 transition-opacity duration-300 pointer-events-none z-0 ${
                isActive('/service-catalog') ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
              }`}></div>
            </button>
            <button 
              type="button"
              onClick={() => navigate('/dashboard')} 
              className={`nav-link transition-all duration-500 text-xs font-medium relative group overflow-hidden px-1.5 py-0.5 rounded cursor-pointer pointer-events-auto ${
                isActive('/dashboard') 
                  ? 'text-red-600 dark:text-red-400' 
                  : 'text-gray-600 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400'
              }`}
              aria-label="Your personalized privacy dashboard"
            >
              <span className="relative z-20 flex items-center gap-1 whitespace-nowrap pointer-events-auto">
                <LayoutDashboard className="w-3.5 h-3.5 flex-shrink-0" />
                <span className="truncate">{t('common.navigation.dashboard')}</span>
              </span>
              <div className={`absolute inset-0 bg-gradient-to-r from-red-500/10 to-pink-500/10 transition-opacity duration-300 pointer-events-none z-0 ${
                isActive('/dashboard') ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
              }`}></div>
            </button>
            <button 
              type="button"
              onClick={() => navigate('/toolkit-access')} 
              className={`nav-link transition-all duration-500 text-xs font-medium relative group overflow-hidden px-1.5 py-0.5 rounded cursor-pointer pointer-events-auto ${
                isActive('/toolkit-access') || isActive('/privacy-tools') || isActive('/adaptive-resources')
                  ? 'text-red-600 dark:text-red-400' 
                  : 'text-gray-600 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400'
              }`}
              aria-label="Privacy tools and resources"
            >
              <span className="relative z-20 flex items-center gap-1 whitespace-nowrap pointer-events-auto">
                <Wrench className="w-3.5 h-3.5 flex-shrink-0" />
                <span className="truncate">{t('common.navigation.privacyToolkit')}</span>
              </span>
              <div className={`absolute inset-0 bg-gradient-to-r from-red-500/10 to-pink-500/10 transition-opacity duration-300 pointer-events-none z-0 ${
                isActive('/toolkit-access') || isActive('/privacy-tools') || isActive('/adaptive-resources') ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
              }`}></div>
            </button>
            <button 
              type="button"
              onClick={() => navigate('/pricing')} 
              className={`nav-link transition-all duration-500 text-xs font-medium relative group overflow-hidden px-1.5 py-0.5 rounded cursor-pointer pointer-events-auto ${
                isActive('/pricing') 
                  ? 'text-red-600 dark:text-red-400' 
                  : 'text-gray-600 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400'
              }`}
              aria-label="View pricing plans"
            >
              <span className="relative z-20 flex items-center gap-1 whitespace-nowrap pointer-events-auto">
                <DollarSign className="w-3.5 h-3.5 flex-shrink-0" />
                <span className="truncate">{t('common.navigation.pricing')}</span>
              </span>
              <div className={`absolute inset-0 bg-gradient-to-r from-red-500/10 to-pink-500/10 transition-opacity duration-300 pointer-events-none z-0 ${
                isActive('/pricing') ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
              }`}></div>
            </button>
            {/* <button onClick={() => navigate('/faq')} className="nav-link text-gray-600 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 transition-all duration-500 font-medium relative group overflow-hidden px-3 py-2 rounded-xl" aria-label="View frequently asked questions about privacy protection">
              <span className="relative z-10 flex items-center whitespace-nowrap">
                <HelpCircle className="w-6 h-6 mr-2 flex-shrink-0" />
                FAQ
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-red-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </button> */}
          </nav>
          
          {/* Right: Action Buttons */}
          <div className="hidden md:flex items-center space-x-1 flex-shrink-0 min-w-0">
            
            {/* Language Selector */}
            <LanguageSelector className="hidden md:block flex-shrink-0" />
            
            {/* Theme Toggle */}
            <ThemeToggle className="p-1 rounded-md bg-white/20 dark:bg-gray-800/30 hover:bg-white/30 dark:hover:bg-gray-700/40 transition-all duration-500 hover:scale-110 backdrop-blur-md shadow-lg hover:shadow-xl border border-white/30 dark:border-gray-700/50" />
          </div>
          
          {/* Mobile Menu Button and Actions — language and theme first, menu (hamburger) on the right */}
          <div className="md:hidden flex items-center gap-0.5 flex-shrink-0 overflow-visible">
            <div className="flex-shrink-0">
              <LanguageSelector className="md:hidden" buttonClassName="p-1 rounded-md bg-white/20 dark:bg-gray-800/30 backdrop-blur-md hover:scale-105 transition-transform border border-white/30 flex-shrink-0 touch-manipulation min-w-[28px] min-h-[28px]" iconClassName="w-3.5 h-3.5" />
            </div>
            <ThemeToggle className="p-1 rounded-md bg-white/20 dark:bg-gray-800/30 backdrop-blur-md hover:scale-105 transition-transform border border-white/30 flex-shrink-0 touch-manipulation min-w-[28px] min-h-[28px]" iconClassName="w-3.5 h-3.5" />
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1 rounded-md bg-white/20 dark:bg-gray-800/30 backdrop-blur-md hover:scale-105 transition-transform border border-white/30 flex-shrink-0 touch-manipulation min-w-[28px] min-h-[28px] flex items-center justify-center"
              aria-label={t('header.ariaLabels.toggleMenu')}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? (
                <X className="w-3.5 h-3.5 text-gray-600 dark:text-gray-300" />
              ) : (
                <Menu className="w-3.5 h-3.5 text-gray-600 dark:text-gray-300" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile menu panel — only when open; structured drawer below top bar */}
        {mobileMenuOpen && (
          <div className="md:hidden flex-shrink-0 w-full border-t border-gray-200 dark:border-slate-700 bg-gray-50/95 dark:bg-slate-900/95 backdrop-blur-sm">
            <nav className="py-3 px-2 max-w-7xl mx-auto w-full" aria-label="Main navigation">
              <ul className="flex flex-col gap-0.5 list-none m-0 p-0">
                <li>
                  <button
                    type="button"
                    onClick={() => { navigate('/'); setMobileMenuOpen(false); }}
                    className={`w-full text-left px-4 py-3 rounded-lg text-sm font-medium flex items-center gap-3 transition-colors ${
                      isActive('/') ? 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20' : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-slate-800'
                    }`}
                    aria-label="Home"
                  >
                    <Home className="w-4 h-4 flex-shrink-0 opacity-80" />
                    {t('common.navigation.home')}
                  </button>
                </li>
                <li>
                  <button type="button" onClick={() => { navigate('/how-it-works'); setMobileMenuOpen(false); }} className={`w-full text-left px-4 py-3 rounded-lg text-sm font-medium flex items-center gap-3 transition-colors ${isActive('/how-it-works') ? 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20' : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-slate-800'}`} aria-label="How It Works">
                    <Info className="w-4 h-4 flex-shrink-0 opacity-80" />
                    {t('common.navigation.howItWorks')}
                  </button>
                </li>
                <li>
                  <button type="button" onClick={() => { navigate('/service-catalog'); setMobileMenuOpen(false); }} className={`w-full text-left px-4 py-3 rounded-lg text-sm font-medium flex items-center gap-3 transition-colors ${isActive('/service-catalog') ? 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20' : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-slate-800'}`} aria-label="Services">
                    <Shield className="w-4 h-4 flex-shrink-0 opacity-80" />
                    {t('common.navigation.serviceCatalog')}
                  </button>
                </li>
                <li>
                  <button type="button" onClick={() => { navigate('/dashboard'); setMobileMenuOpen(false); }} className={`w-full text-left px-4 py-3 rounded-lg text-sm font-medium flex items-center gap-3 transition-colors ${isActive('/dashboard') ? 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20' : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-slate-800'}`} aria-label="Dashboard">
                    <LayoutDashboard className="w-4 h-4 flex-shrink-0 opacity-80" />
                    {t('common.navigation.dashboard')}
                  </button>
                </li>
                <li>
                  <button type="button" onClick={() => { navigate('/toolkit-access'); setMobileMenuOpen(false); }} className={`w-full text-left px-4 py-3 rounded-lg text-sm font-medium flex items-center gap-3 transition-colors ${isActive('/toolkit-access') || isActive('/privacy-tools') || isActive('/adaptive-resources') ? 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20' : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-slate-800'}`} aria-label="Privacy Toolkit">
                    <Wrench className="w-4 h-4 flex-shrink-0 opacity-80" />
                    {t('common.navigation.privacyToolkit')}
                  </button>
                </li>
                <li>
                  <button type="button" onClick={() => { navigate('/pricing'); setMobileMenuOpen(false); }} className={`w-full text-left px-4 py-3 rounded-lg text-sm font-medium flex items-center gap-3 transition-colors ${isActive('/pricing') ? 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20' : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-slate-800'}`} aria-label="Pricing">
                    <DollarSign className="w-4 h-4 flex-shrink-0 opacity-80" />
                    {t('common.navigation.pricing')}
                  </button>
                </li>
              </ul>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
