const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');


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

  socket.on('createMessage', (message) => {
    console.log('createMessage', message);
    //use io.emit to broadcast an event emit to all connected sockets:
    io.emit('newMessage', {
      from: message.from,
      text: message.text,
      createdAt: new Date().getTime()
    });
  });
})

server.listen(PORT, () => {
  console.log('server is up on port ' + PORT);
});

