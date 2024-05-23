const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'name is required'],
    },
    email: {
      type: String,
      required: [true, 'email is required'],
      unique: true,
      lowercase: true,
    },
    photo: String,
  },
  {
    versionKey: false,
    timestamps: true,
  },
);

const User = mongoose.model('User', userSchema);

module.exports = User;
