import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User is required'],
    },
    slot: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Slot',
      required: [true, 'Slot is required'],
    },
    status: {
      type: String,
      enum: {
        values: ['booked', 'cancelled', 'cancelled_by_admin'],
        message: 'Status must be booked, cancelled, or cancelled_by_admin',
      },
      default: 'booked',
    },
    cancelledAt: {
      type: Date,
      default: null,
    },
    metadata: {
      notes: String,
      reason: String, // For cancellation reason
    },
  },
  {
    timestamps: true,
  }
);

// CRITICAL: Unique compound index to prevent duplicate bookings
// This ensures a user can only book a specific slot once
bookingSchema.index(
  { user: 1, slot: 1 },
  {
    unique: true,
    // Allow multiple "cancelled" bookings for same user/slot combo
    // by using a partial index (only on active bookings)
    partialFilterExpression: { status: 'booked' },
  }
);

// Index for finding user's bookings
bookingSchema.index({ user: 1, createdAt: -1 });

// Index for finding slot's bookings
bookingSchema.index({ slot: 1, status: 1 });

// Index for finding active bookings
bookingSchema.index({ status: 1 });

const Booking = mongoose.model('Booking', bookingSchema);

export default Booking;
