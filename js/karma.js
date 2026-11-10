// === 唯我独仙 · 因果业力系统 ===
// 杀生造孽，行善积德。业力影响突破、奇遇、心魔、天劫
// p.karma: -100(大魔头) ~ 0(凡人) ~ +100(大功德)

// ── 业力等级 ──
function getKarmaLevel() {
  const k = G.player.karma || 0;
  if (k <= -80) return { name: '业火缠身', desc: '杀孽滔天，业火缠身。天道在暗中注视着你。', color: '#e74c3c' };
  if (k <= -50) return { name: '煞气冲天', desc: '煞气冲天，诸邪避让也诸神厌恶。', color: '#e67e22' };
  if (k <= -20) return { name: '戾气缠身', desc: '戾气缠身，修行之路渐生荆棘。', color: '#d4a045' };
  if (k < 20) return { name: '心性平凡', desc: '善恶未分，因果未显。', color: '#9a9a9a' };
  if (k < 50) return { name: '善念初萌', desc: '心存善念，天地有感。', color: '#4caf50' };
  if (k < 80) return { name: '功德加身', desc: '功德加身，气运绵绵。', color: '#2196f3' };
  return { name: '圣德昭昭', desc: '圣德昭昭，天道庇佑，万邪不侵。', color: '#ff9800' };
}

// ── 业力影响 ──
// 突破成功率修正
function getKarmaBreakBonus() {
  const k = G.player.karma || 0;
  if (k >= 50) return 0.08;   // 功德加身 +8%
  if (k >= 20) return 0.03;
  if (k <= -50) return -0.08; // 业火缠身 -8%
  if (k <= -20) return -0.03;
  return 0;
}

// 奇遇/掉落修正
function getKarmaLootMult() {
  const k = G.player.karma || 0;
  if (k >= 50) return 1.3;
  if (k >= 20) return 1.1;
  if (k <= -50) return 0.7;
  if (k <= -20) return 0.85;
  return 1.0;
}

// 心魔强度修正（业力越差，心魔越凶）
function getKarmaXinmoMod() {
  const k = G.player.karma || 0;
  if (k <= -50) return 0.2; // 心魔成功率-20%
  if (k <= -20) return 0.1;
  return 0;
}

// ── 业力变更 ──
function changeKarma(delta, reason) {
  const p = G.player;
  if (!p) return;
  if (p.karma === undefined) p.karma = 0;
  const oldLevel = getKarmaLevel();
  p.karma = Math.max(-100, Math.min(100, p.karma + delta));
  const newLevel = getKarmaLevel();
  
  const icon = delta > 0 ? '🌟' : (delta < 0 ? '☠️' : '');
  addNarrative(`<span style="border-left:3px solid ${delta > 0 ? '#4caf50' : '#e74c3c'};padding:4px 8px;display:block;font-size:11px;color:${delta > 0 ? '#4caf50' : '#e74c3c'};">${icon} 因果：${reason}（${delta > 0 ? '+' : ''}${delta}）</span>`, delta > 0 ? 'good' : 'danger');
  
  // 等级变化提醒
  if (oldLevel.name !== newLevel.name) {
    addNarrative(`<div style="border:1px solid ${newLevel.color};border-radius:8px;padding:8px;margin:4px 0;background:rgba(0,0,0,0.2);">
      <span style="font-weight:bold;color:${newLevel.color};">因果之变：${newLevel.name}</span>
      <div style="font-size:10px;color:var(--text-dim);margin-top:2px;">${newLevel.desc}</div>
    </div>`, 'milestone');
  }
}

// ── 杀生：战斗胜利时减少业力（杀无辜怪物→负业，杀恶兽→小负）──
function karmaOnKill(monsterName) {
  const p = G.player;
  if (!p) return;
  if (p.karma === undefined) p.karma = 0;
  // 根据怪物类型判定：妖兽/山贼负业小，BOSS负业大
  const evilMonsters = ['山贼', '劫匪', '强盗', '魔', '妖', '怨', '煞', '恶'];
  const isEvil = evilMonsters.some(e => (monsterName || '').includes(e));
  // 杀恶除害反而微增功德？——不，修真界弱肉强食，杀生即有因果
  // 但除恶可抵消部分：恶类怪 -1，普通妖兽 -2，BOSS -4
  let delta = -2;
  if (isEvil) delta = -1;
  if (monsterName && (monsterName.includes('首领') || monsterName.includes('BOSS') || monsterName.includes('boss'))) delta = -4;
  // 上限保护：杀孽最多到 -80（留一线生机）
  p.karma = Math.max(-80, Math.min(100, p.karma + delta));
}

// ── 行善：救人/助人任务完成时增加业力 ──
function karmaOnGood(deed) {
  changeKarma(3, deed);
}

// ── 业力面板 ──
function showKarmaPanel() {
  const p = G.player;
  if (!p) return;
  if (p.karma === undefined) p.karma = 0;
  const level = getKarmaLevel();
  const k = p.karma;
  // 进度条位置：-100~100 → 0~100
  const barPct = Math.round((k + 100) / 2);
  const centerPct = 50; // 0点位置
  
  let html = '<div style="padding:2px;">';
  html += `<div style="text-align:center;margin-bottom:10px;">
    <div style="font-size:16px;font-weight:bold;color:${level.color};letter-spacing:2px;">${level.name}</div>
    <div style="font-size:10px;color:var(--text-dim);margin-top:3px;">${level.desc}</div>
  </div>`;
  // 业力条
  html += `<div style="position:relative;margin:10px 0;">
    <div class="progress-bar-bg" style="height:12px;background:linear-gradient(90deg,#7a1a1a,#3a3a3a 50%,#1a3a7a);border-radius:6px;">
      <div style="width:${barPct}%;height:12px;background:${k >= 0 ? 'linear-gradient(90deg,#3a6a3a,#4caf50)' : 'linear-gradient(90deg,#e74c3c,#8a2a2a)'};border-radius:6px;"></div>
      <div style="position:absolute;left:50%;top:-3px;width:2px;height:18px;background:#fff;opacity:0.6;"></div>
    </div>
    <div style="display:flex;justify-content:space-between;font-size:9px;color:var(--text-dim);margin-top:2px;">
      <span>☠️ 杀孽</span><span style="color:#e74c3c;">${k < 0 ? k : ''}</span>
      <span style="color:#4caf50;">${k > 0 ? '+' + k : ''}</span><span>🌟 功德</span>
    </div>
  </div>`;
  
  html += '<div style="font-size:10px;color:var(--text-dim);margin:8px 0;">当前业力影响：</div>';
  const kb = getKarmaBreakBonus();
  const kl = getKarmaLootMult();
  const kx = getKarmaXinmoMod();
  html += `<div style="font-size:11px;line-height:1.9;color:var(--text);">
    <div>⚡ 突破成功率：${kb > 0 ? '<span style="color:#4caf50;">+' + Math.round(kb * 100) + '%</span>' : kb < 0 ? '<span style="color:#e74c3c;">' + Math.round(kb * 100) + '%</span>' : '无影响'}</div>
    <div>📦 掉落/奇遇：${kl !== 1.0 ? '<span style="color:' + (kl > 1 ? '#4caf50' : '#e74c3c') + ';">' + (kl > 1 ? '+' : '') + Math.round((kl - 1) * 100) + '%</span>' : '无影响'}</div>
    <div>🌀 心魔强度：${kx < 0 ? '<span style="color:#e74c3c;">+' + Math.round(Math.abs(kx) * 100) + '%难度</span>' : '无影响'}</div>
  </div>`;
  
  html += '<div style="font-size:10px;color:var(--text-dim);margin-top:10px;border-top:1px solid rgba(255,255,255,0.1);padding-top:6px;">💡 杀怪减业力，助人任务加功德。因果循环，报应不爽。</div>';
  html += '</div>';
  showCustomModal('☯️ 因果业力', html + '<button class="event-choice-btn" onclick="closeEvent()">关闭</button>');
}

// 导出
window.getKarmaLevel = getKarmaLevel;
window.getKarmaBreakBonus = getKarmaBreakBonus;
window.getKarmaLootMult = getKarmaLootMult;
window.getKarmaXinmoMod = getKarmaXinmoMod;
window.changeKarma = changeKarma;
window.karmaOnKill = karmaOnKill;
window.karmaOnGood = karmaOnGood;
window.showKarmaPanel = showKarmaPanel;
