/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import App from '../App'

// Mock all the components and utilities
vi.mock('../utils/analytics.js', () => ({
  analytics: {
    init: vi.fn(),
    trackAssessmentComplete: vi.fn(),
  },
}))

vi.mock('../utils/assessmentScoring.js', () => ({
  calculateExposureScore: vi.fn(() => 75),
  calculateRightsScore: vi.fn(() => 80),
}))

vi.mock('../hooks/useLocalStorage', () => ({
  useLocalStorage: vi.fn(() => [null, vi.fn()]),
}))

// Mock all the page components
vi.mock('../components/HomePage', () => ({
  default: () => <div data-testid="home-page">Home Page</div>
}))

vi.mock('../components/AssessmentRouter', () => ({
  default: ({ onComplete }: { onComplete: (exposureResults: Record<string, unknown>, rightsResults: Record<string, unknown>, persona: Record<string, unknown>) => void }) => (
    <div data-testid="assessment-router" onClick={() => onComplete({}, {}, { primary: 'test' })}>
      Assessment Router
    </div>
  )
}))

vi.mock('../components/PersonalizedDashboard', () => ({
  default: () => <div data-testid="personalized-dashboard">Personalized Dashboard</div>
}))

vi.mock('../components/AdaptiveResources', () => ({
  default: () => <div data-testid="adaptive-resources">Adaptive Resources</div>
}))

vi.mock('../components/PersonalizedToolkit', () => ({
  default: () => <div data-testid="personalized-toolkit">Personalized Toolkit</div>
}))

vi.mock('../components/pages/HowItWorksPage', () => ({
  default: () => <div data-testid="how-it-works-page">How It Works Page</div>
}))

vi.mock('../components/pages/FAQPage', () => ({
  default: () => <div data-testid="faq-page">FAQ Page</div>
}))

vi.mock('../components/pages/ToolkitLandingPage', () => ({
  default: () => <div data-testid="toolkit-landing-page">Toolkit Landing Page</div>
}))

vi.mock('../components/legal/PrivacyPolicy', () => ({
  default: () => <div data-testid="privacy-policy">Privacy Policy</div>
}))

vi.mock('../components/legal/TermsOfService', () => ({
  default: () => <div data-testid="terms-of-service">Terms of Service</div>
}))

vi.mock('../components/business/ContactUs', () => ({
  default: () => <div data-testid="contact-us">Contact Us</div>
}))

vi.mock('../components/layout/Header', () => ({
  default: () => <div data-testid="header">Header</div>
}))

vi.mock('../components/layout/Footer', () => ({
  default: () => <div data-testid="footer">Footer</div>
}))

vi.mock('../components/common/ProductionOptimizer', () => ({
  default: ({ children }: any) => <div data-testid="production-optimizer">{children}</div>
}))

vi.mock('../components/common/NotificationSystem', () => ({
  NotificationProvider: ({ children }: any) => <div data-testid="notification-provider">{children}</div>
}))

vi.mock('../components/common/ProductionErrorBoundary', () => ({
  default: ({ children }: any) => <div data-testid="error-boundary">{children}</div>
}))

vi.mock('../contexts/ThemeContext.jsx', () => ({
  ThemeProvider: ({ children }: any) => <div data-testid="theme-provider">{children}</div>
}))

const renderApp = () => {
  return render(
    <BrowserRouter>
      <App />
    </BrowserRouter>
  )
}

describe('App', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders without crashing', () => {
    renderApp()
    expect(screen.getByTestId('theme-provider')).toBeInTheDocument()
  })

  it('renders the header and footer', () => {
    renderApp()
    expect(screen.getByTestId('header')).toBeInTheDocument()
    expect(screen.getByTestId('footer')).toBeInTheDocument()
  })

  it('renders the home page by default', () => {
    renderApp()
    expect(screen.getByTestId('home-page')).toBeInTheDocument()
  })

  it('renders all the context providers', () => {
    renderApp()
    expect(screen.getByTestId('theme-provider')).toBeInTheDocument()
    expect(screen.getByTestId('production-optimizer')).toBeInTheDocument()
    expect(screen.getByTestId('notification-provider')).toBeInTheDocument()
  })
})
