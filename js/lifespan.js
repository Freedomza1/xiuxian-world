// === 唯我独仙 · 境界寿命·生死轮回·生命周期系统 ===

// ==========================
// 境界寿命表
// ==========================
const REALM_LIFESPANS = {
  // 境界        基础寿命   每层加成   说明
  '凡人':    { base: 60,  perLevel: 5,  unit: '年' },
  '炼体':    { base: 80,  perLevel: 8,  unit: '年' },
  '练气':    { base: 120, perLevel: 20, unit: '年' },
  '筑基':    { base: 400, perLevel: 100,unit: '年' },
  '金丹':    { base: 1000,perLevel: 300,unit: '年' },
  '元婴':    { base: 3000,perLevel: 800,unit: '年' },
  '化神':    { base: 10000,perLevel: 3000,unit: '年' },
  '真仙':    { base: 99999,perLevel: 0, unit: '年', immortal: true },
};

function getMaxAgeForRealm(qiIndex, bodyIndex) {
  // 取最高的境界计算寿命
  const qiRealm = QI_REALMS[qiIndex];
  const bodyRealm = BODY_REALMS[bodyIndex];
  
  let lifespan = REALM_LIFESPANS['凡人'].base;
  
  if (qiIndex >= 0) {
    const info = REALM_LIFESPANS['练气'];
    lifespan = Math.max(lifespan, info.base + qiIndex * info.perLevel);
  }
  if (bodyIndex >= 0) {
    const info = REALM_LIFESPANS['炼体'];
    lifespan = Math.max(lifespan, info.base + bodyIndex * info.perLevel);
  }
  
  // 筑基及以后
  if (qiIndex >= 6) { // 已经超出练气，按筑基算
    const info = REALM_LIFESPANS['筑基'];
    const extra = (qiIndex - 5) * info.perLevel;
    lifespan = Math.max(lifespan, info.base + extra);
  }
  if (qiIndex >= 9) { // 金丹
    const info = REALM_LIFESPANS['金丹'];
    const extra = (qiIndex - 8) * info.perLevel;
    lifespan = Math.max(lifespan, info.base + extra);
  }
  
  return Math.min(lifespan, 99999);
}

// ==========================
// NPC 生命周期扩展
// ==========================
function extendNPCWithLifecycle(npc) {
  if (npc._hasLifecycle) return;
  npc._hasLifecycle = true;
  
  // 出生
  npc.birthDay = G.time.day;
  npc.birthYear = 0; // 世界纪元
  npc.trueAge = npc.age || 16 + Math.floor(Math.random() * 30); // 实际年龄
  
  // 境界 & 寿命
  npc.maxAge = getMaxAgeForRealm(npc.qiRealmIndex || 0, npc.bodyRealmIndex || 0);
  if (npc.qiRealmIndex === 0 && npc.bodyRealmIndex === 0) {
    npc.maxAge = REALM_LIFESPANS['凡人'].base + Math.floor(Math.random() * 20);
    npc.trueAge = Math.min(npc.trueAge, npc.maxAge - 5);
  }
  
  // 家族
  npc.spouseId = null;
  npc.childIds = [];
  npc.parentIds = [];
  npc.daoPartnerId = null; // 道侣（区别于配偶）
  
  // 生命历程
  npc.lifeEvents = [{ day: G.time.day, event: `${npc.name}降临世间。` }];
  
  // 双修状态
  npc.dualCultivationCount = 0;
  npc.childrenCount = 0;
  
  // 是否在世
  npc.isAlive = true;
  npc.deathDay = null;
  npc.deathCause = null;
  npc.epitaph = null; // 墓志铭
  
  // 修为突破记录（简化）
  npc.breakthroughHistory = [];
}

// ==========================
// 世界时间推进 · NPC 衰老
// ==========================
function tickWorldLifecycle(passedDays) {
  if (!passedDays || passedDays < 1) return;
  
  const aliveNPCs = npcManager.npcs.filter(n => n.isAlive);
  
  aliveNPCs.forEach(npc => {
    if (!npc._hasLifecycle) extendNPCWithLifecycle(npc);
    
    npc.trueAge += passedDays / 365;
    
    // 寿元耗尽的死亡判定
    if (npc.trueAge >= npc.maxAge) {
      dieNPC(npc, '寿终正寝');
      return;
    }
    
    // 凡人NPC境界突破概率 (世界推进时自动尝试)
    if (npc.qiRealmIndex === 0 && npc.bodyRealmIndex === 0 && npc.trueAge > 20) {
      if (Math.random() < 0.005 * passedDays) { // 小概率突破
        const success = Math.random() < 0.3;
        if (success) {
          npc.qiRealmIndex = 1;
          npc.maxAge = getMaxAgeForRealm(1, 0);
          npc.lifeEvents.push({ day: G.time.day, event: `${npc.name}突破至练气一层！` });
        }
      }
    }
    
    // 高阶修士每N年尝试突破
    if (npc.qiRealmIndex >= 1 && npc.qiRealmIndex < 5) {
      if (Math.random() < 0.002 * passedDays) {
        const success = Math.random() < 0.4;
        if (success) {
          npc.qiRealmIndex++;
          npc.maxAge = getMaxAgeForRealm(npc.qiRealmIndex, npc.bodyRealmIndex);
          npc.lifeEvents.push({ day: G.time.day, event: `${npc.name}突破至${QI_REALMS[npc.qiRealmIndex]?.name || '更高境界'}！` });
        }
      }
    }
    
    // 凡人繁衍 (已婚、适龄)
    if (npc.spouseId && npc.trueAge > 20 && npc.trueAge < 45 && npc.qiRealmIndex === 0) {
      const spouse = npcManager.npcs.find(n => n.id === npc.spouseId);
      if (spouse && spouse.isAlive) {
        if (Math.random() < 0.003 * passedDays) {
          createNPCChild(npc, spouse);
        }
      }
    }
    
    // 道侣双修自动推进
    if (npc.daoPartnerId && Math.random() < 0.001 * passedDays) {
      const partner = npcManager.npcs.find(n => n.id === npc.daoPartnerId);
      if (partner && partner.isAlive) {
        // 双修微效
        npc.lifeEvents.push({ day: G.time.day, event: `${npc.name}与道侣${partner.name}双修论道。` });
        // 小概率生子
        if (Math.random() < 0.05 && npc.trueAge > 20 && npc.trueAge < 500) {
          createNPCChild(npc, partner);
        }
      }
    }
  });
  
  // 清理死亡NPC的互动引用
  cleanupDeadNPCs();
}

// ==========================
// NPC 死亡系统
// ==========================
function dieNPC(npc, cause) {
  npc.isAlive = false;
  npc.deathDay = G.time.day;
  npc.deathCause = cause;
  npc.lifeEvents.push({ day: G.time.day, event: `${npc.name}${cause}，享年${Math.round(npc.trueAge)}岁。` });
  
  // 生成墓志铭
  const realmName = QI_REALMS[npc.qiRealmIndex]?.name || '凡人';
  const genderPronoun = npc.gender === '男' ? '他' : '她';
  const spouseText = npc.spouseId ? `，育有${npc.childIds.length}子` : '，孑然一身';
  const daoText = npc.daoPartnerId ? `道侣${npcManager.npcs.find(n=>n.id===npc.daoPartnerId)?.name||'未知'}` : '独修仙途';
  
  npc.epitaph = `${npc.name}（${realmName}）${genderPronoun}一生${daoText}${spouseText}。${npc.trueAge}载修行，${cause}。`;
  
  // 记录到世界轶事
  if (typeof addNarrative === 'function') {
    addNarrative(`☠️ 【${npc.name}陨落】${npc.epitaph}`, 'system');
  }
  
  // 通知配偶/道侣
  if (npc.spouseId) {
    const spouse = npcManager.npcs.find(n => n.id === npc.spouseId);
    if (spouse && spouse.isAlive) {
      spouse.lifeEvents.push({ day: G.time.day, event: `伴侣${npc.name}${cause}。` });
      spouse.spouseId = null; // 丧偶
      spouse.mood = Math.max(0, (spouse.mood || 50) - 20);
    }
  }
  
  G.player.eventHistory.push(`${npc.name}陨落（${cause}）`);
}

// ==========================
// 后代系统
// ==========================
function createNPCChild(parent1, parent2) {
  if (!parent1 || !parent2) return null;
  
  // 性别
  const gender = Math.random() < 0.52 ? '男' : '女';
  const isMale = gender === '男';
  
  // 姓氏：取父方（东方惯例）
  const surnames = isMale ? NPC_SURNAMES_MALE : NPC_SURNAMES_FEMALE;
  const givenNames = isMale ? NPC_GIVEN_MALE : NPC_GIVEN_FEMALE;
  // 50%概率继承父姓，50%随机
  const surname = Math.random() < 0.5 ? 
    (parent1.name.charAt(0)) : 
    surnames[Math.floor(Math.random() * surnames.length)];
  const given = givenNames[Math.floor(Math.random() * givenNames.length)];
  const name = surname + given;
  
  // 继承灵根：父母灵根各取一部分
  let parentRoots = [];
  if (parent1.spiritRoot) parentRoots = parentRoots.concat(parent1.spiritRoot);
  // 尝试从父母技能中推断灵根
  const childRootCount = 1 + Math.floor(Math.random() * 2); // 1-2根
  const allRoots = ['金','木','水','火','土'];
  const shuffled = [...allRoots].sort(() => Math.random() - 0.5);
  const childRoots = shuffled.slice(0, childRootCount);
  
  // 资质：父母平均值±随机浮动
  const childLuck = Math.round(((parent1.luck || 50) + (parent2.luck || 50)) / 2 + (Math.random() * 20 - 10));
  const childWisdom = Math.round(((parent1.wisdom || 50) + (parent2.wisdom || 50)) / 2 + (Math.random() * 20 - 10));
  const childBone = Math.round(((parent1.bone || 50) + (parent2.bone || 50)) / 2 + (Math.random() * 20 - 10));
  
  // 生成NPC
  const childNPC = generateNPC(parent1.sceneId, gender);
  childNPC.name = name;
  childNPC.trueAge = 0;
  childNPC.age = 0;
  childNPC.spiritRoot = childRoots;
  childNPC.luck = Math.min(100, Math.max(5, childLuck));
  childNPC.wisdom = Math.min(100, Math.max(5, childWisdom));
  childNPC.bone = Math.min(100, Math.max(5, childBone));
  childNPC.parentIds = [parent1.id, parent2.id];
  childNPC.qiRealmIndex = 0;
  childNPC.bodyRealmIndex = 0;
  childNPC.maxAge = REALM_LIFESPANS['凡人'].base + Math.floor(Math.random() * 20);
  childNPC._hasLifecycle = true;
  childNPC.lifeEvents = [{ day: G.time.day, event: `${name}降生，父${parent1.name}、母${parent2.name}。` }];
  childNPC.isAlive = true;
  childNPC.childIds = [];
  childNPC.spouseId = null;
  childNPC.daoPartnerId = null;
  childNPC.role = '孩童';
  childNPC.background = `${parent1.name}${parent2.name ? '与' + parent2.name : ''}之子`;
  
  // 关联父母
  npcManager.npcs.push(childNPC);
  parent1.childIds.push(childNPC.id);
  parent2.childIds.push(childNPC.id);
  
  const p1Name = parent1.name;
  const p2Name = parent2.name;
  addNarrative(`👶 【添丁】${p1Name}与${p2Name}诞下一${gender}，取名${name}！`, 'event');
  G.player.eventHistory.push(`${p1Name}与${p2Name}生子${name}`);
  
  return childNPC;
}

// ==========================
// 清理死亡NPC
// ==========================
function cleanupDeadNPCs() {
  const dead = npcManager.npcs.filter(n => !n.isAlive);
  // 保留最多20个死亡记录，多余的归档
  // 不删除，只标记
}

// ==========================
// 玩家后代功能
// ==========================
function createPlayerChild(partnerNPC) {
  if (!partnerNPC || !partnerNPC.isAlive) {
    addNarrative('道侣已不在人世……', 'system');
    return null;
  }
  
  const p = G.player;
  const gender = Math.random() < 0.52 ? '男' : '女';
  const isMale = gender === '男';
  
  const surnames = isMale ? NPC_SURNAMES_MALE : NPC_SURNAMES_FEMALE;
  const givenNames = isMale ? NPC_GIVEN_MALE : NPC_GIVEN_FEMALE;
  const given = givenNames[Math.floor(Math.random() * givenNames.length)];
  const name = p.name.charAt(0) + given;
  
  // 继承玩家灵根（1-2根）
  const parentRoots = p.spiritRoots || [];
  const childRoots = parentRoots.length > 0 
    ? [parentRoots[Math.floor(Math.random() * parentRoots.length)]]
    : ['金'];
  if (parentRoots.length > 1 && Math.random() < 0.3) {
    childRoots.push(parentRoots[Math.floor(Math.random() * parentRoots.length)]);
  }
  
  const childLuck = Math.round((p.luck + partnerNPC.luck) / 2 + Math.random() * 15 - 5);
  const childWisdom = Math.round((p.wisdom + partnerNPC.wisdom) / 2 + Math.random() * 15 - 5);
  const childBone = Math.round((p.bone + partnerNPC.bone) / 2 + Math.random() * 15 - 5);
  
  const child = generateNPC(G.currentScene, gender);
  child.name = name;
  child.trueAge = 0;
  child.age = 0;
  child.spiritRoot = childRoots;
  child.luck = Math.min(100, Math.max(5, childLuck));
  child.wisdom = Math.min(100, Math.max(5, childWisdom));
  child.bone = Math.min(100, Math.max(5, childBone));
  child.parentIds = ['player', partnerNPC.id];
  child.qiRealmIndex = 0;
  child.bodyRealmIndex = 0;
  child.maxAge = REALM_LIFESPANS['凡人'].base + Math.floor(Math.random() * 20);
  child._hasLifecycle = true;
  child.lifeEvents = [{ day: G.time.day, event: `${name}降生，父/母为夜如水，母/父${partnerNPC.name}。` }];
  child.isAlive = true;
  child.childIds = [];
  child.spouseId = null;
  child.daoPartnerId = null;
  child.role = p.name + '之子/女';
  child.background = `修仙者${p.name}的后代`;
  child.aiDescription = `${p.name}与${partnerNPC.name}的孩子，眉眼间有几分父母的影子。`;
  
  npcManager.npcs.push(child);
  partnerNPC.childIds.push(child.id);
  partnerNPC.childrenCount = (partnerNPC.childrenCount || 0) + 1;
  
  addNarrative(`👶 【天降麟儿】${partnerNPC.name}为你诞下一${gender}！取名${name}。`, 'event');
  G.player.eventHistory.push(`与${partnerNPC.name}生子${name}`);
  G.player.mood = Math.min(100, G.player.mood + 25);
  updateAllUI();
  
  return child;
}

// ==========================
// 双修系统（玩家与NPC）
// ==========================
function dualCultivateWithNPC(npc) {
  if (!npc || !npc.isAlive) {
    addNarrative('此人已不在人世。', 'system');
    return;
  }
  
  const p = G.player;
  if (p.qi < 20 || p.hp < 20) {
    addNarrative('你精力不济，无法双修。', 'system');
    return;
  }
  
  // 异性检查（必须有道侣关系才能双修）
  if (npc.daoPartnerId !== 'player') {
    if (npc.gender === p.gender) {
      addNarrative('双修需阴阳调和，同性之间……难以共鸣。', 'system');
      return;
    }
    addNarrative(`${npc.name}并非你的道侣，不便双修。`, 'system');
    return;
  }
  
  // 消耗
  p.qi = Math.max(0, p.qi - 20);
  p.hp = Math.max(0, p.hp - 15);
  
  // 合欢诀加成检测
  let dualMult = 1.0;
  if (p.skillSlots && p.skillSlots.xinfa === 'shuangxiu_jue') {
    const sk = p.skills.find(s => s.id === 'shuangxiu_jue');
    if (sk && sk.active) {
      const sd = (G.skillData || SKILL_DB || []).find(d => d.id === 'shuangxiu_jue');
      if (sd && sd.effects && sd.effects.dualCultivationBonus) {
        dualMult = sd.effects.dualCultivationBonus;
      }
    }
  }
  
  // 双修收益
  const qiGain = Math.floor((30 + Math.random() * 30 + npc.qiRealmIndex * 5) * dualMult);
  const bodyGain = Math.floor((20 + Math.random() * 20 + npc.bodyRealmIndex * 5) * dualMult);
  const moodGain = 10 + Math.floor(Math.random() * 10);
  
  if (typeof gainCultivation === 'function') gainCultivation('qi', qiGain);
  else p.qiCultivationPoints += qiGain;
  if (typeof gainCultivation === 'function') gainCultivation('body', bodyGain);
  else p.bodyCultivationPoints += bodyGain;
  p.mood = Math.min(100, p.mood + moodGain);
  npc.affinity = Math.min(100, npc.affinity + 5);
  npc.dualCultivationCount = (npc.dualCultivationCount || 0) + 1;
  
  // AI叙事
  const dualFlavors = [
    `你与${npc.name}双修阴阳，灵力在二人之间流转不息。`,
    `山洞中，${npc.name}运起心法，与你气息交融。阴阳二气循环不息，修为大进。`,
    `双修法阵亮起柔和的光晕，${npc.name}的面容在灵光中愈显温润。你们的灵力如水乳交融。`,
  ];
  addNarrative(dualFlavors[Math.floor(Math.random() * dualFlavors.length)], 'narr-event');
  const bonusText = dualMult > 1.0 ? ` ✨ 合欢诀加成 x${dualMult}` : '';
  addNarrative(`炼气+${qiGain} 炼体+${bodyGain} 心境+${moodGain}${bonusText}`, 'system');
  
  // 后代概率
  const isDaoOrMarried = npc.daoPartnerId === 'player' || npc.spouseId === 'player';
  if (isDaoOrMarried && Math.random() < 0.12) {
    createPlayerChild(npc);
  }
  
  recalcStats(p);
  updateAllUI();
}

// ==========================
// 婚约/道侣系统
// ==========================
function proposeDaoPartnership(npc) {
  if (!npc || !npc.isAlive) return;
  
  // 异性检查
  if (npc.gender === G.player.gender) {
    addNarrative(`【${npc.name}】（略显尴尬）你我皆为${npc.gender === '男' ? '男子' : '女子'}，结为道侣……恐怕不妥。`, 'narr-event');
    return;
  }
  
  if (npc.affinity < 60) {
    addNarrative(`【${npc.name}】抱歉，你我尚未相知至此。`, 'narr-event');
    return;
  }
  
  // 玩家一方
  if (npc.daoPartnerId === 'player') {
    addNarrative(`${npc.name}已是你道侣，无需再约。`, 'system');
    return;
  }
  
  // 好感度检查
  const success = npc.affinity >= 80 || Math.random() < (npc.affinity - 40) / 60;
  if (success) {
    npc.daoPartnerId = 'player';
    npc.affinity = Math.min(100, npc.affinity + 15);
    G.player.mood = Math.min(100, G.player.mood + 15);
    addNarrative(`🌸 【缔结道侣】${npc.name}含羞点头，与你结为道侣！`, 'event');
    G.player.eventHistory.push(`与${npc.name}结为道侣`);
    
    // 如果NPC已有配偶，写一段三角情境
    if (npc.spouseId) {
      const spouse = npcManager.npcs.find(n => n.id === npc.spouseId);
      if (spouse) {
        addNarrative(`但${npc.name}已有配偶${spouse.name}……此事恐怕不会轻易了结。`, 'default');
      }
    }
  } else {
    addNarrative(`【${npc.name}】${
      ['此事还需从长计议。','我现在只愿专心修行。','你……让我考虑考虑。'][Math.floor(Math.random()*3)]}`, 'narr-event');
    npc.affinity = Math.max(0, npc.affinity - 3);
  }
  updateAllUI();
}

// ==========================
// NPC 生平记录查看
// ==========================
function showNPCBiography(npc) {
  if (!npc._hasLifecycle) extendNPCWithLifecycle(npc);
  
  const genderIcon = npc.gender === '男' ? '👤' : '👩';
  const realmName = QI_REALMS[npc.qiRealmIndex]?.name || '凡人';
  const bodyName = BODY_REALMS[npc.bodyRealmIndex]?.name || '';
  const aliveness = npc.isAlive ? '🟢 在世' : `💀 已陨 (${npc.deathCause || '未知'})`;
  const spouseName = npc.spouseId ? npcManager.npcs.find(n=>n.id===npc.spouseId)?.name : null;
  const partnerName = npc.daoPartnerId === 'player' ? '你' : (npc.daoPartnerId ? npcManager.npcs.find(n=>n.id===npc.daoPartnerId)?.name : null);
  const childCount = npc.childIds?.length || 0;
  const childList = npc.childIds?.map(id => npcManager.npcs.find(n=>n.id===id)?.name).filter(Boolean).join('、') || '无';
  
  let html = `
    <div style="margin-bottom:8px;">
      <div>${genderIcon} <b>${npc.name}</b> ${aliveness}</div>
      <div style="font-size:12px;color:var(--text-dim);">${realmName}${bodyName ? ' · ' + bodyName : ''} | ${npc.role} | ${npc.personality}</div>
      <div style="font-size:12px;color:var(--text-dim);">年龄：${Math.round(npc.trueAge)}岁 / 寿元：${npc.maxAge}年</div>
    </div>
    <div style="font-size:12px;line-height:1.8;margin-bottom:8px;">
      ${npc.spouseId ? `<div>💍 配偶：${spouseName}</div>` : ''}
      ${partnerName ? `<div>🌸 道侣：${partnerName}</div>` : ''}
      ${childCount > 0 ? `<div>👶 子女(${childCount})：${childList}</div>` : ''}
      <div>🤝 好感度：${npc.affinity}</div>
      <div>📜 双修次数：${npc.dualCultivationCount || 0}</div>
    </div>
    ${npc.epitaph ? `<div style="font-style:italic;color:var(--text-dim);padding:6px;background:rgba(0,0,0,0.2);border-radius:4px;margin-bottom:8px;">${npc.epitaph}</div>` : ''}
    <div style="font-size:11px;color:var(--text-dim);">
      <b>生平大事：</b><br>
      ${npc.lifeEvents?.slice(-8).map(e => `· 第${e.day}日：${e.event}`).join('<br>') || '尚无记录'}
    </div>
  `;
  
  showCustomModal(`📜 ${npc.name} · 生平`, html);
}

// ==========================
// 生死簿 (已故人物录)
// ==========================
function showDeathRoll() {
  const deadNPCs = npcManager.npcs.filter(n => !n.isAlive);
  if (deadNPCs.length === 0) {
    showCustomModal('📖 生死簿', '<p style="color:var(--text-dim)">尚未有人陨落。</p>');
    return;
  }
  
  let html = `<p style="margin-bottom:8px;">已故人物 (${deadNPCs.length})：</p>`;
  deadNPCs.slice().reverse().slice(0, 20).forEach(n => {
    const realmName = QI_REALMS[n.qiRealmIndex]?.name || '凡人';
    html += `<div class="npc-card" onclick="showNPCBiography('${n.id}')">
      <div class="npc-card-header"><span>💀 ${n.name}</span><span style="font-size:11px;">${realmName}</span></div>
      <div class="npc-card-desc">${n.epitaph || n.deathCause || '无记载'}</div>
    </div>`;
  });
  showCustomModal('📖 生死簿 · 已故人物录', html);
}

// ==========================
// 世界生命报告
// ==========================
function showWorldLifeReport() {
  const alive = npcManager.npcs.filter(n => n.isAlive);
  const dead = npcManager.npcs.filter(n => !n.isAlive);
  const children = npcManager.npcs.filter(n => n._hasLifecycle && n.trueAge < 10);
  const elderly = npcManager.npcs.filter(n => n.isAlive && n.trueAge > 0.8 * n.maxAge);
  const couples = npcManager.npcs.filter(n => n.spouseId && n.isAlive);
  const daoPartners = npcManager.npcs.filter(n => n.daoPartnerId && n.isAlive);
  
  // 按境界分布
  const realmDist = {};
  alive.forEach(n => {
    const r = QI_REALMS[n.qiRealmIndex]?.name || '凡人';
    realmDist[r] = (realmDist[r] || 0) + 1;
  });
  
  let html = `
    <div style="margin-bottom:8px;">
      <b>🌍 世界生命报告</b>
    </div>
    <div style="font-size:12px;line-height:1.8;">
      <div>👥 在世：${alive.length}人</div>
      <div>💀 已故：${dead.length}人</div>
      <div>👶 幼童：${children.length}人</div>
      <div>👴 寿元将尽：${elderly.length}人</div>
      <div>💍 已婚：${couples.length / 2}对</div>
      <div>🌸 道侣：${daoPartners.length}人</div>
    </div>
    <div style="font-size:12px;margin-top:8px;">
      <b>境界分布：</b><br>
      ${Object.entries(realmDist).sort((a,b) => {
        const idx = a => ['凡人','练气一层','练气二层','练气三层','练气四层','练气五层','练气六层'].indexOf(a);
        return idx(a[0]) - idx(b[0]);
      }).map(([k,v]) => `· ${k}: ${v}人`).join('<br>')}
    </div>
  `;
  showCustomModal('📊 世界生命报告', html);
}

// ==========================
// 玩家寿终·转生轮回
// ==========================
function triggerReincarnation() {
  var p = G.player;
  if (!p) return;
  
  addNarrative('', 'system');
  addNarrative('━'.repeat(25), 'system');
  addNarrative('☠️ 大限已至。', 'event');
  addNarrative('你感到身体越来越轻，意识渐渐模糊……', 'default');
  addNarrative('一生的画面在眼前闪过——那些年修炼的日日夜夜，黑风岭上浴血奋战，青云镇里的烟火人间。', 'default');
  addNarrative('一切，都要结束了。', 'default');
  addNarrative('但你的道心并未泯灭。', 'default');
  addNarrative('', 'system');
  addNarrative('恍惚间，你看到了一道光。', 'default');
  addNarrative('那是天地轮回之力，在冥冥中感应到了你不甘的意志。', 'default');
  addNarrative('', 'system');
  addNarrative('━━━ 🌀 轮回转世 ━━━', 'event');
  
  // 轮回保留的特性
  var savedSoul = {
    spiritRoots: p.spiritRoots ? p.spiritRoots.slice() : ['金'],
    luck: Math.min(100, Math.round((p.luck || 50) * 0.6)),
    wisdom: Math.min(100, Math.round((p.wisdom || 50) * 0.5)),
    bone: Math.min(100, Math.round((p.bone || 50) * 0.5)),
    talisman: p.talent ? Math.max(0.6, p.talent * 0.5) : 0.6,
    memories: Math.floor(Math.random() * 3) // 前世记忆碎片
  };
  
  addNarrative(`前世种种，如烟云消散。`, 'system');
  addNarrative(`但你的灵根并未断绝——${savedSoul.spiritRoots.join('、')}之资仍在天命中流转。`, 'system');
  var fateTexts = [
    '一缕残魂投入轮回井中，天地旋转……',
    '你感到灵魂被一股温柔的力量牵引，飘向未知的方向……',
    '冥冥之中，似有大道之音在回荡："轮回不灭，道心不死。"',
  ];
  addNarrative(fateTexts[Math.floor(Math.random() * fateTexts.length)], 'default');
  
  // 清除游戏状态但保留部分灵魂印记
  p.qiRealmIndex = 0;
  p.bodyRealmIndex = 0;
  p.qiCultivationPoints = 0;
  p.bodyCultivationPoints = 0;
  p.age = 16;
  p.maxAge = getMaxAgeForRealm(0, 0);
  p.spiritRoots = savedSoul.spiritRoots;
  p.luck = savedSoul.luck;
  p.wisdom = savedSoul.wisdom;
  p.bone = savedSoul.bone;
  p.talent = savedSoul.talisman;
  p.talentLabel = p.talent >= 1.22 ? '天才' : (p.talent >= 1.08 ? '上等' : (p.talent >= 0.94 ? '尚佳' : (p.talent >= 0.80 ? '普通' : '平庸')));
  p.isAlive = true;
  p.mood = 50;
  
  // 修为归零
  p.qi = 100; p.maxQi = 100;
  p.hp = 100; p.maxHp = 100;
  p.attack = 10; p.defense = 8;
  p.stones = 50;
  p.inventory = [];
  p.skills = [];
  p.skillSlots = {};
  p.equipment = {};
  
  // ⚠️ 强制停止自动模式（转世后空身状态不适合继续挂机）
  if (typeof stopAutoMode === 'function') {
    try { stopAutoMode(); } catch(e) {}
  } else if (typeof G !== 'undefined' && G) {
    G.autoMode = false; G._autoMode = false;
  }
  
  // 清除寿元警告标记
  delete p._lifeDeathWarned;
  delete p._lifeCriticalWarned;
  delete p._lifeYellowWarned;
  delete p._lifeMidWarned;
  
  addNarrative('', 'system');
  addNarrative('━━━ 🌱 新生 ━━━', 'event');
  addNarrative('你睁开了眼睛。', 'default');
  
  var rebirthDesc = [
    '又回到了青云镇的老槐树下。阳光透过树叶的缝隙洒下，暖洋洋的。',
    '清风拂面，你发现自己躺在灵云峰的山脚——天地依旧广阔，你又有了从头再来的机会。',
    '潺潺水声中醒来，竟是碧波湖畔。远处青云镇的炊烟袅袅升起。',
  ];
  addNarrative(rebirthDesc[Math.floor(Math.random() * rebirthDesc.length)], 'default');
  
  var soulMemoryText = savedSoul.memories > 0
    ? `冥冥中，你似乎还残留着前世的零碎记忆(${savedSoul.memories}片)……`
    : '前世的一切都已遗忘。但道心的悸动还在——也许这就是轮回的意义。';
  addNarrative(soulMemoryText, 'default');
  
  addNarrative(`天赋「${p.talentLabel}」 · 修炼速度 ×${(p.talent || 1).toFixed(2)}（前世道基折半）`, 'system');
  addNarrative('━'.repeat(25), 'system');
  
  updateAllUI();
}

// 导出
window.triggerReincarnation = triggerReincarnation;
window.getMaxAgeForRealm = getMaxAgeForRealm;
window.extendNPCWithLifecycle = extendNPCWithLifecycle;
window.tickWorldLifecycle = tickWorldLifecycle;
window.dieNPC = dieNPC;
window.createNPCChild = createNPCChild;
window.createPlayerChild = createPlayerChild;
window.dualCultivateWithNPC = dualCultivateWithNPC;
window.proposeDaoPartnership = proposeDaoPartnership;
window.showNPCBiography = showNPCBiography;
window.showDeathRoll = showDeathRoll;
window.showWorldLifeReport = showWorldLifeReport;
