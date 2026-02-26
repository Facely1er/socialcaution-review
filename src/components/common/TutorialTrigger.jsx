import { useState } from 'react';
import { HelpCircle, Play, CheckCircle, RotateCcw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { TutorialService } from '../../services/tutorialService';
import { getAllTutorials, getTutorialDefinition } from '../../data/tutorialSteps';
import InteractiveTutorial from './InteractiveTutorial';

/**
 * Tutorial Trigger Component
 * 
 * Provides a floating button to access tutorials
 * Shows available tutorials in a menu
 */
const TutorialTrigger = ({ currentRoute = '/' }) => {
  const [showMenu, setShowMenu] = useState(false);
  const [activeTutorial, setActiveTutorial] = useState(null);
  const [tutorialSteps, setTutorialSteps] = useState([]);

  const allTutorials = getAllTutorials();
  const completedTutorials = TutorialService.getCompletedTutorials();

  const handleTutorialClick = (tutorialId) => {
    const tutorial = getTutorialDefinition(tutorialId);
    if (tutorial) {
      setTutorialSteps(tutorial.steps);
      setActiveTutorial(tutorialId);
      setShowMenu(false);
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
    // Refresh the component
    setShowMenu(false);
    setTimeout(() => setShowMenu(true), 100);
  };

  const isTutorialCompleted = (tutorialId) => {
    return completedTutorials.includes(tutorialId);
  };

  return (
    <>
      {/* Floating Tutorial Button */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        className="fixed bottom-20 right-4 z-[9997] lg:bottom-6"
      >
        <button
          onClick={() => setShowMenu(!showMenu)}
          className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full shadow-lg hover:shadow-xl transition-all flex items-center justify-center group"
          aria-label="Open tutorial menu"
        >
          <HelpCircle className="w-5 h-5 group-hover:scale-110 transition-transform" />
        </button>

        {/* Tutorial Menu */}
        <AnimatePresence>
          {showMenu && (
            <>
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/20 z-[9996]"
                onClick={() => setShowMenu(false)}
              />

              {/* Menu */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="absolute bottom-20 right-0 w-72 bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-slate-700 overflow-hidden z-[9997]"
              >
                <div className="p-4 border-b border-gray-200 dark:border-slate-700">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
                    Interactive Tutorials
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Learn how to use SocialCaution
                  </p>
                </div>

                <div className="max-h-96 overflow-y-auto">
                  {allTutorials.map((tutorial) => {
                    const Icon = tutorial.icon;
                    const completed = isTutorialCompleted(tutorial.id);

                    return (
                      <button
                        key={tutorial.id}
                        onClick={() => handleTutorialClick(tutorial.id)}
                        className="w-full p-4 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors text-left border-b border-gray-100 dark:border-slate-700 last:border-b-0 group"
                      >
                        <div className="flex items-start gap-3">
                          <div className={`p-2 rounded-lg flex-shrink-0 ${
                            completed 
                              ? 'bg-green-100 dark:bg-green-900/30' 
                              : 'bg-blue-100 dark:bg-blue-900/30'
                          }`}>
                            <Icon className={`w-5 h-5 ${
                              completed 
                                ? 'text-green-600 dark:text-green-400' 
                                : 'text-blue-600 dark:text-blue-400'
                            }`} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1">
                              <h4 className="font-semibold text-gray-900 dark:text-white text-sm">
                                {tutorial.title}
                              </h4>
                              {completed && (
                                <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400 flex-shrink-0" />
                              )}
                            </div>
                            <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                              {tutorial.description}
                            </p>
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-gray-500 dark:text-gray-500">
                                {tutorial.steps.length} steps
                              </span>
                              {completed && (
                                <button
                                  onClick={(e) => handleResetTutorial(tutorial.id, e)}
                                  className="text-xs text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                  title="Reset tutorial"
                                >
                                  <RotateCcw className="w-3 h-3" />
                                  Reset
                                </button>
                              )}
                            </div>
                          </div>
                          {!completed && (
                            <Play className="w-4 h-4 text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors flex-shrink-0 mt-1" />
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>

                <div className="p-3 bg-gray-50 dark:bg-slate-900/50 border-t border-gray-200 dark:border-slate-700">
                  <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                    Tap any tutorial to start
                  </p>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </motion.div>

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

export default TutorialTrigger;

