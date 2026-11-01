import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import asyncHandler from '../middleware/asyncHandler.js';
import ApiError from '../utils/ApiError.js';
import User from '../models/User.js';
import { issueTokens, generateAccessToken } from '../utils/generateToken.js';
import { sendVerificationEmail, sendPasswordResetEmail } from '../services/emailService.js';

// @route  POST /api/auth/register
export const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) throw new ApiError('Name, email and password are required', 400);

  const existing = await User.findOne({ email });
  if (existing) throw new ApiError('An account with this email already exists', 409);

  const user = await User.create({ name, email, password });

  const verifyToken = crypto.randomBytes(32).toString('hex');
  user.emailVerificationToken = crypto.createHash('sha256').update(verifyToken).digest('hex');
  user.emailVerificationExpires = Date.now() + 24 * 60 * 60 * 1000;
  await user.save({ validateBeforeSave: false });

  const verifyUrl = `${process.env.CLIENT_URL}/verify-email/${verifyToken}`;
  sendVerificationEmail(user.email, user.name, verifyUrl).catch((e) =>
    console.error('Failed to send verification email:', e.message)
  );

  const accessToken = issueTokens(res, user._id);
  res.status(201).json({ success: true, accessToken, user: user.toSafeObject() });
});

// @route  POST /api/auth/login
export const login = asyncHandler(async (req, res) => {
  const identifier = (req.body.identifier || req.body.email || '').trim().toLowerCase();
  const { password } = req.body;
  if (!identifier || !password) throw new ApiError('Username/email and password are required', 400);

  const email = identifier === 'admin' ? 'admin@ronvero.local' : identifier;
  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await user.comparePassword(password))) {
    throw new ApiError('Invalid email or password', 401);
  }

  user.lastLoginAt = new Date();
  await user.save({ validateBeforeSave: false });

  const accessToken = issueTokens(res, user._id);
  res.json({ success: true, accessToken, user: user.toSafeObject() });
});

// @route  POST /api/auth/logout
export const logout = asyncHandler(async (req, res) => {
  res.clearCookie('refreshToken', { path: '/api/auth' });
  res.json({ success: true, message: 'Logged out' });
});

// @route  POST /api/auth/refresh
export const refreshToken = asyncHandler(async (req, res) => {
  const token = req.cookies?.refreshToken;
  if (!token) throw new ApiError('No refresh token provided', 401);

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
  } catch (err) {
    throw new ApiError('Refresh token invalid or expired — please log in again', 401);
  }

  const user = await User.findById(decoded.id);
  if (!user) throw new ApiError('User no longer exists', 401);

  const accessToken = generateAccessToken(user._id);
  res.json({ success: true, accessToken });
});

// @route  GET /api/auth/me
export const getMe = asyncHandler(async (req, res) => {
  res.json({ success: true, user: req.user });
});

// @route  PUT /api/auth/update-password
export const updatePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const user = await User.findById(req.user._id).select('+password');

  if (!(await user.comparePassword(currentPassword))) {
    throw new ApiError('Current password is incorrect', 401);
  }
  user.password = newPassword;
  await user.save();
  res.json({ success: true, message: 'Password updated' });
});

// @route  POST /api/auth/forgot-password
export const forgotPassword = asyncHandler(async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  // Always respond with success to avoid leaking which emails are registered
  if (!user) {
    return res.json({ success: true, message: 'If that email exists, a reset link has been sent' });
  }

  const resetToken = crypto.randomBytes(32).toString('hex');
  user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
  user.resetPasswordExpires = Date.now() + 30 * 60 * 1000;
  await user.save({ validateBeforeSave: false });

  const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;
  await sendPasswordResetEmail(user.email, user.name, resetUrl).catch((e) =>
    console.error('Failed to send reset email:', e.message)
  );

  res.json({ success: true, message: 'If that email exists, a reset link has been sent' });
});

// @route  PUT /api/auth/reset-password/:token
export const resetPassword = asyncHandler(async (req, res) => {
  const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');

  const user = await User.findOne({
    resetPasswordToken: hashedToken,
    resetPasswordExpires: { $gt: Date.now() },
  }).select('+password');

  if (!user) throw new ApiError('Reset link is invalid or has expired', 400);

  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;
  await user.save();

  const accessToken = issueTokens(res, user._id);
  res.json({ success: true, accessToken, message: 'Password reset — you are now logged in' });
});

// @route  GET /api/auth/verify-email/:token
export const verifyEmail = asyncHandler(async (req, res) => {
  const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');

  const user = await User.findOne({
    emailVerificationToken: hashedToken,
    emailVerificationExpires: { $gt: Date.now() },
  });

  if (!user) throw new ApiError('Verification link is invalid or has expired', 400);

  user.isEmailVerified = true;
  user.emailVerificationToken = undefined;
  user.emailVerificationExpires = undefined;
  await user.save({ validateBeforeSave: false });

  res.json({ success: true, message: 'Email verified' });
});
