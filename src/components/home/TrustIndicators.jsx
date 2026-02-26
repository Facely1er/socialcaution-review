import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from '../../contexts/TranslationContext';

const TrustIndicators = () => {
  const { t } = useTranslation();

  const stats = [
    { value: '100%', label: t('homePage.trustIndicators.clientSide'), sublabel: t('homePage.trustIndicators.clientSideSubLabel'), color: 'text-blue-500' },
    { value: '200+', label: t('homePage.trustIndicators.servicesMonitored'), sublabel: t('homePage.trustIndicators.servicesMonitoredSubLabel'), color: 'text-indigo-500' },
    { value: '10', label: t('homePage.trustIndicators.privacyLaws'), sublabel: t('homePage.trustIndicators.privacyLawsSubLabel'), color: 'text-green-500' },
    { value: '0', label: t('homePage.trustIndicators.dataBreaches'), sublabel: t('homePage.trustIndicators.dataBreachesSubLabel'), color: 'text-red-500' },
  ];

  return (
    <section className="py-8 sm:py-10 md:py-12 bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 relative overflow-hidden">
      {/* Decorative Background Elements - Reduced on mobile */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="hidden sm:block absolute top-1/2 left-1/4 w-64 h-64 bg-green-200/30 dark:bg-green-500/15 rounded-full blur-3xl"></div>
        <div className="hidden sm:block absolute top-1/2 right-1/4 w-64 h-64 bg-blue-200/30 dark:bg-blue-500/15 rounded-full blur-3xl"></div>
        <div className="hidden sm:block absolute top-0 left-1/2 w-48 h-48 bg-accent/15 dark:bg-accent/8 rounded-full blur-3xl -translate-x-1/2"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <motion.h2
          className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6 sm:mb-8 px-2 sm:px-4"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          {t('homePage.trustIndicators.title')}
        </motion.h2>
        
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 md:gap-6 lg:gap-8 max-w-5xl mx-auto">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              className="modern-card bg-white dark:bg-slate-800 rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-5 shadow-sm border border-gray-200 dark:border-slate-700 touch-manipulation"
              initial={{ opacity: 0, y: 40, scale: 0.9 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              transition={{
                duration: 0.6,
                delay: index * 0.1,
                type: "spring",
                stiffness: 100
              }}
              viewport={{ once: true }}
              whileHover={{
                y: -4,
                scale: 1.02,
                transition: { duration: 0.2 }
              }}
              whileTap={{ scale: 0.98 }}
            >
              <motion.div
                className={`text-xl sm:text-2xl md:text-3xl font-bold ${stat.color} mb-1 sm:mb-2`}
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 + 0.3, type: "spring" }}
                viewport={{ once: true }}
              >
                {stat.value}
              </motion.div>
              <div className="text-[10px] sm:text-xs md:text-sm font-semibold text-gray-900 dark:text-white mb-0.5 sm:mb-1">
                {stat.label}
              </div>
              <div className="text-[9px] sm:text-[10px] md:text-xs text-gray-600 dark:text-gray-300 leading-tight">
                {stat.sublabel}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrustIndicators;

