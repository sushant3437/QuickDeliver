import Booking from '../models/Booking.js';
import Slot from '../models/Slot.js';
import { NotFoundError, ValidationError, ConflictError } from '../utils/errors.js';

export const createBooking = async ({ userId, slotId }) => {
  if (!userId || !slotId) {
    throw new ValidationError('userId and slotId are required');
  }

  const slot = await Slot.findOne({ _id: slotId, isActive: true });
  if (!slot) {
    throw new NotFoundError('Slot not found');
  }

  if (slot.bookedCount >= slot.capacity) {
    // Find nearest future slot with available capacity (simple suggestion)
    const suggestion = await Slot.findOne({
      isActive: true,
      startAt: { $gt: slot.startAt },
      $expr: { $lt: ['$bookedCount', '$capacity'] },
    })
      .sort({ startAt: 1 })
      .select('title startAt endAt capacity bookedCount meta');

    if (suggestion) {
      throw new ConflictError('Slot is full', {
        suggestion: {
          id: suggestion._id,
          title: suggestion.title,
          startAt: suggestion.startAt,
          endAt: suggestion.endAt,
          capacity: suggestion.capacity,
          bookedCount: suggestion.bookedCount,
          meta: suggestion.meta,
        },
      });
    }

    throw new ConflictError('Slot is full');
  }

  // Prevent obvious duplicate bookings early (best-effort). The unique partial
  // index on Booking (user + slot where status='booked') enforces this at DB
  // level under concurrency, but a quick pre-check avoids unnecessary slot ops.
  const existing = await Booking.findOne({ user: userId, slot: slotId, status: 'booked' });
  if (existing) {
    throw new ConflictError('You have already booked this slot');
  }

  // Atomically increment bookedCount only if there's capacity remaining.
  const updatedSlot = await Slot.findOneAndUpdate(
    { _id: slotId, isActive: true, bookedCount: { $lt: slot.capacity } },
    { $inc: { bookedCount: 1 } },
    { new: true }
  );

  if (!updatedSlot) {
    // Another request likely filled the slot concurrently. Try to suggest next slot.
    const suggestion = await Slot.findOne({
      isActive: true,
      startAt: { $gt: slot.startAt },
      $expr: { $lt: ['$bookedCount', '$capacity'] },
    })
      .sort({ startAt: 1 })
      .select('title startAt endAt capacity bookedCount meta');

    if (suggestion) {
      throw new ConflictError('Slot is full', {
        suggestion: {
          id: suggestion._id,
          title: suggestion.title,
          startAt: suggestion.startAt,
          endAt: suggestion.endAt,
          capacity: suggestion.capacity,
          bookedCount: suggestion.bookedCount,
          meta: suggestion.meta,
        },
      });
    }

    throw new ConflictError('Slot is full');
  }

  try {
    const booking = await Booking.create({
      user: userId,
      slot: slotId,
      status: 'booked',
    });

    return booking;
  } catch (error) {
    // Roll back slot count if booking creation fails
    // Decrement guardedly — avoid letting bookedCount go negative
    await Slot.findOneAndUpdate(
      { _id: slotId, bookedCount: { $gt: 0 } },
      { $inc: { bookedCount: -1 } }
    );
    if (error.code === 11000) {
      throw new ConflictError('You have already booked this slot');
    }
    throw error;
  }
};

export const listBookings = async (userId) => {
  if (!userId) {
    throw new ValidationError('userId is required');
  }

  const bookings = await Booking.find({ user: userId })
    .populate('slot', 'title startAt endAt capacity bookedCount meta isActive')
    .sort({ createdAt: -1 });
  return bookings;
};

export const cancelBooking = async (userId, bookingId) => {
  const booking = await Booking.findOne({ _id: bookingId, user: userId, status: 'booked' });
  if (!booking) {
    throw new NotFoundError('Booking not found');
  }

  booking.status = 'cancelled';
  booking.cancelledAt = new Date();
  await booking.save();

  // Decrement bookedCount only if it's greater than zero to prevent negative counts
  const updated = await Slot.findOneAndUpdate(
    { _id: booking.slot, bookedCount: { $gt: 0 } },
    { $inc: { bookedCount: -1 } },
    { new: true }
  );

  if (!updated) {
    // If no slot was updated, ensure bookedCount is not negative
    await Slot.findByIdAndUpdate(booking.slot, { $set: { bookedCount: 0 } });
  }

  return booking;
};

export const listAllBookings = async () => {
  return Booking.find()
    .populate('user', 'name email role')
    .populate('slot', 'title startAt endAt capacity bookedCount meta isActive')
    .sort({ createdAt: -1 });
};

export const bookingStats = async () => {
  const stats = await Booking.aggregate([
    {
      $project: {
        statusGroup: {
          $cond: [
            { $in: ['$status', ['cancelled', 'cancelled_by_admin']] },
            'cancelled',
            '$status',
          ],
        },
      },
    },
    {
      $group: {
        _id: '$statusGroup',
        count: { $sum: 1 },
      },
    },
  ]);

  return stats;
};
