const userService = require('../services/userService');

/**
 * @route   GET /api/v1/users
 * @desc    Get all users (paginated, searchable)
 * @access  Admin, Manager
 */
const getUsers = async (req, res, next) => {
  try {
    const { page, limit, search, role, status, sort } = req.query;
    const result = await userService.getAllUsers({ page, limit, search, role, status, sort });
    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/v1/users/:id
 * @desc    Get single user
 * @access  Admin, Manager
 */
const getUser = async (req, res, next) => {
  try {
    const user = await userService.getUserById(req.params.id);
    res.status(200).json({
      success: true,
      data: { user },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   POST /api/v1/users
 * @desc    Create new user
 * @access  Admin
 */
const createUser = async (req, res, next) => {
  try {
    const result = await userService.createUser(req.body, req.user._id);
    res.status(201).json({
      success: true,
      message: 'User created successfully',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   PUT /api/v1/users/:id
 * @desc    Update user
 * @access  Admin, Manager
 */
const updateUser = async (req, res, next) => {
  try {
    const user = await userService.updateUser(
      req.params.id,
      req.body,
      req.user._id,
      req.user.role
    );
    res.status(200).json({
      success: true,
      message: 'User updated successfully',
      data: { user },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   DELETE /api/v1/users/:id
 * @desc    Soft delete (deactivate) user
 * @access  Admin
 */
const deleteUser = async (req, res, next) => {
  try {
    const user = await userService.deleteUser(req.params.id, req.user._id);
    res.status(200).json({
      success: true,
      message: 'User deactivated successfully',
      data: { user },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   PUT /api/v1/users/profile/me
 * @desc    Update own profile
 * @access  Protected (all roles)
 */
const updateProfile = async (req, res, next) => {
  try {
    const user = await userService.updateProfile(req.user._id, req.body);
    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: { user },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getUsers, getUser, createUser, updateUser, deleteUser, updateProfile };
