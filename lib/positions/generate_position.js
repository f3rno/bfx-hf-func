'use strict'

const { Map, List } = require('immutable')

require('../types/position')

/**
 * Generate a position Map from a tade
 *
 * @memberOf module:Positions
 * @see module:Trades.generateTrade
 * @private
 *
 * @param {Trade} trade - the trade that opened the position
 * @param {object} [params] - parameters
 * @param {number} [params.target] - target price to trigger position close
 * @param {number} [params.stop] - stop price to trigger positoin close
 * @returns {Position} position
 */
const generatePosition = (trade, { target, stop } = {}) => {
  const { mts, symbol, amount, price } = trade

  return Map({
    trades: List([trade]),
    basePrice: price,
    symbol,
    amount,
    target,
    stop,
    mts
  })
}

module.exports = generatePosition
