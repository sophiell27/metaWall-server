
/* @typeof {object} onlineUser
@property string userId - the ID of the connected user 
@property string socketId - the corresponding socket ID */


/* @typeof {onlineUsers} */
let onlineUsers = [];

const addOnlineUser = (userId, socketId) => {
    if (!onlineUsers.find(user => user.userId === userId)) {
        onlineUsers.push({ userId, socketId });
        console.log("socket: added user")
    }
};

const removeOnlineUser = (socketId) => {
    onlineUsers = onlineUsers.filter(user => user.socketId !== socketId);
    console.log("socket: removed user")
};

const getOnlineUsers = () => {
    return onlineUsers;
};

module.exports = { addUser, removeUser, getOnlineUsers };
