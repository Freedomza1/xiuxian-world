// === 唯我独仙 · 第二纪元「冰阁」门派人物 ===
// 固定门派 NPC（复用 JIANGHU_NPC_TEMPLATES 模板机制）
// 2026-08-04 · 与 era2.js 配套，仅第二纪元（冰阁弟子）可见
// 机制：ensureSectNPCs(sceneId) 注入 → 复用 npcManager 对话/送礼/切磋/记忆
// 修为跟随玩家成长：模板修为 = 玩家境界 - 档位（保底）

// ⚠️ 与现有江湖人物区分：全部带 isSectNpc 标记 + key 前缀 'sect_'
// 现有 JIANGHU_NPC_TEMPLATES 人物：沈孤鸿/段青崖/花晚颜/洛无霜/铁老墨/灵小小/顾长策/燕无双/白流云/苏晚渔

// ── 冰阁人物解锁档位（相对玩家境界的差距） ──
// key 与 SECT_NPC_TEMPLATES 的 key 一致（含 sect_ 前缀）
const SECT_NPC_LOCK = {
  sect_ice_lan:     { minPlayerRealm: 0,  offset: -2, role: '大师姐' },   // 开派前就在（冰风石窟）
  sect_a_luo:       { minPlayerRealm: 0,  offset: -4, role: '药童' },     // 开派前就在（青云镇）
  sect_yao_xuanzi:  { minPlayerRealm: 10, offset: -1, role: '丹房长老' }, // 筑基后可入（驻地丹房）
  sect_tie_yan:     { minPlayerRealm: 10, offset: -2, role: '执事' },     // 筑基开派后（驻地）
  sect_mo_xuetang:  { minPlayerRealm: 15, offset: 0,  role: '藏经阁守阁人' }, // 元婴后（驻地藏经阁）
  sect_xue_wuhen:   { minPlayerRealm: 15, offset: 0,  role: '执法长老' }, // 元婴后（驻地刑堂）
  sect_bing_chenzi: { minPlayerRealm: 18, offset: 0,  role: '太上长老' }, // 化神后（冰窟深处）
};

// ── 冰阁固定人物模板 ──
// 修为用相对值：{ qi: 玩家境界-offset, body: 玩家境界-offset-2 }
const SECT_NPC_TEMPLATES = [
  {
    key: 'sect_ice_lan', sceneId: 'bingfeng_grotto', role: '大师姐',
    name: '冰澜', gender: '女', age: 24,
    personality: '清冷坚韧', 
    background: '冰阁首徒，罗峰与百里冰飞升前最后收的弟子。剑道天赋冠绝当世，是冰阁剑脉真正的执剑人。她亲眼见证过先辈飞升之夜，守着一句承诺等了二十年。',
    speechStyle: '言语简练如剑，一句是一句，从不废话。但提到师父师娘时，语气会罕见地柔软下来',
    speechQuirk: '（指尖轻抚剑柄，目光沉静）',
    speechLikes: '坚韧不拔、有担当的人',
    roleQuirk: '佩一柄通体如冰晶的长剑，剑鞘上刻着一行小字——「冰阁当立」',
    desire: '完成师父师娘遗愿，看着冰阁真正立起来。然后，去仙界找他们。',
    // 修为：跟随玩家（生成时计算）
    qiOffset: -2, bodyOffset: -4,
    isSectNpc: true,
    story: '二十年前，罗峰与百里冰飞升前夜，将襁褓中的幼子与一枚冰晶信物托付给年仅四岁的冰澜。「师妹，等孩子大了，告诉他——冰阁当立。」这一等，就是二十年。她以剑为伴，守着冰风石窟，替师父师娘守住了那份传承。',
    // 与玩家的关系（玩家即罗峰之子/女）
    relationToPlayer: '同门师姐，视你若亲弟妹',
    questLine: 'sect_sword_heart',
  },
  {
    key: 'sect_a_luo', sceneId: 'qingyun', role: '药童',
    name: '阿洛', gender: '女', age: 10,
    personality: '天真烂漫', 
    background: '青云镇上的孤儿，被冰澜捡回来看守冰阁信物。总爱缠着人讲罗峰与百里冰的故事，小小的心里装着一个大大的江湖梦。',
    speechStyle: '语气雀跃，像小雀儿一样叽叽喳喳，问题一个接一个',
    speechQuirk: '（眨巴着大眼睛，拉着你的衣角）',
    speechLikes: '愿意陪她玩、给她讲冒险故事的人',
    roleQuirk: '怀里抱着一只胖乎乎的小雪貂，那是她用攒了半年的糖葫芦换来的',
    desire: '想看看冰风石窟深处到底是什么样——大人总说那里危险，不让她靠近',
    qiOffset: -4, bodyOffset: -5,
    isSectNpc: true,
    story: '阿洛不知道自己的父母是谁，只知道是冰澜师姐捡回来的。她最喜欢坐在青云镇的茶馆门口，听说书人讲当年两位飞升者的故事——虽然她并不知道，故事里那个襁褓中的孩子，此刻就站在她面前。',
    relationToPlayer: '小跟屁虫，把你当哥哥/姐姐崇拜',
    questLine: 'sect_childhood',
  },
  {
    key: 'sect_yao_xuanzi', sceneId: 'sect_base', role: '丹房长老',
    name: '药玄子', gender: '男', age: 58,
    personality: '痴迷丹道', 
    background: '曾是天机阁首席丹师，因一次炼丹事故被逐。流浪至青云镇后山时，被冰澜的剑意所慑，甘愿留下为冰阁筹备丹房。',
    speechStyle: '三句话不离丹道，提到丹方就两眼放光，能把枯燥的药理说得天花乱坠',
    speechQuirk: '（捻着胡须，盯着丹炉的火候，头也不抬）',
    speechLikes: '肯钻研丹道、不浮躁的年轻人',
    roleQuirk: '一身灰袍上沾满药渍，腰间挂着一串晒干的药草',
    desire: '想炼出传说中冰阁祖传的「冰心丹」——那是百里冰留下的丹方残页上的最后一种丹药',
    qiOffset: -1, bodyOffset: -3,
    isSectNpc: true,
    story: '药玄子年轻时是天机阁最年轻的丹道天才，却因一次意外炸毁了阁中百年丹房，被逐出师门。他心灰意冷流浪十年，直到在青云镇后山遇见冰澜——那女子一剑劈开山壁，露出冰阁旧址的轮廓，对他说：「这里缺个丹房，缺个懂丹的人。」他鬼使神差地留下了。',
    relationToPlayer: '授业长老，教炼丹时格外严厉',
    questLine: 'sect_danfang',
  },
  {
    key: 'sect_tie_yan', sceneId: 'sect_base', role: '执事',
    name: '铁砚', gender: '男', age: 41,
    personality: '精打细算', 
    background: '青云镇的老账房先生，管了一辈子账。冰阁立派缺个管事的，被冰澜半请半拽地拉了来，如今连梦里都在算灵石。',
    speechStyle: '开口闭口都是账，能把一文灵石花出三文的效果。偶尔会冒出两句市井俗语，逗得人发笑',
    speechQuirk: '（噼里啪啦拨着算盘，眉头拧成一个疙瘩）',
    speechLikes: '不浪费、懂持家的人',
    roleQuirk: '袖口永远别着一支秃了毛的毛笔，算盘珠子磨得油光锃亮',
    desire: '想看着冰阁从一片废墟，变成青云镇最气派的山门——顺便把账本记满三大本',
    qiOffset: -2, bodyOffset: -3,
    isSectNpc: true,
    story: '铁砚在青云镇当了二十年账房，经手的灵石何止千万，却没有一块是自己的。冰澜找上门时，他正为东家算错了一笔账发愁。冰澜把一锭银子拍在桌上：「跟我走，管一座山门的账。」他犹豫了三天，最终败给了那句「包吃包住，月奉十块灵石」。',
    relationToPlayer: '管家，总念叨你花钱大手大脚',
    questLine: 'sect_base_rebuild',
  },
  {
    key: 'sect_mo_xuetang', sceneId: 'sect_base', role: '藏经阁守阁人',
    name: '墨雪堂', gender: '男', age: 67,
    personality: '博学温和', 
    background: '罗峰当年的书童，如今白发苍苍。他保管着罗峰与百里冰留下的全部手札与典籍，是冰阁唯一知道所有往事的人。',
    speechStyle: '说话慢条斯理，引经据典，像一本会走路的古籍。提到罗峰时眼神悠远，仿佛又回到当年',
    speechQuirk: '（轻轻吹去书页上的浮尘，指腹摩挲着泛黄的纸边）',
    speechLikes: '好学、敬重先贤的年轻人',
    roleQuirk: '怀里永远抱着一个褪色的布包，里面是罗峰留下的半卷剑谱',
    desire: '在有生之年，把罗峰与百里冰的故事整理成书，传于后世',
    qiOffset: 0, bodyOffset: -2,
    isSectNpc: true,
    story: '墨雪堂十四岁起便跟着罗峰，从青云镇一路到飞升，见过他意气风发，也见过他在冰窟中为百里冰守夜的背影。飞升前夜，罗峰把半卷剑谱交给他：「老墨，替我看着这卷东西。若有人能读懂它，便是冰阁的缘。」这一看，就是几十年。',
    relationToPlayer: '如同家中长辈，讲起往事时总是欲言又止',
    questLine: 'sect_canons',
  },
  {
    key: 'sect_xue_wuhen', sceneId: 'sect_base', role: '执法长老',
    name: '雪无痕', gender: '男', age: 39,
    personality: '铁面无私', 
    background: '曾是幽冥界赫赫有名的赏金猎人，双手沾满血腥。被冰澜以一场赌约收服，立誓为冰阁执掌刑律。',
    speechStyle: '语气冷硬，公事公办。但偶尔会露出一点别扭的关切，说完又装作无事发生',
    speechQuirk: '（面无表情地擦着刀，刀身映出你心虚的脸）',
    speechLikes: '守规矩、坦荡的人',
    roleQuirk: '腰间挂着一枚漆黑的令牌，正面刻着「律」，背面刻着「冰」',
    desire: '用一生偿还当年错杀之人的债——而冰阁的律条，是他的赎罪',
    qiOffset: 0, bodyOffset: -1,
    isSectNpc: true,
    story: '雪无痕曾是幽冥界最冷的刀，接单杀人，从不过问对错。直到那一夜他追杀一个目标追进冰风石窟，冰澜挡在他面前：「你这一刀下去，就再也回不了头了。」他收了刀，却再没走出过冰窟。后来冰澜说：「留下来，替我管管门规。」他答应了——这是他此生第一次，为别人而活。',
    relationToPlayer: '执法长老，犯了门规时绝不手软',
    questLine: 'sect_discipline',
  },
  {
    key: 'sect_bing_chenzi', sceneId: 'bingfeng_grotto', role: '太上长老',
    name: '冰尘子', gender: '男', age: '不详',
    personality: '超然世外', 
    background: '罗峰的旧友，当年一同闯荡玄黄大陆的散修。罗峰飞升后，他自封于冰风石窟最深处闭关，已三十年未出。世人只知冰阁有位神秘太上长老，却不知他守着冰窟深处一个天大的秘密。',
    speechStyle: '言辞玄奥，如雾里看花。每句话都像偈语，需要细品',
    speechQuirk: '（闭目盘坐，周身冰雾缭绕，声音却清晰地传入你耳中）',
    speechLikes: '心性坚定、不惧孤独的人',
    roleQuirk: '一袭白发如雪，眉间一点朱砂，三十年闭关让他的气息与冰窟融为一体',
    desire: '等待罗峰留下预言中的「冰阁之主」出现——然后，告诉他当年那场飞升的真相',
    qiOffset: 2, bodyOffset: 0,
    isSectNpc: true,
    story: '冰尘子与罗峰相识于微末，两人曾并肩闯过玄黄大陆最凶险的秘境。罗峰飞升前夜找到他：「老友，我要走了。冰窟深处，我留了点东西。若冰阁有人能走到那里，替我看他一眼。」冰尘子问他为何不自己告诉孩子。罗峰笑了笑：「有些真相，要等他自己有资格知道。」',
    relationToPlayer: '亦师亦友的守护者，知道你身世的真相',
    questLine: 'sect_truth',
  },
];

// ── 场景映射 ──
// 🔧 2026-08-05：sect_base 已正式加入世界地图（data.js x2,y2），冰阁 NPC 直接驻守山门场景
function sectNPCTargetScene(tpl) {
  // 冰阁驻地（山门）→ sect_base 场景（已在世界地图中）
  if (tpl.sceneId === 'sect_base') return 'sect_base';
  return tpl.sceneId;
}

// ── 解锁判定 ──
function isSectNPCLocked(key, playerRealm) {
  const lock = SECT_NPC_LOCK[key];
  if (!lock) return false;
  return playerRealm < lock.minPlayerRealm;
}

// ── 注入冰阁 NPC ──
function ensureSectNPCs(sceneId) {
  // 仅第二纪元冰阁弟子
  if (typeof isSectMember !== 'function' || !isSectMember()) return;
  const mgr = (typeof npcManager !== 'undefined' && npcManager) ? npcManager : null;
  if (!mgr) return;
  const p = G.player;
  if (!p) return;
  const playerRealm = Math.max(p.qiRealmIndex || 0, p.bodyRealmIndex || 0);
  const existing = mgr.npcs || [];
  
  SECT_NPC_TEMPLATES.forEach(tpl => {
    // 场景匹配（驻地未建时映射）
    const target = sectNPCTargetScene(tpl);
    if (target !== sceneId) return;
    // 解锁检查
    const lock = SECT_NPC_LOCK[tpl.key];
    if (lock && playerRealm < lock.minPlayerRealm) return;
    // 已存在
    const has = existing.some(n => n.key === tpl.key);
    if (has) return;
    
    // 计算修为：跟随玩家（保底）
    const qiIdx = Math.max(0, (p.qiRealmIndex || 0) + (tpl.qiOffset || 0));
    const bodyIdx = Math.max(0, (p.bodyRealmIndex || 0) + (tpl.bodyOffset || 0));
    
    const npc = Object.assign({}, tpl, {
      id: tpl.key,
      key: tpl.key,
      qiRealmIndex: qiIdx,
      bodyRealmIndex: bodyIdx,
      affinity: 0,
      dialogHistory: [],
      questGiven: false,
      tradeGoods: null,
      aiDescription: null,
      aiDialogueStyle: null,
      isSectNpc: true,
      isFixed: true,
      // 修为动态跟随标记
      _sectDynamicRealm: true,
      _sectOffsetQi: tpl.qiOffset || 0,
      _sectOffsetBody: tpl.bodyOffset || 0,
    });
    mgr.npcs.push(npc);
    if (typeof generateNPCStory === 'function') {
      try { generateNPCStory(npc); } catch(e) {}
    }
  });
}

// ── 修为动态跟随（每次进入场景时同步） ──
function syncSectNPCRealms() {
  if (typeof isSectMember !== 'function' || !isSectMember()) return;
  const mgr = (typeof npcManager !== 'undefined' && npcManager) ? npcManager : null;
  if (!mgr || !G.player) return;
  const p = G.player;
  const playerRealm = Math.max(p.qiRealmIndex || 0, p.bodyRealmIndex || 0);
  (mgr.npcs || []).forEach(n => {
    if (n._sectDynamicRealm) {
      n.qiRealmIndex = Math.max(0, playerRealm + (n._sectOffsetQi || 0));
      n.bodyRealmIndex = Math.max(0, playerRealm + (n._sectOffsetBody || 0));
    }
  });
}

// ── 冰阁人物面板（门派信息 + 人物列表） ──
function showSectPersonnel() {
  if (typeof isSectMember !== 'function' || !isSectMember()) {
    showCustomModal('❄️ 冰阁', '<div style="text-align:center;padding:14px;font-size:12px;color:var(--text-dim);">尚未加入冰阁。</div>');
    return;
  }
  const mgr = (typeof npcManager !== 'undefined' && npcManager) ? npcManager : null;
  const sectNPCs = mgr ? (mgr.npcs || []).filter(n => n.isSectNpc) : [];
  const p = G.player;
  const playerRealm = Math.max(p.qiRealmIndex || 0, p.bodyRealmIndex || 0);
  
  let html = `<div style="font-size:11px;color:var(--text-dim);margin-bottom:8px;">❄️ 冰阁 · 门派人物（${sectNPCs.length}/${SECT_NPC_TEMPLATES.length}已聚）</div>`;
  html += `<div style="border:1px solid rgba(140,202,230,0.3);border-radius:8px;padding:10px;margin-bottom:8px;background:rgba(40,80,120,0.08);font-size:10px;color:var(--text-dim);line-height:1.6;">
    <b style="color:#8ecae6;">📜 立派进度</b><br>
    开派前：大师姐冰澜、药童阿洛<br>
    筑基开派：丹房长老药玄子、执事铁砚<br>
    元婴：藏经阁守阁人墨雪堂、执法长老雪无痕<br>
    化神：太上长老冰尘子
  </div>`;
  
  if (sectNPCs.length === 0) {
    html += `<div style="text-align:center;padding:12px;color:var(--text-dim);font-size:11px;">尚未有门人聚集。<br>先去冰风石窟见大师姐冰澜吧。</div>`;
  } else {
    sectNPCs.forEach(n => {
      const realm = getNPCRealmLabel(n);
      const aff = n.affinity || 0;
      const affText = aff >= 60 ? '❤️ 至交' : aff >= 30 ? '😊 友善' : aff >= 10 ? '🙂 熟络' : aff > -10 ? '😐 初识' : '😠 疏远';
      html += `<div style="border:1px solid rgba(140,202,230,0.15);border-radius:8px;padding:8px;margin:4px 0;font-size:10px;background:rgba(40,80,120,0.05);">
        <div style="display:flex;justify-content:space-between;align-items:center;">
          <b style="color:#8ecae6;font-size:11px;">${n.name}</b>
          <span style="color:var(--text-dim);">${n.role} · ${realm}</span>
        </div>
        <div style="color:var(--text-dim);margin-top:3px;line-height:1.5;">${n.story ? n.story.substring(0, 60) + '…' : ''}</div>
        <div style="margin-top:3px;color:var(--accent);">${affText} ${aff}</div>
      </div>`;
    });
  }
  html += `<div style="margin-top:10px;text-align:center;font-size:10px;color:var(--text-dim);">🗣️ 在对应场景找到他们，即可对话、送礼、切磋</div>`;
  showCustomModal('❄️ 冰阁人物', html + '<button class="event-choice-btn" onclick="closeEvent()">关闭</button>');
}

// ── 导出 ──
window.SECT_NPC_TEMPLATES = SECT_NPC_TEMPLATES;
window.SECT_NPC_LOCK = SECT_NPC_LOCK;
window.ensureSectNPCs = ensureSectNPCs;
window.syncSectNPCRealms = syncSectNPCRealms;
window.showSectPersonnel = showSectPersonnel;
window.isSectNPCLocked = isSectNPCLocked;
