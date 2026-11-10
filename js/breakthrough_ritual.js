// === 唯我独仙 · 突破仪式系统 ===
// 让突破有"身体感"：不是一张卡片，而是一场天地与身体的对话
// 三幕式：引气 → 冲关 → 蜕变
// 自动模式下自动跳过动画，秒结算

// ── 境界专属蜕变描写 ──
const REALM_TRANSFORM = {
  // 练气
  '练气一层': '你体内第一缕真气破土而出，如春芽顶开冻土。经脉中传来细微的轰鸣——那是气海初开的声音。',
  '练气二层': '真气在经脉中流转一周，四肢百骸泛起暖意。你感觉耳聪目明，能听见百步外的虫鸣。',
  '练气三层': '气海扩张一圈，丹田深处凝出一团温润的气旋。你吐纳之间，隐隐与天地灵气呼应。',
  '练气四层': '真气如溪流汇成小河，在经脉中哗哗流淌。骨骼发出轻微的噼啪声，那是杂质被真气冲刷的声响。',
  '练气五层': '你内视丹田，气旋已如拳头大小，发出柔和的光。皮肤变得莹润，伤口愈合的速度肉眼可见。',
  '练气六层': '真气冲开三处滞涩的窍穴，通体舒畅。你隐约能感受到周围灵气流动的方向，如鱼儿感知水流。',
  '练气七层': '气旋凝实，中央出现一点星芒。你的目力骤增，昏暗处视物如同白昼。',
  '练气八层': '真气如长江大河，奔涌不息。你感觉浑身有用不完的力气，一跃数丈，落地无声。',
  '练气九层': '气海圆满，星芒渐亮。你周身灵气缭绕，呼吸间有风雷隐动——筑基的契机，已然浮现。',
  // 筑基
  '筑基初期': '天地灵气如潮水般涌入你的气海，丹田内响起一声清越的钟鸣。灵气化液，在丹田凝成一片小小的灵湖。你正式踏上了修行的正途。',
  '筑基中期': '灵湖扩大，湖心升起一座朦胧的道台虚影。你神识初成，能感知方圆百丈内的风吹草动。',
  '筑基后期': '道台凝实，灵湖波光粼粼。你的寿元大增，气血如龙，举手投足间有灵光隐现。',
  '筑基圆满': '灵湖满溢，道台辉煌。你已隐约触摸到金丹的门槛——金丹一成，寿五百载，从此天高海阔。',
  // 金丹
  '金丹初期': '灵湖倒卷，万千灵气疯狂涌入丹田中心。一声巨响在识海炸开，一枚金光灿灿的金丹缓缓凝聚——金丹大道，自此登堂入室！',
  '金丹中期': '金丹表面的纹路愈发玄奥，你举手投足间带起灵压，寻常修士在你面前甚至无法直视。',
  '金丹后期': '金丹内孕育着一缕神识之火，你一个念头便可笼罩整座山。寿元大增，可御剑飞行。',
  '金丹圆满': '金丹大圆满，紫府洞开。你已看到元婴之路在眼前展开——破丹成婴，一步登天。',
  // 元婴
  '元婴初期': '金丹轰然碎裂，一个巴掌大的婴儿在丹田中睁开了眼睛。元婴初啼，天地灵气为之震颤！',
  '元婴中期': '元婴凝实，面目与你一般无二。你神识如海，一念可覆盖百里山河。',
  '元婴后期': '元婴可离体遨游，日行万里。你的寿元暴涨，几乎与天地同寿。',
  '元婴圆满': '元婴圆满，周身道韵流转。你感受到化神之路的召唤——那是与天地法则的第一次亲密接触。',
  // 化神
  '化神初期': '元婴与神魂合一，你第一次"看见"了天地法则的丝线。举手投足间，已能引动天地之力。',
  '化神中期': '法则感悟加深，你的法术已带上了一丝"道"的韵味。挥手间山河变色，不再是虚言。',
  '化神后期': '你已能短暂的化身为法则的一部分。天地间，你既是修士，也是这片天地的代言人。',
  '化神圆满': '半步大乘——你站在凡俗修士的巅峰，仰望那传说中的大乘之境。',
  // 大乘
  '大乘初期': '你终于触摸到了天道的门扉。周身法则交织，一言一行皆有天地应和。',
  '大乘中期': '道法自然，你已明悟"我即是道，道即是我"。飞升的召唤，开始在识海中回响。',
  '大乘后期': '你随时可以引来天劫，踏出那最后一步——羽化飞升。',
  '大乘圆满': '天劫的劫云已在头顶凝聚。是成仙，还是化为飞灰，只在一念之间。',
};

// ── 天地异象（大境界突破）──
const REALM_OMEN = {
  '筑基初期': '🌸 青云镇上空紫气东来三千里，镇上的凡人都看见了那抹祥瑞之光。',
  '金丹初期': '☀️ 一道金光冲天而起，方圆百里的修士都感应到了那枚金丹的诞生。',
  '元婴初期': '🌙 月华如练，天地间响起一声清越的婴啼。元婴出世，万籁俱寂。',
  '化神初期': '⛈️ 天地变色，法则之丝如蛛网般浮现于天际。一位化神修士，诞生了。',
  '大乘初期': '🌌 星空倒悬，日月同辉。天道之门虚影浮现，恭迎这位接近仙人的存在。',
};

// ── 突破仪式主流程 ──
// 返回 false 表示需要玩家交互（弹窗），返回 true 表示已结算完成
function startBreakthroughRitual(phase) {
  const p = G.player;
  const next = QI_REALMS[p.qiRealmIndex + 1];
  if (!next) return true;
  
  const realmIdx = p.qiRealmIndex;
  const isMajor = [9, 12, 15, 18, 21].includes(realmIdx); // 筑基/金丹/元婴/化神/大乘
  
  // 手动模式：三幕仪式
  showBreakthroughRitualUI(next, realmIdx, isMajor);
  return false;
}

// ── 三幕仪式UI ──
function showBreakthroughRitualUI(next, realmIdx, isMajor) {
  const p = G.player;
  const transform = REALM_TRANSFORM[next.name] || '你感觉体内的力量又精进了一分。';
  const omen = isMajor ? (REALM_OMEN[next.name] || '') : '';
  
  // 获取突破前属性
  const oldHp = p.maxHp;
  const oldQi = p.maxQi;
  const oldCp = p.combatPower || 0;
  
  // 存档到临时，结算时用
  G._btRitual = { next, realmIdx, isMajor, oldHp, oldQi, oldCp, transform, omen };
  
  const html = `
    <div style="padding:4px;">
      <div style="text-align:center;margin-bottom:8px;">
        <div style="font-size:20px;">⚡</div>
        <div style="font-size:14px;font-weight:bold;color:#ffd700;letter-spacing:2px;">${next.name} · 突破仪式</div>
        <div style="font-size:10px;color:var(--text-dim);margin-top:2px;">天地灵气，正在向你汇聚……</div>
      </div>
      
      <div style="font-size:11px;color:var(--text);line-height:1.9;padding:10px;background:rgba(100,150,200,0.06);border-radius:8px;border:1px solid rgba(100,150,200,0.2);">
        <div style="font-weight:bold;color:#8cc;margin-bottom:4px;">🌬️ 第一幕 · 引气</div>
        ${omen || '天地灵气缓缓汇聚，形成肉眼可见的漩涡，围绕你旋转。'}
        <div style="margin-top:6px;color:var(--text);">你盘膝而坐，心神沉入气海。${transform.split('。')[0]}。</div>
      </div>
      
      <div style="font-size:11px;color:var(--text-dim);margin:10px 0 4px;">接下来，你选择如何冲关？</div>
      <div style="display:flex;flex-direction:column;gap:6px;">
        <button class="event-choice-btn" onclick="ritualChoose('steady')" style="font-size:11px;text-align:left;padding:8px 12px;">
          <b>🛡️ 稳扎稳打</b> <span style="color:var(--text-dim);font-size:10px;">成功率+5%，突破后心境+5</span>
        </button>
        <button class="event-choice-btn" onclick="ritualChoose('fierce')" style="font-size:11px;text-align:left;padding:8px 12px;">
          <b>🔥 全力冲击</b> <span style="color:var(--text-dim);font-size:10px;">成功率+10%，失败时损失更大</span>
        </button>
        <button class="event-choice-btn" onclick="ritualChoose('burn')" style="font-size:11px;text-align:left;padding:8px 12px;border-color:#e74c3c;">
          <b>🩸 燃血冲关</b> <span style="color:#e77;font-size:10px;">燃烧气血换取力量：成功率+8%，但无论成败都损耗气血上限5%</span>
        </button>
      </div>
    </div>`;
  showCustomModal('⚡ 突破仪式', html, { noCloseBtn: true });
}

// ── 抉择 ──
function ritualChoose(method) {
  const r = G._btRitual;
  if (!r) { closeCustomModal(); return; }
  const p = G.player;
  
  // 决定加成
  let bonus = 0;
  let failPenalty = 1.0;
  let moodBonus = 0;
  if (method === 'steady') { bonus = 0.05; moodBonus = 5; }
  if (method === 'fierce') { bonus = 0.10; failPenalty = 1.5; }
  if (method === 'burn') {
    // 🩸 燃血冲关：燃烧气血上限换取力量（无论成败都损耗5%上限）
    bonus = 0.08;
    p.maxHp = Math.max(50, Math.round((p.maxHp || 100) * 0.95));
    if (p.hp > p.maxHp) p.hp = p.maxHp;
    addNarrative('🩸 你燃烧精血，浑身气血翻腾，一股狂暴的力量涌向四肢百骸！', 'narr-combat');
  }
  
  // 结算
  const chance = r.baseChance + bonus;
  const didBreak = Math.random() < chance;
  
  closeCustomModal();
  
  if (didBreak) {
    // 突破成功
    const oldIdx = p.qiRealmIndex;
    const oldCp = p.combatPower || 0;
    p.qiRealmIndex++;
    p.qiCultivationPoints = r.next.cpRequired;
    p.mood = Math.min(100, Math.round(p.mood + 12 + moodBonus));
    if (typeof getMaxAgeForRealm === 'function') {
      p.maxAge = Math.max(p.maxAge || 0, getMaxAgeForRealm(p.qiRealmIndex, p.bodyRealmIndex));
    }
    recalcStats(p);
    // 🔮 突破金丹 → 本命法宝觉醒
    if (p.qiRealmIndex === 12 && typeof unlockBenming === 'function') unlockBenming();
    p.qi = p.maxQi;
    
    // 蜕变叙事
    const scene = getSceneData(G.currentScene);
    renderNarrative({ playerName:p.name, location:scene?scene.name:'未知', realm:r.next.name }, 'breakthrough');
    
    const detailLines = [`境界：${r.next.name}`, `气血：${r.oldHp} → ${p.maxHp}`, `灵力：${r.oldQi} → ${p.maxQi}`];
    const btHtml = buildBreakthroughCard(`⚡ ${r.next.name} 突破成功！`, r.oldCp, p.combatPower || 0, detailLines);
    const btEntry = { text: btHtml, type: 'breakthrough', turn: G.turn++, time: {...G.time} };
    G.narrativeHistory.push(btEntry);
    if (typeof renderNarrativeEntry === 'function') renderNarrativeEntry(btEntry);
    
    // 蜕变描写
    addNarrative(r.transform, 'breakthrough');
    
    // 异象 + 名声
    if (r.omen) {
      addNarrative(`<div style="border:1px solid #ffd700;border-radius:10px;padding:10px;margin:6px 0;background:linear-gradient(135deg,rgba(120,80,20,0.15),rgba(80,60,20,0.05));text-align:center;font-size:11px;color:#ffd700;">${r.omen}</div>`, 'milestone');
    }
    
    unlockSkills();
    if (typeof window.reportState === 'function') { try { window.reportState('突破→' + r.next.name); } catch(e) {} }
    if (typeof checkRealmQuestTriggers === 'function') checkRealmQuestTriggers(oldIdx, p.qiRealmIndex);
    if (typeof fameOnBreakthrough === 'function') fameOnBreakthrough(r.next.name);
  } else {
    // 突破失败
    p.qiCultivationPoints = Math.max(QI_REALMS[p.qiRealmIndex].cpRequired,
      p.qiCultivationPoints - Math.round((p.qiCultivationPoints - QI_REALMS[p.qiRealmIndex].cpRequired) * 0.3 * failPenalty));
    p.qi = Math.round(p.qi * 0.5);
    p.mood = Math.max(0, Math.round(p.mood - 12 - (failPenalty > 1 ? 8 : 0)));
    addNarrative(method === 'fierce' 
      ? '全力冲击失败！经脉寸断般剧痛，灵力逆涌，气血翻腾。这一记，伤得不轻。' 
      : method === 'burn'
        ? '燃血冲关失败！气血透支，经脉灼痛，你踉跄跪地，大口喘息。' 
        : '冲击瓶颈失败！经脉震荡，心神受损。还需稳固根基。', 'system');
    if (typeof generateActionNarrative === "function") generateActionNarrative({playerName:p.name, location:getSceneData(G.currentScene)?.name||'未知', time:G.time.period+'时'}, 'breakthrough_fail');
    if (typeof addDailyLogEntry === "function") addDailyLogEntry('cultivate', '突破失败');
  }
  updateAllUI();
  G._btRitual = null;
}

// ── 炼体境界专属蜕变描写 ──
const BODY_TRANSFORM = {
  '炼体二重': '筋骨在真气冲刷下咯咯作响，你感觉四肢比昨日更有力了一分。',
  '炼体三重': '皮肤变得紧致坚韧，拳风带起呼呼声。你一拳打在石头上，石头裂了道缝。',
  '炼体四重': '肌肉纤维在淬炼中重组，线条愈发流畅。你感觉耐力大增，奔跑半日不喘。',
  '炼体五重': '骨骼深处传来酥麻感，骨髓造血加快。你的伤口愈合速度肉眼可见地变快。',
  '炼体六重': '全身经脉在体表隐约浮现，如蛛网般分布。你体内的气血奔涌如潮。',
  '炼体七重': '你内视肉身，肌肉如铁石，骨骼如玉。寻常刀剑砍在身上，只留下浅浅的白印。',
  '炼体八重': '周身气血沸腾，你吐气开声，声如洪钟。一拳轰出，竟带出隐隐风雷之音。',
  '炼体九重': '肉身圆满，气血如龙。你感觉自己的拳头能开山裂石——炼体之路的下一层，是脱胎换骨。',
  '铜皮境': '你的皮肤泛起一层古铜色的光泽，坚如精铁。刀剑加身，金铁交鸣，却不伤分毫——铜皮大成！',
  '铁骨境': '全身骨骼在咔嚓声中重新淬炼，每一根骨头都如百炼精钢。你举手投足间，骨节发出金铁之声。',
  '银血境': '你的血液泛起点点银光，如液态的水银。气血之力大增，伤口瞬间愈合，几乎不死之身。',
  '金身境': '金光自你体内透出，宝相庄严。你的肉身坚不可摧，寻常法宝打在身上，如挠痒一般。',
  '玉髓境': '骨骼如玉，晶莹剔透。你感觉自己的肉身已脱去凡胎，每一寸肌肤都蕴含庞大生机。',
  '不灭体': '你的肉身获得不灭特性，断肢可续，滴血可生。凡俗意义上的死亡，已经离你远去。',
  '涅槃境': '一道火光自你体内燃起，肉身在火焰中重塑——涅槃重生，每一次蜕变都更强一分。',
  '混沌体': '混沌之气在你体内流转，肉身与天地融为一体。你即是天地，天地即是你。',
  '道身境': '道韵浸入肉身，你的每一寸肌肤都铭刻着法则纹路。举手投足，天地应和。',
  '圣体境': '圣光普照，你的肉身已近不朽。凡俗刀兵、寻常神通，皆不能伤你分毫。',
  '神魔体': '神魔之力灌注肉身，你身高暴涨，肌肉虬结如龙。一拳可碎山岳，一脚可裂大地。',
  '不朽体': '肉身不朽，万古长存。岁月在你身上留不下痕迹，你就是行走的永恒。',
  '开天体': '你的肉身撑开一片天地，血肉自成洞天。体内世界初开，混沌分化，万物滋生。',
  '鸿蒙道体': '鸿蒙紫气环绕周身，你的肉身即是道之载体。一念之间，天地万物皆可掌控。',
};

// ── 天机指引：顶栏常驻的"当前最该做的事" ──
function getTianjiHint() {
  const p = G.player;
  if (!p) return '';
  const qiPct = typeof getCultivationProgress === 'function' ? getCultivationProgress('qi') : 0;
  const bodyPct = typeof getCultivationProgress === 'function' ? getCultivationProgress('body') : 0;
  const scene = typeof getSceneData === 'function' ? getSceneData(G.currentScene) : null;
  
  // 优先级从高到低
  
  // 1. 气血/灵力危险
  if (p.hp < 30) return '🩸 气血垂危！快「休息」或服用止血散';
  if (p.qi < 15 && scene && !scene.safe) return '⚡ 灵力不足，快回安全区或「休息」';
  
  // 2. 可以突破了
  if (qiPct >= 100 && p.qiRealmIndex < QI_REALMS.length - 1) {
    const missing = getBreakthroughMissing();
    if (missing && missing.length > 0) return `⚡ 修为已满，还缺${missing.join('、')}，去坊市/炼丹备齐`;
    return '⚡ 修为已满！快去「突破」';
  }
  if (bodyPct >= 100 && p.bodyRealmIndex < BODY_REALMS.length - 1) return '💪 炼体已满！快去「炼体突破」';
  
  // 3. 心境不稳
  if (p.mood < 40) return '🕊️ 心境不稳（' + Math.round(p.mood) + '），去月华谷散心或「悔过」';
  
  // 4. 有可交任务
  try {
    if (typeof getActiveQuests === 'function' && typeof getQuestDB === 'function') {
      const aqs = getActiveQuests();
      const qdb = getQuestDB();
      let anyCompletable = false;
      aqs.forEach(aq => {
        if (anyCompletable) return;
        const quest = qdb.find(q => q.id === aq.id);
        if (!quest || !quest.requirements) return;
        const req = quest.requirements;
        let done = true;
        if (req.items) req.items.forEach(r => {
          const owned = p.inventory.reduce((s, it) => it.id === r.id ? s + (it.qty || 1) : s, 0);
          if (owned < r.qty) done = false;
        });
        if (req.kills) req.kills.forEach(r => {
          const kc = p.killLog ? (p.killLog[r.monster] || 0) : 0;
          if (kc < r.qty) done = false;
        });
        if (req.explore && (G.currentScene !== req.explore && !aq.progress.explored)) done = false;
        if (req.realm && p.qiRealmIndex < req.realm) done = false;
        if (done) anyCompletable = true;
      });
      if (anyCompletable) return '📜 有任务已完成！打开「任务」提交';
    }
  } catch(e) {}
  
  // 5. 探索新地方
  const curScene = scene;
  if (curScene && curScene.connections && curScene.connections.length > 0) {
    const visitedArr = G.visitedScenes || [];
    const unvisited = curScene.connections.filter(c => {
      const sd = typeof getSceneData === 'function' ? getSceneData(c) : null;
      if (!sd) return false;
      return visitedArr.indexOf(c) === -1;
    });
    if (unvisited.length > 0) return '🗺️ 附近有未探索之地，去「地图」看看';
  }
  
  // 6. 修炼
  if (qiPct < 100) return '🧘 无事可做？不如打坐修炼，提升修为';
  if (bodyPct < 100) return '💪 炼体之路漫漫，去「炼体」淬炼肉身';
  
  return '🌟 道阻且长，行则将至——继续前行吧';
}

// 突破还缺什么
function getBreakthroughMissing() {
  try {
    const p = G.player;
    const req = (typeof BREAKTHROUGH_REQS !== 'undefined') ? BREAKTHROUGH_REQS[p.qiRealmIndex] : null;
    if (!req || !req.items) return [];
    const missing = [];
    req.items.forEach(r => {
      const owned = p.inventory.reduce((sum, it) => it.id === r.id ? sum + (it.qty || 1) : sum, 0);
      if (owned < r.qty) missing.push((typeof pillName === 'function' ? pillName(r.id) : r.id) + '×' + (r.qty - owned));
    });
    return missing;
  } catch(e) { return []; }
}

// ── 问道：修行指引面板 ──
// 随时查看当前境界、下一境界门槛、丹药缺口、修炼建议
function showAskDaoPanel() {
  const p = G.player;
  if (!p) return;
  
  const cur = getQiRealm();
  const isMax = p.qiRealmIndex >= QI_REALMS.length - 1;
  const next = isMax ? null : QI_REALMS[p.qiRealmIndex + 1];
  const req = isMax ? null : (typeof BREAKTHROUGH_REQS !== 'undefined' ? BREAKTHROUGH_REQS[p.qiRealmIndex] : null);
  
  let html = '<div style="padding:2px;">';
  
  // 当前境界
  html += `<div style="text-align:center;margin-bottom:10px;">
    <div style="font-size:14px;font-weight:bold;color:#ffd700;letter-spacing:1px;">🧭 问道 · 修行指引</div>
    <div style="font-size:10px;color:var(--text-dim);margin-top:2px;">知彼知己，百战不殆。修行亦然。</div>
  </div>`;
  
  // 当前境界卡片
  const progress = getCultivationProgress('qi');
  html += `<div style="border:1px solid rgba(120,120,200,0.3);border-radius:8px;padding:8px;margin-bottom:8px;background:rgba(80,80,150,0.08);">
    <div style="font-size:11px;font-weight:bold;color:#8cc;">当前境界：${cur.name}</div>
    <div style="font-size:10px;color:var(--text-dim);margin-top:3px;">修炼进度：${Math.round(progress)}% ${progress >= 100 ? '（可突破！）' : ''}</div>
    <div style="height:6px;background:rgba(255,255,255,0.1);border-radius:3px;margin-top:4px;">
      <div style="height:100%;width:${Math.min(100,progress)}%;background:linear-gradient(90deg,#7dce9a,#ffd700);border-radius:3px;"></div>
    </div>
  </div>`;
  
  if (isMax || !next) {
    html += '<div style="font-size:11px;color:#ffd700;text-align:center;padding:8px;">✨ 你已登临此界绝巅——飞升在望，超脱可期！</div>';
  } else {
    // 下一境界需求
    html += `<div style="border:1px solid rgba(200,160,80,0.3);border-radius:8px;padding:8px;margin-bottom:8px;background:rgba(120,90,40,0.08);">
      <div style="font-size:11px;font-weight:bold;color:#e8c88a;">➡️ 下一境界：${next.name}</div>`;
    
    if (req) {
      // 心境
      const moodOk = p.mood >= req.mood;
      html += `<div style="font-size:10px;margin-top:4px;color:${moodOk ? '#7dce9a' : '#ff8f8f'};">
        ${moodOk ? '✅' : '❌'} 心境 ${p.mood}/${req.mood}${moodOk ? '' : '（还差' + (req.mood - p.mood) + '）'}
      </div>`;
      // 功法
      const activeSkills = p.skills.filter(s => s.active).length;
      const skillOk = activeSkills >= req.reqSkills;
      html += `<div style="font-size:10px;margin-top:2px;color:${skillOk ? '#7dce9a' : '#ff8f8f'};">
        ${skillOk ? '✅' : '❌'} 功法 ${activeSkills}/${req.reqSkills}门${skillOk ? '' : '（还需' + (req.reqSkills - activeSkills) + '门）'}
      </div>`;
      // 丹药
      if (req.items && req.items.length > 0) {
        req.items.forEach(r => {
          const owned = p.inventory.reduce((sum, it) => it.id === r.id ? sum + (it.qty || 1) : sum, 0);
          const ok = owned >= r.qty;
          const nm = typeof pillName === 'function' ? pillName(r.id) : r.id;
          html += `<div style="font-size:10px;margin-top:2px;color:${ok ? '#7dce9a' : '#ff8f8f'};">
            ${ok ? '✅' : '❌'} ${nm} ${owned}/${r.qty}${ok ? '' : '（还差' + (r.qty - owned) + '）'}
          </div>`;
        });
      }
      if (req.desc) html += `<div style="font-size:9px;color:var(--text-dim);margin-top:4px;font-style:italic;">${req.desc}</div>`;
    }
    html += '</div>';
    
    // 修炼建议
    html += `<div style="font-size:10px;color:var(--text-dim);line-height:1.8;">
      <div style="font-weight:bold;color:#8cc;margin-bottom:2px;">📜 修炼建议</div>`;
    if (progress < 100) {
      html += `<div>· 修炼、打坐、灵药园采集可提升修为</div>`;
      html += `<div>· 高灵气场景（灵云峰等）修炼事半功倍</div>`;
    }
    if (req && p.mood < req.mood) html += `<div>· 心境不足：去月华谷赏景、找沈伯聊天、服用养心丹</div>`;
    if (req && activeSkills < req.reqSkills) html += `<div>· 功法不足：去秘境、NPC处学新功法</div>`;
    if (req && req.items && req.items.some(r => p.inventory.reduce((s,it)=>it.id===r.id?s+(it.qty||1):s,0) < r.qty)) {
      html += `<div>· 丹药缺口：坊市购买、炼丹炉炼制、打怪掉落</div>`;
    }
    html += '</div>';
  }
  
  html += '</div>';
  showCustomModal('🧭 问道', html + '<button class="event-choice-btn" onclick="closeEvent()">关闭</button>');
}

// 导出
window.showAskDaoPanel = showAskDaoPanel;
window.getTianjiHint = getTianjiHint;
window.getBreakthroughMissing = getBreakthroughMissing;
window.startBreakthroughRitual = startBreakthroughRitual;
window.showBreakthroughRitualUI = showBreakthroughRitualUI;
window.ritualChoose = ritualChoose;
window.REALM_TRANSFORM = REALM_TRANSFORM;
window.REALM_OMEN = REALM_OMEN;
window.BODY_TRANSFORM = BODY_TRANSFORM;
