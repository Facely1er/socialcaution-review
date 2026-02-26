// Type definitions for SocialCaution application

export interface AssessmentResults {
  exposureResults?: Record<string, unknown>;
  rightsResults?: Record<string, unknown>;
  exposureScore: number;
  rightsScore: number;
  completedAt: string;
}

export interface Persona {
  primary: string;
  secondary?: string;
  confidence?: number;
  traits?: string[];
  [key: string]: unknown;
}

export interface UserProfile {
  persona: Persona;
  results: AssessmentResults;
  createdAt: string;
  [key: string]: unknown;
}

export interface DashboardAction {
  id: string;
  title: string;
  priority: 'high' | 'medium' | 'low';
  icon: React.ComponentType;
  estimate: string;
  url?: string;
}

export interface DashboardResource {
  title: string;
  description: string;
  category: string;
}

export interface DashboardTool {
  name: string;
  icon: React.ComponentType;
  category: string;
}

export interface DashboardMetric {
  label: string;
  value: number;
}

export interface DashboardInsight {
  title: string;
  description: string;
  type: 'warning' | 'info' | 'success';
}

export interface DashboardRoadmap {
  currentPhase: string;
  phases: RoadmapPhase[];
}

export interface RoadmapPhase {
  name: string;
  description: string;
  progress: number;
  tasks: string[];
  timeframe: string;
}

export interface DashboardData {
  welcomeMessage: string;
  priorityActions: DashboardAction[];
  recommendedResources: DashboardResource[];
  relevantTools: DashboardTool[];
  progressMetrics: DashboardMetric[];
  insights: DashboardInsight[];
  roadmap: DashboardRoadmap;
}

export interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
  priority: 'low' | 'normal' | 'high' | 'urgent';
}

export interface ContactFormErrors {
  name?: string;
  email?: string;
  message?: string;
  general?: string;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface ToolkitAccessResponse {
  hasAccess: boolean;
  assessmentCompleted: boolean;
  tokenValid?: boolean;
  expiresAt?: string;
}