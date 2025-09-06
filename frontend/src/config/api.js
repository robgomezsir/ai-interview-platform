/**
 * API Configuration
 */
export const API_CONFIG = {
  BASE_URL: 'http://localhost:3000/api',
  TIMEOUT: 30000, // 30 seconds
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000, // 1 second
};

/**
 * API Endpoints
 */
export const ENDPOINTS = {
  INTERVIEWS: {
    START: '/interviews/start',
    MESSAGE: (id) => `/interviews/${id}/message`,
    GET: (id) => `/interviews/${id}`,
    COMPLETE: (id) => `/interviews/${id}/complete`,
    STATISTICS: '/interviews/statistics',
  },
  RH: {
    DASHBOARD: '/rh/dashboard',
    INTERVIEW: (id) => `/rh/interviews/${id}`,
    CANDIDATE: (id) => `/rh/candidates/${id}`,
    EVALUATION: (id) => `/rh/evaluations/${id}`,
  },
  HEALTH: '/health',
};

/**
 * HTTP Methods
 */
export const HTTP_METHODS = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  DELETE: 'DELETE',
};

/**
 * Content Types
 */
export const CONTENT_TYPES = {
  JSON: 'application/json',
  FORM_DATA: 'multipart/form-data',
};
