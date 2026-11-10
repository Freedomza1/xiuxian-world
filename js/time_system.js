// === 唯我独仙 · 时辰系统 ===
// 实时时间流逝 + 可配置流速比

// 流速比：1秒现实 = X分钟游戏内
// 默认：1秒 = 0.5分钟（1小时现实 ≈ 1.25天游戏）
// 慢一点，才有时间看风景、品故事
const DEFAULT_FLOW_RATIO = 0.5; // 分钟/秒
let timeFlowRatio = DEFAULT_FLOW_RATIO;
let timeFlowInterval = null;
let timeFlowActive = false;
let lastRealTimestamp = 0;

// 实时时钟刷新
let clockInterval = null;

// ==========================
// 十二时辰名称
// ==========================
const SHI_CHEN = [
  { period: '子时', hour: 23, desc: '夜半' },
  { period: '丑时', hour: 1,  desc: '鸡鸣' },
  { period: '寅时', hour: 3,  desc: '平旦' },
  { period: '卯时', hour: 5,  desc: '日出' },
  { period: '辰时', hour: 7,  desc: '食时' },
  { period: '巳时', hour: 9,  desc: '隅中' },
  { period: '午时', hour: 11, desc: '日中' },
  { period: '未时', hour: 13, desc: '日昳' },
  { period: '申时', hour: 15, desc: '晡时' },
  { period: '酉时', hour: 17, desc: '日入' },
  { period: '戌时', hour: 19, desc: '黄昏' },
  { period: '亥时', hour: 21, desc: '人定' },
];

function getShiChenName(hour24) {
  for (const sc of SHI_CHEN) {
    if (hour24 >= sc.hour && hour24 < sc.hour + 2) return sc.period;
  }
  return hour24 >= 23 || hour24 < 1 ? '子时' : '丑时';
}

// ==========================
// 启动实时时间流
// ==========================
function startTimeFlow() {
  if (timeFlowActive) return;
  timeFlowActive = true;
  lastRealTimestamp = Date.now();
  
  // 持续推进游戏时间（每1秒推进）
  timeFlowInterval = setInterval(() => {
    if (!G.time) return;
    if (document.hidden) {
      // 标签页不可见时跳过，减少性能开销
      return;
    }
    
    const now = Date.now();
    const elapsedSec = (now - lastRealTimestamp) / 1000;
    lastRealTimestamp = now;
    
    if (document.hidden) return; // 切走时不推进
    
    // 如果超过10秒没更新，跳过这一轮（防切回来大跳跃）
    if (elapsedSec > 20) return;
    
    // 按流速比推进游戏分钟
    const gameMinutes = elapsedSec * timeFlowRatio;
    const gameHours = gameMinutes / 60;
    
    // 只要有超过半分钟的时间流逝，就推进
    if (gameMinutes >= 0.5) {
      advanceTime(gameHours);
    }
  }, 1000);
  
  // 实时时钟更新（每秒刷新一次显示）
  if (clockInterval) clearInterval(clockInterval);
  clockInterval = setInterval(updateClockDisplay, 1000);
  
  updateClockDisplay();
}

function stopTimeFlow() {
  timeFlowActive = false;
  if (timeFlowInterval) {
    clearInterval(timeFlowInterval);
    timeFlowInterval = null;
  }
  if (clockInterval) {
    clearInterval(clockInterval);
    clockInterval = null;
  }
}

// ==========================
// 实时时钟显示更新
// ==========================
function updateClockDisplay() {
  const el = document.getElementById('real-clock');
  if (!el) return;
  
  const now = new Date();
  const h = String(now.getHours()).padStart(2, '0');
  const m = String(now.getMinutes()).padStart(2, '0');
  const s = String(now.getSeconds()).padStart(2, '0');
  
  // 游戏内时辰
  const gameHour = G.time ? G.time.hour : 8;
  const shiChen = getShiChenName(Math.floor(gameHour));
  const gameDay = G.time ? G.time.day : 1;
  const gameYear = G.time ? G.time.year || 1 : 1;
  
  el.innerHTML = `
    <span class="clock-real">🕐 ${h}:${m}:${s}</span>
    <span class="clock-game">☯️ ${shiChen} · 第${gameDay}日 · 纪元${gameYear}年</span>
  `;
}

// ==========================
// 设置时间流速
// ==========================
function setTimeFlowRatio(ratio) {
  timeFlowRatio = Math.max(0.25, Math.min(120, ratio));
  addNarrative(`⏳ 时间流速调整为：1秒现实 = ${timeFlowRatio}分钟游戏内`, 'system');
  return timeFlowRatio;
}

// ==========================
// 流速选择弹窗
// ==========================
function showTimeSettings() {
  const presets = [
    { label: '🐌 漫步（1s=0.5min）', ratio: 0.5 },
    { label: '🦥 慢速（1s=2min）', ratio: 2 },
    { label: '🐢 较慢（1s=6min）', ratio: 6 },
    { label: '⚖️ 标准（1s=12min）', ratio: 12 },
    { label: '🐇 较快（1s=30min）', ratio: 30 },
    { label: '🚀 极速（1s=60min）', ratio: 60 },
  ];
  
  let html = `
    <div style="margin-bottom:12px;">
      <div>⏳ 当前流速：1秒现实 = ${timeFlowRatio}分钟游戏内</div>
      <div style="font-size:12px;color:var(--text-dim);">1小时 ≈ ${Math.round(timeFlowRatio * 60 / 24)}天游戏内</div>
    </div>
    <div style="display:flex;flex-direction:column;gap:6px;">
  `;
  presets.forEach(p => {
    html += `<button class="event-choice-btn" onclick="setTimeFlowRatio(${p.ratio});closeCustomModal();updateClockDisplay()">${p.label}</button>`;
  });
  html += `</div>`;
  
  showCustomModal('⏳ 时间流速设置', html);
}

// ==========================
// 初始化
// ==========================
function initTimeSystem() {
  // 防止重复初始化
  if (document.getElementById('real-clock')) return;
  
  // 更新顶栏时钟
  const topbar = document.getElementById('topbar');
  const actions = topbar ? topbar.querySelector('.top-actions') : null;
  if (topbar && actions) {
    const clockEl = document.createElement('div');
    clockEl.id = 'real-clock';
    topbar.insertBefore(clockEl, actions);
  }
  
  // 启动时间流
  startTimeFlow();
}

// 导出
window.SHI_CHEN = SHI_CHEN;
window.getShiChenName = getShiChenName;
window.startTimeFlow = startTimeFlow;
window.stopTimeFlow = stopTimeFlow;
window.setTimeFlowRatio = setTimeFlowRatio;
window.showTimeSettings = showTimeSettings;
window.initTimeSystem = initTimeSystem;
