import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { config } from './config/environment.js';
import { requestLogger } from './middleware/requestLogger.js';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';

// Import routes
import authRoutes from './routes/authRoutes.js';
import slotRoutes from './routes/slotRoutes.js';
import bookingRoutes from './routes/bookingRoutes.js';
import adminRoutes from './routes/adminRoutes.js';

const app = express();

// Security Middleware
app.use(helmet());
app.use(cors({ origin: config.corsOrigin }));

// Body Parsing Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request Logging
app.use(requestLogger);

// Health Check Route
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 200,
    message: 'Server is running',
    timestamp: new Date().toISOString(),
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/slots', slotRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/admin', adminRoutes);

// 404 Handler (must be last)
app.use(notFoundHandler);

// Error Handler (must be last)
app.use(errorHandler);

export default app;
