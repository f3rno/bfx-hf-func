'use strict'

const { Map } = require('immutable')
const _isFinite = require('lodash/isFinite')

const evaluateCondition = require('./evaluate_condition')
const requireIndicators = require('./require_indicators')
const { BreakExecutionStepError } = require('../errors')
const { generatePosition } = require('../positions')
const { generateTrade } = require('../trades')
const { doError } = require('../util')
const {
  getDefaultSymbol, hasIndicators, getIndicators, updateState, getPosition,
  isBacktesting, getPositions, getLastPrice, addTrade, addHistoricalPosition
} = require('../state')

require('../types/indicator')

/**
 * Generates the F helper object for a strategy instance
 *
 * @memberOf module:F
 *
 * @param {Strategy} strategy - the strategy to configure the helpers for
 * @returns {F} f
 */
const generateFunctions = (strategy) => {
  const f = {}

  /**
   * Makes the provided indicators object an immutable Map and attaches it to
   * the strategy for usage with other functions. The indicators will be
   * automatically updated throughout the lifecycle of the function as new
   * data points arrive.
   *
   * @memberOf module:F
   * @example
   * await f.defineIndicators({
   *   l: new EMA([100]),
   *   s: new EMA([20])
   * })
   *
   * @param {object<Indicator>} indicators - key'ed by ID
   */
  f.defineIndicators = (indicators) => {
    if (!hasIndicators(strategy)) {
      updateState(strategy, 'indicators', Map({ ...indicators }))
      updateState(strategy, 'hasIndicators', true)

      throw new BreakExecutionStepError('defined indicators')
    }
  }

  f.breakIf = {}

  /**
   * Helper to terminate execution early on the current update cycle if the
   * provided condition callback returns true.
   *
   * @memberOf module:F
   * @example
   * await f.defineIndicators({
   *   l: new EMA([100]),
   *   s: new EMA([20])
   * })
   *
   * await f.breakIf.indicators(({ s, l }) => s.crossed(l.v()))
   *
   * @param {Function} condition - should return true when control flow should
   *   break, can by async
   * @throws {Error} fails if the strategy does not have indicators configured
   */
  f.breakIf.indicators = async (condition) => {
    requireIndicators(strategy)

    const v = await condition(getIndicators(strategy).toJS())

    if (v) {
      throw new BreakExecutionStepError('awaiting indicator event')
    }
  }

  f.condition = {}

  /**
   * Helper to execute a callback when a condition operating on the indicator
   * map is met.
   *
   * @memberOf module:F
   * @example
   * return f.condition.indicators(({ s, l }) => s.crossed(l.v()), async ({ s, l } = {}) => {
   *   debug('indicators crossed: s:%f <-> l:%f', s.v(), l.v())
   *
   *   if (f.inPosition()) {
   *     return f.closePosition()
   *   } else {
   *     return f.openPosition({ amount: 6 })
   *   }
   * })
   *
   * @param {Function} condition - async condition operating on indicators
   * @param {Function} cb - executed when the condition is truthy
   * @return {Promise} p - resolves after evaluation/potential execution
   */
  f.condition.indicators = async (condition, cb) => {
    requireIndicators(strategy)

    const indicators = getIndicators(strategy).toJS()
    const v = await condition(indicators)

    if (v) {
      await cb(indicators)
    }
  }

  // TOOD: extract

  /**
   * Calls the provided callback if the condition defined between the specified
   * indicator and value is met.
   *
   * @memberOf module:F
   * @see module:F.evaluateCondition
   * @example
   * await f.defineIndicators({
   *   l: new EMA([100]),
   *   s: new EMA([20])
   * })
   *
   * await f.condition.threshold('s', '>', 0.91, () => {
   *   // ...
   * })
   *
   * await f.condition.threshold('s', '=', 'l', () => {
   *   // ...
   * })
   *
   * @param {string} indicatorID - ID of indicator to evaluate
   * @param {string} condition - =, !=, >, >=, <, or <= (see reference)
   * @param {number} value - value
   * @param {Function} cb - called if condition is met
   * @returns {Promise} p - resolves on condition failure or callback completion
   *
   */
  f.condition.threshold = async (indicatorID, condition, value, cb) => {
    requireIndicators(strategy)

    const i = getIndicators(strategy).get(indicatorID)

    if (!i) {
      throw new Error(`no such indicator with ID: ${indicatorID}`)
    }

    const v = evaluateCondition(strategy, condition, i.v(), value)

    if (v) {
      await cb()
    }
  }

  /**
   * Utility to get the strategy's indicators as a POJO object, key'ed by ID
   *
   * @memberOf module:F
   *
   * @returns {object} indicators
   */
  f.getIndicators = () => getIndicators(strategy).toJS()

  /**
   * Query if strategy is currently in a position for the specified symbol.
   *
   * @memberOf module:F
   *
   * @param {string} [symbol] - defaults to default symbol
   * @returns {boolean} inPosition
   */
  f.inPosition = (symbol = getDefaultSymbol(strategy)) => {
    return !!getPosition(strategy, symbol)
  }

  /**
   * Get the position for the specified symbol, if it exists
   *
   * @memberOf module:F
   *
   * @param {string} [symbol] - defaults to default strategy symbol
   * @returns {Map} position
   */
  f.getPosition = (symbol = getDefaultSymbol(strategy)) => {
    return getPosition(strategy, symbol)
  }

  /**
   * Close an open position by symbol
   *
   * @memberOf module:F
   *
   * @param {string} [symbol] - position symbol
   * @throws {Error} fails if no position is open for the symbol and executing
   *   a backtest. Will only log an error during live execution.
   */
  f.closePosition = async (symbol = getDefaultSymbol(strategy)) => {
    const position = getPosition(strategy, symbol)

    if (!position) {
      return doError(`position not open for symbol: ${symbol}`)
    }

    if (!isBacktesting(strategy)) {
      throw new Error('live positions are WIP')
    }

    const price = getLastPrice(strategy, symbol)
    const positions = getPositions(strategy)
    const amount = position.get('amount') * -1
    const trade = generateTrade({ symbol, amount, price })

    updateState(strategy, 'positions', positions.delete(symbol))
    addHistoricalPosition(strategy, position)
    addTrade(strategy, trade)
  }

  /**
   * Open a position on the specified symbol for the specified amount. Supports
   * declaring a price target and stop-loss, which are triggered automatically
   * as part of the strategy execution cycle.
   *
   * @memberOf module:F
   *
   * @param {object} params - position parameters
   * @param {string} [params.symbol] - symbol, defaults to default strategy symbol
   * @param {amount} params.amount - amount
   * @param {amount} [params.target] - price target at which to automatically
   *   close the position
   * @param {amount} [params.stop] - stop price at which to automatically close
   *   the position
   * @throws {Error} fails if a position is already open for the symbol and
   *   executing a backtest. Will only log an error during live execution.
   */
  f.openPosition = async ({
    symbol = getDefaultSymbol(strategy),
    amount,
    target,
    stop
  } = {}) => {
    const price = getLastPrice(strategy, symbol)

    if (!_isFinite(amount)) {
      return doError(`invalid amount: ${amount}`)
    } else if (!_isFinite(price)) {
      doError(`(open position) no price data available for ${symbol}`)
    }

    if (getPosition(strategy, symbol)) {
      return doError(`position already open for symbol: ${symbol}`)
    }

    if (!isBacktesting(strategy)) {
      throw new Error('live positions are WIP')
    }

    const positions = getPositions(strategy)
    const trade = generateTrade({ symbol, amount, price })
    const newPosition = generatePosition(trade, { target, stop })

    updateState(strategy, 'positions', positions.set(symbol, newPosition))
    addTrade(strategy, trade)
  }

  // TODO: generic order submit; requires WSv2 listeners for live exec + planning

  return f
}

module.exports = generateFunctions
