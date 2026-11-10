// === 唯我独仙 · 秘境系统 ===
// SECRET_REALMS 在 data.js 定义

// ==========================
// 获取可进入的秘境
// ==========================
function getAccessibleRealms() {
  const p = G.player;
  if (!p.unlockedRealms) p.unlockedRealms = [];
  if (!p.realmEntries) p.realmEntries = {};
  
  const db = typeof SECRET_REALMS !== 'undefined' ? SECRET_REALMS : {};
  return Object.values(db).filter(r => {
    // 在当前场景
    if (r.scene && r.scene !== G.currentScene) return false;
    // 已解锁
    if (r.neededKey && !p.unlockedRealms.includes(r.neededKey)) return false;
    // 每日限次
    const dayStr = `day_${G.time.day}_${r.id}`;
    if (r.maxEntries && (p.realmEntries[dayStr] || 0) >= r.maxEntries) return false;
    return true;
  });
}

// ==========================
// 进入秘境
// ==========================
function enterSecretRealm(realmId) {
  const db = typeof SECRET_REALMS !== 'undefined' ? SECRET_REALMS : {};
  const realm = db[realmId];
  if (!realm) { addNarrative('秘境不存在。', 'system'); return; }
  
  const p = G.player;
  if (!p.realmEntries) p.realmEntries = {};
  const dayStr = `day_${G.time.day}_${realmId}`;
  const currentEntries = p.realmEntries[dayStr] || 0;
  
  if (realm.maxEntries && currentEntries >= realm.maxEntries) {
    addNarrative('秘境今日已探索完毕，明日再来吧。', 'system');
    return;
  }
  
  // 检查入场费
  if (realm.entryCost && realm.entryCost.stones) {
    if (p.stones < realm.entryCost.stones) {
      addNarrative(`灵石不足！进入秘境需要${realm.entryCost.stones}灵石。`, 'system');
      return;
    }
    p.stones -= realm.entryCost.stones;
  }
  
  // 进入秘境（改造当前场景为秘境状态）
  p.realmEntries[dayStr] = currentEntries + 1;
  p._inSecretRealm = realmId;
  
  addNarrative(`🌀 你踏入${realm.name}，周围灵气骤然浓郁！`, 'event');
  if (realm.breakthrough && realm.breakthrough.bonus) {
    addNarrative(`✨ 秘境内突破成功率+${Math.round(realm.breakthrough.bonus * 100)}%`, 'narr-event');
  }
  addNarrative(`👑 深处传来${realm.boss}的咆哮……`, 'system');
  
  // 在高几率触发BOSS的情况下，直接触发BOSS战
  setTimeout(() => {
    // 🛡️ 800ms内玩家可能已切场景——场景不符则不再触发BOSS战（防数据错位）
    if (G.currentScene !== realm.scene) {
      // 已离开秘境场景，清理秘境状态防残留
      p._inSecretRealm = null;
      return;
    }
    if (typeof startSceneCombat === 'function') {
      const combat = startSceneCombat();
      if (combat) {
        // 战斗结束后检查是否击败BOSS
        const origEnd = combat.onEnd;
        combat.onEnd = (result) => {
          if (result === 'victory') {
            addNarrative(`🏆 你在${realm.name}中大获全胜！`, 'event');
            // 发放秘境奖励
            if (realm.rewards) {
              const r = realm.rewards;
              if (r.stones) p.stones += r.stones;
              if (r.items) {
                r.items.forEach(item => {
                  const itemData = (typeof ITEM_DB !== 'undefined' ? ITEM_DB : []).find(i => i.id === item.id);
                  if (itemData && typeof addItemToInventory === 'function') {
                    for (let qi = 0; qi < item.qty; qi++) addItemToInventory(itemData, 1);
                  }
                });
              }
              if (r.skillScroll && typeof learnSkillFromScroll === 'function') {
                learnSkillFromScroll(r.skillScroll);
              }
              addNarrative(`💰 秘境奖励：灵石+${r.stones || 0}`, 'event');
            }
            recalcStats(p);
            updateAllUI();
          } else if (result === 'defeat') {
            addNarrative(`💀 你不敌${realm.boss}，被传送出了${realm.name}……`, 'system');
          }
          p._inSecretRealm = null;
          if (origEnd) origEnd(result);
        };
      }
    }
  }, 800);
  
  updateAllUI();
}

// ==========================
// 秘境弹窗
// ==========================
function showSecretRealmModal() {
  const realms = getAccessibleRealms();
  if (realms.length === 0) {
    addNarrative('当前场景没有可进入的秘境。', 'system');
    return;
  }
  
  let html = '<p style="margin-bottom:8px;">周围的灵气有异动……似乎有秘境入口：</p>';
  realms.forEach(r => {
    const price = r.entryCost ? `${r.entryCost.stones}灵石` : '免费';
    html += `<div style="border:1px solid rgba(201,169,110,0.3);border-radius:6px;padding:8px;margin-bottom:6px;cursor:pointer;" onclick="enterSecretRealm('${r.id}');closeEvent();">
      <div style="font-weight:bold;color:var(--accent)">🌀 ${r.name}</div>
      <div style="font-size:11px;color:var(--text-dim);margin:4px 0;">${r.desc}</div>
      <div style="font-size:10px;">入场费: ${price} | BOSS: ${r.boss}</div>
    </div>`;
  });
  
  showCustomModal('🌀 秘境入口', html + `<button class="event-choice-btn" onclick="closeEvent()">离开</button>`);
}

// ==========================
// 秘境突破加成检测
// ==========================
function getSecretRealmBreakthroughBonus() {
  const p = G.player;
  if (!p._inSecretRealm) return 0;
  const db = typeof SECRET_REALMS !== 'undefined' ? SECRET_REALMS : {};
  const realm = db[p._inSecretRealm];
  if (!realm || !realm.breakthrough) return 0;
  // 境界门槛
  if (realm.breakthrough.realm) {
    const rn = parseInt(realm.breakthrough.realm.replace('练气','').replace('层',''));
    if (G.player.qiRealmIndex + 1 < rn) return 0;
  }
  return realm.breakthrough.bonus || 0;
}

// 导出
window.getAccessibleRealms = getAccessibleRealms;
window.enterSecretRealm = enterSecretRealm;
window.showSecretRealmModal = showSecretRealmModal;
window.getSecretRealmBreakthroughBonus = getSecretRealmBreakthroughBonus;
