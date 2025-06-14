import User from '../models/User.js';

export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findOne({ uid: req.user.uid });
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const createOrUpdateUserProfile = async (req, res) => {
  const { email, displayName } = req.body;
  try {
    const user = await User.findOneAndUpdate(
      { uid: req.user.uid },
      { $set: { email, displayName } },
      { new: true, upsert: true }
    );
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};
