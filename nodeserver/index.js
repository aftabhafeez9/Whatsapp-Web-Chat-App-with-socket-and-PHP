const express = require('express');
const cors = require('cors'); // Import CORS
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http, {
    cors: {
        origin: "*", // Allow all origins (you can specify specific origins if needed)
        methods: ["GET", "POST"]
    }
});

// Enable CORS for API requests
app.use(cors());

app.get('/', (req, res) => {
    res.send('Socket.IO Server Running');
});

// Start server on port 4000
const PORT = process.env.PORT || 4000;
http.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});

// Handle socket connections
const users = {};

io.on('connection', socket => {
    console.log('New user connected:', socket.id);

    socket.on('new-user-joined', name => {
        users[socket.id] = name;
        socket.broadcast.emit('user-joined', name);
    });

    socket.on('send', message => {
        if (users[socket.id]) {
            socket.broadcast.emit('receive', { message: message, name: users[socket.id] });
        }
    });

    socket.on('disconnect', () => {
        if (users[socket.id]) {
            socket.broadcast.emit('left', users[socket.id]);
            delete users[socket.id];
        }
    });
});
