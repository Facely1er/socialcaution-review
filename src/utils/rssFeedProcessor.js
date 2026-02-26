// RSS Feed Processor - Fetches and processes RSS feeds into caution alerts
// With integrated AI phishing detection
import { createAlert } from '../data/cautionAlerts';
import { rssFeeds, serviceKeywordMap, severityKeywords, categoryPersonaMapping } from '../data/rssFeeds';
import { serviceCatalog } from '../data/serviceCatalog';
import { analyzeMessageForPhishingRisk } from './aiRiskDetector';
import { mapAIRiskToAlert } from '../mappers/aiToCautionAlert';
import { useCautionStore } from '../state/cautionStore';
import { parseTextFeed, isTextFeed } from './textFeedParser';

class RSSFeedProcessor {
  constructor() {
    this.cache = new Map();
    this.cacheTimeout = 3600000; // 1 hour cache
    this.isDev = typeof import.meta !== 'undefined' && Boolean(import.meta.env?.DEV);
    this.aggregatorRetries = 3; // Retry aggregator 3 times before fallback
    this.aggregatorRetryDelay = 1000; // 1 second delay between retries
    /** When true, /api/rss-aggregator returned 404 (e.g. not deployed); skip all feed requests this session */
    this._aggregatorUnavailable = false;
    // Direct fetch is permanently disabled for performance and CORS reasons
    // All feeds must go through the RSS aggregator API
  }

  /**
   * Fetch with timeout
   */
  async fetchWithTimeout(url, timeout = 15000) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);
    
    try {
      const response = await fetch(url, { signal: controller.signal });
      clearTimeout(timeoutId);
      return response;
    } catch (error) {
      clearTimeout(timeoutId);
      if (error.name === 'AbortError') {
        throw new Error(`Request timeout after ${timeout}ms`);
      }
      throw error;
    }
  }

  /**
   * Fetch and parse RSS feed using RSS aggregator API
   * Direct fetching is disabled for performance and CORS reasons
   * All feeds must go through the server-side aggregator function
   */
  async fetchAndParseFeed(feedUrl, options = {}) {
    const { timeout = 15000, onProgress, feedConfig = {} } = options;

    // Circuit breaker: if aggregator already returned 404, skip further requests
    if (this._aggregatorUnavailable) {
      if (onProgress) onProgress({ feedUrl, status: 'unavailable', error: 'RSS aggregator not available' });
      return [];
    }
    
    try {
      // Check cache first
      const cached = this.cache.get(feedUrl);
      if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
        if (onProgress) onProgress({ feedUrl, status: 'cached', items: cached.data.length });
        return cached.data;
      }

      if (onProgress) onProgress({ feedUrl, status: 'fetching' });

      // Use internal RSS aggregator function (server-side, no CORS issues)
      // Check if aggregator is available first (detect 404 early)
      // Use /api/* proxy route which is explicitly configured in netlify.toml
      let xmlContent = '';
      const aggregatorUrl = '/api/rss-aggregator';
      let lastError = null;
      let aggregatorUnavailable = false;
      
      // First, try aggregator once to check if it's available
      try {
        const testResponse = await this.fetchWithTimeout(
          `${aggregatorUrl}?url=${encodeURIComponent(feedUrl)}`, 
          Math.min(timeout, 5000) // Quick test with shorter timeout
        );
        
        // Check if response is valid
        const contentType = testResponse.headers.get('content-type') || '';
        
        if (testResponse.status === 404) {
          // Aggregator function not deployed or not accessible
          aggregatorUnavailable = true;
          this._aggregatorUnavailable = true; // Circuit breaker: skip all subsequent feed requests
          if (this.isDev) {
            console.warn(`[RSS Processor] Netlify function not available (404) for ${feedUrl}. RSS aggregator function must be deployed.`);
          }
        } else if (testResponse.ok && contentType.includes('text/html')) {
          // Getting HTML means SPA redirect is intercepting the function route
          // This happens when the function isn't deployed or the redirect rules are misconfigured
          aggregatorUnavailable = true;
          this._aggregatorUnavailable = true;
          if (this.isDev) {
            console.warn(`[RSS Processor] Netlify function route intercepted by SPA redirect (got HTML). Ensure the function is deployed. For local dev, run "netlify dev" instead of "npm run dev".`);
          }
        } else if (testResponse.ok) {
          // Aggregator is available and working - use the response we already fetched
          xmlContent = await testResponse.text();
        } else {
          // Other error - will retry below
          const responseText = await testResponse.text();
          lastError = new Error(`Aggregator error: ${testResponse.status} ${testResponse.statusText}`);
        }
      } catch (testError) {
        // Network error or timeout - check if it's a 404 in the error message
        if (testError.message && testError.message.includes('404')) {
          aggregatorUnavailable = true;
          if (this.isDev) {
            console.warn(`[RSS Processor] Netlify function not available (404) for ${feedUrl}. RSS aggregator function must be deployed.`);
          }
        } else {
          lastError = testError;
        }
      }
      
      // If aggregator is unavailable (404), fail gracefully without direct fetch
      if (aggregatorUnavailable) {
        if (this.isDev) {
          console.warn(`[RSS Processor] Aggregator unavailable for ${feedUrl}. Returning empty results. RSS aggregator function must be deployed.`);
        }
        if (onProgress) onProgress({ feedUrl, status: 'unavailable', error: 'RSS aggregator function not deployed' });
        return []; // Return empty array instead of attempting direct fetch
      }
      
      // If aggregator is available but failed - retry with exponential backoff
      if (!xmlContent) {
        for (let attempt = 1; attempt <= this.aggregatorRetries; attempt++) {
          try {
          if (attempt > 1) {
            // Wait before retry (exponential backoff)
            const delay = this.aggregatorRetryDelay * Math.pow(2, attempt - 2);
            if (this.isDev) {
              console.log(`[RSS Processor] Retrying aggregator (attempt ${attempt}/${this.aggregatorRetries}) for ${feedUrl} after ${delay}ms`);
            }
            await new Promise(resolve => setTimeout(resolve, delay));
          }
          
          const aggregatorResponse = await this.fetchWithTimeout(
            `${aggregatorUrl}?url=${encodeURIComponent(feedUrl)}`, 
            timeout
          );
          
          if (aggregatorResponse.ok) {
            xmlContent = await aggregatorResponse.text();
            if (attempt > 1 && this.isDev) {
              console.log(`[RSS Processor] Aggregator succeeded on attempt ${attempt} for ${feedUrl}`);
            }
            break; // Success, exit retry loop
          } else {
            // Non-2xx status - only retry on 5xx errors (server errors)
            // 404 means function not deployed - fail gracefully
            if (aggregatorResponse.status === 404) {
              if (this.isDev) {
                console.warn(`[RSS Processor] Netlify function not found (404) for ${feedUrl}. RSS aggregator function must be deployed.`);
              }
              lastError = new Error(`Netlify function not deployed (404)`);
              break; // Don't retry 404s
            }
            const isRetryable = aggregatorResponse.status >= 500 && aggregatorResponse.status < 600;
            if (!isRetryable || attempt === this.aggregatorRetries) {
              throw new Error(`Aggregator error: ${aggregatorResponse.status} ${aggregatorResponse.statusText}`);
            }
            lastError = new Error(`Aggregator error: ${aggregatorResponse.status} ${aggregatorResponse.statusText}`);
          }
        } catch (aggregatorError) {
          lastError = aggregatorError;
          
          // If it's a 404 (function not deployed), fail gracefully
          if (aggregatorError.message && aggregatorError.message.includes('404')) {
            if (this.isDev) {
              console.warn(`[RSS Processor] Netlify function not deployed (404) for ${feedUrl}. RSS aggregator function must be deployed.`);
            }
            break; // Don't retry 404s
          }
          
          // Check if error is retryable (network/timeout errors)
          const isRetryable = aggregatorError.message.includes('timeout') || 
                             aggregatorError.message.includes('Failed to fetch') ||
                             aggregatorError.name === 'TypeError' ||
                             aggregatorError.name === 'AbortError';
          
          if (!isRetryable || attempt === this.aggregatorRetries) {
            // Not retryable or last attempt - break and fail gracefully
            break;
          }
          
          // Continue to next retry attempt
          if (this.isDev) {
            console.warn(`[RSS Processor] Aggregator attempt ${attempt} failed (retryable):`, aggregatorError.message);
          }
          }
        }
      }
      
      // If aggregator failed after all retries, fail gracefully without direct fetch
      if (!xmlContent) {
        if (this.isDev) {
          console.warn(`[RSS Processor] Aggregator failed for ${feedUrl} after retries. Returning empty results. Direct fetch is disabled for performance.`, lastError?.message);
        }
        if (onProgress) onProgress({ feedUrl, status: 'error', error: lastError?.message || 'Aggregator unavailable' });
        return []; // Return empty array instead of attempting direct fetch
      }

      if (!xmlContent) throw new Error('Empty feed content');

      if (onProgress) onProgress({ feedUrl, status: 'parsing' });

      // Check if this is a text-based feed (like OpenPhish)
      const trimmed = String(xmlContent).trim();
      const isTextBasedFeed = isTextFeed(feedConfig) || (!trimmed.startsWith('<') && !trimmed.startsWith('<?xml'));
      
      if (isTextBasedFeed) {
        // Parse as text feed
        try {
          const textItems = parseTextFeed(xmlContent, feedConfig);
          
          if (onProgress) onProgress({ feedUrl, status: 'success', items: textItems.length });
          
          // Cache the result
          this.cache.set(feedUrl, {
            data: textItems,
            timestamp: Date.now()
          });
          
          return textItems;
        } catch (textError) {
          if (this.isDev) {
            console.warn(`[RSS Feed] Failed to parse text feed ${feedUrl}:`, textError.message);
          }
          throw new Error(`Text feed parsing error: ${textError.message}`);
        }
      }

      // Quick sniff: some sites return HTML or plain text when blocked.
      if (!trimmed.startsWith('<') && !trimmed.startsWith('<?xml')) {
        throw new Error('Non-XML response (likely blocked or not an RSS/Atom feed)');
      }

      // Parse XML (simple parser - in production use proper XML parser)
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(xmlContent, 'text/xml');

      // Check for parsing errors
      const parseError = xmlDoc.querySelector('parsererror');
      if (parseError) {
        // Extract more details about the parsing error
        const errorText = parseError.textContent || 'Unknown XML parsing error';
        const errorDetails = errorText.substring(0, 200); // Limit error message length
        throw new Error(`XML parsing error: ${errorDetails}`);
      }

      // Extract items (RSS `<item>` or Atom `<entry>`)
      const rssItems = Array.from(xmlDoc.querySelectorAll('item')).map(item => ({
        title: item.querySelector('title')?.textContent || '',
        description: item.querySelector('description')?.textContent || '',
        content: item.querySelector('content\\:encoded')?.textContent || item.querySelector('description')?.textContent || '',
        link: item.querySelector('link')?.textContent || '',
        pubDate: item.querySelector('pubDate')?.textContent || new Date().toISOString(),
        guid: item.querySelector('guid')?.textContent || item.querySelector('link')?.textContent || ''
      }));

      const atomItems = rssItems.length
        ? []
        : Array.from(xmlDoc.querySelectorAll('entry')).map(entry => {
            const linkEl = entry.querySelector('link[rel="alternate"]') || entry.querySelector('link');
            const link = linkEl?.getAttribute?.('href') || linkEl?.textContent || '';
            return {
              title: entry.querySelector('title')?.textContent || '',
              description: entry.querySelector('summary')?.textContent || entry.querySelector('content')?.textContent || '',
              content: entry.querySelector('content')?.textContent || entry.querySelector('summary')?.textContent || '',
              link,
              pubDate:
                entry.querySelector('published')?.textContent ||
                entry.querySelector('updated')?.textContent ||
                new Date().toISOString(),
              guid: entry.querySelector('id')?.textContent || link || ''
            };
          });

      const items = rssItems.length ? rssItems : atomItems;

      if (onProgress) onProgress({ feedUrl, status: 'success', items: items.length });

      // Cache the result
      this.cache.set(feedUrl, {
        data: items,
        timestamp: Date.now()
      });

      return items;
    } catch (error) {
      // Log warning instead of error for CORS/network issues (expected in browser)
      const message = error?.message || '';
      if (message.includes('timeout') || message.includes('aborted')) {
        if (this.isDev) console.warn(`[RSS Feed] Timeout fetching ${feedUrl} after ${timeout}ms`);
        if (onProgress) onProgress({ feedUrl, status: 'timeout', error: error.message });
      } else if (message.includes('Failed to fetch') || error.name === 'TypeError') {
        if (this.isDev) console.warn(`[RSS Feed] Could not fetch ${feedUrl} - CORS or network issue`);
        if (onProgress) onProgress({ feedUrl, status: 'network_error', error: error.message });
      } else if (message.includes('Proxy error') || message.includes('XML parsing error') || message.includes('Non-XML response')) {
        if (this.isDev) console.warn(`[RSS Feed] Skipping ${feedUrl}: ${message}`);
        if (onProgress) onProgress({ feedUrl, status: 'skipped', error: error.message });
      } else {
        if (this.isDev) console.error(`[RSS Feed] Error fetching ${feedUrl}:`, error);
        if (onProgress) onProgress({ feedUrl, status: 'error', error: error.message });
      }
      // Return empty array on error to prevent breaking the app
      return [];
    }
  }

  /**
   * Determine severity from title and description
   */
  determineSeverity(title, description) {
    const text = `${title} ${description}`.toLowerCase();

    // Check for critical keywords
    if (severityKeywords.critical.some(keyword => text.includes(keyword))) {
      return 'critical';
    }
    // Check for high keywords
    if (severityKeywords.high.some(keyword => text.includes(keyword))) {
      return 'high';
    }
    // Check for medium keywords
    if (severityKeywords.medium.some(keyword => text.includes(keyword))) {
      return 'medium';
    }
    // Default to low
    return 'low';
  }

  /**
   * Extract tags from content
   */
  extractTags(title, description) {
    const text = `${title} ${description}`.toLowerCase();
    const tags = [];

    const tagKeywords = {
      'password': ['password', 'credential', 'login'],
      'email': ['email', 'phishing', 'spam'],
      'social-media': ['facebook', 'twitter', 'instagram', 'tiktok', 'social media', 'social network'],
      'mobile': ['mobile', 'smartphone', 'android', 'ios', 'iphone', 'app'],
      'financial': ['bank', 'credit card', 'financial', 'payment', 'paypal', 'venmo'],
      'children': ['children', 'kids', 'parental', 'teen', 'child'],
      'government': ['government', 'regulation', 'law', 'policy', 'gdpr', 'ccpa', 'hipaa', 'coppa', 'pipeda', 'lgpd', 'ferpa', 'glba'],
      'data-breach': ['breach', 'leak', 'exposed', 'hacked', 'compromised'],
      'privacy': ['privacy', 'data collection', 'tracking', 'surveillance'],
      // Regulation-specific tags
      'gdpr': ['gdpr', 'general data protection regulation', 'eu privacy', 'european union privacy'],
      'ccpa': ['ccpa', 'california consumer privacy act', 'california privacy'],
      'hipaa': ['hipaa', 'health insurance portability', 'healthcare privacy', 'phi', 'protected health information'],
      'coppa': ['coppa', 'children\'s online privacy protection', 'children privacy', 'kids privacy'],
      'pipeda': ['pipeda', 'personal information protection', 'canadian privacy'],
      'lgpd': ['lgpd', 'lei geral de proteção de dados', 'brazil privacy', 'brazilian privacy'],
      'ferpa': ['ferpa', 'family educational rights', 'student privacy', 'education privacy'],
      'glba': ['glba', 'gramm-leach-bliley', 'financial privacy', 'banking privacy']
    };

    Object.keys(tagKeywords).forEach(tag => {
      if (tagKeywords[tag].some(keyword => text.includes(keyword))) {
        tags.push(tag);
      }
    });

    return tags;
  }

  /**
   * Match alert to services using keywords
   */
  matchToServices(alert) {
    const text = `${alert.title} ${alert.description}`.toLowerCase();
    const matchedServices = [];

    Object.keys(serviceKeywordMap).forEach(serviceId => {
      const keywords = serviceKeywordMap[serviceId];
      if (keywords.some(keyword => text.includes(keyword.toLowerCase()))) {
        matchedServices.push(serviceId);
      }
    });

    return matchedServices;
  }

  /**
   * Determine which personas should see this alert
   */
  matchToPersonas(alert) {
    const personas = new Set();

    // Add personas based on category
    if (categoryPersonaMapping[alert.category]) {
      categoryPersonaMapping[alert.category].forEach(persona => personas.add(persona));
    }

    // Add personas based on matched services
    alert.relatedServices.forEach(serviceId => {
      const service = serviceCatalog.find(s => s.id === serviceId);
      if (service) {
        // Match personas based on service category
        const serviceCategoryPersonas = {
          'social-media': ['social-influencer', 'cautious-parent', 'digital-novice'],
          'search-email': ['privacy-advocate', 'private-individual', 'digital-novice'],
          'shopping': ['online-shopper', 'private-individual'],
          'messaging': ['cautious-parent', 'social-influencer', 'private-individual'],
          'streaming': ['cautious-parent', 'social-influencer'],
          'cloud-storage': ['privacy-advocate', 'private-individual'],
          'financial': ['online-shopper', 'private-individual'],
          'lifestyle': ['private-individual', 'online-shopper'],
          'dating': ['private-individual', 'social-influencer']
        };

        if (serviceCategoryPersonas[service.category]) {
          serviceCategoryPersonas[service.category].forEach(persona => personas.add(persona));
        }
      }
    });

    return Array.from(personas);
  }

  /**
   * Convert RSS item to caution alert with AI phishing detection
   */
  extractAlert(rssItem, feedConfig) {
    const alert = {
      title: rssItem.title || 'Untitled Alert',
      description: rssItem.description || rssItem.content || '',
      content: rssItem.content || rssItem.description || '',
      source: {
        name: feedConfig.name,
        url: feedConfig.url
      },
      publishedDate: this.parseDate(rssItem.pubDate) || new Date().toISOString(),
      category: feedConfig.category || 'general-security',
      link: rssItem.link || '',
      rssFeedId: feedConfig.id,
      tags: []
    };

    // Determine severity
    alert.severity = this.determineSeverity(alert.title, alert.description);

    // Extract tags
    alert.tags = this.extractTags(alert.title, alert.description);

    // Match to services
    alert.relatedServices = this.matchToServices(alert);

    // Match to personas
    alert.personas = this.matchToPersonas(alert);

    // Generate unique ID
    alert.id = `alert-${feedConfig.id}-${rssItem.guid || Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    // Run AI phishing detection on the content
    const messageContent = `${alert.title}\n\n${alert.description}`;
    const aiRisk = analyzeMessageForPhishingRisk(messageContent);
    
    // Add AI risk metadata to alert
    if (aiRisk.isPotentialThreat) {
      alert.aiDetection = {
        riskScore: aiRisk.riskScore,
        isPotentialThreat: true,
        reasons: aiRisk.reasons,
        analyzedAt: new Date().toISOString()
      };
      
      // Upgrade severity if AI detection finds high risk
      if (aiRisk.riskScore >= 80 && alert.severity !== 'critical') {
        alert.severity = 'critical';
        alert.tags.push('ai-verified-threat');
      } else if (aiRisk.riskScore >= 60 && ['low', 'medium'].includes(alert.severity)) {
        alert.severity = 'high';
        alert.tags.push('ai-suspicious');
      }
    }

    return createAlert(alert);
  }

  /**
   * Parse date string to ISO format
   */
  parseDate(dateString) {
    if (!dateString) return null;
    try {
      const date = new Date(dateString);
      return isNaN(date.getTime()) ? null : date.toISOString();
    } catch (error) {
      return null;
    }
  }

  /**
   * Process a single RSS feed
   */
  async processFeed(feedConfig, options = {}) {
    const { onProgress } = options;
    
    try {
      if (onProgress) {
        onProgress({ feedId: feedConfig.id, feedName: feedConfig.name, status: 'processing' });
      }
      
      const feedItems = await this.fetchAndParseFeed(feedConfig.url, {
        timeout: 15000,
        feedConfig: feedConfig,
        onProgress: (progress) => {
          if (onProgress) {
            onProgress({ 
              feedId: feedConfig.id, 
              feedName: feedConfig.name, 
              fetchStatus: progress.status,
              error: progress.error
            });
          }
        }
      });
      
      if (!feedItems || feedItems.length === 0) {
        // Only log if it's not a silent failure (empty feed vs fetch error)
        // The fetchAndParseFeed already logs fetch errors
        if (onProgress) {
          onProgress({ feedId: feedConfig.id, feedName: feedConfig.name, status: 'empty' });
        }
        return { success: true, alerts: [], count: 0, feedId: feedConfig.id, feedName: feedConfig.name };
      }

      if (onProgress) {
        onProgress({ feedId: feedConfig.id, feedName: feedConfig.name, status: 'extracting', itemCount: feedItems.length });
      }

      const alerts = feedItems
        .map(item => this.extractAlert(item, feedConfig))
        .filter(alert => alert !== null);

      if (onProgress) {
        onProgress({ feedId: feedConfig.id, feedName: feedConfig.name, status: 'complete', alertCount: alerts.length });
      }
      
      return {
        success: true,
        alerts,
        count: alerts.length,
        feedId: feedConfig.id,
        feedName: feedConfig.name
      };
    } catch (error) {
      console.error(`Error processing feed ${feedConfig.name}:`, error);
      if (onProgress) {
        onProgress({ feedId: feedConfig.id, feedName: feedConfig.name, status: 'error', error: error.message });
      }
      return {
        success: false,
        alerts: [],
        count: 0,
        error: error.message,
        feedId: feedConfig.id,
        feedName: feedConfig.name
      };
    }
  }

  /**
   * Check if RSS aggregator API is available (same path used by feed fetches: /api/rss-aggregator)
   */
  async checkNetlifyFunctionsAvailable() {
    try {
      const testUrl = '/api/rss-aggregator?url=https://example.com';
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);
      const response = await fetch(testUrl, { method: 'GET', signal: controller.signal });
      clearTimeout(timeoutId);
      const contentType = response.headers.get('content-type') || '';
      if (response.status === 404) return false;
      // If we get HTML back, SPA or redirect is serving the route (function not deployed)
      if (contentType.includes('text/html')) return false;
      return response.ok;
    } catch (error) {
      return false;
    }
  }

  /**
   * Process all active RSS feeds
   * @param {Object} options - Processing options
   * @param {Function} options.onProgress - Callback for progress updates
   * @param {number} options.maxConcurrent - Maximum concurrent feed fetches (default: 3)
   * @param {number} options.feedDelay - Delay between feed batches in ms (default: 500)
   */
  async processAllFeeds(options = {}) {
    const { onProgress, maxConcurrent = 3, feedDelay = 500 } = options;
    const activeFeeds = rssFeeds.filter(feed => feed.isActive);

    // Always check aggregator availability first (dev and production) to avoid N 404s
    const functionsAvailable = await this.checkNetlifyFunctionsAvailable();
    if (!functionsAvailable) {
      this._aggregatorUnavailable = true;
      const errorMessage = this.isDev
        ? 'RSS feeds require Netlify Functions. Run "netlify dev" instead of "npm run dev" for full functionality.'
        : 'RSS aggregator is not available. Deploy with Netlify (or provide /api/rss-aggregator) to enable feed updates.';
      if (this.isDev) {
        console.warn(`[RSS Processor] ${errorMessage}`);
      }
      if (onProgress) {
        onProgress({
          status: 'error',
          error: errorMessage,
          totalFeeds: activeFeeds.length,
          completed: 0,
          failed: activeFeeds.length
        });
      }
      return {
        results: [],
        allAlerts: [],
        totalFeeds: activeFeeds.length,
        successfulFeeds: 0,
        totalAlerts: 0,
        errors: [{
          feed: 'System',
          error: errorMessage,
          hint: this.isDev ? 'Run: netlify dev' : 'Deploy site with Netlify to enable RSS feeds.'
        }]
      };
    }
    
    if (onProgress) {
      onProgress({ 
        status: 'starting', 
        totalFeeds: activeFeeds.length,
        completed: 0,
        failed: 0
      });
    }
    
    if (this.isDev) console.log(`Processing ${activeFeeds.length} active RSS feeds (max ${maxConcurrent} concurrent)`);

    const results = [];
    const errors = [];
    
    // Process feeds in batches to avoid overwhelming the proxy
    for (let i = 0; i < activeFeeds.length; i += maxConcurrent) {
      const batch = activeFeeds.slice(i, i + maxConcurrent);
      
      // Process batch in parallel
      const batchPromises = batch.map(feed => 
        this.processFeed(feed, { onProgress })
      );
      
      const batchResults = await Promise.allSettled(batchPromises);
      
      batchResults.forEach((result, index) => {
        if (result.status === 'fulfilled') {
          results.push(result.value);
          if (!result.value.success) {
            errors.push({ feed: batch[index].name, error: result.value.error });
          }
        } else {
          errors.push({ feed: batch[index].name, error: result.reason?.message || 'Unknown error' });
          results.push({
            success: false,
            alerts: [],
            count: 0,
            feedId: batch[index].id,
            feedName: batch[index].name,
            error: result.reason?.message || 'Unknown error'
          });
        }
      });
      
      if (onProgress) {
        const completed = results.length;
        const successful = results.filter(r => r.success).length;
        onProgress({
          status: 'progress',
          totalFeeds: activeFeeds.length,
          completed,
          successful,
          failed: completed - successful,
          currentBatch: batch.map(f => f.name)
        });
      }
      
      // Small delay between batches to be respectful to the proxy
      if (i + maxConcurrent < activeFeeds.length) {
        await new Promise(resolve => setTimeout(resolve, feedDelay));
      }
    }

    const allAlerts = results.flatMap(result => result.alerts || []);
    const successCount = results.filter(r => r.success).length;

    if (onProgress) {
      onProgress({
        status: 'complete',
        totalFeeds: activeFeeds.length,
        completed: results.length,
        successful: successCount,
        failed: results.length - successCount,
        totalAlerts: allAlerts.length,
        errors: errors.length > 0 ? errors : undefined
      });
    }

    if (this.isDev) console.log(`Processed ${successCount}/${activeFeeds.length} feeds, generated ${allAlerts.length} alerts`);
    if (errors.length > 0) {
      if (this.isDev) console.warn(`Failed feeds:`, errors);
    }

    return {
      results,
      allAlerts,
      totalFeeds: activeFeeds.length,
      successfulFeeds: successCount,
      totalAlerts: allAlerts.length,
      errors: errors.length > 0 ? errors : undefined
    };
  }

  /**
   * Clean up old alerts (older than specified days)
   */
  cleanupOldAlerts(alerts, daysToKeep = 90) {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);

    return alerts.filter(alert => {
      const alertDate = new Date(alert.publishedDate);
      return alertDate >= cutoffDate;
    });
  }

  /**
   * Merge new alerts with existing ones, avoiding duplicates
   */
  mergeAlerts(existingAlerts, newAlerts) {
    const existingIds = new Set(existingAlerts.map(a => a.id));
    const existingLinks = new Set(existingAlerts.map(a => a.link).filter(Boolean));

    const uniqueNewAlerts = newAlerts.filter(alert => {
      // Check by ID
      if (existingIds.has(alert.id)) return false;
      // Check by link (if both have links)
      if (alert.link && existingLinks.has(alert.link)) return false;
      return true;
    });

    return [...existingAlerts, ...uniqueNewAlerts].sort((a, b) => {
      return new Date(b.publishedDate) - new Date(a.publishedDate);
    });
  }
}

export const rssFeedProcessor = new RSSFeedProcessor();

