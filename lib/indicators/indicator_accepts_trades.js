'use strict'

const _includes = require('lodash/includes')

/**
 * Query if an indicator can be updated with trades
 *
 * @memberOf module:Indicators
 * @private
 *
 * @param {Indicator} i - indicator
 * @returns {boolean} acceptsTrades
 */
const indicatorAcceptsTrades = (i) => (
  _includes(['*', 'trade'], i.getDataType())
)

module.exports = indicatorAcceptsTrades
