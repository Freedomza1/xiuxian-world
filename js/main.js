// === 唯我独仙 · Main (Bootstrap v2) ===

// ==========================
// 页面加载完后显示角色选择
// ==========================
(function tryBootstrap(retries) {
  if (retries > 10) return;
  
  try {
    // 确保G和其他函数已就绪（纪元选择依赖 era2.js 的 showEraSelect）
    if (typeof G === 'undefined' || !G || typeof showCharacterSelect !== 'function' || typeof showEraSelect !== 'function') {
      return setTimeout(tryBootstrap, 200, (retries || 0) + 1);
    }
    
    // 🔧 2026-08-04 修复：刷新后直接回到上次的游戏（不回到人物选择）
    //    检测最近一次活跃的角色存档，存在则直接恢复进游戏
    if (typeof tryResumeLastGame === 'function' && tryResumeLastGame()) {
      return; // 已恢复上次游戏
    }
    
    // 显示纪元选择界面（一部/二部），不再直接跳天命抽牌
    // 🔧 2026-08-04 修复：无存档时 showCharacterSelect 会直接进天命创建，
    //    用户看不到纪元选择入口 → 改为先进纪元选择页
    showEraSelect();
    
    // 注意：initWorldSimulator 和 initTimeSystem 在角色真正进入游戏时才启动
    // 参见 ui.js 中的 confirmCharacter() / loadCharacterSave() / loadSave()
  } catch(e) {
    console.warn('Bootstrap failed:', e);
  }
})();

// ==========================
// 尝试恢复上次游戏（刷新后直接回游戏）
// ==========================
function tryResumeLastGame() {
  try {
    // 记录当前玩家 saveKey（每次存档时更新）
    const lastKey = localStorage.getItem('weiwoduxian_last_save_key');
    if (lastKey) {
      const raw = localStorage.getItem(lastKey);
      if (raw) {
        const data = JSON.parse(raw);
        if (data && data.player && data.player.isAlive !== false) {
          // 有有效存档 → 直接恢复进游戏
          loadCharacterSave(lastKey);
          return true;
        }
      }
    }
    
    // 兜底：找 meta 里最近活跃的角色（一部+二部合并）
    const candidates = [];
    try {
      const m1 = JSON.parse(localStorage.getItem('weiwoduxian_char_meta') || '[]');
      const m2 = JSON.parse(localStorage.getItem('weiwoduxian_char_meta2') || '[]');
      m1.forEach(c => candidates.push(c));
      m2.forEach(c => candidates.push(c));
    } catch(e) {}
    if (candidates.length > 0) {
      // 按 lastActive 排序，取最近一个
      candidates.sort((a, b) => (b.lastActive || 0) - (a.lastActive || 0));
      const best = candidates[0];
      if (best && best.saveKey) {
        const raw = localStorage.getItem(best.saveKey);
        if (raw) {
          const data = JSON.parse(raw);
          if (data && data.player && data.player.isAlive !== false) {
            loadCharacterSave(best.saveKey);
            return true;
          }
        }
      }
    }
    return false;
  } catch(e) {
    return false;
  }
}
window.tryResumeLastGame = tryResumeLastGame;

// ==========================
// Auto-save every 30s + 页面关闭保存
// ==========================
function saveGameNow() {
  try {
    if (!G || !G.player || !G.time) return false;
    
    const d = JSON.parse(JSON.stringify({
      player: G.player,
      skillData: G.skillData,
      itemData: G.itemData,
      worldData: G.worldData,
      eventData: G.eventData,
      worldEvents: G._worldEvents || [],
      currentScene: G.currentScene,
      turn: G.turn,
      time: G.time,
      narrativeHistory: (G.narrativeHistory||[]).slice(-100),
      eventHistory: (G.player.eventHistory||[]).slice(-500),
      dailyLog: G.dailyLog || [],
      lifeChronicle: (G.lifeChronicle || []).slice(-365),
    }));
    // 按纪元选择存档键（一部 weiwoduxian_save_，二部 weiwoduxian_save2_）
    // 🔧 2026-08-04 修复：原来写死一部键，二部角色每30秒自动保存会污染一部列表
    const saveKey = G.player.era2
      ? ('weiwoduxian_save2_' + (G.player?.name || '主角'))
      : ('weiwoduxian_save_' + (G.player?.name || '主角'));
    localStorage.setItem(saveKey, JSON.stringify(d));
    localStorage.setItem('weiwoduxian_autosave', JSON.stringify(d));
    // 🔧 2026-08-04：记录最近在玩的角色，刷新后直接恢复进游戏
    localStorage.setItem('weiwoduxian_last_save_key', saveKey);
    
    if (typeof updateLastActiveTimestamp === 'function') updateLastActiveTimestamp();
    if (typeof saveCharacterMeta === 'function') saveCharacterMeta();
    return true;
  } catch(e) { return false; }
}
window.saveGameNow = saveGameNow;

setInterval(() => {
  saveGameNow();
}, 30000);

// 💾 页面关闭/隐藏时保存，防止丢失最后进度
(function() {
  var lastPagehideSave = 0;
  function saveOnExit() {
    // 节流：5秒内不重复保存（pagehide + visibilitychange 可能都触发）
    var now = Date.now();
    if (now - lastPagehideSave < 5000) return;
    lastPagehideSave = now;
    saveGameNow();
  }
  if (typeof window.addEventListener === 'function') {
    window.addEventListener('pagehide', saveOnExit);
    window.addEventListener('beforeunload', saveOnExit);
    document.addEventListener('visibilitychange', function() {
      if (document.visibilityState === 'hidden') saveOnExit();
    });
  }
})();
