const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const gridSize = 20;
let snake, dx, dy, food, score, highscore, gameInterval;
const startButton = document.getElementById('startButton');
const resetButton = document.getElementById('resetButton');

startButton.addEventListener('click', startGame);
resetButton.addEventListener('click', resetGame);

document.addEventListener("keydown", changeDirection);
document.getElementById('up').addEventListener('click', () => { if (dy === 0) { dx = 0; dy = -gridSize; } });
document.getElementById('down').addEventListener('click', () => { if (dy === 0) { dx = 0; dy = gridSize; } });
document.getElementById('left').addEventListener('click', () => { if (dx === 0) { dx = -gridSize; dy = 0; } });
document.getElementById('right').addEventListener('click', () => { if (dx === 0) { dx = gridSize; dy = 0; } });

// Variables para el control táctil
let touchStartX = 0;
let touchStartY = 0;

function startGame() {
    startButton.style.display = 'none';
    resetButton.style.display = 'none';

    snake = [{ x: 160, y: 160 }];
    dx = gridSize;
    dy = 0;
    food = {};
    score = 0;
    highscore = localStorage.getItem('highscore') || 0;
    createFood();

    gameInterval = setInterval(main, 100);
}

function resetGame() {
    clearInterval(gameInterval);
    startButton.style.display = 'inline';
    resetButton.style.display = 'none';
    clearCanvas();
    updateScore();
}

function main() {
    if (didGameEnd()) {
        clearInterval(gameInterval);
        resetButton.style.display = 'inline';
        return;
    }

    clearCanvas();
    drawFood();
    advanceSnake();
    drawSnake();
    updateScore();
}

function clearCanvas() {
    ctx.fillStyle = "#E3F2B0";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function drawFood() {
    ctx.fillStyle = "red";
    ctx.fillRect(food.x, food.y, gridSize, gridSize);
}

function advanceSnake() {
    const head = { x: snake[0].x + dx, y: snake[0].y + dy };

    if (head.x < 0) head.x = canvas.width - gridSize;
    if (head.x >= canvas.width) head.x = 0;
    if (head.y < 0) head.y = canvas.height - gridSize;
    if (head.y >= canvas.height) head.y = 0;

    snake.unshift(head);

    const didEatFood = snake[0].x === food.x && snake[0].y === food.y;
    if (didEatFood) {
        score += 1;
        createFood();
    } else {
        snake.pop();
    }
}

function drawSnake() {
    ctx.fillStyle = "lightgreen";
    snake.forEach(function(part) {
        ctx.fillRect(part.x, part.y, gridSize, gridSize);
        ctx.strokeStyle = "darkgreen";
        ctx.strokeRect(part.x, part.y, gridSize, gridSize);
    });
}

function changeDirection(event) {
    const LEFT_KEY = 37;
    const RIGHT_KEY = 39;
    const UP_KEY = 38;
    const DOWN_KEY = 40;

    if (event.keyCode === LEFT_KEY && dx === 0) {
        dx = -gridSize;
        dy = 0;
    } else if (event.keyCode === RIGHT_KEY && dx === 0) {
        dx = gridSize;
        dy = 0;
    } else if (event.keyCode === UP_KEY && dy === 0) {
        dx = 0;
        dy = -gridSize;
    } else if (event.keyCode === DOWN_KEY && dy === 0) {
        dx = 0;
        dy = gridSize;
    }
}

function createFood() {
    food.x = Math.floor(Math.random() * (canvas.width / gridSize)) * gridSize;
    food.y = Math.floor(Math.random() * (canvas.height / gridSize)) * gridSize;

    snake.forEach(function(part) {
        if (part.x === food.x && part.y === food.y) createFood();
    });
}

function didGameEnd() {
    for (let i = 4; i < snake.length; i++) {
        if (snake[i].x === snake[0].x && snake[i].y === snake[0].y) return true;
    }
    return false;
}

function updateScore() {
    document.getElementById('score').textContent = `Score: ${score}`;
    if (score > highscore) {
        highscore = score;
        localStorage.setItem('highscore', highscore);
    }
    document.getElementById('highscore').textContent = `Highscore: ${highscore}`;
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
