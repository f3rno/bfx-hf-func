'use strict'

const debug = require('debug')('bfx:hf:func:backtest:prepare-data')
const { TIME_FRAME_WIDTHS } = require('bfx-hf-util')
const { Candle } = require('bfx-api-node-models')
const _isEmpty = require('lodash/isEmpty')
const _min = require('lodash/min')
const _max = require('lodash/max')

require('../types/backtest_data')

/**
 * Merges and sorts the provided datasets for a linear backtest. Expects them
 * all to use the same timeframe.
 *
 * @memberOf module:Backtest
 * @throws {Error} if the backtest uses an uknown timeframe
 * @private
 *
 * @param {object} datasets - key'ed by symbol
 * @returns {BacktestData} data
 */
const prepareData = (datasets) => {
  const symbols = Object.keys(datasets)

  if (_isEmpty(symbols)) {
    throw new Error('tried to run backtest with no markets')
  }

  const data = []
  let tf

  symbols.forEach((symbol, i) => {
    const dataset = datasets[symbol]

    debug('using %d candles for market %s', dataset.length, symbol)

    // Calc tf from first candle pair seperation
    if (i === 0) {
      const tfWidth = dataset[1][0] - dataset[0][0]
      tf = Object.keys(TIME_FRAME_WIDTHS).find((tf) => (
        TIME_FRAME_WIDTHS[tf] === tfWidth
      ))

      if (!tf) {
        throw new Error(`dataset uses unknown candle width: ${tfWidth}`)
      }
    }

    // Merge datasets so we can iterate over them together
    data.push(...dataset.map((arrayCandle) => {
      const candle = new Candle(arrayCandle)

      candle.symbol = symbol
      candle.tf = tf

      return candle
    }))
  })

  data.sort((a, b) => a.mts - b.mts)

  return {
    start: _min(data.map(c => c.mts)),
    end: _max(data.map(c => c.mts)),
    symbols,
    data
  }
}

module.exports = prepareData
