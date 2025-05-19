
var { addOnlineUser, getOnlineUsers, removeOnlinelUser } = require('../utils/onlineUserManagement')

const socketService = (io) => {
  console.log('io')
  io.on('connection', (socket) => {
    console.log('User connected: ' + socket.id);

    socket.on('addUser', (userId) => {
      console.log('addUser')
      const users = getOnlineUsers()
      if (!users.find(user => user.userId === userId)) {
        addOnlineUser(userId, socket.id);
      }
      console.log('Added to Online Users');
    });
    const handleLikePost = ({ postId, recipientUserId, senderName }) => {
      const onlineUsers = getOnlineUsers()
      const user = onlineUsers.find(user => user.userId === recipientUserId);
      if (user) {
        io.to(useketId).emit('like-post', { postId, senderName });
      } else {
        console.log(`${recipientUserId} is offline — notification saved`);
      }
    }
    socket.on('like-post', handleLikePost);

    socket.on('disconnect', () => {
      removeOnlinelUser(socket.id)
      console.log('User disconnected:', socket.id);
      socket.off('yourEventName', handleLikePost);
    });
  });
};

module.exports = { socketService };
