const expres = require('express');

const router = expres.Router();

const Post = require('../models/postModel');
const successHandle = require('../services/successHandle');
const handleErrorAsync = require('../services/handleErrorAsync');
const appError = require('../services/appError');

router.get(
  '/',
  handleErrorAsync(async (req, res, next) => {
    const { keyword, timeSort } = req.query;
    const filter = keyword ? { content: new RegExp(req.query.keyword) } : {};
    const order = timeSort === 'desc' ? '-createdAt' : 'createdAt';
    const posts = await Post.find(filter)
      .populate({
        path: 'user',
        select: 'name imageUrl',
      })
      .sort(order);
    successHandle(res, posts);
  }),
);

router.post(
  '/',
  handleErrorAsync(async (req, res, next) => {
    const { user, content } = req.body;
    if (user && content) {
      const newPost = await Post.create(req.body);
      successHandle(res, newPost);
    } else {
      next(appError(400, 'data is required'));
    }
  }),
);

router.patch(
  '/:id',
  handleErrorAsync(async (req, res, next) => {
    const { id } = req.params;
    const { content, photo } = req.body;
    if (id && (content || photo)) {
      const updatedData = await Post.findByIdAndUpdate(id, req.body, {
        new: true,
      });
      if (updatedData) {
        successHandle(res, updatedData);
      }
    } else {
      next(appError(400, 'data is invalid'));
    }
  }),
);

router.delete(
  '/:id',
  handleErrorAsync(async (req, res, next) => {
    const { id } = req.params;
    if (id) {
      const result = await Post.findByIdAndDelete(id);
      if (result) {
        successHandle(200, 'The post has been deleted');
      }
    }
  }),
);

module.exports = router;
