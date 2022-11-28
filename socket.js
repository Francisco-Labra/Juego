let app = require('express')();
let http = require('http').Server(app);
let io = require('socket.io')(http);

io.on('connection', (socket) => {
    console.log('Nueva conexión');

    socket.on('saltar', () =>{
        socket.broadcast.emit('jugador-saltando');
    });
});

var port = 2525;

http.listen(port, function() {
    console.log('listening in http://localhost:' + port);
});