/**
 * Text Feed Parser
 * Parses text-based feeds (like OpenPhish) into RSS-like format
 * Handles feeds that provide URLs or data in plain text format
 */

/**
 * Parse OpenPhish text feed format
 * Format: One URL per line
 * Example:
 *   https://example.com/phishing1
 *   https://example.com/phishing2
 */
export function parseOpenPhishTextFeed(text, feedConfig) {
  const lines = text.trim().split('\n').filter(line => line.trim());
  const items = [];
  const now = new Date();

  lines.forEach((url, index) => {
    if (!url || !url.startsWith('http')) {
      return; // Skip invalid lines
    }

    // Extract domain from URL for title
    try {
      const urlObj = new URL(url);
      const domain = urlObj.hostname;
      
      items.push({
        id: `openphish-${index}-${Date.now()}`,
        title: `Phishing URL Detected: ${domain}`,
        description: `A phishing URL has been detected targeting users. URL: ${url}`,
        link: url,
        pubDate: new Date(now.getTime() - (index * 60000)).toISOString(), // Stagger dates
        guid: `openphish-${url}`,
        feedCategory: feedConfig.category || 'phishing',
        feedName: feedConfig.name || 'OpenPhish',
        feedId: feedConfig.id || 'phishing-database',
        feedRegion: 'global',
        // Extract potential service keywords from URL
        serviceKeywords: extractServiceKeywordsFromUrl(url)
      });
    } catch (error) {
      // Invalid URL, skip
      console.warn(`[Text Feed Parser] Invalid URL in feed: ${url}`);
    }
  });

  return items;
}

/**
 * Extract service keywords from URL to help with relevance matching
 */
function extractServiceKeywordsFromUrl(url) {
  const urlLower = url.toLowerCase();
  const serviceKeywords = [];

  // Common service patterns in phishing URLs
  const servicePatterns = {
    'paypal': ['paypal', 'pay-pal'],
    'google': ['google', 'gmail', 'googledrive', 'google-drive'],
    'microsoft': ['microsoft', 'office', 'outlook', 'onedrive', 'live.com', 'hotmail'],
    'amazon': ['amazon', 'aws'],
    'apple': ['apple', 'icloud', 'appleid'],
    'facebook': ['facebook', 'fb.com', 'fb-login'],
    'netflix': ['netflix'],
    'twitter': ['twitter', 'x.com'],
    'linkedin': ['linkedin', 'linked-in'],
    'banking': ['bank', 'chase', 'wells-fargo', 'bankofamerica', 'citi']
  };

  Object.keys(servicePatterns).forEach(service => {
    if (servicePatterns[service].some(pattern => urlLower.includes(pattern))) {
      serviceKeywords.push(service);
    }
  });

  return serviceKeywords;
}

/**
 * Generic text feed parser
 * Attempts to parse various text-based feed formats
 */
export function parseTextFeed(text, feedConfig) {
  // Check feed type or infer from URL
  const feedType = feedConfig.feedType || inferFeedType(feedConfig.url);

  switch (feedType) {
    case 'openphish':
    case 'text':
      return parseOpenPhishTextFeed(text, feedConfig);
    
    case 'csv':
      return parseCSVFeed(text, feedConfig);
    
    default:
      // Try OpenPhish format as default
      return parseOpenPhishTextFeed(text, feedConfig);
  }
}

/**
 * Infer feed type from URL
 */
function inferFeedType(url) {
  if (!url) return 'text';
  
  const urlLower = url.toLowerCase();
  
  if (urlLower.includes('openphish')) {
    return 'openphish';
  }
  
  if (urlLower.endsWith('.csv') || urlLower.includes('csv')) {
    return 'csv';
  }
  
  return 'text';
}

/**
 * Parse CSV format feeds
 * Format: URL,Date,Description (or similar variations)
 */
function parseCSVFeed(text, feedConfig) {
  const lines = text.trim().split('\n').filter(line => line.trim());
  const items = [];
  
  // Try to detect header row
  const hasHeader = lines[0] && (
    lines[0].toLowerCase().includes('url') ||
    lines[0].toLowerCase().includes('date') ||
    lines[0].toLowerCase().includes('description')
  );
  
  const dataLines = hasHeader ? lines.slice(1) : lines;
  
  dataLines.forEach((line, index) => {
    const columns = line.split(',').map(col => col.trim().replace(/^["']|["']$/g, ''));
    
    if (columns.length === 0 || !columns[0]) return;
    
    const url = columns[0];
    const date = columns[1] ? new Date(columns[1]) : new Date();
    const description = columns[2] || `Threat detected: ${url}`;
    
    if (!url.startsWith('http')) return;
    
    try {
      const urlObj = new URL(url);
      const domain = urlObj.hostname;
      
      items.push({
        id: `csv-${feedConfig.id}-${index}-${Date.now()}`,
        title: `Threat Detected: ${domain}`,
        description: description,
        link: url,
        pubDate: date.toISOString(),
        guid: `${feedConfig.id}-${url}`,
        feedCategory: feedConfig.category || 'phishing',
        feedName: feedConfig.name || 'CSV Feed',
        feedId: feedConfig.id,
        feedRegion: 'global',
        serviceKeywords: extractServiceKeywordsFromUrl(url)
      });
    } catch (error) {
      console.warn(`[Text Feed Parser] Invalid URL in CSV: ${url}`);
    }
  });
  
  return items;
}

/**
 * Check if a feed URL is a text-based feed
 */
export function isTextFeed(feedConfig) {
  if (feedConfig.feedType === 'text' || feedConfig.feedType === 'csv' || feedConfig.feedType === 'openphish') {
    return true;
  }
  
  const url = feedConfig.url || '';
  return url.endsWith('.txt') || url.endsWith('.csv') || url.includes('feed.txt');
}

