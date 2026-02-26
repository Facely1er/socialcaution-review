/**
 * Affiliate Program Configuration
 * Privacy-focused affiliate partnerships
 * Phase 1: Affiliate revenue stream
 */

export interface AffiliatePartner {
  id: string;
  name: string;
  category: 'vpn' | 'password_manager' | 'browser' | 'privacy_tool' | 'security';
  url: string;
  affiliateUrl: string;
  commission: number; // Percentage
  description: string;
  icon?: string;
  featured?: boolean;
}

export const AFFILIATE_PARTNERS: AffiliatePartner[] = [
  {
    id: 'nordvpn',
    name: 'NordVPN',
    category: 'vpn',
    url: 'https://nordvpn.com',
    affiliateUrl: 'https://nordvpn.com/?aff_id=YOUR_AFFILIATE_ID',
    commission: 30,
    description: 'Premium VPN service with strong privacy features',
    featured: true,
  },
  {
    id: 'expressvpn',
    name: 'ExpressVPN',
    category: 'vpn',
    url: 'https://expressvpn.com',
    affiliateUrl: 'https://expressvpn.com/?aff_id=YOUR_AFFILIATE_ID',
    commission: 35,
    description: 'Fast and secure VPN with privacy-first approach',
    featured: true,
  },
  {
    id: '1password',
    name: '1Password',
    category: 'password_manager',
    url: 'https://1password.com',
    affiliateUrl: 'https://1password.com/sign-up/?ref=YOUR_REF',
    commission: 25,
    description: 'Secure password manager with zero-knowledge architecture',
    featured: true,
  },
  {
    id: 'bitwarden',
    name: 'Bitwarden',
    category: 'password_manager',
    url: 'https://bitwarden.com',
    affiliateUrl: 'https://bitwarden.com/?ref=YOUR_REF',
    commission: 20,
    description: 'Open-source password manager',
  },
  {
    id: 'brave',
    name: 'Brave Browser',
    category: 'browser',
    url: 'https://brave.com',
    affiliateUrl: 'https://brave.com/?ref=YOUR_REF',
    commission: 15,
    description: 'Privacy-focused browser with built-in ad blocking',
    featured: true,
  },
  {
    id: 'protonmail',
    name: 'ProtonMail',
    category: 'privacy_tool',
    url: 'https://protonmail.com',
    affiliateUrl: 'https://protonmail.com/?ref=YOUR_REF',
    commission: 20,
    description: 'Encrypted email service',
  },
];

export function getAffiliateUrl(partnerId: string): string | null {
  const partner = AFFILIATE_PARTNERS.find(p => p.id === partnerId);
  return partner?.affiliateUrl || null;
}

export function getFeaturedPartners(): AffiliatePartner[] {
  return AFFILIATE_PARTNERS.filter(p => p.featured);
}

export function getPartnersByCategory(category: AffiliatePartner['category']): AffiliatePartner[] {
  return AFFILIATE_PARTNERS.filter(p => p.category === category);
}

