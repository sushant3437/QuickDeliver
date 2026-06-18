# Backend Setup & Testing Guide

## Prerequisites

- **Node.js** v16+ installed
- **MongoDB** running locally on `localhost:27017` or available at `MONGO_URI`
- **npm** or **yarn** package manager
- **Postman** or **cURL** for API testing (optional)

## Quick Start

### 1. Install Dependencies

From the `server` directory:

```bash
npm install
```

### 2. Configure Environment

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

Default `.env` values (already set):
```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://localhost:27017/delivery-booking
JWT_SECRET=dev-secret-key-change-in-production
CORS_ORIGIN=http://localhost:3000
```

### 3. Start MongoDB

**Option A: MongoDB Atlas (Cloud)**
- Create a cluster on [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- Get connection string and update `MONGO_URI` in `.env`

**Option B: Local MongoDB**

Windows (using MongoDB Community):
```bash
# Start MongoDB service
mongod
```

macOS (using Homebrew):
```bash
# Start MongoDB service
brew services start mongodb-community
```

Linux (using systemctl):
```bash
sudo systemctl start mongod
```

Verify connection:
```bash
mongosh  # or mongo (older versions)
```

### 4. Start Development Server

```bash
npm run dev
```

**Expected Output:**
```
[nodemon] 3.1.14
[nodemon] watching path(s): *.*
[nodemon] starting `node src/server.js`
Connected to MongoDB
Server is running on port 5000
Environment: development
API Base URL: http://localhost:5000/api
```

### 5. Verify Server is Running

Test health check endpoint:

```bash
curl http://localhost:5000/api/health
```

Expected response:
```json
{
  "status": 200,
  "message": "Server is running",
  "timestamp": "2026-06-16T10:15:30.123Z"
}
```

---

## Testing Authentication

### Test 1: Register First User (Admin)

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Admin User",
    "email": "admin@delivery.com",
    "password": "AdminPass123",
    "passwordConfirm": "AdminPass123"
  }'
```

Expected response (201):
```json
{
  "status": 201,
  "message": "User registered successfully as admin",
  "data": {
    "id": "507f1f77bcf86cd799439011",
    "name": "Admin User",
    "email": "admin@delivery.com",
    "role": "admin"
  }
}
```

### Test 2: Register Second User (Customer)

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Customer User",
    "email": "customer@delivery.com",
    "password": "CustomerPass123",
    "passwordConfirm": "CustomerPass123"
  }'
```

Expected response (201):
```json
{
  "status": 201,
  "message": "User registered successfully as customer",
  "data": {
    "id": "507f1f77bcf86cd799439012",
    "name": "Customer User",
    "email": "customer@delivery.com",
    "role": "customer"
  }
}
```

### Test 3: Login

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@delivery.com",
    "password": "AdminPass123"
  }'
```

Expected response (200):
```json
{
  "status": 200,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjUwN2YxZjc3YmNmODZjZDc5OTQzOTAxMSIsImVtYWlsIjoiYWRtaW5AZGVsaXZlcnkuY29tIiwicm9sZSI6ImFkbWluIiwiaWF0IjoxNzE4NTI1NzMwLCJleHAiOjE3MTg2MTIxMzB9.xxxxx",
    "user": {
      "id": "507f1f77bcf86cd799439011",
      "name": "Admin User",
      "email": "admin@delivery.com",
      "role": "admin"
    }
  }
}
```

**Save the token for next test.**

### Test 4: Get Current User (Protected Route)

Replace `<token>` with token from Test 3:

```bash
curl -X GET http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer <token>"
```

Expected response (200):
```json
{
  "status": 200,
  "message": "User profile retrieved",
  "data": {
    "id": "507f1f77bcf86cd799439011",
    "name": "Admin User",
    "email": "admin@delivery.com",
    "role": "admin",
    "isActive": true
  }
}
```

### Test 5: Verify Invalid Token Fails

```bash
curl -X GET http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer invalid-token"
```

Expected response (401):
```json
{
  "status": 401,
  "message": "Invalid or malformed token"
}
```

---

## Testing with Postman

### Import Collection

Create a Postman collection with these requests:

**1. Register Admin**
- Method: `POST`
- URL: `http://localhost:5000/api/auth/register`
- Body (raw JSON):
  ```json
  {
    "name": "Admin User",
    "email": "admin@delivery.com",
    "password": "AdminPass123",
    "passwordConfirm": "AdminPass123"
  }
  ```

**2. Login**
- Method: `POST`
- URL: `http://localhost:5000/api/auth/login`
- Body (raw JSON):
  ```json
  {
    "email": "admin@delivery.com",
    "password": "AdminPass123"
  }
  ```
- After response, go to Tests tab and run:
  ```javascript
  if (pm.response.code === 200) {
    pm.environment.set("token", pm.response.json().data.token);
  }
  ```

**3. Get Current User (Protected)**
- Method: `GET`
- URL: `http://localhost:5000/api/auth/me`
- Headers:
  - Key: `Authorization`
  - Value: `Bearer {{token}}`

---

## Common Issues & Solutions

### Issue 1: MongoDB Connection Refused
```
MongoDB connection error: connect ECONNREFUSED ::1:27017
```

**Solution:**
- Ensure MongoDB is running: `mongod`
- Check MongoDB is on port 27017: `mongosh`
- Or update `MONGO_URI` in `.env` to your MongoDB Atlas connection string

### Issue 2: Port 5000 Already in Use
```
Error: listen EADDRINUSE :::5000
```

**Solution:**
- Change `PORT` in `.env` to a different port (e.g., 5001)
- Or kill the process using port 5000

Windows:
```bash
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

Linux/macOS:
```bash
lsof -i :5000
kill -9 <PID>
```

### Issue 3: Token Expired
```json
{
  "status": 401,
  "message": "Token has expired"
}
```

**Solution:**
- Tokens expire after 24 hours
- Login again to get a new token

### Issue 4: Validation Error

```json
{
  "status": 400,
  "message": "Password must be at least 6 characters"
}
```

**Solution:**
- Check request body matches validation rules:
  - Password min 6 chars
  - Email must be valid format
  - Passwords must match
  - Name min 2 chars

---

## Available npm Scripts

```bash
# Start server (production mode)
npm start

# Start server with auto-reload (development)
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

---

## Project Structure

```
server/
├── src/
│   ├── config/
│   │   ├── environment.js    # Environment config
│   │   └── database.js       # MongoDB connection
│   ├── controllers/
│   │   └── authController.js # Auth request handlers
│   ├── middleware/
│   │   ├── authMiddleware.js # JWT verification & roles
│   │   ├── errorHandler.js   # Error handling
│   │   └── requestLogger.js  # Request logging
│   ├── models/
│   │   ├── User.js           # User schema
│   │   ├── Slot.js           # Slot schema
│   │   └── Booking.js        # Booking schema
│   ├── routes/
│   │   └── authRoutes.js     # Auth endpoints
│   ├── services/
│   │   └── authService.js    # Auth business logic
│   ├── utils/
│   │   └── errors.js         # Custom error classes
│   ├── app.js                # Express app setup
│   └── server.js             # Entry point
├── docs/
│   ├── AUTH_API.md           # Auth API documentation
│   └── DATABASE_SCHEMA.md    # Database design
├── .env                      # Environment variables
├── .env.example              # Env template
├── package.json              # Dependencies
└── README.md                 # Backend README
```

---

## Next Steps

1. ✅ Authentication system complete
2. ⏳ Implement slot CRUD APIs (admin)
3. ⏳ Implement slot browsing (customer)
4. ⏳ Implement booking logic with concurrency control
5. ⏳ Implement cancellation
6. ⏳ Add validation and testing

---

## Support

For issues or questions:
- Check error response message
- Verify MongoDB is running
- Check `.env` configuration
- Review log output in terminal
- Consult [docs/AUTH_API.md](AUTH_API.md) for endpoint details
