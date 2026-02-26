import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Users, Lock as LockIcon, Zap, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import FeatureModal from '../common/FeatureModal';
import { useTranslation } from '../../contexts/TranslationContext';

const FeaturesSection = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [selectedFeature, setSelectedFeature] = useState(null);

  const coreFeatures = [
    {
      icon: Users,
      title: t('homePage.featuresSection.personaBased.title'),
      subtitle: t('homePage.featuresSection.personaBased.subtitle'),
      description: t('homePage.featuresSection.personaBased.description'),
      gradient: 'from-purple-500 to-purple-600',
      benefits: [
        t('homePage.featuresSection.personaBased.benefit1'),
        t('homePage.featuresSection.personaBased.benefit2'),
        t('homePage.featuresSection.personaBased.benefit3'),
        t('homePage.featuresSection.personaBased.benefit4')
      ],
      detailedDescription: t('homePage.featuresSection.personaBased.detailedDescription'),
      howToAccess: t('homePage.featuresSection.personaBased.howToAccess'),
      primaryAction: {
        label: t('homePage.featuresSection.personaBased.actionLabel'),
        onClick: () => navigate('/privacy-settings'),
        icon: ArrowRight
      }
    },
    {
      icon: LockIcon,
      title: t('homePage.featuresSection.zeroData.title'),
      subtitle: t('homePage.featuresSection.zeroData.subtitle'),
      description: t('homePage.featuresSection.zeroData.description'),
      gradient: 'from-green-500 to-green-600',
      benefits: [
        t('homePage.featuresSection.zeroData.benefit1'),
        t('homePage.featuresSection.zeroData.benefit2'),
        t('homePage.featuresSection.zeroData.benefit3'),
        t('homePage.featuresSection.zeroData.benefit4')
      ],
      detailedDescription: t('homePage.featuresSection.zeroData.detailedDescription'),
      howToAccess: t('homePage.featuresSection.zeroData.howToAccess'),
      primaryAction: {
        label: t('homePage.featuresSection.zeroData.actionLabel'),
        onClick: () => navigate('/privacy-policy'),
        icon: LockIcon
      }
    },
    {
      icon: Zap,
      title: t('homePage.featuresSection.instantPersonalization.title'),
      subtitle: t('homePage.featuresSection.instantPersonalization.subtitle'),
      description: t('homePage.featuresSection.instantPersonalization.description'),
      gradient: 'from-orange-500 to-orange-600',
      benefits: [
        t('homePage.featuresSection.instantPersonalization.benefit1'),
        t('homePage.featuresSection.instantPersonalization.benefit2'),
        t('homePage.featuresSection.instantPersonalization.benefit3'),
        t('homePage.featuresSection.instantPersonalization.benefit4')
      ],
      detailedDescription: t('homePage.featuresSection.instantPersonalization.detailedDescription'),
      howToAccess: t('homePage.featuresSection.instantPersonalization.howToAccess'),
      primaryAction: {
        label: t('homePage.featuresSection.instantPersonalization.actionLabel'),
        onClick: () => navigate('/service-catalog'),
        icon: Zap
      }
    }
  ];

  return (
    <section id="features" className="py-8 sm:py-12 md:py-16 lg:py-20 bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 relative overflow-hidden">
      {/* Decorative Background Elements - Reduced on mobile */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="hidden sm:block absolute top-0 left-0 w-72 h-72 bg-purple-200/30 dark:bg-purple-500/15 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
        <div className="hidden md:block absolute bottom-0 right-0 w-96 h-96 bg-blue-200/30 dark:bg-blue-500/15 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>
        <div className="hidden sm:block absolute top-1/2 left-1/2 w-80 h-80 bg-accent/15 dark:bg-accent/8 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          className="text-center mb-8 sm:mb-10 md:mb-12 lg:mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <motion.h2
            className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-2 sm:mb-3 md:mb-4 px-2 sm:px-4"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            {t('homePage.featuresSection.title')}
          </motion.h2>
          <motion.p
            className="text-base sm:text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto px-2"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
          >
            {t('homePage.featuresSection.subtitle')}
          </motion.p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {coreFeatures.map((feature, index) => (
            <motion.div
              key={index}
              className="card-interactive modern-card bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-gray-200 dark:border-slate-700 p-6 sm:p-8 hover:shadow-2xl hover:border-accent/50 transition-all duration-500 group cursor-pointer touch-manipulation relative overflow-hidden"
              onClick={() => setSelectedFeature(feature)}
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
                y: -8,
                scale: 1.02,
                transition: { duration: 0.3 }
              }}
            >
              {/* Accent gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-accent/5 via-accent/2 to-transparent group-hover:from-accent/10 group-hover:via-accent/5 transition-all duration-300 pointer-events-none"></div>
              <div className="relative z-10">
              <motion.div
                className={`w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br ${feature.gradient} rounded-2xl flex items-center justify-center mb-4 sm:mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg mx-auto`}
                whileHover={{ rotate: 5 }}
              >
                <feature.icon className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
              </motion.div>
              
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-2 text-center group-hover:text-accent transition-colors">
                {feature.title}
              </h3>
              <p className="text-base sm:text-lg font-medium text-accent mb-3 text-center">
                {feature.subtitle}
              </p>
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 mb-4 sm:mb-6">
                {feature.description}
              </p>

              <div className="space-y-2">
                {feature.benefits.slice(0, 2).map((benefit, idx) => (
                  <div key={idx} className="flex items-center text-xs sm:text-sm text-gray-600 dark:text-gray-300">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                    {benefit}
                  </div>
                ))}
              </div>

              <div className="mt-4 sm:mt-6 flex items-center justify-center text-accent font-medium group-hover:text-accent-dark text-sm sm:text-base">
                {t('homePage.featuresSection.learnMore')}
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform flex-shrink-0" />
              </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Feature Modal */}
      <FeatureModal
        isOpen={!!selectedFeature}
        onClose={() => setSelectedFeature(null)}
        feature={selectedFeature}
      />
    </section>
  );
};

export default FeaturesSection;

