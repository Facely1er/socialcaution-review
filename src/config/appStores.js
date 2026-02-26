/**
 * App Store Configuration
 *
 * URLs for SocialCaution mobile app on Apple App Store and Google Play Store.
 * Set these in your .env file:
 *
 *   VITE_APP_STORE_IOS=https://apps.apple.com/app/socialcaution/idXXXXXXXXX
 *   VITE_APP_STORE_ANDROID=https://play.google.com/store/apps/details?id=com.socialcaution.app
 */

export const APP_STORE_IOS =
  import.meta.env.VITE_APP_STORE_IOS ||
  'https://apps.apple.com/app/socialcaution/id6757679461';

export const APP_STORE_ANDROID =
  import.meta.env.VITE_APP_STORE_ANDROID ||
  'https://play.google.com/store/apps/details?id=com.facely1er.socialcaution.mobile';

/** Base URL for app download page (used in QR codes, share links) */
export const APP_DOWNLOAD_PAGE_URL =
  import.meta.env.VITE_APP_DOWNLOAD_URL || 'https://socialcaution.app/download';

/**
 * Official store badge images. Place the correct assets in public/badges/:
 * - From "Download-on-the-App-Store" folder → app-store-badge.svg (or .png)
 * - From "Google Play Badge guidelines" folder → google-play-badge.png
 * No CDN fallback; if files are missing, text buttons are shown instead.
 */
export const APP_STORE_BADGE_IMAGE = '/badges/app-store-badge.svg';
export const GOOGLE_PLAY_BADGE_IMAGE = '/badges/google-play-badge.png';

/** Shared badge display size so App Store and Google Play match */
export const BADGE_WIDTH = 130;
export const BADGE_HEIGHT = 40;
