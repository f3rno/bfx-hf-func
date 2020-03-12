'use strict'

const { Map } = require('immutable')
const _isFinite = require('lodash/isFinite')

/**
 * Generates a trade Map that can be saved on a strategy state, and included
 * in execution results processing.
 *
 * @memberOf module:Trades
 * @private
 *
 * @param {object} trade - trade data
 * @param {number|Date} [trade.mts] - timestamp
 * @param {number} trade.amount - amount
 * @param {number} trade.price - execution price
 * @param {string} trade.symbol - symbol
 * @returns {Map} trade
 */
const generateTrade = ({
  mts = Date.now(),
  amount,
  price,
  symbol
} = {}) => {
  if (!_isFinite(price)) {
    throw new Error('price required for tracking MARKET orders on backests')
  }

  const nv = amount * price

  return Map({
    mts: +mts,
    symbol,
    amount,
    price,
    nv
  })
}

module.exports = generateTrade
