import { 
  Home, Shield, Target, LayoutDashboard, 
  Search, AlertTriangle, CheckCircle, Info,
  ArrowRight, Users, BookOpen, Settings,
  Bell, Scale, TrendingUp, Sparkles, Wrench
} from 'lucide-react';

/**
 * Tutorial Step Definitions
 * 
 * Each tutorial has:
 * - id: Unique identifier
 * - title: Tutorial name
 * - description: Brief description
 * - steps: Array of step objects with:
 *   - target: CSS selector or element ID to highlight
 *   - title: Step title
 *   - description: Step description
 *   - position: 'top', 'bottom', 'left', 'right', 'center' for tooltip placement
 *   - action: Optional action to perform (e.g., 'click', 'scroll')
 *   - icon: Icon component
 */

export const tutorialDefinitions = {
  'home-tutorial': {
    id: 'home-tutorial',
    title: 'Welcome to SocialCaution',
    description: 'Learn how to navigate and use SocialCaution to protect your privacy',
    icon: Home,
    steps: [
      {
        id: 'welcome',
        title: 'Welcome to SocialCaution!',
        description: 'SocialCaution helps you understand the privacy risks of the services you use. Let\'s take a quick tour to get you started.',
        position: 'center',
        icon: Sparkles,
      },
      {
        id: 'service-catalog-intro',
        title: 'Browse Service Catalog',
        description: 'Explore 200+ services and see their privacy ratings, data collection practices, and security track records.',
        position: 'bottom',
        icon: Shield,
        action: 'scroll',
      },
      {
        id: 'value-proposition',
        title: 'Discover Privacy Insights',
        description: 'Learn what data each service collects, how they share it, and what privacy protections they offer.',
        position: 'bottom',
        icon: Info,
        action: 'scroll',
      },
      {
        id: 'how-it-works',
        title: 'How It Works',
        description: 'See how SocialCaution monitors services, tracks policy changes, and alerts you to privacy risks.',
        position: 'bottom',
        icon: BookOpen,
        action: 'scroll',
      },
      {
        id: 'get-started',
        title: 'Ready to Start?',
        description: 'Tap "Browse Services" to explore the catalog, or visit the Dashboard to see your privacy overview.',
        position: 'center',
        icon: CheckCircle,
      },
    ],
  },

  'dashboard-tutorial': {
    id: 'dashboard-tutorial',
    title: 'Privacy Dashboard Guide',
    description: 'Learn how to use your privacy dashboard effectively',
    icon: LayoutDashboard,
    steps: [
      {
        id: 'dashboard-welcome',
        title: 'Your Privacy Dashboard',
        description: 'This is your central hub for monitoring your privacy exposure across all services you use.',
        position: 'center',
        icon: LayoutDashboard,
      },
      {
        id: 'exposure-summary',
        title: 'Privacy Exposure Score',
        description: 'Your average exposure score shows how much of your data is at risk. Lower scores mean better privacy protection.',
        target: '[data-tutorial="exposure-summary"]',
        position: 'bottom',
        icon: AlertTriangle,
      },
      {
        id: 'insights',
        title: 'Privacy Insights',
        description: 'Get personalized insights based on your privacy profile and monitored services.',
        target: '[data-tutorial="insights"]',
        position: 'bottom',
        icon: Info,
      },
      {
        id: 'priority-actions',
        title: 'Priority Actions',
        description: 'See recommended actions to improve your privacy, prioritized by impact and urgency.',
        target: '[data-tutorial="priority-actions"]',
        position: 'bottom',
        icon: Target,
      },
      {
        id: 'monitored-services',
        title: 'Monitored Services',
        description: 'View all services you\'re monitoring and their individual privacy exposure scores.',
        target: '[data-tutorial="monitored-services"]',
        position: 'bottom',
        icon: Shield,
      },
      {
        id: 'quick-actions',
        title: 'Quick Actions',
        description: 'Quickly add services, view alerts, check regulations, and monitor compliance.',
        target: '[data-tutorial="quick-actions"]',
        position: 'top',
        icon: Sparkles,
      },
    ],
  },

  'service-catalog-tutorial': {
    id: 'service-catalog-tutorial',
    title: 'Service Catalog Guide',
    description: 'Learn how to browse and monitor services',
    icon: Shield,
    steps: [
      {
        id: 'catalog-welcome',
        title: 'Service Catalog',
        description: 'Browse 200+ popular services and see their privacy ratings, data collection practices, and security information.',
        position: 'center',
        icon: Shield,
      },
      {
        id: 'search-services',
        title: 'Search Services',
        description: 'Use the search bar to quickly find specific services you want to monitor.',
        target: '[data-tutorial="search-services"]',
        position: 'bottom',
        icon: Search,
      },
      {
        id: 'service-cards',
        title: 'Service Cards',
        description: 'Each card shows the service name, privacy exposure score, and key privacy information. Tap to see details.',
        target: '[data-tutorial="service-cards"]',
        position: 'bottom',
        icon: Info,
      },
      {
        id: 'add-to-monitor',
        title: 'Monitor Services',
        description: 'Add services to your monitoring list to track their privacy policies and get alerts about changes.',
        target: '[data-tutorial="add-service"]',
        position: 'top',
        icon: Bell,
      },
      {
        id: 'filter-categories',
        title: 'Filter by Category',
        description: 'Filter services by category (Social Media, Shopping, Banking, etc.) to find what you need faster.',
        target: '[data-tutorial="filter-categories"]',
        position: 'bottom',
        icon: Settings,
      },
      {
        id: 'exposure-ratings',
        title: 'Understanding Exposure Scores',
        description: 'Exposure scores range from 0-100. Lower is better. Scores consider data collection, sharing practices, and security track record.',
        position: 'center',
        icon: AlertTriangle,
      },
    ],
  },

  'persona-tutorial': {
    id: 'persona-tutorial',
    title: 'Persona Selection Guide',
    description: 'Learn how to choose the right privacy persona for you',
    icon: Users,
    steps: [
      {
        id: 'persona-welcome',
        title: 'Privacy Personas',
        description: 'Select from 9 distinct privacy personas to get personalized recommendations, resources, and tools matched to your specific needs and technical comfort level.',
        position: 'center',
        icon: Users,
      },
      {
        id: 'persona-cards',
        title: 'Explore Personas',
        description: 'Each persona card shows the persona name, description, and key characteristics. Read through them to find the best match.',
        target: '[data-tutorial="persona-cards"]',
        position: 'bottom',
        icon: Info,
      },
      {
        id: 'select-persona',
        title: 'Select Your Persona',
        description: 'Click on a persona card to select it. This will personalize your experience throughout SocialCaution.',
        target: '[data-tutorial="select-persona"]',
        position: 'top',
        icon: CheckCircle,
      },
      {
        id: 'persona-benefits',
        title: 'Personalization Benefits',
        description: 'Your selected persona determines the type of recommendations, educational content, and privacy tools you\'ll see.',
        position: 'center',
        icon: Sparkles,
      },
    ],
  },

  'privacy-settings-tutorial': {
    id: 'privacy-settings-tutorial',
    title: 'Privacy Concerns Guide',
    description: 'Learn how to configure your privacy concerns and preferences',
    icon: Shield,
    steps: [
      {
        id: 'concerns-welcome',
        title: 'Privacy Concerns',
        description: 'Configure your privacy concerns and preferences to get more personalized recommendations and alerts.',
        position: 'center',
        icon: Shield,
      },
      {
        id: 'concern-categories',
        title: 'Privacy Concern Categories',
        description: 'Select which privacy concerns matter most to you: data collection, sharing practices, security, compliance, and more.',
        target: '[data-tutorial="concern-categories"]',
        position: 'bottom',
        icon: Info,
      },
      {
        id: 'configure-settings',
        title: 'Configure Settings',
        description: 'Adjust your privacy settings to match your comfort level and preferences.',
        target: '[data-tutorial="privacy-settings"]',
        position: 'bottom',
        icon: Settings,
      },
      {
        id: 'save-preferences',
        title: 'Save Your Preferences',
        description: 'Your preferences will be used to personalize your dashboard, recommendations, and alerts.',
        position: 'center',
        icon: CheckCircle,
      },
    ],
  },

  'assessments-tutorial': {
    id: 'assessments-tutorial',
    title: 'Privacy Assessments Guide',
    description: 'Learn about privacy assessments and how they help you',
    icon: Target,
    steps: [
      {
        id: 'assessments-welcome',
        title: 'Privacy Assessments',
        description: 'Take assessments to understand your privacy risks and learn about your privacy rights.',
        position: 'center',
        icon: Target,
      },
      {
        id: 'exposure-assessment',
        title: 'Privacy Risk Exposure Assessment',
        description: 'This 5-7 minute assessment evaluates your digital footprint and identifies privacy vulnerabilities.',
        target: '[data-tutorial="exposure-assessment"]',
        position: 'bottom',
        icon: AlertTriangle,
      },
      {
        id: 'rights-assessment',
        title: 'Privacy Rights Knowledge Checkup',
        description: 'This 8-12 minute assessment tests your knowledge of privacy rights and how to exercise them.',
        target: '[data-tutorial="rights-assessment"]',
        position: 'bottom',
        icon: Scale,
      },
      {
        id: 'assessment-benefits',
        title: 'Why Take Assessments?',
        description: 'Assessments help you understand your privacy risks, learn about your rights, and get personalized recommendations.',
        position: 'center',
        icon: CheckCircle,
      },
      {
        id: 'results',
        title: 'View Your Results',
        description: 'After completing an assessment, view your results in the Dashboard for personalized insights and action plans.',
        position: 'center',
        icon: TrendingUp,
      },
    ],
  },

  'toolkit-tutorial': {
    id: 'toolkit-tutorial',
    title: 'Privacy Toolkit Guide',
    description: 'Learn how to use privacy tools and resources effectively',
    icon: Wrench,
    steps: [
      {
        id: 'toolkit-welcome',
        title: 'Privacy Toolkit',
        description: 'Access a curated collection of privacy tools, resources, and utilities to help protect your digital privacy.',
        position: 'center',
        icon: Wrench,
      },
      {
        id: 'tool-categories',
        title: 'Tool Categories',
        description: 'Browse tools organized by category: security tools, ad blockers, privacy browsers, and more.',
        target: '[data-tutorial="tool-categories"]',
        position: 'bottom',
        icon: Info,
      },
      {
        id: 'select-tools',
        title: 'Select Tools',
        description: 'Choose tools that match your privacy needs and technical comfort level.',
        target: '[data-tutorial="select-tools"]',
        position: 'bottom',
        icon: CheckCircle,
      },
      {
        id: 'tool-resources',
        title: 'Privacy Resources',
        description: 'Access guides, tutorials, and educational content to learn more about privacy protection.',
        target: '[data-tutorial="tool-resources"]',
        position: 'bottom',
        icon: BookOpen,
      },
    ],
  },
};

/**
 * Get tutorial steps by ID
 */
export function getTutorialSteps(tutorialId) {
  return tutorialDefinitions[tutorialId]?.steps || [];
}

/**
 * Get tutorial definition by ID
 */
export function getTutorialDefinition(tutorialId) {
  return tutorialDefinitions[tutorialId] || null;
}

/**
 * Get all available tutorials
 */
export function getAllTutorials() {
  return Object.values(tutorialDefinitions);
}

/**
 * Get tutorials for a specific route
 */
export function getTutorialsForRoute(route) {
  const routeTutorialMap = {
    '/': ['home-tutorial'],
    '/dashboard': ['dashboard-tutorial'],
    '/service-catalog': ['service-catalog-tutorial'],
    '/privacy-settings': ['privacy-settings-tutorial'],
    '/assessment': ['assessments-tutorial'],
    '/assessment/exposure': ['assessments-tutorial'],
    '/assessment/rights': ['assessments-tutorial'],
    '/toolkit-access': ['toolkit-tutorial'],
    '/privacy-tools': ['toolkit-tutorial'],
  };

  return routeTutorialMap[route] || [];
}

