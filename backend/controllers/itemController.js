import Item from '../models/Item.js';
import User from '../models/User.js';
import uploadOnCloudinary from '../config/cloudinary.js';

export const addItem = async (req, res) => {
  try {
    const { title, description, uid } = req.body;
    const localFilePath = req.file?.path;

    const cloudResult = await uploadOnCloudinary(localFilePath);
    if (!cloudResult) throw new Error("Image upload failed");

    const user = await User.findOne({ uid });
    if (!user) return res.status(404).json({ error: 'User not found' });

    const item = new Item({
      title,
      description,
      imageUrl: cloudResult.url,
      addedBy: user._id,
    });

    await item.save();

    // Update user: +10 points, new achievement, push title
    user.points += 10;
    user.items.push(title);
    user.achievements.push({
      title: `Added item: ${title}`,
      description: 'Thanks for contributing!',
      points: 10,
    });

    await user.save();

    res.status(201).json({ message: 'Item added', item });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
