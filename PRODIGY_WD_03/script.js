const boardElement = document.getElementById('board');
const resultElement = document.getElementById('result');
const restartButton = document.getElementById('restart');
const resetButton = document.getElementById('reset');
const pvpButton = document.getElementById('pvp');
const pvaButton = document.getElementById('pva');

let board = ['', '', '', '', '', '', '', '', ''];
let currentPlayer = 'X';
let isGameActive = false;
let gameMode = 'pvp'; // 'pvp' or 'pva'

// Winning combinations
const winningCombinations = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
];

// Initialize game
function initGame() {
    board = ['', '', '', '', '', '', '', '', ''];
    currentPlayer = 'X';
    isGameActive = true;
    resultElement.textContent = '';
    restartButton.classList.add('hidden');
    resetButton.classList.add('hidden');
    renderBoard();
}

// Render the game board
function renderBoard() {
    boardElement.innerHTML = '';
    board.forEach((cell, index) => {
        const cellElement = document.createElement('div');
        cellElement.classList.add('cell');
        cellElement.textContent = cell;
        cellElement.addEventListener('click', () => handleCellClick(index));
        boardElement.appendChild(cellElement);
    });
}

// Handle cell click
function handleCellClick(index) {
    if (board[index] !== '' || !isGameActive) return;
    board[index] = currentPlayer;
    checkWin();
    if (isGameActive && gameMode === 'pva') {
        currentPlayer = 'O';
        setTimeout(aiMove, 500); 
    } else {
        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    }
    renderBoard();
}

// Check for win
function checkWin() {
    for (let combination of winningCombinations) {
        const [a, b, c] = combination;
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            declareWinner(board[a]);
            return;
        }
    }
    if (!board.includes('')) {
        resultElement.textContent = "It's a Draw!";
        isGameActive = false;
        restartButton.classList.remove('hidden');
        resetButton.classList.remove('hidden');
    }
}

// Declare the winner
function declareWinner(winner) {
    resultElement.textContent = `${winner} Wins!`;
    highlightWinner(winner);
    isGameActive = false;
    restartButton.classList.remove('hidden');
    resetButton.classList.remove('hidden');
}

// Highlight the winning combination
function highlightWinner(winner) {
    winningCombinations.forEach(combination => {
        const [a, b, c] = combination;
        if (board[a] === winner && board[b] === winner && board[c] === winner) {
            document.querySelectorAll('.cell')[a].classList.add('winner');
            document.querySelectorAll('.cell')[b].classList.add('winner');
            document.querySelectorAll('.cell')[c].classList.add('winner');

            // If 'X' wins, add the specific animation
            if (winner === 'X') {
                document.querySelectorAll('.cell')[a].classList.add('x-winner');
                document.querySelectorAll('.cell')[b].classList.add('x-winner');
                document.querySelectorAll('.cell')[c].classList.add('x-winner');
            }
        }
    });
}

// AI Move using Minimax algorithm
function aiMove() {
    const bestMove = minimax(board, 'O');
    if (bestMove.index !== -1) {
        board[bestMove.index] = 'O';
        checkWin();
        currentPlayer = 'X';
        renderBoard();
    }
}

// Minimax algorithm implementation
function minimax(newBoard, player) {
    const availableMoves = newBoard.map((cell, index) => (cell === '' ? index : null)).filter(index => index !== null);

    // Check for terminal states (win/loss/draw)
    if (checkWinner(newBoard, 'O')) {
        return { score: 10 };
    } else if (checkWinner(newBoard, 'X')) {
        return { score: -10 };
    } else if (availableMoves.length === 0) {
        return { score: 0 };
    }

    const moves = [];
    for (let i = 0; i < availableMoves.length; i++) {
        const move = availableMoves[i];
        newBoard[move] = player; // make the move

        const result = minimax(newBoard, player === 'O' ? 'X' : 'O'); // alternate players
        moves.push({ index: move, score: result.score }); // push the move and its score
        newBoard[move] = ''; // undo the move
    }

    // Choose the best move for the current player
    let bestMove;
    if (player === 'O') {
        let bestScore = -Infinity;
        for (const move of moves) {
            if (move.score > bestScore) {
                bestScore = move.score;
                bestMove = move;
            }
        }
    } else {
        let bestScore = Infinity;
        for (const move of moves) {
            if (move.score < bestScore) {
                bestScore = move.score;
                bestMove = move;
            }
        }
    }
    return bestMove;
}

// Check if there is a winner
function checkWinner(board, player) {
    return winningCombinations.some(combination => {
        const [a, b, c] = combination;
        return board[a] === player && board[b] === player && board[c] === player;
    });
}

// Restart Game
restartButton.addEventListener('click', initGame);
resetButton.addEventListener('click', initGame);

// Select Game Mode
pvpButton.addEventListener('click', () => {
    gameMode = 'pvp';
    initGame();
});

pvaButton.addEventListener('click', () => {
    gameMode = 'pva';
    initGame();
});

// Initialize the game on load
initGame();
