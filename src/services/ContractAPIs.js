const CONTRACT = 'jimmy2jungle';
const GAME_RECORDS_TABLE = '';

/**
 * to call EOS Punch smart contract and get betting results
 * @param {object} eosInstance instance of eosjs
 * @param {string} accountName player's account name
 * @param {string} quantity total transfer asset in this round, e.g. '1.0000 EOS'
 * @param {string} playerPunches e.g. '12312', 1 = paper, 2 = scissor, 3 = stone
 * @returns {promise} transaction
 */
export function apiBetPunch(eosInstance, accountName, quantity, playerPunches) {
  return eosInstance.transfer(accountName, CONTRACT, quantity, playerPunches);
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

