import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from '../../contexts/ThemeContext';
import { TranslationProvider } from '../../contexts/TranslationContext';
import ContactUs from '../business/ContactUs';

// Mock dependencies
vi.mock('../../utils/monitoring.jsx', () => ({
  MonitoringService: {
    logBusinessMetric: vi.fn(),
  },
}));

vi.mock('../../utils/security', () => ({
  SecurityUtils: {
    sanitizeInput: vi.fn((input) => input),
  },
}));

// Mock SEOHead
vi.mock('../common/SEOHead', () => ({
  default: () => <div data-testid="seo-head">SEO Head</div>,
}));

// Mock fetch
global.fetch = vi.fn();

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

describe('ContactUs', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (global.fetch as MockFetch).mockClear();
  });

  it('renders the contact form', () => {
    renderWithProviders(<ContactUs />);
    expect(screen.getByText(/Contact Us/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Message/i)).toBeInTheDocument();
  });

  it('validates required fields', async () => {
    renderWithProviders(<ContactUs />);

    const submitButton = screen.getByRole('button', { name: /Send Message/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/Name is required/i)).toBeInTheDocument();
    });
  });

  it('validates email format', async () => {
    renderWithProviders(<ContactUs />);

    const emailInput = screen.getByLabelText(/Email/i);
    const submitButton = screen.getByRole('button', { name: /Send Message/i });

    fireEvent.change(emailInput, { target: { value: 'invalid-email' } });
    fireEvent.change(screen.getByLabelText(/Name/i), { target: { value: 'Test User' } });
    fireEvent.change(screen.getByLabelText(/Message/i), { target: { value: 'Test message content' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/Please enter a valid email address/i)).toBeInTheDocument();
    });
  });

  it('validates message minimum length', async () => {
    renderWithProviders(<ContactUs />);

    const nameInput = screen.getByLabelText(/Name/i);
    const emailInput = screen.getByLabelText(/Email/i);
    const messageInput = screen.getByLabelText(/Message/i);
    const submitButton = screen.getByRole('button', { name: /Send Message/i });

    fireEvent.change(nameInput, { target: { value: 'Test User' } });
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(messageInput, { target: { value: 'short' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/Message must be at least 10 characters/i)).toBeInTheDocument();
    });
  });

  it('submits form successfully', async () => {
    (global.fetch as MockFetch).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true, message: 'Message sent' }),
    });

    renderWithProviders(<ContactUs />);

    const nameInput = screen.getByLabelText(/Name/i);
    const emailInput = screen.getByLabelText(/Email/i);
    const messageInput = screen.getByLabelText(/Message/i);
    const submitButton = screen.getByRole('button', { name: /Send Message/i });

    fireEvent.change(nameInput, { target: { value: 'Test User' } });
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(messageInput, { target: { value: 'This is a test message with enough characters' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/Message Sent Successfully/i)).toBeInTheDocument();
    });

    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('/api/contact'),
      expect.objectContaining({
        method: 'POST',
        headers: expect.objectContaining({
          'Content-Type': 'application/json',
        }),
      })
    );
  });

  it('handles API errors gracefully', async () => {
    (global.fetch as MockFetch).mockRejectedValueOnce(new Error('Network error'));

    renderWithProviders(<ContactUs />);

    const nameInput = screen.getByLabelText(/Name/i);
    const emailInput = screen.getByLabelText(/Email/i);
    const messageInput = screen.getByLabelText(/Message/i);
    const submitButton = screen.getByRole('button', { name: /Send Message/i });

    fireEvent.change(nameInput, { target: { value: 'Test User' } });
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(messageInput, { target: { value: 'This is a test message with enough characters' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/Failed to send message/i)).toBeInTheDocument();
    });
  });

  it('displays response time information', () => {
    renderWithProviders(<ContactUs />);
    expect(screen.getByText(/Response Time/i)).toBeInTheDocument();
    expect(screen.getByText(/24-48 hours/i)).toBeInTheDocument();
  });

  it('displays direct contact information', () => {
    renderWithProviders(<ContactUs />);
    expect(screen.getByText(/Direct Contact/i)).toBeInTheDocument();
    expect(screen.getByText(/support@ermits.com/i)).toBeInTheDocument();
  });
});
