// routes/itemRoutes.js
import express from 'express';
import upload from '../middleware/multer.middleware.js';
import uploadOnCloudiary from '../utils/cloudinary.js';
import Item from '../models/Item.js';

const router = express.Router();

// POST /api/items
router.post('/add', upload.single('image'), async (req, res) => {
  try {
    const { title, description } = req.body;

    // Check required fields
    if (!req.file || !title || !description) {
      return res.status(400).json({ message: 'All fields are required.' });
    }

    // Upload to Cloudinary
    const cloudinaryResponse = await uploadOnCloudiary(req.file.path);

    if (!cloudinaryResponse) {
      return res.status(500).json({ message: 'Failed to upload image to Cloudinary.' });
    }

    // Save item to DB
    const newItem = new Item({
      title,
      description,
      imageUrl: cloudinaryResponse.secure_url,
    });

    await newItem.save();

    res.status(201).json({ message: 'Item added successfully!', item: newItem });
  } catch (error) {
    console.error('Error in /add route:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
});

export default router;
