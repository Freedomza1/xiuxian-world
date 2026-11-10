// === 唯我独仙 · 人物传记（文学化面板） ===
// 不再只是属性表——你点开的是自己的一生

// ==========================
// 打开人物面板
// ==========================
function showCharacterPanel() {
  const p = G.player;
  if (!p) return;

  const breakData = p._statBreakdown || { base:{}, elementBonus:{}, skillBreakdown:[], equipment:{} };
  const qiRealm = QI_REALMS[p.qiRealmIndex]?.name || '凡人';
  const bodyRealm = BODY_REALMS[p.bodyRealmIndex]?.name || '凡体';
  const genIcon = p.gender === '女' ? '👩' : '👤';
  const genderCN = p.gender === '女' ? '女修' : '男修';
  const originData = (typeof CHARACTER_ORIGINS !== 'undefined' ? CHARACTER_ORIGINS : []).find(o => o.id === p.origin);

  // ── 人物传头部 ──
  let html = `
    <div style="text-align:center;margin-bottom:12px;">
      <div style="font-size:22px;font-weight:bold;color:var(--accent);">${p.name}</div>
      <div style="font-size:11px;color:var(--text-dim);margin-top:2px;">
        ${genIcon} ${genderCN} · ${p.appearance} · ${p.bodyType}
        ${p.originEmoji} ${p.originName}
      </div>
      <div style="font-size:10px;color:var(--text-dim);">「${p.personality}」 · "${p.fortune}"</div>
      <div style="margin-top:6px;padding:6px 8px;background:rgba(0,0,0,0.2);border-radius:6px;font-size:11px;line-height:1.6;text-align:left;">
        <span style="color:var(--accent);">📖 身世：</span>${p.originDesc}
      </div>
    </div>

    <div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;margin-bottom:10px;font-size:12px;">
      <div style="background:rgba(255,255,255,0.05);padding:6px 8px;border-radius:4px;">
        <span style="color:var(--text-dim)">炼气</span><br>
        <span style="font-weight:bold;">${qiRealm}</span>
        <div style="height:3px;background:rgba(255,255,255,0.08);border-radius:2px;margin-top:3px;">
          <div style="height:100%;width:${getCultivationProgress('qi')}%;background:var(--accent);border-radius:2px;"></div>
        </div>
      </div>
      <div style="background:rgba(255,255,255,0.05);padding:6px 8px;border-radius:4px;">
        <span style="color:var(--text-dim)">炼体</span><br>
        <span style="font-weight:bold;">${bodyRealm}</span>
        <div style="height:3px;background:rgba(255,255,255,0.08);border-radius:2px;margin-top:3px;">
          <div style="height:100%;width:${getCultivationProgress('body')}%;background:#8a7a5a;border-radius:2px;"></div>
        </div>
      </div>
      <div style="background:rgba(255,255,255,0.05);padding:6px 8px;border-radius:4px;">
        <span style="color:var(--text-dim)">⏳ 寿元</span><br>
        <span style="font-weight:bold;font-size:12px;${p.age / p.maxAge > 0.8 ? 'color:#e74c3c;' : p.age / p.maxAge > 0.5 ? 'color:#ff9800;' : ''}">${Math.round(p.age)}岁 / ${Math.round(p.maxAge)}年</span>
        <div style="height:3px;background:rgba(255,255,255,0.08);border-radius:2px;margin-top:3px;">
          <div style="height:100%;width:${Math.round(p.age / p.maxAge * 100)}%;${p.age / p.maxAge > 0.8 ? 'background:#e74c3c;' : p.age / p.maxAge > 0.5 ? 'background:#ff9800;' : 'background:#6a9ec9;'}border-radius:2px;"></div>
        </div>
      </div>
      <div style="background:rgba(255,255,255,0.05);padding:6px 8px;border-radius:4px;">
        <span style="color:var(--text-dim)">灵根</span><br>
        <span style="font-weight:bold;font-size:11px;">${(p.spiritRoots||[]).map(r => {
          const rt = ROOT_TYPES[r] || {};
          return `<span style="color:${rt.color}">${rt.emoji || ''}${r}</span>`;
        }).join(' ')}</span>
      </div>
      <div style="background:rgba(255,255,255,0.05);padding:6px 8px;border-radius:4px;">
        <span style="color:var(--text-dim)">综合战力</span><br>
        <span style="font-weight:bold;color:var(--accent);font-size:14px;">${p.combatPower || 0}</span>
        <span style="font-size:9px;color:var(--text-dim);display:block;">${getCombatPowerRank(p.combatPower)}</span>
      </div>
    </div>

    <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:4px;margin-bottom:10px;">
      <div style="text-align:center;font-size:10px;">
        <span style="color:var(--text-dim);">☯️ 气运</span><br>
        <span style="font-weight:bold;">${p.luck}</span>
      </div>
      <div style="text-align:center;font-size:10px;">
        <span style="color:var(--text-dim);">🧠 悟性</span><br>
        <span style="font-weight:bold;">${p.wisdom}</span>
      </div>
      <div style="text-align:center;font-size:10px;">
        <span style="color:var(--text-dim);">🦴 根骨</span><br>
        <span style="font-weight:bold;">${p.bone}</span>
      </div>
    </div>

    <div style="display:grid;grid-template-columns:1fr 1fr;gap:4px;margin-bottom:10px;">
      <div style="text-align:center;font-size:10px;">
        <span style="color:var(--text-dim);">${getDaoHeartLevel().icon} 道心</span><br>
        <span style="font-weight:bold;color:${getDaoHeartLevel().color};">${p.daoHeart || 50}</span>
      </div>
      <div style="text-align:center;font-size:10px;">
        <span style="color:var(--text-dim);">📜 先贤</span><br>
        <span style="font-weight:bold;">${(p._metSages || []).length}/${SAGES.length}</span>
      </div>
    </div>

    <div style="border-bottom:1px solid rgba(255,255,255,0.08);margin-bottom:8px;padding-bottom:6px;">
      <div style="font-weight:bold;font-size:12px;margin-bottom:6px;">📊 战力来源</div>
      
      <div style="font-size:11px;margin-bottom:4px;">
        <span style="color:var(--text-dim)">气血　💖 ${p.hp}/${p.maxHp}</span>
        <span style="float:right;font-size:10px;color:var(--text-dim);">基础 ${breakData.base.hp||0}
          ${breakData.skillBreakdown.filter(s => s.effects.some(e => e.k==='hpBonus')).map(s => ' +' + s.name).join('')}</span>
      </div>
      <div style="font-size:11px;margin-bottom:4px;">
        <span style="color:var(--text-dim)">灵力　🔮 ${p.qi}/${p.maxQi}</span>
        <span style="float:right;font-size:10px;color:var(--text-dim);">基础 ${breakData.base.maxQi||0}
          ${breakData.skillBreakdown.filter(s => s.effects.some(e => e.k==='maxQiBonus')).map(s => ' +' + s.name).join('')}</span>
      </div>
      <div style="font-size:11px;margin-bottom:4px;">
        <span style="color:var(--text-dim)">攻击　⚔️ ${p.attack}</span>
        <span style="float:right;font-size:10px;color:var(--text-dim);">基础 ${breakData.base.attack||0}
          ${breakData.skillBreakdown.filter(s => s.effects.some(e => e.k==='attackBonus')).map(s => ' +' + s.name).join('')}</span>
      </div>
      <div style="font-size:11px;margin-bottom:4px;">
        <span style="color:var(--text-dim)">防御　🛡️ ${p.defense}</span>
        <span style="float:right;font-size:10px;color:var(--text-dim);">基础 ${breakData.base.defense||0}
          ${breakData.skillBreakdown.filter(s => s.effects.some(e => e.k==='defenseBonus')).map(s => ' +' + s.name).join('')}</span>
      </div>
      ${(p.critRate || p.dodge || p.damageReduce || p.reflectChance || p.hpRegen || p.qiRegen || p.alchemyBonus || p.pillBonus || p.wisdomBonus || p.exploreBonus || p._lifesteal || p._freeze || p._burn || p._stun) ? `
      <div style="font-size:11px;margin-bottom:4px;padding-top:3px;border-top:1px dashed rgba(255,255,255,0.06);">
        <span style="color:var(--text-dim)">✨ 特殊加成</span>
        <div style="margin-top:3px;display:flex;flex-wrap:wrap;gap:2px 8px;font-size:10px;color:var(--accent);">
          ${p.critRate ? `<span>暴击 +${(p.critRate*100).toFixed(0)}%</span>` : ''}
          ${p.dodge ? `<span>闪避 +${(p.dodge*100).toFixed(0)}%</span>` : ''}
          ${p.damageReduce ? `<span>减伤 ${(p.damageReduce*100).toFixed(0)}%</span>` : ''}
          ${p.reflectChance ? `<span>反弹 ${(p.reflectChance*100).toFixed(0)}%</span>` : ''}
          ${p._lifesteal ? `<span>吸血 ${(p._lifesteal*100).toFixed(0)}%</span>` : ''}
          ${p._freeze ? `<span>凝霜 ${(p._freeze*100).toFixed(0)}%</span>` : ''}
          ${p._burn ? `<span>焚心 ${(p._burn*100).toFixed(0)}%</span>` : ''}
          ${p._stun ? `<span>眩晕 ${(p._stun*100).toFixed(0)}%</span>` : ''}
          ${p.exploreBonus ? `<span>探索 +${(p.exploreBonus*100).toFixed(0)}%</span>` : ''}
          ${p.alchemyBonus ? `<span>炼丹 +${(p.alchemyBonus*100).toFixed(0)}%</span>` : ''}
          ${p.pillBonus ? `<span>丹效 +${(p.pillBonus*100).toFixed(0)}%</span>` : ''}
          ${p.wisdomBonus ? `<span>悟性 +${p.wisdomBonus}</span>` : ''}
          ${p.hpRegen ? `<span>血回/轮 +${p.hpRegen}</span>` : ''}
          ${p.qiRegen ? `<span>灵回/轮 +${p.qiRegen}</span>` : ''}
        </div>
      </div>` : ''}
    </div>`;

  // ── 功法详情（折叠式） ──
  if (breakData.skillBreakdown.length > 0) {
    html += `<div style="margin-bottom:8px;">
      <div style="font-weight:bold;font-size:12px;margin-bottom:6px;">🎯 装备功法</div>`;
    
    breakData.skillBreakdown.forEach(sk => {
      const slotIcons = { '吐纳法':'🧘','炼体术':'💪','攻伐术':'⚔️','护体诀':'🛡️','身法':'💨','疗伤法':'💚','秘术':'🔮','心法':'📿' };
      const icon = slotIcons[sk.type] || '📜';
      const elemMark = sk.element !== '无' ? `【${sk.element}】` : '';
      
      html += `<div style="background:rgba(255,255,255,0.03);border-radius:4px;padding:5px 6px;margin-bottom:3px;">
        <div style="display:flex;justify-content:space-between;align-items:center;font-size:11px;">
          <span>${icon} ${sk.name}${elemMark}</span>
          <span style="font-size:10px;color:var(--text-dim);">熟练Lv.${sk.masteryLevel} · ${sk.mult}×</span>
        </div>
        <div style="font-size:10px;color:var(--text-dim);display:flex;flex-wrap:wrap;gap:2px 6px;margin-top:2px;">
          ${sk.effects.filter(e => Math.abs(e.v) > 0).map(e => {
            const labels = { hpBonus:'气血+', attackBonus:'攻击+', defenseBonus:'防御+', maxQiBonus:'灵力+', 
              qiRegen:'灵回/轮', hpRegen:'血回/轮', dodge:'闪避+', critRate:'暴击+', cultivationSpeed:'修炼×',
              bodyCultSpeed:'炼体×', exploreBonus:'探索+', qiCost:'耗灵-', elementDamage:'火伤+' };
            return `<span>${labels[e.k] || e.k}${typeof e.v === 'number' ? Math.round(e.v*100)/100 : e.v}</span>`;
          }).join('')}
        </div>
      </div>`;
    });
    html += '</div>';
  }

  // ── 装备 ──
  const weaponName = p.equipment && p.equipment.weapon ? p.equipment.weapon.name : '无';
  const armorName = p.equipment && p.equipment.armor ? p.equipment.armor.name : '无';
  const headName = p.equipment && p.equipment.head ? p.equipment.head.name : '无';
  // 🔧 饰品多件：accessory 数组显示全部
  var accName = '无';
  if (p.equipment && p.equipment.accessory) {
    if (Array.isArray(p.equipment.accessory)) {
      accName = p.equipment.accessory.length ? p.equipment.accessory.map(function(a){ return a.name; }).join('、') : '无';
    } else {
      accName = p.equipment.accessory.name;
    }
  }
  const shoesName = p.equipment && p.equipment.shoes ? p.equipment.shoes.name : '无';
  html += `<div style="font-size:11px;margin-bottom:4px;">
    <span style="color:var(--text-dim);">🗡️ 兵器</span> ${weaponName}
  </div>`;
  html += `<div style="font-size:11px;margin-bottom:4px;">
    <span style="color:var(--text-dim);">🛡️ 衣甲</span> ${armorName}
  </div>`;
  html += `<div style="font-size:11px;margin-bottom:4px;">
    <span style="color:var(--text-dim);">👑 头冠</span> ${headName}
  </div>`;
  html += `<div style="font-size:11px;margin-bottom:4px;">
    <span style="color:var(--text-dim);">💍 饰品</span> ${accName}
  </div>`;
  html += `<div style="font-size:11px;margin-bottom:4px;">
    <span style="color:var(--text-dim);">👢 鞋履</span> ${shoesName}
  </div>`;

  // ── 🔮 本命法宝 ──
  if (p.benming && p.benming.unlocked && typeof getBenmingBonus === 'function') {
    const bm = p.benming;
    const bmBonus = getBenmingBonus();
    const bmType = typeof BENMING_TYPES !== 'undefined' ? BENMING_TYPES[bm.type] : null;
    const bmRank = typeof BENMING_RANKS !== 'undefined' ? BENMING_RANKS[bm.rankIndex] : null;
    html += `<div style="font-size:11px;margin:6px 0 4px 0;padding:6px 8px;border-radius:6px;background:rgba(156,39,176,0.08);border:1px solid rgba(156,39,176,0.25);">
      <div style="color:#e1a0ff;font-weight:bold;font-size:11px;">🔮 本命法宝 · ${bm.name}${bmType ? '（' + bmType.name + '）' : ''}</div>
      <div style="font-size:10px;color:var(--text-dim);margin-top:2px;">${bmRank ? '<span style="color:' + bmRank.color + ';">【' + bmRank.name + '】</span>' : ''} Lv.${bm.level}${bmBonus ? ' · ⚔️攻+' + (bmBonus.attack||0) + ' 🛡️防+' + (bmBonus.defense||0) + ' 💚血+' + (bmBonus.maxHp||0) + ' 💧灵+' + (bmBonus.maxQi||0) : ''}</div>
    </div>`;
  } else if (typeof openBenmingPanel === 'function' && p.qiRealmIndex >= 12) {
    html += `<div style="font-size:11px;margin:6px 0 4px 0;padding:6px 8px;border-radius:6px;background:rgba(0,0,0,0.15);">
      <span style="color:var(--text-dim);">🔮 本命法宝</span> <span style="color:#ff9800;font-size:10px;">（金丹修士的立身之本——可在场景中祭炼）</span>
    </div>`;
  }

  // ── 天赋 ──
  html += `<div style="font-size:10px;color:var(--text-dim);margin-bottom:4px;">
    天赋「${p.talentLabel}」 · 修炼速度 ×${(p.talent || 1).toFixed(2)}
    ${p.exploreBonus ? ` · 探索效率 +${Math.round(p.exploreBonus * 100)}%` : ''}
    ${p.combatBonus ? ` · 战斗加成 +${Math.round(p.combatBonus * 100)}%` : ''}
    ${p.tradeDiscount ? ` · 交易折扣 -${Math.round(p.tradeDiscount * 100)}%` : ''}
  </div>`;

  // ── 人生履历（lifeChronicle）──
  const chronicle = G.lifeChronicle || [];
  if (chronicle.length > 0) {
    html += `<div style="border-top:1px solid rgba(255,255,255,0.08);margin-top:8px;padding-top:6px;">
      <div style="font-weight:bold;font-size:11px;margin-bottom:4px;">📜 人生大事记</div>`;
    const recent = chronicle.slice(-6);
    recent.forEach(entry => {
      const dateStr = entry.day ? `第${entry.day}日` : '';
      html += `<div style="font-size:10px;color:var(--text-dim);line-height:1.5;">
        ${dateStr ? `<span style="color:var(--accent);">${dateStr}</span> ` : ''}${entry.text || entry}
      </div>`;
    });
    if (chronicle.length > 6) {
      html += `<div style="font-size:9px;color:var(--text-dim);margin-top:2px;">……共${chronicle.length}件</div>`;
    }
    html += '</div>';
  } else {
    // 用成就代替
    const achs = p.achievements || [];
    if (achs.length > 0) {
      html += `<div style="border-top:1px solid rgba(255,255,255,0.08);margin-top:8px;padding-top:6px;">
        <div style="font-weight:bold;font-size:11px;margin-bottom:4px;">🏆 成就</div>`;
      achs.slice(-5).forEach(a => {
        html += `<div style="font-size:10px;color:var(--text-dim);">✦ ${a}</div>`;
      });
      html += '</div>';
    }
  }

  showCustomModal('👤 ' + p.name + ' · 人物传记', html);
}

// ==========================
// 功法场景描写（动作叙事）
// ==========================
function getSkillActionDescription(type, skillId, p) {
  p = p || G.player;
  const slotMap = { 'cultivate':'tuna','body':'lianti','combat':'gongfa','defend':'huti','dodge':'shenfa','heal':'liaoshang','secret':'mishu','mind':'xinfa' };
  const sk = p.skills.find(s => s.id === (p.skillSlots ? p.skillSlots[slotMap[type] || 'tuna'] : null)) || (skillId ? p.skills.find(s => s.id === skillId) : null);
  if (!sk) return null;

  const skDb = (G.skillData || typeof SKILL_DB !== 'undefined' ? SKILL_DB : []);
  const sd = skDb.find(d => d.id === sk.id);
  const element = sd ? sd.element : '无';
  const ml = sk.masteryLevel || 0;
  const quality = sk.quality || '凡级';
  const qualityDesc = { '凡级':'朴素','灵级':'莹润','地级':'浑厚','天级':'璀璨','圣级':'浩瀚','神级':'夺天地造化' }[quality] || '古朴';

  const elementDescs = {
    '金': ['周围的金灵气化作细密的金色光点，如星尘般流转。', '金属性灵气凝成一道道锋芒，凌厉之气扑面而来。'],
    '木': ['翠绿色的木灵气如藤蔓般缠绕周身，生机盎然。', '草木之灵随风舞动，清新的生命气息弥漫空气中。'],
    '水': ['水蓝色的灵气如烟似雾，在你周身形成一圈柔和的光晕。', '空气中水汽氤氲，仿佛有溪流在经脉中潺潺流淌。'],
    '火': ['赤红色的火灵气在体表跳跃，如熔岩般炽热。', '火光一闪，空气中的温度骤然升高，热浪扑面而来。'],
    '土': ['土黄色的灵气沉凝厚重，脚下的地面似乎都在微微震颤。', '大地之灵从脚底涌入，身体如山岳般稳固。'],
    '无': ['无属性的灵气纯净如水，在经脉中平稳流转。', '天地灵气汇聚而来，无形无相，却无处不在。'],
  };
  const masteryDescs = ['','','','','力道愈发圆融，举手投足间已有大家风范。','功法运转间隐有风雷之音。','每一次运功，骨骼中都会传出清脆玉音。','周身灵气凝而不散，已臻大成之象。','功法之力已与你融为一体，收发由心。','圆满！这门功法的精髓已经完全融入你的道中。'];

  const elementVariant = elementDescs[element] || ['灵气凝聚，如丝如缕。','一股暖流在经脉中蔓延开来。'];

  switch(type) {
    case 'cultivate':
      return `你运转${sk.name}，一道${qualityDesc}的${element !== '无' ? element+'行' : ''}灵力自丹田升起。${elementVariant[0]}${masteryDescs[ml] || ''}`;
    case 'body':
      return `${sk.name}催动之下，骨骼发出轻微的噼啪声响。${elementVariant[1]}${ml >= 5 ? '肌肉线条变得更加凝实，蕴含着爆炸般的力量。' : '每一寸肌肤都在吞吐着天地灵气。'}`;
    case 'combat': {
      const cV = { '金':['一道金色剑气破空而出！','金属性灵气化作万千细针！'], '木':['翠绿藤蔓破土而出！','草木之灵化为漫天叶刃！'], '水':['水蓝色波纹如潮水涌向对手！','灵力化作冰晶长矛！'], '火':['一道火龙冲天而起！','烈焰如莲花绽放！'], '土':['土石巨柱破地而出！','山岳虚影碾压而下！'], '无':['无形剑气无声无息却致命！','天地灵气汇聚成耀眼的光球！'] };
      const c = cV[element] || ['凌厉出手！'];
      return `你运转${sk.name}，${c[Math.floor(Math.random() * c.length)]}${ml >= 8 ? '这一击已臻化境，天地为之变色。' : ml >= 5 ? '功法运转如意，收发由心。' : ''}`;
    }
    case 'defend':
      return `你以${sk.name}护住周身，${elementVariant[0]}${ml >= 7 ? '护体真气凝若实质，坚不可摧。' : ''}`;
    case 'dodge': {
      const dOddge = ['身形如烟，在攻击间隙中穿梭而过。','足尖轻点，身如鬼魅般飘然后退。','步伐玄妙，每一次移动都恰到好处地避开了锋芒。'];
      return `你施展${sk.name}，${dOddge[Math.floor(Math.random() * dOddge.length)]}${ml >= 6 ? '身法之妙，仿佛与天地融为一体。' : ''}`;
    }
    case 'heal':
      return `${sk.name}运转，${elementVariant[1]}${ml >= 5 ? '伤势以肉眼可见的速度愈合着。' : '体内传来暖暖的舒适感。'}`;
    default:
      return `你施用${sk.name}，${elementVariant[0]}`;
  }
}

function renderSkillNarrative(type, skillId) {
  const text = getSkillActionDescription(type, skillId, G.player);
  if (text) addNarrative(text, 'default');
  return text;
}

window.showCharacterPanel = showCharacterPanel;
window.getSkillActionDescription = getSkillActionDescription;
window.renderSkillNarrative = renderSkillNarrative;
