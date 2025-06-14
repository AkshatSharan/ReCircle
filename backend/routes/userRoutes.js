import express from 'express';
import { registerUser, getUserAchievements } from '../controllers/userController.js';

const router = express.Router();

router.post('/register', registerUser);
router.get('/:uid/achievements', getUserAchievements);

export default router;
