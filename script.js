let startTime, endTime;
let lightsTimeouts = [];
const lights = document.querySelectorAll('.light');
const timerDisplay = document.getElementById('timer');
const scoresList = document.getElementById('scores');
const restartBtn = document.getElementById('restart');
const changeBgBtn = document.getElementById('change-background');

function startGame() {
  // 重置狀態
  timerDisplay.textContent = '0.000 秒';
  lights.forEach(light => light.classList.remove('active'));
  clearTimeouts();

  // 模擬 F1 燈逐一亮起
  for (let i = 0; i < lights.length; i++) {
    lightsTimeouts.push(setTimeout(() => {
      lights[i].classList.add('active');
    }, i * 1000)); // 每隔 1 秒亮一個燈
  }

  // 所有燈亮起後，再熄滅並開始計時
  const delay = lights.length * 1000 + Math.random() * 2000 + 1000; // 燈全部亮後再隨機 1-3 秒熄滅
  lightsTimeouts.push(setTimeout(() => {
    lights.forEach(light => light.classList.remove('active'));
    startTime = performance.now(); // 記錄計時開始
  }, delay));
}

function stopGame() {
  // 確保開始計時後才能停止
  if (!startTime) return;

  endTime = performance.now();
  const reactionTime = ((endTime - startTime) / 1000).toFixed(3);
  timerDisplay.textContent = `${reactionTime} 秒`;
  saveScore(reactionTime);
  renderScores();
}

function clearTimeouts() {
  lightsTimeouts.forEach(timeout => clearTimeout(timeout));
  lightsTimeouts = [];
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
  if (e.code === 'Space') stopGame();
});
document.body.addEventListener('click', stopGame);
restartBtn.addEventListener('click', startGame);
changeBgBtn.addEventListener('click', changeBackground);

// 啟動遊戲
startGame();
renderScores(); 