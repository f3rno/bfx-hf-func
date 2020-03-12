'use strict'

const generateFunctions = require('./generate_functions')

/**
 * The core of the library, this module provides helper methods to be used by
 * strategies during live execution and backtesting for executing orders,
 * controlling the flow of execution, more.
 *
 * @module F
 * @example
 * const emasCrossed = ({ s, l }) => s.crossed(l.v())
 *
 * const strategy = async (f, data) => {
 *   await f.defineIndicators({
 *     l: new EMA([100]),
 *     s: new EMA([20])
 *   })
 *
 *   return f.condition.indicators(emasCrossed, async ({ s, l } = {}) => {
 *     const price = HFF.priceForData(data)
 *
 *     debug('indicators crossed: s:%f <-> l:%f', s.v(), l.v())
 *
 *     if (f.inPosition()) {
 *       return f.closePosition({ price })
 *     } else {
 *       return f.openPosition({ amount: 6, price })
 *     }
 *   })
 * }
 */
module.exports = {
  generateFunctions
}
