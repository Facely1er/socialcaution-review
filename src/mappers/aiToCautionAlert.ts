// Mapper to convert AI risk detection results to unified CautionAlert format
// Ensures AI detections integrate seamlessly with existing alert infrastructure

import { CautionAlert, AlertSeverity } from '../types/caution';
import { AIRiskResult, getRiskLevel, getRecommendations } from '../utils/aiRiskDetector';

export interface NotificationContext {
  id: string;
  serviceId?: string;
  serviceName?: string;
  personaTag?: string;
}

/**
 * Map AI risk detection results to CautionAlert format
 * Returns null if no threat detected (risk score below threshold)
 */
export function mapAIRiskToAlert(
  risk: AIRiskResult,
  context: NotificationContext,
  source: 'service_monitor' | 'user_paste'
): CautionAlert | null {
  // Don't create alert if no threat detected
  if (!risk.isPotentialThreat) return null;

  // Map risk score to alert severity
  let severity: AlertSeverity;
  if (risk.riskScore >= 80) severity = 'critical';
  else if (risk.riskScore >= 60) severity = 'high';
  else if (risk.riskScore >= 40) severity = 'warning';
  else severity = 'info';

  // Generate appropriate title and message based on severity
  const title = risk.riskScore >= 80
    ? 'CRITICAL: Phishing attempt detected'
    : risk.riskScore >= 60
    ? 'High-risk suspicious message detected'
    : 'Suspicious patterns detected';

  const message = risk.riskScore >= 80
    ? 'This message shows extremely strong phishing indicators. Do not click any links or provide any information. Delete immediately.'
    : risk.riskScore >= 60
    ? 'This message contains multiple phishing-style indicators. Treat as highly suspicious and verify directly with the service before taking any action.'
    : 'This message contains some suspicious patterns. Exercise caution and verify through official channels if action is requested.';

  // Get detailed recommendations
  const recommendations = getRecommendations(risk.riskScore);
  const overallRisk = getRiskLevel(risk.riskScore);

  return {
    id: `ai-${source}-${context.id}-${Date.now()}`,
    category: 'ai_threat',
    severity,
    title,
    message,
    personaTag: context.personaTag,
    serviceId: context.serviceId,
    serviceName: context.serviceName,
    riskScore: risk.riskScore,
    evidence: risk.reasons,
    createdAt: new Date().toISOString(),
    source,
    riskAnalysis: {
      overallRisk,
      riskScore: risk.riskScore,
      detectedPatterns: risk.reasons.map((reason, index) => ({
        category: categorizeReason(reason),
        severity: index === 0 ? 'high' : 'medium', // First reason is usually most important
        indicator: reason,
        advice: getAdviceForPattern(reason)
      })),
      recommendations,
      analyzedAt: new Date().toISOString()
    }
  };
}

/**
 * Categorize a detected reason into a pattern category
 */
function categorizeReason(reason: string): 'urgency-manipulation' | 'account-threat' | 'link-pressure' | 'sensitive-request' | 'impersonation' | 'generic-tone' {
  const lower = reason.toLowerCase();
  
  if (lower.includes('urgent') || lower.includes('immediate') || lower.includes('time') || lower.includes('deadline') || lower.includes('expir')) {
    return 'urgency-manipulation';
  }
  if (lower.includes('account') || lower.includes('suspend') || lower.includes('lock') || lower.includes('compromis') || lower.includes('unusual activity')) {
    return 'account-threat';
  }
  if (lower.includes('click') || lower.includes('verif') || lower.includes('confirm') || lower.includes('link')) {
    return 'link-pressure';
  }
  if (lower.includes('password') || lower.includes('sensitive') || lower.includes('ssn') || lower.includes('payment') || lower.includes('billing')) {
    return 'sensitive-request';
  }
  if (lower.includes('authority') || lower.includes('government') || lower.includes('official') || lower.includes('irs') || lower.includes('police')) {
    return 'impersonation';
  }
  return 'generic-tone';
}

/**
 * Get specific advice for a detected pattern
 */
function getAdviceForPattern(reason: string): string {
  const category = categorizeReason(reason);
  
  const adviceMap: Record<string, string> = {
    'urgency-manipulation': 'Legitimate services rarely create artificial urgency. Take your time to verify.',
    'account-threat': 'Real account issues are communicated through official channels, not unsolicited messages.',
    'link-pressure': 'Never click links in suspicious messages. Visit official websites directly.',
    'sensitive-request': 'No legitimate service will ask for sensitive information via email or text.',
    'impersonation': 'Official authorities don\'t request action via informal messages. Verify independently.',
    'generic-tone': 'Legitimate communications typically use your name and account-specific details.'
  };
  
  return adviceMap[category] || 'Verify this message through official channels before taking any action.';
}

/**
 * Create a quick alert summary for display
 */
export function createAlertSummary(alert: CautionAlert): string {
  const patterns = alert.evidence?.length || 0;
  
  return `${alert.severity.toUpperCase()} risk (${alert.riskScore}%) - ${patterns} suspicious pattern${patterns !== 1 ? 's' : ''} detected`;
}

