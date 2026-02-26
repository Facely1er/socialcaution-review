/**
 * Privacy Calendar Generator
 * Generates personalized 12-month privacy calendar based on user data
 */

import { monthlyThemes } from '../data/monthlyThemes';
import { generatePersonalizedTasks } from '../data/weeklyTasks';

/**
 * Generate personalized privacy calendar for 2026
 * 
 * @param {Object} userData - User's persona, services, assessment results
 * @param {number} year - Year for calendar (default: 2026)
 * @returns {Object} Complete calendar data structure
 */
export function generatePersonalizedCalendar(userData = {}, year = 2026) {
  const { persona, selectedServices = [], assessmentResults } = userData;
  
  // Calculate initial privacy score
  const initialScore = assessmentResults?.exposureScore 
    ? Math.max(0, 100 - assessmentResults.exposureScore)
    : 50;

  // Generate calendar structure
  const months = monthlyThemes.map((theme, monthIndex) => {
    const monthData = generateMonthData(theme, monthIndex, year, {
      persona,
      selectedServices,
      initialScore
    });
    
    return monthData;
  });

  return {
    year,
    generatedAt: new Date().toISOString(),
    initialPrivacyScore: initialScore,
    targetPrivacyScore: 95,
    months,
    metadata: {
      persona: persona?.primary || null,
      serviceCount: selectedServices.length,
      hasAssessment: !!assessmentResults
    }
  };
}

/**
 * Generate data for a specific month
 */
function generateMonthData(theme, monthIndex, year, userContext) {
  const { persona, selectedServices, initialScore } = userContext;
  
  // Calculate expected impact based on theme and user risk
  const baseImpact = getBaseImpactForTheme(theme.category);
  const riskMultiplier = calculateRiskMultiplier(userContext);
  const expectedImpact = Math.round(baseImpact * riskMultiplier);

  // Generate weeks (4-5 weeks per month)
  const weeks = generateWeeksForMonth(theme, monthIndex, year, userContext);

  // Calculate monthly goal
  const monthlyGoal = getMonthlyGoal(theme);

  return {
    month: monthIndex,
    monthName: new Date(year, monthIndex, 1).toLocaleString('default', { month: 'long' }),
    theme: theme.name,
    focus: theme.focus,
    icon: theme.icon,
    color: theme.color,
    category: theme.category,
    description: theme.description,
    monthlyGoal,
    expectedImpact,
    weeks,
    estimatedTotalTime: calculateTotalTime(weeks),
    difficulty: calculateAverageDifficulty(weeks)
  };
}

/**
 * Generate weeks for a month
 */
function generateWeeksForMonth(theme, monthIndex, year, userContext) {
  const weeks = [];
  const firstDay = new Date(year, monthIndex, 1);
  const lastDay = new Date(year, monthIndex + 1, 0);
  const daysInMonth = lastDay.getDate();
  
  // Calculate number of weeks (typically 4-5)
  const firstDayOfWeek = firstDay.getDay();
  const totalDays = daysInMonth + firstDayOfWeek;
  const weekCount = Math.ceil(totalDays / 7);

  for (let weekIndex = 0; weekIndex < Math.min(weekCount, 5); weekIndex++) {
    const weekStart = weekIndex * 7 - firstDayOfWeek + 1;
    const weekEnd = Math.min(weekStart + 6, daysInMonth);
    
    // Generate tasks for this week
    const tasks = generatePersonalizedTasks(theme, userContext.selectedServices, weekIndex);
    
    weeks.push({
      weekIndex,
      weekNumber: weekIndex + 1,
      startDate: new Date(year, monthIndex, Math.max(1, weekStart)),
      endDate: new Date(year, monthIndex, Math.min(daysInMonth, weekEnd)),
      tasks: tasks.length > 0 ? tasks : generateDefaultTasks(theme, weekIndex),
      estimatedTime: calculateWeekTime(tasks),
      focus: getWeekFocus(theme, weekIndex)
    });
  }

  return weeks;
}

/**
 * Generate default tasks if no personalized tasks available
 */
function generateDefaultTasks(theme, weekIndex) {
  return [
    {
      id: `default-${theme.category}-week${weekIndex + 1}`,
      title: `Review ${theme.focus} Privacy Settings`,
      description: `Take time to review and update privacy settings related to ${theme.focus.toLowerCase()}`,
      estimatedTime: '30 minutes',
      difficulty: 'easy',
      impact: 'medium',
      category: theme.category
    }
  ];
}

/**
 * Get base impact score for theme category
 */
function getBaseImpactForTheme(category) {
  const impactMap = {
    financial: 8,
    social: 6,
    communication: 7,
    commerce: 5,
    professional: 6,
    health: 8,
    location: 5,
    entertainment: 4,
    iot: 7,
    family: 6,
    advanced: 8,
    review: 5
  };
  
  return impactMap[category] || 5;
}

/**
 * Calculate risk multiplier based on user context
 */
function calculateRiskMultiplier(userContext) {
  const { assessmentResults, selectedServices } = userContext;
  
  let multiplier = 1.0;
  
  // Higher risk = higher potential impact
  if (assessmentResults?.exposureScore) {
    const riskLevel = assessmentResults.exposureScore / 100;
    multiplier = 0.8 + (riskLevel * 0.4); // Range: 0.8 - 1.2
  }
  
  // More services = more potential impact
  if (selectedServices.length > 10) {
    multiplier *= 1.1;
  }
  
  return Math.min(1.3, multiplier); // Cap at 1.3x
}

/**
 * Get monthly goal description
 */
function getMonthlyGoal(theme) {
  const goalMap = {
    financial: 'Secure your financial foundation',
    social: 'Control your social presence',
    communication: 'Protect your communication channels',
    commerce: 'Control your shopping data trail',
    professional: 'Protect your professional identity',
    health: 'Protect your health information',
    location: 'Manage your location footprint',
    entertainment: 'Protect your entertainment preferences',
    iot: 'Protect your smart home privacy',
    family: 'Protect your family\'s digital presence',
    advanced: 'Implement advanced privacy protection',
    review: 'Celebrate progress and plan ahead'
  };
  
  return goalMap[theme.category] || 'Improve your privacy posture';
}

/**
 * Calculate total estimated time for weeks
 */
function calculateTotalTime(weeks) {
  return weeks.reduce((total, week) => {
    return total + (week.estimatedTime || 0);
  }, 0);
}

/**
 * Calculate average difficulty for weeks
 */
function calculateAverageDifficulty(weeks) {
  const difficultyMap = { easy: 1, medium: 2, hard: 3 };
  const allTasks = weeks.flatMap(week => week.tasks);
  
  if (allTasks.length === 0) return 'easy';
  
  const avgDifficulty = allTasks.reduce((sum, task) => {
    return sum + (difficultyMap[task.difficulty] || 1);
  }, 0) / allTasks.length;
  
  if (avgDifficulty < 1.5) return 'easy';
  if (avgDifficulty < 2.5) return 'medium';
  return 'hard';
}

/**
 * Calculate estimated time for week tasks
 */
function calculateWeekTime(tasks) {
  return tasks.reduce((total, task) => {
    const timeMatch = task.estimatedTime?.match(/(\d+)\s*(minute|hour)/);
    if (timeMatch) {
      const value = parseInt(timeMatch[1]);
      const unit = timeMatch[2];
      return total + (unit === 'hour' ? value * 60 : value);
    }
    return total + 30; // Default 30 minutes
  }, 0);
}

/**
 * Get week focus description
 */
function getWeekFocus(theme, weekIndex) {
  const focuses = [
    `Week ${weekIndex + 1}: ${theme.focus} - Initial Setup`,
    `Week ${weekIndex + 1}: ${theme.focus} - Review & Update`,
    `Week ${weekIndex + 1}: ${theme.focus} - Advanced Settings`,
    `Week ${weekIndex + 1}: ${theme.focus} - Final Review`
  ];
  
  return focuses[weekIndex] || `Week ${weekIndex + 1}: ${theme.focus}`;
}

