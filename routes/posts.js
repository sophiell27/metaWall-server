const expres = require('express');

const router = expres.Router();

const Post = require('../models/postModel');
const errorHandle = require('../queryHandle/errorHandle');
const successHandle = require('../queryHandle/successHandle');

router.get('/', async (req, res, next) => {
  try {
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
  } catch (error) {
    errorHandle(res, 'get data error');
  }
});

router.post('/', async (req, res, next) => {
  try {
    const { user, content } = req.body;
    if (user && content) {
      const newPost = await Post.create(req.body);
      successHandle(res, newPost);
    } else {
      errorHandle(res);
    }
  } catch (error) {
    errorHandle(res);
  }
});

module.exports = router;
