import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { config } from '../config/environment.js';
import User from '../models/User.js';
import { AuthenticationError, ConflictError } from '../utils/errors.js';

/**
 * Register a new user
 * First user becomes admin, rest become customers
 */
export const registerUser = async (name, email, password) => {
  // Check if email already exists
  const existingUser = await User.findOne({ email: email.toLowerCase() });
  if (existingUser) {
    throw new ConflictError('Email already registered', {
      field: 'email',
    });
  }

  // Check if this is the first user (will become admin)
  const userCount = await User.countDocuments();
  const role = userCount === 0 ? 'admin' : 'customer';

  // Hash password
  const salt = await bcryptjs.genSalt(10);
  const passwordHash = await bcryptjs.hash(password, salt);

  // Create user
  const user = await User.create({
    name: name.trim(),
    email: email.toLowerCase(),
    passwordHash,
    role,
  });

  // Return full user document so token can be generated
  return user;
};

/**
 * Login user with email and password
 */
export const loginUser = async (email, password) => {
  // Find user by email
  const user = await User.findOne({ email: email.toLowerCase() }).select(
    '+passwordHash'
  );
  if (!user) {
    throw new AuthenticationError('Invalid email or password');
  }

  // Check if user is active
  if (!user.isActive) {
    throw new AuthenticationError('User account is inactive');
  }

  // Verify password
  const isPasswordValid = await bcryptjs.compare(password, user.passwordHash);
  if (!isPasswordValid) {
    throw new AuthenticationError('Invalid email or password');
  }

  // Update last login
  user.lastLogin = new Date();
  await user.save();

  // Generate JWT token
  const token = generateToken(user);

  return {
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  };
};

/**
 * Generate JWT token
 */
export const generateToken = (user) => {
  return jwt.sign(
    {
      id: user._id.toString(),
      email: user.email,
      role: user.role,
    },
    config.jwtSecret,
    {
      expiresIn: '24h',
    }
  );
};

/**
 * Verify and decode JWT token
 */
export const verifyToken = (token) => {
  try {
    return jwt.verify(token, config.jwtSecret);
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      throw new AuthenticationError('Token has expired');
    }
    throw new AuthenticationError('Invalid or malformed token');
  }
};

/**
 * Get user profile by ID
 */
export const getUserById = async (userId) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new AuthenticationError('User not found');
  }

  return {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    isActive: user.isActive,
  };
};
