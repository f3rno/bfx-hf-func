'use strict'

const { hasIndicators } = require('../state')

require('../types/strategy')

/**
 * Require indicator configuration on the provided strategy
 *
 * @memberOf module:F
 * @private
 *
 * @param {Strategy} strategy - strategy
 * @throws {Error} fails if the strategy has no configured indicators
 */
const requireIndicators = (strategy) => {
  if (!hasIndicators(strategy)) {
    throw new Error('strategy has no indicators, cannot await indicator event')
  }
}

module.exports = requireIndicators
