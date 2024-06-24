const expres = require('express');

const router = expres.Router();

const Post = require('../models/postModel');
const successHandle = require('../services/successHandle');
const handleErrorAsync = require('../services/handleErrorAsync');
const appError = require('../services/appError');
const { isAuth } = require('../services/auth');

router.post(
    '/',
    isAuth,
    handleErrorAsync(async (req, res, next) => {
        if (req.body.content) {
            const newPost = await Post.create({ user: req.user.id, content });
            return successHandle(res, newPost);
        }
        next(appError(400, 'data is required'));
    })
);

router.get(
    '/',
    isAuth,
    handleErrorAsync(async (req, res, next) => {
        const { keyword, timeSort } = req.query;
        const filter = keyword
            ? { content: new RegExp(req.query.keyword) }
            : {};
        const order = timeSort === 'desc' ? '-createdAt' : 'createdAt';
        const posts = await Post.find(filter)
            .populate({
                path: 'user',
                // select: 'username imageUrl'
            })
            .sort(order);
        successHandle(res, posts);
    })
);

module.exports = router;
