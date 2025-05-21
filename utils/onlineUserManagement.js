
/* @typeof {object} onlineUser
@property string userId - the ID of the connected user 
@property string socketId - the corresponding socket ID */


/* @typeof {onlineUsers} */
let onlineUsers = new Map(); // key: userid, value: socketId

const addOnlineUser = (userId, socketId) => {
    if (!onlineUsers.has(userId)) {
        onlineUsers.set(userId, socketId)
    }
};

const removeOnlineUser = (socket_Id) => {
    for (let [userId, socketId] of onlineUsers.entries()) {
        if (socketId === socket_Id) {
            onlineUsers.delete(userId)
            console.log("socket: removed user")
            break;
        }
    }
};

const getOnlineUsers = () => {
    return onlineUsers;
};

module.exports = { addOnlineUser, removeOnlineUser, getOnlineUsers };
