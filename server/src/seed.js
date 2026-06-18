import mongoose from 'mongoose';
import bcryptjs from 'bcryptjs';
import { config } from './config/environment.js';
import User from './models/User.js';
import Slot from './models/Slot.js';
import Booking from './models/Booking.js';

/**
 * Seed database with sample data for development and testing
 * Run with: npm run seed
 */
async function seedDatabase() {
  try {
    // Connect to MongoDB
    await mongoose.connect(config.mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Slot.deleteMany({});
    await Booking.deleteMany({});
    console.log('Cleared existing data');

    // Create sample users
    const hashedPassword = await bcryptjs.hash('Password123', 10);

    const adminUser = await User.create({
      name: 'Admin User',
      email: 'admin@delivery.com',
      passwordHash: hashedPassword,
      role: 'admin',
    });

    const customers = await User.create([
      {
        name: 'John Doe',
        email: 'john@example.com',
        passwordHash: hashedPassword,
        role: 'customer',
      },
      {
        name: 'Jane Smith',
        email: 'jane@example.com',
        passwordHash: hashedPassword,
        role: 'customer',
      },
      {
        name: 'Bob Wilson',
        email: 'bob@example.com',
        passwordHash: hashedPassword,
        role: 'customer',
      },
    ]);

    console.log(`Created 1 admin user and ${customers.length} customer users`);

    // Create sample slots for the next 7 days
    const now = new Date();
    const slots = [];

    for (let day = 0; day < 7; day++) {
      const slotDate = new Date(now);
      slotDate.setDate(slotDate.getDate() + day);

      // Morning slot: 08:00 - 12:00
      const morningStart = new Date(slotDate);
      morningStart.setHours(8, 0, 0, 0);

      const morningEnd = new Date(slotDate);
      morningEnd.setHours(12, 0, 0, 0);

      slots.push({
        title: `Morning Delivery - ${morningStart.toLocaleDateString()}`,
        startAt: morningStart,
        endAt: morningEnd,
        capacity: 5,
        bookedCount: 0,
        meta: {
          location: 'Downtown Distribution Center',
          notes: 'Early morning delivery slot',
        },
        createdBy: adminUser._id,
        isActive: true,
      });

      // Afternoon slot: 14:00 - 18:00
      const afternoonStart = new Date(slotDate);
      afternoonStart.setHours(14, 0, 0, 0);

      const afternoonEnd = new Date(slotDate);
      afternoonEnd.setHours(18, 0, 0, 0);

      slots.push({
        title: `Afternoon Delivery - ${afternoonStart.toLocaleDateString()}`,
        startAt: afternoonStart,
        endAt: afternoonEnd,
        capacity: 8,
        bookedCount: 0,
        meta: {
          location: 'Downtown Distribution Center',
          notes: 'Afternoon delivery slot',
        },
        createdBy: adminUser._id,
        isActive: true,
      });

      // Evening slot: 18:00 - 22:00
      const eveningStart = new Date(slotDate);
      eveningStart.setHours(18, 0, 0, 0);

      const eveningEnd = new Date(slotDate);
      eveningEnd.setHours(22, 0, 0, 0);

      slots.push({
        title: `Evening Delivery - ${eveningStart.toLocaleDateString()}`,
        startAt: eveningStart,
        endAt: eveningEnd,
        capacity: 10,
        bookedCount: 0,
        meta: {
          location: 'Downtown Distribution Center',
          notes: 'Evening delivery slot',
        },
        createdBy: adminUser._id,
        isActive: true,
      });
    }

    const createdSlots = await Slot.create(slots);
    console.log(`Created ${createdSlots.length} delivery slots`);

    // Create some sample bookings for the first 2 slots
    const firstSlot = createdSlots[0];
    const secondSlot = createdSlots[1];

    const sampleBookings = await Booking.create([
      {
        user: customers[0]._id,
        slot: firstSlot._id,
        status: 'booked',
      },
      {
        user: customers[1]._id,
        slot: firstSlot._id,
        status: 'booked',
      },
      {
        user: customers[2]._id,
        slot: secondSlot._id,
        status: 'booked',
      },
    ]);

    // Update bookedCount for slots
    await Slot.findByIdAndUpdate(firstSlot._id, { bookedCount: 2 });
    await Slot.findByIdAndUpdate(secondSlot._id, { bookedCount: 1 });

    console.log(`Created ${sampleBookings.length} sample bookings`);

    console.log('\n✅ Database seeded successfully!');
    console.log('\nSample Credentials:');
    console.log('Admin: admin@delivery.com / Password123');
    console.log('Customer: john@example.com / Password123');
    console.log('Customer: jane@example.com / Password123');
    console.log('Customer: bob@example.com / Password123');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();
