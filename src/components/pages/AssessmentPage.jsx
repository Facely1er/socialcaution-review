import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Search, FileCheck, Clock, Info, ArrowRight, BookOpen, CheckCircle, Zap, Target, AlertTriangle } from 'lucide-react';
import AssessmentNav from '../navigation/AssessmentNav';
import EnhancedBreadcrumbs from '../common/EnhancedBreadcrumbs';
import ThemeToggle from '../common/ThemeToggle';
import { useTranslation } from '../../contexts/TranslationContext';

const AssessmentPage = () => {
  const { t } = useTranslation();

  const assessments = [
    {
      id: 'exposure',
      title: t('assessmentPage.assessments.exposure.title'),
      description: t('assessmentPage.assessments.exposure.description'),
      icon: Search,
      color: 'red',
      duration: t('assessmentPage.assessments.exposure.duration'),
      path: '/assessment/exposure',
      features: t('assessmentPage.assessments.exposure.features')
    },
    {
      id: 'rights',
      title: t('assessmentPage.assessments.rights.title'),
      description: t('assessmentPage.assessments.rights.description'),
      icon: FileCheck,
      color: 'orange',
      duration: t('assessmentPage.assessments.rights.duration'),
      path: '/assessment/privacy-rights',
      features: t('assessmentPage.assessments.rights.features')
    }
  ];

  const colorClasses = {
    red: {
      bg: 'bg-red-500',
      hover: 'hover:bg-red-600',
      text: 'text-red-600',
      bgLight: 'bg-red-50 dark:bg-red-900/20'
    },
    orange: {
      bg: 'bg-orange-500',
      hover: 'hover:bg-orange-600',
      text: 'text-orange-600',
      bgLight: 'bg-orange-50 dark:bg-orange-900/20'
    },
    green: {
      bg: 'bg-green-500',
      hover: 'hover:bg-green-600',
      text: 'text-green-600',
      bgLight: 'bg-green-50 dark:bg-green-900/20'
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Navigation Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <ThemeToggle />
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          <AssessmentNav />
          
          <div className="flex-1">
            {/* Educational Disclaimer */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-8"
            >
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
                <div className="flex items-start">
                  <AlertTriangle className="h-6 w-6 text-blue-600 dark:text-blue-400 mt-0.5 mr-4 flex-shrink-0" />
                  <div className="text-sm text-blue-800 dark:text-blue-200">
                    <p className="font-semibold mb-2 text-lg">{t('assessmentPage.educationalDisclaimer.title')}</p>
                    <p className="mb-2">{t('assessmentPage.educationalDisclaimer.intro')}</p>
                    <ul className="list-disc list-inside mb-2 space-y-1">
                      {t('assessmentPage.educationalDisclaimer.provides').map((item, index) => (
                        <li key={index}>{item}</li>
                      ))}
                    </ul>
                    <p className="mb-2">{t('assessmentPage.educationalDisclaimer.notProvides')}</p>
                    <ul className="list-disc list-inside space-y-1">
                      {t('assessmentPage.educationalDisclaimer.notProvidesList').map((item, index) => (
                        <li key={index}>{item}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Assessment Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              {assessments.map((assessment, index) => {
                const Icon = assessment.icon;
                const colors = colorClasses[assessment.color];
                return (
                  <motion.div
                    key={assessment.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    whileHover={{ y: -4, scale: 1.02 }}
                    className="h-full"
                  >
                    <Link to={assessment.path} className="h-full block group">
                      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 p-6 h-full hover:shadow-lg transition-all duration-300 cursor-pointer">
                        <div className="flex flex-col h-full">
                          {/* Header */}
                          <div className="flex items-start mb-4">
                            <div className={`p-3 ${colors.bgLight} rounded-lg mr-4 flex-shrink-0`}>
                              <Icon className={`h-8 w-8 ${colors.text} dark:text-${assessment.color}-400`} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-orange-500 transition-colors duration-300">
                                {assessment.title}
                              </h3>
                              <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                                <Clock className="h-4 w-4 mr-2" />
                                <span className="font-medium">{assessment.duration}</span>
                              </div>
                            </div>
                          </div>

                          {/* Description */}
                          <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed flex-1">
                            {assessment.description}
                          </p>

                          {/* Features */}
                          <div className="space-y-3 mb-6">
                            {assessment.features.map((feature, featureIndex) => (
                              <div key={featureIndex} className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                                <CheckCircle className="h-4 w-4 text-green-500 mr-3 flex-shrink-0" />
                                <span>{feature}</span>
                              </div>
                            ))}
                          </div>

                          {/* CTA Button */}
                          <div className={`w-full text-center py-3 px-6 rounded-lg ${colors.bg} ${colors.hover} text-white font-semibold transition-all duration-300 flex items-center justify-center space-x-2`}>
                            <span>{t('assessmentPage.startAssessment')}</span>
                            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
                          </div>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
            </div>

            {/* About Assessments Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="mb-12"
            >
              <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 p-8">
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-50 dark:bg-orange-900/20 rounded-full mb-6">
                    <Info className="h-8 w-8 text-orange-500 dark:text-orange-400" />
                  </div>
                  
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                    {t('assessmentPage.aboutSection.title')}
                  </h3>
                  <p className="text-lg text-gray-600 dark:text-gray-300 max-w-4xl mx-auto leading-relaxed">
                    {t('assessmentPage.aboutSection.description')}
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Why Choose Our Assessments Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                  {t('assessmentPage.whyChoose.title')}
                </h2>
                <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                  {t('assessmentPage.whyChoose.subtitle')}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  {
                    icon: Zap,
                    title: t('assessmentPage.whyChoose.features.quick.title'),
                    description: t('assessmentPage.whyChoose.features.quick.description'),
                    color: 'yellow'
                  },
                  {
                    icon: Target,
                    title: t('assessmentPage.whyChoose.features.personalized.title'),
                    description: t('assessmentPage.whyChoose.features.personalized.description'),
                    color: 'orange'
                  },
                  {
                    icon: BookOpen,
                    title: t('assessmentPage.whyChoose.features.educational.title'),
                    description: t('assessmentPage.whyChoose.features.educational.description'),
                    color: 'green'
                  },
                  {
                    icon: CheckCircle,
                    title: t('assessmentPage.whyChoose.features.expert.title'),
                    description: t('assessmentPage.whyChoose.features.expert.description'),
                    color: 'blue'
                  }
                ].map((feature, index) => {
                  const Icon = feature.icon;
                  const colorMap = {
                    yellow: 'text-yellow-500 bg-yellow-50 dark:bg-yellow-900/20',
                    orange: 'text-orange-500 bg-orange-50 dark:bg-orange-900/20',
                    green: 'text-green-500 bg-green-50 dark:bg-green-900/20',
                    blue: 'text-blue-500 bg-blue-50 dark:bg-blue-900/20'
                  };
                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.8 + index * 0.1 }}
                      className="text-center group"
                    >
                      <div className={`inline-flex items-center justify-center w-16 h-16 ${colorMap[feature.color]} rounded-2xl mb-4 group-hover:scale-110 transition-transform duration-300`}>
                        <Icon className="h-8 w-8" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                        {feature.title}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        {feature.description}
                      </p>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssessmentPage;

