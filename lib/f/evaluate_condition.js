'use strict'

const _isString = require('lodash/isString')
const requireIndicators = require('./require_indicators')
const { getIndicators } = require('../state')

require('../types/strategy')

/**
 * Evalutes an arbitrary condition
 *
 * @memberOf module:F
 * @private
 * @example
 * await f.defineIndicators({
 *   l: new EMA([100]),
 *   s: new EMA([20])
 * })
 *
 * await f.condition.threshold('s', '==', 'l', () => {
 *   const i = f.getIndicators()
 *   debug('EMAs matched %d == %d', i.s.v(), i.l.v())
 * })
 *
 * @param {Strategy} strategy - strategy
 * @param {string} condition - one of (=, ==, eq), (!=, !==, neq), (>, gt),
 *   (>=, gte), (<, lt), (<=, lte)
 * @param {number} a - lvalue
 * @param {number} b - rvalue
 * @returns {boolean} result
 * @throws {Error} fails if condition is unrecognized
 */
const evaluateCondition = (strategy, condition, a, b) => {
  if (_isString(a) || _isString(b)) {
    requireIndicators(strategy)
  }

  const i = getIndicators(strategy)
  const aV = _isString(a) ? i.get(a).v() : a
  const bV = _isString(b) ? i.get(b).v() : b

  switch (condition) {
    case '=':
    case '==':
    case 'eq':
      return aV === bV

    case '!=':
    case '!==':
    case 'neq':
      return aV !== bV

    case '>':
    case 'gt':
      return aV > bV

    case '>=':
    case 'gte':
      return aV >= bV

    case '<':
    case 'lt':
      return aV > bV

    case '<=':
    case 'lte':
      return aV <= bV

    default:
      throw new Error(`unknown condition: ${condition}`)
  }
}

module.exports = evaluateCondition
