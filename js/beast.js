// === 唯我独仙 · 灵兽伙伴系统 ===
// 驯服野生灵兽 → 培养成长 → 出战辅助
// 来源：战斗掉落幼崽/蛋、秘境奇遇、黑市、驯服

// ── 灵兽图鉴 ──
const BEAST_DB = {
  'xuehu_hu': {
    name: '雪狐', icon: '🦊', rarity: '凡兽',
    desc: '通体雪白的灵狐，机敏灵动，擅长寻宝。',
    ability: '寻宝', abilityDesc: '探索时额外获得稀有材料',
    base: { hp: 40, attack: 5, speed: 1.3 },
    growth: { hp: 6, attack: 1.2 },
    catchScene: 'bingfeng_grotto',
    catchChance: 0.08,
  },
  'qingfeng_lang': {
    name: '青风狼', icon: '🐺', rarity: '凡兽',
    desc: '风系灵狼，速度极快，爪牙锋利。',
    ability: '疾风', abilityDesc: '战斗中先手攻击，闪避提升',
    base: { hp: 60, attack: 8, speed: 1.5 },
    growth: { hp: 8, attack: 1.5 },
    catchScene: 'luoxia_forest',
    catchChance: 0.06,
  },
  'xuanwu_guishou': {
    name: '玄龟', icon: '🐢', rarity: '灵兽',
    desc: '背负玄纹的古龟，防御惊人，沉稳可靠。',
    ability: '玄甲', abilityDesc: '主人受到的伤害减免5%',
    base: { hp: 120, attack: 4, speed: 0.6 },
    growth: { hp: 14, attack: 0.8 },
    catchScene: 'bibo_lake',
    catchChance: 0.05,
  },
  'lieyan_hu': {
    name: '烈焰虎', icon: '🐯', rarity: '灵兽',
    desc: '身披烈焰的猛虎，百兽之王，攻击凶悍。',
    ability: '烈焰', abilityDesc: '战斗时附加火属性伤害',
    base: { hp: 100, attack: 14, speed: 1.1 },
    growth: { hp: 12, attack: 2.2 },
    catchScene: 'lieyan_valley',
    catchChance: 0.05,
  },
  'mu_ling': {
    name: '木灵', icon: '🌿', rarity: '灵兽',
    desc: '玉木林中诞生的木系精灵，温顺可爱，擅长疗伤。',
    ability: '回春', abilityDesc: '战斗后恢复主人气血',
    base: { hp: 50, attack: 3, speed: 0.9 },
    growth: { hp: 7, attack: 0.6 },
    catchScene: 'yumu_forest',
    catchChance: 0.06,
  },
  'binglei_ying': {
    name: '冰雷鹰', icon: '🦅', rarity: '灵兽',
    desc: '翱翔于冰风石窟之巅的鹰隼，爪携冰雷。',
    ability: '冰雷', abilityDesc: '战斗时附加冰系伤害+暴击提升',
    base: { hp: 70, attack: 11, speed: 1.4 },
    growth: { hp: 9, attack: 1.8 },
    catchScene: 'bingfeng_grotto',
    catchChance: 0.04,
  },
  // ── 筑基·中州域灵兽 ──
  'qinglin_jiao': {
    name: '青鳞蛟', icon: '🐉', rarity: '灵兽',
    desc: '妖兽山脉深处青鳞蛟的幼崽，鳞甲初成，性情凶悍却认主忠诚。',
    ability: '青鳞', abilityDesc: '战斗时附加木系伤害+减伤3%',
    base: { hp: 180, attack: 22, speed: 1.2 },
    growth: { hp: 22, attack: 3.2 },
    catchScene: 'zz_yaoshou_ridge',
    catchChance: 0.07,
  },
  'chiyan_yaolang': {
    name: '赤目妖狼', icon: '🐺', rarity: '灵兽',
    desc: '赤目如血的妖狼幼崽，天生嗜战，速度惊人。',
    ability: '赤目', abilityDesc: '战斗时暴击率提升',
    base: { hp: 160, attack: 26, speed: 1.6 },
    growth: { hp: 18, attack: 3.6 },
    catchScene: 'zz_yaoshou_ridge',
    catchChance: 0.06,
  },
  'lingmai_shiling': {
    name: '灵脉石灵', icon: '🪨', rarity: '灵兽',
    desc: '灵脉遗迹中诞生的石灵幼体，浑身灵晶，防御惊人。',
    ability: '灵晶', abilityDesc: '主人受到的伤害减免6%',
    base: { hp: 260, attack: 12, speed: 0.7 },
    growth: { hp: 32, attack: 1.6 },
    catchScene: 'zz_lingmai_ruins',
    catchChance: 0.05,
  },
  'huangji_mofu': {
    name: '荒寂魔蝠', icon: '🦇', rarity: '灵兽',
    desc: '荒寂殿深处吸食阴气而生的魔蝠，翅展如墨。',
    ability: '幽冥', abilityDesc: '战斗时附加暗系伤害+吸血',
    base: { hp: 140, attack: 24, speed: 1.7 },
    growth: { hp: 16, attack: 3.4 },
    catchScene: 'zz_huangji_dian',
    catchChance: 0.06,
  },
  // ── 金丹·天域灵兽 ──
  'leichi_jiaolong': {
    name: '雷池蛟龙', icon: '🐲', rarity: '天兽',
    desc: '雷池深处雷蛟的幼崽，周身缠绕紫色电弧，天生雷灵之体。',
    ability: '紫雷', abilityDesc: '战斗时附加雷系伤害+眩晕几率',
    base: { hp: 420, attack: 48, speed: 1.3 },
    growth: { hp: 50, attack: 6.5 },
    catchScene: 'ty_leichi',
    catchChance: 0.06,
  },
  'ziyun_leique': {
    name: '紫霄雷鸟', icon: '🦅', rarity: '天兽',
    desc: '翱翔于雷池云海之间的雷鸟幼雏，羽翼间紫电流转。',
    ability: '紫霄', abilityDesc: '战斗时先手攻击+暴击提升',
    base: { hp: 300, attack: 42, speed: 1.9 },
    growth: { hp: 34, attack: 5.8 },
    catchScene: 'ty_leichi',
    catchChance: 0.05,
  },
  'yunhai_youjing': {
    name: '云海幼鲸', icon: '🐋', rarity: '天兽',
    desc: '云海中沉浮的龙鲸幼崽，喷吐间云雾缭绕，性情温和。',
    ability: '云御', abilityDesc: '主人受到的伤害减免8%，气血上限提升',
    base: { hp: 600, attack: 30, speed: 0.8 },
    growth: { hp: 70, attack: 4.0 },
    catchScene: 'ty_yunhai',
    catchChance: 0.05,
  },
  'tiandao_linghe': {
    name: '天道灵鹤', icon: '🦩', rarity: '天兽',
    desc: '天道峰巅栖息的白鹤，通体莹白，双目蕴含道韵。',
    ability: '道韵', abilityDesc: '探索时额外获得感悟，悟性加成',
    base: { hp: 280, attack: 36, speed: 1.5 },
    growth: { hp: 32, attack: 5.0 },
    catchScene: 'ty_tiandao_peak',
    catchChance: 0.06,
  },
};

// ── 玩家灵兽（存于 p.beasts = [{ id, name, level, exp, hp, attack, mood }]）──
function getBeasts() {
  const p = G.player;
  if (!p.beasts) p.beasts = [];
  return p.beasts;
}

// ── 获得灵兽幼崽 ──
// 🔧 2026-08-04：获得高级灵兽自动切换主战
//    稀有度权重：凡兽1 < 灵兽2 < 天兽3；同级比基础攻击+成长
function beastStrength(bd) {
  const rarityW = bd.rarity === '天兽' ? 3 : bd.rarity === '灵兽' ? 2 : 1;
  const atk = (bd.base.attack || 0) + (bd.growth.attack || 0) * 20; // 20级预估
  return rarityW * 1000 + atk;
}

// 当前主战灵兽（没标记时默认第一只）
function getActiveBeast() {
  const p = G.player;
  if (!p.beasts || p.beasts.length === 0) return null;
  const act = p.beasts.find(b => b && b.active);
  return act || p.beasts[0];
}

// 🔧 2026-08-05：栏内最弱灵兽（按战力+等级综合判定，用于自动换血）
function getWeakestBeast() {
  const p = G.player;
  if (!p.beasts || p.beasts.length === 0) return null;
  let weakest = null, weakestScore = Infinity;
  p.beasts.forEach((b, i) => {
    if (!b) return;
    const bd = BEAST_DB[b.id];
    if (!bd) return;
    // 战力 + 等级权重：满级高等级凡兽也可能比新灵兽强
    const score = beastStrength(bd) + (b.level || 1) * 50;
    if (score < weakestScore) {
      weakestScore = score;
      weakest = { idx: i, beast: b, score };
    }
  });
  return weakest;
}

// 设为出战
function setActiveBeast(beastIdx) {
  const p = G.player;
  if (!p.beasts || !p.beasts[beastIdx]) return false;
  const b = p.beasts[beastIdx];
  if (b.hp <= 0) {
    addNarrative(`${BEAST_DB[b.id]?.icon || '🐾'} ${b.name} 受了重伤，无法出战。先喂食疗伤吧。`, 'system');
    return false;
  }
  p.beasts.forEach((x, i) => x.active = (i === beastIdx));
  updateAllUI();
  return true;
}

function addBeast(beastId, source) {
  const p = G.player;
  const bd = BEAST_DB[beastId];
  if (!bd) return false;
  if (!p.beasts) p.beasts = [];
  
  // 🔧 2026-08-05：满栏时自动换血——新灵兽比栏内最弱更强 → 放生最弱，收下新兽
  //    原逻辑直接拒绝，导致低级凡兽占满坑后高级灵兽永远进不来
  let replacedInfo = null;
  if (p.beasts.length >= 4) {
    const weakest = getWeakestBeast();
    const newScore = beastStrength(bd) + 1 * 50; // 新兽1级，对比时同权重
    if (weakest && newScore > weakest.score) {
      const oldBd = BEAST_DB[weakest.beast.id];
      replacedInfo = { idx: weakest.idx, name: weakest.beast.name, icon: oldBd ? oldBd.icon : '🐾', oldRarity: oldBd ? oldBd.rarity : '' };
      // 放生最弱的（如果它是主战，主战标记让给第一只存活灵兽）
      if (weakest.beast.active) {
        const firstAlive = p.beasts.find((b, i) => i !== weakest.idx && b && b.hp > 0);
        if (firstAlive) firstAlive.active = true;
      }
      p.beasts.splice(weakest.idx, 1);
    } else {
      addNarrative(`你的灵兽栏已满（4/4），而 ${bd.icon} ${bd.name} 并不比你现有的灵兽更强，未能收服。`, 'system');
      return false;
    }
  }
  
  const beast = {
    id: beastId,
    name: bd.name + (Math.random() < 0.3 ? '·' + ['阿','小','灵','雪','风'][Math.floor(Math.random()*5)] : ''),
    level: 1,
    exp: 0,
    mood: 80, // 亲密度
    hp: bd.base.hp,
    attack: bd.base.attack,
    speed: bd.base.speed,
    maxHp: bd.base.hp,
  };
  
  // 🔧 2026-08-04 自动切换主战：新灵兽比当前主战更强 → 自动上位
  //    第一只默认主战；后续若稀有度/强度更高则自动切换
  let autoSwitchMsg = '';
  if (p.beasts.length === 0) {
    beast.active = true;
  } else {
    const curActive = getActiveBeast();
    const curBd = curActive ? BEAST_DB[curActive.id] : null;
    if (curBd && beastStrength(bd) > beastStrength(curBd)) {
      // 更强 → 自动切换（新灵兽主战，旧主战退居二线）
      beast.active = true;
      p.beasts.forEach(b => b.active = false);
      autoSwitchMsg = `<div style="font-size:10px;color:#e8c88a;margin-top:4px;">🔄 自动切换出战！${bd.icon} ${bd.name} 比 ${curBd.icon} ${curActive.name} 更强，已自动成为主战灵兽。</div>`;
    }
  }
  
  p.beasts.push(beast);
  // 换血提示
  let replacedMsg = '';
  if (replacedInfo) {
    replacedMsg = `<div style="font-size:10px;color:#e67e22;margin-top:4px;">🔄 灵兽栏已满，自动放生了 ${replacedInfo.icon} ${replacedInfo.name}（${replacedInfo.oldRarity}），为 ${bd.icon} ${bd.name} 腾出位置。</div>`;
  }
  addNarrative(`<div style="border:1px solid rgba(120,200,180,0.4);border-radius:8px;padding:10px;margin:6px 0;background:rgba(30,100,80,0.1);">
    <div style="font-weight:bold;color:#7dce9a;">${bd.icon} 灵兽认主！${beast.name}${beast.active ? ' <span style="color:#e8c88a;font-size:10px;">🌟主战</span>' : ''}</div>
    <div style="font-size:11px;color:var(--text-dim);margin-top:4px;">${source || '机缘巧合'}。${bd.name}${bd.desc}</div>
    <div style="font-size:10px;color:#8cc;">能力：${bd.ability}（${bd.abilityDesc}）</div>
    ${autoSwitchMsg}
    ${replacedMsg}
  </div>`, 'milestone');
  updateAllUI();
  return true;
}

// 灵兽升级（喂食/战斗后）
function beastGainExp(beastIdx, exp) {
  const p = G.player;
  if (!p.beasts || !p.beasts[beastIdx]) return;
  const b = p.beasts[beastIdx];
  const bd = BEAST_DB[b.id];
  if (!bd) return;
  b.exp = (b.exp || 0) + exp;
  const need = b.level * 30;
  if (b.exp >= need) {
    b.exp -= need;
    b.level++;
    b.maxHp = bd.base.hp + bd.growth.hp * (b.level - 1);
    b.attack = bd.base.attack + bd.growth.attack * (b.level - 1);
    b.speed = bd.base.speed + (b.level - 1) * 0.03;
    b.hp = b.maxHp;
    addNarrative(`${bd.icon} ${b.name} 升到 ${b.level} 级！${b.level % 5 === 0 ? '（体型似乎大了一圈，气息更浑厚了）' : ''}`, 'system');
  }
}

// 喂食灵兽
function feedBeast(beastIdx, itemId) {
  const p = G.player;
  const b = p.beasts[beastIdx];
  if (!b) return;
  const item = ITEM_DB.find(i => i.id === itemId);
  if (!item) return;
  const owned = p.inventory.reduce((s, it) => it.id === itemId ? s + (it.qty || 1) : s, 0);
  if (owned < 1) { addNarrative('没有这个灵食。', 'system'); return; }
  removeItemFromInventory(itemId, 1);
  b.mood = Math.min(100, (b.mood || 80) + 10);
  // 💚 喂食同时恢复气血（灵兽受伤后可通过喂食救回，防止永久躺平）
  if (b.maxHp && b.hp < b.maxHp) {
    const healAmt = Math.max(10, Math.round(b.maxHp * 0.25));
    b.hp = Math.min(b.maxHp, b.hp + healAmt);
    addNarrative(`${BEAST_DB[b.id]?.icon || '🐾'} ${b.name} 吃下${item.name}，气血恢复${healAmt}点。`, 'system');
  }
  let exp = 10;
  if (item.type === '灵草') exp = 25;
  if (item.herbEffect) exp = 40;
  beastGainExp(beastIdx, exp);
  addNarrative(`${BEAST_DB[b.id]?.icon || '🐾'} ${b.name} 吃了${item.name}，亲密度+10，修为+${exp}。`, 'system');
  updateAllUI();
}

// 战斗时灵兽协助（在伤害结算里调用）
// 🔧 2026-08-04：返回值扩展——带上每只灵兽的名字/图标/能力，支持参战叙事
//    dmg: 每回合灵兽配合总伤害；defReduce: 玄甲减伤；heal: 回春回复；
//    fighters: [{name, icon, dmg}] 参与攻击的灵兽明细；guardian: {name, icon} 玄甲守护者
function beastCombatBonus() {
  const p = G.player;
  if (!p.beasts || p.beasts.length === 0) return { dmg: 0, defReduce: 0, heal: 0, fighters: [], guardian: null, active: null };
  let dmg = 0, defReduce = 0, heal = 0;
  let guardian = null;
  const fighters = [], alive = [];
  // 🔧 2026-08-04：主战灵兽（active）贡献 ×2，突出「出战」概念；
  //    其余灵兽仍参战（保“全方位体现”），只是贡献低一些
  const act = getActiveBeast();
  p.beasts.forEach(b => {
    if (!b || b.hp <= 0) return;
    alive.push(b);
    const bd = BEAST_DB[b.id];
    if (!bd) return;
    const isAct = act && b === act;
    const mult = isAct ? (0.3 + b.level * 0.08) : (0.15 + b.level * 0.05); // 主战贡献更高
    const bDmg = b.attack * mult;
    dmg += bDmg;
    if (bDmg >= 1) fighters.push({ name: b.name, icon: bd.icon, dmg: Math.round(bDmg), active: !!isAct });
    if (bd.ability === '玄甲') { defReduce += 0.05; if (!guardian) guardian = { name: b.name, icon: bd.icon }; }
    if (bd.ability === '回春' && Math.random() < 0.3) heal += b.level * 2;
  });
  return { dmg: Math.round(dmg), defReduce, heal, fighters, guardian, alive, active: act };
}

// 探索时灵兽寻宝（在探索结算里调用）
function beastLootBonus() {
  const p = G.player;
  if (!p.beasts) return null;
  for (const b of p.beasts) {
    if (!b || b.hp <= 0) continue;
    const bd = BEAST_DB[b.id];
    if (!bd || bd.ability !== '寻宝') continue;
    if (Math.random() < 0.12 + b.level * 0.01) {
      return { beast: b, name: bd.name, icon: bd.icon };
    }
  }
  return null;
}

// 灵兽面板
function showBeastPanel() {
  const p = G.player;
  if (!p) return;
  const beasts = getBeasts();
  const bdKeys = Object.keys(BEAST_DB);
  
  let html = '<div style="padding:2px;">';
  html += '<div style="font-size:11px;color:var(--text-dim);margin-bottom:8px;">🐾 灵兽伙伴，与你同修。驯服、培养、并肩作战。</div>';
  
  if (beasts.length === 0) {
    html += '<div style="text-align:center;padding:16px;color:var(--text-dim);font-size:11px;">你还没有灵兽伙伴。<br>在野外战斗、秘境奇遇中有机会获得灵兽。</div>';
    html += '<div style="margin-top:8px;font-size:10px;color:var(--text-dim);">📖 灵兽图鉴：</div>';
    bdKeys.forEach(id => {
      const bd = BEAST_DB[id];
      html += `<div style="border:1px solid rgba(255,255,255,0.08);border-radius:6px;padding:6px 8px;margin:3px 0;font-size:10px;">
        <span>${bd.icon} ${bd.name}</span>
        <span style="float:right;color:${bd.rarity === '凡兽' ? '#9a9a9a' : '#4caf50'};">${bd.rarity}</span>
        <div style="font-size:9px;color:var(--text-dim);">${bd.desc}</div>
        <div style="font-size:9px;color:#8cc;">能力：${bd.ability} · 出没：${getSceneName2(bd.catchScene)}</div>
      </div>`;
    });
  } else {
    html += '<div style="font-weight:bold;font-size:12px;margin-bottom:6px;">🐾 我的灵兽（' + beasts.length + '/4）</div>';
    html += '<div style="font-size:9px;color:var(--text-dim);margin-bottom:6px;">🌟 主战灵兽战斗贡献更高；获得更强灵兽时自动切换。</div>';
    beasts.forEach((b, idx) => {
      const bd = BEAST_DB[b.id];
      if (!bd) return;
      const isAct = !!b.active;
      html += `<div style="border:1px solid ${isAct ? 'rgba(232,200,138,0.4)' : 'rgba(120,200,180,0.25)'};border-radius:8px;padding:8px;margin:5px 0;background:${isAct ? 'rgba(120,90,30,0.08)' : 'rgba(30,100,80,0.05)'};">
        <div style="display:flex;justify-content:space-between;align-items:center;">
          <span style="font-size:13px;font-weight:bold;color:#7dce9a;">${bd.icon} ${b.name} ${isAct ? '<span style="font-size:9px;color:#e8c88a;">🌟主战</span>' : ''} <span style="font-size:9px;color:#9a9a9a;">Lv.${b.level}</span></span>
          <span style="font-size:9px;color:#8cc;">${bd.ability} · ${bd.rarity}</span>
        </div>
        <div style="font-size:10px;color:var(--text-dim);margin:3px 0;">❤️ ${b.hp}/${b.maxHp} · ⚔️ ${b.attack} · 💨 ${b.speed.toFixed(1)}</div>
        <div style="display:flex;align-items:center;gap:4px;font-size:9px;color:var(--text-dim);">
          <span>经验</span>
          <div class="progress-bar-bg" style="height:4px;flex:1;"><div class="progress-bar-fill" style="width:${Math.min(100, b.exp / (b.level * 30) * 100)}%;height:4px;background:#7dce9a;"></div></div>
          <span>${Math.min(100, Math.round(b.exp / (b.level * 30) * 100))}%</span>
        </div>
        <div style="display:flex;gap:4px;margin-top:4px;">
          <span style="font-size:9px;color:#e8c88a;">亲密度 ${b.mood}/100</span>
          ${b.hp <= 0 ? '<span style="font-size:9px;color:#e74c3c;">💔 重伤休养中</span>' : ''}
        </div>
        <div style="margin-top:5px;display:flex;gap:4px;">
          <button class="event-choice-btn" onclick="showFeedBeastMenu(${idx})" style="font-size:10px;padding:3px 8px;">🍎 喂食</button>
          ${isAct ? '' : `<button class="event-choice-btn" onclick="setActiveBeast(${idx})" style="font-size:10px;padding:3px 8px;">🌟 设为出战</button>`}
        </div>
      </div>`;
    });
  }
  
  html += '</div>';
  showCustomModal('🐾 灵兽', html + '<button class="event-choice-btn" onclick="closeEvent()">关闭</button>');
}

// 喂食菜单
function showFeedBeastMenu(beastIdx) {
  const p = G.player;
  const b = p.beasts[beastIdx];
  if (!b) return;
  const bd = BEAST_DB[b.id];
  const edible = p.inventory.filter(it => {
    const item = ITEM_DB.find(x => x.id === it.id);
    return item && (item.type === '灵草' || item.herbEffect || ['hgc_grass','xuelian','lingquan_shui','yunqi_cao','wudao_ye'].includes(item.id));
  });
  let html = `<div style="font-size:11px;color:var(--text-dim);margin-bottom:6px;">${bd.icon} ${b.name} 吃什么好呢？（灵草经验更多）</div>`;
  if (edible.length === 0) {
    html += '<div style="padding:10px;color:var(--text-dim);font-size:11px;text-align:center;">背包里没有可喂食的灵草。</div>';
  }
  edible.forEach(it => {
    const item = ITEM_DB.find(x => x.id === it.id);
    if (!item) return;
    const exp = item.type === '灵草' ? 25 : (item.herbEffect ? 40 : 10);
    html += `<button class="event-choice-btn" style="display:block;width:100%;margin:3px 0;text-align:left;font-size:11px;" onclick="feedBeast(${beastIdx}, '${it.id}')">
      🍎 ${item.name} ×${it.qty || 1} <span style="color:#8cc;font-size:9px;">+${exp}经验</span>
    </button>`;
  });
  html += '<button class="event-choice-btn" onclick="showBeastPanel()" style="font-size:10px;">返回</button>';
  showCustomModal('🍎 喂食', html);
}

// 驯服野生灵兽（战斗胜利后概率触发）
// 🔧 连续战斗未捕获 → 捕获概率累积（保底机制）：p._catchStreak 累计，每场战斗+20%基础概率
function tryCatchBeast(sceneId) {
  const p = G.player;
  if (!p) return false;
  if (!p.beasts) p.beasts = [];  // 🔧 未初始化视为空栏
  // 🔧 2026-08-05：满栏不再直接拒绝——改成能换血（自动放生最弱收更强）
  //    原逻辑 p.beasts.length >= 4 直接 return false，低级兽占满后高级兽永远进不来
  const isFull = p.beasts.length >= 4;
  // 该场景是否有可捕获灵兽
  const candidates = Object.keys(BEAST_DB).filter(id => BEAST_DB[id].catchScene === sceneId);
  if (candidates.length === 0) return false;
  // 累积捕获概率（保底）：每场战斗 +12%，5 场后必抓
  p._catchStreak = (p._catchStreak || 0) + 1;
  const bonus = Math.min(0.9, (p._catchStreak - 1) * 0.12);
  // 概率捕获
  for (const cid of candidates) {
    const bd = BEAST_DB[cid];
    const chance = Math.min(0.35, bd.catchChance + bonus);
    if (Math.random() < chance) {
      p._catchStreak = 0;  // 重置保底
      if (isFull) {
        // 满栏：能换血才收，否则放弃（不重置保底——下次仍保留累积，防止被低级耗掉）
        const weakest = getWeakestBeast();
        const newScore = beastStrength(bd) + 50;
        if (!weakest || newScore <= weakest.score) {
          addNarrative(`🐾 你遇到一只 ${bd.icon} ${bd.name} 幼崽，但你的灵兽栏已满，且它并不比你现有的更强，便没有收服。`, 'system');
          return false;
        }
      }
      addBeast(cid, `在${getSceneName2(sceneId)}战斗后，你发现一只幼崽`);
      return true;
    }
  }
  return false;
}

// 导出
window.BEAST_DB = BEAST_DB;
window.getBeasts = getBeasts;
window.addBeast = addBeast;
window.beastGainExp = beastGainExp;
window.feedBeast = feedBeast;
window.beastCombatBonus = beastCombatBonus;
window.beastStrength = beastStrength;
window.getActiveBeast = getActiveBeast;
window.setActiveBeast = setActiveBeast;
window.beastLootBonus = beastLootBonus;
window.showBeastPanel = showBeastPanel;
window.showFeedBeastMenu = showFeedBeastMenu;
window.tryCatchBeast = tryCatchBeast;
