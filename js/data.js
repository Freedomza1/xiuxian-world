// === 唯我独仙 · 全量数据库 v13 (技能/物品/天命/NPC/宗门) ===

// ==========================
// 品级枚举
// 凡级 → 灵级 → 地级 → 天级 → 圣级 → 神级
// ==========================
const QUALITIES = ['凡级','灵级','地级','天级','圣级','神级'];
const QUALITY_COLORS = {
  '凡级':'#8a7a6a','灵级':'#6a9ec9','地级':'#d46a3a',
  '天级':'#c9a96e','圣级':'#e0c8a0','神级':'#f0d8c0'
};

// ==========================
// 功法系统 (全量 50+ 技能)
// ==========================
const SKILL_DB = [
  // ════════ 凡级 ════════
  { id:'basic_tuna', name:'基础吐纳法', quality:'凡级', type:'吐纳法', element:'无',
    desc:'最基础的灵气吐纳之法，修仙之始。',
    effects:{ cultivationSpeed:1.0, qiRegen:1 },
    masteryBonus:{ desc:'吐纳如呼吸，灵力自动运转', effect:{ cultivationSpeed:0.5 } },
    learn:{ realm:'练气一层', bodyRealm:0 } },
  { id:'yunjue', name:'云诀', quality:'凡级', type:'吐纳法', element:'水',
    desc:'观云卷云舒而悟出的吐纳法，中正平和。',
    effects:{ cultivationSpeed:1.2, qiRegen:2, exploreBonus:0.05 },
    masteryBonus:{ desc:'凌空虚渡，灵力永不枯竭', effect:{ qiRegen:10 } },
    learn:{ realm:'练气二层', bodyRealm:0 } },
  { id:'tuqi', name:'土息术', quality:'凡级', type:'吐纳法', element:'土',
    desc:'引大地之气入体，根基稳固。',
    effects:{ cultivationSpeed:1.15, defenseBonus:2, qiRegen:1 },
    learn:{ realm:'练气一层', bodyRealm:0, spiritRoot:['土'] } },
  { id:'jinqi', name:'金气诀', quality:'凡级', type:'吐纳法', element:'金',
    desc:'以金气淬炼经脉，锋锐内敛。',
    effects:{ cultivationSpeed:1.1, attackBonus:3 },
    learn:{ realm:'练气一层', bodyRealm:0, spiritRoot:['金'] } },
  { id:'huoyan_breath', name:'火云吐纳', quality:'凡级', type:'吐纳法', element:'火',
    desc:'引火气入丹田，气息炽热。',
    effects:{ cultivationSpeed:1.15, qiRegen:1, elementDamage:{ fire:0.05 } },
    learn:{ realm:'练气一层', bodyRealm:0, spiritRoot:['火'] } },
  { id:'swift_step', name:'疾风步', quality:'凡级', type:'身法', element:'无',
    desc:'步法轻盈，如风随行。',
    effects:{ exploreBonus:0.08, dodge:0.05, qiCost:3 },
    learn:{ realm:'练气一层' } },
  { id:'splitting_fist', name:'劈石拳', quality:'凡级', type:'攻伐术', element:'无',
    desc:'拳劲刚猛，可劈山石。',
    effects:{ attackBonus:5, critRate:0.03 },
    learn:{ realm:'练气一层' } },
  { id:'golden_bell', name:'金钟罩', quality:'凡级', type:'护体诀', element:'金',
    desc:'真气化钟，护体防身。',
    effects:{ defenseBonus:8, hpBonus:15 },
    learn:{ realm:'练气二层', spiritRoot:['金'] } },
  { id:'basic_attack', name:'基础拳法', quality:'凡级', type:'攻伐术', element:'无',
    desc:'最简单的拳脚功夫，但也是所有攻伐术的起点。',
    effects:{ attackBonus:3 },
    learn:{ realm:'练气一层' } },
  { id:'basic_shield', name:'基础护体', quality:'凡级', type:'护体诀', element:'无',
    desc:'以少量真气构筑最简单的护体真气。',
    effects:{ defenseBonus:3 },
    learn:{ realm:'练气一层' } },
  { id:'basic_step', name:'基础步法', quality:'凡级', type:'身法', element:'无',
    desc:'最基础的移动身法，虽不精妙但聊胜于无。',
    effects:{ dodge:0.02 },
    learn:{ realm:'练气一层' } },
  { id:'basic_heal', name:'基础疗伤', quality:'凡级', type:'疗伤法', element:'无',
    desc:'粗浅的疗伤之法，可缓解轻伤。',
    effects:{ hpRegen:2 },
    learn:{ realm:'练气一层' } },
  { id:'healing_breath', name:'养气诀', quality:'凡级', type:'疗伤法', element:'无',
    desc:'调息养气，温养经脉。',
    effects:{ hpRegen:3, qiRegen:2 },
    learn:{ realm:'练气一层' } },
  { id:'tiequan', name:'铁拳功', quality:'凡级', type:'炼体术', element:'金',
    desc:'日日以拳击石，淬炼筋骨。',
    effects:{ bodyCultSpeed:1.0, hpBonus:15, attackBonus:3 },
    learn:{ bodyRealm:'炼体一重' } },
  { id:'shiti', name:'石体诀', quality:'凡级', type:'炼体术', element:'土',
    desc:'引土气淬体，身如磐石。',
    effects:{ bodyCultSpeed:1.1, defenseBonus:5, hpBonus:20 },
    learn:{ bodyRealm:'炼体一重', spiritRoot:['土'] } },
  { id:'fallen_leaf', name:'落叶剑法', quality:'凡级', type:'攻伐术', element:'金',
    desc:'剑出如风，叶落无声。',
    effects:{ attackBonus:7, dodge:0.03 },
    learn:{ realm:'练气二层', spiritRoot:['金'] } },

  // ════════ 灵级 ════════
  { id:'houtu', name:'厚土诀', quality:'灵级', type:'吐纳法', element:'土',
    desc:'引大地之气淬炼己身，稳如磐石。',
    effects:{ cultivationSpeed:1.4, defenseBonus:8, hpBonus:30 },
    learn:{ realm:'练气三层', bodyRealm:0, spiritRoot:['土'] } },
  { id:'huoyan', name:'灼焰诀', quality:'灵级', type:'吐纳法', element:'火',
    desc:'以火灵根引动天地火气，霸道凌厉。',
    effects:{ cultivationSpeed:1.5, attackBonus:5, qiCost:15, elementDamage:{ fire:0.15 } },
    learn:{ realm:'练气三层', bodyRealm:0, spiritRoot:['火'] } },
  { id:'jinjue', name:'金锋诀', quality:'灵级', type:'吐纳法', element:'金',
    desc:'以金灵根凝聚锋锐之气，攻伐犀利。',
    effects:{ cultivationSpeed:1.3, attackBonus:10, critRate:0.05 },
    learn:{ realm:'练气三层', bodyRealm:0, spiritRoot:['金'] } },
  { id:'muye', name:'青木诀', quality:'灵级', type:'吐纳法', element:'木',
    desc:'汲取草木生机，生生不息。',
    effects:{ cultivationSpeed:1.25, qiRegen:4, hpRegen:2, exploreBonus:0.08 },
    learn:{ realm:'练气三层', bodyRealm:0, spiritRoot:['木'] } },
  { id:'shuixin', name:'水心诀', quality:'灵级', type:'吐纳法', element:'水',
    desc:'心如止水，气纳百川。',
    effects:{ cultivationSpeed:1.3, qiRegen:3, maxQiBonus:30 },
    learn:{ realm:'练气三层', bodyRealm:0, spiritRoot:['水'] } },
  { id:'blazing_sword', name:'烈焰斩', quality:'灵级', type:'攻伐术', element:'火',
    desc:'一刀斩出，烈焰焚天。',
    effects:{ attackBonus:15, elementDamage:{ fire:0.2 }, critRate:0.08 },
    learn:{ realm:'练气三层', spiritRoot:['火'] } },
  { id:'earth_shatter', name:'崩山掌', quality:'灵级', type:'攻伐术', element:'土',
    desc:'一掌拍出，力若千钧。',
    effects:{ attackBonus:12, defenseBonus:3, stun:0.1 },
    learn:{ realm:'练气四层', spiritRoot:['土'] } },
  { id:'earth_armor', name:'土甲术', quality:'灵级', type:'护体诀', element:'土',
    desc:'引土气凝甲，坚不可摧。',
    effects:{ defenseBonus:15, hpBonus:30, qiCost:5 },
    learn:{ realm:'练气三层', spiritRoot:['土'] } },
  { id:'mist_step', name:'雾影步', quality:'灵级', type:'身法', element:'水',
    desc:'身化雾影，真假难辨。',
    effects:{ dodge:0.1, exploreBonus:0.12, qiCost:5 },
    learn:{ realm:'练气三层', spiritRoot:['水'] } },
  { id:'green_mist', name:'青雾诀', quality:'灵级', type:'疗伤法', element:'木',
    desc:'化灵气为青雾，滋养伤势。',
    effects:{ hpRegen:8, hpBonus:20 },
    learn:{ realm:'练气三层', spiritRoot:['木'] } },
  { id:'yanjin', name:'炎金体', quality:'灵级', type:'炼体术', element:'火',
    desc:'以火锻金，体如熔铁。',
    effects:{ bodyCultSpeed:1.4, hpBonus:40, attackBonus:8, defenseBonus:5 },
    learn:{ bodyRealm:'炼体三重', spiritRoot:['火','金'] } },
  { id:'muteng', name:'木藤身', quality:'灵级', type:'炼体术', element:'木',
    desc:'身如古藤，柔韧难断。',
    effects:{ bodyCultSpeed:1.3, hpBonus:50, dodge:0.05, qiRegen:2 },
    learn:{ bodyRealm:'炼体三重', spiritRoot:['木'] } },

  // ════════ 地级 ════════
  { id:'sanmei', name:'三昧真火诀', quality:'地级', type:'吐纳法', element:'火',
    desc:'上古火修传承，引三昧真火焚尽万物。',
    effects:{ cultivationSpeed:2.0, attackBonus:15, elementDamage:{ fire:0.3 }, qiCost:20 },
    masteryBonus: { desc:"三昧真火，焚天煮海", effect:{ elementDamage:{ fire:0.5 } } },
    learn:{ realm:'练气五层', bodyRealm:0, spiritRoot:['火'] } },
  { id:'wuji_gong', name:'无极功', quality:'地级', type:'吐纳法', element:'无',
    desc:'无属性之极，包容万象。',
    effects:{ cultivationSpeed:2.2, cultivationBonus:0.5 },
        masteryBonus: { desc:"无极生太极，万法归宗", effect:{ maxQiBonus:60 } },
  learn:{ realm:'练气五层', bodyRealm:0 } },
  { id:'qinglian', name:'青莲诀', quality:'地级', type:'吐纳法', element:'木',
    desc:'化莲为基，一花一世界。',
    effects:{ cultivationSpeed:1.8, hpRegen:5, exploreBonus:0.15, special:'战斗时每回合恢复3%气血' },
    learn:{ realm:'练气五层', bodyRealm:0, spiritRoot:['木'] } },
  { id:'thunder_step', name:'雷音步', quality:'地级', type:'身法', element:'金',
    desc:'一步踏出，雷音滚滚。瞬息百丈。',
    effects:{ dodge:0.15, exploreBonus:0.18, attackBonus:5 },
    learn:{ realm:'练气五层', spiritRoot:['金'] } },
  { id:'shuiyue_jing', name:'水月镜', quality:'地级', type:'护体诀', element:'水',
    desc:'身若水月，镜花难伤。',
    effects:{ defenseBonus:20, hpBonus:50, dodge:0.08, qiRegen:4 },
    learn:{ realm:'练气五层', spiritRoot:['水'] } },
  { id:'chilong_body', name:'赤龙体', quality:'地级', type:'炼体术', element:'火',
    desc:'赤龙淬体，血肉如铸。',
    effects:{ bodyCultSpeed:1.7, hpBonus:80, attackBonus:15, defenseBonus:8 },
    learn:{ bodyRealm:'炼体五重', spiritRoot:['火'] } },

  // ════════ 天级 ════════
  { id:'tianlei_yin', name:'天雷引', quality:'天级', type:'攻伐术', element:'金',
    desc:'引九天雷霆，化为一剑。天地变色。',
    effects:{ attackBonus:30, critRate:0.15, elementDamage:{ thunder:0.4 } },
    learn:{ realm:'练气六层', spiritRoot:['金'] } },
  { id:'qiankun_jing', name:'乾坤经', quality:'天级', type:'吐纳法', element:'无',
    desc:'乾坤为炉，造化为工。修仙至典。',
    effects:{ cultivationSpeed:2.8, maxQiBonus:80, qiRegen:10 },
    learn:{ realm:'练气六层', bodyRealm:0 } },
  { id:'fulu_tiannv', name:'天女散花', quality:'天级', type:'攻伐术', element:'木',
    desc:'一花一叶皆可为剑，漫天飞花。',
    effects:{ attackBonus:25, dodge:0.1, special:'群攻：可同时攻击多个敌人' },
    learn:{ realm:'练气六层', spiritRoot:['木'] } },
  { id:'canglang_jian', name:'沧浪剑诀', quality:'天级', type:'攻伐术', element:'水',
    desc:'剑势如潮，一浪高过一浪，连绵不绝。',
    effects:{ attackBonus:25, critRate:0.12, special:'连击：有概率追加一次攻击' },
    learn:{ realm:'练气六层', spiritRoot:['水'] } },
  { id:'xuanwu_ji', name:'玄武甲', quality:'天级', type:'护体诀', element:'水',
    desc:'化玄武之气为甲，水火不侵。',
    effects:{ defenseBonus:35, hpBonus:100, hpRegen:8 },
    learn:{ realm:'练气六层', spiritRoot:['水'] } },
  { id:'bengtian_zhang', name:'崩天掌', quality:'天级', type:'攻伐术', element:'土',
    desc:'一掌崩天，势不可挡。',
    effects:{ attackBonus:35, stun:0.2, defenseBonus:5 },
    learn:{ realm:'练气六层', spiritRoot:['土'] } },

  // ════════ 圣级 ════════ (需筑基或奇遇/顿悟)
  { id:'taiyi_jue', name:'太一诀', quality:'圣级', type:'吐纳法', element:'无',
    desc:'太初之始，混沌一炁。万法归宗。',
    effects:{ cultivationSpeed:3.5, maxQiBonus:150, qiRegen:15, wisdomBonus:10 },
    learn:{ realm:'筑基一层', bodyRealm:0, special:'传承' } },
  { id:'fentian_yin', name:'焚天印', quality:'圣级', type:'攻伐术', element:'火',
    desc:'一印焚天，万物成灰。上古火修至宝。',
    effects:{ attackBonus:50, elementDamage:{ fire:0.6 }, critRate:0.2 },
    learn:{ realm:'筑基二层', spiritRoot:['火'], special:'传承' } },
  { id:'shenglong_jue', name:'升龙诀', quality:'圣级', type:'炼体术', element:'水',
    desc:'化龙之躯，肉身成圣。',
    effects:{ bodyCultSpeed:2.5, hpBonus:200, attackBonus:30, defenseBonus:20 },
    learn:{ bodyRealm:'筑基', special:'传承' } },
  { id:'jintong_yan', name:'金瞳术', quality:'圣级', type:'秘术', element:'金',
    desc:'开天金瞳，看破一切虚妄。',
    effects:{ exploreBonus:0.4, dodge:0.2, special:'看破隐藏秘境与机关' },
    learn:{ realm:'筑基一层', spiritRoot:['金'], special:'顿悟' } },
  { id:'wanmu_chunqiu', name:'万木春秋', quality:'圣级', type:'疗伤法', element:'木',
    desc:'一木一春秋，枯木逢春，白骨生肉。',
    effects:{ hpRegen:25, special:'战斗中可复活一次' },
    learn:{ realm:'筑基二层', spiritRoot:['木'], special:'传承' } },

  // ════════ 神级 ════════ (必须通过顿悟/自创/传承获得)
  { id:'hundun_jue', name:'混沌诀', quality:'神级', type:'吐纳法', element:'无',
    desc:'混沌初开，大道之源。修炼此功者，可纳万气为己用。',
    effects:{ cultivationSpeed:5.0, maxQiBonus:300, qiRegen:25, wisdomBonus:20, special:'无视灵根限制' },
    learn:{ realm:'筑基三层', special:'顿悟' } },
  { id:'zhuxian_jian', name:'诛仙剑气', quality:'神级', type:'攻伐术', element:'金',
    desc:'诛仙四剑之一，剑出则仙陨。',
    effects:{ attackBonus:80, critRate:0.3, elementDamage:{ thunder:0.8 }, special:'无视防御' },
    learn:{ realm:'筑基三层', spiritRoot:['金'], special:'传承' } },
  { id:'jiuzhuan_jin', name:'九转金丹术', quality:'神级', type:'秘术', element:'火',
    desc:'太上老君遗留丹术，九转成仙。',
    effects:{ cultivationSpeed:3.0, special:'可炼制九转金丹，服之立升一层境界' },
    learn:{ realm:'筑基二层', spiritRoot:['火'], special:'传承' } },
  { id:'tianxiang_wu', name:'天香舞', quality:'神级', type:'秘术', element:'木',
    desc:'九天玄女所传舞姿，翩若惊鸿。战斗中可魅惑敌方。',
    effects:{ dodge:0.25, special:'魅惑敌方，令其攻击落空概率30%' },
    learn:{ realm:'筑基二层', spiritRoot:['木'], special:'顿悟' } },
  { id:'wuxiang_shen', name:'无相神功', quality:'神级', type:'吐纳法', element:'无',
    desc:'无相无形，无我无道。修至大成，化身天地。',
    effects:{ cultivationSpeed:6.0, maxQiBonus:500, qiRegen:30, defenseBonus:30, attackBonus:30 },
    learn:{ realm:'筑基三层', special:'自创' } },
  { id:'shuangxiu_jue', name:'合欢诀', quality:'地级', type:'心法', element:'无',
    desc:'阴阳双修秘法，需与异性道侣共修。修炼时可大幅提升道侣双修收益，双方皆受益。',
    effects:{ dualCultivationBonus:2.5, moodRegen:3 },
    learn:{ realm:'练气三层', duoRequired:true } },
  // ── 冰封仙子·仙级功法 ──
  { id:'binghuang_jue', name:'冰凰涅槃诀', quality:'仙级', type:'心法', element:'水',
    desc:'万载寒冰涅槃而成的至高心法，由万载冰窟的百里冰仙子所传。修炼至大成可化身冰凰，超脱轮回。阴阳双修时效果翻倍。',
    effects:{ cultivationSpeed:8.0, maxQiBonus:500, qiRegen:40, wisdomBonus:15, dualCultivationBonus:3.0, special:'冰凰化身：每10回合自动释放一次极寒领域' },
    masteryBonus:{ desc:'冰凰觉醒：双修时额外提升修为获取100%', effect:{ dualCultivationBonus:3.0 } },
    learn:{ realm:'化神初阶', bodyRealm:'玉髓境', special:'冰封仙子传承' } },

  // ════════ 阵道 ════════ (地图掉落)
  { id:'juling_zhen', name:'聚灵阵诀', quality:'凡级', type:'阵道', element:'无',
    desc:'布下聚灵之阵，可小幅提升修炼速度。',
    effects:{ cultivationSpeed:0.8, qiRegen:2 },
    learn:{ realm:'练气一层' } },
  { id:'bajing_tu', name:'八卦阵图', quality:'灵级', type:'阵道', element:'土',
    desc:'八卦方位尽在掌握，布阵可挡千军。',
    effects:{ defenseBonus:10, elementResist:{ all:0.05 } },
    learn:{ realm:'练气三层' } },
  { id:'zhoutian_zhen', name:'周天星斗阵', quality:'地级', type:'阵道', element:'无',
    desc:'引周天星斗之力入阵，攻守兼备。',
    effects:{ attackBonus:12, defenseBonus:12, maxQiBonus:40 },
    learn:{ realm:'练气六层' } },
  { id:'zhuxian_zhen', name:'诛仙剑阵', quality:'圣级', type:'阵道', element:'金',
    desc:'上古诛仙剑阵的残卷，布下可斩仙诛魔。',
    effects:{ attackBonus:35, critRate:0.12, special:'阵法反伤：受击时20%概率反弹50%伤害' },
    learn:{ realm:'筑基三层', spiritRoot:['金'] } },

  // ════════ 丹道 ════════ (地图掉落)
  { id:'lianqiu_shu', name:'炼丹术', quality:'凡级', type:'丹道', element:'火',
    desc:'最基础的炼丹法门，可炼粗浅丹药。',
    effects:{ pillQuality:0.1, cultivationSpeed:0.3 },
    learn:{ realm:'练气一层', spiritRoot:['火'] } },
  { id:'baicao_danjue', name:'百草炼丹诀', quality:'灵级', type:'丹道', element:'木',
    desc:'遍识百草，以草木精华炼丹。',
    effects:{ pillQuality:0.25, qiRegen:3, special:'炼丹成功率+10%' },
    learn:{ realm:'练气三层', spiritRoot:['木'] } },
  { id:'jiuzhuan_danjue', name:'九转炼丹诀', quality:'地级', type:'丹道', element:'火',
    desc:'九转回环，丹药品质倍增。',
    effects:{ pillQuality:0.5, cultivationSpeed:1.2, special:'可炼九转金丹' },
    learn:{ realm:'练气六层', spiritRoot:['火'] } },
  { id:'taiqing_danjing', name:'太清丹经', quality:'天级', type:'丹道', element:'火',
    desc:'太清仙人所著的丹道总纲。',
    effects:{ pillQuality:0.8, maxQiBonus:50, special:'丹药效果+20%' },
    learn:{ realm:'筑基一层', spiritRoot:['火'] } },
  { id:'shennong_dandian', name:'神农丹典', quality:'圣级', type:'丹道', element:'木',
    desc:'神农尝百草而著的丹道圣典，可炼生死人肉白骨的圣药。',
    effects:{ pillQuality:1.2, hpRegen:15, special:'炼制丹药品质提升一阶' },
    learn:{ realm:'筑基二层', spiritRoot:['木'] } },

  // ════════ 心法（地图可掉落版）════════
  { id:'jingxin_jue', name:'静心诀', quality:'灵级', type:'心法', element:'无',
    desc:'清心寡欲，心静自然凉。平复心境，悟性微增。',
    effects:{ wisdomBonus:3, moodRegen:1.5 },
    learn:{ realm:'练气二层' } },
  { id:'zifu_xinjing', name:'紫府心经', quality:'天级', type:'心法', element:'无',
    desc:'修炼紫府识海的无上心法，神识过人。',
    effects:{ wisdomBonus:10, maxQiBonus:60, qiRegen:8 },
    learn:{ realm:'筑基一层' } },
  { id:'dayan_xinjing', name:'大衍心经', quality:'圣级', type:'心法', element:'无',
    desc:'大衍之数五十，其用四十有九。心演万物，洞悉天机。',
    effects:{ wisdomBonus:15, cultivationSpeed:2.0, special:'天机推演：突破成功率+10%' },
    learn:{ realm:'筑基二层' } },

  // ════════ 秘术（地图可掉落版）════════
  { id:'yujian_shu', name:'御剑术', quality:'地级', type:'秘术', element:'金',
    desc:'以神御剑，千里取人首级。',
    effects:{ attackBonus:15, special:'攻击时20%概率追加一次御剑攻击' },
    learn:{ realm:'练气五层', spiritRoot:['金'] } },
  { id:'suodi_chengcun', name:'缩地成寸', quality:'天级', type:'秘术', element:'土',
    desc:'缩千里为寸步，来去自如。',
    effects:{ dodge:0.15, exploreBonus:0.25 },
    learn:{ realm:'筑基一层', spiritRoot:['土'] } },
  { id:'tiangang_sanshiliu', name:'天罡三十六变', quality:'圣级', type:'秘术', element:'无',
    desc:'天罡三十六般变化，神通广大。',
    effects:{ dodge:0.2, critRate:0.1, exploreBonus:0.3, special:'战斗中可变形躲避致命一击' },
    learn:{ realm:'筑基二层' } },

  // ═══════ ❄️ 冰阁专属功法（第二纪元·藏经阁兑换，散修不可得） ═══════
  // 🔧 2026-08-04：圣级品质，带 sectOnly 标记。
  //    只有冰阁弟子能在藏经阁用门派贡献兑换；散修永远拿不到。
  { id:'bingfeng_jianjue', name:'冰风剑诀', quality:'圣级', type:'攻伐术', element:'水',
    desc:'冰阁镇派剑法。剑出如冰风，万里寒霜。江湖散修闻所未闻。',
    effects:{ attackBonus:45, critRate:0.18, elementDamage:{ ice:0.5 }, special:'冰封：攻击时有20%概率冰冻敌人一回合' },
    learn:{ realm:'练气七层', spiritRoot:['水'], sectOnly:true, sectTolerant:true } },
  { id:'xuanshuang_zhenjue', name:'玄霜真诀', quality:'圣级', type:'吐纳法', element:'水',
    desc:'冰阁祖师观玄霜悟道。吐纳之间，寒气入髓，修炼事半功倍。',
    effects:{ cultivationSpeed:3.2, maxQiBonus:150, qiRegen:15, special:'冰系功法熟练度+30%' },
    learn:{ realm:'练气七层', sectOnly:true, sectTolerant:true } },
  { id:'danding_miaojue', name:'丹鼎妙诀', quality:'圣级', type:'丹道', element:'火',
    desc:'冰阁丹脉不传之秘。鼎中日月，丹成乾坤。炼丹成功率与品质大幅提升。',
    effects:{ alchemyBonus:0.35, wisdomBonus:8, special:'炼丹时可触发「妙手丹心」，丹药品质+1阶' },
    learn:{ realm:'练气六层', spiritRoot:['火'], sectOnly:true, sectTolerant:true } },
  { id:'fuwen_tianxiu', name:'符文天修', quality:'圣级', type:'阵道', element:'金',
    desc:'冰阁符脉秘典。以天为符，以地为阵，一笔一划皆含天地至理。',
    effects:{ arrayBonus:0.35, attackBonus:15, special:'布阵时防御+30%' },
    learn:{ realm:'练气六层', spiritRoot:['金'], sectOnly:true, sectTolerant:true } },
  { id:'hanpo_lianji', name:'寒魄炼体', quality:'圣级', type:'炼体术', element:'水',
    desc:'冰阁体脉镇门绝学。以极寒淬体，肉身坚逾金石。',
    effects:{ hpBonus:300, defenseBonus:30, bodyCultivationBonus:0.3, special:'受到攻击时反弹15%伤害' },
    learn:{ realm:'练气七层', spiritRoot:['水'], sectOnly:true, sectTolerant:true } },
];

// ==========================
// 物品系统 (30+ 物品)
// ==========================
const ITEM_DB = [
  // ── 灵草 ──
  { id:'hgc_grass',  category:'材料',name:'清灵草', type:'灵草', desc:'常见灵草，蕴含微弱灵气。', value:3, use:{ qi:15 } },
  { id:'baihe_lily',  category:'材料',name:'百年灵芝', type:'灵草', desc:'百年灵药，可大幅恢复气血。', value:20, use:{ hp:60 } },
  { id:'qiannian_lingzhi',  category:'材料',name:'千年灵芝', type:'灵草', desc:'千年灵药，起死回生之效。', value:80, use:{ hp:200, qi:50 } },
  { id:'lingquan_shui',  category:'材料',name:'灵泉水', type:'灵草', desc:'蕴含灵气的泉水。', value:15, use:{ qi:25 } },
  { id:'du_zhang_cao',  category:'材料',name:'毒瘴草', type:'灵草', desc:'毒瘴沼泽特有灵草，可解瘴毒亦可入药。', value:20 },
  { id:'yinlin_yu',  category:'材料',name:'银鳞鱼', type:'材料', desc:'碧波湖中蕴含灵气的银鳞鱼，味美可口。', value:8, use:{ qi:10 } },
  { id:'xuantie_jingcui',  category:'材料',name:'玄铁精粹', type:'材料', desc:'玄铁矿的精华，炼制法器的上品材料。', value:120 },
  { id:'kuang_shi',       category:'材料',name:'铁矿',     type:'材料', desc:'常见的铁矿石，可锻粗坯，也可卖钱。', value:8 },
  { id:'jingtie_kuang',   category:'材料',name:'精铁矿',   type:'材料', desc:'纯度较高的铁矿石，锻器佳品。', value:35 },
  { id:'xuelian',  category:'材料',name:'雪莲子', type:'灵草', desc:'天山雪莲的莲子，凝神静气。', value:45, use:{ qi:40, mood:10 } },
  { id:'huojing_cao',  category:'材料',name:'火精草', type:'灵草', desc:'火属性灵草，生于火山口。', value:35, use:{ qi:30 }, equipEffect:{ elementDamage:{ fire:0.05 } } },

  // ── 🍀 属性灵草（可永久提升气运/悟性/根骨）──
  { id:'yunqi_cao',    category:'材料',name:'云气草',   type:'灵草', desc:'采九天云雾之气凝结的奇草，氤氲如烟。服之可增气运。',             value:100, rarity:2, herbEffect:{ luck:3 } },
  { id:'xiangyun_cao', category:'材料',name:'祥云草',   type:'灵草', desc:'形如祥云的灵草，紫光流转。气运提升效果更佳。',                     value:250, rarity:3, herbEffect:{ luck:5 } },
  { id:'mingyun_hua',  category:'材料',name:'命运花',   type:'灵草', desc:'传说能在冥冥中扭转命数的奇花，七瓣异色。',                          value:600, rarity:4, herbEffect:{ luck:8 } },
  { id:'wudao_ye',     category:'材料',name:'悟道叶',   type:'灵草', desc:'通体透彻如琉璃的古树之叶，叶脉中似有大道符文流转。',               value:180, rarity:2, herbEffect:{ wisdom:4 } },
  { id:'tianxin_lian', category:'材料',name:'天心莲',   type:'灵草', desc:'生于天瀑之下的七瓣玉莲，每一瓣都蕴藏一丝天道真意。',                  value:300, rarity:3, herbEffect:{ wisdom:6 } },
  { id:'shenji_cao',   category:'材料',name:'神机草',   type:'灵草', desc:'传说仙人弈棋时落下的棋子所化，蕴含先天演算之理。',                     value:500, rarity:4, herbEffect:{ wisdom:10 } },
  { id:'tiegu_cao',    category:'材料',name:'铁骨草',   type:'灵草', desc:'如铁似石的墨绿色灵草，根茎坚韧如精铁。服之淬炼筋骨。',                value:100, rarity:2, herbEffect:{ bone:3 } },
  { id:'longgu_zhu',   category:'材料',name:'龙骨竹',   type:'灵草', desc:'形如龙骨盘绕的灵竹，竹身密布金纹。宛如真龙骨力入体。',                value:300, rarity:3, herbEffect:{ bone:6 } },
  { id:'shengu_cao',   category:'材料',name:'神骨草',   type:'灵草', desc:'万年不枯的神草，茎中流淌着金色的骨髓液，服之骨骼如玉。',               value:600, rarity:4, herbEffect:{ bone:10 } },
  { id:'tongyuan_cao',  category:'材料',name:'同源草',   type:'灵草', desc:'三株共生一体的奇异灵草，三色交织。可同时滋养气运、悟性与根骨。',     value:400, rarity:3, herbEffect:{ luck:2, wisdom:2, bone:2 } },
  { id:'sanpin_lian',  category:'材料',name:'三品莲',   type:'灵草', desc:'一莲三花的旷世奇珍，三花各蕴气运、悟性、根骨之道韵。',                value:1000, rarity:5, herbEffect:{ luck:5, wisdom:5, bone:5 } },

  // ── 丹药 ──
  { id:'huiqi_dan',  category:'丹药',name:'回气丹', type:'丹药', desc:'恢复50点灵力。', value:30, use:{ qi:50 } },
  { id:'zhixue_san',  category:'丹药',name:'止血散', type:'丹药', desc:'恢复40点气血。', value:20, use:{ hp:40 } },
  { id:'juli_dan',  category:'丹药',name:'聚气丹', type:'丹药', desc:'修炼时服用，大幅提升灵气吸收。', value:60, use:{ cultivationPoints:150 } },
  { id:'huiti_dan',  category:'丹药',name:'回体丹', type:'丹药', desc:'恢复体魄，炼体专用。', value:25, use:{ hp:60 } },
  { id:'podi_dan',  category:'丹药',name:'破壁丹', type:'丹药', desc:'突破境界时服用，提升突破成功率。', value:100, use:{ breakChance:0.15 } },
  { id:'poqi_dan',  category:'丹药',name:'破气丹', type:'丹药', desc:'炼气突破专用，疏通经脉瓶颈。练气三层以上必备。', value:60, breakItem:true },
  { id:'duanti_dan',  category:'丹药',name:'锻体丹', type:'丹药', desc:'炼体突破专用，淬炼筋骨。炼体三重以上必备。', value:50, breakItem:true },
  // ── 高境界突破丹药 ──
  { id:'zhuji_dan',  category:'丹药',name:'筑基丹', type:'丹药', desc:'筑基境突破专用，固本培元。筑基必备。', value:200, breakItem:true, effects:{breakthrough:0.1} },
  { id:'jindan_dan',  category:'丹药',name:'金丹丹', type:'丹药', desc:'金丹境突破专用，凝聚金丹。', value:500, breakItem:true, effects:{breakthrough:0.15} },
  { id:'yuanying_dan',  category:'丹药',name:'元婴丹', type:'丹药', desc:'元婴境突破专用，碎丹成婴。', value:1500, breakItem:true, effects:{breakthrough:0.18} },
  { id:'huashen_dan',  category:'丹药',name:'化神丹', type:'丹药', desc:'化神境突破专用，元神蜕变。', value:5000, breakItem:true, effects:{breakthrough:0.2} },
  { id:'dacheng_dan',  category:'丹药',name:'大乘丹', type:'丹药', desc:'大乘境专用，超凡入圣。', value:15000, breakItem:true, effects:{breakthrough:0.22} },
  { id:'dujie_dan',  category:'丹药',name:'渡劫丹', type:'丹药', desc:'渡劫飞升专用，抵御天雷。', value:50000, breakItem:true, effects:{breakthrough:0.25} },
  // ── 炼体高境界丹药 ──
  { id:'tongpi_dan',  category:'丹药',name:'铜皮丹', type:'丹药', desc:'铜皮境突破必备，炼皮如铁。', value:300, breakItem:true },
  { id:'tiegu_dan',  category:'丹药',name:'铁骨丹', type:'丹药', desc:'铁骨境突破必备，炼骨如钢。', value:500, breakItem:true },
  { id:'yinxiue_dan',  category:'丹药',name:'银血丹', type:'丹药', desc:'银血境突破必备，换血如汞。', value:800, breakItem:true },
  { id:'jinshen_dan',  category:'丹药',name:'金身丹', type:'丹药', desc:'金身境突破必备，塑身如金。', value:1500, breakItem:true },
  { id:'yusui_dan',  category:'丹药',name:'玉髓丹', type:'丹药', desc:'玉髓境突破必备，炼骨如玉。', value:3000, breakItem:true },
  { id:'bumie_dan',  category:'丹药',name:'不灭丹', type:'丹药', desc:'不灭体突破必备，肉身不灭。', value:6000, breakItem:true },
  { id:'niepan_dan',  category:'丹药',name:'涅槃丹', type:'丹药', desc:'涅槃境突破必备，浴火重生。', value:12000, breakItem:true },
  { id:'hundun_dan',  category:'丹药',name:'混沌丹', type:'丹药', desc:'混沌体突破必备，肉身即成大道。', value:30000, breakItem:true },
  // ── 混沌之后 · 六种炼体道丹 ──
  { id:'daoshen_dan',  category:'丹药',name:'道身丹', type:'丹药', desc:'道身境突破必备，肉身烙印大道纹理。', value:60000, breakItem:true },
  { id:'shengti_dan',  category:'丹药',name:'圣体丹', type:'丹药', desc:'圣体境突破必备，身蕴圣光万法不侵。', value:120000, breakItem:true },
  { id:'shenmo_dan',  category:'丹药',name:'神魔丹', type:'丹药', desc:'神魔体突破必备，一念神魔肉身化相。', value:250000, breakItem:true },
  { id:'buxiu_dan',  category:'丹药',name:'不朽丹', type:'丹药', desc:'不朽体突破必备，肉身不腐断肢自生。', value:500000, breakItem:true },
  { id:'kaitian_dan',  category:'丹药',name:'开天丹', type:'丹药', desc:'开天体突破必备，一拳可裂虚空。', value:1000000, breakItem:true },
  { id:'hundao_dan',  category:'丹药',name:'混道丹', type:'丹药', desc:'鸿蒙道体突破必备，肉身即道与道同存。', value:2000000, breakItem:true },

  // ── 试炼塔专属 ──
  { id:'lianqi_jinghua',  category:'材料',name:'炼器精华', type:'材料', desc:'试炼塔产出的灵物精华，可用于炼器或高价出售。', value:150 },

  // ── 法器 ──
  { id:'juli_fu',  category:'装备',name:'聚灵符', type:'法器', desc:'修炼效率+20%。', value:50, equipEffect:{ cultivationSpeed:0.2 } },
  { id:'yanshou_fu',  category:'装备',name:'延寿符', type:'法器', desc:'延寿20年。', value:100, equipEffect:{ maxAge:20 } },
  { id:'tiexiu_jian',  category:'装备',name:'锈铁剑', type:'法器', desc:'一把生锈的铁剑，聊胜于无。', value:10, equipEffect:{ attackBonus:5 } },
  { id:'cuzhi_bingqi',  category:'装备',name:'粗制兵器', type:'法器', desc:'粗制滥造的兵器。', value:8, equipEffect:{ attackBonus:3 } },
  { id:'qingfeng_jian',  category:'装备',name:'清风剑', type:'法器', desc:'轻灵锋利，削铁如泥。', value:80, equipEffect:{ attackBonus:15, dodge:0.03 } },
  { id:'xuanhu_fu',  category:'装备',name:'玄武符', type:'法器', desc:'玄武之气护体。', value:90, equipEffect:{ defenseBonus:15 } },
  { id:'lianyu_pei',  category:'装备',name:'炼玉佩', type:'法器', desc:'温润玉石，静心养气。', value:60, equipEffect:{ qiRegen:3, wisdomBonus:5 } },

  // ── 🗡️ 武器 ════════
  { id:'tiegu_dao',  category:'装备',name:'铁骨刀', type:'法器', desc:'精铁百锻的厚背砍刀，势大力沉。', value:35, equipEffect:{ attackBonus:8 } },
  { id:'hanbing_jian',  category:'装备',name:'寒冰剑', type:'法器', desc:'以寒铁铸就的长剑，寒气逼人，削铁如泥。', value:120, equipEffect:{ attackBonus:20, elementDamage:{ ice:0.08 } } },
  { id:'liehuo_dao',  category:'装备',name:'烈火刀', type:'法器', desc:'刀身常年淬炼于地火之中，烈焰腾腾。', value:110, equipEffect:{ attackBonus:18, elementDamage:{ fire:0.08 } } },
  { id:'zhanlong_jian',  category:'装备',name:'斩龙剑', type:'法器', desc:'相传为屠龙者留下的利器，剑身隐隐有龙吟之声。', value:250, equipEffect:{ attackBonus:35, critRate:0.05 } },
  { id:'fumo_zhang',  category:'装备',name:'伏魔杖', type:'法器', desc:'佛门降魔法器，杖身刻满梵文经文。', value:160, equipEffect:{ attackBonus:22, defenseBonus:10 } },
  { id:'tianji_gong',  category:'装备',name:'天机弓', type:'法器', desc:'以天机竹为弓臂，千年蛛丝为弦的宝弓。', value:200, equipEffect:{ attackBonus:25, dodge:0.05 } },
  { id:'youming_jian',  category:'装备',name:'幽冥剑', type:'法器', desc:'取自幽冥之地的阴铁铸造，漆黑如墨，摄人心魄。', value:300, equipEffect:{ attackBonus:32, qiDrain:0.05 } },
  { id:'honglian_jian',  category:'装备',name:'红莲剑', type:'法器', desc:'剑身绽放如火红莲，一剑出而百花开。', value:500, equipEffect:{ attackBonus:45, critRate:0.08, elementDamage:{ fire:0.12 } } },
  { id:'liuguang_jian',  category:'装备',name:'流光剑', type:'法器', desc:'剑刃薄如蝉翼，剑出如流光掠影。', value:800, equipEffect:{ attackBonus:55, dodge:0.08, critRate:0.06 } },
  { id:'xianjin_bingqi',  category:'装备',name:'玄金兵器', type:'法器', desc:'以玄铁精英锻造的利器，锋芒毕露。', value:150, equipEffect:{ attackBonus:18 } },

  // ── 🛡️ 护甲 ════════
  { id:'shoupi_kai',  category:'装备',name:'兽皮甲', type:'法器', desc:'以妖兽厚皮鞣制的粗糙甲胄。', value:15, equipEffect:{ defenseBonus:5 } },
  { id:'tiejia',  category:'装备',name:'铁甲', type:'法器', desc:'普通铁片编缀而成的甲胄。', value:40, equipEffect:{ defenseBonus:10 } },
  { id:'xuantie_kai',  category:'装备',name:'玄铁甲', type:'法器', desc:'以玄铁精英锻造的重甲，坚不可摧。', value:180, equipEffect:{ defenseBonus:25, hpBonus:20 } },
  { id:'huoyuan_jia',  category:'装备',name:'火元甲', type:'法器', desc:'火元石淬炼的战甲，灼热护体。', value:130, equipEffect:{ defenseBonus:18, elementResist:{ fire:0.15 } } },
  { id:'bingpo_kai',  category:'装备',name:'冰魄铠', type:'法器', desc:'万年冰魄铸造的铠甲，寒气护体。', value:140, equipEffect:{ defenseBonus:20, elementResist:{ ice:0.15 } } },
  { id:'jinliu_jia',  category:'装备',name:'金缕甲', type:'法器', desc:'以金丝银线编成的软甲，轻便而坚韧。', value:220, equipEffect:{ defenseBonus:28, dodge:0.03 } },
  { id:'tiancan_pao',  category:'装备',name:'天蚕袍', type:'法器', desc:'千年天蚕丝织就的法袍，水火不侵。', value:350, equipEffect:{ defenseBonus:30, qiRegen:5, maxQiBonus:30 } },
  { id:'longlin_kai',  category:'装备',name:'龙鳞甲', type:'法器', desc:'以真龙鳞片编缀的神甲，万法不侵。', value:600, equipEffect:{ defenseBonus:45, hpBonus:100, elementResist:{ all:0.2 } } },
  { id:'xuanwu_jia',  category:'装备',name:'玄武甲', type:'法器', desc:'玄武遗甲，防御无双。', value:450, equipEffect:{ defenseBonus:40, hpBonus:50 } },
  { id:'diuzhi_huan',  category:'装备',name:'兜鍪', type:'法器', desc:'铜铁锻造成的简易头盔。', value:10, equipEffect:{ defenseBonus:2 } },

  // ── 💍 饰品 ════════
  { id:'yaoyu_pei',  category:'装备',name:'瑶玉佩', type:'法器', desc:'温润如脂的玉佩，佩戴养神养气。', value:80, equipEffect:{ qiRegen:5, mood:2 } },
  { id:'huiling_jie',  category:'装备',name:'汇灵戒', type:'法器', desc:'能自动汇聚天地灵气的戒指。', value:100, equipEffect:{ cultivationSpeed:0.15 } },
  { id:'nianyu_huan',  category:'装备',name:'念玉环', type:'法器', desc:'清心宁神的玉环，能令人静心参悟。', value:70, equipEffect:{ wisdomBonus:8 } },
  { id:'baoming_pei',  category:'装备',name:'保命佩', type:'法器', desc:'危急时刻自动触发护盾。', value:150, equipEffect:{ hpBonus:30, defenseBonus:5 } },
  { id:'tianji_ling',  category:'装备',name:'天机铃', type:'法器', desc:'蕴含天机推演之力的铜铃，可提升运势。', value:200, equipEffect:{ luckBonus:0.08 } },
  { id:'xianlu_jie',  category:'装备',name:'仙露戒', type:'法器', desc:'戒中藏有甘露玉液，每刻自行化生灵露滋养身体。', value:250, equipEffect:{ qiRegen:8, hpRegen:3 } },
  { id:'shennong_pei',  category:'装备',name:'神农佩', type:'法器', desc:'神农氏遗落人间的玉佩，蕴含草木生机。', value:400, equipEffect:{ hpBonus:60, qiRegen:6, healingBonus:0.15 } },

  // ── 👑 头饰 ════════
  { id:'yunwen_guan',  category:'装备',name:'云纹冠', type:'法器', desc:'以云纹玉雕刻的发冠，清灵飘逸。', value:30, equipEffect:{ maxQiBonus:15 } },
  { id:'ziyang_guan',  category:'装备',name:'紫阳冠', type:'法器', desc:'紫阳木雕成的发冠，佩戴如沐朝阳。', value:80, equipEffect:{ qiRegen:4, cultivationSpeed:0.1 } },
  { id:'daode_guan',  category:'装备',name:'道德冠', type:'法器', desc:'刻有道德真言的发冠，令人道心稳固。', value:120, equipEffect:{ wisdomBonus:10, qiRegen:3 } },
  { id:'shengjiao_mian',  category:'装备',name:'圣角冕', type:'法器', desc:'上古圣兽之角打磨的冕冠，威仪天成。', value:300, equipEffect:{ attackBonus:15, defenseBonus:15, maxQiBonus:50 } },
  { id:'xianhua_zan',  category:'装备',name:'仙花簪', type:'法器', desc:'以千年玉蕊花枝为簪，簪头缀有一颗灵露珠。', value:60, equipEffect:{ qiRegen:3, mood:2 } },
  { id:'faquan_jin',  category:'装备',name:'法冠巾', type:'法器', desc:'修仙者常佩的布质法冠，简约便于行动。', value:20, equipEffect:{ defenseBonus:1, qiRegen:1 } },  // ── 材料 ──
  { id:'shougu',  category:'材料',name:'兽骨', type:'材料', desc:'妖兽的骨骼，可用于炼器。', value:5, junk:1 },
  { id:'shepi',  category:'材料',name:'蛇胆', type:'材料', desc:'青木蛇的胆，可入药。', value:8, junk:1 },
  { id:'shoupi',  category:'材料',name:'兽皮', type:'材料', desc:'妖兽的皮毛，可制作护甲。', value:6, junk:1 },
  { id:'lingzu_cuijian',  category:'材料',name:'魂晶碎片', type:'材料', desc:'幽魂消散后留下的结晶。', value:10, junk:1 },
  { id:'gufen',  category:'材料',name:'骨粉', type:'材料', desc:'骷髅磨成的粉末。', value:3, junk:1 },
  { id:'zhusi',  category:'材料',name:'蛛丝', type:'材料', desc:'阴煞蛛吐出的丝。', value:12, junk:1 },
  { id:'dunang',  category:'材料',name:'毒囊', type:'材料', desc:'蕴含剧毒，可淬兵器。', value:8, junk:1 },
  { id:'xixin',  category:'材料',name:'石心', type:'材料', desc:'石傀儡的核心。', value:25, junk:1 },
  { id:'yuangi_jiejing',  category:'材料',name:'怨气结晶', type:'材料', desc:'怨灵留下的结晶。', value:15, junk:1 },
  { id:'xixi_linpian',  category:'材料',name:'蜥蜴鳞片', type:'材料', desc:'地下巨蜥的鳞片。', value:18, junk:1 },
  { id:'bianfu_yimo',  category:'材料',name:'蝙蝠翼膜', type:'材料', desc:'吸血蝙蝠的翼膜。', value:7, junk:1 },
  { id:'lingmu',  category:'材料',name:'灵木枝', type:'材料', desc:'百年灵木的枝干。', value:12, junk:1 },

  // ── 杂物 ──
  { id:'lianqi_xinde',  category:'杂物',name:'炼气心得', type:'杂物', desc:'前辈留下的修炼心得，可增加修为。', value:40, use:{ cultivationPoints:100 } },
  { id:'tili_xinde',  category:'杂物',name:'炼体心得', type:'杂物', desc:'体修前辈的炼体笔记。', value:35, use:{ bodyCultivationPoints:80 } },
  { id:'diyu_tuji',  category:'杂物',name:'地域图志', type:'杂物', desc:'记载了东荒域的地图与隐秘。', value:20, use:{ exploreBonus:0.1 } },

  // ── 稀有材料（精英/BOSS掉落） ──
  { id:'longxue', name:'龙血晶', type:'材料', category:'材料', desc:'真龙之血凝结的晶石，蕴含惊天能量。', value:800, rarity:5 },
  { id:'fenghuang_yu', name:'凤凰羽', type:'材料', category:'材料', desc:'凤凰涅槃留下的神羽，可炼化无尽生机。', value:1000, rarity:5 },
  { id:'xuanyuan_ling', name:'玄元灵髓', type:'材料', category:'材料', desc:'天地初始的灵气精粹，万法之源。', value:600, rarity:4 },
  { id:'pixiu_yaogu', name:'貔貅腰骨', type:'材料', category:'材料', desc:'上古异兽貔貅遗骨，蕴含吞噬之力。', value:500, rarity:4 },
  { id:'qilin_jiao', name:'麒麟角粉', type:'材料', category:'材料', desc:'麒麟角的粉末，可淬炼金丹。', value:400, rarity:3 },
  { id:'tianjie_shenmu', name:'天劫神木', type:'材料', category:'材料', desc:'经天雷淬炼不毁的神木。', value:350, rarity:3 },
  { id:'shenlong_lin', name:'神龙鳞', type:'材料', category:'材料', desc:'神龙蜕下的鳞片，坚不可摧。', value:300, rarity:3 },
  { id:'jinyuan_jing', name:'金元晶', type:'材料', category:'材料', desc:'纯金元气凝聚的晶石，炼器至宝。', value:250, rarity:2 },
  { id:'shuixin_zhu', name:'水心珠', type:'材料', category:'材料', desc:'万载寒潭深处的水灵结晶。', value:200, rarity:2 },
  { id:'huoyuan_shi', name:'火元石', type:'材料', category:'材料', desc:'地心火元凝结之石，烈焰精华。', value:180, rarity:2 },
  { id:'tuyuan_po', name:'土元魄', type:'材料', category:'材料', desc:'大地精华凝聚之魄，厚德载物。', value:160, rarity:1 },
  { id:'muyuan_sui', name:'木元髓', type:'材料', category:'材料', desc:'万年灵木的生机精髓。', value:150, rarity:1 },
  { id:'fengyuan_lu', name:'风源露', type:'材料', category:'材料', desc:'九天之上的风灵之露。', value:140, rarity:1 },
  // 事件特有物品
  { id:'cangbao_tu', name:'藏宝图', type:'杂物', category:'杂物', desc:'一张泛黄的古地图，标注着某处的秘密宝藏。使用后循图寻宝，可获得意外之财。', value:30, treasureMap:true },
  { id:'chunyu_shui', name:'春雨水', type:'材料', category:'材料', desc:'春雨时节收集的灵水，浸润着春天的生机。', value:15 },
  { id:'guyu_pei', name:'古玉佩', type:'装备', category:'装备', desc:'一枚刻满符文的古玉，触手生温。', value:80, equipEffect:{defenseBonus:5} },
  { id:'huyu_pei', name:'护体玉佩', type:'装备', category:'装备', desc:'一枚能自动护主的玉佩，危急时会释放护盾。', value:100, equipEffect:{defenseBonus:8} },
  { id:'ling_mi', name:'灵蜂蜜', type:'材料', category:'材料', desc:'灵蜂酿造的蜜露，甘甜中蕴藏灵力。', value:25 },
  { id:'mingfu_ling', name:'冥府令牌', type:'材料', category:'杂物', desc:'通往冥府的令牌，上面刻着古老的符文。', value:50 },
  { id:'pojing_dan', name:'破境丹', type:'丹药', category:'丹药', desc:'打破瓶颈的丹药，突破时使用增加成功率。', value:120, effects:{breakthrough:0.15} },
  { id:'qise_lotus', name:'七色莲', type:'材料', category:'材料', desc:'蕴含七种天地元力的奇异莲花，流光溢彩。', value:500, rarity:3 },
  { id:'yao_dan', name:'妖丹', type:'材料', category:'材料', desc:'妖兽体内的力量精华，可用于炼丹或炼器。', value:60 },
  { id:'yingguang_zao', name:'荧光藻', type:'材料', category:'材料', desc:'在水下发出荧光的藻类，入药可明目。', value:18, junk:1 },
  { id:'youming_hua', name:'幽冥花', type:'材料', category:'材料', desc:'只在幽冥之地绽放的奇异花朵，花瓣如墨色琉璃。', value:45 },
  { id:'youming_zhu', name:'幽冥珠', type:'材料', category:'材料', desc:'凝聚了幽冥之气的宝珠，散发着幽幽寒光。', value:65 },
  { id:'yumu_hua', name:'玉木花', type:'材料', category:'材料', desc:'玉木所开之花，质如玉石，历千年不凋。', value:80, rarity:2 },
  { id:'shui_lingzhu', name:'水灵珠', type:'材料', category:'材料', desc:'水元力凝结而成的宝珠，内含一方水域之力。', value:200, rarity:2 },
  { id:'posun_lingshi', name:'破损的灵石', type:'材料', category:'材料', desc:'灵力已几近耗尽的残破灵石，只余微弱灵力。', value:2, junk:1 },
  { id:'heifeng_key', name:'黑风令', type:'材料', category:'杂物', desc:'黑风岭山贼头目的令牌，刻着一个「风」字。似乎能打开某处密室。', value:30 },
  { id:'biguan_token', name:'闭关令', type:'材料', category:'杂物', desc:'灵云峰颁发的闭关通行令牌，持有者方可进入闭关峰禁制区域。', value:10 },
  // ── 冰封仙子·解封材料 ──
  { id:'ice_fairy_flower', name:'瑶池冰莲', type:'材料', category:'材料', desc:'只生长于万载玄冰之上的九瓣冰莲，花瓣如水晶般透明，花蕊散发着幽蓝荧光。', value:500, rarity:5, questItem:true },
  { id:'ice_fairy_jade', name:'寒玉髓', type:'材料', category:'材料', desc:'深埋地心万年凝结的玉髓，通体冰凉，却能温暖心神。', value:500, rarity:5, questItem:true },
  { id:'ice_fairy_fire', name:'涅槃火种', type:'材料', category:'材料', desc:'凤凰涅槃时留下的一缕不灭火焰，是融化万年玄冰的唯一之物。', value:600, rarity:5, questItem:true },
  { id:'ice_fairy_tear', name:'冰魄泪', type:'材料', category:'材料', desc:'上古神女殒落时留下的泪滴凝结成的琥珀，晶莹剔透，触之生温。', value:500, rarity:5, questItem:true },
  { id:'ice_fairy_core', name:'玄冰之心', type:'材料', category:'材料', desc:'北极冰原之心万年凝聚的灵核，是整个北极冰域的灵气源泉。', value:800, rarity:5, questItem:true },
  // ── 冰封仙子·奖励 ──
  { id:'ice_heart_sword', name:'百里冰心剑', type:'装备', category:'装备', desc:'上古仙子百里冰的本命仙剑，剑身由万载玄冰铸就，剑芒所至，万物冰封。持之可大幅提升战力。', value:5000, rarity:5, equipEffect:{ attackBonus:80, defenseBonus:30, qiRegen:15, special:'霜寒：攻击时有20%概率冻结敌人一回合' } },
  { id:'xian_fairy_pill', name:'冰魄仙丹', type:'丹药', category:'材料', desc:'仙子以自身修为炼制的仙丹，服用后可直接提升一个境界（适用于元婴及以下境界修士）。也是冲击化神的无上助力。', value:3000, rarity:5, use:{ qi:500, special:'突破辅助·全境界+1级' } },

  // ── 筑基期（中州域）材料 ──
  { id:'lingmai_jing', name:'灵脉结晶', type:'材料', category:'材料', desc:'上古灵脉枯竭后留下的纯净结晶，蕴含浓郁的地脉灵气，是筑基修士修炼的上佳辅材。', value:60, rarity:2 },
  { id:'qinglin_jiao', name:'青鳞蛟皮', type:'材料', category:'材料', desc:'青鳞蛟蜕下的鳞皮，坚韧异常，是炼制内甲的良材。', value:90, rarity:2 },
  { id:'yaodan_he', name:'妖丹核', type:'材料', category:'材料', desc:'筑基级妖兽体内凝聚的内丹雏形，炼丹炼器皆可入药。', value:120, rarity:2 },
  { id:'zidian_diao', name:'紫电貂皮', type:'材料', category:'材料', desc:'紫电貂的皮毛，蕴藏雷属性灵力，是制作雷系法器的材料。', value:100, rarity:2 },
  { id:'huangji_gu', name:'荒寂骨', type:'材料', category:'材料', desc:'荒寂殿古战场遗骸中的兽骨，历经千年不腐，蕴含杀伐之气。', value:130, rarity:3 },
  { id:'zhushen_sui', name:'铸神髓', type:'材料', category:'材料', desc:'灵脉遗迹深处凝结的铸器神髓，传说能以之淬炼法器灵性。', value:200, rarity:3 },

  // ── 金丹期（天域）材料 ──
  { id:'leichi_jingtie', name:'雷池精铁', type:'材料', category:'材料', desc:'雷池底部经万古雷击淬炼的精铁，蕴含狂暴的雷灵之力，是祭炼本命法宝的核心材料。', value:300, rarity:3 },
  { id:'yunhai_lu', name:'云海露', type:'材料', category:'材料', desc:'云海秘境中凝结的灵露，一滴便蕴含一方水泽之力，可滋养法宝灵性。', value:280, rarity:3 },
  { id:'leijiao_long', name:'雷蛟内丹', type:'材料', category:'材料', desc:'雷池蛟龙的内丹，雷光流转，是炼制雷系丹药的至宝。', value:450, rarity:4 },
  { id:'tiandao_bei', name:'天道碑拓', type:'材料', category:'材料', desc:'天道碑文的拓印，蕴含大道真意，金丹修士参悟可窥破婴之机。', value:400, rarity:4 },
  { id:'yunhai_longjing', name:'云鲸脂', type:'材料', category:'材料', desc:'云海龙鲸体内的灵脂，纯净无瑕，是温养本命法宝的绝佳材料。', value:350, rarity:3 },
  { id:'jiuyang_ling', name:'九阳灵髓', type:'材料', category:'材料', desc:'天域九阳交汇处凝结的灵髓，至阳至纯，祭炼法宝可驱邪破妄。', value:380, rarity:4 },

  // ── 筑基期（中州域）丹药 ──
  { id:'zhushen_dan', name:'铸神丹', type:'丹药', category:'丹药', desc:'以铸神髓炼制的神丹，服用可大幅精进修为（筑基期效果尤佳）。', value:300, rarity:3, use:{ cultivationPoints:800 } },
  { id:'jiaolong_dan', name:'蛟龙丹', type:'丹药', category:'丹药', desc:'以青鳞蛟皮与妖丹核炼制的宝丹，服用后气血与灵力大增。', value:350, rarity:3, use:{ hp:300, qi:150, cultivationPoints:400 } },
  { id:'huangji_pojing', name:'荒寂破境丹', type:'丹药', category:'丹药', desc:'以荒寂古魔残魂的煞气炼成的破境丹，冲击金丹时使用可大幅提升成功率。', value:450, rarity:4, effects:{breakthrough:0.2} },

  // ── 金丹期（天域）丹药 ──
  { id:'leiquan_dan', name:'雷泉丹', type:'丹药', category:'丹药', desc:'以雷池精铁淬炼的丹药，服用后修为暴涨，亦能强化雷系功法。', value:600, rarity:4, use:{ cultivationPoints:1500, qi:200 } },
  { id:'yunhai_qingxin', name:'云海清心丹', type:'丹药', category:'丹药', desc:'以云海露炼制的清心丹药，服之心境澄明，悟性大增，参悟天道事半功倍。', value:550, rarity:4, use:{ wisdom:8, mood:20, cultivationPoints:1000 } },
  { id:'ningying_dan', name:'凝婴丹', type:'丹药', category:'丹药', desc:'以雷蛟内丹与九阳灵髓炼制的无上神丹，金丹圆满者服之，碎丹成婴的把握大增。', value:1200, rarity:5, effects:{breakthrough:0.25} },

  // ── 江湖风云·任务物品 ──
  { id:'tianji_key_1', name:'藏卷阁钥匙', type:'信物', category:'材料', desc:'天机阁藏卷阁的青铜钥匙，沈孤鸿珍藏多年。', value:50, questItem: true },
  { id:'tianji_can_juan', name:'天机残卷', type:'信物', category:'材料', desc:'记载着天机阁起源的半卷残书，纸页泛黄，字迹却清晰如新。', value:200, questItem: true },
  { id:'tianji_huilu', name:'天机护符', type:'法器', category:'装备', desc:'可挡一次致命之劫的护符，天机阁秘制。', value:800, rarity:3, desc2:'装备后获得天机护体', equipEffect:{ } },
  { id:'jianzhong_ling', name:'剑冢令', type:'信物', category:'材料', desc:'剑冢守冢人的信物，持之可入剑冢取传承之剑。', value:150, questItem: true },
  { id:'huanhun_cao', name:'九转还魂草', type:'灵草', category:'材料', desc:'传说能生死人肉白骨的仙草，通体翠绿泛光。', value:500, rarity:4, questItem: true },
  { id:'lingtong_pei', name:'灵瞳玉佩', type:'法器', category:'装备', desc:'以灵瞳之力凝成的玉佩，戴上能看见常人看不见的东西。', value:600, rarity:3 },
  { id:'heifeng_ling', name:'黑风令', type:'信物', category:'材料', desc:'黑风寨的兄弟令牌，持之可自由出入黑风寨。', value:120, questItem: true },
  { id:'leichi_neidan', name:'雷灵内丹', type:'材料', category:'材料', desc:'雷池蛟龙的内丹，蕴含磅礴雷灵之力，可育神莲、炼宝丹。', value:400, rarity:3, questItem: true },
  { id:'shenlian_hua', name:'九色神莲', type:'灵草', category:'材料', desc:'浮空花园百年一开的九色神莲，可入药、可炼器。', value:1000, rarity:5 },
  { id:'jianhen_bei', name:'剑痕古碑拓片', type:'信物', category:'材料', desc:'远古遗迹中的古碑拓片，碑上三道剑痕蕴含惊人的剑意。', value:150, questItem: true },
  { id:'wuming_jianpu', name:'无名剑谱', type:'功法', category:'功法', desc:'洛无霜毕生所悟的剑法，剑意凌厉，非寻常剑谱可比。', value:800, rarity:4 },
  { id:'mohei_jian', name:'归墟剑', type:'法器', category:'装备', desc:'铁老墨四十年后重铸的第一柄剑，通体乌黑，剑身有天然龙纹。', value:1200, rarity:5, equipEffect:{ attack:35 } },
  { id:'qingdeng', name:'引魂青灯', type:'法器', category:'装备', desc:'忘川河引路人的青灯，持之幽冥路上不会迷路。灯火摇曳间，可引魂入体、荡涤邪祟。', value:900, rarity:4, equipEffect:{ attackBonus:45, maxQiBonus:60, cultivationSpeed:0.10 } },
  { id:'tiandao_ling', name:'天道试炼令', type:'信物', category:'材料', desc:'天道峰试炼的凭证，通过考验者方可持有。', value:300, questItem: true },
  { id:'tiandao_yupei', name:'天道峰主玉佩', type:'法器', category:'装备', desc:'天道峰主的信物，持之可号令天道峰。', value:2000, rarity:5 },

  // ── 💎 宝石（可镶嵌进装备孔位）──
  { id:'gem_hongyu',  category:'材料', name:'红玉', type:'宝石', desc:'火属性灵石，镶嵌后增加攻击。', value:200, rarity:2, gemEffect:{ attackBonus:8 }, gemName:'红玉' },
  { id:'gem_lanyu',  category:'材料', name:'蓝玉', type:'宝石', desc:'水属性灵石，镶嵌后增加防御。', value:200, rarity:2, gemEffect:{ defenseBonus:8 }, gemName:'蓝玉' },
  { id:'gem_cuiyu',  category:'材料', name:'翠玉', type:'宝石', desc:'木属性灵石，镶嵌后增加气血。', value:200, rarity:2, gemEffect:{ hpBonus:40 }, gemName:'翠玉' },
  { id:'gem_ziyu',  category:'材料', name:'紫玉', type:'宝石', desc:'雷属性灵石，镶嵌后增加灵力。', value:200, rarity:2, gemEffect:{ maxQiBonus:30 }, gemName:'紫玉' },
  { id:'gem_huangyu', category:'材料', name:'黄玉', type:'宝石', desc:'土属性灵石，镶嵌后增加暴击。', value:250, rarity:2, gemEffect:{ critRate:0.02 }, gemName:'黄玉' },
];

// ==========================
// 天命/资质
// ==========================
const FORTUNE_TYPES = [
  { id:'tianxuan', name:'天选之命', desc:'气运加身，修炼事半功倍', color:'#c9a96e', moodBonus:15, luckMult:1.3 },
  { id:'fuyuan', name:'福缘深厚', desc:'奇遇不断，机缘丰厚', color:'#6a9ec9', exploreBonus:0.15, luckMult:1.2 },
  { id:'tiandao', name:'天道酬勤', desc:'根骨坚实，稳扎稳打', color:'#8a7a5a', boneBonus:15, wisdomMult:1.1 },
  { id:'mingtu', name:'命途多舛', desc:'开局艰难，但蕴藏潜力', color:'#d46a3a', luckBonus:5, statPool:20 },
  { id:'xianzi', name:'仙姿玉骨', desc:'天生道骨，灵气亲合', color:'#6a9ec9', qiBonus:50, wisdomBonus:10 },
];

// 人物出身（可选）
const CHARACTER_ORIGINS = [
  {
    id:'shijia', name:'修仙世家',
    desc:'生于修仙世家，从小耳濡目染，对修行并不陌生。家中虽非大富大贵，但功法丹药总不缺你一份。',
    bonus:{ stones:25, startSkillTier:1, affinity:10 },
    emoji:'🏛️',
  },
  {
    id:'sanxiu', name:'散修遗孤',
    desc:'父母皆是散修，在你年幼时便双双陨落于一场意外。你独自在江湖中摸爬滚打长大，比同龄人更懂得世道艰险。',
    bonus:{ luck:10, startSkillTier:0, exploreBonus:0.1 },
    emoji:'🌄',
  },
  {
    id:'yaonong', name:'药农之后',
    desc:'祖辈世代采药为生，你从小在山野间奔跑，认识百草，也深知自然的脾性。对灵草有天生的亲和力。',
    bonus:{ wisdom:8, startPillCount:3, herbAffinity:true },
    emoji:'🌿',
  },
  {
    id:'lieren', name:'猎户之子',
    desc:'自小随父辈进山打猎，弓马娴熟，体魄强健。与猛兽搏斗的经历让你比常人更沉着冷静。',
    bonus:{ bone:8, startHp:30, combatBonus:0.08 },
    emoji:'🏹',
  },
  {
    id:'shusheng', name:'落魄书生',
    desc:'寒窗苦读十余载，却在科举中名落孙山。失意之际，偶然读到一卷道经，从此弃文修仙。悟性过人。',
    bonus:{ wisdom:10, startSkillTier:0, qiBonus:20 },
    emoji:'📖',
  },
  {
    id:'jianghu', name:'江湖术士',
    desc:'曾在江湖上卖艺为生，走过很多地方，见过很多人。偶然获得半卷残破道书，从此一脚踏入修行路。',
    bonus:{ luck:5, stones:15, exploreBonus:0.08 },
    emoji:'🎭',
  },
  {
    id:'soldier', name:'退役军士',
    desc:'曾在军中效力，经历过生死搏杀。退役后寻仙问道，一身杀伐之气尚未褪尽。体魄过人，意志坚定。',
    bonus:{ bone:10, startHp:50, combatBonus:0.12 },
    emoji:'⚔️',
  },
  {
    id:'shangren', name:'商贾之子',
    desc:'家中世代经商，虽不富裕却也衣食无忧。从小耳濡目染，对灵石的价值格外敏感。',
    bonus:{ stones:35, tradeDiscount:0.1, luck:3 },
    emoji:'💰',
  },
];

// ==========================
// 宗门系统
// ==========================
const SECT_DB = [
  {
    id: 'tianjian', name: '天剑宗', desc: '东荒第一剑修宗门，以剑入道，攻伐无双。',
    location: '天剑峰', reputation: 0, joinRequirements: { attack: 20 },
    skills: ['fallen_leaf', 'jinjue', 'blazing_sword', 'thunder_step', 'tianlei_yin'],
    members: []
  },
  {
    id: 'tiandan', name: '丹霞谷', desc: '丹道圣地，专精炼丹与木系功法。',
    location: '丹霞山', reputation: 0, joinRequirements: { spiritRoot:'木' },
    skills: ['muye', 'green_mist', 'qinglian', 'fulu_tiannv', 'wanmu_chunqiu'],
    members: []
  },
  {
    id: 'tiandi', name: '厚土宗', desc: '体修大宗，肉身成圣是他们的信条。',
    location: '地脉山', reputation: 0, joinRequirements: { bodyRealm: 2 },
    skills: ['shiti', 'tiequan', 'houtu', 'earth_armor', 'bengtian_zhang'],
    members: []
  },
  {
    id: 'tianhuo', name: '炎火殿', desc: '火修圣地，追求极致破坏力。',
    location: '烈焰谷', reputation: 0, joinRequirements: { spiritRoot:'火' },
    skills: ['huoyan_breath', 'huoyan', 'sanmei', 'chilong_body', 'fentian_yin'],
    members: []
  },
  {
    id: 'tianshui', name: '碧波宫', desc: '隐世水修宗门，神秘而强大。',
    location: '碧波湖底', reputation: 0, joinRequirements: { realm: '练气三层', spiritRoot:'水' },
    skills: ['shuixin', 'mist_step', 'shuiyue_jing', 'xuanwu_ji', 'shenglong_jue'],
    members: []
  },
  {
    id: 'sanren', name: '散修联盟', desc: '无门无派的散修组织，自由自在。',
    location: '各处', reputation: 0, joinRequirements: {},
    skills: ['basic_tuna', 'yunjue', 'swift_step', 'splitting_fist'],
    members: []
  },
];

// ==========================
// NPC 生成系统
// ==========================
const NPC_SURNAMES_MALE = ['陈','林','王','张','李','赵','周','吴','徐','孙','马','朱','胡','郭','何','高','罗','郑','梁','宋'];
const NPC_SURNAMES_FEMALE = ['苏','沈','柳','花','楚','颜','江','池','叶','白','顾','梅','萧','陆','温','秦','唐'];
const NPC_GIVEN_MALE = ['长风','云天','子轩','浩然','明远','清河','星辰','南风','海川','凌风','剑锋','青云','志远','明达','龙渊'];
const NPC_GIVEN_FEMALE = ['清音','素雪','凝霜','紫烟','青萝','落雁','飞燕','听荷','问柳','含烟','月华','星蕊','霓裳','映雪','书瑶'];

const NPC_PERSONALITIES = [
  '开朗豪爽', '沉稳内敛', '心狠手辣', '天真烂漫', '老谋深算',
  '古道热肠', '阴郁寡言', '豪迈不羁', '谨小慎微', '高傲自负',
  '温和敦厚', '泼辣直率', '淡泊名利', '急公好义', '沉默寡言',
  '狡诈多疑', '宽厚仁慈', '刚愎自用', '玩世不恭', '坚韧不拔'
];

const NPC_BACKGROUNDS = [
  '修仙世家子弟', '山野散修', '落魄书生', '逃难孤儿', '江湖术士',
  '名门正派弟子', '魔道弃徒', '富商之子', '猎户出身', '前朝遗孤',
  '药农出身', '铁匠之女', '神秘隐士', '游方郎中', '退役军士'
];

const NPC_ROLES = [
  '散修', '药店掌柜', '铁匠', '客栈老板', '药农', '猎户',
  '宗门弟子', '游商', '情报贩子', '赏金猎人', '乞丐',
  '说书人', '江湖郎中', '画师', '琴师'
];

// ── NPC说话风格/小动作/欲求（给NPC注入灵魂） ──
const NPC_SPEECH_PATTERNS = {
  '开朗豪爽': { style:'嗓门敞亮，说话带笑意，动不动就拍人肩膀', quirk:'（哈哈大笑）', likes:'痛快人，直来直去' },
  '沉稳内敛': { style:'话不多但字字斟酌，语速偏慢', quirk:'（沉吟片刻）', likes:'稳重踏实的人' },
  '心狠手辣': { style:'说话带刺，语气阴冷，句句带威胁', quirk:'（冷笑一声）', likes:'实力至上的强者' },
  '天真烂漫': { style:'语气雀跃，像小孩子一样直率', quirk:'（歪着头想了想）', likes:'有趣的人和新鲜事' },
  '老谋深算': { style:'话里有话，总留三分余地，爱打哑谜', quirk:'（捋了捋胡须，眯眼笑）', likes:'可以拉拢利用的人' },
  '古道热肠': { style:'语速快，透着关切，恨不得掏心窝子', quirk:'（热切地看着你）', likes:'乐于助人，最喜欢帮人' },
  '阴郁寡言': { style:'说话像是从牙缝里挤出来的，低沉', quirk:'（目光阴郁地看着远处）', likes:'没有什么喜欢的' },
  '豪迈不羁': { style:'大嗓门，说话不拘小节，爱骂骂咧咧', quirk:'（拍了拍你的背，差点把你拍趴下）', likes:'喝酒打架交朋友' },
  '谨小慎微': { style:'说话声音不大，带点犹豫，总在观察四周', quirk:'（左右看了看，压低声音）', likes:'安安全全的' },
  '高傲自负': { style:'鼻子朝天，拿眼角看你，爱用鼻子哼', quirk:'（冷哼一声，挑起眉毛）', likes:'被人恭维奉承' },
  '温和敦厚': { style:'语调平和温暖，像长辈一样', quirk:'（笑眯眯地摆摆手）', likes:'和和气气过日子' },
  '泼辣直率': { style:'嘴皮子利索，说话不饶人但没真恶意', quirk:'（叉着腰白了你一眼）', likes:'爽快人，讨厌磨叽' },
  '淡泊名利': { style:'语速悠然，像什么事都不急', quirk:'（云淡风轻地笑了笑）', likes:'清净自在，深山老林' },
  '急公好义': { style:'火急火燎，听一半就抢话', quirk:'（一拍大腿）', likes:'路见不平一声吼' },
  '沉默寡言': { style:'一个字能说完绝不说两个字', quirk:'（默默点了点头）', likes:'安静，没人打扰' },
  '狡诈多疑': { style:'说话拐弯抹角，总在套话', quirk:'（眼珠转了转，露出意味深长的笑）', likes:'打探别人的秘密' },
  '宽厚仁慈': { style:'语气慈悲，像菩萨一样温柔', quirk:'（双手合十，微微欠身）', likes:'度化有缘人' },
  '刚愎自用': { style:'听不进别人说话，总觉得自己对', quirk:'（不耐烦地挥了挥手）', likes:'别人听他的' },
  '玩世不恭': { style:'爱开玩笑，什么事都嘻嘻哈哈的', quirk:'（耸了耸肩，一脸坏笑）', likes:'逗别人玩' },
  '坚韧不拔': { style:'话语短促有力，不容置疑', quirk:'（目光坚毅，直视着你）', likes:'说到做到的人' },
};

// 不同角色各具特色的小动作
const NPC_ROLE_QUIRKS = {
  '散修': '腰间挂着一个旧酒葫芦',
  '药店掌柜': '柜台后飘出淡淡药香，指尖总带着药渍',
  '铁匠': '膀大腰圆，手上满是老茧和炭灰',
  '客栈老板': '肩上搭着条白毛巾，脸上永远挂着生意人的笑',
  '药农': '背篓里装着刚采的草药，指甲缝里嵌着泥土',
  '猎户': '腰间别着几枚兽牙，眼神锐利',
  '宗门弟子': '衣着整洁，腰佩宗门令牌',
  '游商': '肩上搭着褡裢，手里拨着算盘',
  '情报贩子': '衣着不起眼，说话时眼神飘忽',
  '赏金猎人': '脸上有道疤，腰间挂着几个令牌',
  '乞丐': '破衣烂衫，手里拄着根竹杖',
  '说书人': '案上摆一方醒木，一把折扇',
  '江湖郎中': '背着药箱，胡子上沾着药渣',
  '画师': '袖口沾着墨迹，随身带着卷轴',
  '琴师': '指尖有薄茧，随身带一把古琴',
};

// 人生欲求（让NPC不只是一个名字）
const NPC_DESIRES = [
  '想找到一本失传的古籍',
  '渴望突破当前境界',
  '在寻找一位故人，多年未见',
  '攒钱想买一柄趁手的法器',
  '偷偷喜欢着某个人，不敢说出口',
  '想离开这里去更大的世界看看',
  '想开一家自己的店铺',
  '在躲仇家，不敢声张',
  '想找一个靠谱的道侣一起修行',
  '对某件往事耿耿于怀',
  '只想安安稳稳过完下半辈子',
  '想证明自己不比别人差',
  '欠了别人一笔人情，总想还上',
  '在研究一种新丹药，缺几味药材',
  '心里藏着一个秘密',
];

function generateNPC(sceneId, gender) {
  if (!gender) gender = Math.random() < 0.55 ? '男' : '女';
  const isMale = gender === '男';
  const surnames = isMale ? NPC_SURNAMES_MALE : NPC_SURNAMES_FEMALE;
  const givenNames = isMale ? NPC_GIVEN_MALE : NPC_GIVEN_FEMALE;
  const surname = surnames[Math.floor(Math.random() * surnames.length)];
  const given = givenNames[Math.floor(Math.random() * givenNames.length)];
  const name = surname + given;
  
  const personality = NPC_PERSONALITIES[Math.floor(Math.random() * NPC_PERSONALITIES.length)];
  const background = NPC_BACKGROUNDS[Math.floor(Math.random() * NPC_BACKGROUNDS.length)];
  const role = NPC_ROLES[Math.floor(Math.random() * NPC_ROLES.length)];
  
  // NPC灵魂数据
  const speechData = NPC_SPEECH_PATTERNS[personality] || { style:'自然的语气', quirk:'', likes:'友好的人' };
  const roleQuirkObj = NPC_ROLE_QUIRKS[role] || '';
  
  // 修为随机（不超过玩家太多）
  const playerRealm = Math.max(G.player.qiRealmIndex, G.player.bodyRealmIndex);
  const npcRealmLv = Math.max(0, Math.min(5, playerRealm + Math.floor(Math.random() * 3) - 1));
  const bodyRealmLv = Math.max(0, Math.min(5, playerRealm + Math.floor(Math.random() * 3) - 1));
  
  // 随机宗门
  const sect = SECT_DB[Math.floor(Math.random() * SECT_DB.length)];
  
  return {
    id: `npc_${Date.now()}_${Math.random().toString(36).slice(2,6)}`,
    name, gender, age: 16 + Math.floor(Math.random() * 40),
    personality, background, role,
    // 💫 NPC灵魂
    speechStyle: speechData.style,
    speechQuirk: speechData.quirk,
    speechLikes: speechData.likes,
    roleQuirk: roleQuirkObj,
    desire: NPC_DESIRES[Math.floor(Math.random() * NPC_DESIRES.length)],
    //
    qiRealmIndex: npcRealmLv, bodyRealmIndex: bodyRealmLv,
    sectId: Math.random() < 0.3 ? sect.id : null,
    sceneId,
    // 交互状态
    affinity: 0, // -100~100
    dialogHistory: [],
    questGiven: false,
    tradeGoods: null,
    // AI填充字段（由DeepSeek生成）
    aiDescription: null,
    aiDialogueStyle: null,
    // 🔥 故事感增强
    lifeStory: null,       // 小说式背景故事（DeepSeek生成）
    firstImpress: null,    // 第一次见面的印象描述
    isFirstMeeting: true,  // 是否初次见面
    lastEncounter: null,   // 上次见面的场景
    memoryLog: [],         // 与玩家互动的记忆片段
  };
}

function getNPCRealmLabel(npc) {
  const qi = QI_REALMS[npc.qiRealmIndex]?.name || '凡体';
  const body = BODY_REALMS[npc.bodyRealmIndex]?.name || '凡体';
  if (npc.qiRealmIndex > 0) return qi;
  if (npc.bodyRealmIndex > 0) return body;
  return '凡人';
}

// ==========================
// 天命抽卡生成器
// ==========================
function generateFortuneCard(index) {
  const allRoots = ['金','木','水','火','土'];
  const r = Math.random();
  const rootCount = r < 0.15 ? 1 : r < 0.55 ? 2 : r < 0.90 ? 3 : r < 0.98 ? 4 : 5;
  const roots = [...allRoots].sort(()=>Math.random()-0.5).slice(0, rootCount);
  const rootLabel = roots.join('·');

  const realFortune = FORTUNE_TYPES[Math.floor(Math.random() * FORTUNE_TYPES.length)];

  let luck = 30 + Math.floor(Math.random() * 40);
  let wisdom = 30 + Math.floor(Math.random() * 40);
  let bone = 30 + Math.floor(Math.random() * 40);
  if (realFortune.luckMult) luck = Math.round(luck * realFortune.luckMult);
  if (realFortune.luckBonus) luck += realFortune.luckBonus;
  if (realFortune.boneBonus) bone += realFortune.boneBonus;
  if (realFortune.wisdomMult) wisdom = Math.round(wisdom * realFortune.wisdomMult);
  if (realFortune.wisdomBonus) wisdom += realFortune.wisdomBonus;

  const startSkills = SKILL_DB.filter(s => (s.type==='吐纳法'||s.type==='炼体术') && s.quality==='凡级');
  const startSkill = startSkills[Math.floor(Math.random() * startSkills.length)];

  const equipPool = ITEM_DB.filter(i => i.type==='法器' && i.value <= 15);
  const startEquip = equipPool[Math.floor(Math.random() * equipPool.length)];

  const pillPool = ITEM_DB.filter(i => i.type==='丹药');
  const startPill = pillPool[Math.floor(Math.random() * pillPool.length)];

  const stones = rootCount >= 4 ? 5 + Math.floor(Math.random()*10) : 8 + Math.floor(Math.random()*20);

  return {
    index, roots, rootLabel,
    luck: Math.min(100, luck),
    wisdom: Math.min(100, wisdom),
    bone: Math.min(100, bone),
    mood: 50 + (realFortune.moodBonus || 0),
    fortune: realFortune,
    startSkill, startEquip, startPill, stones,
  };
}

// 导出
window.SKILL_DB = SKILL_DB;
window.ITEM_DB = ITEM_DB;
window.FORTUNE_TYPES = FORTUNE_TYPES;
window.SECT_DB = SECT_DB;
window.QUALITIES = QUALITIES;
window.QUALITY_COLORS = QUALITY_COLORS;

// ⚔️ 装备分级掉落库（equipment_drops.js）→ 合并进 ITEM_DB，供商店/图鉴/寻物识别
if (typeof EQUIP_DROP_POOL !== 'undefined') {
  try {
    Object.keys(EQUIP_DROP_POOL).forEach(function(q) {
      var pool = EQUIP_DROP_POOL[q];
      Object.keys(pool).forEach(function(slot) {
        (pool[slot] || []).forEach(function(eq) {
          if (!ITEM_DB.some(function(it) { return it.id === eq.id; })) {
            ITEM_DB.push({
              id: eq.id, category: '装备', name: eq.name, type: '法器',
              desc: eq.desc, value: eq.value, quality: q, equipEffect: eq.equipEffect
            });
          }
        });
      });
    });
  } catch(e) {}
}
window.generateFortuneCard = generateFortuneCard;
window.generateNPC = generateNPC;
window.getNPCRealmLabel = getNPCRealmLabel;
window.NPC_PERSONALITIES = NPC_PERSONALITIES;
window.NPC_BACKGROUNDS = NPC_BACKGROUNDS;
window.NPC_ROLES = NPC_ROLES;
window.NPC_SPEECH_PATTERNS = NPC_SPEECH_PATTERNS;
window.NPC_ROLE_QUIRKS = NPC_ROLE_QUIRKS;
window.NPC_DESIRES = NPC_DESIRES;
window.CHARACTER_ORIGINS = CHARACTER_ORIGINS;

// ==========================
// 世界地图数据（此处内嵌，避免 JSON 异步加载）
// ==========================
const WORLD_DATA = {
  layers: [
    {
      id: 'all', name: '玄黄大陆', title: '万界归一',
      intro: '凡尘界、幽冥界、通天路已融为一体，天地间再无阻隔。修仙之路，四海通途。',
      gridW: 7, gridH: 12, accentColor: '#6a9ec9',
      scenes: [
        { id:'qingyun', name:'青云镇', x:3, y:2, description:'依山傍水的宁静小镇，修仙者和凡人混居。坊市里叫卖声不绝，客栈中消息灵通。', cosmosDomain:'donghuang', cosmosRegion:'dh_canglan', type:'town', safe:true, qiLevel:3, npcPool:['药店掌柜','铁匠老吴','客栈小二','街边乞丐'], feature:'坊市', connections:['luoxia_forest','heifeng_ridge','bibo_lake','lingyun_peak','gate_mortal_nether','qingyun_pier','luori_plain','bamboo_grove','lingyao_garden','zuixian_lou','sect_base'] },
        // 🔧 2026-08-05：冰阁门派驻地正式加入世界地图（青云镇后山 x2,y2）
        //    第二纪元（冰阁弟子）显示「冰阁·山门」；第一纪元显示「青云后山」
        { id:'sect_base', name:'青云后山', x:2, y:2, description:'青云镇后山的一片山林，山道蜿蜒，草木葱茏。传闻先辈曾在此地留下过什么——山风拂过时，隐约能听见极远处冰窟的呜咽。', cosmosDomain:'donghuang', cosmosRegion:'dh_canglan', type:'mountain', safe:true, qiLevel:3, feature:'门派驻地', connections:['qingyun'],npcPool:['采药老农','巡山猎户','挑水少年','打柴樵夫','踏青的镇上姑娘'],},
        { id:'luoxia_forest', name:'落霞森林', x:1, y:0, description:'古木参天，枝叶遮天蔽日。阳光透过树叶的缝隙洒下斑驳光影，偶尔有妖兽的嘶吼从深处传来。', cosmosDomain:'donghuang', cosmosRegion:'dh_qingmu', type:'wild', safe:false, qiLevel:4, dangerLevel:1, monsters:['野狼','青木蛇','铁皮野猪'], connections:['qingyun','lingyun_peak','bamboo_grove','stone_road'],npcPool:['采药老人','猎户','巡林修士','迷路散修','流浪剑客'],},
        { id:'heifeng_ridge', name:'黑风岭', x:1, y:3, description:'山势险峻，常年黑风呼啸。此地盘踞着一伙山贼，过往修士需多加小心。', cosmosDomain:'donghuang', cosmosRegion:'dh_canglan', type:'wild', safe:false, qiLevel:3, dangerLevel:1, monsters:['黑风山贼','山贼头目'], connections:['qingyun','luori_plain','stone_road'],npcPool:['山贼喽啰','黑风寨哨兵','劫匪头目','逃亡商人','瘸腿老汉'],},
        { id:'bibo_lake', name:'碧波湖', x:5, y:1, description:'一望无际的碧绿湖水，湖面如镜，倒映着蓝天白云。传说湖心有水灵珠。', cosmosDomain:'donghuang', cosmosRegion:'dh_biluo', type:'wild', safe:true, qiLevel:4, feature:'钓鱼', connections:['qingyun','qingyun_pier'],npcPool:['垂钓老翁','采莲女','船夫','临湖练剑的少女','岸边补网的渔夫'],},
        { id:'lingyun_peak', name:'灵云峰', x:3, y:0, description:'高耸入云的山峰，云雾缭绕间灵气浓郁。山间遍布灵草，是采集和静修的好去处。', cosmosDomain:'donghuang', cosmosRegion:'dh_tianzhu', type:'mountain', safe:true, qiLevel:5, resourceType:'灵草', connections:['luoxia_forest','qingyun','lingyao_garden','moon_valley','bamboo_grove','bingfeng_grotto'],npcPool:['云游道人','聚气打坐的老者','采药童子','巡山弟子','坐崖悟道的散修'],},
        { id:'lingyao_garden', name:'灵药园', x:5, y:0, description:'隐藏在深山中的古老药园，灵药遍地，药香扑鼻。似乎很久没人打理了。', cosmosDomain:'donghuang', cosmosRegion:'dh_qingmu', type:'garden', safe:true, qiLevel:4, resourceType:'灵药', connections:['lingyun_peak','qingyun','moon_valley'],npcPool:['守园老人','偷药的散修','灵药商人','药痴老头','采药女童'],},
        { id:'gate_mortal_nether', name:'古井入口', x:6, y:4, description:'镇外老槐树下的古井，深不见底，阴风自井中涌出。', cosmosDomain:'donghuang', cosmosRegion:'dh_canglan', type:'wild', safe:false, qiLevel:3, dangerLevel:1, monsters:['幽魂','阴煞蛛','吸血蝙蝠'], connections:['qingyun','youming_grotto','stone_road'],npcPool:['守井老者','胆大的采药人','阴气缠身的道士','过路商贾'],},
        { id:'qingyun_pier', name:'清风渡口', x:6, y:1, description:'青云镇外的水码头，碧波湖上往来的船只在此停靠。岸边的柳树下常有渔夫垂钓，也偶尔有游方散人乘船而来。', cosmosDomain:'donghuang', cosmosRegion:'dh_biluo', type:'town', safe:true, qiLevel:3, npcPool:['老船夫','钓鱼翁','游方商人'], feature:'钓鱼', connections:['qingyun','bibo_lake','zuixian_lou','zhongzhou_gate'] },
        { id:'luori_plain', name:'落日平原', x:0, y:3, description:'一望无际的苍茫平原，野草及腰，风过时如金色波浪起伏。远处的落日如同熔金般沉入地平线。', cosmosDomain:'donghuang', cosmosRegion:'dh_luori', type:'wild', safe:false, qiLevel:3, dangerLevel:1, monsters:['草狼','荒原巨蜥','沙鹫'], connections:['qingyun','heifeng_ridge'],npcPool:['放牧少年','流浪武僧','赶路的行商','断剑骑士','落日下练拳的老者'],},
        { id:'bamboo_grove', name:'翠竹林', x:0, y:0, description:'一片碧绿的翠竹海，风过竹林，沙沙声如丝竹合奏。竹根下偶尔能挖到新鲜的竹笋和埋藏多年的竹菌。', cosmosDomain:'donghuang', cosmosRegion:'dh_qingmu', type:'wild', safe:false, qiLevel:3, dangerLevel:1, monsters:['翠竹蛇','竹鼠群','白额猴'], connections:['qingyun','luoxia_forest','lingyun_peak'],npcPool:['砍竹老翁','吹笛书生','隐居画师','竹屋隐士','采笋妇人'],},
        { id:'moon_valley', name:'月华谷', x:4, y:0, description:'两山夹峙的月牙形山谷，谷底有一潭清可见底的月华泉。传说每逢满月之夜，月光会在泉水中凝成银色的露珠。', cosmosDomain:'donghuang', cosmosRegion:'dh_tianzhu', type:'valley', safe:true, qiLevel:4, resourceType:'灵药', connections:['lingyun_peak','lingyao_garden'],npcPool:['月下独酌的修士','采露少女','赏月书生','石上打坐的白发老妪','弹琴的散人'],},
        { id:'stone_road', name:'青石古道', x:0, y:1, description:'一条铺满青石板的古道，石板已被岁月磨得光滑如镜。路旁每隔三里便有一座半塌的石亭，供路人歇脚。', cosmosDomain:'donghuang', cosmosRegion:'dh_canglan', type:'wild', safe:false, qiLevel:3, dangerLevel:1, monsters:['古道劫匪','野狼','破旧石像'], connections:['luoxia_forest','heifeng_ridge','gate_mortal_nether'],npcPool:['挑担货郎','赶路的行脚僧','落魄镖师','独行侠客','歇脚的老夫妇'],},
        { id:'youming_grotto', name:'幽冥鬼窟', x:2, y:6, description:'阴气森森的古老洞窟，石壁上爬满了暗绿色的苔藓。深处隐约有鬼火飘动，寒意刺骨。', cosmosDomain:'youyu', cosmosRegion:'yy_wangzhe', type:'dungeon', safe:false, qiLevel:5, dangerLevel:2, monsters:['幽魂','骷髅兵','阴煞蛛'], connections:['underground_river','gate_mortal_nether','gate_nether_divine','yy_baihu_hill','bingfeng_grotto'],npcPool:['探宝修士','地宫守墓人','幽魂缠身的道士','亡命之徒','畏惧不前的猎户'],},
        { id:'underground_river', name:'地底暗河', x:1, y:8, description:'深入地下的暗河洞穴，头顶的钟乳石在微光中闪烁。河水冰冷刺骨，不知通向何处。', cosmosDomain:'youyu', cosmosRegion:'yy_wangchuan', type:'dungeon', safe:false, qiLevel:5, dangerLevel:2, monsters:['地下巨蜥','吸血蝙蝠'], connections:['youming_grotto','duzhang_swamp','yy_lunhui_platform'],npcPool:['划船引渡人','沉船寻宝客','地底采晶人','迷路的矿工','水鬼缠身的老道'],},
        { id:'duzhang_swamp', name:'毒瘴沼泽', x:4, y:7, description:'暗绿色的沼泽地，空气中弥漫着刺鼻的毒瘴。水面上冒着气泡，不知藏着什么危险。', cosmosDomain:'youyu', cosmosRegion:'yy_huangquan', type:'swamp', safe:false, qiLevel:5, dangerLevel:2, monsters:['毒鳞蛇','沼泽巨蛙','毒蚊群'], resourceType:'毒物', connections:['underground_river','guji_ruins','yy_huangquan_road','yy_wangchuan_river'],npcPool:['采瘴毒的老药农','沼泽猎鳄人','误入沼泽的修士','避世的毒修','绑着绷带的采药人'],},
        { id:'bingfeng_grotto', name:'冰风石窟', x:3, y:5, description:'终年冰封的石窟，洞壁上凝结着剔透的冰晶。刺骨的寒风从深处吹来，夹杂着细碎的冰屑。', cosmosDomain:'beiji', cosmosRegion:'bj_bingfeng', type:'cave', safe:false, qiLevel:6, dangerLevel:3, monsters:['冰晶蝎','雪狼','冰霜巨人'], resourceType:'冰晶', connections:['youming_grotto','bj_frozen_lake','bj_snow_forest','lingyun_peak'],npcPool:['冰窟采晶人','冻伤的探险家','避寒的苦修士','冰湖垂钓翁','凿冰取水的老人'],},
        { id:'guji_ruins', name:'远古遗迹', x:4, y:8, description:'上古时代留下的废墟，残破的石柱和雕像诉说着曾经的辉煌。空气中弥漫着神秘的气息。', cosmosDomain:'youyu', cosmosRegion:'yy_lunhui', type:'ruins', safe:false, qiLevel:6, dangerLevel:3, monsters:['石像守卫','上古傀儡','残魂'], resourceType:'法器', connections:['duzhang_swamp','yy_baihu_hill','yy_lunhui_platform'],npcPool:['考古散修','遗迹守卫','盗墓贼','遗迹学者','寻宝猎人'],},
        { id:'gate_nether_divine', name:'试炼之塔', x:0, y:5, description:'通体漆黑的古老石塔，塔身上爬满了金色的符文。塔门紧闭，隐约能感到塔身散发的磅礴威压。', cosmosDomain:'youyu', cosmosRegion:'yy_wangzhe', type:'wild', safe:false, qiLevel:6, dangerLevel:0, connections:['youming_grotto','yy_huangquan_road'],npcPool:['试炼者甲','试炼者乙','塔前观望的少年','败下阵来的修士','塔顶的守关老人'],},
        { id:'leiyin_temple', name:'雷音古刹', x:2, y:10, description:'废弃的古刹，断壁残垣间仍能看出昔日的辉煌。据说古刹地宫中藏有前辈高人的传承。', cosmosDomain:'tianyu', cosmosRegion:'ty_fulong', type:'dungeon', safe:false, qiLevel:6, dangerLevel:3, monsters:['石傀儡','怨灵'], feature:'隐藏传承', connections:['xuantie_mine','yumu_forest','biguan_peak','ty_yunxiao_tower','ty_floating_garden','lieyan_valley','zz_tianji_city'],npcPool:['残佛前诵经的老僧','地宫探险者','捡拾古物的乞丐','考察遗迹的文人','雷音寺旧僧'],},
        { id:'lieyan_valley', name:'烈焰谷', x:5, y:9, description:'终年燃烧着熊熊烈焰的山谷，空气中弥漫着硫磺的气息。岩浆河在大地上蜿蜒流淌，这里是火修的圣地。', cosmosDomain:'tianyu', cosmosRegion:'ty_fulong', type:'wild', safe:false, qiLevel:7, dangerLevel:3, monsters:['岩浆蜥蜴','火焰鸟','火灵精'], feature:'宗门·炎火殿', connections:['leiyin_temple','biguan_peak','ty_floating_garden'],npcPool:['火属性修士','采火精的铁匠','耐热药农','避暑的散修','烈焰中练功的狂人'],},
        { id:'xuantie_mine', name:'玄铁矿洞', x:1, y:11, description:'深埋地下的古老矿脉，洞壁上嵌着幽暗的玄铁矿石。据说这里是炼制法器的上等材料产地。', cosmosDomain:'tianyu', cosmosRegion:'ty_fulong', type:'dungeon', safe:false, qiLevel:7, dangerLevel:3, monsters:['岩石巨兽','铁甲蜥蜴'], resourceType:'矿石', connections:['leiyin_temple'],npcPool:['矿工头','瘦弱矿工','监工','收购矿石的商人','矿洞探宝者'],},
        { id:'yumu_forest', name:'玉木林', x:4, y:10, description:'一片生长着玉色古木的奇林，树木通体温润如玉。据古籍记载，玉木千年一开花，花落可入丹。', cosmosDomain:'donghai', cosmosRegion:'dh_yingzhou', type:'wild', safe:false, qiLevel:7, dangerLevel:3, monsters:['玉木精','树妖'], resourceType:'灵木', connections:['leiyin_temple','dh_yingzhou_port','dh_coral_reef'],npcPool:['木属性修士','采树脂的药农','伐木工','对木参悟的苦修者','骑牛老者']},
        { id:'biguan_peak', name:'闭关峰', x:2, y:9, description:'被强大禁制封印的山峰，灵气浓郁如雾。此地是突破境界的绝佳之地，但需持有通行令牌方可入内。', cosmosDomain:'tianyu', cosmosRegion:'ty_fulong', type:'mountain', safe:true, qiLevel:8, feature:'闭关突破', connections:['leiyin_temple','lieyan_valley','ty_baiyu_palace'],npcPool:['闭死关的老怪','送饭童子','护法的弟子','慕名而来的求道者','崖边望云的散修'],},

        // ═══ 北极域·冰原雪域 ═══
        { id:'bj_frozen_lake', name:'冰封湖', x:5, y:5, description:'万里冰原中的一面明镜湖，湖面冰层晶莹剔透如水晶。冰层之下隐约有巨大的黑影游动，偶尔能听到冰层破裂的咔嚓声。', cosmosDomain:'beiji', cosmosRegion:'bj_bingfeng', type:'wild', safe:false, qiLevel:6, dangerLevel:3, monsters:['冰鳞鱼','雪蜥蜴','冰晶水母'], resourceType:'冰晶', connections:['bingfeng_grotto','bj_ice_peak'],npcPool:['冰湖垂钓的老者','凿冰取水的猎人','冰面上练剑的白衣修士','小心翼翼的探险者','冰窟中的冬眠修士'],},
        { id:'bj_ice_peak', name:'冰晶峰', x:0, y:6, description:'高耸入云的冰晶山峰，整座山由万载玄冰凝结而成，在极光照耀下折射出七彩光芒。山顶终年狂风肆虐，寻常修士难以立足。', cosmosDomain:'beiji', cosmosRegion:'bj_bingfeng', type:'mountain', safe:false, qiLevel:7, dangerLevel:4, monsters:['冰晶巨人','雪雕王','冰霜龙蜥'], resourceType:'冰晶', connections:['bj_frozen_lake','bj_snow_forest'],npcPool:['攀冰冒险者','山顶打坐的苦行僧','采集冰晶的矿工','迷路的雪山旅人','极光下悟道的老人'],},
        { id:'bj_snow_forest', name:'雪松林', x:4, y:4, description:'被厚厚积雪覆盖的古老松林，松枝上挂满冰凌。林中寂静无声，只有踩雪时的咯吱声和偶尔从深处传来的兽吼。雪松根系下偶有凝结千年的松脂化石。', cosmosDomain:'beiji', cosmosRegion:'bj_bingfeng', type:'forest', safe:false, qiLevel:5, dangerLevel:2, monsters:['雪狼','冰甲熊','雪兔群'], resourceType:'灵木', connections:['bingfeng_grotto','bj_ice_peak'],npcPool:['捕兽猎人','采松脂的药农','雪地里煮茶的老道','迷路的采药女','雪地追踪的猎户'],},

        // ═══ 东海域·万岛仙海 ═══
        { id:'dh_yingzhou_port', name:'瀛洲渡口', x:3, y:11, description:'东海瀛洲岛的门户港口，木制栈桥延伸到碧波万顷的海面上。海风咸湿，船帆林立。港口旁有小集市，售卖海货和航海法器。', cosmosDomain:'donghai', cosmosRegion:'dh_yingzhou', type:'town', safe:true, qiLevel:6, npcPool:['老船夫','海商','采珠女','瞭望台上的哨兵','码头搬运工'], feature:'港口贸易', connections:['yumu_forest','dh_coral_reef','dh_shipwreck_island'],},
        { id:'dh_coral_reef', name:'珊瑚礁海', x:6, y:10, description:'一片五彩斑斓的珊瑚礁海域，清澈的海水可以一眼望到海底。珊瑚丛中游弋着发光的鱼群，偶尔能在珊瑚缝隙中找到被海水冲刷了千年的古物。', cosmosDomain:'donghai', cosmosRegion:'dh_yingzhou', type:'wild', safe:false, qiLevel:7, dangerLevel:3, monsters:['毒刺水母','珊瑚巨龟','噬魂鳗'], resourceType:'灵药', connections:['dh_yingzhou_port','yumu_forest'],npcPool:['潜水采珠人','珊瑚礁间练剑的水修','拾贝的渔家少女','被海流冲散的水手','礁石上打坐的老修士'],},
        { id:'dh_shipwreck_island', name:'沉船岛', x:5, y:11, description:'一座荒凉的小岛，岛周围遍布沉船残骸。传说数百年前一支庞大的舰队在此遭遇海难，船上载满了各宗门送往秘境的贡品。岛上至今仍有修士前来寻宝。', cosmosDomain:'donghai', cosmosRegion:'dh_yingzhou', type:'dungeon', safe:false, qiLevel:7, dangerLevel:3, monsters:['沉船怨灵','巨型章鱼','骷髅水手'], resourceType:'法器', connections:['dh_yingzhou_port'],npcPool:['寻宝猎人','沉船遗址探险者','打捞贡品的修士','坐在船骸上的白发老人','清理甲板的渔民'],},

        // ═══ 天域·浮空仙境 ═══
        { id:'ty_yunxiao_tower', name:'云霄塔', x:0, y:10, description:'天域中最高的建筑，一座由白玉砌成的九层高塔直插云霄。塔身环绕着金色的铭文，每一层都封印着一位上古大能的传承。据说登顶者可得天道庇佑。', cosmosDomain:'tianyu', cosmosRegion:'ty_fulong', type:'dungeon', safe:false, qiLevel:8, dangerLevel:4, monsters:['塔灵','铭文傀儡','灵气风暴'], feature:'登天传承', connections:['leiyin_temple','ty_floating_garden'],npcPool:['塔前跪拜的求道者','看守塔门的白发老者','从塔顶下来的修士','记录铭文的学者','盘坐在塔边的散修'],},
        { id:'ty_floating_garden', name:'悬空花园', x:6, y:9, description:'一座漂浮在云层中的仙境花园，奇花异草遍地，灵蝶飞舞。花园中央有一棵通天古树，枝叶覆盖了整座浮岛。树下有一汪清澈的灵泉，喝一口可净心明性。', cosmosDomain:'tianyu', cosmosRegion:'ty_fulong', type:'garden', safe:true, qiLevel:7, resourceType:'灵药', connections:['lieyan_valley','ty_yunxiao_tower','leiyin_temple'],npcPool:['花园中浇花的仙子','树下悟剑的剑客','灵泉边饮水的白鹤','采集灵花的药童','在花丛中打盹的老者'],},

        // ═══ 幽域·生死边界 ═══
        { id:'yy_huangquan_road', name:'黄泉路', x:0, y:7, description:'一条铺满黄色碎石的荒凉古道，道路两旁盛开着血红色的彼岸花。空气中弥漫着若有若无的哭泣声，偶尔能看到透明的虚影沿着道路前行——那是迷途的魂魄。', cosmosDomain:'youyu', cosmosRegion:'yy_huangquan', type:'wild', safe:false, qiLevel:5, dangerLevel:2, monsters:['迷途残魂','彼岸花妖','噬魂蝶'], connections:['gate_nether_divine','yy_wangchuan_river','duzhang_swamp'],npcPool:['引魂的道士','路边焚纸的老妪','迷失魂魄的少女','沿路超度的僧人','在彼岸花丛中哭泣的鬼修'],},
        { id:'yy_wangchuan_river', name:'忘川河渡口', x:3, y:7, description:'横贯幽域的冥河在此变得平缓，河水漆黑如墨，波澜不惊。岸边有一个古老的渡口，一个戴斗笠的老船夫在此撑篙渡人——也渡魂。河对岸隐约可见一座石台。', cosmosDomain:'youyu', cosmosRegion:'yy_wangchuan', type:'town', safe:true, qiLevel:5, npcPool:['渡船老人','等船的魂魄','岸边卖纸钱的小贩','来此祭奠亡者的修士','河畔吹笛的阴灵'], feature:'渡口摆渡', connections:['yy_huangquan_road','yy_baihu_hill','duzhang_swamp'],},
        { id:'yy_baihu_hill', name:'白骨山', x:5, y:6, description:'一座完全由白骨堆积而成的山丘，白森森的骨骼在幽暗的天光下泛着磷光。山脚下散落着残破的兵器，山顶有一把插在骨堆中的黑色古剑，散发着不祥的气息。', cosmosDomain:'youyu', cosmosRegion:'yy_wangzhe', type:'wild', safe:false, qiLevel:6, dangerLevel:3, monsters:['白骨精','嗜血飞头蛮','亡灵骑士','阴灵守卫'], resourceType:'法器', connections:['yy_wangchuan_river','youming_grotto','guji_ruins','yy_lunhui_platform'],npcPool:['骨堆中翻找战利品的修士','在骨山上修炼的鬼修','抱着长剑哭泣的女鬼','祭拜亡灵的将军','白骨缝隙中采药的老者'],},
        { id:'yy_lunhui_platform', name:'轮回台', x:2, y:8, description:'幽域最深处的圆形高台，台面刻着巨大的六道轮回图——天、人、阿修罗、畜生、饿鬼、地狱六道循环不息。高台散发出的气息让生灵感到敬畏，据说在此悟道可窥见前世今生。', cosmosDomain:'youyu', cosmosRegion:'yy_lunhui', type:'ruins', safe:true, qiLevel:7, feature:'悟道·六道轮回', connections:['underground_river','yy_baihu_hill','guji_ruins'],npcPool:['台上打坐悟道的苦修士','观摩轮回图的僧人','记录符文的老学究','在此等待轮回的老者','黯然神伤的鬼修'],},

        // ═══ 中州域·天机城（筑基期）═══
        { id:'zhongzhou_gate', name:'中州古道', x:2, y:10, description:'连接凡尘与中州的古老驿道，路面铺着青石板，两侧古木参天。传说走过这条路的人，才算真正踏入修仙界的大门。', cosmosDomain:'zhongzhou', cosmosRegion:'zz_tianji', type:'gate', safe:false, qiLevel:8, dangerLevel:2, monsters:['古道劫匪','白额猴'], resourceType:'灵石', connections:['qingyun_pier','zz_tianji_city'],npcPool:['赶路的商队护卫','古道巡检使','落魄剑修','贩卖地图的书生','驿卒'], feature:'跨界古道'},
        { id:'zz_tianji_city', name:'天机城', x:1, y:10, description:'中州域第一雄城，九域商路交汇之地。城墙以天机石砌成，坊市间法宝灵光流转，万宝楼的高塔直插云霄。筑基修士在此可拜入中州宗门、兑换高阶丹方。', cosmosDomain:'zhongzhou', cosmosRegion:'zz_tianji', type:'town', safe:true, qiLevel:9, npcPool:['万宝楼掌柜','天机阁主事','巡城执法修士','中州散修','卖符纸的少女'], feature:'坊市·万宝楼', connections:['leiyin_temple','zz_yaoshou_ridge','zz_lingmai_ruins','wanshou_shanzhuang','tianji_ge','zhongzhou_gate'],},
        { id:'zz_yaoshou_ridge', name:'妖兽山脉', x:3, y:10, description:'绵延千里的蛮荒山脉，灵气浓郁却妖兽横行。深处不时传来震天的兽吼——青鳞蛟、赤目妖狼皆是筑基修士也要忌惮的存在。山腰有前人开辟的猎妖营地。', cosmosDomain:'zhongzhou', cosmosRegion:'zz_yaoshou', type:'wild', safe:false, qiLevel:10, dangerLevel:3, monsters:['青鳞蛟','赤目妖狼','紫电貂'], resourceType:'兽材', connections:['zz_tianji_city','zz_huangji_dian','wanshou_shanzhuang'],npcPool:['猎妖修士','剥皮匠人','蹲守妖穴的猎人','伤愈的老修士','贩卖兽骨的商贩'],},
        { id:'zz_lingmai_ruins', name:'灵脉遗迹', x:4, y:11, description:'上古灵脉枯竭后留下的遗迹，洞壁上残留着晶莹的灵脉结晶。传闻遗迹深处封印着一座古修洞府，禁制已随时间松动——筑基圆满者有望从中寻得结丹机缘。', cosmosDomain:'zhongzhou', cosmosRegion:'zz_lingmai', type:'dungeon', safe:false, qiLevel:10, dangerLevel:3, monsters:['灵脉石灵','紫电貂','赤目妖狼'], resourceType:'灵晶', connections:['zz_tianji_city','ty_baiyu_palace'],npcPool:['寻宝修士','灵脉勘察师','在此闭关的散修','洞口徘徊的胆怯修士','兜售地图的老者'],},
        { id:'zz_huangji_dian', name:'荒寂殿', x:5, y:10, description:'中州古战场中央的残破神殿，殿中阴风呼啸，回荡着远古的杀伐之声。传说荒寂古魔的残魂仍在殿内徘徊——那是筑基期修士最凶险的试炼。', cosmosDomain:'zhongzhou', cosmosRegion:'zz_huangji', type:'dungeon', safe:false, qiLevel:11, dangerLevel:4, monsters:['荒寂殿卫','灵脉石灵'], resourceType:'法器', connections:['zz_yaoshou_ridge'],npcPool:['古战场拾荒者','祭拜亡魂的老兵','胆大的考古修士','在此悟道的剑修','躲避仇家的散修'],},

        // ═══ 天域·云霄白玉宫（金丹期）═══
        { id:'ty_baiyu_palace', name:'云霄白玉宫', x:0, y:9, description:'悬浮于九天之上的白玉仙宫，云海在脚下翻涌。白玉台阶尽头，天域之主曾在此开坛讲道。金丹修士可入宫参悟天道碑，也可前往雷池淬炼本命法宝。', cosmosDomain:'tianyu', cosmosRegion:'ty_baiyu', type:'town', safe:true, qiLevel:12, npcPool:['白玉宫侍者','天道碑前参悟的修士','云海垂钓的仙人','送仙茶的童子','观星的老道'], feature:'参悟·天道碑', connections:['zz_lingmai_ruins','biguan_peak','ty_leichi','ty_yunhai','ty_tiandao_peak'],},
        { id:'ty_leichi', name:'雷池', x:1, y:9, description:'天域之巅的万古雷池，紫电如龙蛇在云层中穿梭。雷池之水淬体炼宝皆有奇效——本命法宝需在此经历九道天雷洗礼方能大成。雷池深处栖息着雷蛟。', cosmosDomain:'tianyu', cosmosRegion:'ty_leichi', type:'wild', safe:false, qiLevel:12, dangerLevel:4, monsters:['雷池蛟龙','紫霄雷鸟'], resourceType:'雷晶', connections:['ty_baiyu_palace'],npcPool:['雷池边淬体的壮汉','收集雷晶的炼器师','躲避雷劫的修士','雷池垂钓的怪人','身缠雷光的少年'],},
        { id:'ty_yunhai', name:'云海秘境', x:3, y:9, description:'天域边缘的云海深处，藏着上古仙人开辟的一方秘境。云鲸在云海中沉浮，灵岛时隐时现。秘境中产出的云海露与雷池精铁，是祭炼本命法宝的绝佳材料。', cosmosDomain:'tianyu', cosmosRegion:'ty_yunhai', type:'dungeon', safe:false, qiLevel:13, dangerLevel:4, monsters:['云海龙鲸','紫霄雷鸟','雷池蛟龙'], resourceType:'灵材', connections:['ty_baiyu_palace'],npcPool:['云海采露人','驾驭云舟的仙子','迷失在云海的老修士','云鲸追随者','采灵材的丹修'],},
        { id:'ty_tiandao_peak', name:'天道峰', x:4, y:9, description:'天域最高峰，山巅刻着上古天道碑。碑文蕴含大道真意，金丹圆满者可在此参悟破婴之机。峰顶终年雷云密布——天道雷尊镇守于此，考验每一个登顶者。', cosmosDomain:'tianyu', cosmosRegion:'ty_tiandao', type:'mountain', safe:false, qiLevel:14, dangerLevel:4, monsters:['天道峰守灵','云海龙鲸'], feature:'悟道·天道碑', connections:['ty_baiyu_palace'],npcPool:['登顶挑战者','崖边悟道的金丹修士','守护碑文的老人','记录雷劫的史官','前来瞻仰的年轻修士'],},
      ]
    }
  ]
};
;


// ==========================
// 事件模板
// ==========================
const EVENT_TEMPLATES = [
  {
    id:'qingyun_old_man',
    type:'奇遇',
    trigger:{random:0.15, scene:'qingyun'},
    title:'老者的馈赠',
    description:'路边一位白发老者叫住了你，从怀中取出一卷泛黄的书简。',
    choices:[
      {text:'恭敬接过', result:'获得功法秘籍', reward:{skillScroll:'yunjue'}},
      {text:'婉言谢绝', result:'老者微微一笑，飘然而去', reward:{mood:5}}
    ]
  },
  {
    id:'qingyun_hidden_pouch',
    type:'奇遇',
    trigger:{random:0.1, scene:'qingyun', timePeriod:'夜'},
    title:'檐下暗袋',
    description:'你在客栈屋檐下歇脚时，指尖碰到一处松动的瓦片，下面藏着一个布囊。',
    choices:[
      {text:'打开看看', result:'获得一袋灵石和一枚丹药', reward:{stones:50, item:'poqi_dan'}},
      {text:'放回原处', result:'多一事不如少一事', reward:{mood:2}}
    ]
  },
  {
    id:'qingyun_merchant',
    type:'奇遇',
    trigger:{random:0.12, scene:'qingyun'},
    title:'落魄商人',
    description:'一个衣衫褴褛的商人拉住你，说有一批见不得光的货要贱卖，他手中握着一枚泛着青光的玉佩。',
    choices:[
      {text:'出价买下', result:'花了80灵石，买下一枚护体玉佩', reward:{stones:-80, item:'huyu_pei'}},
      {text:'赶走他', result:'他小声骂了一句，消失在人群中', reward:{mood:-2}}
    ]
  },
  {
    id:'luoxia_light',
    type:'奇遇',
    trigger:{random:0.12, scene:'luoxia_forest'},
    title:'幽林异光',
    description:'林间深处忽然闪过一道青光，你循光而去，发现一株通体透明的灵草。',
    choices:[
      {text:'采下', result:'获得百年灵芝', reward:{item:'百年灵芝'}},
      {text:'守护等其成熟', result:'灵芝精华更足，但引来了妖兽', reward:{item:'千年灵芝', combat:true}}
    ]
  },
  {
    id:'luoxia_trap',
    type:'危机',
    trigger:{random:0.15, scene:'luoxia_forest'},
    title:'猎人的陷阱',
    description:'你一脚踩空，坠入一个覆盖着落叶的深坑，坑底有尖锐的木刺！',
    choices:[
      {text:'运灵力弹跳而出', result:'消耗灵力挣脱陷阱', reward:{qi:-20}},
      {text:'攀爬上去', result:'费了一番功夫爬出', reward:{hp:-15}}
    ]
  },
  {
    id:'luoxia_ancient_tree',
    type:'奇遇',
    trigger:{random:0.08, scene:'luoxia_forest', timePeriod:'昼'},
    title:'古树洞天',
    description:'一株遮天蔽日的古榕树，树干中空，隐约有灵光透出。',
    choices:[
      {text:'钻进树洞', result:'发现一窝灵蜂酿的灵蜜', reward:{item:'ling_mi'}},
      {text:'绕道而行', result:'不欲打扰此间生灵', reward:{mood:3}}
    ]
  },
  {
    id:'lingyun_cave',
    type:'奇遇',
    trigger:{random:0.12, scene:'lingyun_peak'},
    title:'云雾洞府',
    description:'灵云峰半山腰，云雾缭绕处有一个不起眼的洞口，内隐隐有风声低吟。',
    choices:[
      {text:'进入探索', result:'洞中发现记载功法的石壁', reward:{skillScroll:'jinqi'}},
      {text:'观望后离开', result:'此地灵气虽浓却暗藏凶险', reward:{mood:1}}
    ]
  },
  {
    id:'lingyun_gazing',
    type:'机缘',
    trigger:{random:0.1, scene:'lingyun_peak', timePeriod:'晨'},
    title:'观云悟道',
    description:'清晨的灵云峰，云海翻涌如万马奔腾，你望着云卷云舒，心有所感。',
    choices:[
      {text:'静心参悟', result:'悟性提升，修为精进', reward:{wisdom:3, cultivationPoints:80}},
      {text:'继续赶路', result:'美景虽好不可耽于安逸', reward:{}},
    ]
  },
  {
    id:'lingyun_rock',
    type:'危机',
    trigger:{random:0.12, scene:'lingyun_peak'},
    title:'山石崩落',
    description:'头顶忽然传来隆隆声，一块巨石脱离山体直直砸下！',
    choices:[
      {text:'侧身闪避', result:'你身法灵巧惊险避开', reward:{mood:-3}},
      {text:'以掌力击碎', result:'巨石碎裂，耗费不少气力', reward:{qi:-30, mood:2}}
    ]
  },
  {
    id:'lingyao_herb',
    type:'机缘',
    trigger:{random:0.15, scene:'lingyao_garden'},
    title:'灵草成熟',
    description:'药园深处一株灵草恰逢成熟，草尖凝着一滴晶莹剔透的灵露。',
    choices:[
      {text:'采摘灵草', result:'获得灵草一株', reward:{item:'百年灵芝'}},
      {text:'只取灵露', result:'灵露入口，丹田温热', reward:{qi:30, cultivationPoints:50}}
    ]
  },
  {
    id:'lingyao_gardener',
    type:'人际',
    trigger:{random:0.1, scene:'lingyao_garden', timePeriod:'昼'},
    title:'老药农',
    description:'一位佝偻着背的老者正在给灵草浇水，他抬头看了你一眼，露出慈祥的笑容。',
    choices:[
      {text:'请教药道', result:'老者赠你一本简易药经', reward:{skillScroll:'basic_heal'}},
      {text:'帮忙浇水', result:'老者喜笑颜开', reward:{mood:5, item:'hgc_grass'}}
    ]
  },
  {
    id:'heifeng_bandits',
    type:'危机',
    trigger:{random:0.25, scene:'heifeng_ridge'},
    title:'山贼伏击',
    description:'路边的草丛中忽然跃出几个手持刀兵的大汉，狞笑着将你围住！',
    choices:[
      {text:'拔剑迎战', result:'一场恶战', reward:{combat:true, loot:'灵石袋'}},
      {text:'施展身法遁走', result:'你身如轻烟消失在密林中', reward:{mood:-3}}
    ]
  },
  {
    id:'heifeng_flute',
    type:'奇遇',
    trigger:{random:0.08, scene:'heifeng_ridge', timePeriod:'夕'},
    title:'风中的笛声',
    description:'夕阳西下，黑风岭的山风中隐约传来一阵悠扬的笛声。一个白衣人背对而坐正在吹笛。',
    choices:[
      {text:'静听一曲', result:'笛声入耳，心境澄明', reward:{mood:10}},
      {text:'上前搭话', result:'白衣人微微一笑化风而去，留下一卷书简', reward:{skillScroll:'swift_step'}}
    ]
  },
  {
    id:'heifeng_night',
    type:'奇遇',
    trigger:{random:0.08, scene:'heifeng_ridge', timePeriod:'夜'},
    title:'夜行者',
    description:'夜色中一点火光在远处移动，一个独行的修士手持火把步履匆匆。',
    choices:[
      {text:'跟上他', result:'跟丢了，路边发现一个被遗落的包袱', reward:{stones:30, item:'poqi_dan'}},
      {text:'高声招呼', result:'修士回头看你一眼摇了摇头快步离去', reward:{mood:-1}}
    ]
  },
  {
    id:'duzhang_bubbles',
    type:'危机',
    trigger:{random:0.15, scene:'duzhang_swamp'},
    title:'毒沼气泡',
    description:'脚下一片泥沼开始剧烈冒泡，一股腥臭的绿色气体喷涌而出！',
    choices:[
      {text:'屏息疾退', result:'吸入少量毒气但无大碍', reward:{hp:-10}},
      {text:'灵力驱散毒雾', result:'消耗灵力驱散毒雾', reward:{qi:-25}}
    ]
  },
  {
    id:'duzhang_wisp',
    type:'奇遇',
    trigger:{random:0.1, scene:'duzhang_swamp', timePeriod:'夜'},
    title:'鬼火引路',
    description:'几点幽蓝色的鬼火在沼泽深处漂浮不定，像在引导你。',
    choices:[
      {text:'跟随鬼火', result:'鬼火引你到一株剧毒却珍贵的灵草前', reward:{item:'du_zhang_cao'}},
      {text:'远远避开', result:'在你转身时，鬼火悄然熄灭了', reward:{mood:1}}
    ]
  },
  {
    id:'well_echo',
    type:'奇遇',
    trigger:{random:0.15, scene:'ancient_well'},
    title:'井中回声',
    description:'幽深的井水中似乎有光芒一闪而过。',
    choices:[
      {text:'投石问路', result:'激起涟漪，井壁上刻着几个古字', reward:{wisdom:2}},
      {text:'以灵力探查', result:'灵力探入井中触碰到了什么', reward:{qi:-15, cultivationPoints:30}}
    ]
  },
  {
    id:'bibo_fish',
    type:'奇遇',
    trigger:{random:0.1, scene:'bibo_lake', timePeriod:'夜'},
    title:'月下怪鱼',
    description:'月光洒在碧波湖上，一条通体银白的大鱼跃出水面在空中划过一道弧线。',
    choices:[
      {text:'跳入湖中捕捉', result:'和怪鱼搏斗一番将其擒获', reward:{item:'yinlin_yu', hp:-10}},
      {text:'用灵力引诱', result:'怪鱼被你吸引缓缓游来', reward:{cultivationPoints:40}}
    ]
  },
  {
    id:'bibo_fisherman',
    type:'传闻',
    trigger:{random:0.2, scene:'bibo_lake'},
    title:'渔夫的故事',
    description:'一位老渔夫告诉你，昨夜湖心出现了奇异的光芒，像是水中有宝物出世。',
    choices:[
      {text:'去湖心一探究竟', result:'潜入湖底发现一处水下洞府', reward:{item:'水灵珠', qi:20}},
      {text:'将信将疑', result:'你摇摇头走开了', reward:{}},
    ]
  },
  {
    id:'well_passage_gate',
    type:'奇遇',
    trigger:{random:0.12, scene:'ancient_well_entrance'},
    title:'通道遗迹',
    description:'古井底部的通道壁上刻满了古老的符文，有些还在微微发光。',
    choices:[
      {text:'拓印符文', result:'符文蕴含阵法奥秘', reward:{wisdom:4}},
      {text:'注入灵力激活', result:'符文亮起又熄灭', reward:{qi:-20, cultivationPoints:50}}
    ]
  },
  {
    id:'underground_light',
    type:'机缘',
    trigger:{random:0.15, scene:'underground_river'},
    title:'暗河微光',
    description:'暗河的水面上漂着点点银光，散发出浓郁的灵气，是一些发光的藻类。',
    choices:[
      {text:'收集发光藻', result:'获得荧光藻可入药', reward:{item:'yingguang_zao'}},
      {text:'跳入暗河探寻源头', result:'浑身湿透，找到几枚灵石', reward:{stones:30}}
    ]
  },
  {
    id:'underground_spring',
    type:'机缘',
    trigger:{random:0.12, scene:'underground_river'},
    title:'灵泉涌动',
    description:'暗河旁的石缝中忽然涌出一股清澈的泉水，散发着浓郁的灵气！',
    choices:[
      {text:'沐浴灵泉', result:'灵气灌体，修为大进', reward:{cultivationPoints:200}},
      {text:'取水带走', result:'装了一壶灵泉水', reward:{item:'灵泉水'}}
    ]
  },
  {
    id:'nether_ruins_altar',
    type:'奇遇',
    trigger:{random:0.12, scene:'yy_huangquan_road'},
    title:'废墟祭坛',
    description:'坍塌的石柱中央，一个残破的祭坛上放着一枚黑色的令牌。',
    choices:[
      {text:'取走令牌', result:'令牌入手冰凉', reward:{item:'mingfu_ling'}},
      {text:'恭敬行礼', result:'祭坛震动，地面露出一枚丹药', reward:{item:'pojing_dan'}}
    ]
  },
  {
    id:'nether_ruins_ghost',
    type:'危机',
    trigger:{random:0.1, scene:'yy_huangquan_road', timePeriod:'夜'},
    title:'幽魂低语',
    description:'灰色的雾气弥漫，隐约有低语在耳边回荡，有东西在暗中注视着你。',
    choices:[
      {text:'厉声喝退', result:'雾气消散，消耗大量灵力', reward:{qi:-30}},
      {text:'静心诵念', result:'低语渐远，心境反而通明', reward:{mood:8, wisdom:2}}
    ]
  },
  {
    id:'ghost_cave_bones',
    type:'奇遇',
    trigger:{random:0.12, scene:'ghost_cave'},
    title:'骸骨遗物',
    description:'洞内角落靠着一具盘坐的骸骨，身前的石台上放着一卷用油布包裹的东西。',
    choices:[
      {text:'打开油布', result:'是一本残破的功法', reward:{skillScroll:'jinjue'}},
      {text:'将骸骨安葬', result:'骸骨化为灰烬，你感到一丝欣慰', reward:{mood:5}}
    ]
  },
  {
    id:'ghost_cave_bats',
    type:'危机',
    trigger:{random:0.15, scene:'ghost_cave'},
    title:'蝙蝠群惊',
    description:'你踏入深处惊动了头顶成千上万只蝙蝠，它们尖叫着向你扑来！',
    choices:[
      {text:'灵力护罩', result:'蝙蝠撞在灵力罩上纷纷弹开', reward:{qi:-20}},
      {text:'趴下不动', result:'蝙蝠群从头顶呼啸而过', reward:{mood:-3}}
    ]
  },
  {
    id:'nether_swamp_flower',
    type:'奇遇',
    trigger:{random:0.1, scene:'yy_huangquan_road'},
    title:'幽冥花',
    description:'黑色的沼泽水面上，一朵血红色的花朵独自绽放，散发着幽幽香气。',
    choices:[
      {text:'采摘', result:'幽冥花幽香入体，经脉通透', reward:{item:'youming_hua', cultivationPoints:100}},
      {text:'以灵力温养', result:'花朵开得更盛', reward:{qi:-20, mood:5}}
    ]
  },
  {
    id:'nether_palace_hide',
    type:'奇遇',
    trigger:{random:0.08, scene:'yy_baihu_hill'},
    title:'王座之下',
    description:'幽冥大殿中央的黑曜石王座下有一道极其细微的缝隙，若非仔细查看绝难发现。',
    choices:[
      {text:'撬开暗格', result:'获得一枚幽冥珠', reward:{item:'youming_zhu'}},
      {text:'端坐王座', result:'一股阴寒之力涌入身体', reward:{qiRealmBoost:2}}
    ]
  },
  {
    id:'nether_merchant',
    type:'神秘',
    trigger:{random:0.08, scene:'yy_baihu_hill', minLuck:1.0},
    title:'冥界商队',
    description:'一队披着黑斗篷的商人在幽冥大殿外扎营，为首之人向你招手——生人，可有好货？',
    choices:[
      {text:'交易灵石', result:'用50灵石换购一枚丹药', reward:{stones:-50, item:'pojing_dan'}},
      {text:'以物易物', result:'用材料换了一件冥器', reward:{item:'mingfu_ling', mood:-5}}
    ]
  },
  {
    id:'leiyin_tomb',
    type:'奇遇',
    trigger:{random:0.1, scene:'leiyin_temple'},
    title:'古佛密室',
    description:'你无意中触动了一块松动的地砖，露出一条幽暗的暗道，尽头是一间尘封的密室。',
    choices:[
      {text:'踏入密室', result:'发现一卷上古功法残篇', reward:{skillScroll:'sanmei'}},
      {text:'原地退回', result:'你感到一丝不安退出了暗道', reward:{mood:-2}}
    ]
  },
  {
    id:'leiyin_insight',
    type:'机缘',
    trigger:{random:0.08, scene:'leiyin_temple', timePeriod:'晨'},
    title:'晨钟开悟',
    description:'清晨的阳光穿透残破的穹顶洒在一尊残破的佛像上，佛像眉心有一点金色的光。',
    choices:[
      {text:'以额触光', result:'磅礴的信息涌入识海', reward:{wisdom:5, cultivationPoints:150}},
      {text:'恭敬三拜', result:'佛像微微震动，地面裂开一道缝', reward:{skillScroll:'sanmei'}}
    ]
  },
  {
    id:'xuantie_crystal',
    type:'机缘',
    trigger:{random:0.12, scene:'xuantie_mine'},
    title:'矿脉深处',
    description:'矿洞深处的壁上嵌着几块发光的晶体，是玄铁精粹！',
    choices:[
      {text:'开采', result:'费了九牛二虎之力挖下三块', reward:{item:'xuantie_jingcui'}},
      {text:'寻找更多', result:'深入挖掘发现一块更大的', reward:{item:'xuantie_jingcui', hp:-20}}
    ]
  },
  {
    id:'yumu_spirit',
    type:'奇遇',
    trigger:{random:0.1, scene:'yumu_forest', timePeriod:'夕'},
    title:'林中精魅',
    description:'夕阳穿过玉木林的枝叶洒下斑驳光影，一个半透明的身影在树间飘忽不定。',
    choices:[
      {text:'追上去', result:'身影化为一团灵光没入你的眉心', reward:{wisdom:4, mood:5}},
      {text:'驻足观看', result:'身影消散，留下一朵晶莹的花', reward:{item:'yumu_hua'}}
    ]
  },
  {
    id:'biguan_well',
    type:'机缘',
    trigger:{random:0.15, scene:'biguan_peak'},
    title:'峰顶灵眼',
    description:'闭关峰顶一个天然的凹坑中积聚着一汪清澈的水，是灵气液化而成的灵液！',
    choices:[
      {text:'饮下灵液', result:'灵液入腹丹田灼热', reward:{cultivationPoints:300, qiRealmBoost:1}},
      {text:'沐浴灵液', result:'浑身毛孔舒张', reward:{hpBonus:10, qiBonus:10}}
    ]
  },
  {
    id:'test_of_heart',
    type:'心境',
    trigger:{random:0.1, minRealm:'练气四层'},
    title:'心魔试炼',
    description:'修炼时忽然陷入幻境，你看到自己寿元耗尽一生未达大道，亲友逐个离去……',
    choices:[
      {text:'坦然面对破除幻象', result:'道心坚定修为反而精进', reward:{cultivationPoints:150, mood:15}},
      {text:'强行挣脱', result:'虽破幻境心神受损', reward:{mood:-8}}
    ]
  },
  {
    id:'wounded_swordsman',
    type:'人际',
    trigger:{random:0.08},
    title:'负剑之人',
    description:'路边有一位浑身是血的剑客倒在树下，手中仍紧紧握着一柄断剑。',
    choices:[
      {text:'施救', result:'你用灵力稳住他的心脉', reward:{npcFriend:'剑客柳云', skillScroll:'jinjue'}},
      {text:'搜身离去', result:'拿了东西就走', reward:{item:'破损的灵石', mood:-10}}
    ]
  },
  {
    id:'stray_cat',
    type:'偶遇',
    trigger:{random:0.18},
    title:'流浪猫',
    description:'路边一只浑身脏兮兮的小猫正舔着爪子，见你走近它歪着头看着你。',
    choices:[
      {text:'喂它点吃的', result:'小猫蹭了蹭你的手', reward:{mood:4}},
      {text:'抱起来带走', result:'小猫在你怀里打起了呼噜', reward:{mood:6}}
    ]
  },
  {
    id:'shooting_star',
    type:'机缘',
    trigger:{random:0.08, timePeriod:'夜'},
    title:'流星划过',
    description:'夜空中一颗流星划过天际，拖着长长的尾巴，你心中一动。',
    choices:[
      {text:'闭目许愿', result:'流星应愿，一缕星光落入体内', reward:{cultivationPoints:60, mood:3}},
      {text:'追寻落点', result:'追了很久什么也没找到', reward:{hp:-10}}
    ]
  },
  {
    id:'broken_shrine',
    type:'奇遇',
    trigger:{random:0.1},
    title:'残破神龛',
    description:'路边有一个快要坍塌的小神龛，里面供着一尊看不清面容的石像。',
    choices:[
      {text:'上香敬拜', result:'石像微微发光', reward:{mood:6, wisdom:2}},
      {text:'翻找贡品', result:'香炉底下压着一枚古钱', reward:{stones:15}}
    ]
  },
  {
    id:'fortune_teller',
    type:'奇遇',
    trigger:{random:0.07, maxLuck:1.2},
    title:'街头卜者',
    description:'一个戴着眼罩的算命先生拦住你——道友面相不凡但近日有一劫。',
    choices:[
      {text:'30灵石算一卦', result:'卦象揭示了一个秘密', reward:{stones:-30, cultivationPoints:120, wisdom:3}},
      {text:'不信这套', result:'算命先生叹了口气', reward:{mood:-2}}
    ]
  },
  {
    id:'locked_chest',
    type:'奇遇',
    trigger:{random:0.06},
    title:'路边的铁箱',
    description:'路边草丛里扔着一个满是泥土的铁箱，锁已经锈死了。',
    choices:[
      {text:'以力破锁', result:'铁锁崩断箱子打开', reward:{stones:40, item:'poqi_dan'}},
      {text:'灵力解锁', result:'灵力渗入锁孔咔哒一声', reward:{skillScroll:'basic_tuna', stones:20}}
    ]
  },
  {
    id:'wanderer_jade',
    type:'神秘',
    trigger:{random:0.04, wanderer:true},
    title:'游方道人问玉',
    description:'一个灰袍道人不知何时站在你面前，他手中托着一枚古玉，笑而不语。',
    choices:[
      {text:'以灵石交换', result:'花了100灵石买下古玉', reward:{stones:-100, item:'guyu_pei'}},
      {text:'以物易物', result:'用材料交换道人大悦', reward:{randomSkill:['灵级', '天级']}},
      {text:'婉拒', result:'道人微微一笑化烟而去', reward:{mood:2}}
    ]
  },
  {
    id:'wanderer_tea',
    type:'神秘',
    trigger:{random:0.03, minLuck:1.1, wanderer:true},
    title:'游方道人论道',
    description:'溪边的石桌上一个黑衣道人正在煮茶，他抬头看了你一眼，指了指对面的石凳。',
    choices:[
      {text:'坐下饮茶', result:'茶中蕴含大道之理', reward:{wisdom:3, cultivationPoints:100, mood:10}},
      {text:'请教修炼', result:'道人不答只在石桌上刻了一个字：破', reward:{skillScroll:'jinjue'}},
      {text:'戒备退开', result:'你总觉得不太对劲', reward:{mood:-2}}
    ]
  },
  {
    id:'wanderer_box',
    type:'神秘',
    trigger:{random:0.03, wanderer:true},
    title:'游方道人宝盒',
    description:'一个穿得花花绿绿的道人凑上来神秘兮兮地打开手中的盒子，里面什么都有，他说只卖30灵石。',
    choices:[
      {text:'买下宝盒', result:'打开一看……', reward:{mysteryBox:true}},
      {text:'劈手夺过', result:'道人哎哟一声盒子散开了', reward:{mysteryBox:true, mood:-5}},
      {text:'断然拒绝', result:'道人嘟囔着走开了', reward:{}},
    ]
  },
  {
    id:'wanderer_book',
    type:'神秘',
    trigger:{random:0.02, wanderer:true},
    title:'游方道人大道至简',
    description:'一个白发苍苍的赤脚道人坐在路边的石头上，膝上摊着一本无字的书。他见你路过将书推向你。',
    choices:[
      {text:'翻开书页', result:'书页空白但脑海中浮现无数文字', reward:{wisdom:6, skillScroll:'wuji_gong'}},
      {text:'合上书还给他', result:'道人眼中闪过一丝赞许', reward:{mood:8}}
    ]
  },
  {
    id:'found_box_forest',
    type:'神秘',
    trigger:{random:0.06, scene:'luoxia_forest'},
    title:'树下的木盒',
    description:'一棵大树的根部泥土中半埋着一个陈旧的小木盒，上面隐约有符文的痕迹。',
    choices:[
      {text:'打开盒子', result:'里面是……', reward:{mysteryBox:true}},
      {text:'用灵力探查', result:'灵力感应到无害', reward:{mysteryBox:true}}
    ]
  },
  {
    id:'found_box_market',
    type:'神秘',
    trigger:{random:0.06, scene:'qingyun'},
    title:'摊贩的旧物',
    description:'坊市角落里有个小摊堆满了各种旧物，一个小木盒混在其中无人问津。',
    choices:[
      {text:'花5灵石买下', result:'盒子到手', reward:{mysteryBox:true, stones:-5}},
      {text:'放下', result:'一堆破烂不值得', reward:{}},
    ]
  },
  {
    id:'found_box_ruins',
    type:'神秘',
    trigger:{random:0.08, scene:'yy_huangquan_road'},
    title:'残垣铁匣',
    description:'倒塌的石墙下露出一个锈迹斑斑的铁匣子，匣上的锁早已朽坏。',
    choices:[
      {text:'打开铁匣', result:'里面发出腐朽的气息', reward:{mysteryBox:true}},
      {text:'放弃', result:'冥界的东西别乱碰为好', reward:{}},
    ]
  },
  {
    id:'iron_rock',
    type:'奇遇',
    trigger:{random:0.1, maxBodyRealm:2},
    title:'试炼石',
    description:'一块通体乌黑的大石横在路中，表面布满了拳印掌痕。',
    choices:[
      {text:'全力一击', result:'石面留下浅浅痕迹，骨骼更强韧了', reward:{bodyCultPoints:80, hpBonus:5}},
      {text:'用身体撞上去', result:'痛但有用', reward:{bodyCultPoints:120, hp:-15}}
    ]
  },
  {
    id:'lotus_pool',
    type:'机缘',
    trigger:{random:0.05, minLuck:1.2},
    title:'莲池异象',
    description:'一片不起眼的水塘中开着一朵七色莲花，至少三百年以上的灵物！',
    choices:[
      {text:'摘取莲花', result:'莲花入手，满池灵气涌入体内', reward:{cultivationPoints:250, mood:15, item:'qise_lotus'}},
      {text:'守护至完全盛开', result:'完全绽放那一刻天降甘霖', reward:{qiRealmBoost:1, maxAge:10}}
    ]
  },
  {
    id:'hidden_cave',
    type:'奇遇',
    trigger:{random:0.04, minLuck:1.3},
    title:'隐洞宝藏',
    description:'你无意中发现了一道几乎和岩壁融为一体的石门，仿佛整个山体都在为你让路。',
    choices:[
      {text:'推门而入', result:'洞中灵光闪烁满室珍宝', reward:{stones:200, skillScroll:'jingxin_jue', item:'千年灵芝'}},
      {text:'取一件就离开', result:'贪多必失', reward:{skillScroll:'jingxin_jue'}}
    ]
  },
  {
    id:'insight_moment',
    type:'机缘',
    trigger:{random:0.07, minWisdom:70},
    title:'天机忽至',
    description:'天地间的灵气流动在你眼中清晰可见，日月星辰的运行轨迹在心中徐徐展开。',
    choices:[
      {text:'顺天机推演', result:'领悟了更高层的天道之理', reward:{skillScroll:'wuji_gong'}},
      {text:'记下感悟', result:'道行有了质的飞跃', reward:{wisdom:5, cultivationPoints:200}}
    ]
  },
  {
    id:'ancient_text',
    type:'奇遇',
    trigger:{random:0.08, minWisdom:60},
    title:'残碑古字',
    description:'路边斜躺着一块残破的古碑，字迹大部分已经模糊，只剩寥寥几字可辨。',
    choices:[
      {text:'潜心辨认', result:'从残字中推演出一套功法', reward:{skillScroll:'houtu'}},
      {text:'拓印带走', result:'虽然无法完全解读但保存下来总有好处', reward:{wisdom:3}}
    ]
  },
  {
    id:'rival_challenge',
    type:'危机',
    trigger:{random:0.06, minRealm:'练气三层'},
    title:'不速之客',
    description:'一个满脸倨傲的年轻修士挡住了你的去路——听说你有点本事？接我一招！',
    choices:[
      {text:'迎战', result:'一番交手你赢了', reward:{combat:true, stones:50}},
      {text:'以和为贵', result:'他哼了一声转身离去', reward:{}},
    ]
  },
  {
    id:'demon_remains',
    type:'奇遇',
    trigger:{random:0.07, minRealm:'练气二层'},
    title:'妖兽残骸',
    description:'一具庞大的妖兽骸骨横在荒野中，肋骨之间长满了青苔和藤蔓。',
    choices:[
      {text:'搜索骸骨', result:'发现一颗未完全消散的妖丹', reward:{item:'yao_dan'}},
      {text:'提炼精华', result:'提炼出一些骨髓精粹', reward:{item:'shougu', hpBonus:5}}
    ]
  },
  {
    id:'spring_rain',
    type:'机缘',
    trigger:{random:0.08, season:'春'},
    title:'春雨悟道',
    description:'春雨绵绵，天地间一片朦胧，你站在雨中感受着万物复苏的生机。',
    choices:[
      {text:'雨中打坐', result:'春雨灵气入体', reward:{cultivationPoints:80, mood:5}},
      {text:'收集春雨', result:'接了一壶春雨水', reward:{item:'chunyu_shui'}}
    ]
  },
  {
    id:'autumn_leaves',
    type:'机缘',
    trigger:{random:0.08, season:'秋'},
    title:'红叶题诗',
    description:'满山的红叶被风吹落，一片红叶落在你的肩头，叶上竟然有几行小字。',
    choices:[
      {text:'读叶上之字', result:'是某位前辈留下的感悟', reward:{wisdom:3, cultivationPoints:60}},
      {text:'收集红叶', result:'落叶中藏着一株赤精草', reward:{item:'百年灵芝'}}
    ]
  },
  {
    id:'boss_trophy',
    type:'机缘',
    trigger:{random:0.05, minLuck:0.8, bossKilled:true},
    title:'战利品异动',
    description:'你背包中的某个战利品忽然发热，像是与周围环境产生了共鸣。',
    choices:[
      {text:'取出查看', result:'战利品上浮现出隐藏的地图', reward:{item:'cangbao_tu'}},
      {text:'用灵力压制', result:'发热平息，但感觉错过了什么', reward:{mood:-3}}
    ]
  },
  {
    id:'two_gate',
    type:'奇遇',
    trigger:{random:0.06, maxRealm:'练气二层'},
    title:'两仪门试炼',
    description:'路旁的石壁上刻着两扇石门图案，一扇标着"力"，一扇标着"巧"。',
    choices:[
      {text:'推入力门', result:'石门震动，一块巨石滚落', reward:{bodyCultPoints:100, hp:-10}},
      {text:'推入巧门', result:'石门轻启，从中落下一枚玉佩', reward:{item:'huyu_pei'}}
    ]
  },
];

// ===== 场景探点与名胜（v10 新增） =====
// 每场景3-5个探点：小地名、风景、灵气说明、打坐倍率

// ==========================
// 场景探索战利品表
// ==========================
const SCENE_LOOT_TABLES = {
  'qingyun': [
    { itemId:'hgc_grass', chance:0.1, min:1, max:2 },
    { itemId:'yunqi_cao', chance:0.03, min:1, max:1 },
    { itemId:'shougu', chance:0.05, min:1, max:3 },
  ],
  'luoxia_forest': [
    { itemId:'hgc_grass', chance:0.3, min:1, max:3 },
    { itemId:'yunqi_cao', chance:0.08, min:1, max:1 },
    { itemId:'shougu', chance:0.2, min:1, max:2 },
    { itemId:'shepi', chance:0.1, min:1, max:1 },
    { itemId:'shoupi', chance:0.1, min:1, max:1 },
  ],
  'heifeng_ridge': [
    { itemId:'cuzhi_bingqi', chance:0.15, min:1, max:1 },
    { itemId:'shougu', chance:0.2, min:1, max:3 },
    { itemId:'hgc_grass', chance:0.15, min:1, max:2 },
    { itemId:'kuang_shi', chance:0.3, min:1, max:3 },
  ],
  'bibo_lake': [
    { itemId:'yunqi_cao', chance:0.06, min:1, max:1 },
    { itemId:'lingquan_shui', chance:0.2, min:1, max:2 },
    { itemId:'yinlin_yu', chance:0.15, min:1, max:2 },
    { itemId:'baihe_lily', chance:0.1, min:1, max:1 },
  ],
  'lingyun_peak': [
    { itemId:'xuelian', chance:0.2, min:1, max:2 },
    { itemId:'wudao_ye', chance:0.10, min:1, max:1 },
    { itemId:'juli_dan', chance:0.1, min:1, max:1 },
    { itemId:'hgc_grass', chance:0.25, min:1, max:3 },
  ],
  'lingyao_garden': [
    { itemId:'huojing_cao', chance:0.2, min:1, max:2 },
    { itemId:'tiegu_cao', chance:0.12, min:1, max:1 },
    { itemId:'xiangyun_cao', chance:0.06, min:1, max:1 },
    { itemId:'lingquan_shui', chance:0.2, min:1, max:2 },
    { itemId:'baihe_lily', chance:0.15, min:1, max:1 },
  ],
  'youming_grotto': [
    { itemId:'lingzu_cuijian', chance:0.3, min:1, max:3 },
    { itemId:'gufen', chance:0.2, min:1, max:2 },
    { itemId:'yuangi_jiejing', chance:0.1, min:1, max:1 },
  ],
  'underground_river': [
    { itemId:'lingquan_shui', chance:0.2, min:1, max:2 },
    { itemId:'gufen', chance:0.15, min:1, max:2 },
    { itemId:'xixi_linpian', chance:0.1, min:1, max:1 },
  ],
  'duzhang_swamp': [
    { itemId:'du_zhang_cao', chance:0.2, min:1, max:3 },
    { itemId:'tiegu_cao', chance:0.08, min:1, max:1 },
    { itemId:'dunang', chance:0.15, min:1, max:2 },
    { itemId:'shepi', chance:0.1, min:1, max:1 },
  ],
  'bingfeng_grotto': [
    { itemId:'longgu_zhu', chance:0.08, min:1, max:1 },
    { itemId:'xixi_linpian', chance:0.2, min:1, max:2 },
    { itemId:'xixin', chance:0.15, min:1, max:1 },
    { itemId:'lingzu_cuijian', chance:0.2, min:1, max:2 },
  ],
  'guji_ruins': [
    { itemId:'mingyun_hua', chance:0.04, min:1, max:1 },
    { itemId:'shenji_cao', chance:0.04, min:1, max:1 },
    { itemId:'lingzu_cuijian', chance:0.25, min:2, max:4 },
    { itemId:'xixin', chance:0.15, min:1, max:2 },
    { itemId:'yuangi_jiejing', chance:0.15, min:1, max:2 },
  ],
  'leiyin_temple': [
    { itemId:'shengu_cao', chance:0.05, min:1, max:1 },
    { itemId:'mingyun_hua', chance:0.03, min:1, max:1 },
    { itemId:'yuangi_jiejing', chance:0.2, min:1, max:2 },
    { itemId:'xixin', chance:0.1, min:1, max:1 },
    { itemId:'lingzu_cuijian', chance:0.2, min:2, max:3 },
  ],
  'xuantie_mine': [
    { itemId:'xuantie_jingcui', chance:0.25, min:1, max:2 },
    { itemId:'jingtie_kuang', chance:0.35, min:1, max:3 },
    { itemId:'kuang_shi', chance:0.5, min:2, max:5 },
    { itemId:'longgu_zhu', chance:0.06, min:1, max:1 },
    { itemId:'xixin', chance:0.15, min:1, max:1 },
  ],
  'yumu_forest': [
    { itemId:'tianxin_lian', chance:0.06, min:1, max:1 },
    { itemId:'lingmu', chance:0.2, min:1, max:2 },
    { itemId:'lingquan_shui', chance:0.2, min:1, max:2 },
    { itemId:'qiannian_lingzhi', chance:0.05, min:1, max:1 },
  ],
  'biguan_peak': [
    { itemId:'tongyuan_cao', chance:0.08, min:1, max:1 },
    { itemId:'qiannian_lingzhi', chance:0.15, min:1, max:2 },
    { itemId:'lingquan_shui', chance:0.2, min:2, max:3 },
  ],
  // ── 新场景 ──
  'qingyun_pier': [
    { itemId:'lingquan_shui', chance:0.2, min:1, max:2 },
    { itemId:'yinlin_yu', chance:0.15, min:1, max:2 },
    { itemId:'hgc_grass', chance:0.1, min:1, max:1 },
  ],
  'luori_plain': [
    { itemId:'shougu', chance:0.25, min:1, max:3 },
    { itemId:'hgc_grass', chance:0.2, min:1, max:2 },
    { itemId:'shoupi', chance:0.1, min:1, max:1 },
  ],
  'bamboo_grove': [
    { itemId:'hgc_grass', chance:0.2, min:1, max:3 },
    { itemId:'lingquan_shui', chance:0.15, min:1, max:2 },
    { itemId:'baihe_lily', chance:0.1, min:1, max:1 },
  ],
  'moon_valley': [
    { itemId:'tongyuan_cao', chance:0.06, min:1, max:1 },
    { itemId:'xuelian', chance:0.15, min:1, max:2 },
    { itemId:'lingquan_shui', chance:0.2, min:1, max:2 },
    { itemId:'baihe_lily', chance:0.15, min:1, max:1 },
  ],
  'stone_road': [
    { itemId:'cuzhi_bingqi', chance:0.1, min:1, max:1 },
    { itemId:'shougu', chance:0.2, min:1, max:3 },
    { itemId:'hgc_grass', chance:0.15, min:1, max:2 },
  ],

  // ── 🔧 体修场景探索（炼体丹药可刷）2026-08-03 ──
  'xuantie_mine': [
    { itemId:'kuang_shi', chance:0.3, min:1, max:3 },
    { itemId:'xuantie_jingcui', chance:0.08, min:1, max:1 },
    { itemId:'duanti_dan', chance:0.12, min:1, max:1 },
    { itemId:'tongpi_dan', chance:0.05, min:1, max:1 },
  ],
  'bingfeng_grotto': [
    { itemId:'bingjing', chance:0.2, min:1, max:3 },
    { itemId:'xuelian', chance:0.1, min:1, max:1 },
    { itemId:'duanti_dan', chance:0.12, min:1, max:1 },
    { itemId:'tongpi_dan', chance:0.06, min:1, max:1 },
  ],
  'youming_grotto': [
    { itemId:'lingzu_cuijian', chance:0.3, min:1, max:3 },
    { itemId:'duanti_dan', chance:0.1, min:1, max:1 },
    { itemId:'poqi_dan', chance:0.08, min:1, max:1 },
  ],
  'zz_yaoshou_ridge': [
    { itemId:'yaodan_he', chance:0.25, min:1, max:2 },
    { itemId:'shoupi', chance:0.2, min:1, max:3 },
    { itemId:'tongpi_dan', chance:0.08, min:1, max:1 },
    { itemId:'tiegu_dan', chance:0.04, min:1, max:1 },
  ],
  'zz_lingmai_ruins': [
    { itemId:'lingmai_jing', chance:0.25, min:1, max:3 },
    { itemId:'zhushen_sui', chance:0.06, min:1, max:1 },
    { itemId:'tiegu_dan', chance:0.08, min:1, max:1 },
    { itemId:'yinxiue_dan', chance:0.04, min:1, max:1 },
  ],
  'ty_leichi': [
    { itemId:'leichi_jingtie', chance:0.25, min:1, max:2 },
    { itemId:'leijiao_long', chance:0.1, min:1, max:1 },
    { itemId:'yinxiue_dan', chance:0.08, min:1, max:1 },
    { itemId:'jinshen_dan', chance:0.04, min:1, max:1 },
  ],
};

// ===== 任务系统 v2 (扩展版) =====
const QUEST_DB = [

  // ===== 青云镇任务链（旧版） =====
  // 任务1：采药任务
  {
    id:'herb_gathering',
    name:'采药初试',
    type:'收集',
    giver:'药店掌柜',
    scene:'qingyun',
    desc:'帮药店掌柜采集10份黄精草。',
    giverLine:'年轻人，帮我到镇外采些黄精草回来，我正缺药材。不过外面有野兽出没，小心些。',
    npcHint:'一个留着小胡须的掌柜在柜台后打量着来往客人。',
    requirements: { items:[{id:'hgc_grass', qty:10}] },
    rewards: { stones:30, exp:50, items:[{id:'huiqi_dan', qty:2}], mood:5 },
    chain:'heifeng_quest',
    completeText:'掌柜接过药材，满意地点了点头，顺手塞给你两枚回气丹。',
    showInList: true
  },
  
  // 任务2：黑风岭除患（链任务）
  {
    id:'heifeng_quest',
    name:'黑风除患',
    type:'讨伐',
    giver:'药店掌柜',
    scene:'qingyun',
    desc:'药材被黑风岭的山贼抢走了，去夺回来！',
    prerequisite:'herb_gathering',
    giverLine:'什么？药被那些山贼劫了？！那些天杀的……年轻人，你能不能帮我夺回来？',
    npcHint:'掌柜面带忧色。',
    requirements: { items:[{id:'hgc_grass', qty:5}], kills:[{monster:'黑风山贼', qty:3}] },
    rewards: { stones:50, exp:80, items:[{id:'poqi_dan', qty:1}], mood:5 },
    chain:'guzhao_quest',
    completeText:'你背着一袋药材回来，掌柜给你煮了一壶热茶，又将珍藏的一枚破气丹塞给你。',
    showInList: true
  },
  
  // 任务3：古刹探秘（链任务）
  {
    id:'guzhao_quest',
    name:'古刹探秘',
    type:'探索',
    giver:'药店掌柜',
    scene:'qingyun',
    desc:'掌柜说古刹废墟中有一味失传的药方，里面有解毒秘药。',
    prerequisite:'heifeng_quest',
    giverLine:'我听说啊，落霞森林那边有座废弃的古刹，里面藏着上古丹方。你要有胆量帮我找找？',
    npcHint:'掌柜压低声音。',
    requirements: { kills:[{monster:'野狼', qty:3}], explore:'luoxia_forest' },
    rewards: { stones:80, exp:120, items:[{id:'baihe_lily', qty:2}], mood:5 },
    chain:'ruins_explore',
    completeText:'你在古刹残垣中找到了一卷泛黄的丹方，不过你自己也留了一份抄本。',
    showInList: true,
  },
  
  // 任务4：遗迹探索（链任务）
  {
    id:'ruins_explore',
    name:'遗迹探索',
    type:'探索',
    giver:'自动触发',
    hidden:true,
    autoTrigger:'enterScene',
    triggerScene:'guji_ruins',
    desc:'你手中的古卷指引你来到了远古遗迹，这里藏着更大的秘密。',
    prerequisite:'guzhao_quest',
    triggerText:'当你踏入遗迹的瞬间，古卷微微发光。看来这里确实藏着什么……',
    requirements: { kills:[{monster:'石像守卫', qty:3}], explore:'guji_ruins' },
    rewards: { stones:150, items:[{id:'xuanhu_fu', qty:1}], mood:10, exp:300 },
    worldStateChange: { heifeng_explored: true } },

// ===== 地图贯穿任务链（v9 新增） =====

  {
    id:'main_lv1',
    name:'灵云奇缘',
    type:'剧情',
    giver:'镇长老',
    scene:'qingyun',
    desc:'镇长老说灵云峰近来有仙人足迹，托你上山一探。',
    requirements:{
      explore:'lingyun_peak'
    },
    rewards:{
      stones:60,
      exp:100,
      items:[{
        id:'huiqi_dan',
        qty:3
      }],
      mood:5
    },
    giverLine:'你来得正好。灵云峰那边，有人说看到了异光。老朽腿脚不便，想托你走一趟。',
    chain:'main_lv2',
    completeText:'灵云峰云雾缭绕，你并未找到仙人足迹，却在山顶发现了一枚刻着古老文字的玉佩。',
    showInList:true,
  },
  {
    id:'main_lv2',
    name:'密林追踪',
    type:'剧情',
    giver:'镇长老',
    scene:'qingyun',
    desc:'玉佩上有地图指向落霞森林深处，那里似乎藏着什么。',
    requirements:{
      items:[{
        id:'hgc_grass',
        qty:5
      }],
      kills:[{
        monster:'野狼',
        qty:3
      }],
      explore:'luoxia_forest'
    },
    rewards:{
      stones:100,
      exp:200,
      skillScroll:'jinqi',
      mood:8
    },
    prerequisite:'main_lv1',
    giverLine:'这花纹……老朽从未见过。不过这个方向，像是落霞森林的深处。年轻人，去看看？',
    chain:'main_lv3',
    completeText:'在落霞森林深处，你发现了一座被藤蔓掩盖的古碑——碑文记录着通往幽冥之门的线索。',
    showInList:true,
  },
  {
    id:'main_lv3',
    name:'通幽三关',
    type:'讨伐',
    giver:'自动触发',
    scene:null,
    desc:'幽界入口被三道封印锁住：黑风岭头目、毒瘴沼泽的幽兰草、碧波湖的水灵珠。',
    requirements:{
      kills:[{
        monster:'山贼头目',
        qty:1
      }],
      items:[{
        id:'du_zhang_cao',
        qty:1
      }],
      explore:'bibo_lake'
    },
    rewards:{
      stones:200,
      exp:300,
      items:[{
        id:'podi_dan',
        qty:1
      },
      {
        id:'mingfu_ling',
        qty:1
      }],
      mood:10
    },
    autoTrigger:'enterScene',
    triggerScene:'heifeng_ridge',
    prerequisite:'main_lv2',
    triggerText:'你按照碑文指引，来到黑风岭。空气中弥漫着一股不祥的气息——封印的第一道门就在这里。',
    chain:'main_lv4',
    completeText:'三道封印逐一解开，古井深处传出了幽深的回响——幽冥之门，开了。',
  },
  {
    id:'main_lv4',
    name:'幽冥探秘',
    type:'剧情',
    giver:null,
    scene:null,
    desc:'踏入幽冥界后，你发现冥府遗迹中有一面轮回镜，映照出前所未有的景象。',
    giverLine:'（踏入幽冥界的那一刻，你感到一股彻骨的寒意。黄泉路的尽头，冥府遗迹深处，似乎有什么在呼唤你……）',
    npcHint:'幽冥界的天空中，飘着几点幽绿色的鬼火。',
    requirements:{
      kills:[{
        monster:'幽魂',
        qty:5
      }],
      explore:'yy_huangquan_road'
    },
    rewards:{
      stones:300,
      exp:500,
      items:[{
        id:'podi_dan',
        qty:2
      }],
      mood:15
    },
    autoTrigger:'enterScene',
    triggerScene:'ancient_well_entrance',
    prerequisite:'main_lv3',
    triggerText:'古井底部的通道通向一片幽暗的世界——阴风呼啸，冥火飘摇。你踏入了幽冥界。',
    chain:'main_lv5',
    worldStateChange:{
      nether_opened:true
    },
    completeText:'轮回镜中，你看到了前世的一角——你曾在此界修行，留下了一件法宝。',
  },
  {
    id:'main_lv5',
    name:'冥王旧部',
    type:'讨伐',
    giver:null,
    scene:null,
    desc:'幽冥大殿深处有一个沉睡的冥王旧部——击败它，获取通往通天的钥匙。',
    requirements:{
      kills:[{
        monster:'阴灵守卫',
        qty:1
      }],
      explore:'yy_baihu_hill'
    },
    rewards:{
      stones:500,
      exp:800,
      skillScroll:'wuji_gong',
      mood:20,
      questKey:'tongtian_key'
    },
    autoTrigger:'enterScene',
    triggerScene:'yy_baihu_hill',
    prerequisite:'main_lv4',
    triggerText:'幽冥大殿的黑曜石王座上，坐着一个披着黑袍的身影。它缓缓抬起头——又有人来了……',
    chain:'main_lv6',
    worldStateChange:{
      nether_cleared:true
    },
    completeText:'黑袍化为黑烟散去，王座下方升起一扇光门——通向通天路的大门终于开启。',
  },
  {
    id:'main_lv6',
    name:'通天问心',
    type:'剧情',
    giver:null,
    scene:null,
    desc:'你的修为已达练气七层，通天路各关已向你敞开。前往闭关峰，接受最终试炼。',
    giverLine:'（当你的修为突破练气七层，天地间忽然响起一声钟鸣。通天路上，一道古老的声音在你心间回荡：来吧，接受最终的试炼。）',
    npcHint:'闭关峰的禁制，在你面前缓缓散开。',
    requirements:{
      explore:'biguan_peak',
      kills:[{
        monster:'岩浆蜥蜴',
        qty:3
      }]
    },
    rewards:{
      stones:1000,
      exp:2000,
      skillScroll:'taiyi_jue',
      mood:30,
      items:[{
        id:'qiannian_lingzhi',
        qty:3
      }]
    },
    autoTrigger:'realmBreak',
    triggerRealm:6,
    prerequisite:'main_lv5',
    triggerText:'突破的那一刻，天地变色。你感应到通天路的尽头有某种呼唤——像是你前世遗留的力量。',
    completeText:'闭关峰顶，你面对了自己的心魔。一切执念化为虚无，你终于明白了修行的真谛——唯我独仙。',
  },
  {
    id:'lingyun_herb',
    name:'灵峰采药',
    type:'收集',
    giver:'药农老张',
    scene:'lingyun_peak',
    desc:'灵云峰上的雪莲子熟了，帮我采4朵回来。',
    requirements:{
      items:[{
        id:'xuelian',
        qty:4
      }]
    },
    rewards:{
      stones:80,
      exp:120,
      items:[{
        id:'juli_dan',
        qty:2
      }],
      mood:6
    },
    giverLine:'道友来得正好！灵云峰断崖上的雪莲开了，我一个老头子爬不上去了……帮忙采几朵可好？',
    npcHint:'一个背着药篓的老人在山路上歇脚。',
    completeText:'药农老张喜笑颜开，挑了一朵最好的雪莲塞给你：这朵你留着。',
    repeatable:true,
    showInList:true,
  },
  {
    id:'heifeng_hunter',
    name:'妖兽祸乱',
    type:'讨伐',
    giver:'猎户赵三',
    scene:'heifeng_ridge',
    desc:'最近黑风岭的野狼群异常暴躁，清剿8头野狼。',
    requirements:{
      kills:[{
        monster:'野狼',
        qty:8
      }]
    },
    rewards:{
      stones:100,
      exp:180,
      items:[{
        id:'huiti_dan',
        qty:2
      }],
      mood:8
    },
    giverLine:'小哥你可算来了！最近不知道怎么回事，那些狼崽子跟疯了一样。你帮我剿一剿，这片归你！',
    npcHint:'一个背着弓箭的精壮汉子警觉地看着四周。',
    completeText:'猎户赵三拍了拍你的肩膀：好本事！这下能消停一阵了。',
    repeatable:true,
    showInList:true,
  },
  {
    id:'duzhang_herb',
    name:'沼泽采药',
    type:'收集',
    giver:'采药人老陈',
    scene:'duzhang_swamp',
    desc:'毒瘴沼泽中有一种独特的毒瘴草，是炼制破瘴丹的关键。采3株回来。',
    requirements:{
      items:[{
        id:'du_zhang_cao',
        qty:3
      }]
    },
    rewards:{
      stones:120,
      exp:150,
      items:[{
        id:'podi_dan',
        qty:1
      }],
      mood:6
    },
    giverLine:'咳咳……毒瘴沼泽深处的毒瘴草，我已经盯着好久了。但我这老肺扛不住那边的毒气，你帮我跑一趟？',
    npcHint:'一个戴面罩的老者在沼泽边缘徘徊。',
    completeText:'老陈接过毒瘴草，小心翼翼地封入玉盒：好！这趟辛苦你了。',
    repeatable:true,
    showInList:true,
  },
  {
    id:'bibo_fish',
    name:'碧波垂钓',
    type:'收集',
    giver:'渔夫老李',
    scene:'bibo_lake',
    desc:'碧波湖最近有一种银鳞鱼出没，肉质蕴含灵气。钓3条回来。',
    requirements:{
      items:[{
        id:'yinlin_yu',
        qty:3
      }]
    },
    rewards:{
      stones:50,
      exp:80,
      items:[{
        id:'baihe_lily',
        qty:1
      }],
      mood:5
    },
    giverLine:'哈哈，来得正好！湖里最近银鳞鱼群来了，我这条破船一个人忙不过来。一起？',
    npcHint:'一个戴着斗笠的渔翁坐在船头。',
    completeText:'渔夫老李哈哈大笑：够吃好几天的了！来来，分你一条！',
    repeatable:true,
    showInList:true,
  },
  {
    id:'lingyao_guard',
    name:'药园守护',
    type:'讨伐',
    giver:'守园老人',
    scene:'lingyao_garden',
    desc:'灵药园最近遭妖兽侵扰，帮守园老人驱赶3只妖兽。',
    requirements:{
      kills:[{
        monster:'野狼',
        qty:3
      }]
    },
    rewards:{
      stones:60,
      exp:100,
      items:[{
        id:'lingquan_shui',
        qty:2
      }],
      mood:6
    },
    giverLine:'唉，那些畜生又来糟蹋我的灵药了。你帮我赶走它们，老头子我在旁边给你鼓劲！',
    npcHint:'一位白发苍苍的老人拄着拐杖站在药园门口。',
    completeText:'守园老人松了一口气：多谢小友，不然我这一季的收成就毁了。',
    repeatable:true,
    showInList:true,
  },
  {
    id:'ghost_cave_explore',
    name:'鬼窟秘宝',
    type:'探索',
    giver:'神秘声音',
    scene:'ghost_cave',
    desc:'鬼窟洞穴深处有一件冥器，据说是千年前一位冥界使者的遗物。',
    requirements:{
      kills:[{
        monster:'幽魂',
        qty:3
      }],
      explore:'ghost_cave'
    },
    rewards:{
      stones:200,
      exp:300,
      items:[{
        id:'podi_dan',
        qty:1
      }],
      mood:10
    },
    giverLine:'一阵飘忽的声音：活人……你来了……这座洞里有一件我守护千年的东西……你把它带走，我就能安息了……',
    npcHint:'洞窟深处隐约有一点幽光。',
    completeText:'鬼窟洞穴的尽头，你在一座石龛中找到了一枚泛着幽光的黑色戒指——冥戒。',
  },
  {
    id:'leiyin_trial',
    name:'雷音试炼',
    type:'讨伐',
    giver:'古佛残影',
    scene:'leiyin_temple',
    desc:'雷音古刹的佛门试炼，击退3波怨灵的侵袭。',
    requirements:{
      kills:[{
        monster:'怨灵',
        qty:3
      }],
      explore:'leiyin_temple'
    },
    rewards:{
      stones:300,
      exp:500,
      skillScroll:'chilong_body',
      mood:15
    },
    giverLine:'一个半透明的僧人身影在佛像前合十：施主……能走到这里，便是与佛有缘。这雷音古刹的试炼，你可敢闯一闯？',
    completeText:'僧人身影渐渐消散：善哉……雷音传承，终有传人。一枚金色的舍利落入你的掌心。',
    showInList:true,
  },
  {
    id:'xuantie_ore',
    name:'玄铁之物',
    type:'收集',
    giver:'铁匠老吴',
    scene:'qingyun',
    desc:'铁匠老吴听说玄铁矿洞里有上好的玄铁精粹，让你去挖2块回来。',
    requirements:{
      items:[{
        id:'xuantie_jingcui',
        qty:2
      }]
    },
    rewards:{
      stones:300,
      exp:400,
      skillScroll:'golden_bell',
      mood:12
    },
    giverLine:'小子！你上次干得不错。我听说通天路那边的玄铁矿洞有上好的玄铁精粹——给你这个镐头。',
    npcHint:'铁匠老吴敲打着铁砧，抬头看见你，眼睛一亮。',
    completeText:'铁匠老吴掂了掂玄铁精粹：好材料！够我打一柄好剑了。少不了你的好处！',
    showInList:true,
  },
  {
    id:'yumu_heart',
    name:'玉木之心',
    type:'探索',
    giver:'林间精灵',
    scene:'yumu_forest',
    desc:'玉木灵林的最深处有一株万年玉木，玉木之心是炼制顶级法器的材料。',
    requirements:{
      kills:[{
        monster:'幽魂',
        qty:2
      }],
      items:[{
        id:'lingquan_shui',
        qty:3
      }],
      explore:'yumu_forest'
    },
    rewards:{
      stones:400,
      exp:600,
      items:[{
        id:'qiannian_lingzhi',
        qty:2
      }],
      mood:20,
      questKey:'yumu_pass'
    },
    giverLine:'一个巴掌大小的光团在你面前飞舞：你是第一个走到这里的人……玉木之心在等一个有缘人。',
    completeText:'玉木灵林的深处，一株通体晶莹的玉木在月光下微微发光。你的手触碰到树干的瞬间，一股清凉的力量涌入全身……',
    showInList:true,
  },
  {
    id:'nether_mystery',
    name:'幽冥迷踪',
    type:'剧情',
    giver:null,
    scene:null,
    desc:'第十五天，幽冥界发生异动。古老的力量在苏醒。',
    giverLine:'（你踏入幽冥界的第十五天，黄泉路上忽然卷起阴风。忘川河水翻涌，轮回镜剧烈震颤——古老的力量，正在苏醒。）',
    npcHint:'幽冥界的天空，被一层诡异的血色笼罩。',
    requirements:{
      explore:'yy_huangquan_road',
      kills:[{
        monster:'幽魂',
        qty:3
      }]
    },
    rewards:{
      stones:200,
      exp:400,
      skillScroll:'qinglian',
      mood:10
    },
    autoTrigger:'timePass',
    triggerDay:15,
    prerequisite:'main_lv4',
    triggerText:'第十五天的夜里，幽冥界深处传来一声低沉的轰鸣。大地颤抖，一道幽光从幽冥沼泥中冲天而起。',
    completeText:'幽冥沼泽的深处，一株千年的幽冥莲正在绽放。莲心中，藏着一卷古老的功法……',
    worldStateChange:{
      nether_mystery_solved:true
    },
  },
  {
    id:'swamp_medicine',
    name:'瘴毒解药',
    type:'收集',
    giver:'采药人老陈',
    scene:'duzhang_swamp',
    desc:'老陈被毒瘴伤到了，需要灵药园的火精草来解毒。',
    requirements:{
      items:[{
        id:'huojing_cao',
        qty:2
      }],
      explore:'lingyao_garden'
    },
    rewards:{
      stones:100,
      exp:150,
      items:[{
        id:'baihe_lily',
        qty:2
      }],
      mood:10
    },
    prerequisite:'duzhang_herb',
    giverLine:'咳咳……我上次吸了太多瘴气，恐怕撑不住了。帮我到灵药园找两株火精草来，那东西能驱瘴毒……',
    chain:'swamp_medicine_return',
    showInList:true,
    completeText:'你从灵药园带回火精草，老陈感激涕零。',
  },
  {
    id:'swamp_medicine_return',
    name:'瘴毒清除',
    type:'剧情',
    giver:'采药人老陈',
    scene:'duzhang_swamp',
    desc:'老陈服下解药后康复了，为了感谢你，他告诉你一个秘密。',
    requirements:{
      items:[{
        id:'huojing_cao',
        qty:1
      }]
    },
    rewards:{
      stones:150,
      exp:200,
      items:[{
        id:'duanti_dan',
        qty:1
      }],
      mood:10,
      questKey:'bibo_lake_key'
    },
    prerequisite:'swamp_medicine',
    giverLine:'你啊，是个好人。沼泽那边住着一个老疯子，他说他知道地底暗河的入口……',
    completeText:'老陈指了指沼泽深处的方向：一直往西，看到三棵枯树就到暗河入口了。',
    chain:null,
    showInList:true,
  }
,


  {
    id:'domain_nanji',
    name:'初探南极',
    type:'引导',
    giver:'自动',
    scene:null,
    desc:'修为渐长，你感应到南极域·十万大山的召唤。巫蛊之术盛行之地，藏着上古蛮荒的秘密。',
    requirements:{ explore:'duzhang_swamp' },
    rewards:{ stones:80, exp:150, items:[{id:'juli_dan',qty:2}], mood:5 },
    autoTrigger:'realmBreak',
    triggerRealm:3,
    triggerText:'修为提升后，你的感知范围扩大了。苍茫天地间，你隐约感应到南方的十万大山——那里有远古巫族的气息，毒瘴弥漫，妖兽横行。南极域的大门已向你敞开。',
    completeText:'踏入南极域·毒瘴沼泽的那一刻，腐木与湿润的泥土气息扑面而来。远古蛮荒的力量在你血脉中隐隐共鸣。',
    showInList:true,
  },
  {
    id:'domain_youyu',
    name:'幽域引路',
    type:'引导',
    giver:'自动',
    scene:null,
    desc:'幽冥门开，幽域的阴气从地下渗出。亡者峡谷中残魂游荡，黄泉路上彼岸花开——生与死的边界，等待探索。',
    requirements:{ explore:'youming_grotto' },
    rewards:{ stones:80, exp:150, items:[{id:'podi_dan',qty:1}], mood:5 },
    autoTrigger:'realmBreak',
    triggerRealm:3,
    triggerText:'阴风拂面，你感到脚底的大地在微微震颤——幽域的方向传来一阵若有若无的悲鸣。那片生死交织之地，以你现在的修为可以一探了。',
    completeText:'你穿过古井，踏上幽域的土地。阴气如实质般缠绕在四周，彼岸花在道路两旁无声绽放。',
    showInList:true,
  },
  {
    id:'domain_ximo',
    name:'西漠古道',
    type:'引导',
    giver:'自动',
    scene:null,
    desc:'西漠域的黄沙下埋藏着上古佛国的遗迹。流沙海中有古城，玉门关外是天涯。',
    requirements:{ explore:'guji_ruins' },
    rewards:{ stones:120, exp:200, items:[{id:'podi_dan',qty:2}], mood:8 },
    autoTrigger:'realmBreak',
    triggerRealm:5,
    triggerText:'西域的方向传来一阵苍凉的钟鸣——那是风沙吹过佛国废墟的声音。以你现在的修为，可以穿越流沙海，一探西漠域的佛门遗迹了。',
    completeText:'远古遗迹的残阳如血，沙粒在风中发出低吟。你辨认出断壁上的梵文——一切有为法，如梦幻泡影。',
    showInList:true,
  },
  {
    id:'domain_donghai',
    name:'东海寻仙',
    type:'引导',
    giver:'自动',
    scene:null,
    desc:'东海域的万岛仙海召唤着你的探索。蓬莱、方丈、瀛洲——海外三仙山的传说，或许并非虚言。',
    requirements:{ explore:'yumu_forest' },
    rewards:{ stones:150, exp:250, items:[{id:'juli_dan',qty:3}], mood:8 },
    autoTrigger:'realmBreak',
    triggerRealm:6,
    triggerText:'远处海平线上出现了一座若隐若现的岛屿——那是东海蓬莱的蜃楼幻影。传说海外有仙山，山中藏有不老泉。你的修为已足以横渡东海了。',
    completeText:'玉木林的树木通体温润如脂，空气中弥漫着一股奇异的清香。你碰了碰树干，古木竟然轻轻摇曳了一下——似乎有灵。',
    showInList:true,
  },
  {
    id:'domain_beiji',
    name:'北境冰原',
    type:'引导',
    giver:'自动',
    scene:null,
    desc:'北极域寒风刺骨，万里冰封。冰原之下埋藏着太古时期的秘密，雪神殿中冰之大道的传承在等待有缘人。',
    requirements:{ explore:'bingfeng_grotto' },
    rewards:{ stones:200, exp:300, items:[{id:'podi_dan',qty:3}], mood:10 },
    autoTrigger:'realmBreak',
    triggerRealm:7,
    triggerText:'千年玄冰的气息伴随北方飘来的极光，在你体内化为一缕寒意。北极域的冰原，已经开始接纳你了。',
    completeText:'冰风石窟中，晶莹的冰壁折射着幽蓝微光。你用指尖碰触冰面，一幅远古的冰封画卷在眼前展开——那是万年前的天地。',
    showInList:true,
  },
  {
    id:'domain_zhongzhou',
    name:'中州问道',
    type:'引导',
    giver:'自动',
    scene:null,
    desc:'中州域——九域之心，天下修士向往之地。天机城雄踞中央，万宝楼内珍宝无数，太虚山上壁刻有大道真意。',
    requirements:{ explore:'leiyin_temple' },
    rewards:{ stones:300, exp:500, items:[{id:'zhuji_dan',qty:1},{id:'juli_dan',qty:5}], mood:15 },
    autoTrigger:'realmBreak',
    triggerRealm:9,
    triggerText:'筑基之后，你的神识敏锐了数倍。天地之间仿佛有一条无形的线——中州域的天机城就在那条线的交汇处。那里，才是真正的天下。',
    completeText:'雷音古刹的断壁残垣间，隐约能感受到当年佛门的盛景。中州大地的灵脉气息让每一次呼吸都变得轻盈。',
    showInList:true,
  },
  {
    id:'domain_tianyu',
    name:'天域登天',
    type:'引导',
    giver:'自动',
    scene:null,
    desc:'天域——浮空仙境，通天路的门户。云霄白玉宫悬于九天之上，雷池中有渡劫之秘。金丹期以上方能窥其全貌。',
    requirements:{ explore:'biguan_peak' },
    rewards:{ stones:500, exp:1000, items:[{id:'zhuji_dan',qty:2}], mood:20, skillScroll:'yunjue' },
    autoTrigger:'realmBreak',
    triggerRealm:10,
    triggerText:'筑基中阶的修为让天地在你眼中变得不同。抬起头，云层之上悬浮着一片陆地——天域！你终于有资格踏入那片传说中的浮空仙境了。',
    completeText:'悬浮峰上的风带着丝丝缕缕的灵气，站在山崖边俯瞰大地，世间万物尽收眼底。天域之巅，可通天路。',
    showInList:true,
  },
  {
    id:'domain_xuwu',
    name:'虚无尽头',
    type:'引导',
    giver:'自动',
    scene:null,
    desc:'虚无域——玄黄大陆的边缘，空间裂痕密布。混沌海中混沌之气翻涌，归墟是万物的终点与起点。非大乘不足以踏足。',
    requirements:{ explore:'gate_nether_divine' },
    rewards:{ stones:2000, exp:5000, items:[{id:'dacheng_dan',qty:1}], mood:50 },
    autoTrigger:'realmBreak',
    triggerRealm:20,
    triggerText:'大乘之境，一念通天。世界在你眼中再无秘密——虚无域的方向，混沌之气如潮水般涌动。世界的尽头，藏着最初的答案。',
    completeText:'你站在空间裂缝的边缘，俯瞰着混沌翻涌的虚空。归墟的深渊凝视着你，而你不再畏惧——因为你已经看清了自己的道。',
    showInList:true,
  },

  // ═══ 筑基期引导：中州问道（新）═══
  {
    id:'domain_zhongzhou_new',
    name:'中州问道·天机城',
    type:'引导',
    giver:'自动',
    scene:null,
    desc:'筑基之后，天下之大始见真容。中州域天机城雄踞九域之心，妖兽山脉与灵脉遗迹中藏着筑基修士的机缘。神识初成的你，该去中州闯一闯了。',
    requirements:{ explore:'zz_tianji_city' },
    rewards:{ stones:400, exp:800, items:[{id:'zhushen_dan',qty:1},{id:'lingmai_jing',qty:5}], mood:15 },
    autoTrigger:'realmBreak',
    triggerRealm:9,
    triggerText:'筑基初成，灵识凝聚。天地之间仿佛有一条无形的线——中州域的天机城就在那条线的交汇处。那里，才是真正的天下。',
    completeText:'你站在天机城巍峨的城墙下，仰望九层万宝楼直插云霄。坊市间法宝灵光流转，这才是筑基修士该来的地方。',
    showInList:true,
  },

  // ═══ 金丹期引导：天域问道 ═══
  {
    id:'domain_tianyu_new',
    name:'天域问道·云霄白玉宫',
    type:'引导',
    giver:'自动',
    scene:null,
    desc:'金丹一成，法宝自生。天域云霄白玉宫悬浮于九天之上，雷池紫电淬宝，云海秘境藏珍，天道峰顶可参悟破婴之机。金丹修士的天，在天域。',
    requirements:{ explore:'ty_baiyu_palace' },
    rewards:{ stones:800, exp:2000, items:[{id:'leiquan_dan',qty:1},{id:'leichi_jingtie',qty:3}], mood:20, questKey:'tiandao_key' },
    autoTrigger:'realmBreak',
    triggerRealm:12,
    triggerText:'金丹一成，丹田中灵光凝聚。你感应到九天之上有一股同源的呼唤——天域的云霄白玉宫，正在等待它的新主人。',
    completeText:'白玉台阶尽头的仙宫巍峨庄严，云海在脚下翻涌。天道碑前，你感受到大道真意的脉动——金丹之后的路，就在天域。',
    showInList:true,
  },
];

const EXTENDED_QUEST_DB = QUEST_DB;

// ==========================
// 秘境系统
// ==========================
const SECRET_REALMS = {
  'leiyin_pass': {
    id:'leiyin_pass', name:'雷音秘境', neededKey:'leiyin_pass',
    scene:'leiyin_temple',
    desc:'古佛传承之地，需要钥匙打开地宫之门。秘境内灵力浓郁，突破成功率大增。',
    boss:'雷音古佛残魂',
    rewards: { items:[{id:'podi_dan',qty:2}], skillScroll:'huoyan', stones:200 },
    breakthrough: { realm:'练气五层', bonus:0.3 },
    entryCost: { stones: 50 },
  },
  'guji_pass': {
    id:'guji_pass', name:'远古遗迹深层', neededKey:'guji_pass',
    scene:'guji_ruins',
    desc:'遗迹深处的密室，只有完成了所有考验方可进入。里面蕴藏着突破筑基的秘密。',
    boss:'上古守护者',
    rewards: { items:[{id:'juli_dan',qty:2}], skillScroll:'wuji_gong', stones:300 },
    breakthrough: { bonus:0.3 },
    entryCost: { stones: 80 },
  },
  'tiandao_pass': {
    id:'tiandao_pass', name:'天道秘境', neededKey:'tiandao_key',
    scene:'ty_tiandao_peak',
    desc:'天道峰之巅的一处虚空裂隙，内里自成一方天地。雷池紫电如龙，云海翻涌，天道碑的真意在此处最为浓烈。金丹修士于此参悟，可得碎丹成婴之机。',
    boss:'天道虚影',
    rewards: { items:[{id:'ningying_dan',qty:1},{id:'jiuyang_ling',qty:3},{id:'leijiao_long',qty:2}], skillScroll:'tianlei_yin', stones:1500 },
    breakthrough: { realm:'金丹高阶', bonus:0.25 },
    entryCost: { stones: 300 },
    maxEntries: 1,
  },
};
// ==========================
// 场景景点 (SCENIC_POI)
// ==========================
const SCENIC_POI = {
  'qingyun': [
    {id:'qingyun_pier', name:'清风渡口', desc:'镇西的青石码头，碧波湖来的船只在此停靠。水面倒映着远山，时有白鹭掠过。', type:'landscape', restBonus:1.0},
    {id:'qingyun_market', name:'坊市老街', desc:'青石板铺就的老街，两旁店铺林立。药铺、铁匠铺、杂货铺的叫卖声此起彼伏。', type:'market'},
    {id:'qingyun_inn', name:'悦来客栈', desc:'镇中最大的客栈，门前挂着一副褪色的对联。大堂里坐满了南来北往的客商与散修。', type:'inn'},
    {id:'qingyun_well', name:'古井', desc:'镇外老槐树下的古井，井水清冽甘甜。井壁上布满苔藓，岁月的痕迹历历在目。', type:'landscape'},
    {id:'qingyun_watchtower', name:'望月台', desc:'小镇后山的一处平台，是观星赏月的好去处。从这里可以俯瞰整个青云镇的全貌。', type:'landscape', restBonus:1.05},
  ],
  'luoxia_forest': [
    {id:'luoxia_waterfall', name:'飞瀑潭', desc:'一道银练般的瀑布从山崖上倾泻而下，在下方形成一个碧绿的水潭。水花飞溅，水雾弥漫。', type:'landscape', restBonus:1.1},
    {id:'luoxia_ancient_road', name:'古道遗迹', desc:'一条被荒草覆盖的古道，青石板上长满了苔藓。路旁立着一块半埋的石碑。', type:'ruin'},
    {id:'luoxia_dense', name:'密林深处', desc:'古木参天，藤蔓如蟒。林间弥漫着淡淡的雾气，偶尔有妖兽的低吼从远处传来。', type:'wild'},
    {id:'luoxia_cave', name:'藏身洞穴', desc:'一处被藤蔓遮掩的天然洞穴，洞口不大，但内部别有洞天。地上有篝火的痕迹。', type:'ruin'},
  ],
  'heifeng_ridge': [
    {id:'heifeng_outpost', name:'山贼哨塔', desc:'黑风岭山贼的瞭望哨，用圆木和草席搭成。哨塔上挂着黑风旗。', type:'danger'},
    {id:'heifeng_cliff', name:'断魂崖', desc:'黑风岭最险峻的悬崖，崖下深不见底。据说是山贼处置俘虏的地方。', type:'danger'},
    {id:'heifeng_cache', name:'隐藏宝窟', desc:'一处被山贼用来藏宝的天然洞穴，洞内堆满了抢来的货物。', type:'mine'},
  ],
  'bibo_lake': [
    {id:'bibo_pavilion', name:'湖心亭', desc:'碧波湖中央的一座小亭，亭中石桌上刻着棋盘。传说曾有仙人在此对弈。', type:'landscape', restBonus:1.1},
    {id:'bibo_reed', name:'芦苇荡', desc:'湖畔茂密的芦苇丛，风过时沙沙作响。苇丛深处栖息着各种水鸟。', type:'landscape'},
    {id:'bibo_dock', name:'码头', desc:'湖边的木制码头，几艘小船系在桩上。湖水清澈见底。', type:'market'},
  ],
  'lingyun_peak': [
    {id:'lingyun_summit', name:'峰顶', desc:'灵云峰之巅，云雾在脚下翻涌。站在这里仿佛伸手可及天穹。', type:'landscape', restBonus:1.2},
    {id:'lingyun_cave', name:'仙人洞府', desc:'山崖上的一处洞府，石门半掩。洞内有石桌石椅，像是有人曾在此长居。', type:'cultivation', restBonus:1.15},
    {id:'lingyun_meditation', name:'坐忘岩', desc:'一块平整如镜的巨石，表面光滑如磨。在此打坐冥想，心绪格外宁静。', type:'cultivation', restBonus:1.1},
    {id:'lingyun_herbgarden', name:'野药圃', desc:'山腰一处向阳的坡地，各种灵药野草自由生长。药香扑鼻。', type:'cultivation'},
  ],
  'lingyao_garden': [
    {id:'lingyao_gate', name:'药园大门', desc:'一座古朴的石门，门匾上刻着"灵药圃"三个字。门上的铜锁早已锈蚀。', type:'landscape'},
    {id:'lingyao_greenhouse', name:'暖房遗迹', desc:'半塌的暖房里，仍然生长着一些奇异的灵草。阳光透过破洞洒在地上。', type:'cultivation'},
    {id:'lingyao_spring', name:'灵泉', desc:'一汪清泉从地底涌出，泉水泛着淡淡的灵光。周围的灵草格外茂盛。', type:'landscape', restBonus:1.25},
  ],
  'youming_grotto': [
    {id:'youming_entrance', name:'鬼窟入口', desc:'巨大的溶洞入口，阴风从洞中不断涌出。洞壁上长满了暗绿色的荧光苔藓。', type:'danger'},
    {id:'youming_dark_hall', name:'暗殿', desc:'洞窟深处的一座天然大厅，石笋如林。黑暗中隐约可见鬼火飘动。', type:'danger'},
    {id:'youming_underground_pool', name:'地底寒潭', desc:'深藏洞底的一潭寒水，水面上漂浮着微弱的荧光。水温极低。', type:'landscape'},
  ],
  'underground_river': [
    {id:'river_boat_wreck', name:'沉船', desc:'暗河岸边搁浅着一艘破旧的小船，船体已经腐朽。里面似乎有残骸。', type:'ruin'},
    {id:'river_echo_cave', name:'回音洞', desc:'暗河上方的一个天然穹顶，对着它喊话会听到七个回声层层叠叠地传回来。', type:'landscape'},
  ],
  'duzhang_swamp': [
    {id:'swamp_dead_tree', name:'枯木林', desc:'一片枯萎的黑色树木，枝桠扭曲如鬼爪。树皮上爬满了暗紫色的毒苔，散发着微弱的荧光。', type:'danger'},
    {id:'swamp_bubbling', name:'沸泥潭', desc:'一片不断冒着气泡的泥潭，泥浆翻滚如同沸腾。偶尔会有巨大的气泡破裂，喷出一股刺鼻的瘴气。', type:'danger'},
    {id:'swamp_ancient_tree', name:'腐生古木', desc:'一株倒伏的千年古木，树干已腐朽中空。但树心处竟长出了一株通体碧绿的小苗，在毒瘴中顽强地生存。', type:'landscape'},
  ],
  'bingfeng_grotto': [
    {id:'bingfeng_icefall', name:'冰瀑', desc:'洞内一条被冰封的瀑布，水流在半空中凝固成千万根冰棱，在微光中折射出七彩光芒。', type:'landscape'},
    {id:'bingfeng_crystal_room', name:'冰晶宫', desc:'一个完全由冰晶构成的洞室，四面墙壁如同巨大的宝石般通透。在正中央有一块千年寒冰，内部封着一株通红的火莲。', type:'landscape', restBonus:1.15},
    {id:'bingfeng_frozen_lake', name:'冰湖', desc:'石窟深处的一个小湖，湖面完全冰封。冰层厚达数尺，透过冰面可以看到水下有微弱的蓝光游弋。', type:'landscape'},
  ],
  'guji_ruins': [
    {id:'ruins_gate', name:'遗迹大门', desc:'两尊高达三丈的石像守卫着大门，石像手持长戈，面目已经风化模糊。门上刻着巨大的太极图。', type:'ruin'},
    {id:'ruins_hall', name:'主殿废墟', desc:'曾经恢弘的大殿只剩下断壁残垣，但仍能看出昔日的规模。残破的穹顶上绘着模糊的星图。', type:'ruin'},
    {id:'ruins_pillar', name:'图腾柱', desc:'一根雕满图腾的石柱，柱身绕着一条石龙。龙首仰天，口中衔着一颗拳头大的夜明珠。', type:'landscape'},
  ],
  'leiyin_temple': [
    {id:'leiyin_bell', name:'古钟', desc:'古刹前悬着一口巨大的铜钟，钟体布满铜绿。敲击之下，钟声悠远绵长，能涤荡心神。', type:'landscape', restBonus:1.2},
    {id:'leiyin_buddha', name:'残佛', desc:'一尊高达五丈的残破佛像，佛首已不知所踪，只剩身躯端坐莲台。莲台上刻满密密麻麻的经文。', type:'ruin'},
    {id:'leiyin_underground', name:'地宫入口', desc:'大雄宝殿后方的地宫入口，被一块巨大的石板封住。石板上刻着"非有缘人莫入"六字。', type:'danger'},
  ],
  'xuantie_mine': [
    {id:'xuantie_entrance', name:'矿洞入口', desc:'洞口用粗木搭成支架，洞壁上的玄铁矿脉在黑暗中泛着幽暗的金属光泽。洞内传来叮叮当当的滴水声。', type:'mine'},
    {id:'xuantie_deep', name:'矿洞深处', desc:'矿洞最深处，这里的玄铁矿石纯度极高，散发着淡淡的银光。墙壁上能看到天然形成的金属纹理。', type:'mine'},
    {id:'xuantie_abandoned', name:'废弃矿坑', desc:'一条被废弃的岔路，尽头的矿坑已经坍塌了一半。坍塌的碎石中似乎埋着什么。', type:'ruin'},
  ],
  'yumu_forest': [
    {id:'yumu_glade', name:'玉木林间', desc:'玉色古木的树冠遮天蔽日，只有稀疏的光线能穿透叶片。地面上铺满了落叶，踩上去有玉石相击般的清脆声响。', type:'landscape'},
    {id:'yumu_sacred', name:'圣木', desc:'林中最高大的一株玉木，树干要五人合抱。树皮如玉，触之温润。据说这株玉木已活了万年。', type:'landscape', restBonus:1.35},
    {id:'yumu_fossil', name:'木化石林', desc:'一片早已石化的古木森林，树木已化为石质，但形态依旧完整。石化后的年轮清晰可见。', type:'landscape'},
  ],
  'biguan_peak': [
    {id:'biguan_cliff', name:'绝壁栈道', desc:'悬挂在悬崖峭壁上的木制栈道，下面是万丈深渊。走在上面能感受到强劲的山风。', type:'danger'},
    {id:'biguan_chamber', name:'闭关密室', desc:'被禁制封住的洞府石门，石门上刻着"非金丹期不得入内"一行小字。', type:'cultivation', restBonus:1.5},
  ],
  'gate_nether_divine': [
    {id:'tower_front', name:'塔前广场', desc:'试炼之塔前的青石广场，地面刻满了古老的阵纹。抬头望去，塔身直入云霄，令人心生敬畏。', type:'landscape'},
    {id:'tower_gate', name:'塔门', desc:'漆黑的塔门上爬满了金色的符文，时而明亮时而暗淡，仿佛有生命一般。门缝中透出幽暗的光芒。', type:'trial'},
  ],
};

// ==========================
// 数据导出


// 📍 场景名称→ID 映射（用于玄黄图/提示等场景快速跳转）
const SCENE_NAME_TO_ID = {
  '青云镇':'qingyun','落霞森林':'luoxia_forest','黑风岭':'heifeng_ridge',
  '碧波湖':'bibo_lake','灵云峰':'lingyun_peak','灵药园':'lingyao_garden',
  '古井入口':'gate_mortal_nether','清风渡口':'qingyun_pier',
  '落日平原':'luori_plain','翠竹林':'bamboo_grove','月华谷':'moon_valley',
  '青石古道':'stone_road','幽冥鬼窟':'youming_grotto',
  '地底暗河':'underground_river','毒瘴沼泽':'duzhang_swamp',
  '冰风石窟':'bingfeng_grotto','远古遗迹':'guji_ruins',
  '试炼之塔':'gate_nether_divine','雷音古刹':'leiyin_temple',
  '烈焰谷':'lieyan_valley','玄铁矿洞':'xuantie_mine',
  '玉木林':'yumu_forest','闭关峰':'biguan_peak',
  '冰封湖':'bj_frozen_lake','冰晶峰':'bj_ice_peak','雪松林':'bj_snow_forest',
  '瀛洲渡口':'dh_yingzhou_port','珊瑚礁海':'dh_coral_reef','沉船岛':'dh_shipwreck_island',
  '云霄塔':'ty_yunxiao_tower','悬空花园':'ty_floating_garden',
  '黄泉路':'yy_huangquan_road','忘川河渡口':'yy_wangchuan_river','白骨山':'yy_baihu_hill','轮回台':'yy_lunhui_platform',
};

window.SCENE_NAME_TO_ID = SCENE_NAME_TO_ID;
window.WORLD_DATA = WORLD_DATA;
window.EVENT_TEMPLATES = EVENT_TEMPLATES;
window.SCENE_LOOT_TABLES = SCENE_LOOT_TABLES;
window.QUEST_DB = QUEST_DB;
window.EXTENDED_QUEST_DB = EXTENDED_QUEST_DB;
window.SECRET_REALMS = SECRET_REALMS;
window.SCENIC_POI = SCENIC_POI;

// ==========================
// 辅助函数
// ==========================
/** 灵气等级描述 */
function getQiLevelDesc(level) {
  const descs = {
    1:'几近枯竭', 2:'稀薄', 3:'普通', 4:'充沛', 5:'浓郁',
    6:'极浓', 7:'灵雾弥漫', 8:'化液', 9:'灵泉之郁', 10:'洞天福地'
  };
  return descs[level] || '未知';
}

/** 场景景点叙事 */
function getPOINarrative(sceneId) {
  const scenePois = SCENIC_POI[sceneId];
  if (!scenePois || scenePois.length === 0) return null;
  const pick = scenePois[Math.floor(Math.random() * scenePois.length)];
  return { name: pick.name, desc: pick.desc, type: pick.type, restBonus: pick.restBonus || 1.0 };
}

/** 休息加成 */
function applyRestBonus(bonus) {
  if (!G || !G.player) return 1.0;
  return bonus * (1 + (G.player.luck || 0) * 0.005);
}

// ==========================
// 🧑‍🤝‍🧑 存档角色 → NPC 系统
// ==========================

// 读取所有已存档的角色（来自 localStorage），返回可漫游的 NPC 数据
function getSavedPlayerNPCs() {
  var raw = [];
  try {
    var metaRaw = localStorage.getItem('weiwoduxian_char_meta');
    if (metaRaw) {
      var meta = JSON.parse(metaRaw);
      meta.forEach(function(c){
        if (c && c.name && c.saveKey) {
          raw.push({ meta: c, saveKey: c.saveKey });
        }
      });
    }
  } catch(e) { /* 忽略 */ }
  return raw;
}

// 将当前 G.player 写入已存档角色 NPC 清单（标记为"当前在线"，不射出为 NPC）
function registerCurrentPlayerAsNPC() {
  if (!G.player) return;
  try {
    var npcList = [];
    var raw = localStorage.getItem('weiwoduxian_player_npcs');
    if (raw) try { npcList = JSON.parse(raw); } catch(e) {}
    // 去重
    var idx = npcList.findIndex(function(n){ return n.name === G.player.name; });
    if (idx >= 0) npcList.splice(idx, 1);
    npcList.push({
      name: G.player.name,
      gender: G.player.gender || '男',
      qiRealmIndex: G.player.qiRealmIndex || 0,
      bodyRealmIndex: G.player.bodyRealmIndex || 0,
      roots: G.player.spiritRoots || [],
      fortuneEmoji: G.player.fortuneEmoji || '☯️',
      lastActive: Date.now(),
      role: '散修',
      personality: '独来独往',
      online: true  // 在线标记，不射出
    });
    localStorage.setItem('weiwoduxian_player_npcs', JSON.stringify(npcList));
  } catch(e) {}
}

// 加载非在线的存档角色 NPC 到 npcManager
function loadPlayerNPCsIntoManager() {
  if (typeof npcManager === 'undefined' || !npcManager) return;
  try {
    var raw = localStorage.getItem('weiwoduxian_player_npcs');
    if (!raw) return;
    var list = JSON.parse(raw);
    // 只加载不在线的
    var offlineNPCs = list.filter(function(n){ return !n.online; });
    offlineNPCs.forEach(function(pnpc){
      // 检查是否已在 manager 中
      var exists = npcManager.npcs.some(function(n){ return n._isPlayerNPC && n.name === pnpc.name; });
      if (exists) return;
      // 找场景
      var scenes = Object.keys(SCENE_DATA || {});
      var sceneKeys = [];
      Object.keys(SCENE_LAYERS || {}).forEach(function(lk){
        var layer = SCENE_LAYERS[lk];
        (layer.scenes || []).forEach(function(s){ sceneKeys.push(s.id); });
      });
      // 随机分配场景
      var homeScene = scenes[Math.floor(Math.random() * scenes.length)] || 'qingyun';
      var npc = {
        id: 'player_npc_' + pnpc.name + '_' + Date.now(),
        name: pnpc.name,
        gender: pnpc.gender || '男',
        qiRealmIndex: pnpc.qiRealmIndex || 0,
        bodyRealmIndex: pnpc.bodyRealmIndex || 0,
        role: pnpc.role || '散修',
        personality: pnpc.personality || '独来独往',
        background: '修仙之人',
        sceneId: homeScene,
        affinity: 0,
        isFirstMeeting: true,
        memoryLog: [],
        desire: '继续修炼',
        speechStyle: '自然的语气',
        speechQuirk: '',
        speechLikes: '志同道合之人',
        roleQuirk: '',
        aiDescription: null,
        aiDialogueStyle: null,
        lifeStory: (pnpc.roots && pnpc.roots.length > 0 ? pnpc.roots.join('·') + '灵根' : '杂灵根') + '的散修，在世间独自修行。',
        firstImpress: '你看见一位' + (pnpc.gender === '男' ? '青年修士' : '女修') + '，气度不凡，似是同道中人。',
        dialogHistory: [],
        questGiven: false,
        tradeGoods: null,
        _isPlayerNPC: true,
        _lastScenes: []  // 漫游用的历史场景
      };
      npcManager.npcs.push(npc);
    });
  } catch(e) {}
}

// ==========================
// 全局：判断物品是否为任务物品
// ==========================
function isQuestItem(itemId) {
  // 检查物品数据库标记
  var itemData = ITEM_DB.find(function(i) { return i.id === itemId; });
  if (itemData && itemData.questItem) return true;
  // 检查活跃任务是否需要此物品
  try {
    if (typeof getActiveQuests === 'function' && typeof getQuestDB === 'function') {
      var db = getQuestDB();
      var aqs = getActiveQuests();
      for (var i = 0; i < aqs.length; i++) {
        var q = db.find(function(d){ return d.id === aqs[i].id; });
        if (q && q.requirements && q.requirements.items) {
          for (var j = 0; j < q.requirements.items.length; j++) {
            if (q.requirements.items[j].id === itemId) return true;
          }
        }
      }
    }
  } catch(e) {}
  return false;
}

window.getSavedPlayerNPCs = getSavedPlayerNPCs;
window.registerCurrentPlayerAsNPC = registerCurrentPlayerAsNPC;
window.loadPlayerNPCsIntoManager = loadPlayerNPCsIntoManager;
window.isQuestItem = isQuestItem;