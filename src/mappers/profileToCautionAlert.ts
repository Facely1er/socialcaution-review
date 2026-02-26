// Mapper to convert social profile analysis results to unified CautionAlert format

import { CautionAlert, AlertSeverity } from '../types/caution';
import { ProfileAnalysisResult, getProfileRiskLevel } from '../utils/socialProfileVerifier';

export interface ProfileAnalysisContext {
  id: string;
  username?: string;
}

/**
 * Map profile analysis results to CautionAlert format
 * Returns null if no threat detected (risk score below threshold)
 */
export function mapProfileAnalysisToAlert(
  analysis: ProfileAnalysisResult,
  context: ProfileAnalysisContext
): CautionAlert | null {
  // Don't create alert if no threat detected
  if (!analysis.isSuspicious) return null;

  // Map risk score to alert severity
  let severity: AlertSeverity;
  if (analysis.riskScore >= 70) severity = 'critical';
  else if (analysis.riskScore >= 50) severity = 'high';
  else if (analysis.riskScore >= 30) severity = 'warning';
  else severity = 'info';

  // Generate appropriate title and message
  const title = analysis.riskScore >= 70
    ? 'CRITICAL: Fake or AI-generated profile detected'
    : analysis.riskScore >= 50
    ? 'High-risk suspicious profile indicators'
    : 'Profile shows suspicious patterns';

  const message = analysis.riskScore >= 70
    ? 'This profile shows strong signs of being fake, bot, or AI-generated. Do not trust information from this account.'
    : analysis.riskScore >= 50
    ? 'This profile has multiple suspicious indicators suggesting it may not be legitimate. Verify identity through other channels.'
    : 'This profile has some suspicious patterns. Exercise caution when interacting.';

  const overallRisk = getProfileRiskLevel(analysis.riskScore);

  return {
    id: `profile-${context.id}-${Date.now()}`,
    category: 'ai_threat',
    severity,
    title,
    message,
    riskScore: analysis.riskScore,
    evidence: analysis.issues,
    createdAt: new Date().toISOString(),
    source: 'profile_verifier',
    riskAnalysis: {
      overallRisk,
      riskScore: analysis.riskScore,
      detectedPatterns: analysis.issues.map((issue, index) => ({
        category: 'profile-suspicious' as const,
        severity: index === 0 ? 'high' : 'medium',
        indicator: issue,
        advice: analysis.recommendations[index] || 'Verify profile identity through other means'
      })),
      recommendations: analysis.recommendations,
      analyzedAt: new Date().toISOString()
    }
  };
}
