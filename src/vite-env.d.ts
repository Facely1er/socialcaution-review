/// <reference types="vite/client" />

// Google Analytics global types
declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

declare const gtag: ((...args: unknown[]) => void) | undefined;