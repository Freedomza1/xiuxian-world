// === 唯我独仙 · Engine v2 (炼体 + 炼气 + 多维赋能) ===

// ==========================
// 境界表
// ── 炼体 1~6重（强化气血、物攻、物防）
// ── 炼气 1~6层（强化灵力、法攻、法防）
// ==========================
const BODY_REALMS = [
  // ── 炼体九重 + 铜皮→铁骨→银血→金身→玉髓→不灭→涅槃→混沌 ──
  { name:'炼体一重', cpRequired:0,    hpBonus:0,   attackBonus:0,  defenseBonus:0 },
  { name:'炼体二重', cpRequired:150,  hpBonus:30,  attackBonus:5,  defenseBonus:4 },
  { name:'炼体三重', cpRequired:400,  hpBonus:60,  attackBonus:10, defenseBonus:8 },
  { name:'炼体四重', cpRequired:900,  hpBonus:100, attackBonus:16, defenseBonus:13 },
  { name:'炼体五重', cpRequired:1600, hpBonus:150, attackBonus:23, defenseBonus:19 },
  { name:'炼体六重', cpRequired:2500, hpBonus:220, attackBonus:30, defenseBonus:26 },
  { name:'炼体七重', cpRequired:3800, hpBonus:300, attackBonus:38, defenseBonus:34 },
  { name:'炼体八重', cpRequired:5500, hpBonus:400, attackBonus:48, defenseBonus:43 },
  { name:'炼体九重', cpRequired:8000, hpBonus:520, attackBonus:60, defenseBonus:53 },
  { name:'铜皮境', cpRequired:12000, hpBonus:680, attackBonus:78, defenseBonus:68 },
  { name:'铁骨境', cpRequired:20000, hpBonus:900, attackBonus:100, defenseBonus:88 },
  { name:'银血境', cpRequired:35000, hpBonus:1200,attackBonus:130, defenseBonus:115 },
  { name:'金身境', cpRequired:60000, hpBonus:1600,attackBonus:175, defenseBonus:150 },
  { name:'玉髓境', cpRequired:100000,hpBonus:2200,attackBonus:240, defenseBonus:200 },
  { name:'不灭体', cpRequired:200000,hpBonus:3200,attackBonus:340, defenseBonus:280 },
  { name:'涅槃境', cpRequired:400000,hpBonus:4800,attackBonus:500, defenseBonus:400 },
  { name:'混沌体', cpRequired:800000,hpBonus:7000,attackBonus:750, defenseBonus:580 },
  // ── 混沌之后 · 六重道体 ──
  { name:'道身境', cpRequired:1500000,hpBonus:10000,attackBonus:1100,defenseBonus:850, qiRealmGate:18  },
  { name:'圣体境', cpRequired:3000000,hpBonus:15000,attackBonus:1600,defenseBonus:1200,qiRealmGate:19 },
  { name:'神魔体', cpRequired:6000000,hpBonus:24000,attackBonus:2400,defenseBonus:1800,qiRealmGate:20 },
  { name:'不朽体', cpRequired:12000000,hpBonus:38000,attackBonus:3600,defenseBonus:2700,qiRealmGate:21 },
  { name:'开天体', cpRequired:25000000,hpBonus:60000,attackBonus:5500,defenseBonus:4000,qiRealmGate:22 },
  { name:'鸿蒙道体', cpRequired:50000000,hpBonus:100000,attackBonus:8500,defenseBonus:6000,qiRealmGate:23 },
];

const QI_REALMS = [
  // ── 练气九层 · 筑基 → 金丹 → 元婴 → 化神 → 大乘 → 渡劫 → 飞升 ──
  { name:'练气一层', cpRequired:0,     qiBase:100, hpBase:50,  attackBase:10, defenseBase:8 },
  { name:'练气二层', cpRequired:200,   qiBase:120, hpBase:70,  attackBase:15, defenseBase:11 },
  { name:'练气三层', cpRequired:600,   qiBase:140, hpBase:95,  attackBase:21, defenseBase:15 },
  { name:'练气四层', cpRequired:1400,  qiBase:165, hpBase:125, attackBase:28, defenseBase:20 },
  { name:'练气五层', cpRequired:2600,  qiBase:195, hpBase:160, attackBase:36, defenseBase:26 },
  { name:'练气六层', cpRequired:4000,  qiBase:230, hpBase:200, attackBase:45, defenseBase:33 },
  { name:'练气七层', cpRequired:5600,  qiBase:270, hpBase:245, attackBase:55, defenseBase:41 },
  { name:'练气八层', cpRequired:7500,  qiBase:315, hpBase:295, attackBase:66, defenseBase:50 },
  { name:'练气九层', cpRequired:10000, qiBase:365, hpBase:350, attackBase:78, defenseBase:60 },
  { name:'筑基初阶', cpRequired:15000, qiBase:450, hpBase:450, attackBase:100, defenseBase:75 },
  { name:'筑基中阶', cpRequired:25000, qiBase:580, hpBase:580, attackBase:130, defenseBase:95 },
  { name:'筑基高阶', cpRequired:40000, qiBase:750, hpBase:750, attackBase:170, defenseBase:120 },
  { name:'金丹初阶', cpRequired:65000, qiBase:1000,hpBase:1000,attackBase:220, defenseBase:155 },
  { name:'金丹中阶', cpRequired:100000,qiBase:1350,hpBase:1350,attackBase:285, defenseBase:200 },
  { name:'金丹高阶', cpRequired:150000,qiBase:1800,hpBase:1800,attackBase:370, defenseBase:260 },
  { name:'元婴初阶', cpRequired:250000,qiBase:2500,hpBase:2500,attackBase:500, defenseBase:340 },
  { name:'元婴中阶', cpRequired:400000,qiBase:3400,hpBase:3400,attackBase:660, defenseBase:440 },
  { name:'元婴高阶', cpRequired:650000,qiBase:4600,hpBase:4600,attackBase:870, defenseBase:570 },
  { name:'化神初阶', cpRequired:1000000,qiBase:6500,hpBase:6500,attackBase:1150, defenseBase:740 },
  { name:'化神中阶', cpRequired:1600000,qiBase:8800,hpBase:8800,attackBase:1520, defenseBase:960 },
  { name:'化神高阶', cpRequired:2500000,qiBase:12000,hpBase:12000,attackBase:2000, defenseBase:1250 },
  { name:'大乘', cpRequired:4000000,qiBase:17000,hpBase:17000,attackBase:2700, defenseBase:1650 },
  { name:'渡劫', cpRequired:6500000,qiBase:24000,hpBase:24000,attackBase:3600, defenseBase:2200 },
  { name:'飞升', cpRequired:10000000,qiBase:33000,hpBase:33000,attackBase:5000, defenseBase:3000 },
];

const ROOT_TYPES = {
  '金':{emoji:'🪙',color:'#c9a96e',desc:'锋锐内敛，攻伐犀利'},
  '土':{emoji:'🟤',color:'#8a7a5a',desc:'根基稳固，厚德载物'},
  '火':{emoji:'🔥',color:'#d46a3a',desc:'霸道凌厉，焚尽万物'},
  '水':{emoji:'💧',color:'#6a9ec9',desc:'上善若水，包容万象'},
  '木':{emoji:'🌿',color:'#5a9a6a',desc:'生生不息，枯木逢春'},
};



// ==========================
// 境界名称 ⇄ 索引转换（统一入口）
// ==========================
function parseQiRealm(realmStr) {
  // 直接返回 QI_REALMS 中匹配的索引，支持模糊匹配
  if (!realmStr) return null;
  const qr = typeof QI_REALMS !== 'undefined' ? QI_REALMS : [];
  for (let i = 0; i < qr.length; i++) {
    if (qr[i].name === realmStr) return i + 1; // +1 因为 >= 比较
  }
  // 尝试模糊匹配
  const clean = realmStr.replace('层','').replace('阶','');
  for (let i = 0; i < qr.length; i++) {
    if (qr[i].name.includes(clean)) return i + 1;
    if (clean.includes(qr[i].name.split(/[初|中|高|阶|层]/)[0])) return i + 1;
  }
  return null;
}
const SKILL_SLOTS = {
  '吐纳法': { slot:'tuna', label:'🧘 吐纳', desc:'修炼效率与灵力恢复' },
  '炼体术': { slot:'lianti', label:'💪 炼体', desc:'体魄与气血' },
  '攻伐术': { slot:'gongfa', label:'⚔️ 攻伐', desc:'攻击与暴击' },
  '护体诀': { slot:'huti', label:'🛡️ 护体', desc:'防御与减伤' },
  '身法':   { slot:'shenfa', label:'💨 身法', desc:'闪避与探索效率' },
  '疗伤法': { slot:'liaoshang', label:'💚 疗伤', desc:'气血灵力恢复' },
  '心法':   { slot:'xinfa', label:'☯️ 心法', desc:'心境与悟性' },
  '秘术':   { slot:'mishu', label:'🔮 秘术', desc:'特殊效果' },
  '阵道':   { slot:'zhendao', label:'🌀 阵道', desc:'阵法与防御' },
  '丹道':   { slot:'dandao', label:'⚗️ 丹道', desc:'炼丹与突破' },
};

// ==========================
// 全局状态
// ==========================
const G = {
  player: null,
  skillData: null,
  itemData: null,
  worldData: null,
  eventData: null,
  currentScene: null,
  turn: 0,
  time: { day:1, hour:8, period:'晨', year:1, lastOfflineSync: 0 },
  narrativeHistory: [],
};

// ==========================
// 玩家创建
// ==========================
function createPlayerFromFortune(fortune, name, options) {
  options = options || {};
  const gender = options.gender || (Math.random() < 0.5 ? '男' : '女');
  const originId = options.origin || 'shijia';
  const originData = (typeof CHARACTER_ORIGINS !== 'undefined' ? CHARACTER_ORIGINS : []).find(o => o.id === originId) || { name:'散修', desc:'', bonus:{}, emoji:'🌄' };
  
  // 随机修炼天赋
  const talentSeed = Math.floor(Math.random() * 5);
  const talent = 0.8 + talentSeed * 0.14;
  const talentLabels = ['平庸', '普通', '尚佳', '上等', '天才'];
  const talentLabel = talentLabels[talentSeed];
  
  // 外貌随机生成（⚠️ 注意：先算数字再转字符串，避免字符串拼接bug）
  const height = gender === '男' ? String(170 + Math.floor(Math.random() * 11)) : String(158 + Math.floor(Math.random() * 11));
  const bodyTypes = ['挺拔', '清瘦', '匀称', '纤细', '健硕'];
  const bodyType = bodyTypes[Math.floor(Math.random() * bodyTypes.length)];
  const appearances = {
    '男': ['剑眉星目', '面容清秀', '棱角分明', '温文尔雅', '粗犷豪迈', '俊朗不凡', '眼神深邃', '嘴角常带笑意'],
    '女': ['明眸皓齿', '清丽脱俗', '温婉可人', '冷艳孤傲', '灵动俏皮', '端庄秀美', '眉眼含春', '笑靥如花'],
  };
  const appr = appearances[gender] || appearances['男'];
  const appearance = appr[Math.floor(Math.random() * appr.length)];
  
  // 性格倾向
  const personalities = ['沉静内敛', '爽朗豁达', '谨慎细心', '豪放不羁', '温和敦厚', '坚韧执着', '聪慧机敏', '淡泊从容'];
  const personality = personalities[Math.floor(Math.random() * personalities.length)];
  
  // 出身加成
  const originBonus = originData.bonus || {};
  
  const p = {
    // ── 人格特征 ──
    name: name || '夜如水',
    gender: gender,
    origin: originId,
    originName: originData.name,
    originEmoji: originData.emoji || '🌄',
    originDesc: originData.desc || '',
    appearance: appearance,
    bodyType: bodyType,
    height: height,
    personality: personality,
    // ── 修炼资质 ──
    talent: talent + (originBonus.talentBonus || 0),
    talentLabel: talentLabel,
    // ── 境界 ──
    bodyRealmIndex: 0,
    bodyCultivationPoints: 0,
    qiRealmIndex: 0,
    qiCultivationPoints: 0,
    // ── 灵根 ──
    spiritRoots: fortune.roots,
    // ── 资质 ──
    luck: Math.min(100, (fortune.luck || 50) + (originBonus.luck || 0)),
    wisdom: Math.min(100, (fortune.wisdom || 50) + (originBonus.wisdom || 0)),
    bone: Math.min(100, (fortune.bone || 50) + (originBonus.bone || 0)),
    mood: Math.round((fortune.mood || 50) + (originBonus.affinity || 0)),
    // ── 命格 ──
    fortune: fortune.fortune.name,
    fortuneDesc: fortune.fortune.desc,
    // ── 生理 ──
    age: 16,
    maxAge: Math.max(120, (typeof getMaxAgeForRealm === 'function' ? getMaxAgeForRealm(0, 0) : 120)),
    // ── 战斗属性 ──
    qi: 100 + (originBonus.qiBonus || 0), maxQi: 100 + (originBonus.qiBonus || 0),
    hp: 100 + (originBonus.startHp || 0), maxHp: 100 + (originBonus.startHp || 0),
    attack: 10, defense: 8,
    // ── 特殊加成（出身给的各种隐藏被动） ──
    exploreBonus: originBonus.exploreBonus || 0,
    combatBonus: originBonus.combatBonus || 0,
    tradeDiscount: originBonus.tradeDiscount || 0,
    // ── 道心 ──
    daoHeart: 50,
    // ── 资源 ──
    stones: (fortune.stones || 10) + (originBonus.stones || 0),
    // ── 出身加成标记 ──
    _originBonus: originBonus,
    // ── 功法 ──
    skills: (function(){
      const baseSkills = [];
      // 只给天命送的随机技能（1本吐纳法或炼体术），其他全靠自己发现/购买
      if (fortune.startSkill) {
        baseSkills.push({ id: fortune.startSkill.id, name: fortune.startSkill.name, quality: fortune.startSkill.quality,
          type: fortune.startSkill.type, active: true, mastered: true });
      }
      return baseSkills;
    })(),
    activeSkillIndex: 0,
    // ── 装备 (四部位: weapon/armor/accessory/head/shoes) ──
    equipment: (() => {
      var eq = { weapon: null, armor: null, accessory: null, head: null, shoes: null };
      if (fortune.startEquip) {
        // 🔧 按装备部位正确放置（startEquip 可能是任意部位的初始装备）
        var startSlot = null;
        if (typeof getEquipSlot === 'function') {
          try { startSlot = getEquipSlot({ id: fortune.startEquip.id, type: fortune.startEquip.type, category: fortune.startEquip.category }); } catch(e) {}
        }
        if (!startSlot) startSlot = 'weapon';
        eq[startSlot] = { id: fortune.startEquip.id, name: fortune.startEquip.name, type: fortune.startEquip.type,
                      effects: fortune.startEquip.equipEffect || {} };
      }
      return eq;
    })(),
    // ── 空间戒指 ──
    storageRing: {
      name: '初阶储物戒',
      capacity: 12,  // 基础可放12种不同物品
      currentLoad: 0,
      level: 1,
      upgradeCost: 50,
      upgradeDesc: '扩容至20格',
    },
    // ── 背包 (引用 ITEM_DB) ──
    inventory: (() => {
      const inv = [];
      if (fortune.startPill) inv.push({ id: fortune.startPill.id, name: fortune.startPill.name, type: fortune.startPill.type,
        qty: 1 + (originBonus.startPillCount || 0), value: fortune.startPill.value, use: fortune.startPill.use || null });
      // 药农之后多几种草
      if (originBonus.herbAffinity && typeof ITEM_DB !== 'undefined') {
        const herbs = ITEM_DB.filter(i => i.type === '灵草');
        herbs.slice(0, 2).forEach(h => inv.push({ id: h.id, name: h.name, type: h.type, qty: 2, value: h.value, use: h.use || null }));
      }
      return inv;
    })(),
    // ── 功法槽位（每种类型只能激活一本）──
    skillSlots: {
      tuna: null, lianti: null, gongfa: null,
      huti: null, shenfa: null, liaoshang: null,
      mishu: null, xinfa: null, zhendao: null, dandao: null
    },
    // ── 任务 ──
    activeQuests: [],
    completedQuests: [],
    killLog: {}, // {'山贼头目':3}
    // ── 秘境 ──
    unlockedRealms: [],
    realmEntries: {}, // { 'leiyin_pass': 1 }, 今日进入次数
    // ── 储物箱（存珍贵物品）──
    storageBox: [],
    // ── 自动出售标记 ──
    autoSellEnabled: true,
    // ── 记录 ──
    isAlive: true,
    achievements: [],
    eventHistory: [],
    relationships: [],
    fame: 0,
  };

  // 初始化属性
  recalcStats(p);
  autoEquipSkills(p); // 自动配装
  p.qi = p.maxQi;
  p.hp = p.maxHp;
  return p;
}

function ensureMasteryFields(p) {
  if (!p || !p.skills) return;
  p.skills.forEach(sk => {
    if (sk.masteryLevel === undefined) sk.masteryLevel = 0;
    if (sk.masteryXp === undefined) sk.masteryXp = 0;
    if (!sk.element) {
      const sd = (G.skillData || typeof SKILL_DB !== "undefined" ? SKILL_DB : []).find(d => d.id === sk.id);
      sk.element = sd ? (sd.element || "无") : "无";
    }
  });
}

// 🔧 2026-08-03：饰品多件支持——统一遍历槽位装备
// 单件槽（weapon/armor/head/shoes）返回 [item] 或 []；accessory 返回数组（每件饰品）
// 🔧 2026-08-04：回调统一传 effects（原传整个 item 导致 e.attackBonus 读不到——装备加成全失效！）
function forEachEquipItem(slot, fn) {
  const eq = G.player ? G.player.equipment : null;
  if (!eq) return;
  const item = eq[slot];
  if (!item) return;
  if (slot === 'accessory') {
    if (Array.isArray(item)) {
      item.forEach(function(it) { if (it && it.effects) fn(it.effects); });
    } else if (item.effects) {
      // 兼容旧档单对象
      fn(item.effects);
    }
  } else if (item.effects) {
    fn(item.effects);
  }
}

// 🔧 饰品多件：获取某槽位装备数（accessory 返回数组长度）
function getEquipCount(slot) {
  const eq = G.player ? G.player.equipment : null;
  if (!eq || !eq[slot]) return 0;
  if (slot === 'accessory' && Array.isArray(eq[slot])) return eq[slot].length;
  return 1;
}

// 🔧 饰品多件：卸载指定索引的饰品（accessory），其他槽位正常卸
function unequipSlotIndex(slot, idx) {
  const p = G.player;
  if (!p) return;
  const eq = p.equipment;
  if (!eq[slot]) return;
  if (slot === 'accessory' && Array.isArray(eq[slot])) {
    const item = eq[slot][idx];
    if (!item) return;
    addItemToInventory({ id:item.id, name:item.name, type:item.type, value:item.value, category:'装备',
      quality: item.quality || null,
      desc: item.desc || '',
      equipEffect:item.effects || null,
      sockets: item.sockets || 0, socketed: item.socketed || [],  // 💎 宝石随装备回背包
      _equipSlot: item._equipSlot || 'accessory'  // 🔧 槽位保留
    }, 1);
    eq[slot].splice(idx, 1);
    recalcStats(p);
    updateAllUI();
    addNarrative('你卸下了' + item.name + '。', 'event');
    return;
  }
  unequipSlot(slot);
}

function recalcStats(p) {
  // 🔧 确保 G.player 指向当前角色（createPlayerFromFortune 中 recalcStats 先于 G.player 赋值）
  if (p && (!G.player || G.player !== p)) {
    G.player = p;
  }
  const body = BODY_REALMS[p.bodyRealmIndex];
  const qi = QI_REALMS[p.qiRealmIndex];
  if (!body || !qi) return;

  // 基础
  let hp = qi.hpBase + body.hpBonus;
  let maxQi = qi.qiBase;
  let attack = qi.attackBase + body.attackBonus;
  let defense = qi.defenseBase + body.defenseBonus;

  // 自创功法额外属性汇总（面板展示用；战斗仍从 sd.effects 直接读，此处仅汇总显示）
  let critRate = 0, dodge = 0, exploreBonus = 0, alchemyBonus = 0, pillBonus = 0, wisdomBonus = 0;
  let damageReduce = 0, reflectChance = 0, hpRegen = 0, qiRegen = 0;
  let lifesteal = 0, freeze = 0, burn = 0, stun = 0;
  p._extraSkills = [];

  // 灵根亲和力加成（总加成乘区）
  const aff = getElementAffinity(p);
  
  // 功法加成（只算各槽位激活的功法）
  const skillDb = G.skillData && G.skillData.length ? G.skillData : (typeof SKILL_DB !== 'undefined' ? SKILL_DB : []);
  const activeSkills = new Set();
  Object.values(p.skillSlots || {}).forEach(skId => { if (skId) activeSkills.add(skId); });
  
  p.skills.forEach(sk => {
    const sd = skillDb.find(d => d.id === sk.id);
    if (!sd || !sd.effects) return;
    if (!activeSkills.has(sk.id)) return;
    
    // 熟练度系数 masterLevel 0→0.5, 5→1.15, 10→1.8
    const ml = sk.masteryLevel || 0;
    const masteryMult = 0.5 + ml * 0.13;
    
    // 五行灵根匹配（🔧 放宽：仅攻伐术/秘术/阵道这类元素功法吃灵根倍率；
    //    护体/身法/疗伤/吐纳/炼体/丹道等通用功法异系也 1.0 倍——灵根不该限制生存与辅助）
    const skEl = sd.element || sk.element || '无';
    let elementMult = 1.0;
    const elementTypes = ['攻伐术', '秘术', '阵道'];
    if (skEl !== '无' && elementTypes.includes(sd.type || '')) {
      if (skEl === p.spiritRoots[0]) elementMult = 1.5;
      else if (p.spiritRoots.length > 1 && skEl === p.spiritRoots[1]) elementMult = 1.3;
      else if (!p.spiritRoots.includes(skEl)) elementMult = 0.7;
    }
    
    const totalMult = masteryMult * elementMult;
    const e = sd.effects;
    if (e.hpBonus) hp += Math.round(e.hpBonus * totalMult);
    if (e.attackBonus) attack += Math.round(e.attackBonus * totalMult);
    if (e.defenseBonus) defense += Math.round(e.defenseBonus * totalMult);
    if (e.maxQiBonus) maxQi += Math.round(e.maxQiBonus * totalMult);

    // ── 额外属性汇总（面板展示）──
    // 百分比类按 totalMult 折算（暴击/闪避/探索/炼丹/减伤/反弹/吸血/冻结/灼烧/眩晕）
    if (e.critRate) critRate += e.critRate * totalMult;
    if (e.dodge) dodge += e.dodge * totalMult;
    if (e.exploreBonus) exploreBonus += e.exploreBonus * totalMult;
    if (e.alchemyBonus) alchemyBonus += e.alchemyBonus * totalMult;
    if (e.pillBonus) pillBonus += e.pillBonus * totalMult;
    if (e.wisdomBonus) wisdomBonus += e.wisdomBonus;
    if (e.damageReduce) damageReduce += e.damageReduce * totalMult;
    if (e.reflectChance) reflectChance += e.reflectChance * totalMult;
    if (e.hpRegen) hpRegen += Math.round(e.hpRegen * totalMult);
    if (e.qiRegen) qiRegen += Math.round(e.qiRegen * totalMult);
    if (e.lifesteal) lifesteal += e.lifesteal * totalMult;
    if (e.freeze) freeze += e.freeze * totalMult;
    if (e.burn) burn += e.burn * totalMult;
    if (e.stun) stun += e.stun * totalMult;
    // 秘术 combat 子对象
    if (e.combat) {
      if (e.combat.armorPierce) p._armorPierce = (p._armorPierce || 0) + e.combat.armorPierce * totalMult;
      if (e.combat.lifesteal) lifesteal += e.combat.lifesteal * totalMult;
      if (e.combat.freeze) freeze += e.combat.freeze * totalMult;
      if (e.combat.burn) burn += e.combat.burn * totalMult;
      if (e.combat.shield) p._combatShield = (p._combatShield || 0) + e.combat.shield * totalMult;
    }
    // 记录额外属性来源（用于面板显示）
    if (e.critRate || e.dodge || e.exploreBonus || e.alchemyBonus || e.pillBonus || e.wisdomBonus ||
        e.damageReduce || e.reflectChance || e.hpRegen || e.qiRegen || e.lifesteal || e.freeze || e.burn || e.stun || e.combat) {
      p._extraSkills.push({
        name: sk.name,
        id: sk.id,
        type: sd.type || sk.type || '',
        element: skEl,
        effects: {
          critRate: e.critRate ? e.critRate * totalMult : 0,
          dodge: e.dodge ? e.dodge * totalMult : 0,
          exploreBonus: e.exploreBonus ? e.exploreBonus * totalMult : 0,
          alchemyBonus: e.alchemyBonus ? e.alchemyBonus * totalMult : 0,
          pillBonus: e.pillBonus ? e.pillBonus * totalMult : 0,
          wisdomBonus: e.wisdomBonus || 0,
          damageReduce: e.damageReduce ? e.damageReduce * totalMult : 0,
          reflectChance: e.reflectChance ? e.reflectChance * totalMult : 0,
          hpRegen: e.hpRegen ? Math.round(e.hpRegen * totalMult) : 0,
          qiRegen: e.qiRegen ? Math.round(e.qiRegen * totalMult) : 0,
          lifesteal: e.lifesteal ? e.lifesteal * totalMult : (e.combat && e.combat.lifesteal ? e.combat.lifesteal * totalMult : 0),
          freeze: e.freeze ? e.freeze * totalMult : (e.combat && e.combat.freeze ? e.combat.freeze * totalMult : 0),
          burn: e.burn ? e.burn * totalMult : (e.combat && e.combat.burn ? e.combat.burn * totalMult : 0),
          stun: e.stun ? e.stun * totalMult : 0,
          armorPierce: e.combat && e.combat.armorPierce ? e.combat.armorPierce * totalMult : 0,
          shield: e.combat && e.combat.shield ? e.combat.shield * totalMult : 0
        }
      });
    }
  });

  // 灵根加成（加权到基础属性）
  attack = Math.round(attack * (1 + (aff.attackBoost || 0)));
  defense = Math.round(defense * (1 + (aff.defenseBoost || 0)));
  hp = Math.round(hp * (1 + (aff.hpBoost || 0)));
  maxQi = Math.round(maxQi * (1 + (aff.qiBoost || 0)));

  // 装备加成（四部位汇总，饰品可多件）
  const eqSlots = ['weapon','armor','accessory','head','shoes'];
  eqSlots.forEach(function(slot) {
    forEachEquipItem(slot, function(e) {
      if (e.attackBonus) attack += e.attackBonus;
      if (e.defenseBonus) defense += e.defenseBonus;
      if (e.hpBonus) hp += e.hpBonus;
      if (e.maxQiBonus) maxQi += e.maxQiBonus;
    });
  });
  
  // 💎 宝石镶嵌加成（独立遍历装备对象，读 socketed）
  const gemDb = (G.itemData && G.itemData.length ? G.itemData : (typeof ITEM_DB !== 'undefined' ? ITEM_DB : []));
  const eqObj = G.player.equipment || {};
  eqSlots.forEach(function(slot) {
    const eqv = eqObj[slot];
    if (!eqv) return;
    const items = slot === 'accessory' ? (Array.isArray(eqv) ? eqv : [eqv]) : [eqv];
    items.forEach(function(it) {
      if (!it || !it.socketed || !it.socketed.length) return;
      it.socketed.forEach(function(gemId) {
        const gem = gemDb.find(function(g) { return g.id === gemId; });
        if (gem && gem.gemEffect) {
          const ge = gem.gemEffect;
          if (ge.attackBonus) attack += ge.attackBonus;
          if (ge.defenseBonus) defense += ge.defenseBonus;
          if (ge.hpBonus) hp += ge.hpBonus;
          if (ge.maxQiBonus) maxQi += ge.maxQiBonus;
          if (ge.critRate) p._gemCritRate = (p._gemCritRate || 0) + ge.critRate;
        }
      });
    });
  });

  // ── 🔮 本命法宝加成（金丹期）──
  if (typeof getBenmingBonus === 'function') {
    const bmBonus = getBenmingBonus();
    if (bmBonus) {
      if (bmBonus.attack) attack += bmBonus.attack;
      if (bmBonus.defense) defense += bmBonus.defense;
      if (bmBonus.maxHp) hp += bmBonus.maxHp;
      if (bmBonus.maxQi) maxQi += bmBonus.maxQi;
      p._benmingBonus = bmBonus;
    }
  }

  // ── 💪 炼体道境被动加成（混沌体之后，先于属性赋值）──
  if (p.bodyRealmIndex >= 17) {
    p._bodyPerk = '道身境·肉身悟道：暴击率+5%，血肉之躯暗合天道';
    p._extraCritRate = 0.05;
  }
  if (p.bodyRealmIndex >= 18) {
    p._bodyPerk = '圣体境·圣光护体：每5秒抵挡一次伤害，万法不侵';
    p._shengTiGuard = true;
  }
  if (p.bodyRealmIndex >= 19) {
    p._bodyPerk = '神魔体·法天象地：一念神魔，攻防再增20%';
    attack = Math.round(attack * 1.2);
    defense = Math.round(defense * 1.2);
  }
  if (p.bodyRealmIndex >= 20) {
    p._bodyPerk = '不朽体·血肉重生：每战回血，断肢自生';
    p._buXiuRegen = true;
  }
  if (p.bodyRealmIndex >= 21) {
    p._bodyPerk = '开天体·破界神拳：一拳可裂虚空，全属性+20%';
    attack = Math.round(attack * 1.2);
    defense = Math.round(defense * 1.2);
    hp = Math.round(hp * 1.2);
    maxQi = Math.round(maxQi * 1.2);
  }
  if (p.bodyRealmIndex >= 22) {
    p._bodyPerk = '鸿蒙道体·混沌归一：肉身即道，体法双修再无界限';
    p._hongMengUnified = true;
  }

  p.maxHp = Math.round(hp);
  p.maxQi = Math.round(maxQi);
  p.attack = Math.round(attack);
  p.defense = Math.round(defense);
  p.hp = Math.min(p.hp || p.maxHp, p.maxHp);
  p.qi = Math.min(p.qi || p.maxQi, p.maxQi);

  // ── 额外属性汇总（面板展示）──
  p.critRate = critRate;
  p.dodge = dodge;
  p.exploreBonus = exploreBonus;
  p.alchemyBonus = alchemyBonus;
  p.pillBonus = pillBonus;
  p.wisdomBonus = wisdomBonus;
  p.damageReduce = damageReduce;
  p.reflectChance = reflectChance;
  p.hpRegen = hpRegen;
  p.qiRegen = qiRegen;
  p._lifesteal = lifesteal;
  p._freeze = freeze;
  p._burn = burn;
  p._stun = stun;

  // ── 从被动中清理出综合战力 ──
  // 综合战力
  p.combatPower = Math.round(attack * 2 + defense * 2 + p.maxHp * 0.5 + p.maxQi * 0.3);
  // ── 属性加成明细（用于UI面板）──
  p._statBreakdown = {
    base: { hp: qi.hpBase + body.hpBonus, maxQi: qi.qiBase, attack: qi.attackBase + body.attackBonus, defense: qi.defenseBase + body.defenseBonus },
    elementBonus: { attack: aff.attackBoost || 0, defense: aff.defenseBoost || 0, hp: aff.hpBoost || 0, qi: aff.qiBoost || 0 },
    skillBreakdown: [],
    equipment: { weapon: null, armor: null, accessory: null, head: null, shoes: null }
  };
  
  // 记录每个功法贡献
  p.skills.forEach(sk => {
    const sd = skillDb.find(d => d.id === sk.id);
    if (!sd || !sd.effects || !activeSkills.has(sk.id)) return;
    const totalMult = (0.5 + (sk.masteryLevel || 0) * 0.13) * 
      ((sd.element && sd.element !== '无' && ['攻伐术','秘术','阵道'].includes(sd.type || '') && !p.spiritRoots.includes(sd.element)) ? 0.7 : 
       sd.element === p.spiritRoots[0] ? 1.5 : p.spiritRoots.length > 1 && sd.element === p.spiritRoots[1] ? 1.3 : 1.0);
    
    p._statBreakdown.skillBreakdown.push({
      id: sk.id,
      name: sk.name,
      quality: sk.quality,
      type: sk.type,
      element: sd.element || '无',
      masteryLevel: sk.masteryLevel || 0,
      mult: Math.round(totalMult * 100) / 100,
      effects: Object.entries(sd.effects || {}).map(([k,v]) => ({ k, v: Math.round(v * totalMult) }))
    });
  });
  
  // 装备分解到统计数据
  ['weapon','armor','accessory','head','shoes'].forEach(function(slot) {
    var items = [];
    if (slot === 'accessory' && Array.isArray(p.equipment[slot])) {
      items = p.equipment[slot];
    } else if (p.equipment[slot]) {
      items = [p.equipment[slot]];
    }
    if (!p._statBreakdown.equipment[slot]) p._statBreakdown.equipment[slot] = [];
    items.forEach(function(eq) {
      if (eq && eq.effects) {
        p._statBreakdown.equipment[slot] = p._statBreakdown.equipment[slot].concat(
          Object.entries(eq.effects).map(function(e) { return { k: e[0], v: e[1] }; })
        );
      }
    });
  });
}

// ==========================
// 灵根亲和力
// ==========================
function getMasteryLevel(skillId, p) {
  const sk = (p || G.player).skills.find(s => s.id === skillId);
  return sk ? (sk.masteryLevel || 0) : 0;
}

function getMasteryBonus(skillId, p) {
  const sk = (p || G.player).skills.find(s => s.id === skillId);
  if (!sk || (sk.masteryLevel || 0) < 10) return null;
  const sd = (G.skillData || typeof SKILL_DB !== "undefined" ? SKILL_DB : []).find(d => d.id === skillId);
  if (!sd || !sd.masteryBonus) return null;
  return sd.masteryBonus;
}

function getElementAffinity(p) {
  const roots = p.spiritRoots || ['无'];
  const boost = { attackBoost:0, defenseBoost:0, hpBoost:0, qiBoost:0, fireBoost:0 };
  
  const primary = roots[0];
  const secondary = roots.length > 1 ? roots[1] : null;
  const pWeight = 0.6;
  const sWeight = secondary ? 0.3 : 0;
  
  const bonuses = {
    '金': { attackBoost:0.15, fireBoost:0.05 },
    '木': { hpBoost:0.2 },
    '水': { qiBoost:0.2 },
    '火': { attackBoost:0.1, fireBoost:0.15 },
    '土': { defenseBoost:0.2 },
  };
  
  if (bonuses[primary]) {
    Object.entries(bonuses[primary]).forEach(([k,v]) => { boost[k] += v * pWeight; });
  }
  if (secondary && bonuses[secondary]) {
    Object.entries(bonuses[secondary]).forEach(([k,v]) => { boost[k] += v * sWeight; });
  }
  
  return boost;
}

// ==========================
// 功法自动配装
// ==========================
function autoEquipSkills(p) {
  if (!p || !p.skills || !p.skillSlots) return;
  const skillDb = G.skillData || (typeof SKILL_DB !== 'undefined' ? SKILL_DB : []);
  
  const slotMap = {
    '吐纳法':'tuna','炼体术':'lianti','攻伐术':'gongfa',
    '护体诀':'huti','身法':'shenfa','疗伤法':'liaoshang','秘术':'mishu','心法':'xinfa','阵道':'zhendao','丹道':'dandao'
  };
  
  // 先把所有功法active设为false，再重新分配
  p.skills.forEach(s => s.active = false);
  
  // 每个槽位的玩家拥有的功法按品质+灵根契合度排序
  Object.entries(slotMap).forEach(([type, slot]) => {
    const candidates = p.skills.filter(s => s.type === type).map(s => {
      const sd = skillDb.find(d => d.id === s.id);
      if (!sd) return null;
      // 境界检验
      if (sd.learn && sd.learn.realm) {
        const rn = parseQiRealm(sd.learn.realm);
        if (rn && p.qiRealmIndex + 1 < rn) return null;
      }
      if (sd.learn && sd.learn.spiritRoot) {
        // 🔧 放宽：仅攻伐术/秘术/阵道硬性锁定，其余通用功法异系也可装（无契合加成）
        const rootLockedTypes = ['攻伐术', '秘术', '阵道'];
        if (rootLockedTypes.includes(sd.type || '')) {
          const hasRoot = sd.learn.spiritRoot.some(r => p.spiritRoots.includes(r));
          if (!hasRoot) return null;
        }
      }
      const qualityScore = ['凡级','灵级','地级','天级','圣级','神级'].indexOf(sd.quality);
      // 灵根契合加分
      const aff = getElementAffinity(p);
      let elementBonus = 0;
      if (sd.element === p.spiritRoots[0]) elementBonus = 2;
      else if (sd.element === (p.spiritRoots[1] || '')) elementBonus = 1;
      return { skillId: s.id, score: qualityScore * 10 + elementBonus };
    }).filter(Boolean);
    
    candidates.sort((a, b) => b.score - a.score);
    if (candidates.length > 0) {
      p.skillSlots[slot] = candidates[0].skillId;
      const skillObj = p.skills.find(s => s.id === candidates[0].skillId);
      if (skillObj) { skillObj.active = true; }
    }
  });
  
  recalcStats(p);
}

// ==========================
// 战力评级
// ==========================
function getCombatPowerRank() {
  var p = G.player;
  if (!p) return '未知';
  var qiName = QI_REALMS[p.qiRealmIndex] ? QI_REALMS[p.qiRealmIndex].name : '凡人';
  var bodyName = BODY_REALMS[p.bodyRealmIndex] ? BODY_REALMS[p.bodyRealmIndex].name : '凡体';
  return qiName + ' · ' + bodyName;
}

// ==========================
// 辅助函数
// ==========================
function getBodyRealm() { return BODY_REALMS[G.player.bodyRealmIndex] || BODY_REALMS[0] || {name:'凡体'}; }
function getQiRealm() { return QI_REALMS[G.player.qiRealmIndex] || QI_REALMS[0] || {name:'凡人'}; }
function getRealmLabel() {
  return `${getBodyRealm().name} · ${getQiRealm().name}`;
}

function getCultivationProgress(realmType) {
  if (realmType === 'body') {
    const r = getBodyRealm();
    if (G.player.bodyRealmIndex >= BODY_REALMS.length - 1) return 100;
    const next = BODY_REALMS[G.player.bodyRealmIndex + 1];
    const have = G.player.bodyCultivationPoints - r.cpRequired;
    const need = next.cpRequired - r.cpRequired;
    return Math.min(100, Math.max(0, (have / need) * 100));
  } else {
    const r = getQiRealm();
    if (G.player.qiRealmIndex >= QI_REALMS.length - 1) return 100;
    const next = QI_REALMS[G.player.qiRealmIndex + 1];
    const have = G.player.qiCultivationPoints - r.cpRequired;
    const need = next.cpRequired - r.cpRequired;
    return Math.min(100, Math.max(0, (have / need) * 100));
  }
}

// ═══════════════════════════════════════════════
// 🔄 修为溢出流转（2026-08-04）
// 炼气圆满（飞升）后，再获得的炼气修为自动流入炼体；
// 炼体圆满（鸿蒙道体）后，再获得的炼体修为自动流入炼气。
// 双圆满则修为不再累积（封顶）。
// 统一入口：gainCultivation('qi'|'body', amount)
// ═══════════════════════════════════════════════
function isQiAscended() {
  return !!(G && G.player && G.player.qiRealmIndex >= QI_REALMS.length - 1);
}
function isBodyPerfected() {
  return !!(G && G.player && G.player.bodyRealmIndex >= BODY_REALMS.length - 1);
}

// 核心：给某一路径加修为，若该路径已圆满则溢出到另一路径
function gainCultivation(type, amount) {
  if (!G || !G.player || !amount || amount <= 0) return 0;
  const p = G.player;
  let given = 0;
  if (type === 'body') {
    if (!isBodyPerfected()) {
      p.bodyCultivationPoints = (p.bodyCultivationPoints || 0) + amount;
      given = amount;
    } else if (!isQiAscended()) {
      // 炼体圆满 → 溢出到炼气
      p.qiCultivationPoints = (p.qiCultivationPoints || 0) + amount;
      given = amount;
    }
  } else {
    if (!isQiAscended()) {
      p.qiCultivationPoints = (p.qiCultivationPoints || 0) + amount;
      given = amount;
    } else if (!isBodyPerfected()) {
      // 炼气圆满 → 溢出到炼体
      p.bodyCultivationPoints = (p.bodyCultivationPoints || 0) + amount;
      given = amount;
    }
  }
  if (given > 0) {
    // 🔧 2026-08-04 修复：修为增加后立即触发突破检查——
    //    之前只有手动炼体/特定流程调 bodyBreakthroughCheck，
    //    打怪炼体（gainBodyCultivationFromCombat）等来源修为满了不突破，
    //    进度条卡 100% 封顶，看起来“炼体不见增加”
    try {
      if (type === 'body') {
        if (typeof bodyBreakthroughCheck === 'function') bodyBreakthroughCheck();
      } else {
        if (typeof qiBreakthroughCheck === 'function') qiBreakthroughCheck();
      }
    } catch(e) {}
    // 溢出时提示（不刷屏：仅当确实发生跨道流转）
    if ((type === 'qi' && isQiAscended() && !isBodyPerfected()) ||
        (type === 'body' && isBodyPerfected() && !isQiAscended())) {
      if (typeof addNarrative === 'function') {
        const targetName = type === 'qi' ? (BODY_REALMS[p.bodyRealmIndex] ? BODY_REALMS[p.bodyRealmIndex].name : '炼体') : (QI_REALMS[p.qiRealmIndex] ? QI_REALMS[p.qiRealmIndex].name : '炼气');
        addNarrative(`🔄 道途已满，修为如水归海——${amount}修为汇入${targetName}！`, 'system');
      }
    }
  }
  return given;
}
window.gainCultivation = gainCultivation;

const PERIOD_NAMES_G = ['子时·夜半','丑时·鸡鸣','寅时·平旦','卯时·日出','辰时·食时','巳时·隅中','午时·日中','未时·日昳','申时·晡时','酉时·日入','戌时·黄昏','亥时·人定'];

function advanceTime(hours) {
  if (!G || !G.player || !G.time) return;
  if (typeof checkDayChange === "function") checkDayChange();
  G.time.hour += hours;
  const prevDay = G.time.day;
  while (G.time.hour >= 24) { G.time.hour -= 24; G.time.day++; if (G.time.day % 360 === 0) G.time.year++; G.player.age += 1/30; }
  // 🎊 节日检测（跨天时提示今日节日）
  if (G.time.day !== prevDay && typeof checkFestival === 'function') {
    try { checkFestival(); } catch(e) {}
  }
  const idx = Math.floor((G.time.hour + 1) / 2) % 12;
  G.time.period = PERIOD_NAMES_G[idx];
  G.player.qi = Math.max(0, G.player.qi - hours * 0.5);
  // 试炼塔每日重置检查
  if (typeof checkTowerDailyReset === 'function') checkTowerDailyReset();
  // 世界NPC生命周期推进
  if (typeof tickWorldLifecycle === 'function' && hours > 0) {
    tickWorldLifecycle(hours / 24);
  }
  // 存档角色NPC漫游
  if (typeof roamPlayerNPCs === 'function' && Math.random() < 0.3) roamPlayerNPCs();
  
  // 心境自然恢复（每小时缓慢回升）
  var moodRecovery = hours * 0.3;
  // 🔧 2026-08-04：心法 moodRegen 加成（自创心法/合欢诀等）——每小时额外回心境
  try {
    var moodBoost = 0;
    (G.player.skills || []).forEach(function(sk) {
      var sd = (typeof G.skillData !== 'undefined' && G.skillData.find ? G.skillData.find(d => d.id === sk.id) : null) || (typeof SKILL_DB !== 'undefined' && SKILL_DB.find ? SKILL_DB.find(d => d.id === sk.id) : null);
      if (sd && sd.effects && sd.effects.moodRegen) moodBoost += sd.effects.moodRegen;
    });
    if (moodBoost > 0) moodRecovery += hours * moodBoost;
  } catch(e) {}
  // 安全/自然场景加成
  var curScene = typeof getSceneData === 'function' ? getSceneData(G.currentScene) : null;
  if (curScene) {
    if (curScene.safe) moodRecovery += hours * 0.2;
    if (curScene.qiLevel >= 6) moodRecovery += hours * 0.3;  // 高灵气场景滋养心神
  }
  // 白天恢复更快
  if (G.time.period && (G.time.period.indexOf('晨') >= 0 || G.time.period.indexOf('午') >= 0 || G.time.period.indexOf('昼') >= 0)) {
    moodRecovery += hours * 0.15;
  }
  G.player.mood = Math.min(100, Math.round((G.player.mood || 50) + moodRecovery));
  
  // 世界事件（每天检查一次）
  if (typeof checkWorldEvents === 'function') {
    if (!G._lastEventCheckDay || G._lastEventCheckDay !== G.time.day) {
      G._lastEventCheckDay = G.time.day;
      checkWorldEvents();
    }
  }
  
  // ═══════ 寿元系统：警告 + 死亡 ═══════
  var lifeRatio = G.player.age / G.player.maxAge;
  var dayCount = Math.floor(G.time.day);
  
  // 寿元将尽预警（不同阶段不同紧迫度）
  if (lifeRatio >= 0.95 && !G.player._lifeDeathWarned) {
    addNarrative(`☠️ ⚠️ 你的寿元仅剩不足5%！若不尽快突破，大限将至！`, 'system');
    G.player._lifeDeathWarned = true;
  } else if (lifeRatio >= 0.85 && lifeRatio < 0.95 && !G.player._lifeCriticalWarned) {
    addNarrative(`⏳ 白发生，道心摇。你已感到体内生机在流失……寿元还剩${Math.round((1-lifeRatio)*100)}%。`, 'system');
    G.player._lifeCriticalWarned = true;
  } else if (lifeRatio >= 0.70 && lifeRatio < 0.85 && !G.player._lifeYellowWarned) {
    addNarrative(`🍂 不知不觉，道心微澜。${Math.round(G.player.age)}岁了——半生已过，修为几何？`, 'system');
    G.player._lifeYellowWarned = true;
  } else if (lifeRatio >= 0.5 && lifeRatio < 0.65 && !G.player._lifeMidWarned) {
    addNarrative(`📅 ${Math.round(G.player.age)}岁，修行之路刚刚走了一半。前路漫漫，时不我待。`, 'system');
    G.player._lifeMidWarned = true;
  }
  
  // 大限降临
  if (G.player.age >= G.player.maxAge && G.player.isAlive !== false) {
    G.player.isAlive = false;
    addNarrative(`☠️ 【大限已至】${G.player.name}，${Math.round(G.player.age)}载修行，终究未能逆转生死……`, 'event');
    if (typeof triggerReincarnation === 'function') triggerReincarnation();
  }
}

// ==========================
// 修炼系统
// ==========================
// DEBUG: 全局修炼速度倍率（通过浏览器控制台设置）


function getCultivationMultiplier(type) {
  let mult = 1.0;
  const p = G.player;
  const period = G.time.period;

  // DEBUG 修炼加速
  

  // 境界加速——高境界修炼效率指数级提升
  const realmBoost = 1 + (p.qiRealmIndex || 0) * 0.5;
  mult *= realmBoost;

  // 时辰加成（匹配十二时辰制）
  if (period.indexOf('夜半') !== -1 || period.indexOf('鸡鸣') !== -1 || period.indexOf('人定') !== -1) mult *= 1.15;
  if (period.indexOf('日出') !== -1 || period.indexOf('食时') !== -1) mult *= 1.1;

  // ═══════ 场景灵气·境界匹配度 — 核心修炼约束 ═══════
  // 修士的"有效修炼场景等级" ≈ index/2 + 3（练气一层→Lv3，筑基初阶→Lv7，金丹初阶→Lv9）
  // 场景等级远低于修为 → 灵气稀薄，难有寸进
  // 场景等级匹配或更高 → 正常修炼甚至加速
  const scene = getSceneData(G.currentScene);
  if (scene && scene.qiLevel) {
    var expectedLevel = 3 + Math.floor(p.qiRealmIndex / 1.5);
    var gap = scene.qiLevel - expectedLevel;
    var sceneBonus = 0;
    if (gap <= -3) {
      sceneBonus = 0.08;      // 💀 太低：几乎不涨
    } else if (gap === -2) {
      sceneBonus = 0.25;      // 很差
    } else if (gap === -1) {
      sceneBonus = 0.55;      // 勉强
    } else if (gap === 0) {
      sceneBonus = 1.0;       // 合适
    } else if (gap >= 1) {
      sceneBonus = 1.0 + gap * 0.2;  // ✨ 超越——最佳修炼场
    }
    // 🧘 境界保底：修为需求指数级上升，产出不能被低级地图卡死
    // 低境界玩家在高级地图有加成，高境界玩家在低级地图也有保底收益
    // 🧘 境界修炼保底：前期稳步练习，中后期放缓，金丹后不鼓励纯挂机
// 练气期 (0-8): 保底 0.15→0.35  稳步爬升，8h≈1层
// 筑基期 (9-11): 保底 0.35→0.46  开始减速
// 金丹+ (12+): 封顶 0.46         修炼产出封顶，靠顿悟和奇遇
var idx = p.qiRealmIndex || 0;
var minBonus;
if (idx <= 8) minBonus = 0.12 + idx * 0.026;          // 0.12→0.33
else if (idx <= 11) minBonus = 0.33 + (idx - 8) * 0.04; // 0.33→0.45
else minBonus = 0.46;
sceneBonus = Math.max(sceneBonus, minBonus);
    mult *= sceneBonus;
    
    // 记录场景匹配度供叙事使用
    p._sceneCultGap = gap;
  }

  // 功法加成（含熟练度成长）
  p.skills.forEach(sk => {
    const sd = (G.skillData || typeof SKILL_DB !== 'undefined' ? SKILL_DB : []).find(d => d.id === sk.id);
    if (!sd || !sk.active) return;
    const e = sd.effects;
    // 熟练度系数：修炼速度每级+6%（Lv10 共+60%），保持基础值不变
    const ml = sk.masteryLevel || 0;
    const masteryMult = 1 + ml * 0.06;
    if (type === 'qi' && e.cultivationSpeed) mult *= e.cultivationSpeed * masteryMult;
    if (type === 'body' && e.bodyCultSpeed) mult *= e.bodyCultSpeed * masteryMult;
  });
  
  // 装备修炼加速（四部位汇总，饰品可多件）——独立于功法循环（无功法也该生效）
  var eqSlots = ['weapon','armor','accessory','head','shoes'];
  eqSlots.forEach(function(eqSlot) {
    forEachEquipItem(eqSlot, function(ee) {
      if (ee.cultivationSpeed) mult *= (1 + ee.cultivationSpeed);
    });
  });

  // 心境修正
  if (p.mood < 30) mult *= 0.7;
  else if (p.mood > 70) mult *= 1.1;

  // ⏳ 衰老惩罚——寿元过半后修炼效率逐年衰减
  if (p.maxAge > 0 && p.age > p.maxAge * 0.5) {
    var lifeDecay = (p.age - p.maxAge * 0.5) / (p.maxAge * 0.5); // 0→1
    var decayFactor = 1 - lifeDecay * 0.4; // 最多衰退到0.6倍
    mult *= Math.max(0.6, decayFactor);
  }

  // 世界事件加成（灵潮等）
  if (typeof getCultSpeedMult === 'function') {
    mult *= getCultSpeedMult();
  }

  // ═══════════ 天赋系统 ═══════════
  // 天赋系数 0.8~1.36（平庸~天才）
  mult *= (p.talent || 1.0);
  
  // 灵根杂质惩罚——灵根越多修炼越慢（杂而不纯）
  var rootCount = (p.spiritRoots && p.spiritRoots.length) || 1;
  var rootPenalty = 1 - (rootCount - 1) * 0.08; // 单灵根:1.0, 双灵根:0.92, 五灵根:0.68
  mult *= Math.max(0.6, rootPenalty);

  // 悟性增益（双修共用）— 悟性高的人领悟快、修炼效率高
  mult *= 1 + (p.wisdom - 50) / 100;

  // 根骨增益（移至此统一计算，避免caller重复加）— 根骨好的人肉身/气感都强
  mult *= type === 'body' ? (0.6 + p.bone / 150) : (0.7 + p.bone / 200);

  // 🍂 季节修正：冬天修炼放缓（天寒宜藏），节日加成
  if (typeof getSeasonMod === 'function') {
    mult *= type === 'qi' ? getSeasonMod().cultSpeed : 1.0;
  }
  if (typeof getFestivalMod === 'function') {
    const fm = getFestivalMod();
    if (fm) {
      if (fm.cultBonus) mult *= 1 + (fm.cultBonus / 300);
      if (fm.bodyCult && type === 'body') mult *= fm.bodyCult;
    }
  }

  return Math.round(mult * 100) / 100;
}


// ==========================
// 功法熟练度系统
// ==========================
function gainSkillMasteryXp(type, baseXp) {
  const p = G.player;
  if (!p || !p.skills) return;
  const slotMap = {
    '吐纳法':'tuna','炼体术':'lianti','攻伐术':'gongfa',
    '护体诀':'huti','身法':'shenfa','疗伤法':'liaoshang','秘术':'mishu','心法':'xinfa','阵道':'zhendao','丹道':'dandao'
  };
  const slot = slotMap[type];
  if (!slot) return;
  const activeId = (p.skillSlots || {})[slot];
  if (!activeId) return;
  const sk = p.skills.find(s => s.id === activeId);
  if (!sk || (sk.masteryLevel || 0) >= 10) return;

  const sd = (G.skillData || typeof SKILL_DB !== 'undefined' ? SKILL_DB : []).find(d => d.id === activeId);
  const qualityMult = { '凡级':1, '灵级':1.5, '地级':2, '天级':2.5, '圣级':3, '神级':4 };
  const mult = qualityMult[(sd && sd.quality) || '凡级'] || 1;
  // 根骨和悟性共同影响熟练增长速度
  const boneFactor = 0.8 + (p.bone / 200);
  const wisdomFactor = 0.8 + (p.wisdom / 150);
  let xpGain = Math.round((baseXp || 10) * mult * boneFactor * wisdomFactor);

  // ❄️ 冰阁道统加成：本命道途功法熟练度大幅提升（×2.5）
  // 🔧 2026-08-04：选了剑脉，练攻伐术事半功倍；练丹道则无加成。
  //    丹脉=丹道、符脉=阵道（符箓阵法一体）、体脉=炼体术、剑脉=攻伐术
  let sectMult = 1;
  try {
    if (typeof isSectMember === 'function' && isSectMember() && p.sect && p.sect.line) {
      const lineSkillMap = {
        'sword': '攻伐术',
        'alchemy': '丹道',
        'talisman': '阵道',
        'body': '炼体术',
      };
      if (lineSkillMap[p.sect.line] === type) {
        sectMult = 2.5;
        xpGain = Math.round(xpGain * sectMult);
      }
    }
  } catch(e) {}

  const cur = sk.masteryLevel || 0;
  const curXp = sk.masteryXp || 0;
  const needed = (cur + 1) * 100;

  sk.masteryXp = curXp + xpGain;

  // 🔧 道统加成叙事（首次触发提示）
  if (sectMult > 1) {
    try {
      if (!p.sect._lineBonusNotified) {
        p.sect._lineBonusNotified = true;
        const lineName = p.sect.lineName || '本脉';
        addNarrative('✨ 冰阁「' + lineName + '」道统加持——本命功法修习事半功倍，熟练度获得大幅提升！', 'narr-event');
      }
    } catch(e) {}
  }

  while (sk.masteryXp >= needed && cur < 10) {
    sk.masteryXp -= needed;
    sk.masteryLevel = (sk.masteryLevel || 0) + 1;
    const newLvl = sk.masteryLevel;
    addNarrative('✨ ' + sk.name + '突破第' + newLvl + '层！效果大幅提升。', 'event');
    if (newLvl === 10) {
      const bonus = sd && sd.masteryBonus;
      if (bonus) {
        addNarrative('💥 ' + sk.name + '圆满大成！' + (bonus.desc || '解锁被动能力！'), 'narr-event');
      } else {
        addNarrative('💥 ' + sk.name + '圆满大成！威力倍增！', 'narr-event');
      }
    }
    recalcStats(p);
    updateAllUI();
    break;
  }
  updateAllUI();
}

// ── 道德经全文（打坐读经用） ──
var DAODEJING = [
  { chapter: 1, text: '道可道，非常道；名可名，非常名。无名天地之始，有名万物之母。故常无欲，以观其妙；常有欲，以观其徼。此两者同出而异名，同谓之玄。玄之又玄，众妙之门。', translation: '可以说出的道，不是永恒的道；可以命名的名，不是永恒的名。无是天地的起始，有是万物的根源。常保持无欲，才能体悟道的奥妙；常有欲，只能看到道的表象。两者同一源而名称不同，都可谓深远。深之又深，是洞悉万物奥妙之门。' },
  { chapter: 2, text: '天下皆知美之为美，斯恶已；皆知善之为善，斯不善已。故有无相生，难易相成，长短相形，高下相倾，音声相和，前后相随。是以圣人处无为之事，行不言之教。', translation: '天下都知道美之所以为美，丑的观念就产生了；都知道善之所以为善，不善的观念就产生了。所以有和无互相生成，难和易互相成就，长和短互相衬托。因此圣人以无为处事，以不言施教。' },
  { chapter: 3, text: '不尚贤，使民不争；不贵难得之货，使民不为盗；不见可欲，使民心不乱。是以圣人之治，虚其心，实其腹，弱其志，强其骨。常使民无知无欲，使夫智者不敢为也。为无为，则无不治。', translation: '不推崇贤能，使人民不争名；不珍视稀有之物，使人民不为盗；不炫耀可欲之事，使民心不乱。圣人的治理：空虚百姓的心机，填饱百姓的肚子，削弱百姓的志向，强健百姓的筋骨。' },
  { chapter: 4, text: '道冲而用之，或不盈。渊兮似万物之宗。挫其锐，解其纷，和其光，同其尘。湛兮似或存。吾不知谁之子，象帝之先。', translation: '道是虚空的，但用起来却不穷竭。深邃啊，好像是万物的宗主。它磨去锋芒，化解纠纷，调和光芒，混同尘垢。清澈啊，好像存在。我不知道它是谁的后代，似乎在天帝之前就已存在。' },
  { chapter: 5, text: '天地不仁，以万物为刍狗；圣人不仁，以百姓为刍狗。天地之间，其犹橐籥乎？虚而不屈，动而愈出。多言数穷，不如守中。', translation: '天地没有偏爱，把万物当作刍狗；圣人没有偏爱，把百姓当作刍狗。天地之间，岂不像风箱吗？空虚却不枯竭，越鼓动风越多。议论太多往往窘困，不如保持虚静中正。' },
  { chapter: 6, text: '谷神不死，是谓玄牝。玄牝之门，是谓天地根。绵绵若存，用之不勤。', translation: '虚空的神妙永不消亡，这就是玄妙的母性。玄妙母性的门户，就是天地的根源。它连绵不断好像存在，运用它却不费气力。' },
  { chapter: 7, text: '天长地久。天地所以能长且久者，以其不自生，故能长生。是以圣人后其身而身先，外其身而身存。非以其无私邪？故能成其私。', translation: '天地长久存在。天地之所以能长久，是因为它们不为自己而生，所以能长生。因此圣人把自己放在众人后面，反而领先；把自己置于身外，反而保全。不正是由于他不自私吗？反而成就了自己。' },
  { chapter: 8, text: '上善若水。水善利万物而不争，处众人之所恶，故几于道。居善地，心善渊，与善仁，言善信，政善治，事善能，动善时。夫唯不争，故无尤。', translation: '最高的善就像水一样。水善于滋润万物却不与万物相争，停留在众人都不喜欢的地方，所以最接近于道。居住要善择地方，心境要善于深沉，给予要善于仁爱，说话要善于守信，为政要善于治理，做事要善于发挥长处。正因不争，所以没有过失。' },
  { chapter: 9, text: '持而盈之，不如其已；揣而锐之，不可长保。金玉满堂，莫之能守；富贵而骄，自遗其咎。功遂身退，天之道。', translation: '装得太满，不如适可而止；捶打得太尖，难以长久保持。金玉满堂，没有人能守得住；富贵而骄，自取灾祸。功成身退，才是自然之道。' },
  { chapter: 10, text: '载营魄抱一，能无离乎？专气致柔，能婴儿乎？涤除玄览，能无疵乎？爱民治国，能无为乎？天门开阖，能为雌乎？明白四达，能无知乎？生之畜之，生而不有，为而不恃，长而不宰，是谓玄德。', translation: '精神与身体合一，能不分离吗？聚气达到柔和，能像婴儿一样吗？洗除杂念观照内心，能没有瑕疵吗？爱民治国，能自然无为吗？感官开合，能保持柔静吗？通达事理，能不用心智吗？生长万物而不占有，有作为而不自恃，是领导者而不主宰，这是最深远的德。' },
  { chapter: 11, text: '三十辐共一毂，当其无，有车之用。埏埴以为器，当其无，有器之用。凿户牖以为室，当其无，有室之用。故有之以为利，无之以为用。', translation: '三十根辐条汇集到一根车毂上，有了车毂中空的地方，才有车的作用。揉和泥土做成器皿，有了器皿中空的地方，才有器皿的作用。开凿门窗建造房屋，有了门窗四壁中空的地方，才有房屋的作用。所以「有」给人便利，「无」发挥了作用。' },
  { chapter: 12, text: '五色令人目盲，五音令人耳聋，五味令人口爽，驰骋畋猎令人心发狂，难得之货令人行妨。是以圣人为腹不为目，故去彼取此。', translation: '缤纷的色彩使人眼花缭乱，嘈杂的声音使人听觉失灵，丰美的食物使人舌不知味，纵情狩猎使人心放荡，稀有之物使人行为不轨。因此圣人追求内在的充实而非外在的刺激，所以摒弃那些而取这个。' },
  { chapter: 13, text: '宠辱若惊，贵大患若身。何谓宠辱若惊？宠为下，得之若惊，失之若惊，是谓宠辱若惊。何谓贵大患若身？吾所以有大患者，为吾有身，及吾无身，吾有何患？故贵以身为天下，若可寄天下；爱以身为天下，若可托天下。', translation: '受宠和受辱都令人惊恐，重视大祸患如同重视自己的身体。我之所以有大祸患，是因为我有这个身体；如果我没有这个身体，我还有什么祸患呢？所以肯以自身奉献于天下的人，才可以把天下寄托给他。' },
  { chapter: 14, text: '视之不见名曰夷，听之不闻名曰希，搏之不得名曰微。此三者不可致诘，故混而为一。其上不皦，其下不昧，绳绳不可名，复归于无物。是谓无状之状，无物之象，是谓惚恍。迎之不见其首，随之不见其后。', translation: '看它看不见叫「夷」，听它听不到叫「希」，摸它摸不着叫「微」。这三者无法追究到底，所以混而为一。它的上面不光明，下面不阴暗，连绵不断不可名状，最终回归到无物的状态。这就是没有形状的形状，不见物体的形象，叫做「惚恍」。' },
  { chapter: 15, text: '古之善为士者，微妙玄通，深不可识。夫唯不可识，故强为之容：豫兮若冬涉川，犹兮若畏四邻，俨兮其若客，涣兮若冰之将释，敦兮其若朴，旷兮其若谷，混兮其若浊。孰能浊以静之徐清？孰能安以久动之徐生？保此道者不欲盈。夫唯不盈，故能蔽而新成。', translation: '古时善于行道的人，精微奥妙而通达，深刻得难以认识。正因为难以认识，只能勉强描述他：谨慎啊，像冬天过河；警惕啊，像畏惧四邻；庄重啊，像在作客；和蔼啊，像冰将融化；敦厚啊，像未经雕琢的木材；旷达啊，像幽深的山谷；混同啊，像浑浊的河水。' },
  { chapter: 16, text: '致虚极，守静笃。万物并作，吾以观复。夫物芸芸，各复归其根。归根曰静，是谓复命。复命曰常，知常曰明。不知常，妄作凶。知常容，容乃公，公乃王，王乃天，天乃道，道乃久，没身不殆。', translation: '达到极度的虚无，持守深沉的静笃。万物一起生长，我从中观察循环往复的道理。万物纷繁众多，各自回归到它们的根本。回归根本叫做静，静叫做回归本性。回归本性叫做常，认识常叫做明。不认识常，轻举妄动就会招来凶险。' },
  { chapter: 17, text: '太上，下知有之；其次，亲而誉之；其次，畏之；其次，侮之。信不足焉，有不信焉。悠兮其贵言。功成事遂，百姓皆谓我自然。', translation: '最好的统治者，百姓只知道他的存在；次一等的，百姓亲近他称赞他；再次的，百姓害怕他；更次的，百姓轻蔑他。诚信不足，才有不信任。最好的统治者悠闲啊，不轻易发号施令。事情办成功了，百姓都说我们本来就是这样。' },
  { chapter: 18, text: '大道废，有仁义；智慧出，有大伪；六亲不和，有孝慈；国家昏乱，有忠臣。', translation: '大道被废弃了，才有仁义；聪明智慧出现了，才有严重的虚伪；家庭不和睦了，才显出孝慈；国家昏乱了，才出现忠臣。' },
  { chapter: 19, text: '绝圣弃智，民利百倍；绝仁弃义，民复孝慈；绝巧弃利，盗贼无有。此三者以为文不足，故令有所属：见素抱朴，少私寡欲。', translation: '抛弃圣明和智慧，人民将获利百倍；抛弃仁义，人民将恢复孝慈；抛弃巧诈和货利，盗贼就会消失。这三者作为理论还不够，所以要让人民有所归属：保持纯朴，减少私欲。' },
  { chapter: 20, text: '绝学无忧。唯之与阿，相去几何？善之与恶，相去若何？人之所畏，不可不畏。荒兮其未央哉！众人熙熙，如享太牢，如春登台。我独泊兮其未兆，如婴儿之未孩。', translation: '弃绝后天之学就没有忧虑。应诺与呵斥，相差多少？美善与丑恶，相差几何？别人所畏惧的，不能不畏惧。茫茫然啊，没有尽头！众人都兴高采烈，如同享用盛宴，如同春天登台远眺。我独淡然无动于衷，好像婴儿还不会笑。' },
  { chapter: 21, text: '孔德之容，惟道是从。道之为物，惟恍惟惚。惚兮恍兮，其中有象；恍兮惚兮，其中有物；窈兮冥兮，其中有精。其精甚真，其中有信。自古及今，其名不去，以阅众甫。吾何以知众甫之状哉？以此。', translation: '大德的形态，完全遵从于道。道这个东西，恍恍惚惚。惚惚恍恍，其中却有形象；恍恍惚惚，其中却有实物；深远暗昧，其中却有精华。这精华非常真实，其中有可信验的。从古到今，它的名字从不消失，用以观察万物的本源。' },
  { chapter: 22, text: '曲则全，枉则直，洼则盈，敝则新，少则得，多则惑。是以圣人抱一为天下式。不自见故明，不自是故彰，不自伐故有功，不自矜故长。夫唯不争，故天下莫能与之争。古之所谓曲则全者，岂虚言哉！诚全而归之。', translation: '委曲反而能保全，弯曲反而能伸直，低洼反而能充盈，破旧反而能新生，少取反而能多得，贪多反而迷惑。所以圣人坚守大道为天下的典范。不自我表现所以明智，不自以为是所以彰显，不自我夸耀所以有功，不自高自大所以长久。' },
  { chapter: 23, text: '希言自然。故飘风不终朝，骤雨不终日。孰为此者？天地。天地尚不能久，而况于人乎？故从事于道者，道者同于道，德者同于德，失者同于失。同于道者，道亦乐得之；同于德者，德亦乐得之；同于失者，失亦乐得之。信不足焉，有不信焉。', translation: '少说话是自然的法则。所以狂风刮不了一整个早晨，暴雨下不了一整天。谁制造了这些？是天地。天地尚且不能持久，何况人呢？所以修道的人，与道同行；修德的人，与德同行；失道失德的人，也与失同行。' },
  { chapter: 24, text: '企者不立，跨者不行。自见者不明，自是者不彰，自伐者无功，自矜者不长。其在道也，曰余食赘行。物或恶之，故有道者不处。', translation: '踮起脚跟的人站不稳，跨大步的人走不远。自我表现的人不明智，自以为是的人不彰显，自我夸耀的人没有功劳，自高自大的人不长久。从道的角度说，这些是剩饭赘瘤。人们都厌恶它们，所以有道的人不这样做。' },
  { chapter: 25, text: '有物混成，先天地生。寂兮寥兮，独立而不改，周行而不殆，可以为天下母。吾不知其名，强字之曰道，强为之名曰大。大曰逝，逝曰远，远曰反。故道大，天大，地大，王亦大。域中有四大，而王居其一焉。人法地，地法天，天法道，道法自然。', translation: '有一个混然一体的东西，在天地之前就产生了。它寂静啊空虚啊，独立存在而不改变，循环运行而不停息，可以做天地的母体。我不知道它的名字，勉强叫它作「道」，再勉强给它起名叫「大」。道大，天大，地大，王也大。人效法地，地效法天，天效法道，道效法自然。' },
  { chapter: 26, text: '重为轻根，静为躁君。是以圣人终日行不离辎重。虽有荣观，燕处超然。奈何万乘之主，而以身轻天下？轻则失本，躁则失君。', translation: '厚重是轻浮的根本，宁静是躁动的主宰。所以圣人整天行走，不离开装载粮秣的车辆。虽然有荣华的景象，却安然处之超然物外。为什么大国的君主，却以轻率的态度治理天下呢？轻浮就失去了根本，躁动就失去了主宰。' },
  { chapter: 27, text: '善行无辙迹，善言无瑕谪，善计不用筹策，善闭无关楗而不可开，善结无绳约而不可解。是以圣人常善救人，故无弃人；常善救物，故无弃物。是谓袭明。', translation: '善于行走的没有痕迹，善于言说的没有瑕疵，善于计算的不需要筹码，善于关闭的不用门闩却无法打开，善于捆绑的不用绳索却无法解开。因此圣人常常善于救助人，所以没有被遗弃的人；常常善于救助物，所以没有被遗弃的物。这就叫做沿袭道的光明。' },
  { chapter: 28, text: '知其雄，守其雌，为天下溪。为天下溪，常德不离，复归于婴儿。知其白，守其黑，为天下式。为天下式，常德不忒，复归于无极。知其荣，守其辱，为天下谷。为天下谷，常德乃足，复归于朴。朴散则为器，圣人用之则为官长。故大制不割。', translation: '知道雄强，却安守柔雌，甘作天下的溪涧。甘作天下的溪涧，永恒的德就不会离散，复归于婴儿状态。知道荣耀，却安守卑辱，甘作天下的山谷。甘作天下的山谷，永恒的德就充足，复归于朴真。' },
  { chapter: 29, text: '将欲取天下而为之，吾见其不得已。天下神器，不可为也。为者败之，执者失之。故物或行或随，或嘘或吹，或强或羸，或挫或隳。是以圣人去甚，去奢，去泰。', translation: '想要治理天下而强作为，我看他达不到目的。天下是神圣的，不可以强作为。强作为就会败坏它，执持它就会失去它。所以圣人去除极端，去除奢侈，去除过度。' },
  { chapter: 30, text: '以道佐人主者，不以兵强天下，其事好还。师之所处，荆棘生焉。大军之后，必有凶年。善者果而已，不敢以取强。果而勿矜，果而勿伐，果而勿骄，果而不得已，果而勿强。物壮则老，是谓不道，不道早已。', translation: '用道辅佐君主的，不以武力逞强天下，用兵这件事一定会得到报应。军队驻扎过的地方，荆棘丛生。大战之后，必有荒年。善于用兵的达到目的就停止，不敢以兵力逞强。事物壮盛了就会衰老，这叫不合于道，不合于道就会很快消亡。' },
  { chapter: 31, text: '夫佳兵者，不祥之器，物或恶之，故有道者不处。君子居则贵左，用兵则贵右。兵者不祥之器，非君子之器，不得已而用之，恬淡为上。胜而不美，而美之者，是乐杀人。夫乐杀人者，则不可以得志于天下矣。', translation: '精良的兵器是不祥之物，人们都厌恶它，所以有道的人不接近它。兵器是不祥之物，不是君子的器物，不得已才使用它，以淡泊为上。打了胜仗不要自以为了不起，自以为了不起就是以杀人为乐。以杀人为乐的人，不可能得志于天下。' },
  { chapter: 32, text: '道常无名，朴虽小，天下莫能臣也。侯王若能守之，万物将自宾。天地相合，以降甘露，民莫之令而自均。始制有名，名亦既有，夫亦将知止。知止可以不殆。譬道之在天下，犹川谷之于江海。', translation: '道永远是无名的，朴虽然微小，天下没有谁能使他臣服。侯王如果能持守它，万物都会自来归顺。天地相合，就会降下甘露，人民没有命令它也会自然均匀。知道适可而止，就可以避免危险。道存在于天下，就像江海容纳百川一样。' },
  { chapter: 33, text: '知人者智，自知者明。胜人者有力，自胜者强。知足者富，强行者有志。不失其所者久，死而不亡者寿。', translation: '能了解别人是智慧，能了解自己是明智。能战胜别人是有力，能战胜自己是刚强。知道满足就是富有，坚持不懈就是有志。不丢失本分就能长久，身死而精神长存才是长寿。' },
  { chapter: 34, text: '大道泛兮，其可左右。万物恃之而生而不辞，功成不名有。衣养万物而不为主，常无欲，可名于小；万物归焉而不为主，可名为大。以其终不自为大，故能成其大。', translation: '大道广泛流行，无所不到。万物依靠它生长而不推辞，功业成就而不据为己有。它养育万物而不做主宰，可以称它为「小」；万物归附它而不自以为主宰，可以称它为「大」。正因为始终不自以为大，所以能成就它的伟大。' },
  { chapter: 35, text: '执大象，天下往。往而不害，安平太。乐与饵，过客止。道之出口，淡乎其无味，视之不足见，听之不足闻，用之不足既。', translation: '执守大道，天下人都来归往。归往而不互相伤害，于是天下太平。音乐和美食，能使过路人停步。而道说出来，淡得没有味道，看它看不见，听它听不到，用它却用不完。' },
  { chapter: 36, text: '将欲歙之，必固张之；将欲弱之，必固强之；将欲废之，必固兴之；将欲夺之，必固与之。是谓微明。柔弱胜刚强。鱼不可脱于渊，国之利器不可以示人。', translation: '将要收敛它，必先扩张它；将要削弱它，必先增强它；将要废弃它，必先兴盛它；将要夺取它，必先给予它。这叫微妙的明智。柔弱胜过刚强。鱼不能离开深渊，国家的利器不可以随便向人炫耀。' },
  { chapter: 37, text: '道常无为而无不为。侯王若能守之，万物将自化。化而欲作，吾将镇之以无名之朴。无名之朴，夫亦将无欲。不欲以静，天下将自定。', translation: '道永远是无为的，然而又没有一件事不是它所为。侯王如果能持守它，万物就会自生自长。在生长过程中欲望萌动时，我将用无名的朴来镇定它。无名的朴，也就是使人不生贪欲。不生贪欲而归于宁静，天下就会自然安定。' },
  { chapter: 38, text: '上德不德，是以有德；下德不失德，是以无德。上德无为而无以为；下德为之而有以为。上仁为之而无以为；上义为之而有以为。上礼为之而莫之应，则攘臂而扔之。故失道而后德，失德而后仁，失仁而后义，失义而后礼。', translation: '上等的德不自以为有德，所以有德；下等的德自以为有德，所以没有德。上等的德自然无为，无所企图；下等的德有心作为，有所企图。失去了道而后才有德，失去了德而后才有仁，失去了仁而后才有义，失去了义而后才有礼。' },
  { chapter: 39, text: '昔之得一者：天得一以清，地得一以宁，神得一以灵，谷得一以盈，万物得一以生，侯王得一以为天下贞。其致之，天无以清将恐裂，地无以宁将恐废，神无以灵将恐歇，谷无以盈将恐竭，万物无以生将恐灭，侯王无以贵高将恐蹶。', translation: '自古以来得到「一」的：天得到一而清明，地得到一而安宁，神得到一而灵验，河谷得到一而充盈，万物得到一而生长，侯王得到一而成为天下首领。推而言之，天不清明恐怕会崩裂，地不安宁恐怕会塌陷。' },
  { chapter: 40, text: '反者道之动，弱者道之用。天下万物生于有，有生于无。', translation: '相反相成是道的运动规律，柔弱是道的作用方式。天下万物从有中产生，有从无中产生。' },
  { chapter: 41, text: '上士闻道，勤而行之；中士闻道，若存若亡；下士闻道，大笑之。不笑不足以为道。故建言有之：明道若昧，进道若退，夷道若颣，上德若谷，大白若辱，广德若不足，建德若偷，质真若渝。大方无隅，大器晚成，大音希声，大象无形。道隐无名。夫唯道，善贷且成。', translation: '上等士人听了道，努力去实行；中等士人听了道，半信半疑；下等士人听了道，哈哈大笑。不被嘲笑，就不足以成为道了。所以古话说：光明的道好像暗昧，前进的道好像后退，平坦的道好像崎岖，上等的德好像山谷，最洁白好像污浊。' },
  { chapter: 42, text: '道生一，一生二，二生三，三生万物。万物负阴而抱阳，冲气以为和。人之所恶，唯孤、寡、不谷，而王公以为称。故物或损之而益，或益之而损。人之所教，我亦教之。强梁者不得其死，吾将以为教父。', translation: '道生出统一体，统一体生出阴阳二气，阴阳二气生出冲和之气，冲和之气生出万物。万物背负阴气而怀抱阳气，阴阳二气互相激荡形成和谐状态。人们所厌恶的，就是孤、寡、不谷，而王公却用这些作自称。' },
  { chapter: 43, text: '天下之至柔，驰骋天下之至坚。无有入无间，吾是以知无为之有益。不言之教，无为之益，天下希及之。', translation: '天下最柔软的东西，能驾驭天下最坚硬的东西。无形的力量能穿透没有间隙的东西，我因此知道无为的益处。不言的教化，无为的益处，天下很少有人能够做到。' },
  { chapter: 44, text: '名与身孰亲？身与货孰多？得与亡孰病？是故甚爱必大费，多藏必厚亡。知足不辱，知止不殆，可以长久。', translation: '名声与生命哪一个更亲近？生命与财产哪一个更重要？获得与丧失哪一个更有害？所以过分喜爱必定造成巨大的耗费，过多的收藏必定会导致严重的损失。知道满足就不会受辱，知道适可而止就不会有危险，这样才能长久。' },
  { chapter: 45, text: '大成若缺，其用不弊。大盈若冲，其用不穷。大直若屈，大巧若拙，大辩若讷。躁胜寒，静胜热。清静为天下正。', translation: '最圆满的好像有缺陷，但它的作用不会衰竭。最充盈的好像是空虚，但它的作用不会穷尽。最正直的好像是弯曲，最灵巧的好像是笨拙，最善辩的好像是木讷。清静可以作为天下的准则。' },
  { chapter: 46, text: '天下有道，却走马以粪。天下无道，戎马生于郊。祸莫大于不知足，咎莫大于欲得。故知足之足，常足矣。', translation: '天下有道，战马都用来耕田。天下无道，怀驹的母马也要在战场上生下马驹。祸患没有比不知足更大的，罪过没有比贪得无厌更大的。所以知道满足的这种满足，就永远满足了。' },
  { chapter: 47, text: '不出户，知天下；不窥牖，见天道。其出弥远，其知弥少。是以圣人不行而知，不见而名，不为而成。', translation: '不出门户，就能知道天下的事理；不望窗外，就能了解自然的规律。走出去越远，知道的反而越少。所以圣人不出行就能知道，不观察就能明了，不作为就能成功。' },
  { chapter: 48, text: '为学日益，为道日损。损之又损，以至于无为。无为而无不为。取天下常以无事，及其有事，不足以取天下。', translation: '从事于学问，知识一天天增加；从事于大道，知识一天天减少。减少再减少，最后达到无为的境界。做到无为，就没有什么事情做不成了。治理天下要常保持无事，如果生事扰民，就不足以治理天下了。' },
  { chapter: 49, text: '圣人无常心，以百姓心为心。善者吾善之，不善者吾亦善之，德善。信者吾信之，不信者吾亦信之，德信。圣人在天下，歙歙为天下浑其心。百姓皆注其耳目，圣人皆孩之。', translation: '圣人没有固定的心意，以百姓的心意为自己的心意。善良的人我善待他，不善良的人我也善待他，这样便得到了善。诚信的人我信任他，不诚信的人我也信任他，这样便得到了诚信。' },
  { chapter: 50, text: '出生入死。生之徒十有三，死之徒十有三，人之生动之死地亦十有三。夫何故？以其生生之厚。盖闻善摄生者，陆行不遇兕虎，入军不被甲兵。兕无所投其角，虎无所措其爪，兵无所容其刃。夫何故？以其无死地。', translation: '人出世为生，入地为死。长寿的人占十分之三，短命的人占十分之三，本来可以长寿却走向死路的也占十分之三。这是什么原因？因为奉养太过度了。善于养生的人，路上不会遇到猛兽，在军中不会受到伤害。为什么？因为他没有致死的因素。' },
  { chapter: 51, text: '道生之，德畜之，物形之，势成之。是以万物莫不尊道而贵德。道之尊，德之贵，夫莫之命而常自然。故道生之，德畜之，长之育之，亭之毒之，养之覆之。生而不有，为而不恃，长而不宰，是谓玄德。', translation: '道生出万物，德养育万物，物质使之成形，环境使之成熟。所以万物没有不尊崇道而珍贵德的。道被尊崇，德被珍贵，并不是命令，而是自然而然的。道生出万物而不占有，有作为而不自恃，是领导者而不主宰，这是最深远的德。' },
  { chapter: 52, text: '天下有始，以为天下母。既得其母，以知其子；既知其子，复守其母，没身不殆。塞其兑，闭其门，终身不勤。开其兑，济其事，终身不救。见小曰明，守柔曰强。用其光，复归其明，无遗身殃，是为习常。', translation: '天下有一个开始，它是天下的根源。既然知道了根源，就能认识万物；既然认识了万物，再持守根源，终身没有危险。堵塞感官的孔窍，关闭欲望的大门，终身没有劳扰。能看见微小叫明，能持守柔弱叫强。' },
  { chapter: 53, text: '使我介然有知，行于大道，唯施是畏。大道甚夷，而人好径。朝甚除，田甚芜，仓甚虚，服文彩，带利剑，厌饮食，财货有余，是谓盗夸。非道也哉！', translation: '假使我稍微有些知识，在大道上行走，最担心的是走入邪路。大道非常平坦，而人却喜欢走小路。朝廷非常腐败，农田非常荒芜，仓库非常空虚，却穿着华丽的衣服，佩带锋利的宝剑，饱餐精美的饮食，财产多馀——这简直就是强盗头子。多么不合道啊！' },
  { chapter: 54, text: '善建者不拔，善抱者不脱，子孙以祭祀不辍。修之于身，其德乃真；修之于家，其德乃余；修之于乡，其德乃长；修之于国，其德乃丰；修之于天下，其德乃普。故以身观身，以家观察，以乡观乡，以国观国，以天下观天下。吾何以知天下然哉？以此。', translation: '善于建立的不可拔除，善于抱持的不会脱落，子孙因此祭祀不断。用道修身，德就纯真；用道齐家，德就充裕；用道治乡，德就长久；用道治国，德就丰厚；用道平天下，德就普及。' },
  { chapter: 55, text: '含德之厚，比于赤子。毒虫不螫，猛兽不据，攫鸟不搏。骨弱筋柔而握固。未知牝牡之合而朘作，精之至也。终日号而不嗄，和之至也。知和曰常，知常曰明。益生曰祥，心使气曰强。物壮则老，谓之不道，不道早已。', translation: '含德深厚的人，好比初生的婴儿。毒虫不螫他，猛兽不扑他，凶鸟不抓他。他筋骨柔弱却握力很强。不知道男女交合而生殖器勃起，是精气充足的表现。整天哭叫而声音不哑，是中和之气充足的表现。' },
  { chapter: 56, text: '知者不言，言者不知。塞其兑，闭其门，挫其锐，解其纷，和其光，同其尘，是谓玄同。故不可得而亲，不可得而疏；不可得而利，不可得而害；不可得而贵，不可得而贱。故为天下贵。', translation: '真正有知识的人不多说话，多说话的人不是真有知识。堵塞感官的孔窍，关闭欲望的大门，磨去锋芒，化解纠纷，调和光芒，混同尘垢，这就是玄妙的同一。所以无法与他亲近，也无法与他疏远；无法使他获利，也无法使他受害。' },
  { chapter: 57, text: '以正治国，以奇用兵，以无事取天下。吾何以知其然哉？以此：天下多忌讳，而民弥贫；民多利器，国家滋昏；人多伎巧，奇物滋起；法令滋彰，盗贼多有。故圣人云：我无为而民自化，我好静而民自正，我无事而民自富，我无欲而民自朴。', translation: '用正道治理国家，用奇谋用兵，用无为来取天下。我怎么知道这样呢？根据：天下禁令越多，人民越贫穷；民间利器越多，国家越昏乱；人越有技巧，怪事越多；法令越彰显，盗贼反而越多。所以圣人说：我无为，人民自然教化；我好静，人民自然端正。' },
  { chapter: 58, text: '其政闷闷，其民淳淳；其政察察，其民缺缺。祸兮福之所倚，福兮祸之所伏。孰知其极？其无正。正复为奇，善复为妖。人之迷，其日固久。是以圣人方而不割，廉而不刿，直而不肆，光而不耀。', translation: '政治宽厚，人民就淳朴；政治严苛，人民就狡诈。灾祸啊，幸福倚靠在它旁边；幸福啊，灾祸潜伏在它里面。谁知道它的终极？没有定准。正常会变为反常，善良会变为邪恶。人们迷惑，日子已经很久了。所以圣人方正而不伤人，锐利而不划人。' },
  { chapter: 59, text: '治人事天，莫若啬。夫唯啬，是谓早服。早服谓之重积德，重积德则无不克，无不克则莫知其极，莫知其极可以有国，有国之母可以长久。是谓深根固柢，长生久视之道。', translation: '治理百姓和事奉天道，没有比节俭更好的。节俭，就是早作准备。早作准备就是不断积德，不断积德就没有不能克服的，没有不能克服就无法估计他的力量，这样就可以保有国家。这就是根深蒂固、长生久视的道理。' },
  { chapter: 60, text: '治大国若烹小鲜。以道莅天下，其鬼不神。非其鬼不神，其神不伤人。非其神不伤人，圣人亦不伤人。夫两不相伤，故德交归焉。', translation: '治理大国，如同烹煎小鱼（不要频繁翻动）。用道来治理天下，连鬼都不作祟了。不是鬼不作祟，而是它的作用不伤害人。不是鬼的作用不伤害人，而是圣人也不伤害人。两者都不伤害人，所以德就都归向人民了。' },
  { chapter: 61, text: '大国者下流，天下之交，天下之牝。牝常以静胜牡，以静为下。故大国以下小国，则取小国；小国以下大国，则取大国。故或下以取，或下而取。大国不过欲兼畜人，小国不过欲入事人。夫两者各得其所欲，大者宜为下。', translation: '大国要像居于江河的下流，是天下汇聚的地方，是天下阴柔的一方面。阴柔常以安静战胜阳刚，因为安静而处下的缘故。所以大国对小国谦下，就能取得小国的归附；小国对大国谦下，就能取得大国的接纳。所以大国不过想兼养人民，小国不过想进入大国。' },
  { chapter: 62, text: '道者万物之奥，善人之宝，不善人之所保。美言可以市尊，美行可以加人。人之不善，何弃之有？故立天子，置三公，虽有拱璧以先驷马，不如坐进此道。古之所以贵此道者何？不曰求以得，有罪以免邪？故为天下贵。', translation: '道是万物的庇护所，善人的宝贝，不善的人也要依靠它。美好的言语可以博取尊敬，美好的行为可以见重于人。即使立天子、设置三公，虽然有拱璧在先、驷马在后的礼仪，还不如静坐进献这个道。古人为什么贵重道呢？不是说有求就能得到，有罪就能免除吗？所以道被天下人所珍贵。' },
  { chapter: 63, text: '为无为，事无事，味无味。大小多少，报怨以德。图难于其易，为大于其细。天下难事必作于易，天下大事必作于细。是以圣人终不为大，故能成其大。夫轻诺必寡信，多易必多难。是以圣人犹难之，故终无难矣。', translation: '以无为为作为，以无事为做事，以无味为滋味。大小多少，以德来回报怨恨。图谋难事要趁它容易的时候，做大事要从细微处开始。天下的难事必从容易的开始，天下的大事必从细微的开始。所以圣人始终不自以为伟大，因此能成就他的伟大。' },
  { chapter: 64, text: '其安易持，其未兆易谋，其脆易泮，其微易散。为之于未有，治之于未乱。合抱之木，生于毫末；九层之台，起于累土；千里之行，始于足下。为者败之，执者失之。是以圣人无为故无败，无执故无失。民之从事，常于几成而败之。慎终如始，则无败事。', translation: '安定的时候容易维持，没有征兆时容易图谋，脆弱时容易分解，微小时容易消散。在事情未发生时就处理，在动乱未发生时就治理。合抱的大树，从微小的种子长成；九层的高台，从一堆土开始筑起；千里的行程，从脚下第一步开始。' },
  { chapter: 65, text: '古之善为道者，非以明民，将以愚之。民之难治，以其智多。故以智治国，国之贼；不以智治国，国之福。知此两者亦稽式。常知稽式，是谓玄德。玄德深矣远矣，与物反矣，然后乃至大顺。', translation: '古代善于行道的人，不是教人民聪明机巧，而是让人民淳朴。人民之所以难治理，是因为他们有太多的智巧。所以用智巧治理国家，是国家的祸害；不用智巧治理国家，是国家的福气。了解这两种方式就是法则。这就是玄德。玄德深啊远啊，与万物一同返璞归真，然后达到大顺。' },
  { chapter: 66, text: '江海所以能为百谷王者，以其善下之，故能为百谷王。是以欲上民，必以言下之；欲先民，必以身后之。是以圣人处上而民不重，处前而民不害。是以天下乐推而不厌。以其不争，故天下莫能与之争。', translation: '江海之所以能成为百川之王，是因为它善于处在低下的位置，所以能成为百川之王。因此想要统治人民，必须用言辞对人民谦下；想要领导人民，必须把自己放在人民之后。因此圣人处在人民之上而人民不感到沉重，处在人民之前而人民不感到受害。' },
  { chapter: 67, text: '天下皆谓我道大，似不肖。夫唯大，故似不肖。若肖，久矣其细也夫！我有三宝，持而保之：一曰慈，二曰俭，三曰不敢为天下先。慈故能勇，俭故能广，不敢为天下先故能成器长。今舍慈且勇，舍俭且广，舍后且先，死矣！夫慈，以战则胜，以守则固。天将救之，以慈卫之。', translation: '天下人都说我的道太大，好像什么都不像。正因为它大，所以什么都不像。如果像什么东西，早就变得渺小了。我有三件宝贝，持守而保存着：第一是慈爱，第二是节俭，第三是不敢争先。慈爱所以能勇敢，节俭所以能广大，不敢争先所以能成为万物的首长。' },
  { chapter: 68, text: '善为士者不武，善战者不怒，善胜敌者不与，善用人者为之下。是谓不争之德，是谓用人之力，是谓配天古之极。', translation: '善于做将帅的不逞武力，善于作战的不发怒，善于胜敌的不与敌人正面交锋，善于用人的对人谦下。这叫做不争的品德，叫做善于使用别人的力量，叫做符合自然的道理。' },
  { chapter: 69, text: '用兵有言：吾不敢为主而为客，不敢进寸而退尺。是谓行无行，攘无臂，扔无敌，执无兵。祸莫大于轻敌，轻敌几丧吾宝。故抗兵相加，哀者胜矣。', translation: '用兵的人说过：我不敢主动进攻而宁取守势，不敢前进一寸而宁可后退一尺。这就是：摆阵势好像没有阵势，奋臂好像没有臂膀，执兵器好像没有兵器。祸患没有比轻敌更大的了，轻敌几乎丧失了我的三宝。所以两军对垒时，悲愤的一方会胜利。' },
  { chapter: 70, text: '吾言甚易知，甚易行。天下莫能知，莫能行。言有宗，事有君。夫唯无知，是以不我知。知我者希，则我者贵。是以圣人被褐怀玉。', translation: '我的话很容易理解，很容易实行。可是天下却没有人能理解，没有人能实行。言论有宗旨，行事有根据。正因为人们无知，所以不理解我。理解我的人很少，效法我的人就更难得了。所以圣人外面穿着粗布衣服，怀里却揣着美玉。' },
  { chapter: 71, text: '知不知，上；不知知，病。夫唯病病，是以不病。圣人不病，以其病病，是以不病。', translation: '知道自己有所不知，是高明；不知道却自以为知道，是毛病。正因为把这种毛病当作毛病，所以才没有毛病。圣人没有毛病，因为他把这种毛病当作毛病，所以没有毛病。' },
  { chapter: 72, text: '民不畏威，则大威至。无狎其所居，无厌其所生。夫唯不厌，是以不厌。是以圣人自知不自见，自爱不自贵。故去彼取此。', translation: '人民不畏惧权威，那么更大的祸患就要来了。不要逼迫人民不得安居，不要阻塞人民的生路。只有不压迫人民，人民才不会厌恶统治者。所以圣人自知而不自我表现，自爱而不自以为高贵。' },
  { chapter: 73, text: '勇于敢则杀，勇于不敢则活。此两者，或利或害。天之所恶，孰知其故？是以圣人犹难之。天之道，不争而善胜，不言而善应，不召而自来，繟然而善谋。天网恢恢，疏而不失。', translation: '勇于逞强就会送命，勇于示弱就能活命。这两种勇敢，有的得利有的受害。天道不争而善于取胜，不说话而善于回应，不召唤而自动到来，宽缓而善于谋划。天网广大无边，虽然宽疏却不会漏失。' },
  { chapter: 74, text: '民不畏死，奈何以死惧之？若使民常畏死，而为奇者，吾得执而杀之，孰敢？常有司杀者杀。夫代司杀者杀，是谓代大匠斫。夫代大匠斫者，希有不伤其手矣。', translation: '人民不怕死，怎么能用死来恐吓他们？如果人民真的怕死，对于作恶的人，我就可以抓来杀掉，那谁还敢？但常有掌管杀伐的天道去执行。代替天道去杀，就像代替大木匠去砍木头。代替大木匠砍木头的人，很少有不砍伤自己的手的。' },
  { chapter: 75, text: '民之饥，以其上食税之多，是以饥。民之难治，以其上之有为，是以难治。民之轻死，以其上求生之厚，是以轻死。夫唯无以生为者，是贤于贵生。', translation: '人民饥饿，是因为统治者征收的赋税太多，所以才饥饿。人民难治理，是因为统治者政令繁苛，所以才难治理。人民不怕死，是因为统治者追求享受太奢侈，所以才不怕死。只有不追求生活享受的人，比过分看重生命的人更高明。' },
  { chapter: 76, text: '人之生也柔弱，其死也坚强。万物草木之生也柔脆，其死也枯槁。故坚强者死之徒，柔弱者生之徒。是以兵强则灭，木强则折。强大处下，柔弱处上。', translation: '人活着的时候身体是柔软的，死后就变得僵硬了。万物草木活着的时候是柔脆的，死后就变得干枯了。所以坚硬的东西属于死亡一类，柔软的东西属于生长一类。因此军队强大了就会灭亡，树木强大了就会折断。强大的处于下位，柔弱的处于上位。' },
  { chapter: 77, text: '天之道，其犹张弓与？高者抑之，下者举之，有余者损之，不足者补之。天之道，损有余而补不足。人之道则不然，损不足以奉有余。孰能有余以奉天下？唯有道者。是以圣人为而不恃，功成而不处，其不欲见贤。', translation: '自然的法则，岂不像是拉弓射箭吗？高了就压低它，低了就抬高它，有余的就减少它，不足的就补益它。自然的法则，是减少有余的来补给不足的。人间的法则却不是这样，是削减不足的来供奉有余的。谁能把有余的拿来供奉天下？只有有道的人。' },
  { chapter: 78, text: '天下莫柔弱于水，而攻坚强者莫之能胜，以其无以易之。弱之胜强，柔之胜刚，天下莫不知，莫能行。是以圣人云：受国之垢，是谓社稷主；受国不祥，是为天下王。正言若反。', translation: '天下没有比水更柔弱的，但攻克坚硬强壮的东西却没有能胜过它的，因为它是无法替代的。弱能胜强，柔能胜刚，天下没有人不知道，却没有人能做到。所以圣人说：承受全国的屈辱，才配做社稷之主；承受全国的灾殃，才配做天下之王。正面的话听起来好像反话一样。' },
  { chapter: 79, text: '和大怨，必有余怨，安可以为善？是以圣人执左契而不责于人。有德司契，无德司彻。天道无亲，常与善人。', translation: '调解深重的怨恨，必然还有残余的怨恨，怎么能算是妥善呢？所以圣人持有借据的存根而不向人索取。有德的人像管借据一样从容，无德的人像收租税一样苛刻。天道没有偏爱，永远帮助善良的人。' },
  { chapter: 80, text: '小国寡民。使有什伯之器而不用，使民重死而不远徙。虽有舟舆，无所乘之；虽有甲兵，无所陈之。使民复结绳而用之。甘其食，美其服，安其居，乐其俗。邻国相望，鸡犬之声相闻，民至老死不相往来。', translation: '使国家变小，使人民稀少。即使有各种各样的器具也不使用，使人民重视生命而不向远方迁徙。虽然有船只车辆，却没有必要乘坐；虽然有武器装备，却没有地方陈列。使人民回归到结绳记事的淳朴状态。吃得香甜，穿得漂亮，住得安适，过得快乐。' },
  { chapter: 81, text: '信言不美，美言不信。善者不辩，辩者不善。知者不博，博者不知。圣人不积，既以为人己愈有，既以与人己愈多。天之道，利而不害；圣人之道，为而不争。', translation: '真实的言语不华美，华美的言语不真实。善良的人不巧辩，巧辩的人不善良。有真知的人不博杂，博杂的人没有真知。圣人不积藏，他尽量帮助别人，自己反而更充足；他尽量给予别人，自己反而更丰富。自然的法则，是利万物而不伤害；圣人的法则，是施为而不争夺。' },
];
window.DAODEJING = DAODEJING;

// ── 炼体经典（黄帝内经/易筋经/五禽戏/八段锦等）──
var BODY_CLASSICS = [
  { title:'黄帝内经·上古天真论', text:'上古之人，其知道者，法于阴阳，和于术数，食饮有节，起居有常，不妄作劳，故能形与神俱，而尽终其天年，度百岁乃去。', translation:'上古懂得养生之道的人，效法阴阳变化规律，调和于术数，饮食有节制，作息有常规，不过度劳累，所以能做到形神合一，活到天年。' },
  { title:'黄帝内经·上古天真论', text:'虚邪贼风，避之有时，恬淡虚无，真气从之，精神内守，病安从来。是以志闲而少欲，心安而不惧，形劳而不倦，气从以顺，各从其欲，皆得所愿。', translation:'对外界致病因素要适时躲避，内心保持恬淡虚无，真气就会顺从，精神内守不外散，疾病从哪里来呢？' },
  { title:'黄帝内经·四气调神', text:'春三月，此谓发陈。天地俱生，万物以荣。夜卧早起，广步于庭，被发缓形，以使志生。', translation:'春季三个月，是推陈出新的季节。天地间生机勃发，万物欣欣向荣。晚睡早起，在庭院中散步，披散头发舒缓形体，使意志生发。' },
  { title:'黄帝内经·四气调神', text:'夏三月，此谓蕃秀。天地气交，万物华实。夜卧早起，无厌于日，使志无怒，使华英成秀，使气得泄，若所爱在外。', translation:'夏季三个月，是繁茂秀美的季节。天地之气交会，万物开花结果。晚睡早起，不要厌恶白天，使心志不怒，使气机宣通，如同爱恋在外。' },
  { title:'黄帝内经·四气调神', text:'秋三月，此谓容平。天气以急，地气以明。早卧早起，与鸡俱兴，使志安宁，以缓秋刑，收敛神气，使秋气平。', translation:'秋季三个月，是成熟收获的季节。天气急劲，地气清明。早睡早起，与鸡同时活动，使心志安宁，缓和秋季肃杀之气，收敛神气。' },
  { title:'黄帝内经·四气调神', text:'冬三月，此谓闭藏。水冰地坼，无扰乎阳。早卧晚起，必待日光，使志若伏若匿，若有私意，若已有得。去寒就温，无泄皮肤，使气亟夺。', translation:'冬季三个月，是闭藏的季节。水结冰，地冻裂，不要扰动阳气。早睡晚起，等待阳光，使心志如同潜伏隐匿，如同有私密之意。' },
  { title:'易筋经·总论', text:'筋弛则病，筋挛则瘦，筋靡则痿，筋弱则懈，筋缩则局，筋壮则强，筋舒则长，筋劲则刚，筋和则康。若其内有所助，外有所养，则筋之体立，而用自彰矣。', translation:'筋松弛就会生病，筋痉挛就会消瘦，筋萎靡就会痿弱，筋软弱就会懈怠，筋收缩就会拘束，筋强壮就会有力，筋舒展就会伸长，筋坚韧就会刚强，筋调和就会健康。' },
  { title:'易筋经·内壮', text:'内壮言坚，外壮言勇。外壮之勇，非内壮不可得也。内壮者，精气神充实于内，骨髓盈满，筋肉坚壮。欲内壮者，先须守中积气，使气血周流，百骸通畅。', translation:'内壮说的是坚实，外壮说的是勇猛。没有内壮的坚实，就没有外壮的勇猛。所谓内壮，就是精气神充实于内，骨髓盈满，筋肉坚实强壮。' },
  { title:'易筋经·采精华', text:'日精月华，天地之正气也。于寅卯时，面东静坐，调匀呼吸，目视东方，吸东方清气，咽下丹田，久久行之，则精气充足，筋骨强壮。', translation:'日月的精华，是天地的正气。在寅时到卯时（3-7点），面向东方静坐，调匀呼吸，目视东方，吸取东方的清气，咽下丹田，长期坚持，精气充足，筋骨强壮。' },
  { title:'洗髓经·序', text:'易筋之后，须洗髓。筋易而髓不洗，则外壮而内虚。洗髓者，洗去后天之浊秽，炼化先天之精气。使骨髓纯净，气血通彻，方可超凡入圣。', translation:'易筋之后还需要洗髓。只易筋不洗髓，就是外强中干。洗髓就是洗去后天的污浊，炼化先天的精气。让骨髓纯净，气血通畅，才能超凡入圣。' },
  { title:'洗髓经·运气', text:'运气之法，以心行气，以气运身。心静则气凝，气凝则神闲。以意领气，气随意行，周身流转，无微不至。久而行之，百病不生。', translation:'运气的方法是：用心来引导气，用气来运行身体。心静则气凝聚，气凝聚则神态安闲。用意识引领气，气跟随意识运行，在全身上下流转，无处不到。' },
  { title:'八段锦·双手托天', text:'双手托天理三焦——直立，两足分开与肩宽。双手缓缓上举，掌心向上，十指交叉翻掌上托，仰面观手背，同时缓缓吸气。托至极致，稍停，再缓缓放下，呼气。', translation:'这一式通过双手上托的动作，调理三焦（上焦心肺、中焦脾胃、下焦肝肾），使全身气机通畅。' },
  { title:'八段锦·左右开弓', text:'左右开弓似射雕——马步下蹲，双掌在胸前交叉。先向左推掌，右臂如拉弓状，目视左掌指尖。左右交替。舒展胸肺，疏通经络。', translation:'这一式模拟射箭的动作，能舒展胸廓，增强肺活量，疏通手三阴、手三阳经络。' },
  { title:'八段锦·调理脾胃', text:'调理脾胃须单举——直立，一手上举掌心向上，一手下按掌心向下。两手上下用力对拉。交替进行。能调理脾胃，促进消化。', translation:'这一式通过上下对拉的动作，牵拉腹腔和背部，对脾胃起到按摩作用，促进消化吸收功能。' },
  { title:'八段锦·五劳七伤', text:'五劳七伤往后瞧——直立，两足与肩宽。头缓缓转向左后方，目视左肩后方，同时吸气。转回正面，呼气。同样做右侧。', translation:'这一式通过颈部扭转运动，刺激大椎穴和背部俞穴，对五劳七伤有调治作用。' },
  { title:'八段锦·摇头摆尾', text:'摇头摆尾去心火——马步下蹲，双手扶膝。上身前俯，头部自左向右摇转，臀部相应摆动。能降心火，安神定志。', translation:'这一式通过摇头和摆尾的动作，引火下行，降心火，安神定志，对心烦失眠有缓解作用。' },
  { title:'五禽戏·虎戏', text:'虎戏者，四肢距地，前三掷，却二掷。长引腰，乍却，仰天即返。距行前却各七过也。仿效虎之威猛，强腰健肾，壮骨生髓。', translation:'虎戏：四肢着地，向前跳跃三次，向后跳跃两次。伸展腰部，时而向后仰，仰看天空。模仿老虎的威猛，强化腰肾。' },
  { title:'五禽戏·鹿戏', text:'鹿戏者，四肢距地，引项反顾，左三右二。左右伸脚，伸缩亦三亦二也。仿效鹿之优雅，活动颈椎，疏通督脉。', translation:'鹿戏：四肢着地，伸长脖子向后看，左三次右两次。模仿鹿的优雅，活动颈椎，疏通督脉。' },
  { title:'五禽戏·熊戏', text:'熊戏者，正仰，以两手抱膝下，举头，左擗地七，右亦七。蹲地，以手左右托地。仿效熊之沉稳，强健脾胃，活络气血。', translation:'熊戏：仰面躺下，双手抱膝，抬头，向左翻滚七次，向右七次。模仿熊的沉稳，强健脾胃。' },
  { title:'五禽戏·猿戏', text:'猿戏者，攀物自悬，伸缩身体，上下各七。以脚拘物自悬，左右七。手钩却立，按头各七。仿效猿之灵巧，活动全身关节，益气养血。', translation:'猿戏：攀住物体悬吊自己，伸缩身体，上下各七次。模仿猿的灵巧，活动全身关节。' },
  { title:'五禽戏·鸟戏', text:'鸟戏者，立起，翘一足，伸两臂，扬眉鼓力，左右各七。坐伸脚，手挽足距，各七。伸缩二臂各七也。仿效鸟之舒展，宣肺理气，疏通经络。', translation:'鸟戏：站立，翘起一只脚，伸展双臂，扬眉用力，左右各七次。模仿鸟的舒展，宣发肺气。' },
  { title:'彭祖导引法', text:'夜半后，生气时，正卧，瞑目握固，闭气不息，于心至数二百，乃口吐气出之，日增其数，久久修习，则耳目聪明，气力百倍。', translation:'半夜之后，阳气生发的时候，正面躺卧，闭目握拳，闭气不呼吸，心中默数到二百，然后口中吐气。每日增加默数，长久修习，则耳目聪明，气力百倍。' },
  { title:'彭祖导引法', text:'导引之法，先当摩手令热，熨两目、鼻、耳、面。又以手摩额上，顺发摩顶，引气下行。又摩两胁及脐下，使气流通，诸病不生。', translation:'导引的方法：先搓手使发热，热敷两眼、鼻、耳、面部。再用手搓额头，顺着头发按摩头顶，引气下行。再按摩两胁和肚脐下面，使气流通。' },
  { title:'养性延命录', text:'人欲小劳，但莫至疲及强所不能堪胜耳。人食毕，当行步踌躇，有所修为，为快也。流水不腐，户枢不蠹，以其运动故也。', translation:'人需要适当劳作，只是不要过度疲劳和勉强做不能承受的事。吃完饭应当散步徘徊，做一些活动，才会感到舒适。流水不腐臭，门轴不生虫，是因为它们运动的原因。' },
  { title:'养性延命录', text:'导引可以逐客邪于关节，活血气于肌肤。行之百日，肌肤光泽；行之千日，老而不衰。调利筋骨，皆有裨益。', translation:'导引术可以把外部邪气驱出关节，让血气在肌肤中运行。练习一百天，肌肤有光泽；练习一千天，年老而不衰弱。对舒筋活络都有好处。' },
  { title:'孙思邈·养生铭', text:'怒甚偏伤气，思多太损神。神疲心易役，气弱病来侵。勿使悲欢极，当令饮食均。再三防夜醉，第一戒晨嗔。亥寝鸣云鼓，寅兴漱玉津。妖邪难犯己，精气自全身。', translation:'过于愤怒伤气，思虑太多损神。精神疲惫心易劳累，气力虚弱病就来侵。不要大悲大喜，饮食要均衡。再三防止夜晚醉酒，第一要戒绝清晨发怒。' },
  { title:'孙思邈·摄养枕中方', text:'凡欲求仙，大法有三：保精、行气、服饵。凡此三事，亦各有法，不得真传，终无益也。保精者，勿使漏泄；行气者，使气周流；服饵者，补养气血。', translation:'想要修道求仙，大法有三条：保精、行气、服饵。这三件事各有方法，没有得到真传，终究没有益处。保精就是不使精气泄漏；行气就是让气在全身周流。' },
  { title:'华佗·五禽戏诀', text:'动摇则谷气得消，血脉流通，病不得生。譬如户枢，终不朽也。是以古之仙者，为导引之事，引挽腰体，动诸关节，以求难老。', translation:'身体活动则食物得以消化，血脉流通，疾病不会产生。就像门轴一样，终究不会腐朽。所以古代的仙人做导引之事，拉伸腰部身体，活动各个关节，以求延缓衰老。' },
  { title:'天隐子·养生', text:'凡学道者，先须安坐，静坐存神，调息入定。次须运动，屈伸手足，使气流通。坐不欲至倦，行不欲至劳。久坐伤肉，久立伤骨，久行伤筋。', translation:'学道的人，先要安然静坐，凝神静气，调息入定。然后需要运动，屈伸手足，使气流通。坐不要到疲倦，行不要到劳累。久坐伤肉，久站伤骨，久行伤筋。' },
  { title:'天隐子·养生', text:'久视伤血，久卧伤气，久坐伤肉，久立伤骨，久行伤筋。此五劳之所伤也。故养生之道，必使动静相兼，劳逸适度，则气血和畅，百脉调顺。', translation:'长时间看伤血，长时间躺伤气，长时间坐伤肉，长时间站伤骨，长时间走伤筋。这是五种过劳引起的损伤。所以养生之道，必须动静结合，劳逸适度。' },
  { title:'苏东坡·养生诀', text:'每夜以手热熨两足心及脐下，行气功。又用手摩腹，待腹中气行、觉手足和畅乃止。此法行之，不但治病，且可延年。', translation:'每天晚上用手搓热后热敷脚心和肚脐下方，做气功。再用手按摩腹部，等腹中有气运行、感觉到手脚和畅为止。这个方法不仅可以治病，还能延年益寿。' },
  { title:'苏东坡·养生诀', text:'盘中举目，坐间起立，仰面呼出浊气，吸进清气。屈伸四肢，使骨节作响。如此三度，则一日之内，气血通畅，精神百倍。', translation:'在座位间抬起眼睛，站起来，仰面呼出浊气，吸进清气。屈伸四肢，让骨节作响。这样反复三次，一天之内就会气血通畅，精神百倍。' },
];
var BODY_ACTIVITY_TIPS = [
  '🚶 站起来走两步！一直坐着可不行～',
  '🙆 伸直双臂，向上拉伸！感觉肩膀舒展开了～',
  '💪 握紧拳头再松开，反复五次，活络手部气血！',
  '🧘 闭上眼，深吸一口气，缓缓呼出～',
  '🦵 站起来，原地轻跳几下，让下肢血脉流通！',
  '🤸 转动脖子，左三圈右三圈，颈椎舒服多了～',
  '🏋️ 双手叉腰，左右扭腰，活动腰椎！',
  '🧎 做几个下蹲，膝盖微屈再起，锻炼大腿力量！',
  '🙌 用力伸个懒腰——啊，舒服！',
  '🦶 抬起脚踝转一转，双脚交替，久坐之后足部容易僵硬～',
  '👐 双手合十用力互推，坚持10秒，放松手腕！',
  '🧍 站起来，双手扶腰，向后仰身，伸展腹部和腰部！',
];
window.BODY_CLASSICS = BODY_CLASSICS;
window.BODY_ACTIVITY_TIPS = BODY_ACTIVITY_TIPS;

/* ═══════════ 打坐·道德经沉浸系统 ═══════════ */
function startMeditation() {
  // 每日一次限制
  if (G._dailyDone && G._dailyDone.day === G.time.day && G._dailyDone.meditation) {
    addNarrative('🧘 今日打坐已满，明日再修。', 'system');
    return;
  }
  if (!G._dailyDone) G._dailyDone = {};
  G._dailyDone.meditation = true;
  G._dailyDone.day = G.time.day;
  const p = G.player;
  if (!p) return;
  if (p.qi < 15) {
    addNarrative('体内灵力不足，无法打坐。先休息恢复吧。', 'system'); return;
  }
  
  if (typeof applySceneMechanics === 'function') applySceneMechanics(G.currentScene);
  
  var overlay = document.getElementById('meditation-overlay');
  if (!overlay) return;
  
  var scene = getSceneData(G.currentScene);
  document.getElementById('med-location').textContent = scene ? scene.name : '未知之地';
  document.getElementById('med-bar').style.width = '0%';
  document.getElementById('med-pct').textContent = '0%';
  document.getElementById('med-step').textContent = '凝神';
  document.getElementById('med-result').style.display = 'none';
  document.getElementById('med-close-btn').style.display = 'none';
  document.getElementById('med-interact').style.display = 'none';
  
  // 随机选一章道德经
  var ddj = typeof DAODEJING !== 'undefined' ? DAODEJING : [];
  var ch = ddj.length > 0 ? ddj[Math.floor(Math.random() * ddj.length)] : null;
  
  // 显示经文
  var classicEl = document.getElementById('med-classic');
  var transEl = document.getElementById('med-translation');
  var chapterNum = document.getElementById('med-chapter-num');
  
  if (ch) {
    classicEl.textContent = ch.text;
    transEl.textContent = ch.translation;
    chapterNum.textContent = '第' + ch.chapter + '章';
  } else {
    classicEl.textContent = '（道经无言）';
    transEl.textContent = '';
    chapterNum.textContent = '';
  }
  
  overlay.classList.remove('hidden');
  
  // 中断标志（中途退出时置true，终止tick链）
  G._meditationAborted = false;
  
  // 60秒计时 = 1分钟
  // 分为3个阶段：诵经(0-30s)→悟道互动(30-40s)→收功(40-60s)
  var TOTAL_MS = 60000;
  var startTime = Date.now();
  var interactShown = false;
  
  // 进度更新帧
  function tick() {
    if (G._meditationAborted) return; // 中途退出，终止动画链
    var elapsed = Date.now() - startTime;
    var pct = Math.min(100, Math.round(elapsed / TOTAL_MS * 100));
    
    document.getElementById('med-bar').style.width = pct + '%';
    document.getElementById('med-pct').textContent = pct + '%';
    
    if (pct < 30) {
      document.getElementById('med-step').textContent = '📖 诵经·悟道';
    } else if (pct < 40) {
      if (!interactShown) {
        interactShown = true;
        _showMeditationInteract(ch);
      }
      document.getElementById('med-step').textContent = '💡 心有感悟';
    } else if (pct < 90) {
      document.getElementById('med-step').textContent = '🧘 吐纳·运化';
    } else {
      document.getElementById('med-step').textContent = '✨ 功行圆满';
    }
    
    if (elapsed < TOTAL_MS) {
      setTimeout(tick, 200);
    } else {
      _finishMeditation(scene, ch);
    }
  }
  
  // 立刻把经文展示出来
  document.getElementById('med-text').style.display = 'block';
  
  tick();
}

/* ── 打坐中互动：对道德经章节的感悟选择 ── */
function _showMeditationInteract(chapter) {
  if (!chapter) return;
  var interactEl = document.getElementById('med-interact');
  var choicesEl = document.getElementById('med-choices');
  if (!interactEl || !choicesEl) return;
  
  // 根据经文内容生成3个感悟选项
  var ch = chapter.chapter;
  var choices = _generateInsightChoices(ch, chapter.text);
  
  choicesEl.innerHTML = '';
  choices.forEach(function(c, i) {
    var btn = document.createElement('button');
    btn.textContent = c.label;
    btn.style.cssText = 'padding:6px 10px;border-radius:6px;font-size:10px;cursor:pointer;background:rgba(201,169,110,0.1);border:1px solid rgba(201,169,110,0.25);color:var(--text);line-height:1.3;';
    btn.onclick = function() {
      // 执行效果
      _applyInsightEffect(chapter, c.effect);
      // 显示感悟反馈
      var msgEl = document.getElementById('med-interact');
      if (msgEl) {
        msgEl.innerHTML = '<div style="font-size:11px;color:var(--accent);line-height:1.5;padding:4px 0;">'
          + c.result + '</div>';
      }
      // 进度跳转到下一阶段
    };
    choicesEl.appendChild(btn);
  });
  
  interactEl.style.display = 'block';
}

/* ── 生成感悟选项 ── */
function _generateInsightChoices(chapterNum, text) {
  // 根据章节内容特点生成三个方向的感悟
  // 所有选项都有收益，只是类型不同
  var choices = [
    { label: '🧠 领悟智慧', effect: 'wisdom', result: '灵台清明，悟性有所增长！' },
    { label: '🧘 坚定道心', effect: 'mood', result: '道心稳固，心境愈发平和！' },
  ];
  
  // 第三选项根据哪章不同
  var thirdChoice = { label: '💪 强健根骨', effect: 'bone', result: '经文滋养经脉，根骨得以强化！' };
  if (chapterNum === 8 || chapterNum === 43 || chapterNum === 78) {
    thirdChoice = { label: '🌊 上善若水', effect: 'talent', result: '感悟上善之道，修道天赋提升！' };
  } else if (chapterNum === 33 || chapterNum === 44 || chapterNum === 46) {
    thirdChoice = { label: '🛡️ 知足常乐', effect: 'hp', result: '知足之足常足矣，气血充盈！' };
  } else if (chapterNum === 25 || chapterNum === 42 || chapterNum === 51) {
    thirdChoice = { label: '☯️ 道法自然', effect: 'talent', result: '与大道共鸣，修炼资质的瓶颈有所松动！' };
  } else if (chapterNum === 16 || chapterNum === 37 || chapterNum === 48) {
    thirdChoice = { label: '🎯 无为而治', effect: 'mood', result: '悟得无为之道，心神一片空明！' };
  } else if (chapterNum === 64 || chapterNum === 63 || chapterNum === 11) {
    thirdChoice = { label: '🏔️ 千里之行', effect: 'qiGain', result: '千里之行始于足下，灵力有所精进！' };
  }
  
  choices.push(thirdChoice);
  return choices;
}

/* ── 应用感悟效果 ── */
function _applyInsightEffect(chapter, effectType) {
  var p = G.player;
  if (!p) return;
  
  // 记录读过的章节
  if (!G._readChapters) G._readChapters = [];
  if (chapter && G._readChapters.indexOf(chapter.chapter) === -1) {
    G._readChapters.push(chapter.chapter);
  }
  
  var mult = getCultivationMultiplier('qi');
  var bonusMult = 1.0 + (p.wisdom > 70 ? 0.3 : 0) + (p.mood > 70 ? 0.2 : 0);
  
  switch(effectType) {
    case 'wisdom':
      p.wisdom = Math.min(100, p.wisdom + Math.floor(1 + mult * 0.5));
      break;
    case 'mood':
      p.mood = Math.min(100, p.mood + Math.floor(3 + mult));
      break;
    case 'bone':
      p.bone = Math.min(100, p.bone + Math.floor(1 + mult * 0.3));
      break;
    case 'talent':
      p.talent = Math.min(2.0, (p.talent || 1.0) + 0.02 * bonusMult);
      break;
    case 'hp':
      p.hp = Math.min(p.maxHp, p.hp + Math.floor(10 + mult * 2));
      break;
    case 'qiGain':
      // 直接给少量修为
      var cur = getQiRealm();
      var next = QI_REALMS[p.qiRealmIndex + 1];
      if (next) {
        var gain = Math.round((next.cpRequired - cur.cpRequired) * 0.005 * bonusMult);
        if (typeof gainCultivation === 'function') gainCultivation('qi', gain);
        else p.qiCultivationPoints += gain;
      }
      break;
  }
  
  recalcStats(p);
  updateAllUI();
}

/* ── 完成打坐 ── */
function _finishMeditation(scene, chapter) {
  var p = G.player;
  
  // 顿悟检测
  var enlightenmentTriggered = false;
  if (typeof triggerEnlightenmentFromCultivation === 'function') {
    triggerEnlightenmentFromCultivation();
  }
  
  // 计算修为增益（%-制）
  var cur = getQiRealm();
  var next = QI_REALMS[p.qiRealmIndex + 1];
  if (!next) {
    // 🔄 炼气已圆满（飞升）：修为溢出到炼体，仍推进一天
    if (typeof gainCultivation === 'function') {
      var multFull = typeof getCultivationMultiplier === 'function' ? getCultivationMultiplier('qi') : 1;
      gainCultivation('body', Math.round(150 + multFull * 50));
    }
    advanceTime(24);
    if (typeof gainSkillMasteryXp === 'function') gainSkillMasteryXp('吐纳法', 15);
    if (typeof gainSkillMasteryXp === 'function') gainSkillMasteryXp('心法', 8);
    document.getElementById('med-bar').style.width = '100%';
    document.getElementById('med-pct').textContent = '100%';
    document.getElementById('med-step').textContent = '✨ 功成';
    document.getElementById('med-interact').style.display = 'none';
    var resultEl2 = document.getElementById('med-result');
    resultEl2.style.display = 'block';
    resultEl2.innerHTML = '<div style="font-size:12px;color:var(--accent);font-weight:bold;margin-bottom:4px;">✨ 打坐一日</div>' +
      '<div style="font-size:10px;color:var(--text);">炼气已臻圆满——道韵流转，化为炼体之力。</div>';
    document.getElementById('med-close-btn').style.display = 'inline-block';
    recalcStats(p);
    updateAllUI();
    return;
  }
  
  var needed = next.cpRequired - cur.cpRequired;
  var mult = getCultivationMultiplier('qi');
  
  // 🌱 新手友好：练气期打坐收益提高（前期2%，随境界递减，高境界靠境界加速乘区）
  // 练气前期(0-3层) 2% / 练气中期(4-8层) 1.2% / 筑基(9-11) 0.8% / 之后 0.5%
  var qiIdx = p.qiRealmIndex || 0;
  var basePct = qiIdx <= 3 ? 2.0 : qiIdx <= 8 ? 1.2 : qiIdx <= 11 ? 0.8 : 0.5;
  var finalPct = basePct * mult;
  // 读过此章再加成
  if (G._readChapters && chapter && G._readChapters.indexOf(chapter.chapter) !== -1 && chapter.chapter > 40) {
    finalPct += 0.3; // 读过较深章节有鼓励
  }
  // 高心境加成
  if (p.mood > 70) finalPct += 0.2;
  // 封顶5%
  finalPct = Math.min(5, Math.max(0.5, finalPct));
  
  var gain = Math.round(needed * finalPct / 100);
  if (typeof gainCultivation === 'function') gainCultivation('qi', gain);
  else p.qiCultivationPoints += gain;
  p.qi = Math.max(0, p.qi - 15);
  advanceTime(24);
  
  // 技能熟练
  if (typeof gainSkillMasteryXp === 'function') gainSkillMasteryXp('吐纳法', 15);
  if (typeof gainSkillMasteryXp === 'function') gainSkillMasteryXp('心法', 8);
  
  // 提示：读经计数
  var readCount = G._readChapters ? G._readChapters.length : 0;
  var readNote = readCount > 0 ? '（已读' + readCount + '章）' : '';
  
  // 显示结果
  document.getElementById('med-bar').style.width = '100%';
  document.getElementById('med-pct').textContent = '100%';
  document.getElementById('med-step').textContent = '✨ 功成' + readNote;
  document.getElementById('med-interact').style.display = 'none';
  
  var resultEl = document.getElementById('med-result');
  resultEl.style.display = 'block';
  
  var html = '<div style="font-size:12px;color:var(--accent);font-weight:bold;margin-bottom:4px;">✨ 打坐一日</div>';
  html += '<div style="font-size:10px;color:var(--text);">修为进度 +' + finalPct.toFixed(1) + '% <span style="color:var(--text-dim);">(' + gain + '修为)</span></div>';
  if (chapter) {
    html += '<div style="font-size:9px;color:#8bc34a;margin-top:4px;">📖 诵读「道德经·第' + chapter.chapter + '章」</div>';
  }
  
  addNarrative('你一打坐便是一天一夜。默诵道德经，心与道合。', 'narr-default');
  
  // 大关预警
  var progress = typeof getCultivationProgress === 'function' ? getCultivationProgress('qi') : 0;
  if (progress >= 65 && progress < 85 && p.qiRealmIndex < QI_REALMS.length - 1) {
    var nextRealm = QI_REALMS[p.qiRealmIndex + 1];
    var bigGate = p.qiRealmIndex === 8 || p.qiRealmIndex === 11 || p.qiRealmIndex === 14 ||
      p.qiRealmIndex === 17 || p.qiRealmIndex === 20 || p.qiRealmIndex === 22;
    if (bigGate) {
      var pillIds = ['zhuji_dan','jindan_dan','yuanying_dan','huashen_dan','dacheng_dan','dujie_dan'];
      var neededPill = pillIds[Math.min(p.qiRealmIndex >= 22 ? 5 : p.qiRealmIndex >= 20 ? 4 : p.qiRealmIndex >= 17 ? 3 : p.qiRealmIndex >= 14 ? 2 : p.qiRealmIndex >= 11 ? 1 : 0, 5)];
      var owned = p.inventory.reduce(function(sum, it) { return it.id === neededPill ? sum + (it.qty || 1) : sum; }, 0);
      if (owned < 1) {
        html += '<div style="font-size:9px;color:#ff9800;margin-top:6px;border-top:1px solid rgba(255,152,0,0.2);padding-top:4px;">';
        html += '⚠️ 前方' + nextRealm.name + '大关·需备「' + neededPill + '」突破</div>';
      }
    }
  }
  
  resultEl.innerHTML = html;
  document.getElementById('med-close-btn').style.display = 'inline-block';
  
  qiBreakthroughCheck();
  recalcStats(p);
  updateAllUI();
}

function closeMeditation() {
  var overlay = document.getElementById('meditation-overlay');
  if (overlay) overlay.classList.add('hidden');
  // 恢复互动区域（下一轮打坐复用）
  var interactEl = document.getElementById('med-interact');
  if (interactEl) {
    interactEl.style.display = 'none';
    interactEl.innerHTML = '<div style="font-size:11px;color:var(--accent);margin-bottom:8px;">💡 心有感悟……</div><div id="med-choices" style="display:flex;gap:6px;flex-wrap:wrap;justify-content:center;"></div>';
  }
  updateAllUI();
}

// ✕ 中途退出打坐：不结算收益，还原每日次数（误触不惩罚）
function abortMeditation() {
  if (G) G._meditationAborted = true; // 终止tick链，防止60秒后偷偷结算
  // 还原每日打坐标记，让玩家可以重新打坐
  if (G._dailyDone && G._dailyDone.meditation && G._dailyDone.day === G.time.day) {
    delete G._dailyDone.meditation;
  }
  addNarrative('你缓缓起身，暂且收功。', 'system');
  closeMeditation();
}

// 保留qiCultivate供自动模式使用
function qiCultivate() {
  // 每日一次限制
  if (G._dailyDone && G._dailyDone.day === G.time.day && G._dailyDone.qi) {
    if (!G._autoMode) addNarrative('⚠️ 今日打坐已满，明日再来。', 'system');
    return;
  }
  if (!G._dailyDone) G._dailyDone = {};
  G._dailyDone.qi = true;
  G._dailyDone.day = G.time.day;
  if (G._autoMode) {
    _doQuickCultivate();
  } else {
    startMeditation();
  }
  // 🔧 打坐消耗一整天：advanceTime(24) 后 _dailyDone.day 会过期，
  //    导致 doCultivate 里 needMeditate 永远为 true → 炼体永远轮不到（自动模式炼体不动的根因）
  //    这里把打坐标记同步到推进后的日期，让下次 cultivate 正常轮到炼体
  if (G._dailyDone && G._dailyDone.day !== undefined && G.time && G.time.day !== undefined) {
    G._dailyDone.day = G.time.day;
  }
}

// 自动模式快捷打坐
function _doQuickCultivate() {
  const p = G.player;
  if (p.qi < 15) return;
  if (typeof applySceneMechanics === 'function') applySceneMechanics(G.currentScene);
  if (typeof triggerEnlightenmentFromCultivation === 'function') triggerEnlightenmentFromCultivation();
  
  var cur = getQiRealm();
  var next = QI_REALMS[p.qiRealmIndex + 1];
  if (!next) {
    // 🔄 炼气已圆满：修为溢出到炼体
    var multFull = typeof getCultivationMultiplier === 'function' ? getCultivationMultiplier('qi') : 1;
    if (typeof gainCultivation === 'function') gainCultivation('body', Math.round(50 + multFull * 20));
    p.qi = Math.max(0, p.qi - 15);
    advanceTime(24);
    if (typeof gainSkillMasteryXp === 'function') gainSkillMasteryXp('吐纳法', 15);
    if (typeof gainSkillMasteryXp === 'function') gainSkillMasteryXp('心法', 8);
    if (typeof addDailyLogEntry === 'function') addDailyLogEntry('cultivate', '打坐修炼');
    qiBreakthroughCheck();
    recalcStats(p);
    return;
  }
  
  var needed = next.cpRequired - cur.cpRequired;
  var mult = getCultivationMultiplier('qi');
  var finalPct = Math.min(5, Math.max(0.5, 0.5 * mult));
  var gain = Math.round(needed * finalPct / 100);
  
  if (typeof gainCultivation === 'function') gainCultivation('qi', gain);
  else p.qiCultivationPoints += gain;
  p.qi = Math.max(0, p.qi - 15);
  advanceTime(24);
  
  if (typeof gainSkillMasteryXp === 'function') gainSkillMasteryXp('吐纳法', 15);
  if (typeof gainSkillMasteryXp === 'function') gainSkillMasteryXp('心法', 8);
  if (typeof addDailyLogEntry === 'function') addDailyLogEntry('cultivate', '打坐修炼');
  
  qiBreakthroughCheck();
  recalcStats(p);
}

function qiCultivateOld() {
  const p = G.player;
  if (p.qi < 15) {
    addNarrative('体内灵力不足，无法修炼。先休息恢复吧。', 'system'); return;
  }
  // 环境机制
  if (typeof applySceneMechanics === 'function') applySceneMechanics(G.currentScene);
  if (typeof triggerEnlightenmentFromCultivation === 'function') triggerEnlightenmentFromCultivation();

  const mult = getCultivationMultiplier('qi');
  // 境界越高，每次吐纳的基础收益越大（不单纯靠倍率堆）
  var baseGain = 10 + p.qiRealmIndex * 5;
  let gain = baseGain * mult;
  // 通过功法卡槽识别吐纳法，而非随机找一个active技能
  var tunaId = p.skillSlots && p.skillSlots.tuna;
  var tunaSkill = tunaId ? p.skills.find(function(s){ return s.id === tunaId; }) : null;
  if (tunaSkill && tunaSkill.active) gain += 5;
  gain = Math.round(gain);

  if (typeof gainCultivation === 'function') gainCultivation('qi', gain);
  else p.qiCultivationPoints += gain;
  p.qi = Math.max(0, p.qi - 15);
  advanceTime(1);
  
  // ═══════ 修炼沉浸叙事 ═══════
  var scene = getSceneData(G.currentScene);
  var gap = p._sceneCultGap;
  if (typeof scene !== 'undefined' && scene && gap !== undefined) {
    var period = G.time.period || '昼';
    var weather = typeof autoWeather !== 'undefined' ? autoWeather : '晴';
    var season = typeof autoSeason !== 'undefined' ? autoSeason : '春';
    var mood = p.mood || 50;
    var hourLabel = period.replace('时', '') || '午时';
    var skillName = '基础吐纳法';
    var tunaId = p.skillSlots && p.skillSlots.tuna;
    var tunaSkill = tunaId ? p.skills.find(function(s){ return s.id === tunaId; }) : null;
    if (tunaSkill && tunaSkill.active) skillName = tunaSkill.name;

    var seasonImgs = {
      '春': ['春风拂面，草木萌发的清香混着泥土气息扑面而来。', '檐下的燕子呢喃，远处偶尔传来几声布谷鸟啼。', '春日的阳光温暖而不炙热，照在身上懒洋洋的。'],
      '夏': ['夏蝉在树荫里鸣叫不止，热浪蒸腾，空气中的灵气都有些躁动。', '天气闷热，汗水很快浸湿了衣襟，但你心若冰清。', '酷暑难耐，但越是这种时候，越能淬炼道心。'],
      '秋': ['秋高气爽，天边几缕薄云如丝如缕。凉风掠过，带起一地落叶。', '空气中弥漫着桂花的甜香，远处山峦层林尽染。', '秋意渐浓，天地间有一种肃杀之美，灵气也变得愈发清澈。'],
      '冬': ['寒风刺骨，呼出的气息凝成白雾。大地冰封，万物蛰伏而生机潜藏。', '天空飘起细雪，落在肩头很快融化。天地一片寂静，唯有丹田中灵力在运转。', '冬季的山林万籁俱寂，仿佛整个天地都在陪你闭关。']
    };
    var weatherImgs = {
      '晴': ['阳光透过树叶缝隙洒下斑驳的光影。', '万里无云，天朗气清。'],
      '阴': ['天色阴沉，云层低垂，空气中弥漫着山雨欲来的气息。', '铅灰色的云层遮住了阳光，天地间一片朦胧。'],
      '雨': ['细雨如丝，轻轻打在树叶上沙沙作响。空气中水灵气格外浓郁。', '雨声淅淅沥沥，如同一曲悠长的古琴。'],
      '雷雨': ['雷声滚滚，电光撕裂天幕。雨势滂沱而下，天地间充斥着暴烈的灵气。', '惊雷乍响，仿佛天道在怒吼。雨幕中，你感到一种磅礴的生机在涌动。'],
      '风': ['山风猎猎，吹得衣袍猎猎作响。风灵气在身边流转不息。', '狂风呼啸着穿过山谷，卷起残叶与尘土。']
    };
    var si = seasonImgs[season] || seasonImgs['春'];
    var wi = weatherImgs[weather] || weatherImgs['晴'];
    
    var passages = [];
    passages.push(si[Math.floor(Math.random() * si.length)] + ' ' + wi[Math.floor(Math.random() * wi.length)]);

    if (gap <= -3) {
      var deadTexts = [
        '你盘膝而坐，运转' + skillName + '。然而丹田空空荡荡，周遭灵气犹如枯竭的古井，无论如何催动心法，都只能汲取出微不可察的一丝。',
        '你闭目调息，试图引天地灵气入体。但四周的灵脉仿佛对你关上了门——这片土地上的灵气，早已承载不了你如今的境界。',
        '吐纳数十次，积累的灵力还不如寻常呼吸来得多。你睁开眼，目光扫过这片熟悉的山水——是时候离开了。',
        '经脉中空荡荡的，仿佛大海之中只有一滴水。你苦笑——这个境界还蹲在这里，就像一条龙困在浅滩里。',
        skillName + '在体内运转了一个小周天，然而收获甚微。这里的天地灵气对你而言，就像一杯水倒进了沙漠。'
      ];
      passages.push(deadTexts[Math.floor(Math.random() * deadTexts.length)]);
      if (mood > 60) {
        passages.push('但你心境平和——修行之路本就有进有退。或许不是此地负你，而是你的路已经到了更远的地方。');
      } else if (mood < 40) {
        passages.push('一丝焦躁掠过心头。你能感觉到修为停滞的沉重感——像一堵无形的墙横亘在面前。');
      } else {
        passages.push('你叹了口气，收了功。修行的路上，总有些地方要到站了。');
      }
    } else if (gap === -2 || gap === -1) {
      var thinTexts = [
        '你盘膝而坐，阖上双目。' + skillName + '运转之下，一缕缕稀薄的灵气缓缓纳入丹田，犹如细沙流过指尖。不多，但聊胜于无。',
        '灵气在经脉中缓缓流淌，如同一条将干未干的小溪。' + hourLabel + '的微风拂过面庞，你沉下心，默默地积累着——哪怕慢，也是前进。',
        '你运转心法，从这片天地中汲取着微弱的灵气。就像蚂蚁搬山，每一次吐纳都只是一粒沙——但沙聚多了，也能成塔。'
      ];
      passages.push(thinTexts[Math.floor(Math.random() * thinTexts.length)]);
      if (gap === -1) {
        var midFlavors = [
          '你能感觉到，此地已接近你修为的边界。再进一步，就需要更广阔的天地了。',
          '灵气虽然稀薄，但你反倒静下心来——有时候，越是艰难的环境，越能打磨根基。',
          '你仔细感应着灵气在经脉中的每一丝流转。稀薄，但质地纯净——毕竟，这里的灵脉也曾滋养过无数前辈。'
        ];
        passages.push(midFlavors[Math.floor(Math.random() * midFlavors.length)]);
      }
    } else if (gap === 0) {
      var goodTexts = [
        '你盘膝坐下，双手结印。' + skillName + '刚一运转，周遭的灵气便如听到召唤般汇聚而来，顺着你的经脉涌入丹田。暖流在体内游走，每一寸穴窍都在欢快地吞吐着。',
        '你进入入定状态。灵气在体内循环往复，如同潮汐涨落。丹田中的灵力池以肉眼可见的速度充盈起来——这种感觉，就像漂泊已久的游子终于回到了故土。',
        '功法运转如行云流水，天地灵气与你的修为恰好共振。每一次吐纳都带着淡淡的满足感——就像琴师拨动了最准的那根弦。',
        '你阖目凝神，神识与天地相连。' + hourLabel + '的灵气最为中正平和，恰好滋养你的经脉。你能感受到每一丝灵气的脾性——它们不再抗拒你，而是像老朋友一样，亲和地融入你的身体。'
      ];
      passages.push(goodTexts[Math.floor(Math.random() * goodTexts.length)]);
      if (mood > 70) {
        var happyFlavors = [
          '心境澄明，道心稳固。你感到修炼的每一分每一秒都不是虚度——这就是修行中最美好的时刻：你知道自己正在前进。',
          '嘴角不自觉浮起一丝笑意——不为别的，只是觉得活着真好，能修炼真好。'
        ];
        passages.push(happyFlavors[Math.floor(Math.random() * happyFlavors.length)]);
      } else if (mood < 30) {
        var sadFlavors = [
          '心绪不宁，灵气在经脉中有些滞涩。你深吸一口气，努力驱散杂念——修行之道，容不得太多牵挂。',
          '烦恼如藤蔓缠绕着你的道心。你知道这样下去没有好处，但有些事——不是想放下就能放下的。'
        ];
        passages.push(sadFlavors[Math.floor(Math.random() * sadFlavors.length)]);
      }
    } else if (gap >= 2) {
      var greatTexts = [
        '你刚一运功，丹田就像饿极了的巨兽，贪婪地吞噬着四方的灵气！四周的灵脉仿佛活了过来，灵气如百川归海般疯狂涌向你！',
        '这里的灵气浓郁得令人窒息！不，不是窒息——是幸福到喘不过气来。' + skillName + '在体内疯狂运转，每一次周天都带来肉眼可见的精进！',
        '你感到每一寸肌肤都在呼吸，每一个毛孔都在吞吐。天地之间的灵气如银河倒泻，灌入你的四肢百骸——这哪里是修炼，简直就是被天地追着喂饭吃！',
        '隐隐有风雷之声在经脉中响起，那是灵气过于充沛导致的共鸣。你的身体在自发地吸收——不需要你刻意运转功法，它就自己在炼！'
      ];
      passages.push(greatTexts[Math.floor(Math.random() * greatTexts.length)]);
      var wowTexts = [
        '你心中狂喜！若能在此地闭关百日，抵得上在外面苦修十年！',
        '你连忙收敛心神，不敢浪费这难得的机缘。天予不取，反受其咎——这个道理你懂。',
        '你贪婪地吸纳着每一丝灵气，心中只有一个念头：这个地方，老子不走了！'
      ];
      passages.push(wowTexts[Math.floor(Math.random() * wowTexts.length)]);
    }
    
    if (passages.length > 0) {
      passages.forEach(function(t) { addNarrative(t, 'default'); });
    }
  }
  if (typeof trackSkillUsage === 'function' && typeof trackSkillUsage !== 'undefined') trackSkillUsage();
  if (typeof gainSkillMasteryXp === 'function') gainSkillMasteryXp('吐纳法', 15);
  if (typeof gainSkillMasteryXp === 'function') gainSkillMasteryXp('心法', 8);
  if (typeof addDailyLogEntry === 'function') addDailyLogEntry('cultivate', '运功修炼');
  if (typeof generateActionNarrative === 'function') generateActionNarrative({playerName:p.name, location:getSceneData(G.currentScene)?.name||'未知', time:G.time.period+'时'}, 'cultivate');

  // AI叙事
  renderNarrative({
    playerName: p.name,
    location: scene ? scene.name : '未知',
    time: G.time.period + '时',
    skill: tunaSkill ? tunaSkill.name : '基础吐纳法',
    sceneDesc: scene ? scene.description : '',
  }, 'cultivate');

  // ── 大关预警：修炼到七八成时主动提示 ──
  const progress = typeof getCultivationProgress === 'function' ? getCultivationProgress('qi') : 0;
  if (progress >= 65 && progress < 85 && p.qiRealmIndex < QI_REALMS.length - 1) {
    const next = QI_REALMS[p.qiRealmIndex + 1];
    const bigGate = p.qiRealmIndex === 8 || p.qiRealmIndex === 11 || p.qiRealmIndex === 14 ||
      p.qiRealmIndex === 17 || p.qiRealmIndex === 20 || p.qiRealmIndex === 22;
    if (bigGate) {
      // 检查背包里是否备齐下一级的突破丹药
      const pillIds = ['zhuji_dan','jindan_dan','yuanying_dan','huashen_dan','dacheng_dan','dujie_dan'];
      const needed = pillIds[Math.min(p.qiRealmIndex >= 22 ? 5 : p.qiRealmIndex >= 20 ? 4 : p.qiRealmIndex >= 17 ? 3 : p.qiRealmIndex >= 14 ? 2 : p.qiRealmIndex >= 11 ? 1 : 0, 5)];
      const owned = p.inventory.reduce((sum, it) => it.id === needed ? sum + (it.qty || 1) : sum, 0);
      if (owned < 1) {
        addNarrative(`━━━ ⚠️ 前方${next.name} · 大关将至 ═══`, 'event');
        addNarrative(`此关非同小可，需备齐突破丹药方可冲关。`, 'system');
        addNarrative(`💡 去黑市购买「${needed}」，或挑战场景BOSS碰碰运气。`, 'system');
        addNarrative(`💡 灵石不够？多在野外战斗，或出售不需要的材料。`, 'system');
      }
    }
  }
  // 突破检测
  qiBreakthroughCheck();
  recalcStats(p);
  updateAllUI();
}

function getQiBreakthroughReqs() {
  // 统一数据源：直接返回 BREAKTHROUGH_REQS（问道面板/实际突破共用）
  if (typeof BREAKTHROUGH_REQS !== 'undefined' && G && G.player) {
    var idx = G.player.qiRealmIndex;
    // 最高层(飞升,23)无需求；渡劫(22)→飞升仍需求渡劫丹
    return idx >= QI_REALMS.length - 1 ? null : (BREAKTHROUGH_REQS[idx] || null);
  }
  return null;
}
function getBodyBreakthroughReqs() {
  // 统一数据源：直接返回 BODY_BREAKTHROUGH_REQS（问道面板/物品来源/实际突破共用）
  if (typeof BODY_BREAKTHROUGH_REQS !== 'undefined' && G && G.player) {
    var idx = G.player.bodyRealmIndex;
    return idx >= 22 ? null : (BODY_BREAKTHROUGH_REQS[idx] || null);
  }
  return null;
}
window.getQiBreakthroughReqs=getQiBreakthroughReqs;
window.getBodyBreakthroughReqs=getBodyBreakthroughReqs;

// ── 突破门槛（全局常量，问道面板/突破共用）──
const BREAKTHROUGH_REQS = {
  0: { mood:30, items:[], reqSkills:0, desc:'初次突破，心随意动即可' },
  1: { mood:35, items:[], reqSkills:0, desc:'经脉渐通，水到渠成' },
  2: { mood:45, items:[{id:'poqi_dan',qty:1}], reqSkills:1, desc:'需一枚破气丹疏通' },
  3: { mood:50, items:[{id:'poqi_dan',qty:2}], reqSkills:1, desc:'需两枚破气丹冲穴' },
  4: { mood:55, items:[{id:'poqi_dan',qty:3}], reqSkills:2, desc:'需三枚破气丹贯通经脉' },
  5: { mood:60, items:[{id:'juli_dan',qty:1},{id:'poqi_dan',qty:2}], reqSkills:2, desc:'需聚气丹+破气丹冲关' },
  6: { mood:65, items:[{id:'juli_dan',qty:2},{id:'podi_dan',qty:1}], reqSkills:2, desc:'练气后期，需破壁丹辅助' },
  7: { mood:70, items:[{id:'juli_dan',qty:3},{id:'podi_dan',qty:2}], reqSkills:3, desc:'冲击练气巅峰，需大量丹药' },
  8: { mood:75, items:[{id:'podi_dan',qty:3},{id:'juli_dan',qty:3}], reqSkills:3, desc:'筑基关口，需三枚破壁丹冲关' },
  // 筑基境
  9:  { mood:78, items:[{id:'zhuji_dan',qty:1},{id:'juli_dan',qty:3}], reqSkills:3, desc:'筑基之始，需筑基丹固本培元' },
  10: { mood:80, items:[{id:'zhuji_dan',qty:2},{id:'podi_dan',qty:2}], reqSkills:3, desc:'筑基中期' },
  11: { mood:83, items:[{id:'zhuji_dan',qty:3},{id:'juli_dan',qty:5}], reqSkills:4, desc:'筑基圆满' },
  // 金丹境
  12: { mood:85, items:[{id:'jindan_dan',qty:1},{id:'zhuji_dan',qty:3}], reqSkills:4, desc:'金丹初成，需金丹丹凝聚金丹' },
  13: { mood:87, items:[{id:'jindan_dan',qty:2},{id:'podi_dan',qty:3}], reqSkills:4, desc:'金丹中期' },
  14: { mood:90, items:[{id:'jindan_dan',qty:3},{id:'zhuji_dan',qty:5}], reqSkills:5, desc:'金丹圆满' },
  // 元婴境
  15: { mood:92, items:[{id:'yuanying_dan',qty:1},{id:'jindan_dan',qty:3}], reqSkills:5, desc:'元婴初诞，需元婴丹破丹成婴' },
  16: { mood:94, items:[{id:'yuanying_dan',qty:2}], reqSkills:5, desc:'元婴中期' },
  17: { mood:96, items:[{id:'yuanying_dan',qty:3},{id:'jindan_dan',qty:5}], reqSkills:6, desc:'元婴大成' },
  // 化神境
  18: { mood:97, items:[{id:'huashen_dan',qty:1},{id:'yuanying_dan',qty:3}], reqSkills:6, desc:'化神机缘，需化神丹悟道' },
  19: { mood:98, items:[{id:'huashen_dan',qty:2}], reqSkills:6, desc:'化神中期' },
  20: { mood:99, items:[{id:'huashen_dan',qty:3},{id:'yuanying_dan',qty:5}], reqSkills:6, desc:'化神圆满，半步大乘' },
  // 大乘 → 渡劫 → 飞升
  21: { mood:99, items:[{id:'dacheng_dan',qty:1},{id:'huashen_dan',qty:3}], reqSkills:5, desc:'大乘之巅，需大乘丹超脱' },
  22: { mood:100, items:[{id:'dacheng_dan',qty:3},{id:'dujie_dan',qty:1}], reqSkills:5, desc:'渡劫飞升，需渡劫丹抗天雷' },
};
window.BREAKTHROUGH_REQS = BREAKTHROUGH_REQS;

// ── 炼体突破门槛（全局常量，问道面板/物品来源/突破共用）──
const BODY_BREAKTHROUGH_REQS = {
  0: { mood:30, items:[], desc:'肉身初炼，水到渠成' },
  1: { mood:35, items:[], desc:'筋骨渐强，厚积薄发' },
  2: { mood:45, items:[{id:'duanti_dan',qty:1}], desc:'需一枚锻体丹淬炼筋骨' },
  3: { mood:50, items:[{id:'duanti_dan',qty:2}], desc:'需两枚锻体丹强化肉身' },
  4: { mood:55, items:[{id:'duanti_dan',qty:3}], desc:'需三枚锻体丹突破极限' },
  5: { mood:60, items:[{id:'duanti_dan',qty:4}], desc:'炼体后期，需大量锻体丹' },
  6: { mood:65, items:[{id:'duanti_dan',qty:5},{id:'juli_dan',qty:1}], desc:'冲击炼体巅峰' },
  7: { mood:70, items:[{id:'duanti_dan',qty:6},{id:'podi_dan',qty:1}], desc:'肉身极限，需破壁丹辅助' },
  8: { mood:75, items:[{id:'tongpi_dan',qty:1},{id:'duanti_dan',qty:5}], desc:'铜皮境，需铜皮丹炼皮如铁' },
  9:  { mood:78, items:[{id:'tongpi_dan',qty:2},{id:'duanti_dan',qty:5}], desc:'铁骨境，需铁骨丹炼骨如钢' },
  10: { mood:80, items:[{id:'tiegu_dan',qty:2},{id:'tongpi_dan',qty:3}], desc:'银血境，需银血丹换血如汞' },
  11: { mood:83, items:[{id:'yinxiue_dan',qty:2},{id:'tiegu_dan',qty:3}], desc:'金身境，需金身丹塑身如金' },
  12: { mood:85, items:[{id:'jinshen_dan',qty:2},{id:'yinxiue_dan',qty:3}], desc:'玉髓境，需玉髓丹炼骨如玉' },
  13: { mood:88, items:[{id:'yusui_dan',qty:2},{id:'jinshen_dan',qty:3}], desc:'不灭体，需不灭丹重塑肉身' },
  14: { mood:92, items:[{id:'bumie_dan',qty:2},{id:'yusui_dan',qty:3}], desc:'涅槃境，需涅槃丹浴火重生' },
  15: { mood:96, items:[{id:'hundun_dan',qty:1},{id:'niepan_dan',qty:1}], desc:'混沌体，需混沌丹纳万炁归元' },
  16: { mood:97, items:[{id:'daoshen_dan',qty:1},{id:'yuanying_dan',qty:3}], desc:'道身境——肉身烙印大道纹理，需炼气化神修为辅助' },
  17: { mood:98, items:[{id:'shengti_dan',qty:1},{id:'huashen_dan',qty:3}], desc:'圣体境——身蕴圣光万法不侵，需炼气化神修为辅助' },
  18: { mood:99, items:[{id:'shenmo_dan',qty:1},{id:'dacheng_dan',qty:3}], desc:'神魔体——一念神魔肉身化相，需炼气大乘修为辅助' },
  19: { mood:100, items:[{id:'buxiu_dan',qty:1},{id:'dujie_dan',qty:3}], desc:'不朽体——肉身不腐断肢自生，需炼气渡劫修为辅助' },
  20: { mood:100, items:[{id:'kaitian_dan',qty:1},{id:'dujie_dan',qty:5}], desc:'开天体——一拳可裂虚空，需炼气巅峰修为辅助' },
  21: { mood:100, items:[{id:'hundao_dan',qty:1}], desc:'鸿蒙道体——肉身即道，与道同存' },
};
window.BODY_BREAKTHROUGH_REQS = BODY_BREAKTHROUGH_REQS;

function qiBreakthroughCheck() {
  const p = G.player;
  if (p.qiRealmIndex >= QI_REALMS.length - 1) return;
  if (getCultivationProgress('qi') < 100) return;

  const next = QI_REALMS[p.qiRealmIndex + 1];
  
  // ── 炼气突破门槛（全境界打通）──
  const requirements = BREAKTHROUGH_REQS;
  const req = requirements[p.qiRealmIndex];
  if (!req) { addNarrative('练气已达当前瓶颈，需寻更高传承。', 'system'); return; }
  
  if (p.mood < req.mood) {
    addNarrative(`心境不稳（${p.mood}/${req.mood}），贸然突破易生心魔。`, 'system');
    return;
  }
  
  const activeSkillCount = p.skills.filter(s => s.active).length;
  if (activeSkillCount < req.reqSkills) {
    addNarrative(`功力尚浅，需至少掌握${req.reqSkills}门功法才能冲击下个境界。`, 'system');
    return;
  }
  
  const missing = [];
  req.items.forEach(r => {
    const owned = p.inventory.reduce((sum, it) => it.id === r.id ? sum + (it.qty || 1) : sum, 0);
    if (owned < r.qty) missing.push(pillName(r.id) + '×' + (r.qty - owned));
  });
  if (missing.length > 0) {
    // ── 尝试自动补货（黑市）──
    if (typeof window.autoBuyFromBlackMarket === 'function') {
      try { window.autoBuyFromBlackMarket(); } catch(e) {}
    }
    // ── 跳过消息冷却（防刷屏）──
    const now = Date.now();
    const cooldown = p._lastBreakthroughMsgTime && (now - p._lastBreakthroughMsgTime < 20000);
    if (!cooldown) {
      p._lastBreakthroughMsgTime = now;
      // 再检查一次（买过之后也许够了）
      const stillMissing = [];
      req.items.forEach(r => {
        const owned = p.inventory.reduce((sum, it) => it.id === r.id ? sum + (it.qty || 1) : sum, 0);
        if (owned < r.qty) stillMissing.push(pillName(r.id) + '×' + (r.qty - owned));
      });
      if (stillMissing.length === 0) {
        // 补上了！重新检查
        return qiBreakthroughCheck();
      }
      const nextName = next ? next.name : '更高境界';
      if (stillMissing.length <= 2) {
        addNarrative(`突破所需丹药不足：${stillMissing.join('、')}。`, 'system');
        // 寻宝故事
        stillMissing.forEach(function(m) {
          // 从 "破壁丹×3" 中提取物品ID
          var parts = m.match(/^(.+?)×(\d+)$/);
          if (parts) {
            var pillName = parts[1];
            var qty = parseInt(parts[2]);
            // 反向查ID
            if (typeof ITEM_DB !== 'undefined') {
              var itemRef = ITEM_DB.find(function(i){ return i.name === pillName; });
              if (itemRef && typeof getTreasureHuntStory === 'function') {
                var story = getTreasureHuntStory(itemRef.id, qty);
                var storyLines = story.split('\n');
                for (var sli = 0; sli < storyLines.length; sli++) {
                  if (storyLines[sli].trim()) addNarrative(storyLines[sli], 'system');
                }
              }
            }
          }
        });
      } else {
        addNarrative(`━━━ ⚠️ ${nextName} · 突破在即 ═══`, 'event');
        stillMissing.forEach(m => addNarrative(`  ❌ ${m}`, 'system'));
      }
    }
    return;
  }
  
  req.items.forEach(r => {
    for (let i = 0; i < r.qty; i++) removeItemFromInventory(r.id, 1);
  });
  
  // 记录本次已扣材料（若心魔劫触发中断突破，需返还，否则重试时材料不足卡死）
  const consumedMaterials = req.items.map(r => ({ id: r.id, qty: r.qty }));
  
  // 境界越高突破越难，但高属性可弥补
  const realmPenalty = p.qiRealmIndex * 0.015; // 每高一阶减1.5%
  let chance = 0.4 + (p.mood - 50) / 200 + (p.wisdom - 50) / 120 + (p.bone - 50) / 180;
  // ✨ 天赋因子——天才突破感悟快，庸才处处遇障
  var talentFactor = (p.talent || 1.0) - 1.0; // -0.2~+0.36
  chance += talentFactor * 0.25;
  // ✨ 灵根杂质惩罚——灵根越多突破时越难凝聚
  var rootCount = (p.spiritRoots && p.spiritRoots.length) || 1;
  var rootPenalty = (rootCount - 1) * 0.03; // 双灵根-3%,五灵根-12%
  chance -= rootPenalty;
  // ✨ 气运微调——幸运之人逢凶化吉
  chance += (p.luck - 50) / 300;
  // ☯️ 因果业力——功德加身，天道庇佑；杀孽缠身，寸步难行
  if (typeof getKarmaBreakBonus === 'function') chance += getKarmaBreakBonus();
  // 🎊 节日修正：除夕天道宽容，突破成功率大增
  if (typeof getFestivalMod === 'function') {
    const fm = getFestivalMod();
    if (fm && fm.breakChance) chance += fm.breakChance;
  }
  // 💊 破境丹药加成：背包里的加成型丹药（effects.breakthrough）自动生效，最多3枚
  if (p.inventory) {
    const breakPills = p.inventory.filter(it => it.effects && it.effects.breakthrough);
    if (breakPills.length > 0) {
      let pillBonus = 0;
      const usedPills = [];
      for (let bi = 0; bi < Math.min(breakPills.length, 3); bi++) {
        const bp = breakPills[bi];
        pillBonus += bp.effects.breakthrough;
        usedPills.push(bp);
      }
      pillBonus = Math.min(0.3, pillBonus);
      chance += pillBonus;
      // 消耗丹药
      usedPills.forEach(bp => {
        if (typeof removeItemFromInventory === 'function') removeItemFromInventory(bp.id, 1);
      });
      if (typeof addNarrative === 'function') addNarrative('💊 破境丹药化作暖流涌入丹田——突破成功率提升！', 'event');
    }
  }
  chance = chance - realmPenalty;
  chance = Math.min(0.85, Math.max(0.03, chance));

  // 如果突破失败超过3次，给予怜悯加成
  if (!p.breakFailCount) p.breakFailCount = 0;
  if (p._lastAttemptFailed) p.breakFailCount = (p.breakFailCount || 0) + 1;
  if (p.breakFailCount >= 3) chance += Math.min(0.3, p.breakFailCount * 0.05);
  const realmBonus = (typeof getSecretRealmBreakthroughBonus === "function") ? getSecretRealmBreakthroughBonus() : 0;
  if (realmBonus > 0) chance += realmBonus;
  // 心魔已渡祝福：成功率+50%（一次性）
  if (p._xinmoBless) {
    chance += p._xinmoBless;
    p._xinmoBless = 0;
  }
  
  // 自动模式：直接判定快速结算（跳过仪式，由外部统一结算+蜕变叙事）
  const isAutoMode = typeof G !== 'undefined' && G.autoMode === true;
  const didBreak = isAutoMode ? Math.random() < chance : true; // 手动模式先假定可突破，仪式内再判
  if (!didBreak) p._lastAttemptFailed = true;
  if (didBreak) {
    // ── 大境界突破：先渡心魔劫（金丹/元婴/化神/大乘）──
    if (typeof tryTriggerXinmo === 'function' && tryTriggerXinmo()) {
      // 心魔劫已触发，中断本次突破，待心魔结算后自动重试
      // 🔧 返还已扣突破材料（否则心魔重试时材料不足卡死）
      if (consumedMaterials && consumedMaterials.length) {
        consumedMaterials.forEach(cm => {
          const itemData = (typeof ITEM_DB !== 'undefined' ? ITEM_DB : []).find(i => i.id === cm.id);
          if (itemData && typeof addItemToInventory === 'function') {
            for (let k = 0; k < cm.qty; k++) addItemToInventory(itemData, 1);
          }
        });
        if (typeof addNarrative === 'function') addNarrative('心魔临头，突破材料暂且收回——待渡过此劫再行冲关。', 'system');
      }
      return;
    }
    // 🌟 突破仪式：手动模式弹窗抉择，自动模式跳过（快速结算）
    if (!isAutoMode && typeof startBreakthroughRitual === 'function') {
      const ritual = startBreakthroughRitual('qi');
      if (ritual === false) {
        if (typeof G !== 'undefined' && G._btRitual) {
          G._btRitual.baseChance = chance;
        }
        return;
      }
    }
    const oldIdx = p.qiRealmIndex;
    const oldCp = p.combatPower || 0;
    p.qiRealmIndex++;
    p.qiCultivationPoints = next.cpRequired;
    p.mood = Math.min(100, Math.round(p.mood + 12));
    // 刷新寿元
    if (typeof getMaxAgeForRealm === 'function') {
      p.maxAge = Math.max(p.maxAge || 0, getMaxAgeForRealm(p.qiRealmIndex, p.bodyRealmIndex));
    }
    recalcStats(p);
    // 🔮 突破金丹 → 本命法宝觉醒
    if (p.qiRealmIndex === 12 && typeof unlockBenming === 'function') unlockBenming();
    p.qi = p.maxQi;
    const scene = getSceneData(G.currentScene);
    renderNarrative({ playerName:p.name, location:scene?scene.name:'未知', realm:next.name }, 'breakthrough');
    // 突破大字卡片
    const newCp = p.combatPower || 0;
    const detailLines = [`境界：${next.name}`, `气血：${p.maxHp}`, `灵力：${p.maxQi}`];
    const btHtml = buildBreakthroughCard(`⚡ ${next.name} 突破成功！`, oldCp, newCp, detailLines);
    const btEntry = { text: btHtml, type: 'breakthrough', turn: G.turn++, time: {...G.time} };
    G.narrativeHistory.push(btEntry);
    if (typeof renderNarrativeEntry === 'function') renderNarrativeEntry(btEntry);
    // 蜕变叙事
    if (typeof window.REALM_TRANSFORM !== 'undefined' && window.REALM_TRANSFORM[next.name]) {
      addNarrative(window.REALM_TRANSFORM[next.name], 'breakthrough');
    }
    unlockSkills();
    // 上报突破事件
    if (typeof window.reportState === 'function') {
      try { window.reportState('突破→' + next.name); } catch(e) {}
    }
    // 💾 突破成功即时保存（突破是玩家最怕丢进度的节点）
    if (typeof saveGameNow === 'function') {
      try { saveGameNow(); } catch(e) {}
    }
    // 触发突破任务
    if (typeof checkRealmQuestTriggers === 'function') checkRealmQuestTriggers(oldIdx, p.qiRealmIndex);
    // 📜 待领悟功法自动参悟（境界达标）
    autoLearnPendingScrolls('突破');
    // 🌟 名声：大境界突破 → 天地异象
    if (typeof fameOnBreakthrough === 'function') fameOnBreakthrough(next.name);
  } else {
    p.qiCultivationPoints = Math.max(QI_REALMS[p.qiRealmIndex].cpRequired,
      p.qiCultivationPoints - Math.round((p.qiCultivationPoints - QI_REALMS[p.qiRealmIndex].cpRequired) * 0.05));
    p.qi = Math.round(p.qi * 0.5);
    p.mood = Math.max(0, Math.round(p.mood - 12));
    addNarrative('冲击瓶颈失败！经脉震荡，心神受损。还需稳固根基。', 'system');
    if (typeof generateActionNarrative === "function") generateActionNarrative({playerName:p.name, location:getSceneData(G.currentScene)?.name||'未知', time:G.time.period+'时'}, 'breakthrough_fail');
    if (typeof addDailyLogEntry === "function") addDailyLogEntry('cultivate', '突破失败');
  }
  updateAllUI();
}

/* ═══════════ 炼体·养生经典沉浸锻炼 ═══════════ */
function startBodyCultivate() {
  // 每日一次限制
  if (G._dailyDone && G._dailyDone.day === G.time.day && G._dailyDone.body) {
    addNarrative('💪 今日炼体已满，明日再练。', 'system');
    return;
  }
  if (!G._dailyDone) G._dailyDone = {};
  G._dailyDone.body = true;
  G._dailyDone.day = G.time.day;
  const p = G.player;
  if (!p) return;
  if (p.hp < 30) {
    addNarrative('体魄透支，无法继续炼体。先休息恢复。', 'system'); return;
  }
  
  if (typeof applySceneMechanics === 'function') applySceneMechanics(G.currentScene);
  
  var overlay = document.getElementById('body-cultivate-overlay');
  if (!overlay) return;
  
  var scene = getSceneData(G.currentScene);
  document.getElementById('body-location').textContent = scene ? scene.name : '未知之地';
  document.getElementById('body-bar').style.width = '0%';
  document.getElementById('body-pct').textContent = '0%';
  document.getElementById('body-step').textContent = '舒筋';
  document.getElementById('body-result').style.display = 'none';
  document.getElementById('body-close-btn').style.display = 'none';
  document.getElementById('body-interact').style.display = 'none';
  document.getElementById('body-activity').style.display = 'none';
  
  // 随机选一篇养生经典
  var classics = typeof BODY_CLASSICS !== 'undefined' ? BODY_CLASSICS : [];
  var ch = classics.length > 0 ? classics[Math.floor(Math.random() * classics.length)] : null;
  
  document.getElementById('body-classic').textContent = ch ? ch.text : '（养生之道）';
  document.getElementById('body-translation').textContent = ch ? ch.translation : '';
  document.getElementById('body-classic-title').textContent = ch ? ch.title : '';
  
  overlay.classList.remove('hidden');
  
  // 中断标志（中途退出时置true，终止tick链）
  G._bodyCultivateAborted = false;
  
  // 45秒计时
  var TOTAL_MS = 45000;
  var startTime = Date.now();
  var interactShown = false;
  var nextActivityTime = -1;  // 下次弹提醒的时间阈值
  var tips = typeof BODY_ACTIVITY_TIPS !== 'undefined' ? BODY_ACTIVITY_TIPS : [];
  
  // 立刻展示第一条活动提醒
  _showBodyActivity(tips);
  nextActivityTime = Date.now() + 5000;
  
  function tick() {
    if (G._bodyCultivateAborted) return; // 中途退出，终止动画链
    var elapsed = Date.now() - startTime;
    var pct = Math.min(100, Math.round(elapsed / TOTAL_MS * 100));
    
    document.getElementById('body-bar').style.width = pct + '%';
    document.getElementById('body-pct').textContent = pct + '%';
    
    // 每5-6秒活动提醒（不依赖pct阶段）
    if (Date.now() >= nextActivityTime && pct < 95) {
      _showBodyActivity(tips);
      nextActivityTime = Date.now() + 5000 + Math.floor(Math.random() * 2000); // 5~7秒间隔
    }
    
    if (pct < 16) {
      document.getElementById('body-step').textContent = '📖 研习经典';
    } else if (pct < 27) {
      document.getElementById('body-step').textContent = '🧘 调息·导引';
    } else if (pct < 43) {
      if (!interactShown) {
        interactShown = true;
        _showBodyInteract(ch);
      }
      document.getElementById('body-step').textContent = '💪 体悟要领';
    } else if (pct < 90) {
      document.getElementById('body-step').textContent = '🏋️ 炼体·运化';
    } else {
      document.getElementById('body-step').textContent = '✨ 筋骨大成';
    }
    
    if (elapsed < TOTAL_MS) {
      setTimeout(tick, 200);
    } else {
      _finishBodyCultivate(scene, ch);
    }
  }
  
  tick();
}

/* ── 炼体活动提醒 ── */
function _showBodyActivity(tips) {
  var activityEl = document.getElementById('body-activity');
  var textEl = document.getElementById('body-activity-text');
  if (!activityEl || !textEl || !tips || tips.length === 0) return;
  
  var idx = Math.floor(Math.random() * tips.length);
  textEl.textContent = tips[idx];
  activityEl.style.display = 'block';
}

/* ── 炼体体悟互动 ── */
function _showBodyInteract(classic) {
  if (!classic) return;
  var interactEl = document.getElementById('body-interact');
  var choicesEl = document.getElementById('body-choices');
  if (!interactEl || !choicesEl) return;
  
  var choices = [
    { label:'🦵 锻炼腿部', effect:'leg', result:'腿部经脉通畅，下盘更加稳固！' },
    { label:'💪 锻炼上肢', effect:'arm', result:'双臂劲力充盈，开碑裂石之力！' },
    { label:'🧘 固本培元', effect:'core', result:'丹田暖流涌动，根基愈发扎实！' },
  ];
  
  // 根据经典标题动态影响第三项
  var title = classic.title || '';
  if (title.indexOf('虎戏') >= 0) {
    choices[2] = { label:'🐯 虎威锻骨', effect:'bone', result:'虎啸山谷，骨节爆响，筋骨大进！' };
  } else if (title.indexOf('鹿戏') >= 0) {
    choices[2] = { label:'🦌 鹿灵舒颈', effect:'neck', result:'颈椎温热，督脉轻微震动，精气上涌！' };
  } else if (title.indexOf('熊戏') >= 0) {
    choices[2] = { label:'🐻 熊力健脾', effect:'spleen', result:'脾胃之气涌动，中气充沛！' };
  } else if (title.indexOf('猿戏') >= 0) {
    choices[2] = { label:'🐒 猿跃通络', effect:'meridian', result:'全身经络跳动，气血奔涌如潮！' };
  } else if (title.indexOf('鸟戏') >= 0) {
    choices[2] = { label:'🕊️ 鸟展宣肺', effect:'lung', result:'肺气舒展，呼吸之间力达四肢！' };
  } else if (title.indexOf('易筋') >= 0) {
    choices[2] = { label:'🦴 易筋强骨', effect:'bone', result:'骨节咯咯作响，筋肉如龙蛇扭动！' };
  } else if (title.indexOf('八段锦') >= 0 || title.indexOf('双手托天') >= 0) {
    choices[2] = { label:'🙆 托天理气', effect:'qiRefine', result:'三焦通畅，气血上达巅顶！' };
  } else if (title.indexOf('五劳') >= 0) {
    choices[2] = { label:'🔄 转颈祛劳', effect:'mood', result:'五劳七伤随转颈之势消散！' };
  } else if (title.indexOf('养生铭') >= 0 || title.indexOf('孙思邈') >= 0 || title.indexOf('苏东坡') >= 0) {
    choices[2] = { label:'📿 调神养气', effect:'mood', result:'心神俱宁，气血自归，久坐之困顿一扫而空！' };
  }
  
  choicesEl.innerHTML = '';
  choices.forEach(function(c, i) {
    var btn = document.createElement('button');
    btn.textContent = c.label;
    btn.style.cssText = 'padding:8px 12px;border-radius:6px;font-size:11px;cursor:pointer;background:rgba(76,175,80,0.08);border:1px solid rgba(76,175,80,0.2);color:var(--text);line-height:1.3;';
    btn.onclick = function() {
      _applyBodyInsightEffect(c.effect);
      var msgEl = document.getElementById('body-interact');
      if (msgEl) {
        msgEl.innerHTML = '<div style="font-size:11px;color:#8bc34a;line-height:1.5;padding:4px 0;">✨ ' + c.result + '</div>';
      }
    };
    choicesEl.appendChild(btn);
  });
  
  interactEl.style.display = 'block';
}

/* ── 应用炼体效果 ── */
function _applyBodyInsightEffect(effectType) {
  var p = G.player;
  if (!p) return;
  
  switch(effectType) {
    case 'leg':
      p.bone = Math.min(100, p.bone + Math.floor(2 + getCultivationMultiplier('body') * 0.3));
      break;
    case 'arm':
      if (typeof gainCultivation === 'function') gainCultivation('body', Math.floor(5 + getCultivationMultiplier('body') * 2));
      else p.bodyCultivationPoints += Math.floor(5 + getCultivationMultiplier('body') * 2);
      break;
    case 'core':
      p.hp = Math.min(p.maxHp, p.hp + Math.floor(15 + getCultivationMultiplier('body') * 3));
      break;
    case 'bone':
      p.bone = Math.min(100, p.bone + Math.floor(3 + getCultivationMultiplier('body') * 0.5));
      break;
    case 'neck':
      p.mood = Math.min(100, p.mood + Math.floor(5 + getCultivationMultiplier('body')));
      break;
    case 'spleen':
      p.maxHp = Math.min(9999, p.maxHp + Math.floor(5 + getCultivationMultiplier('body') * 2));
      break;
    case 'meridian':
      if (typeof gainCultivation === 'function') gainCultivation('body', Math.round(8 * getCultivationMultiplier('body')));
      else p.bodyCultivationPoints += Math.round(8 * getCultivationMultiplier('body'));
      break;
    case 'lung':
      p.mood = Math.min(100, p.mood + Math.floor(4 + getCultivationMultiplier('body') * 0.8));
      break;
    case 'qiRefine':
      if (typeof getCultivationMultiplier === 'function') {
        if (typeof gainCultivation === 'function') gainCultivation('body', Math.round(10 * getCultivationMultiplier('body')));
        else p.bodyCultivationPoints += Math.round(10 * getCultivationMultiplier('body'));
      }
      break;
    case 'mood':
      p.mood = Math.min(100, p.mood + Math.floor(6 + getCultivationMultiplier('body')));
      break;
    default:
      if (typeof gainCultivation === 'function') gainCultivation('body', Math.round(8 * getCultivationMultiplier('body')));
      else p.bodyCultivationPoints += Math.round(8 * getCultivationMultiplier('body'));
  }
  
  recalcStats(p);
  updateAllUI();
}

/* ── 完成炼体 ── */
function _finishBodyCultivate(scene, classic) {
  var p = G.player;
  
  if (typeof triggerEnlightenmentFromCultivation === 'function') triggerEnlightenmentFromCultivation();
  
  var cur = getBodyRealm();
  var next = BODY_REALMS[p.bodyRealmIndex + 1];
  if (!next) {
    // 🔄 炼体已圆满（鸿蒙道体）：修为溢出到炼气，仍推进一小时
    if (typeof gainCultivation === 'function') {
      var multFull = typeof getCultivationMultiplier === 'function' ? getCultivationMultiplier('body') : 1;
      gainCultivation('qi', Math.round(100 + multFull * 40));
    }
    p.hp = Math.max(0, p.hp - 20);
    advanceTime(1);
    if (typeof gainSkillMasteryXp === 'function') gainSkillMasteryXp('炼体术', 15);
    if (typeof gainSkillMasteryXp === 'function') gainSkillMasteryXp('护体诀', 5);
    document.getElementById('body-pct').textContent = '圆满';
    bodyBreakthroughCheck();
    recalcStats(p);
    updateAllUI();
    return;
  }
  
  var needed = next.cpRequired - cur.cpRequired;
  var mult = getCultivationMultiplier('body');
  
  // 🔧 2026-08-04 炼体收益大幅提升：基础 4%（原来 0.8% 一次 45 秒只涨 1% 进度，玩家感知不到“加值”）
  //    手动炼体 45 秒沉浸 → 基础 4%，高气血 +1.5%，高根骨 +1% → 最高 8%
  //    约 13~25 次升一重，进度条肉眼可见
  var basePct = 4.0;
  var finalPct = basePct * mult;
  // 高气血加成
  if (p.hp > p.maxHp * 0.7) finalPct += 1.5;
  // 高根骨加成
  if (p.bone > 60) finalPct += 1.0;
  finalPct = Math.min(8, Math.max(1.5, finalPct));
  
  var gain = Math.round(needed * finalPct / 100);
  if (typeof gainCultivation === 'function') gainCultivation('body', gain);
  else p.bodyCultivationPoints += gain;
  p.hp = Math.max(0, p.hp - 20);
  advanceTime(1);
  
  // 技能熟练
  if (typeof gainSkillMasteryXp === 'function') gainSkillMasteryXp('炼体术', 15);
  if (typeof gainSkillMasteryXp === 'function') gainSkillMasteryXp('护体诀', 5);
  
  document.getElementById('body-interact').style.display = 'none';
  document.getElementById('body-activity').style.display = 'none';
  
  var resultEl = document.getElementById('body-result');
  resultEl.style.display = 'block';
  
  var html = '<div style="font-size:12px;color:#66bb6a;font-weight:bold;margin-bottom:4px;">💪 炼体一次</div>';
  html += '<div style="font-size:11px;color:var(--text);">炼体进度 +' + finalPct.toFixed(1) + '% <span style="color:#c9a96e;">(' + gain + '修为)</span></div>';
  html += '<div style="font-size:9px;color:var(--text-dim);margin-top:2px;">当前进度：' + Math.round(getCultivationProgress('body')) + '%</div>';
  if (classic) {
    html += '<div style="font-size:9px;color:#8bc34a;margin-top:4px;">📖 ' + classic.title + '</div>';
  }
  // 久坐提醒
  html += '<div style="font-size:9px;color:var(--text-dim);margin-top:8px;border-top:1px solid rgba(255,255,255,0.04);padding-top:6px;">';
  html += '⏰ <strong>久坐提醒：</strong>站起来活动一下，伸个懒腰，眺望远处～</div>';
  
  addNarrative('你起身活动筋骨，身心舒畅。久坐之后，果然还是活动一下好。', 'narr-default');
  
  resultEl.innerHTML = html;
  document.getElementById('body-close-btn').style.display = 'inline-block';
  document.getElementById('body-bar').style.width = '100%';
  document.getElementById('body-pct').textContent = '100%';
  document.getElementById('body-step').textContent = '✨ 筋骨大成';
  
  bodyBreakthroughCheck();
  recalcStats(p);
  updateAllUI();
}

function closeBodyCultivate() {
  var overlay = document.getElementById('body-cultivate-overlay');
  if (overlay) overlay.classList.add('hidden');
  var interactEl = document.getElementById('body-interact');
  if (interactEl) {
    interactEl.style.display = 'none';
    interactEl.innerHTML = '<div style="font-size:11px;color:var(--accent);margin-bottom:8px;">💪 体悟要领……</div><div id="body-choices" style="display:flex;gap:6px;flex-wrap:wrap;justify-content:center;"></div>';
  }
  updateAllUI();
}

// ✕ 中途退出炼体：不结算收益，还原每日次数（误触不惩罚）
function abortBodyCultivate() {
  if (G) G._bodyCultivateAborted = true; // 终止tick链，防止45秒后偷偷结算
  // 还原每日炼体标记，让玩家可以重新炼体
  if (G._dailyDone && G._dailyDone.body && G._dailyDone.day === G.time.day) {
    delete G._dailyDone.body;
  }
  addNarrative('你收势站定，吐出一口浊气。', 'system');
  closeBodyCultivate();
}

// 保留旧name供UI按钮调用
function bodyCultivate() {
  // 🔧 2026-08-04：不再预置 _dailyDone 标记——否则 startBodyCultivate 再次检查会双重拦截（点击无效）
  //    每日限制统一由 startBodyCultivate / _doQuickBodyCultivate 内部处理
  if (G._autoMode) {
    // 快捷路径自己管每日限制
    if (G._dailyDone && G._dailyDone.day === G.time.day && G._dailyDone.body) return;
    _doQuickBodyCultivate();
    if (!G._dailyDone) G._dailyDone = {};
    G._dailyDone.body = true;
    G._dailyDone.day = G.time.day;
  } else {
    startBodyCultivate();
  }
}

// 🔧 2026-08-04：手动炼体——按钮专用，永远走沉浸动画（不受 autoMode 标志影响）
//    修复：① autoMode 残留时手动点击被分流到快捷路径 → 无动画
//          ② 原 bodyCultivate 预置 _dailyDone 标记后，startBodyCultivate 再次检查 → 双重限制永远拦截（点击无效）
//    正确做法：不预置标记，直接交给 startBodyCultivate 统一检查+设置
function manualBodyCultivate() {
  startBodyCultivate();
}

// 自动模式快捷炼体
function _doQuickBodyCultivate() {
  const p = G.player;
  if (p.hp < 30) return;
  if (typeof applySceneMechanics === 'function') applySceneMechanics(G.currentScene);
  if (typeof triggerEnlightenmentFromCultivation === 'function') triggerEnlightenmentFromCultivation();
  
  // 🔧 炼体收益对齐手动版（2026-08-03）：原来固定 8+境界×4，高境界杯水车薪（铁骨→银血需250天）
  //    手动炼体 _finishBodyCultivate 用百分比（0.8%~6% of needed），自动版却用固定数值——挂机时炼体几乎不动
  //    这里改用与手动版一致的百分比规则：基础0.8%×倍率，气血>70%+0.3%，根骨>60+0.2%，上限6%
  var cur = getBodyRealm();
  var next = BODY_REALMS[p.bodyRealmIndex + 1];
  if (!next) {
    // 🔄 炼体已圆满：修为溢出到炼气
    var multFull2 = typeof getCultivationMultiplier === 'function' ? getCultivationMultiplier('body') : 1;
    if (typeof gainCultivation === 'function') gainCultivation('qi', Math.round(60 + multFull2 * 25));
    p.hp = Math.max(0, p.hp - 20);
    if (typeof advanceTime === 'function') advanceTime(1);
    if (G._dailyDone && G.time && G.time.day !== undefined) G._dailyDone.day = G.time.day;
    bodyBreakthroughCheck();
    recalcStats(p);
    return;
  }
  var needed = next.cpRequired - cur.cpRequired;
  var mult = getCultivationMultiplier('body');
  // 🔧 2026-08-04 快捷炼体收益提升：基础 1.5%（原来 0.8%），气血+0.6%，根骨+0.4%，上限 4%
  //    自动模式快结算（不播 45 秒动画），收益约为手动版一半，约 25~60 次升一重
  var finalPct = 1.5 * mult;
  if (p.hp > p.maxHp * 0.7) finalPct += 0.6;   // 高气血加成
  if (p.bone > 60) finalPct += 0.4;            // 高根骨加成
  finalPct = Math.min(4, Math.max(1.0, finalPct));
  var gain = Math.round(needed * finalPct / 100);
  
  if (typeof gainCultivation === 'function') gainCultivation('body', gain);
  else p.bodyCultivationPoints += gain;
  p.hp = Math.max(0, p.hp - 20);
  // 🔧 对齐手动炼体：每次炼体推进1小时（手动版 _finishBodyCultivate 有 advanceTime(1)）
  if (typeof advanceTime === 'function') advanceTime(1);
  // 同步每日标记日期（炼体推进了时间，标记要落在新日期，否则 doCultivate 判断错乱）
  if (G._dailyDone && G.time && G.time.day !== undefined) G._dailyDone.day = G.time.day;
  
  bodyBreakthroughCheck();
  recalcStats(p);
}

function bodyBreakthroughCheck() {
  const p = G.player;
  if (p.bodyRealmIndex >= BODY_REALMS.length - 1) return;
  if (getCultivationProgress('body') < 100) return;

  const next = BODY_REALMS[p.bodyRealmIndex + 1];
  
  // ── 炼体突破门槛（全境界打通，统一数据源 BODY_BREAKTHROUGH_REQS）──
  const requirements = (typeof BODY_BREAKTHROUGH_REQS !== 'undefined') ? BODY_BREAKTHROUGH_REQS : {
    0: { mood:30, items:[], desc:'肉身初炼，水到渠成' },
    1: { mood:35, items:[], desc:'筋骨渐强，厚积薄发' },
    2: { mood:45, items:[{id:'duanti_dan',qty:1}], desc:'需一枚锻体丹淬炼筋骨' },
    3: { mood:50, items:[{id:'duanti_dan',qty:2}], desc:'需两枚锻体丹强化肉身' },
    4: { mood:55, items:[{id:'duanti_dan',qty:3}], desc:'需三枚锻体丹突破极限' },
    5: { mood:60, items:[{id:'duanti_dan',qty:4}], desc:'炼体后期，需大量锻体丹' },
    6: { mood:65, items:[{id:'duanti_dan',qty:5},{id:'juli_dan',qty:1}], desc:'冲击炼体巅峰' },
    7: { mood:70, items:[{id:'duanti_dan',qty:6},{id:'podi_dan',qty:1}], desc:'肉身极限，需破壁丹辅助' },
    8: { mood:75, items:[{id:'tongpi_dan',qty:1},{id:'duanti_dan',qty:5}], desc:'铜皮境，需铜皮丹炼皮如铁' },
    9:  { mood:78, items:[{id:'tongpi_dan',qty:2},{id:'duanti_dan',qty:5}], desc:'铁骨境，需铁骨丹炼骨如钢' },
    10: { mood:80, items:[{id:'tiegu_dan',qty:2},{id:'tongpi_dan',qty:3}], desc:'银血境，需银血丹换血如汞' },
    11: { mood:83, items:[{id:'yinxiue_dan',qty:2},{id:'tiegu_dan',qty:3}], desc:'金身境，需金身丹塑身如金' },
    12: { mood:85, items:[{id:'jinshen_dan',qty:2},{id:'yinxiue_dan',qty:3}], desc:'玉髓境，需玉髓丹炼骨如玉' },
    13: { mood:88, items:[{id:'yusui_dan',qty:2},{id:'jinshen_dan',qty:3}], desc:'不灭体，需不灭丹重塑肉身' },
    14: { mood:92, items:[{id:'bumie_dan',qty:2},{id:'yusui_dan',qty:3}], desc:'涅槃境，需涅槃丹浴火重生' },
    15: { mood:96, items:[{id:'hundun_dan',qty:1},{id:'niepan_dan',qty:1}], desc:'混沌体，需混沌丹纳万炁归元' },
    16: { mood:97, items:[{id:'daoshen_dan',qty:1},{id:'yuanying_dan',qty:3}], desc:'道身境——肉身烙印大道纹理，需炼气化神修为辅助' },
    17: { mood:98, items:[{id:'shengti_dan',qty:1},{id:'huashen_dan',qty:3}], desc:'圣体境——身蕴圣光万法不侵，需炼气化神修为辅助' },
    18: { mood:99, items:[{id:'shenmo_dan',qty:1},{id:'dacheng_dan',qty:3}], desc:'神魔体——一念神魔肉身化相，需炼气大乘修为辅助' },
    19: { mood:100, items:[{id:'buxiu_dan',qty:1},{id:'dujie_dan',qty:3}], desc:'不朽体——肉身不腐断肢自生，需炼气渡劫修为辅助' },
    20: { mood:100, items:[{id:'kaitian_dan',qty:1},{id:'dujie_dan',qty:5}], desc:'开天体——一拳可裂虚空，需炼气巅峰修为辅助' },
    21: { mood:100, items:[{id:'hundao_dan',qty:1}], desc:'鸿蒙道体——肉身即道，与道同存' },
  };
  const req = requirements[p.bodyRealmIndex];
  if (!req) { addNarrative('你已臻炼体极致，肉身成圣，再无前路。', 'system'); return; }
  
  // 🔧 2026-08-04：双飞升合一——练气飞升+炼体开天圆满 → 直接感悟鸿蒙道体
  //    不再需要鸿蒙丹（鸿蒙丹原需求太苛刻），以「肉身开天 + 炼气飞升」双道合一大道自成
  if (p.bodyRealmIndex === 21 && (p.qiRealmIndex || 0) >= 22) {
    if (typeof addNarrative === 'function') {
      addNarrative('🌌 肉身开天，炼气飞升——两大道途在体内交汇！', 'narr-epic');
      addNarrative('你于虚空中盘膝而坐，肉身与元婴同时共鸣。开天之力撕裂虚空，飞升之光普照天地——「鸿蒙道体」应运而生！', 'narr-epic');
    }
    p.bodyRealmIndex = 22;
    p.bodyCultivationPoints = BODY_REALMS[22].cpRequired;
    p.mood = 100;
    if (typeof refreshPlayerStats === 'function') refreshPlayerStats();
    if (typeof updateAllUI === 'function') updateAllUI();
    return;
  }
  
  // 混沌之后 · 检查炼气修为门槛
  if (p.bodyRealmIndex >= 16) {
    if (next && next.qiRealmGate) {
      if (p.qiRealmIndex + 1 < next.qiRealmGate) {
        const requiredQi = QI_REALMS[next.qiRealmGate - 1] ? QI_REALMS[next.qiRealmGate - 1].name : ('炼气' + next.qiRealmGate);
        addNarrative(`体法双修，缺一不可。你的炼气修为需达「${requiredQi}」才能承受${next.name}的力量。`, 'system');
        return;
      }
    }
  }
  
  if (p.mood < req.mood) {
    addNarrative(`心志不坚（心境${p.mood}/${req.mood}），难以承受炼体之苦。`, 'system');
    return;
  }
  
  const missing = [];
  req.items.forEach(r => {
    const owned = p.inventory.reduce((sum, it) => it.id === r.id ? sum + (it.qty || 1) : sum, 0);
    if (owned < r.qty) missing.push(pillName(r.id) + '×' + (r.qty - owned));
  });
  if (missing.length > 0) {
    // 自动补货
    if (typeof window.autoBuyFromBlackMarket === 'function') {
      try { window.autoBuyFromBlackMarket(); } catch(e) {}
    }
    const now = Date.now();
    const cooldown = p._lastBodyBreakMsg && (now - p._lastBodyBreakMsg < 20000);
    if (!cooldown) {
      p._lastBodyBreakMsg = now;
      // 再检查
      const stillMissing = [];
      req.items.forEach(r => {
        const owned = p.inventory.reduce((sum, it) => it.id === r.id ? sum + (it.qty || 1) : sum, 0);
        if (owned < r.qty) stillMissing.push(pillName(r.id) + '×' + (r.qty - owned));
      });
      if (stillMissing.length === 0) return bodyBreakthroughCheck();
      addNarrative(`炼体突破所需材料不足：${stillMissing.join('、')}。`, 'system');
      // 寻宝故事
      stillMissing.forEach(function(m) {
        var parts = m.match(/^(.+?)×(\d+)$/);
        if (parts) {
          var pillName = parts[1];
          var qty = parseInt(parts[2]);
          if (typeof ITEM_DB !== 'undefined') {
            var itemRef = ITEM_DB.find(function(i){ return i.name === pillName; });
            if (itemRef && typeof getTreasureHuntStory === 'function') {
              var story = getTreasureHuntStory(itemRef.id, qty);
              var storyLines = story.split('\n');
              for (var sli = 0; sli < storyLines.length; sli++) {
                if (storyLines[sli].trim()) addNarrative(storyLines[sli], 'system');
              }
            }
          }
        }
      });
    }
    return;
  }
  
  req.items.forEach(r => {
    for (let i = 0; i < r.qty; i++) removeItemFromInventory(r.id, 1);
  });
  
  // 天赋因子——天资聪颖者炼体感悟也快
  var talentFactor = (p.talent || 1.0) - 1.0;
  // 气运微调
  var luckFactor = (p.luck - 50) / 300;
  let chance = 0.3 + (p.bone - 50) / 150 + (p.mood - 50) / 200 + talentFactor * 0.2 + luckFactor;
  chance = Math.min(0.75, Math.max(0.03, chance));
  const realmBonus = (typeof getSecretRealmBreakthroughBonus === "function") ? getSecretRealmBreakthroughBonus() : 0;
  if (realmBonus > 0) chance += realmBonus;
  
  if (Math.random() < chance) {
    const oldCp = p.combatPower || 0;
    p.bodyRealmIndex++;
    p.bodyCultivationPoints = next.cpRequired;
    p.mood = Math.min(100, Math.round(p.mood + 8));
    // 刷新寿元
    if (typeof getMaxAgeForRealm === 'function') {
      p.maxAge = Math.max(p.maxAge || 0, getMaxAgeForRealm(p.qiRealmIndex, p.bodyRealmIndex));
    }
    recalcStats(p);
    p.hp = p.maxHp;
    const newCp = p.combatPower || 0;
    const detailLines = [`境界：${next.name}`, `气血：${p.maxHp}`];
    const btHtml = buildBreakthroughCard(`💪 ${next.name} 突破成功！`, oldCp, newCp, detailLines);
    const btEntry = { text: btHtml, type: 'breakthrough', turn: G.turn++, time: {...G.time} };
    G.narrativeHistory.push(btEntry);
    if (typeof renderNarrativeEntry === 'function') renderNarrativeEntry(btEntry);
    // 💪 身体蜕变叙事
    if (typeof window.BODY_TRANSFORM !== 'undefined' && window.BODY_TRANSFORM[next.name]) {
      addNarrative(window.BODY_TRANSFORM[next.name], 'breakthrough');
    }
    unlockSkills();
    // 💾 炼体突破成功即时保存
    if (typeof saveGameNow === 'function') {
      try { saveGameNow(); } catch(e) {}
    }
  } else {
    p.bodyCultivationPoints = Math.max(BODY_REALMS[p.bodyRealmIndex].cpRequired,
      p.bodyCultivationPoints - Math.round((p.bodyCultivationPoints - BODY_REALMS[p.bodyRealmIndex].cpRequired) * 0.05));
    p.hp = Math.round(p.hp * 0.35);
    p.mood = Math.max(0, Math.round(p.mood - 12));
    addNarrative('炼体遇阻！筋骨欲裂，气血翻涌。需要更多磨练。', 'system');
  }
  updateAllUI();
}

// ==========================
// 技能解锁
// ==========================
function unlockSkills() {
  // 功法不再自动领悟。
  // 需通过：坊市购买卷轴、探索发现、奇遇奖励、顿悟、自创 获得
  // 卷轴物品使用后调用 learnSkillFromScroll(skillId) 习得
}

// ==========================
// 休憩 / 探索 / 行动
// ==========================
function rest() {
  const p = G.player;
  const scene = getSceneData(G.currentScene);
  
  // 环境机制
  if (typeof applySceneMechanics === 'function') applySceneMechanics(G.currentScene);
  
  // 场景灵气等级影响恢复速度
  const qiLevel = (scene && scene.qiLevel) ? scene.qiLevel : 3;
  const qiMult = 0.5 + qiLevel * 0.2;
  
  // 气运影响回复
  const luckMult = (p.fortune && p.fortune.luckMult) ? p.fortune.luckMult : 1.0;
  const luckBonus = (luckMult - 1) * 0.3 + 1;
  
  // 探点·休息加成（客栈等地点的 restMult）
  var restMult = 1.0;
  if (typeof getScenePOI === 'function') {
    var pois = getScenePOI(G.currentScene);
    if (pois) {
      for (var i = 0; i < pois.length; i++) {
        if (pois[i].type === 'inn' || pois[i].type === 'rest') {
          if (pois[i].interaction.restMult > 1) {
            restMult = Math.max(restMult, pois[i].interaction.restMult);
          }
        }
      }
    }
  }
  
  let qiRegen = Math.round(8 * qiMult * luckBonus * restMult);
  let hpRegen = Math.round(10 * qiMult * luckBonus * restMult);
  
  // 疗伤法加成
  const skillDb2 = (G && G.skillData) ? G.skillData : (typeof SKILL_DB !== 'undefined' ? SKILL_DB : []);
  p.skills.forEach(sk => {
    const sd = skillDb2.find(d => d.id === sk.id);
    if (!sd || !sk.active || !sd.effects) return;
    if (sd.effects.hpRegen) p.hp = Math.min(p.maxHp, p.hp + sd.effects.hpRegen);
    if (sd.effects.qiRegen) p.qi = Math.min(p.maxQi, p.qi + sd.effects.qiRegen);
  });
  
  p.qi = Math.min(p.maxQi, p.qi + qiRegen);
  p.hp = Math.min(p.maxHp, p.hp + hpRegen);
  
  if (restMult > 1.0) {
    addNarrative('🍵 在这里休息格外舒适，恢复效果提升了' + Math.round((restMult - 1) * 100) + '%！', 'system');
  }
  
  advanceTime(2);
  if (typeof addDailyLogEntry === "function") addDailyLogEntry('rest', '调息休整');
  if (typeof generateActionNarrative === "function") generateActionNarrative({playerName:p.name, location:getSceneData(G.currentScene)?.name||'未知', time:G.time.period+'时'}, 'rest');
  renderNarrative({ playerName:p.name, location:getSceneData(G.currentScene)?.name||'未知', time:G.time.period+'时' }, 'rest');
  updateAllUI();
}

function explore() {
  const p = G.player;
  if (p.qi < 10) { addNarrative('灵力不足，无法长途探索。', 'system'); return; }
  
  let cost = 10;
  // 身法减耗
  p.skills.forEach(sk => {
    const sd = G.skillData.find(d => d.id === sk.id);
    if (!sd || !sk.active || !sd.effects) return;
    if (sd.effects.qiCost) cost = Math.max(3, cost - sd.effects.qiCost);
  });
  
  p.qi = Math.max(0, p.qi - cost);
  advanceTime(1);
  
  // 🌄 沉浸式环境描写：身处何地 + 季节氛围
  try {
    const sc = getSceneData(G.currentScene);
    const sceneName = sc ? sc.name : '这片天地';
    const timeDesc = G.time && G.time.period ? G.time.period : '';
    let envDesc = '';
    if (sc && sc.description) envDesc = sc.description;
    // 季节氛围叠加
    if (typeof getSeasonFlavor === 'function') {
      try { envDesc += ' ' + getSeasonFlavor(); } catch(e) {}
    }
    if (envDesc) {
      addNarrative(`🌄 ${timeDesc}，你在${sceneName}中四处探寻。${envDesc}`, 'narr-scene');
    }
  } catch(e) {}
  
  // 探索效率
  let exploreBonus = 0;
  let luckMult = 1.0;
  p.skills.forEach(sk => {
    const sd = G.skillData.find(d => d.id === sk.id);
    if (!sd || !sk.active || !sd.effects) return;
    if (sd.effects.exploreBonus) exploreBonus += sd.effects.exploreBonus;
  });
  
  // 文化名人偶遇（探索时有概率遇到历代先贤）
  if (typeof checkSageEncounter === 'function') checkSageEncounter(G.currentScene);
  
  if (typeof triggerEnlightenmentFromExplore === 'function') triggerEnlightenmentFromExplore();

  // 场景战利品表采集(按概率获取多种物品)
  const lootTable = typeof SCENE_LOOT_TABLES !== 'undefined' ? SCENE_LOOT_TABLES[G.currentScene] : null;
  let foundItems = [];
  if (lootTable) {
    lootTable.forEach(entry => {
      var herbBonus = typeof getHerbFindBonus === 'function' ? getHerbFindBonus() : 0;
      // 🍂 季节修正：春天灵草疯长，节日加成
      var seasonExtra = 0;
      if (typeof getSeasonMod === 'function') {
        const sm = getSeasonMod();
        seasonExtra += (sm.herbChance || 0) * (entry.itemId.includes('_cao') || entry.itemId.includes('ling') || entry.itemId.includes('xuelian') ? 1 : 0.3);
      }
      if (typeof getFestivalMod === 'function') {
        const fm = getFestivalMod();
        if (fm && fm.herbBonus) seasonExtra += fm.herbBonus;
      }
      if (Math.random() < entry.chance + (exploreBonus || 0) + (luckMult - 1) * 0.15 + herbBonus * 0.1 + seasonExtra) {
        const qty = entry.min + Math.floor(Math.random() * (entry.max - entry.min + 1));
        const itemData = ITEM_DB.find(i => i.id === entry.itemId);
        if (itemData && typeof addItemToInventory === 'function') {
          for (let i = 0; i < qty; i++) addItemToInventory(itemData, 1);
          foundItems.push(itemData.name + (qty > 1 ? '×' + qty : ''));
        }
      }
    });
    // 额外:探索时必出灵草或灵石（让探索永远有收获）
    if (foundItems.length === 0 && Math.random() < 0.5) {
      const herbs = ITEM_DB.filter(i => i.type === '灵草' && i.value <= 20);
      if (herbs.length > 0) {
        const fallbackHerb = herbs[Math.floor(Math.random() * herbs.length)];
        if (typeof addItemToInventory === 'function') addItemToInventory(fallbackHerb, 1);
        foundItems.push(fallbackHerb.name);
      }
    }
  } else {
    // 兜底：无战利品表的场景也有三成概率出基础物品
    if (Math.random() < 0.3 + exploreBonus) {
      const fallback = ITEM_DB.find(i => i.id === 'hgc_grass');
      if (fallback) { addItemToInventory(fallback, 1); foundItems.push(fallback.name); }
    }
  }
  
  // 显示发现物
  if (foundItems.length > 0) {
    const display = foundItems.slice(0, 3).join('、');
    const suffix = foundItems.length > 3 ? `等${foundItems.length}样` : '';
    addNarrative(`🔍 探索中发现：${display}${suffix}`, 'narr-event');
  }
  
  // 🐾 灵兽寻宝（雪狐类能力：额外获得稀有材料）
  if (typeof beastLootBonus === 'function') {
    const bb = beastLootBonus();
    if (bb) {
      const rareItems = ITEM_DB.filter(i => i.rarity && i.rarity >= 2);
      if (rareItems.length > 0) {
        const chosen = rareItems[Math.floor(Math.random() * rareItems.length)];
        if (typeof addItemToInventory === 'function') {
          addItemToInventory(chosen, 1);
          addNarrative(`${bb.icon} ${bb.name} 突然竖起耳朵，钻进草丛叼回一件东西——${chosen.name}！`, 'narr-event');
        }
      }
    }
  }
  
  // 气运影响探索灵石收获
  luckMult = (p.fortune && p.fortune.luckMult) ? p.fortune.luckMult : 1.0;
  if (Math.random() < 0.40 + (exploreBonus || 0) + (luckMult - 1) * 0.3) {
    const baseStones = Math.floor(3 + Math.random() * 12 + (exploreBonus || 0) * 20);
    const bonusStones = Math.floor(baseStones * (luckMult - 1) * 0.5);
    const scStones = baseStones + bonusStones;
    p.stones += scStones;
    addNarrative(`🪙 探索时意外发现了${scStones}块散落的灵石。`, 'narr-loot');
  }
  
  // 福缘较高的玩家偶尔发现额外灵泉/小秘境/宝箱
  if (luckMult > 1.0 && Math.random() < 0.08 * luckMult) {
    const bonusStone = Math.floor(10 + Math.random() * 40 * luckMult);
    p.stones += bonusStone;
    const treasureFlavors = [
      `✨ 你发现了一处隐蔽的灵泉眼，附近散落着${bonusStone}块品质上乘的灵石！`,
      `🌟 藤蔓掩映下有个旧盒子，打开一看，${bonusStone}块灵石闪闪发光！`,
      `🎋 一棵古树根部有个洞，里面竟然藏着${bonusStone}块灵石！`,
    ];
    addNarrative(treasureFlavors[Math.floor(Math.random() * treasureFlavors.length)], 'narr-epic');
    // 灵草惊喜偶尔有额外掉落
    const herbPool = ITEM_DB.filter(i => i.type === '灵草' && i.value > 10);
    if (Math.random() < 0.3 && herbPool.length > 0) {
      const it = herbPool[Math.floor(Math.random() * herbPool.length)];
      if (typeof addItemToInventory === 'function') addItemToInventory(it, 1);
      addNarrative(`🌿 惊喜还不止于此——你还在旁边发现了${it.name}！`, 'narr-loot');
    }
    
    // 🍀 高气运玩家有较小概率发现属性灵草
    if (p.luck >= 70 && Math.random() < 0.05 + (p.luck - 70) / 300) {
      const attrHerbs = ITEM_DB.filter(i => i.herbEffect && i.rarity <= 3);
      if (attrHerbs.length > 0) {
        const choice = attrHerbs[Math.floor(Math.random() * attrHerbs.length)];
        if (typeof addItemToInventory === 'function') addItemToInventory(choice, 1);
        addNarrative(`🌱 你敏锐地察觉到一缕异香——一株${choice.name}藏在乱石之下，被你的气运牵引而出！`, 'narr-epic');
      }
    }
  }
  
  // POI探点发现（探索时随机遇到场景中的探点）
  if (typeof getScenePOI === 'function') {
    const poiList = getScenePOI(G.currentScene);
    if (poiList.length > 0 && Math.random() < 0.3) {
      const poi = poiList[Math.floor(Math.random() * poiList.length)];
      const typeIcons = { landscape:'🏔️', ruin:'🏛️', danger:'⚠️', market:'🏪', inn:'🏨', mine:'⛏️', cultivation:'🧘', mystery:'🔮' };
      const emoji = typeIcons[poi.type] || '📍';
      addNarrative(emoji + ' 你发现了「' + poi.name + '」——' + poi.desc, 'narr-event');
    }
  }
  
  if (typeof addDailyLogEntry === "function") addDailyLogEntry('explore', '探索' + (getSceneData(G.currentScene)?.name||'未知'));
  if (typeof generateActionNarrative === "function") generateActionNarrative({playerName:p.name, location:getSceneData(G.currentScene)?.name||'未知', time:G.time.period+'时'}, 'explore');
  renderNarrative({ playerName:p.name, location:getSceneData(G.currentScene)?.name||'未知', time:G.time.period+'时' }, 'explore');
  
  // 野外随机遭遇（自动模式不弹框）
  if (typeof autoModeActive !== 'undefined' && autoModeActive) {
    if (typeof triggerAutoEncounter === 'function') {
      triggerAutoEncounter(G.currentScene);
    }
  } else if (typeof triggerRandomEncounter === 'function') {
    triggerRandomEncounter(G.currentScene);
  }
  
  checkRandomEvent(getSceneData(G.currentScene));
  
  // 环境机制
  // 冰封仙子·解封材料（北极场景探索时）
  if (typeof checkIceFairySceneFind === 'function') checkIceFairySceneFind(G.currentScene);
  
  if (typeof applySceneMechanics === 'function') applySceneMechanics(G.currentScene);
  
  updateAllUI();
}

// ==========================
// 背包管理 + 智能整理
// ==========================

// 自动出售标记的物品
function autoSellInventory() {
  const p = G.player;
  if (!p.autoSellEnabled) return;
  
  // 收集所有任务物品ID——任务物品一律不出售
  var questItemIds = [];
  // 1) 物品数据库标记
  if (typeof ITEM_DB !== 'undefined') {
    ITEM_DB.forEach(function(it){
      if (it.questItem && !questItemIds.includes(it.id)) questItemIds.push(it.id);
    });
  }
  // 2) 活跃任务需求
  if (typeof getActiveQuests === 'function' && typeof getQuestDB === 'function') {
    try {
      var aqs = getActiveQuests();
      var db = getQuestDB();
      aqs.forEach(function(aq){
        var q = db.find(function(d){ return d.id === aq.id; });
        if (q && q.requirements && q.requirements.items) {
          q.requirements.items.forEach(function(r){ if (!questItemIds.includes(r.id)) questItemIds.push(r.id); });
        }
      });
    } catch(e) {}
  }
  // 3) 可接任务
  if (typeof getAvailableQuests === 'function') {
    try {
      var aqs2 = getAvailableQuests();
      var db2 = getQuestDB();
      aqs2.forEach(function(aq){
        var q = db2.find(function(d){ return d.id === aq.id; });
        if (q && q.requirements && q.requirements.items) {
          q.requirements.items.forEach(function(r){ if (!questItemIds.includes(r.id)) questItemIds.push(r.id); });
        }
      });
    } catch(e) {}
  }
  
  let sold = 0;
  let earned = 0;
  
  // 🔧 2026-08-04：化神后（qiRealmIndex>=18）自动卖「圣阶以下装备」（所有部位）
  //    装备 = 背包中带 _equipSlot 的掉落装备（weapon/armor/head/accessory/shoes），
  //    排除当前穿戴中的装备；无 quality 字段的老装备视为圣阶以下（凡品待遇）
  var hsSellWeapons = (p.qiRealmIndex || 0) >= 18;
  var equippedIds = {};
  if (p.equipment) {
    ['weapon','armor','head','shoes'].forEach(function(slot){
      var eq = p.equipment[slot];
      if (eq && eq.id) equippedIds[eq.id] = true;
    });
    if (Array.isArray(p.equipment.accessory)) {
      p.equipment.accessory.forEach(function(acc){ if (acc && acc.id) equippedIds[acc.id] = true; });
    } else if (p.equipment.accessory && p.equipment.accessory.id) {
      equippedIds[p.equipment.accessory.id] = true;
    }
  }
  
  p.inventory = p.inventory.filter(it => {
    // 任务物品不自动出售
    if (questItemIds.indexOf(it.id) !== -1) { return true; }
    if (it.junk && questItemIds.indexOf(it.id) === -1) {
      const sellCount = it.qty;
      const itemPrice = it.value || 3;
      earned += sellCount * Math.floor(itemPrice * 5);
      sold += sellCount;
      return false;
    }
  // 🔧 化神后：圣阶以下装备自动卖（所有部位，排除穿戴中的）
    if (hsSellWeapons && it.category === '装备' && it._equipSlot && it._equipSlot !== '未知' && !equippedIds[it.id]) {
      // 圣品及以上保留；凡品/灵品/地品/天品/无品质 → 卖
      if (it.quality !== '圣品' && it.quality !== '神品' && it.quality !== '仙品') {
        const sellCount = it.qty || 1;
        const itemPrice = it.value || 3;
        earned += sellCount * Math.floor(itemPrice * 5);
        sold += sellCount;
        return false;
      }
    }
    // 🔧 化神后：固定装备（无 _equipSlot/无 quality，如锈铁剑/清风剑/铁甲）——
    //    纯战斗装（equipEffect 无功能词条）视为垃圾自动卖；
    //    功能装备（聚灵符/延寿符/玉佩/戒指等带 cultivationSpeed/qiRegen/maxQiBonus 等）保留
    if (hsSellWeapons && it.category === '装备' && !it._equipSlot && !it.quality && !equippedIds[it.id]) {
      var ee = it.equipEffect || {};
      var funcKeys = ['cultivationSpeed','maxAge','qiRegen','wisdomBonus','luckBonus','mood','maxQiBonus','hpRegen','healingBonus','cultivationPoints','expBonus','maxHpBonus','maxQiBonus'];
      var hasFunc = funcKeys.some(function(k){ return ee[k]; });
      var isCombat = ee.attackBonus || ee.defenseBonus || ee.elementDamage || ee.critRate || ee.dodge || ee.qiDrain || ee.hpBonus || ee.elementResist;
      if (!hasFunc && isCombat) {
        const sellCount = it.qty || 1;
        const itemPrice = it.value || 3;
        earned += sellCount * Math.floor(itemPrice * 5);
        sold += sellCount;
        return false;
      }
    }
    return true;
  });
  
  if (sold > 0) {
    p.stones += earned;
    addNarrative(`自动出售了${sold}件（${hsSellWeapons ? '含圣阶以下武器' : '杂物'}），获得${earned}灵石。`, 'system');
  }
  
  // 检查储物箱
  if (p.storageBox && p.storageBox.length > 0) {
    var expired = p.storageBox.filter(function(s){ return s._expireDay && s._expireDay <= G.time.day; });
    if (expired.length > 0) {
      p.storageBox = p.storageBox.filter(function(s){ return !s._expireDay || s._expireDay > G.time.day; });
    }
  }
}

// 手动整理背包
function cleanInventory() {
  autoSellInventory();
  const p = G.player;
  p.inventory = p.inventory.filter(it => it.qty > 0);
  recalcStats(p);
  updateAllUI();
}

function mergeInventoryItems(p) {
  if (!p || !p.inventory) return;
  const merged = [];
  const seen = {};
  p.inventory.forEach(it => {
    // 🔧 装备不合并（每件独立；按_uid或id+品质区分）
    if (it.category === '装备' || it.equipEffect) {
      const copy = Object.assign({}, it);
      copy.qty = it.qty || 1;
      merged.push(copy);
      return;
    }
    if (seen[it.id]) {
      seen[it.id].qty += it.qty || 1;
    } else {
      const copy = Object.assign({}, it);
      copy.qty = it.qty || 1;
      merged.push(copy);
      seen[it.id] = copy;
    }
  });
  p.inventory = merged.filter(it => it.qty > 0);
}

function addItemToInventory(itemData, qty) {
  const p = G.player;
  
  // 🔧 装备永不合并——每件独立存放，防止同名装备合并吞品质
  // 掉落装备若无唯一id，自动补一个（双保险）
  if (itemData && itemData.category === '装备' && !itemData._uid) {
    itemData._uid = itemData.id + '_d' + Date.now() + Math.floor(Math.random() * 1000);
  }
  
  // 携带标记：junk（杂物）、rarity（珍稀度）
  var tag = null;
  if (itemData.junk) tag = 'junk';
  else if (itemData.rarity && itemData.rarity >= 3) tag = 'treasure';
  else if (itemData.breakItem) tag = 'breakthrough';
  else if (itemData.category === '丹药') tag = 'pill';
  else if (itemData.category === '装备') tag = 'equipment';
  else if (itemData.category === '杂物' && (itemData.use)) tag = 'usable';
  
  // 装备类不合并：直接新增条目
  const isEquip = itemData.category === '装备';
  const existing = isEquip ? null : p.inventory.find(i => i.id === itemData.id);
  if (existing) {
    existing.qty += qty;
    if (tag && !existing._tag) existing._tag = tag;
    if (itemData.junk) existing.junk = true;
  } else {
    var entry = {
      id: itemData.id,
      name: itemData.name,
      type: itemData.type,
      category: itemData.category || '杂物',
      qty: qty,
      value: itemData.value,
      use: itemData.use || null,
      equipEffect: itemData.equipEffect || null,
      herbEffect: itemData.herbEffect || null,
      treasureMap: itemData.treasureMap || false,
      junk: itemData.junk || false,
      rarity: itemData.rarity || 0,
      breakItem: itemData.breakItem || false,
      effects: itemData.effects || null,  // 💊 丹药效果（突破加成等）随物品保留
      desc: itemData.desc || '',
      quality: itemData.quality || null,  // 🎨 品质随装备保留（穿戴/卸下不丢品阶）
      sockets: itemData.sockets || 0, socketed: itemData.socketed ? itemData.socketed.slice() : [],  // 💎 孔位/宝石随装备保留
      _equipSlot: itemData._equipSlot || null,  // 🔧 槽位保留：掉落装备uid进背包不丢部位，防“衣服穿武器”
      _tag: tag,
      _uid: itemData._uid || null,
    };
    p.inventory.push(entry);
  }
  // 收集类任务自动触发
  if (typeof checkItemQuestTriggers === 'function') checkItemQuestTriggers(itemData.id);
  // 物品变化后检查任务进度
  if (typeof checkQuestProgress === 'function') setTimeout(checkQuestProgress, 50);

  // 🔧 2026-08-03：获得宝石时提示可镶嵌（若有带孔装备）
  if (itemData.type === '宝石') {
    try {
      var eq = G.player.equipment || {};
      var hasSocket = Object.keys(eq).some(function(k) {
        return eq[k] && eq[k].sockets && eq[k].sockets > (eq[k].socketed ? eq[k].socketed.length : 0);
      });
      if (hasSocket && typeof addNarrative === 'function') {
        addNarrative('💎 你获得了' + (itemData.name || '宝石') + '！打开人物面板→装备栏，可镶入带孔装备（孔位处选择宝石）。', 'loot');
      } else if (typeof addNarrative === 'function') {
        addNarrative('💎 你获得了' + (itemData.name || '宝石') + '（可镶嵌到带孔装备，暂无空孔装备）。', 'loot');
      }
    } catch(e2) {}
  }
  return true;
}

function removeItemFromInventory(itemId, qty) {
  const p = G.player;
  const idx = p.inventory.findIndex(i => i.id === itemId);
  if (idx === -1) return false;
  p.inventory[idx].qty -= qty;
  if (p.inventory[idx].qty <= 0) {
    p.inventory.splice(idx, 1);
  }
  return true;
}

function useItem(itemId) {
  const p = G.player;
  const inv = p.inventory.find(i => i.id === itemId);
  if (!inv) return;
  
  // 任务物品不可使用（比如清灵草别当回灵药吃了）
  if (typeof isQuestItem === 'function' && isQuestItem(itemId)) {
    addNarrative('❌ 任务物品留着交任务用，别贪嘴吃了。', 'system');
    return;
  }
  
  // 🗺️ 藏宝图寻宝
  if (inv.treasureMap) {
    const luckMult = (p.fortune && p.fortune.luckMult) ? p.fortune.luckMult : 1.0;
    const luckBonus = 1 + ((p.luck || 50) - 50) / 200;
    const mult = luckMult * luckBonus;
    
    // 基础奖励
    const stones = Math.floor((30 + Math.random() * 60) * mult);
    p.stones += stones;
    
    // 灵草/丹药随机奖励
    const bonusPool = [
      { id:'huiqi_dan', name:'回气丹', qty:2 + Math.floor(Math.random() * 2) },
      { id:'juli_dan', name:'聚气丹', qty:1 + Math.floor(Math.random() * 2) },
      { id:'xuelian', name:'雪莲子', qty:1 + Math.floor(Math.random() * 2) },
      { id:'baihe_lily', name:'百年灵芝', qty:1 + Math.floor(Math.random() * 1) },
      { id:'podi_dan', name:'破壁丹', qty:1 },
    ];
    // 高气运可能出属性灵草
    if (p.luck >= 60 && Math.random() < (p.luck - 50) / 100) {
      const attrHerbs = ITEM_DB.filter(i => i.herbEffect && i.rarity <= 3);
      if (attrHerbs.length > 0) {
        bonusPool.push({
          id: attrHerbs[Math.floor(Math.random() * attrHerbs.length)].id
        });
      }
    }
    
    const bonus = bonusPool[Math.floor(Math.random() * bonusPool.length)];
    const bonusItemData = ITEM_DB.find(i => i.id === bonus.id);
    const bonusQty = bonus.qty || 1;
    if (bonusItemData) addItemToInventory(bonusItemData, bonusQty);
    
    // 小概率出功法的卷轴（🔧 2026-08-03：排除自创功法——自创功法只能自创获得，藏宝图不掉）
    let skillScrollText = '';
    if (Math.random() < 0.08 * mult) {
      const scrollPool = SKILL_DB.filter(s => (s.quality === '凡级' || s.quality === '灵级') && !(s.id && s.id.startsWith('custom_')));
      if (scrollPool.length > 0) {
        const scrollSkill = scrollPool[Math.floor(Math.random() * scrollPool.length)];
        if (scrollSkill && typeof learnSkillFromScroll === 'function') {
          learnSkillFromScroll(scrollSkill.id);
          skillScrollText = `，还捡到一本📜《${scrollSkill.name}》`;
        }
      }
    }
    
    const flavorTexts = [
      '你按地图指引来到一处溪涧旁，在石壁缝隙中发现了一个油布包裹。',
      '地图上的标记指向一棵千年古榕——树根下埋着个铁皮匣子。',
      '你沿着弯弯曲曲的小路走到一处荒废的土地庙，在香案底下找到了藏物。',
      '地图指向一座坍塌的猎人小屋，朽木堆下压着一个藤编箱子。',
      '循着地图的标记，你在瀑布后的岩洞里寻到了前人留下的遗物。',
      '图上标注的是一处不起眼的土坡，你挖了三尺深就碰到了硬物——一个陶罐。',
    ];
    addNarrative(`🗺️ 你展开藏宝图仔细辨认……${flavorTexts[Math.floor(Math.random() * flavorTexts.length)]}`, 'narr-event');
    addNarrative(`💰 收获灵石×${stones}、${bonusItemData ? bonusItemData.name + '×' + bonusQty : ''}${skillScrollText}！`, 'loot');
    
    removeItemFromInventory(itemId, 1);
    recalcStats(p);
    updateAllUI();
    return;
  }
  
  if (!inv.use && !inv.herbEffect) {
    addNarrative(`${inv.name} 无法直接使用。`, 'system');
    return;
  }
  const use = inv.use || {};
  var hasPermaEffect = inv.herbEffect && (inv.herbEffect.luck || inv.herbEffect.wisdom || inv.herbEffect.bone);
  
  // 检查是否需要（满状态不吃，省药）
  var needsHp = use.hp && p.hp < p.maxHp - 2;
  var needsQi = use.qi && p.qi < p.maxQi - 2;
  // 🔄 2026-08-04：修为丹在炼气圆满后仍可吃——修为会溢出到炼体
  var qiFull = typeof getCultivationProgress === 'function' && getCultivationProgress('qi') >= 99;
  var bodyFull = typeof getCultivationProgress === 'function' && getCultivationProgress('body') >= 99;
  var needsCult = (use.cultivationPoints && !(qiFull && bodyFull)) ||
                  (use.bodyCultivationPoints && !(bodyFull && qiFull));
  var needsPerm = (use.wisdom && p.wisdom < 100) || (use.mood && p.mood < 100);
  
  // 纯回复类（无永久增益）且满状态→提示跳过
  if (!hasPermaEffect && !needsPerm && !needsHp && !needsQi && !needsCult) {
    addNarrative(`你现在用不上「${inv.name}」。`, 'system');
    return;
  }
  
  if (needsHp) p.hp = Math.min(p.maxHp, p.hp + use.hp);
  if (needsQi) p.qi = Math.min(p.maxQi, p.qi + use.qi);
  if (use.cultivationPoints && needsCult) {
    if (typeof gainCultivation === 'function') gainCultivation('qi', use.cultivationPoints);
    else p.qiCultivationPoints += use.cultivationPoints;
  }
  if (use.bodyCultivationPoints && needsCult) {
    if (typeof gainCultivation === 'function') gainCultivation('body', use.bodyCultivationPoints);
    else p.bodyCultivationPoints += use.bodyCultivationPoints;
  }
  // 🧠 永久增益：悟性/心境
  if (use.wisdom) { p.wisdom = Math.min(100, (p.wisdom || 0) + use.wisdom); }
  if (use.mood) { p.mood = Math.min(100, (p.mood || 0) + use.mood); }
  if (use.wisdom || use.mood) {
    const permParts = [];
    if (use.wisdom) permParts.push('悟性+' + use.wisdom);
    if (use.mood) permParts.push('心境+' + use.mood);
    addNarrative(`✨ ${inv.name}的药力渗入识海——${permParts.join('，')}！`, 'event');
  }
  
  // 🍀 永久属性增益（herbEffect）
  if (inv.herbEffect) {
    const he = inv.herbEffect;
    const changes = [];
    if (he.luck) {
      p.luck = Math.min(100, (p.luck || 0) + he.luck);
      changes.push(`气运+${he.luck}`);
    }
    if (he.wisdom) {
      p.wisdom = Math.min(100, (p.wisdom || 0) + he.wisdom);
      changes.push(`悟性+${he.wisdom}`);
    }
    if (he.bone) {
      p.bone = Math.min(100, (p.bone || 0) + he.bone);
      changes.push(`根骨+${he.bone}`);
    }
    if (changes.length > 0) {
      addNarrative(`✨ ${inv.name}的药力渗入四肢百骸——${changes.join('，')}！（当前 气运${p.luck} 悟性${p.wisdom} 根骨${p.bone}）`, 'event');
    }
  } else if (needsHp || needsQi || needsCult) {
    var parts = [];
    if (needsHp) parts.push('HP+' + Math.min(use.hp, p.maxHp - (p.hp - use.hp)));
    if (needsQi) parts.push('灵力+' + Math.min(use.qi, p.maxQi - (p.qi - use.qi)));
    if (needsCult) {
      var cultParts = [];
      if (use.cultivationPoints) cultParts.push('修为+' + use.cultivationPoints);
      if (use.bodyCultivationPoints) cultParts.push('体魄+' + use.bodyCultivationPoints);
      parts.push(cultParts.join('·'));
    }
    addNarrative(`你服用了「${inv.name}」，${parts.join('，')}。`, 'event');
  }
  
  removeItemFromInventory(itemId, 1);
  recalcStats(p);
  updateAllUI();
}

function getEquipSlot(itemData) {
  if (!itemData) return null;
  var slot = itemData._equipSlot;
  if (slot) return slot;
  var id = itemData.id || '';
  // 🔧 uid还原：掉落装备id形如 baisha_qun_d123456，剥掉 _d\d+ 后缀还原原始id再匹配
  if (/^.+_d\d+$/.test(id)) id = id.replace(/_d\d+$/, '');
  var cat = itemData.category || '';
  var type = itemData.type || '';
  // 明确ID反查
  var slotMap = {
    'fumo_zhang':'weapon', 'tianji_gong':'weapon', 'diuzhi_huan':'head',
    'nianyu_huan':'accessory', 'qingdeng':'weapon',
  };
  if (slotMap[id]) { itemData._equipSlot = slotMap[id]; return slotMap[id]; }
  // 根据类型推断装备位
  if (cat === '装备' && type === '法器') {
    // 武器：结尾是剑/刀/杖/弓/枪/棒/斧/兵/拳/刺/锁/戟
    // 🔧 2026-08-04 修复：fu 同时是斧(武器)和符(饰品)的拼音——符类 id 均为 xxx_fu（xuanhu_fu/juli_fu/yanshou_fu），
    //    武器斧类用 [^_]fu$ 排除下划线结尾的符类，避免玄武符/聚灵符被误判为武器
    if (id.match(/jian$|dao$|zhang$|gong$|qiang$|bang$|[^_]fu$|bingqi$|wuqi|quan$|ci$|suo$|ji$/)) { slot = 'weapon'; }
    // 护甲：结尾是甲/铠/袍/衣/裙/衫
    else if (id.match(/jia$|kai$|pao$|yi$|qun$|shan$/)) { slot = 'armor'; }
    // 饰品：结尾是佩/戒/玉/铃/环/符
    else if (id.match(/pei$|jie$|yu$|ling$|huan$|fu$/)) { slot = 'accessory'; }
    // 头饰：结尾是冠/巾/簪/冕
    else if (id.match(/guan$|jin$|zan$|mian$/)) { slot = 'head'; }
    // 鞋履：结尾是鞋/靴/履
    else if (id.match(/xie$|xue$|lv$/)) { slot = 'shoes'; }
    // 其他默认武器
    else { slot = 'weapon'; }
  } else {
    if (cat === '装备' && type === '法器') slot = 'weapon';
    else slot = 'accessory';
  }
  itemData._equipSlot = slot;
  return slot;
}
window.getEquipSlot = getEquipSlot;

// ── 💎 宝石镶嵌 ──
// 🔧 2026-08-03：宝石点击 → 弹可镶嵌装备列表，一键镶嵌
function gemSocketDialog(gemId) {
  const p = G.player;
  const gemDb = (G.itemData && G.itemData.length ? G.itemData : (typeof ITEM_DB !== 'undefined' ? ITEM_DB : []));
  const gem = gemDb.find(function(g) { return g.id === gemId; });
  // 🔧 2026-08-03 修复：旧档宝石缺 qty → 按 1 处理（qty 缺失不等于没有）
  const invGem = p.inventory.find(function(i) { return i.id === gemId && (i.qty === undefined || i.qty === null || i.qty > 0); });
  if (!gem || !invGem) { addNarrative('背包里没有这颗宝石。', 'system'); return; }
  if (invGem.qty === undefined || invGem.qty === null) invGem.qty = 1;
  
  const slotN = { weapon:'🗡️ 武器', armor:'🛡️ 护甲', accessory:'💍 饰品', head:'👑 头饰', shoes:'👢 鞋履' };
  // 找有空孔的已装备（饰品多件：accessory 数组逐件检查）
  const candidates = [];
  Object.keys(p.equipment || {}).forEach(function(k) {
    const eqv = p.equipment[k];
    if (!eqv) return;
    if (k === 'accessory' && Array.isArray(eqv)) {
      eqv.forEach(function(eqi, i2) {
        if (eqi && eqi.sockets && eqi.sockets > (eqi.socketed ? eqi.socketed.length : 0)) {
          candidates.push({ slot: 'accessory', idx: i2, eq: eqi, name: eqi.name });
        }
      });
    } else if (eqv.sockets && eqv.sockets > (eqv.socketed ? eqv.socketed.length : 0)) {
      candidates.push({ slot: k, idx: null, eq: eqv, name: eqv.name });
    }
  });
  // 找背包里带孔装备
  const invCandidates = p.inventory.filter(function(it) {
    return it.equipEffect && it.sockets && it.sockets > (it.socketed ? it.socketed.length : 0);
  });
  
  const ge = gem.gemEffect || gem.effects || {};
  const gemParts = [];
  if (ge.attackBonus) gemParts.push('攻击+' + ge.attackBonus);
  if (ge.defenseBonus) gemParts.push('防御+' + ge.defenseBonus);
  if (ge.hpBonus) gemParts.push('气血+' + ge.hpBonus);
  if (ge.maxQiBonus) gemParts.push('灵力+' + ge.maxQiBonus);
  if (ge.critRate) gemParts.push('暴击+' + Math.round(ge.critRate * 100) + '%');
  if (ge.dodge) gemParts.push('闪避+' + Math.round(ge.dodge * 100) + '%');
  if (ge.cultivationSpeed) gemParts.push('修炼+' + Math.round(ge.cultivationSpeed * 100) + '%');
  
  let html = '<div style="font-size:12px;margin-bottom:6px;">💎 <b>' + (gem.name || gemId) + '</b>' +
    (gemParts.length ? ' <span style="color:#c9a96e;">(' + gemParts.join(' ') + ')</span>' : '') +
    '</div>';
  
  if (candidates.length === 0 && invCandidates.length === 0) {
    html += '<div style="font-size:11px;color:var(--text-dim);padding:8px 0;">身上没有带空孔的装备。<br>装备有 💎孔位 才能镶嵌——去坊市或打BOSS找带孔装备吧。</div>';
  } else {
    html += '<div style="font-size:10px;color:var(--text-dim);margin-bottom:4px;">选择要镶嵌的装备：</div>';
    // 已装备的（直接镶）
    candidates.forEach(function(c) {
      const eq = c.eq;
      const free = eq.sockets - (eq.socketed ? eq.socketed.length : 0);
      // 🔧 饰品多件：accessory 用 slot|idx 定位
      const ref = (c.slot === 'accessory') ? ('accessory|' + c.idx) : c.slot;
      html += '<div style="border:1px solid rgba(255,255,255,0.12);border-radius:6px;padding:6px 8px;margin-bottom:4px;cursor:pointer;background:rgba(100,200,150,0.06);" onclick="socketGem(\'' + ref + '\',\'' + gemId + '\');closeEvent();">' +
        '⚡ ' + slotN[c.slot] + '：' + eq.name + ' <span style="color:#7dce9a;">(' + free + '孔空)</span>' +
        '</div>';
    });
    // 背包里带孔装备（先装备再镶）
    invCandidates.forEach(function(it) {
      const free = it.sockets - (it.socketed ? it.socketed.length : 0);
      html += '<div style="border:1px solid rgba(255,255,255,0.12);border-radius:6px;padding:6px 8px;margin-bottom:4px;cursor:pointer;background:rgba(255,213,79,0.06);" onclick="equipItem(\'' + it.id + '\');socketGem(\'' + (it._equipSlot || 'weapon') + '\',\'' + gemId + '\');closeEvent();">' +
        '🟡 背包装备：' + it.name + ' <span style="color:#ffd54f;">(' + free + '孔空，装备后镶嵌)</span>' +
        '</div>';
    });
  }
  html += '<div style="margin-top:8px;"><button class="event-choice-btn" onclick="closeEvent()">关闭</button></div>';
  showCustomModal('💎 镶嵌宝石', html);
}

function socketGem(slot, gemId) {
  const p = G.player;
  // 🔧 饰品多件：slot 可能是 'accessory|2' 格式
  var slotName = slot, slotIdx = null;
  if (typeof slot === 'string' && slot.indexOf('|') !== -1) {
    var sp = slot.split('|');
    slotName = sp[0]; slotIdx = parseInt(sp[1], 10);
  }
  var eq = p.equipment[slotName];
  if (slotName === 'accessory' && Array.isArray(eq)) {
    eq = eq[slotIdx || 0];
  }
  if (!eq) { addNarrative('该部位没有装备。', 'system'); return; }
  // 兼容旧装备无 sockets 字段
  if (!eq.sockets && eq.sockets !== 0) eq.sockets = 0;
  if (!eq.socketed) eq.socketed = [];
  if (eq.socketed.length >= eq.sockets) { addNarrative('这件装备的孔位已满（' + eq.sockets + '孔）。', 'system'); return; }
  const gem = (G.itemData && G.itemData.length ? G.itemData : (typeof ITEM_DB !== 'undefined' ? ITEM_DB : [])).find(function(g) { return g.id === gemId; });
  if (!gem || gem.type !== '宝石') { addNarrative('这不是宝石。', 'system'); return; }
  const owned = p.inventory.find(function(i) { return i.id === gemId && (i.qty === undefined || i.qty === null || i.qty > 0); });
  if (!owned) { addNarrative('背包里没有' + gem.name + '。', 'system'); return; }
  if (!owned.qty || owned.qty <= 0) owned.qty = 1;
  // 拆除已镶嵌的同类型宝石？不——允许同类型多颗，只扣背包
  owned.qty -= 1;
  if (owned.qty <= 0) { const idx = p.inventory.indexOf(owned); if (idx > -1) p.inventory.splice(idx, 1); }
  eq.socketed.push(gemId);
  recalcStats(p);
  updateAllUI();
  addNarrative('💎 你将' + gem.name + '镶入' + eq.name + '，灵光一闪。', 'event');
}

// ── 💎 宝石拆除（返还背包，孔位空出）──
function unsocketGem(slot, gemIdx) {
  const p = G.player;
  // 🔧 饰品多件：slot 可能是 'accessory|2' 格式
  var slotName = slot, slotIdx = null;
  if (typeof slot === 'string' && slot.indexOf('|') !== -1) {
    var sp = slot.split('|');
    slotName = sp[0]; slotIdx = parseInt(sp[1], 10);
  }
  var eq = p.equipment[slotName];
  if (slotName === 'accessory' && Array.isArray(eq)) {
    eq = eq[slotIdx || 0];
  }
  if (!eq || !eq.socketed) return;
  const gemId = eq.socketed[gemIdx];
  if (!gemId) return;
  const gem = (G.itemData && G.itemData.length ? G.itemData : (typeof ITEM_DB !== 'undefined' ? ITEM_DB : [])).find(function(g) { return g.id === gemId; });
  if (gem) addItemToInventory(gem, 1);
  eq.socketed.splice(gemIdx, 1);
  recalcStats(p);
  updateAllUI();
  addNarrative('💎 你取下' + (gem ? gem.name : '宝石') + '，孔位空了出来。', 'system');
}

// ── 💎 装备面板：渲染孔位 + 镶嵌/拆除按钮 ──
// 🔧 2026-08-03：支持饰品多件——accessory 传 idx 指定第几件
function renderSocketUI(slot, idx) {
  const p = G.player;
  var eq = p.equipment[slot];
  if (slot === 'accessory' && Array.isArray(eq)) {
    eq = eq[idx];
  }
  if (!eq) return '';
  // 🔧 饰品多件：镶嵌/拆除也要带 idx，否则操作的是数组对象而非元素
  var slotRef = (slot === 'accessory' && Array.isArray(p.equipment[slot])) ? ('accessory|' + (idx || 0)) : slot;
  const sockets = eq.sockets || 0;
  if (sockets <= 0) return '';
  const gemDb = (G.itemData && G.itemData.length ? G.itemData : (typeof ITEM_DB !== 'undefined' ? ITEM_DB : []));
  const socketed = eq.socketed || [];
  let html = '<div style="font-size:10px;color:var(--text-dim);margin-top:3px;">💎 孔位：';
  for (let i = 0; i < sockets; i++) {
    const gid = socketed[i];
    if (gid) {
      const gem = gemDb.find(function(g) { return g.id === gid; });
      html += '<span title="' + (gem ? gem.name : '') + '" style="cursor:pointer;margin-right:4px;" onclick="unsocketGem(\'' + slotRef + '\',' + i + ')">💎' + (gem ? gem.name[0] : '') + '</span>';
    } else {
      // 可镶嵌的宝石下拉
      const gems = gemDb.filter(function(g) { return g.type === '宝石' && p.inventory.some(function(it) { return it.id === g.id && it.qty > 0; }); });
      if (gems.length > 0) {
        // 🟡 有可镶宝石 → 空孔位高亮 + 下拉带效果
        html += '<span style="color:#ffd54f;font-size:10px;">🟡</span><select style="font-size:9px;background:rgba(255,213,79,0.08);color:var(--text);border:1px solid rgba(255,213,79,0.35);border-radius:4px;margin-right:4px;" onchange="socketGem(\'' + slotRef + '\',this.value)"><option value="">选择宝石…</option>' + gems.map(function(g) {
          var ge = g.gemEffect || {};
          var gp = [];
          if (ge.attackBonus) gp.push('攻+' + ge.attackBonus);
          if (ge.defenseBonus) gp.push('防+' + ge.defenseBonus);
          if (ge.hpBonus) gp.push('血+' + ge.hpBonus);
          if (ge.maxQiBonus) gp.push('灵+' + ge.maxQiBonus);
          if (ge.critRate) gp.push('暴+' + Math.round(ge.critRate * 100) + '%');
          if (ge.dodge) gp.push('闪+' + Math.round(ge.dodge * 100) + '%');
          if (ge.cultivationSpeed) gp.push('修+' + Math.round(ge.cultivationSpeed * 100) + '%');
          return '<option value="' + g.id + '">' + g.name + (gp.length ? '（' + gp.join(' ') + '）' : '') + '</option>'; 
        }).join('') + '</select>';
      } else {
        html += '<span style="margin-right:4px;color:#555;">⚪</span>';
      }
    }
  }
  html += '</div>';
  return html;
}

window.socketGem = socketGem;
window.unsocketGem = unsocketGem;
window.renderSocketUI = renderSocketUI;
window.gemSocketDialog = gemSocketDialog;

// 装备物品（自动判断装备位）
function equipItem(itemId) {
  const p = G.player;
  const inv = p.inventory.find(i => i.id === itemId);
  if (!inv || !inv.equipEffect) {
    addNarrative('此物不可装备。', 'system'); return;
  }
  
  var slot = getEquipSlot(inv);
  
  // 🔧 2026-08-03：饰品多件——accessory 为数组，装备时追加不顶替
  if (slot === 'accessory') {
    if (!Array.isArray(p.equipment.accessory)) {
      // 兼容旧档单对象 → 转数组
      p.equipment.accessory = p.equipment.accessory ? [p.equipment.accessory] : [];
    }
    // 相同物品不重复装备（防点错）
    var dup = p.equipment.accessory.some(function(a) { return a.id === inv.id; });
    if (dup) {
      addNarrative('这件饰品已经戴着了。', 'system'); return;
    }
    p.equipment.accessory.push({ id: inv.id, name: inv.name, type: inv.type,
      value: inv.value, quality: inv.quality || null, effects: inv.equipEffect || {},
      desc: inv.desc || '',
      sockets: inv.sockets || 0, socketed: inv.socketed || [],
      _equipSlot: inv._equipSlot || 'accessory' });
    removeItemFromInventory(itemId, 1);
    addNarrative('💍 你戴上了 ' + inv.name + '（饰品可同时佩戴多件）。', 'event');
    recalcStats(p);
    updateAllUI();
    return;
  }
  
  // 卸下同部位装备
  if (p.equipment[slot]) {
    var eqOld = p.equipment[slot];
    var oldData = (typeof ITEM_DB !== 'undefined' ? ITEM_DB : []).find(i => i.id === eqOld.id);
    if (oldData) addItemToInventory(oldData, 1);
    else addItemToInventory({ id:eqOld.id, name:eqOld.name,
      type:eqOld.type, value:eqOld.value, category:'装备',
      quality: eqOld.quality || null,
      desc: eqOld.desc || '',
      equipEffect:eqOld.effects || null,
      sockets: eqOld.sockets || 0, socketed: eqOld.socketed || [],  // 💎 宝石随装备回背包
      _equipSlot: eqOld._equipSlot || slot  // 🔧 保留槽位，防掉落装备换装后穿错部位
    }, 1);
  }
  
  p.equipment[slot] = { id: inv.id, name: inv.name, type: inv.type,
    value: inv.value, quality: inv.quality || null, effects: inv.equipEffect || {},
    desc: inv.desc || '',
    sockets: inv.sockets || 0, socketed: inv.socketed || [],   // 💎 孔位/宝石随装备走
    _equipSlot: inv._equipSlot || slot };  // 🔧 槽位/描述随装备保存，卸下回背包不丢
  removeItemFromInventory(itemId, 1);
  var slotNames = { weapon:'🗡️', armor:'🛡️', accessory:'💍', head:'👑', shoes:'👢' };
  addNarrative(`你装备了 ${slotNames[slot]||''} ${inv.name}。`, 'event');
  recalcStats(p);
  updateAllUI();
}

// ==========================
// 叙事
// ==========================
var __narrativeDedup = { text:'', count:0, merged:0, time:0 };
function addNarrative(text, type) {
  var now = Date.now();
  var isRepeat = (text === __narrativeDedup.text && now - __narrativeDedup.time < 60000);
  __narrativeDedup.text = text;
  __narrativeDedup.time = now;
  
  if (isRepeat) {
    __narrativeDedup.count++;
    if (__narrativeDedup.count >= 3 && !__narrativeDedup.merged) {
      __narrativeDedup.merged = true;
      var mergedText = text + '（×' + (__narrativeDedup.count + 1) + '）';
      const entry = { text: mergedText, type: type || 'system', turn: G.turn++, time:{...G.time} };
      G.narrativeHistory.push(entry);
      if (typeof renderNarrativeEntry === 'function') renderNarrativeEntry(entry);
    }
    return;
  }
  
  __narrativeDedup.count = 0;
  __narrativeDedup.merged = 0;
  
  const entry = { text, type, turn: G.turn++, time:{...G.time} };
  G.narrativeHistory.push(entry);
  if (typeof renderNarrativeEntry === 'function') renderNarrativeEntry(entry);
  // 🔧 2026-08-05：山门地图全屏打开时，叙事也同步显示到地图内反馈条（否则被盖住看不到）
  if (typeof showSectMapFeedback === 'function' && typeof isSectMapOpen === 'function' && isSectMapOpen()) {
    showSectMapFeedback(text, type);
  }
  if (type === 'event' || type === 'narr-combat') {
    if (G.player) G.player.eventHistory.push(text.slice(0, 40));
  }
}

function addNarrative_console(text) {
  const entry = { text, type:'loot', turn:G.turn++, time:{...G.time} };
  G.narrativeHistory.push(entry);
  if (typeof renderNarrativeEntry === 'function') renderNarrativeEntry(entry);
}

// Stop-gap for combat.js reference
function getSceneData(sceneId) {
  if (!G.worldData || !G.worldData.layers) return null;
  for (const layer of G.worldData.layers) {
    const f = layer.scenes.find(s => s.id === sceneId);
    if (f) return f;
  }
  return null;
}

// 🔧 2026-08-05：场景显示名（冰阁弟子视角：青云后山 → 冰阁·山门；冰风石窟 → 冰阁禁地）
function getSceneDisplayName(sceneId) {
  const sc = getSceneData(sceneId);
  if (!sc) return '';
  // 仅冰阁弟子（已加入门派）看到门派命名；未入派角色看普通场景名
  if (typeof isSectMember === 'function' && isSectMember()) {
    if (sceneId === 'sect_base') return '冰阁·山门';
    if (sceneId === 'bingfeng_grotto') return '冰阁禁地·冰风石窟';
  }
  return sc.name;
}
window.getSceneDisplayName = getSceneDisplayName;

// 场景显示描述（冰阁弟子：门派驻地/禁地描述增强）
function getSceneDisplayDesc(sceneId) {
  const sc = getSceneData(sceneId);
  if (!sc) return '';
  if (typeof isSectMember === 'function' && isSectMember()) {
    if (sceneId === 'sect_base') {
      return '冰阁山门，两根冰晶石柱擎天而立。石柱上刻着「冰阁当立，传承不绝」八个字。风雪过后，山门前的石阶上落了一层薄雪。';
    }
    if (sceneId === 'bingfeng_grotto') {
      return '终年冰封的石窟，如今是冰阁禁地。洞壁上凝结着剔透的冰晶，深处刻着罗峰与百里冰留下的道痕——元婴大成后，可入内参悟先辈之路。';
    }
  }
  return sc.description;
}
window.getSceneDisplayDesc = getSceneDisplayDesc;

// 获取场景所在层级


// ==========================
// 域/场景归属查询（与大世界联动）
// ==========================
const COSMOS_DOMAIN_NAMES = {
  donghuang:'东荒域', zhongzhou:'中州域', nanji:'南极域',
  ximo:'西漠域', beiji:'北极域', donghai:'东海域',
  tianyu:'天域', youyu:'幽域', xuwu:'虚无域'
};
const COSMOS_REGION_NAMES = {
  dh_canglan:'苍澜州', dh_qingmu:'青木原', dh_tianzhu:'天柱峰',
  dh_biluo:'碧落海', dh_luori:'落日平原',
  yy_wangzhe:'亡者峡谷', yy_huangquan:'黄泉路', yy_wangchuan:'忘川河', yy_lunhui:'轮回台',
  bj_bingfeng:'冰封海',
  ty_fulong:'浮空山', dh_yingzhou:'瀛洲',
  zz_tianji:'天机城', zz_yaoshou:'妖兽山脉', zz_lingmai:'灵脉遗迹', zz_huangji:'荒寂古战场',
  ty_baiyu:'云霄仙宫', ty_leichi:'雷池', ty_yunhai:'云海秘境', ty_tiandao:'天道峰',
};

function getSceneDomain(sceneId) {
  const sc = getSceneData(sceneId);
  if (!sc || !sc.cosmosDomain) return null;
  const dn = COSMOS_DOMAIN_NAMES[sc.cosmosDomain] || sc.cosmosDomain;
  const rn = sc.cosmosRegion ? (COSMOS_REGION_NAMES[sc.cosmosRegion] || sc.cosmosRegion) : '';
  return { id: sc.cosmosDomain, name: dn, region: sc.cosmosRegion, regionName: rn };
}

// 丹药ID转中文名
function pillName(id) {
  var db = typeof ITEM_DB !== 'undefined' ? ITEM_DB : [];
  var item = db.find(function(i){return i.id===id;});
  return item ? item.name : id;
}

function getDomainEntryRequirement(domainId) {
  // 所有域已开放，零门槛
  return 1;
}

function checkDomainAccess(domainId) {
  return { pass: true, required: 1, current: 1, domainId: domainId };
}

function getSceneLayer(sceneId) {
  if (!G.worldData || !G.worldData.layers) return null;
  return G.worldData.layers.find(l => l.scenes.some(s => s.id === sceneId)) || null;
}

function getCurrentRegionName() {
  if (!G.worldData || !G.worldData.layers) return '未知地域';
  for (const layer of G.worldData.layers) {
    if (layer.scenes.find(s => s.id === G.currentScene)) {
      // 如果有 cosmos 归属，展示大世界域信息
      const scene = layer.scenes.find(s => s.id === G.currentScene);
      if (scene && scene.cosmosDomain) {
        const dn = typeof COSMOS_DOMAIN_NAMES !== 'undefined' 
          ? (COSMOS_DOMAIN_NAMES[scene.cosmosDomain] || scene.cosmosDomain) 
          : scene.cosmosDomain;
        const rn = typeof COSMOS_REGION_NAMES !== 'undefined' && scene.cosmosRegion
          ? (COSMOS_REGION_NAMES[scene.cosmosRegion] || scene.cosmosRegion) 
          : '';
        return rn ? dn + '·' + rn : dn;
      }
      return layer.name;
    }
  }
  return '未知地域';
}

// 检查层级访问限制，返回 { pass: bool, gate: obj|null }
function checkLayerAccess(layerId) {
  // 所有界已开放，不再限界
  return { pass: true, gate: null };
}

// ── 域间传送票价 ──
const DOMAIN_TRAVEL_COSTS = {
  donghuang: 0,     // 当前域，免费
  nanji:     200,   // 南方毒瘴沼泽，一域之隔
  ximo:      300,   // 西方荒漠古城
  beiji:     400,   // 北方冰风石窟
  zhongzhou: 500,   // 中央中州雷音古刹
  donghai:   500,   // 东海朽木森林
  tianyu:    800,   // 天域·上古通天路入口
  youyu:     800,   // 幽域·幽冥鬼窟深处
  xuwu:      1200,  // 虚无禁地
};

function getDomainTravelCost(domainId) {
  return DOMAIN_TRAVEL_COSTS[domainId] !== undefined ? DOMAIN_TRAVEL_COSTS[domainId] : 500;
}
function getConnections() {
  const scene = getSceneData(G.currentScene);
  if (!scene || !scene.connections) return [];
  return scene.connections.map(id => getSceneData(id)).filter(Boolean);
}
function triggerMarketVisit() {
  showMarketModal();
}

// ==========================
// 跨域旅行（大世界域间传送）
// ==========================
const DOMAIN_ENTRY_SCENES = {
  donghuang: 'qingyun',
  beiji:     'bingfeng_grotto',
  zhongzhou: 'zhongzhou_gate',
  donghai:   'yumu_forest',
  tianyu:    'ty_baiyu_palace',
  youyu:     'youming_grotto',
};

function travelToDomain(domainId) {
  const p = G.player;
  const access = checkDomainAccess(domainId);
  if (!access.pass) {
    const info = getDomainData ? getDomainData(domainId) : null;
    const name = info ? info.name : domainId;
    const realmName = getQiRealmNameForIndex ? getQiRealmNameForIndex(access.required - 1) : '更高修为';
    addNarrative(`你试图前往「${name}」，但修为不够（需要${realmName}）。`, 'system');
    return;
  }
  
  // 灵石检查
  const cost = getDomainTravelCost(domainId);
  if (cost > 0 && p.stones < cost) {
    addNarrative(`传送阵需要 ${cost} 灵石，你只有 ${p.stones} 块。囊中羞涩，去赚点灵石再来吧。`, 'system');
    return;
  }
  
  const entrySceneId = DOMAIN_ENTRY_SCENES[domainId];
  if (!entrySceneId) {
    addNarrative('此域暂无传送坐标。', 'system');
    return;
  }
  
  const info = getDomainData ? getDomainData(domainId) : null;
  const name = info ? info.name : domainId;
  const entryScene = getSceneData(entrySceneId);
  
  // 扣灵石 & 灵力
  if (cost > 0) p.stones -= cost;
  G.player.qi = Math.max(10, G.player.qi - 30);
  if (typeof setCooldown === 'function') setCooldown(2, '域间传送');
  
  // 传送
  mapMove(entrySceneId);
  
  addNarrative(`你缴纳了 ${cost} 灵石，传送阵嗡鸣大作……灵光一闪，已身在「${name}」·${entryScene ? entryScene.name : '未知之地'}。${cost > 0 ? '荷包轻了些，但前路豁然开朗。' : ''}`, 'event');
}

if (typeof window !== 'undefined') {
  window.travelToDomain = travelToDomain;
}

// ==========================
// 功法效果 → 文字描述（用于领悟卡片）
// ==========================
function formatEffectDescriptions(effects) {
  const parts = [];
  if (!effects) return parts;
  if (effects.cultivationSpeed && effects.cultivationSpeed !== 1)
    parts.push(`修炼速度 x${effects.cultivationSpeed.toFixed(1)}`);
  if (effects.bodyCultSpeed) parts.push(`炼体速度 x${effects.bodyCultSpeed.toFixed(1)}`);
  if (effects.cultivationBonus) parts.push(`修炼效率 +${(effects.cultivationBonus*100).toFixed(0)}%`);
  if (effects.attackBonus) parts.push(`攻击 +${effects.attackBonus}`);
  if (effects.defenseBonus) parts.push(`防御 +${effects.defenseBonus}`);
  if (effects.hpBonus) parts.push(`气血 +${effects.hpBonus}`);
  if (effects.qiRegen) parts.push(`回灵 +${effects.qiRegen}/s`);
  if (effects.hpRegen) parts.push(`回血 +${effects.hpRegen}/s`);
  if (effects.maxQiBonus) parts.push(`灵力上限 +${effects.maxQiBonus}`);
  if (effects.qiCost) parts.push(`耗灵 ${effects.qiCost}`);
  if (effects.critRate) parts.push(`暴击率 +${(effects.critRate*100).toFixed(0)}%`);
  if (effects.dodge) parts.push(`闪避率 +${(effects.dodge*100).toFixed(0)}%`);
  if (effects.stun) parts.push(`眩晕几率 +${(effects.stun*100).toFixed(0)}%`);
  // 🔧 攻伐术顶层特殊效果（自创池）
  if (effects.lifesteal) parts.push(`噬灵 +${(effects.lifesteal*100).toFixed(0)}%`);
  if (effects.freeze) parts.push(`凝霜 ${(effects.freeze*100).toFixed(0)}%`);
  if (effects.burn) parts.push(`焚心 ${(effects.burn*100).toFixed(0)}%`);
  if (effects.exploreBonus) parts.push(`探索 +${(effects.exploreBonus*100).toFixed(0)}%`);
  // 🔧 自创阵道：减伤/反弹
  if (effects.damageReduce) parts.push(`减伤 +${(effects.damageReduce*100).toFixed(0)}%`);
  if (effects.reflectChance) parts.push(`反弹 ${(effects.reflectChance*100).toFixed(0)}%`);
  // 🔧 自创丹道：炼丹加成
  if (effects.alchemyBonus) parts.push(`炼丹 +${(effects.alchemyBonus*100).toFixed(0)}%`);
  if (effects.pillBonus) parts.push(`丹效 +${(effects.pillBonus*100).toFixed(0)}%`);
  if (effects.wisdomBonus) parts.push(`悟性 +${effects.wisdomBonus}`);
  // 🔧 自创秘术：五行特殊战斗效果
  if (effects.combat) {
    const c = effects.combat;
    if (c.armorPierce) parts.push(`破甲 +${(c.armorPierce*100).toFixed(0)}%`);
    if (c.lifesteal) parts.push(`噬灵 +${(c.lifesteal*100).toFixed(0)}%`);
    if (c.freeze) parts.push(`凝霜 ${(c.freeze*100).toFixed(0)}%`);
    if (c.burn) parts.push(`焚心 ${(c.burn*100).toFixed(0)}%`);
    if (c.shield) parts.push(`镇岳 ${(c.shield*100).toFixed(0)}%`);
  }
  if (effects.elementDamage) {
    Object.entries(effects.elementDamage).forEach(([el, val]) => {
      parts.push(`${el}伤 +${(val*100).toFixed(0)}%`);
    });
  }
  if (effects.special) parts.push(effects.special);
  return parts;
}

// 获取品质色
function getQualityColor(quality) {
  // 功法体系（级）+ 装备体系（品）双识别
  const map = {
    '凡级':'#8a7a6a','灵级':'#6a9ec9','地级':'#d46a3a','天级':'#c9a96e','圣级':'#e0c8a0','神级':'#f0d8c0',
    '凡品':'#8a7a6a','灵品':'#6a9ec9','地品':'#d46a3a','天品':'#c9a96e','圣品':'#e0c8a0',
  };
  return map[quality] || '#aaa';
}

window.formatEffectDescriptions = formatEffectDescriptions;
window.getQualityColor = getQualityColor;

// ==========================
// 大时刻卡片构建函数
// ==========================

// 里程碑卡片（顿悟）
function buildMilestoneCard(title, skill) {
  const qColor = getQualityColor(skill.quality);
  const effects = formatEffectDescriptions(skill.effects);
  const effHtml = effects.length > 0
    ? effects.map(e => `<span style="display:inline-block;margin-right:10px;font-size:11px;color:var(--accent);">✦ ${e}</span>`).join('')
    : '';
  return `<div class="milestone-title" style="color:${qColor}">${title}<br><span style="font-size:14px;">— ${skill.name} —</span></div>
<span class="milestone-detail" style="color:${qColor}">${skill.quality}·${skill.type}</span>
<span class="milestone-detail">「${skill.desc}」</span>
${effHtml ? `<span class="milestone-stats">${effHtml}</span>` : ''}`;
}

// 突破卡片（境界突破）
function buildBreakthroughCard(realmLabel, oldCp, newCp, detailLines) {
  const d = detailLines ? detailLines.map(l => `· ${l}`).join('<br>') : '';
  return `<div class="bt-title">⚡ ${realmLabel}</div>
<span class="bt-sub">修为突破了！</span>
<span class="bt-stats">⚔ 战力 ${oldCp} → <b>${newCp}</b> ( +${newCp - oldCp} )<br>${d}</span>`;
}

window.buildMilestoneCard = buildMilestoneCard;
window.buildBreakthroughCard = buildBreakthroughCard;

// 📜 待领悟功法自动参悟（境界达标时调用：突破后 / 读档后）
function autoLearnPendingScrolls(trigger) {
  const p = G.player;
  if (!p || !p.pendingScrolls || p.pendingScrolls.length === 0) return;
  var stillPending = [];
  p.pendingScrolls.forEach(function(ps) {
    var sd2 = (G.skillData || []).find(function(d) { return d.id === ps.skillId; });
    if (!sd2) { return; }
    var rn2 = sd2.learn && sd2.learn.realm ? parseQiRealm(sd2.learn.realm) : 0;
    var rootOk = true;
    if (sd2.learn && sd2.learn.spiritRoot) {
      // 🔧 放宽：仅攻伐术/秘术/阵道需灵根匹配，其余通用功法异系也可参悟
      const rootLockedTypes = ['攻伐术', '秘术', '阵道'];
      if (rootLockedTypes.includes(sd2.type || '')) {
        rootOk = sd2.learn.spiritRoot.some(function(r) { return (p.spiritRoots || []).includes(r); });
      }
    }
    if ((!rn2 || p.qiRealmIndex + 1 >= rn2) && rootOk) {
      // 达标：从待领悟移除，直接学习（learnSkillFromScroll 会成功）
      learnSkillFromScroll(ps.skillId);
      addNarrative(`✨ ${trigger === '突破' ? '境界突破，' : ''}你终于能参悟《${ps.name}》了！`, 'event');
    } else {
      stillPending.push(ps);
    }
  });
  p.pendingScrolls = stillPending;
}
window.autoLearnPendingScrolls = autoLearnPendingScrolls;

// ==========================
// 功法卷轴学习
// ==========================
function learnSkillFromScroll(skillId) {
  const p = G.player;
  const sd = G.skillData.find(d => d.id === skillId);
  if (!sd) { addNarrative('卷轴内容模糊不清，无法领悟。', 'system'); return false; }
  
  // 🔧 2026-08-04：冰阁专属功法拦截——散修永远无法习得
  //    带 sectOnly 标记（在 learn 对象内）的功法只有冰阁弟子（且已入门）可学
  if (sd.learn && sd.learn.sectOnly) {
    const isSect = (typeof isSectMember === 'function') ? isSectMember() : false;
    if (!isSect) {
      addNarrative('这卷功法上印着冰阁的冰雪印记——唯有冰阁弟子方可修习。', 'system');
      return false;
    }
  }
  
  if (p.skills.find(s => s.id === skillId)) {
    addNarrative('你已经学会了这门功法。', 'system');
    return false;
  }
  
  // 境界门槛检验
  if (sd.learn && sd.learn.realm) {
    const rn = parseQiRealm(sd.learn.realm);
    if (rn && p.qiRealmIndex + 1 < rn) {
      // 🔧 修为不足不静默丢弃——存入待领悟，境界达标后自动参悟
      if (!p.pendingScrolls) p.pendingScrolls = [];
      if (!p.pendingScrolls.find(s => s.skillId === skillId)) {
        p.pendingScrolls.push({ skillId: skillId, name: sd.name, requireRealm: sd.learn.realm, source: '未知' });
        addNarrative(`📜 你得到一卷《${sd.name}》，但修为不足（需${sd.learn.realm}）。已存入待领悟，境界达标后自动参悟。`, 'event');
      } else {
        addNarrative(`修为不足，需要${sd.learn.realm}才能参悟。`, 'system');
      }
      return false;
    }
  }
  
  // 灵根检验（🔧 放宽：仅攻伐术/秘术/阵道保留灵根门槛——元素功法本质；
  //    护体/身法/疗伤/吐纳/炼体/丹道是通用功法，取消硬限制，灵根只影响契合加成）
  // 🔧 2026-08-04：冰阁传承功法（sectTolerant）完全跳过灵根校验——
  //    门派秘典因人施教，不似野路子功法挑灵根
  if (sd.learn && sd.learn.spiritRoot && !sd.learn.sectTolerant) {
    const rootLockedTypes = ['攻伐术', '秘术', '阵道'];
    if (rootLockedTypes.includes(sd.type || '')) {
      const hasRoot = sd.learn.spiritRoot.some(r => p.spiritRoots.includes(r));
      if (!hasRoot) {
        addNarrative('灵根不合，无法修炼此' + (sd.type || '功法') + '。', 'system');
        return false;
      }
    } else {
      // 通用功法：异系也可学，提示一句（不阻断）
      const hasRoot = sd.learn.spiritRoot.some(r => p.spiritRoots.includes(r));
      if (!hasRoot) {
        addNarrative('此功法与你的灵根并非同源，但殊途同归，你仍能修习（无灵根契合加成）。', 'event');
      }
    }
  }  
  // 双修功法检验（需要已结道侣）
  if (sd.learn && sd.learn.duoRequired) {
    const hasDaoPartner = typeof npcManager !== 'undefined' && npcManager && 
      npcManager.npcs.some(function(n){ return n.daoPartnerId === 'player' && n.isAlive !== false; });
    if (!hasDaoPartner) {
      addNarrative('此乃双修秘法，需与异性道侣共修方可领悟。先寻一位道侣吧。', 'system');
      return false;
    }
  }
  
  // 悟性影响学习功法的瓶颈突破概率（高悟性直接领悟无需二次参悟）
  const learnChance = Math.min(0.95, 0.6 + (p.wisdom - 50) / 150);
  if (Math.random() < learnChance) {
    // 悟性够高，直接入门
    addNarrative('🧠 你悟性过人，寥寥数语间便参透了其中奥妙。', 'narr-event');
  } else {
    // 悟性不足需要更多时间参悟  
    addNarrative('📖 功法玄妙，你反复揣摩，方才略有所悟。', 'default');
    const extraHours = Math.max(1, Math.floor((1 - (p.wisdom - 50) / 100) * 4));
    for (let i = 0; i < extraHours; i++) advanceTime(0.5);
    if (typeof addDailyLogEntry === 'function') addDailyLogEntry('cultivate', '参悟功法');
  }
  
  const oldCp = p.combatPower || 0;
  
  p.skills.push({
    id: sd.id, name: sd.name, quality: sd.quality,
    type: sd.type, active: false, mastered: false
  });
  
  recalcStats(p);
  const newCp = p.combatPower || 0;
  const cpDiff = newCp - oldCp;
  
  // 构建史诗卡片
  const qColor = getQualityColor(sd.quality);
  const effects = formatEffectDescriptions(sd.effects);
  const effHtml = effects.length > 0 ? effects.map(e => `<span class="epic-stat">✦ ${e}</span>`).join('') : '';
  
  let masterDesc = '';
  if (sd.masteryBonus && sd.masteryBonus.desc) {
    masterDesc = `<span style="display:block;font-size:11px;color:var(--text-dim);margin-top:4px;">熟练后可：${sd.masteryBonus.desc}</span>`;
  }
  
  const cpText = cpDiff > 0 ? ` ⚔ 战力 +${cpDiff}` : '';
  
  const html = `<div class="epic-name" style="color:${qColor}">📖 领悟 <b>${sd.name}</b><span class="epic-quality">${sd.quality}·${sd.type}</span></div>
<span style="display:block;font-size:12px;color:var(--text-dim);margin-top:3px;">${sd.desc}</span>
${effHtml ? `<span style="display:block;font-size:11px;margin-top:4px;">${effHtml}</span>` : ''}
${cpText ? `<span class="epic-stat" style="font-weight:bold;color:var(--accent);">${cpText}</span>` : ''}
${masterDesc}`;
  
  addNarrative(html, 'epic');
  updateAllUI();
  return true;
}

// 根据境界获取可售功法卷轴
function getSkillScrollsForSale(playerRealmIndex) {
  const p = G.player;
  const qualify = [];
  G.skillData.forEach(sd => {
    if (!sd.learn || !sd.learn.realm) return;
    if (sd.quality === '神级') return;
    const reqRealm = parseQiRealm(sd.learn.realm);
    if (!reqRealm) return;
    // 境界 ±2 级
    if (reqRealm <= playerRealmIndex + 2) {
      // 不要卖玩家已经会的
      if (!G.player.skills.find(s => s.id === sd.id)) qualify.push(sd);
    }
  });
  
  // 按灵根匹配排序 + 品质排序
  var rootMatch = {};
  if (p && p.spiritRoots) {
    p.spiritRoots.forEach(function(r) { rootMatch[r] = true; });
  }
  qualify.sort(function(a, b) {
    var aMatch = a.element && rootMatch[a.element] ? 1 : 0;
    var bMatch = b.element && rootMatch[b.element] ? 1 : 0;
    if (aMatch !== bMatch) return bMatch - aMatch; // 灵根匹配优先
    var qA = ({'凡级':0,'灵级':1,'地级':2,'圣级':3})[a.quality] || 0;
    var qB = ({'凡级':0,'灵级':1,'地级':2,'圣级':3})[b.quality] || 0;
    return qB - qA; // 品质高优先
  });
  // 地级以上的功法卖的少
  var maxHigh = 0, result = [];
  qualify.forEach(function(sd) {
    var qIdx = ({'凡级':0,'灵级':1,'地级':2,'圣级':3})[sd.quality] || 0;
    if (qIdx >= 2 && maxHigh >= 2) return; // 地级以上最多 2 本
    if (qIdx >= 2) maxHigh++;
    if (result.length < 8) result.push(sd);
  });
  return result;
}
function checkRandomEvent(scene) {
  if (!G.eventData) return;
  
  // 兼容旧格式（数组格式 -> 包装为对象）
  let events = G.eventData;
  if (Array.isArray(events)) {
    events = events;
  } else if (events.events) {
    events = events.events;
  } else {
    return;
  }
  
  const p = G.player;
  
  // 计算福缘系数
  const luckMult = p.fortune && p.fortune.luckMult ? p.fortune.luckMult : 1.0;
  
  const possible = events.filter(ev => {
    if (!ev.trigger) return false;
    const t = ev.trigger;
    
    // 场景过滤
    if (t.scene && t.scene !== G.currentScene) return false;
    
    // 时辰过滤
    if (t.timePeriod && t.timePeriod !== G.time.period) return false;
    
    // 季节过滤
    if (t.season) {
      // 用游戏天数推算季节（无month字段时）
      const dayOfYear = (G.time.day || 0) % 360;
      const season = G.time.season || (dayOfYear < 90 ? '春' : dayOfYear < 180 ? '夏' : dayOfYear < 270 ? '秋' : '冬');
      if (t.season !== season) return false;
    }
    
    // 境界过滤
    if (t.minRealm) {
      const req = parseQiRealm(t.minRealm);
      if (req && p.qiRealmIndex + 1 < req) return false;
    }
    if (t.maxRealm) {
      const maxR = parseQiRealm(t.maxRealm);
      if (maxR && p.qiRealmIndex + 1 > maxR) return false;
    }
    
    // 福缘过滤
    if (t.minLuck && (luckMult < t.minLuck)) return false;
    if (t.maxLuck && (luckMult > t.maxLuck)) return false;
    
    // 悟性过滤
    if (t.minWisdom && (p.wisdom || 0) < t.minWisdom) return false;
    
    // 炼体境界过滤
    if (t.maxBodyRealm !== undefined && p.bodyRealmIndex > t.maxBodyRealm) return false;
    
    // BOSS击败检测
    if (t.bossKilled) {
      const bossKills = (p.eventHistory || []).filter(e => e.includes('BOSS') || e.includes('击败')).length;
      if (bossKills < 1) return false;
    }
    
    // 概率判定（福缘加成：福缘高更容易触发）
    let chance = t.random || 0.1;
    // 基础福缘乘算 + 额外福缘阈值加成
    chance *= luckMult;
    if (luckMult > 1.2) chance *= 1.3;
    if (luckMult > 1.5) chance *= 1.2;
    if (Math.random() > chance) return false;
    
    return true;
  });
  
  if (possible.length > 0) {
    // 游方道人：避免连续重复
    const noRepeat = possible.filter(ev => !ev.trigger.wanderer || ev.id !== window._lastWandererId);
    const pool = noRepeat.length > 0 ? noRepeat : possible;
    const chosen = pool[Math.floor(Math.random() * pool.length)];
    if (chosen.trigger.wanderer) window._lastWandererId = chosen.id;
    showEventModal(chosen);
  }
}

function moveToScene(sceneId) {
  const scene = getSceneData(sceneId);
  if (!scene) return;
  
  // 跨界检查
  if (scene.type === 'gate' && scene.gateTo) {
    const access = checkLayerAccess(scene.gateTo);
    if (!access.pass) {
      addNarrative(access.gate.denyMessage, 'system');
      return;
    }
  }
  
  // 跨层移动检查（如果目标不在当前层）
  const curLayer = getSceneLayer(G.currentScene);
  const targetLayer = getSceneLayer(sceneId);
  if (curLayer && targetLayer && curLayer.id !== targetLayer.id) {
    const access = checkLayerAccess(targetLayer.id);
    if (!access.pass) {
      addNarrative(access.gate.denyMessage, 'system');
      return;
    }
  }
  
  var isFirstVisit = !G.visitedScenes || G.visitedScenes.indexOf(sceneId) === -1;
  
  G.currentScene = sceneId;
  advanceTime(2);
  
  // 记录已访问场景
  if (!G.visitedScenes) G.visitedScenes = [];
  if (isFirstVisit) {
    G.visitedScenes.push(sceneId);
    // 初始化探索数据
    if (!G.exploredData) G.exploredData = {};
    G.exploredData[sceneId] = _buildSceneDiscoveryData(sceneId);
  }
  
  // 重置环境机制计数器（切换场景）
  if (typeof resetSceneMechanics === 'function') resetSceneMechanics();
  
  // 探点提示（首次进入时展示一个地点推荐）
  if (typeof getScenePOI === 'function') {
    const pois = getScenePOI(sceneId);
    if (pois.length > 0 && Math.random() < 0.5) {
      const randomPoi = pois[Math.floor(Math.random() * pois.length)];
      addNarrative(`📍 你注意到${randomPoi.name}——${randomPoi.desc.slice(0, 30)}……`, 'system');
    }
  }
  
  // 🔥 场景传承触发
  if (typeof checkSceneInheritance === 'function') {
    var inheritance = checkSceneInheritance(sceneId);
    if (inheritance) {
      var qColor = typeof getQualityColor === 'function' ? getQualityColor('天级') : '#c9a96e';
      addNarrative('<div style="color:' + qColor + ';font-weight:bold;">✨ ' + inheritance.title + '</div><div style="font-size:12px;margin-top:4px;">' + inheritance.text + '</div>', 'milestone');
    }
  }
  
  if (scene.feature === '坊市') {
    // 自动模式不弹市场界面，自动买药
    if (typeof autoModeActive !== 'undefined' && autoModeActive) {
      // auto mode handles market internally
    } else {
      triggerMarketVisit();
    }
  }
  
  // 场景特产提示
  const hints = {
    '灵草': '此地灵草丰茂，适合采集。',
    '灵药': '药香扑鼻，似乎有不少珍贵灵药可采。',
    '毒物': '毒瘴弥漫，毒虫毒草遍布。',
    '法器': '断壁残垣中似乎埋藏着法器遗宝。',
    '冰晶': '洞壁上凝结着剔透的冰晶，内含精纯灵气。',
  };
  if (scene.resourceType && hints[scene.resourceType]) {
    addNarrative(hints[scene.resourceType], 'system');
  }
  
    // 场景探索记录（任务检测）
  if (typeof recordExplore === "function") recordExplore(sceneId);
  // 自动触发场景任务
  if (typeof checkSceneQuestTriggers === "function") checkSceneQuestTriggers(sceneId);
  // 天地悟道点检测（特定时刻+特定场景 → 顿悟机缘）
  if (typeof tryTriggerEnlighten === 'function') {
    setTimeout(() => { try { tryTriggerEnlighten(sceneId); } catch(e) {} }, 600);
  }
  // 文化名人偶遇（进入场景时有概率遇到历代先贤）
  if (typeof checkSageEncounter === "function") checkSageEncounter(sceneId);
  // 进入新场景触发一次奇遇
  if (typeof checkRandomEvent === "function") checkRandomEvent(getSceneData(G.currentScene));
  // 自动生成场景NPC
  if (typeof npcManager !== 'undefined' && npcManager) {
    npcManager.ensureNPCsForScene(sceneId, scene);
  }
  updateAllUI();
  updateSceneDisplay();
  
  // 🆕 首次探索发现弹窗
  if (isFirstVisit && typeof autoModeActive !== 'undefined' && !autoModeActive && typeof showSceneDetail === 'function') {
    // 延迟一点展示，让画面先刷新
    setTimeout(function() { showSceneDetail(sceneId); }, 200);
  }
}

// ==========================
// 导出
// ==========================
window.G = G;
window.BODY_REALMS = BODY_REALMS;
window.QI_REALMS = QI_REALMS;
window.ROOT_TYPES = ROOT_TYPES;
window.SKILL_SLOTS = SKILL_SLOTS;
window.getBodyRealm = getBodyRealm;
window.getQiRealm = getQiRealm;
window.getRealmLabel = getRealmLabel;
window.getCultivationProgress = getCultivationProgress;

// ==========================
// 😴 休息沉浸（写诗读诗，1分钟实时）
// ==========================
var REST_POEMS = [
  { title:'归园田居·其一', author:'陶渊明', text:'少无适俗韵，性本爱丘山。误落尘网中，一去三十年。羁鸟恋旧林，池鱼思故渊。开荒南野际，守拙归园田。' },
  { title:'归园田居·其三', author:'陶渊明', text:'种豆南山下，草盛豆苗稀。晨兴理荒秽，带月荷锄归。道狭草木长，夕露沾我衣。衣沾不足惜，但使愿无违。' },
  { title:'饮酒·其五', author:'陶渊明', text:'结庐在人境，而无车马喧。问君何能尔？心远地自偏。采菊东篱下，悠然见南山。此中有真意，欲辨已忘言。' },
  { title:'山居秋暝', author:'王维', text:'空山新雨后，天气晚来秋。明月松间照，清泉石上流。竹喧归浣女，莲动下渔舟。随意春芳歇，王孙自可留。' },
  { title:'鸟鸣涧', author:'王维', text:'人闲桂花落，夜静春山空。月出惊山鸟，时鸣春涧中。' },
  { title:'鹿柴', author:'王维', text:'空山不见人，但闻人语响。返景入深林，复照青苔上。' },
  { title:'竹里馆', author:'王维', text:'独坐幽篁里，弹琴复长啸。深林人不知，明月来相照。' },
  { title:'山中', author:'王维', text:'荆溪白石出，天寒红叶稀。山路元无雨，空翠湿人衣。' },
  { title:'寻隐者不遇', author:'贾岛', text:'松下问童子，言师采药去。只在此山中，云深不知处。' },
  { title:'题李凝幽居', author:'贾岛', text:'闲居少邻并，草径入荒园。鸟宿池边树，僧敲月下门。' },
  { title:'江雪', author:'柳宗元', text:'千山鸟飞绝，万径人踪灭。孤舟蓑笠翁，独钓寒江雪。' },
  { title:'枫桥夜泊', author:'张继', text:'月落乌啼霜满天，江枫渔火对愁眠。姑苏城外寒山寺，夜半钟声到客船。' },
  { title:'滁州西涧', author:'韦应物', text:'独怜幽草涧边生，上有黄鹂深树鸣。春潮带雨晚来急，野渡无人舟自横。' },
  { title:'山中问答', author:'李白', text:'问余何意栖碧山，笑而不答心自闲。桃花流水窅然去，别有天地非人间。' },
  { title:'秋浦歌·其十五', author:'李白', text:'白发三千丈，缘愁似个长。不知明镜里，何处得秋霜！' },
  { title:'夏日山中', author:'李白', text:'懒摇白羽扇，裸袒青林中。脱巾挂石壁，露顶洒松风。' },
  { title:'独坐敬亭山', author:'李白', text:'众鸟高飞尽，孤云独去闲。相看两不厌，只有敬亭山。' },
  { title:'宿建德江', author:'孟浩然', text:'移舟泊烟渚，日暮客愁新。野旷天低树，江清月近人。' },
  { title:'春晓', author:'孟浩然', text:'春眠不觉晓，处处闻啼鸟。夜来风雨声，花落知多少。' },
  { title:'过故人庄', author:'孟浩然', text:'故人具鸡黍，邀我至田家。绿树村边合，青山郭外斜。开轩面场圃，把酒话桑麻。待到重阳日，还来就菊花。' },
  { title:'夏日绝句', author:'李清照', text:'生当作人杰，死亦为鬼雄。至今思项羽，不肯过江东。' },
  { title:'如梦令', author:'李清照', text:'常记溪亭日暮，沉醉不知归路。兴尽晚回舟，误入藕花深处。争渡，争渡，惊起一滩鸥鹭。' },
  { title:'题破山寺后禅院', author:'常建', text:'清晨入古寺，初日照高林。曲径通幽处，禅房花木深。山光悦鸟性，潭影空人心。万籁此俱寂，但余钟磬音。' },
  { title:'终南别业', author:'王维', text:'中岁颇好道，晚家南山陲。兴来每独往，胜事空自知。行到水穷处，坐看云起时。偶然值林叟，谈笑无还期。' },
  { title:'定风波', author:'苏轼', text:'莫听穿林打叶声，何妨吟啸且徐行。竹杖芒鞋轻胜马，谁怕？一蓑烟雨任平生。料峭春风吹酒醒，微冷，山头斜照却相迎。回首向来萧瑟处，归去，也无风雨也无晴。' },
];

function startRest() {
  var p = G.player;
  if (!p) return;
  var overlay = document.getElementById('rest-overlay');
  if (!overlay) return;
  overlay.classList.remove('hidden');
  
  var totalTime = 60;
  var elapsed = 0;
  var interval = 200;
  var steps = totalTime * 1000 / interval;
  
  var poem = REST_POEMS[Math.floor(Math.random() * REST_POEMS.length)];
  
  document.getElementById('rest-poem-title').textContent = poem.title || '';
  document.getElementById('rest-poem-author').textContent = '—— ' + (poem.author || '') + ' ——';
  document.getElementById('rest-poem-text').textContent = poem.text;
  
  document.getElementById('rest-bar').style.width = '0%';
  document.getElementById('rest-step').textContent = '💤 歇息';
  document.getElementById('rest-pct').textContent = '0%';
  document.getElementById('rest-result').style.display = 'none';
  document.getElementById('rest-close-btn').style.display = 'none';
  
  var restTimer = setInterval(function() {
    elapsed++;
    var pct = Math.min(100, (elapsed / steps) * 100);
    var barEl = document.getElementById('rest-bar');
    var stepEl = document.getElementById('rest-step');
    var pctEl = document.getElementById('rest-pct');
    if (barEl) barEl.style.width = pct + '%';
    if (pctEl) pctEl.textContent = Math.round(pct) + '%';
    
    if (stepEl) {
      if (pct < 25) stepEl.textContent = '🍵 品茗';
      else if (pct < 50) stepEl.textContent = '📖 读诗';
      else if (pct < 75) stepEl.textContent = '😌 养神';
      else stepEl.textContent = '✨ 舒展';
    }
    
    if (elapsed >= steps) {
      clearInterval(restTimer);
      // 完成休息
      p.qi = p.maxQi;
      p.hp = p.maxHp;
      if (typeof advanceTime === 'function') advanceTime(12);
      
      if (stepEl) stepEl.textContent = '😴 一身轻松';
      if (barEl) barEl.style.width = '100%';
      if (pctEl) pctEl.textContent = '100%';
      
      var resultEl = document.getElementById('rest-result');
      if (resultEl) {
        resultEl.style.display = 'block';
        resultEl.innerHTML = '<div style="font-size:12px;color:var(--accent);font-weight:bold;margin-bottom:4px;">😴 休整完毕</div>'
          + '<div style="font-size:10px;color:#8bc34a;">灵力完全恢复 (' + Math.round(p.qi) + '/' + Math.round(p.maxQi) + ')</div>'
          + '<div style="font-size:10px;color:#e57373;">气血完全恢复 (' + Math.round(p.hp) + '/' + Math.round(p.maxHp) + ')</div>'
          + '<div style="font-size:9px;color:var(--text-dim);margin-top:4px;">📖 读「' + poem.title + '」</div>';
      }
      
      var closeBtn = document.getElementById('rest-close-btn');
      if (closeBtn) closeBtn.style.display = 'inline-block';
      
      if (typeof addNarrative === 'function') addNarrative('😴 你饱睡了一整天，灵力与气血尽复。', 'event');
      if (typeof recalcStats === 'function') recalcStats(p);
      if (typeof updateAllUI === 'function') updateAllUI();
    }
  }, interval);
}

function closeRest() {
  var overlay = document.getElementById('rest-overlay');
  if (overlay) overlay.classList.add('hidden');
}

window.startRest = startRest;
window.closeRest = closeRest;
window.startMeditation = startMeditation;
window.closeMeditation = closeMeditation;
window.qiCultivate = qiCultivate;
window.startBodyCultivate = startBodyCultivate;
window.closeBodyCultivate = closeBodyCultivate;
window.bodyCultivate = bodyCultivate;
window.manualBodyCultivate = manualBodyCultivate;
window.rest = rest;
window.explore = explore;
window.advanceTime = advanceTime;
window.addNarrative = addNarrative;
window.addNarrative_console = addNarrative_console;
window.recalcStats = recalcStats;
window.useItem = useItem;
window.equipItem = equipItem;
window.addItemToInventory = addItemToInventory;
window.mergeInventoryItems = mergeInventoryItems;
window.removeItemFromInventory = removeItemFromInventory;
window.autoSellInventory = autoSellInventory;
window.cleanInventory = cleanInventory;
window.getSceneData = getSceneData;
window.getSceneLayer = getSceneLayer;
window.getCurrentRegionName = getCurrentRegionName;
window.getConnections = getConnections;
window.checkLayerAccess = checkLayerAccess;
/* ── 探索数据构建：首次进入场景时，收集并保存所有已知信息 ── */
function _buildSceneDiscoveryData(sceneId) {
  var scene = getSceneData(sceneId);
  if (!scene) return null;
  // 🔧 2026-08-05：冰阁弟子视角的探索描述用增强版（冰阁·山门/禁地描述）
  var dispName = typeof getSceneDisplayName === 'function' ? getSceneDisplayName(sceneId) : scene.name;
  var dispDesc = typeof getSceneDisplayDesc === 'function' ? getSceneDisplayDesc(sceneId) : scene.description;
  var data = {
    name: dispName,
    description: dispDesc,
    type: scene.type,
    qiLevel: scene.qiLevel || 1,
    dangerLevel: scene.dangerLevel || 1,
    safe: scene.safe || false,
    feature: scene.feature || '',
    resourceType: scene.resourceType || '',
    hasBoss: false,
    hasSkillDrop: false,
    hasSecretRealm: false,
    hasPOI: false,
    poiCount: 0,
    resourceCount: 0,
    monsterCount: (scene.monsters && scene.monsters.length) || 0,
    monsterInfo: [],
    realmName: '',
    cultivationRating: _getCultivationRating(scene.qiLevel || 1),
    domainName: ''
  };
  if (typeof BOSS_MONSTERS !== 'undefined' && BOSS_MONSTERS[sceneId]) data.hasBoss = true;
  if (typeof SCENE_SKILL_DROPS !== 'undefined' && SCENE_SKILL_DROPS[sceneId]) data.hasSkillDrop = true;
  if (typeof SECRET_REALMS !== 'undefined') {
    var sr = Object.values(SECRET_REALMS).find(function(r) { return r.sceneId === sceneId; });
    if (sr) data.hasSecretRealm = true;
  }
  if (typeof SCENE_POI !== 'undefined' && SCENE_POI[sceneId]) {
    data.hasPOI = true;
    data.poiCount = (SCENE_POI[sceneId] || []).length;
  }
  if (typeof SCENE_RESOURCES !== 'undefined' && SCENE_RESOURCES[sceneId]) {
    data.resourceCount = (SCENE_RESOURCES[sceneId] || []).length;
  }
  if (typeof MONSTER_DATA !== 'undefined' && scene.monsters) {
    data.monsterInfo = (scene.monsters || []).filter(function(mid) { return !!MONSTER_DATA[mid]; }).map(function(mid) {
      var md = MONSTER_DATA[mid];
      return { id: mid, qi: md.qi || 1, hp: md.hp || 10 };
    });
  }
  if (typeof COSMOS_DOMAIN_NAMES !== 'undefined' && scene.cosmosDomain && COSMOS_DOMAIN_NAMES[scene.cosmosDomain]) {
    data.realmName = COSMOS_DOMAIN_NAMES[scene.cosmosDomain];
    data.domainName = scene.cosmosDomain;
  }
  return data;
}

/* 修炼评级：根据场景灵气等级给出直观星级 */
function _getCultivationRating(qiLevel) {
  if (qiLevel <= 2) return { stars: 1, label: '贫瘠', color: '#666' };
  if (qiLevel <= 3) return { stars: 2, label: '一般', color: '#8bc34a' };
  if (qiLevel <= 4) return { stars: 3, label: '灵秀', color: '#8bc34a' };
  if (qiLevel <= 5) return { stars: 4, label: '灵脉', color: 'var(--accent)' };
  if (qiLevel <= 6) return { stars: 5, label: '福地', color: '#ff9800' };
  if (qiLevel <= 7) return { stars: 6, label: '洞天', color: '#e74c3c' };
  if (qiLevel <= 9) return { stars: 7, label: '圣地', color: '#c084fc' };
  return { stars: 8, label: '仙境', color: '#ffd700' };
}

/* 打开场景详情弹窗（探索后的地图节点点击触发） */
function showSceneDetail(sceneId) {
  var data = G.exploredData && G.exploredData[sceneId];
  var scene = getSceneData(sceneId);
  if (!data || !scene) {
    mapMove(sceneId);
    return;
  }
  
  var cr = data.cultivationRating || { stars: 1, label: '未知', color: '#666' };
  var starsHtml = '';
  for (var si = 0; si < cr.stars; si++) starsHtml += '★';
  for (var si2 = cr.stars; si2 < 5; si2++) starsHtml += '☆';
  
  var typeEmoji = { 'town':'🏘️','dungeon':'🕳️','mountain':'🏔️','garden':'🌿','swamp':'💀','ruins':'🏛️','cave':'🕳️','wild':'🌲','gate':'🚪','safe':'🏠' };
  var typeEmj = typeEmoji[scene.type] || '🌲';
  
  // 战力标签 vs 玩家修为
  var powerLabel = '';
  var playerIdx = G.player ? G.player.qiRealmIndex : 3;
  if (data.monsterCount > 0 && data.monsterInfo.length > 0) {
    var avgQi = data.monsterInfo.reduce(function(s, m) { return s + (m.qi || 1); }, 0) / data.monsterInfo.length;
    var realmQi = 1 + playerIdx * 2;
    var ratio = avgQi / (realmQi || 1);
    var col, txt;
    if (ratio < 0.3) { col = '#8bc34a'; txt = '✅ 碾压'; }
    else if (ratio < 0.7) { col = '#8bc34a'; txt = '⚡ 轻松'; }
    else if (ratio < 1.0) { col = 'var(--accent)'; txt = '⚔️ 同级'; }
    else if (ratio < 1.8) { col = '#ff9800'; txt = '🔥 越级'; }
    else { col = '#e74c3c'; txt = '💀 高危'; }
    powerLabel = '<span style="color:' + col + ';font-size:10px;font-weight:bold;">' + txt + '</span>';
  } else {
    powerLabel = '<span style="color:#666;font-size:10px;">🏠 安全</span>';
  }
  
  var html = '<div style="max-width:500px;margin:0 auto;">';
  
  // 标题行
  html += '<div style="display:flex;align-items:center;gap:8px;margin-bottom:12px;">';
  html += '<span style="font-size:28px;">' + typeEmj + '</span>';
  html += '<div><div style="font-size:16px;font-weight:bold;color:var(--accent);">' + (typeof getSceneDisplayName === 'function' ? getSceneDisplayName(sceneId) : scene.name) + '</div>';
  if (data.realmName) html += '<div style="font-size:10px;color:var(--text-dim);">' + data.realmName + '</div></div></div>';
  
  // 信息网格
  html += '<div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;margin-bottom:12px;">';
  // 修炼评级
  html += '<div style="background:rgba(255,255,255,0.04);border-radius:6px;padding:6px 8px;">';
  html += '<div style="font-size:9px;color:var(--text-dim);margin-bottom:2px;">🧘 修炼适宜度</div>';
  html += '<div style="color:' + cr.color + ';font-size:11px;">' + starsHtml + ' ' + cr.label + '</div></div>';
  // 怪物等级
  html += '<div style="background:rgba(255,255,255,0.04);border-radius:6px;padding:6px 8px;">';
  html += '<div style="font-size:9px;color:var(--text-dim);margin-bottom:2px;">⚔️ 战斗评估</div>';
  html += '<div>' + powerLabel + '</div>';
  if (data.monsterCount > 0) html += '<div style="font-size:9px;color:var(--text-dim);margin-top:2px;">' + data.monsterCount + '种怪物</div>';
  html += '</div>';
  // BOSS
  if (data.hasBoss) html += '<div style="background:rgba(231,76,60,0.08);border-radius:6px;padding:6px 8px;"><div style="font-size:9px;color:var(--text-dim);margin-bottom:2px;">👑 首领</div><div style="font-size:11px;color:#e74c3c;">⚠️ 存在区域BOSS</div></div>';
  // 秘境
  if (data.hasSecretRealm) html += '<div style="background:rgba(192,132,252,0.08);border-radius:6px;padding:6px 8px;"><div style="font-size:9px;color:var(--text-dim);margin-bottom:2px;">🏛️ 秘境</div><div style="font-size:11px;color:#c084fc;">🗝️ 隐藏秘境入口</div></div>';
  // 功法
  if (data.hasSkillDrop) html += '<div style="background:rgba(201,169,110,0.08);border-radius:6px;padding:6px 8px;"><div style="font-size:9px;color:var(--text-dim);margin-bottom:2px;">📜 功法传承</div><div style="font-size:11px;color:var(--accent);">可领悟功法</div></div>';
  // 采集资源
  if (data.resourceCount > 0) html += '<div style="background:rgba(139,195,74,0.08);border-radius:6px;padding:6px 8px;"><div style="font-size:9px;color:var(--text-dim);margin-bottom:2px;">🌿 资源采集</div><div style="font-size:11px;color:#8bc34a;">' + data.resourceCount + '处采集点</div></div>';
  // 人文地点
  if (data.hasPOI) html += '<div style="background:rgba(100,180,255,0.08);border-radius:6px;padding:6px 8px;"><div style="font-size:9px;color:var(--text-dim);margin-bottom:2px;">📍 人文探点</div><div style="font-size:11px;color:#64b4ff;">' + data.poiCount + '处景观</div></div>';
  // 特色标签
  if (data.feature) html += '<div style="background:rgba(255,215,0,0.08);border-radius:6px;padding:6px 8px;"><div style="font-size:9px;color:var(--text-dim);margin-bottom:2px;">🏷️ 特色</div><div style="font-size:10px;color:#ffd700;">' + data.feature + '</div></div>';
  if (data.resourceType) html += '<div style="background:rgba(255,152,0,0.08);border-radius:6px;padding:6px 8px;"><div style="font-size:9px;color:var(--text-dim);margin-bottom:2px;">💎 特产</div><div style="font-size:10px;color:#ff9800;">' + data.resourceType + '</div></div>';
  html += '</div>';
  
  // 场景描述
  html += '<div style="margin-bottom:12px;padding:8px;background:rgba(255,255,255,0.03);border-radius:6px;border-left:2px solid var(--accent);font-size:11px;color:var(--text-dim);line-height:1.6;">';
  html += data.description;
  html += '</div>';
  
  // 操作按钮
  html += '<div style="display:flex;gap:8px;justify-content:center;">';
  // 🔧 2026-08-05：冰阁弟子看冰风石窟详情时，前往按钮走禁地门槛检查
  var goAction = 'closeCustomModal(); mapMove(\'' + sceneId + '\')';
  if (sceneId === 'bingfeng_grotto' && typeof isSectMember === 'function' && isSectMember() && !(typeof isForbiddenUnlocked === 'function' && isForbiddenUnlocked())) {
    goAction = 'closeCustomModal(); worldMapForbiddenMove(\'' + sceneId + '\')';
  }
  html += '<button class="event-choice-btn" onclick="' + goAction + '">🚶 前往此地</button>';
  html += '<button class="event-choice-btn" onclick="closeCustomModal()" style="background:rgba(100,100,100,0.2);">关闭</button>';
  html += '</div></div>';
  
  showCustomModal('🗺️ ' + (typeof getSceneDisplayName === 'function' ? getSceneDisplayName(sceneId) : scene.name), html);
}

window.moveToScene = moveToScene;
window.showSceneDetail = showSceneDetail;
window._getCultivationRating = _getCultivationRating;
window.checkRandomEvent = checkRandomEvent;
window.triggerMarketVisit = triggerMarketVisit;
window.learnSkillFromScroll = learnSkillFromScroll;
window.getSkillScrollsForSale = getSkillScrollsForSale;
window.createPlayerFromFortune = createPlayerFromFortune;
window.getElementAffinity = getElementAffinity;
window.autoEquipSkills = autoEquipSkills;
window.gainSkillMasteryXp = gainSkillMasteryXp;
window.ensureMasteryFields = ensureMasteryFields;
window.getMasteryLevel = getMasteryLevel;
window.getMasteryBonus = getMasteryBonus;
window.getCombatPowerRank = getCombatPowerRank;
window.unlockSkills = unlockSkills;

// ── 域函数导出 ──
window.getSceneDomain = getSceneDomain;
window.checkDomainAccess = checkDomainAccess;
window.getDomainEntryRequirement = getDomainEntryRequirement;

// 储物戒升级
function upgradeStorageRing() {
  const p = G.player;
  const ring = p.storageRing || { name:'初阶储物戒', capacity: 12, currentLoad: 0, level: 1 };
  if (ring.level >= 5) { addNarrative('储物戒已达满级。', 'system'); return; }
  if (p.stones < ring.upgradeCost) { addNarrative(`灵石不足！升级需要${ring.upgradeCost}灵石。`, 'system'); return; }
  p.stones -= ring.upgradeCost;
  ring.level++;
  const upgrades = {
    2: { name:'中阶储物戒', capacity: 20, cost: 150, desc:'扩容至20格' },
    3: { name:'高阶储物戒', capacity: 30, cost: 400, desc:'扩容至30格' },
    4: { name:'极品储物戒', capacity: 50, cost: 1000, desc:'扩容至50格' },
    5: { name:'上古须弥戒', capacity: 99, cost: 3000, desc:'扩容至99格（最大）' },
  };
  const next = upgrades[ring.level];
  if (next) { ring.name = next.name; ring.capacity = next.capacity; ring.upgradeCost = next.cost; ring.upgradeDesc = next.desc; }
  if (typeof addDailyLogEntry === "function") addDailyLogEntry('market', '升级储物戒至'+ring.name);
  addNarrative(`🔧 储物戒升级成功！${ring.name}：容量 ${ring.capacity} 格`, 'event');
  G.player.eventHistory.push(`储物戒升级至${ring.name}`);
  updateAllUI();
}
window.upgradeStorageRing = upgradeStorageRing;

// ==========================
// 📦 储物箱
// ==========================
function storageBoxAdd(itemData, qty) {
  var p = G.player;
  if (!p.storageBox) p.storageBox = [];
  var existing = p.storageBox.find(function(s){ return s.id === itemData.id; });
  if (existing) { existing.qty += qty; }
  else {
    p.storageBox.push({
      id: itemData.id,
      name: itemData.name,
      type: itemData.type,
      category: itemData.category || '杂物',
      qty: qty,
      value: itemData.value,
      use: itemData.use ? Object.assign({}, itemData.use) : null,
      equipEffect: itemData.equipEffect ? Object.assign({}, itemData.equipEffect) : null,
      herbEffect: itemData.herbEffect || null,
      treasureMap: itemData.treasureMap || false,
      junk: itemData.junk || false,
      rarity: itemData.rarity || 0,
      breakItem: itemData.breakItem || false,
      effects: itemData.effects || null,
      desc: itemData.desc || '',
      _storedAt: G.time ? G.time.day : 0,
    });
  }
  return true;
}
function storageBoxRemove(itemId, qty) {
  var p = G.player;
  if (!p.storageBox) p.storageBox = [];
  var idx = p.storageBox.findIndex(function(s){ return s.id === itemId; });
  if (idx === -1) return false;
  p.storageBox[idx].qty -= qty;
  if (p.storageBox[idx].qty <= 0) p.storageBox.splice(idx, 1);
  return true;
}
function storageBoxMoveToInventory(itemId, qty) {
  var p = G.player;
  var stored = p.storageBox.find(function(s){ return s.id === itemId; });
  if (!stored || stored.qty < qty) { addNarrative('储物箱中没有足够的此物。', 'system'); return false; }
  var itemData = (typeof ITEM_DB !== 'undefined' ? ITEM_DB : []).find(function(d){ return d.id === itemId; });
  if (!itemData) { addNarrative('数据异常。', 'system'); return false; }
  addItemToInventory(itemData, qty);
  storageBoxRemove(itemId, qty);
  if (typeof updateAllUI === 'function') updateAllUI();
  return true;
}
function inventoryMoveToStorageBox(itemId, qty) {
  var p = G.player;
  var inv = p.inventory.find(function(i){ return i.id === itemId; });
  if (!inv || inv.qty < qty) { addNarrative('背包中没有足够的此物。', 'system'); return false; }
  var itemData = (typeof ITEM_DB !== 'undefined' ? ITEM_DB : []).find(function(d){ return d.id === itemId; });
  if (!itemData) { addNarrative('数据异常。', 'system'); return false; }
  storageBoxAdd(itemData, qty);
  p.inventory.forEach(function(it, idx){
    if (it.id === itemId) {
      p.inventory[idx].qty -= qty;
      if (p.inventory[idx].qty <= 0) p.inventory.splice(idx, 1);
    }
  });
  if (typeof updateAllUI === 'function') updateAllUI();
  addNarrative('已存入储物箱。', 'system');
  return true;
}
window.storageBoxAdd = storageBoxAdd;
window.storageBoxRemove = storageBoxRemove;
window.storageBoxMoveToInventory = storageBoxMoveToInventory;
window.inventoryMoveToStorageBox = inventoryMoveToStorageBox;

// ==========================
// 🏯 宗门系统
// ==========================
function joinSect(sectId) {
  var p = G.player;
  var sect = null;
  if (typeof SECT_DB !== 'undefined') sect = SECT_DB.find(function(s) { return s.id === sectId; });
  if (!sect) { addNarrative('没有这个宗门。', 'system'); return; }
  
  if (p.sectId) {
    var curSect = null;
    if (typeof SECT_DB !== 'undefined') curSect = SECT_DB.find(function(s) { return s.id === p.sectId; });
    addNarrative('你已是「' + (curSect ? curSect.name : p.sectId) + '」弟子，不可另投他门。', 'system');
    return;
  }
  
  var req = sect.joinRequirements;
  if (req.realm) {
    var rIdx = typeof parseQiRealm === 'function' ? parseQiRealm(req.realm) : null;
    if (rIdx && (p.qiRealmIndex + 1) < rIdx) {
      addNarrative('「' + sect.name + '」要求修为达到' + req.realm + '，你还差得远。', 'system');
      return;
    }
  }
  if (req.spiritRoot) {
    var hasRoot = p.spiritRoots && p.spiritRoots.indexOf(req.spiritRoot) !== -1;
    if (!hasRoot) {
      addNarrative('「' + sect.name + '」只收' + req.spiritRoot + '灵根的修士，你的灵根不符。', 'system');
      return;
    }
  }
  if (req.attack !== undefined && p.attack < req.attack) {
    addNarrative('「' + sect.name + '」要求攻击力不低于' + req.attack + '，你尚需磨练。', 'system');
    return;
  }
  if (req.bodyRealm !== undefined) {
    var bodyIdx = typeof parseBodyRealm === 'function' ? parseBodyRealm(req.bodyRealm) : null;
    if (bodyIdx && (p.bodyRealmIndex + 1) < bodyIdx) {
      addNarrative('「' + sect.name + '」要求炼体达到' + req.bodyRealm + '重，你的体魄不够。', 'system');
      return;
    }
  }
  
  p.sectId = sect.id;
  p.sectName = sect.name;
  if (!p._sectSkillsLearned) p._sectSkillsLearned = [];
  addNarrative('🏯 你正式加入「' + sect.name + '」！' + sect.desc, 'milestone');
  
  // 入门功法
  if (sect.skills && sect.skills.length > 0) {
    var giftSkillId = sect.skills[0];
    var giftSkill = typeof SKILL_DB !== 'undefined' ? SKILL_DB.find(function(s) { return s.id === giftSkillId; }) : null;
    if (giftSkill && typeof learnSkill === 'function' && !p.skills.find(function(s) { return s.id === giftSkillId; })) {
      learnSkill(giftSkill);
      p._sectSkillsLearned.push(giftSkillId);
      addNarrative('📜 宗门赐你入门功法《' + giftSkill.name + '》。', 'event');
    }
  }
}

function getSectSkillStore(sectId) {
  var p = G.player;
  var sect = typeof SECT_DB !== 'undefined' ? SECT_DB.find(function(s) { return s.id === sectId; }) : null;
  if (!sect || !sect.skills) return [];
  var available = [];
  sect.skills.forEach(function(sid) {
    if (!p._sectSkillsLearned || p._sectSkillsLearned.indexOf(sid) === -1) {
      var sd = typeof SKILL_DB !== 'undefined' ? SKILL_DB.find(function(s) { return s.id === sid; }) : null;
      if (sd) available.push(sd);
    }
  });
  return available;
}

function learnSectSkill(sectId, skillId) {
  var p = G.player;
  if (p.sectId !== sectId) { addNarrative('此功法仅对本门弟子开放。', 'system'); return; }
  if (p._sectSkillsLearned && p._sectSkillsLearned.indexOf(skillId) !== -1) { addNarrative('你已习得此功法。', 'system'); return; }
  var cost = 100;
  if (p.stones < cost) { addNarrative('学习宗门功法需缴纳 ' + cost + ' 灵石。', 'system'); return; }
  p.stones -= cost;
  var sd = typeof SKILL_DB !== 'undefined' ? SKILL_DB.find(function(s) { return s.id === skillId; }) : null;
  if (sd && typeof learnSkill === 'function') {
    learnSkill(sd);
    if (!p._sectSkillsLearned) p._sectSkillsLearned = [];
    p._sectSkillsLearned.push(skillId);
    addNarrative('📜 你习得「' + sd.name + '」！', 'event');
  }
}

// ==========================
// 🔥 场景传承触发
// ==========================
function checkSceneInheritance(sceneId) {
  var p = G.player;
  if (!p) return null;
  
  var triggers = {
    'leiyin_temple': function() {
      if (p.qiRealmIndex >= 8 && !p._gotLeiyinInheritance) {
        p._gotLeiyinInheritance = true;
        var sd = typeof SKILL_DB !== 'undefined' ? SKILL_DB.find(function(s) { return s.id === 'taiyi_jue'; }) : null;
        if (sd && typeof learnSkill === 'function') {
          learnSkill(sd);
          return { title: '雷音传承', text: '古刹地宫中，你触碰了一枚古老的舍利——佛光如潮水般涌入识海！「太一诀」自行运转……', skill: sd.name };
        }
      }
      return null;
    },
    'duzhang_swamp': function() {
      var isWater = p.spiritRoots && p.spiritRoots.indexOf('水') !== -1;
      if (isWater && p.qiRealmIndex >= 5 && !p._gotSwampInheritance) {
        p._gotSwampInheritance = true;
        var sd = typeof SKILL_DB !== 'undefined' ? SKILL_DB.find(function(s) { return s.id === 'xuanwu_ji'; }) : null;
        if (sd && typeof learnSkill === 'function') {
          learnSkill(sd);
          return { title: '沼泽传承', text: '毒瘴深处，一尊玄武虚影缓缓浮现——「玄武祭」心法在水中刻入你的灵台。', skill: sd.name };
        }
      }
      return null;
    },
    'guji_ruins': function() {
      var isMetal = p.spiritRoots && p.spiritRoots.indexOf('金') !== -1;
      if (isMetal && p.qiRealmIndex >= 6 && !p._gotGuInheritance) {
        p._gotGuInheritance = true;
        var sd = typeof SKILL_DB !== 'undefined' ? SKILL_DB.find(function(s) { return s.id === 'taiyi_jue'; }) : null;
        if (sd && typeof learnSkill === 'function') {
          learnSkill(sd);
          return { title: '古城传承', text: '古城遗迹深处，一柄锈迹斑斑的古剑震颤不已——「太乙诀」剑意灌顶而入！', skill: sd.name };
        }
      }
      return null;
    },
  };
  
  var trigger = triggers[sceneId];
  if (trigger) return trigger();
  return null;
}

// 场景→宗门加入检查
function checkSectJoinScene(sceneId) {
  var map = { 'lieyan_valley': 'tianhuo', 'bibo_lake': 'tianshui' };
  var sid = map[sceneId];
  if (!sid) return null;
  var sect = typeof SECT_DB !== 'undefined' ? SECT_DB.find(function(s) { return s.id === sid; }) : null;
  return sect || null;
}

window.joinSect = joinSect;
window.learnSectSkill = learnSectSkill;
window.getSectSkillStore = getSectSkillStore;
window.checkSceneInheritance = checkSceneInheritance;
window.checkSectJoinScene = checkSectJoinScene;
