// Analyze email headers for phishing and spoofing indicators

export interface EmailHeaderAnalysis {
  isSuspicious: boolean;
  riskScore: number; // 0-100
  issues: string[];
  headerInfo: {
    from?: string;
    replyTo?: string;
    returnPath?: string;
    subject?: string;
    date?: string;
    messageId?: string;
    received?: string[];
    spf?: 'pass' | 'fail' | 'softfail' | 'neutral' | 'none';
    dkim?: 'pass' | 'fail' | 'none';
    dmarc?: 'pass' | 'fail' | 'none';
    authenticationResults?: string;
  };
  recommendations: string[];
}

/**
 * Parse and analyze email headers
 */
export function analyzeEmailHeaders(headerText: string): EmailHeaderAnalysis {
  let riskScore = 0;
  const issues: string[] = [];
  const recommendations: string[] = [];
  const headerInfo: EmailHeaderAnalysis['headerInfo'] = {
    received: []
  };

  // Normalize header text
  const headers = headerText.split('\n').map(line => line.trim()).filter(line => line);
  
  // Parse headers
  headers.forEach(line => {
    const colonIndex = line.indexOf(':');
    if (colonIndex === -1) return;
    
    const key = line.substring(0, colonIndex).trim().toLowerCase();
    const value = line.substring(colonIndex + 1).trim();

    switch (key) {
      case 'from':
        headerInfo.from = value;
        break;
      case 'reply-to':
        headerInfo.replyTo = value;
        break;
      case 'return-path':
        headerInfo.returnPath = value;
        break;
      case 'subject':
        headerInfo.subject = value;
        break;
      case 'date':
        headerInfo.date = value;
        break;
      case 'message-id':
        headerInfo.messageId = value;
        break;
      case 'received':
        headerInfo.received?.push(value);
        break;
      case 'authentication-results':
        headerInfo.authenticationResults = value;
        // Parse SPF, DKIM, DMARC
        if (value.includes('spf=')) {
          const spfMatch = value.match(/spf=(\w+)/i);
          if (spfMatch) {
            headerInfo.spf = spfMatch[1].toLowerCase() as any;
          }
        }
        if (value.includes('dkim=')) {
          const dkimMatch = value.match(/dkim=(\w+)/i);
          if (dkimMatch) {
            headerInfo.dkim = dkimMatch[1].toLowerCase() as any;
          }
        }
        if (value.includes('dmarc=')) {
          const dmarcMatch = value.match(/dmarc=(\w+)/i);
          if (dmarcMatch) {
            headerInfo.dmarc = dmarcMatch[1].toLowerCase() as any;
          }
        }
        break;
    }
  });

  // Check SPF
  if (headerInfo.spf === 'none') {
    riskScore += 15;
    issues.push('No SPF record found for sender domain');
    recommendations.push('Sender domain does not have SPF protection configured');
  } else if (headerInfo.spf === 'fail') {
    riskScore += 40;
    issues.push('SPF check FAILED - email may be spoofed');
    recommendations.push('⚠️ CRITICAL: SPF authentication failed - this email likely did not come from the claimed sender');
  } else if (headerInfo.spf === 'softfail') {
    riskScore += 25;
    issues.push('SPF check SOFTFAIL - sender may not be authorized');
    recommendations.push('SPF check indicates potential unauthorized sender');
  } else if (headerInfo.spf === 'pass') {
    recommendations.push('✓ SPF check passed - sender domain is authenticated');
  }

  // Check DKIM
  if (headerInfo.dkim === 'none') {
    riskScore += 10;
    issues.push('No DKIM signature found');
    recommendations.push('Email does not have DKIM signature for verification');
  } else if (headerInfo.dkim === 'fail') {
    riskScore += 35;
    issues.push('DKIM check FAILED - email signature invalid');
    recommendations.push('⚠️ DKIM authentication failed - email may have been tampered with');
  } else if (headerInfo.dkim === 'pass') {
    recommendations.push('✓ DKIM check passed - email signature verified');
  }

  // Check DMARC
  if (headerInfo.dmarc === 'none') {
    riskScore += 5;
    issues.push('No DMARC policy found');
  } else if (headerInfo.dmarc === 'fail') {
    riskScore += 30;
    issues.push('DMARC check FAILED - email does not meet domain policy');
    recommendations.push('⚠️ DMARC policy check failed - email may be spoofed');
  } else if (headerInfo.dmarc === 'pass') {
    recommendations.push('✓ DMARC check passed - email meets domain policy');
  }

  // Check for mismatched From/Reply-To
  if (headerInfo.from && headerInfo.replyTo) {
    const fromDomain = extractDomain(headerInfo.from);
    const replyToDomain = extractDomain(headerInfo.replyTo);
    
    if (fromDomain && replyToDomain && fromDomain !== replyToDomain) {
      riskScore += 20;
      issues.push(`From domain (${fromDomain}) does not match Reply-To domain (${replyToDomain})`);
      recommendations.push('⚠️ Sender and reply-to addresses use different domains - suspicious');
    }
  }

  // Check for suspicious domains
  if (headerInfo.from) {
    const domain = extractDomain(headerInfo.from);
    if (domain) {
      // Check for typosquatting patterns
      const suspiciousPatterns = [
        /gmail\.co$/,  // Missing 'm'
        /gmai1\.com$/, // Number substitution
        /gmai\.com$/,  // Missing letter
        /microsft\./,  // Common typos
        /paypa1\./,    // Number substitution
        /amaz0n\./,    // Zero substitution
      ];

      if (suspiciousPatterns.some(pattern => pattern.test(domain))) {
        riskScore += 50;
        issues.push(`Suspicious domain detected: ${domain}`);
        recommendations.push('🚨 CRITICAL: Domain appears to be a typo or lookalike - likely phishing');
      }

      // Check for subdomain abuse
      if (domain.split('.').length > 3) {
        riskScore += 10;
        issues.push('Unusually long domain name - may be subdomain abuse');
      }
    }
  }

  // Check for missing Message-ID
  if (!headerInfo.messageId) {
    riskScore += 10;
    issues.push('Missing Message-ID header');
    recommendations.push('Email is missing standard Message-ID header');
  }

  // Check date anomalies
  if (headerInfo.date) {
    try {
      const emailDate = new Date(headerInfo.date);
      const now = new Date();
      const diffHours = (now.getTime() - emailDate.getTime()) / (1000 * 60 * 60);
      
      // Future dates
      if (emailDate > now) {
        riskScore += 25;
        issues.push('Email date is in the future');
        recommendations.push('⚠️ Email timestamp is invalid - likely spoofed');
      }
      
      // Very old emails (more than 1 year)
      if (diffHours > 8760) {
        riskScore += 5;
        issues.push('Email is very old');
      }
    } catch (e) {
      riskScore += 10;
      issues.push('Invalid or unparseable date header');
    }
  }

  // Generate overall recommendations
  if (riskScore >= 70) {
    recommendations.unshift('🚨 CRITICAL: This email shows strong signs of being spoofed or malicious');
    recommendations.push('Do not click any links or download attachments');
    recommendations.push('Do not reply to this email');
    recommendations.push('Delete this email immediately');
  } else if (riskScore >= 50) {
    recommendations.unshift('⚠️ HIGH RISK: This email has multiple suspicious indicators');
    recommendations.push('Verify the sender through official channels before taking any action');
    recommendations.push('Do not click links or provide information');
  } else if (riskScore >= 30) {
    recommendations.unshift('⚠️ Exercise caution with this email');
    recommendations.push('Verify the sender if you were not expecting this email');
  } else {
    recommendations.unshift('Email headers appear normal, but always verify unexpected emails');
  }

  return {
    isSuspicious: riskScore >= 50,
    riskScore: Math.min(100, riskScore),
    issues,
    headerInfo,
    recommendations
  };
}

/**
 * Extract domain from email address
 */
function extractDomain(email: string): string | null {
  const match = email.match(/@([^\s>]+)/);
  return match ? match[1].toLowerCase() : null;
}

/**
 * Get risk level from score
 */
export function getEmailRiskLevel(riskScore: number): 'low' | 'medium' | 'high' | 'critical' {
  if (riskScore >= 70) return 'critical';
  if (riskScore >= 50) return 'high';
  if (riskScore >= 30) return 'medium';
  return 'low';
}
