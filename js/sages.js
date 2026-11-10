// === 唯我独仙 · 文化名人（先贤）系统 ===
// 历代文人墨客化入游戏场景，读诗悟道、涵养道心

// ==========================
// 道心属性初始化（如果没有）
// ==========================
function initDaoHeart() {
  if (!G.player) return 50;
  if (G.player.daoHeart === undefined) G.player.daoHeart = 50;
  return G.player.daoHeart;
}

// 获取道心等级
function getDaoHeartLevel() {
  var dh = G.player ? (G.player.daoHeart || 50) : 50;
  if (dh >= 180) return { level:'道通天地', color:'#d4a5f9', icon:'🌌' };
  if (dh >= 150) return { level:'明心见性', color:'#c084fc', icon:'☯️' };
  if (dh >= 120) return { level:'道心稳固', color:'#a78bfa', icon:'🔮' };
  if (dh >= 90)  return { level:'初悟大道', color:'#818cf8', icon:'✨' };
  if (dh >= 60)  return { level:'志于道', color:'#6366f1', icon:'📜' };
  return { level:'蒙昧求索', color:'#94a3b8', icon:'🌱' };
}

// ==========================
// 文化名人数据库
// ==========================
const SAGES = [
  {
    id:'laozi',
    name:'老子',
    courtesy:'李耳',
    era:'春秋',
    style:'青牛老者',
    identity:'道家始祖',
    desc:'白发苍苍的老者，骑着一头青牛，面容平静如古井无波。眼神中藏着天地至理。',
    scenes:['lingyun_peak','bibo_lake','bamboo_grove','biguan_peak','gate_nether_divine'],
    poem:'道可道，非常道；名可名，非常名。无名天地之始，有名万物之母。故常无欲，以观其妙；常有欲，以观其徼。',
    poemTitle:'道德经·第一章',
    insight:'道法自然，万物一体。真正的智慧不在言语之中，而在无言的天地之间。',
    lessons:[
      { text:'领悟"道法自然"', effect:{ daoHeart:5, mood:8 }, reply:'你默念着这几句话，心中忽然安静了许多。天地万物，自有其道。' },
      { text:'思辨"有无相生"', effect:{ daoHeart:4, wisdom:3 }, reply:'有与无，难与易，高与下——老子说得对，万物皆在相对中显现自身。' },
      { text:'感受"上善若水"', effect:{ daoHeart:6, mood:5 }, reply:'水善利万物而不争，处众人之所恶，故几于道。你的心也变得柔软起来。' }
    ],
    moodRequired:30,
    firstMeet:'（青青草地上，一位老者正倚靠青牛，低声吟诵着什么。见你走近，他抬起头，目光仿佛穿透了你的魂魄。）'
  },
  {
    id:'quyuan',
    name:'屈原',
    courtesy:'屈平',
    era:'战国',
    style:'峨冠博带',
    identity:'楚辞之祖',
    desc:'身披香草，头戴高冠，行吟泽畔。眉宇间满是忧国忧民的郁愤之色。',
    scenes:['bibo_lake','qingyun_pier','gate_mortal_nether'],
    poem:'长太息以掩涕兮，哀民生之多艰。余虽好修姱以鞿羁兮，謇朝谇而夕替。既替余以蕙纕兮，又申之以揽茝。亦余心之所善兮，虽九死其犹未悔！',
    poemTitle:'离骚（节选）',
    insight:'路漫漫其修远兮，吾将上下而求索。人生的意义在于永不停歇的追寻。',
    lessons:[
      { text:'感受"九死不悔"的执着', effect:{ daoHeart:6, mood:5 }, reply:'你那颗赤诚的心，如同香草般芬芳。虽九死其犹未悔——这份执着，就是道心。' },
      { text:'品味香草美人的意象', effect:{ daoHeart:3, wisdom:3 }, reply:'以香草喻君子，以臭物斥小人。屈子开创的比兴之法，让万物都有了品格。' },
      { text:'读罢长叹，心生共鸣', effect:{ daoHeart:4, mood:6 }, reply:'你似乎懂了他心中的悲愤——在浑浊的世间保持清白，何等艰难，又何等高贵。' }
    ],
    moodRequired:25,
    firstMeet:'（水边传来低沉的吟诵声。你走近一看，一位峨冠博带的男子正对着江水出神，衣袂在风中猎猎作响。）'
  },
  {
    id:'taoyuanming',
    name:'陶渊明',
    courtesy:'陶潜',
    era:'东晋',
    style:'采菊隐士',
    identity:'田园诗宗',
    desc:'一袭布衣，手持竹杖，身旁放着半壶浊酒。神情恬淡自适，仿佛世间纷扰与他无关。',
    scenes:['lingyao_garden','bamboo_grove','luori_plain','moon_valley'],
    poem:'结庐在人境，而无车马喧。问君何能尔？心远地自偏。采菊东篱下，悠然见南山。此中有真意，欲辨已忘言。',
    poemTitle:'饮酒·其五',
    insight:'真正的宁静不在山林，而在心中。心若远了，闹市也是山林。',
    lessons:[
      { text:'体悟"心远地自偏"', effect:{ daoHeart:5, mood:8 }, reply:'是啊，心若安宁，身在何处都是桃源。你感到心中的浮躁沉淀了些。' },
      { text:'欣然向往"归园田居"', effect:{ daoHeart:3, mood:5, wisdom:2 }, reply:'田园之美不在山水，而在那份与世无争的心境。你开始理解何为"质性自然"。' },
      { text:'品味"采菊东篱下"', effect:{ daoHeart:4, mood:6 }, reply:'你仿佛看到了那个秋日——篱笆旁的金菊，远处的南山。最简单的画面，却最是动人。' }
    ],
    moodRequired:20,
    firstMeet:'（你闻到一阵淡淡的酒香。一位布衣隐士正倚着篱笆席地而坐，手边搁着几朵野菊，似醉非醉地哼着小调。）'
  },
  {
    id:'libai',
    name:'李白',
    courtesy:'李太白',
    era:'盛唐',
    style:'剑仙诗人',
    identity:'诗仙',
    desc:'白衣胜雪，腰悬长剑，举杯邀月。眉飞色舞间，尽是江湖不羁与诗酒风流。',
    scenes:['lingyun_peak','luoxia_forest','bibo_lake','luori_plain','bamboo_grove','leiyin_temple'],
    poem:'君不见，黄河之水天上来，奔流到海不复回。君不见，高堂明镜悲白发，朝如青丝暮成雪。人生得意须尽欢，莫使金樽空对月。天生我材必有用，千金散尽还复来。',
    poemTitle:'将进酒（节选）',
    insight:'人生苦短，不如把握当下。天生我材必有用——每个人都有自己的价值和天命。',
    lessons:[
      { text:'为"天生我材必有用"击节赞叹', effect:{ daoHeart:5, mood:10 }, reply:'好一句天生我材必有用！你的心头涌起一股豪情——天地之大，总有你的位置！' },
      { text:'感叹"朝如青丝暮成雪"', effect:{ daoHeart:4, wisdom:3 }, reply:'人生如白驹过隙，转瞬即逝。你更加珍惜眼前的修行时光。' },
      { text:'与李白对饮一杯', effect:{ daoHeart:3, mood:8 }, reply:'（李白哈哈大笑，与你碰杯）好！能饮一杯无？痛快！你感到心中郁结消散了几分。' }
    ],
    moodRequired:15,
    firstMeet:'（林中传来朗朗笑声。一位白衣侠客正倚在古松上，一手提壶饮酒，一手握剑起舞。剑光如霜雪，酒香漫山林。）'
  },
  {
    id:'dufu',
    name:'杜甫',
    courtesy:'杜子美',
    era:'盛唐→中唐',
    style:'忧国老儒',
    identity:'诗圣',
    desc:'面容清瘦，布衣简朴，眉间刻着风霜与苍生。手中握着一卷写满诗句的草纸。',
    scenes:['qingyun','luoxia_forest','heifeng_ridge','stone_road','guji_ruins'],
    poem:'国破山河在，城春草木深。感时花溅泪，恨别鸟惊心。烽火连三月，家书抵万金。白头搔更短，浑欲不胜簪。',
    poemTitle:'春望',
    insight:'乱世之中，家国情怀最是动人。真正的道心，是在苦难中依然心系苍生。',
    lessons:[
      { text:'感怀"家书抵万金"', effect:{ daoHeart:5, mood:5 }, reply:'乱世之中，一封家书的重量胜过千金。你不由得想起了远方的亲友。' },
      { text:'悲悯"感时花溅泪"', effect:{ daoHeart:6, mood:4 }, reply:'花本无情，因人心而泣。你感到胸中涌起一股悲天悯人之情。' },
      { text:'发奋图强，不负光阴', effect:{ daoHeart:3, wisdom:4 }, reply:'白头搔更短——时不我待。你暗暗发誓要更努力修行。' }
    ],
    moodRequired:20,
    firstMeet:'（一位清瘦的老儒坐在路边的石头上，正对着一卷纸叹息。山风吹过他花白的鬓发，他提笔在纸上又添了几行字。）'
  },
  {
    id:'wangwei',
    name:'王维',
    courtesy:'王摩诘',
    era:'盛唐',
    style:'诗佛居士',
    identity:'山水诗宗',
    desc:'一袭灰色僧袍，手持念珠，双目微闭。周身散发着静谧祥和的气息，仿佛与山水融为一体。',
    scenes:['lingyun_peak','moon_valley','bamboo_grove','bibo_lake','gate_mortal_nether'],
    poem:'空山新雨后，天气晚来秋。明月松间照，清泉石上流。竹喧归浣女，莲动下渔舟。随意春芳歇，王孙自可留。',
    poemTitle:'山居秋暝',
    insight:'诗中有画，画中有诗。世间最美的风景，需要用心灵去感知。',
    lessons:[
      { text:'品味"明月松间照"', effect:{ daoHeart:4, mood:8 }, reply:'读罢这句，你仿佛看到了月光穿过松枝洒下的银色光斑，听到了清泉在石上流淌的声音。' },
      { text:'感悟"空山新雨后"', effect:{ daoHeart:5, mood:6 }, reply:'禅意无需远求。就在一场雨后、一座空山中。你的心境变得澄澈如洗。' },
      { text:'静坐片刻，默然体会', effect:{ daoHeart:6, mood:5, wisdom:2 }, reply:'你学着王维的样子，闭目静坐。山风拂面，鸟鸣入耳——原来这就是"诗中有画"。' }
    ],
    moodRequired:20,
    firstMeet:'（溪边的石头上，一位灰衣居士正抚琴轻吟。琴声如流水，和着空山的鸟鸣，仿佛天地都在为他伴奏。）'
  },
  {
    id:'baijuyi',
    name:'白居易',
    courtesy:'白乐天',
    era:'中唐',
    style:'乐天诗翁',
    identity:'诗魔',
    desc:'慈眉善目的老翁，布衣布鞋，手持一卷诗稿。面带温和的笑容，像个邻家长者。',
    scenes:['qingyun','qingyun_pier','bibo_lake','luori_plain','moon_valley'],
    poem:'离离原上草，一岁一枯荣。野火烧不尽，春风吹又生。远芳侵古道，晴翠接荒城。又送王孙去，萋萋满别情。',
    poemTitle:'赋得古原草送别',
    insight:'生命如原上之草，枯荣交替，但只要根还在，春风一吹便会重生。',
    lessons:[
      { text:'领悟"野火烧不尽"的生命力', effect:{ daoHeart:5, mood:7 }, reply:'是啊，只要根基未断，风雨过后自会重生。修行之路亦是如此。' },
      { text:'感怀"离离原上草"', effect:{ daoHeart:3, mood:5, wisdom:2 }, reply:'白居易的诗平实而深刻——最简单的送别，却让人看到了生命的轮回。' },
      { text:'与白居易谈诗论道', effect:{ daoHeart:4, mood:6 }, reply:'（白居易抚须而笑）诗者，天地之心也。能读懂诗的，都是有心人。' }
    ],
    moodRequired:15,
    firstMeet:'（你看到一位布衣老者蹲在路边，正对着一株在石缝中顽强生长的小草出神。他嘴里念念有词，似乎在推敲诗句。）'
  },
  {
    id:'sushi',
    name:'苏轼',
    courtesy:'苏东坡',
    era:'北宋',
    style:'东坡居士',
    identity:'千古第一文人',
    desc:'峨冠博带，潇洒不羁。眉宇间既有文人的儒雅，又有江湖的豪气。手持一壶酒，望着远方。',
    scenes:['bibo_lake','lingyun_peak','bamboo_grove','moon_valley','luori_plain','biguan_peak'],
    poem:'大江东去，浪淘尽，千古风流人物。故垒西边，人道是，三国周郎赤壁。乱石穿空，惊涛拍岸，卷起千堆雪。江山如画，一时多少豪杰。',
    poemTitle:'念奴娇·赤壁怀古（节选）',
    insight:'人生如梦，一樽还酹江月。风流总被雨打风吹去，唯有江月永恒。',
    lessons:[
      { text:'豪情万丈，咏叹"大江东去"', effect:{ daoHeart:5, mood:9 }, reply:'你被苏轼的豪迈感染了——人生在世，纵有起落，也当如大江奔流，不可阻挡！' },
      { text:'深沉思考"人生如梦"', effect:{ daoHeart:4, wisdom:4 }, reply:'千古风流人物，终归尘土。但正因短暂，才更需珍惜当下、活出真我。' },
      { text:'与东坡讨论"诗酒趁年华"', effect:{ daoHeart:3, mood:7, wisdom:2 }, reply:'（苏轼举杯大笑）正是！诗酒趁年华！修行之人，也不可失了赤子之心。' }
    ],
    moodRequired:15,
    firstMeet:'（你听到有人在吟唱，声音豪迈中带着几分苍凉。转过山石，一位文士正临风而立，脚下踩着块江边的巨石，对着滔滔流水举杯独饮。）'
  },
  {
    id:'liqingzhao',
    name:'李清照',
    courtesy:'易安居士',
    era:'两宋之交',
    style:'婉约才女',
    identity:'千古第一才女',
    desc:'一袭素衣，面如秋水。眉间既有才女的灵秀，又有乱世漂泊的憔悴。手中把玩着一枝梅花。',
    scenes:['moon_valley','lingyao_garden','qingyun','bibo_lake'],
    poem:'寻寻觅觅，冷冷清清，凄凄惨惨戚戚。乍暖还寒时候，最难将息。三杯两盏淡酒，怎敌他、晚来风急？雁过也，正伤心，却是旧时相识。',
    poemTitle:'声声慢（节选）',
    insight:'词以境界为最上。最深的情，最美的词，往往来自最苦的日子。',
    lessons:[
      { text:'品味"寻寻觅觅"的孤寂之美', effect:{ daoHeart:4, mood:5 }, reply:'这七个叠字，道尽了人世间的孤独与凄凉。你感到一股淡淡的哀愁，却也是一种美的体验。' },
      { text:'感叹"雁过也，正伤心"', effect:{ daoHeart:5, mood:4, wisdom:2 }, reply:'旧时相识的大雁，如今又在天际飞过——物是人非，情深不寿。你越发懂得珍惜眼前人。' },
      { text:'体会婉约词中的坚韧', effect:{ daoHeart:3, mood:6 }, reply:'看似柔弱，实则坚韧。李清照的词如同她的人生——风雨过后，依然傲然挺立。' }
    ],
    moodRequired:25,
    firstMeet:'（月下的庭院中，一位素衣女子正对着一枝梅花发呆。月光将她的身影拉得很长，她轻轻叹了口气，提笔在纸上写下了什么。）'
  },
  {
    id:'xinqiji',
    name:'辛弃疾',
    courtesy:'稼轩',
    era:'南宋',
    style:'豪放词将',
    identity:'词中之龙',
    desc:'身材魁梧，面色黝黑，眉宇间带着将门虎气。腰间佩剑，手握一卷兵书，看似将军却满口锦绣文章。',
    scenes:['heifeng_ridge','luori_plain','stone_road','leiyin_temple','biguan_peak'],
    poem:'醉里挑灯看剑，梦回吹角连营。八百里分麾下炙，五十弦翻塞外声，沙场秋点兵。马作的卢飞快，弓如霹雳弦惊。了却君王天下事，赢得生前身后名。可怜白发生！',
    poemTitle:'破阵子（节选）',
    insight:'文能提笔安天下，武能上马定乾坤。真正的豪杰，是文心与武骨并存的。',
    lessons:[
      { text:'为"醉里挑灯看剑"壮怀激烈', effect:{ daoHeart:5, mood:8 }, reply:'你在辛弃疾的词中看到了一个铁血男儿的赤子之心——醉里尚且看剑，这是何等的忠勇！' },
      { text:'悲叹"可怜白发生"', effect:{ daoHeart:4, mood:5, wisdom:3 }, reply:'功业未成，白发已生。你感到修行的路上，更需全力以赴。' },
      { text:'与稼轩论英雄', effect:{ daoHeart:3, mood:7 }, reply:'（辛弃疾重重地拍了拍你的肩膀）英雄不问出处！心中有志，何处不是沙场！' }
    ],
    moodRequired:20,
    firstMeet:'（一个铁塔般的汉子坐在岩石上，借着火光擦拭一柄染血的长剑。旁边摊着一卷词稿，墨迹未干——你隐约看到了"醉里挑灯看剑"几个字。）'
  },
  {
    id:'wangyangming',
    name:'王阳明',
    courtesy:'王守仁',
    era:'明代',
    style:'心学宗师',
    identity:'心学集大成者',
    desc:'一身儒袍，面容清癯而目光如炬。周身散发着沉稳如山的气度，每一句话都像是从心底流淌出的真理。',
    scenes:['biguan_peak','moon_valley','lingyun_peak','gate_nether_divine'],
    poem:'险夷原不滞胸中，何异浮云过太空。夜静海涛三万里，月明飞锡下天风。',
    poemTitle:'泛海',
    insight:'心即理也。宇宙便是吾心，吾心即是宇宙。万事万物之理，不外乎吾心。',
    lessons:[
      { text:'领悟"心即理"', effect:{ daoHeart:7, wisdom:5 }, reply:'你感到茅塞顿开——原来所有的道理都不在外面，而在自己心中。修心即是修道。' },
      { text:'体会"知行合一"', effect:{ daoHeart:6, wisdom:5 }, reply:'知而不行，只是未知。王阳明的话如同一道闪电——修行不仅要悟，还要行。' },
      { text:'静坐参悟"致良知"', effect:{ daoHeart:8, mood:6 }, reply:'（王阳明微笑着说）每个人心中都有良知，就像每个人心中都有太阳。你要做的不是去寻找，而是去擦亮它。' }
    ],
    moodRequired:35,
    firstMeet:'（你看到一个人静静地坐在山顶的巨石上，面朝云海，仿佛与天地融为一体。他没有任何动作，但你却感到一股强大的气息从他身上散发出来。）'
  },
  {
    id:'caocao',
    name:'曹操',
    courtesy:'孟德',
    era:'东汉末',
    style:'横槊赋诗',
    identity:'建安风骨之首',
    desc:'身披战袍，腰悬长剑。不怒自威的面容下，却藏着一颗诗人敏感的心。手中握着酒樽，望向夜空。',
    scenes:['heifeng_ridge','stone_road','leiyin_temple','luori_plain'],
    poem:'对酒当歌，人生几何！譬如朝露，去日苦多。慨当以慷，忧思难忘。何以解忧？唯有杜康。青青子衿，悠悠我心。但为君故，沉吟至今。',
    poemTitle:'短歌行（节选）',
    insight:'对酒当歌，人生几何——正因为人生短暂，才更要建功立业，不负此生。',
    lessons:[
      { text:'感怀"对酒当歌"的慷慨', effect:{ daoHeart:4, mood:7 }, reply:'曹操虽是枭雄，但这一句"对酒当歌"中蕴含的豪情与苍凉，却让人不得不动容。' },
      { text:'品味"青青子衿"的求贤之心', effect:{ daoHeart:3, wisdom:3, mood:4 }, reply:'连一代枭雄都在渴求知音与贤才——你更加明白，修行路上也需要良师益友。' },
      { text:'思考"人生几何"的紧迫', effect:{ daoHeart:5, mood:5 }, reply:'人生苦短，譬如朝露。你感到时间在指尖流逝——不能再虚度光阴了。' }
    ],
    moodRequired:25,
    firstMeet:'（营火旁，一位身着铠甲的将军正对月独饮。他的佩剑插在地上，剑身在火光中泛着寒光。但出人意料的是，他口中吟哦的却是温婉的诗句。）'
  },
  {
    id:'lishangyin',
    name:'李商隐',
    courtesy:'义山',
    era:'晚唐',
    style:'朦胧诗人',
    identity:'无题诗圣手',
    desc:'面容清秀，眼神中总是带着一丝似有若无的忧郁。手中握着半卷诗稿，上面尽是晦涩难解却美到极致的句子。',
    scenes:['moon_valley','bamboo_grove','lingyun_peak','bibo_lake'],
    poem:'相见时难别亦难，东风无力百花残。春蚕到死丝方尽，蜡炬成灰泪始干。晓镜但愁云鬓改，夜吟应觉月光寒。蓬山此去无多路，青鸟殷勤为探看。',
    poemTitle:'无题',
    insight:'人生最深的感情，往往无法直说。最美的诗，就是那些说不清道不明的瞬间。',
    lessons:[
      { text:'品味"春蚕到死丝方尽"', effect:{ daoHeart:4, mood:6 }, reply:'春蚕吐丝至死方休，蜡烛燃尽始干——这是怎样深沉的情感！你为之动容。' },
      { text:'体会"相见时难别亦难"', effect:{ daoHeart:5, mood:5, wisdom:2 }, reply:'越是珍视的，越难开口说再见。李商隐的朦胧之中，藏着最真切的人间至情。' },
      { text:'感悟"蓬山此去无多路"', effect:{ daoHeart:3, mood:5 }, reply:'远在天边的蓬山，其实并不遥远——只要心中有念，万里亦是咫尺。' }
    ],
    moodRequired:30,
    firstMeet:'（竹林深处，一个年轻的文人正倚着青竹出神。他手中转动着一枝枯笔，纸上落着几行看起来毫不连贯的诗句，却散发着奇异的魔力。）'
  },
  {
    id:'jikang',
    name:'嵇康',
    courtesy:'叔夜',
    era:'魏晋',
    style:'竹林名士',
    identity:'竹林七贤之首',
    desc:'风姿特秀，萧萧肃肃。手抚一张古琴，旁若无人地弹奏着《广陵散》。衣袂飘飘，如神仙中人。',
    scenes:['bamboo_grove','moon_valley','biguan_peak','luori_plain'],
    poem:'息徒兰圃，秣马华山。流磻平皋，垂纶长川。目送归鸿，手挥五弦。俯仰自得，游心太玄。',
    poemTitle:'赠秀才入军（节选）',
    insight:'俯仰自得，游心太玄。真正的自由，是不为外物所累，内心逍遥自在。',
    lessons:[
      { text:'听嵇康弹一曲《广陵散》', effect:{ daoHeart:6, mood:8 }, reply:'琴声如天籁，时而慷慨激烈，时而空灵悠远。一曲终了，你久久不能言语，仿佛魂魄被洗涤过一般。' },
      { text:'请教"俯仰自得"的心境', effect:{ daoHeart:5, wisdom:4 }, reply:'（嵇康淡淡一笑）不为物喜，不为己悲。内心自在，何处不是竹林？你若有所思。' },
      { text:'感怀魏晋风骨', effect:{ daoHeart:4, mood:6 }, reply:'嵇康的风骨让你明白——人活着，不怕贫穷困顿，只怕失了那份不向世俗低头的傲骨。' }
    ],
    moodRequired:30,
    firstMeet:'（清幽的竹林中，传来一阵清越的琴声。你循声而去，只见一位风姿超凡的男子坐在溪边抚琴，手指在琴弦上飞舞，如蝴蝶穿花。）'
  }
];

// ==========================
// 场景 → 可遇到的文化名人列表
// ==========================
function getSagesForScene(sceneId) {
  return SAGES.filter(function(s) { return s.scenes.indexOf(sceneId) !== -1; });
}

// ==========================
// 检查当前场景是否有文化名人
// 返回一个随机名人（概率可控），或null
// ==========================
function pickSageForScene(sceneId) {
  var sages = getSagesForScene(sceneId);
  if (sages.length === 0) return null;
  var p = G.player;
  if (!p) return null;
  
  // 根据道心水平，概率递增（道心越高，越容易遇到）
  var dh = p.daoHeart || 50;
  var baseChance = 0.20 + (dh - 50) / 500; // 20%~46%
  if (Math.random() > baseChance) return null;
  
  // 越少遇到过的，概率越高（优先让玩家遇到新面孔）
  var metIds = p._metSages || [];
  var unseen = sages.filter(function(s) { return metIds.indexOf(s.id) === -1; });
  if (unseen.length > 0) {
    return unseen[Math.floor(Math.random() * unseen.length)];
  }
  return sages[Math.floor(Math.random() * sages.length)];
}

// ==========================
// 遇到文化名人时触发事件
// ==========================
function encounterSage(sage) {
  var p = G.player;
  if (!p) return;
  if (!p._metSages) p._metSages = [];
  if (p._metSages.indexOf(sage.id) === -1) p._metSages.push(sage.id);
  
  // 首次遇到展示登场描写
  var isFirst = p._metSages.filter(function(id) { return id === sage.id; }).length <= 1;
  if (isFirst) {
    addNarrative(sage.firstMeet, 'narr-event');
  }
  
  addNarrative('<div style="border:1px solid rgba(180,160,100,0.3);border-radius:8px;padding:10px;margin:6px 0;background:rgba(180,160,100,0.05);">' +
    '<div style="font-size:13px;font-weight:bold;color:#c9a96e;">📜 ' + sage.name + '（' + sage.identity + '）</div>' +
    '<div style="font-size:11px;color:var(--text-dim);margin:4px 0;">' + sage.desc + '</div>' +
    '<div style="border-top:1px solid rgba(255,255,255,0.1);margin:6px 0;"></div>' +
    '<div style="font-size:11px;font-style:italic;color:#b8a070;">「' + sage.poemTitle + '」</div>' +
    '<div style="font-size:12px;margin:4px 0;line-height:1.6;color:var(--text);">' + sage.poem + '</div>' +
    '<div style="font-size:10px;color:var(--accent);margin:4px 0;">💡 ' + sage.insight + '</div>' +
    '</div>', 'milestone');
  
  // 弹出交互选项
  showSageInteraction(sage);
}

// ==========================
// 文化名人交互弹窗
// ==========================
function showSageInteraction(sage) {
  var p = G.player;
  if (!p) return;
  
  // 修改道心检查——把需要的mood作为门槛而非门槛
  // 但如果心境太低，给出一个状态提示
  var moodOk = (p.mood || 50) >= sage.moodRequired;
  var moodNote = moodOk ? '' : '<div style="font-size:10px;color:var(--text-dim);margin-bottom:4px;">（你的心境还有些浮躁，但先贤并未嫌弃你——反而投来鼓励的目光）</div>';
  
  var html = '<div style="padding:4px;">';
  html += '<div style="font-size:12px;margin-bottom:8px;">' + sage.name + '吟罢，含笑望着你：「你觉得如何？」</div>';
  html += moodNote;
  
  sage.lessons.forEach(function(lesson, idx) {
    var effectsText = [];
    if (lesson.effect.daoHeart) effectsText.push('道心+' + lesson.effect.daoHeart);
    if (lesson.effect.wisdom) effectsText.push('悟性+' + lesson.effect.wisdom);
    if (lesson.effect.mood) effectsText.push('心境+' + lesson.effect.mood);
    html += '<div class="event-choice-btn" onclick="chooseSageLesson(\'' + sage.id + '\',' + idx + ')" style="margin-bottom:4px;text-align:left;font-size:11px;padding:6px 8px;">'
      + lesson.text
      + '<span style="font-size:9px;color:var(--accent);display:block;margin-top:2px;">'
      + '[' + effectsText.join(' ') + ']</span></div>';
  });
  
  html += '<div class="event-choice-btn" onclick="closeEvent();" style="background:rgba(100,100,100,0.2);">默默告辞，以后再听</div>';
  html += '</div>';
  
  showCustomModal('📜 与' + sage.name + '论道', html + '<button class="event-choice-btn" onclick="closeEvent()" style="font-size:9px;color:var(--text-dim);">关闭</button>');
}

// ==========================
// 选择感悟
// ==========================
function chooseSageLesson(sageId, lessonIdx) {
  var sage = SAGES.find(function(s) { return s.id === sageId; });
  if (!sage) return;
  var lesson = sage.lessons[lessonIdx];
  if (!lesson) return;
  var p = G.player;
  if (!p) return;
  
  var eff = lesson.effect;
  if (eff.daoHeart) {
    if (!p.daoHeart) p.daoHeart = 50;
    p.daoHeart = Math.min(200, p.daoHeart + eff.daoHeart);
  }
  if (eff.wisdom) p.wisdom = Math.min(100, (p.wisdom || 50) + eff.wisdom);
  if (eff.mood) p.mood = Math.min(100, (p.mood || 50) + eff.mood);
  
  closeEvent();
  var level = getDaoHeartLevel();
  addNarrative('💭 ' + lesson.reply, 'narr-event');
  addNarrative('<div style="font-size:11px;border-left:2px solid ' + level.color + ';padding-left:8px;margin-top:2px;color:' + level.color + ';">道心 +' + eff.daoHeart + (eff.wisdom ? ' | 悟性 +' + eff.wisdom : '') + (eff.mood ? ' | 心境 +' + eff.mood : '') + '<br>' + level.icon + ' 道心：' + level.level + '（' + (p.daoHeart || 50) + '）</div>', 'milestone');
  updateAllUI();
  
  // 道心进步奖励
  if (eff.daoHeart >= 5) {
    var bonusStones = eff.daoHeart * 10;
    p.stones += bonusStones;
    addNarrative('💰 道心精进，灵石 +' + bonusStones + '。', 'loot');
  }
  
  // 记录
  if (!p._sageDialogHistory) p._sageDialogHistory = [];
  p._sageDialogHistory.push({ sageId: sageId, lesson: lesson.text, day: G.time.day });
  
  updateAllUI();
}

// ==========================
// 文化名人出没检查（探索时触发）
// ==========================
function checkSageEncounter(sceneId) {
  if (!G.player || !G.player.isAlive) return;
  
  // 冷却：同一场景每60秒最多触发一次
  var now = Date.now();
  var lastEnc = G._lastSageEncounter || 0;
  if (now - lastEnc < 60000) return;
  
  // 自动模式下跳过动画减少打扰
  if (G._autoMode) return;
  
  var sage = pickSageForScene(sceneId);
  if (sage) {
    G._lastSageEncounter = now;
    encounterSage(sage);
  }
}

// ==========================
// 道心面板（角色面板扩展）
// ==========================
function getSageCollectionInfo() {
  var p = G.player;
  if (!p) return { metCount:0, totalCount:SAGES.length, list:[] };
  var metIds = p._metSages || [];
  var list = SAGES.map(function(s) {
    return { id:s.id, name:s.name, identity:s.identity, met: metIds.indexOf(s.id) !== -1 };
  });
  return { metCount: metIds.length, totalCount: SAGES.length, list: list };
}

// ==========================
// 导出
// ==========================
window.SAGES = SAGES;
window.getSagesForScene = getSagesForScene;
window.pickSageForScene = pickSageForScene;
window.encounterSage = encounterSage;
window.showSageInteraction = showSageInteraction;
window.chooseSageLesson = chooseSageLesson;
window.checkSageEncounter = checkSageEncounter;
window.initDaoHeart = initDaoHeart;
window.getDaoHeartLevel = getDaoHeartLevel;
window.getSageCollectionInfo = getSageCollectionInfo;
