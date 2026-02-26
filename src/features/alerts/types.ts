/**
 * Types for homepage alerts carousel
 * Maps Radar signals to carousel display format
 */

export type HomeAlertSeverity = 'low' | 'med' | 'high';

export interface HomeAlert {
  id: string;
  title: string;
  description: string;
  scopeTag?: string;
  statusTag?: string;
  severity?: HomeAlertSeverity;
  href?: string;
  date?: string; // ISO date string for filtering and sorting
}
