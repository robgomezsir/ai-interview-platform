const express = require('express');
const router = express.Router();
const rhController = require('../controllers/rhController');
const { validate, schemas } = require('../middleware/validation');
const { generalLimiter } = require('../middleware/rateLimiter');

// Apply general rate limiting to all routes
router.use(generalLimiter);

/**
 * @route   GET /api/rh/dashboard
 * @desc    Get dashboard data for RH
 * @access  Public
 */
router.get(
  '/dashboard',
  rhController.getDashboardData
);

/**
 * @route   GET /api/rh/interviews/:id
 * @desc    Get detailed interview information
 * @access  Public
 */
router.get(
  '/interviews/:id',
  validate(schemas.uuid, 'params'),
  rhController.getInterviewDetails
);

/**
 * @route   GET /api/rh/candidates/:id
 * @desc    Get candidate information
 * @access  Public
 */
router.get(
  '/candidates/:id',
  validate(schemas.uuid, 'params'),
  rhController.getCandidate
);

/**
 * @route   GET /api/rh/evaluations/:id
 * @desc    Get evaluation report
 * @access  Public
 */
router.get(
  '/evaluations/:id',
  validate(schemas.uuid, 'params'),
  rhController.getEvaluationReport
);

module.exports = router;
