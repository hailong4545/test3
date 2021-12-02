const express = require('express')
const app = express();

const server = require("http").Server(app)
const io = require('socket.io')(server)



app.get('/', (req, res) => {
    res.sendFile(__dirname+'/socket.html');
    return;
})

users = []
id = []
nameAdmin = ''

io.on('connection', (socket) => {
    socket.on('new person', (data) => {
        id.push(socket.id);
        socket.join(socket.id);
        users.push(data);
        io.emit('render', (users));
    });

    socket.on('send-request', (data) => {
        for(let i = 0; i < users.length; i++) {
            if (users[i] == data.userRecive) {
                console.log(id);
                console.log(users);
                io.to(id[i]).emit('recive-request', data);
                break;
            }
        }
    })

    socket.on('accept-request', (data) => {
        for(let i = 0; i < users.length; i++) {
            if (users[i] == data.userSend) {
                console.log(data);
                io.to(id[i]).emit('accept-request', data);
                break;
            }
        }
    })


    socket.on('accept-request suss', (data) => {
        for(let i = 0; i < users.length; i++) {
            if (users[i] == data.userSend || users[i] == data.userRecive) {
                io.to(id[i]).emit('accept-request suss', data);
            }
        }
    })

    socket.on('next_month', (data) => {
        io.emit('next_month', data);
    })

    socket.on('disconnect', () => {
        for(let i = 0; i < users.length; i++) {
            if (id[i] == socket.id) {
                io.emit('notifi', users[i]);
                users.splice(i, 1);
                id.splice(i, 1);
                break;
            }
        }
    })
})

var port = process.env.PORT || 3000;

server.listen(port);
