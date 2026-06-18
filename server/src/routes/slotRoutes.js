import express from 'express';
import { asyncHandler } from '../middleware/errorHandler.js';
import {
  listSlotsHandler,
  getSlotHandler,
} from '../controllers/slotController.js';

const router = express.Router();

/**
 * Slot Routes:
 * GET /api/slots - Get all available slots (customer view)
 * GET /api/slots/:id - Get slot details
 */
router.get('/', asyncHandler(listSlotsHandler));
router.get('/:id', asyncHandler(getSlotHandler));

export default router;
