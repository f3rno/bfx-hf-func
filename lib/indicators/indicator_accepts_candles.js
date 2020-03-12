'use strict'

const _includes = require('lodash/includes')

/**
 * Query if an indicator can be updated with candles
 *
 * @memberOf module:Indicators
 * @private
 *
 * @param {Indicator} i - indicator
 * @returns {boolean} acceptsCandles
 */
const indicatorAcceptsCandles = (i) => (
  _includes(['*', 'candle'], i.getDataType())
)

module.exports = indicatorAcceptsCandles
