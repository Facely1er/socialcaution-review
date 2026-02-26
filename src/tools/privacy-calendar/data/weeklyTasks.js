/**
 * Weekly Task Templates
 * These are used to generate personalized weekly tasks based on user's services and risk profile
 */

export const taskTemplates = {
  financial: {
    week1: [
      {
        id: 'update-financial-passwords',
        title: 'Update Passwords for Top 3 Financial Accounts',
        description: 'Change passwords for your most critical financial accounts (banking, investment, credit cards)',
        estimatedTime: '30 minutes',
        difficulty: 'easy',
        impact: 'high',
        category: 'financial'
      },
      {
        id: 'review-bank-statements',
        title: 'Review Recent Bank Statements',
        description: 'Check for any unauthorized transactions and set up account alerts',
        estimatedTime: '15 minutes',
        difficulty: 'easy',
        impact: 'medium',
        category: 'financial'
      }
    ],
    week2: [
      {
        id: 'enable-2fa-banking',
        title: 'Enable 2FA on Banking and Investment Accounts',
        description: 'Set up two-factor authentication on all financial accounts',
        estimatedTime: '20 minutes',
        difficulty: 'easy',
        impact: 'high',
        category: 'financial'
      },
      {
        id: 'secure-payment-methods',
        title: 'Review and Secure Payment Methods',
        description: 'Audit stored payment methods and remove unused cards',
        estimatedTime: '15 minutes',
        difficulty: 'easy',
        impact: 'medium',
        category: 'financial'
      }
    ],
    week3: [
      {
        id: 'freeze-credit-reports',
        title: 'Review and Freeze Credit Reports',
        description: 'Check credit reports from all three bureaus and consider freezing if needed',
        estimatedTime: '45 minutes',
        difficulty: 'medium',
        impact: 'high',
        category: 'financial'
      }
    ],
    week4: [
      {
        id: 'setup-account-alerts',
        title: 'Set Up Account Alerts and Monitoring',
        description: 'Configure alerts for transactions, login attempts, and account changes',
        estimatedTime: '20 minutes',
        difficulty: 'easy',
        impact: 'medium',
        category: 'financial'
      }
    ]
  },
  social: {
    week1: [
      {
        id: 'audit-facebook-privacy',
        title: 'Audit Facebook Privacy Settings and App Permissions',
        description: 'Review Facebook privacy settings, app permissions, and data sharing preferences',
        estimatedTime: '30 minutes',
        difficulty: 'easy',
        impact: 'high',
        category: 'social'
      }
    ],
    week2: [
      {
        id: 'clean-instagram-location',
        title: 'Clean Up Instagram Location Tags and Visibility',
        description: 'Remove location tags from old posts and adjust profile visibility settings',
        estimatedTime: '25 minutes',
        difficulty: 'easy',
        impact: 'medium',
        category: 'social'
      }
    ],
    week3: [
      {
        id: 'review-linkedin-settings',
        title: 'Review LinkedIn Profile and Connection Settings',
        description: 'Update LinkedIn privacy settings and review connection visibility',
        estimatedTime: '20 minutes',
        difficulty: 'easy',
        impact: 'medium',
        category: 'social'
      }
    ],
    week4: [
      {
        id: 'delete-old-social-accounts',
        title: 'Delete or Secure Old Social Media Accounts',
        description: 'Identify and delete unused social media accounts or secure them',
        estimatedTime: '40 minutes',
        difficulty: 'medium',
        impact: 'high',
        category: 'social'
      }
    ]
  },
  communication: {
    week1: [
      {
        id: 'enable-2fa-email',
        title: 'Enable 2FA on All Email Accounts',
        description: 'Set up two-factor authentication on all email accounts',
        estimatedTime: '25 minutes',
        difficulty: 'easy',
        impact: 'high',
        category: 'communication'
      }
    ],
    week2: [
      {
        id: 'clean-email-subscriptions',
        title: 'Clean Up Email Subscriptions and Data Sharing',
        description: 'Unsubscribe from unnecessary emails and review data sharing permissions',
        estimatedTime: '30 minutes',
        difficulty: 'easy',
        impact: 'medium',
        category: 'communication'
      }
    ],
    week3: [
      {
        id: 'review-messaging-privacy',
        title: 'Review Messaging App Privacy Settings',
        description: 'Update privacy settings on messaging apps (WhatsApp, Signal, Telegram, etc.)',
        estimatedTime: '20 minutes',
        difficulty: 'easy',
        impact: 'medium',
        category: 'communication'
      }
    ],
    week4: [
      {
        id: 'setup-secure-email',
        title: 'Set Up Secure Email Practices',
        description: 'Configure email encryption and secure email practices',
        estimatedTime: '30 minutes',
        difficulty: 'medium',
        impact: 'high',
        category: 'communication'
      }
    ]
  }
  // Additional task templates can be added for other categories
};

/**
 * Generate personalized tasks based on user's selected services
 */
export function generatePersonalizedTasks(theme, selectedServices, weekIndex) {
  const templateKey = theme.category;
  const weekKey = `week${weekIndex + 1}`;
  
  if (!taskTemplates[templateKey] || !taskTemplates[templateKey][weekKey]) {
    return [];
  }

  const baseTasks = taskTemplates[templateKey][weekKey];
  
  // Personalize tasks based on selected services
  return baseTasks.map(task => {
    // Add service-specific details if user has relevant services
    const relevantServices = selectedServices?.filter(serviceId => {
      // Match services to task category (simplified logic)
      return true; // For now, return all tasks
    }) || [];

    return {
      ...task,
      relevantServices: relevantServices.slice(0, 3), // Limit to top 3
      personalized: relevantServices.length > 0
    };
  });
}

