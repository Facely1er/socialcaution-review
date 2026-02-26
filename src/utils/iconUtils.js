/**
 * Icon utility functions for consistent icon sizing and styling across the application
 * Complements iconMapping.js which handles icon component mapping
 */

/**
 * Icon size variants
 * @typedef {'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'} IconSize
 */

/**
 * Icon size mapping to Tailwind CSS classes
 */
export const iconSizes = {
  xs: 'h-3 w-3',    // 12px - Very small icons (badges, indicators)
  sm: 'h-4 w-4',    // 16px - Small icons (navigation, buttons)
  md: 'h-5 w-5',    // 20px - Medium icons (default, most UI elements)
  lg: 'h-6 w-6',    // 24px - Large icons (feature highlights, cards)
  xl: 'h-8 w-8',    // 32px - Extra large icons (hero sections, empty states)
  '2xl': 'h-12 w-12' // 48px - Very large icons (landing page features)
};

/**
 * Get consistent icon size classes
 * @param {IconSize} [size='md'] - The icon size variant
 * @returns {string} Tailwind CSS classes for icon sizing
 */
export const getIconSize = (size = 'md') => {
  return iconSizes[size] || iconSizes.md;
};

/**
 * Get consistent icon classes with size and color
 * @param {IconSize} [size='md'] - The icon size variant
 * @param {string} [color] - Optional color class
 * @returns {string} Complete Tailwind CSS classes for icons
 */
export const getIconClasses = (size = 'md', color) => {
  const sizeClass = getIconSize(size);
  return color ? `${sizeClass} ${color}` : sizeClass;
};

/**
 * Standard icon sizes for different use cases
 */
export const iconSizeUsage = {
  // Navigation and small UI elements
  navigation: 'sm',
  button: 'sm',
  badge: 'xs',
  
  // Default UI elements
  default: 'md',
  card: 'md',
  list: 'md',
  
  // Feature highlights and important elements
  feature: 'lg',
  highlight: 'lg',
  
  // Hero sections and large displays
  hero: 'xl',
  empty: 'xl',
  
  // Landing page and marketing
  landing: '2xl',
  marketing: '2xl'
};

