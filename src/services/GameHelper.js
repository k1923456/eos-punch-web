const HUMAN_PUNCH_DICTIONARY = {
  ['1']: 'paper',
  ['2']: 'scissor',
  ['3']: 'stone'
};
const CONTRACT_PUNCH_DICTIONARY = {
  ['paper']: '1',
  ['scissor']: '2',
  ['stone']: '3'
};
const CONTRACT_BET_RESULT_DICTIONARY = {
  ['0']: 'draw',
  ['1']: 'win',
  ['-1']: 'lose',
};
const HUMAN_BET_RESULT_DICTIONARY = {
  ['draw']: '0',
  ['win']: '1',
  ['lose']: '-1',
};
const PUNCH_BATTLE_DICTIONARY = {
  ['scissor']: {
    ['scissor']: 'draw',
    ['paper']: 'win',
    ['stone']: 'lose',
  },
  ['paper']: {
    ['scissor']: 'lose',
    ['paper']: 'draw',
    ['stone']: 'win',
  },
  ['stone']: {
    ['scissor']: 'win',
    ['paper']: 'lose',
    ['stone']: 'draw',
  },
}

/**
 * to find the next field's index, if all fields have been selected, than return -1
 * @param {array} games 
 * @returns {number}
 */
export function getNextBetFieldIndex(games, role = 'player') {
  const leftGames = games.filter(game => game[role] === '');
  if (!leftGames) {
    return -1;
  }

  const id = leftGames.map(game => game.id).sort()[0];
  return games.findIndex(game => game.id === id);
}

/**
 * to get a random punch
 */
export function getRandomPunch() {
  const punches = ['scissor', 'stone', 'paper'];
  return punches[Math.floor(Math.random() * punches.length)];
}

/**
 * translate punches data format
 * @param {string} flag translation type, to human or to contract API
 * @param {string} data input data, e.g. to api should be 'scissor,paper,stone,scissor,paper'; to human should be '12312'
 * @returns {array:string} punches
 */
export function translatePunches(flag, data) {
  switch (flag) {
    case 'human':
      return translateToHuman(data);
    case 'api':
      return translateToAPI(data);
    default:
      return [];
  }
}

/**
 * translate punches data to human
 * @param {string} punches input data, e.g. '12312'
 * @returns {array:string} punches
 */
function translateToHuman(punches) {
  return punches.split('').map(punch => HUMAN_PUNCH_DICTIONARY[punch]);
}

/**
 * translate punches data to contract api
 * @param {string} punches input data, e.g. 'scissor,paper,stone,scissor,paper'
 * @returns {array:string} punches
 */
function translateToAPI(punches) {
  return punches.split(',').map(punch => CONTRACT_PUNCH_DICTIONARY[punch]);
}

/**
 * translate contract bet result to web app
 * @param {number} state bet result, win, lose or draw.
 */
function translateContractBetStateToWeb (state) {
  return CONTRACT_BET_RESULT_DICTIONARY[state];
}

export function calculatePriseValue(result, betValue) {
  switch(result) {
    case 'win':
      return betValue;
    case 'lose':
      return betValue * -1;
    case 'draw':
      return (Math.floor((betValue * 0.1) * 100) / 100) * -1;
  }
}

export function transformGameRecords(rawData, playerPunches, betValue) {
  const { round, } = rawData;
  const data = round.reduce((acc, cur) => {
    acc.round.push({
      player: HUMAN_PUNCH_DICTIONARY[cur.playerPunch],
      banker: HUMAN_PUNCH_DICTIONARY[cur.bankerPunch],
      result: CONTRACT_BET_RESULT_DICTIONARY[cur.state],
      prise: cur.value,
    });
    acc.totalPrise += cur.value;
    return acc;
  }, { round: [], totalPrise: 0 });
  return data;
}

export function localDevelop(rawData, playerPunches, betValue) {
  rawData.round = playerPunches.split(',').map(punch => {
    const banker = getRandomPunch();
    const playerPunch = CONTRACT_PUNCH_DICTIONARY[punch];
    const bankerPunch = CONTRACT_PUNCH_DICTIONARY[banker];
    const result = PUNCH_BATTLE_DICTIONARY[punch][banker];
    const state = HUMAN_BET_RESULT_DICTIONARY[result];
    const value = calculatePriseValue(result, betValue);

    return ({
      playerPunch,
      bankerPunch,
      state,
      value,
    });
  });
}

/**
 * 1 eos is equal 10,000 in eos smart contract
 * @param {number} value number from contract
 */
export function contractNumberTranslate(value) {
  return value / 10000;
}

export function generateResetDataObject() {
  return ({
    games: [
      {
        id: 0,
        player: '',
        banker: '',
        result: '',
        prise: 0,
      },
      {
        id: 1,
        player: '',
        banker: '',
        result: '',
        prise: 0,
      },
      {
        id: 2,
        player: '',
        banker: '',
        result: '',
        prise: 0,
      },
      {
        id: 3,
        player: '',
        banker: '',
        result: '',
        prise: 0,
      },
      {
        id: 4,
        player: '',
        banker: '',
        result: '',
        prise: 0,
      },
    ],
    selectedIndex: 0,
    errorMessage: '',
    isGameOver: false,
    isAllSelected: false,
    isBankerPunchDone: false,
    isRevealed: false,
    isAutoBetting: false,
    isRevealing: false,
    isShowErrorMessage: false,
  });
}

