import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import PersonalizedDashboard from '../PersonalizedDashboard';
import { analytics } from '../../utils/analytics.js';
import { ThemeProvider } from '../../contexts/ThemeContext';
import { TranslationProvider } from '../../contexts/TranslationContext';
import { NotificationProvider } from '../common/NotificationSystem';

// Mock analytics
vi.mock('../../utils/analytics.js', () => ({
  analytics: {
    trackPersonaDashboard: vi.fn(),
    trackFunnelStep: vi.fn(),
    trackFeatureUsage: vi.fn(),
  },
}));

// Mock child components
vi.mock('../common/EnhancedBreadcrumbs', () => ({
  default: () => <div data-testid="enhanced-breadcrumbs">Breadcrumbs</div>,
}));

vi.mock('../common/ThemeToggle', () => ({
  default: () => <div data-testid="theme-toggle">Theme Toggle</div>,
}));

vi.mock('../common/ContextualLinks', () => ({
  default: () => <div data-testid="contextual-links">Contextual Links</div>,
}));

vi.mock('../common/RelatedContent', () => ({
  default: () => <div data-testid="related-content">Related Content</div>,
}));

vi.mock('../common/ProgressTracker', () => ({
  default: () => <div data-testid="progress-tracker">Progress Tracker</div>,
}));

vi.mock('../common/InteractiveGuide', () => ({
  default: () => <div data-testid="interactive-guide">Interactive Guide</div>,
}));

vi.mock('../../data/personaProfiles', () => ({
  PersonaProfiles: {
    'cautious-parent': {
      id: 'cautious-parent',
      name: 'Cautious Parent',
      color: 'blue',
      resourceFilters: ['family', 'security'],
      primaryConcerns: ['family-protection'],
    },
  },
  PersonaColors: {
    blue: 'bg-blue-500',
  },
}));

vi.mock('../../utils/personaDetection', () => ({
  PersonaDetectionEngine: {
    getPersonalizedWelcome: vi.fn((persona) => `Welcome ${persona}!`),
  },
}));

const mockPersona = {
  primary: 'cautious-parent',
  secondary: 'digital-novice',
};

const mockAssessmentResults = {
  exposureScore: 65,
  rightsScore: 70,
  exposureResults: {},
  rightsResults: {},
  completedAt: new Date().toISOString(),
};

const mockUserProfile = {
  persona: mockPersona,
  results: mockAssessmentResults,
  createdAt: new Date().toISOString(),
};

const renderDashboard = (props = {}) => {
  const defaultProps = {
    userProfile: mockUserProfile,
    assessmentResults: mockAssessmentResults,
    persona: mockPersona,
    personalizedContent: null,
    ...props,
  };

  return render(
    <ThemeProvider>
      <TranslationProvider>
        <NotificationProvider>
          <BrowserRouter>
            <PersonalizedDashboard {...defaultProps} />
          </BrowserRouter>
        </NotificationProvider>
      </TranslationProvider>
    </ThemeProvider>
  );
};

describe('PersonalizedDashboard', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders loading state when dashboard data is not ready', () => {
    renderDashboard({ persona: null });
    expect(screen.getByText(/Loading your personalized dashboard/i)).toBeInTheDocument();
  });

  it('renders dashboard when data is available', async () => {
    renderDashboard();
    
    await waitFor(() => {
      expect(screen.queryByText(/Loading your personalized dashboard/i)).not.toBeInTheDocument();
    });

    expect(screen.getByText(/Welcome back/i)).toBeInTheDocument();
  });

  it('tracks analytics when dashboard is accessed', async () => {
    renderDashboard();

    await waitFor(() => {
      expect(analytics.trackPersonaDashboard).toHaveBeenCalledWith('cautious-parent');
      expect(analytics.trackFunnelStep).toHaveBeenCalledWith('dashboardViews', expect.any(Object));
    });
  });

  it('displays priority actions', async () => {
    renderDashboard();

    await waitFor(() => {
      expect(screen.getByText(/Priority Actions/i)).toBeInTheDocument();
    });
  });

  it('handles null persona gracefully', () => {
    renderDashboard({ persona: null });
    expect(screen.getByText(/Loading/i)).toBeInTheDocument();
  });

  it('handles null assessment results gracefully', () => {
    renderDashboard({ assessmentResults: null });
    expect(screen.getByText(/Loading/i)).toBeInTheDocument();
  });

  it('displays progress metrics', async () => {
    renderDashboard();

    await waitFor(() => {
      expect(screen.getByText(/Your Progress/i)).toBeInTheDocument();
    });
  });
});
