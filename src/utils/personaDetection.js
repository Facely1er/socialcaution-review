import { PersonaProfiles } from '../data/personaProfiles';

// Intelligent persona detection based on assessment results
export const PersonaDetectionEngine = {
  analyzeAssessmentResults: (exposureResults, rightsResults, userBehavior = {}) => {
    const scores = {
      cautiousParent: 0,
      digitalNovice: 0,
      privacyAdvocate: 0,
      onlineShopper: 0,
      socialInfluencer: 0,
      privateIndividual: 0,
      concernedEmployee: 0,
      dataController: 0,
      student: 0
    };

    // Privacy Risk Exposure Analysis
    if ((exposureResults.publicWiFi === 'never' || exposureResults.wifiUsage === 'never') && exposureResults.deviceSecurity === 'comprehensive') {
      scores.privacyAdvocate += 3;
      scores.privateIndividual += 2;
    }
    
    if (exposureResults.privacyLawAwareness === 'unaware' || exposureResults.privacyLawAwareness === 'heard' || 
        exposureResults.privacyAwareness === 'unaware' || exposureResults.privacyAwareness === 'heard') {
      scores.digitalNovice += 3;
    }
    
    if (exposureResults.passwordManagement === 'same' || exposureResults.passwordManagement === 'variations') {
      scores.digitalNovice += 2;
      scores.cautiousParent += 1;
    }

    // Social Footprint Analysis
    if (exposureResults.socialMediaUse === 'heavy' || exposureResults.socialMediaUse === 'daily') {
      scores.socialInfluencer += 3;
      if (exposureResults.publicSharing === 'frequently' || exposureResults.publicSharing === 'everything') {
        scores.socialInfluencer += 2;
      }
    } else if (exposureResults.socialMediaUse === 'moderate') {
      scores.socialInfluencer += 2;
      if (exposureResults.publicSharing === 'frequently' || exposureResults.publicSharing === 'everything') {
        scores.socialInfluencer += 1;
      }
    }
    
    // High public sharing indicates social influencer or privacy risk
    if (exposureResults.publicSharing === 'everything') {
      scores.socialInfluencer += 2;
      scores.cautiousParent += 1; // Parents should be cautious about this
    } else if (exposureResults.publicSharing === 'never' || exposureResults.publicSharing === 'rarely') {
      scores.privateIndividual += 2;
      scores.privacyAdvocate += 1;
    }

    // Online shopping frequency - question not currently in assessment, but keep for future use
    if (exposureResults.onlineShoppingFrequency === 'daily' || exposureResults.onlineShoppingFrequency === 'weekly') {
      scores.onlineShopper += 3;
    }

    // Privacy Rights Analysis - using actual question IDs
    if (rightsResults.accessParticipation === 'regularly' || rightsResults.accessParticipation === 'sometimes') {
      scores.privacyAdvocate += 3;
      scores.privateIndividual += 2;
    }
    
    if (rightsResults.noticeAwareness === 'never' || rightsResults.noticeAwareness === 'rarely') {
      scores.digitalNovice += 2;
    }

    // Check for active rights exercise (access and choice/consent)
    if (rightsResults.accessParticipation === 'regularly' && rightsResults.choiceConsent === 'fullControl') {
      scores.privacyAdvocate += 2;
      scores.dataController += 1; // Data controllers value transparency and control
    }

    // Data Controller Analysis - focuses on data control, transparency, and compliance
    if (rightsResults.transparencyPreference === 'high' || rightsResults.transparencyPreference === 'veryHigh') {
      scores.dataController += 3;
    }
    if (rightsResults.dataControl === 'fullControl' || rightsResults.dataControl === 'mostlyControl') {
      scores.dataController += 2;
    }
    if (rightsResults.complianceAwareness === 'aware' || rightsResults.complianceAwareness === 'veryAware') {
      scores.dataController += 2;
    }
    if (exposureResults.dataGovernance === 'important' || exposureResults.dataGovernance === 'veryImportant') {
      scores.dataController += 2;
    }
    // Data controllers often exercise access rights for transparency
    if (rightsResults.accessParticipation === 'regularly' || rightsResults.accessParticipation === 'sometimes') {
      scores.dataController += 1;
    }

    // Student Analysis - focuses on academic privacy, educational data, and student rights
    if (exposureResults.academicPrivacyConcerns || userBehavior.studentFocus) {
      scores.student += 3;
    }
    if (exposureResults.educationalDataSharing === 'concerned' || exposureResults.educationalDataSharing === 'veryConcerned') {
      scores.student += 3;
    }
    if (exposureResults.studentRightsAwareness === 'aware' || exposureResults.studentRightsAwareness === 'veryAware') {
      scores.student += 2;
    }
    if (exposureResults.onlineLearningPrivacy === 'concerned' || exposureResults.onlineLearningPrivacy === 'veryConcerned') {
      scores.student += 2;
    }
    // Students often use educational platforms and services
    if (exposureResults.educationalServiceUse === 'frequently' || exposureResults.educationalServiceUse === 'daily') {
      scores.student += 2;
    }
    // Age-based detection (if available in assessment)
    if (userBehavior.ageGroup === '18-24' || userBehavior.ageGroup === 'student') {
      scores.student += 1;
    }

    // Workplace Privacy Analysis
    if (exposureResults.workplacePrivacyConcerns || userBehavior.workplaceFocus) {
      scores.concernedEmployee += 3;
    }
    if (exposureResults.professionalDataSharing === 'concerned' || exposureResults.professionalDataSharing === 'veryConcerned') {
      scores.concernedEmployee += 2;
    }
    if (exposureResults.employeeRightsAwareness === 'aware' || exposureResults.employeeRightsAwareness === 'veryAware') {
      scores.concernedEmployee += 1;
    }

    // Behavioral Pattern Analysis
    if (userBehavior.familyConcerns) scores.cautiousParent += 3;
    if (userBehavior.shoppingFocus) scores.onlineShopper += 3;
    if (userBehavior.socialMediaUse === 'high') scores.socialInfluencer += 2;
    if (userBehavior.privacyPreference === 'maximum') scores.privateIndividual += 3;
    if (userBehavior.technicalSkill === 'beginner') scores.digitalNovice += 2;
    if (userBehavior.technicalSkill === 'expert') scores.privacyAdvocate += 2;
    if (userBehavior.workplaceFocus) scores.concernedEmployee += 2;
    if (userBehavior.complianceFocus || userBehavior.dataGovernanceFocus) scores.dataController += 2;
    if (userBehavior.studentFocus || userBehavior.academicFocus) scores.student += 2;

    // Calculate final scores with normalization
    const totalPossibleScore = 15; // Maximum possible score
    const normalizedScores = {};
    
    Object.keys(scores).forEach(persona => {
      normalizedScores[persona] = Math.min(scores[persona] / totalPossibleScore, 1);
    });

    // Return primary and secondary personas
    const sortedScores = Object.entries(scores).sort(([,a], [,b]) => b - a);
    
    return {
      primary: sortedScores[0][0],
      secondary: sortedScores[1][0],
      confidence: sortedScores[0][1] / totalPossibleScore,
      allScores: normalizedScores,
      rawScores: scores
    };
  },

  getPersonalizedWelcome: (persona, riskScore) => {
    const profile = PersonaProfiles[persona];
    const riskLevel = riskScore < 40 ? 'high' : riskScore < 70 ? 'moderate' : 'low';
    
    const messages = {
      'cautious-parent': {
        high: "Your family's digital privacy needs immediate attention. Let's secure your household step by step.",
        moderate: "You're doing well protecting your family, but there's room for improvement.",
        low: "Excellent! Your family has strong privacy protection. Let's maintain this level of security."
      },
      'digital-novice': {
        high: "Don't worry - everyone starts somewhere! We'll guide you through privacy basics step by step.",
        moderate: "You're learning! Let's build on your current knowledge with some key improvements.",
        low: "Great progress! You've mastered the basics. Ready for some advanced techniques?"
      },
      'privacy-advocate': {
        high: "Time to lock down your digital fortress. Here are advanced strategies for maximum privacy.",
        moderate: "Your privacy foundation is solid. Let's implement some advanced protections.",
        low: "Impressive privacy setup! Let's fine-tune and explore cutting-edge protection methods."
      },
      'online-shopper': {
        high: "Your shopping habits expose you to significant privacy risks. Let's secure your transactions.",
        moderate: "Good shopping security awareness! Let's enhance your financial privacy protection.",
        low: "Excellent shopping security! Let's explore advanced deal verification techniques."
      },
      'social-influencer': {
        high: "Your public presence needs privacy protection. Let's balance visibility with security.",
        moderate: "Good content protection practices! Let's enhance your reputation management.",
        low: "Great privacy-conscious influencing! Let's optimize your content protection strategy."
      },
      'private-individual': {
        high: "Maximum privacy mode activated. Let's eliminate your digital footprint systematically.",
        moderate: "Strong privacy foundation. Let's achieve complete digital anonymity.",
        low: "Impressive privacy mastery! Let's explore cutting-edge anonymity techniques."
      },
      'concerned-employee': {
        high: "Your workplace privacy needs immediate attention. Let's protect your professional data and employee rights.",
        moderate: "Good workplace privacy awareness! Let's strengthen your professional data protection.",
        low: "Excellent workplace privacy practices! Let's explore advanced employee rights and data protection strategies."
      },
      'data-controller': {
        high: "Your data control and transparency need improvement. Let's establish comprehensive data governance practices.",
        moderate: "Good data control awareness! Let's enhance your transparency and compliance monitoring.",
        low: "Excellent data governance! Let's explore advanced compliance strategies and transparency tools."
      },
      'student': {
        high: "Your academic privacy needs protection. Let's secure your educational data and student rights.",
        moderate: "Good student privacy awareness! Let's strengthen your academic data protection.",
        low: "Excellent student privacy practices! Let's explore advanced educational privacy and FERPA compliance strategies."
      }
    };

    return messages[profile.id]?.[riskLevel] || "Welcome to your personalized privacy dashboard!";
  }
};