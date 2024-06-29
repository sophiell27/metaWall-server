const mongoose = require('mongoose');
const { VALIDATE_ERROR_MESSAGE } = require('../constants/validate');

const commentSchema = new mongoose.Schema(
  {
    comment: {
      type: String,
      required: [true, VALIDATE_ERROR_MESSAGE.COMMENT_BLANK],
    },
    post: {
      type: mongoose.Schema.ObjectId,
      ref: 'Post',
      required: [true, VALIDATE_ERROR_MESSAGE.POST_ID_REQUIRED],
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, VALIDATE_ERROR_MESSAGE.USER_ID_REQUIRED],
    },
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

// comment.pre(/^find/, (next) => {});

const Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;
