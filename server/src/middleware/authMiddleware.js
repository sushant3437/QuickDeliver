import { verifyToken } from '../services/authService.js';
import { AuthenticationError, AuthorizationError } from '../utils/errors.js';

/**
 * Verify JWT token and attach user to request
 * Should be used on protected routes
 */
export const authenticateToken = (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer <token>

    if (!token) {
      throw new AuthenticationError('Access token is required');
    }

    // Verify token
    const decoded = verifyToken(token);

    // Attach user info to request
    req.user = {
      id: decoded.id,
      email: decoded.email,
      role: decoded.role,
    };

    next();
  } catch (error) {
    next(error);
  }
};

/**
 * Check if user has required role
 * Usage: requireRole('admin') or requireRole(['admin', 'moderator'])
 */
export const requireRole = (allowedRoles) => {
  const roles = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];

  return (req, res, next) => {
    // User should be authenticated first (authenticateToken middleware)
    if (!req.user) {
      const error = new AuthenticationError('Authentication required');
      return next(error);
    }

    // Check if user's role is in allowed roles
    if (!roles.includes(req.user.role)) {
      const error = new AuthorizationError(
        'You do not have permission to access this resource'
      );
      return next(error);
    }

    next();
  };
};

/**
 * Shortcut: require admin role
 */
export const requireAdmin = requireRole('admin');

/**
 * Shortcut: require customer role
 */
export const requireCustomer = requireRole('customer');
