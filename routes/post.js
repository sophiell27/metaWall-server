const express = require('express');
const handleErrorAsync = require('../middlewares/handleErrorAsync');
const Post = require('../models/postModel');
const successHandle = require('../utils/successHandle');
const router = express.Router();

router.get(
  '/user/:id',
  handleErrorAsync(async (req, res, next) => {
    const posts = await Post.find({ user: req.params.id });
    successHandle(res, posts);
  }),
);

module.exports = router;
