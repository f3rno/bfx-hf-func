'use strict'

const indicatorAcceptsTrades = require('./indicator_accepts_trades')

/**
 * Update an indicator's last value with a trade data point.
 *
 * @memberOf module:Indicators
 * @see module:Indicators.updateIndicators
 * @private
 *
 * @param {Indicator} i - indicator
 * @param {Trade} trade - trade data point
 */
const updateTradeForIndicator = (i, trade) => {
  if (!indicatorAcceptsTrades(i)) {
    return
  }

  i.update(trade.price)
}

module.exports = updateTradeForIndicator
