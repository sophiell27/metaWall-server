const { admin } = require('../config/firebase');
const bucket = admin.storage().bucket();
const appError = require('../middlewares/appError');

const handleImageUpload = (req, filePath, handleSuccess) => {
    const file = req.files[0];
    if (!file) {
        return appError(400, 'No file');
    }

    const blob = bucket.file(`${filePath}${req.files[0].originalname}`);

    const blobstream = blob.createWriteStream();
    blobstream.on('finish', () => {
        blob.getSignedUrl(
            {
                action: 'read',
                expires: '2100-05-05'
            },
            (err, fileUrl) => {
                if (err) {
                    return next(appError(400, 'upload failed'));
                }
                handleSuccess(fileUrl);
            }
        );
    });
    blobstream.on('error', (err) => {
        next(err);
    });
    blobstream.end(file.buffer);
};

module.exports = handleImageUpload;
