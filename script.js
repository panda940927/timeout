let startTime, endTime;
let lightsTimeouts = [];
let gameActive = false;
let timerInterval = null; // 新增計時器 interval
const lights = document.querySelectorAll('.light');
const timerDisplay = document.getElementById('timer');
const scoresList = document.getElementById('scores');
const restartBtn = document.getElementById('restart');
const changeBgBtn = document.getElementById('change-background');
const instructions = document.getElementById('instructions');

function updateTimer() {
  const currentTime = performance.now();
  const elapsedTime = ((currentTime - startTime) / 1000).toFixed(3);
  timerDisplay.textContent = `${elapsedTime} 秒`;
}

function startGame() {
  // 重置狀態
  gameActive = false;
  startTime = null;
  endTime = null;
  clearInterval(timerInterval);
  timerDisplay.textContent = '0.000 秒';
  instructions.textContent = '請等待燈滅後按空白鍵或點擊螢幕！';
  lights.forEach(light => light.classList.remove('active'));
  clearTimeouts();

  // 模擬 F1 燈逐一亮起
  for (let i = 0; i < lights.length; i++) {
    lightsTimeouts.push(setTimeout(() => {
      lights[i].classList.add('active');
    }, i * 1000));
  }

  // 所有燈亮起後，再熄滅並開始計時
  const delay = lights.length * 1000 + Math.random() * 2000 + 1000;
  lightsTimeouts.push(setTimeout(() => {
    lights.forEach(light => light.classList.remove('active'));
    startTime = performance.now();
    gameActive = true;
    instructions.textContent = '現在！按空白鍵或點擊螢幕！';
    
    // 開始即時更新計時器
    timerInterval = setInterval(updateTimer, 10); // 每 10ms 更新一次
  }, delay));
}

function stopGame(e) {
  e?.stopPropagation();
  
  if (!gameActive || !startTime) return;

  gameActive = false;
  clearInterval(timerInterval); // 停止計時器更新
  endTime = performance.now();
  const reactionTime = ((endTime - startTime) / 1000).toFixed(3);
  timerDisplay.textContent = `${reactionTime} 秒`;
  instructions.textContent = '點擊重新開始按鈕開始新的回合！';
  saveScore(reactionTime);
  renderScores();
}

function clearTimeouts() {
  lightsTimeouts.forEach(timeout => clearTimeout(timeout));
  lightsTimeouts = [];
  clearInterval(timerInterval); // 確保清除計時器 interval
}

function saveScore(score) {
  const scores = JSON.parse(localStorage.getItem('scores')) || [];
  scores.push(score);
  localStorage.setItem('scores', JSON.stringify(scores.sort((a, b) => a - b).slice(0, 5)));
}

function renderScores() {
  const scores = JSON.parse(localStorage.getItem('scores')) || [];
  scoresList.innerHTML = scores.map(score => `<li>${score} 秒</li>`).join('');
}

function changeBackground() {
  const backgrounds = ['track1.jpg', 'track2.jpg', 'track3.jpg'];
  const randomBg = backgrounds[Math.floor(Math.random() * backgrounds.length)];
  document.body.style.backgroundImage = `url('./assets/${randomBg}')`;
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

// 啟動遊戲
startGame();
renderScores();