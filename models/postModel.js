const mongoose = require('mongoose');

const postSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'user id is required'],
    },
    content: {
      type: String,
      required: [true, 'content should not be empty'],
    },
    imageUrl: String,
  },
  {
    versionKey: false,
    timestamps: true,
  },
);

const Post = mongoose.model('Post', postSchema);

module.exports = Post;