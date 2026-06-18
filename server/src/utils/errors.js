/**
 * Custom API Error class for consistent error handling
 */
export class ApiError extends Error {
  constructor(statusCode, message, details = {}) {
    super(message);
    this.statusCode = statusCode;
    this.details = details;
    this.name = 'ApiError';
  }
}

/**
 * Validation Error (400)
 */
export class ValidationError extends ApiError {
  constructor(message, details = {}) {
    super(400, message, details);
    this.name = 'ValidationError';
  }
}

/**
 * Authentication Error (401)
 */
export class AuthenticationError extends ApiError {
  constructor(message = 'Unauthorized', details = {}) {
    super(401, message, details);
    this.name = 'AuthenticationError';
  }
}

/**
 * Authorization Error (403)
 */
export class AuthorizationError extends ApiError {
  constructor(message = 'Forbidden', details = {}) {
    super(403, message, details);
    this.name = 'AuthorizationError';
  }
}

/**
 * Not Found Error (404)
 */
export class NotFoundError extends ApiError {
  constructor(message = 'Resource not found', details = {}) {
    super(404, message, details);
    this.name = 'NotFoundError';
  }
}

/**
 * Conflict Error (409)
 */
export class ConflictError extends ApiError {
  constructor(message = 'Conflict', details = {}) {
    super(409, message, details);
    this.name = 'ConflictError';
  }
}
