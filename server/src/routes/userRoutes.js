const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { createUserValidator, updateUserValidator, updateProfileValidator } = require('../validators/userValidators');
const validate = require('../middleware/validate');
const { protect, authorize } = require('../middleware/auth');

// All routes below require authentication
router.use(protect);

// Profile route (any authenticated user)
router.put('/profile/me', updateProfileValidator, validate, userController.updateProfile);

// Admin & Manager routes
router.get('/', authorize('admin', 'manager'), userController.getUsers);
router.get('/:id', authorize('admin', 'manager'), userController.getUser);

// Admin only routes
router.post('/', authorize('admin'), createUserValidator, validate, userController.createUser);
router.put('/:id', authorize('admin', 'manager'), updateUserValidator, validate, userController.updateUser);
router.delete('/:id', authorize('admin'), userController.deleteUser);

module.exports = router;
