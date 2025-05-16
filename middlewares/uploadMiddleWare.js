const multer = require('multer');
const path = require('path');
const { calculateMbInByte } = require('../routes/utils/utils');
const appError = require('./appError');

const uploadMiddleWare = multer({
    limits: {
        fileSize: calculateMbInByte(2)
    },
    fileFilter(_, file, callback) {
        const ext = path.extname(file.originalname).toLowerCase();
        if (ext !== '.jpg' && ext !== '.png' && ext !== '.jpeg') {
            return callback(
                appError(
                    400,
                    'File type error, file type should only be jpg, png, or jpeg'
                )
            );
        }
        callback(null, true);
    }
}).any();

module.exports = uploadMiddleWare;
