var express = require('express');
const bcrypt = require('bcryptjs');
var router = express.Router();

const User = require('../models/userModel');
const successHandle = require('../services/successHandle');
const handleErrorAsync = require('../services/handleErrorAsync');
const appError = require('../services/appError');
const { sendGenerateJWT, isAuth } = require('../services/auth');

/* GET users listing. */
router.get(
  '/',
  isAuth,
  handleErrorAsync(async (req, res, next) => {
    const users = await User.find();
    successHandle(res, users);
  }),
);

router.get(
  '/:id',
  isAuth,
  handleErrorAsync(async (req, res, next) => {
    const { id } = req.params;
    if (id) {
      const user = await User.findOne({ _id: id });
      console.log('user', user);
      if (user) {
        successHandle(res, user);
      } else {
        next(appError(400, 'cannot find user'));
      }
    } else {
      next(appError(400, 'user id is required'));
    }
  }),
);

router.post(
  '/',
  handleErrorAsync(async (req, res, next) => {
    const { name, email } = req.body;
    if (name && email) {
      const newUser = await User.create(req.body);
      successHandle(res, newUser);
    } else {
      next(appError(400, 'name and email are required'));
    }
  }),
);

router.patch(
  '/:id',
  isAuth,
  handleErrorAsync(async (req, res, next) => {
    const { id } = req.params;
    const { name, email, photo } = req.body;
    if (name || email || photo) {
      const updatedUser = await User.findByIdAndUpdate(id, req.body, {
        new: true,
      });
      successHandle(res, updatedUser);
    } else {
      next(appError(400, 'patch data is required'));
    }
  }),
);

router.delete(
  '/:id',
  handleErrorAsync(async (req, res, next) => {
    const { id } = req.params;
    if (id) {
      const result = await User.findByIdAndDelete(id);
      if (result) {
        successHandle(res, 'delete success');
      } else {
        next(appError(400, 'delete failed'));
      }
    } else {
      next(appError(400, 'id is required'));
    }
  }),
);
router.delete(
  '/',
  handleErrorAsync(async (req, res, next) => {
    const result = await User.deleteMany({});
    successHandle(res, 'delete success');
  }),
);

router.post(
  '/sigup',
  handleErrorAsync(async (req, res, next) => {
    let { email, username, password, confirmPassword, photo } = req.body;
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
    if (photo && typeof photo !== 'string') {
      return next(appError(400, 'invalid photo'));
    }
    password = await bcrypt.hash(req.body.password, 12);
    const newUser = await User.create({
      username,
      password,
      email,
      photo,
    });
    sendGenerateJWT(201, newUser, res);
  }),
);

module.exports = router;
