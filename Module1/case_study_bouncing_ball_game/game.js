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

// Khởi tạo trò chơi
function initGame() {
    ballX = GAME_WIDTH / 2;
    ballY = GAME_HEIGHT / 2;
    // Góc khởi tạo ngẫu nhiên giữa 30 và 60 độ
    const angle = Math.random() * Math.PI/3 + Math.PI/6;
    ballSpeedX = INITIAL_BALL_SPEED * Math.cos(angle);
    ballSpeedY = INITIAL_BALL_SPEED * Math.sin(angle);
    // Đổi chiều ngẫu nhiên
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

    // Di chuyển quả bóng
    ballX += ballSpeedX * (deltaTime / 16); // Chuẩn hóa về 60fps
    ballY += ballSpeedY * (deltaTime / 16);

    // Va chạm của bóng với các bức tường
    // Tường trái
    if (ballX <= 0) {
        ballX = 0;
        ballSpeedX *= -1;
    }
    // Tường phải
    if (ballX + BALL_SIZE >= GAME_WIDTH) {
        ballX = GAME_WIDTH - BALL_SIZE;
        ballSpeedX *= -1;
    }
    // Tường trên
    if (ballY <= 0) {
        ballY = 0;
        ballSpeedY *= -1;
    }
    // Tường dưới (game over)
    if (ballY + BALL_SIZE >= GAME_HEIGHT) {
        gameOver();
        return;
    }

    // Va chạm của bóng với thanh
    if (ballY + BALL_SIZE >= GAME_HEIGHT - 20 &&
        ballX + BALL_SIZE >= barX &&
        ballX <= barX + BAR_WIDTH) {

        // Tính toán vị trí tương đối của điểm va chạm trên thanh
        const hitPosition = (ballX + BALL_SIZE/2 - barX) / BAR_WIDTH;

        // Thay đổi góc dựa trên vị trí va chạm của bóng trên thanh
        const angle = (hitPosition - 0.5) * Math.PI/2;

        // Tính toán tốc độ mới (nhanh hơn một chút sau mỗi lần bật lại)
        const speed = Math.sqrt(ballSpeedX*ballSpeedX + ballSpeedY*ballSpeedY) * 1.02;

        ballSpeedX = speed * Math.sin(angle);
        ballSpeedY = -speed * Math.cos(angle);

        // Đảm bảo bóng không bị kẹt trong thanh
        ballY = GAME_HEIGHT - 20 - BALL_SIZE;

        // Tăng điểm chỉ khi bóng va chạm với thanh
        score += 10;
        scoreDisplay.textContent = `Score: ${score}`;
    }

    updatePositions();
    animationId = requestAnimationFrame(gameLoop);
}

// Xử lý đầu vào từ bàn phím
document.addEventListener('keydown', (e) => {
    if (!gameRunning) return;

    if (e.key === 'ArrowLeft' || e.key === 'Left') {
        barX = Math.max(0, barX - BAR_SPEED);
    } else if (e.key === 'ArrowRight' || e.key === 'Right') {
        barX = Math.min(GAME_WIDTH - BAR_WIDTH, barX + BAR_SPEED);
    }

    updatePositions();
});

// Hàm kết thúc trò chơi
function gameOver() {
    gameRunning = false;
    cancelAnimationFrame(animationId);
    gameOverDisplay.style.display = 'block';
    restartBtn.style.display = 'block';
}

// Khởi động lại trò chơi
restartBtn.addEventListener('click', initGame);

// Bắt đầu trò chơi
initGame();
