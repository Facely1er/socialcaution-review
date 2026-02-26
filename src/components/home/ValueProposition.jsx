import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Database, Shield, TrendingUp, Bell, ArrowRight } from 'lucide-react';
import { useTranslation } from '../../contexts/TranslationContext';

const ValueProposition = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const values = [
    {
      icon: Database,
      title: t('homePage.valueProposition.dataCollection'),
      description: t('homePage.valueProposition.dataCollectionDescription'),
      color: 'from-blue-500 to-blue-600',
      bgColor: 'from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20',
      borderColor: 'border-blue-200 dark:border-blue-700',
      link: '/service-catalog',
      linkLabel: t('homePage.valueProposition.viewInCatalog') || 'View in Catalog'
    },
    {
      icon: Shield,
      title: t('homePage.valueProposition.securityTrackRecord'),
      description: t('homePage.valueProposition.securityTrackRecordDescription'),
      color: 'from-green-500 to-green-600',
      bgColor: 'from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20',
      borderColor: 'border-green-200 dark:border-green-700',
      link: '/service-catalog',
      linkLabel: t('homePage.valueProposition.viewInCatalog') || 'View in Catalog'
    },
    {
      icon: TrendingUp,
      title: t('homePage.valueProposition.privacyRatings'),
      description: t('homePage.valueProposition.privacyRatingsDescription'),
      color: 'from-purple-500 to-purple-600',
      bgColor: 'from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20',
      borderColor: 'border-purple-200 dark:border-purple-700',
      link: '/service-catalog',
      linkLabel: t('homePage.valueProposition.viewInCatalog') || 'View in Catalog'
    },
    {
      icon: Bell,
      title: t('homePage.valueProposition.policyUpdates'),
      description: t('homePage.valueProposition.policyUpdatesDescription'),
      color: 'from-orange-500 to-orange-600',
      bgColor: 'from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20',
      borderColor: 'border-orange-200 dark:border-orange-700',
      link: '/dashboard',
      linkLabel: t('homePage.valueProposition.viewAlerts') || 'View Alerts'
    }
  ];

  return (
    <section className="py-12 sm:py-16 md:py-20 bg-gradient-to-br from-gray-50 to-white dark:from-slate-900 dark:to-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          className="text-center mb-10 sm:mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            {t('homePage.valueProposition.title')}
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            {t('homePage.valueProposition.subtitle')}
          </p>
        </motion.div>

        {/* Value Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {values.map((value, index) => {
            const Icon = value.icon;
            return (
              <motion.button
                key={value.title}
                type="button"
                onClick={() => navigate(value.link)}
                className={`bg-gradient-to-br ${value.bgColor} rounded-2xl p-6 sm:p-8 border ${value.borderColor} hover:shadow-2xl transition-all duration-300 group flex flex-col items-center text-center cursor-pointer w-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent`}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.05, y: -5 }}
                whileTap={{ scale: 0.98 }}
                aria-label={`${value.title} - ${value.linkLabel}`}
              >
                {/* Icon */}
                <div className={`w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br ${value.color} rounded-2xl flex items-center justify-center mb-4 sm:mb-6 group-hover:scale-110 transition-transform shadow-lg`}>
                  <Icon className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
                </div>

                {/* Title */}
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-3">
                  {value.title}
                </h3>

                {/* Description */}
                <p className="text-gray-600 dark:text-gray-300 text-sm sm:text-base leading-relaxed mb-4">
                  {value.description}
                </p>

                {/* Link indicator */}
                <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300 group-hover:text-accent dark:group-hover:text-accent transition-colors mt-auto">
                  <span className="text-sm font-medium">{value.linkLabel}</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </motion.button>
            );
          })}
        </div>

        {/* Service Catalog Link */}
        <motion.div
          className="text-center mt-10 sm:mt-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          viewport={{ once: true }}
        >
          <button
            type="button"
            onClick={() => navigate('/service-catalog')}
            className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 transition-colors text-sm sm:text-base font-medium group"
            aria-label="Browse Services Monitoring"
          >
            <Shield className="w-4 h-4 sm:w-5 sm:h-5" />
            <span>{t('common.navigation.serviceCatalog')}</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </motion.div>
      </div>
    </section>
  );
};

export default ValueProposition;

