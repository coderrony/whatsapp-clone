let onlineUser = [];
export default function (socket, io) {
  console.log('socket.id ', socket.id);

  // user joins or opens the application
  socket.on('join', userID => {
    socket.join(userID);

    // Add joined user to online users if not already present
    if (!onlineUser.some(u => u.userId === userID)) {
      onlineUser.push({ userId: userID, socketId: socket.id });
    }

    //send online users to frontend
    io.emit('get-online-users', onlineUser);
  });

  // socket disconnect
  socket.on('disconnect', () => {
    onlineUser = onlineUser.filter(u => u.socketId !== socket.id);
    console.log('user has just disconnect ', onlineUser);
    io.emit('get-online-users', onlineUser);
  });

  // join a conversation room
  socket.on('join conversation', conversationID => {
    console.log('user has join conversationID: ', conversationID);
    socket.join(conversationID);
  });

  // send and received message
  socket.on('send message', message => {
    // console.log('message ', message);

    let conversation = message?.conversation;
    if (!conversation?.users) {
      return;
    }
    conversation?.users.forEach(user => {
      if (user._id === message.sender._id) return;
      socket.in(user._id).emit('message received', message);
    });
    
  });

  // typing
  socket.on("typing",(conversationId)=>{
    console.log("in typing conversationId ",conversationId);
     socket.in(conversationId).emit("typing",conversationId)
  })
  socket.on("stop typing",(conversationId)=>{
    console.log("stop typing ",conversationId);
     socket.in(conversationId).emit("stop typing")
  })

}
