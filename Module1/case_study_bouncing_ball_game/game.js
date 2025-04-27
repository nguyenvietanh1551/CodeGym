// Các phần tử trong trò chơi
const gameContainer = document.getElementById('gameContainer');
const ball = document.getElementById('ball');
const bar = document.getElementById('bar');
const scoreDisplay = document.getElementById('scoreDisplay');
const gameOverDisplay = document.getElementById('gameOver');
const restartBtn = document.getElementById('restartBtn');

// Các hằng số trong trò chơi
const GAME_WIDTH = 600;
const GAME_HEIGHT = 400;
const BALL_SIZE = 20;
const BAR_WIDTH = 100;
const BAR_HEIGHT = 15;
const INITIAL_BALL_SPEED = 3;
const BAR_SPEED = 8;

// Trạng thái trò chơi
let ballX = GAME_WIDTH / 2;
let ballY = GAME_HEIGHT / 2;
let ballSpeedX = INITIAL_BALL_SPEED * Math.cos(Math.PI/4);
let ballSpeedY = INITIAL_BALL_SPEED * Math.sin(Math.PI/4);
let barX = (GAME_WIDTH - BAR_WIDTH) / 2;
let score = 0;
let gameRunning = true;
let animationId;
let lastTimestamp = 0;

// Trạng thái phím
let leftPressed = false;
let rightPressed = false;

// Tạo đối tượng âm thanh
const hitSound = new Audio('ting.mp3'); // Đường dẫn đến tệp âm thanh khi va chạm
const gameOverSound = new Audio('gameover.mp3'); // Đường dẫn đến tệp âm thanh khi game over

// Khởi tạo trò chơi
function initGame() {
    ballX = GAME_WIDTH / 2;
    ballY = GAME_HEIGHT / 2;
    const angle = Math.random() * Math.PI/3 + Math.PI/6;
    ballSpeedX = INITIAL_BALL_SPEED * Math.cos(angle);
    ballSpeedY = INITIAL_BALL_SPEED * Math.sin(angle);
    if (Math.random() > 0.5) ballSpeedX *= -1;

    barX = (GAME_WIDTH - BAR_WIDTH) / 2;
    score = 0;
    gameRunning = true;

    gameOverDisplay.style.display = 'none';
    restartBtn.style.display = 'none';
    scoreDisplay.textContent = 'Score: 0';

    updatePositions();
    lastTimestamp = performance.now();
    animationId = requestAnimationFrame(gameLoop);
}

// Cập nhật vị trí của quả bóng và thanh
function updatePositions() {
    ball.style.left = `${ballX}px`;
    ball.style.top = `${ballY}px`;
    bar.style.left = `${barX}px`;
}

// Vòng lặp trò chơi
function gameLoop(timestamp) {
    if (!gameRunning) return;

    const deltaTime = timestamp - lastTimestamp;
    lastTimestamp = timestamp;

    // Di chuyển thanh bar theo phím đang nhấn (120fps)
    if (leftPressed) {
        barX = Math.max(0, barX - BAR_SPEED * (deltaTime / 16));
    }
    if (rightPressed) {
        barX = Math.min(GAME_WIDTH - BAR_WIDTH, barX + BAR_SPEED * (deltaTime / 16));
    }

    // Di chuyển bóng
    ballX += ballSpeedX * (deltaTime / 16);
    ballY += ballSpeedY * (deltaTime / 16);

    // Va chạm tường
    if (ballX <= 0) {
        ballX = 0;
        ballSpeedX *= -1;
    }
    if (ballX + BALL_SIZE >= GAME_WIDTH) {
        ballX = GAME_WIDTH - BALL_SIZE;
        ballSpeedX *= -1;
    }
    if (ballY <= 0) {
        ballY = 0;
        ballSpeedY *= -1;
    }
    if (ballY + BALL_SIZE >= GAME_HEIGHT) {
        gameOver();
        return;
    }

    // Va chạm với thanh bar
    if (ballY + BALL_SIZE >= GAME_HEIGHT - 20 &&
        ballX + BALL_SIZE >= barX &&
        ballX <= barX + BAR_WIDTH) {

        const hitPosition = (ballX + BALL_SIZE / 2 - barX) / BAR_WIDTH;
        const angle = (hitPosition - 0.5) * Math.PI / 2;
        const speed = Math.sqrt(ballSpeedX ** 2 + ballSpeedY ** 2) * 1.02;

        ballSpeedX = speed * Math.sin(angle);
        ballSpeedY = -speed * Math.cos(angle);
        ballY = GAME_HEIGHT - 20 - BALL_SIZE;

        score += 10;
        scoreDisplay.textContent = `Score: ${score}`;

        // 🔊 Phát âm thanh khi va chạm
        hitSound.currentTime = 0;
        hitSound.play();
    }

    updatePositions();
    animationId = requestAnimationFrame(gameLoop);
}

// Xử lý nhấn và nhả phím
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft' || e.key === 'Left') {
        leftPressed = true;
    } else if (e.key === 'ArrowRight' || e.key === 'Right') {
        rightPressed = true;
    } else if (!gameRunning && (e.code === 'Space' || e.key === ' ')) {
        initGame();
    }
});

document.addEventListener('keyup', (e) => {
    if (e.key === 'ArrowLeft' || e.key === 'Left') {
        leftPressed = false;
    } else if (e.key === 'ArrowRight' || e.key === 'Right') {
        rightPressed = false;
    }
});

// Kết thúc trò chơi
function gameOver() {
    gameRunning = false;
    cancelAnimationFrame(animationId);

    // 🔊 Phát âm thanh Game Over
    gameOverSound.currentTime = 0;
    gameOverSound.play();

    gameOverDisplay.style.display = 'block';
    restartBtn.style.display = 'block';
}

// Khởi động lại khi bấm nút
restartBtn.addEventListener('click', initGame);

// Bắt đầu trò chơi ban đầu
initGame();
