let board = ["", "", "", "", "", "", "", "", ""];
let currentPlayer = "X";
let gameActive = true;
let mode = "player";
let score = { X: 0, O: 0 };

const boardElement = document.getElementById("board");
const statusText = document.getElementById("status");

const winPatterns = [
    [0,1,2],[3,4,5],[6,7,8],
    [0,3,6],[1,4,7],[2,5,8],
    [0,4,8],[2,4,6]
];

function createBoard() {
    boardElement.innerHTML = "";
    board.forEach((_, index) => {
        const cell = document.createElement("div");
        cell.classList.add("cell");
        cell.addEventListener("click", () => handleClick(index));
        boardElement.appendChild(cell);
    });
}

function handleClick(index) {
    if (board[index] !== "" || !gameActive) return;

    board[index] = currentPlayer;
    updateBoard();

    if (checkWinner()) return;

    currentPlayer = currentPlayer === "X" ? "O" : "X";
    statusText.innerText = `Player ${currentPlayer}'s turn`;

    if (mode === "computer" && currentPlayer === "O") {
        setTimeout(computerMove, 400);
    }
}

function updateBoard() {
    document.querySelectorAll(".cell").forEach((cell, i) => {
        cell.textContent = board[i];
    });
}

function checkWinner() {
    for (let pattern of winPatterns) {
        let [a,b,c] = pattern;

        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            statusText.innerText = `🎉 ${board[a]} Wins!`;
            gameActive = false;

            document.querySelectorAll(".cell")[a].classList.add("win");
            document.querySelectorAll(".cell")[b].classList.add("win");
            document.querySelectorAll(".cell")[c].classList.add("win");

            score[board[a]]++;
            document.getElementById("score").innerText =
                `X: ${score.X} | O: ${score.O}`;

            return true;
        }
    }

    if (!board.includes("")) {
        statusText.innerText = "😐 Draw!";
        gameActive = false;
        return true;
    }

    return false;
}

function computerMove() {
    let bestScore = -Infinity;
    let move;

    for (let i = 0; i < 9; i++) {
        if (board[i] === "") {
            board[i] = "O";
            let score = minimax(board, 0, false);
            board[i] = "";
            if (score > bestScore) {
                bestScore = score;
                move = i;
            }
        }
    }

    handleClick(move);
}

function minimax(board, depth, isMaximizing) {
    let result = checkWinnerMini();
    if (result !== null) return result;

    if (isMaximizing) {
        let best = -Infinity;
        for (let i = 0; i < 9; i++) {
            if (board[i] === "") {
                board[i] = "O";
                best = Math.max(best, minimax(board, depth+1, false));
                board[i] = "";
            }
        }
        return best;
    } else {
        let best = Infinity;
        for (let i = 0; i < 9; i++) {
            if (board[i] === "") {
                board[i] = "X";
                best = Math.min(best, minimax(board, depth+1, true));
                board[i] = "";
            }
        }
        return best;
    }
}

function checkWinnerMini() {
    for (let p of winPatterns) {
        let [a,b,c] = p;
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            return board[a] === "O" ? 1 : -1;
        }
    }
    if (!board.includes("")) return 0;
    return null;
}

function restartGame() {
    board = ["","","","","","","","",""];
    currentPlayer = "X";
    gameActive = true;
    statusText.innerText = "Player X's turn";
    createBoard();
}

function setMode(m) {
    mode = m;
    restartGame();
}

function toggleTheme() {
    document.body.classList.toggle("dark");
}

createBoard();
statusText.innerText = "Player X's turn";