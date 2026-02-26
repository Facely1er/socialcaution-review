// Core persona system with assessment integration
export const PersonaProfiles = {
  cautiousParent: {
    id: 'cautious-parent',
    name: 'Cautious Parent',
    description: 'Protecting family digital privacy and safety',
    primaryConcerns: ['child-safety', 'family-privacy', 'parental-controls'],
    riskThreshold: 'high',
    preferredActions: ['immediate', 'family-focused'],
    dashboardPriorities: ['child-protection', 'family-monitoring', 'school-privacy'],
    resourceFilters: ['family-guides', 'child-safety', 'parental-tools'],
    toolkitFocus: ['family-protection', 'monitoring-tools', 'safe-communication'],
    color: 'blue',
    icon: 'Users'
  },
  
  digitalNovice: {
    id: 'digital-novice',
    name: 'Digital Novice',
    description: 'Learning the basics of digital privacy',
    primaryConcerns: ['basic-security', 'learning', 'simple-protection'],
    riskThreshold: 'educational',
    preferredActions: ['guided', 'step-by-step', 'educational'],
    dashboardPriorities: ['learning-modules', 'basic-security', 'progress-tracking'],
    resourceFilters: ['beginner-guides', 'basic-security', 'educational-content'],
    toolkitFocus: ['simple-tools', 'automated-protection', 'learning-resources'],
    color: 'green',
    icon: 'BookOpen'
  },
  
  privacyAdvocate: {
    id: 'privacy-advocate',
    name: 'Privacy Advocate',
    description: 'Maximum privacy and digital rights focus',
    primaryConcerns: ['advanced-privacy', 'anonymity', 'data-rights'],
    riskThreshold: 'expert',
    preferredActions: ['advanced', 'technical', 'activist'],
    dashboardPriorities: ['advanced-metrics', 'rights-tracking', 'policy-updates'],
    resourceFilters: ['advanced-guides', 'legal-resources', 'technical-tools'],
    toolkitFocus: ['advanced-tools', 'anonymity-tools', 'rights-enforcement'],
    color: 'purple',
    icon: 'Shield'
  },
  
  onlineShopper: {
    id: 'online-shopper',
    name: 'Online Shopper',
    description: 'Safe and secure online shopping focus',
    primaryConcerns: ['financial-security', 'shopping-privacy', 'data-brokers'],
    riskThreshold: 'moderate',
    preferredActions: ['shopping-focused', 'financial-protection'],
    dashboardPriorities: ['financial-security', 'shopping-privacy', 'breach-alerts'],
    resourceFilters: ['shopping-guides', 'financial-protection', 'deal-safety'],
    toolkitFocus: ['shopping-tools', 'financial-monitors', 'deal-checkers'],
    color: 'amber',
    icon: 'ShoppingCart'
  },
  
  socialInfluencer: {
    id: 'social-influencer',
    name: 'Social Influencer',
    description: 'Managing public presence and content protection',
    primaryConcerns: ['reputation-management', 'public-privacy', 'content-protection'],
    riskThreshold: 'balanced',
    preferredActions: ['reputation-focused', 'content-protection'],
    dashboardPriorities: ['reputation-monitoring', 'content-tracking', 'audience-insights'],
    resourceFilters: ['influencer-guides', 'reputation-tools', 'content-protection'],
    toolkitFocus: ['social-tools', 'reputation-monitors', 'content-protection'],
    color: 'pink',
    icon: 'Camera'
  },
  
  privateIndividual: {
    id: 'private-individual',
    name: 'Private Individual',
    description: 'Maximum anonymity and data minimization',
    primaryConcerns: ['maximum-privacy', 'anonymity', 'data-minimization'],
    riskThreshold: 'maximum',
    preferredActions: ['privacy-maximizing', 'anonymous'],
    dashboardPriorities: ['privacy-metrics', 'anonymity-tracking', 'data-minimization'],
    resourceFilters: ['privacy-maximizing', 'anonymity-guides', 'data-reduction'],
    toolkitFocus: ['privacy-tools', 'anonymity-tools', 'data-deletion'],
    color: 'slate',
    icon: 'Lock'
  },
  
  concernedEmployee: {
    id: 'concerned-employee',
    name: 'Concerned Employee',
    description: 'Protecting workplace privacy and professional data security',
    primaryConcerns: ['workplace-privacy', 'professional-data', 'employee-rights'],
    riskThreshold: 'moderate-high',
    preferredActions: ['workplace-focused', 'professional-protection'],
    dashboardPriorities: ['workplace-monitoring', 'professional-privacy', 'employee-rights'],
    resourceFilters: ['workplace-guides', 'employee-privacy', 'professional-security'],
    toolkitFocus: ['workplace-tools', 'professional-monitors', 'employee-rights'],
    color: 'teal',
    icon: 'Briefcase'
  },
  
  dataController: {
    id: 'data-controller',
    name: 'Data Controller',
    description: 'Managing data control and transparency requirements',
    primaryConcerns: ['data-control', 'transparency', 'compliance'],
    riskThreshold: 'moderate',
    preferredActions: ['compliance-focused', 'transparency'],
    dashboardPriorities: ['data-governance', 'transparency-tracking', 'compliance-monitoring'],
    resourceFilters: ['compliance-guides', 'data-governance', 'transparency-tools'],
    toolkitFocus: ['data-management', 'compliance-tools', 'transparency-tracking'],
    color: 'cyan',
    icon: 'Database'
  },
  
  student: {
    id: 'student',
    name: 'Student',
    description: 'Protecting academic privacy and educational data',
    primaryConcerns: ['academic-privacy', 'educational-data', 'student-rights'],
    riskThreshold: 'moderate',
    preferredActions: ['educational-focused', 'student-protection'],
    dashboardPriorities: ['academic-monitoring', 'educational-privacy', 'student-rights'],
    resourceFilters: ['student-guides', 'academic-privacy', 'educational-security'],
    toolkitFocus: ['student-tools', 'academic-monitors', 'educational-protection'],
    color: 'indigo',
    icon: 'GraduationCap'
  }
};

// Persona color mappings for consistent theming
export const PersonaColors = {
  blue: {
    bg: 'bg-blue-50 dark:bg-blue-900/20',
    border: 'border-blue-200 dark:border-blue-800',
    text: 'text-blue-900 dark:text-blue-100',
    accent: 'text-blue-600 dark:text-blue-400',
    button: 'bg-blue-500 hover:bg-blue-600'
  },
  green: {
    bg: 'bg-green-50 dark:bg-green-900/20',
    border: 'border-green-200 dark:border-green-800',
    text: 'text-green-900 dark:text-green-100',
    accent: 'text-green-600 dark:text-green-400',
    button: 'bg-green-500 hover:bg-green-600'
  },
  purple: {
    bg: 'bg-purple-50 dark:bg-purple-900/20',
    border: 'border-purple-200 dark:border-purple-800',
    text: 'text-purple-900 dark:text-purple-100',
    accent: 'text-purple-600 dark:text-purple-400',
    button: 'bg-purple-500 hover:bg-purple-600'
  },
  amber: {
    bg: 'bg-amber-50 dark:bg-amber-900/20',
    border: 'border-amber-200 dark:border-amber-800',
    text: 'text-amber-900 dark:text-amber-100',
    accent: 'text-amber-600 dark:text-amber-400',
    button: 'bg-amber-500 hover:bg-amber-600'
  },
  pink: {
    bg: 'bg-pink-50 dark:bg-pink-900/20',
    border: 'border-pink-200 dark:border-pink-800',
    text: 'text-pink-900 dark:text-pink-100',
    accent: 'text-pink-600 dark:text-pink-400',
    button: 'bg-pink-500 hover:bg-pink-600'
  },
  slate: {
    bg: 'bg-slate-50 dark:bg-slate-900/20',
    border: 'border-slate-200 dark:border-slate-800',
    text: 'text-slate-900 dark:text-slate-100',
    accent: 'text-slate-600 dark:text-slate-400',
    button: 'bg-slate-500 hover:bg-slate-600'
  },
  teal: {
    bg: 'bg-teal-50 dark:bg-teal-900/20',
    border: 'border-teal-200 dark:border-teal-800',
    text: 'text-teal-900 dark:text-teal-100',
    accent: 'text-teal-600 dark:text-teal-400',
    button: 'bg-teal-500 hover:bg-teal-600'
  },
  cyan: {
    bg: 'bg-cyan-50 dark:bg-cyan-900/20',
    border: 'border-cyan-200 dark:border-cyan-800',
    text: 'text-cyan-900 dark:text-cyan-100',
    accent: 'text-cyan-600 dark:text-cyan-400',
    button: 'bg-cyan-500 hover:bg-cyan-600'
  },
  indigo: {
    bg: 'bg-indigo-50 dark:bg-indigo-900/20',
    border: 'border-indigo-200 dark:border-indigo-800',
    text: 'text-indigo-900 dark:text-indigo-100',
    accent: 'text-indigo-600 dark:text-indigo-400',
    button: 'bg-indigo-500 hover:bg-indigo-600'
  }
};