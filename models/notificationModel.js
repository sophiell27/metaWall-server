const mongoose = require('mongoose');

// 

const notificationSchema = new mongoose.Schema(
    {
        userId: { type: mongoose.Schema.ObjectId, require: true },
        readStatus: { type: Boolean, default: false },
        createdAt: { type: Date, default: Date.now() },
    }, { discriminatorKey: '__t' }
);

const Notification = mongoose.model('Notification', notificationSchema);

module.exports = Notification;
