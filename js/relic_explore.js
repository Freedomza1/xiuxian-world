// === 唯我独仙 · 上古秘境探索系统 v1 ===
// 游历中遇到「遗迹现世/上古秘境」世界事件 → 可真正进入探索
// 3 层秘境：探宝 → 遇险 → 传承，按玩家境界缩放奖励
// 手动模式弹窗交互，自动模式自动探索

// ==========================
// 📦 秘境内容配置（按境界分档）
// ==========================
const RELIC_LAYER_TEMPLATES = {
  // 层1：探宝（机缘）
  treasure: {
    desc: '你踏入秘境，四周雾气弥漫。脚下的石板上刻着古老的符文，微微发光。',
    finds: [
      // 低境界（练气-筑基）
      { minRealm: 0, items: [
        { id:'poqi_dan', name:'破气丹', qty:1, rarity:2, note:'一枚丹药静静躺在石台上' },
        { id:'duanti_dan', name:'锻体丹', qty:1, rarity:2, note:'一枚丹药静静躺在石台上' },
        { id:'hgc_grass', name:'还魂草', qty:2, rarity:2, note:'石缝间长着一丛灵草' },
        { id:'lingzhi', name:'灵芝', qty:1, rarity:3, note:'一株灵芝在雾气中若隐若现' },
        { id:'zhixue_san', name:'止血散', qty:2, rarity:1, note:'一包药散被布帛包裹着' },
        { id:'juli_fu', name:'聚灵符', qty:1, rarity:2, note:'一张泛黄的符箓贴在石壁上' },
      ]},
      // 中境界（金丹-元婴）
      { minRealm: 12, items: [
        { id:'pojing_dan', name:'破境丹', qty:1, rarity:3, note:'一枚丹丸在石台上泛着微光' },
        { id:'leiyin_pass', name:'雷音秘境钥匙', qty:1, rarity:4, note:'一把古朴的钥匙嵌在石缝中' },
        { id:'longxue_jing', name:'龙血晶', qty:1, rarity:4, note:'一块血红色的晶体散发着温热' },
        { id:'yuehua_jing', name:'月华精', qty:1, rarity:3, note:'一滴月华凝成的露珠在叶尖滚动' },
        { id:'tiegu_dan', name:'铁骨丹', qty:1, rarity:3, note:'一枚丹药装在玉瓶中' },
        { id:'jinshen_dan', name:'金身丹', qty:1, rarity:4, note:'一枚金色丹药被禁制守护' },
      ]},
      // 高境界（化神+）
      { minRealm: 18, items: [
        { id:'huashen_dan', name:'化神丹', qty:1, rarity:5, note:'一枚丹药悬浮空中，周围灵气形成漩涡' },
        { id:'daoshen_dan', name:'道身丹', qty:1, rarity:5, note:'一枚道韵流转的丹药' },
        { id:'tiandao_key', name:'天道秘境钥匙', qty:1, rarity:5, note:'一把缠绕道纹的钥匙' },
        { id:'wanshou_ling', name:'万寿灵芝', qty:1, rarity:5, note:'一株万年灵芝在灵泉边生长' },
        { id:'bumie_dan', name:'不灭丹', qty:1, rarity:5, note:'一枚不灭丹被光晕包裹' },
        { id:'kaitian_dan', name:'开天丹', qty:1, rarity:5, note:'一枚开天丹在虚空悬浮' },
      ]},
    ],
  },

  // 层2：遇险（战斗或绕行）
  danger: {
    desc: '通道深处传来低沉的咆哮，一双猩红的眼睛在黑暗中亮起……',
    beasts: [
      { minRealm: 0,  list: ['青风狼','雪狐','赤目妖狼','黑风豹'] },
      { minRealm: 9,  list: ['青鳞蛟','紫电貂','赤目妖狼'] },
      { minRealm: 12, list: ['雷池蛟龙','紫霄雷鸟','云海龙鲸'] },
      { minRealm: 18, list: ['雷池龙君','云海龙鲸王','天道雷尊'] },
    ],
    rewards: {
      stones: [30, 80, 200, 500],   // 按境界档位
      qiGain: [60, 180, 450, 1000], // 修为奖励
      bodyGain: [20, 60, 150, 350], // 炼体奖励
    },
  },

  // 层3：传承（BOSS + 大奖励）
  heritage: {
    desc: '秘境的尽头，一座古老的祭坛静静矗立。祭坛上放着一卷泛光的竹简，四周有残存的守护兽影。',
    bossByRealm: [
      { minRealm: 0,  name:'上古守护灵', desc:'由残存禁制凝聚的守护灵' },
      { minRealm: 9,  name:'秘境守卫', desc:'金丹级禁制的守卫化身' },
      { minRealm: 12, name:'秘境古魔残魂', desc:'上古魔修的一缕残魂' },
      { minRealm: 18, name:'上古守护神', desc:'太古大能的守护化身' },
    ],
    rewards: {
      stones: [80, 250, 600, 1500],
      qiGain: [150, 450, 1000, 2500],
      bodyGain: [50, 150, 350, 800],
      skillChance: [0.15, 0.25, 0.4, 0.55], // 功法掉落概率
      relicChance: [0.05, 0.1, 0.18, 0.3],  // 宝物（天级装备/材料）概率
    },
  },
};

// ==========================
// 🔍 辅助：按境界取档位
// ==========================
function _relicTierIndex(minRealm, tiers) {
  const idx = tiers.findIndex(t => (G.player.qiRealmIndex || 0) < t.minRealm);
  return idx === -1 ? tiers.length - 1 : Math.max(0, idx - 1);
}

// ==========================
// 🌀 入口：进入上古秘境探索
// ==========================
function enterRelicExplore(eventId) {
  const p = G.player;
  if (!p) return;
  if (!p._relicExplore) p._relicExplore = {};
  p._relicExplore = { eventId, layer: 1, history: [], startedDay: G.time.day };
  
  addNarrative('🌌 你循着异象的方向，踏入传说中的上古秘境……', 'milestone');
  _relicLayer1();
}

// ── 层1：探宝 ──
function _relicLayer1() {
  const p = G.player;
  if (p._relicExplore) p._relicExplore.layer = 1;
  const tpl = RELIC_LAYER_TEMPLATES.treasure;
  const tierIdx = _relicTierIndex(0, tpl.finds);
  const pool = tpl.finds[tierIdx].items;
  const found = pool[Math.floor(Math.random() * pool.length)];
  
  // 添加物品
  let itemData = null;
  if (typeof ITEM_DB !== 'undefined') {
    itemData = ITEM_DB.find(i => i.id === found.id || i.name === found.name);
  }
  let gotName = found.name;
  if (itemData) {
    for (let i = 0; i < (found.qty || 1); i++) {
      if (typeof addItemToInventory === 'function') addItemToInventory(itemData, 1);
    }
    gotName = itemData.name || found.name;
  } else {
    // 找不到物品定义则给灵石
    if (typeof addItemToInventory !== 'function') {
      p.stones += 20;
      gotName = '灵石×20';
    }
  }
  
  p._relicExplore.history.push(`层1 探宝：获得「${gotName}」`);
  addNarrative(`🗝️ 秘境第一层——${found.note}。你获得了「${gotName}」！`, 'narr-event');
  
  // 弹窗选择
  _relicShowModal(1, 
    `<p style="font-size:12px;line-height:1.8;">${tpl.desc}</p>
     <div style="font-size:11px;color:#c9a96e;margin:8px 0;">✨ 你发现：${gotName}</div>
     <div style="font-size:10px;color:var(--text-dim);">秘境的雾气更浓了，深处似乎有什么在等待……</div>`,
    [
      { text: '继续深入', fn: () => _relicLayer2() },
      { text: '见好就收，离开秘境', fn: () => _relicFinish(false) },
    ]);
}

// ── 层2：遇险 ──
function _relicLayer2() {
  const p = G.player;
  if (p._relicExplore) p._relicExplore.layer = 2;
  const tpl = RELIC_LAYER_TEMPLATES.danger;
  const tierIdx = _relicTierIndex(0, tpl.beasts);
  const beasts = tpl.beasts[tierIdx].list;
  const beastName = beasts[Math.floor(Math.random() * beasts.length)];
  
  addNarrative(`⚔️ 秘境第二层——${tpl.desc}（${beastName}挡住了去路）`, 'narr-event');
  
  const stoneR = tpl.rewards.stones[tierIdx];
  const qiR = tpl.rewards.qiGain[tierIdx];
  const bodyR = tpl.rewards.bodyGain[tierIdx];
  
  _relicShowModal(2,
    `<p style="font-size:12px;line-height:1.8;">${tpl.desc}</p>
     <div style="font-size:11px;color:#e74c3c;margin:8px 0;">🐾 拦路妖兽：${beastName}</div>`,
    [
      { text: `⚔️ 迎战（胜则灵石+${stoneR}，修为+${qiR}）`, fn: () => _relicFightBeast(beastName, tierIdx, qiR, bodyR, stoneR) },
      { text: '🛡️ 绕行（损失一些灵石，安全通过）', fn: () => { p.stones = Math.max(0, (p.stones||0) - Math.round(stoneR * 0.3)); addNarrative('你小心翼翼地绕开妖兽，损失了一些灵石。', 'system'); _relicLayer3(); } },
      { text: '🚪 退出秘境', fn: () => _relicFinish(false) },
    ]);
}

// ── 层2 战斗 ──
function _relicFightBeast(beastName, tierIdx, qiR, bodyR, stoneR) {
  const p = G.player;
  // 战斗胜利判定（简化版：战力对比 + 随机 + 福缘）
  const myPower = p.combatPower || (p.attack || 10);
  const beastPower = (p.combatPower || 100) * (0.8 + tierIdx * 0.15) * (0.9 + Math.random() * 0.3);
  const luckMult = p.fortune && p.fortune.luckMult ? p.fortune.luckMult : 1.0;
  const winChance = Math.min(0.95, Math.max(0.15, (myPower / (myPower + beastPower)) * 1.2 * luckMult));
  
  if (Math.random() < winChance) {
    // 胜利
    p.stones = (p.stones || 0) + stoneR;
    if (typeof gainCultivation === 'function') {
      gainCultivation('qi', qiR);
      gainCultivation('body', bodyR);
    } else {
      p.qiCultivationPoints = (p.qiCultivationPoints || 0) + qiR;
      p.bodyCultivationPoints = (p.bodyCultivationPoints || 0) + bodyR;
    }
    p._relicExplore.history.push(`层2 击败${beastName}：灵石+${stoneR}，修为+${qiR}`);
    addNarrative(`🏆 你击败了${beastName}！灵石+${stoneR}，修为+${qiR}，炼体+${bodyR}`, 'narr-event');
    // 掉血
    p.hp = Math.max(1, (p.hp||p.maxHp) - Math.round(p.maxHp * (0.1 + Math.random() * 0.15)));
    recalcStats(p);
    updateAllUI();
    _relicLayer3();
  } else {
    // 战败
    p.hp = Math.max(1, Math.round(p.hp * 0.4));
    p.mood = Math.max(0, (p.mood||50) - 10);
    p._relicExplore.history.push(`层2 不敌${beastName}，狼狈而退`);
    addNarrative(`💀 你不是${beastName}的对手，身负重伤狼狈而退……`, 'system');
    // 自动模式：战败也给保底收获（挂机不亏），继续探索
    const inAuto = (typeof G !== 'undefined' && G && G._autoMode) || (typeof autoModeActive !== 'undefined' && autoModeActive);
    if (inAuto) {
      const cons = Math.max(1, Math.round(stoneR * 0.2));
      p.stones = (p.stones || 0) + cons;
      p._relicExplore.history.push(`层2 败退中拾得灵石+${cons}`);
      addNarrative(`🍂 败退时你在废墟中拾得灵石+${cons}。`, 'system');
      recalcStats(p);
      updateAllUI();
      _relicLayer3();
      return;
    }
    recalcStats(p);
    updateAllUI();
    _relicFinish(true);
  }
}

// ── 层3：传承 ──
function _relicLayer3() {
  const p = G.player;
  if (p._relicExplore) p._relicExplore.layer = 3;
  const tpl = RELIC_LAYER_TEMPLATES.heritage;
  const tierIdx = _relicTierIndex(0, tpl.bossByRealm);
  const boss = tpl.bossByRealm[tierIdx];
  
  addNarrative(`🏛️ 秘境第三层——${tpl.desc}（${boss.name}镇守）`, 'narr-event');
  
  _relicShowModal(3,
    `<p style="font-size:12px;line-height:1.8;">${tpl.desc}</p>
     <div style="font-size:11px;color:#c9a96e;margin:8px 0;">👑 守护者：${boss.name}（${boss.desc}）</div>`,
    [
      { text: '⚔️ 挑战守护者，夺取传承', fn: () => _relicFightBoss(tierIdx) },
      { text: '🚪 退出秘境', fn: () => _relicFinish(false) },
    ]);
}

// ── 层3 传承战 ──
function _relicFightBoss(tierIdx) {
  const p = G.player;
  const tpl = RELIC_LAYER_TEMPLATES.heritage;
  const boss = tpl.bossByRealm[tierIdx];
  const stonesR = tpl.rewards.stones[tierIdx];
  const qiR = tpl.rewards.qiGain[tierIdx];
  const bodyR = tpl.rewards.bodyGain[tierIdx];
  const skillChance = tpl.rewards.skillChance[tierIdx];
  const relicChance = tpl.rewards.relicChance[tierIdx];
  
  // 战斗判定
  const myPower = p.combatPower || (p.attack || 10);
  const bossPower = (p.combatPower || 100) * (1.1 + tierIdx * 0.2) * (0.95 + Math.random() * 0.3);
  const luckMult = p.fortune && p.fortune.luckMult ? p.fortune.luckMult : 1.0;
  const winChance = Math.min(0.9, Math.max(0.1, (myPower / (myPower + bossPower)) * 1.3 * luckMult));
  
  if (Math.random() < winChance) {
    // 胜利 → 传承奖励
    p.stones = (p.stones || 0) + stonesR;
    if (typeof gainCultivation === 'function') {
      gainCultivation('qi', qiR);
      gainCultivation('body', bodyR);
    } else {
      p.qiCultivationPoints = (p.qiCultivationPoints || 0) + qiR;
      p.bodyCultivationPoints = (p.bodyCultivationPoints || 0) + bodyR;
    }
    p.hp = Math.max(1, (p.hp||p.maxHp) - Math.round(p.maxHp * 0.2));
    p._relicExplore.history.push(`层3 击败${boss.name}，获得传承`);
    addNarrative(`👑 你击败了${boss.name}，夺得秘境传承！灵石+${stonesR}，修为+${qiR}，炼体+${bodyR}`, 'milestone');
    
    // 功法掉落
    if (Math.random() < skillChance) {
      _relicDropSkill(tierIdx);
    }
    // 宝物掉落
    if (Math.random() < relicChance) {
      _relicDropRelic(tierIdx);
    }
    // 福缘+1（探索秘境有收获）
    if (p.fortune && p.fortune.luckMult) {
      p.fortune.luckMult = Math.min(2.0, p.fortune.luckMult + 0.05);
      addNarrative('🍀 秘境之行让你福缘加深！', 'narr-event');
    }
    recalcStats(p);
    updateAllUI();
    _relicFinish(true);
  } else {
    p.hp = Math.max(1, Math.round(p.hp * 0.3));
    p.mood = Math.max(0, (p.mood||50) - 15);
    p._relicExplore.history.push(`层3 不敌${boss.name}，身负重伤`);
    addNarrative(`💀 你没能战胜${boss.name}，被秘境之力弹了出来……`, 'system');
    // 自动模式：战败也给保底收获
    const inAuto = (typeof G !== 'undefined' && G && G._autoMode) || (typeof autoModeActive !== 'undefined' && autoModeActive);
    if (inAuto) {
      const cons = Math.max(1, Math.round(stonesR * 0.15));
      p.stones = (p.stones || 0) + cons;
      p._relicExplore.history.push(`层3 败退中拾得灵石+${cons}`);
      addNarrative(`🍂 败退时你在祭坛废墟中拾得灵石+${cons}。`, 'system');
    }
    recalcStats(p);
    updateAllUI();
    _relicFinish(true);
  }
}

// ── 功法掉落 ──
function _relicDropSkill(tierIdx) {
  const p = G.player;
  // 按境界选功法品质池
  const qualityPool = tierIdx <= 0 ? ['灵级','地级'] :
                      tierIdx === 1 ? ['地级','天级'] :
                      tierIdx === 2 ? ['天级','圣级'] : ['圣级','神级'];
  const candidates = (typeof G.skillData !== 'undefined' ? G.skillData : [])
    .filter(s => qualityPool.includes(s.quality) && s.learn && !s.learn.sectOnly && !s.learn.special && !p.skills.find(sk => sk.id === s.id));
  if (candidates.length > 0) {
    const chosen = candidates[Math.floor(Math.random() * candidates.length)];
    p.skills.push({ id:chosen.id, name:chosen.name, quality:chosen.quality, type:chosen.type, active:false, mastered:true });
    const qColor = typeof getQualityColor === 'function' ? getQualityColor(chosen.quality) : '#aaa';
    addNarrative(`<div style="color:${qColor};font-weight:bold;">📖 传承所得：${chosen.name}（${chosen.quality}·${chosen.type}）</div>`, 'epic');
    if (typeof unlockSkills === 'function') unlockSkills();
  }
}

// ── 宝物掉落 ──
function _relicDropRelic(tierIdx) {
  const p = G.player;
  // 稀有材料/装备（按境界）
  const pool = [
    { minRealm: 0,  items: ['lingzhi', 'juli_fu', 'qingling_cao'] },
    { minRealm: 9,  items: ['yaodan', 'lingmai_jiejing'] },
    { minRealm: 12, items: ['leichi_jing', 'yunhai_lu'] },
    { minRealm: 18, items: ['tiandao_bei', 'shenlong_jing'] },
  ];
  const idx = _relicTierIndex(0, pool);
  const id = pool[idx].items[Math.floor(Math.random() * pool[idx].items.length)];
  let itemData = (typeof ITEM_DB !== 'undefined' ? ITEM_DB : []).find(i => i.id === id);
  if (itemData && typeof addItemToInventory === 'function') {
    addItemToInventory(itemData, 1);
    addNarrative(`🎁 宝光一闪——你得到了「${itemData.name}」！`, 'narr-event');
  }
}

// ── 结束/结算 ──
function _relicFinish(gotHeritage) {
  const p = G.player;
  if (!p._relicExplore) return;
  const layers = p._relicExplore.layer;
  const exp = p._relicExplore;
  
  addNarrative(`🌅 你走出了上古秘境。此行共探索${layers}层${gotHeritage ? '，夺得传承' : ''}。`, 'system');
  
  // 记录叙事日志
  if (typeof addStoryLog === 'function') {
    try {
      addStoryLog('秘境探索', `上古秘境之行：${exp.history.join('；')}`);
    } catch(e) {}
  }
  // 记录事件史
  if (p.eventHistory) p.eventHistory.push('上古秘境探索·' + layers + '层');
  
  // 清理状态
  p._relicExplore = null;
  if (typeof updateAllUI === 'function') updateAllUI();
}

// ── 弹窗（手动模式）──
function _relicShowModal(layer, bodyHtml, choices) {
  // 自动模式：直接选第一个（继续/迎战）
  const inAuto = (typeof G !== 'undefined' && G && G._autoMode) || (typeof autoModeActive !== 'undefined' && autoModeActive);
  if (inAuto) {
    const fn = choices[0].fn;
    setTimeout(fn, 300);
    return;
  }
  // 手动模式：走统一弹窗
  const buttons = choices.map((c, i) =>
    `<button class="event-choice-btn" onclick="window._relicResolve(${i});closeEvent()" style="display:block;width:100%;margin:4px 0;text-align:left;">📜 ${c.text}</button>`
  ).join('');
  window._relicResolve = (i) => { if (choices[i] && choices[i].fn) choices[i].fn(); };
  showCustomModal(`🌀 上古秘境 · 第${layer}层`, bodyHtml + buttons);
}

// ==========================
// 🎯 世界事件接入：遗迹/秘境类事件可探索
// ==========================
function isRelicExplorableEvent(eventId) {
  return !!eventId && (eventId.indexOf('ruins') !== -1 || eventId.indexOf('relic') !== -1 || eventId.indexOf('ancient') !== -1);
}

// 世界事件弹窗：若为可探索遗迹事件，附加「进入探索」选项
function relicEventChoicesHtml(eventId) {
  if (!isRelicExplorableEvent(eventId)) return '';
  return `<button class="event-choice-btn" onclick="enterRelicExplore('${eventId}');closeEvent()" style="display:block;width:100%;margin:6px 0;text-align:left;background:rgba(192,132,252,0.15);border-color:rgba(192,132,252,0.4);">🌀 进入上古秘境探索（获得机缘与传承）</button>`;
}

// 导出
window.enterRelicExplore = enterRelicExplore;
window.isRelicExplorableEvent = isRelicExplorableEvent;
window.relicEventChoicesHtml = relicEventChoicesHtml;
window.RELIC_LAYER_TEMPLATES = RELIC_LAYER_TEMPLATES;
