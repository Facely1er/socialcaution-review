// Analyze social media profiles for AI-generated or fake account indicators

export interface ProfileAnalysisResult {
  isSuspicious: boolean;
  riskScore: number; // 0-100
  issues: string[];
  profileInfo: {
    username?: string;
    displayName?: string;
    bio?: string;
    profileImage?: string;
    accountAge?: number; // days
    postCount?: number;
    followerCount?: number;
    followingCount?: number;
    verified?: boolean;
    location?: string;
    website?: string;
  };
  patterns: {
    genericUsername: boolean;
    emptyBio: boolean;
    suspiciousRatio: boolean;
    newAccount: boolean;
    noProfileImage: boolean;
    suspiciousContent: boolean;
  };
  recommendations: string[];
}

/**
 * Analyze social media profile for suspicious patterns
 */
export function analyzeSocialProfile(profileData: {
  username?: string;
  displayName?: string;
  bio?: string;
  accountAge?: number; // days since creation
  postCount?: number;
  followerCount?: number;
  followingCount?: number;
  verified?: boolean;
  location?: string;
  website?: string;
}): ProfileAnalysisResult {
  let riskScore = 0;
  const issues: string[] = [];
  const recommendations: string[] = [];
  const patterns = {
    genericUsername: false,
    emptyBio: false,
    suspiciousRatio: false,
    newAccount: false,
    noProfileImage: false,
    suspiciousContent: false
  };

  // Check username patterns
  if (profileData.username) {
    const username = profileData.username.toLowerCase();
    
    // Generic username patterns
    const genericPatterns = [
      /^user\d+$/,
      /^account\d+$/,
      /^profile\d+$/,
      /^test\d+$/,
      /^\d{8,}$/, // All numbers
      /^[a-z]\d{6,}$/i, // Single letter + numbers
    ];

    if (genericPatterns.some(pattern => pattern.test(username))) {
      riskScore += 15;
      issues.push('Generic or auto-generated username pattern');
      patterns.genericUsername = true;
      recommendations.push('Username appears to be auto-generated');
    }

    // Suspicious character patterns
    if (username.includes('__') || username.includes('..') || username.includes('--')) {
      riskScore += 5;
      issues.push('Username contains suspicious character patterns');
    }
  }

  // Check display name
  if (profileData.displayName) {
    // Empty or very short
    if (profileData.displayName.trim().length < 2) {
      riskScore += 10;
      issues.push('Display name is empty or too short');
    }

    // Generic names
    const genericNames = ['user', 'account', 'profile', 'test', 'admin'];
    if (genericNames.includes(profileData.displayName.toLowerCase())) {
      riskScore += 15;
      issues.push('Generic display name');
    }
  }

  // Check bio
  if (!profileData.bio || profileData.bio.trim().length === 0) {
    riskScore += 10;
    issues.push('No bio or description provided');
    patterns.emptyBio = true;
    recommendations.push('Legitimate accounts usually have a bio');
  } else {
    const bio = profileData.bio.toLowerCase();
    
    // Suspicious content patterns
    const suspiciousBioPatterns = [
      /crypto|bitcoin|investment|trading|profit|money|free|click here|link in bio/i,
      /follow.*get.*followers/i,
      /dm.*for.*more/i,
    ];

    if (suspiciousBioPatterns.some(pattern => pattern.test(bio))) {
      riskScore += 20;
      issues.push('Bio contains suspicious promotional content');
      patterns.suspiciousContent = true;
      recommendations.push('Bio contains common scam/spam patterns');
    }
  }

  // Check account age
  if (profileData.accountAge !== undefined) {
    if (profileData.accountAge < 7) {
      riskScore += 25;
      issues.push(`Account is very new (${profileData.accountAge} days old)`);
      patterns.newAccount = true;
      recommendations.push('⚠️ Account was created very recently - exercise caution');
    } else if (profileData.accountAge < 30) {
      riskScore += 10;
      issues.push(`Account is relatively new (${profileData.accountAge} days old)`);
      patterns.newAccount = true;
    } else if (profileData.accountAge > 365) {
      recommendations.push('✓ Account has been active for over a year');
    }
  }

  // Check follower/following ratios
  if (profileData.followerCount !== undefined && profileData.followingCount !== undefined) {
    // Following many but few followers (common bot pattern)
    if (profileData.followingCount > 100 && profileData.followerCount < 10) {
      riskScore += 20;
      issues.push('Following many accounts but has few followers');
      patterns.suspiciousRatio = true;
      recommendations.push('This follower/following ratio is common for bot accounts');
    }

    // Suspiciously high follower count with no verification
    if (profileData.followerCount > 10000 && !profileData.verified) {
      riskScore += 5;
      issues.push('High follower count but account is not verified');
    }

    // Zero followers but following many
    if (profileData.followerCount === 0 && profileData.followingCount > 50) {
      riskScore += 30;
      issues.push('Following many accounts but has zero followers - strong bot indicator');
      patterns.suspiciousRatio = true;
      recommendations.push('🚨 This pattern is highly suspicious - likely a bot or fake account');
    }
  }

  // Check post count vs account age
  if (profileData.postCount !== undefined && profileData.accountAge !== undefined && profileData.accountAge > 0) {
    const postsPerDay = profileData.postCount / profileData.accountAge;
    
    // Very high posting rate
    if (postsPerDay > 10) {
      riskScore += 15;
      issues.push('Unusually high posting frequency');
      patterns.suspiciousContent = true;
      recommendations.push('Posting frequency suggests automated activity');
    }

    // Old account with no posts
    if (profileData.accountAge > 30 && profileData.postCount === 0) {
      riskScore += 20;
      issues.push('Account is old but has no posts');
      recommendations.push('Inactive accounts are sometimes used for impersonation');
    }
  }

  // Check verification status
  if (profileData.verified) {
    recommendations.push('✓ Account is verified by the platform');
  } else {
    riskScore += 5;
    recommendations.push('Account is not verified - verify identity through other means');
  }

  // Check website link
  if (profileData.website) {
    const domain = extractDomainFromUrl(profileData.website);
    if (domain) {
      // Suspicious domains
      const suspiciousDomains = [
        'bit.ly', 'tinyurl.com', 't.co', 'goo.gl', 'ow.ly',
        'rebrand.ly', 'short.link', 'cutt.ly'
      ];
      
      if (suspiciousDomains.some(sd => domain.includes(sd))) {
        riskScore += 10;
        issues.push('Website link uses URL shortener');
        recommendations.push('URL shorteners can hide malicious links - be cautious');
      }
    }
  }

  // Generate overall recommendations
  if (riskScore >= 70) {
    recommendations.unshift('🚨 CRITICAL: This profile shows strong signs of being fake or AI-generated');
    recommendations.push('Do not trust information from this account');
    recommendations.push('Do not click any links shared by this account');
    recommendations.push('Report suspicious activity if appropriate');
  } else if (riskScore >= 50) {
    recommendations.unshift('⚠️ HIGH RISK: This profile has multiple suspicious indicators');
    recommendations.push('Verify the identity of this account through other channels');
    recommendations.push('Be cautious when interacting with this account');
  } else if (riskScore >= 30) {
    recommendations.unshift('⚠️ Exercise caution with this profile');
    recommendations.push('Some indicators suggest this may not be a legitimate account');
  } else {
    recommendations.unshift('Profile appears relatively normal, but always verify identities');
    recommendations.push('Use reverse image search on profile pictures if suspicious');
  }

  return {
    isSuspicious: riskScore >= 50,
    riskScore: Math.min(100, riskScore),
    issues,
    profileInfo: profileData,
    patterns,
    recommendations
  };
}

/**
 * Extract domain from URL
 */
function extractDomainFromUrl(url: string): string | null {
  try {
    const urlObj = new URL(url.startsWith('http') ? url : `https://${url}`);
    return urlObj.hostname.toLowerCase();
  } catch {
    return null;
  }
}

/**
 * Get risk level from score
 */
export function getProfileRiskLevel(riskScore: number): 'low' | 'medium' | 'high' | 'critical' {
  if (riskScore >= 70) return 'critical';
  if (riskScore >= 50) return 'high';
  if (riskScore >= 30) return 'medium';
  return 'low';
}
