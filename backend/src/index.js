const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const path = require('path');

// Import configurations
const config = require('./config');
const database = require('./config/database');
const logger = require('./config/logger');

// Import middleware
const errorHandler = require('./middleware/errorHandler');
const { generalLimiter } = require('./middleware/rateLimiter');

// Import routes
const interviewRoutes = require('./routes/interviewRoutes');
const rhRoutes = require('./routes/rhRoutes');
const trainingRoutes = require('./routes/trainingRoutes');

class Server {
  constructor() {
    this.app = express();
    this.port = config.server.port;
    this.host = config.server.host;
  }

  /**
   * Initialize middleware
   */
  initializeMiddleware() {
    // Security middleware
    this.app.use(helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com", "https://cdn.tailwindcss.com"],
          fontSrc: ["'self'", "https://fonts.gstatic.com"],
          scriptSrc: ["'self'", "https://unpkg.com", "https://cdn.jsdelivr.net"],
          imgSrc: ["'self'", "data:", "https:"],
        },
      },
    }));

    // CORS configuration
    this.app.use(cors({
      origin: config.cors.origin,
      credentials: config.cors.credentials,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    }));

    // Compression middleware
    this.app.use(compression());

    // Body parsing middleware
    this.app.use(express.json({ limit: '10mb' }));
    this.app.use(express.urlencoded({ extended: true, limit: '10mb' }));

    // Logging middleware
    this.app.use(morgan('combined', { stream: logger.stream }));

    // Rate limiting
    this.app.use(generalLimiter);

    // Request logging
    this.app.use((req, res, next) => {
      logger.info(`${req.method} ${req.originalUrl} - ${req.ip}`);
      next();
    });
  }

  /**
   * Initialize routes
   */
  initializeRoutes() {
    // Health check endpoint
    this.app.get('/health', async (req, res) => {
      try {
        const dbHealth = await database.healthCheck();
        res.status(200).json({
          status: 'ok',
          timestamp: new Date().toISOString(),
          uptime: process.uptime(),
          database: dbHealth,
          environment: config.server.nodeEnv
        });
      } catch (error) {
        logger.error('Health check failed:', error);
        res.status(503).json({
          status: 'error',
          timestamp: new Date().toISOString(),
          error: 'Service unavailable'
        });
      }
    });

    // API routes
    this.app.use('/api/interviews', interviewRoutes);
    this.app.use('/api/rh', rhRoutes);
    this.app.use('/api/training', trainingRoutes);

    // Serve static files for frontend
    this.app.use(express.static(path.join(__dirname, '../../frontend/public')));

    // Serve frontend HTML files
    this.app.get('/', (req, res) => {
      res.sendFile(path.join(__dirname, '../../frontend/public/index.html'));
    });

    this.app.get('/chat', (req, res) => {
      res.sendFile(path.join(__dirname, '../../frontend/public/chat.html'));
    });

    this.app.get('/dashboard', (req, res) => {
      res.sendFile(path.join(__dirname, '../../frontend/public/dashboard.html'));
    });

    // 404 handler
    this.app.use('*', (req, res) => {
      res.status(404).json({
        success: false,
        error: 'Endpoint não encontrado'
      });
    });
  }

  /**
   * Initialize error handling
   */
  initializeErrorHandling() {
    this.app.use(errorHandler);
  }

  /**
   * Start the server
   */
  async start() {
    try {
      // Connect to database
      await database.connect();

      // Initialize middleware
      this.initializeMiddleware();

      // Initialize routes
      this.initializeRoutes();

      // Initialize error handling (must be last)
      this.initializeErrorHandling();

      // Start listening
      this.app.listen(this.port, this.host, () => {
        logger.info(`🚀 Server running on http://${this.host}:${this.port}`);
        logger.info(`📊 Environment: ${config.server.nodeEnv}`);
        logger.info(`🔗 Health check: http://${this.host}:${this.port}/health`);
      });

      // Graceful shutdown
      this.setupGracefulShutdown();
    } catch (error) {
      logger.error('Failed to start server:', error);
      process.exit(1);
    }
  }

  /**
   * Setup graceful shutdown
   */
  setupGracefulShutdown() {
    const shutdown = async (signal) => {
      logger.info(`Received ${signal}. Starting graceful shutdown...`);
      
      try {
        await database.disconnect();
        logger.info('Graceful shutdown completed');
        process.exit(0);
      } catch (error) {
        logger.error('Error during graceful shutdown:', error);
        process.exit(1);
      }
    };

    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('SIGINT', () => shutdown('SIGINT'));
  }
}

// Start the server
const server = new Server();

// Export both server and app for testing
module.exports = {
  server,
  app: server.app
};

// Only start the server if this file is run directly
if (require.main === module) {
  server.start();
}
