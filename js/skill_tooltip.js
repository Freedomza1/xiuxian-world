// ==========================
// 功法效果文字 & 悬停对比
// ==========================

// 效果 → 自然语言
function describeEffects(effects) {
  if (!effects) return '无效果';
  const lines = [];
  if (effects.cultivationSpeed)
    lines.push('🧘 修炼速度 ' + (effects.cultivationSpeed >= 1 ? '+' + Math.round((effects.cultivationSpeed - 1) * 100) : Math.round((effects.cultivationSpeed - 1) * 100)) + '%');
  if (effects.qiRegen) lines.push('⛽ 灵力恢复 +' + effects.qiRegen);
  if (effects.hpRegen) lines.push('💚 气血恢复 +' + effects.hpRegen);
  if (effects.attackBonus) lines.push('⚔️ 攻击力 +' + effects.attackBonus);
  if (effects.defenseBonus) lines.push('🛡️ 防御力 +' + effects.defenseBonus);
  if (effects.hpBonus) lines.push('❤️ 气血上限 +' + effects.hpBonus);  // 🔧 自创护体诀用 hpBonus
  if (effects.qiLimit) lines.push('🔵 灵力上限 +' + effects.qiLimit);
  if (effects.hpLimit) lines.push('❤️ 气血上限 +' + effects.hpLimit);
  if (effects.critRate) lines.push('⚡ 暴击率 +' + Math.round(effects.critRate * 100) + '%');
  if (effects.stun) lines.push('💥 眩晕率 +' + Math.round(effects.stun * 100) + '%');
  // 🔧 攻伐术顶层特殊效果（自创池攻伐：噬灵/凝霜/焚心）
  if (effects.lifesteal) lines.push('🩸 噬灵 +' + Math.round(effects.lifesteal * 100) + '%');
  if (effects.freeze) lines.push('🧊 凝霜 ' + Math.round(effects.freeze * 100) + '%');
  if (effects.burn) lines.push('🔥 焚心 ' + Math.round(effects.burn * 100) + '%');
  if (effects.dodge) lines.push('💨 闪避率 +' + Math.round(effects.dodge * 100) + '%');
  if (effects.breakChance) lines.push('🔓 突破率 +' + Math.round(effects.breakChance * 100) + '%');
  if (effects.exploreBonus) lines.push('🔍 探索效率 +' + Math.round(effects.exploreBonus * 100) + '%');
  // 🔧 自创阵道：减伤/反伤
  if (effects.damageReduce) lines.push('🛡️ 减伤 +' + Math.round(effects.damageReduce * 100) + '%');
  if (effects.reflectChance) lines.push('🪞 反弹几率 +' + Math.round(effects.reflectChance * 100) + '%（反弹' + Math.round((effects.reflectRate||0.35) * 100) + '%伤害）');
  // 🔧 自创丹道：炼丹加成
  if (effects.alchemyBonus) lines.push('⚗️ 炼丹成功率 +' + Math.round(effects.alchemyBonus * 100) + '%');
  if (effects.pillBonus) lines.push('💊 丹药效果 +' + Math.round(effects.pillBonus * 100) + '%');
  // 🔧 自创秘术：五行特殊战斗效果
  if (effects.combat) {
    const c = effects.combat;
    if (c.armorPierce) lines.push('🗡️ 破甲 +' + Math.round(c.armorPierce * 100) + '%');
    if (c.lifesteal) lines.push('🩸 噬灵 +' + Math.round(c.lifesteal * 100) + '%');
    if (c.freeze) lines.push('🧊 凝霜 ' + Math.round(c.freeze * 100) + '%');
    if (c.burn) lines.push('🔥 焚心 ' + Math.round(c.burn * 100) + '%');
    if (c.shield) lines.push('🏔️ 镇岳护盾 ' + Math.round(c.shield * 100) + '%');
  }
  // 🔧 自创秘术/丹道：悟性加成
  if (effects.wisdomBonus) lines.push('🧠 悟性 +' + effects.wisdomBonus);
  // 🔧 特殊功能说明（自创秘术/阵道/丹道）
  if (effects.special) lines.push('📜 ' + effects.special);
  if (effects.maxAge) lines.push('⌛ 寿命 +' + effects.maxAge + '年');
  if (effects.elementDamage) {
    const icons = { fire:'🔥', water:'💧', earth:'⛰️', wood:'🌿', metal:'⚔️', lightning:'⚡' };
    for (const [el, val] of Object.entries(effects.elementDamage))
      if (val) lines.push((icons[el]||'✨') + el + '伤害 +' + Math.round(val*100) + '%');
  }
  if (effects.hpRecovery) lines.push('💚 休息恢复HP +' + Math.round(effects.hpRecovery*100)+'%');
  if (effects.qiRecovery) lines.push('⛽ 休息恢复灵力 +' + Math.round(effects.qiRecovery*100)+'%');
  if (effects.hpMult) lines.push('❤️ 气血倍率 ×' + effects.hpMult);
  if (effects.qiMult) lines.push('🔵 灵力倍率 ×' + effects.qiMult);
  if (effects.defMult) lines.push('🛡️ 防御倍率 ×' + effects.defMult);
  if (effects.qiCost) lines.push('💠 灵力消耗 -' + Math.round((1 - effects.qiCost)*100) + '%');
  return lines.join('\n') || '📜 特殊效果';
}

// 对比槽位中已有功法的效果差值（不含五行/熟练度影响）
function getComparisonText(skillId) {
  const p = G.player;
  const sk = p.skills.find(s => s.id === skillId);
  if (!sk) return '';
  const slotMap = { '吐纳法':'tuna','炼体术':'lianti','攻伐术':'gongfa','护体诀':'huti','身法':'shenfa','疗伤法':'liaoshang','秘术':'mishu','心法':'xinfa' };
  const slot = slotMap[sk.type];
  if (!slot) return '';
  const currId = p.skillSlots && p.skillSlots[slot];
  if (!currId || currId === skillId) return '';
  const curr = p.skills.find(s => s.id === currId);
  if (!curr) return '';

  const skillDb = (typeof SKILL_DB !== 'undefined' ? SKILL_DB : []);
  const sd = skillDb.find(d => d.id === skillId);
  const cd = skillDb.find(d => d.id === currId);
  if (!sd || !cd) return '';

  const se = sd.effects || {};
  const ce = cd.effects || {};
  const lines = ['━━━ 对比 · 当前『' + curr.name + '』 ━━━'];
  let hasDiff = false;

  const fields = [
    ['🧘 修炼速度', 'cultivationSpeed', (v) => Math.round(((v||0)-1)*100) + '%'],
    ['⚔️ 攻击力', 'attackBonus', (v) => (v||0)],
    ['🛡️ 防御力', 'defenseBonus', (v) => (v||0)],
    ['⛽ 灵力恢复', 'qiRegen', (v) => (v||0)],
    ['💚 气血恢复', 'hpRegen', (v) => (v||0)],
    ['🔵 灵力上限', 'qiLimit', (v) => (v||0)],
    ['❤️ 气血上限', 'hpLimit', (v) => (v||0)],
    ['⚡ 暴击率', 'critRate', (v) => Math.round((v||0)*100) + '%'],
    ['💨 闪避率', 'dodge', (v) => Math.round((v||0)*100) + '%'],
    ['🔓 突破率', 'breakChance', (v) => Math.round((v||0)*100) + '%'],
  ];

  for (const [label, key, fmt] of fields) {
    const sv = se[key] || 0;
    const cv = ce[key] || 0;
    if (sv !== cv) {
      const dirIcon = sv > cv ? '🔴▲' : '🟢▼';
      lines.push(dirIcon + ' ' + label + ' ' + ((typeof fmt(sv) === 'string') ? fmt(sv) : sv));
      hasDiff = true;
    }
  }

  if (!hasDiff) lines.push('⚖️ 数值相近');
  return lines.join('\n');
}
