// ==========================
// 🗺️ 寻宝指南系统 — 把"丹药不足"变成寻宝故事
// ==========================

// 场景名称映射（id → name）
const _getSceneName = (() => {
  const _cache = {};
  return function(id) {
    if (_cache[id]) return _cache[id];
    try {
      var sc = getSceneData(id);
      _cache[id] = sc ? sc.name : id;
    } catch(e) { _cache[id] = id; }
    return _cache[id];
  };
})();

// 构建物品来源索引
// 返回 { boss: [...], elite: [...], loot: [...], quest: [...], blackMarket: bool }
function getItemSources(itemId) {
  var result = { boss:[], elite:[], loot:[], quest:[], flavor:[], blackMarket:true };
  
  // 0. 物品名称
  var itemName = itemId;
  if (typeof ITEM_DB !== 'undefined') {
    var def = ITEM_DB.find(function(i){ return i.id === itemId; });
    if (def) itemName = def.name;
  }
  
  // 1. BOSS来源
  if (typeof BOSS_MONSTERS !== 'undefined') {
    for (var sceneId in BOSS_MONSTERS) {
      var boss = BOSS_MONSTERS[sceneId];
      if (boss.drops) {
        for (var di = 0; di < boss.drops.length; di++) {
          var d = boss.drops[di];
          if (d.itemId === itemId) {
            result.boss.push({
              sceneId: sceneId,
              sceneName: _getSceneName(sceneId),
              bossName: boss.name,
              chance: d.chance || 0,
              qty: d.qty || 1
            });
          }
        }
      }
    }
  }
  
  // 2. 精英模板来源
  if (typeof ELITE_TEMPLATES !== 'undefined') {
    for (var ei = 0; ei < ELITE_TEMPLATES.length; ei++) {
      var elite = ELITE_TEMPLATES[ei];
      if (elite.drops) {
        for (var dj = 0; dj < elite.drops.length; dj++) {
          var d2 = elite.drops[dj];
          if (d2.itemId === itemId) {
            result.elite.push({
              monsterName: elite.name,
              chance: d2.chance || 0,
              qty: d2.qty || 1
            });
          }
        }
      }
    }
  }
  
  // 3. 场景战利品来源
  if (typeof SCENE_LOOT_TABLES !== 'undefined') {
    for (var sId in SCENE_LOOT_TABLES) {
      var loots = SCENE_LOOT_TABLES[sId];
      if (!loots || !loots.length) continue;
      for (var li = 0; li < loots.length; li++) {
        var lt = loots[li];
        if (lt.itemId === itemId) {
          result.loot.push({
            sceneId: sId,
            sceneName: _getSceneName(sId),
            chance: lt.chance || 0,
            minQty: lt.min || 1,
            maxQty: lt.max || 1
          });
        }
      }
    }
  }
  
  // 4. 任务奖励
  if (typeof QUEST_DB !== 'undefined') {
    for (var qi2 = 0; qi2 < QUEST_DB.length; qi2++) {
      var q = QUEST_DB[qi2];
      if (!q || !q.rewards || !q.rewards.items) continue;
      var items = q.rewards.items;
      for (var ri = 0; ri < items.length; ri++) {
        var rii = items[ri];
        if (rii.id === itemId) {
          result.quest.push({
            questId: q.id,
            questName: q.name,
            giver: q.giver || '未知',
            sceneId: q.scene || null,
            sceneName: q.scene ? _getSceneName(q.scene) : null,
            qty: rii.qty || 1,
            repeatable: !!q.repeatable
          });
        }
      }
      // 也查 skillScroll 任务奖励
      if (q.rewards.skillScroll === itemId) {
        result.quest.push({
          questId: q.id,
          questName: q.name,
          giver: q.giver || '未知',
          sceneId: q.scene || null,
          sceneName: q.scene ? _getSceneName(q.scene) : null,
          qty: 1,
          repeatable: !!q.repeatable
        });
      }
      // 如果奖励不是 items 数组而是直接包含 skillScroll
      if (q.rewards.skillScroll && q.rewards.skillScroll === itemId && !items) {
        result.quest.push({
          questId: q.id,
          questName: q.name,
          giver: q.giver || '未知',
          sceneId: q.scene || null,
          sceneName: q.scene ? _getSceneName(q.scene) : null,
          qty: 1,
          repeatable: !!q.repeatable
        });
      }
    }
  }
  
  // 5. 场景专属战斗功法掉落（SCENE_SKILL_DROPS）
  if (typeof SCENE_SKILL_DROPS !== 'undefined') {
    for (var ssId in SCENE_SKILL_DROPS) {
      var ssEntry = SCENE_SKILL_DROPS[ssId];
      if (!ssEntry || !ssEntry.skills) continue;
      for (var ssk = 0; ssk < ssEntry.skills.length; ssk++) {
        if (ssEntry.skills[ssk].id === itemId) {
          result.flavor.push({
            sceneId: ssId,
            sceneName: _getSceneName(ssId),
            chance: ssEntry.skills[ssk].chance || 0
          });
        }
      }
    }
  }
  
  // 6. BOSS 和精英的 skillScroll 掉落
  if (typeof BOSS_MONSTERS !== 'undefined') {
    for (var bsId in BOSS_MONSTERS) {
      var boss2 = BOSS_MONSTERS[bsId];
      if (boss2.drops) {
        for (var dk = 0; dk < boss2.drops.length; dk++) {
          if (boss2.drops[dk].skillScroll === itemId) {
            result.boss.push({
              sceneId: bsId,
              sceneName: _getSceneName(bsId),
              bossName: boss2.name,
              chance: boss2.drops[dk].chance || 0,
              qty: 1
            });
          }
        }
      }
    }
  }
  
  return result;
}

// ==========================
// 🎯 生成寻宝故事
// ==========================
function getTreasureHuntStory(itemId, neededQty) {
  var itemName = itemId;
  if (typeof ITEM_DB !== 'undefined') {
    var itemDef = ITEM_DB.find(function(i){ return i.id === itemId; });
    if (itemDef) itemName = itemDef.name;
  }
  
  var sources = getItemSources(itemId);
  var lines = [];
  var hasHint = false;
  
  // 🔧 2026-08-04：该物品有丹方可炼 → 优先提示炼丹
  if (typeof DANFANG_DB !== 'undefined' && DANFANG_DB[itemId]) {
    var r = DANFANG_DB[itemId];
    var ingStr = r.ingredients.map(function(i) {
      var iname = (typeof ITEM_DB !== 'undefined') ? (function(){ var d = ITEM_DB.find(function(x){ return x.id === i.id; }); return d ? d.name : i.id; })() : i.id;
      return iname + '×' + i.qty;
    }).join('、');
    lines.push('─·──·──·──·──·──·─');
    lines.push('⚗️ 此物可炼！向「' + r.learnNpc + '」（' + (typeof getSceneName2 === 'function' ? getSceneName2(r.learnScene) : r.learnScene) + '）请教丹方：');
    lines.push('　' + r.name + ' = ' + ingStr);
    lines.push('　炼丹炉前备齐材料，以灵火炼之即可。');
    hasHint = true;
  }
  
  // BOSS猎杀
  if (sources.boss.length > 0) {
    lines.push('─·──·──·──·──·──·─');
    lines.push('👑 传说中……');
    sources.boss.forEach(function(b, idx){
      var chanceStr = b.chance >= 0.8 ? '必有' : (b.chance >= 0.5 ? '常有' : (b.chance >= 0.3 ? '偶尔有' : '据说有'));
      var story = idx === 0
        ? `　「${b.sceneName}」深处的「${b.bossName}」身上${chanceStr}${itemName}`
        : `　「${b.sceneName}」的「${b.bossName}」好像也带着${itemName}`;
      if (neededQty > 1 && b.qty) story += '，一次能找到约' + b.qty + '枚';
      lines.push(story);
    });
    lines.push('　去猎杀牠们，兴许有所收获。');
    hasHint = true;
  }
  
  // 精英掉落
  if (sources.elite.length > 0) {
    if (!hasHint) lines.push('─·──·──·──·──·──·─');
    lines.push('⚡ 听说某些变异的妖兽……');
    sources.elite.forEach(function(e){
      var chanceStr = e.chance >= 0.5 ? '常会携带' : '可能携带着';
      lines.push('　「' + e.monsterName + '」' + chanceStr + itemName + '。');
    });
    hasHint = true;
  }
  
  // 场景战利品（采集）
  if (sources.loot.length > 0) {
    if (!hasHint) lines.push('─·──·──·──·──·──·─');
    lines.push('🌿 四处走走，说不定……');
    sources.loot.forEach(function(l){
      lines.push('　「' + l.sceneName + '」的草木之间，隐藏着' + itemName + '。');
    });
    hasHint = true;
  }
  
  // 任务奖励
  if (sources.quest.length > 0) {
    if (!hasHint) lines.push('─·──·──·──·──·──·─');
    lines.push('📜 各个城镇的修士也许愿意交换……');
    sources.quest.forEach(function(q){
      var loc = q.sceneName ? '在「' + q.sceneName + '」' : '';
      var extra = q.repeatable ? '（可重复接取）' : '';
      lines.push('　' + loc + '接「' + q.questName + '」任务，' + q.giver + '愿以' + itemName + '作为报酬。' + extra);
    });
    hasHint = true;
  }
  
  // 黑市兜底
  if (hasHint) {
    lines.push('─·──·──·──·──·──·─');
    lines.push('💎 若实在寻不到……黑市的路子永远敞开，只是得付些灵石。');
  } else {
    // 没有任何信息来源 → 去向黑市
    lines.push('🌀 这种灵物极为罕见，恐怕只有黑市暗拍场才偶尔出现……准备好灵石吧。');
    lines.push('　或者去各处险境的深处碰碰运气——秘境之中常有意想不到的收获。');
  }
  
  return lines.join('\n');
}

// ==========================
// 📦 在黑市里找某个丹药
// ==========================
function getBlackMarketPrice(itemId) {
  if (typeof ITEM_DB === 'undefined') return null;
  var def = ITEM_DB.find(function(i){ return i.id === itemId; });
  if (!def) return null;
  return Math.round(def.value * (1.5 + Math.random() * 1.5)); // 溢价1.5~3倍
}

// ==========================
// 🚀 给突破失败——自动导航到最近的材料来源
// ==========================
function autoNavigateMissingItems() {
  var p = (typeof G !== 'undefined') ? G.player : null;
  if (!p) return;
  
  // 检查当前突破缺什么
  var missingIds = [];
  if (typeof QI_REALMS !== 'undefined' && typeof getCultivationProgress === 'function' && getCultivationProgress('qi') >= 100 && p.qiRealmIndex < QI_REALMS.length - 1) {
    if (typeof getQiBreakthroughReqs === 'function') {
      var qiReq = getQiBreakthroughReqs();
      if (qiReq && qiReq.items) {
        qiReq.items.forEach(function(r) {
          var owned = p.inventory.reduce(function(s, it) { return it.id === r.id ? s + (it.qty || 1) : s; }, 0);
          if (owned < r.qty) missingIds.push(r.id);
        });
      }
    }
  }
  if (typeof BODY_REALMS !== 'undefined' && typeof getCultivationProgress === 'function' && getCultivationProgress('body') >= 100 && p.bodyRealmIndex < BODY_REALMS.length - 1) {
    if (typeof getBodyBreakthroughReqs === 'function') {
      var bodyReq = getBodyBreakthroughReqs();
      if (bodyReq && bodyReq.items) {
        bodyReq.items.forEach(function(r) {
          var owned = p.inventory.reduce(function(s, it) { return it.id === r.id ? s + (it.qty || 1) : s; }, 0);
          if (owned < r.qty && missingIds.indexOf(r.id) === -1) missingIds.push(r.id);
        });
      }
    }
  }
  
  if (missingIds.length === 0) return;
  
  // 对每个缺失物品找最近的可达来源
  var bestTarget = null, bestDist = 9999;
  
  missingIds.forEach(function(id) {
    var sources = getItemSources(id);
    
    sources.boss.forEach(function(b) {
      if (!getSceneData) return;
      var sc = getSceneData(b.sceneId);
      if (sc && sc.dangerLevel > (p.qiRealmIndex || 0) * 1.5) return;
      var dist = typeof bfsPathTo === 'function' ? (bfsPathTo(b.sceneId) || []).length : 99;
      if (dist < bestDist) { bestDist = dist; bestTarget = { sceneId: b.sceneId, reason: b.bossName + '身上有宝' }; }
    });
    
    sources.loot.forEach(function(l) {
      var sc2 = getSceneData ? getSceneData(l.sceneId) : null;
      if (sc2 && sc2.dangerLevel > (p.qiRealmIndex || 0) * 1.5) return;
      var dist2 = typeof bfsPathTo === 'function' ? (bfsPathTo(l.sceneId) || []).length : 99;
      if (dist2 < bestDist) { bestDist = dist2; bestTarget = { sceneId: l.sceneId, reason: l.sceneName + '有灵物' }; }
    });
    
    sources.quest.forEach(function(q) {
      if (!q.sceneId) return;
      var sc3 = getSceneData ? getSceneData(q.sceneId) : null;
      if (sc3 && sc3.dangerLevel > (p.qiRealmIndex || 0) * 2) return;
      var dist3 = typeof bfsPathTo === 'function' ? (bfsPathTo(q.sceneId) || []).length : 99;
      if (dist3 < bestDist) { bestDist = dist3; bestTarget = { sceneId: q.sceneId, reason: q.questName + '报酬' }; }
    });
  });
  
  if (bestTarget && typeof walkOneStepToward === 'function') {
    // 同一目标场景冷却（避免每轮刷屏）
    if (G._lastNavTarget === bestTarget.sceneId && G._lastNavTime && Date.now() - G._lastNavTime < 30000) {
      return;
    }
    G._lastNavTarget = bestTarget.sceneId;
    G._lastNavTime = Date.now();
    G._navTarget = bestTarget.sceneId;
    walkOneStepToward(bestTarget.sceneId);
    var scName = _getSceneName(bestTarget.sceneId);
    addNarrative('💡 你打听到「' + scName + '」有你需要的东西——去那里碰碰运气。', 'event');
  }
}

// ==========================
// 🚀 给自动模式用的——缺少突破材料时前往目标场景
// ==========================
function autoNavigateToItemSource(itemId) {
  var sources = getItemSources(itemId);
  // 优先BOSS场景（确定性最高）
  if (sources.boss.length > 0) {
    var target = sources.boss[0];
    if (typeof G !== 'undefined' && typeof walkOneStepToward === 'function') {
      G._navTarget = target.sceneId;
      walkOneStepToward(target.sceneId);
      addNarrative('👣 你听说「' + target.sceneName + '」有' + target.bossName + '出没，或许能找到所需之物……', 'event');
      return true;
    }
  }
  // 其次战利品场景
  if (sources.loot.length > 0) {
    var target2 = sources.loot[0];
    if (typeof G !== 'undefined' && typeof walkOneStepToward === 'function') {
      G._navTarget = target2.sceneId;
      walkOneStepToward(target2.sceneId);
      addNarrative('👣 你前往「' + target2.sceneName + '」碰碰运气。', 'event');
      return true;
    }
  }
  // 最后任务场景
  if (sources.quest.length > 0) {
    var q = sources.quest[0];
    if (q.sceneId && typeof G !== 'undefined' && typeof walkOneStepToward === 'function') {
      G._navTarget = q.sceneId;
      walkOneStepToward(q.sceneId);
      addNarrative('👣 你听闻「' + q.sceneName + '」有任务可换取' + itemName + '，于是动身前往。', 'event');
      return true;
    }
  }
  return false;
}

// ==========================
// 导出
// ==========================
window.getItemSources = getItemSources;
window.getTreasureHuntStory = getTreasureHuntStory;
window.getBlackMarketPrice = getBlackMarketPrice;
window.autoNavigateToItemSource = autoNavigateToItemSource;
