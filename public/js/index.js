
    // io is a method exposed by loading the socket.io client library above to open a connection to the server
    // and keep it open.
    const socket = io();

    function scrollToBottom() {
      // Selectors
      const messages = $('#messages');
      // get the last message
      const newMessage = messages.children('li:last-child')
      // Heights
      // prop is cross browser to access height properties on different browsers
      const clientHeight = messages.prop('clientHeight');
      const scrollTop = messages.prop('scrollTop');
      const scrollHeight = messages.prop('scrollHeight');
      // innerHeight takes into account padding as well
      const newMessageHeight = newMessage.innerHeight();
      // prev selects previous child item = this selects second to last list item
      const lastMessageHeight = newMessage.prev().innerHeight();

      // if user is at bottom or near bottom, then scroll to bottom:
      if (clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight) {
        console.log('should scroll');
        // set the scrolltop to the scrollHeight of entire container to move scroll to bottom
        messages.scrollTop(scrollHeight);
      }
    }

    socket.on('connect', function() {
      console.log('connected to server');
      
      socket.on('disconnect', function() {
        console.log('Disconnected from server.');
      })
    
      socket.on('newMessage', function(message) {
        const formattedTime = moment(message.createdAt).format('h:mma')
        const template = $('#message-template').html();
        // passin the template and other args for data to pass and access with {{ <var> }}
        const html = Mustache.render(template, {
          text: message.text,
          from: message.from,
          createdAt: formattedTime
        });

        $('#messages').append(html);
        scrollToBottom();
      });

      socket.on('newLocationMessage', function(message) {
        const formattedTime = moment(message.createdAt).format('h:mma');

        const template = $('#location-message-template').html();
        const html = Mustache.render(template, {
          from: message.from,
          url: message.url,
          createdAt: formattedTime
        });

        $('#messages').append(html);
        scrollToBottom();
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

    