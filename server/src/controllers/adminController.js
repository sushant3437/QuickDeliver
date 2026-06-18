import {
  listAllBookings,
  bookingStats,
} from '../services/bookingService.js';
import {
  createSlot,
  updateSlot,
  deleteSlot,
  listSlots,
} from '../services/slotService.js';

export const createSlotHandler = async (req, res, next) => {
  try {
    const slot = await createSlot({
      title: req.body.title,
      startAt: req.body.startAt,
      endAt: req.body.endAt,
      capacity: req.body.capacity,
      meta: req.body.meta,
      createdBy: req.user.id,
    });

    res.status(201).json({
      status: 201,
      message: 'Slot created successfully',
      data: slot,
    });
  } catch (error) {
    next(error);
  }
};

export const updateSlotHandler = async (req, res, next) => {
  try {
    const slot = await updateSlot(req.params.id, {
      title: req.body.title,
      startAt: req.body.startAt,
      endAt: req.body.endAt,
      capacity: req.body.capacity,
      meta: req.body.meta,
    });
    res.status(200).json({
      status: 200,
      message: 'Slot updated successfully',
      data: slot,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteSlotHandler = async (req, res, next) => {
  try {
    const slot = await deleteSlot(req.params.id);
    res.status(200).json({
      status: 200,
      message: 'Slot deleted successfully',
      data: slot,
    });
  } catch (error) {
    next(error);
  }
};

export const listSlotsHandler = async (req, res, next) => {
  try {
    const slots = await listSlots({
      date: req.query.date,
      availableOnly: req.query.availableOnly === 'true',
    });
    res.status(200).json({
      status: 200,
      message: 'Slots retrieved successfully',
      data: slots,
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
