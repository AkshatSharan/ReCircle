import Item from '../models/Item.js';
import User from '../models/User.js';
import uploadOnCloudiary from '../utils/cloudinary.js';

export const addItem = async (req, res) => {
  try {
    const { title, description, uid } = req.body;

    if (!req.file || !title || !description || !uid) {
      return res.status(400).json({ message: 'Title, description, image, and uid are required.' });
    }

    const cloudResult = await uploadOnCloudiary(req.file.path);
    console.log('Cloudinary result:', cloudResult);

    if (!cloudResult) {
      console.log('Cloudinary upload failed');
      return res.status(500).json({ message: 'Failed to upload image to Cloudinary.' });
    }

    console.log('Finding user with UID:', uid);

    // Find user by uid
    const user = await User.findOne({ uid });
    if (!user) {
      console.log('User not found for UID:', uid);
      return res.status(404).json({ message: 'User not found' });
    }

    console.log('User found:', user.name);
    console.log('Creating item...');

    // Create and save item
    const item = new Item({
      title,
      description,
      imageUrl: cloudResult.secure_url || cloudResult.url,
      addedBy: user._id,
    });

    const savedItem = await item.save();
    console.log('Item saved:', savedItem._id);

    // Update user info
    user.points += 10;
    user.items.push(title);
    user.achievements.push({
      title: `Added item: ${title}`,
      description: 'Thanks for contributing!',
      points: 10,
    });

    await user.save();
    console.log('User updated with new points and achievement');

    return res.status(201).json({
      message: 'Item added successfully!',
      item: savedItem
    });
  } catch (error) {
    console.error('=== ADD ITEM ERROR ===');
    console.error('Error details:', error);
    console.error('Stack trace:', error.stack);
    console.error('=====================');
    return res.status(500).json({
      message: error.message || 'Internal server error.',
      error: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};