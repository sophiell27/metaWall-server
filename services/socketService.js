
const PostLikeNotification = require('../models/postLikeNotificationModel');
var { addOnlineUser, getOnlineUsers, removeOnlineUser } = require('../utils/onlineUserManagement')

const socketService = (io) => {
  console.log('io')
  io.on('connection', (socket) => {
    console.log('User connected: ' + socket.id);

    socket.on('addUser', async (userId) => {
      const users = getOnlineUsers()
      if (!users.has(userId)) {
        addOnlineUser(userId, socket.id);
        const unreadNotifications = await PostLikeNotification.find({ userId: userId, readStatus: false }).populate('sender', 'username')
        if(unreadNotifications) {
          const structuredNotifications = unreadNotifications.map(({sender, postId, createdAt}) => ({
            senderId: sender?.id,
            senderName: sender?.username,
            postId,
            createdAt
          }))
          io.to(socket.id).emit('unreadNotifications', structuredNotifications)
        }
      }
     
  
    });
    const handleLikePost = ({ postId, recipientUserId, senderName }) => {
      const onlineUsers = getOnlineUsers()
      const user = onlineUsers.get(recipientUserId);
      console.log('user' , user)
      if (user) {
        io.to(user.socketId).emit('like-post', { postId, senderName });
      } else {
        console.log(`${recipientUserId} is offline — notification saved`);
      }
    }
    socket.on('like-post', handleLikePost);

    socket.on('disconnect', () => {
      removeOnlineUser(socket.id)
      console.log('User disconnected:', socket.id);
      socket.off('yourEventName', handleLikePost);
    });
  });
};

module.exports = { socketService };
