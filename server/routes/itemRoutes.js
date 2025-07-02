import express from 'express';
import upload from '../middleware/multer.middleware.js';
import { addItem, getAllItems, toggleLikeItem } from '../controllers/itemController.js';

const router = express.Router();

// POST /api/items/add
router.post('/add', upload.single('image'), addItem);

router.get('/', getAllItems);

router.post('/:itemId/like', toggleLikeItem);

export default router;
