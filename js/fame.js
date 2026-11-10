// === 唯我独仙 · 名声系统 ===
// 让世界"看见"你。杀妖、助人、炼丹、炼器、突破都会积累名声。
// 名声等级影响：NPC态度、坊市折扣、隐藏事件、天地异象、NPC谈论你

// ── 名声等级 ──
const FAME_LEVELS = [
  { min: 0,    name: '无名之辈', desc: '江湖上还没有人知道你的名字。', color: '#9a9a9a', discount: 0,   respect: 0 },
  { min: 100,  name: '小有名气', desc: '青云镇的人开始知道你的名字了。', color: '#4caf50', discount: 0.03, respect: 1 },
  { min: 300,  name: '声名鹊起', desc: '你的名字在修士间流传，有人开始打听你。', color: '#2196f3', discount: 0.06, respect: 2 },
  { min: 800,  name: '名动一方', desc: '一方豪杰，连坊市掌柜见你都客气三分。', color: '#9c27b0', discount: 0.1, respect: 3 },
  { min: 2000, name: '威震天下', desc: '天下谁人不识君。你的事迹被编成歌谣传唱。', color: '#ff9800', discount: 0.15, respect: 4 },
  { min: 5000, name: '传说在世', desc: '你已成为活着的传说，万人敬仰。', color: '#e74c3c', discount: 0.2, respect: 5 },
];

function getFameLevel() {
  const f = G.player.fame || 0;
  let level = FAME_LEVELS[0];
  for (const l of FAME_LEVELS) {
    if (f >= l.min) level = l;
  }
  return level;
}

// ── 名声变更 ──
function changeFame(delta, reason) {
  const p = G.player;
  if (!p) return;
  if (p.fame === undefined) p.fame = 0;
  const oldLevel = getFameLevel();
  p.fame = Math.max(0, p.fame + delta);
  const newLevel = getFameLevel();
  
  if (delta > 0 && Math.random() < 0.5) {
    addNarrative(`<span style="border-left:3px solid #ffd700;padding:4px 8px;display:block;font-size:11px;color:#e8c88a;">🌟 名声 +${delta}（${reason}）</span>`, 'fame');
  }
  
  // 等级提升 → 世界开始谈论你
  if (oldLevel.name !== newLevel.name) {
    const reactions = [
      `「你听说了吗？最近有个叫${p.name}的修士，${getFameDeed(p)}」`,
      `「${p.name}？哦——就是那个${newLevel.name}的家伙！」`,
      `「啧啧，${p.name}这名字，现在传得可远了。」`,
      `「若有机会，真想结识一下这位${p.name}道友。」`,
    ];
    addNarrative(`<div style="border:1px solid ${newLevel.color};border-radius:8px;padding:10px;margin:6px 0;background:rgba(0,0,0,0.25);">
      <div style="font-weight:bold;color:${newLevel.color};">🌟 名声大噪：${newLevel.name}！</div>
      <div style="font-size:11px;color:var(--text-dim);margin-top:4px;">${newLevel.desc}</div>
      <div style="font-size:10px;color:#e8c88a;margin-top:4px;border-top:1px dashed rgba(255,255,255,0.15);padding-top:4px;">🗣️ ${reactions[Math.floor(Math.random() * reactions.length)]}</div>
    </div>`, 'milestone');
  }
}

function getFameDeed(p) {
  const qi = p.qiRealmIndex || 0;
  if (qi >= 18) return '听说已踏入化神之境，堪称当世神话';
  if (qi >= 15) return '听说已凝结元婴，纵横一方';
  if (qi >= 12) return '据说金丹已成，是百年不遇的奇才';
  if (qi >= 9) return '刚结成道基，前途不可限量';
  if (qi >= 3) return '练气有成，正在崛起';
  return '刚踏入修行路';
}

// ── 战斗胜利加名声（精英/BOSS多）──
function fameOnKill(isBoss, isElite, monsterName) {
  let delta = 1;
  if (isElite) delta = 8;
  if (isBoss) delta = 25;
  changeFame(delta, '击败' + (monsterName || '强敌'));
}

// ── 任务完成加名声 ──
function fameOnQuest(quest) {
  const r = quest.rewards || {};
  let delta = 5;
  if (r.stones >= 100) delta = 12;
  if (r.stones >= 300) delta = 25;
  changeFame(delta, '完成' + quest.name);
}

// ── 突破大境界 → 天地异象 + 名声暴涨 ──
function fameOnBreakthrough(realmName) {
  const p = G.player;
  const qi = p.qiRealmIndex || 0;
  // 大境界突破才有异象
  const majorRealms = { 3: '筑基', 6: '金丹', 9: '元婴', 12: '化神', 15: '大乘', 18: '渡劫', 21: '飞升' };
  // QI_REALMS index: 练气0-8, 筑基9-11, 金丹12-14, 元婴15-17, 化神18-20, 大乘21, 渡劫22...
  const majorMap = { 9: '筑基', 12: '金丹', 15: '元婴', 18: '化神', 21: '大乘', 22: '渡劫', 23: '飞升' };
  if (majorMap[qi]) {
    const name = majorMap[qi];
    changeFame(50, name + '突破');
    addNarrative(`<div style="border:1px solid #ffd700;border-radius:10px;padding:12px;margin:8px 0;background:linear-gradient(135deg,rgba(80,60,20,0.2),rgba(120,90,30,0.1));text-align:center;">
      <div style="font-size:15px;font-weight:bold;color:#ffd700;letter-spacing:3px;">☀️ 天地异象 · ${name}大圆满</div>
      <div style="font-size:11px;color:var(--text-dim);margin-top:5px;line-height:1.8;">${getBreakthroughOmen(name, p)}</div>
      <div style="font-size:10px;color:#e8c88a;margin-top:5px;">🗣️ 「青云镇方向天光乍现！这是……有人${name}了？！」</div>
    </div>`, 'milestone');
  }
}

function getBreakthroughOmen(name, p) {
  const omens = {
    '筑基': '天边紫气东来三千里，云海翻涌如龙，镇上的老修士仰头望天，久久无言。',
    '金丹': '一道金光冲天而起，方圆百里的妖兽伏地颤抖，草木都朝着那方向微微弯腰。',
    '元婴': '九霄雷云汇聚又散开，隐约有仙乐从云端飘下。凡人们跪地祈福，以为是仙人显灵。',
    '化神': '整个天地忽然安静了一瞬——风声、虫鸣、流水，都在那一刻静止，像是天道也在凝视。',
    '大乘': '日月同辉，天降甘霖。枯木逢春，万花齐放。这一日，被后人记入史册。',
    '渡劫': '墨云压城，雷光如龙蛇乱舞。所有人都知道——有人在渡天劫，成则飞升，败则道消。',
    '飞升': '天门洞开，金光万道。仙人踏云而来，凡间跪拜如潮。这一日，你超脱凡尘。',
  };
  return omens[name] || '天地为之变色。';
}

// ── 名声带来的折扣（坊市/黑市）──
function getFameDiscount() {
  return getFameLevel().discount || 0;
}

// ── NPC 态度：根据名声生成打招呼语 ──
function getFameGreeting() {
  const lvl = getFameLevel();
  const p = G.player;
  if (lvl.respect <= 0) return null;
  const greetings = [
    `（${lvl.respect >= 3 ? '眼中带着敬意' : '上下打量了你一眼'}）这位就是${p.name}道友？久仰久仰。`,
    `「哦！${p.name}！你的事迹我可听说了。」`,
    `「${p.name}道友，今日怎么有空来我这？」`,
    `（态度明显比往日恭敬）${p.name}大人，里边请。`,
  ];
  return greetings[Math.floor(Math.random() * greetings.length)];
}

// ── 名声面板 ──
function showFamePanel() {
  const p = G.player;
  if (!p) return;
  if (p.fame === undefined) p.fame = 0;
  const lvl = getFameLevel();
  const f = p.fame;
  
  // 当前等级进度
  const cur = FAME_LEVELS.findIndex(l => l.name === lvl.name);
  const next = FAME_LEVELS[cur + 1];
  const curMin = FAME_LEVELS[cur].min;
  const pct = next ? Math.round((f - curMin) / (next.min - curMin) * 100) : 100;
  
  let html = '<div style="padding:2px;">';
  html += `<div style="text-align:center;margin-bottom:10px;">
    <div style="font-size:16px;font-weight:bold;color:${lvl.color};letter-spacing:2px;">${lvl.name}</div>
    <div style="font-size:10px;color:var(--text-dim);margin-top:3px;">${lvl.desc}</div>
  </div>`;
  html += `<div style="display:flex;align-items:center;gap:4px;font-size:9px;color:var(--text-dim);">
    <span>${lvl.name}</span>
    <div class="progress-bar-bg" style="height:8px;flex:1;"><div class="progress-bar-fill" style="width:${pct}%;height:8px;background:linear-gradient(90deg,#e8c88a,#ffd700);"></div></div>
    <span>${next ? '下一级：' + next.name : '已臻化境'}</span>
  </div>`;
  html += `<div style="font-size:9px;color:var(--text-dim);margin-top:2px;text-align:center;">${f}/${next ? next.min : f}</div>`;
  
  html += '<div style="font-size:10px;color:var(--text-dim);margin:10px 0;">当前名声带来的好处：</div>';
  html += `<div style="font-size:11px;line-height:1.9;">
    <div>💰 坊市折扣：${lvl.discount > 0 ? '<span style="color:#4caf50;">-' + Math.round(lvl.discount * 100) + '%</span>' : '无'}</div>
    <div>🗣️ NPC态度：${lvl.respect > 0 ? '<span style="color:#e8c88a;">受人尊敬（打招呼不一样了）</span>' : '平平淡淡'}</div>
    <div>🔓 隐藏事件：${lvl.respect >= 2 ? '<span style="color:#4caf50;">解锁部分隐藏事件</span>' : '未解锁'}</div>
  </div>`;
  
  html += '<div style="font-size:10px;color:var(--text-dim);margin-top:10px;border-top:1px solid rgba(255,255,255,0.1);padding-top:6px;">💡 杀妖、助人、炼丹、炼器、突破都会积累名声。大境界突破会引发天地异象。</div>';
  html += '</div>';
  showCustomModal('🌟 名声', html + '<button class="event-choice-btn" onclick="closeEvent()">关闭</button>');
}

// 导出
window.FAME_LEVELS = FAME_LEVELS;
window.getFameLevel = getFameLevel;
window.changeFame = changeFame;
window.fameOnKill = fameOnKill;
window.fameOnQuest = fameOnQuest;
window.fameOnBreakthrough = fameOnBreakthrough;
window.getFameDiscount = getFameDiscount;
window.getFameGreeting = getFameGreeting;
window.showFamePanel = showFamePanel;
