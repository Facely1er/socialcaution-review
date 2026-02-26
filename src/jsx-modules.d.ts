// Global type declarations for JSX modules
// This allows TypeScript to recognize .jsx files as valid React component modules

import { ComponentType, FC } from 'react';

// Wildcard declaration for all .jsx files
declare module '*.jsx' {
  const Component: ComponentType<Record<string, unknown>>;
  export default Component;
}

// Helper type for components that accept any props
type AnyComponent = FC<Record<string, unknown>> | ComponentType<Record<string, unknown>>;

// Specific module declarations for JSX files imported without extension
// These match the imports in App.tsx and declare default exports
// Using FC<Record<string, unknown>> allows components to accept any props without type errors

declare module './components/layout/Header' {
  const Component: FC<Record<string, unknown>>;
  export default Component;
}

declare module './components/layout/SecondaryNavigationBar' {
  const Component: FC<Record<string, unknown>>;
  export default Component;
}

declare module './components/common/ProductionOptimizer' {
  const Component: FC<Record<string, unknown>>;
  export default Component;
}

declare module './components/HomePage' {
  const Component: FC<Record<string, unknown>>;
  export default Component;
}

declare module './components/layout/Footer' {
  const Component: FC<Record<string, unknown>>;
  export default Component;
}

declare module './components/common/MetaTagManager' {
  const Component: FC<Record<string, unknown>>;
  export default Component;
}

declare module './components/common/SkipLink' {
  const Component: FC<Record<string, unknown>>;
  export default Component;
}

declare module './components/common/LoadingSpinner' {
  const Component: FC<Record<string, unknown>>;
  export default Component;
}

declare module './components/pages/NotFoundPage' {
  const Component: FC<Record<string, unknown>>;
  export default Component;
}

declare module './components/common/OfflineIndicator' {
  const Component: FC<Record<string, unknown>>;
  export default Component;
}

declare module './components/common/PWAInstallPrompt' {
  const Component: FC<Record<string, unknown>>;
  export default Component;
}

declare module './components/common/PWAUpdateNotification' {
  const Component: FC<Record<string, unknown>>;
  export default Component;
}

declare module './components/pages/AssessmentPage' {
  const Component: FC<Record<string, unknown>>;
  export default Component;
}

declare module './components/AssessmentRouter' {
  const Component: FC<Record<string, unknown>>;
  export default Component;
}

declare module './components/PersonalizedDashboard' {
  const Component: FC<Record<string, unknown>>;
  export default Component;
}

declare module './components/AdaptiveResources' {
  const Component: FC<Record<string, unknown>>;
  export default Component;
}

declare module './components/PersonalizedToolkit' {
  const Component: FC<Record<string, unknown>>;
  export default Component;
}

declare module './components/PrivacyToolsDirectory' {
  const Component: FC<Record<string, unknown>>;
  export default Component;
}

declare module './components/ServiceCatalog' {
  const Component: FC<Record<string, unknown>>;
  export default Component;
}

declare module './components/alerts/CautionAlertFeed' {
  const Component: FC<Record<string, unknown>>;
  export default Component;
}

declare module './components/pages/HowItWorksPage' {
  const Component: FC<Record<string, unknown>>;
  export default Component;
}

declare module './components/pages/PersonaSelection' {
  const Component: FC<Record<string, unknown>>;
  export default Component;
}

declare module './components/pages/PrivacySettings' {
  const Component: FC<Record<string, unknown>>;
  export default Component;
}

declare module './components/legal/PrivacyPolicy' {
  const Component: FC<Record<string, unknown>>;
  export default Component;
}

declare module './components/legal/TermsOfService' {
  const Component: FC<Record<string, unknown>>;
  export default Component;
}

declare module './components/legal/CookiePolicy' {
  const Component: FC<Record<string, unknown>>;
  export default Component;
}

declare module './components/legal/AcceptableUsePolicy' {
  const Component: FC<Record<string, unknown>>;
  export default Component;
}

declare module './components/business/ContactUs' {
  const Component: FC<Record<string, unknown>>;
  export default Component;
}

declare module './components/tools/PersonalDataInventory' {
  const Component: FC<Record<string, unknown>>;
  export default Component;
}

declare module './components/tools/DataBrokerRemovalTool' {
  const Component: FC<Record<string, unknown>>;
  export default Component;
}

declare module './components/privacy/PrivacyAssistantBot' {
  const Component: FC<Record<string, unknown>>;
  export default Component;
}

declare module './components/privacy/InteractiveActionPlanner' {
  const Component: FC<Record<string, unknown>>;
  export default Component;
}

declare module './blog/pages/BlogPage' {
  const Component: FC<Record<string, unknown>>;
  export default Component;
}

declare module './blog/posts/PrivacyImportanceBlogPost' {
  const Component: FC<Record<string, unknown>>;
  export default Component;
}

declare module './blog/posts/DataProtectionLawsBlogPost' {
  const Component: FC<Record<string, unknown>>;
  export default Component;
}
