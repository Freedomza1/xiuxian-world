// ==========================
// 自创功法·预制池
// 每类(攻伐/护体/身法/疗伤/秘术) × 每系(金木水火土) × 每阶(凡灵地天圣神)
// 同名不同阶：同系同类的功法名字随阶位变化，效果数值分档
// 特殊功能：同阶功法带独特附加效果（比江湖普通同阶功法更强）
// 使用：openSkillCreation → 按当前境界段从池中抽选 → 品质按境界保底+悟性上浮
// ==========================

// 品质阶位（index 0-5）
const CUSTOM_Q = ['凡级','灵级','地级','天级','圣级','神级'];

// 每类每系的名字模板（6个阶位各一个名字）
const CUSTOM_POOL_NAMES = {
  '攻伐术': {
    '金': ['金锋拳','金鳞剑法','破金诀','庚金剑诀','太乙金锋诀','诛仙金诀'],
    '木': ['青木掌','回春剑法','万木诀','青帝剑诀','乙木神诀','万古青木诀'],
    '水': ['寒冰掌','流水剑法','沧浪诀','玄冰剑诀','太阴水诀','天河倒卷诀'],
    '火': ['烈焰掌','焚天剑法','赤炎诀','离火剑诀','朱雀神诀','大日焚天诀'],
    '土': ['崩山拳','厚土剑法','镇岳诀','玄武剑诀','后土神诀','不灭大地诀'],
    '雷': ['奔雷拳','紫雷剑法','惊雷诀','九霄雷剑诀','紫霄神雷诀','灭世天雷诀'],
  },
  '护体诀': {
    '金': ['金甲功','玄金罩','金罡护体','太乙金身','不灭金身','万劫金身'],
    '木': ['青藤甲','木灵罩','春木护体','乙木灵身','长生木身','万古青木身'],
    '水': ['水幕功','玄水罩','寒水护体','太阴水身','玄冥水身','天河不灭身'],
    '火': ['炎甲功','赤焰罩','烈火护体','朱雀灵身','离火神身','大日焚天身'],
    '土': ['石肤功','厚土罩','大地护体','玄武灵身','后土神身','不动大地身'],
    '雷': ['雷甲功','紫电罩','天雷护体','九霄雷身','紫霄神身','万劫雷身'],
  },
  '身法': {
    '金': ['金影步','流星步','破空步','太乙遁术','庚金遁法','万剑归宗步'],
    '木': ['飞花步','青影步','踏云步','乙木遁术','万木遁法','瞬息万木步'],
    '水': ['流云步','踏浪步','凌波步','太阴遁术','玄水遁法','天河遁法'],
    '火': ['炎影步','火遁步','赤影步','朱雀遁术','离火遁法','大日遁法'],
    '土': ['磐石步','稳岳步','缩地步','玄武遁术','后土遁法','不动大地遁'],
    '雷': ['雷影步','电光步','紫电遁','九霄遁术','紫霄遁法','万雷归宗步'],
  },
  '疗伤法': {
    '金': ['金针术','金创术','金愈诀','太乙金针','庚金回春术','万愈金诀'],
    '木': ['回春术','青木愈','万木回春','乙木长春','长生回春术','万古长春诀'],
    '水': ['甘霖术','水愈术','润泽诀','太阴甘露','玄水回春术','天河润泽诀'],
    '火': ['暖阳术','灸愈术','阳愈诀','朱雀暖阳','离火回春术','大日回春诀'],
    '土': ['地脉术','土愈术','厚土养','玄武地脉','后土回春术','不动回春诀'],
    '雷': ['雷愈术','电疗术','天雷愈','九霄回春','紫霄回春术','万雷回春诀'],
  },
  '秘术': {
    '金': ['天衍术','金衍秘术','破军秘术','太乙天衍','庚金破军','诛仙天衍'],
    '木': ['生灵术','木衍秘术','青帝秘术','乙木生灵','长生青帝','万古生灵'],
    '水': ['镜花术','水衍秘术','冰魄秘术','太阴镜花','玄水冰魄','天河镜花'],
    '火': ['焚心术','火衍秘术','赤阳秘术','朱雀焚心','离火赤阳','大日焚心'],
    '土': ['镇岳术','土衍秘术','磐神秘术','玄武镇岳','后土磐神','不动镇岳'],
    '雷': ['天雷术','雷衍秘术','紫霄秘术','太乙天雷','九霄紫雷','诛仙天雷'],
  },
  // 🔧 2026-08-04：自创类型补全——吐纳法/炼体术/心法（原只有攻伐/护体/身法/疗伤/秘术/阵道/丹道）
  '吐纳法': {
    '无': ['聚气诀','周天功','灵息诀','太虚吐纳法','混元一气诀','大周天吐纳法'],
  },
  '炼体术': {
    '无': ['淬体功','锻骨诀','铜皮铁骨功','金刚不坏体','不灭圣体功','混沌炼体术'],
  },
  '心法': {
    '无': ['凝心诀','守元功','道心经','太虚心经','太上忘情诀','混沌大道心经'],
  },
  // 阵道/丹道：不分系，按阶位命名
  '阵道': {
    '无': ['聚灵阵','八卦阵','天罡阵','周天星斗阵','九曲黄河阵','诛仙剑阵'],
  },
  '丹道': {
    '无': ['炼丹术','百草经','丹方总纲','太清丹经','九转金丹术','太上丹道'],
  },
};

// 每类每系的效果模板（6个阶位数值递增）
// 攻伐：攻击+暴击/破甲/连击/群攻等；护体：防御+气血/减伤/反伤；
// 身法：闪避+探索/先手；疗伤：回血+回灵/复活；秘术：五行战斗特效
const CUSTOM_POOL_EFFECTS = {
  '攻伐术': {
    '金': { attack: [8,16,32,60,100,160], crit: [0.04,0.06,0.10,0.14,0.20,0.28], special: '破军——攻击无视部分防御' },
    '木': { attack: [7,14,28,55,95,150], lifesteal: [0.03,0.05,0.08,0.12,0.17,0.24], special: '噬灵——攻击回复自身气血' },
    '水': { attack: [7,15,30,58,98,155], freeze: [0.04,0.07,0.11,0.16,0.22,0.30], special: '凝霜——几率冻结敌人一回合' },
    '火': { attack: [9,18,35,65,110,170], burn: [0.04,0.07,0.11,0.16,0.22,0.30], special: '焚心——攻击附带灼烧持续伤害' },
    '土': { attack: [8,16,32,60,100,160], stun: [0.05,0.08,0.12,0.17,0.23,0.32], special: '镇岳——几率眩晕敌人' },
    '雷': { attack: [9,18,36,68,112,175], crit: [0.05,0.08,0.12,0.18,0.24,0.32], special: '天雷——高暴击，雷光破敌' },
  },
  '护体诀': {
    '金': { def: [8,16,32,60,100,160], hp: [30,60,120,220,360,560], special: '金罡——减伤' },
    '木': { def: [6,13,26,50,85,135], hp: [40,80,160,300,480,760], special: '青藤——气血回复' },
    '水': { def: [8,15,30,58,95,150], hp: [30,60,120,220,360,560], dodge: [0.03,0.05,0.08,0.12,0.17,0.24], special: '水幕——闪避加成' },
    '火': { def: [7,14,28,55,90,145], hp: [35,70,140,260,420,660], reflect: [0.04,0.07,0.11,0.16,0.22,0.30], special: '炎甲——反弹伤害' },
    '土': { def: [10,20,40,75,120,185], hp: [35,70,140,260,420,660], special: '厚土——减伤' },
    '雷': { def: [8,16,32,62,100,155], hp: [30,60,120,230,370,580], dodge: [0.03,0.05,0.08,0.12,0.17,0.24], special: '紫电——雷身附体，闪避+减伤' },
  },
  '身法': {
    '金': { dodge: [0.06,0.10,0.15,0.21,0.28,0.36], explore: [0.05,0.08,0.12,0.18,0.25,0.33], special: '流星——先手几率' },
    '木': { dodge: [0.05,0.09,0.14,0.20,0.27,0.35], explore: [0.08,0.12,0.18,0.26,0.35,0.45], special: '飞花——探索效率' },
    '水': { dodge: [0.07,0.11,0.16,0.22,0.29,0.37], explore: [0.05,0.08,0.12,0.18,0.25,0.33], special: '踏浪——闪避' },
    '火': { dodge: [0.06,0.10,0.15,0.21,0.28,0.36], explore: [0.04,0.07,0.10,0.15,0.22,0.30], atk: [3,6,12,22,38,60], special: '炎影——身法带攻' },
    '土': { dodge: [0.04,0.08,0.13,0.19,0.26,0.34], explore: [0.06,0.10,0.15,0.22,0.30,0.40], def: [3,6,12,22,38,60], special: '磐石——身法带防' },
    '雷': { dodge: [0.07,0.11,0.16,0.22,0.29,0.37], explore: [0.04,0.07,0.10,0.15,0.22,0.30], atk: [4,8,16,30,50,80], special: '雷影——身法带攻' },
  },
  '疗伤法': {
    '金': { hpRegen: [4,8,15,28,45,70], qiRegen: [2,4,8,15,24,38], special: '金针——回血回灵' },
    '木': { hpRegen: [6,12,22,40,65,100], hp: [10,20,40,80,130,200], special: '回春——大量回血' },
    '水': { hpRegen: [4,8,15,28,45,70], qiRegen: [3,6,12,22,35,55], special: '甘露——回灵增强' },
    '火': { hpRegen: [5,10,18,34,55,85], qiRegen: [2,4,8,15,24,38], hp: [10,20,40,80,130,200], special: '暖阳——回血回灵回上限' },
    '土': { hpRegen: [5,10,18,34,55,85], def: [4,8,16,30,50,80], special: '地脉——回血带防' },
    '雷': { hpRegen: [5,10,18,34,55,85], qiRegen: [3,6,12,22,35,55], special: '天雷愈——回血回灵' },
  },
  '秘术': {
    '金': { armorPierce: [0.06,0.10,0.15,0.22,0.30,0.40], wisdom: [2,4,7,10,14,18], special: '破甲——无视怪物部分防御' },
    '木': { lifesteal: [0.05,0.08,0.12,0.18,0.25,0.33], wisdom: [2,4,7,10,14,18], special: '噬灵——攻击回复气血' },
    '水': { freeze: [0.05,0.09,0.14,0.20,0.28,0.38], wisdom: [2,4,7,10,14,18], special: '凝霜——几率冻结敌人' },
    '火': { burn: [0.04,0.07,0.10,0.15,0.22,0.30], wisdom: [2,4,7,10,14,18], special: '焚心——灼烧持续伤害' },
    '土': { shield: [0.08,0.13,0.18,0.25,0.34,0.45], wisdom: [2,4,7,10,14,18], special: '镇岳——开场获得护盾' },
    '雷': { crit: [0.05,0.08,0.12,0.18,0.24,0.32], wisdom: [2,4,7,10,14,18], special: '天雷引——暴击凝聚天雷' },
  },
  '阵道': {
    '无': { def: [6,12,24,45,75,115], dmgReduce: [0.04,0.08,0.12,0.18,0.25,0.33], reflect: [0.05,0.10,0.15,0.22,0.30,0.40], special: '阵道护体——减伤+反弹部分伤害' },
  },
  '丹道': {
    '无': { alchemy: [0.05,0.10,0.15,0.22,0.30,0.40], pill: [0.03,0.06,0.10,0.15,0.22,0.30], wisdom: [1,2,3,5,7,9], special: '丹道通神——炼丹成功率与丹药效果提升' },
  },
  // 🔧 2026-08-04：自创类型补全——吐纳法/炼体术/心法
  '吐纳法': {
    '无': { cultSpeed: [1.05,1.15,1.30,1.50,1.80,2.20], qiRegen: [2,4,8,15,25,40], special: '吐纳周天——修炼速度与灵力恢复提升' },
  },
  '炼体术': {
    '无': { bodyCult: [1.05,1.15,1.30,1.50,1.80,2.20], hp: [20,45,90,170,280,450], def: [3,6,12,22,38,60], special: '炼体强身——炼体速度与体魄提升' },
  },
  '心法': {
    '无': { wisdom: [2,4,7,10,14,18], moodRegen: [1,2,3,5,7,10], special: '心法通明——悟性与心境恢复提升' },
  },
};

// 境界段 → 品质阶位范围（保底/上限）
const CUSTOM_TIER_MAP = [
  { min:0,  max:8,  minQ:0, maxQ:2 },   // 练气：凡~灵
  { min:9,  max:11, minQ:1, maxQ:3 },   // 筑基：灵~地
  { min:12, max:14, minQ:2, maxQ:4 },   // 金丹：地~天
  { min:15, max:17, minQ:3, maxQ:5 },   // 元婴：天~圣
  { min:18, max:20, minQ:4, maxQ:5 },   // 化神：圣~神
  { min:21, max:99, minQ:5, maxQ:5 },   // 大乘/渡劫：神
];

// 从池中生成一个自创功法（type, element, 品质阶位 qIdx）
function buildCustomSkillFromPool(type, element, qIdx, playerName) {
  const names = CUSTOM_POOL_NAMES[type] && CUSTOM_POOL_NAMES[type][element];
  if (!names) return null;
  const name = names[qIdx] || names[names.length - 1];
  const quality = CUSTOM_Q[qIdx] || '凡级';
  const tmpl = CUSTOM_POOL_EFFECTS[type] && CUSTOM_POOL_EFFECTS[type][element];
  if (!tmpl) return null;
  
  // 境界系数：数值随境界缩放（与 createCustomSkill 一致）
  const realmIdx = (G.player && G.player.qiRealmIndex) || 0;
  const realmScale = 1 + realmIdx * 0.2;
  const scale = (v) => Math.round(v * realmScale);
  const scalePct = (v) => Math.min(0.9, v * (1 + realmIdx * 0.02));
  
  const v = (arr) => (arr ? arr[qIdx] : undefined);
  const effects = {};
  
  if (type === '攻伐术') {
    if (tmpl.attack !== undefined) effects.attackBonus = scale(v(tmpl.attack));
    if (tmpl.crit) effects.critRate = scalePct(v(tmpl.crit));
    if (tmpl.lifesteal) effects.lifesteal = scalePct(v(tmpl.lifesteal));
    if (tmpl.freeze) effects.freeze = scalePct(v(tmpl.freeze));
    if (tmpl.burn) effects.burn = scalePct(v(tmpl.burn));
    if (tmpl.stun) effects.stun = scalePct(v(tmpl.stun));
    effects.special = tmpl.special;
  }
  else if (type === '护体诀') {
    if (tmpl.def !== undefined) effects.defenseBonus = scale(v(tmpl.def));
    if (tmpl.hp !== undefined) effects.hpBonus = scale(v(tmpl.hp));
    if (tmpl.dodge) effects.dodge = scalePct(v(tmpl.dodge));
    if (tmpl.reflect) effects.reflectChance = scalePct(v(tmpl.reflect));
    effects.special = tmpl.special;
  }
  else if (type === '身法') {
    if (tmpl.dodge !== undefined) effects.dodge = scalePct(v(tmpl.dodge));
    if (tmpl.explore !== undefined) effects.exploreBonus = scalePct(v(tmpl.explore));
    if (tmpl.atk) effects.attackBonus = scale(v(tmpl.atk));
    if (tmpl.def) effects.defenseBonus = scale(v(tmpl.def));
    effects.special = tmpl.special;
  }
  else if (type === '疗伤法') {
    if (tmpl.hpRegen !== undefined) effects.hpRegen = scale(v(tmpl.hpRegen));
    if (tmpl.qiRegen !== undefined) effects.qiRegen = scale(v(tmpl.qiRegen));
    if (tmpl.hp) effects.hpBonus = scale(v(tmpl.hp));
    if (tmpl.def) effects.defenseBonus = scale(v(tmpl.def));
    effects.special = tmpl.special;
  }
  else if (type === '秘术') {
    effects.wisdomBonus = v(tmpl.wisdom);
    const combat = {};
    if (tmpl.armorPierce) combat.armorPierce = scalePct(v(tmpl.armorPierce));
    if (tmpl.lifesteal) combat.lifesteal = scalePct(v(tmpl.lifesteal));
    if (tmpl.freeze) combat.freeze = scalePct(v(tmpl.freeze));
    if (tmpl.burn) combat.burn = scalePct(v(tmpl.burn));
    if (tmpl.shield) combat.shield = scalePct(v(tmpl.shield));
    effects.combat = combat;
    effects.special = tmpl.special;
  }
  else if (type === '阵道') {
    effects.defenseBonus = scale(v(tmpl.def));
    effects.damageReduce = scalePct(v(tmpl.dmgReduce));
    effects.reflectChance = scalePct(v(tmpl.reflect));
    effects.reflectRate = 0.35;
    effects.special = tmpl.special;
  }
  else if (type === '丹道') {
    effects.alchemyBonus = scalePct(v(tmpl.alchemy));
    effects.pillBonus = scalePct(v(tmpl.pill));
    effects.wisdomBonus = v(tmpl.wisdom);
    effects.special = tmpl.special;
  }
  else if (type === '吐纳法') {
    effects.cultivationSpeed = v(tmpl.cultSpeed);
    effects.qiRegen = scale(v(tmpl.qiRegen));
    effects.special = tmpl.special;
  }
  else if (type === '炼体术') {
    effects.bodyCultSpeed = v(tmpl.bodyCult);
    effects.hpBonus = scale(v(tmpl.hp));
    effects.defenseBonus = scale(v(tmpl.def));
    effects.special = tmpl.special;
  }
  else if (type === '心法') {
    effects.wisdomBonus = v(tmpl.wisdom);
    effects.moodRegen = v(tmpl.moodRegen);
    effects.special = tmpl.special;
  }
  
  // 描述
  const eleLabel = element === '无' ? '' : `（${element}系）`;
  const desc = `由${playerName}自创的${quality}${type}${eleLabel}。『${tmpl.special}』`;
  const suffixMap = { '凡级':'法','灵级':'术','地级':'经','天级':'诀','圣级':'典','神级':'道' };
  const fullName = name + '·自创';
  
  const skill = {
    id: `custom_${type}_${element}_${quality}_${Date.now()}_${Math.floor(Math.random()*9999)}`,
    name: fullName,
    quality: quality,
    type: type,
    element: element,
    desc: desc,
    effects: effects,
    learn: { realm: (typeof QI_REALMS !== 'undefined' && G.player) ? QI_REALMS[G.player.qiRealmIndex||0].name : '练气一层', special: '自创' }
  };
  return skill;
}

// 当前境界可自创的品质阶位范围
function getCustomTierRange(realmIdx) {
  const t = CUSTOM_TIER_MAP.find(t => realmIdx >= t.min && realmIdx <= t.max) || CUSTOM_TIER_MAP[0];
  return t;
}

// 🔧 读档恢复：存档里的自创功法在刷新后 SKILL_DB 中丢失（SKILL_DB 每次从 data.js 重建）
// 用 名字+品质 在池子里反查 (type, element, qIdx) 重建完整条目（保留原 id），供 recalcStats/boost 使用
function restoreCustomSkills(p) {
  try {
    if (!p || !p.skills || !p.skills.length) return 0;
    if (typeof SKILL_DB === 'undefined') return 0;
    const qOrder = ['凡级','灵级','地级','天级','圣级','神级'];
    let restored = 0;
    for (const sk of p.skills) {
      if (!sk || typeof sk.id !== 'string' || !sk.id.startsWith('custom_')) continue;
      if (SKILL_DB.find(d => d.id === sk.id)) continue;  // 已有（本次会话创建的）
      const qIdx = qOrder.indexOf(sk.quality);
      if (qIdx < 0) continue;
      // 用名字反查池子（名字唯一对应 类型×系×阶）
      let found = null;
      for (const type in CUSTOM_POOL_NAMES) {
        for (const element in CUSTOM_POOL_NAMES[type]) {
          const names = CUSTOM_POOL_NAMES[type][element];
          const idx = names.indexOf(sk.name && sk.name.replace(/·自创$/, ''));
          if (idx >= 0 && idx === qIdx) { found = { type, element, qIdx: idx }; break; }
        }
        if (found) break;
      }
      if (!found) {
        // 非池子功法（旧随机名）——用保底公式重建，至少不丢属性
        const realmIdx = p.qiRealmIndex || 0;
        const realmScale = 1 + realmIdx * 0.2;
        const qBase = [5, 10, 20, 35, 55, 80][qIdx] || 5;
        const fallback = {
          id: sk.id,
          name: sk.name || ('无名' + (sk.type||'功法') + '·自创'),
          quality: sk.quality,
          type: sk.type || '攻伐术',
          element: sk.element || '无',
          desc: (sk.name || '无名功法') + '——由' + (p.name || '修士') + '自创。',
          effects: { attackBonus: Math.round(qBase * realmScale) },
          learn: { realm: (typeof QI_REALMS !== 'undefined' && QI_REALMS[p.qiRealmIndex||0]) ? QI_REALMS[p.qiRealmIndex||0].name : '练气一层', special: '自创' }
        };
        SKILL_DB.push(fallback);
        restored++;
        continue;
      }
      const rebuilt = buildCustomSkillFromPool(found.type, found.element, found.qIdx, p.name || '修士');
      if (!rebuilt) continue;
      // 保留存档原 id（skillSlots 引用它）与品质
      rebuilt.id = sk.id;
      rebuilt.quality = sk.quality;
      if (sk.element) rebuilt.element = sk.element;
      SKILL_DB.push(rebuilt);
      restored++;
    }
    // 🔧 同步到 G.skillData：recalcStats/combat 优先读 G.skillData，不同步则查不到自创功法
    if (typeof G !== 'undefined' && G.skillData && G.skillData !== SKILL_DB) {
      for (const d of SKILL_DB) {
        if (d.id && d.id.startsWith('custom_') && !G.skillData.find(x => x.id === d.id)) {
          G.skillData.push(d);
        }
      }
    }
    return restored;
  } catch(e) { return 0; }
}

window.CUSTOM_POOL_NAMES = CUSTOM_POOL_NAMES;
window.CUSTOM_POOL_EFFECTS = CUSTOM_POOL_EFFECTS;
window.CUSTOM_Q = CUSTOM_Q;
window.buildCustomSkillFromPool = buildCustomSkillFromPool;
window.getCustomTierRange = getCustomTierRange;
window.restoreCustomSkills = restoreCustomSkills;
