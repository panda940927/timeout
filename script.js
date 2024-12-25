import leaderboardManager from './leaderboard.js';

let startTime, endTime;
let lightsTimeouts = [];
let gameActive = false;
let timerInterval = null;
const lights = document.querySelectorAll('.light');
const timerDisplay = document.getElementById('timer');
const restartBtn = document.getElementById('restart');
const changeBgBtn = document.getElementById('change-background');
const instructions = document.getElementById('instructions');
const usernameBtn = document.getElementById('username-btn');

function updateTimer() {
    const currentTime = performance.now();
    const elapsedTime = ((currentTime - startTime) / 1000).toFixed(3);
    timerDisplay.textContent = `${elapsedTime} 秒`;
}

function startGame() {
    gameActive = false;
    startTime = null;
    endTime = null;
    clearInterval(timerInterval);
    timerDisplay.textContent = '0.000 秒';
    instructions.textContent = '請等待燈滅後按空白鍵或點擊螢幕！';
    lights.forEach(light => light.classList.remove('active'));
    clearTimeouts();

    for (let i = 0; i < lights.length; i++) {
        lightsTimeouts.push(setTimeout(() => {
            lights[i].classList.add('active');
        }, i * 1000));
    }

    const delay = lights.length * 1000 + Math.random() * 2000 + 1000;
    lightsTimeouts.push(setTimeout(() => {
        lights.forEach(light => light.classList.remove('active'));
        startTime = performance.now();
        gameActive = true;
        instructions.textContent = '現在！按空白鍵或點擊螢幕！';
        timerInterval = setInterval(updateTimer, 10);
    }, delay));
}

function stopGame(e) {
    e?.stopPropagation();
    
    if (!gameActive || !startTime) return;

    gameActive = false;
    clearInterval(timerInterval);
    endTime = performance.now();
    const reactionTime = ((endTime - startTime) / 1000).toFixed(3);
    timerDisplay.textContent = `${reactionTime} 秒`;
    instructions.textContent = '點擊重新開始按鈕開始新的回合！';
    
    // 儲存成績並更新排行榜
    leaderboardManager.addScore(reactionTime);
}

function clearTimeouts() {
    lightsTimeouts.forEach(timeout => clearTimeout(timeout));
    lightsTimeouts = [];
    clearInterval(timerInterval);
}

function changeBackground() {
    const backgrounds = ['track1.jpg', 'track2.jpg', 'track3.jpg'];
    const randomBg = backgrounds[Math.floor(Math.random() * backgrounds.length)];
    document.body.style.backgroundImage = `url('./assets/${randomBg}')`;
}

function promptUsername() {
    const username = prompt('請輸入您的名稱（最多 10 個字）:', 
        localStorage.getItem('username') || '玩家');
    if (username) {
        leaderboardManager.setUsername(username.slice(0, 10));
    }
}

// 綁定事件
document.body.addEventListener('keydown', (e) => {
    if (e.code === 'Space') stopGame(e);
});

document.addEventListener('click', (e) => {
    if (!e.target.closest('#game button') && !e.target.closest('#leaderboard')) {
        stopGame(e);
    }
});

restartBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    startGame();
});

changeBgBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    changeBackground();
});

usernameBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    promptUsername();
});

// 首次載入時提示設置用戶名
if (!localStorage.getItem('username')) {
    setTimeout(promptUsername, 500);
}

// 啟動遊戲
startGame();
leaderboardManager.renderLeaderboard();