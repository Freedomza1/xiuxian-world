// === 唯我独仙 · 时令季节系统 ===
// 让世界"过日子"。季节带来真实玩法差异 + 节日事件 + 季节感知

// ── 季节推算：一年360天，每季90天 ──
function getSeason() {
  const day = (G.time.day || 1) % 360;
  if (G.time.season) return G.time.season;
  if (day < 90) return '春';
  if (day < 180) return '夏';
  if (day < 270) return '秋';
  return '冬';
}

// 季节描述
const SEASON_INFO = {
  '春': {
    icon: '🌸', name: '春', desc: '万物复苏，灵草疯长。天地间生机勃发。',
    effect: '灵草采集概率+50%，心境恢复+20%',
    color: '#7dce9a',
  },
  '夏': {
    icon: '☀️', name: '夏', desc: '烈日炎炎，火灵气旺盛。',
    effect: '火系功法威力+15%，灵力恢复+20%',
    color: '#ff9f43',
  },
  '秋': {
    icon: '🍂', name: '秋', desc: '天高气爽，万物成熟。',
    effect: '战斗掉落+20%，灵兽成长+25%',
    color: '#e8c88a',
  },
  '冬': {
    icon: '❄️', name: '冬', desc: '天寒地冻，万物闭藏。',
    effect: '修炼效率-15%，但悟道触发+30%，心境沉淀',
    color: '#8cc',
  },
};

// ── 季节修正器 ──
function getSeasonMod() {
  const s = getSeason();
  return {
    season: s,
    herbChance: s === '春' ? 0.5 : 0,        // 灵草概率+
    firePower: s === '夏' ? 0.15 : 0,         // 火系+
    lootMult: s === '秋' ? 1.2 : 1.0,         // 掉落+
    beastGrowth: s === '秋' ? 1.25 : 1.0,     // 灵兽成长+
    cultSpeed: s === '冬' ? 0.85 : 1.0,       // 修炼-
    enlightenChance: s === '冬' ? 1.3 : 1.0,  // 悟道+
    qiRegen: s === '夏' ? 1.2 : 1.0,          // 灵力恢复+
    moodRegen: s === '春' ? 1.2 : 1.0,        // 心境恢复+
  };
}

// ── 节日系统：一年中的特殊日子 ──
const FESTIVALS = [
  { day: 1,   name: '元旦', desc: '新岁伊始，万象更新。青云镇家家户户挂起红灯笼，爆竹声此起彼伏。', effect: '今日首次修炼额外+50修为' },
  { day: 15,  name: '上元节', desc: '正月十五，灯月交辉。镇上灯火通明，河灯顺流而下，带着人们的心愿。', effect: '今日气运+5，探索奇遇率提升' },
  { day: 45,  name: '花朝节', desc: '百花生辰，踏青赏花。灵药园的药草们仿佛也在庆祝，香气格外浓郁。', effect: '今日灵草采集必出额外材料' },
  { day: 105, name: '端午', desc: '五月初五，艾草飘香。传说此日毒虫尽出，但也是淬炼体魄的好时机。', effect: '今日炼体效率+50%' },
  { day: 195, name: '中秋', desc: '八月十五，月圆人圆。月华如练，正是悟道的好时辰。', effect: '今日悟道触发概率翻倍，月华凝露' },
  { day: 285, name: '重阳', desc: '九月初九，登高望远。山巅灵气涌动，登高者心旷神怡。', effect: '今日登高类场景探索奖励翻倍' },
  { day: 345, name: '除夕', desc: '岁末之夜，万家灯火。传说此夜天道最宽容，突破成功率大增。', effect: '今日突破成功率+20%' },
];

function getTodayFestival() {
  const day = (G.time.day || 1) % 360;
  return FESTIVALS.find(f => f.day === day) || null;
}

// 检查今日节日（进入场景/每日更新时调用）
function checkFestival() {
  const f = getTodayFestival();
  if (!f) return null;
  // 只提示一次（每日）
  const key = 'festival_' + (G.time.day || 1);
  if (G.player.questFlags && G.player.questFlags[key]) return f;
  if (!G.player.questFlags) G.player.questFlags = {};
  G.player.questFlags[key] = true;
  
  addNarrative(`<div style="border:1px solid #ffd700;border-radius:10px;padding:12px;margin:8px 0;background:linear-gradient(135deg,rgba(120,80,20,0.2),rgba(80,60,20,0.1));">
    <div style="font-size:14px;font-weight:bold;color:#ffd700;text-align:center;letter-spacing:2px;">🎊 ${f.name}</div>
    <div style="font-size:11px;color:var(--text-dim);margin-top:5px;text-align:center;line-height:1.8;">${f.desc}</div>
    <div style="font-size:10px;color:#e8c88a;margin-top:5px;text-align:center;">✨ ${f.effect}</div>
  </div>`, 'milestone');
  return f;
}

// ── 节日效果修正器 ──
function getFestivalMod() {
  const f = getTodayFestival();
  if (!f) return null;
  const mod = {};
  if (f.day === 1) mod.cultBonus = 50;
  if (f.day === 15) { mod.luck = 5; mod.lootMult = 1.3; }
  if (f.day === 45) mod.herbBonus = 1.0;
  if (f.day === 105) mod.bodyCult = 1.5;
  if (f.day === 195) mod.enlightenMult = 2.0;
  if (f.day === 285) mod.exploreMult = 2.0;
  if (f.day === 345) mod.breakChance = 0.2;
  return mod;
}

// ── 季节感知：场景进入时附带季节描写 ──
function getSeasonFlavor() {
  const s = getSeason();
  const day = (G.time.day || 1) % 360;
  const hour = G.time.hour || 8;
  
  const flavors = {
    '春': [
      `山间春意正浓，嫩绿的草芽从石缝里钻出来，溪水叮咚，仿佛整个世界都在苏醒。`,
      `春风拂面，带着泥土和青草的气息。远处的桃花开得正盛，粉云一般。`,
      `一场春雨刚歇，空气清新得能拧出水来。林间的鸟鸣格外清脆。`,
    ],
    '夏': [
      `盛夏的午后，蝉鸣阵阵，阳光透过浓密的树冠洒下斑驳的光影。`,
      `暑气蒸腾，连风都是热的。湖边的荷叶亭亭如盖，荷花清香四溢。`,
      `傍晚的雷雨来得快去得也快，雨后的空气凉爽宜人，天边还挂着彩虹。`,
    ],
    '秋': [
      `秋风送爽，落叶铺满小径，踩上去沙沙作响。天高云淡，视野格外开阔。`,
      `秋天的田野一片金黄，果实累累。空气中飘着丰收的甜香。`,
      `夕阳西下时，漫山遍野的枫叶如火如霞，美得让人屏息。`,
    ],
    '冬': [
      `朔风凛冽，天地间一片苍茫。呵出的气在面前凝成白雾。`,
      `昨夜落了一场大雪，万物都盖上了厚厚的雪被，安静得不真实。`,
      `冬日暖阳难得，阳光照在雪地上，晃得人睁不开眼。树枝上的冰凌晶莹剔透。`,
    ],
  };
  return flavors[s][Math.floor(Math.random() * flavors[s].length)];
}

// ── 季节面板 ──
function showSeasonPanel() {
  const s = getSeason();
  const info = SEASON_INFO[s];
  const fest = getTodayFestival();
  const sm = getSeasonMod();
  
  let html = '<div style="padding:2px;">';
  html += `<div style="text-align:center;margin-bottom:10px;">
    <div style="font-size:22px;">${info.icon}</div>
    <div style="font-size:16px;font-weight:bold;color:${info.color};letter-spacing:2px;">${info.name}季</div>
    <div style="font-size:10px;color:var(--text-dim);margin-top:3px;">${info.desc}</div>
  </div>`;
  
  html += '<div style="font-size:10px;color:var(--text-dim);margin:6px 0;">当前季节效果：</div>';
  html += `<div style="font-size:11px;line-height:1.9;color:var(--text);">
    <div>🌸 灵草采集：${sm.herbChance > 0 ? '<span style="color:#7dce9a;">+' + Math.round(sm.herbChance * 100) + '%</span>' : '正常'}</div>
    <div>🔥 火系威力：${sm.firePower > 0 ? '<span style="color:#ff9f43;">+' + Math.round(sm.firePower * 100) + '%</span>' : '正常'}</div>
    <div>📦 战斗掉落：${sm.lootMult > 1 ? '<span style="color:#e8c88a;">+' + Math.round((sm.lootMult - 1) * 100) + '%</span>' : '正常'}</div>
    <div>🐾 灵兽成长：${sm.beastGrowth > 1 ? '<span style="color:#7dce9a;">+' + Math.round((sm.beastGrowth - 1) * 100) + '%</span>' : '正常'}</div>
    <div>🧘 修炼效率：${sm.cultSpeed < 1 ? '<span style="color:#8cc;">' + Math.round(sm.cultSpeed * 100) + '%（天寒宜藏）</span>' : '正常'}</div>
    <div>🌌 悟道触发：${sm.enlightenChance > 1 ? '<span style="color:#8cc;">+' + Math.round((sm.enlightenChance - 1) * 100) + '%</span>' : '正常'}</div>
  </div>`;
  
  if (fest) {
    html += `<div style="border:1px solid #ffd700;border-radius:8px;padding:8px;margin:10px 0;background:rgba(120,80,20,0.1);">
      <div style="font-weight:bold;color:#ffd700;">🎊 今日：${fest.name}</div>
      <div style="font-size:10px;color:var(--text-dim);margin-top:3px;">${fest.desc}</div>
      <div style="font-size:10px;color:#e8c88a;margin-top:3px;">✨ ${fest.effect}</div>
    </div>`;
  } else {
    // 下一个节日
    const day = (G.time.day || 1) % 360;
    let next = FESTIVALS.find(f => f.day > day) || FESTIVALS[0];
    const daysLeft = next.day >= day ? next.day - day : 360 - day + next.day;
    html += `<div style="font-size:10px;color:var(--text-dim);margin-top:8px;">📅 距下个节日「${next.name}」还有 ${daysLeft} 天</div>`;
  }
  
  html += '</div>';
  showCustomModal('🍂 时令', html + '<button class="event-choice-btn" onclick="closeEvent()">关闭</button>');
}

// 导出
window.getSeason = getSeason;
window.getSeasonMod = getSeasonMod;
window.getTodayFestival = getTodayFestival;
window.checkFestival = checkFestival;
window.getFestivalMod = getFestivalMod;
window.getSeasonFlavor = getSeasonFlavor;
window.showSeasonPanel = showSeasonPanel;
