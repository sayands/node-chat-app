const path = require ('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

const {generateMessage,generateLocationMessage} = require('./utils/message');
const {isRealString} = require('./utils/validation');
const {Users} = require('./utils/users');

const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT || 3000;
var app = express();
var server = http.createServer(app);
var io = socketIO(server);
var users = new Users();

app.use(express.static(publicPath));
io.on('connection', (socket) => {
   console.log('New user connected');
   socket.on('join', (params,callback) => {

      if(!isRealString(params.name)  || !isRealString(params.room)){
          return callback('Name and room name required');
      }
       var room = params.room.toUpperCase();
       socket.join(room);
       users.removeUser(socket.id);
       users.addUser(socket.id,params.name,room);

       io.to(room).emit('updateUserList', users.getUserList(room));
       socket.emit('newMessage',generateMessage('Admin','Welcome To Chat App'));

       socket.broadcast.to(room).emit('newMessage', generateMessage('Admin', `${params.name} has joined`));
       callback();
});

   socket.on('createMessage', (message, callback) => {
      var user = users.getUser(socket.id);
      var room = user.room.toUpperCase();

       if(user && isRealString(message.text)){
           io.to(room).emit('newMessage',generateMessage(user.name,message.text));
       }

      callback();
   });

    socket.on('createLocationMessage', (coords) => {
        var user = users.getUser(socket.id);
        var room = user.room.toUpperCase();
        if(user){
            io.to(room).emit('newLocationMessage',generateLocationMessage(user.name,coords.latitude,coords.longitude));
        }

    });

  socket.on('disconnect', () => {
        var user = users.removeUser(socket.id);
        var room = user.room.toUpperCase();
        if(user){
            io.to(room).emit('updateUserList', users.getUserList(room));
            io.to(room).emit('newMessage',generateMessage('Admin', `${user.name} has left`));
        }
    });
});

server.listen(port, () => {
    console.log(`Server is up on port ${port}`);
});
