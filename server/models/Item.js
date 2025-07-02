// models/Item.js
import mongoose from 'mongoose';

const itemSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
    trim: true,
  },
  imageUrl: {
    type: String,
    required: true,
  },
  addedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Reference back to the User who added this item
    required: true,
  },
  status: {
    type: String,
    enum: ['available', 'claimed', 'donated'],
    default: 'available',
  },
  likedBy: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
  ],
}, {
  timestamps: true // Adds createdAt and updatedAt automatically
});

const Item = mongoose.model('Item', itemSchema);

export default Item;