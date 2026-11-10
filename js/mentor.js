// === 唯我独仙 · 引路人系统 ===
// 青云镇的老药农「沈伯」——你的修行引路人
// 他不是任务面板，是活的人：会根据你的当前进度，说出恰当的建议

const MENTOR_NPC = {
  id: 'mentor_shenbo',
  name: '沈伯',
  role: '老药农',
  scene: 'qingyun',
  personality: '古道热肠',
  speechStyle: '乡音浓重，爱用"娃子/丫头"称呼你，说话朴实',
  desire: '看着后辈修行有成，是他最大的心愿',
};

// ── 根据玩家进度生成指引 ──
function getMentorAdvice() {
  const p = G.player;
  if (!p) return null;
  const qi = p.qiRealmIndex || 0;
  const body = p.bodyRealmIndex || 0;
  const hasBeast = (p.beasts && p.beasts.length > 0);
  const hasRecipe = (p.learnedRecipes && p.learnedRecipes.length > 0);
  const fame = p.fame || 0;
  
  // 按境界分阶段给建议
  const stages = [];
  
  // ── 练气前期（0-2）：教你入门 ──
  if (qi <= 2) {
    stages.push({
      text: '娃子，修行第一步，先把「感知」用熟喽。' + (qi === 0 ? '你连一丝气感都没有，先感知天地灵气，找找感觉。' : '你现在勉强有了一丝气感，多感知、多探点，山里灵气足的地方走走。'),
      action: '🔍 多感知 · 📌 多探点',
    });
    stages.push({
      text: '镇上铁匠老吴那儿有趁手的家伙什，药店掌柜收药材。你采些清灵草卖了，攒点灵石傍身。',
      action: '🌿 采药卖钱',
    });
    stages.push({
      text: '修炼之前，先把吐纳法吃透。你在青云镇歇脚时，心里默念功法口诀，一遍遍运转周天。',
      action: '🧘 打坐修炼',
    });
  }
  
  // ── 练气中期（3-5）：指引突破 ──
  if (qi >= 3 && qi <= 5) {
    stages.push({
      text: '练气三层的坎儿，卡住了不少修士。你要备好破气丹（黑风岭的妖兽身上有，坊市也卖），心境平和时冲击瓶颈。',
      action: '⚗️ 备破气丹 → 突破',
    });
    stages.push({
      text: '光打坐不行，得见见血。黑风岭的山贼、落霞森林的妖兽，都是练手的好对象。打赢了，名声和灵石都有了。',
      action: '⚔️ 实战历练',
    });
  }
  
  // ── 练气后期（6-8）：准备筑基 ──
  if (qi >= 6 && qi <= 8) {
    stages.push({
      text: '娃子，你该琢磨筑基的事了。筑基丹（雪莲子×2+千年灵芝+火精草+灵泉水）得提前备齐，灵药园里有好东西。',
      action: '⚗️ 炼丹筑基丹',
    });
    stages.push({
      text: '筑基是大事，心境要好（心境80以上）、功法要齐（至少4门）。你没事多去灵云峰打坐，那里灵气足。',
      action: '🧘 灵云峰静修',
    });
    if (!hasRecipe) {
      stages.push({
        text: '你会炼丹不？不会的话去找药园里的丹师柳青请教请教，筑基丹自己炼比买便宜多了。',
        action: '📜 请教丹方',
      });
    }
  }
  
  // ── 筑基后（9-11）──
  if (qi >= 9 && qi <= 11) {
    stages.push({
      text: '筑基成了！娃子你是真出息了。不过金丹之路更险——聚气丹、破壁丹都得备着，心境、悟性、根骨一个不能少。',
      action: '⚗️ 备金丹所需',
    });
    if (!hasBeast) {
      stages.push({
        text: '你如今也算修士了，该养只灵兽伴身。落霞森林的青风狼、冰风石窟的雪狐，都是忠心的好伙伴。',
        action: '🐾 驯服灵兽',
      });
    }
  }
  
  // ── 金丹后（12+）──
  if (qi >= 12) {
    stages.push({
      text: '金丹已成，老朽这辈子也没见过几个。往后是天高海阔，还是陨落中途，就看你自己了。',
      action: '🌟 名声远扬',
    });
    if (fame < 800) {
      stages.push({
        text: '你这一身本事，也该让天下人知道了。多去秘境闯荡、多斩妖除魔，名声大了，机缘自然来。',
        action: '🌀 秘境探索',
      });
    }
  }
  
  // ── 通用提醒 ──
  if (p.mood < 40) {
    stages.push({
      text: '娃子，你脸色不太好。修行最忌心浮气躁，去月华谷散散心，或者回镇上来歇歇脚。',
      action: '🕊️ 调养心境',
    });
  }
  if (qi > 0 && (p.qiCultivationPoints || 0) >= getQiRealmCpRequired()) {
    stages.push({
      text: '哟！你这修为都攒满了，还不赶紧突破？卡着等啥呢！',
      action: '⚡ 立即突破',
    });
  }
  
  return stages;
}

function getQiRealmCpRequired() {
  try {
    const r = typeof getQiRealm === 'function' ? getQiRealm() : null;
    return r ? r.cpRequired : 0;
  } catch(e) { return 0; }
}

// ── 沈伯对话 ──
function talkToMentor() {
  const p = G.player;
  const advice = getMentorAdvice();
  
  const greetings = [
    '（沈伯放下手里的药锄，擦了擦汗，笑呵呵地看着你）',
    '（沈伯正在晾晒药材，见你来了，眼睛一亮）',
    '（沈伯坐在门槛上抽着旱烟，烟雾缭绕中眯眼打量你）',
  ];
  
  let html = `<div style="padding:2px;">
    <div style="font-size:12px;color:var(--text);line-height:1.9;padding:10px;background:rgba(60,80,40,0.1);border-radius:8px;border:1px solid rgba(100,150,80,0.2);">
      ${greetings[Math.floor(Math.random() * greetings.length)]}
      <div style="margin-top:6px;">「${p.name}啊，来，坐。老朽给你说道说道。」</div>
    </div>
    <div style="font-size:11px;font-weight:bold;color:#7dce9a;margin:10px 0 4px;">📜 沈伯的指点</div>`;
  
  advice.forEach(a => {
    html += `<div style="border-left:3px solid #7dce9a;padding:6px 10px;margin:4px 0;font-size:11px;color:var(--text);line-height:1.7;">
      ${a.text}
      <div style="font-size:10px;color:#e8c88a;margin-top:3px;">👉 ${a.action}</div>
    </div>`;
  });
  
  html += '</div>';
  showCustomModal('👴 沈伯', html + '<button class="event-choice-btn" onclick="closeEvent()">告辞</button>');
}

// 沈伯是不是在场（青云镇有固定NPC）
// 沈伯：新玩家无论出生何处都能遇见（游历感）
// 传入场景id：沈伯会在该场景出现；不传则默认青云镇
function ensureMentor(sceneId) {
  if (typeof npcManager === 'undefined' || !npcManager) return;
  try {
    const targetScene = sceneId || MENTOR_NPC.scene;
    // 沈伯已存在：直接把他带到目标场景（老药农四处走动的游历感）
    const existing = npcManager.npcs.find(n => n.id === MENTOR_NPC.id);
    if (existing) {
      // 玩家第一次见到时，沈伯出现在当前场景；之后回到青云镇常驻
      if (existing.sceneId !== targetScene) {
        existing.sceneId = targetScene;
      }
      return existing;
    }
    // 生成沈伯
    const npc = {
      id: MENTOR_NPC.id,
      name: MENTOR_NPC.name,
      role: MENTOR_NPC.role,
      personality: MENTOR_NPC.personality,
      speechStyle: MENTOR_NPC.speechStyle,
      desire: MENTOR_NPC.desire,
      sceneId: targetScene,
      isFirstMeeting: true,
      affinity: 50,
      gender: '男',
      isMentor: true,
      background: '青云镇本地农户，年轻时也曾外出闯荡，最终选择回乡种药，安度余生。',
      roleQuirk: '手掌粗糙，指缝里总有洗不净的泥土，笑起来眼角皱纹很深，腰间挂着一个旧药囊。',
      _noStory: true, // 跳过AI生成，用固定人设
      _wanderStart: targetScene, // 记住出生时遇见他的地方
    };
    npcManager.npcs.push(npc);
    return npc;
  } catch(e) { return null; }
}

// 沈伯的特殊对话入口（在NPC对话里加"请教修行"选项）
function mentorDialogOption(npc) {
  if (!npc || npc.id !== MENTOR_NPC.id) return null;
  return { id: 'mentor_advice', text: '📜 请教修行之道', action: () => talkToMentor(), condition: true };
}

// 导出
window.MENTOR_NPC = MENTOR_NPC;
window.getMentorAdvice = getMentorAdvice;
window.talkToMentor = talkToMentor;
window.ensureMentor = ensureMentor;
window.mentorDialogOption = mentorDialogOption;
