import express from 'express';
import { authenticateToken, requireAdmin } from '../middleware/authMiddleware.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import {
  createSlotHandler,
  updateSlotHandler,
  deleteSlotHandler,
  listSlotsHandler,
  listAllBookingsHandler,
  bookingStatsHandler,
} from '../controllers/adminController.js';

const router = express.Router();

/**
 * Admin Routes:
 * POST /api/admin/slots - Create slot
 * PUT /api/admin/slots/:id - Update slot
 * DELETE /api/admin/slots/:id - Delete slot
 * GET /api/admin/slots - Get all slots
 * GET /api/admin/bookings - Get all bookings
 * GET /api/admin/stats - Get statistics
 */
router.use(authenticateToken, requireAdmin);

router.post('/slots', asyncHandler(createSlotHandler));
router.put('/slots/:id', asyncHandler(updateSlotHandler));
router.delete('/slots/:id', asyncHandler(deleteSlotHandler));
router.get('/slots', asyncHandler(listSlotsHandler));
router.get('/bookings', asyncHandler(listAllBookingsHandler));
router.get('/stats', asyncHandler(bookingStatsHandler));

export default router;
