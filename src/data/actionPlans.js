// Action plans and recommendations based on assessment results
import { PersonaProfiles } from './personaProfiles';

export const ActionPlanGenerator = {
  // Generate specific action plans based on assessment results
  generateCriticalActions: (exposureResults, rightsResults, persona) => {
    const actions = [];
    
    // Password security actions
    if (exposureResults?.passwordManagement === 'same' || 
        exposureResults?.passwordManagement === 'variations') {
      actions.push({
        id: 'password-manager-critical',
        title: 'Set Up Password Manager Immediately',
        description: 'Your password habits put you at extreme risk for account takeovers. This is your most critical security upgrade.',
        impact: 'Prevents 80% of account breaches',
        timeEstimate: '30 minutes',
        difficulty: 'Easy',
        priority: 'critical',
        icon: 'Shield',
        steps: [
          'Choose a reputable password manager (Bitwarden, 1Password, or Dashlane)',
          'Install the browser extension and mobile app',
          'Import existing passwords or create new strong ones',
          'Enable two-factor authentication on the password manager itself',
          'Start with your most important accounts (email, banking, social media)'
        ],
        whyUrgent: 'Using the same or similar passwords across accounts means one breach compromises everything. Password reuse is the #1 cause of account takeovers.',
        estimatedImpact: 'High',
        category: 'security'
      });
    }
    
    // Device security actions
    if (exposureResults?.deviceSecurity === 'minimal') {
      actions.push({
        id: 'device-security-critical',
        title: 'Secure Your Devices Now',
        description: 'Your devices are vulnerable to theft and unauthorized access. One lost device could expose all your personal data.',
        impact: 'Protects all personal data on devices',
        timeEstimate: '25 minutes',
        difficulty: 'Easy',
        priority: 'critical',
        icon: 'Shield',
        steps: [
          'Enable strong screen locks on all devices (6+ digit PIN or biometric)',
          'Turn on automatic screen lock after 1 minute of inactivity',
          'Enable full-disk encryption on laptops and desktops',
          'Set up remote wipe capabilities (Find My Device)',
          'Install security updates automatically'
        ],
        whyUrgent: 'Lost or stolen devices are common. Without proper security, anyone who finds your device has access to your accounts, photos, and personal information.',
        estimatedImpact: 'High',
        category: 'security'
      });
    }
    
    // Public WiFi actions
    if (exposureResults?.publicWiFi === 'frequent') {
      actions.push({
        id: 'wifi-security-critical',
        title: 'Stop Using Public WiFi Unsecured',
        description: 'Your frequent public WiFi usage exposes all your online activity to hackers. This needs immediate attention.',
        impact: 'Secures all internet traffic',
        timeEstimate: '20 minutes',
        difficulty: 'Easy',
        priority: 'critical',
        icon: 'Shield',
        steps: [
          'Install a VPN app (NordVPN, ExpressVPN, or ProtonVPN)',
          'Enable auto-connect for all network connections',
          'Turn off automatic WiFi connection in device settings',
          'Use your phone\'s mobile hotspot instead when possible',
          'Avoid accessing sensitive accounts on public networks'
        ],
        whyUrgent: 'Public WiFi networks are hunting grounds for cybercriminals. Your login credentials, credit card numbers, and private messages can be intercepted.',
        estimatedImpact: 'High',
        category: 'network-security'
      });
    }
    
    return actions;
  },
  
  // Generate important (non-critical) actions
  generateImportantActions: (exposureResults, rightsResults, persona) => {
    const actions = [];
    
    // Social media privacy
    if (exposureResults?.dataSharing === 'noReview' || 
        exposureResults?.dataSharing === 'quickReview') {
      actions.push({
        id: 'social-privacy-audit',
        title: 'Social Media Privacy Audit',
        description: 'Your data sharing habits create privacy risks. Time for a comprehensive privacy settings review.',
        impact: 'Reduces data collection by 60%',
        timeEstimate: '45 minutes',
        difficulty: 'Medium',
        priority: 'important',
        icon: 'Activity',
        steps: [
          'Review privacy settings on Facebook, Instagram, Twitter, and LinkedIn',
          'Limit who can see your posts and personal information',
          'Turn off location tracking and facial recognition features',
          'Review and remove suspicious third-party app connections',
          'Adjust advertising preferences to limit data use'
        ],
        category: 'social-media'
      });
    }
    
    // Rights exercise for low rights usage
    if (rightsResults) {
      const lowRightsUsage = Object.values(rightsResults).filter(
        value => value === 'never' || value === 'noIdea' || value === 'noControl'
      ).length;
      
      if (lowRightsUsage >= 3) {
        actions.push({
          id: 'rights-exercise',
          title: 'Start Exercising Your Privacy Rights',
          description: 'You\'re not using your legal privacy rights. Time to take back control of your data.',
          impact: 'Reduces data collection and increases control',
          timeEstimate: '2 hours over 1 month',
          difficulty: 'Medium',
          priority: 'important',
          icon: 'Scale',
          steps: [
            'Request your data from Google, Facebook, and Amazon using their download tools',
            'Delete accounts you no longer use (start with old social media)',
            'Opt out of data broker sites using automated services',
            'Set up Google Alerts for your name to monitor your digital footprint',
            'Review and update privacy settings on accounts you keep'
          ],
          category: 'legal-rights'
        });
      }
    }
    
    return actions;
  },
  
  // Generate quick wins
  generateQuickWins: (exposureResults, rightsResults, persona) => {
    const quickWins = [];
    
    // Password quick wins
    if (exposureResults?.passwordManagement === 'same') {
      quickWins.push({
        title: 'Change Your 3 Most Important Passwords',
        description: 'Start with email, primary bank account, and main social media',
        timeEstimate: '15 minutes',
        impact: 'High',
        difficulty: 'Easy'
      });
    }
    
    // WiFi quick wins
    if (exposureResults?.publicWiFi === 'frequent' || exposureResults?.publicWiFi === 'occasional') {
      quickWins.push({
        title: 'Turn Off Auto-Connect WiFi',
        description: 'Stop your devices from automatically connecting to open networks',
        timeEstimate: '2 minutes',
        impact: 'Medium',
        difficulty: 'Easy'
      });
    }
    
    // Social media quick wins
    if (exposureResults?.dataSharing === 'noReview') {
      quickWins.push({
        title: 'Make Your Social Profiles Private',
        description: 'Switch Instagram, Twitter, and Facebook to private/friends-only',
        timeEstimate: '5 minutes',
        impact: 'Medium',
        difficulty: 'Easy'
      });
    }
    
    // Rights quick wins
    if (rightsResults?.accessParticipation === 'never' || rightsResults?.accessParticipation === 'considered') {
      quickWins.push({
        title: 'Download Your Google Data',
        description: 'See what Google knows about you - it\'s eye-opening!',
        timeEstimate: '10 minutes',
        impact: 'Educational',
        difficulty: 'Easy'
      });
    }
    
    return quickWins;
  },
  
  // Generate long-term goals
  generateLongTermActions: (exposureResults, rightsResults, persona) => {
    const actions = [];
    const profile = persona ? PersonaProfiles[persona.primary] : null;
    
    // Persona-specific long-term actions
    if (profile) {
      switch (profile.id) {
        case 'cautious-parent':
          actions.push({
            id: 'family-privacy-system',
            title: 'Implement Complete Family Privacy System',
            description: 'Set up comprehensive privacy protection for your entire household.',
            timeEstimate: '3-4 hours over 2 weeks',
            difficulty: 'Medium',
            steps: [
              'Install family safety software on all devices',
              'Set up individual privacy settings for each family member',
              'Create family privacy rules and communication guidelines',
              'Regular privacy education sessions with children'
            ],
            category: 'family-protection'
          });
          break;
          
        case 'privacy-advocate':
          actions.push({
            id: 'advanced-privacy-setup',
            title: 'Advanced Privacy Infrastructure',
            description: 'Implement professional-grade privacy and anonymity tools.',
            timeEstimate: '5-6 hours over 1 month',
            difficulty: 'Advanced',
            steps: [
              'Set up Tor browser with proper security configuration',
              'Implement VPN + Tor combination for maximum anonymity',
              'Switch to encrypted email and messaging services',
              'Set up anonymous payment methods for privacy tools'
            ],
            category: 'advanced-privacy'
          });
          break;
          
        case 'online-shopper':
          actions.push({
            id: 'financial-privacy-protection',
            title: 'Financial Privacy Protection System',
            description: 'Secure your financial information and shopping habits.',
            timeEstimate: '2-3 hours over 1 week',
            difficulty: 'Medium',
            steps: [
              'Set up virtual credit card numbers for online purchases',
              'Enable transaction alerts on all financial accounts',
              'Review and remove stored payment methods from old sites',
              'Implement comprehensive financial monitoring'
            ],
            category: 'financial-security'
          });
          break;
          
        case 'concerned-employee':
          actions.push({
            id: 'workplace-privacy-protection',
            title: 'Workplace Privacy Protection System',
            description: 'Protect your professional data and employee privacy rights.',
            timeEstimate: '2-3 hours over 1 week',
            difficulty: 'Medium',
            steps: [
              'Review and understand your employee privacy rights under applicable laws',
              'Audit what personal data your employer collects and how it\'s used',
              'Set up separate work and personal device usage policies',
              'Implement professional data monitoring and breach alerts',
              'Document and report any privacy concerns to HR or compliance'
            ],
            category: 'workplace-privacy'
          });
          break;
          
        case 'data-controller':
          actions.push({
            id: 'data-governance-framework',
            title: 'Data Governance and Transparency Framework',
            description: 'Establish comprehensive data control, transparency, and compliance monitoring.',
            timeEstimate: '4-5 hours over 2 weeks',
            difficulty: 'Medium',
            steps: [
              'Create a comprehensive data inventory of all personal information',
              'Implement data access request tracking and management system',
              'Set up compliance monitoring for GDPR, CCPA, and other regulations',
              'Establish transparency reporting and data governance policies',
              'Regular audits of data sharing and third-party access'
            ],
            category: 'data-governance'
          });
          break;
          
        case 'student':
          actions.push({
            id: 'academic-privacy-protection',
            title: 'Academic Privacy and Student Rights Protection',
            description: 'Protect your educational data, academic records, and student privacy rights.',
            timeEstimate: '2-3 hours over 1 week',
            difficulty: 'Medium',
            steps: [
              'Understand your student privacy rights under FERPA and similar regulations',
              'Review and secure your educational accounts and learning platforms',
              'Audit what data your school and educational services collect',
              'Set up monitoring for educational data breaches and policy changes',
              'Exercise your right to access and review your academic records'
            ],
            category: 'academic-privacy'
          });
          break;
      }
    }
    
    return actions;
  }
};

export default ActionPlanGenerator;