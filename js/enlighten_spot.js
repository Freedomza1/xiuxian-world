// === 唯我独仙 · 悟道景观系统 ===
// 特定场景 + 特定时辰 → 天地奇观 → 顿悟机缘
// 月圆/暴雨/雪夜/日出/日落 等时刻，在对应场景触发悟道点

// ── 悟道点配置 ──
const ENLIGHTEN_SPOTS = [
  {
    id: 'moon_sword',
    scene: 'lingyun_peak',   // 灵云峰顶
    sceneName: '灵云峰',
    condition: '月圆之夜',
    timeReq: { hour: [20, 22], dayMod: 15 }, // 亥时+月圆（day%30==15 简化：每月十五）
    title: '🌕 月圆·剑意凌霜',
    desc: '圆月当空，霜华满地。你立于峰顶，月华如水流淌过你的剑锋。这一刻，天地间只剩剑与月。',
    rewards: { attack: 2, mood: 8, exp: 200, skillHint: '剑意' },
    tag: '🌕',
  },
  {
    id: 'rain_water',
    scene: 'luoxia_senlin',  // 落霞森林
    sceneName: '落霞森林',
    condition: '暴雨倾盆',
    timeReq: { weather: 'rain' },
    title: '🌧️ 暴雨·水之意境',
    desc: '暴雨如注，万木低垂。你静立雨中，任由雨水冲刷。雨滴砸在叶片、岩石、土地上的声音，渐渐汇成一首古老的曲调。',
    rewards: { mood: 10, wisdom: 2, exp: 250 },
    tag: '🌧️',
  },
  {
    id: 'snow_ice',
    scene: 'bingfeng_grotto', // 冰风石窟
    sceneName: '冰风石窟',
    condition: '雪夜',
    timeReq: { hour: [22, 24], weather: 'snow' },
    title: '❄️ 雪夜·冰心玉壶',
    desc: '洞外风雪交加，洞内却静得能听见冰晶凝结的声音。你指尖轻触冰壁，寒意顺着经脉流转，竟有一种前所未有的通透。',
    rewards: { mood: 12, wisdom: 3, exp: 300, luck: 1 },
    tag: '❄️',
  },
  {
    id: 'dawn_dao',
    scene: 'qingyun_zhen',   // 青云镇
    sceneName: '青云镇',
    condition: '日出时分',
    timeReq: { hour: [5, 7] },
    title: '🌅 日出·道心初醒',
    desc: '晨光穿透薄雾，小镇从沉睡中醒来。炊烟、鸡鸣、叫卖声……你忽然明白：道，不在九天之上，就在这人间烟火里。',
    rewards: { mood: 8, wisdom: 2, exp: 150 },
    tag: '🌅',
  },
  {
    id: 'sunset_gate',
    scene: 'guji_ruins',    // 远古遗迹
    sceneName: '远古遗迹',
    condition: '残阳如血',
    timeReq: { hour: [17, 19] },
    title: '🌇 残阳·万古苍凉',
    desc: '残阳如血，染红断壁残垣。风沙低吟，仿佛还在传颂千年前的故事。你忽然感到自己的渺小，也感到自己的永恒。',
    rewards: { mood: 10, exp: 200, luck: 2 },
    tag: '🌇',
  },
  {
    id: 'moon_lake',
    scene: 'bibo_lake',     // 碧波湖
    sceneName: '碧波湖',
    condition: '月映湖心',
    timeReq: { hour: [20, 22] },
    title: '🌊 月映·上善若水',
    desc: '月光洒在湖面，碎成万千银鳞。你望着水中月、月中水，忽然想起那句——上善若水，水善利万物而不争。',
    rewards: { mood: 9, wisdom: 3, exp: 180, qi: 50 },
    tag: '🌊',
  },
];

// ── 检查当前场景是否有可触发的悟道点 ──
function checkEnlightenSpot(sceneId) {
  const p = G.player;
  if (!p) return null;
  const Gt = G.time;
  if (!Gt) return null;
  
  for (const spot of ENLIGHTEN_SPOTS) {
    if (spot.scene !== sceneId) continue;
    // 已悟过？每天每个点一次
    if (!p._enlightenDone) p._enlightenDone = {};
    if (p._enlightenDone[spot.id] === Gt.day) continue;
    
    // 时辰条件
    if (spot.timeReq.hour) {
      const h = Gt.hour;
      if (h < spot.timeReq.hour[0] || h >= spot.timeReq.hour[1]) continue;
    }
    // 月圆条件（简化：日期模30==15 或 用现有时间系统）
    if (spot.timeReq.dayMod !== undefined) {
      if ((Gt.day % 30) !== spot.timeReq.dayMod) continue;
    }
    // 天气条件（雨/雪）
    if (spot.timeReq.weather) {
      const w = typeof autoWeather !== 'undefined' ? autoWeather : '';
      if (spot.timeReq.weather === 'rain' && w !== '雨' && w !== '雷雨') continue;
      if (spot.timeReq.weather === 'snow' && w !== '雪') continue;
    }
    return spot;
  }
  return null;
}

// 主动查看当前场景的悟道点
function checkSceneEnlighten() {
  const spot = checkEnlightenSpot(G.currentScene);
  if (!spot) return null;
  return spot;
}

// 触发悟道（进入场景时自动提示，或玩家主动查看）
function tryTriggerEnlighten(sceneId) {
  const spot = checkEnlightenSpot(sceneId);
  if (!spot) return false;
  
  const p = G.player;
  // 🤖 自动模式：不弹窗，直接入定感悟（悟道是纯增益）
  if (typeof G !== 'undefined' && G.autoMode === true) {
    if (typeof confirmEnlighten === 'function') {
      setTimeout(() => { try { confirmEnlighten(spot.id); } catch(e) {} }, 400);
    }
    return true;
  }
  
  // 弹窗让玩家选择是否入定
  const html = `
    <div style="text-align:center;padding:4px;">
      <div style="font-size:14px;font-weight:bold;color:#c9a96e;letter-spacing:1px;">${spot.title}</div>
      <div style="font-size:11px;color:var(--text-dim);margin:4px 0;">${spot.condition}</div>
      <div style="font-size:12px;line-height:1.9;color:#ccd;margin:10px 0;padding:12px;background:rgba(100,150,200,0.06);border-radius:10px;border:1px solid rgba(100,150,200,0.2);">
        ${spot.desc}
      </div>
      <div style="font-size:10px;color:#8cc;">机缘难得，是否盘膝入定，感悟天地？</div>
      <div style="display:flex;gap:8px;justify-content:center;margin-top:10px;">
        <button class="event-choice-btn" onclick="confirmEnlighten('${spot.id}')" style="background:rgba(100,200,150,0.2);border-color:#7dce9a;color:#7dce9a;font-size:12px;">🧘 入定感悟</button>
        <button class="event-choice-btn" onclick="closeEvent()" style="font-size:12px;">离开</button>
      </div>
    </div>`;
  showCustomModal('✨ 天地奇观', html, { noCloseBtn: true });
  G._pendingEnlighten = spot;
  return true;
}

// 确认悟道
function confirmEnlighten(spotId) {
  const spot = ENLIGHTEN_SPOTS.find(s => s.id === spotId);
  if (!spot) { closeCustomModal(); return; }
  const p = G.player;
  if (!p._enlightenDone) p._enlightenDone = {};
  p._enlightenDone[spotId] = G.time.day; // 每日一次
  
  closeCustomModal();
  
  // 结算奖励
  const r = spot.rewards || {};
  if (r.mood) p.mood = Math.min(100, (p.mood || 0) + r.mood);
  if (r.wisdom) p.wisdom = Math.min(100, (p.wisdom || 0) + r.wisdom);
  if (r.luck) p.luck = Math.min(100, (p.luck || 0) + r.luck);
  if (r.attack) p.attack = (p.attack || 0) + r.attack;
  if (r.exp) { if (typeof gainCultivation === 'function') gainCultivation('qi', r.exp); else p.qiCultivationPoints = (p.qiCultivationPoints || 0) + r.exp; }
  if (r.qi) p.qi = Math.min(p.maxQi || p.qi, (p.qi || 0) + r.qi);
  
  // 特殊：剑意顿悟可能悟出新技能提示
  let extraHtml = '';
  if (r.skillHint) {
    extraHtml = `<div style="font-size:10px;color:#c9a96e;">⚔️ 你似乎摸到了「${r.skillHint}」的门槛……</div>`;
  }
  
  addNarrative(`<div style="border:1px solid rgba(200,170,100,0.5);border-radius:10px;padding:12px;margin:8px 0;background:linear-gradient(135deg,rgba(60,40,20,0.15),rgba(100,80,40,0.1));">
    <div style="font-weight:bold;color:#e8c88a;font-size:13px;">✨ 顿悟！${spot.title.replace(/^[^\s]+\s*/, '')}</div>
    <div style="font-size:11px;color:var(--text-dim);margin-top:5px;line-height:1.7;">${spot.desc}</div>
    <div style="font-size:10px;color:#8cc;margin-top:6px;">
      ${r.mood ? `😌 心境 +${r.mood} ` : ''}${r.wisdom ? `🧠 悟性 +${r.wisdom} ` : ''}${r.luck ? `🍀 气运 +${r.luck} ` : ''}${r.attack ? `⚔️ 攻击 +${r.attack} ` : ''}${r.exp ? `📖 修为 +${r.exp} ` : ''}${r.qi ? `💧 灵力 +${r.qi} ` : ''}
    </div>
    ${extraHtml}
  </div>`, 'milestone');
  
  // 修为满则尝试突破
  if (r.exp && typeof getCultivationProgress === 'function' && getCultivationProgress('qi') >= 100) {
    if (typeof qiBreakthroughCheck === 'function') setTimeout(() => { try { qiBreakthroughCheck(); } catch(e) {} }, 400);
  }
  updateAllUI();
}

// 悟道点总览（人物面板可查看）
function showEnlightenGuide() {
  let html = '<div style="padding:2px;">';
  html += '<div style="font-size:11px;color:var(--text-dim);margin-bottom:8px;">🌌 天地有灵，万物有道。在特定时刻造访特定之地，或可触发顿悟机缘：</div>';
  ENLIGHTEN_SPOTS.forEach(s => {
    const done = G.player._enlightenDone && G.player._enlightenDone[s.id] === G.time.day;
    const here = G.currentScene === s.scene;
    html += `<div style="border:1px solid ${done ? 'rgba(100,200,100,0.25)' : (here ? 'rgba(200,170,100,0.4)' : 'rgba(255,255,255,0.06)')};border-radius:6px;padding:8px;margin:4px 0;background:${done ? 'rgba(40,100,40,0.08)' : (here ? 'rgba(80,60,20,0.08)' : 'transparent')};">
      <div style="display:flex;justify-content:space-between;align-items:center;">
        <span style="font-size:12px;font-weight:bold;color:${done ? '#7dce9a' : '#e8c88a'};">${s.tag} ${s.title}</span>
        <span style="font-size:9px;color:${done ? '#7dce9a' : 'var(--text-dim)'};">${done ? '✅ 今日已悟' : (here ? '📍 你在这里' : s.sceneName)}</span>
      </div>
      <div style="font-size:9px;color:var(--text-dim);margin-top:3px;">${s.condition} · ${s.rewards.mood ? '😌+' + s.rewards.mood : ''}${s.rewards.wisdom ? ' 🧠+' + s.rewards.wisdom : ''}${s.rewards.exp ? ' 📖+' + s.rewards.exp : ''}${s.rewards.luck ? ' 🍀+' + s.rewards.luck : ''}</div>
    </div>`;
  });
  html += '</div>';
  showCustomModal('🌌 悟道图录', html + '<button class="event-choice-btn" onclick="closeEvent()">关闭</button>');
}

// 导出
window.ENLIGHTEN_SPOTS = ENLIGHTEN_SPOTS;
window.checkSceneEnlighten = checkSceneEnlighten;
window.tryTriggerEnlighten = tryTriggerEnlighten;
window.confirmEnlighten = confirmEnlighten;
window.showEnlightenGuide = showEnlightenGuide;
