'use strict'

/**
 * WIP
 *
 * @memberOf modules:Orders
 * @see modules:Execution.executeOrder
 * @see modules:Execution.processPendingBacktestOrders
 * @private
 *
 * @param {Strategy} strategy - strategy
 * @param {OrderParameters} orderParams - order parameters
 * @returns {Promise} p
 */
const executeLive = async (strategy, orderParams) => {
  throw new Error('live execution is WIP')
}

module.exports = executeLive
