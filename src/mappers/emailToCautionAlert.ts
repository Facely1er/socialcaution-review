// Mapper to convert email header analysis results to unified CautionAlert format

import { CautionAlert, AlertSeverity } from '../types/caution';
import { EmailHeaderAnalysis, getEmailRiskLevel } from '../utils/emailHeaderAnalyzer';

export interface EmailAnalysisContext {
  id: string;
  from?: string;
}

/**
 * Map email header analysis results to CautionAlert format
 * Returns null if no threat detected (risk score below threshold)
 */
export function mapEmailAnalysisToAlert(
  analysis: EmailHeaderAnalysis,
  context: EmailAnalysisContext
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
    ? 'CRITICAL: Email spoofing detected'
    : analysis.riskScore >= 50
    ? 'High-risk email authentication failure'
    : 'Email header shows suspicious patterns';

  const message = analysis.riskScore >= 70
    ? 'This email shows strong signs of being spoofed or malicious. Do not click links, download attachments, or reply.'
    : analysis.riskScore >= 50
    ? 'This email has multiple authentication failures and suspicious indicators. Verify the sender through official channels.'
    : 'This email has some suspicious header patterns. Exercise caution and verify the sender.';

  const overallRisk = getEmailRiskLevel(analysis.riskScore);

  return {
    id: `email-${context.id}-${Date.now()}`,
    category: 'phishing_risk',
    severity,
    title,
    message,
    riskScore: analysis.riskScore,
    evidence: analysis.issues,
    createdAt: new Date().toISOString(),
    source: 'email_analyzer',
    riskAnalysis: {
      overallRisk,
      riskScore: analysis.riskScore,
      detectedPatterns: analysis.issues.map((issue, index) => ({
        category: issue.includes('SPF') || issue.includes('DKIM') || issue.includes('DMARC') 
          ? 'authentication-failure' as const
          : 'impersonation' as const,
        severity: index === 0 ? 'high' : 'medium',
        indicator: issue,
        advice: analysis.recommendations[index] || 'Verify email sender through official channels'
      })),
      recommendations: analysis.recommendations,
      analyzedAt: new Date().toISOString()
    }
  };
}
