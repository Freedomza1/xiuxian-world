// === 唯我独仙 · 世界事件系统 v1 ===
// 持续性事件：天数触发、多场景影响、UI展示、挂钩战斗/探索/修炼

// ==========================
// 📋 事件模板库
// ==========================
const WORLD_EVENT_TEMPLATES = [
  // ── 兽潮 ──
  { id:'beast_tide_1', type:'兽潮', tier:1, name:'低阶兽潮', duration:3,
    desc:'附近妖兽因不明原因暴动，四处袭击过往修士。野外战斗概率翻倍，怪物强度略有提升。',
    triggers:{ minDay:3, chance:0.08, maxActive:2 },
    effects:{ encounterMult:2.0, monsterAtkMult:1.1, monsterHpMult:1.1, lootMult:1.2 },
    narrative:'这几天风声不对，镇上的猎人都不太敢出远门——有人在深林里看到了成群结队的妖兽。',
  },
  { id:'beast_tide_2', type:'兽潮', tier:2, name:'兽潮·汹涌', duration:5,
    desc:'大量妖兽从深山中涌出，攻势如潮！已有多处村镇受袭。野外战斗概率提升三倍，怪物显著变强，但战利品也更丰厚。',
    triggers:{ minDay:15, chance:0.06, maxActive:1 },
    effects:{ encounterMult:3.0, monsterAtkMult:1.25, monsterHpMult:1.3, lootMult:1.5 },
    narrative:'远处传来沉闷的兽吼，此起彼伏，像浪潮一样逼近。空气中弥漫着不安的气息，山间鸟兽四散奔逃。',
  },
  { id:'beast_tide_3', type:'兽潮', tier:3, name:'兽潮·天灾', duration:7,
    desc:'妖兽王者出世，率领千万凶兽席卷大地！大地震颤，万兽奔腾。野外每走一步都可能遇敌，但也是猎取稀有材料的天赐良机。',
    triggers:{ minDay:60, chance:0.03, maxActive:1 },
    effects:{ encounterMult:5.0, monsterAtkMult:1.5, monsterHpMult:1.6, lootMult:2.0 },
    narrative:'天边涌来一片黑云——不，那不是云，是铺天盖地的妖兽群！大地在它们的蹄下震颤，远山的树木成片倒塌。一场浩劫，也是一场盛宴。',
  },

  // ── 灵潮 ──
  { id:'spirit_tide_1', type:'灵潮', tier:1, name:'灵气潮汐', duration:4,
    desc:'天地间灵气忽然变得浓郁起来，修炼事半功倍。野外灵草的生长也加速了。',
    triggers:{ minDay:5, chance:0.1, maxActive:2 },
    effects:{ cultSpeed:1.3, herbFindBonus:0.3 },
    narrative:'风停了。空气中有一种奇异的清冽感，仿佛整个世界的灵气都在缓缓上涌。深吸一口，连经脉都微微震颤。',
  },
  { id:'spirit_tide_2', type:'灵潮', tier:2, name:'灵潮涌动', duration:5,
    desc:'灵气如潮水般一波波涌来，修炼速度大幅提升。可在此间捕捉天地灵韵，感悟功法事半功倍。',
    triggers:{ minDay:20, chance:0.06, maxActive:1 },
    effects:{ cultSpeed:1.6, herbFindBonus:0.5, skillMasteryBonus:0.4 },
    narrative:'灵气浓得几乎化作了雾！每走一步，灵雾便在足边翻滚。丹田如同干涸的海绵，疯狂地吸收着这天地馈赠。',
  },
  { id:'spirit_tide_3', type:'灵潮', tier:3, name:'天地异象·灵泉喷涌', duration:6,
    desc:'大地深处灵脉喷发，灵气浓郁到化为液态！修炼速度暴涨。更有传说中的灵物可能在此间现世。',
    triggers:{ minDay:80, chance:0.025, maxActive:1 },
    effects:{ cultSpeed:2.5, herbFindBonus:1.0, skillMasteryBonus:0.8, rareFindBonus:0.5 },
    narrative:'异象！天穹之上，灵气凝成了五彩的极光，如绸缎般飘舞。大地的裂缝中涌出乳白色的灵液——那是传说中的地脉灵乳！',
  },

  // ── 遗迹现世 ──
  { id:'ruins_appear_1', type:'遗迹', tier:1, name:'古修洞府现世', duration:6,
    desc:'某处山脉中，一座尘封已久的古修洞府因地震现世。里面有未知的功法和宝物，但禁制还在缓慢消散中。',
    triggers:{ minDay:10, chance:0.05, maxActive:1 },
    effects:{ newSceneUnlocked:'guji_ruins', lootMult:1.3 },
    explorable:true,
    narrative:'几声闷雷般的巨响从深山中传来。第二天，有采药人在山坳里发现了一个被藤蔓掩盖的石门，门缝里有光透出。',
  },
  { id:'ruins_appear_2', type:'遗迹', tier:2, name:'上古秘境·天梯浮空', duration:8,
    desc:'天空中浮现出一座倒悬的山峰，云雾缭绕间可见古老的殿宇。那是上古大能留下的试炼之地，据说通关者可得传承。',
    triggers:{ minDay:40, chance:0.03, maxActive:1 },
    effects:{ trialTowerExtraFloors:10, skillLootBonus:0.3 },
    explorable:true,
    narrative:'那天夜里，所有人都看到了——月亮旁边多了一座倒悬的山。山上有灯火，有飞瀑倒流而上。老人们跪地叩首，说是天宫开了。',
  },

  // ── 散仙论道 ──
  { id:'sages_gathering', type:'论道', tier:1, name:'散仙论道', duration:2,
    desc:'几位游方散仙在青云镇外的茶摊落脚，谈论修行心得。和他们交谈能获得宝贵的修炼经验。',
    triggers:{ minDay:7, chance:0.08, maxActive:1 },
    effects:{ questExpBonus:0.5, socialBonus:0.3 },
    narrative:'茶摊旁多了几个陌生面孔。他们穿着朴素，但举手投足间流露出的气息却让周围的修士不自觉地放轻了脚步。',
  },
  { id:'sages_gathering_2', type:'论道', tier:2, name:'论道大会', duration:3,
    desc:'传闻有元婴大能在灵云峰顶设坛讲法，四方修士纷纷赶来。聆听讲法可大幅提升悟性和修炼速度。',
    triggers:{ minDay:30, chance:0.04, maxActive:1 },
    effects:{ wisdomBonus:5, cultSpeed:1.3, moodBoost:20 },
    narrative:'灵云峰上，紫气东来三千里。一位白发修士盘坐于云台之上，声音不大，却在每个人心中响起。',
  },

  // ── 天灾 ──
  { id:'thunderstorm', type:'天灾', tier:1, name:'雷暴天', duration:2,
    desc:'狂风大作，雷霆轰鸣。野外行动极其危险，但雷击之处可能留下珍贵的雷击木。',
    triggers:{ minDay:2, chance:0.1, maxActive:2 },
    effects:{ restBonus:-0.5, lightningDrops:true },
    narrative:'天空忽然暗了下来，铅灰色的云层压得很低，几乎要擦到树梢。第一道闪电撕裂天地时，你感到空气中的静电让人毛发倒竖。',
  },
  { id:'blizzard', type:'天灾', tier:1, name:'寒潮降临', duration:3,
    desc:'突如其来的寒潮席卷大地，野外滴水成冰。火系功法威力大减，但冰系灵物容易寻获。',
    triggers:{ minDay:20, chance:0.06, maxActive:1 },
    effects:{ fireDamageMult:0.7, iceFindBonus:0.5, coldDamage:{hp:2,perStep:true} },
    narrative:'风变得像刀子一样。你哈出的气在空中就结了冰晶，地面覆上了一层透明的冰壳，脚踏上去嘎吱作响。',
  },

  // ── 福地洞天 ──
  { id:'blessed_cave', type:'福地', tier:2, name:'地脉节点活化', duration:5,
    desc:'某处地脉节点意外活化，方圆数里灵气浓度远超平常。在此处修炼或炼丹均有加成。',
    triggers:{ minDay:25, chance:0.04, maxActive:1 },
    effects:{ cultSpeed:1.8, pillQualityBonus:0.3, bodyCultSpeed:1.5 },
    narrative:'你脚下的土地变得温热，一缕缕淡金色的灵气从石缝中渗出来。这感觉就像是大地在呼吸——而你，正站在它的脉搏上。',
  },
];

// ==========================
// 🧠 世界事件引擎
// ==========================

// 初始化：创建存档事件列表
function initWorldEvents() {
  if (!G._worldEvents) G._worldEvents = [];
}

// 每天检查：触发新事件 + 推进已有事件
function checkWorldEvents() {
  initWorldEvents();
  var p = G.player;
  if (!p) return;
  
  // 移除过期事件
  var before = G._worldEvents.length;
  G._worldEvents = G._worldEvents.filter(function(ev) {
    return G.time.day < ev.endDay;
  });
  if (G._worldEvents.length < before) {
    if (typeof addNarrative === 'function') addNarrative('部分世界事件已平息……', 'system');
  }
  
  // 尝试触发新事件
  if (Math.random() < 0.15) { // 每天最多15%概率触发，由具体模板的chance细调
    tryTriggerWorldEvent();
  }
  
  // 推进每事件的效果（如天灾扣血）
  processWorldEventTick();
}

// 尝试触发
function tryTriggerWorldEvent() {
  var p = G.player;
  var activeCount = G._worldEvents.length;
  
  // 随机打乱模板顺序，取第一个符合条件的
  var shuffled = WORLD_EVENT_TEMPLATES.slice().sort(function() { return Math.random() - 0.5; });
  
  for (var i = 0; i < shuffled.length; i++) {
    var tpl = shuffled[i];
    
    // 已存在同名事件不重复触发
    if (G._worldEvents.some(function(e) { return e.id === tpl.id; })) continue;
    
    // 最大同时事件数
    if (activeCount >= (tpl.triggers.maxActive || 2)) continue;
    
    // 最小天数
    if (G.time.day < (tpl.triggers.minDay || 0)) continue;
    
    // 概率判定
    if (Math.random() > (tpl.triggers.chance || 0.05)) continue;
    
    // 触发！
    var startDay = G.time.day;
    var endDay = startDay + (tpl.duration || 3);
    
    G._worldEvents.push({
      id: tpl.id,
      type: tpl.type,
      name: tpl.name,
      desc: tpl.desc,
      tier: tpl.tier || 1,
      startDay: startDay,
      endDay: endDay,
      effects: tpl.effects || {},
      narrative: tpl.narrative || '',
      ticksActive: 0,
    });
    
    activeCount++;
    
    // 事件公告
    var tierColors = ['#8a7a6a', '#6a9ec9', '#d46a3a', '#c9a96e'];
    var color = tierColors[tpl.tier] || '#6a9ec9';
    var html = '<div style="color:' + color + ';font-weight:bold;font-size:14px;margin-bottom:4px;">🌍 ' + tpl.name + '</div>' +
               '<div style="border-left:3px solid ' + color + ';padding-left:8px;color:var(--text);font-size:11px;">' + tpl.narrative + '</div>' +
               '<div style="font-size:10px;color:var(--text-dim);margin-top:4px;">持续 ' + tpl.duration + ' 天</div>';
    if (typeof addNarrative === 'function') addNarrative(html, 'milestone');
    
    // 🔧 2026-08-05：遗迹/秘境类事件 → 弹窗询问是否进入探索
    if (tpl.explorable && typeof window.relicEventChoicesHtml === 'function' && typeof showCustomModal === 'function') {
      var relicBtn = window.relicEventChoicesHtml(tpl.id);
      if (relicBtn) {
        var inAuto = (typeof G !== 'undefined' && G && G._autoMode) || (typeof autoModeActive !== 'undefined' && autoModeActive);
        if (!inAuto && typeof closeEvent === 'function') {
          try { closeEvent(); } catch(e) {}
        }
        if (!inAuto) {
          var evTitle = '🌍 ' + tpl.name;
          var evBody = '<p style="font-size:12px;line-height:1.8;">' + tpl.desc + '</p>' +
                       '<div style="border-left:3px solid ' + color + ';padding-left:8px;color:var(--text);font-size:11px;margin:8px 0;">' + tpl.narrative + '</div>' +
                       '<div style="font-size:10px;color:var(--text-dim);">秘境入口在附近若隐若现，气息古老而神秘。</div>' +
                       relicBtn +
                       '<button class="event-choice-btn" onclick="closeEvent()" style="display:block;width:100%;margin:4px 0;text-align:left;">🚶 先记下位置，改日再来</button>';
          showCustomModal(evTitle, evBody);
        } else {
          // 自动模式：直接进入探索（不弹窗）
          setTimeout(function() { try { window.enterRelicExplore(tpl.id); } catch(e) {} }, 300);
        }
      }
    }
    
    break; // 每天只触发一个
  }
}

// 每日推进事件效果
function processWorldEventTick() {
  var p = G.player;
  if (!p) return;
  
  G._worldEvents.forEach(function(ev) {
    ev.ticksActive = (ev.ticksActive || 0) + 1;
    
    // 天灾扣血
    var effects = ev.effects || {};
    if (effects.coldDamage && effects.coldDamage.hp) {
      if (typeof getSceneData === 'function') {
        var sc = getSceneData(G.currentScene);
        if (sc && !sc.safe) {
          var coldDmg = effects.coldDamage.hp * (effects.coldDamage.perStep ? 1 : 1);
          p.hp = Math.max(1, p.hp - coldDmg);
          if (typeof addNarrative === 'function') addNarrative('❄️ 寒潮刺骨，气血损耗' + coldDmg + '点。', 'system');
        }
      }
    }
  });
}

// 获取当前活跃事件
function getActiveWorldEvents() {
  initWorldEvents();
  return G._worldEvents || [];
}

// 检查指定类型事件是否活跃
function hasActiveWorldEventType(type) {
  return (G._worldEvents || []).some(function(ev) { return ev.type === type; });
}

// 检查指定id事件是否活跃
function hasActiveWorldEvent(eventId) {
  return (G._worldEvents || []).some(function(ev) { return ev.id === eventId; });
}

// 获取当前活跃事件的累积效果
function getActiveWorldEventEffects() {
  var combined = {};
  (G._worldEvents || []).forEach(function(ev) {
    var eff = ev.effects || {};
    for (var k in eff) {
      if (!combined[k]) combined[k] = 0;
      combined[k] += eff[k];
    }
  });
  return combined;
}

// ==========================
// 🎯 场景特性查询（被外界调用）
// ==========================

// 战斗概率倍率
function getEncounterRateMult() {
  var eff = getActiveWorldEventEffects();
  return eff.encounterMult || 1.0;
}

// 怪物属性倍率
function getMonsterStatMult() {
  var eff = getActiveWorldEventEffects();
  return {
    atk: eff.monsterAtkMult || 1.0,
    hp: eff.monsterHpMult || 1.0,
    loot: eff.lootMult || 1.0,
  };
}

// 修炼速度倍率
function getCultSpeedMult() {
  var eff = getActiveWorldEventEffects();
  return eff.cultSpeed || 1.0;
}

// 灵草发现加成
function getHerbFindBonus() {
  var eff = getActiveWorldEventEffects();
  return eff.herbFindBonus || 0;
}

// 功法熟练度加成
function getSkillMasteryMult() {
  var eff = getActiveWorldEventEffects();
  return 1.0 + (eff.skillMasteryBonus || 0);
}

// 稀有物品发现加成
function getRareFindMult() {
  var eff = getActiveWorldEventEffects();
  return 1.0 + (eff.rareFindBonus || 0);
}

// ==========================
// 🖥️ UI事件面板渲染
// ==========================
function renderWorldEventPanel() {
  var events = getActiveWorldEvents();
  var container = document.getElementById('world-event-panel');
  if (!container) return;
  
  if (events.length === 0) {
    container.innerHTML = '<div class="panel-title" style="font-size:11px;color:var(--text-dim);">🌍 世界形势 · 平静</div>';
    return;
  }
  
  var html = '<div class="panel-title" style="font-size:11px;color:var(--accent);font-weight:bold;">🌍 世界事件 (' + events.length + ')</div>';
  
  events.forEach(function(ev) {
    var remaining = ev.endDay - G.time.day;
    var tierColors = ['#8a7a6a', '#6a9ec9', '#d46a3a', '#c9a96e'];
    var color = tierColors[ev.tier] || '#6a9ec9';
    var typeIcon = { '兽潮':'🐺', '灵潮':'💨', '遗迹':'🏛️', '论道':'🍵', '天灾':'⚡', '福地':'🌸' };
    var icon = typeIcon[ev.type] || '🌍';
    
    html += '<div style="border-left:3px solid ' + color + ';padding:3px 8px;margin:3px 0;font-size:10px;">' +
            '<span style="color:' + color + ';">' + icon + ' ' + ev.name + '</span> ' +
            '<span style="color:var(--text-dim);font-size:9px;">(' + remaining + '天)</span>' +
            '<div style="color:var(--text);font-size:9px;margin-top:1px;">' + ev.desc.slice(0, 45) + '…</div></div>';
  });
  
  container.innerHTML = html;
}

// 导出
window.WORLD_EVENT_TEMPLATES = WORLD_EVENT_TEMPLATES;
window.initWorldEvents = initWorldEvents;
window.checkWorldEvents = checkWorldEvents;
window.getActiveWorldEvents = getActiveWorldEvents;
window.getActiveWorldEventEffects = getActiveWorldEventEffects;
window.getEncounterRateMult = getEncounterRateMult;
window.getMonsterStatMult = getMonsterStatMult;
window.getCultSpeedMult = getCultSpeedMult;
window.getHerbFindBonus = getHerbFindBonus;
window.getSkillMasteryMult = getSkillMasteryMult;
window.getRareFindMult = getRareFindMult;
window.renderWorldEventPanel = renderWorldEventPanel;
window.hasActiveWorldEventType = hasActiveWorldEventType;
window.hasActiveWorldEvent = hasActiveWorldEvent;
window.processWorldEventTick = processWorldEventTick;
window.checkWorldEvents = checkWorldEvents;
window.tryTriggerWorldEvent = tryTriggerWorldEvent;
