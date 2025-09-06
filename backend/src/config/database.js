const { PrismaClient } = require('@prisma/client');

class Database {
  constructor() {
    this.prisma = null;
  }

  async connect() {
    try {
      this.prisma = new PrismaClient({
        log: process.env.NODE_ENV === 'development' ? ['query', 'info', 'warn', 'error'] : ['error'],
        errorFormat: 'pretty',
      });

      await this.prisma.$connect();
      console.log('✅ Database connected successfully');
    } catch (error) {
      console.error('❌ Database connection failed:', error);
      
      // In development mode, allow server to start without database
      if (process.env.NODE_ENV === 'development') {
        console.log('⚠️  Running in development mode without database');
        this.prisma = null;
        return;
      }
      
      throw error;
    }
  }

  async disconnect() {
    if (this.prisma) {
      await this.prisma.$disconnect();
      console.log('✅ Database disconnected');
    }
  }

  getClient() {
    if (!this.prisma) {
      throw new Error('Database not connected. Call connect() first.');
    }
    return this.prisma;
  }

  async healthCheck() {
    try {
      if (!this.prisma) {
        return { status: 'offline', message: 'Database not connected', timestamp: new Date().toISOString() };
      }
      await this.prisma.$queryRaw`SELECT 1`;
      return { status: 'healthy', timestamp: new Date().toISOString() };
    } catch (error) {
      return { status: 'unhealthy', error: error.message, timestamp: new Date().toISOString() };
    }
  }
}

module.exports = new Database();
