const express = require('express')
const app = express();

const server = require("http").createServer(app);

const { Server } = require('socket.io');

const io = new Server(server);

app.get('/', (req, res) => {
    res.sendFile(__dirname+'/socket.html');
    return;
})

users = []
id = []

io.on('connection', (socket) => {
    socket.on('new person', (data) => {
        id.push(socket.id);
        socket.join(socket.id);
        users.push(data);
        io.emit('render', (users));
    });

    socket.on('send-request', (data) => {
        for(let i = 0; i < users.length; i++) {
            if (users[i] == data.name) {
                console.log(id);
                console.log(users);
                io.to(id[i]).emit('recive-request', data);
                break;
            }
        }
    })
})
var port = 3000;
server.listen(port);
