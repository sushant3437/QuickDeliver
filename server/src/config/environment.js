import dotenv from 'dotenv';

dotenv.config();

export const config = {
  port: process.env.PORT || 5000,
  nodeEnv: process.env.NODE_ENV || 'development',
  mongoUri: process.env.MONGO_URI || 'mongodb://localhost:27017/delivery-booking',
  jwtSecret: process.env.JWT_SECRET || 'dev-secret-key',
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:3000',
};

// Validate required env vars in production
if (config.nodeEnv === 'production') {
  const requiredVars = ['MONGO_URI', 'JWT_SECRET'];
  const missing = requiredVars.filter((v) => !process.env[v]);
  
  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables in production: ${missing.join(', ')}`
    );
  }
}
