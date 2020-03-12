'use strict'

const _isEmpty = require('lodash/isEmpty')
const { Map, List } = require('immutable')
const { priceForData } = require('./util')

require('./types/position')
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
 * TODO: pull fee from RESTv2 if executing live
 *
 * @memberOf module:State
 *
 * @param {object} params - parameters
 * @param {string} params.defaultSymbol - the default symbol to be used for
 * @param {number} [params.feePerc] - account trading fee as percentage
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
  feePerc = 0.0002,
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
    lastCandles: Map(),
    lastTrades: Map(),
    indicators: Map(),
    positions: Map(),
    historicalPositions: Map(), // <symbol>: List()
    trades: List(),
    defaultSymbol,
    backtestPendingOrders: Map(), // <symbol>: List()
    backtestStart,
    backtestEnd,
    backtesting,
    feePerc
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
 * Get the a position by symbol for the strategy
 *
 * @memberOf module:State
 *
 * @param {Strategy} strategy - the strategy to query
 * @param {string} [symbol] - defaults to strategy default symbol
 * @returns {Map} positions
 */
const getPosition = (strategy = {}, symbol) => (
  getState(strategy).get('positions').get(symbol || getDefaultSymbol(strategy))
)

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
 * Add a trade to the strategy trades list
 *
 * @memberOf module:State
 *
 * @param {Strategy} strategy - strategy to modify
 * @param {Trade} trade - new trade
 */
const addTrade = (strategy = {}, trade) => {
  const trades = getState(strategy).get('trades')
  updateState(strategy, 'trades', trades.push(trade))
}

/**
 * Query the most recently received price data point (trade or candle)
 *
 * @memberOf module:State
 *
 * @param {Strategy} strategy - strategy
 * @param {string} [symbol] - defaults to default strategy symbol
 * @returns {number} lastPrice - -1 if no data has been received
 */
const getLastPrice = (strategy = {}, symbol) => {
  const state = getState(strategy)
  const defaultSymbol = getDefaultSymbol(strategy)
  const lastTrade = state.get('lastTrades').get(symbol || defaultSymbol)
  const lastCandle = state.get('lastCandles').get(symbol || defaultSymbol)

  return priceForData({ trade: lastTrade, candle: lastCandle })
}

/**
 * Update the last received candle for the specified symbol
 *
 * @memberOf module:State
 *
 * @param {Strategy} strategy - strategy
 * @param {Candle} candle - last received candle
 * @param {string} symbol - symbol the candle was received for
 */
const setLastCandle = (strategy = {}, candle, symbol) => {
  const lastCandles = getState(strategy).get('lastCandles')
  updateState(strategy, 'lastCandles', lastCandles.set(symbol, candle))
}

/**
 * Update the last received trade for the specified symbol
 *
 * @memberOf module:State
 *
 * @param {Strategy} strategy - strategy
 * @param {Candle} trade - last received trade
 * @param {string} symbol - symbol the trade was received for
 */
const setLastTrade = (strategy = {}, trade, symbol) => {
  const lastTrades = getState(strategy).get('lastTrades')
  updateState(strategy, 'lastTrades', lastTrades.set(symbol, trade))
}

/**
 * Add a position that has been closed to the historical positions list for
 * results tracking
 *
 * @memberOf module:State
 *
 * @param {Strategy} strategy - strategy
 * @param {Position} position - closed position
 */
const addHistoricalPosition = (strategy = {}, position) => {
  const historicalPositions = getState(strategy).get('historicalPositions')
  updateState(strategy, 'historicalPositions', historicalPositions.push(position))
}

/**
 * Saves a set of order parameters on the pending backtest order list, to be
 * simulated when the last received price meets or passes the order price.
 *
 * @memberOf module:State
 *
 * @param {Strategy} strategy - strategy
 * @param {OrderParameters} orderParams - order parameters
 */
const addPendingBacktestOrder = (strategy = {}, orderParams) => {
  const { symbol } = orderParams
  const pendingOrders = getState(strategy).get('backtestPendingOrders')

  updateState(strategy, 'backtestPendingOrders', pendingOrders.set(symbol, (
    (pendingOrders.get(symbol) || List()).push(orderParams)
  )))
}

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
  getPosition,
  isBacktesting,
  addTrade,
  getLastPrice,
  setLastTrade,
  setLastCandle,
  addHistoricalPosition,
  addPendingBacktestOrder
}
