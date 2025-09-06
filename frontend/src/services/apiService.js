import { API_CONFIG, ENDPOINTS, HTTP_METHODS, CONTENT_TYPES } from '../config/api.js';

/**
 * API Service Class
 */
class ApiService {
  constructor() {
    this.baseURL = API_CONFIG.BASE_URL;
    this.timeout = API_CONFIG.TIMEOUT;
    this.retryAttempts = API_CONFIG.RETRY_ATTEMPTS;
    this.retryDelay = API_CONFIG.RETRY_DELAY;
  }

  /**
   * Make HTTP request with retry logic
   */
  async request(endpoint, options = {}, retryCount = 0) {
    const url = `${this.baseURL}${endpoint}`;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    const defaultOptions = {
      method: HTTP_METHODS.GET,
      headers: {
        'Content-Type': CONTENT_TYPES.JSON,
      },
      signal: controller.signal,
    };

    const requestOptions = { ...defaultOptions, ...options };

    try {
      const response = await fetch(url, requestOptions);
      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      clearTimeout(timeoutId);

      // Retry logic for network errors
      if (retryCount < this.retryAttempts && this.shouldRetry(error)) {
        console.warn(`Request failed, retrying... (${retryCount + 1}/${this.retryAttempts})`);
        await this.delay(this.retryDelay * (retryCount + 1));
        return this.request(endpoint, options, retryCount + 1);
      }

      throw error;
    }
  }

  /**
   * Check if error should trigger a retry
   */
  shouldRetry(error) {
    return (
      error.name === 'AbortError' ||
      error.message.includes('network') ||
      error.message.includes('timeout') ||
      error.message.includes('fetch')
    );
  }

  /**
   * Delay utility
   */
  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Interview API methods
   */
  async startInterview(candidateData) {
    return this.request(ENDPOINTS.INTERVIEWS.START, {
      method: HTTP_METHODS.POST,
      body: JSON.stringify(candidateData),
    });
  }

  async sendMessage(interviewId, message) {
    return this.request(ENDPOINTS.INTERVIEWS.MESSAGE(interviewId), {
      method: HTTP_METHODS.POST,
      body: JSON.stringify({ message }),
    });
  }

  async getInterview(interviewId) {
    return this.request(ENDPOINTS.INTERVIEWS.GET(interviewId));
  }

  async completeInterview(interviewId) {
    return this.request(ENDPOINTS.INTERVIEWS.COMPLETE(interviewId), {
      method: HTTP_METHODS.POST,
    });
  }

  async getInterviewStatistics() {
    return this.request(ENDPOINTS.INTERVIEWS.STATISTICS);
  }

  /**
   * RH API methods
   */
  async getDashboardData() {
    return this.request(ENDPOINTS.RH.DASHBOARD);
  }

  async getInterviewDetails(interviewId) {
    return this.request(ENDPOINTS.RH.INTERVIEW(interviewId));
  }

  async getCandidate(candidateId) {
    return this.request(ENDPOINTS.RH.CANDIDATE(candidateId));
  }

  async getEvaluationReport(interviewId) {
    return this.request(ENDPOINTS.RH.EVALUATION(interviewId));
  }

  /**
   * Health check
   */
  async healthCheck() {
    return this.request(ENDPOINTS.HEALTH);
  }
}

export default new ApiService();
