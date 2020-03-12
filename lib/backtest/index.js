'use strict'

const backtest = require('./backtest')
const logResults = require('./log_results')
const prepareData = require('./prepare_data')

/**
 * Functions for backtesting a strategy instance.
 *
 * @module Backtest
 */
module.exports = {
  backtest,
  logResults,
  prepareData
}
