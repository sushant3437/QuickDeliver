import {
  createBooking,
  listBookings,
  cancelBooking,
  listAllBookings,
  bookingStats,
} from '../services/bookingService.js';
import { ValidationError } from '../utils/errors.js';

export const createBookingHandler = async (req, res, next) => {
  try {
    if (!req.body || !req.body.slotId) {
      throw new ValidationError('slotId is required in request body');
    }

    const booking = await createBooking({
      userId: req.user.id,
      slotId: req.body.slotId,
    });

    res.status(201).json({
      status: 201,
      message: 'Booking created successfully',
      data: booking,
    });
  } catch (error) {
    next(error);
  }
};

export const listBookingsHandler = async (req, res, next) => {
  try {
    const bookings = await listBookings(req.user.id);
    res.status(200).json({
      status: 200,
      message: 'Bookings retrieved successfully',
      data: bookings,
    });
  } catch (error) {
    next(error);
  }
};

export const cancelBookingHandler = async (req, res, next) => {
  try {
    const booking = await cancelBooking(req.user.id, req.params.id);
    res.status(200).json({
      status: 200,
      message: 'Booking cancelled successfully',
      data: booking,
    });
  } catch (error) {
    next(error);
  }
};

export const listAllBookingsHandler = async (req, res, next) => {
  try {
    const bookings = await listAllBookings();
    res.status(200).json({
      status: 200,
      message: 'All bookings retrieved successfully',
      data: bookings,
    });
  } catch (error) {
    next(error);
  }
};

export const bookingStatsHandler = async (req, res, next) => {
  try {
    const stats = await bookingStats();
    res.status(200).json({
      status: 200,
      message: 'Booking stats retrieved successfully',
      data: stats,
    });
  } catch (error) {
    next(error);
  }
};
