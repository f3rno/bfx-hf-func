'use strict'

/**
 * Parameters for a backtest, including the strategy to be tested and the
 * datasets.
 *
 * @typedef {object} BacktestParameters
 * @property {Function} strategy - the functional strategy to be backtested
 * @property {string} defaultSymbol - the symbol used in position/order methods
 *   if none is specified.
 * @property {object} datasets - arrays of Candle models key'ed by market key
 */
