'use strict'

// TODO: Doc
const priceForData = (data = {}) => {
  const { trade = {}, candle = {} } = data
  return trade.price || candle.close
}

module.exports = priceForData
