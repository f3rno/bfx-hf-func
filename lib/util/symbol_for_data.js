'use strict'

/**
 * Returns the symbol for the provided data point
 *
 * @memberOf modules:Utility
 *
 * @param {object} data - data point
 * @param {Trade} [data.trade] - trade data point
 * @param {Candle} [data.candle] - candle data point
 * @returns {string} symbol - null if no data available
 */
const symbolForData = (data = {}) => {
  const { trade = {}, candle = {} } = data
  return trade.symbol || candle.symbol || null
}

module.exports = symbolForData
