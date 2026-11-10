// === 唯我独仙 · UI (人物选择 + 抽卡开局) ===

// ==========================
// 欢迎/人物选择界面
// ==========================
function showCharacterSelect() {
  const container = document.getElementById('welcome');
  
  // 🔧 防御：进入一部角色列表时清掉冰阁道统残留标记（防止误判后续创建为二部）
  window._sectLinePending = null;
  
  // 确保 G 初始状态
  if (!G) window.G = {};
  
  let savedChars = [];
  try {
    const charMeta = localStorage.getItem('weiwoduxian_char_meta');
    if (charMeta) savedChars = JSON.parse(charMeta);
  } catch(e) {}
  
  // 验证存档仍然存在，并且去重（相同 saveKey 只保留最新一条）
  const seenKeys = new Set();
  savedChars = savedChars.filter(c => {
    const exists = localStorage.getItem(c.saveKey);
    if (!exists) return false;
    if (seenKeys.has(c.saveKey)) return false; // 重复的只保留第一条
    seenKeys.add(c.saveKey);
    return true;
  });
  
  // 如果有重复被清理了，写回 localStorage（检查是否真的少了）
  const rawMeta = localStorage.getItem('weiwoduxian_char_meta');
  let oldLen = 0;
  if (rawMeta) { try { oldLen = JSON.parse(rawMeta).length; } catch(e) {} }
  if (savedChars.length !== oldLen) {
    localStorage.setItem('weiwoduxian_char_meta', JSON.stringify(savedChars));
  }
  
  // 修复：如果元数据为空但存在任何存档，自动重建元数据
  if (savedChars.length === 0) {
    // 扫描所有以 weiwoduxian_save_ 开头的存档
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('weiwoduxian_save_')) {
        try {
          const raw = localStorage.getItem(key);
          if (!raw) continue;
          const data = JSON.parse(raw);
          if (data && data.player) {
            const p = data.player;
            // 🔧 2026-08-04 修复：跳过二部（era2）角色误写入一部键的存档，
            //    避免二部角色污染一部列表
            if (p.era2) continue;
            savedChars.push({
              name: p.name || '无名',
              realm: '练气' + ((p.qiRealmIndex || 0) + 1) + '层',
              age: p.age || 0,
              maxAge: p.maxAge || 120,
              stones: p.stones || 0,
              roots: (p.spiritRoots || []).join('、'),
              lastActive: Date.now(),
              saveKey: key,
              isAlive: (p.age || 0) < (p.maxAge || 120),
              fortuneEmoji: '☯️',
            });
          }
        } catch(e) {}
      }
    }
    // 也检查旧版存档（兼容）
    const oldSaveRaw = localStorage.getItem('weiwoduxian_save');
    if (oldSaveRaw && !savedChars.some(c => c.saveKey === 'weiwoduxian_save')) {
      try {
        const data = JSON.parse(oldSaveRaw);
        if (data && data.player) {
          const p = data.player;
          savedChars.push({
            name: p.name || '夜如水',
            realm: '练气' + ((p.qiRealmIndex || 0) + 1) + '层',
            age: p.age || 0,
            maxAge: p.maxAge || 120,
            stones: p.stones || 0,
            roots: (p.spiritRoots || []).join('、'),
            lastActive: Date.now(),
            saveKey: 'weiwoduxian_save',
            isAlive: (p.age || 0) < (p.maxAge || 120),
            fortuneEmoji: '☯️',
          });
        }
      } catch(e) {}
    }
    if (savedChars.length > 0) {
      localStorage.setItem('weiwoduxian_char_meta', JSON.stringify(savedChars));
    }
  }
  
  // 重建元数据后还是没有存档 → 显示空列表 + 创建按钮（不再直接跳天命抽牌）
  // 🔧 2026-08-04 修复：无存档直接进天命让用户看不到入口列表，改为空状态引导
  if (savedChars.length === 0) {
    container.innerHTML = `
      <div class="welcome-box char-select-box">
        <h1 style="font-size:34px;margin-bottom:2px;">☯️</h1>
        <p class="welcome-sub" style="margin-bottom:8px;">— 第一纪元 · 散修崛起 —</p>
        <div style="margin:12px 0;"><b style="font-size:14px;">📜 已有修行者</b></div>
        <div style="padding:18px;color:var(--text-dim);font-size:12px;text-align:center;border:1px dashed rgba(255,255,255,0.15);border-radius:8px;margin-bottom:10px;">
          尚无修行者。<br>天命抽牌，五张命运之牌，择一而定道途。
        </div>
        <div style="margin-top:16px;display:flex;gap:12px;justify-content:center;flex-wrap:wrap;">
          <button onclick="showFortuneSelection()" class="btn-start" style="font-size:14px;padding:10px 20px;">🔥 创建新人物</button>
          <button onclick="showEraSelect()" style="background:transparent;color:var(--text);border:1px solid rgba(255,255,255,0.2);border-radius:6px;padding:8px 16px;font-size:12px;cursor:pointer;">← 返回纪元选择</button>
        </div>
      </div>
    `;
    return;
  }
  
  // 格式化最后登录时间
  const timeAgo = (ts) => {
    const mins = Math.floor((Date.now() - ts) / 60000);
    if (mins < 1) return '刚刚';
    if (mins < 60) return mins + '分钟前';
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return hrs + '小时前';
    const days = Math.floor(hrs / 24);
    return days + '天前';
  };
  
  let html = `
    <div class="welcome-box char-select-box">
      <h1 style="font-size:34px;margin-bottom:2px;">仙</h1>
      <p class="welcome-sub" style="margin-bottom:8px;">— 人物选择 —</p>
      <div style="margin:12px 0;">
        <b style="font-size:14px;">📜 已有修行者</b>
      </div>
  `;
  
  savedChars.forEach((c, i) => {
    const fortuneIcon = c.fortuneEmoji || '☯️';
    const statusColor = c.isAlive ? 'var(--accent)' : 'var(--danger)';
    const statusText = c.isAlive ? '🟢 在世' : '💀 已陨';
    html += `
      <div class="char-card" onclick="loadCharacterSave('${c.saveKey}')" style="cursor:pointer;">
        <div class="char-card-header">
          <span>${fortuneIcon} <b>${c.name}</b></span>
          <span style="font-size:12px;color:${statusColor}">${statusText}</span>
        </div>
        <div class="char-card-body">
          <span>${c.realm}</span>
          <span>🕐 ${timeAgo(c.lastActive)}</span>
        </div>
        <div class="char-card-desc">
          灵根${c.roots || '?'} · 灵石${c.stones || 0} · 寿元${Math.floor(c.age||0)}/${c.maxAge||'?'}年
        </div>
      </div>
    `;
  });
  
  html += `
      <div style="margin-top:16px;display:flex;gap:12px;justify-content:center;flex-wrap:wrap;">
        <button onclick="showFortuneSelection()" class="btn-start" style="font-size:14px;padding:10px 20px;">🔥 创建新人物</button>
        <button onclick="showEra2CharacterSelect()" style="font-size:13px;padding:10px 18px;border:1px solid rgba(140,202,230,0.35);background:rgba(40,80,120,0.1);color:#8ecae6;border-radius:6px;cursor:pointer;">❄️ 冰阁传承（第二纪元）</button>
        <button onclick="if(confirm('确定删除所有存档？这将清空所有角色数据。')){clearAllSaves();}" style="background:var(--danger);color:#fff;border:none;border-radius:6px;padding:8px 16px;font-size:12px;cursor:pointer;">🗑️ 清除所有存档</button>
      </div>
    </div>
  `;
  
  container.innerHTML = html;
}

// 从选择屏幕加载存档
function loadCharacterSave(saveKey) {
  try {
    const raw = localStorage.getItem(saveKey);
    if (!raw) { alert('存档已失效'); showCharacterSelect(); return; }
    const data = JSON.parse(raw);
    
    if (data.player) {
      // 深拷贝重建 player 对象，避免旧 null 引用
      const p = JSON.parse(JSON.stringify(data.player));
      p.isAlive = p.isAlive !== undefined ? p.isAlive : true;
      if (!p.eventHistory) p.eventHistory = [];
      if (!p.skills) p.skills = [];
      if (!p.inventory) p.inventory = [];
      G.player = p;
      
      // 试炼塔状态修复：如果存档里卡在战斗中，强制清理
      if (G.player._towerState) {
        if (G.player._towerState._inTowerBattle) {
          G.player._towerState._inTowerBattle = false;
          G.player._towerState._climbing = false;
        }
        G.player._inTowerCombat = false;
        G.player._towerFloor = null;
      }
      
      // 道心初始化（旧存档兼容）
      if (p.daoHeart === undefined) p.daoHeart = 50;
      if (!p._metSages) p._metSages = [];
      if (!p._sageDialogHistory) p._sageDialogHistory = [];
      // 冰封仙子状态初始化（旧存档兼容）——总是执行，补齐缺失字段
      if (typeof initIceFairy === 'function') initIceFairy();
      // 刷新寿元（旧存档修复）
      if (typeof getMaxAgeForRealm === 'function') {
        const ageFromRealm = getMaxAgeForRealm(p.qiRealmIndex || 0, p.bodyRealmIndex || 0);
        if (ageFromRealm > (p.maxAge || 0)) p.maxAge = ageFromRealm;
      }
      // 加载其他存档玩家的NPC
      if (typeof loadPlayerNPCsIntoManager === 'function') loadPlayerNPCsIntoManager();
      // 标记其他角色离线，当前角色上线
      try {
        var _raw2 = localStorage.getItem('weiwoduxian_player_npcs');
        if (_raw2) {
          var _all2 = JSON.parse(_raw2);
          _all2.forEach(function(_n){ _n.online = false; });
          localStorage.setItem('weiwoduxian_player_npcs', JSON.stringify(_all2));
        }
      } catch(e) {}
      // 装备槽迁移（旧存档只有武器位→新四部位）
      if (p.equipment) {
        if (!p.equipment.armor && !p.equipment.accessory && !p.equipment.head) {
          p.equipment.armor = null;
          p.equipment.accessory = null;
          p.equipment.head = null;
        }
      }
      // 🔮 本命法宝初始化（旧存档兼容：金丹期自动解锁）
      if (typeof initBenming === 'function') {
        initBenming();
        if (p.qiRealmIndex >= 12 && p.benming && !p.benming.unlocked) unlockBenming();
      }
      // 📋 境界引导任务补发（旧存档兼容：已满足 triggerRealm 的 realmBreak 任务自动补接）
      if (typeof checkRealmQuestTriggers === 'function') {
        try { checkRealmQuestTriggers(-1, p.qiRealmIndex || 0); } catch(e) {}
      }
      // 一次性启动资金补贴（微薄盘缠）
      if (!G.player._startGrant) {
        G.player.stones = (G.player.stones || 0) + 500;
        G.player._startGrant = true;
      }
      // 注册当前角色为在线NPC
      if (typeof registerCurrentPlayerAsNPC === 'function') registerCurrentPlayerAsNPC();
    }
    if (data.skillData) G.skillData = data.skillData;
    if (data.itemData) {
      // 🔧 2026-08-03 修复：旧档 itemData 可能是早期版本（无宝石等新物品定义）
      //    合并补全——保留存档数据，把 ITEM_DB 里缺失的 id 补进来，不覆盖
      var savedMap = {};
      (data.itemData || []).forEach(function(d) { if (d && d.id) savedMap[d.id] = d; });
      var merged = (data.itemData || []).slice();
      (typeof ITEM_DB !== 'undefined' ? ITEM_DB : []).forEach(function(d) {
        if (d && d.id && !savedMap[d.id]) merged.push(d);
      });
      G.itemData = merged;
    }
    // 🔧 自创功法恢复 + 数值补强（旧存档兼容：练气期自创的功法到高境界自动补强数值，品质保留）
    if (typeof restoreCustomSkills === 'function') {
      try { restoreCustomSkills(G.player); } catch(e) {}
    }
    if (typeof boostCustomSkillEffects === 'function') {
      try { const n = boostCustomSkillEffects(G.player); if (n > 0) addNarrative('✨ 你的' + n + '门自创功法随境界精进，威力大增！', 'event'); } catch(e) {}
    }
    // 🔧 skillData 永远用当前版本（与 worldData 同策略）：存档旧数组合并进 SKILL_DB（自创等），再让 G.skillData 引用同一数组
    try {
      if (typeof SKILL_DB !== 'undefined') {
        (G.skillData || []).forEach(sd => {
          if (sd && sd.id && !SKILL_DB.find(x => x.id === sd.id)) SKILL_DB.push(sd);
        });
        G.skillData = SKILL_DB;
      }
    } catch(e) {}
    // 🔧 skillData 永远用当前版本（与 worldData 同策略）：存档旧数组合并进 SKILL_DB（自创等），再让 G.skillData 引用同一数组
    try {
      if (typeof SKILL_DB !== 'undefined') {
        (G.skillData || []).forEach(sd => {
          if (sd && sd.id && !SKILL_DB.find(x => x.id === sd.id)) SKILL_DB.push(sd);
        });
        G.skillData = SKILL_DB;
      }
    } catch(e) {}
    // worldData always use current version (overrides old region format)
    if (typeof WORLD_DATA !== 'undefined' && WORLD_DATA.layers) {
      G.worldData = WORLD_DATA;
    }
    if (data.eventData) G.eventData = data.eventData;
    if (data.worldEvents) { G._worldEvents = data.worldEvents; } else { G._worldEvents = []; }
    if (data.currentScene) G.currentScene = data.currentScene;
    if (data.turn) G.turn = data.turn;
    if (data.time && G.time) Object.assign(G.time, data.time);
    if (data.narrativeHistory) G.narrativeHistory = data.narrativeHistory;
    
    // 安全合并 eventHistory（同时检查顶层和 player 内）
    const evSrc = data.eventHistory || (data.player && data.player.eventHistory);
    if (evSrc && G.player) {
      if (!G.player.eventHistory) G.player.eventHistory = [];
      for (const ev of evSrc) {
        if (!G.player.eventHistory.includes(ev)) G.player.eventHistory.push(ev);
      }
    }
    
    if (data.dailyLog) G.dailyLog = data.dailyLog;
    if (data.lifeChronicle) G.lifeChronicle = data.lifeChronicle;
    
    // 背包去重合并
    if (typeof mergeInventoryItems === 'function') mergeInventoryItems(G.player);
    
    // 重算属性确保数值正确
    if (typeof recalcStats === 'function') recalcStats(G.player);
    
    document.getElementById('welcome').classList.add('hidden');
    document.getElementById('app').classList.remove('hidden');
    
    // 为当前场景生成NPC
    const curScene = getSceneData(G.currentScene);
    if (typeof npcManager !== 'undefined' && npcManager && curScene) {
      npcManager.ensureNPCsForScene(G.currentScene, curScene);
    }
    
    updateSceneDisplay();
    updateAllUI();
    addNarrative('🌄 欢迎回来，' + G.player.name + '。世界已经过去很久了……', 'system');
    
    // 启动世界模拟器
    if (typeof initWorldSimulator === 'function') setTimeout(initWorldSimulator, 500);
    if (typeof updateLastActiveTimestamp === 'function') updateLastActiveTimestamp();
    if (typeof initTimeSystem === 'function') setTimeout(initTimeSystem, 300);
    // 🔧 2026-08-04：记录当前角色 saveKey（刷新后直接恢复）
    try { localStorage.setItem('weiwoduxian_last_save_key', saveKey); } catch(e) {}
    
    // ── 不再自动启动自动模式：进游戏先手动操作（看任务/地图），点 🤖 自动 才挂机 ──
  } catch(e) {
    console.error('读取存档失败:', e);
    alert('读取存档失败: ' + e.message);
    showCharacterSelect();
  }
}

// 保存人物元信息
function getCharacterSaveKey() {
  const name = G.player ? (G.player.name || '主角') : '主角';
  // 🔧 第二纪元：冰阁传承用独立存档前缀（与第一纪元完全隔离）
  if (G.player && G.player.era2) return 'weiwoduxian_save2_' + name;
  return 'weiwoduxian_save_' + name;
}

function saveCharacterMeta() {
  try {
    const p = G.player;
    if (!p) return;
    // 🔧 第二纪元：冰阁传承角色写独立元数据列表
    if (p.era2) {
      if (typeof saveEra2Meta === 'function') saveEra2Meta();
      return;
    }
    const saveKey = getCharacterSaveKey();
    const meta = {
      name: p.name,
      realm: getRealmLabel(),
      age: p.age,
      maxAge: p.maxAge,
      stones: p.stones,
      roots: (p.spiritRoots || []).join('、'),
      lastActive: Date.now(),
      saveKey: saveKey,
      isAlive: p.age < p.maxAge,
      fortuneEmoji: '☯️',
    };
    
    let savedChars = [];
    const existing = localStorage.getItem('weiwoduxian_char_meta');
    if (existing) { savedChars = JSON.parse(existing); }
    
    // 去重：移除同 saveKey 的旧记录，然后追加新记录
    savedChars = savedChars.filter(c => c.saveKey !== saveKey);
    savedChars.push(meta);
    
    localStorage.setItem('weiwoduxian_char_meta', JSON.stringify(savedChars));
  } catch(e) {}
}

// ==========================
// 抽卡开局
// ==========================
let _currentFortunes = []; // 当前展示的五张牌

function clearAllSaves() {
  try {
    var keys = Object.keys(localStorage);
    keys.forEach(function(k){
      if (k.indexOf('weiwoduxian') === 0) localStorage.removeItem(k);
    });
    showCharacterSelect();
  } catch(e) {
    alert('清除失败：' + e.message);
  }
}

function showFortuneSelection() {
  _currentFortunes = [];
  document.getElementById('welcome').innerHTML = '';
  const container = document.getElementById('welcome');
  // ❄️ 第二纪元：冰阁择徒风格（选过道统 → 正在拜师考核中）
  const isSectRecruit = !!window._sectLinePending;
  container.innerHTML = `
    <div class="fortune-select">
      <div class="fortune-header">
        <h1 style="font-size:28px;margin-bottom:2px;">${isSectRecruit ? '❄️' : '仙'}</h1>
        <p class="fortune-sub" style="font-size:12px;color:${isSectRecruit ? '#8ecae6' : 'var(--text-dim)'};margin-bottom:8px;">${isSectRecruit ? '— 冰阁择徒 · 天命鉴人 —' : '— 天命开局 —'}</p>
        <h2 style="font-size:20px;margin:6px 0;">${isSectRecruit ? '🧿 命 格 鉴 定' : '☯️ 天 命 选 择'}</h2>
        <p class="fortune-sub">${isSectRecruit ? '抽一张天命牌，冰阁将依此鉴定你的资质。' : '从五张天命牌中，选择你的命运'}</p>
      </div>
      <div id="fortune-cards" class="fortune-cards"></div>
    </div>
  `;

  const cardsContainer = document.getElementById('fortune-cards');
  for (let i = 0; i < 5; i++) {
    _currentFortunes.push(generateFortuneCard(i));
  }

  const cardsHtml = _currentFortunes.map((f, i) => {
    const fort = f.fortune;
    const qiMultEmoji = f.startSkill?.effects?.cultivationSpeed ? `🧘×${f.startSkill.effects.cultivationSpeed}` : '';
    return `
    <div class="fortune-card" id="fcard-${i}" onclick="selectFortune(${i})" style="--card-color:${fort.color}">
      <div class="fc-badge">${fort.name}</div>
      <div class="fc-roots">${f.roots.map(r => {
        const rt = ROOT_TYPES[r] || {};
        return `<span class="fc-root" style="color:${rt.color}">${rt.emoji || ''}${r}</span>`;
      }).join(' ')}</div>
      <div class="fc-stats">
        <div class="fc-stat"><span class="fc-stat-icon">☯️</span><span>气运 ${f.luck}</span></div>
        <div class="fc-stat"><span class="fc-stat-icon">🧠</span><span>悟性 ${f.wisdom}</span></div>
        <div class="fc-stat"><span class="fc-stat-icon">🦴</span><span>根骨 ${f.bone}</span></div>
      </div>
      <div class="fc-destiny">${fort.desc}</div>
      <div class="fc-start">
        <span>🏅 ${f.startSkill.name}${qiMultEmoji ? ' ' + qiMultEmoji : ''}</span>
        <span>💰 ${f.stones}灵石</span>
      </div>
      <div class="fc-flip">点击选择此命</div>
    </div>`;
  }).join('');

  cardsContainer.innerHTML = cardsHtml + `
    <div class="fortune-repick">
      <button onclick="generateAllFortunes()" class="btn-repick">🔄 重抽天机</button>
    </div>
  `;
}

// 暂存被选中的
let selectedFortune = null;

function selectFortune(idx) {
  selectedFortune = _currentFortunes[idx];
  showCharacterCreationPage();
}

function showCharacterCreationPage() {
  if (!selectedFortune) return;
  
  const origins = typeof CHARACTER_ORIGINS !== 'undefined' ? CHARACTER_ORIGINS : [];
  const fort = selectedFortune;
  
  const rootColors = (fort.roots || []).map(r => {
    const rt = ROOT_TYPES[r] || {};
    return `<span style="color:${rt.color}">${rt.emoji || ''}${r}</span>`;
  }).join(' ');
  
  const originOptions = origins.map((o, i) => `
    <div class="co-origin" data-id="${o.id}" style="cursor:pointer;padding:8px;border:1px solid rgba(255,255,255,0.1);border-radius:6px;font-size:11px;${i === 0 ? 'border-color:var(--accent);background:rgba(201,169,110,0.1);' : ''}">
      <div style="font-weight:bold;margin-bottom:2px;">${o.emoji} ${o.name}</div>
      <div style="color:var(--text-dim);font-size:10px;line-height:1.4;">${o.desc}</div>
    </div>
  `).join('');
  
  document.getElementById('welcome').innerHTML = `
    <div class="fortune-select">
      <div class="fortune-header">
        <h1>☯️ 塑 造 人 物</h1>
      </div>
      
      <div style="max-width:480px;margin:0 auto;">
        <div style="margin-bottom:14px;padding:10px;background:rgba(201,169,110,0.06);border-radius:6px;font-size:12px;text-align:center;line-height:1.6;">
          ✦ 命格「${fort.fortune.name}」<br>
          灵根 ${rootColors} · 气运${fort.luck} 悟性${fort.wisdom} 根骨${fort.bone}
        </div>

        <div style="margin-bottom:14px;">
          <label style="font-size:12px;color:var(--text-dim);display:block;margin-bottom:4px;">道号</label>
          <input type="text" id="ci-name" placeholder="输入你的道号..." maxlength="8"
            style="width:100%;padding:10px;border:1px solid rgba(255,255,255,0.15);border-radius:6px;background:rgba(0,0,0,0.3);color:var(--text);font-size:16px;box-sizing:border-box;outline:none;" />
        </div>

        <div style="margin-bottom:14px;">
          <label style="font-size:12px;color:var(--text-dim);display:block;margin-bottom:4px;">性别</label>
          <div style="display:flex;gap:10px;">
            <div class="ci-gender ci-gender-active" onclick="pickGender(this,'男')" style="flex:1;text-align:center;padding:8px;border:1px solid var(--accent);border-radius:6px;cursor:pointer;background:rgba(201,169,110,0.12);font-size:14px;">👤 男</div>
            <div class="ci-gender" onclick="pickGender(this,'女')" style="flex:1;text-align:center;padding:8px;border:1px solid rgba(255,255,255,0.15);border-radius:6px;cursor:pointer;font-size:14px;">👩 女</div>
          </div>
        </div>

        <div style="margin-bottom:14px;">
          <label style="font-size:12px;color:var(--text-dim);display:block;margin-bottom:4px;">出身</label>
          <div id="ci-origins" style="display:grid;grid-template-columns:1fr 1fr;gap:6px;">
            ${originOptions}
          </div>
        </div>

        <div style="display:flex;gap:10px;margin-top:18px;">
          <button onclick="showFortuneSelection()" style="flex:1;padding:10px;border:1px solid rgba(255,255,255,0.2);border-radius:6px;background:transparent;color:var(--text);cursor:pointer;font-size:13px;">🔄 重新翻牌</button>
          <button onclick="confirmCharacter()" style="flex:2;padding:10px;background:${window._sectLinePending ? 'linear-gradient(135deg,#6a9ec9,#8ecae6)' : 'var(--accent)'};color:#000;border:none;border-radius:6px;cursor:pointer;font-weight:bold;font-size:14px;">${window._sectLinePending ? '❄️ 拜入冰阁 · 参加考核' : '⛰️ 踏入修仙界'}</button>
        </div>
      </div>
    </div>
  `;
  
  // 绑定出身点击事件
  document.getElementById('ci-origins').addEventListener('click', function(e) {
    const originEl = e.target.closest('.co-origin');
    if (!originEl) return;
    this.querySelectorAll('.co-origin').forEach(el => {
      el.style.borderColor = 'rgba(255,255,255,0.1)';
      el.style.background = 'transparent';
    });
    originEl.style.borderColor = 'var(--accent)';
    originEl.style.background = 'rgba(201,169,110,0.1)';
    window._selOrigin = originEl.dataset.id;
  });
  
  window._selGender = '男';
  window._selOrigin = origins.length > 0 ? origins[0].id : 'shijia';
  
  setTimeout(() => {
    const inp = document.getElementById('ci-name');
    if (inp) inp.focus();
  }, 200);
}

function pickGender(el, gender) {
  document.querySelectorAll('.ci-gender').forEach(g => {
    g.classList.remove('ci-gender-active');
    g.style.borderColor = 'rgba(255,255,255,0.15)';
    g.style.background = 'transparent';
  });
  el.classList.add('ci-gender-active');
  el.style.borderColor = 'var(--accent)';
  el.style.background = 'rgba(201,169,110,0.12)';
  window._selGender = gender;
}

function generateAllFortunes() {
  selectedFortune = null;
  _currentFortunes = [];
  showFortuneSelection();
}

function confirmCharacter() {
  // 🔧 第二纪元：冰阁传承创角（选过道统 → 走独立流程）
  if (window._sectLinePending) {
    createEra2Character();
    return;
  }
  // 🔧 防御：即使没有走冰阁流程，也确保标记是干净的（防止历史残留污染后续创建）
  window._sectLinePending = null;
  if (!selectedFortune) {
    alert('请先选择天命牌！');
    return;
  }
  const name = document.getElementById('ci-name').value.trim() || '夜如水';
  const gender = window._selGender || '男';
  const origin = window._selOrigin || 'shijia';
  
  // Create player with depth
  G.player = createPlayerFromFortune(selectedFortune, name, { gender, origin });
  // 启动资金（微薄盘缠，靠自己打拼）
  if (!G.player._startGrant) {
    G.player.stones = (G.player.stones || 0) + 500;
    G.player._startGrant = true;
  }
  G.skillData = SKILL_DB;
  G.itemData = ITEM_DB;
  G.worldData = typeof WORLD_DATA !== 'undefined' ? WORLD_DATA : null;
  G.eventData = typeof EVENT_TEMPLATES !== 'undefined' ? EVENT_TEMPLATES : null;
  if (typeof initWorldEvents === 'function') initWorldEvents();
  
  // Enter game
  document.getElementById('welcome').classList.add('hidden');
  document.getElementById('app').classList.remove('hidden');
  G.currentScene = 'qingyun';
  advanceTime(4);
  
  // 🗺️ 灵根决定出生地：属性相近的地域优先出生
  var pRoots = G.player.spiritRoots || [];
  var primaryRoot = pRoots.length > 0 ? pRoots[0] : null;
  
  // 各属性对应的出生场景
  var elementSceneMap = {
    '水': {
      id:'bibo_lake',
      desc:'你是被湖水拍醒的。睁开眼，一望无际的碧波在阳光下闪烁——水灵根的你，天生与水亲和，这片湖水仿佛在轻声呼唤着你。远处白鹭翩飞，湖心偶尔泛起一圈圈灵力的涟漪。',
    },
    '木': {
      id:'lingyao_garden',
      desc:'你是被药香熏醒的。推开一扇半掩的木门，漫山遍野的灵药在晨露中泛着微光——木灵根的你，能感受到每一株草木的呼吸、每一片叶子的生机。这似乎是一座被遗忘了许久的药园，草木的灵气正向你涌来。',
    },
    '土': {
      id:'qingyun',
      desc:'你是在一声悠长的晨钟里睁开眼的。远处青云镇的轮廓在晨雾中若隐若现，檐角的铜铃在风中轻轻摇响。你感到大地沉稳的脉动从脚下传来——土灵根的你对这片土地有一种天然的亲近感，仿佛每一粒尘土都在低语欢迎你。',
    },
  };
  
  // 金/火/无灵根/体修 → 随机池
  var fallbackScenes = [
    { id:'qingyun', desc:'你缓缓睁开眼，发现自己躺在一棵古松之下。远处的青云镇炊烟袅袅，你的修仙之路，从此开始。' },
    { id:'bibo_lake', desc:'你是被湖水拍醒的。睁开眼，一望无际的碧波在阳光下闪烁，远处白鹭翩飞。你发现自己躺在湖畔的草地上。' },
    { id:'lingyun_peak', desc:'山风将你唤醒。你坐起身来，发现自己身处一座云雾缭绕的山峰之巅，四周灵草遍地，宛如仙境。' },
    { id:'lingyao_garden', desc:'你是被药香熏醒的。推开一扇半掩的木门，漫山遍野的灵药在晨露中泛着微光——这似乎是一座被遗忘了许久的药园。' },
  ];
  
  // 火灵根 → 配火系叙事
  var fireScene = {
    id:'qingyun', desc:'你在晨曦中醒来，朝阳如火，天边一片赤红。你感到体内火灵根微微共鸣——你是天生亲近火焰的人，这一路注定走得炽烈。远方青云镇的烟囱里飘出缕缕炊烟，人间烟火气，正合你这修火之人。'
  };
  // 金属性 → 金系叙事
  var metalScene = {
    id:'qingyun', desc:'晨光穿过树梢洒在你脸上，你睁眼时感到一阵锐气在经脉中流动——你的金灵根在晨曦中觉醒。你握了握拳，指尖有细碎的金芒流转。远处的青云镇传来铁匠铺里叮叮当当的锤打声，听起来格外亲切。'
  };
  
  // 体修判断：出生送的功法是炼体术 + 杂灵根（3条以上）→ 体修倾向
  var isBodyCultivator = false;
  if (primaryRoot && pRoots.length >= 3) {
    var startSkillData = typeof SKILL_DB !== 'undefined'
      ? SKILL_DB.find(function(s){ return s.id === (G.player.skills && G.player.skills[0] && G.player.skills[0].id); })
      : null;
    if (startSkillData && startSkillData.type === '炼体术') isBodyCultivator = true;
  }
  
  var chosenStart = null;
  
  if (isBodyCultivator) {
    // 体修→随机出生，哪都行
    chosenStart = fallbackScenes[Math.floor(Math.random() * fallbackScenes.length)];
    addNarrative('你天生神骨，不拘于五行之气，天地之间何处不可去。', 'narr-event');
  } else if (primaryRoot === '火') {
    chosenStart = fireScene;
  } else if (primaryRoot === '金') {
    chosenStart = metalScene;
  } else if (primaryRoot && elementSceneMap[primaryRoot]) {
    chosenStart = elementSceneMap[primaryRoot];
  }
  
  if (!chosenStart) {
    chosenStart = fallbackScenes[Math.floor(Math.random() * fallbackScenes.length)];
  }
  
  G.currentScene = chosenStart.id;
  advanceTime(4);
  
  // 为出生地生成NPC
  var startScene = getSceneData(G.currentScene);
  if (typeof npcManager !== 'undefined' && npcManager && startScene) {
    npcManager.ensureNPCsForScene(G.currentScene, startScene);
  }
  // 👴 引路人沈伯：无论出生何处都来见你
  if (typeof ensureMentor === 'function') {
    try { ensureMentor(G.currentScene); } catch(e) {}
  }
  
  updateSceneDisplay();
  updateAllUI();
  addNarrative(chosenStart.desc, 'default');
  addNarrative(`你看了看手中的${selectedFortune.fortune.name}，命运之轮已然转动。`, 'default');
  
  // 将之前所有存档角色的在线标记清除（他们变成游历的NPC）
  // 把当前新号设为在线
  if (typeof registerCurrentPlayerAsNPC === 'function') {
    // 先标记其他所有角色为离线
    var _allOnline = [];
    try {
      var _raw = localStorage.getItem('weiwoduxian_player_npcs');
      if (_raw) _allOnline = JSON.parse(_raw);
      _allOnline.forEach(function(_n){ _n.online = false; });
      // 再把当前玩家设为 online（registerCurrentPlayerAsNPC 会追加）
      localStorage.setItem('weiwoduxian_player_npcs', JSON.stringify(_allOnline));
    } catch(e) {}
    registerCurrentPlayerAsNPC();
  }
  // 加载所有非在线旧角色 NPC
  if (typeof loadPlayerNPCsIntoManager === 'function') loadPlayerNPCsIntoManager();
  
  // 初始化修炼日志
  if (typeof initDailyLog === 'function') { G.dailyLog = []; initDailyLog(); }
  if (typeof G.lifeChronicle === 'undefined') G.lifeChronicle = [];
  
  // 初始化天命读取时的日志
  if (typeof addDailyLogEntry === 'function') addDailyLogEntry('event', '降临世间');
  
  // 立即保存存档（同步写入，防止刷新丢失）
  try {
    const saveKey = getCharacterSaveKey();
    const d = JSON.parse(JSON.stringify({
      player: G.player,
      skillData: G.skillData,
      itemData: G.itemData,
      worldData: G.worldData,
      eventData: G.eventData,
      currentScene: G.currentScene,
      turn: G.turn,
      time: G.time,
      narrativeHistory: (G.narrativeHistory||[]).slice(-50),
      eventHistory: G.player.eventHistory,
      dailyLog: G.dailyLog || [],
      lifeChronicle: (G.lifeChronicle || []).slice(-100),
    }));
    localStorage.setItem(saveKey, JSON.stringify(d));
  } catch(e) {}
  // 保存人物元信息
  if (typeof saveCharacterMeta === 'function') saveCharacterMeta();
  
  // 启动世界模拟器
  if (typeof initWorldSimulator === 'function') setTimeout(initWorldSimulator, 500);
  if (typeof updateLastActiveTimestamp === 'function') updateLastActiveTimestamp();
  // 启动时辰系统
  if (typeof initTimeSystem === 'function') setTimeout(initTimeSystem, 300);
  
  // 👴 引路人沈伯：初次指引（出生后稍等片刻出现）
  setTimeout(() => {
    try {
      if (typeof ensureMentor === 'function') ensureMentor(G.currentScene);
      if (typeof addNarrative === 'function' && typeof getMentorAdvice === 'function') {
        const advice = getMentorAdvice();
        if (advice && advice.length > 0) {
          const sceneName = (typeof getSceneData === 'function' && getSceneData(G.currentScene)) ? getSceneData(G.currentScene).name : '此处';
          addNarrative(`<div style="border:1px solid rgba(120,180,100,0.4);border-radius:10px;padding:12px;margin:8px 0;background:rgba(40,80,30,0.12);">
            <div style="font-weight:bold;color:#7dce9a;font-size:12px;">👴 一个头发花白的老农，在${sceneName}叫住了你</div>
            <div style="font-size:11px;color:var(--text);margin-top:5px;line-height:1.8;">「这位${G.player.gender === '男' ? '小哥' : '姑娘'}，面生得很。老朽沈伯，种了一辈子药。修仙这条路啊，最怕没人指点——你若不嫌弃，随时来找老朽，我知无不言。」</div>
            <div style="font-size:10px;color:#e8c88a;margin-top:4px;">💡 找到「沈伯」交谈，选择「📜 请教修行之道」，他会根据你的进度给出指点</div>
          </div>`, 'narr-event');
        }
      }
    } catch(e) {}
  }, 1500);
  
  // ── 不再自动启动自动模式：新角色先进游戏看引导/任务，点 🤖 自动 才挂机 ──
}

// ==========================
// 主加载
// ==========================
function loadSave() {
  try {
    const saveKey = getCharacterSaveKey();
    const raw = localStorage.getItem(saveKey);
    if (!raw) { alert('未找到前世存档'); return; }
    const data = JSON.parse(raw);
    
    // 深拷贝重建 player，避免 Object.assign(null) 崩溃
    if (data.player) {
      const p = JSON.parse(JSON.stringify(data.player));
      p.isAlive = p.isAlive !== undefined ? p.isAlive : true;
      if (!p.eventHistory) p.eventHistory = [];
      if (!p.skills) p.skills = [];
      if (!p.inventory) p.inventory = [];
      // 🔧 引魂青灯旧档修复：圣品4星却无属性的青灯自动补上属性（2026-08-03）
      if (p.inventory && p.inventory.length) {
        const qingdengDef = (typeof ITEM_DB !== 'undefined' ? ITEM_DB : []).find(i => i.id === 'qingdeng');
        if (qingdengDef) {
          p.inventory.forEach(function(it) {
            if (it && (it.id === 'qingdeng' || (it._baseId === 'qingdeng')) && (!it.equipEffect || Object.keys(it.equipEffect).length === 0)) {
              it.equipEffect = Object.assign({}, qingdengDef.equipEffect || {});
              if (!it.desc || it.desc.indexOf('引魂入体') === -1) it.desc = qingdengDef.desc;
            }
          });
          if (p.equipment && p.equipment.weapon && p.equipment.weapon.id === 'qingdeng' && (!p.equipment.weapon.effects || Object.keys(p.equipment.weapon.effects).length === 0)) {
            p.equipment.weapon.effects = Object.assign({}, qingdengDef.equipEffect || {});
          }
        }
        // 🔧 宝石旧档修复（2026-08-03）：早期背包条目可能缺 type:'宝石' 字段 → 点不中
        //    从 ITEM_DB 补全 type/category，让宝石能独立分类并点击镶嵌
        p.inventory.forEach(function(it) {
          if (!it || !it.id) return;
          const gemDef = (typeof ITEM_DB !== 'undefined' ? ITEM_DB : []).find(function(d) { return d.id === it.id && d.type === '宝石'; });
          if (gemDef) {
            if (it.type !== '宝石') it.type = '宝石';
            if (it.category !== gemDef.category) it.category = gemDef.category;
            if (!it.gemEffect) it.gemEffect = gemDef.gemEffect || null;
            if (!it.gemName) it.gemName = gemDef.gemName || it.name;
            // 🔧 2026-08-03：旧档宝石缺 qty → 补 1（否则点击判定 "qty > 0" 找不到）
            if (it.qty === undefined || it.qty === null) it.qty = 1;
          }
        });
      }
      G.player = p;
      // 🔧 饰品多件（2026-08-03）：旧档 accessory 单对象 → 转数组
      if (p.equipment && p.equipment.accessory && !Array.isArray(p.equipment.accessory)) {
        p.equipment.accessory = [p.equipment.accessory];
      } else if (p.equipment && !p.equipment.accessory) {
        p.equipment.accessory = [];
      }
      // 🔧 修为负值修复（2026-08-03）：自创功法/双修回退曾把修为扣到境界需求以下（显示负值）
      //    读档时自动补回：修为点至少等于当前境界 cpRequired
      if (typeof QI_REALMS !== 'undefined' && QI_REALMS[p.qiRealmIndex]) {
        const qiReq = QI_REALMS[p.qiRealmIndex].cpRequired;
        if ((p.qiCultivationPoints || 0) < qiReq) {
          p.qiCultivationPoints = qiReq;
          if (typeof addNarrative === 'function') addNarrative('🔧 检测到修为异常，已为你稳固根基（修为恢复至当前境界）。', 'system');
        }
      }
      if (typeof BODY_REALMS !== 'undefined' && BODY_REALMS[p.bodyRealmIndex]) {
        const bodyReq = BODY_REALMS[p.bodyRealmIndex].cpRequired;
        if ((p.bodyCultivationPoints || 0) < bodyReq) {
          p.bodyCultivationPoints = bodyReq;
        }
      }
      // 初始化世界事件
      if (typeof initWorldEvents === 'function') initWorldEvents();
      // 刷新寿元（旧存档修复：读到高境界但maxAge没更新的人）
      if (typeof getMaxAgeForRealm === 'function') {
        const ageFromRealm = getMaxAgeForRealm(p.qiRealmIndex || 0, p.bodyRealmIndex || 0);
        if (ageFromRealm > (p.maxAge || 0)) p.maxAge = ageFromRealm;
      }
      // 一次性启动资金补贴（读档/新建都生效）
      if (!G.player._startGrant) {
        G.player.stones = (G.player.stones || 0) + 500;
        G.player._startGrant = true;
      }
    }
    
    if (data.skillData) G.skillData = data.skillData;
    if (data.itemData) {
      // 🔧 2026-08-03 修复：旧档 itemData 可能是早期版本（无宝石等新物品定义）
      //    合并补全——保留存档数据，把 ITEM_DB 里缺失的 id 补进来，不覆盖
      var savedMap = {};
      (data.itemData || []).forEach(function(d) { if (d && d.id) savedMap[d.id] = d; });
      var merged = (data.itemData || []).slice();
      (typeof ITEM_DB !== 'undefined' ? ITEM_DB : []).forEach(function(d) {
        if (d && d.id && !savedMap[d.id]) merged.push(d);
      });
      G.itemData = merged;
    }
    // 🔧 自创功法恢复 + 数值补强（旧存档兼容）
    if (typeof restoreCustomSkills === 'function') {
      try { restoreCustomSkills(G.player); } catch(e) {}
    }
    if (typeof boostCustomSkillEffects === 'function') {
      try { const n = boostCustomSkillEffects(G.player); if (n > 0) addNarrative('✨ 你的' + n + '门自创功法随境界精进，威力大增！', 'event'); } catch(e) {}
    }
    
    // worldData always use current version (overrides old region format)
    if (typeof WORLD_DATA !== 'undefined' && WORLD_DATA.layers) {
      G.worldData = WORLD_DATA;
    }
    
    if (data.eventData) G.eventData = data.eventData;
    if (data.worldEvents) { G._worldEvents = data.worldEvents; } else { G._worldEvents = []; }
    if (typeof initWorldEvents === 'function') initWorldEvents();
    if (data.currentScene) G.currentScene = data.currentScene;
    if (data.turn) G.turn = data.turn;
    if (data.time && G.time) Object.assign(G.time, data.time);
    if (data.narrativeHistory) G.narrativeHistory = data.narrativeHistory;
    
    // 安全合并 eventHistory
    const evSrc = data.eventHistory || (data.player && data.player.eventHistory);
    if (evSrc && G.player) {
      if (!G.player.eventHistory) G.player.eventHistory = [];
      for (const ev of evSrc) {
        if (!G.player.eventHistory.includes(ev)) G.player.eventHistory.push(ev);
      }
    }
    
    // 兼容旧存档：skillSlots和mastery
    if (!G.player.skillSlots) {
      G.player.skillSlots = { tuna: null, lianti: null, gongfa: null, huti: null, shenfa: null, liaoshang: null, mishu: null, xinfa: null, zhendao: null, dandao: null };
    } else {
      // 补全新槽位
      if (G.player.skillSlots.zhendao === undefined) G.player.skillSlots.zhendao = null;
      if (G.player.skillSlots.dandao === undefined) G.player.skillSlots.dandao = null;
    }
    if (typeof ensureMasteryFields === 'function') ensureMasteryFields(G.player);

    // 🔮 本命法宝初始化（旧存档兼容：金丹期自动解锁）
    if (typeof initBenming === 'function') {
      initBenming();
      if (G.player.qiRealmIndex >= 12 && G.player.benming && !G.player.benming.unlocked) unlockBenming();
    }
    // 📋 境界引导任务补发（旧存档兼容：已满足 triggerRealm 的 realmBreak 任务自动补接）
    if (typeof checkRealmQuestTriggers === 'function') {
      try { checkRealmQuestTriggers(-1, G.player.qiRealmIndex || 0); } catch(e) {}
    }
    
    // 兼容旧存档：背包去重合并
    if (typeof mergeInventoryItems === 'function') mergeInventoryItems(G.player);
    
    document.getElementById('welcome').classList.add('hidden');
    document.getElementById('app').classList.remove('hidden');
    
    // 为当前场景生成NPC
    const curScene = getSceneData(G.currentScene);
    if (typeof npcManager !== 'undefined' && npcManager && curScene) {
      npcManager.ensureNPCsForScene(G.currentScene, curScene);
    }
    
    updateSceneDisplay();
    updateAllUI();
    // 📜 待领悟功法自动参悟（读档时也检查：境界早已达标但没再突破的情况）
    try { if (typeof autoLearnPendingScrolls === 'function') autoLearnPendingScrolls('读档'); } catch(e) {}
    addNarrative('前世记忆涌上心头……你的修仙之路，在此延续。', 'system');
    
    // 启动世界模拟器
    if (typeof initWorldSimulator === 'function') {
      setTimeout(initWorldSimulator, 500);
    }
    if (typeof updateLastActiveTimestamp === 'function') {
      updateLastActiveTimestamp();
    }
    if (typeof saveCharacterMeta === 'function') saveCharacterMeta();
    
    // ── 不再自动启动自动模式：进游戏先手动操作（看任务/地图），点 🤖 自动 才挂机 ──
    
    // ── 自动刷新浏览器版本缓存 ──
    const oldVer = localStorage.getItem('_game_version');
    if (oldVer !== '32') {
      localStorage.setItem('_game_version', '32');
    }
  } catch(e) { 
    console.error('读取存档失败:', e);
    alert('存档读取失败: ' + e.message); 
  }
}

function saveGame() {
  try {
    const saveKey = getCharacterSaveKey();
    const d = JSON.parse(JSON.stringify({
      player: G.player,
      skillData: G.skillData,
      itemData: G.itemData,
      worldData: G.worldData,
      eventData: G.eventData,
      worldEvents: G._worldEvents || [],
      currentScene: G.currentScene,
      turn: G.turn,
      time: G.time,
      narrativeHistory: G.narrativeHistory.slice(-100),
      eventHistory: (G.player.eventHistory || []).slice(-500), // 📦 裁剪防localStorage爆满
      dailyLog: G.dailyLog || [],
      lifeChronicle: (G.lifeChronicle || []).slice(-365),
    }));
    localStorage.setItem(saveKey, JSON.stringify(d));
    if (typeof updateLastActiveTimestamp === 'function') updateLastActiveTimestamp();
    saveCharacterMeta();
    addNarrative('💾 存档已保存。', 'system');
  } catch(e) { alert('保存失败'); }
}

function confirmQuitToTitle() {
  const overlay = document.getElementById('event-overlay');
  if (!overlay) return;
  overlay.classList.remove('hidden');
  document.getElementById('event-title').textContent = '🚪 退出到主界面';
  document.getElementById('event-body').innerHTML = `
    <p style="margin-bottom:12px;">回到主界面后，当前进度会自动保存。</p>
    <p style="font-size:12px;color:var(--text-dim);">确定要退出吗？</p>
  `;
  document.getElementById('event-choices').innerHTML = `
    <button class="event-choice-btn" onclick="quitToTitle()">✅ 确定退出</button>
    <button class="event-choice-btn" onclick="closeCustomModal()">🚶 取消</button>
  `;
}

function quitToTitle() {
  // 先存档
  saveGame();
  closeCustomModal();
  // 停止自动模式
  if (typeof stopAutoMode === 'function') stopAutoMode();
  // 🔧 2026-08-04：退出到主界面后清除自动恢复标记（刷新不再自动进游戏，
  //    回到人物选择页让用户自己选）
  try { localStorage.removeItem('weiwoduxian_last_save_key'); } catch(e) {}
  // 切回主界面
  document.getElementById('app').classList.add('hidden');
  document.getElementById('welcome').classList.remove('hidden');
  // 显示人物选择
  if (typeof showCharacterSelect === 'function') showCharacterSelect();
}

// ==========================
// UI 更新
// ==========================
function updateAllUI() {
  updateTopbar();
  updatePlayerCard();
  updateSkillList();
  updateInventory();
  updateActions();
  updateEquipPanel();
  updateSceneNPCs();
  updateBottomBar();
  // 探点面板刷新
  if (typeof renderScenePOIPanel === 'function') {
    renderScenePOIPanel('poi-panel');
  }
  if (typeof renderWorldEventPanel === 'function') {
    renderWorldEventPanel();
  }
}

function updateTopbar() {
  const p = G.player;
  if (!p) return;
  const cp = p.combatPower || 0;
  const rank = typeof getCombatPowerRank === 'function' ? getCombatPowerRank(cp) : '';
  document.getElementById('stat-realm').textContent = getRealmLabel();
  document.getElementById('stat-qi').textContent = `灵力: ${Math.round(p.qi)}/${p.maxQi}`;
  document.getElementById('stat-hp').textContent = `气血: ${Math.round(p.hp)}/${p.maxHp}`;
  document.getElementById('stat-age').textContent = `寿元: ${Math.floor(p.age)}/${p.maxAge}年`;
  var ageEl = document.getElementById('stat-age');
  ageEl.textContent = `寿元: ${Math.floor(p.age)}/${p.maxAge}年`;
  var lifeRatio = p.age / p.maxAge;
  ageEl.style.color = lifeRatio > 0.8 ? '#e74c3c' : (lifeRatio > 0.5 ? '#ff9800' : '');
  document.getElementById('stat-stones').textContent = `灵石: ${p.stones}`;
  const cpEl = document.getElementById('stat-cp');
  if (cpEl) cpEl.textContent = `战力: ${cp} (${rank})`;
  // 体修特长
  var perkEl = document.getElementById('stat-bodyperk');
  if (perkEl) perkEl.textContent = p._bodyPerk ? '💪 ' + p._bodyPerk : '';
  // 🌟 名声
  var fameEl = document.getElementById('stat-fame');
  if (fameEl) {
    if (typeof getFameLevel === 'function') {
      const fl = getFameLevel();
      fameEl.textContent = `🌟 ${fl.name}（${p.fame || 0}）`;
      fameEl.style.color = fl.color || '#e8c88a';
    } else {
      fameEl.textContent = '';
    }
  }
  // 🍂 季节 + 节日
  var seasonEl = document.getElementById('stat-season');
  if (seasonEl) {
    if (typeof getSeason === 'function') {
      const s = getSeason();
      const info = (typeof SEASON_INFO !== 'undefined' && SEASON_INFO[s]) ? SEASON_INFO[s] : { icon: '🍂', name: s, color: '#ccc' };
      let festTxt = '';
      if (typeof getTodayFestival === 'function') {
        const fest = getTodayFestival();
        if (fest) festTxt = ` · 🎊${fest.name}`;
      }
      seasonEl.textContent = `${info.icon} ${info.name}季${festTxt}`;
      seasonEl.style.color = info.color || '#ccc';
    }
  }
  // 📜 待领悟功法标记
  var pendEl = document.getElementById('stat-pending');
  if (pendEl) {
    const ps = p.pendingScrolls || [];
    if (ps.length > 0) {
      const psNames = ps.map(s => s.name || s.skillId).join('、');
      pendEl.textContent = `📜 待领悟：${psNames}（突破后自动参悟）`;
    } else {
      pendEl.textContent = '';
    }
  }
  // ── 顶栏迷你修炼进度条 ──
  try {
    const qiPct = Math.round(getCultivationProgress('qi'));
    const bodyPct = Math.round(getCultivationProgress('body'));
    const qf = document.getElementById('topbar-qi-fill');
    const bf = document.getElementById('topbar-body-fill');
    const qp = document.getElementById('topbar-qi-pct');
    const bp = document.getElementById('topbar-body-pct');
    if (qf) { qf.style.width = Math.min(100, qiPct) + '%'; qf.style.background = qiPct >= 100 ? 'linear-gradient(90deg,#f4c542,#ff9f43)' : 'linear-gradient(90deg,#6a9ec9,#e8c88a)'; }
    if (bf) { bf.style.width = Math.min(100, bodyPct) + '%'; bf.style.background = bodyPct >= 100 ? 'linear-gradient(90deg,#f4c542,#ff9f43)' : 'linear-gradient(90deg,#8a7a5a,#c9a96e)'; }
    if (qp) qp.textContent = (qiPct >= 100 ? '⚡' : '') + qiPct + '%';
    if (bp) bp.textContent = (bodyPct >= 100 ? '⚡' : '') + bodyPct + '%';
  } catch(e) {}
  
  // 🌠 天机指引
  try {
    const tianjiEl = document.getElementById('tianji-hint');
    if (tianjiEl && typeof getTianjiHint === 'function') {
      tianjiEl.textContent = '🌠 ' + getTianjiHint();
    }
  } catch(e) {}
}

function updatePlayerCard() {
  const p = G.player;
  // 名字
  document.getElementById('player-name').textContent = p.name;
  document.getElementById('player-name').setAttribute('data-fortune', p.fortune);
  
  // 灵根
  document.getElementById('attr-root').innerHTML = p.spiritRoots.map(r => {
    const info = ROOT_TYPES[r] || {};
    return `<span class="root-tag" style="color:${info.color}">${info.emoji||''} ${r}</span>`;
  }).join(' ');

  // 星标属性
  const stars = (v) => {
    const full = Math.floor(v / 20);
    const half = v % 20 >= 10 ? 1 : 0;
    return '★'.repeat(full) + (half ? '☆' : '') + '☆'.repeat(Math.max(0, 5-full-half));
  };
  document.getElementById('attr-luck').textContent = stars(p.luck) + ` (${p.luck})`;
  document.getElementById('attr-wisdom').textContent = stars(p.wisdom) + ` (${p.wisdom})`;
  document.getElementById('attr-bone').textContent = stars(p.bone) + ` (${p.bone})`;

  const moods = ['极差','低落','平稳','平和','愉悦','圆满'];
  const moodIdx = Math.floor(p.mood / 20);
  document.getElementById('attr-mood').textContent = moods[Math.min(5, moodIdx)];

  // 基础属性
  document.getElementById('attr-attack').textContent = p.attack;
  document.getElementById('attr-defense').textContent = p.defense;

  // ── 双修进度条 ──
  // 炼体
  const bodyProg = getCultivationProgress('body');
  document.getElementById('progress-body-fill').style.width = Math.min(100, bodyProg) + '%';
  var br = getBodyRealm();
  var bNext = BODY_REALMS[p.bodyRealmIndex + 1];
  if (p.bodyRealmIndex < BODY_REALMS.length - 1 && br && bNext) {
    var bodyCur = p.bodyCultivationPoints - br.cpRequired;
    var bodyNeed = bNext.cpRequired - br.cpRequired;
    document.getElementById('progress-body-label').innerHTML =
      `${br.name} <span style="color:var(--text-dim);font-weight:normal;font-size:10px;">(${bodyCur.toLocaleString()}/${bodyNeed.toLocaleString()})</span>`;
  } else {
    document.getElementById('progress-body-label').textContent = `${br.name} · 圆满`;
  }

  // 炼气
  const qiProg = getCultivationProgress('qi');
  document.getElementById('progress-qi-fill').style.width = Math.min(100, qiProg) + '%';
  var qr = getQiRealm();
  var qNext = QI_REALMS[p.qiRealmIndex + 1];
  if (p.qiRealmIndex < QI_REALMS.length - 1 && qr && qNext) {
    var qiCur = p.qiCultivationPoints - qr.cpRequired;
    var qiNeed = qNext.cpRequired - qr.cpRequired;
    document.getElementById('progress-qi-label').innerHTML =
      `${qr.name} <span style="color:var(--text-dim);font-weight:normal;font-size:10px;">(${qiCur.toLocaleString()}/${qiNeed.toLocaleString()})</span>`;
  } else {
    document.getElementById('progress-qi-label').textContent = `${qr.name} · 圆满`;
  }

}

function updateSkillList() {
  const list = document.getElementById('skill-list');
  const titleEl = document.querySelector('#skill-panel .panel-title');
  const p = G.player;
  if (!p || !p.skills) return;
  
  if (p.skills.length === 0) {
    list.innerHTML = '<span style="color:var(--text-dim);font-size:11px;">尚无功法</span>';
    if (titleEl) titleEl.innerHTML = '📜 功法';
    return;
  }
  
  const qualColors = { '凡级':'#8a7a6a', '灵级':'#6a9ec9', '地级':'#d46a3a', '天级':'#c9a96e', '仙级':'#d4a5f9' };
  const typeIcons = { '吐纳法':'🧘','炼体术':'💪','攻伐术':'⚔️','护体诀':'🛡️','身法':'💨','疗伤法':'💚','秘术':'🔮','心法':'📿','阵道':'🌀','丹道':'⚗️' };
  const elementColors = { '金':'#c9a96e','木':'#5a9a6a','水':'#6a9ec9','火':'#d46a3a','土':'#8a7a5a' };
  const elementEmoji = { '金':'🪙','木':'🌿','水':'💧','火':'🔥','土':'🟤' };
  const slotLabels = {
    'tuna':'🧘 吐纳','lianti':'💪 炼体','gongfa':'⚔️ 攻伐','huti':'🛡️ 护体',
    'shenfa':'💨 身法','liaoshang':'💚 疗伤','mishu':'🔮 秘术','xinfa':'📿 心法',
    'zhendao':'🌀 阵道','dandao':'⚗️ 丹道'
  };
  
  // 按装配状态分组：已装配的槽位在前，未装配的在后
  var equippable = {};  // slot -> skill
  var unassigned = [];
  p.skills.forEach(function(s) {
    if (p.skillSlots) {
      var found = false;
      for (var sk in p.skillSlots) {
        if (p.skillSlots[sk] === s.id) { equippable[sk] = s; found = true; break; }
      }
      if (!found) unassigned.push(s);
    } else {
      // 兼容旧存档：按active分
      if (s.active) equippable[s.type] = s;
      else unassigned.push(s);
    }
  });
  
  // 标题显示总览
  var slotCount = p.skillSlots ? Object.keys(p.skillSlots).filter(function(k) { return p.skillSlots[k]; }).length : 0;
  var skillCount = p.skills.length;
  if (titleEl) titleEl.innerHTML = '📜 功法（' + slotCount + '/' + Object.keys(slotLabels).length + '槽 · 共' + skillCount + '门）';
  
  var html = '';
  
  // ── 已装配功法（按槽位顺序显示） ──
  html += '<div style="font-size:10px;color:var(--text-dim);margin-bottom:3px;">⚡ 已装配</div>';
  var slotOrder = ['tuna','lianti','gongfa','huti','shenfa','liaoshang','xinfa','mishu','zhendao','dandao'];
  var hasEquipped = false;
  slotOrder.forEach(function(slot) {
    var s = equippable[slot];
    if (!s) {
      // 空槽位显示占位
      html += '<div class="skill-item" style="opacity:0.35;cursor:default;" title="该槽位为空">' +
        '<span class="skill-icon">➕</span>' +
        '<span class="skill-name" style="color:var(--text-dim);font-style:italic;">' + (slotLabels[slot] || slot) + '</span>' +
        '<span class="skill-level">空位</span></div>';
      return;
    }
    hasEquipped = true;
    html += renderSkillRow(s, true, p, qualColors, typeIcons, elementColors, elementEmoji, slotLabels, slot);
  });
  if (!hasEquipped) {
    html += '<div style="font-size:10px;color:var(--text-dim);margin:2px 0 4px 0;">（尚未装配任何功法）</div>';
  }
  
  // ── 未装配功法 ──
  if (unassigned.length > 0) {
    html += '<div style="font-size:10px;color:var(--text-dim);margin-top:6px;margin-bottom:3px;">📦 未装配</div>';
    var sorted = [];
    // 按品质排序：天>仙>地>灵>凡
    var qualOrder = { '天级':0, '仙级':1, '地级':2, '灵级':3, '凡级':4 };
    // 先按类型分组显示
    var typeGroups = {};
    unassigned.forEach(function(s) {
      var t = s.type || '其他';
      if (!typeGroups[t]) typeGroups[t] = [];
      typeGroups[t].push(s);
    });
    var typeOrder = ['吐纳法','炼体术','攻伐术','护体诀','身法','疗伤法','心法','秘术','阵道','丹道','其他'];
    typeOrder.forEach(function(t) {
      if (!typeGroups[t]) return;
      typeGroups[t].sort(function(a,b) {
        return (qualOrder[a.quality] || 99) - (qualOrder[b.quality] || 99);
      });
      typeGroups[t].forEach(function(s) {
        html += renderSkillRow(s, false, p, qualColors, typeIcons, elementColors, elementEmoji);
      });
    });
  } else if (Object.keys(equippable).length > 0) {
    // 全部已装配，无未装配
  }
  
  list.innerHTML = html;
}

// 渲染单行功法
function renderSkillRow(s, equipped, p, qualColors, typeIcons, elementColors, elementEmoji, slotLabels, slot) {
  var qual = s.quality || '凡级';
  var color = qualColors[qual] || '#8a7a6a';
  var icon = typeIcons[s.type] || '📜';
  var isActive = equipped;
  var activeCls = isActive ? 'skill-active' : '';
  // 🔧 已装配功法：点击卸下（清空槽位，属性随之变化）；未装配：点击装配
  var clickAttr = isActive ? ('onclick="unequipSkill(\'' + s.id + '\')"') : ('onclick="activateSkill(\'' + s.id + '\')"');
  
  var ml = s.masteryLevel || 0;
  var mxp = s.masteryXp || 0;
  var needed = (ml + 1) * 100;
  var pct = Math.min(100, Math.round(mxp / needed * 100));
  var masteryLabel = ml >= 10 ? '🔥圆满' : 'Lv.' + ml;
  
  // 熟练度条
  var barHtml = '';
  if (ml < 10) {
    barHtml = '<div style="height:2px;background:rgba(255,255,255,0.06);border-radius:1px;margin:1px 0;"><div style="height:100%;width:' + pct + '%;background:' + color + ';border-radius:1px;"></div></div>';
  }
  
  // 灵根契合度标
  var elementBadge = '';
  if (s.element && s.element !== '无') {
    var elColor = elementColors[s.element] || '#aaa';
    var elEmoji = elementEmoji[s.element] || '';
    var match;
    if (s.element === p.spiritRoots[0]) match = '💎';
    else if (p.spiritRoots && p.spiritRoots.includes(s.element)) match = '✓';
    else match = '⚠️';
    elementBadge = '<span class="skill-element-badge" style="background:' + elColor + '22;color:' + elColor + ';border:1px solid ' + elColor + '44;">' + elEmoji + s.element + match + '</span>';
  }
  
  // 槽位名
  var slotLabel = '';
  if (slot && slotLabels && slotLabels[slot]) {
    slotLabel = '<span style="font-size:9px;color:var(--text-dim);margin-right:2px;">' + slotLabels[slot] + '</span>';
  }
  
  // 悬停: 功法描述 + 效果
  var sd = (typeof SKILL_DB !== 'undefined' ? SKILL_DB : []).find(function(d) { return d.id === s.id; });
  var effDesc = '';
  if (sd && typeof describeEffects === 'function') effDesc = describeEffects(sd.effects);
  var comp = '';
  if (typeof getComparisonText === 'function') comp = getComparisonText ? getComparisonText(s.id) : '';
  var tipLines = [];
  if (sd && sd.desc) tipLines.push('📖 ' + sd.desc);
  if (effDesc) tipLines.push(effDesc);
  // ⚡ 熟练度加成说明：让玩家看到升级带来的实际提升
  if (sd && sd.effects) {
    var ml = s.masteryLevel || 0;
    var combatKeys = ['attackBonus','defenseBonus','hpBonus','maxQiBonus','hpLimit','qiLimit'];
    var hasCombat = Object.keys(sd.effects).some(function(k) { return combatKeys.indexOf(k) >= 0; });
    var hasNonCombat = Object.keys(sd.effects).some(function(k) { return ['cultivationSpeed','bodyCultSpeed','qiRegen','hpRegen','dodge','exploreBonus','critRate'].indexOf(k) >= 0; });
    if (hasCombat || hasNonCombat) {
      var lines = [];
      if (hasCombat) {
        // 战斗加成：每级+13%（0.5+ml*0.13）
        var battleMult = (0.5 + ml * 0.13).toFixed(2);
        lines.push('⚡ 熟练加成 ×' + battleMult + (ml < 10 ? '（升级至Lv' + (ml+1) + ' → ×' + (0.5 + (ml+1)*0.13).toFixed(2) + '）' : '（圆满）'));
      }
      if (hasNonCombat) {
        // 非战斗加成（修炼速度等）：每级+6%
        var cultMult = (1 + ml * 0.06).toFixed(2);
        lines.push('🧘 修炼成长 ×' + cultMult + (ml < 10 ? '（升级至Lv' + (ml+1) + ' → ×' + (1 + (ml+1)*0.06).toFixed(2) + '）' : '（圆满）'));
      }
      if (lines.length > 0) {
        tipLines.push('');
        tipLines.push(lines.join('\n'));
      }
    }
  }
  if (comp) tipLines.push('');
  if (comp) tipLines.push(comp);
  if (tipLines.length === 0) tipLines.push(isActive ? '点击卸下此功法' : '点击装配此功法');
  if (isActive) tipLines.push('');
  if (isActive) tipLines.push('🔓 点击卸下（属性立即重算）');
  var tip = tipLines.join('\n');
  
  var unequipMark = isActive ? '<span style="font-size:9px;color:var(--text-dim);margin-left:2px;">🔓</span>' : '';
  return '<div class="skill-item ' + activeCls + '" ' + clickAttr + ' title="' + tip.replace(/"/g, '&quot;') + '">' +
    '<span class="skill-icon">' + icon + '</span>' +
    '<div style="flex:1;min-width:0;">' +
      '<div style="display:flex;align-items:center;gap:3px;">' +
        '<span class="skill-name">' + s.name + '</span>' +
        elementBadge +
        '<span class="skill-level">' + masteryLabel + '</span>' +
      '</div>' +
      (slotLabel ? '<div style="font-size:9px;">' + slotLabel + '</div>' : '') +
      barHtml +
    '</div>' +
    (s.mastered ? '<span class="skill-mastered">✓</span>' : '') +
    unequipMark +
  '</div>';
}

function activateSkill(skillId) {
  const p = G.player;
  
  // slot 系统：找到这个技能的槽位，只替换该槽位
  const sk = p.skills.find(s => s.id === skillId);
  if (!sk) return;
  
  // 确保skillSlots存在（兼容旧存档）
  if (!p.skillSlots) {
    p.skillSlots = {
      tuna: null, lianti: null, gongfa: null,
      huti: null, shenfa: null, liaoshang: null,
      mishu: null, xinfa: null, zhendao: null, dandao: null
    };
  }
  
  const slotMap = {
    '吐纳法':'tuna','炼体术':'lianti','攻伐术':'gongfa',
    '护体诀':'huti','身法':'shenfa','疗伤法':'liaoshang',
    '秘术':'mishu','心法':'xinfa','阵道':'zhendao','丹道':'dandao'
  };
  const slot = slotMap[sk.type];
  if (!slot) { addNarrative('该类型功法无法装配。', 'system'); return; }
  
  const oldCp = p.combatPower || 0;
  
  // 设该槽位
  p.skillSlots[slot] = skillId;
  p.skills.forEach(s => s.active = (s.id === skillId || Object.values(p.skillSlots).includes(s.id)));
  
  recalcStats(p);
  const newCp = p.combatPower || 0;
  const cpDiff = newCp - oldCp;
  
  // 从数据库查完整描述
  const skillDb = (typeof SKILL_DB !== 'undefined' ? SKILL_DB : (G.skillData || []));
  const sd = skillDb.find(d => d.id === skillId);
  if (sd) {
    const qColor = typeof getQualityColor === 'function' ? getQualityColor(sd.quality) : '#aaa';
    const effects = typeof formatEffectDescriptions === 'function' ? formatEffectDescriptions(sd.effects) : [];
    const effHtml = effects.length > 0 ? effects.map(e => `<span class="epic-stat">✦ ${e}</span>`).join('') : '';
    const cpText = cpDiff > 0 ? ` ⚔ 战力 +${cpDiff}` : cpDiff < 0 ? ` ⚔ 战力 ${cpDiff}` : '';
    const html = `<div class="epic-name" style="color:${qColor}">🔗 装备 <b>${sk.name}</b><span class="epic-quality">${sk.quality}·${sk.type}</span></div>
<span style="display:block;font-size:12px;color:var(--text-dim);margin-top:3px;">${sd.desc || ''}</span>
${effHtml ? `<span style="display:block;font-size:11px;margin-top:4px;">${effHtml}</span>` : ''}
${cpText ? `<span class="epic-stat" style="font-weight:bold;color:${cpDiff >= 0 ? 'var(--accent)' : 'var(--danger)'};">${cpText}</span>` : ''}`;
    addNarrative(html, 'epic');
  }
  updateAllUI();
}

// 🔧 卸下功法：清空对应槽位，属性立即重算（与装上对称）
function unequipSkill(skillId) {
  const p = G.player;
  if (!p || !p.skillSlots) return;
  const sk = p.skills.find(s => s.id === skillId);
  if (!sk) return;
  const slotMap = {
    '吐纳法':'tuna','炼体术':'lianti','攻伐术':'gongfa',
    '护体诀':'huti','身法':'shenfa','疗伤法':'liaoshang',
    '秘术':'mishu','心法':'xinfa','阵道':'zhendao','丹道':'dandao'
  };
  const slot = slotMap[sk.type];
  if (!slot || p.skillSlots[slot] !== skillId) return;
  const oldCp = p.combatPower || 0;
  p.skillSlots[slot] = null;
  sk.active = false;
  recalcStats(p);
  const newCp = p.combatPower || 0;
  const cpDiff = newCp - oldCp;
  addNarrative(`🔓 你卸下了 <b>${sk.name}</b>${cpDiff !== 0 ? `（战力 ${cpDiff > 0 ? '+' : ''}${cpDiff}）` : ''}。`, 'event');
  updateAllUI();
}
window.unequipSkill = unequipSkill;

function updateInventory() {
  const inv = document.getElementById('inventory-list');
  const p = G.player;

  const typeIcons = { '丹药':'💊','材料':'🪨','法器':'🗡️','灵草':'🌿','杂物':'📦','功法卷轴':'📜','宝石':'💎' };
  const categoryNames = { '丹药':'💊 丹药', '材料':'🪨 材料', '装备':'⚔️ 装备', '杂物':'📦 杂物', '任务':'🎯 任务', '宝石':'💎 宝石' };
  const categoryOrder = ['丹药', '装备', '宝石', '材料', '杂物'];
  
  // ── 标签栏：背包 / 储物箱 ──
  var showBox = G._showStorageBox || false;
  var tabHtml = '<div style="display:flex;gap:4px;margin-bottom:6px;">' +
    '<div class="' + (!showBox ? 'inv-tab-active' : 'inv-tab') + '" onclick="G._showStorageBox=false;updateAllUI()">🎒 背包</div>' +
    '<div class="' + (showBox ? 'inv-tab-active' : 'inv-tab') + '" onclick="showStorageBoxUI()">📦 储物箱</div>' +
    '</div>';
  
  if (showBox) {
    renderStorageBoxUI(inv, tabHtml);
    return;
  }
  
  // 存储戒状态
  const ring = p.storageRing || { name:'初阶储物戒', capacity: 12, currentLoad: 0, level: 1 };
  ring.currentLoad = p.inventory.length;
  const ringFull = ring.currentLoad >= ring.capacity;
  
  let ringHtml = `<div class="storage-ring-info" style="font-size:11px;margin-bottom:4px;padding:4px 6px;background:rgba(0,0,0,0.2);border-radius:4px;">
    <span>💍 ${ring.name}</span>
    <span style="float:right;${ringFull ? 'color:#e74c3c;font-weight:bold;' : 'color:var(--text-dim)'}">📦 ${ring.currentLoad}/${ring.capacity}</span>
  </div>`;
  
  if (ring.level < 5) {
    ringHtml += `<div style="font-size:10px;color:var(--accent);margin-bottom:4px;cursor:pointer;display:inline-block;" onclick="upgradeStorageRing()">
      🔧 升级（${ring.upgradeCost}灵石 → ${ring.upgradeDesc}）
    </div>`;
  } else {
    ringHtml += `<div style="font-size:10px;color:var(--text-dim);margin-bottom:4px;">✨ 已满级</div>`;
  }
  
  // 过滤无效物品（避免存档损坏导致id缺失崩溃）
  p.inventory = p.inventory.filter(function(i){ return i && i.id; });
  
  // 🔧 2026-08-03：宝石字段兜底——运行时实时补 type（防旧档/掉落缺字段点不中）
  try {
    p.inventory.forEach(function(i) {
      if (!i.type && i.id) {
        var d = (typeof ITEM_DB !== 'undefined' ? ITEM_DB : []).find(function(x) { return x.id === i.id; });
        if (d) { i.type = d.type; if (!i.category) i.category = d.category; }
      }
      if (i.type === '宝石' && i.category !== '宝石' && i.category !== '材料') i.category = '材料';
      // 🔧 2026-08-03：宝石缺 qty → 渲染时补 1（点击判定兜底）
      if (i.type === '宝石' && (i.qty === undefined || i.qty === null)) i.qty = 1;
    });
  } catch(e) {}
  
  // 按分类分组
  p.inventory.forEach(i => {
    if (!i.category) {
      const id = (typeof ITEM_DB !== 'undefined' ? ITEM_DB : []).find(d => d.id === i.id);
      i.category = (id && id.category) ? id.category : '杂物';
    }
  });
  const groups = {};
  p.inventory.forEach(i => {
    // 🔧 2026-08-03：宝石独立分类（type='宝石'，原被归入材料堆里找不到）
    const gcat = (i.type === '宝石') ? '宝石' : i.category;
    if (!groups[gcat]) groups[gcat] = [];
    groups[gcat].push(i);
  });
  
  let invHtml = tabHtml + ringHtml;
  
  categoryOrder.forEach(cat => {
    const items = groups[cat];
    if (!items || items.length === 0) return;
    invHtml += `<div class="inv-category" style="margin-top:6px;margin-bottom:2px;font-size:11px;font-weight:bold;color:var(--text-dim);">${categoryNames[cat] || cat}</div>`;
    items.forEach(i => {
      const icon = typeIcons[i.type] || '📦';
      var clickAttr = '';
      var extraClass = '';
      
      // 判定动作
      if (i.type === '宝石') {
        // 💎 宝石：点击弹镶嵌对话框
        clickAttr = ` onclick="gemSocketDialog('${i.id}')"`;
        extraClass = ' inv-clickable';
      } else if (i.use && (i.use.hp || i.use.qi || i.use.cultivationPoints || i.use.bodyCultivationPoints || i.use.mood)) {
        // 可消耗品：使用
        clickAttr = ` onclick="useItem('${i.id}')"`;
        extraClass = ' inv-clickable';
      } else if (i.herbEffect) {
        // 🍀 属性灵草：使用
        clickAttr = ` onclick="useItem('${i.id}')"`;
        extraClass = ' inv-clickable';
      } else if (i.equipEffect) {
        // 可装备
        clickAttr = ` onclick="equipItem('${i.id}')"`;
        extraClass = ' inv-clickable';
      } else if (i.breakItem) {
        // 突破丹药（只显示信息）
        clickAttr = ` onclick="inventoryShowInfo('${i.id}')"`;
        extraClass = ' inv-clickable';
      } else if (i.treasureMap) {
        // 🗺️ 藏宝图：使用寻宝
        clickAttr = ` onclick="useItem('${i.id}')"`;
        extraClass = ' inv-clickable';
      } else if (i.id && (i.id.startsWith('heifeng_key') || i.id.startsWith('biguan_') || i.id.startsWith('mingfu_'))) {
        // 任务物品
        clickAttr = ` onclick="inventoryShowInfo('${i.id}')"`;
        extraClass = ' inv-clickable';
      }
      
      // 品质高光
      var rarityStars = '';
      if (i.rarity >= 5) rarityStars = ' ⭐⭐⭐⭐⭐';
      else if (i.rarity >= 4) rarityStars = ' ⭐⭐⭐⭐';
      else if (i.rarity >= 3) rarityStars = ' ⭐⭐⭐';
      else if (i.rarity >= 2) rarityStars = ' ⭐⭐';
      
      // ⚔️ 装备品质标签（凡品/灵品/地品/天品/圣品）
      var equipBadge = '';
      var nameColor = '';
      if (i.category === '装备' && i.quality && typeof EQUIP_QUALITIES !== 'undefined' && EQUIP_QUALITIES[i.quality]) {
        var eqq = EQUIP_QUALITIES[i.quality];
        nameColor = eqq.color;
        equipBadge = ' <span style="font-size:8px;color:' + eqq.color + ';border:1px solid ' + eqq.color + '44;border-radius:3px;padding:0 3px;vertical-align:middle;">' + eqq.emoji + i.quality + '</span>';
      }
      
      // 任务物品标记
      var isQuestItem_ = typeof isQuestItem === 'function' && isQuestItem(i.id);
      var questIcon = isQuestItem_ ? '🔒' : '';
      var questTitle = isQuestItem_ ? '任务物品·不可出售' : '出售';
      var dropBtn = isQuestItem_ 
        ? `<span class="inv-drop" style="opacity:0.4;cursor:not-allowed;" title="任务物品·不可出售">🔒</span>`
        : `<span class="inv-drop" onclick="event.stopPropagation();dropInventoryItem('${i.id}')" title="出售">💰</span>`;
      invHtml += `<div class="inv-item${extraClass}"${clickAttr} onmouseenter="showItemTooltip(event,'${i.id}')" onmouseleave="hideItemTooltip()" data-item-id="${i.id}">
        <span class="inv-icon">${icon}</span>
        <span class="inv-name"${nameColor ? ' style="color:' + nameColor + '"' : ''}>${i.name}${rarityStars}${equipBadge}</span>
        <span class="inv-qty">x${i.qty}</span>
        ${dropBtn}
        <span class="inv-store" onclick="event.stopPropagation();inventoryMoveToStorageBox('${i.id}',1)" title="存入储物箱">📦</span>
      </div>`;
    });
  });
  
  if (p.inventory.length === 0) {
    invHtml += '<div style="font-size:11px;color:var(--text-dim);padding:8px;text-align:center;">背包空空</div>';
  }
  
  // 自动出售开关
  invHtml += '<div style="margin-top:8px;font-size:10px;color:var(--text-dim);cursor:pointer;" onclick="G.player.autoSellEnabled=!G.player.autoSellEnabled;updateAllUI()">' +
    (p.autoSellEnabled ? '✅ 自动出售杂物' : '⬜ 自动出售杂物') +
    '</div>';
  
  inv.innerHTML = invHtml;
  updateTooltipPosition();
}

// ── 物品悬停信息 ──
// 装备属性 key → 中文名
function keyLabel(k) {
  var m = {
    attackBonus:'攻击', defenseBonus:'防御', hpBonus:'气血', maxQiBonus:'灵力',
    cultivationSpeed:'修炼速度', qiRegen:'灵力恢复', dodge:'闪避', critRate:'暴击',
    wisdomBonus:'悟性', healingBonus:'疗伤', mood:'心情'
  };
  return m[k] || k;
}

// 🔧 2026-08-03：获取已装备的某部位装备列表（饰品多件 → 返回数组）
function getWornEquipItems(slot) {
  var p = G.player;
  if (!p || !p.equipment) return [];
  var item = p.equipment[slot];
  if (!item) return [];
  if (slot === 'accessory' && Array.isArray(item)) return item;
  return [item];
}

var _itemTooltip = null;
function showItemTooltip(event, itemId, itemData) {
  var p = G.player;
  // 🔧 2026-08-03：支持直接传物品数据（坊市/黑市商品不在背包里）
  var inv = itemData || (p.inventory.find(function(i){ return i.id === itemId; }));
  if (!inv) {
    // 再试试从 ITEM_DB 查（黑市商品可能只传 id）
    inv = (typeof ITEM_DB !== 'undefined' ? ITEM_DB : []).find(function(d){ return d.id === itemId; });
  }
  if (!inv) return;
  
  // 从ITEM_DB取完整数据
  var data = (typeof ITEM_DB !== 'undefined' ? ITEM_DB : []).find(function(d){ return d.id === itemId; });
  
  var html = '<div style="font-weight:bold;font-size:13px;margin-bottom:4px;">' + inv.name + '</div>';
  
  // 装备部位
  if (inv.equipEffect) {
    var slotN = { weapon:'🗡️ 武器', armor:'🛡️ 护甲', accessory:'💍 饰品', head:'👑 头饰', shoes:'👢 鞋履' };
    // 🔧 每次重算槽位：不信任旧 _calcSlot 缓存（旧代码曾把掉落装备uid误判为weapon并缓存）
    var s = getEquipSlot(inv);
    inv._calcSlot = s;
    var slotName = slotN[s] || '';
    if (slotName) html += '<div style="font-size:10px;color:var(--text-dim);">' + slotName + '</div>';
    // 💎 孔位显示
    if (inv.sockets > 0) {
      const gemDb = (typeof ITEM_DB !== 'undefined' ? ITEM_DB : []);
      const sok = inv.socketed || [];
      let sokHtml = '';
      for (let si = 0; si < inv.sockets; si++) {
        const gid = sok[si];
        if (gid) {
          const gm = gemDb.find(function(g){ return g.id === gid; });
          sokHtml += '💎' + (gm ? gm.name : '');
        } else {
          sokHtml += '⚪';
        }
      }
      html += '<div style="font-size:10px;color:#c9a96e;margin-top:2px;">💎 孔位：' + sokHtml + '</div>';
    }
  }
  
  // 品质
  if (inv.rarity && inv.rarity >= 1) {
    var rnames = {5:'神品 (☆☆☆☆☆)',4:'圣品 (☆☆☆☆)',3:'天品 (☆☆☆)',2:'地品 (☆☆)',1:'灵品 (☆)'};
    html += '<div style="color:#c9a96e;font-size:11px;margin-bottom:4px;">' + (rnames[inv.rarity] || '珍品') + '</div>';
  }
  
  // 描述
  html += '<div style="font-size:11px;color:var(--text);margin-bottom:4px;">' + inv.desc + '</div>';
  
  // 🔧 2026-08-03：宝石 tooltip——镶嵌指引
  if (inv.type === '宝石') {
    // gemEffect 可能不在背包条目里，从 ITEM_DB 补查
    var gemFull = data || inv;
    var gemEff = gemFull.gemEffect || gemFull.effects || inv.gemEffect || {};
    var gemParts = [];
    if (gemEff.attackBonus) gemParts.push('攻击+' + gemEff.attackBonus);
    if (gemEff.defenseBonus) gemParts.push('防御+' + gemEff.defenseBonus);
    if (gemEff.hpBonus) gemParts.push('气血+' + gemEff.hpBonus);
    if (gemEff.maxQiBonus) gemParts.push('灵力+' + gemEff.maxQiBonus);
    if (gemEff.critRate) gemParts.push('暴击+' + Math.round(gemEff.critRate * 100) + '%');
    if (gemEff.dodge) gemParts.push('闪避+' + Math.round(gemEff.dodge * 100) + '%');
    if (gemEff.cultivationSpeed) gemParts.push('修炼+' + Math.round(gemEff.cultivationSpeed * 100) + '%');
    if (gemParts.length) html += '<div style="font-size:10px;color:#c9a96e;margin-bottom:2px;">✨ 镶嵌效果：' + gemParts.join(' ') + '</div>';
    // 找身上有空孔的装备
    var pEq = p.equipment || {};
    var socketable = Object.keys(pEq).filter(function(k) {
      return pEq[k] && pEq[k].sockets && pEq[k].sockets > (pEq[k].socketed ? pEq[k].socketed.length : 0);
    });
    var slotN = { weapon:'🗡️ 武器', armor:'🛡️ 护甲', accessory:'💍 饰品', head:'👑 头饰', shoes:'👢 鞋履' };
    if (socketable.length) {
      html += '<div style="font-size:10px;color:#7dce9a;margin-bottom:2px;">💎 可镶入：' + socketable.map(function(k){ return slotN[k] || k; }).join('、') + '（人物面板→装备栏→孔位选择）</div>';
    } else {
      html += '<div style="font-size:10px;color:var(--text-dim);margin-bottom:2px;">💎 可镶嵌到带孔装备（当前无空孔装备）</div>';
    }
  }
  
  // 价格
  html += '<div style="font-size:10px;color:var(--accent);">💰 ' + inv.value + ' 灵石</div>';
  
  // 用法说明
  if (inv.use && inv.use.hp) html += '<div style="font-size:10px;color:#5a9a5a;">💚 使用：恢复 ' + inv.use.hp + ' 气血</div>';
  else if (inv.use && inv.use.qi) html += '<div style="font-size:10px;color:#6a9ec9;">💙 使用：恢复 ' + inv.use.qi + ' 灵力</div>';
  else if (inv.use && inv.use.cultivationPoints) html += '<div style="font-size:10px;color:#b080d0;">✨ 使用：+ ' + inv.use.cultivationPoints + ' 修为</div>';
  else if (inv.use && inv.use.bodyCultivationPoints) html += '<div style="font-size:10px;color:#8a7a5a;">💪 使用：+ ' + inv.use.bodyCultivationPoints + ' 体魄修为</div>';
  else if (inv.use && inv.use.mood) html += '<div style="font-size:10px;color:#d4a0a0;">😊 使用：心情 +' + inv.use.mood + '</div>';
  else if (inv.use && inv.use.breakChance) html += '<div style="font-size:10px;color:#c9a96e;">🔥 使用：突破成功率 +' + Math.round(inv.use.breakChance * 100) + '%</div>';
  else if (inv.herbEffect) {
    var he = inv.herbEffect;
    var parts = [];
    if (he.luck) parts.push('气运+' + he.luck);
    if (he.wisdom) parts.push('悟性+' + he.wisdom);
    if (he.bone) parts.push('根骨+' + he.bone);
    html += '<div style="font-size:10px;color:#d4a0a0;">🍀 永久提升：' + parts.join(' ') + '</div>';
  } else if (inv.treasureMap) {
    html += '<div style="font-size:10px;color:#c9a96e;">🗺️ 使用可寻宝（点击使用）</div>';
  }
  else if (inv.breakItem) html += '<div style="font-size:10px;color:#c9a96e;">🔑 突破必备材料</div>';
  
  // 装备属性+与身上同部位对比
  if (inv.equipEffect) {
    var eff = inv.equipEffect;
    var parts = [];
    if (eff.attackBonus) parts.push('攻击+' + eff.attackBonus);
    if (eff.defenseBonus) parts.push('防御+' + eff.defenseBonus);
    if (eff.hpBonus) parts.push('气血+' + eff.hpBonus);
    if (eff.maxQiBonus) parts.push('灵力+' + eff.maxQiBonus);
    if (eff.cultivationSpeed) parts.push('修炼速度+' + Math.round(eff.cultivationSpeed * 100) + '%');
    if (eff.qiRegen) parts.push('灵力恢复+' + eff.qiRegen);
    if (eff.dodge) parts.push('闪避+' + Math.round(eff.dodge * 100) + '%');
    if (eff.critRate) parts.push('暴击+' + Math.round(eff.critRate * 100) + '%');
    if (eff.wisdomBonus) parts.push('悟性+' + eff.wisdomBonus);
    if (eff.healingBonus) parts.push('疗伤+' + Math.round(eff.healingBonus * 100) + '%');
    if (eff.mood) parts.push('心情+' + eff.mood);
    html += '<div style="font-size:10px;color:#d46a3a;">⚔️ ' + parts.join(' ') + '</div>';
    
    // 🔧 与身上同部位装备对比（饰品多件：与已戴所有饰品属性总和对比）
    var slot = inv._calcSlot || getEquipSlot(inv);
    inv._calcSlot = slot;
    var wornItems = [];
    if (slot === 'accessory' && Array.isArray(p.equipment[slot])) {
      wornItems = p.equipment[slot];
    } else if (p.equipment[slot]) {
      wornItems = [p.equipment[slot]];
    }
    if (wornItems.length > 0) {
      var we = {};
      var wornNames = [];
      wornItems.forEach(function(wi) {
        wornNames.push(wi.name);
        Object.keys(wi.effects || {}).forEach(function(k) { we[k] = (we[k] || 0) + (wi.effects[k] || 0); });
      });
      var allKeys = ['attackBonus','defenseBonus','hpBonus','maxQiBonus','cultivationSpeed','qiRegen','dodge','critRate','wisdomBonus','healingBonus','mood'];
      var diffParts = [];
      allKeys.forEach(function(k) {
        var nv = eff[k] || 0, ov = we[k] || 0;
        if (nv === ov) return;
        var delta = nv - ov;
        var sign = delta > 0 ? '+' : '';
        var valTxt = (k === 'cultivationSpeed' || k === 'dodge' || k === 'critRate' || k === 'healingBonus') ? Math.round(Math.abs(delta) * 100) + '%' : Math.abs(delta);
        // 🎨 提升=红▲ 下降=绿▼（小夜的配色习惯）
        var color = delta > 0 ? '#ef5350' : '#8bc34a';
        diffParts.push('<span style="color:' + color + '">' + (delta > 0 ? '▲' : '▼') + keyLabel(k) + sign + delta + (k === 'cultivationSpeed' || k === 'dodge' || k === 'critRate' || k === 'healingBonus' ? '%' : '') + '</span>');
      });
      if (diffParts.length) {
        html += '<div style="font-size:10px;color:var(--text-dim);margin-top:2px;">🔁 对比' + slotN[slot] + '（' + wornNames.join('、') + '）：' + diffParts.join(' ') + '</div>';
      } else {
        html += '<div style="font-size:10px;color:var(--text-dim);margin-top:2px;">🔁 与' + slotN[slot] + '（' + wornNames.join('、') + '）属性持平</div>';
      }
    } else {
      html += '<div style="font-size:10px;color:#ef5350;margin-top:2px;">🆕 该部位未装备，穿上即得：' + parts.join(' ') + '</div>';
    }
  }
  
  // 可出售价格
  html += '<div style="font-size:10px;color:var(--text-dim);margin-top:4px;">💎 出售价：' + (inv.value * 5) + ' 灵石</div>';
  
  // 🔧 获取途径提示（2026-08-03）：玩家不知道材料哪来的，悬浮显示来源
  //    仅对非任务物品显示（任务物品有明确指引）；用 getItemSources 查来源
  var isQuestIt = (typeof isQuestItem === 'function') ? isQuestItem(itemId) : false;
  if (!isQuestIt && typeof getItemSources === 'function') {
    try {
      var srcs = getItemSources(itemId);
      var srcLines = [];
      // BOSS掉落
      if (srcs.boss && srcs.boss.length) {
        srcs.boss.slice(0, 3).forEach(function(b) {
          var pct = b.chance ? Math.round(b.chance * 100) : 0;
          srcLines.push('🎯 猎杀' + b.bossName + '（' + b.sceneName + '）' + pct + '%×' + (b.qty || 1));
        });
      }
      // 精英掉落
      if (srcs.elite && srcs.elite.length) {
        srcs.elite.slice(0, 3).forEach(function(e) {
          var pct2 = e.chance ? Math.round(e.chance * 100) : 0;
          srcLines.push('⚔️ 精英' + e.monsterName + ' ' + pct2 + '%×' + (e.qty || 1));
        });
      }
      // 场景战利品
      if (srcs.loot && srcs.loot.length) {
        srcLines.push('🌿 探索' + srcs.loot.slice(0, 3).map(function(l) {
          return l.sceneName + (l.chance ? ' ' + Math.round(l.chance * 100) + '%' : '');
        }).join('、'));
      }
      // 任务奖励
      if (srcs.quest && srcs.quest.length) {
        srcLines.push('📜 任务「' + srcs.quest[0].questName + '」' + (srcs.quest[0].qty > 1 ? '×' + srcs.quest[0].qty : ''));
      }
      // 黑市
      if (srcs.blackMarket) srcLines.push('🏴 黑市有售');
      if (srcLines.length) {
        html += '<div style="font-size:10px;color:#c9a96e;margin-top:3px;border-top:1px dashed rgba(201,169,110,0.25);padding-top:3px;">📍 获取途径：</div>';
        srcLines.slice(0, 4).forEach(function(sl) {
          html += '<div style="font-size:10px;color:var(--text-dim);">' + sl + '</div>';
        });
      }
    } catch(e) {}
  }
  
  // 创建/更新 tooltip
  if (!_itemTooltip) {
    _itemTooltip = document.createElement('div');
    _itemTooltip.id = 'item-tooltip';
    _itemTooltip.style.cssText = 'position:fixed;z-index:9999;background:rgba(10,8,6,0.95);border:1px solid rgba(201,169,110,0.3);border-radius:6px;padding:8px 10px;max-width:240px;font-size:12px;line-height:1.4;pointer-events:none;';
    document.body.appendChild(_itemTooltip);
  }
  _itemTooltip.innerHTML = html;
  _itemTooltip.style.display = 'block';
}

function hideItemTooltip() {
  if (_itemTooltip) _itemTooltip.style.display = 'none';
}

function updateTooltipPosition() {
  document.addEventListener('mousemove', function(e) {
    if (_itemTooltip && _itemTooltip.style.display !== 'none') {
      var x = e.clientX + 14;
      var y = e.clientY - 10;
      if (x + 250 > window.innerWidth) x = e.clientX - 250;
      if (y + 200 > window.innerHeight) y = window.innerHeight - 210;
      if (y < 0) y = 0;
      _itemTooltip.style.left = x + 'px';
      _itemTooltip.style.top = y + 'px';
    }
  });
}

// ── 物品信息弹框（任务物品等）──
function inventoryShowInfo(itemId) {
  var p = G.player;
  var inv = p.inventory.find(function(i){ return i.id === itemId; });
  if (!inv) { addNarrative('物品已不存在。', 'system'); return; }
  addNarrative('📖 ' + inv.name + '：' + inv.desc + '（价值' + inv.value + '灵石，持有' + inv.qty + '件）', 'event');
}

// ── 储物箱界面 ──
function renderStorageBoxUI(container, tabHtml) {
  var p = G.player;
  if (!p.storageBox) p.storageBox = [];
  
  var html = tabHtml + '<div style="font-size:10px;color:var(--text-dim);margin-bottom:4px;">📦 储物箱 · ' + p.storageBox.length + ' 种物品</div>';
  
  p.storageBox.forEach(function(s) {
    var data = (typeof ITEM_DB !== 'undefined' ? ITEM_DB : []).find(function(d){ return d.id === s.id; });
    var icon = '📦';
    if (s.type === '丹药') icon = '💊';
    else if (s.type === '灵草') icon = '🌿';
    else if (s.type === '法器') icon = '🗡️';
    
    var desc = data ? data.desc : s.desc || '';
    var storedDay = s._storedAt !== undefined ? ' 储' + s._storedAt + '日' : '';
    
    html += '<div class="inv-item inv-clickable" onclick="storageBoxMoveToInventory(\'' + s.id + '\',1)" onmouseenter="showBoxTooltip(event,\'' + s.id + '\')" onmouseleave="hideItemTooltip()">' +
      '<span class="inv-icon">' + icon + '</span>' +
      '<span class="inv-name">' + s.name + '</span>' +
      '<span class="inv-qty">x' + s.qty + '</span>' +
      '<span class="inv-value" style="font-size:10px;color:var(--text-dim);">' + storedDay + '</span>' +
      '</div>';
  });
  
  if (p.storageBox.length === 0) {
    html += '<div style="font-size:11px;color:var(--text-dim);padding:8px;text-align:center;">储物箱空空如也</div>';
  }
  
  container.innerHTML = html;
}

function showBoxTooltip(event, itemId) {
  var p = G.player;
  var stored = p.storageBox.find(function(s){ return s.id === itemId; });
  if (!stored) return;
  var data = (typeof ITEM_DB !== 'undefined' ? ITEM_DB : []).find(function(d){ return d.id === itemId; });
  var html = '<div style="font-weight:bold;font-size:13px;margin-bottom:4px;">' + stored.name + '</div>' +
    '<div style="font-size:11px;color:var(--text);margin-bottom:4px;">' + (data ? data.desc : stored.desc) + '</div>' +
    '<div style="font-size:10px;color:var(--accent);">💰 ' + stored.value + ' 灵石</div>' +
    '<div style="font-size:10px;color:var(--text-dim);">📦 储' + (stored._storedAt || '?') + '日 · 点击取回</div>';
  if (!_itemTooltip) {
    _itemTooltip = document.createElement('div');
    _itemTooltip.id = 'item-tooltip';
    _itemTooltip.style.cssText = 'position:fixed;z-index:9999;background:rgba(10,8,6,0.95);border:1px solid rgba(201,169,110,0.3);border-radius:6px;padding:8px 10px;max-width:240px;font-size:12px;line-height:1.4;pointer-events:none;';
    document.body.appendChild(_itemTooltip);
  }
  _itemTooltip.innerHTML = html;
  _itemTooltip.style.display = 'block';
}

function showStorageBoxUI() {
  G._showStorageBox = true;
  updateAllUI();
}

window.showStorageBoxUI = showStorageBoxUI;
window.showItemTooltip = showItemTooltip;
window.hideItemTooltip = hideItemTooltip;
window.inventoryShowInfo = inventoryShowInfo;

function updateEquipPanel() {
  const p = G.player;
  const e = document.getElementById('equip-list');
  
  const slotNames = { weapon:'🗡️ 武器', armor:'🛡️ 护甲', accessory:'💍 饰品', head:'👑 头饰', shoes:'👢 鞋履' };
  const slotOrder = ['weapon','armor','accessory','head','shoes'];
  
  var html = '';
  slotOrder.forEach(function(slot) {
    // 🔧 2026-08-03：饰品多件——accessory 数组渲染多个
    var item = p.equipment[slot];
    var itemList = [];
    if (slot === 'accessory' && Array.isArray(item)) {
      itemList = item;
    } else if (item) {
      itemList = [item];
    }
    var slotLabel = slotNames[slot] + (slot === 'accessory' && itemList.length > 1 ? ' ×' + itemList.length : '');
    html += '<div style="font-size:10px;color:var(--text-dim);margin-top:4px;margin-bottom:1px;">' + slotLabel + '</div>';
    if (itemList.length === 0) {
      html += '<div class="equip-item" style="color:var(--text-dim);font-size:11px;">— 空位 —</div>';
      return;
    }
    itemList.forEach(function(item, idx) {
      if (!item || !item.effects) return;
      var eff = item.effects;
      // 品质高光
      var qStr = '';
      var qColor = '#aaa';
      if (item.quality) {
        const qMap = { '凡品':'#aaa', '灵品':'#7dce9a', '地品':'#5a9fe8', '天品':'#c9a96e', '圣品':'#ff8fab' };
        qStr = '<span style="color:' + (qMap[item.quality] || '#aaa') + '">[' + item.quality + '] </span>';
      }
      html += '<div style="font-size:11px;color:#fff;margin-bottom:2px;">' + qStr + item.name + '</div>';
      var effStr = Object.entries(eff).map(function(entry){
        var k = entry[0], v = entry[1];
        if (k === 'attackBonus') return '+' + v + '攻';
        if (k === 'defenseBonus') return '+' + v + '防';
        if (k === 'hpBonus') return '+' + v + '血';
        if (k === 'maxQiBonus') return '+' + v + '灵';
        if (k === 'qiRegen') return '+' + v + '回灵';
        if (k === 'hpRegen') return '+' + v + '回血';
        if (k === 'cultivationSpeed') return '+' + Math.round(v*100) + '%效率';
        if (k === 'wisdomBonus') return '+' + v + '悟';
        if (k === 'dodge') return '+' + Math.round(v*100) + '%闪避';
        if (k === 'critRate') return '+' + Math.round(v*100) + '%暴击';
        if (k === 'elementDamage') { var el = Object.entries(v); if(el.length) return el[0][0]+'+'+Math.round(el[0][1]*100)+'%'; }
        if (k === 'elementResist') { var el = Object.entries(v); if(el.length) return '抗'+el[0][0]+'+'+Math.round(el[0][1]*100)+'%'; }
        if (k === 'luckBonus') return '+' + Math.round(v*100) + '%气运';
        if (k === 'healingBonus') return '+' + Math.round(v*100) + '%治疗';
        if (k === 'qiDrain') return '+' + Math.round(v*100) + '%吸灵';
        if (k === 'mood') return '+' + v + '心情';
        return k + '+' + v;
      }).join(' ');
      // 🔧 饰品用 unequipSlotIndex（多件各自独立卸下）
      var unEqFn = (slot === 'accessory' && Array.isArray(p.equipment[slot]))
        ? `unequipSlotIndex('accessory',${idx})`
        : `unequipSlot('${slot}')`;
      html += '<div class="equip-item equipped" data-slot="' + slot + '" onclick="' + unEqFn + '" title="点击卸下">' +
        '<span>' + item.name + '</span>' +
        '<span style="font-size:10px;color:var(--accent);margin-left:4px;">' + effStr + '</span>' +
        '</div>';
      // 💎 孔位显示 + 镶嵌
      if (typeof renderSocketUI === 'function') {
        html += renderSocketUI(slot, idx);
      }
    });
  });
  
  e.innerHTML = html;
}

function unequipSlot(slot) {
  var p = G.player;
  if (!p.equipment[slot]) return;
  // 🔧 饰品多件：accessory 数组 → 全部卸下
  if (slot === 'accessory' && Array.isArray(p.equipment[slot])) {
    var accs = p.equipment[slot].slice();
    accs.forEach(function(item) {
      addItemToInventory({ id:item.id, name:item.name, type:item.type, value:item.value, category:'装备',
        quality: item.quality || null,
        desc: item.desc || '',
        equipEffect:item.effects || null,
        sockets: item.sockets || 0, socketed: item.socketed || [],
        _equipSlot: item._equipSlot || 'accessory'
      }, 1);
    });
    p.equipment[slot] = [];
    recalcStats(p);
    updateAllUI();
    addNarrative('你卸下了全部饰品（' + accs.length + '件）。', 'event');
    return;
  }
  var item = p.equipment[slot];
  addItemToInventory({ id:item.id, name:item.name, type:item.type, value:item.value, category:'装备',
    quality: item.quality || null,
    desc: item.desc || '',
    equipEffect:item.effects || null,
    sockets: item.sockets || 0, socketed: item.socketed || [],  // 💎 宝石随装备回背包
    _equipSlot: item._equipSlot || slot  // 🔧 槽位保留，防穿错部位
  }, 1);
  p.equipment[slot] = null;
  recalcStats(p);
  updateAllUI();
  addNarrative('你卸下了' + item.name + '。', 'event');
}

window.unequipSlot = unequipSlot;

function updateActions() {
  const list = document.getElementById('actions-list');
  const scene = getSceneData(G.currentScene);
  if (!scene) return;
  
  const actions = [];
  // ── 天道核心行动 ──
  actions.push({ text:'🔍 感知', action:'perceive' });
  actions.push({ text:'📌 探点', action:'poi' });
  actions.push({ text:'💬 喊话', action:'speak' });
  actions.push({ text:'📖 审视', action:'examine' });
  
  // ── 社交 ──
  actions.push({ text:'👥 交谈', action:'npc' });
  // ── 好友 ──
  actions.push({ text:'🤝 好友', action:'friends' });
  
  // ── 战斗/坊市 ──
  if ((scene.type === 'wild' || scene.type === 'dungeon') && scene.monsters && scene.monsters.length > 0) {
    actions.push({ text:'⚔️ 战斗', action:'combat' });
  }
  if (scene.feature === '坊市') {
    actions.push({ text:'🏪 坊市', action:'market' });
  }
  
  // ── 人物面板 ──
  actions.push({ text:'👤 人物', action:'charpanel' });
  
  // ❄️ 第二纪元：冰阁面板（仅冰阁弟子可见）
  if (typeof isSectMember === 'function' && isSectMember()) {
    actions.push({ text:'❄️ 冰阁山门', action:'sect' });
  }
  
  // ── 论道/悔过 ──
  actions.push({ text:'☯️ 论道', action:'dao' });
  if (G.player.mood < 40) actions.push({ text:'🕊️ 悔过', action:'repent' });
  
  // ── 修炼日志 ──
  actions.push({ text:'📖 日志', action:'storylog' });
  
  // ── 自创 ──
  actions.push({ text:'📜 自创功法', action:'create' });
  
  // ── 传送 (非安全区) ──
  if (!scene.safe) actions.push({ text:'🌀 传送回镇', action:'recall' });
  
  // ── 任务 ──
  const hasQuests = (typeof getAvailableQuests === 'function') && getAvailableQuests().length > 0;
  const hasActiveQuests = (typeof getActiveQuests === 'function') && getActiveQuests().length > 0;
  if (hasQuests || hasActiveQuests) {
    actions.push({ text:'📋 任务', action:'quest' });
  }
  
  // ── 秘境 ──
  if (typeof getAccessibleRealms === 'function') {
    try {
      const realms = getAccessibleRealms();
      if (realms.length > 0) {
        actions.push({ text:'🌀 秘境', action:'realm' });
      }
    } catch(e) {}
  }
  
  // ── 世界地图（整合旅行、刷图、玄黄图） ──
  actions.push({ text:'🗺️ 世界地图', action:'worldmap' });
  
  // ── 试炼塔（🔧 2026-08-03：地图跑通后可从任何地方直接进入；入口恒定显示，点塔时内部判断解锁）──
  if (typeof showTowerModal === 'function') {
    actions.push({ text:'🏛️ 试炼塔', action:'tower' });
  }
  
  // ── 炼丹（有丹方/材料/在丹房场景都能看到入口）──
  if (typeof showAlchemyPanel === 'function') {
    const alchemyScenes = ['lingyao_garden', 'lingyun_peak', 'qingyun_zhen', 'moon_valley'];
    const hasAnyRecipe = (G.player.learnedRecipes || []).length > 0;
    // 背包里有任一丹方材料 → 提示可炼丹（新手采到灵草就能发现入口）
    let hasAlchemyMat = false;
    try {
      if (typeof DANFANG_DB !== 'undefined' && G.player.inventory) {
        const alMatIds = new Set();
        Object.keys(DANFANG_DB).forEach(rid => {
          const r = DANFANG_DB[rid];
          if (r && r.ingredients) r.ingredients.forEach(i => alMatIds.add(i.id));
        });
        hasAlchemyMat = G.player.inventory.some(it => alMatIds.has(it.id));
      }
    } catch(e) {}
    if (hasAnyRecipe || hasAlchemyMat || alchemyScenes.includes(G.currentScene)) {
      actions.push({ text:'⚗️ 炼丹', action:'alchemy' });
    }
  }

  // ── 炼器（有配方/矿石材料/在锻造场景都能看到入口）──
  if (typeof showForgePanel === 'function') {
    const forgeScenes = ['xuantie_mine', 'qingyun_zhen', 'leiyin_temple'];
    const hasAnyForge = (G.player.forgeRecipes || []).length > 0;
    // 背包里有任一锻造材料 → 提示可炼器
    let hasForgeMat = false;
    try {
      if (typeof FORGE_RECIPES !== 'undefined' && G.player.inventory) {
        const fgMatIds = new Set();
        Object.keys(FORGE_RECIPES).forEach(rid => {
          const r = FORGE_RECIPES[rid];
          if (r && r.ingredients) r.ingredients.forEach(i => fgMatIds.add(i.id));
        });
        hasForgeMat = G.player.inventory.some(it => fgMatIds.has(it.id));
      }
    } catch(e) {}
    if (hasAnyForge || hasForgeMat || forgeScenes.includes(G.currentScene)) {
      actions.push({ text:'🔨 炼器', action:'forge' });
    }
  }

  // ── 悟道图录 ──
  if (typeof showEnlightenGuide === 'function') {
    actions.push({ text:'🌌 悟道', action:'enlighten' });
  }

  // ── 灵兽 ──
  if (typeof showBeastPanel === 'function') {
    actions.push({ text:'🐾 灵兽', action:'beast' });
  }

  // ── 🔮 本命法宝（金丹期）──
  if (typeof openBenmingPanel === 'function') {
    const bmUnlocked = G.player.benming && G.player.benming.unlocked;
    if (bmUnlocked) {
      actions.push({ text:'🔮 本命法宝', action:'benming' });
    } else if (G.player.qiRealmIndex >= 9) {
      // 筑基以上可见入口（未解锁则提示金丹）
      actions.push({ text:'🔮 本命法宝（金丹解锁）', action:'benming' });
    }
  }

  // ── 🧠 神识探查（筑基期）──
  if (typeof showShensiPanel === 'function' && (G.player.qiRealmIndex >= 9)) {
    actions.push({ text:'🧠 神识探查', action:'shensi' });
  }

  // ── 因果业力 ──
  if (typeof showKarmaPanel === 'function') {
    actions.push({ text:'☯️ 因果', action:'karma' });
  }

  // ── 名声 ──
  if (typeof showFamePanel === 'function') {
    actions.push({ text:'🌟 名声', action:'fame' });
  }

  // ── 时令 ──
  if (typeof showSeasonPanel === 'function') {
    actions.push({ text:'🍂 时令', action:'season' });
  }

  // ── 问道：修行指引 ──
  if (typeof showAskDaoPanel === 'function') {
    actions.push({ text:'🧭 问道', action:'askdao' });
  }

  // ── 移动 ──
  const connections = getConnections();
  connections.forEach(conn => {
    if (conn && conn.id !== G.currentScene) {
      const icon = conn.safe ? '🏘️' : conn.type === 'dungeon' ? '🕳️' : '🌲';
      // 🔧 2026-08-05：冰阁弟子视角相邻场景名显示「冰阁·山门」
      const nm = typeof getSceneDisplayName === 'function' ? getSceneDisplayName(conn.id) : conn.name;
      actions.push({ text:`${icon} → ${nm}`, action:'move', sceneId:conn.id });
    }
  });

  list.innerHTML = actions.map(a => {
    // 🔧 2026-08-05：冰阁禁地移动项走门槛检查（冰阁弟子未达元婴）
    let moveOnclick = `mapMove('${a.sceneId}')`;
    if (a.action === 'move' && a.sceneId === 'bingfeng_grotto' && typeof isSectMember === 'function' && isSectMember()) {
      moveOnclick = `worldMapForbiddenMove('${a.sceneId}')`;
    }
    const onclick = a.action === 'move' ? moveOnclick 
      : a.action === 'combat' ? 'combatAction()'
      : a.action === 'market' ? 'marketAction()'
      : a.action === 'gossip' ? 'gossipAction()'
      : a.action === 'npc' ? 'npcAction()'
      : a.action === 'friends' ? 'openFriendList()'
      : a.action === 'create' ? 'createAction()'
      : a.action === 'poi' ? 'openPOIModal()' 
      : a.action === 'perceive' ? 'perceive()'
      : a.action === 'speak' ? 'openSpeakModal()'
      : a.action === 'examine' ? 'openExamineModal()'
      : a.action === 'dao' ? 'openDaoModal()'
      : a.action === 'repent' ? 'repent()'
      : a.action === 'recall' ? 'recall()'
      : a.action === 'quest' ? 'showQuestPanel()'
      : a.action === 'realm' ? 'showSecretRealmModal()'
      : a.action === 'worldmap' ? (typeof showWorldMap === 'function' ? 'showWorldMap()' : '')
      : a.action === 'alchemy' ? 'showAlchemyPanel()'
      : a.action === 'forge' ? 'showForgePanel()'
      : a.action === 'enlighten' ? 'showEnlightenGuide()'
      : a.action === 'beast' ? 'showBeastPanel()'
      : a.action === 'benming' ? 'openBenmingPanel()'
      : a.action === 'shensi' ? 'showShensiPanel()'
      : a.action === 'karma' ? 'showKarmaPanel()'
      : a.action === 'fame' ? 'showFamePanel()'
      : a.action === 'season' ? 'showSeasonPanel()'
      : a.action === 'askdao' ? 'showAskDaoPanel()'
      : a.action === 'tower' ? (typeof showTowerModal === 'function' ? 'showTowerModal()' : '')
      : a.action === 'tower_hint' ? 'showTowerHint()'
      : a.action === 'storylog' ? 'showStoryLogPanel()'
      : a.action === 'charpanel' ? 'showCharacterPanel()'
      : a.action === 'sect' ? (typeof showSectMap === 'function' ? 'showSectMap()' : '')
      : '';
    return `<button class="action-btn" onclick="${onclick}">${a.text}</button>`;
  }).join('');
}

function updateBottomBar() {
  const h = G.time.hour;
  const year = G.time.year || 1;
  document.getElementById('timer-display').textContent = `${G.time.period}时 · 第${G.time.day}日 · 纪元${year}年`;
  const scene = getSceneData(G.currentScene);
  document.getElementById('location-display').textContent = `${getCurrentRegionName()} · ${scene ? scene.name : '未知'}`;
  // 💌 千里传情：仙子初遇（stage>=1）后常驻入口，随时聊天不用去冰棺
  const btn = document.getElementById('btn-ice-chat');
  if (btn) {
    let canChat = false;
    try {
      const f = (typeof getIceFairy === 'function') ? getIceFairy() : null;
      canChat = !!(f && (f.stage || 0) >= 1);
    } catch(e) {}
    btn.style.display = canChat ? 'inline-block' : 'none';
  }
}

// ── 场景NPC常驻面板 ──
function updateSceneNPCs() {
  const list = document.getElementById('scene-npcs-list');
  const title = document.getElementById('scene-npcs-title');
  if (!list) return;
  
  const npcs = (typeof npcManager !== 'undefined' && npcManager) 
    ? npcManager.getNPCsForScene(G.currentScene).filter(n => n.isAlive !== false)
    : [];
  
  if (npcs.length === 0) {
    list.innerHTML = '<span style="color:var(--text-dim);font-size:11px;">附近无人</span>';
    if (title) title.textContent = '👥 附近的人';
    return;
  }
  
  if (title) title.textContent = `👥 附近的人（${npcs.length}）`;
  
  list.innerHTML = npcs.map(n => {
    // 保证生命周期
    if (typeof extendNPCWithLifecycle === 'function' && !n._hasLifecycle) {
      extendNPCWithLifecycle(n);
    }
    
    const genderIcon = n.gender === '男' ? '👤' : '👩';
    const realmLabel = getNPCRealmLabel(n);
    const affIcon = n.affinity > 50 ? '❤️' : n.affinity > 20 ? '💛' : '🤝';
    const daoMark = n.daoPartnerId === 'player' ? '🌸' : '';
    const liveMark = n.isAlive === false ? '💀' : '';
    const ageText = n._hasLifecycle ? `${Math.round(n.trueAge||16)}岁` : '';
    const desireHint = n.desire ? n.desire.slice(0,10) + '…' : '';
    
    return `<div class="scene-npc-item" onclick="openFreeChat(npcManager.npcs.find(n=>n.id==='${n.id}'))" title="${n.desire || ''}">
      <div class="scene-npc-line1">
        <span>${liveMark}${genderIcon} <b>${n.name}</b>${daoMark}${affIcon}</span>
        <span style="font-size:10px;color:var(--text-dim)">${realmLabel}</span>
      </div>
      <div class="scene-npc-line2">
        <span style="font-size:10px;color:var(--text-dim)">${n.personality} · ${n.role}</span>
        ${desireHint ? `<span style="font-size:10px;color:var(--text-dim);font-style:italic">${desireHint}</span>` : ''}
      </div>
    </div>`;
  }).join('');
}

function marketAction() { showMarketModal(); }
function npcAction() { showNPCList(G.currentScene); }
function createAction() { openSkillCreation(); }

// ── 喊话弹窗 ──
function openSpeakModal() {
  document.getElementById('speak-overlay').classList.remove('hidden');
  document.getElementById('speak-input').value = '';
  setTimeout(() => document.getElementById('speak-input').focus(), 100);
}
function closeSpeakModal() { document.getElementById('speak-overlay').classList.add('hidden'); }
function submitSpeak() {
  const text = document.getElementById('speak-input').value.trim();
  if (!text) return;
  closeSpeakModal();
  speak(text);
}

// ── 任务面板弹窗 ──
function showQuestPanel() {
  const available = (typeof getAvailableQuests === 'function') ? getAvailableQuests() : [];
  const active = (typeof getActiveQuests === 'function') ? getActiveQuests() : [];
  const db = typeof QUEST_DB !== 'undefined' ? QUEST_DB : [];
  
  let html = '';
  
  // 🧊 仙子委托（百里冰的请求，独立于普通任务）
  if (typeof getIceFairyRequest === 'function') {
    const ireq = getIceFairyRequest();
    if (ireq) {
      const owned = (typeof iceRequestOwnedCount === 'function') ? iceRequestOwnedCount(ireq) : 0;
      // 物品名 + 场景名
      let sceneName = '';
      const sceneItem = (typeof ICE_FAIRY_ITEMS !== 'undefined') ? ICE_FAIRY_ITEMS.find(it => it.id === ireq.itemId) : null;
      if (sceneItem) {
        const sd = (typeof getSceneData === 'function') ? getSceneData(sceneItem.scene) : null;
        if (sd && sd.name) sceneName = sd.name;
        else if (typeof SCENES !== 'undefined' && SCENES.find) {
          const s2 = SCENES.find(s => s.id === sceneItem.scene);
          if (s2 && s2.name) sceneName = s2.name;
        } else sceneName = sceneItem.scene;
      } else if (ireq.hintScene) {
        // 🔧 非解封材料委托：用 hintScene 显示推荐场景名
        const sd3 = (typeof getSceneData === 'function') ? getSceneData(ireq.hintScene) : null;
        if (sd3 && sd3.name) sceneName = sd3.name;
        else if (typeof SCENES !== 'undefined' && SCENES.find) {
          const s3 = SCENES.find(s => s.id === ireq.hintScene);
          if (s3 && s3.name) sceneName = s3.name;
        } else sceneName = ireq.hintScene;
      }
      const hintLine = ireq.hintText ? ireq.hintText : '';
      const rewardLine = [];
      if (ireq.reward) {
        if (ireq.reward.fate) rewardLine.push('☯️缘分+' + ireq.reward.fate);
        if (ireq.reward.affinity) rewardLine.push('💗羁绊+' + ireq.reward.affinity);
        if (ireq.reward.exp) rewardLine.push('📖修为+' + ireq.reward.exp);
        if (ireq.reward.stones) rewardLine.push('💰灵石+' + ireq.reward.stones);
      }
      const done = owned >= ireq.qty;
      html += '<p style="font-weight:bold;margin-bottom:6px;">🧊 仙子委托</p>';
      html += `<div style="border:1px solid rgba(140,180,230,0.35);border-radius:6px;padding:8px;margin-bottom:6px;background:linear-gradient(135deg,rgba(70,110,170,0.12),rgba(40,70,130,0.08));">
        <div style="font-weight:bold;font-size:13px;color:#a8c8e8;">❄️ ${ireq.itemName}×${ireq.qty}</div>
        <div style="font-size:11px;color:var(--text-dim);margin:4px 0;">“${ireq.requestText}”</div>
        <div style="font-size:10px;color:${done ? '#6a9ec9' : '#e8c878'};">${done ? '✅ 已集齐 ' + owned + '/' + ireq.qty + '，点「📦 献物」交给她' : '📦 已寻得 ' + owned + '/' + ireq.qty + '，还差 <b style="color:#ff6b6b;">' + (ireq.qty - owned) + '</b> 个' + (sceneName ? ' · 出处：' + sceneName : '')}</div>
        ${hintLine ? '<div style="font-size:10px;color:#8fbf8f;margin-top:2px;">📍 ' + hintLine + '</div>' : ''}
        <div style="font-size:10px;color:var(--accent);margin-top:2px;">🏆 ${rewardLine.join(' · ') || '缘分与羁绊'}</div>
        <div style="margin-top:4px;display:flex;gap:6px;">` +
        (done
          ? `<button onclick="iceFairySubmitRequest();showQuestPanel();" style="font-size:11px;padding:4px 12px;border-radius:6px;border:1px solid rgba(200,160,80,0.4);background:rgba(120,90,40,0.3);color:#e8c878;cursor:pointer;font-family:inherit;">📦 献物</button>`
          : `<button onclick="showIceFairyChatModal();" style="font-size:10px;padding:3px 8px;border-radius:5px;border:1px solid rgba(140,180,230,0.3);background:rgba(70,110,170,0.15);color:#a8c8e8;cursor:pointer;font-family:inherit;">💬 去找她</button>`) +
        `</div>
      </div>`;
    } else {
      html += '<p style="font-weight:bold;margin-bottom:6px;">🧊 仙子委托</p>';
      html += '<div style="font-size:11px;color:var(--text-dim);padding:6px 8px;border:1px dashed rgba(140,180,230,0.2);border-radius:6px;margin-bottom:6px;">她暂时没有委托你的事。多与她聊聊，她偶尔会想让你寻些东西。</div>';
    }
    // 🔧 2026-08-03：仙子委托图鉴——查看 8 种委托的完成进度（拿全没）
    try {
      const f = (typeof getIceFairy === 'function') ? getIceFairy() : null;
      const affinity = f ? (f.affinity || 0) : 0;
      const doneIds = {};
      if (f && f._iceRequests) f._iceRequests.forEach(function(r) { if (r.done) doneIds[r.id] = true; });
      const reqPool = (typeof ICE_FAIRY_REQUESTS !== 'undefined') ? ICE_FAIRY_REQUESTS : [];
      if (reqPool.length > 0) {
        const doneCount = reqPool.filter(function(r) { return doneIds[r.id]; }).length;
        html += '<div style="font-size:10px;color:var(--text-dim);margin:4px 0 4px 0;">📖 委托图鉴：<b style="color:#a8c8e8;">' + doneCount + '/' + reqPool.length + '</b> 种已达成' +
          (doneCount >= reqPool.length ? ' <span style="color:#7dce9a;">✨ 已拿全！</span>' : '') + '</div>';
        html += '<div style="display:flex;flex-wrap:wrap;gap:3px;margin-bottom:6px;">';
        reqPool.forEach(function(r) {
          const isDone = doneIds[r.id];
          const unlocked = affinity >= (r.affinityReq || 0);
          let st = '';
          if (isDone) st = '<span style="color:#7dce9a;">✅</span>';
          else if (!unlocked) st = '<span style="color:#555;">🔒</span>';
          else st = '<span style="color:#e8c878;">📜</span>';
          html += '<span style="font-size:10px;padding:2px 6px;border-radius:10px;border:1px solid ' + (isDone ? 'rgba(125,206,154,0.4)' : 'rgba(255,255,255,0.12)') + ';color:' + (isDone ? '#7dce9a' : 'var(--text-dim)') + ';" title="' + r.itemName + (isDone ? '（已完成）' : !unlocked ? '（需羁绊' + r.affinityReq + '解锁）' : '（可接）') + '">' + st + ' ' + r.itemName + '</span>';
        });
        html += '</div>';
      }
    } catch(e) {}
  }
  
  // 活跃任务
  if (active.length > 0) {
    html += '<p style="font-weight:bold;margin-bottom:6px;">📋 进行中</p>';
    active.forEach(aq => {
      const q = db.find(dq => dq.id === aq.id);
      if (!q) return;
      html += `<div style="border:1px solid rgba(106,158,201,0.3);border-radius:6px;padding:8px;margin-bottom:6px;background:rgba(106,158,201,0.05);">
        <div style="font-weight:bold;font-size:13px;">📌 ${q.name}</div>
        <div style="font-size:11px;color:var(--text-dim);margin:4px 0;">${q.desc}</div>
        <div style="font-size:10px;color:var(--accent);">🏆 ${typeof questRewardSummary === 'function' ? questRewardSummary(q) : ''}</div>
      </div>`;
    });
  }
  
  // 可接任务
  if (available.length > 0) {
    html += '<p style="font-weight:bold;margin-bottom:6px;margin-top:10px;">📬 可接委托</p>';
    available.forEach(q => {
      html += `<div style="border:1px solid rgba(255,255,255,0.1);border-radius:6px;padding:8px;margin-bottom:6px;cursor:pointer;" onclick="acceptQuest('${q.id}');showQuestPanel();">
        <div style="font-weight:bold;font-size:13px;">📋 ${q.name}</div>
        <div style="font-size:11px;color:var(--text-dim);margin:4px 0;">${q.desc}</div>
        <div style="font-size:10px;color:var(--accent);">🏆 ${typeof questRewardSummary === 'function' ? questRewardSummary(q) : ''}</div>
        <div style="font-size:10px;color:#8a7a5a;">来源：${q.giver}</div>
      </div>`;
    });
  }
  
  if (!html) {
    html = '<p style="color:var(--text-dim);text-align:center;">暂无任务</p>';
  }
  
  showCustomModal('📋 任务面板', html + `<button class="event-choice-btn" onclick="closeEvent()">关闭</button>`);
}

// ── 战斗按钮 ──
function combatAction() { if (typeof startAutoCombat === 'function') startAutoCombat(); }

// ── 论道弹窗 ──
function openDaoModal() {
  document.getElementById('dao-overlay').classList.remove('hidden');
  document.getElementById('dao-input').value = '';
  setTimeout(() => document.getElementById('dao-input').focus(), 100);
}
function closeDaoModal() { document.getElementById('dao-overlay').classList.add('hidden'); }
function submitDao() {
  const text = document.getElementById('dao-input').value.trim();
  if (!text) return;
  closeDaoModal();
  confessDao(text);
}

// ── 审视弹窗 ──
function openExamineModal() {
  const scene = getSceneData(G.currentScene);
  if (!scene) return;
  
  let html = '<p style="margin-bottom:8px;">审视什么？</p>';
  html += '<button class="event-choice-btn" onclick="examineScene()">🌍 审视场景</button>';
  
  // 可审视背包中的物品
  if (G.player.inventory.length > 0) {
    html += '<p style="margin-top:8px;margin-bottom:4px;font-size:12px;color:var(--text-dim);">背包中的物品：</p>';
    G.player.inventory.slice(0, 6).forEach(i => {
      html += `<button class="event-choice-btn" onclick="examineItem('${i.id}')">📦 ${i.name}</button>`;
    });
  }
  
  // NPC
  const npcs = npcManager.getNPCsForScene(G.currentScene);
  if (npcs.length > 0) {
    html += '<p style="margin-top:8px;margin-bottom:4px;font-size:12px;color:var(--text-dim);">附近的人：</p>';
    npcs.slice(0, 3).forEach(n => {
      html += `<button class="event-choice-btn" onclick="examineNPC('${n.id}')">👤 ${n.name}</button>`;
    });
  }
  
  // 地面物品
  const ground = G.groundItems[G.currentScene] || [];
  if (ground.length > 0) {
    html += '<p style="margin-top:8px;margin-bottom:4px;font-size:12px;color:var(--text-dim);">地面物品：</p>';
    ground.slice(0, 3).forEach(i => {
      html += `<button class="event-choice-btn" onclick="examineGround('${i.id}')">⬇️ ${i.name}</button>`;
    });
  }
  
  html += '<button class="event-choice-btn" onclick="closeEvent()" style="margin-top:6px;">🚶 离开</button>';
  showCustomModal('📖 审视', html);
}
function examineScene() { closeEvent(); examine('scene', G.currentScene); }
function examineItem(id) { closeEvent(); examine('item', id); }
function examineNPC(id) { closeEvent(); examine('npc', id); }
function examineGround(id) { closeEvent(); examine('item', id); }

function gossipAction() {
  G.player.qi = Math.max(0, G.player.qi - 3);
  advanceTime(0.5);
  const rumors = [
    '听说黑风岭最近不太平，有山贼出没。',
    '落霞森林深处有修士见到了异光。',
    '碧波湖的渔夫说，昨夜湖心出现了奇异的光芒。',
    '雷音古刹的废墟中，好像有人听到了诵经声……',
    '最近灵气潮汐涌动，修炼起来似乎格外顺畅。',
  ];
  const rumor = rumors[Math.floor(Math.random() * rumors.length)];
  addNarrative(`你找人打听了一番：${rumor}`, 'default');
  G.player.eventHistory.push(`打听到：${rumor}`);
  updateAllUI();
}

// ==========================
// 场景
// ==========================
function updateSceneDisplay() {
  const scene = getSceneData(G.currentScene);
  if (!scene) return;
  // 🔧 2026-08-05：第二纪元冰阁弟子视角显示「冰阁·山门」
  document.getElementById('scene-title').textContent = typeof getSceneDisplayName === 'function' ? getSceneDisplayName(G.currentScene) : scene.name;
  document.getElementById('scene-desc').textContent = typeof getSceneDisplayDesc === 'function' ? getSceneDisplayDesc(G.currentScene) : scene.description;
}

// 🗺️ 超级世界地图（整合：地图·全览·域志·奇观·纪事）
// ==========================
if (typeof G._mapDomainFilter === 'undefined') G._mapDomainFilter = null;
if (typeof G._mapView === 'undefined') G._mapView = 'map';

function showWorldMap() {
  document.getElementById('worldmap-overlay').classList.remove('hidden');
  var viewNames = { map:'地图', overview:'全览', lore:'域志', wonders:'奇观', chronicles:'纪事' };
  var sub = document.getElementById('map-domain-subtitle');
  if (sub) sub.textContent = ' · ' + (viewNames[G._mapView] || '地图') + (G._mapDomainFilter ? ' · 筛选域' : '');
  renderWorldMap('worldmap-content');
  updateWorldMapLocation();
}

function closeWorldMap() {
  document.getElementById('worldmap-overlay').classList.add('hidden');
}

function updateWorldMapLocation() {
  var el = document.getElementById('map-current-location');
  if (!el) return;
  var sc = typeof getSceneData === 'function' ? getSceneData(G.currentScene) : null;
  if (sc) {
    var dn = typeof COSMOS_DOMAIN_NAMES !== 'undefined' && sc.cosmosDomain
      ? (COSMOS_DOMAIN_NAMES[sc.cosmosDomain] || sc.cosmosDomain) : '';
    // 🔧 2026-08-05：冰阁弟子视角显示「冰阁·山门」
    var nm = typeof getSceneDisplayName === 'function' ? getSceneDisplayName(G.currentScene) : sc.name;
    el.textContent = '📍 ' + nm + (dn ? ' · ' + dn : '');
  } else {
    el.textContent = '';
  }
}

/* ── 视图标签渲染 ── */
function _renderMapViewTabs() {
  var tabs = [
    { id:'map', label:'🗺️ 地图', desc:'节点地图' },
    { id:'overview', label:'📋 全览', desc:'场景列表+战力推荐' },
    { id:'lore', label:'📖 域志', desc:'九域设定·世界观' },
    { id:'wonders', label:'🏛️ 奇观', desc:'天下奇景' },
    { id:'chronicles', label:'📜 纪事', desc:'纪元大事记' },
  ];
  var h = '<div style="margin-bottom:8px;display:flex;gap:3px;flex-wrap:wrap;align-items:center;border-bottom:1px solid rgba(255,255,255,0.06);padding-bottom:6px;">';
  tabs.forEach(function(t) {
    var sel = G._mapView === t.id;
    var c = sel ? 'var(--accent)' : 'var(--text-dim)';
    var bg = sel ? 'rgba(201,169,110,0.12)' : 'rgba(255,255,255,0.03)';
    var bc = sel ? '1px solid var(--accent)' : '1px solid rgba(255,255,255,0.06)';
    var fw = sel ? 'bold' : 'normal';
    h += '<span onclick="var vn={map:\'地图\',overview:\'全览\',lore:\'域志\',wonders:\'奇观\',chronicles:\'纪事\'};G._mapView=\'' + t.id + '\';var el=document.getElementById(\'map-domain-subtitle\');if(el)el.textContent=\' · \'+vn[G._mapView]+(G._mapDomainFilter?\' · 筛选域\':\'\');renderWorldMap(\'worldmap-content\');" style="padding:4px 10px;border-radius:6px;cursor:pointer;font-size:11px;transition:all 0.2s;border:' + bc + ';background:' + bg + ';color:' + c + ';font-weight:' + fw + ';">' + t.label + '</span>';
  });
  h += '</div>';
  return h;
}

/* ── 域导航栏 ── */
function _renderDomainNavBar(sceneCount) {
  var domainColors = {};
  if (typeof XUANHUANG_COSMOS !== 'undefined' && XUANHUANG_COSMOS.domains) {
    XUANHUANG_COSMOS.domains.forEach(function(d) { domainColors[d.id] = d.accentColor; });
  }
  var h = '<div style="margin-bottom:8px;display:flex;gap:4px;flex-wrap:wrap;align-items:center;">'
    + '<span onclick="G._mapDomainFilter=null;renderWorldMap(\'worldmap-content\')" style="padding:4px 12px;border-radius:16px;cursor:pointer;font-size:11px;transition:all 0.2s;border:1px solid ' + (G._mapDomainFilter === null ? 'var(--accent)' : 'rgba(255,255,255,0.1)') + ';background:' + (G._mapDomainFilter === null ? 'var(--accent)22' : 'rgba(255,255,255,0.03)') + ';color:' + (G._mapDomainFilter === null ? 'var(--accent)' : 'var(--text-dim)') + ';font-weight:' + (G._mapDomainFilter === null ? 'bold' : 'normal') + ';">🌏 界</span>';
  if (typeof XUANHUANG_COSMOS !== 'undefined' && XUANHUANG_COSMOS.domains) {
    XUANHUANG_COSMOS.domains.forEach(function(d) {
      if (!sceneCount[d.id]) return;
      var _sel = G._mapDomainFilter === d.id;
      var c = domainColors[d.id] || '#666';
      h += '<span onclick="G._mapDomainFilter=\'' + d.id + '\';renderWorldMap(\'worldmap-content\')" style="padding:4px 12px;border-radius:16px;cursor:pointer;font-size:11px;transition:all 0.2s;border:1px solid ' + (_sel ? c : c + '44') + ';background:' + (_sel ? c + '33' : 'rgba(255,255,255,0.03)') + ';color:' + (_sel ? '#ffd700' : 'var(--text)') + ';font-weight:' + (_sel ? 'bold' : 'normal') + ';">' + d.emoji + ' ' + d.name + '</span>';
    });
  }
  h += '</div>';
  return h;
}

/* ── 域详情条（选中域时） ── */
function _renderDomainDetailBar() {
  if (!G._mapDomainFilter || typeof XUANHUANG_COSMOS === 'undefined') return '';
  var dd = XUANHUANG_COSMOS.domains.find(function(d){ return d.id === G._mapDomainFilter; });
  if (!dd) return '';
  var acc = typeof checkDomainAccess === 'function' ? checkDomainAccess(dd.id) : null;
  var canEnter = acc ? acc.pass : false;
  var h = '<div style="margin-bottom:8px;padding:6px 12px;border-radius:8px;background:rgba(0,0,0,0.15);display:flex;align-items:center;gap:10px;font-size:10px;">'
    + '<span style="font-size:20px;">' + dd.emoji + '</span>'
    + '<div style="flex:1;"><span style="font-weight:bold;color:' + dd.accentColor + ';">' + dd.name + '</span>'
    + '<span style="color:var(--text-dim);margin-left:6px;">' + dd.title + '</span>'
    + '<div style="font-size:9px;color:var(--text-dim);margin-top:2px;">' + dd.lore.substring(0, 60) + '…</div></div>'
    + '<div style="text-align:right;font-size:9px;">'
    + '<div>⚔️ <span style="color:' + (dd.danger === '低' ? '#8bc34a' : dd.danger === '中等' ? '#ffc107' : '#ff5722') + ';">' + dd.danger + '</span></div>'
    + '<div>🌊 ⭐' + dd.qiLevel + '</div>'
    + (canEnter ? '<div style="color:#8bc34a;">✓ 可前往</div>' : '<div style="color:#e74c3c;">🔒 需突破</div>')
    + '</div></div>';
  return h;
}

/* ── 战力匹配标签 ── */
function _powerLabel(scene, playerRealm) {
  var diff = playerRealm - (scene.qiLevel || 3);
  if (scene.safe) return { label:'🏘️', color:'#8bc34a', tip:'安全区' };
  if (diff >= 3) return { label:'⬇️', color:'rgba(255,255,255,0.3)', tip:'太弱·经验惩罚' };
  if (diff >= 1) return { label:'✅', color:'#8bc34a', tip:'轻松碾压' };
  if (diff === 0) return { label:'⚡', color:'var(--accent)', tip:'同级·最佳' };
  if (diff === -1) return { label:'🔥', color:'#ff9800', tip:'越级·奖励提升' };
  return { label:'💀', color:'#e74c3c', tip:'高风险·慎入' };
}

/* ════════════════════════════════════════════
   使用地图的全部数据，通过活动按钮列表来替代之前
   散落的“地图”、“刷图指南”、“玄黄图”等功能
   ════════════════════════════════════════════ */
function renderWorldMap(containerId) {
  var container = document.getElementById(containerId);
  if (!container) return;
  if (!G.worldData || !G.worldData.layers || !G.worldData.layers[0]) {
    container.innerHTML = '<p style="color:var(--text-dim);padding:16px;">地图数据缺失</p>';
    return;
  }
  
  var sceneMap = {};
  G.worldData.layers.forEach(function(l) { l.scenes.forEach(function(s) { sceneMap[s.id] = s; }); });
  var layer = G.worldData.layers[0];
  var playerRealm = (G.player && G.player.qiRealmIndex) || 3;
  
  // 统计各域场景数
  var domainSceneCount = {};
  layer.scenes.forEach(function(s) {
    var d = s.cosmosDomain || 'unknown';
    if (!domainSceneCount[d]) domainSceneCount[d] = 0;
    domainSceneCount[d]++;
  });
  
  var html = '';
  
  // ── 域导航 ──
  html += _renderDomainNavBar(domainSceneCount);
  
  // ── 域详情条 ──
  if (G._mapDomainFilter) html += _renderDomainDetailBar();
  
  // ── 视图标签 ──
  html += _renderMapViewTabs();
  
  // ── 当前视图内容 ──
  if (G._mapView === 'map') {
    html += _renderMapView(layer, sceneMap, playerRealm);
  } else if (G._mapView === 'overview') {
    html += _renderOverviewView(layer, sceneMap, playerRealm);
  } else if (G._mapView === 'lore') {
    html += _renderLoreView();
  } else if (G._mapView === 'wonders') {
    html += _renderWondersView();
  } else if (G._mapView === 'chronicles') {
    html += _renderChroniclesView();
  }
  
  html += '<div style="text-align:center;margin-top:12px;"><button class="event-choice-btn" onclick="closeWorldMap()" style="font-size:10px;background:rgba(100,100,100,0.2);">关闭地图</button></div>';
  
  container.innerHTML = html;
  container.style.overflowX = 'auto';
}

/* ═══════════ 视图：节点地图 ═══════════ */
function _renderMapView(layer, sceneMap, playerRealm) {
  var domainColors = {};
  var fallbackDomainColors = { donghuang:'#7aad5a', nanji:'#6a9ec9', ximo:'#d4a045', beiji:'#5ac9c9', zhongzhou:'#c97a5a', donghai:'#5a7ac9', tianyu:'#c95a5a', youyu:'#9a6ac9', xuwu:'#666' };
  if (typeof XUANHUANG_COSMOS !== 'undefined' && XUANHUANG_COSMOS.domains) {
    XUANHUANG_COSMOS.domains.forEach(function(d) { domainColors[d.id] = d.accentColor; });
  }
  
  const cellW = 110, cellH = 90, padX = 50, padY = 30;
  const svgW = layer.gridW * cellW + padX * 2;
  const svgH = layer.gridH * cellH + padY * 2;
  
  const nodePos = {};
  layer.scenes.forEach(function(s) { nodePos[s.id] = { x: padX + s.x * cellW + cellW / 2, y: padY + s.y * cellH + cellH / 2 }; });
  
  // 过滤
  var filt = layer.scenes;
  if (G._mapDomainFilter) filt = layer.scenes.filter(function(s){ return s.cosmosDomain === G._mapDomainFilter; });
  var filtIds = {};
  filt.forEach(function(s){ filtIds[s.id] = true; });
  
  // 连线
  var lines = '';
  var drawn = {};
  filt.forEach(function(s) {
    (s.connections || []).forEach(function(cId) {
      var key = [s.id, cId].sort().join('_');
      if (drawn[key]) return;
      drawn[key] = true;
      var t = nodePos[cId];
      if (!t) return;
      var sp = nodePos[s.id];
      if (G._mapDomainFilter && (!filtIds[s.id] || !filtIds[cId])) return;
      var isActive = s.id === G.currentScene || cId === G.currentScene;
      lines += '<line x1="' + sp.x + '" y1="' + sp.y + '" x2="' + t.x + '" y2="' + t.y + '" '
        + 'stroke="' + (isActive ? 'rgba(201,169,110,0.55)' : 'rgba(255,255,255,0.25)') + '" '
        + 'stroke-width="' + (isActive ? 2 : 1.2) + '" stroke-dasharray="' + (isActive ? 'none' : '3,3') + '" />';
    });
  });
  
  // 节点
  var typeEmoji = { 'town':'🏘\ufe0f','dungeon':'🕳\ufe0f','mountain':'🏔\ufe0f','garden':'🌿','swamp':'💀','ruins':'🏛\ufe0f','cave':'🕳\ufe0f','wild':'🌲' };
  var nodesHtml = '';
  filt.forEach(function(scene) {
    var isCur = scene.id === G.currentScene;
    var isConn = layer.scenes.some(function(s){ return s.id === G.currentScene && s.connections && s.connections.indexOf(scene.id) !== -1; });
    var pos = nodePos[scene.id];
    var emoji = typeEmoji[scene.type] || '🌲';
    var color = isCur ? 'var(--accent)' : isConn ? 'rgba(201,169,110,0.7)' : 'rgba(255,255,255,0.4)';
    
    // ── 探索/未探索区分 ──
    var isExplored = G.visitedScenes && G.visitedScenes.indexOf(scene.id) !== -1;
    
    var dc = color;
    if (!isCur && scene.cosmosDomain) {
      var cd = domainColors[scene.cosmosDomain] || fallbackDomainColors[scene.cosmosDomain] || null;
      if (cd) dc = cd;
    }
    
    var isRec = typeof findRecommendedScene === 'function' && scene.id === findRecommendedScene();
    
    var threatStr = '';
    var exploredBadge = '';
    
    if (isExplored) {
      // 已探索：显示完整信息
      exploredBadge = '<div style="position:absolute;top:-6px;left:-6px;font-size:10px;color:#8bc34a;filter:drop-shadow(0 0 3px rgba(139,195,74,0.4));">✅</div>';
      if (typeof getSceneThreatData === 'function') {
        var td = getSceneThreatData(scene.id);
        if (td && td.monsters && td.monsters.length > 0) {
          var barFull = '■', barEmpty = '□';
          var barColor = td.threat <= 2 ? '#8bc34a' : td.threat <= 3 ? '#ff9800' : '#e74c3c';
          var bars = '';
          for (var bi = 0; bi < 5; bi++) bars += bi < td.threat ? '<span style="color:' + barColor + ';">' + barFull + '</span>' : '<span style="color:rgba(255,255,255,0.45);">' + barEmpty + '</span>';
          threatStr = '<div style="font-size:9px;margin-top:1px;white-space:nowrap;">' + bars + ' <span style="color:var(--text-dim);font-size:9px;">' + td.monsters.length + '种</span></div>';
          if (td.boss) threatStr += '<div style="font-size:9px;color:#e74c3c;font-weight:bold;">👑 BOSS</div>';
          if (td.hasSkillDrop) threatStr += '<div style="font-size:8px;color:#c9a96e;">📜 功法</div>';
        } else {
          threatStr = '<div style="font-size:9px;color:rgba(255,255,255,0.2);margin-top:2px;">安全</div>';
        }
      }
    } else {
      // 未探索：朦胧神秘感
      dc = 'rgba(255,255,255,0.15)';  // 暗色
      threatStr = '<div style="font-size:9px;color:rgba(255,255,255,0.15);margin-top:2px;">❓ 未知</div>';
    }
    
    // 战力标签
    var powerLbl = '';
    if (isExplored && scene.monsters && scene.monsters.length > 0) {
      var pl = _powerLabel(scene, playerRealm);
      powerLbl = '<span style="font-size:8px;color:' + pl.color + ';margin-left:1px;">' + pl.label + '</span>';
    } else if (!isExplored) {
      powerLbl = '<span style="font-size:8px;color:rgba(255,255,255,0.15);">❓</span>';
    }
    
    // 点击处理：已探索 → 弹详情  未探索 → 直接前往
    // 🔧 2026-08-05：冰阁禁地（冰风石窟）世界地图点击走禁地门槛检查
    var clickAction = isExplored && !isCur
      ? 'showSceneDetail(\'' + scene.id + '\')'
      : 'mapMove(\'' + scene.id + '\')';
    if (scene.id === 'bingfeng_grotto' && typeof isSectMember === 'function' && isSectMember()) {
      clickAction = isExplored && !isCur
        ? 'showSceneDetail(\'' + scene.id + '\')'
        : 'worldMapForbiddenMove(\'' + scene.id + '\')';
    }
    
    var nodeOpacity = isExplored ? '1' : '0.5';
    
    nodesHtml += '<div class="map-node' + (isCur ? ' curr' : '') + (isConn ? ' conn' : '') + '" '
      + 'onclick="' + clickAction + '" '
      + 'style="left:' + pos.x + 'px;top:' + pos.y + 'px;transform:translate(-50%,-50%);'
      + 'opacity:' + nodeOpacity + ';'
      + 'border-color:' + dc + ';color:' + (isCur ? 'var(--accent)' : 'var(--text-dim)') + ';cursor:pointer;">'
      + '<div style="font-size:20px;">' + emoji + powerLbl + '</div>'
      + '<div style="font-size:12px;line-height:1.2;text-align:center;margin-top:2px;font-weight:bold;">' + (typeof getSceneDisplayName === 'function' ? getSceneDisplayName(scene.id) : scene.name) + '</div>'
      + '<div style="font-size:10px;color:rgba(255,255,255,0.5);margin-top:1px;">' + (typeof COSMOS_DOMAIN_NAMES !== 'undefined' ? (COSMOS_DOMAIN_NAMES[scene.cosmosDomain] || '') : '') + '</div>'
      + threatStr
      + (isCur ? '<div style="position:absolute;top:-8px;font-size:10px;color:var(--accent);">📍</div>' : '')
      + (isRec && !isCur ? '<div style="position:absolute;top:-10px;right:-10px;font-size:14px;filter:drop-shadow(0 0 4px rgba(255,215,0,0.6));">🌟</div>' : '')
      + exploredBadge
      + '</div>';
  });
  
  var html = '';
  html += '<div style="position:relative;width:' + svgW + 'px;height:' + svgH + 'px;margin:0 auto;">'
    + '<svg style="position:absolute;top:0;left:0;width:100%;height:100%;pointer-events:none;">' + lines + '</svg>'
    + nodesHtml
    + '</div>';
  
  // 图例
  html += '<div style="margin-top:8px;text-align:center;font-size:10px;color:var(--text-dim);">'
    + '🏘\ufe0f城镇 · 🌲野外 · 🏔\ufe0f灵峰 · 🕳\ufe0f秘境/石窟 · 🌿药园 · 💀沼泽 · 🏛\ufe0f遗迹'
    + '</div>';
  
  // 位置提示
  var curSc = sceneMap[G.currentScene];
  var hint = curSc ? '你立于「' + (typeof getSceneDisplayName === 'function' ? getSceneDisplayName(curSc.id) : curSc.name) + '」' : '你立于未知之处';
  if (curSc && curSc.cosmosDomain && typeof COSMOS_DOMAIN_NAMES !== 'undefined') {
    hint += ' · ' + (COSMOS_DOMAIN_NAMES[curSc.cosmosDomain] || curSc.cosmosDomain);
  }
  html += '<div style="margin-top:8px;padding:8px;background:rgba(0,0,0,0.2);border-radius:6px;font-size:10px;color:var(--text-dim);text-align:center;">' + hint + '</div>';
  
  // 分支导航
  html += _renderBranchNav(sceneMap);
  
  return html;
}

/* ═══════════ 分支导航 ═══════════ */
function _renderBranchNav(sceneMap) {
  var navHtml = '<div style="margin-top:16px;border-top:1px solid rgba(255,255,255,0.2);padding-top:12px;">';
  navHtml += '<div style="display:flex;align-items:center;gap:6px;margin-bottom:8px;"><span style="font-size:13px;color:var(--accent);">🌿 分支导航</span>';
  navHtml += '<span style="font-size:10px;color:var(--text-dim);">从「' + (sceneMap[G.currentScene]?.name || '当前') + '」出发</span></div>';
  
  var dists = {}; dists[G.currentScene] = 0;
  var queue2 = [G.currentScene];
  while (queue2.length > 0) {
    var cid = queue2.shift();
    var sc = sceneMap[cid];
    if (!sc || !sc.connections) continue;
    sc.connections.forEach(function(nid){
      if (dists[nid] === undefined && nid !== G.currentScene) {
        dists[nid] = (dists[cid] || 0) + 1;
        if (dists[nid] < 4) queue2.push(nid);
      }
    });
  }
  
  for (var di = 1; di <= 3; di++) {
    var nodes = [];
    for (var sid in dists) if (dists[sid] === di) nodes.push(sid);
    if (nodes.length === 0) continue;
    var dl = di === 1 ? '一箭之地' : di === 2 ? '两程之遥' : '三山之外';
    navHtml += '<div style="margin-bottom:4px;"><div style="font-size:10px;color:var(--text-dim);margin:4px 0;">━━ ' + dl + ' ━━</div><div style="display:flex;gap:3px;flex-wrap:wrap;">';
    nodes.forEach(function(id){
      var sc = sceneMap[id];
      if (!sc) return;
      var vi = G.visitedScenes && G.visitedScenes.indexOf(id) !== -1;
      var em = ({town:'🏘\ufe0f',dungeon:'🕳\ufe0f',mountain:'🏔\ufe0f',garden:'🌿',swamp:'💀',ruins:'🏛\ufe0f',cave:'🕳\ufe0f',wild:'🌲'})[sc.type]||'🌲';
      var dg = sc.monsters&&sc.monsters.length>0?'⚔\ufe0f':'';
      var exMark = vi ? '✅' : '❓';
      var navOnClick = vi ? 'showSceneDetail(\' + id + \')' : 'mapMove(\' + id + \')';
      navHtml += '<div onclick="' + navOnClick + '" style="padding:3px 6px;border-radius:5px;font-size:10px;cursor:pointer;border:1px solid '+(vi?'rgba(255,255,255,0.1)':'rgba(201,169,110,0.3)')+';background:'+(vi?'rgba(255,255,255,0.03)':'rgba(201,169,110,0.07)')+';color:'+(vi?'var(--text-dim)':'var(--text)')+';"><span>'+exMark+' '+em+sc.name+dg+'</span></div>';
    });
    navHtml += '</div></div>';
  }
  navHtml += '</div>';
  return navHtml;
}

/* ═══════════ 视图：全览（九域卡片+场景列表+战力推荐） ═══════════ */
function _renderOverviewView(layer, sceneMap, playerRealm) {
  var universeData = typeof XUANHUANG_COSMOS !== 'undefined' ? XUANHUANG_COSMOS : null;
  var domainEntryScenes = typeof DOMAIN_ENTRY_SCENES !== 'undefined' ? DOMAIN_ENTRY_SCENES : {};
  if (!universeData) return '<p style="color:var(--text-dim);padding:16px;">九域数据缺失</p>';
  
  var _filterDomains = function(d) {
    if (!G._mapDomainFilter) return true;
    return d.id === G._mapDomainFilter;
  };
  
  var h = '<div style="max-height:400px;overflow-y:auto;padding:2px 0;">';
  
  // 当前域快速提示
  var currentSceneData = typeof getSceneData === 'function' ? getSceneData(G.currentScene) : null;
  if (currentSceneData && currentSceneData.cosmosDomain) {
    h += '<div style="margin-bottom:8px;font-size:10px;color:var(--accent);padding:4px 8px;background:rgba(201,169,110,0.08);border-radius:6px;">'
      + '📍 当前位置：' + (typeof getSceneDisplayName === 'function' ? getSceneDisplayName(G.currentScene) : currentSceneData.name) + ' → ' + (COSMOS_DOMAIN_NAMES && COSMOS_DOMAIN_NAMES[currentSceneData.cosmosDomain] ? COSMOS_DOMAIN_NAMES[currentSceneData.cosmosDomain] : currentSceneData.cosmosDomain) + ' · 修为Lv' + playerRealm + '</div>';
  }
  
  // 战力参考
  h += '<div style="margin-bottom:8px;display:flex;gap:8px;font-size:10px;flex-wrap:wrap;color:var(--text-dim);">'
    + '<span style="color:#8bc34a;">✅ 碾压</span>'
    + '<span style="color:var(--accent);">⚡ 同级</span>'
    + '<span style="color:#ff9800;">🔥 越级×1.5</span>'
    + '<span style="color:#e74c3c;">💀 高风险×2</span>'
    + '<span>⬇️ 太弱·惩罚</span>'
    + '<span>🏘️ 安全区</span>'
    + '</div>';
  
  var domains = universeData.domains.filter(_filterDomains);
  domains.forEach(function(domain) {
    var did = domain.id;
    var entrySceneId = domainEntryScenes[did];
    var entryScene = entrySceneId ? (sceneMap[entrySceneId] || null) : null;
    
    // 收集该域已开放的真实场景
    var scenes = [];
    for (var sid in sceneMap) {
      var sc = sceneMap[sid];
      if (sc && sc.cosmosDomain === did && sc.type && sc.hasOwnProperty('x')) {
        scenes.push(sc);
      }
    }
    scenes.sort(function(a, b) { return (a.qiLevel || 3) - (b.qiLevel || 3); });
    
    var hasVisited = false;
    var currentIn = false;
    if (currentSceneData && currentSceneData.cosmosDomain === did) { currentIn = true; hasVisited = true; }
    scenes.forEach(function(sc) {
      if (G.visitedScenes && G.visitedScenes.indexOf(sc.id) !== -1) hasVisited = true;
    });
    
    var hasScenes = scenes.length > 0;
    var opacity = currentIn ? '1' : (hasVisited ? '0.9' : '0.55');
    var borderColor = currentIn ? domain.accentColor : 'rgba(255,255,255,0.06)';
    
    h += '<div style="margin-bottom:8px;border:1px solid ' + borderColor + ';border-radius:8px;padding:8px;opacity:' + opacity + ';">';
    
    // 域名标题行 + 入口传送
    var entryId = entryScene && entryScene.id ? entryScene.id : '';
    h += '<div style="display:flex;align-items:center;gap:6px;margin-bottom:4px;">';
    h += '<span style="font-size:18px;">' + domain.emoji + '</span>';
    h += '<div style="flex:1;"><span style="font-size:13px;font-weight:bold;color:' + (currentIn ? 'var(--accent)' : 'var(--text)') + ';">' + domain.name + '</span>';
    h += '<span style="font-size:10px;color:var(--text-dim);margin-left:6px;">' + domain.title + '</span></div>';
    if (currentIn) {
      h += '<span style="font-size:10px;padding:1px 6px;border-radius:3px;background:' + domain.accentColor + '22;color:' + domain.accentColor + ';">📍 当前</span>';
    } else if (hasVisited) {
      h += '<span style="font-size:10px;color:var(--text-dim);">✅ 已探索</span>';
    } else {
      h += '<span style="font-size:10px;color:' + domain.accentColor + ';">✨ 未探索</span>';
    }
    if (entryId) {
      h += '<span onclick="moveToScene(\'' + entryId + '\');closeWorldMap();" style="font-size:10px;cursor:pointer;color:' + domain.accentColor + ';text-decoration:underline;">🚪 传送</span>';
    }
    h += '</div>';
    
    // 域等级/危险度
    h += '<div style="font-size:10px;color:var(--text-dim);margin:2px 0;display:flex;gap:6px;flex-wrap:wrap;">';
    h += '<span>⚔️ Lv' + domain.qiLevel + '</span>';
    h += '<span>' + (domain.danger === '极高' ? '💀' : domain.danger === '高' ? '🔥' : '✅') + ' ' + domain.danger + '</span>';
    h += '<span>' + (domain.subRegions ? '🏘️ ' + domain.subRegions.length + '子域' : '') + '</span>';
    h += '</div>';
    
    // 域简介
    h += '<div style="font-size:10px;color:var(--text-dim);margin:2px 0 4px;">' + domain.desc.slice(0, 80) + (domain.desc.length > 80 ? '…' : '') + '</div>';
    
    // 子域标签
    if (domain.subRegions && domain.subRegions.length > 0) {
      h += '<div style="font-size:8px;display:flex;gap:3px;flex-wrap:wrap;margin-bottom:4px;">';
      domain.subRegions.forEach(function(sr) {
        h += '<span style="padding:1px 4px;border-radius:3px;background:rgba(255,255,255,0.04);color:var(--text-dim);">' + sr.name + '</span>';
      });
      h += '</div>';
    }
    
    // 场景列表（带战力标签）
    if (hasScenes) {
      h += '<div style="display:flex;gap:3px;flex-wrap:wrap;">';
      scenes.forEach(function(sc) {
        var isCur = sc.id === G.currentScene;
        var pl = _powerLabel(sc, playerRealm);
        var itemColor = isCur ? 'rgba(201,169,110,0.15)' : 'rgba(255,255,255,0.04)';
        var itemBorder = isCur ? '1px solid var(--accent)' : '1px solid transparent';
        var itemTextColor = isCur ? 'var(--accent)' : pl.color;
        
        var isVisited = G.visitedScenes && G.visitedScenes.indexOf(sc.id) !== -1;
        var visitMark = isVisited ? '✅' : '❓';
        h += '<div onclick="' + (isVisited && !isCur ? 'closeWorldMap();showSceneDetail(\'' + sc.id + '\')' : 'closeWorldMap();moveToScene(\'' + sc.id + '\')') + '" style="padding:4px 8px;border-radius:5px;font-size:12px;cursor:pointer;background:' + itemColor + ';border:' + itemBorder + ';color:' + itemTextColor + ';white-space:nowrap;">'+visitMark+pl.label+(typeof getSceneDisplayName === 'function' ? getSceneDisplayName(sc.id) : sc.name)+'</div>';
      });
      h += '</div>';
    } else {
      h += '<div style="font-size:10px;color:rgba(255,255,255,0.2);padding:4px 0;">🌫️ 此域尚未开放探索</div>';
    }
    
    h += '</div>';
  });
  
  return h + '</div>';
}

/* ═══════════ 视图：域志（完整世界观设定） ═══════════ */
function _renderLoreView() {
  if (typeof XUANHUANG_COSMOS === 'undefined') return '<p style="color:var(--text-dim);padding:16px;">九域志数据缺失</p>';
  
  var h = '<div style="max-height:420px;overflow-y:auto;">';
  
  // 世界总纲
  h += '<div style="margin-bottom:10px;padding:10px;border-radius:8px;background:rgba(0,0,0,0.15);text-align:center;">';
  h += '<div style="font-size:15px;font-weight:bold;color:var(--accent);margin-bottom:4px;">' + XUANHUANG_COSMOS.name + '</div>';
  h += '<div style="font-size:10px;color:var(--text-dim);">' + XUANHUANG_COSMOS.era + '</div>';
  h += '<div style="font-size:10px;color:var(--text);margin-top:4px;line-height:1.6;">' + XUANHUANG_COSMOS.origin + '</div>';
  h += '</div>';
  
  // 三层世界
  if (XUANHUANG_COSMOS.realms) {
    h += '<div style="margin-bottom:8px;"><div style="font-size:11px;color:var(--accent);margin-bottom:4px;font-weight:bold;">🌍 三层世界</div>';
    h += '<div style="display:flex;gap:4px;">';
    XUANHUANG_COSMOS.realms.forEach(function(r) {
      h += '<div style="flex:1;padding:6px;border-radius:6px;border:1px solid ' + r.accent + '44;background:' + r.accent + '11;">';
      h += '<div style="font-size:10px;color:' + r.accent + ';font-weight:bold;">' + r.name + '</div>';
      h += '<div style="font-size:8px;color:var(--text-dim);">' + r.title + '</div>';
      h += '<div style="font-size:8px;color:var(--text);margin-top:2px;">' + r.desc.substring(0, 50) + (r.desc.length > 50 ? '…' : '') + '</div>';
      h += '</div>';
    });
    h += '</div></div>';
  }
  
  // 九域详细设定
  var doms = XUANHUANG_COSMOS.domains;
  if (G._mapDomainFilter) doms = doms.filter(function(d){ return d.id === G._mapDomainFilter; });
  
  doms.forEach(function(dd) {
    h += '<div style="margin-bottom:8px;border:1px solid ' + dd.accentColor + '33;border-radius:8px;padding:10px;">';
    h += '<div style="display:flex;align-items:center;gap:6px;margin-bottom:4px;">';
    h += '<span style="font-size:22px;">' + dd.emoji + '</span>';
    h += '<div><span style="font-size:14px;color:' + dd.accentColor + ';font-weight:bold;">' + dd.name + '</span>';
    h += '<span style="font-size:10px;color:var(--text-dim);margin-left:6px;">' + dd.title + '</span></div>';
    h += '</div>';
    
    // 基础信息
    h += '<div style="display:flex;gap:8px;flex-wrap:wrap;font-size:9px;color:var(--text-dim);margin-bottom:4px;">';
    h += '<span>⚔️ 灵级⭐' + dd.qiLevel + '</span>';
    h += '<span>👥 ' + dd.population + '</span>';
    h += '<span>⚠️ ' + dd.danger + '</span>';
    h += '</div>';
    
    // lore
    h += '<div style="font-size:10px;color:var(--text);line-height:1.6;margin-bottom:6px;">' + dd.lore + '</div>';
    
    // 名胜
    if (dd.famous) {
      h += '<div style="font-size:9px;color:var(--text-dim);margin-bottom:4px;">🏛️ 名胜：' + dd.famous + '</div>';
    }
    
    // 子域
    if (dd.subRegions) {
      h += '<div style="margin-top:4px;"><div style="font-size:9px;color:var(--accent);margin-bottom:2px;">📌 子域一览</div>';
      dd.subRegions.forEach(function(sr) {
        h += '<div style="padding:4px 6px;margin-bottom:3px;border-radius:4px;background:rgba(255,255,255,0.03);font-size:9px;">';
        h += '<span style="color:var(--accent);font-weight:bold;">' + sr.name + '</span>';
        h += '<span style="color:var(--text-dim);margin-left:4px;">' + sr.desc.substring(0, 40) + (sr.desc.length > 40 ? '…' : '') + '</span>';
        if (sr.features && sr.features.length > 0) {
          h += '<div style="margin-top:1px;color:rgba(255,255,255,0.3);font-size:8px;">✨ ' + sr.features.join(' · ') + '</div>';
        }
        h += '</div>';
      });
      h += '</div>';
    }
    h += '</div>';
  });
  
  return h + '</div>';
}

/* ═══════════ 视图：奇观 ═══════════ */
function _renderWondersView() {
  if (typeof XUANHUANG_COSMOS === 'undefined' || !XUANHUANG_COSMOS.wonders) {
    return '<p style="color:var(--text-dim);padding:16px;">奇观数据缺失</p>';
  }
  
  var h = '<div style="max-height:420px;overflow-y:auto;padding:2px;">';
  h += '<div style="margin-bottom:8px;font-size:11px;color:var(--accent);font-weight:bold;text-align:center;">🏛️ 玄黄九大世界奇观</div>';
  
  XUANHUANG_COSMOS.wonders.forEach(function(w) {
    h += '<div style="margin-bottom:6px;padding:8px;border:1px solid rgba(255,255,255,0.06);border-radius:8px;">';
    h += '<div style="display:flex;align-items:center;gap:6px;">';
    h += '<span style="font-size:14px;color:var(--accent);font-weight:bold;">' + w.name + '</span>';
    h += '<span style="font-size:9px;color:var(--text-dim);">— ' + w.domain + '</span>';
    h += '</div>';
    h += '<div style="font-size:10px;color:var(--text);margin-top:4px;line-height:1.5;">' + w.desc + '</div>';
    h += '</div>';
  });
  
  return h + '</div>';
}

/* ═══════════ 视图：纪元大事记 ═══════════ */
function _renderChroniclesView() {
  if (typeof XUANHUANG_COSMOS === 'undefined' || !XUANHUANG_COSMOS.chronicles) {
    return '<p style="color:var(--text-dim);padding:16px;">纪事数据缺失</p>';
  }
  
  var h = '<div style="max-height:420px;overflow-y:auto;padding:2px;">';
  h += '<div style="margin-bottom:8px;font-size:11px;color:var(--accent);font-weight:bold;text-align:center;">📜 纪元史 · ' + XUANHUANG_COSMOS.chronicles.length + '件大事</div>';
  
  // 纪元色
  var eraColors = {
    '开天纪元': '#6a9ec9',
    '洪荒纪元': '#c97a5a',
    '灵潮纪元': '#c9a96e'
  };
  var eraIcons = {
    '开天纪元': '🌌',
    '洪荒纪元': '🌋',
    '灵潮纪元': '🌊'
  };
  
  XUANHUANG_COSMOS.chronicles.forEach(function(c) {
    var ec = eraColors[c.era] || '#666';
    var ei = eraIcons[c.era] || '📜';
    var isCurrent = c.event.indexOf('[当前]') !== -1 || c.event.indexOf('2026') !== -1;
    h += '<div style="margin-bottom:4px;padding:4px 8px;border-left:3px solid ' + ec + ';background:' + (isCurrent ? 'rgba(201,169,110,0.08)' : 'rgba(255,255,255,0.02)') + ';border-radius:2px;">';
    h += '<div style="display:flex;align-items:center;gap:4px;font-size:9px;">';
    h += '<span>' + ei + '</span>';
    h += '<span style="color:' + ec + ';font-weight:bold;">' + c.era + '</span>';
    h += '<span style="color:var(--text-dim);">纪元' + c.year + '年</span>';
    if (isCurrent) h += '<span style="font-size:8px;color:var(--accent);">⭐ 当前</span>';
    h += '</div>';
    h += '<div style="font-size:10px;color:var(--text);margin-top:1px;line-height:1.4;">' + c.event + '</div>';
    h += '</div>';
  });
  
  return h + '</div>';
}

function mapMove(sceneId) { 
  moveToScene(sceneId);
  closeWorldMap();
}

// 🔧 2026-08-05：世界地图点击冰阁禁地（冰风石窟）——未达元婴弹门槛提示，已解锁正常进入
function worldMapForbiddenMove(sceneId) {
  const p = G.player;
  if (typeof isForbiddenUnlocked === 'function' && isForbiddenUnlocked()) {
    moveToScene(sceneId);
    closeWorldMap();
    return;
  }
  // 未解锁：弹出禁地提示（不移动）
  const need = (typeof QI_REALMS !== 'undefined' && QI_REALMS[15]) ? QI_REALMS[15].name : '元婴';
  showCustomModal('❄️ 冰阁禁地', '<div style="font-size:13px;color:var(--text);line-height:1.7;padding:8px 4px;">'
    + '你以冰晶信物触碰禁地结界，结界微微颤动，却未开启。<br>'
    + '识海中响起百里冰的声音：「孩子，此间道痕凶险，须达 <b style="color:var(--accent);">' + need + '</b> 方可入内。」<br>'
    + '<div style="font-size:10px;color:var(--text-dim);margin-top:6px;">（你目前的修为：' + (typeof getRealmLabel === 'function' ? getRealmLabel() : '') + '）</div>'
    + '</div>'
    + '<button class="event-choice-btn" onclick="closeEvent()" style="width:100%;margin-top:6px;">明白了</button>');
}
window.worldMapForbiddenMove = worldMapForbiddenMove;

// ==========================
// 弹窗系统
// ==========================

// ── 事件弹窗 ──
let currentEvent = null;

function showEventModal(eventData) {
  currentEvent = eventData;
  
  // 自动模式：智能选择最佳选项，自动完成
  if (typeof autoModeActive !== 'undefined' && autoModeActive) {
    // 找最佳选项：优先选有奖励的，其次选不扣属性的
    const choices = eventData.choices;
    let bestIdx = 0;
    let bestScore = -999;
    
    // 如果是神秘盒子类事件，自动选第一个（自动打开）
    if (eventData.id && (eventData.id.includes('box') || eventData.id.includes('Box'))) {
      bestIdx = 0;
    } else {
      choices.forEach((c, i) => {
        const r = c.reward || {};
        let score = 0;
        if (r.stones) score += r.stones;
        if (r.cultivationPoints) score += r.cultivationPoints * 0.5;
        if (r.mood) score += r.mood * 2;
        if (r.qi) score += r.qi * 0.3;
        if (r.hp) score += r.hp * 0.3;
        if (r.item) score += 30;
        if (r.skillScroll) score += 100;
        if (r.randomSkill) score += 80;
        if (r.mysteryBox) score += 40;
        if (r.combat) score -= 20;  // 战斗有风险
        if (r.wisdom) score += r.wisdom * 5;
        if (r.hpBonus) score += 30;
        if (r.qiBonus) score += 30;
        if (r.qiRealmBoost) score += 200;
        if (r.stones && r.stones < 0) score += r.stones * 1.5; // 扣灵石更亏
        if (bestScore < score) { bestScore = score; bestIdx = i; }
      });
    }
    
    // 自动选择最佳选项
    setTimeout(() => resolveEvent(bestIdx), 200);
    return;
  }
  
  // 手动模式：弹出选择弹窗（走统一 showCustomModal，享受弹窗队列防覆盖）
  const bodyHtml = `<p style="font-size:12px;line-height:1.8;">${eventData.description}</p>`;
  const choicesHtml = eventData.choices.map((c, i) => 
    `<button class="event-choice-btn" onclick="resolveEvent(${i})" style="display:block;width:100%;margin:4px 0;text-align:left;">📜 ${c.text}</button>`
  ).join('');
  showCustomModal(eventData.title, bodyHtml + choicesHtml);
}

// 神秘盒子——随机奖励池
function rollMysteryBox() {
  const p = G.player;
  const luckMult = p.fortune && p.fortune.luckMult ? p.fortune.luckMult : 1.0;
  const roll = Math.random();
  
  // 按品质分档（福缘影响出好东西的概率）
  const tier = roll < 0.01 * luckMult ? '神级' :
               roll < 0.05 * luckMult ? '圣级' :
               roll < 0.15 * luckMult ? '天级' :
               roll < 0.35 * luckMult ? '地级' :
               roll < 0.6 ? '灵级' : '凡级';
  
  const pool = [
    // ── 凡级 ──
    { tier:'凡级', desc:'几枚灵石', effect:() => { p.stones += 8; return '几枚灵石（+8）'; } },
    { tier:'凡级', desc:'一根兽骨', effect:() => { const it = { id:'shougu', name:'兽骨', type:'材料', value:5 }; addItemToInventory(it, 1); return '兽骨一根'; } },
    { tier:'凡级', desc:'回气丹一枚', effect:() => { const it = { id:'huiqi_dan', name:'回气丹', type:'丹药', desc:'恢复50灵力', value:20, effects:{qi:50} }; addItemToInventory(it, 1); return '回气丹×1'; } },
    { tier:'凡级', desc:'一枚低阶灵石', effect:() => { p.stones += 3; return '低阶灵石（+3）'; } },
    { tier:'凡级', desc:'一缕灵气入体', effect:() => { p.qi = Math.min(p.maxQi, (p.qi||0) + 15); return '灵气入体（+15灵力）'; } },
    { tier:'凡级', desc:'一份止血散', effect:() => { const it = { id:'zhixue_san', name:'止血散', type:'丹药', value:10 }; addItemToInventory(it, 1); return '止血散×1'; } },
    { tier:'凡级', desc:'一篇修炼随笔', effect:() => { if (typeof gainCultivation === 'function') gainCultivation('qi', 25); else p.qiCultivationPoints += 25; return '修为+25'; } },
    // ── 灵级 ──
    { tier:'灵级', desc:'聚灵符一张', effect:() => { const it = { id:'juli_fu', name:'聚灵符', type:'符箓', value:30 }; addItemToInventory(it, 1); return '聚灵符×1'; } },
    { tier:'灵级', desc:'锻体丹一枚', effect:() => { const it = { id:'duanti_dan', name:'锻体丹', type:'丹药', value:35 }; addItemToInventory(it, 1); return '锻体丹×1'; } },
    { tier:'灵级', desc:'灵石若干', effect:() => { p.stones += 30; return '灵石+30'; } },
    { tier:'灵级', desc:'修为突增', effect:() => { if (typeof gainCultivation === 'function') gainCultivation('qi', 80); else p.qiCultivationPoints += 80; return '修为+80'; } },
    { tier:'灵级', desc:'灵草一株', effect:() => { const it = { id:'hgc_grass', name:'还魂草', type:'材料', value:25 }; addItemToInventory(it, 2); return '还魂草×2'; } },
    { tier:'灵级', desc:'悟性略微提升', effect:() => { p.wisdom = Math.min(100, (p.wisdom||50) + 1); return '悟性+1'; } },
    { tier:'灵级', desc:'一枚玉佩', effect:() => { const it = { id:'huyu_pei', name:'护体玉佩', type:'饰品', desc:'略微提升防御', value:40, effects:{defenseBonus:3} }; addItemToInventory(it, 1); return '护体玉佩×1'; } },
    // ── 地级 ──
    { tier:'地级', desc:'破气丹一枚', effect:() => { const it = { id:'poqi_dan', name:'破气丹', type:'丹药', value:60 }; addItemToInventory(it, 1); return '破气丹×1'; } },
    { tier:'地级', desc:'大量灵石', effect:() => { p.stones += 80; return '灵石+80'; } },
    { tier:'地级', desc:'根骨增强', effect:() => { p.bone = Math.min(100, (p.bone||50) + 2); return '根骨+2'; } },
    { tier:'地级', desc:'修为大进', effect:() => { if (typeof gainCultivation === 'function') gainCultivation('qi', 200); else p.qiCultivationPoints += 200; return '修为+200'; } },
    { tier:'地级', desc:'一枚丹药', effect:() => { const it = { id:'pojing_dan', name:'破境丹', type:'丹药', value:80 }; addItemToInventory(it, 1); return '破境丹×1'; } },
    { tier:'地级', desc:'灵泉水一壶', effect:() => { p.maxQi = (p.maxQi||100) + 5; return '灵力上限+5'; } },
    // ── 天级 ──
    { tier:'天级', desc:'功法残篇', effect:() => {
      const pool = ['yunjue','tuqi','jinqi','jingu','swift_step','splitting_fist'];
      const sid = pool[Math.floor(Math.random() * pool.length)];
      const sd = G.skillData.find(s => s.id === sid);
      if (sd) { p.skills.push({id:sd.id,name:sd.name,quality:sd.quality,type:sd.type,active:false,mastered:true}); return `功法「${sd.name}」`; }
      return '功法残篇（已失传）';
    }},
    { tier:'天级', desc:'大量修为+悟性', effect:() => { if (typeof gainCultivation === 'function') gainCultivation('qi', 500); else p.qiCultivationPoints += 500; p.wisdom = Math.min(100, (p.wisdom||50) + 2); return '修为+500，悟性+2'; } },
    { tier:'天级', desc:'灵石袋', effect:() => { p.stones += 200; return '灵石+200'; } },
    { tier:'天级', desc:'寿元增加', effect:() => { p.maxAge = (p.maxAge||120) + 10; return '寿元+10年'; } },
    { tier:'天级', desc:'境界突破助力', effect:() => { p.qiRealmIndex = Math.min(p.qiRealmIndex + 1, QI_REALMS.length - 1); p.qiCultivationPoints = QI_REALMS[p.qiRealmIndex].cpRequired; recalcStats(p); return '修为突破！'; } },
    // ── 圣级 ──
    { tier:'圣级', desc:'完整功法卷轴', effect:() => {
      const pool = ['huoyan_breath','fire_fist','qqs_basics','iron_body'];
      const sid = pool[Math.floor(Math.random() * pool.length)];
      const sd = G.skillData.find(s => s.id === sid);
      if (sd) { p.skills.push({id:sd.id,name:sd.name,quality:sd.quality,type:sd.type,active:false,mastered:true}); return `功法「${sd.name}」`; }
      return '上古卷轴（内容已损）';
    }},
    { tier:'圣级', desc:'灵髓淬体', effect:() => { p.maxHp = (p.maxHp||200) + 50; p.maxQi = (p.maxQi||100) + 30; return '气血+50，灵力+30'; } },
    { tier:'圣级', desc:'悟道石', effect:() => { p.wisdom = Math.min(100, (p.wisdom||50) + 5); if (typeof gainCultivation === 'function') gainCultivation('qi', 800); else p.qiCultivationPoints += 800; return '悟性+5，修为+800'; } },
    { tier:'圣级', desc:'福缘加深', effect:() => { if (p.fortune && p.fortune.luckMult) p.fortune.luckMult = Math.min(2.0, p.fortune.luckMult + 0.2); return '福缘加深！'; } },
    // ── 神级 ──
    { tier:'神级', desc:'天道灌顶', effect:() => { p.qiRealmIndex = Math.min(p.qiRealmIndex + 2, QI_REALMS.length - 1); p.qiCultivationPoints = QI_REALMS[p.qiRealmIndex].cpRequired; p.maxHp = (p.maxHp||200) + 100; p.maxQi = (p.maxQi||100) + 80; recalcStats(p); return '天道灌顶！境界突破！'; } },
    { tier:'神级', desc:'天命重塑', effect:() => { p.wisdom = Math.min(100, (p.wisdom||50) + 10); p.bone = Math.min(100, (p.bone||50) + 10); return '根骨+10，悟性+10'; } },
    { tier:'神级', desc:'神级功法碎片', effect:() => {
      const pool = ['sanmei','wuji_gong'];
      const sid = pool[Math.floor(Math.random() * pool.length)];
      const sd = G.skillData.find(s => s.id === sid);
      if (sd) { p.skills.push({id:sd.id,name:sd.name,quality:sd.quality,type:sd.type,active:false,mastered:true}); return `神级功法「${sd.name}」！`; }
      return '神光一闪即逝……';
    }},
    { tier:'神级', desc:'灵石巨量', effect:() => { p.stones += 1000; return '灵石+1000！'; } },
  ];
  
  const available = pool.filter(x => x.tier === tier);
  const chosen = available[Math.floor(Math.random() * available.length)];
  const result = chosen.effect();
  
  // 品质色
  const qColors = {'凡级':'#8a7a6a','灵级':'#6a9ec9','地级':'#d46a3a','天级':'#c9a96e','圣级':'#e0c8a0','神级':'#f0d8c0'};
  const qNames = {'凡级':'凡品','灵级':'灵品','地级':'地品','天级':'天品','圣级':'圣品','神级':'神品'};
  
  addNarrative(`<div style="text-align:center;"><span style="font-size:24px;">🎁</span><br><span style="font-size:16px;font-weight:bold;color:${qColors[tier]};">${qNames[tier]} · ${result}</span></div>`, 'epic');
  recalcStats(p);
}

function resolveEvent(choiceIndex) {
  const ev = currentEvent;
  const choice = ev.choices[choiceIndex];
  // 走统一关闭（触发弹窗队列出队）
  if (typeof closeCustomModal === 'function') closeCustomModal();
  else document.getElementById('event-overlay').classList.add('hidden');
  
  if (choice.reward) {
    const r = choice.reward;
    const p = G.player;
    
    // 神秘盒子
    if (r.mysteryBox) {
      rollMysteryBox();
      G.player.eventHistory.push(ev.title + ' — ' + choice.result);
      addNarrative(`【${ev.title}】${choice.result}`, 'narr-event');
      updateAllUI();
      return;
    }
    
    // 物品（兼容 id 和 name 两种格式）
    if (r.item) {
      let foundItem = ITEM_DB.find(i => i.id === r.item) || ITEM_DB.find(i => i.name === r.item);
      if (foundItem) addItemToInventory(foundItem, 1);
      else addItemToInventory({ id:r.item, name:r.item, type:'材料', value:1 }, 1);
    }
    
    // 功法卷轴（直接习得）
    if (r.skillScroll) {
      const sd = typeof G.skillData !== 'undefined' ? G.skillData.find(s => s.id === r.skillScroll) : null;
      if (sd && !p.skills.find(s => s.id === sd.id)) {
        p.skills.push({ id:sd.id, name:sd.name, quality:sd.quality, type:sd.type, active:false, mastered:true });
        const qColor = typeof getQualityColor === 'function' ? getQualityColor(sd.quality) : '#aaa';
        const effects = typeof formatEffectDescriptions === 'function' ? formatEffectDescriptions(sd.effects) : [];
        const effHtml = effects.length > 0 ? effects.map(e => `<span class="epic-stat">✦ ${e}</span>`).join('') : '';
        addNarrative(`<div class="epic-name" style="color:${qColor};">📖 习得 <b>${sd.name}</b><span class="epic-quality">${sd.quality}·${sd.type}</span></div>
<span style="display:block;font-size:12px;color:var(--text-dim);margin-top:3px;">${sd.desc}</span>
${effHtml ? `<span style="display:block;font-size:11px;margin-top:4px;">${effHtml}</span>` : ''}`, 'epic');
      }
    }
    
    // 随机功法（从某品质池中抽取）
    if (r.randomSkill) {
      const qualityPool = Array.isArray(r.randomSkill) ? r.randomSkill : ['灵级','地级'];
      const candidates = G.skillData.filter(s => qualityPool.includes(s.quality) && s.learn && !s.learn.special && !p.skills.find(sk => sk.id === s.id));
      if (candidates.length > 0) {
        const chosen = candidates[Math.floor(Math.random() * candidates.length)];
        p.skills.push({ id:chosen.id, name:chosen.name, quality:chosen.quality, type:chosen.type, active:false, mastered:true });
        const qColor = typeof getQualityColor === 'function' ? getQualityColor(chosen.quality) : '#aaa';
        const effects = typeof formatEffectDescriptions === 'function' ? formatEffectDescriptions(chosen.effects) : [];
        const effHtml = effects.length > 0 ? effects.map(e => `<span class="epic-stat">✦ ${e}</span>`).join('') : '';
        addNarrative(`<div class="epic-name" style="color:${qColor};">📜 获赠 <b>${chosen.name}</b><span class="epic-quality">${chosen.quality}·${chosen.type}</span></div>
<span style="display:block;font-size:12px;color:var(--text-dim);margin-top:3px;">${chosen.desc}</span>
${effHtml ? `<span style="display:block;font-size:11px;margin-top:4px;">${effHtml}</span>` : ''}`, 'epic');
      }
    }
    
    // 修为
    if (r.cultivationPoints) {
      if (typeof gainCultivation === 'function') gainCultivation('qi', r.cultivationPoints);
      else p.qiCultivationPoints += r.cultivationPoints;
    }
    
    // 灵石
    if (r.stones) p.stones += r.stones;
    
    // 心境
    if (r.mood) p.mood = Math.max(0, Math.min(100, p.mood + r.mood));
    
    // 灵力
    if (r.qi) p.qi = Math.min(p.maxQi, Math.max(0, p.qi + r.qi));
    
    // 气血
    if (r.hp) p.hp = Math.min(p.maxHp, Math.max(0, p.hp + r.hp));
    
    // NPC好感
    if (r.npcFriend) p.relationships.push(r.npcFriend);
    
    // 悟性
    if (r.wisdom) p.wisdom = Math.min(100, (p.wisdom||50) + r.wisdom);
    
    // 根骨
    if (r.bone) p.bone = Math.min(100, (p.bone||50) + r.bone);
    
    // 气血上限提升
    if (r.hpBonus) {
      p.maxHp = (p.maxHp||200) + r.hpBonus;
      addNarrative(`💚 气血上限 +${r.hpBonus}`, 'narr-event');
    }
    
    // 灵力上限提升
    if (r.qiBonus) {
      p.maxQi = (p.maxQi||100) + r.qiBonus;
      addNarrative(`🔵 灵力上限 +${r.qiBonus}`, 'narr-event');
    }
    
    // 境界突破推进
    if (r.qiRealmBoost) {
      const boost = Math.min(r.qiRealmBoost, QI_REALMS.length - 1 - p.qiRealmIndex);
      if (boost > 0) {
        p.qiRealmIndex += boost;
        addNarrative(`⚡ 境界突破！${QI_REALMS[p.qiRealmIndex].name}！`, 'narr-event');
      }
    }
    
    // 炼体修为
    if (r.bodyCultPoints) {
      if (typeof gainCultivation === 'function') gainCultivation('body', r.bodyCultPoints);
      else p.bodyCultivationPoints = (p.bodyCultivationPoints||0) + r.bodyCultPoints;
    }
    
    // 寿元增加
    if (r.maxAge) p.maxAge = (p.maxAge||120) + r.maxAge;
    
    // 战斗
    if (r.combat) startSceneCombat();
  }
  
  recalcStats(G.player);
  G.player.eventHistory.push(ev.title + ' — ' + choice.result);
  addNarrative(`【${ev.title}】${choice.result}`, 'narr-event');
  updateAllUI();
}

function closeEvent() { var el = document.getElementById('event-overlay'); if(el) { if (typeof closeCustomModal === 'function') closeCustomModal(); else el.classList.add('hidden'); el.style.display = ''; } }
window.closeEvent = closeEvent;

// ── 坊市弹窗 ──
function showMarketModal() {
  document.getElementById('event-overlay').classList.remove('hidden');
  document.getElementById('event-title').textContent = '🏪 青云镇 · 坊市';
  
  // 🌟 名声折扣（名望越高，掌柜越客气）
  const fameDisc = typeof getFameDiscount === 'function' ? getFameDiscount() : 0;
  const famLvl = typeof getFameLevel === 'function' ? getFameLevel() : null;
  const discountLabel = fameDisc > 0 ? `（${famLvl ? famLvl.name : ''} · 掌柜给你打了个折 -${Math.round(fameDisc * 100)}%）` : '';
  
  const marketItems = G.player ? getSkillScrollsForSale(G.player.qiRealmIndex).map(sd => ({
    id: sd.id,
    name: `${sd.name}·卷轴`,
    price: Math.round((sd.quality === '灵级' ? 120 : 60) * (1 - fameDisc)),
    desc: `${sd.quality}·${sd.type}：${sd.desc}`,
    isScroll: true,
  })) : [];
  
  const shopItems = [
    { id:'huiqi_dan', name:'回气丹', price:30, desc:'恢复50点灵力' },
    { id:'zhixue_san', name:'止血散', price:20, desc:'恢复40点气血' },
    { id:'juli_fu', name:'聚灵符', price:50, desc:'修炼效率+20%' },
    { id:'lianqi_xinde', name:'炼气心得', price:40, desc:'增加100修为' },
    { id:'lingquan_shui', name:'灵泉水', price:15, desc:'恢复25灵力' },
    { id:'poqi_dan', name:'破气丹', price:60, desc:'炼气突破必备（每层需1~3枚）' },
    { id:'duanti_dan', name:'锻体丹', price:50, desc:'炼体突破必备（每重需1~3枚）' },
    { id:'podi_dan', name:'破壁丹', price:100, desc:'突破时服用，+15%成功率', rare:true },
    { id:'tiexiu_jian', name:'锈铁剑', price:12, desc:'攻击+5' },
    { id:'shoupi_kai', name:'兽皮甲', price:18, desc:'防御+5' },
    { id:'yunwen_guan', name:'云纹冠', price:35, desc:'灵气上限+15' },
    { id:'yaoyu_pei', name:'瑶玉佩', price:80, desc:'灵力恢复+5' },
    { id:'tiejia', name:'铁甲', price:45, desc:'防御+10' },
    { id:'tiegu_dao', name:'铁骨刀', price:40, desc:'攻击+8' },
  ].map(it => ({ ...it, price: Math.round(it.price * (1 - fameDisc)) }));
  
  if (G.player.qiRealmIndex >= 1) shopItems.push({ id:'juli_dan', name:'聚气丹', price:Math.round(80 * (1 - fameDisc)), desc:'+150修为' });

  // 🔧 2026-08-03：商品卡生成器——装备显示完整属性+与身上对比，全部支持悬浮tooltip
  function marketItemCard(item) {
    const p = G.player;
    if (item.isScroll) {
      return `<div class="market-item" style="border-left:3px solid ${item.price > 80 ? '#c9a96e' : '#6a9ec9'}">
        <span>📜 ${item.name}</span>
        <span style="font-size:12px;color:var(--text-dim)">${item.desc}</span>
        <span style="color:var(--accent)">💰${item.price}</span>
        <button class="market-buy" onclick="buySkillScroll('${item.id}', ${item.price})">购买</button>
      </div>`;
    }
    const it = ITEM_DB.find(i => i.id === item.id);
    if (!it) {
      return `<div class="market-item">
        <span>${item.name}</span>
        <span style="font-size:12px;color:var(--text-dim)">${item.desc}</span>
        <span style="color:var(--accent)">💰${item.price}</span>
        <button class="market-buy" onclick="buyMarketItem('${item.id}', ${item.price})">购买</button>
      </div>`;
    }
    // 装备 → 显示完整属性 + 与身上同部位对比
    let attrHtml = '';
    let compareHtml = '';
    if (it.equipEffect) {
      const eff = it.equipEffect;
      const slotN = { weapon:'🗡️ 武器', armor:'🛡️ 护甲', accessory:'💍 饰品', head:'👑 头饰', shoes:'👢 鞋履' };
      const slot = (typeof getEquipSlot === 'function') ? getEquipSlot(it) : 'weapon';
      const parts = [];
      if (eff.attackBonus) parts.push('攻+' + eff.attackBonus);
      if (eff.defenseBonus) parts.push('防+' + eff.defenseBonus);
      if (eff.hpBonus) parts.push('血+' + eff.hpBonus);
      if (eff.maxQiBonus) parts.push('灵+' + eff.maxQiBonus);
      if (eff.cultivationSpeed) parts.push('修炼+' + Math.round(eff.cultivationSpeed * 100) + '%');
      if (eff.qiRegen) parts.push('灵恢+' + eff.qiRegen);
      if (eff.dodge) parts.push('闪+' + Math.round(eff.dodge * 100) + '%');
      if (eff.critRate) parts.push('暴+' + Math.round(eff.critRate * 100) + '%');
      if (eff.wisdomBonus) parts.push('悟+' + eff.wisdomBonus);
      if (eff.healingBonus) parts.push('疗+' + Math.round(eff.healingBonus * 100) + '%');
      if (eff.mood) parts.push('心+' + eff.mood);
      attrHtml = `<div style="font-size:10px;color:#d46a3a;margin:2px 0;">⚔️ ${slotN[slot] || slot}：${parts.join(' ')}</div>`;
      // 对比身上（饰品多件：与已戴所有饰品属性总和对比）
      const wornItems = getWornEquipItems(slot);
      if (wornItems.length) {
        const we = {};
        const wornNames = wornItems.map(function(w) { return w.name; });
        wornItems.forEach(function(w) {
          Object.keys(w.effects || {}).forEach(function(k) { we[k] = (we[k] || 0) + (w.effects[k] || 0); });
        });
        const allKeys = ['attackBonus','defenseBonus','hpBonus','maxQiBonus','cultivationSpeed','qiRegen','dodge','critRate','wisdomBonus','healingBonus','mood'];
        const diffs = [];
        allKeys.forEach(k => {
          const nv = eff[k] || 0, ov = we[k] || 0;
          if (nv === ov) return;
          const delta = nv - ov;
          const isPct = (k === 'cultivationSpeed' || k === 'dodge' || k === 'critRate' || k === 'healingBonus');
          // 🎨 提升=红▲ 下降=绿▼
          const color = delta > 0 ? '#ef5350' : '#8bc34a';
          diffs.push(`<span style="color:${color}">${delta > 0 ? '▲' : '▼'}${typeof keyLabel === 'function' ? keyLabel(k) : k}${delta > 0 ? '+' : ''}${delta}${isPct ? '%' : ''}</span>`);
        });
        compareHtml = diffs.length
          ? `<div style="font-size:10px;color:var(--text-dim);margin:2px 0;">🔁 对比${slotN[slot]}（${wornNames.join('、')}）：${diffs.join(' ')}</div>`
          : `<div style="font-size:10px;color:var(--text-dim);margin:2px 0;">🔁 与${slotN[slot]}（${wornNames.join('、')}）属性持平</div>`;
      } else {
        compareHtml = `<div style="font-size:10px;color:#ef5350;margin:2px 0;">🆕 ${slotN[slot] || '该部位'}未装备，穿上即得</div>`;
      }
    }
    // 悬浮tooltip（完整详情+获取途径）
    const tip = `onmouseenter="showItemTooltip(event,'${item.id}',this._itemData || null)" onmouseleave="hideItemTooltip()"`;
    return `<div class="market-item" style="cursor:pointer;" ${tip}>
      <span>${it.name}${it.rarity && it.rarity >= 1 ? `<span style="font-size:9px;color:#c9a96e;margin-left:3px;">${['','灵品☆','地品☆☆','天品☆☆☆','圣品☆☆☆☆','神品☆☆☆☆☆'][it.rarity] || ''}</span>` : ''}</span>
      ${attrHtml}${compareHtml}
      <span style="font-size:11px;color:var(--text-dim)">${item.desc || it.desc || ''}</span>
      <span style="color:var(--accent)">💰${item.price}</span>
      <button class="market-buy" onclick="buyMarketItem('${item.id}', ${item.price})">购买</button>
    </div>`;
  }

  let itemsHtml = [...shopItems, ...marketItems].map(marketItemCard).join('');
  
  document.getElementById('event-body').innerHTML = `
    <p>坊市里人来人往，小贩的叫卖声此起彼伏。${discountLabel}</p>
    <div class="market-list">${itemsHtml}</div>
  `;
  document.getElementById('event-choices').innerHTML = `
    <button class="event-choice-btn" onclick="closeEvent()">🚶 离开坊市</button>
    <button class="event-choice-btn" onclick="closeEvent();showBlackMarket()" style="color:#e74c3c;border-color:#e74c3c;">🏴 黑市</button>
  `;
}

// ── 黑市弹窗（根据境界动态生成商品）──
function showBlackMarket() {
  const p = G.player;
  const skillDb = typeof SKILL_DB !== 'undefined' ? SKILL_DB : [];
  const itemDb = typeof ITEM_DB !== 'undefined' ? ITEM_DB : [];
  const qiRealm = typeof QI_REALMS !== 'undefined' ? QI_REALMS : [];
  const bodyRealm = typeof BODY_REALMS !== 'undefined' ? BODY_REALMS : [];
  
  // 刷新消耗随境界提升（测试时可覆盖为1灵石）
  const refreshCost = (typeof window.__TEST_REFRESH_COST !== 'undefined' && window.__TEST_REFRESH_COST !== null)
    ? window.__TEST_REFRESH_COST
    : 50 + (p.qiRealmIndex || 0) * 20;
  
  // ── 根据境界确定可刷出的商品等级 ──
  const realmIndex = p.qiRealmIndex || 0;
  const bodyIndex = p.bodyRealmIndex || 0;
  
  // 境界对应商品品质（0=凡级,1=灵级,2=地级,3=天级,4=圣级,5=神级）
  function getMaxQuality(idx) {
    if (idx <= 5) return 0;  // 练气1-6:凡级
    if (idx <= 8) return 1;  // 练气7-9:灵级
    if (idx <= 11) return 2; // 筑基:地级
    if (idx <= 14) return 3; // 金丹:天级
    if (idx <= 17) return 4; // 元婴:圣级
    return 5;                  // 化神+:神级
  }
  const maxQual = Math.max(getMaxQuality(realmIndex), getMaxQuality(bodyIndex + 6));
  const qualNames = ['凡级','灵级','地级','天级','圣级','神级'];
  const qualColors = ['#8a9a5a','#5a9ac9','#c9a96e','#c96a6a','#9a6ac9','#e8c88a'];
  
  // ── 按境界筛选突破丹药（确保一定能买到当前需要的）──
  const pillIds = [];
  // 练气突破：破气丹
  if (realmIndex <= 8) pillIds.push({id:'poqi_dan', min:1, max:3});
  if (realmIndex >= 2 && realmIndex <= 8) pillIds.push({id:'juli_dan', min:1, max:2});
  // 筑基期突破金丹还需要聚气丹（筑基高阶→金丹：筑基丹×3+聚气丹×5），黑市继续供应
  if (realmIndex >= 9 && realmIndex <= 11) pillIds.push({id:'juli_dan', min:1, max:3});
  if (realmIndex >= 5) pillIds.push({id:'podi_dan', min:1, max:2});
  // 🔧 2026-08-05 修复：炼体七重~九重突破需破壁丹（duanti_dan×6+podi_dan×1 等），
  //    炼气境界低的体修黑市买不到破壁丹 → 炼体八重卡死。体修也供应。
  if (bodyIndex >= 6 && bodyIndex <= 8) pillIds.push({id:'podi_dan', min:1, max:2});
  // 筑基
  if (realmIndex >= 8) pillIds.push({id:'zhuji_dan', min:1, max:2});
  // 金丹
  if (realmIndex >= 11) pillIds.push({id:'jindan_dan', min:1, max:2});
  // 元婴
  if (realmIndex >= 14) pillIds.push({id:'yuanying_dan', min:1, max:2});
  // 化神
  if (realmIndex >= 17) pillIds.push({id:'huashen_dan', min:1, max:2});
  // 大乘+渡劫
  if (realmIndex >= 20) pillIds.push({id:'dacheng_dan', min:1, max:2});
  if (realmIndex >= 22) pillIds.push({id:'dujie_dan', min:1, max:1});
  
  // 炼体丹药
  if (bodyIndex <= 8) pillIds.push({id:'duanti_dan', min:1, max:4});
  if (bodyIndex >= 7) pillIds.push({id:'tongpi_dan', min:1, max:2});
  if (bodyIndex >= 9) pillIds.push({id:'tiegu_dan', min:1, max:2});
  if (bodyIndex >= 10) pillIds.push({id:'yinxiue_dan', min:1, max:2});
  if (bodyIndex >= 11) pillIds.push({id:'jinshen_dan', min:1, max:2});
  if (bodyIndex >= 12) pillIds.push({id:'yusui_dan', min:1, max:2});
  if (bodyIndex >= 13) pillIds.push({id:'bumie_dan', min:1, max:2});
  if (bodyIndex >= 14) pillIds.push({id:'niepan_dan', min:1, max:2});
  if (bodyIndex >= 15) pillIds.push({id:'hundun_dan', min:1, max:1});
  // 🐛 修复：不朽/开天/鸿蒙道丹此前无任何产出，炼体19重后突破永久卡死
  if (bodyIndex >= 18) pillIds.push({id:'buxiu_dan', min:1, max:1});
  if (bodyIndex >= 19) pillIds.push({id:'kaitian_dan', min:1, max:1});
  if (bodyIndex >= 20) pillIds.push({id:'hundao_dan', min:1, max:1});
  
  // 建设商品池
  let pool = [];
  
  // 1. 突破丹药池（必出，至少2种）
  pillIds.forEach(pp => {
    const found = itemDb.find(i => i.id === pp.id);
    if (found) {
      const qty = pp.min + Math.floor(Math.random() * (pp.max - pp.min + 1));
      for (let j = 0; j < qty; j++) {
        pool.push({...found, _guaranteed: true, _originId: found.id});
      }
    }
  });
  
  // 2. 功法卷轴池（按玩家境界筛选）（🔧 2026-08-03：排除自创功法——自创只能自创获得，商店不出售）
  skillDb.forEach(s => {
    if (s.id && s.id.startsWith('custom_')) return;
    const skillQualIdx = ['凡级','灵级','地级','天级','圣级','神级'].indexOf(s.quality);
    if (skillQualIdx <= maxQual) {
      const val = [50, 200, 600, 1500, 4000, 10000][skillQualIdx] || 100;
      pool.push({ id:'scroll_' + s.id, name:s.name + '·卷轴', type:'功法卷轴', category:'杂物', desc:s.desc + '（卷轴·' + s.quality + '）', value: val, isScroll: true, scrollId: s.id, quality: s.quality });
    }
  });
  
  // 3. 通用物品池（丹药、材料、法器）
  itemDb.forEach(i => {
    if (i.category === '丹药' || i.category === '材料' || i.category === '装备') {
      const itemQual = i.rarity || 0;
      if (itemQual <= maxQual) {
        pool.push({...i, _originId: i.id});
      }
    }
  });
  
  // ── 随机取5-8件 ──
  const count = 5 + Math.floor(Math.random() * 4);
  const items = [];
  
  // 🔧 2026-08-05 修复：当前突破急需的丹药必出（练体八重需破壁丹但随机池可能不取到 → 卡死）
  //    先收集当前突破需求（炼气+炼体）的丹药 id，从 pool 中优先取出
  const urgentPool = [];
  try {
    const urgentIds = [];
    if (typeof getBodyBreakthroughReqs === 'function') {
      const br = getBodyBreakthroughReqs();
      if (br && br.items) br.items.forEach(r => urgentIds.push(r.id));
    }
    if (typeof getQiBreakthroughReqs === 'function') {
      const qr = getQiBreakthroughReqs();
      if (qr && qr.items) qr.items.forEach(r => urgentIds.push(r.id));
    }
    urgentIds.forEach(uid => {
      const found = pool.find(x => x._originId === uid && !urgentPool.includes(x));
      if (found) urgentPool.push(found);
    });
  } catch(e) {}
  // 急需的排最前（每个最多1件），保证必出
  urgentPool.forEach(u => {
    if (items.length >= count) return;
    const priceMult = 1.5 + Math.random() * 2;
    const finalPrice = Math.floor((u.value || 50) * priceMult);
    items.push({ ...u, finalPrice, priceMult: Math.round(priceMult * 10) / 10, isPill: true });
  });
  
  // 剩余名额从池中随机补
  const shuffled = [...pool].sort(() => Math.random() - 0.5);
  
  // 再补至少2件突破丹药（若急需丹不足2件）
  let pillCount = items.filter(i => i.isPill).length;
  for (const item of shuffled) {
    if (items.some(x => x.id === item.id && x.name === item.name)) continue;
    if (items.length >= count) break;
    if (item._guaranteed && item._originId && pillCount < 3) {
      pillCount++;
      const priceMult = 1.5 + Math.random() * 3;
      const finalPrice = Math.floor((item.value || 50) * priceMult);
      items.push({ ...item, finalPrice, priceMult: Math.round(priceMult * 10) / 10, isPill: true });
    }
  }
  
  // 再补满剩余名额
  for (const item of shuffled) {
    if (items.some(x => x.id === item.id && x.name === item.name)) continue;
    if (items.length >= count) break;
    const priceMult = 2 + Math.random() * 8;
    const finalPrice = Math.floor((item.value || 100) * priceMult);
    items.push({ ...item, finalPrice, priceMult: Math.round(priceMult) });
  }
  
  // ── 渲染 ──
  const marketLevel = qualNames[maxQual];
  const marketColor = qualColors[maxQual];
  
  let html = `<div style="font-size:11px;color:var(--text-dim);margin-bottom:8px;">
    🏴 黑市 · <span style="color:${marketColor};">${marketLevel}</span>级奇珍异宝<a onclick="event.stopPropagation();" style="font-size:9px;margin-left:6px;">(?境界越高货越好)</a><br>
    <span style="font-size:10px;">💰当前灵石：${p.stones} | 刷新费：${refreshCost}灵石</span>
    <div style="font-size:9px;margin-top:2px;">当前境界：${qiRealm[realmIndex]?.name||'凡人'} · 放心，只要你灵石够，什么都能买到。</div>
  </div>`;
  
  items.forEach(item => {
    const canAfford = p.stones >= item.finalPrice;
    const rarityStars = (item.quality && ['凡级','灵级','地级','天级','圣级','神级'].indexOf(item.quality) >= 0) ? '⭐'.repeat(['凡级','灵级','地级','天级','圣级','神级'].indexOf(item.quality) + 1) : '';
    const qualName = item.quality || '';
    const qualColor = item.quality ? qualColors[['凡级','灵级','地级','天级','圣级','神级'].indexOf(item.quality)] || '#aaa' : '#aaa';
    
    const buyFn = item.isScroll
      ? `if(typeof learnSkillFromScroll==='function')learnSkillFromScroll('${item.scrollId}');addNarrative('你在黑市购得${item.name}。','loot');`
      : `addItemToInventory({id:'${item.id}',name:'${item.name}',type:'${item.type}',category:'${item.category||'材料'}',value:${item.value||0}},1);addNarrative('你在黑市购得${item.name}。','loot');`;
    
    const pillBadge = item.isPill ? '<span style="font-size:9px;color:#e74c3c;margin-left:4px;">🔥突破必备</span>' : '';
    
    // 🔧 2026-08-03：装备显示完整属性+与身上对比（黑市商品同样需要）
    let attrHtml = '';
    let compareHtml = '';
    if (item.equipEffect) {
      const eff = item.equipEffect;
      const slotN = { weapon:'🗡️ 武器', armor:'🛡️ 护甲', accessory:'💍 饰品', head:'👑 头饰', shoes:'👢 鞋履' };
      const slot = (typeof getEquipSlot === 'function') ? getEquipSlot(item) : 'weapon';
      const parts = [];
      if (eff.attackBonus) parts.push('攻+' + eff.attackBonus);
      if (eff.defenseBonus) parts.push('防+' + eff.defenseBonus);
      if (eff.hpBonus) parts.push('血+' + eff.hpBonus);
      if (eff.maxQiBonus) parts.push('灵+' + eff.maxQiBonus);
      if (eff.cultivationSpeed) parts.push('修炼+' + Math.round(eff.cultivationSpeed * 100) + '%');
      if (eff.qiRegen) parts.push('灵恢+' + eff.qiRegen);
      if (eff.dodge) parts.push('闪+' + Math.round(eff.dodge * 100) + '%');
      if (eff.critRate) parts.push('暴+' + Math.round(eff.critRate * 100) + '%');
      if (eff.wisdomBonus) parts.push('悟+' + eff.wisdomBonus);
      if (eff.healingBonus) parts.push('疗+' + Math.round(eff.healingBonus * 100) + '%');
      if (eff.mood) parts.push('心+' + eff.mood);
      attrHtml = `<div style="font-size:10px;color:#d46a3a;margin:2px 0;">⚔️ ${slotN[slot] || slot}：${parts.join(' ')}</div>`;
      // 对比身上（饰品多件：与已戴所有饰品属性总和对比）
      const wornItems = getWornEquipItems(slot);
      if (wornItems.length) {
        const we = {};
        const wornNames = wornItems.map(function(w) { return w.name; });
        wornItems.forEach(function(w) {
          Object.keys(w.effects || {}).forEach(function(k) { we[k] = (we[k] || 0) + (w.effects[k] || 0); });
        });
        const allKeys = ['attackBonus','defenseBonus','hpBonus','maxQiBonus','cultivationSpeed','qiRegen','dodge','critRate','wisdomBonus','healingBonus','mood'];
        const diffs = [];
        allKeys.forEach(k => {
          const nv = eff[k] || 0, ov = we[k] || 0;
          if (nv === ov) return;
          const delta = nv - ov;
          const isPct = (k === 'cultivationSpeed' || k === 'dodge' || k === 'critRate' || k === 'healingBonus');
          // 🎨 提升=红▲ 下降=绿▼
          const color = delta > 0 ? '#ef5350' : '#8bc34a';
          diffs.push(`<span style="color:${color}">${delta > 0 ? '▲' : '▼'}${typeof keyLabel === 'function' ? keyLabel(k) : k}${delta > 0 ? '+' : ''}${delta}${isPct ? '%' : ''}</span>`);
        });
        compareHtml = diffs.length
          ? `<div style="font-size:10px;color:var(--text-dim);margin:2px 0;">🔁 对比${slotN[slot]}（${wornNames.join('、')}）：${diffs.join(' ')}</div>`
          : `<div style="font-size:10px;color:var(--text-dim);margin:2px 0;">🔁 与${slotN[slot]}（${wornNames.join('、')}）属性持平</div>`;
      } else {
        compareHtml = `<div style="font-size:10px;color:#ef5350;margin:2px 0;">🆕 ${slotN[slot] || '该部位'}未装备，穿上即得</div>`;
      }
    }
    
    html += `<div style="border:1px solid ${canAfford ? 'rgba(255,255,255,0.15)' : 'rgba(100,100,100,0.3)'};border-radius:6px;padding:8px;margin-bottom:6px;${canAfford ? 'cursor:pointer;' : 'opacity:0.5;'}transition:all 0.2s;"
      onmouseenter="showItemTooltip(event,'${item.id}',null)" onmouseleave="hideItemTooltip()"
      ${canAfford ? `onclick="if(confirm('花费${item.finalPrice}灵石购买${item.name}？')){G.player.stones-=${item.finalPrice};${buyFn}updateAllUI();if(typeof closeEvent==='function')closeEvent();}"` : ''}>
      <div style="font-weight:bold;font-size:13px;">
        ${item.name}${pillBadge}
        ${qualName ? `<span style="font-size:9px;color:${qualColor};margin-left:4px;">[${qualName}]</span>` : ''}
      </div>
      ${attrHtml}${compareHtml}
      <div style="font-size:10px;color:var(--text-dim);margin:2px 0;">${item.desc} ${rarityStars}</div>
      <div style="display:flex;justify-content:space-between;font-size:11px;">
        <span style="color:#e74c3c;font-weight:bold;">💰${item.finalPrice}灵石 ${canAfford ? '' : '(灵石不足)'}</span>
        <span style="color:var(--accent);font-size:10px;">×${item.priceMult}溢价</span>
      </div>
    </div>`;
  });
  
  html += `<div style="text-align:center;font-size:10px;color:var(--text-dim);margin-top:8px;">── 商品就这么多，刷新看看新货 ──</div>`;
  
  // 🔧 刷新+离开按钮放到 event-choices 固定区（不随 body 滚动，永远可见）
  showCustomModal('🏴 黑市', html, { noCloseBtn: true });
  document.getElementById('event-choices').innerHTML = `
    <button class="event-choice-btn" onclick="if(G.player.stones>=${refreshCost}){G.player.stones-=${refreshCost};closeEvent();showBlackMarket();}else{addNarrative('灵石不够！','system');}" style="font-size:11px;">🔄 刷新（${refreshCost}灵石）</button>
    <button class="event-choice-btn" onclick="closeEvent();">离开</button>
  `;
}

function buyMarketItem(itemId, price) {
  if (G.player.stones < price) {
    addNarrative('灵石不够，买不起。', 'system'); return;
  }
  G.player.stones -= price;
  const item = ITEM_DB.find(i => i.id === itemId);
  if (item) addItemToInventory(item, 1);
  if (typeof addDailyLogEntry === 'function') addDailyLogEntry('market', '购买了' + (item?item.name:itemId));
  if (typeof generateActionNarrative === 'function') generateActionNarrative({playerName:G.player.name, location:'坊市', time:G.time.period+'时'}, 'market');
  addNarrative(`你在坊市中购得${item ? item.name : itemId}。`, 'event');
  // 🛍️ 连续购买：不关闭窗口，刷新价格显示，方便多买
  if (typeof showMarketModal === 'function') showMarketModal();
  updateAllUI();
}

// 购买功法卷轴（直接学习，不占背包）
function buySkillScroll(skillId, price) {
  if (G.player.stones < price) {
    addNarrative('灵石不够。', 'system'); return;
  }
  if (typeof learnSkillFromScroll === 'function') {
    const result = learnSkillFromScroll(skillId);
    if (result) {
      G.player.stones -= price;
      addNarrative(`你付了${price}灵石买下卷轴，当场参悟。`, 'event');
    } else {
      addNarrative('这卷功法你已学会，不必再买。', 'system');
      return;
    }
  }
  // 🛍️ 连续购买：不关闭窗口
  if (typeof showMarketModal === 'function') showMarketModal();
  updateAllUI();
}

// ── 战斗弹窗 ──
let currentCombat = null;

function showCombatModal(combat) {
  currentCombat = combat;
  document.getElementById('combat-overlay').classList.remove('hidden');
  renderCombat();
}

function renderCombat() {
  const c = currentCombat;
  if (!c) return;
  const hpBar = Math.max(0, Math.round((c.monsterHp / c.monster.hp) * 100));
  const pHP = Math.max(0, Math.round((c.player.hp / c.player.maxHp) * 100));
  const pQi = Math.max(0, Math.round((c.player.qi / c.player.maxQi) * 100));
  
  // 🐾 灵兽参战行（存活灵兽显示头像+状态，受伤变红）
  let beastRowHtml = '';
  try {
    const beasts = (G.player && G.player.beasts) || [];
    const aliveBeasts = beasts.filter(b => b && b.hp > 0);
    if (aliveBeasts.length > 0) {
      const chips = aliveBeasts.map(b => {
        const bd = (typeof BEAST_DB !== 'undefined') ? BEAST_DB[b.id] : null;
        const icon = bd ? bd.icon : '🐾';
        const hpPct = Math.max(0, Math.round((b.hp / b.maxHp) * 100));
        const hpColor = hpPct > 50 ? '#7dce9a' : hpPct > 25 ? '#e8c88a' : '#e74c3c';
        return `<span style="display:inline-flex;align-items:center;gap:3px;border:1px solid rgba(120,200,180,0.25);border-radius:12px;padding:1px 7px;margin:1px 2px;font-size:9px;color:#7dce9a;background:rgba(30,100,80,0.08);">${icon} ${b.name}<span style="color:${hpColor};">❤️${hpPct}%</span></span>`;
      });
      beastRowHtml = `<div style="margin-bottom:6px;font-size:9px;color:var(--text-dim);">🐾 灵兽助阵：${chips.join('')}</div>`;
    }
  } catch(e) {}
  
  document.getElementById('combat-body').innerHTML = `
    <div style="margin-bottom:8px;">
      <div style="display:flex;justify-content:space-between;">
        <b>👹 ${c.monsterName}</b><span>HP: ${Math.round(Math.max(0,c.monsterHp))}/${c.monster.hp}</span>
      </div>
      <div class="progress-bar-bg" style="height:6px;">
        <div class="progress-bar-fill" style="width:${hpBar}%;background:var(--danger);height:6px;"></div>
      </div>
    </div>
    <div style="margin-bottom:8px;">
      <div style="display:flex;justify-content:space-between;">
        <b>⚔️ ${G.player.name}</b>
        <span>HP: ${Math.round(c.player.hp)}/${c.player.maxHp} | 灵力: ${Math.round(c.player.qi)}/${c.player.maxQi}</span>
      </div>
      <div class="progress-bar-bg" style="height:6px;">
        <div class="progress-bar-fill" style="width:${pHP}%;background:var(--heal);height:6px;"></div>
      </div>
    </div>
    ${beastRowHtml}
    <div class="combat-log">${c.log.join('<br>')}</div>
  `;
  
  if (c.isActive) {
    const hasItems = G.player.inventory.some(i => i.use && (i.id==='huiqi_dan'||i.id==='zhixue_san'||i.id==='hgc_grass'));
    document.getElementById('combat-actions').innerHTML = `
      <button class="combat-action-btn" onclick="combatAtk()">⚔️ 攻击</button>
      <button class="combat-action-btn" onclick="combatDef()">🛡️ 防御</button>
      ${hasItems ? '<button class="combat-action-btn" onclick="combatUse()">💊 用药</button>' : ''}
      <button class="combat-action-btn" onclick="combatFlee()">🏃 逃跑</button>
    `;
  } else {
    document.getElementById('combat-actions').innerHTML = `<button class="combat-action-btn" onclick="closeCombat()">继续</button>`;
  }
}

function combatAtk() { if(currentCombat?.isActive){currentCombat.playerAttack();renderCombat();updateAllUI();} }
function combatDef() { if(currentCombat?.isActive){currentCombat.playerDefend();renderCombat();updateAllUI();} }
function combatUse() { if(currentCombat?.isActive){currentCombat.useItem();renderCombat();updateAllUI();} }
function combatFlee() { if(currentCombat?.isActive){currentCombat.flee();if(!currentCombat.isActive)closeCombat();else renderCombat();} }
function closeCombat() { document.getElementById('combat-overlay').classList.add('hidden'); currentCombat=null; updateAllUI(); }

// ==========================
// 成就系统
// ==========================
function showAchievements() {
  document.getElementById('achievement-overlay').classList.remove('hidden');
  const body = document.getElementById('achievement-body');

  const allAch = [
    { icon:'🌱', name:'初入修仙', desc:'踏入练气一层' },
    { icon:'💪', name:'炼体初成', desc:'达到炼体一重' },
    { icon:'🔥', name:'三昧悟道', desc:'学会三昧真火诀' },
    { icon:'💰', name:'第一桶金', desc:'积累100灵石' },
    { icon:'⚔️', name:'首次战斗', desc:'击败第一个敌人' },
    { icon:'🧘', name:'双修大成', desc:'炼体+炼气均达三重' },
    { icon:'🗡️', name:'除暴安良', desc:'击败黑风山贼' },
    { icon:'🔮', name:'古刹探秘', desc:'探索雷音古刹' },
    { icon:'💎', name:'散修之光', desc:'背包中有10种不同的物品' },
    { icon:'🌊', name:'碧波寻宝', desc:'发现碧波湖的秘密' },
  ];

  const p = G.player;
  const unlocked = [];
  if(p.qiRealmIndex>=0) unlocked.push(0);
  if(p.bodyRealmIndex>=0) unlocked.push(1);
  if(p.skills.find(s=>s.id==='sanmei')) unlocked.push(2);
  if(p.stones>=100) unlocked.push(3);
  if(p.eventHistory.filter(e=>e.includes('击败')).length>0) unlocked.push(4);
  if(p.bodyRealmIndex>=2&&p.qiRealmIndex>=2) unlocked.push(5);
  if(p.eventHistory.filter(e=>e.includes('黑风')).length) unlocked.push(6);
  if(G.currentScene==='leiyin_temple') unlocked.push(7);
  if(p.inventory.length>=10) unlocked.push(8);
  if(G.currentScene==='bibo_lake') unlocked.push(9);

  body.innerHTML = allAch.map((a,i)=>{
    const has=unlocked.includes(i);
    return `<div class="ach-item">
      <span class="ach-icon">${has?a.icon:'🔒'}</span>
      <span style="flex:1">${has?`<b>${a.name}</b>`:`<span style="color:var(--text-dim)">???</span>`}</span>
      <span style="font-size:11px;color:var(--text-dim)">${has?a.desc:'未达成'}</span>
    </div>`;
  }).join('');
  body.innerHTML += `<div style="margin-top:12px;font-size:12px;color:var(--text-dim);text-align:center;">已解锁：${unlocked.length}/${allAch.length}</div>`;
}

function closeAchievements() { document.getElementById('achievement-overlay').classList.add('hidden'); }

// ==========================

// ==========================
// 叙事渲染
// ==========================
function renderNarrativeEntry(entry) {
  const log = document.getElementById('narrative-log');
  const div = document.createElement('div');
  // 大时刻类型使用 innerHTML 渲染富文本
  const richTypes = ['epic','milestone','breakthrough','loot-rare','loot-legend','narr-combat'];
  if (richTypes.includes(entry.type)) {
    div.className = `narrative-entry narr-${entry.type}`;
    div.innerHTML = entry.text;
  } else {
    div.className = `narrative-entry narr-${entry.type}`;
    div.textContent = entry.text;
  }
  log.appendChild(div);
  // 📦 防DOM无限膨胀：叙事节点超过200个时裁剪（保留最近）
  while (log.children.length > 200) {
    log.removeChild(log.firstChild);
  }
  log.scrollTop = log.scrollHeight;
}

// ==========================
// 导出
// ==========================
function showTowerHint() {
  var p = G.player;
  if (!p) return;
  var reason = (typeof getUnlockReason === 'function') ? getUnlockReason() : '';
  if (!reason) reason = '🏛️ 试炼塔在幽冥界深处。路径：青云镇→古井入口→幽冥鬼窟→试炼之塔';
  addNarrative(reason, 'system');
}

window.closeEvent = closeEvent;
window.showWorldMap = showWorldMap;
window.closeWorldMap = closeWorldMap;
window.renderWorldMap = renderWorldMap;
window.mapMove = mapMove;
window.showTowerHint = showTowerHint;
window.updateAllUI = updateAllUI;
window.updateActions = updateActions;
window.updateBottomBar = updateBottomBar;
window.showCharacterSelect = showCharacterSelect;
window.showCustomModal = showCustomModal;
window.closeAchievements = closeAchievements;
