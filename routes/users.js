var express = require('express');
var router = express.Router();

const User = require('../models/userModel');
const successHandle = require('../queryHandle/successHandle');
const errorHandle = require('../queryHandle/errorHandle');

/* GET users listing. */
router.get('/', async (req, res, next) => {
  try {
    const users = await User.find();
    successHandle(res, users);
  } catch (error) {
    errorHandle(res, 'get data error');
  }
});

router.post('/', async (req, res, next) => {
  try {
    const { name, email } = req.body;
    if (name && email) {
      const newUser = await User.create(req.body);
      successHandle(res, newUser);
    } else {
      errorHandle(res, 'name and email is required');
    }
  } catch (error) {
    errorHandle(res, 'create data error');
  }
});

router.patch('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, email, photo } = req.body;
    if (name || email || photo) {
      const updatedUser = await User.findByIdAndUpdate(id, req.body, {
        new: true,
      });
      successHandle(res, updatedUser);
    } else {
      errorHandle(res, 'name or email or photo is required');
    }
  } catch (error) {
    errorHandle(res, 'update data error');
  }
});

router.delete('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    if (id) {
      const result = await User.findByIdAndDelete(id);
      if (result) {
        successHandle(res, 'delete success');
      } else {
        errorHandle(res, 'delete failed');
      }
    } else {
      errorHandle(res, 'id is required');
    }
  } catch (error) {
    errorHandle(res, 'delete data error');
  }
});
module.exports = router;
