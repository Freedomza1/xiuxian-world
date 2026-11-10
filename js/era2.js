// === 唯我独仙 · 第二纪元「冰阁传承」 ===
// 时间线：罗峰与百里冰飞升之后，其子嗣于凡尘开宗立派——「冰阁」
// 冰风石窟成为冰阁禁地，元婴后可入内苦修，窥见先辈故事
// 2026-08-04 新建 · 与第一纪元完全独立（独立存档前缀、独立剧情）

// ── 冰阁四脉道统 ──
const SECT_LINES = [
  {
    id: 'sword', name: '剑脉', icon: '🗡️', color: '#7dce9a',
    desc: '承罗峰之剑意，一剑破万法。以攻伐为道，剑心通明。',
    bonus: { attackBonus: 8, critRate: 0.03, skillType: '攻伐术' },
  },
  {
    id: 'alchemy', name: '丹脉', icon: '⚗️', color: '#e8c88a',
    desc: '承百里冰之丹道，以药入道，悬壶济世。炼丹事半功倍，丹道功法修炼神速。',
    bonus: { wisdomBonus: 5, pillBonus: 0.2, skillType: '丹道' },
  },
  {
    id: 'talisman', name: '符脉', icon: '📜', color: '#6a9ec9',
    desc: '以符箓沟通天地，一笔一画皆含道韵。攻守兼备，变化无穷。符阵之道修炼神速。',
    bonus: { qiBonus: 30, defenseBonus: 5, skillType: '阵道' },
  },
  {
    id: 'body', name: '体脉', icon: '💪', color: '#c96a5a',
    desc: '以肉身成圣，万法不侵。承百里冰寒体之威，肉身即为兵器。',
    bonus: { boneBonus: 6, hpBonus: 40, skillType: '炼体术' },
  },
];

// ── 冰阁驻地（青云镇后山）场景定义 ──
// 注：sect_base 已正式加入 WORLD_DATA（data.js x2,y2）；此常量仅保留作冰阁叙事参考，
//     显示名统一用 engine.js 的 getSceneDisplayName（冰阁弟子 → 冰阁·山门）
const SECT_BASE_SCENE = {
  id: 'sect_base', name: '冰阁·山门', type: 'mountain', safe: true,
  qiLevel: 3, resourceType: '灵草',
  description: '青云镇后山的一片旧废墟，残垣断壁间爬满青苔。山风拂过，隐约能听见极远处冰窟的呜咽——这里将是冰阁的立派之地。',
  feature: '门派驻地',
};

// ── 冰阁传承标记 ──
function isEra2() {
  return !!(G && G.player && G.player.era2);
}
function isSectMember() {
  return !!(G && G.player && G.player.era2 && G.player.sect);
}
function getSectLine() {
  if (!isSectMember()) return null;
  const p = G.player;
  return SECT_LINES.find(l => l.id === p.sect.line) || null;
}

// ── 第二纪元存档键 ──
function getEra2SaveKey() {
  const name = G.player ? (G.player.name || '主角') : '主角';
  return 'weiwoduxian_save2_' + name;
}

// ── 冰阁创角：选道统（进入第二纪元专属创角流程） ──
function showSectLineSelection() {
  const container = document.getElementById('welcome');
  if (!container) return;
  let html = `
    <div class="fortune-select">
      <div class="fortune-header">
        <h1 style="font-size:26px;margin-bottom:2px;">❄️ 冰 阁</h1>
        <p class="fortune-sub" style="font-size:12px;color:var(--text-dim);margin-bottom:6px;">— 第二纪元 · 门派传承 —</p>
        <div style="max-width:520px;margin:0 auto 10px;padding:10px 14px;background:rgba(120,180,220,0.08);border:1px solid rgba(120,180,220,0.2);border-radius:8px;font-size:11px;color:var(--text);line-height:1.7;text-align:left;">
          <b style="color:#8ecae6;">📖 冰阁渊源</b><br>
          多年前，罗峰与百里冰于冰风石窟中双修悟道，先后飞升仙界。飞升前，二人留下一封锦书与一枚冰晶信物，托付给尚在襁褓中的幼子——<b>「冰阁当立，传承不绝」</b>。<br>
          数十年后，你便是那信物之主。今携冰阁之志，于青云镇后山开宗立派。先辈的故事在江湖上口耳相传，而你，将书写新的篇章。
        </div>
        <h2 style="font-size:18px;margin:8px 0;">🗡️ 选择冰阁道统</h2>
        <p class="fortune-sub">四脉传承，择一而修</p>
      </div>
      <div id="sect-lines" style="display:grid;grid-template-columns:1fr 1fr;gap:8px;max-width:520px;margin:0 auto;">
        ${SECT_LINES.map((l, i) => `
          <div class="co-origin" data-id="${l.id}" style="cursor:pointer;padding:10px;border:1px solid rgba(255,255,255,0.1);border-radius:8px;font-size:11px;${i === 0 ? 'border-color:' + l.color + ';background:rgba(125,206,154,0.08);' : ''}">
            <div style="font-weight:bold;margin-bottom:3px;color:${l.color};font-size:13px;">${l.icon} ${l.name}</div>
            <div style="color:var(--text-dim);font-size:10px;line-height:1.5;">${l.desc}</div>
          </div>
        `).join('')}
      </div>
      <div style="margin-top:14px;display:flex;gap:10px;justify-content:center;">
        <button onclick="showEraSelect()" style="padding:8px 18px;border:1px solid rgba(255,255,255,0.2);border-radius:6px;background:transparent;color:var(--text);cursor:pointer;font-size:12px;">← 返回</button>
        <button onclick="confirmSectLine()" style="padding:8px 22px;background:linear-gradient(135deg,#6a9ec9,#8ecae6);color:#000;border:none;border-radius:6px;cursor:pointer;font-weight:bold;font-size:13px;">❄️ 承此道统 →</button>
      </div>
    </div>
  `;
  container.innerHTML = html;
  document.getElementById('sect-lines').addEventListener('click', function(e) {
    const el = e.target.closest('.co-origin');
    if (!el) return;
    this.querySelectorAll('.co-origin').forEach(x => {
      x.style.borderColor = 'rgba(255,255,255,0.1)';
      x.style.background = 'transparent';
    });
    const line = SECT_LINES.find(l => l.id === el.dataset.id);
    el.style.borderColor = line.color;
    el.style.background = line.color + '22';
    window._selSectLine = el.dataset.id;
  });
  window._selSectLine = 'sword';
}

function confirmSectLine() {
  const lineId = window._selSectLine || 'sword';
  // 记住道统选择，进入天命抽牌
  window._sectLinePending = lineId;
  showFortuneSelection();
}

// ── 冰阁入门考核（资质判定，随机角色不一定能通过） ──
// 🔧 2026-08-04：拜入冰阁不再无门槛。考核基于资质+道统契合度，
//    被拒可重抽天命牌再试，或放弃拜入。通过的才成为正式弟子。
function runSectTrial() {
  if (!G.player || !G.player.sect) return false;
  const p = G.player;
  const line = SECT_LINES.find(l => l.id === p.sect.line) || SECT_LINES[0];
  
  // 资质基础分（0-100）
  const bone = p.bone || 0;
  const wisdom = p.wisdom || 0;
  const luck = p.luck || 0;
  const baseScore = bone * 0.4 + wisdom * 0.35 + luck * 0.25;
  
  // 道统契合加分（灵根匹配）
  const roots = (p.spiritRoots || []);
  const lineRoots = {
    'sword': ['金', '火'],
    'alchemy': ['木', '水'],
    'talisman': ['金', '水'],
    'body': ['土', '水'],
  }[line.id] || [];
  const matchCount = roots.filter(r => lineRoots.indexOf(r) !== -1).length;
  const rootBonus = matchCount * 8;
  
  // 随机波动（考核官心情 ±8）
  const moodVar = Math.floor(Math.random() * 17) - 8;
  
  const score = Math.round(baseScore + rootBonus + moodVar);
  const passed = score >= 62;
  
  p.sect.trial = {
    score: score,
    passed: passed,
    bone: Math.round(bone),
    wisdom: Math.round(wisdom),
    luck: Math.round(luck),
    rootMatch: matchCount,
    lineId: line.id,
    day: G.time ? G.time.day : 0,
  };
  return passed;
}

// ── 入门考核结果界面 ──
function showSectTrialResult() {
  const container = document.getElementById('welcome');
  if (!container || !G.player || !G.player.sect) return;
  const p = G.player;
  const line = SECT_LINES.find(l => l.id === p.sect.line) || SECT_LINES[0];
  const t = p.sect.trial || { score: 0, passed: false };
  
  if (t.passed) {
    // ── 通过：展示结果（正式入门在点「拜师入门」后由 enterSectGame 设置） ──
    const evalText = t.score >= 80 ? '根骨清奇、悟性绝佳，是天生的好苗子！' :
                     t.score >= 70 ? '资质上佳，稍加打磨必成大器。' :
                     '资质尚可，心性却稳，收下你倒也无妨。';
    container.innerHTML = `
      <div class="fortune-select">
        <div class="fortune-header">
          <h1 style="font-size:28px;margin-bottom:2px;">❄️ 冰 阁</h1>
          <p class="fortune-sub" style="font-size:12px;color:#8ecae6;">— 入门考核 · 通过 —</p>
        </div>
        <div style="max-width:480px;margin:0 auto;text-align:left;padding:16px;border:1px solid rgba(125,206,154,0.35);border-radius:10px;background:rgba(125,206,154,0.08);font-size:12px;line-height:1.9;color:var(--text);">
          <div style="font-weight:bold;color:#7dce9a;font-size:14px;margin-bottom:6px;">✅ 考核通过</div>
          <div>你的综合资质评分为 <b>${t.score}</b>（根骨${t.bone} · 悟性${t.wisdom} · 气运${t.luck}${t.rootMatch ? ' · 灵根契合×' + t.rootMatch : ''}）。</div>
          <div style="margin-top:8px;">接引长老捻须颔首：<span style="color:#8ecae6;">「${evalText}」</span></div>
          <div style="margin-top:8px;">「既入我冰阁${line.name}，当以『${line.icon} ${line.name}』为本命道途。今日起，你便是冰阁正式弟子——道号已录入门墙，望你勤修不辍，莫堕先辈威名。」</div>
        </div>
        <div style="margin-top:16px;display:flex;gap:10px;justify-content:center;">
          <button onclick="enterSectGame()" class="btn-start" style="font-size:14px;padding:10px 24px;">❄️ 拜师入门 →</button>
        </div>
      </div>
    `;
  } else {
    // ── 失败：被拒 ──
    const rejectText = t.score >= 50 ? '资质尚可，但与我冰阁道途不合，恕难收录。' :
                       t.score >= 40 ? '根骨悟性平平，恐难承冰阁绝学。' :
                       '此等资质，入我冰阁只会误了你的性命。请回吧。';
    container.innerHTML = `
      <div class="fortune-select">
        <div class="fortune-header">
          <h1 style="font-size:28px;margin-bottom:2px;">❄️ 冰 阁</h1>
          <p class="fortune-sub" style="font-size:12px;color:#8ecae6;">— 入门考核 · 未通过 —</p>
        </div>
        <div style="max-width:480px;margin:0 auto;text-align:left;padding:16px;border:1px solid rgba(201,106,90,0.35);border-radius:10px;background:rgba(201,106,90,0.08);font-size:12px;line-height:1.9;color:var(--text);">
          <div style="font-weight:bold;color:#c96a5a;font-size:14px;margin-bottom:6px;">❌ 考核未通过</div>
          <div>你的综合资质评分为 <b>${t.score}</b>（根骨${t.bone} · 悟性${t.wisdom} · 气运${t.luck}${t.rootMatch ? ' · 灵根契合×' + t.rootMatch : ''}）。</div>
          <div style="margin-top:8px;">接引长老摇头叹息：<span style="color:#c96a5a;">「${rejectText}」</span></div>
          <div style="margin-top:8px;color:var(--text-dim);">你站在冰阁山门前，望着那扇缓缓关闭的门扉，心中五味杂陈。也许……再试一次？</div>
        </div>
        <div style="margin-top:16px;display:flex;gap:10px;justify-content:center;flex-wrap:wrap;">
          <button onclick="showFortuneSelection()" class="btn-start" style="font-size:13px;padding:10px 20px;">🔄 重抽天命，再试一次</button>
          <button onclick="showEraSelect()" style="background:transparent;color:var(--text);border:1px solid rgba(255,255,255,0.2);border-radius:6px;padding:8px 16px;font-size:12px;cursor:pointer;">← 放弃拜入</button>
        </div>
      </div>
    `;
  }
  // 清理标记：考核结果已消费
  window._sectLinePending = null;
}

// ── 考核通过 → 正式进游戏（冰阁弟子） ──
function enterSectGame() {
  if (!G.player || !G.player.sect) return;
  G.player.sect.joined = true;
  document.getElementById('welcome').classList.add('hidden');
  document.getElementById('app').classList.remove('hidden');
  
  // 冰阁传承开局——从冰风石窟前开始（信物呼应）
  G.currentScene = 'bingfeng_grotto';
  advanceTime(4);
  
  // 生成场景 NPC
  const startScene = getSceneData(G.currentScene);
  if (typeof npcManager !== 'undefined' && npcManager && startScene) {
    npcManager.ensureNPCsForScene(G.currentScene, startScene);
  }
  
  updateSceneDisplay();
  updateAllUI();
  
  // ── 冰阁开场剧情 ──
  addNarrative(`<div style="border:1px solid rgba(140,202,230,0.4);border-radius:12px;padding:14px;margin:8px 0;background:rgba(40,80,120,0.12);">
    <div style="font-weight:bold;color:#8ecae6;font-size:13px;">❄️ 冰风石窟 · 入门</div>
    <div style="font-size:11px;color:var(--text);margin-top:6px;line-height:1.9;">
      风雪扑面，冰晶在发梢凝结。你握着冰晶信物，站在冰风石窟洞口——如今你是冰阁正式弟子，掌门已准你入窟前参悟先辈道痕。<br>
      「冰阁当立，传承不绝。」锦书上的字迹已被岁月磨得模糊，但笔锋依旧凛冽如初。<br>
      你深吸一口气，将冰晶信物贴近眉心。刹那间，一道清冷的女声与一道沉稳的男声在识海中响起——<br>
      <span style="color:#8ecae6;">「孩子，我们去了仙界，但冰阁的根，要扎在凡尘。」</span><br>
      <span style="color:#7dce9a;">「此窟深处，有我二人的道痕。待你元婴大成，可入内参悟。」</span><br>
      风雪骤停。你抬头，望见青云镇后山的方向——那里，是冰阁的山门，也是你修行的起点。
    </div>
  </div>`, 'milestone');
  
  addNarrative('你正式拜入冰阁「' + lineDescName() + '」，成为冰阁第' + (G._era2DiscipleCount || 1) + '代弟子。', 'event');
  addNarrative(`你选择了冰阁「${G.player.sect.lineName}」道途——${SECT_LINES.find(l => l.id === G.player.sect.line)?.desc || ''}`, 'event');
  
  // 启动资金
  if (!G.player._startGrant) {
    G.player.stones = (G.player.stones || 0) + 500;
    G.player._startGrant = true;
  }
  
  // 初始化日志等
  if (typeof initDailyLog === 'function') { G.dailyLog = []; initDailyLog(); }
  if (typeof G.lifeChronicle === 'undefined') G.lifeChronicle = [];
  if (typeof addDailyLogEntry === 'function') addDailyLogEntry('event', '冰阁入门');
  
  // 立即保存（用第二纪元存档键）
  try {
    const saveKey = getEra2SaveKey();
    const d = JSON.parse(JSON.stringify({
      player: G.player,
      skillData: G.skillData,
      itemData: G.itemData,
      worldData: G.worldData,
      eventData: G.eventData,
      currentScene: G.currentScene,
      turn: G.turn,
      time: G.time,
      narrativeHistory: (G.narrativeHistory || []).slice(-50),
      eventHistory: G.player.eventHistory,
      dailyLog: G.dailyLog || [],
      lifeChronicle: (G.lifeChronicle || []).slice(-100),
    }));
    localStorage.setItem(saveKey, JSON.stringify(d));
  } catch(e) {}
  // 元信息
  if (typeof saveEra2Meta === 'function') saveEra2Meta();
  
  // 启动世界模拟器/时辰
  if (typeof initWorldSimulator === 'function') setTimeout(initWorldSimulator, 500);
  if (typeof updateLastActiveTimestamp === 'function') updateLastActiveTimestamp();
  if (typeof initTimeSystem === 'function') setTimeout(initTimeSystem, 300);
}

function lineDescName() {
  return G.player && G.player.sect ? G.player.sect.lineName : '剑脉';
}

// ── 创建冰阁弟子（覆盖 confirmCharacter 的第二纪元分支） ──
function createEra2Character() {
  // 🔧 2026-08-04 修复：先取出道统选择，再消费掉标记（放最前面防止残留误判）
  const lineId = window._sectLinePending || 'sword';
  window._sectLinePending = null;
  if (!selectedFortune) {
    alert('请先选择天命牌！');
    return;
  }
  const name = document.getElementById('ci-name').value.trim() || '冰阁少主';
  const gender = window._selGender || '男';
  const line = SECT_LINES.find(l => l.id === lineId) || SECT_LINES[0];
  
  // 创建玩家（第二纪元身份）
  G.player = createPlayerFromFortune(selectedFortune, name, { gender, origin: 'shijia' });
  G.player.era2 = true;
  G.player.sect = {
    name: '冰阁',
    line: line.id,
    lineName: line.name,
    founded: false,       // 尚未开派
    merit: 0,             // 门派贡献
    disciples: [],        // 弟子
    level: 1,             // 门派等级
    storyPieces: [],      // 收集的先辈故事碎片
  };
  
  // 道统加成
  const bonus = line.bonus || {};
  if (bonus.attackBonus) G.player.attackBonus = (G.player.attackBonus || 0) + bonus.attackBonus;
  if (bonus.critRate) G.player._extraCritRate = (G.player._extraCritRate || 0) + bonus.critRate;
  if (bonus.wisdomBonus) G.player.wisdom = Math.min(100, (G.player.wisdom || 0) + bonus.wisdomBonus);
  if (bonus.boneBonus) G.player.bone = Math.min(100, (G.player.bone || 0) + bonus.boneBonus);
  if (bonus.hpBonus) G.player.hp = (G.player.hp || 0) + bonus.hpBonus;
  if (bonus.qiBonus) G.player.qi = (G.player.qi || 0) + bonus.qiBonus;
  if (bonus.pillBonus) G.player._pillBonus = (G.player._pillBonus || 0) + bonus.pillBonus;
  if (bonus.defenseBonus) G.player.defenseBonus = (G.player.defenseBonus || 0) + bonus.defenseBonus;
  
  G.skillData = SKILL_DB;
  G.itemData = ITEM_DB;
  G.worldData = typeof WORLD_DATA !== 'undefined' ? WORLD_DATA : null;
  G.eventData = typeof EVENT_TEMPLATES !== 'undefined' ? EVENT_TEMPLATES : null;
  if (typeof initWorldEvents === 'function') initWorldEvents();
  
  // ── 入门考核：资质判定（不再无门槛拜入） ──
  // 🔧 2026-08-04：角色随机生成，资质不一定达标。通过→正式入门；
  //    失败→可重抽天命再试或放弃。考核通过前不创建存档（被拒角色不入列表）
  runSectTrial();
  showSectTrialResult();
}

// ── 第二纪元角色元信息（独立存储） ──
function saveEra2Meta() {
  try {
    const p = G.player;
    if (!p || !p.era2) return;
    const saveKey = getEra2SaveKey();
    const meta = {
      name: p.name,
      realm: getRealmLabel(),
      age: p.age,
      maxAge: p.maxAge,
      stones: p.stones,
      roots: (p.spiritRoots || []).join('、'),
      lastActive: Date.now(),
      saveKey: saveKey,
      isAlive: p.age < p.maxAge,
      fortuneEmoji: '❄️',
      era2: true,
      sectLine: p.sect ? p.sect.lineName : '',
    };
    let savedChars = [];
    const existing = localStorage.getItem('weiwoduxian_char_meta2');
    if (existing) { savedChars = JSON.parse(existing); }
    savedChars = savedChars.filter(c => c.saveKey !== saveKey);
    savedChars.push(meta);
    localStorage.setItem('weiwoduxian_char_meta2', JSON.stringify(savedChars));
  } catch(e) {}
}

// ── 纪元选择界面 ──
function showEraSelect() {
  const container = document.getElementById('welcome');
  if (!container) return;
  container.innerHTML = `
    <div class="welcome-box" style="text-align:center;">
      <h1 style="font-size:34px;margin-bottom:2px;">仙</h1>
      <p class="welcome-sub" style="margin-bottom:16px;">— 选择纪元 —</p>
      <div style="display:flex;flex-direction:column;gap:14px;max-width:420px;margin:0 auto;">
        <div onclick="showCharacterSelect()" style="cursor:pointer;padding:16px;border:1px solid rgba(255,255,255,0.12);border-radius:10px;text-align:left;transition:all .2s;">
          <div style="font-size:16px;font-weight:bold;color:var(--text);">☯️ 第一纪元 · 天命开局</div>
          <div style="font-size:11px;color:var(--text-dim);margin-top:4px;">罗峰与百里冰飞升之前。散修崛起，机缘与命运交织。冰风石窟只是普通的历练之地。</div>
          <div style="font-size:10px;color:var(--accent);margin-top:6px;">→ 查看你的已有角色</div>
        </div>
        <div onclick="showEra2CharacterSelect()" style="cursor:pointer;padding:16px;border:1px solid rgba(140,202,230,0.35);border-radius:10px;text-align:left;background:rgba(40,80,120,0.08);transition:all .2s;">
          <div style="font-size:16px;font-weight:bold;color:#8ecae6;">❄️ 第二纪元 · 冰阁传承</div>
          <div style="font-size:11px;color:var(--text-dim);margin-top:4px;">罗峰与百里冰飞升之后。其子嗣开宗立派——冰阁。冰风石窟化为禁地，元婴后可入内苦修。</div>
          <div style="font-size:10px;color:#8ecae6;margin-top:6px;">→ 查看冰阁弟子</div>
        </div>
      </div>
    </div>
  `;
}

// ── 第二纪元角色选择（独立列表） ──
function showEra2CharacterSelect() {
  const container = document.getElementById('welcome');
  if (!container) return;
  let savedChars = [];
  try {
    const raw = localStorage.getItem('weiwoduxian_char_meta2');
    if (raw) savedChars = JSON.parse(raw);
  } catch(e) {}
  
  // 验证存档存在
  savedChars = savedChars.filter(c => {
    return localStorage.getItem(c.saveKey);
  });
  
  const timeAgo = (ts) => {
    const mins = Math.floor((Date.now() - ts) / 60000);
    if (mins < 1) return '刚刚';
    if (mins < 60) return mins + '分钟前';
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return hrs + '小时前';
    return Math.floor(hrs / 24) + '天前';
  };
  
  let html = `
    <div class="welcome-box char-select-box">
      <h1 style="font-size:34px;margin-bottom:2px;">❄️</h1>
      <p class="welcome-sub" style="margin-bottom:8px;">— 冰阁弟子 —</p>
      <div style="margin:12px 0;"><b style="font-size:14px;">📜 冰阁传承者</b></div>
  `;
  
  if (savedChars.length === 0) {
    html += `<div style="padding:14px;color:var(--text-dim);font-size:12px;text-align:center;">尚无冰阁弟子。<br>继承罗峰与百里冰的衣钵，开宗立派，就在今日。<br><span style="color:#8ecae6;font-size:10px;">※ 拜入冰阁需通过入门考核，资质不达标者会被拒之门外。</span></div>`;
  } else {
    savedChars.forEach((c) => {
      const statusColor = c.isAlive ? 'var(--accent)' : 'var(--danger)';
      const statusText = c.isAlive ? '🟢 在世' : '💀 已陨';
      html += `
        <div class="char-card" onclick="loadCharacterSave('${c.saveKey}')" style="cursor:pointer;">
          <div class="char-card-header">
            <span>❄️ <b>${c.name}</b> <span style="font-size:10px;color:#8ecae6;">${c.sectLine || '冰阁'}</span></span>
            <span style="font-size:12px;color:${statusColor}">${statusText}</span>
          </div>
          <div class="char-card-body">
            <span>${c.realm}</span>
            <span>🕐 ${timeAgo(c.lastActive)}</span>
          </div>
          <div class="char-card-desc">
            灵根${c.roots || '?'} · 灵石${c.stones || 0} · 寿元${Math.floor(c.age||0)}/${c.maxAge||'?'}年
          </div>
        </div>
      `;
    });
  }
  
  html += `
      <div style="margin-top:16px;display:flex;gap:12px;justify-content:center;flex-wrap:wrap;">
        <button onclick="showSectLineSelection()" class="btn-start" style="font-size:14px;padding:10px 20px;">❄️ 创建冰阁弟子</button>
        <button onclick="showEraSelect()" style="background:transparent;color:var(--text);border:1px solid rgba(255,255,255,0.2);border-radius:6px;padding:8px 16px;font-size:12px;cursor:pointer;">← 返回纪元选择</button>
      </div>
    </div>
  `;
  container.innerHTML = html;
}

// ── 冰阁面板（门派信息） ──
function showSectPanel() {
  if (!isSectMember()) {
    showCustomModal('❄️ 冰阁', '<div style="text-align:center;padding:14px;font-size:12px;color:var(--text-dim);">尚未加入冰阁。</div>');
    return;
  }
  const p = G.player;
  const line = getSectLine();
  const sect = p.sect;
  const isFounder = p.era2 && p.sect && !p.sect.founded;
  let html = `<div style="font-size:11px;color:var(--text-dim);margin-bottom:8px;">❄️ 冰阁 · ${line ? line.icon + line.name : ''}</div>`;
  html += `<div style="border:1px solid rgba(140,202,230,0.3);border-radius:8px;padding:10px;margin-bottom:8px;background:rgba(40,80,120,0.08);">
    <div style="font-weight:bold;color:#8ecae6;font-size:12px;">🏔️ 门派：冰阁</div>
    <div style="font-size:10px;color:var(--text-dim);margin-top:4px;">道统：${line ? line.name : '?'} · 等级：${sect.level || 1}</div>
    <div style="font-size:10px;color:var(--text-dim);margin-top:2px;">贡献：${sect.merit || 0} · 弟子：${(sect.disciples || []).length}人</div>
    <div style="font-size:10px;color:var(--text-dim);margin-top:2px;">${sect.founded ? '✅ 冰阁已开派' : '⏳ 尚未开派（需筑基后于驻地立派）'}</div>
  </div>`;
  html += `<div style="font-size:10px;color:var(--text-dim);line-height:1.7;">📖 冰阁渊源：罗峰与百里冰飞升前立下传承之志。「冰阁当立，传承不绝。」</div>`;
  html += `<div style="margin-top:10px;display:flex;gap:8px;justify-content:center;flex-wrap:wrap;">
    <button class="event-choice-btn" onclick="closeEvent();setTimeout(showSectMap,50)" style="font-size:11px;">🏔️ 山门地图</button>
    <button class="event-choice-btn" onclick="closeEvent();setTimeout(showSectPersonnel,50)" style="font-size:11px;">👥 门派人物</button>
    <button class="event-choice-btn" onclick="closeEvent();setTimeout(showSectTasks,50)" style="font-size:11px;">📋 任务发布</button>
    <button class="event-choice-btn" onclick="closeEvent()" style="font-size:11px;">关闭</button>
  </div>`;
  showCustomModal('❄️ 冰阁', html);
}

// ── 冰风石窟 → 冰阁禁地 ──
// 元婴（qiRealmIndex >= 15）后可入禁地苦修
const SECT_FORBIDDEN_REALM = 15; // 元婴初阶

function isForbiddenUnlocked() {
  return isSectMember() && (G.player.qiRealmIndex || 0) >= SECT_FORBIDDEN_REALM;
}

// 禁地交互（挂在冰风石窟 POI）
function sectForbiddenEnter() {
  const p = G.player;
  if (!isSectMember()) {
    addNarrative('你靠近冰风石窟深处，一道无形的结界将你弹开——仿佛有古老的力量守护着这里。', 'system');
    return;
  }
  if (!isForbiddenUnlocked()) {
    const need = QI_REALMS[SECT_FORBIDDEN_REALM] ? QI_REALMS[SECT_FORBIDDEN_REALM].name : '元婴';
    addNarrative(`❄️ 你以冰晶信物触碰结界，结界微微颤动，却未开启。<br>识海中响起百里冰的声音：「孩子，此间道痕凶险，须达<b>${need}</b>方可入内。」`, 'narr-event');
    return;
  }
  // 元婴可入 → 苦修 + 记忆碎片
  showForbiddenSanctum();
}

// 禁地界面（苦修 + 记忆碎片）
function showForbiddenSanctum() {
  const p = G.player;
  const pieces = (p.sect && p.sect.storyPieces) || [];
  let html = `<div style="font-size:11px;color:var(--text-dim);margin-bottom:8px;">❄️ 冰阁禁地 · 先祖道痕</div>`;
  html += `<div style="border:1px solid rgba(140,202,230,0.35);border-radius:8px;padding:12px;background:rgba(40,80,120,0.1);font-size:11px;line-height:1.8;">
    <div style="font-weight:bold;color:#8ecae6;margin-bottom:4px;">🏔️ 洞窟深处 · 道痕长明</div>
    洞壁上的冰晶映着淡淡的蓝光，仿佛有无数光影在流转——那是罗峰与百里冰留下的道痕。此处灵气极为浓郁，却又暗藏寒煞。<br>
    <span style="color:var(--text-dim);font-size:10px;">寒煞侵体，须以火系功法或高深修为抵御。每入一次，可悟道一夜。</span>
  </div>`;
  html += `<div style="margin:10px 0;">
    <button class="event-choice-btn" onclick="forbiddenCultivate()" style="font-size:12px;">🧘 禁地苦修（高倍修为+道心）</button>
  </div>`;
  html += `<div style="font-size:11px;color:#8ecae6;margin-bottom:4px;">📜 先辈记忆碎片（${pieces.length}/6）</div>`;
  if (pieces.length === 0) {
    html += `<div style="font-size:10px;color:var(--text-dim);padding:6px;text-align:center;">尚未收集到任何记忆碎片。<br>在禁地苦修中，或许能窥见先辈的故事……</div>`;
  } else {
    pieces.forEach(pid => {
      const story = SECT_STORIES.find(s => s.id === pid);
      if (story) {
        html += `<div style="border:1px solid rgba(140,202,230,0.2);border-radius:6px;padding:8px;margin:4px 0;font-size:10px;background:rgba(40,80,120,0.06);">
          <b style="color:#8ecae6;">${story.icon} ${story.title}</b>
          <div style="color:var(--text-dim);margin-top:3px;line-height:1.6;">${story.text}</div>
        </div>`;
      }
    });
  }
  html += `<div style="margin-top:8px;"><button class="event-choice-btn" onclick="collectStoryFragment()">🔮 感悟道痕（窥见一段记忆）</button></div>`;
  showCustomModal('❄️ 冰阁禁地', html + '<button class="event-choice-btn" onclick="closeEvent()">关闭</button>');
}

// 禁地苦修
function forbiddenCultivate() {
  const p = G.player;
  if (!isForbiddenUnlocked()) return;
  // 每日一次
  if (p._lastForbiddenDay === G.time.day) {
    addNarrative('你今日已在禁地苦修过，道痕的灵气需要时间恢复。明日再来。', 'system');
    return;
  }
  p._lastForbiddenDay = G.time.day;
  const mult = 3 + Math.floor((p.qiRealmIndex || 0) / 5); // 3~7倍
  const qiGain = Math.round(800 * mult);
  if (typeof gainCultivation === 'function') gainCultivation('qi', qiGain);
  else p.qiCultivationPoints += qiGain;
  // 道心
  if (p.daoHeart !== undefined) p.daoHeart = Math.min(100, p.daoHeart + 2);
  // 寒煞代价
  const dmg = Math.round(p.maxHp * 0.15);
  p.hp = Math.max(1, p.hp - dmg);
  p.mood = Math.min(100, (p.mood || 50) + 5);
  addNarrative(`❄️ 你在禁地道痕间盘膝而坐，寒煞与灵气交织冲刷经脉。一夜苦修，修为+${qiGain}，道心+2。寒气入体，气血-${dmg}。`, 'narr-epic');
  updateAllUI();
}

// 收集记忆碎片
function collectStoryFragment() {
  const p = G.player;
  if (!isForbiddenUnlocked()) return;
  if (!p.sect.storyPieces) p.sect.storyPieces = [];
  // 冷却：每天最多1次
  if (p._lastStoryDay === G.time.day) {
    addNarrative('道痕中的记忆已沉寂，明日再来感悟。', 'system');
    return;
  }
  // 已收集完
  const allIds = SECT_STORIES.map(s => s.id);
  const remaining = allIds.filter(id => !p.sect.storyPieces.includes(id));
  if (remaining.length === 0) {
    addNarrative('你已窥尽先辈的记忆。道痕逐渐暗淡，仿佛使命完成。', 'narr-epic');
    return;
  }
  p._lastStoryDay = G.time.day;
  const nextId = remaining[0];
  p.sect.storyPieces.push(nextId);
  const story = SECT_STORIES.find(s => s.id === nextId);
  addNarrative(`<div style="border:1px solid rgba(140,202,230,0.4);border-radius:10px;padding:12px;margin:8px 0;background:rgba(40,80,120,0.12);">
    <div style="font-weight:bold;color:#8ecae6;font-size:12px;">🔮 记忆碎片 · ${story.icon}${story.title}</div>
    <div style="font-size:11px;color:var(--text);margin-top:6px;line-height:1.9;">${story.text}</div>
    <div style="font-size:10px;color:var(--text-dim);margin-top:4px;">（${p.sect.storyPieces.length}/${SECT_STORIES.length}）</div>
  </div>`, 'milestone');
  // 全部收集完 → 解锁特殊奖励
  if (p.sect.storyPieces.length === SECT_STORIES.length) {
    addNarrative(`<div style="border:1px solid rgba(255,215,130,0.5);border-radius:10px;padding:12px;margin:8px 0;background:rgba(120,90,30,0.12);">
      <div style="font-weight:bold;color:#ffd782;font-size:12px;">🌟 冰阁传承 · 圆满</div>
      <div style="font-size:11px;color:var(--text);margin-top:6px;line-height:1.8;">
        六段记忆尽数窥得，冰风石窟深处的道痕骤然亮起——罗峰与百里冰的虚影在冰晶中浮现，朝你微微颔首。<br>
        「冰阁后继有人。此物，便传于你吧。」<br>
        一枚寒光流转的<b>冰晶传承令</b>落入你手中——冰阁至宝，可号令冰阁一脉。
      </div>
    </div>`, 'milestone');
    p.sect.complete = true;
    // 奖励：冰晶传承令（特殊物品标记）
    if (!p.inventory) p.inventory = [];
    p.inventory.push({ id: 'ice_heirloom', name: '❄️冰晶传承令', qty: 1, type: '信物', desc: '冰阁至宝，罗峰与百里冰的传承信物。' });
  }
  updateAllUI();
}

// ── 先辈故事库 ──
const SECT_STORIES = [
  { id: 's1', icon: '❄️', title: '冰窟初遇', text: '数十年前，冰风石窟深处。一个浑身是伤的散修少年，在极寒中救起了一位被寒毒侵体的白衣女子。他咬破指尖，以血为引，为她驱寒。那女子睁开眼的第一句话是：「你……不怕冷么？」少年咧嘴一笑：「冷，但值得。」' },
  { id: 's2', icon: '🗡️', title: '剑意初成', text: '罗峰在冰窟中闭关百日，悟出一剑。剑出时，万里冰封为之碎裂。百里冰站在洞口，看着他剑气纵横的身影，轻声说：「这一剑，叫什么名字？」罗峰收剑而立，笑道：「还没想好。不如，就叫护你周全。」' },
  { id: 's3', icon: '💞', title: '道侣同心', text: '双修之夜，两人在冰窟深处相对而坐。百里冰以自身寒体为炉，罗峰以剑意为引，阴阳交汇，竟引得洞中冰晶尽数绽放出蓝色莲花。那一刻他们知道——此生道途，不再独行。' },
  { id: 's4', icon: '🌌', title: '飞升之夜', text: '飞升前夜，罗峰与百里冰并肩站在冰风石窟之巅，望着漫天星河。百里冰抚着腹中胎儿，轻声道：「给他留点什么吧。」罗峰沉默良久，在冰壁上刻下四个字——冰阁当立。那一夜，凡尘最后的两位飞升者，将传承留给了尚未出世的孩子。' },
  { id: 's5', icon: '🏔️', title: '冰阁之名', text: '「为何叫冰阁？」曾有故人问。罗峰答：「她名中有冰，我生于山。冰与山，便是家。」多年后，凡尘修士只知冰阁是极北之地的传说，却不知这个名字里，藏着两位飞升者最温柔的私心。' },
  { id: 's6', icon: '✨', title: '传承之志', text: '「修仙者求长生，但我们更想求一个——后继有人。」百里冰在锦书上写道，「若吾儿不愿修仙，便做个逍遥凡人；若他愿立冰阁，则望他记住：道不在高，在坚守；派不在大，在传承。」' },
];

// ── 导出 ──
window.SECT_LINES = SECT_LINES;
window.SECT_STORIES = SECT_STORIES;
window.isEra2 = isEra2;
window.isSectMember = isSectMember;
window.getSectLine = getSectLine;
window.getEra2SaveKey = getEra2SaveKey;
window.showEraSelect = showEraSelect;
window.showEra2CharacterSelect = showEra2CharacterSelect;
window.showSectLineSelection = showSectLineSelection;
window.confirmSectLine = confirmSectLine;
window.createEra2Character = createEra2Character;
window.runSectTrial = runSectTrial;
window.showSectTrialResult = showSectTrialResult;
window.enterSectGame = enterSectGame;
window.saveEra2Meta = saveEra2Meta;
window.showSectPanel = showSectPanel;
window.sectForbiddenEnter = sectForbiddenEnter;
window.showForbiddenSanctum = showForbiddenSanctum;
window.forbiddenCultivate = forbiddenCultivate;
window.collectStoryFragment = collectStoryFragment;
window.isForbiddenUnlocked = isForbiddenUnlocked;
