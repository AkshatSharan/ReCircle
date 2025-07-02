import express from 'express';
import multer from 'multer';
import {
  registerUser,
  getUserByUid,
  updateUserProfile,
  uploadUserAvatar
} from '../controllers/userController.js';

const router = express.Router();

const upload = multer({ dest: 'uploads/' });

router.post('/register', registerUser);

router.get('/:uid', getUserByUid);

router.put('/update/:uid', updateUserProfile);

router.post('/update/:uid/avatar', upload.single('avatar'), uploadUserAvatar);

export default router;
