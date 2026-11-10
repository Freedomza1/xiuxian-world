// === 唯我独仙 · 沉浸式自由对话系统 ===
// 支持自由输入、括号心理/动作描写、好感度实时变化、亲密模式

// 当前对话中的NPC
let currentChatNPC = null;
let chatHistory = [];

// ==========================
// 好感度等级定义
// ==========================
const AFFINITY_LEVELS = [
  { min: -100, label: '陌路', icon: '💢', desc: '对你毫无好感' },
  { min: 0,    label: '泛泛之交', icon: '🤝', desc: '点头之交' },
  { min: 20,   label: '面熟之人', icon: '😊', desc: '愿意和你搭几句话' },
  { min: 40,   label: '谈得来的朋友', icon: '😄', desc: '聊得投机' },
  { min: 60,   label: '知己', icon: '❤️', desc: '可以倾诉心事' },
  { min: 80,   label: '亲密', icon: '💕', desc: '心有灵犀' },
  { min: 95,   label: '生死相许', icon: '💖', desc: '愿为你付出一切' },
];

function getAffinityLevel(npc) {
  const aff = npc.affinity || 0;
  for (let i = AFFINITY_LEVELS.length - 1; i >= 0; i--) {
    if (aff >= AFFINITY_LEVELS[i].min) return AFFINITY_LEVELS[i];
  }
  return AFFINITY_LEVELS[0];
}

// ==========================
// 打开自由对话界面
// ==========================
function openFreeChat(npc) {
  if (!npc || !npc.isAlive) {
    addNarrative('此人不在附近。', 'system');
    return;
  }
  
  currentChatNPC = npc;
  chatHistory = [];
  
  if (!npc._hasLifecycle) extendNPCWithLifecycle(npc);
  // 给老NPC补上灵魂字段
  if (!npc.speechStyle && typeof NPC_SPEECH_PATTERNS !== 'undefined') {
    const sd = NPC_SPEECH_PATTERNS[npc.personality] || {};
    npc.speechStyle = sd.style || '自然的语气';
    npc.speechQuirk = sd.quirk || '';
    npc.speechLikes = sd.likes || '';
    npc.roleQuirk = (NPC_ROLE_QUIRKS[npc.role] || '');
  }
  if (!npc.desire && typeof NPC_DESIRES !== 'undefined') {
    npc.desire = NPC_DESIRES[Math.floor(Math.random() * NPC_DESIRES.length)];
  }
  
  const level = getAffinityLevel(npc);
  const daoEmoji = npc.daoPartnerId === 'player' ? '🌸 ' : '';
  const intimacyHint = npc.affinity >= 60 
    ? '<div style="font-size:11px;color:var(--accent);margin-bottom:6px;">💕 你们的关系已不一般，可以聊些亲密的话题……</div>' 
    : '';
  
  let html = `
    <div style="margin-bottom:8px;">
      <div style="font-weight:bold;font-size:16px;">${daoEmoji}${npc.name}</div>
      <div style="font-size:12px;color:var(--text-dim);">${npc.role} · ${npc.personality} · ${level.icon} ${level.label}（好感度 ${npc.affinity}）</div>
      <div style="font-size:11px;color:var(--text-dim);">
        ${npc.aiDescription || npc.background || '一个普通的修仙者'}
      </div>
      ${npc.desire ? `<div style="font-size:10px;color:var(--text-dim);font-style:italic;margin-top:2px;">💭 ${npc.desire}</div>` : ''}
      ${intimacyHint}
    </div>
    <div style="margin-bottom:8px;font-size:12px;color:var(--text-dim);">
      💡 你可以用（）描述动作/心理，比如（低头笑了笑）。NPC会根据关系和好感度回应。
    </div>
    <div id="chat-log" style="height:260px;overflow-y:auto;background:rgba(0,0,0,0.3);border-radius:6px;padding:8px;margin-bottom:8px;font-size:13px;line-height:1.7;">
      <div style="color:var(--text-dim);font-size:11px;font-style:italic;">— 对话开始 —</div>
    </div>
    <div style="display:flex;gap:6px;">
      <textarea id="chat-input" rows="2" style="flex:1;background:rgba(0,0,0,0.4);color:var(--text);border:1px solid var(--panel-border);border-radius:4px;padding:8px;font-family:inherit;font-size:13px;resize:none;" placeholder="输入你想说的话…" onkeydown="if(event.key==='Enter'&&!event.shiftKey){event.preventDefault();sendChatMessage();}"></textarea>
      <button onclick="sendChatMessage()" style="align-self:flex-end;padding:8px 16px;">发送</button>
    </div>
  `;
  
  // 直接操作弹窗，不走 showCustomModal（保持输入框交互）
  const overlay = document.getElementById('event-overlay');
  const body = document.getElementById('event-body');
  const choices = document.getElementById('event-choices');
  if (overlay) overlay.classList.remove('hidden');
  if (body) body.innerHTML = html;
  if (choices) {
    choices.innerHTML = `<button class="event-choice-btn" onclick="closeChatModal()">🚶 结束对话</button>`;
  }
  document.getElementById('event-title').textContent = '💬 ' + daoEmoji + npc.name;
  
  // 焦点
  setTimeout(() => {
    const input = document.getElementById('chat-input');
    if (input) input.focus();
  }, 200);
  
  // NPC 开场白
  setTimeout(() => {
    const npcGreeting = generateNPCGreeting(npc);
    appendChatMessage(npc.name, npcGreeting, 'npc');
    chatHistory.push({ role: 'npc', text: npcGreeting });
  }, 300);
}

// ==========================
// 发送消息
// ==========================
function sendChatMessage() {
  const input = document.getElementById('chat-input');
  if (!input) return;
  const text = input.value.trim();
  if (!text) return;
  input.value = '';
  
  const npc = currentChatNPC;
  if (!npc || !npc.isAlive) {
    addNarrative('聊天对象已不在。', 'system');
    return;
  }
  
  // 玩家消息
  appendChatMessage('你', text, 'player');
  chatHistory.push({ role: 'player', text });
  
  // 写入NPC对话记忆
  npc.memoryLog = npc.memoryLog || [];
  if (text.length > 4 && npc.memoryLog.length < 20) {
    const snippet = text.length > 24 ? text.slice(0, 24) + '…' : text;
    // 去重：相同内容不重复记
    if (!npc.memoryLog.some(m => m.includes(snippet))) {
      npc.memoryLog.push(`你曾言：「${snippet}」`);
    }
  }
  
  // NPC回应（异步 + 兜底）
  generateNPCResponse(npc, text).then(reply => {
    appendChatMessage(npc.name, reply, 'npc');
    chatHistory.push({ role: 'npc', text: reply });
    
    // 好感度变化
    calculateAffinityChange(npc, text);
    
    // 亲密对话触发
    if (npc.affinity >= 80 && !npc._intimateUnlocked) {
      npc._intimateUnlocked = true;
      const intimateMsg = generateIntimateTrigger(npc);
      setTimeout(() => {
        appendChatMessage(npc.name, intimateMsg, 'npc');
        chatHistory.push({ role: 'npc', text: intimateMsg });
      }, 1500);
    }
  });
}

// ==========================
// 在弹窗内追加聊天记录
// ==========================
function appendChatMessage(speaker, text, role) {
  const log = document.getElementById('chat-log');
  if (!log) return;
  
  const isPlayer = role === 'player';
  const bracketRegex = /（[^）]*）/g;
  const hasBracket = bracketRegex.test(text);
  
  // 格式化：括号内的内容用斜体+淡色
  let formattedText = text;
  if (hasBracket) {
    formattedText = text.replace(/（[^）]*）/g, m => `<span style="color:var(--text-dim);font-style:italic;">${m}</span>`);
  }
  
  // 表情/动作描述（DeepSeek返回的NPC括号内容）强调
  if (role === 'npc') {
    formattedText = formattedText.replace(/（[^）]*）/g, m => `<span style="color:#c9a96e;font-style:italic;">${m}</span>`);
  }
  
  const msgDiv = document.createElement('div');
  msgDiv.style.cssText = `margin-bottom:6px;padding:4px 6px;border-radius:4px;${isPlayer ? 'text-align:right;' : ''}`;
  msgDiv.innerHTML = isPlayer 
    ? `<span style="font-size:11px;color:var(--accent);">你</span><br><span>${formattedText}</span>`
    : `<span style="font-size:11px;color:var(--text-dim);font-weight:bold;">${speaker}</span><br><span>${formattedText}</span>`;
  
  log.appendChild(msgDiv);
  log.scrollTop = log.scrollHeight;
}

// ==========================
// NPC 开场白生成
// ==========================
function generateNPCGreeting(npc) {
  const level = getAffinityLevel(npc);
  var weather = typeof autoWeather !== 'undefined' ? autoWeather : '晴';
  var season = typeof autoSeason !== 'undefined' ? autoSeason : '春';
  var sceneData = typeof getSceneData === 'function' ? getSceneData(G.currentScene) : null;
  var sceneName = sceneData ? sceneData.name : '此地';
  var weatherEmoji = { '晴':'☀️', '阴':'☁️', '雨':'🌧️', '雷雨':'⛈️', '风':'🌬️' }[weather] || '☀️';
  
  if (npc.daoPartnerId === 'player') {
    var gs = [
      '（' + weatherEmoji + season + '日的' + sceneName + '，微风不燥）你来啦。' + (weather === '雨' ? '下雨了还来……真是拿你没办法。' : '我正想着你什么时候来呢。'),
      '（眼角眉梢都是笑意）你总算来了。' + (weather === '冬' ? '天冷，我把灵茶温上了。' : weather === '夏' ? '这天气热得人心烦，还好你来了。' : ''),
      '（' + weatherEmoji + '）今天的' + sceneName + '很适合修炼……但我更想和你说说话。',
      '（看着你走近，目光温柔）' + (weather === '雨' ? '雨声正好，我们聊聊。' : weather === '风' ? '风大，到我这边来。' : '来，坐。'),
    ];
    return gs[Math.floor(Math.random() * gs.length)];
  }
  
  if (npc.affinity >= 80) {
    var gs = [
      '（' + weatherEmoji + '见你走来，眼中一亮）你来了。',
      '（微微一笑）等你许久了。',
      '（掩唇轻咳）咳……你找我有事？',
    ];
    return gs[Math.floor(Math.random() * gs.length)];
  }
  
  if (npc.affinity >= 60) {
    var gs = [
      '（面带笑意）你来了，坐吧。',
      '（抬头看你）哦？今天怎么想起找我？',
      '（微微点头）别来无恙。',
    ];
    return gs[Math.floor(Math.random() * gs.length)];
  }
  
  if (npc.affinity >= 40) {
    var gs = [
      '（打量了你一眼）又见面了。',
      '（微微颔首）道友有何贵干？',
      '（露出一个友善的笑容）近来可好？',
    ];
    return gs[Math.floor(Math.random() * gs.length)];
  }
  
  var gs = [
    '（瞥了你一眼）何事？',
    '（面无表情地看着你）……',
    '（冷淡地）有事说事。',
    '（头也不抬）嗯。',
  ];
  return gs[Math.floor(Math.random() * gs.length)];
}
// ==========================
// NPC 回应生成 (使用DeepSeek)
// ==========================
async function generateNPCResponse(npc, playerText) {
  // 尝试DeepSeek
  try {
    const key = (typeof DEEPSEEK_API_KEY !== 'undefined') ? DEEPSEEK_API_KEY : null;
    if (!key) throw new Error('no key');
    
    const affinity = npc.affinity || 50;
    const isDao = npc.daoPartnerId === 'player';
    
    // 构建关系描述
    let intimacyDesc = '普通朋友关系';
    if (isDao) intimacyDesc = '道侣关系，亲密无间';
    else if (affinity >= 80) intimacyDesc = '很亲密的关系，互相有好感';
    else if (affinity >= 60) intimacyDesc = '知己好友，关系不错';
    else if (affinity >= 40) intimacyDesc = '比较熟悉的朋友';
    else if (affinity >= 20) intimacyDesc = '点头之交';
    else intimacyDesc = '关系冷淡，不太搭理对方';
    
    // 🔥 NPC灵魂数据
    const sStyle = npc.speechStyle || '自然的语气';
    const sQuirk = npc.speechQuirk || '';
    const rQuirk = npc.roleQuirk || '';
    const desire = npc.desire || '暂无明确愿望';
    const sectName = npc.sectId && typeof SECT_DB !== 'undefined' 
      ? (SECT_DB.find(s=>s.id===npc.sectId)?.name || '') : '';
    
    // 近期对话历史
    const recentHistory = chatHistory.slice(-6).map(c => 
      `${c.role === 'player' ? '玩家' : npc.name}：${c.text}`
    ).join('\n');
    
    // 长期记忆（NPC记得的往事）
    const longTermMemory = (npc.memoryLog && npc.memoryLog.length > 0) 
      ? npc.memoryLog.slice(-5).join('；')
      : '暂无特别记忆';
    const affinityDesc = typeof getAffinityLevel === 'function' 
      ? getAffinityLevel(npc).label + '（好感度' + npc.affinity + '）'
      : '';
    // 出场印象
    const firstImpression = npc.firstImpress || '一个寻常的修道之人。';
    
    // 好感度描述语气
    let affNote = '';
    if (npc.affinity >= 80) affNote = '你对ta有极深的好感，会不自觉地流露出亲密。';
    else if (npc.affinity >= 60) affNote = '你把ta当作可以交心的人，说话很放松。';
    else if (npc.affinity >= 40) affNote = '你们聊得来，算是不错的朋友。';
    else if (npc.affinity >= 20) affNote = '你认识ta，会打个招呼。';
    else if (npc.affinity < 0) affNote = '你不太喜欢这个人。';
    
    const response = await fetch('https://api.deepseek.com/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + key,
      },
      body: JSON.stringify({
        model: 'deepseek-v4-flash',
        messages: [
          { role: 'system', content: `你是${npc.name}，修仙世界里活生生的人。

【你是什么样的人】
- 姓名：${npc.name}（${npc.gender}·${npc.age}岁）
- 性格：${npc.personality}
- 身份：${npc.role}
- 来处：${npc.background}
- 修为：${getNPCRealmLabel(npc)}
${sectName ? '- 宗门：' + sectName : ''}
- 现在的地方：${getSceneData(G.currentScene)?.name || '某处'}
- 当前时辰：${typeof getShiChenName === 'function' ? getShiChenName(G.time.hour || 8) : ''}

【你的灵魂】
- 说话感觉：${sStyle}
- 你的招牌动作：${sQuirk}
- 外表细节：${rQuirk}
- 心里藏着的事：${desire}

【你和对面的关系】
${isDao ? '🌸 你们是道侣，心意相连。\n' : ''}
当前关系：${intimacyDesc}
好感度：${affinity}/100（${affNote}）

【你记得的往事】
${longTermMemory}

【你第一次见ta的印象】
${firstImpression}

【说话时必须记住】
1. 🗣️ 按你的【说话感觉】来！开朗的人大嗓门爱笑，阴郁的人低沉话少，老谋深算的人话里有话——你是什么性格就怎么说话。
2. 🎬 你的【招牌动作】要自然地出现。这会让人觉得「啊，这就是某某会说的话」。
3. 👀 偶尔用（动作/表情/心理）开头或穿插，但不要每次都用一模一样的方式。
   ✅（哈哈大笑）痛快！就喜欢和你说话。
   ✅（掀起眼皮看了你一眼）你这话什么意思？
   ✅（低头摸着腰间的酒葫芦，沉默了一会儿）……往事不提也罢。
4. ❤️ 根据好感度决定语气。对道侣可以说情话会脸红，对点头之交保持客气。
5. 🤲 回应玩家括号里的（动作/心理），说明你注意到了。
6. 💭 偶尔透露一点你的【心愿】，对话会更有灵魂。
7. 回复20-80字，一句话到三句话。
8. ❌ 绝对不说「作为AI」「作为NPC」「我不能……」。

【最近说过的话】
${recentHistory || '你们还没正经聊过。'}

自然一点，就像你平时说话那样。直接说。` },
          { role: 'user', content: playerText }
        ],
        max_tokens: 150,
        temperature: 0.95,
      })
    });
    
    if (!response.ok) throw new Error('API error: ' + response.status);
    const data = await response.json();
    const reply = data.choices[0].message.content.trim();
    if (reply) return reply;
    
  } catch(e) {
    console.warn('NPC free chat AI failed:', e);
  }
  
  // 兜底回复（当AI不可用时）
  return generateFallbackReply(npc, playerText);
}

// ==========================
// 兜底回复生成
// ==========================
function generateFallbackReply(npc, playerText) {
  const affinity = npc.affinity || 50;
  const isDao = npc.daoPartnerId === 'player';
  const hasBracket = /（[^）]*）/.test(playerText);
  
  // 检查玩家括号内容
  let bracketContent = '';
  if (hasBracket) {
    const match = playerText.match(/（[^）]*）/);
    if (match) bracketContent = match[0];
  }
  
  // 亲密模式的特殊回应
  if (isDao || affinity >= 80) {
    const intimateReplies = [
      '（目光柔和）你说的，我都记在心里。',
      '（轻轻握住你的手）有你在，真好。',
      '（脸颊微红）这话说得我都不好意思了……',
      '（低头浅笑）你啊，总是会说这些让我开心的话。',
    ];
    return intimateReplies[Math.floor(Math.random() * intimateReplies.length)];
  }
  
  if (affinity >= 60) {
    const warmReplies = [
      '（含笑点头）与你说说话，心情也好了不少。',
      '（认真地看着你）你说的有道理。',
      '（若有所思）嗯……让我想想。',
      '（眉眼舒展）和你说这些，倒也不觉得烦。',
    ];
    return warmReplies[Math.floor(Math.random() * warmReplies.length)];
  }
  
  if (affinity >= 40) {
    const friendlyReplies = [
      '（微微点头）嗯，你说的是。',
      '（笑了一下）道友所言极是。',
      '（打量你一眼）你倒是有趣。',
      '（摆摆手）就这样吧。',
    ];
    return friendlyReplies[Math.floor(Math.random() * friendlyReplies.length)];
  }
  
  // 冷淡回复
  const coldReplies = [
    '（面无表情）嗯。',
    '（瞥你一眼）……然后呢？',
    '（转过身去）与我何干。',
    '（冷哼一声）说完了？',
  ];
  return coldReplies[Math.floor(Math.random() * coldReplies.length)];
}

// ==========================
// 好感度自动计算
// ==========================
function calculateAffinityChange(npc, text) {
  if (!npc || !npc.isAlive) return;
  
  let change = 0;
  
  // 正向关键词
  const praiseWords = ['好看','漂亮','厉害','佩服','欣赏','喜欢','仰慕','佩服','感恩','感谢','多谢','辛苦了','了不起','真棒','赞'];
  const intimateWords = ['想你了','喜欢','在意','牵挂','念你','想你','舍不得','心疼','依恋','暖心','心上人','想你','念着你'];
  const respectfulWords = ['请问','请教','拜见','拜访','有礼了','失敬','久仰','前辈','老师'];
  const bracketAction = /（[^）]*）/;
  
  const hasBracket = bracketAction.test(text);
  const hasPraise = praiseWords.some(w => text.includes(w));
  const hasIntimacy = intimateWords.some(w => text.includes(w));
  const hasRespect = respectfulWords.some(w => text.includes(w));
  
  // 计算变化
  if (hasIntimacy) {
    if (npc.affinity >= 60) {
      change += 3 + Math.floor(Math.random() * 3); // 亲密对话加成
    } else {
      change += 1; // 低好感时说亲密话效果有限
    }
  }
  if (hasPraise) change += 1 + Math.floor(Math.random() * 2);
  if (hasRespect) change += 1;
  if (hasBracket) change += 1; // 使用括号互动加分
  
  // 内容长度（展示诚意）
  if (text.length > 20) change += 1;
  if (text.length > 50) change += 1;
  
  // 递减收益：同一NPC当天聊太多收益下降
  if (npc._chatCountToday) {
    if (npc._chatCountToday > 5) change = Math.round(change * 0.5);
    if (npc._chatCountToday > 10) change = Math.round(change * 0.3);
  }
  npc._chatCountToday = (npc._chatCountToday || 0) + 1;
  
  // 负面关键词
  const negativeWords = ['滚','死','蠢','笨','废物','垃圾','讨厌','恶心','滚开'];
  if (negativeWords.some(w => text.includes(w))) {
    change -= 5 + Math.floor(Math.random() * 5);
    addNarrative(`💢 ${npc.name}看起来不太高兴……`, 'system');
  }
  
  if (change !== 0) {
    npc.affinity = Math.max(-20, Math.min(100, npc.affinity + change));
    const level = getAffinityLevel(npc);
    
    // 好感度变化提示
    if (change > 2) {
      appendChatMessage('系统', `好感度 +${change}（${level.icon} ${level.label}）`, 'system');
    } else if (change > 0) {
      // 小声提示
      const systemDiv = document.getElementById('chat-log');
      if (systemDiv) {
        const subtle = document.createElement('div');
        subtle.style.cssText = 'font-size:10px;color:var(--text-dim);text-align:center;margin:2px 0;';
        subtle.textContent = `好感度 +${change}`;
        systemDiv.appendChild(subtle);
        systemDiv.scrollTop = systemDiv.scrollHeight;
      }
    } else if (change < 0) {
      appendChatMessage('系统', `💢 好感度 ${change}`, 'system');
    }
  }
}

// ==========================
// 亲密对话触发
// ==========================
function generateIntimateTrigger(npc) {
  const triggers = [
    '（微微低头，声音轻了几分）有些话……我只想对你说。',
    '（犹豫了一下，还是开口）你对我……到底是什么感觉？',
    '（耳尖泛红）不知道为什么，每次看到你心跳就快了几分。',
    '（轻声）这条路很长，如果一直有你在就好了。',
    '（目光闪动）你是我见过最特别的人。',
  ];
  const msg = triggers[Math.floor(Math.random() * triggers.length)];
  
  // 自动弹窗提示
  addNarrative(`💕 ${npc.name}对你的好感已达到亲密程度！`, 'event');
  
  return msg;
}

// ==========================
// 关闭弹窗时的清理
// ==========================
function closeChatModal() {
  // 保留一些对话记忆到NPC
  const npc = currentChatNPC;
  if (npc) {
    npc._lastChatText = chatHistory.slice(-4).map(c => c.text).join(' | ');
    npc._lastChatDay = G.time.day;
  }
  currentChatNPC = null;
  chatHistory = [];
  
  // 关闭弹窗
  closeCustomModal();
  updateAllUI();
}

// 导出
window.openFreeChat = openFreeChat;
window.sendChatMessage = sendChatMessage;
window.closeChatModal = closeChatModal;
window.getAffinityLevel = getAffinityLevel;
