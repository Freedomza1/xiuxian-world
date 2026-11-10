// === 唯我独仙 · 炼器锻造系统 ===
// 采集矿石/灵材 → 炼器炉 → 锻造法器（品质随机浮动）
// 与炼丹并列的第二大生活职业

// ── 炼器配方库：材料 → 装备 ──
const FORGE_RECIPES = {
  'tiexiu_jian': {  // 锈铁剑（新手）
    name: '锈铁剑', desc: '精铁百锻的入门长剑',
    ingredients: [ { id: 'kuang_shi', qty: 3 } ],  // 矿石（通用矿材）
    difficulty: 1, baseSuccess: 0.9,
    resultQuality: ['凡品', '凡品', '凡品', '灵品'], // 品质池
    learnScene: 'qingyun', learnNpc: '铁匠老吴',
  },
  'qingfeng_jian': {
    name: '清风剑', desc: '轻灵锋利，削铁如泥',
    ingredients: [ { id: 'kuang_shi', qty: 4 }, { id: 'tiegu_cao', qty: 1 } ],
    difficulty: 2, baseSuccess: 0.8,
    resultQuality: ['凡品', '凡品', '灵品', '灵品'],
    learnScene: 'qingyun', learnNpc: '铁匠老吴',
  },
  'tiegu_dao': {
    name: '铁骨刀', desc: '精铁百锻的厚背砍刀',
    ingredients: [ { id: 'kuang_shi', qty: 5 }, { id: 'tiegu_cao', qty: 2 } ],
    difficulty: 3, baseSuccess: 0.75,
    resultQuality: ['凡品', '灵品', '灵品', '地品'],
    learnScene: 'xuantie_mine', learnNpc: '矿工头',
  },
  'hanbing_jian': {
    name: '寒冰剑', desc: '寒铁铸就，寒气逼人',
    ingredients: [ { id: 'xuantie_jingcui', qty: 2 }, { id: 'lingquan_shui', qty: 2 } ],
    difficulty: 4, baseSuccess: 0.7,
    resultQuality: ['灵品', '灵品', '地品', '地品'],
    learnScene: 'xuantie_mine', learnNpc: '矿工头',
  },
  'xianjin_bingqi': {
    name: '玄金兵器', desc: '玄铁精英锻造，锋芒毕露',
    ingredients: [ { id: 'xuantie_jingcui', qty: 3 }, { id: 'huojing_cao', qty: 1 } ],
    difficulty: 5, baseSuccess: 0.65,
    resultQuality: ['灵品', '地品', '地品', '天品'],
    learnScene: 'xuantie_mine', learnNpc: '矿工头',
  },
  'xuantie_kai': {
    name: '玄铁甲', desc: '玄铁精英重甲，坚不可摧',
    ingredients: [ { id: 'xuantie_jingcui', qty: 4 }, { id: 'tiegu_cao', qty: 2 }, { id: 'lingquan_shui', qty: 1 } ],
    difficulty: 6, baseSuccess: 0.6,
    resultQuality: ['灵品', '地品', '地品', '天品'],
    learnScene: 'xuantie_mine', learnNpc: '矿工头',
  },
  'xuanhu_fu': {
    name: '玄武符', desc: '玄武之气护体',
    ingredients: [ { id: 'xuantie_jingcui', qty: 2 }, { id: 'wudao_ye', qty: 1 } ],
    difficulty: 4, baseSuccess: 0.7,
    resultQuality: ['灵品', '灵品', '地品', '地品'],
    learnScene: 'xuantie_mine', learnNpc: '矿工头',
  },
};

// 通用矿石（各矿点掉落）
const KUANG_SHI_ITEMS = ['kuang_shi', 'xuantie_jingcui'];

// ── 已学配方（存于 p.forgeRecipes）──
function getForgeRecipes() {
  const p = G.player;
  if (!p.forgeRecipes) p.forgeRecipes = [];
  return p.forgeRecipes;
}
function hasForgeRecipe(id) { return getForgeRecipes().includes(id); }
function learnForgeRecipe(id) {
  const p = G.player;
  const r = FORGE_RECIPES[id];
  if (!r) return false;
  if (!p.forgeRecipes) p.forgeRecipes = [];
  if (!p.forgeRecipes.includes(id)) {
    p.forgeRecipes.push(id);
    addNarrative(`🔨 你学会了锻造配方：${r.name}！（${r.ingredients.map(i => (ITEM_DB.find(x => x.id === i.id)?.name || i.id) + '×' + i.qty).join('、')}）`, 'event');
    return true;
  }
  return false;
}
function tryLearnForgeRecipe(id, source) {
  const p = G.player;
  if (!p.forgeRecipes) p.forgeRecipes = [];
  if (p.forgeRecipes.includes(id)) return false;
  const r = FORGE_RECIPES[id];
  if (!r) return false;
  p.forgeRecipes.push(id);
  addNarrative(`<div style="border:1px solid rgba(160,160,200,0.4);border-radius:6px;padding:8px;margin:4px 0;background:rgba(60,60,100,0.1);">
    <div style="font-size:11px;font-weight:bold;color:#aab;">🔨 习得锻造配方：${r.name}</div>
    <div style="font-size:10px;color:var(--text-dim);margin-top:2px;">${source || '机缘巧合'} · ${r.ingredients.map(i => (ITEM_DB.find(x => x.id === i.id)?.name || i.id) + '×' + i.qty).join('、')}</div>
  </div>`, 'event');
  return true;
}

// ── 炼器主界面 ──
function showForgePanel() {
  const p = G.player;
  if (!p) return;
  const learned = getForgeRecipes();
  const allRecipes = Object.keys(FORGE_RECIPES).map(id => ({ id, ...FORGE_RECIPES[id] }));
  
  let html = '<div style="padding:2px;">';
  html += '<div style="font-size:11px;color:var(--text-dim);margin-bottom:8px;">🔥 炉火熊熊，铁锤铿锵。以矿石为骨，以灵材为魂，锻天地之器。</div>';
  
  if (learned.length === 0) {
    html += '<div style="text-align:center;padding:16px;color:var(--text-dim);font-size:11px;">你尚未习得任何锻造配方。<br>去找 <b>铁匠老吴 / 矿工头 / 隐世器修</b> 请教吧。</div>';
    html += '<div style="margin-top:8px;font-size:10px;color:var(--text-dim);">🔨 可学习的配方：</div>';
    allRecipes.forEach(r => {
      html += `<div style="border:1px solid rgba(255,255,255,0.08);border-radius:6px;padding:6px 8px;margin:3px 0;font-size:10px;color:var(--text-dim);">
        <span>${r.name}</span>
        <span style="float:right;color:#aab;">${r.resultQuality.join('/')}</span>
        <div style="font-size:9px;margin-top:2px;">材料：${r.ingredients.map(i => (ITEM_DB.find(x => x.id === i.id)?.name || i.id) + '×' + i.qty).join('、')}</div>
        <div style="font-size:9px;color:#8a7a5a;">学自：${r.learnNpc}（${getSceneName2(r.learnScene)}）</div>
      </div>`;
    });
  } else {
    html += '<div style="font-weight:bold;font-size:12px;margin-bottom:6px;">🔨 已学配方（' + learned.length + '）</div>';
    learned.forEach(rid => {
      const r = FORGE_RECIPES[rid];
      if (!r) return;
      const haveAll = r.ingredients.every(ing => {
        const owned = p.inventory.reduce((s, it) => it.id === ing.id ? s + (it.qty || 1) : s, 0);
        return owned >= ing.qty;
      });
      html += `<div style="border:1px solid ${haveAll ? 'rgba(150,150,220,0.3)' : 'rgba(255,255,255,0.08)'};border-radius:6px;padding:8px;margin:4px 0;background:${haveAll ? 'rgba(60,60,120,0.06)' : 'transparent'};">
        <div style="display:flex;justify-content:space-between;align-items:center;">
          <span style="font-size:12px;font-weight:bold;color:${haveAll ? '#aab' : '#ccc'};">${r.name} <span style="font-size:9px;color:#8a8ab0;font-weight:normal;">→ ${r.resultQuality.join('/')}</span></span>
          <span style="font-size:9px;color:var(--text-dim);">成功率 ${Math.round(getForgeSuccessChance(rid) * 100)}%</span>
        </div>
        <div style="font-size:10px;color:var(--text-dim);margin:3px 0;">${r.desc}</div>
        <div style="font-size:9px;color:${haveAll ? '#aab' : '#e77'};margin-bottom:4px;">
          ${r.ingredients.map(ing => {
            const owned = p.inventory.reduce((s, it) => it.id === ing.id ? s + (it.qty || 1) : s, 0);
            const ok = owned >= ing.qty;
            return `<span style="color:${ok ? '#aab' : '#e77'}">${ITEM_DB.find(x => x.id === ing.id)?.name || ing.id} ${owned}/${ing.qty}</span>`;
          }).join(' ')}
        </div>
        ${haveAll
          ? `<button class="event-choice-btn" onclick="startForge('${rid}')" style="font-size:10px;padding:4px 10px;background:rgba(150,150,220,0.15);border-color:#aab;color:#aab;">🔨 开炉锻造</button>`
          : `<div style="font-size:9px;color:#e77;">缺材料</div>`}
      </div>`;
    });
  }
  
  html += '</div>';
  showCustomModal('🔨 炼器坊', html + '<button class="event-choice-btn" onclick="closeEvent()">离开</button>');
}

// 锻造成功率（受根骨+悟性+火候影响）
function getForgeSuccessChance(recipeId) {
  const p = G.player;
  const r = FORGE_RECIPES[recipeId];
  if (!r) return 0;
  let chance = r.baseSuccess;
  // 根骨加成（体修更会锻造）
  chance += ((p.bone || 50) - 50) / 10 * 0.015;
  // 悟性加成
  chance += ((p.wisdom || 50) - 50) / 10 * 0.01;
  return Math.min(0.95, Math.max(0.1, chance));
}

// ── 锻造流程（简化：一次锤击判定品质）──
function startForge(recipeId) {
  const p = G.player;
  const r = FORGE_RECIPES[recipeId];
  if (!r) return;
  
  // 🔒 材料校验：不足则不开炉（防免费锻造/扣成负数）
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
  
  // 品质池：根据火候判定
  const html = `
    <div style="padding:4px;text-align:center;">
      <div style="font-size:14px;font-weight:bold;color:#aab;">🔨 锻造 ${r.name}</div>
      <div style="font-size:10px;color:var(--text-dim);margin:6px 0;">矿石投入炉中，火焰翻腾。凝神灌注灵力……</div>
      <div style="background:rgba(0,0,0,0.3);border-radius:8px;padding:14px;margin:8px 0;">
        <div style="font-size:10px;color:var(--text-dim);margin-bottom:6px;">⚒️ 锤炼次数（决定品质）</div>
        <div style="display:flex;gap:6px;justify-content:center;">
          ${[1,2,3].map(n => `
            <button class="event-choice-btn" onclick="forgeHammer(${n})" style="font-size:18px;padding:12px 16px;background:rgba(150,150,220,0.1);border-color:#aab;color:#ccd;">⚒️</button>
          `).join('')}
        </div>
        <div style="font-size:9px;color:var(--text-dim);margin-top:6px;">锤击次数越多，品质可能越高，但失败风险也越大</div>
      </div>
      <div style="font-size:10px;color:#e88;" id="forge-hint"></div>
    </div>`;
  
  showCustomModal('🔨 炼器', html, { noCloseBtn: true });
  G._forge = { recipeId, hammer: 0, done: false };
}

function forgeHammer(n) {
  const p = G.player;
  const f = G._forge;
  if (!f || f.done) return;
  const r = FORGE_RECIPES[f.recipeId];
  if (!r) return;
  
  f.hammer += n;
  const hint = document.getElementById('forge-hint');
  
  // 风险判定：连续锤击会炸炉
  if (f.hammer >= 6 && Math.random() < (f.hammer - 5) * 0.2) {
    // 炸炉
    f.done = true;
    G._forge = null;
    if (hint) hint.textContent = '💥 用力过猛，炉炸了！';
    closeCustomModal();
    addNarrative(`<div style="border:1px solid rgba(200,80,80,0.5);border-radius:8px;padding:10px;margin:6px 0;background:rgba(120,30,30,0.12);">
      <div style="font-weight:bold;color:#e77;">💥 炸炉了！</div>
      <div style="font-size:11px;color:var(--text-dim);margin-top:4px;">铁锤落空，炉火失控炸开！矿石化作漫天火星……材料尽毁。</div>
    </div>`, 'danger');
    updateAllUI();
    return;
  }
  
  // 收锤：计算品质
  const chance = getForgeSuccessChance(f.recipeId);
  const success = Math.random() < chance;
  const hammerBonus = Math.min(0.15, f.hammer * 0.04); // 锤击多→品质加成
  const qualityRoll = Math.random() + hammerBonus;
  
  // 品质池选择
  const pool = r.resultQuality;
  const quality = qualityRoll < 0.25 ? pool[0] : qualityRoll < 0.6 ? pool[1] : qualityRoll < 0.9 ? pool[2] : pool[3] || pool[pool.length-1];
  
  f.done = true;
  G._forge = null;
  closeCustomModal();
  
  if (success) {
    // 找到装备数据
    const itemData = (typeof ITEM_DB !== 'undefined' ? ITEM_DB : []).find(i => i.id === f.recipeId);
    if (itemData && typeof addItemToInventory === 'function') {
      // 高品质加成：动态增强装备属性
      const mult = EQUIP_QUALITIES[quality] ? EQUIP_QUALITIES[quality].mult : 1;
      const forged = { ...itemData, id: itemData.id + '_f' + Date.now(), name: `${quality}·${itemData.name}`, 
        desc: `锻造于炼器坊。${itemData.desc}`, quality: quality, _forgeQuality: quality };
      // 按品质放大属性
      if (forged.equipEffect) {
        forged.equipEffect = { ...forged.equipEffect };
        Object.keys(forged.equipEffect).forEach(k => {
          if (typeof forged.equipEffect[k] === 'number') forged.equipEffect[k] = Math.round(forged.equipEffect[k] * mult);
        });
      }
      forged.value = Math.round((forged.value || 10) * mult);
      addItemToInventory(forged, 1);
    } else if (itemData) {
      addItemToInventory(itemData, 1);
    }
    const qColor = EQUIP_QUALITIES[quality] ? EQUIP_QUALITIES[quality].color : '#ccc';
    addNarrative(`<div style="border:1px solid ${qColor};border-radius:8px;padding:10px;margin:6px 0;background:rgba(60,60,100,0.1);">
      <div style="font-weight:bold;color:${qColor};">🔨 锻成！${quality}·${r.name}</div>
      <div style="font-size:11px;color:var(--text-dim);margin-top:4px;">铁水成型，灵光乍现。一件${quality}法器出炉，锋芒内敛，灵气流转。</div>
      <div style="font-size:10px;color:#8cc;">${f.hammer >= 5 ? '✨ 千锤百炼，品质绝佳！' : (f.hammer >= 3 ? '锤炼扎实，成器不错。' : '仓促收锤，品质尚可。')}</div>
    </div>`, 'loot');
  } else {
    addNarrative(`<div style="border:1px solid rgba(200,120,60,0.4);border-radius:8px;padding:10px;margin:6px 0;background:rgba(100,60,20,0.1);">
      <div style="font-weight:bold;color:#d4a045;">😔 锻造失败</div>
      <div style="font-size:11px;color:var(--text-dim);margin-top:4px;">铁器开裂，灵气溃散。你摇了摇头，把废铁回炉重炼。</div>
    </div>`, 'system');
  }
  updateAllUI();
}

// 导出
window.FORGE_RECIPES = FORGE_RECIPES;
window.showForgePanel = showForgePanel;
window.startForge = startForge;
window.forgeHammer = forgeHammer;
window.getForgeSuccessChance = getForgeSuccessChance;
window.learnForgeRecipe = learnForgeRecipe;
window.tryLearnForgeRecipe = tryLearnForgeRecipe;
window.hasForgeRecipe = hasForgeRecipe;
