
    // io is a method exposed by loading the socket.io client library above to open a connection to the server
    // and keep it open.
    const socket = io();

    socket.on('connect', function() {
      console.log('connected to server');
      
      socket.on('disconnect', function() {
        console.log('Disconnected from server.');
      })
    
      socket.on('newMessage', function(message) {
        console.log('new message', message)
      });

      // third arg is defining a callback that will be used on the listener in the server for acknowledgement.
      socket.emit('createMessage', {
        from: "Frank",
        text: "hi"
      }, function() {
        console.log('got it')
      })
    });

    