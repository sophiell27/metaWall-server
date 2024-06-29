const expres = require('express');
const handleErrorAsync = require('../services/handleErrorAsync');
const Post = require('../models/postModel');
const successHandle = require('../services/successHandle');

const router = expres.Router();

router.get(
  '/user/:id',
  handleErrorAsync(async (req, res, next) => {
    const { id } = req.params;
    const posts = await Post.find({ user: id });
    successHandle(res, posts);
  }),
);

module.exports = router;
