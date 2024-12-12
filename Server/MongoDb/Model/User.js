import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    trim: true,
    unique: true, // To ensure email uniqueness
  },
  password: {
    type: String,
    required: true,
  },
  images: [
    {
      prompt: { type: String, required: true },
      photoUrl: { type: String, required: true },
      createdAt: { type: Date, default: Date.now },
    },
  ],
});

const User = mongoose.model('User', userSchema);

export default User;
