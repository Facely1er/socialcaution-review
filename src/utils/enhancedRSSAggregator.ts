/**
 * Enhanced RSS Aggregator - Server-Side Only
 * 
 * Performance-optimized RSS aggregator that uses ONLY the Netlify Function for fetching.
 * Direct fetching is disabled to avoid CORS issues and performance problems.
 * 
 * Strategy:
 * 1. Check cache (30-minute TTL)
 * 2. Use Netlify Function (server-side, no CORS)
 * 3. Fallback to stale cache if function unavailable
 * 
 * Note: For local development, run "netlify dev" instead of "npm run dev"
 * to enable the Netlify Function.
 */

interface RSSFeedConfig {
  id: string;
  name: string;
  url: string;
  category: string;
}

interface RSSItem {
  id: string;
  title: string;
  description: string;
  link?: string;
  pubDate?: string;
  publishedDate?: string;
  category: string;
  source: string;
}

interface AggregatorResult {
  items: RSSItem[];
  source: 'netlify-function' | 'cache';
  success: boolean;
  error?: string;
  timestamp: number;
}

class EnhancedRSSAggregator {
  private cache: Map<string, { data: RSSItem[]; timestamp: number }> = new Map();
  private readonly CACHE_DURATION = 30 * 60 * 1000; // 30 minutes
  private readonly NETLIFY_FUNCTION_URL = '/api/rss-aggregator';
  /** When true, API returned 404/unavailable; skip further requests this session */
  private _aggregatorUnavailable = false;

  /**
   * Fetch RSS feed with server-side Netlify Function (primary method only)
   * Direct fetching is disabled for performance and CORS reasons
   */
  async fetchFeed(feedConfig: RSSFeedConfig): Promise<AggregatorResult> {
    const { id, url, name, category } = feedConfig;

    if (this._aggregatorUnavailable) {
      const cached = this.cache.get(id);
      if (cached) {
        return { items: cached.data, source: 'cache', success: true, timestamp: cached.timestamp };
      }
      return {
        items: [],
        source: 'netlify-function',
        success: false,
        error: 'RSS aggregator not available',
        timestamp: Date.now()
      };
    }

    // Strategy 1: Check cache first (30-minute cache)
    const cached = this.cache.get(id);
    if (cached && Date.now() - cached.timestamp < this.CACHE_DURATION) {
      if (import.meta.env.DEV) {
        console.debug(`[Enhanced RSS] Cache hit for ${name} (${id})`);
      }
      return {
        items: cached.data,
        source: 'cache',
        success: true,
        timestamp: cached.timestamp
      };
    }

    // Strategy 2: Try Netlify Function (ONLY method - no direct fetching)
    const netlifyResult = await this.tryNetlifyFunction(url);
    if (netlifyResult.success && netlifyResult.items.length > 0) {
      const items = this.processFeedItems(netlifyResult.items, id, name, category);
      this.cache.set(id, { data: items, timestamp: Date.now() });
      if (import.meta.env.DEV) {
        console.debug(`[Enhanced RSS] Netlify function success for ${name}: ${items.length} items`);
      }
      return {
        items,
        source: 'netlify-function',
        success: true,
        timestamp: Date.now()
      };
    }

    // Netlify Function failed - return cached data if available (even if stale)
    if (cached) {
      if (import.meta.env.DEV) {
        console.warn(`[Enhanced RSS] Netlify function failed for ${name}, using stale cache`);
      }
      return {
        items: cached.data,
        source: 'cache',
        success: true,
        timestamp: cached.timestamp,
        error: 'Netlify function unavailable, using stale cache'
      };
    }

    // No cache available and Netlify Function failed
    if (import.meta.env.DEV) {
      console.warn(`[Enhanced RSS] Netlify function failed for ${name} and no cache available`);
    }
    return {
      items: [],
      source: 'netlify-function',
      success: false,
      error: 'Netlify function unavailable and no cache available. Run "netlify dev" for local development.',
      timestamp: Date.now()
    };
  }

  /**
   * Strategy 1: Netlify Function (primary)
   */
  private async tryNetlifyFunction(feedUrl: string): Promise<{ success: boolean; items: Array<{ id: string; title: string; description: string; link?: string; pubDate?: string }> }> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 seconds (matches function timeout)

      const response = await fetch(
        `${this.NETLIFY_FUNCTION_URL}?url=${encodeURIComponent(feedUrl)}`,
        {
          signal: controller.signal,
          headers: {
            'Accept': 'application/xml, text/xml, */*'
          }
        }
      );

      clearTimeout(timeoutId);

      if (response.ok) {
        const contentType = response.headers.get('content-type') || '';
        if (contentType.includes('text/html')) {
          // SPA redirect intercepted - function not available (404)
          this._aggregatorUnavailable = true;
          if (import.meta.env.DEV) {
            console.warn('[Enhanced RSS] Netlify function not available (404) - run "netlify dev" for local development');
          }
          return { success: false, items: [] };
        }

        const xmlText = await response.text();
        const items = this.parseRSSXML(xmlText);
        return { success: true, items };
      }

      // Handle specific error status codes
      if (response.status === 404) {
        this._aggregatorUnavailable = true;
        if (import.meta.env.DEV) {
          console.warn('[Enhanced RSS] Netlify function not found (404) - ensure function is deployed');
        }
      } else if (response.status === 504) {
        if (import.meta.env.DEV) {
          console.warn('[Enhanced RSS] Netlify function timeout (504)');
        }
      }

      return { success: false, items: [] };
    } catch (error) {
      if (import.meta.env.DEV) {
        if (error instanceof Error && error.name === 'AbortError') {
          console.warn('[Enhanced RSS] Request timeout (10s)');
        } else {
          console.debug('[Enhanced RSS] Netlify function failed:', error);
        }
      }
      return { success: false, items: [] };
    }
  }

  /**
   * Direct fetching is DISABLED for performance and CORS reasons
   * All feeds must go through the Netlify Function
   */

  /**
   * Parse RSS/Atom XML
   */
  private parseRSSXML(xmlText: string): Array<{ id: string; title: string; description: string; link?: string; pubDate?: string }> {
    const items: Array<{ id: string; title: string; description: string; link?: string; pubDate?: string }> = [];
    
    try {
      const parser = new DOMParser();
      const doc = parser.parseFromString(xmlText, 'text/xml');
      
      // Check for parsing errors
      const parseError = doc.querySelector('parsererror');
      if (parseError) {
        if (import.meta.env.DEV) {
          console.warn('[Enhanced RSS] XML parse error:', parseError.textContent);
        }
        return items;
      }

      // Try RSS 2.0 format
      const rssItems = doc.querySelectorAll('item');
      if (rssItems.length > 0) {
        rssItems.forEach((item, index) => {
          const title = item.querySelector('title')?.textContent || '';
          const description = item.querySelector('description')?.textContent || '';
          const link = item.querySelector('link')?.textContent || '';
          const pubDate = item.querySelector('pubDate')?.textContent || '';
          const guid = item.querySelector('guid')?.textContent || '';

          if (title) {
            items.push({
              id: guid || `rss-${index}-${Date.now()}`,
              title: title.trim(),
              description: description.trim(),
              link: link.trim() || undefined,
              pubDate: pubDate.trim() || undefined
            });
          }
        });
        return items;
      }

      // Try Atom format
      const atomEntries = doc.querySelectorAll('entry');
      if (atomEntries.length > 0) {
        atomEntries.forEach((entry, index) => {
          const title = entry.querySelector('title')?.textContent || '';
          const content = entry.querySelector('content')?.textContent || 
                         entry.querySelector('summary')?.textContent || '';
          const link = entry.querySelector('link')?.getAttribute('href') || '';
          const published = entry.querySelector('published')?.textContent ||
                           entry.querySelector('updated')?.textContent || '';
          const id = entry.querySelector('id')?.textContent || '';

          if (title) {
            items.push({
              id: id || `atom-${index}-${Date.now()}`,
              title: title.trim(),
              description: content.trim(),
              link: link.trim() || undefined,
              pubDate: published.trim() || undefined
            });
          }
        });
        return items;
      }
    } catch (error) {
      if (import.meta.env.DEV) {
        console.warn('[Enhanced RSS] Parse error:', error);
      }
    }

    return items;
  }

  /**
   * Process feed items and add metadata
   */
  private processFeedItems(
    items: Array<{ id: string; title: string; description: string; link?: string; pubDate?: string }>,
    feedId: string,
    feedName: string,
    category: string
  ): RSSItem[] {
    const sevenDaysAgo = Date.now() - (7 * 24 * 60 * 60 * 1000);

    return items
      .filter(item => {
        // Filter to last 7 days
        if (item.pubDate) {
          try {
            const itemDate = new Date(item.pubDate);
            if (!isNaN(itemDate.getTime()) && itemDate.getTime() < sevenDaysAgo) {
              return false;
            }
          } catch {
            // If date parsing fails, include it (better than nothing)
          }
        }
        return true;
      })
      .map(item => ({
        id: `enhanced-${feedId}-${item.id}`,
        title: item.title,
        description: item.description || '',
        link: item.link,
        pubDate: item.pubDate || new Date().toISOString(),
        publishedDate: item.pubDate || new Date().toISOString(),
        category,
        source: feedName
      }));
  }

  /**
   * Clear cache for a specific feed
   */
  clearCache(feedId: string): void {
    this.cache.delete(feedId);
  }

  /**
   * Clear all cache
   */
  clearAllCache(): void {
    this.cache.clear();
  }

  /**
   * Get cache status
   */
  getCacheStatus(): { [feedId: string]: { timestamp: number; age: number } } {
    const status: { [feedId: string]: { timestamp: number; age: number } } = {};
    const now = Date.now();

    this.cache.forEach((value, key) => {
      status[key] = {
        timestamp: value.timestamp,
        age: now - value.timestamp
      };
    });

    return status;
  }
}

export const enhancedRSSAggregator = new EnhancedRSSAggregator();
