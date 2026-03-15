export interface HistoricalEvent {
  id: string;
  name: string;
  year: string;
  description: string;
  involvedFactions: string[];
  involvedCharacters: string[];
  choices: { id: string; text: string; consequence: string }[];
  difficulty: 'easy' | 'medium' | 'hard';
  type: 'battle' | 'diplomacy' | 'internal' | 'betrayal' | 'alliance';
}

export const events: HistoricalEvent[] = [
  {
    id: 'e01', name: '黄巾起义', year: '184年',
    description: '张角率太平道信众揭竿而起，头裹黄巾，席卷八州。朝廷震动，各地豪杰纷纷起兵勤王。乱世的序幕就此拉开。',
    involvedFactions: ['群雄'], involvedCharacters: ['caocao', 'liubei'],
    choices: [
      { id: 'e01_1', text: '率兵镇压黄巾，建功立业', consequence: '军功卓著，声望大增，获得朝廷封赏' },
      { id: 'e01_2', text: '招募义军，广纳贤才', consequence: '虽无大功，但积累了一批忠心追随者' },
      { id: 'e01_3', text: '静观其变，保存实力', consequence: '避免了损失，但错过了扬名立万的机会' },
    ],
    difficulty: 'easy', type: 'battle',
  },
  {
    id: 'e02', name: '董卓进京', year: '189年',
    description: '何进被杀，董卓趁乱率凉州铁骑入洛阳，废少帝立献帝，独揽朝政。朝野上下人心惶惶，天下诸侯蠢蠢欲动。',
    involvedFactions: ['群雄'], involvedCharacters: ['dongzhuo', 'caocao', 'lvbu', 'diaochan'],
    choices: [
      { id: 'e02_1', text: '刺杀董卓，匡扶汉室', consequence: '行动大胆但风险极高，失败则性命不保' },
      { id: 'e02_2', text: '逃离洛阳，号召天下讨董', consequence: '保全自身，为日后起兵奠定基础' },
      { id: 'e02_3', text: '暂时隐忍，在朝中暗中布局', consequence: '获取情报和人脉，但要忍受董卓暴政' },
    ],
    difficulty: 'medium', type: 'betrayal',
  },
  {
    id: 'e03', name: '十八路诸侯讨董卓', year: '190年',
    description: '曹操发矫诏，号召天下诸侯共讨董卓。十八路诸侯会盟于酸枣，推袁绍为盟主。虎牢关前，三英战吕布成为千古佳话。',
    involvedFactions: ['群雄', '魏', '蜀'], involvedCharacters: ['caocao', 'liubei', 'yuanshao', 'lvbu', 'guanyu', 'zhangfei'],
    choices: [
      { id: 'e03_1', text: '身先士卒，率军攻打虎牢关', consequence: '展现勇武，但可能损兵折将' },
      { id: 'e03_2', text: '联合其他诸侯，制定周密计划', consequence: '稳扎稳打，但联盟内部矛盾重重' },
      { id: 'e03_3', text: '趁乱扩张地盘，壮大自身势力', consequence: '实力增强，但可能被视为不义之举' },
    ],
    difficulty: 'medium', type: 'alliance',
  },
  {
    id: 'e04', name: '官渡之战', year: '200年',
    description: '袁绍率七十万大军南下，曹操仅七万兵力迎战。兵力悬殊，胜负难料。许攸来投，献计火烧乌巢。这是决定北方归属的关键一战。',
    involvedFactions: ['魏', '群雄'], involvedCharacters: ['caocao', 'yuanshao', 'guojia', 'xunyu'],
    choices: [
      { id: 'e04_1', text: '奇袭乌巢，烧毁袁绍粮草', consequence: '一战定乾坤，袁绍大败，北方归曹' },
      { id: 'e04_2', text: '坚守不出，以逸待劳', consequence: '消耗战拖延时间，但粮草也将耗尽' },
      { id: 'e04_3', text: '派使者议和，暂时休战', consequence: '避免决战风险，但袁绍未必同意' },
    ],
    difficulty: 'hard', type: 'battle',
  },
  {
    id: 'e05', name: '三顾茅庐', year: '207年',
    description: '刘备三次亲赴南阳卧龙岗，诚心请诸葛亮出山。诸葛亮感其诚意，献上"隆中对"，为刘备规划了三分天下的宏伟蓝图。',
    involvedFactions: ['蜀'], involvedCharacters: ['liubei', 'zhugeliang'],
    choices: [
      { id: 'e05_1', text: '诚心三顾，以礼相待', consequence: '得卧龙相助，如鱼得水，实力大增' },
      { id: 'e05_2', text: '派人送礼邀请，展示诚意', consequence: '可能请到，但缺少亲自拜访的诚意' },
      { id: 'e05_3', text: '另寻贤才，不必执着一人', consequence: '节省时间，但可能错过千古奇才' },
    ],
    difficulty: 'easy', type: 'diplomacy',
  },
  {
    id: 'e06', name: '赤壁之战', year: '208年',
    description: '曹操率八十万大军南下，欲一统天下。孙刘联军仅五万余人，退守赤壁。周瑜用火攻之计，借东风大破曹军。三分天下的格局由此奠定。',
    involvedFactions: ['魏', '蜀', '吴'], involvedCharacters: ['caocao', 'zhouyu', 'zhugeliang', 'liubei', 'sunquan'],
    choices: [
      { id: 'e06_1', text: '联合盟友，以火攻破敌', consequence: '大破曹军，奠定三分天下格局' },
      { id: 'e06_2', text: '正面迎战，以少胜多', consequence: '风险极大，但若胜则威名远播' },
      { id: 'e06_3', text: '暂避锋芒，退守后方', consequence: '保存实力，但失去战略主动权' },
    ],
    difficulty: 'hard', type: 'battle',
  },
  {
    id: 'e07', name: '刘备入蜀', year: '211年',
    description: '刘璋邀刘备入蜀抵御张鲁。刘备借此机会，在庞统、法正的辅佐下，反客为主，夺取益州，终于有了自己的根据地。',
    involvedFactions: ['蜀'], involvedCharacters: ['liubei', 'zhugeliang'],
    choices: [
      { id: 'e07_1', text: '接受邀请，伺机夺取益州', consequence: '获得富庶的益州，但背负不义之名' },
      { id: 'e07_2', text: '真心帮助刘璋，以德服人', consequence: '赢得仁义之名，但可能错失良机' },
      { id: 'e07_3', text: '拒绝邀请，另寻发展方向', consequence: '保持清白，但失去入蜀的绝佳机会' },
    ],
    difficulty: 'medium', type: 'diplomacy',
  },
  {
    id: 'e08', name: '汉中之战', year: '219年',
    description: '刘备与曹操争夺汉中。黄忠阵斩夏侯渊，刘备占据汉中，自称汉中王。蜀汉势力达到巅峰，关羽在荆州也发起了北伐。',
    involvedFactions: ['蜀', '魏'], involvedCharacters: ['liubei', 'caocao', 'zhaoyun'],
    choices: [
      { id: 'e08_1', text: '全力进攻，一鼓作气拿下汉中', consequence: '大胜曹军，声威大震，称汉中王' },
      { id: 'e08_2', text: '稳步推进，步步为营', consequence: '减少损失，但战事拖延' },
      { id: 'e08_3', text: '与曹操谈判，划分势力范围', consequence: '和平解决，但放弃了扩张机会' },
    ],
    difficulty: 'hard', type: 'battle',
  },
  {
    id: 'e09', name: '关羽大意失荆州', year: '219年',
    description: '关羽北伐襄樊，水淹七军，威震华夏。然而吕蒙白衣渡江，偷袭荆州。关羽腹背受敌，败走麦城，最终被东吴擒杀。',
    involvedFactions: ['蜀', '吴', '魏'], involvedCharacters: ['guanyu', 'sunquan', 'simayi'],
    choices: [
      { id: 'e09_1', text: '回师救荆州，放弃北伐战果', consequence: '可能保住荆州，但北伐功亏一篑' },
      { id: 'e09_2', text: '继续北伐，相信荆州守军', consequence: '若攻下襄樊则大局可定，但荆州危矣' },
      { id: 'e09_3', text: '派使者与东吴谈判，化解危机', consequence: '外交斡旋可能争取时间，但吕蒙未必停手' },
    ],
    difficulty: 'hard', type: 'betrayal',
  },
  {
    id: 'e10', name: '夷陵之战', year: '222年',
    description: '刘备为报关羽之仇，倾全国之力伐吴。陆逊坚守不战，待蜀军疲惫后火烧连营七百里。刘备大败，退守白帝城，蜀汉元气大伤。',
    involvedFactions: ['蜀', '吴'], involvedCharacters: ['liubei', 'sunquan'],
    choices: [
      { id: 'e10_1', text: '倾国之力伐吴，为关羽报仇', consequence: '义气可嘉，但可能遭遇惨败' },
      { id: 'e10_2', text: '听从劝谏，与吴重新结盟', consequence: '理智之选，保存蜀汉实力' },
      { id: 'e10_3', text: '小规模出兵，以战促和', consequence: '折中方案，但可能两头不讨好' },
    ],
    difficulty: 'hard', type: 'battle',
  },
  {
    id: 'e11', name: '诸葛亮北伐', year: '228年',
    description: '诸葛亮上《出师表》，率军北伐中原。六出祁山，与司马懿多次交锋。虽然屡有胜绩，但始终未能攻入关中，北伐大业功败垂成。',
    involvedFactions: ['蜀', '魏'], involvedCharacters: ['zhugeliang', 'simayi'],
    choices: [
      { id: 'e11_1', text: '采用魏延子午谷奇谋，直取长安', consequence: '风险极大，若成则一战定天下' },
      { id: 'e11_2', text: '稳扎稳打，步步蚕食', consequence: '安全但缓慢，粮草补给是大问题' },
      { id: 'e11_3', text: '联合东吴，两路夹击', consequence: '分散魏军兵力，但需要东吴配合' },
    ],
    difficulty: 'hard', type: 'battle',
  },
  {
    id: 'e12', name: '空城计', year: '228年',
    description: '马谡失守街亭，蜀军退路被断。诸葛亮身处西城，兵力空虚。面对司马懿十五万大军，诸葛亮大开城门，独坐城楼抚琴。',
    involvedFactions: ['蜀', '魏'], involvedCharacters: ['zhugeliang', 'simayi'],
    choices: [
      { id: 'e12_1', text: '大开城门，以空城计退敌', consequence: '若对方多疑则可退敌，若识破则全军覆没' },
      { id: 'e12_2', text: '率残兵死守，等待援军', consequence: '以少敌多，凶多吉少' },
      { id: 'e12_3', text: '弃城撤退，保存有生力量', consequence: '安全撤退，但丢失战略要地' },
    ],
    difficulty: 'hard', type: 'diplomacy',
  },
  {
    id: 'e13', name: '五丈原', year: '234年',
    description: '诸葛亮最后一次北伐，与司马懿对峙于五丈原。司马懿坚守不出，诸葛亮积劳成疾，病逝于军中。"出师未捷身先死，长使英雄泪满襟。"',
    involvedFactions: ['蜀', '魏'], involvedCharacters: ['zhugeliang', 'simayi'],
    choices: [
      { id: 'e13_1', text: '拼死一战，毕其功于一役', consequence: '以命相搏，或许能创造奇迹' },
      { id: 'e13_2', text: '设计引诱司马懿出战', consequence: '智谋对决，但身体已经支撑不住' },
      { id: 'e13_3', text: '安排后事，有序撤军', consequence: '保全蜀军，为蜀汉延续国祚' },
    ],
    difficulty: 'hard', type: 'battle',
  },
  {
    id: 'e14', name: '高平陵之变', year: '249年',
    description: '司马懿趁曹爽陪魏帝出城祭祀之机，发动政变，控制洛阳。曹爽犹豫不决，最终投降被杀。司马家族从此掌控曹魏大权。',
    involvedFactions: ['魏'], involvedCharacters: ['simayi'],
    choices: [
      { id: 'e14_1', text: '果断发动政变，一举夺权', consequence: '成功则大权在握，失败则万劫不复' },
      { id: 'e14_2', text: '继续隐忍，等待更好时机', consequence: '安全但可能再无如此良机' },
      { id: 'e14_3', text: '联合朝中大臣，以合法手段夺权', consequence: '名正言顺，但过程漫长且不确定' },
    ],
    difficulty: 'hard', type: 'betrayal',
  },
  {
    id: 'e15', name: '三国归晋', year: '280年',
    description: '司马炎代魏建晋后，发兵灭吴。吴主孙皓投降，三国归于一统。近百年的分裂终于结束，但新的乱世也在酝酿之中。',
    involvedFactions: ['魏', '吴'], involvedCharacters: ['simayi', 'sunquan'],
    choices: [
      { id: 'e15_1', text: '顺应天命，接受统一', consequence: '天下太平，百姓安居乐业' },
      { id: 'e15_2', text: '拼死抵抗，誓不投降', consequence: '虽败犹荣，但生灵涂炭' },
      { id: 'e15_3', text: '谈判求和，保全宗族', consequence: '保住性命和家族，但失去一切权力' },
    ],
    difficulty: 'medium', type: 'battle',
  },
];
