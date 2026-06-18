# QuickDeliver

QuickDeliver is a full-stack delivery slot booking platform that enables customers to seamlessly browse available delivery slots, reserve convenient time windows, and manage their bookings. It also provides administrators with comprehensive tools to create and manage slots, monitor reservations, and analyze booking activity.

## Project Overview

The application is split into two parts:

- **Frontend:** A React + Vite + Tailwind CSS user interface for browsing slots, logging in, registering, and managing bookings.
- **Backend:** A Node.js + Express + MongoDB REST API that handles authentication, slot management, booking workflow, authorization, and centralized error handling.

The system uses JWT-based authentication and role-based access control to separate customer and admin capabilities.

## System Architecture

QuickDeliver follows a simple full-stack request flow:

```text
React Frontend
	|
	v
Axios API Requests
	|
	v
Node.js / Express Backend
	|
	v
Authentication and Business Logic
	|
	v
Mongoose Models
	|
	v
MongoDB Database
```

The frontend sends requests through Axios, the backend handles authentication and business rules, and Mongoose manages data access to MongoDB.

## Customer Features

- Register and log in to the platform.
- Browse available delivery slots on the home page.
- View detailed slot information, including timing, location, notes, and occupancy.
- Book a slot from the slot details page.
- Receive an alternative-slot suggestion if the selected slot is already full.
- View booking history from the customer dashboard.
- Cancel an existing booking.
- See clear success, loading, and error states throughout the flow.

## Admin Features

- Access a protected admin dashboard after authentication.
- Create, update, and delete delivery slots.
- View all bookings across the platform.
- Monitor booking statistics and slot occupancy trends.
- Review customer and system activity through dedicated admin pages.
- Prevent admins from booking slots from the customer booking flow.

## Technology Stack

### Frontend

- React 18
- Vite
- React Router DOM
- Axios
- Tailwind CSS
- date-fns

### Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT authentication
- bcryptjs password hashing
- express-validator
- Helmet
- CORS

### Development Tools

- ESLint
- Nodemon
- Jest and Supertest are included in the backend package configuration, although no automated test files are currently part of this submission.

## Project Structure

```text
QuickDeliver/
├── client/
│   ├── src/
│   │   ├── api/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   ├── routes/
│   │   └── utils/
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
├── server/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── services/
│   │   └── utils/
│   ├── docs/
│   ├── package.json
│   └── .env.example
└── README.md
```

## Setup and Run Instructions

### Prerequisites

- Node.js 16+ recommended
- npm installed
- MongoDB running locally or a valid MongoDB Atlas connection string

### 1. Clone or open the project

```bash
cd "QuickDeliver"
```

### 2. Configure the backend environment

Create a `server/.env` file based on `server/.env.example`.

```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://localhost:27017/delivery-booking
JWT_SECRET=your_super_secret_jwt_key_change_in_production
CORS_ORIGIN=http://localhost:3000
```

### 3. Install backend dependencies

```bash
cd server
npm install
```

### 4. Start the backend server

```bash
npm run dev
```

The API runs at:

```text
http://localhost:5000
```

Health check endpoint:

```text
GET /api/health
```

### 5. Configure the frontend environment

Create a `client/.env` file if you want to override the default API base URL.

```env
VITE_API_BASE=http://localhost:5000/api
```

### 6. Install frontend dependencies

```bash
cd ../client
npm install
```

### 7. Start the frontend app

```bash
npm run dev
```

The Vite development server runs at:

```text
http://localhost:3000
```

### 8. Build for production

```bash
# backend
cd ../server
npm start

# frontend
cd ../client
npm run build
```

## Required Environment Variables

### Backend

- `PORT` - Server port. Default: `5000`
- `NODE_ENV` - Environment mode, such as `development` or `production`
- `MONGO_URI` - MongoDB connection string
- `JWT_SECRET` - Secret used to sign JWT tokens
- `CORS_ORIGIN` - Allowed frontend origin, typically `http://localhost:3000`

### Frontend

- `VITE_API_BASE` - Base API URL used by Axios, typically `http://localhost:5000/api`

## Validation and Error Handling

Validation is implemented on both the client and server to keep the booking flow predictable and user-friendly.

- Client forms validate required fields, email format, password strength, and password confirmation before requests are sent.
- The backend validates authentication payloads, slot input, booking requests, and role-based access.
- Custom error classes provide structured responses for validation, authentication, authorization, conflict, and not-found cases.
- The API returns consistent error payloads in the format `{"status", "message", "details"}`.
- The Axios client unwraps API errors so the UI can display meaningful messages instead of raw HTTP responses.
- Loading states, alerts, and disabled buttons prevent duplicate submissions and reduce confusion during async operations.

## User Experience

- Clean, responsive interface built with Tailwind CSS.
- Dedicated loading states for authentication, slot listing, and booking actions.
- Error alerts for failed requests and invalid form input.
- Confirmation modal before booking a slot.
- Suggestion modal when the selected slot is full, allowing the customer to choose the next available option.
- Protected routes redirect unauthenticated users to the login page.
- Role-aware navigation ensures customers and admins land on the correct dashboard after sign-in.

## Application Screenshots

### Authentication Module

| Login Page | Register Page |
|:---:|:---:|
| ![Login Page](client/screenshots/Login%20Page.png) | ![Register Page](client/screenshots/Register%20Page.png) |
| User authentication interface with email and password validation | Account creation form with password strength requirements |

### Customer Module

| Home Page | Dashboard |
|:---:|:---:|
| ![Customer Home Page](client/screenshots/Customer%20home%20page.png) | ![Customer Dashboard](client/screenshots/Customer%20Dashboard.png) |
| Browse available delivery slots with real-time occupancy | Customer dashboard with booking overview and quick actions |

| Booking Page | Booking Confirmation |
|:---:|:---:|
| ![Customer Bookings](client/screenshots/Customer%20Booking.png) | ![Booking Confirmation](client/screenshots/Booking%20confirmation.png) |
| View and manage all customer bookings with cancel options | Confirmation modal for slot booking with details |

### Admin Module

| Dashboard | Bookings Management |
|:---:|:---:|
| ![Admin Dashboard](client/screenshots/Admin%20Dashboard.png) | ![Admin Bookings](client/screenshots/Admin%20Booking%20page.png) |
| Admin overview with key metrics and system statistics | Comprehensive view of all bookings with customer details |

| Statistics & Analytics |
|:---:|
| ![Admin Statistics](client/screenshots/Admin%20statitstics.png) |
| Real-time booking analytics and slot utilization metrics |

## Assumptions Made

- The first registered user is promoted to the admin role.
- MongoDB is available before starting the backend server.
- The frontend and backend run locally on ports `3000` and `5000` respectively.
- JWT authentication is handled entirely through bearer tokens and localStorage session persistence.
- Automated test coverage is not included in this submission.
- The booking flow prioritizes usability by suggesting another slot when capacity is exhausted.

## Challenges Faced

- Keeping auth state in sync across page refreshes while preserving a smooth login experience.
- Handling fully booked slots without breaking the booking flow by introducing a suggestion-based fallback.
- Maintaining consistent validation and error messaging across forms, API responses, and UI alerts.
- Enforcing role-based access so customers and admins only see the features relevant to them.
- Structuring the app as a clean full-stack submission while keeping the implementation easy to follow.

## AI Tools Used During Development

### ChatGPT
- Helped analyze and clarify project requirements to ensure all features were properly understood.
- Assisted in breaking down complex assignment requirements into actionable development phases.
- Supported architectural planning by discussing best practices for role-based access control, JWT authentication, and database schema design.
- Refined technical documentation and structured the README to clearly communicate project scope, setup, and implementation details.
- Collaborated on planning the full-stack workflow from authentication to booking management for both customer and admin flows.

### GitHub Copilot
- Accelerated development through intelligent code completion and context-aware suggestions.
- Assisted with React component scaffolding and JSX boilerplate generation.
- Enhanced backend service and controller implementations with code patterns and best practices.
- Supported error handling, middleware development, and route configuration.
- Improved overall development velocity while maintaining code quality and consistency.

## Notes

- The backend exposes a health check endpoint at `GET /api/health`.
- Frontend API requests are routed through the configured Axios instance in `client/src/api/axios.js`.
- The project currently focuses on the working application rather than automated testing.
