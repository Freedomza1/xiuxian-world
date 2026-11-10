// === 唯我独仙 · NPC 引擎 （故事感增强版） ===
// 每个NPC都有自己的故事、记忆和文学性的登场

class NPCManager {
  constructor() {
    this.npcs = [];
    this.activeDialog = null;
  }

  ensureNPCsForScene(sceneId, scene) {
    // 👴 引路人沈伯：青云镇常驻；新玩家出生地（低境界）也带他出现
    if (typeof ensureMentor === 'function') {
      try {
        const p = (typeof G !== 'undefined' && G.player) ? G.player : null;
        const isNewbie = p && (p.qiRealmIndex || 0) <= 2;
        if (sceneId === 'qingyun' || isNewbie) {
          ensureMentor(sceneId);
        } else if (typeof npcManager !== 'undefined' && npcManager) {
          // 沈伯已生成过，回青云镇常驻
          const mentor = npcManager.npcs.find(n => n.id === 'mentor_shenbo');
          if (mentor && sceneId === 'qingyun') mentor.sceneId = 'qingyun';
        }
      } catch(e) {}
    }
    this.getNPCsForScene(sceneId);
  }

  getNPCsForScene(sceneId) {
    const scene = getSceneData(sceneId);
    if (!scene) return [];
    let sceneNPCs = this.npcs.filter(n => n.sceneId === sceneId);
    // 🌊 江湖人物注入：固定剧情NPC优先在场
    if (typeof ensureJianghuNPCs === 'function') {
      try { ensureJianghuNPCs(sceneId); } catch(e) {}
    }
    // ❄️ 第二纪元：冰阁门派人物注入（仅冰阁弟子）
    if (typeof ensureSectNPCs === 'function') {
      try { ensureSectNPCs(sceneId); } catch(e) {}
    }
    sceneNPCs = this.npcs.filter(n => n.sceneId === sceneId);
    // npcPool 场景生成6-8个NPC，无npcPool也至少5个
    const poolSize = scene.npcPool ? scene.npcPool.length : 0;
    const needed = Math.min(poolSize + 3, poolSize > 0 ? 8 : 5);

    while (sceneNPCs.length < needed) {
      const npc = generateNPC(sceneId);
      if (poolSize > 0 && sceneNPCs.length < poolSize) {
        npc.role = scene.npcPool[sceneNPCs.length];
      }
      // 生成小说式登场描写
      generateNPCStory(npc);
      this.npcs.push(npc);
      sceneNPCs = this.npcs.filter(n => n.sceneId === sceneId);
    }
    return sceneNPCs;
  }

  startDialog(npc) {
    this.activeDialog = npc;
    // 如果不是初次见面，闪过一段短暂的记忆
    if (!npc.isFirstMeeting && npc._lastChatDay && typeof G !== 'undefined' && G.time && Math.random() < 0.5) {
      const daysAgo = G.time.day - (npc._lastChatDay || G.time.day);
      if (daysAgo > 0) {
        addNarrative(`（你想起上次见${npc.name}，已是${daysAgo}天前的事了。）`, 'system');
      }
    }
    npc.isFirstMeeting = false;
    const greeting = this.generateGreeting(npc);
    addNarrative(`【${npc.name}】${greeting}`, 'narr-event');
    return greeting;
  }

  generateGreeting(npc) {
    try {
      if (typeof DEEPSEEK_API_KEY !== 'undefined' && DEEPSEEK_API_KEY) {
        const scene = getSceneData(G.currentScene);
        // Try AI for a more organic greeting
        fetch('https://api.deepseek.com/chat/completions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + DEEPSEEK_API_KEY },
          body: JSON.stringify({
            model: 'deepseek-v4-flash',
            messages: [
              { role: 'system', content: `你是${npc.name}，${npc.role}，性格${npc.personality}。你的说话风格：${npc.speechStyle}。你${npc.desire}。现在看到熟人了。说一句简短的招呼（10-30字），配合（动作/表情）。自然的古风口吻。不要问"你好吗"这种现代话。` },
              { role: 'user', content: `你看到我了。说句话吧。` }
            ],
            max_tokens: 80,
            temperature: 0.9,
          })
        }).then(r => r.json()).then(d => {
          if (d.choices && d.choices[0]) {
            const btn = document.querySelector('#event-title');
            if (btn && btn.textContent.includes(npc.name)) {
              // 如果对话弹窗还开着，追加
              const log = document.getElementById('chat-log');
              if (log) {
                const div = document.createElement('div');
                div.style.cssText = 'margin-bottom:6px;padding:4px 6px;border-radius:4px;';
                div.innerHTML = `<span style="font-size:11px;color:var(--text-dim);font-weight:bold;">${npc.name}</span><br><span>${d.choices[0].message.content.trim()}</span>`;
                log.appendChild(div);
              }
            } else {
              addNarrative(`【${npc.name}】${d.choices[0].message.content.trim()}`, 'narr-event');
            }
          }
        }).catch(() => {});
      }
    } catch(e) {}
    // Fallback greeting 同时保留
    const greetings = {
      '开朗豪爽': '（哈哈大笑）来得正好！正愁没人说说话！',
      '沉稳内敛': '（微微颔首）你来了。',
      '心狠手辣': '（冷眼一扫）又是你。',
      '天真烂漫': '（眼睛一亮）啊，你来啦！',
      '老谋深算': '（笑眯眯地打量你）呵呵，老夫等你许久了。',
      '古道热肠': '（热切地迎上来）哎呀，好些日子不见你了！',
      '阴郁寡言': '（只是抬了抬眼皮）……嗯。',
      '豪迈不羁': '（拍案而起）好兄弟！来，坐！',
      '高傲自负': '（眼角扫了你一下）哼，又来扰我清修？',
      '温和敦厚': '（含笑拱手）道友安好。',
      '泼辣直率': '（白了你一眼）哼，总算想起我来了？',
      '淡泊名利': '（云淡风轻地笑了笑）随意坐，不必拘束。',
      '急公好义': '（快步上前）你可算来了！正好有事找你！',
      '沉默寡言': '（点了点头）……',
      '狡诈多疑': '（眼珠一转）哦？今儿怎么有空来找我了？',
      '宽厚仁慈': '（双手合十）施主来了，老衲甚是欢喜。',
      '刚愎自用': '（不耐烦地）怎么又是你？有事快说。',
      '玩世不恭': '（坏笑着）哟，我还以为你把我忘了呢。',
      '坚韧不拔': '（目光如炬）你来了？正好，我有话对你说。',
    };
    // 🌟 名声：世界开始认识你（高名声时插队）
    if (typeof getFameGreeting === 'function') {
      const fameGreet = getFameGreeting();
      if (fameGreet) return fameGreet;
    }
    // 👴 沈伯专属问候
    if (npc.id === 'mentor_shenbo') {
      const mentorG = [
        '（沈伯抬头见是你，咧开嘴笑了）娃子来了？来，坐下喝口茶。',
        '（沈伯正晒着药草，冲你招招手）来得正好，我正寻思你该来了。',
        '（沈伯放下烟袋，眼神里带着几分欣慰）又见面了，娃子。',
      ];
      return mentorG[Math.floor(Math.random() * mentorG.length)];
    }
    return greetings[npc.personality] || '（抬起头看了你一眼）你又来了。';
  }

  getDialogOptions(npc) {
    if (!npc._hasLifecycle) extendNPCWithLifecycle(npc);
    const isDao = npc.daoPartnerId === 'player';
    const isFriend = getFriendList().some(function(f){ return f.id === npc.id; });
    // 检测该NPC是否有可接任务
    var hasQuest = false;
    if (typeof getAvailableQuests === 'function' && typeof G !== 'undefined') {
      try {
        var qs = getAvailableQuests();
        hasQuest = qs.some(function(q){ return q.giver === npc.name; });
      } catch(e) {}
    }
    const options = [
      { id:'freechat', text:'💬 说说心里话', action:() => openFreeChat(npc) },
      { id:'biography', text:'📜 看看他的故事', action:() => showNPCBiography(npc) },
      // 引路人沈伯：请教修行
      (typeof mentorDialogOption === 'function' ? mentorDialogOption(npc) : null),
      { id:'trade', text:'💰 交易', action:() => this.trade(npc), condition: npc.role.includes('店')||npc.role.includes('商')||npc.role.includes('药')||npc.role.includes('铁') },
      { id:'quest', text:'👂 打听消息', action:() => this.gossipQuest(npc) },
      { id:'accept_quest', text:'📋 接过任务', action:() => this.acceptQuestFromNPC(npc), condition: hasQuest },
      { id:'gift', text:'🎁 赠礼', action:() => this.giftMenu(npc) },
      // 炼丹师：请教丹方
      (isAlchemyTeacher(npc) ? { id:'alchemy_teach', text:'📜 请教丹方', action:() => askAlchemyRecipe(npc), condition: true } : null),
      // 铁匠/器修：请教锻造配方
      (isForgeTeacher(npc) ? { id:'forge_teach', text:'🔨 请教锻造', action:() => askForgeRecipe(npc), condition: true } : null),
      isFriend
        ? { id:'friendinfo', text:'🤝 好友（好感' + npc.affinity + '）', action:() => openFriendList(), condition: true }
        : { id:'addfriend', text:'🤝 加为好友', action:() => { addFriend(npc); closeCustomModal(); }, condition: true },
      isDao ? { id:'dualcult', text:'🌸 双修', action:() => dualCultivateWithNPC(npc), condition: true }
        : (npc.gender !== G.player.gender ? { id:'propose', text:'💍 结为道侣', action:() => proposeDaoPartnership(npc) } : null),
      { id:'duel', text:'⚔️ 切磋', action:() => this.challenge(npc) },
    ];
    return options.filter(o => o !== null && o.condition !== false);
  }

  async chat(npc) {
    const topics = ['这里的风土人情','最近的修仙界传闻', npc.role + '的日常','什么地方有机缘'];
    const topic = topics[Math.floor(Math.random() * topics.length)];
    if (typeof generateNPCDialog === 'function') {
      const reply = await generateNPCDialog(npc, topic);
      if (reply) { addNarrative(`【${npc.name}】${reply}`, 'narr-event'); npc.affinity = Math.min(100, npc.affinity + 2); return; }
    }
    const replies = [
      '嗯……这里也没什么特别的。', '修道之路漫长，何必急在一时。',
      '你倒是问了个好问题，我也不知如何回答。', `${npc.background}的我，对这些也不甚了解。`,
      '唉，修行不易，且行且珍惜吧。',
    ];
    addNarrative(`【${npc.name}】${replies[Math.floor(Math.random() * replies.length)]}`, 'narr-event');
    npc.affinity = Math.min(100, npc.affinity + 1);
  }

  gossipQuest(npc) {
    // ── 先出硬编码兜底（立刻显示，不等AI） ──
    var sceneName = '';
    if (typeof G !== 'undefined' && G.currentScene) {
      try { sceneName = (getSceneData(G.currentScene) || {}).id || ''; } catch(e) {}
    }
    var sceneRumors = {
      'qingyun': ['青云镇的坊市最近来了个古怪的游商，据说卖的东西来路不正。','有人看见镇长府后院夜里灯火通明，像是在密谋什么。','清风楼客栈的掌柜说，最近镇外多了些生面孔，像是在找什么东西。'],
      'luoxia_forest': ['落霞森林深处有座废弃的猎寮，猎人失踪前留下了一句"不要在月圆之夜进山"。','最近森林里的妖兽比往常暴躁，可能是深处出了什么事。','有人在古榕树下捡到过一块刻满符文的令牌。'],
      'heifeng_ridge': ['黑风岭的山贼头子据说以前是某个宗门的弃徒。','山贼最近在抓人修筑暗堡，已经有几个散修失踪了。','断魂崖下似乎有异光，但没人敢下去看。'],
      'bibo_lake': ['碧波湖底有座水下洞府，只是入口被阵法封住了。','湖心亭每到子时就会传来若有若无的琴声。','最近湖面上漂着几具妖兽的尸体，像是被什么东西杀死后扔下的。'],
      'lingyun_peak': ['灵云峰顶的云海中有座悬空岛，只有御器才能上去。','峰顶那位打坐的老者已经三年没动过了，有人说他坐化了，有人说他在悟道。','灵云峰后山有条隐蔽的小路，通向一个未标记的山谷。'],
      'lingyao_garden': ['灵药园深处有一株上了年份的宝药，但被妖兽守着。','守园老人说药园底下压着什么东西，夜里会发出嗡嗡声。','最近有人半夜看到药园里有人影走动，可能是偷药的。'],
      'duzhang_swamp': ['毒瘴沼泽中心的瘴气最浓处，生长着一种剧毒但价值连城的灵草。','沼泽里困着一头千年鳄龟，已经修炼出了灵智。','有采药人见到沼泽深处有座石塔露出水面。'],
      'guji_ruins': ['远古遗迹的墙壁上刻满了一种无人能解读的文字。','有人在遗迹主殿废墟下发现了一条密道。','遗迹周围的风水格局是人为布置的，像是在镇压什么东西。'],
      'bingfeng_grotto': ['冰风石窟最深处藏着一块万年寒玉，能助人抵御心魔。','窟里住着一只通体冰蓝色的雪狐，已生了灵智。','冰湖下的暗流通向哪里没人知道，扔下的石头没有回声。'],
      'leiyin_temple': ['雷音古刹的地宫有三层，据说最底层关着一个人。','残佛前的香炉不是凡物，但没人能搬动它。','寺里的大钟能发出扰人心神的音波，修为不够的人靠近会头晕。'],
      'youming_grotto': ['幽冥鬼窟里飘荡的幽魂会模仿人的声音，引诱你深入。','窟里的阴气重的古怪，可能是地脉有裂缝。','有探宝修士在地底寒潭边发现了一具盘坐的骸骨，指间还戴着储物戒。'],
      'xuantie_mine': ['玄铁矿洞最深处的玄铁品质最好，但那里住着一群变异的蝙蝠。','矿洞深处有条岔路通向一个天然溶洞，里面长满了荧光藻。','矿工们说深夜能听到矿洞里有敲击声，但并没有人在里面。'],
      'yumu_forest': ['玉木林的中心有一棵万年玉木，树心据说已经凝结成了木灵珠。','森林里的灵兽比其他地方温顺，像是被什么东西影响。','有人在玉木林里遇到过一个骑青牛的白发老者，转眼就不见了。'],
      'moon_valley': ['月华谷每百年会出现一次"月华潮"，灵气浓度暴涨数倍。','谷中有眼灵泉，月圆之夜泉水会变成银色，饮之可洗涤经脉。','石上打坐的白发老妪似乎在这里住了很久，没人知道她的来历。'],
      'luori_plain': ['落日平原上有座无名古墓，墓门上的封印已经松动。','平原的野马群里有一匹通体雪白的骏马，日行千里如履平地。','落日时分，有人在平原尽头看到过海市蜃楼般的仙宫。'],
    };
    var staticRumors = ['听说落霞森林深处有异宝出世，已有不少修士前往。','黑风岭的山贼最近越发猖獗了。','碧波湖心每到月圆之夜，便有奇光浮现。','雷音古刹的地宫似乎被人打开了……','最近有神秘人在青云镇高价收购灵草。','据说天剑宗三月后要开山收徒。','有人在灵云峰顶见到一只通体雪白的仙鹤。','灵药园深夜有异光闪烁，像是灵药成了精。',
      '筑基丹的材料又涨价了，散修的日子越来越难了。','听说天剑宗的那个天才弟子叛逃了。','有人在黑市上买到过上古丹药的残方。'];

    var weather = typeof autoWeather !== 'undefined' ? autoWeather : '晴';
    var season = typeof autoSeason !== 'undefined' ? autoSeason : '秋';
    var sceneRumorList = sceneRumors[sceneName] || [];
    var backdropRumor = Math.random() < 0.5
      ? (sceneRumorList.length > 0 ? sceneRumorList[Math.floor(Math.random() * sceneRumorList.length)] : null)
      : null;
    var fallback = backdropRumor || staticRumors[Math.floor(Math.random() * staticRumors.length)];

    // ── 缓存键：防同一个NPC连续打听重复 ──
    var cacheKey = 'gossip_' + npc.id + '_' + (G.time ? G.time.day : 0);
    var cached = window[cacheKey];
    if (cached) {
      addNarrative('【' + npc.name + '】' + cached, 'narr-event');
      if (!G.player.eventHistory) G.player.eventHistory = [];
      G.player.eventHistory.push('从' + npc.name + '处打听到：' + cached);
      npc.affinity = Math.min(100, npc.affinity + 2);
      return;
    }

    // 显示兜底
    addNarrative('【' + npc.name + '】' + fallback, 'narr-event');
    if (!G.player.eventHistory) G.player.eventHistory = [];
    G.player.eventHistory.push('从' + npc.name + '处打听到：' + fallback);
    npc.affinity = Math.min(100, npc.affinity + 2);

    // ── Fire & Forget: AI 生成特制传闻，回来后悄悄替换上次的 ──
    var key = (typeof DEEPSEEK_API_KEY !== 'undefined' && DEEPSEEK_API_KEY) ? DEEPSEEK_API_KEY : (
      typeof window !== 'undefined' && window.__DEEPSEEK_KEY ? window.__DEEPSEEK_KEY : ''
    );
    if (!key || key.length < 20) return;  // 没key就别出发了
    var sceneData = typeof getSceneData === 'function' ? getSceneData(G.currentScene) : null;
    var sceneNameFull = sceneData ? sceneData.name : '某处';
    var sceneDesc = sceneData ? (sceneData.description || '').slice(0, 60) : '';
    var realm1 = typeof QI_REALMS !== 'undefined' && QI_REALMS[G.player.qiRealmIndex]
      ? QI_REALMS[G.player.qiRealmIndex].name : '练气期';

    var promptText = '你是一位生活在' + sceneNameFull + '的' + npc.role + '。'
      + '你性格' + npc.personality + '。'
      + '现在是' + season + '季的' + weather + '天。'
      + '你对面前这位' + realm1 + '的修士（好感度' + npc.affinity + '）说一段最近听说的传闻。'
      + '这块地方的特点是：' + sceneDesc
      + '。说一句30-60字的传闻。古风口吻、自然、真实感强。不要问问题。直接说。';

    try {
      fetch('https://api.deepseek.com/chat/completions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + key },
        body: JSON.stringify({
          model: 'deepseek-v4-flash',
          messages: [
            { role: 'system', content: '你是一个仙侠世界里消息灵通的路人NPC。只说传闻，不问问题。传闻要自然、有地域特色、有时令感。' },
            { role: 'user', content: promptText }
          ],
          max_tokens: 120,
          temperature: 0.9,
        })
      }).then(function(r){ return r.json(); }).then(function(data){
        if (data.choices && data.choices[0]) {
          var aiRumor = data.choices[0].message.content.trim();
          // 缓存今天这个NPC的传闻
          window[cacheKey] = aiRumor;
          // 追加AI传闻（看起来像NPC又想起了什么）
          if (typeof addNarrative === 'function') {
            addNarrative('【' + npc.name + '】对了，还有一件事——' + aiRumor, 'narr-event');
          }
        }
      }).catch(function(){});
    } catch(e) {}
  }

  trade(npc) {
    if (!npc.tradeGoods) {
      npc.tradeGoods = ['huiqi_dan','zhixue_san','hgc_grass','lingquan_shui','juli_fu','huiti_dan','lianqi_xinde']
        .map(id => ITEM_DB.find(i => i.id === id)).filter(Boolean);
    }
    let html = `<p style="margin-bottom:8px;">${npc.name}的货物：</p>`;
    npc.tradeGoods.forEach(item => {
      const price = Math.round(item.value * (0.8 + Math.random() * 0.4));
      html += `<div class="market-item">
        <span>${item.name}</span><span style="font-size:11px;color:var(--text-dim)">${item.desc}</span>
        <span style="color:var(--accent)">💰${price}</span>
        <button class="market-buy" onclick="buyFromNPC('${item.id}', ${price})">购买</button>
      </div>`;
    });
    showCustomModal('🏪 ' + npc.name + '的摊位', html);
  }

  giftMenu(npc) {
    const giftables = G.player.inventory.filter(i => i.type === '灵草' || i.type === '丹药' || i.type === '材料');
    if (giftables.length === 0) { addNarrative('你没有可以赠送的东西。', 'system'); return; }
    let html = '<p>选择要赠送的物品：</p>';
    giftables.forEach((item, idx) => {
      const value = item.value || 1;
      const affinityGain = Math.round(value / 5) + 2;
      html += `<div class="inv-item inv-clickable" onclick="giveGift('${item.id}', ${affinityGain})">
        <span>${item.name}</span><span>→ 好感 +${affinityGain}</span></div>`;
    });
    showCustomModal('🎁 赠礼 - ' + npc.name, html);
  }

  challenge(npc) {
    const diff = (npc.qiRealmIndex + npc.bodyRealmIndex) - (G.player.qiRealmIndex + G.player.bodyRealmIndex);
    if (diff > 2) { addNarrative(`【${npc.name}】哼，你不是我的对手。`, 'system'); return; }
    if (diff < -1) { addNarrative(`【${npc.name}】阁下修为高深，我不是对手。`, 'system'); return; }
    addNarrative(`【${npc.name}】好！来切磋一番！`, 'narr-combat');
    startNPCCombat(npc);
  }

  acceptQuestFromNPC(npc) {
    if (typeof getAvailableQuests !== 'function') return;
    try {
      const qs = getAvailableQuests().filter(function(q){ return q.giver === npc.name; });
      if (qs.length === 0) {
        addNarrative(`【${npc.name}】暂时没什么需要你帮忙的。`, 'system');
        return;
      }
      const q = qs[0];
      if (typeof acceptQuest === 'function') {
        addNarrative(`【${npc.name}】${q.giverLine || '你来得正好，有件事想托你去办……'}`, 'narr-event');
        if (q.npcHint) addNarrative(`（${q.npcHint}）`, 'system');
        acceptQuest(q.id);
      }
    } catch(e) {}
  }
}

const npcManager = new NPCManager();

// ==========================
// NPC 登场故事生成（DeepSeek）
// ==========================
function generateNPCStory(npc) {
  try {
    // 👴 引路人沈伯：固定人设，不AI生成
    if (npc._noStory) {
      npc.firstImpress = '（一个头发花白的老农正弯腰侍弄药田，听见脚步声直起腰来，用粗糙的手背擦了擦汗）';
      npc.lifeStory = '沈伯年轻时也曾背着剑走南闯北，见过太多天才陨落、凡人挣扎。如今他守着青云镇这片药田，看着一个个后辈从懵懂无知到踏上仙途。他总说：修行修的不只是境界，还有人心。';
      return;
    }
    const key = (typeof DEEPSEEK_API_KEY !== 'undefined' && DEEPSEEK_API_KEY) ? DEEPSEEK_API_KEY : null;
    if (!key) {
      // 兜底生成一个短描述
      npc.firstImpress = `一个${npc.gender === '男' ? '的' : '的'}${npc.role}，${npc.personality}的模样。`;
      npc.lifeStory = `${npc.name}是${npc.background}出身，在这片天地间过着普通的日子。${npc.desire}。`;
      return;
    }

    const scene = getSceneData(npc.sceneId);
    const sceneName = scene ? scene.name : '某处';

    fetch('https://api.deepseek.com/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + key },
      body: JSON.stringify({
        model: 'deepseek-v4-flash',
        messages: [
          { role: 'system', content: `你是古典小说家，为「唯我独仙」里的路人NPC写一段50-80字的出场描写和一段60-100字的背景故事。

【人物】
姓名：${npc.name}（${npc.gender}）
职业：${npc.role}
性格：${npc.personality}
出身：${npc.background}
所在：${sceneName}
心愿：${npc.desire}
外貌/细节：${npc.roleQuirk}

第一段【出场】：用画面感强的文字描写他/她出场时的模样，像"你看见……"开头。融入该角色特点。

第二段【故事】：用一段小传式的文字讲述他/她的来历和现状，带几分小说笔法。

格式：
=====
（出场描写）
（背景故事）` },
          { role: 'user', content: `为${npc.name}写一段出场和背景。` }
        ],
        max_tokens: 300,
        temperature: 0.9,
      })
    }).then(r => r.json()).then(data => {
      if (data.choices && data.choices[0]) {
        const text = data.choices[0].message.content.trim();
        const parts = text.split('\n\n').filter(Boolean);
        if (parts.length >= 1) npc.firstImpress = parts[0].replace(/^=====\s*/, '').trim();
        if (parts.length >= 2) npc.lifeStory = parts[1].trim();
        if (parts.length >= 2) npc.aiDescription = parts[1].trim().slice(0, 80);
      }
    }).catch(() => {
      npc.firstImpress = `一个${npc.gender === '男' ? '的' : '的'}${npc.role}，${npc.personality}的模样。`;
    });
  } catch(e) {
    npc.firstImpress = `你看见${npc.gender === '男' ? '一位' : '一位'}${npc.role}模样的修士。`;
  }
}

// ==========================
// NPC 生平展示（故事版）
// ==========================
function showNPCBiography(npc) {
  const realm = getNPCRealmLabel(npc);
  const roleIcon = {'散修':'🌄','药店掌柜':'💊','铁匠':'🔨','客栈老板':'🏮','药农':'🌿','猎户':'🏹',
    '宗门弟子':'📜','游商':'🎒','情报贩子':'👁️','赏金猎人':'💰','乞丐':'🥀','说书人':'🎭','江湖郎中':'⚕️','画师':'🖌️','琴师':'🎵'};
  const icon = roleIcon[npc.role] || '👤';
  const sect = npc.sectId ? `${SECT_DB.find(s=>s.id===npc.sectId)?.name || ''}` : '无门无派';
  const daoStatus = npc.daoPartnerId === 'player' ? '🌸 你的道侣' : npc.daoPartnerId ? `已与某人结为道侣` : '独身';
  const childStatus = (npc.childIds?.length || 0) > 0 ? `有${npc.childIds.length}个子嗣` : '无子嗣';

  let html = `
    <div style="margin-bottom:10px;">
      <div style="font-size:18px;font-weight:bold;">${icon} ${npc.name}${npc._isPlayerNPC ? ' 🎮' : ''}</div>
      <div style="font-size:12px;color:var(--text-dim);">${npc.role} · ${realm} · ${sect}</div>
    ${npc._isPlayerNPC ? '<div style="font-size:10px;color:#d4a045;margin-top:2px;">🎮 曾为修士所操控的化身</div>' : ''}
    </div>
    <div style="margin-bottom:8px;padding:8px;background:rgba(0,0,0,0.25);border-radius:6px;font-size:12px;line-height:1.7;">
      <div style="color:var(--accent);margin-bottom:4px;">📖 出场</div>
      ${npc.firstImpress || '一个寻常的修道之人。'}
    </div>
    <div style="margin-bottom:8px;padding:8px;background:rgba(0,0,0,0.25);border-radius:6px;font-size:12px;line-height:1.7;">
      <div style="color:var(--accent);margin-bottom:4px;">📜 身世</div>
      ${npc.lifeStory || npc.background || '来历不明。'}
      <div style="margin-top:4px;font-style:italic;color:var(--text-dim);">${npc.desire}</div>
    </div>
    <div style="font-size:11px;color:var(--text-dim);line-height:1.6;">
      <div>🧬 ${npc.personality} · 好感 ${npc.affinity}</div>
      <div>${daoStatus} · ${childStatus} · ${npc._hasLifecycle ? (npc.isAlive ? `寿元 ${Math.round(npc.trueAge)}/${npc.maxAge || '?'}` : '已陨落 💀') : ''}</div>
      ${npc.speechQuirk ? `<div>🎭 ${npc.speechQuirk}</div>` : ''}
      ${npc.memoryLog && npc.memoryLog.length > 0 ? `<div style="margin-top:4px;">💭 记得的事：${npc.memoryLog.slice(-3).join('；')}</div>` : ''}
    </div>
  `;
  showCustomModal('📜 ' + npc.name + '·生平', html);
}

// ==========================
// NPC 战斗
// ==========================
function startNPCCombat(npc) {
  const npcHp = (npc.bodyRealmIndex + 1) * 50 + 30;
  const npcAttack = (npc.qiRealmIndex + 1) * 8 + 5;
  const npcDefense = (npc.bodyRealmIndex + 1) * 4 + 3;
  const combat = new Combat(npc.name, (result) => {
    if (result === 'victory') { npc.affinity = Math.max(-50, npc.affinity - 10); G.player.mood = Math.min(100, G.player.mood + 5); }
    else if (result === 'defeat') { npc.affinity = Math.min(50, npc.affinity + 5); }
    updateAllUI();
  });
  combat.monster = { hp: npcHp, attack: npcAttack, defense: npcDefense, qi: 50 };
  combat.monsterHp = npcHp;
  combat.monsterName = npc.name;
  showCombatModal(combat);
}

// ==========================
// NPC 列表展示
// ==========================
function showNPCList(sceneId) {
  const npcs = npcManager.getNPCsForScene(sceneId);
  if (npcs.length === 0) { addNarrative('此处并无旁人。', 'system'); return; }

  let html = '<p style="margin-bottom:8px;">附近的人：</p>';
  npcs.forEach(n => {
    const genderIcon = n.gender === '男' ? '👤' : '👩';
    const realmLabel = getNPCRealmLabel(n);
    const sectTag = n.sectId ? `[${SECT_DB.find(s=>s.id===n.sectId)?.name||''}]` : '';
    const affHeart = n.affinity > 50 ? '❤️' : n.affinity > 20 ? '💛' : n.affinity < -20 ? '💢' : '🤝';
    const daoMark = n.daoPartnerId === 'player' ? ' 🌸' : '';
    const childMark = (n.childIds?.length || 0) > 0 ? ` 👶x${n.childIds.length}` : '';
    const ageText = n._hasLifecycle ? (n.isAlive ? `${Math.round(n.trueAge)}岁` : '💀') : '?';
    const playerNPCMark = n._isPlayerNPC ? ' 🎮' : '';  // 标记前玩家角色

    html += `<div class="npc-card ${n.isAlive ? '' : 'npc-dead'}" onclick="startNPCDialog('${n.id}')">
      <div class="npc-card-header">
        <span>${genderIcon} <b>${n.name}</b>${daoMark}${childMark}${playerNPCMark}</span>
        <span style="font-size:11px;color:var(--text-dim)">${realmLabel} · ${ageText}</span>
      </div>
      <div class="npc-card-body">
        <span style="font-size:11px;">${n.role} · ${n.personality}</span>
        <span>${affHeart}</span>
      </div>
      <div class="npc-card-desc" style="font-size:10px;color:var(--text-dim)">
        ${n.firstImpress || n.aiDescription || n.background}
      </div>
    </div>`;
  });
  showCustomModal('👥 附近的人', html);
}

function startNPCDialog(npcId) {
  const npc = npcManager.npcs.find(n => n.id === npcId);
  if (!npc) return;
  closeCustomModal();
  npcManager.startDialog(npc);
  const options = npcManager.getDialogOptions(npc);
  const html = options.filter(Boolean).map(o =>
    `<button class="event-choice-btn" onclick="executeNPCAction('${npc.id}','${o.id}')">${o.text}</button>`
  ).join('');
  showCustomModal('📜 ' + npc.name, html);
  G.activeDialogNPC = npc;
}

function executeNPCAction(npcId, actionId) {
  const npc = npcManager.npcs.find(n => n.id === npcId);
  if (!npc) return;
  closeCustomModal();
  switch(actionId) {
    case 'chat': npcManager.chat(npc); break;
    case 'trade': npcManager.trade(npc); break;
    case 'quest': npcManager.gossipQuest(npc); break;
    case 'gift': npcManager.giftMenu(npc); break;
    case 'duel': npcManager.challenge(npc); break;
    case 'biography': showNPCBiography(npc); break;
    case 'dualcult': dualCultivateWithNPC(npc); break;
    case 'propose': proposeDaoPartnership(npc); break;
    case 'freechat': break;
    case 'addfriend': { const n2 = npcManager.npcs.find(n => n.id === npcId); if (n2) { addFriend(n2); closeCustomModal(); } } break;
    case 'friendinfo': openFriendList(); break;
    case 'alchemy_teach': askAlchemyRecipe(npc); break;
    case 'forge_teach': askForgeRecipe(npc); break;
    case 'mentor_advice': { if (typeof talkToMentor === 'function') talkToMentor(); } break;
  }
  updateAllUI();
}

// ── 铁匠/器修判定 + 请教锻造配方 ──
function isForgeTeacher(npc) {
  if (!npc || !npc.name) return false;
  const teachers = ['铁匠', '矿工', '器修', '炼器', '监工'];
  return teachers.some(t => npc.name.includes(t));
}

function askForgeRecipe(npc) {
  if (typeof FORGE_RECIPES === 'undefined') { addNarrative('（此人不懂锻造之道。）', 'system'); closeCustomModal(); return; }
  const p = G.player;
  const learned = (p.forgeRecipes || []);
  const teachable = Object.keys(FORGE_RECIPES).filter(id => {
    const r = FORGE_RECIPES[id];
    return r.learnNpc === npc.name && !learned.includes(id);
  });
  
  if (teachable.length === 0) {
    closeCustomModal();
    addNarrative(`【${npc.name}】${learned.length > 0 ? '我这点手艺你都学全了，该去寻更高明的器师了。' : '老夫从不外传手艺，你且去别处寻访吧。'}`, 'narr-event');
    return;
  }
  
  let html = `<div style="font-size:11px;color:var(--text-dim);margin-bottom:8px;">【${npc.name}】见你诚心向道，我这里有${teachable.length}个锻造配方可以传授：</div>`;
  teachable.forEach(id => {
    const r = FORGE_RECIPES[id];
    html += `<button class="event-choice-btn" style="display:block;width:100%;margin:3px 0;text-align:left;font-size:11px;" onclick="learnForgeFromNpc('${id}')">
      🔨 ${r.name} <span style="color:#aab;font-size:9px;">${r.resultQuality.join('/')}</span>
      <div style="font-size:9px;color:var(--text-dim);">材料：${r.ingredients.map(i => (typeof ITEM_DB !== 'undefined' && ITEM_DB.find(x => x.id === i.id) ? ITEM_DB.find(x => x.id === i.id).name : i.id) + '×' + i.qty).join('、')}</div>
    </button>`;
  });
  html += '<button class="event-choice-btn" onclick="closeEvent()" style="font-size:10px;">离开</button>';
  showCustomModal('🔨 请教锻造', html);
}

function learnForgeFromNpc(recipeId) {
  const ok = tryLearnForgeRecipe(recipeId, 'NPC传授');
  closeCustomModal();
  if (ok) updateAllUI();
}

// ── 炼丹师判定 + 请教丹方 ──
function isAlchemyTeacher(npc) {
  if (!npc || !npc.name) return false;
  const teachers = ['药店掌柜', '药农', '丹师', '守园老人', '药痴', '采药', '隐世丹修', '铁匠', '掌柜', '猎妖', '采露', '淬体', '金丹修士', '拾荒', '崖边悟道', '炼丹'];
  return teachers.some(t => npc.name.includes(t));
}

function askAlchemyRecipe(npc) {
  if (typeof DANFANG_DB === 'undefined') { addNarrative('（此人不懂炼丹之道。）', 'system'); closeCustomModal(); return; }
  const p = G.player;
  const learned = (p.learnedRecipes || []);
  // 该NPC能教的丹方
  const teachable = Object.keys(DANFANG_DB).filter(id => {
    const r = DANFANG_DB[id];
    return r.learnNpc === npc.name && !learned.includes(id);
  });
  
  if (teachable.length === 0) {
    closeCustomModal();
    addNarrative(`【${npc.name}】${learned.length > 0 ? '我这点丹方你都学全了，该去寻更高明的丹师了。' : '老夫从不外传丹方，你且去别处寻访吧。'}`, 'narr-event');
    return;
  }
  
  let html = `<div style="font-size:11px;color:var(--text-dim);margin-bottom:8px;">【${npc.name}】见你诚心向道，我这里有${teachable.length}个丹方可以传授：</div>`;
  teachable.forEach(id => {
    const r = DANFANG_DB[id];
    html += `<button class="event-choice-btn" style="display:block;width:100%;margin:3px 0;text-align:left;font-size:11px;" onclick="learnRecipeFromNpc('${id}')">
      📜 ${r.name} <span style="color:#d4a045;font-size:9px;">${r.quality}</span>
      <div style="font-size:9px;color:var(--text-dim);">材料：${r.ingredients.map(i => (typeof ITEM_DB !== 'undefined' && ITEM_DB.find(x => x.id === i.id) ? ITEM_DB.find(x => x.id === i.id).name : i.id) + '×' + i.qty).join('、')}</div>
    </button>`;
  });
  html += '<button class="event-choice-btn" onclick="closeEvent()" style="font-size:10px;">离开</button>';
  showCustomModal('📜 请教丹方', html);
}

function learnRecipeFromNpc(recipeId) {
  const ok = tryLearnRecipe(recipeId, 'NPC传授');
  closeCustomModal();
  if (ok) updateAllUI();
}

function buyFromNPC(itemId, price) {
  if (G.player.stones < price) { addNarrative('灵石不够。', 'system'); return; }
  G.player.stones -= price;
  const item = ITEM_DB.find(i => i.id === itemId);
  if (item) addItemToInventory(item, 1);
  addNarrative(`你从${npcManager.activeDialog?.name || '商贩'}处购得${item?.name}。`, 'event');
  if (!G.player.eventHistory) G.player.eventHistory = [];
  G.player.eventHistory.push(`购买了${item?.name}`);
  closeCustomModal();
  updateAllUI();
}

function giveGift(itemId, affinityGain) {
  const npc = npcManager.activeDialog;
  if (!npc) return;
  removeItemFromInventory(itemId, 1);
  npc.affinity = Math.min(100, npc.affinity + affinityGain);
  // 记住这次赠礼
  const itemName = ITEM_DB.find(i => i.id === itemId)?.name || '礼物';
  npc.memoryLog = npc.memoryLog || [];
  npc.memoryLog.push(`你曾赠予${itemName}`);
  addNarrative(`你将${itemName}赠予${npc.name}，好感度增加了！`, 'event');
  closeCustomModal();
  updateAllUI();
}

// ==========================
// 通用弹窗
// ==========================
let customModalCallback = null;

let _modalQueue = []; // 弹窗队列：已有弹窗打开时，新弹窗排队
let _modalBusy = false;

function showCustomModal(title, bodyHtml, opts) {
  const overlay = document.getElementById('event-overlay');
  // 🔧 结构完整性检查：内联式面板（法宝/神识 style.display='flex' 直接 innerHTML）会替换掉
  //    event-title/event-body/event-choices 节点，导致后续 showCustomModal 找不到元素报错。
  //    缺失时重建标准弹窗结构（保留 .event-modal 外层）。
  if (!document.getElementById('event-title') || !document.getElementById('event-body') || !document.getElementById('event-choices')) {
    // 重建标准结构：overlay > overlay-box.event-box > event-modal > (title/body/choices)
    const overlayBox = document.createElement('div');
    overlayBox.className = 'overlay-box event-box';
    const modal = document.createElement('div');
    modal.className = 'event-modal';
    modal.innerHTML = '<div class="event-title" id="event-title"></div>'
      + '<div class="event-body" id="event-body"></div>'
      + '<div class="event-choices" id="event-choices"></div>';
    overlayBox.appendChild(modal);
    overlay.innerHTML = '';
    overlay.appendChild(overlayBox);
  }
  // 已有弹窗打开 → 排队等待（防止场景切换时首次探索/奇遇/悟道互相覆盖）
  if (_modalBusy && !overlay.classList.contains('hidden')) {
    _modalQueue.push({ title, bodyHtml, opts: opts || {} });
    return;
  }
  _modalBusy = true;
  overlay.classList.remove('hidden');
  document.getElementById('event-title').textContent = title;
  document.getElementById('event-body').innerHTML = bodyHtml;
  var overlayBox = document.getElementById('event-body').closest('.overlay-box');
  if (overlayBox) {
    if (opts && opts.wide) {
      overlayBox.classList.add('modal-wide');
    } else {
      overlayBox.classList.remove('modal-wide');
    }
  }
  // 如果 bodyHtml 已包含关闭按钮则不再追加
  if (opts && opts.noCloseBtn) {
    document.getElementById('event-choices').innerHTML = '';
  } else {
    document.getElementById('event-choices').innerHTML = `
      <button class="event-choice-btn" onclick="closeCustomModal()">🚶 离开</button>
    `;
  }
}

function closeCustomModal() {
  const overlay = document.getElementById('event-overlay');
  if (overlay) {
    overlay.classList.add('hidden');
    overlay.style.display = ''; // 兼容内联 style.display='flex' 打开的面板（benming/shensi）
  }
  // 弹窗队列：关闭当前后展示下一个（防场景切换时首次探索/奇遇/悟道互相覆盖）
  if (_modalQueue.length > 0) {
    const next = _modalQueue.shift();
    setTimeout(function() {
      if (next) showCustomModal(next.title, next.bodyHtml, next.opts);
      else _modalBusy = false;
    }, 80);
  } else {
    _modalBusy = false;
  }
}

// 🔧 重置弹窗状态：内联式面板（法宝/神识 style.display='flex'）打开前调用，
//    避免“法宝面板开着→点灵兽被队列吞掉→屏幕还是法宝”的串台问题
function resetModalState() {
  _modalQueue = [];
  _modalBusy = false;
}

window.npcManager = npcManager;
window.showNPCList = showNPCList;
window.startNPCDialog = startNPCDialog;
window.executeNPCAction = executeNPCAction;
window.buyFromNPC = buyFromNPC;
window.giveGift = giveGift;
window.showCustomModal = showCustomModal;
window.closeCustomModal = closeCustomModal;
window.resetModalState = resetModalState;
window.generateNPCStory = generateNPCStory;
window.showNPCBiography = showNPCBiography;
window.isAlchemyTeacher = isAlchemyTeacher;
window.askAlchemyRecipe = askAlchemyRecipe;
window.learnRecipeFromNpc = learnRecipeFromNpc;
window.isForgeTeacher = isForgeTeacher;
window.askForgeRecipe = askForgeRecipe;
window.learnForgeFromNpc = learnForgeFromNpc;

// ==========================
// 🧑‍🤝‍🧑 存档角色NPC漫游
// ==========================
function roamPlayerNPCs() {
  if (!npcManager || !npcManager.npcs) return;
  var allScenes = [];
  if (typeof WORLD_DATA !== 'undefined' && WORLD_DATA.layers) {
    WORLD_DATA.layers.forEach(function(layer){
      (layer.scenes || []).forEach(function(s){ allScenes.push(s.id); });
    });
  }
  npcManager.npcs.forEach(function(n){
    if (!n._isPlayerNPC) return;
    var step = n._roamStep || 0;
    n._roamStep = (n._roamStep || 0) + 1;
    if (n._roamStep % 5 === 0 || Math.random() < 0.08) {
      var scene = SCENE_DATA ? SCENE_DATA[n.sceneId] : null;
      var conns = scene ? (scene.connections || []) : [];
      if (conns.length > 0 && Math.random() < 0.7) {
        n.sceneId = conns[Math.floor(Math.random() * conns.length)];
      } else {
        var filtered = allScenes.filter(function(sid){ return sid !== n.sceneId; });
        if (filtered.length > 0) n.sceneId = filtered[Math.floor(Math.random() * filtered.length)];
      }
    }
  });
}

window.roamPlayerNPCs = roamPlayerNPCs;

// ==========================
// 🤝 好友系统
// ==========================
function getFriendList() {
  if (!G.player) return [];
  if (!G.player._friends) G.player._friends = [];
  return G.player._friends;
}

function saveFriendList() {
  // friends 存在 player 上，存档自带，无需额外操作
}

function addFriend(npc) {
  var friends = getFriendList();
  if (friends.some(function(f){ return f.id === npc.id; })) {
    addNarrative('此人已是你的好友。', 'system');
    return false;
  }
  friends.push({
    id: npc.id,
    name: npc.name,
    role: npc.role || '散修',
    sceneId: npc.sceneId,
    affinity: npc.affinity || 0,
    addedAt: G.time.day || 0
  });
  addNarrative('✨ 与' + npc.name + '结为好友！', 'narr-event');
  return true;
}

function removeFriend(npcId) {
  var friends = getFriendList();
  var idx = friends.findIndex(function(f){ return f.id === npcId; });
  if (idx >= 0) {
    friends.splice(idx, 1);
    addNarrative('已从此人的好友中移除。', 'system');
  }
}

function getFriendAffinityLevel(affinity) {
  if (affinity >= 80) return { title:'生死之交', color:'#e04040', canSummon:true, canTeleport:true, canShareHP:true };
  if (affinity >= 60) return { title:'挚友', color:'#d4a045', canSummon:true, canTeleport:true, canShareHP:false };
  if (affinity >= 30) return { title:'知己', color:'#6a9ec9', canTeleport:true, canSummon:false, canShareHP:false };
  return { title:'点头之交', color:'#8a7a6a', canTeleport:false, canSummon:false, canShareHP:false };
}

function openFriendList() {
  var friends = getFriendList();
  if (friends.length === 0) {
    addNarrative('你尚未结交任何好友。多与人交谈，增进感情吧。', 'system');
    return;
  }
  
  // 同步最新的好感度和场景
  friends.forEach(function(f){
    var npc = npcManager.npcs.find(function(n){ return n.id === f.id; });
    if (npc) {
      f.affinity = npc.affinity || f.affinity;
      f.sceneId = npc.sceneId;
    }
  });
  
  var html = friends.map(function(f){
    var lv = getFriendAffinityLevel(f.affinity);
    var npcOnline = npcManager.npcs.some(function(n){ return n.id === f.id && n.isAlive !== false; });
    return '<div class="friend-card" style="margin-bottom:8px;padding:10px;background:rgba(0,0,0,0.2);border-radius:8px;border-left:3px solid ' + lv.color + ';">' +
      '<div style="display:flex;justify-content:space-between;align-items:center;">' +
        '<div><b>' + f.name + '</b> <span style="font-size:10px;color:' + lv.color + ';">' + lv.title + '</span></div>' +
        '<div style="font-size:10px;color:var(--text-dim);">好感 ' + f.affinity + '</div>' +
      '</div>' +
      '<div style="font-size:10px;color:var(--text-dim);margin-top:2px;">位于 ' + getSceneName(f.sceneId) + '</div>' +
      '<div style="margin-top:6px;display:flex;gap:4px;flex-wrap:wrap;">' +
        (lv.canTeleport && npcOnline ? '<button class="market-buy" onclick="teleportToFriend(\'' + f.id + '\')">🌀 传送到身边</button>' : '') +
        (lv.canSummon && npcOnline ? '<button class="market-buy" onclick="summonFriend(\'' + f.id + '\')">✨ 召唤过来</button>' : '') +
        (lv.canShareHP ? '<button class="market-buy" onclick="shareHPWithFriend(\'' + f.id + '\')">💚 灵力共享</button>' : '') +
        (f.affinity < 30 ? '<button class="market-buy" style="background:var(--danger);" onclick="removeFriend(\'' + f.id + '\');closeCustomModal();openFriendList();">❌ 断交</button>' : '') +
      '</div>' +
    '</div>';
  }).join('');
  
  showCustomModal('🤝 好友 (' + friends.length + '人)', html);
}

function getSceneName(sceneId) {
  try {
    var s = getSceneData(sceneId);
    return s ? s.name : sceneId;
  } catch(e) { return sceneId; }
}

function teleportToFriend(friendId) {
  var friends = getFriendList();
  var f = friends.find(function(fr){ return fr.id === friendId; });
  if (!f || !f.sceneId) { addNarrative('找不到好友的位置。', 'system'); return; }
  var npc = npcManager.npcs.find(function(n){ return n.id === f.id; });
  if (!npc || npc.isAlive === false) { addNarrative('你的好友已经不在人世了……', 'system'); return; }
  
  G.currentScene = f.sceneId;
  addNarrative('🌀 你心念一动，身形化作流光，瞬息间出现在了' + (npc ? npc.name : f.name) + '的身旁。', 'narr-event');
  if (npc) {
    npc.affinity = Math.min(100, (npc.affinity || 0) + 3);
    addNarrative('【' + npc.name + '】（惊喜地）你……你怎么来了？', 'narr-event');
  }
  updateSceneDisplay();
  updateAllUI();
  closeCustomModal();
}

function summonFriend(friendId) {
  var friends = getFriendList();
  var f = friends.find(function(fr){ return fr.id === friendId; });
  if (!f) return;
  var npc = npcManager.npcs.find(function(n){ return n.id === f.id; });
  if (!npc || npc.isAlive === false) { addNarrative('你的好友已经不在人世了……', 'system'); return; }
  
  npc.sceneId = G.currentScene;
  addNarrative('✨ 你以心意呼唤，' + npc.name + '的身影从虚空中浮现，出现在你面前。', 'narr-event');
  npc.affinity = Math.min(100, (npc.affinity || 0) + 3);
  addNarrative('【' + npc.name + '】（惊讶地）你唤我？好，我来了。', 'narr-event');
  updateAllUI();
  closeCustomModal();
}

function shareHPWithFriend(friendId) {
  var friends = getFriendList();
  var f = friends.find(function(fr){ return fr.id === friendId; });
  if (!f) return;
  var npc = npcManager.npcs.find(function(n){ return n.id === f.id; });
  if (!npc || npc.isAlive === false) { addNarrative('你的好友已经不在人世了……', 'system'); return; }
  
  var hpShare = Math.round(G.player.maxHp * 0.1);
  var qiShare = Math.round(G.player.maxQi * 0.1);
  G.player.hp = Math.min(G.player.maxHp, G.player.hp + hpShare);
  G.player.qi = Math.min(G.player.maxQi, G.player.qi + qiShare);
  addNarrative('💚 生死之交，气血相通！' + npc.name + '将自身灵力渡入你体内，你恢复了' + hpShare + '气血和' + qiShare + '灵力。', 'narr-event');
  npc.affinity = Math.min(100, (npc.affinity || 0) + 1);
  updateAllUI();
  closeCustomModal();
}

window.getFriendList = getFriendList;
window.addFriend = addFriend;
window.removeFriend = removeFriend;
window.getFriendAffinityLevel = getFriendAffinityLevel;
window.openFriendList = openFriendList;
window.teleportToFriend = teleportToFriend;
window.summonFriend = summonFriend;
window.shareHPWithFriend = shareHPWithFriend;

// ==========================
// 弹窗自由拖拽 + 缩放
// ==========================
function makeModalResizable(overlayBox, opts) {
  if (!overlayBox) return;
  opts = opts || {};
  var header = overlayBox.querySelector('.overlay-header');
  var box = overlayBox;
  
  // 默认尺寸
  if (!box.style.width) box.style.width = '92vw';
  if (!box.style.maxWidth) box.style.maxWidth = '920px';
  
  // 去掉居中定位，改为绝对定位（可拖动）
  box.style.position = 'fixed';
  box.style.margin = '0';
  var vw = window.innerWidth, vh = window.innerHeight;
  // 高度自适应视口：保证弹窗完整可见（图片460+名牌80+头部+边距≈600）
  var w = Math.min(920, vw - 40);
  var h = Math.min(640, vh - 40);
  h = Math.max(h, Math.min(560, vh - 40)); // 至少560，但不超过视口
  box.style.width = w + 'px';
  box.style.height = h + 'px';
  box.style.left = Math.max(10, Math.round((vw - w) / 2)) + 'px';
  box.style.top = Math.max(10, Math.round((vh - h) / 2)) + 'px';
  box.style.zIndex = '101';
  box.style.maxWidth = 'none';
  box.style.maxHeight = 'none';
  // 确保弹窗内部为纵向flex：头部固定 + 内容弹性 + 底部固定
  box.style.display = 'flex';
  box.style.flexDirection = 'column';
  var bodyEl = box.querySelector('.overlay-body');
  if (bodyEl) {
    bodyEl.style.flex = '1';
    bodyEl.style.minHeight = '0';
    bodyEl.style.overflow = 'hidden';
  }
  var choicesEl = box.querySelector('#event-choices');
  if (choicesEl) {
    choicesEl.style.flexShrink = '0';
  }
  
  // 最小尺寸
  var minW = 600, minH = 560;
  
  // ── 标题栏拖动 ──
  if (header) {
    header.style.cursor = 'move';
    header.style.userSelect = 'none';
    header.addEventListener('mousedown', function(e) {
      if (e.target.tagName === 'BUTTON') return; // 不拦截关闭按钮
      e.preventDefault();
      var startX = e.clientX, startY = e.clientY;
      var origLeft = box.offsetLeft, origTop = box.offsetTop;
      function onMove(ev) {
        box.style.left = Math.max(0, origLeft + (ev.clientX - startX)) + 'px';
        box.style.top = Math.max(0, origTop + (ev.clientY - startY)) + 'px';
      }
      function onUp() {
        document.removeEventListener('mousemove', onMove);
        document.removeEventListener('mouseup', onUp);
      }
      document.addEventListener('mousemove', onMove);
      document.addEventListener('mouseup', onUp);
    });
  }
  
  // ── 右下角缩放手柄 ──
  var handle = document.createElement('div');
  handle.style.cssText = 'position:absolute;right:2px;bottom:2px;width:16px;height:16px;cursor:nwse-resize;z-index:10;' +
    'background:linear-gradient(135deg,transparent 50%,rgba(160,190,220,0.5) 50%,rgba(160,190,220,0.5) 60%,transparent 60%);';
  handle.title = '拖动调整大小';
  box.appendChild(handle);
  handle.addEventListener('mousedown', function(e) {
    e.preventDefault();
    e.stopPropagation();
    var startX = e.clientX, startY = e.clientY;
    var origW = box.offsetWidth, origH = box.offsetHeight;
    function onMove(ev) {
      var w = Math.max(minW, origW + (ev.clientX - startX));
      var h = Math.max(minH, origH + (ev.clientY - startY));
      w = Math.min(w, window.innerWidth - 20);
      h = Math.min(h, window.innerHeight - 20);
      box.style.width = w + 'px';
      box.style.height = h + 'px';
    }
    function onUp() {
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup', onUp);
    }
    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onUp);
  });
  
  // 返回值供清理
  return { box: box, handle: handle };
}
window.makeModalResizable = makeModalResizable;
