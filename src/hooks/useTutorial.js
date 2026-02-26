import { useState, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { TutorialService } from '../services/tutorialService';
import { getTutorialsForRoute, getTutorialDefinition } from '../data/tutorialSteps';

/**
 * useTutorial Hook
 * 
 * Manages tutorial state and provides helper functions
 */
export function useTutorial() {
  const location = useLocation();
  const [activeTutorial, setActiveTutorial] = useState(null);
  const [tutorialSteps, setTutorialSteps] = useState([]);
  const [isTutorialVisible, setIsTutorialVisible] = useState(false);

  // Get available tutorials for current route
  const availableTutorials = getTutorialsForRoute(location.pathname);

  // Check if user should see tutorial prompt
  const shouldShowPrompt = useCallback(() => {
    if (availableTutorials.length === 0) return false;
    
    // Check if any tutorial for this route is not completed
    const hasIncompleteTutorial = availableTutorials.some(
      tutorialId => !TutorialService.isTutorialCompleted(tutorialId)
    );

    return hasIncompleteTutorial && !TutorialService.hasSeenTutorialPrompt();
  }, [availableTutorials]);

  // Start a tutorial
  const startTutorial = useCallback((tutorialId) => {
    const tutorial = getTutorialDefinition(tutorialId);
    if (tutorial) {
      setTutorialSteps(tutorial.steps);
      setActiveTutorial(tutorialId);
      setIsTutorialVisible(true);
    }
  }, []);

  // Start the first available tutorial for current route
  const startAvailableTutorial = useCallback(() => {
    if (availableTutorials.length > 0) {
      const firstTutorial = availableTutorials[0];
      if (!TutorialService.isTutorialCompleted(firstTutorial)) {
        startTutorial(firstTutorial);
        TutorialService.markTutorialPromptSeen();
      }
    }
  }, [availableTutorials, startTutorial]);

  // Complete tutorial
  const completeTutorial = useCallback(() => {
    if (activeTutorial) {
      TutorialService.markTutorialCompleted(activeTutorial);
    }
    setActiveTutorial(null);
    setTutorialSteps([]);
    setIsTutorialVisible(false);
  }, [activeTutorial]);

  // Skip tutorial
  const skipTutorial = useCallback(() => {
    setActiveTutorial(null);
    setTutorialSteps([]);
    setIsTutorialVisible(false);
  }, []);

  // Check if tutorial is completed
  const isTutorialCompleted = useCallback((tutorialId) => {
    return TutorialService.isTutorialCompleted(tutorialId);
  }, []);

  return {
    activeTutorial,
    tutorialSteps,
    isTutorialVisible,
    availableTutorials,
    shouldShowPrompt,
    startTutorial,
    startAvailableTutorial,
    completeTutorial,
    skipTutorial,
    isTutorialCompleted,
  };
}

