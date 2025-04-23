const size = 50;
const winLength = 5;
const viewSize = 20;
let offsetX = 0, offsetY = 0;
let board = Array.from({ length: size }, () => Array(size).fill(''));
let currentPlayer = 'X';
let gameOver = false;
let mode = 'solo';
let score = { X: 0, O: 0 };

const boardDiv = document.getElementById('board');
const modeText = document.getElementById('modeText');

function renderBoard() {
  boardDiv.innerHTML = '';
  for (let y = 0; y < viewSize; y++) {
    for (let x = 0; x < viewSize; x++) {
      const gx = x + offsetX;
      const gy = y + offsetY;
      const cell = document.createElement('div');
      cell.className = 'cell';
      cell.dataset.x = gx;
      cell.dataset.y = gy;

      const value = board[gy][gx];
      if (value === 'X') {
        cell.innerHTML = '<span style="color: blue;">X</span>';
        cell.classList.add('taken');
      } else if (value === 'O') {
        cell.innerHTML = '<span style="color: red;">O</span>';
        cell.classList.add('taken');
      }

      cell.addEventListener('click', () => playMove(gx, gy));
      boardDiv.appendChild(cell);
    }
  }
}

function playMove(x, y) {
  if (gameOver || board[y][x]) return;
  board[y][x] = currentPlayer;
  if (checkWin(x, y)) {
    highlightWinningLine(x, y);
    alert(`Joueur ${currentPlayer} gagne !`);
    score[currentPlayer]++;
    updateScores();
    gameOver = true;
    return;
  }
  currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
  renderBoard();

  if (mode === 'solo' && currentPlayer === 'O' && !gameOver) {
    setTimeout(iaMove, 300);
  }
}

function iaMove() {
  let empty = [];
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      if (!board[y][x]) empty.push({ x, y });
    }
  }
  if (empty.length === 0) return;
  const { x, y } = empty[Math.floor(Math.random() * empty.length)];
  playMove(x, y);
}

function checkWin(x, y) {
  const directions = [[1, 0], [0, 1], [1, 1], [1, -1]];
  for (let [dx, dy] of directions) {
    let count = 1;
    let line = [[x, y]];

    for (let dir of [-1, 1]) {
      let i = 1;
      while (true) {
        let nx = x + dx * i * dir;
        let ny = y + dy * i * dir;
        if (nx < 0 || ny < 0 || nx >= size || ny >= size || board[ny][nx] !== currentPlayer) break;
        count++;
        line.push([nx, ny]);
        i++;
      }
    }

    if (count >= winLength) {
      winningLine = line;
      return true;
    }
  }
  return false;
}

let winningLine = [];

function highlightWinningLine() {
  for (let [x, y] of winningLine) {
    const cell = [...document.querySelectorAll('.cell')].find(c => c.dataset.x == x && c.dataset.y == y);
    if (cell) cell.style.background = 'lime';
  }
}

function scrollView(dy, dx) {
  offsetX = Math.max(0, Math.min(size - viewSize, offsetX + dx));
  offsetY = Math.max(0, Math.min(size - viewSize, offsetY + dy));
  renderBoard();
}

function restartGame() {
  board = Array.from({ length: size }, () => Array(size).fill(''));
  gameOver = false;
  winningLine = [];
  currentPlayer = 'X';
  renderBoard();
}

function updateScores() {
  document.getElementById('scoreX').textContent = score.X;
  document.getElementById('scoreO').textContent = score.O;
}

function toggleMode() {
  mode = mode === 'solo' ? 'duo' : 'solo';
  modeText.textContent = mode === 'solo' ? 'Mode : Solo (vs IA)' : 'Mode : Deux Joueurs';
  restartGame();
}

renderBoard();
updateScores();

// Service Worker
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('sw.js')
    .then(() => console.log('Service Worker enregistré.'))
    .catch(e => console.log('Erreur Service Worker :', e));
}