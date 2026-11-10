// === 唯我独仙 · 本命法宝系统 ===
// 金丹期解锁（qiRealmIndex >= 12）
// 祭炼 → 温养 → 进阶 → 出战
// 法宝是金丹修士的立身之本：一口本命飞剑/宝印/灵珠/宝镜，随境界一同成长

// ── 法宝类型 ──
const BENMING_TYPES = {
  'feijian': { name:'本命飞剑', icon:'🗡️', desc:'剑修本命，锋芒毕露。攻击大幅提升，攻伐之时剑意纵横。',
    stat: { attack: 30, critRate: 0.03, maxQi: 60 }, growth: { attack: 4, critRate: 0.002, maxQi: 8 }, element:'金' },
  'bao_yin': { name:'山河宝印', icon:'🏔️', desc:'印镇山河，镇压气运。攻守兼备，防御与气血兼修。',
    stat: { attack: 15, defense: 25, maxHp: 100, maxQi: 60 }, growth: { attack: 2, defense: 3, maxHp: 15, maxQi: 8 }, element:'土' },
  'lingzhu': { name:'万灵珠', icon:'🔮', desc:'蕴养万灵，生生不息。灵力雄厚，法术威力与灵力恢复并重。',
    stat: { attack: 20, maxQi: 150, qiRegen: 5 }, growth: { attack: 2.5, maxQi: 20, qiRegen: 0.5 }, element:'水' },
  'baojing': { name:'周天宝镜', icon:'🪞', desc:'映照周天，洞察万物。攻防一体，附加闪避与悟性。',
    stat: { attack: 20, defense: 15, dodge: 0.04, wisdom: 5, maxQi: 60 }, growth: { attack: 3, defense: 2, dodge: 0.004, maxQi: 8 }, element:'雷' },
  'dinglu': { name:'玄黄鼎', icon:'⚱️', desc:'鼎镇乾坤，炼化万物。防御极强，且可增幅炼丹炼器之效。',
    stat: { defense: 35, maxHp: 200, attack: 20, maxQi: 100, alchemyBonus: 0.1 }, growth: { defense: 4, maxHp: 25, attack: 3, maxQi: 12 }, element:'火' },
};

// ── 品阶 ──
const BENMING_RANKS = [
  { name:'凡器',   color:'#9e9e9e', needLevel: 1,  mult: 1.0 },
  { name:'灵器',   color:'#4caf50', needLevel: 10, mult: 1.3 },
  { name:'宝器',   color:'#2196f3', needLevel: 25, mult: 1.7 },
  { name:'仙器',   color:'#9c27b0', needLevel: 45, mult: 2.2 },
  { name:'神器',   color:'#ff9800', needLevel: 70, mult: 3.0 },
];

// ── 进阶所需材料 ──
const BENMING_UPGRADE = {
  // 温养（消耗材料 → 经验）
  nourish: [
    { id:'leichi_jingtie', exp: 30, desc:'以雷池精铁温养，法宝雷光隐隐。' },
    { id:'yunhai_lu',      exp: 28, desc:'以云海露滋养，法宝灵性渐增。' },
    { id:'yunhai_longjing',exp: 35, desc:'以云鲸脂温养，法宝光华内敛。' },
    { id:'jiuyang_ling',   exp: 40, desc:'以九阳灵髓淬炼，法宝至阳至纯。' },
    { id:'zhushen_sui',    exp: 22, desc:'以铸神髓点化，法宝灵识初萌。' },
    { id:'lingmai_jing',   exp: 10, desc:'以灵脉结晶温养，法宝根基渐固。' },
    { id:'tiandao_bei',    exp: 45, desc:'参悟天道碑拓，法宝孕育大道真意。' },
  ],
  // 进阶突破所需（品阶 index → 材料）
  break: {
    1: { name:'灵器', need: [ { id:'leichi_jingtie', qty: 2 }, { id:'zhushen_sui', qty: 2 } ], desc:'灵光初现——法宝产生灵性，需要雷池精铁与铸神髓重塑根基。' },
    2: { name:'宝器', need: [ { id:'leichi_jingtie', qty: 3 }, { id:'yunhai_longjing', qty: 2 }, { id:'jiuyang_ling', qty: 1 } ], desc:'宝光冲霄——以雷池精铁、云鲸脂与九阳灵髓铸就宝器之姿。' },
    3: { name:'仙器', need: [ { id:'leijiao_long', qty: 2 }, { id:'yunhai_lu', qty: 4 }, { id:'jiuyang_ling', qty: 2 } ], desc:'仙韵天成——以雷蛟内丹为引，云海露为媒，九阳灵髓点睛，方成仙器。' },
    4: { name:'神器', need: [ { id:'tiandao_bei', qty: 2 }, { id:'leijiao_long', qty: 3 }, { id:'jiuyang_ling', qty: 3 } ], desc:'神器出世——参悟天道碑文，融合雷蛟内丹与九阳灵髓，法宝脱胎换骨，可斩仙诛魔。' },
  },
};

// ── 初始化（读档兼容）──
function initBenming() {
  if (!G || !G.player) return;
  if (!G.player.benming) {
    G.player.benming = {
      unlocked: false,   // 金丹期后 true
      type: null,        // 类型 id
      name: '',          // 自定义名
      level: 1,          // 1-99
      exp: 0,
      rankIndex: 0,      // 品阶
      nourishCount: 0,   // 累计温养次数
    };
  }
}

// ── 解锁（突破金丹时调用）──
function unlockBenming() {
  initBenming();
  if (!G || !G.player || !G.player.benming) return;
  const bm = G.player.benming;
  if (bm.unlocked) return;
  bm.unlocked = true;
  // 自动获得一件本命法宝雏形（按灵根选）
  const roots = G.player.spiritRoots || ['金'];
  const rootToType = { '金':'feijian', '土':'bao_yin', '水':'lingzhu', '木':'lingzhu', '火':'dinglu', '雷':'baojing' };
  const typeId = rootToType[roots[0]] || 'feijian';
  bm.type = typeId;
  bm.name = BENMING_TYPES[typeId].name;
  if (typeof addNarrative === 'function') addNarrative('✨ 金丹一成，丹田之中灵光凝聚——你的本命「' + bm.name + '」应运而生！从此法宝与你心神相连，可随境界一同成长。', 'narr-epic');
}

// ── 获取法宝属性加成 ──
function getBenmingBonus() {
  if (!G || !G.player) return null;
  initBenming();
  const bm = G.player.benming;
  if (!bm || !bm.unlocked || !bm.type) return null;
  const t = BENMING_TYPES[bm.type];
  const rank = BENMING_RANKS[bm.rankIndex] || BENMING_RANKS[0];
  const lvlMult = 1 + (bm.level - 1) * 0.08;
  const bonus = { attack: 0, defense: 0, maxHp: 0, maxQi: 0, qiRegen: 0, critRate: 0, dodge: 0, wisdom: 0 };
  // 🔧 2026-08-04：品阶攻击倍率——宝器4x/仙器8x/神器16x，高级法宝攻击爆炸
  //    凡器1x → 灵器2x → 宝器4x → 仙器8x → 神器16x（只有攻击吃这个倍率，防御气血不变）
  const rankPower = [1, 2, 4, 8, 16][bm.rankIndex] || 1;
  Object.keys(t.stat).forEach(k => { bonus[k] = Math.round(t.stat[k] * rank.mult * lvlMult); });
  // 成长
  Object.keys(t.growth).forEach(k => {
    bonus[k] += Math.round(t.growth[k] * (bm.level - 1) * rank.mult);
  });
  // 🔧 攻击超大量：攻击额外吃品阶倍率（防御/气血/灵力等不受影响）
  if (bonus.attack) {
    bonus.attack = Math.round(bonus.attack * rankPower);
  }
  bonus._rank = rank.name;
  bonus._rankColor = rank.color;
  bonus._typeName = t.name;
  bonus._icon = t.icon;
  return bonus;
}

// ── 温养（消耗材料 → 经验）──
function nourishBenming() {
  initBenming();
  if (!G || !G.player || !G.player.benming) return;
  const bm = G.player.benming;
  if (!bm.unlocked) { if (typeof addNarrative === 'function') addNarrative('本命法宝需金丹期方可祭炼。', 'system'); return; }
  const inv = G.player.inventory || [];
  const nourishDef = BENMING_UPGRADE.nourish.find(n => inv.some(i => i.id === n.id && i.qty > 0));
  if (!nourishDef) {
    addNarrative('没有可用于温养法宝的材料。雷池精铁、云海露、云鲸脂、九阳灵髓等皆可温养。', 'system');
    return;
  }
  // 消耗
  const item = inv.find(i => i.id === nourishDef.id);
  item.qty -= 1;
  if (item.qty <= 0) {
    const idx = inv.indexOf(item);
    inv.splice(idx, 1);
  }
  bm.exp += nourishDef.exp;
  bm.nourishCount++;
  // 升级
  let leveled = false;
  while (bm.level < 99 && bm.exp >= getBenmingExpNeed(bm.level)) {
    bm.exp -= getBenmingExpNeed(bm.level);
    bm.level++;
    leveled = true;
  }
  const bonus = getBenmingBonus();
  const msg = '🔮 ' + nourishDef.desc + '（法宝经验+' + nourishDef.exp + '）';
  addNarrative(msg, 'loot');
  if (leveled) {
    addNarrative('✨ 本命「' + bm.name + '」等级提升至 Lv.' + bm.level + '！威力大增！', 'narr-epic');
  }
  if (typeof refreshPlayerStats === 'function') refreshPlayerStats();
  if (typeof updateTopbar === 'function') updateTopbar();
  // 🔧 自动模式下不重渲染面板（避免弹窗打断自动流程），手动操作时才刷新
  const isAuto = (G && (G.autoMode || G._autoMode));
  if (!isAuto && typeof renderBenmingPanel === 'function') renderBenmingPanel();
  return { exp: nourishDef.exp, leveled: leveled };
}

// ── 🔧 2026-08-04：一键温养——消耗背包全部温养材料，一次升到最高 ──
function nourishBenmingAll() {
  initBenming();
  if (!G || !G.player || !G.player.benming) return;
  const bm = G.player.benming;
  if (!bm.unlocked) { if (typeof addNarrative === 'function') addNarrative('本命法宝需金丹期方可祭炼。', 'system'); return; }
  const inv = G.player.inventory || [];
  // 收集可用温养材料（按经验从高到低排，先吃好的）
  const usable = [];
  BENMING_UPGRADE.nourish.forEach(function(n) {
    const it = inv.find(i => i.id === n.id && i.qty > 0);
    if (it) usable.push({ item: it, def: n });
  });
  usable.sort(function(a, b) { return b.def.exp - a.def.exp; });
  if (usable.length === 0) {
    addNarrative('没有可用于温养法宝的材料。雷池精铁、云海露、云鲸脂、九阳灵髓等皆可温养。', 'system');
    return;
  }
  let consumed = 0;
  let gainedExp = 0;
  const startLevel = bm.level;
  // 消耗所有材料（先吃经验高的，Lv.99 满级后停止）
  for (let ui = 0; ui < usable.length; ui++) {
    const u = usable[ui];
    while (u.item.qty > 0 && bm.level < 99) {
      u.item.qty -= 1;
      bm.exp += u.def.exp;
      bm.nourishCount++;
      consumed++;
      gainedExp += u.def.exp;
      // 升级
      while (bm.level < 99 && bm.exp >= getBenmingExpNeed(bm.level)) {
        bm.exp -= getBenmingExpNeed(bm.level);
        bm.level++;
      }
    }
    // 清理数量为0的物品
    if (u.item.qty <= 0) {
      const idx = inv.indexOf(u.item);
      if (idx !== -1) inv.splice(idx, 1);
    }
    if (bm.level >= 99) break;
  }
  if (consumed === 0) {
    addNarrative('法宝已满级（Lv.99），无需温养。', 'system');
    return;
  }
  const msg = '🔮 一键温养消耗' + consumed + '份材料，法宝经验+' + gainedExp + '，';
  addNarrative(msg + (bm.level > startLevel ? '等级提升至 Lv.' + bm.level + '！' : '等级未变。'), 'loot');
  if (typeof refreshPlayerStats === 'function') refreshPlayerStats();
  if (typeof updateTopbar === 'function') updateTopbar();
  const isAuto = (G && (G.autoMode || G._autoMode));
  if (!isAuto && typeof renderBenmingPanel === 'function') renderBenmingPanel();
  return { consumed: consumed, gainedExp: gainedExp, leveled: bm.level - startLevel };
}
window.nourishBenmingAll = nourishBenmingAll;

// ── 升级所需经验 ──
// 🔧 2026-08-04：原公式 30+l*8+l²*0.5 到 Lv.25 需 5564 exp（雷池精铁186个），
//    材料又难掉，双重卡死。改为线性 20+l*4：Lv.25 约 1680 exp（雷池精铁56个），
//    配合秒杀掉材料，挂机一天可达成。
function getBenmingExpNeed(level) {
  return Math.floor(20 + level * 4);
}

// ── 品阶进阶 ──
function advanceBenmingRank() {
  initBenming();
  if (!G || !G.player || !G.player.benming) return;
  const bm = G.player.benming;
  if (!bm.unlocked) { if (typeof addNarrative === 'function') addNarrative('本命法宝需金丹期方可祭炼。', 'system'); return; }
  const nextIdx = bm.rankIndex + 1;
  const def = BENMING_UPGRADE.break[nextIdx];
  if (!def) { addNarrative('你的本命法宝已达最高品阶，与天地同辉。', 'system'); return; }
  const nextRank = BENMING_RANKS[nextIdx];
  if (bm.level < nextRank.needLevel) {
    addNarrative('法宝等级不足，需 Lv.' + nextRank.needLevel + ' 方可进阶「' + def.name + '」。', 'system');
    return;
  }
  const inv = G.player.inventory || [];
  // 检查材料
  for (const need of def.need) {
    const item = inv.find(i => i.id === need.id);
    if (!item || item.qty < need.qty) {
      addNarrative('进阶「' + def.name + '」需要 ' + need.qty + ' 份' + (ITEM_DB.find(i=>i.id===need.id)?.name || need.id) + '，材料不足。', 'system');
      return;
    }
  }
  // 消耗
  for (const need of def.need) {
    const item = inv.find(i => i.id === need.id);
    item.qty -= need.qty;
    if (item.qty <= 0) inv.splice(inv.indexOf(item), 1);
  }
  bm.rankIndex = nextIdx;
  addNarrative('🌟 天雷灌顶，宝光冲霄！本命「' + bm.name + '」进阶为【' + def.name + '】！你与法宝的联系更加紧密。', 'narr-epic');
  if (typeof refreshPlayerStats === 'function') refreshPlayerStats();
  if (typeof updateTopbar === 'function') updateTopbar();
  if (typeof renderBenmingPanel === 'function') renderBenmingPanel();
}

// ── 重命名法宝 ──
function renameBenming(newName) {
  initBenming();
  if (!G || !G.player || !G.player.benming) return;
  const bm = G.player.benming;
  if (!bm.unlocked) return;
  if (!newName || newName.trim() === '') { if (typeof addNarrative === 'function') addNarrative('法宝之名不可为空。', 'system'); return; }
  const oldName = bm.name;
  bm.name = newName.trim().slice(0, 12);
  if (typeof addNarrative === 'function') addNarrative('📿 你以心头精血为引，为本命法宝刻下新名——「' + bm.name + '」！' + (oldName !== bm.name ? '（原名「' + oldName + '」）' : ''), 'narr-epic');
  if (typeof renderBenmingPanel === 'function') renderBenmingPanel();
}

// ── 渲染本命法宝面板（独立弹窗）──
function renderBenmingPanel() {
  initBenming();
  if (!G || !G.player || !G.player.benming) return;
  const bm = G.player.benming;
  if (!bm.unlocked) {
    const overlay = document.getElementById('event-overlay');
    if (overlay) {
      if (typeof resetModalState === 'function') resetModalState(); // 🔧 接管弹窗队列，防串台
      overlay.style.display = 'flex';
      overlay.innerHTML = '<div class="event-modal" style="max-width:420px;text-align:center;padding:28px;">'
        + '<div style="font-size:40px;margin-bottom:10px;">🔒</div>'
        + '<div style="font-size:18px;font-weight:bold;color:var(--accent);margin-bottom:8px;">本命法宝</div>'
        + '<div style="font-size:12px;color:var(--text-dim);line-height:1.8;margin-bottom:16px;">金丹一成，法宝自生。<br>这是金丹修士的立身之本——<br>祭炼一口与你心神相连的法宝，随境界一同成长。</div>'
        + '<div style="font-size:11px;color:#ff9800;margin-bottom:16px;">⚡ 突破至金丹期即可解锁</div>'
        + '<button class="event-choice-btn" onclick="closeEvent()">知道了</button>'
        + '</div>';
    }
    return;
  }
  const t = BENMING_TYPES[bm.type];
  const rank = BENMING_RANKS[bm.rankIndex] || BENMING_RANKS[0];
  const bonus = getBenmingBonus();
  const expNeed = getBenmingExpNeed(bm.level);
  const nextBreak = BENMING_UPGRADE.break[bm.rankIndex + 1];
  
  let html = '<div class="event-modal" style="max-width:520px;padding:24px;max-height:80vh;overflow-y:auto;">';
  html += '<div style="display:flex;align-items:center;gap:12px;margin-bottom:14px;">'
    + '<div style="font-size:44px;">' + t.icon + '</div>'
    + '<div style="flex:1;">'
    + '<div style="font-size:18px;font-weight:bold;color:var(--accent);">' + bm.name + '</div>'
    + '<div style="font-size:11px;color:var(--text-dim);">' + t.name + ' · Lv.' + bm.level + '</div>'
    + '<div style="font-size:11px;color:' + rank.color + ';font-weight:bold;margin-top:2px;">【' + rank.name + '】</div>'
    + '</div>'
    + '<div style="text-align:right;font-size:10px;color:var(--text-dim);">'
    + '<div>⚔️ 攻+' + (bonus.attack || 0) + '</div>'
    + '<div>🛡️ 防+' + (bonus.defense || 0) + '</div>'
    + '<div>💚 血+' + (bonus.maxHp || 0) + '</div>'
    + '<div>💧 灵+' + (bonus.maxQi || 0) + '</div>'
    + '</div></div>';
  
  // 经验条
  html += '<div style="margin-bottom:10px;">'
    + '<div style="display:flex;justify-content:space-between;font-size:10px;color:var(--text-dim);margin-bottom:4px;">'
    + '<span>🔮 温养进度</span><span>' + bm.exp + ' / ' + expNeed + '</span></div>'
    + '<div style="height:8px;background:rgba(0,0,0,0.3);border-radius:4px;overflow:hidden;">'
    + '<div style="height:100%;width:' + Math.min(100, bm.exp / expNeed * 100) + '%;background:linear-gradient(90deg,#ff9800,#ff5722);"></div></div></div>';
  
  // 温养按钮
  const nourish = BENMING_UPGRADE.nourish.filter(n => (G.player.inventory||[]).some(i => i.id === n.id && i.qty > 0));
  html += '<div style="margin-bottom:10px;">'
    + '<div style="font-size:11px;font-weight:bold;color:#8bc34a;margin-bottom:6px;">🔮 温养（消耗材料 · 增加经验）</div>'
    + '<div style="display:flex;flex-wrap:wrap;gap:6px;margin-bottom:8px;">'
    + nourish.map(n => { const it = (G.player.inventory||[]).find(i=>i.id===n.id); return '<div style="font-size:9px;background:rgba(0,0,0,0.2);padding:3px 8px;border-radius:4px;color:var(--text-dim);">' + (ITEM_DB.find(i=>i.id===n.id)?.name||n.id) + '×' + (it?it.qty:0) + '</div>'; }).join('')
    + (nourish.length === 0 ? '<div style="font-size:10px;color:#e74c3c;">没有可用的温养材料（雷池精铁/云海露/云鲸脂等）</div>' : '')
    + '</div>'
    + '<button class="event-choice-btn" onclick="nourishBenming()" style="background:rgba(255,152,0,0.2);">温养一次</button>'
    + '<button class="event-choice-btn" onclick="nourishBenmingAll()" style="background:rgba(139,195,74,0.25);margin-left:6px;">⚡ 一键温养全部</button></div>';
  
  // 进阶
  if (nextBreak) {
    const nextRank = BENMING_RANKS[bm.rankIndex + 1];
    const canLevel = bm.level >= nextRank.needLevel;
    const hasMats = nextBreak.need.every(nd => { const it = (G.player.inventory||[]).find(i=>i.id===nd.id); return it && it.qty >= nd.qty; });
    html += '<div style="margin-bottom:10px;padding:10px;border-radius:8px;background:rgba(0,0,0,0.15);">'
      + '<div style="font-size:11px;font-weight:bold;color:' + nextRank.color + ';margin-bottom:6px;">🌟 进阶【' + nextBreak.name + '】</div>'
      + '<div style="font-size:10px;color:var(--text-dim);margin-bottom:6px;">' + nextBreak.desc + '</div>'
      + '<div style="font-size:10px;color:var(--text-dim);margin-bottom:6px;">所需：' + nextBreak.need.map(nd => (ITEM_DB.find(i=>i.id===nd.id)?.name||nd.id) + '×' + nd.qty).join('、') + '（需法宝 Lv.' + nextRank.needLevel + '）</div>'
      + '<button class="event-choice-btn" onclick="advanceBenmingRank()" style="background:rgba(156,39,176,0.25);">' + (canLevel ? '' : '⚡ Lv.' + nextRank.needLevel + ' 解锁 ') + '进阶</button></div>';
  } else {
    html += '<div style="font-size:11px;color:#ff9800;text-align:center;margin:10px 0;">🏆 法宝已达最高品阶，与天地同辉</div>';
  }
  
  // 重命名
  html += '<div style="margin-bottom:10px;display:flex;gap:6px;align-items:center;">'
    + '<input id="benming-new-name" value="' + bm.name + '" style="flex:1;background:rgba(0,0,0,0.3);border:1px solid rgba(255,255,255,0.15);color:var(--text);border-radius:6px;padding:6px 10px;font-size:12px;" maxlength="12">'
    + '<button class="event-choice-btn" onclick="renameBenming(document.getElementById(\'benming-new-name\').value)">刻名</button></div>';
  
  html += '<div style="text-align:center;margin-top:8px;"><button class="event-choice-btn" onclick="closeEvent()" style="background:rgba(100,100,100,0.2);">关闭</button></div>';
  html += '</div>';
  
  const overlay = document.getElementById('event-overlay');
  if (overlay) {
    if (typeof resetModalState === 'function') resetModalState(); // 🔧 接管弹窗队列，防串台
    overlay.style.display = 'flex';
    overlay.innerHTML = html;
  }
}

// ── 从任意入口打开面板 ──
function openBenmingPanel() {
  initBenming();
  if (!G || !G.player || !G.player.benming) return;
  // 未解锁也展示说明
  renderBenmingPanel();
}

// 浏览器导出
if (typeof window !== 'undefined') {
  window.BENMING_TYPES = BENMING_TYPES;
  window.BENMING_RANKS = BENMING_RANKS;
  window.BENMING_UPGRADE = BENMING_UPGRADE;
  window.initBenming = initBenming;
  window.unlockBenming = unlockBenming;
  window.getBenmingBonus = getBenmingBonus;
  window.nourishBenming = nourishBenming;
  window.advanceBenmingRank = advanceBenmingRank;
  window.renameBenming = renameBenming;
  window.renderBenmingPanel = renderBenmingPanel;
  window.openBenmingPanel = openBenmingPanel;
  window.getBenmingExpNeed = getBenmingExpNeed;
}
