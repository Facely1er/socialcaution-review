import React from 'react';
import { motion } from 'framer-motion';
import { FileCheck, Shield, ArrowRight, Database, CheckCircle, Globe, FileText } from 'lucide-react';
import { useTranslation } from '../../contexts/TranslationContext';

const PrivacyRightsStartScreen = ({ onStart }) => {
  const { t } = useTranslation();
  
  const standards = [
    {
      name: "GDPR",
      description: t('assessments.exposure.gdpr'),
      icon: <Shield className="h-5 w-5 text-blue-600 dark:text-blue-400" />,
      requirements: [
        t('assessments.rights.rightOfAccess'),
        t('assessments.rights.rightToRectification'),
        t('assessments.rights.rightToErasure'),
        t('assessments.rights.rightToPortability')]
    },
    {
      name: "CCPA/CPRA",
      description: t('assessments.rights.ccpa'),
      icon: <FileCheck className="h-5 w-5 text-green-600 dark:text-green-400" />,
      requirements: [
        t('assessments.rights.rightToKnow'),
        t('assessments.rights.rightToDelete'),
        'Right to opt-out of data sales',
        'Right to non-discrimination']
    },
    {
      name: "PIPEDA",
      description: t('assessments.rights.pipa'),
      icon: <Database className="h-5 w-5 text-purple-600 dark:text-purple-400" />,
      requirements: [
        t('assessments.rights.consent'),
        'Limited collection and retention',
        'Accuracy of personal information',
        'Safeguards for data protection']
    }
  ];

  const additionalRegulations = [
    {
      name: "LGPD (Brazil)",
      description: 'General Data Protection Law',
      requirements: [
        'Legal basis for data processing',
        'Data subject rights and consent',
        'Data protection officer requirement',
        'International data transfer rules']
    },
    {
      name: "PIPL (China)",
      description: 'Personal Information Protection Law',
      requirements: [
        'Separate consent for sensitive data',
        'Data localization requirements',
        'Cross-border data transfer restrictions',
        'Privacy impact assessments']
    },
    {
      name: "APP (Australia)",
      description: 'Australian Privacy Principles',
      requirements: [
        'Open and transparent management',
        'Collection and use limitations',
        'Data quality and security',
        'Access and correction rights']
    }
  ];

  const features = [
    {
      title: t('assessments.rights.rightsAnalysis'),
      description: t('assessments.rights.rightsAnalysisDesc'),
      icon: <FileCheck className="h-6 w-6 text-blue-600 dark:text-blue-400" />
    },
    {
      title: t('assessments.rights.complianceCheck'),
      description: t('assessments.rights.complianceCheckDesc'),
      icon: <Shield className="h-6 w-6 text-green-600 dark:text-green-400" />
    },
    {
      title: t('assessments.rights.improvementPlan'),
      description: t('assessments.rights.improvementPlanDesc'),
      icon: <CheckCircle className="h-6 w-6 text-purple-600 dark:text-purple-400" />
    }
  ];

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-8">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <FileCheck className="h-16 w-16 text-orange-500 dark:text-orange-400 mx-auto" />
      </motion.div>
      
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
          {t('assessment.rights.title')}
        </h1>
        <p className="text-lg text-slate-600 dark:text-slate-300 mb-8">
          {t('assessment.rights.subtitle')}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-slate-50 dark:bg-slate-700/50 rounded-lg p-6"
            >
              <div className="mb-4">{feature.icon}</div>
              <h3 className="font-semibold text-slate-900 dark:text-white mb-2">
                {feature.title}
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-300">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>

        <motion.button
          onClick={onStart || (() => {})}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          aria-label={t('assessments.rights.startAssessment')}
          className="inline-flex items-center px-6 py-3 bg-orange-500 dark:bg-orange-600 text-white rounded-lg hover:bg-orange-600 dark:hover:bg-orange-700 transition-colors text-lg font-medium mb-12"
        >
          {t('common.actions.start')} {t('common.breadcrumbs.assessment')}
          <ArrowRight className="ml-2 h-5 w-5" aria-hidden="true" />
        </motion.button>

        <div className="bg-slate-50 dark:bg-slate-700/50 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-6">
            {t('assessments.security.standardsRegulationsCoverage')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            {standards.map((standard, index) => (
              <div key={index} className="bg-white dark:bg-slate-800 rounded-lg p-4">
                <div className="flex items-center mb-3">
                  <div className="mr-3">{standard.icon}</div>
                  <h4 className="font-medium text-slate-900 dark:text-white">
                    {standard.name}
                  </h4>
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-300 mb-3">
                  {standard.description}
                </p>
                <ul className="space-y-2">
                  {standard.requirements.map((req, i) => (
                    <li key={i} className="text-sm text-slate-600 dark:text-slate-400 flex items-start">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      {req}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          
          <div className="border-t border-slate-200 dark:border-slate-600 pt-6">
            <h3 className="font-medium text-slate-900 dark:text-white mb-4">
              {t('assessments.security.additionalRegulations')}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {additionalRegulations.map((reg, index) => (
                <div key={index} className="bg-white dark:bg-slate-800 rounded-lg p-4">
                  <div className="flex items-center mb-2">
                    <Globe className="h-4 w-4 text-slate-400 mr-2" />
                    <h4 className="font-medium text-slate-900 dark:text-white">
                      {reg.name}
                    </h4>
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                    {reg.description}
                  </p>
                  <ul className="space-y-1">
                    {reg.requirements.map((req, i) => (
                      <li key={i} className="text-sm text-slate-600 dark:text-slate-400 flex items-start">
                        <FileText className="h-3 w-3 text-slate-400 mr-2 mt-0.5 flex-shrink-0" />
                        {req}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyRightsStartScreen;

