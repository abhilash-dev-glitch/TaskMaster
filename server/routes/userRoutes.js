import express from 'express';
import { protect, admin } from '../middleware/auth.js';
import {
  registerUser,
  authUser,
  getUserProfile,
  updateUserProfile,
  getUsers,
} from '../controllers/userController.js';

const router = express.Router();

// Public routes
router.route('/register').post(registerUser);  // New dedicated register route
router.route('/').post(registerUser);          // Keep existing route for backward compatibility
router.post('/login', authUser);

// Protected routes
router.route('/profile').get(protect, getUserProfile).put(protect, updateUserProfile);

// Admin routes
router.route('/').get(protect, admin, getUsers);

export default router;