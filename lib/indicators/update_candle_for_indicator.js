'use strict'

const indicatorAcceptsCandles = require('./indicator_accepts_candles')

/**
 * Update an indicator's last value with a candle
 *
 * @memberOf module:Indicators
 * @see module:Indicators.updateIndicators
 * @private
 *
 * @param {Indicator} i - indicator
 * @param {Candle} candle - candle data point
 */
const updateCandleForIndicator = (i, candle) => {
  if (!indicatorAcceptsCandles(i)) {
    return
  }

  const dk = i.getDataKey()
  i.update(dk === '*' ? candle : candle[dk])
}

module.exports = updateCandleForIndicator
