// === 唯我独仙 · 第二纪元「冰阁」门派功能 ===
// 修炼/交友/任务发布/贡献兑换/灵田/演武/丹房
// 2026-08-04 · 与 sect_map.js 配套

// ── 门派任务库 ──
// 任务类型：采集/历练/除妖/炼丹/传承
// 奖励：贡献 + 灵石 + 经验
const SECT_TASK_TEMPLATES = [
  { id:'st_1', type:'采集', title:'采集灵草', desc:'后山灵田的灵草该收了，去采集 5 株灵草交给丹房。', target:5, item:'灵草', rewardMerit:10, rewardStones:20, realmMin:0 },
  { id:'st_2', type:'采集', title:'冰晶采集', desc:'冰风石窟外围的冰晶矿脉可采，取 3 块冰晶回来。', target:3, item:'冰晶', rewardMerit:15, rewardStones:30, realmMin:3 },
  { id:'st_3', type:'除妖', title:'清剿野狼', desc:'落霞森林野狼泛滥，清剿 3 只野狼，护卫青云镇商路。', target:3, item:'野狼', rewardMerit:20, rewardStones:40, realmMin:4 },
  { id:'st_4', type:'除妖', title:'黑风岭除寇', desc:'黑风岭山贼劫道，剿灭 5 名山贼。', target:5, item:'山贼', rewardMerit:25, rewardStones:50, realmMin:3 },
  { id:'st_5', type:'炼丹', title:'炼制回气丹', desc:'丹房缺回气丹，炼制 2 枚上交。', target:2, item:'回气丹', rewardMerit:15, rewardStones:30, realmMin:0 },
  { id:'st_6', type:'传承', title:'演武传艺', desc:'在演武场指导一位外门弟子练剑，提升门派凝聚力。', target:1, item:'指导', rewardMerit:12, rewardStones:20, realmMin:0 },
  { id:'st_7', type:'历练', title:'闭关修炼', desc:'在门派静室闭关修炼，累计获得 5000 修为。', target:5000, item:'修为', rewardMerit:20, rewardStones:40, realmMin:0 },
  { id:'st_8', type:'采集', title:'寒玉髓', desc:'冰风石窟深处有寒玉髓，采集 1 块（需较高修为）。', target:1, item:'寒玉髓', rewardMerit:40, rewardStones:80, realmMin:8 },
  { id:'st_9', type:'除妖', title:'幽冥平乱', desc:'幽冥鬼窟幽魂滋生，清剿 3 只幽魂。', target:3, item:'幽魂', rewardMerit:35, rewardStones:70, realmMin:6 },
  { id:'st_10', type:'炼丹', title:'炼制冰心丹', desc:'冰阁祖传丹方「冰心丹」已成，炼制 1 枚。', target:1, item:'冰心丹', rewardMerit:50, rewardStones:100, realmMin:10 },
];

// ── 门派任务状态（存 player.sect.tasks） ──
function ensureSectTasks() {
  const p = G.player;
  if (!p.sect) return;
  if (!p.sect.tasks) p.sect.tasks = [];
  // 每日刷新：3个任务
  const today = G.time.day;
  if (p.sect._taskDay !== today) {
    p.sect._taskDay = today;
    // 按玩家境界选任务
    const realm = Math.max(p.qiRealmIndex || 0, p.bodyRealmIndex || 0);
    const available = SECT_TASK_TEMPLATES.filter(t => realm >= t.realmMin);
    // 随机取3个（不足则全取）
    const shuffled = available.sort(() => Math.random() - 0.5);
    p.sect.tasks = shuffled.slice(0, 3).map(t => ({
      ...t,
      progress: 0,
      done: false,
      claimed: false,
    }));
  }
}

// 任务进度更新
function updateSectTaskProgress(taskId, amount) {
  const p = G.player;
  if (!p.sect || !p.sect.tasks) return;
  const task = p.sect.tasks.find(t => t.id === taskId);
  if (!task || task.done || task.claimed) return;
  task.progress = Math.min(task.target, (task.progress || 0) + amount);
  if (task.progress >= task.target) {
    task.done = true;
    addNarrative(`✅ 门派任务完成：「${task.title}」，去议事厅领取奖励。`, 'quest');
  }
}

// 任务面板
function showSectTasks() {
  if (typeof isSectMember !== 'function' || !isSectMember()) {
    showCustomModal('❄️ 冰阁任务', '<div style="text-align:center;padding:14px;font-size:12px;color:var(--text-dim);">尚未加入冰阁。</div>');
    return;
  }
  ensureSectTasks();
  const p = G.player;
  const tasks = p.sect.tasks || [];
  let html = `<div style="font-size:11px;color:var(--text-dim);margin-bottom:8px;">📋 冰阁任务榜 · 每日刷新（今日 ${tasks.length}/3）</div>`;
  
  if (tasks.length === 0) {
    html += `<div style="text-align:center;padding:14px;color:var(--text-dim);font-size:11px;">今日暂无任务，明日再来。</div>`;
  }
  tasks.forEach(t => {
    const pct = Math.min(100, Math.round((t.progress || 0) / t.target * 100));
    const status = t.claimed ? '✅ 已领取' : t.done ? '🎉 可领取' : `⏳ ${t.progress}/${t.target}`;
    const color = t.claimed ? '#4a9e6a' : t.done ? '#e8c88a' : 'var(--text-dim)';
    html += `<div style="border:1px solid rgba(140,202,230,0.2);border-radius:8px;padding:10px;margin:6px 0;background:rgba(20,40,70,0.15);">
      <div style="display:flex;justify-content:space-between;align-items:center;">
        <b style="font-size:11px;color:#8ecae6;">${t.type} · ${t.title}</b>
        <span style="font-size:10px;color:${color};">${status}</span>
      </div>
      <div style="font-size:10px;color:var(--text-dim);margin-top:4px;line-height:1.5;">${t.desc}</div>
      <div style="margin-top:6px;display:flex;justify-content:space-between;align-items:center;">
        <span style="font-size:9px;color:#e8c88a;">💰 贡献+${t.rewardMerit} · 灵石+${t.rewardStones}</span>
        ${t.done && !t.claimed ? `<button class="event-choice-btn" onclick="claimSectTask('${t.id}')" style="font-size:10px;">领取奖励</button>` : ''}
      </div>
    </div>`;
  });
  html += `<div style="margin-top:8px;text-align:center;font-size:9px;color:var(--text-dim);">完成任务的进度来自门派修炼/战斗/炼丹等行为</div>`;
  showCustomModal('📋 冰阁任务榜', html + '<button class="event-choice-btn" onclick="closeEvent()">关闭</button>');
}

function claimSectTask(taskId) {
  const p = G.player;
  if (!p.sect || !p.sect.tasks) return;
  const task = p.sect.tasks.find(t => t.id === taskId);
  if (!task || !task.done || task.claimed) return;
  task.claimed = true;
  p.sect.merit = (p.sect.merit || 0) + task.rewardMerit;
  p.stones = (p.stones || 0) + task.rewardStones;
  addNarrative(`📋 任务完成：「${task.title}」 获得 贡献+${task.rewardMerit}、灵石+${task.rewardStones}！`, 'quest');
  updateAllUI();
  showSectTasks();
}

// ── 演武场：切磋 ──
function sectSparring() {
  const p = G.player;
  const realm = Math.max(p.qiRealmIndex || 0, p.bodyRealmIndex || 0);
  // 对手：区域内随机弟子（修为约等于玩家*0.8）
  const opponents = getDisciplesInArea('sect_stage');
  if (!opponents.length) {
    addNarrative('演武场空无一人，改日再来。', 'system');
    return;
  }
  const opp = opponents[Math.floor(Math.random() * opponents.length)];
  // 模拟切磋：基于战力对比
  const playerPower = (p.qiRealmIndex || 0) * 10 + (p.bodyRealmIndex || 0) * 6 + (p.attackBonus || 0) + (p.defenseBonus || 0);
  const oppPower = realm * 8 + opp.age / 2;
  const winChance = Math.min(0.9, Math.max(0.15, 0.5 + (playerPower - oppPower) / 200));
  const won = Math.random() < winChance;
  
  if (won) {
    addNarrative(`⚔️ 你与${opp.name}在演武场切磋。${opp.desc.split('。')[0]}。数招后，${opp.name}拱手认输：「${p.name}师兄（姐）剑法高明，佩服！」<br>你有所领悟，修为+200，与${opp.name}好感+10。`, 'narr-epic');
    if (typeof gainCultivation === 'function') gainCultivation('qi', 200); else p.qiCultivationPoints += 200;
    addAffinityToDisciple(opp.id, 10);
    updateSectTaskProgress('st_6', 1);
  } else {
    addNarrative(`⚔️ 你与${opp.name}切磋，${opp.personality}的${opp.name}招式老练，你渐渐不支。${opp.name}收招：「承让。」你虽败，却也学到了些东西。`, 'narr-event');
    if (typeof gainCultivation === 'function') gainCultivation('qi', 60); else p.qiCultivationPoints += 60;
  }
  updateAllUI();
}

// ── 演武场：修炼 ──
function sectStageTrain() {
  const p = G.player;
  // 每日一次
  if (p._lastStageTrainDay === G.time.day) {
    addNarrative('你今日已在演武场修炼过了，明日再来。', 'system');
    return;
  }
  p._lastStageTrainDay = G.time.day;
  const gain = 400 + (p.qiRealmIndex || 0) * 30;
  if (typeof gainCultivation === 'function') gainCultivation('qi', gain); else p.qiCultivationPoints += gain;
  p.mood = Math.min(100, (p.mood || 50) + 3);
  addNarrative(`🧘 你在演武场一角盘膝打坐，耳边是弟子们的呼喝声。心境在喧嚣中反而沉淀下来，修为+${gain}。`, 'narr-event');
  updateSectTaskProgress('st_7', gain);
  updateAllUI();
}

// ── 藏经阁：门派功法兑换（江湖散修不可能得到的冰阁秘典） ──
// 🔧 2026-08-04 深化：藏经阁不再是随机奖励，而是真正的「门派武库」。
//    冰阁专属功法（圣级，带 sectOnly 标记）用门派贡献兑换，
//    散修永远拿不到——这是加入冰阁的核心价值之一。
function sectLibraryBorrow() {
  const p = G.player;
  // 打开藏经阁界面（功法列表 + 兑换）
  sectLibraryList();
}

// 藏经阁功法列表（可兑换）
function sectLibraryList() {
  const p = G.player;
  const skillDb = (typeof G !== 'undefined' && G.skillData) ? G.skillData : (typeof SKILL_DB !== 'undefined' ? SKILL_DB : []);
  const sectSkills = skillDb.filter(s => s && s.learn && s.learn.sectOnly);
  const owned = (p.skills || []).map(s => s.id);
  const merit = (p.sect && p.sect.merit) || 0;
  const line = p.sect ? p.sect.line : '';
  
  // 兑换价格表（按功法 id）
  const prices = {
    'bingfeng_jianjue': 80,
    'xuanshuang_zhenjue': 60,
    'danding_miaojue': 60,
    'fuwen_tianxiu': 60,
    'hanpo_lianji': 70,
  };
  const lineNames = { sword:'剑脉', alchemy:'丹脉', talisman:'符脉', body:'体脉' };
  const lineDesc = {
    sword:'冰风剑诀——剑脉镇派绝学',
    alchemy:'丹鼎妙诀——丹脉不传之秘',
    talisman:'符文天修——符脉秘典',
    body:'寒魄炼体——体脉镇门绝学',
  };
  
  let html = `
    <div style="font-size:11px;color:var(--text-dim);margin-bottom:10px;line-height:1.7;">
      藏经阁三楼——「冰阁武库」。这里存放着历代祖师的毕生心血，
      <b style="color:#8ecae6;">江湖散修穷尽一生也得不到的秘典</b>。
      以门派贡献兑换，助你登临绝顶。<br>
      <span style="color:#c9a96e;">当前贡献：${merit}</span>
    </div>
  `;
  
  if (sectSkills.length === 0) {
    html += '<div style="padding:14px;text-align:center;color:var(--text-dim);font-size:11px;">武库空空如也。</div>';
  } else {
    sectSkills.forEach(s => {
      const have = owned.includes(s.id);
      const price = prices[s.id] || 80;
      const isOwnLine = lineDesc[s.id] ? (line === s.id.replace('bingfeng_jianjue','sword').replace('danding_miaojue','alchemy').replace('fuwen_tianxiu','talisman').replace('hanpo_lianji','body')) : false;
      // 本脉功法：半价；其他脉：原价（鼓励本脉专精，也允许学他脉但更贵）
      const cost = isOwnLine ? Math.ceil(price / 2) : price;
      const canBuy = !have && merit >= cost;
      const effTxt = formatEffectDescriptions ? formatEffectDescriptions(s.effects).map(e => `✦ ${e}`).join('<br>') : '';
      html += `
        <div style="border:1px solid ${have ? 'rgba(125,206,154,0.2)' : 'rgba(140,202,230,0.25)'};border-radius:8px;padding:10px;margin-bottom:8px;background:${have ? 'rgba(40,90,60,0.15)' : 'rgba(20,40,70,0.2)'};">
          <div style="display:flex;justify-content:space-between;align-items:center;">
            <b style="color:#8ecae6;font-size:12px;">📜 ${s.name}</b>
            <span style="color:#c9a96e;font-size:10px;">${s.quality} · ${lineNames[s.id === 'bingfeng_jianjue' ? 'sword' : s.id === 'danding_miaojue' ? 'alchemy' : s.id === 'fuwen_tianxiu' ? 'talisman' : 'body']}秘传</span>
          </div>
          <div style="font-size:10px;color:var(--text-dim);margin-top:4px;line-height:1.6;">${s.desc}</div>
          <div style="font-size:10px;color:#7dce9a;margin-top:4px;line-height:1.6;">${effTxt}</div>
          <div style="display:flex;justify-content:space-between;align-items:center;margin-top:6px;">
            <span style="font-size:10px;color:var(--text-dim);">需 ${s.learn.realm}${isOwnLine ? ' · <span style="color:#7dce9a;">本脉半价</span>' : ''}</span>
            ${have
              ? '<span style="font-size:10px;color:#7dce9a;">✅ 已修习</span>'
              : `<button class="event-choice-btn" onclick="sectLibraryBuy('${s.id}')" ${canBuy ? '' : 'disabled style="opacity:0.5;cursor:not-allowed;"'} style="font-size:10px;">${canBuy ? `兑换（${cost}贡献）` : (merit < cost ? `贡献不足（需${cost}）` : '兑换')}</button>`}
          </div>
        </div>
      `;
    });
  }
  
  html += `<button class="event-choice-btn" onclick="sectDailyStudy()" style="font-size:11px;margin-top:4px;width:100%;">📖 日常研读（不耗贡献，每日一次）</button>`;
  
  showCustomModal('📚 藏经阁 · 冰阁武库', html + '<button class="event-choice-btn" onclick="closeEvent()" style="font-size:11px;margin-top:6px;">关闭</button>');
}

// 兑换功法
function sectLibraryBuy(skillId) {
  const p = G.player;
  const skillDb = (typeof G !== 'undefined' && G.skillData) ? G.skillData : (typeof SKILL_DB !== 'undefined' ? SKILL_DB : []);
  const sd = skillDb.find(s => s.id === skillId);
  if (!sd) return;
  const owned = (p.skills || []).some(s => s.id === skillId);
  if (owned) { addNarrative('你已修习此功法。', 'system'); return; }
  
  const prices = {
    'bingfeng_jianjue': 80,
    'xuanshuang_zhenjue': 60,
    'danding_miaojue': 60,
    'fuwen_tianxiu': 60,
    'hanpo_lianji': 70,
  };
  const line = p.sect ? p.sect.line : '';
  const isOwnLine = (skillId === 'bingfeng_jianjue' && line === 'sword') ||
    (skillId === 'danding_miaojue' && line === 'alchemy') ||
    (skillId === 'fuwen_tianxiu' && line === 'talisman') ||
    (skillId === 'hanpo_lianji' && line === 'body');
  const cost = isOwnLine ? Math.ceil((prices[skillId] || 80) / 2) : (prices[skillId] || 80);
  
  if ((p.sect.merit || 0) < cost) {
    addNarrative(`贡献不足，兑换「${sd.name}」需要 ${cost} 贡献。完成门派任务可获贡献。`, 'system');
    closeEvent();
    return;
  }
  
  // 境界门槛
  if (sd.learn && sd.learn.realm) {
    const rn = (typeof parseQiRealm === 'function') ? parseQiRealm(sd.learn.realm) : null;
    if (rn && (p.qiRealmIndex || 0) + 1 < rn) {
      addNarrative(`你的修为不足（需${sd.learn.realm}），先努力修炼吧。`, 'system');
      closeEvent();
      return;
    }
  }
  
  // 扣贡献 + 习得
  p.sect.merit -= cost;
  if (typeof learnSkillFromScroll === 'function') {
    learnSkillFromScroll(skillId);
  } else {
    p.skills.push({ id: sd.id, name: sd.name, quality: sd.quality, type: sd.type, active: false, mastered: false });
    recalcStats(p);
  }
  addNarrative(`📜 你以 ${cost} 贡献换得冰阁秘典《${sd.name}》！此功法蕴含冰阁历代祖师心血，远非江湖散修所能窥见。`, 'milestone');
  closeEvent();
  updateAllUI();
}

// 日常研读（不耗贡献，每日一次——保留原来的随机收益）
function sectDailyStudy() {
  const p = G.player;
  if (p._lastLibraryDay === G.time.day) {
    addNarrative('你今日已研读过典籍，藏经阁的灯火要留给后来人。明日再来。', 'system');
    return;
  }
  p._lastLibraryDay = G.time.day;
  const roll = Math.random();
  if (roll < 0.5) {
    const gain = 300 + (p.qiRealmIndex || 0) * 25;
    if (typeof gainCultivation === 'function') gainCultivation('qi', gain); else p.qiCultivationPoints += gain;
    addNarrative(`📚 墨雪堂递给你一卷泛黄的手札：「这是先辈留下的修行笔记，看看吧。」你读至深夜，修为+${gain}。`, 'narr-event');
  } else if (roll < 0.8) {
    p.wisdom = Math.min(100, (p.wisdom || 0) + 1);
    addNarrative(`📚 你在藏经阁找到一本《冰阁剑意随笔》，细细品读，悟性+1。`, 'narr-event');
  } else {
    const skill = (p.skills || []).find(s => s.active);
    if (skill) {
      skill.proficiency = (skill.proficiency || 0) + 5;
      addNarrative(`📚 你研读典籍，对「${skill.name}」有了新的理解，熟练度+5。`, 'narr-event');
    } else {
      const gain = 300;
      if (typeof gainCultivation === 'function') gainCultivation('qi', gain); else p.qiCultivationPoints += gain;
      addNarrative(`📚 你在藏经阁静读一日，修为+${gain}。`, 'narr-event');
    }
  }
  closeEvent();
  updateAllUI();
}

// ── 丹房：炼丹 + 灵药阁（突破材料兑换） ──
// 🔧 2026-08-04 深化：丹房除了炼丹，还有「灵药阁」——用门派贡献兑换
//    突破材料/丹药。散修要在野外拼死拼活刷的珍稀材料，冰阁弟子可以用贡献换。
function sectAlchemy() {
  const p = G.player;
  const merit = (p.sect && p.sect.merit) || 0;
  const html = `
    <div style="font-size:11px;color:var(--text-dim);line-height:1.8;margin-bottom:10px;">
      丹房三座丹炉青烟袅袅，药玄子倚在门边：「掌门，要炼丹还是换药材？」<br>
      <span style="color:#c9a96e;">当前贡献：${merit}</span>
    </div>
    <button class="event-choice-btn" onclick="closeEvent();showAlchemyPanel()" style="font-size:12px;width:100%;margin-bottom:8px;display:block;">⚗️ 开炉炼丹（用灵草炼丹）</button>
    <button class="event-choice-btn" onclick="sectMedicineHall()" style="font-size:12px;width:100%;display:block;">🌿 灵药阁（贡献换突破材料/丹药）</button>
  `;
  showCustomModal('⚗️ 丹房', html + '<button class="event-choice-btn" onclick="closeEvent()" style="font-size:11px;margin-top:6px;">关闭</button>');
}

// ── 灵药阁：贡献兑换突破材料/丹药 ──
const SECT_MEDICINE_STOCK = [
  { itemId: 'pojing_dan', name: '破境丹', cost: 25, desc: '打破瓶颈的丹药，突破时使用增加成功率+15%。', icon: '💊', realmMin: 0 },
  { itemId: 'huangji_pojing', name: '荒寂破境丹', cost: 60, desc: '冲击金丹的强力破境丹，成功率+20%。', icon: '💊', realmMin: 9 },
  { itemId: 'zhushen_dan', name: '铸神丹', cost: 45, desc: '筑基期神丹，服用大幅精进修为（+800修为）。', icon: '🧪', realmMin: 9 },
  { itemId: 'jiaolong_dan', name: '蛟龙丹', cost: 50, desc: '气血灵力大增的宝丹（+300气血/+150灵力/+400修为）。', icon: '🧪', realmMin: 9 },
  { itemId: 'lingmai_jing', name: '灵脉结晶', cost: 20, desc: '筑基修炼辅材，蕴含浓郁地脉灵气。', icon: '💎', realmMin: 9 },
  { itemId: 'yaodan_he', name: '妖丹核', cost: 30, desc: '筑基级妖兽内丹雏形，炼丹炼器皆可入药。', icon: '💎', realmMin: 9 },
  { itemId: 'leichi_jingtie', name: '雷池精铁', cost: 55, desc: '祭炼本命法宝的核心材料，蕴含雷灵之力。', icon: '⚡', realmMin: 12 },
  { itemId: 'tiandao_bei', name: '天道碑拓', cost: 65, desc: '蕴含大道真意，金丹修士参悟可窥破婴之机。', icon: '📜', realmMin: 12 },
  { itemId: 'xian_fairy_pill', name: '冰魄仙丹', cost: 200, desc: '冰阁至宝！服用直接提升一个境界（元婴及以下），也是冲击化神助力。', icon: '❄️', realmMin: 15 },
];

function sectMedicineHall() {
  const p = G.player;
  const merit = (p.sect && p.sect.merit) || 0;
  // 先关闭当前弹窗，避免 showCustomModal 排队不显示
  if (typeof closeEvent === 'function') { try { closeEvent(); } catch(e) {} }
  const inv = p.inventory || [];
  
  let html = `
    <div style="font-size:11px;color:var(--text-dim);margin-bottom:10px;line-height:1.7;">
      灵药阁陈列着冰阁历代珍藏。这些材料若在江湖上，散修得拼上性命去秘境搏杀才有机会得到——
      而你，只需献上门派贡献。<br>
      <span style="color:#c9a96e;">当前贡献：${merit}</span>
    </div>
  `;
  
  SECT_MEDICINE_STOCK.forEach(it => {
    const have = inv.filter(i => i.id === it.itemId).reduce((s, i) => s + (i.qty || 1), 0);
    const realmOk = (p.qiRealmIndex || 0) >= it.realmMin;
    const canBuy = realmOk && merit >= it.cost;
    html += `
      <div style="border:1px solid ${!realmOk ? 'rgba(231,76,60,0.2)' : 'rgba(140,202,230,0.2)'};border-radius:8px;padding:8px 10px;margin-bottom:6px;display:flex;justify-content:space-between;align-items:center;background:${!realmOk ? 'rgba(60,20,20,0.1)' : 'rgba(20,40,70,0.15)'};">
        <div style="flex:1;">
          <div style="font-size:11px;color:var(--text);"><b>${it.icon} ${it.name}</b> ${have > 0 ? `<span style="color:#7dce9a;font-size:10px;">(已有${have})</span>` : ''}</div>
          <div style="font-size:9px;color:var(--text-dim);margin-top:2px;">${it.desc}</div>
        </div>
        <div style="margin-left:8px;text-align:right;">
          ${!realmOk
            ? '<span style="font-size:9px;color:#e74c3c;">境界不足</span>'
            : have > 0
              ? '<span style="font-size:10px;color:#7dce9a;">已持有</span>'
              : `<button class="event-choice-btn" onclick="sectMedicineBuy('${it.itemId}')" ${canBuy ? '' : 'disabled style="opacity:0.5;cursor:not-allowed;"'} style="font-size:10px;">${canBuy ? `兑换（${it.cost}贡献）` : '贡献不足'}</button>`}
        </div>
      </div>
    `;
  });
  
  html += `<button class="event-choice-btn" onclick="closeEvent();sectAlchemy()" style="font-size:11px;margin-top:4px;">← 返回丹房</button>`;
  showCustomModal('🌿 灵药阁', html + '<button class="event-choice-btn" onclick="closeEvent()" style="font-size:11px;margin-top:6px;">关闭</button>');
}

function sectMedicineBuy(itemId) {
  const p = G.player;
  const stock = SECT_MEDICINE_STOCK.find(s => s.itemId === itemId);
  if (!stock) return;
  const realmOk = (p.qiRealmIndex || 0) >= stock.realmMin;
  if (!realmOk) { addNarrative('你的境界还不足以驾驭此物。', 'system'); return; }
  if ((p.sect.merit || 0) < stock.cost) {
    addNarrative(`贡献不足，需要 ${stock.cost} 贡献。`, 'system');
    return;
  }
  if ((p.inventory || []).some(i => i.id === itemId)) {
    addNarrative('你已有一份了，贪多无益。', 'system');
    return;
  }
  p.sect.merit -= stock.cost;
  const itemDef = (typeof ITEM_DB !== 'undefined' && ITEM_DB.find ? ITEM_DB.find(i => i.id === itemId) : null) || { id: itemId, name: stock.name };
  if (typeof addItemToInventory === 'function') addItemToInventory(itemDef, 1);
  addNarrative(`🌿 药玄子将${stock.icon}${stock.name}递给你：「掌门拿好。这在外头，可是要拼命的。」贡献-${stock.cost}。`, 'milestone');
  closeEvent();
  setTimeout(() => { sectMedicineHall(); }, 100);
  updateAllUI();
}

// ── 刑堂：门规 ──
function sectDisciplineRules() {
  const p = G.player;
  const honor = p.sect ? (p.sect.merit || 0) : 0;
  let html = `<div style="font-size:11px;color:var(--text-dim);margin-bottom:8px;">⚖️ 冰阁门规 · 雪无痕执法</div>`;
  html += `<div style="border:1px solid rgba(140,202,230,0.2);border-radius:8px;padding:10px;font-size:10px;color:var(--text);line-height:1.9;background:rgba(20,40,70,0.15);">
    <b style="color:#8ecae6;">冰阁七律</b><br>
    一、同门相残者，废修为逐出山门<br>
    二、叛阁通敌者，永世追杀<br>
    三、欺压凡俗者，面壁三月<br>
    四、偷窃典籍者，杖责三十<br>
    五、见死不救者，罚没贡献<br>
    六、私斗伤及无辜者，禁闭一月<br>
    七、临阵退缩者，罚守山门一月<br>
    <br>
    <span style="color:var(--text-dim);">雪无痕：「律条是死的，人心是活的。但冰阁的律，从不动摇。」</span>
  </div>`;
  html += `<div style="margin-top:8px;font-size:10px;color:var(--text-dim);">你的门派贡献：${honor}（贡献可抵小过）</div>`;
  showCustomModal('⚖️ 刑堂', html + '<button class="event-choice-btn" onclick="closeEvent()">关闭</button>');
}

// ── 弟子居：走访 ──
function sectDormVisit() {
  const p = G.player;
  const disciples = getDisciplesInArea('sect_dorm');
  if (!disciples.length) {
    addNarrative('弟子居静悄悄的，大家都去修炼了。', 'system');
    return;
  }
  // 随机一位弟子触发日常互动
  const d = disciples[Math.floor(Math.random() * disciples.length)];
  const aff = getDiscipleAffinity(d.id);
  const lines = [
    `你路过${d.name}的院门口，${d.personality}的${d.name}正${d.gender === '男' ? '盘坐' : '倚窗'}发呆。见到你，${d.name}眼睛一亮：「${p.name}师兄（姐），来坐坐？」`,
    `弟子居的院子里，${d.name}正在${d.gender === '男' ? '劈柴' : '晾晒药草'}。看到你，${d.name}笑道：「来得正好，帮我搭把手？」`,
    `${d.name}在院中练功，气息不稳。见你驻足，${d.name}虚心请教：「能指点我一招吗？」`,
  ];
  addNarrative(`🏠 ${lines[Math.floor(Math.random() * lines.length)]}<br><span style="color:var(--text-dim);font-size:10px;">与${d.name}闲聊片刻，好感度+5（当前${aff + 5}）。</span>`, 'narr-event');
  addAffinityToDisciple(d.id, 5);
  updateAllUI();
}

// ── 灵田：种植（生长周期经营版） ──
function sectFieldPlant() {
  const p = G.player;
  if (p._lastFieldDay === G.time.day) {
    addNarrative('你今日已照料过灵田，灵药需要时间生长。明日再来。', 'system');
    return;
  }
  p._lastFieldDay = G.time.day;
  if (!p.sect) return;
  
  // 🔧 细化：种植有生长周期（种下→等成熟→收获）
  if (!p.sect._fieldCrop) {
    // 选种（灵田等级越高越容易种到好灵植）
    const level = p.sect._fieldLevel || 1;
    const pool = level >= 4 ? SECT_CROPS : level >= 2 ? SECT_CROPS.slice(0, 2) : SECT_CROPS.slice(0, 1);
    const crop = pool[Math.floor(Math.random() * pool.length)];
    p.sect._fieldCrop = { id: crop.id, name: crop.name, plantedDay: G.time.day, harvestDay: G.time.day + crop.days };
    addNarrative(`🌾 你在灵田里翻土、播种${crop.name}（${crop.desc}）。灵药需要${crop.days}天成熟，每日可来照料。` +
      (p.sect._fieldLevel > 1 ? `（灵田等级${p.sect._fieldLevel}，收获时收成更多）` : ''), 'narr-event');
    updateAllUI();
    return;
  }
  
  // 已有作物 → 查看生长/收获
  const crop = p.sect._fieldCrop;
  const now = G.time.day;
  if (now < crop.harvestDay) {
    const left = crop.harvestDay - now;
    const stage = left >= crop.days ? '刚冒芽' : left >= Math.ceil(crop.days / 2) ? '抽枝展叶' : '含苞待放';
    addNarrative(`🌱 你田里的${crop.name}${stage}（还需${left}天成熟）。你顺手除了草、浇了水，期待丰收。`, 'narr-event');
    updateAllUI();
    return;
  }
  
  // 成熟 → 收获
  const level = p.sect._fieldLevel || 1;
  const cropData = SECT_CROPS.find(c => c.id === crop.id) || SECT_CROPS[0];
  const harvest = cropData.baseYield + level - 1 + Math.floor(Math.random() * 2);
  const herbItem = (typeof ITEM_DB !== 'undefined' && ITEM_DB.find ? ITEM_DB.find(i => i.id === crop.id) : null) || { id: crop.id, name: crop.name };
  addItemToInventory(herbItem, harvest);
  p.sect._fieldCrop = null;
  p.sect._fieldLevel = Math.min(10, (p.sect._fieldLevel || 1) + 1);
  // 贡献+收获（灵田任务推进）
  updateSectTaskProgress('st_1', harvest);
  p.sect.merit = (p.sect.merit || 0) + 3;
  addNarrative(`🌾 灵田丰收！你收获了${crop.name}×${harvest}，灵田等级提升至${p.sect._fieldLevel}，贡献+3。`, 'loot');
  updateAllUI();
}
// ── 藏宝阁：贡献兑换 ──
function sectTreasury() {
  const p = G.player;
  const merit = p.sect ? (p.sect.merit || 0) : 0;
  const goods = [
    { id:'treasure_1', name:'📜 功法残卷', desc:'随机领悟一门功法熟练度+20', cost:30, effect:() => { const s = (p.skills||[]).find(x=>x.active); if(s){s.proficiency=(s.proficiency||0)+20; addNarrative('📜 残卷中记载的招式与你所学相印证，「'+s.name+'」熟练度+20！','narr-event');} else addNarrative('📜 你研读残卷，虽无对应功法，但触类旁通，悟性+1。','narr-event'); } },
    { id:'treasure_2', name:'💊 聚灵丹', desc:'服用后修为+1000', cost:25, effect:() => { if(typeof gainCultivation==='function') gainCultivation('qi',1000); else p.qiCultivationPoints+=1000; addNarrative('💊 你服下聚灵丹，药力化开，修为+1000！','narr-epic'); } },
    { id:'treasure_3', name:'🔮 灵晶', desc:'灵石×200', cost:20, effect:() => { p.stones=(p.stones||0)+200; addNarrative('🔮 你从藏宝阁支取灵石×200。','loot'); } },
    { id:'treasure_4', name:'🗡️ 冰晶剑胚', desc:'获得一件冰阁制式法器（攻击+15）', cost:50, effect:() => { p.attackBonus=(p.attackBonus||0)+15; p.inventory=p.inventory||[]; p.inventory.push({id:'sect_sword_blade',name:'🗡️冰晶剑胚',qty:1,type:'法器',desc:'冰阁制式法器，冰晶所铸。'}); addNarrative('🗡️ 铁砚从库里翻出一柄冰晶剑胚：「这可是好货，好好用。」攻击+15！','milestone'); } },
    { id:'treasure_5', name:'📖 冰阁秘传', desc:'冰阁心法修炼，修为+3000', cost:60, effect:() => { if(typeof gainCultivation==='function') gainCultivation('qi',3000); else p.qiCultivationPoints+=3000; addNarrative('📖 你参悟冰阁秘传心法，修为+3000！','narr-epic'); } },
  ];
  let html = `<div style="font-size:11px;color:var(--text-dim);margin-bottom:8px;">💎 冰阁藏宝阁 · 贡献兑换</div>`;
  html += `<div style="font-size:10px;color:#e8c88a;margin-bottom:6px;">当前贡献：${merit}</div>`;
  goods.forEach(g => {
    html += `<div style="border:1px solid rgba(230,200,140,0.2);border-radius:8px;padding:8px;margin:4px 0;display:flex;justify-content:space-between;align-items:center;font-size:10px;background:rgba(120,90,30,0.08);">
      <div><b>${g.name}</b><br><span style="color:var(--text-dim);font-size:9px;">${g.desc}</span></div>
      <button class="event-choice-btn" onclick="sectTreasuryBuy('${g.id}')" style="font-size:9px;${merit >= g.cost ? '' : 'opacity:.4;'}" ${merit >= g.cost ? '' : 'disabled'}>${g.cost}贡献</button>
    </div>`;
  });
  showCustomModal('💎 藏宝阁', html + '<button class="event-choice-btn" onclick="closeEvent()">关闭</button>');
}

function sectTreasuryBuy(goodId) {
  const p = G.player;
  const goods = [
    { id:'treasure_1', cost:30, effect:null },
    { id:'treasure_2', cost:25, effect:null },
    { id:'treasure_3', cost:20, effect:null },
    { id:'treasure_4', cost:50, effect:null },
    { id:'treasure_5', cost:60, effect:null },
  ];
  const good = goods.find(g => g.id === goodId);
  if (!good) return;
  if ((p.sect.merit || 0) < good.cost) {
    addNarrative('贡献不足，铁砚冲你摇头：「先去接任务吧。」', 'system');
    return;
  }
  p.sect.merit -= good.cost;
  // 执行效果（重新获取）
  const full = [
    { id:'treasure_1', effect:() => { const s = (p.skills||[]).find(x=>x.active); if(s){s.proficiency=(s.proficiency||0)+20; addNarrative('📜 「'+s.name+'」熟练度+20！','narr-event');} else addNarrative('📜 你研读残卷，悟性+1。','narr-event'); } },
    { id:'treasure_2', effect:() => { if(typeof gainCultivation==='function') gainCultivation('qi',1000); else p.qiCultivationPoints+=1000; addNarrative('💊 你服下聚灵丹，修为+1000！','narr-epic'); } },
    { id:'treasure_3', effect:() => { p.stones=(p.stones||0)+200; addNarrative('🔮 灵石×200。','loot'); } },
    { id:'treasure_4', effect:() => { p.attackBonus=(p.attackBonus||0)+15; p.inventory=p.inventory||[]; p.inventory.push({id:'sect_sword_blade',name:'🗡️冰晶剑胚',qty:1,type:'法器',desc:'冰阁制式法器，冰晶所铸。'}); addNarrative('🗡️ 冰晶剑胚到手，攻击+15！','milestone'); } },
    { id:'treasure_5', effect:() => { if(typeof gainCultivation==='function') gainCultivation('qi',3000); else p.qiCultivationPoints+=3000; addNarrative('📖 冰阁秘传心法参悟，修为+3000！','narr-epic'); } },
  ];
  const f = full.find(x => x.id === goodId);
  if (f) f.effect();
  updateAllUI();
  sectTreasury();
}

// ── 弟子好感度系统 ──
function getDiscipleAffinity(discipleId) {
  const p = G.player;
  if (!p.sect) return 0;
  if (!p.sect.discipleAffinity) p.sect.discipleAffinity = {};
  return p.sect.discipleAffinity[discipleId] || 0;
}
function addAffinityToDisciple(discipleId, amount) {
  const p = G.player;
  if (!p.sect) return;
  if (!p.sect.discipleAffinity) p.sect.discipleAffinity = {};
  const cur = p.sect.discipleAffinity[discipleId] || 0;
  p.sect.discipleAffinity[discipleId] = Math.max(-100, Math.min(100, cur + amount));
}

// 弟子交谈
function interactDisciple(discipleId) {
  const d = getDiscipleById(discipleId);
  if (!d) return;
  const p = G.player;
  const aff = getDiscipleAffinity(discipleId);
  // 好感度影响对话内容
  const affTier = aff >= 50 ? '至交' : aff >= 20 ? '熟络' : aff >= 0 ? '初识' : '冷淡';
  const pName = p.name;
  const greetings = {
    '至交': [`「${pName}！来得正好，我正想找你呢！」${d.name}亲热地拉着你，说起今天的事。`, `${d.name}见你来，眼睛一亮：「听说你最近又闯出名堂了？快给我讲讲！」`],
    '熟络': [`「${pName}师兄（姐），今天也来演武场啊？」${d.name}熟络地跟你打招呼。`, `${d.name}朝你点头：「来得巧，我刚想找人过两招。」`],
    '初识': [`「你是……新来的${pName}师兄（姐）？」${d.name}好奇地打量你。`, `${d.name}见你走近，客气地拱了拱手：「幸会。」`],
    '冷淡': [`${d.name}见你走近，微微皱了皱眉，似乎不太想搭理你。`, `${d.name}冷淡地瞥了你一眼，没说话。`],
  };
  const lines = greetings[affTier] || greetings['初识'];
  const line = lines[Math.floor(Math.random() * lines.length)];
  // 🔧 2026-08-04 门派深化③：好感≥50 交谈时触发深谈（讲身世）
  let tale = '';
  if (typeof maybeDiscipleTale === 'function') {
    try { tale = maybeDiscipleTale(discipleId); } catch(e) {}
  }
  if (tale) {
    addNarrative(`💬 与${d.name}交谈（好感${aff} · ${affTier}）<br>${line}<br><br>💫 ${d.name}忽然低声说起往事：<br>「${tale}」`, 'narr-event');
  } else {
    addNarrative(`💬 与${d.name}交谈（好感${aff} · ${affTier}）<br>${line}`, 'narr-event');
  }
  addAffinityToDisciple(discipleId, 1);
  // 🔧 2026-08-04 门派深化③：好感≥30 交谈后追加“心事”选项
  if (aff >= 30 && typeof showDiscipleWish === 'function') {
    try {
      showDiscipleWish(discipleId);
      return;
    } catch(e) {}
  }
  updateAllUI();
}

// 弟子送礼
function giveGiftDisciple(discipleId) {
  const d = getDiscipleById(discipleId);
  if (!d) return;
  const p = G.player;
  // 找背包里的灵石或礼物
  const stones = p.stones || 0;
  if (stones < 10) {
    addNarrative(`你想送${d.name}点什么，但囊中羞涩。${d.name}摆摆手：「心意到了就行，别破费。」`, 'system');
    return;
  }
  // 送礼：灵石10 → 好感+8
  p.stones -= 10;
  addAffinityToDisciple(discipleId, 8);
  const aff = getDiscipleAffinity(discipleId);
  const reactions = [
    `「哇，${p.name}师兄（姐）你太客气了！」${d.name}眼睛亮晶晶地收下灵石，「我记着你的好！」`,
    `${d.name}接过灵石，有些不好意思：「这……多不好意思。不过，谢谢！」`,
    `${d.name}收下礼物，嘴角弯了弯：「有心了。」好感度+8。`,
  ];
  addNarrative(`🎁 你送${d.name}10块灵石。${reactions[Math.floor(Math.random() * reactions.length)]}（好感${aff}）`, 'narr-event');
  updateAllUI();
}

// ── 弟子修为成长（每日推进，checkDayChange 挂接） ──
// 🔧 2026-08-04 玩法细化：弟子不是静态 NPC，每日修炼成长，
//    好感度高的弟子修得更快。掌门可「指点」加速。
function sectDisciplesDailyGrowth() {
  const p = G.player;
  if (!p || !p.sect) return;
  const pool = (typeof SECT_DISCIPLE_POOL !== 'undefined') ? SECT_DISCIPLE_POOL : [];
  if (!p.sect.discipleGrowth) p.sect.discipleGrowth = {};
  const growth = p.sect.discipleGrowth;
  const affinity = p.sect.discipleAffinity || {};
  let log = [];
  pool.forEach(d => {
    const cur = growth[d.id] || 0;
    const aff = affinity[d.id] || 0;
    let gain = 2 + Math.random() * 3;
    if (aff >= 50) gain *= 1.5;
    else if (aff <= -20) gain *= 0.5;
    growth[d.id] = cur + gain;
    const realm = Math.min(15, Math.floor(growth[d.id] / 30));
    if (realm > (d._sectRealm || 0)) {
      d._sectRealm = realm;
      log.push(`📈 ${d.name}修为突破至${getDiscipleRealmLabel(d)}！`);
    }
  });
  if (log.length > 0) {
    addNarrative('🏔️ 冰阁弟子今日修行：<br>' + log.slice(0, 2).join('<br>'), 'narr-event');
  }
}

// 弟子指点（掌门消耗贡献帮弟子快速成长）
function mentorDisciple(discipleId) {
  const p = G.player;
  if (!p || !p.sect) return;
  const d = getDiscipleById(discipleId);
  if (!d) return;
  if (!p.sect.discipleGrowth) p.sect.discipleGrowth = {};
  if (p.sect._mentorDay === G.time.day) {
    addNarrative('你今日已指点过弟子，明日再来。', 'system');
    return;
  }
  const cost = 20;
  if ((p.sect.merit || 0) < cost) {
    addNarrative('指点弟子需消耗 20 贡献，你的贡献不足。', 'system');
    return;
  }
  p.sect.merit -= cost;
  p.sect._mentorDay = G.time.day;
  const gain = 8 + Math.floor(Math.random() * 5);
  p.sect.discipleGrowth[discipleId] = (p.sect.discipleGrowth[discipleId] || 0) + gain;
  const realm = Math.min(15, Math.floor(p.sect.discipleGrowth[discipleId] / 30));
  if (realm > (d._sectRealm || 0)) {
    d._sectRealm = realm;
    addNarrative(`✨ 你悉心指点${d.name}，${d.name}茅塞顿开，修为突破至${getDiscipleRealmLabel(d)}！`, 'milestone');
  } else {
    addNarrative(`✨ 你悉心指点${d.name}，${d.name}修为精进不少（成长+${gain}）。${d.name}感激地朝你行礼。`, 'narr-event');
  }
  addAffinityToDisciple(discipleId, 5);
  updateAllUI();
}

// ── 灵田作物库 ──
const SECT_CROPS = [
  { id: 'lingcao', name: '灵草', days: 2, baseYield: 6, desc: '最常见的灵植，炼丹必备。' },
  { id: 'huangjing', name: '黄精', days: 3, baseYield: 5, desc: '补气养元，炼体佳品。' },
  { id: 'xuelian', name: '雪莲', days: 4, baseYield: 4, desc: '冰阁特产，性寒，可炼冰系丹药。' },
];

// ── 门派信息面板（细化：等级/声望/灵田/弟子总览） ──
function showSectOverview() {
  const p = G.player;
  if (!p || !p.sect) return;
  const sect = p.sect;
  const field = sect._fieldCrop;
  const fieldTxt = field
    ? (G.time.day >= field.harvestDay ? `${field.name} 🌾 可收获！` : `${field.name}（${field.harvestDay - G.time.day}天后成熟）`)
    : '空闲';
  const growth = sect.discipleGrowth || {};
  const pool = (typeof SECT_DISCIPLE_POOL !== 'undefined') ? SECT_DISCIPLE_POOL : [];
  const realmCount = {
    '练气': 0, '筑基': 0, '金丹': 0,
  };
  pool.forEach(d => {
    const r = Math.min(15, Math.floor((growth[d.id] || 0) / 30));
    if (r >= 12) realmCount['金丹']++;
    else if (r >= 9) realmCount['筑基']++;
    else realmCount['练气']++;
  });
  const html = `
    <div style="font-size:12px;line-height:2;color:var(--text);">
      <div style="display:flex;justify-content:space-between;border-bottom:1px solid rgba(255,255,255,0.08);padding:4px 0;">
        <span>🏔️ 门派等级</span><b>${sect.level || 1}</b>
      </div>
      <div style="display:flex;justify-content:space-between;border-bottom:1px solid rgba(255,255,255,0.08);padding:4px 0;">
        <span>💰 门派贡献</span><b>${sect.merit || 0}</b>
      </div>
      <div style="display:flex;justify-content:space-between;border-bottom:1px solid rgba(255,255,255,0.08);padding:4px 0;">
        <span>📜 记名弟子</span><b>${(sect.disciples || []).length}/${pool.length}</b>
      </div>
      <div style="display:flex;justify-content:space-between;border-bottom:1px solid rgba(255,255,255,0.08);padding:4px 0;">
        <span>🌾 灵田</span><b>Lv.${sect._fieldLevel || 1} · ${fieldTxt}</b>
      </div>
      <div style="display:flex;justify-content:space-between;border-bottom:1px solid rgba(255,255,255,0.08);padding:4px 0;">
        <span>⏳ 开派状态</span><b>${sect.founded ? '已开派' : '未开派'}</b>
      </div>
      <div style="display:flex;justify-content:space-between;padding:4px 0;">
        <span>👥 弟子修为分布</span><b>练气${realmCount['练气']} · 筑基${realmCount['筑基']} · 金丹${realmCount['金丹']}</b>
      </div>
    </div>
  `;
  showCustomModal('🏔️ 冰阁总览', html + '<button class="event-choice-btn" onclick="closeEvent()">关闭</button>');
}

// ── 导出 ──
window.SECT_TASK_TEMPLATES = SECT_TASK_TEMPLATES;
window.ensureSectTasks = ensureSectTasks;
window.updateSectTaskProgress = updateSectTaskProgress;
window.showSectTasks = showSectTasks;
window.claimSectTask = claimSectTask;
window.sectSparring = sectSparring;
window.sectStageTrain = sectStageTrain;
window.sectLibraryBorrow = sectLibraryBorrow;
window.sectAlchemy = sectAlchemy;
window.sectDisciplineRules = sectDisciplineRules;
window.sectDormVisit = sectDormVisit;
window.sectFieldPlant = sectFieldPlant;
window.sectTreasury = sectTreasury;
window.sectLibraryList = sectLibraryList;
window.sectLibraryBuy = sectLibraryBuy;
window.sectDailyStudy = sectDailyStudy;
window.sectMedicineHall = sectMedicineHall;
window.sectMedicineBuy = sectMedicineBuy;
window.SECT_MEDICINE_STOCK = SECT_MEDICINE_STOCK;
window.sectTreasuryBuy = sectTreasuryBuy;
window.sectDisciplesDailyGrowth = sectDisciplesDailyGrowth;
window.mentorDisciple = mentorDisciple;
window.showSectOverview = showSectOverview;
window.SECT_CROPS = SECT_CROPS;
window.getDiscipleAffinity = getDiscipleAffinity;
window.addAffinityToDisciple = addAffinityToDisciple;
window.interactDisciple = interactDisciple;
window.giveGiftDisciple = giveGiftDisciple;
