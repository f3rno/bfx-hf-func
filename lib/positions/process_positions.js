'use strict'

const { Position } = require('bfx-api-node-models')
const { getPositions } = require('../state')
const { execute } = require('../orders')

require('../types/strategy')

/**
 * Evaluates target/stop conditions for open positions and executes orders to
 * fulfill them if met.
 *
 * @memberOf module:Positions
 * @private
 *
 * @param {Strategy} strategy - strategy
 * @param {number} lastPrice - last trade/candle price, used for tracking
 *   MARKET orders on backtests where order confirmation (execution price) is
 *   not available
 * @return {Promise} p
 */
const processPositions = async (strategy, lastPrice) => {
  const positions = getPositions(strategy)
  const symbols = positions.keySeq()

  // TODO: extract loop contents
  for (let i = 0; i < symbols.length; i++) {
    const position = positions.get(symbols.get(i))
    const amount = position.get('amount')
    const target = position.get('target')
    const stop = position.get('stop')
    const orderParams = new Position(position.toJS()).orderToClose()

    let targetMet = false
    let stopMet = false

    if (
      (amount < 0 && lastPrice >= target) ||
      (amount > 0 && lastPrice <= target)
    ) {
      targetMet = true
    }

    if (
      (amount < 0 && lastPrice <= stop) ||
      (amount > 0 && lastPrice >= stop)
    ) {
      stopMet = true
    }

    if (targetMet || stopMet) {
      await execute(strategy, orderParams, lastPrice)
    }
  }
}

module.exports = processPositions
