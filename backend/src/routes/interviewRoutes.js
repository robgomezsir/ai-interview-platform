const express = require('express');
const router = express.Router();
const interviewController = require('../controllers/interviewController');
const { validate, schemas } = require('../middleware/validation');
const { generalLimiter, aiLimiter, evaluationLimiter } = require('../middleware/rateLimiter');

// Apply general rate limiting to all routes
router.use(generalLimiter);

/**
 * @route   POST /api/interviews/start
 * @desc    Start a new interview
 * @access  Public
 */
router.post(
  '/start',
  validate(schemas.interviewStart),
  interviewController.startInterview
);

/**
 * @route   POST /api/interviews/:id/message
 * @desc    Send message to interview
 * @access  Public
 */
router.post(
  '/:id/message',
  validate(schemas.uuid, 'params'),
  validate(schemas.message),
  aiLimiter, // Stricter rate limiting for AI interactions
  interviewController.postMessage
);

/**
 * @route   GET /api/interviews/:id
 * @desc    Get interview details
 * @access  Public
 */
router.get(
  '/:id',
  validate(schemas.uuid, 'params'),
  interviewController.getInterview
);

/**
 * @route   POST /api/interviews/:id/complete
 * @desc    Complete interview and generate evaluation
 * @access  Public
 */
router.post(
  '/:id/complete',
  validate(schemas.uuid, 'params'),
  evaluationLimiter, // Strict rate limiting for evaluations
  interviewController.completeInterview
);

/**
 * @route   GET /api/interviews/statistics
 * @desc    Get interview statistics
 * @access  Public
 */
router.get(
  '/statistics',
  interviewController.getStatistics
);

module.exports = router;
