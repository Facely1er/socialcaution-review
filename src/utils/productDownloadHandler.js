/**
 * Product Download Handler
 * 
 * Handles product download for the website (2026 repo).
 * For static products, downloads the file directly.
 * For dynamic products, would generate on-demand (future implementation).
 */

import { PRODUCT_DOWNLOADS, getProductDownloadUrl } from '../config/products';

/**
 * Handle product download
 * @param {string} productId - Product ID
 * @param {Object} options - Product-specific options (serviceId, etc.)
 * @returns {Promise<void>}
 */
export async function handleProductDownload(productId, options = {}) {
  try {
    const product = PRODUCT_DOWNLOADS[productId];
    if (!product) {
      throw new Error(`Product ${productId} not found`);
    }

    // For products with static URLs, download directly
    if (product.url) {
      const link = document.createElement('a');
      link.href = product.url;
      link.download = product.filename || productId;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      return;
    }

    // For products without URLs (like AI tools), they're accessed via routes, not downloads
    console.warn(`Product ${productId} does not have a download URL. It may be accessed via a route instead.`);
  } catch (error) {
    console.error(`Error handling product download for ${productId}:`, error);
    throw error;
  }
}
