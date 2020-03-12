'use strict'

/**
 * A linear dataset to be used for a backtest, containing candles from
 * potentially multiple markets. The candles are in raw-array format, and have
 * both symbol & time frame data attached.
 *
 * @typedef {object} BacktestData
 * @property {number} start - earliest timestamp
 * @property {number} end - latest timestamp
 * @property {number} tf - candle timeframe
 * @property {string[]} symbols - array of symbols represented in the dataset
 * @property {Array[]} data - array of raw candle data, with appended symbols
 */
