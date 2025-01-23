console.log("Welcome to Tic Tac Toe");

let music = new Audio("music.mp3");
let audioTurn = new Audio("ting.mp3");
let gameover = new Audio("gameover.mp3");

let turn = "X";
let isgameover = false;
let isAgainstBot = true;

// Difficulty selector
const difficultySelect = document.getElementById("difficulty");

// Function to change the turn
const changeTurn = () => {
  return turn === "X" ? "O" : "X";
};

// Function to check for a win
const checkWin = () => {
  let boxtext = document.getElementsByClassName("boxtext");
  let wins = [
    [0, 1, 2, 5, 5, 0],
    [3, 4, 5, 5, 15, 0],
    [6, 7, 8, 5, 25, 0],
    [0, 3, 6, -5, 15, 90],
    [1, 4, 7, 5, 15, 90],
    [2, 5, 8, 15, 15, 90],
    [0, 4, 8, 5, 15, 45],
    [2, 4, 6, 5, 15, 135],
  ];
  wins.forEach((e) => {
    if (
      boxtext[e[0]].innerText === boxtext[e[1]].innerText &&
      boxtext[e[2]].innerText === boxtext[e[1]].innerText &&
      boxtext[e[0]].innerText !== ""
    ) {
      document.querySelector(".info").innerText = boxtext[e[0]].innerText + " Won";
      isgameover = true;
      document.querySelector(".imgbox img").style.width = "200px";
      document.querySelector(".line").style.transform = `translate(${e[3]}vw, ${e[4]}vw) rotate(${e[5]}deg)`;
      document.querySelector(".line").style.width = "20vw";

      // Automatically reset after 3 seconds
      setTimeout(() => {
        resetGame();
      }, 3000);
    }
  });
};

// Bot move logic
function makeBotMove() {
  if (isgameover) return;

  const emptyBoxes = Array.from(document.getElementsByClassName("boxtext"))
    .map((box, index) => (box.innerText === "" ? index : null))
    .filter((index) => index !== null);

  let index;

  switch (difficultySelect.value) {
    case "hard":
      index = getBestMove(); // Hard mode uses the minimax algorithm
      break;
    case "medium":
      index = mediumBotMove(); // More consistent medium difficulty
      break;
    case "easy":
      index = emptyBoxes[Math.floor(Math.random() * emptyBoxes.length)]; // Easy mode is just random
      break;
    default:
      return;
  }

  if (index !== undefined) {
    document.getElementsByClassName("boxtext")[index].innerText = "O";
    turn = changeTurn();
    audioTurn.play();
    checkWin();
    if (!isgameover) {
      document.querySelector(".info").innerText = "Turn for " + turn;
    }
  }
}

// Medium Bot Move Logic
function mediumBotMove() {
  const emptyBoxes = Array.from(document.getElementsByClassName("boxtext"))
    .map((box, index) => (box.innerText === "" ? index : null))
    .filter((index) => index !== null);

  // First, try to make a winning move or block the player
  for (let i = 0; i < emptyBoxes.length; i++) {
    const index = emptyBoxes[i];
    document.getElementsByClassName("boxtext")[index].innerText = "O";
    if (checkWinCondition("O")) {
      return index; // Make the winning move
    }
    document.getElementsByClassName("boxtext")[index].innerText = "";
  }

  // Block player winning move
  for (let i = 0; i < emptyBoxes.length; i++) {
    const index = emptyBoxes[i];
    document.getElementsByClassName("boxtext")[index].innerText = "X";
    if (checkWinCondition("X")) {
      document.getElementsByClassName("boxtext")[index].innerText = "O";
      return index; // Block the player from winning
    }
    document.getElementsByClassName("boxtext")[index].innerText = "";
  }

  // Otherwise, make a random move
  return emptyBoxes[Math.floor(Math.random() * emptyBoxes.length)];
}

// Minimax for bot logic (Hard mode) with Alpha-Beta Pruning
function getBestMove() {
  const boxtext = document.getElementsByClassName("boxtext");
  let bestScore = -Infinity;
  let bestMove = null;

  for (let i = 0; i < 9; i++) {
    if (boxtext[i].innerText === "") {
      boxtext[i].innerText = "O"; // Try the bot move
      let score = minimax(0, false, -Infinity, Infinity); // Call minimax with alpha-beta pruning
      boxtext[i].innerText = ""; // Undo the move
      if (score > bestScore) {
        bestScore = score;
        bestMove = i;
      }
    }
  }

  return bestMove;
}

// Minimax with Alpha-Beta Pruning
function minimax(depth, isMaximizing, alpha, beta) {
  const boxtext = document.getElementsByClassName("boxtext");

  if (checkWinCondition("O")) return 10 - depth; // Bot wins
  if (checkWinCondition("X")) return depth - 10; // Player wins
  if (Array.from(boxtext).every((box) => box.innerText !== "")) return 0; // Draw

  if (isMaximizing) {
    let bestScore = -Infinity;

    for (let i = 0; i < 9; i++) {
      if (boxtext[i].innerText === "") {
        boxtext[i].innerText = "O"; // Bot move
        let score = minimax(depth + 1, false, alpha, beta); // Minimize for opponent
        boxtext[i].innerText = ""; // Undo the move
        bestScore = Math.max(score, bestScore);
        alpha = Math.max(alpha, bestScore); // Alpha pruning
        if (beta <= alpha) break; // Beta pruning
      }
    }

    return bestScore;
  } else {
    let bestScore = Infinity;

    for (let i = 0; i < 9; i++) {
      if (boxtext[i].innerText === "") {
        boxtext[i].innerText = "X"; // Player move
        let score = minimax(depth + 1, true, alpha, beta); // Maximize for bot
        boxtext[i].innerText = ""; // Undo the move
        bestScore = Math.min(score, bestScore);
        beta = Math.min(beta, bestScore); // Beta pruning
        if (beta <= alpha) break; // Alpha pruning
      }
    }

    return bestScore;
  }
}

function checkWinCondition(player) {
  let boxtext = document.getElementsByClassName("boxtext");
  let wins = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  return wins.some((combination) =>
    combination.every((index) => boxtext[index].innerText === player)
  );
}

// Reset game function
function resetGame() {
  let boxtexts = document.querySelectorAll(".boxtext");
  Array.from(boxtexts).forEach((element) => {
    element.innerText = "";
  });
  turn = "X";
  isgameover = false;
  document.querySelector(".line").style.width = "0vw";
  document.querySelector(".info").innerText = "Turn for " + turn;
  document.querySelector(".imgbox img").style.width = "0px";
}

// Game Logic
let boxes = document.getElementsByClassName("box");
Array.from(boxes).forEach((element) => {
  let boxtext = element.querySelector(".boxtext");
  element.addEventListener("click", () => {
    if (boxtext.innerText === "" && !isgameover) {
      boxtext.innerText = turn;
      turn = changeTurn();
      audioTurn.play();
      checkWin();
      if (!isgameover) {
        document.querySelector(".info").innerText = "Turn for " + turn;

        if (isAgainstBot && turn === "O" && difficultySelect.value !== "2player") {
          setTimeout(makeBotMove, 500);
        }
      }
    }
  });
});

// Add onclick listener to reset button
reset.addEventListener("click", resetGame);
