'use strict'

const addCandleForIndicator = require('./add_candle_for_indicator')
const addTradeForIndicator = require('./add_trade_for_indicator')
const forEachIndicator = require('./for_each_indicator')
const indicatorAcceptsCandles = require('./indicator_accepts_candles')
const indicatorAcceptsTrades = require('./indicator_accepts_trades')
const updateCandleForIndicator = require('./update_candle_for_indicator')
const updateIndicators = require('./update_indicators')
const updateTradeForIndicator = require('./update_trade_for_indicator')

/**
 * Indicator access and manipulation functions
 *
 * @module Indicators
 */
module.exports = {
  addCandleForIndicator,
  addTradeForIndicator,
  indicatorAcceptsCandles,
  forEachIndicator,
  indicatorAcceptsTrades,
  updateCandleForIndicator,
  updateIndicators,
  updateTradeForIndicator
}
