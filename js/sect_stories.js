// === 唯我独仙 · 第二纪元「冰阁」弟子心愿剧情系统 ===
// 2026-08-04 · 门派深化③：让 50 位弟子「活」起来
//   - 每个弟子都有心愿（wish）：关联物品/材料，好感≥30 触发
//   - 帮弟子完成心愿 → 好感+15 / 贡献+10 / 弟子成长+10
//   - 好感里程碑：≥50 深谈解锁背景故事（每人3段）
//   - 心愿物品可从灵田/任务/下山历练/坊市获得——把玩法串起来

// ── 弟子心愿库（按弟子 id 固定分配，保证同一弟子每次的心愿一致） ──
// itemId 对应 ITEM_DB；desc 是心愿描述；reply 是完成时的回报对话
const DISCIPLE_WISHES = {
  // ═══ 剑脉 ═══
  'd_s_01': { itemId:'xuantie_jingcui', desc:'想重铸一柄趁手的剑，缺一块玄铁精粹', reply:'这剑，我定不负它。', bonus:'萧承影握着新铸的剑，眼底有光。' },
  'd_s_02': { itemId:'baihe_lily', desc:'想给师妹熬一壶润喉的百年灵芝汤', reply:'多谢掌门，师妹的病根该除了。', bonus:'云知秋眉眼舒展，像是卸下了心事。' },
  'd_s_03': { itemId:'yao_dan', desc:'师父的仇家是妖修，想收集妖丹祭奠', reply:'师父……我终于能去看您了。', bonus:'顾长风难得没有嬉笑，郑重向你行了一礼。' },
  'd_s_04': { itemId:'hgc_grass', desc:'想给萧师兄编个清灵草护身符，却总凑不齐', reply:'……别告诉他。', bonus:'沈青梧红着脸接过灵草，低声道了谢。' },
  'd_s_05': { itemId:'baihe_lily', desc:'练剑伤到了经脉，需要百年灵芝调养', reply:'我会走正道的，这次一定。', bonus:'陆惊鸿收下灵芝，攥紧了拳头。' },
  'd_s_06': { itemId:'ling_mi', desc:'想给母亲寄一罐灵蜂蜜，她最爱甜食', reply:'娘亲……等她尝到，就知道我过得好。', bonus:'白素衣写家书时，笔尖比往日更稳。' },
  'd_s_07': { itemId:'youming_hua', desc:'想采一朵幽冥花，献给冰系先辈的灵位', reply:'这花，与冰阁的雪一样好看。', bonus:'洛青霜在灵位前站了很久。' },
  'd_s_08': { itemId:'yao_dan', desc:'十年只练一招，想用妖丹磨剑锋', reply:'一招，也要练到极致。', bonus:'程子墨收下妖丹，又去练那同一招了。' },
  'd_s_09': { itemId:'baihe_lily', desc:'妹妹练冰法伤身，想寻百年灵芝温养', reply:'妹妹……是我唯一的亲人了。', bonus:'秋凝霜轻轻抱住妹妹，眼眶微红。' },
  'd_s_10': { itemId:'kuang_shi', desc:'想给山门铺一条铁石小路，还差些铁矿', reply:'路修好了，弟子们就不怕雨天滑了。', bonus:'方定岳扛着铁矿，笑得憨厚。' },
  'd_s_11': { itemId:'ling_mi', desc:'练剑总差一口气，想尝尝灵蜂蜜提气', reply:'甜的！练剑果然不累了！', bonus:'许燕回蹦蹦跳跳，剑花都耍得更漂亮了。' },
  'd_s_12': { itemId:'xuantie_jingcui', desc:'想给师弟们打一柄趁手的练习剑', reply:'我答应过要照顾他们的。', bonus:'宋执一打磨剑胚的手，比谁都稳。' },
  'd_s_13': { itemId:'qiannian_lingzhi', desc:'琴弦断了一根，想用千年灵芝调琴音', reply:'琴与剑，都是我的道。', bonus:'江晚吟抚琴，音色清越，绕梁三日。' },
  // ═══ 丹脉 ═══
  'd_d_01': { itemId:'du_zhang_cao', desc:'试药中了毒，急需毒瘴草以毒攻毒', reply:'咳……掌门，我又活过来了。', bonus:'苏百草讪讪一笑，又去翻药典了。' },
  'd_d_02': { itemId:'lingquan_shui', desc:'想给全阁弟子煮一壶灵泉清心茶', reply:'这茶，能让大家心静。', bonus:'温以宁煮茶的样子，像一幅画。' },
  'd_d_03': { itemId:'qiannian_lingzhi', desc:'想炼一炉起死回生的丹药，缺主药', reply:'成了！我这就开炉！', bonus:'常百味兴奋得胡子都在抖。' },
  'd_d_04': { itemId:'hgc_grass', desc:'想把《本草图鉴》补全，还差清灵草', reply:'画上这一笔，就齐了！', bonus:'林半夏认认真真画下最后一株草。' },
  'd_d_05': { itemId:'ling_mi', desc:'想给师兄师姐们做蜂蜜丹药丸', reply:'大家练功辛苦，得吃点甜的。', bonus:'秦艽艽把丹药丸分给每个人。' },
  'd_d_06': { itemId:'hgc_grass', desc:'想培育一株变异清灵草，需要同源灵草', reply:'这株草，比我的命还金贵。', bonus:'葛藤生蹲在田埂边，眼里有光。' },
  'd_d_07': { itemId:'baihe_lily', desc:'想给师父（药玄子）调理身子', reply:'师父年纪大了，得多顾着点。', bonus:'茯苓子难得正经，把灵芝细细包好。' },
  'd_d_08': { itemId:'lingquan_shui', desc:'丹房炉火太旺，想备些灵泉水镇炉', reply:'下回炸炉，就不会伤到人了。', bonus:'白芷若默默把灵泉水放在炉边。' },
  'd_d_09': { itemId:'qiannian_lingzhi', desc:'老家母亲病重，想寄千年灵芝回去', reply:'娘，儿子在冰阁过得很好。', bonus:'当归子写信时，眼里含泪却带着笑。' },
  'd_d_10': { itemId:'du_zhang_cao', desc:'想炼解毒丹，又怕自己尝错，先备好解药', reply:'炸炉归炸炉，命还是要的！', bonus:'王不留把解药贴身放好，又去点炉了。' },
  'd_d_11': { itemId:'qiannian_lingzhi', desc:'年岁大了，想炼一炉延年丹', reply:'活久一点，总能追上年轻人的。', bonus:'何首乌抚着丹炉，笑得豁达。' },
  'd_d_12': { itemId:'ling_mi', desc:'想给阿洛做蜂蜜糖，她练功累了会哭', reply:'阿洛吃了糖，就不哭了。', bonus:'木槿偷偷把糖塞给阿洛，自己先红了脸。' },
  // ═══ 符脉 ═══
  'd_f_01': { itemId:'zidian_diao', desc:'想画一张雷系灵符，缺紫电貂皮', reply:'此符一成，可护冰阁周全。', bonus:'柳画符执笔凝神，笔下雷光流转。' },
  'd_f_02': { itemId:'xuantie_jingcui', desc:'想铸一方镇阁符印，缺玄铁精粹', reply:'天时地利，皆在掌中。', bonus:'墨千机推演三遍，方才落笔。' },
  'd_f_03': { itemId:'baihe_lily', desc:'想画百福符送给大家，缺百年灵芝做符墨', reply:'人人有福，才叫福。', bonus:'祝由画符时，嘴角始终带着笑。' },
  'd_f_04': { itemId:'youming_hua', desc:'想研究幽冥符文的笔意', reply:'古人的笔意，真是玄妙。', bonus:'简素问捧着幽冥花，如获至宝。' },
  'd_f_05': { itemId:'xuantie_jingcui', desc:'想加固山门防御符阵，缺玄铁精粹', reply:'山门稳，人心就稳。', bonus:'符千山画符的手，稳如磐石。' },
  'd_f_06': { itemId:'hgc_grass', desc:'画废了太多符纸，想用清灵草制新符纸', reply:'下一张，一定是张好符！', bonus:'韦一鸣卷起袖子，干劲十足。' },
  'd_f_07': { itemId:'ling_mi', desc:'想熬制符纸用的灵胶，缺灵蜂蜜', reply:'好纸配好胶，符才灵。', bonus:'唐纸鸢细心调着灵胶，一丝不苟。' },
  'd_f_08': { itemId:'youming_hua', desc:'想画一张幽冥火符，缺幽冥花为引', reply:'幽火，也是火。', bonus:'桂沉烟的符纸上，幽蓝火光一闪而逝。' },
  'd_f_09': { itemId:'hgc_grass', desc:'想给师姐画一张平安符，缺清灵草制墨', reply:'师姐护我，我护师姐。', bonus:'杜若画符时，比任何时候都专注。' },
  // ═══ 体脉 ═══
  'd_b_01': { itemId:'xuantie_jingcui', desc:'想给演武场铸一座新的冰晶桩，缺玄铁精粹', reply:'这桩子，能扛我十年！', bonus:'石破天一拳砸在新桩上，桩子纹丝不动，他咧嘴大笑。' },
  'd_b_02': { itemId:'kuang_shi', desc:'想打一副铁护腕送给妹妹，缺铁矿', reply:'妹妹打铁，我绣花。她护我，我也护她。', bonus:'铁莲花细细打磨护腕，动作像绣花一样温柔。' },
  'd_b_03': { itemId:'kuang_shi', desc:'灵田的石头搬完了，想打一副石锁练臂力', reply:'搬石头练臂力，打石锁也是练臂力。都行！', bonus:'牛大力扛着石锁，走路带风。' },
  'd_b_04': { itemId:'yao_dan', desc:'当年猎熊时伤了旧骨，想用妖丹炼骨膏', reply:'这骨头，还能再打十年熊！', bonus:'熊天霸拍拍胸口，笑得憨直。' },
  'd_b_05': { itemId:'baihe_lily', desc:'想给师父（雪无痕）配一帖护体药酒', reply:'体修不是莽夫，我们也懂养生！', bonus:'燕无双甩甩马尾，得意地扬起下巴。' },
  'd_b_06': { itemId:'qiannian_lingzhi', desc:'身上的旧伤总在阴雨天发作，想寻千年灵芝', reply:'疤是故事，也是债。该还了。', bonus:'樊铁柱抚着肩上那道最深的疤，沉默许久。' },
  'd_b_07': { itemId:'zidian_diao', desc:'雷灵根不稳，想用雷系材料炼一枚定雷佩', reply:'雷，得听我的话才行。', bonus:'雷震子握着定雷佩，周身的电光收敛了些。' },
  'd_b_08': { itemId:'ling_mi', desc:'想给弟子居的孩子们熬一锅蜜枣汤', reply:'吃饱了，才有力气练功！', bonus:'钟无艳的大嗓门一响，弟子居都热闹起来。' },
  'd_b_09': { itemId:'xuantie_jingcui', desc:'想炼一副护心镜，替师兄弟们挡灾', reply:'我站着，就没人能倒下。', bonus:'金钟罩把护心镜擦了又擦，郑重收好。' },
  'd_b_10': { itemId:'yao_dan', desc:'想炼一枚淬体丹，追上石破天', reply:'首席之位，我也要争一争！', bonus:'石敢当把淬体丹一吞，又去演武场加练了。' },
  'd_b_11': { itemId:'hgc_grass', desc:'想给牛师兄编一个清灵草平安结', reply:'牛师兄对我好，我得记着。', bonus:'罗大力笨手笨脚地编着平安结，满脸认真。' },
  'd_b_12': { itemId:'kuang_shi', desc:'想打一柄铁簪子送给姐姐绣花时别发', reply:'姐姐绣花，我打铁。一家人嘛！', bonus:'铁芙蓉把铁簪子磨得锃亮，塞到姐姐手里。' },
  'd_b_13': { itemId:'qiannian_lingzhi', desc:'练体四十年，想炼一炉固本培元丹', reply:'四十年了，也该给自己补补了。', bonus:'擎天柱抚着丹炉，眼里有岁月的沉淀。' },
  // 符脉（补）
  'd_f_10': { itemId:'youming_hua', desc:'想用幽冥花推演一卦「天机符」', reply:'天机不可泄露……但这符，能护阁。', bonus:'卜算子拈花一笑，卦象在符纸上流转。' },
  'd_f_11': { itemId:'hgc_grass', desc:'想验证「符成与未成叠加态」，缺清灵草做对照组', reply:'看！这张符，又成又没成！', bonus:'薛定符拿着两张符，陷入了沉思。' },
  'd_f_12': { itemId:'youming_hua', desc:'想画一张幽冥冰符，缺幽冥花为引', reply:'冰与幽，本是同源。', bonus:'林听雪指尖凝霜，符纸上的冰纹如雪落。' },
};

// ── 弟子背景深谈（好感≥50解锁，每人3段） ──
const DISCIPLE_TALES = {
  'd_s_01': ['当年师父收我时，说我剑里有火。其实那火，是恨。', '我恨了十年，直到冰澜师姐说：剑是拿来护人的，不是拿来恨的。', '如今我懂了。剑里的火，该用来护住冰阁。'],
  'd_s_02': ['我爹是猎户，娘是采药人。他们教我的第一句话是：山里的东西，取之有度。', '练剑和采药一样，急不得。剑要慢，心要静。', '冰澜师姐说我悟性高。其实我只是……比旁人更舍得等。'],
  'd_s_03': ['师父死在妖修手里那年，我才九岁。他最后的剑，是挡在我身前的。', '我喝酒，是因为梦里总看见那一剑。', '等我把仇报了，这酒……就该戒了。'],
  'd_s_04': ['我是青云镇卖豆腐家的女儿。镇上人都说，女孩子学什么剑。', '我偏要学。剑握在自己手里，路才能自己走。', '萧师兄……他不知道，那天我练剑摔了十七次，他扶了我一把。'],
  'd_s_05': ['我爹总说，陆家子弟要出人头地。所以我什么都想赢。', '雪长老罚我三次，我才明白：剑道没有捷径，只有一剑一剑。', '现在我只想赢过昨天的自己。'],
  'd_s_06': ['我家原是书香门第。父亲被诬陷，家道中落。', '母亲把我送进冰阁时，只说了一句：好好活。', '我练剑，是想将来能堂堂正正回家。'],
  'd_s_07': ['我天生冰灵根，小时候没人愿意碰我——怕冻着。', '只有阿洛不怕，她拉着我的手说：姐姐的手好凉快。', '冰系天才没什么了不起。了不起的是，有人愿意靠近你。'],
  'd_s_08': ['我资质驽钝，一招剑法学了十年。', '墨长老说，此子可成大器。我知道那是安慰。', '但十年一招，一招十年。总有练成的那天。'],
  'd_s_09': ['妹妹生来体弱，爹娘把她托付给我，就走了。', '我入冰阁，不为修仙，只为让她有个安身之处。', '她若安好，我便圆满。'],
  'd_s_10': ['我曾是镖师，走南闯北三十年。', '那年被仇家围杀，是冰澜姑娘救了我。', '我这条命是冰阁的。铺路、守门、挑水，都行。'],
  'd_s_11': ['我娘是唱戏的。我小时候，最爱看她舞水袖。', '剑舞起来，像水袖一样好看——所以我练剑。', '我想有一天，把剑舞给娘看。'],
  'd_s_12': ['我是家中长子，底下五个弟妹。', '爹说，长兄如父。我练剑，是想护住他们。', '现在山门里的师弟师妹，也是我的弟妹。'],
  'd_s_13': ['我曾是琴师，一柄七弦琴，弹遍江南。', '家国乱，琴碎了。我抱着残琴入了冰阁。', '后来我发现，剑也有韵律。剑气纵横，亦是琴音。'],
  // 丹脉
  'd_d_01': ['我爹是游方郎中，死在瘟疫里。', '他临终说：百草，医者仁心。', '我试药，是想替他把没治完的病，治完。'],
  'd_d_02': ['我家世代种茶。我娘说，茶能静心。', '入冰阁后，我把茶换成了清心丹方。', '但那一盏茶的时间，我始终留着。'],
  'd_d_03': ['我爹是厨子，锅铲比剑还利。', '他教我：火候到了，菜就成了。', '炼丹也一样。火候到了，丹就成了。'],
  'd_d_04': ['我第一次见到灵草，是五岁那年，在村口的破庙里。', '那株草会发光，我看了整整一下午。', '后来我入了冰阁，才知道它叫清灵草。'],
  'd_d_05': ['我名字拗口，爹说这是药名，能辟邪。', '其实我记性最好——记得住每个人的喜好。', '这大概也是一种丹道：对症下药。'],
  'd_d_06': ['我种了二十年药，土比床亲。', '灵草有灵性，你对它好，它就对你好。', '冰阁的灵田，就是我的家。'],
  'd_d_07': ['我小时候嘴甜，街坊都叫我"小滑头"。', '进了丹房，我把嘴甜用在了哄师父上。', '但炼丹，我从不耍滑。'],
  'd_d_08': ['我不爱说话，师父说我像块木头。', '但木头也能烧火。丹房炸炉时，我冲得最快。', '护住丹房，就是护住大家的命。'],
  'd_d_09': ['我娘给我起名当归——盼我早日回家。', '可冰阁就是我的家。', '娘，儿子在冰阁，过得很好。'],
  'd_d_10': ['我炼十炉丹，炸九炉。', '但我有个本事：闻一闻，就知道丹药好坏。', '师父说，这是天赋。我说，这是炸出来的经验。'],
  'd_d_11': ['我二十七岁才入道，别人都说晚了。', '可晚入道也有好处：心定。', '活久一点，总能追上。'],
  'd_d_12': ['我胆子小，一炸炉就哭。', '但阿洛喜欢我，因为我总给她留好吃的。', '被需要的感觉，让我不那么怕了。'],
  // 体脉
  'd_b_01': ['我爹是铁匠，从小就教我：打铁先打自己。', '所以我练体，把自己当铁打。', '这身铜皮铁骨，是冰阁的盾。'],
  'd_b_02': ['我娘是绣娘，她说：一针一线，都是心意。', '我绣花时想娘，打铁时想爹。', '他们都走了。但他们教我的，我一样没丢。'],
  'd_b_03': ['我爹说，力气大是老天赏的饭。', '但我娘说，力气要用在正道上。', '给阁里搬石头，就是正道。'],
  'd_b_04': ['我当过猎户，山里什么凶兽都见过。', '最凶的不是熊，是饿肚子的人。', '入冰阁后，我再没饿过肚子。这里有家的味道。'],
  'd_b_05': ['我小时候跑得快，村里人都叫我“小旋风”。', '入冰阁后他们笑我：体修还练轻功？', '我偏要练。体修，也能身轻如燕。'],
  'd_b_06': ['我身上每道疤，都是一个不愿提起的夜。', '但疤也提醒我：我还活着。', '活着，就有还完的债。'],
  'd_b_07': ['我天生雷灵根，小时候一哭就电闪雷鸣。', '村里人都怕我，只有娘抱我。', '娘说：雷是天的脾气，你得学会跟它做朋友。'],
  'd_b_08': ['我爹是屠户，一刀下去，干净利落。', '他说：做人要像刀，直来直去。', '所以我爱笑，爱说话，爱管闲事。'],
  'd_b_09': ['我练防御，是因为小时候总挨打。', '我爹打我，我娘护我。', '现在我能替别人挡了。挺好的。'],
  'd_b_10': ['我跟石破天是一个村的。', '他练体，我也练体。他当首席，我服。', '但我不能一直服。总有一天，我要跟他掰掰手腕。'],
  'd_b_11': ['我笨，学什么都慢。', '牛师兄不嫌弃我，还教我搬石头的窍门。', '我这条命，是牛师兄的。'],
  'd_b_12': ['我姐会绣花，我不会。我会打铁。', '爹说：姐妹俩，一个绣花一个打铁，正好。', '我想姐了。她就在我身边，可我还是想她。'],
  'd_b_13': ['我三十五岁才入道，是阁里最老的弟子。', '有人笑我：这么老了还练什么。', '我练了四十年。不是天才，只是没放弃。'],
  // 符脉（补）
  'd_f_10': ['我摆摊算命二十年，算过千人，算不透自己。', '入冰阁后，我把卦象画进符里。', '符能护人。这比算命，实在多了。'],
  'd_f_11': ['我师父说，符一成，则灵。', '可我总在想：画完的那一刻，它到底算成了没有？', '也许在我看它之前，它既成又不成。'],
  'd_f_12': ['我生来冰灵根，指尖总是凉的。', '小时候没人愿意牵我的手。', '入冰阁后，师兄师姐们说：你的手，画符正好。'],
};

// ── 获取弟子心愿 ──
function getDiscipleWish(discipleId) {
  const wish = DISCIPLE_WISHES[discipleId];
  return wish || null;
}

// 心愿对话（好感≥30 时交谈触发额外选项）
function showDiscipleWish(discipleId) {
  const d = getDiscipleById(discipleId);
  if (!d) return;
  const wish = getDiscipleWish(discipleId);
  if (!wish) { addNarrative(`${d.name}摆摆手：「我没什么心愿，过好当下就好。」`, 'system'); return; }
  
  const p = G.player;
  const aff = getDiscipleAffinity(discipleId);
  if (aff < 30) {
    addNarrative(`${d.name}欲言又止：「还……还不熟，这话不好跟你说。」（好感度≥30 才能听TA的心事）`, 'system');
    return;
  }
  
  const itemDef = (typeof ITEM_DB !== 'undefined' && ITEM_DB.find ? ITEM_DB.find(i => i.id === wish.itemId) : null) || { name: wish.itemId };
  const invQty = (p.inventory || []).filter(i => i.id === wish.itemId).reduce((s, i) => s + (i.qty || 1), 0);
  const hasItem = invQty > 0;
  
  const html = `
    <div style="font-size:12px;line-height:1.9;color:var(--text);">
      <div style="text-align:center;font-size:13px;margin-bottom:8px;"><b>💭 ${d.name}的心事</b></div>
      <div style="color:var(--text-dim);font-size:11px;">${d.name}（${d.personality}）低声说道：</div>
      <div style="margin:8px 0;padding:10px;background:rgba(140,202,230,0.08);border-radius:8px;font-size:11px;line-height:1.8;color:#cde8f7;">
        「${wish.desc}。」
      </div>
      <div style="font-size:10px;color:var(--text-dim);">
        需要：${itemDef.name} ×1 ${hasItem ? '<span style="color:#7dce9a;">（背包已有 ✓）</span>' : '<span style="color:#e74c3c;">（背包没有）</span>'}
      </div>
      <div style="margin-top:10px;display:flex;flex-direction:column;gap:6px;">
        ${hasItem
          ? `<button class="event-choice-btn" onclick="fulfillDiscipleWish('${discipleId}')" style="font-size:11px;">🤝 帮TA完成心愿</button>`
          : `<button class="event-choice-btn" disabled style="font-size:11px;opacity:0.5;">背包里还没有${itemDef.name}（可去灵田/任务/下山历练获取）</button>`}
        <button class="event-choice-btn" onclick="closeEvent()" style="font-size:11px;">以后再帮她</button>
      </div>
    </div>
  `;
  
  showCustomModal(`💭 ${d.name}的心事`, html);
}

// 完成心愿
function fulfillDiscipleWish(discipleId) {
  const p = G.player;
  const d = getDiscipleById(discipleId);
  if (!d) return;
  const wish = getDiscipleWish(discipleId);
  if (!wish) return;
  
  // 扣物品
  if (!removeItemFromInventory(wish.itemId, 1)) {
    addNarrative('你翻了翻背包，发现物品不见了。', 'system');
    return;
  }
  
  // 奖励：好感+15 / 贡献+10 / 弟子成长+10
  addAffinityToDisciple(discipleId, 15);
  p.sect.merit = (p.sect.merit || 0) + 10;
  if (!p.sect.discipleGrowth) p.sect.discipleGrowth = {};
  p.sect.discipleGrowth[discipleId] = (p.sect.discipleGrowth[discipleId] || 0) + 10;
  const realm = Math.min(15, Math.floor(p.sect.discipleGrowth[discipleId] / 30));
  if (realm > (d._sectRealm || 0)) d._sectRealm = realm;
  
  // 已完心愿标记（防止重复）
  if (!p.sect.completedWishes) p.sect.completedWishes = {};
  p.sect.completedWishes[discipleId] = true;
  
  const aff = getDiscipleAffinity(discipleId);
  addNarrative(`🤝 你将${wish.desc.includes('想') ? '' : ''}${wish.itemId}交给了${d.name}。<br>「${wish.reply}」<br><span style="color:var(--text-dim);font-size:10px;">${wish.bonus} 好感+15 · 贡献+10 · ${d.name}修为精进</span>`, 'milestone');
  closeEvent();
  updateAllUI();
}

// ── 好感里程碑：交谈时触发深谈（好感≥50 有几率讲身世） ──
function maybeDiscipleTale(discipleId) {
  const d = getDiscipleById(discipleId);
  if (!d) return null;
  const aff = getDiscipleAffinity(discipleId);
  if (aff < 50) return null;
  const tales = DISCIPLE_TALES[d.id];
  if (!tales || !tales.length) return null;
  // 每次交谈有 40% 概率深谈一段（按已讲进度）
  if (Math.random() > 0.4) return null;
  const p = G.player;
  if (!p.sect.taleProgress) p.sect.taleProgress = {};
  const idx = p.sect.taleProgress[d.id] || 0;
  const tale = tales[idx % tales.length];
  p.sect.taleProgress[d.id] = idx + 1;
  return tale;
}

// ── 导出 ──
window.getDiscipleWish = getDiscipleWish;
window.showDiscipleWish = showDiscipleWish;
window.fulfillDiscipleWish = fulfillDiscipleWish;
window.maybeDiscipleTale = maybeDiscipleTale;
window.DISCIPLE_WISHES = DISCIPLE_WISHES;
window.DISCIPLE_TALES = DISCIPLE_TALES;
