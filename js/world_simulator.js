// === 唯我独仙 · 离线世界模拟器 ===
// 玩家不在线时，世界依然运转

// 离线时间流速：1小时现实 ≈ 15天游戏内
const REAL_HOUR_TO_GAME_DAYS = 15;

// ==========================
// 离线进度推演（游戏加载时调用）
// ==========================
function simulateOfflineProgress() {
  try {
    // 检查存档是否存在（说明不是新游戏）
    const saveExists = Array.from({length:localStorage.length},(_,i)=>localStorage.key(i)).some(k=>k.startsWith('weiwoduxian_save_')||k==='weiwoduxian_save') || localStorage.getItem('weiwoduxian_autosave');
    if (!saveExists) return; // 新玩家，不做推演
    
    const lastActive = parseInt(localStorage.getItem('weiwoduxian_last_active') || '0');
    if (!lastActive) {
      // 首次保存时间戳
      localStorage.setItem('weiwoduxian_last_active', Date.now().toString());
      localStorage.setItem('weiwoduxian_first_seen', Date.now().toString());
      return;
    }
    
    const now = Date.now();
    const elapsedMs = now - lastActive;
    const elapsedHours = elapsedMs / (1000 * 60 * 60);
    
    // 少于5分钟不推演
    if (elapsedHours < 0.08) return;
    
    const gameDays = Math.round(elapsedHours * REAL_HOUR_TO_GAME_DAYS);
    
    // 限制最大推演量（最多推演1年 = 365天）
    const maxGameDays = Math.min(gameDays, 365);
    
    if (maxGameDays < 1) return;
    
    console.log(`[世界模拟] 离线 ${elapsedHours.toFixed(1)} 小时 → 推演 ${maxGameDays} 天`);
    
    // 执行推演
    const report = runWorldTimeLapse(maxGameDays);
    
    // 保存推演记录
    localStorage.setItem('weiwoduxian_last_offline_report', JSON.stringify({
      elapsedDays: maxGameDays,
      elapsedRealHours: Math.round(elapsedHours * 10) / 10,
      timestamp: now,
      report: report,
    }));
    
    // 更新存档中的时间
    if (G.time) {
      G.time.lastOfflineSync = now;
    }
    
  } catch(e) {
    console.warn('[世界模拟] 离线推演出错:', e);
  }
  
  // 刷新时间戳
  localStorage.setItem('weiwoduxian_last_active', Date.now().toString());
}

// ==========================
// 世界时间推进（批量）
// ==========================
function runWorldTimeLapse(days) {
  const report = {
    births: [],
    deaths: [],
    breakthroughs: [],
    marriages: [],
    daoUnions: [],
    totalDays: days,
  };
  
  // 没有NPC管理器，跳过
  if (!npcManager || !npcManager.npcs || npcManager.npcs.length === 0) return report;
  
  // 分批推进：每批推演1天，记录事件
  for (let d = 0; d < days; d++) {
    const dayReport = simulateSingleDay();
    
    // 收集事件（去重、合并）
    dayReport.births.forEach(b => {
      if (!report.births.find(x => x.name === b.name)) report.births.push(b);
    });
    dayReport.deaths.forEach(b => {
      if (!report.deaths.find(x => x.name === b.name)) report.deaths.push(b);
    });
    dayReport.breakthroughs.forEach(b => {
      if (!report.breakthroughs.find(x => x.name === b.name)) report.breakthroughs.push(b);
    });
    if (dayReport.marriage) report.marriages.push(dayReport.marriage);
    if (dayReport.daoUnion) report.daoUnions.push(dayReport.daoUnion);
    
    // 推进游戏时间
    if (G.time) {
      G.time.day++;
      if (G.time.day % 360 === 0) {
        G.time.year++;
      }
    }
  }
  
  // 推演后刷新地面物品
  if (typeof generateGroundItems === 'function') {
    Object.keys(G.groundItems || {}).forEach(sceneId => generateGroundItems(sceneId));
  }
  
  return report;
}

// ==========================
// 单日模拟
// ==========================
function simulateSingleDay() {
  const result = {
    births: [],
    deaths: [],
    breakthroughs: [],
    marriage: null,
    daoUnion: null,
  };
  
  const npcs = npcManager.npcs || [];
  const alive = npcs.filter(n => n.isAlive && n._hasLifecycle);
  
  for (const npc of alive) {
    // ── 年龄增长 ──
    npc.trueAge = (npc.trueAge || 16) + 1/365;
    
    // ── 寿元耗尽判定 ──
    if (npc.trueAge >= (npc.maxAge || 60)) {
      const cause = Math.random() < 0.7 ? '寿终正寝' : 
                    (Math.random() < 0.5 ? '走火入魔' : '渡劫失败');
      dieNPC(npc, cause);
      result.deaths.push({
        name: npc.name,
        realm: QI_REALMS[npc.qiRealmIndex]?.name || '凡人',
        age: Math.round(npc.trueAge),
        cause: cause,
        epitaph: npc.epitaph || '',
      });
      continue;
    }
    
    // ── 凡人突破概率 ──
    if (npc.qiRealmIndex === 0 && npc.bodyRealmIndex === 0 && npc.trueAge > 18 && npc.trueAge < 50) {
      const chance = 0.002 + (npc.bone || 50) / 5000; // 根骨越高越可能
      if (Math.random() < chance) {
        if (Math.random() < 0.35) {
          npc.qiRealmIndex = 1;
          npc.maxAge = getMaxAgeForRealm(1, 0);
          npc.lifeEvents.push({ day: G.time.day, event: `${npc.name}突破至练气一层！` });
          result.breakthroughs.push({ name: npc.name, from: '凡人', to: '练气一层' });
        }
      }
    }
    
    // ── 修士突破 ──
    if (npc.qiRealmIndex >= 1 && npc.qiRealmIndex < 5 && npc.trueAge < npc.maxAge * 0.8) {
      const chance = 0.001 * (npc.wisdom || 50) / 50;
      if (Math.random() < chance) {
        npc.qiRealmIndex++;
        npc.maxAge = getMaxAgeForRealm(npc.qiRealmIndex, npc.bodyRealmIndex);
        const from = QI_REALMS[npc.qiRealmIndex - 1]?.name || '未知';
        const to = QI_REALMS[npc.qiRealmIndex]?.name || '未知';
        npc.lifeEvents.push({ day: G.time.day, event: `${npc.name}突破至${to}！` });
        result.breakthroughs.push({ name: npc.name, from, to });
      }
    }
    
    // ── 凡人婚姻 ──
    if (!npc.spouseId && npc.qiRealmIndex === 0 && npc.trueAge > 18 && npc.trueAge < 40) {
      const suitable = alive.filter(n => 
        n.id !== npc.id && 
        !n.spouseId && 
        n.qiRealmIndex === 0 && 
        n.gender !== npc.gender &&
        Math.abs((n.trueAge || 16) - (npc.trueAge || 16)) < 15
      );
      if (suitable.length > 0 && Math.random() < 0.001) {
        const mate = suitable[Math.floor(Math.random() * suitable.length)];
        npc.spouseId = mate.id;
        mate.spouseId = npc.id;
        npc.lifeEvents.push({ day: G.time.day, event: `${npc.name}与${mate.name}结为夫妻。` });
        mate.lifeEvents.push({ day: G.time.day, event: `与${npc.name}结为夫妻。` });
        result.marriage = { groom: npc.gender === '男' ? npc.name : mate.name, bride: npc.gender === '女' ? npc.name : mate.name };
      }
    }
    
    // ── 凡人夫妻生子 ──
    if (npc.spouseId && npc.trueAge > 20 && npc.trueAge < 45 && npc.qiRealmIndex === 0) {
      const spouse = npcs.find(n => n.id === npc.spouseId);
      if (spouse && spouse.isAlive && (npc.childIds || []).length < 6) {
        if (Math.random() < 0.002) {
          const child = createNPCChild(npc, spouse);
          if (child) result.births.push({ name: child.name, parent1: npc.name, parent2: spouse.name, gender: child.gender });
        }
      }
    }
    
    // ── 道侣双修（修士之间） ──
    if (npc.daoPartnerId && npc.qiRealmIndex > 0) {
      const partner = npcs.find(n => n.id === npc.daoPartnerId);
      if (partner && partner.isAlive && Math.random() < 0.002) {
        // 小概率生子（高阶修士生育率低）
        if ((npc.childIds || []).length < 3 && Math.random() < 0.03) {
          const child = createNPCChild(npc, partner);
          if (child) result.births.push({ name: child.name, parent1: npc.name, parent2: partner.name, gender: child.gender });
        }
      }
    }
    
    // ── 修士间结为道侣 ──
    if (!npc.daoPartnerId && npc.qiRealmIndex >= 1 && npc.trueAge > 20) {
      const potentialDao = alive.filter(n => 
        n.id !== npc.id && 
        !n.daoPartnerId &&
        n.qiRealmIndex >= 1 &&
        n.gender !== npc.gender &&
        Math.abs(n.qiRealmIndex - npc.qiRealmIndex) <= 2
      );
      if (potentialDao.length > 0 && Math.random() < 0.0005) {
        const mate = potentialDao[Math.floor(Math.random() * potentialDao.length)];
        npc.daoPartnerId = mate.id;
        mate.daoPartnerId = npc.id;
        npc.lifeEvents.push({ day: G.time.day, event: `${npc.name}与${mate.name}结为道侣。` });
        mate.lifeEvents.push({ day: G.time.day, event: `与${npc.name}结为道侣。` });
        result.daoUnion = { person1: npc.name, person2: mate.name };
      }
    }
  }
  
  return result;
}

// ==========================
// 离线进展报告展示
// ==========================
function showOfflineReport() {
  try {
    const raw = localStorage.getItem('weiwoduxian_last_offline_report');
    if (!raw) return;
    
    const data = JSON.parse(raw);
    
    // 已展示过的标记
    const shownKey = 'weiwoduxian_offline_report_shown';
    const lastShown = localStorage.getItem(shownKey);
    if (lastShown === data.timestamp?.toString()) return;
    localStorage.setItem(shownKey, data.timestamp?.toString() || '1');
    
    const report = data.report;
    if (!report) return;
    
    const totalEvents = (report.births?.length || 0) + (report.deaths?.length || 0) + 
                        (report.breakthroughs?.length || 0) + (report.marriages?.length || 0) + 
                        (report.daoUnions?.length || 0);
    if (totalEvents === 0) return;
    
    let html = `
      <div style="margin-bottom:8px;">
        <div style="font-size:16px;font-weight:bold;">🌍 世界已独自运转 ${data.elapsedDays} 天</div>
        <div style="font-size:12px;color:var(--text-dim);">你离开了 ${data.elapsedRealHours} 小时，但世界从未停止。</div>
      </div>
    `;
    
    // 出生
    if (report.births?.length > 0) {
      html += `<div style="margin:8px 0;"><b>👶 新生儿（${report.births.length}）</b></div>`;
      const birthList = report.births.slice(-5);
      birthList.forEach(b => {
        html += `<div style="font-size:12px;padding:2px 0;">👶 ${b.name}（${b.gender}）— ${b.parent1}与${b.parent2}之子</div>`;
      });
      if (report.births.length > 5) html += `<div style="font-size:11px;color:var(--text-dim);">……还有${report.births.length - 5}个新生儿</div>`;
    }
    
    // 死亡
    if (report.deaths?.length > 0) {
      html += `<div style="margin:8px 0;"><b>💀 陨落（${report.deaths.length}）</b></div>`;
      const deathList = report.deaths.slice(-5);
      deathList.forEach(d => {
        html += `<div style="font-size:12px;padding:2px 0;">💀 ${d.name}（${d.realm}）享年${d.age}岁 — ${d.cause}</div>`;
      });
      if (report.deaths.length > 5) html += `<div style="font-size:11px;color:var(--text-dim);">……还有${report.deaths.length - 5}人陨落</div>`;
    }
    
    // 突破
    if (report.breakthroughs?.length > 0) {
      html += `<div style="margin:8px 0;"><b>⬆️ 突破（${report.breakthroughs.length}）</b></div>`;
      const btList = report.breakthroughs.slice(-5);
      btList.forEach(b => {
        html += `<div style="font-size:12px;padding:2px 0;">⬆️ ${b.name}：${b.from} → ${b.to}</div>`;
      });
      if (report.breakthroughs.length > 5) html += `<div style="font-size:11px;color:var(--text-dim);">……还有${report.breakthroughs.length - 5}人突破</div>`;
    }
    
    // 婚姻
    if (report.marriages?.length > 0) {
      report.marriages.forEach(m => {
        html += `<div style="margin:4px 0;font-size:12px;">💍 ${m.groom}与${m.bride}喜结连理</div>`;
      });
    }
    
    // 道侣
    if (report.daoUnions?.length > 0) {
      report.daoUnions.forEach(d => {
        html += `<div style="margin:4px 0;font-size:12px;">🌸 ${d.person1}与${d.person2}结为道侣</div>`;
      });
    }
    
    showCustomModal('🌍 世界进展报告', html);
    
  } catch(e) {
    console.warn('[世界模拟] 展示报告失败:', e);
  }
}

// ==========================
// 更新时间戳（每次操作时调用）
// ==========================
function updateLastActiveTimestamp() {
  localStorage.setItem('weiwoduxian_last_active', Date.now().toString());
}

// ==========================
// 初始化离线监控（游戏加载时调用）
// ==========================
function initWorldSimulator() {
  // 1. 推演离线进度
  simulateOfflineProgress();
  
  // 2. 展示报告
  setTimeout(showOfflineReport, 800);
  
  // 3. 后台定时推演：每60秒推进1天
  setInterval(() => {
    try {
      if (npcManager && npcManager.npcs && G.player) {
        runWorldTimeLapse(1); // 推进1天
        updateLastActiveTimestamp();
      }
    } catch(e) {}
  }, 60000); // 每60秒推演1天
}

// 导出
window.simulateOfflineProgress = simulateOfflineProgress;
window.runWorldTimeLapse = runWorldTimeLapse;
window.initWorldSimulator = initWorldSimulator;
window.showOfflineReport = showOfflineReport;
window.updateLastActiveTimestamp = updateLastActiveTimestamp;
