import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Users, UserCheck, Settings, Sparkles as SparklesIcon, ArrowRight } from 'lucide-react';
import { PersonaProfiles, PersonaColors } from '../../data/personaProfiles';
import { getIconComponent } from '../../utils/iconMapping.js';
import { useTranslation } from '../../contexts/TranslationContext';
import { useLocalStorage } from '../../hooks/useLocalStorage';

const SimplePersonasSection = () => {
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

  return (
    <section id="personas" className="py-12 sm:py-16 md:py-20 bg-gradient-to-br from-purple-50 via-indigo-50 to-blue-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-200/30 dark:bg-indigo-500/15 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-purple-200/30 dark:bg-purple-500/15 rounded-full blur-3xl -translate-x-1/2 translate-y-1/2"></div>
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
            {t('homePage.personas.title') || 'Discover Your Privacy Persona'}
          </motion.h2>
          <motion.p
            className="text-base sm:text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto px-2"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
          >
            {t('homePage.personas.subtitle') || 'Choose a privacy persona that matches your needs and concerns'}
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
                Current Persona: {PersonaProfiles[personaData.primary]?.name || 'Selected'}
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
                className={`modern-card bg-white dark:bg-slate-800 rounded-xl p-5 sm:p-6 border-2 ${colors.border} hover:shadow-xl transition-all duration-300 group cursor-pointer`}
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
                onClick={() => navigate('/privacy-settings')}
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
                      {persona.name}
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 mb-3 leading-relaxed">
                      {persona.description}
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {persona.primaryConcerns.slice(0, 2).map((concern, idx) => (
                        <span
                          key={idx}
                          className={`px-2 py-0.5 text-[10px] sm:text-xs font-medium rounded-full ${colors.bg} ${colors.text} border ${colors.border}`}
                        >
                          {concern.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
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
            <div className="absolute inset-0 bg-gradient-to-r from-accent/5 via-accent/2 to-blue-500/5 pointer-events-none"></div>
            <div className="relative z-10">
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4">
                {t('homePage.personas.howPersonasWork') || 'How Personas Work'}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 text-left">
                {[
                  { icon: UserCheck, title: 'Select Your Persona', desc: 'Choose from privacy personas that match your needs', bgClass: 'bg-purple-100 dark:bg-purple-900/30', iconClass: 'text-purple-600 dark:text-purple-400' },
                  { icon: Settings, title: 'Customize Your Focus', desc: 'Set your privacy concerns and preferences', bgClass: 'bg-indigo-100 dark:bg-indigo-900/30', iconClass: 'text-indigo-600 dark:text-indigo-400' },
                  { icon: SparklesIcon, title: 'Personalized Experience', desc: 'Get tailored privacy insights and recommendations', bgClass: 'bg-blue-100 dark:bg-blue-900/30', iconClass: 'text-blue-600 dark:text-blue-400' }
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
              className="px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-accent to-accent-dark text-white font-bold rounded-xl hover:from-accent-dark hover:to-accent transition-all transform hover:scale-105 shadow-lg hover:shadow-accent/40 min-h-[44px] touch-manipulation text-sm sm:text-base flex items-center justify-center gap-2"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Users className="w-5 h-5" />
              {t('homePage.personas.exploreAllPersonas') || 'Explore All Personas'}
            </motion.button>
          </div>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-4">
            {t('homePage.personas.personaOptional') || 'Persona selection is optional - you can browse services without selecting one'}
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default SimplePersonasSection;

