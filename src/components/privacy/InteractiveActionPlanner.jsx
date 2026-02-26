import React, { useState, useEffect } from 'react';
import { Calendar, CheckCircle, Clock, Target, Zap, Award, TrendingUp, Settings, Bell, AlertCircle } from 'lucide-react';
import { useLocalStorage } from '../../hooks/useLocalStorage';

const InteractiveActionPlanner = ({ userPersona, assessmentResults, onPlanUpdate }) => {
  const [planData, setPlanData] = useLocalStorage('privacy-action-plan', null);
  const [currentPlan, setCurrentPlan] = useState(null);
  const [planProgress, setPlanProgress] = useLocalStorage('plan-progress', {});
  const [selectedTimeframe, setSelectedTimeframe] = useState('30-days');
  const [planHistory, setPlanHistory] = useLocalStorage('plan-history', []);
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeMilestone, setActiveMilestone] = useState(null);

  const timeframes = {
    '7-days': { label: '7 Days', duration: 7, intensity: 'intensive' },
    '30-days': { label: '30 Days', duration: 30, intensity: 'moderate' },
    '90-days': { label: '90 Days', duration: 90, intensity: 'gradual' },
    'custom': { label: 'Custom', duration: 60, intensity: 'flexible' }
  };

  const actionCategories = {
    'immediate': {
      name: 'Immediate Actions',
      icon: Zap,
      color: 'red',
      priority: 1,
      timeframe: '1-3 days',
      actions: [
        {
          id: 'password-audit',
          title: 'Password Security Audit',
          description: 'Review and update weak passwords across all accounts',
          estimatedTime: '30 minutes',
          difficulty: 'easy',
          impact: 'high',
          resources: ['Password manager', 'Have I Been Pwned checker'],
          steps: [
            'Install a password manager',
            'Audit existing passwords',
            'Update weak passwords',
            'Enable two-factor authentication'
          ]
        },
        {
          id: 'privacy-settings',
          title: 'Quick Privacy Settings Review',
          description: 'Review privacy settings on major platforms',
          estimatedTime: '20 minutes',
          difficulty: 'easy',
          impact: 'medium',
          resources: ['Privacy Settings Optimizer tool'],
          steps: [
            'Check Google account settings',
            'Review Facebook privacy settings',
            'Update Instagram privacy options',
            'Review Twitter/X privacy settings'
          ]
        },
        {
          id: 'data-broker-scan',
          title: 'Data Broker Presence Scan',
          description: 'Scan for personal information on data broker sites',
          estimatedTime: '15 minutes',
          difficulty: 'easy',
          impact: 'high',
          resources: ['Data Broker Removal Service'],
          steps: [
            'Run automated broker scan',
            'Review found listings',
            'Initiate removal requests',
            'Monitor removal progress'
          ]
        }
      ]
    },
    'short-term': {
      name: 'Short-term Goals',
      icon: Target,
      color: 'orange',
      priority: 2,
      timeframe: '1-2 weeks',
      actions: [
        {
          id: 'device-security',
          title: 'Device Security Hardening',
          description: 'Secure all devices with comprehensive security measures',
          estimatedTime: '2 hours',
          difficulty: 'medium',
          impact: 'high',
          resources: ['Device security checklist', 'Antivirus software'],
          steps: [
            'Update all operating systems',
            'Install security software',
            'Configure device encryption',
            'Set up secure backups',
            'Enable device tracking'
          ]
        },
        {
          id: 'network-security',
          title: 'Home Network Security',
          description: 'Secure your home network and router settings',
          estimatedTime: '1 hour',
          difficulty: 'medium',
          impact: 'medium',
          resources: ['Router admin panel', 'Network security guide'],
          steps: [
            'Change default router password',
            'Enable WPA3 encryption',
            'Disable WPS',
            'Set up guest network',
            'Enable firewall'
          ]
        },
        {
          id: 'social-media-cleanup',
          title: 'Social Media Privacy Cleanup',
          description: 'Clean up social media profiles and remove sensitive information',
          estimatedTime: '1.5 hours',
          difficulty: 'easy',
          impact: 'medium',
          resources: ['Social media platforms'],
          steps: [
            'Review and delete old posts',
            'Remove personal information',
            'Adjust privacy settings',
            'Review tagged photos',
            'Clean up friend lists'
          ]
        }
      ]
    },
    'medium-term': {
      name: 'Medium-term Objectives',
      icon: Calendar,
      color: 'blue',
      priority: 3,
      timeframe: '2-4 weeks',
      actions: [
        {
          id: 'compliance-assessment',
          title: 'Industry Compliance Assessment',
          description: 'Complete specialized assessment for your industry',
          estimatedTime: '45 minutes',
          difficulty: 'medium',
          impact: 'high',
          resources: ['Industry-specific assessment tool'],
          steps: [
            'Select your industry',
            'Complete specialized questions',
            'Review compliance gaps',
            'Create action plan',
            'Schedule follow-up assessments'
          ]
        },
        {
          id: 'data-minimization',
          title: 'Data Minimization Strategy',
          description: 'Implement data minimization practices across all platforms',
          estimatedTime: '3 hours',
          difficulty: 'hard',
          impact: 'high',
          resources: ['Data audit tools', 'Retention policies'],
          steps: [
            'Audit data collection practices',
            'Implement data retention policies',
            'Remove unnecessary data',
            'Update privacy policies',
            'Train team members'
          ]
        },
        {
          id: 'privacy-monitoring',
          title: 'Privacy Monitoring Setup',
          description: 'Set up continuous privacy monitoring and alerts',
          estimatedTime: '2 hours',
          difficulty: 'medium',
          impact: 'medium',
          resources: ['Monitoring tools', 'Alert systems'],
          steps: [
            'Choose monitoring tools',
            'Configure privacy alerts',
            'Set up breach notifications',
            'Create monitoring dashboard',
            'Test alert systems'
          ]
        }
      ]
    },
    'long-term': {
      name: 'Long-term Vision',
      icon: Award,
      color: 'green',
      priority: 4,
      timeframe: '1-3 months',
      actions: [
        {
          id: 'privacy-culture',
          title: 'Privacy-First Culture Development',
          description: 'Develop organization-wide privacy culture and training',
          estimatedTime: '8 hours',
          difficulty: 'hard',
          impact: 'high',
          resources: ['Training materials', 'Policy templates'],
          steps: [
            'Develop privacy training program',
            'Create privacy policies',
            'Conduct team training',
            'Implement privacy champions',
            'Regular privacy reviews'
          ]
        },
        {
          id: 'vendor-management',
          title: 'Vendor Privacy Management',
          description: 'Implement comprehensive vendor privacy management',
          estimatedTime: '6 hours',
          difficulty: 'hard',
          impact: 'high',
          resources: ['Vendor assessment tools', 'Contract templates'],
          steps: [
            'Audit current vendors',
            'Assess vendor privacy practices',
            'Update vendor contracts',
            'Implement vendor monitoring',
            'Regular vendor reviews'
          ]
        },
        {
          id: 'incident-response',
          title: 'Privacy Incident Response Plan',
          description: 'Develop and test privacy incident response procedures',
          estimatedTime: '4 hours',
          difficulty: 'medium',
          impact: 'high',
          resources: ['Incident response templates', 'Legal guidance'],
          steps: [
            'Develop incident response plan',
            'Create response team',
            'Conduct tabletop exercises',
            'Update contact lists',
            'Regular plan reviews'
          ]
        }
      ]
    }
  };

  useEffect(() => {
    if (userPersona && assessmentResults) {
      generatePersonalizedPlan();
    }
  }, [userPersona, assessmentResults, selectedTimeframe]);

  const generatePersonalizedPlan = async () => {
    setIsGenerating(true);
    
    // Simulate plan generation
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const plan = createPersonalizedPlan();
    setCurrentPlan(plan);
    setPlanData(plan);
    
    // Initialize progress tracking
    const progress = {};
    plan.milestones.forEach(milestone => {
      progress[milestone.id] = {
        status: 'pending',
        startedAt: null,
        completedAt: null,
        progress: 0,
        notes: []
      };
    });
    setPlanProgress(progress);
    
    setIsGenerating(false);
    
    if (onPlanUpdate) {
      onPlanUpdate(plan);
    }
  };

  const createPersonalizedPlan = () => {
    const timeframe = timeframes[selectedTimeframe];
    const planId = `plan-${Date.now()}`;
    
    // Generate milestones based on persona and assessment results
    const milestones = generateMilestones();
    
    const plan = {
      id: planId,
      title: `Privacy Action Plan - ${timeframe.label}`,
      description: `Personalized privacy improvement plan for ${userPersona?.name || 'your profile'}`,
      timeframe: selectedTimeframe,
      duration: timeframe.duration,
      intensity: timeframe.intensity,
      createdAt: new Date().toISOString(),
      milestones,
      estimatedTotalTime: calculateTotalTime(milestones),
      priorityScore: calculatePriorityScore(),
      completionRate: 0
    };
    
    return plan;
  };

  const generateMilestones = () => {
    const milestones = [];
    let dayOffset = 0;
    
    Object.entries(actionCategories).forEach(([categoryKey, category]) => {
      const categoryActions = category.actions.filter(action => 
        shouldIncludeAction(action, categoryKey)
      );
      
      categoryActions.forEach(action => {
        const milestone = {
          id: `${categoryKey}-${action.id}`,
          category: categoryKey,
          categoryName: category.name,
          categoryIcon: category.icon,
          categoryColor: category.color,
          priority: category.priority,
          title: action.title,
          description: action.description,
          estimatedTime: action.estimatedTime,
          difficulty: action.difficulty,
          impact: action.impact,
          resources: action.resources,
          steps: action.steps,
          scheduledDay: dayOffset + 1,
          status: 'pending',
          dependencies: getDependencies(action.id),
          successCriteria: generateSuccessCriteria(action),
          estimatedCompletion: calculateEstimatedCompletion(dayOffset, action.estimatedTime)
        };
        
        milestones.push(milestone);
        dayOffset += getDayIncrement(action.difficulty);
      });
    });
    
    return milestones.sort((a, b) => a.scheduledDay - b.scheduledDay);
  };

  const shouldIncludeAction = (action, category) => {
    // Personalize based on assessment results and persona
    if (assessmentResults?.riskScore > 70 && action.impact === 'high') {
      return true;
    }
    
    if (userPersona?.techSavviness === 'low' && action.difficulty === 'hard') {
      return false;
    }
    
    if (category === 'immediate' || category === 'short-term') {
      return true; // Always include immediate and short-term actions
    }
    
    return Math.random() > 0.3; // 70% chance for medium/long-term actions
  };

  const getDependencies = (actionId) => {
    const dependencies = {
      'device-security': ['password-audit'],
      'network-security': ['device-security'],
      'compliance-assessment': ['privacy-settings'],
      'data-minimization': ['compliance-assessment'],
      'privacy-monitoring': ['data-minimization'],
      'vendor-management': ['compliance-assessment'],
      'incident-response': ['privacy-monitoring']
    };
    
    return dependencies[actionId] || [];
  };

  const generateSuccessCriteria = (action) => {
    const criteria = {
      'password-audit': [
        'All passwords are unique and strong',
        'Two-factor authentication enabled on critical accounts',
        'Password manager installed and configured'
      ],
      'privacy-settings': [
        'Privacy settings reviewed on all major platforms',
        'Location sharing disabled where not needed',
        'Ad personalization turned off'
      ],
      'device-security': [
        'All devices updated to latest OS',
        'Security software installed and configured',
        'Device encryption enabled'
      ],
      'compliance-assessment': [
        'Industry-specific assessment completed',
        'Compliance gaps identified',
        'Remediation plan created'
      ]
    };
    
    return criteria[action.id] || [
      'Action completed successfully',
      'All steps followed',
      'Documentation updated'
    ];
  };

  const calculateEstimatedCompletion = (dayOffset, estimatedTime) => {
    const now = new Date();
    const hours = parseInt(estimatedTime.split(' ')[0]) || 1;
    now.setDate(now.getDate() + dayOffset);
    now.setHours(now.getHours() + hours);
    return now.toISOString();
  };

  const getDayIncrement = (difficulty) => {
    switch (difficulty) {
      case 'easy': return 1;
      case 'medium': return 2;
      case 'hard': return 3;
      default: return 1;
    }
  };

  const calculateTotalTime = (milestones) => {
    return milestones.reduce((total, milestone) => {
      const hours = parseInt(milestone.estimatedTime.split(' ')[0]) || 1;
      return total + hours;
    }, 0);
  };

  const calculatePriorityScore = () => {
    if (!assessmentResults) return 50;
    
    const riskScore = assessmentResults.riskScore || 0;
    const complianceScore = assessmentResults.complianceLevel === 'compliant' ? 100 : 
                           assessmentResults.complianceLevel === 'partial' ? 60 : 20;
    
    return Math.round((riskScore + complianceScore) / 2);
  };

  const startMilestone = (milestoneId) => {
    setActiveMilestone(milestoneId);
    setPlanProgress(prev => ({
      ...prev,
      [milestoneId]: {
        ...prev[milestoneId],
        status: 'in-progress',
        startedAt: new Date().toISOString(),
        progress: 0
      }
    }));
  };

  const updateMilestoneProgress = (milestoneId, progress, notes = '') => {
    setPlanProgress(prev => ({
      ...prev,
      [milestoneId]: {
        ...prev[milestoneId],
        progress: Math.min(100, Math.max(0, progress)),
        notes: [...(prev[milestoneId]?.notes || []), {
          timestamp: new Date().toISOString(),
          progress,
          notes
        }]
      }
    }));
  };

  const completeMilestone = (milestoneId) => {
    setPlanProgress(prev => ({
      ...prev,
      [milestoneId]: {
        ...prev[milestoneId],
        status: 'completed',
        completedAt: new Date().toISOString(),
        progress: 100
      }
    }));
    
    setActiveMilestone(null);
    
    // Check if plan is complete
    const allMilestones = Object.keys(planProgress);
    const completedMilestones = allMilestones.filter(id => 
      planProgress[id]?.status === 'completed'
    );
    
    if (completedMilestones.length === allMilestones.length) {
      completePlan();
    }
  };

  const completePlan = () => {
    const completionEntry = {
      id: Date.now().toString(),
      planId: currentPlan.id,
      completedAt: new Date().toISOString(),
      totalMilestones: currentPlan.milestones.length,
      completedMilestones: Object.values(planProgress).filter(p => p.status === 'completed').length,
      totalTimeSpent: calculateActualTimeSpent(),
      priorityScore: currentPlan.priorityScore
    };
    
    setPlanHistory(prev => [completionEntry, ...prev.slice(0, 9)]); // Keep last 10
    
    // Award achievement
    awardAchievement(completionEntry);
  };

  const calculateActualTimeSpent = () => {
    return Object.values(planProgress).reduce((total, milestone) => {
      if (milestone.startedAt && milestone.completedAt) {
        const start = new Date(milestone.startedAt);
        const end = new Date(milestone.completedAt);
        return total + (end - start) / (1000 * 60 * 60); // Convert to hours
      }
      return total;
    }, 0);
  };

  const awardAchievement = (completion) => {
    // This would integrate with an achievement system
    if (import.meta.env.DEV) {
      console.log('Achievement unlocked:', completion);
    }
  };

  const exportPlan = () => {
    const exportData = {
      plan: currentPlan,
      progress: planProgress,
      history: planHistory,
      exportedAt: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `privacy-action-plan-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'easy': return 'bg-success/10 text-success';
      case 'medium': return 'bg-warning/10 text-warning';
      case 'hard': return 'bg-danger/10 text-danger';
      default: return 'bg-muted/20 text-muted-foreground';
    }
  };

  const getImpactColor = (impact) => {
    switch (impact) {
      case 'high': return 'text-danger';
      case 'medium': return 'text-warning';
      case 'low': return 'text-success';
      default: return 'text-text-secondary';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending': return <Clock className="h-5 w-5 text-muted" />;
      case 'in-progress': return <TrendingUp className="h-5 w-5 text-accent" />;
      case 'completed': return <CheckCircle className="h-5 w-5 text-success" />;
      default: return <Clock className="h-5 w-5 text-muted" />;
    }
  };

  const completedMilestones = Object.values(planProgress).filter(p => p.status === 'completed').length;
  const totalMilestones = currentPlan?.milestones?.length || 0;
  const overallProgress = totalMilestones > 0 ? Math.round((completedMilestones / totalMilestones) * 100) : 0;

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className="card rounded-xl shadow-lg mb-6">
        <div className="p-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-3xl font-bold text-text mb-2">
                Interactive Privacy Action Planner
              </h2>
              <p className="text-text-secondary">
                Personalized roadmap to improve your privacy posture
              </p>
            </div>
            <div className="flex space-x-4">
              <select
                value={selectedTimeframe}
                onChange={(e) => setSelectedTimeframe(e.target.value)}
                className="px-4 py-2 border border-border rounded-lg bg-card text-text"
              >
                {Object.entries(timeframes).map(([key, timeframe]) => (
                  <option key={key} value={key}>{timeframe.label}</option>
                ))}
              </select>
              <button
                onClick={exportPlan}
                disabled={!currentPlan}
                className="px-6 py-2 bg-success text-white rounded-lg hover:bg-success/90 disabled:opacity-50"
              >
                Export Plan
              </button>
            </div>
          </div>

          {/* Plan Overview */}
          {currentPlan && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-light-blue p-4 rounded-lg">
                <div className="flex items-center">
                  <Calendar className="h-8 w-8 text-primary mr-3" />
                  <div>
                    <p className="text-sm text-text-secondary">Duration</p>
                    <p className="text-xl font-bold text-text">
                      {currentPlan.duration} days
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="bg-success/10 p-4 rounded-lg">
                <div className="flex items-center">
                  <Target className="h-8 w-8 text-success mr-3" />
                  <div>
                    <p className="text-sm text-text-secondary">Milestones</p>
                    <p className="text-xl font-bold text-text">
                      {totalMilestones}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="bg-warning/10 p-4 rounded-lg">
                <div className="flex items-center">
                  <Clock className="h-8 w-8 text-warning mr-3" />
                  <div>
                    <p className="text-sm text-text-secondary">Est. Time</p>
                    <p className="text-xl font-bold text-text">
                      {currentPlan.estimatedTotalTime}h
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="bg-accent/10 p-4 rounded-lg">
                <div className="flex items-center">
                  <TrendingUp className="h-8 w-8 text-accent mr-3" />
                  <div>
                    <p className="text-sm text-text-secondary">Progress</p>
                    <p className="text-xl font-bold text-text">
                      {overallProgress}%
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Progress Bar */}
          {currentPlan && (
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-text-secondary">
                  Overall Progress
                </span>
                <span className="text-sm font-medium text-text">
                  {completedMilestones} / {totalMilestones} completed
                </span>
              </div>
              <div className="w-full bg-muted/20 rounded-full h-3">
                <div 
                  className="bg-accent h-3 rounded-full transition-all duration-500"
                  style={{ width: `${overallProgress}%` }}
                ></div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Plan Generation */}
      {!currentPlan && (
        <div className="card rounded-xl shadow-lg p-8 text-center">
          <Calendar className="h-16 w-16 text-accent mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-text mb-4">
            Generate Your Privacy Action Plan
          </h3>
          <p className="text-text-secondary mb-6">
            Create a personalized roadmap based on your assessment results and privacy goals
          </p>
          <button
            onClick={generatePersonalizedPlan}
            disabled={isGenerating}
            className="px-8 py-3 bg-accent text-white rounded-lg hover:bg-accent-dark disabled:opacity-50"
          >
            {isGenerating ? 'Generating Plan...' : 'Generate Action Plan'}
          </button>
        </div>
      )}

      {/* Milestones */}
      {currentPlan && (
        <div className="space-y-6">
          {Object.entries(actionCategories).map(([categoryKey, category]) => {
            const categoryMilestones = currentPlan.milestones.filter(m => m.category === categoryKey);
            if (categoryMilestones.length === 0) return null;
            
            return (
              <div key={categoryKey} className="card rounded-xl shadow-lg">
                <div className="p-6 border-b border-border">
                  <div className="flex items-center">
                    {React.createElement(category.icon, { 
                      className: `h-6 w-6 text-${category.color}-500 mr-3` 
                    })}
                    <div>
                      <h3 className="text-xl font-semibold text-text">
                        {category.name}
                      </h3>
                      <p className="text-sm text-text-secondary">
                        {category.timeframe} • {categoryMilestones.length} milestones
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="space-y-4">
                    {categoryMilestones.map(milestone => {
                      const progress = planProgress[milestone.id];
                      const isActive = activeMilestone === milestone.id;
                      
                      return (
                        <div key={milestone.id} className={`border rounded-lg p-4 ${
                          isActive ? 'border-accent bg-accent/10' : 'border-border'
                        }`}>
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center">
                              {getStatusIcon(progress?.status || 'pending')}
                              <div className="ml-3">
                                <h4 className="text-lg font-semibold text-text">
                                  {milestone.title}
                                </h4>
                                <p className="text-sm text-text-secondary">
                                  Day {milestone.scheduledDay} • {milestone.estimatedTime}
                                </p>
                              </div>
                            </div>
                            
                            <div className="flex items-center space-x-3">
                              <span className={`px-2 py-1 rounded text-xs ${getDifficultyColor(milestone.difficulty)}`}>
                                {milestone.difficulty}
                              </span>
                              <span className={`text-sm font-medium ${getImpactColor(milestone.impact)}`}>
                                {milestone.impact} impact
                              </span>
                            </div>
                          </div>
                          
                          <p className="text-text-secondary mb-4">
                            {milestone.description}
                          </p>
                          
                          {/* Progress Bar */}
                          {progress?.status === 'in-progress' && (
                            <div className="mb-4">
                              <div className="flex justify-between items-center mb-2">
                                <span className="text-sm text-text-secondary">
                                  Progress
                                </span>
                                <span className="text-sm font-medium text-text">
                                  {progress.progress}%
                                </span>
                              </div>
                              <div className="w-full bg-muted/20 rounded-full h-2">
                                <div 
                                  className="bg-accent h-2 rounded-full transition-all duration-300"
                                  style={{ width: `${progress.progress}%` }}
                                ></div>
                              </div>
                            </div>
                          )}
                          
                          {/* Action Steps */}
                          <div className="mb-4">
                            <h5 className="text-sm font-medium text-text mb-2">
                              Action Steps:
                            </h5>
                            <ul className="text-sm text-text-secondary space-y-1">
                              {milestone.steps.map((step, index) => (
                                <li key={index} className="flex items-center">
                                  <span className="w-2 h-2 bg-muted rounded-full mr-2"></span>
                                  {step}
                                </li>
                              ))}
                            </ul>
                          </div>
                          
                          {/* Resources */}
                          <div className="mb-4">
                            <h5 className="text-sm font-medium text-text mb-2">
                              Resources:
                            </h5>
                            <div className="flex flex-wrap gap-2">
                              {milestone.resources.map((resource, index) => (
                                <span 
                                  key={index}
                                  className="px-2 py-1 bg-card-hover text-text-secondary rounded text-xs"
                                >
                                  {resource}
                                </span>
                              ))}
                            </div>
                          </div>
                          
                          {/* Action Buttons */}
                          <div className="flex space-x-3">
                            {progress?.status === 'pending' && (
                              <button
                                onClick={() => startMilestone(milestone.id)}
                                className="px-4 py-2 bg-accent text-white rounded-lg hover:bg-accent-dark"
                              >
                                Start Milestone
                              </button>
                            )}
                            
                            {progress?.status === 'in-progress' && (
                              <>
                                <button
                                  onClick={() => updateMilestoneProgress(milestone.id, progress.progress + 25)}
                                  className="px-4 py-2 bg-success text-white rounded-lg hover:bg-success/90"
                                >
                                  Update Progress
                                </button>
                                <button
                                  onClick={() => completeMilestone(milestone.id)}
                                  className="px-4 py-2 bg-accent text-white rounded-lg hover:bg-accent-dark"
                                >
                                  Complete
                                </button>
                              </>
                            )}
                            
                            {progress?.status === 'completed' && (
                              <div className="flex items-center text-success">
                                <CheckCircle className="h-5 w-5 mr-2" />
                                <span className="text-sm font-medium">Completed</span>
                                {progress.completedAt && (
                                  <span className="text-xs text-text-secondary ml-2">
                                    on {new Date(progress.completedAt).toLocaleDateString()}
                                  </span>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default InteractiveActionPlanner;

