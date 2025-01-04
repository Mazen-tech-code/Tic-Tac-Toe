const socket = io();  // الاتصال بـ Socket.io
const cells = document.querySelectorAll('.cell');
const statusText = document.getElementById('status');
let currentPlayer = 'X';
let gameOver = false;

function renderBoard(gameState) {
  gameState.forEach((mark, index) => {
    const cell = cells[index];
    cell.textContent = mark || '';
    cell.classList.toggle('taken', mark);
  });
}

function handleClick(event) {
  if (gameOver) return;

  const index = event.target.dataset.index;
  if (!gameState[index]) {
    socket.emit('playerMove', index, currentPlayer);  // إرسال التحرك إلى السيرفر
    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    statusText.textContent = `Player ${currentPlayer}'s turn`;
  }
}

socket.on('gameState', (gameState) => {
  renderBoard(gameState);
});

socket.on('gameOver', (winner) => {
  gameOver = true;
  if (winner === 'Draw') {
    statusText.textContent = "It's a draw!";
  } else {
    statusText.textContent = `${winner} wins!`;
  }
});

cells.forEach(cell => cell.addEventListener('click', handleClick));
