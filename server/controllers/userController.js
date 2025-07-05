import User from '../models/User.js';
import uploadOnCloudinary from '../utils/cloudinary.js';
import fs from 'fs';
import Item from '../models/Item.js'; // ✅ Required for querying items

// ✔ REGISTER USER
export const registerUser = async (req, res) => {
  try {
    console.log('Register endpoint hit with data:', req.body);

    const { uid, name, email } = req.body;

    const existingUser = await User.findOne({ $or: [{ uid }, { email }] });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    const user = new User({
      uid,
      name,
      email,
      points: 30,
      achievements: [
        {
          title: "Welcome to ReCircle!",
          description: "Signup successful",
          points: 30,
        },
      ],
      items: [],
    });

    const savedUser = await user.save();
    console.log("User saved to MongoDB:", savedUser);

    res.status(201).json({
      message: 'User registered successfully',
      user: savedUser
    });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ error: err.message });
  }
};

export const uploadUserAvatar = async (req, res) => {
  try {
    const { uid } = req.params;

    if (!req.file?.path) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // Upload to Cloudinary
    const uploadResult = await uploadOnCloudinary(req.file.path);

    if (!uploadResult?.url) {
      return res.status(500).json({ error: 'Cloudinary upload failed' });
    }

    // Update user avatar in DB
    const user = await User.findOneAndUpdate(
      { uid },
      { avatar: uploadResult.url },
      { new: true }
    );

    if (!user) return res.status(404).json({ error: 'User not found' });

    res.status(200).json({ avatar: uploadResult.url });
  } catch (error) {
    console.error('Avatar upload failed:', error);
    res.status(500).json({ error: 'Avatar upload failed' });
  }
};

// ✅ Get User by UID
export const getUserByUid = async (req, res) => {
  try {
    const { uid } = req.params;

    const user = await User.findOne({ uid });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const higherRankedCount = await User.countDocuments({
      $or: [
        { points: { $gt: user.points } },
        {
          points: user.points,
          createdAt: { $lt: user.createdAt }
        }
      ]
    });

    const userRank = higherRankedCount + 1;

    res.status(200).json({
      user: {
        ...user.toObject(),
        rank: userRank
      }
    });
  } catch (err) {
    console.error('Error fetching user:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

export const updateUserProfile = async (req, res) => {
  try {
    const { uid } = req.params;
    const { name, email, bio, location } = req.body;

    const user = await User.findOneAndUpdate(
      { uid },
      {
        name: name?.trim(),
        email: email?.trim(),
        bio: bio?.trim() || '',
        location: location?.trim() || ''
      },
      { new: true, runValidators: true }
    );

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json({
      message: 'Profile updated successfully',
      user
    });
  } catch (err) {
    console.error('Error updating profile:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

export const getUserNotifications = async (req, res) => {
  try {
    const { uid } = req.params;
    const user = await User.findOne({ uid }).select('notifications');

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Sort notifications by newest first
    const unreadNotifications = user.notifications
      .filter(notification => !notification.read)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    res.status(200).json({
      notifications: unreadNotifications
    });
  } catch (err) {
    console.error('Error fetching notifications:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

// ✅ Mark all notifications as read
export const markNotificationsRead = async (req, res) => {
  try {
    const { uid } = req.params;

    const user = await User.findOne({ uid });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Mark all notifications as read
    user.notifications.forEach(notification => {
      notification.read = true;
    });

    await user.save();

    res.status(200).json({
      message: 'All notifications marked as read'
    });
  } catch (err) {
    console.error('Error marking notifications as read:', err);
    res.status(500).json({ error: 'Server error' });
  }
};