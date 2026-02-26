import { useState, useEffect, useRef, useCallback } from 'react';
import { X, ChevronRight, ChevronLeft, HelpCircle, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { TutorialService } from '../../services/tutorialService';

/**
 * Interactive Tutorial Component
 * 
 * Provides step-by-step guidance with element highlighting
 * Features:
 * - Highlights specific elements on the page
 * - Shows tooltips with step information
 * - Tracks progress
 * - Smooth animations
 * - Keyboard navigation support
 */
const InteractiveTutorial = ({ 
  tutorialId, 
  steps, 
  onComplete, 
  onSkip,
  isVisible = true,
  autoStart = false 
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [highlightedElement, setHighlightedElement] = useState(null);
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 });
  const [showTooltip, setShowTooltip] = useState(false);
  const overlayRef = useRef(null);
  const tooltipRef = useRef(null);

  // Load saved progress
  useEffect(() => {
    if (tutorialId) {
      const progress = TutorialService.getTutorialProgress(tutorialId);
      if (progress.currentStep > 0 && progress.currentStep < steps.length) {
        setCurrentStep(progress.currentStep);
      }
    }
  }, [tutorialId, steps.length]);

  // Handle element highlighting
  useEffect(() => {
    if (!isVisible || currentStep >= steps.length) return;

    const step = steps[currentStep];
    let element = null;

    // Find target element
    if (step.target) {
      element = document.querySelector(step.target);
    }

    setHighlightedElement(element);

    // Calculate tooltip position
    if (element) {
      updateTooltipPosition(element, step.position || 'bottom');
    } else {
      // Center tooltip if no target
      setTooltipPosition({
        top: window.innerHeight / 2,
        left: window.innerWidth / 2,
      });
    }

    setShowTooltip(true);

    // Scroll element into view if needed
    if (element) {
      setTimeout(() => {
        element.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'center',
          inline: 'nearest'
        });
      }, 300);
    }

    // Save progress
    if (tutorialId) {
      TutorialService.saveTutorialProgress(tutorialId, currentStep);
    }
  }, [currentStep, steps, isVisible, tutorialId]);

  // Update tooltip position based on element and preferred position
  const updateTooltipPosition = useCallback((element, preferredPosition) => {
    if (!element) return;

    const rect = element.getBoundingClientRect();
    const tooltipWidth = Math.min(400, window.innerWidth - 40); // Responsive width with padding
    const tooltipHeight = 300; // Approximate tooltip height
    const spacing = 24;

    let top = 0;
    let left = 0;

    switch (preferredPosition) {
      case 'top':
        top = rect.top - tooltipHeight - spacing;
        left = rect.left + (rect.width / 2);
        break;
      case 'bottom':
        top = rect.bottom + spacing;
        left = rect.left + (rect.width / 2);
        break;
      case 'left':
        top = rect.top + (rect.height / 2);
        left = rect.left - spacing;
        break;
      case 'right':
        top = rect.top + (rect.height / 2);
        left = rect.right + spacing;
        break;
      case 'center':
      default:
        top = window.innerHeight / 2;
        left = window.innerWidth / 2;
        break;
    }

    // Keep tooltip within viewport
    const padding = 20;
    const maxWidth = Math.min(400, window.innerWidth - 40);
    const halfTooltipWidth = maxWidth / 2;
    
    // Adjust left to keep tooltip within viewport when centered
    if (preferredPosition === 'top' || preferredPosition === 'bottom' || preferredPosition === 'center') {
      left = Math.max(padding + halfTooltipWidth, Math.min(left, window.innerWidth - padding - halfTooltipWidth));
    } else {
      // For left/right, adjust differently
      left = Math.max(padding, Math.min(left, window.innerWidth - padding));
    }
    
    top = Math.max(padding, Math.min(top, window.innerHeight - tooltipHeight - padding));

    setTooltipPosition({ top, left });
  }, []);

  // Handle keyboard navigation
  useEffect(() => {
    if (!isVisible) return;

    const handleKeyDown = (e) => {
      if (e.key === 'ArrowRight' || e.key === 'Enter') {
        handleNext();
      } else if (e.key === 'ArrowLeft') {
        handlePrev();
      } else if (e.key === 'Escape') {
        handleSkip();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isVisible, currentStep, steps.length]);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setIsAnimating(true);
      setShowTooltip(false);
      
      setTimeout(() => {
        setCurrentStep(currentStep + 1);
        setIsAnimating(false);
      }, 300);
    } else {
      handleComplete();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setIsAnimating(true);
      setShowTooltip(false);
      
      setTimeout(() => {
        setCurrentStep(currentStep - 1);
        setIsAnimating(false);
      }, 300);
    }
  };

  const handleComplete = () => {
    if (tutorialId) {
      TutorialService.markTutorialCompleted(tutorialId);
    }
    setShowTooltip(false);
    setHighlightedElement(null);
    if (onComplete) {
      onComplete();
    }
  };

  const handleSkip = () => {
    setShowTooltip(false);
    setHighlightedElement(null);
    if (onSkip) {
      onSkip();
    }
  };

  if (!isVisible || currentStep >= steps.length) return null;

  const currentStepData = steps[currentStep];
  const progress = ((currentStep + 1) / steps.length) * 100;
  const IconComponent = currentStepData.icon || HelpCircle;

  return (
    <>
      {/* Overlay with spotlight effect */}
      <AnimatePresence>
        {showTooltip && (
          <motion.div
            ref={overlayRef}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9998] pointer-events-auto"
            onClick={handleNext}
          >
            {/* Dark overlay */}
            <div className="absolute inset-0 bg-black/60" />
            
            {/* Spotlight effect on highlighted element */}
            {highlightedElement && (
              <div
                className="absolute border-4 border-blue-500 rounded-lg shadow-[0_0_0_9999px_rgba(0,0,0,0.6)] pointer-events-none"
                style={{
                  top: highlightedElement.getBoundingClientRect().top - 4,
                  left: highlightedElement.getBoundingClientRect().left - 4,
                  width: highlightedElement.getBoundingClientRect().width + 8,
                  height: highlightedElement.getBoundingClientRect().height + 8,
                  boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.6), 0 0 20px rgba(59, 130, 246, 0.5)',
                }}
              />
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Tooltip */}
      <AnimatePresence>
        {showTooltip && currentStepData && (
          <motion.div
            ref={tooltipRef}
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed z-[9999] pointer-events-auto"
            style={{
              top: `${tooltipPosition.top}px`,
              left: `${tooltipPosition.left}px`,
              maxWidth: 'min(400px, calc(100vw - 40px))',
              width: 'min(400px, calc(100vw - 40px))',
              transform: 'translateX(-50%)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-slate-700 overflow-hidden w-full">
              {/* Header */}
              <div className="flex items-center justify-between p-5 sm:p-6 border-b border-gray-200 dark:border-slate-700 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="p-2.5 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex-shrink-0">
                    <IconComponent className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white mb-1">
                      {currentStepData.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                      Step {currentStep + 1} of {steps.length}
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleSkip}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors flex-shrink-0 ml-2"
                  aria-label="Skip tutorial"
                >
                  <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                </button>
              </div>

              {/* Progress Bar */}
              <div className="px-5 sm:px-6 py-3 bg-gray-50 dark:bg-slate-900/50">
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <motion.div
                    className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
              </div>

              {/* Content */}
              <div className={`p-5 sm:p-6 transition-all duration-300 ${isAnimating ? 'opacity-50' : 'opacity-100'}`}>
                <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                  {currentStepData.description}
                </p>

                {/* Action hint */}
                {currentStepData.action && (
                  <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                    <p className="text-xs sm:text-sm text-blue-800 dark:text-blue-200 flex items-center gap-2 font-medium">
                      <Sparkles className="w-4 h-4 flex-shrink-0" />
                      <span>
                        {currentStepData.action === 'scroll' && 'Scroll to see more'}
                        {currentStepData.action === 'click' && 'Click to continue'}
                      </span>
                    </p>
                  </div>
                )}
              </div>

              {/* Navigation */}
              <div className="flex items-center justify-between p-5 sm:p-6 border-t border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-900/50 gap-4">
                <button
                  onClick={handlePrev}
                  disabled={currentStep === 0}
                  className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all rounded-lg"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span className="hidden sm:inline">Previous</span>
                </button>

                {/* Step indicators */}
                <div className="flex gap-1.5 flex-1 justify-center">
                  {steps.map((_, index) => (
                    <div
                      key={index}
                      className={`h-2 rounded-full transition-all ${
                        index === currentStep 
                          ? 'bg-blue-500 w-6' 
                          : index < currentStep 
                            ? 'bg-blue-300 dark:bg-blue-600 w-2' 
                            : 'bg-gray-300 dark:bg-gray-600 w-2'
                      }`}
                    />
                  ))}
                </div>

                <button
                  onClick={handleNext}
                  className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all shadow-lg hover:shadow-xl min-h-[44px]"
                >
                  <span>{currentStep === steps.length - 1 ? 'Finish' : 'Next'}</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Arrow pointing to element */}
            {highlightedElement && (() => {
              const elementRect = highlightedElement.getBoundingClientRect();
              const tooltipTop = tooltipPosition.top;
              const tooltipCenterX = tooltipPosition.left;
              const isTooltipAbove = tooltipTop < elementRect.top;
              
              return (
                <motion.div
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="absolute w-0 h-0 pointer-events-none"
                  style={{
                    top: isTooltipAbove 
                      ? `${tooltipTop + 100}px`
                      : `${tooltipTop - 12}px`,
                    left: `${tooltipCenterX}px`,
                    transform: 'translateX(-50%)',
                    borderLeft: '10px solid transparent',
                    borderRight: '10px solid transparent',
                    borderTop: isTooltipAbove
                      ? '14px solid white'
                      : 'none',
                    borderBottom: !isTooltipAbove
                      ? '14px solid white'
                      : 'none',
                    filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))',
                  }}
                />
              );
            })()}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default InteractiveTutorial;

