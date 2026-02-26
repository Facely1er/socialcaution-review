import React from 'react';
import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import EnhancedBreadcrumbs from './common/EnhancedBreadcrumbs';
import ThemeToggle from './common/ThemeToggle';
import AssessmentLimitChecker from './common/AssessmentLimitChecker';
import AssessmentStartScreen from './assessments/AssessmentStartScreen';
import PrivacyRightsStartScreen from './assessments/PrivacyRightsStartScreen';
import ExposureStartScreen from './assessments/ExposureStartScreen';
import PrivacyRiskExposure from './assessments/PrivacyRiskExposure';
import PrivacyRightsCheckup from './assessments/PrivacyRightsCheckup';
import CompleteAssessment from './assessments/CompleteAssessment';
import AssessmentResults from './assessments/AssessmentResults';
import { analytics } from '../utils/analytics.js';
import { calculateExposureScore, calculateRightsScore } from '../utils/assessmentScoring.js';

const AssessmentRouter = ({ onComplete }) => {
  const { type } = useParams();
  const navigate = useNavigate();

  // Support both old and new route formats
  const validTypes = ['full', 'exposure', 'rights', 'privacy-rights'];
  if (!validTypes.includes(type)) {
    navigate('/assessment');
    return null;
  }

  const [exposureResults, setExposureResults] = useState(null);
  const [rightsResults, setRightsResults] = useState(null);
  const [completeAssessmentResults, setCompleteAssessmentResults] = useState(null);
  const [actionPlan, setActionPlan] = useState(null);
  const [currentStep, setCurrentStep] = useState('start');

  const handleStartAssessment = () => {
    setCurrentStep('assessment');
  };

  const handleExposureComplete = (results) => {
    setExposureResults(results);
    
    // Store results in localStorage for dashboard access
    localStorage.setItem('assessment-results', JSON.stringify({
      type: 'exposure',
      data: results,
      timestamp: new Date().toISOString()
    }));
    
    // Track assessment completion with calculated scores
    const exposureScore = calculateExposureScore(results);
    analytics.trackAssessmentComplete('exposure', null, {
      exposureScore,
      rightsScore: 0
    });
    
    // For 'full' type, we now use CompleteAssessment instead of chaining
    setCurrentStep('results');
  };

  const handleRightsComplete = (results) => {
    setRightsResults(results);
    
    // Store results in localStorage for dashboard access
    localStorage.setItem('assessment-results', JSON.stringify({
      type: 'rights',
      data: results,
      timestamp: new Date().toISOString()
    }));
    
    // Track assessment completion with calculated scores
    const rightsScore = calculateRightsScore(results);
    analytics.trackAssessmentComplete('rights', null, {
      exposureScore: 0,
      rightsScore
    });
    
    setCurrentStep('results');
  };

  const handleCompleteAssessmentComplete = (results, plan) => {
    setCompleteAssessmentResults(results);
    setActionPlan(plan);
    
    // Store results in localStorage for dashboard access
    localStorage.setItem('assessment-results', JSON.stringify({
      type: 'full',
      data: {
        complete: results,
        actionPlan: plan
      },
      timestamp: new Date().toISOString()
    }));
    
    // Track assessment completion
    analytics.trackAssessmentComplete('full', null, {
      actionReadinessScore: plan?.actionReadinessScore || 0
    });
    
    setCurrentStep('results');
  };

  const handleResultsComplete = (persona, userBehavior) => {
    // Handle different assessment types
    if (type === 'full' && completeAssessmentResults && actionPlan) {
      // Complete assessment results
      if (onComplete) {
        onComplete(null, null, persona, actionPlan);
      }
    } else {
      // Exposure or Rights assessment results
      const finalExposureResults = exposureResults;
      const finalRightsResults = rightsResults;
      
      // Store combined results in localStorage if both assessments completed
      if (finalExposureResults && finalRightsResults) {
        localStorage.setItem('assessment-results', JSON.stringify({
          type: 'full',
          data: {
            exposure: finalExposureResults,
            rights: finalRightsResults
          },
          timestamp: new Date().toISOString()
        }));
      }
      
      if (onComplete) {
        onComplete(finalExposureResults, finalRightsResults, persona);
      }
    }
    navigate('/dashboard');
  };

  if (currentStep === 'start') {
    // Wrap start screens with AssessmentLimitChecker
    const startScreenContent = (() => {
      if (type === 'privacy-rights' || type === 'rights') {
        return (
          <div className="min-h-screen bg-gray-50 dark:bg-slate-900 py-8">
            <div className="max-w-6xl mx-auto px-4">
              <PrivacyRightsStartScreen onStart={handleStartAssessment} />
            </div>
          </div>
        );
      } else if (type === 'exposure') {
        return (
          <div className="min-h-screen bg-gray-50 dark:bg-slate-900 py-8">
            <div className="max-w-6xl mx-auto px-4">
              <ExposureStartScreen onStart={handleStartAssessment} />
            </div>
          </div>
        );
      } else {
        // Fallback to original start screen for 'full' assessment
        return (
          <AssessmentStartScreen
            assessmentType={type}
            onStart={handleStartAssessment}
          />
        );
      }
    })();

    return (
      <AssessmentLimitChecker>
        {startScreenContent}
      </AssessmentLimitChecker>
    );
  }

  if (currentStep === 'assessment') {
    const commonProps = {
      breadcrumbs: <EnhancedBreadcrumbs className="mb-8 sm:mb-12" />,
      themeToggle: <ThemeToggle />
    };

    if (type === 'full') {
      // Use CompleteAssessment for full assessment
      return <CompleteAssessment onComplete={handleCompleteAssessmentComplete} {...commonProps} />;
    } else if (type === 'exposure') {
      return <PrivacyRiskExposure onComplete={handleExposureComplete} {...commonProps} />;
    } else if (type === 'rights' || type === 'privacy-rights') {
      return <PrivacyRightsCheckup onComplete={handleRightsComplete} {...commonProps} />;
    }
  }

  if (currentStep === 'results') {
      return (
        <AssessmentResults
          exposureResults={exposureResults}
          rightsResults={rightsResults}
          completeAssessmentResults={completeAssessmentResults}
          actionPlan={actionPlan}
          assessmentType={type}
          onComplete={handleResultsComplete}
        breadcrumbs={<EnhancedBreadcrumbs className="mb-8 sm:mb-12" customBreadcrumbs={[
          { name: 'Privacy Toolkit', href: '/toolkit-access', current: false },
          { name: 'Assessment Results', href: '#', current: true }
        ]} />}
        themeToggle={<ThemeToggle />}
      />
    );
  }

  return null;
};

export default AssessmentRouter;