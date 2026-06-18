import mongoose from 'mongoose';

const slotSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Slot title is required'],
      trim: true,
    },
    startAt: {
      type: Date,
      required: [true, 'Start time is required'],
    },
    endAt: {
      type: Date,
      required: [true, 'End time is required'],
    },
    capacity: {
      type: Number,
      required: [true, 'Capacity is required'],
      min: [1, 'Capacity must be at least 1'],
    },
    bookedCount: {
      type: Number,
      default: 0,
      min: [0, 'Booked count cannot be negative'],
    },
    meta: {
      location: {
        type: String,
        default: null,
      },
      notes: {
        type: String,
        default: null,
      },
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Admin user ID is required'],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Validate that startAt < endAt
slotSchema.pre('save', function (next) {
  if (this.startAt >= this.endAt) {
    return next(new Error('Start time must be before end time'));
  }
  next();
});

// Prevent bookedCount from exceeding capacity
slotSchema.pre('save', function (next) {
  if (this.bookedCount > this.capacity) {
    return next(new Error('Booked count cannot exceed capacity'));
  }
  next();
});

// Compound index for range queries on slot times
slotSchema.index({ startAt: 1, endAt: 1 });

// Index for finding active slots
slotSchema.index({ isActive: 1 });

// Index for finding slots with available capacity
slotSchema.index({ isActive: 1, bookedCount: 1, capacity: 1 });

const Slot = mongoose.model('Slot', slotSchema);

export default Slot;
