// === 唯我独仙 · 天道核心系统迁移 ===

// ==========================
// 1. 冷却系统 (调息)
// ==========================
// G 声明在 engine.js，此处只添加字段到已有 G 上
(function() {
  const G = window.G;
  if (!G) return;
  if (!G.cooldown) {
    G.cooldown = {
      seconds: 0,
      reason: '',
      lastAction: '',
    };
  }
})();

function hasCooldown() { return G.cooldown && G.cooldown.seconds > 0; }

function setCooldown(seconds, reason) {
  G.cooldown.seconds = seconds;
  G.cooldown.reason = reason || '刚行动完';
  G.cooldown.lastAction = G.cooldown.reason;
}

function tickCooldown(passedSeconds) {
  if (G.cooldown && G.cooldown.seconds > 0) {
    G.cooldown.seconds = Math.max(0, G.cooldown.seconds - (passedSeconds || 1));
  }
}

// Advance time hooks into cooldown
const _origAdvanceTime = advanceTime;
advanceTime = function(hours) {
  _origAdvanceTime(hours);
  // Each game hour ≈ 2 real seconds
  tickCooldown(hours * 2);
};

// ==========================
// 2. 地面物品系统
// ==========================
if (!G.groundItems) G.groundItems = {}; // sceneId -> [{id, name, qty, type, desc}]

function generateGroundItems(sceneId) {
  const scene = getSceneData(sceneId);
  if (!scene) return;
  
  // Only generate if empty
  if (G.groundItems[sceneId] && G.groundItems[sceneId].length > 0) return;
  
  G.groundItems[sceneId] = [];
  
  // 城镇有基础物品
  if (scene.safe) {
    const commonItems = ['hgc_grass', 'lingquan_shui', 'shougu'];
    if (Math.random() < 0.3) {
      const id = commonItems[Math.floor(Math.random() * commonItems.length)];
      const item = ITEM_DB.find(i => i.id === id);
      if (item) G.groundItems[sceneId].push({ ...item, qty: 1 + Math.floor(Math.random() * 2) });
    }
  }
  
  // 野外有战利品残余
  if (scene.type === 'wild' || scene.type === 'dungeon') {
    if (Math.random() < 0.4) {
      const wildItems = ['hgc_grass', 'shougu', 'shepi', 'shoupi', 'gufen', 'bianfu_yimo', 'lingmu'];
      const id = wildItems[Math.floor(Math.random() * wildItems.length)];
      const item = ITEM_DB.find(i => i.id === id);
      if (item) G.groundItems[sceneId].push({ ...item, qty: 1 });
    }
  }
}

function pickUpItem(itemId) {
  const items = G.groundItems[G.currentScene];
  if (!items) { addNarrative('这里没有可拾取的物品。', 'system'); return; }
  
  const idx = items.findIndex(i => i.id === itemId);
  if (idx === -1) { addNarrative('找不到那个物品。', 'system'); return; }
  
  const item = items[idx];
  const itemData = ITEM_DB.find(i => i.id === itemId);
  if (itemData) addItemToInventory(itemData, item.qty || 1);
  else addItemToInventory(item, item.qty || 1);
  
  items.splice(idx, 1);
  addNarrative(`你拾取了 ${item.name} ×${item.qty || 1}。`, 'loot');
  updateAllUI();
  updatePerceptionUI();
}

function dropItem(itemId, qty) {
  const inv = G.player.inventory.find(i => i.id === itemId);
  if (!inv) return;
  
  const dropQty = qty || 1;
  const itemData = ITEM_DB.find(i => i.id === itemId);
  
  if (!G.groundItems[G.currentScene]) G.groundItems[G.currentScene] = [];
  const existing = G.groundItems[G.currentScene].find(i => i.id === itemId);
  if (existing) {
    existing.qty = (existing.qty || 1) + dropQty;
  } else {
    G.groundItems[G.currentScene].push({
      id: itemId, name: inv.name, type: inv.type,
      qty: dropQty, value: inv.value, desc: itemData?.desc || ''
    });
  }
  
  removeItemFromInventory(itemId, dropQty);
  addNarrative(`你丢下了 ${inv.name} ×${dropQty}。`, 'system');
  updateAllUI();
  updatePerceptionUI();
}

// ==========================
// 3. 感知系统 (Perception)
// ==========================
function perceive() {
  const scene = getSceneData(G.currentScene);
  const p = G.player;
  
  // 生成地面物品（懒）
  generateGroundItems(G.currentScene);
  
  // 冷却提示
  let cooldownText = '';
  if (hasCooldown()) {
    cooldownText = `⚠️ 调息中（${G.cooldown.seconds}秒），行动受限。`;
  }
  
  // 所属大域
  const domainInfo = scene && scene.cosmosDomain && typeof COSMOS_DOMAIN_NAMES !== 'undefined'
    ? `🌍 ${COSMOS_DOMAIN_NAMES[scene.cosmosDomain] || scene.cosmosDomain}${scene.cosmosRegion && COSMOS_REGION_NAMES ? ' · ' + (COSMOS_REGION_NAMES[scene.cosmosRegion] || '') : ''}`
    : getCurrentRegionName();
  
  // 构建感知文本
  const perception = [
    `━━━ 感知 ━━━`,
    `【自身】${getRealmLabel()} | 灵力 ${Math.round(p.qi)}/${p.maxQi} | 气血 ${Math.round(p.hp)}/${p.maxHp} | 灵石 ${p.stones}`,
    `【寿元】${Math.floor(p.age)}/${p.maxAge}年 | 心境 ${['极差','低落','平稳','平和','愉悦','圆满'][Math.min(5, Math.floor(p.mood/20))]}`,
    `【位置】${domainInfo} · ${scene ? scene.name : '未知'} | ${G.time.period}时 · 第${G.time.day}日`,
    `【灵气】${scene ? '☆'.repeat(scene.qiLevel || 3) + ' 灵气浓度 ' + (scene.qiLevel || 3) + '/6' : ''}`,
    cooldownText,
    `━━━ `,
  ].filter(Boolean).join('\n');
  
  addNarrative(perception, 'system');
  updatePerceptionUI();
}

// ==========================
// 4. 喊话 (Speak in room)
// ==========================
function speak(content) {
  if (G.player.qi < 2) {
    addNarrative('灵力不足，说话都有气无力。', 'system'); return;
  }
  
  G.player.qi = Math.max(0, G.player.qi - 2);
  
  addNarrative(`你朗声道：「${content}」`, 'default');
  
  // NPC回应（如果有）
  const npcs = npcManager.getNPCsForScene(G.currentScene);
  if (npcs.length > 0 && Math.random() < 0.4) {
    const responder = npcs[Math.floor(Math.random() * npcs.length)];
    const reactions = [
      `哦？有点意思。`,
      `哼，与我何干。`,
      `${responder.personality}的${responder.name}看了你一眼，没有搭话。`,
      `「说得好！」${responder.name}抚掌笑道。`,
      `「道友所言，深得我心。」`,
    ];
    addNarrative(`【${responder.name}】${reactions[Math.floor(Math.random() * reactions.length)]}`, 'narr-event');
  }
  
  updateAllUI();
}

// ==========================
// 5. 审视 (Examine)
// ==========================
function examine(targetType, targetId) {
  if (targetType === 'item') {
    const item = ITEM_DB.find(i => i.id === targetId);
    if (!item) { addNarrative('无从审视此物。', 'system'); return; }
    
    const typeIcons = {'丹药':'💊','材料':'🪨','法器':'🗡️','灵草':'🌿','杂物':'📦','功法卷轴':'📜'};
    const info = [
      `━━━ ${typeIcons[item.type]||'📦'} ${item.name} ━━━`,
      `类型：${item.type} | 品质：${item.value < 10 ? '凡品' : item.value < 50 ? '中品' : item.value < 100 ? '上品' : '极品'}`,
      `描述：${item.desc}`,
      `价值：${item.value}灵石`,
      item.use ? `效果：${Object.entries(item.use).map(([k,v]) => `${k}+${v}`).join(', ')}` : '',
      item.equipEffect ? `装备：${Object.entries(item.equipEffect).map(([k,v]) => `${k}+${v}`).join(', ')}` : '',
    ].filter(Boolean).join('\n');
    addNarrative(info, 'system');
    
  } else if (targetType === 'npc') {
    const npc = npcManager.npcs.find(n => n.id === targetId);
    if (!npc) { addNarrative('此人不在附近。', 'system'); return; }
    
    const sect = npc.sectId ? `${SECT_DB.find(s=>s.id===npc.sectId)?.name || ''}` : '无门无派';
    const info = [
      `━━━ ${npc.name} ━━━`,
      `性别：${npc.gender} | 修为：${getNPCRealmLabel(npc)} | ${sect}`,
      `身份：${npc.role}`,
      `性格：${npc.personality}`,
      `背景：${npc.background}`,
      npc.aiDescription || '',
      `好感：${npc.affinity}`,
    ].filter(Boolean).join('\n');
    addNarrative(info, 'system');
    
  } else if (targetType === 'scene') {
    const scene = getSceneData(G.currentScene);
    if (!scene) return;
    const info = [
      `━━━ ${scene.name} ━━━`,
      `区域：${getCurrentRegionName()}`,
      `类型：${scene.type === 'town' ? '城镇' : scene.type === 'dungeon' ? '秘境' : '野外'}`,
      `${scene.dangerLevel ? '危险等级：⚠️'.repeat(scene.dangerLevel) : '安全区域'}`,
      `灵气浓度：${'☆'.repeat(scene.qiLevel || 3)}`,
      scene.description,
    ].filter(Boolean).join('\n');
    addNarrative(info, 'system');
  }
  
  updateAllUI();
}

// ==========================
// 6. 传送 (Recall)
// ==========================
function recall() {
  const cost = 10;
  if (G.player.stones < cost) {
    addNarrative(`传送需要${cost}灵石。`, 'system'); return;
  }
  
  if (G.currentScene === 'qingyun') {
    addNarrative('你已经在安全区域了。', 'system'); return;
  }
  
  G.player.stones -= cost;
  G.currentScene = 'qingyun';
  advanceTime(1);
  addNarrative('你捏碎传送符，灵光一闪……下一刻已回到青云镇。', 'default');
  updateSceneDisplay();
  updateAllUI();
}

// ==========================
// 7. 论道 (Dao Confession)
// ==========================
function confessDao(content) {
  const p = G.player;
  if (p.qi < 10) { addNarrative('灵力不足，无法凝神论道。', 'system'); return; }
  
  p.qi = Math.max(0, p.qi - 10);
  const quality = p.wisdom > 70 ? '精辟' : p.wisdom > 50 ? '中肯' : '浅显';
  
  addNarrative(`你盘膝而坐，诉说对道的感悟：「${content}」`, 'default');
  
  // 论道效果
  const moodGain = p.wisdom > 70 ? 8 : p.wisdom > 50 ? 5 : 2;
  p.mood = Math.min(100, p.mood + moodGain);
  
  // 小概率悟道
  if (Math.random() < 0.1 + p.wisdom / 200) {
    const cpGain = 20 + Math.floor(p.wisdom * 0.5);
  if (typeof gainCultivation === 'function') gainCultivation('qi', cpGain);
  else p.qiCultivationPoints += cpGain;
  p.mood = Math.min(100, p.mood + 5);
    addNarrative('你陷入深沉的悟道之中！浑身灵光流转，修为大进！', 'event');
    G.player.eventHistory.push('论道有所悟');
  }
  
  updateAllUI();
}

// ==========================
// 8. 悔过 (Repent)
// ==========================
function repent() {
  if (G.player.mood >= 50) {
    addNarrative('你道心稳固，无需悔过。', 'system'); return;
  }
  
  G.player.qi = Math.max(0, G.player.qi - 5);
  G.player.mood = Math.min(50, G.player.mood + 15);
  addNarrative('你闭目反思己过，拂去心中尘埃。道心重新澄明。', 'default');
  updateAllUI();
}

// ==========================
// 9. 感知面板更新 (UI)
// ==========================
function updatePerceptionUI() {
  const container = document.getElementById('perception-panel');
  if (!container) return;
  
  const scene = getSceneData(G.currentScene);
  if (!scene) { container.innerHTML = ''; return; }
  
  // 地面物品
  let groundHtml = '';
  const ground = G.groundItems[G.currentScene] || [];
  if (ground.length > 0) {
    groundHtml = ground.map(i => {
      const typeEmoji = {'丹药':'💊','材料':'🪨','法器':'🗡️','灵草':'🌿','杂物':'📦'};
      return `<div class="ground-item" onclick="pickUpItem('${i.id}')">
        <span>${typeEmoji[i.type]||'📦'} ${i.name}</span>
        <span>x${i.qty || 1}</span>
        <span class="ground-pickup">拾取</span>
      </div>`;
    }).join('');
  }
  
  // 冷却状态
  let cooldownHtml = '';
  if (hasCooldown()) {
    cooldownHtml = `<div class="cooldown-bar-bg">
      <div class="cooldown-bar-fill" style="width:${Math.max(5, Math.min(100, G.cooldown.seconds * 3))}%"></div>
    </div>
    <div class="cooldown-label">⏳ 调息 ${G.cooldown.seconds}秒</div>`;
  }
  
  container.innerHTML = `
    <div class="panel-box perception-box">
      <div class="panel-title">🔍 感知 · ${scene.name}</div>
      <div class="perc-row"><span>灵气</span><span class="perc-stars">${'☆'.repeat(scene.qiLevel || 3)}</span></div>
      <div class="perc-row"><span>危险</span><span>${scene.dangerLevel ? '⚠️'.repeat(scene.dangerLevel) : '安全'}</span></div>
      ${cooldownHtml}
      ${groundHtml ? `<div class="perc-ground"><div class="perc-label">地面物品：</div>${groundHtml}</div>` : ''}
    </div>
  `;
}

// ==========================
// 导出
// ==========================
window.hasCooldown = hasCooldown;
window.setCooldown = setCooldown;
window.tickCooldown = tickCooldown;
window.perceive = perceive;
window.speak = speak;
window.examine = examine;
window.recall = recall;
window.confessDao = confessDao;
window.repent = repent;
window.pickUpItem = pickUpItem;
window.dropItem = dropItem;

// 从背包中出售物品（支持批量）
function dropInventoryItem(itemId) {
  const inv = G.player.inventory.find(i => i.id === itemId);
  if (!inv) return;
  
  // 禁止出售任务物品
  if (typeof isQuestItem === 'function' && isQuestItem(itemId)) {
    addNarrative('❌ 任务物品不可出售。完成任务后多余的物品会自动释放。', 'system');
    return;
  }
  
  const itemData = ITEM_DB.find(i => i.id === itemId);
  // 出售价优先用背包条目的value（掉落/锻造装备带uid不在ITEM_DB，自带价值已含品质倍率）
  const baseValue = (inv.value !== undefined && inv.value !== null) ? inv.value : ((itemData && itemData.value) || 3);
  const value = baseValue;
  // 🔧 出售价统一 ×5（2026-08-03）：原 ×0.6 与自动出售(×5)/悬浮提示(×5)不一致，同一物品两个价还打折
  const sellPrice = Math.floor(value * 5);
  
  // 显示批量/单件出售弹窗
  const max = inv.qty;
  const defVal = Math.min(max, 5);
  const html = `
    <div style="padding:8px;">
      <div style="margin-bottom:8px;font-size:13px;">出售 <b>${inv.name}</b>（现有 ${max} 个）</div>
      <div style="margin-bottom:6px;">
        <span style="font-size:11px;color:var(--text-dim);">选择数量：</span>
        <input id="sell-qty-input" type="number" min="1" max="${max}" value="${defVal}" 
          oninput="document.getElementById('sell-total').textContent = (parseInt(this.value)||0) * ${sellPrice}"
          style="width:60px;background:rgba(255,255,255,0.1);border:1px solid rgba(255,255,255,0.2);color:var(--text);padding:4px;border-radius:4px;font-size:14px;">
        <span style="font-size:10px;color:var(--text-dim);margin-left:4px;">/ ${max}</span>
      </div>
      <div style="font-size:11px;color:var(--accent);margin-bottom:8px;">收入：<span id="sell-total">${sellPrice * defVal}</span> 灵石</div>
      <div style="display:flex;gap:6px;flex-wrap:wrap;">
        <button class="event-choice-btn" onclick="doSellItem('${itemId}', 1);closeEvent();">×1</button>
        <button class="event-choice-btn" onclick="doSellItem('${itemId}', ${Math.min(max, 10)});closeEvent();">×${Math.min(max, 10)}</button>
        <button class="event-choice-btn" onclick="doSellItem('${itemId}', ${max});closeEvent();">全部</button>
        <button class="event-choice-btn" onclick="doSellItemFromInput('${itemId}');closeEvent();">自定义</button>
        <button class="event-choice-btn" onclick="closeEvent();">取消</button>
      </div>
    </div>`;
  showCustomModal('💰 批量出售', html);
}

// 出售确认（按钮触发）
function doSellItem(itemId, qty) {
  // 禁止出售任务物品
  if (isQuestItem(itemId)) {
    addNarrative('❌ 任务物品不可出售。', 'system');
    return;
  }
  const inv = G.player.inventory.find(i => i.id === itemId);
  if (!inv) return;
  const actQty = Math.min(qty, inv.qty);
  if (actQty <= 0) return;
  const itemData = ITEM_DB.find(i => i.id === itemId);
  // 出售价优先用背包条目的value（掉落/锻造装备带uid不在ITEM_DB，自带价值已含品质倍率）
  const baseValue = (inv.value !== undefined && inv.value !== null) ? inv.value : ((itemData && itemData.value) || 3);
  // 🔧 出售价统一 ×5（2026-08-03）：与自动出售/悬浮提示一致
  const sellPrice = Math.floor(baseValue * 5) * actQty;
  G.player.stones += sellPrice;
  removeItemFromInventory(itemId, actQty);
  addNarrative(`你出售了 ${inv.name} ×${actQty}，获得 ${sellPrice} 灵石。`, 'loot');
  updateAllUI();
  updatePerceptionUI();
}

// 自定义数量出售
function confirmSellInput(itemId) {
  const inv = G.player.inventory.find(i => i.id === itemId);
  if (!inv) return;
  const input = document.getElementById('sell-qty-input');
  let qty = parseInt(input ? input.value : '0') || 1;
  qty = Math.min(qty, inv.qty);
  if (qty <= 0) qty = 1;
  doSellItem(itemId, qty);
}
// 自定义数量出售
function doSellItemFromInput(itemId) {
  const inv = G.player.inventory.find(i => i.id === itemId);
  if (!inv) return;
  const input = document.getElementById('sell-qty-input');
  let qty = parseInt(input ? input.value : '0') || 1;
  qty = Math.min(qty, inv.qty);
  if (qty <= 0) qty = 1;
  doSellItem(itemId, qty);
}

window.dropInventoryItem = dropInventoryItem;
window.doSellItem = doSellItem;
window.doSellItemFromInput = doSellItemFromInput;
window.generateGroundItems = generateGroundItems;
window.updatePerceptionUI = updatePerceptionUI;
window.isQuestItem = isQuestItem;
