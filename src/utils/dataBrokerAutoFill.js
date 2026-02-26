/**
 * Utility functions for auto-filling Data Broker Removal Tool from Personal Data Inventory
 */

import { getRecommendedBrokersForServices } from '../data/serviceToBrokerMapping';

/**
 * Extract personal information from Personal Data Inventory
 * @param {Array} inventoryItems - Array of inventory items from Personal Data Inventory
 * @returns {Object} Object with name, email, phone, address if found
 */
export const extractPersonalInfoFromInventory = (inventoryItems) => {
  if (!inventoryItems || !Array.isArray(inventoryItems)) {
    return { name: '', email: '', phone: '', address: '' };
  }

  const extracted = {
    name: '',
    email: '',
    phone: '',
    address: ''
  };

  inventoryItems.forEach(item => {
    const itemName = (item.name || '').toLowerCase();
    const itemCategory = (item.category || '').toLowerCase();
    const itemValue = item.value || item.description || '';

    // Extract email addresses
    if (itemName.includes('email') || itemCategory === 'personal_info') {
      const emailMatch = itemValue.match(/[\w\.-]+@[\w\.-]+\.\w+/gi);
      if (emailMatch && emailMatch.length > 0 && !extracted.email) {
        extracted.email = emailMatch[0];
      }
    }

    // Extract phone numbers
    if (itemName.includes('phone') || itemName.includes('mobile') || itemName.includes('telephone')) {
      const phoneMatch = itemValue.match(/(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/g);
      if (phoneMatch && phoneMatch.length > 0 && !extracted.phone) {
        extracted.phone = phoneMatch[0].replace(/\s+/g, ' ').trim();
      }
    }

    // Extract addresses
    if (itemName.includes('address') || itemName.includes('location') || itemCategory === 'location') {
      // Look for address patterns (street, city, state, zip)
      if (itemValue && itemValue.length > 10 && !extracted.address) {
        // Check if it looks like an address (contains numbers and common address words)
        const addressPattern = /\d+\s+[\w\s]+(?:street|st|avenue|ave|road|rd|drive|dr|lane|ln|boulevard|blvd|court|ct|way|place|pl)/i;
        if (addressPattern.test(itemValue)) {
          extracted.address = itemValue.substring(0, 200).trim(); // Limit length
        }
      }
    }

    // Extract name (full name)
    if (itemName.includes('name') && itemCategory === 'personal_info') {
      // Look for full name patterns (first and last name)
      const namePattern = /^[A-Z][a-z]+\s+[A-Z][a-z]+/;
      if (namePattern.test(itemValue) && !extracted.name) {
        extracted.name = itemValue.trim();
      }
    }
  });

  return extracted;
};

/**
 * Get recommended brokers for a user based on their selected services
 * @param {string[]} selectedServiceIds - Array of service IDs
 * @param {Array} allBrokers - Array of all data brokers
 * @returns {Object} Object with recommended brokers organized by priority
 */
export const getRecommendedBrokers = (selectedServiceIds, allBrokers) => {
  if (!selectedServiceIds || selectedServiceIds.length === 0 || !allBrokers) {
    return { highPriority: [], mediumPriority: [] };
  }

  const recommendations = getRecommendedBrokersForServices(selectedServiceIds);

  const highPriority = recommendations.highPriority
    .map(brokerId => allBrokers.find(b => b.id === brokerId))
    .filter(b => b !== undefined);

  const mediumPriority = recommendations.mediumPriority
    .map(brokerId => allBrokers.find(b => b.id === brokerId))
    .filter(b => b !== undefined);

  return { highPriority, mediumPriority };
};

