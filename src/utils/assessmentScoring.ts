// Assessment scoring utilities

// Type definitions for exposure assessment results
export interface ExposureResults {
  privacyLawAwareness?: 'unaware' | 'heard' | 'partial' | 'full';
  passwordManagement?: 'same' | 'variations' | 'unique' | 'strongUnique';
  dataSharing?: 'noReview' | 'quickReview' | 'carefulReview' | 'strictPrivacy';
  deviceSecurity?: 'minimal' | 'basic' | 'good' | 'comprehensive';
  publicWiFi?: 'frequent' | 'occasional' | 'rare' | 'never';
  socialMediaUse?: 'heavy' | 'daily' | 'moderate' | 'light' | 'never';
  publicSharing?: 'everything' | 'frequently' | 'sometimes' | 'rarely' | 'never';
}

// Type definitions for rights assessment results
export interface RightsResults {
  noticeAwareness?: 'fullyAware' | 'somewhatAware' | 'unaware';
  choiceConsent?: 'fullyAware' | 'somewhatAware' | 'unaware';
  accessParticipation?: 'fullyAware' | 'somewhatAware' | 'unaware';
  integritySecurity?: 'fullyAware' | 'somewhatAware' | 'unaware';
  enforcementRedress?: 'fullyAware' | 'somewhatAware' | 'unaware';
  purposeLimitation?: 'fullyAware' | 'somewhatAware' | 'unaware';
  dataMinimization?: 'fullyAware' | 'somewhatAware' | 'unaware';
  retentionLimitation?: 'fullyAware' | 'somewhatAware' | 'unaware';
}

// Type definitions for risk level return values
interface RiskLevel {
  level: 'low' | 'moderate' | 'high' | 'critical';
  color: 'green' | 'yellow' | 'orange' | 'red';
  label: string;
}

// Type definitions for rights level return values
interface RightsLevel {
  level: 'excellent' | 'good' | 'fair' | 'poor';
  color: 'green' | 'blue' | 'yellow' | 'red';
  label: string;
}

export const calculateExposureScore = (results: ExposureResults | null | undefined): number => {
  if (!results) return 0;
  
  let score = 100;
  
  // Privacy awareness (20 points)
  // Updated for new question structure
  if (results.privacyLawAwareness === 'unaware') score -= 20;
  else if (results.privacyLawAwareness === 'heard') score -= 15;
  else if (results.privacyLawAwareness === 'partial') score -= 10;
  else if (results.privacyLawAwareness === 'full') score -= 5;
  
  // Password management (20 points)
  if (results.passwordManagement === 'same') score -= 25;
  else if (results.passwordManagement === 'variations') score -= 20;
  else if (results.passwordManagement === 'unique') score -= 10;
  else if (results.passwordManagement === 'strongUnique') score -= 5;
  
  // Data sharing comfort (15 points)
  if (results.dataSharing === 'noReview') score -= 15;
  else if (results.dataSharing === 'quickReview') score -= 10;
  else if (results.dataSharing === 'carefulReview') score -= 5;
  else if (results.dataSharing === 'strictPrivacy') score -= 0;

  // Device security (15 points)
  if (results.deviceSecurity === 'minimal') score -= 15;
  else if (results.deviceSecurity === 'basic') score -= 10;
  else if (results.deviceSecurity === 'good') score -= 5;
  else if (results.deviceSecurity === 'comprehensive') score -= 0;

  // Public WiFi usage (10 points)
  if (results.publicWiFi === 'frequent') score -= 10;
  else if (results.publicWiFi === 'occasional') score -= 7;
  else if (results.publicWiFi === 'rare') score -= 3;
  else if (results.publicWiFi === 'never') score -= 0;

  // Social media use (15 points)
  if (results.socialMediaUse === 'heavy') score -= 15;
  else if (results.socialMediaUse === 'daily') score -= 12;
  else if (results.socialMediaUse === 'moderate') score -= 8;
  else if (results.socialMediaUse === 'light') score -= 4;
  else if (results.socialMediaUse === 'never') score -= 0;

  // Public sharing behavior (15 points)
  if (results.publicSharing === 'everything') score -= 15;
  else if (results.publicSharing === 'frequently') score -= 12;
  else if (results.publicSharing === 'sometimes') score -= 8;
  else if (results.publicSharing === 'rarely') score -= 4;
  else if (results.publicSharing === 'never') score -= 0;

  return Math.max(0, score);
};

export const calculateRightsScore = (results: RightsResults | null | undefined): number => {
  // Validate input
  if (!results || typeof results !== 'object') return 0;
  
  // Map answer values to points (0-2 scale per question)
  // Each question has 3 options mapped to points: 2, 1, 0
  const getPoints = (questionId: keyof RightsResults, answerValue: string | undefined): number => {
    // Return 0 for missing or invalid answers
    if (!answerValue || typeof answerValue !== 'string') return 0;
    
    const pointMappings: Record<string, Record<string, number>> = {
      // All questions now use consistent answer values assessing principle awareness
      // Notice & Awareness Principle
      noticeAwareness: {
        'fullyAware': 2,
        'somewhatAware': 1,
        'unaware': 0
      },
      // Choice & Consent Principle
      choiceConsent: {
        'fullyAware': 2,
        'somewhatAware': 1,
        'unaware': 0
      },
      // Access & Participation Principle
      accessParticipation: {
        'fullyAware': 2,
        'somewhatAware': 1,
        'unaware': 0
      },
      // Integrity & Security Principle
      integritySecurity: {
        'fullyAware': 2,
        'somewhatAware': 1,
        'unaware': 0
      },
      // Enforcement & Redress Principle
      enforcementRedress: {
        'fullyAware': 2,
        'somewhatAware': 1,
        'unaware': 0
      },
      // Purpose Limitation Principle
      purposeLimitation: {
        'fullyAware': 2,
        'somewhatAware': 1,
        'unaware': 0
      },
      // Data Minimization Principle
      dataMinimization: {
        'fullyAware': 2,
        'somewhatAware': 1,
        'unaware': 0
      },
      // Retention Limitation Principle
      retentionLimitation: {
        'fullyAware': 2,
        'somewhatAware': 1,
        'unaware': 0
      }
    };
    
    // Get points for this question/answer combination, default to 0 if not found
    const points = pointMappings[questionId]?.[answerValue];
    return (points !== undefined && points !== null) ? points : 0;
  };
  
  // Calculate total points from all 8 questions
  const totalQuestions = 8;
  let totalPoints = 0;
  
  // Sum points from all questions (missing answers get 0 points)
  totalPoints += getPoints('noticeAwareness', results.noticeAwareness);
  totalPoints += getPoints('choiceConsent', results.choiceConsent);
  totalPoints += getPoints('accessParticipation', results.accessParticipation);
  totalPoints += getPoints('integritySecurity', results.integritySecurity);
  totalPoints += getPoints('enforcementRedress', results.enforcementRedress);
  totalPoints += getPoints('purposeLimitation', results.purposeLimitation);
  totalPoints += getPoints('dataMinimization', results.dataMinimization);
  totalPoints += getPoints('retentionLimitation', results.retentionLimitation);
  
  // Convert to 0-100 scale
  // Maximum possible points = 8 questions × 2 points per question = 16 points
  const maxPossiblePoints = totalQuestions * 2; // 16
  
  // Ensure we don't divide by zero (shouldn't happen, but safety check)
  if (maxPossiblePoints === 0) return 0;
  
  // Calculate percentage score and round to nearest integer
  // Clamp result between 0 and 100 to handle any edge cases
  const percentageScore = (totalPoints / maxPossiblePoints) * 100;
  return Math.max(0, Math.min(100, Math.round(percentageScore)));
};

export const getRiskLevel = (exposureScore: number | null | undefined): RiskLevel => {
  const score = exposureScore ?? 0;
  if (score >= 80) return { level: 'low', color: 'green', label: 'Low Risk' };
  if (score >= 60) return { level: 'moderate', color: 'yellow', label: 'Moderate Risk' };
  if (score >= 40) return { level: 'high', color: 'orange', label: 'High Risk' };
  return { level: 'critical', color: 'red', label: 'Critical Risk' };
};

export const getRightsLevel = (rightsScore: number | null | undefined): RightsLevel => {
  const score = rightsScore ?? 0;
  if (score >= 80) return { level: 'excellent', color: 'green', label: 'Excellent' };
  if (score >= 60) return { level: 'good', color: 'blue', label: 'Good' };
  if (score >= 40) return { level: 'fair', color: 'yellow', label: 'Fair' };
  return { level: 'poor', color: 'red', label: 'Needs Improvement' };
};

