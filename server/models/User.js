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
  email: {
    type: String,
    required: true,
    unique: true,
  },
  avatar: {
    type: String,
  },
  points: {
    type: Number,
    default: 30,
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
      type: mongoose.Schema.Types.ObjectId, // Reference to Item documents
      ref: 'Item' // Reference to the Item model
    },
  ],
}, {
  timestamps: true // Adds createdAt and updatedAt automatically
});

const User = mongoose.model('User', userSchema);

export default User;
