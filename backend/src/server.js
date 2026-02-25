const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { Server } = require('socket.io');
const http = require('http');

dotenv.config();

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: [
      'http://localhost:3000',
      'http://localhost:3002',
      process.env.CORS_ORIGIN || 'http://localhost:3000'
    ],
    methods: ['GET', 'POST'],
    credentials: true
  },
  transports: ['websocket', 'polling']
});

app.use(cors({
  origin: [
    'http://localhost:3000',
    'http://localhost:3002',
    process.env.CORS_ORIGIN || 'http://localhost:3000'
  ],
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/api/health', (req, res) => {
  res.json({ status: 'PHONYX Backend Running ✅', timestamp: new Date() });
});

app.use('/api/auth', require('./api/auth'));
app.use('/api/users', require('./api/users'));
app.use('/api/servers', require('./api/servers'));
app.use('/api/channels', require('./api/channels'));
app.use('/api/messages', require('./api/messages'));

io.on('connection', (socket) => {
  console.log(`✅ User connected: ${socket.id}`);

  socket.on('join:channel', (channelId) => {
    socket.join(`channel:${channelId}`);
    console.log(`📍 User ${socket.id} joined channel ${channelId}`);
  });

  socket.on('message:send', (data) => {
    io.to(`channel:${data.channelId}`).emit('message:new', data);
    console.log(`💬 Message in channel ${data.channelId}`);
  });

  socket.on('presence:update', (data) => {
    io.emit('presence:changed', data);
  });

  socket.on('disconnect', () => {
    console.log(`❌ User disconnected: ${socket.id}`);
  });
});

app.use((err, req, res, next) => {
  console.error('❌ Error:', err);
  res.status(err.status || 500).json({ error: err.message || 'Internal Server Error' });
});

app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`
🚀 PHONYX Backend Server Running
📍 http://localhost:${PORT}
🔗 WebSocket: ws://localhost:${PORT}
🌍 CORS Origins: http://localhost:3000, http://localhost:3002
  `);
});
