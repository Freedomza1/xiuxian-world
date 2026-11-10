// === 唯我独仙 · 双人飞升系统（2026-08-04）===
// 炼气飞升 + 道侣（stage5）+ 羁绊足够 → 解锁「双修合璧·共赴飞升」
// 流程：天门感应 → 双修合璧（灵肉交融）→ 破界飞升 → 结局叙事 + 成就
// 飞升后游戏继续（非结局），可多次体验仪式；故事日志记录每一次

// ── 飞升条件检测 ──
function canAscendTogether() {
  try {
    var p = G.player;
    var f = getIceFairy();
    if (!p || !f) return false;
    if ((p.qiRealmIndex || 0) < 22) return false;      // 炼气飞升
    if (f.stage < 5) return false;                      // 结为道侣
    if ((f.affinity || 0) < 90) return false;           // 羁绊深厚
    return true;
  } catch(e) { return false; }
}

// ── 飞升按钮 HTML（冰窟面板调用）──
function ascensionBtnHtml() {
  try {
    if (!canAscendTogether()) return '';
    var p = G.player;
    // 🔧 2026-08-04：飞升只一次——成功后按钮消失，不再重复
    if (p._ascensionCount) return '';
    return '<div class="event-choice-btn" onclick="startAscension()" style="margin-bottom:3px;text-align:left;font-size:11px;padding:8px 10px;border-color:#ffd700;background:linear-gradient(90deg,rgba(255,215,0,0.15),rgba(255,160,0,0.08));animation:fairyPulse 2s infinite;">' +
      '☯️ 双修合璧 · 共赴飞升</div>';
  } catch(e) { return ''; }
}

// ── 飞升剧情触发（在冰窟面板点击）──
async function startAscension() {
  try {
    var p = G.player;
    var f = getIceFairy();
    if (!canAscendTogether()) {
      addNarrative('缘分未至，尚不能共赴飞升。', 'system');
      return;
    }
    // 🔧 2026-08-04：飞升只一次——已飞升则不再重复
    if (p._ascensionCount) {
      addNarrative('你与霜华早已飞升仙界，如今是回凡尘休闲的日子了。', 'system');
      return;
    }
    
    // 飞升过程：一段完整叙事（AI 增强 + 本地兜底）
    addNarrative('☯️ 你与霜华相对而坐，双掌相贴。丹田中的飞升之力与她的冰凰真元在掌心交融，化作一道冲天的光柱！', 'narr-epic');
    
    // 尝试 AI 生成飞升描写
    var scene = await ascensionSceneAI(f, p);
    
    p._ascensionCount = 1;
    
    // 成就记录
    if (!Array.isArray(p.achievements)) p.achievements = [];
    p.achievements.push('☯️ 双修合璧·共赴飞升——与百里冰同登仙界');
    addNarrative('🏆 达成成就：双修合璧·共赴飞升！', 'milestone');
    
    // 完整飞升叙事
    var html = '<div style="border:1px solid #ffd70055;border-radius:8px;padding:10px;margin:6px 0;background:linear-gradient(135deg,rgba(255,215,0,0.08),rgba(255,160,0,0.04));">' +
      '<div style="font-size:13px;font-weight:bold;color:#ffd700;margin-bottom:6px;">☯️ 双修合璧 · 共赴飞升</div>' +
      '<div style="font-size:12px;line-height:1.9;color:#f5e6c8;">' + scene + '</div>' +
      '<div style="font-size:10px;color:var(--accent);margin-top:6px;">✨ 天门洞开，你与霜华携手登仙——此界再无关隘</div>' +
      '</div>';
    addNarrative(html, 'milestone');
    
    // 飞升奖励：修为继续溢出到未圆满一方（双圆满则给道心/悟性）
    if (typeof gainCultivation === 'function') {
      gainCultivation('qi', 50000);
      gainCultivation('body', 30000);
    }
    p.daoHeart = Math.min(200, (p.daoHeart || 50) + 5);
    p.mood = 100;
    
    // 故事日志
    if (typeof addDailyLogEntry === 'function') {
      try { addDailyLogEntry('ascension', '与百里冰双修合璧，共赴飞升'); } catch(e) {}
    }
    
    updateAllUI();
  } catch(e) { console.warn('ascension error:', e); }
}

// ── AI 生成飞升场景描写 ──
async function ascensionSceneAI(f, p) {
  // 🔧 安全读取 API key：const 声明不跨 eval 作用域（测试环境），用 window 兜底
  var key = '';
  try { key = (typeof ICE_FAIRY_API_KEY !== 'undefined') ? ICE_FAIRY_API_KEY : (window.ICE_FAIRY_API_KEY || ''); } catch(e) { key = ''; }
  if (!key || key.indexOf('sk-') !== 0) return ascensionFallbackScene(p);
  
  var genderCN = (p.gender === '女') ? '女修' : '男修';
  var appr = p.appearance || '剑眉星目';
  var bodyT = p.bodyType || '挺拔';
  var height = p.height || '178';
  var realmName = '';
  try { realmName = (typeof getQiRealm === 'function' && getQiRealm()) ? getQiRealm().name : ''; } catch(e) {}
  
  var sys = '你是一位仙侠史诗作家，文笔恢弘大气又不失细腻。现在描写一对修仙道侣共同飞升的场景，要求：\n' +
    '1. 用中文，180-300字\n' +
    '2. 描写女子霜华：万载冰封的冰仙子，素衣如雪，青丝如瀑，此刻与道侣相视而笑\n' +
    '3. 描写男子（玩家）：' + genderCN + '，' + appr + '，' + bodyT + '，身高' + height + '\n' +
    '4. 描写飞升过程：天门洞开、金光万道、雷劫淬体、二人灵力交融如太极相合、携手踏破虚空\n' +
    '5. 意境：既是超脱的壮阔，又是执子之手的深情——成仙路上，有你同行\n' +
    '6. 不用引号包裹，直接输出正文';
  
  try {
    var ctrl = new AbortController();
    var timer = setTimeout(function(){ try { ctrl.abort(); } catch(e) {} }, 12000);
    var r = await fetch('https://api.deepseek.com/chat/completions', {
      method:'POST', headers:{'Content-Type':'application/json','Authorization':'Bearer '+key},
      body:JSON.stringify({model:'deepseek-chat',messages:[{role:'system',content:sys},{role:'user',content:'描写'+(p.name||'')+'与霜华共同飞升'}],max_tokens:500,temperature:1.05}),
      signal: ctrl.signal
    });
    clearTimeout(timer);
    if (!r.ok) throw new Error('API error');
    var d = await r.json();
    var reply = d.choices && d.choices[0] && d.choices[0].message ? d.choices[0].message.content.trim() : '';
    if (reply && reply.length > 30) return reply.replace(/\n+/g, '<br>');
  } catch(e) { console.warn('Ascension AI failed:', e); }
  return ascensionFallbackScene(p);
}

// ── 本地兜底飞升描写 ──
function ascensionFallbackScene(p) {
  var name = p.name || '你';
  var scenes = [
    '天门洞开，金光万道。' + name + '与霜华双掌相贴，灵力如两条天河在掌心交汇。脚下万载冰窟轰然震颤，头顶云层被一道光柱贯穿——天劫雷光劈落，却在触及二人身前三寸处化作漫天金莲。霜华抬眸，眸中映着你的身影：「走。」她轻声道，握紧你的手。二人相视一笑，携手踏空而起，化作两道流光，没入天门之中。身后，人间山河渐远，而前方，是无穷无尽的仙界。',
    '那一瞬，天地为之寂静。' + name + '体内飞升之力与霜华的冰凰真元同时共鸣，阴阳二气在二人之间形成一道完美的太极漩涡。雷云翻涌，九道天雷连珠落下，却被那道漩涡尽数吞纳，化为淬体的金光。霜华的青丝在罡风中飞扬，她侧过头，对你展颜一笑——万年冰封的心，在此刻彻底融化。「此去仙界路远，」她柔声道，「有你同行，便不孤单。」话音未落，天门轰然洞开，二人携手踏入，身后只余满天神光与凡尘众生仰望的目光。',
    '飞升的刹那，' + name + '忽然明白了何为「道侣」。不是并肩而立的同路人，而是连灵魂都纠缠在一起的另一半。雷劫之中，霜华始终与你十指相扣，她的冰灵力与你的真元互为护持，生生不息。当最后一道天雷化作甘霖，天门訇然中开——仙乐袅袅，彩云铺路。霜华轻轻依偎过来，在你耳边低语：「谢谢你，带我走出万年的孤寂。」你握紧她的手，目光坚定：「往后岁月，我都在。」两道身影相携而起，消失在天门之后。',
  ];
  return scenes[Math.floor(Math.random() * scenes.length)];
}

// ── 每日飞升感应提示（满足条件时引导玩家去冰窟）──
function ascensionDailyHint() {
  try {
    if (!canAscendTogether()) return;
    var p = G.player;
    var today = G.time ? G.time.day : 0;
    if (p._ascensionHintDay === today) return;   // 当天已提示
    p._ascensionHintDay = today;
    if (typeof addNarrative === 'function') {
      var hints = [
        '🌅 晨光中，你忽然感到丹田一阵悸动——那是飞升之力在呼应着什么。识海中传来霜华温柔的低语：「来冰窟吧，你我合璧，共赴天门。」',
        '☁️ 今日天象异变，云层中隐约有金光流转。你心中了然——飞升之期已至，霜华在冰窟等你。',
        '🌟 昨夜你梦见天门洞开，霜华立在金光中向你伸手。醒来时，掌心犹有冰凉的触感——去万载冰窟看看她吧。'
      ];
      addNarrative(hints[Math.floor(Math.random() * hints.length)], 'narr-epic');
    }
  } catch(e) {}
}

// ── 飞升逍遥：每日看孩子互动（有孩子时）──
function ascendKidsDaily() {
  try {
    var p = G.player;
    var kids = (typeof getChildren === 'function') ? getChildren() : [];
    if (!kids || kids.length === 0) return;
    var kid = kids[Math.floor(Math.random() * kids.length)];
    var f = getIceFairy();
    var today = G.time ? G.time.day : 0;
    if (p._lastKidDay === today) return;
    p._lastKidDay = today;
    
    var genderTxt = (kid.gender === '女') ? '女儿' : '儿子';
    var scenes = [
      '👨‍👩‍👧 清晨，' + (f ? '霜华' : '道侣') + '牵着' + genderTxt + '的手在冰窟外散步。' + kid.name + '仰起小脸：「爹，我昨夜梦见自己飞起来了！」你蹲下身，揉了揉他的发顶：「会的，等你长大，爹娘带你去看仙界。」',
      '👶 ' + kid.name + '今日缠着霜华学冰系法术，小小的手掌凝出一朵冰花，得意地举到你面前：「爹你看！」霜华在一旁掩唇轻笑，你接过冰花，眼中满是温柔：「比爹当年强多了。」',
      '🍡 午后，霜华在洞府里做了几碟灵果糕，' + kid.name + '吃得满脸都是。你一边给他擦嘴一边笑：「慢点吃，又没人跟你抢。」霜华看着这一幕，目光柔软得像春水。',
      '📜 晚间，你教' + kid.name + '识字。他趴在案前，一笔一划写着「仙」字，写完抬头问：「爹，我什么时候能像你一样厉害？」你摸摸他的头：「不急，你慢慢长大，爹娘都在。」'
    ];
    var scene = scenes[Math.floor(Math.random() * scenes.length)];
    if (typeof addNarrative === 'function') {
      addNarrative(scene, 'narr-epic');
    }
    // 陪伴孩子：心境+悟性微涨
    p.mood = Math.min(100, (p.mood || 50) + 3);
    if (typeof updateAllUI === 'function') updateAllUI();
  } catch(e) {}
}

// ── 飞升逍遥：每日双人游历（有道侣时）──
function ascendWanderDaily() {
  try {
    var p = G.player;
    var f = getIceFairy();
    if (!f || f.stage < 5) return;
    var today = G.time ? G.time.day : 0;
    if (p._lastWanderDay === today) return;
    p._lastWanderDay = today;
    
    var scenes = [
      '🌅 你与霜华并肩立于灵云峰巅，看云海翻涌、日出金光洒满群山。她轻轻靠在你肩上：「修行万载，从未想过有人陪我一起看这样的风景。」你握紧她的手：「以后每一年，都陪你看。」',
      '🏔️ 你带霜华重游碧波湖。湖光山色依旧，只是身边多了一个人。她俯身掬起一捧湖水，冰凉的湖水中倒映着你们的身影，她笑着将水泼向你，笑声清脆如铃。',
      '🌌 夜深，你们在洞府前摆下茶案。霜华沏茶，你讲起凡间往事，她听得入神。茶香袅袅，星光洒落，她轻声说：「有你在的地方，便是仙乡。」',
      '🌸 你们携手穿过落霞森林，霜华指尖拂过花瓣，万千花瓣随之旋舞，如一场花雨。她回头对你一笑：「当年冰封万载，如今方知，人间竟有这般温柔。」你笑而不语，只将她拥入怀中。'
    ];
    var scene = scenes[Math.floor(Math.random() * scenes.length)];
    if (typeof addNarrative === 'function') {
      addNarrative(scene, 'narr-epic');
    }
    // 游历收益：道心+悟性微涨
    p.daoHeart = Math.min(200, (p.daoHeart || 50) + 2);
    p.mood = Math.min(100, (p.mood || 50) + 3);
    if (typeof updateAllUI === 'function') updateAllUI();
  } catch(e) {}
}

// ── 飞升逍遥：看世界（随机去一个安全场景纯观光，不战斗）──
function ascendWorldSightsee() {
  try {
    var p = G.player;
    if (!G.worldData || !G.worldData.layers) return;
    var today = G.time ? G.time.day : 0;
    // 冷却：每2天最多1次
    if (p._lastSightseeDay && (today - p._lastSightseeDay) < 2) return;
    
    // 收集所有安全场景（城镇/风景，不带怪）
    var safeScenes = [];
    G.worldData.layers.forEach(function(layer) {
      (layer.scenes || []).forEach(function(s) {
        if (s.safe && s.id !== G.currentScene) safeScenes.push(s);
      });
    });
    if (safeScenes.length === 0) return;
    var target = safeScenes[Math.floor(Math.random() * safeScenes.length)];
    
    // 传送到目标场景（纯观光）
    if (typeof moveToScene === 'function') {
      try { moveToScene(target.id); } catch(e) {}
    }
    p._lastSightseeDay = today;
    
    var scenes = [
      '🌄 你与霜华闲庭信步，来到「' + target.name + '」。' + (target.description || '）风物如画，令人心旷神怡。') + '霜华挽着你的手臂，目光温柔：「修行万载，如今才算真正地看这人间。」',
      '🏞️ 你们携手来到「' + target.name + '」，寻一处清净地坐下。她靠在你肩头，看云卷云舒：「当初冰封万载，错过太多风景。如今有你陪着，才算把这世界看遍。」',
      '🌸 午后，你们在「' + target.name + '」散步。霜华拈起一片落花，轻轻吹散：「凡尘万物，皆是道。当年我只知冰道，如今才知道——你在的地方，处处是道。」'
    ];
    if (typeof addNarrative === 'function') {
      addNarrative(scenes[Math.floor(Math.random() * scenes.length)], 'narr-epic');
    }
    // 看世界收益：心境+道心微涨
    p.mood = Math.min(100, (p.mood || 50) + 2);
    p.daoHeart = Math.min(200, (p.daoHeart || 50) + 1);
    if (typeof updateAllUI === 'function') updateAllUI();
  } catch(e) {}
}

window.canAscendTogether = canAscendTogether;
window.ascensionBtnHtml = ascensionBtnHtml;
window.startAscension = startAscension;
window.ascensionSceneAI = ascensionSceneAI;
window.ascensionFallbackScene = ascensionFallbackScene;
window.ascensionDailyHint = ascensionDailyHint;
window.ascendKidsDaily = ascendKidsDaily;
window.ascendWanderDaily = ascendWanderDaily;
window.ascendWorldSightsee = ascendWorldSightsee;
