# Delivery Slot Booking System - Backend API

A production-ready Node.js/Express backend API for a delivery slot booking system with customer and admin roles.

## Project Structure

```
server/
├── src/
│   ├── config/
│   │   ├── environment.js      # Environment variables configuration
│   │   └── database.js         # MongoDB connection setup
│   ├── models/                 # Mongoose schemas (to be created)
│   ├── controllers/            # Request handlers (to be created)
│   ├── routes/
│   │   ├── authRoutes.js       # Authentication endpoints
│   │   ├── slotRoutes.js       # Slot browsing (customer)
│   │   ├── bookingRoutes.js    # Booking management (customer)
│   │   └── adminRoutes.js      # Admin operations
│   ├── middleware/
│   │   ├── errorHandler.js     # Centralized error handling
│   │   └── requestLogger.js    # Request logging
│   ├── utils/
│   │   └── errors.js           # Custom error classes
│   ├── tests/                  # Unit & integration tests (to be created)
│   ├── app.js                  # Express app setup
│   └── server.js               # Entry point
├── .env.example                # Environment variables template
├── package.json                # Dependencies
└── README.md                   # This file
```

## Tech Stack

- **Framework:** Express.js
- **Database:** MongoDB + Mongoose
- **Authentication:** JWT + bcryptjs
- **Validation:** express-validator
- **Security:** Helmet, CORS
- **Development:** Nodemon, ESLint, Jest, Supertest

## Setup Instructions

### 1. Prerequisites
- Node.js v16+ installed
- MongoDB running locally or have a connection string
- npm or yarn package manager

### 2. Install Dependencies

```bash
cd server
npm install
```

### 3. Configure Environment Variables

Copy `.env.example` to `.env` and fill in your values:

```bash
cp .env.example .env
```

Edit `.env`:
```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://localhost:27017/delivery-booking
JWT_SECRET=your_super_secret_jwt_key_change_in_production
CORS_ORIGIN=http://localhost:3000
```

### 4. Start the Development Server

```bash
npm run dev
```

The server will run on `http://localhost:5000`

### 5. Verify the Server is Running

Open a browser or use curl to test:

```bash
curl http://localhost:5000/api/health
```

Expected response:
```json
{
  "status": 200,
  "message": "Server is running",
  "timestamp": "2026-06-16T10:00:00.000Z"
}
```

## Available Scripts

```bash
# Start server in production mode
npm start

# Start server with auto-reload in development
npm run dev

# Run tests
npm test

# Watch tests
npm test:watch

# Lint code
npm run lint

# Fix lint issues
npm run lint:fix
```

## API Routes (Framework)

### Auth Routes
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Slot Routes (Customer)
- `GET /api/slots` - List available slots
- `GET /api/slots/:id` - Get slot details

### Booking Routes (Customer)
- `POST /api/bookings` - Create booking
- `GET /api/bookings` - Get user's bookings
- `DELETE /api/bookings/:id` - Cancel booking

### Admin Routes
- `POST /api/admin/slots` - Create slot
- `PUT /api/admin/slots/:id` - Update slot
- `DELETE /api/admin/slots/:id` - Delete slot
- `GET /api/admin/slots` - List all slots
- `GET /api/admin/bookings` - List all bookings
- `GET /api/admin/stats` - Get statistics

## Architecture Overview

### MVC Pattern
- **Models:** Mongoose schemas defining data structure
- **Controllers:** Business logic handling requests/responses
- **Routes:** API endpoints and routing

### Middleware Stack
1. `helmet()` - Security headers
2. `cors()` - Cross-origin requests
3. `express.json()` - JSON body parsing
4. `requestLogger` - Request logging
5. Business logic endpoints
6. `notFoundHandler` - 404 handling
7. `errorHandler` - Centralized error handling

### Error Handling
Custom error classes in `src/utils/errors.js`:
- `ValidationError` (400)
- `AuthenticationError` (401)
- `AuthorizationError` (403)
- `NotFoundError` (404)
- `ConflictError` (409)

Thrown errors are caught by the global error handler and returned as consistent JSON responses.

### Security Features
- Helmet for security headers
- CORS restricted to frontend origin
- JWT-based authentication (to be implemented)
- bcrypt password hashing (to be implemented)
- Input validation (to be implemented)
- Rate limiting (to be added)

## Development Roadmap

1. ✅ Backend scaffold and configuration
2. ⏳ Database schemas (User, Slot, Booking)
3. ⏳ Authentication (JWT + bcrypt)
4. ⏳ Slot management APIs (customer + admin)
5. ⏳ Booking APIs with concurrency control
6. ⏳ Admin analytics endpoints
7. ⏳ Input validation and error handling
8. ⏳ Tests (unit, integration, concurrency)
9. ⏳ Frontend (React + Tailwind)

## Next Steps

- Review the structure and folder organization
- Proceed with database schema design and implementation
- Then implement authentication middleware
- Build out API endpoints for slots and bookings

## Notes

- All timestamps are in UTC for consistency
- Error responses follow a consistent format: `{ status, message, details }`
- Database operations use Mongoose for schema validation
- Environment-based configuration for dev/prod settings
- Development uses Nodemon for auto-reload on file changes
