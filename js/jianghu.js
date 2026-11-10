// === 唯我独仙 · 江湖风云扩展 ===
// 固定剧情人物（不再只是随机池NPC）+ 剧情任务线 + 新场景注入
// 挂载方式：进场景时 ensureJianghuNPCs() 注入固定人物；任务直接进 QUEST_DB；场景注入 WORLD_DATA

// ==========================
// 一、固定江湖人物（10位）
// ==========================
// 每位都有：身世背景、性格、说话风格、专属剧情任务线、好恶
// 结构兼容 generateNPC() 输出，可直接用 NPC 管理器的交互系统（对话/送礼/切磋/记忆）
const JIANGHU_NPC_TEMPLATES = [
  {
    key: 'shen_gu', sceneId: 'qingyun', role: '说书人',
    name: '沈孤鸿', gender: '男', age: 47,
    personality: '老谋深算', background: '曾是天机阁外门弟子，因知晓太多被逐出。如今在青云镇摆摊说书，以说书为掩护打探天下消息。',
    speechStyle: '话里有话，总在故事里夹带江湖秘闻，说到关键处戛然而止',
    speechQuirk: '（啪地一拍醒木，眯起眼睛）',
    speechLikes: '爱听故事、肯出灵石的人',
    roleQuirk: '案上摆一方醒木，一把折扇，折扇上画着半幅山河图',
    desire: '想找回当年从天机阁带出的那半卷《天机残卷》，破译其中的大秘密',
    qiRealmIndex: 6, bodyRealmIndex: 3, sectId: 'tianji',
    story: '沈孤鸿年轻时曾是天机阁最有前途的弟子，因窥见阁中禁地的一角天机被逐。他逃到青云镇，以说书为生，实则一直在等一个"有缘人"替他取回遗落在天机阁的残卷。',
    questLine: 'jianghu_tianji'
  },
  {
    key: 'duan_qing', sceneId: 'qingyun_pier', role: '船夫',
    name: '段青崖', gender: '男', age: 35,
    personality: '沉默寡言', background: '碧波湖上的老船夫，船上常年挂着一柄锈剑。没人知道他曾是剑冢传人。',
    speechStyle: '一个字能说完绝不说两个字，但提起剑时会罕见地多说几句',
    speechQuirk: '（默默系好船绳，望着湖面出神）',
    speechLikes: '安静、不打听闲事的人',
    roleQuirk: '腰间别着一柄锈迹斑斑的断剑，剑鞘上刻着一个"冢"字',
    desire: '想回剑冢看一眼，却不敢面对当年弃剑而走的自己',
    qiRealmIndex: 7, bodyRealmIndex: 5, sectId: null,
    story: '段青崖原是剑冢守冢人的关门弟子，剑道天赋极高。十年前的剑冢之变中，他临阵弃剑而逃，从此再不敢用剑。如今他在碧波湖撑船，只为远离江湖。',
    questLine: 'jianghu_jianzhong'
  },
  {
    key: 'hua_wanyan', sceneId: 'lingyao_garden', role: '采药女',
    name: '花晚颜', gender: '女', age: 22,
    personality: '天真烂漫', background: '药园守园老人的孙女，天生灵瞳，能看见灵药的药性流转。',
    speechStyle: '语气雀跃，说话像小雀儿一样清脆，总爱拉着人说药草的事',
    speechQuirk: '（歪着头，眼睛亮晶晶地看着你）',
    speechLikes: '懂药草、愿意听她说话的人',
    roleQuirk: '腰间挂着一只小药篓，篓里插着几株还带着露水的灵草',
    desire: '想找到传说中能生死人肉白骨的"九转还魂草"，救活病重的爷爷',
    qiRealmIndex: 4, bodyRealmIndex: 2, sectId: null,
    story: '花晚颜自幼与爷爷相依为命，守着这片灵药园。她天生灵瞳，能看透药性，是百年难遇的药道天才。但爷爷的病越来越重，普通灵药已无力回天。',
    questLine: 'jianghu_huanhun'
  },
  {
    key: 'luo_wushuang', sceneId: 'luoxia_forest', role: '流浪剑客',
    name: '洛无霜', gender: '女', age: 26,
    personality: '高傲自负', background: '北境剑宗弃徒，剑法凌厉狠辣，行走江湖专挑成名剑客挑战。',
    speechStyle: '鼻子朝天，拿眼角看你，三句话不离剑',
    speechQuirk: '（冷哼一声，指尖在剑鞘上轻轻一叩）',
    speechLikes: '真正的剑道高手，讨厌虚名之徒',
    roleQuirk: '一柄窄刃长剑斜挎背后，剑穗是罕见的玄黑色',
    desire: '想找到当年击败她师父的那位无名剑客，堂堂正正地赢回来',
    qiRealmIndex: 8, bodyRealmIndex: 6, sectId: 'beijing_jianzong',
    story: '洛无霜的师父曾是北境剑宗宗主，十年前被一位无名剑客三剑击败，郁郁而终。她苦练十年，四处挑战高手，只为逼出那位无名剑客。',
    questLine: 'jianghu_wuming'
  },
  {
    key: 'tie_laomo', sceneId: 'xuantie_mine', role: '矿工',
    name: '铁老墨', gender: '男', age: 58,
    personality: '坚韧不拔', background: '玄铁矿的老矿工，其实曾是锻造大师，因拒绝为黑市铸凶兵被废去修为。',
    speechStyle: '话语短促有力，不容置疑，提到铸剑时眼中会燃起火',
    speechQuirk: '（抡起铁锤在砧上敲了三下，火星四溅）',
    speechLikes: '踏实肯干、对兵器有敬畏心的人',
    roleQuirk: '双手满是老茧和烫伤的疤痕，却异常稳定',
    desire: '想在有生之年再铸一柄真正的好剑，证明自己没老',
    qiRealmIndex: 3, bodyRealmIndex: 8, sectId: null,
    story: '铁老墨年轻时是名震一方的铸剑师，因拒绝为黑市铸一柄噬主的凶兵，被黑市的人废去修为，隐姓埋名在玄铁矿当矿工。他手上的疤，是当年护剑时留下的。',
    questLine: 'jianghu_zhuijian'
  },
  {
    key: 'ling_xiaoxiao', sceneId: 'ty_floating_garden', role: '花神侍者',
    name: '灵小小', gender: '女', age: 16,
    personality: '玩世不恭', background: '天域浮空花园的守花小仙，古灵精怪，最爱捉弄路过的修士。',
    speechStyle: '爱开玩笑，说话像蹦豆子，动不动就咯咯笑',
    speechQuirk: '（从花丛后探出半个脑袋，冲你扮鬼脸）',
    speechLikes: '陪她玩的人，讨厌一本正经的木头',
    roleQuirk: '发间别着一朵会发光的琉璃花，是浮空花园的信物',
    desire: '想让浮空花园重新开满传说中的"九色神莲"',
    qiRealmIndex: 11, bodyRealmIndex: 9, sectId: 'tianyu_huagong',
    story: '灵小小是浮空花园的守花小仙，看似没心没肺，实则一直在寻找让九色神莲重开的方法。那神莲是花园的命脉，已枯萎百年。',
    questLine: 'jianghu_shenlian'
  },
  {
    key: 'gu_zhanglao', sceneId: 'zz_tianji_city', role: '天机阁长老',
    name: '顾长策', gender: '男', age: 65,
    personality: '淡泊名利', background: '天机阁守阁长老，执掌天机阁三百年，通晓天下事却从不多言。',
    speechStyle: '语速悠然，像什么事都不急，但每句话都暗藏玄机',
    speechQuirk: '（拂了拂袖口，抬眼看了看天边）',
    speechLikes: '进退有度、懂得因果的人',
    roleQuirk: '一身灰白长袍，袖中常年藏着三枚铜钱',
    desire: '在等一个能改变天机阁命运的人，或者说，一场必然到来的变数',
    qiRealmIndex: 14, bodyRealmIndex: 12, sectId: 'tianji',
    story: '顾长策执掌天机阁三百年，早已看透无数人的命运。但他自己的命运，却系在一个"残卷"上——当年被逐出阁的沈孤鸿带走了半卷天机残卷，而残卷里记载的，是天机阁最大的秘密。',
    questLine: 'jianghu_tianji'
  },
  {
    key: 'yan_wushuang', sceneId: 'heifeng_ridge', role: '山贼头目',
    name: '燕无双', gender: '女', age: 29,
    personality: '泼辣直率', background: '黑风寨大当家，劫富济贫，从不伤无辜。官府悬赏千两却无人能擒。',
    speechStyle: '嘴皮子利索，说话不饶人但没真恶意，一口一个"姑奶奶"',
    speechQuirk: '（把刀往桌上一拍，大马金刀地坐下）',
    speechLikes: '爽快人，讨厌磨叽和假仁假义',
    roleQuirk: '虎皮交椅上斜倚着一柄九环大刀',
    desire: '想查清当年黑风寨被官府灭门的真相，为死去的兄弟们讨个公道',
    qiRealmIndex: 6, bodyRealmIndex: 7, sectId: null,
    story: '燕无双的爹是上一任黑风寨大当家，十年前被官府以"剿匪"之名灭门，只有她逃了出来。她重建黑风寨，立下规矩：只劫贪官污吏，不伤无辜百姓。',
    questLine: 'jianghu_heifeng'
  },
  {
    key: 'bai_liuyun', sceneId: 'yy_wangchuan_river', role: '幽冥引路人',
    name: '白流云', gender: '男', age: '不详',
    personality: '阴郁寡言', background: '忘川河畔的引路人，渡魂三百年，没人知道他生前是谁。',
    speechStyle: '说话像是从牙缝里挤出来的，低沉沙哑，像河水在流动',
    speechQuirk: '（缓缓抬起斗笠，露出一双没有焦距的眼睛）',
    speechLikes: '没有什么喜欢的，只是日复一日地渡魂',
    roleQuirk: '一袭白衣，撑着一艘无桨的乌篷船，船头挂着一盏青灯',
    desire: '想找回自己遗失的记忆——他不知道自己为什么在这里',
    qiRealmIndex: 12, bodyRealmIndex: 10, sectId: null,
    story: '白流云是忘川河上的引路人，渡魂三百年。他不知道自己是谁，只记得一个约定——"等一个人"。那个人，或许永远不会来。',
    questLine: 'jianghu_yinlu'
  },
  {
    key: 'su_wanyu', sceneId: 'ty_tiandao_peak', role: '天道峰守灵',
    name: '苏晚渔', gender: '女', age: 19,
    personality: '温柔敦厚', background: '天道峰守灵人，世代守护天道峰的传承，是最后一个守灵人。',
    speechStyle: '语调平和温暖，像山间的风，但提到天道峰时语气会变得郑重',
    speechQuirk: '（双手轻轻交叠，微微欠身行礼）',
    speechLikes: '心怀敬畏、不骄不躁的求道者',
    roleQuirk: '额间一点朱砂，身着素白长裙，腰间挂着一枚温润的玉佩',
    desire: '想找到一位能接过天道峰传承的人，让守灵人的使命延续下去',
    qiRealmIndex: 14, bodyRealmIndex: 12, sectId: null,
    story: '苏晚渔是天道峰最后的守灵人。天道峰的传承已空悬百年，她在等一个"有缘人"——一个能通过天道考验，接过峰主之位的人。',
    questLine: 'jianghu_tiandao'
  },
];

// 按场景索引，方便注入
function getJianghuNPCsForScene(sceneId) {
  return JIANGHU_NPC_TEMPLATES.filter(n => n.sceneId === sceneId);
}

// ==========================
// 二、江湖剧情任务线（12个）
// ==========================
// 使用现有任务系统：items/kills/explore/sceneVisit/realm/stages
// giver 填固定人物名，接取点在不同场景
const JIANGHU_QUEST_DB = [
  // ── 线1：天机残卷（沈孤鸿·青云镇 → 顾长策·天机城）──
  {
    id: 'jianghu_tianji_1', name:'说书人的试探', type:'剧情', giver:'沈孤鸿',
    scene:'qingyun', desc:'青云镇的说书人沈孤鸿似乎认出了你的来历，他邀你听一段"旧事"。',
    giverLine:'这位道友，且坐。老朽这里有一段故事，讲的是三百年前天机阁的一桩旧案……你可愿意一听？',
    npcHint:'说书人沈孤鸿敲了敲醒木，意味深长地看着你。',
    requirements: { realm: 5 },
    rewards: { stones: 100, exp: 80, items:[{id:'tianji_key_1', qty:1}] },
    chain:'jianghu_tianji_2',
    completeText:'沈孤鸿讲完故事，将一枚青铜钥匙推到你面前："这是天机阁藏卷阁的钥匙，老朽用不上了。若你有缘，替老朽去天机城走一遭。"',
    showInList: true
  },
  {
    id: 'jianghu_tianji_2', name:'天机残卷', type:'剧情', giver:'顾长策',
    scene:'zz_tianji_city', desc:'带着沈孤鸿的钥匙前往天机城，面见守阁长老顾长策。',
    prerequisite:'jianghu_tianji_1',
    giverLine:'（顾长策看着你手中的钥匙，沉默良久）……他终于还是等到了。说吧，你想要什么？',
    npcHint:'天机阁长老顾长策端坐阁中，面前摊着一卷泛黄的残卷。',
    requirements: { sceneVisit:'zz_tianji_city', realm: 9 },
    rewards: { stones: 300, exp: 200, items:[{id:'tianji_can_juan', qty:1}], mood: 10 },
    chain:'jianghu_tianji_3',
    completeText:'顾长策将残卷交给你："天机残卷，记载着天机阁的起源。沈孤鸿等了半生，就为这一页真相。你带回去给他吧。"',
    showInList: true
  },
  {
    id: 'jianghu_tianji_3', name:'残卷归主', type:'剧情', giver:'沈孤鸿',
    scene:'qingyun', desc:'将天机残卷带回青云镇，交给说书人沈孤鸿。',
    prerequisite:'jianghu_tianji_2',
    giverLine:'（沈孤鸿接过残卷，手指微微发抖）……三百年了。天机阁欠我的，今日终于还清了。道友，受老朽一拜！',
    npcHint:'沈孤鸿捧着残卷，浑浊的眼中竟有泪光。',
    requirements: { items:[{id:'tianji_can_juan', qty:1}] },
    rewards: { stones: 500, exp: 300, items:[{id:'tianji_huilu', qty:1}], mood: 15 },
    completeText:'沈孤鸿将一枚天机护符赠予你："此符可挡一次致命之劫。老朽要回乡了，有缘再见。"',
    showInList: true
  },

  // ── 线2：剑冢旧事（段青崖·清风渡口 → 洛无霜）──
  {
    id: 'jianghu_jianzhong_1', name:'断剑之约', type:'剧情', giver:'段青崖',
    scene:'qingyun_pier', desc:'船夫段青崖的断剑似乎与你产生了共鸣，他罕见地开了口。',
    giverLine:'（段青崖看着你，沉默了很久）……你身上，有剑意。帮我一个忙，去落霞森林找一个叫洛无霜的女剑客，告诉她——剑冢，该回去了。',
    npcHint:'段青崖握着锈剑，指节发白。',
    requirements: { realm: 6 },
    rewards: { stones: 150, exp: 100 },
    chain:'jianghu_jianzhong_2',
    completeText:'段青崖将断剑交给你："带着它去。洛无霜若是问起，就说——当年的逃兵，想回去领罪了。"',
    showInList: true
  },
  {
    id: 'jianghu_jianzhong_2', name:'无名剑客', type:'剧情', giver:'洛无霜',
    scene:'luoxia_forest', desc:'找到洛无霜，转达段青崖的话。',
    prerequisite:'jianghu_jianzhong_1',
    giverLine:'（洛无霜看到断剑，瞳孔骤缩）……这柄剑，是剑冢守冢人的信物！段青崖他还活着？！',
    npcHint:'洛无霜握着断剑，指尖轻轻抚过剑身上的"冢"字。',
    requirements: { sceneVisit:'luoxia_forest', realm: 7 },
    rewards: { stones: 200, exp: 150, mood: 8 },
    chain:'jianghu_jianzhong_3',
    completeText:'洛无霜收下断剑："告诉他，当年击败师父的无名剑客——就是他自己。他逃避的不是剑，是愧疚。"',
    showInList: true
  },
  {
    id: 'jianghu_jianzhong_3', name:'剑冢归途', type:'剧情', giver:'段青崖',
    scene:'qingyun_pier', desc:'将洛无霜的话带回给段青崖。',
    prerequisite:'jianghu_jianzhong_2',
    giverLine:'（段青崖听完，长久沉默，忽然笑了）……原来如此。原来我一直在找的，是我自己。多谢。这柄剑，请你替我送回剑冢。',
    npcHint:'段青崖的眼中，第一次有了光。',
    requirements: { realm: 7 },
    rewards: { stones: 300, exp: 250, items:[{id:'jianzhong_ling', qty:1}], mood: 12 },
    completeText:'你获得剑冢令。段青崖说，持此令可入剑冢，取一柄真正的传承之剑。',
    showInList: true
  },

  // ── 线3：九转还魂草（花晚颜·灵药园）──
  {
    id: 'jianghu_huanhun_1', name:'病榻前的眼泪', type:'剧情', giver:'花晚颜',
    scene:'lingyao_garden', desc:'花晚颜的爷爷病重，她求你去毒瘴沼泽寻一味传说中的还魂草。',
    giverLine:'（花晚颜红着眼眶，拉着你的衣袖）大哥哥，爷爷快不行了……传说毒瘴沼泽深处有一株九转还魂草，你能帮帮我吗？',
    npcHint:'花晚颜的药篓里，躺着几株已经枯萎的灵草。',
    requirements: { realm: 4 },
    rewards: { stones: 100, exp: 80 },
    chain:'jianghu_huanhun_2',
    completeText:'花晚颜擦了擦眼泪，将一株灵草塞给你："这是护身用的解毒草，沼泽瘴气重，你带上！"',
    showInList: true
  },
  {
    id: 'jianghu_huanhun_2', name:'沼泽深处', type:'探索', giver:'花晚颜',
    scene:'duzhang_swamp', desc:'前往毒瘴沼泽，在幽冥花田附近寻找九转还魂草。',
    prerequisite:'jianghu_huanhun_1',
    giverLine:'',
    npcHint:'',
    requirements: { explore:'duzhang_swamp', kills:[{monster:'毒鳞蛇', qty:3}] },
    rewards: { stones: 200, exp: 150 },
    chain:'jianghu_huanhun_3',
    completeText:'你在幽冥花田深处找到了一株通体翠绿、泛着微光的九转还魂草。',
    showInList: true
  },
  {
    id: 'jianghu_huanhun_3', name:'还魂', type:'剧情', giver:'花晚颜',
    scene:'lingyao_garden', desc:'将九转还魂草带回灵药园，救活花晚颜的爷爷。',
    prerequisite:'jianghu_huanhun_2',
    giverLine:'（花晚颜看到还魂草，眼泪夺眶而出，扑通跪下）大哥哥……你就是我们家的恩人！',
    npcHint:'花晚颜的爷爷服下药后，苍白的脸上终于有了血色。',
    requirements: { items:[{id:'huanhun_cao', qty:1}] },
    rewards: { stones: 300, exp: 250, items:[{id:'lingtong_pei', qty:1}], mood: 15 },
    completeText:'爷爷醒了。花晚颜将一枚灵瞳玉佩赠你："这是我天生的灵瞳之力凝成的玉佩，戴上它，能看见常人看不见的东西。"',
    showInList: true
  },

  // ── 线4：黑风寨旧案（燕无双·黑风岭）──
  {
    id: 'jianghu_heifeng_1', name:'寨主的委托', type:'剧情', giver:'燕无双',
    scene:'heifeng_ridge', desc:'黑风寨大当家燕无双认出你，请你帮她查一桩十年前的灭门旧案。',
    giverLine:'（燕无双把刀往桌上一拍）小兄弟，姑奶奶看你面善。十年前黑风寨被官府灭门，我爹死得不明不白。帮姑奶奶查查，那晚到底是谁下的令！',
    npcHint:'燕无双的虎皮交椅上，放着一卷泛黄的旧案宗。',
    requirements: { realm: 5 },
    rewards: { stones: 150, exp: 100 },
    chain:'jianghu_heifeng_2',
    completeText:'燕无双将旧案宗交给你："线索都在里面。记住，别信官府的鬼话。"',
    showInList: true
  },
  {
    id: 'jianghu_heifeng_2', name:'案宗疑云', type:'探索', giver:'燕无双',
    scene:'guji_ruins', desc:'根据案宗线索，前往远古遗迹调查当年灭门案的真相。',
    prerequisite:'jianghu_heifeng_1',
    giverLine:'',
    npcHint:'',
    requirements: { explore:'guji_ruins', kills:[{monster:'石像守卫', qty:3}] },
    rewards: { stones: 300, exp: 200 },
    chain:'jianghu_heifeng_3',
    completeText:'你在遗迹深处发现了一块刻着官印的残碑——灭门案的背后，果然有官府的人。',
    showInList: true
  },
  {
    id: 'jianghu_heifeng_3', name:'真相大白', type:'剧情', giver:'燕无双',
    scene:'heifeng_ridge', desc:'将残碑拓片带回给燕无双。',
    prerequisite:'jianghu_heifeng_2',
    giverLine:'（燕无双看着残碑拓片，眼眶通红，一刀劈在桌角）……原来是他！那个狗官，如今竟成了州府大员！姑奶奶这就要去讨个说法！',
    npcHint:'燕无双握刀的手微微发抖，眼中却燃着复仇的火。',
    requirements: { realm: 6 },
    rewards: { stones: 400, exp: 300, items:[{id:'heifeng_ling', qty:1}], mood: 10 },
    completeText:'燕无双将一枚黑风令赠你："以后黑风寨的大门永远为你敞开。姑奶奶欠你一个人情！"',
    showInList: true
  },

  // ── 线5：九色神莲（灵小小·浮空花园）──
  {
    id: 'jianghu_shenlian_1', name:'枯败的神莲', type:'剧情', giver:'灵小小',
    scene:'ty_floating_garden', desc:'浮空花园的守花小仙灵小小求你帮忙，让枯萎百年的九色神莲重开。',
    giverLine:'（灵小小从花丛后探出头，难得正经）喂，大修士！花园里的九色神莲枯了一百年了，再不开花，花园就要塌了！你帮帮我嘛！',
    npcHint:'灵小小的发间琉璃花，光泽黯淡了许多。',
    requirements: { realm: 11 },
    rewards: { stones: 500, exp: 300 },
    chain:'jianghu_shenlian_2',
    completeText:'灵小小塞给你一枚花种："这是神莲的种子，需要天域雷池的雷灵之气才能发芽。你去雷池走一趟！"',
    showInList: true
  },
  {
    id: 'jianghu_shenlian_2', name:'雷池引雷', type:'讨伐', giver:'灵小小',
    scene:'ty_leichi', desc:'前往天域雷池，猎杀雷池蛟龙，取其内丹为神莲种子充能。',
    prerequisite:'jianghu_shenlian_1',
    giverLine:'',
    npcHint:'',
    requirements: { kills:[{monster:'雷池蛟龙', qty:2}] },
    rewards: { stones: 800, exp: 500, items:[{id:'leichi_neidan', qty:1}] },
    chain:'jianghu_shenlian_3',
    completeText:'雷池蛟龙的内丹在掌心跳动，蕴含着磅礴的雷灵之力。',
    showInList: true
  },
  {
    id: 'jianghu_shenlian_3', name:'神莲重开', type:'剧情', giver:'灵小小',
    scene:'ty_floating_garden', desc:'带着雷灵内丹回到浮空花园，助九色神莲重开。',
    prerequisite:'jianghu_shenlian_2',
    giverLine:'（灵小小将内丹埋入神莲根部，刹那间霞光万丈，九色花瓣次第绽放）开了！真的开了！大修士，你太厉害了！这朵花送你！',
    npcHint:'九色神莲在霞光中盛开，整座浮空花园都亮了起来。',
    requirements: { items:[{id:'leichi_neidan', qty:1}] },
    rewards: { stones: 1000, exp: 800, items:[{id:'shenlian_hua', qty:1}], mood: 15 },
    completeText:'你获得九色神莲。此花可入药、可炼器，更是浮空花园的友谊之证。',
    showInList: true
  },

  // ── 线6：无名剑客（洛无霜·落霞森林）──
  {
    id: 'jianghu_wuming_1', name:'剑指无名', type:'剧情', giver:'洛无霜',
    scene:'luoxia_forest', desc:'流浪剑客洛无霜注意到你的剑意，请你帮她寻一位十年前击败她师父的无名剑客。',
    giverLine:'（洛无霜上下打量你，指尖在剑鞘上轻轻一叩）你身上有剑意，不错。帮我打听一个人——十年前三剑败我师父的无名剑客。江湖上，你认识的人多。',
    npcHint:'洛无霜的窄刃长剑在月光下泛着寒光。',
    requirements: { realm: 6, kills:[{monster:'野狼', qty:5}] },
    rewards: { stones: 200, exp: 150, mood: 5 },
    chain:'jianghu_wuming_2',
    completeText:'洛无霜微微点头，眼中闪过一丝期待：“有消息了来找我。”',
    showInList: true
  },
  {
    id: 'jianghu_wuming_2', name:'剑冢消息', type:'剧情', giver:'洛无霜',
    scene:'guji_ruins', desc:'有人告诉你，远古遗迹中有一块刻着剑痕的古碑，或许是那位无名剑客所留。前往遗迹调查。',
    prerequisite:'jianghu_wuming_1',
    giverLine:'',
    npcHint:'',
    requirements: { explore:'guji_ruins', kills:[{monster:'石像守卫', qty:3}] },
    rewards: { stones: 300, exp: 250, items:[{id:'jianhen_bei', qty:1}] },
    chain:'jianghu_wuming_3',
    completeText:'你在遗迹深处发现一块古碑，碑上只有三道剑痕——每一道都蕴含着令人心悸的剑意。',
    showInList: true
  },
  {
    id: 'jianghu_wuming_3', name:'三剑之约', type:'剧情', giver:'洛无霜',
    scene:'luoxia_forest', desc:'将剑痕拓片带回给洛无霜。',
    prerequisite:'jianghu_wuming_2',
    giverLine:'（洛无霜看着剑痕拓片，久久不语，忽然展颜一笑）……原来是他。十年前败师父的人，是剑冢的守冢人。师父输得不冤。这份因果，我放下了。',
    npcHint:'洛无霜收剑入鞘，眉宇间的戾气消散了大半。',
    requirements: { items:[{id:'jianhen_bei', qty:1}] },
    rewards: { stones: 400, exp: 350, items:[{id:'wuming_jianpu', qty:1}], mood: 15 },
    completeText:'洛无霜将一卷剑谱赠你："这是我毕生所悟的剑法。你的剑意，不该被埋没。"',
    showInList: true
  },

  // ── 线7：铸剑（铁老墨·玄铁矿）──
  {
    id: 'jianghu_zhuijian_1', name:'沉默的锤声', type:'剧情', giver:'铁老墨',
    scene:'xuantie_mine', desc:'矿工铁老墨发现你懂兵器，请你帮他找一块上等的玄铁精粹，他要铸一柄剑。',
    giverLine:'（铁老墨抡起铁锤在砧上敲了三下，火星四溅）小伙子，懂兵器？帮老朽找块玄铁精粹来——老朽的手，想再铸一柄剑。',
    npcHint:'铁老墨的锤子落下时，你隐约看到他的手臂在微微颤抖。',
    requirements: { realm: 5, items:[{id:'xuantie_jingcui', qty:3}] },
    rewards: { stones: 250, exp: 200, mood: 8 },
    chain:'jianghu_zhuijian_2',
    completeText:'铁老墨掂了掂玄铁精粹，眼中燃起久违的火光："好料！够铸一柄好剑了。"',
    showInList: true
  },
  {
    id: 'jianghu_zhuijian_2', name:'炉火重燃', type:'剧情', giver:'铁老墨',
    scene:'xuantie_mine', desc:'铁老墨开炉铸剑，但需要火精草维持炉火。去灵药园找药痴老头要几株。',
    prerequisite:'jianghu_zhuijian_1',
    giverLine:'（铁老墨看着炉火，声音低沉）火精草，灵药园的药痴老头那儿有。老朽跟他，还有几分交情……你去取几株来。',
    npcHint:'铁老墨的炉火忽明忽暗，像他起伏的心绪。',
    requirements: { explore:'lingyao_garden', items:[{id:'huojing_cao', qty:3}] },
    rewards: { stones: 300, exp: 250 },
    chain:'jianghu_zhuijian_3',
    completeText:'你带回火精草，炉火腾地窜起三尺高。铁老墨的眼中，倒映着跳动的火光。',
    showInList: true
  },
  {
    id: 'jianghu_zhuijian_3', name:'剑成', type:'剧情', giver:'铁老墨',
    scene:'xuantie_mine', desc:'铁老墨铸剑七日，终于铸成。去看看他的剑。',
    prerequisite:'jianghu_zhuijian_2',
    giverLine:'（铁老墨捧着一柄通体乌黑的长剑，双手都在发抖）成了……四十年了，老朽终于又铸成了一柄剑。这剑，送你了。',
    npcHint:'乌黑长剑在火光中流淌着摄人的光泽，剑身上有一道天然的纹路，如龙似蛇。',
    requirements: { realm: 6 },
    rewards: { stones: 500, exp: 400, items:[{id:'mohei_jian', qty:1}], mood: 15 },
    completeText:'你获得墨黑剑。铁老墨说，剑名"归墟"——"老朽的心，也该归墟了。"',
    showInList: true
  },

  // ── 线8：幽冥引路（白流云·忘川河）──
  {
    id: 'jianghu_yinlu_1', name:'渡魂人', type:'剧情', giver:'白流云',
    scene:'yy_wangchuan_river', desc:'忘川河上的引路人白流云请你帮一个忙：河中有一缕执念不散的魂魄，需要有人替他了却心愿。',
    giverLine:'（白流云缓缓抬起斗笠，露出一双没有焦距的眼睛）……三百年来，你是第一个能看见我的活人。帮我渡一个人，他叫……陈平安。',
    npcHint:'白流云的白衣在河风中轻轻摆动，船头的青灯忽明忽暗。',
    requirements: { realm: 9 },
    rewards: { stones: 300, exp: 250, mood: 10 },
    chain:'jianghu_yinlu_2',
    completeText:'白流云将一枚青灯递给你："这是他生前最爱的灯。拿着它，去凡尘的青云镇，找他的后人。"',
    showInList: true
  },
  {
    id: 'jianghu_yinlu_2', name:'执念', type:'剧情', giver:'白流云',
    scene:'qingyun', desc:'带着青灯前往青云镇，寻找陈平安的后人，了却他的执念。',
    prerequisite:'jianghu_yinlu_1',
    giverLine:'',
    npcHint:'',
    requirements: { sceneVisit:'qingyun', realm: 9 },
    rewards: { stones: 400, exp: 300 },
    chain:'jianghu_yinlu_3',
    completeText:'你在青云镇找到了陈平安的后人——一个卖豆腐的老妇人。她看到青灯，老泪纵横："这是我爹的灯……他说他要渡河去了……"',
    showInList: true
  },
  {
    id: 'jianghu_yinlu_3', name:'灯灭人归', type:'剧情', giver:'白流云',
    scene:'yy_wangchuan_river', desc:'回到忘川河，将结果告诉白流云。',
    prerequisite:'jianghu_yinlu_2',
    giverLine:'（白流云听完，沉默良久，忽然笑了——那是三百年来他的第一个笑）……陈平安，可以安心投胎了。多谢你。这个，送你。',
    npcHint:'白流云的青灯，第一次燃起了温暖的光。',
    requirements: { realm: 10 },
    rewards: { stones: 600, exp: 500, items:[{id:'qingdeng', qty:1}], mood: 20 },
    completeText:'你获得引魂青灯。白流云说，持此灯者，幽冥路上不会迷路。',
    showInList: true
  },

  // ── 线9：天道传承（苏晚渔·天道峰）──
  {
    id: 'jianghu_tiandao_1', name:'守灵人的等待', type:'剧情', giver:'苏晚渔',
    scene:'ty_tiandao_peak', desc:'天道峰守灵人苏晚渔说，她在等一位能通过天道考验、接过峰主之位的人。',
    giverLine:'（苏晚渔双手交叠，微微欠身）道友能登上天道峰，便是有缘。天道峰的传承空悬百年，我在等一位能扛起它的人——你，愿意一试吗？',
    npcHint:'苏晚渔额间的朱砂在晨光中微微发亮，像一盏不灭的灯。',
    requirements: { realm: 12 },
    rewards: { stones: 500, exp: 400, mood: 10 },
    chain:'jianghu_tiandao_2',
    completeText:'苏晚渔将一枚温润的玉佩递给你："这是天道峰的试炼之玉。通过考验，它便是你的。"',
    showInList: true
  },
  {
    id: 'jianghu_tiandao_2', name:'天道试炼', type:'讨伐', giver:'苏晚渔',
    scene:'ty_tiandao_peak', desc:'天道峰的考验：击败峰顶的守灵兽，证明你的实力。',
    prerequisite:'jianghu_tiandao_1',
    giverLine:'',
    npcHint:'',
    requirements: { kills:[{monster:'天道峰守灵', qty:1}] },
    rewards: { stones: 800, exp: 600, items:[{id:'tiandao_ling', qty:1}] },
    chain:'jianghu_tiandao_3',
    completeText:'你击败守灵兽，天地间仿佛响起一声钟鸣。天道峰顶，浮现出一道古老的阵纹。',
    showInList: true
  },
  {
    id: 'jianghu_tiandao_3', name:'峰主之位', type:'剧情', giver:'苏晚渔',
    scene:'ty_tiandao_peak', desc:'回到苏晚渔身边，接受天道峰的传承。',
    prerequisite:'jianghu_tiandao_2',
    giverLine:'（苏晚渔看到阵纹，眼中泛起泪光）……三百年了，终于有人通过了考验。道友，天道峰的未来，拜托你了。',
    npcHint:'苏晚渔将玉佩轻轻按在你掌心，天道峰的阵纹亮起柔和的光。',
    requirements: { items:[{id:'tiandao_ling', qty:1}] },
    rewards: { stones: 1200, exp: 1000, items:[{id:'tiandao_yupei', qty:1}], mood: 20 },
    completeText:'你获得天道峰主玉佩。苏晚渔说，从今往后，天道峰以你为尊。',
    showInList: true
  },
];

// 合并到 QUEST_DB（保持引用：EXTENDED_QUEST_DB = QUEST_DB）
function injectJianghuQuests() {
  if (typeof QUEST_DB === 'undefined') return;
  const existingIds = new Set(QUEST_DB.map(q => q.id));
  JIANGHU_QUEST_DB.forEach(q => {
    if (!existingIds.has(q.id)) {
      QUEST_DB.push(q);
      existingIds.add(q.id);
    }
  });
  if (typeof EXTENDED_QUEST_DB !== 'undefined') {
    // EXTENDED_QUEST_DB 是引用，自动同步；但保险起见重新赋值
    // （data.js 里 EXTENDED_QUEST_DB = QUEST_DB 是引用，push 后自动可见）
  }
}

// ==========================
// 三、江湖人物注入（NPC管理器）
// ==========================
function ensureJianghuNPCs(sceneId) {
  // 使用 npcManager 实例（npc.js 里 const npcManager = new NPCManager()）
  const mgr = (typeof npcManager !== 'undefined' && npcManager) ? npcManager : null;
  if (!mgr) return;
  const templates = getJianghuNPCsForScene(sceneId);
  if (!templates.length) return;
  const existing = mgr.npcs || [];
  templates.forEach(tpl => {
    const has = existing.some(n => n.key === tpl.key || (n.name === tpl.name && n.sceneId === tpl.sceneId));
    if (!has) {
      const npc = Object.assign({}, tpl, {
        id: 'jh_' + tpl.key,
        key: tpl.key,
        affinity: 0,
        dialogHistory: [],
        questGiven: false,
        tradeGoods: null,
        aiDescription: null,
        aiDialogueStyle: null,
        isJianghu: true,
      });
      mgr.npcs.push(npc);
      // 生成登场描写
      if (typeof generateNPCStory === 'function') {
        try { generateNPCStory(npc); } catch(e) {}
      }
    }
  });
}

// 给江湖人物挂接任务提示（对话时显示任务线索）
function getJianghuQuestHint(npc) {
  if (!npc || !npc.questLine) return null;
  const line = npc.questLine;
  const quests = JIANGHU_QUEST_DB.filter(q => q.id.startsWith(line) || q.id === line);
  return quests.length ? quests : null;
}

// ==========================
// 四、新场景注入（3个）
// ==========================
// 醉仙楼（坊市场景·凡尘）、万兽山庄（中州）、天机阁（中州·天机城内）
const JIANGHU_SCENES = [
  {
    id:'zuixian_lou', name:'醉仙楼', x:4, y:3, type:'town', safe:true, qiLevel:4,
    description:'凡尘最有名的酒楼，三教九流汇聚之地。江湖消息、恩怨情仇，都在这酒香里发酵。',
    cosmosDomain:'donghuang', cosmosRegion:'dh_canglan', feature:'酒楼',
    npcPool:['跑堂小二','酒客','江湖说书人','醉剑客','情报贩子'],
    connections:['qingyun','qingyun_pier'],
  },
  {
    id:'wanshou_shanzhuang', name:'万兽山庄', x:5, y:6, type:'wild', safe:false, qiLevel:9,
    description:'中州御兽世家的山庄，豢养着无数奇珍异兽。庄主以兽会友，也以兽御敌。',
    cosmosDomain:'zhongzhou', cosmosRegion:'zz_yaoshou', feature:'驯兽',
    monsters:['青鳞蛟','赤目妖狼','紫电貂'],
    npcPool:['驯兽师','兽苑管事','御兽弟子','采药人'],
    connections:['zz_tianji_city','zz_yaoshou_ridge','tianji_ge'],
  },
  {
    id:'tianji_ge', name:'天机阁', x:4, y:5, type:'building', safe:true, qiLevel:10,
    description:'中州最神秘的组织，通晓天下事。阁中藏书万卷，每一卷都记载着一段不为人知的因果。',
    cosmosDomain:'zhongzhou', cosmosRegion:'zz_tianji', feature:'情报',
    npcPool:['天机阁弟子','守阁长老','录事','密探'],
    connections:['zz_tianji_city','wanshou_shanzhuang'],
  },
];

function injectJianghuScenes() {
  if (typeof WORLD_DATA === 'undefined' || !WORLD_DATA.layers || !WORLD_DATA.layers[0]) return;
  const layer = WORLD_DATA.layers[0];
  const existingIds = new Set((layer.scenes || []).map(s => s.id));
  JIANGHU_SCENES.forEach(scene => {
    if (!existingIds.has(scene.id)) {
      layer.scenes.push(scene);
      existingIds.add(scene.id);
    }
  });
}

// 导出
window.JIANGHU_NPC_TEMPLATES = JIANGHU_NPC_TEMPLATES;
window.JIANGHU_QUEST_DB = JIANGHU_QUEST_DB;
window.JIANGHU_SCENES = JIANGHU_SCENES;
window.ensureJianghuNPCs = ensureJianghuNPCs;
window.getJianghuNPCsForScene = getJianghuNPCsForScene;
window.injectJianghuQuests = injectJianghuQuests;
window.injectJianghuScenes = injectJianghuScenes;
window.getJianghuQuestHint = getJianghuQuestHint;

// 自动注入任务与场景（data.js 已先行加载，QUEST_DB/WORLD_DATA 可用）
try {
  injectJianghuQuests();
  injectJianghuScenes();
} catch(e) {
  console.warn('江湖扩展注入失败:', e.message);
}
