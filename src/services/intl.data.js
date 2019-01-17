const INTL_DATA = {
  ['header.leave']: {
    tw: '離開',
    cn: '离开',
  },
  ['how-to-play.headline']: {
    tw: '怎麼玩',
    cn: '怎么玩',
  },
  ['footer.auto-bet']: {
    tw: '自動下注',
    cn: '自动下注',
  },
  ['footer.bet-value']: {
    tw: '單注金額',
    cn: '单注金额',
  },
  ['footer.confirm']: {
    tw: '出拳',
    cn: '出拳',
  },
  ['picker.bet-value']: {
    tw: '當前單注金額',
    cn: '当前单注金额',
  },
  ['picker.complete']: {
    tw: '完成',
    cn: '完成',
  },
  ['panel.jackpot']: {
    tw: '彩池獎金',
    cn: '彩池奖金',
  },
  ['panel.settlement.win']: {
    tw: '勝',
    cn: '胜',
  },
  ['panel.settlement.lose']: {
    tw: '輸',
    cn: '输',
  },
  ['panel.settlement.draw']: {
    tw: '平',
    cn: '平',
  },
  ['panel.settlement.prise']: {
    tw: '淨利獎金',
    cn: '净利奖金',
  },
  ['panel.bet-field.title']: {
    tw: '注',
    cn: '注',
  },
  ['panel.bet-field.player']: {
    tw: '請選擇',
    cn: '请选择',
  },
  ['panel.reset']: {
    tw: '清空',
    cn: '清空',
  },
  ['panel.random']: {
    tw: '隨機',
    cn: '随机',
  },
  ['reveal.headline']: {
    tw: '本局結算',
    cn: '本局结算',
  },
  ['reveal.title.index']: {
    tw: '注別',
    cn: '注别',
  },
  ['reveal.title.player']: {
    tw: '你的',
    cn: '你的',
  },
  ['reveal.title.banker']: {
    tw: '莊的',
    cn: '庄的',
  },
  ['reveal.title.result']: {
    tw: '輸贏',
    cn: '输赢',
  },
  ['reveal.result.win']: {
    tw: '閒贏',
    cn: '闲赢',
  },
  ['reveal.result.lose']: {
    tw: '莊贏',
    cn: '庄赢',
  },
  ['reveal.result.draw']: {
    tw: '平局',
    cn: '平局',
  },
  ['reveal.result.total']: {
    tw: '總結算',
    cn: '总结算',
  },
  ['reveal.result.confirm']: {
    tw: '確定',
    cn: '确定',
  },
  ['system.auto-betting']: {
    tw: '自動下注中',
    cn: '自动下注中',
  },
  ['system.revealing']: {
    tw: '開獎中',
    cn: '开奖中',
  },
};

const LABELS = Object.keys(INTL_DATA);
const LANGUAGE_DATA = LABELS.reduce((data, label) => {
  Object.keys(INTL_DATA[label]).forEach(language => {
    if(!data[language]) {
      data[language] = {};
    }
    data[language][label] = INTL_DATA[label][language];
  });
  return data;
}, {});

export default function getMessage(local = 'tw') {
  return LANGUAGE_DATA[local];
}