import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Users, Target, UserCheck, Settings, Sparkles as SparklesIcon, ArrowRight, Shield } from 'lucide-react';
import { PersonaProfiles, PersonaColors } from '../../data/personaProfiles';
import { getIconComponent } from '../../utils/iconMapping.js';
import { useTranslation } from '../../contexts/TranslationContext';
import { useLocalStorage } from '../../hooks/useLocalStorage';

const PersonasSection = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [persona] = useLocalStorage('socialcaution_persona', null);

  // Safely parse persona
  let personaData = null;
  if (persona) {
    try {
      personaData = JSON.parse(persona);
      if (typeof personaData === 'string') {
        personaData = { primary: personaData };
      }
    } catch (e) {
      personaData = { primary: persona };
    }
  }

  const handleAssessmentStart = () => {
    navigate('/assessment/full');
  };

  return (
    <section id="personas" className="py-12 sm:py-16 md:py-20 bg-gradient-to-br from-purple-50 via-indigo-50 to-blue-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-200/30 dark:bg-indigo-500/15 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-purple-200/30 dark:bg-purple-500/15 rounded-full blur-3xl -translate-x-1/2 translate-y-1/2"></div>
        <div className="absolute top-1/2 right-1/4 w-64 h-64 bg-accent/15 dark:bg-accent/8 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        <motion.div
          className="text-center mb-10 sm:mb-12 md:mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <motion.div
            className="flex items-center justify-center mb-4"
            whileHover={{ scale: 1.1 }}
            transition={{ duration: 0.3 }}
          >
            <Users className="w-10 h-10 sm:w-12 sm:h-12 text-accent" />
          </motion.div>
          <motion.h2
            className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4 px-2"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            {personaData?.primary ? t('homePage.personas.title') : 'Want Deeper Insights?'}
          </motion.h2>
          <motion.p
            className="text-base sm:text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto px-2"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
          >
            {personaData?.primary 
              ? t('homePage.personas.subtitle')
              : 'Already browsed our service catalog? Select a privacy persona for personalized recommendations tailored to your unique privacy needs and concerns.'}
          </motion.p>
          {personaData && (
            <motion.div
              className="mt-6 inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 rounded-full"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <Users className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
              <span className="text-sm font-medium text-indigo-700 dark:text-indigo-300">
                {t('homePage.personas.currentPersona', { name: t(`personas.${personaData.primary}.name`, { defaultValue: PersonaProfiles[personaData.primary]?.name || 'Selected' }) })}
              </span>
            </motion.div>
          )}
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8 sm:mb-10">
          {Object.entries(PersonaProfiles).map(([key, persona], index) => {
            const colors = PersonaColors[persona.color];
            const IconComponent = getIconComponent(persona.icon);
            
            return (
              <motion.div
                key={key}
                className={`modern-card bg-white dark:bg-slate-800 rounded-xl p-5 sm:p-6 border-2 ${colors.border} hover:shadow-xl transition-all duration-300 group`}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
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
                <div className="flex items-start gap-3 sm:gap-4">
                  <motion.div
                    className={`w-12 h-12 sm:w-14 sm:h-14 ${colors.bg} rounded-full flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300`}
                    whileHover={{ rotate: 5 }}
                  >
                    <IconComponent className={`w-6 h-6 sm:w-7 sm:h-7 ${colors.accent}`} />
                  </motion.div>
                  <div className="flex-1 min-w-0">
                    <h3 className={`text-lg sm:text-xl font-bold ${colors.text} mb-1 sm:mb-2`}>
                      {t(`personas.${key}.name`)}
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 mb-3 leading-relaxed">
                      {t(`personas.${key}.description`)}
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {persona.primaryConcerns.slice(0, 2).map((concern, idx) => (
                        <span
                          key={idx}
                          className={`px-2 py-0.5 text-[10px] sm:text-xs font-medium rounded-full ${colors.bg} ${colors.text} border ${colors.border}`}
                        >
                          {t(`personas.${key}.primaryConcerns.${concern}`, { defaultValue: concern.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase()) })}
                        </span>
                      ))}
                      {persona.primaryConcerns.length > 2 && (
                        <span className={`px-2 py-0.5 text-[10px] sm:text-xs font-medium rounded-full ${colors.bg} ${colors.text} border ${colors.border}`}>
                          +{persona.primaryConcerns.length - 2}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          viewport={{ once: true }}
        >
          <div className="bg-white dark:bg-slate-800 rounded-xl p-6 sm:p-8 shadow-lg border border-accent/30 dark:border-accent/20 max-w-3xl mx-auto mb-6 sm:mb-8 glass-card relative overflow-hidden">
            {/* Accent gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-accent/5 via-accent/2 to-blue-500/5 pointer-events-none"></div>
            <div className="relative z-10">
            <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4">
              {t('homePage.personas.howPersonasWork')}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 text-left">
              {[
                { icon: UserCheck, title: t('homePage.personas.selectYourPersona'), desc: t('homePage.personas.selectYourPersonaDesc'), bgClass: 'bg-purple-100 dark:bg-purple-900/30', iconClass: 'text-purple-600 dark:text-purple-400' },
                { icon: Settings, title: t('homePage.personas.customizeYourFocus'), desc: t('homePage.personas.customizeYourFocusDesc'), bgClass: 'bg-indigo-100 dark:bg-indigo-900/30', iconClass: 'text-indigo-600 dark:text-indigo-400' },
                { icon: SparklesIcon, title: t('homePage.personas.personalizedExperience'), desc: t('homePage.personas.personalizedExperienceDesc'), bgClass: 'bg-blue-100 dark:bg-blue-900/30', iconClass: 'text-blue-600 dark:text-blue-400' }
              ].map((item, idx) => (
                <motion.div
                  key={idx}
                  className="flex items-start gap-3"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.8 + idx * 0.1 }}
                  viewport={{ once: true }}
                >
                  <div className={`w-10 h-10 ${item.bgClass} rounded-full flex items-center justify-center flex-shrink-0`}>
                    <item.icon className={`w-5 h-5 ${item.iconClass}`} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white text-sm sm:text-base mb-1">{item.title}</h4>
                    <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">{item.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
            <motion.button
              type="button"
              onClick={() => navigate('/privacy-settings')}
              className="px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold rounded-xl hover:from-purple-700 hover:to-indigo-700 transition-all transform hover:scale-105 shadow-lg hover:shadow-purple-500/40 min-h-[44px] touch-manipulation text-sm sm:text-base flex items-center justify-center gap-2"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Users className="w-5 h-5" />
              Get Personalized Insights
            </motion.button>
            <motion.button
              type="button"
              onClick={() => navigate('/service-catalog')}
              className="px-6 sm:px-8 py-3 sm:py-4 bg-white dark:bg-slate-800 border-2 border-purple-600 dark:border-purple-400 text-purple-600 dark:text-purple-400 font-bold rounded-xl hover:bg-purple-50 dark:hover:bg-slate-700 transition-all transform hover:scale-105 hover:shadow-purple-500/30 min-h-[44px] touch-manipulation text-sm sm:text-base flex items-center justify-center gap-2"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Shield className="w-5 h-5" />
              Back to Services Monitoring
            </motion.button>
          </div>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-4">
            Optional: Browse services first to understand what we monitor
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default PersonasSection;

