import User from '../models/User.js';

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
