import {
  registerUser,
  loginUser,
  getUserById,
  generateToken,
} from '../services/authService.js';
import { ValidationError } from '../utils/errors.js';

/**
 * Register a new user
 * POST /api/auth/register
 */
export const register = async (req, res, next) => {
  try {
    const { name, email, password, passwordConfirm } = req.body;

    // Validation
    if (!name || !email || !password) {
      throw new ValidationError('Name, email, and password are required');
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new ValidationError('Please provide a valid email address');
    }

    const passwordRegex = /^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/;
    if (!passwordRegex.test(password)) {
      throw new ValidationError(
        'Password must be at least 8 characters long and include one uppercase letter, one number, and one special character'
      );
    }

    if (password !== passwordConfirm) {
      throw new ValidationError('Passwords do not match');
    }

    // Register user
    const user = await registerUser(name, email, password);

    // Generate JWT token (auto-login on registration)
    const token = generateToken(user);

    res.status(201).json({
      status: 201,
      message: `User registered successfully as ${user.role}`,
      data: {
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Login user
 * POST /api/auth/login
 */
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      throw new ValidationError('Email and password are required');
    }

    // Login
    const result = await loginUser(email, password);

    res.status(200).json({
      status: 200,
      message: 'Login successful',
      data: {
        token: result.token,
        user: result.user,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get current user profile
 * GET /api/auth/me
 */
export const getCurrentUser = async (req, res, next) => {
  try {
    // User is set by authenticateToken middleware
    const user = await getUserById(req.user.id);

    res.status(200).json({
      status: 200,
      message: 'User profile retrieved',
      data: user,
    });
  } catch (error) {
    next(error);
  }
};
