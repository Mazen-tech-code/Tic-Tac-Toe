const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

let gameState = Array(9).fill(null);
let currentPlayer = 'X';
let gameOver = false;

app.use(express.static('public'));

io.on('connection', (socket) => {
    console.log('A user connected');
    
    socket.emit('updateBoard', gameState);

    socket.on('makeMove', (index) => {
        if (gameState[index] || gameOver) return;
        gameState[index] = currentPlayer;
        io.emit('updateBoard', gameState);
        if (checkWinner()) {
            io.emit('gameOver', `${currentPlayer} فاز!`);
            gameOver = true;
        } else {
            currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
        }
    });
});

function checkWinner() {
    const winningCombinations = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6]
    ];

    return winningCombinations.some(combination => {
        const [a, b, c] = combination;
        return gameState[a] && gameState[a] === gameState[b] && gameState[a] === gameState[c];
    });
}

server.listen(3000, () => {
    console.log('Server running on port 3000');
});
