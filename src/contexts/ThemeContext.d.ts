import React from 'react';

interface ThemeContextValue {
  theme: 'light' | 'dark';
  updateTheme: (theme: 'light' | 'dark') => void;
}

export const useTheme: () => ThemeContextValue;

interface ThemeProviderProps {
  children: React.ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps>;

declare const ThemeContext: React.Context<ThemeContextValue>;
export default ThemeContext;

