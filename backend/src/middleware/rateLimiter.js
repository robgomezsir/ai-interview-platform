const rateLimit = require('express-rate-limit');
const config = require('../config');
const logger = require('../config/logger');

/**
 * General rate limiter
 */
const generalLimiter = rateLimit({
  windowMs: config.security.rateLimit.windowMs,
  max: config.security.rateLimit.max,
  message: {
    success: false,
    error: 'Muitas requisições, tente novamente mais tarde',
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    logger.warn(`Rate limit exceeded for IP: ${req.ip}`);
    res.status(429).json({
      success: false,
      error: 'Muitas requisições, tente novamente mais tarde',
    });
  },
});

/**
 * Strict rate limiter for AI endpoints
 */
const aiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // 20 requests per 15 minutes
  message: {
    success: false,
    error: 'Limite de requisições para IA excedido, tente novamente mais tarde',
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    logger.warn(`AI rate limit exceeded for IP: ${req.ip}`);
    res.status(429).json({
      success: false,
      error: 'Limite de requisições para IA excedido, tente novamente mais tarde',
    });
  },
});

/**
 * Evaluation rate limiter
 */
const evaluationLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10, // 10 evaluations per hour
  message: {
    success: false,
    error: 'Limite de avaliações excedido, tente novamente mais tarde',
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    logger.warn(`Evaluation rate limit exceeded for IP: ${req.ip}`);
    res.status(429).json({
      success: false,
      error: 'Limite de avaliações excedido, tente novamente mais tarde',
    });
  },
});

module.exports = {
  generalLimiter,
  aiLimiter,
  evaluationLimiter,
};
