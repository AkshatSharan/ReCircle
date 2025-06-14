import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  uid: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  displayName: String,
  greenScore: {
    type: Number,
    default: 0
  },
  achievements: {
    type: [String],
    default: []
  },
  activityStats: {
    itemsShared: {
      type: Number,
      default: 0
    },
    itemsScanned: {
      type: Number,
      default: 0
    },
    matchesMade: {
      type: Number,
      default: 0
    }
  }
}, { timestamps: true });

const User = mongoose.model('User', userSchema);
export default User;