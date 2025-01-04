const socket = io();
const cells = document.querySelectorAll('.cell');
const status = document.getElementById('status');
let gameState = Array(9).fill(null);
let currentPlayer = 'X';

function updateBoardUI() {
    cells.forEach((cell, index) => {
        cell.textContent = gameState[index] || '';
    });
}

function handleClick(event) {
    const index = event.target.dataset.cell;
    if (gameState[index]) return;
    socket.emit('makeMove', index);
}

socket.on('updateBoard', (newBoard) => {
    gameState = newBoard;
    updateBoardUI();
});

socket.on('gameOver', (message) => {
    status.textContent = message;
});

cells.forEach(cell => cell.addEventListener('click', handleClick));
