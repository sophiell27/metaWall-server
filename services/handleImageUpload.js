const firebaseAdmin = require('./firebase');
const bucket = firebaseAdmin.storage().bucket();

const handleImageUpload = (req, filePath, handleSuccess) => {
    const file = req.files[0];
    const blob = bucket.file(filePath);

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
