// === 唯我独仙 · 玄黄大陆·九域志 (展示级·不影响游戏进程) ===
// 版本：v1.0
// 说明：纯世界观展示地图，不可交互进入

// ==========================
// 一、世界架构总纲
// ==========================
const XUANHUANG_COSMOS = {
  name: '玄黄大陆',
  era: '开天第三纪元·灵潮复苏',
  origin: '混沌初开，清气上升为天，浊气下沉为地。中央隆起为玄黄大陆，四海环绕，万灵共生。',
  
  // ── 三层世界 ──
  realms: [
    {
      id: 'mortal',
      name: '凡尘界',
      title: '红尘炼心',
      desc: '凡人修士共存之地，九域纵横十万里。灵脉分布不均，越靠近中州灵气越浓。',
      accent: '#6a9ec9',
    },
    {
      id: 'nether',
      name: '幽冥界',
      title: '生死轮回',
      desc: '众生归处，亦是新生之地。九域之下皆通幽冥，各有一处冥府入口。阴气弥漫，魂魄游荡。',
      accent: '#9a6ac9',
    },
    {
      id: 'divine',
      name: '通天路',
      title: '问道长生',
      desc: '连接九域的上古天路，悬浮于云天之上。每域皆有一座登天塔，唯有大修士方能踏入。',
      accent: '#c96a6a',
    },
  ],

  // ── 九大域（核心内容）──
  domains: [
    // ═══════ 1. 东荒域 ═══════
    {
      id: 'donghuang',
      name: '东荒域',
      title: '蛮荒初开',
      emoji: '🌄',
      gridX: 1, gridY: 2, // 在九宫格中的位置
      accentColor: '#7aad5a',
      desc: '九域之东，蛮荒之地。灵脉稀薄却生机勃勃，妖兽与凡人混居。东荒苍澜州·青云镇是你的起点。',
      lore: '上古时期，东荒曾是神兽苍龙的陨落之地。龙血浸入大地，使得此域草木异常茂盛，却也滋养了凶兽。万年前一位无名散修在此创建了最初的修仙聚落，逐渐演变为青云镇。东荒虽贫瘠，但民风淳朴，天地间保留着最原始的修道气息。',
      danger: '中等',
      qiLevel: 3,
      population: '散修为主，凡人居多',
      famous: '天柱峰、碧落海、苍龙渊、落霞森林',
      subRegions: [
        { id: 'dh_canglan', name: '苍澜州', desc: '东荒西部平原，青云镇所在。灵脉微弱，适合炼气初期。', type: 'plain', qiLevel: 3, features: ['青云镇','古井秘境'] },
        { id: 'dh_qingmu', name: '青木原', desc: '原始森林覆盖千里，古木参天。林中有上古遗迹碎片。', type: 'forest', qiLevel: 4, features: ['精灵古树','药王谷'] },
        { id: 'dh_tianzhu', name: '天柱峰', desc: '东荒最高峰，传说为苍龙角所化。山顶时有紫气东来。', type: 'mountain', qiLevel: 5, features: ['观日台','龙角洞'] },
        { id: 'dh_biluo', name: '碧落海', desc: '东荒东海，海岸线蜿蜒千里。海底有龙宫遗墟。', type: 'sea', qiLevel: 4, features: ['珊瑚礁','鲸落之地'] },
        { id: 'dh_luori', name: '落日平原', desc: '东荒西接中州的过渡地带，草原广袤，野马成群。', type: 'plain', qiLevel: 3, features: ['奔马原','古道驿站'] },
      ],
    },

    // ═══════ 2. 中州域 ═══════
    {
      id: 'zhongzhou',
      name: '中州域',
      title: '天下之中',
      emoji: '🏯',
      gridX: 2, gridY: 1,
      accentColor: '#c9a96e',
      desc: '九域之中心，灵脉汇聚之地。天机城雄踞中州，天下修士往来如织。',
      lore: '中州是玄黄大陆灵气最浓郁之地。万年前天机子在此建立天机城，开修真界万世太平。中州地势平坦，八条灵脉如龙盘踞，形成了天然的大阵。八大世家与天机阁共治此域，法规森严，鲜有争斗。中州也是唯一有直接通往其余八域传送阵的地方。',
      danger: '低',
      qiLevel: 7,
      population: '宗门弟子为主，凡人稀少',
      famous: '天机城、太虚山、万宝楼、龙脉谷',
      subRegions: [
        { id: 'zz_tianji', name: '天机城', desc: '天下第一城，天机阁总部。城墙高百丈，八门对应八卦。', type: 'city', qiLevel: 7, features: ['天机阁','演武场','藏经楼'] },
        { id: 'zz_taixu', name: '太虚山', desc: '道家祖庭，太虚宫所在地。山中藏有开天壁刻。', type: 'mountain', qiLevel: 8, features: ['太虚宫','壁刻谷','问道崖'] },
        { id: 'zz_wanbao', name: '万宝楼', desc: '天下最大的交易市场，聚宝盆地形。三尺之内必有灵宝。', type: 'city', qiLevel: 6, features: ['万宝楼','灵材街','拍卖行'] },
        { id: 'zz_longmai', name: '龙脉谷', desc: '八条灵脉交汇之处，灵气近乎液化。各大宗门在此建有分院。', type: 'valley', qiLevel: 9, features: ['灵液池','闭关崖','论道台'] },
      ],
    },

    // ═══════ 3. 南极域 ═══════
    {
      id: 'nanji',
      name: '南极域',
      title: '十万大山',
      emoji: '🏔️',
      gridX: 1, gridY: 0,
      accentColor: '#d46a3a',
      desc: '九域之南，十万大山横亘。蛮荒之地多瘴气，巫蛊之术在此盛行。',
      lore: '南极域是玄黄大陆最古老的大陆碎片。十万大山中保存着上古蛮荒时期的生态，许多外界已灭绝的灵兽灵草在此仍有分布。南极的巫族传承完全不依赖灵根，而是通过蛊虫和血契获得力量。传说极南之处有一座永不熄灭的火山——炎帝熔炉，是天下炼器师心中的圣地。',
      danger: '极高',
      qiLevel: 4,
      population: '巫族后裔、蛮族部落',
      famous: '十万大山、蛊神秘境、火桑林、炎帝城',
      subRegions: [
        { id: 'nj_shiwanda', name: '十万大山', desc: '千里苍山连绵不断，山中瘴气弥漫。深处有上古蛮族遗迹。', type: 'mountain', qiLevel: 4, features: ['蛊神秘境','毒瘴谷','龙骨山'] },
        { id: 'nj_huosang', name: '火桑林', desc: '火桑木漫山遍野，终年赤红如霞。是炼制火系法器的上等材料产地。', type: 'forest', qiLevel: 5, features: ['火桑王','熔岩河','凤凰巢'] },
        { id: 'nj_yandi', name: '炎帝城', desc: '依火山而建的古城，城中地火常年不息。天下炼器师聚集于此。', type: 'city', qiLevel: 5, features: ['地火室','铸剑台','精铁库'] },
        { id: 'nj_xuechi', name: '血池秘境', desc: '远古战场遗迹，煞气凝结成血池。炼体修士的试炼之地。', type: 'danger', qiLevel: 6, features: ['血池','煞气窟','骨林'] },
      ],
    },

    // ═══════ 4. 西漠域 ═══════
    {
      id: 'ximo',
      name: '西漠域',
      title: '黄沙古道',
      emoji: '🏜️',
      gridX: 0, gridY: 1,
      accentColor: '#c9a96e',
      desc: '九域之西，万里黄沙。古丝绸之路穿越戈壁，连接着西域佛国与中土。',
      lore: '西漠曾经是一片沃土，上古佛门在此兴盛。一场浩劫将佛国化为废墟，大地化为沙漠。然而沙海之下掩埋着无数佛门遗迹，时有修士在流沙中发现上古舍利。西漠的游牧民族信奉沙之神，逐水草而居，偶尔会袭击商队。玉门关是西域第一雄关，也是修真界抵御沙漠妖兽的第一道防线。',
      danger: '高',
      qiLevel: 4,
      population: '游牧部落、苦行僧',
      famous: '流沙海、佛国遗迹、玉门关、须弥山',
      subRegions: [
        { id: 'xm_liusha', name: '流沙海', desc: '万里黄沙如海，风起时沙暴遮天蔽日。沙海深处有古城遗迹。', type: 'desert', qiLevel: 4, features: ['沙暴区','古城墟','绿洲'] },
        { id: 'xm_foguo', name: '佛国遗迹', desc: '上古佛国的废墟，断壁残垣间仍可见佛像与经文。地下有藏经洞。', type: 'ruin', qiLevel: 5, features: ['大雷音寺遗址','藏经洞','舍利塔'] },
        { id: 'xm_yumen', name: '玉门关', desc: '中州通往西域的第一雄关，城墙由整块青玉砌成。关内驻扎着镇西军。', type: 'city', qiLevel: 3, features: ['镇西军大营','关市','望乡台'] },
        { id: 'xm_xumi', name: '须弥山', desc: '沙漠中的孤山，西域佛门最后的圣地。山顶有七级浮屠塔。', type: 'mountain', qiLevel: 6, features: ['浮屠塔','金身洞','菩提树'] },
      ],
    },

    // ═══════ 5. 北极域 ═══════
    {
      id: 'beiji',
      name: '北极域',
      title: '冰原雪域',
      emoji: '❄️',
      gridX: 2, gridY: 2,
      accentColor: '#6a9ec9',
      desc: '九域之北，终年冰雪覆盖。冰原之下埋葬着太古时期的秘密。',
      lore: '北极域是玄黄大陆最寒冷的区域，一年之中只有三个月冰雪会稍微融化。冰原厚度达千丈，冰封着无数上古生物与遗迹。每隔百年，极光出现之时，冰原上的古老阵法会短暂重启，通往太古秘境的大门会打开。北极的雪神殿是冰系功法的发源地，历代殿主皆为女性。',
      danger: '极高',
      qiLevel: 5,
      population: '雪族后裔、极地修士',
      famous: '冰封海、雪神殿、极光谷、寒渊',
      subRegions: [
        { id: 'bj_bingfeng', name: '冰封海', desc: '千里冰封的大海，冰面如镜。冰层之下隐约可见巨大的黑影游动。', type: 'sea', qiLevel: 5, features: ['冰裂谷','冰下洞穴','捕鲸站'] },
        { id: 'bj_xueshen', name: '雪神殿', desc: '万载玄冰雕刻而成的宫殿群，通体晶莹剔透。殿中供奉着冰之大道。', type: 'city', qiLevel: 6, features: ['冰晶大殿','千年玄冰','冰莲池'] },
        { id: 'bj_jiguang', name: '极光谷', desc: '极光照耀之谷，色彩变幻如梦。谷中灵气受极光影响强弱不定。', type: 'valley', qiLevel: 7, features: ['极光台','天象石','冰晶森林'] },
        { id: 'bj_hanyuan', name: '寒渊', desc: '世界最深的裂谷，深不见底。谷口喷出的寒气能冻结灵力。', type: 'danger', qiLevel: 8, features: ['深渊入口','永恒冰层','寒髓洞'] },
      ],
    },

    // ═══════ 6. 东海域 ═══════
    {
      id: 'donghai',
      name: '东海域',
      title: '万岛仙海',
      emoji: '🌊',
      gridX: 2, gridY: 0,
      accentColor: '#4aa3df',
      desc: '九域之东的万里海域，岛屿星罗棋布。蓬莱、方丈、瀛洲海外三仙山便在此处。',
      lore: '东海域由数千座岛屿组成，最大的三座——蓬莱、方丈、瀛洲——被称为海外三仙山。传说秦始皇曾派徐福率三千童男童女东渡寻仙，那支船队最终在蓬莱仙岛登陆，繁衍生息。东海中的龙族是玄黄大陆最古老的种族之一，龙宫深藏在东海海沟之中。东海修士以水系功法见长，与龙族世代交好。',
      danger: '高',
      qiLevel: 6,
      population: '海岛修士、龙族、渔民',
      famous: '蓬莱仙岛、方丈岛、瀛洲、龙宫',
      subRegions: [
        { id: 'dh_penglai', name: '蓬莱仙岛', desc: '海外第一名山，云雾缭绕如仙境。岛上灵兽遍野，仙草满地。', type: 'island', qiLevel: 7, features: ['仙人洞','不老泉','丹霞峰'] },
        { id: 'dh_fangzhang', name: '方丈岛', desc: '散修聚集的自由之岛，岛上无宗门无规矩。交易市场日夜不息。', type: 'island', qiLevel: 5, features: ['自由市场','竞技场','黑市'] },
        { id: 'dh_yingzhou', name: '瀛洲', desc: '三仙山中最神秘的一座，常有海市蜃楼。岛上有上古传承遗迹。', type: 'island', qiLevel: 8, features: ['传承殿','海市楼','翡翠池'] },
        { id: 'dh_longgong', name: '龙宫', desc: '东海龙族的水下宫殿群，由万年珊瑚建成。海水被避水珠隔开。', type: 'city', qiLevel: 7, features: ['水晶殿','龙族祭坛','珊瑚林'] },
      ],
    },

    // ═══════ 7. 天域 ═══════
    {
      id: 'tianyu',
      name: '天域',
      title: '浮空仙境',
      emoji: '☁️',
      gridX: 1, gridY: 1,
      accentColor: '#e8c88a',
      desc: '悬浮在云天之上的浮岛群。天域是九域中灵气最浓郁之地，也是通往通天路的门户。',
      lore: '天域由数十座悬浮在云海中的巨大浮空山组成，每座浮空山都靠上古阵法维持悬浮。传说天域是太古时期天崩地裂后，破碎的大陆碎片被大能者以法力固定在空中的遗迹。天域的城市——云霄城——建造在最大的浮空山上，城中的建筑皆用白玉雕砌，在阳光下熠熠生辉。天域是唯一能直接观察到通天路的地方。',
      danger: '低',
      qiLevel: 8,
      population: '上修世家、天族后裔',
      famous: '浮空山、云霄城、风之谷、雷池',
      subRegions: [
        { id: 'ty_fulong', name: '浮空山', desc: '数十座悬浮在云海中的山峰，彼此有悬桥相连。崖边常有仙人论道。', type: 'mountain', qiLevel: 8, features: ['悬桥','云雾阁','论道崖'] },
        { id: 'ty_yunxiao', name: '云霄城', desc: '悬浮在最高处的白玉之城，城门上书"一步登天"四字。', type: 'city', qiLevel: 9, features: ['白玉宫','登天塔','灵脉核心'] },
        { id: 'ty_fenggu', name: '风之谷', desc: '终年被罡风笼罩的峡谷，风中有剑意。是风系功法的修炼圣地。', type: 'valley', qiLevel: 7, features: ['风眼','剑意崖','风灵石矿'] },
        { id: 'ty_leichi', name: '雷池', desc: '雷霆肆虐之地，天空常年乌云密布。每隔一刻便有天雷劈下。', type: 'danger', qiLevel: 8, features: ['雷击木','雷霆池','渡劫台'] },
      ],
    },

    // ═══════ 8. 幽域 ═══════
    {
      id: 'youyu',
      name: '幽域',
      title: '生死边界',
      emoji: '💀',
      gridX: 0, gridY: 0,
      accentColor: '#7a5a9a',
      desc: '凡尘界与幽冥界交界的狭长地带，生死之气在此交汇。此域常年阴云笼罩，昼夜不分。',
      lore: '幽域是九域中最诡异的地方。这里既是凡尘界的一部分，又因空间薄弱而与幽冥界相通。每至月圆之夜，空间裂缝会短暂打开，冥界的阴气涌入，使得幽域的生灵发生异变。幽域的修士大多修炼与死亡相关的大道，性格孤僻。幽域居民寿命仅为其他域的一半，但修为增长极快。',
      danger: '极高',
      qiLevel: 5,
      population: '鬼修、阴阳师、亡灵法师',
      famous: '亡者峡谷、黄泉路、忘川河、轮回台',
      subRegions: [
        { id: 'yy_wangzhe', name: '亡者峡谷', desc: '阴气最浓郁的峡谷，谷中飘荡着无数残魂。深处有通往幽冥界的通道。', type: 'danger', qiLevel: 5, features: ['残魂谷','冥界裂缝','白骨山'] },
        { id: 'yy_huangquan', name: '黄泉路', desc: '铺满黄色碎石的古道，传说这是魂魄前往冥界的必经之路。路旁开满彼岸花。', type: 'road', qiLevel: 4, features: ['彼岸花海','三生石','望乡台'] },
        { id: 'yy_wangchuan', name: '忘川河', desc: '横贯幽域的冥河，河水漆黑如墨。河中有渡魂的船夫。', type: 'river', qiLevel: 6, features: ['奈何桥','渡口','孟婆亭'] },
        { id: 'yy_lunhui', name: '轮回台', desc: '幽域最深处的高台，台上刻有六道轮回图。是踏入幽冥界的最后一道关卡。', type: 'gate', qiLevel: 7, features: ['轮回祭坛','六道图','往生门'] },
      ],
    },

    // ═══════ 9. 虚无域 ═══════
    {
      id: 'xuwu',
      name: '虚无域',
      title: '虚空尽头',
      emoji: '🕳️',
      gridX: 0, gridY: 2,
      accentColor: '#2a2a3a',
      desc: '玄黄大陆的最边缘，空间极不稳定。这里是天地初开时留下的伤痕，也是最接近世界本源的地方。',
      lore: '虚无域不是真正的"域"，而是一片空间裂缝与虚无交织的地带。传说上古神魔大战打得天地破碎，这片区域便是那场大战留下的伤痕。虚无域中没有灵气，只有混沌之气——比灵气更原始的力量。唯有炼虚合道级别的大能方能在此生存。传言虚无域的最深处——归墟——是万物的终点，也是一切的起点。',
      danger: '灭绝级',
      qiLevel: 0,
      population: '无人居住（偶有大能探索）',
      famous: '混沌海、虚空裂缝、起源之地、归墟',
      subRegions: [
        { id: 'xw_hundun', name: '混沌海', desc: '一片混沌之气形成的海洋，海水是液态的混沌。踏入者需有大毅力。', type: 'danger', qiLevel: 0, features: ['混沌浪潮','灵气湮灭区','虚空岛屿'] },
        { id: 'xw_xukong', name: '虚空裂缝', desc: '空间破裂形成的裂缝带，如同天空被撕开的伤口。时有异界气息泄漏。', type: 'danger', qiLevel: 0, features: ['裂谷带','异界之门','虚空晶体'] },
        { id: 'xw_qiyuan', name: '起源之地', desc: '传说中天地初开的第一块大陆碎片。上面保留着世界最初的模样。', type: 'ruin', qiLevel: 0, features: ['初始石碑','混沌池','开天壁'] },
        { id: 'xw_guiyu', name: '归墟', desc: '万物的终点与起点。一片无尽的虚空深渊，凝视时能看见自己所有的前世今生。', type: 'gate', qiLevel: 0, features: ['虚无之门','镜像空间','星海观测点'] },
      ],
    },
  ],

  // ── 世界传说/大事记 ──
  chronicles: [
    { era: '开天纪元', year: 0, event: '混沌初开，玄黄大陆诞生。天地间第一批灵物出现。' },
    { era: '开天纪元', year: 10000, event: '第一批人类诞生，开始懵懂地感应天地灵气。' },
    { era: '开天纪元', year: 50000, event: '第一位修士出现，开创了修真文明。被后世尊为"道祖"。' },
    { era: '洪荒纪元', year: 0, event: '神魔大战爆发，天地破碎。玄黄大陆分裂为九域。' },
    { era: '洪荒纪元', year: 3000, event: '神族退居天域，魔族被封印于虚无域。人族成为大陆主宰。' },
    { era: '洪荒纪元', year: 10000, event: '佛门在西漠兴盛，建大雷音寺。南极巫族兴起。' },
    { era: '洪荒纪元', year: 30000, event: '幽冥界被发现，生死轮回之道被悟出。鬼修一脉诞生。' },
    { era: '灵潮纪元', year: 0, event: '末法时代结束，天地灵气开始复苏。修真界迎来新的黄金时代。' },
    { era: '灵潮纪元', year: 500, event: '天机子建立天机城，创立天机阁。修真界进入有序发展的时期。' },
    { era: '灵潮纪元', year: 1000, event: '海外三仙山的传送阵被修复，九域连通度大幅提升。' },
    { era: '灵潮纪元', year: 1500, event: '灵气复苏达到顶峰，大量新的秘境与遗迹被发现。"大争之世"开始。' },
    { era: '灵潮纪元', year: 2026, event: '【当前】灵潮持续高涨。东荒域苍澜州·青云镇，一个少年踏上修仙之路……' },
  ],

  // ── 世界之最 ──
  wonders: [
    { name: '天柱峰', desc: '东荒域最高峰，号称"接天之路"。峰顶终年云雾缭绕，传说登顶者可见天道。', domain: '东荒域' },
    { name: '天机城', desc: '天下第一城，城墙由整块御灵石砌成。城中有阵法可抵御化神期全力一击。', domain: '中州域' },
    { name: '炎帝熔炉', desc: '永不熄灭的地火，温度可熔化万物。炼制神器的不二之选。', domain: '南极域' },
    { name: '须弥浮屠', desc: '七级浮屠塔，每一层都是一个独立的小世界。塔顶供奉着佛门至宝——金身舍利。', domain: '西漠域' },
    { name: '永恒冰层', desc: '厚达千丈的万载玄冰，冰封着太古时期的秘密。冰层最深处有活着的太古生物。', domain: '北极域' },
    { name: '蓬莱不老泉', desc: '饮一口可增寿百年的灵泉。泉水源头无人知晓。', domain: '东海域' },
    { name: '云霄白玉宫', desc: '悬浮于万丈高空的玉白色宫殿群，是天域权力的中心。', domain: '天域' },
    { name: '轮回六道图', desc: '刻在轮回台上的天然阵图，据说是天道亲自留下的痕迹。', domain: '幽域' },
    { name: '混沌池', desc: '世界之初的第一池水，蕴含最原始的生命与毁灭之力。', domain: '虚无域' },
  ],

  // ── 连接关系 ──
  connections: [
    ['东荒域', '中州域'], ['东荒域', '东海域'], ['东荒域', '南极域'],
    ['中州域', '西漠域'], ['中州域', '北极域'], ['中州域', '天域'],
    ['南极域', '幽域'], ['西漠域', '幽域'], ['北极域', '天域'],
    ['东海域', '天域'], ['天域', '幽域'], ['幽域', '虚无域'],
  ],
};

// ==========================
// 函数导出
// ==========================
function getDomainData(domainId) {
  return XUANHUANG_COSMOS.domains.find(d => d.id === domainId);
}

function getQiRealmNameForIndex(idx) {
  // 有 QI_REALMS 就用，否则返回数字
  if (typeof QI_REALMS !== 'undefined' && QI_REALMS[idx]) return QI_REALMS[idx].name;
  return '第' + (idx + 1) + '阶';
}

function getSubRegion(domainId, subId) {
  const domain = getDomainData(domainId);
  if (!domain) return null;
  return domain.subRegions.find(s => s.id === subId);
}

function getWorldMapGrid() {
  // 返回一个3×3九宫格，每个格子放一个域
  const grid = [[], [], []];
  XUANHUANG_COSMOS.domains.forEach(d => {
    if (!grid[d.gridY]) grid[d.gridY] = [];
    grid[d.gridY][d.gridX] = d;
  });
  return grid;
}

// 浏览器导出
if (typeof window !== 'undefined') {
  window.XUANHUANG_COSMOS = XUANHUANG_COSMOS;
  window.getDomainData = getDomainData;
  window.getSubRegion = getSubRegion;
  window.getWorldMapGrid = getWorldMapGrid;
}


// ==========================
// 世界地图 UI 渲染
// ==========================
let _cosmosActiveTab = 'overview';
let _cosmosSelectedDomain = null;

function renderCosmosMap(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return '';
  
  let html = '';
  
  // ── 顶部导航 ──
  html += _renderCosmosNav();
  
  // ── 主内容区 ──
  html += '<div id="cosmos-main" style="display:flex;gap:16px;align-items:flex-start;">';
  html += _renderCosmosGrid();  // 左侧九宫格地图
  html += _renderCosmosDetail(); // 右侧详情面板
  html += '</div>';
  
  // ── 底部时间线 ──
  html += _renderCosmosTimeline();
  
  container.innerHTML = html;
  container.style.overflowY = 'auto';
  container.style.maxHeight = '80vh';
}

function _renderCosmosNav() {
  const tabs = [
    { id:'overview', label:'🌍 总览', title:'玄黄大陆全貌' },
    { id:'realms', label:'🌌 三层世界', title:'凡尘·幽冥·通天路' },
    { id:'domains', label:'🏯 九域详解', title:'九大域详情' },
    { id:'chronicles', label:'📜 纪元史', title:'世界大事记' },
    { id:'wonders', label:'✨ 天下奇观', title:'九大世界之最' },
  ];
  
  let html = '<div style="display:flex;gap:6px;margin-bottom:14px;flex-wrap:wrap;border-bottom:1px solid rgba(255,255,255,0.08);padding-bottom:10px;">';
  tabs.forEach(t => {
    const active = t.id === _cosmosActiveTab;
    html += `<div class="layer-tab ${active ? 'active' : ''}" 
      onclick="switchCosmosTab('${t.id}')"
      style="padding:6px 14px;border-radius:16px;font-size:12px;cursor:pointer;
        border:1px solid ${active ? 'var(--accent)' : 'rgba(255,255,255,0.08)'};
        background:${active ? 'rgba(201,169,110,0.12)' : 'transparent'};
        color:${active ? 'var(--text)' : 'var(--text-dim)'};">
      ${t.label}
      ${active ? `<span style="font-size:9px;color:var(--accent);margin-left:4px;">· ${t.title}</span>` : ''}
    </div>`;
  });
  html += '</div>';
  return html;
}

function _renderCosmosGrid() {
  const grid = getWorldMapGrid();
  
  let html = '<div style="flex:0 0 420px;">';
  html += '<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:6px;">';
  
  for (let y = 0; y < 3; y++) {
    for (let x = 0; x < 3; x++) {
      const domain = grid[y]?.[x];
      if (domain) {
        var selected = _cosmosSelectedDomain === domain.id;
        // ── 判断玩家当前位置 ──
        var isHere = false;
        try {
          var curSceneData = typeof getSceneData === 'function' ? getSceneData(G.currentScene) : null;
          isHere = curSceneData && curSceneData.cosmosDomain === domain.id;
          // 如果 cosmosDomain 匹配不到（比如毒瘴沼泽标了 youyu 却是南极域入口），
          // 用 DOMAIN_ENTRY_SCENES 兜底判断
          if (!isHere && typeof DOMAIN_ENTRY_SCENES !== 'undefined') {
            isHere = DOMAIN_ENTRY_SCENES[domain.id] === G.currentScene;
          }
        } catch(e) {}
        var borderColor = isHere ? '#ffd700' : (selected ? domain.accentColor : 'rgba(255,255,255,0.06)');
        var bgColor = isHere ? 'rgba(255,215,0,0.08)' : (selected ? domain.accentColor + '22' : 'rgba(255,255,255,0.04)');
        html += `<div class="cosmos-domain-card ${selected ? 'selected' : ''} ${isHere ? 'current-location' : ''}"
          onclick="selectCosmosDomain('${domain.id}');"
          style="padding:10px 8px;border-radius:10px;cursor:pointer;
            background:${bgColor};
            border:2px solid ${borderColor};
            transition:all 0.2s;
            text-align:center;min-height:80px;
            display:flex;flex-direction:column;align-items:center;justify-content:center;gap:2px;"
          onmouseover="this.style.background='${isHere ? 'rgba(255,215,0,0.14)' : domain.accentColor + '18'}'"
          onmouseout="this.style.background='${bgColor}'">
          <div style="font-size:24px;">${domain.emoji}</div>
          <div style="font-size:13px;font-weight:bold;color:var(--text);margin-top:2px;">${domain.name}
            ${isHere ? '<span style="font-size:9px;color:#ffd700;margin-left:3px;">📍</span>' : ''}
            ${(()=>{const ac=typeof checkDomainAccess==='function'?checkDomainAccess(domain.id):null;return ac&&ac.pass && !isHere?'<span style="font-size:8px;color:#8bc34a;margin-left:3px;">✓</span>':''})()}
          </div>
          ${isHere ? '<div style="font-size:8px;color:#ffd700;margin-top:0;">📍 当前位置</div>' : ''}
          <div style="font-size:9px;color:${domain.accentColor};">${domain.title}</div>
          <div style="font-size:8px;color:var(--text-dim);margin-top:2px;">${domain.qiLevel>0?'灵气'+domain.qiLevel+'级':'⚡混沌'}</div>
          ${(()=>{const ac=typeof checkDomainAccess==='function'?checkDomainAccess(domain.id):null;return ac&&!ac.pass?('<div style="font-size:7px;color:#e74c3c;margin-top:1px;">🔒需修为≥'+getQiRealmNameForIndex(ac.required-1)+'</div>'):''})()}
        </div>`;
      } else {
        html += `<div style="border-radius:10px;border:1px dashed rgba(255,255,255,0.04);min-height:80px;display:flex;align-items:center;justify-content:center;">
          <span style="font-size:10px;color:rgba(255,255,255,0.08);">—</span>
        </div>`;
      }
    }
  }
  html += '</div>';
  
  // 连接线说明
  html += '<div style="margin-top:10px;font-size:9px;color:var(--text-dim);text-align:center;line-height:1.6;">';
  html += '𐄂 节点相连 · 空间传送阵连通九域';
  html += '</div>';
  
  // 三层世界切换
  html += '<div style="margin-top:8px;display:flex;gap:6px;justify-content:center;">';
  XUANHUANG_COSMOS.realms.forEach(r => {
    html += `<div style="padding:4px 10px;border-radius:12px;font-size:9px;border:1px solid ${r.accent}44;color:${r.accent};">`;
    if (r.id === 'mortal') html += '🌍 ';
    else if (r.id === 'nether') html += '💀 ';
    else html += '✨ ';
    html += `${r.name}: ${r.title}</div>`;
  });
  html += '</div>';
  
  html += '</div>';
  return html;
}

function _renderCosmosDetail() {
  let html = '<div style="flex:1;min-width:280px;">';
  
  if (_cosmosSelectedDomain) {
    const domain = getDomainData(_cosmosSelectedDomain);
    if (!domain) {
      html += '<div style="color:var(--text-dim);font-size:12px;">点击上方九域查看详情</div>';
      html += '</div>';
      return html;
    }
    
    // ── 域详情面板 ──
    const access = typeof checkDomainAccess === 'function' ? checkDomainAccess(domain.id) : null;
    const canEnter = access ? access.pass : false;
    // ── 判定玩家是否处在此域 ──
    var isHere = false;
    try {
      var curSD = typeof getSceneData === 'function' ? getSceneData(G.currentScene) : null;
      isHere = curSD && curSD.cosmosDomain === domain.id;
      if (!isHere && typeof DOMAIN_ENTRY_SCENES !== 'undefined') {
        isHere = DOMAIN_ENTRY_SCENES[domain.id] === G.currentScene;
      }
    } catch(e) {}
    html += `<div style="background:rgba(0,0,0,0.15);border-radius:10px;padding:14px;${isHere ? 'box-shadow:0 0 8px rgba(255,215,0,0.15);' : ''}">
      <div style="display:flex;align-items:center;gap:8px;margin-bottom:8px;">
        <span style="font-size:28px;">${domain.emoji}</span>
        <div>
          <div style="font-size:15px;font-weight:bold;color:${isHere ? '#ffd700' : domain.accentColor};">${domain.name}
            ${isHere ? '<span style="font-size:9px;color:#ffd700;margin-left:4px;">📍 当前位置</span>' : (canEnter ? '<span style="font-size:9px;color:#8bc34a;">✓ 当前可至</span>' : '')}
          </div>
          <div style="font-size:10px;color:var(--text-dim);">${domain.title}</div>
        </div>
      </div>
      
      <div style="font-size:11px;line-height:1.7;color:var(--text);margin-bottom:10px;">${domain.lore}</div>
      
      <div style="display:flex;gap:10px;flex-wrap:wrap;margin-bottom:10px;font-size:10px;">
        <span>⚔️ 危险度：<span style="color:${domain.danger === '低' ? '#8bc34a' : domain.danger === '中等' ? '#ffc107' : domain.danger === '高' ? '#ff5722' : '#f44336'};">${domain.danger}</span></span>
        <span>🌊 灵气等级：${'⭐'.repeat(Math.min(5, domain.qiLevel))} (${domain.qiLevel})</span>
        <span>👥 居民：${domain.population}</span>
        ${access && !canEnter ? '<span style="color:#e74c3c;">🔒 需修为≥' + getQiRealmNameForIndex(access.required - 1) + '</span>' : ''}
      </div>
      
      <div style="font-size:10px;color:var(--text-dim);margin-bottom:10px;">
        <span>📌 名胜：${domain.famous}</span>
      </div>
      
      ${_renderCosmosGameScenes(domain)}
      ${_renderSubRegions(domain)}
    </div>`;
  } else {
    // 默认展示世界总览
    html += `<div style="background:rgba(0,0,0,0.15);border-radius:10px;padding:14px;">
      <div style="font-size:14px;font-weight:bold;color:var(--accent);margin-bottom:8px;">🌌 玄黄大陆总纲</div>
      <div style="font-size:11px;line-height:1.7;color:var(--text);margin-bottom:10px;">${XUANHUANG_COSMOS.origin}</div>
      
      <div style="display:flex;gap:10px;flex-wrap:wrap;margin-bottom:8px;">
        <div style="font-size:9px;padding:6px 10px;background:rgba(255,255,255,0.04);border-radius:6px;">
          🏯 九大域 <span style="color:var(--accent);">${XUANHUANG_COSMOS.domains.length}</span>
        </div>
        <div style="font-size:9px;padding:6px 10px;background:rgba(255,255,255,0.04);border-radius:6px;">
          🌍 子区域 <span style="color:var(--accent);">${XUANHUANG_COSMOS.domains.reduce((a,d) => a + d.subRegions.length, 0)}</span>
        </div>
        <div style="font-size:9px;padding:6px 10px;background:rgba(255,255,255,0.04);border-radius:6px;">
          📜 纪元史 <span style="color:var(--accent);">${XUANHUANG_COSMOS.chronicles.length}</span> 件大事
        </div>
      </div>
      
      <div style="font-size:10px;color:var(--text-dim);line-height:1.6;">
        <div style="margin-bottom:4px;"><span style="color:var(--accent);">🌄</span> 点击上方九域卡片，探索每一域的详细设定。</div>
        <div>当前游戏场景「${getSceneData(G.currentScene)?.name || '未知'}」${(()=>{try{var cd=getSceneData(G.currentScene);if(cd&&cd.cosmosDomain){var dn=typeof COSMOS_DOMAIN_NAMES!=='undefined'?COSMOS_DOMAIN_NAMES[cd.cosmosDomain]:cd.cosmosDomain;var rn=cd.cosmosRegion&&typeof COSMOS_REGION_NAMES!=='undefined'?COSMOS_REGION_NAMES[cd.cosmosRegion]:'';return '位于'+dn+(rn?'·'+rn:'')+'。';}}catch(e){}return '。';})()}</div>
      </div>
    </div>`;
  }
  
  html += '</div>';
  return html;
}

function _renderCosmosGameScenes(domain) {
  // 查找此域中有哪些可进入的游戏场景
  if (typeof G === 'undefined' || !G.worldData || !G.worldData.layers) return '';
  var gameScenes = [];
  G.worldData.layers.forEach(function(l) {
    l.scenes.forEach(function(s) {
      if (s.cosmosDomain === domain.id) gameScenes.push(s);
    });
  });
  
  // 如果 cosmosDomain 匹配不到场景（数据结构没有九域全部对应），
  // 用 DOMAIN_ENTRY_SCENES 兜底，找传送入口场景
  if (gameScenes.length === 0 && typeof DOMAIN_ENTRY_SCENES !== 'undefined') {
    var entryId = DOMAIN_ENTRY_SCENES[domain.id];
    if (entryId) {
      G.worldData.layers.forEach(function(l) {
        l.scenes.forEach(function(s) {
          if (s.id === entryId) gameScenes.push(s);
        });
      });
    }
  }
  
  if (gameScenes.length === 0) return '';
  
  let html = '<div style="margin-bottom:8px;">';
  html += '<div style="font-size:11px;font-weight:bold;color:var(--accent);margin-bottom:4px;">🎮 游戏场景（点击前往）</div>';
  html += '<div style="display:flex;flex-wrap:wrap;gap:3px;">';
  gameScenes.forEach(s => {
    const isHere = G.currentScene === s.id;
    html += `<div onclick="${isHere ? '' : 'closeCosmosMap();if(typeof mapMove===\'function\')mapMove(\'' + s.id + '\')'}" 
      style="padding:4px 8px;border-radius:6px;font-size:9px;cursor:${isHere ? 'default' : 'pointer'};
        border:1px solid ${isHere ? 'var(--accent)' : 'rgba(255,255,255,0.08)'};
        background:${isHere ? 'var(--accent)22' : 'rgba(255,255,255,0.03)'};
        color:${isHere ? 'var(--accent)' : 'var(--text-dim)'};
        margin:2px;">
      ${isHere ? '📍' : ''}${s.name}
    </div>`;
  });
  html += '</div></div>';
  return html;
}

function _renderSubRegions(domain) {
  if (!domain.subRegions || domain.subRegions.length === 0) return '';
  
  let html = '<div style="margin-top:8px;">';
  html += '<div style="font-size:11px;font-weight:bold;color:var(--text-dim);margin-bottom:4px;">🗺️ 下辖州郡 (子区域)</div>';
  html += '<div style="display:flex;flex-direction:column;gap:4px;">';
  
  domain.subRegions.forEach(sr => {
    const typeIcons = { plain:'🌾', forest:'🌲', mountain:'🏔️', sea:'🌊', desert:'🏜️', 
      city:'🏯', valley:'🏞️', ruin:'🏛️', danger:'⚠️', island:'🏝️', river:'🌊', road:'🛤️', gate:'🚪' };
    const icon = typeIcons[sr.type] || '📍';
    html += `<div style="padding:6px 8px;background:rgba(255,255,255,0.03);border-radius:6px;font-size:10px;line-height:1.5;">
      <div style="font-weight:bold;color:var(--text);">${icon} ${sr.name} <span style="font-size:8px;color:${domain.accentColor};font-weight:normal;">灵气${sr.qiLevel}级</span></div>
      <div style="color:var(--text-dim);font-size:9px;">${sr.desc}</div>
      <div style="font-size:8px;color:var(--text-dim);margin-top:1px;">
        ${sr.features ? sr.features.map(function(f) {
          var _sceneMap = typeof SCENE_NAME_TO_ID !== 'undefined' ? SCENE_NAME_TO_ID : {};
          var _sid = _sceneMap[f];
          if (_sid && typeof mapMove === 'function') {
            return '<span onclick="closeCosmosMap();if(typeof mapMove===\'function\')mapMove(\'' + _sid + '\')" style="cursor:pointer;color:' + domain.accentColor + ';text-decoration:underline;text-decoration-style:dotted;text-underline-offset:2px;">' + f + ' 🗺️</span>';
          }
          return f;
        }).join(' · ') : ''}
      </div>
    </div>`;
  });
  
  html += '</div></div>';
  return html;
}

function _renderCosmosTimeline() {
  if (_cosmosActiveTab !== 'chronicles') return '';
  
  let html = '<div style="margin-top:12px;">';
  html += '<div style="font-size:11px;font-weight:bold;color:var(--accent);margin-bottom:6px;">📜 纪元大事记</div>';
  
  XUANHUANG_COSMOS.chronicles.forEach(c => {
    const isCurrent = c.year === 2026 && c.era === '灵潮纪元';
    html += `<div style="display:flex;gap:8px;padding:6px 8px;margin-bottom:3px;background:${isCurrent ? 'rgba(201,169,110,0.08)' : 'transparent'};border-radius:6px;font-size:10px;line-height:1.5;${isCurrent ? 'border-left:2px solid var(--accent);' : ''}">
      <span style="flex:0 0 100px;color:${isCurrent ? 'var(--accent)' : 'var(--text-dim)'};">${c.era} · ${c.year}年</span>
      <span style="color:var(--text);">${c.event}</span>
      ${isCurrent ? '<span style="color:var(--accent);font-size:8px;">← 现在</span>' : ''}
    </div>`;
  });
  
  html += '</div>';
  return html;
}

function _renderWonders() {
  if (_cosmosActiveTab !== 'wonders') return '';
  
  let html = '<div style="margin-top:12px;">';
  html += '<div style="font-size:11px;font-weight:bold;color:var(--accent);margin-bottom:6px;">✨ 天下九大奇观</div>';
  
  XUANHUANG_COSMOS.wonders.forEach(w => {
    const domain = XUANHUANG_COSMOS.domains.find(d => d.name === w.domain);
    html += `<div style="padding:8px 10px;margin-bottom:4px;background:rgba(255,255,255,0.03);border-radius:6px;font-size:10px;line-height:1.5;border-left:2px solid ${domain ? domain.accentColor : 'var(--text-dim)'};">`;
    html += `<div style="font-weight:bold;color:var(--text);">✨ ${w.name} <span style="font-weight:normal;color:${domain ? domain.accentColor : 'var(--text-dim)'};">· ${w.domain}</span></div>`;
    html += `<div style="color:var(--text-dim);margin-top:2px;">${w.desc}</div></div>`;
  });
  
  html += '</div>';
  return html;
}

// ==========================
// UI 事件处理
// ==========================
function showCosmosMap() {
  if (typeof showWorldMap === 'function') { showWorldMap(); return; }
  document.getElementById('cosmos-overlay').classList.remove('hidden');
  renderCosmosMap('cosmos-content');
  _cosmosActiveTab = 'overview';
  _cosmosSelectedDomain = null;
  renderCosmosMap('cosmos-content');
}

function closeCosmosMap() {
  if (typeof closeWorldMap === 'function') { closeWorldMap(); return; }
  document.getElementById('cosmos-overlay').classList.add('hidden');
}

function switchCosmosTab(tabId) {
  _cosmosActiveTab = tabId;
  renderCosmosMap('cosmos-content');
}

function selectCosmosDomain(domainId) {
  _cosmosSelectedDomain = (_cosmosSelectedDomain === domainId) ? null : domainId;
  _cosmosActiveTab = 'domains';
  renderCosmosMap('cosmos-content');
}

// 导出函数
// ── 域间旅行菜单 ──
function showDomainTravelMenu() {
  const p = G.player;
  const domainIds = ['donghuang','nanji','ximo','beiji','zhongzhou','donghai','tianyu','youyu','xuwu'];
  
  let html = '<div style="font-size:11px;margin-bottom:4px;color:var(--text-dim);">选择传送目标：</div>';
  html += '<div style="margin-bottom:8px;font-size:10px;color:var(--accent);padding:4px 8px;background:rgba(201,169,110,0.06);border-radius:6px;">💰 当前灵石：' + p.stones + '</div>';
  html += '<div style="display:flex;flex-wrap:wrap;gap:4px;">';
  
  domainIds.forEach(function(dId) {
    var info = getDomainData(dId);
    if (!info) return;
    var cost = typeof getDomainTravelCost === 'function' ? getDomainTravelCost(dId) : 0;
    var isHere = getSceneDomain(G.currentScene) && getSceneDomain(G.currentScene).id === dId;
    var canAfford = isHere || cost === 0 || p.stones >= cost;
    var name = info.name;
    var emoji = info.emoji;
    
    var bgColor = isHere ? 'var(--accent)22' : canAfford ? info.accentColor + '11' : 'rgba(80,80,80,0.08)';
    var bdColor = isHere ? 'var(--accent)' : canAfford ? info.accentColor + '66' : 'rgba(80,80,80,0.25)';
    var txtColor = isHere ? 'var(--accent)' : canAfford ? 'var(--text)' : 'rgba(255,255,255,0.3)';
    
    html += '<div ' + (isHere || !canAfford ? '' : 'onclick="closeEvent();if(typeof travelToDomain===\'function\')travelToDomain(\'' + dId + '\')" ');
    html += 'style="padding:8px 12px;border-radius:8px;cursor:' + (isHere ? 'default' : canAfford ? 'pointer' : 'not-allowed') + ';';
    html += 'border:1px solid ' + bdColor + ';';
    html += 'background:' + bgColor + ';';
    html += 'color:' + txtColor + ';';
    html += 'flex:1;min-width:95px;max-width:150px;text-align:center;">';
    html += '<div style="font-size:20px;margin-bottom:2px;">' + emoji + '</div>';
    html += '<div style="font-size:11px;">' + name + '</div>';
    if (isHere) html += '<div style="font-size:8px;color:var(--accent);margin-top:2px;">📍 此处</div>';
    else if (canAfford && cost > 0) html += '<div style="font-size:9px;color:#8bc34a;margin-top:2px;">' + cost + '灵石 ✓</div>';
    else if (cost === 0 && !isHere) html += '<div style="font-size:8px;color:var(--accent);margin-top:2px;">免费</div>';
    else html += '<div style="font-size:9px;color:#e74c3c;margin-top:2px;">灵石不足</div>';
    html += '</div>';
  });
  
  html += '</div>';
  html += '<div style="margin-top:10px;font-size:9px;color:var(--text-dim);text-align:center;line-height:1.5;">';
  html += '传送阵每次消耗 30 灵力。<br>距离越远、危险越高，票价越贵。';
  html += '</div>';
  showCustomModal('🚪 域间传送阵', html);
}

// 导出函数
if (typeof window !== 'undefined') {
  window.showCosmosMap = showCosmosMap;
  window.closeCosmosMap = closeCosmosMap;
  window.switchCosmosTab = switchCosmosTab;
  window.selectCosmosDomain = selectCosmosDomain;
  window.renderCosmosMap = renderCosmosMap;
  window.showDomainTravelMenu = showDomainTravelMenu;
}
