// ==========================
// ⚔️ 装备分级掉落系统 v1
// 不同等级的怪物掉落不同品阶的装备，提升战斗爽感
// ==========================

// ── 装备品阶 ──
const EQUIP_QUALITIES = {
  '凡品': { color:'#9a9a9a', emoji:'⬜', mult:1.0, label:'凡品' },
  '灵品': { color:'#4caf50', emoji:'🟩', mult:1.3, label:'灵品' },
  '地品': { color:'#2196f3', emoji:'🟦', mult:1.7, label:'地品' },
  '天品': { color:'#9c27b0', emoji:'🟪', mult:2.2, label:'天品' },
  '圣品': { color:'#ff9800', emoji:'🟨', mult:3.0, label:'圣品' },
};

// ── 新装备库（按品阶+部位组织）──
// weapon 武器 | armor 衣甲 | head 头冠 | accessory 饰品 | shoes 鞋履
const EQUIP_DROP_POOL = {
  // ═══════ 凡品（低级怪 0-2级）═══════
  '凡品': {
    weapon: [
      { id:'mugun', name:'木棍', desc:'路边捡的硬木棍，聊胜于无。', value:5, equipEffect:{ attackBonus:2 } },
      { id:'shidao', name:'石刀', desc:'粗石打磨的刀，勉强能砍。', value:8, equipEffect:{ attackBonus:3 } },
    ],
    armor: [
      { id:'mamian_yi', name:'麻布衣', desc:'粗麻织就的衣裳，挡不了多少刀剑。', value:6, equipEffect:{ defenseBonus:2, hpBonus:5 } },
      { id:'cao_xie', name:'草鞋', desc:'茅草编的鞋，聊胜于无。', value:3, equipEffect:{ dodge:0.01 } },
    ],
    head: [
      { id:'butou_jin', name:'布头巾', desc:'普通布巾，束发挡尘。', value:4, equipEffect:{ qiRegen:1 } },
    ],
    accessory: [
      { id:'muzhi_jie', name:'木戒指', desc:'粗糙的木戒指，没有特别的力量。', value:5, equipEffect:{ qiRegen:1 } },
    ],
    shoes: [
      { id:'cao_xie', name:'草鞋', desc:'茅草编的鞋，轻便但容易坏。', value:3, equipEffect:{ dodge:0.01 } },
    ],
  },
  // ═══════ 灵品（中级怪 3-5级）═══════
  '灵品': {
    weapon: [
      { id:'jingang_quan', name:'精钢拳套', desc:'精钢打造的拳套，拳拳到肉。', value:40, equipEffect:{ attackBonus:10 } },
      { id:'lvyao_gong', name:'绿腰弓', desc:'翠竹与牛筋制成的弓，射程极远。', value:55, equipEffect:{ attackBonus:12, dodge:0.02 } },
      { id:'hanfeng_ci', name:'寒锋刺', desc:'寒铁打造的短刺，锋利异常。', value:45, equipEffect:{ attackBonus:11, critRate:0.03 } },
    ],
    armor: [
      { id:'qingyi', name:'青衣', desc:'修士常穿的青色道袍，灵光内蕴。', value:50, equipEffect:{ defenseBonus:8, qiRegen:2 } },
      { id:'su_jia', name:'素甲', desc:'素色皮甲，轻便而坚韧。', value:45, equipEffect:{ defenseBonus:9 } },
      { id:'baisha_qun', name:'白纱裙', desc:'素雅的白纱裙，衣袂飘飘。', value:48, equipEffect:{ defenseBonus:6, mood:2 } },
    ],
    head: [
      { id:'faguan', name:'法冠', desc:'蕴含灵力的法冠，凝神静气。', value:40, equipEffect:{ qiRegen:3, wisdomBonus:2 } },
    ],
    accessory: [
      { id:'lingyu_pei', name:'灵玉佩', desc:'灵气充沛的玉佩，养神润体。', value:60, equipEffect:{ qiRegen:4, wisdomBonus:3 } },
      { id:'tongxin_jie', name:'同心戒', desc:'成对的戒指，据说能找到有缘人。', value:55, equipEffect:{ maxQiBonus:20 } },
    ],
    shoes: [
      { id:'yunbu_xie', name:'云布鞋', desc:'轻云织就的布鞋，步履轻盈。', value:35, equipEffect:{ dodge:0.04 } },
      { id:'tiexue', name:'铁靴', desc:'铁片包边的战靴，稳如磐石。', value:38, equipEffect:{ defenseBonus:5 } },
    ],
  },
  // ═══════ 地品（高级怪 6-8级）═══════
  '地品': {
    weapon: [
      { id:'zixiao_jian', name:'紫霄剑', desc:'紫气东来，剑出如虹。', value:150, equipEffect:{ attackBonus:25, critRate:0.04 } },
      { id:'huofeng_fu', name:'火凤斧', desc:'斧身燃着不灭的火焰。', value:160, equipEffect:{ attackBonus:28, elementDamage:{ fire:0.08 } } },
      { id:'youming_suo', name:'幽冥锁', desc:'幽冥铁打造的锁链，缠住敌人魂魄。', value:145, equipEffect:{ attackBonus:22, qiDrain:0.04 } },
    ],
    armor: [
      { id:'zishen_jia', name:'紫鳞甲', desc:'紫鳞编制的战甲，隐隐有龙气。', value:160, equipEffect:{ defenseBonus:20, hpBonus:30 } },
      { id:'liuxian_qun', name:'流仙裙', desc:'流光溢彩的仙裙，不染纤尘。', value:150, equipEffect:{ defenseBonus:15, qiRegen:5, dodge:0.03 } },
      { id:'jinwen_pao', name:'金纹袍', desc:'金线绣纹的法袍，华贵而坚韧。', value:155, equipEffect:{ defenseBonus:18, maxQiBonus:30 } },
    ],
    head: [
      { id:'ziyun_guan', name:'紫云冠', desc:'紫云凝成的头冠，灵光护顶。', value:140, equipEffect:{ qiRegen:6, maxQiBonus:25 } },
    ],
    accessory: [
      { id:'qiankun_jie', name:'乾坤戒', desc:'内含乾坤的宝戒，可纳天地灵气。', value:180, equipEffect:{ maxQiBonus:50, cultivationSpeed:0.08 } },
      { id:'tiandi_pei', name:'天地佩', desc:'天地灵气凝成的玉佩，佩戴者运势亨通。', value:175, equipEffect:{ qiRegen:8, wisdomBonus:5, exploreBonus:0.05 } },
    ],
    shoes: [
      { id:'zhuixue_xie', name:'追雪靴', desc:'踏雪无痕的轻靴，身法如电。', value:140, equipEffect:{ dodge:0.08, qiCost:0.05 } },
      { id:'wankun_xue', name:'万钧靴', desc:'重若万钧的战靴，一步一个脚印。', value:145, equipEffect:{ defenseBonus:10, hpBonus:20 } },
    ],
  },
  // ═══════ 天品（BOSS/高级精英）═══════
  '天品': {
    weapon: [
      { id:'tianpo_jian', name:'天破剑', desc:'一剑破天，万法皆空。', value:500, equipEffect:{ attackBonus:50, critRate:0.08 } },
      { id:'jiuyou_zhang', name:'九幽杖', desc:'九幽之木所制，杖身萦绕幽冥之气。', value:480, equipEffect:{ attackBonus:45, maxQiBonus:60 } },
      { id:'leiguang_gong', name:'雷光弓', desc:'以雷光为弦的宝弓，箭出如雷。', value:490, equipEffect:{ attackBonus:48, dodge:0.08, elementDamage:{ lightning:0.1 } } },
    ],
    armor: [
      { id:'tianxu_jia', name:'天墟甲', desc:'天外陨铁锻造，坚不可摧。', value:520, equipEffect:{ defenseBonus:35, hpBonus:80, elementResist:{ all:0.1 } } },
      { id:'yueguang_qun', name:'月光裙', desc:'月光织成的仙裙，清冷绝尘。', value:500, equipEffect:{ defenseBonus:28, qiRegen:10, dodge:0.05, maxQiBonus:40 } },
      { id:'canglong_pao', name:'苍龙袍', desc:'苍龙鳞甲织就的袍服，龙威赫赫。', value:510, equipEffect:{ defenseBonus:32, attackBonus:10, hpBonus:50 } },
    ],
    head: [
      { id:'tianjun_guan', name:'天君冠', desc:'天帝之冠，万法不侵。', value:480, equipEffect:{ qiRegen:12, maxQiBonus:60, defenseBonus:10 } },
    ],
    accessory: [
      { id:'hundun_jie', name:'混沌戒', desc:'混沌初开时的宝物，蕴含大道之力。', value:600, equipEffect:{ attackBonus:15, maxQiBonus:80, cultivationSpeed:0.15 } },
      { id:'taixu_pei', name:'太虚佩', desc:'太虚之气凝成，佩戴者与天地共鸣。', value:580, equipEffect:{ qiRegen:15, wisdomBonus:10, exploreBonus:0.1 } },
    ],
    shoes: [
      { id:'tianyi_xie', name:'天翼靴', desc:'天翼羽毛编织的靴子，一步千里。', value:480, equipEffect:{ dodge:0.15, qiCost:0.1 } },
      { id:'kui_niu_xue', name:'夔牛靴', desc:'夔牛皮制成的战靴，踏地生雷。', value:490, equipEffect:{ defenseBonus:15, attackBonus:8, hpBonus:30 } },
    ],
  },
  // ═══════ 圣品（隐藏/终极BOSS）═══════
  '圣品': {
    weapon: [
      { id:'tianjie_jian', name:'天劫剑', desc:'历经天劫淬炼的神剑，一剑可斩星辰。', value:1500, equipEffect:{ attackBonus:100, critRate:0.15 } },
      { id:'panlong_ji', name:'盘龙戟', desc:'盘龙缠绕的战戟，挥动间龙吟阵阵。', value:1480, equipEffect:{ attackBonus:95, defenseBonus:20, hpBonus:100 } },
    ],
    armor: [
      { id:'shenhuang_jia', name:'神凰甲', desc:'神凰涅槃时留下的羽毛织成，浴火重生。', value:1600, equipEffect:{ defenseBonus:60, hpBonus:150, elementResist:{ all:0.2 } } },
      { id:'shengming_qun', name:'生命裙', desc:'生命古树的树叶织成，蕴含无尽生机。', value:1550, equipEffect:{ defenseBonus:50, hpRegen:15, qiRegen:15, maxQiBonus:80 } },
    ],
    head: [
      { id:'tiandao_guan', name:'天道冠', desc:'天道之力凝聚的冠冕，镇压万法。', value:1500, equipEffect:{ qiRegen:20, maxQiBonus:100, defenseBonus:15, wisdomBonus:15 } },
    ],
    accessory: [
      { id:'chuxu_jie', name:'初墟戒', desc:'开天辟地前的宝物，蕴含混沌之力。', value:1800, equipEffect:{ attackBonus:25, maxQiBonus:120, cultivationSpeed:0.25, critRate:0.05 } },
    ],
    shoes: [
      { id:'shenxing_xie', name:'神行靴', desc:'上古神兽之皮所制，快过流光。', value:1500, equipEffect:{ dodge:0.25, qiCost:0.15, exploreBonus:0.15 } },
    ],
  },
};

// ── 怪物强度 → 掉落品阶 ──
// 根据怪物攻击力/血量判断强度档位
function getMonsterEquipTier(monster) {
  if (!monster) return '凡品';
  const power = (monster.attack || 0) * 2 + (monster.hp || 0) * 0.3;
  if (monster.isBoss || monster.isElite || power >= 300) return '天品';
  if (power >= 150) return '地品';
  if (power >= 60) return '灵品';
  return '凡品';
}

// ── 按场景深度加成（越深层越容易掉好装备）──
function getSceneEquipLuck() {
  try {
    const scene = getSceneData(G.currentScene);
    if (scene && scene.qiLevel) return 1 + (scene.qiLevel - 3) * 0.04;
  } catch(e) {}
  return 1.0;
}

// ── 获取一件掉落装备（带品质闪光）──
function rollEquipDrop(monster) {
  try {
    if (typeof ITEM_DB === 'undefined') return null;
    const tier = getMonsterEquipTier(monster);
    const sceneLuck = getSceneEquipLuck();
    
    // 品质提升概率（场景灵气加成）
    const tierOrder = ['凡品','灵品','地品','天品','圣品'];
    let tierIdx = tierOrder.indexOf(tier);
    if (tierIdx < 0) tierIdx = 0;
    // 小概率上跳一级（场景加成+稀有运气）
    const upgradeChance = Math.min(0.12, 0.05 + (sceneLuck - 1) * 0.5) + ((G.player && G.player.wisdom) ? (G.player.wisdom - 50) * 0.001 : 0);
    if (Math.random() < upgradeChance && tierIdx < 4) tierIdx++;
    
    const tierName = tierOrder[tierIdx];
    const pool = EQUIP_DROP_POOL[tierName];
    if (!pool) return null;
    
    // 随机部位（武器/衣甲/头冠/饰品/鞋履）
    const slots = Object.keys(pool);
    const slot = slots[Math.floor(Math.random() * slots.length)];
    const items = pool[slot];
    if (!items || items.length === 0) return null;
    
    const item = items[Math.floor(Math.random() * items.length)];
    // 生成存档用的装备数据（带品质标记）
    // 🔧 唯一id：掉落装备必须独立存放，防止与背包同名物品合并丢失品质
    const uid = item.id + '_d' + Date.now() + Math.floor(Math.random() * 1000);
    // 💎 孔位：凡品0 / 灵品1 / 地品1 / 天品2 / 圣品3（品质越高孔越多）
    const socketCount = { '凡品':0, '灵品':1, '地品':1, '天品':2, '圣品':3 }[tierName] || 0;
    return {
      id: uid,
      name: tierName + '·' + item.name,
      desc: '[' + tierName + '] ' + item.desc,
      value: Math.round(item.value * (EQUIP_QUALITIES[tierName] ? EQUIP_QUALITIES[tierName].mult : 1)),
      category: '装备',
      type: '法器',
      quality: tierName,
      equipEffect: item.equipEffect,
      sockets: socketCount,     // 💎 孔位数
      socketed: [],             // 💎 已镶嵌宝石id
      _equipSlot: slot,
      _fromDrop: true,
      _baseId: item.id
    };
  } catch(e) { return null; }
}

// ── 战斗胜利后调用：按概率掉落装备 ──
function maybeDropEquip(monster) {
  try {
    if (!monster || typeof G === 'undefined' || !G.player) return null;
    // 基础掉率：普通怪 8%，精英 20%，BOSS 40%（境界越高越容易出）
    const realmLuck = 1 + (G.player.qiRealmIndex || 0) * 0.02;
    let chance = (monster.isBoss ? 0.4 : monster.isElite ? 0.2 : 0.08) * realmLuck;
    chance = Math.min(0.8, chance);
    if (Math.random() >= chance) return null;
    
    const itemData = rollEquipDrop(monster);
    if (!itemData) return null;
    if (typeof addItemToInventory === 'function') addItemToInventory(itemData, 1);
    return itemData;
  } catch(e) { return null; }
}

window.EQUIP_DROP_POOL = EQUIP_DROP_POOL;
window.EQUIP_QUALITIES = EQUIP_QUALITIES;
window.rollEquipDrop = rollEquipDrop;
window.maybeDropEquip = maybeDropEquip;
window.getMonsterEquipTier = getMonsterEquipTier;
