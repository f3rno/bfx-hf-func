'use strict'

const debug = require('debug')('bfx:hf:func:backtest')

const prepareData = require('./prepare_data')
const { generateFunctions } = require('../f')
const { initState, updateState } = require('../state')
const { execStrategyStep } = require('../exec')

require('../types/backtest_parameters')

/**
 * Execute a backtest on a strategy using one or more datasets.
 *
 * @memberOf module:Backtest
 * @example
 * const strategy = async (f, data) => {
 *   // ...
 * }
 *
 * await HFF.backtest({
 *   strategy,
 *   defaultSymbol: 'tLEOUSD',
 *   datasets: {
 *     tLEOUSD: data['trade:1m:tLEOUSD']
 *   }
 * })
 *
 * @param {BacktestParameters} params - backtest parameters
 * @returns {Promise} p
 */
const backtest = async ({ strategy, defaultSymbol, datasets } = {}) => {
  const symbols = Object.keys(datasets)

  debug('running backtest on markets %s', symbols.join(', '))

  const { start, end, data } = prepareData(datasets)
  const f = generateFunctions(strategy)

  strategy.hff = initState({
    backtesting: true,
    backtestStart: start,
    backtestEnd: end,
    defaultSymbol
  })

  debug(
    'backtest range: %s -> %s',
    new Date(start).toLocaleString(), new Date(end).toLocaleString()
  )

  let i = 0
  let candle

  while (i < data.length) {
    await execStrategyStep(strategy, f, {
      candle: data[i]
    })

    await updateState(strategy, 'lastCandle', candle)

    i += 1
  }

  debug('backtested strategy for %d ticks', i)
}

module.exports = backtest
