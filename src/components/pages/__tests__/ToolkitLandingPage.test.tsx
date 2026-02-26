import React from 'react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from '../../../contexts/ThemeContext';
import { TranslationProvider } from '../../../contexts/TranslationContext';
import ToolkitLandingPage from '../ToolkitLandingPage';

// Mock dependencies
vi.mock('../common/SEOHead', () => ({
  default: () => <div data-testid="seo-head">SEO Head</div>,
}));

vi.mock('../common/LoadingSpinner', () => ({
  default: () => <div data-testid="loading-spinner">Loading...</div>,
}));

// Mock useNavigate
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// Mock fetch
global.fetch = vi.fn();

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};

const sessionStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};

Object.defineProperty(window, 'localStorage', { value: localStorageMock });
Object.defineProperty(window, 'sessionStorage', { value: sessionStorageMock });

type MockFetch = ReturnType<typeof vi.fn>;

const renderWithProviders = (component: React.ReactElement) => {
  return render(
    <BrowserRouter>
      <ThemeProvider>
        <TranslationProvider>
          {component}
        </TranslationProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
};

describe('ToolkitLandingPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockNavigate.mockClear();
    localStorageMock.getItem.mockClear();
    sessionStorageMock.getItem.mockClear();
    (global.fetch as MockFetch).mockClear();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders loading state initially', () => {
    localStorageMock.getItem.mockReturnValue(null);
    renderWithProviders(<ToolkitLandingPage />);
    // Check for loading text instead of test ID
    expect(screen.getByText(/Checking toolkit access/i)).toBeInTheDocument();
  });

  it('redirects authenticated users to toolkit', async () => {
    const mockProfile = JSON.stringify({ persona: { primary: 'cautious-parent' } });
    localStorageMock.getItem.mockImplementation((key) => {
      if (key === 'socialcaution_profile') return mockProfile;
      return null;
    });
    sessionStorageMock.getItem.mockReturnValue(null);

    // Mock API failure (development fallback)
    (global.fetch as MockFetch).mockRejectedValueOnce(new Error('Network error'));

    renderWithProviders(<ToolkitLandingPage />);

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/toolkit-access');
    }, { timeout: 3000 });
  });

  it('shows assessment required message for unauthenticated users', async () => {
    localStorageMock.getItem.mockReturnValue(null);
    sessionStorageMock.getItem.mockReturnValue(null);

    renderWithProviders(<ToolkitLandingPage />);

    await waitFor(() => {
      expect(screen.getByText(/Assessment Required for Toolkit Access/i)).toBeInTheDocument();
    });
  });

  it('navigates to assessment when button is clicked', async () => {
    localStorageMock.getItem.mockReturnValue(null);

    renderWithProviders(<ToolkitLandingPage />);

    await waitFor(() => {
      const button = screen.getByText(/Complete Assessment First/i);
      button.click();
    });

    expect(mockNavigate).toHaveBeenCalledWith('/assessment/full');
  });

  it('handles API authentication check', async () => {
    const mockToken = 'test_token_123';
    const mockProfile = JSON.stringify({ persona: { primary: 'cautious-parent' } });
    
    sessionStorageMock.getItem.mockImplementation((key) => {
      if (key === 'authToken') return mockToken;
      return null;
    });
    localStorageMock.getItem.mockImplementation((key) => {
      if (key === 'socialcaution_profile') return mockProfile;
      return null;
    });

    (global.fetch as MockFetch).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ hasAccess: true, assessmentCompleted: true }),
    });

    renderWithProviders(<ToolkitLandingPage />);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/verify-toolkit-access'),
        expect.objectContaining({
          method: 'GET',
          headers: expect.objectContaining({
            'Authorization': `Bearer ${mockToken}`,
          }),
        })
      );
    });
  });

  it('clears invalid tokens on 401 response', async () => {
    const mockToken = 'invalid_token';
    sessionStorageMock.getItem.mockReturnValue(mockToken);

    (global.fetch as MockFetch).mockResolvedValueOnce({
      ok: false,
      status: 401,
    });

    renderWithProviders(<ToolkitLandingPage />);

    await waitFor(() => {
      expect(localStorageMock.removeItem).toHaveBeenCalledWith('authToken');
      expect(sessionStorageMock.removeItem).toHaveBeenCalledWith('authToken');
    });
  });

  it('displays toolkit benefits', async () => {
    localStorageMock.getItem.mockReturnValue(null);

    renderWithProviders(<ToolkitLandingPage />);

    await waitFor(() => {
      expect(screen.getByText(/What You'll Get with Toolkit Access/i)).toBeInTheDocument();
      expect(screen.getByText(/Personalized Tool Selection/i)).toBeInTheDocument();
      expect(screen.getByText(/Step-by-Step Guidance/i)).toBeInTheDocument();
    });
  });
});
