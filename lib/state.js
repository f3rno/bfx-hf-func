'use strict'

const _isEmpty = require('lodash/isEmpty')
const { Map } = require('immutable')

require('./types/strategy')
require('./types/strategy_state')

/**
 * Key under which the HFF state is stored on a strategy instance.
 *
 * @see module:State.initState
 * @default hff
 * @private
 */
const STATE_KEY = 'hff'

/**
 * Create a new strategy state Map, for usage with the backtesting and live
 * execution functions.
 *
 * @memberOf module:State
 *
 * @param {object} params - parameters
 * @param {string} params.defaultSymbol - the default symbol to be used for
 * @param {boolean} [params.backtesting] - flag indicating if the strategy will
 *   undergo a backtest
 * @param {number} [params.backtestStart] - indicates the start of the interval
 *   when backtesting
 * @param {number} [params.backtestEnd] - indicates the end of the interval
 *   when backtesting
 *   order and position manipulation methods if none is explicity specified
 * @returns {StrategyState} state
 * @throws {Error} fails if no default symbol is provided
 */
const initState = ({
  backtestStart,
  backtestEnd,
  backtesting,
  defaultSymbol
} = {}) => {
  if (_isEmpty(defaultSymbol)) {
    throw new Error('default symbol required')
  }

  return Map({
    hasIndicators: false, // set in defineIndicators
    lastCandle: null,
    lastTrade: null,
    indicators: Map(),
    positions: Map(),
    defaultSymbol,
    backtestStart,
    backtestEnd,
    backtesting
  })
}

/**
 * Fetch the full state Map
 *
 * @memberOf module:State
 *
 * @param {Strategy} strategy - the strategy to query
 * @returns {StrategyState} state
 */
const getState = (strategy) => strategy[STATE_KEY]

/**
 * Overwrite the full state Map
 *
 * @memberOf module:State
 *
 * @param {Strategy} strategy - the strategy to modify
 * @param {StrategyState} newState - the Map to set as new state
 */
const setState = (strategy, newState) => {
  strategy[STATE_KEY] = newState
}

/**
 * Update a key on the strategy state.
 *
 * @memberOf module:State
 *
 * @param {Strategy} strategy - the strategy to query
 * @param {string} key - the key to set
 * @param {*} value - the value to set
 * @throws {Error} fails if the state has not yet been initialized
 */
const updateState = (strategy, key, value) => {
  const state = getState(strategy)

  if (state) {
    setState(strategy, state.set(key, value))
  } else {
    throw new Error('state not initialized, cannot update')
  }
}

/**
 * Query if the strategy has initialized indicators
 *
 * @memberOf module:State
 *
 * @param {Strategy} strategy - the strategy to query
 * @returns {boolean} hasIndicators
 */
const hasIndicators = (strategy = {}) => getState(strategy).get('hasIndicators')

/**
 * Get the indicator Map for the strategy. May be undefined if the indicators
 * have not yet been configured.
 *
 * @memberOf module:State
 *
 * @param {Strategy} strategy - the strategy to query
 * @returns {Map} indicators
 */
const getIndicators = (strategy = {}) => getState(strategy).get('indicators')

/**
 * Query the default symbol for the strategy
 *
 * @memberOf module:State
 *
 * @param {Strategy} strategy - the strategy to query
 * @returns {string} defaultSymbol
 */
const getDefaultSymbol = (strategy = {}) => getState(strategy).get('defaultSymbol')

/**
 * Get the positions Map for the strategy.
 *
 * @memberOf module:State
 *
 * @param {Strategy} strategy - the strategy to query
 * @returns {Map} positions
 */
const getPositions = (strategy = {}) => getState(strategy).get('positions')

/**
 * Query if the strategy is backtesting
 *
 * @memberOf module:State
 *
 * @param {Strategy} strategy - the strategy to query
 * @returns {boolean} isBacktesting
 */
const isBacktesting = (strategy = {}) => getState(strategy).get('backtesting')

/**
 * Utility methods for accessing strategy state
 *
 * @module State
 */
module.exports = {
  initState,
  getState,
  setState,
  updateState,
  hasIndicators,
  getIndicators,
  getDefaultSymbol,
  getPositions,
  isBacktesting
}
