'use strict'

const indicatorAcceptsCandles = require('./indicator_accepts_candles')

/**
 * Advance an indicator with a new candle data point
 *
 * @memberOf module:Indicators
 * @see module:Indicators.updateIndicators
 * @private
 *
 * @param {Indicator} i - indicator
 * @param {Candle} candle - candle
 */
const addCandleForIndicator = (i, candle) => {
  if (!indicatorAcceptsCandles(i)) {
    return
  }

  const dk = i.getDataKey()
  i.add(dk === '*' ? candle : candle[dk])
}

module.exports = addCandleForIndicator
