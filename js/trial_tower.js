// === 唯我独仙 · 试炼塔 ===
// 🏛️ 开启条件：抵达幽冥界 试炼之塔 场景，触发塔门互动
// 📅 每日重置：每天可从第1层重新挑战
// 每层敌人逐步增强，每10层突破丹药保底
// 层数越高修为奖励越丰厚
// =============================

var TOWER_FLOORS = [];

function initTowerFloors() { return true; }

function ensureFloor(floorNum) {
  while (TOWER_FLOORS.length < floorNum) TOWER_FLOORS.push(null);
  if (!TOWER_FLOORS[floorNum - 1]) TOWER_FLOORS[floorNum - 1] = generateFloor(floorNum);
  return TOWER_FLOORS[floorNum - 1];
}

// ── 解锁判定（🔧 2026-08-04：不再要求先找到塔的位置——入口恒定，点塔自动传送）──
function isTowerUnlocked() {
  var p = G.player;
  if (!p) return false;
  if ((p.qiRealmIndex || 0) + 1 < 4) return false;
  return true;
}

function getUnlockReason() {
  var p = G.player;
  if (!p) return '需要先创建角色。';
  if ((p.qiRealmIndex || 0) + 1 < 4) return '🧘 炼气四层以上方能承受塔内的威压。';
  return null;
}

// ── 塔状态 ──
function getTowerState() {
  var p = G.player;
  if (!p._towerState) {
    p._towerState = {
      highestFloor: 0,       // 历史最高
      todayFloor: 0,          // 今日已达层数
      towerDay: -1,           // 上次爬塔的游戏日
      _climbing: false,
      _totalQiGained: 0,
      _totalBodyGained: 0,
      _inTowerBattle: false,  // 战斗中标记
      // 🔧 2026-08-03：每7天刷新机制
      refreshDay: -1,         // 上次刷新所在游戏日
      cycleSeed: 1,           // 当前周期种子（刷新后+1，用于重新生成楼层）
      // 🔧 2026-08-03：首次挑战必须手动——自动刷塔上限
      manualHighestFloor: 0,  // 手动通关的最高层（永久保留，不随每日/7天刷新重置）
    };
  }
  return p._towerState;
}

// 检查每日重置
function checkTowerDailyReset() {
  var ts = getTowerState();
  var currentDay = G.time ? G.time.day : 0;
  if (ts.towerDay !== currentDay && !ts._climbing) {
    ts.todayFloor = 0;
    ts._totalQiGained = 0;
    ts._totalBodyGained = 0;
    ts.towerDay = currentDay;
  }
}

// 🔧 2026-08-03：每7天可刷新一次（重置楼层+最高纪录，奖励重新刷）
// 返回 { can:true } 或 { can:false, reason, daysLeft }
function canRefreshTower() {
  var ts = getTowerState();
  if (ts._climbing || ts._inTowerBattle) {
    return { can: false, reason: '⏳ 正在塔内，无法刷新。' };
  }
  var currentDay = G.time ? G.time.day : 0;
  var lastDay = (ts.refreshDay === -1 || ts.refreshDay === undefined) ? 0 : ts.refreshDay;
  var daysSince = currentDay - lastDay;
  if (daysSince < 7) {
    return { can: false, reason: '⏳ 试炼塔每7天刷新一次，还需等待 ' + (7 - daysSince) + ' 天。', daysLeft: 7 - daysSince };
  }
  return { can: true, daysLeft: 0 };
}

function refreshTower() {
  var access = canRefreshTower();
  if (!access.can) {
    addNarrative(access.reason, 'system');
    return false;
  }
  var p = G.player;
  var ts = getTowerState();
  // 重置状态
  ts.highestFloor = 0;
  ts.todayFloor = 0;
  ts._totalQiGained = 0;
  ts._totalBodyGained = 0;
  ts._climbing = false;
  ts._inTowerBattle = false;
  ts.refreshDay = G.time ? G.time.day : 0;
  ts.cycleSeed = (ts.cycleSeed || 1) + 1;
  // 清空楼层，重新生成（不同周期内容不同）
  TOWER_FLOORS.length = 0;
  addNarrative('🏛️ 试炼塔灵光流转，塔内楼层重新洗牌——新的试炼开始了！', 'event');
  return true;
}

// 检查能否进入
function canEnterTower() {
  var p = G.player;
  if (!p) return { can: false, reason: '无角色数据。' };
  
  // 🔧 2026-08-03：不再要求身在试炼塔场景——只要地图跑通过（访问过 gate_nether_divine）
  //    即可从任何地方直接进入（进入时自动传送至试炼塔）
  if (!isTowerUnlocked()) {
    return { can: false, reason: getUnlockReason() || '条件不足，无法进入试炼塔。' };
  }
  
  var ts = getTowerState();
  if (ts._inTowerBattle) {
    return { can: false, reason: '⏳ 你正在塔内战斗，无法重复进入。' };
  }
  
  return { can: true };
}

// ── 楼层生成 ──
function generateFloor(floorNum) {
  var p = G.player;
  if (!p) return null;

  // 🔧 2026-08-03：周期种子——刷新后楼层内容/掉落变化（同一周期内稳定）
  var ts = typeof getTowerState === 'function' ? getTowerState() : null;
  var cycleSeed = (ts && ts.cycleSeed) || 1;
  // 基于 floorNum+seed 的确定性伪随机
  var seededRand = function() {
    var x = Math.sin(floorNum * 127.1 + cycleSeed * 311.7) * 43758.5453;
    return x - Math.floor(x);
  };

  var baseCp = p.combatPower || 100;
  var difficultyMult = Math.pow(1.08, floorNum - 1);

  var monsterCount = 1 + Math.floor(floorNum / 10);
  if (monsterCount > 5) monsterCount = 5;

  var tierBase = Math.floor((floorNum - 1) / 10);
  var subFloor = ((floorNum - 1) % 10) + 1;

  var tierNames = [
    '初窥', '凝气', '通脉', '筑基', '金丹',
    '元婴', '化神', '大乘', '渡劫', '问道',
    '太虚', '混沌', '鸿蒙', '无上', '永恒'
  ];
  var tierName = tierNames[Math.min(tierBase, tierNames.length - 1)];
  var floorName = tierName + '境·第' + subFloor + '关';

  var isBoss = (floorNum % 10 === 0);

  var monsters = [];
  var affixPool = [
    { name:'铁甲', hpMul:1.4, attMul:0.9, defMul:1.5 },
    { name:'狂暴', hpMul:0.9, attMul:1.4, defMul:0.8 },
    { name:'影遁', hpMul:0.8, attMul:1.2, defMul:0.7 },
    { name:'坚岩', hpMul:1.3, attMul:0.8, defMul:1.6 },
    { name:'雷怒', hpMul:1.0, attMul:1.35, defMul:0.9 },
    { name:'炎魔', hpMul:1.1, attMul:1.3, defMul:1.0 },
    { name:'冰霜', hpMul:1.2, attMul:0.9, defMul:1.3 },
    { name:'虚空', hpMul:0.7, attMul:1.5, defMul:0.6 },
  ];

  var namePool = [
    '石傀', '铁甲兽', '风刃狼', '寒冰蟒', '烈焰狮',
    '雷纹豹', '银甲卫', '黑风煞', '金瞳鹰', '玄铁人',
    '紫电貂', '雾隐蛇', '天罡虎', '地煞蝎', '星辉兽',
    '九尾狐', '战傀', '幽冥龙', '虚空兽', '混沌蛇',
    '天罚使者', '太古龙魂', '道化身', '不朽之影', '太虚古龙',
    '混沌巨兽', '鸿蒙道灵', '无上真仙', '永恒之主'
  ];

  for (var mi = 0; mi < monsterCount; mi++) {
    // 🔧 周期种子参与词缀/命名选择（刷新后同层怪物不同）
    var affixPick = Math.floor(seededRand() * affixPool.length);
    var namePick = Math.floor(seededRand() * namePool.length);
    var affix = affixPool[affixPick];
    var baseName = isBoss
      ? ['BOSS·' + namePool[namePick], '★' + namePool[namePick], '霸主·' + namePool[namePick]][Math.floor(seededRand() * 3)]
      : namePool[namePick];

    var monsterName = affix.name + baseName;
    var hpMul = isBoss ? 2.0 : 1.0;
    var attMul = isBoss ? 1.5 : 1.0;

    var baseHp = 50 + floorNum * 12;
    var baseAtt = 8 + floorNum * 1.8;
    var baseDef = 3 + floorNum * 1.2;

    monsters.push({
      name: monsterName,
      hp: Math.round(baseHp * difficultyMult * affix.hpMul * hpMul),
      attack: Math.round(baseAtt * difficultyMult * affix.attMul * attMul),
      defense: Math.round(baseDef * difficultyMult * affix.defMul * hpMul),
      isBoss: isBoss,
    });
  }

  var rewards = { cultivationQi: 0, cultivationBody: 0, stones: 0, skillChance: 0, skillCount: 0, items: [] };

  var qiReward = Math.round(15 * floorNum * Math.pow(1.02, floorNum));
  var bodyReward = Math.round(10 * floorNum * Math.pow(1.02, floorNum));
  rewards.cultivationQi = qiReward;
  rewards.cultivationBody = bodyReward;
  rewards.stones = 20 + floorNum * 8;

  // 🔧 2026-08-03：层数越高，掉落的同级好东西越多越高级
  // 按层数分段的奖励池（每段对应一个境界：气修丹 + 炼体丹 + 高阶材料）
  var tier = Math.floor((floorNum - 1) / 10);  // 0=练气段, 1=筑基段, 2=金丹段...
  var tierPools = [
    // 练气段（1-10层）
    { qi:'poqi_dan', body:'duanti_dan', mat:['hgc_grass','juli_dan','zhixue_san'], equip:null },
    // 筑基段（11-20层）
    { qi:'zhuji_dan', body:'duanti_dan', mat:['lingmai_jing','huojing_cao','tiegu_cao','baihe_lily'], equip:'cuzhi_bingqi' },
    // 金丹段（21-30层）
    { qi:'jindan_dan', body:'tongpi_dan', mat:['leichi_jingtie','zhushen_sui','xuelian','lingzu_cuijian'], equip:'tiexiu_jian' },
    // 元婴段（31-40层）
    { qi:'yuanying_dan', body:'tiegu_dan', mat:['leijiao_long','yunhai_lu','qiannian_lingzhi','lingmai_jing'], equip:'qingfeng_jian' },
    // 化神段（41-50层）
    { qi:'huashen_dan', body:'yinxiue_dan', mat:['huangji_gu','zhushen_sui','tiandao_bei','jiuyang_ling'], equip:'xuanhu_fu' },
    // 大乘段（51-60层）
    { qi:'dacheng_dan', body:'jinshen_dan', mat:['tiandao_bei','jiuyang_ling','leichi_jingtie','yunhai_longjing'], equip:'liehuo_dao' },
    // 渡劫段（61-70层）
    { qi:'dujie_dan', body:'yusui_dan', mat:['zhushen_sui','huangji_gu','xuanhu_fu','tiancan_pao'], equip:'hanbing_jian' },
    // 渡劫后（71层+）
    { qi:'dujie_dan', body:'bumie_dan', mat:['tiandao_bei','yunhai_longjing','xuanwu_jia','honglian_jian'], equip:'zhanlong_jian' },
  ];
  var pool = tierPools[Math.min(tier, tierPools.length - 1)];
  var tierQty = 1 + Math.floor(floorNum / 10);  // 层数越高掉得越多（10层=2个, 20层=3个, 30层=4个...）

  // 🔧 2026-08-04：法宝温养材料池（本命法宝升级材料，化神段后参与掉落）
  // 雷池精铁/云海露/云鲸脂/九阳灵髓/铸神髓/天道碑拓/雷蛟内丹
  var benmingMats = ['leichi_jingtie','yunhai_lu','yunhai_longjing','jiuyang_ling','zhushen_sui','tiandao_bei','leijiao_long'];

  // 🔧 2026-08-04：塔炼体丹改按玩家炼体境界动态掉（不再按层数固定），
  //    玉髓境爬 71+ 层也能拿玉髓丹/金身丹，突破不再卡丹
  //    返回 { name, qty } 或 null（境界生成 + 满10/低于境界过滤）
  function towerBodyPillDrop() {
    try {
      var p = G.player;
      if (!p || typeof p.bodyRealmIndex === 'undefined') return null;
      var idx = p.bodyRealmIndex || 0;
      if (idx < 9) return null;
      var req = (typeof BODY_BREAKTHROUGH_REQS !== 'undefined') ? BODY_BREAKTHROUGH_REQS[idx] : null;
      if (!req || !req.items || req.items.length === 0) return null;
      var drops = [];
      req.items.forEach(function(rIt) {
        if (!rIt || !rIt.id) return;
        if (typeof shouldFilterPillDrop === 'function' && shouldFilterPillDrop(rIt.id)) return;
        var owned = 0;
        (p.inventory || []).forEach(function(x){ if (x.id === rIt.id) owned += (x.qty || 1); });
        var needQty = rIt.qty || 1;
        var thisChance = owned >= needQty ? 0.5 : 1.0;  // 缺口大必掉，已满足 50%
        if (Math.random() >= thisChance) return;
        var qty = 1 + Math.floor(Math.random() * (isBoss ? 2 : 1));
        drops.push({ id: rIt.id, qty: qty });
      });
      return drops.length > 0 ? drops : null;
    } catch(e) { return null; }
  }

  // 🔧 2026-08-04：塔必出法宝进阶材料（按当前品阶缺口）——
  //    宝器进阶需 雷池精铁×3+云鲸脂×2+九阳灵髓×1，塔每层必掉缺口材料
  function towerBenmingMatDrop(isBoss) {
    try {
      var p = G.player;
      if (!p || !p.benming || !p.benming.unlocked) return [];
      var nextBreak = (typeof BENMING_UPGRADE !== 'undefined' && BENMING_UPGRADE.break)
        ? BENMING_UPGRADE.break[p.benming.rankIndex + 1] : null;
      if (!nextBreak || !nextBreak.need) return [];
      var drops = [];
      nextBreak.need.forEach(function(nd) {
        if (!nd || !nd.id) return;
        // 已满足需求数量则不再必出（仍小概率掉）
        var owned = 0;
        (p.inventory || []).forEach(function(x){ if (x.id === nd.id) owned += (x.qty || 1); });
        var needQty = nd.qty || 1;
        if (owned >= needQty && Math.random() < 0.7) return;  // 已满足，70%跳过
        var qty = isBoss ? needQty : Math.max(1, Math.min(needQty, 1 + Math.floor(Math.random() * 2)));
        drops.push({ id: nd.id, qty: qty });
      });
      return drops;
    } catch(e) { return []; }
  }

  // 普通层：对应境界的丹药/材料（化神段后必掉，数量随层数提升）
  var normalChance = Math.min(0.95, 0.25 + tier * 0.1);  // 练气段25% → 每10层+10% → 95%封顶
  // 化神段（tier>=4）后普通层必掉：突破丹+法宝材料，不再赌概率
  if (!isBoss) {
    if (tier >= 4) {
      // 🔧 化神后：每层稳定产出突破丹 + 大概率法宝材料/装备
      var qiPill = pool.qi;
      var bodyPill = pool.body;
      // 气修丹必掉（量随层数）
      rewards.items.push({ id: qiPill, qty: Math.min(tierQty + 1, 5) });
      // 炼体丹 70% 掉（🔧 改为按玩家境界动态：玉髓境掉玉髓/金身，不灭体掉不灭/玉髓…）
      if (Math.random() < 0.7) {
        var dynBody = towerBodyPillDrop();
        if (dynBody && dynBody.length > 0) {
          dynBody.forEach(function(d){ rewards.items.push({ id: d.id, qty: d.qty }); });
        } else if (typeof shouldFilterPillDrop !== 'function' || !shouldFilterPillDrop(bodyPill)) {
          rewards.items.push({ id: bodyPill, qty: Math.min(tierQty, 4) });
        }
      }
      // 🔧 2026-08-04：法宝进阶材料必掉（雷池精铁/云鲸脂/九阳灵髓等缺口材料）——塔必出
      var dynBmMats = towerBenmingMatDrop(false);
      if (dynBmMats && dynBmMats.length > 0) {
        dynBmMats.forEach(function(db){ rewards.items.push({ id: db.id, qty: db.qty }); });
      }
      // 法宝材料：50% 概率掉 1-2 种（每种 2-4 个）
      if (Math.random() < 0.5) {
        var bmCount = 1 + Math.floor(Math.random() * 2);
        for (var bmi = 0; bmi < bmCount; bmi++) {
          var bm = benmingMats[Math.floor(Math.random() * benmingMats.length)];
          rewards.items.push({ id: bm, qty: 2 + Math.floor(Math.random() * 3) });
        }
      }
      // 高阶材料 30% 掉
      if (Math.random() < 0.3) {
        var mat = pool.mat[Math.floor(Math.random() * pool.mat.length)];
        if (!(typeof shouldFilterAutoDrop === 'function' && shouldFilterAutoDrop(mat))) {
          rewards.items.push({ id: mat, qty: Math.min(tierQty + 1, 4) });
        }
      }
    } else if (Math.random() < normalChance) {
      var roll = Math.random();
      if (roll < 0.5) {
        // 对应境界突破丹（气修）
        rewards.items.push({ id: pool.qi, qty: Math.min(tierQty, 3) });
      } else if (roll < 0.8) {
        // 对应境界炼体丹
        rewards.items.push({ id: pool.body, qty: Math.min(tierQty, 3) });
      } else {
        // 高阶材料
        var mat = pool.mat[Math.floor(Math.random() * pool.mat.length)];
        if (!(typeof shouldFilterAutoDrop === 'function' && shouldFilterAutoDrop(mat))) {
          rewards.items.push({ id: mat, qty: Math.min(tierQty + 1, 4) });
        }
      }
    }
  }

  if (isBoss) {
    // BOSS 层：双修突破丹必掉（气修 + 炼体），数量随层数增加
    rewards.items.push({ id: pool.qi, qty: Math.min(tierQty + 2, 6) });
    // 🔧 炼体丹改按玩家境界动态（缺口大的必掉）
    var dynBodyBoss = towerBodyPillDrop();
    if (dynBodyBoss && dynBodyBoss.length > 0) {
      dynBodyBoss.forEach(function(d){ rewards.items.push({ id: d.id, qty: d.qty + Math.min(tierQty, 3) }); });
    } else if (typeof shouldFilterPillDrop !== 'function' || !shouldFilterPillDrop(pool.body)) {
      rewards.items.push({ id: pool.body, qty: Math.min(tierQty + 2, 6) });
    }
    // 高阶材料额外掉落（BOSS 必掉 2 种）
    var mat2 = pool.mat[Math.floor(Math.random() * pool.mat.length)];
    if (!(typeof shouldFilterAutoDrop === 'function' && shouldFilterAutoDrop(mat2))) {
      rewards.items.push({ id: mat2, qty: Math.min(tierQty + 2, 5) });
    }
    var mat3 = pool.mat[Math.floor(Math.random() * pool.mat.length)];
    if (!(typeof shouldFilterAutoDrop === 'function' && shouldFilterAutoDrop(mat3))) {
      rewards.items.push({ id: mat3, qty: Math.min(tierQty + 1, 4) });
    }
    // 🔧 2026-08-04：法宝进阶材料必掉（BOSS 给足量：雷池精铁×3/云鲸脂×2/九阳灵髓×1）——塔必出
    if (tier >= 4) {
      var dynBmBoss = towerBenmingMatDrop(true);
      if (dynBmBoss && dynBmBoss.length > 0) {
        dynBmBoss.forEach(function(db2){ rewards.items.push({ id: db2.id, qty: db2.qty }); });
      }
      // 法宝材料：化神段后 BOSS 必掉 2-3 种（每种 3-5 个）——升本命物核心来源
      var bmBossCount = 2 + Math.floor(Math.random() * 2);
      for (var bmi2 = 0; bmi2 < bmBossCount; bmi2++) {
        var bm2 = benmingMats[Math.floor(Math.random() * benmingMats.length)];
        rewards.items.push({ id: bm2, qty: 3 + Math.floor(Math.random() * 3) });
      }
    }
    // 装备掉落（对应境界，化神后必掉）
    if (pool.equip) {
      // 🔧 2026-08-04：化神后固定装备（pool.equip 是无槽位初始装）不再掉落
      var eqFiltered = (typeof shouldFilterAutoDrop === 'function') ? shouldFilterAutoDrop(pool.equip) : false;
      if (!eqFiltered) {
        var equipChance = (tier >= 4) ? 0.85 : 0.5 + tier * 0.05;
        if (Math.random() < equipChance) {
          rewards.items.push({ id: pool.equip, qty: 1 });
          // 化神后 BOSS 额外掉一件高阶装备
          if (tier >= 5 && Math.random() < 0.5) {
            rewards.items.push({ id: pool.equip, qty: 1 });
          }
        }
      }
    }
    rewards.stones += Math.floor(floorNum * 20);
    rewards.skillChance = Math.min(0.9, 0.6 + tier * 0.05);
    rewards.skillCount = 1 + Math.floor(tier / 3);  // 层数越高功法越多
  }

  // 稀有掉落：每层小概率出额外好东西（层数越高概率越大）
  var rareChance = Math.min(0.35, 0.03 + tier * 0.04);
  if (Math.random() < rareChance) {
    var rarePool = [
      { id:'juli_fu', qty:1 },        // 聚灵符（修炼+20%）
      { id:'huiling_jie', qty:1 },    // 汇灵戒
      { id:'tianji_ling', qty:1 },    // 天机铃
      { id:'jindan_dan', qty:1 },
      { id:'yuanying_dan', qty:1 },
    ];
    // 化神后稀有池更高级
    if (tier >= 4) {
      rarePool = [
        { id:'huashen_dan', qty:2 },
        { id:'dacheng_dan', qty:1 },
        { id:'leijiao_long', qty:2 },
        { id:'tiandao_bei', qty:2 },
        { id:'jiuyang_ling', qty:2 },
        { id:'honglian_jian', qty:1 },
      ];
    }
    var rare = rarePool[Math.floor(Math.random() * rarePool.length)];
    // 🔧 2026-08-04：化神后固定垃圾装备不进稀有池（聚灵符/汇灵戒/天机铃/红莲剑）
    if (!(typeof shouldFilterAutoDrop === 'function' && shouldFilterAutoDrop(rare.id))) {
      rewards.items.push({ id: rare.id, qty: rare.qty });
    }
  }

  if (isBoss || Math.random() < 0.1) {
    if (Math.random() < rewards.skillChance) rewards.skillCount++;
  }

  return {
    floor: floorNum,
    name: floorName,
    monsters: monsters,
    rewards: rewards,
    tier: tierBase,
    isBoss: isBoss,
  };
}

// ── 试炼塔入口 ──
function enterTower() {
  var p = G.player;
  if (!p) return;
  
  var access = canEnterTower();
  if (!access.can) {
    addNarrative(access.reason, 'system');
    return;
  }

  // 🔧 2026-08-03：不在试炼塔场景时自动传送（地图跑通后可直接进入）
  if (G.currentScene !== 'gate_nether_divine') {
    if (typeof moveToScene === 'function') {
      try {
        moveToScene('gate_nether_divine', { silent: true });
      } catch(e) {}
    }
    G.currentScene = 'gate_nether_divine';
    if (typeof updateSceneDisplay === 'function') updateSceneDisplay();
    if (typeof updateAllUI === 'function') updateAllUI();
    if (typeof addNarrative === 'function') addNarrative('你催动遁光，身影直往幽冥界试炼之塔而去……塔身已在地图上烙印下方位，无需再绕行。', 'event');
  }

  var ts = getTowerState();
  checkTowerDailyReset();

  // 🔧 2026-08-03：手动进入塔 → 本场战斗为手动（胜利可推进 manualHighestFloor）
  ts._manualBattle = true;

  if (!ts._climbing) {
    ts._climbing = true;
    ts._progress = 0;
    ts._totalQiGained = 0;
    ts._totalBodyGained = 0;
  }

  var nextFloor = ts._progress + 1;
  if (nextFloor <= ts.todayFloor) nextFloor = ts.todayFloor + 1;

  ensureFloor(nextFloor);
  var fd = TOWER_FLOORS[nextFloor - 1];
  if (!fd) { addNarrative('塔内灵力紊乱，无法进入。', 'system'); return; }

  if (ts._progress === 0) {
    addNarrative('━━━ 🏛️ 试炼塔 ═══', 'event');
    addNarrative('塔身高耸入云，塔门在你面前缓缓敞开。塔灵的声音在心中响起："此塔不设上限——能走多远，看你有多强。每上一层，修为便增一分。若败了——明日再来。"', 'default');
    addNarrative('你深吸一口气，踏入塔中……', 'default');
  }

  var monsterDesc = fd.monsters.map(function(m) {
    return m.isBoss ? '★ ' + m.name : m.name;
  }).join(' · ');

  addNarrative('━━━ 第' + nextFloor + '层 · ' + fd.name + ' ═══', 'event');
  addNarrative('守关者：' + monsterDesc, 'narr-combat');

  if (fd.monsters.length > 1) {
    addNarrative('这一层有 ' + fd.monsters.length + ' 个敌人！它们配合默契，你需格外小心。', 'default');
  }

  ts._progress++;
  ts._inTowerBattle = true;
  updateAllUI();

  setTimeout(function() {
    if (typeof startTowerCombat === 'function') startTowerCombat(nextFloor);
  }, 600);
}

// ── 战斗 ──
function startTowerCombat(floorNum) {
  ensureFloor(floorNum);
  var fd = TOWER_FLOORS[floorNum - 1];
  if (!fd) return;
  towerFightWave(floorNum, fd, 0);
}

function towerFightWave(floorNum, fd, waveIndex) {
  var p = G.player;
  if (!p) return;

  var monsters = fd.monsters;
  if (waveIndex >= monsters.length) {
    // 全部击败
    if (typeof closeEvent === 'function') closeEvent();
    onTowerVictory(floorNum, fd);
    return;
  }

  var mData = monsters[waveIndex];
  var monster = {
    name: mData.name,
    hp: mData.hp,
    attack: mData.attack,
    defense: mData.defense,
    qi: Math.round(mData.hp * 0.3),
    drops: [],
  };

  if (waveIndex > 0) {
    addNarrative('不等你喘息，第' + (waveIndex + 1) + '个敌人已经扑了上来！', 'narr-combat');
  }

  // 🔴 关键：创建战斗对象 → 展示战斗UI弹窗
  var combat = new CombatExt(monster, function(result) {
    // 战斗结束回调，关闭战斗弹窗
    if (typeof closeEvent === 'function') closeEvent();
    
    if (result === 'victory') {
      // 胜利 → 下一波或过关
      setTimeout(function() { towerFightWave(floorNum, fd, waveIndex + 1); }, 400);
    } else {
      // 战败
      p._inTowerCombat = false;
      p._towerFloor = null;
      var ts2 = getTowerState();
      ts2._climbing = false;
      ts2._inTowerBattle = false;
      ts2._manualBattle = false;
      ts2.todayFloor = Math.max(ts2.todayFloor, floorNum - 1);
      updateAllUI();

      addNarrative('', 'default');
      addNarrative('💀 你倒在了第' + floorNum + '层……', 'system');
      addNarrative('塔灵的声音回荡："能走到这里已经不错了。回去修整，明日再战。"', 'default');

      if (floorNum - 1 > ts2.highestFloor) {
        ts2.highestFloor = floorNum - 1;
        addNarrative('🏆 刷新历史记录！最高层数：' + ts2.highestFloor + '层', 'event');
      }

      if (ts2._totalQiGained + ts2._totalBodyGained > 0) {
        addNarrative('📊 本次试炼累计修为：炼气 +' + Math.round(ts2._totalQiGained) + '，炼体 +' + Math.round(ts2._totalBodyGained), 'system');
      }

      if (typeof recalcStats === 'function') recalcStats(p);
      if (typeof updateAllUI === 'function') updateAllUI();
    }
  });
  
  // 🔴 展示战斗弹窗，让玩家点击攻击/防御！
  showCombatModal(combat);
}

function onTowerVictory(floorNum, fd) {
  var p = G.player;
  if (!p) return;
  var ts = getTowerState();

  p._inTowerCombat = false;
  p._towerFloor = null;
  ts._inTowerBattle = false;

  var rew = fd.rewards;

  if (typeof gainCultivation === 'function') gainCultivation('qi', rew.cultivationQi);
  else p.qiCultivationPoints += rew.cultivationQi;
  if (typeof gainCultivation === 'function') gainCultivation('body', rew.cultivationBody);
  else p.bodyCultivationPoints += rew.cultivationBody;
  ts._totalQiGained += rew.cultivationQi;
  ts._totalBodyGained += rew.cultivationBody;
  ts.todayFloor = Math.max(ts.todayFloor, floorNum);

  // 🔧 2026-08-03：手动通关 → 推进 manualHighestFloor（首次挑战必须手动）
  if (ts._manualBattle) {
    if (floorNum > ts.manualHighestFloor) ts.manualHighestFloor = floorNum;
    ts._manualBattle = false;
  }

  var bosstag = fd.isBoss ? ' ★ BOSS ★' : '';
  addNarrative('🏛️ 第' + floorNum + '层' + bosstag + ' 通关！', 'event');
  addNarrative('🧘 修为 +' + rew.cultivationQi + '（炼气） +' + rew.cultivationBody + '（炼体）', 'loot');

  if (rew.stones > 0) {
    p.stones += rew.stones;
    addNarrative('💎 灵石 +' + rew.stones, 'loot');
  }

  if (rew.items.length > 0) {
    rew.items.forEach(function(item) {
      // 🔧 2026-08-04：低于境界的突破丹/满10突破丹/化神固定垃圾装备不再拾取
      if (typeof shouldFilterAutoDrop === 'function' && shouldFilterAutoDrop(item.id)) return;
      var itemData = (typeof ITEM_DB !== 'undefined' ? ITEM_DB : []).find(function(i) { return i.id === item.id; });
      if (itemData && typeof addItemToInventory === 'function') {
        for (var qi = 0; qi < item.qty; qi++) addItemToInventory(itemData, 1);
        addNarrative('📦 获得 ' + (itemData.name || item.id) + ' x' + item.qty, 'loot');
      }
    });
  }

  if (rew.skillCount > 0) {
    for (var si = 0; si < rew.skillCount; si++) {
      if (Math.random() < rew.skillChance) {
        var qualityPool = floorNum <= 30 ? ['凡级','灵级']
          : floorNum <= 60 ? ['灵级','地级']
          : floorNum <= 100 ? ['地级','天级']
          : floorNum <= 150 ? ['天级','圣级']
          : ['圣级','神级'];
        var qual = qualityPool[Math.floor(Math.random() * qualityPool.length)];
        var candidates = (typeof SKILL_DB !== 'undefined' ? SKILL_DB : []).filter(function(s) { return s.quality === qual; });
        if (candidates.length > 0) {
          var skill = candidates[Math.floor(Math.random() * candidates.length)];
          if (typeof learnSkillFromScroll === 'function') {
            learnSkillFromScroll(skill.id);
            addNarrative('📜 发现功法《' + skill.name + '》(' + skill.quality + ')！', 'event');
          }
        }
      }
    }
  }

  if (fd.isBoss) {
    addNarrative('你击败了镇关BOSS！塔身微微一震——上层的气息变得更加凝重。', 'default');
  }

  if (floorNum > ts.highestFloor) {
    ts.highestFloor = floorNum;
    addNarrative('🏆 历史新高！最高层数：' + floorNum + '层', 'event');
  }

  if (typeof qiBreakthroughCheck === 'function') qiBreakthroughCheck();
  if (typeof bodyBreakthroughCheck === 'function') bodyBreakthroughCheck();

  if (typeof recalcStats === 'function') recalcStats(p);
  if (typeof updateAllUI === 'function') updateAllUI();

  // 继续下一层
  var nextFloor = floorNum + 1;
  ensureFloor(nextFloor);
  var nextFd = TOWER_FLOORS[nextFloor - 1];

  // 🔧 2026-08-03：自动刷塔时不用手动战斗调度，由 _autoTowerTick 接管
  if (_autoTowerRunning) {
    ts._inTowerBattle = false;
    if (typeof updateAllUI === 'function') updateAllUI();
    return;
  }

  if (nextFd) {
    addNarrative('塔内的灵气再次凝聚，上一层的大门缓缓打开……', 'default');
    ts._inTowerBattle = true;

    setTimeout(function() {
      if (typeof startTowerCombat === 'function') startTowerCombat(nextFloor);
    }, 800);
  } else {
    ts._climbing = false;
    addNarrative('你已到达试炼之巅，前方再无通路……', 'event');
    addNarrative('🏆 无比荣耀！', 'event');
  }
}

// ── 塔门POI交互入口 ──
function towerGateInteraction() {
  var p = G.player;
  if (!p) return;

  if (!G.visitedScenes) G.visitedScenes = [];
  if (G.visitedScenes.indexOf('gate_nether_divine') === -1) {
    G.visitedScenes.push('gate_nether_divine');
  }

  if (!isTowerUnlocked()) {
    if (p.qiRealmIndex + 1 < 4) {
      addNarrative('你伸手触摸塔门，一股磅礴的威压将你震退三步！', 'system');
      addNarrative('塔灵的声音在你脑海中响起："修为不足，回去吧。炼气四层以上再来。"', 'default');
    }
    return;
  }

  closeEvent();
  showTowerModal();
}

function showTowerModal() {
  var p = G.player;
  if (!p) return;

  checkTowerDailyReset();

  var ts = getTowerState();
  var currentCp = p.combatPower || 0;
  var highest = ts.highestFloor || 0;
  var todayFloor = ts.todayFloor || 0;
  var inProgress = ts._climbing;
  var inBattle = ts._inTowerBattle;
  var currentDay = G.time ? G.time.day : 0;
  var dayMatch = ts.towerDay === currentDay;

  var todayLabel = dayMatch
    ? (todayFloor > 0 ? '第' + todayFloor + '层' : '今日未挑战')
    : '今日未挑战';

  var predictedFloor = Math.max(1, Math.floor(currentCp / 15));

  var statusHtml = ''
    + '<div style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:10px;">'
    + '<div style="padding:6px 10px;border-radius:6px;background:rgba(255,255,255,0.04);font-size:11px;">🏆 历史最高 <span style="color:var(--accent);">' + highest + '层</span></div>'
    + '<div style="padding:6px 10px;border-radius:6px;background:rgba(255,255,255,0.04);font-size:11px;">📅 今日 <span style="color:' + (todayFloor > 0 ? '#8bc34a' : 'var(--text-dim)') + ';">' + todayLabel + '</span></div>'
    + '<div style="padding:6px 10px;border-radius:6px;background:rgba(255,255,255,0.04);font-size:11px;">⚔️ 预估 ~' + predictedFloor + '层</div>'
    + '</div>';

  var infoHtml = '<div style="font-size:11px;color:var(--text-dim);margin-bottom:10px;">'
    + '🏛️ 试炼塔\n'
    + '· 每日重置，从第1层重新挑战\n'
    + '· 每层大量修为，层数越高越丰厚\n'
    + '· 每10层BOSS关，必掉突破丹药\n'
    + '· 每7天可刷新一次（重置楼层与奖励）\n'
    + '· ⚡自动刷塔只刷手动已通关的层\n'
    + '· 战败则止步，明日重置刷新！\n'
    + '</div>';

  // 🔧 2026-08-03：手动通关层信息展示
  var manualInfo = '';
  if (ts.manualHighestFloor > 0) {
    manualInfo = '<div style="padding:6px 10px;border-radius:6px;background:rgba(100,200,150,0.06);font-size:10px;color:#7dce9a;margin-bottom:8px;">🖐️ 手动通关至第 <b>' + ts.manualHighestFloor + '</b> 层（自动刷塔上限）</div>';
  } else {
    manualInfo = '<div style="padding:6px 10px;border-radius:6px;background:rgba(100,200,150,0.06);font-size:10px;color:#7dce9a;margin-bottom:8px;">🖐️ 首次挑战需手动——先手动闯过一层，自动刷塔才会解锁</div>';
  }

  var historyHtml = '';
  if (highest > 0) {
    var totalEstQi = 0, totalEstBody = 0;
    for (var hi = 1; hi <= highest; hi++) {
      totalEstQi += 15 * hi * Math.pow(1.02, hi);
      totalEstBody += 10 * hi * Math.pow(1.02, hi);
    }
    historyHtml = '<div style="border:1px solid rgba(201,169,110,0.2);border-radius:6px;padding:8px;margin-bottom:8px;font-size:10px;color:var(--text-dim);">'
      + '📊 累计修为（估算）：炼气 +' + Math.round(totalEstQi) + ' · 炼体 +' + Math.round(totalEstBody)
      + '</div>';
  }

  var enterBtn = '';
  if (inBattle) {
    var curFloor = ts._progress || 1;
    enterBtn = '<div style="margin-top:8px;padding:8px;border-radius:6px;background:rgba(255,165,0,0.1);font-size:11px;color:#ffa500;text-align:center;">⚔️ 塔内战斗中……第' + curFloor + '层</div>';
  } else if (inProgress) {
    enterBtn = '<button class="event-choice-btn" onclick="closeEvent();enterTower();" style="margin-top:8px;width:100%;font-size:13px;padding:10px 0;font-weight:bold;">⚔️ 继续挑战（从第' + (ts._progress + 1) + '层开始）</button>';
  } else {
    var btnLabel = todayFloor > 0 ? '⚔️ 重新挑战（今日已到第' + todayFloor + '层）' : '⚔️ 进入试炼塔';
    enterBtn = '<button class="event-choice-btn" onclick="closeEvent();enterTower();" style="margin-top:8px;width:100%;font-size:13px;padding:10px 0;font-weight:bold;">' + btnLabel + '</button>';
  }

  // 🔧 2026-08-03：每7天刷新按钮 + 自动刷按钮
  var refreshAccess = (typeof canRefreshTower === 'function') ? canRefreshTower() : { can:false, reason:'' };
  var refreshBtn = '';
  if (refreshAccess.can) {
    refreshBtn = '<button class="event-choice-btn" onclick="closeEvent();refreshTower();" style="margin-top:6px;width:100%;font-size:11px;background:rgba(150,111,214,0.15);border:1px solid rgba(150,111,214,0.4);color:#c9a96e;">🔄 刷新试炼塔（重置楼层与奖励）</button>';
  } else if (refreshAccess.daysLeft) {
    refreshBtn = '<div style="margin-top:6px;font-size:10px;color:var(--text-dim);text-align:center;">🔄 下次刷新：' + refreshAccess.daysLeft + '天后</div>';
  }
  var autoBtn = '<button class="event-choice-btn" onclick="closeEvent();autoRunTower();" style="margin-top:6px;width:100%;font-size:11px;background:rgba(100,200,150,0.12);border:1px solid rgba(100,200,150,0.35);color:#7dce9a;">⚡ 自动刷塔（直到打不过为止）</button>';

  var html = infoHtml + manualInfo + statusHtml + historyHtml + enterBtn + autoBtn + refreshBtn
    + '<button class="event-choice-btn" onclick="closeEvent();" style="margin-top:6px;width:100%;font-size:10px;background:transparent;border:1px solid rgba(255,255,255,0.08);">关闭</button>';

  showCustomModal('🏛️ 试炼塔', html);
}

function getTowerFloorData(floor) {
  ensureFloor(floor);
  return TOWER_FLOORS[floor - 1] || null;
}

// 🔧 2026-08-03：自动刷塔——仿真战斗逐层打，直到打不过为止
// 经验/灵石/掉落自动拾取（不弹窗，静默结算）
var _autoTowerRunning = false;
var _autoTowerTimer = null;
var _autoTowerNoCap = false;  // 🔧 2026-08-04：化神后无上限自动刷塔标记

function autoRunTower() {
  var p = G.player;
  if (!p) return;
  var access = canEnterTower();
  if (!access.can) {
    addNarrative(access.reason, 'system');
    return;
  }
  if (_autoTowerRunning) {
    addNarrative('⏳ 自动刷塔已在运行中……', 'system');
    return;
  }
  var ts = getTowerState();
  checkTowerDailyReset();

  // 🔧 2026-08-03：首次挑战必须手动——自动刷塔只能刷已手动通关的层
  // 🔧 2026-08-04：化神后（qiRealmIndex>=18）解锁全自动——战力足够碾压，自动刷塔不再设限，一路打到底
  var isHighRealm = p.qiRealmIndex >= 18;
  if (!isHighRealm && (!ts.manualHighestFloor || ts.manualHighestFloor < 1)) {
    addNarrative('🏛️ 塔灵摇头：“此塔首次登顶须你亲自出手——第1层起，先手动闯过一层，方可开启自动刷塔。”', 'default');
    return;
  }

  // 化神后：自动刷塔标记无上限模式（_autoTowerNoCap），低境界保留 cap=manualHighestFloor
  _autoTowerNoCap = isHighRealm;

  // 不在塔场景自动传送
  if (G.currentScene !== 'gate_nether_divine') {
    if (typeof moveToScene === 'function') {
      try { moveToScene('gate_nether_divine', { silent: true }); } catch(e) {}
    }
    G.currentScene = 'gate_nether_divine';
    if (typeof updateSceneDisplay === 'function') updateSceneDisplay();
  }
  _autoTowerRunning = true;
  ts._manualBattle = false;
  if (!ts._climbing) {
    ts._climbing = true;
    ts._progress = 0;
    ts._totalQiGained = 0;
    ts._totalBodyGained = 0;
  }
  addNarrative('⚡ 你开启自动刷塔——塔灵震荡，自动重踏已征服的楼层，一层层碾压而上！', 'event');
  if (typeof updateAllUI === 'function') updateAllUI();
  _autoTowerTick();
}

// 单层仿真战斗：胜利→结算→下一层；失败→停止
function _autoTowerTick() {
  if (!_autoTowerRunning) return;
  var ts = getTowerState();
  if (ts._inTowerBattle) {
    // 已有战斗在进行（手动进入的），等它结束再接管
    _autoTowerTimer = setTimeout(_autoTowerTick, 2000);
    return;
  }
  
  var nextFloor = ts._progress + 1;
  // 🔧 2026-08-03：自动刷塔上限 = 手动通关最高层（首次挑战必须手动）
  // 🔧 2026-08-04：化神后（_autoTowerNoCap）无上限——一路打到底，直到战力不足战败
  var cap = _autoTowerNoCap ? 999999 : (ts.manualHighestFloor || 0);
  if (nextFloor > cap) {
    _autoTowerStop(false);
    if (_autoTowerNoCap) {
      addNarrative('🏛️ 试炼之巅！你已站上此塔绝顶——化神之威，塔灵俯首。', 'default');
    } else {
      addNarrative('🏛️ 已自动刷完手动征服的 ' + cap + ' 层。再往上，塔灵只认你的亲手之战——先手动挑战第 ' + (cap + 1) + ' 层吧！', 'default');
    }
    return;
  }
  ensureFloor(nextFloor);
  var fd = TOWER_FLOORS[nextFloor - 1];
  if (!fd) { _autoTowerStop(); return; }
  
  ts._progress = nextFloor;
  ts._inTowerBattle = true;
  if (typeof updateAllUI === 'function') updateAllUI();
  
  // 仿真战斗：塔怪直传属性
  var win = _autoTowerSimulateFloor(fd, nextFloor);
  
  if (win) {
    // 胜利：结算奖励（自动拾取）
    onTowerVictory(nextFloor, fd);
    if (_autoTowerRunning) {
      _autoTowerTimer = setTimeout(_autoTowerTick, 600);
    }
  } else {
    // 战败：止步
    _autoTowerStop(true, nextFloor);
  }
}

// 仿真一层：逐波战斗（塔内同层多怪），返回是否通关
function _autoTowerSimulateFloor(fd, floorNum) {
  var p = G.player;
  var monsters = fd.monsters || [];
  for (var wi = 0; wi < monsters.length; wi++) {
    var m = monsters[wi];
    var result = _autoTowerSimulateBattle(m, floorNum);
    if (result === 'victory') {
      continue;
    } else {
      // 战败：恢复部分状态
      return false;
    }
  }
  return true;
}

// 单怪仿真战斗（与 startAutoCombat 相同的攻防公式）
function _autoTowerSimulateBattle(m, floorNum) {
  var p = G.player;
  var sim = {
    hp: p.hp, maxHp: p.maxHp,
    attack: p.attack, defense: p.defense,
    qi: p.qi, maxQi: p.maxQi,
    _extraCritRate: p._extraCritRate || 0,
    _shengTiGuard: p._shengTiGuard || false,
    _buXiuRegen: p._buXiuRegen || false,
  };
  var mhp = m.hp, matt = m.attack, mdef = m.defense || 1;
  var maxMhp = m.hp;
  var turns = 0, maxTurns = 60;
  
  while (sim.hp > 0 && mhp > 0 && turns < maxTurns) {
    turns++;
    // 玩家攻击
    var baseDmg = Math.max(1, sim.attack - mdef);
    var floorDmg = Math.max(1, Math.round(sim.attack * 0.12));
    baseDmg = Math.max(baseDmg, floorDmg);
    var crit = Math.random() < ((sim._extraCritRate || 0) + 0.05);
    var dmg = Math.round(baseDmg * (0.8 + Math.random() * 0.4) * (crit ? 1.5 : 1));
    mhp -= dmg;
    if (mhp <= 0) break;
    // 怪物攻击
    var mDmg = Math.max(1, Math.round(matt * (0.8 + Math.random() * 0.4) - sim.defense));
    sim.hp -= mDmg;
    if (sim.hp <= 0) break;
  }
  
  if (mhp <= 0 && sim.hp > 0) {
    // 胜利：写回玩家状态（扣血）
    p.hp = Math.max(1, sim.hp);
    p.qi = Math.max(0, sim.qi);
    return 'victory';
  } else {
    // 战败：扣血到底，交给自动吃药/休整
    p.hp = Math.max(1, sim.hp);
    p.qi = Math.max(0, sim.qi);
    return 'defeat';
  }
}

function _autoTowerStop(defeated, floorNum) {
  _autoTowerRunning = false;
  if (_autoTowerTimer) { clearTimeout(_autoTowerTimer); _autoTowerTimer = null; }
  var p = G.player;
  var ts = getTowerState();
  ts._climbing = false;
  ts._inTowerBattle = false;
  if (defeated) {
    var reached = Math.max(0, (floorNum || 1) - 1);
    ts.todayFloor = Math.max(ts.todayFloor, reached);
    if (reached > ts.highestFloor) ts.highestFloor = reached;
    addNarrative('💀 自动刷塔止步于第' + floorNum + '层——塔灵叹息：“已到极限，回去修整，来日再战。”', 'system');
  } else {
    addNarrative('🏛️ 自动刷塔结束。', 'system');
  }
  if (typeof recalcStats === 'function') recalcStats(p);
  if (typeof updateAllUI === 'function') updateAllUI();
}

// 停止自动刷塔（供外部/自动模式切换调用）
function stopAutoTower() {
  _autoTowerRunning = false;
  _autoTowerNoCap = false;
  if (_autoTowerTimer) { clearTimeout(_autoTowerTimer); _autoTowerTimer = null; }
}

// ── 导出 ──
window.TOWER_FLOORS = TOWER_FLOORS;
window.initTowerFloors = initTowerFloors;
window.ensureFloor = ensureFloor;
window.getTowerState = getTowerState;
window.canEnterTower = canEnterTower;
window.enterTower = enterTower;
window.startTowerCombat = startTowerCombat;
window.showTowerModal = showTowerModal;
window.getTowerFloorData = getTowerFloorData;
window.isTowerUnlocked = isTowerUnlocked;
window.getUnlockReason = getUnlockReason;
window.towerGateInteraction = towerGateInteraction;
window.checkTowerDailyReset = checkTowerDailyReset;
window.canRefreshTower = canRefreshTower;
window.refreshTower = refreshTower;
window.autoRunTower = autoRunTower;
window.stopAutoTower = stopAutoTower;
