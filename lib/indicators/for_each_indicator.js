'use strict'

const { getIndicators } = require('../state')

require('../types/strategy')

/**
 * Call the provided function with each indicator on a strategy's state
 *
 * @memberOf module:Indicators
 *
 * @param {Strategy} strategy - the strategy to source indicators from
 * @param {Function} cb - callback, will be called with each indicator instance
 */
const forEachIndicator = (strategy, cb) => {
  const i = getIndicators(strategy)
  i.keySeq().forEach(id => cb(i.get(id)))
}

module.exports = forEachIndicator
