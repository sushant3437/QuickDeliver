import express from 'express';
import { authenticateToken, requireCustomer } from '../middleware/authMiddleware.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import {
  createBookingHandler,
  listBookingsHandler,
  cancelBookingHandler,
} from '../controllers/bookingController.js';

const router = express.Router();

/**
 * Booking Routes:
 * POST /api/bookings - Create booking (customer)
 * GET /api/bookings - Get user bookings (customer)
 * DELETE /api/bookings/:id - Cancel booking (customer)
 */
router.use(authenticateToken, requireCustomer);

router.post('/', asyncHandler(createBookingHandler));
router.get('/', asyncHandler(listBookingsHandler));
router.delete('/:id', asyncHandler(cancelBookingHandler));

export default router;
