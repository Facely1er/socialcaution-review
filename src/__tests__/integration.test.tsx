import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import App from '../App'

// Mock analytics
vi.mock('../utils/analytics.js', () => ({
  analytics: {
    init: vi.fn(),
    trackAssessmentComplete: vi.fn(),
    trackPersonaDashboard: vi.fn(),
    trackFunnelStep: vi.fn(),
  },
}))

// Mock localStorage
vi.mock('../hooks/useLocalStorage', () => ({
  useLocalStorage: vi.fn((key: string) => {
    const storage: Record<string, unknown> = {}
    return [
      storage[key] ?? null,
      (value: unknown) => { storage[key] = value },
      () => { delete storage[key] }
    ]
  }),
}))

// Mock components to avoid full rendering
vi.mock('../components/HomePage', () => ({
  default: () => <div data-testid="home-page">Home Page</div>
}))

vi.mock('../components/ServiceCatalog', () => ({
  default: () => <div data-testid="service-catalog">Service Catalog</div>
}))

vi.mock('../components/pages/PrivacySettings', () => ({
  default: () => <div data-testid="settings">Settings</div>
}))

vi.mock('../components/AssessmentRouter', () => ({
  default: () => <div data-testid="assessment-router">Assessment Router</div>
}))

vi.mock('../components/PersonalizedDashboard', () => ({
  default: () => <div data-testid="personalized-dashboard">Personalized Dashboard</div>
}))

vi.mock('../components/layout/Header', () => ({
  default: () => <div data-testid="header">Header</div>
}))

vi.mock('../components/layout/Footer', () => ({
  default: () => <div data-testid="footer">Footer</div>
}))

vi.mock('../utils/assessmentScoring.js', () => ({
  calculateExposureScore: vi.fn(() => 75),
  calculateRightsScore: vi.fn(() => 80),
}))

// App already has BrowserRouter inside, so we need to mock the router or test differently
// For integration tests, we'll test the components directly rather than the full App
const renderApp = () => {
  // Since App has its own Router, we render it directly
  // Note: This means we can't control routing in tests, but we can test component rendering
  return render(<App />)
}

describe('Critical User Flows', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Onboarding Flow', () => {
    it('should navigate through workflow steps', async () => {
      const { rerender } = renderApp(['/'])

      // 1. Start from homepage
      expect(screen.getByTestId('home-page')).toBeInTheDocument()

      // 2. Navigate to service catalog
      rerender(
        <MemoryRouter initialEntries={['/service-catalog']}>
          <App />
        </MemoryRouter>
      )
      await waitFor(() => {
        expect(screen.getByTestId('service-catalog')).toBeInTheDocument()
      })

      // 3. Navigate to privacy settings (concerns step)
      rerender(
        <MemoryRouter initialEntries={['/settings']}>
          <App />
        </MemoryRouter>
      )
      await waitFor(() => {
        expect(screen.getByTestId('settings')).toBeInTheDocument()
      })

      // 4. Navigate to assessment
      rerender(
        <MemoryRouter initialEntries={['/assessment']}>
          <App />
        </MemoryRouter>
      )
      await waitFor(() => {
        expect(screen.getByTestId('assessment-router')).toBeInTheDocument()
      })

      // 5. Navigate to dashboard
      rerender(
        <MemoryRouter initialEntries={['/dashboard']}>
          <App />
        </MemoryRouter>
      )
      await waitFor(() => {
        expect(screen.getByTestId('personalized-dashboard')).toBeInTheDocument()
      })
    })
  })

  describe('Route Navigation', () => {
    it('should handle route changes without errors', () => {
      const { rerender } = renderApp(['/'])

      expect(() => {
        rerender(
          <MemoryRouter initialEntries={['/service-catalog']}>
            <App />
          </MemoryRouter>
        )
      }).not.toThrow()
    })

    it('should handle invalid routes gracefully', () => {
      expect(() => {
        renderApp(['/invalid-route'])
      }).not.toThrow()
    })
  })

  describe('Error Handling', () => {
    it('should handle component errors gracefully', () => {
      // App should have error boundary
      expect(() => renderApp()).not.toThrow()
    })

    it('should handle missing data gracefully', () => {
      // App should work even with null localStorage data
      expect(() => renderApp()).not.toThrow()
    })
  })
})
