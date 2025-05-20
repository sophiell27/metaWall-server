const expres = require('express');

const router = expres.Router();

const Post = require('../models/postModel');
const Comment = require('../models/commentModel');
const PostLikeNotification = require('../models/postLikeNotificationModel')
const successHandle = require('../utils/successHandle');
const handleErrorAsync = require('../middlewares/handleErrorAsync');
const appError = require('../middlewares/appError');
const { isAuth } = require('../services/auth');
const { VALIDATE_ERROR_MESSAGE } = require('../constants/validate');
const User = require('../models/userModel');
const { getOnlineUsers } = require('../utils/onlineUserManagement')


router.post(
  '/',
  isAuth,
  handleErrorAsync(async (req, res, next) => {
    if (req.body.content) {
      const newPost = await Post.create({
        user: req.user.id,
        content: req.body.content,
      });
      return successHandle(res, newPost);
    }
    next(appError(400, 'data is required'));
  }),
);

router.get(
  '/',
  isAuth,
  handleErrorAsync(async (req, res, next) => {
    const { keyword, timeSort } = req.query;
    const filter = keyword ? { content: new RegExp(req.query.keyword) } : {};
    const order = timeSort === 'desc' ? '-createdAt' : 'createdAt';
    const posts = await Post.find(filter)
      .populate({
        path: 'user',
        select: 'username imageUrl',
      })
      .populate({
        path: 'comments',
        select: 'comment user',
      })
      .sort(order);
    successHandle(res, posts);
  }),
);
// get posts by user id
router.get(
  '/user/:user_id',
  isAuth,
  handleErrorAsync(async (req, res, next) => {
    const { user_id } = req.params;
    const { keyword, timeSort } = req.query;
    const filter = keyword ? { content: new RegExp(req.query.keyword) } : {};
    const order = timeSort === 'desc' ? '-createdAt' : 'createdAt';
    const posts = await Post.find({
      user: user_id,
      ...filter,
    })
      .populate({
        path: 'user',
        select: 'username imageUrl',
      })
      .populate({
        path: 'comments',
        select: 'comment user',
      })
      .sort(order);
    successHandle(res, posts);
  }),
);
router.get(
  '/:post_id',
  isAuth,
  handleErrorAsync(async (req, res, next) => {
    const post = await Post.findById(req.params.id).populate({
      path: 'user',
      select: 'username imageUrl',
    });

    successHandle(res, post);
  }),
);
router.delete(
  '/:post_id',
  isAuth,
  handleErrorAsync(async (req, res, next) => {
    const result = await Post.findByIdAndDelete(req.params.post_id)
    successHandle(res, result);
  }),
);


router.post(
  '/:post_id/comment',
  handleErrorAsync(async (req, res, next) => {
    const { comment, post, user } = req.body;
    if (!comment || !post || !user) {
      return next(appError(400, VALIDATE_ERROR_MESSAGE.FIELDS_MISSING));
    }
    const newComment = await Comment.create(req.body);
    successHandle(res, newComment);
  }),
);

router.delete(
  '/post_id/comment/:comment_id',
  isAuth,
  handleErrorAsync(async (req, res, next) => {
    const result = await Comment.findByIdAndDelete(req.params.comment_id, {
      new: true,
    });
    if (result) {
      return successHandle(res, result);
    }
    return next(appError(400, 'unable to delete comment'));
  }),
);

router.post(
  '/:post_id/like',
  isAuth,
  handleErrorAsync(async (req, res, next) => {
    const { post_id } = req.params;
    const userId = req.user.id;
    const { modifiedCount } = await Post.updateOne(
      {
        _id: req.params.post_id,
        likes: { $ne: userId },
      },
      {
        $addToSet: { likes: userId },
      },
    );
    if (modifiedCount) {
      const onlineUsers = getOnlineUsers()
      const { user: recipient } = await Post.findById(post_id).populate({
        path: 'user',
        select: 'id',
      })
      const recipientSocketData = onlineUsers.find(user => user.userId === recipient.id)
      const { username: senderName } = await User.findById(userId).select('username')
      if (recipientSocketData && senderName) {
        req.app.get("io").to(correspondUser.socketId).emit("like-post", {
          postId: post_id,
          senderName,
          recipientId: recipient.id,
        });
      }
      const notification = new PostLikeNotification({
        postId: post_id,
        sender: userId,
        userId: recipient.id
      })
      await notification.save()
      return successHandle(res);
    }
    return next(appError(400, VALIDATE_ERROR_MESSAGE.LIKED));
  }),
);
router.delete(
  '/:post_id/unlike',
  isAuth,
  handleErrorAsync(async (req, res, next) => {
    const { modifiedCount } = await Post.updateOne(
      {
        _id: req.params.post_id,
      },
      {
        $pull: { likes: req.user._id },
      },
    );
    if (modifiedCount) {
      return successHandle(res);
    }
    return next(appError(400, VALIDATE_ERROR_MESSAGE.UNLIKED));
  }),
);

module.exports = router;
