'use strict'

const withinLastCandle = require('./within_last_candle')
const priceForData = require('./price_for_data')
const symbolForData = require('./symbol_for_data')

/**
 * Utility functions
 *
 * @module Utility
 */
module.exports = {
  withinLastCandle,
  symbolForData,
  priceForData
}
