const User = require('../models/User');
const RefreshToken = require('../models/RefreshToken');
const AuditLog = require('../models/AuditLog');
const AppError = require('../utils/AppError');
const { generateAccessToken, generateRefreshToken } = require('../utils/generateToken');
const config = require('../config/env');

/**
 * Register a new user
 */
const register = async ({ name, email, password }) => {
  // Check if user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new AppError('User with this email already exists', 400);
  }

  const user = await User.create({ name, email, password });
  const tokens = await generateTokens(user);

  return {
    user: user.toJSON(),
    ...tokens,
  };
};

/**
 * Login user
 */
const login = async ({ email, password }) => {
  // Find user with password field
  const user = await User.findOne({ email }).select('+password');

  if (!user) {
    throw new AppError('Invalid email or password', 401);
  }

  if (user.status !== 'active') {
    throw new AppError('Your account has been deactivated. Contact an admin.', 403);
  }

  // Check password
  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    throw new AppError('Invalid email or password', 401);
  }

  // Update last login
  user.lastLoginAt = new Date();
  user.lastLoginAt = new Date();
  await user.save({ validateBeforeSave: false });

  await AuditLog.create({
    action: 'LOGIN',
    entityId: user._id,
    performedBy: user._id,
  });

  const tokens = await generateTokens(user);

  return {
    user: user.toJSON(),
    ...tokens,
  };
};

/**
 * Refresh access token
 */
const refreshAccessToken = async (refreshTokenStr) => {
  if (!refreshTokenStr) {
    throw new AppError('Refresh token is required', 400);
  }

  // Find the refresh token in DB
  const tokenDoc = await RefreshToken.findOne({
    token: refreshTokenStr,
    isRevoked: false,
  });

  if (!tokenDoc) {
    throw new AppError('Invalid or expired refresh token', 401);
  }

  // Check expiry
  if (tokenDoc.expiresAt < new Date()) {
    tokenDoc.isRevoked = true;
    await tokenDoc.save();
    throw new AppError('Refresh token has expired', 401);
  }

  // Get user
  const user = await User.findById(tokenDoc.userId);
  if (!user || user.status !== 'active') {
    throw new AppError('User not found or inactive', 401);
  }

  // Generate new access token
  const accessToken = generateAccessToken(user._id, user.role);

  return {
    accessToken,
    user: user.toJSON(),
  };
};

/**
 * Logout — revoke refresh token
 */
const logout = async (refreshTokenStr) => {
  if (refreshTokenStr) {
    const tokenDoc = await RefreshToken.findOneAndUpdate(
      { token: refreshTokenStr },
      { isRevoked: true }
    );
    if (tokenDoc) {
      await AuditLog.create({
        action: 'LOGOUT',
        entityId: tokenDoc.userId,
        performedBy: tokenDoc.userId,
      });
    }
  }
};

/**
 * Helper: Generate access + refresh tokens and store refresh in DB
 */
const generateTokens = async (user) => {
  const accessToken = generateAccessToken(user._id, user.role);
  const refreshToken = generateRefreshToken(user._id);

  // Parse expiry from config (e.g., "7d")
  const expiresIn = config.jwtRefreshExpiresIn;
  let expiresMs = 7 * 24 * 60 * 60 * 1000; // default 7 days
  if (expiresIn.endsWith('d')) {
    expiresMs = parseInt(expiresIn) * 24 * 60 * 60 * 1000;
  } else if (expiresIn.endsWith('h')) {
    expiresMs = parseInt(expiresIn) * 60 * 60 * 1000;
  }

  // Store refresh token
  await RefreshToken.create({
    userId: user._id,
    token: refreshToken,
    expiresAt: new Date(Date.now() + expiresMs),
  });

  return { accessToken, refreshToken };
};

module.exports = { register, login, refreshAccessToken, logout };
