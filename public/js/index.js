
    // io is a method exposed by loading the socket.io client library above to open a connection to the server
    // and keep it open.
    const socket = io();

    socket.on('connect', function() {
      console.log('connected to server');
      
      socket.on('disconnect', function() {
        console.log('Disconnected from server.');
      })
    
      socket.on('newMessage', function(message) {
        console.log('new message', message);
        // append chat message to ol on index page:
        const li = $('<li></li>');
        li.text(`${message.from}: ${message.text}`);

        $('#messages').append(li);
      });

      // // third arg is defining a callback that will be used on the listener in the server for acknowledgement.
      // socket.emit('createMessage', {
      //   from: "Frank",
      //   text: "hi"
      // }, function(data) {
      //   console.log('got it', data)
      // })

      $('#message-form').on('submit', function(e) {
        e.preventDefault();
        socket.emit('createMessage', {
          from: "user",
          text: $('[name=message]').val()
        }, function() {

        })
      })
    });

    