import express from 'express';
import upload from '../middleware/multer.middleware.js';
import { addItem } from '../controllers/itemController.js';

const router = express.Router();

// POST /api/items/add
router.post('/add', upload.single('image'), addItem);

export default router;
