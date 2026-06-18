import Slot from '../models/Slot.js';
import Booking from '../models/Booking.js';
import { NotFoundError, ValidationError } from '../utils/errors.js';

export const createSlot = async ({ title, startAt, endAt, capacity, meta, createdBy }) => {
  if (!title || !startAt || !endAt || !capacity) {
    throw new ValidationError('Title, startAt, endAt, and capacity are required');
  }

  if (new Date(startAt) >= new Date(endAt)) {
    throw new ValidationError('startAt must be before endAt');
  }

  if (capacity < 1) {
    throw new ValidationError('Capacity must be at least 1');
  }

  const slot = await Slot.create({
    title: title.trim(),
    startAt: new Date(startAt),
    endAt: new Date(endAt),
    capacity,
    bookedCount: 0,
    meta: {
      location: meta?.location || null,
      notes: meta?.notes || null,
    },
    createdBy,
    isActive: true,
  });

  return slot;
};

export const updateSlot = async (slotId, updates) => {
  const slot = await Slot.findById(slotId);
  if (!slot || !slot.isActive) {
    throw new NotFoundError('Slot not found');
  }

  if (updates.title) {
    slot.title = updates.title.trim();
  }
  if (updates.startAt) {
    slot.startAt = new Date(updates.startAt);
  }
  if (updates.endAt) {
    slot.endAt = new Date(updates.endAt);
  }
  if (updates.capacity !== undefined) {
    if (updates.capacity < 1) {
      throw new ValidationError('Capacity must be at least 1');
    }
    if (updates.capacity < slot.bookedCount) {
      throw new ValidationError('Capacity cannot be less than current booked count');
    }
    slot.capacity = updates.capacity;
  }
  if (updates.meta) {
    slot.meta.location = updates.meta.location ?? slot.meta.location;
    slot.meta.notes = updates.meta.notes ?? slot.meta.notes;
  }

  if (slot.startAt >= slot.endAt) {
    throw new ValidationError('startAt must be before endAt');
  }

  await slot.save();
  return slot;
};

export const deleteSlot = async (slotId) => {
  const slot = await Slot.findById(slotId);
  if (!slot || !slot.isActive) {
    throw new NotFoundError('Slot not found');
  }

  slot.isActive = false;
  slot.bookedCount = 0;

  await Promise.all([
    Booking.updateMany(
      { slot: slotId, status: 'booked' },
      {
        status: 'cancelled_by_admin',
        cancelledAt: new Date(),
        'metadata.reason': 'This slot was cancelled by the administrator',
      }
    ),
    slot.save(),
  ]);

  return slot;
};

export const getSlotById = async (slotId) => {
  const slot = await Slot.findById(slotId).where({ isActive: true });
  if (!slot) {
    throw new NotFoundError('Slot not found');
  }
  return slot;
};

export const listSlots = async ({ date, availableOnly }) => {
  const filter = { isActive: true };

  if (date) {
    const start = new Date(date);
    if (Number.isNaN(start.getTime())) {
      throw new ValidationError('Invalid date format');
    }
    const end = new Date(start);
    end.setHours(23, 59, 59, 999);
    filter.startAt = { $gte: start, $lte: end };
  }

  if (availableOnly) {
    filter.$expr = { $lt: ['$bookedCount', '$capacity'] };
  }

  const slots = await Slot.find(filter).sort({ startAt: 1 });
  return slots;
};
