import { describe, it, expect } from 'vitest';
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TranslationProvider, useTranslation } from '../contexts/TranslationContext';

function Consumer() {
  const { t, changeLanguage, currentLanguage } = useTranslation();

  return (
    <div>
      <div data-testid="lang">{currentLanguage}</div>
      <div data-testid="home">{String(t('common.navigation.home'))}</div>
      <button type="button" onClick={() => changeLanguage('fr')}>FR</button>
      <button type="button" onClick={() => changeLanguage('es')}>ES</button>
    </div>
  );
}

describe('Translation toggle', () => {
  it('switches UI strings when language changes', async () => {
    const user = userEvent.setup();

    render(
      <TranslationProvider>
        <Consumer />
      </TranslationProvider>
    );

    // Default (English)
    await waitFor(() => {
      expect(screen.getByTestId('home').textContent).toBe('Home');
    });

    // Switch to French
    await user.click(screen.getByRole('button', { name: 'FR' }));
    await waitFor(() => {
      expect(screen.getByTestId('lang').textContent).toBe('fr');
      expect(screen.getByTestId('home').textContent).toBe('Accueil');
    });

    // Switch to Spanish
    await user.click(screen.getByRole('button', { name: 'ES' }));
    await waitFor(() => {
      expect(screen.getByTestId('lang').textContent).toBe('es');
      expect(screen.getByTestId('home').textContent).toBe('Inicio');
    });
  });
});

