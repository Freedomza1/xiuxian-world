// === 唯我独仙 · 第二纪元「冰阁」门派大地图 ===
// 冰阁山门内部地图：10大区域 + 50弟子 + 门派修炼/交友/任务
// 2026-08-04 · 与 era2.js / sect_npcs.js 配套

// ── 冰阁山门布局（10大区域） ──
const SECT_MAP_AREAS = [
  { id:'sect_gate', name:'山门', icon:'⛩️', x:3, y:9, desc:'冰阁山门，两根冰晶石柱擎天而立。石柱上刻着「冰阁当立，传承不绝」八个字。', type:'entrance', feature:'入口' },
  { id:'sect_hall', name:'议事厅', icon:'🏛️', x:3, y:7, desc:'冰阁核心，掌门议事之所。厅中悬着一面冰晶屏风，屏风后是历代掌门画像。', type:'hall', feature:'门派管理·任务发布' },
  { id:'sect_stage', name:'演武场', icon:'⚔️', x:1, y:7, desc:'青石铺就的演武场，四角立着冰晶桩。清晨常有弟子在此练剑，剑光与冰晶交映。', type:'training', feature:'切磋·修炼' },
  { id:'sect_library', name:'藏经阁', icon:'📚', x:5, y:7, desc:'三层冰阁，藏书万卷。墨雪堂守着这里，也守着罗峰留下的半卷剑谱。', type:'library', feature:'功法·典籍' },
  { id:'sect_alchemy', name:'丹房', icon:'⚗️', x:1, y:5, desc:'药玄子的地盘，药香常年不散。三座丹炉日夜不息，偶尔传出炸炉的闷响。', type:'alchemy', feature:'炼丹·丹方' },
  { id:'sect_discipline', name:'刑堂', icon:'⚖️', x:5, y:5, desc:'雪无痕坐镇之地，堂前悬着一面「律」字铁牌。门规在此执行，一视同仁。', type:'discipline', feature:'门规·执法' },
  { id:'sect_dorm', name:'弟子居', icon:'🏠', x:1, y:3, desc:'弟子们居住的院落群，依山而建，错落有致。清晨鸡鸣，傍晚炊烟。', type:'dorm', feature:'交友·日常' },
  { id:'sect_field', name:'灵田', icon:'🌾', x:5, y:3, desc:'后山开辟的百亩灵田，种着各类灵药。阿洛最爱蹲在田埂上看灵草发芽。', type:'field', feature:'种植·采集' },
  { id:'sect_treasury', name:'藏宝阁', icon:'💎', x:3, y:5, desc:'冰阁宝库，铁砚管着钥匙。贡献兑换，童叟无欺——就是总爱抹零。', type:'treasury', feature:'贡献兑换' },
  { id:'sect_forbidden', name:'后山禁地', icon:'❄️', x:3, y:2, desc:'冰风石窟深处，冰尘子闭关之地。结界长明，非元婴不得入内。', type:'forbidden', feature:'苦修·传承' },
];

// ── 冰阁弟子池（50人） ──
// 每脉 12-13 人：剑脉 13 / 丹脉 12 / 符脉 12 / 体脉 13 = 50
const SECT_DISCIPLE_POOL = [
  // ═══ 剑脉 13人 ═══
  { id:'d_s_01', name:'萧承影', gender:'男', age:21, line:'sword', rank:'内门', roots:['金','火'], personality:'锋芒毕露', desc:'大师姐冰澜的第一个亲传师弟，剑如其人，快而狠。嘴上不服人，心里敬重冰澜敬重得要命。' },
  { id:'d_s_02', name:'云知秋', gender:'女', age:19, line:'sword', rank:'内门', roots:['水','木'], personality:'沉静内敛', desc:'冰澜最看好的苗子，悟性极高。她总说剑是冷的，握剑的人心要是热的。' },
  { id:'d_s_03', name:'顾长风', gender:'男', age:23, line:'sword', rank:'内门', roots:['风','金'], personality:'豪爽不羁', desc:'酒鬼剑客，剑不离身酒不离口。据说他练剑是为了给师父报仇。' },
  { id:'d_s_04', name:'沈青梧', gender:'女', age:22, line:'sword', rank:'外门', roots:['木'], personality:'温柔坚韧', desc:'从青云镇来的姑娘，剑法平平但从不懈怠。她偷偷喜欢着萧承影，谁都没告诉。' },
  { id:'d_s_05', name:'陆惊鸿', gender:'男', age:20, line:'sword', rank:'外门', roots:['金','土'], personality:'争强好胜', desc:'天赋极高却总爱走捷径，被雪无痕罚过三次。心里其实明白：剑道没有捷径。' },
  { id:'d_s_06', name:'白素衣', gender:'女', age:18, line:'sword', rank:'外门', roots:['水'], personality:'清冷孤傲', desc:'出身书香门第，家道中落后拜入冰阁。她练剑时像在写文章，一笔一划。' },
  { id:'d_s_07', name:'洛青霜', gender:'女', age:17, line:'sword', rank:'外门', roots:['冰','水'], personality:'外冷内热', desc:'天生冰灵根，是百里冰之后罕见的冰系天才。她话很少，但阿洛摔倒时她第一个去扶。' },
  { id:'d_s_08', name:'程子墨', gender:'男', age:24, line:'sword', rank:'外门', roots:['土','金'], personality:'沉默寡言', desc:'剑法学得最慢，但十年如一日地练同一招。墨雪堂说：此子可成大器。' },
  { id:'d_s_09', name:'秋凝霜', gender:'女', age:20, line:'sword', rank:'外门', roots:['冰'], personality:'细腻敏感', desc:'洛青霜的姐姐，为了照顾妹妹才入冰阁。剑法不精，但心如明镜。' },
  { id:'d_s_10', name:'方定岳', gender:'男', age:26, line:'sword', rank:'外门', roots:['土'], personality:'稳重厚道', desc:'曾是镖师，护镖途中被冰澜救下。他说这辈子就跟着冰阁走了。' },
  { id:'d_s_11', name:'许燕回', gender:'女', age:19, line:'sword', rank:'外门', roots:['火','风'], personality:'活泼跳脱', desc:'练剑像跳舞，招式花哨但有用。她最大的愿望是成为像冰澜一样帅气的剑修。' },
  { id:'d_s_12', name:'宋执一', gender:'男', age:22, line:'sword', rank:'外门', roots:['金','火'], personality:'固执认真', desc:'认死理，练剑一定要练到完美才罢休。手上的老茧比谁都厚。' },
  { id:'d_s_13', name:'江晚吟', gender:'女', age:21, line:'sword', rank:'外门', roots:['水','金'], personality:'淡泊从容', desc:'曾是琴师，入冰阁后剑琴双修。她说剑有剑的韵律，琴有琴的节奏，都是道。' },

  // ═══ 丹脉 12人 ═══
  { id:'d_d_01', name:'苏百草', gender:'男', age:25, line:'alchemy', rank:'内门', roots:['木','火'], personality:'痴迷药理', desc:'药玄子的首徒，丹道天赋极高。唯一的缺点是：试药时总拿自己当小白鼠。' },
  { id:'d_d_02', name:'温以宁', gender:'女', age:20, line:'alchemy', rank:'内门', roots:['木','水'], personality:'温婉细心', desc:'药玄子最放心的弟子，配药从不出错。她研制的清心茶，全阁上下都爱喝。' },
  { id:'d_d_03', name:'常百味', gender:'男', age:28, line:'alchemy', rank:'内门', roots:['火','土'], personality:'热情健谈', desc:'长得像厨师，说话像说书，炼丹像炒菜。他炼的丹药总带点烟火气，药效却出奇地好。' },
  { id:'d_d_04', name:'林半夏', gender:'女', age:19, line:'alchemy', rank:'外门', roots:['木'], personality:'天真好奇', desc:'对每种灵草都充满好奇，随身带着一本《本草图鉴》，上面画满了涂鸦。' },
  { id:'d_d_05', name:'秦艽艽', gender:'女', age:22, line:'alchemy', rank:'外门', roots:['木','水'], personality:'细心周到', desc:'名字拗口但人很好，总记得每个师兄师姐爱吃什么丹药。' },
  { id:'d_d_06', name:'葛藤生', gender:'男', age:30, line:'alchemy', rank:'外门', roots:['土','木'], personality:'老实巴交', desc:'种了二十年药的老药农，入了冰阁还是改不了伺候灵草的习性。' },
  { id:'d_d_07', name:'茯苓子', gender:'男', age:24, line:'alchemy', rank:'外门', roots:['木','火'], personality:'机灵圆滑', desc:'嘴甜会来事，丹房里最会哄药玄子开心的人。但炼丹时绝不含糊。' },
  { id:'d_d_08', name:'白芷若', gender:'女', age:21, line:'alchemy', rank:'外门', roots:['水','木'], personality:'安静专注', desc:'存在感很低，但丹房炸炉时第一个冲进去抢救的总是她。' },
  { id:'d_d_09', name:'当归子', gender:'男', age:27, line:'alchemy', rank:'外门', roots:['木','土'], personality:'忠厚老实', desc:'名字被药玄子笑说"该叫当归，总想回家"。其实他早把冰阁当成了家。' },
  { id:'d_d_10', name:'王不留', gender:'男', age:23, line:'alchemy', rank:'外门', roots:['火','金'], personality:'冒失莽撞', desc:'炼丹总炸炉，但他有个绝活：能凭气味分辨丹药好坏，百试百灵。' },
  { id:'d_d_11', name:'何首乌', gender:'男', age:29, line:'alchemy', rank:'外门', roots:['木','火'], personality:'老成持重', desc:'年纪不小了才入道，但胜在沉稳。他说晚入道没关系，活久一点就追上了。' },
  { id:'d_d_12', name:'木槿', gender:'女', age:18, line:'alchemy', rank:'外门', roots:['木'], personality:'爱哭胆小', desc:'一炸炉就哭，一哭就忘配方。但阿洛最喜欢她，因为她会偷偷留好吃的给阿洛。' },

  // ═══ 符脉 12人 ═══
  { id:'d_f_01', name:'柳画符', gender:'女', age:23, line:'talisman', rank:'内门', roots:['金','火'], personality:'灵气逼人', desc:'符脉首席弟子，画符如行云流水。她画的符，连雪无痕都愿意破例收下。' },
  { id:'d_f_02', name:'墨千机', gender:'男', age:25, line:'talisman', rank:'内门', roots:['水','金'], personality:'谋定后动', desc:'符箓讲究时机与算计，他是天生的谋士型符师。据说他画符前要算三卦。' },
  { id:'d_f_03', name:'祝由', gender:'男', age:22, line:'talisman', rank:'内门', roots:['火','木'], personality:'乐天知命', desc:'名字取自祝由术，却是个乐天派。他画的符，功效先不论，美观程度满分。' },
  { id:'d_f_04', name:'简素问', gender:'女', age:20, line:'talisman', rank:'外门', roots:['木','水'], personality:'文静好学', desc:'把符箓当文章研究，笔笔有出处。藏经阁里关于符道的书她几乎都翻遍了。' },
  { id:'d_f_05', name:'符千山', gender:'男', age:31, line:'talisman', rank:'外门', roots:['土','金'], personality:'沉稳如山', desc:'画符慢得像刻碑，但一笔一画都扎实。他画的防御符，是演武场上最抢手的东西。' },
  { id:'d_f_06', name:'韦一鸣', gender:'男', age:19, line:'talisman', rank:'外门', roots:['火'], personality:'热情冲动', desc:'画符快而潦草，十张有八张是废符。但他不气馁，说失败是成功的符纸。' },
  { id:'d_f_07', name:'唐纸鸢', gender:'女', age:21, line:'talisman', rank:'外门', roots:['风','金'], personality:'机敏灵动', desc:'符纸做得极好，冰阁的符纸几乎都出自她手。她总说：符没画好，纸先得好。' },
  { id:'d_f_08', name:'桂沉烟', gender:'女', age:24, line:'talisman', rank:'外门', roots:['火','水'], personality:'淡雅沉静', desc:'擅长火符却性子沉静，反差极大。她的火符精准得能烧掉符纸上的一个墨点。' },
  { id:'d_f_09', name:'杜若', gender:'女', age:20, line:'talisman', rank:'外门', roots:['木','水'], personality:'娴静温婉', desc:'柳画符的小师妹，最崇拜师姐。她的符学得慢，但每张都用心。' },
  { id:'d_f_10', name:'卜算子', gender:'男', age:33, line:'talisman', rank:'外门', roots:['土','水'], personality:'神神叨叨', desc:'曾是算命先生，入冰阁后把卦象画进符里。他的符总带着股"天机不可泄露"的味儿。' },
  { id:'d_f_11', name:'薛定符', gender:'男', age:22, line:'talisman', rank:'外门', roots:['金'], personality:'爱钻牛角尖', desc:'研究"符成与未成的叠加态"入了迷，被药玄子说脑子烧坏了。但他画的符意外地好用。' },
  { id:'d_f_12', name:'林听雪', gender:'女', age:19, line:'talisman', rank:'外门', roots:['冰','金'], personality:'清丽安静', desc:'冰灵根符师，画符时指尖凝霜。她画的冰符，是冰阁一绝。' },

  // ═══ 体脉 13人 ═══
  { id:'d_b_01', name:'石破天', gender:'男', age:27, line:'body', rank:'内门', roots:['土','火'], personality:'豪迈粗犷', desc:'体脉首席，一身铜皮铁骨。他练体练到头发都竖起来，像一头站立的雄狮。' },
  { id:'d_b_02', name:'铁莲花', gender:'女', age:23, line:'body', rank:'内门', roots:['土','金'], personality:'外柔内刚', desc:'名字像花，人像铁塔。她一拳能打碎演武场的冰晶桩，却会绣花。' },
  { id:'d_b_03', name:'牛大力', gender:'男', age:29, line:'body', rank:'内门', roots:['土'], personality:'憨厚老实', desc:'人如其名，力气大得吓人。他搬灵田的石头像搬棉花，是阁里最受欢迎的工具人。' },
  { id:'d_b_04', name:'熊天霸', gender:'男', age:32, line:'body', rank:'外门', roots:['土','木'], personality:'直来直去', desc:'曾是猎户，入冰阁后改练体术。他说打不过熊就练到打得过。' },
  { id:'d_b_05', name:'燕无双', gender:'女', age:20, line:'body', rank:'外门', roots:['风','火'], personality:'风风火火', desc:'轻功极好，体修里罕见的敏捷型。她最烦别人说体修都是莽夫。' },
  { id:'d_b_06', name:'樊铁柱', gender:'男', age:26, line:'body', rank:'外门', roots:['土','金'], personality:'沉默坚韧', desc:'话不多，但练功最狠。他身上全是疤，每道疤都是一个故事。' },
  { id:'d_b_07', name:'雷震子', gender:'男', age:24, line:'body', rank:'外门', roots:['雷','火'], personality:'刚猛暴烈', desc:'天生雷灵根，练体时周身带电。演武场没人敢跟他硬碰硬。' },
  { id:'d_b_08', name:'钟无艳', gender:'女', age:25, line:'body', rank:'外门', roots:['土'], personality:'爽朗大方', desc:'爱笑，嗓门大，力气更大。她是弟子居里最受欢迎的大姐头。' },
  { id:'d_b_09', name:'金钟罩', gender:'男', age:28, line:'body', rank:'外门', roots:['金','土'], personality:'固若金汤', desc:'人如其名，防御力惊人。他站着不动让同门打，能打一炷香。' },
  { id:'d_b_10', name:'石敢当', gender:'男', age:30, line:'body', rank:'外门', roots:['土'], personality:'硬气执拗', desc:'跟石破天是同乡，两人总较劲。他说总有一天要超过石破天当首席。' },
  { id:'d_b_11', name:'罗大力', gender:'男', age:22, line:'body', rank:'外门', roots:['土','水'], personality:'憨直可爱', desc:'牛大力的跟班，崇拜牛大力崇拜得五体投地。' },
  { id:'d_b_12', name:'铁芙蓉', gender:'女', age:21, line:'body', rank:'外门', roots:['土','木'], personality:'泼辣爽利', desc:'铁莲花的妹妹，姐妹俩一个绣花一个打铁。她说姐姐绣花，她打铁，分工明确。' },
  { id:'d_b_13', name:'擎天柱', gender:'男', age:35, line:'body', rank:'外门', roots:['土','金'], personality:'老成持重', desc:'全阁年纪最大的弟子，练体四十年。他说自己不是天才，只是没放弃过。' },
];

// ── 区域 → 驻留弟子 ──
const SECT_AREA_DISCIPLES = {
  sect_stage: ['d_s_01','d_s_02','d_s_03','d_s_10','d_b_01','d_b_05','d_b_07'],
  sect_library: ['d_f_04','d_s_06','d_d_02'],
  sect_alchemy: ['d_d_01','d_d_03','d_d_10','d_f_08'],
  sect_dorm: ['d_s_04','d_s_08','d_d_04','d_d_12','d_b_04','d_b_08','d_b_11','d_f_09'],
  sect_field: ['d_d_06','d_d_09','d_b_03','d_s_09'],
  sect_hall: ['d_d_07','d_f_03'],
  sect_discipline: ['d_s_05','d_b_06'],
  sect_treasury: ['d_d_05','d_f_07'],
  sect_forbidden: [],
  sect_gate: ['d_b_10','d_f_10'],
};

// ── 冰阁 50弟子 数据访问 ──
function getDisciplesByLine(lineId) {
  return SECT_DISCIPLE_POOL.filter(d => d.line === lineId);
}
function getDisciplesInArea(areaId) {
  const ids = SECT_AREA_DISCIPLES[areaId] || [];
  return ids.map(id => SECT_DISCIPLE_POOL.find(d => d.id === id)).filter(Boolean);
}
function getDiscipleById(id) {
  return SECT_DISCIPLE_POOL.find(d => d.id === id) || null;
}
function getDiscipleRealmLabel(d) {
  const lineNames = { sword:'剑脉', alchemy:'丹脉', talisman:'符脉', body:'体脉' };
  // 🔧 玩法细化：弟子修为随成长(_sectRealm)变化，0-15对应练气→元婴
  if (d._sectRealm !== undefined) {
    const r = d._sectRealm;
    const realms = ['练气一重','练气二重','练气三重','练气四重','练气五重','练气六重','练气七重','练气八重','练气九重','筑基初阶','筑基中阶','筑基高阶','金丹初阶','金丹中阶','金丹高阶','元婴初阶'];
    return (lineNames[d.line] || '') + '·' + (realms[r] || '练气一重');
  }
  return (lineNames[d.line] || '') + '·' + d.rank;
}

// ── 冰阁山门大地图界面 ──
function showSectMap() {
  if (typeof isSectMember !== 'function' || !isSectMember()) {
    showCustomModal('❄️ 冰阁', '<div style="text-align:center;padding:14px;font-size:12px;color:var(--text-dim);">尚未加入冰阁。</div>');
    return;
  }
  // 全屏门派地图覆盖层
  // 🔧 2026-08-04 修复：z-index 9999 会盖住 event-overlay(100) 的功能弹窗
  //    （任务榜/藏宝阁等弹窗显示在地图下面看不见，造成"关闭不了"假象）
  //    改为 150（比弹窗100高、比世界地图1000低），弹窗可正常显示在地图上
  let overlay = document.getElementById('sectmap-overlay');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.id = 'sectmap-overlay';
    overlay.style.cssText = 'position:fixed;inset:0;z-index:150;background:rgba(5,12,20,0.97);overflow:auto;';
    document.body.appendChild(overlay);
  }
  overlay.classList.remove('hidden');
  overlay.style.display = 'block'; // 🔧 2026-08-05：内联样式控制显示，防止 hidden class 残留导致全屏盖住主界面
  overlay.innerHTML = `
    <div style="max-width:900px;margin:0 auto;padding:18px;">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;">
        <div>
          <div style="font-size:20px;font-weight:bold;color:#8ecae6;">❄️ 冰阁山门</div>
          <div style="font-size:10px;color:var(--text-dim);margin-top:2px;">掌门，今日山门诸事皆备。点击区域前往。</div>
        </div>
        <div style="display:flex;gap:6px;">
          <button onclick="closeSectMap();confirmQuitToTitle()" style="padding:6px 14px;border:1px solid rgba(231,76,60,0.3);border-radius:6px;background:rgba(60,20,20,0.2);color:#e74c3c;cursor:pointer;font-size:11px;">🚪 退出到主界面</button>
          <button onclick="closeSectMap()" style="padding:6px 14px;border:1px solid rgba(255,255,255,0.2);border-radius:6px;background:transparent;color:var(--text);cursor:pointer;font-size:11px;">✖ 关闭</button>
        </div>
      </div>
      <div id="sectmap-content"></div>
    </div>
  `;
  renderSectMapContent();
}

function closeSectMap() {
  const overlay = document.getElementById('sectmap-overlay');
  if (overlay) {
    overlay.classList.add('hidden');
    // 🔧 2026-08-05 修复：overlay 样式是 JS 内联设置的，CSS 里没有 .hidden 规则能隐藏它
    //    只加 class 不生效 → 全屏层一直盖着主界面，点关闭回不去。直接设 display:none 才能真关掉。
    overlay.style.display = 'none';
  }
  // 🔧 2026-08-05：关闭后刷新主界面（场景标题/动作列表/位置显示），
  //    确保回到游戏主界面时所有按钮可用
  if (typeof updateAllUI === 'function') {
    try { updateAllUI(); } catch(e) {}
  }
}

// 🔧 2026-08-05：山门地图是否打开（供 addNarrative 判断是否需要同步反馈）
function isSectMapOpen() {
  const overlay = document.getElementById('sectmap-overlay');
  return !!(overlay && !overlay.classList.contains('hidden'));
}
window.isSectMapOpen = isSectMapOpen;

// 🔧 2026-08-05：山门地图内反馈条——门派操作结果实时可见（不被全屏地图盖住）
function showSectMapFeedback(text, type) {
  const content = document.getElementById('sectmap-content');
  if (!content) return;
  let bar = document.getElementById('sectmap-feedback');
  if (!bar) {
    bar = document.createElement('div');
    bar.id = 'sectmap-feedback';
    bar.style.cssText = 'position:sticky;top:0;z-index:20;margin-bottom:8px;padding:8px 12px;border-radius:8px;background:rgba(10,25,45,0.95);border:1px solid rgba(140,202,230,0.35);font-size:11px;color:#8ecae6;line-height:1.6;box-shadow:0 2px 12px rgba(0,0,0,0.4);';
    content.parentNode.insertBefore(bar, content);
  }
  // 颜色按类型
  const colors = { 'milestone':'#ffd700', 'quest':'#8bc34a', 'narr-event':'#8ecae6', 'narr-epic':'#c084fc', 'system':'#ff9800', 'event':'#8ecae6', 'narr-combat':'#e74c3c' };
  const c = colors[type] || '#8ecae6';
  bar.style.borderColor = c;
  bar.style.color = c;
  // 剥离 HTML 标签取纯文本（防脚本注入 + 简洁显示）
  const tmp = document.createElement('div');
  tmp.innerHTML = text;
  bar.textContent = tmp.textContent.slice(0, 100);
  // 高亮闪烁一下
  bar.style.transition = 'none';
  bar.style.opacity = '0.3';
  requestAnimationFrame(() => {
    bar.style.transition = 'opacity .25s';
    bar.style.opacity = '1';
  });
  // 3.5 秒后淡出（保留最近一条）
  clearTimeout(bar._t);
  bar._t = setTimeout(() => { bar.style.opacity = '0.25'; }, 3500);
}
window.showSectMapFeedback = showSectMapFeedback;

// 🔧 2026-08-04：Esc 键关闭门派地图（不与其他弹窗 Esc 冲突）
document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape') {
    const map = document.getElementById('sectmap-overlay');
    if (map && !map.classList.contains('hidden')) {
      const ev = document.getElementById('event-overlay');
      // 如果有弹窗打开，先关弹窗（Esc 优先关最上层）
      if (ev && !ev.classList.contains('hidden')) {
        if (typeof closeEvent === 'function') closeEvent();
        else ev.classList.add('hidden');
      } else {
        closeSectMap();
      }
    }
  }
});

// 渲染门派地图
function renderSectMapContent() {
  const content = document.getElementById('sectmap-content');
  if (!content) return;
  
  // 顶部状态条
  const p = G.player;
  const sect = p.sect || {};
  const lineNames = { sword:'剑脉', alchemy:'丹脉', talisman:'符脉', body:'体脉' };
  let html = `
    <div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:10px;font-size:10px;">
      <span style="padding:4px 10px;border:1px solid rgba(140,202,230,0.3);border-radius:14px;background:rgba(40,80,120,0.15);color:#8ecae6;">🏔️ ${lineNames[sect.line] || ''}</span>
      <span style="padding:4px 10px;border:1px solid rgba(255,255,255,0.1);border-radius:14px;">💰 贡献 ${sect.merit || 0}</span>
      <span style="padding:4px 10px;border:1px solid rgba(255,255,255,0.1);border-radius:14px;">📜 弟子 ${(sect.disciples || []).length}/${SECT_DISCIPLE_POOL.length} 记名</span>
      <span style="padding:4px 10px;border:1px solid rgba(255,255,255,0.1);border-radius:14px;">⏳ 门派 ${sect.founded ? '已开派' : '未开派'}</span>
    </div>
  `;
  
  // 网格布局：3列x4行（10区域）
  const gridCells = SECT_MAP_AREAS.map(area => {
    const isLocked = area.id === 'sect_forbidden' && typeof isForbiddenUnlocked === 'function' && !isForbiddenUnlocked();
    const areaDisciples = getDisciplesInArea(area.id);
    const dCount = areaDisciples.length;
    const lockBadge = isLocked ? '<div style="font-size:8px;color:#e74c3c;margin-top:2px;">🔒 元婴可入</div>' : '';
    const feature = area.feature ? `<div style="font-size:8px;color:#c9a96e;margin-top:2px;">${area.feature}</div>` : '';
    const dBadge = dCount > 0 ? `<div style="font-size:8px;color:var(--text-dim);margin-top:2px;">${dCount}位弟子</div>` : '';
    return `
      <div onclick="${isLocked ? '' : `showSectArea('${area.id}')`}" style="cursor:${isLocked ? 'not-allowed' : 'pointer'};border:1px solid ${isLocked ? 'rgba(231,76,60,0.3)' : 'rgba(140,202,230,0.25)'};border-radius:10px;padding:10px;background:${isLocked ? 'rgba(60,20,20,0.2)' : 'rgba(20,40,70,0.25)'};transition:all .2s;min-height:90px;${isLocked ? 'opacity:.75;' : ''}">
        <div style="font-size:22px;">${area.icon}</div>
        <div style="font-size:12px;font-weight:bold;color:${isLocked ? '#e74c3c' : '#8ecae6'};margin-top:4px;">${area.name}</div>
        <div style="font-size:9px;color:var(--text-dim);margin-top:3px;line-height:1.5;">${area.desc.substring(0, 30)}…</div>
        ${feature}${dBadge}${lockBadge}
      </div>
    `;
  }).join('');
  
  html += `<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px;">${gridCells}</div>`;
  
  html += `
    <div style="margin-top:12px;text-align:center;">
      <button class="event-choice-btn" onclick="showSectOverview()" style="font-size:11px;margin-right:6px;">🏔️ 门派总览</button>
      <button class="event-choice-btn" onclick="showSectPersonnel()" style="font-size:11px;margin-right:6px;">👥 门派人物</button>
      <button class="event-choice-btn" onclick="showSectTasks()" style="font-size:11px;margin-right:6px;">📋 任务发布</button>
      <button class="event-choice-btn" onclick="closeSectMap()" style="font-size:11px;">关闭</button>
    </div>
  `;
  content.innerHTML = html;
}

// ── 区域详情界面 ──
function showSectArea(areaId) {
  const area = SECT_MAP_AREAS.find(a => a.id === areaId);
  if (!area) return;
  const content = document.getElementById('sectmap-content');
  if (!content) return;
  
  let html = `<div style="margin-bottom:10px;display:flex;justify-content:space-between;align-items:center;">
    <div style="font-size:16px;font-weight:bold;color:#8ecae6;">${area.icon} ${area.name}</div>
    <button onclick="renderSectMapContent()" style="padding:4px 10px;border:1px solid rgba(255,255,255,0.2);border-radius:6px;background:transparent;color:var(--text);cursor:pointer;font-size:10px;">← 返回山门</button>
  </div>`;
  html += `<div style="font-size:11px;color:var(--text-dim);line-height:1.7;border:1px solid rgba(140,202,230,0.15);border-radius:8px;padding:10px;background:rgba(20,40,70,0.2);">${area.desc}</div>`;
  
  // 区域功能按钮
  const areaActions = getAreaActions(areaId);
  if (areaActions.length) {
    html += `<div style="margin:10px 0;display:flex;gap:6px;flex-wrap:wrap;">`;
    areaActions.forEach(a => {
      html += `<button class="event-choice-btn" onclick="${a.onclick}" style="font-size:11px;">${a.text}</button>`;
    });
    html += `</div>`;
  }
  
  // 区域内弟子
  const disciples = getDisciplesInArea(areaId);
  if (disciples.length) {
    html += `<div style="font-size:12px;font-weight:bold;color:#8ecae6;margin:10px 0 6px;">👥 在此弟子（${disciples.length}）</div>`;
    html += `<div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;">`;
    disciples.forEach(d => {
      html += `<div style="border:1px solid rgba(255,255,255,0.08);border-radius:8px;padding:8px;font-size:10px;background:rgba(255,255,255,0.02);">
        <div style="display:flex;justify-content:space-between;">
          <b style="color:var(--text);font-size:11px;">${d.name}</b>
          <span style="color:var(--text-dim);font-size:9px;">${d.gender}·${d.age}</span>
        </div>
        <div style="color:#c9a96e;font-size:9px;margin-top:2px;">${getDiscipleRealmLabel(d)} · ${d.personality}</div>
        <div style="color:var(--text-dim);font-size:9px;margin-top:3px;line-height:1.5;">${d.desc}</div>
        <div style="margin-top:4px;">
          <button onclick="interactDisciple('${d.id}')" style="padding:2px 8px;border:1px solid rgba(140,202,230,0.3);border-radius:4px;background:rgba(40,80,120,0.2);color:#8ecae6;cursor:pointer;font-size:9px;">💬 交谈</button>
          <button onclick="giveGiftDisciple('${d.id}')" style="padding:2px 8px;border:1px solid rgba(230,200,140,0.3);border-radius:4px;background:rgba(120,90,30,0.2);color:#e8c88a;cursor:pointer;font-size:9px;margin-left:4px;">🎁 送礼</button>
          <button onclick="mentorDisciple('${d.id}')" style="padding:2px 8px;border:1px solid rgba(125,206,154,0.3);border-radius:4px;background:rgba(40,110,70,0.2);color:#7dce9a;cursor:pointer;font-size:9px;margin-left:4px;">✨ 指点</button>
          <button onclick="showDiscipleWish('${d.id}')" style="padding:2px 8px;border:1px solid rgba(200,150,230,0.3);border-radius:4px;background:rgba(90,40,120,0.2);color:#c89be8;cursor:pointer;font-size:9px;margin-left:4px;">💭 心事</button>
        </div>
      </div>`;
    });
    html += `</div>`;
  } else {
    html += `<div style="font-size:10px;color:var(--text-dim);padding:8px;text-align:center;">此处暂无弟子驻留。</div>`;
  }
  
  content.innerHTML = html;
}

// 区域功能定义
function getAreaActions(areaId) {
  const actions = [];
  const p = G.player;
  switch(areaId) {
    case 'sect_gate':
      actions.push({ text:'🚪 出山历练', onclick:'closeSectMap();closeEvent()' });
      break;
    case 'sect_hall':
      actions.push({ text:'📋 任务发布', onclick:"showSectTasks()" });
      actions.push({ text:'🏛️ 门派信息', onclick:'showSectPanel()' });
      break;
    case 'sect_stage':
      actions.push({ text:'⚔️ 切磋演武', onclick:'sectSparring()' });
      actions.push({ text:'🧘 演武场修炼', onclick:'sectStageTrain()' });
      break;
    case 'sect_library':
      actions.push({ text:'📖 借阅功法', onclick:'sectLibraryBorrow()' });
      break;
    case 'sect_alchemy':
      actions.push({ text:'⚗️ 炼丹', onclick:'sectAlchemy()' });
      break;
    case 'sect_discipline':
      actions.push({ text:'⚖️ 门规查看', onclick:'sectDisciplineRules()' });
      break;
    case 'sect_dorm':
      actions.push({ text:'🏠 弟子居走访', onclick:'sectDormVisit()' });
      break;
    case 'sect_field':
      actions.push({ text:'🌾 灵田种植', onclick:'sectFieldPlant()' });
      break;
    case 'sect_treasury':
      actions.push({ text:'💎 贡献兑换', onclick:'sectTreasury()' });
      break;
    case 'sect_forbidden':
      actions.push({ text:'❄️ 进入禁地', onclick:'sectForbiddenEnter()' });
      break;
  }
  return actions;
}

// ── 导出 ──
window.SECT_MAP_AREAS = SECT_MAP_AREAS;
window.SECT_DISCIPLE_POOL = SECT_DISCIPLE_POOL;
window.SECT_AREA_DISCIPLES = SECT_AREA_DISCIPLES;
window.getDisciplesByLine = getDisciplesByLine;
window.getDisciplesInArea = getDisciplesInArea;
window.getDiscipleById = getDiscipleById;
window.getDiscipleRealmLabel = getDiscipleRealmLabel;
window.showSectMap = showSectMap;
window.closeSectMap = closeSectMap;
window.renderSectMapContent = renderSectMapContent;
window.showSectArea = showSectArea;
window.getAreaActions = getAreaActions;
