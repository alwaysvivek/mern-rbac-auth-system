const User = require('../models/User');
const AppError = require('../utils/AppError');
const generatePassword = require('../utils/generatePassword');

/**
 * Get all users with pagination, search, and filters
 */
const getAllUsers = async ({ page = 1, limit = 10, search, role, status, sort = '-createdAt' }) => {
  const query = {};

  // Search by name or email
  if (search) {
    query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
    ];
  }

  // Filter by role
  if (role) {
    query.role = role;
  }

  // Filter by status
  if (status) {
    query.status = status;
  }

  const pageNum = Math.max(1, parseInt(page, 10));
  const limitNum = Math.min(50, Math.max(1, parseInt(limit, 10)));
  const skip = (pageNum - 1) * limitNum;

  const [users, total] = await Promise.all([
    User.find(query)
      .populate('createdBy', 'name email')
      .populate('updatedBy', 'name email')
      .sort(sort)
      .skip(skip)
      .limit(limitNum),
    User.countDocuments(query),
  ]);

  return {
    users,
    pagination: {
      page: pageNum,
      limit: limitNum,
      total,
      pages: Math.ceil(total / limitNum),
    },
  };
};

/**
 * Get single user by ID
 */
const getUserById = async (id) => {
  const user = await User.findById(id)
    .populate('createdBy', 'name email')
    .populate('updatedBy', 'name email');

  if (!user) {
    throw new AppError('User not found', 404);
  }

  return user;
};

/**
 * Create a new user (admin only)
 */
const createUser = async (data, creatorId) => {
  const { name, email, password, role, status } = data;

  // Check if user exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new AppError('User with this email already exists', 400);
  }

  // Auto-generate password if not provided
  const userPassword = password || generatePassword();

  const user = await User.create({
    name,
    email,
    password: userPassword,
    role: role || 'user',
    status: status || 'active',
    createdBy: creatorId,
    updatedBy: creatorId,
  });

  return {
    user: user.toJSON(),
    generatedPassword: !password ? userPassword : undefined,
  };
};

/**
 * Update a user
 */
const updateUser = async (id, data, updaterId, updaterRole) => {
  const user = await User.findById(id);

  if (!user) {
    throw new AppError('User not found', 404);
  }

  // Managers cannot update admin users
  if (updaterRole === 'manager' && user.role === 'admin') {
    throw new AppError('Managers cannot modify admin users', 403);
  }

  // Only admin can change roles
  if (data.role && updaterRole !== 'admin') {
    throw new AppError('Only admins can change user roles', 403);
  }

  // Update allowed fields
  const allowedFields = ['name', 'email', 'role', 'status'];
  allowedFields.forEach((field) => {
    if (data[field] !== undefined) {
      user[field] = data[field];
    }
  });

  // Handle password update
  if (data.password) {
    user.password = data.password;
  }

  user.updatedBy = updaterId;
  await user.save();

  return user;
};

/**
 * Soft delete (deactivate) a user
 */
const deleteUser = async (id, deleterId) => {
  const user = await User.findById(id);

  if (!user) {
    throw new AppError('User not found', 404);
  }

  // Prevent deleting yourself
  if (user._id.toString() === deleterId.toString()) {
    throw new AppError('You cannot delete your own account', 400);
  }

  // Soft delete: set status to inactive
  user.status = 'inactive';
  user.updatedBy = deleterId;
  await user.save();

  return user;
};

/**
 * Update own profile (any authenticated user)
 */
const updateProfile = async (userId, data) => {
  const user = await User.findById(userId).select('+password');

  if (!user) {
    throw new AppError('User not found', 404);
  }

  // Update name if provided
  if (data.name) {
    user.name = data.name;
  }

  // Update password if provided
  if (data.password) {
    // Require current password for security
    if (!data.currentPassword) {
      throw new AppError('Current password is required to set a new password', 400);
    }

    const isMatch = await user.comparePassword(data.currentPassword);
    if (!isMatch) {
      throw new AppError('Current password is incorrect', 400);
    }

    user.password = data.password;
  }

  user.updatedBy = userId;
  await user.save();

  return user;
};

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  updateProfile,
};
