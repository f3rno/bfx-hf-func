'use strict'

const indicatorAcceptsTrades = require('./indicator_accepts_trades')

/**
 * Advance an indicator with a new trade data point
 *
 * @memberOf module:Indicators
 * @see module:Indicators.updateIndicators
 * @private
 *
 * @param {Indicator} i - indicator
 * @param {Trade} trade - trade data point
 */
const addTradeForIndicator = (i, trade) => {
  if (!indicatorAcceptsTrades(i)) {
    return
  }

  i.add(trade.price)
}

module.exports = addTradeForIndicator
