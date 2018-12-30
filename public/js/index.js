
    // io is a method exposed by loading the socket.io client library above to open a connection to the server
    // and keep it open.
    const socket = io();

    socket.on('connect', function() {
      console.log('connected to server');
      
      socket.on('disconnect', function() {
        console.log('Disconnected from server.');
      })
    
      socket.on('newMessage', function(message) {
        const formattedTime = moment(message.createdAt).format('h:mma')
        // append chat message to ol on index page:
        const li = $('<li></li>');
        li.text(`${message.from} (${formattedTime}): ${message.text}`);

        $('#messages').append(li);
      });

      socket.on('newLocationMessage', function(message) {
        const formattedTime = moment(message.createdAt).format('h:mma')
        const li = $('<li></li>');
        const a = $('<a target="_blank" >My Current Location</a>');

        li.text(`${message.from} (${formattedTime}): `);
        a.attr('href', message.url);
        li.append(a);
        $('#messages').append(li);
      })

      // // third arg is defining a callback that will be used on the listener in the server for acknowledgement.
      // socket.emit('createMessage', {
      //   from: "Frank",
      //   text: "hi"
      // }, function(data) {
      //   console.log('got it', data)
      // })

      $('#message-form').on('submit', function(e) {
        e.preventDefault();

        const messageTextbox =  $('[name=message');

        socket.emit('createMessage', {
          from: "user",
          text: messageTextbox.val()
        }, function() {
          // clear send input
          messageTextbox.val('')
        })
      })

      const locationButton = $('#send-location');
      locationButton.on('click', function () {
        if (!navigator.geolocation) {
          return alert('geolocation not supported by your browser.')
        }

        locationButton.attr('disabled', 'disabled').text('Sending location...');
        // takes 2 functions as args - success callback and err callback
        navigator.geolocation.getCurrentPosition(function (position) {
          // reenable button when geolocation completes
          locationButton.removeAttr('disabled').text('Send location');

          socket.emit('createLocationMessage', {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          })
        }, function() {
          locationButton.removeAttr('disabled').text('Send location');;
          alert('unable to get location.');
        })
      })
    });

    