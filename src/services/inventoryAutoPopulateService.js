/**
 * Auto-Populate Service for Personal Data Inventory
 * Generates inventory entries from selected services in Service Catalog
 */

import { 
  getInventoryEntriesForServices, 
  mergeInventoryEntries,
  isDuplicateEntry 
} from '../data/serviceInventoryMapping';
import { serviceCatalog } from '../data/serviceCatalog';

/**
 * Get selected services from localStorage
 * @returns {Array<string>} Array of service IDs
 */
export const getSelectedServices = () => {
  try {
    const saved = localStorage.getItem('socialcaution_services');
    if (saved) {
      const services = JSON.parse(saved);
      return Array.isArray(services) ? services : [];
    }
    return [];
  } catch (error) {
    console.error('Error loading selected services:', error);
    return [];
  }
};

/**
 * Clear selected services from localStorage
 */
export const clearSelectedServices = () => {
  try {
    localStorage.removeItem('socialcaution_services');
  } catch (error) {
    console.error('Error clearing selected services:', error);
  }
};

/**
 * Get service names for display
 * @param {Array<string>} serviceIds - Array of service IDs
 * @returns {Array<Object>} Array of {id, name} objects
 */
export const getServiceNames = (serviceIds) => {
  return serviceIds.map(id => {
    const service = serviceCatalog.find(s => s.id === id);
    return {
      id,
      name: service ? service.name : id
    };
  });
};

/**
 * Generate inventory entries from selected services
 * @param {Array<string>} serviceIds - Array of service IDs (optional, defaults to selected services)
 * @returns {Array} Array of inventory entry objects
 */
export const generateInventoryFromServices = (serviceIds = null) => {
  const services = serviceIds || getSelectedServices();
  
  if (!services || services.length === 0) {
    return [];
  }
  
  return getInventoryEntriesForServices(services);
};

/**
 * Preview what would be added to inventory
 * @param {Array<string>} serviceIds - Array of service IDs (optional)
 * @returns {Object} Preview data with services and entry counts
 */
export const previewInventoryFromServices = (serviceIds = null) => {
  const services = serviceIds || getSelectedServices();
  
  if (!services || services.length === 0) {
    return {
      services: [],
      totalEntries: 0,
      entriesByService: {},
      sampleEntries: []
    };
  }
  
  const entries = generateInventoryFromServices(services);
  const serviceNames = getServiceNames(services);
  
  // Group entries by service
  const entriesByService = {};
  services.forEach(serviceId => {
    const serviceEntries = entries.filter(e => e.sourceService === serviceId);
    entriesByService[serviceId] = {
      count: serviceEntries.length,
      entries: serviceEntries
    };
  });
  
  // Get sample entries (first 3)
  const sampleEntries = entries.slice(0, 3);
  
  return {
    services: serviceNames,
    totalEntries: entries.length,
    entriesByService,
    sampleEntries
  };
};

/**
 * Check if user has dismissed auto-populate prompt
 * @returns {boolean} True if user dismissed
 */
export const hasDismissedAutoPopulate = () => {
  try {
    return localStorage.getItem('socialcaution_dismissed_auto_populate') === 'true';
  } catch {
    return false;
  }
};

/**
 * Mark auto-populate prompt as dismissed
 */
export const dismissAutoPopulate = () => {
  try {
    localStorage.setItem('socialcaution_dismissed_auto_populate', 'true');
  } catch (error) {
    console.error('Error dismissing auto-populate:', error);
  }
};

/**
 * Check if auto-populate should be shown
 * @param {Array} existingInventory - Current inventory entries
 * @returns {boolean} True if should show prompt
 */
export const shouldShowAutoPopulate = (existingInventory = []) => {
  // Don't show if dismissed
  if (hasDismissedAutoPopulate()) {
    return false;
  }
  
  // Don't show if no services selected
  const selectedServices = getSelectedServices();
  if (!selectedServices || selectedServices.length === 0) {
    return false;
  }
  
  // Show if inventory is empty or has very few items (< 3)
  return !existingInventory || existingInventory.length < 3;
};

/**
 * Merge new entries with existing inventory
 * @param {Array} existingInventory - Current inventory entries
 * @param {Array<string>} serviceIds - Service IDs to add (optional, defaults to all selected)
 * @returns {Object} Result with merged entries and stats
 */
export const addServicesToInventory = (existingInventory = [], serviceIds = null) => {
  const services = serviceIds || getSelectedServices();
  
  if (!services || services.length === 0) {
    return {
      success: false,
      error: 'No services selected',
      merged: existingInventory,
      added: 0,
      duplicates: 0
    };
  }
  
  const newEntries = generateInventoryFromServices(services);
  const duplicates = newEntries.filter(entry => 
    isDuplicateEntry(entry, existingInventory)
  ).length;
  
  const merged = mergeInventoryEntries(existingInventory, newEntries);
  const added = merged.length - existingInventory.length;
  
  return {
    success: true,
    merged,
    added,
    duplicates,
    total: merged.length
  };
};

/**
 * Generate Category-Based Inventory
 * Uses common data sharing patterns from service categories
 * 
 * @param {Array<string>} selectedServices - Array of service IDs
 * @returns {Object} Category-based inventory with service-specific and category-based entries
 */
export function generateCategoryBasedInventory(selectedServices) {
  if (!selectedServices || selectedServices.length === 0) {
    return {
      totalEntries: 0,
      categories: [],
      entries: [],
      serviceSpecific: [],
      categoryBased: []
    };
  }

  // Get services and their categories
  const services = selectedServices.map(id => {
    const service = serviceCatalog.find(s => s.id === id);
    return {
      id,
      name: service?.name || id,
      category: service?.category || 'other'
    };
  });

  // Tier 1: Service-specific entries (precise)
  const serviceSpecificEntries = generateInventoryFromServices(selectedServices);
  
  // Tier 2: Category-based entries (for services without specific mapping)
  const servicesWithoutMapping = selectedServices.filter(id => {
    const entries = getInventoryEntriesForServices([id]);
    return entries.length === 0;
  });

  let categoryBasedEntries = [];
  if (servicesWithoutMapping.length > 0) {
    // Group by category
    const categoryGroups = servicesWithoutMapping.reduce((acc, serviceId) => {
      const service = serviceCatalog.find(s => s.id === serviceId);
      const category = service?.category || 'other';
      if (!acc[category]) acc[category] = [];
      acc[category].push(serviceId);
      return acc;
    }, {});

    // Generate category-based entries
    Object.entries(categoryGroups).forEach(([category, serviceIds]) => {
      const categoryPatterns = getCommonDataPatternsForCategory(category);
      const categoryEntries = generateCategoryBasedEntries(category, serviceIds, categoryPatterns);
      categoryBasedEntries.push(...categoryEntries);
    });
  }

  // Group by category for breakdown
  const categoryEntries = Object.entries(
    [...services].reduce((acc, service) => {
      const category = service.category || 'other';
      if (!acc[category]) {
        acc[category] = {
          category: category,
          categoryName: formatCategoryName(category),
          serviceCount: 0,
          services: [],
          commonDataTypes: [],
          typicalSharing: [],
          estimatedEntries: 0,
          entries: []
        };
      }
      acc[category].services.push(service);
      acc[category].serviceCount += 1;
      return acc;
    }, {})
  ).map(([category, data]) => {
    const patterns = getCommonDataPatternsForCategory(category);
    return {
      ...data,
      commonDataTypes: patterns.dataTypes,
      typicalSharing: patterns.sharing,
      estimatedEntries: patterns.estimatedEntries,
      entries: [
        ...serviceSpecificEntries.filter(e => 
          e.sourceService && services.find(s => s.id === e.sourceService && s.category === category)
        ),
        ...categoryBasedEntries.filter(e => e.sourceCategory === category)
      ]
    };
  });

  // Combine all entries
  const allEntries = [
    ...serviceSpecificEntries.map(entry => ({
      ...entry,
      source: 'service-specific',
      sourceService: entry.sourceService
    })),
    ...categoryBasedEntries.map(entry => ({
      ...entry,
      source: 'category-based'
    }))
  ];

  return {
    totalEntries: allEntries.length,
    categories: categoryEntries,
    entries: allEntries,
    serviceSpecific: serviceSpecificEntries,
    categoryBased: categoryBasedEntries,
    byCategory: categoryEntries.reduce((acc, cat) => {
      acc[cat.category] = cat;
      return acc;
    }, {})
  };
}

/**
 * Get Common Data Patterns for Category
 * Based on typical data sharing patterns
 */
function getCommonDataPatternsForCategory(category) {
  const patterns = {
    'social-media': {
      dataTypes: [
        'Profile Information',
        'Posts and Content',
        'Location Data',
        'Contact Lists',
        'Browsing History',
        'Biometric Data (facial recognition)'
      ],
      sharing: ['Advertisers', 'Third-party apps', 'Data brokers', 'Public'],
      estimatedEntries: 5,
      brokerRisk: 'high'
    },
    'shopping': {
      dataTypes: [
        'Purchase History',
        'Payment Information',
        'Shipping Addresses',
        'Product Preferences',
        'Browsing History'
      ],
      sharing: ['Payment processors', 'Third-party sellers', 'Data brokers', 'Advertisers'],
      estimatedEntries: 4,
      brokerRisk: 'high'
    },
    'financial': {
      dataTypes: [
        'Transaction History',
        'Account Information',
        'Payment Methods',
        'Identity Verification'
      ],
      sharing: ['Banks', 'Payment processors', 'Regulatory authorities', 'Data brokers'],
      estimatedEntries: 3,
      brokerRisk: 'medium'
    },
    'messaging': {
      dataTypes: [
        'Messages and Media',
        'Contact Lists',
        'Metadata',
        'Location Data'
      ],
      sharing: ['Service provider', 'Law enforcement (with warrant)', 'Third-party apps'],
      estimatedEntries: 3,
      brokerRisk: 'low'
    },
    'search-email': {
      dataTypes: [
        'Search History',
        'Email Content',
        'Location History',
        'Voice Recordings'
      ],
      sharing: ['Advertisers', 'Third-party services', 'Data brokers'],
      estimatedEntries: 4,
      brokerRisk: 'high'
    },
    'cloud-storage': {
      dataTypes: [
        'Files and Documents',
        'Photos and Videos',
        'Backup Data',
        'Location Data'
      ],
      sharing: ['Law enforcement (with warrant)', 'Third-party apps (with permission)'],
      estimatedEntries: 3,
      brokerRisk: 'low'
    },
    'streaming': {
      dataTypes: [
        'Watch History',
        'Payment Information',
        'Viewing Preferences'
      ],
      sharing: ['Content providers', 'Analytics partners', 'Advertisers'],
      estimatedEntries: 2,
      brokerRisk: 'medium'
    }
  };

  return patterns[category] || {
    dataTypes: ['Account Information', 'Usage Data'],
    sharing: ['Service provider'],
    estimatedEntries: 2,
    brokerRisk: 'low'
  };
}

/**
 * Generate Category-Based Entries
 * Creates inventory entries based on category patterns
 */
function generateCategoryBasedEntries(category, serviceIds, patterns) {
  const entries = [];
  const services = serviceIds.map(id => {
    const service = serviceCatalog.find(s => s.id === id);
    return { id, name: service?.name || id };
  });
  
  // Create entries for common data types
  patterns.dataTypes.forEach((dataType, index) => {
    entries.push({
      id: `category-${category}-${dataType.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}-${index}`,
      name: `${formatCategoryName(category)} ${dataType}`,
      description: `Common ${dataType.toLowerCase()} from ${category} services`,
      category: mapCategoryToInventoryCategory(category),
      sensitivity: determineSensitivity(dataType, category),
      storedBy: services.map(s => s.name),
      purpose: `Service functionality for ${category} category`,
      retention: 'Varies by service',
      sharedWith: patterns.sharing,
      source: 'category-based-auto-populate',
      sourceCategory: category,
      sourceServices: serviceIds,
      lastUpdated: new Date().toISOString().split('T')[0]
    });
  });

  return entries;
}

/**
 * Format category name for display
 */
function formatCategoryName(category) {
  const names = {
    'social-media': 'Social Media',
    'search-email': 'Search & Email',
    'cloud-storage': 'Cloud Storage',
    'streaming': 'Streaming'
  };
  return names[category] || category.split('-').map(w => 
    w.charAt(0).toUpperCase() + w.slice(1)
  ).join(' ');
}

/**
 * Map service category to inventory category
 */
function mapCategoryToInventoryCategory(category) {
  const mapping = {
    'social-media': 'social',
    'search-email': 'personal_info',
    'cloud-storage': 'files',
    'streaming': 'entertainment',
    'shopping': 'financial',
    'financial': 'financial',
    'messaging': 'communication'
  };
  return mapping[category] || 'other';
}

/**
 * Determine sensitivity level
 */
function determineSensitivity(dataType, category) {
  const highSensitivity = ['Payment', 'Financial', 'Identity', 'Biometric', 'Location'];
  const mediumSensitivity = ['Profile', 'Contact', 'Purchase', 'Transaction'];
  
  if (highSensitivity.some(keyword => dataType.includes(keyword))) {
    return 'high';
  }
  if (mediumSensitivity.some(keyword => dataType.includes(keyword))) {
    return 'medium';
  }
  return 'low';
}

/**
 * Enhanced inventory generation with category support
 */
export const generateEnhancedInventory = (selectedServices) => {
  return generateCategoryBasedInventory(selectedServices);
};
