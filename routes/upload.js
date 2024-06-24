const express = require('express');
const firebaseAdmin = require('../services/firebase');


const { VALIDATE_ERROR_MESSAGE } = require('../constants/validate');
const User = require('../models/userModel');
const { isAuth } = require('../services/auth');
const handleImageUpload = require('../services/handleImageUpload');
const handleErrorAsync = require('../services/handleErrorAsync');
const uploadMiddleWare = require('../services/uploadMiddleWare');
const successHandle = require('../services/successHandle');

const bucket = firebaseAdmin.storage().bucket();
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
