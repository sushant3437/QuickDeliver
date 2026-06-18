# Authentication System Implementation Summary

## ✅ Completed in This Phase

### Architecture & Design
- **Pattern:** Service → Controller → Route
- **Authentication:** JWT (24-hour expiration)
- **Password Security:** bcryptjs with salt rounds = 10
- **First User Promotion:** Auto-promotes first registered user to admin role
- **Role-Based Access:** Admin and customer roles with middleware enforcement

### 1. Services Layer (`src/services/authService.js`)

Implements core business logic:

- **`registerUser(name, email, password)`**
  - Auto-promotes first user to admin
  - Hashes password with bcryptjs
  - Prevents duplicate email registrations
  - Returns user object (name, email, role)

- **`loginUser(email, password)`**
  - Validates credentials
  - Updates lastLogin timestamp
  - Returns JWT token + user data

- **`generateToken(user)`**
  - Creates JWT with payload: id, email, role
  - Expiry: 24 hours
  - Uses JWT_SECRET from env

- **`verifyToken(token)`**
  - Decodes and validates token
  - Throws specific errors for expired/invalid tokens

- **`getUserById(userId)`**
  - Retrieves user profile
  - Never includes password hash

### 2. Controllers Layer (`src/controllers/authController.js`)

Handles HTTP requests and validation:

- **`register(req, res, next)`**
  - Validates: name, email, password format, password match
  - Calls registerUser service
  - Returns 201 with user data or error

- **`login(req, res, next)`**
  - Validates: email and password present
  - Calls loginUser service
  - Returns 200 with token + user data

- **`getCurrentUser(req, res, next)`**
  - Protected endpoint (requires token)
  - Returns authenticated user profile

### 3. Middleware (`src/middleware/authMiddleware.js`)

Protects routes and enforces authorization:

- **`authenticateToken(req, res, next)`**
  - Extracts Bearer token from Authorization header
  - Verifies token using JWT
  - Attaches user (id, email, role) to `req.user`
  - Throws 401 if missing/invalid

- **`requireRole(allowedRoles)`**
  - Checks if user's role is in allowed list
  - Supports single role: `requireRole('admin')`
  - Or multiple: `requireRole(['admin', 'moderator'])`
  - Returns 403 if unauthorized

- **`requireAdmin`** - Shortcut for `requireRole('admin')`
- **`requireCustomer`** - Shortcut for `requireRole('customer')`

### 4. Routes (`src/routes/authRoutes.js`)

API endpoints:

```
POST   /api/auth/register    - Public, creates user
POST   /api/auth/login       - Public, returns JWT
GET    /api/auth/me          - Protected, returns profile
```

Middleware chain:
- Register/Login: None (public)
- Me: `authenticateToken` → handler

### 5. Error Handling

Custom error classes in `src/utils/errors.js`:

- **`ValidationError`** (400) - Invalid input
- **`AuthenticationError`** (401) - Invalid credentials/token
- **`AuthorizationError`** (403) - Insufficient permissions
- **`ConflictError`** (409) - Email already registered

Global error handler catches all errors and returns consistent JSON responses.

### 6. Database Models

Already implemented:
- **User Model**: name, email (unique), passwordHash, role, isActive, lastLogin
- Indexes on email for fast login lookups
- Pre-hooks validate email format and role enum

---

## 📋 API Endpoints

### Register
```
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "Password123",
  "passwordConfirm": "Password123"
}

Response (201):
{
  "status": 201,
  "message": "User registered successfully as admin",
  "data": {
    "id": "...",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "admin"
  }
}
```

### Login
```
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "Password123"
}

Response (200):
{
  "status": 200,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGci...",
    "user": {
      "id": "...",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "admin"
    }
  }
}
```

### Get Current User
```
GET /api/auth/me
Authorization: Bearer <token>

Response (200):
{
  "status": 200,
  "message": "User profile retrieved",
  "data": {
    "id": "...",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "admin",
    "isActive": true
  }
}
```

---

## 🔐 Security Features

✅ **Password Hashing:** bcryptjs with 10 salt rounds
✅ **JWT Tokens:** 24-hour expiration, signed with secret
✅ **Email Validation:** Format validation on registration
✅ **Email Uniqueness:** Database unique index + pre-check
✅ **Email Lowercase:** Case-insensitive lookups
✅ **Password Privacy:** Hash never returned in responses
✅ **Role Enforcement:** Middleware checks on protected routes
✅ **Error Obfuscation:** Generic "invalid credentials" message (no user enumeration)
✅ **CORS Protection:** Only frontend origin allowed
✅ **Helmet Security:** Headers set via helmet middleware

---

## 🧪 Testing

### Manual Testing (cURL)

**1. Register first user (becomes admin):**
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Admin",
    "email": "admin@test.com",
    "password": "Pass1234",
    "passwordConfirm": "Pass1234"
  }'
```

**2. Register second user (becomes customer):**
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Customer",
    "email": "customer@test.com",
    "password": "Pass1234",
    "passwordConfirm": "Pass1234"
  }'
```

**3. Login and get token:**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@test.com",
    "password": "Pass1234"
  }'
```

**4. Use token on protected route:**
```bash
curl -X GET http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer <token>"
```

### Postman Collection

See [docs/SETUP.md](SETUP.md#testing-with-postman) for Postman setup instructions.

---

## 📁 Files Created/Modified

### New Files
- `src/services/authService.js` - Auth business logic
- `src/services/index.js` - Services exports
- `src/controllers/authController.js` - Auth request handlers
- `src/middleware/authMiddleware.js` - JWT verification & role checks
- `docs/AUTH_API.md` - API documentation
- `docs/SETUP.md` - Setup and testing guide

### Modified Files
- `src/routes/authRoutes.js` - Implemented auth endpoints
- `src/app.js` - Enabled auth routes
- `src/utils/errors.js` - Already had error classes
- `package.json` - Removed seed script
- `docs/DATABASE_SCHEMA.md` - Updated with first-user-admin logic

---

## 🏗️ Integration Points

### How It Works

1. **User registers** → Service auto-promotes first to admin
2. **Password hashed** → Stored in DB, never exposed
3. **User logs in** → Service validates password and generates JWT
4. **Token included** → Client sends `Authorization: Bearer <token>`
5. **Token verified** → Middleware checks JWT signature and expiry
6. **User attached** → Route handler accesses `req.user`
7. **Role checked** → `requireAdmin` middleware validates role
8. **Request processed** → Handler returns response

### Example Protected Route Pattern

```javascript
// Admin-only endpoint
router.post('/admin/slots',
  authenticateToken,    // Step 1: Verify token
  requireAdmin,         // Step 2: Check role
  asyncHandler(createSlot)  // Step 3: Handle request
);
```

---

## 🚀 Ready for Next Phase

Authentication is complete and ready for:
1. **Slot APIs** - Admin can create/update/delete slots
2. **Booking APIs** - Customers can book slots (protected by `requireCustomer`)
3. **Admin APIs** - Dashboard endpoints (protected by `requireAdmin`)

All protected routes will use:
- `authenticateToken` to verify JWT
- `requireAdmin` or `requireCustomer` to check role

---

## 🐛 Common Issues & Fixes

| Issue | Cause | Solution |
|-------|-------|----------|
| "Access token is required" | No Authorization header | Include `Authorization: Bearer <token>` |
| "Invalid or malformed token" | Expired/wrong token | Login again to get new token |
| "Email already registered" | Duplicate email | Use unique email |
| "Password must be at least 6 characters" | Weak password | Use 6+ char password |
| "Passwords do not match" | passwordConfirm != password | Ensure both passwords match |
| "You do not have permission" | Wrong role | Use admin user for admin endpoints |

---

## 📝 Next Steps

1. Implement **Slot APIs** (admin CRUD, customer browse)
2. Implement **Booking APIs** (create, cancel, list)
3. Add **Admin Analytics** (stats, reports)
4. Implement **Input Validation** (express-validator)
5. Add **Tests** (unit, integration, concurrency)
6. Build **Frontend** (React + Tailwind)

The authentication foundation is solid and ready to support these features.
