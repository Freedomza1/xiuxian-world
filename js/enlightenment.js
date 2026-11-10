// === 唯我独仙 · 顿悟·自创·神级功法系统 ===

// ==========================
// 顿悟积累
// 修炼、战斗、奇遇时积累顿悟值
// 满100时触发顿悟事件
// ==========================
let enlightenmentPoint = 0;

function addEnlightenmentPoint(amount) {
  // 🌀 秘术·悟性加成：装备秘术时顿悟积累加速
  try {
    if (typeof getSpecialSkillEffects === 'function') {
      const sp = getSpecialSkillEffects();
      if (sp && sp.mishu && sp.mishu.wisdomBonus) {
        amount = Math.round(amount * (1 + (sp.mishu.wisdomBonus || 0) * 0.08));
      }
    }
  } catch(e) {}
  enlightenmentPoint += amount;
  if (enlightenmentPoint >= 100) {
    enlightenmentPoint = 0;
    triggerEnlightenment();
  }
}

function triggerEnlightenment() {
  const roll = Math.random();
  const mood = G.player.mood;
  const wisdom = G.player.wisdom;
  const realmIdx = G.player.qiRealmIndex || 0;
  
  // 高悟性/高心境时，触发高品质顿悟概率更高
  const highQuality = (mood > 70 && wisdom > 70) || Math.random() < 0.3;
  
  addNarrative('你的脑海中忽然灵光一闪——', 'narr-event');
  
  // 🔧 顿悟品质随境界解锁：神级顿悟需筑基（realm≥9），圣级顿悟需练气五层（realm≥4）
  //    避免练气初期就顿悟到筑基/化神级功法（学得早但强度脱节）
  if (roll < 0.15 && realmIdx >= 9) {
    // 神级顿悟
    enlightenmentGodly();
  } else if ((roll < 0.40 || highQuality) && realmIdx >= 4) {
    // 圣级/天级顿悟
    enlightenmentHigh();
  } else {
    // 普通顿悟：增益状态
    enlightenmentNormal();
  }
}

// 神级顿悟 → 领悟神级功法
function enlightenmentGodly() {
  // 🔧 只顿悟当前境界可学的神级功法（避免金丹期顿悟到化神级却学不了）
  const realmIdx = G.player.qiRealmIndex || 0;
  const godlySkills = SKILL_DB.filter(s => {
    if (s.quality !== '神级' || s.learn.special !== '顿悟') return false;
    if (s.learn.realm) {
      const need = parseQiRealm(s.learn.realm);
      if (need && realmIdx + 1 < need) return false;  // 境界不够不顿悟
    }
    return true;
  });
  if (godlySkills.length === 0) {
    // 没有可顿悟的 → 转为高级顿悟
    enlightenmentHigh();
    return;
  }
  
  const skill = godlySkills[Math.floor(Math.random() * godlySkills.length)];
  
  // 检查是否已有
  if (G.player.skills.find(s => s.id === skill.id)) {
    // 重复顿悟 → 改为加深领悟
    G.player.wisdom = Math.min(100, G.player.wisdom + 5);
    G.player.mood = Math.min(100, G.player.mood + 10);
    addNarrative(`你顿悟了${skill.name}的更深层奥义！悟性提升！`, 'event');
    return;
  }
  
  // 灵根检查（🔧 放宽：仅攻伐术/秘术/阵道保留门槛，其余通用功法异系可学）
  if (skill.learn.spiritRoot) {
    const rootLockedTypes = ['攻伐术', '秘术', '阵道'];
    const locked = rootLockedTypes.includes(skill.type || '');
    const hasRoot = skill.learn.spiritRoot.some(r => G.player.spiritRoots.includes(r));
    if (!hasRoot && locked) {
      addNarrative('你隐约感到天机降临，但灵根不合，无法完全领悟……', 'system');
      G.player.mood = Math.max(0, G.player.mood - 5);
      return;
    }
  }
  
  G.player.skills.push({
    id: skill.id, name: skill.name, quality: skill.quality,
    type: skill.type, active: false, mastered: false
  });
  G.player.mood = Math.min(100, G.player.mood + 20);
  G.player.wisdom = Math.min(100, G.player.wisdom + 5);
  G.player.eventHistory.push(`顿悟神级功法：${skill.name}`);
  
  const html = buildMilestoneCard('🌈 天降顿悟', skill);
  addNarrative(html, 'milestone');
  updateAllUI();
}

// 高级顿悟 → 圣级/天级
function enlightenmentHigh() {
  // 🔧 只顿悟当前境界可学的圣级/天级功法
  const realmIdx = G.player.qiRealmIndex || 0;
  const pool = SKILL_DB.filter(s => {
    if ((s.quality !== '圣级' && s.quality !== '天级') || s.learn.special !== '顿悟') return false;
    if (s.learn.realm) {
      const need = parseQiRealm(s.learn.realm);
      if (need && realmIdx + 1 < need) return false;  // 境界不够不顿悟
    }
    return true;
  });
  const skill = pool.length > 0 ? pool[Math.floor(Math.random() * pool.length)] : null;
  
  if (skill && !G.player.skills.find(s => s.id === skill.id)) {
    G.player.skills.push({
      id: skill.id, name: skill.name, quality: skill.quality,
      type: skill.type, active: false, mastered: false
    });
    G.player.mood = Math.min(100, G.player.mood + 10);
    G.player.wisdom = Math.min(100, G.player.wisdom + 3);
    const html = buildMilestoneCard('✨ 顿悟', skill);
    addNarrative(html, 'milestone');
  } else {
    // 增强属性
    G.player.wisdom = Math.min(100, G.player.wisdom + 5);
    G.player.bone = Math.min(100, G.player.bone + 3);
    G.player.mood = Math.min(100, G.player.mood + 8);
    addNarrative('茅塞顿开！你对修炼之道的理解更深了一层。', 'event');
  }
  updateAllUI();
}

// 普通顿悟
function enlightenmentNormal() {
  const effects = [
    { text:'气运流转，你感到浑身舒畅！', mood:10, luck:3 },
    { text:'经脉中灵气奔涌，修为大涨！', cultivationPoints:80 },
    { text:'天道感悟涌入脑海，悟性提升！', wisdom:5 },
    { text:'天地灵气灌体，根骨增强！', bone:5 },
    { text:'你与天地产生共鸣，灵力上限提升！', maxQi:20 },
  ];
  
  const effect = effects[Math.floor(Math.random() * effects.length)];
  if (effect.mood) G.player.mood = Math.min(100, G.player.mood + effect.mood);
  if (effect.luck) G.player.luck = Math.min(100, G.player.luck + effect.luck);
  if (effect.wisdom) G.player.wisdom = Math.min(100, G.player.wisdom + effect.wisdom);
  if (effect.bone) G.player.bone = Math.min(100, G.player.bone + effect.bone);
  if (effect.cultivationPoints) {
    if (typeof gainCultivation === 'function') gainCultivation('qi', effect.cultivationPoints);
    else G.player.qiCultivationPoints += effect.cultivationPoints;
  }
  if (effect.maxQi) {
    G.player.maxQi += effect.maxQi;
    G.player.qi = Math.min(G.player.maxQi, G.player.qi + effect.maxQi / 2);
  }
  
  addNarrative(effect.text, 'event');
  G.player.eventHistory.push('顿悟：' + effect.text.slice(0, 20));
  updateAllUI();
}

// ==========================
// 自创功法系统
// 消耗大量修为 + 灵石，创造一件只属于自己的功法
// ==========================
function openSkillCreation() {
  const p = G.player;
  const costStones = 80;
  const costCP = Math.min(10000, Math.max(300, Math.round(getQiRealm().cpRequired * 0.4)));  // 🔧 修为消耗封顶10000
  
  if (p.stones < costStones) {
    addNarrative('自创功法需要80灵石购买推演材料。', 'system'); return;
  }
  if (p.qiCultivationPoints < getQiRealm().cpRequired + costCP) {
    addNarrative(`修为不足（需额外${costCP}修为推演），还不够。`, 'system'); return;
  }
  if (p.wisdom < 30) {
    addNarrative('悟性太低（${p.wisdom}/100），无法领悟自创功法的奥妙。多经历些奇遇开悟吧。', 'system'); return;
  }
  
  const types = ['攻伐术','护体诀','身法','疗伤法','秘术','阵道','丹道','吐纳法','炼体术','心法'];
  const elements = ['金','木','水','火','土','雷'];
  // 阵道/丹道不分系（'无'）
  const noElementTypes = ['阵道','丹道','吐纳法','炼体术','心法'];
  
  let html = `
    <p style="margin-bottom:12px;">你将全部心神沉浸在推演中……自创功法需要：</p>
    <ul style="font-size:12px;line-height:1.8;margin-bottom:12px;">
      <li>💰 消耗灵石：${costStones}</li>
      <li>📖 消耗修为：${costCP}</li>
      <li>🧠 悟性决定品质上浮（当前：${p.wisdom}）</li>
    </ul>
    <p style="margin-bottom:8px;">选择自创方向：</p>
  `;
  // 🔧 展示当前境界自创品质范围（与预制池 CUSTOM_TIER_MAP 一致）
  let tierInfo = null;
  if (typeof getCustomTierRange === 'function') tierInfo = getCustomTierRange(p.qiRealmIndex || 0);
  const qNames = ['凡级','灵级','地级','天级','圣级','神级'];
  if (tierInfo) {
    const tS = qNames[tierInfo.minQ];
    const tE = tierInfo.minQ === tierInfo.maxQ ? '' : ' ~ ' + qNames[tierInfo.maxQ];
    html = html.replace('</ul>', '<li>⛰️ 当前境界可自创：<b style="color:#ffcc66;">' + tS + tE + '</b>（保底' + tS + '）</li></ul>');
  }
  
  types.forEach(t => {
    if (noElementTypes.includes(t)) {
      html += `<button class="event-choice-btn" onclick="createCustomSkill('${t}','无')">${t}</button>`;
    } else {
      elements.forEach(e => {
        html += `<button class="event-choice-btn" onclick="createCustomSkill('${t}','${e}')">${t} · ${e}系</button>`;
      });
    }
  });
  
  showCustomModal('📜 自创功法 · 推演天机', html);
}

function createCustomSkill(type, element) {
  const p = G.player;
  const costStones = 80;
  const costCP = Math.min(10000, Math.max(300, Math.round(getQiRealm().cpRequired * 0.4)));  // 🔧 修为消耗封顶10000
  
  // 🔧 扣除前再校验（防止UI检查后修为变动导致负值）
  if (p.qiCultivationPoints < getQiRealm().cpRequired + costCP) {
    closeCustomModal();
    addNarrative('修为不足（需额外' + costCP + '修为推演），还不够。', 'system');
    return;
  }
  if (p.stones < costStones) {
    closeCustomModal();
    addNarrative('自创功法需要80灵石购买推演材料。', 'system'); return;
  }
  
  // 扣除消耗（🔧 修为不低于当前境界需求——防止修为跌破境界显示负值）
  p.stones -= costStones;
  p.qiCultivationPoints = Math.max(getQiRealm().cpRequired, p.qiCultivationPoints - costCP);
  
  // ── 悟性检验：悟性不够可能直接失败（🔧 境界加成+保底成功率，失败返还七成修为）──
  const realmBonus = (p.qiRealmIndex || 0) * 2;  // 高境界对自创更有把握
  const successChance = Math.min(0.95, 0.4 + p.wisdom * 0.4 / 100 + realmBonus / 100);
  const wisdomCheck = Math.random() < successChance;
  if (!wisdomCheck) {
    p.mood = Math.max(0, p.mood - 10);
    // 🔧 失败返还七成修为（灵石为推演材料费不退）
    if (typeof gainCultivation === 'function') gainCultivation('qi', Math.round(costCP * 0.7));
    else p.qiCultivationPoints += Math.round(costCP * 0.7);
    closeCustomModal();
    addNarrative('你枯坐数日，冥想推演，却一无所获。悟性不及，功亏一篑。（返还原先七成修为）', 'system');
    recalcStats(p);
    updateAllUI();
    return;
  }
  
  // ── 品质判定（境界锚定 + 悟性浮动） ──
  // 🔧 境界决定品质保底：金丹期不可能自创出练气级垃圾；悟性决定上限浮动
  // 使用预制池的品质阶位映射（CUSTOM_TIER_MAP）
  const realmIdx = p.qiRealmIndex || 0;
  let tier = null;
  if (typeof getCustomTierRange === 'function') tier = getCustomTierRange(realmIdx);
  if (!tier) tier = { minQ: 0, maxQ: 2 };  // 兜底：凡~灵
  const qOrder = ['凡级','灵级','地级','天级','圣级','神级'];
  const minQIdx = tier.minQ;
  const maxQIdx = tier.maxQ;
  // 品质档位：保底 = 境界下限；悟性高/运气好可向上浮动
  let qIdx = minQIdx;
  const upChance = (p.wisdom - 40) / 100;  // 悟性40→0%，70→30%，90→50%
  if (Math.random() < upChance && qIdx < maxQIdx) qIdx++;
  if (p.wisdom >= 90 && Math.random() < 0.3 && qIdx < maxQIdx) qIdx++;  // 高悟性二次上浮
  const quality = qOrder[qIdx];
  
  // 🔧 境界系数：功法效果随境界缩放（练气1倍 → 金丹3.6倍 → 化神5倍），自创功法永远与当前阶段匹配
  const realmScale = 1 + realmIdx * 0.2;  // 练气1层=1.0, 练气9层=2.8, 金丹13=3.6, 化神18=4.6
  const scale = (v) => Math.round(v * realmScale);
  const scalePct = (v) => Math.min(0.9, v * (1 + realmIdx * 0.02));  // 概率类也随境界微升
  
  // 品质基础值（保底之后：凡5/灵10/地20/天35/圣55/神80）
  const qBase = [5, 10, 20, 35, 55, 80][qIdx] || 5;
  
  // ── 从预制池生成（🔧 每类×每系×每阶固定名字+分档系数+特殊功能）──
  // 保底品质 = 境界下限；同阶功法效果比江湖普通同阶更强
  let skill = null;
  if (typeof buildCustomSkillFromPool === 'function') {
    skill = buildCustomSkillFromPool(type, element, qIdx, p.name);
  }
  // 兜底：池子缺失时用旧逻辑生成（不应发生，但防崩溃）
  if (!skill) {
    const fallbackId = `custom_${type}_${element}_${Date.now()}`;
    skill = {
      id: fallbackId, name: `无名${type}·自创`, quality: quality, type: type, element: element,
      desc: `由${p.name}自创的${quality}${type}（${element}系）。`,
      effects: { attackBonus: scale(qBase), special: '无名功法——效果平平' },
      learn: { realm: QI_REALMS[p.qiRealmIndex].name }
    };
  }
  const skillId = skill.id;
  const descText = skill.desc;
  const effects = skill.effects;
  
  // 加到数据库和玩家技能栏
  if (!SKILL_DB.find(s => s.id === skillId)) SKILL_DB.push(skill);
  
  p.skills.push({
    id: skillId, name: skill.name, quality: skill.quality,
    type: skill.type, active: false, mastered: true
  });
  
  p.mood = Math.min(100, p.mood + 15);
  G.player.eventHistory.push(`自创功法：${skill.name}（${skill.quality}）`);
  
  closeCustomModal();
  addNarrative(`🌟 你自创了一门功法！${skill.name}（${skill.quality}·${type}）`, 'event');
  addNarrative(`「${skill.desc}」`, 'narr-event');
  
  // DeepSeek AI 生成描述（如果可用）
  if (typeof generateAISkillDescription === 'function') {
    generateAISkillDescription(skill).then(desc => {
      if (desc) skill.desc = desc;
    });
  }
  
  recalcStats(p);
  updateAllUI();
}

// ==========================
// 顿悟融入双修
// 修炼/战斗/探索时积累顿悟值
// ==========================
// Hook into existing functions (called from ui.js)
function triggerEnlightenmentFromCultivation() {
  addEnlightenmentPoint(3 + Math.floor(Math.random() * 5));
}

function triggerEnlightenmentFromCombat() {
  addEnlightenmentPoint(5 + Math.floor(Math.random() * 8));
}

function triggerEnlightenmentFromExplore() {
  addEnlightenmentPoint(2 + Math.floor(Math.random() * 4));
}

// 手动顿悟入口（机缘触发）
function manualEnlightenment(action) {
  switch(action) {
    case 'meditate': addEnlightenmentPoint(15); break;
    case 'read': addEnlightenmentPoint(10); break;
    case 'nature': addEnlightenmentPoint(8); break;
  }
  updateAllUI();
}

// ==========================
// DeepSeek AI 集成
// ==========================
// ▸ DEEPSEEK_API_KEY 声明在 narrative.js，此处复用

// NPC 对话生成 (AI)
async function generateNPCDialog(npc, topic) {
  try {
    const key = (typeof DEEPSEEK_API_KEY !== 'undefined') ? DEEPSEEK_API_KEY : window.XIUXIAN_CONFIG && window.XIUXIAN_CONFIG.DEEPSEEK_API_KEY ? window.XIUXIAN_CONFIG.DEEPSEEK_API_KEY : "";
    const response = await fetch('https://api.deepseek.com/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + key,
      },
      body: JSON.stringify({
        model: 'deepseek-v4-flash',
        messages: [
          { role: 'system', content: `你是修仙世界的NPC，名叫${npc.name}，性别${npc.gender}，性格${npc.personality}，身份是${npc.role}，背景是${npc.background}，修为${getNPCRealmLabel(npc)}。用一句古风对话回应玩家关于"${topic}"的询问。贴合你的性格和身份。20-40字。只说你的回答，不要其他。` },
          { role: 'user', content: `你好，请问你知道关于${topic}的事吗？` }
        ],
        max_tokens: 80,
        temperature: 0.9,
      })
    });
    if (!response.ok) throw new Error('API error');
    const data = await response.json();
    return data.choices[0].message.content.trim();
  } catch(e) {
    console.warn('NPC dialog AI failed:', e);
    return null;
  }
}

// 功法描述生成
async function generateAISkillDescription(skill) {
  try {
    const key = (typeof DEEPSEEK_API_KEY !== 'undefined') ? DEEPSEEK_API_KEY : window.XIUXIAN_CONFIG && window.XIUXIAN_CONFIG.DEEPSEEK_API_KEY ? window.XIUXIAN_CONFIG.DEEPSEEK_API_KEY : "";
    const response = await fetch('https://api.deepseek.com/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + key,
      },
      body: JSON.stringify({
        model: 'deepseek-v4-flash',
        messages: [
          { role: 'system', content: `你是修仙世界的典籍撰写者。为以下玩家自创的功法写一段古风描述（20-40字）：\n名称：${skill.name}\n品质：${skill.quality}\n类型：${skill.type}\n属性：${skill.element}系` },
        ],
        max_tokens: 60,
        temperature: 0.7,
      })
    });
    if (!response.ok) throw new Error('API error');
    const data = await response.json();
    return data.choices[0].message.content.trim();
  } catch(e) {
    console.warn('Skill desc AI failed:', e);
    return null;
  }
}

// NPC批量生成 (优化描述)
async function batchGenerateNPCDescriptions(npcs) {
  try {
    const key = (typeof DEEPSEEK_API_KEY !== 'undefined') ? DEEPSEEK_API_KEY : window.XIUXIAN_CONFIG && window.XIUXIAN_CONFIG.DEEPSEEK_API_KEY ? window.XIUXIAN_CONFIG.DEEPSEEK_API_KEY : "";
    const batch = npcs.map(n => `${n.name}（${n.gender}，${n.personality}，${n.role}，${n.background}）`).join('; ');
    const response = await fetch('https://api.deepseek.com/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + key,
      },
      body: JSON.stringify({
        model: 'deepseek-v4-flash',
        messages: [
          { role: 'system', content: `你是修仙世界的角色塑造者。为以下NPC写一段简短的形象描写（每人10-20字）。直接依次输出，每行一个：` },
          { role: 'user', content: batch }
        ],
        max_tokens: 200,
        temperature: 0.8,
      })
    });
    if (!response.ok) throw new Error('API error');
    const data = await response.json();
    const lines = data.choices[0].message.content.trim().split('\n').filter(l => l.trim());
    lines.forEach((desc, i) => {
      if (npcs[i]) npcs[i].aiDescription = desc.trim();
    });
  } catch(e) {
    console.warn('Batch NPC desc AI failed:', e);
  }
}

// 导出
window.enlightenmentPoint = enlightenmentPoint;
window.addEnlightenmentPoint = addEnlightenmentPoint;
window.openSkillCreation = openSkillCreation;
window.createCustomSkill = createCustomSkill;
window.triggerEnlightenmentFromCultivation = triggerEnlightenmentFromCultivation;
window.triggerEnlightenmentFromCombat = triggerEnlightenmentFromCombat;
window.triggerEnlightenmentFromExplore = triggerEnlightenmentFromExplore;
window.generateNPCDialog = generateNPCDialog;
window.generateAISkillDescription = generateAISkillDescription;
window.batchGenerateNPCDescriptions = batchGenerateNPCDescriptions;

// ==========================
// 🔧 自创功法数值补强（旧存档兼容）
// 品质保留（代表当初机缘），数值刷新到当前境界标准
// 练气期自创的凡级功法，到金丹期自动补强（+5 → 当前境界凡级标准）
// 但品质仍是凡级，不如金丹期新自创的地级/天级——品质=天赋，数值=实力
// ==========================
function boostCustomSkillEffects(p) {
  try {
    if (!p || !p.skills || !p.skills.length) return 0;
    if (typeof SKILL_DB === 'undefined') return 0;
    const realmIdx = p.qiRealmIndex || 0;
    // 境界系数（与 buildCustomSkillFromPool 一致）
    const realmScale = 1 + realmIdx * 0.2;
    const scale = (v) => Math.round(v * realmScale);
    const scalePct = (v) => Math.min(0.9, v * (1 + realmIdx * 0.02));
    const qOrder = ['凡级','灵级','地级','天级','圣级','神级'];
    let boosted = 0;
    for (const sk of p.skills) {
      if (!sk || typeof sk.id !== 'string' || !sk.id.startsWith('custom_')) continue;
      const sd = SKILL_DB.find(d => d.id === sk.id);
      if (!sd || !sd.effects) continue;
      const qIdx = qOrder.indexOf(sd.quality);
      if (qIdx < 0) continue;
      const type = sd.type;
      const element = sd.element || '无';
      // 从预制池找模板（老功法字段可能缺，用池子标准补强）
      const tmpl = (typeof CUSTOM_POOL_EFFECTS !== 'undefined' && CUSTOM_POOL_EFFECTS[type] && CUSTOM_POOL_EFFECTS[type][element]) || null;
      if (!tmpl) continue;  // 非池子功法（旧随机名）跳过
      const v = (arr) => arr[qIdx];
      const eff = sd.effects;
      const ensure = (key, want) => {
        if (eff[key] === undefined || eff[key] < want) { eff[key] = want; return true; }
        return false;
      };
      let changed = false;
      // 攻伐术
      if (type === '攻伐术') {
        changed = ensure('attackBonus', scale(v(tmpl.attack))) || changed;
        if (tmpl.crit) changed = ensure('critRate', scalePct(v(tmpl.crit))) || changed;
        if (tmpl.lifesteal) changed = ensure('lifesteal', scalePct(v(tmpl.lifesteal))) || changed;
        if (tmpl.freeze) changed = ensure('freeze', scalePct(v(tmpl.freeze))) || changed;
        if (tmpl.burn) changed = ensure('burn', scalePct(v(tmpl.burn))) || changed;
        if (tmpl.stun) changed = ensure('stun', scalePct(v(tmpl.stun))) || changed;
      }
      // 护体诀
      else if (type === '护体诀') {
        changed = ensure('defenseBonus', scale(v(tmpl.def))) || changed;
        changed = ensure('hpBonus', scale(v(tmpl.hp))) || changed;
        if (tmpl.dodge) changed = ensure('dodge', scalePct(v(tmpl.dodge))) || changed;
        if (tmpl.reflect) changed = ensure('reflectChance', scalePct(v(tmpl.reflect))) || changed;
      }
      // 身法
      else if (type === '身法') {
        changed = ensure('dodge', scalePct(v(tmpl.dodge))) || changed;
        changed = ensure('exploreBonus', scalePct(v(tmpl.explore))) || changed;
        if (tmpl.atk) changed = ensure('attackBonus', scale(v(tmpl.atk))) || changed;
        if (tmpl.def) changed = ensure('defenseBonus', scale(v(tmpl.def))) || changed;
      }
      // 疗伤法
      else if (type === '疗伤法') {
        changed = ensure('hpRegen', scale(v(tmpl.hpRegen))) || changed;
        changed = ensure('qiRegen', scale(v(tmpl.qiRegen))) || changed;
        if (tmpl.hp) changed = ensure('hpBonus', scale(v(tmpl.hp))) || changed;
        if (tmpl.def) changed = ensure('defenseBonus', scale(v(tmpl.def))) || changed;
      }
      // 秘术（combat 子对象）
      else if (type === '秘术') {
        if (!eff.combat) eff.combat = {};
        const c = eff.combat;
        if (tmpl.armorPierce) { const want = scalePct(v(tmpl.armorPierce)); if (c.armorPierce === undefined || c.armorPierce < want) { c.armorPierce = want; changed = true; } }
        if (tmpl.lifesteal) { const want = scalePct(v(tmpl.lifesteal)); if (c.lifesteal === undefined || c.lifesteal < want) { c.lifesteal = want; changed = true; } }
        if (tmpl.freeze) { const want = scalePct(v(tmpl.freeze)); if (c.freeze === undefined || c.freeze < want) { c.freeze = want; changed = true; } }
        if (tmpl.burn) { const want = scalePct(v(tmpl.burn)); if (c.burn === undefined || c.burn < want) { c.burn = want; changed = true; } }
        if (tmpl.shield) { const want = scalePct(v(tmpl.shield)); if (c.shield === undefined || c.shield < want) { c.shield = want; changed = true; } }
        if (tmpl.wisdom) { const want = v(tmpl.wisdom); if (eff.wisdomBonus === undefined || eff.wisdomBonus < want) { eff.wisdomBonus = want; changed = true; } }
      }
      // 阵道
      else if (type === '阵道') {
        changed = ensure('defenseBonus', scale(v(tmpl.def))) || changed;
        changed = ensure('damageReduce', scalePct(v(tmpl.dmgReduce))) || changed;
        changed = ensure('reflectChance', scalePct(v(tmpl.reflect))) || changed;
        if (eff.reflectRate === undefined) { eff.reflectRate = 0.35; changed = true; }
      }
      // 丹道
      else if (type === '丹道') {
        changed = ensure('alchemyBonus', scalePct(v(tmpl.alchemy))) || changed;
        changed = ensure('pillBonus', scalePct(v(tmpl.pill))) || changed;
        if (tmpl.wisdom) changed = ensure('wisdomBonus', v(tmpl.wisdom)) || changed;
      }
      // 🔧 2026-08-04：吐纳法/炼体术/心法
      else if (type === '吐纳法') {
        changed = ensure('cultivationSpeed', v(tmpl.cultSpeed)) || changed;
        changed = ensure('qiRegen', scale(v(tmpl.qiRegen))) || changed;
      }
      else if (type === '炼体术') {
        changed = ensure('bodyCultSpeed', v(tmpl.bodyCult)) || changed;
        changed = ensure('hpBonus', scale(v(tmpl.hp))) || changed;
        changed = ensure('defenseBonus', scale(v(tmpl.def))) || changed;
      }
      else if (type === '心法') {
        changed = ensure('wisdomBonus', v(tmpl.wisdom)) || changed;
        changed = ensure('moodRegen', v(tmpl.moodRegen)) || changed;
      }
      if (changed) boosted++;
    }
    if (boosted > 0) {
      // 重算属性
      if (typeof recalcStats === 'function') recalcStats(p);
    }
    return boosted;
  } catch(e) { return 0; }
}
window.boostCustomSkillEffects = boostCustomSkillEffects;
