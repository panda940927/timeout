// leaderboard.js
class LeaderboardManager {
    constructor() {
      this.currentUserId = this.getCurrentUserId();
    }
  
    // 獲取或創建用戶 ID
    getCurrentUserId() {
      let userId = localStorage.getItem('userId');
      if (!userId) {
        userId = 'user_' + Math.random().toString(36).substr(2, 9);
        localStorage.setItem('userId', userId);
      }
      return userId;
    }
  
    // 新增分數到排行榜
    addScore(score) {
      const leaderboard = this.getLeaderboard();
      const newEntry = {
        userId: this.currentUserId,
        score: parseFloat(score),
        timestamp: Date.now(),
        username: localStorage.getItem('username') || '玩家'
      };
  
      leaderboard.push(newEntry);
      
      // 排序並只保留前 100 名
      const sortedLeaderboard = leaderboard
        .sort((a, b) => a.score - b.score)
        .slice(0, 100);
  
      localStorage.setItem('globalLeaderboard', JSON.stringify(sortedLeaderboard));
      this.renderLeaderboard();
    }
  
    // 獲取排行榜資料
    getLeaderboard() {
      try {
        return JSON.parse(localStorage.getItem('globalLeaderboard')) || [];
      } catch (e) {
        return [];
      }
    }
  
    // 設置用戶名稱
    setUsername(username) {
      localStorage.setItem('username', username);
      this.renderLeaderboard();
    }
  
    // 渲染排行榜
    renderLeaderboard() {
      const leaderboard = this.getLeaderboard();
      const scoresList = document.getElementById('scores');
      const topScores = leaderboard.slice(0, 5);  // 只取前 5 名
  
      // 找出當前用戶的最佳成績及排名
      const userBestEntry = leaderboard
        .filter(entry => entry.userId === this.currentUserId)
        .sort((a, b) => a.score - b.score)[0];
  
      const leaderboardHTML = topScores.map((entry, index) => {
        const isCurrentUser = entry.userId === this.currentUserId;
        const rankNumber = index + 1;
        return `
          <li class="${isCurrentUser ? 'current-user' : ''} rank-${rankNumber}">
            <span class="rank">#${rankNumber}</span>
            <span class="username">${entry.username}</span>
            <span class="score">${entry.score} 秒</span>
            ${isCurrentUser ? '<span class="user-marker">⭐️</span>' : ''}
          </li>
        `;
      }).join('');
  
      // 如果用戶不在前 5 名但有成績，顯示其最佳成績
      const userRankHTML = userBestEntry && !topScores.some(entry => entry.userId === this.currentUserId) 
        ? `<li class="current-user user-best">
            <span class="rank">你的最佳</span>
            <span class="username">${userBestEntry.username}</span>
            <span class="score">${userBestEntry.score} 秒</span>
            <span class="user-marker">⭐️</span>
          </li>`
        : '';
  
      scoresList.innerHTML = leaderboardHTML + userRankHTML;
    }
  }
  
  // 創建並導出 leaderboardManager 實例
  const leaderboardManager = new LeaderboardManager();
  export default leaderboardManager;