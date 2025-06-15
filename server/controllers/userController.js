import User from '../models/User.js';

// ✔ REGISTER USER
export const registerUser = async (req, res) => {
  try {
    const { uid, name, email } = req.body;

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
    });

    console.log("Creating user:", user);

    await user.save();
    res.status(201).json({ message: 'User registered', user });
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
