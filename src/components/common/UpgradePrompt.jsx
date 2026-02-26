import React from 'react';
import { ArrowRight, Shield, BarChart3, Bell, Wrench, CheckCircle } from 'lucide-react';
import { analytics } from '../../utils/analytics';

const UpgradePrompt = ({ 
  source = 'unknown',
  compact = false,
  persona = null,
  servicesCount = 0
}) => {
  const handleUpgradeClick = () => {
    // Track upgrade intent
    if (analytics && typeof analytics.trackEvent === 'function') {
      analytics.trackEvent('upgrade_cta_clicked', {
        source,
        has_persona: !!persona,
        services_count: servicesCount,
        timestamp: new Date().toISOString()
      });
    }
    
    // Redirect to Standard version
    // Change this URL to your actual Standard version deployment
    window.location.href = import.meta.env.VITE_STANDARD_VERSION_URL || 'https://app.socialcaution.com';
  };

  if (compact) {
    return (
      <div className="bg-gradient-to-r from-accent/10 to-purple-500/10 dark:from-accent/20 dark:to-purple-500/20 rounded-lg p-4 border border-accent/30">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex-1">
            <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
              Want More Privacy Insights?
            </h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Upgrade to Standard for full assessments, personalized dashboard, and privacy toolkit
            </p>
          </div>
          <button
            type="button"
            onClick={handleUpgradeClick}
            className="px-4 py-2 bg-accent text-white font-semibold rounded-lg hover:bg-accent-dark transition-all transform hover:scale-105 flex items-center gap-2 whitespace-nowrap"
          >
            Upgrade <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <section className="py-16 bg-gradient-to-br from-accent via-accent-dark to-purple-600 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready for Complete Privacy Protection?
          </h2>
          <p className="text-lg md:text-xl text-white/90 max-w-3xl mx-auto">
            Upgrade to Standard Version for comprehensive privacy assessments, personalized toolkit, and real-time alerts
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
            <Shield className="w-10 h-10 text-white mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">
              Full Assessments
            </h3>
            <p className="text-sm text-white/80">
              Deep privacy exposure and rights analysis with personalized scores
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
            <BarChart3 className="w-10 h-10 text-white mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">
              Personal Dashboard
            </h3>
            <p className="text-sm text-white/80">
              Track your privacy journey with detailed analytics and progress
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
            <Wrench className="w-10 h-10 text-white mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">
              Privacy Toolkit
            </h3>
            <p className="text-sm text-white/80">
              12+ tools including password analyzer, data inventory, and more
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
            <Bell className="w-10 h-10 text-white mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">
              Real-time Alerts
            </h3>
            <p className="text-sm text-white/80">
              Stay informed with privacy breaches and policy changes
            </p>
          </div>
        </div>

        {/* What's Included */}
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 mb-8">
          <h3 className="text-xl font-bold text-white mb-6 text-center">
            Everything in Standard Version
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              'Privacy Exposure Assessment',
              'Privacy Rights Assessment',
              'Personalized Dashboard',
              'Adaptive Resource Library',
              'Privacy Toolkit (12+ tools)',
              'Internal & External Tools Directory',
              'Real-time Privacy Alerts Feed',
              'Privacy Blog & Articles',
              'Export Reports & History',
              'Advanced Analytics',
              'Optional Encrypted Data Export',
              'Priority Support'
            ].map((feature, idx) => (
              <div key={idx} className="flex items-center gap-3 text-white">
                <CheckCircle className="w-5 h-5 flex-shrink-0" />
                <span className="text-sm">{feature}</span>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Button */}
        <div className="text-center">
          <button
            type="button"
            onClick={handleUpgradeClick}
            className="inline-flex items-center gap-3 px-8 py-4 bg-white text-accent font-bold text-lg rounded-xl hover:bg-gray-100 transition-all transform hover:scale-105 shadow-2xl hover:shadow-white/20"
          >
            <Shield className="w-6 h-6" />
            Upgrade to Standard Version
            <ArrowRight className="w-6 h-6" />
          </button>
          <p className="mt-4 text-sm text-white/70">
            All your persona and service selections will be preserved
          </p>
        </div>
      </div>
    </section>
  );
};

export default UpgradePrompt;
