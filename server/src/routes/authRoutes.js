import express from 'express';
import { register, login, getCurrentUser } from '../controllers/authController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { rateLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

/**
 * Auth Routes:
 * POST   /api/auth/register    - Register new user (first becomes admin, rest customers)
 * POST   /api/auth/login       - Login with email and password
 * GET    /api/auth/me          - Get current user profile (protected)
 */

// Public routes
router.post('/register', rateLimiter, asyncHandler(register));
router.post('/login', rateLimiter, asyncHandler(login));

// Protected routes
router.get('/me', authenticateToken, asyncHandler(getCurrentUser));

export default router;
