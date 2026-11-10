// === 唯我独仙 · 地图细节系统 v1 (探点/资源/环境机制) ===

// ==========================
// 一、场景探点系统 (SCENE_POI)
// ==========================
// 每个场景3-5个可探索的小地名/名胜/交互点

const SCENE_POI = {
  // ═══════ 凡尘界 ═══════
  
  'qingyun': [
    { id:'qy_old_tree', name:'镇口老槐树', type:'landscape', desc:'三人合抱的古槐树，树皮皴裂如龙鳞。据说当年建镇时就有了它，有没有灵性谁也说不准。',
      interaction:{ type:'touch', text:'你伸手触碰粗糙的树皮，指尖微微发麻。', cooldownMs:600000,
        effect: function(){ 
          if(Math.random()<0.3){ addItemToInventory(ITEM_DB.find(i=>i.id==='hgc_grass'),1); addNarrative('🌿 指缝间掉下几片青翠的叶子——是清灵草！', 'loot'); }
          else { G.player.mood = Math.min(100, G.player.mood + 3); addNarrative('🍃 一阵清风拂面，心中莫名宁静。（心境+3）', 'system'); }
        }
      }
    },
    { id:'qy_market', name:'坊市大街', type:'market', desc:'青石板路两边摆满了地摊，灵材、丹药、杂货应有尽有。叫卖声此起彼伏。',
      interaction:{ type:'enter', text:'热闹的集市，你挤入人流……', cooldownMs:120000, auto:true,
        effect: function(){ showMarketModal(); }
      }
    },
    { id:'qy_inn', name:'清风楼客栈', type:'inn', desc:'二楼临街的雅座能俯瞰半条街。掌柜是个精明的中年修士，消息灵通。',
      interaction:{ type:'rest', text:'你叫了一壶灵茶，靠着窗边坐下。', cooldownMs:0,
        restMult:1.2, // 客栈休息恢复×1.2
        effect: function(){ addNarrative('🍵 灵茶入喉，四肢百骸暖洋洋的。窗外车水马龙，青云镇还是一如既往的热闹。', 'system'); }
      }
    },
    { id:'qy_temple', name:'镇后小庙', type:'shrine', desc:'一座不起眼的土地庙，香火不断。庙里的泥塑土地公笑得慈眉善目。',
      interaction:{ type:'pray', text:'你在土地公面前点了一炷香。', cooldownMs:3600000, // 1小时
        effect: function(){ G.player.mood = Math.min(100, G.player.mood + 8); addNarrative('🙏 青烟袅袅，你感到心中一片澄明。（心境+8）', 'system'); }
      }
    },
    { id:'qy_mayor', name:'镇长府', type:'building', desc:'青砖灰瓦的宅院，门楣挂着「李府」匾额。镇长老李青山在此处理政务。',
      interaction:{ type:'talk', text:'你叩响了镇长府的大门。', cooldownMs:0, auto:true,
        effect: function(){ addNarrative('🏛️ 你走进镇长府，老镇长正伏案写着什么。他抬头看见你，露出欣慰的笑容。', 'system');
          // 检查主线任务（可接）
          if(typeof acceptQuest === 'function') acceptQuest('main_lv1', true); }
      }
    },
    { id:'qy_backyard', name:'客栈后院·枯井', type:'mystery', desc:'客栈后院角落的一口枯井，青苔爬满井沿。夜深时井口似乎有微弱的幽光……',
      interaction:{ type:'peek', text:{ default:'你探头往井里看了看，漆黑一片，什么也看不见。', '夜':'井底隐约有一丝幽蓝色的光芒一闪而过。' },
        cooldownMs:300000,
        effect: function(){ 
          if(G.time.period === '夜' && G.player.qiRealmIndex+1 >= 4){
            addNarrative('🌌 你蹲在井边凝望，井底的幽光越来越亮……古井似乎在呼唤你。', 'event');
            addNarrative('💡 你的直觉告诉你，今晚就可以「通过古井进入幽冥界」。', 'system');
          } else if(G.time.period === '夜'){
            addNarrative('🌙 月光洒在井沿，井底幽深不可见。你隐约感到井中有股阴寒之气。', 'system');
          } else {
            addNarrative('☀️ 白天的枯井看起来只是个废弃的井。不过听说晚上会有不同的景象。', 'system');
          }
        }
      }
    },
  ],

  'luoxia_forest': [
    { id:'lf_banyan', name:'古榕树下', type:'landscape', desc:'遮天蔽日的千年榕树，气根如帘幕般垂落。树下落满了枯叶，踩上去沙沙作响。',
      interaction:{ type:'search', text:'你蹲下身拨开落叶，露出潮湿的泥土。', cooldownMs:3600000, // 1小时
        effect: function(){
          const roll = Math.random();
          if(roll < 0.4){ addItemToInventory(ITEM_DB.find(i=>i.id==='hgc_grass'),1); addNarrative('🌿 泥土里冒出几株清灵草！', 'loot'); }
          else if(roll < 0.6){ addItemToInventory(ITEM_DB.find(i=>i.id==='shougu'),2); addNarrative('🦴 枯叶下埋着几根粗壮的兽骨。', 'loot'); }
          else if(roll < 0.75){ addNarrative('什么都没找到，不过这里的灵气很不错。（修炼感悟+20）', 'system'); if (typeof gainCultivation === "function") gainCultivation("qi", 20); else G.player.qiCultivationPoints += 20; }
          else { addNarrative('只有枯叶和泥土。你拍了拍手上的灰。', 'system'); }
        }
      }
    },
    { id:'lf_bridge', name:'溪涧石桥', type:'landscape', desc:'一座长满青苔的石板桥横跨潺潺溪流。桥下清澈见底，偶尔有银鳞鱼逆流而上。',
      interaction:{ type:'fish', text:'你挽起袖子，伸手到桥下摸索。', cooldownMs:7200000,
        effect: function(){
          if(Math.random()<0.3){ addItemToInventory(ITEM_DB.find(i=>i.id==='yinlin_yu'),1); addNarrative('🐟 你摸到了一条银鳞鱼！活蹦乱跳的。', 'loot'); }
          else { addNarrative('💧 溪水冰凉，你洗了把脸，精神为之一振。（心境+2）', 'system'); G.player.mood = Math.min(100, G.player.mood+2); }
        }
      }
    },
    { id:'lf_hut', name:'废弃猎寮', type:'ruin', desc:'一座歪歪扭扭的木屋，屋顶已经塌了一半。门虚掩着，蛛网密布。',
      interaction:{ type:'search', text:'你推开吱呀作响的木门，屋里的灰尘扑面而来。', cooldownMs:7200000,
        effect: function(){
          const roll = Math.random();
          if(roll < 0.3){ addItemToInventory(ITEM_DB.find(i=>i.id==='cuzhi_bingqi'),1); addNarrative('🔪 角落的草堆里藏着一把粗制匕首！', 'loot'); }
          else if(roll < 0.55){ addItemToInventory(ITEM_DB.find(i=>i.id==='shougu'),3); addNarrative('🦴 墙上挂着几串干兽骨。', 'loot'); }
          else { addNarrative('🏚️ 屋里空荡荡的，猎人已经很久没回来了。', 'system'); }
        }
      }
    },
    { id:'lf_clearing', name:'林间空地', type:'battle', desc:'一处被倒下的树木围成的空地，地面寸草不生，明显是被妖兽践踏过的痕迹。',
      interaction:{ type:'wait', text:'你潜伏在空地边缘，等待猎物出现。', cooldownMs:1200000,
        effect: function(){ 
          if(typeof triggerRandomEncounter === 'function') triggerRandomEncounter('luoxia_forest'); 
          if(!G._lastCombatTriggered) addNarrative('🕊️ 等了一会儿，什么也没有。也许被你的气息吓跑了。', 'system');
        }
      }
    },
    { id:'lf_deep', name:'密林深处', type:'danger', desc:'森林最暗处，高大的树冠遮蔽了天空。空气中有股若有若无的血腥味。这里是林间虎王的领地。',
      interaction:{ type:'enter', text:'你屏住呼吸，踏入密林深处。', cooldownMs:0,
        effect: function(){
          // 尝试触发BOSS战斗
          const boss = BOSS_MONSTERS['luoxia_forest'];
          if(boss){
            const dayStr = 'day_'+G.time.day+'_luoxia_forest';
            if(!G.player._bossFought || G.player._bossFought !== dayStr){
              addNarrative('👑 树丛中闪出一双琥珀色的眼睛——林间虎王！', 'narr-combat');
              if(typeof startSceneCombat === 'function'){
                const monster = getRandomMonsterForScene('luoxia_forest');
                if(monster) startSceneCombat();
              }
            } else {
              addNarrative('🐯 虎王的巢穴空荡荡的——它今天已经被人击败过了。', 'system');
            }
          }
        }
      }
    },
  ],

  'heifeng_ridge': [
    { id:'hr_outpost', name:'山脚哨所', type:'ruin', desc:'破败的木制哨塔，曾经是守军的岗哨。现在只剩下几根朽木和一面破旗。',
      interaction:{ type:'search', text:'你在哨所废墟中翻找。', cooldownMs:7200000,
        effect: function(){
          if(Math.random()<0.25){ addItemToInventory(ITEM_DB.find(i=>i.id==='cuzhi_bingqi'),1); addNarrative('🗡️ 哨所的地板下压着一柄旧铁剑。', 'loot'); }
          else { addNarrative('除了一地瓦砾，什么也没找到。', 'system'); }
        }
      }
    },
    { id:'hr_road', name:'黑风道', type:'road', desc:'蜿蜒的山道，两侧怪石嶙峋。常年黑风呼啸，吹得人睁不开眼。',
      interaction:{ type:'pass', text:'你顶着黑风艰难前行。', cooldownMs:0,
        effect: function(){ addNarrative('💨 黑风吹得衣袍猎猎作响，你不得不运功抵挡。', 'system'); G.player.qi = Math.max(0, G.player.qi - 3); }
      }
    },
    { id:'hr_stronghold', name:'山寨大门', type:'building', desc:'粗大的木栅栏围成的寨门，门楼上几个山贼正在放哨。',
      interaction:{ type:'enter', text:'你想办法摸到寨门附近。', cooldownMs:0,
        effect: function(){ 
          if(typeof startSceneCombat === 'function'){
            const combat = startSceneCombat();
            if(combat) addNarrative('🚪 还没到门口就被山贼发现了！', 'narr-combat');
            else addNarrative('🚪 寨门紧闭，你绕着寨墙走了一圈，决定从别处翻进去。', 'system');
          }
        }
      }
    },
    { id:'hr_cliff', name:'后山断崖', type:'landscape', desc:'黑风岭最高处的断崖，风势最猛。站在崖边可以远眺碧波湖如一面银镜嵌在群山之间。',
      interaction:{ type:'view', text:{ default:'你站在断崖边，衣袍被风吹得猎猎作响。', '夕':'夕阳把碧波湖染成金色——美得让人忘记呼吸。' }, cooldownMs:3600000,
        effect: function(){
          G.player.mood = Math.min(100, G.player.mood + 5);
          addNarrative('🏔️ 极目远眺，群山如黛，碧波湖如镜。天地之大，胸中块垒一扫而空。（心境+5）', 'system');
          if(G.time.period === '夕'){
            if (typeof gainCultivation === "function") gainCultivation("qi", 30); else G.player.qiCultivationPoints += 30;
            addNarrative('🌅 夕阳西下，你心有所感，修为精进少许。（+30修为）', 'loot');
          }
        }
      }
    },
    { id:'hr_cave', name:'山腹密室', type:'mystery', desc:'聚义厅后方有一条隐蔽的地道，通向山腹中的一间小密室。',
      interaction:{ type:'enter', text:'你挪开聚义厅后面的酒柜，露出一个黑黢黢的洞口。', cooldownMs:86400000, // 1天
        effect: function(){
          // 需要钥匙
          const hasKey = G.player.inventory.some(i => i.id === 'heifeng_key');
          if(hasKey){
            addNarrative('🔑 你用「黑风的钥匙」打开密室铁门——里面堆着山贼多年搜刮的财物！', 'event');
            const stones = 50 + Math.floor(Math.random() * 100);
            G.player.stones += stones;
            addItemToInventory(ITEM_DB.find(i=>i.id==='huiqi_dan'), 2);
            removeItemFromInventory('heifeng_key', 1);
            addNarrative('💰 获得灵石×'+stones+'、回气丹×2！', 'loot');
          } else {
            addNarrative('🔒 密室的门锁着，需要一把特殊的钥匙。铁门上刻着三个字——"黑风令"。', 'system');
          }
        }
      }
    },
  ],

  'lingyun_peak': [
    { id:'lp_steps', name:'山门石阶', type:'road', desc:'999级青石台阶直通峰顶。每走一步，灵气便浓郁一分。',
      interaction:{ type:'climb', text:'你拾级而上，一步一个脚印。', cooldownMs:0,
        effect: function(){
          const progress = Math.floor(Math.random() * 100);
          if (typeof gainCultivation === "function") gainCultivation("qi", progress); else G.player.qiCultivationPoints += progress;
          addNarrative(`🧗 攀登灵云峰石阶的过程中，灵气随阶梯攀升而愈发浓郁。你趁机运转功法，修为+${progress}。`, 'system');
          if(Math.random() < 0.2) addNarrative('💡 每登一段，你都能感到经脉中灵力流动更加顺畅。', 'system');
        }
      }
    },
    { id:'lp_pavilion', name:'半山亭', type:'rest', desc:'半山腰一座石亭，亭柱上刻着不知名前辈的题诗。从这里可以俯瞰青木原的茫茫林海。',
      interaction:{ type:'rest', text:'你在石亭里盘膝坐下，云雾从身边流过。', cooldownMs:0, restMult:1.3,
        effect: function(){
          addNarrative('☁️ 半山亭小憩，云雾从身边飘过。你闭上眼，感受着天地的呼吸。', 'system');
        }
      }
    },
    { id:'lp_cave', name:'云雾洞', type:'cave', desc:'崖壁上不起眼的洞口，常年被云雾遮掩。洞内有风穿过，带着泥土和灵草的气息。',
      interaction:{ type:'enter', text:'你拨开云雾，钻进湿润的洞穴。', cooldownMs:86400000, // 1天
        effect: function(){
          const roll = Math.random();
          if(roll < 0.3){ 
            addNarrative('📜 洞壁上刻着密密麻麻的古文——是一套残缺的金系功法！（习得「金气诀」）', 'event');
            if(typeof learnSkillFromScroll === 'function') learnSkillFromScroll('jinqi');
          } else if(roll < 0.6){
            addItemToInventory(ITEM_DB.find(i=>i.id==='xuelian'),2);
            addNarrative('🌿 洞穴深处长着几株雪莲子！在微光中泛着莹白的光。', 'loot');
          } else {
            addNarrative('🕳️ 洞穴通向山体深处，但前面塌方了。你在入口处捡到几枚散落的灵石。', 'system');
            G.player.stones += 15;
          }
        }
      }
    },
    { id:'lp_sunrise', name:'观日台', type:'landscape', desc:'峰顶向东伸出的一处天然平台，是观赏日出的最佳位置。云海在脚下翻涌。',
      interaction:{ type:'view', text:{ default:'你站在观日台上，眺望东方。', '晨':'天边泛起鱼肚白，云海被染成金红色——壮丽得让人说不出话来。' }, cooldownMs:86400000,
        effect: function(){
          const isMorning = G.time.hour >= 5 && G.time.hour < 9;
          if(isMorning){
            if (typeof gainCultivation === "function") gainCultivation("qi", 150); else G.player.qiCultivationPoints += 150;
            G.player.wisdom = Math.min(100, (G.player.wisdom||50) + 3);
            addNarrative('🌅 旭日东升，紫气东来！你沐浴在晨光中若有所悟——悟性+3，修为+150！', 'event');
          } else {
            G.player.mood = Math.min(100, G.player.mood + 5);
            addNarrative('⛰️ 站在峰顶俯瞰苍茫大地，胸中豪气顿生。（心境+5）', 'system');
          }
        }
      }
    },
    { id:'lp_pond', name:'天池', type:'cultivation', desc:'峰顶的天然凹坑中积聚着一汪清澈的池水，散发着惊人的灵气——这根本不是水，是液态的灵气。',
      interaction:{ type:'drink', text:'你趴在池边掬起一捧灵液。', cooldownMs:7200000,
        effect: function(){
          if (typeof gainCultivation === "function") gainCultivation("qi", 200); else G.player.qiCultivationPoints += 200;
          addNarrative('💎 灵液入喉，如一道清泉涌入丹田！全身经脉都在欢呼雀跃！（修为+200）', 'event');
        }
      }
    },
  ],

  'lingyao_garden': [
    { id:'lg_east', name:'东圃·灵草区', type:'gather', desc:'阳光充足的开阔药圃，灵草欣欣向荣。空气中弥漫着清新的药香。',
      interaction:{ type:'gather', text:'你沿着药圃的小径缓步采撷。', cooldownMs:7200000,
        effect: function(){
          const count = 1 + Math.floor(Math.random() * 2);
          addItemToInventory(ITEM_DB.find(i=>i.id==='hgc_grass'), count);
          addNarrative(`🌿 采到 ${count} 株清灵草。`, 'loot');
          if(Math.random() < 0.2){
            addItemToInventory(ITEM_DB.find(i=>i.id==='baihe_lily'), 1);
            addNarrative('🍄 意外发现一株藏在草丛中的灵芝！', 'loot');
          }
        }
      }
    },
    { id:'lg_west', name:'西圃·灵药区', type:'gather', desc:'阴凉潮湿的药圃角落，长着喜阴的名贵药材。这里的气温明显低于别处。',
      interaction:{ type:'gather', text:'你蹲下身细心寻找名贵药材。', cooldownMs:10800000, // 3小时
        effect: function(){
          if(Math.random() < 0.35){
            addItemToInventory(ITEM_DB.find(i=>i.id==='baihe_lily'), 1);
            addNarrative('🍄 找到一株肥美的灵芝！', 'loot');
          } else {
            addItemToInventory(ITEM_DB.find(i=>i.id==='hgc_grass'), 2);
            addNarrative('🌿 采到两株清灵草，虽然不算名贵但胜在新鲜。', 'loot');
          }
        }
      }
    },
    { id:'lg_hut', name:'守园小屋', type:'building', desc:'老药农的简陋住所。门前挂着几串晾干的药材，屋里传出阵阵草药味。',
      interaction:{ type:'talk', text:'你敲了敲虚掩的木门。', cooldownMs:0,
        effect: function(){
          const hasQuest = (G.player.activeQuests||[]).some(q => q === 'lingyao_guard');
          if(!hasQuest && !(G.player.completedQuests||[]).includes('lingyao_guard')){
            addNarrative('🚪 守园老人见你来了，放下手中的活计：「年轻人来得正好，那些畜生又来糟蹋我的灵药了……」', 'narr-event');
            if(typeof acceptQuest === 'function') acceptQuest('lingyao_guard', true);
          } else {
            addNarrative('🚪 守园老人在屋里熬药，咕嘟咕嘟的声响伴着药香飘出来。他招呼你进来坐。', 'system');
          }
        }
      }
    },
    { id:'lg_secret', name:'藤蔓暗门', type:'mystery', desc:'药园最深处的一面石壁被厚厚的藤蔓覆盖。你隐约看到藤蔓下面有规则的缝隙——是一扇门。',
      interaction:{ type:'reveal', text:'你拨开藤蔓，露出一扇布满符文的石门。', cooldownMs:0,
        effect: function(){
          addNarrative('🗿 石门上刻着一句警告：「擅入者·丹火焚身」。下面还有一行小字——"需纯木灵根方可入内"。', 'event');
          if(G.player.spiritRoots.includes('木') && G.player.spiritRoots.length === 1){
            addNarrative('🌿 你的纯木灵根与石门共鸣，符文依次亮起……石门缓缓打开了！', 'event');
            addNarrative('🏺 密室中放着一尊古朴的炼丹炉，炉下压着一卷残破的丹方——「炼丹入门」。', 'event');
            // 这里可以触发炼丹系统开启
            G.player._hasAlchemyFurnace = true;
            addItemToInventory(ITEM_DB.find(i=>i.id==='huojing_cao'), 3);
          } else {
            addNarrative('🔒 你的灵根不够纯粹，石门纹丝不动。', 'system');
          }
        }
      }
    },
  ],

  'bibo_lake': [
    { id:'bl_shore', name:'湖畔柳岸', type:'landscape', desc:'碧波湖南岸的柳树林，细长的柳枝垂入水中，随波荡漾。',
      interaction:{ type:'rest', text:'你在柳树下找了块平整的石头坐下。', cooldownMs:0, restMult:1.1,
        effect: function(){ addNarrative('🌊 微风吹过湖面，送来清凉的水汽。柳枝轻拂脸颊，惬意极了。', 'system'); }
      }
    },
    { id:'bl_pier', name:'木栈桥', type:'building', desc:'延伸到湖心的木质栈桥，桥柱上长满了青苔。据说是百年前一位修士所建。',
      interaction:{ type:'fish', text:'你在栈桥尽头坐下，长杆垂入碧水中。', cooldownMs:3600000,
        effect: function(){
          const roll = Math.random();
          if(roll < 0.25){ addItemToInventory(ITEM_DB.find(i=>i.id==='yinlin_yu'),1); addNarrative('🐟 银光一闪！一条肥美的银鳞鱼上钩了！', 'loot'); }
          else if(roll < 0.4){ addNarrative('🎣 浮标轻轻晃动，你把杆拉上来——什么也没有。', 'system'); }
          else if(roll < 0.48){ addItemToInventory(ITEM_DB.find(i=>i.id==='posun_lingshi'),1); addNarrative('🎣 钓起来一个锈蚀的铁盒，打开一看……一枚破损的灵石。聊胜于无。', 'loot'); }
          else if(roll < 0.51){ addNarrative('🎣 杆子猛地一沉！你费了好大劲才拉上来——是一块沉在水底的古玉！', 'event');
            addItemToInventory(ITEM_DB.find(i=>i.id==='guyu_pei'), 1); }
          else { addNarrative('🎣 安静的午后，只有水波轻拍桥柱的声音。虽然没有收获，但心静下来了。（心境+3）', 'system'); G.player.mood = Math.min(100, G.player.mood+3); }
        }
      }
    },
    { id:'bl_island', name:'湖心岛', type:'explore', desc:'湖中央的小岛，岛上长满了翠绿的竹林。需要划船或轻功才能过去。',
      interaction:{ type:'swim', text:'你深吸一口气，运起轻功踏水而行。', cooldownMs:0,
        effect: function(){
          G.player.qi = Math.max(0, G.player.qi - 20);
          addNarrative('💦 你踏着水面飞掠而过，水花在脚下绽放。登上岛时，鞋子已经被湖水浸透。', 'system');
          if(Math.random() < 0.3){
            addItemToInventory(ITEM_DB.find(i=>i.id==='lingquan_shui'), 2);
            addNarrative('🌊 岛上有个小水洼，水质清冽——灵气盎然！你装了两壶。', 'loot');
          }
          if(Math.random() < 0.15){
            addItemToInventory(ITEM_DB.find(i=>i.id==='shui_lingzhu'), 1);
            addNarrative('💎 竹根下嵌着一枚水蓝色的珠子——水灵珠！', 'event');
          }
        }
      }
    },
    { id:'bl_dock', name:'老渔夫码头', type:'building', desc:'一座简陋的小码头，停着老渔夫的小木船。船底长满了藤壶。',
      interaction:{ type:'talk', text:'老渔夫正坐在船头补渔网。', cooldownMs:0,
        effect: function(){
          const hasQuest = (G.player.activeQuests||[]).some(q => q === 'bibo_fish');
          if(!hasQuest && !(G.player.completedQuests||[]).includes('bibo_fish')){
            addNarrative('👨‍🌾 渔夫老李抬头看见你，咧嘴一笑：「哈哈，来得正好！湖里最近银鳞鱼群来了，我这条破船一个人忙不过来。一起？」', 'narr-event');
            if(typeof acceptQuest === 'function') acceptQuest('bibo_fish', true);
          } else {
            addNarrative('👨‍🌾 老渔夫朝你挥了挥手，继续埋头补网。', 'system');
          }
        }
      }
    },
    { id:'bl_tear_spot', name:'湖心深潭', type:'mystery', desc:'湖心岛南侧一片墨蓝色的深潭，传说上古神女在此陨落，泪水沉入潭底凝结成琥珀。',
      interaction:{ type:'dive', text:'你屏住呼吸，潜入幽深的潭底。', cooldownMs:86400000,
        effect: function(){
          // 🔧 解封材料可重复采集（24h冷却）：一次 4 个，已有也叠加
          var exist = G.player.inventory.find(i => i.id === 'ice_fairy_tear');
          if (exist) {
            exist.qty = (exist.qty || 1) + 4;
            addNarrative('💧 潭底又凝出四枚冰魄泪——上古神女之泪，永世不化。（冰魄泪+4）', 'loot');
          } else {
            addItemToInventory(ITEM_DB.find(i=>i.id==='ice_fairy_tear'), 4);
            addNarrative('💧 潭底一块琥珀散发着微光——冰魄泪！上古神女陨落时的泪滴，凝结成永世不化的琥珀。', 'milestone');
            var unTear = (typeof iceFairyUnsealNote === 'function') ? iceFairyUnsealNote('冰魄泪', 4) : '';
            if (unTear) addNarrative(unTear, 'quest');
          }
          if(typeof updateAllUI === 'function') updateAllUI();
        }
      }
    },
  ],

  // ═══════ 幽冥界 ═══════

  'youming_grotto': [
    { id:'yg_entrance', name:'鬼窟入口', type:'gate', desc:'一个被阴风环绕的幽深洞口，洞口周围寸草不生。踏入洞口的瞬间，温度骤降。',
      interaction:{ type:'enter', text:'你运起护体真气，踏入幽冥鬼窟。', cooldownMs:0,
        effect: function(){ addNarrative('🌬️ 洞内阴风扑面，暗绿色的鬼火在深处漂浮不定。', 'system'); }
      }
    },
    { id:'yg_skulls', name:'骷髅冢', type:'danger', desc:'堆积如山的骸骨。有的属于妖兽，有的属于修士，千百年过去早已分不清彼此。',
      interaction:{ type:'search', text:'你小心翼翼地翻找骸骨堆。', cooldownMs:7200000,
        effect: function(){
          if(Math.random()<0.4){
            const count = 1 + Math.floor(Math.random() * 2);
            addItemToInventory(ITEM_DB.find(i=>i.id==='gufen'), count);
            addNarrative('🦴 骸骨间散落着一些骨粉。你收集了' + count + '份。', 'loot');
          } else if(Math.random()<0.2){
            addNarrative('💀 指尖触到一枚温润的东西——是修士的遗骨，指骨上还套着一枚储物指环。', 'event');
            G.player.stones += 30;
            addItemToInventory(ITEM_DB.find(i=>i.id==='lingzu_cuijian'), 1);
          } else {
            addNarrative('🕯️ 骸骨之下什么也没有。鬼火在你身后忽明忽灭。', 'system');
          }
        }
      }
    },
    { id:'yg_corridor', name:'鬼火走廊', type:'road', desc:'漂浮着幽蓝色鬼火的长长甬道。鬼火看似美丽却暗藏灼伤之力。',
      interaction:{ type:'pass', text:'你小心翼翼地穿行在鬼火之间。', cooldownMs:0,
        effect: function(){
          if(Math.random() < 0.3){
            const dmg = 5 + Math.floor(Math.random() * 10);
            G.player.hp = Math.max(1, G.player.hp - dmg);
            addNarrative(`🔥 一团鬼火突然爆燃！你躲闪不及被灼伤了（-${dmg}HP）。`, 'system');
          } else {
            addNarrative('🌀 鬼火在你身边幽幽飘舞，你屏住呼吸悄然穿过。', 'system');
          }
        }
      }
    },
    { id:'yg_altar', name:'深处祭坛', type:'shrine', desc:'昏暗角落里的石祭坛，坛面刻满了扭曲的符文。祭坛中央有一个浅浅的凹槽。',
      interaction:{ type:'offering', text:'祭坛上还有残留的香灰——这里曾经有人献祭过。', cooldownMs:86400000,
        effect: function(){
          const hasOffering = G.player.inventory.some(i => i.id === 'youming_hua');
          if(hasOffering){
            addNarrative('🌸 你将幽冥花放在祭坛上。花瓣化为黑光融入符文——祭坛震动，石台裂开一道缝！', 'event');
            addItemToInventory(ITEM_DB.find(i=>i.id==='mingfu_ling'), 1);
            removeItemFromInventory('youming_hua', 1);
            addNarrative('📜 石缝中滚出一枚冥府令牌。', 'loot');
          } else {
            addNarrative('🔮 祭坛似乎在渴求什么——你需要献上一朵「幽冥花」才能触发它的力量。', 'system');
          }
        }
      }
    },
  ],

  'underground_river': [
    { id:'ur_ferry', name:'暗河渡口', type:'building', desc:'暗河之畔有一个简陋的石造渡口，系着一艘半沉的石船。船头挂着的一盏油灯居然还在亮着。',
      interaction:{ type:'board', text:'你踏上石船，船身微微一沉。', cooldownMs:0,
        effect: function(){
          addNarrative('🚣 石船沿着暗河缓缓前行。河水漆黑如墨，两岸的钟乳石在火光中投出怪异的影子。', 'system');
          G.player.qi = Math.max(0, G.player.qi - 5);
          if(Math.random() < 0.2){
            addNarrative('💎 船行至河中心时，你看到河底有什么东西在发光——是一枚灵石！你探手捞起。', 'loot');
            G.player.stones += 20;
          }
        }
      }
    },
    { id:'ur_stalactite', name:'钟乳石洞', type:'landscape', desc:'头顶密密麻麻的钟乳石如利剑倒悬。水滴顺着石尖滴落，发出空灵的声响。',
      interaction:{ type:'collect', text:'你找到一个水滴滴落最密集的位置，用玉瓶接取。', cooldownMs:3600000,
        effect: function(){
          addItemToInventory(ITEM_DB.find(i=>i.id==='lingquan_shui'), 1);
          addNarrative('💧 接满一玉瓶钟乳石滴落的灵泉水。（灵泉水×1）', 'loot');
          if(Math.random() < 0.1){
            addNarrative('💠 水珠中混入一滴银白色的钟乳石髓——这是炼制突破丹药的珍稀材料！', 'event');
            addItemToInventory(ITEM_DB.find(i=>i.id==='qiannian_lingzhi'), 1);
          }
        }
      }
    },
    { id:'ur_rapids', name:'暗河激流', type:'danger', desc:'河水突然变得湍急，白色的水花拍打着岸边的岩石。对岸似乎有个洞穴入口。',
      interaction:{ type:'cross', text:'你必须涉水渡过这段急流。', cooldownMs:0,
        effect: function(){
          const dodge = G.player.skills.reduce((sum,sk)=>{
            const sd = (G.skillData||[]).find(d=>d.id===sk.id);
            return sd&&sk.active&&sd.effects&&sd.effects.dodge ? sum+sd.effects.dodge : sum;
          }, 0);
          if(Math.random() < 0.3 + dodge){
            addNarrative('🌊 你脚步稳健地涉水而过，虽然浑身湿透但总算安全到达对岸。', 'system');
            G.player.qi = Math.max(0, G.player.qi - 10);
          } else {
            const dmg = 10 + Math.floor(Math.random() * 15);
            G.player.hp = Math.max(1, G.player.hp - dmg);
            G.player.qi = Math.max(0, G.player.qi - 20);
            addNarrative(`🌊 激流把你冲倒了！你被卷着撞上岩石，浑身是伤（-${dmg}HP）。好不容易爬上岸。`, 'system');
          }
        }
      }
    },
  ],

  'duzhang_swamp': [
    { id:'ds_mist', name:'毒瘴弥漫', type:'danger', desc:'墨绿色的瘴气在沼泽上低低地浮动，空气刺鼻。',
      interaction:{ type:'enter', text:'你撕下一块衣角蒙住口鼻，踏入毒瘴区。', cooldownMs:0,
        effect: function(){
          const poisonResist = G.player.inventory.some(i => i.id === 'du_zhang_cao') ? 0.5 : 0.1;
          if(Math.random() < poisonResist){
            addNarrative('🌿 你嘴里的毒瘴草叶片发挥了作用，瘴气对你影响不大。', 'system');
          } else {
            const dmg = 5 + Math.floor(Math.random() * 8);
            G.player.hp = Math.max(1, G.player.hp - dmg);
            addNarrative(`💨 毒瘴呛入咽喉，你感到一阵头晕目眩（-${dmg}HP）。`, 'system');
          }
        }
      }
    },
    { id:'ds_flower', name:'幽冥花田', type:'gather', desc:'沼泽深处一片相对干燥的高地，开着几朵漆黑如墨的幽冥花。花瓣如同暗色的琉璃。',
      interaction:{ type:'gather', text:'你小心翼翼地摘下幽冥花。', cooldownMs:14400000, // 4小时
        effect: function(){
          addItemToInventory(ITEM_DB.find(i=>i.id==='youming_hua'), 1);
          addNarrative('🌺 你摘下一朵幽冥花，花瓣触手冰凉，幽香扑鼻。', 'loot');
          if(Math.random() < 0.2){
            addItemToInventory(ITEM_DB.find(i=>i.id==='du_zhang_cao'), 2);
            addNarrative('🌿 花丛中居然还藏着几株毒瘴草！', 'loot');
          }
        }
      }
    },
    { id:'ds_ruins', name:'沉没石碑', type:'ruin', desc:'半截石碑从沼泽中斜插出来，碑文已经模糊不清。',
      interaction:{ type:'read', text:'你费了九牛二虎之力把石碑拉正，仔细辨认上面的字迹。', cooldownMs:0,
        effect: function(){
          if(G.player.wisdom >= 55){
            addNarrative('📜 碑文用古篆书写：「沼泽之下，冰窟相连。万载寒冰，封一上古遗骸。」', 'event');
            addNarrative('💡 你心中隐约有了一种紧迫感——冰风石窟深处藏着什么。', 'system');
            if (typeof gainCultivation === "function") gainCultivation("qi", 50); else G.player.qiCultivationPoints += 50;
          } else {
            addNarrative('📜 石碑上的字你基本认不出来，只零星辨认出几个字——"冰"、"封"、"骸"。', 'system');
            addNarrative('💡 你的悟性还不够解读完整碑文（需要悟性55以上）。', 'system');
          }
        }
      }
    },
  ],

  'bingfeng_grotto': [
    { id:'bg_icewall', name:'冰晶走廊', type:'road', desc:'洞壁上凝结着厚厚的冰层，晶莹剔透如水晶宫殿。呼气成霜，睫毛上挂满了冰屑。',
      interaction:{ type:'pass', text:'你裹紧衣袍在冰晶走廊中穿行。', cooldownMs:0,
        effect: function(){
          const fireSkill = G.player.skills.some(sk => {
            const sd = (G.skillData||[]).find(d=>d.id===sk.id);
            return sk.active && sd && sd.element === '火';
          });
          if(fireSkill){
            addNarrative('🔥 你运转火系功法，体温回升，冰寒对你构不成威胁。', 'system');
          } else {
            const dmg = 3 + Math.floor(Math.random() * 5);
            G.player.hp = Math.max(1, G.player.hp - dmg);
            addNarrative(`❄️ 刺骨的寒气侵入骨髓，你冻得发抖（-${dmg}HP）。`, 'system');
          }
        }
      }
    },
    { id:'bg_crystal', name:'冰晶矿脉', type:'gather', desc:'洞壁上嵌着一片天然形成的冰晶，在幽暗中闪烁着七彩光芒。',
      interaction:{ type:'mine', text:'你用剑柄敲击冰面，撬下一块冰晶。', cooldownMs:7200000,
        effect: function(){
          addItemToInventory(ITEM_DB.find(i=>i.id==='shougu'), 2);
          addNarrative('💎 冰晶入手冰凉，在掌心中散发着微光。算是上好的炼器材料。（+2兽骨，可作冰晶替代）', 'loot');
        }
      }
    },
    { id:'bg_frozen_pond', name:'万年冰潭', type:'cultivation', desc:'洞穴深处一汪永不冻结的深潭，潭水漆黑如墨，散发着惊人的寒意。',
      interaction:{ type:'meditate', text:'你在冰潭边盘膝坐下，寒气沿着地面渗入身体。', cooldownMs:7200000,
        effect: function(){
          if (typeof gainCultivation === "function") gainCultivation("qi", 150); else G.player.qiCultivationPoints += 150;
          addNarrative('🧘 极寒之气刺激着你的经脉，你的灵力运转速度大幅提升！（修为+150）', 'event');
          if(G.player.spiritRoots.includes('水') || G.player.spiritRoots.includes('金')){
            if (typeof gainCultivation === "function") gainCultivation("qi", 50); else G.player.qiCultivationPoints += 50;
            addNarrative('💧 你体内的水/金灵根与极寒之力共鸣，收获更多！（额外+50修为）', 'event');
          }
        }
      }
    },
    { id:'ice_coffin_chamber', name:'万载冰窟', type:'mystery', desc:'冰湖后方一条隐蔽的冰道，通向极深处。尽头隐约可见一座由万年玄冰制成的巨大棺椁——里面躺着一个绝美的女子。',
      interaction:{ type:'mystery', text:'', cooldownMs:0,
        effect: function(){ if(typeof enterIceCoffinChamber==='function') enterIceCoffinChamber(); }
      }
    },
    { id:'bg_jade_vein', name:'寒玉髓脉', type:'gather', desc:'冰风石窟最深处岩壁上嵌着一块通体透亮的寒玉髓，深埋地心万年凝结而成。',
      interaction:{ type:'mine', text:'你运起灵力，将寒玉髓从岩壁中完整地剥离下来。', cooldownMs:86400000,
        effect: function(){
          // 🔧 解封材料可重复采集（24h冷却）：一次 4 个，已有也叠加
          var exist = G.player.inventory.find(i => i.id === 'ice_fairy_jade');
          if (exist) {
            exist.qty = (exist.qty || 1) + 4;
            addNarrative('💠 岩壁深处又凝出四块寒玉髓——深埋地心万年的玉髓，通体冰凉。（寒玉髓+4）', 'loot');
          } else {
            addItemToInventory(ITEM_DB.find(i=>i.id==='ice_fairy_jade'), 4);
            addNarrative('💠 寒玉髓入手，通体冰凉，内部流转着幽蓝的灵光——深埋地心万年凝结的玉髓！', 'milestone');
            var unJade = (typeof iceFairyUnsealNote === 'function') ? iceFairyUnsealNote('寒玉髓', 4) : '';
            if (unJade) addNarrative(unJade, 'quest');
          }
          if(typeof updateAllUI === 'function') updateAllUI();
        }
      }
    },
    // ❄️ 第二纪元：冰阁禁地入口（仅冰阁弟子可见互动）
    { id:'bg_sect_forbidden', name:'冰阁禁地入口', type:'gate', desc:'冰风石窟最深处，一道流转着蓝光的古老结界横亘在冰道尽头。结界上隐约映着两个名字——「罗峰」「百里冰」。',
      interaction:{ type:'enter', text:'你走到结界前，冰晶信物在怀中微微发烫。', cooldownMs:0,
        effect: function(){
          if (typeof sectForbiddenEnter === 'function') sectForbiddenEnter();
          else addNarrative('你伸手触碰结界，一道蓝光闪过，却什么也没发生。', 'system');
        }
      }
    },
  ],

  'guji_ruins': [
    { id:'gr_columns', name:'残破石柱', type:'ruin', desc:'一排倒塌的石柱横七竖八地躺在地上，柱身刻满了精美的浮雕——描绘着上古修士与妖兽战斗的场景。',
      interaction:{ type:'examine', text:'你蹲下身细细查看石柱上的浮雕。', cooldownMs:0,
        effect: function(){
          if(G.player.wisdom >= 60){
            addNarrative('🏛️ 你从浮雕中的战斗姿势中领悟到一丝攻伐之道的真谛。（修为+80）', 'event');
            if (typeof gainCultivation === "function") gainCultivation("qi", 80); else G.player.qiCultivationPoints += 80;
          } else {
            addNarrative('🏛️ 浮雕精美绝伦，但你无法参透其中的奥义。（需要悟性≥60）', 'system');
          }
        }
      }
    },
    { id:'gr_altar', name:'废墟祭坛', type:'shrine', desc:'残破的祭坛上刻着一个上古阵法，阵眼处有一个凹槽，形状像是一枚令牌。',
      interaction:{ type:'offering', text:'你靠近祭坛，上面的符文微微发光。', cooldownMs:86400000,
        effect: function(){
          const hasToken = G.player.inventory.some(i => i.id === 'mingfu_ling');
          if(hasToken){
            addNarrative('🗿 你将冥府令牌嵌入凹槽。祭坛轰鸣，一道光柱冲天而起——脚下裂开一个地道！', 'event');
            addNarrative('📜 地道中藏着一个石匣，里面有一柄清风剑和一卷功法。', 'event');
            addItemToInventory(ITEM_DB.find(i=>i.id==='qingfeng_jian'), 1);
            if(typeof learnSkillFromScroll === 'function') learnSkillFromScroll('swift_step');
            removeItemFromInventory('mingfu_ling', 1);
          } else {
            addNarrative('🔮 祭坛在等待——你需要找到一枚「冥府令牌」来激活它。', 'system');
          }
        }
      }
    },
    { id:'gr_statue', name:'残破雕像', type:'landscape', desc:'一尊无头的修士石像，手持一柄断剑。虽然是石头雕成，但剑意仍然凌厉逼人。',
      interaction:{ type:'insight', text:'你盘膝坐在石像前，感受着残留在石像上的剑意。', cooldownMs:86400000,
        effect: function(){
          if (typeof gainCultivation === "function") gainCultivation("qi", 120); else G.player.qiCultivationPoints += 120;
          G.player.wisdom = Math.min(100, (G.player.wisdom||50) + 1);
          addNarrative('⚔️ 石像残留的剑意冲入你的识海——虽然只是一缕残意，却让你的道心更加坚定！（修为+120，悟性+1）', 'event');
        }
      }
    },
  ],

  // ═══════ 通天路 ═══════

  'leiyin_temple': [
    { id:'lt_gate', name:'山门废墟', type:'ruin', desc:'当年雷音古刹的山门，如今只剩下两根石柱和半块匾额。匾上「雷音」二字仍清晰可辨。',
      interaction:{ type:'enter', text:'你穿过山门废墟，脚下的碎瓦发出清脆的响声。', cooldownMs:0,
        effect: function(){ addNarrative('🚪 踏入古刹的瞬间，你感到一股庄严的气息扑面而来——这里曾经是佛门圣地。', 'system'); }
      }
    },
    { id:'lt_hall', name:'大雄宝殿', type:'building', desc:'主殿已坍塌大半，只剩一尊残破的佛像端坐在废墟中。佛像低垂着眼睑，神情悲悯。',
      interaction:{ type:'search', text:'你在大殿废墟中搜索。', cooldownMs:7200000,
        effect: function(){
          if(Math.random()<0.3){ addItemToInventory(ITEM_DB.find(i=>i.id==='yuangi_jiejing'),2); addNarrative('📿 佛像前的蒲团下压着两枚怨气结晶。', 'loot'); }
          else { addNarrative('🏚️ 废墟中除了一地瓦砾什么也没有。', 'system'); }
        }
      }
    },
    { id:'lt_bell', name:'钟楼', type:'building', desc:'一座锈迹斑斑的古钟悬在木架上，钟身刻满了梵文经咒。',
      interaction:{ type:'ring', text:'你握住钟槌，用力撞向古钟。', cooldownMs:0,
        effect: function(){
          // 敲钟累计（存储到玩家对象，避免全服共享）
          if(!G.player._leiyinBellCount) G.player._leiyinBellCount = 0;
          G.player._leiyinBellCount++;
          var count = G.player._leiyinBellCount;
          if(count >= 7){
            addNarrative('🔔 第七声钟响，古钟炸开一片金光！你身上的所有负面状态都被净化了！', 'event');
            G.player.hp = Math.min(G.player.maxHp, G.player.hp + 50);
            G.player.qi = Math.min(G.player.maxQi, G.player.qi + 30);
            G.player.mood = Math.min(100, G.player.mood + 10);
            G.player._leiyinBellCount = 0;
          } else {
            addNarrative('🔔 钟声在古刹中回荡，让人心神澄明。已经敲了' + count + '次。', 'system');
            G.player.mood = Math.min(100, G.player.mood + 1);
          }
        }
      }
    },
    { id:'lt_crypt', name:'地宫入口', type:'mystery', desc:'大雄宝殿的佛像底座下有一块地砖看起来有些松动。',
      interaction:{ type:'open', text:'你撬开地砖，露出一个幽深的入口。', cooldownMs:86400000,
        effect: function(){
          addNarrative('🕳️ 你顺着石阶走下地宫。空气潮湿而沉闷，石壁上刻满了佛家真言。', 'system');
          const roll = Math.random();
          if(roll < 0.3){
            addNarrative('📜 地宫密室中，一尊金身罗汉的遗骸仍保持打坐姿态。膝上摊着一卷泛黄的经书——「三昧真火诀」！', 'event');
            if(typeof learnSkillFromScroll === 'function') learnSkillFromScroll('sanmei');
          } else if(roll < 0.6){
            addItemToInventory(ITEM_DB.find(i=>i.id==='podi_dan'), 2);
            addNarrative('💊 地宫的供桌上放着两枚破壁丹，旁边还有一小堆灵石。', 'loot');
            G.player.stones += 40;
          } else {
            addNarrative('🕳️ 地宫是空的。不过在墙角你发现了一行刻字——"有缘人，须弥山下见。"', 'event');
          }
        }
      }
    },
  ],

  'xuantie_mine': [
    { id:'xm_entrance', name:'矿洞口', type:'gate', desc:'深邃的矿洞入口，洞壁上布满了开凿的痕迹。洞口堆积着废弃的矿石渣。',
      interaction:{ type:'enter', text:'你点燃火把，踏入幽暗的矿洞。', cooldownMs:0,
        effect: function(){ addNarrative('⛏️ 矿洞内回声空旷，隐约能听到深处传来的敲击声。你握紧武器，警惕前行。', 'system'); }
      }
    },
    { id:'xm_vein', name:'主矿脉', type:'gather', desc:'洞壁上嵌着一条半米宽的黑色矿脉，在火把照耀下闪烁着金属的光泽。',
      interaction:{ type:'mine', text:'你运起灵力，剑尖精准地撬下一块矿石。', cooldownMs:7200000,
        effect: function(){
          const roll = Math.random();
          if(roll < 0.3){ addItemToInventory(ITEM_DB.find(i=>i.id==='xuantie_jingcui'),1); addNarrative('💎 挖到一块玄铁精粹！质量上乘。', 'loot'); }
          else { addNarrative('🪨 敲下一块普通玄铁矿石，虽然不值钱但也算收获。', 'system'); G.player.stones += 5; }
        }
      }
    },
    { id:'xm_camp', name:'废弃营地', type:'ruin', desc:'矿道拐角处有一处被遗弃的矿工营地，铺盖已经腐烂，只剩下几件破旧的工具。',
      interaction:{ type:'search', text:'你翻看矿工留下的遗物。', cooldownMs:0,
        effect: function(){
          addNarrative('📖 一本泛黄的矿工日记——「第37日，洞内听到怪声。老赵说看到了岩石走路。我们都觉得他在说胡话，直到……」后面的字迹潦草无法辨认。', 'event');
          addNarrative('💡 矿洞深处可能有「岩石巨兽」出没——小心一点。', 'system');
          G.player.stones += 10;
        }
      }
    },
  ],

  'yumu_forest': [
    { id:'yf_path', name:'玉石小径', type:'road', desc:'铺满青白玉石碎片的林间小道。走在上面脚下会发出清脆的声响。',
      interaction:{ type:'walk', text:'你沿着玉石小径缓步前行。', cooldownMs:0,
        effect: function(){
          G.player.mood = Math.min(100, G.player.mood + 3);
          addNarrative('✨ 玉石在脚下发出清脆的鸣响。林中静谧，只有风吹过玉木叶片的叮咚声。', 'system');
        }
      }
    },
    { id:'yf_ancient', name:'千年玉木', type:'landscape', desc:'林中最大的一株玉木，树干需五人合抱。树皮如同温润的白玉，内部隐隐有灵光流转。',
      interaction:{ type:'touch', text:'你将手掌贴在玉木树干上。', cooldownMs:7200000,
        effect: function(){
          addNarrative('🌳 一股温润的木灵之力从树干传入体内，你感到生命气息充盈全身。（修为+100）', 'event');
          if (typeof gainCultivation === "function") gainCultivation("qi", 100); else G.player.qiCultivationPoints += 100;
          G.player.hp = Math.min(G.player.maxHp, G.player.hp + 30);
        }
      }
    },
    { id:'yf_spring', name:'精灵泉', type:'rest', desc:'一汪泛着玉色光泽的泉水，泉底铺满了温润的卵石。水气氤氲。',
      interaction:{ type:'drink', text:'你掬起一捧泉水送入口中。', cooldownMs:86400000,
        effect: function(){
          G.player.hp = G.player.maxHp;
          G.player.qi = G.player.maxQi;
          G.player.mood = Math.min(100, G.player.mood + 8);
          addNarrative('💧 精灵泉水入口甘甜芬芳，全身的疲惫一扫而空！', 'event');
        }
      }
    },
    { id:'yf_spirit', name:'林中精灵', type:'mystery', desc:'林间偶尔能看到半透明的光影在树木间飘忽。它们似乎对你有好奇心。',
      interaction:{ type:'wait', text:{ default:'你在林中静静等待。', '夕':'夕阳透过玉木林洒下琥珀色的光斑。' }, cooldownMs:0,
        effect: function(){
          if(G.time.period === '夕' || G.time.period === '夜'){
            addNarrative('🧚 一个巴掌大小的光团从玉木后探出头来，围着你转了一圈，洒下一片星光。', 'event');
            G.player.wisdom = Math.min(100, (G.player.wisdom||50) + 2);
            G.player.mood = Math.min(100, G.player.mood + 5);
            addNarrative('✨ 星光入体，你感到灵台清明！（悟性+2，心境+5）', 'event');
          } else {
            addNarrative('👀 你隐约感觉到有什么东西在看着你，但白天它们不会现身。也许日落后再来吧。', 'system');
          }
        }
      }
    },
  ],

  'biguan_peak': [
    { id:'bp_entrance', name:'禁制入口', type:'gate', desc:'强大的阵法将整座山峰笼罩其中。空气中灵气浓稠得几乎化为实质。',
      interaction:{ type:'enter', text:'你手持通行令牌走向禁制。', cooldownMs:0,
        effect: function(){
          const hasToken = G.player.inventory.some(i => i.id === 'biguan_token') || G.player.activeQuests.some(q => q === 'main_lv6');
          if(hasToken){
            addNarrative('🌀 禁制如水波般分开，灵气如潮水般涌出。你深吸一口气——这里就是闭关峰！', 'event');
          } else {
            addNarrative('🔒 强大的禁制阻挡了你的去路。「需持通行令牌方可入内。」你感到此地非同小可。', 'system');
          }
        }
      }
    },
    { id:'bp_mist', name:'灵气雾海', type:'cultivation', desc:'闭关峰上灵气浓得化为白雾，雾中伸手不见五指。每呼吸一口都感觉修为在增长。',
      interaction:{ type:'meditate', text:'你在雾海中寻了一处平坦的岩石盘膝坐下。', cooldownMs:3600000,
        effect: function(){
          gain = Math.floor(200 + Math.random() * 200);
          if (typeof gainCultivation === "function") gainCultivation("qi", gain); else G.player.qiCultivationPoints += gain;
          G.player.qi = Math.max(0, G.player.qi - 20);
          addNarrative(`💨 雾海中的灵气如丝如缕渗入你的丹田！修为大进！(+${gain})`, 'event');
          advanceTime(1);
          updateAllUI();
        }
      }
    },
    { id:'bp_heart', name:'心魔崖', type:'trial', desc:'一處突出懸崖的平台，站在上面面對著無盡的虛空。這裡是考驗道心的地方。',
      interaction:{ type:'face', text:'你站在心魔崖邊緣，凝視著深淵。虛空中有聲音在呼喚你。', cooldownMs:86400000,
        effect: function(){
          if(G.player.mood < 50){
            addNarrative('😈 心魔抓住了你內心的破綻！你感到恐懼、自疑、貪婪——道心幾乎失守！', 'system');
            addNarrative('💀 你強行退開心魔崖，心神受損。心境-15，修為-100。', 'system');
            G.player.mood = Math.max(0, G.player.mood - 15);
      if (typeof getQiRealm === 'function') {
        const curRealm = getQiRealm();
        G.player.qiCultivationPoints = Math.max(curRealm.cpRequired || 0, G.player.qiCultivationPoints - 100);
      } else {
        G.player.qiCultivationPoints = Math.max(0, G.player.qiCultivationPoints - 100);
      }
          } else {
            addNarrative('🧠 心魔在你面前幻化出種種景象：你的過去、你的恐懼、你的渴望。', 'system');
            addNarrative('但你的道心堅如磐石！一切幻象在你面前崩碎——你感到前所未有的清明！', 'event');
            if (typeof gainCultivation === "function") gainCultivation("qi", 500); else G.player.qiCultivationPoints += 500;
            G.player.mood = Math.min(100, G.player.mood + 15);
            G.player.wisdom = Math.min(100, (G.player.wisdom||50) + 3);
            addNarrative('⚡ 成功渡過心魔試煉！修為+500，心境+15，悟性+3！', 'event');
          }
        }
      }
    },
    { id:'bp_tablet', name:'問天碑', type:'mystery', desc:'一塊高達三丈的石碑立在峰頂。碑上沒有一個字，但你盯著它看時，會有文字浮現。',
      interaction:{ type:'gaze', text:'你凝視無字石碑。', cooldownMs:86400000,
        effect: function(){
          addNarrative('📜 石碑上浮現出一行字：「大道三千，唯我獨仙。」', 'event');
          addNarrative('💡 你感到閉關峰與天域之間存在某種聯繫——也許這裡就是通往天域的鑰匙。', 'event');
          if (typeof gainCultivation === "function") gainCultivation("qi", 300); else G.player.qiCultivationPoints += 300;
          G.player.wisdom = Math.min(100, (G.player.wisdom||50) + 2);
        }
      }
    },
  ],

  // ===== 新增场景 =====
  'gate_mortal_nether': [
    { id:'gn_well', name:'古井', type:'gate', desc:'老槐樹下的古井，深不見底。平時只是口普通的水井，但你聽說它通向另一個世界。',
      interaction:{ type:'peek', text:{ default:'你探頭往井裡看了看。', '夜':'井底有幽藍色的光芒在深沉地呼吸。' }, cooldownMs:0,
        effect: function(){
          if(G.player.qiRealmIndex+1 >= 4){
            addNarrative('🌀 井底的幽光照亮了通往下界的路——你可以通過古井前往幽冥界了。', 'event');
            addNarrative('💡 使用左側地圖的前往按鈕 → 古井入口 → 幽冥鬼窟。', 'system');
          } else {
            addNarrative('🌌 井中陰寒之氣直沖面門——以你現在的修為，下去恐怕有去無回。', 'system');
            addNarrative('💡 至少要練氣四層才能抵御其中的陰氣。', 'system');
          }
        }
      }
    },
  ],

  'ancient_well_entrance': [
    { id:'ae_passage', name:'古井底部', type:'gate', desc:'古井底部是一個幽暗的通道，四壁濕滑，長滿了墨綠色的苔蘚。通道深處有風吹來。',
      interaction:{ type:'enter', text:'你沿著通道前行。', cooldownMs:0,
        effect: function(){ addNarrative('🌑 通道向下延伸，漸漸出現暗綠色的螢光。空氣中的陰氣越來越濃。', 'system'); }
      }
    },
  ],

  'heifeng_ridge_boss': [
    { id:'hb_hall', name:'聚義廳', type:'building', desc:'山賊頭目的聚義廳，虎皮椅上鋪著一張完整的虎皮。牆上掛滿了搶劫來的兵器。',
      interaction:{ type:'enter', text:'你一腳踹開大門！', cooldownMs:0,
        effect: function(){ addNarrative('⚔️ 聚義廳內的山賊頭目猛地站起——「來得好！」', 'narr-combat');
          if(typeof startSceneCombat === 'function') startSceneCombat(); }
      }
    },
  ],

  'qingyun_pier': [
    { id:'pier_dock', name:'青石码头', type:'landscape', desc:'用青石垒砌的码头，几艘破旧的小船系在木桩上。水面上漂浮着几朵睡莲，随着水波轻轻摇晃。', interaction:{ type:'fish', chancedLoot:[{itemId:'yinlin_yu',chance:0.4,qty:1},{itemId:'lingquan_shui',chance:0.2,qty:1}], cooldownMs:60000 } },
    { id:'pier_willow', name:'垂柳堤', type:'landscape', desc:'码头旁的柳堤，垂柳依依，柳条轻拂水面。树荫下有石凳。', interaction:{ type:'rest', restBonus:1.05, cooldownMs:30000 } },
  ],
  'luori_plain': [
    { id:'plain_sunset', name:'落日崖', type:'landscape', desc:'平原边缘的一处断崖，是观赏日落的绝佳位置。每到黄昏，落日熔金的景象令人心醉。', interaction:{ type:'view', moodRecovery:10, cooldownMs:120000 } },
    { id:'plain_wind', name:'风吼谷', type:'landscape', desc:'平原上一道狭长的裂谷，风从谷口灌入，发出如野兽般的低吼声。', interaction:{ type:'danger', randomChance:0.3, traps:[{dmg:10,effect:'wound'}], cooldownMs:60000 } },
  ],
  'bamboo_grove': [
    { id:'bamboo_deep', name:'竹林深处', type:'landscape', desc:'越往里走，竹子越密。阳光几乎透不进来，脚下铺满了厚厚的竹叶。偶有竹鼠探头探脑地看你一眼。', interaction:{ type:'search', outcomes:[{chance:0.3,type:'herb',items:[{itemId:'hgc_grass',qty:2}]}], cooldownMs:30000 } },
    { id:'bamboo_spring', name:'竹根泉', type:'landscape', desc:'一汪从竹根下涌出的清泉，泉水甘甜带着竹叶的清香。', interaction:{ type:'drink', recover:{qi:15}, cooldownMs:30000 } },
  ],
  'moon_valley': [
    { id:'moon_spring', name:'月华泉', type:'cultivation', desc:'谷底一潭清澈见底的泉水，即使在白天的阳光下，也能看到泉底闪烁着银色的微光。传说每逢满月，月光会在此凝成露珠。', interaction:{ type:'cultivate', cultivationBonus:0.15, restBonus:1.1, cooldownMs:60000 } },
    { id:'moon_pavilion', name:'观月亭', type:'landscape', desc:'谷口一座古朴的凉亭，亭柱上刻着半首残诗："……水中有明月，月中有故人。"', interaction:{ type:'rest', restBonus:1.05, cooldownMs:30000 } },
  ],
  'stone_road': [
    { id:'road_well', name:'古路残井', type:'ruin', desc:'路旁一口几乎被荒草淹没的古井，井口的石栏已经断裂。往井里看，水面幽暗深邃。', interaction:{ type:'search', outcomes:[{chance:0.2,type:'loot',items:[{itemId:'posun_lingshi',qty:1+Math.floor(Math.random()*3)}]},{chance:0.4,type:'danger',effect:{qi:-10}}], cooldownMs:60000 } },
    { id:'road_pavilion', name:'半塌石亭', type:'landscape', desc:'一座半塌的石亭，亭顶的瓦片已经掉落大半，但石柱依然坚固。亭内的石桌上刻着一副残棋。', interaction:{ type:'rest', restBonus:1.0, cooldownMs:30000 } },
  ],

  // 🏛️ 试炼塔
  'gate_nether_divine': [
    { id:'tower_gate', name:'塔门', type:'trial', desc:'漆黑的塔门上爬满了金色的古老符文。门缝中透出幽暗的光，隐约能感受到塔身传来的磅礴威压。',
      interaction:{ type:'enter', text:'你伸手触摸塔门上冰冷的符文……', cooldownMs:0,
        effect: function(){
          if (typeof towerGateInteraction === 'function') towerGateInteraction();
        }
      }
    },
  ],

  'bj_frozen_lake': [
    { id:'bfl_heart', name:'冰湖之心', type:'mystery', desc:'冰封湖正中央一块巨大的玄冰，通体幽蓝，内部隐约可见一颗缓缓旋转的灵核——万年凝聚的玄冰之心。',
      interaction:{ type:'probe', text:'你踏冰而行，来到湖心。掌心贴上玄冰，一股寒意直冲眉心。', cooldownMs:86400000,
        effect: function(){
          if(G.player.inventory.some(i => i.id === 'ice_fairy_core')){
            addNarrative('❄️ 玄冰之心已被取走，湖心只剩一片寂静的冰蓝。', 'system');
            return;
          }
          addItemToInventory(ITEM_DB.find(i=>i.id==='ice_fairy_core'), 1);
          addNarrative('❄️ 玄冰在你掌下裂开一道缝隙，幽蓝的光华涌出——玄冰之心！北极冰原之心万年凝聚的灵核，入手冰凉，却仿佛有生命般轻轻跳动。', 'milestone');
          var unCore = (typeof iceFairyUnsealNote === 'function') ? iceFairyUnsealNote('玄冰之心', 1) : '';
          if (unCore) addNarrative(unCore, 'quest');
          if(typeof updateAllUI === 'function') updateAllUI();
        }
      }
    },
    { id:'bfl_ice_flowers', name:'冰晶花丛', type:'gather', desc:'湖岸冰面上盛开着一丛丛透明的冰晶花，在阳光下折射出七彩光芒。',
      interaction:{ type:'gather', text:'你小心地折下一枝冰晶花。', cooldownMs:7200000,
        effect: function(){
          addItemToInventory(ITEM_DB.find(i=>i.id==='xuelian'), 1);
          addNarrative('🌸 冰晶花入手即化，凝成一枚冰凉的雪莲子。（雪莲子+1）', 'loot');
        }
      }
    },
    { id:'bfl_fate_echo', name:'寒湖回响', type:'mystery', desc:'湖面冰层深处，隐隐传来一声极轻极远的叹息——仿佛万载之前，有人在此驻足。',
      interaction:{ type:'probe', text:'你俯身贴近冰面，屏息凝听。那叹息声渐渐清晰，像是隔着千年时光，与你的心跳遥相呼应。', cooldownMs:10800000,
        effect: function(){
          if(typeof getIceFairy==='function'){
            var ff = getIceFairy();
            if(ff && ff.fate < 30){
              var gained = 1 + (Math.random() < 0.5 ? 1 : 0);
              ff.fate = Math.min(100, ff.fate + gained);
              addNarrative('❄️ 冰层下的叹息与你的心跳共鸣——你感觉与这方冰天雪地之间，多了一丝说不清的牵绊。（缘份+' + gained + '）', 'milestone');
            } else if(ff) {
              addNarrative('❄️ 冰层下的叹息依旧，但你的心境已不再为之所动。你站直身，风雪扑面。', 'system');
              G.player.mood = Math.min(100, (G.player.mood||50) + 2);
            }
            if(typeof updateAllUI==='function') updateAllUI();
          } else {
            addNarrative('❄️ 冰层下传来一声悠远的叹息，风雪更急了些。', 'system');
          }
        }
      }
    },
  ],

  'bj_ice_peak': [
    { id:'bip_lotus', name:'绝壁冰莲', type:'gather', desc:'冰晶峰顶的绝壁之上，一株九瓣冰莲在寒风中摇曳——瑶池冰莲，只生长于万载玄冰之上。',
      interaction:{ type:'climb', text:'你冒着刺骨寒风，攀上绝壁。指尖触到冰莲的瞬间，一股清冽的灵气涌入心田。', cooldownMs:86400000,
        effect: function(){
          // 🔧 解封材料可重复采集（24h冷却）：一次 4 个，已有也叠加
          var exist = G.player.inventory.find(i => i.id === 'ice_fairy_flower');
          if (exist) {
            exist.qty = (exist.qty || 1) + 4;
            addNarrative('🌸 绝壁之上又绽出四朵九瓣冰莲，寒香沁人。（瑶池冰莲+4）', 'loot');
          } else {
            addItemToInventory(ITEM_DB.find(i=>i.id==='ice_fairy_flower'), 4);
            addNarrative('🌸 九瓣冰莲入手，寒香沁人。花瓣上凝着万载不化的霜华——瑶池冰莲！', 'milestone');
            var unFlower = (typeof iceFairyUnsealNote === 'function') ? iceFairyUnsealNote('瑶池冰莲', 4) : '';
            if (unFlower) addNarrative(unFlower, 'quest');
          }
          if(typeof updateAllUI === 'function') updateAllUI();
        }
      }
    },
    { id:'bip_ice_cave', name:'冰晶洞府', type:'explore', desc:'峰腰一处被冰封的洞府，洞内冰柱林立，如水晶宫殿。',
      interaction:{ type:'search', text:'你拨开洞口的冰帘，走了进去。', cooldownMs:0,
        effect: function(){
          // 🔧 可重复获取（委托物品）：已有也继续给（qty+1），不再拒绝
          var exist = G.player.inventory.find(i => i.id === 'yunqi_cao');
          if (exist) {
            exist.qty = (exist.qty || 1) + 1;
            addNarrative('🏔️ 洞府深处的冰台上又凝出一株云气草，氤氲着九天之气。（云气草+1）', 'loot');
          } else {
            addItemToInventory(ITEM_DB.find(i=>i.id==='yunqi_cao'), 1);
            addNarrative('🏔️ 洞府深处的冰台上生着一株云气草，氤氲着九天之气。（云气草+1）', 'loot');
          }
          if(typeof updateAllUI === 'function') updateAllUI();
        }
      }
    },
    { id:'bip_fate_echo', name:'冰崖残音', type:'mystery', desc:'绝壁背风处，一块被冰封的古碑半露出冰面。碑面刻痕已被风霜磨平，隐约可辨一个“冰”字。',
      interaction:{ type:'probe', text:'你拂去碑上的冰霜，指尖触到凹痕的刹那，一段残破的记忆碎片涌入脑海——万年前，有位女子在此立碑，望向你所在的方向。', cooldownMs:10800000,
        effect: function(){
          if(typeof getIceFairy==='function'){
            var ff = getIceFairy();
            if(ff && ff.fate < 30){
              var gained = 1 + (Math.random() < 0.5 ? 1 : 0);
              ff.fate = Math.min(100, ff.fate + gained);
              addNarrative('🧊 古碑上的“冰”字在你指尖微微发热——那段万年前的等待，仿佛与你有关。（缘份+' + gained + '）', 'milestone');
            } else if(ff) {
              addNarrative('🧊 古碑沉寂如常。你已知晓那段往事，无需再多停留。', 'system');
              G.player.mood = Math.min(100, (G.player.mood||50) + 2);
            }
            if(typeof updateAllUI==='function') updateAllUI();
          } else {
            addNarrative('🧊 古碑冰凉，刻痕已模糊不清。风雪从山脊上卷过。', 'system');
          }
        }
      }
    },
  ],

  'bj_snow_forest': [
    { id:'bsf_snow_spring', name:'雪泉', type:'rest', desc:'雪松林深处一眼不冻的温泉，热气蒸腾，与周围的冰雪形成奇异的对比。',
      interaction:{ type:'rest', text:'你解开外袍，泡进温暖的雪泉中。', cooldownMs:7200000, restMult:1.2,
        effect: function(){
          G.player.hp = Math.min(G.player.maxHp, G.player.hp + Math.round(G.player.maxHp * 0.3));
          G.player.mood = Math.min(100, (G.player.mood || 50) + 5);
          addNarrative('♨️ 温热的泉水驱散了寒意，气血恢复三成，心境也松弛下来。（气血+30%·心境+5）', 'event');
        }
      }
    },
    { id:'bsf_herb', name:'雪岭药丛', type:'gather', desc:'积雪下露出一片矮小的药丛，叶片上凝着冰霜——极寒之地生长的灵药，药性格外纯粹。',
      interaction:{ type:'gather', text:'你拨开积雪，小心地采下几株冻硬的灵药。', cooldownMs:7200000,
        effect: function(){
          addItemToInventory(ITEM_DB.find(i=>i.id==='xuelian'), 1);
          addNarrative('🌿 雪岭灵药入手，寒气凛冽，药香清苦。（雪莲子+1）', 'loot');
        }
      }
    },
    { id:'bsf_ancient_tree', name:'万年雪松', type:'landscape', desc:'一棵参天的万年雪松，树冠覆着厚厚的积雪，树干上刻着无数古老的名字与誓言。',
      interaction:{ type:'touch', text:'你伸手轻抚粗糙的树干，指尖传来冰凉的触感。', cooldownMs:0,
        effect: function(){
          if(Math.random() < 0.25){
            addItemToInventory(ITEM_DB.find(i=>i.id==='lingquan_shui'), 1);
            addNarrative('🌲 积雪簌簌落下，树洞里滚出一只玉瓶——灵泉水！（灵泉水+1）', 'loot');
          } else {
            G.player.mood = Math.min(100, (G.player.mood || 50) + 2);
            addNarrative('🌲 站在万年雪松下，天地一片寂静，心中杂念也仿佛被冰雪涤净。（心境+2）', 'system');
          }
        }
      }
    },
    { id:'bsf_fate_echo', name:'雪松誓言', type:'mystery', desc:'雪松树干上刻着密密麻麻的名字——那是万年来无数过客留下的印记。其中一行字迹清秀，只刻了两个字：“等你”。',
      interaction:{ type:'touch', text:'你的指尖抚过那两个字。冰凉的触感中，仿佛有一道跨越万年的目光，正隔着时光与你对视。', cooldownMs:10800000,
        effect: function(){
          if(typeof getIceFairy==='function'){
            var ff = getIceFairy();
            if(ff && ff.fate < 30){
              var gained = 1 + (Math.random() < 0.5 ? 1 : 0);
              ff.fate = Math.min(100, ff.fate + gained);
              addNarrative('🌲 “等你”二字在你指下微微发烫——你忽然觉得，这声等待也许等了万年，等的就是你。（缘份+' + gained + '）', 'milestone');
            } else if(ff) {
              addNarrative('🌲 你已知晓等待之人是谁，不必再对着一棵树发呆。', 'system');
              G.player.mood = Math.min(100, (G.player.mood||50) + 2);
            }
            if(typeof updateAllUI==='function') updateAllUI();
          } else {
            addNarrative('🌲 树干冰凉，那两个字的刻痕被新雪掩去了一半。', 'system');
          }
        }
      }
    },
  ],

  'lieyan_valley': [
    { id:'lyv_fire', name:'涅槃火池', type:'mystery', desc:'烈焰谷深处的岩浆池，池中翻涌着不灭的火焰——传说凤凰在此涅槃，留下了一缕火种。',
      interaction:{ type:'reach', text:'你运转灵力护体，探手伸向岩浆池中央的那缕不灭之火。', cooldownMs:86400000,
        effect: function(){
          if(G.player.inventory.some(i => i.id === 'ice_fairy_fire')){
            addNarrative('🔥 涅槃火种已被取走，岩浆池恢复了沉寂。', 'system');
            return;
          }
          addItemToInventory(ITEM_DB.find(i=>i.id==='ice_fairy_fire'), 1);
          addNarrative('🔥 指尖触到火种的刹那，一股灼热却温柔的力量包裹了你——涅槃火种！凤凰涅槃时留下的一缕不灭火焰，在你掌心安静地燃烧着。', 'milestone');
          var unFire = (typeof iceFairyUnsealNote === 'function') ? iceFairyUnsealNote('涅槃火种', 1) : '';
          if (unFire) addNarrative(unFire, 'quest');
          if(typeof updateAllUI === 'function') updateAllUI();
        }
      }
    },
    { id:'lyv_lava_rock', name:'熔岩石台', type:'gather', desc:'岩浆河边一块被烤得发红的岩石，缝隙中嵌着几枚火红的晶体。',
      interaction:{ type:'mine', text:'你挥剑撬开岩石，取出火红的晶体。', cooldownMs:7200000,
        effect: function(){
          addItemToInventory(ITEM_DB.find(i=>i.id==='shougu'), 1);
          addNarrative('🔴 火红晶体入手，温热的触感中蕴含着精纯的火灵气。（兽骨+1，可作火系材料替代）', 'loot');
        }
      }
    },
  ],

  // ═══════ 中州域·天机城（筑基期）═══
  'zz_tianji_city': [
    { id:'ztc_wanbao', name:'万宝楼', type:'market', desc:'中州第一商楼，楼高九层，珍宝无数。掌柜是个笑面狐狸似的中年修士，据说眼光毒辣。',
      interaction:{ type:'enter', text:'你踏入万宝楼，珠光宝气扑面而来。', cooldownMs:120000, auto:true,
        effect: function(){ showMarketModal(); }
      }
    },
    { id:'ztc_yanwu', name:'天机阁演武场', type:'arena', desc:'中州修士切磋较技之地，场边围着不少看客。擂台上正有两位筑基修士斗法，剑气纵横。',
      interaction:{ type:'watch', text:'你驻足观看擂台上的斗法。', cooldownMs:1800000,
        effect: function(){
          if (typeof gainCultivation === "function") gainCultivation("qi", 60); else G.player.qiCultivationPoints += 60;
          G.player.mood = Math.min(100, G.player.mood + 4);
          addNarrative('👀 观筑基修士斗法，你心有所悟。（修为+60，心境+4）', 'event');
        }
      }
    },
    { id:'ztc_cangjing', name:'藏经阁', type:'library', desc:'天机阁藏书之所，经卷浩如烟海。持天机令者可入内参悟，据说深处藏有上古功法残卷。',
      interaction:{ type:'read', text:'你走入藏经阁，翻开一卷泛黄的功法注解。', cooldownMs:3600000,
        effect: function(){
          const roll = Math.random();
          if(roll < 0.25){ addNarrative('📜 你在残卷夹层中发现一张丹方残页！（获得破境丹丹方心得）', 'event'); G.player.wisdom = Math.min(100, (G.player.wisdom||50) + 3); }
          else if(roll < 0.5){ if (typeof gainCultivation === "function") gainCultivation("qi", 120); else G.player.qiCultivationPoints += 120; addNarrative('📖 参悟前辈注解，修为精进。（修为+120）', 'event'); }
          else { G.player.mood = Math.min(100, G.player.mood + 5); addNarrative('📚 静心阅读半日，心神通透。（心境+5）', 'system'); }
        }
      }
    },
  ],
  'zz_yaoshou_ridge': [
    { id:'zyr_camp', name:'猎妖营地', type:'camp', desc:'猎妖修士在山腰搭建的临时营地，篝火旁坐着几个衣衫带血的猎人，正烤着一大块妖兽肉。',
      interaction:{ type:'talk', text:'你在营地旁坐下，听猎人们讲妖兽山脉的凶险。', cooldownMs:1800000,
        effect: function(){
          if (typeof gainCultivation === "function") gainCultivation("qi", 80); else G.player.qiCultivationPoints += 80;
          addNarrative('🔥 篝火噼啪作响，老猎人讲起青鳞蛟王的传说——那是盘踞在山脉深处的霸主。（修为+80）', 'event');
        }
      }
    },
    { id:'zyr_cliff_nest', name:'悬崖妖巢', type:'danger', desc:'悬崖峭壁上的巨大妖巢，巢口堆着森森白骨。隐约能看到巢内泛着幽光的兽卵。',
      interaction:{ type:'search', text:'你攀上悬崖，小心靠近妖巢。', cooldownMs:7200000,
        effect: function(){
          if(Math.random()<0.5){ addItemToInventory(ITEM_DB.find(i=>i.id==='yaodan_he'),1); addNarrative('🥚 妖巢深处藏着一枚妖丹核！你悄悄顺走。', 'loot'); }
          else { addNarrative('🦅 一声尖锐的禽鸣——妖禽回巢了！你赶紧溜下悬崖。', 'system'); G.player.hp = Math.max(1, G.player.hp - 20); }
        }
      }
    },
  ],
  'zz_lingmai_ruins': [
    { id:'zlr_crystal_wall', name:'灵晶壁', type:'mine', desc:'洞壁深处一整面嵌满灵脉结晶的晶壁，幽蓝光芒流转。这是灵脉枯竭前最后的馈赠。',
      interaction:{ type:'mine', text:'你以法器撬动晶壁，凿下几块结晶。', cooldownMs:7200000,
        effect: function(){
          addItemToInventory(ITEM_DB.find(i=>i.id==='lingmai_jing'), 2);
          addNarrative('💎 晶壁应声碎裂，两枚灵脉结晶落入掌中。（灵脉结晶×2）', 'loot');
        }
      }
    },
  ],
  'zz_huangji_dian': [
    { id:'zhd_stele', name:'荒寂石碑', type:'shrine', desc:'殿中一块残破的石碑，碑文已被风化大半，隐约可见「古魔」「封印」等字样。碑前散落着祭拜的痕迹。',
      interaction:{ type:'read', text:'你拂去石碑上的尘土，辨认残存的碑文。', cooldownMs:3600000,
        effect: function(){
          if (typeof gainCultivation === "function") gainCultivation("qi", 100); else G.player.qiCultivationPoints += 100;
          G.player.mood = Math.min(100, G.player.mood + 3);
          addNarrative('📜 碑文记载了千年前正魔大战的往事。读罢，你对道的理解又深了一层。（修为+100）', 'event');
        }
      }
    },
  ],

  // ═══════ 天域·云霄白玉宫（金丹期）═══
  'ty_baiyu_palace': [
    { id:'tbp_tiandao_stele', name:'天道碑', type:'shrine', desc:'白玉宫广场中央的通天石碑，碑身流转着大道神韵。无数金丹修士在此参悟，有人一朝顿悟，有人枯坐百年。',
      interaction:{ type:'meditate', text:'你在天道碑前盘膝而坐，心神沉入碑文。', cooldownMs:3600000,
        effect: function(){
          const roll = Math.random();
          if(roll < 0.3){ if (typeof gainCultivation === "function") gainCultivation("qi", 500); else G.player.qiCultivationPoints += 500; addNarrative('✨ 天道碑文如洪流般涌入识海——参悟大道真意！（修为+500）', 'narr-epic'); }
          else if(roll < 0.5){ addItemToInventory(ITEM_DB.find(i=>i.id==='tiandao_bei'),1); addNarrative('📜 你从碑文中拓下一角残篇。（获得天道碑拓×1）', 'loot'); }
          else { G.player.wisdom = Math.min(100, (G.player.wisdom||50) + 4); addNarrative('🧠 枯坐良久，虽无所得，但心神愈发澄明。（悟性+4）', 'system'); }
        }
      }
    },
    { id:'tbp_yunhai_terrace', name:'云海观景台', type:'landscape', desc:'白玉宫东侧的观景台，脚下云海翻涌，霞光万道。在此远眺，可见雷池紫电如龙蛇游走。',
      interaction:{ type:'watch', text:'你凭栏远眺云海，心神为之开阔。', cooldownMs:1800000,
        effect: function(){
          G.player.mood = Math.min(100, G.player.mood + 8);
          addNarrative('🌅 云海翻涌，霞光万道。此情此景，让人心旷神怡。（心境+8）', 'system');
        }
      }
    },
  ],
  'ty_leichi': [
    { id:'tlc_quench', name:'淬体雷池', type:'cultivate', desc:'雷池边缘的一汪浅池，紫电在水面跳跃。体修最爱在此以雷淬体——痛苦，但收获巨大。',
      interaction:{ type:'quench', text:'你走入淬体雷池，紫电瞬间爬满全身！', cooldownMs:7200000,
        effect: function(){
          if(Math.random()<0.6){
            if (typeof gainCultivation === "function") gainCultivation("body", 200); else G.player.bodyCultivationPoints += 200;
            addNarrative('⚡ 雷光淬体！皮开肉绽之后，你的肉身更强了。（炼体修为+200）', 'narr-epic');
          } else {
            G.player.hp = Math.max(1, G.player.hp - 50);
            addNarrative('💥 一道粗雷劈下，你被电得外焦里嫩。（-50HP）', 'system');
          }
        }
      }
    },
  ],
  'ty_yunhai': [
    { id:'tyh_cloud_boat', name:'云舟残骸', type:'wreck', desc:'云海中一艘半沉没的古老云舟，舟身刻满阵纹。舱门半开，不知里面有什么。',
      interaction:{ type:'search', text:'你登上云舟残骸，小心地探查舱室。', cooldownMs:7200000,
        effect: function(){
          const roll = Math.random();
          if(roll < 0.35){ addItemToInventory(ITEM_DB.find(i=>i.id==='yunhai_lu'),2); addNarrative('🧪 货舱里发现两瓶云海露！（云海露×2）', 'loot'); }
          else if(roll < 0.6){ addItemToInventory(ITEM_DB.find(i=>i.id==='leichi_jingtie'),1); addNarrative('⚡ 舱底嵌着一块雷池精铁，被你撬了下来！（雷池精铁×1）', 'loot'); }
          else { addNarrative('🌫️ 云舟内空空如也，只有海雾弥漫。', 'system'); }
        }
      }
    },
  ],
  'ty_tiandao_peak': [
    { id:'ttp_peak_wind', name:'峰顶风口', type:'landscape', desc:'天道峰之巅，劲风如刀。云层在脚下翻涌，天地之大尽收眼底——此处灵气虽暴烈，却最能磨砺道心。',
      interaction:{ type:'meditate', text:'你在风口盘膝打坐，任由罡风灌体。', cooldownMs:3600000,
        effect: function(){
          G.player.mood = Math.min(100, G.player.mood + 5);
          if (typeof gainCultivation === "function") gainCultivation("qi", 300); else G.player.qiCultivationPoints += 300;
          addNarrative('🌪️ 罡风灌体，道心愈发坚定。（修为+300，心境+5）', 'event');
        }
      }
    },
  ],

  'zuixian_lou': [
    { id:'zxl_dating', name:'大堂雅座', type:'market', desc:'醉仙楼一层大堂，酒香四溢。跑堂小二端着酒菜穿梭其间，各桌都在高谈阔论。',
      interaction:{ type:'enter', text:'你踏入醉仙楼大堂，酒香与喧哗扑面而来。', cooldownMs:120000, auto:true,
        effect: function(){ if (typeof triggerMarketVisit === 'function') triggerMarketVisit(); }
      }
    },
    { id:'zxl_er_lou', name:'二楼雅间', type:'rest', desc:'二楼雅间能俯瞰大堂。一位说书人正在讲一段江湖恩怨，说到精彩处满堂喝彩。',
      interaction:{ type:'watch', text:'你倚栏听了一段江湖故事。', cooldownMs:600000,
        effect: function(){
          G.player.mood = Math.min(100, G.player.mood + 5);
          if (typeof gainCultivation === "function") gainCultivation("qi", 50); else G.player.qiCultivationPoints += 50;
          addNarrative('📖 听江湖说书人讲了一段恩怨情仇，你心有所感。（心境+5，修为+50）', 'event');
        }
      }
    },
    { id:'zxl_houchu', name:'后厨酒窖', type:'mystery', desc:'后厨深处的酒窖，堆满陈年佳酿。据说醉仙楼的老板，年轻时也是一位江湖人。',
      interaction:{ type:'watch', text:'你闻到一股浓郁的酒香，混杂着淡淡的药香——这酒窖里，似乎藏着什么。', cooldownMs:1800000,
        effect: function(){
          if (Math.random() < 0.5) {
            const item = G.ITEM_DB.find(i => i.id === 'lingquan_shui');
            if (item) { addItemToInventory(item, 1); addNarrative('🍶 你在酒窖角落发现一坛灵泉水酿的佳酿，顺手收下。（获得灵泉水）', 'loot'); }
          } else {
            addNarrative('🍶 酒窖里只有寻常的酒坛，没有别的发现。', 'system');
          }
        }
      }
    },
  ],
  'wanshou_shanzhuang': [
    { id:'wsz_damen', name:'山庄大门', type:'gate', desc:'万兽山庄的巨石大门，门楣上刻着百兽浮雕。两头石狮镇守两侧，隐约能听到庄内传来的兽吼。',
      interaction:{ type:'watch', text:'你驻足观看大门上的百兽浮雕，那些兽纹栩栩如生。', cooldownMs:600000,
        effect: function(){
          if (typeof gainCultivation === "function") gainCultivation("qi", 80); else G.player.qiCultivationPoints += 80;
          addNarrative('🦁 观摩百兽浮雕，你对兽形的理解更深一层。（修为+80）', 'event');
        }
      }
    },
    { id:'wsz_lingyuan', name:'灵兽苑', type:'gather', desc:'庄内豢养灵兽的苑囿，铁栏后是各种奇珍异兽。一头通体雪白的灵狐正懒洋洋地晒太阳。',
      interaction:{ type:'enter', text:'你走近灵兽苑，各种兽鸣此起彼伏。', cooldownMs:300000, auto:true,
        effect: function(){
          if (typeof tryCatchBeast === 'function') tryCatchBeast();
          else addNarrative('🦊 灵兽苑的灵兽对你很感兴趣，可惜你暂时没有驯兽之法。', 'system');
        }
      }
    },
    { id:'wsz_shoufang', name:'兽房', type:'building', desc:'驯兽师的居所，墙上挂着各种驯兽工具。桌上摊着一本翻旧了的《御兽纪要》。',
      interaction:{ type:'watch', text:'你翻阅《御兽纪要》，对灵兽的习性有了更多了解。', cooldownMs:1800000,
        effect: function(){
          G.player.wisdom = Math.min(100, G.player.wisdom + 1);
          addNarrative('📖 研读《御兽纪要》，悟性+1。', 'event');
        }
      }
    },
  ],
  'tianji_ge': [
    { id:'tjg_cangshu', name:'藏卷阁', type:'building', desc:'天机阁的藏卷阁，书架上摆满了竹简与古籍。每一卷，都记载着一段不为人知的因果。',
      interaction:{ type:'enter', text:'你踏入藏卷阁，古旧的墨香扑面而来。', cooldownMs:1800000, auto:true,
        effect: function(){
          G.player.wisdom = Math.min(100, G.player.wisdom + 2);
          if (typeof gainCultivation === "function") gainCultivation("qi", 100); else G.player.qiCultivationPoints += 100;
          addNarrative('📜 在藏卷阁翻阅古籍，你窥见了一些天机。（悟性+2，修为+100）', 'event');
        }
      }
    },
    { id:'tjg_tianji_tai', name:'天机台', type:'landscape', desc:'天机阁顶层的观星台，脚下是中州万里的山川河流。站在此处，仿佛能看见命运的丝线。',
      interaction:{ type:'watch', text:'你立于天机台，俯瞰中州山河，心中升起一种明悟。', cooldownMs:3600000,
        effect: function(){
          G.player.luck = Math.min(100, G.player.luck + 1);
          G.player.mood = Math.min(100, G.player.mood + 5);
          addNarrative('🔭 登天机台观星，气运+1，心境+5。', 'event');
        }
      }
    },
    { id:'tjg_mimi', name:'密室门', type:'mystery', desc:'藏卷阁深处有一扇上锁的铁门，门上刻着复杂的阵法纹路。需要钥匙才能打开。',
      interaction:{ type:'watch', text:'你试着推了推铁门，纹丝不动。门上刻着一行小字："非有缘者，不得入内。"', cooldownMs:600000,
        effect: function(){
          addNarrative('🚪 密室门紧闭，看来需要特殊的钥匙才能打开。', 'system');
        }
      }
    },
  ],
};

// ==========================
// 二、永久资源点系统 (SCENE_RESOURCES)
// ==========================
const SCENE_RESOURCES = {
  'luoxia_forest': [
    { id:'berry_bush', name:'野莓叢', type:'gather',
      desc:'一叢長滿漿果的灌木，果實鮮紅欲滴。',
      gatherText:'你小心翼翼地摘下一捧野莓。',
      refreshMs:7200000, // 2小时
      maxGather:3, // 每次最多采3次
      gatherCountKey:'_gather_berry_bush',
      items:[{ id:'hgc_grass', min:1, max:2, chance:1.0 }],
    },
    { id:'moss_rock', name:'青苔石', type:'gather',
      desc:'一塊長滿厚厚青苔的巨石。',
      gatherText:'你在巨石根部扒拉了半天。',
      refreshMs:10800000, // 3小时
      maxGather:2,
      gatherCountKey:'_gather_moss_rock',
      items:[{ id:'shougu', min:1, max:2, chance:0.6 },{ id:'hgc_grass', min:1, max:1, chance:0.4 }],
    },
  ],
  'lingyun_peak': [
    { id:'cloud_mist', name:'雲霧靈氣', type:'cultivate',
      desc:'峰頂翻湧的雲霧含有豐富的靈氣。',
      gatherText:'你在雲霧中盤膝打坐，吸納靈氣。',
      refreshMs:7200000,
      maxGather:1,
      gatherCountKey:'_gather_cloud_mist',
      items:[{ id:'juli_dan', min:1, max:1, chance:0.5 },{ id:'lingquan_shui', min:1, max:1, chance:0.5 }],
    },
    { id:'lp_yunqi', name:'云气灵草', type:'herb', desc:'峰腰云雾缭绕处，云气草氤氲如烟，是炼制悟性灵丹的珍材。', resource: '灵草', gatherTime: 3, yields:[{itemId:'yunqi_cao',qty:1},{itemId:'lingquan_shui',qty:1}], cooldownMs:120000, refreshMs:120000 },
  ],
  'bibo_lake': [
    { id:'reed_bank', name:'蘆葦灘', type:'gather',
      desc:'湖畔的蘆葦叢中，水鳥穿梭其間。',
      gatherText:'你撥開蘆葦，在水中摸索。',
      refreshMs:7200000,
      maxGather:2,
      gatherCountKey:'_gather_reed',
      items:[{ id:'yinlin_yu', min:1, max:1, chance:0.5 },{ id:'lingquan_shui', min:1, max:1, chance:0.4 }],
    },
  ],
  'youming_grotto': [
    { id:'ghost_fire', name:'鬼火之核', type:'gather',
      desc:'幽魂消散後留下的鬼火核心。',
      gatherText:'你捕捉到一團漂浮的鬼火。',
      refreshMs:14400000,
      maxGather:2,
      gatherCountKey:'_gather_ghost_fire',
      items:[{ id:'lingzu_cuijian', min:1, max:2, chance:0.7 },{ id:'yuangi_jiejing', min:1, max:1, chance:0.3 }],
    },
    { id:'yg_huanhun_cao', name:'幽冥还魂草', type:'herb', desc:'鬼窟深处阴气最盛处，还魂草幽幽泛着绿光，传说可唤回一缕残魂。', resource: '阴草', gatherTime: 4, yields:[{itemId:'huanhun_cao',qty:1},{itemId:'lingzu_cuijian',qty:1}], cooldownMs:150000, refreshMs:150000 },
    { id:'yg_mingyun_hua', name:'命运花丛', type:'herb', desc:'鬼窟最深处一处诡异的花丛，七瓣异色的命运花在幽冥中静静绽放。', resource: '奇花', gatherTime: 5, yields:[{itemId:'mingyun_hua',qty:1}], cooldownMs:3600000, refreshMs:3600000 },
  ],
  'xuantie_mine': [
    { id:'deep_vein', name:'深層富礦', type:'gather',
      desc:'礦洞最深處的富礦脈，玄鐵精粹含量最高。',
      gatherText:'你深吸一口氣，全力開採。',
      refreshMs:21600000, // 6小时
      maxGather:2,
      gatherCountKey:'_gather_deep_vein',
      items:[{ id:'xuantie_jingcui', min:1, max:1, chance:0.6 },{ id:'xixin', min:1, max:1, chance:0.3 }],
    },
  ],

  'qingyun_pier': [
    { id:'pier_fish', name:'垂钓点', type:'fish', desc:'码头边有几处极好的垂钓位置，水中鱼影闪烁。', resource: '鱼群', gatherTime: 3, yields:[{itemId:'yinlin_yu',qty:1},{itemId:'lingquan_shui',qty:1}], cooldownMs:120000 },
  ],
  'luori_plain': [
    { id:'plain_hunt', name:'猎场', type:'hunt', desc:'平原上野兔、沙鹫成群，是打猎的好地方。', resource: '猎物', gatherTime: 2, yields:[{itemId:'shougu',qty:1},{itemId:'shoupi',qty:1}], cooldownMs:60000 },
  ],
  'bamboo_grove': [
    { id:'bamboo_shoot', name:'竹林', type:'herb', desc:'竹林深处能挖到新鲜的竹笋和竹菌。', resource: '竹笋', gatherTime: 2, yields:[{itemId:'hgc_grass',qty:1},{itemId:'baihe_lily',qty:1}], cooldownMs:60000 },
  ],
  'moon_valley': [
    { id:'moon_herb', name:'月华草甸', type:'herb', desc:'谷底湿润的草甸上生长着许多带有月光灵气的灵草。', resource: '灵草', gatherTime: 3, yields:[{itemId:'xuelian',qty:1},{itemId:'lingquan_shui',qty:1}], cooldownMs:120000 },
    { id:'moon_longgu_zhu', name:'月华龙骨竹', type:'herb', desc:'月华谷深处的龙骨竹形如龙骨盘绕，竹身密布金纹，月光下隐隐透出龙威。', resource: '灵竹', gatherTime: 5, yields:[{itemId:'longgu_zhu',qty:1},{itemId:'xuelian',qty:1}], cooldownMs:3600000, refreshMs:3600000 },
  ],
  'stone_road': [
    { id:'road_stone', name:'古石堆', type:'mine', desc:'古道旁散落着一些零星的灵矿石。', resource: '矿石', gatherTime: 2, yields:[{itemId:'lingzu_cuijian',qty:1},{itemId:'posun_lingshi',qty:1}], cooldownMs:60000 },
  ],

  // ── 筑基期（中州域）──
  'zz_yaoshou_ridge': [
    { id:'yzr_herb', name:'妖兽山脉灵草带', type:'herb', desc:'山腰灵气浓郁处的灵草丛，妖兽环伺却催生了上等灵药。', resource: '灵药', gatherTime: 4, yields:[{itemId:'xuelian',qty:1},{itemId:'lingmai_jing',qty:1}], cooldownMs:120000 },
    { id:'zyr_longgu_zhu', name:'妖兽龙骨竹', type:'herb', desc:'妖兽山脉深处龙骨竹盘绕如龙，竹身金纹密布，宛如真龙骨力入体。', resource: '灵竹', gatherTime: 5, yields:[{itemId:'longgu_zhu',qty:1},{itemId:'lingmai_jing',qty:1}], cooldownMs:3600000, refreshMs:3600000 },
  ],
  'zz_lingmai_ruins': [
    { id:'zlr_vein', name:'残余灵脉', type:'mine', desc:'遗迹深处枯竭灵脉的残余段，仍能凿出灵脉结晶。', resource: '灵晶', gatherTime: 4, yields:[{itemId:'lingmai_jing',qty:2},{itemId:'lingquan_shui',qty:1}], cooldownMs:120000 },
    { id:'zlr_shenji_cao', name:'先天神机草', type:'herb', desc:'遗迹深处的神机草生于废弃阵眼，传说仙人弈棋落子所化。', resource: '神草', gatherTime: 5, yields:[{itemId:'shenji_cao',qty:1},{itemId:'lingmai_jing',qty:1}], cooldownMs:3600000, refreshMs:3600000 },
  ],

  // ── 金丹期（天域）──
  'ty_leichi': [
    { id:'tlc_lightning', name:'雷池边缘雷晶', type:'mine', desc:'雷池边缘凝结的雷晶，紫光闪烁，蕴含狂暴雷灵。', resource: '雷晶', gatherTime: 5, yields:[{itemId:'leichi_jingtie',qty:1},{itemId:'lingmai_jing',qty:1}], cooldownMs:180000 },
  ],
  'ty_yunhai': [
    { id:'tyh_dew', name:'云海露珠', type:'gather', desc:'云海浮岛上凝结的露珠，纯净剔透。', resource: '灵露', gatherTime: 4, yields:[{itemId:'yunhai_lu',qty:1},{itemId:'lingquan_shui',qty:1}], cooldownMs:150000 },
    { id:'tyh_xiangyun_cao', name:'云海祥云草', type:'herb', desc:'云海浮岛上的祥云草紫光流转，形如祥云，是气运灵丹的珍材。', resource: '灵草', gatherTime: 5, yields:[{itemId:'xiangyun_cao',qty:1},{itemId:'yunhai_lu',qty:1}], cooldownMs:3600000, refreshMs:3600000 },
  ],

  'duzhang_swamp': [
    { id:'ds_duzhang_cao', name:'毒瘴草丛', type:'herb', desc:'沼泽深处的毒瘴草丛，瘴气最浓处反而长着最壮的毒瘴草。', resource: '毒草', gatherTime: 3, yields:[{itemId:'du_zhang_cao',qty:1},{itemId:'hgc_grass',qty:1}], cooldownMs:90000, refreshMs:90000 },
  ],

  'guji_ruins': [
    { id:'gr_shengu_cao', name:'万古神骨草', type:'herb', desc:'遗迹石缝间长着万年不枯的神骨草，茎中流淌着金色的骨髓液。', resource: '神草', gatherTime: 5, yields:[{itemId:'shengu_cao',qty:1},{itemId:'lingmai_jing',qty:1}], cooldownMs:3600000, refreshMs:3600000 },
  ],

  'yumu_forest': [
    { id:'yf_tiegu_cao', name:'铁骨草丛', type:'herb', desc:'玉木林中的铁骨草如铁似石，根茎坚韧，服之淬炼筋骨。', resource: '灵草', gatherTime: 3, yields:[{itemId:'tiegu_cao',qty:1},{itemId:'baihe_lily',qty:1}], cooldownMs:120000, refreshMs:120000 },
  ],

  'biguan_peak': [
    { id:'bp_wudao_ye', name:'悟道古树', type:'herb', desc:'闭关峰顶的古树通体透彻如琉璃，叶脉中似有大道符文流转。', resource: '灵叶', gatherTime: 4, yields:[{itemId:'wudao_ye',qty:1},{itemId:'xuelian',qty:1}], cooldownMs:3600000, refreshMs:3600000 },
  ],

  'lingyao_garden': [
    { id:'lg_tongyuan_cao', name:'同源灵草', type:'herb', desc:'药园最深处三株共生一体的奇异灵草，三色交织，可同养气运悟性根骨。', resource: '灵草', gatherTime: 4, yields:[{itemId:'tongyuan_cao',qty:1},{itemId:'baihe_lily',qty:1}], cooldownMs:3600000, refreshMs:3600000 },
  ],

  'lieyan_valley': [
    { id:'lyv_huojing_cao', name:'火精草丛', type:'herb', desc:'烈焰谷火山口边缘，火精草在灼热气流中摇曳，通体赤红如火。', resource: '火草', gatherTime: 4, yields:[{itemId:'huojing_cao',qty:2},{itemId:'xuelian',qty:1}], cooldownMs:180000, refreshMs:180000 },
  ],

  'bj_frozen_lake': [
    { id:'bfl_tianxin_lian', name:'天心莲', type:'herb', desc:'冰湖之下暗藏天瀑，瀑底的七瓣玉莲每一瓣都蕴藏一丝天道真意。', resource: '玉莲', gatherTime: 5, yields:[{itemId:'tianxin_lian',qty:1},{itemId:'xuelian',qty:1}], cooldownMs:3600000, refreshMs:3600000 },
  ],

  'bj_snow_forest': [
    { id:'bsf_shenlian_hua', name:'雪域神莲花', type:'herb', desc:'冰雪林深处的神莲花在极寒中绽放，花瓣如冰晶凝成，蕴藏浩瀚生机。', resource: '神莲', gatherTime: 5, yields:[{itemId:'shenlian_hua',qty:1},{itemId:'xuelian',qty:1}], cooldownMs:3600000, refreshMs:3600000 },
  ],

  'ty_tiandao_peak': [
    { id:'ttp_sanpin_lian', name:'天道三品莲', type:'herb', desc:'天道峰顶一莲三花的旷世奇珍，三花各蕴气运悟性根骨之道韵。', resource: '奇珍', gatherTime: 6, yields:[{itemId:'sanpin_lian',qty:1},{itemId:'tianxin_lian',qty:1}], cooldownMs:7200000, refreshMs:7200000 },
  ],
};

// ==========================
// 三、环境机制 (SCENE_MECHANICS)
// ==========================
// 每种机制定义：触发间隔、效果、持续时间等
// 由 engine.js 中的 timer 系统调用

const SCENE_MECHANICS = {
  'heifeng_ridge': {
    blackWind: {
      name: '黑風',
      desc: '常年呼嘯的黑風，讓人寸步難行。',
      interval: 3, // 每3回合触发一次
      effect: function(player, scene){
        const dodgePenalty = -0.2;
        // 短时效减益
        player._dodgePenalty = dodgePenalty;
        addNarrative('💨 一陣黑風呼嘯而過，你瞇起眼睛，腳步有些不穩。（閃避-20%）', 'system');
      },
      cleanup: function(player){
        delete player._dodgePenalty;
      }
    },
    lookoutTower: {
      name: '哨塔偵查',
      desc: '山賊的哨塔會發現外來者。',
      enabled: true,
    },
  },
  'duzhang_swamp': {
    poisonMist: {
      name: '毒瘴',
      desc: '彌漫的毒瘴氣，持續侵蝕肉身。',
      interval: 2,
      effect: function(player, scene){
        const poisonResist = player.inventory.some(i => i.id === 'du_zhang_cao') ? 0.5 : 1;
        const damage = Math.round(5 * poisonResist);
        player.hp = Math.max(1, player.hp - damage);
        addNarrative(`💨 毒瘴侵體！你感到呼吸困難（-${damage}HP）。`, 'system');
      },
    },
    quicksand: {
      name: '深沼',
      desc: '部分區域是隱藏的流沙深沼。',
      interval: 5,
      effect: function(player, scene){
        if(Math.random() < 0.2){
          addNarrative('⚠️ 你踩入一處深沼！費了好大勁才拔出來。（靈力-10）', 'system');
          player.qi = Math.max(0, player.qi - 10);
        }
      },
    },
  },
  'bingfeng_grotto': {
    extremeCold: {
      name: '極寒',
      desc: '刺骨的寒氣無孔不入。',
      interval: 3,
      effect: function(player, scene){
        const fireResist = player.skills.some(sk => {
          const sd = (G.skillData||[]).find(d=>d.id===sk.id);
          return sk.active && sd && sd.element === '火';
        }) ? 0.3 : 1;
        const damage = Math.round(4 * fireResist);
        player.hp = Math.max(1, player.hp - damage);
        addNarrative(`❄️ 寒氣侵入骨髓！你瑟瑟發抖（-${damage}HP）。${fireResist<0.5 ? '（火系功法護體，寒意大減。）' : ''}`, 'system');
      },
    },
    slipperyIce: {
      name: '冰面',
      desc: '洞壁和地面都覆蓋著光滑的冰層。',
      interval: 4,
      effect: function(player, scene){
        const dodge = player.skills.reduce((sum,sk)=>{
          const sd = (G.skillData||[]).find(d=>d.id===sk.id);
          return sd&&sk.active&&sd.effects&&sd.effects.dodge ? sum+sd.effects.dodge : sum;
        }, 0);
        if(Math.random() > 0.5 + dodge){
          addNarrative('🧊 腳下一滑！你摔了個四腳朝天。（HP-8）', 'system');
          player.hp = Math.max(1, player.hp - 8);
        }
      },
    },
  },
  'underground_river': {
    darkFlow: {
      name: '暗流',
      desc: '暗河中潛藏著看不見的暗流。',
      interval: 4,
      effect: function(player, scene){
        if(Math.random() < 0.15){
          addNarrative('🌊 一股暗流卷來！你被衝向下游。', 'system');
          player.qi = Math.max(0, player.qi - 12);
        }
      },
    },
  },
  'youming_grotto': {
    yinQi: {
      name: '陰氣侵蝕',
      desc: '濃郁的陰靈之氣會侵蝕生者。',
      interval: 3,
      effect: function(player, scene){
        const yinDamage = 4;
        player.qi = Math.max(0, player.qi - yinDamage);
        addNarrative(`🌑 陰氣如附骨之疽侵蝕著你的靈力（-${yinDamage}靈力）。`, 'system');
      },
    },
  },
  'guji_ruins': {
    ancientPressure: {
      name: '遠古威壓',
      desc: '遠古遺跡殘留的大能氣息，讓人喘不過氣。',
      interval: 5,
      effect: function(player, scene){
        if(Math.random() < 0.1){
          addNarrative('🗿 一股強大的遠古威壓從天而降！你運功抵擋，心神受創。（心境-3）', 'system');
          player.mood = Math.max(0, player.mood - 3);
        }
      },
    },
  },
};

// ==========================
// 四、辅助函数
// ==========================

// 获取场景探点
function getScenePOI(sceneId) {
  return SCENE_POI[sceneId] || [];
}

// 获取探点详情
function getPOIDetail(sceneId, poiId) {
  const poi = SCENE_POI[sceneId];
  if (!poi) return null;
  return poi.find(p => p.id === poiId) || null;
}

// 获取场景资源点
function getSceneResources(sceneId) {
  return SCENE_RESOURCES[sceneId] || [];
}

// 获取场景环境机制
function getSceneMechanics(sceneId) {
  return SCENE_MECHANICS[sceneId] || null;
}

// 执行POI交互
function interactWithPOI(sceneId, poiId) {
  const poi = getPOIDetail(sceneId, poiId);
  if (!poi) { addNarrative('找不到這個地點。', 'system'); return; }
  
  // 冷却检查
  if (poi.interaction.cooldownMs > 0) {
    const cdKey = '_poi_cd_' + poiId;
    const lastTime = G.player[cdKey] || 0;
    const now = Date.now();
    if (now - lastTime < poi.interaction.cooldownMs) {
      const remaining = Math.ceil((poi.interaction.cooldownMs - (now - lastTime)) / 60000);
      // 防刷屏
      var _poiCdMsg = '_poi_cd_msg_' + poiId;
      var lastMsg2 = G.player[_poiCdMsg] || 0;
      if (now - lastMsg2 > 60000) {
        G.player[_poiCdMsg] = now;
        addNarrative(`⏳ ${poi.name}還需要 ${remaining} 分鐘才能再次探索。`, 'system');
      }
      return;
    }
    G.player[cdKey] = now;
  }
  
  // 显示交互文本（支持时态切换）
  const displayText = typeof poi.interaction.text === 'string' 
    ? poi.interaction.text 
    : (poi.interaction.text[G.time.period] || poi.interaction.text['default'] || poi.interaction.text['night'] || poi.interaction.text['1st'] || '');
  addNarrative(displayText, 'system');
  
  // 执行效果
  if (poi.interaction.effect && typeof poi.interaction.effect === 'function') {
    poi.interaction.effect();
  }
  
  // 休息型探点的特殊处理
  if (poi.interaction.restMult && poi.interaction.restMult > 1) {
    // 在探索或rest时处理
  }
  
  updateAllUI();
  if (typeof updatePerceptionUI === 'function') updatePerceptionUI();
}

// 采集资源点
// 采集资源点（普通采集：有冷却和限制）
function gatherResource(sceneId, resId) {
  const resources = getSceneResources(sceneId);
  const res = resources.find(r => r.id === resId);
  if (!res) { addNarrative('這裡沒有這個資源點。', 'system'); return; }
  
  // 冷却检查
  const cdKey = '_res_cd_' + resId;
  const countKey = res.gatherCountKey;
  const lastTime = G.player[cdKey] || 0;
  const now = Date.now();
  
  if (now - lastTime < res.refreshMs) {
    const remaining = Math.ceil((res.refreshMs - (now - lastTime)) / 60000);
    // 冷却防刷屏（同一资源点的"还在恢复"消息60秒内不重复）
    var _cdKeyMsg = '_res_cd_msg_' + resId;
    var lastMsg = G.player[_cdKeyMsg] || 0;
    if (now - lastMsg > 60000) {
      G.player[_cdKeyMsg] = now;
      addNarrative(`⏳ 資源點還在恢復中（剩餘 ${remaining} 分鐘）。`, 'system');
    }
    return;
  }
  
  // 采集次数限制
  if (res.maxGather && res.maxGather > 0) {
    const count = G.player[countKey] || 0;
    if (count >= res.maxGather) {
      addNarrative('你已經采過太多次了，讓資源點休息一下吧。', 'system');
      return;
    }
    G.player[countKey] = (G.player[countKey] || 0) + 1;
  }
  
  G.player[cdKey] = now;
  addNarrative(res.gatherText || '你開始採集……', 'system');
  
  // 执行采集（🔧 2026-08-04：兼容 yields 新格式（itemId/qty）与 items 旧格式（id/chance/min/max））
  if (res.yields && res.yields.length > 0) {
    res.yields.forEach(function(item) {
      if (Math.random() < (item.chance === undefined ? 1.0 : item.chance)) {
        const qty = item.qty || 1;
        const itemData = ITEM_DB.find(function(i) { return i.id === item.itemId; });
        if (itemData) {
          for (var yi = 0; yi < qty; yi++) addItemToInventory(itemData, 1);
          addNarrative('🎒 獲得 ' + itemData.name + ' ×' + qty + '！', 'loot');
        }
      }
    });
  } else if (res.items && res.items.length > 0) {
    res.items.forEach(function(item) {
      if (Math.random() < (item.chance || 1.0)) {
        const qty = item.min + Math.floor(Math.random() * (item.max - item.min + 1));
        const itemData = ITEM_DB.find(function(i) { return i.id === item.id; });
        if (itemData) {
          for (var gi = 0; gi < qty; gi++) addItemToInventory(itemData, 1);
          addNarrative('🎒 獲得 ' + itemData.name + ' ×' + qty + '！', 'loot');
        }
      }
    });
  }
  
  updateAllUI();
  if (typeof updatePerceptionUI === 'function') updatePerceptionUI();
  // ❄️ 门派采集任务推进（冰阁弟子采集同步推进门派任务）
  // 🔧 2026-08-04：采集后按物品名匹配门派任务（采集类），自动推进进度
  try {
    if (typeof isSectMember === 'function' && isSectMember() && typeof updateSectTaskProgress === 'function') {
      var sectTasksR = G.player.sect ? (G.player.sect.tasks || []) : [];
      var gotItems = [];
      if (res.yields && res.yields.length > 0) {
        res.yields.forEach(function(item) {
          var itd = ITEM_DB.find(function(i) { return i.id === item.itemId; });
          if (itd && gotItems.indexOf(itd.name) === -1) gotItems.push(itd.name);
        });
      } else if (res.items && res.items.length > 0) {
        res.items.forEach(function(item) {
          var itd = ITEM_DB.find(function(i) { return i.id === item.id; });
          if (itd && gotItems.indexOf(itd.name) === -1) gotItems.push(itd.name);
        });
      }
      for (var sri = 0; sri < sectTasksR.length; sri++) {
        var srt = sectTasksR[sri];
        if (srt && srt.type === '采集' && !srt.done && !srt.claimed) {
          if (gotItems.indexOf(srt.item) !== -1) {
            updateSectTaskProgress(srt.id, 1);
          }
        }
      }
    }
  } catch(e) {}
}

// 任务物品采集（无视冷却、无视次数限制、必出物品）
// 用于自动模式中收集任务所需材料
function gatherQuestItem(itemId, qty) {
  var p = G.player;
  if (!p || !p.inventory) return;
  
  // 看还需要几个
  var owned = p.inventory.reduce(function(sum, it) { return it.id === itemId ? sum + (it.qty || 1) : sum; }, 0);
  var needed = qty - owned;
  if (needed <= 0) return; // 够了，不采
  
  // 查找这个物品能在当前场景的哪个资源点采集
  var resources = getSceneResources(G.currentScene);
  if (!resources || resources.length === 0) return;
  
  var targetRes = null;
  for (var ri = 0; ri < resources.length; ri++) {
    var res = resources[ri];
    if (res && res.items) {
      for (var ii = 0; ii < res.items.length; ii++) {
        if (res.items[ii].id === itemId) { targetRes = res; break; }
      }
    }
    if (targetRes) break;
  }
  
  // 任务采集：无视资源点单次上限，一次补足所需数量
  var itemData = ITEM_DB.find(function(i) { return i.id === itemId; });
  if (!itemData) return;
  
  for (var gi = 0; gi < needed; gi++) addItemToInventory(itemData, 1);
  addNarrative('🌿 你在附近搜寻，采到了 ' + itemData.name + ' ×' + needed + '，足够交差了。', 'quest');
  
  // 物品到位后直接检查任务进度（足够即自动完成）
  if (typeof checkQuestProgress === 'function') checkQuestProgress();
  updateAllUI();
}

// 应用场景环境机制（每回合调用）
function applySceneMechanics(sceneId) {
  const mechanics = getSceneMechanics(sceneId);
  if (!mechanics) return;
  
  const player = G.player;
  if (!player || !player.isAlive) return;
  
  // 用回合计数器决定触发
  if (!G._mechanicTurn) G._mechanicTurn = 0;
  G._mechanicTurn++;
  
  Object.values(mechanics).forEach(m => {
    if (m.interval && G._mechanicTurn % m.interval === 0) {
      if (m.effect && typeof m.effect === 'function') {
        m.effect(player, getSceneData(sceneId));
      }
    }
  });
}

// 重置环境机制计数器（切换场景时调用）
function resetSceneMechanics() {
  delete G._mechanicTurn;
  
  // 清除一次性状态
  const p = G.player;
  if (p) {
    delete p._dodgePenalty;
  }
}

// ==========================
// 五、探点交互弹窗
// ==========================
function openPOIModal() {
  const sceneId = G.currentScene;
  const poiList = getScenePOI(sceneId);
  if (poiList.length === 0) {
    addNarrative('此處沒有值得探索的地點。', 'system');
    updateAllUI();
    return;
  }
  
  const typeLabels = {
    landscape:'🏔️', market:'🏪', inn:'🏨', shrine:'⛩️', building:'🏛️',
    ruin:'🏚️', road:'🛤️', rest:'🧘', gather:'🌿', battle:'⚔️',
    danger:'⚠️', cave:'🕳️', gate:'🚪', cultivate:'🧘', trial:'🔥',
    mystery:'🔮', explore:'🔍', mine:'⛏️',
  };
  
  let html = '<div style="margin-bottom:8px;color:var(--text-dim);font-size:11px;">' + (getSceneData(sceneId)?.name || '此處') + '的探索地點：</div>';
  html += '<div style="display:flex;flex-direction:column;gap:6px;">';
  
  poiList.forEach(function(poi) {
    const typeIcon = typeLabels[poi.type] || '📍';
    // 冷却检查
    let cdLabel = '';
    if (poi.interaction.cooldownMs > 0) {
      const cdKey = '_poi_cd_' + poi.id;
      const lastTime = G.player[cdKey] || 0;
      const remaining = poi.interaction.cooldownMs - (Date.now() - lastTime);
      if (remaining > 0) {
        const mins = Math.ceil(remaining / 60000);
        cdLabel = '⏳' + mins + '分';
      }
    }
    
    const descShort = poi.desc.length > 45 ? poi.desc.slice(0, 45) + '…' : poi.desc;
    html += '<div class="event-choice-btn" onclick="closeEvent();interactWithPOI(\'' + sceneId + '\',\'' + poi.id + '\');"';
    html += ' style="padding:8px 10px;text-align:left;border-radius:8px;border:1px solid rgba(255,255,255,0.06);display:flex;justify-content:space-between;align-items:center;">';
    html += '  <div>';
    html += '    <div style="font-size:12px;font-weight:bold;">' + typeIcon + ' ' + poi.name + ' ' + (cdLabel ? '<span style="font-size:9px;color:#e74c3c;">' + cdLabel + '</span>' : '') + '</div>';
    html += '    <div style="font-size:10px;color:var(--text-dim);margin-top:2px;">' + descShort + '</div>';
    html += '  </div>';
    html += '  <div style="font-size:9px;color:' + (cdLabel ? '#e74c3c' : '#8bc34a') + ';flex:0 0 40px;text-align:right;">' + (cdLabel ? '冷卻中' : '前往→') + '</div>';
    html += '</div>';
  });
  
  // 资源点
  const resources = getSceneResources(sceneId);
  if (resources.length > 0) {
    html += '<div style="margin:8px 0 4px;font-size:11px;font-weight:bold;color:var(--accent);">🌱 可採集資源</div>';
    resources.forEach(function(res) {
      html += '<div class="event-choice-btn" onclick="closeEvent();gatherResource(\'' + sceneId + '\',\'' + res.id + '\');"';
      html += ' style="padding:6px 10px;text-align:left;border-radius:8px;border:1px solid rgba(106,158,201,0.15);display:flex;justify-content:space-between;font-size:11px;">';
      html += '  <span>🌿 ' + res.name + '</span>';
      html += '  <span style="color:var(--accent);">採集→</span>';
      html += '</div>';
    });
  }
  
  // 环境提示
  const mechanics = getSceneMechanics(sceneId);
  if (mechanics) {
    html += '<div style="margin-top:8px;font-size:10px;color:var(--text-dim);">⚠️ <b style="color:#d46a3a;">環境效果</b>';
    const mechanicList = Object.values(mechanics);
    mechanicList.forEach(function(m) {
      html += '<div style="padding:2px 0;">' + m.desc + '</div>';
    });
    html += '</div>';
  }
  
  html += '</div>';
  showCustomModal('📌 探點探索', html);
}

// ==========================
// 六、探点UI渲染（整合到感知面板）
// ==========================
function renderScenePOIPanel(containerId) {
  const container = containerId ? document.getElementById(containerId) : document.getElementById('poi-panel');
  if (!container || !G.currentScene) return;
  
  const poiList = getScenePOI(G.currentScene);
  if (poiList.length === 0) {
    container.innerHTML = '<div class="panel-empty">此地無特別景點</div>';
    return;
  }
  
  const typeLabels = {
    landscape:'🏔️ 景觀', market:'🏪 集市', inn:'🏨 客棧', shrine:'⛩️ 神龕',
    building:'🏛️ 建築', ruin:'🏚️ 遺跡', road:'🛤️ 小徑', rest:'🧘 休憩',
    gather:'🌿 採集', battle:'⚔️ 戰鬥', danger:'⚠️ 危險', cave:'🕳️ 洞穴',
    gate:'🚪 入口', cultivate:'🧘 修煉', trial:'🔥 試煉', mystery:'🔮 神秘',
    explore:'🔍 探索', mine:'⛏️ 採礦'
  };
  
  let html = '<div class="panel-box"><div class="panel-title">📍 此地探點</div>';
  
  poiList.forEach(poi => {
    const typeLabel = typeLabels[poi.type] || '📍';
    // 冷却状态
    let cdStatus = '';
    if (poi.interaction.cooldownMs > 0) {
      const cdKey = '_poi_cd_' + poi.id;
      const lastTime = G.player[cdKey] || 0;
      const remaining = poi.interaction.cooldownMs - (Date.now() - lastTime);
      if (remaining > 0) {
        const mins = Math.ceil(remaining / 60000);
        cdStatus = `<span class="cd-badge">⏳${mins}分鐘</span>`;
      }
    }
    
    html += `<div class="poi-card" onclick="${poi.interaction.auto ? '' : "interactWithPOI('"+G.currentScene+"','"+poi.id+"')"}" 
      style="padding:6px 8px;margin-bottom:4px;border-radius:6px;background:rgba(255,255,255,0.03);
        border-left:2px solid var(--text-dim);cursor:${poi.interaction.auto ? 'default' : 'pointer'};
        transition:background 0.15s;"
      onmouseover="this.style.background='rgba(255,255,255,0.07)'" 
      onmouseout="this.style.background='rgba(255,255,255,0.03)'">
      <div style="font-size:11px;font-weight:bold;color:var(--text);display:flex;justify-content:space-between;">
        <span>${typeLabel} ${poi.name}</span>
        ${cdStatus}
      </div>
      <div style="font-size:9px;color:var(--text-dim);margin-top:1px;line-height:1.4;">${poi.desc.slice(0, 40)}${poi.desc.length>40?'…':''}</div>
    </div>`;
  });
  
  // 资源点
  const resources = getSceneResources(G.currentScene);
  if (resources.length > 0) {
    html += '<div style="margin-top:8px;"><div style="font-size:10px;font-weight:bold;color:var(--accent);margin-bottom:4px;">🌱 可採集資源</div>';
    resources.forEach(res => {
      html += `<div class="poi-card" onclick="gatherResource('${G.currentScene}','${res.id}')"
        style="padding:5px 8px;margin-bottom:3px;border-radius:6px;background:rgba(106,158,201,0.05);border-left:2px solid #6a9ec9;cursor:pointer;font-size:10px;"
        onmouseover="this.style.background='rgba(106,158,201,0.12)'" 
        onmouseout="this.style.background='rgba(106,158,201,0.05)'">
        <span style="color:var(--text);">🌿 ${res.name}</span>
        <span style="color:var(--text-dim);margin-left:4px;">${res.desc}</span>
      </div>`;
    });
    html += '</div>';
  }
  
  // 环境机制提示
  const mechanics = getSceneMechanics(G.currentScene);
  if (mechanics) {
    html += '<div style="margin-top:6px;"><div style="font-size:10px;font-weight:bold;color:#d46a3a;margin-bottom:3px;">⚠️ 環境效果</div>';
    Object.values(mechanics).forEach(m => {
      html += `<div style="font-size:9px;color:var(--text-dim);padding:2px 4px;">${m.desc}</div>`;
    });
    html += '</div>';
  }
  
  html += '</div>';
  container.innerHTML = html;
}

// ==========================
// 导出
// ==========================
window.SCENE_POI = SCENE_POI;
window.SCENE_RESOURCES = SCENE_RESOURCES;
window.SCENE_MECHANICS = SCENE_MECHANICS;
window.getScenePOI = getScenePOI;
window.getPOIDetail = getPOIDetail;
window.getSceneResources = getSceneResources;
window.getSceneMechanics = getSceneMechanics;
window.interactWithPOI = interactWithPOI;
window.gatherResource = gatherResource;
window.gatherQuestItem = gatherQuestItem;
window.applySceneMechanics = applySceneMechanics;
window.resetSceneMechanics = resetSceneMechanics;
window.renderScenePOIPanel = renderScenePOIPanel;
window.openPOIModal = openPOIModal;
