import React from 'react';
import { 
  Share2, MessageSquare, ShoppingCart, Mail, Search as SearchIcon, 
  Video, Cloud, Heart, DollarSign, Globe, Filter, X, TrendingUp,
  Shield, AlertTriangle, Users, Briefcase, Music, Monitor, Code,
  GraduationCap, Gamepad2, Activity, Newspaper, Key, Home, Network
} from 'lucide-react';

/**
 * Get icon component for service category
 */
export function getCategoryIcon(category) {
  const iconMap = {
    // Social & Communication
    'social-media': Share2,
    'messaging': MessageSquare,
    'dating': Heart,
    
    // Shopping & Commerce
    'shopping': ShoppingCart,
    
    // Email & Search
    'search-email': Mail,
    
    // Media & Entertainment
    'streaming': Video,
    'music': Music,
    'news': Newspaper,
    'gaming': Gamepad2,
    
    // Storage & Cloud
    'cloud-storage': Cloud,
    
    // Productivity & Work
    'productivity': Briefcase,
    'developer-tools': Code,
    'professional': Users,
    'education': GraduationCap,
    
    // Financial & Lifestyle
    'financial': DollarSign,
    'lifestyle': Heart,
    'health': Activity,
    
    // Security & Privacy
    'security-tools': Shield,
    
    // Technology
    'browser': Monitor,
    'smart-home': Home,
    
    // Default fallback
    'default': Globe
  };
  
  return iconMap[category] || iconMap.default;
}

/**
 * Get category display name
 */
export function getCategoryDisplayName(category) {
  const nameMap = {
    'social-media': 'Social Media',
    'messaging': 'Messaging',
    'shopping': 'Shopping',
    'search-email': 'Search & Email',
    'streaming': 'Streaming',
    'cloud-storage': 'Cloud Storage',
    'dating': 'Dating & Social',
    'financial': 'Financial',
    'lifestyle': 'Lifestyle & Health',
    'productivity': 'Productivity',
    'music': 'Music & Audio',
    'professional': 'Professional',
    'security-tools': 'Security Tools'
  };
  
  return nameMap[category] || category.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase());
}

/**
 * Get category color scheme
 */
export function getCategoryColor(category) {
  const colorMap = {
    'social-media': {
      bg: 'bg-blue-100 dark:bg-blue-900/30',
      text: 'text-blue-700 dark:text-blue-300',
      border: 'border-blue-300 dark:border-blue-700',
      hover: 'hover:bg-blue-200 dark:hover:bg-blue-900/50'
    },
    'messaging': {
      bg: 'bg-green-100 dark:bg-green-900/30',
      text: 'text-green-700 dark:text-green-300',
      border: 'border-green-300 dark:border-green-700',
      hover: 'hover:bg-green-200 dark:hover:bg-green-900/50'
    },
    'shopping': {
      bg: 'bg-purple-100 dark:bg-purple-900/30',
      text: 'text-purple-700 dark:text-purple-300',
      border: 'border-purple-300 dark:border-purple-700',
      hover: 'hover:bg-purple-200 dark:hover:bg-purple-900/50'
    },
    'search-email': {
      bg: 'bg-yellow-100 dark:bg-yellow-900/30',
      text: 'text-yellow-700 dark:text-yellow-300',
      border: 'border-yellow-300 dark:border-yellow-700',
      hover: 'hover:bg-yellow-200 dark:hover:bg-yellow-900/50'
    },
    'streaming': {
      bg: 'bg-red-100 dark:bg-red-900/30',
      text: 'text-red-700 dark:text-red-300',
      border: 'border-red-300 dark:border-red-700',
      hover: 'hover:bg-red-200 dark:hover:bg-red-900/50'
    },
    'cloud-storage': {
      bg: 'bg-indigo-100 dark:bg-indigo-900/30',
      text: 'text-indigo-700 dark:text-indigo-300',
      border: 'border-indigo-300 dark:border-indigo-700',
      hover: 'hover:bg-indigo-200 dark:hover:bg-indigo-900/50'
    },
    'dating': {
      bg: 'bg-pink-100 dark:bg-pink-900/30',
      text: 'text-pink-700 dark:text-pink-300',
      border: 'border-pink-300 dark:border-pink-700',
      hover: 'hover:bg-pink-200 dark:hover:bg-pink-900/50'
    },
    'financial': {
      bg: 'bg-emerald-100 dark:bg-emerald-900/30',
      text: 'text-emerald-700 dark:text-emerald-300',
      border: 'border-emerald-300 dark:border-emerald-700',
      hover: 'hover:bg-emerald-200 dark:hover:bg-emerald-900/50'
    },
    'lifestyle': {
      bg: 'bg-orange-100 dark:bg-orange-900/30',
      text: 'text-orange-700 dark:text-orange-300',
      border: 'border-orange-300 dark:border-orange-700',
      hover: 'hover:bg-orange-200 dark:hover:bg-orange-900/50'
    },
    'security-tools': {
      bg: 'bg-cyan-100 dark:bg-cyan-900/30',
      text: 'text-cyan-700 dark:text-cyan-300',
      border: 'border-cyan-300 dark:border-cyan-700',
      hover: 'hover:bg-cyan-200 dark:hover:bg-cyan-900/50'
    }
  };
  
  return colorMap[category] || {
    bg: 'bg-gray-100 dark:bg-gray-900/30',
    text: 'text-gray-700 dark:text-gray-300',
    border: 'border-gray-300 dark:border-gray-700',
    hover: 'hover:bg-gray-200 dark:hover:bg-gray-900/50'
  };
}

/**
 * Get quick filter presets
 */
export function getQuickFilterPresets() {
  return [
    {
      id: 'high-risk',
      label: 'High Risk Services',
      icon: AlertTriangle,
      filter: (services, getExposureIndex) => 
        services.filter(s => getExposureIndex(s.id) >= 50),
      color: 'text-red-600 dark:text-red-400',
      bgColor: 'bg-red-50 dark:bg-red-900/20',
      borderColor: 'border-red-200 dark:border-red-700'
    },
    {
      id: 'social',
      label: 'Social Media',
      icon: Share2,
      filter: (services) => 
        services.filter(s => s.category === 'social-media' || s.category === 'messaging'),
      color: 'text-blue-600 dark:text-blue-400',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20',
      borderColor: 'border-blue-200 dark:border-blue-700'
    },
    {
      id: 'data-heavy',
      label: 'Data Collectors',
      icon: TrendingUp,
      filter: (services, getExposureIndex) => 
        services.filter(s => {
          const exposure = getExposureIndex(s.id);
          return exposure >= 60;
        }),
      color: 'text-orange-600 dark:text-orange-400',
      bgColor: 'bg-orange-50 dark:bg-orange-900/20',
      borderColor: 'border-orange-200 dark:border-orange-700'
    },
    {
      id: 'recommended',
      label: 'Priority Review',
      icon: Shield,
      filter: (services, getExposureIndex) => 
        services.filter(s => getExposureIndex(s.id) >= 70),
      color: 'text-purple-600 dark:text-purple-400',
      bgColor: 'bg-purple-50 dark:bg-purple-900/20',
      borderColor: 'border-purple-200 dark:border-purple-700'
    }
  ];
}

