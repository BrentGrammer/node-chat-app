const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

const { generateMessage, generateLocationMessage } = require('./utils/message');
const { isRealString } = require('./utils/validation');
const { Users } = require('./utils/users');
const publicPath = path.join(__dirname, '../public');
const PORT = process.env.PORT || 3000;
var app = express();
var server = http.createServer(app);
// create websockets server with socket io by passing in the server to use
var io = socketIO(server);
// instantiate users class to handle updating and manipulating user list in a chat room
const users = new Users();

app.use(express.static(publicPath));

// NOTE: io.on('connection') is a special event that gives you access to the socket to use socket.io methods on
// all event handling and listening, emiting etc. is done inside the io.on() callback block
io.on('connection', socket => {
  // handle join a room event:
  socket.on('join', (params, callback) => {
    //validate form data sent (if validation fails, send an err in the acknowledgement callback, otherwise do not send err):
    if (!isRealString(params.name) || !isRealString(params.room)) {
      return callback('Name and room name are required.');
      // remember to return to stop the function from running to end
    }

    /** Update users list on user joined */

    //builtin join method with socket.io (takes a string for room name):
    socket.join(params.room);
    // remove user from any previous rooms:
    users.removeUser(socket.id);
    // add user to new room
    users.addUser(socket.id, params.name, params.room);

    /** emit update list event to everyone in the room */
    io.to(params.room).emit('updateUserList', users.getUserList(params.room));

    // Greet new user:
    socket.emit('newMessage', generateMessage("Admin", "Welcome to the chat!"));
    // Broadcast to other users that a new user joined:
    socket.broadcast.to(params.room).emit('newMessage', generateMessage("Admin", `${params.name} has joined.`));

    callback();
  });

  socket.on('createMessage', (message, callback) => {
    //use io.emit to send an event emit to all connected sockets:
    io.emit('newMessage', generateMessage(message.from, message.text));
    // part of acknowledgement set up - fn is defined in the emit code on client as a third arg
    callback();
  });

  socket.on('createLocationMessage', (coords) => {
    io.emit('newLocationMessage', generateLocationMessage("Admin", coords.latitude, coords.longitude))
  });

  
  socket.on('disconnect', () => {
    const user = users.removeUser(socket.id);
    // only remove user if the person joined a room (there will be no id entry for them if they didn't join)
    // (removeUser returns the user removed if successful or null otherwise if user not found)
    if (user) {
      // emit two events to every person in the chat room using io emit
      // send updated user list back to client:
      io.to(user.room).emit('updateUserList', users.getUserList(user.room));
      // emit message from admin:
      io.to(user.room).emit('newMessage', generateMessage('Admin', `${user.name} has left.`));
    }
  });
});

server.listen(PORT, () => {
  console.log('server is up on port ' + PORT);
});

