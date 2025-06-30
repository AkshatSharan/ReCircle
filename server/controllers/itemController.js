// controllers/itemController.js
import Item from '../models/Item.js';
import User from '../models/User.js';
import uploadOnCloudiary from '../utils/cloudinary.js';



export const addItem = async (req, res) => {
  try {
    console.log('=== ADD ITEM REQUEST ===');
    console.log('Body:', req.body);
    console.log('File:', req.file);

    const { title, description, uid } = req.body;

    if (!title || !description || !uid || !req.file) {
      return res.status(400).json({ message: 'All fields are required.' });
    }

    // Upload image to Cloudinary
    const cloudResult = await uploadOnCloudiary(req.file.path);
    if (!cloudResult) {
      return res.status(500).json({ message: 'Failed to upload image.' });
    }

    // Find user by uid
    const user = await User.findOne({ uid });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Create and save item
    const item = new Item({
      title,
      description,
      imageUrl: cloudResult.secure_url || cloudResult.url,
      addedBy: user._id, // Reference to the user's ObjectId
    });

    const savedItem = await item.save();
    console.log('Item saved:', savedItem._id);

    // Update user with item reference
    user.points += 10;
    user.items.push(savedItem._id); // Push the item's ObjectId, not the title
    user.achievements.push({
      title: `Added item: ${title}`,
      description: 'Thanks for contributing!',
      points: 10,
    });

    await user.save();
    console.log('User updated with new item reference');

    return res.status(201).json({
      message: 'Item added successfully!',
      item: savedItem
    });
  } catch (error) {
    console.error('Add item error:', error);
    return res.status(500).json({
      message: error.message || 'Internal server error.'
    });
  }
};

// Get user's items with full item details
export const getUserItems = async (req, res) => {
  try {
    const { uid } = req.params;

    const user = await User.findOne({ uid }).populate('items');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ items: user.items });
  } catch (error) {
    console.error('Get user items error:', error);
    res.status(500).json({ message: error.message });
  }
};

// Get all items with user details
// controllers/itemController.js
export const getAllItems = async (req, res) => {
  try {
    const { excludeUser } = req.query;

    const filter = { status: 'available' };

    if (excludeUser) {
      const user = await User.findOne({ uid: excludeUser }).select('_id');

      if (!user) {
        console.warn('No matching user found for excludeUser:', excludeUser);
        // ✅ Proceed without filtering
      } else {
        filter.addedBy = { $ne: user._id };
      }
    }

    const items = await Item.find(filter)
      .populate('addedBy', 'name avatar points')
      .sort({ createdAt: -1 })
      .lean();

    const formattedItems = items.map(item => ({
      ...item,
      user: item.addedBy,
    }));

    res.json({ items: formattedItems });
  } catch (error) {
    console.error('❌ Get all items error:', error);
    res.status(500).json({ message: error.message || 'Server error' });
  }
};

