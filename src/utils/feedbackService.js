/**
 * Feedback Service
 * Centralized service for handling feedback collection and tracking
 */

import { analytics } from './analytics';
import { MonitoringService } from './monitoring';

class FeedbackService {
  constructor() {
    this.feedbackQueue = [];
    this.isOnline = typeof navigator !== 'undefined' ? navigator.onLine : true;
    
    // Listen for online/offline events
    if (typeof window !== 'undefined') {
      window.addEventListener('online', () => {
        this.isOnline = true;
        this.processQueue();
      });
      window.addEventListener('offline', () => {
        this.isOnline = false;
      });
    }
  }

  /**
   * Submit feedback
   * @param {Object} feedbackData - Feedback data object
   * @param {string} feedbackData.type - Type of feedback ('assessment', 'feature', 'general')
   * @param {number} feedbackData.rating - Rating (1-5)
   * @param {string} feedbackData.category - Feedback category
   * @param {string} feedbackData.text - Feedback text
   * @param {Object} feedbackData.metadata - Additional metadata
   */
  async submitFeedback(feedbackData) {
    const {
      type,
      rating,
      category = 'general',
      text = '',
      metadata = {}
    } = feedbackData;

    // Validate required fields
    if (!type || !rating) {
      console.warn('FeedbackService: Missing required fields (type, rating)');
      return;
    }

    const feedback = {
      type,
      rating,
      category,
      text,
      metadata,
      timestamp: new Date().toISOString(),
      user_agent: typeof navigator !== 'undefined' ? navigator.userAgent : 'unknown',
      session_id: this.getSessionId()
    };

    // Track in analytics immediately
    this.trackFeedback(feedback);

    // Try to send to backend
    if (this.isOnline) {
      try {
        await this.sendToBackend(feedback);
      } catch (error) {
        // Queue for later if offline or backend fails
        this.queueFeedback(feedback);
      }
    } else {
      // Queue for later if offline
      this.queueFeedback(feedback);
    }
  }

  /**
   * Track feedback in analytics
   * @param {Object} feedback - Feedback data
   */
  trackFeedback(feedback) {
    // Google Analytics
    if (analytics && typeof analytics.trackEvent === 'function') {
      analytics.trackEvent('feedback_submitted', {
        event_category: 'feedback',
        feedback_type: feedback.type,
        rating: feedback.rating,
        category: feedback.category,
        has_text: feedback.text.length > 0,
        text_length: feedback.text.length
      });
    }

    // Business metrics
    if (MonitoringService && typeof MonitoringService.logBusinessMetric === 'function') {
      MonitoringService.logBusinessMetric('feedback_submission', 1, {
        feedback_type: feedback.type,
        rating: feedback.rating,
        category: feedback.category,
        has_text_feedback: feedback.text.length > 0
      });
    }
  }

  /**
   * Send feedback to backend
   * @param {Object} feedback - Feedback data
   */
  async sendToBackend(feedback) {
    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || '/api';
    const feedbackEndpoint = `${apiBaseUrl}/feedback`;

    const response = await fetch(feedbackEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(feedback)
    });

    if (!response.ok) {
      throw new Error(`Backend error: ${response.status}`);
    }

    return response.json();
  }

  /**
   * Queue feedback for later submission
   * @param {Object} feedback - Feedback data
   */
  queueFeedback(feedback) {
    this.feedbackQueue.push(feedback);
    
    // Store in localStorage as backup
    try {
      const queue = JSON.parse(localStorage.getItem('feedback_queue') || '[]');
      queue.push(feedback);
      localStorage.setItem('feedback_queue', JSON.stringify(queue));
    } catch (error) {
      console.warn('Failed to queue feedback in localStorage:', error);
    }
  }

  /**
   * Process queued feedback
   */
  async processQueue() {
    if (!this.isOnline || this.feedbackQueue.length === 0) {
      return;
    }

    // Load from localStorage
    try {
      const storedQueue = JSON.parse(localStorage.getItem('feedback_queue') || '[]');
      this.feedbackQueue = [...this.feedbackQueue, ...storedQueue];
      localStorage.removeItem('feedback_queue');
    } catch (error) {
      console.warn('Failed to load feedback queue from localStorage:', error);
    }

    // Process queue
    const queue = [...this.feedbackQueue];
    this.feedbackQueue = [];

    for (const feedback of queue) {
      try {
        await this.sendToBackend(feedback);
      } catch (error) {
        // Re-queue if failed
        this.feedbackQueue.push(feedback);
      }
    }
  }

  /**
   * Get or create session ID
   * @returns {string} Session ID
   */
  getSessionId() {
    try {
      let sessionId = sessionStorage.getItem('feedback_session_id');
      if (!sessionId) {
        sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        sessionStorage.setItem('feedback_session_id', sessionId);
      }
      return sessionId;
    } catch (error) {
      return `session_${Date.now()}`;
    }
  }

  /**
   * Check if user has provided feedback for a specific feature/assessment
   * @param {string} identifier - Unique identifier (e.g., 'assessment_full', 'feature_dashboard')
   * @param {string} period - Time period ('day', 'week', 'month', 'ever')
   * @returns {boolean} Whether feedback was provided
   */
  hasProvidedFeedback(identifier, period = 'day') {
    try {
      const key = `feedback_${identifier}_${period}`;
      
      if (period === 'day') {
        const dateKey = `feedback_${identifier}_${new Date().toDateString()}`;
        return localStorage.getItem(dateKey) === 'true';
      } else if (period === 'week') {
        const weekStart = new Date();
        weekStart.setDate(weekStart.getDate() - weekStart.getDay());
        const weekKey = `feedback_${identifier}_week_${weekStart.toDateString()}`;
        return localStorage.getItem(weekKey) === 'true';
      } else if (period === 'month') {
        const monthKey = `feedback_${identifier}_month_${new Date().getMonth()}_${new Date().getFullYear()}`;
        return localStorage.getItem(monthKey) === 'true';
      } else {
        // 'ever'
        return localStorage.getItem(key) === 'true';
      }
    } catch (error) {
      return false;
    }
  }

  /**
   * Mark feedback as provided
   * @param {string} identifier - Unique identifier
   * @param {string} period - Time period
   */
  markFeedbackProvided(identifier, period = 'day') {
    try {
      if (period === 'day') {
        const dateKey = `feedback_${identifier}_${new Date().toDateString()}`;
        localStorage.setItem(dateKey, 'true');
      } else if (period === 'week') {
        const weekStart = new Date();
        weekStart.setDate(weekStart.getDate() - weekStart.getDay());
        const weekKey = `feedback_${identifier}_week_${weekStart.toDateString()}`;
        localStorage.setItem(weekKey, 'true');
      } else if (period === 'month') {
        const monthKey = `feedback_${identifier}_month_${new Date().getMonth()}_${new Date().getFullYear()}`;
        localStorage.setItem(monthKey, 'true');
      } else {
        const key = `feedback_${identifier}_${period}`;
        localStorage.setItem(key, 'true');
      }
    } catch (error) {
      console.warn('Failed to mark feedback as provided:', error);
    }
  }
}

// Export singleton instance
export const feedbackService = new FeedbackService();
export default feedbackService;

