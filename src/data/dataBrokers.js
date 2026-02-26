/**
 * Data Broker Directory
 * List of major data brokers with opt-out information
 */

export const dataBrokers = [
  {
    id: 'whitepages',
    name: 'WhitePages',
    website: 'whitepages.com',
    optOutUrl: 'https://www.whitepages.com/opt-out',
    optOutMethod: 'online',
    difficulty: 'easy',
    status: 'not_started',
    description: 'One of the largest people search databases. Contains names, addresses, phone numbers, and more.',
    dataTypes: ['Name', 'Address', 'Phone Number', 'Age', 'Relatives'],
    estimatedTime: '5-10 minutes',
    requiresId: false,
    instructions: [
      'Visit the WhitePages opt-out page',
      'Enter your name and location',
      'Find your listing',
      'Click "Remove this listing"',
      'Verify your email address'
    ],
    legalBasis: 'CCPA, State Privacy Laws',
    responseTime: '24-48 hours',
    verificationMethod: 'Email confirmation',
    recheckInterval: 30,
    categories: ['people-search', 'directory']
  },
  {
    id: 'spokeo',
    name: 'Spokeo',
    website: 'spokeo.com',
    optOutUrl: 'https://www.spokeo.com/optout',
    optOutMethod: 'online',
    difficulty: 'easy',
    status: 'not_started',
    description: 'People search engine that aggregates public records and social media information.',
    dataTypes: ['Name', 'Address', 'Phone', 'Email', 'Social Media Profiles', 'Photos'],
    estimatedTime: '5-10 minutes',
    requiresId: false,
    instructions: [
      'Go to Spokeo opt-out page',
      'Search for your name',
      'Select your listing',
      'Click "Remove"',
      'Complete the verification process'
    ],
    legalBasis: 'CCPA',
    responseTime: '24-72 hours',
    verificationMethod: 'Email verification',
    recheckInterval: 30,
    categories: ['people-search', 'social-media']
  },
  {
    id: 'beenverified',
    name: 'BeenVerified',
    website: 'beenverified.com',
    optOutUrl: 'https://www.beenverified.com/optout',
    optOutMethod: 'online',
    difficulty: 'medium',
    status: 'not_started',
    description: 'Background check and people search service with extensive public records.',
    dataTypes: ['Name', 'Address', 'Phone', 'Criminal Records', 'Property Records'],
    estimatedTime: '10-15 minutes',
    requiresId: true,
    instructions: [
      'Visit BeenVerified opt-out page',
      'Search for your information',
      'Select your listing',
      'Provide ID verification',
      'Submit removal request'
    ],
    legalBasis: 'CCPA, FCRA',
    responseTime: '48-72 hours',
    verificationMethod: 'ID verification required',
    recheckInterval: 30,
    categories: ['background-check', 'public-records']
  },
  {
    id: 'truthfinder',
    name: 'TruthFinder',
    website: 'truthfinder.com',
    optOutUrl: 'https://www.truthfinder.com/opt-out/',
    optOutMethod: 'online',
    difficulty: 'medium',
    status: 'not_started',
    description: 'People search and background check service.',
    dataTypes: ['Name', 'Address', 'Phone', 'Criminal Records', 'Social Media'],
    estimatedTime: '10-15 minutes',
    requiresId: true,
    instructions: [
      'Go to TruthFinder opt-out page',
      'Search for your listing',
      'Verify your identity',
      'Submit removal request',
      'Wait for confirmation email'
    ],
    legalBasis: 'CCPA',
    responseTime: '48-72 hours',
    verificationMethod: 'ID verification',
    recheckInterval: 30,
    categories: ['background-check']
  },
  {
    id: 'instantcheckmate',
    name: 'Instant Checkmate',
    website: 'instantcheckmate.com',
    optOutUrl: 'https://www.instantcheckmate.com/opt-out/',
    optOutMethod: 'online',
    difficulty: 'medium',
    status: 'not_started',
    description: 'Background check and people search platform.',
    dataTypes: ['Name', 'Address', 'Phone', 'Criminal Records', 'Property'],
    estimatedTime: '10-15 minutes',
    requiresId: true,
    instructions: [
      'Visit Instant Checkmate opt-out page',
      'Search for your information',
      'Verify your identity with ID',
      'Submit removal request',
      'Monitor for confirmation'
    ],
    legalBasis: 'CCPA',
    responseTime: '48-96 hours',
    verificationMethod: 'ID verification',
    recheckInterval: 30,
    categories: ['background-check']
  },
  {
    id: 'intelius',
    name: 'Intelius',
    website: 'intelius.com',
    optOutUrl: 'https://www.intelius.com/opt-out',
    optOutMethod: 'online',
    difficulty: 'easy',
    status: 'not_started',
    description: 'People search and background check service.',
    dataTypes: ['Name', 'Address', 'Phone', 'Email', 'Age'],
    estimatedTime: '5-10 minutes',
    requiresId: false,
    instructions: [
      'Go to Intelius opt-out page',
      'Enter your information',
      'Find your listing',
      'Click to remove',
      'Verify via email'
    ],
    legalBasis: 'CCPA',
    responseTime: '24-48 hours',
    verificationMethod: 'Email verification',
    recheckInterval: 30,
    categories: ['people-search']
  },
  {
    id: 'peoplefinder',
    name: 'PeopleFinder',
    website: 'peoplefinder.com',
    optOutUrl: 'https://www.peoplefinder.com/opt-out',
    optOutMethod: 'online',
    difficulty: 'easy',
    status: 'not_started',
    description: 'People search directory with contact information.',
    dataTypes: ['Name', 'Address', 'Phone', 'Email'],
    estimatedTime: '5-10 minutes',
    requiresId: false,
    instructions: [
      'Visit PeopleFinder opt-out page',
      'Search for your listing',
      'Select your record',
      'Submit removal request',
      'Confirm via email'
    ],
    legalBasis: 'CCPA',
    responseTime: '24-48 hours',
    verificationMethod: 'Email confirmation',
    recheckInterval: 30,
    categories: ['people-search', 'directory']
  },
  {
    id: 'fastpeoplesearch',
    name: 'FastPeopleSearch',
    website: 'fastpeoplesearch.com',
    optOutUrl: 'https://www.fastpeoplesearch.com/opt-out',
    optOutMethod: 'online',
    difficulty: 'easy',
    status: 'not_started',
    description: 'Free people search engine with public records.',
    dataTypes: ['Name', 'Address', 'Phone', 'Age', 'Relatives'],
    estimatedTime: '5-10 minutes',
    requiresId: false,
    instructions: [
      'Go to FastPeopleSearch opt-out page',
      'Enter your name and location',
      'Find your listing',
      'Click "Remove"',
      'Verify your email'
    ],
    legalBasis: 'CCPA',
    responseTime: '24-48 hours',
    verificationMethod: 'Email verification',
    recheckInterval: 30,
    categories: ['people-search']
  },
  {
    id: 'truepeoplesearch',
    name: 'TruePeopleSearch',
    website: 'truepeoplesearch.com',
    optOutUrl: 'https://www.truepeoplesearch.com/removal',
    optOutMethod: 'online',
    difficulty: 'easy',
    status: 'not_started',
    description: 'Free people search with public records.',
    dataTypes: ['Name', 'Address', 'Phone', 'Age'],
    estimatedTime: '5-10 minutes',
    requiresId: false,
    instructions: [
      'Visit TruePeopleSearch removal page',
      'Search for your information',
      'Select your listing',
      'Submit removal request',
      'Check email for confirmation'
    ],
    legalBasis: 'CCPA',
    responseTime: '24-48 hours',
    verificationMethod: 'Email confirmation',
    recheckInterval: 30,
    categories: ['people-search']
  },
  {
    id: 'usasearch',
    name: 'USA Search',
    website: 'usasearch.com',
    optOutUrl: 'https://www.usasearch.com/opt-out',
    optOutMethod: 'online',
    difficulty: 'easy',
    status: 'not_started',
    description: 'People search and directory service.',
    dataTypes: ['Name', 'Address', 'Phone'],
    estimatedTime: '5-10 minutes',
    requiresId: false,
    instructions: [
      'Go to USA Search opt-out page',
      'Enter your information',
      'Find your listing',
      'Request removal',
      'Verify via email'
    ],
    legalBasis: 'CCPA',
    responseTime: '24-48 hours',
    verificationMethod: 'Email verification',
    recheckInterval: 30,
    categories: ['people-search', 'directory']
  }
];

/**
 * Get data broker by ID
 */
export const getDataBrokerById = (id) => {
  return dataBrokers.find(broker => broker.id === id);
};

/**
 * Get data brokers by category
 */
export const getDataBrokersByCategory = (category) => {
  return dataBrokers.filter(broker => broker.categories.includes(category));
};

/**
 * Search data brokers - Intelligent matching based on search criteria
 * Analyzes provided information and matches against broker data collection patterns
 * 
 * @param {Object} searchForm - Search form data with name, email, phone, address
 * @param {string[]} selectedServices - Optional array of selected service IDs for context
 * @returns {Promise<Array>} Array of matched brokers with confidence scores
 */
/**
 * Analyzes which data brokers likely have your data based on:
 * 1. What types of data you provided
 * 2. What types of data each broker typically collects
 * 3. Your selected services (brokers often buy data from services you use)
 * 
 * IMPORTANT: This does NOT actually search broker databases. It provides
 * intelligent recommendations based on data collection patterns. Users must
 * manually verify on each broker's website.
 */
export const searchDataBrokers = async (searchForm, selectedServices = []) => {
  // Simulate analysis time for better UX
  await new Promise(resolve => setTimeout(resolve, 1200));
  
  const { name, email, phone, address } = searchForm;
  const providedData = {
    name: name?.trim() || '',
    email: email?.trim() || '',
    phone: phone?.trim() || '',
    address: address?.trim() || ''
  };
  
  // Count how many data points were provided
  const dataPointsProvided = Object.values(providedData).filter(v => v.length > 0).length;
  
  if (dataPointsProvided === 0) {
    return [];
  }
  
  // Import service-to-broker mapping for context
  let serviceBasedBrokers = { highPriority: [], mediumPriority: [] };
  if (selectedServices && selectedServices.length > 0) {
    try {
      const { getBrokerRecommendationsSummary } = await import('./serviceToBrokerMapping');
      const summary = getBrokerRecommendationsSummary(selectedServices);
      serviceBasedBrokers = {
        highPriority: summary.recommendations?.highPriority || [],
        mediumPriority: summary.recommendations?.mediumPriority || []
      };
    } catch (error) {
      // Fallback if import fails
      if (import.meta.env.DEV) {
        console.warn('Could not load service-to-broker mapping:', error);
      }
    }
  }
  
  // Analyze each broker and calculate match score
  const matchedBrokers = dataBrokers.map(broker => {
    let matchScore = 0;
    let matchedDataTypes = [];
    let confidence = 0;
    
    // Check what data types the broker collects
    const brokerDataTypes = broker.dataTypes.map(dt => dt.toLowerCase());
    
    // Match based on provided data
    if (providedData.name) {
      // Most brokers collect names
      if (brokerDataTypes.some(dt => dt.includes('name'))) {
        matchScore += 25;
        matchedDataTypes.push('Name');
      }
    }
    
    if (providedData.email) {
      if (brokerDataTypes.some(dt => dt.includes('email'))) {
        matchScore += 30;
        matchedDataTypes.push('Email');
      }
    }
    
    if (providedData.phone) {
      if (brokerDataTypes.some(dt => dt.includes('phone'))) {
        matchScore += 25;
        matchedDataTypes.push('Phone');
      }
    }
    
    if (providedData.address) {
      if (brokerDataTypes.some(dt => dt.includes('address'))) {
        matchScore += 20;
        matchedDataTypes.push('Address');
      }
    }
    
    // Boost confidence for brokers recommended based on services
    if (serviceBasedBrokers.highPriority.includes(broker.id)) {
      matchScore += 15;
      confidence += 10;
    } else if (serviceBasedBrokers.mediumPriority.includes(broker.id)) {
      matchScore += 8;
      confidence += 5;
    }
    
    // Calculate likelihood score (we call it "confidence" but it's really likelihood)
    // Based on how well the broker's typical data collection matches what user provided
    if (matchScore > 0) {
      // Base likelihood on data type matching
      const baseConfidence = Math.min(85, 50 + (matchScore / 2));
      
      // Boost for comprehensive data matching
      const dataMatchRatio = matchedDataTypes.length / Math.max(1, dataPointsProvided);
      confidence = Math.min(95, baseConfidence + (dataMatchRatio * 15));
      
      // Adjust based on broker's collection breadth
      // Brokers with more data types are more likely to have you
      const collectionBreadth = broker.dataTypes.length;
      if (collectionBreadth >= 6) {
        confidence = Math.min(95, confidence + 5);
      }
      
      // Ensure minimum confidence for any match
      confidence = Math.max(60, confidence);
    }
    
    // Only include brokers with meaningful matches
    if (matchScore > 0) {
      return {
        brokerId: broker.id,
        brokerName: broker.name,
        website: broker.website,
        likelyHasData: true, // More accurate than "hasData"
        confidence: Math.round(confidence), // Actually likelihood based on collection patterns
        matchScore: matchScore,
        matchedDataTypes: matchedDataTypes.length > 0 ? matchedDataTypes : broker.dataTypes.slice(0, 3),
        dataTypes: broker.dataTypes,
        lastAnalyzed: new Date().toISOString(),
        optOutUrl: broker.optOutUrl,
        difficulty: broker.difficulty,
        estimatedTime: broker.estimatedTime,
        description: broker.description,
        isServiceRecommended: serviceBasedBrokers.highPriority.includes(broker.id) || 
                              serviceBasedBrokers.mediumPriority.includes(broker.id),
        recommendationReason: serviceBasedBrokers.highPriority.includes(broker.id) 
          ? 'High priority based on your services' 
          : serviceBasedBrokers.mediumPriority.includes(broker.id)
          ? 'Recommended based on your services'
          : 'Matches your data types'
      };
    }
    
    return null;
  }).filter(broker => broker !== null); // Remove null results
  
  // Sort by confidence (highest first), then by match score
  matchedBrokers.sort((a, b) => {
    if (b.confidence !== a.confidence) {
      return b.confidence - a.confidence;
    }
    return b.matchScore - a.matchScore;
  });
  
  // Return top matches (limit to most relevant)
  // If we have service-based recommendations, include more results
  const maxResults = serviceBasedBrokers.highPriority.length > 0 ? 12 : 8;
  return matchedBrokers.slice(0, maxResults);
};

