const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const handleErrorAsync = require('../middlewares/handleErrorAsync');
const appError = require('../middlewares/appError');
const User = require('../models/userModel');

const sendGenerateJWT = (statusCode, user, res) => {
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_DAY
    });
    res.status(statusCode).json({
        status: 'success',
        token,
        id: user.id
    });
};

const isAuth = handleErrorAsync(async (req, res, next) => {
    let token;

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        token = req.headers.authorization.split(' ')[1];
    }
    if (!token) {
        return next(appError(400, 'please log in first'));
    }
    const decode = await new Promise((resolve, reject) =>
        jwt.verify(token, process.env.JWT_SECRET, (err, payload) => {
            if (err) {
                return reject(err);
            }
            resolve(payload);
        })
    );
    const currentUser = await User.findById(decode.id);
    req.user = currentUser;
    next();
});

module.exports = {
    sendGenerateJWT,
    isAuth
};
