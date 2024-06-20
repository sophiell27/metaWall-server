const mongoose = require('mongoose');

const { VALIDATE_ERROR_MESSAGE } = require('../validatorContants');

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, VALIDATE_ERROR_MESSAGE.USERNAME_REQUIRE],
      maxLength: {
        value: 8,
        message: VALIDATE_ERROR_MESSAGE.USERNAME_LENGTH,
      },
    },
    password: {
      type: String,
      required: [true, VALIDATE_ERROR_MESSAGE.PASSWORD_REQUIRE],
      select: false,
    },
    email: {
      type: String,
      required: [true, VALIDATE_ERROR_MESSAGE.EMAIL_INVALID],
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
