'use strict'

/**
 * Returns the price for the provided data point
 *
 * @memberOf modules:Utility
 *
 * @param {object} data - data point
 * @param {Trade} [data.trade] - trade data point
 * @param {Candle} [data.candle] - candle data point
 * @returns {number} price - -1 if no data available
 */
const priceForData = (data = {}) => {
  const { trade = {}, candle = {} } = data
  return trade.price || candle.close || -1
}

module.exports = priceForData
