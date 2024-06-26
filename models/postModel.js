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
    likes: [{ type: mongoose.Schema.ObjectId, ref: 'User' }],
  },
  {
    versionKey: false,
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
    toObject: {
      virtuals: true,
    },
  },
);

postSchema.virtual('comments', {
  ref: 'Comment',
  localField: '_id',
  foreignField: 'post',
});

const Post = mongoose.model('Post', postSchema);

module.exports = Post;
