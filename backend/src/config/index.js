require('dotenv').config();

const config = {
  // Server Configuration
  server: {
    port: process.env.PORT || 3000,
    host: process.env.HOST || 'localhost',
    nodeEnv: process.env.NODE_ENV || 'development',
  },

  // Database Configuration
  database: {
    url: process.env.DATABASE_URL,
  },

  // AI Service Configuration
  ai: {
    apiKey: process.env.OPENROUTER_API_KEY,
    model: process.env.AI_MODEL || 'deepseek/deepseek-chat-v3-0324:free',
    apiUrl: process.env.AI_API_URL || 'https://openrouter.ai/api/v1/chat/completions',
    timeout: 30000, // 30 seconds
    maxRetries: 3,
  },

  // Security Configuration
  security: {
    jwtSecret: process.env.JWT_SECRET || 'your-secret-key',
    rateLimit: {
      windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
      max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100, // limit each IP to 100 requests per windowMs
    },
  },

  // CORS Configuration
  cors: {
    origin: process.env.CORS_ORIGIN || 'http://localhost:8080',
    credentials: true,
  },

  // Logging Configuration
  logging: {
    level: process.env.LOG_LEVEL || 'info',
    file: process.env.LOG_FILE || 'logs/app.log',
  },

  // File Upload Configuration
  upload: {
    maxFileSize: parseInt(process.env.MAX_FILE_SIZE) || 5 * 1024 * 1024, // 5MB
    uploadPath: process.env.UPLOAD_PATH || 'uploads/',
  },

  // Validation
  validation: {
    email: {
      minLength: 5,
      maxLength: 255,
    },
    name: {
      minLength: 2,
      maxLength: 100,
    },
    message: {
      minLength: 1,
      maxLength: 1000,
    },
  },
};

// Validate required environment variables (only in production)
if (process.env.NODE_ENV === 'production') {
  const requiredEnvVars = ['DATABASE_URL', 'OPENROUTER_API_KEY'];
  const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar]);

  if (missingEnvVars.length > 0) {
    throw new Error(`Missing required environment variables: ${missingEnvVars.join(', ')}`);
  }
}

module.exports = config;
