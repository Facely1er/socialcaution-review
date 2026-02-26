import React, { useState } from 'react';
import { Play, CheckCircle, RotateCcw, BookOpen } from 'lucide-react';
import { motion } from 'framer-motion';
import { TutorialService } from '../../services/tutorialService';
import { getAllTutorials, getTutorialDefinition } from '../../data/tutorialSteps';
import InteractiveTutorial from '../common/InteractiveTutorial';
import SEOHead from '../common/SEOHead';
import EnhancedBreadcrumbs from '../common/EnhancedBreadcrumbs';
import { useTranslation } from '../../contexts/TranslationContext';

/**
 * Tutorials Page Component
 * 
 * Displays all available tutorials in a page format
 */
const TutorialPage = () => {
  const { t } = useTranslation();
  const [activeTutorial, setActiveTutorial] = useState(null);
  const [tutorialSteps, setTutorialSteps] = useState([]);

  const allTutorials = getAllTutorials();
  const completedTutorials = TutorialService.getCompletedTutorials();

  const handleTutorialClick = (tutorialId) => {
    const tutorial = getTutorialDefinition(tutorialId);
    if (tutorial) {
      setTutorialSteps(tutorial.steps);
      setActiveTutorial(tutorialId);
    }
  };

  const handleTutorialComplete = () => {
    setActiveTutorial(null);
    setTutorialSteps([]);
  };

  const handleTutorialSkip = () => {
    setActiveTutorial(null);
    setTutorialSteps([]);
  };

  const handleResetTutorial = (tutorialId, e) => {
    e.stopPropagation();
    TutorialService.resetTutorial(tutorialId);
    // Force re-render by updating state
    window.location.reload();
  };

  const isTutorialCompleted = (tutorialId) => {
    return completedTutorials.includes(tutorialId);
  };

  return (
    <>
      <SEOHead
        title="Interactive Tutorials | SocialCaution"
        description="Learn how to use SocialCaution to protect your privacy with interactive step-by-step tutorials"
        keywords="tutorials, how to use, privacy guide, interactive learning"
      />
      <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
        {/* Header Section – on page background */}
        <section className="pt-8 sm:pt-10 pb-8 sm:pb-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <EnhancedBreadcrumbs />
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center mt-8 sm:mt-12"
            >
              <h1 className="page-title mb-4 sm:mb-6 flex items-center justify-center gap-3 sm:gap-4">
                <div className="p-1.5 sm:p-2 md:p-2.5 bg-gradient-to-br from-red-500 to-red-600 rounded-lg shadow-md flex-shrink-0 flex items-center justify-center">
                  <BookOpen className="w-5 h-5 sm:w-5 sm:h-5 md:w-6 md:h-6 text-white" />
                </div>
                <span className="leading-tight">Interactive Tutorials</span>
              </h1>
              <p className="text-lg sm:text-xl md:text-2xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
                Learn how to use SocialCaution to protect your privacy with step-by-step interactive guides
              </p>
            </motion.div>
          </div>
        </section>

        {/* Tutorials Section */}
        <section className="py-12 sm:py-16 bg-gray-50 dark:bg-slate-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Tutorials Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {allTutorials.map((tutorial, index) => {
              const Icon = tutorial.icon;
              const completed = isTutorialCompleted(tutorial.id);

              return (
                <motion.div
                  key={tutorial.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="h-full"
                >
                  <button
                    onClick={() => handleTutorialClick(tutorial.id)}
                    className="w-full h-full p-6 sm:p-8 bg-white dark:bg-slate-800 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 text-left border border-gray-200 dark:border-slate-700 hover:border-blue-500 dark:hover:border-blue-500 group hover:-translate-y-2 flex flex-col"
                  >
                    <div className="flex items-start justify-between mb-5">
                      <div className={`p-4 sm:p-5 rounded-2xl flex-shrink-0 transition-all ${
                        completed 
                          ? 'bg-green-100 dark:bg-green-900/30 group-hover:bg-green-200 dark:group-hover:bg-green-900/50 group-hover:scale-110' 
                          : 'bg-blue-100 dark:bg-blue-900/30 group-hover:bg-blue-200 dark:group-hover:bg-blue-900/50 group-hover:scale-110'
                      }`}>
                        <Icon className={`w-8 h-8 sm:w-9 sm:h-9 ${
                          completed 
                            ? 'text-green-600 dark:text-green-400' 
                            : 'text-blue-600 dark:text-blue-400'
                        }`} />
                      </div>
                      {completed && (
                        <div className="flex items-center gap-2 px-3 py-1.5 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                          <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0" />
                          <span className="text-xs font-semibold text-green-700 dark:text-green-300">Completed</span>
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0 flex flex-col">
                      <h3 className="font-bold text-xl sm:text-2xl text-gray-900 dark:text-white mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2">
                        {tutorial.title}
                      </h3>
                      <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mb-6 leading-relaxed line-clamp-3 flex-grow">
                        {tutorial.description}
                      </p>
                      <div className="flex items-center justify-between mt-auto pt-5 border-t border-gray-200 dark:border-slate-700">
                        <div className="flex items-center gap-2">
                          <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 font-medium">
                            {tutorial.steps.length} {tutorial.steps.length === 1 ? 'step' : 'steps'}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          {completed && (
                            <button
                              onClick={(e) => handleResetTutorial(tutorial.id, e)}
                              className="text-xs sm:text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity px-3 py-1.5 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 font-medium"
                              title="Reset tutorial"
                            >
                              <RotateCcw className="w-4 h-4" />
                              Reset
                            </button>
                          )}
                          {!completed && (
                            <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800 group-hover:bg-blue-100 dark:group-hover:bg-blue-900/30 transition-colors">
                              <Play className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                              <span className="text-sm font-semibold text-blue-700 dark:text-blue-300">Start</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </button>
                </motion.div>
              );
            })}
            </div>

            {/* Info Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="mt-12 sm:mt-16 max-w-4xl mx-auto"
            >
              <div className="p-6 sm:p-8 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl border border-blue-200 dark:border-blue-800 shadow-sm">
                <p className="text-base sm:text-lg text-gray-700 dark:text-gray-300 text-center leading-relaxed">
                  Click on any tutorial above to start learning. These interactive guides will help you navigate and make the most of SocialCaution's privacy protection features.
                </p>
              </div>
            </motion.div>
          </div>
        </section>
      </div>

      {/* Active Tutorial */}
      {activeTutorial && tutorialSteps.length > 0 && (
        <InteractiveTutorial
          tutorialId={activeTutorial}
          steps={tutorialSteps}
          onComplete={handleTutorialComplete}
          onSkip={handleTutorialSkip}
          isVisible={true}
        />
      )}
    </>
  );
};

export default TutorialPage;
