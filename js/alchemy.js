// === 唯我独仙 · 炼丹系统 ===
// 收集丹方 → 备齐药材 → 丹炉前控制火候 → 成丹（品质浮动）
// 支持所有突破丹 + 功能丹

// ── 丹方库：材料 → 丹药 ──
const DANFANG_DB = {
  'huiqi_dan': {
    name: '回气丹', desc: '恢复50点灵力',
    ingredients: [
      { id: 'hgc_grass', qty: 2 },
      { id: 'lingquan_shui', qty: 1 },
    ],
    difficulty: 1,        // 难度：决定火候控制难度
    baseSuccess: 0.85,    // 基础成功率
    learnScene: 'qingyun', // 在哪学（青云镇）
    learnNpc: '药店掌柜',
    quality: '凡级',
  },
  'poqi_dan': {
    name: '破气丹', desc: '炼气突破专用',
    ingredients: [
      { id: 'hgc_grass', qty: 3 },
      { id: 'huojing_cao', qty: 1 },
    ],
    difficulty: 2,
    baseSuccess: 0.75,
    learnScene: 'qingyun',
    learnNpc: '药店掌柜',
    quality: '凡级',
  },
  'juli_dan': {
    name: '聚气丹', desc: '修炼+150修为',
    ingredients: [
      { id: 'hgc_grass', qty: 2 },
      { id: 'xuelian', qty: 1 },
      { id: 'lingquan_shui', qty: 1 },
    ],
    difficulty: 3,
    baseSuccess: 0.7,
    learnScene: 'lingyun_peak',
    learnNpc: '采药童子',
    quality: '灵级',
  },
  'podi_dan': {
    name: '破壁丹', desc: '突破成功率+15%',
    ingredients: [
      { id: 'huojing_cao', qty: 2 },
      { id: 'wudao_ye', qty: 1 },
      { id: 'lingquan_shui', qty: 2 },
    ],
    difficulty: 4,
    baseSuccess: 0.65,
    learnScene: 'lingyao_garden',
    learnNpc: '药痴老头',
    quality: '灵级',
  },
  'zhuji_dan': {
    name: '筑基丹', desc: '筑基境突破必备',
    ingredients: [
      { id: 'xuelian', qty: 2 },
      { id: 'qiannian_lingzhi', qty: 1 },
      { id: 'huojing_cao', qty: 1 },
      { id: 'lingquan_shui', qty: 2 },
    ],
    difficulty: 5,
    baseSuccess: 0.6,
    learnScene: 'lingyao_garden',
    learnNpc: '药痴老头',
    quality: '地级',
  },
  'jindan_dan': {
    name: '金丹丹', desc: '金丹境突破必备',
    ingredients: [
      { id: 'qiannian_lingzhi', qty: 2 },
      { id: 'wudao_ye', qty: 1 },
      { id: 'huojing_cao', qty: 2 },
      { id: 'xuelian', qty: 2 },
    ],
    difficulty: 6,
    baseSuccess: 0.55,
    learnScene: 'lingyao_garden',
    learnNpc: '药痴老头',
    quality: '地级',
  },
  'duanti_dan': {
    name: '锻体丹', desc: '炼体突破专用',
    ingredients: [
      { id: 'hgc_grass', qty: 2 },
      { id: 'huojing_cao', qty: 1 },
    ],
    difficulty: 2,
    baseSuccess: 0.78,
    learnScene: 'qingyun',
    learnNpc: '铁匠老吴',
    quality: '凡级',
  },
  'tongpi_dan': {
    name: '铜皮丹', desc: '铜皮境突破必备',
    ingredients: [
      { id: 'huojing_cao', qty: 2 },
      { id: 'xuelian', qty: 1 },
      { id: 'tiegu_cao', qty: 1 },
    ],
    difficulty: 4,
    baseSuccess: 0.65,
    learnScene: 'lingyao_garden',
    learnNpc: '药痴老头',
    quality: '灵级',
  },

  // ── 筑基期（中州域）高阶丹方 ──
  'zhushen_dan': {
    name: '铸神丹', desc: '以铸神髓炼制的神丹，服用可大幅精进修为（筑基期效果尤佳）。',
    ingredients: [
      { id: 'zhushen_sui', qty: 2 },
      { id: 'lingmai_jing', qty: 3 },
      { id: 'qiannian_lingzhi', qty: 1 },
    ],
    difficulty: 7,
    baseSuccess: 0.5,
    learnScene: 'zz_tianji_city',
    learnNpc: '万宝楼掌柜',
    quality: '地级',
    effects: { cultivationPoints: 800 },
  },
  'jiaolong_dan': {
    name: '蛟龙丹', desc: '以青鳞蛟皮与妖丹核炼制的宝丹，服用后气血与灵力大增。',
    ingredients: [
      { id: 'qinglin_jiao', qty: 2 },
      { id: 'yaodan_he', qty: 2 },
      { id: 'xuelian', qty: 2 },
    ],
    difficulty: 7,
    baseSuccess: 0.5,
    learnScene: 'zz_yaoshou_ridge',
    learnNpc: '猎妖修士',
    quality: '地级',
    effects: { hp: 300, qi: 150, cultivationPoints: 400 },
  },
  'huangji_pojing': {
    name: '荒寂破境丹', desc: '以荒寂古魔残魂的煞气炼成的破境丹，冲击金丹时使用可大幅提升成功率。',
    ingredients: [
      { id: 'huangji_gu', qty: 3 },
      { id: 'yaodan_he', qty: 2 },
      { id: 'jindan_dan', qty: 1 },
    ],
    difficulty: 8,
    baseSuccess: 0.4,
    learnScene: 'zz_huangji_dian',
    learnNpc: '古战场拾荒者',
    quality: '天级',
    effects: { breakChance: 0.2 },
  },

  // ── 金丹期（天域）丹方 ──
  'leiquan_dan': {
    name: '雷泉丹', desc: '以雷池精铁淬炼的丹药，服用后修为暴涨，亦能强化雷系功法。',
    ingredients: [
      { id: 'leichi_jingtie', qty: 2 },
      { id: 'lingmai_jing', qty: 3 },
      { id: 'xuelian', qty: 2 },
    ],
    difficulty: 8,
    baseSuccess: 0.45,
    learnScene: 'ty_leichi',
    learnNpc: '雷池边淬体的壮汉',
    quality: '天级',
    effects: { cultivationPoints: 1500, qi: 200 },
  },
  'yunhai_qingxin': {
    name: '云海清心丹', desc: '以云海露炼制的清心丹药，服之心境澄明，悟性大增，参悟天道事半功倍。',
    ingredients: [
      { id: 'yunhai_lu', qty: 2 },
      { id: 'tiandao_bei', qty: 1 },
      { id: 'qiannian_lingzhi', qty: 2 },
    ],
    difficulty: 9,
    baseSuccess: 0.4,
    learnScene: 'ty_yunhai',
    learnNpc: '云海采露人',
    quality: '天级',
    effects: { wisdom: 8, mood: 20, cultivationPoints: 1000 },
  },
  'ningying_dan': {
    name: '凝婴丹', desc: '以雷蛟内丹与九阳灵髓炼制的无上神丹，金丹圆满者服之，碎丹成婴的把握大增。',
    ingredients: [
      { id: 'leijiao_long', qty: 2 },
      { id: 'jiuyang_ling', qty: 2 },
      { id: 'tiandao_bei', qty: 1 },
    ],
    difficulty: 10,
    baseSuccess: 0.3,
    learnScene: 'ty_tiandao_peak',
    learnNpc: '崖边悟道的金丹修士',
    quality: '仙级',
    effects: { breakChance: 0.25 },
  },

  // ── 炼体突破丹方（🔧 2026-08-04：补全——此前只有铜皮丹有丹方，铁骨/银血/金身/玉髓/不灭/涅槃/混沌只能靠掉落，修为满了卡突破）──
  'tiegu_dan': {
    name: '铁骨丹', desc: '铁骨境突破必备，炼骨如钢。',
    ingredients: [
      { id: 'tiegu_cao', qty: 2 },
      { id: 'duanti_dan', qty: 1 },
      { id: 'jingtie_kuang', qty: 2 },
    ],
    difficulty: 5,
    baseSuccess: 0.62,
    learnScene: 'lingyao_garden',
    learnNpc: '药痴老头',
    quality: '灵级',
  },
  'yinxiue_dan': {
    name: '银血丹', desc: '银血境突破必备，换血如汞。',
    ingredients: [
      { id: 'longgu_zhu', qty: 1 },
      { id: 'xuelian', qty: 2 },
      { id: 'lingquan_shui', qty: 3 },
    ],
    difficulty: 6,
    baseSuccess: 0.58,
    learnScene: 'lingyao_garden',
    learnNpc: '药痴老头',
    quality: '灵级',
  },
  'jinshen_dan': {
    name: '金身丹', desc: '金身境突破必备，塑身如金。',
    ingredients: [
      { id: 'qiannian_lingzhi', qty: 1 },
      { id: 'jingtie_kuang', qty: 3 },
      { id: 'huojing_cao', qty: 2 },
    ],
    difficulty: 7,
    baseSuccess: 0.52,
    learnScene: 'lingyao_garden',
    learnNpc: '药痴老头',
    quality: '地级',
  },
  'yusui_dan': {
    name: '玉髓丹', desc: '玉髓境突破必备，炼骨如玉。',
    ingredients: [
      { id: 'shengu_cao', qty: 1 },
      { id: 'qiannian_lingzhi', qty: 2 },
      { id: 'xuelian', qty: 3 },
    ],
    difficulty: 8,
    baseSuccess: 0.45,
    learnScene: 'lingyao_garden',
    learnNpc: '药痴老头',
    quality: '地级',
  },
  'bumie_dan': {
    name: '不灭丹', desc: '不灭体突破必备，重塑肉身。',
    ingredients: [
      { id: 'shengu_cao', qty: 2 },
      { id: 'longgu_zhu', qty: 2 },
      { id: 'tianxin_lian', qty: 1 },
    ],
    difficulty: 9,
    baseSuccess: 0.4,
    learnScene: 'lingyao_garden',
    learnNpc: '药痴老头',
    quality: '地级',
  },
  'niepan_dan': {
    name: '涅槃丹', desc: '涅槃境突破必备，浴火重生。',
    ingredients: [
      { id: 'huojing_cao', qty: 4 },
      { id: 'shengu_cao', qty: 2 },
      { id: 'sanpin_lian', qty: 1 },
    ],
    difficulty: 10,
    baseSuccess: 0.35,
    learnScene: 'lingyao_garden',
    learnNpc: '药痴老头',
    quality: '天级',
  },
  'hundun_dan': {
    name: '混沌丹', desc: '混沌体突破必备，纳万炁归元。',
    ingredients: [
      { id: 'sanpin_lian', qty: 2 },
      { id: 'mingyun_hua', qty: 1 },
      { id: 'shenji_cao', qty: 1 },
    ],
    difficulty: 11,
    baseSuccess: 0.3,
    learnScene: 'lingyao_garden',
    learnNpc: '药痴老头',
    quality: '天级',
  },
};

// ── 玩家已学丹方（存于 p.learnedRecipes）──
function getLearnedRecipes() {
  const p = G.player;
  if (!p.learnedRecipes) p.learnedRecipes = [];
  return p.learnedRecipes;
}

function hasRecipe(recipeId) {
  return getLearnedRecipes().includes(recipeId);
}

function learnRecipe(recipeId) {
  const p = G.player;
  const r = DANFANG_DB[recipeId];
  if (!r) return false;
  if (!p.learnedRecipes) p.learnedRecipes = [];
  if (!p.learnedRecipes.includes(recipeId)) {
    p.learnedRecipes.push(recipeId);
    addNarrative(`📜 你学会了丹方：${r.name}！（${r.ingredients.map(i => (ITEM_DB.find(x => x.id === i.id)?.name || i.id) + '×' + i.qty).join('、')}）`, 'event');
    return true;
  }
  return false;
}

// 尝试学习丹方（NPC传授/奇遇）
function tryLearnRecipe(recipeId, source) {
  const p = G.player;
  if (!p.learnedRecipes) p.learnedRecipes = [];
  if (p.learnedRecipes.includes(recipeId)) return false;
  const r = DANFANG_DB[recipeId];
  if (!r) return false;
  p.learnedRecipes.push(recipeId);
  addNarrative(`<div style="border:1px solid rgba(200,160,100,0.4);border-radius:6px;padding:8px;margin:4px 0;background:rgba(80,60,30,0.1);">
    <div style="font-size:11px;font-weight:bold;color:#d4a045;">📜 习得丹方：${r.name}</div>
    <div style="font-size:10px;color:var(--text-dim);margin-top:2px;">${source || '机缘巧合'} · ${r.ingredients.map(i => (ITEM_DB.find(x => x.id === i.id)?.name || i.id) + '×' + i.qty).join('、')}</div>
  </div>`, 'event');
  return true;
}

// ── 炼丹主界面 ──
function showAlchemyPanel() {
  const p = G.player;
  if (!p) return;
  const learned = getLearnedRecipes();
  const allRecipes = Object.keys(DANFANG_DB).map(id => ({ id, ...DANFANG_DB[id] }));
  
  let html = '<div style="padding:2px;">';
  html += '<div style="font-size:11px;color:var(--text-dim);margin-bottom:8px;">🔥 丹炉前，药香袅袅。以药材为引，以灵火为媒，炼天地之精华为丹。</div>';
  
  if (learned.length === 0) {
    html += '<div style="text-align:center;padding:16px;color:var(--text-dim);font-size:11px;">你尚未习得任何丹方。<br>去找 <b>药店掌柜 / 药农老张 / 丹师柳青</b> 请教吧。</div>';
    html += '<div style="margin-top:8px;font-size:10px;color:var(--text-dim);">📜 可学习的丹方：</div>';
    allRecipes.forEach(r => {
      html += `<div style="border:1px solid rgba(255,255,255,0.08);border-radius:6px;padding:6px 8px;margin:3px 0;font-size:10px;color:var(--text-dim);">
        <span>${r.name}</span>
        <span style="float:right;color:#d4a045;">${r.quality}</span>
        <div style="font-size:9px;margin-top:2px;">材料：${r.ingredients.map(i => (ITEM_DB.find(x => x.id === i.id)?.name || i.id) + '×' + i.qty).join('、')}</div>
        <div style="font-size:9px;color:#8a7a5a;">学自：${r.learnNpc}（${getSceneName2(r.learnScene)}）</div>
      </div>`;
    });
  } else {
    html += '<div style="font-weight:bold;font-size:12px;margin-bottom:6px;">⚗️ 已学丹方（' + learned.length + '）</div>';
    learned.forEach(rid => {
      const r = DANFANG_DB[rid];
      if (!r) return;
      // 检查材料是否够
      const haveAll = r.ingredients.every(ing => {
        const owned = p.inventory.reduce((s, it) => it.id === ing.id ? s + (it.qty || 1) : s, 0);
        return owned >= ing.qty;
      });
      const missingCount = r.ingredients.filter(ing => {
        const owned = p.inventory.reduce((s, it) => it.id === ing.id ? s + (it.qty || 1) : s, 0);
        return owned < ing.qty;
      }).length;
      html += `<div style="border:1px solid ${haveAll ? 'rgba(100,200,150,0.3)' : 'rgba(255,255,255,0.08)'};border-radius:6px;padding:8px;margin:4px 0;background:${haveAll ? 'rgba(40,120,80,0.06)' : 'transparent'};">
        <div style="display:flex;justify-content:space-between;align-items:center;">
          <span style="font-size:12px;font-weight:bold;color:${haveAll ? '#7dce9a' : '#ccc'};">${r.name} <span style="font-size:9px;color:#d4a045;font-weight:normal;">${r.quality}</span></span>
          <span style="font-size:9px;color:var(--text-dim);">成功率 ${Math.round(getAlchemySuccessChance(rid) * 100)}%</span>
        </div>
        <div style="font-size:10px;color:var(--text-dim);margin:3px 0;">${r.desc}</div>
        <div style="font-size:9px;color:${haveAll ? '#7dce9a' : '#e77'};margin-bottom:4px;">
          ${r.ingredients.map(ing => {
            const owned = p.inventory.reduce((s, it) => it.id === ing.id ? s + (it.qty || 1) : s, 0);
            const ok = owned >= ing.qty;
            return `<span style="color:${ok ? '#7dce9a' : '#e77'}">${ITEM_DB.find(x => x.id === ing.id)?.name || ing.id} ${owned}/${ing.qty}</span>`;
          }).join(' ')}
        </div>
        ${haveAll
          ? `<button class="event-choice-btn" onclick="startAlchemy('${rid}')" style="font-size:10px;padding:4px 10px;background:rgba(100,200,150,0.2);border-color:#7dce9a;color:#7dce9a;">🔥 开炉炼丹</button>`
          : `<div style="font-size:9px;color:#e77;">缺 ${missingCount} 种材料</div>`}
      </div>`;
    });
    html += '<div style="margin-top:8px;font-size:10px;color:var(--text-dim);">💡 未学习的丹方，可找对应 NPC 请教。</div>';
  }
  
  html += '</div>';
  showCustomModal('⚗️ 炼丹房', html + '<button class="event-choice-btn" onclick="closeEvent()">离开</button>');
}

function getSceneName2(sceneId) {
  if (typeof getSceneData === 'function') {
    const s = getSceneData(sceneId);
    if (s && s.name) return s.name;
  }
  return sceneId || '未知';
}

// 炼丹成功率（受丹道功法 + 悟性 + 火候影响）
function getAlchemySuccessChance(recipeId) {
  const p = G.player;
  const r = DANFANG_DB[recipeId];
  if (!r) return 0;
  let chance = r.baseSuccess;
  // 丹道功法加成
  if (p.skillSlots && p.skillSlots.dandao) {
    const skill = (typeof SKILL_DB !== 'undefined' ? SKILL_DB : []).find(s => s.id === p.skillSlots.dandao);
    if (skill && skill.mastery) chance += skill.mastery * 0.0005; // 熟练度加成
    // 丹道效果加成：pillQuality（炼丹术）→ 成功率；alchemyBonus（自创丹道）→ 成功率
    if (skill && skill.effects) {
      if (skill.effects.pillQuality) chance += Math.min(0.15, skill.effects.pillQuality * 0.1);
      if (skill.effects.alchemyBonus) chance += skill.effects.alchemyBonus;
    }
  }
  // 悟性加成（50悟性为基准，每10点+2%）
  chance += ((p.wisdom || 50) - 50) / 10 * 0.02;
  // 火候偏差惩罚（-10%~0，由火候控制决定）
  return Math.min(0.95, Math.max(0.1, chance));
}

// ── 火候控制界面（mini游戏）──
function startAlchemy(recipeId) {
  const p = G.player;
  const r = DANFANG_DB[recipeId];
  if (!r) return;
  
  // 🔒 材料校验：不足则不开炉（防止材料扣成负数/免费炼丹）
  for (const ing of r.ingredients) {
    const owned = p.inventory.reduce((s, it) => it.id === ing.id ? s + (it.qty || 1) : s, 0);
    if (owned < ing.qty) {
      const ingName = (typeof ITEM_DB !== 'undefined' && ITEM_DB.find(x => x.id === ing.id)) ? ITEM_DB.find(x => x.id === ing.id).name : ing.id;
      addNarrative(`❌ 材料不足：${ingName} 需要${ing.qty}个，你只有${owned}个。`, 'system');
      return;
    }
  }
  
  // 消耗材料
  for (const ing of r.ingredients) {
    for (let i = 0; i < ing.qty; i++) removeItemFromInventory(ing.id, 1);
  }
  
  // 火候状态
  const target = 50; // 理想火候
  let fire = 50;     // 当前火候
  let stage = 1;     // 阶段1:文火 阶段2:武火 阶段3:收丹
  let timer = null;
  
  // 弹窗
  const html = `
    <div style="padding:4px;">
      <div style="text-align:center;margin-bottom:6px;">
        <div style="font-size:14px;font-weight:bold;color:#d4a045;">🔥 炼制 ${r.name}</div>
        <div style="font-size:10px;color:var(--text-dim);margin-top:2px;">阶段 <span id="alch-stage">一</span> · 控制火候在最佳区间</div>
      </div>
      <div style="background:rgba(0,0,0,0.3);border-radius:8px;padding:12px;margin:8px 0;text-align:center;">
        <div style="font-size:10px;color:var(--text-dim);margin-bottom:4px;">🔥 火候</div>
        <div class="progress-bar-bg" style="height:10px;position:relative;">
          <div id="alch-fire-fill" style="width:50%;height:10px;background:linear-gradient(90deg,#d46a3a,#ff9f43);"></div>
        </div>
        <div style="font-size:10px;color:#ff9f43;margin-top:4px;" id="alch-fire-text">适中</div>
        <div style="font-size:9px;color:var(--text-dim);margin-top:2px;" id="alch-hint">保持火候在金色区间</div>
      </div>
      <div style="display:flex;gap:6px;justify-content:center;margin:6px 0;">
        <button class="event-choice-btn" onclick="alchemyFire(-15)" style="font-size:11px;background:rgba(80,120,200,0.2);border-color:#6a9ec9;color:#8cc;">❄️ 文火</button>
        <button class="event-choice-btn" onclick="alchemyFire(15)" style="font-size:11px;background:rgba(200,80,50,0.2);border-color:#d46a3a;color:#ff9f43;">🔥 武火</button>
      </div>
      <div style="text-align:center;font-size:9px;color:var(--text-dim);">每阶段火候偏离越小，成丹品质越高</div>
    </div>`;
  
  showCustomModal('⚗️ 炼丹', html, { noCloseBtn: true });
  
  // 存储当前炼丹状态
  G._alchemy = { recipeId, fire, target, stage, timer, deviation: 0, phaseDev: [] };
  
  // 阶段切换定时
  const nextStage = () => {
    if (!G._alchemy) return;
    const a = G._alchemy;
    a.phaseDev.push(Math.abs(a.fire - a.target)); // 记录本阶段偏差
    a.stage++;
    a.fire = 50; // 重置火候到中间
    if (a.stage > 3) {
      finishAlchemy();
      return;
    }
    document.getElementById('alch-stage').textContent = ['一','二','三'][a.stage - 1];
    document.getElementById('alch-fire-fill').style.width = '50%';
    document.getElementById('alch-fire-text').textContent = '适中';
    a.timer = setTimeout(nextStage, 5000 + Math.random() * 3000);
  };
  // 启动第一阶段定时器（nextStage 内部会递归调度后续阶段）
  G._alchemy.timer = setTimeout(nextStage, 5000 + Math.random() * 3000);
}

function alchemyFire(delta) {
  if (!G._alchemy) return;
  const a = G._alchemy;
  a.fire = Math.max(0, Math.min(100, a.fire + delta));
  const fill = document.getElementById('alch-fire-fill');
  const text = document.getElementById('alch-fire-text');
  if (fill) fill.style.width = a.fire + '%';
  if (text) {
    const dev = Math.abs(a.fire - a.target);
    text.textContent = dev <= 10 ? '🔥 火候绝佳' : (dev <= 25 ? '火候尚可' : (a.fire > a.target ? '🔥 火太旺了！' : '❄️ 火太弱了！'));
    text.style.color = dev <= 10 ? '#7dce9a' : (dev <= 25 ? '#ff9f43' : '#e77');
  }
  // 阶段偏差也记录（控制越准越好）
  a.deviation = Math.abs(a.fire - a.target);
}

// 炼丹结算
function finishAlchemy() {
  const a = G._alchemy;
  if (!a) return;
  G._alchemy = null;
  const p = G.player;
  const r = DANFANG_DB[a.recipeId];
  if (!r) { closeCustomModal(); return; }
  
  // 三阶段平均偏差
  const avgDev = a.phaseDev.length > 0 ? a.phaseDev.reduce((s, v) => s + v, 0) / a.phaseDev.length : a.deviation;
  // 火候加成：偏差越小成功率越高（最多+15%）
  const fireBonus = Math.max(0, (50 - avgDev) / 50) * 0.15;
  const chance = Math.min(0.95, getAlchemySuccessChance(a.recipeId) + fireBonus);
  
  closeCustomModal();
  
  if (Math.random() < chance) {
    // 品质判定
    let quality = r.quality;
    if (avgDev <= 10) {
      const roll = Math.random();
      if (roll < 0.15) quality = quality === '凡级' ? '灵级' : (quality === '灵级' ? '地级' : '天级'); // 15%品质+1
      else if (roll < 0.2) quality = quality === '凡级' ? '灵级' : (quality === '灵级' ? '地级' : '天级'); // 5%品质+2
    }
    
    const itemData = (typeof ITEM_DB !== 'undefined' ? ITEM_DB : []).find(i => i.id === a.recipeId);
    if (itemData && typeof addItemToInventory === 'function') {
      addItemToInventory(itemData, 1);
    }
    const qColor = quality === '凡级' ? '#8a7a6a' : (quality === '灵级' ? '#6a9ec9' : (quality === '地级' ? '#d46a3a' : '#c9a96e'));
    addNarrative(`<div style="border:1px solid rgba(200,160,100,0.5);border-radius:8px;padding:10px;margin:6px 0;background:rgba(80,60,30,0.12);">
      <div style="font-weight:bold;color:#d4a045;">⚗️ 丹成！${r.name}（${quality}）</div>
      <div style="font-size:11px;color:var(--text-dim);margin-top:4px;">丹炉轻震，药香扑鼻。你揭开炉盖，一枚圆润的丹药静静躺在炉底，丹纹流转。</div>
      <div style="font-size:10px;color:#8cc;">${avgDev <= 10 ? '✨ 火候绝佳，丹成上品！' : (avgDev <= 25 ? '火候尚可，成丹不错。' : '火候略有偏差，勉强成丹。')}</div>
    </div>`, 'loot');
    // 丹道熟练度（炼丹成功 → 丹道功法熟练增长）
    // 🔧 2026-08-04：原来只有空注释，实际不涨熟练度；现在补上（丹脉弟子经 gainSkillMasteryXp 自动×2.5）
    try {
      if (typeof gainSkillMasteryXp === 'function') gainSkillMasteryXp('丹道', 20);
    } catch(e) {}
  } else {
    // 炸炉！
    const boomRoll = Math.random();
    if (boomRoll < 0.3) {
      addNarrative(`<div style="border:1px solid rgba(200,80,80,0.5);border-radius:8px;padding:10px;margin:6px 0;background:rgba(120,30,30,0.12);">
        <div style="font-weight:bold;color:#e77;">💥 炸炉了！</div>
        <div style="font-size:11px;color:var(--text-dim);margin-top:4px;">火候失控，丹炉轰然炸开！你被气浪掀翻在地，灰头土脸。药材化为灰烬……</div>
        <div style="font-size:10px;color:#e77;">⚠️ 材料损失</div>
      </div>`, 'danger');
      // 小概率伤到自己
      if (boomRoll < 0.1 && p.hp) {
        p.hp = Math.max(1, p.hp - Math.round(p.maxHp * 0.1));
        addNarrative('你被炉火灼伤，气血微损。', 'system');
      }
    } else {
      addNarrative(`<div style="border:1px solid rgba(200,120,60,0.4);border-radius:8px;padding:10px;margin:6px 0;background:rgba(100,60,20,0.1);">
        <div style="font-weight:bold;color:#d4a045;">😔 炼丹失败</div>
        <div style="font-size:11px;color:var(--text-dim);margin-top:4px;">药力散尽，丹炉里只剩一摊黑糊。你叹了口气，总结经验再来。</div>
      </div>`, 'system');
    }
  }
  updateAllUI();
}

// 导出
window.DANFANG_DB = DANFANG_DB;
window.showAlchemyPanel = showAlchemyPanel;
window.startAlchemy = startAlchemy;
window.alchemyFire = alchemyFire;
window.finishAlchemy = finishAlchemy;
window.getAlchemySuccessChance = getAlchemySuccessChance;
window.learnRecipe = learnRecipe;
window.tryLearnRecipe = tryLearnRecipe;
window.hasRecipe = hasRecipe;
