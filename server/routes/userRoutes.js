import express from 'express';
import {
  registerUser,
  getUserByUid,
  getUserAchievements,
  getUserRank,
  getUserItems
} from '../controllers/userController.js';

const router = express.Router();

router.post('/register', registerUser);
router.get('/:uid/rank', getUserRank);
router.get('/:uid/achievements', getUserAchievements);

router.get('/:uid/with-items', getUserItems);

router.get('/:uid', getUserByUid); 

export default router;
