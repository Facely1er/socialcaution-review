// Enhanced Feed Relevancy Scoring System
// Multi-dimensional approach for better feed evaluation

/**
 * Enhanced relevancy scoring with multiple dimensions
 * @param {Object} item - RSS feed item
 * @param {Object} userContext - User's organizational context (optional)
 * @returns {Object} { score: 0-100, breakdown: {...}, priority: string, badges: [] }
 */
export function calculateEnhancedRelevancy(item, userContext = {}) {
  const breakdown = {
    impact: 0,        // Business/Operational Impact (0-30)
    urgency: 0,       // Time Sensitivity (0-25)
    scope: 0,         // Geographic/Industry Reach (0-20)
    credibility: 0,   // Source Authority (0-15)
    actionability: 0  // Requires Action/Response (0-10)
  };

  const badges = [];
  const title = (item.title || '').toLowerCase();
  const description = (item.description || item.summary || '').toLowerCase();
  const content = `${title} ${description}`;
  const pubDate = new Date(item.pubDate || item.published || Date.now());
  const ageInDays = (Date.now() - pubDate) / (1000 * 60 * 60 * 24);

  // ========================================
  // 1. IMPACT SCORE (0-30 points)
  // ========================================
  
  // Critical regulatory changes
  if (content.match(/gdpr|ccpa|dpdpa|regulation|compliance|enforcement|fine|penalty|lawsuit|settlement/)) {
    breakdown.impact += 15;
    if (content.match(/fine|penalty|enforcement action/)) {
      breakdown.impact += 5;
      badges.push({ label: 'Enforcement', color: 'red', icon: 'gavel' });
    }
  }

  // Data breach severity
  if (content.match(/data breach|breach|hacked|compromised|exposed/)) {
    breakdown.impact += 10;
    
    // Scale by number of affected users
    const userMatch = content.match(/(\d+)\s*(million|billion|thousand)/i);
    if (userMatch) {
      const number = parseInt(userMatch[1]);
      const scale = userMatch[2].toLowerCase();
      if (scale === 'billion' || (scale === 'million' && number >= 10)) {
        breakdown.impact += 10;
        badges.push({ label: 'Major Breach', color: 'red', icon: 'alert-triangle' });
      } else if (scale === 'million' && number >= 1) {
        breakdown.impact += 5;
        badges.push({ label: 'Breach', color: 'orange', icon: 'shield-alert' });
      }
    }
  }

  // New legislation/laws
  if (content.match(/new law|legislation|bill passed|enacted|amended|updated regulation/)) {
    breakdown.impact += 12;
    badges.push({ label: 'New Law', color: 'purple', icon: 'file-text' });
  }

  // Industry-wide changes
  if (content.match(/industry|sector|all companies|mandatory|requirement/)) {
    breakdown.impact += 8;
  }

  // Cap impact at 30
  breakdown.impact = Math.min(breakdown.impact, 30);

  // ========================================
  // 2. URGENCY SCORE (0-25 points)
  // ========================================
  
  // Recency (newer = more urgent)
  if (ageInDays < 1) {
    breakdown.urgency += 15;
    badges.push({ label: 'Breaking', color: 'red', icon: 'zap' });
  } else if (ageInDays < 3) {
    breakdown.urgency += 12;
    badges.push({ label: 'Recent', color: 'orange', icon: 'clock' });
  } else if (ageInDays < 7) {
    breakdown.urgency += 8;
  } else if (ageInDays < 14) {
    breakdown.urgency += 5;
  } else if (ageInDays < 30) {
    breakdown.urgency += 2;
  }

  // Deadline/Timeline mentions
  if (content.match(/deadline|expires|must comply|by \w+ \d+|within \d+ days|immediate|urgent/)) {
    breakdown.urgency += 10;
    badges.push({ label: 'Deadline', color: 'red', icon: 'calendar' });
  }

  // Cap urgency at 25
  breakdown.urgency = Math.min(breakdown.urgency, 25);

  // ========================================
  // 3. SCOPE SCORE (0-20 points)
  // ========================================
  
  // Geographic scope
  const geographicScope = {
    global: /global|international|worldwide|all countries/,
    regional: /eu|european union|asia|americas|africa/,
    multi_country: /us and|uk and|multiple countries/,
    national: /united states|usa|u\.s\.|uk|canada|india|china|france|germany/,
    state: /california|new york|texas|virginia|state of/
  };

  if (content.match(geographicScope.global)) {
    breakdown.scope += 20;
    badges.push({ label: 'Global', color: 'blue', icon: 'globe' });
  } else if (content.match(geographicScope.regional)) {
    breakdown.scope += 15;
    badges.push({ label: 'Regional', color: 'blue', icon: 'map' });
  } else if (content.match(geographicScope.multi_country)) {
    breakdown.scope += 12;
  } else if (content.match(geographicScope.national)) {
    breakdown.scope += 8;
  } else if (content.match(geographicScope.state)) {
    breakdown.scope += 5;
  }

  // Industry scope
  if (content.match(/all industries|every company|any organization|universal/)) {
    breakdown.scope += 5;
  } else if (content.match(/tech|healthcare|finance|retail|multiple sectors/)) {
    breakdown.scope += 3;
  }

  // Cap scope at 20
  breakdown.scope = Math.min(breakdown.scope, 20);

  // ========================================
  // 4. CREDIBILITY SCORE (0-15 points)
  // ========================================
  
  const sourceName = (item.source || '').toLowerCase();
  const link = (item.link || item.url || '').toLowerCase();

  // Tier 1: Official government/regulatory sources
  if (sourceName.match(/^(cisa|nist|ftc|iapp|gdpr|ico|cnil)/) || 
      link.match(/\.gov|\.gov\.|europa\.eu|edpb\.europa/)) {
    breakdown.credibility = 15;
    badges.push({ label: 'Official', color: 'green', icon: 'check-circle' });
  }
  // Tier 2: Respected security researchers & major news
  else if (sourceName.match(/krebs|schneier|techcrunch|wired|reuters|bloomberg/)) {
    breakdown.credibility = 12;
  }
  // Tier 3: Industry publications
  else if (sourceName.match(/security|privacy|compliance|cyber/)) {
    breakdown.credibility = 9;
  }
  // Tier 4: General tech news
  else if (sourceName.match(/tech|news|blog/)) {
    breakdown.credibility = 6;
  }
  // Unknown sources
  else {
    breakdown.credibility = 3;
  }

  // ========================================
  // 5. ACTIONABILITY SCORE (0-10 points)
  // ========================================
  
  // Requires immediate action
  if (content.match(/must|should|required to|need to|action required|update now|patch|fix/)) {
    breakdown.actionability += 6;
  }

  // Contains specific guidance/recommendations
  if (content.match(/how to|steps to|guidance|recommendations|best practices|checklist/)) {
    breakdown.actionability += 4;
    badges.push({ label: 'Actionable', color: 'green', icon: 'check' });
  }

  // Cap actionability at 10
  breakdown.actionability = Math.min(breakdown.actionability, 10);

  // ========================================
  // CALCULATE TOTAL SCORE
  // ========================================
  
  const totalScore = Object.values(breakdown).reduce((sum, val) => sum + val, 0);

  // ========================================
  // DETERMINE PRIORITY LEVEL
  // ========================================
  
  let priority, priorityLabel, priorityColor;
  
  if (totalScore >= 75) {
    priority = 'critical';
    priorityLabel = 'Critical';
    priorityColor = 'red';
  } else if (totalScore >= 60) {
    priority = 'high';
    priorityLabel = 'High';
    priorityColor = 'orange';
  } else if (totalScore >= 40) {
    priority = 'medium';
    priorityLabel = 'Medium';
    priorityColor = 'yellow';
  } else if (totalScore >= 20) {
    priority = 'low';
    priorityLabel = 'Low';
    priorityColor = 'blue';
  } else {
    priority = 'info';
    priorityLabel = 'Info';
    priorityColor = 'gray';
  }

  // ========================================
  // USER CONTEXT ADJUSTMENTS (Optional)
  // ========================================
  
  let contextAdjustment = 0;
  
  if (userContext.industry) {
    if (content.includes(userContext.industry.toLowerCase())) {
      contextAdjustment += 10;
      badges.push({ label: 'Relevant to You', color: 'purple', icon: 'target' });
    }
  }

  if (userContext.regions && userContext.regions.length > 0) {
    const userRegions = userContext.regions.map(r => r.toLowerCase());
    if (userRegions.some(region => content.includes(region))) {
      contextAdjustment += 8;
    }
  }

  if (userContext.keywords && userContext.keywords.length > 0) {
    const matchedKeywords = userContext.keywords.filter(kw => 
      content.includes(kw.toLowerCase())
    );
    if (matchedKeywords.length > 0) {
      contextAdjustment += matchedKeywords.length * 3;
    }
  }

  const finalScore = Math.min(totalScore + contextAdjustment, 100);

  // Recalculate priority if context adjustment changed things significantly
  if (contextAdjustment > 0 && finalScore >= 75 && priority !== 'critical') {
    priority = 'critical';
    priorityLabel = 'Critical';
    priorityColor = 'red';
  } else if (contextAdjustment > 0 && finalScore >= 60 && priority === 'medium') {
    priority = 'high';
    priorityLabel = 'High';
    priorityColor = 'orange';
  }

  return {
    score: Math.round(finalScore),
    breakdown,
    priority,
    priorityLabel,
    priorityColor,
    badges,
    contextAdjustment
  };
}

/**
 * Get a human-readable explanation of the relevancy score
 */
export function getRelevancyExplanation(relevancy) {
  const explanations = [];
  const { breakdown, badges, contextAdjustment } = relevancy;

  if (breakdown.impact >= 20) {
    explanations.push('High business impact');
  } else if (breakdown.impact >= 10) {
    explanations.push('Moderate impact');
  }

  if (breakdown.urgency >= 15) {
    explanations.push('Requires immediate attention');
  } else if (breakdown.urgency >= 10) {
    explanations.push('Time-sensitive');
  }

  if (breakdown.scope >= 15) {
    explanations.push('Wide geographic scope');
  }

  if (breakdown.credibility >= 12) {
    explanations.push('From trusted source');
  }

  if (breakdown.actionability >= 5) {
    explanations.push('Actionable guidance provided');
  }

  if (contextAdjustment > 0) {
    explanations.push('Relevant to your organization');
  }

  return explanations.length > 0 ? explanations.join(' • ') : 'General information';
}

/**
 * Filter and sort feeds by minimum relevancy threshold
 */
export function filterByRelevancy(items, minScore = 40, userContext = {}) {
  return items
    .map(item => ({
      ...item,
      relevancy: calculateEnhancedRelevancy(item, userContext)
    }))
    .filter(item => item.relevancy.score >= minScore)
    .sort((a, b) => b.relevancy.score - a.relevancy.score);
}

/**
 * Get statistics about feed relevancy
 */
export function getRelevancyStats(items, userContext = {}) {
  const scoredItems = items.map(item => calculateEnhancedRelevancy(item, userContext));
  
  const stats = {
    total: scoredItems.length,
    critical: scoredItems.filter(s => s.priority === 'critical').length,
    high: scoredItems.filter(s => s.priority === 'high').length,
    medium: scoredItems.filter(s => s.priority === 'medium').length,
    low: scoredItems.filter(s => s.priority === 'low').length,
    info: scoredItems.filter(s => s.priority === 'info').length,
    averageScore: scoredItems.length > 0 
      ? Math.round(scoredItems.reduce((sum, s) => sum + s.score, 0) / scoredItems.length)
      : 0
  };

  return stats;
}

