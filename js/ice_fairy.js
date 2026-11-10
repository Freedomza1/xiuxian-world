// === 唯我独仙 · 万载冰窟·百里冰 ===
// 冰封的万古绝色、可攻略的仙侣、最顶级的机缘
// 专属API：见 config.js
// ═══════════════════════════════════════
//  缘份系统
//  · 缘份<30 + 金丹以下 → 守护怪秒杀，自动回城
//  · 缘份≥30 → 守护灵认主，获得奇遇祝福
//  · 缘份≥60 → 可看到隐藏的引路符文
//  · 每次进入检查，符合条件才触发
// ═══════════════════════════════════════

const ICE_FAIRY_API_KEY = (window.XIUXIAN_CONFIG && window.XIUXIAN_CONFIG.ICE_FAIRY_API_KEY) ? window.XIUXIAN_CONFIG.ICE_FAIRY_API_KEY : "";

// ==========================
// 仙子状态管理
// ==========================
function initIceFairy() {
  var p = G.player;
  if (!p) return;
  // ★ 无论有没有旧存档，都保证完整结构
  if (!p._iceFairy || typeof p._iceFairy !== 'object') {
    p._iceFairy = {};
  }
  var f = p._iceFairy;
  // 逐字段补齐（兼容旧存档）
  if (f.stage === undefined) f.stage = 0;
  if (f.affinity === undefined) f.affinity = 0;
  if (f.fate === undefined) f.fate = 10;
  if (f.firstMet === undefined) f.firstMet = false;
  if (f.chatCount === undefined) f.chatCount = 0;
  if (!f._iceRequests) f._iceRequests = [];
  if (f.lastChatTime === undefined) f.lastChatTime = 0;
  if (f.lastAutoEventDay === undefined) f.lastAutoEventDay = -1;
  if (!f.progress || typeof f.progress !== 'object') f.progress = {};
  var pr = f.progress;
  if (pr.visited === undefined) pr.visited = false;
  if (pr.itemsCollected === undefined) pr.itemsCollected = 0;
  if (pr.thawed === undefined) pr.thawed = false;
  if (pr.bossDefeated === undefined) pr.bossDefeated = false;
  if (pr.keyComplete === undefined) pr.keyComplete = false;
  if (pr.guardianBlessed === undefined) pr.guardianBlessed = false;
  if (pr.daoPartner === undefined) pr.daoPartner = false;
  if (!f.portraits || typeof f.portraits !== 'object') f.portraits = {};
  return f;
}

function getIceFairy() {
  // 确保始终调用initIceFairy补齐字段（兼容旧存档）
  if (!G.player) return null;
  return initIceFairy();
}

// ==========================
// 解封材料
// ==========================
const ICE_FAIRY_ITEMS = [
  { id:'ice_fairy_flower', name:'瑶池冰莲', desc:'只生长于万载玄冰之上的九瓣冰莲。是解封冰棺之物之一。', scene:'bj_ice_peak', findDesc:'你在冰晶峰顶的绝壁之上，冒着刺骨寒风采下了一朵瑶池冰莲。' },
  { id:'ice_fairy_jade', name:'寒玉髓', desc:'深埋地心万年凝结的玉髓，通体冰凉。', scene:'bingfeng_grotto', findDesc:'你敲开冰风石窟最深处的岩壁，发现一块通体透亮的寒玉髓。' },
  { id:'ice_fairy_fire', name:'涅槃火种', desc:'凤凰涅槃时留下的一缕不灭火焰。', scene:'lieyan_valley', findDesc:'你在烈焰谷深处的岩浆池边找到了这缕不灭之火。' },
  { id:'ice_fairy_tear', name:'冰魄泪', desc:'上古神女殒落时留下的泪滴凝结成的琥珀。', scene:'bibo_lake', findDesc:'你在碧波湖最深处发现了一枚散发着微光的琥珀。' },
  { id:'ice_fairy_core', name:'玄冰之心', desc:'北极冰原之心万年凝聚的灵核。', scene:'bj_frozen_lake', findDesc:'你潜入冰封湖最深处，在湖心找到了一颗旋转着缓缓释放灵气的玄冰之心。' }
];

// ==========================
// 📜 仙子委托池
// 她“随口要”的东西，都是世界里有的物品
// ==========================
var ICE_FAIRY_REQUESTS = [
  { id:'req_jade', itemId:'ice_fairy_jade', itemName:'寒玉髓', qty:1, affinityReq:15,
    requestText:'山巅万丈寒潭中，或有所获。',
    hintScene:'bingfeng_grotto', hintText:'冰风石窟深处敲开岩壁（探索可得）',
    reward:{ fate:2, affinity:3, exp:800, stones:150, desc:'她接过寒玉髓，指尖泛起一丝暖意。' } },
  { id:'req_lily', itemId:'xuelian', itemName:'雪莲子', qty:1, affinityReq:10,
    requestText:'雪莲子性寒而润，本仙子要炼一味凝神药。',
    hintScene:'bj_frozen_lake', hintText:'冰封湖岸的冰晶花丛采集，或雪岭药丛',
    reward:{ fate:2, affinity:3, exp:600, stones:100, desc:'她将雪莲子收入袖中，低声道谢。' } },
  { id:'req_yunqi', itemId:'yunqi_cao', itemName:'云气草', qty:1, affinityReq:20,
    requestText:'云气草蕴九天之气，本仙子要借它一观云海。',
    hintScene:'bj_ice_peak', hintText:'冰晶峰·冰晶洞府深处冰台（可反复采集）',
    reward:{ fate:3, affinity:4, exp:1000, stones:200, desc:'她拈着云气草，眼中倒映出云海翻涌。' } },
  { id:'req_wudao', itemId:'wudao_ye', itemName:'悟道叶', qty:1, affinityReq:25,
    requestText:'悟道叶……本仙子被困万年，心境蒙尘，需它拂拭。',
    hintScene:'lingyun_peak', hintText:'灵云峰探索（灵药丛中偶得）',
    reward:{ fate:3, affinity:5, exp:1200, stones:250, desc:'她闭目片刻，再睁眼时眸中多了一分明悟。' } },
  { id:'req_flower', itemId:'ice_fairy_flower', itemName:'瑶池冰莲', qty:1, affinityReq:30,
    requestText:'瑶池冰莲……那是本仙子故乡的花。若能得一朵……',
    hintScene:'bj_ice_peak', hintText:'冰晶峰顶绝壁（探索可得）',
    reward:{ fate:4, affinity:6, exp:1500, stones:300, desc:'她捧着冰莲，沉默了很久，眼眶微红。' } },
  { id:'req_xuantie', itemId:'xuantie_jingcui', itemName:'玄铁精粹', qty:1, affinityReq:18,
    requestText:'玄铁精粹……本仙子想给你铸一枚护身符。',
    hintScene:'xuantie_mine', hintText:'玄铁矿洞·主矿脉挖矿（30%概率）',
    reward:{ fate:3, affinity:5, exp:1000, stones:180, desc:'她收下玄铁，指尖凝出一缕冰焰，开始炼化。' } },
  { id:'req_lingzhi', itemId:'qiannian_lingzhi', itemName:'千年灵芝', qty:1, affinityReq:12,
    requestText:'千年灵芝……本仙子神魂受创，需要温养。',
    hintScene:'biguan_peak', hintText:'闭关峰探索（15%），或地下暗河钟乳石洞',
    reward:{ fate:2, affinity:3, exp:800, stones:120, desc:'她服下灵芝精华，脸色好了几分。' } },
  { id:'req_tear', itemId:'ice_fairy_tear', itemName:'冰魄泪', qty:1, affinityReq:35,
    requestText:'冰魄泪……那是故人留给我最后的念想，本仙子要找回来。',
    hintScene:'bibo_lake', hintText:'碧波湖深处（探索可得）',
    reward:{ fate:5, affinity:8, exp:2000, stones:400, desc:'她攥着冰魄泪，久久不语，最后对你轻声道：“谢谢你。”' } }
];

// ==========================
// 缘份相关
// ==========================
function getFateLabel(fate) {
  if (fate >= 80) return { label:'💞 天定之缘', color:'#d4a5f9', desc:'你就是她的命定之人，天地已为你们注定了这段缘分。' };
  if (fate >= 60) return { label:'💝 情深缘厚', color:'#e8a0d0', desc:'你们的缘分已经深如千年寒冰。' };
  if (fate >= 40) return { label:'💗 缘分渐深', color:'#c9a96e', desc:'缘分的线正在将你们牵向彼此。' };
  if (fate >= 20) return { label:'💛 缘起微时', color:'#8bc34a', desc:'一丝若有若无的缘分在你们之间轻轻摇曳。' };
  return { label:'🤍 缘未至', color:'var(--text-dim)', desc:'她还在万年的沉睡中，缘分尚未降临。' };
}

function gainIceFairyFate(amount, reason) {
  var f = getIceFairy();
  if (!f) return;
  var oldFate = f.fate;
  f.fate = Math.min(100, f.fate + amount);
  var gained = Math.floor(f.fate) - Math.floor(oldFate);
  if (gained > 0) {
    addNarrative('☯️ 缘份+' + gained + (reason ? '（' + reason + '）' : ''), 'loot');
    try { updateAllUI(); } catch(e) { console.warn('updateAllUI failed:', e); }
  }
}

// ==========================
// （旧checkFateGate已移除——现已改为缘份试炼仪式）
// ==========================

function grantFateBlessing(f, type) {
  var p = G.player;
  if (!p) return;
  if (type === 'first') {
    if (typeof gainCultivation === 'function') gainCultivation('qi', 30000);
    else p.qiCultivationPoints += 30000;
    if (typeof gainCultivation === 'function') gainCultivation('body', 15000);
    else p.bodyCultivationPoints += 15000;
    p.wisdom = Math.min(100, (p.wisdom || 50) + 8);
    p.daoHeart = Math.min(200, (p.daoHeart || 50) + 10);
    p.mood = 100;
    gainIceFairyFate(15, '守窟冰灵认可');
    addNarrative('🎁 修为+30000 · 炼体+15000 · 悟性+8 · 道心+10', 'loot');
    addNarrative('📜 你感到一缕冰系传承涌入脑海……（习得一部冰系功法）', 'narr-epic');
  } else {
    var blessings = [
      function() { if (typeof gainCultivation === 'function') gainCultivation('qi', 5000); else p.qiCultivationPoints += 5000; return '修为+5000'; },
      function() { p.stones += 200; return '灵石+200'; },
      function() { p.mood = Math.min(100, (p.mood || 50) + 5); return '心境+5'; },
      function() { p.qi = Math.min(p.maxQi, (p.qi || 0) + Math.round(p.maxQi * 0.3)); return '灵力恢复30%'; },
    ];
    var b = blessings[Math.floor(Math.random() * blessings.length)];
    addNarrative('❄️ 冰窟灵气涌入体内——' + b(), 'loot');
  }
  updateAllUI();
}

function gainFateFromChat() {
  var f = getIceFairy();
  if (!f) return;
  if (f.chatCount > 0 && f.chatCount % 5 === 0) {
    gainIceFairyFate(1 + Math.floor(f.affinity / 30), '缘分随羁绊加深');
  }
}
function gainFateFromStageUp() {
  var f = getIceFairy();
  if (!f) return;
  gainIceFairyFate(5 + Math.floor((f.fate || 0) / 20), '命运的关键转折');
}

// ==========================
// 缘份未到·强行闯入的惩罚
// ==========================
function triggerFateKill() {
  var p = G.player;
  if (!p) return;
  
  // 直接把场景切到青云镇，不放消息流
  G.currentScene = 'qingyun';
  
  addNarrative('<div style="border:1px solid #e74c3c88;border-radius:8px;padding:12px;margin:6px 0;background:rgba(200,50,50,0.08);">' +
    '<div style="font-size:13px;font-weight:bold;color:#e74c3c;">💀 守窟冰灵·惩戒</div>' +
    '<div style="font-size:12px;line-height:1.8;margin-top:4px;">你踏入冰窟深处，脚下的冰面瞬间浮现出一个巨大的法阵！法阵中央升起一个半透明的冰霜之灵——它双目泛着幽蓝的寒光，声音不带一丝情感。</div>' +
    '</div>', 'danger');
  
  addNarrative('💀 冰灵抬手一指——你眼前一黑。回过神来，你发现自己躺在青云镇医馆的床上，浑身像是被冻透了。<br><br>床头放着一张纸条，上面只写了两行字：<br>「缘未至，不可入。」<br>「强求无用，等缘分到了再来吧。」', 'danger');
  
  p.hp = Math.max(Math.round(p.maxHp * 0.15), 1);
  p.qi = Math.max(Math.round(p.maxQi * 0.2), 1);
  p.mood = Math.max(0, (p.mood || 50) - 15);
  
  if (typeof updateSceneInfo === 'function') updateSceneInfo();
  if (typeof updatePerceptionUI === 'function') updatePerceptionUI();
  updateAllUI();
}

// ==========================
// 物品检查
// ==========================
function checkIceFairyItems() {
  var p = G.player;
  if (!p) return { have:0, total:5, complete:false };
  var have = 0;
  if (!p.inventory) return { have:0, total:5, complete:false };
  ICE_FAIRY_ITEMS.forEach(function(it) {
    if (p.inventory.some(function(i) { return i.id === it.id; })) have++;
  });
  return { have:have, total:5, complete:have >= 5 };
}

// 🔧 解封材料入手播报：解封已完成(stage>=2/keyComplete)后不再报'解封材料X/5'，只报物品
function iceFairyUnsealNote(name, count) {
  try {
    var f = getIceFairy();
    if (f && (f.stage >= 2 || f.progress.keyComplete)) return '';  // 已解封，不播报任务进度
  } catch(e) {}
  var chk = checkIceFairyItems();
  return '📜 冰仙子解封材料：' + name + ' ×' + count + ' 已入手（' + chk.have + '/' + chk.total + '）';
}

// ==========================
// ★ 缘份试炼仪式（点击入口的弹窗）
// ==========================
function enterIceCoffinChamber() {
  var f = getIceFairy();
  if (!f) return;
  var p = G.player;
  var fate = f.fate || 10;
  var realmIdx = p.qiRealmIndex || 0;
  var isLowRealm = realmIdx < 12;
  var fateInfo = getFateLabel(fate);
  // 🔧 天缘设定：凡发现此冰窟（任务出现）者，皆是有缘人——缘份测试已过，练气亦可入内
  var hasFate = fate >= 10; // 初始即有 10 点缘份，视为天缘认可
  var canPass = hasFate || !isLowRealm;
  
  var html = '<div style="padding:4px;">';
  html += '<div style="font-size:11px;color:var(--text-dim);margin-bottom:8px;line-height:1.5;">' +
    '你站在一条隐蔽的冰道尽头。前方是一座万年玄冰制成的巨大棺椁，棺中躺着一位绝美的女子。' +
    '寒气如刀，四周的冰壁上凝结着古老的符文——那是守窟冰灵的试炼法阵。' +
    (isLowRealm && hasFate ? '<div style="margin-top:6px;color:#6a9ec9;">💫 你虽修为尚浅，但胸口的一缕天缘印记微微发亮——冰灵法阵感应到你的缘份，为你让开了一条路。</div>' : '') +
    '</div>';
  
  // 缘份 & 修为信息
  html += '<div style="display:flex;gap:8px;margin-bottom:8px;">' +
    '<div style="flex:1;padding:6px;border-radius:6px;border:1px solid rgba(255,255,255,0.06);text-align:center;">' +
      '<div style="font-size:9px;color:var(--text-dim);">☯️ 缘份</div>' +
      '<div style="font-size:14px;font-weight:bold;color:' + fateInfo.color + ';">' + fateInfo.label + '</div>' +
      '<div style="font-size:10px;color:var(--text-dim);">' + f.fate + '/100</div>' +
    '</div>' +
    '<div style="flex:1;padding:6px;border-radius:6px;border:1px solid rgba(255,255,255,0.06);text-align:center;">' +
      '<div style="font-size:9px;color:var(--text-dim);">⚡ 修为</div>' +
      '<div style="font-size:14px;font-weight:bold;color:' + (hasFate ? '#6a9ec9;' : (isLowRealm ? '#e74c3c;' : '#6a9ec9;')) + '">' +
        (isLowRealm ? (hasFate ? '金丹以下·天缘护体' : '金丹以下') : '金丹以上') + '</div>' +
      '<div style="font-size:10px;color:' + (hasFate ? '#6a9ec9' : 'var(--text-dim)') + ';">' + (hasFate ? '天缘可入' : '门槛：金丹') + '</div>' +
    '</div>' +
  '</div>';
  
  // 试炼结果预测
  // canPass 已在函数开头定义：hasFate(fate>=10 天缘) || !isLowRealm(金丹+)
  var verdictColor = canPass ? '#6a9ec9' : '#c9a96e';
  var verdictIcon = canPass ? '✅' : '🤷';
  var verdictText = '';
  if (hasFate && isLowRealm) {
    verdictText = '天缘已定，守窟冰灵感应到你与棺中之人的宿命牵绊——即便修为尚浅，亦可入内。';
  } else if (!isLowRealm) {
    verdictText = '修为足以抵御万载寒冰，冰灵不会阻拦你。';
  } else {
    verdictText = '天缘未至——强行闯入会被守护灵秒杀！';
  }

  html += '<div style="padding:8px;border-radius:6px;margin-bottom:8px;font-size:10px;line-height:1.5;border:1px solid ' + verdictColor + '44;background:' + verdictColor + '08;">';
  html += '<span style="color:' + verdictColor + ';font-weight:bold;">' + verdictIcon + ' 试炼预判：</span>' + verdictText;
  html += '</div>';
  
  // 已有存档则直接进
  if (f.progress.visited) {
    html += '<div class="event-choice-btn" onclick="closeEvent();' + (canPass ? 'proceedToIceFairy();' : 'triggerFateKill();') + '" style="text-align:center;font-size:12px;padding:8px;">' +
      (canPass ? '❄️ 进入冰窟' : '⚠️ 明知不可为而为之') + '</div>';
  } else {
    html += '<div class="event-choice-btn" onclick="closeEvent();' + (canPass ? 'proceedToIceFairy();' : 'triggerFateKill();') + '" style="text-align:center;font-size:12px;padding:8px;' +
      (canPass ? 'border-color:#6a9ec9;' : 'border-color:#c9a96e;') + '">' +
      (canPass ? '🙏 接受缘份试炼' : '⚠️ 接受缘份试炼（可能有危险）') + '</div>';
  }
  
  html += '<div class="event-choice-btn" onclick="closeEvent();" style="text-align:center;font-size:10px;padding:6px;background:rgba(100,100,100,0.1);margin-top:4px;">暂时离开</div>';
  html += '</div>';
  
  showCustomModal('❄️ 万载冰窟·缘份试炼', html);
}

// ==========================
// 通过试炼 → 进入冰窟
// ==========================
function proceedToIceFairy() {
  var f = getIceFairy();
  if (!f) return;
  var p = G.player;
  
  // 🔧 天缘设定：凡发现冰窟（任务出现）者皆有缘份（初始10），练气亦可入内，冰灵天缘护体
  // 修为金丹以上(index>=12)永远可入；天缘(fate>=10)可无视修为
  var realmBlock = (p.qiRealmIndex || 0) < 12;
  var hasFate = f.fate >= 10;
  if (realmBlock && !hasFate) {
    addNarrative('❄️ 以你现在的修为，进去只会被冻成冰雕。且你与棺中之人的缘份尚未显现，冰灵不会为你开门。', 'system');
    return;
  }
  if (realmBlock && hasFate) {
    addNarrative('❄️ 你踏入冰窟，刺骨的寒气扑面而来。但胸口的天缘印记泛起一阵幽蓝的光芒——守窟冰灵感应到你的宿命牵绊，灵力护住了你，寒意无法伤你分毫。', 'event');
  }
  
  // 缘份祝福
  if (f.fate >= 30) {
    if (!f.progress.guardianBlessed) {
      f.progress.guardianBlessed = true;
      addNarrative('<div style="border:1px solid #6a9ec9aa;border-radius:8px;padding:12px;margin:6px 0;background:rgba(100,150,200,0.08);">' +
        '<div style="font-size:13px;font-weight:bold;color:#6a9ec9;">❄️ 冰灵认主</div>' +
        '<div style="font-size:12px;line-height:1.8;margin-top:4px;">你踏入冰窟深处，守窟冰灵从虚空中浮现。它单膝跪地，垂下了高傲的头颅——<br><br>「恭迎有缘人。在下奉仙子之命，在此守候了万年。」<br><br>冰灵抬手一挥，一道幽蓝的光芒涌入你的眉心——那是守护灵万载修为凝结的祝福。</div>' +
        '</div>', 'milestone');
      grantFateBlessing(f, 'first');
    } else {
      addNarrative('<span style="font-size:10px;color:#6a9ec9;">❄️ 守窟冰灵微微颔首：「有缘人，请进。」</span>', 'event');
      grantFateBlessing(f, 'daily');
    }
  } else if (f.fate >= 10 && (p.qiRealmIndex||0) < 12 && !f.progress.guardianBlessed) {
    // 🔧 天缘玩家（fate 10-29，修为金丹以下）：冰灵感应到宿命牵绊，放行但未完全臣服
    f.progress.guardianBlessed = true;
    addNarrative('<div style="border:1px solid #6a9ec966;border-radius:8px;padding:8px;margin:6px 0;">' +
      '<span style="font-weight:bold;color:#6a9ec9;">💫 守窟冰灵</span><br>' +
      '<span style="font-size:11px;">一个半透明的冰灵从法阵中浮现，它打量了你一番，冰蓝色的眸子里闪过一丝讶异——</span><br>' +
      '<span style="font-size:11px;">「竟有如此浅薄的修为……但你身上的气息，与主人有几分因果纠缠。」</span><br>' +
      '<span style="font-size:11px;">它侧身让开，声音缥缈：「既是天缘引你至此，便进去吧。莫要惊扰她。」</span></div>', 'milestone');
    grantFateBlessing(f, 'first');
  } else if ((p.qiRealmIndex||0) >= 12) {
    addNarrative('<div style="border:1px solid #c9a96e66;border-radius:8px;padding:8px;margin:6px 0;">' +
      '<span style="font-weight:bold;color:#c9a96e;">⚡ 守窟冰灵</span><br>' +
      '<span style="font-size:11px;">一个半透明的冰灵浮现，它打量了你一番——</span><br>' +
      '<span style="font-size:11px;">「修为倒是不错……但缘分未到，即便见了她也是徒增执念。」</span></div>', 'event');
  }
  
  // 首次进入
  if (!f.progress.visited) {
    f.progress.visited = true;
    f.stage = 1;
    f.firstMet = true;
    f.affinity = Math.max(f.affinity, 5);
    
    addNarrative('<div style="border:1px solid #6a9ec966;border-radius:8px;padding:10px;margin:6px 0;background:rgba(100,150,200,0.05);">' +
      '<div style="font-size:13px;font-weight:bold;color:#6a9ec9;">❄️ 万载冰窟·百里冰</div>' +
      '<div style="font-size:12px;line-height:1.6;margin-top:6px;">洞窟正中摆放着一具巨大的万年玄冰棺椁——棺中躺着一位绝美的女子，素衣如雪，长发如瀑。冰棺周围的寒气凝结成无数冰晶，如星辰般明灭闪烁。</div>' +
      '</div>', 'milestone');
    addNarrative('📜 冰棺侧面刻着古篆：「北极有女，名曰百里冰。修为穷天，天道不容，降劫冰封。万载沉睡，待有缘人。」', 'event');
    
    if (f.fate >= 30) {
      addNarrative('💫 你靠近冰棺时，棺中女子的眼睫微微颤动了一下。', 'event');
      f.lastAutoEventDay = G.time ? G.time.day : 0; // 防与 daily_resonance 重复
      triggerIceFairyAutoEvent(f, 'first_meet');
    } else if (f.fate >= 10) {
      // 🔧 天缘玩家首次进入：也有初次见面剧情（浅层共鸣）
      addNarrative('💫 你靠近冰棺，凝视着棺中女子的睡颜。冰棺上的寒气似乎柔和了几分——她仿佛在睡梦中感知到了你的存在。', 'event');
      f.lastAutoEventDay = G.time ? G.time.day : 0;
      triggerIceFairyAutoEvent(f, 'first_meet');
    } else {
      addNarrative('💫 你远远看着冰棺，心中涌起一阵莫名的悸动。', 'event');
    }
  } else {
    if (f.stage >= 2) autoCheckIceFairyEvents(f);
  }
  
  // 🎯 条件达成优先提示：进入时检测下一步可行动作，最先展示
  try {
    var prio = '';
    if (f.stage >= 1 && f.stage < 4) {
      var check2 = checkIceFairyItems();
      if (check2.complete && !f.progress.keyComplete) {
        prio = '🔥 五灵解封材料已集齐！快去启动解封仪式！';
      } else if (f.stage >= 3 && f.affinity >= 70 && !f.progress.bossDefeated) {
        prio = '⚔️ 她已苏醒，但守窟冰灵仍在阻拦——是时候击败它了！';
      }
    }
    if (f.stage >= 4 && f.affinity >= 90 && !f.progress.daoPartner) {
      prio = '💖 她看着你的眼神已不再清冷——羁绊已深，是时候表白了！';
    }
    if (prio) {
      addNarrative('<div style="border:1px solid #d4a5f966;border-radius:8px;padding:10px;margin:6px 0;background:rgba(200,100,200,0.07);">' +
        '<div style="font-size:12px;font-weight:bold;color:#d4a5f9;">✨ 天机指引</div>' +
        '<div style="font-size:11px;line-height:1.6;margin-top:4px;color:var(--text);">' + prio + '</div>' +
        '</div>', 'milestone');
    }
  } catch(e) {}
  
  showIceFairyPanel();
}

// ==========================
// 仙子面板
// ==========================
function showIceFairyPanel() {
  var f = getIceFairy();
  if (!f) return;
  var p = G.player;
  var check = checkIceFairyItems();
  var stageInfo = getIceFairyStageInfo();
  var fateInfo = getFateLabel(f.fate || 10);
  
  // 🔧 强制重置弹窗状态：当前弹窗开着时重新渲染会被排队吞掉 → 看起来“点了没反应”
  if (typeof resetModalState === 'function') resetModalState();
  
  var html = '<div style="padding:4px;">';
  
  // 阶段进度条
  var stageBar = '';
  for (var si = 0; si < 6; si++) {
    var done = f.stage >= si;
    var cur = f.stage === si;
    stageBar += '<span style="display:inline-block;width:20px;height:20px;line-height:20px;text-align:center;border-radius:50%;font-size:10px;margin-right:2px;' +
      (done ? 'background:#6a9ec9;color:white;' : cur ? 'background:#c9a96e;color:black;' : 'background:rgba(255,255,255,0.08);color:var(--text-dim);') +
      '">' + (done ? '✓' : (si+1)) + '</span>';
  }
  html += '<div style="font-size:10px;text-align:center;margin-bottom:4px;">' + stageBar + '</div>';
  html += '<div style="text-align:center;margin-bottom:4px;"><span style="font-size:11px;color:' + fateInfo.color + ';">' + fateInfo.label + '</span><span style="font-size:10px;color:var(--text-dim);margin-left:4px;">[' + f.fate + '/100]</span></div>';
  html += '<div style="font-size:10px;text-align:center;color:var(--text-dim);margin-bottom:8px;">' + stageInfo.label + ' · 羁绊 ' + f.affinity + '/' + stageInfo.nextAffinity + '</div>';
  
  html += '<div style="border:1px solid #6a9ec944;border-radius:6px;padding:8px;margin-bottom:8px;background:rgba(100,150,200,0.04);">';
  html += '<div style="font-size:12px;font-weight:bold;color:#6a9ec9;">🧊 百里冰</div>';
  html += '<div style="font-size:9px;color:var(--text-dim);margin:3px 0;">' + stageInfo.desc + '</div>';
  if (f.chatCount > 0) html += '<div style="font-size:9px;color:var(--text-dim);">已交流' + f.chatCount + '次</div>';
  html += '</div>';
  
  html += '<div style="font-size:11px;font-weight:bold;color:var(--text-dim);margin-bottom:4px;">📋 可进行</div>';
  
  // 🎯 条件达成优先：满足下一步关键条件的行动排最前（带✨标识）
  var prioBtns = [];
  if (f.stage >= 4 && f.affinity >= 90 && !f.progress.daoPartner) {
    prioBtns.push('<div class="event-choice-btn" onclick="iceFairyDaoPartner()" style="margin-bottom:3px;text-align:left;font-size:11px;padding:6px 8px;border-color:#e8a0d0;background:rgba(200,100,150,0.15);animation:fairyPulse 1.6s infinite;">💖 ✨ 表白结为道侣</div>');
  }
  if (f.stage >= 1 && f.stage < 4) {
    var pc = checkIceFairyItems();
    if (pc.complete && !f.progress.keyComplete) {
      prioBtns.push('<div class="event-choice-btn" onclick="tryPartialThaw()" style="margin-bottom:3px;text-align:left;font-size:11px;padding:6px 8px;border-color:#6a9ec9;background:rgba(100,150,200,0.15);animation:fairyPulse 1.6s infinite;">🔥 ✨ 启动解封仪式（材料已集齐）</div>');
    }
  }
  if (f.stage >= 3 && f.affinity >= 70 && !f.progress.bossDefeated) {
    prioBtns.push('<div class="event-choice-btn" onclick="defeatIceGuardian()" style="margin-bottom:3px;text-align:left;font-size:11px;padding:6px 8px;border-color:#e74c3c;background:rgba(200,60,50,0.12);animation:fairyPulse 1.6s infinite;">⚔️ ✨ 击败冰封守护灵</div>');
  }
  prioBtns.forEach(function(b){ html += b; });
  
  if (f.stage >= 1) {
    html += '<div class="event-choice-btn" onclick="startIceFairyChat()" style="margin-bottom:3px;text-align:left;font-size:11px;padding:6px 8px;">💬 与百里冰对话</div>';
  }
  
  if (f.fate >= 10 || f.stage >= 2) {
    if (f.stage >= 1 && f.stage < 4 && !f.progress.keyComplete) {
      html += '<div class="event-choice-btn" onclick="showIceFairyItemGuide()" style="margin-bottom:3px;text-align:left;font-size:11px;padding:6px 8px;">🔍 寻找解封材料（' + check.have + '/' + check.total + '）</div>';
      if (check.complete && !f.progress.keyComplete) {
        // 已在优先区显示，这里不再重复
      }
    }
    if (f.stage >= 2 && f.stage < 3 && f.affinity >= 40) {
      html += '<div class="event-choice-btn" onclick="advanceIceFairyStage()" style="margin-bottom:3px;text-align:left;font-size:11px;padding:6px 8px;border-color:#c9a96e;">✨ 以道心之力唤醒</div>';
    }
    if (f.stage >= 3 && f.affinity >= 70 && !f.progress.bossDefeated) {
      // 已在优先区显示
    }
    if (f.stage >= 4 && f.affinity >= 90 && !f.progress.daoPartner) {
      // 已在优先区显示
    }
    if (f.stage >= 5) {
      html += '<div class="event-choice-btn" onclick="iceFairyDualCultivate()" style="margin-bottom:3px;text-align:left;font-size:11px;padding:6px 8px;border-color:#d4a5f9;">☯️ 与百里冰双修</div>';
      // ☯️ 双人飞升按钮（炼气飞升+道侣+羁绊90+）
      if (typeof ascensionBtnHtml === 'function') {
        try { html += ascensionBtnHtml(); } catch(e) {}
      }
    }
  } else {
    html += '<div style="font-size:10px;color:#c9a96e;padding:8px;text-align:center;border:1px dashed rgba(200,170,100,0.3);border-radius:6px;margin:4px 0;">☯️ 缘份未到，很多功能尚未开启。<br><span style="font-size:9px;">多与她对话可增加缘份。</span></div>';
  }
  
  // 👶 子嗣区块（飞升后显示）
  if (typeof renderChildrenHtml === 'function') {
    try { html += renderChildrenHtml(); } catch(e) {}
  }
  html += '<div style="margin-top:6px;padding:6px;border-top:1px solid rgba(255,255,255,0.05);font-size:9px;color:' + fateInfo.color + ';text-align:center;">' + fateInfo.desc + '</div>';
  html += '<div class="event-choice-btn" onclick="closeEvent();" style="background:rgba(100,100,100,0.15);margin-top:4px;">离开冰窟</div>';
  html += '</div>';
  
  showCustomModal('❄️ 万载冰窟', html);
}

// ==========================
// 阶段信息
// ==========================
function getIceFairyStageInfo() {
  var f = getIceFairy();
  var stages = [
    { stage:0, label:'❄️ 未发现', nextAffinity:0, desc:'' },
    { stage:1, label:'💫 初遇·沉睡万载', nextAffinity:20, desc:'百里冰躺在冰棺中沉睡了万年。' },
    { stage:2, label:'🌟 苏醒·灵识初动', nextAffinity:40, desc:'冰棺开始融化，神识已能交流。' },
    { stage:3, label:'✨ 复苏·冰山渐融', nextAffinity:70, desc:'百里冰已能微微活动。' },
    { stage:4, label:'🌸 得救·冰释前缘', nextAffinity:90, desc:'百里冰脱离冰棺，获得新生。' },
    { stage:5, label:'💖 仙侣·白发同修', nextAffinity:100, desc:'已结为道侣。双修可得仙道至境。' },
  ];
  return stages[f.stage] || stages[5];
}

// ==========================
// 自动事件
// ==========================
function autoCheckIceFairyEvents(f) {
  var p = G.player;
  if (!p) return;
  var today = G.time ? G.time.day : 0;
  // 🔧 神识共鸣降频：每 3 天最多 1 次（原每天 1 次，用户反馈刷屏）
  var lastDay = f.lastAutoEventDay || 0;
  if (f.stage >= 2 && today - lastDay >= 3 && f.affinity >= 20) {
    f.lastAutoEventDay = today;
    triggerIceFairyAutoEvent(f, 'daily_resonance');
  }
}

async function triggerIceFairyAutoEvent(f, eventType) {
  var key = ICE_FAIRY_API_KEY;
  if (!key || key.indexOf('sk-') !== 0) return;
  var sc = getStageEventPrompt(f, eventType);
  if (!sc) return;
  try {
    var r = await fetch('https://api.deepseek.com/chat/completions', {
      method:'POST', headers:{'Content-Type':'application/json','Authorization':'Bearer '+key},
      body:JSON.stringify({
        model:'deepseek-chat',
        messages:[{role:'system',content:'你是百里冰，万年前被天道冰封的上古仙子。通过神识与有缘人交流。\n阶段：'+sc.stageDesc+'\n羁绊：'+f.affinity+'/100\n事件：'+sc.eventDesc+'\n\n用第一人称说20-60字。用（动作）开头或穿插。直接说。'},{role:'user',content:sc.userPrompt}],
        max_tokens:120,temperature:0.95
      })
    });
    if (!r.ok) throw new Error('API error');
    var d = await r.json();
    var reply = d.choices[0].message.content.trim();
    if (reply) {
      addNarrative('<div style="border:1px solid #6a9ec944;border-radius:6px;padding:8px;margin:4px 0;background:rgba(100,150,200,0.04);"><div style="font-size:10px;font-weight:bold;color:#6a9ec9;">🧊 百里冰 · 神识</div><div style="font-size:12px;line-height:1.6;margin-top:4px;">'+reply+'</div></div>','narr-event');
      return;
    }
  } catch(e) { console.warn('Ice fairy auto event failed:',e); }
  var fb = {first_meet:'（一缕幽蓝的神识轻轻触碰着你的意识）你是谁……这里是哪里……',daily_resonance:'（你的神识与她产生了共鸣）你又来看我了……真好。'};
  var ft = fb[eventType]||'（冰棺中传来一阵微弱的精神波动）';
  addNarrative('<div style="border:1px solid #6a9ec944;border-radius:6px;padding:8px;margin:4px 0;"><div style="font-size:10px;font-weight:bold;color:#6a9ec9;">🧊 百里冰 · 神识</div><div style="font-size:12px;line-height:1.6;margin-top:4px;">'+ft+'</div></div>','narr-event');
}

function getStageEventPrompt(f, eventType) {
  var stage = f.stage;
  var sm = {1:{sd:'初遇·沉睡',ed:'第一次有人来'},2:{sd:'苏醒·意识恢复',ed:'每日灵力共鸣'},3:{sd:'复苏·道心恢复',ed:'羁绊加深'},4:{sd:'得救·重生',ed:'自由喜悦'},5:{sd:'仙侣·道侣',ed:'亲密私语'}};
  var info = sm[stage]||sm[Math.min(stage,5)]||sm[1];
  info.ed = {first_meet:'万年来第一次有人踏入此地',daily_resonance:'每日灵力共鸣',stage_up:'阶段推进的关键时刻'}[eventType]||info.ed;
  return {stageDesc:info.sd,eventDesc:info.ed,userPrompt:{first_meet:'你是被封印了万年的仙子，今天终于有人来了。你有什么感觉？',daily_resonance:'那个有缘人又来看你了。你想对ta说什么？',stage_up:'你的状态刚刚发生了重要变化。心里有什么感受？'}[eventType]||'说段话吧。'};
}

// ==========================
// ★ 专属AI聊天
// ==========================
function startIceFairyChat() {
  var f = getIceFairy();
  if (!f) return;
  var p = G.player;
  if (!p._iceFairyChatHistory) p._iceFairyChatHistory = [];
  showIceFairyChatModal();
}

function escapeHtml(s) {
  if (typeof s !== 'string') return String(s||'');
  return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

function showIceFairyChatModal() {
  var f = getIceFairy();
  var p = G.player;
  if (!f||!p) return;
  // 🔧 聊天框打开时：无活跃委托 → 自动生成一个（保证顶部有委托条+📦献物按钮）
  try {
    if (!f._iceRequests) f._iceRequests = [];
    if (!getIceFairyRequest() && typeof newIceFairyRequest === 'function') {
      newIceFairyRequest();
    }
  } catch(e) {}
  // 🔧 强制重置弹窗状态：防止其他弹窗未关导致 _modalBusy 卡住、聊天框排队不显示
  if (typeof resetModalState === 'function') resetModalState();
  var history = p._iceFairyChatHistory||[];
  var stageInfo = getIceFairyStageInfo();
  var fateInfo = getFateLabel(f.fate || 10);
  
  // 当前阶段对应的立绘（可自定义）
  var portraits = f.portraits || {};
  var stageKey = 's' + (f.stage || 1);
  var curPortrait = portraits[stageKey] || 'img/ice_fairy_portrait.png';
  var stageName = ['沉睡','初遇','苏醒','复苏','得救','仙侣'][Math.min((f.stage||1)-1, 5)] || '初遇';
  
  // 左右布局：左图片（固定9:16完整显示，不拉伸）+ 右聊天区（仅气泡滚动，输入框固定）
  var html = '<div style="padding:0;height:100%;display:flex;flex-direction:column;overflow:hidden;">' +
    '<div style="display:flex;height:100%;flex:1;min-height:0;background:linear-gradient(135deg,#0a0e1a 0%,#141c2e 50%,#0e1628 100%);border-radius:8px;overflow:hidden;">' +
      // ── 左：立绘列（固定宽，图片9:16完整显示，下方名牌）──
      '<div style="flex:0 0 260px;display:flex;flex-direction:column;border-right:1px solid rgba(100,150,200,0.12);flex-shrink:0;background:rgba(10,14,26,0.4);overflow:hidden;">' +
        // 图片容器：固定 9:16 比例，完整显示不裁切
        '<div style="position:relative;width:100%;aspect-ratio:9/16;flex-shrink:0;overflow:hidden;background:rgba(0,0,0,0.3);">' +
          '<div id="ice-portrait-img" style="position:absolute;inset:0;background:url(' + curPortrait + ') center center/contain no-repeat;z-index:0;"></div>' +
          '<div style="position:absolute;inset:0;background:linear-gradient(180deg,rgba(10,14,26,0) 0%,rgba(10,14,26,0.15) 70%,rgba(10,14,26,0.6) 100%);z-index:1;"></div>' +
          // 换图按钮（右上角）
          '<div style="position:absolute;top:6px;right:6px;z-index:3;">' +
            '<button onclick="openIcePortraitPicker()" title="更换当前阶段立绘" style="padding:4px 8px;border-radius:6px;border:1px solid rgba(160,190,220,0.3);background:rgba(10,14,26,0.6);color:#a0c4e8;font-size:10px;cursor:pointer;font-family:inherit;">🎨 换装</button>' +
          '</div>' +
        '</div>' +
        // 底部名牌（固定区域，不随图片滚动）
        '<div style="padding:10px 8px;text-align:center;flex-shrink:0;">' +
          '<div style="font-size:15px;font-weight:bold;color:#a0c4e8;">百里冰</div>' +
          '<div style="font-size:10px;color:' + fateInfo.color + ';">' + fateInfo.label + '</div>' +
          '<div style="font-size:9px;color:rgba(160,180,200,0.4);margin-top:2px;">' + stageName + ' · 羁绊 ' + f.affinity + '</div>' +
        '</div>' +
      '</div>' +
      // ── 右：聊天区（flex列，自己撑满剩余空间）──
      '<div style="flex:1;display:flex;flex-direction:column;min-width:0;overflow:hidden;">' +
        // 当前委托状态条（有委托时显示）
        iceRequestBannerHtml() +
        // 聊天记录（独立滚动，阻止滚动穿透到页面）
        '<div id="ice-chat-log" style="flex:1;overflow-y:auto;padding:8px 10px;min-height:0;overscroll-behavior:contain;">'
  
  if (history.length===0) {
    html += '<div style="display:flex;align-items:center;justify-content:center;height:100%;flex-direction:column;gap:6px;">' +
      '<div style="font-size:28px;">🧊</div>' +
      '<div style="font-size:14px;color:#a0b4cc;text-align:center;">与百里冰开始第一次对话……</div>' +
      '<div style="font-size:10px;color:rgba(160,180,204,0.4);text-align:center;">你的每一个字，都会触动她的心弦</div></div>';
  } else {
    history.forEach(function(msg) {
      var isP = msg.role==='player';
      if (msg.dual) {
        // 🔧 双修消息：AI 唯美描写，特殊样式（紫金边+☯️标识）
        html += '<div style="margin:6px 0;">' +
          '<div style="font-size:9px;color:#d4a5f9;margin-bottom:2px;font-weight:bold;">☯️ 与霜华双修</div>' +
          '<div style="display:inline-block;padding:8px 12px;border-radius:10px;max-width:92%;font-size:13px;line-height:1.9;color:#e8dcf8;border:1px solid rgba(212,165,249,0.35);background:rgba(212,165,249,0.08);word-wrap:break-word;overflow-wrap:break-word;">' + msg.text + '</div></div>';
        return;
      }
      html += '<div style="margin-bottom:4px;text-align:' + (isP?'right':'left') + ';">' +
        '<div style="display:inline-block;padding:5px 10px;border-radius:10px;max-width:85%;font-size:13px;line-height:1.6;word-wrap:break-word;overflow-wrap:break-word;' +
          (isP ? 'background:rgba(100,150,200,0.25);color:#dce8ff;' : 'background:rgba(180,200,230,0.08);color:#c8d4e4;border:1px solid rgba(180,200,230,0.08);') + '">' +
        '<div style="font-size:9px;color:' + (isP?'rgba(200,220,255,0.4)':'rgba(180,200,220,0.35)') + ';margin-bottom:2px;font-weight:bold;">' + (isP?'你':'🧊 百里冰') + '</div>' + escapeHtml(msg.text) + '</div></div>';
    });
  }
  
  html += '</div>' +
        // 底部输入区
        '<div style="padding:6px 10px 8px;flex-shrink:0;">' +
        '<div style="display:flex;gap:6px;">' +
        '<input id="ice-chat-input" type="text" placeholder="对百里冰说..." ' +
          'style="flex:1;padding:12px 14px;border-radius:8px;border:1px solid rgba(180,200,230,0.12);background:rgba(0,0,0,0.4);color:#dce8ff;font-size:16px;outline:none;min-width:0;height:44px;box-sizing:border-box;" ' +
          'onkeydown="if(event.key===\'Enter\'){sendIceFairyMessage();}">' +
        '<button onclick="sendIceFairyMessage();" style="flex:0 0 auto;height:44px;padding:0 22px;border-radius:8px;border:1px solid rgba(100,150,200,0.35);background:rgba(100,150,200,0.2);color:#dce8ff;font-size:15px;cursor:pointer;font-family:inherit;">发送</button></div>' +
        '<div style="display:flex;gap:6px;margin-top:6px;">' +
        '<button onclick="triggerIceFairyAutoEvent(getIceFairy(),\'daily_resonance\');showIceFairyChatModal();" style="flex:0 0 auto;padding:5px 12px;border-radius:6px;border:1px solid rgba(180,200,230,0.12);background:rgba(180,200,230,0.06);color:#9fb4cc;font-size:11px;cursor:pointer;font-family:inherit;">❄️ 神识共鸣</button>' +
        ((f.stage||0) >= 5 ? '<button onclick="onDualCultivateClick()" style="flex:0 0 auto;padding:5px 12px;border-radius:6px;border:1px solid rgba(212,165,249,0.35);background:rgba(212,165,249,0.12);color:#d4a5f9;font-size:11px;cursor:pointer;font-family:inherit;">☯️ 双修</button>' : '') +
        '<button onclick="closeEvent();" style="flex:0 0 auto;padding:5px 12px;border-radius:6px;border:1px solid rgba(180,200,230,0.12);background:rgba(180,200,230,0.06);color:#9fb4cc;font-size:11px;cursor:pointer;font-family:inherit;">离开</button></div></div></div></div></div>';
  showCustomModal('💬 与百里冰对话', html, {wide:true, noCloseBtn:true});
  if (typeof makeModalResizable === 'function') {
    var ob = document.getElementById('event-body').closest('.overlay-box');
    if (ob) makeModalResizable(ob);
  }
  ensureIceChatKeyHook();
  setTimeout(function(){
    var el=document.getElementById('ice-chat-input');
    if(el){el.focus();el.select();}
    var log=document.getElementById('ice-chat-log');
    if(log) log.scrollTop = log.scrollHeight;
  },300);
}

// ==========================
// 发送消息（增量追加，不关弹窗）
// ==========================
// 全局键盘钩子：弹窗开着时，按可打印字符自动聚焦输入框（省去鼠标点击）
var _iceChatKeyHookInstalled = false;
function ensureIceChatKeyHook() {
  if (_iceChatKeyHookInstalled) return;
  _iceChatKeyHookInstalled = true;
  document.addEventListener('keydown', function(e) {
    var overlay = document.getElementById('event-overlay');
    if (!overlay || overlay.classList.contains('hidden')) return;
    var inp = document.getElementById('ice-chat-input');
    if (!inp) return;
    // 如果焦点不在输入框、不在其他输入控件，且按的是可打印字符，自动聚焦（不拦截默认行为，让浏览器正常输入）
    var ae = document.activeElement;
    var typing = ae && (ae.tagName === 'INPUT' || ae.tagName === 'TEXTAREA' || ae.isContentEditable);
    if (!typing && e.key && e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
      inp.focus();
    }
  }, true);
  // 备用：keypress 阶段再次确保焦点，字符正常进入输入框
  document.addEventListener('keypress', function(e) {
    var overlay = document.getElementById('event-overlay');
    if (!overlay || overlay.classList.contains('hidden')) return;
    var inp = document.getElementById('ice-chat-input');
    if (!inp) return;
    var ae = document.activeElement;
    var typing = ae && (ae.tagName === 'INPUT' || ae.tagName === 'TEXTAREA' || ae.isContentEditable);
    if (!typing && e.key && e.key.length === 1) {
      inp.focus();
    }
  }, true);
}

async function sendIceFairyMessage() {
  if (_iceFairyChatting) { addNarrative('（百里冰正在思考中）','system'); return; }
  var inp = document.getElementById('ice-chat-input');
  if (!inp) return;
  var text = inp.value.trim();
  if (!text) return;
  inp.value='';
  var f = getIceFairy(), p = G.player;
  if (!f||!p) return;
  if (!p._iceFairyChatHistory) p._iceFairyChatHistory=[];
  p._iceFairyChatHistory.push({role:'player',text:text});
  // 增量追加玩家消息气泡（不关弹窗）
  var log = document.getElementById('ice-chat-log');
  if (log) {
    var bubble = '<div style="margin-bottom:4px;text-align:right;"><div style="display:inline-block;padding:5px 10px;border-radius:10px;max-width:80%;font-size:13px;line-height:1.6;background:rgba(100,150,200,0.25);color:#dce8ff;"><div style="font-size:9px;color:rgba(200,220,255,0.4);margin-bottom:2px;font-weight:bold;">你</div>' + escapeHtml(text) + '</div></div>';
    log.insertAdjacentHTML('beforeend', bubble);
    log.scrollTop = log.scrollHeight;
  }
  // 发送后立即恢复焦点（不等AI回复），并保持滚动在底部
  function keepFocus() {
    if (inp && document.activeElement !== inp) {
      try { inp.focus(); } catch(e) {}
    }
    if (log) log.scrollTop = log.scrollHeight;
  }
  keepFocus();
  _iceFairyChatting = true;
  var reply = await callIceFairyAI(f, text);
  _iceFairyChatting = false;
  p._iceFairyChatHistory.push({role:'npc',text:reply});
  // 📜 解析AI回复中的委托标记【寻:物品:数量】
  var newReq = null;
  try { newReq = parseIceFairyRequest(reply); } catch(e) { console.warn('parse request failed:', e); }
  if (newReq) {
    var logr = document.getElementById('ice-chat-log');
    if (logr) {
      var rb = '<div style="margin-bottom:6px;text-align:left;"><div style="display:inline-block;max-width:88%;padding:6px 10px;border-radius:10px;font-size:13px;line-height:1.6;background:rgba(90,130,190,0.10);color:#b8cce0;border:1px solid rgba(120,170,230,0.18);">' +
        '<div style="font-size:9px;color:rgba(160,200,240,0.45);margin-bottom:2px;font-weight:bold;">🧊 百里冰</div>' +
        '<div>📜 她向你提出委托：带 <b style="color:#e8c878;">' + newReq.itemName + '×' + newReq.qty + '</b> 给她</div>' +
        '<div style="font-size:10px;color:var(--text-dim);margin-top:2px;">（聊天框顶部会显示委托进度，找到后点「📦 献物」即可）</div>' +
        '</div></div>';
      logr.insertAdjacentHTML('beforeend', rb);
      logr.scrollTop = logr.scrollHeight;
    }
  }
  // 兜底：每12次聊天若无委托，本地生成一个
  if (!getIceFairyRequest() && (f.chatCount||0) > 0 && (f.chatCount % 12 === 0)) {
    try { newIceFairyRequest(); } catch(e) {}
  }
  f.affinity = Math.min(100, f.affinity + 1);
  f.chatCount = (f.chatCount||0)+1;
  f.lastChatTime = Date.now();
  gainFateFromChat();
  if (f.chatCount%10===0 && f.stage>=1 && f.stage<=3) triggerIceFairyAutoEvent(f,'stage_up');
  // 增量追加NPC回复气泡
  if (log) {
    var bubble2 = '<div style="margin-bottom:4px;text-align:left;"><div style="display:inline-block;padding:5px 10px;border-radius:10px;max-width:80%;font-size:13px;line-height:1.6;background:rgba(180,200,230,0.08);color:#c8d4e4;border:1px solid rgba(180,200,230,0.08);"><div style="font-size:9px;color:rgba(180,200,220,0.35);margin-bottom:2px;font-weight:bold;">🧊 百里冰</div>' + escapeHtml(reply) + '</div></div>';
    log.insertAdjacentHTML('beforeend', bubble2);
    log.scrollTop = log.scrollHeight;
  }
  // AI回复到达后先恢复焦点 + 滚动底部（再刷新UI，避免UI刷新异常影响焦点）
  keepFocus();
  try { updateAllUI(); } catch(e) { console.warn('updateAllUI failed:', e); }
  // 🎁 仙子指点：AI回复后按概率触发（20%）
  if (Math.random() < 0.2) {
    try { iceFairyTip(); } catch(e) { console.warn('iceFairyTip failed:', e); }
  }
  keepFocus();
  // 双保险：再延迟一次
  setTimeout(keepFocus, 120);
}

// ==========================
// 百里冰 AI 对话（DeepSeek）
// ==========================
var _iceFairyChatting = false;

// ==========================
// 🛰️ 玩家行踪与生平感知（结缘后生效）
// ==========================
// 构建冰仙子能“看到”的玩家信息：当前位置 + 最近行踪 + 人生大事
function buildIceFairyPlayerPerception(f) {
  var p = G.player;
  if (!p) return '';
  
  var lines = [];
  
  // ① 当前位置（行踪核心）
  try {
    var scene = typeof getSceneData === 'function' ? getSceneData(G.currentScene) : null;
    var sceneName = (scene && scene.name) || G.currentScene || '某处';
    lines.push('【他的行踪】你感应到，他此刻正在「' + sceneName + '」。');
  } catch(e) {}
  
  // ② 最近事件（从叙事/大事记/事件史取最近几条，不重复）
  var recentEvents = [];
  var seen = {};
  var pushEvent = function(t) {
    if (!t || seen[t]) return;
    seen[t] = true;
    recentEvents.push(t);
  };
  try {
    (G.lifeChronicle || []).slice(-8).forEach(function(c) { pushEvent(typeof c === 'string' ? c : (c.text || c.title || '')); });
  } catch(e) {}
  try {
    (p.eventHistory || []).slice(-8).forEach(function(t) { pushEvent(String(t)); });
  } catch(e) {}
  try {
    (G.narrativeHistory || []).slice(-6).forEach(function(n) {
      if (n && n.type && ['breakthrough','milestone','epic','loot-rare','loot-legend'].indexOf(n.type) !== -1) {
        pushEvent(String(n.text || '').replace(/<[^>]+>/g, '').slice(0, 50));
      }
    });
  } catch(e) {}
  
  if (recentEvents.length > 0) {
    lines.push('【他最近的事】' + recentEvents.slice(0, 6).join('；'));
  }
  
  // ③ 修为基础（境界）
  try {
    var realmName = '凡人';
    if (typeof QI_REALMS !== 'undefined' && QI_REALMS[p.qiRealmIndex]) realmName = QI_REALMS[p.qiRealmIndex].name;
    lines.push('【他的修为】如今已是「' + realmName + '」。');
  } catch(e) {}
  
  // ④ 道侣相关（结缘后）
  if (f && f.stage >= 5) {
    lines.push('【你们的关系】你们已结为道侣。她会留意心上人的一举一动，牵挂他的安危与去处。');
  }
  
  if (lines.length === 0) return '';
  return lines.join('\n');
}

async function callIceFairyAI(f, playerText) {
  var p = G.player;
  var key = ICE_FAIRY_API_KEY;
  // 仅基础检查：key 缺失或格式明显错误才走本地回复（真实 key 正常走 API）
  if (!key || key.indexOf('sk-') !== 0) return fallbackIceFairyReply(f, playerText);
  var stage = f.stage||1;
  var history = p._iceFairyChatHistory||[];
  var recent = history.slice(-8).map(function(h){return (h.role==='player'?'有缘人':'百里冰')+'：'+h.text;}).join('\n');
  
  var stagePrompt = '';
  if (stage<=1) stagePrompt = '你被封印在万年玄冰棺中沉睡了上万年，神识非常微弱。话语断断续续，充满迷茫。';
  else if (stage<=2) stagePrompt = '冰棺开始融化，意识清晰了很多。心里有一丝温暖。但仍被万年的孤寂所困。';
  else if (stage<=3) stagePrompt = '道心在恢复，开始信任这个人。能微微活动手指。话语中带着感激和希望。';
  else if (stage<=4) stagePrompt = '刚刚从万年冰封中解脱。声音清冷却带着笑意，对一切都感到新奇。对拯救者有深厚感激。';
  else stagePrompt = '你们已结为道侣。话语中带着自然的亲密和温柔。清冷外表下藏着对道侣的依恋。';
  
  // 🛰️ 结缘后：注入玩家行踪与生平（她能看到心上人的一切）
  var perception = '';
  if (stage >= 5) {
    try { perception = buildIceFairyPlayerPerception(f); } catch(e) { console.warn('buildIceFairyPlayerPerception failed:', e); }
  }
  
  var sys = '你是百里冰，万年前被天道封印的仙子。\n【当前状态】\n- 阶段：'+['沉睡','初遇','苏醒','复苏','得救','仙侣'][stage]+'\n- 羁绊：'+f.affinity+'/100\n'+stagePrompt+'\n\n【规则】\n1. 用（动作）开头或穿插\n2. 回复15-50字\n3. 自然地回应对方括号内容\n4. 绝对不说"作为AI""作为NPC"之类\n5. 羁绊越高语气越亲近\n6. 偶尔（大约每3-5次对话一次）可以向对方提出一个小需求——想要某样物品（如寒玉髓、雪莲子、云气草、悟道叶、瑶池冰莲、玄铁精粹、千年灵芝、冰魄泪）。用【寻:物品名:数量】的格式写在回复末尾，例如【寻:寒玉髓:3】。物品要说得像随口一提，不是硬要。\n\n'+(perception ? '【你感知到的他】\n'+perception+'\n\n' : '')+(recent?'【最近对话】\n'+recent+'\n\n':'')+'直接以百里冰身份回复。';
  try {
    // 🔧 超时保护：10秒无响应走本地兜底回复，防止 _iceFairyChatting 卡死（对话再无反应）
    var ctrl = new AbortController();
    var timer = setTimeout(function(){ try { ctrl.abort(); } catch(e) {} }, 10000);
    var r = await fetch('https://api.deepseek.com/chat/completions', {
      method:'POST', headers:{'Content-Type':'application/json','Authorization':'Bearer '+key},
      body:JSON.stringify({model:'deepseek-chat',messages:[{role:'system',content:sys},{role:'user',content:playerText}],max_tokens:120,temperature:0.95}),
      signal: ctrl.signal
    });
    clearTimeout(timer);
    if (!r.ok) throw new Error('API error');
    var d = await r.json();
    var reply = d.choices[0].message.content.trim();
    if (reply) return reply;
  } catch(e) { console.warn('Ice fairy chat failed:',e); }
  return fallbackIceFairyReply(f, playerText);
}

function fallbackIceFairyReply(f, text) {
  var aff = f.affinity||0, stage = f.stage||1;
  if (stage<=1) return ['（神识微弱地波动）你……是谁……','（冰棺寒雾轻轻浮动）我睡了……多久……'][Math.floor(Math.random()*2)];
  if (stage<=2) return ['（意识清晰了许多）外面……是什么样子？','（一缕蓝光绕着你转了一圈）你的气息……让我想起了一些事……'][Math.floor(Math.random()*2)];
  if (stage<=3) return ['（指尖微微一颤）是……你的温度吗？','（嘴角有了一丝极淡的弧度）你每天都来……真好。'][Math.floor(Math.random()*2)];
  if (stage<=4) return ['（缓缓抬眸，眸中映着你的影子）我终于可以好好看你了。','（低头浅笑）自由的感觉……原来是这样的。'][Math.floor(Math.random()*2)];
  return ['（靠在你肩上）和你一起看这世间……真好。','（眉眼弯弯）万年的等待，只为了遇见你。'][Math.floor(Math.random()*2)];
}
function showIceFairyItemGuide() {
  var check = checkIceFairyItems();
  
  var html = '<div style="padding:4px;">';
  html += '<div style="font-size:11px;color:var(--text-dim);margin-bottom:6px;">要融化万年玄冰，需要五件天地灵物：</div>';
  
  ICE_FAIRY_ITEMS.forEach(function(it) {
    var have = G.player.inventory && G.player.inventory.some(function(i) { return i.id === it.id; });
    
    // 是否有技能或境界限制
    var canFind = true;
    var limitNote = '';
    if (it.id === 'ice_fairy_fire') {
      // 涅槃火种需要火灵根或去过烈焰谷
      var hasFire = G.player.spiritRoots && G.player.spiritRoots.includes('火');
      var visited = G.visitedScenes && G.visitedScenes.includes('lieyan_valley');
      if (!hasFire && !visited) { canFind = false; limitNote = '(建议先探索烈焰谷)'; }
    }
    if (it.id === 'ice_fairy_tear' && it.scene === 'bibo_lake') {
      var visitedLake = G.visitedScenes && G.visitedScenes.includes('bibo_lake');
      if (!visitedLake) { canFind = false; limitNote = '(需要先到过碧波湖)'; }
    }
    
    var sceneData = typeof getSceneData === 'function' ? getSceneData(it.scene) : null;
    var sceneName = sceneData ? sceneData.name : it.scene;
    
    html += '<div style="border-bottom:1px solid rgba(255,255,255,0.05);padding:6px 0;">' +
      '<div style="display:flex;align-items:center;justify-content:space-between;">' +
      '<span style="font-size:11px;">' + (have ? '✅' : '🔲') + ' ' + it.name + '</span>' +
      '<span style="font-size:10px;color:' + (have ? '#6a9ec9' : 'var(--text-dim)') + ';">→ ' + sceneName + '</span>' +
      '</div>' +
      '<div style="font-size:10px;color:var(--text-dim);margin-top:2px;">' + it.desc + '</div>' +
      (canFind && !have ? '<div style="font-size:10px;color:var(--accent);margin-top:2px;cursor:pointer;" onclick="navigateToIceFairyItemScene(\'' + it.scene + '\');">🚶 前往此地寻找</div>' : '') +
      (limitNote ? '<div style="font-size:10px;color:#d46a3a;margin-top:2px;">' + limitNote + '</div>' : '') +
      '</div>';
  });
  
  html += '<div class="event-choice-btn" onclick="showIceFairyPanel()" style="font-size:10px;">返回</div>';
  html += '</div>';
  
  showCustomModal('🔍 五灵解封', html);
}

function navigateToIceFairyItemScene(sceneId) {
  if (typeof moveToScene === 'function') {
    if (G.currentScene === sceneId) {
      addNarrative('你已经在这里了。', 'system');
      showIceFairyItemGuide();
      return;
    }
    closeEvent(); // 关掉弹窗
    moveToScene(sceneId);
  }
}

// ==========================
// 场景交互：北极场景中找解封材料
// ==========================
function tryFindIceFairyItem(sceneId) {
  var f = getIceFairy();
  if (!f) return false;
  // 🔧 放宽：不限 stage（解封完成后委托仍要这些物品，探索继续掉落）
  
  // 看这个场景有什么材料
  var item = ICE_FAIRY_ITEMS.find(function(it) { return it.scene === sceneId; });
  if (!item) return false;
  
  // 概率获得（50%基础概率，道心高的修士更容易有机缘）——交完委托后也容易刷回
  var p = G.player;
  if (!p || !p.inventory) return false;
  var chance = 0.50 + (p.daoHeart || 50) / 500;
  if (Math.random() < chance) {
    var itemData = ITEM_DB.find(function(i) { return i.id === item.id; });
    if (itemData && typeof addItemToInventory === 'function') {
      // 🔧 已有 → 叠加；一次获得 4 个（用户要求数量改 4）
      var exist = p.inventory.find(function(i) { return i.id === item.id; });
      if (exist) {
        exist.qty = (exist.qty || 1) + 4;
        addNarrative('❄️ ' + item.findDesc + '（' + item.name + '×4）', 'loot');
      } else {
        addItemToInventory(itemData, 4);
        addNarrative('❄️ ' + item.findDesc + '（' + item.name + '×4）', 'loot');
      }
      addNarrative('（五灵解封材料+4）', 'quest');
      f.progress.itemsCollected = (f.progress.itemsCollected || 0) + 4;
      updateAllUI();
      return true;
    }
  }
  return false;
}

// ==========================
// 部分解封仪式
// ==========================
function tryPartialThaw() {
  var f = getIceFairy();
  if (!f) return;
  
  var p = G.player;
  f.progress.keyComplete = true;
  f.affinity = Math.min(100, f.affinity + 15);
  
  // 消耗五件材料（每件各1个；若 qty>1 只扣1个，剩余保留——解封材料同时是委托物品）
  ICE_FAIRY_ITEMS.forEach(function(it) {
    var itemData = ITEM_DB.find(function(i) { return i.id === it.id; });
    if (itemData) {
      // 从背包移除1个（qty>1 时减1，qty==1 时移除条目）
      var idx = p.inventory.findIndex(function(i) { return i.id === it.id; });
      if (idx !== -1) {
        var itm = p.inventory[idx];
        if ((itm.qty || 1) > 1) {
          itm.qty -= 1;
        } else {
          p.inventory.splice(idx, 1);
        }
      }
    }
  });
  
  f.stage = 2;
  
  addNarrative('<div style="border:1px solid #6a9ec966;border-radius:8px;padding:10px;margin:6px 0;background:rgba(100,150,200,0.08);">' +
    '<div style="font-size:13px;font-weight:bold;color:#6a9ec9;">✨ 冰山初融</div>' +
    '<div style="font-size:12px;line-height:1.6;margin-top:4px;">你按照冰棺铭文的指引，将五件天地灵物按五行方位摆放在冰棺周围。瑶池冰莲放置于北，寒玉髓置于南，涅槃火种烘烤着冰棺底部，冰魄泪悬于棺顶，玄冰之心嵌入棺盖中央的凹槽。<br><br>随着你注入灵力，五件灵物同时发出绚丽的光芒——冰棺开始缓缓融化了！冰面上浮现出细密的裂纹，一缕幽蓝的光华从裂纹中溢出。棺中的仙子睫毛轻轻颤动了一下。<br><br>「……谢……谢……你……」</div>' +
    '</div>', 'milestone');
  
  // 奖励
  p.wisdom = Math.min(100, (p.wisdom || 50) + 5);
  p.mood = Math.min(100, (p.mood || 50) + 15);
  addNarrative('🧠 悟性+5 · 心境+15', 'loot');
  
  updateAllUI();
  showIceFairyPanel();
}

// ==========================
// 道心唤醒（进阶解封）
// ==========================
function advanceIceFairyStage() {
  var f = getIceFairy();
  if (!f) return;
  
  var p = G.player;
  if (f.affinity < 40) {
    addNarrative('羁绊不够深厚，你的道心之力无法触及她。继续交流增进感情吧。', 'system');
    return;
  }
  
  f.stage = 3;
  f.affinity = Math.min(100, f.affinity + 10);
  
  addNarrative('<div style="border:1px solid #c9a96e66;border-radius:8px;padding:10px;margin:6px 0;background:rgba(200,170,100,0.06);">' +
    '<div style="font-size:13px;font-weight:bold;color:#c9a96e;">🌟 道心共鸣</div>' +
    '<div style="font-size:12px;line-height:1.6;margin-top:4px;">你在冰棺前盘膝坐下，将手掌贴在冰面上。一股刺骨的寒意从掌心传来，但你忍住没有收回手。<br><br>你闭上双眼，将自己的道心化作一缕温暖的光芒，缓缓注入冰棺之中。<br><br>你感受到了——那是一个被囚禁了万年的孤独灵魂。她的意识如同一团微弱的火焰，在绝望中始终不曾熄灭。当你的道心触碰到那团火焰时，火焰猛地跳了一下，然后温柔地包裹住了你的光芒。<br><br>冰棺上的裂纹又扩大了几分。她的嘴角似乎浮起了一丝极淡的笑意。</div>' +
    '</div>', 'milestone');
  
  p.daoHeart = Math.min(200, (p.daoHeart || 50) + 8);
  p.mood = Math.min(100, (p.mood || 50) + 10);
  addNarrative('☯️ 道心+8 · 心境+10', 'loot');
  
  updateAllUI();
  showIceFairyPanel();
}

// ==========================
// 击败冰封守护灵
// ==========================
function defeatIceGuardian() {
  var f = getIceFairy();
  if (!f) return;
  
  var p = G.player;
  if (f.affinity < 70) {
    addNarrative('羁绊不够深厚，守护灵会认为你不怀好意。继续交流吧。', 'system');
    return;
  }
  
  addNarrative('⚔️ 当你准备打开冰棺的最后一层封印时，整个冰窟开始剧烈震动！无数冰晶从洞顶坠落，在你面前凝结成了一个巨大的冰霜巨人——冰封守护灵！<br><br>💀 「擅动封印者，死！」', 'narr-combat');
  
  // 使用自动战斗模拟
  if (typeof startAutoCombat === 'function') {
    // 先保存场景，战斗后回到这里
    closeEvent();
    
    // 这场战斗特殊处理——打完回调
    var savedOnEnd = null;
    
    // 标记玩家正在打守护灵
    G._fightingIceGuardian = true;
    
    // 用现有自动战斗
    startAutoCombat(function(result) {
      G._fightingIceGuardian = false;
      if (result === 'victory') {
        onIceGuardianDefeated(f);
      } else {
        addNarrative('💀 守护灵太过强大，你暂时不是对手。提升修为后再来。', 'narr-combat');
      }
    });
  } else {
    // 没自动战斗就文字模拟
    if (true) { // 总是胜利（游戏性）
      onIceGuardianDefeated(f);
    }
  }
}

function onIceGuardianDefeated(f) {
  f.progress.bossDefeated = true;
  f.stage = 4;
  f.affinity = Math.min(100, f.affinity + 15);
  
  var p = G.player;
  
  // 冰棺彻底打开
  addNarrative('<div style="border:1px solid #e8a0d066;border-radius:8px;padding:12px;margin:6px 0;background:rgba(200,100,150,0.06);">' +
    '<div style="font-size:14px;font-weight:bold;color:#e8a0d0;">🌸 冰释万年</div>' +
    '<div style="font-size:12px;line-height:1.8;margin-top:6px;">守护灵化作漫天冰屑消散。你面前的万年玄冰棺发出了最后一声清脆的碎裂声——棺盖缓缓升起，然后滑落在地，碎成无数晶莹的冰片。<br><br>棺中的仙子缓缓睁开了眼睛。<br><br>那双眸子如同北极的星空，深邃而又明亮。她看着你，先是有些茫然，然后慢慢露出了一个浅淡的笑容——那是万年后第一次出现在她脸上的表情。<br><br>「……原来……是你。」<br><br>她伸出手，轻轻搭在你的手腕上。一股清凉却又温暖的力量顺着她的指尖流入你的经脉——那是万载修为的一丝馈赠。<br><br>「多谢你。」</div>' +
    '</div>', 'milestone');
  
  // 🎁 三大终极奖励
  // 1. 武器：霜华冰心剑
  var weapon = ITEM_DB.find(function(i) { return i.id === 'ice_heart_sword'; });
  if (weapon && typeof addItemToInventory === 'function') addItemToInventory(weapon, 1);
  addNarrative('🗡️ 得仙器·霜华冰心剑——霜华将自己的本命仙剑赠予了你！', 'narr-epic');
  
  // 2. 功法：冰凰涅槃诀
  var skillData = SKILL_DB.find(function(s) { return s.id === 'binghuang_jue'; });
  if (skillData && typeof learnSkillFromScroll === 'function') learnSkillFromScroll('binghuang_jue');
  addNarrative('📜 领悟仙级功法·冰凰涅槃诀——万载寒冰涅槃而成的至高心法！', 'narr-epic');
  
  // 3. 仙丹
  var dan = ITEM_DB.find(function(i) { return i.id === 'xian_fairy_pill'; });
  if (dan && typeof addItemToInventory === 'function') addItemToInventory(dan, 1);
  addNarrative('💊 获得冰魄仙丹·服用后可提升一个境界！', 'narr-epic');
  
  // 属性奖励
  p.wisdom = Math.min(100, (p.wisdom || 50) + 10);
  p.daoHeart = Math.min(200, (p.daoHeart || 50) + 15);
  p.mood = 100;
  if (typeof gainCultivation === 'function') gainCultivation('qi', 50000);
  else p.qiCultivationPoints += 50000;
  p.stones += 2000;
  
  addNarrative('🧠 悟性+10 · ☯️ 道心+15 · 💰 灵石+2000 · ✨ 修为+50000', 'loot');
  
  updateAllUI();
}

// ==========================
// 结为道侣
// ==========================
function iceFairyDaoPartner() {
  var f = getIceFairy();
  if (!f) return;
  var p = G.player;
  if (f.affinity < 90) {
    addNarrative('羁绊还不够深……你得让她真正信任你。', 'system');
    return;
  }
  
  f.stage = 5;
  f.progress.daoPartner = true;
  f.affinity = 100;
  
  // 记录玩家道侣
  p._hasDaoPartner = true;
  p._spouseName = '霜华';
  p._daoPartnerType = 'ice_fairy';
  
  addNarrative('<div style="border:1px solid #d4a5f966;border-radius:8px;padding:12px;margin:6px 0;background:rgba(200,100,200,0.06);">' +
    '<div style="font-size:14px;font-weight:bold;color:#d4a5f9;">💖 仙侣誓约</div>' +
    '<div style="font-size:12px;line-height:1.8;margin-top:6px;">你向她表明了心意。<br><br>霜华沉默了很久，然后轻轻地笑了——那是你第一次看到她真正的笑容，如同冰山上绽放的第一朵雪莲。<br><br>「万年的沉睡……也许就是为了等到你。」<br><br>她握住了你的手，一股温暖的力量将你们两人笼罩。虚空中浮现出无数冰晶和花瓣，围绕着你们旋转飞舞——那是天地对这个誓约的见证。<br><br>从今日起，你们便是道侣。生死与共，仙路相随。</div>' +
    '</div>', 'milestone');
  
  // 🏆 终极奖励
  addNarrative('🏆 达成成就：冰释前缘——成功解救并结缘冰封仙子！', 'milestone');
  p.daoHeart = Math.min(200, (p.daoHeart || 50) + 20);
  p.wisdom = Math.min(100, (p.wisdom || 50) + 10);
  p.mood = 100;
  p.luck = Math.min(100, (p.luck || 50) + 10);
  addNarrative('☯️ 道心+20 · 🧠 悟性+10 · 🍀 气运+10', 'loot');
  
  updateAllUI();
  // 🔧 重新渲染冰窟面板：显示仙侣状态（不重渲染 → 弹窗不变 → “点了没反应”）
  try { if (typeof showIceFairyPanel === 'function') showIceFairyPanel(); } catch(e) {}
}

// 点击双修按钮：先显示“正在双修…”提示，AI 描写完成后刷新聊天框
async function onDualCultivateClick() {
  // 给用户即时反馈（AI 描写需要几秒）
  try {
    addNarrative('（你们相视一笑，开始运转双修法诀……）', 'system');
  } catch(e) {}
  await iceFairyDualCultivate();
  // 刷新聊天框（保留历史 + 显示 AI 描写）
  try { if (typeof showIceFairyChatModal === 'function') showIceFairyChatModal(); } catch(e) {}
}

// ==========================
// 仙侣双修（成仙之路）——AI 每日尽情描写
// ==========================
async function iceFairyDualCultivate() {
  var f = getIceFairy();
  if (!f || f.stage < 5) {
    addNarrative('你们尚未结为道侣。', 'system');
    return;
  }
  
  var p = G.player;
  var dh = p.daoHeart || 50;
  
  // 🔧 2026-08-04：点击即时反馈——先显示“双修中”状态，避免看起来没反应
  if (typeof addNarrative === 'function') {
    addNarrative('☯️ 你与霜华相对而坐，双掌相贴，灵力缓缓交融……', 'system');
  }
  if (typeof updateAllUI === 'function') updateAllUI();
  
  // 🔧 2026-08-04：双修回复所有状态——阴阳交融，气血灵力尽复
  //    替代挂机/手动吃丹：一次双修，hp/qi 回满
  p.hp = p.maxHp;
  p.qi = p.maxQi;
  
  // 🔧 2026-08-04：飞升后双修收益巨幅放大（后期修炼提速）——
  //    飞升(22+)：修为×10 + 炼体×10；鸿蒙道体后继续×20
  var flyMult = 1;
  if ((p.qiRealmIndex || 0) >= 22) flyMult = 10;
  if ((p.bodyRealmIndex || 0) >= 22) flyMult = 20;
  
  // 巨量收益，每次双修相当于闭关数日
  var qGain = Math.round((5000 + dh * 50 + (p.wisdom || 50) * 30 + (p.mood || 50) * 20) * flyMult);
  var bodyGain = Math.round((3000 + dh * 30 + (p.bone || 50) * 20) * flyMult);
  var moodGain = 10;
  var stonesGain = 100 + Math.floor(dh * 2);
  
  if (typeof gainCultivation === 'function') gainCultivation('qi', qGain);
  else p.qiCultivationPoints += qGain;
  if (typeof gainCultivation === 'function') gainCultivation('body', bodyGain);
  else p.bodyCultivationPoints += bodyGain;
  p.mood = Math.min(100, (p.mood || 50) + moodGain);
  p.stones += stonesGain;
  
  // 额外：两人双修破境界壁垒——成仙机缘
  var flyChance = (dh / 200) * (f.affinity / 100);
  var flyDesc = '';
  if (Math.random() < flyChance) {
    if (typeof gainCultivation === 'function') gainCultivation('qi', 100000);
    else p.qiCultivationPoints += 100000;
    if (typeof gainCultivation === 'function') gainCultivation('body', 50000);
    else p.bodyCultivationPoints += 50000;
    flyDesc = '‼️ 阴阳交融之际，你与霜华的道心共鸣引发了天地异象——一道霞光穿透万载冰层，直冲天际！成仙之路已在脚下！';
  }
  
  // 🔧 AI 生成双修描写（女子的美/男子的俊/两人缠绵），失败用本地兜底
  var scene = await iceFairyDualSceneAI(f, p);
  
  // 🔧 同步追加到聊天历史（聊天框显示）
  try {
    if (!p._iceFairyChatHistory) p._iceFairyChatHistory = [];
    p._iceFairyChatHistory.push({ role:'npc', text: scene, dual: true });
  } catch(e) {}
  
  addNarrative('<div style="border:1px solid #d4a5f944;border-radius:6px;padding:8px;margin:6px 0;background:rgba(200,100,200,0.04);">' +
    '<div style="font-size:12px;font-weight:bold;color:#d4a5f9;">☯️ 与霜华双修</div>' +
    '<div style="font-size:12px;line-height:1.9;margin-top:4px;color:#e4d4f4;">' + scene + '</div>' +
    '<div style="font-size:10px;color:var(--accent);margin-top:4px;">✨ 修为+' + qGain + ' · 炼体+' + bodyGain + ' · 心境+' + moodGain + ' · 💰+' + stonesGain + '</div>' +
    (flyDesc ? '<div style="font-size:11px;color:#d4a5f9;margin-top:4px;">' + flyDesc + '</div>' : '') +
    '</div>', 'milestone');
  
  // 🔧 每日限制（防止刷）——飞升后解锁无限双修（后期修炼提速）
  var isFlying = (p.qiRealmIndex || 0) >= 22;
  if (!isFlying) {
    var today = G.time.day;
    if (f._lastDualDay !== today) {
      f._lastDualDay = today;
      f._dualCountToday = 1;
    } else {
      f._dualCountToday = (f._dualCountToday || 0) + 1;
      if (f._dualCountToday > 3) {
        addNarrative('今日双修已达上限（每日3次），明日再续。', 'system');
        // 🔧 回退保底：修为不低于当前境界需求（防止双修回退把修为扣成负值）
        p.qiCultivationPoints = Math.max(getQiRealm().cpRequired, (p.qiCultivationPoints || 0) - qGain);
        p.bodyCultivationPoints = Math.max(getBodyRealm().cpRequired, (p.bodyCultivationPoints || 0) - bodyGain);
        p.stones = Math.max(0, (p.stones || 0) - stonesGain);
      }
    }
  } else {
    // 飞升后：不计数（无限双修）
    f._dualCountToday = 0;
  }
  
  // 👶 飞升后双修孕育仙胎（30%概率，过程叙事增强版）
  if (typeof checkChildConception === 'function') {
    try { checkChildConception(); } catch(e) {}
  }
  
  // 👶 若已怀仙胎，在双修结果中同步提示（避免被异步AI场景吞掉）
  if (f.pregnant && typeof f.pregnant.conceiveDay === 'number' && f.pregnant.conceiveDay === G.time.day) {
    try {
      if (!p._iceFairyChatHistory) p._iceFairyChatHistory = [];
      p._iceFairyChatHistory.push({ role:'npc', text: '🌸 霜华脸颊微红，低声道：仙胎已成……' });
    } catch(e) {}
  }
  
  updateAllUI();
}

// 🔧 AI 生成双修场景描写：女子之美/男子之俊/两人缠绵，每天由 AI 尽情描写
async function iceFairyDualSceneAI(f, p) {
  var key = ICE_FAIRY_API_KEY;
  if (!key || key.indexOf('sk-') !== 0) return iceFairyDualFallbackScene();
  
  var genderCN = (p.gender === '女') ? '女修' : '男修';
  var appr = p.appearance || '剑眉星目';
  var bodyT = p.bodyType || '挺拔';
  var height = p.height || '178';
  var realmName = '';
  try { realmName = (typeof getQiRealm === 'function' && getQiRealm()) ? getQiRealm().name : ''; } catch(e) {}
  
  var sys = '你是一位仙侠言情小说作家，文笔优美细腻，擅长描绘人物之美与情意缠绵。' +
    '现在描写一对修仙道侣的双修场景，要求：\n' +
    '1. 用中文，150-260字\n' +
    '2. 描写女子的美：素衣如雪、冰肌玉骨、青丝如瀑、眉目如画（她是万载冰封的仙子霜华）\n' +
    '3. 描写男子的俊：' + genderCN + '，' + appr + '，' + bodyT + '，身高' + height + '（玩家）\n' +
    '4. 描写两人的缠绵：眼神交缠、呼吸相闻、双掌相贴、灵力交融、情意涌动，如太极相合\n' +
    '5. 意境唯美含蓄，点到即止，不低俗\n' +
    '6. 不用引号包裹，直接输出正文';
  
  try {
    var ctrl = new AbortController();
    var timer = setTimeout(function(){ try { ctrl.abort(); } catch(e) {} }, 12000);
    var r = await fetch('https://api.deepseek.com/chat/completions', {
      method:'POST', headers:{'Content-Type':'application/json','Authorization':'Bearer '+key},
      body:JSON.stringify({model:'deepseek-chat',messages:[{role:'system',content:sys},{role:'user',content:'描写'+(p.name||'')+'与霜华的一次双修'}],max_tokens:400,temperature:1.1}),
      signal: ctrl.signal
    });
    clearTimeout(timer);
    if (!r.ok) throw new Error('API error');
    var d = await r.json();
    var reply = d.choices && d.choices[0] && d.choices[0].message ? d.choices[0].message.content.trim() : '';
    if (reply && reply.length > 30) return reply.replace(/\n+/g, '<br>');
  } catch(e) { console.warn('Dual cultivate AI failed:', e); }
  return iceFairyDualFallbackScene();
}

// 本地兜底双修描写（AI 不可用时）
function iceFairyDualFallbackScene() {
  var scenes = [
    '烛影摇红，冰棺旧址化作一隅暖室。霜华素衣如雪，青丝垂落如瀑，冰肌玉骨在朦胧光晕中泛着淡淡莹光。你剑眉星目，挺拔如松，与她对面而坐，双掌相贴。极寒与至暖两股灵力在你们掌心间流转，如太极相合，阴阳相生。她的睫毛轻颤，眸中映着你的倒影——万年冰心，在这一刻为你融化。',
    '霜华倚在你怀中，长发如流云般铺散。她仰起脸，眉目如画，唇边漾着一丝浅笑——那是冰山上绽放的雪莲，只为一人盛开。你低头凝视她，指尖拂过她冰凉的鬓角。两人气息交缠，灵力在经脉间循环往复，仿佛整个天地都安静下来，只余彼此的心跳。',
    '双修法诀运转，你与霜华周身泛起淡淡仙光。她眸若秋水，肌肤胜雪，素手与你十指相扣；你身形挺拔，剑眉星目间满是温柔。两股灵力交织成一个小小的太极旋涡，环绕着你们旋转。情意如潮水般涌动，万载寒冰化作绕指柔，从此仙路漫漫，携手同修。'
  ];
  return scenes[Math.floor(Math.random() * scenes.length)];
}

// ==========================
// 探索北极场景时触发解封材料发现
// ==========================
function checkIceFairySceneFind(sceneId) {
  var f = getIceFairy();
  if (!f) return;
  // 🔧 放宽 stage 限制：初遇后任意阶段探索北极场景都可能发现解封材料（委托也需要）
  if ((f.stage || 0) < 1) return;
  
  // 如果在北极/相关场景探索，有机会找到材料
  // 🔧 含 bibo_lake（冰魄泪）/ lieyan_valley（涅槃火种）：之前漏了这两个场景 → 一直刷不出
  var bjScenes = ['bingfeng_grotto', 'bj_frozen_lake', 'bj_ice_peak', 'bj_snow_forest', 'bibo_lake', 'lieyan_valley'];
  if (bjScenes.indexOf(sceneId) === -1) return;
  
  tryFindIceFairyItem(sceneId);
}

// ==========================
// 🎨 立绘换装系统（按阶段自定义立绘）
// ==========================
var STAGE_NAMES = ['沉睡','初遇','苏醒','复苏','得救','仙侣'];

// 图片压缩：宽高等比缩到 maxW，JPEG 质量 quality，返回 base64 dataURL
function compressImageFile(file, maxW, quality, cb) {
  var reader = new FileReader();
  reader.onload = function(ev) {
    var img = new Image();
    img.onload = function() {
      var w = img.width, h = img.height;
      var scale = Math.min(1, maxW / w);
      var nw = Math.round(w * scale), nh = Math.round(h * scale);
      var canvas = document.createElement('canvas');
      canvas.width = nw; canvas.height = nh;
      var ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, nw, nh);
      var dataUrl = canvas.toDataURL('image/jpeg', quality);
      cb(dataUrl, nw, nh);
    };
    img.onerror = function() { cb(null, 0, 0); };
    img.src = ev.target.result;
  };
  reader.readAsDataURL(file);
}

// 换装面板
function openIcePortraitPicker() {
  var f = getIceFairy();
  if (!f) return;
  // 🔧 强制重置弹窗状态：聊天框/面板开着时点换装，新弹窗会被队列吞掉 → 面板不显示
  if (typeof resetModalState === 'function') resetModalState();
  var portraits = f.portraits || {};
  
  var html = '<div style="padding:4px;">';
  html += '<div style="font-size:11px;color:var(--text-dim);margin-bottom:8px;">为百里冰的每个阶段设置专属立绘。上传的图片会自动压缩（最大宽600px）。</div>';
  
  // 六个阶段卡片
  for (var i = 0; i < 6; i++) {
    var stageNum = i + 1;
    var key = 's' + stageNum;
    var has = portraits[key];
    var thumb = has ? portraits[key] : 'img/ice_fairy_portrait.png';
    var isCur = f.stage === stageNum;
    html += '<div style="display:flex;align-items:center;gap:8px;padding:6px;margin-bottom:6px;border:1px solid ' + (isCur ? 'rgba(100,150,200,0.5)' : 'rgba(255,255,255,0.06)') + ';border-radius:8px;background:' + (isCur ? 'rgba(100,150,200,0.08)' : 'transparent') + ';">' +
      '<img src="' + thumb + '" style="width:44px;height:58px;object-fit:cover;border-radius:4px;flex-shrink:0;border:1px solid rgba(255,255,255,0.08);">' +
      '<div style="flex:1;min-width:0;">' +
        '<div style="font-size:12px;font-weight:bold;color:' + (isCur ? '#6a9ec9' : 'var(--text)') + ';">' + STAGE_NAMES[i] + (isCur ? ' <span style="font-size:9px;color:#6a9ec9;">(当前)</span>' : '') + '</div>' +
        '<div style="font-size:9px;color:var(--text-dim);margin-top:2px;">' + (has ? '已自定义' : '默认立绘') + '</div>' +
      '</div>' +
      '<label style="flex:0 0 auto;padding:4px 8px;border-radius:6px;border:1px solid rgba(100,150,200,0.3);background:rgba(100,150,200,0.1);color:#a0c4e8;font-size:10px;cursor:pointer;">📷 上传<input type="file" accept="image/*" style="display:none;" onchange="iceSetPortrait(' + stageNum + ',this)"></label>' +
      (has ? '<button onclick="iceClearPortrait(' + stageNum + ')" style="flex:0 0 auto;padding:4px 6px;border-radius:6px;border:1px solid rgba(255,100,100,0.3);background:rgba(255,100,100,0.08);color:#e88;font-size:10px;cursor:pointer;">✕</button>' : '') +
    '</div>';
  }
  
  html += '<div style="font-size:9px;color:var(--text-dim);margin-top:6px;">💾 立绘随存档保存。聊天时按当前阶段自动切换立绘。</div>';
  html += '<div class="event-choice-btn" onclick="showIceFairyChatModal()" style="margin-top:8px;text-align:center;font-size:12px;padding:8px;background:rgba(100,150,200,0.12);border-color:rgba(100,150,200,0.3);">💬 返回聊天</div>';
  html += '</div>';
  
  showCustomModal('🎨 百里冰 · 换装', html);
}

// 上传并设置某阶段立绘
function iceSetPortrait(stageNum, inputEl) {
  var file = inputEl && inputEl.files && inputEl.files[0];
  if (!file) return;
  var f = getIceFairy();
  if (!f) return;
  if (!f.portraits) f.portraits = {};
  
  compressImageFile(file, 600, 0.8, function(dataUrl, w, h) {
    if (!dataUrl) { addNarrative('⚠️ 图片读取失败，请换一张试试。','system'); return; }
    f.portraits['s' + stageNum] = dataUrl;
    addNarrative('✅ 已为「' + STAGE_NAMES[stageNum-1] + '」阶段换上新的立绘（' + w + '×' + h + '）。','narr-event');
    // 如果正在聊天弹窗中，实时刷新头像
    var img = document.getElementById('ice-portrait-img');
    if (img && stageNum === (f.stage||1)) {
      img.style.backgroundImage = 'url(' + dataUrl + ')';
    }
    // 刷新换装面板
    if (typeof openIcePortraitPicker === 'function') openIcePortraitPicker();
    if (typeof saveGameNow === 'function') saveGameNow();
  });
}

// 清除某阶段自定义立绘
function iceClearPortrait(stageNum) {
  var f = getIceFairy();
  if (!f || !f.portraits) return;
  delete f.portraits['s' + stageNum];
  addNarrative('已恢复「' + STAGE_NAMES[stageNum-1] + '」阶段默认立绘。','narr-event');
  var img = document.getElementById('ice-portrait-img');
  if (img && stageNum === (f.stage||1)) {
    img.style.backgroundImage = 'url(img/ice_fairy_portrait.png)';
  }
  if (typeof openIcePortraitPicker === 'function') openIcePortraitPicker();
  if (typeof saveGameNow === 'function') saveGameNow();
}

// ==========================
// 📜 仙子委托系统
// 她在聊天中随口要东西 → 生成委托 → 找到东西献给她 → 领奖励
// ==========================

// 获取当前活跃委托（无则 null）
function getIceFairyRequest() {
  var f = getIceFairy();
  if (!f) return null;
  if (!f._iceRequests) f._iceRequests = [];
  // 🔧 解封未完成时，重叠委托（解封材料）视为不可交：跳过，避免吃掉解封材料
  var unsealed = !(f.progress && f.progress.keyComplete) && (f.stage||0) < 2;
  var unsealBlock = {};
  if (unsealed) {
    ICE_FAIRY_ITEMS.forEach(function(it){ unsealBlock[it.id] = true; });
  }
  // 返回第一个未完成的
  for (var i=0;i<f._iceRequests.length;i++) {
    var r = f._iceRequests[i];
    if (!r.done && !unsealBlock[r.itemId]) {
      // 🔧 数量以最新定义为准（旧档条目 qty=3 也按定义 qty=1 算）
      var def = null;
      for (var j=0;j<ICE_FAIRY_REQUESTS.length;j++) {
        if (ICE_FAIRY_REQUESTS[j].id === r.id) { def = ICE_FAIRY_REQUESTS[j]; break; }
      }
      if (def && def.qty !== undefined && r.qty !== def.qty) r.qty = def.qty;
      // 🔧 旧档条目同步 hint 字段（hintScene/hintText 是后加的，旧条目没有 → 不显示地点）
      if (def) {
        if (def.hintScene !== undefined) r.hintScene = def.hintScene;
        if (def.hintText !== undefined) r.hintText = def.hintText;
      }
      return r;
    }
  }
  return null;
}

// 生成一个新委托（随机从池中选未做过的，亲和度达标才可选）
function newIceFairyRequest() {
  var f = getIceFairy();
  if (!f) return null;
  if (!f._iceRequests) f._iceRequests = [];
  var affinity = f.affinity || 0;
  
  // 🔧 解封未完成时，屏蔽与解封材料重叠的委托（寒玉髓/瑶池冰莲/冰魄泪）
  //    防止委托把解封材料吃掉 → 解封仪式永远集不齐 → 她醒不过来
  var unsealed = !(f.progress && f.progress.keyComplete) && (f.stage||0) < 2;
  var unsealBlock = {};
  if (unsealed) {
    ICE_FAIRY_ITEMS.forEach(function(it){ unsealBlock[it.id] = true; });
  }
  
  // 过滤：亲和度达标 + 还没做过 + 不占用解封材料
  var doneIds = {};
  f._iceRequests.forEach(function(r){ if (r.done) doneIds[r.id] = true; });
  var pool = ICE_FAIRY_REQUESTS.filter(function(r){
    return affinity >= r.affinityReq && !doneIds[r.id] && !unsealBlock[r.itemId];
  });
  if (pool.length === 0) {
    // 全做过了 → 重置，允许重复（奖励减半）
    pool = ICE_FAIRY_REQUESTS.filter(function(r){ return affinity >= r.affinityReq && !unsealBlock[r.itemId]; });
    if (pool.length === 0) return null;
  }
  
  var req = pool[Math.floor(Math.random()*pool.length)];
  var entry = {
    id: req.id,
    itemId: req.itemId,
    itemName: req.itemName,
    qty: req.qty,
    requestText: req.requestText,
    affinityReq: req.affinityReq,
    reward: req.reward,
    hintScene: req.hintScene,   // 🔧 地点提示（banner/任务面板用）
    hintText: req.hintText,
    createdAt: G.time ? G.time.day : 1,
    done: false,
    repeat: doneIds[req.id] ? true : false
  };
  f._iceRequests.push(entry);
  return entry;
}

// 解析AI回复中的【寻:物品:数量】标记 → 生成委托
// 例：【寻:寒玉髓:3】
function parseIceFairyRequest(replyText) {
  if (!replyText) return null;
  var m = replyText.match(/【寻[:：]\s*([^】:：]+?)(?:[:：]\s*(\d+))?\s*】/);
  if (!m) return null;
  var name = m[1].trim();
  var qty = parseInt(m[2]||'1', 10) || 1;
  // 在委托池里找匹配的物品名
  for (var i=0;i<ICE_FAIRY_REQUESTS.length;i++) {
    var r = ICE_FAIRY_REQUESTS[i];
    if (r.itemName === name || r.itemId === name) {
      var f = getIceFairy();
      if (!f._iceRequests) f._iceRequests = [];
      // 已有同id活跃委托则不重复
      if (getIceFairyRequest() && getIceFairyRequest().itemId === r.itemId) return null;
      var entry = {
        id: r.id, itemId: r.itemId, itemName: r.itemName,
        qty: qty, requestText: r.requestText, affinityReq: r.affinityReq,
        reward: r.reward, createdAt: G.time ? G.time.day : 1, done: false, repeat: false
      };
      f._iceRequests.push(entry);
      return entry;
    }
  }
  return null;
}

// 检查玩家背包里是否有委托物品（返回拥有的数量）
function iceRequestOwnedCount(req) {
  var p = G.player;
  if (!p || !p.inventory || !req) return 0;
  var total = 0;
  p.inventory.forEach(function(it){
    if (it.id === req.itemId) {
      // qty 缺失 → 视为 1（旧档条目）；qty=0 → 算 0；否则按实际数量
      total += (it.qty == null ? 1 : (it.qty > 0 ? it.qty : 0));
    }
  });
  return total;
}

// 献物：把委托物品交给她（消耗背包物品，给奖励）
function iceFairySubmitRequest() {
  var f = getIceFairy();
  var req = getIceFairyRequest();
  if (!f || !req) { addNarrative('（她目前没有委托你做什么）', 'system'); return; }
  
  var owned = iceRequestOwnedCount(req);
  if (owned < req.qty) {
    addNarrative('（你翻遍储物袋，还差 ' + (req.qty - owned) + ' 件' + req.itemName + '）', 'system');
    // 提示去哪里找：解封材料用 ICE_FAIRY_ITEMS 场景，其他委托用 hintText/hintScene
    var item = ICE_FAIRY_ITEMS.find(function(it){ return it.id === req.itemId; });
    if (item) {
      addNarrative('（' + item.desc + ' · 可在 ' + (getSceneData ? (getSceneData(item.scene)||{}).name : item.scene) + ' 寻得）', 'quest');
    } else if (req.hintText) {
      addNarrative('（📍 ' + req.hintText + '）', 'quest');
    } else if (req.hintScene) {
      var hs = getSceneData ? (getSceneData(req.hintScene)||{}).name : req.hintScene;
      addNarrative('（📍 可在 ' + hs + ' 寻得）', 'quest');
    }
    // 🔧 弹窗明确提示还差几个（用户可能没看到底部日志）
    try {
      if (typeof showToast === 'function') showToast('还差 ' + (req.qty - owned) + ' 个' + req.itemName + '（需要 ' + req.qty + ' 个，当前 ' + owned + ' 个）');
      else if (typeof alert === 'function') alert('还差 ' + (req.qty - owned) + ' 个' + req.itemName + '（需要 ' + req.qty + ' 个，当前 ' + owned + ' 个）');
    } catch(e) {}
    return;
  }
  
  // 扣除物品（只扣 qty>0 的有效条目；qty 缺失视为 1）
  var remain = req.qty;
  for (var i=0;i<G.player.inventory.length && remain>0;i++) {
    var it = G.player.inventory[i];
    if (it.id === req.itemId) {
      var has = it.qty == null ? 1 : it.qty;
      if (has <= 0) continue;  // 跳过 qty=0 的脏条目
      var take = Math.min(has, remain);
      it.qty = has - take;
      remain -= take;
      if (it.qty <= 0) {
        G.player.inventory.splice(i, 1);
        i--;
      }
    }
  }
  // 🔧 交付后清空背包里多余的同款物品（不占背包）：用户要求
  for (var k=G.player.inventory.length-1;k>=0;k--) {
    if (G.player.inventory[k] && G.player.inventory[k].id === req.itemId) {
      G.player.inventory.splice(k, 1);
    }
  }
  
  req.done = true;
  var rw = req.reward;
  var p = G.player;
  var lines = [];
  
  // 奖励发放
  var repeatPenalty = req.repeat ? 0.5 : 1;
  if (rw.exp) { var expRew = Math.round(rw.exp * repeatPenalty); if (typeof gainCultivation === 'function') gainCultivation('qi', expRew); else p.qiCultivationPoints = (p.qiCultivationPoints||0) + expRew; lines.push('📖 修为 +' + expRew); }
  if (rw.stones) { p.stones = (p.stones||0) + Math.round(rw.stones * repeatPenalty); lines.push('💰 灵石 +' + Math.round(rw.stones * repeatPenalty)); }
  if (rw.affinity) { f.affinity = Math.min(100, (f.affinity||0) + Math.round(rw.affinity * repeatPenalty)); lines.push('💗 羁绊 +' + Math.round(rw.affinity * repeatPenalty)); }
  if (rw.fate) { gainIceFairyFate(Math.round(rw.fate * repeatPenalty), '完成仙子委托'); lines.push('☯️ 缘分 +' + Math.round(rw.fate * repeatPenalty)); }
  
  // 聊天记录追加完成对话
  var log = document.getElementById('ice-chat-log');
  if (log) {
    var bubble = '<div style="margin-bottom:6px;text-align:left;"><div style="display:inline-block;max-width:88%;padding:6px 10px;border-radius:10px;font-size:13px;line-height:1.6;background:rgba(90,130,190,0.12);color:#c8dce8;border:1px solid rgba(120,170,230,0.25);">' +
      '<div style="font-size:9px;color:rgba(160,200,240,0.5);margin-bottom:2px;font-weight:bold;">🧊 百里冰</div>' +
      '<div>（你递上' + req.itemName + '×' + req.qty + '，她微微一怔）</div>' +
      '<div style="margin-top:3px;">' + (rw.desc || '她收下了。') + '</div>' +
      '<div style="margin-top:6px;padding:8px 10px;border-radius:8px;border:1px solid rgba(200,160,80,0.35);background:linear-gradient(135deg,rgba(120,90,40,0.25),rgba(60,40,20,0.15));">' +
        '<div style="font-size:10px;color:#e8c878;font-weight:bold;margin-bottom:3px;">✅ 委托完成</div>' +
        '<div style="font-size:12px;color:#f0dcb0;">' + lines.join(' · ') + '</div>' +
      '</div></div></div>';
    log.insertAdjacentHTML('beforeend', bubble);
    log.scrollTop = log.scrollHeight;
  }
  
  // 历史记录
  if (!p._iceFairyChatHistory) p._iceFairyChatHistory = [];
  p._iceFairyChatHistory.push({ role:'npc', text: rw.desc || '她收下了。', submit: true });
  
  // 存档 + 刷新UI
  if (typeof saveGameNow === 'function') saveGameNow();
  try { updateAllUI(); } catch(e) {}
  
  // 🔧 刷新聊天框顶部的委托条（旧委托→新委托即时更新，不重新打开聊天框）
  refreshIceRequestBanner();
  
  // 完成后必定接新委托（只要还有可做的）：用户想拿全 8 种委托
  // 🔧 新委托已由 refreshIceRequestBanner() 兜底生成；这里只追加“她沉吟片刻”提示消息
  if (getIceFairyRequest() !== null) {
    var nr = getIceFairyRequest();
    if (nr) {
      setTimeout(function(){
        var log2 = document.getElementById('ice-chat-log');
        if (log2) {
          var nb = '<div style="margin-bottom:6px;text-align:left;"><div style="display:inline-block;max-width:88%;padding:6px 10px;border-radius:10px;font-size:13px;line-height:1.6;background:rgba(90,130,190,0.10);color:#b8cce0;border:1px solid rgba(120,170,230,0.18);">' +
            '<div style="font-size:9px;color:rgba(160,200,240,0.45);margin-bottom:2px;font-weight:bold;">🧊 百里冰</div>' +
            '<div>（她沉吟片刻）对了，还有一事……' + nr.requestText + '</div>' +
            '<div style="margin-top:4px;font-size:11px;color:#a8c8e8;">📜 委托：带' + nr.qty + '件' + nr.itemName + '给她</div>' +
            '</div></div>';
          log2.insertAdjacentHTML('beforeend', nb);
          log2.scrollTop = log2.scrollHeight;
        }
        // 🔧 刷新任务面板（若开着）：让新委托立即可见，献物按钮跟着出现
        try {
          var questOverlay = document.getElementById('event-overlay');
          if (questOverlay && !questOverlay.classList.contains('hidden')) {
            var qBody = document.getElementById('event-body');
            if (qBody && qBody.innerHTML.indexOf('委托') !== -1) {
              showQuestPanel();
            }
          }
        } catch(e) {}
      }, 600);
    }
  }
}

// 聊天框顶部的当前委托状态条（返回HTML或''）
function iceRequestBannerHtml() {
  var req = getIceFairyRequest();
  if (!req) return '';
  var owned = iceRequestOwnedCount(req);
  var need = req.qty;
  var itemDef = null;
  var def = null;
  if (typeof ITEM_DB !== 'undefined') {
    for (var i=0;i<ITEM_DB.length;i++) if (ITEM_DB[i].id === req.itemId) { itemDef = ITEM_DB[i]; break; }
  }
  var sceneName = '';
  var sceneItem = ICE_FAIRY_ITEMS.find(function(it){ return it.id === req.itemId; });
  if (sceneItem) {
    var sd = typeof getSceneData === 'function' ? getSceneData(sceneItem.scene) : null;
    if (sd && sd.name) sceneName = sd.name;
    else {
      // 兜底：从 SCENE 列表找
      try {
        if (typeof SCENES !== 'undefined') {
          var s2 = SCENES.find(function(s){ return s.id === sceneItem.scene; });
          if (s2 && s2.name) sceneName = s2.name;
        }
      } catch(e) {}
      if (!sceneName) sceneName = sceneItem.scene;
    }
  } else if (req.hintScene) {
    // 🔧 非解封材料委托：用 hintScene 显示推荐场景名（如千年灵芝→闭关峰）
    var sd3 = typeof getSceneData === 'function' ? getSceneData(req.hintScene) : null;
    if (sd3 && sd3.name) sceneName = sd3.name;
    else {
      try {
        if (typeof SCENES !== 'undefined') {
          var s3 = SCENES.find(function(s){ return s.id === req.hintScene; });
          if (s3 && s3.name) sceneName = s3.name;
        }
      } catch(e) {}
      if (!sceneName) sceneName = req.hintScene;
    }
  }
  // 提示文字：解封材料用场景名，非解封材料用 hintText（更具体）
  var hintLine = req.hintText ? req.hintText : (sceneName ? '出处：' + sceneName : '');
  return '<div id="ice-request-banner" style="padding:6px 10px;border-bottom:1px solid rgba(100,150,200,0.12);background:rgba(60,100,160,0.08);display:flex;align-items:center;gap:6px;flex-shrink:0;">' +
    '<span style="font-size:11px;">📜</span>' +
    '<div style="flex:1;min-width:0;font-size:11px;color:#a8c8e8;">委托：带 <b style="color:#e8c878;">' + req.itemName + '×' + need + '</b> 给她' +
    (sceneName ? ' <span style="color:var(--text-dim);">（' + sceneName + '）</span>' : '') +
    (hintLine ? '<div style="font-size:10px;color:#8fbf8f;margin-top:2px;">📍 ' + hintLine + '</div>' : '') +
    '<div style="font-size:10px;color:var(--text-dim);margin-top:2px;">已寻得 ' + owned + '/' + need + '</div></div>' +
    '<button onclick="iceFairySubmitRequest()" style="flex-shrink:0;padding:4px 10px;border-radius:6px;border:1px solid rgba(200,160,80,0.4);background:rgba(120,90,40,0.3);color:#e8c878;font-size:11px;cursor:pointer;font-family:inherit;">📦 献物</button>' +
    '</div>';
}

// 🔧 刷新聊天框顶部的委托条（提交后调用：旧委托→新委托即时更新）
function refreshIceRequestBanner() {
  try {
    var banner = document.getElementById('ice-request-banner');
    if (!banner) return;
    // 无活跃委托 → 自动生成一个（保证标签永远在）
    if (!getIceFairyRequest() && typeof newIceFairyRequest === 'function') {
      newIceFairyRequest();
    }
    var html = iceRequestBannerHtml();
    banner.innerHTML = html || '';
  } catch(e) {}
}

// ==========================
// 🎁 仙子指点系统
// 百里冰随口一句话/随手一件"垃圾"，对凡人修士都是绝世机缘
// ==========================

// 指点冷却状态（存在仙子数据里，随存档保存）
function _iceTipCooldown(key) {
  var f = getIceFairy();
  if (!f._tipCooldown) f._tipCooldown = {};
  return f._tipCooldown;
}

// 指点文案库：她随手丢的"垃圾"，其实是大陆极品
var ICE_TIP_TEXTS = {
  insight: [
    '（百里冰瞥了你一眼，漫不经心）你这吐纳……节奏乱了三分。灵气入体当如溪流归海，你却像暴雨砸石。',
    '（她指尖凝出一缕冰雾，又散去）看到了吗？灵气在指尖停驻一息再化开——这叫“含而不发”。拿去悟。',
    '（她语气淡淡的）凡人修一世，不及仙人一息。你缺的不是勤奋，是“看破”。',
    '（她轻轻摇头）你这功法练错了方向。记住：水满则溢，月满则亏。修炼亦然。',
    '（她望着虚空出神）本仙子当年在寒渊练剑，一剑挥了十万年。你这才哪到哪。',
    '（她指尖弹出一粒冰晶，落在你眉心）冰晶化开那瞬，你可曾触到“道”的边？' 
  ],
  gift: [
    '（百里冰随手抛来一物，像扔垃圾）接着。这东西本仙子储物戒里多得落灰，搁你们凡间……大概能换座城。',
    '（她头也不抬，丢来一件东西）拿去玩。本仙子当年用来垫桌脚的。',
    '（她打了个哈欠）喏，这玩意儿碍眼，赏你了。',
    '（她指尖微动，一件物什飘到你面前）别嫌寒酸，这是本仙子梳妆台上最不值钱的。',
    '（她懒洋洋地说）储物戒清库存，你运气好，赶上了。' 
  ],
  teach: [
    '（百里冰神色难得认真了些）看好了，本仙子只演示一遍。能悟多少，看你的造化。',
    '（她指尖浮现一串冰蓝符文）这法门……本仙子当年入门时练着玩的，没想到你们凡间竟无人会。',
    '（她沉默片刻，缓缓开口）此法传你，只为一件事——来日你若有能力，救本仙子出去。',
    '（她眼中闪过一丝追忆）当年师尊传我此法时说过：法不轻传。但……本仙子看你顺眼。' 
  ]
};

// 赠物池：她眼里的"垃圾"，其实是稀有材料/丹药/灵草
var ICE_GIFT_POOL = [
  { id:'xuantie_jingcui', desc:'她随手丢来一块乌黑铁疙瘩——“垫过桌角的玄铁精粹。”' },
  { id:'xuelian', desc:'她抛来几粒雪白莲子——“寒潭边捡的，吃着解闷。”' },
  { id:'huojing_cao', desc:'她扔来一株赤红灵草——“火气太冲，本仙子不喜欢。”' },
  { id:'yunqi_cao', desc:'她丢来一株氤氲小草——“云里长的，看着碍眼，给你了。”' },
  { id:'wudao_ye', desc:'她拈起一片琉璃叶——“悟道树掉叶子了，扫都扫不完。”' },
  { id:'huiqi_dan', desc:'她抛来一枚丹药——“路边摊买的，难吃，送你了。”' },
  { id:'juli_dan', desc:'她丢来一枚聚气丹——“你们凡人的丹药，跟糖豆似的。”' },
  { id:'podi_dan', desc:'她随手扔来一枚破壁丹——“这玩意儿本仙子小时候当糖吃。”' },
  { id:'xuanyuan_ling', desc:'她丢来一团灵光——“天地灵气结的渣滓，给你吧。”' },
  { id:'pixiu_yaogu', desc:'她抛来一截兽骨——“上古貔貅的骨头，本仙子拿来剔牙的。”' },
  { id:'qiannian_lingzhi', desc:'她扔来一株灵芝——“千年份的，凑合吃。”' },
  { id:'shenji_cao', desc:'她随手拈来一株神机草——“仙人弈棋落子化生，本仙子输了棋，气不过拔的。”' }
];

// 传功池：她眼里的"入门功法"，其实是神/圣/仙级
var ICE_TEACH_POOL_IDS = ['taiyi_jue','fentian_yin','shenglong_jue','jintong_yan','wanmu_chunqiu','hundun_jue','zhuxian_jian','jiuzhuan_jin','tianxiang_wu','wuxiang_shen','binghuang_jue'];

// 从 SKILL_DB 找功法
function _findSkillById(id) {
  if (typeof SKILL_DB !== 'undefined') {
    for (var i=0;i<SKILL_DB.length;i++) if (SKILL_DB[i].id===id) return SKILL_DB[i];
  }
  return null;
}

// 从 ITEM_DB 找物品
function _findItemById(id) {
  if (typeof ITEM_DB !== 'undefined') {
    for (var i=0;i<ITEM_DB.length;i++) if (ITEM_DB[i].id===id) return ITEM_DB[i];
  }
  return null;
}

// 判断玩家是否已会某功法（防止重复传功）
function _iceKnowsSkill(skillId) {
  var p = G.player;
  if (!p || !p.skills) return false;
  for (var i=0;i<p.skills.length;i++) {
    if (p.skills[i] && (p.skills[i].id===skillId || p.skills[i].name===skillId)) return true;
  }
  return false;
}

// 主要触发入口：聊天后按概率触发指点
// 返回是否触发了指点
function iceFairyTip() {
  var f = getIceFairy();
  if (!f || !G.player) return false;
  // 必须已初遇（stage>=2）
  if ((f.stage||1) < 2) return false;
  var affinity = f.affinity || 0;
  var cd = _iceTipCooldown();
  
  // 计算本次指点类型（权重按亲和度分层）
  var roll = Math.random() * 100;
  var type = null;
  if (affinity >= 32 && roll < 15 && !cd.teach) {
    type = 'teach';          // 传功（最稀有）
  } else if (affinity >= 12 && roll < 50 && !cd.gift) {
    type = 'gift';           // 随手赠物
  } else if (roll < 85 || affinity < 12) {
    type = 'insight';        // 感悟指点
  }
  if (!type) return false;
  
  var now = Date.now();
  // 冷却检查（分钟）
  var cooldownMap = { insight: 3, gift: 6, teach: 12 };
  if (cd[type] && now - cd[type] < cooldownMap[type]*60000) return false;
  
  // 执行对应类型
  if (type === 'insight') return _iceTipInsight(f);
  if (type === 'gift') return _iceTipGift(f);
  if (type === 'teach') return _iceTipTeach(f);
  return false;
}

// 感悟指点：+修为、小概率+悟性
function _iceTipInsight(f) {
  var p = G.player;
  var cd = _iceTipCooldown();
  var now = Date.now();
  // 冷却检查（3分钟）
  if (cd.insight && now - cd.insight < 3*60000) return false;
  cd.insight = now;
  
  var text = ICE_TIP_TEXTS.insight[Math.floor(Math.random()*ICE_TIP_TEXTS.insight.length)];
  // 修为增益：基础 60~150，随亲和度提升
  var gain = Math.round((60 + Math.random()*90) * (1 + (f.affinity||0)/100));
  var qiGain = Math.round(gain * 0.6), bodyGain = Math.round(gain * 0.4);
  if (p.qiCultivationPoints === undefined) p.qiCultivationPoints = 0;
  if (p.bodyCultivationPoints === undefined) p.bodyCultivationPoints = 0;
  if (typeof gainCultivation === 'function') gainCultivation('qi', qiGain);
  else p.qiCultivationPoints += qiGain;
  if (typeof gainCultivation === 'function') gainCultivation('body', bodyGain);
  else p.bodyCultivationPoints += bodyGain;
  
  var lines = [text];
  // 小概率悟性+1（随亲和度提高概率）
  var wisChance = 0.06 + (f.affinity||0)/500;
  if (Math.random() < wisChance && p.wisdom !== undefined && p.wisdom < 100) {
    p.wisdom += 1;
    lines.push('（你隐约捕捉到一丝大道真意，悟性+1）');
  }
  
  var card = '<div style="margin-top:6px;padding:8px 10px;border-radius:8px;border:1px solid rgba(120,180,240,0.25);background:linear-gradient(135deg,rgba(60,110,180,0.15),rgba(30,60,120,0.1));">' +
    '<div style="font-size:10px;color:#8ab8e8;font-weight:bold;margin-bottom:3px;">💭 仙子指点</div>' +
    '<div style="font-size:12px;color:#c8dcf0;line-height:1.5;">修为 +' + gain + '（炼气 +' + qiGain + ' · 炼体 +' + bodyGain + '）</div>' +
    (lines.length>1 ? '<div style="font-size:11px;color:#a8c8e8;margin-top:3px;">' + lines[1] + '</div>' : '') +
    '</div>';
  
  _iceTipAppend(f, lines[0], card);
  return true;
}

// 随手赠物：从 ICE_GIFT_POOL 随机赠一件物品
function _iceTipGift(f) {
  var p = G.player;
  var cd = _iceTipCooldown();
  var now = Date.now();
  // 冷却检查（6分钟）
  if (cd.gift && now - cd.gift < 6*60000) return false;
  cd.gift = now;
  
  var gift = ICE_GIFT_POOL[Math.floor(Math.random()*ICE_GIFT_POOL.length)];
  var item = _findItemById(gift.id);
  if (!item) return _iceTipInsight(f); // 兜底
  addItemToInventory(item, 1);
  
  var text = ICE_TIP_TEXTS.gift[Math.floor(Math.random()*ICE_TIP_TEXTS.gift.length)];
  var card = '<div style="margin-top:6px;padding:8px 10px;border-radius:8px;border:1px solid rgba(200,160,80,0.35);background:linear-gradient(135deg,rgba(120,90,40,0.25),rgba(60,40,20,0.15));">' +
    '<div style="font-size:10px;color:#e8c878;font-weight:bold;margin-bottom:3px;">🎁 仙子随手赠物</div>' +
    '<div style="font-size:13px;color:#f0dcb0;font-weight:bold;">获得「' + item.name + '」×1</div>' +
    '<div style="font-size:11px;color:#c8b890;margin-top:2px;">' + (gift.desc || item.desc) + '</div>' +
    '<div style="font-size:10px;color:rgba(200,180,140,0.5);margin-top:2px;">价值 ' + item.value + ' 灵石</div>' +
    '</div>';
  
  _iceTipAppend(f, text, card);
  return true;
}

// 传功：从传功池随机传一门功法（已会的跳过）
function _iceTipTeach(f) {
  var p = G.player;
  var cd = _iceTipCooldown();
  var now = Date.now();
  // 冷却检查（12分钟）
  if (cd.teach && now - cd.teach < 12*60000) return false;
  cd.teach = now;
  
  // 过滤出玩家还没学会的功法
  var candidates = [];
  for (var i=0;i<ICE_TEACH_POOL_IDS.length;i++) {
    var sd = _findSkillById(ICE_TEACH_POOL_IDS[i]);
    if (sd && !_iceKnowsSkill(sd.id)) candidates.push(sd);
  }
  if (candidates.length === 0) return _iceTipInsight(f); // 全学会了，改指点
  
  var sd = candidates[Math.floor(Math.random()*candidates.length)];
  // 加入玩家技能栏（已掌握，未激活）
  p.skills.push({ id: sd.id, name: sd.name, quality: sd.quality, type: sd.type, active: false, mastered: true });
  
  var text = ICE_TIP_TEXTS.teach[Math.floor(Math.random()*ICE_TIP_TEXTS.teach.length)];
  var qualityColor = { '圣级':'#c0a0f0', '神级':'#f0c070', '仙级':'#80e0d0' }[sd.quality] || '#e8e0d0';
  var card = '<div style="margin-top:6px;padding:9px 10px;border-radius:8px;border:1px solid rgba(180,120,240,0.4);background:linear-gradient(135deg,rgba(100,60,180,0.25),rgba(50,30,100,0.15));">' +
    '<div style="font-size:10px;color:#c8a0f0;font-weight:bold;margin-bottom:3px;">📜 仙子传功</div>' +
    '<div style="font-size:14px;color:' + qualityColor + ';font-weight:bold;">「' + sd.name + '」<span style="font-size:10px;color:' + qualityColor + ';">（' + sd.quality + '）</span></div>' +
    '<div style="font-size:11px;color:#c8c0d8;margin-top:3px;">' + (sd.desc||'') + '</div>' +
    '<div style="font-size:10px;color:rgba(200,180,240,0.5);margin-top:2px;">已收录于功法栏 · 可在功法界面激活</div>' +
    '</div>';
  
  _iceTipAppend(f, text, card);
  return true;
}

// 把指点气泡追加到聊天记录
function _iceTipAppend(f, text, cardHtml) {
  var p = G.player;
  if (!p._iceFairyChatHistory) p._iceFairyChatHistory = [];
  p._iceFairyChatHistory.push({ role:'npc', text: text, tip: true });
  var log = document.getElementById('ice-chat-log');
  if (log) {
    var bubble = '<div style="margin-bottom:6px;text-align:left;"><div style="display:inline-block;max-width:88%;padding:6px 10px;border-radius:10px;font-size:13px;line-height:1.6;background:rgba(90,130,190,0.10);color:#b8cce0;border:1px solid rgba(120,170,230,0.18);">' +
      '<div style="font-size:9px;color:rgba(160,200,240,0.45);margin-bottom:2px;font-weight:bold;">🧊 百里冰</div>' +
      escapeHtml(text) + cardHtml + '</div></div>';
    log.insertAdjacentHTML('beforeend', bubble);
    log.scrollTop = log.scrollHeight;
  }
}

// ==========================
// 导出
// ==========================
window.initIceFairy=initIceFairy; window.getIceFairy=getIceFairy;
window.enterIceCoffinChamber=enterIceCoffinChamber; window.showIceFairyPanel=showIceFairyPanel;
window.startIceFairyChat=startIceFairyChat; window.sendIceFairyMessage=sendIceFairyMessage;
window.showIceFairyItemGuide=showIceFairyItemGuide;
window.navigateToIceFairyItemScene=navigateToIceFairyItemScene;
window.tryPartialThaw=tryPartialThaw; window.advanceIceFairyStage=advanceIceFairyStage;
window.defeatIceGuardian=defeatIceGuardian;
window.iceFairyDaoPartner=iceFairyDaoPartner; window.iceFairyDualCultivate=iceFairyDualCultivate;
window.checkIceFairySceneFind=checkIceFairySceneFind;
window.triggerIceFairyAutoEvent=triggerIceFairyAutoEvent;
window.callIceFairyAI=callIceFairyAI; window.triggerFateKill=triggerFateKill; window.proceedToIceFairy=proceedToIceFairy;
window.openIcePortraitPicker=openIcePortraitPicker; window.iceSetPortrait=iceSetPortrait; window.iceClearPortrait=iceClearPortrait;
window.ICE_FAIRY_ITEMS=ICE_FAIRY_ITEMS;
window.iceFairyTip=iceFairyTip;
window.getIceFairyRequest=getIceFairyRequest; window.newIceFairyRequest=newIceFairyRequest;
window.parseIceFairyRequest=parseIceFairyRequest; window.iceFairySubmitRequest=iceFairySubmitRequest;
window.iceRequestOwnedCount=iceRequestOwnedCount;

// ═══════════════════════════════════════
// 👶 子嗣系统（2026-08-04）
// 飞升(练气22+) + 道侣(stage5) + 双修 → 孕育仙胎 → 3天后降生
// ═══════════════════════════════════════
function initChildren() {
  var p = G.player;
  if (!p) return;
  if (!Array.isArray(p._children)) p._children = [];
}
function getChildren() {
  initChildren();
  return G.player._children;
}

// 双修后检查孕育（飞升+道侣才能生育）
// 🔧 2026-08-04：过程叙事增强——
//    1) 怀孕概率 10%→30%（飞升+道侣），且双修必有感应文字（有孕/未孕都有过程感）
//    2) 怀孕后立即记录孕期过程，tickPregnancy 分阶段推送文字
function checkChildConception() {
  try {
    initChildren();
    var p = G.player;
    var f = getIceFairy();
    if (!f || f.stage < 5) return false;   // 未结道侣
    if ((p.qiRealmIndex || 0) < 22) return false;  // 未飞升
    // 已有孕/孩子太多则不再
    if (f.pregnant) return false;
    if ((p._children || []).length >= 3) return false;  // 最多3个
    // 🔧 2026-08-04：产后休养期——上次降生后7天内不再怀孕（避免连续生育变“种马”）
    if (p._lastBirthDay && (G.time.day - p._lastBirthDay) < 7) {
      return false;
    }
    // 20% 概率孕育仙胎（飞升后道侣双修，仙缘深厚；降频让子嗣更珍贵）
    if (Math.random() < 0.20) {
      f.pregnant = {
        conceiveDay: G.time.day,
        dueDay: G.time.day + 3,
        stage: 0,  // 孕期阶段：0灵光入体 → 1胎动初显 → 2胎息稳固 → 3降生
        lastNoteDay: G.time.day
      };
      if (typeof addNarrative === 'function') {
        addNarrative('🌸 阴阳交融之际，一道灵光没入霜华丹田——她怔了怔，脸颊泛起红晕：「……有、有了？」她低声道，「仙胎已成，三日之后，便可降生。」', 'narr-epic');
      }
      return true;
    } else {
      // 未孕——偶尔才有感应过程文字（低概率，不每次双修都提生育话题）
      if (Math.random() < 0.30 && typeof addNarrative === 'function') {
        var hints = [
          '💫 双修后，一缕灵光在你二人之间流转，最终归于虚无——此夜未结仙胎，来日方长。',
          '🌙 霜华依偎在你怀中，指尖轻点丹田：「我感应到一缕生机，却尚未成形……」她微微一笑，「不急，仙缘自有其时。」',
          '✨ 阴阳交融圆满，却未见仙胎之兆。霜华却神色温柔：「大道之途漫漫，我们的缘法，还长着呢。」'
        ];
        addNarrative(hints[Math.floor(Math.random() * hints.length)], 'narr-default');
      }
      return false;
    }
  } catch(e) { return false; }
}

// 每日检查怀孕进度（在 advanceTime 或日常循环调用）
// 🔧 2026-08-04：分阶段过程文字——每天推送孕期进展，降生时完整仪式
function tickPregnancy() {
  try {
    initChildren();
    var p = G.player;
    var f = getIceFairy();
    if (!f || !f.pregnant) return;
    var preg = f.pregnant;
    var dayNow = G.time.day;
    
    // 孕期阶段文字（每天一次，当天已推送过则跳过）
    if (dayNow > (preg.lastNoteDay || 0) && dayNow < preg.dueDay) {
      preg.lastNoteDay = dayNow;
      var daysGone = dayNow - (preg.conceiveDay || dayNow);
      if (daysGone <= 1 && preg.stage < 1) {
        preg.stage = 1;
        if (typeof addNarrative === 'function') {
          addNarrative('🌸 第二日清晨，霜华抚着丹田，眉眼间泛起温柔：「腹中仙胎已生根发芽，我能感到一缕微弱的灵息在跳动。」她抬眸望向你，眸中似有星辰，「你摸摸看？」', 'narr-epic');
        }
      } else if (daysGone >= 2 && preg.stage < 2) {
        preg.stage = 2;
        if (typeof addNarrative === 'function') {
          addNarrative('👶 第三日，仙胎胎动初显。霜华静坐调息时，腹中忽然传来一阵灵光波动——她轻呼一声，随即展颜：「它在动呢，小小一团，却已有了自己的灵识。」她握住你的手，放在小腹上，「它认得你。」', 'narr-epic');
        }
      }
    }
    
    // 降生
    if (dayNow >= preg.dueDay) {
      var names = (p.gender === '女') ? ['雪瑶','冰瑶','灵月','霜儿','念雪'] : ['寒霄','凌霄','尘风','玄儿','念冰'];
      var childName = names[Math.floor(Math.random() * names.length)];
      var gender = Math.random() < 0.5 ? '女' : '男';
      var talent = 60 + Math.floor(Math.random() * 30);  // 仙胎资质60-90
      var child = { name: childName, gender: gender, bornDay: G.time.day, talent: talent, qiRealm: '练气一层' };
      p._children.push(child);
      p._lastBirthDay = G.time.day;  // 🔧 2026-08-04：记录降生日（产后7天休养期）
      delete f.pregnant;
      if (typeof addNarrative === 'function') {
        addNarrative('👶 一声清啼划破长空——你与霜华的孩子降生了！是个' + gender + '孩，取名「' + childName + '」。仙胎资质 ' + talent + '，生而通灵！', 'narr-epic');
        // 完整降生仪式叙事
        addNarrative('🌨️ 那一日，冰窟外漫天飞雪忽然停驻。一道灵光自天穹垂落，映照着霜华怀中啼哭的婴孩——眉眼间既有她的清冷，又有你的轮廓。她低头轻吻婴孩额头，轻声呢喃：「你是我与' + (p.name || '你') + '的孩子……此生此世，娘亲护你周全。」', 'narr-epic');
      }
      if (typeof G.player.eventHistory !== 'undefined' && G.player.eventHistory) {
        G.player.eventHistory.push('👶 与霜华的孩子「' + childName + '」降生（资质' + talent + '）');
      }
    }
  } catch(e) {}
}

// 子嗣面板 HTML（嵌入仙子面板）
function renderChildrenHtml() {
  try {
    initChildren();
    var p = G.player;
    var f = getIceFairy();
    var children = p._children || [];
    var html = '';
    if ((p.qiRealmIndex || 0) < 22) return html;  // 未飞升不显示
    html += '<div style="border:1px solid #f0a0b044;border-radius:6px;padding:8px;margin-top:8px;background:rgba(240,120,150,0.04);">';
    html += '<div style="font-size:11px;font-weight:bold;color:#f0a0b0;margin-bottom:4px;">👶 子嗣</div>';
    if (f.pregnant) {
      var daysLeft = Math.max(0, f.pregnant.dueDay - G.time.day);
      var pgStage = f.pregnant.stage || 0;
      var stageLabels = ['🌸 灵光入体', '🌱 仙胎生根', '👶 胎动初显', '🌟 胎息稳固'];
      var stageLabel = stageLabels[Math.min(pgStage, 3)];
      // 孕期进度条（0~3天）
      var pgProgress = Math.min(100, Math.max(0, (3 - daysLeft) / 3 * 100));
      html += '<div style="font-size:10px;color:#f0a0b0;">' + stageLabel + '（' + (3 - daysLeft) + '/3日）</div>';
      html += '<div style="height:4px;background:rgba(255,255,255,0.08);border-radius:2px;margin:4px 0;"><div style="height:100%;width:' + pgProgress + '%;background:linear-gradient(90deg,#f0a0b0,#ff6b9d);border-radius:2px;"></div></div>';
      html += '<div style="font-size:9px;color:var(--text-dim);">' + (daysLeft > 0 ? '还有 ' + daysLeft + ' 日降生……' : '今日降生！') + '</div>';
    } else if (children.length === 0) {
      html += '<div style="font-size:10px;color:var(--text-dim);">飞升之后，与道侣双修可孕育仙胎。</div>';
    }
    children.forEach(function(c) {
      html += '<div style="font-size:10px;color:var(--text);margin:2px 0;">' + (c.gender === '女' ? '👧' : '👦') + ' ' + c.name + ' · 资质' + c.talent + ' · ' + c.qiRealm + '</div>';
    });
    html += '</div>';
    return html;
  } catch(e) { return ''; }
}

window.initChildren = initChildren; window.getChildren = getChildren;
window.checkChildConception = checkChildConception;
window.tickPregnancy = tickPregnancy;
window.renderChildrenHtml = renderChildrenHtml;
