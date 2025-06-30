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
export const getUserItems = async (req, res) => {
  try {
    const { uid } = req.params;

    const items = await Item.find({ owner: uid });

    res.status(200).json({ items });
  } catch (err) {
    console.error('Error fetching user items:', err);
    res.status(500).json({ error: 'Server error' });
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

    res.status(200).json({ user });
  } catch (err) {
    console.error('Error fetching user:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

//rank 

export const getUserRank = async (req, res) => {
  try {
    const { uid } = req.params;

    const users = await User.find().sort([
      ['points', -1],       // Sort by highest points
      ['createdAt', 1]      // If tie, earlier user wins
    ]);

    const rank = users.findIndex(user => user.uid === uid);

    if (rank === -1) {
      return res.status(404).json({ error: 'User not found for ranking' });
    }

    res.json({ rank: rank + 1 }); // rank is 0-indexed
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


export const getUserAchievements = async (req, res) => {
  try {
    const { uid } = req.params;
    const user = await User.findOne({ uid });

    if (!user) return res.status(404).json({ error: 'User not found' });

    res.json({ achievements: user.achievements });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
