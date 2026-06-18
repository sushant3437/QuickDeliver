# Database Schema Documentation

## Overview
The Delivery Booking System uses MongoDB with Mongoose ODM for data persistence. All timestamps are stored in UTC.

## Collections

### 1. Users Collection
Stores customer and admin user accounts with authentication details.

**Schema:**
```javascript
{
  _id: ObjectId,
  name: String,           // Min 2 chars
  email: String,          // Unique, lowercase, validated format
  passwordHash: String,   // Hashed with bcryptjs (not returned in queries by default)
  role: String,           // 'customer' or 'admin' (default: 'customer')
  isActive: Boolean,      // For soft delete (default: true)
  lastLogin: Date,        // Tracks last login
  createdAt: Date,        // Auto-set by Mongoose
  updatedAt: Date         // Auto-updated by Mongoose
}
```

**Indexes:**
- `email` (ascending) - Fast lookup during login
- `isActive` (ascending) - Quick filtering of active users

**Validations:**
- `name` required, min 2 characters
- `email` required, unique, valid email format
- `passwordHash` required, min 6 characters
- `role` must be 'customer' or 'admin'

**Key Points:**
- Password hash is never returned in find queries (set to `select: false`)
- Email is automatically lowercased for case-insensitive lookups
- `lastLogin` can be updated on successful authentication

---

### 2. Slots Collection
Stores delivery time slots with capacity management.

**Schema:**
```javascript
{
  _id: ObjectId,
  title: String,              // e.g., "Morning Delivery - 2026-06-16"
  startAt: Date,              // UTC timezone
  endAt: Date,                // UTC timezone, must be > startAt
  capacity: Number,           // Max bookings allowed (min 1)
  bookedCount: Number,        // Current bookings (default: 0, min 0)
  meta: {
    location: String,         // Delivery location
    notes: String             // Additional info
  },
  createdBy: ObjectId,        // Reference to User (admin)
  isActive: Boolean,          // Soft delete flag (default: true)
  createdAt: Date,            // Auto-set
  updatedAt: Date             // Auto-updated
}
```

**Indexes:**
- `{startAt: 1, endAt: 1}` - Compound index for range queries
- `isActive` (ascending) - Find active slots only
- `{isActive: 1, bookedCount: 1, capacity: 1}` - Find slots with capacity

**Validations:**
- `title` required
- `startAt` required, must be < `endAt`
- `endAt` required, must be > `startAt`
- `capacity` required, minimum 1
- `bookedCount` min 0, must not exceed capacity
- `createdBy` required and must reference valid User

**Key Points:**
- `bookedCount` is maintained atomically to avoid expensive aggregations
- Always use atomic updates (findOneAndUpdate) to modify `bookedCount`
- Soft deletion via `isActive: false` preserves booking history
- Pre-save hooks validate time ranges and capacity constraints

---

### 3. Bookings Collection
Stores customer bookings with unique constraint to prevent duplicates.

**Schema:**
```javascript
{
  _id: ObjectId,
  user: ObjectId,             // Reference to User
  slot: ObjectId,             // Reference to Slot
  status: String,             // 'booked' or 'cancelled' (default: 'booked')
  cancelledAt: Date,          // Set when status changes to 'cancelled'
  metadata: {
    notes: String,            // Customer notes
    reason: String            // Cancellation reason
  },
  createdAt: Date,            // Auto-set when booked
  updatedAt: Date             // Auto-updated
}
```

**Indexes:**
- `{user: 1, slot: 1}` (unique, partial) - **CRITICAL**
  - Prevents duplicate bookings for same user/slot combo
  - Partial filter: `{status: 'booked'}` allows multiple cancelled bookings
- `{user: 1, createdAt: -1}` - Find user's booking history
- `{slot: 1, status: 1}` - Find bookings for a slot
- `status` (ascending) - Find active/cancelled bookings

**Validations:**
- `user` required, must reference valid User
- `slot` required, must reference valid Slot
- `status` must be 'booked' or 'cancelled'

**Key Points:**
- Unique compound index prevents overbooking at database level
- Partial unique index allows historical data (cancelled bookings) to remain
- `cancelledAt` is set when status changes to 'cancelled' for audit trail

---

## Database Design Decisions

### 1. Capacity Management
- **Denormalized `bookedCount` field:** Stored on Slot to avoid expensive aggregations
- **Atomic updates:** Use MongoDB's `$inc` operator with conditions to prevent overbooking
- **Pattern:** Check capacity with `findOneAndUpdate({_id, bookedCount: {$lt: capacity}}, {$inc: {bookedCount: 1}})`

### 2. Concurrency Control
- **MongoDB Transactions:** Not used (requires replica set, adds complexity)
- **Atomic Operators:** Uses conditional `findOneAndUpdate` for booking atomicity
- **Unique Indexes:** Database-level enforcement of unique `{user, slot}` constraint

### 3. Data Integrity
- **Pre-save Hooks:** Validate time ranges and capacity constraints
- **Referential Integrity:** Mongoose populations for related documents
- **Soft Deletes:** `isActive: false` preserves historical data

### 4. Query Performance
- **Strategic Indexes:** Compound indexes for range queries and filters
- **Partial Indexes:** Unique index only on active bookings (status: 'booked')
- **Field Selection:** Password hashes excluded by default

---

## Common Operations

### Check Slot Availability
```javascript
// Find available slots with remaining capacity
Slot.find({
  isActive: true,
  startAt: { $gte: new Date() },
  $expr: { $lt: ['$bookedCount', '$capacity'] }
}).sort({ startAt: 1 });
```

### Book a Slot (Atomic)
```javascript
// Attempt to increment bookedCount atomically
const updatedSlot = await Slot.findOneAndUpdate(
  {
    _id: slotId,
    bookedCount: { $lt: { $literal: capacity } }
  },
  { $inc: { bookedCount: 1 } },
  { new: true }
);

if (!updatedSlot) throw new Error('Slot is full');

// Create booking if slot update succeeded
const booking = await Booking.create({
  user: userId,
  slot: slotId,
  status: 'booked'
});
```

### Cancel a Booking
```javascript
// Update booking status
const booking = await Booking.findByIdAndUpdate(
  bookingId,
  {
    status: 'cancelled',
    cancelledAt: new Date()
  },
  { new: true }
);

// Decrement slot's bookedCount
await Slot.findByIdAndUpdate(
  booking.slot,
  { $inc: { bookedCount: -1 } }
);
```

### Get User's Booking History
```javascript
await Booking.find({ user: userId })
  .populate('slot', 'title startAt endAt capacity bookedCount')
  .sort({ createdAt: -1 });
```

---

## Migrations & Backups

For production:
1. **Enable replica sets** in MongoDB to support transactions
2. **Regular backups** using `mongodump`
3. **Index monitoring** for slow queries
4. **Schema versioning** for future changes

## Getting Started

1. Start with an empty database
2. Register the first user via `/api/auth/register` - they will become an admin
3. Register additional users - they will become customers
4. Admins can create delivery slots
5. Customers can browse and book slots
