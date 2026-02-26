import React from 'react';

interface TranslationContextValue {
  currentLanguage: string;
  translations: Record<string, unknown>;
  isLoading: boolean;
  changeLanguage: (langCode: string) => Promise<void>;
  t: (key: string, params?: Record<string, unknown>) => string | unknown;
  getSupportedLanguages: () => Array<{ code: string; name: string; nativeName: string }>;
}

export const useTranslation: () => TranslationContextValue;

interface TranslationProviderProps {
  children: React.ReactNode;
}

export const TranslationProvider: React.FC<TranslationProviderProps>;

interface LanguageSelectorProps {
  className?: string;
}

export const LanguageSelector: React.FC<LanguageSelectorProps>;

interface TranslatableTextProps {
  translationKey: string;
  params?: Record<string, unknown>;
  fallback?: string;
  className?: string;
}

export const TranslatableText: React.FC<TranslatableTextProps>;

export const useRTL: () => boolean;

export const useDateFormat: () => {
  formatDate: (date: Date, options?: Intl.DateTimeFormatOptions) => string;
  formatTime: (date: Date, options?: Intl.DateTimeFormatOptions) => string;
};

export const useNumberFormat: () => {
  formatNumber: (number: number, options?: Intl.NumberFormatOptions) => string;
  formatCurrency: (amount: number, currency?: string, options?: Intl.NumberFormatOptions) => string;
  formatPercentage: (value: number, options?: Intl.NumberFormatOptions) => string;
};

export default TranslationProvider;

