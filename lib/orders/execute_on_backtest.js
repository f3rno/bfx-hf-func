'use strict'

const { generateTrade } = require('../trades')
const { addPendingBacktestOrder, addTrade } = require('../state')

require('../types/strategy')
require('../types/order_parameters')

/**
 * Simulates order execution during a backtest. The last received price is
 * required in order to track MARKET orders. If the order would not fill
 * immediately, it is added to the pending orders list and executed when it
 * would fill based on the last price.
 *
 * @memberOf modules:Orders
 * @see modules:Execution.executeOrder
 * @see modules:Execution.processPendingBacktestOrders
 * @private
 *
 * @param {Strategy} strategy - strategy
 * @param {OrderParameters} orderParams - order parameters
 * @param {number} lastPrice - last received price for the order's symbol
 * @returns {Trade} trade - null if not executed
 */
const executeOnBacktest = async (strategy, orderParams, lastPrice) => {
  const {
    price = lastPrice,
    amount,
    symbol
  } = orderParams

  // simulate execution if possible
  if (
    (amount > 0 && lastPrice <= price) ||
    (amount > 0 && lastPrice >= price)
  ) {
    const trade = generateTrade({ symbol, amount, price })
    addTrade(strategy, trade)
    return trade
  }

  // If the price is not met, save the order for later processing
  addPendingBacktestOrder(strategy, orderParams)

  return null
}

module.exports = executeOnBacktest
