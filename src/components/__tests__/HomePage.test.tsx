/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import HomePage from '../HomePage'
import { ThemeProvider } from '../../contexts/ThemeContext'
import { TranslationProvider } from '../../contexts/TranslationContext'

// Mock the analytics module
vi.mock('../../utils/analytics.js', () => ({
  analytics: {
    trackFunnelStep: vi.fn(),
  },
}))

// Mock the SEOHead and StructuredData components
vi.mock('../common/SEOHead', () => ({
  default: ({ title }: { title: string }) => <div data-testid="seo-head">{title}</div>
}))

vi.mock('../seo/StructuredData', () => ({
  default: () => <div data-testid="structured-data">Structured Data</div>
}))

// Mock the FeatureModal component
vi.mock('../common/FeatureModal', () => ({
  default: ({ isOpen, onClose, feature }: any) => 
    isOpen ? (
      <div data-testid="feature-modal" onClick={onClose}>
        {feature?.title}
      </div>
    ) : null
}))

const renderWithRouter = (component: React.ReactElement) => {
  return render(
    <ThemeProvider>
      <TranslationProvider>
        <BrowserRouter>
          {component}
        </BrowserRouter>
      </TranslationProvider>
    </ThemeProvider>
  )
}

describe('HomePage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders the main heading', () => {
    renderWithRouter(<HomePage />)
    
    // Check for the h1 element and its text content
    const heading = screen.getByRole('heading', { level: 1 })
    expect(heading).toBeInTheDocument()
    expect(heading).toHaveTextContent('The first truly')
    expect(heading).toHaveTextContent('personalized')
    expect(heading).toHaveTextContent('privacy platform')
  })

  it('renders assessment options', () => {
    renderWithRouter(<HomePage />)
    
    expect(screen.getByText('Privacy Risk Exposure Assessment')).toBeInTheDocument()
    expect(screen.getByText('Privacy Rights Knowledge Checkup')).toBeInTheDocument()
    expect(screen.getByText('Complete Assessment')).toBeInTheDocument()
  })

  it('renders core features', () => {
    renderWithRouter(<HomePage />)
    
    expect(screen.getByText('AI-Powered Persona Detection')).toBeInTheDocument()
    expect(screen.getByText('Zero Data Collection')).toBeInTheDocument()
    expect(screen.getByText('Instant Personalization')).toBeInTheDocument()
  })

  it('renders trust indicators', () => {
    renderWithRouter(<HomePage />)
    
    expect(screen.getByText('100%')).toBeInTheDocument()
    expect(screen.getByText('Local Processing')).toBeInTheDocument()
    expect(screen.getByText('0')).toBeInTheDocument()
    expect(screen.getByText('Data Collected')).toBeInTheDocument()
  })

  it('opens feature modal when feature is clicked', () => {
    renderWithRouter(<HomePage />)
    
    // Find the feature card by looking for the h3 element containing the title
    const featureTitle = screen.getByRole('heading', { name: 'AI-Powered Persona Detection' })
    const featureCard = featureTitle.closest('div')
    fireEvent.click(featureCard!)
    
    expect(screen.getByTestId('feature-modal')).toBeInTheDocument()
    // Check that the modal contains the feature title
    expect(screen.getByTestId('feature-modal')).toHaveTextContent('AI-Powered Persona Detection')
  })

  it('closes feature modal when close is triggered', () => {
    renderWithRouter(<HomePage />)
    
    // Open modal
    const featureCard = screen.getByText('AI-Powered Persona Detection').closest('div')
    fireEvent.click(featureCard!)
    
    expect(screen.getByTestId('feature-modal')).toBeInTheDocument()
    
    // Close modal
    fireEvent.click(screen.getByTestId('feature-modal'))
    
    expect(screen.queryByTestId('feature-modal')).not.toBeInTheDocument()
  })

  it('renders CTA section', () => {
    renderWithRouter(<HomePage />)
    
    expect(screen.getByText('Ready to Take Action on Your Privacy?')).toBeInTheDocument()
    expect(screen.getByText('Quick Risk Check (5 min)')).toBeInTheDocument()
    expect(screen.getByText('Complete Assessment (12 min)')).toBeInTheDocument()
  })
})
