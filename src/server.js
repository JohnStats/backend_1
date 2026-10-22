const http = require('http');
const app = require('./app');
const { Server } = require('socket.io');
const fs = require('fs');

if (!fs.existsSync('uploads')) fs.mkdirSync('uploads');

const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });
app.set('io', io);

io.on('connection', (socket) => {
  console.log('소켓 연결:', socket.id);
  socket.on('chat:message', (msg) => io.emit('chat:message', msg));
  socket.on('disconnect', () => console.log('끊김:', socket.id));
});

server.listen(3000, () => console.log('http://localhost:3000 에서 실행중'));