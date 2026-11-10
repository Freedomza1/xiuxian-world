// === 唯我独仙 · 小说模式（自动叙事引擎） ===
// 不再机械"行动→输出→等待"，而是像小说一样，每一轮流淌出诗意的段落
// 行动藏在叙事里，世界本身会呼吸

let autoModeActive = false;
let autoInterval = null;
let autoCycleCount = 0;
let autoPausedForEvent = false;
// 🔧 自动模式功能开关：自动养宠（喂灵兽）/自动养本命法宝（温养）——自动执行但不弹窗
//    默认开启（用户明确要求“自动模式下自动执行即可，不要弹窗”），可点击按钮关闭
let autoNourishBenming = true;   // 自动温养本命法宝（静默执行）
let autoFeedBeast = true;        // 自动喂养灵兽（静默执行）
let autoMood = '平静';       // 当前叙事基调
let autoWeather = '晴';      // 当前天气
let autoSeason = '春';        // 当前季节
let storyContext = '';       // 上一轮的叙事尾句，用来衔接

// ==========================
// ⚡ 寻仙缘故事线
// 自动探索 = 一场寻找冰封仙子的朝圣之旅
// 随境界提升，故事线阶段推进
// ==========================

// 缘分叙事池（按境界阶段分类）
var FATE_STORY_POOL = {
  // 练气期：缘起——梦中的呼唤
  qi: [
    '夜风掠过耳畔时，你恍惚听见一声极轻的呼唤，像是隔着万重寒冰传来的低语。你回头，身后只有寂寂的山林。',
    '打坐至深夜，一缕寒气无端掠过脊背。你睁眼，窗前不知何时凝了一层薄薄的霜花，霜纹的走向……像一只伸出的手。',
    '你从梦中惊醒，梦里是漫天的风雪，和风雪深处一座若隐若现的冰棺。梦醒后，你发现掌心里多了一粒微小的冰晶。',
    '路过集市时，你听见说书人讲起北方冰原的传说——「万载玄冰中封着一位仙子，只待有缘人」。你心头莫名一颤。',
    '溪水映出你的倒影，水波荡开时，倒影里仿佛多了一个模糊的身影。再定睛看时，只有自己的脸。你摇了摇头，却记住了那一瞬。'
  ],
  // 筑基期：寻踪——北方之行的序幕
  foundation: [
    '越是往北走，风里那股若有若无的冷意便越是清晰。那不是寻常的寒意，更像是一种……久远的等待。',
    '你在旧书摊上翻到一卷残破的札记，字迹娟秀，写着「北地冰窟，仙子沉眠，吾辈无缘，唯待天命」。纸页泛黄，落款却模糊不清。',
    '猎户老翁指着北方说：「冰风石窟那地方，连妖兽都不敢久留。可每隔几年，总有人看见石窟深处透出幽幽蓝光。」',
    '你捡到一片晶莹的鳞片，入手冰凉，却带着一丝温润。老者说这是寒蛟蜕下的，可你总觉得，它像是……从谁身上落下的。',
    '深夜篝火旁，你摊开地图，指尖不自觉地划过北境群山，停在一处标注着「冰封湖」的地方。湖名让你心头微动。'
  ],
  // 金丹期：赴约——听到她的低语
  core: [
    '越接近北境，你的梦境便越是清晰。冰棺中的女子终于转过身来，虽然仍看不清面容，但你知道，她在等你。',
    '你从灵墟中取出一枚冰系灵石，触手之际，一道陌生的意念一闪而过——像是有人在极远处，轻轻唤了一声你的名字。',
    '风里开始带着细碎的冰晶，落在肩头久久不化。你忽然明白，这不是寻常的风雪——这是她的气息，在整片北境等待了万年的气息。',
    '你的功法运转时，丹田深处总有一缕极淡的寒意随之流转。它不是阻碍，反而像是在……回应着什么。',
    '每逢月圆，你耳畔便会响起极轻的吟唱，听不真切，却让你莫名心安。你知道，寻她的路，已经走了一半。'
  ],
  // 元婴+：冰心——守护与并肩
  yuan: [
    '你已能隐约感知到她的方位——在极北之地的某处，被万年玄冰层层包裹。你们之间的因果线，越来越清晰。',
    '战斗中，一缕冰蓝的灵光自你袖中逸出，替你挡下致命一击。你愣住，那灵光中分明有一丝熟悉的气息。',
    '你盘膝修炼时，身边悄然结出一圈霜花，如同她的轮廓。你没有动，任那霜意环绕，仿佛她就在身侧。',
    '你终于确信：这一路走来，每一次莫名的寒意、每一场关于冰的梦、每一粒掌心融化的冰晶，都是她在向你传递讯息。',
    '极北的寒风吹不冷你的心，因为你知道，那里有人在等你。你加快了脚步——不是急于求成，而是想早一刻见到她。'
  ]
};

// 里程碑故事段（境界突破时触发）
var FATE_MILESTONE_POOL = [
  '你突破了瓶颈，天地灵气灌体而入。恍惚间，极北之地的方向传来一声极轻的回应，像一声叹息，又像一声低笑。',
  '你丹田中的灵气奔涌如潮，却在最深处触到一丝冰凉的印记。它静静待在那里，仿佛等了你很久很久。',
  '新境界带来的力量让你目眩神迷，可你最先想起的，却是梦里那座冰棺。她还在等你，你得更强才行。',
  '灵气凝于指尖，你鬼使神差地在虚空中画了一朵莲。冰晶凝成的花瓣缓缓绽开，又缓缓散去——像谁在遥远的地方，回赠了你一个微笑。'
];

// 根据玩家境界获取故事池
function getFateStoryPool() {
  var p = G.player;
  if (!p) return FATE_STORY_POOL.qi;
  var qi = p.qiRealmIndex || 0;
  if (qi >= 15) return FATE_STORY_POOL.yuan;   // 元婴+（index 15 = 元婴初阶）
  if (qi >= 12) return FATE_STORY_POOL.core;    // 金丹（index 12）
  if (qi >= 9) return FATE_STORY_POOL.foundation; // 筑基（index 9）
  return FATE_STORY_POOL.qi;
}

// 是否已遇到冰仙子（stage>=2 说明已初遇）
function fateStoryMet() {
  try {
    var f = typeof getIceFairy === 'function' ? getIceFairy() : null;
    return !!(f && f.stage >= 2);
  } catch(e) { return false; }
}

// 获取缘份值（0-100）
function fateStoryValue() {
  try {
    var f = typeof getIceFairy === 'function' ? getIceFairy() : null;
    return f ? (f.fate || 0) : 0;
  } catch(e) { return 0; }
}

// 获取一条寻仙缘故事片段（考虑已相遇/未相遇）
function getFateStoryLine() {
  var pool = getFateStoryPool();
  var arr = pool.slice();
  // 已相遇后，故事转向陪伴
  if (fateStoryMet()) {
    arr = arr.concat([
      '你与她的因果线在虚空中轻轻震颤。你知道，远方冰窟中的她，正在等你回去说说话。',
      '风里带着北境的寒意，你却不觉得冷。因为你知道，那个方向，有人在等你。',
      '你的脚步不自觉地偏向了北方——那里有你的牵挂。'
    ]);
  }
  return arr[Math.floor(Math.random() * arr.length)];
}

// 里程碑检查：记录上一次触发时的境界/缘份，跨节点时触发
var _fateMileChecked = false;
function checkFateMilestone() {
  var p = G.player;
  if (!p) return null;
  if (!G._fateMile) G._fateMile = { qi: 0, fate: 0 };
  var qi = p.qiRealmIndex || 0;
  var fate = fateStoryValue();
  var trigger = null;
  // 境界跨大阶段（练气→筑基→金丹→元婴）
  var stage = qi >= 15 ? 4 : qi >= 12 ? 3 : qi >= 9 ? 2 : 1;
  if (G._fateMile.qiStage && stage > G._fateMile.qiStage) trigger = 'realm';
  // 缘份跨 20/40/60/80
  if (!trigger && Math.floor(fate/20) > Math.floor((G._fateMile.fate||0)/20) && fate >= 20) trigger = 'fate';
  G._fateMile.qiStage = stage;
  G._fateMile.fate = fate;
  return trigger;
}

// 里程碑触发时生成专属段落（追加到叙事流）
function triggerFateMilestoneNarrative() {
  var line = FATE_MILESTONE_POOL[Math.floor(Math.random() * FATE_MILESTONE_POOL.length)];
  addNarrative(line, 'narr-epic');
  storyContext = line.slice(-40);
}

// 每次自动探索轮开始时调用：返回可注入的缘分段落（或null）
function maybeFateStoryInjection() {
  try {
    var p = G.player;
    if (!p) return null;
    // 尚未接触冰仙子剧情（没进过冰窟）时，低概率出现
    var met = fateStoryMet();
    var fate = fateStoryValue();
    // 概率：缘份越高越容易触发（5%~25%），已相遇后陪伴线20%
    var chance = met ? 0.20 : (0.05 + fate / 500);
    if (Math.random() > chance) return null;
    return getFateStoryLine();
  } catch(e) { return null; }
}

// 天气/季节轮转
const WEATHERS = ['晴','阴','小雨','暴雨','大风','雾','霜','雪'];
const SEASONS = ['春','夏','秋','冬'];
const PERIOD_NAMES = ['子时·夜半','丑时·鸡鸣','寅时·平旦','卯时·日出','辰时·食时','巳时·隅中',
                      '午时·日中','未时·日昳','申时·晡时','酉时·日入','戌时·黄昏','亥时·人定'];

// 世界偶发事件池（纯叙事）
const WORLD_FLUFF = [
  '远处的山巅有雷光一闪而过，不知是哪位前辈在渡劫。',
  '风里传来若有若无的琴声，转瞬便被林涛吞没。',
  '一只白鹤掠过天际，在云层中化作一个细小的黑点。',
  '你忽然想起凡间的某个午后——蝉鸣、竹椅、奶奶摇着的蒲扇。那些记忆已经很久远了。',
  '地脉深处传来一声沉闷的轰鸣，像大地的叹息。',
  '一片枯叶打着旋儿落在你肩头，脉络清晰如掌纹，仿佛记载着某个被遗忘的故事。',
  '远处有孩童的笑声隐约传来，仔细听时又只剩下风声。',
  '你仰头望天，云层正在缓缓聚拢，像一张正在酝酿着什么的脸。',
  '不知从何处飘来一缕香气——是桂花，还是记忆里的炊烟？',
  '水面忽然泛起一圈涟漪，但四下无人，也无风雨。',
];

// ==========================
// 自动模式开关
// ==========================

// ==========================
// 📊 角色发展评估与优化
// ==========================
function _evaluateCharacter() {
  var p = G.player;
  if (!p) return;
  var issues = [];
  var suggestions = [];
  G._charEval = G._charEval || { lastRun: 0, issues: [], flags: {} };
  
  // 装备检查
  if (p.equipped) {
    var hasWeapon = false, hasArmor = false;
    for (var slot in p.equipped) {
      if (p.equipped[slot]) {
        if (slot === 'weapon' || slot === 'secondary') hasWeapon = true;
        if (slot === 'body' || slot === 'head' || slot === 'accessory') hasArmor = true;
      }
    }
    G._charEval.flags.needsWeapon = !hasWeapon;
    G._charEval.flags.needsArmor = !hasArmor;
    if (!hasWeapon) { issues.push('缺武器'); suggestions.push('找一把趁手兵器'); }
    if (!hasArmor) { issues.push('缺护甲'); suggestions.push('添置防具'); }
  }
  
  // 功法/技能检查
  if (p.skills) {
    G._charEval.flags.skillCount = p.skills.length;
    var hasXinfa = p.skills.some(function(sk) {
      var sd = G.skillData ? G.skillData.find(function(d) { return d.id === sk.id; }) : null;
      return sd && sd.slot === 'xinfa';
    });
    var hasShenfa = p.skills.some(function(sk) {
      var sd2 = G.skillData ? G.skillData.find(function(d) { return d.id === sk.id; }) : null;
      return sd2 && sd2.slot === 'shenfa';
    });
    G._charEval.flags.hasXinfa = hasXinfa;
    G._charEval.flags.hasShenfa = hasShenfa;
    if (!hasXinfa) { issues.push('缺心法'); suggestions.push('修习一门心法'); }
    if (!hasShenfa && p.qiRealmIndex >= 2) { issues.push('缺身法'); suggestions.push('学一门身法'); }
    
    if (typeof autoLearnScrolls === 'function') autoLearnScrolls();
    
    var emptySlots = 0;
    if (typeof getMaxEquipSlots === 'function') {
      var maxSlots = getMaxEquipSlots();
      var equippedCount = p.skills ? p.skills.filter(function(sk) { return sk.active; }).length : 0;
      emptySlots = maxSlots - equippedCount;
      if (emptySlots > 0) { issues.push('空' + emptySlots + '格装备位'); suggestions.push('学习更多功法'); }
    }
    G._charEval.flags.emptySlots = emptySlots;
  }
  
  // 低等级新号标记
  var isNewChar = p.qiRealmIndex < 3 && (!p.skills || p.skills.length < 2);
  G._charEval.flags.isNewChar = isNewChar;
  if (isNewChar) { issues.push('新手修士'); suggestions.push('先逛城镇攒点功法和装备'); }
  
  // 灵石太少
  G._charEval.flags.broke = (p.stones || 0) < 100 && p.qiRealmIndex >= 3;
  if (G._charEval.flags.broke) { issues.push('缺灵石'); suggestions.push('打怪卖材料'); }
  
  // 每50轮报告
  if (issues.length > 0 && autoCycleCount % 50 === 0) {
    addNarrative('📋 自我审视：' + issues.join('、') + '。' + suggestions[Math.floor(Math.random() * suggestions.length)] + '。', 'event');
  }
  G._charEval.issues = issues;
  G._charEval.lastRun = autoCycleCount;
}

// ==========================
// 💬 存档：评估函数
// ==========================：评估函数
// ==========================

function toggleAutoMode() {
  if (autoModeActive) { stopAutoMode(); }
  else { startAutoMode(); }
}

function startAutoMode() {
  if (autoModeActive) return;
  if (!G.player || G.player.isAlive === false) {
    addNarrative('状态不佳，无法进入自动模式。', 'system');
    return;
  }
  loadAutoCarePrefs(); // 🔧 恢复自动养宠/温养开关偏好
  autoModeActive = true;
  // 统一自动模式标志（供各系统检测：xinmo/悟道/突破等）
  if (G) { G.autoMode = true; G._autoMode = true; }
  autoCycleCount = 0;
  _autoBoredom = 0;
  _cycleTick = 0;
  storyContext = '';
  autoMood = '平静';
  // 初始化天气和季节
  autoWeather = WEATHERS[Math.floor(Math.random() * WEATHERS.length)];
  autoSeason = SEASONS[Math.floor(Math.random() * 4)];
  addNarrative('🌸 天地归于寂静，你的意志融入道中。此后的一举一动，皆如诗文般自然流淌……', 'event');
  addNarrative('💡 点击「手动」按钮可随时切回操作模式。', 'system');
  updateAutoModeButton();
  runAutoCycle();
}

function stopAutoMode() {
  autoModeActive = false;
  if (G) { G.autoMode = false; G._autoMode = false; }
  if (autoInterval) { clearInterval(autoInterval); autoInterval = null; }
  autoPausedForEvent = false;
  addNarrative('🌄 你收回心神，重新接管了身体的控制。世界依旧运转，只是换了一个视角。', 'event');
  updateAutoModeButton();
}

function updateAutoModeButton() {
  const btn = document.getElementById('btn-auto');
  if (!btn) return;
  btn.textContent = autoModeActive ? '⏸️ 手动' : '🤖 自动';
  btn.style.background = autoModeActive ? 'linear-gradient(135deg,#8a3a2a,#c94a3a)' : '';
  updateAutoCareButtons();
}

// 🔧 自动养宠/温养开关：默认开（自动执行不弹窗），点击切换并持久化到 localStorage
function getAutoCarePref(key) {
  try {
    const v = localStorage.getItem('auto_care_' + key);
    if (v === null) return true; // 未设置过 → 默认开启
    return v === '1';
  } catch(e) { return true; }
}
function setAutoCarePref(key, val) {
  try { localStorage.setItem('auto_care_' + key, val ? '1' : '0'); } catch(e) {}
}
function loadAutoCarePrefs() {
  autoNourishBenming = getAutoCarePref('nourish');
  autoFeedBeast = getAutoCarePref('feed');
}
function updateAutoCareButtons() {
  const bn = document.getElementById('btn-auto-nourish');
  const bf = document.getElementById('btn-auto-feed');
  if (bn) {
    bn.textContent = autoNourishBenming ? '🔮 温养:开' : '🔮 温养:关';
    bn.style.background = autoNourishBenming ? 'linear-gradient(135deg,#2a5a8a,#3a7ac9)' : 'rgba(100,100,100,0.25)';
  }
  if (bf) {
    bf.textContent = autoFeedBeast ? '🐾 喂宠:开' : '🐾 喂宠:关';
    bf.style.background = autoFeedBeast ? 'linear-gradient(135deg,#2a7a5a,#3ac98a)' : 'rgba(100,100,100,0.25)';
  }
}
function toggleAutoNourish() {
  autoNourishBenming = !autoNourishBenming;
  setAutoCarePref('nourish', autoNourishBenming);
  updateAutoCareButtons();
  addNarrative(autoNourishBenming ? '🔮 自动温养本命法宝：开启（有材料时自动温养）' : '🔮 自动温养本命法宝：关闭（改为手动温养）', 'system');
}
function toggleAutoFeed() {
  autoFeedBeast = !autoFeedBeast;
  setAutoCarePref('feed', autoFeedBeast);
  updateAutoCareButtons();
  addNarrative(autoFeedBeast ? '🐾 自动喂养灵兽：开启（灵兽需要时自动喂食）' : '🐾 自动喂养灵兽：关闭（改为手动喂养）', 'system');
}

// ⚡ 测试模式：黑市刷新1灵石
window.__TEST_REFRESH_COST = 1;

// ==========================
// 主循环 - 好奇修士版
// ==========================
var _autoBoredom = 0;       // 无聊计数器
var _autoIdleTimer = 0;
var _exploreStreak = 0;     // 🔧 连续探索计数器（防逛图失控）
var _overlayOpenSince = 0;  // 🔧 弹窗打开时间戳（超时自动关闭防卡死）
var _huntTries = 0;          // 🔧 猎场连续捕兽计数（8场未抓到自动离开防死磕）
var _huntNavCooldownUntil = 0; // 🔧 猎场导航冷却：被 exploreStreak 打断后暂时不再追猎（防导航风暴饿死其他行为）

// 🔧 赶路穿插判断：当前场景有值得做的“侧行动”时返回 true（温养/喂养/修炼/战斗）
//    用于导航中途停下干活，解决导航独占runAutoCycle的问题
function canDoSideAction() {
  const p = G.player;
  if (!p) return false;
  // 有温养材料且法宝未满级（受 autoNourishBenming 开关控制）
  if (autoNourishBenming && p.benming && p.benming.unlocked && p.benming.level < 99 && p.inventory) {
    if (typeof BENMING_UPGRADE !== 'undefined' && BENMING_UPGRADE.nourish) {
      const hasMat = BENMING_UPGRADE.nourish.some(n => p.inventory.some(it => it.id === n.id && it.qty > 0));
      if (hasMat) return true;
    }
  }
  // 灵兽需要照顾且有灵草（受 autoFeedBeast 开关控制）
  if (autoFeedBeast && p.beasts && p.beasts.length > 0 && p.inventory) {
    const needsCare = p.beasts.some(b => b && ((b.mood || 80) < 70 || (b.maxHp && b.hp < b.maxHp * 0.7)));
    const hasFeed = p.inventory.some(it => it && it.qty > 0 && (it.type === '灵草' || it.herbEffect));
    if (needsCare && hasFeed) return true;
  }
  // 灵力/气血偏低需要恢复
  if (p.hp < p.maxHp * 0.5 || p.qi < p.maxQi * 0.4) return true;
  return false;
}
var _restCycles = 0;         // 回城休息计数器：连续休息直到满状态

function runAutoCycle() {
  if (!autoModeActive) return;
  
  // 🧟 角色死亡/转世：自动挂机立即停止
  if (!G.player || G.player.isAlive === false) {
    stopAutoMode();
    addNarrative('你的道途已尽，自动挂机停止。', 'system');
    return;
  }
  
  // 🚧 弹窗检测：有事件弹窗打开时暂停（防止未来新弹窗卡死自动循环）
  // 🔧 自动模式下若弹窗超过 15 秒未关闭（可能是不需要玩家决策的展示型弹窗），
  //    自动关闭它继续挂机——否则弹窗会永久卡住自动模式（“不动了”）。
  try {
    const overlay = document.getElementById('event-overlay');
    if (overlay && !overlay.classList.contains('hidden')) {
      // 记录弹窗打开时间
      if (!_overlayOpenSince) _overlayOpenSince = Date.now();
      const openMs = Date.now() - _overlayOpenSince;
      if (openMs > 15000) {
        // 💌 聊天框特殊处理：用户正在与仙子聊天时，绝不自动关闭（可一直挂着聊）
        const isIceChatOpen = !!document.getElementById('ice-chat-log');
        if (isIceChatOpen) {
          _overlayOpenSince = 0;
          autoCycleCount++;
          if (autoInterval) clearInterval(autoInterval);
          autoInterval = setTimeout(runAutoCycle, 2000);
          return;
        }
        // 超过15秒：自动关弹窗（展示型弹窗不需要玩家操作）
        _overlayOpenSince = 0;
        if (typeof closeCustomModal === 'function') {
          try { closeCustomModal(); } catch(e) {}
        } else {
          overlay.classList.add('hidden');
        }
        if (typeof resetModalState === 'function') resetModalState();
        addNarrative('你拂袖收起眼前的光幕，继续赶路。', 'event');
        // 继续正常循环（不 return，让本轮正常执行）
      } else {
        autoCycleCount++;
        // 走统一调度，避免setTimeout叠链
        if (autoInterval) clearInterval(autoInterval);
        autoInterval = setTimeout(runAutoCycle, 2000);
        return;
      }
    } else {
      _overlayOpenSince = 0;
    }
  } catch(e) {}
  
  if (autoCycleCount > 100) { autoCycleCount = 0; }
  autoCycleCount++;
  _autoIdleTimer++;

  const p = G.player;
  
  // ── 🐾 没有灵兽：优先去猎场/在猎场连续捕兽（抓到第一只即满足，不再死磕）──
  // 在猎场时每轮都战斗（直到抓到）；不在猎场时每2轮检查一次（避免完全独占）
  var inHuntScene = false;
  // 🔧 猎场导航冷却：exploreStreak 强制停（猎场太远/走不到）后 30 秒内不再追猎，让修炼/突破/任务先跑
  var huntNavCooling = Date.now() < _huntNavCooldownUntil;
  if ((!p.beasts || p.beasts.length < 1) && !huntNavCooling && typeof findBeastHuntingScene === 'function') {
    try {
      var huntScene2 = findBeastHuntingScene();
      inHuntScene = !!(huntScene2 && huntScene2.id === G.currentScene);
      // 节流：不在猎场时每2轮检查一次；在猎场时每轮都战斗
      var shouldHunt = inHuntScene || autoCycleCount % 2 === 0;
      if (huntScene2 && shouldHunt) {
        if (huntScene2.id !== G.currentScene) {
          // 正在赶路去别处 → 改道猎场
          if (G._navTarget && G._navTarget !== huntScene2.id) {
            G._navTarget = huntScene2.id;
            addNarrative('🐾 你想起「' + huntScene2.name + '」一带常有灵兽出没，改道去碰碰机缘！', 'event');
          } else if (!G._navTarget) {
            G._navTarget = huntScene2.id;
            addNarrative('🐾 你想起「' + huntScene2.name + '」一带常有灵兽出没，动身前往！', 'event');
          }
          var delayHuntNav = 3000 + Math.random() * 2000;
          if (!autoModeActive) return;
          if (autoInterval) clearInterval(autoInterval);
          autoInterval = setTimeout(runAutoCycle, delayHuntNav);
          return;
        } else {
          // 已在猎场：连续战斗捕兽（抓到或栏满为止）
          G._navTarget = null;
          _exploreStreak = 0;
          _huntTries = (_huntTries || 0) + 1;
          // 🔧 连续8场仍未抓到：保底机制（5场必抓）都失效了，离开猎场去做别的
          //    防止“在猎场死磕一直不动”的极端情况（如旧存档格式异常/捕获判定路径漏走）
          if (_huntTries >= 8) {
            _huntTries = 0;
            p._catchStreak = 0;
            G._navTarget = null;
            addNarrative('你在此处守候良久，灵兽始终未再露面。你决定先去别处历练，来日再访。', 'event');
            var delayLeave = 3000 + Math.random() * 2000;
            if (!autoModeActive) return;
            if (autoInterval) clearInterval(autoInterval);
            autoInterval = setTimeout(runAutoCycle, delayLeave);
            return;
          }
          if (typeof startAutoCombat === 'function') {
            try { startAutoCombat(); } catch(e) {}
            addNarrative('🐾 你在猎场仔细搜寻，试图收服灵兽幼崽。', 'event');
          } else {
            addNarrative('🐾 你在猎场四处搜寻灵兽的踪迹。', 'event');
          }
          var delayHunt = 3000 + Math.random() * 2000;
          if (!autoModeActive) return;
          if (autoInterval) clearInterval(autoInterval);
          autoInterval = setTimeout(runAutoCycle, delayHunt);
          return;
        }
      }
    } catch(e) {}
  }

  // ── 🧭 导航优先：有目标就赶路，不打断（但防连续逛图失控）──
  if (G._navTarget && G._navTarget !== G.currentScene) {
    // 🔧 连续探索防失控：逛图超过5轮强制停下，转当前场景干活（战斗/修炼/采药）
    _exploreStreak++;
    if (_exploreStreak >= 5) {
      G._navTarget = null;
      _exploreStreak = 0;
      // 🔧 猎场导航被打断（说明猎场太远/当前走不到）→ 冷却 30 秒不再追猎
      //    否则下轮猎场块又设回 navTarget → 死循环饿死修炼/突破/任务（用户反馈的“卡住”）
      if (autoCycleCount % 2 === 0) _huntNavCooldownUntil = Date.now() + 30000;
      addNarrative('你停下脚步，决定就在此地修行历练。', 'event');
      var delayStop = 3000 + Math.random() * 2000;
      if (!autoModeActive) return;
      if (autoInterval) clearInterval(autoInterval);
      autoInterval = setTimeout(runAutoCycle, delayStop);
      return;
    }
    // 🔧 赶路穿插：每走3步就停下来直接料理温养/喂养（不依赖权重抽选，保证必触发）
    //    解决“导航独占runAutoCycle导致温养喂养永远轮不到”的问题
    if (_exploreStreak % 3 === 0 && typeof canDoSideAction === 'function' && canDoSideAction()) {
      G._navTarget = null;
      _exploreStreak = 0;
      // 直接执行侧行动：温养+喂养都做（不互斥，材料/灵草充足时一起料理）
      //   🔧 受 autoNourishBenming / autoFeedBeast 开关控制（默认关=玩家手动养）
      let did = false;
      const p = G.player;
      if (autoNourishBenming && p.benming && p.benming.unlocked && p.benming.level < 99 && typeof nourishBenming === 'function') {
        const hasMat = (typeof BENMING_UPGRADE !== 'undefined' && BENMING_UPGRADE.nourish) ?
          BENMING_UPGRADE.nourish.some(n => p.inventory.some(it => it.id === n.id && it.qty > 0)) : false;
        if (hasMat) { try { nourishBenming(); addNarrative('你取出材料温养本命法宝，灵性渐增。', 'event'); did = true; } catch(e){} }
      }
      if (autoFeedBeast && p.beasts && p.beasts.length > 0 && typeof feedBeast === 'function') {
        // 找亲密度最低/最受伤的灵兽 + 背包里的灵草，带参调用 feedBeast(beastIdx, itemId)
        let targetIdx = -1, worstScore = 999;
        p.beasts.forEach(function(b, i) {
          if (!b) return;
          const score = (b.mood || 80) - (b.maxHp && b.hp < b.maxHp ? (b.maxHp - b.hp) / b.maxHp * 50 : 0);
          if (score < worstScore) { worstScore = score; targetIdx = i; }
        });
        if (targetIdx >= 0) {
          const feedItem = p.inventory.find(it => it && it.qty > 0 && (it.type === '灵草' || it.herbEffect));
          if (feedItem) { try { feedBeast(targetIdx, feedItem.id); did = true; } catch(e){} }
        }
      }
      if (!did && (p.hp < p.maxHp * 0.5 || p.qi < p.maxQi * 0.4) && typeof rest === 'function') {
        try { rest(); did = true; } catch(e){}
      }
      if (!did) addNarrative('你暂缓赶路，稍作休整。', 'event');
      var delaySide = 3000 + Math.random() * 2000;
      if (!autoModeActive) return;
      if (autoInterval) clearInterval(autoInterval);
      autoInterval = setTimeout(runAutoCycle, delaySide);
      return;
    }
    if (typeof walkOneStepToward === 'function') {
      var moved = walkOneStepToward(G._navTarget);
      if (G.currentScene === G._navTarget) {
        G._navTarget = null;
        var scName = (typeof getSceneData === 'function' && getSceneData(G.currentScene)) ? getSceneData(G.currentScene).name : '目的地';
        addNarrative('📍 你抵达了「' + scName + '」，好奇地四处打量。', 'event');
        // 抵达新地点→探索一下
        exploreCurrentScene();
      } else if (!moved) {
        G._navTarget = null;
      }
    } else {
      G._navTarget = null;
    }
    var delay = 4000 + Math.random() * 3000;
    if (!autoModeActive) return;
    if (autoInterval) clearInterval(autoInterval);
    autoInterval = setTimeout(runAutoCycle, delay);
    return;
  }
  G._navTarget = null;

  // ── ❤️ 低血量/低灵气保护：先回血再干活 ──
  if (p && (p.hp < p.maxHp * 0.4 || p.qi < p.maxQi * 0.2)) {
    // 🔧 2026-08-04：化神+有道侣 → 双修回满所有状态（用户偏好：不吃药，双修回满）
    //    双修每日 3 次上限，次数用完才走兜底（rest/回城）
    // 🔧 2026-08-04：不再自动双修（用户要求）——低血恢复不走双修捷径，统一吃药/回城 rest
    var curSceneData = typeof getSceneData === 'function' ? getSceneData(G.currentScene) : null;
    if (curSceneData && curSceneData.safe) {
      if (typeof rest === 'function') rest();
    } else {
      // 🔧 2026-08-04：非安全区低血——优先吃能回血的丹（回 qi 不回 hp 的没用），
      //    否则导航回城 rest 渐进恢复（避免原地吃丹回不满/卡死）
      var hasHpPill = p.inventory && p.inventory.some(function(it){ return it.use && (it.use.hp || it.use.hpPercent); });
      var didHeal = false;
      if (hasHpPill && typeof consumeBestHealItem === 'function') {
        try { didHeal = consumeBestHealItem(); } catch(e) {}
      }
      if (!didHeal) {
        if (typeof findNearestTown === 'function') {
          var town = findNearestTown();
          if (town && town.id !== G.currentScene) {
            G._navTarget = town.id;
            if (typeof walkOneStepToward === 'function') walkOneStepToward(town.id);
          }
        }
      }
    }
    var delay2 = 4000 + Math.random() * 3000;
    if (!autoModeActive) return;
    if (autoInterval) clearInterval(autoInterval);
    autoInterval = setTimeout(runAutoCycle, delay2);
    return;
  }

  // 每10轮自动整理背包
  if (autoCycleCount % 10 === 0 && typeof autoSellInventory === 'function') autoSellInventory();
  if (typeof autoLearnScrolls === 'function') autoLearnScrolls();
  // 💾 挂机每10轮保存一次进度（防止长时间挂机后崩溃/断电丢进度）
  if (autoCycleCount % 10 === 0 && typeof saveGameNow === 'function') {
    try { saveGameNow(); } catch(e) {}
  }

  // 第一轮基础自检（全空技能时友好提示）
  if (autoCycleCount === 1 && p && p.skills && p.skills.length === 0) {
    addNarrative('你手无寸技，得想办法弄本功法才行……先去镇上看看吧。', 'event');
  }

  // ── 📊 每20轮：角色发展评估与优化建议 ──
  if (autoCycleCount > 0 && autoCycleCount % 20 === 0) {
    try { _evaluateCharacter(); } catch(e) {}
  }

  // ── 🧠 修士决策大脑（思考当前处境，做出最优选择）──
  var scene = typeof getSceneData === 'function' ? getSceneData(G.currentScene) : null;
  var curSceneData = scene;
  var sceneSafe = curSceneData && curSceneData.safe;
  var hasMonsters = curSceneData && !sceneSafe && curSceneData.monsters && curSceneData.monsters.length > 0;
  var qiPct = p.qi / p.maxQi;
  var hpPct = p.hp / p.maxHp;
  var qiFilled = typeof getCultivationProgress === 'function' ? getCultivationProgress('qi') : 0;
  var bodyFilled = typeof getCultivationProgress === 'function' ? getCultivationProgress('body') : 0;
  var nearBreakthrough = qiFilled >= 90 || bodyFilled >= 90;
  
  // ── 思考1：是否需要突破？（每12轮一次，避免刷屏）──
  var needBreakthrough = false;
  if ((qiFilled >= 100 || bodyFilled >= 100) && autoCycleCount % 12 === 0) {
    needBreakthrough = true;
    var breakthroughMsgElapsed = p._lastBreakthroughMsgTime ? (Date.now() - p._lastBreakthroughMsgTime) : Infinity;
    var bodyBreakMsgElapsed = p._lastBodyBreakMsg ? (Date.now() - p._lastBodyBreakMsg) : Infinity;
    
    if (typeof autoBuyFromBlackMarket === 'function') { try { autoBuyFromBlackMarket(); } catch(e) {} }
    
    if (getCultivationProgress('qi') >= 100 && p.qiRealmIndex < 22) {
      try { qiBreakthroughCheck(); } catch(e) {}
      qiFilled = typeof getCultivationProgress === 'function' ? getCultivationProgress('qi') : 0;
      if (qiFilled < 100 && typeof autoNavigateMissingItems === 'function' && breakthroughMsgElapsed > 25000) {
        p._lastBreakthroughMsgTime = Date.now();
        try { autoNavigateMissingItems(); } catch(e) {}
      }
    }
    if (getCultivationProgress('body') >= 100 && p.bodyRealmIndex < 16) {
      try { bodyBreakthroughCheck(); } catch(e) {}
      bodyFilled = typeof getCultivationProgress === 'function' ? getCultivationProgress('body') : 0;
      if (bodyFilled < 100 && typeof autoNavigateMissingItems === 'function' && bodyBreakMsgElapsed > 25000) {
        p._lastBodyBreakMsg = Date.now();
        try { autoNavigateMissingItems(); } catch(e) {}
      }
    }
    if (getCultivationProgress('qi') >= 100 || getCultivationProgress('body') >= 100) {
      var brDelay = 8000 + Math.random() * 4000;
      if (!autoModeActive) return;
      if (autoInterval) clearInterval(autoInterval);
      autoInterval = setTimeout(runAutoCycle, brDelay);
      return;
    }
  }
  
  // ── ⚡ 化神后日常循环（qiRealmIndex>=18）：打坐→炼体→试炼塔→双修 → 快速提战力/飞升准备 ──
  // 🔧 2026-08-04：化神后每日固定修行流程，优先级最高（其他行为退居其次）
  // 🔧 2026-08-04：飞升后（>=22）进入「双人逍遥模式」——不再刷塔/打怪，改为双修互动+看孩子+双人游历
  if (p.qiRealmIndex >= 18) {
    var isAscended = (p.qiRealmIndex || 0) >= 22;
    var _ascended = isAscended;  // 供下方分支使用
    // 0️⃣ 试炼塔自动爬塔进行中 → 等待（不打断，让爬塔跑完）
    if (typeof _autoTowerRunning !== 'undefined' && _autoTowerRunning) {
      var twDelay = 4000 + Math.random() * 2000;
      if (!autoModeActive) return;
      if (autoInterval) clearInterval(autoInterval);
      autoInterval = setTimeout(runAutoCycle, twDelay);
      return;
    }

    var dailyDid = false;
    // 今日标记（避免重复触发）
    if (!G._hsDaily) G._hsDaily = {};
    var dd = G._hsDaily;
    if (dd.day !== G.time.day) {
      dd.day = G.time.day;
      dd.meditate = false;
      dd.body = false;
      dd.tower = false;
      dd.dual = 0;
      dd.kids = false;      // 飞升：看孩子
      dd.wander = false;    // 飞升：双人游历
      dd.ascend = false;    // 飞升：共赴飞升仪式
    }
    var f = (typeof getIceFairy === 'function') ? getIceFairy() : null;
    var isDualPartner = f && f.stage >= 5;

    // 1️⃣ 每日打坐（未做时）
    if (!dd.meditate && typeof qiCultivate === 'function') {
      try { qiCultivate(); dd.meditate = true; dailyDid = true; } catch(e) {}
    }
    // 2️⃣ 每日炼体（未做时）
    if (!dd.body && typeof bodyCultivate === 'function') {
      try { bodyCultivate(); dd.body = true; dailyDid = true; } catch(e) {}
    }
    // 3️⃣ 每日试炼塔（未打时，自动刷塔到战力极限）——飞升后跳过，改为逍遥活动
    if (!isAscended && !dd.tower && typeof autoRunTower === 'function') {
      try {
        // 确保不在塔内战斗时才开爬（防止重复）
        var ts = typeof getTowerState === 'function' ? getTowerState() : null;
        if (!ts || !ts._inTowerBattle) {
          autoRunTower();
          dd.tower = true;
          dailyDid = true;
        }
      } catch(e) {}
    }
    // 4️⃣ 每日双修——🔧 2026-08-04：已取消自动双修（用户要求），手动按钮保留
    // 🌟 飞升专属：每日看孩子（有孩子时）
    if (isAscended && !dd.kids && (typeof getChildren === 'function')) {
      try {
        var kids = getChildren();
        if (kids && kids.length > 0) {
          dd.kids = true;
          dailyDid = true;
          if (typeof ascendKidsDaily === 'function') {
            ascendKidsDaily();
          }
        }
      } catch(e) {}
    }
    // 🌟 飞升专属：每日双人游历（有道侣时）
    if (isAscended && !dd.wander && isDualPartner) {
      try {
        dd.wander = true;
        dailyDid = true;
        if (typeof ascendWanderDaily === 'function') {
          ascendWanderDaily();
        }
      } catch(e) {}
    }
    // 🌟 飞升专属：共赴飞升仪式（只触发一次——飞了就是飞了，成功后再无仪式，回归日常）
    if (isAscended && !dd.ascend && (typeof canAscendTogether === 'function') && canAscendTogether() &&
        !p._ascensionCount) {
      try {
        dd.ascend = true;
        dailyDid = true;
        if (typeof startAscension === 'function') {
          startAscension();
        }
      } catch(e) {}
    }
    // 5️⃣ 本命法宝自动进阶（材料齐时，无材料静默跳过）
    if (typeof advanceBenmingRank === 'function' && p.benming && p.benming.unlocked) {
      try {
        // 先检查材料是否够（不够就不调，避免刷屏）
        var bm = p.benming;
        var nextIdx = bm.rankIndex + 1;
        var needDef = (typeof BENMING_UPGRADE !== 'undefined' && BENMING_UPGRADE.break) ? BENMING_UPGRADE.break[nextIdx] : null;
        var haveAll = true;
        if (needDef && needDef.need) {
          for (var ni = 0; ni < needDef.need.length; ni++) {
            var it = needDef.need[ni];
            var owned = (p.inventory || []).find(function(x){ return x.id === it.id; });
            if (!owned || (owned.qty || 1) < it.qty) { haveAll = false; break; }
          }
        } else {
          haveAll = false; // 没有下一阶定义 = 已满
        }
        if (haveAll) { advanceBenmingRank(); dailyDid = true; }
      } catch(e) {}
    }

    if (dailyDid) {
      // 化神后日常优先——完成一轮后短暂间隔，继续下一轮
      var hsDelay = 5000 + Math.random() * 3000;
      if (!autoModeActive) return;
      if (autoInterval) clearInterval(autoInterval);
      autoInterval = setTimeout(runAutoCycle, hsDelay);
      return;
    }

    // 🔧 化神后日常全部完成：不再乱逛/乱打，静候明日（低强度补充：自动吃药回满、温养、等待）
    // 偶尔休息回血回蓝，其余时间安静等待时间推进
    // 🔧 2026-08-04：塔退出保留战损——不再这里主动回血（吃最猛的丹直接满血=“塔白打了”），
    //    低血恢复交给 runAutoCycle 顶部的低血保护（hp<40% 才恢复），正常战损（40%-60%）保留
    // 自动温养本命（若有材料）
    if (autoNourishBenming && p.benming && p.benming.unlocked && p.benming.level < 99 && typeof nourishBenming === 'function') {
      var hasNourishMat = false;
      if (typeof BENMING_UPGRADE !== 'undefined' && BENMING_UPGRADE.nourish) {
        hasNourishMat = BENMING_UPGRADE.nourish.some(function(n) {
          return (p.inventory || []).some(function(it) { return it.id === n.id && it.qty > 0; });
        });
      }
      if (hasNourishMat) { try { nourishBenming(); } catch(e) {} }
    }
    // 🌟 飞升后等待时段：偶尔来一段逍遥小叙事（低概率，不刷屏）——双人小确幸/看孩子/看世界
    //    日常的 kids/wander 有当天保护，这里用独立间隔（每2天最多1次）避免完全没内容
    if (isAscended) {
      var _idleRoll = Math.random();
      if (_idleRoll < 0.30) {
        // 看世界：随机去安全场景纯观光
        if (typeof ascendWorldSightsee === 'function') {
          try { ascendWorldSightsee(); } catch(e) {}
        }
      } else if (_idleRoll < 0.55 && typeof ascendKidsDaily === 'function' && (p._lastKidDay || 0) < G.time.day - 1) {
        try { ascendKidsDaily(); } catch(e) {}
      } else if (typeof ascendWanderDaily === 'function' && (p._lastWanderDay || 0) < G.time.day - 1) {
        try { ascendWanderDaily(); } catch(e) {}
      }
    }
    // 化神后保持专注：不进入普通 needs 矩阵（避免乱逛/乱打野怪）
    var hsWaitDelay = 8000 + Math.random() * 5000;
    if (!autoModeActive) return;
    if (autoInterval) clearInterval(autoInterval);
    autoInterval = setTimeout(runAutoCycle, hsWaitDelay);
    return;
  }

  // ═══════════ ❄️ 第二纪元·冰阁弟子自动模式（门派生活为主） ═══════════
  // 🔧 2026-08-04：冰阁弟子挂机不再像散修一样乱跑野图打怪，
  //    而是围绕门派日常运转：演武修炼→藏经阁→灵田→演武切磋→弟子交友→禁地苦修
  //    外加门派任务推进（采集/除妖类任务去对应野外场景，修炼类在门内闭关）
  if (typeof isSectMember === 'function' && isSectMember()) {
    var sectP = G.player;
    // ═══════════ 🌄 每月下山历练（月度入世） ═══════════
    // 🔧 2026-08-04：每月第1-10天，冰阁弟子背起行囊下山，
    //    走原版散修自动模式（needs矩阵：探索/打怪/采集/交友/装备），
    //    理解世界后再回山修行。其余时间门派日常。
    var sectDayOfMonth = G.time.day % 30; // 1-30
    var sectMonth = Math.floor(G.time.day / 30);
    if (!G._sectDownhill) G._sectDownhill = { month: -1, day: 0 };
    var sectDownhillActive = false;
    if (sectDayOfMonth >= 1 && sectDayOfMonth <= 10) {
      // 本月首次进入历练期
      if (G._sectDownhill.month !== sectMonth) {
        G._sectDownhill.month = sectMonth;
        G._sectDownhill.day = sectDayOfMonth;
        addNarrative('🌄 每月例行下山历练。你背起行囊走出冰阁山门，踏入凡尘——这方世界，总要去看看。', 'milestone');
      }
      sectDownhillActive = true;
      // 清除门派日常标记：历练归来后重新计算当天日常
      if (G._sectDaily) { G._sectDaily.day = -1; }
    } else if (G._sectDownhill.month === sectMonth) {
      // 历练结束回山（本月第4天起第一次触发）
      G._sectDownhill.month = -1;
      addNarrative('🏔️ 你带着历练的见闻回到冰阁。山门依旧，弟子们的晨练声远远传来——还是这里让人心安。', 'milestone');
    }
    // 低血量/灵力：回安全区休息（青云镇）
    var sectHpPct = sectP.hp / Math.max(1, sectP.maxHp);
    var sectQiPct2 = sectP.qi / Math.max(1, sectP.maxQi);
    var sectScene = typeof getSceneData === 'function' ? getSceneData(G.currentScene) : null;
    var sectSceneSafe = sectScene && sectScene.safe;
    if (sectHpPct < 0.4 || sectQiPct2 < 0.2) {
      if (!sectSceneSafe) {
        // 不在安全区 → 回青云镇
        if (typeof getSceneData === 'function' && getSceneData('qingyun')) {
          if (typeof walkOneStepToward === 'function' && G.currentScene !== 'qingyun') {
            try { walkOneStepToward('qingyun'); } catch(e) {}
          } else if (typeof changeScene === 'function' && G.currentScene !== 'qingyun') {
            try { changeScene('qingyun'); } catch(e) {}
          }
          addNarrative('❄️ 你暂离门派驻地，回到青云镇调息休整。', 'event');
          var sectRestDelay = 4000 + Math.random() * 2000;
          if (!autoModeActive) return;
          if (autoInterval) clearInterval(autoInterval);
          autoInterval = setTimeout(runAutoCycle, sectRestDelay);
          return;
        }
      } else {
        // 安全区休息
        if (typeof _doLongRest === 'function') {
          try { _doLongRest(); } catch(e) {}
        }
        var sectRest2 = 5000 + Math.random() * 2000;
        if (!autoModeActive) return;
        if (autoInterval) clearInterval(autoInterval);
        autoInterval = setTimeout(runAutoCycle, sectRest2);
        return;
      }
    }

    // ── 突破检查（每12轮，复用上方思路） ──
    var sectQiFilled = typeof getCultivationProgress === 'function' ? getCultivationProgress('qi') : 0;
    var sectBodyFilled = typeof getCultivationProgress === 'function' ? getCultivationProgress('body') : 0;
    if ((sectQiFilled >= 100 || sectBodyFilled >= 100) && autoCycleCount % 12 === 0) {
      if (sectQiFilled >= 100 && sectP.qiRealmIndex < 22) {
        try { qiBreakthroughCheck(); } catch(e) {}
      }
      if (sectBodyFilled >= 100 && sectP.bodyRealmIndex < 16) {
        try { bodyBreakthroughCheck(); } catch(e) {}
      }
      var sectBrDelay = 8000 + Math.random() * 4000;
      if (!autoModeActive) return;
      if (autoInterval) clearInterval(autoInterval);
      autoInterval = setTimeout(runAutoCycle, sectBrDelay);
      return;
    }

    if (!sectDownhillActive) {
    // ── 每日门派日常 ──
    if (!G._sectDaily) G._sectDaily = {};
    var sd = G._sectDaily;
    if (sd.day !== G.time.day) {
      sd.day = G.time.day;
      sd.stageTrain = false;
      sd.library = false;
      sd.field = false;
      sd.sparring = false;
      sd.social = false;
      sd.forbidden = false;
    }
    var sectDailyDid = false;

    // 1️⃣ 每日任务刷新
    if (typeof ensureSectTasks === 'function') {
      try { ensureSectTasks(); } catch(e) {}
    }

    // 2️⃣ 演武修炼（每日一次，+修为）
    if (!sd.stageTrain && typeof sectStageTrain === 'function' && sectP._lastStageTrainDay !== G.time.day) {
      try { sectStageTrain(); sd.stageTrain = true; sectDailyDid = true; } catch(e) {}
    }
    // 3️⃣ 藏经阁借阅（每日一次；自动模式走不弹窗的日常研读）
    if (!sd.library && typeof sectLibraryBorrow === 'function' && sectP._lastLibraryDay !== G.time.day) {
      try {
        if (typeof sectDailyStudy === 'function') sectDailyStudy();
        else sectLibraryBorrow();
        sd.library = true; sectDailyDid = true;
      } catch(e) {}
    }
    // 4️⃣ 灵田种植（每日一次）
    if (!sd.field && typeof sectFieldPlant === 'function' && sectP._lastFieldDay !== G.time.day) {
      try { sectFieldPlant(); sd.field = true; sectDailyDid = true; } catch(e) {}
    }
    // 5️⃣ 演武切磋（每日一次，+修为+好感）
    if (!sd.sparring && typeof sectSparring === 'function') {
      try { sectSparring(); sd.sparring = true; sectDailyDid = true; } catch(e) {}
    }
    // 6️⃣ 弟子交友（每日一次，随缘交一位弟子）
    if (!sd.social && typeof interactDisciple === 'function' && typeof getDiscipleById === 'function') {
      try {
        var sPool = (typeof getDisciplesInArea === 'function') ? getDisciplesInArea('sect_dorm') : [];
        var sPool2 = (typeof SECT_DISCIPLE_POOL !== 'undefined') ? SECT_DISCIPLE_POOL : [];
        var sCand = (sPool && sPool.length ? sPool : sPool2);
        if (sCand.length > 0) {
          var sPick = sCand[Math.floor(Math.random() * sCand.length)];
          interactDisciple(sPick.id || sPick);
          sd.social = true;
          sectDailyDid = true;
        }
      } catch(e) {}
    }
    // 7️⃣ 禁地苦修（元婴后每日一次）
    if (!sd.forbidden && (sectP.qiRealmIndex || 0) >= 15 && typeof forbiddenCultivate === 'function') {
      try { forbiddenCultivate(); sd.forbidden = true; sectDailyDid = true; } catch(e) {}
    }

    // ── 门派任务推进（未完成任务时） ──
    var sectTasks = sectP.sect ? (sectP.sect.tasks || []) : [];
    var sectPending = sectTasks.filter(function(t) { return t && !t.done && !t.claimed; });
    if (sectPending.length > 0) {
      // 修炼类任务：门内闭关推进
      var sectCultTask = sectPending.find(function(t) { return t.type === '历练' || t.type === '传承'; });
      if (sectCultTask && typeof gainCultivation === 'function') {
        // 每轮加一点修为推进（配合上方演武/藏经阁收益，5000目标几天内完成）
        try {
          gainCultivation('qi', 300);
          if (typeof updateSectTaskProgress === 'function') updateSectTaskProgress(sectCultTask.id, 300);
          addNarrative('📖 你在冰阁静室闭关，修为缓缓增长……（门派任务：「' + sectCultTask.title + '」' + (sectCultTask.progress || 0) + '/' + sectCultTask.target + '）', 'narr-event');
          sectDailyDid = true;
        } catch(e) {}
      }
      // 采集/除妖类任务：导航到对应场景（落到普通循环执行战斗/采集）
      var sectFieldTask = sectPending.find(function(t) { return t.type === '采集' || t.type === '除妖'; });
      if (sectFieldTask) {
        // 🔧 任务→场景映射（采集/除妖目标）
        var sectTaskSceneMap = {
          '灵草': 'lingyao_garden',
          '冰晶': 'bingfeng_grotto',
          '野狼': 'luoxia_forest',
          '山贼': 'heifeng_ridge',
          '幽魂': 'youming_grotto',
          '寒玉髓': 'bingfeng_grotto',
        };
        var sectTaskTarget = sectTaskSceneMap[sectFieldTask.item];
        if (sectTaskTarget) {
          // 未在目标场景 → 设置导航
          if (G.currentScene !== sectTaskTarget) {
            if (typeof getSceneData === 'function' && getSceneData(sectTaskTarget)) {
              G._navTarget = sectTaskTarget;
              G._sectTaskScene = sectFieldTask.item;
              addNarrative('❄️ 你想起门派任务：「' + sectFieldTask.title + '」，动身前往' + (getSceneData(sectTaskTarget) ? getSceneData(sectTaskTarget).name : sectTaskTarget) + '。', 'event');
            }
          } else {
            // 已在目标场景：除妖任务直接战斗，采集任务采集
            G._sectTaskScene = sectFieldTask.item;
            if (sectFieldTask.type === '除妖' && typeof startAutoCombat === 'function') {
              try {
                startAutoCombat();
                sectDailyDid = true;
              } catch(e) {}
            } else if (sectFieldTask.type === '采集') {
              // 采集：尝试获取任务物品（若有采集函数）
              if (typeof gatherSceneResource === 'function') {
                try { gatherSceneResource(); sectDailyDid = true; } catch(e) {}
              }
            }
          }
        } else {
          G._sectTaskScene = null;
        }
      } else {
        G._sectTaskScene = null;
      }
    } else {
      G._sectTaskScene = null;
    }

    // ── 日常完成 + 无紧急任务 → 门内修炼/安静等待 ──
    if (sectDailyDid) {
      // 完成一轮日常，休息片刻
      var sectDoneDelay = 4000 + Math.random() * 2000;
      if (!autoModeActive) return;
      if (autoInterval) clearInterval(autoInterval);
      autoInterval = setTimeout(runAutoCycle, sectDoneDelay);
      return;
    }

    // 日常全做完：若有野外采集/除妖任务 → 让出控制给普通循环（打怪/采集/导航）
    var sectHasFieldTask = false;
    var sectTasks2 = sectP.sect ? (sectP.sect.tasks || []) : [];
    sectHasFieldTask = sectTasks2.some(function(t) { return t && !t.done && !t.claimed && (t.type === '采集' || t.type === '除妖'); });
    if (sectHasFieldTask && G._sectTaskScene) {
      // 不 return，落到普通 needs 矩阵（那里会识别 _sectTaskScene 导航）
      // 但先确保不在低血量状态（低血保护在上面已处理）
    } else {
      // 无野外任务：原地修炼（安全区）或安静等待
      var sectQip = typeof getCultivationProgress === 'function' ? getCultivationProgress('qi') : 0;
      if (sectQip < 100 && sectSceneSafe && typeof qiCultivate === 'function') {
        try {
          qiCultivate();
          sectDailyDid = true;
        } catch(e) {}
      } else if (sectQip < 100 && !sectSceneSafe) {
        // 不在安全区 → 尝试回门派驻地/青云镇
        if (typeof getSceneData === 'function' && getSceneData('qingyun')) {
          if (typeof walkOneStepToward === 'function' && G.currentScene !== 'qingyun') {
            try { walkOneStepToward('qingyun'); } catch(e) {}
          }
          addNarrative('❄️ 你回到青云镇，寻一处清净之地打坐修行。', 'event');
        }
      }
      if (sectDailyDid) {
        var sectCultDelay = 6000 + Math.random() * 3000;
        if (!autoModeActive) return;
        if (autoInterval) clearInterval(autoInterval);
        autoInterval = setTimeout(runAutoCycle, sectCultDelay);
        return;
      }

      // 一切就绪：安静等待（保持门派生活节奏）
      var sectIdleDelay = 8000 + Math.random() * 4000;
      if (!autoModeActive) return;
      if (autoInterval) clearInterval(autoInterval);
      autoInterval = setTimeout(runAutoCycle, sectIdleDelay);
      return;
    }
    }
  }

  // ── 思考2：盘点当前状态（建筑需求矩阵+角色发展）──
  var needs = { rest: 0, explore: 0, combat: 0, cultivate: 0, breakthrough: 0, social: 0, quest: 0, gear: 0, nourish_benming: 0, beast_care: 0, gather_care: 0 };
  var charFlags = G._charEval && G._charEval.flags ? G._charEval.flags : {};
  
  // 🔧 材料补给需求：灵兽需要喂养但没灵草 / 法宝需要温养但没材料
  //    缺料时给中高权重（但不是最高——突破/任务优先），有冷却防刷屏
  if (autoFeedBeast && typeof beastNeedsFeedMaterial === 'function' && beastNeedsFeedMaterial()) {
    needs.gather_care = 25;
  }
  if (autoNourishBenming && typeof benmingNeedsNourishMaterial === 'function' && benmingNeedsNourishMaterial()) {
    needs.gather_care = Math.max(needs.gather_care, 25);
  }
  
  // 角色发展需求（从评估系统获取）
  if (charFlags.isNewChar) {
    needs.explore += 40;       // 新手多探索
    needs.combat = 0;          // 新手先别打
    needs.rest = 0;
  }
  if (charFlags.needsWeapon || charFlags.needsArmor) {
    needs.explore += 20;       // 没装备→去城镇或探索
    needs.gear = 20;
  }
  if (charFlags.emptySlots > 0 && p.qiRealmIndex < 5) {
    needs.explore += 15;       // 空装备位→找功法
  }
  
  // ═══ 🏆 任务优先：有活跃任务时quest权重碾压 ═══
  var activeQuestCount = 0;
  if (typeof getActiveQuests === 'function') {
    try { activeQuestCount = getActiveQuests().length; } catch(e) {}
  }
  if (activeQuestCount > 0) {
    needs.quest = 120;          // 任务优先级最高
    needs.rest = Math.min(needs.rest, 20);  // 不优先休息
    needs.explore = Math.max(needs.explore, 50);  // 探索也保留
  } else {
    needs.quest = 10;           // 没任务时偶尔看看
  }
  
  // 体力/灵力状态决定基础需求
  if (qiPct < 0.15 || hpPct < 0.2) {
    needs.rest = 100;  // 几乎空了——必须休息
  } else if (qiPct < 0.35 || hpPct < 0.4) {
    needs.rest = 50;   // 有点累——看情况
    needs.combat = nearBreakthrough ? 0 : 20;  // 勉强能打
  } else {
    needs.combat = charFlags.isNewChar ? 10 : 40;
    needs.explore = charFlags.isNewChar ? 50 : 40;
  }
  
  // 场景判断
  if (sceneSafe) {
    needs.combat = 0;       // 安全区没怪打
    needs.cultivate = charFlags.isNewChar ? 10 : 30;   // 安全区可以修炼
    // 安全区满血就出门浪
    if (qiPct > 0.8 && hpPct > 0.8) {
      needs.explore = Math.max(needs.explore, 60);
      needs.rest = 0;
    }
  } else if (hasMonsters) {
    needs.combat = charFlags.isNewChar ? 10 : 50;
    needs.cultivate = 0;  // 野外不打坐
  } else if (!sceneSafe) {
    // 野外无怪 → 继续探索
    needs.explore += 20;
    needs.combat = 10;
  }
  
  // 探索欲（无聊就出门）
  if (_autoBoredom > 3) {
    needs.explore += 10 * Math.min(_autoBoredom - 3, 5);  // 封顶防溢出
  }
  
  // 突破需求
  if (nearBreakthrough && !needBreakthrough) {
    needs.cultivate = Math.max(needs.cultivate, 40);
  }
  
  // 附近有未探索场景
  if (typeof getConnections === 'function') {
    var conns = getConnections();
    var unvisitedNearby = conns.filter(function(c) {
      return (!G.visitedScenes || G.visitedScenes.indexOf(c.id) === -1) && c.id !== G.currentScene && c.type !== 'gate';
    });
    if (unvisitedNearby.length > 0) {
      needs.explore += 30;
      if (!charFlags.isNewChar) needs.combat += 10;
    }
  }
  
  // 整理背包（每10轮一次）
  if (autoCycleCount % 10 === 0 && typeof autoSellInventory === 'function') autoSellInventory();
  if (typeof autoLearnScrolls === 'function') autoLearnScrolls();
  
  // ── 思考3：根据需求矩阵选择执行 ──
  var weightedPool = [];
  // 🔧 连续探索惩罚：已经逛了3轮以上，本轮强制降低探索权重（防逛图失控）
  if (_exploreStreak >= 3) {
    needs.explore = Math.min(needs.explore, 8);
    needs.combat = Math.max(needs.combat, 45);   // 转去战斗
    needs.cultivate = Math.max(needs.cultivate, 25);  // 或修炼
  }
  for (var actionName in needs) {
    var weight = needs[actionName];
    for (var w = 0; w < weight; w++) {
      weightedPool.push(actionName);
    }
  }
  
  // 再补一些随机权重，让行为有不确定性（更像真人）
  if (Math.random() < 0.15) weightedPool.push('explore');
  if (Math.random() < 0.1) weightedPool.push('social');

  // 🐾 灵兽栏未满：提升 explore/combat 权重（引导去猎场捕兽）
  // 🔧 2026-08-05：满栏也能换血（自动放生最弱收更强），所以不再限制"未满"才加权重
  if (p.beasts) {
    for (var bc = 0; bc < 20; bc++) weightedPool.push('explore');
    for (var bc2 = 0; bc2 < 15; bc2++) weightedPool.push('combat');
  }

  // ═══ 🔮 自动温养法宝：金丹期+有温养材料+法宝没满级（开关 autoNourishBenming，默认关）═══
  if (autoNourishBenming && p.benming && p.benming.unlocked && p.benming.level < 99) {
    var hasNourishMat = false;
    if (typeof BENMING_UPGRADE !== 'undefined' && BENMING_UPGRADE.nourish && p.inventory) {
      hasNourishMat = BENMING_UPGRADE.nourish.some(function(n) {
        return p.inventory.some(function(it) { return it.id === n.id && it.qty > 0; });
      });
    }
    // 有材料且不在战斗中优先温养；材料多时权重更高
    if (hasNourishMat) {
      // 🔧 权重 8→30：之前8在百级池子里≈5%概率，40轮都难触发一次，形同虚设
      for (var nm = 0; nm < 30; nm++) weightedPool.push('nourish_benming');
    }
    // 🔧 没材料 → 不给 nourish_benming 低保（避免反复“没材料”提示），
    //    由 gather_care（needs.gather_care）统一处理：黑市买/导航采集
  }

  // ═══ 🐾 自动照顾灵兽：有灵兽且（亲密度低/受伤/有灵草可喂）时投喂（开关 autoFeedBeast，默认关）═══
  var beastNeedsCare = false;
  var beastFeedTarget = null;
  if (autoFeedBeast && p.beasts && p.beasts.length > 0) {
    // 找亲密度最低或受伤的灵兽
    for (var bi = 0; bi < p.beasts.length; bi++) {
      var bst = p.beasts[bi];
      if (!bst) continue;
      if ((bst.mood || 80) < 70 || (bst.maxHp && bst.hp < bst.maxHp * 0.7)) {
        beastNeedsCare = true;
        if (!beastFeedTarget) beastFeedTarget = bi;
      }
    }
  }
  if (beastNeedsCare && p.inventory) {
    // 有可喂的灵草（清灵草/百年灵芝/灵泉水等 type=灵草 或 herbEffect）
    var hasFeedItem = p.inventory.some(function(it) { return it && it.qty > 0 && (it.type === '灵草' || it.herbEffect); });
    if (hasFeedItem) {
      // 🔧 权重 8→30：灵兽需要照顾时要有实际触发率
      for (var bc = 0; bc < 30; bc++) weightedPool.push('beast_care');
    }
    // 🔧 没灵草 → 不给 beast_care 低保（避免反复“没有灵草可喂”提示），
    //    由 gather_care 统一处理：黑市买/导航采集
  }
  // 🔧 2026-08-05：满栏也能换血，不再限制"未满"才捕捉
  //    探索顺带尝试捕捉（在explore执行里处理，不用单独权重）
  var canCatchMore = true;

  // ═══ 🏹 猎杀BOSS模式：突破在即/缺破境丹/战力碾压时主动猎杀 ═══
  var huntTarget = (typeof findHuntableBoss === 'function') ? findHuntableBoss() : null;
  if (huntTarget) {
    var wantBreak = typeof getCultivationProgress === 'function' ? getCultivationProgress('qi') >= 90 : false;
    var haveBreakPill = false;
    if (p.inventory && p.inventory.some) {
      haveBreakPill = p.inventory.some(function(it) { return it && it.effects && it.effects.breakthrough; });
    }
    // 突破在即且没破境丹 → 强烈想猎杀；否则偶尔想打（真人也有胜负心）
    if (wantBreak && !haveBreakPill) {
      for (var hi = 0; hi < 45; hi++) weightedPool.push('hunt_boss');
    } else {
      for (var hi2 = 0; hi2 < 12; hi2++) weightedPool.push('hunt_boss');
    }
  }
  
  var chosenAction = weightedPool[Math.floor(Math.random() * weightedPool.length)] || 'explore';
  
  // ── 执行选定的行为 ──
  switch (chosenAction) {
    case 'rest':
      if (sceneSafe) {
        var hadPill = false;
        if (typeof consumeBestHealItem === 'function') {
          try { hadPill = consumeBestHealItem(); } catch(e) {}
        }
        if (!hadPill && typeof _doLongRest === 'function') {
          _doLongRest();
        }
      } else {
        if (typeof consumeBestHealItem === 'function') {
          try { consumeBestHealItem(); } catch(e) {}
        }
        if (typeof findNearestTown === 'function') {
          var town = findNearestTown();
          if (town && town.id !== G.currentScene) {
            G._navTarget = town.id;
            addNarrative('💨 先回「' + town.name + '」休整一下。', 'event');
          }
        }
      }
      break;
      
    case 'gear':
    case 'combat':
      if (hasMonsters && typeof startAutoCombat === 'function') {
        try { startAutoCombat(); } catch(e) {}
      } else if (!sceneSafe) {
        if (typeof getConnections === 'function') {
          var conns2 = getConnections();
          var dangerConns = conns2.filter(function(c) {
            var sd = typeof getSceneData === 'function' ? getSceneData(c.id) : null;
            return sd && !sd.safe && c.type !== 'gate' && c.id !== G.currentScene;
          });
          if (dangerConns.length > 0) {
            var t = dangerConns[Math.floor(Math.random() * dangerConns.length)];
            G._navTarget = t.id;
            addNarrative('🔍 听说「' + t.name + '」那边有猎物出没。', 'event');
          }
        }
      } else {
        // 安全区没怪→出门
        if (typeof getConnections === 'function') {
          var conns3 = getConnections();
          var any = conns3.filter(function(c){ return c.id !== G.currentScene && c.type !== 'gate'; });
          if (any.length > 0) {
            var t2 = any[Math.floor(Math.random() * any.length)];
            G._navTarget = t2.id;
            addNarrative('🚶 你向外走去，打算找点猎物练练手。', 'event');
          }
        }
      }
      break;
      
    case 'explore':
      // 🐾 没有灵兽：优先去猎场抓第一只（抓到后不再死磕，正常探索）
      var wantBeast = (!p.beasts || p.beasts.length < 1) && Date.now() >= _huntNavCooldownUntil;
      var huntScene = null;
      if (wantBeast && typeof findBeastHuntingScene === 'function') {
        huntScene = findBeastHuntingScene();
      }
      if (huntScene) {
        if (huntScene.id !== G.currentScene) {
          G._navTarget = huntScene.id;
          addNarrative('🐾 你想起「' + huntScene.name + '」一带常有灵兽出没，正好去碰碰机缘！', 'event');
        } else {
          // 已在猎场：原地战斗捕兽
          if (typeof startAutoCombat === 'function' && Math.random() < 0.85) {
            try { startAutoCombat(); } catch(e) {}
            addNarrative('🐾 你在这片猎场仔细搜寻，试图收服灵兽幼崽。', 'event');
          }
        }
        break;
      }
      // 栏满或没有合适猎场 → 正常探索
      if (typeof getConnections === 'function') {
        var conns4 = getConnections();
        var unvisited = conns4.filter(function(c) {
          return (!G.visitedScenes || G.visitedScenes.indexOf(c.id) === -1) && c.id !== G.currentScene && c.type !== 'gate';
        });
        if (unvisited.length > 0) {
          var target = unvisited[Math.floor(Math.random() * unvisited.length)];
          G._navTarget = target.id;
          addNarrative('👀 你望向「' + target.name + '」的方向……出发去探险！', 'event');
        } else {
          var anyConn = conns4.filter(function(c){ return c.id !== G.currentScene && c.type !== 'gate'; });
          if (anyConn.length > 0) {
            var r = anyConn[Math.floor(Math.random() * anyConn.length)];
            G._navTarget = r.id;
            addNarrative('🚶 你信步向着「' + r.name + '」走去。', 'event');
          }
        }
      }
      break;
      
    case 'cultivate':
      if (sceneSafe && !nearBreakthrough) {
        if (typeof doCultivate === 'function') doCultivate();
      } else if (sceneSafe) {
        if (typeof findBestCultivationScene === 'function') {
          try {
            var bestScene = findBestCultivationScene();
            if (bestScene && bestScene.id !== G.currentScene && typeof walkOneStepToward === 'function') {
              G._navTarget = bestScene.id;
              addNarrative('🧘 你想起一个灵气充沛的好去处……', 'event');
            } else if (typeof doCultivate === 'function') {
              doCultivate();
            }
          } catch(e) { if (typeof doCultivate === 'function') doCultivate(); }
        } else if (typeof doCultivate === 'function') {
          doCultivate();
        }
      } else {
        if (typeof findNearestTown === 'function') {
          var town = findNearestTown();
          if (town && town.id !== G.currentScene) {
            G._navTarget = town.id;
            addNarrative('🧘 得找个安全的地方调息修炼。', 'event');
          }
        }
      }
      break;
      
    case 'breakthrough':
      break;
      
    case 'social':
      var sceneNPCs = typeof npcManager !== 'undefined' && npcManager
        ? npcManager.getNPCsForScene(G.currentScene).filter(function(n){ return n.isAlive !== false; })
        : [];
      if (sceneNPCs.length > 0 && typeof doSocial === 'function') {
        doSocial(sceneNPCs);
      }
      break;
      
    case 'quest':
      if (typeof doQuestWork === 'function') doQuestWork();
      break;
      
    default:
      if (typeof getConnections === 'function') {
        var conns5 = getConnections();
        var any2 = conns5.filter(function(c){ return c.id !== G.currentScene && c.type !== 'gate'; });
        if (any2.length > 0) {
          G._navTarget = any2[Math.floor(Math.random() * any2.length)].id;
        }
      }
  }
  
  _autoBoredom++;
  // 设定下一轮（动态：有事做快一点，无聊慢一点）
  var hasTask = G._navTarget || qiPct < 0.9 || hasMonsters || needBreakthrough || (sceneSafe && nearBreakthrough);
  var baseDelay = hasTask ? 3500 + Math.random() * 3000 : 6000 + Math.random() * 4000;
  if (!autoModeActive) return;
  if (autoInterval) clearInterval(autoInterval);
  autoInterval = setTimeout(runAutoCycle, baseDelay);
}

// ==========================
// 🧭 探索 (去没去过的地方)
// ==========================
function doExplore() {
  var conns = typeof getConnections === 'function' ? getConnections() : [];
  var unvisited = conns.filter(function(c){
    return (!G.visitedScenes || G.visitedScenes.indexOf(c.id) === -1)
      && c.id !== G.currentScene
      && c.type !== 'gate';
  });
  // 优先去稍远但没去过的地方
  if (unvisited.length > 0) {
    var target = unvisited[Math.floor(Math.random() * unvisited.length)];
    G._navTarget = target.id;
    addNarrative('👀 你好奇地望向「' + target.name + '」的方向……那边似乎有什么。', 'event');
    // 探索时可能遇敌（在当前场景与目标之间）
    if (!autoPausedForEvent && typeof startAutoCombat === 'function' && Math.random() < 0.3) {
      try { startAutoCombat(); } catch(e) {}
    }
    return;
  }
  // 没有没去过的→去熟悉的地方逛逛
  var safeConns = conns.filter(function(c){ return c.safe && c.id !== G.currentScene && c.type !== 'gate'; });
  if (safeConns.length > 0) {
    var target2 = safeConns[Math.floor(Math.random() * safeConns.length)];
    G._navTarget = target2.id;
    addNarrative('🚶 你信步而行，向着「' + target2.name + '」走去。', 'event');
    if (!autoPausedForEvent && typeof startAutoCombat === 'function' && Math.random() < 0.2) {
      try { startAutoCombat(); } catch(e) {}
    }
    return;
  }
  doWander();
}

// ==========================
// 💬 社交闲聊
// ==========================
function doSocial(npcs) {
  if (!npcs || npcs.length === 0) {
    npcs = typeof npcManager !== 'undefined' && npcManager
      ? npcManager.getNPCsForScene(G.currentScene).filter(function(n){ return n.isAlive !== false; })
      : [];
  }
  if (npcs.length === 0) {
    addNarrative('此地并无旁人，你独自走着。', 'event');
    return;
  }
  var target = npcs[Math.floor(Math.random() * npcs.length)];
  
  // 15%概率发生有趣的小事件
  if (Math.random() < 0.15 && typeof getSceneData === 'function') {
    var sceneData = getSceneData(G.currentScene);
    if (sceneData && sceneData.safe) {
      var socialFluff = [
        target.name + '正坐在路边喝茶，看见你便招呼你坐下。你们聊了几句闲话，不知不觉一个时辰就过去了。',
        '你在一棵大树下找到了' + target.name + '。他正对着树皮上刻着的字发呆，见你来了，指了指那些字："你看得懂吗？"',
        target.name + '正在整理刚采到的几株药草，见你走近，大方地分了你一株。',
        target.name + '从怀里摸出一个油纸包，里面是几块桂花糕："来，尝尝。"',
        target.name + '抬头看了看天色，忽然说："要下雨了。"你跟着抬头，果然天边有乌云压过来。',
        '你还没走近，' + target.name + '已经笑着朝你招手了："正愁没人说话，你就来了！"',
        target.name + '递给你一个竹筒："这是我早上刚打的泉水，甘甜得很。"',
        target.name + '正在打盹，听见脚步声懒洋洋地睁开眼，打了个哈欠又闭上了。',
      ];
      addNarrative(socialFluff[Math.floor(Math.random() * socialFluff.length)], 'narr-event');
      target.affinity = Math.min(100, (target.affinity || 0) + (Math.random() < 0.5 ? 2 : 1));
      // 送点小礼物
      if (Math.random() < 0.2 && typeof addItemToInventory === 'function') {
        var gifts = ['hgc_grass','lingquan_shui'];
        try { addItemToInventory(ITEM_DB.find(function(i){ return i.id === gifts[Math.floor(Math.random()*gifts.length)]; }), 1); addNarrative('→ 收到了' + target.name + '的一点心意。', 'loot'); } catch(e) {}
      }
      //
      return;
    }
  }
  
  addNarrative('你走上前去，向' + target.name + '搭话。', 'event');
  if (typeof npcManager !== 'undefined' && npcManager) {
    npcManager.startDialog(target);
    // 50%概率打听消息（NPC多了多听八卦）
    if (Math.random() < 0.5 && typeof npcManager.gossipQuest === 'function') {
      npcManager.gossipQuest(target);
    }
    target.affinity = Math.min(100, (target.affinity || 0) + 1);
  }
  // _autoBoredom = 0;
}

// ==========================
// 📍 POI 探索
// ==========================
function doPOIExplore() {
  var pois = typeof getScenePOI === 'function' ? getScenePOI(G.currentScene) : [];
  if (!pois || pois.length === 0) {
    addNarrative('你环顾四周，此地没什么特别的。', 'event');
    return;
  }
  var available = pois.filter(function(poi){
    if (!poi.interaction.cooldownMs) return true;
    var cdKey = '_poi_cd_' + poi.id;
    var last = G.player[cdKey] || 0;
    return Date.now() - last >= poi.interaction.cooldownMs;
  });
  if (available.length > 0) {
    var target = available[Math.floor(Math.random() * available.length)];
    interactWithPOI(G.currentScene, target.id);
    //
  } else {
    // 全冷却→看向风景
    var debugPOI = pois[Math.floor(Math.random() * pois.length)];
    addNarrative('你眺望着' + (debugPOI.name || '远方') + '，心中感慨万千。', 'event');
  }
}

// ==========================
// 📋 做任务
// ==========================
function doQuestWork() {
  var p = typeof G !== 'undefined' ? G.player : null;
  if (!p) return;
  var db = typeof getQuestDB === 'function' ? getQuestDB() : [];
  var active = typeof getActiveQuests === 'function' ? getActiveQuests() : [];
  
  // 1️⃣ 先检查已有任务的进度（收集物品/击杀/探索是否完成）
  if (typeof checkQuestProgress === 'function') checkQuestProgress();
  
  // 2️⃣ 有活跃任务 → 找最近一步要做的（去重：同一id只处理一次）
  if (active.length > 0) {
    var seenQuest = {};
    for (var qi = 0; qi < active.length; qi++) {
      var aq = active[qi];
      if (seenQuest[aq.id]) continue;
      seenQuest[aq.id] = true;
      var quest = db.find(function(q) { return q.id === aq.id; });
      if (!quest) continue;
      var req = quest.requirements || {};
      var progress = aq.progress || {};
      
      // ═══ A. 需要击杀怪物 ═══
      if (req.kills) {
        var killedAny = false;
        for (var ki = 0; ki < req.kills.length; ki++) {
          var kr = req.kills[ki];
          var killed = p.killLog ? (p.killLog[kr.monster] || 0) : 0;
          if (killed < kr.qty) {
            // 在当前场景是否有这种怪物？
            var scData = typeof getSceneData === 'function' ? getSceneData(G.currentScene) : null;
            var hasTargetMonster = scData && scData.monsters && scData.monsters.some(function(m) { 
              return m.name === kr.monster || m.id === kr.monster;
            });
            
            if (hasTargetMonster && typeof startAutoCombat === 'function') {
              try { startAutoCombat(); } catch(e) {}
              killedAny = true;
              break;
            } else {
              // 目标怪物在别处→看看能不能导航到那里
              var targetScene = quest.targetScene || (req.killScene && req.killScene[kr.monster]) || null;
              // 先在当前场景的connections找
              if (typeof getItemSources === 'function') {
                var sources = getItemSources(kr.monster);
              }
              // 简单导航：有 quest.targetScene 就去那里
              if (quest.targetScene && quest.targetScene !== G.currentScene && typeof walkOneStepToward === 'function') {
                G._navTarget = quest.targetScene;
                var scName = typeof getSceneData === 'function' && getSceneData(quest.targetScene) ? getSceneData(quest.targetScene).name : '目标地点';
                addNarrative('🏹 任务指引……「' + quest.name + '」需要去' + scName + '一趟。', 'quest');
                return;
              }
              // 没有明确场景→找找哪张图有这种怪物
              if (typeof bfsPathTo === 'function' && typeof extractAllScenes === 'function') {
                var allSc = extractAllScenes();
                var bestSc = null, bestDist = 999;
                for (var si = 0; si < allSc.length; si++) {
                  var sc = allSc[si];
                  if (sc.monsters && sc.monsters.some(function(m) { return m.name === kr.monster || m.id === kr.monster; })) {
                    var dist = (bfsPathTo(sc.id) || []).length;
                    if (dist < bestDist && dist > 0) {
                      bestDist = dist;
                      bestSc = sc;
                    }
                  }
                }
                if (bestSc && bestDist < 20) {
                  G._navTarget = bestSc.id;
                  addNarrative('🏹 听说「' + bestSc.name + '」有' + kr.monster + '出没。', 'quest');
                  return;
                }
              }
            }
          }
        }
        if (killedAny) return;
      }
      
      // ═══ B. 需要采集/收集物品 ═══
      if (req.items) {
        for (var ri = 0; ri < req.items.length; ri++) {
          var itemReq = req.items[ri];
          var owned = p.inventory.reduce(function(sum, it) { return it.id === itemReq.id ? sum + (it.qty || 1) : sum; }, 0);
          if (owned < itemReq.qty) {
            // 任务物品专用采集（无视冷却、必出，一次采够）
            if (typeof gatherQuestItem === 'function') {
              try {
                gatherQuestItem(itemReq.id, itemReq.qty);
                return;  // 不管采没采到，这一轮不继续走冷却受限的旧采集
              } catch(e) {}
            }
            // 找item来源
            if (typeof getItemSources === 'function') {
              var srcs = getItemSources(itemReq.id);
              if (srcs && srcs.loot && srcs.loot.length > 0 && typeof bfsPathTo === 'function') {
                var bestL = null, bestDist2 = 999;
                for (var li = 0; li < srcs.loot.length; li++) {
                  var l = srcs.loot[li];
                  var dist = (bfsPathTo(l.sceneId) || []).length;
                  if (dist < bestDist2 && dist > 0) { bestDist2 = dist; bestL = l; }
                }
                if (bestL && bestDist2 < 20) {
                  G._navTarget = bestL.sceneId;
                  addNarrative('🌿 任务所需……去「' + bestL.sceneName + '」采集。', 'quest');
                  return;
                }
              }
            }
          }
        }
      }
      
      // ═══ C. 需要探索特定场景 ═══
      if (req.explore && G.currentScene !== req.explore && !progress.explored) {
        if (typeof bfsPathTo === 'function') {
          var path = bfsPathTo(req.explore);
          if (path && path.length < 20) {
            G._navTarget = req.explore;
            var scName2 = typeof getSceneData === 'function' && getSceneData(req.explore) ? getSceneData(req.explore).name : '目标';
            addNarrative('🗺️ 任务目标……前往「' + scName2 + '」探索。', 'quest');
            return;
          }
        }
      }
      
      // ═══ D. 需要完成阶段 ═══
      if (req.stages) {
        for (var sti = 0; sti < req.stages.length; sti++) {
          var stage = req.stages[sti];
          if (!stage.optional && (!progress.stages || !progress.stages[sti])) {
            // 当前阶段还需要做点什么
            if (stage.autoComplete) continue;
            if (stage.kills && typeof startAutoCombat === 'function') {
              try { startAutoCombat(); } catch(e) {}
              return;
            }
            if (stage.explore && stage.explore !== G.currentScene && typeof bfsPathTo === 'function') {
              var p2 = bfsPathTo(stage.explore);
              if (p2 && p2.length < 20) {
                G._navTarget = stage.explore;
                return;
              }
            }
          }
        }
      }
    }
    // 所有活跃任务都没有可做的了（比如等着交付）
    addNarrative('📋 手头的任务都处理得差不多了……', 'event');
    return;
  }
  
  // 3️⃣ 没有活跃任务→在当前场景找可接的
  var avail = typeof getAvailableQuests === 'function' ? getAvailableQuests() : [];
  if (avail.length > 0 && typeof acceptQuest === 'function') {
    var q = avail[0];
    // 优先接当前地图能完成的
    var doable = true;
    var qReq = q.requirements || {};
    if (qReq.explore && qReq.explore !== G.currentScene) {
      // 需要去别的场景探索，但能接受
    }
    addNarrative('📋 你接下「' + q.name + '」。', 'event');
    try { acceptQuest(q.id); } catch(e) {}
    return;
  }
  
  // 4️⃣ 真没任务了→打听消息
  if (typeof storyBeat === 'function') {
    storyBeat();
  } else {
    addNarrative('你四处走走，打听了一下周围的消息。', 'event');
  }
}

// ==========================
// 🚶 随便走走（无聊时）
// ==========================
function doWander() {
  var conns = typeof getConnections === 'function' ? getConnections() : [];
  var choices = conns.filter(function(c){ return c.id !== G.currentScene && c.type !== 'gate'; });
  if (choices.length > 0) {
    var target = choices[Math.floor(Math.random() * choices.length)];
    // 直接走一步（不需要设导航，就散步）
    if (typeof moveToScene === 'function') moveToScene(target.id);
    addNarrative('🚶‍♂️ 你漫无目的地走着，不知不觉来到了「' + target.name + '」。', 'event');
    if (!autoPausedForEvent && typeof startAutoCombat === 'function' && Math.random() < 0.25) {
      try { startAutoCombat(); } catch(e) {}
    }
  } else {
    // 没路走了
    addNarrative('你站在这里，微风拂面，一时不知该往何处去。', 'event');
  }
  // _autoBoredom = Math.max(0, _autoBoredom - 4);
}

// ==========================
// 🧘 修炼（轻松不碾压）
// ==========================
// ==========================
// 😴 回城大睡十二时辰
// ==========================
function _doLongRest() {
  var p = G.player;
  if (!p) return;
  // 休息沉浸（自动模式直接快捷恢复）
  if (typeof startRest === 'function' && !G._autoMode) {
    startRest();
  } else {
    p.qi = p.maxQi;
    p.hp = p.maxHp;
    advanceTime(24);
    addNarrative('😴 你饱睡了一整天，灵力与气血尽复。', 'event');
  }
}

function doCultivate() {
  var p = G.player;
  if (!p) return;
  var scene = typeof getSceneData === 'function' ? getSceneData(G.currentScene) : null;
  if (!scene) return;

  // 安全区修炼：每日打坐和炼体各一次（尽量一次都做完，避免轮流逻辑被时间推进打断）
  if (scene.safe) {
    var needMeditate = !(G._dailyDone && G._dailyDone.day === G.time.day && G._dailyDone.qi);
    var needBody = !(G._dailyDone && G._dailyDone.day === G.time.day && G._dailyDone.body);
    if (needMeditate && needBody) {
      // 打坐+炼体都该做：先打坐（推进1天），再炼体（打坐后标记已同步，炼体判断成立）
      if (typeof qiCultivate === 'function') qiCultivate();
      if (typeof bodyCultivate === 'function') bodyCultivate();
    } else if (needMeditate) {
      if (typeof qiCultivate === 'function') qiCultivate();
    } else if (needBody) {
      if (typeof bodyCultivate === 'function') bodyCultivate();
    } else {
      // 今日都完成了，小歇一下
      if (typeof rest === 'function') rest();
    }
    addNarrative('你盘膝调息片刻，精气神渐复。', 'event');
  } else {
    if (typeof rest === 'function') rest();
  }
  // _autoBoredom++;
}

// ==========================
// 场景探索（抵达新地点时）
// ==========================
function exploreCurrentScene() {
  var scene = typeof getSceneData === 'function' ? getSceneData(G.currentScene) : null;
  if (!scene) return;
  
  // 叙事
  var flavs = [
    '你好奇地打量着周围的一切。',
    '你东张西望，对这里充满了新鲜感。',
    '你小心翼翼地向前走去，目光扫过每一个角落。',
    '这里和你想象中不太一样。你饶有兴致地观察着。',
  ];
  addNarrative(flavs[Math.floor(Math.random() * flavs.length)], 'event');
  
  // 看一下POI
  var pois = typeof getScenePOI === 'function' ? getScenePOI(G.currentScene) : [];
  if (pois.length > 0) {
    var p = pois[Math.floor(Math.random() * pois.length)];
    addNarrative('你注意到「' + p.name + '」——' + (p.desc || '').slice(0, 50), 'event');
  }
  
  // 有没有任务
  if (typeof checkQuestProgress === 'function') checkQuestProgress();
  var availQuests = typeof getAvailableQuests === 'function' ? getAvailableQuests() : [];
  if (availQuests.length > 0 && Math.random() < 0.4) {
    addNarrative('你隐约感觉此地有些机缘在等着你。', 'event');
  }
}

// ==========================
// ==========================
function storyBeat() {
  if (!autoModeActive) return;
  const p = G.player;
  const scene = getSceneData(G.currentScene);
  if (!scene) return;

  // ── 初次到访 → 自动环顾 ──
  if (!G.visitedScenes || !G.visitedScenes.includes(G.currentScene)) {
    if (typeof G.visitedScenes === 'undefined') G.visitedScenes = [];
    G.visitedScenes.push(G.currentScene);
    if (typeof examineScene === 'function') {
      try { examineScene(); addNarrative('你环顾四周，将此地的一切尽收眼底。', 'event'); } catch(e) {}
    }
  }

  // ── 环境变化 ──
  tickEnvironment();

  // ── ⚡ 寻仙缘：里程碑检查（境界/缘分跨节点触发专属段落）──
  try {
    var mile = checkFateMilestone();
    if (mile) triggerFateMilestoneNarrative();
  } catch(e) {}

  // ── 决定本轮的"主题" ──
  const storyAction = decideStoryAction();
  // 实际的游戏逻辑仍然执行
  const actionResult = executeStoryAction(storyAction);

  // ── ⚡ 寻仙缘：注入缘分叙事片段 ──
  try {
    var fateLine = maybeFateStoryInjection();
    if (fateLine) actionResult.fateLine = fateLine;
  } catch(e) {}

  // ── 用DeepSeek生成一段散文 ──
  generateStoryParagraph(storyAction, actionResult);
}

// ==========================
// 环境计时
// ==========================
function tickEnvironment() {
  const p = G.player;
  // 每轮推进 0.2-0.6 小时（慢慢走，感受世界）
  const hours = 0.2 + Math.random() * 0.4;
  if (typeof advanceTime === 'function') advanceTime(hours);

  // 时钟换算
  const hour = G.time.hour % 24;
  G.time.period = PERIOD_NAMES[hour] || (hour < 6 ? '凌晨' : hour < 12 ? '上午' : hour < 18 ? '下午' : '晚上');

  // 每20轮变一次天气
  if (autoCycleCount % 20 === 0) {
    const nextIdx = (WEATHERS.indexOf(autoWeather) + 1 + Math.floor(Math.random() * 2)) % WEATHERS.length;
    autoWeather = WEATHERS[nextIdx];
  }
  // 每100轮换季
  if (autoCycleCount % 100 === 0) {
    autoSeason = SEASONS[(SEASONS.indexOf(autoSeason) + 1) % 4];
  }

  // 根据状态调整基调
  if (p.qi < p.maxQi * 0.2) autoMood = '疲惫';
  else if (p.hp < p.maxHp * 0.3) autoMood = '危急';
  else if (p.qi < p.maxQi * 0.5) autoMood = '沉静';
  else if (p.mood > 70) autoMood = '畅快';
  else if (p.qi >= p.maxQi * 0.8 && getSceneData(G.currentScene).safe) autoMood = '安宁';
  else autoMood = '平静';
}

// ==========================
// 决策（简化版，不再返回单一命令，返回"叙事主题"）
// ==========================
function decideStoryAction() {
  const p = G.player;
  const scene = getSceneData(G.currentScene);

  // 紧急状态
  if (p.qi < 10 || p.hp < p.maxHp * 0.3) {
    const hasPill = p.inventory.some(it => it.use && (it.use.qi || it.use.hp));
    if (hasPill) return 'consume';
    if (scene.safe) return 'rest';
    if (p.stones >= 10) return 'teleport';
    return 'rest';
  }

  // 一般状态，按权重选叙事主题
  const weights = [
    { action:'cultivate', weight: scene.safe ? 30 : 10 },
    { action:'explore', weight: scene.safe ? 8 : 25 },
    { action:'rest', weight: scene.safe && p.qi < p.maxQi * 0.5 ? 12 : 3 },
    { action:'wander', weight: 10 },    // 纯叙事移动
    { action:'contemplate', weight: 8 }, // 纯叙事感悟
    { action:'world_event', weight: 8 }, // 世界事件
  ];

  // 🔧 材料补给：灵兽没草喂 / 法宝没料温养 → 加补给权重（黑市买/导航采集）
  if (autoFeedBeast && typeof beastNeedsFeedMaterial === 'function' && beastNeedsFeedMaterial()) {
    weights.push({ action:'gather_care', weight: 30 });
  }
  if (autoNourishBenming && typeof benmingNeedsNourishMaterial === 'function' && benmingNeedsNourishMaterial()) {
    weights.push({ action:'gather_care', weight: 30 });
  }

  // 有熟NPC时增加社交权重
  const npcs = (typeof npcManager !== 'undefined')
    ? npcManager.getNPCsForScene(G.currentScene).filter(n => n.isAlive !== false) : [];
  const hasFriendly = npcs.some(n => n.affinity > 40 || n.daoPartnerId === 'player');
  if (hasFriendly) weights.push({ action:'social', weight: 12 });
  if (npcs.some(n => n.daoPartnerId === 'player')) weights.push({ action:'dual_cultivate', weight: 6 });
  
  // ── 境界够了，去新地方探索 ──
  var bestNewArea = typeof findBestNewAreaToExplore === 'function' ? findBestNewAreaToExplore() : null;
  if (bestNewArea) {
    // 当前场景级别太低且比自己修为低很多 → 优先走动
    var sceneQi = scene ? (scene.qiLevel || 3) : 3;
    var playerQi = p.qiRealmIndex || 0;
    if (playerQi >= sceneQi + 3) {
      weights.push({ action:'explore_new_area', weight: 50 });  // 该走了
    } else {
      weights.push({ action:'explore_new_area', weight: 20 });  // 有新的可探索
    }
  }

  // 战斗（野外）
  if (!scene.safe && p.qi > p.maxQi * 0.4) {
    weights.push({ action:'combat', weight: 15 });
  }

  // 突破（修炼已满时高优先——加冷却避免循环提示）
  const progress = typeof getCultivationProgress === 'function' ? getCultivationProgress('qi') : 0;
  const breakCooldown = !p._lastBreakthroughMsg || (Date.now() - p._lastBreakthroughMsg > 15000);
  if (progress >= 100 && p.qiRealmIndex < 22 && breakCooldown) {
    weights.push({ action:'breakthrough', weight: 50 });
  }

  // 尝试突破炼体
  const bodyProgress = typeof getCultivationProgress === 'function' ? getCultivationProgress('body') : 0;
  if (bodyProgress >= 100 && p.bodyRealmIndex < 16) {
    weights.push({ action:'breakthrough_body', weight: 40 });
  }

  // 缺丹药 → 钱够去黑市，钱不够去刷怪
  const maxPillCost = 500 + p.qiRealmIndex * 2000;
  var needPillCount = 0;
  p.inventory.forEach(function(i){ if (i.id==='poqi_dan'||i.id==='juli_dan'||i.id==='podi_dan') needPillCount += i.qty||1; });
  const needPills = needPillCount < 5;
  if (progress >= 80 && needPills) {
    if (p.stones > maxPillCost) {
      weights.push({ action:'black_market', weight: 35 });
    } else {
      weights.push({ action:'farm_money', weight: 45 });
    }
  }

  // 有可接任务时追踪
  if (typeof QUEST_DB !== 'undefined' && QUEST_DB.length > 0) {
    const activeQuests = typeof getActiveQuests === 'function' ? getActiveQuests() : [];
    const completed = p.completedQuests || [];
    const canAccept = QUEST_DB.filter(q => q.autoTrigger === 'realmBreak' && q.triggerRealm !== undefined &&
      p.qiRealmIndex >= (q.triggerRealm - 1) &&
      p.qiRealmIndex - (q.triggerRealm - 1) <= 2 &&  // 🔧 防补发过期引导任务
      p.qiRealmIndex - (q.triggerRealm - 1) >= -2 &&  // 🔧 境界不够也不接（如金丹不接大乘任务）
      !activeQuests.find(aq => aq.id === q.id) &&
      !completed.includes(q.id) &&
      !(q.prerequisite && !completed.includes(q.prerequisite)));
    if (canAccept.length > 0) weights.push({ action:'accept_quest', weight: 25 });
  }

  // 如果有活跃任务的目标场景，优先前往（不管是否 visited，只要探索未完成就去）
  if (typeof getActiveQuests === 'function' && typeof getQuestDB === 'function') {
    const active = getActiveQuests();
    const db = getQuestDB();
    const goalScenes = [];
    active.forEach(aq => {
      const quest = db.find(q => q.id === aq.id);
      if (!quest || !quest.requirements || !quest.requirements.explore) return;
      const progress = aq.progress || {};
      if (G.currentScene === quest.requirements.explore || progress.explored) return;
      goalScenes.push(quest.requirements.explore);
    });
    if (goalScenes.length > 0) {
      // 当前场景是目标？直接探索（并立即标记完成）
      if (goalScenes.includes(G.currentScene)) {
        weights.push({ action:'explore', weight: 40 });
      } else {
        // 尝试前往目标场景
        weights.push({ action:'move_to_quest', weight: 30 });
      }
    }
  }

  // 移动（去其他场景）
  const conns = (typeof getConnections === 'function') ? getConnections() : [];
  if (conns.length > 0 && Math.random() < 0.12) {
    weights.push({ action:'move', weight: 8 });
  }

  // 加权选
  const totalW = weights.reduce((s, a) => s + a.weight, 0);
  let roll = Math.random() * totalW;
  for (const a of weights) {
    roll -= a.weight;
    if (roll <= 0) return a.action;
  }
  return 'cultivate';
}

// ==========================
// 执行实际动作（返回结果文本，传给叙事引擎）
// ==========================
function executeStoryAction(action) {
  const p = G.player;
  const scene = getSceneData(G.currentScene);
  // 🔧 连续探索计数：探索递增，其他行为清零（配合导航分支的5轮上限）
  if (action === 'explore') { _exploreStreak++; }
  else if (_exploreStreak > 0 && action !== 'nourish_benming' && action !== 'beast_care' && action !== 'gather_care') { _exploreStreak = 0; }
  let result = { action, qiDelta: 0, hpDelta: 0, stonesDelta: 0, items: [], narrative: '' };

  switch (action) {
    case 'cultivate':
      if (typeof qiCultivate === 'function') {
        const beforeQi = p.qi; const beforeCp = p.qiCultivationPoints;
        qiCultivate();
        result.qiDelta = p.qi - beforeQi;
        result.cpDelta = p.qiCultivationPoints - beforeCp;
        result.narrative = '你运转功法，引天地灵气入体。';
      }
      break;

    case 'explore':
      // 探索+可能的战斗
      if (typeof explore === 'function') explore();
      // 🐾 探索顺带尝试捕捉（内部会处理满栏自动换血）
      if (typeof tryCatchBeast === 'function') {
        try { tryCatchBeast(G.currentScene); } catch(e) {}
      }
      // 如果在野外，同时触发战斗尝试
      if (!scene.safe && Math.random() < 0.3 && typeof startAutoCombat === 'function') {
        try { startAutoCombat(); } catch(e) {}
        result.narrative = '你在探索中遭遇了妖兽！';
        result.combat = true;
      } else {
        result.narrative = '你仔细探查了四周。';
      }
      break;

    case 'rest':
      if (typeof rest === 'function') {
        const beforeQi = p.qi; const beforeHp = p.hp;
        rest();
        result.qiDelta = p.qi - beforeQi;
        result.hpDelta = p.hp - beforeHp;
        result.narrative = '你停下来调息休整。';
      }
      break;

    case 'consume':
      if (typeof autoConsumeBestItem === 'function') autoConsumeBestItem();
      result.narrative = '你从怀里取出丹药服下。';
      break;

    case 'breakthrough':
      // 先补药再突破
      if (typeof autoBuyFromBlackMarket === 'function') {
        try { autoBuyFromBlackMarket(); } catch(e) {}
      }
      if (typeof qiBreakthroughCheck === 'function') qiBreakthroughCheck();
      // 如果突破后仍满修为→标记冷却，避免循环刷消息
      if (G.player && typeof getCultivationProgress === 'function' && getCultivationProgress('qi') >= 100 && G.player.qiRealmIndex < QI_REALMS.length - 1) {
        G.player._lastBreakthroughFail = Date.now();
      }
      result.narrative = '你运转全身灵力，尝试冲击更高境界。';
      break;

    case 'breakthrough_body':
      if (typeof bodyBreakthroughCheck === 'function') bodyBreakthroughCheck();
      result.narrative = '气血翻涌，你引导体魄之力冲击炼体瓶颈。';
      break;

    case 'black_market':
      // 先回城镇
      if (typeof walkToTown === 'function' && walkToTown()) {
        // 回到城镇后再买
        if (typeof autoBuyFromBlackMarket === 'function') {
          try { autoBuyFromBlackMarket(); } catch(e) {}
        }
        result.narrative = '你回到镇上，钻进黑市买了些丹药。';
      } else {
        if (typeof autoBuyFromBlackMarket === 'function') {
          try { autoBuyFromBlackMarket(); } catch(e) {}
        }
        result.narrative = '你找了个僻静角落，暗中与黑市搭上了线。';
      }
      break;

    case 'farm_money':
      // 去高收益场景刷怪
      if (typeof walkTowardFarmScene === 'function') {
        try {
          const moved = walkTowardFarmScene();
          if (!moved) {
            // 已经在打钱场景 → 战斗（仅限有怪物的场景）
            const curScene = getSceneData(G.currentScene);
            if (curScene && !curScene.safe && curScene.monsters && curScene.monsters.length > 0 && typeof startAutoCombat === 'function') {
              try { startAutoCombat(); } catch(e) {}
              result.combat = true;
              if (typeof autoSellInventory === 'function') autoSellInventory();
            } else {
              // 无怪物：直接移动去下一个有怪的场景
              result.narrative = '此地不宜久留，你转身离去。';
            }
          }
        } catch(e) {}
      }
      result.narrative = result.narrative || '你四处猎杀妖兽，以战养战。';

    case 'accept_quest':
      if (typeof QUEST_DB !== 'undefined') {
        const activeQuests = typeof getActiveQuests === 'function' ? getActiveQuests() : [];
        const completed = G.player.completedQuests || [];
        const canAccept = QUEST_DB.filter(q => q.autoTrigger === 'realmBreak' && q.triggerRealm !== undefined &&
          G.player.qiRealmIndex >= (q.triggerRealm - 1) &&
          G.player.qiRealmIndex - (q.triggerRealm - 1) <= 2 &&  // 🔧 防补发过期引导任务
          G.player.qiRealmIndex - (q.triggerRealm - 1) >= -2 &&  // 🔧 境界不够也不接
          !activeQuests.find(aq => aq.id === q.id) &&
          !completed.includes(q.id) &&
          !(q.prerequisite && !completed.includes(q.prerequisite)));
        if (canAccept.length > 0 && typeof acceptQuest === 'function') {
          canAccept.forEach(q => {
            try { acceptQuest(q.id, true); } catch(e) {}
          });
        } else {
          result.narrative = '前路已明，无需再多寻方向。';
        }
      }
      result.narrative = result.narrative === '前路已明，无需再多寻方向。' ? result.narrative : '你感应到天地的指引，明晰了前行的方向。';
      break;

    case 'move_to_quest': {
      // 直接交给 doQuestWork 处理（导航/探索/击杀/收集全流程）
      if (typeof doQuestWork === 'function') {
        doQuestWork();
        result.narrative = ''; // doQuestWork 自己会输出叙事
        break;
      }
      // 兜底：尝试前往任务目标场景
      if (typeof getActiveQuests === 'function') {
        const active = getActiveQuests();
        let targetScene = null;
        for (const q of active) {
          if (q.requirements && q.requirements.explore) {
            targetScene = q.requirements.explore;
            break;
          }
        }
        if (targetScene) {
          const sceneData = typeof getSceneData === 'function' ? getSceneData(targetScene) : null;
          // 找一条路径：先随便走个连接
          const conns = (typeof getConnections === 'function') ? getConnections() : [];
          const unvisited = conns.filter(c => !G.visitedScenes || !G.visitedScenes.includes(c.id));
          if (unvisited.length > 0) {
            const t = unvisited[Math.floor(Math.random() * unvisited.length)];
            if (typeof moveToScene === 'function') {
              const oldScene = getSceneData(G.currentScene);
              moveToScene(t.id);
              result.narrative = `你向着任务指引的方向前行，来到了${t.name}。`;
              result.moveFrom = oldScene ? oldScene.name : '原地';
              result.moveTo = t.name;
            }
          } else if (conns.length > 0) {
            const t = conns[Math.floor(Math.random() * conns.length)];
            if (t.id !== G.currentScene && typeof moveToScene === 'function') {
              const oldScene = getSceneData(G.currentScene);
              moveToScene(t.id);
              result.narrative = `你继续前行，来到了${t.name}。`;
              result.moveFrom = oldScene ? oldScene.name : '原地';
              result.moveTo = t.name;
            }
          }
        }
      }
      break;
    }

    case 'explore_new_area': {
      var bestArea = typeof findBestNewAreaToExplore === 'function' ? findBestNewAreaToExplore() : null;
      if (bestArea && bestArea.id !== G.currentScene) {
        // 如果可以直接去，一步走过去
        var conns2 = (typeof getConnections === 'function') ? getConnections() : [];
        var directConn = conns2.find(function(c){ return c.id === bestArea.id; });
        if (directConn && typeof moveToScene === 'function') {
          moveToScene(bestArea.id);
          result.narrative = '你循着感应，前往' + bestArea.name + '。新的天地在前方等你。';
          result.moveFrom = (getSceneData(G.currentScene)||{}).name || '原地';
          result.moveTo = bestArea.name;
        } else {
          // 不能直接到，走一步靠近
          var moved = typeof walkOneStepToward === 'function' ? walkOneStepToward(bestArea.id) : false;
          if (moved) {
            result.narrative = '你踏上了前往' + bestArea.name + '的路。';
          } else {
            // 随便走
            var randConn = conns2.length > 0 ? conns2[Math.floor(Math.random() * conns2.length)] : null;
            if (randConn && randConn.id !== G.currentScene && typeof moveToScene === 'function') {
              moveToScene(randConn.id);
              result.narrative = '你随意选了一条路前行，来到了' + randConn.name + '。';
            } else {
              result.narrative = '你环顾四周，不知该往何处去。';
            }
          }
        }
      } else {
        result.narrative = '你感应不到适合当前修为的新地方，也许该继续提升自己。';
      }
      break;
    }

    case 'teleport':
      if (typeof recall === 'function') recall();
      result.narrative = '你催动传送符。';
      break;

    case 'move': {
      const conns = (typeof getConnections === 'function') ? getConnections() : [];
      const targets = conns.filter(c => c.id !== G.currentScene);
      if (targets.length > 0) {
        const t = targets[Math.floor(Math.random() * targets.length)];
        if (typeof moveToScene === 'function') {
          const oldScene = getSceneData(G.currentScene);
          moveToScene(t.id);
          const newScene = getSceneData(t.id);
          result.narrative = `你起身前往${t.name}。`;
          result.moveFrom = oldScene ? oldScene.name : '未知';
          result.moveTo = t.name;
        }
      }
      break;
    }

    case 'wander':
      // 纯叙事，不执行实际动作
      result.narrative = '你漫无目的地走着，任由脚步带着思绪飘远。';
      break;

    case 'contemplate':
      // 纯叙事感悟
      result.narrative = '你停下脚步，若有所思。';
      break;

    case 'world_event':
      // 纯世界事件
      result.worldEvent = WORLD_FLUFF[Math.floor(Math.random() * WORLD_FLUFF.length)];
      result.narrative = '';
      break;

    case 'social': {
      const npcs = (typeof npcManager !== 'undefined')
        ? npcManager.getNPCsForScene(G.currentScene).filter(n => n.isAlive !== false) : [];
      const target = npcs.find(n => n.daoPartnerId === 'player')
        || npcs.find(n => n.affinity > 40)
        || (npcs.length > 0 ? npcs[Math.floor(Math.random() * npcs.length)] : null);
      if (target) {
        const topics = ['今日修行可有所悟？','这片天地的灵气，你感觉如何？','近来可有什么趣事？','修道之路漫漫，有缘同行也是幸事。'];
        const topic = topics[Math.floor(Math.random() * topics.length)];
        try {
          if (typeof generateNPCResponse === 'function') {
            generateNPCResponse(target, topic).then(reply => {
              if (autoModeActive && reply) {
                addNarrative(`🌸 ${target.name}（${reply}）`, 'narr-event');
                target.affinity = Math.min(100, (target.affinity || 50) + 0.5);
              }
            });
          }
        } catch(e) {}
        result.narrative = `你和${target.name}闲聊了几句。`;
        result.socialTarget = target.name;
        target.affinity = Math.min(100, (target.affinity || 50) + 0.5);
      }
      break;
    }

    case 'dual_cultivate': {
      const partner = (typeof npcManager !== 'undefined')
        ? npcManager.getNPCsForScene(G.currentScene).find(n => n.daoPartnerId === 'player') : null;
      if (partner && typeof dualCultivateWithNPC === 'function') {
        dualCultivateWithNPC(partner);
        result.narrative = `你与${partner.name}心意相通，灵力交融。`;
        result.socialTarget = partner.name;
      }
      break;
    }

    case 'combat':
      if (typeof startAutoCombat === 'function') {
        try { startAutoCombat(); } catch(e) {}
        result.combat = true;
        result.narrative = '一场战斗就此展开。';
      }
      break;

    case 'hunt_boss':
      if (typeof autoHuntBoss === 'function') {
        try { autoHuntBoss(); } catch(e) {}
        result.hunt = true;
        result.narrative = '你踏上了猎杀妖兽首领之路。';
      }
      break;

    case 'nourish_benming':
      if (autoNourishBenming && typeof nourishBenming === 'function') {
        try {
          const beforeLv = p.benming ? p.benming.level : 0;
          const beforeExp = p.benming ? p.benming.exp : 0;
          nourishBenming();
          const after = p.benming || {};
          result.narrative = '你取出温养材料，缓缓注入本命法宝——' + (after.level > beforeLv ? '法宝光华大涨，升到了' + after.level + '级！' : '法宝灵性渐增，温养进度+' + ((after.exp || 0) - beforeExp));
        } catch(e) { result.narrative = '你尝试温养法宝，却暂时没有合适的材料。'; }
      }
      break;

    case 'gather_care':
      // 🧺 材料补给：灵兽没草喂 / 法宝没料温养 → 黑市买或导航去采集
      if (typeof gatherCareMaterials === 'function') {
        try {
          const did = gatherCareMaterials();
          if (!did) {
            // 没买到也去不了 → 不硬等，正常继续（下次再试）
            addNarrative('你盘算着灵兽与法宝所需之物，暂时没有好去处，先顾眼前。', 'event');
          }
        } catch(e) { addNarrative('你盘算着灵兽与法宝所需之物，暂且作罢。', 'event'); }
      }
      break;
      
    case 'beast_care':
      if (autoFeedBeast && typeof feedBeast === 'function' && p.beasts && p.beasts.length > 0) {
        try {
          // 找亲密度最低/最受伤的灵兽
          let targetIdx = -1, worstScore = 999;
          p.beasts.forEach(function(b, i) {
            if (!b) return;
            const score = (b.mood || 80) - (b.maxHp && b.hp < b.maxHp ? (b.maxHp - b.hp) / b.maxHp * 50 : 0);
            if (score < worstScore) { worstScore = score; targetIdx = i; }
          });
          if (targetIdx >= 0) {
            // 找背包里可喂的灵草
            const feedItem = p.inventory.find(function(it) { return it && it.qty > 0 && (it.type === '灵草' || it.herbEffect); });
            if (feedItem) {
              feedBeast(targetIdx, feedItem.id);
              result.narrative = '你取出' + (feedItem.name || feedItem.id) + '，' + (p.beasts[targetIdx] ? p.beasts[targetIdx].name : '灵兽') + '亲昵地凑了过来。';
            } else {
              result.narrative = '你去看望灵兽，可惜背包里没有灵草可喂。';
            }
          }
        } catch(e) { result.narrative = '你去看望灵兽，却没什么可做的。'; }
      }
      break;
  }

  updateAllUI();
  return result;
}

// ==========================
// 核心：用DeepSeek生成散文段落
// ==========================
function generateStoryParagraph(action, result) {
  try {
    const key = (typeof DEEPSEEK_API_KEY !== 'undefined' && DEEPSEEK_API_KEY) ? DEEPSEEK_API_KEY : null;
    const p = G.player;
    const scene = getSceneData(G.currentScene);
    const sceneName = scene ? scene.name : '未知';
    const realm = typeof getRealmLabel === 'function' ? getRealmLabel() : '练气期';

    // 构建prompt
    let situationDesc = '';
    switch (action) {
      case 'cultivate':
        situationDesc = `你正在${sceneName}盘膝修炼，运转功法引灵气入体`;
        if (result.cpDelta > 0) situationDesc += '，修为有所精进';
        break;
      case 'explore':
        situationDesc = `你在${sceneName}中探索，打量四周的一草一木`;
        if (result.combat) situationDesc += '，突然遭遇了妖兽袭击';
        break;
      case 'rest':
        situationDesc = `你在${sceneName}歇脚调息，恢复损耗的灵力和气血`;
        break;
      case 'consume':
        situationDesc = `你服下一枚丹药，温热的气息在经脉中散开`;
        break;
      case 'breakthrough':
        situationDesc = `你运转全身灵力，尝试冲击更高境界——体内灵气如潮水般涌动，经脉在扩张与收缩之间承受着巨大的压力`;
        break;
      case 'breakthrough_body':
        situationDesc = `气血翻涌，骨骼咯咯作响——你引动体魄之力冲击炼体瓶颈，每一寸血肉都在淬炼中燃烧`;
        break;
      case 'black_market':
        situationDesc = `你来到黑市，在琳琅满目的货架前挑选合用的丹药和宝物`;
        break;
      case 'farm_money':
        situationDesc = `你在危险的野外猎杀妖兽，以战养战，收获灵石与材料`;
        break;
      case 'accept_quest':
        situationDesc = `你感应到天地间一道若有若无的指引，像是一缕因果线牵住了你的神魂`;
        break;
      case 'move_to_quest':
        situationDesc = `循着任务指引的方向，你踏上了前往目的地的路途`;
        break;
      case 'explore_new_area':
        situationDesc = `你感觉到这片天地已经不能再给你更多的历练了，需要前往更高修为的区域探索`;
        break;
      case 'teleport':
        situationDesc = `你催动传送符，灵光一闪间回到了安全区域`;
        break;
      case 'move':
        situationDesc = `你离开了${result.moveFrom || '原地'}，前往${result.moveTo || '新的地方'}`;
        break;
      case 'wander':
        situationDesc = `你在${sceneName}中随意漫步，没有特定的目的`;
        break;
      case 'contemplate':
        situationDesc = `你在${sceneName}停下脚步，望着眼前的景象陷入了沉思`;
        break;
      case 'world_event':
        situationDesc = `你在${sceneName}，忽然注意到周围有些异样`;
        break;
      case 'social':
        situationDesc = `你在${sceneName}遇到了${result.socialTarget || '一位故人'}，寒暄了几句`;
        break;
      case 'dual_cultivate':
        situationDesc = `你与${result.socialTarget || '道侣'}在${sceneName}双修，阴阳交融`;
        break;
      case 'combat':
        situationDesc = `你在${sceneName}与妖兽激烈战斗`;
        break;
      case 'hunt_boss':
        situationDesc = `你循着天地间若有若无的血腥气，找到了${result.hunt ? '妖兽首领的巢穴' : '一处隐秘之地'}`;
        break;
      case 'nourish_benming':
        situationDesc = `你盘膝而坐，取出温养材料，以灵力缓缓炼入本命法宝之中`;
        break;
      case 'gather_care':
        situationDesc = `你思量着灵兽与法宝所需，动身去寻些合用的材料`;
        break;
      case 'beast_care':
        situationDesc = `你蹲下身来，抚摸灵兽的毛发，与它温存了片刻`;
        break;
      default:
        situationDesc = `你在${sceneName}，感受着这片天地的气息`;
    }

    const systemPrompt = `你是古典仙侠小说「唯我独仙」的执笔人。你的文字风格自然古雅、有画面感，像明清笔记小说一样娓娓道来。绝不使用现代口语、网络用语或AI腔。

【叙事规则】
- 每段100-250字，一段完整的散文
- 视角：第二人称「你」
- 不要罗列数值（灵力+10之类），用感官和画面说话
- 把角色的行动自然地融进环境描写里
- 融入当天的天气（${autoSeason}季·${autoWeather}）和时辰（${G.time.period}）
- 场景特征：${scene ? scene.description.slice(0, 80) : ''}
- 角色当前境界：${realm}，灵力状态：${Math.round(p.qi)}/${p.maxQi}
${result.combat ? '- 刚刚经历了战斗，描写中略微带上战斗后的余韵' : ''}

【衔接规则】
- 如果上一段以某个画面或感觉收尾，新一段可以从那里自然接上
- 不要让每段都从"你"开始，偶尔以景物或意境开头
- 每段之间有时间流逝感，但不要生硬跳转

【禁忌】
- 不要写「你盘膝而坐」（太模板了），可以写「你在水边青石上坐下，衣摆沾了薄薄一层水汽」
- 不要写「继续修炼」（类似游戏提示），直接描写修炼的过程和感受
- 不要写对话（除非是社交/道侣场景）
- 避免"只见""但见"之类的话本腔太重

直接输出叙事段落，不要前缀。`;

    const prompt = `${situationDesc}。${autoWeather}天，${G.time.period}，${sceneName}。` +
      (result.worldEvent ? `\n\n额外注意：${result.worldEvent}` : '') +
      (result.fateLine ? `\n\n【命运伏笔】${result.fateLine}` : '') +
      (storyContext ? `\n\n上一段的结尾意境：${storyContext.slice(-60)}` : '');

    fetch('https://api.deepseek.com/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + key },
      body: JSON.stringify({
        model: 'deepseek-v4-flash',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: prompt }
        ],
        max_tokens: 350,
        temperature: 0.92,
        top_p: 0.95,
      })
    }).then(r => r.json()).then(data => {
      if (!autoModeActive) return;
      if (data.choices && data.choices[0]) {
        let text = data.choices[0].message.content.trim();
        // 保存尾句作为衔接
        const sentences = text.split(/[。！？\n]/).filter(s => s.trim().length > 5);
        if (sentences.length > 0) {
          storyContext = sentences[sentences.length - 1].trim();
        }
        if (typeof addDailyLogEntry === "function") addDailyLogEntry('auto', '天意自行');
        addNarrative(text, 'narr-event');
      }
    }).catch(() => {
      // DeepSeek不可用时，用本地叙事
      fallbackNarrative(action, result);
    });
  } catch(e) {
    fallbackNarrative(action, result);
  }
}

// ==========================
// 本地兜底叙事（比原来的丰富）
// ==========================
function fallbackNarrative(action, result) {
  const scene = getSceneData(G.currentScene);
  const sceneName = scene ? scene.name : '未知';
  const p = G.player;
  const realm = typeof getRealmLabel === 'function' ? getRealmLabel() : '练气期';

  const paragraphs = {
    breakthrough: [
      `丹田中灵气翻涌如潮，经脉在灵力的冲击下胀痛欲裂。你咬紧牙关，引导着那一股汹涌的力量冲撞着桎梏——咔嚓一声脆响，仿佛什么东西碎开了。四肢百骸涌入一股全新的力量，境界，提升了。`,
    ],
    breakthrough_body: [
      `骨骼咯咯作响，体内的血液像烧开了一样滚烫。你引导气血一遍遍地冲刷着筋骨皮肉，每一次运转都带来撕裂般的痛楚——但痛楚过后，是一阵前所未有的轻快。炼体境界，突破了。`,
    ],
    black_market: [
      `你来到藏于暗巷深处的黑市，昏黄的灯火下，各色奇珍异宝泛着幽幽的光。你在一处摊位前停下，目光扫过那些瓶瓶罐罐——正是你修炼所需之物。`,
    ],
    farm_money: [
      `${sceneName}中妖兽横行，你却丝毫不惧。一道道剑气斩出，妖兽哀嚎着倒下。你弯腰捡起散落的灵石和材料，收入囊中。此地虽险，却是生财之道。`,
      `你在${sceneName}中四处猎杀，身上沾满了尘土和—兽血。但每一场战斗都换来实实在在的收获——灵石、材料，离你想要的丹药又近了一步。`,
    ],
    accept_quest: [
      `冥冥之中有一道声音在你心底响起，像是天地的低语又像是远古的召唤。你凝神感应片刻，心中了然——前路已经显现。`,
    ],
    move_to_quest: [
      `你按照心中的指引踏上路途，穿过林间小径，翻过几座山丘。风吹过你的衣袂，带起一阵尘土。你知道，你要找的东西就在前方某处。`,
    ],
    cultivate: [
      `${autoSeason}日的${autoWeather}天，${sceneName}里灵气氤氲。你寻了块平整的青石坐下，五心朝天，功法自然而然地运转起来。灵气顺着经脉缓缓沉入丹田，像春水渗入干涸的土地。${result.cpDelta > 0 ? '丹田中暖意渐生，修为在无声中精进了一丝。' : ''}`,
      `${G.time.period}的${sceneName}格外安静，只有风声和远处的水声。你闭目调息，引天地灵气游走周身。一遍功法走完，只觉得四肢百骸都舒展开来，连呼吸都变得轻盈了几分。`,
    ],
    explore: [
      `你在${sceneName}中缓步而行，目光扫过每一处角落。${autoWeather === '晴' ? '阳光透过树冠洒下斑驳的光影，' : autoWeather === '雨' ? '雨丝斜织，在叶片上凝成水珠滚落，' : '雾气在林中缭绕，草木的轮廓变得模糊而柔和，'}像是有人在告诉你——这片天地藏着什么。`,
      `脚踩在松软的泥土上，你放开灵识探查四周。${sceneName}的气息扑面而来——有草木的腥甜，有泥土的芬芳，还有一丝若有若无的灵气波动。`,
    ],
    rest: [
      `你倚着一棵老树坐下，从腰间解下水囊喝了一口。凉意顺着喉咙滑入腹中，倦意也随着呼吸一点点消散。${sceneName}的风拂过面颊，带着草木的气息。`,
    ],
    move: [
      `你起身赶路，${result.moveFrom || '离开'}向${result.moveTo || '前方'}。路在脚下延伸，两旁的景色缓缓变换——像是有人在徐徐展开一幅长卷。`,
    ],
    wander: [
      `${G.time.period}的${sceneName}，${autoWeather}。你漫无目的地走着，脚步比思绪还慢。${autoSeason === '春' ? '空气里有青草和泥土的气息，远处有不知名的鸟在叫。' : autoSeason === '秋' ? '落叶在脚下沙沙作响，风里带着一丝凉意。' : '天地间一片肃杀，连虫鸣都消失了。'}`,
    ],
    contemplate: [
      `你停下脚步，望着眼前的${sceneName}出神。${p.qiCultivationPoints > 100 ? '丹田中的灵气缓缓流转，像一圈圈涟漪。你忽然想到——修行这么久，究竟是为了什么？' : '天地的运转自有其规律，而你置身其中，不过是一个渺小的过客。'}这个念头一闪而过，很快便被风吹散了。`,
    ],
    social: [
      `你与${result.socialTarget || '故人'}并肩而行，${result.socialTarget ? 'ta' : '那人'}说话时眉眼之间带着淡淡的笑意。你们随意聊了几句，话题从修行落到山下的传闻，又从传闻飘到最近的天气。${autoSeason === '冬' ? '说话间呼出的白气在空中交融，又各自散开。' : '这样的对话不需要意义，就像林间偶尔响起的鸟鸣——存在过，就够了。'}`,
    ],
    combat: [
      `一场恶战！${sceneName}中剑气纵横，妖兽的嘶吼和你的低喝交织在一起。几番交锋之后，你终于占了上风。战斗结束，你收剑而立，胸口微微起伏。空气中弥漫着尘土和血腥的气息。`,
    ],
  };

  const pool = paragraphs[action] || paragraphs.wander;
  const text = pool[Math.floor(Math.random() * pool.length)];
  const sentences = text.split(/[。！？]/).filter(s => s.trim().length > 5);
  if (sentences.length > 0) storyContext = sentences[sentences.length - 1].trim();
  if (typeof addDailyLogEntry === "function") addDailyLogEntry('auto', '天意自行');
  addNarrative(text, 'narr-event');
  // ⚡ 寻仙缘：本地叙事也支持命运伏笔
  if (result && result.fateLine) {
    addNarrative('　' + result.fateLine, 'narr-epic');
    storyContext = result.fateLine.slice(-40);
  }
}

// ==========================
// 智能吃药
// ==========================
function autoConsumeBestItem() {
  const p = G.player;
  if (!p || !p.inventory) return false;
  // 突破材料白名单——这些丹药是突破用的，不能当修炼药吃掉
  var breakPills = ['juli_dan','poqi_dan','podi_dan','zhuji_dan','jindan_dan',
    'yuanying_dan','huashen_dan','dacheng_dan','dujie_dan',
    'duanti_dan','tongpi_dan','tiegu_dan','yinxiue_dan','jinshen_dan',
    'yusui_dan','bumie_dan','niepan_dan','hundun_dan','buxiu_dan','kaitian_dan','hundao_dan'];
  const consumables = p.inventory
    .filter(function(it){ 
      if (typeof isQuestItem === 'function' && isQuestItem(it.id)) return false;
      return it.use && (it.use.qi || it.use.hp || it.use.cultivationPoints || it.use.mood)
        && breakPills.indexOf(it.id) === -1;  // 跳过突破材料
    })
    .map(it => ({ item: it, val: it.use.qi || it.use.hp || 0 }))
    .sort((a, b) => a.val - b.val);
  if (consumables.length === 0) { return false; }
  for (const entry of consumables) {
    const it = entry.item;
    if ((p.qi < p.maxQi * 0.5 && it.use.qi) || (p.hp < p.maxHp * 0.5 && it.use.hp)) {
      if (typeof useItem === 'function') { useItem(it.id || it.name); return true; }
    }
  }
  const first = consumables[0].item;
  if (typeof useItem === 'function') { useItem(first.id || first.name); return true; }
  return false;
}

// ==========================
// 导出
// ==========================
window.toggleAutoMode = toggleAutoMode;
window.startAutoMode = startAutoMode;
window.stopAutoMode = stopAutoMode;
window.autoModeActive = autoModeActive;
window.autoConsumeBestItem = autoConsumeBestItem;

// ==========================
// 自动黑市购买（无所不有版 💎）
// ==========================
// 🔧 当前突破所需的某丹药数量（autoBuy 优先买够突破量）
function getBreakReqQty(pillId) {
  try {
    if (typeof getBodyBreakthroughReqs === 'function') {
      var bodyReq = getBodyBreakthroughReqs();
      if (bodyReq && bodyReq.items) {
        for (var i = 0; i < bodyReq.items.length; i++) {
          if (bodyReq.items[i].id === pillId) return bodyReq.items[i].qty;
        }
      }
    }
    if (typeof getQiBreakthroughReqs === 'function') {
      var qiReq = getQiBreakthroughReqs();
      if (qiReq && qiReq.items) {
        for (var j = 0; j < qiReq.items.length; j++) {
          if (qiReq.items[j].id === pillId) return qiReq.items[j].qty;
        }
      }
    }
  } catch(e) {}
  return 2;
}

function autoBuyFromBlackMarket() {
  const p = G.player;
  if (!p) return;
  
  // 灵石不足就跳过
  if (p.stones < 30) return;
  
  // 🔧 2026-08-04：当前突破急需的丹药排最前（玉髓丹/金身丹等贵的先买），
  //    避免灵石被便宜丹药囤货耗尽，突破丹反而买不起
  const urgent = [];
  try {
    if (typeof getBodyBreakthroughReqs === 'function') {
      const bodyReq = getBodyBreakthroughReqs();
      if (bodyReq && bodyReq.items) bodyReq.items.forEach(r => urgent.push(r.id));
    }
    if (typeof getQiBreakthroughReqs === 'function') {
      const qiReq = getQiBreakthroughReqs();
      if (qiReq && qiReq.items) qiReq.items.forEach(r => urgent.push(r.id));
    }
  } catch(e) {}
  
  // 看当前需要什么突破丹药
  const needed = [];
  const realmIdx = p.qiRealmIndex || 0;
  const bodyIdx = p.bodyRealmIndex || 0;
  
  // 炼气所需
  if (realmIdx <= 8) needed.push('poqi_dan', 'juli_dan', 'podi_dan');
  // 筑基期突破金丹仍需聚气丹（筑基高阶→金丹：筑基丹×3+聚气丹×5）
  if (realmIdx >= 9 && realmIdx <= 11) needed.push('juli_dan');
  if (realmIdx >= 8) needed.push('zhuji_dan');
  if (realmIdx >= 11) needed.push('jindan_dan');
  if (realmIdx >= 14) needed.push('yuanying_dan');
  if (realmIdx >= 17) needed.push('huashen_dan');
  if (realmIdx >= 20) needed.push('dacheng_dan');
  if (realmIdx >= 22) needed.push('dujie_dan');
  if (bodyIdx <= 8) needed.push('duanti_dan');
  if (bodyIdx >= 7) needed.push('tongpi_dan', 'tiegu_dan', 'yinxiue_dan', 'jinshen_dan', 'yusui_dan');
  if (bodyIdx >= 13) needed.push('bumie_dan', 'niepan_dan');
  if (bodyIdx >= 15) needed.push('hundun_dan');
  if (bodyIdx >= 18) needed.push('buxiu_dan');
  if (bodyIdx >= 19) needed.push('kaitian_dan');
  if (bodyIdx >= 20) needed.push('hundao_dan');
  
  // 🔧 急需的排最前（当前突破直接缺的），其余维持原序
  //   2026-08-05 修复：urgent（动态突破需求）里的丹药必须全部纳入购买列表——
  //   炼体八重突破需破壁丹（podi_dan），但硬编码 needed 只按炼气推破壁丹，
  //   炼气高境界时破壁丹永远买不到 → 炼体八重卡死。urgent 来自 getBody/QiBreakthroughReqs，
  //   是当前真正的突破需求，直接全量加入。
  const urgentSet = {};
  urgent.forEach(id => { urgentSet[id] = true; });
  const neededSorted = [];
  urgent.forEach(id => { if (neededSorted.indexOf(id) === -1) neededSorted.push(id); });
  needed.forEach(id => { if (!urgentSet[id] && neededSorted.indexOf(id) === -1) neededSorted.push(id); });
  
  // 检查背包里每种多少
  const owned = {};
  p.inventory.forEach(i => { owned[i.id] = (owned[i.id] || 0) + (i.qty || 1); });
  
  // 黑市价格倍率
  const priceMult = 2 + Math.random() * 4;
  let bought = 0;
  let spent = 0;
  const stockTarget = realmIdx >= 11 ? 8 : 5;
  for (const pillId of neededSorted) {
    const have = (owned[pillId] || 0);
    // 🔧 急需丹药补到突破所需即可（不囤货）；普通丹药补到 stockTarget
    const needQty = urgentSet[pillId] ? (getBreakReqQty(pillId) || 2) : stockTarget;
    if (have >= needQty) continue;
    const itemData = typeof ITEM_DB !== 'undefined' ? ITEM_DB.find(i => i.id === pillId) : null;
    if (!itemData) continue;
    const unitPrice = Math.max(1, Math.round((itemData.value || 50) * priceMult));
    const want = needQty - have;
    const total = unitPrice * want;
    if (p.stones < total) continue; // 钱不够就跳
    p.stones -= total;
    if (typeof addItemToInventory === 'function') {
      addItemToInventory({...itemData}, want);
    } else {
      p.inventory.push({ id: pillId, name: itemData.name || pillId, type: '丹药', qty: want, value: unitPrice, category: '丹药' });
    }
    bought += want;
    spent += total;
    owned[pillId] = stockTarget;
  }
  
  if (bought > 0) {
    addNarrative(`💰 黑市购得${bought}枚丹药，花费${spent}灵石。`, 'loot');
    if (typeof reportState === 'function') {
      try { reportState('黑市购丹×'+bought); } catch(e) {}
    }
  }
}

window.autoBuyFromBlackMarket = autoBuyFromBlackMarket;

// ==========================
// 🔧 自动材料补给：喂养灵草 / 本命温养材料
// 材料不足时：灵石充足→黑市买；灵石不足→导航去材料来源场景（BOSS/战利品）
// ==========================
var _careGatherCooldownUntil = 0;  // 材料补给冷却（防每轮刷屏）

// 灵兽需要喂养但背包没灵草？返回 true
function beastNeedsFeedMaterial() {
  const p = G.player;
  if (!p || !p.beasts || p.beasts.length === 0) return false;
  // 有需要照顾的灵兽（亲密度低/受伤）
  const needsCare = p.beasts.some(b => b && ((b.mood || 80) < 70 || (b.maxHp && b.hp < b.maxHp * 0.7)));
  if (!needsCare) return false;
  // 背包没灵草
  return !p.inventory.some(it => it && it.qty > 0 && (it.type === '灵草' || it.herbEffect));
}

// 本命法宝需要温养但背包没材料？返回 true
function benmingNeedsNourishMaterial() {
  const p = G.player;
  if (!p || !p.benming || !p.benming.unlocked || p.benming.level >= 99) return false;
  if (typeof BENMING_UPGRADE === 'undefined' || !BENMING_UPGRADE.nourish) return false;
  return !BENMING_UPGRADE.nourish.some(n => p.inventory.some(it => it.id === n.id && it.qty > 0));
}

// 核心：补给一次（黑市买 or 导航去采集）
function gatherCareMaterials() {
  const p = G.player;
  if (!p) return false;
  const now = Date.now();
  if (now < _careGatherCooldownUntil) return false;
  
  const needFeed = beastNeedsFeedMaterial();
  const needNourish = benmingNeedsNourishMaterial();
  if (!needFeed && !needNourish) return false;
  
  // 需要买的材料 id 列表
  const wantIds = [];
  if (needFeed) wantIds.push('hgc_grass', 'lingquan_shui');
  if (needNourish && typeof BENMING_UPGRADE !== 'undefined') {
    BENMING_UPGRADE.nourish.forEach(n => wantIds.push(n.id));
  }
  
  // ── 灵石充足：黑市买（材料便宜，优先买）──
  if (p.stones >= 300) {
    let bought = 0, spent = 0;
    const owned = {};
    p.inventory.forEach(i => { owned[i.id] = (owned[i.id] || 0) + (i.qty || 1); });
    for (const itemId of wantIds) {
      // 已有一定量就不再买（防囤货）
      if ((owned[itemId] || 0) >= 5) continue;
      const itemData = typeof ITEM_DB !== 'undefined' ? ITEM_DB.find(i => i.id === itemId) : null;
      if (!itemData) continue;
      const priceMult = 2 + Math.random() * 3;
      const unitPrice = Math.max(1, Math.round((itemData.value || 10) * priceMult));
      const want = 5 - (owned[itemId] || 0);
      const total = unitPrice * want;
      if (p.stones < total) continue;
      p.stones -= total;
      if (typeof addItemToInventory === 'function') {
        addItemToInventory({ ...itemData }, want);
      } else {
        p.inventory.push({ id: itemId, name: itemData.name || itemId, type: itemData.type || '材料', category: itemData.category || '材料', qty: want, value: unitPrice });
      }
      owned[itemId] = 5;
      bought += want;
      spent += total;
    }
    if (bought > 0) {
      addNarrative('💰 你在黑市补了些' + (needFeed ? '灵草' : '温养材料') + '，花费' + spent + '灵石。', 'loot');
      _careGatherCooldownUntil = now + 20000;  // 20s冷却
      if (typeof updateAllUI === 'function') updateAllUI();
      return true;
    }
  }
  
  // ── 灵石不足：导航去最近的材料来源场景 ──
  let bestTarget = null, bestDist = 9999;
  for (const itemId of wantIds) {
    let sources = null;
    try { sources = typeof getItemSources === 'function' ? getItemSources(itemId) : null; } catch(e) { sources = null; }
    if (!sources) continue;
    // BOSS来源（温养材料基本都是BOSS掉落，且多在高级场景可达）
    (sources.boss || []).forEach(b => {
      if (!b.sceneId || !b.sceneName) return;
      const dist = typeof bfsPathTo === 'function' ? (bfsPathTo(b.sceneId) || []).length : 99;
      if (dist > 0 && dist < bestDist) { bestDist = dist; bestTarget = { sceneId: b.sceneId, reason: '猎杀' + b.bossName + '得' + itemId }; }
    });
    // 战利品来源（灵草靠场景掉落，高级玩家可能不可达，但低中级可达）
    (sources.loot || []).forEach(l => {
      if (!l.sceneId || !l.sceneName) return;
      const dist2 = typeof bfsPathTo === 'function' ? (bfsPathTo(l.sceneId) || []).length : 99;
      if (dist2 > 0 && dist2 < bestDist) { bestDist = dist2; bestTarget = { sceneId: l.sceneId, reason: l.sceneName + '有' + itemId }; }
    });
  }
  
  if (bestTarget && typeof walkOneStepToward === 'function') {
    // 同一目标冷却（防刷屏）
    if (G._lastCareNav === bestTarget.sceneId && G._lastCareNavTime && now - G._lastCareNavTime < 30000) return false;
    G._lastCareNav = bestTarget.sceneId;
    G._lastCareNavTime = now;
    G._navTarget = bestTarget.sceneId;
    walkOneStepToward(bestTarget.sceneId);
    addNarrative('🧺 你想起「' + bestTarget.sceneId + '」一带有你需要的东西——' + bestTarget.reason + '，动身前往！', 'event');
    _careGatherCooldownUntil = now + 30000;  // 30s冷却
    return true;
  }
  
  // 🔧 灵草全部不可达（高级玩家在高级域，低级场景走不回去）→ 引导刷怪赚灵石
  //    灵石够了自然走黑市购买分支。不干等，先去战斗/刷宝。
  if (needFeed && p.stones < 300) {
    addNarrative('灵草多在低级灵地生长，眼下采不到。先打些妖兽换灵石，再去黑市买吧。', 'event');
    _careGatherCooldownUntil = now + 20000;  // 20s冷却防刷屏
    return false;  // 返回false让主循环正常走战斗/探索（下一轮自然刷怪）
  }
  return false;
}

window.gatherCareMaterials = gatherCareMaterials;
window.beastNeedsFeedMaterial = beastNeedsFeedMaterial;
window.benmingNeedsNourishMaterial = benmingNeedsNourishMaterial;

// ==========================
// 自动学习功法卷轴
// ==========================
function autoLearnScrolls() {
  const p = G.player;
  if (!p || !p.inventory) return;
  const scrolls = p.inventory.filter(i => i.id && i.id.startsWith('scroll_'));
  let learned = 0;
  scrolls.forEach(scroll => {
    const skillId = scroll.id.replace('scroll_', '');
    if (!p.skills.find(s => s.id === skillId)) {
      if (typeof learnSkillFromScroll === 'function') {
        try { learnSkillFromScroll(skillId); learned++; } catch(e) {}
      }
    }
    // 从背包移除卷轴
    removeItemFromInventory(scroll.id, 1);
  });
  if (learned > 0) addNarrative(`📜 自动学习了${learned}门功法。`, 'system');
}

window.autoLearnScrolls = autoLearnScrolls;

function extractAllScenes() {
  const scenes = [];
  if (typeof WORLD_DATA !== 'undefined' && WORLD_DATA.layers) {
    WORLD_DATA.layers.forEach(layer => {
      if (layer.scenes) layer.scenes.forEach(s => scenes.push(s));
    });
  }
  return scenes;
}

// ==========================
// 🐾 寻猎场：灵兽栏未满时，找有可抓灵兽+境界合适的场景
// ==========================
function findBeastHuntingScene() {
  var p = typeof G !== 'undefined' ? G.player : null;
  if (!p) return null;
  if (!p.beasts) p.beasts = [];  // 🔧 未初始化视为空栏
  if (p.beasts.length >= 1) { _huntTries = 0; return null; }  // 🐾 已捉到灵兽就不再去猎场死磕（正常战斗/奇遇自然获取）
  if (typeof BEAST_DB === 'undefined') return null;
  var playerQi = p.qiRealmIndex || 0;
  var allScenes = typeof extractAllScenes === 'function' ? extractAllScenes() : [];
  var visited = G.visitedScenes || [];
  
  // 找有可抓灵兽的场景（BEAST_DB catchScene）
  var huntSceneIds = {};
  for (var key in BEAST_DB) {
    var bd = BEAST_DB[key];
    if (bd && bd.catchScene) huntSceneIds[bd.catchScene] = true;
  }
  
  var best = null;
  var bestScore = -1;
  for (var i = 0; i < allScenes.length; i++) {
    var s = allScenes[i];
    if (!s || !s.id || !huntSceneIds[s.id]) continue;
    if (s.safe) continue;  // 安全场景不打怪
    if (typeof checkDomainAccess === 'function') {
      var access = checkDomainAccess(s.cosmosDomain);
      if (!access || !access.pass) continue;
    }
    var qiLevel = s.qiLevel || 1;
    // 境界差：场景 qiLevel 与玩家境界差 ≤2 最佳（不高不低）
    var diff = Math.abs(playerQi - qiLevel);
    if (diff > 3) continue;  // 太低级/太高级都不去
    // 🔧 可达性检查：猎场必须真的能走到（BFS路径存在）
    //    否则导航永远失败（bfsPathTo 返回 null）→ 猎场块每轮重设 navTarget
    //    → 与 exploreStreak 防失控打架 → 其他行为（修炼/突破/任务）全部饿死 = “卡住”
    if (s.id !== G.currentScene && typeof bfsPathTo === 'function') {
      try {
        if (!bfsPathTo(s.id)) continue;
      } catch(e) { continue; }
    }
    var visitedBonus = (visited.indexOf(s.id) !== -1) ? 5 : 3;
    var isCurrent = s.id === G.currentScene ? 10 : 0;
    var pathLen = 0;
    if (s.id !== G.currentScene && typeof bfsPathTo === 'function') {
      try { pathLen = (bfsPathTo(s.id) || []).length; } catch(e) { pathLen = 0; }
    }
    // 距离惩罚：越远分越低（优先近处的猎场，避免长距离导航反复被打断）
    var score = 20 - diff * 4 + visitedBonus + isCurrent - pathLen * 2;
    if (score > bestScore) {
      bestScore = score;
      best = s;
    }
  }
  return best;
}

// ==========================
// 寻最佳新探索区域（境界高了引导去新地方）
// ==========================
function findBestNewAreaToExplore() {
  var p = typeof G !== 'undefined' ? G.player : null;
  if (!p) return null;
  var allScenes = typeof extractAllScenes === 'function' ? extractAllScenes() : [];
  var visited = G.visitedScenes || [];
  var playerQi = p.qiRealmIndex || 0;
  
  // 找未被访问过、且 qiLevel 不低于玩家境界太多的场景
  var candidates = [];
  for (var i = 0; i < allScenes.length; i++) {
    var s = allScenes[i];
    if (!s || !s.id || visited.indexOf(s.id) !== -1) continue;  // 已去过
    if (s.id === G.currentScene) continue;
    if (s.type === 'gate' || s.type === 'mystery' || s.type === 'quest') continue; // 特殊场景
    var sQi = s.qiLevel || 3;
    // 目标场景 qiLevel ≤ 玩家境界+2（不太难也不太弱）
    // 但也不能太弱: qiLevel > playerQi - 2
    if (sQi > playerQi - 2 && sQi <= playerQi + 2) {
      candidates.push({ id: s.id, name: s.name, qiLevel: sQi, diff: sQi - playerQi });
    }
  }
  
  // 如果没有刚好合适的，接受更高难度的（越级挑战）
  if (candidates.length === 0) {
    for (var i2 = 0; i2 < allScenes.length; i2++) {
      var s2 = allScenes[i2];
      if (!s2 || !s2.id || visited.indexOf(s2.id) !== -1) continue;
      if (s2.id === G.currentScene) continue;
      if (s2.type === 'gate' || s2.type === 'mystery' || s2.type === 'quest') continue;
      if (s2.qiLevel > playerQi - 2) {
        candidates.push({ id: s2.id, name: s2.name, qiLevel: s2.qiLevel, diff: s2.qiLevel - playerQi });
      }
    }
  }
  
  if (candidates.length === 0) return null;
  
  // 按难度升序排，取最适合的（接近玩家境界但稍高一点最好）
  candidates.sort(function(a, b) {
    var aDist = Math.abs(a.diff);
    var bDist = Math.abs(b.diff);
    if (aDist !== bDist) return aDist - bDist;
    return a.qiLevel - b.qiLevel;
  });
  
  return candidates[0];
}

window.findBestNewAreaToExplore = findBestNewAreaToExplore;

// ==========================
// 寻最优修炼地（按场景 qiLevel 和安全性评分）
// ==========================
function findBestCultivationScene() {
  const p = G.player;
  if (!p || !G.visitedScenes) return null;
  
  const allScenes = extractAllScenes();
  if (!allScenes.length) return null;
  
  // 对已访问过的安全场景评分
  let best = null;
  let bestScore = -1;
  
  allScenes.forEach(s => {
    // 只看安全场景（可以安心修炼）
    if (!s.safe) return;
    // 当前无法到达的域跳过
    if (typeof checkDomainAccess === 'function') {
      const access = checkDomainAccess(s.cosmosDomain);
      if (!access || !access.pass) return;
    }
    
    const qiLevel = s.qiLevel || 1;
    const visited = G.visitedScenes && G.visitedScenes.includes(s.id);
    const isCurrent = s.id === G.currentScene;
    
    // 评分 = 灵气浓度×5 + 已访问 + 特殊场景加成
    let score = qiLevel * 5;
    if (visited) score += 2;
    if (isCurrent) score -= 1;
    
    if (s.type === 'mountain') score += 3;
    if (s.type === 'garden') score += 2;
    if (s.feature && s.feature.includes('闭关')) score += 10;
    if (s.type === 'town') score -= 5;
    
    if (score > bestScore) {
      bestScore = score;
      best = s;
    }
  });
  
  return best;
}

// ==========================
// BFS 寻最短路径到目标场景
// ==========================
function bfsPathTo(targetId) {
  if (G.currentScene === targetId) return [];
  
  const allScenes = extractAllScenes();
  if (!allScenes.length) return null;
  
  const visited = new Set();
  const queue = [{ id: G.currentScene, path: [] }];
  visited.add(G.currentScene);
  
  while (queue.length > 0) {
    const cur = queue.shift();
    const scene = allScenes.find(s => s.id === cur.id);
    if (!scene || !scene.connections) continue;
    
    for (const connId of scene.connections) {
      if (visited.has(connId)) continue;
      visited.add(connId);
      const newPath = [...cur.path, connId];
      if (connId === targetId) return newPath;
      
      // 检查门禁
      if (typeof checkDomainAccess === 'function') {
        const connScene = allScenes.find(s => s.id === connId);
        if (connScene && connScene.cosmosDomain) {
          const access = checkDomainAccess(connScene.cosmosDomain);
          if (!access || !access.pass) continue;
        }
      }
      
      queue.push({ id: connId, path: newPath });
    }
  }
  
  return null;
}

// ==========================
// 导航一步——向目标场景移动一步
// ==========================
function walkOneStepToward(targetId) {
  const path = bfsPathTo(targetId);
  if (!path || path.length === 0) return false;
  
  const nextSceneId = path[0];
  const beforeScene = G.currentScene;
  if (typeof moveToScene === 'function') {
    moveToScene(nextSceneId);
    // 只有真的移动了才返回true（门禁拒绝不走也算失败）
    if (G.currentScene !== beforeScene && G.currentScene === nextSceneId) {
      const nextScene = getSceneData(nextSceneId);
      if (nextScene) {
        addNarrative(`你朝${nextScene.name}走去……`, 'narr-event');
      }
      return true;
    }
    return false; // moveToScene 拒绝了这个移动
  }
  return false;
}

// 导出
window.findBestCultivationScene = findBestCultivationScene;
window.findBeastHuntingScene = findBeastHuntingScene;
window.findBeastHuntingScene = findBeastHuntingScene;
window.bfsPathTo = bfsPathTo;
window.walkOneStepToward = walkOneStepToward;

// ==========================
// 赚钱地图评估——找最佳刷钱场景
// ==========================
function findFarmScene() {
  const p = G.player;
  if (!p) return null;
  
  const allScenes = typeof extractAllScenes === 'function' ? extractAllScenes() : [];
  if (!allScenes.length) return null;
  
  let best = null;
  let bestScore = -1;
  
  allScenes.forEach(s => {
    // 只看非安全场景（有怪可打）
    if (s.safe) return;
    // 门禁检查
    if (typeof checkDomainAccess === 'function') {
      const access = checkDomainAccess(s.cosmosDomain);
      if (!access || !access.pass) return;
    }
    // 跳过gate类型（无怪物场景）
    if (s.type === 'gate' || !s.monsters || s.monsters.length === 0) return;
    
    // 评分：危险等级×3 + 怪物数量×2 + 灵气浓度（掉好货）
    const danger = s.dangerLevel || 1;
    const qiLevel = s.qiLevel || 1;
    const monCount = s.monsters ? s.monsters.length : 1;
    const visited = G.visitedScenes && G.visitedScenes.includes(s.id) ? 2 : 0;
    
    // 特殊资源场景加分（材料可卖钱）
    let resourceBonus = 0;
    if (s.resourceType === '法器') resourceBonus = 8;
    else if (s.resourceType === '矿石') resourceBonus = 6;
    else if (s.resourceType === '灵木') resourceBonus = 5;
    else if (s.resourceType === '毒物') resourceBonus = 4;
    else if (s.resourceType === '灵草') resourceBonus = 3;
    else if (s.resourceType === '灵药') resourceBonus = 4;
    
    // 修行！境界越高，打低级副本收益越小
    const realmBonus = p.qiRealmIndex >= 12 ? Math.max(1, qiLevel - 3) : 1;
    
    const score = danger * 3 + monCount * 2 + qiLevel * realmBonus + resourceBonus + visited;
    
    if (score > bestScore) {
      bestScore = score;
      best = s;
    }
  });
  
  return best;
}

// ==========================
// 朝赚钱场景走一步
// ==========================
function walkTowardFarmScene() {
  // 当前场景如果已经是打钱场景，直接战斗
  const scene = getSceneData(G.currentScene);
  if (scene && !scene.safe) return false; // 已经在打钱场景
  
  const target = findFarmScene();
  if (!target) return false;
  
  if (typeof walkOneStepToward === 'function') {
    return walkOneStepToward(target.id);
  }
  return false;
}

// ==========================
// 🏥 自动吃最好的回血/回灵丹药
// ==========================
function consumeBestHealItem() {
  var p = G.player;
  if (!p || !p.inventory) return false;
  var heals = p.inventory.filter(function(it){
    if (typeof isQuestItem === 'function' && isQuestItem(it.id)) return false;
    return it.use && (it.use.hp || it.use.qi || it.use.hpPercent || it.use.qiPercent);
  });
  if (heals.length === 0) return false;
  heals.sort(function(a,b){
    var av = (a.use.hp||0) + (a.use.qi||0) + ((a.use.hpPercent||0)*(p.maxHp||100)) + ((a.use.qiPercent||0)*(p.maxQi||100));
    var bv = (b.use.hp||0) + (b.use.qi||0) + ((b.use.hpPercent||0)*(p.maxHp||100)) + ((b.use.qiPercent||0)*(p.maxQi||100));
    // 🔧 2026-08-04：小口渐进优先——先吃最小回血丹（避免一次回满=“塔白打了”），
    //    大丹留给危急时刻/手动使用；多轮挂机自然渐进回满，战损真实
    return av - bv;
  });
  // 🔧 2026-08-04：循环尝试——从最小的开始吃，吃到有效恢复为止（
  //    避免“最小丹只回 qi 不回 hp”时直接放弃，跳过真正的回血丹）
  //    血低于 40% 时只吃回血丹（跳过纯回 qi 的），确保危急时优先回血
  var needHp = p.hp < p.maxHp * 0.4;
  for (var hi = 0; hi < heals.length; hi++) {
    var best = heals[hi];
    // 危急时跳过纯回 qi 的丹（不回 hp 的不吃）
    if (needHp && !best.use.hp && !best.use.hpPercent) continue;
    if (typeof removeItemFromInventory === 'function') removeItemFromInventory(best.id, 1);
    var beforeHp = p.hp, beforeQi = p.qi;
    if (best.use.hp) p.hp = Math.min(p.maxHp, p.hp + best.use.hp);
    if (best.use.qi) p.qi = Math.min(p.maxQi, p.qi + best.use.qi);
    if (best.use.hpPercent) p.hp = Math.min(p.maxHp, p.hp + Math.floor(p.maxHp * best.use.hpPercent));
    if (best.use.qiPercent) p.qi = Math.min(p.maxQi, p.qi + Math.floor(p.maxQi * best.use.qiPercent));
    var recoveredHp = p.hp - beforeHp;
    var recoveredQi = p.qi - beforeQi;
    // 没恢复任何东西→白吃，退还物品，继续试下一个
    if (recoveredHp < 1 && recoveredQi < 1) {
      if (typeof addItemToInventory === 'function') addItemToInventory(best.id, 1);  // 还回去
      continue;
    }
    if (typeof addNarrative === 'function') {
      var parts = [];
      if (recoveredHp >= 1) parts.push('HP+' + Math.round(recoveredHp));
      if (recoveredQi >= 1) parts.push('灵力+' + Math.round(recoveredQi));
      addNarrative('💊 你服用了一枚「' + best.name + '」，' + parts.join('，') + '。', 'event');
    }
    return true;
  }
  if (typeof addNarrative === 'function') addNarrative('你看了看丹药，觉得现在不需要。', 'event');
  return false;
}

// ==========================
// 回城：找最近的城镇走回去
// ==========================
function findNearestTown() {
  if (typeof extractAllScenes !== 'function' || typeof bfsPathTo !== 'function') return null;
  var allScenes = extractAllScenes();
  var towns = allScenes.filter(function(s){ return s.type === 'town' || (s.safe && s.type === 'garden'); });
  if (towns.length === 0) return null;
  var cur = G.currentScene;
  var nearest = null, nearestLen = 999;
  for (var i = 0; i < towns.length; i++) {
    var path = bfsPathTo(towns[i].id);
    if (path && path.length > 0 && path.length < nearestLen) {
      nearest = towns[i];
      nearestLen = path.length;
    }
  }
  return nearest;
}

// ==========================
// 回城：找最近的城镇走一步
// ==========================
function walkToTown() {
  var nearest = findNearestTown();
  if (!nearest || nearest.id === G.currentScene) return false;
  if (typeof walkOneStepToward === 'function') {
    return walkOneStepToward(nearest.id);
  }
  return false;
}

// 域迁徙：境界够了自动往高域走
function migrateDomainForRealm() {
  var p = G.player;
  if (!p || typeof checkDomainAccess !== 'function' || typeof getDomainEntryRequirement !== 'function' || typeof bfsPathTo !== 'function') return;
  var realmIdx = p.qiRealmIndex || 0;
  
  var allScenes = typeof extractAllScenes === 'function' ? extractAllScenes() : [];
  if (allScenes.length === 0) return;
  
  // 找所有修为可达的域的入口场景
  var gates = allScenes.filter(function(s){ return s.type === 'gate' && s.gateTo; });
  
  // 按境界排序：先看看能不能直接走域入口
  var domainEntryScenes = typeof DOMAIN_ENTRY_SCENES !== 'undefined' ? DOMAIN_ENTRY_SCENES : {};
  
  // 收集所有想去的地方：gate场景 + 域入口（尤其是更高域的入口）
  var targets = [];
  
  // 添加域入口场景（DomainEntryScenes）
  for (var did in domainEntryScenes) {
    var req = getDomainEntryRequirement(did);
    if (realmIdx + 1 >= req) {
      targets.push({ id: domainEntryScenes[did], domain: did, priority: req });
    }
  }
  
  // 添加所有gate场景
  gates.forEach(function(g){
    if (targets.indexOf(g.id) === -1) targets.push({ id: g.id, domain: g.gateTo, priority: 0 });
  });
  
  if (targets.length === 0) return;
  
  // 按优先级排（高境界要求优先）
  targets.sort(function(a,b){ return b.priority - a.priority; });
  
  // BFS找可达的
  for (var ti = 0; ti < targets.length; ti++) {
    if (targets[ti].id === G.currentScene) {
      // 已经在入口，尝试传送
      if (typeof travelToDomain === 'function' && targets[ti].domain) {
        travelToDomain(targets[ti].domain);
        return;
      }
      continue;
    }
    var path = bfsPathTo(targets[ti].id);
    if (path && path.length > 0) {
      // 目标场景如果是gate且有门槛，先检查
      var targetScene = getSceneData(targets[ti].id);
      if (targetScene && targetScene.type === 'gate' && targetScene.gateTo && typeof checkLayerAccess === 'function') {
        var gAccess = checkLayerAccess(targetScene.gateTo);
        if (!gAccess.pass) continue; // 进不去的gate跳过
      }
      // 走一步就够（下轮再走下一步）
      if (typeof walkOneStepToward === 'function') {
        walkOneStepToward(targets[ti].id);
        return;
      }
    }
  }
}

// ==========================
// 游戏状态上报（给监控服务）
// ==========================
var __lastReportTime = 0;
function reportState(event) {
  return; // 已废弃，不上报
  try {
    var p = G && G.player;
    if (!p) return;
    // 每5秒最多上报一次，防刷
    var now = Date.now();
    if (now - __lastReportTime < 5000) return;
    __lastReportTime = now;
    
    var qiRealm = (typeof QI_REALMS !== 'undefined' && QI_REALMS[p.qiRealmIndex]) ? QI_REALMS[p.qiRealmIndex].name : '??';
    var bodyRealm = (typeof BODY_REALMS !== 'undefined' && BODY_REALMS[p.bodyRealmIndex]) ? BODY_REALMS[p.bodyRealmIndex].name : '??';
    var scene = typeof getSceneData === 'function' ? getSceneData(G.currentScene) : null;
    var qiP = typeof getCultivationProgress === 'function' ? Math.round(getCultivationProgress('qi')) : 0;
    var bodyP = typeof getCultivationProgress === 'function' ? Math.round(getCultivationProgress('body')) : 0;
    
    // 统计关键丹药
    var pillNames = [];
    var pillIds = ['poqi_dan','juli_dan','podi_dan','zhuji_dan','jindan_dan','yuanying_dan',
      'huashen_dan','dacheng_dan','dujie_dan','duanti_dan','tongpi_dan','tiegu_dan'];
    pillIds.forEach(function(id){
      var it = p.inventory.find(function(i){return i.id===id;});
      if (it) pillNames.push(it.id + ':' + (it.qty||1));
    });
    
    var payload = {
      playerName: p.name,
      qiRealm: qiRealm,
      qiProgress: qiP,
      bodyRealm: bodyRealm,
      bodyProgress: bodyP,
      stones: p.stones || 0,
      mood: Math.round(p.mood || 0),
      combatPower: Math.round(p.combatPower || 0),
      day: G.time ? G.time.day : 0,
      currentScene: scene ? scene.name : G.currentScene,
      autoMode: autoModeActive ? '开' : '关',
      skills: p.skills ? p.skills.filter(function(s){return s.active;}).length + '/' + p.skills.length : '0',
      pills: pillNames.join(', ') || '无',
      event: event || '',
    };
    
    var xhr = new XMLHttpRequest();
    xhr.open('POST', 'http://172.21.217.254:3456/report', true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify(payload));
  } catch(e) { /* silently fail */ }
}

// 导出
window.findFarmScene = findFarmScene;
// ==========================
// 推荐修炼场景
// 根据玩家当前境界推荐最合适的地图
// ==========================
function findRecommendedScene() {
  var p = G && G.player;
  if (!p) return null;
  var allScenes = typeof extractAllScenes === 'function' ? extractAllScenes() : [];
  if (!allScenes.length) return null;
  
  // 计算玩家期望的 qiLevel
  // 练气期(0-8): 3~8  筑基期(9-11): 8~10  金丹+(12+): 12~14 随小境界递增
  var idealLevel;
  if (p.qiRealmIndex <= 4) idealLevel = 3 + p.qiRealmIndex;
  else if (p.qiRealmIndex <= 8) idealLevel = 8;
  else if (p.qiRealmIndex <= 11) idealLevel = 9 + (p.qiRealmIndex - 8);
  else if (p.qiRealmIndex <= 14) idealLevel = 12 + (p.qiRealmIndex - 12); // 金丹初12 中13 高14
  else idealLevel = 14; // 元婴+ 暂封顶14，后续可扩展
  
  var best = null;
  var bestScore = -999;
  
  allScenes.forEach(function(s) {
    if (typeof checkDomainAccess === 'function') {
      var access = checkDomainAccess(s.cosmosDomain);
      if (!access || !access.pass) return;
    }
    // 跳过村庄（修炼效率低）
    if (s.type === 'town') return;
    
    var qiLevel = s.qiLevel || 1;
    // 目标：找到 qiLevel 接近 idealLevel 且不超过太多的高威胁场景
    var diff = qiLevel - idealLevel;
    var score;
    if (diff >= -2 && diff <= 1) {
      // 完美匹配范围
      score = 100 - Math.abs(diff) * 10;
    } else if (diff < -2) {
      // 太低端
      score = -50 + diff * 5;
    } else {
      // 太高
      score = 30 - diff * 10;
    }
    // 有怪物和 BOSS 的加分（战斗资源丰富）
    var td = typeof getSceneThreatData === 'function' ? getSceneThreatData(s.id) : null;
    if (td) {
      if (td.monsters && td.monsters.length > 0) score += 10;
      if (td.boss) score += 15;
      if (td.hasSkillDrop) score += 20;
    }
    // 已访问的加分
    if (G.visitedScenes && G.visitedScenes.indexOf(s.id) !== -1) score += 5;
    
    if (score > bestScore) {
      bestScore = score;
      best = s.id;
    }
  });
  
  return best;
}

// ==========================
// 一键自动前往推荐场景
// ==========================
function autoGoToRecommended() {
  var target = findRecommendedScene();
  if (!target) {
    addNarrative('暂未找到适合你的修炼场景。', 'system');
    return;
  }
  var targetScene = getSceneData(target);
  if (!targetScene) return;
  
  if (target === G.currentScene) {
    addNarrative('你已经身在推荐的修炼场景「' + targetScene.name + '」了！', 'narr-event');
    return;
  }
  
  var path = typeof bfsPathTo === 'function' ? bfsPathTo(target) : null;
  if (!path) {
    addNarrative('路径不通，无法前往推荐的场景。', 'system');
    return;
  }
  
  addNarrative('🌟 已开启自动导航，前往「' + targetScene.name + '」……', 'event');
  window._navTarget = target;
  // 非自动模式时自动开启
  if (typeof autoModeActive === 'undefined' || !autoModeActive) {
    if (typeof startAutoMode === 'function') startAutoMode();
  }
}

window.findRecommendedScene = findRecommendedScene;
window.autoGoToRecommended = autoGoToRecommended;

// ==========================
// 🏹 猎杀BOSS模式：主动寻找可猎杀的场景BOSS（掉破境丹的）
// ==========================
function findHuntableBoss() {
  var p = G.player;
  if (!p) return null;
  var dayStr = null;
  if (G.time && G.time.day !== undefined) dayStr = 'day_' + G.time.day;
  
  var allScenes = [];
  if (G.worldData && G.worldData.layers) {
    G.worldData.layers.forEach(function(layer) {
      (layer.scenes || []).forEach(function(s) { allScenes.push(s); });
    });
  } else if (typeof getSceneData === 'function') {
    var sceneIds = Object.keys(window.BOSS_MONSTERS || {});
    sceneIds.forEach(function(id) {
      var s = getSceneData(id);
      if (s) allScenes.push(s);
    });
  }
  
  var candidates = [];
  allScenes.forEach(function(s) {
    if (!s) return;
    if (typeof checkDomainAccess === 'function') {
      var access = checkDomainAccess(s.cosmosDomain);
      if (!access || !access.pass) return;
    }
    // 当天已击败过则跳过
    if (dayStr && p._bossFought === dayStr + '_' + s.id) return;
    // 必须有场景BOSS
    var bossEntry = (typeof window.BOSS_MONSTERS !== 'undefined') ? window.BOSS_MONSTERS[s.id] : null;
    if (!bossEntry) return;
    // 有破境丹掉落才值得猎杀
    var hasBreakPill = (bossEntry.drops || []).some(function(d) {
      var it = d.itemId ? (typeof ITEM_DB !== 'undefined' ? ITEM_DB.find(function(i){ return i && i.id === d.itemId; }) : null) : null;
      return it && it.breakItem;
    });
    if (!hasBreakPill) return;
    
    // 玩家战力评估：修为境界 ≥ 场景等级才敢打（不越级送死）
    var qiLevel = s.qiLevel || 3;
    var power = p.qiRealmIndex || 0;
    var attack = p.attack || 10;
    var hp = p.maxHp || p.hp || 100;
    var canFight = power >= qiLevel && attack >= bossEntry.attack * 0.45 && hp >= bossEntry.hp * 0.2;
    if (!canFight) return;
    
    candidates.push({ sceneId: s.id, name: s.name, qiLevel: qiLevel, boss: bossEntry });
  });
  
  if (candidates.length === 0) return null;
  // 优先打等级最高的（奖励最好）
  candidates.sort(function(a, b) { return b.qiLevel - a.qiLevel; });
  return candidates[0];
}

function autoHuntBoss() {
  var target = findHuntableBoss();
  if (!target) {
    addNarrative('暂无可猎杀的妖兽首领。', 'system');
    return;
  }
  if (G.currentScene === target.sceneId) {
    // 已在目标场景：强制猎杀（直接触发当天未战的BOSS）
    if (typeof startHuntBossCombat === 'function') {
      try { startHuntBossCombat(target.sceneId); } catch(e) {}
    } else if (typeof startAutoCombat === 'function') {
      try { startAutoCombat(); } catch(e) {}
    }
    addNarrative('⚔️ 你在此地反复搜索，试图引出「' + target.boss.name + '」……', 'event');
  } else {
    // 导航前往（walkOneStepToward 内部会自行寻路，这里只需设目标）
    G._navTarget = target.sceneId;
    addNarrative('🏹 听闻「' + target.boss.name + '」可能携带突破丹药，你动身前往「' + target.name + '」猎杀！', 'event');
  }
}

window.findHuntableBoss = findHuntableBoss;
window.autoHuntBoss = autoHuntBoss;

// 🔧 自动养宠/温养开关导出
window.toggleAutoNourish = toggleAutoNourish;
window.toggleAutoFeed = toggleAutoFeed;
window.updateAutoCareButtons = updateAutoCareButtons;
window.getAutoCarePref = getAutoCarePref;

window.walkTowardFarmScene = walkTowardFarmScene;
window.consumeBestHealItem = consumeBestHealItem;
window.findNearestTown = findNearestTown;
window.walkToTown = walkToTown;
window.migrateDomainForRealm = migrateDomainForRealm;
window.reportState = reportState;
