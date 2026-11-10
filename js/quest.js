// === 唯我独仙 · 任务系统 v2 全量重写 ===
// 新特性：自动触发 / 任务链 / 世界状态 / 剧情文本 / 进阶UI

// ==========================
// 1. 初始化玩家任务数据
// ==========================
function initQuestData(p) {
  if (!p) return;
  if (!p.activeQuests) p.activeQuests = [];
  if (!p.completedQuests) p.completedQuests = [];
  if (!p.worldState) p.worldState = {};
  if (!p.questFlags) p.questFlags = {};
  
  // ── 存量清理：去重（防止历史存档残留重复任务id）──
  if (Array.isArray(p.activeQuests)) {
    const seen = new Set();
    p.activeQuests = p.activeQuests.filter(aq => {
      if (!aq || !aq.id || seen.has(aq.id)) return false;
      seen.add(aq.id);
      return true;
    });
  }
  if (Array.isArray(p.completedQuests)) {
    p.completedQuests = [...new Set(p.completedQuests.filter(id => id))];
  }
}

// ==========================
// 获取任务数据库
// ==========================
function getQuestDB() {
  return typeof EXTENDED_QUEST_DB !== 'undefined' ? EXTENDED_QUEST_DB : 
         (typeof QUEST_DB !== 'undefined' ? QUEST_DB : []);
}

// ==========================
// 获取可接任务（原版增强：worldState条件）
// ==========================
function getAvailableQuests() {
  const p = G.player;
  initQuestData(p);
  const db = getQuestDB();
  const seenIds = new Set();
  return db.filter(q => {
    if (!q || !q.id) return false;               // 跳过残缺任务（无id）
    if (seenIds.has(q.id)) return false;         // 去重：同一id只显示一次
    seenIds.add(q.id);
    if (q.hidden) return false; // 隐藏任务需要通过autoTrigger才能接
    if (!q.showInList && q.showInList !== undefined) return false;
    if (p.activeQuests.find(aq => aq.id === q.id)) return false;
    if (p.completedQuests.includes(q.id) && !q.repeatable) return false;
    if (q.prerequisite && !p.completedQuests.includes(q.prerequisite)) return false;
    // 🔧 境界引导任务（realmBreak）：必须与当前境界匹配（差≤2级），太低接不了、太高视为过时
    if (q.autoTrigger === 'realmBreak' && q.triggerRealm !== undefined) {
      const realmIdx = p.qiRealmIndex || 0;
      const diff = realmIdx - (q.triggerRealm - 1);
      if (diff > 2 || diff < -2) return false;
    }
    if (q.scene && q.scene !== G.currentScene) return false;
    // 世界状态前置条件
    if (q.worldStateReq) {
      for (const [key, val] of Object.entries(q.worldStateReq)) {
        if ((p.worldState || {})[key] !== val) return false;
      }
    }
    return true;
  });
}

// ==========================
// 获取活跃任务
// ==========================
function getActiveQuests() {
  initQuestData(G.player);
  return G.player.activeQuests;
}

// ==========================
// 2. 接受任务
// ==========================
function acceptQuest(questId, silent) {
  const p = G.player;
  initQuestData(p);
  const db = getQuestDB();
  const quest = db.find(q => q.id === questId);
  if (!quest) { addNarrative('查无此任务。', 'system'); return false; }
  if (p.activeQuests.find(q => q.id === questId)) return false;
  
  p.activeQuests.push({ 
    id: questId, 
    acceptedAt: G.time.day || 1,
    progress: { items: {}, kills: {}, explored: false, stages: {} }
  });
  
  if (!silent) {
    addNarrative(`📋 接受任务：${quest.name}`, 'event');
    if (quest.acceptText) addNarrative(quest.acceptText, 'narr-default');
  }
  updateAllUI();
  return true;
}

// ==========================
// 3. 检查任务进度（增强版）
// ==========================
function checkQuestProgress() {
  const p = G.player;
  if (!p.activeQuests || p.activeQuests.length === 0) return;
  const db = getQuestDB();
  
  // 去重：同一任务 id 只检查一次（防历史存档残留重复）
  const seenIds = new Set();
  p.activeQuests.forEach(aq => {
    if (seenIds.has(aq.id)) return;
    seenIds.add(aq.id);
    const quest = db.find(q => q.id === aq.id);
    if (!quest) return;
    if (!quest.requirements) return;
    
    let completed = true;
    const req = quest.requirements;
    
    // 物品收集
    if (req.items) {
      req.items.forEach(r => {
        const owned = p.inventory.reduce((sum, it) => it.id === r.id ? sum + (it.qty || 1) : sum, 0);
        if (owned < r.qty) completed = false;
      });
    }
    
    // 击杀
    if (req.kills) {
      req.kills.forEach(r => {
        const kc = p.killLog ? (p.killLog[r.monster] || 0) : 0;
        if (kc < r.qty) completed = false;
      });
    }
    
    // 探索
    if (req.explore) {
      // 宽容判定：人在目标场景 OR 已经标记过 → 算完成
      if (G.currentScene === req.explore && !aq.progress.explored) {
        aq.progress.explored = true; // 立即标记，防止在场景内反复不完成
      }
      if (G.currentScene !== req.explore && !aq.progress.explored) completed = false;
    }
    
    // 境界
    if (req.realm) {
      const realmIdx = req.realm;
      if (p.qiRealmIndex < realmIdx) completed = false;
    }
    
    // 阶段进度（多阶段任务）
    if (req.stages) {
      req.stages.forEach((stage, idx) => {
        if (!aq.progress.stages) aq.progress.stages = {};
        if (!aq.progress.stages[idx] && !stage.optional) completed = false;
        // 每个阶段也可以有子条件
        if (!aq.progress.stages[idx] && stage.autoComplete) {
          const sc = stage.condition;
          if (sc) {
            if (sc.kills && p.killLog && p.killLog[sc.kills] >= (sc.qty || 1)) {
              aq.progress.stages[idx] = true;
              if (stage.completeText) addNarrative(stage.completeText, 'narr-default');
            }
          }
        }
      });
    }
    
    if (completed) {
      completeQuest(quest);
    }
  });
}

// ==========================
// 4. 完成任务（增强版：世界状态 + 连锁任务）
// ==========================
function completeQuest(quest) {
  const p = G.player;
  initQuestData(p);
  
  // 扣物品
  const req = quest.requirements;
  if (req && req.items) {
    req.items.forEach(r => {
      for (let i = 0; i < r.qty; i++) {
        const idx = p.inventory.findIndex(it => it.id === r.id);
        if (idx >= 0) {
          p.inventory[idx].qty--;
          if (p.inventory[idx].qty <= 0) p.inventory.splice(idx, 1);
        }
      }
    });
  }
  
  // 发放奖励
  const r = quest.rewards;
  // ☯️ 因果业力：助人任务积功德，讨伐任务两清
  const qType = quest.type || '';
  if (typeof changeKarma === 'function') {
    if (['收集', '寻物', '护送', '救人', '帮助'].some(t => qType.includes(t) || (quest.desc || '').includes(t))) {
      changeKarma(3, '助人（' + quest.name + '）');
    }
  }
  // 🌟 名声：完成任务扬名
  if (typeof fameOnQuest === 'function') fameOnQuest(quest);
  if (r) {
    if (r.stones) p.stones += r.stones;
    if (r.mood) p.mood = Math.min(100, p.mood + r.mood);
    if (r.exp) {
      if (typeof gainCultivation === 'function') gainCultivation('qi', r.exp);
      else p.qiCultivationPoints += r.exp;
      if (typeof qiBreakthroughCheck === 'function') qiBreakthroughCheck();
    }
    if (r.bodyExp) {
      if (typeof gainCultivation === 'function') gainCultivation('body', r.bodyExp);
      else p.bodyCultivationPoints = (p.bodyCultivationPoints || 0) + r.bodyExp;
    }
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
    if (r.questKey) {
      // 仅当对应秘境真实存在时授予（防孤儿questKey误导玩家）
      var _srDb = typeof SECRET_REALMS !== 'undefined' ? SECRET_REALMS : {};
      var _srExists = Object.values(_srDb).some(function(sr) { return sr.neededKey === r.questKey; });
      if (_srExists) {
        if (!p.unlockedRealms) p.unlockedRealms = [];
        if (!p.unlockedRealms.includes(r.questKey)) {
          p.unlockedRealms.push(r.questKey);
          addNarrative(`🔑 你获得了秘境通行证：${r.questKey}（在地图上前往对应场景，点击秘境入口即可探索）`, 'event');
        }
      }
    }
  }
  
  // 世界状态变更
  if (quest.worldStateChange) {
    if (!p.worldState) p.worldState = {};
    Object.assign(p.worldState, quest.worldStateChange);
  }
  
  // 移出活跃
  p.activeQuests = p.activeQuests.filter(q => q.id !== quest.id);
  if (!p.completedQuests.includes(quest.id)) p.completedQuests.push(quest.id);
  
  // 完成文本 + 丰厚奖励通知
  const rewardText = buildQuestRewardText(quest);
  let rewardLines = [];
  if (r.stones) rewardLines.push(`💰 灵石 +${r.stones}`);
  if (r.exp) rewardLines.push(`📖 修为 +${r.exp}`);
  if (r.bodyExp) rewardLines.push(`💪 体魄 +${r.bodyExp}`);
  if (r.mood) rewardLines.push(`😌 心境 +${r.mood}`);
  if (r.skillScroll) {
    const skill = (typeof SKILL_DB !== 'undefined' ? SKILL_DB : []).find(s => s.id === r.skillScroll);
    if (skill) rewardLines.push(`📜 功法「${skill.name}」`);
  }
  if (r.items) {
    r.items.forEach(item => {
      const itemData = (typeof ITEM_DB !== 'undefined' ? ITEM_DB : []).find(i => i.id === item.id);
      rewardLines.push(`📦 ${itemData ? itemData.name : item.id} ×${item.qty}`);
    });
  }
  
  // 获取品质色（根据任务类型决定）
  const isChain = !!quest.chain;
  const isMain = quest.type === '剧情' || quest.type === '讨伐';
  const cardTitle = isChain ? '⚡ 任务完成 · 剧情推进' : '✅ 任务完成';
  
  addNarrative(`<div class="quest-complete-card">
<div style="display:flex;align-items:center;gap:6px;"><span style="font-size:20px;">🎉</span><span style="font-weight:bold;font-size:15px;color:${isMain ? '#c9a96e' : '#8cc'};">${quest.name}</span></div>
<div style="font-size:11px;color:var(--text-dim);margin:4px 0;">${quest.completeText || '任务圆满完成'}</div>
<div style="border-top:1px solid rgba(255,255,255,0.1);padding-top:6px;margin-top:4px;">
${rewardLines.map(l => `<span style="display:inline-block;font-size:11px;margin:2px 4px 2px 0;background:rgba(255,255,255,0.05);padding:2px 6px;border-radius:3px;">${l}</span>`).join('')}
</div>
</div>`, 'milestone');
  
  recalcStats(p);
  updateAllUI();
  
  // 连锁任务：自动接下一个
  if (quest.chain) {
    setTimeout(() => {
      const nextId = quest.chain;
      const db = getQuestDB();
      const nextQ = db.find(q => q.id === nextId);
      if (nextQ && !p.activeQuests.find(q => q.id === nextId) && !p.completedQuests.includes(nextId)) {
        acceptQuest(nextId, true);
        addNarrative(`💬 "${nextQ.acceptText || nextQ.desc}"`, 'narr-default');
        addNarrative(`📋 新任务已自动接受：${nextQ.name}`, 'event');
        updateAllUI();
      }
    }, 500);
  }
}

// ==========================
// 5. 自动触发任务系统 ⭐
// ==========================

// 5a. 进入场景触发器
function checkSceneQuestTriggers(sceneId) {
  const p = G.player;
  initQuestData(p);
  const db = getQuestDB();
  
  const seenIds = new Set();
  db.forEach(q => {
    if (seenIds.has(q.id)) return;
    seenIds.add(q.id);
    if (q.autoTrigger !== 'enterScene') return;
    if (q.triggerScene && q.triggerScene !== sceneId) return;
    if (p.activeQuests.find(aq => aq.id === q.id)) return;
    if (p.completedQuests.includes(q.id) && !q.repeatable) return;
    
    // 检查前置
    if (q.prerequisite && !p.completedQuests.includes(q.prerequisite)) return;
    // 检查世界状态
    if (q.worldStateReq) {
      for (const [key, val] of Object.entries(q.worldStateReq)) {
        if ((p.worldState || {})[key] !== val) return;
      }
    }
    
    // 触发！
    acceptQuest(q.id, true);
    addNarrative(`💡 ${q.triggerText || ('你发现了一些线索——' + q.name)}`, 'narr-event');
    addNarrative(`📋 新任务：${q.name}`, 'event');
  });
  
  // 同步检查任务进度（可能任务在此场景可完成）
  recordExplore(sceneId);
  checkQuestProgress();
}

// 5b. 境界突破触发器
function checkRealmQuestTriggers(oldRealmIdx, newRealmIdx) {
  const p = G.player;
  initQuestData(p);
  const db = getQuestDB();
  
  const seenIds = new Set();
  db.forEach(q => {
    if (seenIds.has(q.id)) return;
    seenIds.add(q.id);
    if (q.autoTrigger !== 'realmBreak') return;
    if (q.triggerRealm === undefined || q.triggerRealm === null) return;
    if (newRealmIdx < q.triggerRealm) return;
    // 🔧 境界引导任务防“补发过期任务”：境界远超任务触发境界（>2级）说明早已过时，不再补发
    //   例：金丹期(13)不再补发凡尘界(3)/幽冥界(3)的新手引导，只补发相邻境界的引导（天域10/12）
    if (newRealmIdx - q.triggerRealm > 2) return;
    if (p.activeQuests.find(aq => aq.id === q.id)) return;
    if (p.completedQuests.includes(q.id) && !q.repeatable) return;
    if (q.prerequisite && !p.completedQuests.includes(q.prerequisite)) return;
    
    acceptQuest(q.id, true);
    addNarrative(`💡 ${q.triggerText || ('突破之后，你想起了什么——' + q.name)}`, 'narr-event');
    addNarrative(`📋 新任务：${q.name}`, 'event');
  });
}

// 5c. 收集物品触发器
function checkItemQuestTriggers(itemId) {
  const p = G.player;
  initQuestData(p);
  const db = getQuestDB();
  
  const seenIds = new Set();
  db.forEach(q => {
    if (seenIds.has(q.id)) return;
    seenIds.add(q.id);
    if (q.autoTrigger !== 'itemCollect') return;
    if (q.triggerItem && q.triggerItem !== itemId) return;
    if (p.activeQuests.find(aq => aq.id === q.id)) return;
    if (p.completedQuests.includes(q.id) && !q.repeatable) return;
    if (q.prerequisite && !p.completedQuests.includes(q.prerequisite)) return;
    
    acceptQuest(q.id, true);
    addNarrative(`💡 ${q.triggerText || ('你端详着手中的物品，似乎牵涉到某个秘密——' + q.name)}`, 'narr-event');
    addNarrative(`📋 新任务：${q.name}`, 'event');
  });
}

// 5d. 时间推进触发器（每天检查）
function checkTimeQuestTriggers() {
  const p = G.player;
  initQuestData(p);
  const db = getQuestDB();
  
  const seenIds = new Set();
  db.forEach(q => {
    if (seenIds.has(q.id)) return;
    seenIds.add(q.id);
    if (q.autoTrigger !== 'timePass') return;
    if (!q.triggerDay) return;
    if ((G.time.day || 0) < q.triggerDay) return;
    if (p.activeQuests.find(aq => aq.id === q.id)) return;
    if (p.completedQuests.includes(q.id) && !q.repeatable) return;
    if (q.prerequisite && !p.completedQuests.includes(q.prerequisite)) return;
    if (q.worldStateReq) {
      for (const [key, val] of Object.entries(q.worldStateReq)) {
        if ((p.worldState || {})[key] !== val) return;
      }
    }
    
    acceptQuest(q.id, true);
    addNarrative(`💡 ${q.triggerText || ('时间一天天过去，新的消息传来——' + q.name)}`, 'narr-event');
    addNarrative(`📋 新任务：${q.name}`, 'event');
  });
}

// ==========================
// 6. 任务UI：日志面板
// ==========================
function showQuestLog() {
  const p = G.player;
  initQuestData(p);
  const db = getQuestDB();
  
  let html = '';
  
  // ── 活跃任务 ──
  if (p.activeQuests.length > 0) {
    html += '<div style="margin-bottom:8px;"><div style="font-weight:bold;font-size:13px;margin-bottom:6px;">📋 进行中的任务</div>';
    p.activeQuests.forEach(aq => {
      const quest = db.find(q => q.id === aq.id);
      if (!quest) return;
      html += renderQuestCard(quest, aq);
    });
    html += '</div>';
  } else {
    html += '<div style="color:var(--text-dim);text-align:center;padding:12px;">暂无进行中的任务</div>';
  }
  
  // ── 已完成任务 ──
  if (p.completedQuests.length > 0) {
    html += '<div style="border-top:1px solid rgba(255,255,255,0.08);padding-top:6px;margin-top:4px;">';
    html += '<div style="font-weight:bold;font-size:12px;margin-bottom:4px;color:var(--text-dim);">✅ 已完成 (' + p.completedQuests.length + ')</div>';
    html += '<div style="display:flex;flex-wrap:wrap;gap:4px;">';
    p.completedQuests.forEach(qId => {
      const quest = db.find(q => q.id === qId);
      if (quest) {
        html += `<span style="font-size:10px;background:rgba(100,200,100,0.15);color:#6a6;padding:2px 6px;border-radius:3px;">${quest.name}</span>`;
      }
    });
    html += '</div></div>';
  }
  
  showCustomModal('📋 任务日志', html + '<button class="event-choice-btn" onclick="closeEvent()">关闭</button>');
}

// ==========================
// 任务传送系统（灵石消耗版）
// ==========================

// 获取传送到某场景所需的灵石
function getQuestTeleportCost(sceneId, quest) {
  // 任务指定费用优先
  if (quest && quest.teleportCost !== undefined) return quest.teleportCost;
  
  // 按场景距离/危险度分级
  const costMap = {
    'qingyun_zhen':     20,
    'luoxia_senlin':    30,
    'lingyun_feng':     40,
    'lingyao_yuan':     40,
    'duzhang_zhaoze':   50,
    'yigui_yiji':       50,
    'bingfeng_shiku':   60,
    'jianmu_shenchu':   80,
    'xumi_kongjian':    80,
    'tianzhu_feng':     100,
    'huangquan_lu':     100,
    'zhongnan_mishijing': 120,
  };
  return costMap[sceneId] || 50; // 默认50灵石
}

// 自动获取任务的目标场景（从 requirements.explore 或 kills 关联场景推断）
function getQuestTargetScene(quest) {
  if (!quest) return null;
  // 优先使用显式设置
  if (quest.targetScene) return quest.targetScene;
  // 从探索需求推断
  const req = quest.requirements;
  if (req && req.explore) return req.explore;
  // 从触发场景推断
  if (quest.triggerScene) return quest.triggerScene;
  return null;
}

// 快捷获取场景名称（quest 内部用；全局增强版在 engine.js 的 getSceneDisplayName）
function getQuestSceneName(sceneId) {
  if (!sceneId) return '目标地点';
  const sd = getSceneData(sceneId);
  return sd ? sd.name : sceneId;
}

// 任务传送（扣灵石）
function questTeleport(sceneId, e) {
  if (e) e.stopPropagation();
  
  const p = G.player;
  if (!p) return;
  
  // 查找当前玩家是否有任务指向此场景，以使用任务特定费用
  const db = getQuestDB();
  const linkedQuest = db.find(q => getQuestTargetScene(q) === sceneId && p.activeQuests.find(aq => aq.id === q.id));
  const cost = getQuestTeleportCost(sceneId, linkedQuest);
  const scName = getQuestSceneName(sceneId);
  
  if (p.stones < cost) {
    addNarrative(`❌ 灵石不够！传送至${scName}需要 ${cost} 灵石，你只有 ${p.stones} 块。先去赚点灵石吧。`, 'system');
    return;
  }
  
  p.stones -= cost;
  if (typeof closeEvent === 'function') closeEvent();
  if (typeof moveToScene === 'function') {
    moveToScene(sceneId);
    addNarrative(`🚀 你缴纳 ${cost} 灵石催动传送阵，灵光一闪已身在${scName}。`, 'event');
  }
  updateAllUI();
}

function renderQuestCard(quest, activeQuest) {
  const req = quest.requirements || {};
  let progressHtml = '';
  
  if (req.items) {
    req.items.forEach(r => {
      const owned = G.player.inventory.reduce((sum, it) => it.id === r.id ? sum + (it.qty || 1) : sum, 0);
      const itemName = (typeof ITEM_DB !== 'undefined' ? ITEM_DB.find(i => i.id === r.id)?.name : null) || r.id;
      progressHtml += `<span style="color:${owned >= r.qty ? '#6a6' : 'var(--text-dim)'}">📦 ${itemName} ${owned}/${r.qty}</span> `;
    });
  }
  if (req.kills) {
    req.kills.forEach(r => {
      const kc = (G.player.killLog || {})[r.monster] || 0;
      progressHtml += `<span style="color:${kc >= r.qty ? '#6a6' : 'var(--text-dim)'}">⚔️ ${r.monster} ${kc}/${r.qty}</span> `;
    });
  }
  if (req.explore) {
    const done = activeQuest.progress.explored || G.currentScene === req.explore;
    const sceneName = getSceneData(req.explore)?.name || req.explore;
    progressHtml += `<span style="color:${done ? '#6a6' : 'var(--text-dim)'}">📍 ${sceneName} ${done ? '✓' : '未探索'}</span> `;
  }
  if (req.realm !== undefined) {
    const done = G.player.qiRealmIndex >= req.realm;
    progressHtml += `<span style="color:${done ? '#6a6' : 'var(--text-dim)'}">🆙 境界≥练气${req.realm+1}层 ${done ? '✓' : ''}</span> `;
  }
  
  // 阶段进度
  if (req.stages) {
    const stages = activeQuest.progress.stages || {};
    req.stages.forEach((stage, idx) => {
      progressHtml += `<span style="color:${stages[idx] ? '#6a6' : 'var(--text-dim)'}">📌 ${stage.label||('阶段'+(idx+1))} ${stages[idx]?'✓':'…'}</span> `;
    });
  }
  
  const rewardText = buildQuestRewardText(quest);
  
  // 传送按钮（自动推断目标场景）
  let teleportBtn = '';
  const targetSc = getQuestTargetScene(quest);
  if (targetSc && targetSc !== G.currentScene) {
    const scName = getQuestSceneName(targetSc);
    const tCost = getQuestTeleportCost(targetSc, quest);
    teleportBtn = `<button class="event-choice-btn" onclick="questTeleport('${targetSc}', event)" style="font-size:10px;padding:3px 8px;margin-top:4px;">🚀 传送·${scName}（${tCost}灵石）</button>`;
  }
  
  return `<div style="border:1px solid rgba(255,255,255,0.1);border-radius:6px;padding:8px;margin-bottom:6px;">
    <div style="font-weight:bold;font-size:13px;">${quest.name}</div>
    <div style="font-size:10px;color:var(--text-dim);margin:2px 0;">${quest.desc}</div>
    ${progressHtml ? '<div style="font-size:10px;display:flex;flex-wrap:wrap;gap:2px 6px;margin:3px 0;">' + progressHtml + '</div>' : ''}
    <div style="font-size:10px;color:var(--accent);margin-top:2px;">🏆 ${rewardText}</div>
    ${teleportBtn}
    ${quest.giver ? '<div style="font-size:9px;color:var(--text-dim);">👤 委托人：' + quest.giver + '</div>' : ''}
  </div>`;
}

function buildQuestRewardText(quest) {
  const r = quest.rewards;
  if (!r) return '未知';
  const parts = [];
  if (r.stones) parts.push(r.stones + '灵石');
  if (r.exp) parts.push(r.exp + '修为');
  if (r.bodyExp) parts.push(r.bodyExp + '体魄');
  if (r.skillScroll) {
    const skill = (typeof SKILL_DB !== 'undefined' ? SKILL_DB : []).find(s => s.id === r.skillScroll);
    parts.push('功法·' + (skill ? skill.name : r.skillScroll));
  }
  if (r.questKey) parts.push('🔑通行证');
  if (r.items) parts.push(r.items.map(i => (i.name||i.id) + '×' + i.qty).join('+'));
  return parts.join('、') || '经验';
}

// ==========================
// 7. NPC任务弹窗（增强版）
// ==========================
function showQuestGiverModal(npcName) {
  const available = getAvailableQuests();
  const questsForGiver = available.filter(q => q.giver === npcName);
  
  checkQuestProgress();
  
  if (questsForGiver.length === 0) {
    // 检查是否有进行中任务可提交
    const activeQuest = (G.player.activeQuests || []).find(q => {
      const quest = getQuestDB().find(dbq => dbq.id === q.id);
      return quest && quest.giver === npcName;
    });
    if (activeQuest) {
      checkQuestProgress();
      addNarrative(`你向${npcName}汇报了任务进展。`, 'narr-default');
      return;
    }
    
    // 检查是否npc有世界状态的对话
    showCustomModal(`💬 ${npcName}`,
      `<div style="font-size:12px;color:var(--text-dim);padding:12px;">暂无委托。</div>` +
      `<button class="event-choice-btn" onclick="closeEvent()">离开</button>`
    );
    return;
  }
  
  checkQuestProgress();
  
  let html = `<div style="margin-bottom:8px;font-size:12px;">`;
  
  // NPC开场白
  if (questsForGiver[0].giverLine) {
    html += `<div style="background:rgba(255,255,255,0.05);border-radius:6px;padding:8px;margin-bottom:8px;font-style:italic;color:var(--text-dim);">
      "${questsForGiver[0].giverLine}"<br>
      <span style="font-size:10px;">—— ${npcName}</span>
    </div>`;
  }
  
  questsForGiver.forEach(q => {
    const rewardText = buildQuestRewardText(q);
    let teleportHint = '';
    const tScene = getQuestTargetScene(q);
    if (tScene && tScene !== G.currentScene) {
      const scName = getQuestSceneName(tScene);
      const tCost = getQuestTeleportCost(tScene, q);
      teleportHint = `<div style="font-size:9px;color:var(--accent);margin-top:3px;">📍 ${scName} <span onclick="event.stopPropagation();closeEvent();questTeleport('${tScene}', event)" style="cursor:pointer;text-decoration:underline;">🚀 传送（${tCost}灵石）</span></div>`;
    }
    html += `<div style="border:1px solid rgba(255,255,255,0.12);border-radius:6px;padding:8px;margin-bottom:6px;cursor:pointer;transition:all 0.2s;"
      onmouseover="this.style.borderColor='var(--accent)'" onmouseout="this.style.borderColor='rgba(255,255,255,0.12)'"
      onclick="acceptQuest('${q.id}');closeEvent();">
      <div style="font-weight:bold;font-size:13px;">📋 ${q.name}</div>
      <div style="font-size:11px;color:var(--text-dim);margin:4px 0;">${q.desc}</div>
      ${teleportHint}
      <div style="display:flex;justify-content:space-between;font-size:10px;">
        <span style="color:var(--accent);">🏆 ${rewardText}</span>
        <span style="color:var(--text-dim);">${q.type||'委托'}</span>
      </div>
    </div>`;
  });
  
  showCustomModal(`📋 ${npcName}的委托`, html + `<button class="event-choice-btn" onclick="closeEvent()">离开</button>`);
}

// ==========================
// 8. 击杀/探索记录（保持兼容）
// ==========================
function recordKill(monsterName) {
  const p = G.player;
  if (!p.killLog) p.killLog = {};
  p.killLog[monsterName] = (p.killLog[monsterName] || 0) + 1;
  checkQuestProgress();
}

function recordExplore(sceneId) {
  const p = G.player;
  if (!p.activeQuests) return;
  p.activeQuests.forEach(aq => {
    const quest = getQuestDB().find(q => q.id === aq.id);
    if (quest && quest.requirements && quest.requirements.explore === sceneId) {
      aq.progress.explored = true;
    }
    // 场景触发任务（初次进入）
    if (!aq.progress._enteredScene) aq.progress._enteredScene = {};
    if (quest && quest.requirements && quest.requirements.sceneVisit === sceneId) {
      aq.progress._enteredScene[sceneId] = true;
    }
  });
  checkQuestProgress();
}

// ==========================
// 9. 世界状态管理
// ==========================
function setWorldState(key, value) {
  const p = G.player;
  if (!p.worldState) p.worldState = {};
  p.worldState[key] = value;
}

function getWorldState(key) {
  const p = G.player;
  if (!p.worldState) return undefined;
  return p.worldState[key];
}

// ==========================
// 10. 导出
// ==========================
window.initQuestData = initQuestData;
window.getAvailableQuests = getAvailableQuests;
window.getActiveQuests = getActiveQuests;
window.acceptQuest = acceptQuest;
window.checkQuestProgress = checkQuestProgress;
window.completeQuest = completeQuest;
window.showQuestGiverModal = showQuestGiverModal;
window.showQuestLog = showQuestLog;
window.recordKill = recordKill;
window.recordExplore = recordExplore;
window.checkSceneQuestTriggers = checkSceneQuestTriggers;
window.checkRealmQuestTriggers = checkRealmQuestTriggers;
window.checkItemQuestTriggers = checkItemQuestTriggers;
window.checkTimeQuestTriggers = checkTimeQuestTriggers;
window.setWorldState = setWorldState;
window.getWorldState = getWorldState;
window.buildQuestRewardText = buildQuestRewardText;
window.questTeleport = questTeleport;
window.getQuestTeleportCost = getQuestTeleportCost;
window.getQuestTargetScene = getQuestTargetScene;
// window 导出移除：与 engine.js 全局增强版冲突（2026-08-05）
