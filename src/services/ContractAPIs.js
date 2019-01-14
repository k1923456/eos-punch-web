const CONTRACT = 'santai123123';
const GAME_RECORDS_TABLE = 'users';
const JACKPOT_TABLE = 'states';

/**
 * to call EOS Punch smart contract and get betting results
 * @param {object} eosInstance instance of eosjs
 * @param {string} accountName player's account name
 * @param {string} quantity total transfer asset in this round
 * @param {string} playerPunches e.g. '12312', 1 = paper, 2 = scissor, 3 = stone
 * @returns {promise} transaction
 */
export function apiBetPunch(eosInstance, accountName, quantity, playerPunches) {
  const asset = quantity.indexOf('.') !== -1 ? quantity.padEnd(3, '0') : `${quantity}.0000`;
  return eosInstance.transfer(accountName, CONTRACT, `${asset} EOS`, playerPunches);
}

/**
 * to fetch game records
 * @param {object} eosInstance instance of eosjs
 * @returns {promise} records
 */
export function apiFetchGameRecords(eosInstance) {
  return eosInstance.getTableRows({
    json: true, 
    code: CONTRACT, 
    table: GAME_RECORDS_TABLE, 
    scope: CONTRACT
  });
}

export function apiJackpot(eosInstance) {
  return eosInstance.getTableRows({
    json: true, 
    code: CONTRACT, 
    table: JACKPOT_TABLE, 
    scope: CONTRACT
  });
}

