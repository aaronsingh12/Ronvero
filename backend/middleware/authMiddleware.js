import jwt from 'jsonwebtoken';
import asyncHandler from './asyncHandler.js';
import ApiError from '../utils/ApiError.js';
import User from '../models/User.js';

// Requires a valid access token in the Authorization header.
export const protect = asyncHandler(async (req, res, next) => {
  let token;
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.split(' ')[1];
  }

  if (!token) {
    throw new ApiError('Not authorized — no token provided', 401);
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password');
    if (!user) throw new ApiError('User no longer exists', 401);
    req.user = user;
    next();
  } catch (err) {
    throw new ApiError('Not authorized — invalid or expired token', 401);
  }
});

// Restricts a route to one or more roles, e.g. authorize('admin')
export const authorize =
  (...roles) =>
  (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      throw new ApiError(`Role "${req.user?.role || 'guest'}" is not permitted to access this resource`, 403);
    }
    next();
  };

// Attaches req.user if a valid token is present, but never blocks the request.
// Useful for endpoints that behave differently for logged-in users (e.g. reviews).
export const attachUserIfPresent = asyncHandler(async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    try {
      const decoded = jwt.verify(authHeader.split(' ')[1], process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select('-password');
    } catch (err) {
      req.user = null;
    }
  }
  next();
});
