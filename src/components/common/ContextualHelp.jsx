import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { HelpCircle, BookOpen, Play, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getTutorialsForRoute, getTutorialDefinition } from '../../data/tutorialSteps';
import InteractiveTutorial from './InteractiveTutorial';
import { useTranslation } from '../../contexts/TranslationContext';

/**
 * ContextualHelp Component
 * 
 * Provides contextual help buttons and tutorial links for specific pages
 * Shows relevant tutorials based on the current route
 */
const ContextualHelp = ({ 
  tutorialId = null, 
  variant = 'button', // 'button' | 'icon' | 'inline'
  className = '',
  showLabel = true 
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();
  const [showMenu, setShowMenu] = useState(false);
  const [activeTutorial, setActiveTutorial] = useState(null);
  const [tutorialSteps, setTutorialSteps] = useState([]);

  // Get tutorials for current route or use provided tutorialId
  const relevantTutorials = tutorialId 
    ? [getTutorialDefinition(tutorialId)].filter(Boolean)
    : getTutorialsForRoute(location.pathname).map(id => getTutorialDefinition(id)).filter(Boolean);

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

  // If no relevant tutorials, show link to tutorial page
  if (relevantTutorials.length === 0) {
    if (variant === 'icon') {
      return (
        <button
          onClick={() => navigate('/tutorial')}
          className={`p-2 text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors ${className}`}
          aria-label="View tutorials"
          title="View tutorials"
        >
          <HelpCircle className="w-5 h-5" />
        </button>
      );
    }
    
    return (
      <button
        onClick={() => navigate('/tutorial')}
        className={`inline-flex items-center gap-2 px-3 py-2 text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors ${className}`}
      >
        <HelpCircle className="w-4 h-4" />
        {showLabel && t('tutorials.viewAll')}
      </button>
    );
  }

  // Single tutorial - show direct button
  if (relevantTutorials.length === 1 && variant !== 'inline') {
    const tutorial = relevantTutorials[0];
    return (
      <>
        {variant === 'icon' ? (
          <button
            onClick={() => handleTutorialClick(tutorial.id)}
            className={`p-2 text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors ${className}`}
            aria-label={`Start ${tutorial.title} tutorial`}
            title={tutorial.title}
          >
            <HelpCircle className="w-5 h-5" />
          </button>
        ) : (
          <button
            onClick={() => handleTutorialClick(tutorial.id)}
            className={`inline-flex items-center gap-2 px-3 py-2 text-sm bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-lg transition-colors ${className}`}
          >
            <Play className="w-4 h-4" />
            {showLabel && (t('tutorials.startTutorial') || `Start ${tutorial.title}`)}
          </button>
        )}
        
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
  }

  // Multiple tutorials - show menu
  return (
    <>
      <div className={`relative ${className}`}>
        {variant === 'icon' ? (
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="p-2 text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            aria-label="View tutorials"
            title="View tutorials"
          >
            <HelpCircle className="w-5 h-5" />
          </button>
        ) : variant === 'inline' ? (
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="inline-flex items-center gap-2 px-3 py-2 text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
          >
            <HelpCircle className="w-4 h-4" />
            {showLabel && t('tutorials.needHelp')}
          </button>
        ) : (
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="inline-flex items-center gap-2 px-3 py-2 text-sm bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-lg transition-colors"
          >
            <BookOpen className="w-4 h-4" />
            {showLabel && t('tutorials.tutorials')}
          </button>
        )}

        <AnimatePresence>
          {showMenu && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/20 z-[9996]"
                onClick={() => setShowMenu(false)}
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 10 }}
                className="absolute right-0 mt-2 w-64 bg-white dark:bg-slate-800 rounded-lg shadow-xl border border-gray-200 dark:border-slate-700 overflow-hidden z-[9997]"
              >
                <div className="p-3 border-b border-gray-200 dark:border-slate-700 flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                    {t('tutorials.availableTutorials')}
                  </h3>
                  <button
                    onClick={() => setShowMenu(false)}
                    className="p-1 hover:bg-gray-100 dark:hover:bg-slate-700 rounded transition-colors"
                    aria-label="Close menu"
                  >
                    <X className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                  </button>
                </div>
                <div className="max-h-64 overflow-y-auto">
                  {relevantTutorials.map((tutorial) => (
                    <button
                      key={tutorial.id}
                      onClick={() => handleTutorialClick(tutorial.id)}
                      className="w-full p-3 text-left hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors border-b border-gray-100 dark:border-slate-700 last:border-b-0"
                    >
                      <div className="flex items-start gap-2">
                        <BookOpen className="w-4 h-4 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-1">
                            {tutorial.title}
                          </h4>
                          <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2">
                            {tutorial.description}
                          </p>
                        </div>
                        <Play className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" />
                      </div>
                    </button>
                  ))}
                </div>
                <div className="p-3 border-t border-gray-200 dark:border-slate-700">
                  <button
                    onClick={() => {
                      setShowMenu(false);
                      navigate('/tutorial');
                    }}
                    className="w-full text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 text-center"
                  >
                    {t('tutorials.viewAll')}
                  </button>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>

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

export default ContextualHelp;
