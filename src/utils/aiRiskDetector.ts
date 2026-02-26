// AI-style phishing and manipulation risk detector
// Client-side pattern-based detection for suspicious messages

export interface AIRiskResult {
  isPotentialThreat: boolean;
  riskScore: number;   // 0-100
  reasons: string[];
}

/**
 * Analyze a message for phishing and manipulation patterns
 * Returns risk assessment with score and specific indicators
 */
export function analyzeMessageForPhishingRisk(text: string): AIRiskResult {
  if (!text || !text.trim()) {
    return { isPotentialThreat: false, riskScore: 0, reasons: [] };
  }

  let score = 0;
  const reasons: string[] = [];

  // 1. Urgency / fear patterns (25 points)
  if (/urgent(ly)?\s+(action|update|verification|response)/i.test(text)) {
    score += 25;
    reasons.push('Urgent action language detected');
  }

  // Additional urgency indicators
  if (/immediate(ly)?\s+(action|attention|response)/i.test(text)) {
    score += 20;
    reasons.push('Immediate attention demand');
  }

  if (/act\s+now|respond\s+immediately|time\s+sensitive/i.test(text)) {
    score += 15;
    reasons.push('Time-pressure phrasing');
  }

  // 2. Account threats (30 points - highest priority)
  if (/\b(account|profile)\b.*\b(suspended|locked|compromised|breach|disabled|terminated)\b/i.test(text)) {
    score += 30;
    reasons.push('Account suspension or compromise threat');
  }

  if (/unusual\s+activity|suspicious\s+(login|access|activity)/i.test(text)) {
    score += 25;
    reasons.push('Unusual activity claim');
  }

  if (/unauthorized\s+(access|transaction|login|charge)/i.test(text)) {
    score += 25;
    reasons.push('Unauthorized activity warning');
  }

  // 3. Click pressure / link manipulation (20 points)
  if (/click\s+(here|this|now|below)|tap\s+(here|now)|follow\s+(this\s+)?link/i.test(text)) {
    score += 20;
    reasons.push('Click-pressure phrasing');
  }

  if (/verify\s+(your|now|immediately|account)|confirm\s+(your|identity)/i.test(text)) {
    score += 18;
    reasons.push('Verification pressure');
  }

  // 4. Time pressure / expiration (15 points)
  if (/\b(expire|expires|expired)\b.*\b(soon|today|tonight|now|hours?)\b/i.test(text)) {
    score += 15;
    reasons.push('Expiration time pressure');
  }

  if (/within\s+\d+\s+(hour|day|minute)s?|before\s+(midnight|tonight|tomorrow)/i.test(text)) {
    score += 12;
    reasons.push('Specific deadline pressure');
  }

  // 5. Sensitive information requests (25 points)
  if (/\b(password|ssn|social\s+security|credit\s+card|cvv|pin)\b/i.test(text)) {
    score += 25;
    reasons.push('Requests sensitive information');
  }

  if (/confirm\s+(password|payment|billing|card)/i.test(text)) {
    score += 20;
    reasons.push('Asks to confirm sensitive data');
  }

  // 6. Reward/prize manipulation (15 points)
  if (/you('ve|\s+have)\s+(won|been\s+selected|qualified)/i.test(text)) {
    score += 15;
    reasons.push('Unsolicited prize or reward claim');
  }

  if (/claim\s+(your|now)|limited\s+time\s+offer|exclusive\s+offer/i.test(text)) {
    score += 12;
    reasons.push('Manipulative offer language');
  }

  // 7. Generic / impersonal greetings (10 points)
  const hasGenericGreeting = /dear\s+(customer|user|member|sir|madam|valued)/i.test(text);
  if (hasGenericGreeting) {
    score += 10;
    reasons.push('Generic greeting instead of personal name');
  }

  // 8. Generic tone check (10 points)
  const hasPersonalPronouns = /\b(i|my|me|we|our|us)\b/i.test(text);
  if (!hasPersonalPronouns && text.length < 400) {
    score += 10;
    reasons.push('Generic content with no personal context');
  }

  // 9. Financial threats (20 points)
  if (/payment\s+(failed|declined|overdue)|billing\s+(issue|problem)/i.test(text)) {
    score += 20;
    reasons.push('Financial threat or payment issue');
  }

  // 10. Authority impersonation indicators (15 points)
  if (/\b(irs|fbi|police|government|tax\s+department|social\s+security\s+administration)\b/i.test(text)) {
    score += 15;
    reasons.push('Claims to be from official authority');
  }

  // 11. Poor grammar indicators (subtle, lower weight)
  const hasMultipleExclamations = (text.match(/!/g) || []).length > 2;
  if (hasMultipleExclamations) {
    score += 8;
    reasons.push('Excessive use of exclamation marks');
  }

  // Cap score at 100 and determine threat level
  const capped = Math.min(100, score);
  const isPotentialThreat = capped >= 50;

  return {
    isPotentialThreat,
    riskScore: capped,
    reasons,
  };
}

/**
 * Get a human-readable risk level from a risk score
 */
export function getRiskLevel(riskScore: number): 'low' | 'medium' | 'high' | 'critical' {
  if (riskScore >= 80) return 'critical';
  if (riskScore >= 60) return 'high';
  if (riskScore >= 40) return 'medium';
  return 'low';
}

/**
 * Get recommendations based on risk score
 */
export function getRecommendations(riskScore: number): string[] {
  const recommendations: string[] = [];

  if (riskScore >= 50) {
    recommendations.push('Do not click any links in this message');
    recommendations.push('Do not provide any personal information');
    recommendations.push('Visit the official website directly by typing the URL');
    recommendations.push('Contact the service through official support channels');
  }

  if (riskScore >= 70) {
    recommendations.push('This message shows strong signs of phishing - treat as highly suspicious');
    recommendations.push('Report this message to the claimed sender if you have an account');
    recommendations.push('Check if you actually have an account with this service');
  }

  if (riskScore >= 80) {
    recommendations.push('CRITICAL: This is almost certainly a phishing attempt');
    recommendations.push('Delete this message immediately');
    recommendations.push('Do not respond to the sender');
  }

  if (riskScore < 50) {
    recommendations.push('While the risk appears lower, always verify unexpected messages');
    recommendations.push('When in doubt, contact the service directly through official channels');
  }

  return recommendations;
}

