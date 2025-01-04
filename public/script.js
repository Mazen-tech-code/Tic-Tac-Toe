const cells = document.querySelectorAll('.cell');
const statusText = document.getElementById('status');
let currentPlayer = 'X';
let board = Array(9).fill(null);

function checkWinner() {
  const winPatterns = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
    [0, 4, 8], [2, 4, 6]             // Diagonals
  ];

  for (const pattern of winPatterns) {
    const [a, b, c] = pattern;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return board[a];
    }
  }
  return board.includes(null) ? null : 'Draw';
}

function handleClick(event) {
  const index = event.target.dataset.index;
  if (!board[index]) {
    board[index] = currentPlayer;
    event.target.textContent = currentPlayer;
    event.target.classList.add('taken');
    const winner = checkWinner();
    if (winner) {
      statusText.textContent = winner === 'Draw' ? "It's a draw!" : `${winner} wins!`;
      cells.forEach(cell => cell.removeEventListener('click', handleClick));
    } else {
      currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
      statusText.textContent = `Player ${currentPlayer}'s turn`;
    }
  }
}

cells.forEach(cell => cell.addEventListener('click', handleClick));
