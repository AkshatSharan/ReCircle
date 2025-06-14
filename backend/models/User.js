// models/User.js
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  uid: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  avatar: {
    type: String,
  },
  password: {
    type: String,
    required: true,
  },
  points: {
    type: Number,
    default: 30, // Signup bonus
  },
  achievements: [
    {
      title: String,
      description: String,
      points: Number,
      createdAt: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  items: [
    {
      type: String, // store item titles
    },
  ],
});

const User = mongoose.model('User', userSchema);

export default User;
