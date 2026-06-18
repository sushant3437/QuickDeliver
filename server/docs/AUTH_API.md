# Authentication API Documentation

## Overview

This API uses JWT (JSON Web Tokens) for stateless authentication. The first registered user becomes an admin, all subsequent registrations create customer accounts.

## Base URL

```
http://localhost:5000/api
```

## Authentication Header

Protected endpoints require an Authorization header with a Bearer token:

```
Authorization: Bearer <token>
```

---

## Endpoints

### 1. Register User

**Endpoint:** `POST /auth/register`

Register a new user account. The first registration creates an admin user; subsequent registrations create customer accounts.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "Password123",
  "passwordConfirm": "Password123"
}
```

**Validation Rules:**
- `name`: Required, min 2 characters
- `email`: Required, valid email format, unique
- `password`: Required, min 6 characters
- `passwordConfirm`: Must match password

**Success Response (201):**
```json
{
  "status": 201,
  "message": "User registered successfully as admin",
  "data": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "admin"
  }
}
```

**Error Response (400/409):**
```json
{
  "status": 400,
  "message": "Password must be at least 6 characters"
}
```

```json
{
  "status": 409,
  "message": "Email already registered",
  "details": {
    "field": "email"
  }
}
```

**cURL Example:**
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "Password123",
    "passwordConfirm": "Password123"
  }'
```

---

### 2. Login User

**Endpoint:** `POST /auth/login`

Authenticate user and receive JWT token for subsequent requests.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "Password123"
}
```

**Validation Rules:**
- `email`: Required
- `password`: Required

**Success Response (200):**
```json
{
  "status": 200,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "507f1f77bcf86cd799439011",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "admin"
    }
  }
}
```

**Token Format:**
- Type: JWT (JSON Web Token)
- Expiry: 24 hours
- Payload: user ID, email, role

**Error Response (401):**
```json
{
  "status": 401,
  "message": "Invalid email or password"
}
```

**cURL Example:**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "Password123"
  }'
```

---

### 3. Get Current User Profile

**Endpoint:** `GET /auth/me`

Retrieve the profile of the currently authenticated user.

**Authentication:** Required (Bearer token)

**Success Response (200):**
```json
{
  "status": 200,
  "message": "User profile retrieved",
  "data": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "admin",
    "isActive": true
  }
}
```

**Error Response (401):**
```json
{
  "status": 401,
  "message": "Access token is required"
}
```

**cURL Example:**
```bash
curl -X GET http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

---

## Status Codes

| Code | Meaning |
|------|---------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request (validation error) |
| 401 | Unauthorized (missing/invalid token) |
| 403 | Forbidden (insufficient permissions) |
| 404 | Not Found |
| 409 | Conflict (e.g., email already registered) |
| 500 | Internal Server Error |

---

## Error Response Format

All errors follow this format:

```json
{
  "status": 400,
  "message": "Human-readable error message",
  "details": {
    "field": "additional context (development only)"
  }
}
```

In production, `details` are omitted for security.

---

## Workflow Examples

### Complete Registration & Login Flow

1. **Register first user (becomes admin):**
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
Response will show `"role": "admin"`

2. **Register second user (becomes customer):**
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Customer",
    "email": "customer@delivery.com",
    "password": "CustPass123",
    "passwordConfirm": "CustPass123"
  }'
```
Response will show `"role": "customer"`

3. **Login to get token:**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@delivery.com",
    "password": "AdminPass123"
  }'
```
Save the token from response

4. **Use token to access protected routes:**
```bash
curl -X GET http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer <token>"
```

---

## Testing with Postman

### Setup

1. **Create POST request to `/api/auth/register`**
   - URL: `http://localhost:5000/api/auth/register`
   - Body (raw JSON):
     ```json
     {
       "name": "Test User",
       "email": "test@example.com",
       "password": "TestPass123",
       "passwordConfirm": "TestPass123"
     }
     ```

2. **Create POST request to `/api/auth/login`**
   - URL: `http://localhost:5000/api/auth/login`
   - Body (raw JSON):
     ```json
     {
       "email": "test@example.com",
       "password": "TestPass123"
     }
     ```

3. **Create GET request to `/api/auth/me`**
   - URL: `http://localhost:5000/api/auth/me`
   - Headers: Add `Authorization: Bearer <token>`
   - Replace `<token>` with the token from login response

---

## Security Notes

- **Passwords:** Hashed with bcryptjs (salt rounds: 10), never stored in plaintext
- **Tokens:** JWT with 24-hour expiration
- **Email:** Converted to lowercase for consistent lookups
- **Password Hash:** Never returned in API responses
- **HTTPS:** Use in production
- **Token Storage:** Store securely on client (HttpOnly cookies recommended)

---

## Middleware

All authentication is handled via two middleware functions:

1. **`authenticateToken`** - Verifies JWT and attaches user to request
2. **`requireRole('admin'|'customer'|['admin','customer'])`** - Checks user authorization

Protected routes use:
```javascript
router.get('/endpoint', authenticateToken, requireAdmin, handler);
```

---

## Next Steps

After authentication is working:
1. Implement slot CRUD APIs for admin
2. Implement customer slot browsing
3. Implement booking and cancellation logic
4. Add role-based route protection
