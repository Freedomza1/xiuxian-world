// === 唯我独仙 · Combat System v3 ===
// 新增：精英/BOSS/随机遭遇

// ==========================
// 🏆 场景专属功法掉落表（越深层的场景掉越好功法）
// ==========================
const SCENE_SKILL_DROPS = {
  'luoxia_forest': { skills:[{id:'splitting_fist',chance:0.08},{id:'swift_step',chance:0.05},{id:'yunjue',chance:0.04}], },
  'heifeng_ridge': { skills:[{id:'tiequan',chance:0.1},{id:'golden_bell',chance:0.06},{id:'tuqi',chance:0.04}], },
  'bibo_lake': { skills:[{id:'basic_heal',chance:0.1},{id:'healing_breath',chance:0.06},{id:'shuixin',chance:0.04}], },
  'lingyun_peak': { skills:[{id:'yunjue',chance:0.1},{id:'tuqi',chance:0.06},{id:'jinqi',chance:0.04},{id:'swift_step',chance:0.03}], },
  'lingyao_garden': { skills:[{id:'healing_breath',chance:0.08},{id:'muye',chance:0.05},{id:'shuixin',chance:0.03}], },
  'youming_grotto': { skills:[{id:'fallen_leaf',chance:0.06},{id:'shiti',chance:0.05},{id:'jinqi',chance:0.03}], },
  'underground_river': { skills:[{id:'shuixin',chance:0.06},{id:'jinjue',chance:0.05},{id:'shuixin',chance:0.03}], },
  'duzhang_swamp': { skills:[{id:'shiti',chance:0.06},{id:'huoyan_breath',chance:0.04},{id:'green_mist',chance:0.04}], },
  'guji_ruins': { skills:[{id:'sanmei',chance:0.05},{id:'houtu',chance:0.04},{id:'houtu',chance:0.03},{id:'wuji_gong',chance:0.02}], },
  'bingfeng_grotto': { skills:[{id:'mist_step',chance:0.05},{id:'jinjue',chance:0.04},{id:'jinjue',chance:0.03},{id:'taiyi_jue',chance:0.02}], },
  'leiyin_temple': { skills:[{id:'sanmei',chance:0.05},{id:'sanmei',chance:0.04},{id:'wuji_gong',chance:0.03},{id:'wuji_gong',chance:0.02}], },
  'xuantie_mine': { skills:[{id:'jinjue',chance:0.06},{id:'shiti',chance:0.04},{id:'jinjue',chance:0.03}], },
  'yumu_forest': { skills:[{id:'muye',chance:0.06},{id:'green_mist',chance:0.05},{id:'jinjue',chance:0.03}], },
  'biguan_peak': { skills:[{id:'tuqi',chance:0.08},{id:'huoyan_breath',chance:0.05},{id:'houtu',chance:0.03}], },
  'yy_baihu_hill': { skills:[{id:'wuji_gong',chance:0.04},{id:'sanmei',chance:0.03},{id:'taiyi_jue',chance:0.02},{id:'chilong_body',chance:0.02}], },
  'yy_huangquan_road': { skills:[{id:'yunjue',chance:0.04},{id:'qinglian',chance:0.03},{id:'huoyan',chance:0.02}], },
  'lieyan_valley': { skills:[{id:'huoyan_breath',chance:0.08},{id:'huoyan',chance:0.05},{id:'sanmei',chance:0.02},{id:'chilong_body',chance:0.01}], },
  // ── 新场景 ──
  'qingyun_pier': { skills:[{id:'basic_heal',chance:0.08},{id:'yunjue',chance:0.05},{id:'shuixin',chance:0.03}], },
  'luori_plain': { skills:[{id:'splitting_fist',chance:0.08},{id:'shiti',chance:0.04},{id:'tuqi',chance:0.03}], },
  'bamboo_grove': { skills:[{id:'healing_breath',chance:0.08},{id:'swift_step',chance:0.04},{id:'muye',chance:0.03}], },
  'moon_valley': { skills:[{id:'yunjue',chance:0.06},{id:'shuixin',chance:0.04},{id:'qinglian',chance:0.02}], },
  'stone_road': { skills:[{id:'tiequan',chance:0.06},{id:'golden_bell',chance:0.04},{id:'jinqi',chance:0.03}], },
};

// ── 🌀⚗️☯️🔮 新类型功法掉落池（心法/秘术/阵道/丹道）──
// 按场景深度递进，低阶场景掉基础型，高阶场景掉稀有型
const SCENE_SPECIAL_SKILL_DROPS = {
  // 前期场景：阵道入门 + 丹道入门
  'qingyun_pier': { skills:[{id:'juling_zhen',chance:0.06},{id:'lianqiu_shu',chance:0.06}] },
  'luori_plain': { skills:[{id:'jingxin_jue',chance:0.05},{id:'lianqiu_shu',chance:0.05}] },
  'bamboo_grove': { skills:[{id:'baicao_danjue',chance:0.05},{id:'juling_zhen',chance:0.04}] },
  'stone_road': { skills:[{id:'bajing_tu',chance:0.04},{id:'lianqiu_shu',chance:0.05}] },
  'moon_valley': { skills:[{id:'jingxin_jue',chance:0.05},{id:'baicao_danjue',chance:0.04}] },
  // 中期场景：阵道/丹道进阶
  'lingyun_peak': { skills:[{id:'zhoutian_zhen',chance:0.04},{id:'jiuzhuan_danjue',chance:0.035}] },
  'lingyao_garden': { skills:[{id:'baicao_danjue',chance:0.06},{id:'jiuzhuan_danjue',chance:0.03}] },
  'youming_grotto': { skills:[{id:'bajing_tu',chance:0.04},{id:'yujian_shu',chance:0.03}] },
  'underground_river': { skills:[{id:'zhoutian_zhen',chance:0.035},{id:'yujian_shu',chance:0.03}] },
  'duzhang_swamp': { skills:[{id:'jiuzhuan_danjue',chance:0.03},{id:'bajing_tu',chance:0.035}] },
  'xuantie_mine': { skills:[{id:'jiuzhuan_danjue',chance:0.03},{id:'zifu_xinjing',chance:0.02}] },
  'yumu_forest': { skills:[{id:'shennong_dandian',chance:0.02},{id:'baicao_danjue',chance:0.04}] },
  'biguan_peak': { skills:[{id:'jingxin_jue',chance:0.04},{id:'bajing_tu',chance:0.03}] },
  // 后期场景：天/圣级稀有
  'guji_ruins': { skills:[{id:'zhuxian_zhen',chance:0.02},{id:'taiqing_danjing',chance:0.02},{id:'dayan_xinjing',chance:0.015}] },
  'bingfeng_grotto': { skills:[{id:'suodi_chengcun',chance:0.025},{id:'zifu_xinjing',chance:0.02},{id:'taiqing_danjing',chance:0.02}] },
  'leiyin_temple': { skills:[{id:'tiangang_sanshiliu',chance:0.015},{id:'zhuxian_zhen',chance:0.015},{id:'dayan_xinjing',chance:0.015}] },
  'yy_baihu_hill': { skills:[{id:'tiangang_sanshiliu',chance:0.02},{id:'zhuxian_zhen',chance:0.02},{id:'taiqing_danjing',chance:0.02}] },
  'yy_huangquan_road': { skills:[{id:'tiangang_sanshiliu',chance:0.02},{id:'shennong_dandian',chance:0.02},{id:'dayan_xinjing',chance:0.02}] },
  'lieyan_valley': { skills:[{id:'zhuxian_zhen',chance:0.02},{id:'tiangang_sanshiliu',chance:0.02},{id:'taiqing_danjing',chance:0.02}] },
};

const MONSTER_DATA = {
  '野狼': { hp: 40, attack: 8, defense: 4, qi: 10, drops: [{ itemId: 'shougu', chance: 0.5, qty: 2 }, { itemId: 'hgc_grass', chance: 0.3 }] },
  '青木蛇': { hp: 35, attack: 10, defense: 3, qi: 12, drops: [{ itemId: 'shepi', chance: 0.4 }, { itemId: 'hgc_grass', chance: 0.25 }] },
  '铁皮野猪': { hp: 60, attack: 12, defense: 8, qi: 15, drops: [{ itemId: 'shoupi', chance: 0.6 }, { itemId: 'hgc_grass', chance: 0.35, qty: 2 }] },
  '幽魂': { hp: 30, attack: 14, defense: 2, qi: 8, drops: [{ itemId: 'lingzu_cuijian', chance: 0.5 }] },
  '骷髅兵': { hp: 45, attack: 11, defense: 6, qi: 10, drops: [{ itemId: 'gufen', chance: 0.5 }, { itemId: 'hgc_grass', chance: 0.2 }] },
  '阴煞蛛': { hp: 50, attack: 13, defense: 7, qi: 14, drops: [{ itemId: 'zhusi', chance: 0.5 }, { itemId: 'dunang', chance: 0.3 }] },
  '黑风山贼': { hp: 55, attack: 15, defense: 5, qi: 10, drops: [{ itemId: 'cuzhi_bingqi', chance: 0.3 }] },
  '山贼头目': { hp: 80, attack: 18, defense: 8, qi: 15, drops: [{ itemId: 'tiexiu_jian', chance: 0.4 }] },
  '石傀儡': { hp: 100, attack: 16, defense: 14, qi: 20, drops: [{ itemId: 'xixin', chance: 0.3 }, { itemId: 'duanti_dan', chance: 0.1 }] },
  '怨灵': { hp: 40, attack: 18, defense: 3, qi: 12, drops: [{ itemId: 'yuangi_jiejing', chance: 0.4 }] },
  '地下巨蜥': { hp: 70, attack: 14, defense: 10, qi: 16, drops: [{ itemId: 'xixi_linpian', chance: 0.5 }] },
  '吸血蝙蝠': { hp: 25, attack: 12, defense: 2, qi: 8, drops: [{ itemId: 'bianfu_yimo', chance: 0.3 }] },
  // 新增怪物
  '毒鳞蛇': { hp: 50, attack: 14, defense: 5, qi: 12, drops: [{ itemId: 'shepi', chance: 0.5 }, { itemId: 'dunang', chance: 0.4 }] },
  '沼泽巨蛙': { hp: 70, attack: 12, defense: 8, qi: 15, drops: [{ itemId: 'shoupi', chance: 0.4 }, { itemId: 'hgc_grass', chance: 0.3 }] },
  '毒蚊群': { hp: 20, attack: 16, defense: 1, qi: 8, drops: [{ itemId: 'dunang', chance: 0.3 }] },
  '石像守卫': { hp: 90, attack: 18, defense: 12, qi: 20, drops: [{ itemId: 'xixin', chance: 0.25 }, { itemId: 'lingzu_cuijian', chance: 0.3 }] },
  '上古傀儡': { hp: 120, attack: 20, defense: 16, qi: 25, drops: [{ itemId: 'xixin', chance: 0.4 }, { itemId: 'lingzu_cuijian', chance: 0.2 }] },
  '残魂': { hp: 35, attack: 20, defense: 2, qi: 10, drops: [{ itemId: 'yuangi_jiejing', chance: 0.5 }, { itemId: 'lingzu_cuijian', chance: 0.3 }] },
  '冰晶蝎': { hp: 55, attack: 16, defense: 6, qi: 14, drops: [{ itemId: 'lingzu_cuijian', chance: 0.4 }, { itemId: 'xixi_linpian', chance: 0.2 }] },
  '雪狼': { hp: 65, attack: 14, defense: 8, qi: 16, drops: [{ itemId: 'shoupi', chance: 0.4 }, { itemId: 'shougu', chance: 0.3 }] },
  '冰霜巨人': { hp: 150, attack: 22, defense: 14, qi: 30, drops: [{ itemId: 'xixin', chance: 0.3 }, { itemId: 'lingzu_cuijian', chance: 0.3 }] },
  '阴灵守卫': { hp: 120, attack: 22, defense: 12, qi: 25, drops: [{ itemId: 'lingzu_cuijian', chance: 0.6 }, { itemId: 'yuangi_jiejing', chance: 0.4 }] },
  '冥府阴兵': { hp: 50, attack: 16, defense: 6, qi: 15, drops: [{ itemId: 'yuangi_jiejing', chance: 0.3 }, { itemId: 'lingquan_shui', chance: 0.2 }] },
  // ── 凡尘界新场景怪物 ──
  '草狼': { hp: 35, attack: 9, defense: 3, qi: 10, drops: [{ itemId: 'shougu', chance: 0.4 }, { itemId: 'shoupi', chance: 0.2 }] },
  '荒原巨蜥': { hp: 65, attack: 14, defense: 7, qi: 15, drops: [{ itemId: 'shepi', chance: 0.5 }, { itemId: 'shougu', chance: 0.3 }] },
  '沙鹫': { hp: 30, attack: 11, defense: 2, qi: 8, drops: [{ itemId: 'shoupi', chance: 0.3 }, { itemId: 'hgc_grass', chance: 0.2 }] },
  '翠竹蛇': { hp: 30, attack: 8, defense: 2, qi: 8, drops: [{ itemId: 'shepi', chance: 0.3 }, { itemId: 'hgc_grass', chance: 0.2 }] },
  '竹鼠群': { hp: 20, attack: 5, defense: 1, qi: 5, drops: [{ itemId: 'shougu', chance: 0.3 }] },
  '白额猴': { hp: 40, attack: 10, defense: 3, qi: 10, drops: [{ itemId: 'hgc_grass', chance: 0.3 }, { itemId: 'shougu', chance: 0.2 }] },
  '古道劫匪': { hp: 50, attack: 14, defense: 5, qi: 10, drops: [{ itemId: 'cuzhi_bingqi', chance: 0.3 }, { itemId: 'posun_lingshi', chance: 0.4 }] },
  '破旧石像': { hp: 70, attack: 12, defense: 10, qi: 15, drops: [{ itemId: 'lingzu_cuijian', chance: 0.3 }, { itemId: 'xixin', chance: 0.1 }] },
  // ── 烈焰谷 ──
  '岩浆蜥蜴': { hp: 85, attack: 20, defense: 14, qi: 20, drops: [{ itemId: 'shepi', chance: 0.5 }, { itemId: 'huoyuan_shi', chance: 0.3 }] },
  '火焰鸟': { hp: 60, attack: 22, defense: 8, qi: 25, drops: [{ itemId: 'bianfu_yimo', chance: 0.4 }, { itemId: 'huoyuan_shi', chance: 0.4 }] },
  '火灵精': { hp: 50, attack: 18, defense: 6, qi: 30, drops: [{ itemId: 'huoyuan_shi', chance: 0.6 }, { itemId: 'xuelian', chance: 0.1 }] },
  // ── 新补怪物 ──
  '岩石巨兽': { hp: 160, attack: 24, defense: 20, qi: 30, drops: [{ itemId: 'xixin', chance: 0.4 }, { itemId: 'lingzu_cuijian', chance: 0.3 }, { itemId: 'tuyuan_po', chance: 0.05 }, { itemId: 'duanti_dan', chance: 0.15 }] },
  '铁甲蜥蜴': { hp: 100, attack: 20, defense: 18, qi: 25, drops: [{ itemId: 'xixi_linpian', chance: 0.6 }, { itemId: 'shoupi', chance: 0.4 }, { itemId: 'jinyuan_jing', chance: 0.05 }, { itemId: 'duanti_dan', chance: 0.12 }] },
  '玉木精': { hp: 140, attack: 22, defense: 16, qi: 35, drops: [{ itemId: 'lingmu', chance: 0.7 }, { itemId: 'shougu', chance: 0.3 }, { itemId: 'muyuan_sui', chance: 0.08 }] },
  '树妖': { hp: 120, attack: 18, defense: 14, qi: 30, drops: [{ itemId: 'lingmu', chance: 0.5 }, { itemId: 'hgc_grass', chance: 0.4 }, { itemId: 'yumu_hua', chance: 0.04 }] },
  '碧波水蚺': { hp: 80, attack: 16, defense: 10, qi: 20, drops: [{ itemId: 'shepi', chance: 0.5 }, { itemId: 'shuixin_zhu', chance: 0.03 }] },
  '迷雾幻蝶': { hp: 30, attack: 20, defense: 4, qi: 25, drops: [{ itemId: 'bianfu_yimo', chance: 0.4 }, { itemId: 'lingquan_shui', chance: 0.3 }] },

  // ── 筑基期（中州域）妖兽 ──
  '青鳞蛟': { hp: 200, attack: 34, defense: 20, qi: 45, drops: [{ itemId: 'qinglin_jiao', chance: 0.6 }, { itemId: 'yaodan_he', chance: 0.35 }, { itemId: 'shoupi', chance: 0.4 }] },
  '赤目妖狼': { hp: 140, attack: 30, defense: 16, qi: 40, drops: [{ itemId: 'shoupi', chance: 0.7 }, { itemId: 'yaodan_he', chance: 0.3 }, { itemId: 'shougu', chance: 0.5 }] },
  '紫电貂': { hp: 90, attack: 32, defense: 10, qi: 35, drops: [{ itemId: 'zidian_diao', chance: 0.5 }, { itemId: 'lingmai_jing', chance: 0.3 }, { itemId: 'yaodan_he', chance: 0.25 }] },
  '灵脉石灵': { hp: 180, attack: 28, defense: 26, qi: 42, drops: [{ itemId: 'lingmai_jing', chance: 0.8 }, { itemId: 'zhushen_sui', chance: 0.2 }, { itemId: 'tongpi_dan', chance: 0.08 }] },
  '荒寂殿卫': { hp: 220, attack: 36, defense: 22, qi: 50, drops: [{ itemId: 'huangji_gu', chance: 0.5 }, { itemId: 'yaodan_he', chance: 0.4 }, { itemId: 'tiegu_dan', chance: 0.08 }] },

  // ── 金丹期（天域）妖兽 ──
  '雷池蛟龙': { hp: 320, attack: 48, defense: 30, qi: 70, monsterElement:'雷', drops: [{ itemId: 'leichi_jingtie', chance: 0.7 }, { itemId: 'leijiao_long', chance: 0.25 }, { itemId: 'xuelian', chance: 0.3 }, { itemId: 'yinxiue_dan', chance: 0.06 }] },
  '紫霄雷鸟': { hp: 220, attack: 44, defense: 24, qi: 65, monsterElement:'雷', drops: [{ itemId: 'leichi_jingtie', chance: 0.5 }, { itemId: 'bianfu_yimo', chance: 0.6 }, { itemId: 'leijiao_long', chance: 0.15 }] },
  '云海龙鲸': { hp: 420, attack: 42, defense: 36, qi: 80, monsterElement:'水', drops: [{ itemId: 'yunhai_longjing', chance: 0.6 }, { itemId: 'yunhai_lu', chance: 0.5 }, { itemId: 'leijiao_long', chance: 0.2 }, { itemId: 'yinxiue_dan', chance: 0.07 }] },
  '天道峰守灵': { hp: 360, attack: 50, defense: 28, qi: 75, monsterElement:'雷', drops: [{ itemId: 'tiandao_bei', chance: 0.4 }, { itemId: 'jiuyang_ling', chance: 0.3 }, { itemId: 'leichi_jingtie', chance: 0.4 }, { itemId: 'jinshen_dan', chance: 0.05 }] },
};

// ==========================
// 精英怪物模板（稀有强化版）
// ==========================
const ELITE_TEMPLATES = [
  { name:'精英野狼', base:'野狼', hpMult:1.8, atkMult:1.5, defMult:1.3, drops:[{itemId:'shougu',chance:0.8,qty:4},{itemId:'zhixue_san',chance:0.3}], skillScroll:'splitting_fist', skillChance:0.08 },
  { name:'精英幽魂', base:'幽魂', hpMult:2.0, atkMult:1.6, defMult:1.2, drops:[{itemId:'lingzu_cuijian',chance:0.8,qty:2},{itemId:'huiqi_dan',chance:0.3}], skillScroll:'yunjue', skillChance:0.08 },
  { name:'精英石傀儡', base:'石傀儡', hpMult:1.8, atkMult:1.4, defMult:1.5, drops:[{itemId:'xixin',chance:0.6},{itemId:'lianqi_xinde',chance:0.2},{itemId:'duanti_dan',chance:0.3}], skillScroll:'tuqi', skillChance:0.08 },
  { name:'精英冰晶蝎', base:'冰晶蝎', hpMult:1.8, atkMult:1.5, defMult:1.3, drops:[{itemId:'lingzu_cuijian',chance:0.6},{itemId:'juli_dan',chance:0.15}], skillScroll:'jinjue', skillChance:0.08 },
  { name:'毒沼巨鳄', base:'沼泽巨蛙', hpMult:2.2, atkMult:1.6, defMult:1.4, drops:[{itemId:'dunang',chance:0.7,qty:3},{itemId:'baihe_lily',chance:0.2}], skillScroll:'shiti', skillChance:0.1 },
  { name:'古械守卫', base:'上古傀儡', hpMult:2.0, atkMult:1.5, defMult:1.5, drops:[{itemId:'xixin',chance:0.7},{itemId:'qingfeng_jian',chance:0.1}], skillScroll:'houtu', skillChance:0.1 },
  // ── 新精英 ──
  { name:'精英岩石巨兽', base:'岩石巨兽', hpMult:2.0, atkMult:1.6, defMult:1.6, drops:[{itemId:'xixin',chance:0.8,qty:2},{itemId:'baihe_lily',chance:0.3},{itemId:'duanti_dan',chance:0.3}], skillScroll:'tuqi', skillChance:0.1 },
  { name:'精英铁甲蜥蜴', base:'铁甲蜥蜴', hpMult:1.8, atkMult:1.5, defMult:1.5, drops:[{itemId:'xixi_linpian',chance:0.8,qty:3},{itemId:'huiqi_dan',chance:0.3},{itemId:'duanti_dan',chance:0.35}], skillScroll:'jinjue', skillChance:0.08 },
  { name:'玉木精·木灵', base:'玉木精', hpMult:2.2, atkMult:1.5, defMult:1.4, drops:[{itemId:'lingmu',chance:0.9,qty:3},{itemId:'juli_dan',chance:0.2}], skillScroll:'muye', skillChance:0.1 },
  { name:'妖化古树', base:'树妖', hpMult:2.0, atkMult:1.4, defMult:1.6, drops:[{itemId:'lingmu',chance:0.7,qty:3},{itemId:'xuelian',chance:0.25}], skillScroll:'healing_breath', skillChance:0.08 },
  { name:'精英碧波水蚺', base:'碧波水蚺', hpMult:1.8, atkMult:1.6, defMult:1.3, drops:[{itemId:'shepi',chance:0.7,qty:2},{itemId:'lingquan_shui',chance:0.4}], skillScroll:'shuixin', skillChance:0.08 },
  { name:'精英迷雾幻蝶', base:'迷雾幻蝶', hpMult:1.6, atkMult:1.8, defMult:1.1, drops:[{itemId:'bianfu_yimo',chance:0.6},{itemId:'huiqi_dan',chance:0.3}], skillScroll:'mist_step', skillChance:0.08 },
  { name:'煞气骷髅', base:'骷髅兵', hpMult:2.0, atkMult:1.6, defMult:1.5, drops:[{itemId:'gufen',chance:0.8,qty:4},{itemId:'huiqi_dan',chance:0.2}], skillScroll:'jinqi', skillChance:0.08 },
  { name:'霸主山贼', base:'黑风山贼', hpMult:2.0, atkMult:1.5, defMult:1.2, drops:[{itemId:'posun_lingshi',chance:0.6,qty:3},{itemId:'cuzhi_bingqi',chance:0.3},{itemId:'lianqi_xinde',chance:0.15}], skillScroll:'splitting_fist', skillChance:0.08 },
  { name:'精英残魂', base:'残魂', hpMult:1.8, atkMult:1.7, defMult:1.2, drops:[{itemId:'yuangi_jiejing',chance:0.8,qty:3},{itemId:'xuelian',chance:0.2}], skillScroll:'yunjue', skillChance:0.08 },

  // ── 筑基期精英 ──
  { name:'青鳞蛟·头领', base:'青鳞蛟', hpMult:2.0, atkMult:1.6, defMult:1.4, drops:[{itemId:'qinglin_jiao',chance:0.9,qty:3},{itemId:'yaodan_he',chance:0.5},{itemId:'zhushen_sui',chance:0.2}], skillScroll:'shuiyue_jing', skillChance:0.1 },
  { name:'赤目妖狼王', base:'赤目妖狼', hpMult:1.9, atkMult:1.7, defMult:1.3, drops:[{itemId:'shoupi',chance:0.9,qty:3},{itemId:'yaodan_he',chance:0.5}], skillScroll:'splitting_fist', skillChance:0.1 },
  { name:'灵脉石灵·精英', base:'灵脉石灵', hpMult:2.0, atkMult:1.4, defMult:1.7, drops:[{itemId:'lingmai_jing',chance:1.0,qty:4},{itemId:'zhushen_sui',chance:0.4},{itemId:'tongpi_dan',chance:0.35},{itemId:'tiegu_dan',chance:0.15}], skillScroll:'juling_zhen', skillChance:0.1 },
  { name:'荒寂殿卫·统领', base:'荒寂殿卫', hpMult:2.0, atkMult:1.6, defMult:1.5, drops:[{itemId:'huangji_gu',chance:0.9,qty:3},{itemId:'jindan_dan',chance:0.12}], skillScroll:'hundun_jue', skillChance:0.1 },

  // ── 金丹期精英 ──
  { name:'雷池蛟龙·雷冠', base:'雷池蛟龙', hpMult:2.0, atkMult:1.7, defMult:1.5, drops:[{itemId:'leichi_jingtie',chance:1.0,qty:3},{itemId:'leijiao_long',chance:0.5},{itemId:'yunhai_lu',chance:0.3},{itemId:'yinxiue_dan',chance:0.35},{itemId:'jinshen_dan',chance:0.12}], skillScroll:'tianlei_yin', skillChance:0.1 },
  { name:'紫霄雷鸟·王', base:'紫霄雷鸟', hpMult:1.8, atkMult:1.8, defMult:1.3, drops:[{itemId:'leichi_jingtie',chance:0.8,qty:2},{itemId:'leijiao_long',chance:0.4}], skillScroll:'jinjue', skillChance:0.1 },
  { name:'云海龙鲸·幼鲸', base:'云海龙鲸', hpMult:1.9, atkMult:1.5, defMult:1.6, drops:[{itemId:'yunhai_longjing',chance:0.9,qty:3},{itemId:'yunhai_lu',chance:0.6},{itemId:'yinxiue_dan',chance:0.35},{itemId:'jinshen_dan',chance:0.12}], skillScroll:'shuiyue_jing', skillChance:0.1 },
  { name:'天道峰守灵·尊使', base:'天道峰守灵', hpMult:2.0, atkMult:1.6, defMult:1.5, drops:[{itemId:'tiandao_bei',chance:0.7},{itemId:'jiuyang_ling',chance:0.5},{itemId:'jinshen_dan',chance:0.2},{itemId:'yusui_dan',chance:0.08}], skillScroll:'tianlei_yin', skillChance:0.1 },
];

// ==========================
// 场景BOSS库
// ==========================
const BOSS_MONSTERS = {
  'luoxia_forest': { name:'林间虎王', hp:250, attack:28, defense:20, qi:40, 
    drops:[{itemId:'baihe_lily',chance:1.0,qty:2},{itemId:'shoupi',chance:1.0,qty:3},{itemId:'podi_dan',chance:0.5},{itemId:'xixin',chance:0.3},{itemId:'zhuji_dan',chance:0.05},{itemId:'duanti_dan',chance:0.4},{skillScroll:'splitting_fist',chance:0.3},{skillScroll:'swift_step',chance:0.15}] },
  'youming_grotto': { name:'冥洞尸王', hp:300, attack:32, defense:18, qi:35,
    drops:[{itemId:'poqi_dan',chance:0.7},{itemId:'lingzu_cuijian',chance:1.0,qty:5},{itemId:'xuelian',chance:0.4},{itemId:'duanti_dan',chance:0.5},{skillScroll:'shiti',chance:0.3},{skillScroll:'jinqi',chance:0.15}] },
  'leiyin_temple': { name:'雷音古佛残魂', hp:400, attack:35, defense:22, qi:50,
    drops:[{itemId:'podi_dan',chance:1.0},{itemId:'yuangi_jiejing',chance:1.0,qty:3},{skillScroll:'sanmei',chance:0.2},{itemId:'jindan_dan',chance:0.1},{itemId:'duanti_dan',chance:0.6},{itemId:'tongpi_dan',chance:0.3}] },
  'duzhang_swamp': { name:'沼渊毒龙', hp:350, attack:30, defense:25, qi:45,
    drops:[{itemId:'dunang',chance:1.0,qty:5},{itemId:'qiannian_lingzhi',chance:0.3},{itemId:'juli_dan',chance:0.5},{itemId:'zhuji_dan',chance:0.08},{skillScroll:'green_mist',chance:0.3},{skillScroll:'shiti',chance:0.15}] },
  'guji_ruins': { name:'上古守护者', hp:500, attack:38, defense:28, qi:60,
    drops:[{itemId:'lingzu_cuijian',chance:1.0,qty:8},{itemId:'qingfeng_jian',chance:0.4},{skillScroll:'houtu',chance:0.3},{itemId:'jindan_dan',chance:0.12}] },
  'bingfeng_grotto': { name:'冰霜巨人王', hp:450, attack:36, defense:30, qi:55,
    drops:[{itemId:'xixin',chance:1.0,qty:3},{itemId:'xuelian',chance:0.5},{skillScroll:'mist_step',chance:0.25},{itemId:'yuanying_dan',chance:0.08},{itemId:'duanti_dan',chance:0.7},{itemId:'tongpi_dan',chance:0.4},{itemId:'tiegu_dan',chance:0.15}] },
  'yy_baihu_hill': { name:'冥王守卫', hp:400, attack:35, defense:22, qi:50,
    drops:[{itemId:'pojing_dan',chance:0.5},{itemId:'qiannian_lingzhi',chance:0.4},{itemId:'yuangi_jiejing',chance:1.0,qty:3},{itemId:'huashen_dan',chance:0.05},{skillScroll:'wuji_gong',chance:0.25},{skillScroll:'chilong_body',chance:0.15},{itemId:'daoshen_dan',chance:0.08},{itemId:'shengti_dan',chance:0.04}] },
  'yy_huangquan_road': { name:'冥殿守卫', hp:300, attack:30, defense:20, qi:40,
    drops:[{itemId:'podi_dan',chance:0.6},{itemId:'lingquan_shui',chance:0.5},{itemId:'lingzu_cuijian',chance:1.0,qty:5},{itemId:'dacheng_dan',chance:0.03},{skillScroll:'yunjue',chance:0.2},{skillScroll:'qinglian',chance:0.12},{itemId:'shengti_dan',chance:0.06},{itemId:'shenmo_dan',chance:0.03}] },
  'lieyan_valley': { name:'炎龙·地心火蛟', hp:500, attack:40, defense:25, qi:60, monsterElement:'火',
    drops:[{itemId:'huoyuan_shi',chance:1.0,qty:5},{itemId:'xuelian',chance:0.3},{itemId:'jindan_dan',chance:0.1},{skillScroll:'sanmei',chance:0.2},{skillScroll:'chilong_body',chance:0.1}] },
  // ── 新补场景BOSS ──
  'heifeng_ridge': { name:'黑风寨主', hp:200, attack:24, defense:15, qi:30,
    drops:[{itemId:'tiexiu_jian',chance:0.6},{itemId:'heifeng_key',chance:0.4},{itemId:'poqi_dan',chance:0.3},{skillScroll:'tiequan',chance:0.25}] },
  'luori_plain': { name:'荒原狼王', hp:220, attack:26, defense:12, qi:25,
    drops:[{itemId:'shoupi',chance:1.0,qty:3},{itemId:'baihe_lily',chance:0.3},{itemId:'lingquan_shui',chance:0.4},{skillScroll:'splitting_fist',chance:0.2}] },
  'bamboo_grove': { name:'竹林蛇王', hp:180, attack:28, defense:8, qi:20,
    drops:[{itemId:'shepi',chance:1.0,qty:3},{itemId:'dunang',chance:0.5},{itemId:'zhixue_san',chance:0.5},{skillScroll:'swift_step',chance:0.2}] },
  'stone_road': { name:'石道劫匪头目', hp:200, attack:22, defense:14, qi:20,
    drops:[{itemId:'posun_lingshi',chance:0.8,qty:3},{itemId:'cuzhi_bingqi',chance:0.5},{itemId:'lianqi_xinde',chance:0.15},{skillScroll:'golden_bell',chance:0.2}] },
  'underground_river': { name:'暗河巨鳄', hp:350, attack:30, defense:22, qi:35,
    drops:[{itemId:'xixi_linpian',chance:1.0,qty:3},{itemId:'baihe_lily',chance:0.5},{itemId:'poqi_dan',chance:0.4},{skillScroll:'shuixin',chance:0.2}] },
  'gate_nether_divine': { name:'守塔石卫', hp:400, attack:32, defense:26, qi:40,
    drops:[{itemId:'xixin',chance:1.0,qty:3},{itemId:'lianqi_xinde',chance:0.25},{itemId:'juli_dan',chance:0.4},{skillScroll:'tuqi',chance:0.2}] },
  'xuantie_mine': { name:'铁甲巨蜥·矿脉守护者', hp:450, attack:36, defense:28, qi:45,
    drops:[{itemId:'xixi_linpian',chance:1.0,qty:5},{itemId:'xuantie_jingcui',chance:0.3},{itemId:'jindan_dan',chance:0.08},{skillScroll:'shiti',chance:0.25}] },
  'yumu_forest': { name:'玉木树王', hp:400, attack:34, defense:30, qi:50, monsterElement:'木',
    drops:[{itemId:'lingmu',chance:1.0,qty:5},{itemId:'yumu_hua',chance:0.3},{itemId:'muyuan_sui',chance:0.1},{skillScroll:'muye',chance:0.2},{skillScroll:'qinglian',chance:0.1}] },

  // ── 筑基期（中州域）BOSS ──
  'zz_yaoshou_ridge': { name:'青鳞蛟王', hp:650, attack:52, defense:32, qi:80, monsterElement:'水',
    drops:[{itemId:'qinglin_jiao',chance:1.0,qty:3},{itemId:'yaodan_he',chance:1.0,qty:2},{itemId:'jindan_dan',chance:0.15},{itemId:'zhushen_sui',chance:0.2},{itemId:'tongpi_dan',chance:0.5},{itemId:'tiegu_dan',chance:0.2},{skillScroll:'qinglian',chance:0.25},{skillScroll:'shuiyue_jing',chance:0.15}] },
  'zz_lingmai_ruins': { name:'灵脉地龙', hp:700, attack:48, defense:40, qi:75, monsterElement:'土',
    drops:[{itemId:'lingmai_jing',chance:1.0,qty:5},{itemId:'zhushen_sui',chance:0.6},{itemId:'jindan_dan',chance:0.12},{itemId:'tiegu_dan',chance:0.5},{itemId:'yinxiue_dan',chance:0.15},{skillScroll:'houtu',chance:0.25},{skillScroll:'juling_zhen',chance:0.15}] },
  'zz_huangji_dian': { name:'荒寂古魔残魂', hp:800, attack:56, defense:30, qi:90, monsterElement:'阴',
    drops:[{itemId:'huangji_gu',chance:1.0,qty:4},{itemId:'jindan_dan',chance:0.25},{itemId:'yuangi_jiejing',chance:1.0,qty:5},{itemId:'yinxiue_dan',chance:0.5},{itemId:'jinshen_dan',chance:0.15},{skillScroll:'hundun_jue',chance:0.2},{skillScroll:'wuji_gong',chance:0.2}] },

  // ── 金丹期（天域）BOSS ──
  'ty_leichi': { name:'雷池龙君', hp:1200, attack:72, defense:45, qi:120, monsterElement:'雷',
    drops:[{itemId:'leichi_jingtie',chance:1.0,qty:4},{itemId:'leijiao_long',chance:0.8},{itemId:'yuanying_dan',chance:0.15},{itemId:'huashen_dan',chance:0.04},{itemId:'jinshen_dan',chance:0.4},{itemId:'yusui_dan',chance:0.15},{skillScroll:'tianlei_yin',chance:0.25},{skillScroll:'shenglong_jue',chance:0.2}] },
  'ty_yunhai': { name:'云海龙鲸王', hp:1400, attack:66, defense:50, qi:130, monsterElement:'水',
    drops:[{itemId:'yunhai_longjing',chance:1.0,qty:4},{itemId:'yunhai_lu',chance:0.8},{itemId:'yuanying_dan',chance:0.12},{itemId:'huashen_dan',chance:0.04},{itemId:'jinshen_dan',chance:0.4},{itemId:'yusui_dan',chance:0.15},{skillScroll:'shuiyue_jing',chance:0.25},{skillScroll:'qinglian',chance:0.2}] },
  'ty_tiandao_peak': { name:'天道雷尊', hp:1600, attack:80, defense:48, qi:150, monsterElement:'雷',
    drops:[{itemId:'tiandao_bei',chance:1.0},{itemId:'jiuyang_ling',chance:0.8},{itemId:'yuanying_dan',chance:0.2},{itemId:'huashen_dan',chance:0.06},{itemId:'dacheng_dan',chance:0.03},{itemId:'dujie_dan',chance:0.015},{itemId:'yusui_dan',chance:0.4},{itemId:'bumie_dan',chance:0.15},{itemId:'niepan_dan',chance:0.05},{skillScroll:'tianlei_yin',chance:0.3},{skillScroll:'zhuxian_jian',chance:0.15},{itemId:'xian_fairy_pill',chance:0.05}] },
};

// ==========================
// 元素反应系统
// ==========================
const ELEMENT_REACTIONS = {
  '火火': { multiplier: 1.3, text: '🔥 双火共鸣！烈焰焚空！' },
  '火木': { multiplier: 1.5, text: '🌿🔥 木助火势！爆炸性的火焰吞噬一切！' },
  '火土': { multiplier: 0.8, text: '🔥🟤 熔岩迸裂，炽热的岩浆四溅！' },
  '火金': { multiplier: 1.2, text: '🔥🪙 烈火炼金！炎炎锋锐无可阻挡！' },
  '火水': { multiplier: 0.6, text: '💧🔥 水汽蒸腾！浓雾弥漫战场！' },
  '水木': { multiplier: 1.2, text: '💧🌿 生机勃发！草木汲取水汽狂长！' },
  '水土': { multiplier: 1.1, text: '💧🟤 泥沼术！地面化为陷阵！' },
  '木土': { multiplier: 1.3, text: '🌿🟤 盘根错节！地脉之力灌注！' },
  // ── 雷/阴 新增 ──
  '雷雷': { multiplier: 1.3, text: '⚡ 双雷轰顶！天罚降临！' },
  '雷火': { multiplier: 1.4, text: '⚡🔥 雷火交加！紫电裂空，烈焰焚城！' },
  '雷水': { multiplier: 1.5, text: '⚡💧 雷水相激！万雷奔腾，水幕化雷狱！' },
  '雷木': { multiplier: 1.2, text: '⚡🌿 雷击枯木！木引天雷，威力倍增！' },
  '雷金': { multiplier: 1.4, text: '⚡🪙 金雷共振！锐金引雷，势不可挡！' },
  '雷土': { multiplier: 0.9, text: '⚡🟤 雷沉大地！雷霆被大地化解大半！' },
  '阴阴': { multiplier: 1.2, text: '🌑 阴气交织！鬼哭神嚎！' },
  '阴水': { multiplier: 1.2, text: '🌑💧 阴水相融！寒气蚀骨！' },
  '阴火': { multiplier: 1.3, text: '🌑🔥 阴火燎原！幽冥鬼火焚尽一切！' },
};

function getElementReaction(attackElement, monsterElement) {
  var key1 = attackElement + monsterElement;
  var key2 = monsterElement + attackElement;
  return ELEMENT_REACTIONS[key1] || ELEMENT_REACTIONS[key2] || null;
}

// 🌀 特殊功法效果引擎（秘术/阵道/丹道）——读取当前装备槽位的特殊效果
function getSpecialSkillEffects() {
  const p = G.player;
  if (!p || !p.skillSlots || !p.skills) return null;
  const skillDb = (G.skillData && G.skillData.length ? G.skillData : (typeof SKILL_DB !== 'undefined' ? SKILL_DB : []));
  const result = { mishu: null, zhendao: null, dandao: null, alchemyBonus: 0, pillBonus: 0 };
  
  // 读取当前装备的秘术
  const mishuId = p.skillSlots.mishu;
  if (mishuId) {
    const sk = p.skills.find(s => s.id === mishuId);
    const sd = sk ? skillDb.find(d => d.id === sk.id) : null;
    if (sd && sd.effects && sd.effects.combat) {
      // 拷贝 combat（防 wisdomBonus 写入污染 SKILL_DB）
      const cb = {};
      for (const k in sd.effects.combat) cb[k] = sd.effects.combat[k];
      cb.wisdomBonus = sd.effects.wisdomBonus || 0;
      result.mishu = cb;
      result.mishuElement = sd.element || '无';
    }
  }
  // 🔧 攻伐术槽特殊效果（自创池攻伐带 噬灵/凝霜/焚心/眩晕，顶层字段）
  // 注意：不能直接改 result.mishu（它是秘术 combat 的引用，会污染 SKILL_DB）——合并时用拷贝
  const gongfaId = p.skillSlots.gongfa;
  if (gongfaId) {
    const sk = p.skills.find(s => s.id === gongfaId);
    const sd = sk ? skillDb.find(d => d.id === sk.id) : null;
    if (sd && sd.effects) {
      const gfe = sd.effects;
      if (gfe.lifesteal || gfe.freeze || gfe.burn || gfe.stun) {
        // 拷贝秘术 combat（防引用污染），再合并攻伐效果
        const merged = {};
        if (result.mishu) {
          for (const k in result.mishu) merged[k] = result.mishu[k];
        }
        if (gfe.lifesteal) merged.lifesteal = gfe.lifesteal;
        if (gfe.freeze) merged.freeze = gfe.freeze;
        if (gfe.burn) merged.burn = gfe.burn;
        if (gfe.stun) merged.stun = gfe.stun;
        if (sd.effects.wisdomBonus) merged.wisdomBonus = sd.effects.wisdomBonus;
        result.mishu = merged;
      }
    }
  }
  // 读取当前装备的阵道
  const zhendaoId = p.skillSlots.zhendao;
  if (zhendaoId) {
    const sk = p.skills.find(s => s.id === zhendaoId);
    const sd = sk ? skillDb.find(d => d.id === sk.id) : null;
    if (sd && sd.effects) {
      result.zhendao = {
        damageReduce: sd.effects.damageReduce || 0,
        reflectChance: sd.effects.reflectChance || 0,
        reflectRate: sd.effects.reflectRate || 0.35,
      };
    }
  }
  // 读取当前装备的丹道
  const dandaoId = p.skillSlots.dandao;
  if (dandaoId) {
    const sk = p.skills.find(s => s.id === dandaoId);
    const sd = sk ? skillDb.find(d => d.id === sk.id) : null;
    if (sd && sd.effects) {
      result.dandao = { alchemyBonus: sd.effects.alchemyBonus || 0, pillBonus: sd.effects.pillBonus || 0 };
      result.alchemyBonus = result.dandao.alchemyBonus;
      result.pillBonus = result.dandao.pillBonus;
    }
  }
  return result;
}
window.getSpecialSkillEffects = getSpecialSkillEffects;

const MONSTER_ELEMENTS = {
  '野狼': null, '青木蛇': '木', '铁皮野猪': null, '幽魂': '水',
  '骷髅兵': '金', '阴煞蛛': '木', '黑风山贼': null, '山贼头目': null,
  '石傀儡': '土', '怨灵': '水', '地下巨蜥': '土', '吸血蝙蝠': '水',
  '毒鳞蛇': '木', '沼泽巨蛙': '水', '毒蚊群': null, '石像守卫': '金',
  '上古傀儡': '土', '残魂': '水', '冰晶蝎': '水', '雪狼': null,
  '冰霜巨人': '水', '阴灵守卫': '水', '冥府阴兵': null,
  '草狼': '木', '荒原巨蜥': '土', '沙鹫': '金', '翠竹蛇': '木',
  '竹鼠群': '木', '白额猴': null, '古道劫匪': null, '破旧石像': '土',
  '岩浆蜥蜴': '火', '火焰鸟': '火', '火灵精': '火',
  '岩石巨兽': '土', '铁甲蜥蜴': '金', '玉木精': '木', '树妖': '木',
  '碧波水蚺': '水', '迷雾幻蝶': '水',
  // ── 筑基/金丹期 ──
  '青鳞蛟': '水', '赤目妖狼': '火', '紫电貂': '雷', '灵脉石灵': '土', '荒寂殿卫': '阴',
  '雷池蛟龙': '雷', '紫霄雷鸟': '雷', '云海龙鲸': '水', '天道峰守灵': '雷',
};
const attackFlavors = [
  '剑气纵横，破空而去！',
  '拳罡如雷，震得空气嗡嗡作响。',
  '灵力化刃，直取要害！',
  '一掌拍出，劲风扑面。',
  '手中光芒一闪，已是凌厉一击。',
  '身随心动，攻势如潮水般涌去。',
  '你抓住一个破绽，全力出手！',
  '指尖凝出一道锐芒，破风疾刺！',
  '气势一沉，周身灵气暴涌而出！',
  '虚晃一招，实则暗劲已至！',
  '吐气开声，一拳正中其胸！',
  '步法灵动，掌影翻飞如蝶！',
  '双手结印，一道灵光激射而出！',
  '长啸一声，灵力在经脉中轰然贯穿！',
  '身形如电，掠至对方面前一记重击！',
  '眼中精光一闪，攻势已到！',
];

const critFlavors = [
  '⚡ 这一击贯穿了他的防御！',
  '💥 灵力震荡，爆发出耀眼光芒！',
  '🔥 一击命中要害！',
  '⚡ 体内的力量骤然爆发，势不可挡！',
  '💥 狂暴的灵力炸裂开来！',
];

const defendFlavors = [
  '你凝神屏息，真气布满全身。',
  '脚下微动，身形如松般扎稳。',
  '双手结印，一道气墙在身前凝聚。',
  '以柔克刚，将袭来的力道尽数化解。',
  '运转灵力，周身浮现淡淡光晕。',
  '眸光沉静，将对方攻势尽收眼底。',
  '步伐轻移，以退为进从容卸力。',
  '双掌交错，灵力如流水般环绕周身。',
];

const monsterAttackFlavors = [
  '咆哮着扑了上来！',
  '张牙舞爪，攻势凶猛！',
  '一股腥风扑面而来！',
  '眼中凶光毕露，全力袭来！',
  '发出低沉的嘶吼，猛然冲来！',
  '身体一弓，如离弦之箭般射出！',
  '凌厉的爪风撕破空气！',
  '发出一声怪啸，速度快得惊人！',
  '气势汹汹地碾压过来！',
  '喷出一道浊黄色的气息！',
];

// ==========================
// 战斗类（支持普通/精英/BOSS）
// ==========================

// ==========================
// 自动秒杀检测（怪物太弱直接秒）
// ==========================

// ❄️ 冰阁门派除妖任务推进（战斗胜利时按怪物名匹配）
// 🔧 2026-08-04：冰阁弟子打怪同步推进门派任务（除妖类），自动完成无需手动交
function sectTaskKillProgress(monsterName) {
  try {
    if (typeof isSectMember !== 'function' || !isSectMember()) return;
    if (typeof updateSectTaskProgress !== 'function') return;
    if (!G.player || !G.player.sect) return;
    const tasks = G.player.sect.tasks || [];
    const mn = monsterName || '';
    for (let i = 0; i < tasks.length; i++) {
      const t = tasks[i];
      if (t && t.type === '除妖' && !t.done && !t.claimed) {
        if (mn.indexOf(t.item) !== -1 || t.item.indexOf(mn) !== -1) {
          updateSectTaskProgress(t.id, 1);
        }
      }
    }
  } catch(e) {}
}
window.sectTaskKillProgress = sectTaskKillProgress;

function canAutoKill(monsterInfo) {
  const p = G.player;
  if (!p || !monsterInfo) return false;
  
  let mhp, matk, mdef;
  if (monsterInfo.isBoss) {
    mhp = monsterInfo.data.hp;
    matk = monsterInfo.data.attack;
    mdef = monsterInfo.data.defense;
  } else if (monsterInfo.isElite) {
    const base = MONSTER_DATA[monsterInfo.baseName];
    mhp = Math.round(base.hp * (monsterInfo.hpMult || 1.8));
    matk = Math.round(base.attack * (monsterInfo.atkMult || 1.5));
    mdef = Math.round(base.defense * (monsterInfo.defMult || 1.3));
  } else {
    const base = MONSTER_DATA[monsterInfo.name];
    if (!base) return false;
    mhp = base.hp;
    matk = base.attack;
    mdef = base.defense;
  }
  
  // 玩家攻击 > 怪物血量×1.5，且防御 > 怪物攻击×0.8 → 秒杀
  return p.attack >= mhp * 1.5 && p.defense >= matk * 0.8;
}

// ==========================
// 功法使用统计（每次战斗自动记录）
// ==========================
function trackSkillUsage() {
  const p = G.player;
  if (!p || !p.skills) return;
  p.skills.forEach(sk => {
    if (!sk.active) return;
    if (sk.usageCount === undefined) sk.usageCount = 0;
    sk.usageCount++;
    // 每使用100次自动增加功法修为
    if (sk.usageCount % 100 === 0) {
      if (typeof gainSkillMasteryXp === 'function') gainSkillMasteryXp(sk.type, 50);
      if (typeof addNarrative === 'function') addNarrative('💪 ' + sk.name + '在反复使用中愈发纯熟，功力大进！', 'event');
    }
  });
}

class CombatExt {
  constructor(monsterInfo, onEnd) {
    this.info = monsterInfo;
    this.onEnd = onEnd;
    this.isBoss = monsterInfo.isBoss || false;
    this.isElite = monsterInfo.isElite || false;
    
    // 境界缩放因子——筑基后怪物越来越强
    const realmMult = 1 + Math.max(0, (G.player.qiRealmIndex || 0) - 8) * 0.4;
    // 世界事件缩放
    var eventStatMult = typeof getMonsterStatMult === 'function' ? getMonsterStatMult() : { atk:1, hp:1, loot:1 };
    var eventAtkMult = eventStatMult.atk || 1.0;
    var eventHpMult = eventStatMult.hp || 1.0;

    if (monsterInfo.isBoss) {
      // BOSS
      const d = monsterInfo.data;
      this.monsterName = monsterInfo.name;
      const scale = realmMult + (monsterInfo.isMiniBoss ? 0.3 : 0);
      this.monster = { hp: Math.round(d.hp * scale * eventHpMult), attack: Math.round(d.attack * scale * eventAtkMult), defense: Math.round(d.defense * scale), qi: Math.round(d.qi * scale) };
      this.monsterHp = this.monster.hp;
      this.drops = d.drops || [];
      this._monsterElement = monsterInfo.monsterElement || null;
    } else if (monsterInfo.isElite) {
      // 精英
      const base = MONSTER_DATA[monsterInfo.baseName];
      const hpm = (monsterInfo.hpMult || 1.8) * realmMult * eventHpMult;
      const atm = (monsterInfo.atkMult || 1.5) * realmMult * eventAtkMult;
      const dfm = (monsterInfo.defMult || 1.3) * realmMult;
      this.monsterName = monsterInfo.name;
      this.monster = { hp: Math.round(base.hp * hpm), attack: Math.round(base.attack * atm), defense: Math.round(base.defense * dfm), qi: Math.round(base.qi * 1.2 * realmMult) };
      this.monsterHp = this.monster.hp;
      this.drops = monsterInfo.drops || base.drops || [];
      this._monsterElement = monsterInfo.monsterElement || (typeof MONSTER_ELEMENTS !== 'undefined' ? MONSTER_ELEMENTS[monsterInfo.baseName] : null) || null;
    } else {
      // 普通怪
      // 支持直接属性传入（如试炼塔怪物）
      if (monsterInfo.hp !== undefined && monsterInfo.attack !== undefined) {
        // 直接使用提供的属性，不做缩放
        this.monsterName = monsterInfo.name;
        this.monster = { hp: monsterInfo.hp, attack: monsterInfo.attack, defense: monsterInfo.defense || 1, qi: monsterInfo.qi || 10 };
        this.monsterHp = this.monster.hp;
        this.drops = monsterInfo.drops || [];
        this._monsterElement = monsterInfo.monsterElement || null;
      } else {
        // 查表模式
        const base = MONSTER_DATA[monsterInfo.name];
        this.monsterName = monsterInfo.name;
        this.monster = { hp: Math.round(base.hp * realmMult * eventHpMult), attack: Math.round(base.attack * realmMult * eventAtkMult), defense: Math.round(base.defense * realmMult), qi: Math.round(base.qi * realmMult) };
        this.monsterHp = this.monster.hp;
        this.drops = base.drops || [];
        this._monsterElement = typeof MONSTER_ELEMENTS !== 'undefined' ? MONSTER_ELEMENTS[monsterInfo.name] : null;
      }
    }
    
    this.player = {
      hp: G.player.hp,
      maxHp: G.player.maxHp,
      attack: G.player.attack,
      defense: G.player.defense,
      qi: G.player.qi,
      maxQi: G.player.maxQi,
    };
    this.isActive = true;
    this.log = [];
    this.turn = 0;
    
    // 战斗开始页眉
    const rarityLabel = this.isBoss ? '👑 BOSS' : this.isElite ? '✨ 精英' : '普通';
    const rColor = this.isBoss ? '#e74c3c' : this.isElite ? '#c9a96e' : '#6a9ec9';
    this.log.push(`<span style="color:${rColor};font-weight:bold;font-size:12px;">⚔️ ${rarityLabel}【${this.monsterName}】</span>`);
    this.log.push(`<span style="color:var(--text-dim);font-size:10px;">❤️${this.monsterHp} ⚔️${this.monster.attack} 🛡${this.monster.defense}</span>`);
    // 🐾 灵兽登场（有存活灵兽时）
    if (typeof beastCombatBonus === 'function') {
      try {
        const bb = beastCombatBonus();
        if (bb && bb.alive && bb.alive.length > 0) {
          const descs = bb.alive.map(b => {
            const bd = (typeof BEAST_DB !== 'undefined') ? BEAST_DB[b.id] : null;
            return (bd ? bd.icon : '🐾') + b.name + (bd ? '（' + bd.ability + '）' : '');
          });
          this.log.push(`<span style="color:#7dce9a;font-size:10px;display:block;">🐾 灵兽伙伴与你并肩：${descs.join('、')}</span>`);
        }
      } catch(e) {}
    }
  }
  
  playerAttack() {
    if (!this.isActive) return;
    this.turn++;
    // 💚 每回合回血：active 功法的 hpRegen（疗伤法）持续生效——攻击回合也回血
    try {
      const skillDb = (G.skillData && G.skillData.length ? G.skillData : (typeof SKILL_DB !== 'undefined' ? SKILL_DB : []));
      let regenTotal = 0;
      G.player.skills.forEach(sk => {
        if (!sk.active) return;
        const sd = skillDb.find(d => d.id === sk.id);
        if (sd && sd.effects && sd.effects.hpRegen) regenTotal += sd.effects.hpRegen;
      });
      if (regenTotal > 0 && this.player.hp < this.player.maxHp) {
        this.player.hp = Math.min(this.player.maxHp, this.player.hp + regenTotal);
        this.log.push('<span style="color:#8bc34a;font-size:10px;display:block;">💚 疗伤功法回血+' + regenTotal + '</span>');
      }
    } catch(e) {}
    let baseDamage = Math.max(1, this.player.attack - this.monster.defense);
    // 🔧 保底系数：攻击至少造成 12% 攻击力的伤害（防防御完全碾压攻击→战斗变无限磨）
    const floorDmg = Math.max(1, Math.round(this.player.attack * 0.12));
    baseDamage = Math.max(baseDamage, floorDmg);
    const variance = Math.round(baseDamage * (0.8 + Math.random() * 0.4));
    let damage = variance;
    let flavorText = '';
    let critLabel = '';
    let reactionText = '';
    const skillDb = (G.skillData && G.skillData.length ? G.skillData : (typeof SKILL_DB !== 'undefined' ? SKILL_DB : []));
    const as = G.player.skills.find(s => s.active);
    var attackElement = null;
    if (as) {
      const sd = Array.isArray(skillDb) ? skillDb.find(s => s.id === as.id) : null;
      if (sd) {
        if (sd.element) attackElement = sd.element;
        if (sd.effects) {
          if (sd.effects.elementDamage && sd.effects.elementDamage.fire) {
            damage = Math.round(damage * (1 + sd.effects.elementDamage.fire));
            flavorText = '🔥 烈焰灼身！';
          }
          if (sd.effects.attackBonus) damage += Math.round(sd.effects.attackBonus * 0.3);
          if (sd.effects.critRate && Math.random() < sd.effects.critRate) {
            damage = Math.round(damage * 1.8);
            critLabel = critFlavors[Math.floor(Math.random() * critFlavors.length)];
          }
          // 炼体道身境暴击加成
          if (G.player._extraCritRate && Math.random() < G.player._extraCritRate) {
            damage = Math.round(damage * 2.0);
            critLabel = '<span style="color:#e74c3c;font-weight:bold;">💥 肉身撕裂！</span>';
          }
          if (sd.effects.stun && Math.random() < sd.effects.stun) this.log.push('<span style="color:#c9a96e;">💥 震住了对手！</span>');
        }
      }
    }
    // 元素反应
    if (attackElement && this._monsterElement && typeof getElementReaction === 'function') {
      var reaction = getElementReaction(attackElement, this._monsterElement);
      if (reaction) {
        damage = Math.round(damage * reaction.multiplier);
        reactionText = '<span style="color:#ff9800;font-weight:bold;font-size:11px;">' + reaction.text + ' 伤害×' + reaction.multiplier + '</span>';
      }
    }
    
    // 🌀 秘术战斗效果（破甲/吸血/冰冻/灼烧）
    let mishuText = '';
    let burnDamage = 0;
    if (typeof getSpecialSkillEffects === 'function') {
      try {
        const sp = getSpecialSkillEffects();
        if (sp && sp.mishu) {
          const ms = sp.mishu;
          // 金·破甲：无视怪物部分防御
          if (ms.armorPierce && this.monster.defense > 0) {
            const pierce = Math.round(this.monster.defense * ms.armorPierce);
            damage += pierce;
            mishuText += '<span style="color:#c9a96e;font-size:10px;display:block;">🔨 破甲！无视' + pierce + '点防御</span>';
          }
          // 木·噬灵：吸血回复
          if (ms.lifesteal && damage > 0) {
            const heal = Math.max(1, Math.round(damage * ms.lifesteal));
            this.player.hp = Math.min(this.player.maxHp, this.player.hp + heal);
            mishuText += '<span style="color:#7dce9a;font-size:10px;display:block;">🌿 噬灵回复' + heal + '气血</span>';
          }
          // 火·焚心：灼烧持续伤害
          if (ms.burn && Math.random() < ms.burn) {
            burnDamage = Math.max(3, Math.round(this.monsterHp * 0.03));
            this._burn = burnDamage;
            mishuText += '<span style="color:#ff7043;font-size:10px;display:block;">🔥 焚心！敌人被点燃，每回合灼烧' + burnDamage + '点</span>';
          }
          // 水·凝霜：冻结怪物（下次怪物回合跳过）
          if (ms.freeze && Math.random() < ms.freeze) {
            this._frozen = true;
            mishuText += '<span style="color:#4fc3f7;font-size:10px;display:block;">❄️ 凝霜！敌人被冻结，无法行动</span>';
          }
        }
      } catch(e) {}
    }
    // 灼烧持续伤害结算（上回合点燃的）
    if (this._burn && this._burn > 0 && this.monsterHp > 0) {
      this.monsterHp -= this._burn;
      mishuText += '<span style="color:#ff7043;font-size:10px;display:block;">🔥 灼烧造成' + this._burn + '点伤害</span>';
    }
    
    this.monsterHp -= damage;
    // 🐾 灵兽协助攻击
    let beastText = '';
    if (typeof beastCombatBonus === 'function') {
      const bb = beastCombatBonus();
      if (bb && bb.dmg > 0 && bb.fighters && bb.fighters.length > 0) {
        this.monsterHp -= bb.dmg;
        const names = bb.fighters.map(f => `${f.icon}${f.name}`).join('、');
        beastText = '<span style="color:#7dce9a;font-size:10px;display:block;">🐾 ' + names + ' 配合出击，额外造成 <b>' + bb.dmg + '</b> 点伤害！</span>';
      }
    }
    const atkFlavor = attackFlavors[Math.floor(Math.random() * attackFlavors.length)];
    let dmgStr = '<span style="color:#e74c3c;">' + damage + '</span>';
    this.log.push('<span style="color:var(--text);">【' + atkFlavor + '】命中' + this.monsterName + '！' + dmgStr + '点伤害。' + flavorText + '</span>');
    if (beastText) this.log.push(beastText);
    if (mishuText) this.log.push(mishuText);
    if (reactionText) this.log.push(reactionText);
    if (critLabel) {
      this.log.push('<span style="color:#ff9800;font-weight:bold;font-size:11px;">' + critLabel + '</span>');
    }
    if (this.monsterHp <= 0) { this.victory(); return; }
    this.monsterTurn();
  }
  
  playerDefend() {
    if (!this.isActive) return;
    this.turn++;
    let recovered = Math.round(this.player.maxQi * 0.1);
    G.player.skills.forEach(sk => {
      const sd = (G.skillData && G.skillData.length ? G.skillData : (typeof SKILL_DB !== 'undefined' ? SKILL_DB : [])).find(d => d.id === sk.id);
      if (!sd || !sk.active || !sd.effects) return;
      if (sd.effects.hpRegen) this.player.hp = Math.min(this.player.maxHp, this.player.hp + sd.effects.hpRegen);
      if (sd.effects.qiRegen) recovered += sd.effects.qiRegen;
    });
    this.player.qi = Math.min(this.player.maxQi, this.player.qi + recovered);
    // 不朽体·血肉重生
    if (G.player._buXiuRegen) {
      var regenAmt = Math.round(this.player.maxHp * 0.05);
      this.player.hp = Math.min(this.player.maxHp, this.player.hp + regenAmt);
      this.log.push('<span style="color:#8bc34a;font-weight:bold;">💚 不朽体·血肉重生，恢复' + regenAmt + '气血。</span>');
    }
    if (typeof trackSkillUsage === 'function') trackSkillUsage();
    if (typeof renderSkillNarrative === "function") renderSkillNarrative("defend");
    const defFlavor = defendFlavors[Math.floor(Math.random() * defendFlavors.length)];
    this.log.push('<span style="color:#6a9ec9;">🛡 ' + defFlavor + ' 灵力+' + recovered + '</span>');
    this.monsterTurn();
  }
  
  useItem() {
    if (!this.isActive) return;
    this.turn++;
    const healItem = G.player.inventory.find(i => i.use && (i.use.hp || i.use.qi));
    if (healItem) {
      const use = healItem.use;
      if (use.hp) this.player.hp = Math.min(this.player.maxHp, this.player.hp + use.hp);
      if (use.qi) this.player.qi = Math.min(this.player.maxQi, this.player.qi + use.qi);
      if (typeof removeItemFromInventory === 'function') removeItemFromInventory(healItem.id, 1);
      this.log.push(`你使用了${healItem.name}。`);
    } else {
      this.log.push('没有可用丹药。');
    }
    this.monsterTurn();
  }
  
  monsterTurn() {
    // 🔧 怪物同享保底伤害（防玩家防御过高→怪物0输出被磨死）
    const baseDamage = Math.max(1, this.monster.attack - this.player.defense, Math.round(this.monster.attack * 0.12));
    let variance = Math.round(baseDamage * (0.7 + Math.random() * 0.6));
    
    // ❄️ 凝霜冻结：怪物无法行动
    if (this._frozen) {
      this._frozen = false;
      this.log.push('<span style="color:#4fc3f7;font-weight:bold;">❄️ ' + this.monsterName + '被寒霜冻结，动弹不得！</span>');
      return;
    }
    
    // 🌀 阵道效果：减伤 + 反弹
    let zhendaoText = '';
    if (typeof getSpecialSkillEffects === 'function') {
      try {
        const sp = getSpecialSkillEffects();
        if (sp && sp.zhendao) {
          // 减伤
          if (sp.zhendao.damageReduce > 0) {
            const reduced = Math.round(variance * sp.zhendao.damageReduce);
            variance -= reduced;
            zhendaoText = '<span style="color:#81d4fa;font-size:10px;display:block;">🌀 阵道护体，减伤' + reduced + '点</span>';
          }
          // 反弹
          if (sp.zhendao.reflectChance > 0 && Math.random() < sp.zhendao.reflectChance) {
            const reflect = Math.max(1, Math.round(variance * sp.zhendao.reflectRate));
            this.monsterHp -= reflect;
            zhendaoText += '<span style="color:#ff9800;font-size:10px;display:block;">🪞 阵道反伤' + reflect + '点！</span>';
          }
          // 🔧 阵道熟练度（每场战斗限一次，符脉弟子×2.5自动生效）
          try {
            if (typeof gainSkillMasteryXp === 'function' && !this._zhendaoXpGiven) {
              this._zhendaoXpGiven = true;
              gainSkillMasteryXp('阵道', 12);
            }
          } catch(e) {}
        }
      } catch(e) {}
    }
    
    // 圣体护身（每场战斗第一次攻击被抵挡）
    if (G.player._shengTiGuard && !this._guardUsed) {
      this._guardUsed = true;
      this.log.push('<span style="color:#c9a96e;font-weight:bold;">🛡️ 圣体护体·金光乍现，将攻击尽数挡下！</span>');
      return;
    }
    
    let dodge = 0;
    G.player.skills.forEach(sk => {
      const sd = (G.skillData && G.skillData.length ? G.skillData : (typeof SKILL_DB !== 'undefined' ? SKILL_DB : [])).find(d => d.id === sk.id);
      if (!sd || !sk.active || !sd.effects) return;
      if (sd.effects.dodge) dodge += sd.effects.dodge;
    });
    if (Math.random() < dodge) {
      this.log.push('<span style="color:#8bc34a;">↻ 身形一晃，'+this.monsterName+'的攻击擦肩而过！</span>');
      return;
    }
    // 🐾 灵兽玄甲减伤
    let beastGuardText = '';
    if (typeof beastCombatBonus === 'function') {
      const bb = beastCombatBonus();
      if (bb && bb.defReduce > 0) {
        const reduced = Math.round(variance * bb.defReduce);
        variance -= reduced;
        const g = bb.guardian;
        beastGuardText = '<span style="color:#7dce9a;font-size:10px;display:block;">🐢 ' + (g ? g.icon + g.name : '灵兽') + ' 玄甲护体，格挡 <b>' + reduced + '</b> 点伤害！</span>';
      }
    }
    this.player.hp -= variance;
    const atkFlavor2 = monsterAttackFlavors[Math.floor(Math.random() * monsterAttackFlavors.length)];
    this.log.push('<span style="color:#e74c3c;">💢 '+this.monsterName+atkFlavor2+' 造成 <b>'+variance+'</b> 点伤害。</span>');
    if (zhendaoText) this.log.push(zhendaoText);
    if (beastGuardText) this.log.push(beastGuardText);
    if (this.player.hp <= 0) this.defeat();
  }
  
  victory() {
    this.isActive = false;
    const isDangerous = this.isBoss || this.isElite;
    // 灵石和修为随玩家境界指数增长
    const realmMult = 1 + (G.player.qiRealmIndex || 0) * 0.3;
    
    // ── 场景等级惩罚/奖励 ──
    // 当前场景 qiLevel 太低 → 几乎没有经验
    var sceneLevelMult = 1.0;
    try {
      var curSceneData = typeof getSceneData === 'function' ? getSceneData(G.currentScene) : null;
      if (curSceneData && typeof curSceneData.qiLevel !== 'undefined') {
        var sceneQi = curSceneData.qiLevel;
        var playerQi = G.player.qiRealmIndex || 0;
        // qiLevel 3 → 适合练气1-2层(realmIndex 0-1)
        // 玩家境界比场景高出 ≥3个小阶(约1个大境界) → 惩罚
        var levelDiff = playerQi - sceneQi;
        if (levelDiff >= 3) {
          sceneLevelMult = Math.max(0.02, 1.0 - levelDiff * 0.15);
        } else if (levelDiff <= -2) {
          // 越级打怪有加成（最多2倍）
          sceneLevelMult = 1.5;
        }
      }
    } catch(e) {}
    var xpMult = realmMult * sceneLevelMult;
    var lootMult = typeof getMonsterStatMult === 'function' ? getMonsterStatMult().loot || 1.0 : 1.0;
    // ☯️ 因果业力：功德加身掉落更丰，杀孽缠身收获凋零
    if (typeof getKarmaLootMult === 'function') lootMult *= getKarmaLootMult();
    // 🍂 季节修正：秋天收获更丰，节日加成
    if (typeof getSeasonMod === 'function') lootMult *= getSeasonMod().lootMult;
    if (typeof getFestivalMod === 'function') {
      const fm = getFestivalMod();
      if (fm && fm.lootMult) lootMult *= fm.lootMult;
    }
    let stones = isDangerous ? Math.floor((15 + Math.random() * 25) * xpMult * lootMult) : Math.floor((3 + Math.random() * 5) * xpMult * lootMult);
    let exp = isDangerous ? Math.floor((80 + Math.random() * 80) * xpMult) : Math.floor((25 + Math.random() * 20) * xpMult);
    
    // 🧘 境界产出保底：修为需求指数增长，产出也要跟上
    // 防止高境界玩家在低级地图啥也得不到
    // ⚔️ 战斗修为保底：练气稳步/筑基放缓/金丹后靠顿悟奇遇
    var fightIdx = G.player.qiRealmIndex || 0;
    var realmBaseExp;
    if (fightIdx <= 8) realmBaseExp = Math.floor(3 + fightIdx * 3);
    else if (fightIdx <= 11) realmBaseExp = Math.floor(27 + (fightIdx - 8) * 8);
    else realmBaseExp = 55 + Math.floor((fightIdx - 12) * 5);
    exp = Math.max(realmBaseExp, exp);
    
    // 场景太低级时加一句旁白
    if (sceneLevelMult < 0.3) {
      this.log.push('<span style="color:var(--text-dim);font-size:10px;display:block;">💭 这片区域的对手对你而言太弱了，几乎无法从战斗中获益。该去更强的地方了。</span>');
    }
    
    // 掉落 — 自动拾取
    this.drops.forEach(drop => {
      if (Math.random() < drop.chance) {
        const qty = drop.qty || 1;
        if (drop.skillScroll && typeof learnSkillFromScroll === 'function') {
          learnSkillFromScroll(drop.skillScroll);
        } else {
          // 🔧 2026-08-04：低于境界的突破丹/满10突破丹/化神固定垃圾装备不拾取
          if (typeof shouldFilterAutoDrop === 'function' && shouldFilterAutoDrop(drop.itemId)) return;
          const itemData = (typeof ITEM_DB !== 'undefined' ? ITEM_DB : []).find(i => i.id === drop.itemId);
          if (itemData && typeof addItemToInventory === 'function') addItemToInventory(itemData, qty);
          const addedName = itemData ? itemData.name : drop.itemId;
          this.log.push(`<span style="border-left:3px solid #6a9ec9;padding-left:6px;display:block;color:#8bc34a;">📦 拾取 ${addedName} ×${qty}</span>`);
        }
      }
    });
    
    // 战斗额外灵石收益
    const realmMult2 = 1 + (G.player.qiRealmIndex || 0) * 0.3;
    const extraStones = Math.floor(Math.random() * (isDangerous ? 8 : 3) * realmMult2 * lootMult) + Math.floor((isDangerous ? 5 : 1) * realmMult2 * lootMult);
    stones += extraStones;
    stones += extraStones;
    
    G.player.stones += stones;
    if (typeof gainCultivation === 'function') gainCultivation('qi', exp);
    else G.player.qiCultivationPoints += exp;
    
    // ⚔️ 战斗炼体：掉血淬体 + 胜利淬炼（交互战斗路径）
    // this.player.hp 是战斗结束时玩家剩余血量，maxHp 为上限 → 计算气血损耗
    var maxHpRef = this.player.maxHp || G.player.maxHp || 100;
    var hpLossPct = Math.round((1 - (this.player.hp || maxHpRef) / maxHpRef) * 100);
    var bodyGain = 0;
    if (typeof gainBodyCultivationFromCombat === 'function') {
      bodyGain = gainBodyCultivationFromCombat(hpLossPct, !!this.isBoss, !!this.isElite);
      if (bodyGain > 0) {
        this.log.push(`<span style="color:#8bc34a;display:block;">💪 恶战淬体，肉身愈发坚实。（体魄+${bodyGain}）</span>`);
      }
    }
    
    const logText = isDangerous ? `大胜！获得灵石×${stones}，修为+${exp}` : `胜利！灵石×${stones}，修为+${exp}`;
    this.log.push(logText);
    G.player.hp = Math.max(1, this.player.hp);
    G.player.qi = Math.max(1, this.player.qi);
    
    if (typeof recordKill === "function") recordKill(this.monsterName);
    // ☯️ 因果业力：杀生减业
    if (typeof karmaOnKill === 'function') karmaOnKill(this.monsterName);
    // 🌟 名声：杀敌扬名
    if (typeof fameOnKill === 'function') fameOnKill(!!this.isBoss, !!this.isElite, this.monsterName);
    if (typeof gainSkillMasteryXp === "function") gainSkillMasteryXp("攻伐术", 25);
    if (typeof gainSkillMasteryXp === "function") gainSkillMasteryXp("身法", 10);
    if (typeof gainSkillMasteryXp === "function") gainSkillMasteryXp("心法", 12);
    
    // ── 稀有材料掉落（境界越高越好出）──
    const realmLuck = 1 + (G.player.qiRealmIndex || 0) * 0.04;
    const rarityChance = Math.min(0.5, (this.isBoss ? 0.08 : this.isElite ? 0.03 : 0.01) * realmLuck);
    let rareDrop = null;
    if (Math.random() < rarityChance) {
      const rareItems = (typeof ITEM_DB !== 'undefined' ? ITEM_DB : []).filter(i => i.rarity && i.rarity >= 2);
      if (rareItems.length > 0) {
        const chosen = rareItems[Math.floor(Math.random() * rareItems.length)];
        if (typeof addItemToInventory === 'function') {
          addItemToInventory(chosen, 1);
          rareDrop = chosen;
          this.log.push('✨ 拾取稀有材料 ' + chosen.name + '！');
        }
      }
    }
    
    if (typeof addDailyLogEntry === "function") addDailyLogEntry("combat", "击败"+this.monsterName);
    if (typeof generateActionNarrative === "function") generateActionNarrative({playerName:G.player.name, location:getSceneData(G.currentScene)?.name||'未知', time:G.time.period+'时'}, 'combat_victory');
    
    // ── 💎 宝石掉落（BOSS 35% / 精英 20% / 普通 5%，境界加成）──
    try {
      const gemChance = (this.isBoss ? 0.35 : this.isElite ? 0.2 : 0.05) * (1 + (G.player.qiRealmIndex || 0) * 0.03);
      if (Math.random() < gemChance) {
        const gems = (typeof ITEM_DB !== 'undefined' ? ITEM_DB : []).filter(i => i.type === '宝石');
        if (gems.length > 0) {
          const gem = gems[Math.floor(Math.random() * gems.length)];
          if (typeof addItemToInventory === 'function') {
            addItemToInventory(gem, 1);
            this.log.push('💎 拾获宝石 ' + gem.name + '！');
            if (typeof addNarrative === 'function') addNarrative('💎 拾获宝石 <b>' + gem.name + '</b>（可镶嵌进装备孔位）', 'loot-rare');
          }
        }
      }
    } catch(e) {}
    
    // ── ⚔️ 装备分级掉落（新系统）──
    var equipDrop = null;
    if (typeof maybeDropEquip === 'function') {
      equipDrop = maybeDropEquip({ isBoss: !!this.isBoss, isElite: !!this.isElite, attack: this.info ? this.info.attack : 0, hp: this.info ? this.info.hp : 0 });
      if (equipDrop) {
        var eqColor = '#9a9a9a';
        if (typeof EQUIP_QUALITIES !== 'undefined' && EQUIP_QUALITIES[equipDrop.quality]) eqColor = EQUIP_QUALITIES[equipDrop.quality].color;
        var eqEmoji = typeof EQUIP_QUALITIES !== 'undefined' && EQUIP_QUALITIES[equipDrop.quality] ? EQUIP_QUALITIES[equipDrop.quality].emoji : '📦';
        var slotIcon = { weapon:'🗡️', armor:'🛡️', accessory:'💍', head:'👑', shoes:'👢' }[equipDrop._equipSlot || 'weapon'] || '📦';
        this.log.push('<span style="border-left:3px solid ' + eqColor + ';padding-left:6px;display:block;color:' + eqColor + ';">' + eqEmoji + ' 装备掉落 <b>' + equipDrop.name + '</b>（' + (equipDrop.quality||'凡品') + '）</span>');
        addNarrative('<span style="border-left:3px solid ' + eqColor + ';padding:6px 10px;display:block;">' + eqEmoji + ' 拾获' + slotIcon + ' <b style="color:' + eqColor + '">' + equipDrop.name + '</b>（' + (equipDrop.quality||'凡品') + '）</span>', 'loot-rare');
      }
    }
    
    // ── 🐾 灵兽：战斗后经验 + 捕获幼崽 ──
    try {
      if (typeof beastGainExp === 'function' && G.player.beasts && G.player.beasts.length > 0) {
        G.player.beasts.forEach((b, i) => { if (b && b.hp > 0) beastGainExp(i, 8 + (G.player.qiRealmIndex || 0) * 2); });
      }
      if (typeof tryCatchBeast === 'function') {
        tryCatchBeast(G.currentScene);
      }
    } catch(e) {}
    
    // 🌿 灵兽回春（胜利后治疗主人——木灵等治疗型灵兽）
    try {
      if (typeof beastCombatBonus === 'function') {
        const bbHeal = beastCombatBonus();
        if (bbHeal && bbHeal.heal > 0 && G.player.hp < G.player.maxHp) {
          G.player.hp = Math.min(G.player.maxHp, G.player.hp + bbHeal.heal);
          this.log.push('<span style="color:#8bc34a;font-size:10px;display:block;">🌿 灵兽回春，恢复' + bbHeal.heal + '点气血</span>');
          addNarrative('🌿 战斗结束，灵兽施展回春之术，你恢复了' + bbHeal.heal + '点气血。', 'event');
        }
      }
    } catch(e) {}
    
    // ── 💊 炼体丹掉落（按炼体境界动态，解决“炼体丹药掉太少没法突破”）──
    try {
      var bodyPillDrop = (typeof rollBodyPillForRealm === 'function') ? rollBodyPillForRealm(!!this.isBoss, !!this.isElite) : null;
      if (bodyPillDrop) {
        this.log.push('<span style="color:#ff9800;font-size:10px;display:block;">💊 拾取炼体丹 ' + bodyPillDrop.name + ' ×' + bodyPillDrop.qty + '</span>');
        addNarrative('💊 拾获炼体丹 <b>' + bodyPillDrop.name + '</b> ×' + bodyPillDrop.qty, 'loot-rare');
      }
    } catch(e) {}
    
    // ── 📜 场景功法掉落 + 战斗深度 ──
    if (typeof handleSceneSkillDropsAndDepth === 'function') handleSceneSkillDropsAndDepth();
    
    // ── 📜 精英模板功法掉落 ──
    if (this.isElite && this.info && this.info.template && this.info.template.skillScroll) {
      var tpl = this.info.template;
      if (Math.random() < (tpl.skillChance || 0.08)) {
        if (typeof learnSkillFromScroll === 'function') {
          learnSkillFromScroll(tpl.skillScroll);
        }
      }
    }
    
    // BOSS/精英战斗 → 大胜卡片
    if (isDangerous) {
      const qColor = typeof getQualityColor === 'function' ? getQualityColor('天级') : '#c9a96e';
      let rareHtml = '';
      if (rareDrop) {
        const rColor = typeof getQualityColor === 'function' ? getQualityColor(rareDrop.quality || '灵级') : '#6a9ec9';
        rareHtml = `<br><span style="display:block;font-size:12px;margin-top:4px;">✨ 稀世之珍 — <b style="color:${rColor}">${rareDrop.name}</b> 收入囊中</span>`;
      }
      const html = `<div class="milestone-title" style="color:${qColor}">⚔ 大胜！<br><span style="font-size:13px;">— ${this.monsterName} —</span></div>
<span class="milestone-detail">灵石 +${stones} · 修为 +${exp}${rareHtml}</span>`;
      addNarrative(html, 'milestone');
    } else {
      addNarrative(`⚔️ 你击败了${this.monsterName}！`, 'narr-combat');
    }
    
    // 🔮 本命法宝亮相彩蛋（有法宝时概率触发，增强金丹期战斗代入感）
    if (G && G.player && G.player.benming && G.player.benming.unlocked && G.player.benming.name && Math.random() < 0.25) {
      const bmName = G.player.benming.name;
      const bmLv = G.player.benming.level || 1;
      const bmFlavor = [
        `你的本命「${bmName}」自行震动，发出一声清鸣，似在庆贺此胜。`,
        `一缕灵光从你丹田浮现——「${bmName}」的虚影在你身周盘旋一圈，缓缓隐没。`,
        `「${bmName}」上流过一道温润光华，与你心神共鸣，仿佛在说：杀得好。`,
        `你以神识轻抚丹田中的「${bmName}」，它微微颤动着回应你，灵性又精进了一分。`,
        `激战之后，${bmName}的锋芒似乎更盛——这柄与你性命相连的法宝，正随你一同成长。`,
      ];
      addNarrative(`🔮 ${bmFlavor[Math.floor(Math.random() * bmFlavor.length)]}`, 'narr-epic');
      if (typeof reportState === 'function') {
        try { reportState('法宝亮相 Lv.' + bmLv); } catch(e) {}
      }
    }
    
    // 稀有掉落单独闪烁（分品质）
    if (rareDrop) {
      var rColor = typeof getQualityColor === 'function' ? getQualityColor(rareDrop.quality || '灵级') : '#6a9ec9';
      var isLegend = (rareDrop.rarity || 0) >= 4;
      var narrType = isLegend ? 'loot-legend' : 'loot-rare';
      var icon = isLegend ? '🌟' : '✨';
      var rareHtml = '<span style="border-left:3px solid ' + rColor + ';display:block;padding:6px 10px;">' + icon + ' 稀世之珍 — <b style="color:' + rColor + '">' + rareDrop.name + '</b></span>';
      addNarrative(rareHtml, narrType);
    }
    
    updateAllUI();
    if (this.onEnd) this.onEnd('victory');
  }
  
  defeat() {
    this.isActive = false;
    const lost = this.isBoss ? Math.floor(G.player.stones * 0.3) : Math.floor(G.player.stones * 0.1);
    G.player.stones = Math.max(0, G.player.stones - lost);
    G.player.hp = Math.round(G.player.maxHp * 0.3);
    G.player.mood = Math.max(0, G.player.mood - (this.isBoss ? 20 : 10));
    this.log.push(`你被击败了！损失灵石${lost}枚……`);
    if (typeof addDailyLogEntry === "function") addDailyLogEntry('combat', '被'+this.monsterName+'击败');
    if (typeof generateActionNarrative === "function") generateActionNarrative({playerName:G.player.name, location:getSceneData(G.currentScene)?.name||'未知', time:G.time.period+'时'}, 'combat_defeat');
    addNarrative(`💀 你不敌${this.monsterName}，败下阵来……`, 'narr-combat');
    updateAllUI();
    if (this.onEnd) this.onEnd('defeat');
  }
  
  flee() {
    if (!this.isActive) return;
    const fleeChance = this.isBoss ? 0.2 : this.isElite ? 0.4 : 0.6;
    if (Math.random() < fleeChance) {
      this.isActive = false;
      this.log.push('你虚晃一招，转身遁入林中，成功逃脱！');
      addNarrative('你且战且退，终于摆脱了追击。', 'system');
      if (this.onEnd) this.onEnd('fled');
    } else {
      this.log.push('逃跑失败！');
      this.monsterTurn();
    }
  }
}

function getRandomMonsterForScene(sceneId, encounterType) {
  const scene = getSceneData(sceneId);
  if (!scene || !scene.monsters || scene.monsters.length === 0) return null;
  
  // BOSS遭遇（每天只刷新一次）
  if (encounterType === 'boss') {
    const bossEntry = BOSS_MONSTERS[sceneId];
    if (bossEntry) {
      const dayStr = `day_${G.time.day}_${sceneId}`;
      if (G.player._bossFought !== dayStr) {
        return { isBoss: true, data: bossEntry, name: bossEntry.name };
      }
    }
    return null; // BOSS已击败或不存在
  }
  
  // 随机稀有度（70%普通，20%精英，8%小BOSS，2%场景BOSS）
  const roll = Math.random();
  if (roll < 0.02) {
    // 场景BOSS
    const bossEntry = BOSS_MONSTERS[sceneId];
    if (bossEntry) {
      const dayStr = `day_${G.time.day}_${sceneId}`;
      if (G.player._bossFought !== dayStr) {
        return { isBoss: true, data: bossEntry, name: bossEntry.name };
      }
    }
  }
  
  if (roll < 0.08) {
    // 小BOSS（精英模板基础上再加成）
    const baseMonster = scene.monsters[Math.floor(Math.random() * scene.monsters.length)];
    if (baseMonster) {
      return { isElite: true, isMiniBoss: true, baseName: baseMonster,
        hpMult: 3.0, atkMult: 2.0, defMult: 1.8,
        name: `⚡${baseMonster}·凶兽`,
        drops: [{itemId:'hgc_grass',chance:0.5},{itemId:'poqi_dan',chance:0.2}] };
    }
  }
  
  if (roll < 0.28) {
    // 精英怪——从匹配模板中找
    const baseMonster = scene.monsters[Math.floor(Math.random() * scene.monsters.length)];
    const template = ELITE_TEMPLATES.find(t => t.base === baseMonster);
    if (template) {
      return { isElite: true, template: template, baseName: baseMonster, name: template.name,
        hpMult: template.hpMult, atkMult: template.atkMult, defMult: template.defMult,
        drops: template.drops };
    }
  }
  
  // 普通怪
  const weights = scene.monsters.map((m, i) => scene.monsters.length - i);
  const total = weights.reduce((a, b) => a + b, 0);
  let r2 = Math.random() * total;
  for (let i = 0; i < scene.monsters.length; i++) {
    r2 -= weights[i];
    if (r2 <= 0) return { isNormal: true, name: scene.monsters[i] };
  }
  return { isNormal: true, name: scene.monsters[0] };
}

// ==========================
// 随机遭遇触发（探索时概率触发）
// ==========================
function triggerRandomEncounter(sceneId) {
  const scene = getSceneData(sceneId);
  if (!scene || scene.safe) return false;
  
  // 安全区不遇敌，危险场景遇敌概率与dangerLevel相关
  var danger = scene.dangerLevel || 1;
  var encMult = typeof getEncounterRateMult === 'function' ? getEncounterRateMult() : 1.0;
  var encounterChance = danger * 0.08 * encMult; // 兽潮时翻倍
  
  if (Math.random() < encounterChance) {
    const monster = getRandomMonsterForScene(sceneId);
    if (monster) {
      // ⚔️ 自动战斗 — 无论手动/自动模式，遇到就打，打不过回城
      if (typeof startAutoCombat === 'function') {
        startAutoCombat();
      }
      return true;
    }
  }
  return false;
}

function startSceneCombat(onEnd) {
  const monster = getRandomMonsterForScene(G.currentScene);
  if (!monster) {
    // 冷却防刷屏
    const now = Date.now();
    if (!G._lastNoMonsterMsg || now - G._lastNoMonsterMsg > 15000) {
      G._lastNoMonsterMsg = now;
      addNarrative('此处并无妖兽出没。', 'system');
    }
    return null;
  }
  const label = monster.isElite ? '✨精英·' : monster.isBoss ? '👑BOSS·' : '';
  
  // 自动秒杀检测
  if (!monster.isBoss && canAutoKill(monster)) {
    const mname = monster.name;
    addNarrative(`⚔️ 你随手一道气劲，${mname}应声倒下——太弱了！`, 'narr-combat');
    // 🐾 灵兽助战叙事（有存活灵兽时，秒杀也有参战感）
    try {
      if (typeof beastCombatBonus === 'function') {
        const bb = beastCombatBonus();
        if (bb && bb.alive && bb.alive.length > 0 && Math.random() < 0.5) {
          const b = bb.alive[Math.floor(Math.random() * bb.alive.length)];
          const bd = (typeof BEAST_DB !== 'undefined') ? BEAST_DB[b.id] : null;
          addNarrative(`🐾 ${bd ? bd.icon : '🐾'}${b.name} ${Math.random() < 0.5 ? '紧随其后补上一击' : '得意地甩了甩尾巴'}，${mname}轰然倒地。`, 'narr-combat');
        }
      }
    } catch(e) {}
    if (typeof trackSkillUsage === 'function') trackSkillUsage();
    if (typeof gainSkillMasteryXp === 'function') gainSkillMasteryXp('攻伐术', 15);
    if (typeof gainSkillMasteryXp === 'function') gainSkillMasteryXp('心法', 6);
    const realmMul = 1 + (G.player.qiRealmIndex || 0) * 0.3;
    G.player.stones += Math.floor((1 + Math.random() * 3) * realmMul);
    if (typeof gainCultivation === 'function') gainCultivation('qi', Math.floor(3 + Math.random() * 5));
    else G.player.qiCultivationPoints += Math.floor(3 + Math.random() * 5);
    // ⚔️ 秒杀也微量炼体（挥击淬体，不挨打所以少）
    if (typeof gainBodyCultivationFromCombat === 'function') {
      gainBodyCultivationFromCombat(0, false, false);
    }
    if (typeof recordKill === 'function') recordKill(monster.name);
    if (typeof addDailyLogEntry === 'function') addDailyLogEntry('combat', '秒杀'+mname);
    sectTaskKillProgress(mname); // ❄️ 门派除妖任务推进
    if (typeof handleSceneSkillDropsAndDepth === 'function') handleSceneSkillDropsAndDepth();
    // 🎁 秒杀也掉材料/装备（法宝材料等，之前秒杀0掉落）
    try {
      var sweepGains = (typeof processMonsterDrops === 'function') ? processMonsterDrops(monster, true) : [];
      if (sweepGains.length > 0 && typeof addNarrative === 'function') {
        addNarrative('🎁 拾获 ' + sweepGains.join('、'), 'loot');
      }
    } catch(e) {}
    // 💊 炼体丹掉落（秒杀路径）——化神挂机秒杀低级怪也能攒突破丹
    try {
      var bpSweep = (typeof rollBodyPillForRealm === 'function') ? rollBodyPillForRealm(false, false) : null;
      if (bpSweep && typeof addNarrative === 'function') {
        addNarrative('💊 拾获炼体丹 <b>' + bpSweep.name + '</b> ×' + bpSweep.qty, 'loot-rare');
      }
    } catch(e) {}
    return null;
  }
  
  addNarrative(`⚔️ ${label}${monster.name}出没！`, 'narr-combat');
  const combat = new CombatExt(monster, onEnd);
  showCombatModal(combat);
  return combat;
}

// 🤖 纯后台自动战斗（同步仿真 + 一锤子叙事）
function startAutoCombat(onEnd, forcedMonster) {
  if (G._autoCombatRunning) return null;
  
  const monster = forcedMonster || getRandomMonsterForScene(G.currentScene);
  if (!monster) return null;
  
  const mname = monster.name;
  
  // 秒杀检测
  if (canAutoKill(monster) && !monster.isBoss) {
    addNarrative(`⚔️ 你随手一道气劲，${mname}应声倒下。`, 'narr-combat');
    // 🐾 灵兽助战叙事（秒杀也有参战感）
    try {
      if (typeof beastCombatBonus === 'function') {
        const bb = beastCombatBonus();
        if (bb && bb.alive && bb.alive.length > 0 && Math.random() < 0.5) {
          const b = bb.alive[Math.floor(Math.random() * bb.alive.length)];
          const bd = (typeof BEAST_DB !== 'undefined') ? BEAST_DB[b.id] : null;
          addNarrative(`🐾 ${bd ? bd.icon : '🐾'}${b.name} ${Math.random() < 0.5 ? '抢先一步扑向' + mname : '在旁为你的出手喝彩'}。`, 'narr-combat');
        }
      }
    } catch(e) {}
    // 🐾 秒杀也触发灵兽捕获（否则金丹期秒杀低级怪永远抓不到）
    // 🔧 2026-08-05：满栏也尝试（内部自动换血，低级占坑不再堵死高级兽）
    if (typeof tryCatchBeast === 'function') {
      try { tryCatchBeast(G.currentScene); } catch(e) {}
    }
    if (typeof trackSkillUsage === 'function') trackSkillUsage();
    if (typeof gainSkillMasteryXp === 'function') gainSkillMasteryXp('攻伐术', 10);
    if (typeof gainSkillMasteryXp === 'function') gainSkillMasteryXp('心法', 4);
    if (typeof recordKill === 'function') recordKill(mname);
    if (typeof addDailyLogEntry === 'function') addDailyLogEntry('combat', '自动秒杀'+mname);
    sectTaskKillProgress(mname); // ❄️ 门派除妖任务推进
    if (typeof handleSceneSkillDropsAndDepth === 'function') handleSceneSkillDropsAndDepth();
    // 🎁 自动秒杀也掉材料/装备（法宝材料等）
    try {
      var autoSweepGains = (typeof processMonsterDrops === 'function') ? processMonsterDrops(monster, true) : [];
      if (autoSweepGains.length > 0 && typeof addNarrative === 'function') {
        addNarrative('🎁 拾获 ' + autoSweepGains.join('、'), 'loot');
      }
    } catch(e) {}
    // 💊 炼体丹掉落（自动秒杀路径）
    try {
      var bpAutoSweep = (typeof rollBodyPillForRealm === 'function') ? rollBodyPillForRealm(false, false) : null;
      if (bpAutoSweep && typeof addNarrative === 'function') {
        addNarrative('💊 拾获炼体丹 <b>' + bpAutoSweep.name + '</b> ×' + bpAutoSweep.qty, 'loot-rare');
      }
    } catch(e) {}
    var realmMul = 1 + (G.player.qiRealmIndex || 0) * 0.3;
    G.player.stones += Math.floor((1 + Math.random() * 3) * realmMul);
    if (typeof gainCultivation === 'function') gainCultivation('qi', Math.floor(3 + Math.random() * 5));
    else G.player.qiCultivationPoints += Math.floor(3 + Math.random() * 5);
    // ⚔️ 秒杀也微量炼体
    if (typeof gainBodyCultivationFromCombat === 'function') {
      gainBodyCultivationFromCombat(0, false, false);
    }
    if (typeof updateAllUI === 'function') updateAllUI();
    if (onEnd) onEnd('victory');
    return true;
  }
  
  // ── 不能秒杀 → 同步仿真战斗 ──
  G._autoCombatRunning = true;
  
  // 克隆玩家属性（战斗不影响本体，打完了再写回）
  var p = G.player;
  var sim = {
    hp: p.hp, maxHp: p.maxHp,
    attack: p.attack, defense: p.defense,
    qi: p.qi, maxQi: p.maxQi,
    _extraCritRate: p._extraCritRate || 0,
    _shengTiGuard: p._shengTiGuard || false,
    _buXiuRegen: p._buXiuRegen || false,
  };
  
  // 怪物属性（境界缩放）
  var realmMult = 1 + Math.max(0, (p.qiRealmIndex || 0) - 8) * 0.4;
  var eventStats = typeof getMonsterStatMult === 'function' ? getMonsterStatMult() : { atk:1, hp:1, loot:1 };
  
  var m = (function(){
    if (monster.isBoss) {
      var d = monster.data;
      var s = realmMult + (monster.isMiniBoss ? 0.3 : 0);
      return { hp: Math.round(d.hp * s * eventStats.hp), maxHp: Math.round(d.hp * s * eventStats.hp),
               attack: Math.round(d.attack * s * eventStats.atk), defense: Math.round(d.defense * s),
               qi: Math.round(d.qi * s),
               isBoss: true, drops: d.drops || [],
               monsterElement: monster.monsterElement || null,
               name: monster.name };
    }
    if (monster.isElite) {
      var base = MONSTER_DATA[monster.baseName];
      var hpm = (monster.hpMult || 1.8) * realmMult * eventStats.hp;
      var atm = (monster.atkMult || 1.5) * realmMult * eventStats.atk;
      var dfm = (monster.defMult || 1.3) * realmMult;
      return { hp: Math.round(base.hp * hpm), maxHp: Math.round(base.hp * hpm),
               attack: Math.round(base.attack * atm), defense: Math.round(base.defense * dfm),
               qi: Math.round(base.qi * 1.2 * realmMult),
               isBoss: false, isElite: true,
               drops: monster.drops || base.drops || [],
               monsterElement: monster.monsterElement || (MONSTER_ELEMENTS[monster.baseName] || null),
               name: monster.name };
    }
    // 普通
    var base = MONSTER_DATA[monster.name];
    if (!base) return null;
    return { hp: Math.round(base.hp * realmMult * eventStats.hp), maxHp: Math.round(base.hp * realmMult * eventStats.hp),
             attack: Math.round(base.attack * realmMult * eventStats.atk), defense: Math.round(base.defense * realmMult),
             qi: Math.round(base.qi * realmMult),
             isBoss: false, isElite: false,
             drops: base.drops || [],
             monsterElement: MONSTER_ELEMENTS[monster.name] || null,
             name: monster.name };
  })();
  if (!m) { G._autoCombatRunning = false; return null; }
  
  // 仿真战斗循环
  var turns = 0;
  var maxTurns = 60;
  var simLog = { playerHits: 0, monsterHits: 0, crits: 0, defends: 0 };
  var guardUsed = false;
  
  while (sim.hp > 0 && m.hp > 0 && turns < maxTurns) {
    turns++;
    
    // ── 💚 疗伤功法回血（自动仿真）：每回合 active 功法 hpRegen 叠加 ──
    try {
      if (p.skills && p.skills.length > 0) {
        var regenSum = 0;
        p.skills.forEach(function(sk) {
          if (!sk.active) return;
          var sd2 = SKILL_DB.find(function(d) { return d.id === sk.id; });
          if (sd2 && sd2.effects && sd2.effects.hpRegen) regenSum += sd2.effects.hpRegen;
        });
        if (regenSum > 0 && sim.hp < sim.maxHp) sim.hp = Math.min(sim.maxHp, sim.hp + regenSum);
      }
    } catch(e) {}
    
    // ── 玩家回合 ──
    var doDefendThisTurn = (Math.random() < 0.35) || (sim.hp < sim.maxHp * 0.4 && Math.random() < 0.5);
    
    if (doDefendThisTurn) {
      simLog.defends++;
      var qiGain = Math.round(sim.maxQi * 0.1);
      if (sim._buXiuRegen) sim.hp = Math.min(sim.maxHp, sim.hp + Math.round(sim.maxHp * 0.05));
      sim.qi = Math.min(sim.maxQi, sim.qi + qiGain);
    } else {
      simLog.playerHits++;
      var dmg = Math.max(1, sim.attack - m.defense, Math.round(sim.attack * 0.12));
      dmg = Math.round(dmg * (0.8 + Math.random() * 0.4));
      
      // 暴击
      var critChance = 0.05 + sim._extraCritRate; // 基础5% + 道身境加成
      if (Math.random() < critChance) { dmg = Math.round(dmg * 1.8); simLog.crits++; }
      
      // 🌀 秘术效果（自动仿真）
      var mishuInfo = null;
      if (typeof getSpecialSkillEffects === 'function') {
        try { mishuInfo = getSpecialSkillEffects(); } catch(e) {}
      }
      if (mishuInfo && mishuInfo.mishu) {
        var ms2 = mishuInfo.mishu;
        if (ms2.armorPierce && m.defense > 0) dmg += Math.round(m.defense * ms2.armorPierce);
        if (ms2.lifesteal && dmg > 0) sim.hp = Math.min(sim.maxHp, sim.hp + Math.max(1, Math.round(dmg * ms2.lifesteal)));
        if (ms2.burn && Math.random() < ms2.burn && !sim._burning) sim._burning = Math.max(3, Math.round(m.hp * 0.03));
        if (ms2.freeze && Math.random() < ms2.freeze) sim._frozen = true;
      }
      // 灼烧持续伤害
      if (sim._burning && m.hp > 0) { m.hp -= sim._burning; sim._burning = 0; }
      
      // 元素反应
      if (dmg > 0 && m.monsterElement) {
        var el = p.skills.find(function(sk){ return sk.active; });
        if (el) {
          var sd = SKILL_DB.find(function(d){ return d.id === el.id; });
          if (sd && sd.element && typeof getElementReaction === 'function') {
            var r = getElementReaction(sd.element, m.monsterElement);
            if (r) dmg = Math.round(dmg * r.multiplier);
          }
        }
      }
      
      m.hp -= dmg;
      
      // 🐾 灵兽协助攻击（自动仿真）——每回合配合出击
      if (typeof beastCombatBonus === 'function') {
        try {
          const bb = beastCombatBonus();
          if (bb && bb.dmg > 0 && m.hp > 0) {
            m.hp -= bb.dmg;
            simLog.beastHits = (simLog.beastHits || 0) + 1;
            simLog.beastDmg = (simLog.beastDmg || 0) + bb.dmg;
            if (!simLog._beastNames && bb.fighters && bb.fighters.length > 0) {
              simLog._beastNames = bb.fighters.map(f => f.icon + f.name).join('、');
            }
          }
        } catch(e) {}
      }
    }
    
    // ── 怪物回合（玩家防御/进攻后都挨打但有区别） ──
    if (m.hp > 0) {
      // ❄️ 凝霜冻结（自动仿真）
      if (sim._frozen) {
        sim._frozen = false;
        simLog.defends++;
        continue;
      }
      simLog.monsterHits++;
      // 圣体护身
      if (sim._shengTiGuard && !guardUsed) {
        guardUsed = true;
        continue; // 圣体挡一回合
      }
      var mdmg = Math.max(1, m.attack - sim.defense, Math.round(m.attack * 0.12));
      mdmg = Math.round(mdmg * (0.7 + Math.random() * 0.6));
      // 防御时减半伤害
      if (doDefendThisTurn) mdmg = Math.round(mdmg * 0.5);
      // 🐾 灵兽玄甲减伤（自动仿真）——每回合生效，日志只记第一次防刷屏
      if (typeof beastCombatBonus === 'function') {
        try {
          const bbGuard = beastCombatBonus();
          if (bbGuard && bbGuard.defReduce > 0) {
            const reducedGuard = Math.min(mdmg - 1, Math.round(mdmg * bbGuard.defReduce));
            mdmg -= reducedGuard;
            if (!simLog._beastGuardText) {
              const g = bbGuard.guardian;
              simLog._beastGuardText = (g ? g.icon + g.name : '灵兽') + ' 玄甲护体，格挡' + reducedGuard + '点伤害';
            }
          }
        } catch(e) {}
      }
      // 🌀 阵道减伤/反伤（自动仿真）
      if (mishuInfo && mishuInfo.zhendao) {
        if (mishuInfo.zhendao.damageReduce > 0) mdmg -= Math.round(mdmg * mishuInfo.zhendao.damageReduce);
        if (mishuInfo.zhendao.reflectChance > 0 && Math.random() < mishuInfo.zhendao.reflectChance) {
          m.hp -= Math.max(1, Math.round(mdmg * mishuInfo.zhendao.reflectRate));
        }
      }
      sim.hp -= mdmg;
    }
  }
  
  // ── 判结果 ──
  var victory = m.hp <= 0 && sim.hp > 0;
  
  // ── 战利品结算 ──
  var lootMult = eventStats.loot || 1.0;
  var realmMult2 = 1 + (p.qiRealmIndex || 0) * 0.3;
  
  // ── 场景等级惩罚/奖励 ──
  var sceneLevelMult2 = 1.0;
  var tooWeakHint = '';
  try {
    var curScene2 = typeof getSceneData === 'function' ? getSceneData(G.currentScene) : null;
    if (curScene2 && typeof curScene2.qiLevel !== 'undefined') {
      var diff2 = (p.qiRealmIndex || 0) - curScene2.qiLevel;
      if (diff2 >= 3) {
        sceneLevelMult2 = Math.max(0.02, 1.0 - diff2 * 0.15);
        tooWeakHint = '<span style="color:var(--text-dim);font-size:10px;display:block;">💭 这里的对手对你而言太弱了，无法从中获益。该去更强的地域了。</span>';
      } else if (diff2 <= -2) {
        sceneLevelMult2 = 1.5;
      }
    }
  } catch(e) {}
  
  var stonesGained = 0;
  var expGained = 0;
  var itemsGained = [];
  
  if (victory) {
    stonesGained = monster.isBoss || monster.isElite
      ? Math.floor((15 + Math.random() * 25) * realmMult2 * lootMult * sceneLevelMult2)
      : Math.floor((3 + Math.random() * 5) * realmMult2 * lootMult * sceneLevelMult2);
    expGained = monster.isBoss || monster.isElite
      ? Math.floor((80 + Math.random() * 80) * realmMult2 * sceneLevelMult2)
      : Math.floor((25 + Math.random() * 20) * realmMult2 * sceneLevelMult2);
    
    // 额外灵石
    stonesGained += Math.floor(Math.random() * (monster.isBoss ? 8 : 3) * realmMult2 * lootMult * sceneLevelMult2) + Math.floor((monster.isBoss ? 5 : 1) * realmMult2 * lootMult * sceneLevelMult2);
    
    // 掉落物
    (m.drops || []).forEach(function(drop) {
      if (Math.random() < drop.chance) {
        var qty = drop.qty || 1;
        if (drop.skillScroll && typeof learnSkillFromScroll === 'function') {
          learnSkillFromScroll(drop.skillScroll);
          itemsGained.push(drop.skillScroll + '(功法)');
        } else {
          // 🔧 2026-08-04：低于境界的突破丹/满10突破丹/化神固定垃圾装备不拾取
          if (typeof shouldFilterAutoDrop === 'function' && shouldFilterAutoDrop(drop.itemId)) return;
          var itemData = (ITEM_DB || []).find(function(i){ return i.id === drop.itemId; });
          if (itemData && typeof addItemToInventory === 'function') addItemToInventory(itemData, qty);
          if (itemData) itemsGained.push(itemData.name + (qty > 1 ? '×' + qty : ''));
        }
      }
    });
    
    // 稀有材料
    var realmLuck = 1 + (p.qiRealmIndex || 0) * 0.04;
    var rarityChance = Math.min(0.5, (monster.isBoss ? 0.08 : monster.isElite ? 0.03 : 0.01) * realmLuck);
    if (Math.random() < rarityChance) {
      var rareItems = (ITEM_DB || []).filter(function(i){ return i.rarity && i.rarity >= 2; });
      if (rareItems.length > 0) {
        var chosen = rareItems[Math.floor(Math.random() * rareItems.length)];
        if (typeof addItemToInventory === 'function') addItemToInventory(chosen, 1);
        itemsGained.push('✨' + chosen.name);
      }
    }
    
    // ⚔️ 装备分级掉落（自动战斗路径）
    if (typeof maybeDropEquip === 'function') {
      var equipDrop = maybeDropEquip({ isBoss: !!monster.isBoss, isElite: !!monster.isElite, attack: monster.attack || 0, hp: monster.hp || 0 });
      if (equipDrop) {
        itemsGained.push('🎽' + equipDrop.name + '(' + (equipDrop.quality || '凡品') + ')');
      }
    }
    
    // 💊 炼体丹掉落（按炼体境界动态，自动战斗路径）
    try {
      var bodyPillDrop2 = (typeof rollBodyPillForRealm === 'function') ? rollBodyPillForRealm(!!monster.isBoss, !!monster.isElite) : null;
      if (bodyPillDrop2) {
        itemsGained.push('💊' + bodyPillDrop2.name + '×' + bodyPillDrop2.qty);
      }
    } catch(e) {}
    
    // 写回玩家属性
    p.hp = Math.max(1, sim.hp);
    p.qi = Math.max(1, sim.qi);
    p.stones += stonesGained;
    if (typeof gainCultivation === 'function') gainCultivation('qi', expGained);
    else p.qiCultivationPoints += expGained;
    
    // 🐾 胜利后灵兽捕获（仿真战斗路径之前漏了！只有秒杀和CombatExt有）
    // 🔧 2026-08-05：满栏也尝试（内部自动换血）
    if (typeof tryCatchBeast === 'function') {
      try { tryCatchBeast(G.currentScene); } catch(e) {}
    }
    
    if (monster.isBoss) p._bossFought = 'day_' + G.time.day + '_' + G.currentScene;
    
    // 记录
    if (typeof trackSkillUsage === 'function') trackSkillUsage();
    if (typeof gainSkillMasteryXp === 'function') gainSkillMasteryXp('攻伐术', 25);
    if (typeof gainSkillMasteryXp === 'function') gainSkillMasteryXp('心法', 12);
    if (typeof gainSkillMasteryXp === 'function') gainSkillMasteryXp('身法', 10);
    if (typeof recordKill === 'function') recordKill(mname);
    if (typeof addDailyLogEntry === 'function') addDailyLogEntry('combat', '击败'+mname);
    // ❄️ 门派除妖任务推进（冰阁弟子打怪同步推进门派任务）
    sectTaskKillProgress(mname);
    if (typeof handleSceneSkillDropsAndDepth === 'function') handleSceneSkillDropsAndDepth();
    
    // ── 写篇好叙事 ──
    var turnDesc = turns <= 3 ? '不过几招工夫' : turns <= 10 ? '激战片刻后' : turns <= 20 ? '一番苦战之后' : '经过一场持久鏖战';
    var damageDesc = simLog.crits > 0 ? (function(){
      var rand = Math.random();
      if (rand < 0.3) return '你抓住破绽连番暴击，打得妖兽节节后退';
      if (rand < 0.6) return '一次精准的暴击直接贯穿了它的防御';
      return '你的暴击如雷霆炸裂，威势惊人';
    })() : (function(){
      var rand = Math.random();
      if (rand < 0.3) return '你稳扎稳打，一剑一剑磨掉了它的气力';
      if (rand < 0.5) return '攻守之间，你逐渐占据了上风';
      return '你来我往，刀光剑影中你始终沉着应战';
    })();
    var hpLoss = Math.round((1 - sim.hp / sim.maxHp) * 100);
    var selfDesc = hpLoss > 40 ? '身上已有多处挂彩' : hpLoss > 20 ? '微微带了些伤' : '几乎毫发无损';
    
    var narrText = '⚔️ ' + turnDesc + '，你终于击败了' + mname + '！' + damageDesc + '。' + selfDesc + '。';
    var rewardText = '💰 +' + stonesGained + '灵石 · +' + expGained + '修为';
    
    // 🐾 灵兽参战表现（自动仿真）——有助战输出或玄甲守护时写进叙事
    var beastNarr = '';
    if (simLog.beastDmg > 0 && simLog.beastHits > 0) {
      beastNarr = '<div style="color:#7dce9a;font-size:10px;">🐾 灵兽' + (simLog._beastNames || '伙伴') + '全程配合出击，共造成 <b>' + simLog.beastDmg + '</b> 点伤害！</div>';
    } else if (simLog._beastGuardText) {
      beastNarr = '<div style="color:#7dce9a;font-size:10px;">🐢 ' + simLog._beastGuardText + '。</div>';
    }
    
    // ⚔️ 战斗炼体：掉血淬体 + 胜利淬炼（自动仿真路径）
    // 掉血越多淬炼越深（0~90%气血损耗 → 0~1.8% of needed），胜者额外淬炼（普0.3/精英0.6/BOSS1.0%）
    var hpLossPct = Math.round((1 - sim.hp / sim.maxHp) * 100);
    var bodyGain = 0;
    if (typeof gainBodyCultivationFromCombat === 'function') {
      bodyGain = gainBodyCultivationFromCombat(hpLossPct, !!monster.isBoss, !!monster.isElite);
      if (bodyGain > 0) {
        rewardText += ' · 💪体+' + bodyGain;
        if (typeof addNarrative === 'function') {
          addNarrative('💪 恶战淬体，肉身在战斗中愈发坚实。（体魄+' + bodyGain + '）', 'event');
        }
      }
    }
    
    if (tooWeakHint && sceneLevelMult2 < 0.3) rewardText += ' 💭 毫无挑战';
    if (itemsGained.length > 0) rewardText += ' · 🎒 ' + itemsGained.slice(0, 3).join('、');
    
    var tierColor = monster.isBoss ? '#e74c3c' : monster.isElite ? '#c9a96e' : '#6a9ec9';
    var html = '<div style="color:' + tierColor + ';font-weight:bold;font-size:12px;margin-bottom:2px;">' + narrText + '</div>' +
               '<div style="color:var(--text);font-size:11px;">' + rewardText + '</div>' + beastNarr;
    addNarrative(html, monster.isBoss ? 'milestone' : 'narr-combat');
    
    // 🌿 灵兽回春（自动仿真胜利后治疗主人）
    try {
      if (typeof beastCombatBonus === 'function') {
        const bbHeal2 = beastCombatBonus();
        if (bbHeal2 && bbHeal2.heal > 0 && p.hp < p.maxHp) {
          p.hp = Math.min(p.maxHp, p.hp + bbHeal2.heal);
          if (typeof addNarrative === 'function') {
            addNarrative('🌿 战斗结束，灵兽施展回春之术，你恢复了' + bbHeal2.heal + '点气血。', 'event');
          }
        }
      }
    } catch(e) {}
    
  } else {
    // ── 战败 ──
    var lost = monster.isBoss ? Math.floor(p.stones * 0.3) : Math.floor(p.stones * 0.1);
    p.stones = Math.max(0, p.stones - lost);
    p.hp = Math.round(p.maxHp * 0.3);
    p.mood = Math.max(0, p.mood - (monster.isBoss ? 20 : 10));
    addNarrative('💀 不敌' + mname + '，损失灵石' + lost + '枚，仓促撤退……', 'narr-combat');
    autoHealAndRetreat();
  }
  
  G._autoCombatRunning = false;
  if (typeof updateAllUI === 'function') updateAllUI();
  if (onEnd) onEnd(victory ? 'victory' : 'defeat');
  
  return victory ? true : false;
}

// 🤖 战后自动回血/回城
function autoHealAndRetreat() {
  var p = G.player;
  // 先吃回血药
  if (typeof consumeBestHealItem === 'function') consumeBestHealItem();
  // 再吃回灵药
  if (typeof consumeBestQiItem === 'function' && p.qi < p.maxQi * 0.3) consumeBestQiItem();
  
  // 血量或灵力太低→回城休整
  if (p.hp < p.maxHp * 0.5 || p.qi < p.maxQi * 0.2) {
    var town = typeof findNearestTown === 'function' ? findNearestTown() : 'qingyun';
    if (town && typeof moveToScene === 'function') {
      moveToScene(town);
      addNarrative('伤势过重，退回安全处休整。', 'system');
    }
  }
}

window.startAutoCombat = startAutoCombat;

// 🏹 猎杀BOSS：强制在指定场景触发当天未战的场景BOSS（命中率30%，猎杀是主动搜索）
function startHuntBossCombat(sceneId) {
  const p = G.player;
  if (!p) return null;
  const dayStr = 'day_' + G.time.day + '_' + (sceneId || G.currentScene);
  if (p._bossFought === dayStr) {
    addNarrative('此地的妖兽首领今日已被你击败，明日再来吧。', 'system');
    return null;
  }
  const sid = sceneId || G.currentScene;
  const bossEntry = BOSS_MONSTERS[sid];
  if (!bossEntry) return null;
  
  // 50%保底 + 探索加成：猎杀是反复搜索，比随机遭遇高得多
  const roll = Math.random();
  if (roll > 0.5) {
    // 未引出BOSS：给一次普通战斗机会（保持画面动感）
    addNarrative('你搜索良久，暂时没有发现首领的踪迹……', 'narr-scene');
    if (typeof startAutoCombat === 'function') {
      try { startAutoCombat(); } catch(e) {}
    }
    return null;
  }
  
  // 引出BOSS → 直接进入BOSS战（复用 startAutoCombat 的后台仿真，强制指定怪物）
  addNarrative(`🐉 地动山摇！「${bossEntry.name}」从深处现身，怒视着你！`, 'event');
  
  const realmMult = 1 + Math.max(0, (p.qiRealmIndex || 0) - 8) * 0.4;
  const eventStats = typeof getMonsterStatMult === 'function' ? getMonsterStatMult() : { atk:1, hp:1, loot:1 };
  const d = bossEntry;
  const s = realmMult;
  const monster = {
    isBoss: true,
    data: bossEntry,
    name: bossEntry.name,
    hp: Math.round(d.hp * s * eventStats.hp), maxHp: Math.round(d.hp * s * eventStats.hp),
    attack: Math.round(d.attack * s * eventStats.atk), defense: Math.round(d.defense * s),
    qi: Math.round(d.qi * s),
    drops: d.drops || [],
    monsterElement: d.monsterElement || null
  };
  if (typeof startAutoCombat === 'function') {
    try { startAutoCombat(null, monster); } catch(e) {}
  }
  return monster;
}
window.startHuntBossCombat = startHuntBossCombat;

window.CombatExt = CombatExt;
window.canAutoKill = canAutoKill;
window.trackSkillUsage = trackSkillUsage;
window.MONSTER_DATA = MONSTER_DATA;
window.SCENE_SKILL_DROPS = SCENE_SKILL_DROPS;

// ── 📜 场景威胁评估 ──
function getSceneThreatData(sceneId) {
  var scene = typeof getSceneData === 'function' ? getSceneData(sceneId) : null;
  if (!scene || !scene.monsters || scene.monsters.length === 0) {
    return { threat: 0, monsters: [], boss: null, hasSkillDrop: false, danger: scene ? (scene.dangerLevel || 1) : 1 };
  }
  var monsterList = [];
  scene.monsters.forEach(function(mid) {
    var md = MONSTER_DATA[mid];
    if (md) monsterList.push({ name: mid, hp: md.hp, attack: md.attack, defense: md.defense, qi: md.qi });
  });
  // Sort by hp desc
  monsterList.sort(function(a,b) { return b.hp - a.hp; });
  var hasBoss = typeof BOSS_MONSTERS !== 'undefined' && !!BOSS_MONSTERS[sceneId];
  var hasSkillDrop = typeof SCENE_SKILL_DROPS !== 'undefined' && !!SCENE_SKILL_DROPS[sceneId];
  var avgHp = 0;
  monsterList.forEach(function(m) { avgHp += m.hp; });
  avgHp = monsterList.length > 0 ? Math.round(avgHp / monsterList.length) : 0;
  var threat = Math.min(5, Math.round((avgHp / 40) + (scene.dangerLevel || 1)));
  return { threat: threat, monsters: monsterList, boss: hasBoss, hasSkillDrop: hasSkillDrop, danger: scene.dangerLevel || 1 };
}

window.getSceneThreatData = getSceneThreatData;

// ── 📜 公共：战斗后场景功法掉落 + 深度（自动秒杀路径也能用）
function handleSceneSkillDropsAndDepth() {
  var gs = G.currentScene;
  // 场景功法掉落
  if (gs && typeof SCENE_SKILL_DROPS !== 'undefined' && SCENE_SKILL_DROPS[gs]) {
    var skills = SCENE_SKILL_DROPS[gs].skills;
    for (var si = 0; si < skills.length; si++) {
      var se = skills[si];
      if (Math.random() < se.chance) {
        if (typeof learnSkillFromScroll === 'function') {
          learnSkillFromScroll(se.id);
        }
      }
    }
  }
  // 🌀⚗️☯️🔮 新类型功法掉落（心法/秘术/阵道/丹道）
  if (gs && typeof SCENE_SPECIAL_SKILL_DROPS !== 'undefined' && SCENE_SPECIAL_SKILL_DROPS[gs]) {
    var spSkills = SCENE_SPECIAL_SKILL_DROPS[gs].skills;
    for (var sj = 0; sj < spSkills.length; sj++) {
      var sje = spSkills[sj];
      if (Math.random() < sje.chance) {
        if (typeof learnSkillFromScroll === 'function') {
          learnSkillFromScroll(sje.id);
        }
      }
    }
  }
  // 战斗深度
  if (gs) {
    var depthKey = '_fightDepth_' + gs;
    var curDepth = (G.player[depthKey] || 0) + 1;
    G.player[depthKey] = curDepth;
    if (curDepth > 1 && curDepth % 10 === 0) {
      var bonusStones = Math.floor(curDepth * (1 + (G.player.qiRealmIndex || 0) * 0.3));
      G.player.stones += bonusStones;
      if (typeof addNarrative === 'function') addNarrative('🔥 你在' + gs + '的战斗深度+' + curDepth + '，额外灵石×' + bonusStones, 'loot-rare');
      if (curDepth % 20 === 0 && typeof SCENE_SKILL_DROPS !== 'undefined' && SCENE_SKILL_DROPS[gs]) {
        var dpSkills = SCENE_SKILL_DROPS[gs].skills;
        if (dpSkills.length > 0) {
          var best = dpSkills[dpSkills.length - 1];
          if (typeof learnSkillFromScroll === 'function') {
            learnSkillFromScroll(best.id);
          }
        }
      }
    }
  }
}

window.handleSceneSkillDropsAndDepth = handleSceneSkillDropsAndDepth;
window.ELITE_TEMPLATES = ELITE_TEMPLATES;
window.BOSS_MONSTERS = BOSS_MONSTERS;
window.getRandomMonsterForScene = getRandomMonsterForScene;
function triggerAutoEncounter(sceneId) {
  // 自动模式下的遭遇，不弹框
  const scene = typeof getSceneData === 'function' ? getSceneData(sceneId) : null;
  if (!scene || scene.safe) return false;
  const danger = scene.dangerLevel || 1;
  if (Math.random() >= danger * 0.08) return false;
  
  if (typeof startAutoCombat === 'function') {
    startAutoCombat();
    return true;
  }
  return false;
}

window.triggerAutoEncounter = triggerAutoEncounter;
window.triggerRandomEncounter = triggerRandomEncounter;
window.startSceneCombat = startSceneCombat;

/* ═══════════ ⚔️ 战斗炼体：打怪与掉血也是炼体 ═══════════
 * 设计（2026-08-03）：
 *  - 战斗是体魄淬炼的天然途径——挨打淬皮肉，挥砍锻筋骨
 *  - 掉血炼体：按本场战斗气血损耗百分比给体修（掉血越多淬炼越深）
 *    基准：损失 10% 气血 → 约 0.2% of needed 体修
 *    50% 气血 → 约 1.0%；90% 气血 → 约 1.8%（生死边缘淬炼最深）
 *  - 胜利淬炼：击败强敌额外给体修（普通怪 0.3% / 精英 0.6% / BOSS 1.0%）
 *  - 与每日打坐/炼体（约 2% of needed）互补：战斗炼体是日常挂机炼体的主要来源，
 *    一场正常战斗合计约 0.5%~1.5%，BOSS 激战约 2%~3%，不会喧宾夺主
 */
function gainBodyCultivationFromCombat(hpLossPct, isBoss, isElite) {
  var p = G.player;
  if (!p || typeof getBodyRealm !== 'function' || typeof BODY_REALMS === 'undefined') return 0;
  var cur = getBodyRealm();
  var next = BODY_REALMS[p.bodyRealmIndex + 1];
  if (!next) return 0;  // 已圆满
  var needed = next.cpRequired - cur.cpRequired;
  if (needed <= 0) return 0;
  
  // 掉血炼体：0~90% 气血损耗 → 0%~4% of needed（原 1.8%，太低感知不到）
  var lossPct = Math.max(0, Math.min(90, hpLossPct || 0));
  var dmgGain = (lossPct / 90) * 4.0;
  
  // 胜利淬炼：普通 0.8% / 精英 1.5% / BOSS 2.5%（原 0.3/0.6/1.0，提升）
  var winGain = isBoss ? 2.5 : isElite ? 1.5 : 0.8;
  
  // 炼体倍率加成（与打坐/炼体共用）
  var mult = 1.0;
  if (typeof getCultivationMultiplier === 'function') {
    try { mult = getCultivationMultiplier('body'); } catch(e) { mult = 1.0; }
  }
  var total = (dmgGain + winGain) * mult;
  var gain = Math.round(needed * total / 100);
  if (gain <= 0) gain = Math.max(1, Math.round(needed * 0.15 / 100));  // 保底微量（原 0.05%）
  if (typeof gainCultivation === 'function') gainCultivation('body', gain);
  else p.bodyCultivationPoints += gain;
  return gain;
}
window.gainBodyCultivationFromCombat = gainBodyCultivationFromCombat;

// ==========================
// 💊 炼体丹战斗掉落（按玩家炼体境界动态掉落）
// 🔧 2026-08-04：解决「炼体丹药掉太少没法突破」——
//   战斗胜利后按 bodyRealmIndex 掉落当前突破所需的主炼体丹，
//   普通怪 20% / 精英 40% / BOSS 70%，高境界必出+额外储备下一境界丹
// ==========================
function rollBodyPillForRealm(isBoss, isElite) {
  try {
    var p = G.player;
    if (!p || typeof p.bodyRealmIndex === 'undefined') return null;
    var idx = p.bodyRealmIndex || 0;
    // 炼体六重以下不按此掉（锻体丹低级怪已有）；
    // 炼体七重（idx=6）起突破需要破壁丹等，开始掉落对应突破丹，铜皮境起高概率
    if (idx < 6) return null;
    // 当前境界突破所需（BODY_BREAKTHROUGH_REQS[idx] = idx → idx+1 的需求）
    var req = (typeof BODY_BREAKTHROUGH_REQS !== 'undefined') ? BODY_BREAKTHROUGH_REQS[idx] : null;
    if (!req || !req.items || req.items.length === 0) return null;
    
    // 🔧 2026-08-04 增强：主丹+次丹全掉（玉髓境需玉髓丹×2+金身丹×3，只掉主丹金身丹凑不齐）
    // 每次战斗优先掉「当前缺口最大的需求丹」：缺口大的概率高
    var chance = isBoss ? 0.85 : isElite ? 0.55 : 0.3;
    // 境界越高掉率略升
    chance = Math.min(0.95, chance + (idx - 9) * 0.006);
    
    var drops = [];
    req.items.forEach(function(rIt) {
      if (!rIt || !rIt.id) return;
      var owned = 0;
      (p.inventory || []).forEach(function(x){ if (x.id === rIt.id) owned += (x.qty || 1); });
      // 已满足需求的丹掉率减半（避免溢出），未满足的正常掉
      var needQty = rIt.qty || 1;
      var thisChance = chance;
      if (owned >= needQty) thisChance = chance * 0.3;
      if (Math.random() >= thisChance) return;
      var itemData = (typeof ITEM_DB !== 'undefined' ? ITEM_DB : []).find(function(i){ return i.id === rIt.id; });
      if (!itemData) return;
      // 已有 ≥10 不再拾取
      if (owned >= 10) return;
      var qty = 1 + Math.floor(Math.random() * (isBoss ? 2 : 1));
      if (isBoss) qty = 1 + Math.floor(Math.random() * 3);
      if (typeof addItemToInventory === 'function') addItemToInventory(itemData, qty);
      drops.push({ name: itemData.name, qty: qty });
    });
    // 返回第一个（日志用），实际全部已入包
    return drops.length > 0 ? drops[0] : null;
  } catch(e) { return null; }
}
window.rollBodyPillForRealm = rollBodyPillForRealm;

// ==========================
// 💊 丹药掉落过滤（挂机/战斗掉落统一）
// 🔧 2026-08-04：
//   1. 低于自己境界可用的突破丹不再掉（只留当前突破需求 + 下一境界储备）
//   2. 突破丹背包已有 ≥10 不再拾取（防溢出堆积）
// ==========================
function shouldFilterPillDrop(itemId) {
  try {
    var p = G.player;
    if (!p || !itemId) return false;
    var item = (typeof ITEM_DB !== 'undefined' ? ITEM_DB : []).find(function(i){ return i.id === itemId; });
    if (!item || item.category !== '丹药') return false;
    
    // 需求2：突破丹 ≥10 不再拾取
    if (item.breakItem) {
      var owned = (p.inventory || []).find(function(x){ return x.id === itemId; });
      if (owned && (owned.qty || 0) >= 10) return true;
    }
    
    // 需求1：仅突破丹按境界过滤（普通丹药如回气/止血/聚气不限）
    if (!item.breakItem) return false;
    
    // 收集「当前 + 下一境界」突破需求中的所有丹药 id（炼气 + 炼体）
    var neededIds = {};
    try {
      var qiReq = typeof getQiBreakthroughReqs === 'function' ? getQiBreakthroughReqs() : null;
      var qiNext = null;
      if (typeof BREAKTHROUGH_REQS !== 'undefined' && p.qiRealmIndex < 22) {
        qiNext = BREAKTHROUGH_REQS[p.qiRealmIndex + 1] || null;
      }
      [qiReq, qiNext].forEach(function(r){
        if (r && r.items) r.items.forEach(function(it){ if (it && it.id) neededIds[it.id] = true; });
      });
    } catch(e) {}
    try {
      var bodyReq = typeof getBodyBreakthroughReqs === 'function' ? getBodyBreakthroughReqs() : null;
      var bodyNext = null;
      if (typeof BODY_BREAKTHROUGH_REQS !== 'undefined' && p.bodyRealmIndex < 22) {
        bodyNext = BODY_BREAKTHROUGH_REQS[p.bodyRealmIndex + 1] || null;
      }
      [bodyReq, bodyNext].forEach(function(r){
        if (r && r.items) r.items.forEach(function(it){ if (it && it.id) neededIds[it.id] = true; });
      });
    } catch(e) {}
    
    // 不在当前/下一需求里 → 低于境界，过滤
    if (!neededIds[itemId]) return true;
    return false;
  } catch(e) { return false; }
}
window.shouldFilterPillDrop = shouldFilterPillDrop;

// ==========================
// 🗑️ 化神后固定垃圾装备不再拾取（掉落过滤）
// 🔧 2026-08-04：天机铃/汇灵戒/聚灵符/锈铁剑/清风剑/粗制兵器等
//    ITEM_DB 固定装备（无 _equipSlot/quality）化神后掉落直接不捡——
//    捡了也是卖/堆积，还刷屏。化神前正常拾取（新手有用）。
// ==========================
function shouldFilterJunkEquip(itemId) {
  try {
    var p = G.player;
    if (!p || !itemId) return false;
    // 仅化神（含）以上过滤
    if ((p.qiRealmIndex || 0) < 18) return false;
    var item = (typeof ITEM_DB !== 'undefined' ? ITEM_DB : []).find(function(i){ return i.id === itemId; });
    if (!item || item.category !== '装备') return false;
    // 有 _equipSlot 的掉落装备（品质装）不在此列
    if (item._equipSlot || item.quality) return false;
    // 无槽位/无品质 = 固定装备（初始/商店装）→ 化神后垃圾
    return true;
  } catch(e) { return false; }
}
window.shouldFilterJunkEquip = shouldFilterJunkEquip;

// ==========================
// 🚫 掉落统一过滤：丹药（低于境界/满10）+ 化神固定垃圾装备
// ==========================
function shouldFilterAutoDrop(itemId) {
  try {
    if (typeof shouldFilterPillDrop === 'function' && shouldFilterPillDrop(itemId)) return true;
    if (typeof shouldFilterJunkEquip === 'function' && shouldFilterJunkEquip(itemId)) return true;
    return false;
  } catch(e) { return false; }
}
window.shouldFilterAutoDrop = shouldFilterAutoDrop;

// ==========================
// 🎁 怪物掉落统一处理（秒杀路径也掉材料/装备）
// 🔧 2026-08-04：秒杀原本只给灵石修为，法宝材料（雷池精铁/云鲸脂/九阳灵髓）0掉落
//    → 化神秒杀天域怪，本命法宝温养/进阶材料不出。秒杀也走 drops 结算。
// ==========================
function processMonsterDrops(monster, isSweep) {
  try {
    var gained = [];
    if (!monster || !monster.drops || !G.player) return gained;
    (monster.drops || []).forEach(function(drop) {
      try {
        if (Math.random() >= (drop.chance || 0)) return;
        var qty = drop.qty || 1;
        if (drop.skillScroll && typeof learnSkillFromScroll === 'function') {
          learnSkillFromScroll(drop.skillScroll);
          gained.push(drop.skillScroll + '(功法)');
          return;
        }
        // 统一掉落过滤（低于境界丹/满10丹/化神固定垃圾装备）
        if (typeof shouldFilterAutoDrop === 'function' && shouldFilterAutoDrop(drop.itemId)) return;
        var itemData = (typeof ITEM_DB !== 'undefined' ? ITEM_DB : []).find(function(i){ return i.id === drop.itemId; });
        if (!itemData) return;
        if (typeof addItemToInventory === 'function') addItemToInventory(itemData, qty);
        gained.push(itemData.name + (qty > 1 ? '×' + qty : ''));
      } catch(e) {}
    });
    return gained;
  } catch(e) { return []; }
}
window.processMonsterDrops = processMonsterDrops;
