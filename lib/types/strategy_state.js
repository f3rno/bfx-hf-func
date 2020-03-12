'use strict'

/**
 * An immutable Map storing information used during backtests and live
 * execution. It should be accessed via the methods in {@link module:State} to
 * prevent corruption.
 *
 * @typedef StrategyState
 * @property {string} defaultSymbol - used for position/order methods if no
 *   explicity symbol is specified
 * @property {boolean} hasIndicators - flag indicating if
 *   {@link module:Indicators.defineIndicators} has been called, and the
 *   internal indicator Map populated.
 * @property {Map} indicators - immutable Map of indicators key'ed by ID
 * @property {Map} positions - immutable Map of positions key'ed by symbol
 * @property {Map} historicalPositions - immutable Map containing Lists of
 *   historical (closed) positions key'ed by symbol
 * @property {List} trades - all trades executed by the strategy
 * @property {Candle} lastCandle - last processed candle
 * @property {Trade} lastTrade - last processed trade
 * @property {boolean} backtesting - flag indicating if the strategy is
 * @property {number} backtestStart - start of backtesting period
 * @property {number} backtestEnd - end of backtesting period
 *   undergoing a backtest.
 * @property {string} tf - timeframe the strategy
 */
