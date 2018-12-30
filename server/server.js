const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

const { generateMessage } = require('./utils/message');
const publicPath = path.join(__dirname, '../public');
const PORT = process.env.PORT || 3000;
var app = express();
var server = http.createServer(app);
// create websockets server with socket io by passing in the server to use
var io = socketIO(server);

app.use(express.static(publicPath));

// NOTE: io.on('connection') is a special event that gives you access to the socket to use socket.io methods on
// all event handling and listening, emiting etc. is done inside the io.on() callback block
io.on('connection', socket => {
  console.log('new user connected');

  socket.on('disconnect', () => {
    console.log('user was disconnected')
  })
  // Greet new user:
  socket.emit('newMessage', generateMessage("Admin", "Welcome to the chat!"));
  // Broadcast to other users that a new user joined:
  socket.broadcast.emit('newMessage', generateMessage("Admin", "New User Joined."));

  socket.on('createMessage', (message, callback) => {
    //use io.emit to send an event emit to all connected sockets:
    io.emit('newMessage', generateMessage(message.from, message.text));
    // part of acknowledgement set up - fn is defined in the emit code on client as a third arg
    callback('From the server');
  });
})

server.listen(PORT, () => {
  console.log('server is up on port ' + PORT);
});

