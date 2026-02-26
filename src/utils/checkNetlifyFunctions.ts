/**
 * Utility to check if Netlify Functions are available
 * Used to provide helpful error messages when RSS feeds can't be fetched
 */

export const checkNetlifyFunctionsAvailable = async (): Promise<boolean> => {
  try {
    // Try to access the Netlify Functions endpoint
    // The RSS aggregator function should be at /.netlify/functions/rss-aggregator
    const response = await fetch('/.netlify/functions/rss-aggregator', {
      method: 'HEAD',
      signal: AbortSignal.timeout(2000) // 2 second timeout
    });
    return response.ok || response.status === 405; // 405 Method Not Allowed is OK (means function exists)
  } catch (error) {
    return false;
  }
};

/**
 * Get a user-friendly message about Netlify Functions requirement
 */
export const getNetlifyFunctionsMessage = (): string => {
  return 'RSS feeds require Netlify Functions to be running. Use "netlify dev" instead of "npm run dev" for full functionality.';
};
