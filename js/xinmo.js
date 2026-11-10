// === 唯我独仙 · 心魔劫系统 ===
// 突破大境界时触发心魔试炼，直面执念。成功道心大涨，失败走火入魔。
// 支持：金丹/元婴/化神/大乘/渡劫 五个大关

// ── 心魔池：按境界深度生成 ──
const XINMO_POOL = {
  // 金丹：初涉心魔，多是恐惧/迷茫
  jindan: [
    {
      name: '名利之劫',
      scene: '你盘膝而坐，灵台空明。忽然耳边响起万千赞叹——"天才！""百年不遇！"你看见自己站在山巅，受万人敬仰，脚下是无数的白骨与尸骸。一个声音在耳边低语：继续爬，踩下去，你就是最强。',
      choices: [
        { text: '🌾 拂袖而去——"大道万千，何须人前显圣"', type: 'clear', effect: { mood: 8, wisdom: 2 } },
        { text: '😈 沉溺其中——"我本天骄，万人之上又如何"', type: 'indulge', effect: { mood: -5 } },
        { text: '🧘 静坐观心——"名是虚妄，利是枷锁，心不动则万法空"', type: 'clear', effect: { mood: 12, wisdom: 3 } },
      ]
    },
    {
      name: '生死之惧',
      scene: '幻境中，你看见自己寿元耗尽、白发苍苍地躺在病榻上。周围人声渐远，黑暗一寸寸吞噬视野。一个声音说：修行千年，不过一捧黄土。你怕了吗？',
      choices: [
        { text: '⚔️ 怒喝一声——"我命由我不由天！"', type: 'clear', effect: { mood: 6, attack: 3 } },
        { text: '😨 颤抖着后退——"不……我不要死……"', type: 'indulge', effect: { mood: -8 } },
        { text: '☯️ 淡然一笑——"生亦何欢，死亦何苦。道在生死之外。"', type: 'clear', effect: { mood: 10, wisdom: 4 } },
      ]
    },
    {
      name: '情丝之困',
      scene: '你梦见那个求而不得的人——她背对着你，越走越远。你伸出手，却怎么也够不到。心底最柔软的地方被狠狠攥住：放弃道途，去追她，好不好？',
      choices: [
        { text: '💔 闭眼——"情之一字，最是磨人。缘起缘灭，皆是修行。"', type: 'clear', effect: { mood: 5 } },
        { text: '😭 追上去——"我什么都不要了，只要你！"', type: 'indulge', effect: { mood: -10, wisdom: -2 } },
        { text: '🌸 轻轻合十——"若有来世，江湖再见。此世，我已许道。"', type: 'clear', effect: { mood: 9, wisdom: 5 } },
      ]
    },
  ],
  // 元婴：心魔更深，涉及道心根本
  yuanying: [
    {
      name: '道途之疑',
      scene: '你看见另一个自己，站在你选的那条路的尽头——他浑身是伤，形销骨立，回头问你："这一路，值得吗？你修的道，真的是你的道吗？"',
      choices: [
        { text: '🔥 直视他——"纵使前路万劫不复，吾往矣！"', type: 'clear', effect: { mood: 10, attack: 5 } },
        { text: '❓ 犹豫——"我……我选的这条路……"', type: 'indulge', effect: { mood: -10 } },
        { text: '🌌 闭目凝神——"道无对错，只有选择。既已选择，便一往无前。"', type: 'clear', effect: { mood: 14, wisdom: 4 } },
      ]
    },
    {
      name: '杀孽之影',
      scene: '你脚下的大地忽然化作血海，无数你曾斩杀的妖兽、敌人的脸浮现在血水中，无声地凝视着你。一个声音幽幽道：你杀了这么多，和魔头有何区别？',
      choices: [
        { text: '🛡️ 沉声道——"杀伐为护道，非为嗜杀。吾心光明，何惧宵小之言。"', type: 'clear', effect: { mood: 8 } },
        { text: '😰 辩解——"我……我是为了变强！我没得选！"', type: 'indulge', effect: { mood: -12 } },
        { text: '☯️ 盘坐血海——"杀生为护生，斩业非斩人。此心澄澈，万法皆空。"', type: 'clear', effect: { mood: 12, wisdom: 5 } },
      ]
    },
  ],
  // 化神：大道之问，直指本心
  huashen: [
    {
      name: '天道之问',
      scene: '你站在混沌虚空，头顶是浩瀚天穹，脚下是无尽深渊。一个宏大的声音从四面八方传来："修行者，你可知何为道？"',
      choices: [
        { text: '🌅 昂首答——"道即本心，心之所向，道之所在。"', type: 'clear', effect: { mood: 15, wisdom: 6 } },
        { text: '🤯 茫然——"我……我不知道……"', type: 'indulge', effect: { mood: -15 } },
        { text: '🌌 沉默良久——"道不可言，可言者非道。我即道，道即我。"', type: 'clear', effect: { mood: 20, wisdom: 8 } },
      ]
    },
    {
      name: '飞升之诱',
      scene: '一道金光从天而降，仙音袅袅，天门洞开。一个仙人虚影俯瞰着你："跟我走，即刻飞升，超脱生死，永恒逍遥。"',
      choices: [
        { text: '🙏 摇头——"若飞升需弃人间，那我宁舍仙缘，护我身后之人。"', type: 'clear', effect: { mood: 12, luck: 3 } },
        { text: '🏃 冲上去——"飞升！我要飞升！"', type: 'indulge', effect: { mood: -18 } },
        { text: '🧘 阖目——"天门自开，何须你引。我心即天，随处可飞升。"', type: 'clear', effect: { mood: 18, wisdom: 6 } },
      ]
    },
  ],
};

// ── 心魔状态 ──
let _xinmoActive = false;

// 当前境界是否该触发心魔（大境界关：金丹/元婴/化神/大乘）
function getXinmoTier(realmIdx) {
  // realmIdx: 12=金丹初, 15=元婴初, 18=化神初, 21=大乘, 22=渡劫
  if (realmIdx === 12) return 'jindan';
  if (realmIdx === 15) return 'yuanying';
  if (realmIdx === 18) return 'huashen';
  return null;
}

// 触发心魔（返回true表示进入心魔试炼，中断突破）
function tryTriggerXinmo() {
  const p = G.player;
  if (!p) return false;
  // 心魔劫在突破前触发：判断的是突破后的目标境界（当前境界+1）
  const targetIdx = p.qiRealmIndex + 1;
  const tier = getXinmoTier(targetIdx);
  if (!tier) return false;
  if (_xinmoActive) return false;
  
  // 大境界突破前的心魔：每次突破大境界触发一次
  const key = 'xinmo_' + tier;
  if (p.questFlags && p.questFlags[key]) return false; // 已渡过此劫
  
  // 概率触发：金丹80%、元婴85%、化神90%（大境界要有仪式感，但留一点意外）
  let chance = tier === 'jindan' ? 0.8 : (tier === 'yuanying' ? 0.85 : 0.9);
  // ☯️ 业力影响：杀孽越重心魔越凶（触发概率更高）
  if (typeof getKarmaXinmoMod === 'function') chance += getKarmaXinmoMod();
  if (Math.random() > chance) return false;
  
  const pool = XINMO_POOL[tier] || [];
  if (pool.length === 0) return false;
  const xinmo = pool[Math.floor(Math.random() * pool.length)];
  
  // 🤖 自动模式：不弹窗，智能结算（道心坚定者更易渡劫）
  if (typeof G !== 'undefined' && G.autoMode === true) {
    _xinmoActive = true;
    // 成功率：基础0.7 + 心境/200 + 悟性/400 + 业力修正
    let autoChance = 0.7 + (p.mood - 50) / 200 + (p.wisdom - 50) / 400;
    if (typeof getKarmaXinmoMod === 'function') autoChance -= getKarmaXinmoMod() * 0.5;
    autoChance = Math.min(0.95, Math.max(0.3, autoChance));
    const success = Math.random() < autoChance;
    const goodChoice = xinmo.choices.find(c => c.type === 'clear') || xinmo.choices[0];
    const badChoice = xinmo.choices.find(c => c.type !== 'clear') || xinmo.choices[xinmo.choices.length - 1];
    const chosen = success ? goodChoice : badChoice;
    // 直接结算（传入具体心魔，避免pool匹配错位）
    resolveXinmo(tier, key, xinmo.choices.indexOf(chosen), chosen.type, xinmo);
    return true;
  }
  
  _xinmoActive = true;
  showXinmoModal(tier, xinmo, key);
  return true;
}

// 显示心魔试炼弹窗
function showXinmoModal(tier, xinmo, key) {
  let html = '<div style="text-align:center;padding:4px;">';
  html += '<div style="font-size:11px;color:#a06ab5;letter-spacing:2px;margin-bottom:6px;">━━ 心魔劫 · ' + xinmo.name + ' ━━</div>';
  html += '<div style="font-size:12px;line-height:1.8;color:#cbb;margin:8px 0;padding:10px;background:rgba(80,20,80,0.15);border-radius:8px;border:1px solid rgba(160,106,181,0.3);">' + xinmo.scene + '</div>';
  html += '<div style="font-size:10px;color:var(--text-dim);margin-bottom:6px;">心魔缠身，需以道心抉择。选错可能走火入魔……</div>';
  
  xinmo.choices.forEach((c, i) => {
    html += `<button class="event-choice-btn" style="display:block;width:100%;margin:4px 0;text-align:left;font-size:11px;padding:8px 10px;background:rgba(80,20,80,0.08);border:1px solid rgba(160,106,181,0.25);color:#e8d5f5;border-radius:6px;cursor:pointer;" 
      onclick="resolveXinmo('${tier}','${key}',${i},'${c.type}')">${c.text}</button>`;
  });
  
  html += '</div>';
  showCustomModal('🌀 心魔劫', html, { noCloseBtn: true });
}

// 结算心魔
function resolveXinmo(tier, key, choiceIdx, type, directXinmo) {
  const p = G.player;
  const pool = XINMO_POOL[tier] || [];
  // 找到对应的心魔（用第一个匹配的选择结构）；directXinmo 直接指定（自动模式）
  let xinmo = directXinmo || null;
  if (!xinmo) {
    for (const xm of pool) {
      if (xm.choices[choiceIdx] && xm.choices[choiceIdx].type === type) { xinmo = xm; break; }
    }
  }
  if (!xinmo) { closeCustomModal(); _xinmoActive = false; return; }
  const choice = xinmo.choices[choiceIdx];
  
  closeCustomModal();
  _xinmoActive = false;
  
  if (type === 'clear') {
    // 渡劫成功：道心大涨
    // ☯️ 业力惩罚：杀孽深重时，心魔反噬（渡劫可能仍失败）
    const karmaFail = (typeof getKarmaXinmoMod === 'function' ? getKarmaXinmoMod() : 0);
    if (karmaFail > 0 && Math.random() < karmaFail) {
      closeCustomModal();
      _xinmoActive = false;
      const p2 = G.player;
      p2._lastAttemptFailed = true;
      if (!p2.breakFailCount) p2.breakFailCount = 0;
      p2.breakFailCount += 1;
      p2.qiCultivationPoints = Math.max(getQiRealm().cpRequired || 0, (p2.qiCultivationPoints || 0) - Math.round((p2.qiCultivationPoints || 0) * 0.08));
      p2.qi = Math.round((p2.qi || 0) * 0.5);
      addNarrative(`<div style="border:1px solid rgba(200,80,80,0.5);border-radius:8px;padding:10px;margin:6px 0;background:rgba(120,30,30,0.15);">
        <div style="font-weight:bold;color:#e77;">💥 业火反噬！</div>
        <div style="font-size:11px;color:var(--text-dim);margin-top:4px;">你虽守住道心，但身上杀孽太重，业火在最后一刻反噬——周身经脉灼痛，修为溃散。</div>
        <div style="font-size:10px;color:#e77;">⚠️ 修为-8%，灵力大损（因果报应）</div>
      </div>`, 'danger');
      updateAllUI();
      return;
    }
    p.questFlags[key] = true; // 标记已渡过
    const eff = choice.effect || {};
    if (eff.mood) p.mood = Math.min(100, (p.mood || 0) + eff.mood);
    if (eff.wisdom) p.wisdom = Math.min(100, (p.wisdom || 0) + eff.wisdom);
    if (eff.attack) p.attack = (p.attack || 0) + eff.attack;
    if (eff.luck) p.luck = Math.min(100, (p.luck || 0) + eff.luck);
    // 突破成功率加成标记（下一次突破直接成功）
    p._xinmoBless = 0.5; // 心魔已渡，突破+50%成功率
    addNarrative(`<div style="border:1px solid rgba(100,200,150,0.4);border-radius:8px;padding:10px;margin:6px 0;background:rgba(40,120,80,0.12);">
      <div style="font-weight:bold;color:#7dce9a;">🌀 心魔已破！道心通明</div>
      <div style="font-size:11px;color:var(--text-dim);margin-top:4px;">你从幻境中睁开双眼，眼神前所未有的清明。心魔如雾散去，道心愈发坚定。</div>
      ${eff.mood ? `<div style="font-size:10px;color:#8cc;">😌 心境 +${eff.mood}</div>` : ''}
      ${eff.wisdom ? `<div style="font-size:10px;color:#8cc;">🧠 悟性 +${eff.wisdom}</div>` : ''}
      ${eff.attack ? `<div style="font-size:10px;color:#8cc;">⚔️ 攻击 +${eff.attack}</div>` : ''}
      ${eff.luck ? `<div style="font-size:10px;color:#8cc;">🍀 气运 +${eff.luck}</div>` : ''}
      <div style="font-size:10px;color:#f4c542;">✨ 突破成功率 +50%</div>
    </div>`, 'milestone');
    // 渡劫成功直接补一次突破判定（丹药已服，直接冲关）
    if (typeof qiBreakthroughCheck === 'function') setTimeout(() => { try { qiBreakthroughCheck(); } catch(e) {} }, 300);
  } else {
    // 走火入魔：惩罚
    const eff = choice.effect || {};
    if (eff.mood) p.mood = Math.max(0, (p.mood || 0) + eff.mood);
    if (eff.wisdom) p.wisdom = Math.max(0, (p.wisdom || 0) + eff.wisdom);
    p._lastAttemptFailed = true;
    if (!p.breakFailCount) p.breakFailCount = 0;
    p.breakFailCount += 2; // 走火入魔算两次失败
    // 掉修为
    const losePct = 0.15;
    const curRealm = typeof getQiRealm === 'function' ? getQiRealm() : null;
    if (curRealm) {
      p.qiCultivationPoints = Math.max(curRealm.cpRequired, (p.qiCultivationPoints || 0) - Math.round((p.qiCultivationPoints - curRealm.cpRequired) * losePct));
    }
    p.qi = Math.round((p.qi || 0) * 0.4);
    addNarrative(`<div style="border:1px solid rgba(200,80,80,0.5);border-radius:8px;padding:10px;margin:6px 0;background:rgba(120,30,30,0.15);">
      <div style="font-weight:bold;color:#e77;">💥 走火入魔！</div>
      <div style="font-size:11px;color:var(--text-dim);margin-top:4px;">你被心魔吞噬，真气逆乱，经脉受损。气血翻涌间，你勉强守住一丝清明，捡回一条命。</div>
      <div style="font-size:10px;color:#e77;">⚠️ 修为倒退15%，灵力大损，心境重创</div>
      ${eff.wisdom ? `<div style="font-size:10px;color:#e77;">🧠 悟性 ${eff.wisdom > 0 ? '+' : ''}${eff.wisdom}</div>` : ''}
    </div>`, 'danger');
  }
  updateAllUI();
}

// 导出
window.tryTriggerXinmo = tryTriggerXinmo;
window.resolveXinmo = resolveXinmo;
window.getXinmoTier = getXinmoTier;
