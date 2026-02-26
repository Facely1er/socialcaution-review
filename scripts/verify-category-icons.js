/**
 * Verify Category Icons
 * Checks which categories have icons and which are missing
 */

import { getAllEnhancedServices } from '../src/data/serviceCatalogEnhanced.js';
import { getCategoryIcon } from '../src/utils/categoryHelpers.js';
import { 
  Share2, MessageSquare, ShoppingCart, Mail, Video, Cloud, Heart, 
  DollarSign, Globe, Briefcase, Music, Users, Monitor, Code, GraduationCap,
  Gamepad2, Activity, Newspaper, Key, Home, Network
} from 'lucide-react';

const allServices = getAllEnhancedServices();
const categories = [...new Set(allServices.map(s => s.category))].sort();

console.log('='.repeat(80));
console.log('CATEGORY ICONS VERIFICATION');
console.log('='.repeat(80));
console.log('');

console.log(`📊 TOTAL CATEGORIES: ${categories.length}`);
console.log('');

const iconMap = {
  'social-media': Share2,
  'messaging': MessageSquare,
  'shopping': ShoppingCart,
  'search-email': Mail,
  'streaming': Video,
  'cloud-storage': Cloud,
  'dating': Heart,
  'financial': DollarSign,
  'lifestyle': Heart,
  'productivity': Briefcase,
  'music': Music,
  'professional': Users,
  'browser': Monitor,
  'developer-tools': Code,
  'education': GraduationCap,
  'gaming': Gamepad2,
  'health': Activity,
  'news': Newspaper,
  'password-manager': Key,
  'smart-home': Home,
  'vpn': Network,
  'default': Globe
};

console.log('CATEGORY ICON MAPPINGS:');
console.log('');
categories.forEach(category => {
  const currentIcon = getCategoryIcon(category);
  const suggestedIcon = iconMap[category] || Globe;
  const hasMapping = iconMap.hasOwnProperty(category);
  const status = hasMapping ? '✅' : '❌ MISSING';
  
  console.log(`   ${status} ${category.padEnd(25)} → Current: ${currentIcon.name || 'Globe'}, Suggested: ${suggestedIcon.name}`);
});

console.log('');
console.log('='.repeat(80));
console.log('MISSING ICON MAPPINGS');
console.log('='.repeat(80));
console.log('');

const missingCategories = categories.filter(cat => !iconMap.hasOwnProperty(cat));
if (missingCategories.length > 0) {
  console.log('Categories missing from iconMap:');
  missingCategories.forEach(cat => {
    console.log(`   - ${cat}`);
  });
} else {
  console.log('✅ All categories have icon mappings!');
}

console.log('\n' + '='.repeat(80));
console.log('ANALYSIS COMPLETE');
console.log('='.repeat(80));
