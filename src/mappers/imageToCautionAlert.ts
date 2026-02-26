// Mapper to convert image analysis results to unified CautionAlert format

import { CautionAlert, AlertSeverity } from '../types/caution';
import { ImageAnalysisResult, getImageRiskLevel } from '../utils/imageMetadataAnalyzer';

export interface ImageAnalysisContext {
  id: string;
  fileName?: string;
}

/**
 * Map image analysis results to CautionAlert format
 * Returns null if no threat detected (risk score below threshold)
 */
export function mapImageAnalysisToAlert(
  analysis: ImageAnalysisResult,
  context: ImageAnalysisContext
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
    ? 'CRITICAL: Suspicious image metadata detected'
    : analysis.riskScore >= 50
    ? 'High-risk image metadata anomalies'
    : 'Image metadata shows suspicious patterns';

  const message = analysis.riskScore >= 70
    ? 'This image shows strong signs of manipulation or suspicious metadata. Verify the source before trusting this image.'
    : analysis.riskScore >= 50
    ? 'This image contains multiple metadata anomalies that suggest potential manipulation. Exercise caution.'
    : 'This image has some suspicious metadata patterns. Verify the source and context.';

  const overallRisk = getImageRiskLevel(analysis.riskScore);

  return {
    id: `img-${context.id}-${Date.now()}`,
    category: 'ai_threat',
    severity,
    title,
    message,
    riskScore: analysis.riskScore,
    evidence: analysis.issues,
    createdAt: new Date().toISOString(),
    source: 'image_analyzer',
    riskAnalysis: {
      overallRisk,
      riskScore: analysis.riskScore,
      detectedPatterns: analysis.issues.map((issue, index) => ({
        category: 'metadata-anomaly' as const,
        severity: index === 0 ? 'high' : 'medium',
        indicator: issue,
        advice: analysis.recommendations[index] || 'Verify image source and context'
      })),
      recommendations: analysis.recommendations,
      analyzedAt: new Date().toISOString()
    }
  };
}
