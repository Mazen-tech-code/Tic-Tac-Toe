const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);  // تفعيل WebSockets

const PORT = process.env.PORT || 3000;

// Serve static files from the public folder
app.use(express.static(path.join(__dirname, 'public')));

// WebSocket events
let gameState = Array(9).fill(null); // حالة اللعبة (لوحة اللعب)

io.on('connection', (socket) => {
  console.log('A user connected');

  // إرسال الحالة الحالية للعبة عند الاتصال
  socket.emit('gameState', gameState);

  // عندما يقوم أحد اللاعبين بالتحريك
  socket.on('playerMove', (index, player) => {
    if (!gameState[index]) {
      gameState[index] = player;
      io.emit('gameState', gameState); // تحديث جميع اللاعبين بالحالة الجديدة
      checkWinner();
    }
  });

  // التحقق من الفائز
  function checkWinner() {
    const winPatterns = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
      [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
      [0, 4, 8], [2, 4, 6]             // Diagonals
    ];

    for (const pattern of winPatterns) {
      const [a, b, c] = pattern;
      if (gameState[a] && gameState[a] === gameState[b] && gameState[a] === gameState[c]) {
        io.emit('gameOver', gameState[a]);  // إعلان الفائز
        return;
      }
    }

    if (!gameState.includes(null)) {
      io.emit('gameOver', 'Draw');  // إذا انتهت اللعبة بالتعادل
    }
  }

  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });
});

// Catch-all route to serve index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
