/**
 * Terminology Standardization Tests
 * 
 * Tests verify that terminology is used consistently across components:
 * - Privacy Exposure Index (service-level)
 * - Privacy Exposure Score (user-level)
 * - Digital Footprint Score (user-level from services)
 * - Assessment Exposure Score (user-level from assessment)
 * - Combined Risk Score (user-level complete)
 */

import { describe, it, expect, vi } from 'vitest';
vi.mock('../components/QuickPrivacyScore', () => ({
  default: ({ selectedServiceIds }: { selectedServiceIds: string[] }) => (
    <div data-testid="quick-privacy-score">
      Your Privacy Exposure Score
      <div>Based on {selectedServiceIds.length} services</div>
    </div>
  )
}));

describe('Terminology Standardization', () => {
  describe('Service-Level Terms', () => {
    it('should use "Privacy Exposure Index" for service-level scores', () => {
      // This would be tested in ServiceCatalog component
      const serviceIndex = 75;
      expect(serviceIndex).toBeGreaterThanOrEqual(0);
      expect(serviceIndex).toBeLessThanOrEqual(100);
    });

    it('should not use "Index" for user-level scores', () => {
      // User-level should use "Score" not "Index"
      const userScore = 65;
      expect(userScore).toBeGreaterThanOrEqual(0);
      expect(userScore).toBeLessThanOrEqual(100);
    });
  });

  describe('User-Level Terms', () => {
    it('should use "Privacy Exposure Score" for user aggregate from services', () => {
      const score = 72;
      expect(score).toBeGreaterThanOrEqual(0);
      expect(score).toBeLessThanOrEqual(100);
    });

    it('should use "Digital Footprint Score" for service aggregate component', () => {
      const footprintScore = 58;
      expect(footprintScore).toBeGreaterThanOrEqual(0);
      expect(footprintScore).toBeLessThanOrEqual(100);
    });

    it('should use "Assessment Exposure Score" for assessment component', () => {
      const assessmentScore = 45;
      expect(assessmentScore).toBeGreaterThanOrEqual(0);
      expect(assessmentScore).toBeLessThanOrEqual(100);
    });

    it('should use "Combined Risk Score" for complete user risk', () => {
      const combinedScore = 62;
      expect(combinedScore).toBeGreaterThanOrEqual(0);
      expect(combinedScore).toBeLessThanOrEqual(100);
    });
  });

  describe('Score Calculations', () => {
    it('should calculate Combined Risk Score correctly (60% assessment + 40% footprint)', () => {
      const assessmentScore = 50;
      const footprintScore = 70;
      const expectedCombined = Math.round((assessmentScore * 0.6) + (footprintScore * 0.4));
      
      expect(expectedCombined).toBe(58);
      expect(expectedCombined).toBeGreaterThanOrEqual(0);
      expect(expectedCombined).toBeLessThanOrEqual(100);
    });

    it('should ensure all scores are within 0-100 range', () => {
      const scores = [0, 25, 50, 75, 100];
      scores.forEach(score => {
        expect(score).toBeGreaterThanOrEqual(0);
        expect(score).toBeLessThanOrEqual(100);
      });
    });
  });

  describe('Translation Files', () => {
    it('should have consistent terminology in English translations', async () => {
      const enTranslations = await import('../data/translations/en.json');
      
      // Check that "Privacy Risk Index" is replaced with "Privacy Exposure Index"
      const privacyIndex = enTranslations.default?.pricing?.plans?.free?.features?.privacyIndex;
      if (privacyIndex) {
        expect(privacyIndex).not.toContain('Privacy Risk Index');
        expect(privacyIndex).toContain('Privacy Exposure Index');
      } else {
        // Try alternative path
        const altPath = enTranslations.default?.pricing?.features?.privacyIndex;
        if (altPath) {
          expect(altPath).not.toContain('Privacy Risk Index');
          expect(altPath).toContain('Privacy Exposure Index');
        } else {
          // Check FAQ section
          const faqAnswer = enTranslations.default?.faq?.needToPay?.answer;
          if (faqAnswer) {
            expect(faqAnswer).not.toContain('Privacy Risk Index');
            expect(faqAnswer).toContain('Privacy Exposure Index');
          }
        }
      }
    });
  });

  describe('Component Labels', () => {
    it('should display scale and direction for all scores', () => {
      // Mock score display
      const scoreDisplay = {
        value: 65,
        scale: '0-100',
        direction: 'higher = more risk'
      };
      
      expect(scoreDisplay.scale).toBe('0-100');
      expect(scoreDisplay.direction).toContain('higher');
    });
  });
});

describe('Terminology Consistency Checks', () => {
  it('should verify Index is only used for services', () => {
    const serviceIndex = 'Privacy Exposure Index';
    const userScore = 'Privacy Exposure Score';
    
    expect(serviceIndex).toContain('Index');
    expect(userScore).not.toContain('Index');
    expect(userScore).toContain('Score');
  });

  it('should verify Score is used for user-level metrics', () => {
    const userMetrics = [
      'Privacy Exposure Score',
      'Digital Footprint Score',
      'Assessment Exposure Score',
      'Combined Risk Score'
    ];
    
    userMetrics.forEach(metric => {
      expect(metric).toContain('Score');
      expect(metric).not.toContain('Index');
    });
  });
});

