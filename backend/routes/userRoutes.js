// routes/userRoutes.js
import express from 'express';
import {
  getUserProfile,
  createOrUpdateUserProfile
} from '../controllers/userController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/me', authMiddleware, getUserProfile);
router.post('/sync', authMiddleware, createOrUpdateUserProfile);

export default router;
