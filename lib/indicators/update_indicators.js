'use strict'

const { withinLastCandle } = require('../util')
const forEachIndicator = require('./for_each_indicator')
const updateTradeForIndicator = require('./update_trade_for_indicator')
const addTradeForIndicator = require('./add_trade_for_indicator')
const updateCandleForIndicator = require('./update_candle_for_indicator')
const addCandleForIndicator = require('./add_candle_for_indicator')

require('../types/strategy')

/**
 * Add a data point to all strategy indicators, supporting either a trade or
 * candle. The timestamp is used to decide if the indicator should be updated
 * or advanced.
 *
 * @memberOf module:Indicators
 * @private
 *
 * @param {Strategy} strategy - instance to update
 * @param {object} data - data point
 * @param {Candle} [data.candle] - candle data point
 * @param {Trade} [data.trade] - trade data point
 * @returns {Promise} p
 */
const updateIndicators = async (strategy, data) => {
  const { candle, trade } = data

  if (!candle && !trade) {
    return // prevent needless pending promise evaluation below
  }

  if (trade) {
    const sameCandle = withinLastCandle(strategy, trade.mts)

    forEachIndicator(strategy, (i) => {
      const applyTrade = sameCandle
        ? updateTradeForIndicator
        : addTradeForIndicator

      applyTrade(i, trade)
    })
  }

  if (candle) {
    const sameCandle = withinLastCandle(strategy, candle.mts)

    forEachIndicator(strategy, (i) => {
      const applyCandle = sameCandle
        ? updateCandleForIndicator
        : addCandleForIndicator

      applyCandle(i, candle)
    })
  }
}

module.exports = updateIndicators
