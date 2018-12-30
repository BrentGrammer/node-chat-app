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

io.on('connection', socket => {
  console.log('new user connected');

  socket.on('disconnect', () => {
    console.log('user was disconnected')
  })
})

server.listen(PORT, () => {
  console.log('server is up on port ' + PORT);
});

