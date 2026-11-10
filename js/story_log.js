// === 唯我独仙 · 修炼日志 & 生涯故事 ===
// 每个动作生成AI描写 → 日终合成「今日纪事」→ 扩展成故事 → 一生传记

// ==========================
// 今日日志（临时）
// ==========================
function initDailyLog() {
  if (!G.dailyLog) G.dailyLog = [];
}

function addDailyLogEntry(actionType, actionDetail, npcName) {
  initDailyLog();
  const entry = {
    type: actionType, // 'cultivate' | 'explore' | 'combat' | 'social' | 'breakthrough' | 'market' | 'rest' | 'pickup' | 'event' | 'auto'
    detail: actionDetail,
    npc: npcName || null,
    turn: G.turn || 0,
    time: G.time ? `${G.time.period}时` : '未知时辰',
  };
  G.dailyLog.push(entry);
}

// ==========================
// 获取日终故事（AI扩写）
// ==========================
async function buildDailyStory(dayNum) {
  const log = G.dailyLog || [];
  if (log.length === 0) return null;
  
  const p = G.player;
  const scene = getSceneData(G.currentScene);
  
  // 生成叙事摘要
  const summaryLines = [];
  log.forEach(e => {
    switch(e.type) {
      case 'cultivate': summaryLines.push(`修炼了一阵`); break;
      case 'explore': summaryLines.push(`探索了周围`); break;
      case 'combat': summaryLines.push(`与${e.detail || '妖兽'}一战`); break;
      case 'social': summaryLines.push(`与${e.npc || '某人'}交谈`); break;
      case 'breakthrough': summaryLines.push(`境界突破`); break;
      case 'market': summaryLines.push(`逛了一趟坊市`); break;
      case 'rest': summaryLines.push(`稍作休整`); break;
      case 'pickup': summaryLines.push(`拾取了${e.detail || '某物'}`); break;
      case 'event': summaryLines.push(`遇到了${e.detail || '一件奇事'}`); break;
      case 'auto': summaryLines.push(`天意使然，一切随风`); break;
      default: summaryLines.push(e.detail || '有所经历');
    }
  });
  
  const uniqueEvents = [...new Set(summaryLines)];
  
  // 构建故事文本
  const dayTitle = `${p.name} · 纪元${G.time.year || 1}年第${dayNum}日纪事`;
  const tale = uniqueEvents.join('，');
  
  const story = {
    title: dayTitle,
    day: dayNum,
    year: G.time.year || 1,
    realm: G.player.qiRealmIndex !== undefined ? QI_REALMS[G.player.qiRealmIndex]?.name || '未知' : '凡人',
    summary: tale,
    detail: tale, // 后续AI扩展时更新
    eventCount: uniqueEvents.length,
    timestamp: Date.now(),
  };
  
  return story;
}

// ==========================
// AI扩写单日故事
// ==========================
async function expandDailyStoryAI(story, playerName, realmName, locationName) {
  const log = G.dailyLog || [];
  const events = log.map(e => `${e.time} — ${e.type === 'social' ? `与${e.npc}『${e.detail}』` : e.detail || e.type}`).join('\n');
  
  const prompt = `以下是修仙者「${playerName}」一天的修行日记（${realmName}，${locationName}）：

${events}

请用一段200-300字的古风叙事文体，将这一天的经历扩写成一篇生动的「修炼纪事」。要求：
- 使用第三人称「${playerName}」
- 融入环境、气氛和人物感受
- 有起承转合，像一篇迷你短篇小说
- 避免流水账，要有画面感和情绪`;
  
  try {
    const response = await fetch('https://api.deepseek.com/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + DEEPSEEK_API_KEY,
      },
      body: JSON.stringify({
        model: 'deepseek-v4-flash',
        messages: [
          { role: 'system', content: '你是修仙小说的叙事者，擅长将日常扩写成生动的篇章。语言古雅优美，有画面感和情感张力。' },
          { role: 'user', content: prompt }
        ],
        max_tokens: 400,
        temperature: 0.85,
      })
    });
    
    if (!response.ok) throw new Error('HTTP ' + response.status);
    const data = await response.json();
    const text = data.choices[0].message.content.trim();
    if (text && text.length > 20) {
      story.detail = text;
      return text;
    }
  } catch(e) {
    console.warn('AI daily story failed:', e);
  }
  return null;
}

// ==========================
// AI扩写一生的传记
// ==========================
async function expandLifeStoryAI(playerName, lifeStories) {
  if (!lifeStories || lifeStories.length === 0) return '此生素淡，无可记之事。';
  
  // 取最近的10篇 + 重要事件
  const recent = lifeStories.slice(-10);
  const summary = recent.map(s => `第${s.day}日 · ${s.realm}: ${s.summary}`).join('\n');
  
  const prompt = `以下是修仙者「${playerName}」修行生涯中的部分纪事摘要：

${summary}

请用一段500-800字的叙事散文，为这位修仙者写一篇「修行印象记」。要有人物的成长弧光、心境变化、修行路上的悲喜。像一篇人物小传，而不是流水账。`;
  
  try {
    const response = await fetch('https://api.deepseek.com/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + DEEPSEEK_API_KEY,
      },
      body: JSON.stringify({
        model: 'deepseek-v4-flash',
        messages: [
          { role: 'system', content: '你是一位修仙传记作家。你的文字能让读者感受到人物的命运和修仙世界的浩瀚。' },
          { role: 'user', content: prompt }
        ],
        max_tokens: 800,
        temperature: 0.8,
      })
    });
    
    if (!response.ok) throw new Error('HTTP ' + response.status);
    const data = await response.json();
    return data.choices[0].message.content.trim();
  } catch(e) {
    console.warn('AI life story failed:', e);
    return summary;
  }
}

// ==========================
// 生涯传记存储
// ==========================
function getLifeChronicle() {
  if (!G.lifeChronicle) G.lifeChronicle = [];
  return G.lifeChronicle;
}

function addDayToChronicle(story) {
  if (!story) return;
  if (!G.lifeChronicle) G.lifeChronicle = [];
  G.lifeChronicle.push(story);
  // 最多保留365篇（一年）
  if (G.lifeChronicle.length > 365) G.lifeChronicle = G.lifeChronicle.slice(-365);
}

// ==========================
// 日替换钩子（从advanceTime调用）
// ==========================
let _lastActiveDay = -1;

function checkDayChange() {
  if (!G || !G.player || !G.time) return;
  const currentDay = G.time ? G.time.day : -1;
  if (currentDay === _lastActiveDay || currentDay < 0) return;
  
  // 第一次运行或新一天
  if (_lastActiveDay >= 0 && currentDay !== _lastActiveDay) {
    // 旧的一天结束 → 生成故事
    generateDayStory(_lastActiveDay);
    // 新的一天开始 → 清空日志（仅在有历史天时清空，避免第一次运行吃掉当天日志）
    G.dailyLog = [];
    if (typeof checkTimeQuestTriggers === 'function') checkTimeQuestTriggers();
    initDailyLog();
  } else if (_lastActiveDay < 0) {
    // 首次运行：保留当天已积累的日志，只初始化结构
    initDailyLog();
  }
  // 每日修行重置
  _lastActiveDay = currentDay;
  if (!G._dailyDone) G._dailyDone = {};
  G._dailyDone.day = currentDay;
  G._dailyDone.meditation = false;
  G._dailyDone.qi = false;
  G._dailyDone.body = false;
  
  // 👶 怀孕进度推进（飞升后子嗣系统）
  if (typeof tickPregnancy === 'function') {
    try { tickPregnancy(); } catch(e) {}
  }
  
  // ❄️ 冰阁弟子每日修行成长（第二纪元门派玩法细化）
  if (typeof sectDisciplesDailyGrowth === 'function') {
    try { sectDisciplesDailyGrowth(); } catch(e) {}
  }
  
  // ☯️ 双人飞升感应（满足条件时每日提示一次，引导玩家去冰窟面板）
  if (typeof ascensionDailyHint === 'function') {
    try { ascensionDailyHint(); } catch(e) {}
  }
}

async function generateDayStory(dayNum) {
  const story = await buildDailyStory(dayNum);
  if (story) {
    addDayToChronicle(story);
    
    // 尝试AI扩写（异步，不阻塞）
    if (typeof DEEPSEEK_API_KEY !== 'undefined' && DEEPSEEK_API_KEY && DEEPSEEK_API_KEY !== 'YOUR_KEY') {
      expandDailyStoryAI(story, G.player.name, story.realm, getSceneData(G.currentScene)?.name || '未知').then(expanded => {
        if (expanded) {
          story.detail = expanded;
          addNarrative(`📖 『${story.title}』已收录入修炼日志。`, 'event');
        } else {
          addNarrative(`📖 第${dayNum}日纪事已记入修炼日志。`, 'system');
        }
      }).catch(() => {
        addNarrative(`📖 第${dayNum}日纪事已记入修炼日志。`, 'system');
      });
    } else {
      addNarrative(`📖 第${dayNum}日纪事已记入修炼日志。`, 'system');
    }
  }
  
  // 重置日志（新的日子会重新 init）
  G.dailyLog = [];
  initDailyLog();
}

// ==========================
// 主动生成AI随机描写（所有动作调用）
// ==========================
const ACTION_NARRATIVES = {
  cultivate: [
    '天地灵气如丝如缕，顺着经脉缓缓渗入丹田。你闭目内视，只见气海中灵光闪耀，修为又精进了一分。',
    '盘膝而坐，五心朝天。周遭的草木似乎也被牵引，微微摇曳。一缕灵韵自百会灌入，通体舒泰。',
    '功法运转间，经脉中传出细微的嗡鸣。丹田内灵气凝结成雾，又缓缓化作液滴，沉淀入骨。',
    '一呼一吸，暗合天地韵律。你感到四肢百骸中涌动着新生的力量，如春芽破土般不可阻挡。',
    '灵气贯体，经脉微胀。你咬紧牙关引导这股力量走完周天，末了只觉神清气爽，目力更锐。',
  ],
  explore: [
    '拨开层层藤蔓，前方豁然开朗。一片从未见过的景色映入眼帘——远处的古木参天而立，枝干间缠绕着淡紫色的灵雾。',
    '你沿着兽径前行，脚下落叶沙沙作响。空气中弥漫着泥土与草木的气息，隐约还有一丝异样的灵气波动。',
    '石阶覆满青苔，每一级都仿佛诉说着岁月的故事。你放开灵识，感知着这片天地间流淌的古老气息。',
    '翻过一座山脊，眼前豁然开朗。山谷中，灵草遍地，偶有妖兽的身影在林间一闪而过。',
    '穿行在林间，露水沾湿了衣摆。忽然，一阵风送来远处溪流的声音——那边，也许别有洞天。',
  ],
  rest: [
    '你寻了一处青石坐下，微风拂过面颊。天地间的灵气缓缓渗入身体，抚平了经脉中的疲惫。',
    '靠在树干上闭目调息，一呼一吸间，体内的灵力如溪流般潺潺流动，渐渐恢复了生机。',
    '溪水潺潺，你掬起一捧清水饮下。清凉入喉，精神为之一振，连带着体内的灵力也活泼了几分。',
    '盘膝调息，心神渐渐沉静。四周的一切声响都变得遥远，只剩下丹田中灵力的脉动，如一曲无声的歌。',
  ],
  combat: [
    '你提剑而上，剑光如电！对手被这凌厉一击逼退数步，尘土飞扬。',
    '拳脚相交，气劲震荡！你一击得手，身形骤退，避开对方的反扑。衣袂在风中猎猎作响。',
    '剑气纵横，草木纷飞！你抓住对方招式中的破绽，一记直取中门——正中目标！',
    '你身如游龙，在对手的攻击中穿梭。瞅准一个空档，凌空一斩！',
  ],
  combat_victory: [
    '敌人应声倒地，你收剑入鞘。风过林梢，仿佛在为这场胜利低吟。',
    '你负手而立，看着倒在面前的对手。修行路上，胜败皆是常态。衣上不沾半点尘。',
    '最后一击落下，胜负已分。你长舒一口气，感觉体内的灵力似乎又精纯了几分。',
  ],
  combat_defeat: [
    '你被重重击倒在地，口中尝到了铁锈般的血腥味。强撑着站起身，眼中却有不甘——终有一日，会赢回来。',
    '败了。你以剑撑地，喘息着。每一块肌肉都在叫嚣着疼痛，但心中那一团火，并未熄灭。',
    '踉跄后退，鲜血顺着指尖滴落。你咬着牙，深深看了对手一眼——这一败，记下了。',
  ],
  breakthrough: [
    '轰！丹田中炸开一道惊雷！灵气如江河决堤般奔涌而出，冲破了那道困住你许久的壁垒！新的境界在眼前展开，浩瀚如海。',
    '天地灵气骤然汇聚，在你头顶形成一个无形的漩涡。你浑身一震——瓶颈碎了！更强大的力量如潮水般涌入四肢百骸！',
    '体内传来噼啪脆响，仿佛有某种枷锁崩断。一股全新的力量自丹田升起，贯通全身经脉。你睁眼时，世界在眼中已大不相同。',
    '闭目凝神间，一道灵光自天灵灌入！经脉骤然扩张，灵力运转速度快了数倍！突破了——从此天高海阔！',
  ],
  breakthrough_fail: [
    '冲击瓶颈如撞铁壁！经脉剧痛，气血翻涌。你强行收功，嘴角渗出一丝血迹。还需更多积累。',
    '灵力如脱缰野马般在经脉中乱窜，你费尽全力才将其稳住。冲击失败，反噬的痛楚让人几乎咬碎牙齿。',
    '瓶颈纹丝不动，你却被反震之力打得气血翻涌。苦笑着摇摇头——火候未到，强求不得。',
  ],
  social: [
    '你们相谈甚欢，言语间似有灵光碰撞。修行路上，知音难觅。',
    '一番交谈下来，你对这个世界又多了一分了解。每一个修仙者，都有自己的故事。',
    '茶还未凉，话已说开。你发现这个人的见识不凡，值得深交。',
    '几句寒暄之后，你感到对方神识微微扫过——是在试探你的修为。你淡然一笑，不以为意。',
  ],
  market: [
    '坊市中人声鼎沸，吆喝声此起彼伏。各种灵物琳琅满目，让人眼花缭乱。',
    '你穿梭在各式各样的摊位之间。兜售者口若悬河，但你知道——好东西，得靠眼力。',
    '在坊市中转了一圈，不禁感叹：灵石真是好东西。不过，有些机缘，多少钱也买不来。',
  ],
  pickup: [
    '你俯身拾起那物，入手微凉。灵识探入，感觉到其中蕴含着不俗的灵力波动。',
    '在草丛深处，你发现了它。拂去泥土，露出真容——这一趟，没白来。',
    '指尖触到那物的一瞬，你感到一股微弱但纯净的灵力传入体内。好东西。',
  ],
  event: [
    '命运在此时拐了一个弯。你感受到一股前所未有的灵力波动——也许，这就是传说中修仙之路上不可或缺的「机缘」。',
    '天地的呼吸仿佛在这一刻停滞了。你心中隐隐有预感——有什么大事即将发生。',
  ],
  auto: [
    '天意如刀，岁月如梭。你的意识沉浸在道的长河中，任凭命运的洪流带着你前行。',
    '万籁俱寂。你与天地融为一体，每一个念头都化作风、化作云、化作大道的一部分。',
  ],
};

function getActionNarrative(type, customFallback) {
  const pool = ACTION_NARRATIVES[type] || ACTION_NARRATIVES.event;
  return pool[Math.floor(Math.random() * pool.length)] || customFallback || '一切如常。';
}

// ==========================
// AI随机叙事描写的完整版（所有动作调用）
// ==========================
async function generateActionNarrative(context, type) {
  // 优先尝试AI
  try {
    const systemPrompt = `你是修仙世界「唯我独仙」的叙事者。每次用户操作后，你给出60-150字的古风散文描写。
- 第二人称「你」
- 多写感官：风、光、气味、声音、身体感受
- 节奏从容，像慢慢翻书，不急不冲
- 不报数值，用画面传递
- 融入时辰和环境特征，写出厚实的场景感`;

    const userPrompt = `${context.playerName}在${context.location}（${context.time}）进行了一次操作：${type}。
${context.detail || ''}
请用一段散文慢慢渲染此刻。`;

    const response = await fetch('https://api.deepseek.com/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + DEEPSEEK_API_KEY,
      },
      body: JSON.stringify({
        model: 'deepseek-v4-flash',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        max_tokens: 150,
        temperature: 0.9,
      })
    });

    if (!response.ok) throw new Error('HTTP ' + response.status);
    const data = await response.json();
    const text = data.choices[0].message.content.trim();
    if (text && text.length > 5) {
      addNarrative(text, 'default');
      return text;
    }
  } catch(e) {
    // fallback
  }
  
  // AI失败则用预制
  const fallback = getActionNarrative(type);
  addNarrative(fallback, 'default');
  return fallback;
}

// ==========================
// UI: 修炼日志面板
// ==========================
function showStoryLogPanel() {
  const chronicle = getLifeChronicle();
  const dailyLog = G.dailyLog || [];
  
  let html = '';
  
  // 今日动态
  if (dailyLog.length > 0) {
    html += '<p style="font-weight:bold;margin-bottom:4px;">🌅 今日动态</p>';
    html += '<div style="font-size:11px;color:var(--text-dim);margin-bottom:8px;">';
    dailyLog.forEach(e => {
      const icons = {
        cultivate:'🧘',explore:'🔍',combat:'⚔️',social:'💬',breakthrough:'💥',
        market:'🏪',rest:'💤',pickup:'🎒',event:'✨',auto:'🌊',
      };
      html += `<span style="margin-right:4px;">${icons[e.type]||'•'} ${e.detail||e.type}${e.npc ? '('+e.npc+')' : ''}</span>`;
    });
    html += '</div>';
  }
  
  // 生涯故事
  if (chronicle.length > 0) {
    html += '<p style="font-weight:bold;margin-bottom:4px;">📖 修炼日志</p>';
    
    // 如果有AI扩写的详细内容
    let hasDetail = chronicle.some(s => s.detail && s.detail.length > 50);
    
    // 显示最近的5篇
    const recent = chronicle.slice(-5).reverse();
    recent.forEach(s => {
      const hasExpanded = s.detail && s.detail.length > 100;
      const preview = hasExpanded ? s.detail.slice(0, 60) + '……' : s.summary;
      
      html += `<div style="border:1px solid rgba(201,169,110,0.2);border-radius:6px;padding:8px;margin-bottom:6px;cursor:pointer;" onclick="showStoryDetail(${s.day})">
        <div style="font-weight:bold;font-size:12px;">📜 ${s.title}</div>
        <div style="font-size:11px;color:var(--text-dim);margin:4px 0;">${preview}</div>
        ${hasExpanded ? '<span style="font-size:10px;color:var(--accent);">📖 有详细纪事 →</span>' : ''}
      </div>`;
    });
    
    if (chronicle.length > 5) {
      html += `<div style="text-align:center;margin:6px 0;"><span style="font-size:11px;color:var(--text-dim);">共${chronicle.length}篇纪事</span></div>`;
    }
    
    // 一生传记按钮
    html += `<div style="margin-top:8px;"><button class="event-choice-btn" onclick="showLifeStory()" style="width:100%;padding:8px;">📜 生成一生传记</button></div>`;
    
  } else {
    html += '<p style="color:var(--text-dim);text-align:center;">尚无修炼纪事。</p>';
  }
  
  showCustomModal('📖 修炼日志', html + `<button class="event-choice-btn" onclick="closeEvent()">关闭</button>`);
}

// ==========================
// UI: 某日详情
// ==========================
function showStoryDetail(dayNum) {
  const chronicle = getLifeChronicle();
  const story = chronicle.find(s => s.day === dayNum);
  if (!story) return;
  
  const hasExpanded = story.detail && story.detail.length > 100;
  const text = hasExpanded ? story.detail : story.summary;
  const noExpand = !hasExpanded && story.detail && story.detail.length < 100;
  
  let html = `<div style="border-bottom:1px solid rgba(255,255,255,0.1);padding-bottom:8px;margin-bottom:8px;">
    <div style="font-weight:bold;font-size:14px;">📜 ${story.title}</div>
    <div style="font-size:11px;color:var(--text-dim);">境界：${story.realm} | 纪事${story.eventCount}则</div>
  </div>
  <div style="font-size:13px;line-height:1.7;white-space:pre-wrap;">${text}</div>`;
  
  html += `<div style="margin-top:10px;text-align:center;"><button class="event-choice-btn" onclick="expandStoryAI(${dayNum})">🤖 AI扩写</button></div>`;
  
  showCustomModal('📖 ' + story.title, html + `<button class="event-choice-btn" onclick="closeEvent()">关闭</button>`);
}

// ==========================
// AI手动扩写某日故事
// ==========================
async function expandStoryAI(dayNum) {
  const chronicle = getLifeChronicle();
  const story = chronicle.find(s => s.day === dayNum);
  if (!story) return;
  
  closeEvent();
  addNarrative('📝 正在生成详细纪事……', 'system');
  
  try {
    const expanded = await expandDailyStoryAI(story, G.player.name, story.realm, getSceneData(G.currentScene)?.name || '未知');
    if (expanded) {
      story.detail = expanded;
      addNarrative('✅ 纪事已扩写完成！', 'event');
    } else {
      addNarrative('扩写失败，请检查API配置。', 'system');
    }
  } catch(e) {
    addNarrative('扩写出错。', 'system');
  }
}

// ==========================
// UI: 一生传记
// ==========================
async function showLifeStory() {
  const chronicle = getLifeChronicle();
  if (chronicle.length === 0) {
    addNarrative('尚无人生可记。', 'system');
    return;
  }
  
  closeEvent();
  addNarrative('📜 正在生成一生传记……', 'system');
  
  const expanded = await expandLifeStoryAI(G.player.name, chronicle);
  
  let html = `<div style="border-bottom:1px solid rgba(255,255,255,0.1);padding-bottom:8px;margin-bottom:8px;">
    <div style="font-weight:bold;font-size:16px;">📜 ${G.player.name} · 修行印象记</div>
    <div style="font-size:11px;color:var(--text-dim);">共${chronicle.length}篇纪事 | 当前境界：${QI_REALMS[G.player.qiRealmIndex]?.name || '凡人'}</div>
  </div>
  <div style="max-height:400px;overflow-y:auto;font-size:13px;line-height:1.8;white-space:pre-wrap;">${expanded}</div>`;
  
  showCustomModal('📜 一生传记', html + `<button class="event-choice-btn" onclick="closeEvent()">关闭</button>`);
}

// ==========================
// 一键生成所有积累日志的故事
// ==========================
async function writeAllStories() {
  const chronicle = getLifeChronicle();
  const pending = chronicle.filter(s => !s.detail || s.detail.length < 50);
  
  if (pending.length === 0) {
    addNarrative('所有纪事均已扩写完毕。', 'system');
    return;
  }
  
  addNarrative(`📝 正在扩写 ${pending.length} 篇未完成的纪事……`, 'system');
  
  let success = 0;
  for (const story of pending.slice(0, 5)) { // 一次最多写5篇
    try {
      const expanded = await expandDailyStoryAI(story, G.player.name, story.realm, '修仙界');
      if (expanded) {
        story.detail = expanded;
        success++;
      }
    } catch(e) {}
  }
  
  addNarrative(`✅ 完成了 ${success}/${Math.min(pending.length,5)} 篇纪事扩写。`, 'event');
}

// ==========================
// 导出
// ==========================
window.initDailyLog = initDailyLog;
window.addDailyLogEntry = addDailyLogEntry;
window.checkDayChange = checkDayChange;
window.generateDayStory = generateDayStory;
window.getActionNarrative = getActionNarrative;
window.generateActionNarrative = generateActionNarrative;
window.showStoryLogPanel = showStoryLogPanel;
window.showStoryDetail = showStoryDetail;
window.showLifeStory = showLifeStory;
window.expandStoryAI = expandStoryAI;
window.writeAllStories = writeAllStories;
window.getLifeChronicle = getLifeChronicle;
