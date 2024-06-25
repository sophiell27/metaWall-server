var express = require('express');
const bcrypt = require('bcryptjs');
var router = express.Router();
const validator = require('validator');

const User = require('../models/userModel');
const successHandle = require('../services/successHandle');
const handleErrorAsync = require('../services/handleErrorAsync');
const appError = require('../services/appError');
const { sendGenerateJWT, isAuth } = require('../services/auth');
const { VALIDATE_ERROR_MESSAGE } = require('../constants/validate');
const uploadMiddleWare = require('../services/uploadMiddleWare');
const handleImageUpload = require('../services/handleImageUpload');

//TODO: delete after test
router.delete(
  '/',
  handleErrorAsync(async (req, res, next) => {
    await User.deleteMany({});
    res.status(200).json({
      message: 'deleted all users',
    });
  }),
);

router.post(
  '/sign_up',
  handleErrorAsync(async (req, res, next) => {
    let { email, username, password, confirmPassword, gender, imageUrl } =
      req.body;
    if (!email || !username || !password || !confirmPassword) {
      return next(appError(400, 'All fields are required'));
    }
    if (!validator.isEmail(email)) {
      return next(appError(400, 'email is incorrect'));
    }
    if (password !== confirmPassword) {
      return next(appError(400, 'passwords are not match'));
    }
    if (!validator.isLength(password, { min: 8 })) {
      return next(appError(400, 'password must be at least 8 characters'));
    }
    if (typeof username !== 'string') {
      return next(appError(400, 'invalid username'));
    }
    if (imageUrl && typeof imageUrl !== 'string') {
      return next(appError(400, 'invalid image path'));
    }
    password = await bcrypt.hash(req.body.password, 12);
    const newUser = await User.create({
      username,
      password,
      email,
      gender,
      imageUrl,
    });
    sendGenerateJWT(201, newUser, res);
  }),
);

router.post(
  '/sign_in',
  handleErrorAsync(async (req, res, next) => {
    const { email, password } = req.body;
    if (!email || !password) {
      return next(appError(400, VALIDATE_ERROR_MESSAGE.FIELDS_MISSING));
    }
    if (!validator.isLength(password, { min: 8 })) {
      return next(
        appError(400, VALIDATE_ERROR_MESSAGE.SIGNIN_FIELDS_INCORRECT),
      );
    }
    if (!validator.isEmail(email)) {
      return next(
        appError(400, VALIDATE_ERROR_MESSAGE.SIGNIN_FIELDS_INCORRECT),
      );
    }
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return next(appError(400, VALIDATE_ERROR_MESSAGE.USER_NOT_EXIST));
    }
    const auth = await bcrypt.compare(password, user.password);
    if (!auth) {
      return next(
        appError(400, VALIDATE_ERROR_MESSAGE.SIGNIN_FIELDS_INCORRECT),
      );
    }
    sendGenerateJWT(200, user, res);
  }),
);

router.post(
  '/updatePassword',
  isAuth,
  handleErrorAsync(async (req, res, next) => {
    console.log('updatePassword');
    let { password, confirmPassword } = req.body;
    if (!password || !confirmPassword) {
      return next(appError(400, VALIDATE_ERROR_MESSAGE.FIELDS_MISSING));
    }
    if (password !== confirmPassword) {
      return next(appError(400, VALIDATE_ERROR_MESSAGE.PASSWORD_NOT_MATCH));
    }
    if (!validator.isLength(password, { min: 8 })) {
      return next(appError(400, VALIDATE_ERROR_MESSAGE.PASSWORD_LENGTH));
    }
    password = await bcrypt.hash(req.body.password, 12);
    await User.findByIdAndUpdate(req.user.id, { password }, { new: true });
    res.status(200).json({
      status: 'success',
      message: 'password has updated',
    });
  }),
);

router.get(
  '/profile',
  isAuth,
  handleErrorAsync(async (req, res, next) => {
    const user = await User.findById({ _id: req.user.id });
    successHandle(res, user);
  }),
);

router.patch(
  '/profile',
  isAuth,
  handleErrorAsync(async (req, res, next) => {
    const { username, gender, imageUrl } = req.body;
    if (username || gender || imageUrl) {
      const updatedUser = await User.findByIdAndUpdate(req.user.id, req.body, {
        new: true,
      });
      return successHandle(res, updatedUser);
    }
    next(appError(400, 'No data'));
  }),
);

router.post(
  '/upload',
  isAuth,
  // uploadMiddleWare,
  handleErrorAsync(async (req, res, next) => {
    console.log('upload');
    const handleSuccess = async (imageUrl) => {
      const updatedData = await User.findByIdAndUpdate(
        req.user.id,
        { imageUrl },
        { new: true },
      );
      if (!updatedData) {
        return next(appError(500, 'failed to update'));
      }
      successHandle(res, updatedData);
    };
    handleImageUpload(req, `images/${req.user.id}/avatar`, handleSuccess);
  }),
);

module.exports = router;
