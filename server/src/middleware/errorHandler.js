/**
 * Centralized error handling middleware
 * Catches all errors and returns consistent JSON response
 */
export const errorHandler = (err, req, res, _next) => {
  console.error('Error:', err);

  // Default error response
  const statusCode = err.statusCode || err.status || 500;
  const message = err.message || 'Internal Server Error';
  const details = err.details || {};

  // Don't expose internal error details to client in production
  const response = {
    status: statusCode,
    message,
    ...(process.env.NODE_ENV !== 'production' && { details }),
  };

  res.status(statusCode).json(response);
};

/**
 * Handle 404 - Not Found routes
 */
export const notFoundHandler = (req, res) => {
  res.status(404).json({
    status: 404,
    message: `Route not found: ${req.originalUrl}`,
  });
};

/**
 * Async error wrapper for controller functions
 * Prevents unhandled promise rejections
 */
export const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};
