'use strict'

const { getState } = require('../state')
const { updateIndicators } = require('../indicators')
const execStrategyStepWithBreak = require('./exec_strategy_step_with_break')
const { processPositions } = require('../positions')

require('../types/strategy')
require('../types/candle')
require('../types/trade')
require('../types/f')

const priceForData = (data = {}) => {
  const { trade = {}, candle = {} } = data
  return trade.price || candle.close
}

/**
 * Executes a strategy for a single step with a data point, catching any break
 * errors to halt execution early. Handles indicator initialization.
 *
 * @memberOf module:Execution
 * @see module:Execution.execStrategyStepWithBreak
 *
 * @param {Strategy} strategy - the functional strategy to execute
 * @param {F} f - configured helpers for the strategy
 * @param {object} data - data point to update the strategy with
 * @param {Candle} [data.candle] - candle data point
 * @param {Trade} [data.trade] - trade data point
 */
const execStrategyStep = async (strategy, f, data = {}) => {
  const hffState = getState(strategy)
  const { hasIndicators } = hffState
  let strategyExecutedForStep = false

  // If there are no indicators, execute the strategy immediately to give it
  // a chance to define them. defineIndicators() halts execution via an Error,
  // which is caught here and ignored.
  if (!hasIndicators) {
    strategyExecutedForStep = await execStrategyStepWithBreak(strategy, f, data)
  }

  await updateIndicators(strategy, data)
  await processPositions(strategy, priceForData(data)) // handle stop/target

  // If the strategy had no indicators, it was given a chance to set them up
  // with an early exec call. If it did, it halted execution early, so we need
  // to re-exec here.
  if (!strategyExecutedForStep) {
    await execStrategyStepWithBreak(strategy, f, data)
  }
}

module.exports = execStrategyStep
