'use strict'

const { isBacktesting } = require('../state')
const executeOnBacktest = require('./execute_on_backtest')
const executeLive = require('./execute_live')

require('../types/strategy')
require('../types/order_parameters')

/**
 * Executes an order; the last known price is required to track MARKET orders
 * during backtests.
 *
 * @memberOf module:Orders
 * @see module:Order.executeOnBacktest
 * @see module:Order.executeLive
 *
 * @param {Strategy} strategy - strategy
 * @param {OrderParameters} orderParams - order parameters
 * @param {number} lastPrice - used to track MARKET orders on backtests
 * @return {Promise} p
 */
const executeOrder = async (strategy, orderParams, lastPrice) => {
  // TODO: order param validation

  if (isBacktesting(strategy)) {
    return executeOnBacktest(strategy, orderParams, lastPrice)
  } else {
    return executeLive(strategy, orderParams)
  }
}

module.exports = executeOrder
