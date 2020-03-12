'use strict'

const { List } = require('immutable')
const { getState, updateState } = require('../state')
const { executeOrder } = require('../orders')
const { priceForData, symbolForData } = require('../util')
const debug = require('debug')('bfx:hf:func:exec:process-pending-orders')

require('../types/strategy')

/**
 * Flushes pending orders that can execute given the last receievd price
 *
 * @memberOf module:Execution
 * @see module:Orders.executeOnBacktest
 * @private
 *
 * @param {Strategy} strategy - strategy
 * @param {object} data - last recevied data point
 * @param {Trade} [data.trade] - last received trade
 * @param {Trade} [data.candle] - last received candle
 * @return {Promise} p
 */
const processPendingBacktestOrders = async (strategy, data = {}) => {
  const symbol = symbolForData(data)
  const price = priceForData(data)
  const allPendingOrders = getState(strategy).get('backtestPendingOrders')
  let pendingOrders = allPendingOrders.get(symbol) || List()

  for (let i = pendingOrders.size - 1; i >= 0; i -= 1) {
    const order = pendingOrders.get(i)
    const orderAmount = order.get('amount')
    const orderPrice = order.get('price')

    if (
      (orderAmount > 0 && price < orderPrice) ||
      (orderAmount < 0 && price > orderPrice)
    ) {
      debug('flushing pending order on %s, price met (%f)', symbol, price)

      await executeOrder(strategy, order, price)
      pendingOrders = pendingOrders.splice(i, 1)
    }
  }

  updateState(
    strategy, 'backtestPendingOrders', allPendingOrders.set(symbol, pendingOrders)
  )
}

module.exports = processPendingBacktestOrders
