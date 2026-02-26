import type { FC, ReactNode } from 'react';

export interface BreadcrumbItem {
  name: ReactNode;
  href: string;
  current: boolean;
  description?: string;
}

export interface EnhancedBreadcrumbsProps {
  personaColor?: { accent?: string; button?: string } | null;
  customBreadcrumbs?: BreadcrumbItem[] | null;
  showHome?: boolean;
  className?: string;
  hideWhenSecondaryNavVisible?: boolean;
}

declare const EnhancedBreadcrumbs: FC<EnhancedBreadcrumbsProps>;
export default EnhancedBreadcrumbs;
