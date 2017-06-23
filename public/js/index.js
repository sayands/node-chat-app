var socket = io();
        
socket.on('connect', function()  {
    console.log('Connected to server'); 
    
    socket.emit('createMessage', {
        from : 'sayan12',
        text : 'Hey,I am Sayan'
    });
});
        
socket.on('disconnect', function()  {
    console.log("Disconnected from server."); 
});

socket.on('newMessage', function(message) {
   console.log('New email', message); 
});