const container = document.getElementById("minesweeperContainer");
const rows = 10;
const cols = 10;
const mines = 10;
const board = createBoard(rows, cols, mines);
let gameStarted = false;
let gameOver = false;
let intervalId;
let count = new Array(rows).fill(null).map(() => new Array(cols).fill(0));
let highScore = document.querySelector("#hiscore");
let score;
let clickCount = 0;

// set highscore initially
if (!Object.hasOwn(localStorage, "highscore")) {
  localStorage.setItem("highscore", 0);
}
highScore.innerText = localStorage.highscore;

const startGame = () => {
  intervalId = setInterval(() => {
    let time = parseInt(document.querySelector("#time").innerText);
    document.querySelector("#time").innerText = `${time + 1}`;
  }, 1000);
};

document.addEventListener("DOMContentLoaded", function () {
  renderBoard(container, board);
});

function createBoard(rows, cols, mines) {
  const board = new Array(rows)
    .fill(null)
    .map(() => new Array(cols).fill(false));

  let minesCount = 0;
  while (minesCount < mines) {
    const row = Math.floor(Math.random() * rows);
    const col = Math.floor(Math.random() * cols);

    if (!board[row][col]) {
      board[row][col] = true;
      minesCount++;
    }
  }

  return board;
}

const generateCount = (row, col) => {
  const directions = [
    { x: 1, y: 1 },
    { x: 1, y: 0 },
    { x: 1, y: -1 },
    { x: 0, y: 1 },
    { x: 0, y: -1 },
    { x: -1, y: 1 },
    { x: -1, y: 0 },
    { x: -1, y: -1 },
  ];

  if (board[row][col]) {
    for (const direction of directions) {
      const newRow = row + direction.x;
      const newCol = col + direction.y;

      if (newRow >= 0 && newRow < rows && newCol >= 0 && newCol < cols) {
        count[newRow][newCol]++;
      }
    }
  }
};

const renderBoard = (container, board) => {
  for (let row = 0; row < board.length; row++) {
    for (let col = 0; col < board[row].length; col++) {
      const cell = document.createElement("div");
      cell.classList.add("cell");
      cell.dataset.row = row.toString();
      cell.dataset.col = col.toString();

      generateCount(row, col);

      cell.addEventListener("click", handleCellClick);
      container.appendChild(cell);
    }
  }
};

const handleCellClick = (event) => {
  const row = parseInt(event.target.dataset.row);
  const col = parseInt(event.target.dataset.col);

  let displayText;
  if (board[row][col]) {
    displayText = "💣";
  } else {
    if (count[row][col]) {
      displayText = count[row][col];
    } else {
      displayText = "";
    }
  }

  event.target.innerText = `${displayText}`;
  event.target.style.backgroundColor = "#fff";
  if (clickCount == rows * cols - mines) {
    score = parseInt(document.querySelector("#time").innerText);
    if (localStorage.highscore == "0") {
      localStorage.highscore = score;
    } else if (parseInt(localStorage.highscore) > score) {
      localStorage.highscore = score;
    }
    highScore.innerText = localStorage.highscore;
    endGame("You win");
  } else {
    clickCount += 1;
    if (!gameOver) {
      if (!gameStarted) {
        startGame();
        gameStarted = true;
      }

      if (board[row][col]) {
        gameOver = true;
        endGame("Game Ended");
      }
    }
  }
};

const endGame = (message) => {
  clearInterval(intervalId);
  alert(message);
};
