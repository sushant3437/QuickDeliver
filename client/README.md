# Delivery Booking — Frontend (React + Vite + Tailwind)

React + Vite + Tailwind CSS + Axios + React Router frontend for the Delivery Slot Booking System.

## Project Structure

- `src/main.jsx` — Entry point; wraps app with `AuthProvider` and `BrowserRouter`.
- `src/App.jsx` — Route definitions and global layout (`Header`, `Footer`, `PageContainer`).
- `src/context/AuthContext.jsx` — Auth state management: token persistence, login/logout, session hydration.
- `src/api/` — API helper modules:
  - `axios.js` — Configured Axios instance with base URL and error unwrapping.
  - `auth.js` — Auth endpoint wrappers (`login`, `register`, `getCurrentUser`).
- `src/routes/ProtectedRoute.jsx` — Guarded route component for auth + role enforcement.
- `src/pages/` — Page components:
  - `Home.jsx` — Public slot listing (placeholder).
  - `Login.jsx`, `Register.jsx` — Auth forms with validation.
  - `customer/Dashboard.jsx` — Customer dashboard placeholder.
  - `admin/Dashboard.jsx` — Admin dashboard placeholder.
  - `NotFound.jsx` — 404 page.
- `src/components/layout/` — Layout components: `Header`, `Footer`, `PageContainer`.
- `src/utils/validation.js` — Form validation utilities and error mappers.

## Features Implemented

✅ Login page with email/password validation and backend integration  
✅ Register page with password strength validation  
✅ JWT token storage in localStorage and AuthContext  
✅ Session persistence (hydrate user on app load)  
✅ Role-based redirects (admin → `/admin`, customer → `/customer`)  
✅ Protected routes with `ProtectedRoute` component  
✅ Error handling and user-friendly error messages  
✅ Loading states during auth requests  
✅ Logout with session cleanup  
✅ Tailwind CSS styling

## Setup & Run

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create `.env` file (optional, if backend is on non-default port):
   ```
   VITE_API_BASE=http://localhost:5000/api
   ```

3. Start dev server:
   ```bash
   npm run dev
   ```
   Opens on `http://localhost:3000`

4. Build for production:
   ```bash
   npm run build
   ```

## Authentication Flow

1. User registers or logs in on `/login` or `/register`.
2. Backend returns JWT token + user info.
3. `AuthContext.login()` stores token in localStorage and Axios headers.
4. On app load, `AuthContext` hydrates user via `GET /api/auth/me`.
5. `ProtectedRoute` enforces auth + role; redirects to `/login` if needed.
6. Logout clears token and navigates to home.

## Next Steps

- Implement slot listing and details pages.
- Implement booking flow with suggestion handling.
- Implement customer dashboard and booking history.
- Implement admin dashboard and slot CRUD.
- Add responsive design polish and accessibility.
