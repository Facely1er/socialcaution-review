/**
 * Resilient RSS Fetcher - Netlify Function fallback
 * Used when primary RSS processor fails and store is empty
 * Uses enhanced RSS aggregator (Netlify Function) - NO direct fetching
 */

interface RSSItem {
  id: string;
  title: string;
  description: string;
  link?: string;
  pubDate?: string;
  publishedDate?: string;
}

interface RSSFeed {
  id: string;
  name: string;
  url: string;
  category: string;
  items: RSSItem[];
}

// XML parsing is now handled by enhancedRSSAggregator (uses Netlify Function)

/**
 * Fetch a single RSS feed using enhanced aggregator (Netlify Function)
 * Direct fetching is disabled for performance and CORS reasons
 */
const fetchFeedViaAggregator = async (
  feedConfig: { id: string; name: string; url: string; category: string }
): Promise<RSSItem[]> => {
  try {
    // Use enhanced RSS aggregator (uses Netlify Function, no direct fetching)
    const { enhancedRSSAggregator } = await import('./enhancedRSSAggregator');
    
    const result = await enhancedRSSAggregator.fetchFeed({
      id: feedConfig.id,
      name: feedConfig.name,
      url: feedConfig.url,
      category: feedConfig.category
    });

    if (result.success && result.items.length > 0) {
      // Convert to RSSItem format
      return result.items.map(item => ({
        id: item.id,
        title: item.title,
        description: item.description,
        link: item.link,
        pubDate: item.pubDate,
        publishedDate: item.publishedDate || item.pubDate
      }));
    }

    return [];
  } catch (error) {
    if (import.meta.env.DEV) {
      console.warn(`[Resilient RSS] Failed to fetch ${feedConfig.name} via aggregator:`, error);
    }
    return [];
  }
};

/**
 * Get a reduced set of priority feeds for fallback mode
 * Only includes feeds that are most likely to work without Netlify Functions
 */
const getPriorityFeeds = () => {
  // These are feeds that typically allow CORS or have public access
  const priorityFeedIds = [
    // Add specific feed IDs that work well in fallback mode
    // This should be configured based on your actual RSS feeds
  ];

  return priorityFeedIds;
};

/**
 * Resilient RSS fetcher - fetches feeds directly when store is empty
 * Only runs once per session to avoid excessive requests
 */
class ResilientRSSFetcher {
  private hasRun = false;
  private isRunning = false;
  private readonly maxFeeds = 5; // Increased for better coverage
  private readonly timeout = 10000; // Increased timeout for better success rate

  /**
   * Check if we should run the fallback fetcher
   */
  shouldRun(storeAlertCount: number): boolean {
    // Only run if:
    // 1. Store is empty
    // 2. Haven't run before in this session (or was reset)
    // 3. Not currently running
    return storeAlertCount === 0 && !this.hasRun && !this.isRunning;
  }
  
  /**
   * Force run (bypasses hasRun check) - useful when aggregator is unavailable
   */
  canForceRun(storeAlertCount: number): boolean {
    return storeAlertCount === 0 && !this.isRunning;
  }

  /**
   * Fetch a reduced set of RSS feeds directly
   */
  async fetchReducedFeeds(feedConfigs: Array<{ id: string; name: string; url: string; category: string }>): Promise<{
    alerts: Array<{
      id: string;
      title: string;
      description: string;
      link?: string;
      pubDate?: string;
      category: string;
      source: string;
    }>;
    successCount: number;
    errorCount: number;
  }> {
    if (this.isRunning) {
      if (import.meta.env.DEV) {
        console.log('[Resilient RSS] Already running, skipping duplicate request');
      }
      return { alerts: [], successCount: 0, errorCount: 0 };
    }

    this.isRunning = true;
    // Don't mark hasRun until we actually complete (success or failure)

    const alerts: Array<{
      id: string;
      title: string;
      description: string;
      link?: string;
      pubDate?: string;
      category: string;
      source: string;
    }> = [];
    let successCount = 0;
    let errorCount = 0;

    try {
      // Take only the first N feeds (reduced set)
      const feedsToFetch = feedConfigs.slice(0, this.maxFeeds);

      if (import.meta.env.DEV) {
        console.log(`[Resilient RSS] Fetching ${feedsToFetch.length} feeds via Netlify Function (fallback mode)`);
      }

      // Fetch feeds sequentially to avoid overwhelming
      for (const feed of feedsToFetch) {
        try {
          const items = await fetchFeedViaAggregator(feed);
          
          if (items.length > 0) {
            // Convert to alert format
            items.forEach(item => {
              // Only include recent items (last 7 days)
              // If no date, assume it's recent and include it
              const itemDate = item.pubDate || item.publishedDate;
              let shouldInclude = false;
              
              if (itemDate) {
                // Try parsing the date - RSS dates can be in various formats
                let date: Date;
                try {
                  date = new Date(itemDate);
                  // If parsing failed, try a more lenient approach
                  if (isNaN(date.getTime())) {
                    // Try parsing common RSS date formats
                    const cleaned = itemDate.replace(/GMT|UTC|EST|EDT|PST|PDT/g, '').trim();
                    date = new Date(cleaned);
                  }
                } catch {
                  date = new Date(); // Fallback to current date
                }
                
                const sevenDaysAgo = Date.now() - (7 * 24 * 60 * 60 * 1000);
                // If date is still invalid, assume recent
                if (isNaN(date.getTime()) || date.getTime() > sevenDaysAgo) {
                  shouldInclude = true;
                }
              } else {
                // No date - assume recent and include (better than showing nothing)
                shouldInclude = true;
              }
              
              if (shouldInclude) {
                alerts.push({
                  id: `resilient-${feed.id}-${item.id}`,
                  title: item.title,
                  description: item.description || '',
                  link: item.link,
                  pubDate: itemDate || new Date().toISOString(),
                  category: feed.category,
                  source: feed.name
                });
              }
            });
            successCount++;
          } else {
            errorCount++;
          }
        } catch (error) {
          errorCount++;
          if (import.meta.env.DEV) {
            console.warn(`[Resilient RSS] Failed to fetch ${feed.name}:`, error);
          }
        }

        // Small delay between feeds
        if (feedsToFetch.indexOf(feed) < feedsToFetch.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 500));
        }
      }

      if (import.meta.env.DEV) {
        console.log(`[Resilient RSS] Fallback fetch complete: ${successCount} successful, ${errorCount} failed, ${alerts.length} alerts`);
      }
      
      // Mark as run only after completion
      this.hasRun = true;
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error('[Resilient RSS] Error in fallback fetch:', error);
      }
      // Mark as run even on error to prevent infinite retries
      this.hasRun = true;
    } finally {
      this.isRunning = false;
    }

    return { alerts, successCount, errorCount };
  }

  /**
   * Reset the fetcher (for testing or manual retry)
   */
  reset(): void {
    this.hasRun = false;
    this.isRunning = false;
  }
}

export const resilientRSSFetcher = new ResilientRSSFetcher();
