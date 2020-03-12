'use strict'

const debug = require('debug')('bfx:hf:func:exec:strategy-with-break')
const BreakExecutionStepError = require('../errors/break_execution_step_error')

require('../types/f')

/**
 * Executes a strategy function while catching any break errors, allowing
 * execution to be halted early.
 *
 * @memberOf module:Execution
 * @throws {Error} any non-break error caught during execution is thrown
 * @private
 *
 * @param {Function} strategy - the strategy to execute
 * @param {F} f - the helper configured for the strategy
 * @param {object} data - incoming data point that triggered update
 * @param {Trade} [data.trade] - potential trade data point
 * @param {Candle} [data.candle] - potential candle data point
 * @returns {boolean} completed - flag indicating if execution completed fully
 */
const execStrategyStepWithBreak = async (strategy, f, data) => {
  try {
    await strategy(f, data)
    return true
  } catch (err) {
    if (!(err instanceof BreakExecutionStepError)) {
      throw err // not what we were expecting
    } else {
      debug('(no indicators) exec break: %s', err.message)
    }
  }

  return false
}

module.exports = execStrategyStepWithBreak
