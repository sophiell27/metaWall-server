var express = require('express');
const bcrypt = require('bcryptjs');
var router = express.Router();
const validator = require('validator');

const User = require('../models/userModel');
const Post = require('../models/postModel');
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
    try {
      password = await bcrypt.hash(req.body.password, 12);
      const newUser = await User.create({
        username,
        password,
        email,
        gender,
        imageUrl,
      });
      sendGenerateJWT(201, newUser, res);
    } catch (error) {
      if (error.code === 11000) {
        return next(appError(400, VALIDATE_ERROR_MESSAGE.EMAIL_EXIST));
      }
      return next(appError(400, VALIDATE_ERROR_MESSAGE.SOMETHING_WENT_WRONG));
    }
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

// get by id
router.get(
  '/:id',
  isAuth,
  handleErrorAsync(async (req, res, next) => {
    const { id } = req.params;
    const user = await User.findById({ _id: id });
    successHandle(res, user);
  }),
);

router.patch(
  '/profile',
  isAuth,
  handleErrorAsync(async (req, res, next) => {
    const { username, gender } = req.body;
    if (username || gender) {
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
  uploadMiddleWare,
  handleErrorAsync(async (req, res, next) => {
    if (!req.files?.length) {
      return next(appError(400, 'No file'));
    }
    const handleSuccess = async (imageUrl) => {
      const updatedData = await User.findByIdAndUpdate(
        req.user.id,
        { imageUrl },
        { new: true },
      );

      if (!updatedData) {
        return next(appError(500, 'failed to update'));
      }
      if (req.user.imageUrl) {
        //TODO: delete the previous imageUrl
      }
      successHandle(res, updatedData);
    };
    handleImageUpload(req, `images/${req.user.id}/avatar/`, handleSuccess);
  }),
);

router.post(
  '/:follow_id/follow',
  isAuth,
  handleErrorAsync(async (req, res, next) => {
    const { follow_id } = req.params;
    const { id } = req.user;

    if (!id || !follow_id) {
      return next(appError(400, VALIDATE_ERROR_MESSAGE.USER_ID_REQUIRED));
    }
    if (id === follow_id) {
      return next(appError(400, VALIDATE_ERROR_MESSAGE.FOLLOW_SELF));
    }
    const { modifiedCount: userModifiedCount } = await User.updateOne(
      {
        _id: id,
        'following.user': {
          $ne: follow_id,
        },
      },
      {
        $addToSet: {
          following: {
            user: follow_id,
          },
        },
      },
    );
    const { modifiedCount } = await User.updateOne(
      {
        _id: follow_id,
        'followers.user': {
          $ne: id,
        },
      },
      {
        $addToSet: {
          followers: {
            user: id,
          },
        },
      },
    );
    if (userModifiedCount && modifiedCount) {
      return successHandle(res);
    }
    return next(appError(400, VALIDATE_ERROR_MESSAGE.FOLLOW_ALREADY));
  }),
);
router.delete(
  '/:follow_id/unfollow',
  isAuth,
  handleErrorAsync(async (req, res, next) => {
    const { follow_id } = req.params;
    const { id } = req.user;
    if (!id || !follow_id) {
      return next(appError(400, VALIDATE_ERROR_MESSAGE.USER_ID_REQUIRED));
    }
    await User.updateOne(
      {
        _id: id,
      },
      {
        $pull: {
          following: {
            user: follow_id,
          },
        },
      },
    );
    await User.updateOne(
      {
        _id: follow_id,
      },
      {
        $pull: {
          followers: {
            user: id,
          },
        },
      },
    );

    return successHandle(res);
  }),
);

router.get(
  '/following',
  isAuth,
  handleErrorAsync(async (req, res, next) => {
    const result = await User.find({ _id: req.user.id }).select(
      'following.user',
    );
    successHandle(res, result);
  }),
);

router.get(
  '/getLikeList',
  isAuth,
  handleErrorAsync(async (req, res, next) => {
    console.log('req.user.id', req.user.id);
    const data = await Post.find({
      likes: {
        $eq: req.user.id,
      },
    })
      .select('_id')
      .lean({ virtural: false });
    successHandle(res, data);
  }),
);

module.exports = router;
