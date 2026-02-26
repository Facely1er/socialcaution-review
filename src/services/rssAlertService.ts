// RSS Alert Service - Automatically loads and processes RSS feeds
// Integrates with AI phishing detection and caution store

import { rssFeedProcessor } from '../utils/rssFeedProcessor';
import { useCautionStore } from '../state/cautionStore';
import { CautionAlert } from '../types/caution';
import { resilientRSSFetcher } from '../utils/resilientRSSFetcher';
import { enhancedRSSAggregator } from '../utils/enhancedRSSAggregator';

class RSSAlertService {
  private isProcessing: boolean = false;
  private lastProcessed: Date | null = null;
  private processInterval: NodeJS.Timeout | null = null;
  private readonly DEFAULT_INTERVAL = 3600000; // 1 hour
  private readonly isDev = typeof import.meta !== 'undefined' && Boolean(import.meta.env?.DEV);
  private consecutiveFailures = 0;
  private readonly MAX_CONSECUTIVE_FAILURES = 3;
  private nextRetryDelay = 60000; // Start with 1 minute

  /**
   * Initialize the RSS alert service
   * Starts automatic feed processing on the specified interval
   */
  initialize(intervalMs: number = this.DEFAULT_INTERVAL): void {
    // Prevent duplicate initialization
    if (this.processInterval !== null) {
      if (this.isDev) console.log('[RSS Alert Service] Already initialized, skipping...');
      return;
    }
    
    if (this.isDev) console.log('[RSS Alert Service] Initializing...');
    
    // Process feeds immediately on initialization
    this.processFeedsAndUpdateStore();
    
    // Set up recurring processing with adaptive interval
    this.processInterval = setInterval(() => {
      // Use adaptive interval based on failure rate
      const adaptiveInterval = this.consecutiveFailures > 0 
        ? Math.min(intervalMs + this.nextRetryDelay, 7200000) // Max 2 hours
        : intervalMs;
      
      // Clear and reset interval if needed
      if (this.consecutiveFailures > 0 && adaptiveInterval !== intervalMs) {
        if (this.processInterval) {
          clearInterval(this.processInterval);
        }
        this.processInterval = setInterval(() => {
          this.processFeedsAndUpdateStore();
        }, adaptiveInterval);
      }
      
      this.processFeedsAndUpdateStore();
    }, intervalMs);
    
    if (this.isDev) console.log(`[RSS Alert Service] Initialized with ${intervalMs}ms interval`);
  }

  /**
   * Stop automatic feed processing
   */
  stop(): void {
    if (this.processInterval) {
      clearInterval(this.processInterval);
      this.processInterval = null;
      if (this.isDev) console.log('[RSS Alert Service] Stopped');
    }
  }

  /**
   * Process all active RSS feeds and update the caution store
   */
  async processFeedsAndUpdateStore(): Promise<void> {
    if (this.isProcessing) {
      if (this.isDev) console.log('[RSS Alert Service] Already processing, skipping...');
      return;
    }

    this.isProcessing = true;
    
    try {
      if (this.isDev) console.log('[RSS Alert Service] Starting feed processing...');
      const startTime = Date.now();
      
      // Process all feeds using primary method
      let result = await rssFeedProcessor.processAllFeeds();
      
      // If primary method fails or returns no alerts, try enhanced aggregator
      if (result.totalAlerts === 0 || (result.errors && result.errors.length > 0)) {
        if (this.isDev) {
          console.log('[RSS Alert Service] Primary method returned no alerts, trying enhanced aggregator...');
        }
        
        try {
          const enhancedResult = await this.tryEnhancedAggregator();
          if (enhancedResult.totalAlerts > 0) {
            // Merge enhanced results with primary results
            result = {
              ...result,
              totalAlerts: result.totalAlerts + enhancedResult.totalAlerts,
              successfulFeeds: result.successfulFeeds + enhancedResult.successfulFeeds,
              allAlerts: [...result.allAlerts, ...enhancedResult.allAlerts],
              errors: [...(result.errors || []), ...(enhancedResult.errors || [])]
            };
            
            if (this.isDev) {
              console.log(`[RSS Alert Service] Enhanced aggregator added ${enhancedResult.totalAlerts} alerts`);
            }
          }
        } catch (enhancedError) {
          if (this.isDev) {
            console.warn('[RSS Alert Service] Enhanced aggregator failed:', enhancedError);
          }
        }
      }
      
      if (this.isDev) {
        console.log('[RSS Alert Service] Feed processing result:', {
          totalFeeds: result.totalFeeds,
          successfulFeeds: result.successfulFeeds,
          totalAlerts: result.totalAlerts,
          errors: result.errors
        });
      }

      // Check if there were errors (e.g., Netlify Functions not available)
      let aggregatorUnavailable = false;
      if (result.errors && result.errors.length > 0) {
        const netlifyError = result.errors.find(e => 
          e.error && (e.error.includes('Netlify Functions') || 
                      e.error.includes('404') || 
                      e.error.includes('aggregator function not deployed') ||
                      e.error.includes('RSS aggregator function') ||
                      e.error.includes('netlify dev'))
        );
        if (netlifyError) {
          aggregatorUnavailable = true;
          if (this.isDev) {
            console.warn('[RSS Alert Service] Netlify Functions not available. RSS feeds require "netlify dev" to run. Will attempt resilient fallback.');
            console.warn('[RSS Alert Service] Error details:', netlifyError);
          }
        }
      }
      
      // Also check if all feeds failed and we got no alerts - might indicate aggregator unavailable
      if (result.totalFeeds > 0 && result.successfulFeeds === 0 && result.totalAlerts === 0) {
        aggregatorUnavailable = true;
        if (this.isDev) {
          console.warn('[RSS Alert Service] All feeds failed - aggregator may be unavailable. Will attempt resilient fallback.');
        }
      }
      
      // In dev mode, if we have no alerts and no feeds were attempted, assume aggregator unavailable
      if (this.isDev && result.totalFeeds === 0 && result.totalAlerts === 0) {
        aggregatorUnavailable = true;
        if (this.isDev) {
          console.warn('[RSS Alert Service] No feeds processed - aggregator may be unavailable. Will attempt resilient fallback.');
        }
      }
      
      // Convert to CautionAlert format
      const cautionAlerts: CautionAlert[] = result.allAlerts.map(alert => 
        this.convertToRSSAlert(alert)
      );

      if (this.isDev) {
        console.log('[RSS Alert Service] Converted to CautionAlerts:', cautionAlerts.length);
      }

      // Filter out duplicates and add to store
      const store = useCautionStore.getState();
      const existingIds = new Set(store.alerts.map(a => a.id));
      const newAlerts = cautionAlerts.filter(alert => !existingIds.has(alert.id));

      if (newAlerts.length > 0) {
        store.addAlerts(newAlerts);
        if (this.isDev) console.log(`[RSS Alert Service] Added ${newAlerts.length} new alerts to store`);
      } else {
        if (this.isDev) {
          console.log('[RSS Alert Service] No new alerts found', {
            totalAlerts: cautionAlerts.length,
            existingInStore: store.alerts.length,
            duplicates: cautionAlerts.length - newAlerts.length
          });
        }

        // Fallback: If store is empty and we got no alerts (or aggregator unavailable), try resilient fetcher (uses Netlify Function)
        const currentStoreCount = useCautionStore.getState().alerts.length;
        const shouldTryFallback = (currentStoreCount === 0 && result.totalAlerts === 0) || aggregatorUnavailable;
        
        if (shouldTryFallback) {
          // If aggregator is unavailable, reset the resilient fetcher to allow retry
          if (aggregatorUnavailable) {
            resilientRSSFetcher.reset();
            if (this.isDev) {
              console.log('[RSS Alert Service] Aggregator unavailable - resetting resilient fetcher for fallback');
            }
          }
          
          // Check if we should run (or bypass if aggregator unavailable)
          const canRun = aggregatorUnavailable 
            ? resilientRSSFetcher.canForceRun(currentStoreCount)
            : resilientRSSFetcher.shouldRun(currentStoreCount);
          
          if (canRun) {
            if (this.isDev) {
              console.log('[RSS Alert Service] Store is empty and no alerts from aggregator, attempting resilient fetcher (Netlify Function)...');
            }
            
            try {
              // Dynamically import rssFeeds to avoid circular dependencies
              const { rssFeeds } = await import('../data/rssFeeds');
              // Use feeds that are more likely to work with CORS proxies
              // Prioritize feeds that are known to work well
              const priorityFeedIds = ['krebs-security', 'haveibeenpwned', 'cisa-alerts'];
              const activeFeeds = rssFeeds
                .filter((f: any) => f.isActive)
                .sort((a: any, b: any) => {
                  const aPriority = priorityFeedIds.indexOf(a.id);
                  const bPriority = priorityFeedIds.indexOf(b.id);
                  if (aPriority !== -1 && bPriority !== -1) return aPriority - bPriority;
                  if (aPriority !== -1) return -1;
                  if (bPriority !== -1) return 1;
                  return 0;
                })
                .slice(0, 5); // Try up to 5 feeds
              
              if (this.isDev) {
                console.log(`[RSS Alert Service] Attempting resilient fetch for ${activeFeeds.length} feeds:`, activeFeeds.map((f: any) => f.name));
              }
              
              const fallbackResult = await resilientRSSFetcher.fetchReducedFeeds(
                activeFeeds.map((f: any) => ({
                  id: f.id,
                  name: f.name,
                  url: f.url,
                  category: f.category
                }))
              );

              if (fallbackResult.alerts.length > 0) {
                // Convert resilient alerts to CautionAlert format
                const fallbackAlerts: CautionAlert[] = fallbackResult.alerts.map(alert => ({
                  id: alert.id,
                  category: this.mapCategoryToCautionAlert(alert.category),
                  severity: 'warning',
                  title: alert.title,
                  message: alert.description || alert.title,
                  createdAt: alert.pubDate || new Date().toISOString(),
                  source: 'service_monitor',
                  link: alert.link
                }));

                store.addAlerts(fallbackAlerts);
                if (this.isDev) {
                  console.log(`[RSS Alert Service] ✅ Added ${fallbackAlerts.length} alerts from resilient fallback`);
                }
              } else if (this.isDev) {
                console.warn('[RSS Alert Service] Resilient fallback returned no alerts', {
                  successCount: fallbackResult.successCount,
                  errorCount: fallbackResult.errorCount
                });
              }
            } catch (fallbackError) {
              if (this.isDev) {
                console.warn('[RSS Alert Service] Resilient fallback failed:', fallbackError);
              }
            }
          } else if (this.isDev) {
            console.log('[RSS Alert Service] Resilient fallback skipped (already ran or conditions not met)');
          }
        }
      }

      this.lastProcessed = new Date();
      const duration = Date.now() - startTime;
      
      // Update failure tracking
      if (result.totalAlerts === 0 && newAlerts.length === 0) {
        this.consecutiveFailures++;
        if (this.consecutiveFailures >= this.MAX_CONSECUTIVE_FAILURES) {
          // Exponential backoff for retry delay
          this.nextRetryDelay = Math.min(this.nextRetryDelay * 2, 3600000); // Max 1 hour
          if (this.isDev) {
            console.warn(`[RSS Alert Service] ${this.consecutiveFailures} consecutive failures. Next retry in ${this.nextRetryDelay / 1000}s`);
          }
        }
      } else {
        // Success - reset failure tracking
        this.consecutiveFailures = 0;
        this.nextRetryDelay = 60000; // Reset to 1 minute
      }
      
      if (this.isDev) {
        console.log(`[RSS Alert Service] Processing complete in ${duration}ms:`, {
          totalFeeds: result.totalFeeds,
          successfulFeeds: result.successfulFeeds,
          totalAlerts: result.totalAlerts,
          newAlerts: newAlerts.length,
          storeTotal: useCautionStore.getState().alerts.length,
          consecutiveFailures: this.consecutiveFailures
        });
      }
    } catch (error) {
      if (this.isDev) {
        console.error('[RSS Alert Service] Error processing feeds:', error);
        console.error('[RSS Alert Service] Error stack:', error instanceof Error ? error.stack : 'No stack trace');
      }
    } finally {
      this.isProcessing = false;
    }
  }

  /**
   * Convert RSS alert to CautionAlert format
   * Preserves original category information in alert ID for later retrieval
   */
  private convertToRSSAlert(rssAlert: Record<string, unknown>): CautionAlert {
    // Map RSS severity to AlertSeverity
    let severity: 'info' | 'warning' | 'high' | 'critical' = 'info';
    if (rssAlert.severity === 'critical') severity = 'critical';
    else if (rssAlert.severity === 'high') severity = 'high';
    else if (rssAlert.severity === 'medium') severity = 'warning';
    else severity = 'info';

    // Map RSS category to AlertCategory
    // Note: The original RSS category is preserved in the alert ID (alert-{feedId}-...)
    // which allows rssAlertMapper to reconstruct it accurately
    let category: CautionAlert['category'] = 'privacy_risk';
    const alertCategory = rssAlert.category as string;
    if (alertCategory === 'data-breach') category = 'breach_notice';
    else if (alertCategory === 'phishing' || alertCategory === 'scams') category = 'ai_threat';
    else if (alertCategory && alertCategory.includes('security')) category = 'account_security';
    else if (alertCategory === 'privacy-laws' || alertCategory === 'regulation' || 
             alertCategory === 'enforcement' || alertCategory === 'compliance' || 
             alertCategory === 'news') category = 'privacy_risk';

    // Determine source type
    const source: CautionAlert['source'] = 'service_monitor';

    // Log category mapping for debugging
    if (this.isDev && rssAlert.category) {
      console.log(`[RSS Alert Service] Mapping RSS category "${rssAlert.category}" to CautionAlert category "${category}" (ID: ${rssAlert.id})`);
    }

    return {
      id: rssAlert.id,
      category,
      severity,
      title: rssAlert.title,
      message: rssAlert.description,
      personaTag: rssAlert.personas?.[0], // Use first matched persona
      serviceId: rssAlert.relatedServices?.[0], // Use first matched service
      serviceName: undefined, // Will be resolved from serviceId
      riskScore: rssAlert.aiDetection?.riskScore,
      evidence: rssAlert.aiDetection?.reasons,
      createdAt: rssAlert.publishedDate,
      source,
      link: rssAlert.link || undefined // Preserve link from RSS feed
    };
  }

  /**
   * Manually trigger feed processing
   */
  async processNow(): Promise<void> {
    await this.processFeedsAndUpdateStore();
  }

  /**
   * Map RSS category to CautionAlert category
   */
  private mapCategoryToCautionAlert(rssCategory: string): CautionAlert['category'] {
    if (rssCategory === 'data-breach') return 'breach_notice';
    if (rssCategory === 'phishing' || rssCategory === 'scams') return 'ai_threat';
    if (rssCategory && rssCategory.includes('security')) return 'account_security';
    return 'privacy_risk';
  }

  /**
   * Try enhanced RSS aggregator as fallback
   */
  private async tryEnhancedAggregator(): Promise<{
    totalAlerts: number;
    successfulFeeds: number;
    allAlerts: any[];
    errors: any[];
  }> {
    try {
      // Dynamically import rssFeeds to avoid circular dependencies
      const { rssFeeds } = await import('../data/rssFeeds');
      
      const activeFeeds = rssFeeds
        .filter((f: any) => f.isActive)
        .slice(0, 10); // Try up to 10 feeds
      
      const allAlerts: any[] = [];
      const errors: any[] = [];
      let successfulFeeds = 0;
      
      // Process feeds in parallel (but limit concurrency)
      const feedPromises = activeFeeds.map(async (feed: any) => {
        try {
          const result = await enhancedRSSAggregator.fetchFeed({
            id: feed.id,
            name: feed.name,
            url: feed.url,
            category: feed.category
          });
          
          if (result.success && result.items.length > 0) {
            successfulFeeds++;
            // Convert to RSS alert format
            result.items.forEach(item => {
              allAlerts.push({
                id: item.id,
                title: item.title,
                description: item.description,
                link: item.link,
                publishedDate: item.publishedDate || item.pubDate,
                category: item.category,
                source: item.source,
                severity: this.inferSeverity(item.title, item.description, item.category)
              });
            });
          } else if (result.error) {
            errors.push({ feedId: feed.id, error: result.error });
          }
        } catch (error) {
          errors.push({ feedId: feed.id, error: error instanceof Error ? error.message : String(error) });
        }
      });
      
      await Promise.allSettled(feedPromises);
      
      return {
        totalAlerts: allAlerts.length,
        successfulFeeds,
        allAlerts,
        errors
      };
    } catch (error) {
      if (this.isDev) {
        console.error('[RSS Alert Service] Enhanced aggregator error:', error);
      }
      return {
        totalAlerts: 0,
        successfulFeeds: 0,
        allAlerts: [],
        errors: [{ error: error instanceof Error ? error.message : String(error) }]
      };
    }
  }

  /**
   * Infer severity from title and description
   */
  private inferSeverity(title: string, description: string, category: string): string {
    const text = `${title} ${description}`.toLowerCase();
    
    if (text.includes('critical') || text.includes('urgent') || text.includes('breach')) {
      return 'high';
    }
    if (text.includes('warning') || text.includes('alert') || text.includes('vulnerability')) {
      return 'medium'; // Fixed: was 'med', should be 'medium' for consistency
    }
    if (category === 'data-breach') {
      return 'high';
    }
    return 'low';
  }

  /**
   * Get status information
   */
  getStatus(): {
    isProcessing: boolean;
    lastProcessed: Date | null;
    isActive: boolean;
    consecutiveFailures: number;
    nextRetryDelay: number;
  } {
    return {
      isProcessing: this.isProcessing,
      lastProcessed: this.lastProcessed,
      isActive: this.processInterval !== null,
      consecutiveFailures: this.consecutiveFailures,
      nextRetryDelay: this.nextRetryDelay
    };
  }
}

// Export singleton instance
export const rssAlertService = new RSSAlertService();

// Note: Service should be initialized explicitly in App.tsx
// Auto-initialization removed to prevent duplicate initialization

