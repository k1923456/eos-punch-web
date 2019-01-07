const EOS = require("eosjs");

/**
 * to create eosjs instance
 * @param {string} chainId e.g. e70aaab8997e1dfce58fbfac80cbbb8fecec7b99cf982a9444273cbc64c41473
 * @param {string} httpEndpoint e.g. https://jungle2.cryptolions.io:443
 * @param {string|array:string} keyProvider key's private key
 * @param {string} authorization e.g. <account name>@active
 * @returns {object} a eosjs instance
 */
function createEosInstance(chainId, httpEndpoint, keyProvider, authorization) {
  return EOS({
    chainId,
    httpEndpoint,
    keyProvider,
    authorization,
  });
}

/**
 * account grant the permission to contract code
 * @param {object} eosInstance eosjs's instance, created by createEosInstance function
 * @param {string} accountName the account will grant contract the eosio.code permission
 * @param {string} activePublicKey the account's active key, not private key
 * @param {string} actor normally mean the contract name
 * @returns {promise} a transaction result
 */
function grantEosIOCodePermission(eosInstance, accountName, activePublicKey, actor) {
  const authority = {
    account: accountName,
    permission: 'active',
    parent: 'owner',
    auth: {
      threshold: 1,
      accounts: [
        {
          permission: {
            actor: actor,
            permission: "eosio.code"
          },
          weight: 1
        }
      ],
      keys: [
        {
          key: activePublicKey,
          weight: 1
        }
      ]
    }
  };

  return eosInstance.updateauth(authority);
}

/**
 * to get contract instance
 * @param {object} eosInstance eosjs's instance, created by createEosInstance function
 * @param {string} contractName contract name
 * @returns {promise} a contract instance
 */
function getContract(eosInstance, contractName) {
  return eosInstance.contract(contractName);
}

/**
 * to create transaction's action object
 * @param {string} contractName contract name
 * @param {string} actionName action name
 * @param {string} actor the account who will invoke contract's action
 * @param {string} permission e.g. <account name>@active
 * @param {object} data action method arguments, e.g. {from: '', to: '', quantity: '1.0000 EOS'}
 * @returns {object} a action object
 */
function createTransactionAction(contractName, actionName, actor, permission, data) {
  return ({
    account: contractName,
    name: actionName,
    authorization: [
      {
        actor,
        permission,
      },
    ],
    data,
  });
}

/**
 * to send a transaction
 * @param {object} eosInstance 
 * @param {object} actions action object created by createTransactionAction function
 * @returns {promise} a transaction result
 */
function sendTransaction(eosInstance, actions) {
  return eosInstance.transaction({
    actions,
  });
}

/**
 * to get contract's records
 * @param {object} eosInstance eosjs's instance, created by createEosInstance function
 * @param {string} code 
 * @param {string} scope 
 * @param {string} table 
 * @returns {promise} contract records
 */
function getTableRows(eosInstance, code, scope, table) {
  return eosInstance.getTableRows({
    json: true,
    code,
    scope,
    table,
    limit: 10000
  });
}

exports.createEosInstance = createEosInstance;
exports.grantEosIOCodePermission = grantEosIOCodePermission;
exports.getContract = getContract;
exports.createTransactionAction = createTransactionAction;
exports.sendTransaction = sendTransaction;
exports.getTableRows = getTableRows;
