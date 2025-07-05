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
      const user = await User.findOne({ uid: excludeUser }).select('_id likedItems');

      if (!user) {
        console.warn('No matching user found for excludeUser:', excludeUser);
        // ✅ Proceed without filtering
      } else {
        // Exclude items added by the user
        filter.addedBy = { $ne: user._id };

        // Exclude items liked by the user
        if (user.likedItems && user.likedItems.length > 0) {
          filter._id = { $nin: user.likedItems };
        }
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

export const toggleLikeItem = async (req, res) => {
  try {
    const { itemId } = req.params;
    const { uid } = req.body;

    // Find user and item
    const user = await User.findOne({ uid });
    const item = await Item.findById(itemId).populate('addedBy', 'name email uid');

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (!item) {
      return res.status(404).json({ error: 'Item not found' });
    }

    // Check if user already liked this item
    const userLikedIndex = user.likedItems.indexOf(itemId);
    const itemLikedIndex = item.likedBy.indexOf(user._id);

    if (userLikedIndex > -1) {
      // Unlike: Remove from both arrays
      user.likedItems.splice(userLikedIndex, 1);
      item.likedBy.splice(itemLikedIndex, 1);

      await Promise.all([user.save(), item.save()]);

      res.status(200).json({
        message: 'Item unliked successfully',
        liked: false,
        likesCount: item.likedBy.length
      });
    } else {
      // ✅ Like: Add to both arrays
      user.likedItems.push(itemId);
      item.likedBy.push(user._id);

      // ✅ Create notification for item owner (if not liking own item)
      if (String(item.addedBy._id) !== String(user._id)) {
        const itemOwner = await User.findById(item.addedBy._id);
        if (itemOwner) {
          const notificationMessage = `${user.name} has liked your item ${item.title}\nContact: ${user.email}`;

          // Add notification to owner's notifications array
          itemOwner.notifications = itemOwner.notifications || [];
          itemOwner.notifications.push({
            type: 'like',
            itemName: item.title,
            likedBy: user.name,
            contact: user.email,
            message: notificationMessage,
            read: false
          });

          await itemOwner.save();
          console.log(`✅ Notification sent to ${itemOwner.name} for item: ${item.title}`);
        }
      }

      await Promise.all([user.save(), item.save()]);

      res.status(200).json({
        message: 'Item liked successfully',
        liked: true,
        likesCount: item.likedBy.length
      });
    }
  } catch (err) {
    console.error('Error toggling like:', err);
    res.status(500).json({ error: 'Server error' });
  }
};