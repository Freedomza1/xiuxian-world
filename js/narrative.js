// === 唯我独仙 · Narrative Engine (DeepSeek AI) ===

const DEEPSEEK_API_KEY = (window.XIUXIAN_CONFIG && window.XIUXIAN_CONFIG.DEEPSEEK_API_KEY) ? window.XIUXIAN_CONFIG.DEEPSEEK_API_KEY : "";

// AI narrative generation
async function generateNarrative(context, type = 'action') {
  try {
    const systemPrompt = `你是修仙世界「唯我独仙」的叙事者，擅长细腻的散文式描写。
你的任务是：用舒缓的流水般文字，渲染修仙世界里的一次行动。
- 语言风格：古雅舒缓，像读一卷闲书，不赶不抢
- 篇幅：60-150字，2-4句话，让人读得慢、读得细
- 视角：第二人称「你」
- 多写感官：风声、气味、天色、肌肤触感、灵气流动
- 不要报数值，用画面和情绪传递状态
- 像写散文小品，有闲适的节奏，不必每句都推动剧情`;

    const userPrompt = generatePromptForType(context, type);
    
    const response = await fetch('https://api.deepseek.com/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + DEEPSEEK_API_KEY,
      },
      body: JSON.stringify({
        model: 'deepseek-v4-flash',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        max_tokens: 150,
        temperature: 0.8,
      })
    });

    if (!response.ok) throw new Error('API error: ' + response.status);
    
    const data = await response.json();
    const text = data.choices[0].message.content.trim();
    return text;
  } catch (e) {
    console.warn('Narrative AI failed:', e);
    return null;
  }
}

function generatePromptForType(context, type) {
  switch (type) {
    case 'cultivate':
      return `${context.location}，${context.time}。${context.playerName}正在修炼${context.skill}。
场景：${context.sceneDesc}
请用一句古风渲染这次修炼的感受。`;
    
    case 'explore':
      return `${context.playerName}在${context.location}探索。
场景：${context.sceneDesc}
时间：${context.time}
请用一句古风描写他/她所见所感。`;
    
    case 'rest':
      return `${context.playerName}在${context.location}休息调息。
场景：${context.sceneDesc}
请用一句古风描写休憩的感受。`;
    
    case 'combat_victory':
      return `${context.playerName}在${context.location}击败了${context.enemy}。
请用一句古风描写战斗胜利的场面。`;
    
    case 'combat_defeat':
      return `${context.playerName}在${context.location}被${context.enemy}击败。
请用一句古风描写落败的场景。`;
    
    case 'breakthrough':
      return `${context.playerName}在${context.location}突破了境界，达到${context.realm}！
请用一句古风渲染突破的震撼场面。`;
    
    case 'event':
      return `${context.playerName}在${context.location}遇到了${context.eventTitle}。
${context.eventDesc}
请用一句古风描写他/她的反应。`;
    
    default:
      return `请用一句古风描写${context.playerName}在修仙世界中的状态。`;
  }
}

// Fallback narratives (offline)
const FALLBACK_NARRATIVES = {
  cultivate: [
    '你闭目凝神，引天地灵气入体。经脉中如涓涓细流，暖意融融。风从林间穿过，拂起你的衣角，你却浑然不觉——心神尽在丹田中那团渐亮的光芒里。',
    '丹田中灵气翻涌，顺着功法路线缓缓运转。每一次吐纳，都有一丝灵力沉淀入骨。额间渗出细密的汗珠，在晨光中微微闪烁。',
    '盘膝而坐，五心朝天。灵气如雾般自百会穴灌入，洗练周身经脉。远处传来山鸟的啼鸣，但你心如古井，不起波澜。',
    '功法运转一周天，只觉神清气爽。空气中的灵气仿佛有了生命，争先恐后地涌入体内。你感到四肢百骸都在微微发热——那是修为在增长的征兆。',
  ],
  explore: [
    '你踏着晨露前行，四周林木幽深，偶尔有鸟鸣声传来。脚下的泥土松软潮湿，覆着一层薄薄的落叶。阳光从树冠的缝隙里漏下来，在地上洒出斑驳的光影。',
    '小径蜿蜒，两旁野花烂漫。远处山峦叠翠，云雾缭绕如仙境。你深深吸了一口气，草木的清香和泥土的气息一同涌入胸腔，让人精神为之一振。',
    '风掠过树梢，带来远方的气息。你放开灵识，感受着这片天地的脉动——每一片叶子的颤动、每一缕风的流向，都清清楚楚地映在你的感知中。',
    '脚下石阶斑驳，覆着青苔。每一步都踩在岁月的痕迹上。不知已有多少年无人走过这条路了。你伸手摸了摸路旁的石壁，指尖传来冰凉而粗糙的触感。',
    '天色渐渐亮起来。远山的轮廓在晨光中一点点清晰，像一幅水墨画正在缓缓展开。你站在高处眺望，风在耳畔低语，天地之间，只剩你一人。',
  ],
  rest: [
    '你寻了一处树荫坐下，微风拂面，倦意渐消。树叶在头顶沙沙作响，像一首低沉的催眠曲。你闭上眼，任思绪飘散在暖融融的空气中。',
    '溪水潺潺，你掬一捧清水洗了把脸，精神为之一振。水珠顺着下巴滑落，在衣襟上洇开一小片深色的水渍。你甩了甩手上的水，长出一口气。',
    '靠在一块青石上，闭目养神。灵气在周身缓缓流转，恢复着损耗。石头被太阳晒得温温热，透过衣料传来，有一种说不出的舒适。',
    '盘膝调息，一呼一吸间，天地灵气缓缓渗入四肢百骸。鸟鸣声渐渐远去，世界安静下来，只剩下你自己的呼吸和心跳。',
  ],
  combat_victory: [
    '最后一击，剑气如虹！对手踉跄后退，终是不敌。你收剑而立，衣袂在风中猎猎作响。喘息渐渐平复，四周的尘埃也慢慢落定。',
    '你收剑而立。风声还在耳畔呼啸，但胜负已分。对手的身影在你眼前晃了晃，终于无力地倒下。你低头看了一眼剑锋上滑落的血珠，神色平静。',
    '电光火石之间，胜负已分。你拂了拂袖上的尘土，神色淡然。周围的空气里还残留着灵力碰撞的余波，像水面的涟漪一样一圈圈扩散开去。',
    '战斗结束后，你独自站在原地，听着自己的心跳声渐渐平复。风穿过树林，带来了远处山涧的潺潺水声——这世界又恢复了它原本的宁静。',
  ],
  breakthrough: [
    '轰——！丹田中一声闷响，灵力如江河决堤般冲开壁垒！经脉中传来噼啪声响，仿佛某种沉重的枷锁被一层层震碎。你浑身一震，新的力量在体内奔腾咆哮！',
    '天地灵气骤然向你汇聚，形成一个无形的漩涡。风声大作，衣袍猎猎翻飞。你感到四肢百骸都在这灵气的冲刷中重塑、淬炼——突破了。',
    '经脉中传来噼啪声响，仿佛某种枷锁被打碎。新的力量在体内奔腾，像解冻的春水一般汹涌澎湃。你睁开眼，世界在你眼中仿佛变了一个模样——更清晰，更近，也更宽广。',
  ],
};

function getFallbackNarrative(type) {
  const pool = FALLBACK_NARRATIVES[type] || FALLBACK_NARRATIVES.explore;
  return pool[Math.floor(Math.random() * pool.length)];
}

// Master function: try AI first, fallback on failure
async function renderNarrative(context, type) {
  // Try AI
  const aiText = await generateNarrative(context, type);
  if (aiText) {
    addNarrative(aiText, type === 'cultivate' || type === 'breakthrough' ? 'narr-event' : type === 'combat_victory' ? 'narr-combat' : 'default');
    return aiText;
  }
  // Fallback
  const fallback = getFallbackNarrative(type);
  addNarrative(fallback, type === 'cultivate' || type === 'breakthrough' ? 'narr-event' : type === 'combat_victory' ? 'narr-combat' : 'default');
  return fallback;
}
