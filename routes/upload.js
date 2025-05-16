const express = require('express');
const {admin} = require('../config/firebase');


const { VALIDATE_ERROR_MESSAGE } = require('../constants/validate');
const User = require('../models/userModel');
const { isAuth } = require('../services/auth');
const handleImageUpload = require('../utils/handleImageUpload');
const handleErrorAsync = require('../middlewares/handleErrorAsync');
const uploadMiddleWare = require('../middlewares/uploadMiddleWare');
const successHandle = require('../utils/successHandle');

const bucket = admin.storage().bucket();
const router = express();

router.post(
    '/',
    isAuth,
    uploadMiddleWare,
    handleErrorAsync(async (req, res, next) => {
        const handleSuccess = (imageUrl) => successHandle(res, imageUrl);
        handleImageUpload(req, `images/${req.user.id}/avatar`, handleSuccess);
    })
);

module.exports = router;
