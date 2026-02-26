/**
 * RSS Aggregator Function
 * Internal server-side RSS feed fetcher to avoid CORS issues and rate limiting
 * Fetches RSS feeds directly from sources and returns XML content
 */

exports.handler = async (event, context) => {
  // CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Content-Type': 'application/xml; charset=utf-8',
    'Cache-Control': 'public, max-age=1800' // Cache for 30 minutes (matches client cache)
  };

  // Handle preflight OPTIONS request
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }

  // Only allow GET requests
  if (event.httpMethod !== 'GET') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  // Get feed URL from query parameter
  const feedUrl = event.queryStringParameters?.url;

  if (!feedUrl) {
    return {
      statusCode: 400,
      headers: {
        ...headers,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ error: 'Missing required parameter: url' })
    };
  }

  // Validate URL format
  let parsedUrl;
  try {
    parsedUrl = new URL(feedUrl);
    // Only allow HTTPS URLs for security
    if (parsedUrl.protocol !== 'https:') {
      return {
        statusCode: 400,
        headers: {
          ...headers,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ error: 'Only HTTPS URLs are allowed' })
      };
    }
  } catch (error) {
    return {
      statusCode: 400,
      headers: {
        ...headers,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ error: 'Invalid URL format' })
    };
  }

  try {
    // Fetch RSS feed with timeout (reduced to 10 seconds for better performance)
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

    const response = await fetch(feedUrl, {
      method: 'GET',
      headers: {
        'User-Agent': 'SocialCaution-RSS-Aggregator/1.0',
        'Accept': 'application/rss+xml, application/xml, text/xml, application/atom+xml, */*',
        'Accept-Encoding': 'gzip, deflate, br'
      },
      signal: controller.signal,
      // Add redirect handling
      redirect: 'follow'
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      return {
        statusCode: response.status,
        headers: {
          ...headers,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          error: `Failed to fetch feed: ${response.status} ${response.statusText}`,
          status: response.status
        })
      };
    }

    // Get XML content
    const xmlContent = await response.text();

    if (!xmlContent || xmlContent.trim().length === 0) {
      return {
        statusCode: 500,
        headers: {
          ...headers,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ error: 'Empty feed content' })
      };
    }

    // Return XML content
    return {
      statusCode: 200,
      headers,
      body: xmlContent
    };

  } catch (error) {
    console.error('[RSS Aggregator] Error fetching feed:', error);

    // Handle timeout
    if (error.name === 'AbortError') {
      return {
        statusCode: 504,
        headers: {
          ...headers,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ error: 'Request timeout' })
      };
    }

    // Handle network errors
    return {
      statusCode: 500,
      headers: {
        ...headers,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ 
        error: 'Failed to fetch feed',
        message: error.message 
      })
    };
  }
};

