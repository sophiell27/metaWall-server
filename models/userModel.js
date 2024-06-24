const mongoose = require('mongoose');

const { VALIDATE_ERROR_MESSAGE } = require('../constants/validate');

const userSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: [true, VALIDATE_ERROR_MESSAGE.USERNAME_REQUIRE]
        },
        password: {
            type: String,
            required: [true, VALIDATE_ERROR_MESSAGE.PASSWORD_REQUIRE],
            select: false
        },
        email: {
            type: String,
            required: [true, VALIDATE_ERROR_MESSAGE.EMAIL_INVALID],
            unique: true,
            lowercase: true
        },
        gender: {
            type: String,
            enum: ['male', 'female'],
            // required: [true, VALIDATE_ERROR_MESSAGE.GENDER_REQUIRE]
        },
        imageUrl: String
    },
    {
        versionKey: false,
        timestamps: true
    }
);

const User = mongoose.model('User', userSchema);

module.exports = User;
