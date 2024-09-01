const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const startButton = document.getElementById('startButton');
const resetButton = document.getElementById('resetButton');
const scoreSpan = document.getElementById('score');
const highscoreSpan = document.getElementById('highscore');

const gridSize = 20;
let snake, dx, dy, food, score, highscore, gameInterval;

// Variables para el control táctil
let touchStartX = 0;
let touchStartY = 0;

function startGame() {
    startButton.style.display = 'none';
    resetButton.style.display = 'none';  // Ocultar el botón de reinicio al inicio
    resetButton.disabled = true;  // Deshabilitar el botón de reinicio al inicio

    snake = [{ x: 160, y: 160 }];
    dx = gridSize;
    dy = 0;
    food = {};
    score = 0;
    highscore = localStorage.getItem('highscore') || 0;
    createFood();

    gameInterval = setInterval(main, 100);
}

function main() {
    if (didGameEnd()) {
        clearInterval(gameInterval);
        resetButton.style.display = 'inline';  // Mostrar el botón de reinicio al perder
        resetButton.disabled = false;  // Habilitar el botón de reinicio al perder
        return;
    }

    clearCanvas();
    drawFood();
    advanceSnake();
    drawSnake();
    updateScore();
}

function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function drawSnake() {
    ctx.fillStyle = '#333';
    snake.forEach(part => ctx.fillRect(part.x, part.y, gridSize, gridSize));
}

function drawFood() {
    ctx.fillStyle = '#e91e63';
    ctx.fillRect(food.x, food.y, gridSize, gridSize);
}

function advanceSnake() {
    const head = { x: snake[0].x + dx, y: snake[0].y + dy };
    snake.unshift(head);

    if (head.x === food.x && head.y === food.y) {
        score++;
        createFood();
    } else {
        snake.pop();
    }
}

function createFood() {
    food = {
        x: Math.floor(Math.random() * canvas.width / gridSize) * gridSize,
        y: Math.floor(Math.random() * canvas.height / gridSize) * gridSize
    };
}

function didGameEnd() {
    const head = snake[0];
    if (head.x < 0 || head.x >= canvas.width || head.y < 0 || head.y >= canvas.height) {
        return true;
    }
    for (let i = 1; i < snake.length; i++) {
        if (snake[i].x === head.x && snake[i].y === head.y) {
            return true;
        }
    }
    return false;
}

function updateScore() {
    scoreSpan.textContent = `Puntaje: ${score}`;
    if (score > highscore) {
        highscore = score;
        localStorage.setItem('highscore', highscore);
    }
    highscoreSpan.textContent = `Mejor Puntaje: ${highscore}`;
}

function handleKeyPress(event) {
    switch (event.key) {
        case 'ArrowUp':
            if (dy === 0) { dx = 0; dy = -gridSize; }
            break;
        case 'ArrowDown':
            if (dy === 0) { dx = 0; dy = gridSize; }
            break;
        case 'ArrowLeft':
            if (dx === 0) { dx = -gridSize; dy = 0; }
            break;
        case 'ArrowRight':
            if (dx === 0) { dx = gridSize; dy = 0; }
            break;
    }
}

// Funciones para el control táctil
function handleTouchStart(event) {
    if (event.touches.length === 1) {
        const touch = event.touches[0];
        touchStartX = touch.clientX;
        touchStartY = touch.clientY;
    }
}

function handleTouchEnd(event) {
    if (event.changedTouches.length === 1) {
        const touch = event.changedTouches[0];
        const touchEndX = touch.clientX;
        const touchEndY = touch.clientY;

        const deltaX = touchEndX - touchStartX;
        const deltaY = touchEndY - touchStartY;

        if (Math.abs(deltaX) > Math.abs(deltaY)) {
            // Deslizar horizontalmente
            if (deltaX > 0) {
                // Deslizar a la derecha
                if (dx === 0) { dx = gridSize; dy = 0; }
            } else {
                // Deslizar a la izquierda
                if (dx === 0) { dx = -gridSize; dy = 0; }
            }
        } else {
            // Deslizar verticalmente
            if (deltaY > 0) {
                // Deslizar hacia abajo
                if (dy === 0) { dx = 0; dy = gridSize; }
            } else {
                // Deslizar hacia arriba
                if (dy === 0) { dx = 0; dy = -gridSize; }
            }
        }
    }
}

function resetGame() {
    startGame();
}

startButton.addEventListener('click', startGame);
resetButton.addEventListener('click', resetGame);
document.addEventListener('keydown', handleKeyPress);
document.addEventListener('touchstart', handleTouchStart);
document.addEventListener('touchend', handleTouchEnd);
