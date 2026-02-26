// Unified CautionAlert type definitions for SocialCaution
// Supports AI threat detection, privacy risks, and security alerts

export type AlertSeverity = 'info' | 'warning' | 'high' | 'critical';

export type AlertCategory =
  | 'privacy_risk'
  | 'account_security'
  | 'ai_threat'          // AI-related phishing and manipulation risks
  | 'data_broker'
  | 'breach_notice'
  | 'phishing_risk'      // Specific phishing category
  | 'manipulation_tactics'; // Social engineering and manipulation

export interface CautionAlert {
  id: string;
  category: AlertCategory;
  severity: AlertSeverity;
  title: string;
  message: string;
  personaTag?: string;         // Optional: map to SocialCaution persona
  serviceId?: string;
  serviceName?: string;
  riskScore?: number;          // 0-100 risk assessment score
  evidence?: string[];         // List of simple indicators/reasons
  createdAt: string;
  source: 'ai_detector' | 'service_monitor' | 'user_paste' | 'system';
  link?: string;               // Optional: URL link to original article/source
  
  // Optional risk analysis details
  riskAnalysis?: {
    overallRisk: 'low' | 'medium' | 'high' | 'critical';
    riskScore: number;
    detectedPatterns: DetectedPattern[];
    recommendations: string[];
    analyzedAt: string;
  };
}

export interface DetectedPattern {
  category: 'urgency-manipulation' | 'account-threat' | 'link-pressure' | 'sensitive-request' | 'impersonation' | 'generic-tone';
  severity: 'low' | 'medium' | 'high' | 'critical';
  indicator: string;
  foundText?: string;
  advice: string;
}

