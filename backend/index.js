// backend/index.js
// Simple backend with Express + Socket.IO (CommonJS)
const express = require('express');
const http = require('http');
const cors = require('cors');
const { Server } = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: '*' }
});

const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

// Simple health endpoint
app.get('/', (req, res) => {
  res.json({ message: 'Tic Tac Toe backend OK' });
});

// In-memory rooms state
const rooms = {};

// Socket.IO handlers: joinRoom, playMove, resetGame, leaveRoom
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  socket.on('joinRoom', (roomName) => {
    socket.join(roomName);
    if (!rooms[roomName]) {
      rooms[roomName] = { board: Array(9).fill(''), turn: 'X', players: [] };
    }
    const room = rooms[roomName];

    // Assign player symbol if slot available
    let player = room.players.find(p => p.id === socket.id);
    if (!player) {
      let symbol = null;
      if (room.players.length === 0) symbol = 'X';
      else if (room.players.length === 1) symbol = 'O';
      // else spectator (null)
      player = { id: socket.id, symbol };
      room.players.push(player);
    }

    socket.emit('playerAssigned', player.symbol);
    io.to(roomName).emit('updateGame', {
      board: room.board,
      turn: room.turn,
      players: room.players.map(p => ({ id: p.id, symbol: p.symbol }))
    });
  });

  socket.on('playMove', ({ roomName, index, symbol }) => {
    const room = rooms[roomName];
    if (!room) return;
    // validations
    if (!['X','O'].includes(symbol)) return;
    if (room.board[index] !== '') return;
    if (room.turn !== symbol) return;

    room.board[index] = symbol;
    room.turn = room.turn === 'X' ? 'O' : 'X';

    io.to(roomName).emit('updateGame', {
      board: room.board,
      turn: room.turn,
      players: room.players.map(p => ({ id: p.id, symbol: p.symbol }))
    });
  });

  socket.on('resetGame', ({ roomName }) => {
    const room = rooms[roomName];
    if (!room) return;
    room.board = Array(9).fill('');
    room.turn = 'X';
    io.to(roomName).emit('updateGame', {
      board: room.board,
      turn: room.turn,
      players: room.players.map(p => ({ id: p.id, symbol: p.symbol }))
    });
  });

  socket.on('leaveRoom', (roomName) => {
    socket.leave(roomName);
    const room = rooms[roomName];
    if (!room) return;
    room.players = room.players.filter(p => p.id !== socket.id);
    if (room.players.length === 0) delete rooms[roomName];
    else {
      io.to(roomName).emit('updateGame', {
        board: room.board,
        turn: room.turn,
        players: room.players.map(p => ({ id: p.id, symbol: p.symbol }))
      });
    }
  });

  socket.on('disconnect', () => {
    // Remove player from any room
    for (const [roomName, room] of Object.entries(rooms)) {
      const before = room.players.length;
      room.players = room.players.filter(p => p.id !== socket.id);
      if (room.players.length === 0) delete rooms[roomName];
      else if (room.players.length !== before) {
        io.to(roomName).emit('updateGame', {
          board: room.board,
          turn: room.turn,
          players: room.players.map(p => ({ id: p.id, symbol: p.symbol }))
        });
      }
    }
    console.log('Client disconnected:', socket.id);
  });
});

server.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
