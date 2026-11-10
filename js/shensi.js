// === 唯我独仙 · 神识系统 ===
// 筑基期解锁（qiRealmIndex >= 9）
// 神识探查：场景内隐藏宝物/奇遇/危险感知
// 神识等级随修为增长，境界越高感知越强

// ── 神识境界映射 ──
function getShensiLevel() {
  const idx = G && G.player ? G.player.qiRealmIndex : 0;
  if (idx >= 18) return { name:'神游太虚', range: '千里之内，纤毫毕现', bonus: 3 };
  if (idx >= 15) return { name:'神游物外', range: '百里之内，风吹草动', bonus: 2.4 };
  if (idx >= 12) return { name:'神识如炬', range: '十丈之内，洞若观火', bonus: 1.8 };
  if (idx >= 9)  return { name:'神识初成', range: '三丈之内，感知入微', bonus: 1.2 };
  return { name:'未开神识', range: '无', bonus: 0 };
}

// ── 每场景神识探查点 ──
const SHENSI_SPOTS = {
  'zz_tianji_city': [
    { id:'ss_tianji_1', name:'万宝楼后巷', desc:'万宝楼后墙的砖缝间似乎塞着什么东西，被禁制掩盖着，寻常目光难以发现。', 
      need: 9, reward: { type:'item', id:'lingmai_jing', qty: 2 }, text:'你以神识扫过，发现砖缝中藏着两枚灵脉结晶！' },
    { id:'ss_tianji_2', name:'天机阁演武场地下', desc:'演武场地下隐隐传来灵气波动，像是埋着什么。', 
      need: 10, reward: { type:'item', id:'zhushen_sui', qty: 1 }, text:'神识探入地下三尺，掘出一块铸神髓！' },
  ],
  'zz_yaoshou_ridge': [
    { id:'ss_yaoshou_1', name:'妖兽巢穴暗格', desc:'妖兽巢穴深处有微弱的宝光，被兽骨掩盖。', 
      need: 9, reward: { type:'item', id:'yaodan_he', qty: 3 }, text:'神识穿透兽骨，发现三枚妖丹核！' },
    { id:'ss_yaoshou_2', name:'断崖下的洞穴', desc:'断崖半腰有个隐蔽洞穴，洞口被藤蔓遮蔽。', 
      need: 11, reward: { type:'item', id:'qinglin_jiao', qty: 2 }, text:'神识锁定洞口，潜入后发现两卷青鳞蛟皮！' },
  ],
  'zz_lingmai_ruins': [
    { id:'ss_lingmai_1', name:'灵脉结晶壁', desc:'洞壁深处灵气浓郁得反常，似乎有整块灵脉结晶嵌在岩层中。', 
      need: 10, reward: { type:'item', id:'lingmai_jing', qty: 5 }, text:'神识探明岩层结构，凿出五枚灵脉结晶！' },
    { id:'ss_lingmai_2', name:'古修洞府暗室', desc:'古修洞府中有一面墙壁回声异常，疑似空腔。', 
      need: 11, reward: { type:'item', id:'zhushen_sui', qty: 2 }, text:'神识识破幻阵，开启暗室，得铸神髓×2！' },
  ],
  'zz_huangji_dian': [
    { id:'ss_huangji_1', name:'古战场埋骨处', desc:'荒寂殿地砖之下，煞气最浓处似有异物。', 
      need: 11, reward: { type:'item', id:'huangji_gu', qty: 3 }, text:'神识拨开煞气，捡起三块荒寂骨！' },
  ],
  'ty_baiyu_palace': [
    { id:'ss_baiyu_1', name:'白玉宫藏书阁夹层', desc:'藏书阁的书架后有暗格，神识能感知到灵气流转。', 
      need: 12, reward: { type:'item', id:'yunhai_lu', qty: 2 }, text:'神识发现夹层暗格，取走两瓶云海露！' },
    { id:'ss_baiyu_2', name:'天道碑底座', desc:'天道碑底座似乎有刻痕，被岁月苔藓覆盖。', 
      need: 14, reward: { type:'item', id:'tiandao_bei', qty: 1 }, text:'神识拂去苔藓，拓下天道碑文一角！' },
  ],
  'ty_leichi': [
    { id:'ss_leichi_1', name:'雷池水底', desc:'雷池水底雷光最盛处，有精铁沉眠。', 
      need: 12, reward: { type:'item', id:'leichi_jingtie', qty: 3 }, text:'神识潜入雷池水底，捞出三块雷池精铁！' },
    { id:'ss_leichi_2', name:'雷池中央雷眼', desc:'雷眼深处有一枚跳动的雷光，像是内丹。', 
      need: 13, reward: { type:'item', id:'leijiao_long', qty: 1 }, text:'神识冒险探入雷眼，夺出一枚雷蛟内丹！' },
  ],
  'ty_yunhai': [
    { id:'ss_yunhai_1', name:'云海浮岛', desc:'云海中一座浮岛上凝结着露珠，灵气逼人。', 
      need: 12, reward: { type:'item', id:'yunhai_lu', qty: 3 }, text:'神识采撷浮岛上的云海露×3！' },
    { id:'ss_yunhai_2', name:'云鲸沉眠处', desc:'云海深处有巨大阴影沉眠，其旁有宝光隐现。', 
      need: 13, reward: { type:'item', id:'yunhai_longjing', qty: 2 }, text:'趁云鲸沉眠，以神识取走两团云鲸脂！' },
  ],
  'ty_tiandao_peak': [
    { id:'ss_tiandao_1', name:'天道峰顶雷云', desc:'峰顶雷云中似有物，被天雷包裹。', 
      need: 14, reward: { type:'item', id:'jiuyang_ling', qty: 1 }, text:'神识冲破雷云，攫取一缕九阳灵髓！' },
  ],
};

// ── 探查（每次消耗灵力，冷却限制）──
function shensiProbe() {
  const p = G.player;
  const sl = getShensiLevel();
  if (sl.bonus <= 0) {
    addNarrative('你的神识尚未开启——突破至筑基期后方可神识外放。', 'system');
    return;
  }
  // 灵力消耗
  const cost = 15;
  if ((p.qi || 0) < cost) {
    addNarrative('灵力不足（需' + cost + '点灵力）——神识探查颇为消耗法力。', 'system');
    return;
  }
  p.qi -= cost;
  
  const spots = SHENSI_SPOTS[G.currentScene] || [];
  if (spots.length === 0) {
    addNarrative('🧠 神识扫过方圆，此间并无异常——' + sl.name + '，一无所获。', 'system');
    return;
  }
  
  // 过滤已发现的 + 等级不足的
  const undiscovered = spots.filter(s => {
    if (p._shensiFound && p._shensiFound.includes(s.id)) return false;
    return true;
  });
  if (undiscovered.length === 0) {
    addNarrative('🧠 神识扫过，此处的秘密已被你尽数洞悉。', 'system');
    return;
  }
  
  // 概率发现（境界越高越容易）
  const canSee = undiscovered.filter(s => s.need <= p.qiRealmIndex);
  const chance = 0.35 + sl.bonus * 0.12;
  if (canSee.length > 0 && Math.random() < chance) {
    // 随机发现一个
    const found = canSee[Math.floor(Math.random() * canSee.length)];
    if (!p._shensiFound) p._shensiFound = [];
    p._shensiFound.push(found.id);
    addNarrative('🧠 神识外放，' + sl.name + '！' + found.desc, 'narr-epic');
    // 发奖励
    if (found.reward.type === 'item') {
      const itemData = (typeof ITEM_DB !== 'undefined' ? ITEM_DB : []).find(i => i.id === found.reward.id);
      if (itemData && typeof addItemToInventory === 'function') addItemToInventory(itemData, found.reward.qty);
      addNarrative('✨ ' + found.text, 'loot');
    }
  } else {
    addNarrative('🧠 神识扫过方圆，一无所获——' + sl.name + '也有看不透的地方。', 'system');
  }
}

// ── 打开神识面板 ──
function showShensiPanel() {
  const sl = getShensiLevel();
  const p = G.player;
  const spots = SHENSI_SPOTS[G.currentScene] || [];
  const foundCount = spots.filter(s => p._shensiFound && p._shensiFound.includes(s.id)).length;
  
  let html = '<div class="event-modal" style="max-width:440px;padding:24px;">';
  html += '<div style="font-size:18px;font-weight:bold;color:var(--accent);margin-bottom:6px;">🧠 神识探查</div>';
  html += '<div style="font-size:11px;color:var(--text-dim);margin-bottom:12px;">'
    + '境界：<b style="color:#8bc34a;">' + sl.name + '</b>（' + sl.range + '）<br>'
    + '当前场景：' + (getSceneData(G.currentScene)?.name || G.currentScene) + ' · 可疑处 ' + foundCount + '/' + spots.length + '</div>';
  
  if (sl.bonus <= 0) {
    html += '<div style="font-size:12px;color:#ff9800;padding:12px;background:rgba(0,0,0,0.2);border-radius:8px;margin-bottom:12px;">🔒 神识未开——突破至筑基期（修为凝聚灵识）后可神识外放，探查天地隐秘。</div>';
  } else {
    html += '<div style="font-size:12px;color:var(--text-dim);padding:12px;background:rgba(0,0,0,0.2);border-radius:8px;margin-bottom:12px;line-height:1.8;">'
      + '以神识扫过此方天地，或可发现被禁制掩藏的宝物、暗格与秘境。每处只可发现一次，境界越高感知越强。<br>'
      + '<span style="color:#c9a96e;">消耗 15 点灵力</span></div>';
    html += '<button class="event-choice-btn" onclick="shensiProbe();renderShensiResult();" style="width:100%;background:rgba(106,158,201,0.25);">🔍 神识探查（-15灵力）</button>';
  }
  
  // 场景线索列表
  if (spots.length > 0) {
    html += '<div style="margin-top:12px;font-size:11px;color:var(--text-dim);">此间气息异常之处：</div>';
    spots.forEach(s => {
      const found = p._shensiFound && p._shensiFound.includes(s.id);
      const tooHigh = s.need > p.qiRealmIndex;
      html += '<div style="display:flex;align-items:center;gap:8px;padding:6px 8px;border-radius:6px;background:rgba(0,0,0,0.12);margin-top:4px;font-size:11px;">'
        + (found ? '<span>✅</span>' : tooHigh ? '<span>🔒</span>' : '<span>❔</span>')
        + '<span style="flex:1;color:' + (found ? 'var(--text-dim)' : tooHigh ? '#666' : 'var(--text)') + ';">' + s.name + '</span>'
        + (found ? '<span style="color:#8bc34a;">已发现</span>' : tooHigh ? '<span style="color:#666;">境界不足</span>' : '<span style="color:#c9a96e;">待探查</span>')
        + '</div>';
    });
  } else {
    html += '<div style="margin-top:12px;font-size:11px;color:var(--text-dim);text-align:center;">此间平平无奇，并无隐藏之物。</div>';
  }
  
  html += '<div style="text-align:center;margin-top:14px;"><button class="event-choice-btn" onclick="closeEvent()" style="background:rgba(100,100,100,0.2);">关闭</button></div>';
  html += '</div>';
  
  const overlay = document.getElementById('event-overlay');
  if (overlay) {
    if (typeof resetModalState === 'function') resetModalState(); // 🔧 接管弹窗队列，防串台
    overlay.style.display = 'flex';
    overlay.innerHTML = html;
  }
}

// 探查后刷新面板（原地重渲染）
function renderShensiResult() {
  if (typeof updateTopbar === 'function') updateTopbar();
  showShensiPanel();
}

// 浏览器导出
if (typeof window !== 'undefined') {
  window.SHENSI_SPOTS = SHENSI_SPOTS;
  window.getShensiLevel = getShensiLevel;
  window.shensiProbe = shensiProbe;
  window.showShensiPanel = showShensiPanel;
}
