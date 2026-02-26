import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Search, Target, ArrowRight, Shield, CheckCircle, TrendingUp, Clock, LayoutDashboard, Bell, Radar, Wrench } from 'lucide-react';

const SimpleHowItWorks = () => {
  const navigate = useNavigate();

  const steps = [
    {
      id: 1,
      title: 'Select Services',
      subtitle: 'Required Step',
      description: 'Browse our catalog of 200+ services and select the services you use. This is required to track your digital footprint and privacy exposure.',
      icon: Search,
      color: 'from-blue-500 to-blue-600',
      action: () => navigate('/service-catalog'),
      actionText: 'Browse Services',
      timeline: '1-2 minutes'
    },
    {
      id: 2,
      title: 'Set Privacy Concerns',
      subtitle: 'Primary Personalization',
      description: 'Select your privacy concerns from 4 focus areas (Family & children, Financial & shopping, Work & professional, General). This is REQUIRED and is the PRIMARY method of personalization—it drives what you see in your dashboard.',
      icon: Shield,
      color: 'from-purple-500 to-purple-600',
      action: () => navigate('/privacy-settings'),
      actionText: 'Set Privacy Concerns',
      timeline: '1-2 minutes'
    },
    {
      id: 3,
      title: 'Take Assessment',
      subtitle: 'Required Step',
      description: 'Complete one of our two privacy assessments (Digital Privacy Risk Assessment or Privacy Rights Assessment) to unlock your personalized dashboard with insights, actionable recommendations, and analytics.',
      icon: Target,
      color: 'from-green-500 to-green-600',
      action: () => navigate('/assessment/full'),
      actionText: 'Take Assessment',
      timeline: '10-15 minutes'
    }
  ];

  return (
    <section className="py-12 md:py-20 bg-gradient-to-br from-gray-50 via-white to-blue-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 relative overflow-hidden">
      {/* Decorative Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-0 w-72 h-72 bg-blue-200/30 dark:bg-blue-500/15 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-200/30 dark:bg-purple-500/15 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-12 md:mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              How It Works
            </h2>
            <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-2">
              Complete 3 simple steps to unlock your personalized privacy dashboard and powerful privacy tools
            </p>
            <p className="text-sm md:text-base text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
              After completing the workflow, access your Dashboard, Alerts, Trends Tracker, and Privacy Toolkit
            </p>
          </motion.div>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mb-12">
          {steps.map((step, index) => {
            const StepIcon = step.icon;
            return (
              <motion.div
                key={step.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="relative"
              >
                {/* Connecting Line - Desktop */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-16 left-full w-full h-0.5 bg-gradient-to-r from-blue-500 via-purple-500 to-green-500 opacity-30 z-0" style={{ width: 'calc(100% - 2rem)' }}>
                    <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-3 h-3 bg-green-500 rounded-full"></div>
                  </div>
                )}

                {/* Step Card */}
                <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-slate-700 hover:shadow-xl transition-all duration-300 h-full flex flex-col relative group">
                  {/* Step Number */}
                  <div className="absolute -top-4 left-6">
                    <div className={`w-10 h-10 bg-gradient-to-br ${step.color} rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg`}>
                      {step.id}
                    </div>
                  </div>

                  {/* Icon */}
                  <div className={`w-16 h-16 bg-gradient-to-br ${step.color} rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    <StepIcon className="w-8 h-8 text-white" />
                  </div>

                  {/* Content */}
                  <div className="text-center flex-1 flex flex-col">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                      {step.title}
                    </h3>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">
                      {step.subtitle}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 leading-relaxed flex-grow">
                      {step.description}
                    </p>

                    {/* Timeline */}
                    <div className="flex items-center justify-center gap-2 text-xs text-gray-500 dark:text-gray-400 mb-4">
                      <Clock className="w-4 h-4" />
                      <span>{step.timeline}</span>
                    </div>

                    {/* Action Button */}
                    <button
                      type="button"
                      onClick={step.action}
                      className={`w-full px-4 py-2.5 bg-gradient-to-r ${step.color} text-white font-semibold rounded-lg hover:opacity-90 transition-all transform hover:scale-105 shadow-md text-sm flex items-center justify-center gap-2`}
                    >
                      <span>{step.actionText}</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Arrow - Mobile/Tablet */}
                {index < steps.length - 1 && (
                  <div className="lg:hidden flex justify-center my-6">
                    <ArrowRight className="w-6 h-6 text-gray-400 dark:text-gray-600" />
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>

        {/* Features You Unlock Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mb-12"
        >
          <div className="text-center mb-8">
            <h3 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-3">
              Features You Unlock
            </h3>
            <p className="text-base md:text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              After completing the 3 steps above, you'll have access to these powerful privacy tools
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Dashboard */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-md border border-gray-200 dark:border-slate-700 hover:shadow-lg transition-all cursor-pointer group"
              onClick={() => navigate('/dashboard')}
            >
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center mb-4 mx-auto group-hover:scale-110 transition-transform">
                <LayoutDashboard className="w-6 h-6 text-white" />
              </div>
              <h4 className="font-bold text-gray-900 dark:text-white mb-2 text-center">Dashboard</h4>
              <p className="text-sm text-gray-600 dark:text-gray-300 text-center mb-4">
                Your personalized privacy hub with risk scores, recommendations, and progress tracking
              </p>
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); navigate('/dashboard'); }}
                className="w-full px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-sm font-semibold rounded-lg hover:opacity-90 transition-all flex items-center justify-center gap-2"
              >
                View Dashboard
                <ArrowRight className="w-4 h-4" />
              </button>
            </motion.div>

            {/* Alerts */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-md border border-gray-200 dark:border-slate-700 hover:shadow-lg transition-all cursor-pointer group"
              onClick={() => navigate('/alerts')}
            >
              <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-lg flex items-center justify-center mb-4 mx-auto group-hover:scale-110 transition-transform">
                <Bell className="w-6 h-6 text-white" />
              </div>
              <h4 className="font-bold text-gray-900 dark:text-white mb-2 text-center">Alerts</h4>
              <p className="text-sm text-gray-600 dark:text-gray-300 text-center mb-4">
                Get notified about privacy policy changes, data breaches, and important updates for your services
              </p>
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); navigate('/alerts'); }}
                className="w-full px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white text-sm font-semibold rounded-lg hover:opacity-90 transition-all flex items-center justify-center gap-2"
              >
                View Alerts
                <ArrowRight className="w-4 h-4" />
              </button>
            </motion.div>

            {/* Trends / Radar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-md border border-gray-200 dark:border-slate-700 hover:shadow-lg transition-all cursor-pointer group"
              onClick={() => navigate('/privacy-regulations')}
            >
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center mb-4 mx-auto group-hover:scale-110 transition-transform">
                <Radar className="w-6 h-6 text-white" />
              </div>
              <h4 className="font-bold text-gray-900 dark:text-white mb-2 text-center">Trends Tracker</h4>
              <p className="text-sm text-gray-600 dark:text-gray-300 text-center mb-4">
                Track privacy regulations, GDPR updates, CCPA changes, and global privacy law developments
              </p>
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); navigate('/privacy-regulations'); }}
                className="w-full px-4 py-2 bg-gradient-to-r from-purple-500 to-purple-600 text-white text-sm font-semibold rounded-lg hover:opacity-90 transition-all flex items-center justify-center gap-2"
              >
                See Trends
                <ArrowRight className="w-4 h-4" />
              </button>
            </motion.div>

            {/* Toolkit */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.7 }}
              className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-md border border-gray-200 dark:border-slate-700 hover:shadow-lg transition-all cursor-pointer group"
              onClick={() => navigate('/toolkit-access')}
            >
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center mb-4 mx-auto group-hover:scale-110 transition-transform">
                <Wrench className="w-6 h-6 text-white" />
              </div>
              <h4 className="font-bold text-gray-900 dark:text-white mb-2 text-center">Privacy Toolkit</h4>
              <p className="text-sm text-gray-600 dark:text-gray-300 text-center mb-4">
                Access privacy tools, guides, and resources tailored to your concerns and risk level
              </p>
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); navigate('/toolkit-access'); }}
                className="w-full px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white text-sm font-semibold rounded-lg hover:opacity-90 transition-all flex items-center justify-center gap-2"
              >
                Open Toolkit
                <ArrowRight className="w-4 h-4" />
              </button>
            </motion.div>
          </div>
        </motion.div>

        {/* Benefits Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-slate-800 dark:to-slate-900 rounded-2xl p-6 md:p-8 border border-blue-200 dark:border-slate-700"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-3">
                <CheckCircle className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-1">No Sign-Up Required</h4>
              <p className="text-sm text-gray-600 dark:text-gray-300">Start exploring immediately</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-3">
                <TrendingUp className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-1">Privacy-First</h4>
              <p className="text-sm text-gray-600 dark:text-gray-300">All data stays on your device</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-3">
                <Shield className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-1">Get Started Free</h4>
              <p className="text-sm text-gray-600 dark:text-gray-300">Upgrade anytime for more features</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default SimpleHowItWorks;

