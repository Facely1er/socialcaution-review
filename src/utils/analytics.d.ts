// Type definitions for analytics.js

interface ErrorData {
  type: string;
  message?: string;
  filename?: string;
  lineno?: number;
  colno?: number;
  stack?: string;
}

interface WebVitalMetric {
  name: string;
  value: number;
  id: string;
}

interface AssessmentScores {
  exposureScore?: number;
  rightsScore?: number;
}

interface QueuedEvent {
  eventName: string;
  parameters: Record<string, unknown>;
  timestamp: number;
}

interface AssessmentFunnel {
  'landing_page_view': number;
  'assessment_start_click': number;
  'first_question_answer': number;
  'assessment_complete': number;
  'dashboard_access': number;
}

interface PersonaDistribution {
  'cautious-parent': number;
  'digital-novice': number;
  'privacy-advocate': number;
  'online-shopper': number;
  'social-influencer': number;
  'private-individual': number;
}

interface FeatureUsage {
  'theme_toggle': number;
  'resource_access': number;
  'tool_usage': number;
  'privacy_tips_viewed': number;
  'assessment_retake': number;
}

export class ProductionAnalytics {
  initialized: boolean;
  queue: Array<{ method: string; args: unknown[] }>;
  offlineQueue: QueuedEvent[];
  gaAvailable: boolean | null;
  assessmentFunnel?: AssessmentFunnel;
  personaDistribution?: PersonaDistribution;
  featureUsage?: FeatureUsage;

  constructor();
  init(): void;
  initializeGA(): void;
  initializeErrorMonitoring(): void;
  initializePerformanceMonitoring(): void;
  initializeBusinessMetrics(): void;
  trackPageView(path: string, title: string): void;
  trackEvent(eventName: string, parameters?: Record<string, unknown>): void;
  trackAssessmentStart(assessmentType: string): void;
  trackAssessmentComplete(assessmentType: string, persona: string, scores: AssessmentScores): void;
  trackPersonaDashboard(persona: string): void;
  trackResourceAccess(resourceType: string, persona: string): void;
  trackToolUsage(toolName: string, persona: string): void;
  trackFeatureUsage(featureName: string, parameters?: Record<string, unknown>): void;
  trackFunnelStep(stepName: string, parameters?: Record<string, unknown>): void;
  sendWebVital(metric: WebVitalMetric): void;
  logError(errorData: ErrorData): void;
  sanitizeParameters(params: Record<string, unknown>): Record<string, unknown>;
  getScoreRange(score: number): 'high' | 'medium' | 'low' | 'very_low';
  queueOfflineEvent(eventName: string, parameters: Record<string, unknown>): void;
  processQueue(): void;
  processOfflineQueue(): Promise<void>;
  setupAssessmentTracking(): void;
  setupPersonaTracking(): void;
  setupFeatureTracking(): void;
}

export const analytics: ProductionAnalytics;
export default analytics;

