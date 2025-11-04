import express from 'express';
import { protect } from '../middleware/auth.js';
import {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask,
  getTaskInsights,
} from '../controllers/taskController.js';

const router = express.Router();

// All routes are protected and require authentication
router.route('/')
  .post(protect, createTask)
  .get(protect, getTasks);

router.get('/insights', protect, getTaskInsights);

router.route('/:id')
  .get(protect, getTaskById)
  .put(protect, updateTask)
  .delete(protect, deleteTask);

export default router;
