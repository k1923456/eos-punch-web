const CONTRACT = 'santai333333';
const GAME_RECORDS_TABLE = 'users1';
const JACKPOT_TABLE = 'states1';

/**
 * to call EOS Punch smart contract and get betting results
 * @param {object} eosInstance instance of eosjs
 * @param {string} accountName player's account name
 * @param {number} quantity total transfer asset in this round
 * @param {string} playerPunches e.g. '12312', 1 = paper, 2 = scissor, 3 = stone
 * @returns {promise} transaction
 */
export function apiBetPunch(eosInstance, accountName, quantity, playerPunches) {
  const strQty = quantity.toString();
  const assets = strQty.indexOf('.') !== -1 ? `${strQty.padEnd(6, '0')} EOS` : `${strQty}.0000 EOS`;
  return eosInstance.transfer(accountName, CONTRACT, assets, playerPunches);
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

export function apiPostTransactionToGameContract(eosInstance, from, quantity, memo) {
  const strQty = quantity.toString();
  const assets = strQty.indexOf('.') !== -1 ? `${strQty.padEnd(6, '0')} EOS` : `${strQty}.0000 EOS`;

  return eosInstance.transaction({
    actions: [
      {
        account: 'eosio.token',
        name: 'transfer',
        authorization: [{
          actor: from,
          permission: 'active',
        }],
        data: {
          from,
          to: CONTRACT,
          quantity: assets,
          memo,
        }
      }
    ]
  });
}

export function apiFetchAccountInfo(eosInstance, accountName) {
  return eosInstance.getAccount(accountName);
}
