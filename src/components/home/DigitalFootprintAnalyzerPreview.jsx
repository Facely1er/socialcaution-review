import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Activity, Shield, Target, BarChart3, AlertTriangle,
  TrendingUp, CheckCircle, ArrowRight, Zap, PieChart,
  Database, Users, Wrench
} from 'lucide-react';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { useTranslation } from '../../contexts/TranslationContext';

const DigitalFootprintAnalyzerPreview = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [selectedServices] = useLocalStorage('socialcaution_services', []);
  const [assessmentResults] = useLocalStorage('assessment-results', null);
  
  const hasData = (selectedServices && selectedServices.length > 0) || assessmentResults;
  const canAnalyze = hasData;

  // Analysis features to showcase
  const analysisFeatures = [
    {
      icon: BarChart3,
      title: t('homePage.digitalFootprint.patternDetection'),
      description: t('homePage.digitalFootprint.patternDetectionDescription'),
      color: 'from-red-500 to-red-600'
    },
    {
      icon: AlertTriangle,
      title: t('homePage.digitalFootprint.contradictionAnalysis'),
      description: t('homePage.digitalFootprint.contradictionAnalysisDescription'),
      color: 'from-orange-500 to-orange-600'
    },
    {
      icon: TrendingUp,
      title: t('homePage.digitalFootprint.riskAmplification'),
      description: t('homePage.digitalFootprint.riskAmplificationDescription'),
      color: 'from-yellow-500 to-yellow-600'
    },
    {
      icon: Wrench,
      title: t('homePage.digitalFootprint.toolRecommendations'),
      description: t('homePage.digitalFootprint.toolRecommendationsDescription'),
      color: 'from-purple-500 to-purple-600'
    }
  ];

  // What gets analyzed
  const analysisComponents = [
    {
      icon: Database,
      label: t('homePage.digitalFootprint.services'),
      weight: '40%',
      description: t('homePage.digitalFootprint.servicesDescription'),
      color: 'from-purple-500 to-purple-600'
    },
    {
      icon: Target,
      label: t('homePage.digitalFootprint.assessments'),
      weight: '60%',
      description: t('homePage.digitalFootprint.assessmentsDescription'),
      color: 'from-blue-500 to-blue-600'
    }
  ];

  const handleAnalyzeClick = () => {
    if (canAnalyze) {
      navigate('/dashboard?view=footprint');
    } else {
      // Guide users to get started
      navigate('/service-catalog');
    }
  };

  return (
    <section className="py-12 sm:py-16 md:py-20 bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-200/20 dark:bg-purple-500/10 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-200/20 dark:bg-blue-500/10 rounded-full blur-3xl -translate-x-1/2 translate-y-1/2"></div>
        <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-indigo-200/20 dark:bg-indigo-500/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <motion.div
          className="text-center mb-10 sm:mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <motion.div
            className="inline-flex items-center gap-2 px-4 py-2 bg-purple-100 dark:bg-purple-900/30 rounded-full mb-4"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <Zap className="w-4 h-4 text-purple-600 dark:text-purple-400" />
            <span className="text-sm font-semibold text-purple-700 dark:text-purple-300">
              {t('homePage.digitalFootprint.badge')}
            </span>
          </motion.div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            {t('homePage.digitalFootprint.title')}
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            {t('homePage.digitalFootprint.subtitle')}
          </p>
        </motion.div>

        {/* Analysis Components Visualization */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 mb-10 sm:mb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
        >
          {analysisComponents.map((component, index) => {
            const Icon = component.icon;
            return (
              <motion.div
                key={component.label}
                className="bg-white dark:bg-slate-800 rounded-2xl p-6 sm:p-8 border-2 border-gray-200 dark:border-slate-700 hover:shadow-xl transition-all overflow-hidden"
                initial={{ opacity: 0, x: index === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.02, y: -5 }}
              >
                <div className="flex items-center justify-between mb-4 min-w-0">
                  <div className="flex items-center gap-4 min-w-0 flex-1">
                    <div className={`w-16 h-16 bg-gradient-to-br ${component.color} rounded-xl flex items-center justify-center shadow-lg flex-shrink-0`}>
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white break-words">
                        {component.label}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 break-words">
                        {component.description}
                      </p>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0 ml-4">
                    <div className="text-2xl font-bold text-purple-600 dark:text-purple-400 break-words">
                      {component.weight}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">{t('homePage.digitalFootprint.weight')}</div>
                  </div>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
                  <motion.div
                    className={`h-3 bg-gradient-to-r ${component.color} rounded-full`}
                    initial={{ width: 0 }}
                    whileInView={{ width: component.weight }}
                    transition={{ duration: 1, delay: 0.5 + index * 0.2 }}
                    viewport={{ once: true }}
                  />
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Combined Analysis Result */}
        <motion.div
          className="bg-gradient-to-br from-purple-600 to-blue-600 dark:from-purple-700 dark:to-blue-700 rounded-2xl p-6 sm:p-8 mb-10 sm:mb-12 text-white relative overflow-hidden"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
        >
          <div className="absolute inset-0 bg-white/10 dark:bg-white/5 rounded-2xl"></div>
          <div className="relative z-10 min-w-0">
            <div className="flex items-center gap-3 mb-4 min-w-0">
              <Activity className="w-8 h-8 flex-shrink-0" />
              <h3 className="text-2xl sm:text-3xl font-bold break-words">
                {t('homePage.digitalFootprint.analysis')}
              </h3>
            </div>
            <p className="text-lg sm:text-xl mb-6 opacity-90 break-words">
              {t('homePage.digitalFootprint.analysisDescription')}
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 min-w-0">
              <div className="bg-white/20 dark:bg-white/10 rounded-lg p-4 backdrop-blur-sm min-w-0">
                <div className="text-2xl font-bold mb-1 break-words">{t('homePage.digitalFootprint.patterns')}</div>
                <div className="text-sm opacity-80 break-words">{t('homePage.digitalFootprint.detected')}</div>
              </div>
              <div className="bg-white/20 dark:bg-white/10 rounded-lg p-4 backdrop-blur-sm min-w-0">
                <div className="text-2xl font-bold mb-1 break-words">{t('homePage.digitalFootprint.risks')}</div>
                <div className="text-sm opacity-80 break-words">{t('homePage.digitalFootprint.amplified')}</div>
              </div>
              <div className="bg-white/20 dark:bg-white/10 rounded-lg p-4 backdrop-blur-sm min-w-0">
                <div className="text-2xl font-bold mb-1 break-words">{t('homePage.digitalFootprint.tools')}</div>
                <div className="text-sm opacity-80 break-words">{t('homePage.digitalFootprint.recommended')}</div>
              </div>
              <div className="bg-white/20 dark:bg-white/10 rounded-lg p-4 backdrop-blur-sm min-w-0">
                <div className="text-2xl font-bold mb-1 break-words">{t('homePage.digitalFootprint.actions')}</div>
                <div className="text-sm opacity-80 break-words">{t('homePage.digitalFootprint.prioritized')}</div>
              </div>
            </div>
          </div>
        </motion.div>


        {/* CTA Section */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          viewport={{ once: true }}
        >
          {canAnalyze ? (
            <>
              <motion.button
                onClick={handleAnalyzeClick}
                className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white text-lg font-bold rounded-xl hover:from-purple-700 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-2xl mb-4"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Activity className="w-6 h-6" />
                {t('homePage.digitalFootprint.analyzeMyFootprint')}
                <ArrowRight className="w-5 h-5" />
              </motion.button>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                ✓ {t('homePage.digitalFootprint.youHaveServices', {
                  count: selectedServices?.length || 0,
                  plural: selectedServices?.length !== 1 ? 's' : ''
                })}
              </p>
            </>
          ) : (
            <>
              <motion.button
                onClick={() => navigate('/dashboard?view=footprint')}
                className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white text-lg font-bold rounded-xl hover:from-purple-700 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-2xl mb-4"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Shield className="w-6 h-6" />
                {t('homePage.digitalFootprint.getStarted')}
                <ArrowRight className="w-5 h-5" />
              </motion.button>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                {t('homePage.digitalFootprint.unlockAnalysis')}
              </p>
              <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>{t('homePage.digitalFootprint.addServicesFromCatalog')}</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>{t('homePage.digitalFootprint.completePrivacyAssessment')}</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>{t('homePage.digitalFootprint.getComprehensiveAnalysis')}</span>
                </div>
              </div>
            </>
          )}
        </motion.div>
      </div>
    </section>
  );
};

export default DigitalFootprintAnalyzerPreview;

