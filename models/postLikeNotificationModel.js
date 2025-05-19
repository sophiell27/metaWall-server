

const mongoose = require('mongoose');
const Notification = require('./notificationModel')


const postLikeNotificationSchema = new mongoose.Schema(
    {
        postId: { type: mongoose.Schema.ObjectId, require: true },
        senderId: { type: mongoose.Schema.ObjectId, ref: 'User', require: true }
    },
);

const PostLikeNotification = Notification.discriminator('PostLikeNotification', postLikeNotificationSchema)

module.exports = PostLikeNotification;
