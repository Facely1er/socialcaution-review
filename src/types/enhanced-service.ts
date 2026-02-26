/**
 * Enhanced Service Catalog Schema
 * Comprehensive privacy data structure with 35+ data points per service
 * 
 * @version 2.0
 * @date 2025-12-28
 */

/**
 * Encryption level types
 */
export type EncryptionLevel = 'none' | 'in_transit' | 'at_rest' | 'end_to_end';

/**
 * Business model types
 */
export type BusinessModel = 'advertising' | 'subscription' | 'freemium' | 'paid' | 'open_source' | 'non_profit';

/**
 * Data type categories
 */
export type DataType = 
  | 'personal_info' 
  | 'contact_info' 
  | 'location' 
  | 'biometric' 
  | 'financial' 
  | 'health' 
  | 'browsing_history' 
  | 'search_history' 
  | 'purchase_history' 
  | 'social_graph' 
  | 'content' 
  | 'device_info' 
  | 'usage_analytics';

/**
 * Breach record structure
 */
export interface BreachRecord {
  date: string; // ISO date string
  severity: 'low' | 'medium' | 'high' | 'critical';
  affected_users?: number;
  data_types: DataType[];
  description: string;
  source_url?: string;
  company_response?: string;
}

/**
 * Regulatory action record
 */
export interface RegulatoryAction {
  date: string; // ISO date string
  authority: string; // e.g., "GDPR - Ireland DPC"
  action_type: 'fine' | 'warning' | 'investigation' | 'settlement' | 'ban';
  amount?: number; // Fine amount in USD
  reason: string;
  source_url?: string;
  status: 'resolved' | 'ongoing' | 'appealed';
}

/**
 * Community rating structure
 */
export interface CommunityRating {
  overall: number; // 0-100
  privacy: number; // 0-100
  security: number; // 0-100
  transparency: number; // 0-100
  user_control: number; // 0-100
  review_count: number;
  last_updated: string; // ISO date string
}

/**
 * Enhanced Service Interface
 * Complete privacy data structure with 35+ fields
 */
export interface EnhancedService {
  // ============================================
  // CORE IDENTITY (7 fields)
  // ============================================
  /** Unique identifier (kebab-case) */
  id: string;
  
  /** Display name */
  name: string;
  
  /** Primary category */
  category: string;
  
  /** Subcategory (e.g., "photo-sharing" under "social-media") */
  subcategory?: string;
  
  /** Official website URL */
  website?: string;
  
  /** iOS App Store URL */
  ios_app_url?: string;
  
  /** Android Play Store URL */
  android_app_url?: string;

  // ============================================
  // PRIVACY FUNDAMENTALS (6 fields)
  // ============================================
  /** Encryption level used */
  encryption_level?: EncryptionLevel;
  
  /** Uses zero-knowledge architecture */
  zero_knowledge?: boolean;
  
  /** Open source codebase */
  open_source?: boolean;
  
  /** Date of last independent security audit (ISO date) */
  independent_audit_date?: string;
  
  /** URL to transparency report */
  transparency_report_url?: string;
  
  /** Privacy score (0-100, higher = better privacy) */
  privacy_score?: number;

  // ============================================
  // DATA COLLECTION (8+ fields)
  // ============================================
  /** Types of data collected */
  data_collected?: DataType[];
  
  /** Data retention period (e.g., "90 days", "indefinite", "until deletion") */
  data_retention_period?: string;
  
  /** Practices data minimization principles */
  data_minimization?: boolean;
  
  /** Collects biometric data */
  biometric_data?: boolean;
  
  /** Tracks location data */
  location_tracking?: boolean;
  
  /** Uses cross-site tracking */
  cross_site_tracking?: boolean;
  
  /** Allows third-party tracking */
  third_party_tracking?: boolean;
  
  /** Data export format (e.g., "JSON", "CSV", "PDF") */
  data_export_format?: string[];

  // ============================================
  // DATA SHARING (7+ fields)
  // ============================================
  /** Shares data with third parties */
  third_party_sharing?: boolean;
  
  /** Sells data to data brokers */
  data_broker_sales?: boolean;
  
  /** Shares data for advertising */
  advertising_sharing?: boolean;
  
  /** Number of government data requests (annual) */
  government_requests?: number;
  
  /** Shares data with law enforcement */
  law_enforcement_sharing?: boolean;
  
  /** Shares data with affiliates */
  affiliate_sharing?: boolean;
  
  /** Policy on data sharing in mergers/acquisitions */
  merger_acquisition_policy?: string;

  // ============================================
  // USER RIGHTS (10+ fields)
  // ============================================
  /** Right to access data */
  right_to_access?: boolean;
  
  /** Right to deletion */
  right_to_deletion?: boolean;
  
  /** Right to data portability */
  right_to_portability?: boolean;
  
  /** Right to rectification */
  right_to_rectification?: boolean;
  
  /** Available opt-out mechanisms */
  opt_out_mechanisms?: string[];
  
  /** Account deletion available */
  account_deletion?: boolean;
  
  /** Data download available */
  data_download?: boolean;
  
  /** User control over privacy settings */
  privacy_settings_control?: 'none' | 'limited' | 'comprehensive';
  
  /** GDPR compliant */
  gdpr_compliant?: boolean;
  
  /** CCPA compliant */
  ccpa_compliant?: boolean;

  // ============================================
  // SECURITY PRACTICES (8+ fields)
  // ============================================
  /** Two-factor authentication available */
  two_factor_auth?: boolean;
  
  /** Password requirements */
  password_requirements?: string;
  
  /** Regular security audits */
  security_audits?: boolean;
  
  /** Bug bounty program */
  bug_bounty_program?: boolean;
  
  /** History of security incidents */
  security_incidents?: number;
  
  /** Vulnerability disclosure policy */
  vulnerability_disclosure?: boolean;
  
  /** HTTPS enforcement */
  https_enforcement?: boolean;
  
  /** Security headers implemented */
  security_headers?: boolean;

  // ============================================
  // BREACH HISTORY (array)
  // ============================================
  /** Historical data breaches */
  breaches?: BreachRecord[];

  // ============================================
  // REGULATORY ACTIONS (array)
  // ============================================
  /** Regulatory actions and fines */
  regulatory_actions?: RegulatoryAction[];

  // ============================================
  // BUSINESS MODEL (4+ fields)
  // ============================================
  /** Primary business model */
  business_model?: BusinessModel;
  
  /** Revenue sources */
  revenue_source?: string[];
  
  /** Free tier available */
  free_tier?: boolean;
  
  /** Premium tier available */
  premium_tier?: boolean;

  // ============================================
  // COMMUNITY RATINGS (6+ fields)
  // ============================================
  /** Community ratings and reviews */
  community_ratings?: CommunityRating;

  // ============================================
  // ADDITIONAL METADATA (5+ fields)
  // ============================================
  /** Headquarters country (ISO 3166-1 alpha-2) */
  headquarters_country?: string;
  
  /** Parent company name */
  parent_company?: string;
  
  /** Year founded */
  founded_year?: number;
  
  /** Estimated user count */
  user_count?: number;
  
  /** Last data update date (ISO date) */
  last_updated?: string;
  
  /** Data quality score (0-100) */
  data_quality_score?: number;
  
  /** Description of the service */
  description?: string;
  
  /** Privacy policy URL */
  privacy_policy_url?: string;
  
  /** Terms of service URL */
  terms_of_service_url?: string;
  
  /** Logo URL */
  logo_url?: string;
}

/**
 * Service category definitions
 */
export const SERVICE_CATEGORIES = {
  'search-email': 'Search & Email',
  'social-media': 'Social Media',
  'messaging': 'Messaging',
  'streaming': 'Streaming',
  'shopping': 'Shopping & E-commerce',
  'cloud-storage': 'Cloud Storage',
  'lifestyle': 'Lifestyle & Fitness',
  'dating': 'Dating',
  'financial': 'Financial',
  'browser': 'Browser',
  'vpn': 'VPN',
  'password-manager': 'Password Manager',
  'smart-home': 'Smart Home',
  'health': 'Health & Medical',
  'education': 'Education',
  'productivity': 'Productivity',
  'gaming': 'Gaming',
  'news': 'News & Media'
} as const;

export type ServiceCategory = keyof typeof SERVICE_CATEGORIES;

