/**
 * Workflow Check Utility
 * Checks if user has completed the workflow to access personalized dashboard
 *
 * Workflow Steps (CONCERNS-BASED APPROACH - aligned with workflow repo):
 * 1. Service Privacy Catalog - select services you use (required)
 * 2. Privacy Concerns - select at least one concern (required) - PRIMARY PERSONALIZATION
 * 3. Assessment (required)
 *
 * Persona is now OPTIONAL - concerns drive personalization directly
 *
 * Note: Variable names kept for backward compatibility but concerns are now primary
 */

import { getConcernsFromStorage } from './concernHelpers';

export const checkWorkflowCompletion = () => {
  try {
    const persona = localStorage.getItem('socialcaution_persona');
    const results = localStorage.getItem('socialcaution_results');
    const services = localStorage.getItem('socialcaution_services');

    // Safely parse persona - handle both JSON objects and plain strings
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

    // Safely parse assessment results
    let assessmentData = null;
    if (results) {
      try {
        assessmentData = JSON.parse(results);
      } catch (e) {
        assessmentData = null;
      }
    }

    // Safely parse services
    let selectedServices = [];
    if (services) {
      try {
        selectedServices = JSON.parse(services);
        if (!Array.isArray(selectedServices)) {
          selectedServices = [];
        }
      } catch (e) {
        selectedServices = [];
      }
    }

    // Step 1: Services (required)
    const step2_services = Array.isArray(selectedServices) && selectedServices.length > 0;

    // Step 2: Concerns (required - PRIMARY PERSONALIZATION METHOD)
    let concerns = getConcernsFromStorage();
    const step3_concerns = Array.isArray(concerns) && concerns.length > 0;

    // Persona (OPTIONAL - kept for backward compatibility)
    const step1_persona = !!personaData?.primary;

    // Assessment check - also check 'assessment-results' key for compatibility
    let hasAssessment = !!(
      assessmentData?.exposureResults ||
      assessmentData?.rightsResults ||
      assessmentData?.completeAssessmentResults
    );

    if (!hasAssessment) {
      try {
        const fallbackResults = localStorage.getItem('assessment-results');
        if (fallbackResults) {
          const parsed = JSON.parse(fallbackResults);
          hasAssessment = !!(
            parsed?.data?.exposure ||
            parsed?.data?.rights ||
            parsed?.data?.complete
          );
        }
      } catch (e) {
        // Ignore parse errors
      }
    }

    const step4_assessment = hasAssessment;

    // Workflow is complete if: Services + Concerns + Assessment (Persona optional)
    const isComplete = step2_services && step3_concerns && step4_assessment;

    return {
      step1_persona,
      step2_services,
      step3_concerns,
      step4_assessment,
      isComplete,
      personaData,
      assessmentData,
      selectedServices: Array.isArray(selectedServices) ? selectedServices : []
    };
  } catch (error) {
    console.warn('Error checking workflow completion:', error);
    return {
      step1_persona: false,
      step2_services: false,
      step3_concerns: false,
      step4_assessment: false,
      isComplete: false,
      personaData: null,
      assessmentData: null,
      selectedServices: []
    };
  }
};

/**
 * Get workflow progress percentage
 */
export const getWorkflowProgress = () => {
  const status = checkWorkflowCompletion();
  const requiredSteps = 3; // Services, Concerns, Assessment (Persona is optional)
  let completedSteps = 0;

  if (status.step2_services) completedSteps++;
  if (status.step3_concerns) completedSteps++;
  if (status.step4_assessment) completedSteps++;

  return {
    percentage: Math.round((completedSteps / requiredSteps) * 100),
    completedSteps,
    totalSteps: requiredSteps,
    optionalPersona: status.step1_persona
  };
};
